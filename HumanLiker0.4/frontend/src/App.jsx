// Title: App shell with nav, auth, theme, language, cookie banner, and full-stack humanizer UI
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import logo from './assets/logo.svg'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5174'

const fallbackMeta = {
  languages: [
    { key: 'en' },
    { key: 'zh-Hans' },
    { key: 'es' },
    { key: 'fr' },
    { key: 'hi' }
  ],
  personas: [
    { key: 'casual_writer', rhythmVariation: 'high', targetRisk: 35 },
    { key: 'student', rhythmVariation: 'medium', targetRisk: 40 },
    { key: 'creator_influencer', rhythmVariation: 'very_high', targetRisk: 30 },
    { key: 'professional_editor', rhythmVariation: 'low', targetRisk: 45 }
  ],
  modes: [
    { key: 'safe', targetRisk: 45 },
    { key: 'balanced', targetRisk: 38 },
    { key: 'creative', targetRisk: 30 }
  ]
}

function useTheme() {
  const [theme, setTheme] = useState(localStorage.getItem('hl_theme') || 'system')
  useEffect(() => {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
    localStorage.setItem('hl_theme', theme)
    document.cookie = `hl_theme=${theme};path=/;max-age=31536000`
  }, [theme])
  return [theme, setTheme]
}

function CookieBanner() {
  const { t } = useTranslation()
  const [show, setShow] = useState(!document.cookie.includes('hl_cookie=1'))
  if (!show) return null
  return (
    <div className="cookie-banner card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <div>{t('cookieConsent')}</div>
          <a href="#/legal/cookies">{t('learnMore')}</a>
        </div>
        <button
          onClick={() => {
            document.cookie = 'hl_cookie=1;path=/;max-age=31536000'
            setShow(false)
          }}
        >
          {t('accept')}
        </button>
      </div>
    </div>
  )
}

const StatCard = ({ label, value, hint }) => (
  <div className="stat-card">
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {hint && <div className="stat-hint">{hint}</div>}
  </div>
)

const MetricBar = ({ label, value, color }) => (
  <div className="metric-bar">
    <div className="metric-row">
      <span>{label}</span>
      <span>{Math.round(value * 100)}%</span>
    </div>
    <div className="metric-rail">
      <div className="metric-fill" style={{ width: `${Math.min(100, value * 100)}%`, background: color }}></div>
    </div>
  </div>
)

const PersonaCard = ({ persona, active, onSelect }) => (
  <button className={`persona-card ${active ? 'active' : ''}`} onClick={() => onSelect(persona.key)}>
    <div className="row persona-header">
      <span className="badge">{persona.key.replace('_', ' ')}</span>
      <span className="pill">{persona.rhythmVariation || 'balanced rhythm'}</span>
    </div>
    <div className="persona-meta">
      <span>{persona.targetRisk ? `${persona.targetRisk}% risk target` : 'Feels natural'}</span>
      {persona.maxSemanticShift && <span>Shift ≤ {Math.round(persona.maxSemanticShift * 100)}%</span>}
    </div>
  </button>
)

export default function App() {
  const { t, i18n } = useTranslation()
  const [theme, setTheme] = useTheme()
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('home')
  const [meta, setMeta] = useState(fallbackMeta)
  const [history, setHistory] = useState([])

  const [input, setInput] = useState('Writing should breathe like a human. Give it a voice, a rhythm, and a pulse.')
  const [output, setOutput] = useState('')
  const [language, setLanguage] = useState('en')
  const [persona, setPersona] = useState('casual_writer')
  const [mode, setMode] = useState('balanced')
  const [metrics, setMetrics] = useState(null)
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const personaOptions = useMemo(() => meta.personas || [], [meta])

  async function fetchMeta() {
    try {
      const res = await fetch(`${API}/api/meta/options`)
      if (res.ok) {
        const data = await res.json()
        setMeta({
          languages: data.languages || fallbackMeta.languages,
          personas: data.personas || fallbackMeta.personas,
          modes: data.modes || fallbackMeta.modes
        })
      }
    } catch (_) {
      setMeta(fallbackMeta)
    }
  }

  async function fetchMe() {
    try {
      const res = await fetch(`${API}/api/auth/me`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }

  async function fetchHistory() {
    if (!user) return setHistory([])
    try {
      const res = await fetch(`${API}/api/v1/history`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setHistory(data.items || [])
      }
    } catch (_) {}
  }

  useEffect(() => { fetchMeta() }, [])
  useEffect(() => { fetchMe() }, [])
  useEffect(() => { fetchHistory() }, [user])

  function rewriteLocal(text) {
    const s = text
      .replace(/\s+/g, ' ')
      .replace(/\!+/g, '!')
      .replace(/\?+/g, '?')
    return s[0]?.toUpperCase() + s.slice(1)
  }

  async function humanizeText() {
    setLoading(true)
    setError('')
    setInsights([])
    try {
      const res = await fetch(`${API}/api/v1/humanize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: input, language, personaKey: persona, mode })
      })
      if (!res.ok) {
        throw new Error('Unable to reach the HumanLiker engine.')
      }
      const data = await res.json()
      const payload = data?.data
      setOutput(payload?.outputText || rewriteLocal(input))
      setMetrics({
        humanScore: payload?.humanScore ?? 0,
        personaFidelity: payload?.personaFidelity ?? 0,
        riskScore: payload?.riskScore ?? 0,
        semanticShift: payload?.semanticShift ?? 0
      })
      setInsights([
        `${t('insightPersona')} ${persona.replace('_', ' ')}`,
        `${t('insightMode')} ${mode}`,
        `${t('insightLanguage')} ${language}`
      ])
      fetchHistory()
    } catch (err) {
      setError(err.message || 'Something went wrong. Using local rewrite as fallback.')
      setOutput(rewriteLocal(input))
    } finally {
      setLoading(false)
    }
  }

  function Nav() {
    return (
      <nav>
        <div className="brand">
          <img src={logo} alt="logo" width="28" height="28" />
          <span>{t('appName')}</span>
          <span className="badge gradient">{t('tagline')}</span>
        </div>
        <div className="actions">
          <select className="lang-select" value={i18n.language} onChange={e => i18n.changeLanguage(e.target.value)}>
            {(meta.languages || fallbackMeta.languages).map(opt => (
              <option value={opt.key} key={opt.key}>{opt.key}</option>
            ))}
          </select>
          <select value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="system">{t('system')}</option>
            <option value="light">{t('light')}</option>
            <option value="dark">{t('dark')}</option>
          </select>
          {user ? (
            <>
              <span className="badge subtle">{user.subscriptionStatus === 'active' ? t('subActive') : t('subInactive')}</span>
              <button onClick={() => setPage('profile')}>{t('profile')}</button>
              <button
                onClick={async () => {
                  await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' })
                  setUser(null)
                }}
              >
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setPage('login')}>{t('login')}</button>
              <button className="ghost" onClick={() => setPage('signup')}>{t('signup')}</button>
            </>
          )}
        </div>
      </nav>
    )
  }

  function Hero() {
    return (
      <section className="hero">
        <div>
          <p className="eyebrow">{t('liveEngine')}</p>
          <h1>{t('heroTitle')}</h1>
          <p className="muted">{t('heroBody')}</p>
          <div className="row">
            <button onClick={() => setPage('home')}>{t('startHumanizing')}</button>
            <button className="ghost" onClick={() => setPage('signup')}>{t('ctaCreate')}</button>
          </div>
        </div>
        <div className="hero-grid">
          <StatCard label={t('statLatency')} value={t('statLatencyValue')} hint={t('statLatencyHint')} />
          <StatCard label={t('statLocal')} value={t('statLocalValue')} hint={t('statLocalHint')} />
          <StatCard label={t('statRisk')} value={t('statRiskValue')} hint={t('statRiskHint')} />
        </div>
      </section>
    )
  }

  function HistoryPanel() {
    if (!user) {
      return (
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <h3>{t('historyTitle')}</h3>
              <p className="muted">{t('historyGuest')}</p>
            </div>
            <button className="ghost" onClick={() => setPage('login')}>{t('login')}</button>
          </div>
        </div>
      )
    }

    return (
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h3>{t('historyTitle')}</h3>
          <span className="pill">{history.length} {t('entries')}</span>
        </div>
        <div className="history-list">
          {history.length === 0 && <p className="muted">{t('historyEmpty')}</p>}
          {history.map(item => (
            <div className="history-item" key={item.id}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div>
                  <p className="muted">{item.createdAt?.slice(0, 16)} · {item.language} · {item.persona}</p>
                  <p className="history-input">{item.inputText}</p>
                </div>
                <div className="history-metrics">
                  <span className="pill">{item.mode}</span>
                  <span className="pill">{Math.round((item.humanScore || 0) * 100)}% human</span>
                </div>
              </div>
              {item.outputText && <div className="history-output">{item.outputText}</div>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  function Subscription({ user }) {
    async function startCheckout() {
      const res = await fetch(`${API}/api/subscribe/create-checkout-session`, {
        method: 'POST',
        credentials: 'include'
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      if (data.mode === 'mock') window.location.hash = '#/subscribe/success'
    }
    return (
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <h3>{user?.subscriptionStatus === 'active' ? t('subActive') : t('subInactive')}</h3>
            <p className="muted">{t('subCopy')}</p>
          </div>
          <button onClick={startCheckout}>{t('subscribe')}</button>
        </div>
      </div>
    )
  }

  function Workbench() {
    return (
      <div className="card workbench">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <p className="eyebrow">{t('workbenchTitle')}</p>
            <h2>{t('workbenchHeadline')}</h2>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <select value={language} onChange={e => setLanguage(e.target.value)}>
              {(meta.languages || fallbackMeta.languages).map(opt => (
                <option key={opt.key} value={opt.key}>{opt.key}</option>
              ))}
            </select>
            <select value={mode} onChange={e => setMode(e.target.value)}>
              {(meta.modes || fallbackMeta.modes).map(opt => (
                <option key={opt.key} value={opt.key}>{opt.key}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="workbench-grid">
          <div>
            <label className="muted">{t('inputText')}</label>
            <textarea
              rows="7"
              className="text-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t('inputPlaceholder')}
            />
            <div className="persona-grid">
              {personaOptions.map(p => (
                <PersonaCard key={p.key} persona={p} active={persona === p.key} onSelect={setPersona} />
              ))}
            </div>
          </div>
          <div className="output-panel">
            <label className="muted">{t('outputText')}</label>
            <div className="output-card">
              {output ? <p>{output}</p> : <p className="muted">{t('outputPlaceholder')}</p>}
            </div>
            {metrics && (
              <div className="metrics">
                <MetricBar label={t('metricHuman')} value={metrics.humanScore || 0} color="#22c55e" />
                <MetricBar label={t('metricPersona')} value={metrics.personaFidelity || 0} color="#a855f7" />
                <MetricBar label={t('metricRisk')} value={(metrics.riskScore || 0) / 100} color="#f97316" />
                <MetricBar label={t('metricShift')} value={metrics.semanticShift || 0} color="#38bdf8" />
              </div>
            )}
          </div>
        </div>

        {error && <div className="alert">{error}</div>}

        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
            {insights.map((tip, idx) => (
              <span className="pill" key={idx}>{tip}</span>
            ))}
          </div>
          <div className="row" style={{ gap: 10 }}>
            <button className="ghost" onClick={() => setOutput(rewriteLocal(input))}>{t('rewriteLocal')}</button>
            <button onClick={humanizeText} disabled={loading}>
              {loading ? t('rewriting') : t('rewrite')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  function Footer() {
    return (
      <div className="footer container">
        <div className="notice">© 2025 HumanLiker v0.4</div>
        <div className="row">
          <a href="#/legal/privacy">{t('privacy')}</a>
          <a href="#/legal/terms">{t('terms')}</a>
          <a href="#/legal/cookies">{t('cookies')}</a>
        </div>
      </div>
    )
  }

  function Home() {
    return (
      <div className="container stack">
        <Hero />
        <div className="grid two-col">
          <Workbench />
          <div className="stack" style={{ gap: 16 }}>
            <Subscription user={user} />
            <HistoryPanel />
          </div>
        </div>
      </div>
    )
  }

  function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    return (
      <div className="container auth">
        <div className="card">
          <h2>{t('login')}</h2>
          <p className="muted">{t('loginCopy')}</p>
          <div className="row"><input placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="row"><input type="password" placeholder={t('password')} value={password} onChange={e => setPassword(e.target.value)} /></div>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <button onClick={async () => {
              const res = await fetch(`${API}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email, password }) })
              if (res.ok) { await fetchMe(); setPage('home') }
            }}>{t('login')}</button>
            <a onClick={() => setPage('signup')}>{t('noAccount')} {t('signup')}</a>
          </div>
        </div>
      </div>
    )
  }

  function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [warning, setWarning] = useState('')
    return (
      <div className="container auth">
        <div className="card">
          <h2>{t('signup')}</h2>
          <p className="muted">{t('signupCopy')}</p>
          <div className="row"><input placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="row"><input type="password" placeholder={t('password')} value={password} onChange={e => setPassword(e.target.value)} /></div>
          <div className="row"><input type="password" placeholder={t('confirmPassword')} value={confirm} onChange={e => setConfirm(e.target.value)} /></div>
          {warning && <div className="alert">{warning}</div>}
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <button onClick={async () => {
              if (password !== confirm) return setWarning(t('passwordMismatch'))
              const res = await fetch(`${API}/api/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email, password }) })
              if (res.ok) { await fetchMe(); setPage('home') }
            }}>{t('signup')}</button>
            <a onClick={() => setPage('login')}>{t('haveAccount')} {t('login')}</a>
          </div>
        </div>
      </div>
    )
  }

  function Profile() {
    if (!user) return <div className="container"><div className="card">Not logged in.</div></div>
    return (
      <div className="container stack">
        <div className="card">
          <h2>{t('profile')}</h2>
          <div className="muted">{user.email}</div>
          <div className="spacer"></div>
          <Subscription user={user} />
        </div>
        <HistoryPanel />
      </div>
    )
  }

  function Legal({ which }) {
    const map = { privacy: 'privacy', terms: 'terms', cookies: 'cookies' }
    return (
      <div className="container">
        <div className="card">
          <h2>{t(map[which])}</h2>
          <p className="notice">v0.3 · Updated 2025-10-29</p>
          <p>HumanLiker stores essential cookies for auth, theme, and language; see backend /api/legal/* for JSON.</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    function onHashChange() {
      const h = window.location.hash || '#/'
      if (h.startsWith('#/login')) setPage('login')
      else if (h.startsWith('#/signup')) setPage('signup')
      else if (h.startsWith('#/profile')) setPage('profile')
      else if (h.startsWith('#/legal/privacy')) setPage('privacy')
      else if (h.startsWith('#/legal/terms')) setPage('terms')
      else if (h.startsWith('#/legal/cookies')) setPage('cookies')
      else if (h.startsWith('#/subscribe/success')) { fetchMe(); setPage('home') }
      else setPage('home')
    }
    window.addEventListener('hashchange', onHashChange)
    onHashChange()
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <>
      <Nav />
      {page === 'home' && <Home />}
      {page === 'login' && <Login />}
      {page === 'signup' && <Signup />}
      {page === 'profile' && <Profile />}
      {page === 'privacy' && <Legal which="privacy" />}
      {page === 'terms' && <Legal which="terms" />}
      {page === 'cookies' && <Legal which="cookies" />}
      <Footer />
      <CookieBanner />
    </>
  )
}
