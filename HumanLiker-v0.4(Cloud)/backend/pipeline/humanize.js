// Title: Humanization Pipeline v0.4.1
// Description: Multi-stage local-only text humanization engine with enhanced detection loop.

import { logPipelineStep } from './logging.js';
import { selectPersona, getLanguageMarkers, selectEngineMode } from '../config/humanizerConfig.js';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function detectLanguage(text) {
  // Simple heuristic: check for CJK characters
  const cjkRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;
  if (cjkRegex.test(text)) {
    return 'zh-Hans';
  }
  return 'en';
}

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function getRandomElement(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomChoice(probability) {
  return Math.random() < probability;
}

// ============================================================================
// TOKENIZATION (LANGUAGE-AWARE)
// ============================================================================

function tokenizeText(text, language, languageMarkers) {
  if (!text) return [];
  
  // For Chinese languages: special tokenization
  if (language === 'zh-Hans' || language === 'zh-Hant') {
    // Remove Chinese and Western punctuation
    let cleaned = text.replace(/[，。！？、；：""''（）【】《》\s,.!?;:()\[\]<>'"]+/g, ' ');
    cleaned = cleaned.trim();
    
    if (!cleaned) return [];
    
    // Split into characters
    const chars = Array.from(cleaned).filter(c => c.trim().length > 0);
    
    // Group into 2-character chunks (approximating words)
    const tokens = [];
    for (let i = 0; i < chars.length; i += 2) {
      if (i + 1 < chars.length) {
        tokens.push(chars[i] + chars[i + 1]);
      } else {
        tokens.push(chars[i]);
      }
    }
    
    return tokens.filter(t => t.length > 0);
  }
  
  // For whitespace-based languages
  const tokens = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(t => t.length > 0);
  
  return tokens;
}

function calculateLexicalVariety(text, language, languageMarkers) {
  const tokens = tokenizeText(text, language, languageMarkers);
  if (tokens.length === 0) return 0;
  
  const uniqueTokens = new Set(tokens);
  return uniqueTokens.size / tokens.length;
}

function extractKeywords(text, language, languageMarkers) {
  const tokens = tokenizeText(text, language, languageMarkers);
  const stopTokens = new Set(languageMarkers.commonStopTokens || []);
  
  // Filter out stop tokens
  const keywords = tokens.filter(t => {
    // For Chinese: keep tokens that are at least 2 chars or not in stop list
    if (language === 'zh-Hans' || language === 'zh-Hant') {
      return t.length >= 2 || !stopTokens.has(t);
    }
    // For other languages: keep tokens that are at least 3 chars and not stop words
    return t.length >= 3 && !stopTokens.has(t.toLowerCase());
  });
  
  return new Set(keywords);
}

function calculateSemanticShift(originalText, outputText, language, languageMarkers) {
  const inputKeywords = extractKeywords(originalText, language, languageMarkers);
  const outputKeywords = extractKeywords(outputText, language, languageMarkers);
  
  if (inputKeywords.size === 0 && outputKeywords.size === 0) return 0;
  if (inputKeywords.size === 0 || outputKeywords.size === 0) return 0.5;
  
  // Jaccard similarity
  const intersection = new Set([...inputKeywords].filter(x => outputKeywords.has(x)));
  const union = new Set([...inputKeywords, ...outputKeywords]);
  
  const similarity = intersection.size / union.size;
  const shift = 1 - similarity;
  
  // Clamp to [0, 1]
  return Math.max(0, Math.min(1, shift));
}

// ============================================================================
// SENTENCE PROCESSING
// ============================================================================

function splitIntoSentences(text, language, languageMarkers) {
  const enders = languageMarkers.sentenceEnders;
  
  // Build regex pattern for sentence splitting
  const enderPattern = enders.map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('');
  const pattern = new RegExp(`[^${enderPattern}]+[${enderPattern}]+`, 'g');
  
  const matches = text.match(pattern);
  if (!matches || matches.length === 0) {
    // Fallback
    return [text.trim()].filter(s => s.length > 0);
  }
  
  return matches.map(s => s.trim()).filter(s => s.length > 0);
}

function calculateSentenceLengthVariance(text, language, languageMarkers) {
  const sentences = splitIntoSentences(text, language, languageMarkers);
  if (sentences.length < 2) return 0;
  
  const lengths = sentences.map(s => s.length);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) / lengths.length;
  
  return Math.sqrt(variance);
}

function extractCoreIdea(sentence, languageMarkers) {
  let core = sentence.trim();
  
  // Remove leading hedges
  for (const hedge of languageMarkers.hedges) {
    const regex = new RegExp(`^${hedge}\\s*,?\\s*`, 'i');
    core = core.replace(regex, '');
  }
  
  // Remove leading connectors
  for (const conn of languageMarkers.connectors) {
    const regex = new RegExp(`^${conn}\\s*,?\\s*`, 'i');
    core = core.replace(regex, '');
  }
  
  // Remove sentence enders
  const enderPattern = languageMarkers.sentenceEnders.map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  core = core.replace(new RegExp(`(${enderPattern})+$`), '').trim();
  
  return core || sentence;
}

// ============================================================================
// IMPERFECTION SCORING
// ============================================================================

function calculateImperfectScore(text, language, languageMarkers, personaProfile) {
  let score = 0;
  const lowerText = text.toLowerCase();
  
  // Check for hedges
  let hedgeCount = 0;
  for (const hedge of languageMarkers.hedges) {
    if (lowerText.includes(hedge.toLowerCase())) {
      hedgeCount++;
    }
  }
  
  // Check for self-corrections
  let correctionCount = 0;
  for (const correction of languageMarkers.selfCorrections) {
    if (lowerText.includes(correction.toLowerCase())) {
      correctionCount++;
    }
  }
  
  // Check for emotional markers
  let emotionCount = 0;
  for (const emotion of languageMarkers.emotional) {
    if (lowerText.includes(emotion.toLowerCase())) {
      emotionCount++;
    }
  }
  
  // Normalize counts
  const sentences = splitIntoSentences(text, language, languageMarkers);
  const sentenceCount = Math.max(1, sentences.length);
  
  const hedgeDensity = hedgeCount / sentenceCount;
  const correctionDensity = correctionCount / sentenceCount;
  const emotionDensity = emotionCount / sentenceCount;
  
  // Score based on persona expectations
  const hedgeScore = Math.min(1, hedgeDensity / Math.max(0.01, personaProfile.hedgeDensity));
  const correctionScore = Math.min(1, correctionDensity / Math.max(0.01, personaProfile.selfCorrectionDensity));
  const emotionScore = Math.min(1, emotionDensity / Math.max(0.01, personaProfile.emotionalMarkerDensity));
  
  // Weighted average
  score = (hedgeScore * 0.4 + correctionScore * 0.3 + emotionScore * 0.3);
  
  return Math.max(0, Math.min(1, score));
}

// ============================================================================
// PIPELINE STAGES
// ============================================================================

function preprocess(text, language) {
  const normalized = normalizeWhitespace(text);
  const detectedLang = language || detectLanguage(normalized);
  const languageMarkers = getLanguageMarkers(detectedLang);
  const sentences = splitIntoSentences(normalized, detectedLang, languageMarkers);
  
  return {
    normalized,
    language: detectedLang,
    languageMarkers,
    sentences
  };
}

function extractSemanticSkeleton(sentences, languageMarkers) {
  return sentences.map(sentence => ({
    original: sentence,
    core: extractCoreIdea(sentence, languageMarkers)
  }));
}

function applyPersonaShaping(segments, personaProfile, language, languageMarkers, variant = 'conservative') {
  const reshaped = [];
  
  const variantMultiplier = {
    'conservative': 1.0,
    'messy': 1.4,
    'medium': 1.2
  }[variant] || 1.0;
  
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    let sentence = seg.core;
    
    // Add hedge
    if (randomChoice(personaProfile.hedgeDensity * variantMultiplier)) {
      const hedge = getRandomElement(languageMarkers.hedges);
      sentence = `${hedge}, ${sentence}`;
    }
    
    // Add connector (if not first)
    if (i > 0 && randomChoice(personaProfile.connectorDensity)) {
      const connector = getRandomElement(languageMarkers.connectors);
      sentence = `${connector}, ${sentence}`;
    }
    
    // Add self-correction
    if (randomChoice(personaProfile.selfCorrectionDensity * variantMultiplier)) {
      const correction = getRandomElement(languageMarkers.selfCorrections);
      sentence = `${sentence} — ${correction}, ${seg.core}`;
    }
    
    // Add emotional marker
    if (randomChoice(personaProfile.emotionalMarkerDensity * variantMultiplier)) {
      const emotion = getRandomElement(languageMarkers.emotional);
      sentence = `${sentence}, ${emotion}`;
    }
    
    reshaped.push(sentence);
  }
  
  return reshaped.join(' ');
}

function generateCandidates(segments, personaProfile, language, languageMarkers) {
  const candidates = [];
  
  // Candidate A: Conservative
  candidates.push({
    text: applyPersonaShaping(segments, personaProfile, language, languageMarkers, 'conservative'),
    variant: 'conservative'
  });
  
  // Candidate B: Messy
  candidates.push({
    text: applyPersonaShaping(segments, personaProfile, language, languageMarkers, 'messy'),
    variant: 'messy'
  });
  
  // Candidate C: Medium (if enough segments)
  if (segments.length > 2) {
    candidates.push({
      text: applyPersonaShaping(segments, personaProfile, language, languageMarkers, 'medium'),
      variant: 'medium'
    });
  }
  
  return candidates;
}

// ============================================================================
// SCORING
// ============================================================================

function scoreCandidate(candidateText, originalText, personaProfile, language, languageMarkers, modeConfig) {
  // 1. HumanScore (0-100)
  const lengthVariance = calculateSentenceLengthVariance(candidateText, language, languageMarkers);
  const lexicalVariety = calculateLexicalVariety(candidateText, language, languageMarkers);
  const imperfectScore = calculateImperfectScore(candidateText, language, languageMarkers, personaProfile);
  
  const humanScore = Math.min(100,
    30 + // base
    Math.min(30, lengthVariance * 2) + // variance bonus
    Math.min(25, lexicalVariety * 50) + // variety bonus
    Math.min(15, imperfectScore * 50) // imperfection bonus
  );
  
  // 2. PersonaFidelity (0-1)
  const sentences = splitIntoSentences(candidateText, language, languageMarkers);
  const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / Math.max(1, sentences.length);
  const targetLength = personaProfile.sentenceLength.preferred[0];
  const lengthMatch = 1 - Math.min(1, Math.abs(avgLength - targetLength) / Math.max(1, targetLength));
  
  const hedgeCount = languageMarkers.hedges.filter(h =>
    candidateText.toLowerCase().includes(h.toLowerCase())
  ).length;
  const expectedHedges = Math.ceil(sentences.length * personaProfile.hedgeDensity);
  const hedgeMatch = Math.min(1, hedgeCount / Math.max(1, expectedHedges));
  
  const personaFidelity = lengthMatch * 0.6 + hedgeMatch * 0.4;
  
  // 3. RiskScore (0-100, lower is better)
  const uniformity = 1 - (lengthVariance / 20);
  const repetitionRisk = 1 - lexicalVariety;
  const riskScore = Math.min(100, uniformity * 50 + repetitionRisk * 50);
  
  // 4. SemanticShift (0-1, lower is better)
  const semanticShift = calculateSemanticShift(originalText, candidateText, language, languageMarkers);
  
  // 5. FinalScore
  const humanNorm = humanScore / 100;
  const riskNorm = riskScore / 100;
  const finalScore =
    0.40 * humanNorm +
    0.30 * personaFidelity +
    0.20 * (1 - riskNorm) +
    0.10 * (1 - semanticShift);
  
  return {
    text: candidateText,
    humanScore,
    personaFidelity,
    riskScore,
    semanticShift,
    finalScore
  };
}

function selectBestCandidate(candidates) {
  let best = null;
  let bestScore = -Infinity;
  
  for (const candidate of candidates) {
    if (candidate.finalScore > bestScore) {
      bestScore = candidate.finalScore;
      best = candidate;
    } else if (candidate.finalScore === bestScore) {
      // Tie-breaking: prefer lower risk, then higher persona fidelity
      if (candidate.riskScore < best.riskScore ||
          (candidate.riskScore === best.riskScore && candidate.personaFidelity > best.personaFidelity)) {
        best = candidate;
      }
    }
  }
  
  return best;
}

// ============================================================================
// DETECTION LOOP WITH MODE/PERSONA AWARENESS
// ============================================================================

function deformCandidateForRiskAndShift(candidate, personaProfile, languageMarkers, modeConfig, language) {
  const aggressiveness = modeConfig.deformationAggressiveness;
  
  // Re-split into sentences
  let sentences = splitIntoSentences(candidate.text, language, languageMarkers);
  const deformed = [];
  
  for (let i = 0; i < sentences.length; i++) {
    let sentence = sentences[i];
    
    // Randomly merge sentences
    if (i < sentences.length - 1 && randomChoice(0.15 * aggressiveness)) {
      sentence = `${sentence} ${sentences[i + 1]}`;
      i++;
    }
    
    // Split long sentences
    if (sentence.length > 50 && randomChoice(0.25 * aggressiveness)) {
      const mid = Math.floor(sentence.length / 2);
      const splitPoint = sentence.lastIndexOf(' ', mid);
      if (splitPoint > 0) {
        deformed.push(sentence.substring(0, splitPoint));
        sentence = sentence.substring(splitPoint + 1);
      }
    }
    
    // Add more hedges
    if (randomChoice(personaProfile.hedgeDensity * 1.5 * aggressiveness)) {
      const hedge = getRandomElement(languageMarkers.hedges);
      sentence = `${hedge}, ${sentence}`;
    }
    
    // Add more self-corrections
    if (randomChoice(personaProfile.selfCorrectionDensity * 1.5 * aggressiveness)) {
      const correction = getRandomElement(languageMarkers.selfCorrections);
      const words = sentence.split(/\s+/).slice(0, 3).join(' ');
      sentence = `${sentence} — ${correction}, ${words}`;
    }
    
    // Add emotional markers
    if (randomChoice(personaProfile.emotionalMarkerDensity * 1.3 * aggressiveness)) {
      const emotion = getRandomElement(languageMarkers.emotional);
      sentence = `${sentence}, ${emotion}`;
    }
    
    deformed.push(sentence);
  }
  
  return {
    text: deformed.join(' '),
    variant: candidate.variant + '_deformed'
  };
}

async function runDetectionLoop(segments, personaProfile, language, languageMarkers, originalText, modeConfig, db, requestId, traceId, stepOrderRef) {
  // Derive local thresholds from mode and persona
  const localTargetRisk = Math.min(modeConfig.globalTargetRisk, personaProfile.targetRisk);
  const localMaxSemanticShift = Math.min(modeConfig.globalMaxSemanticShift, personaProfile.maxSemanticShift);
  const maxLoops = modeConfig.maxDetectionLoops;
  
  let candidates = generateCandidates(segments, personaProfile, language, languageMarkers);
  let loop = 0;
  let bestSnapshot = null;
  let bestFinalScore = -Infinity;
  
  while (loop < maxLoops) {
    loop++;
    
    // Score all candidates
    const scored = candidates.map(c =>
      scoreCandidate(c.text, originalText, personaProfile, language, languageMarkers, modeConfig)
    );
    
    // Find best for this iteration
    const bestForLoop = selectBestCandidate(scored);
    
    // Track global best
    if (bestForLoop.finalScore > bestFinalScore) {
      bestFinalScore = bestForLoop.finalScore;
      bestSnapshot = bestForLoop;
    }
    
    // Check convergence
    const allUnderRisk = scored.every(c => c.riskScore <= localTargetRisk);
    const allUnderShift = scored.every(c => c.semanticShift <= localMaxSemanticShift);
    const converged = allUnderRisk && allUnderShift;
    
    // Log this loop
    const stepOrder = stepOrderRef.value++;
    if (db && requestId) {
      logPipelineStep(db, requestId, stepOrder, 'detection_loop', true, {
        iteration: loop,
        candidateCount: scored.length,
        bestHumanScore: bestForLoop.humanScore,
        bestRiskScore: bestForLoop.riskScore,
        bestSemanticShift: bestForLoop.semanticShift,
        converged
      }, traceId);
    }
    
    // Early exit if converged
    if (converged) {
      break;
    }
    
    // Deform high-risk/high-shift candidates
    candidates = scored.map(c => {
      if (c.riskScore <= localTargetRisk && c.semanticShift <= localMaxSemanticShift) {
        return c;
      }
      return deformCandidateForRiskAndShift(c, personaProfile, languageMarkers, modeConfig, language);
    });
  }
  
  return bestSnapshot || selectBestCandidate(candidates.map(c =>
    scoreCandidate(c.text, originalText, personaProfile, language, languageMarkers, modeConfig)
  ));
}

// ============================================================================
// MAIN PIPELINE FUNCTION
// ============================================================================

export async function runHumanizationPipeline({ text, language, personaKey, mode, requestId, db, traceId }) {
  const steps = [];
  let stepOrder = 1;
  
  try {
    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Invalid input text');
    }
    
    // Select mode (default: balanced)
    const modeConfig = selectEngineMode(mode || 'balanced');
    
    // Step 1: Preprocess
    const preprocessResult = preprocess(text, language || 'en');
    steps.push({ name: 'preprocess', ok: true });
    if (db && requestId) {
      logPipelineStep(db, requestId, stepOrder++, 'preprocess', true, {
        language: preprocessResult.language,
        sentenceCount: preprocessResult.sentences.length
      }, traceId);
    }
    
    // Step 2: Semantic skeleton extraction
    const segments = extractSemanticSkeleton(preprocessResult.sentences, preprocessResult.languageMarkers);
    steps.push({ name: 'skeleton', ok: true });
    if (db && requestId) {
      logPipelineStep(db, requestId, stepOrder++, 'skeleton', true, {
        segmentCount: segments.length
      }, traceId);
    }
    
    // Step 3: Persona selection
    const personaProfile = selectPersona(personaKey || 'casual_writer');
    steps.push({ name: 'persona', ok: true });
    if (db && requestId) {
      logPipelineStep(db, requestId, stepOrder++, 'persona', true, {
        personaKey: personaProfile.name,
        mode: modeConfig.name
      }, traceId);
    }
    
    // Step 4-N: Detection Loop
    const stepOrderRef = { value: stepOrder };
    const bestCandidate = await runDetectionLoop(
      segments,
      personaProfile,
      preprocessResult.language,
      preprocessResult.languageMarkers,
      text,
      modeConfig,
      db,
      requestId,
      traceId,
      stepOrderRef
    );
    stepOrder = stepOrderRef.value;
    
    steps.push({
      name: 'detection_loop',
      ok: true,
      meta: {
        finalHumanScore: bestCandidate.humanScore,
        finalRiskScore: bestCandidate.riskScore,
        finalSemanticShift: bestCandidate.semanticShift
      }
    });
    
    // Step Final: Return
    return {
      outputText: bestCandidate.text,
      humanScore: Math.round(bestCandidate.humanScore),
      personaFidelity: Math.round(bestCandidate.personaFidelity * 100) / 100,
      riskScore: Math.round(bestCandidate.riskScore),
      semanticShift: Math.round(bestCandidate.semanticShift * 1000) / 1000,
      steps
    };
    
  } catch (err) {
    // Log error step
    if (db && requestId) {
      logPipelineStep(db, requestId, stepOrder, 'pipeline_error', false, {
        error: err.message,
        stack: err.stack ? err.stack.substring(0, 500) : undefined
      }, traceId);
    }
    
    steps.push({
      name: 'error',
      ok: false,
      meta: {
        message: err.message,
        stack: err.stack ? err.stack.substring(0, 200) : undefined
      }
    });
    
    // Return fallback
    return {
      outputText: text,
      humanScore: 50,
      personaFidelity: 0.5,
      riskScore: 50,
      semanticShift: 0,
      steps
    };
  }
}
