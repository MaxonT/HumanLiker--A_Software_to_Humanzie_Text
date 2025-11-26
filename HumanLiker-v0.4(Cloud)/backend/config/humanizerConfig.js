// Title: HumanLiker Engine Configuration
// Description: Central config for personas, languages, and engine modes

// ============================================================================
// PERSONA PROFILES
// ============================================================================

export const PERSONA_PROFILES = {
  casual_writer: {
    name: 'casual_writer',
    sentenceLength: { min: 8, max: 35, preferred: [12, 18, 25] },
    hedgeDensity: 0.15,
    selfCorrectionDensity: 0.08,
    emotionalMarkerDensity: 0.12,
    connectorDensity: 0.20,
    metaphorIntensity: 0.10,
    rhythmVariation: 'high',
    targetRisk: 35,
    maxSemanticShift: 0.08
  },
  student: {
    name: 'student',
    sentenceLength: { min: 10, max: 30, preferred: [14, 20] },
    hedgeDensity: 0.10,
    selfCorrectionDensity: 0.05,
    emotionalMarkerDensity: 0.08,
    connectorDensity: 0.15,
    metaphorIntensity: 0.05,
    rhythmVariation: 'medium',
    targetRisk: 40,
    maxSemanticShift: 0.06
  },
  creator_influencer: {
    name: 'creator_influencer',
    sentenceLength: { min: 6, max: 40, preferred: [10, 18, 28] },
    hedgeDensity: 0.20,
    selfCorrectionDensity: 0.12,
    emotionalMarkerDensity: 0.25,
    connectorDensity: 0.25,
    metaphorIntensity: 0.20,
    rhythmVariation: 'very_high',
    targetRisk: 30,
    maxSemanticShift: 0.10
  },
  professional_editor: {
    name: 'professional_editor',
    sentenceLength: { min: 12, max: 32, preferred: [16, 22] },
    hedgeDensity: 0.05,
    selfCorrectionDensity: 0.02,
    emotionalMarkerDensity: 0.03,
    connectorDensity: 0.12,
    metaphorIntensity: 0.08,
    rhythmVariation: 'low',
    targetRisk: 45,
    maxSemanticShift: 0.05
  },
  introspective_thinker: {
    name: 'introspective_thinker',
    sentenceLength: { min: 15, max: 45, preferred: [20, 30, 8] },
    hedgeDensity: 0.18,
    selfCorrectionDensity: 0.15,
    emotionalMarkerDensity: 0.10,
    connectorDensity: 0.18,
    metaphorIntensity: 0.15,
    rhythmVariation: 'high',
    targetRisk: 38,
    maxSemanticShift: 0.07
  }
};

// ============================================================================
// LANGUAGE MARKERS
// ============================================================================

export const LANGUAGE_MARKERS = {
  en: {
    hedges: ['I think', 'I feel like', 'honestly', 'actually', 'kind of', 'sort of', 'maybe', 'perhaps', 'I guess', 'probably'],
    selfCorrections: ['actually', 'wait,', 'I mean', 'or rather', 'well,', 'hmm,', 'let me rephrase'],
    emotional: ['wow', 'oh', 'huh', 'interesting', 'fascinating', 'hmm', 'geez', 'man'],
    connectors: ['but', 'and', 'so', 'though', 'however', 'also', 'plus', 'besides', 'meanwhile'],
    sentenceEnders: ['.', '!', '?'],
    commonStopTokens: ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'from', 'by', 'about'],
    defaultSentenceLength: 18
  },
  'zh-Hans': {
    hedges: ['说实话', '老实讲', '我觉得', '可能', '也许', '大概', '感觉', '其实', '应该说', '我想'],
    selfCorrections: ['不对', '等等', '我是说', '或者说', '嗯', '那个', '怎么说呢', '不不不'],
    emotional: ['哇', '哦', '嗯', '有意思', '有趣', '哈', '天哪', '真的吗'],
    connectors: ['但是', '而且', '所以', '不过', '然而', '另外', '还有', '同时', '因此'],
    sentenceEnders: ['。', '！', '？'],
    commonStopTokens: ['的', '了', '在', '是', '我', '你', '他', '她', '它', '这', '那', '和', '与', '或', '但', '而', '也', '都', '就', '还', '又', '很', '最', '更', '只', '才', '已', '会', '能', '要', '可以', '应该', '必须', '有', '没', '到', '着', '过', '来', '去', '为', '从', '把', '被', '给'],
    defaultSentenceLength: 15
  },
  'zh-Hant': {
    hedges: ['說實話', '老實講', '我覺得', '可能', '也許', '大概', '感覺', '其實', '應該說', '我想'],
    selfCorrections: ['不對', '等等', '我是說', '或者說', '嗯', '那個', '怎麼說呢', '不不不'],
    emotional: ['哇', '哦', '嗯', '有意思', '有趣', '哈', '天哪', '真的嗎'],
    connectors: ['但是', '而且', '所以', '不過', '然而', '另外', '還有', '同時', '因此'],
    sentenceEnders: ['。', '！', '？'],
    commonStopTokens: ['的', '了', '在', '是', '我', '你', '他', '她', '它', '這', '那', '和', '與', '或', '但', '而', '也', '都', '就', '還', '又', '很', '最', '更', '只', '才', '已', '會', '能', '要', '可以', '應該', '必須', '有', '沒', '到', '著', '過', '來', '去', '為', '從', '把', '被', '給'],
    defaultSentenceLength: 15
  },
  es: {
    hedges: ['honestamente', 'creo que', 'siento que', 'tal vez', 'quizás', 'probablemente', 'realmente', 'supongo'],
    selfCorrections: ['espera', 'quiero decir', 'o mejor', 'bueno', 'eh', 'digo'],
    emotional: ['wow', 'oh', 'interesante', 'fascinante', 'hmm', 'vaya', 'dios mío'],
    connectors: ['pero', 'y', 'así que', 'aunque', 'sin embargo', 'también', 'además', 'mientras'],
    sentenceEnders: ['.', '!', '?'],
    commonStopTokens: ['el', 'la', 'los', 'las', 'un', 'una', 'es', 'son', 'de', 'del', 'en', 'por', 'para', 'con', 'sin', 'que', 'se', 'lo', 'al', 'como', 'más', 'pero', 'sus', 'le', 'ya', 'o', 'este', 'sí', 'mi', 'su'],
    defaultSentenceLength: 18
  },
  fr: {
    hedges: ['honnêtement', 'je pense que', 'je sens que', 'peut-être', 'probablement', 'vraiment', 'je suppose'],
    selfCorrections: ['attends', 'je veux dire', 'ou plutôt', 'eh bien', 'euh', 'enfin'],
    emotional: ['wow', 'oh', 'intéressant', 'fascinant', 'hmm', 'mon dieu', 'vraiment'],
    connectors: ['mais', 'et', 'donc', 'bien que', 'cependant', 'aussi', 'en plus', 'pendant'],
    sentenceEnders: ['.', '!', '?'],
    commonStopTokens: ['le', 'la', 'les', 'un', 'une', 'de', 'du', 'des', 'est', 'sont', 'dans', 'pour', 'par', 'avec', 'que', 'se', 'ce', 'au', 'plus', 'mais', 'ses', 'ou', 'et', 'si', 'mon', 'son'],
    defaultSentenceLength: 18
  }
};

// ============================================================================
// ENGINE MODES
// ============================================================================

export const ENGINE_MODES = {
  safe: {
    name: 'safe',
    globalTargetRisk: 45,
    globalMaxSemanticShift: 0.05,
    maxDetectionLoops: 3,
    deformationAggressiveness: 0.7
  },
  balanced: {
    name: 'balanced',
    globalTargetRisk: 38,
    globalMaxSemanticShift: 0.08,
    maxDetectionLoops: 3,
    deformationAggressiveness: 1.0
  },
  creative: {
    name: 'creative',
    globalTargetRisk: 30,
    globalMaxSemanticShift: 0.12,
    maxDetectionLoops: 2,
    deformationAggressiveness: 1.3
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function selectPersona(personaKey) {
  return PERSONA_PROFILES[personaKey] || PERSONA_PROFILES.casual_writer;
}

export function getLanguageMarkers(language) {
  return LANGUAGE_MARKERS[language] || LANGUAGE_MARKERS.en;
}

export function selectEngineMode(modeKey) {
  return ENGINE_MODES[modeKey] || ENGINE_MODES.balanced;
}

