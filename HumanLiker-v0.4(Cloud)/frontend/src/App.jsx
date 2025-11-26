// Title: App shell with nav, auth, theme, language, cookie banner
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import logo from './assets/logo.svg'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5174'

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
      <div className="row" style={{justifyContent:'space-between'}}>
        <div>
          <div>{t('cookieConsent')}</div>
          <a href="#/legal/cookies">{t('learnMore')}</a>
        </div>
        <button onClick={() => { document.cookie = 'hl_cookie=1;path=/;max-age=31536000'; setShow(false) }}>{t('accept')}</button>
      </div>
    </div>
  )
}

export default function App() {
  const { t, i18n } = useTranslation()
  const [theme, setTheme] = useTheme()
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('home')

  async function fetchMe() {
    try {
      const res = await fetch(`${API}/api/auth/me`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {}
  }

  useEffect(() => { fetchMe() }, [])

  function Nav() {
    return (
      <nav>
        <div className="brand">
          <img src={logo} alt="logo" width="28" height="28"/>
          <span>{t('appName')}</span>
          <span className="badge">{t('tagline')}</span>
        </div>
        <div className="actions">
          <select className="lang-select" value={i18n.language} onChange={e => i18n.changeLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="hi">हिंदी</option>
            <option value="ar">العربية</option>
            <option value="pt">Português</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
          </select>
          <select value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="system">{t('system')}</option>
            <option value="light">{t('light')}</option>
            <option value="dark">{t('dark')}</option>
          </select>
          {user ? (
            <>
              <span className="badge">{user.subscriptionStatus === 'active' ? t('subActive') : t('subInactive')}</span>
              <button onClick={() => setPage('profile')}>{t('profile')}</button>
              <button onClick={async () => { await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' }); setUser(null) }}>{t('logout')}</button>
            </>
          ) : (
            <>
              <button onClick={() => setPage('login')}>{t('login')}</button>
              <button onClick={() => setPage('signup')}>{t('signup')}</button>
            </>
          )}
        </div>
      </nav>
    )
  }

  function Footer() {
    return (
      <div className="footer container">
        <div className="notice">© 2025 HumanLiker v0.3</div>
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
      <div className="container">
        <div className="card">
          <h2>{t('rewriteDemo')}</h2>
          <RewriteDemo user={user} />
        </div>
        <div className="spacer"></div>
        <div className="card">
          <Subscription user={user} />
        </div>
      </div>
    )
  }

  function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    return (
      <div className="container">
        <div className="card">
          <h2>{t('login')}</h2>
          <div className="row"><input placeholder={t('email')} value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div className="row"><input type="password" placeholder={t('password')} value={password} onChange={e=>setPassword(e.target.value)} /></div>
          <div className="row">
            <button onClick={async ()=>{
              const res = await fetch(`${API}/api/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify({email, password}) })
              if (res.ok) { await fetchMe(); setPage('home') }
            }}>{t('login')}</button>
            <a onClick={()=>setPage('signup')}>{t('noAccount')} {t('signup')}</a>
          </div>
        </div>
      </div>
    )
  }

  function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    return (
      <div className="container">
        <div className="card">
          <h2>{t('signup')}</h2>
          <div className="row"><input placeholder={t('email')} value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div className="row"><input type="password" placeholder={t('password')} value={password} onChange={e=>setPassword(e.target.value)} /></div>
          <div className="row"><input type="password" placeholder={t('confirmPassword')} value={confirm} onChange={e=>setConfirm(e.target.value)} /></div>
          <div className="row">
            <button onClick={async ()=>{
              if (password !== confirm) return;
              const res = await fetch(`${API}/api/auth/signup`, { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify({email, password}) })
              if (res.ok) { await fetchMe(); setPage('home') }
            }}>{t('signup')}</button>
            <a onClick={()=>setPage('login')}>{t('haveAccount')} {t('login')}</a>
          </div>
        </div>
      </div>
    )
  }

  function Profile() {
    if (!user) return <div className="container"><div className="card">Not logged in.</div></div>
    return (
      <div className="container">
        <div className="card">
          <h2>{t('profile')}</h2>
          <div>{user.email}</div>
          <div className="spacer"></div>
          <Subscription user={user} />
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
      <div>
        <h3>{user?.subscriptionStatus === 'active' ? t('subActive') : t('subInactive')}</h3>
        <button onClick={startCheckout}>{t('subscribe')}</button>
      </div>
    )
  }

  function RewriteDemo({ user }) {
    const [input, setInput] = useState('Writing should breathe like a human.')
    const [output, setOutput] = useState('')
    function rewriteLocal(text) {
      const s = text
        .replace(/\s+/g, ' ')
        .replace(/\./g, '.')
        .replace(/\!+/g, '!')
        .replace(/\?+/g, '?')
      return s[0]?.toUpperCase() + s.slice(1)
    }
    return (
      <div>
        <textarea rows="4" style={{width:'100%'}} value={input} onChange={e=>setInput(e.target.value)} placeholder={t('inputText')} />
        <div className="spacer"></div>
        <button onClick={()=> setOutput(rewriteLocal(input))}>{t('rewrite')}</button>
        <div className="spacer"></div>
        <div className="card"><strong>{t('outputText')}:</strong><div>{output}</div></div>
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
