useState } from 'react'
import ChatWindow from './components/ChatWindow'
import { translations } from './i18n/translations'
import { supabase } from './lib/supabaseClient'

const providers = {
  'Open Code':   ['open-code-lite', 'open-code-proxy'],
  'Google Gemini': ['gemini-1.5-flash', 'gemini-2.0-flash-exp'],
  'OpenClaw':    ['openclaw-chat', 'openclaw-coder'],
  'Open Source': ['Qwen2.5-Coder-7B-Instruct', 'Llama-3.1-8B-Instruct']
}

export default function App() {
  const [language,  setLanguage]  = useState('ar')
  const [theme,     setTheme]     = useState('dark')
  const [provider,  setProvider]  = useState('Open Source')
  const [model,     setModel]     = useState(providers['Open Source'][0])
  const [localMode, setLocalMode] = useState(true)
  const [email,     setEmail]     = useState('')
  const [session,   setSession]   = useState(null)
  const [authMsg,   setAuthMsg]   = useState('')

  const t   = translations[language]
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  const providerModels = useMemo(() => providers[provider] ?? [], [provider])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleProviderChange = (next) => {
    setProvider(next)
    setModel(providers[next][0])
  }

  const sendMagicLink = async () => {
    if (!supabase || !email.trim()) return
    setAuthMsg('')
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim() })
    setAuthMsg(error ? error.message : t.magicLinkSent)
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setAuthMsg('')
  }

  return (
    <main className={`app ${theme}`} dir={dir}>
      <div className="app-shell">

        <header className="topbar">
          <div className="title-wrap">
            <h1>⚡ {t.appTitle}</h1>
            <p>{t.appTagline}</p>
          </div>
          <div className="controls">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="ar">🌐 العربية</option>
              <option value="en">🌐 English</option>
            </select>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="dark">🌙 {t.dark}</option>
              <option value="light">☀️ {t.light}</option>
            </select>
          </div>
        </header>

        <section className="bridge-box auth-box">
          <h2>🔐 {t.authTitle}</h2>
          {session ? (
            <div className="auth-row">
              <span className="status-ok">✓ {t.loggedInAs}: {session.user.email}</span>
              <button type="button" className="btn-outline" onClick={signOut}>{t.signOut}</button>
            </div>
          ) : (
            <div className="auth-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.email}
                disabled={!supabase}
              />
              <button type="button" className="btn-primary" onClick={sendMagicLink} disabled={!supabase || !email.trim()}>
                {t.sendMagicLink}
              </button>
            </div>
          )}
          {authMsg   && <p className="status-msg">{authMsg}</p>}
          {!supabase && <p className="status-warn">⚠ Supabase env missing — auth disabled.</p>}
          {supabase && !session && <p className="status-warn">ℹ {t.notLoggedIn}</p>}
        </section>

        <section className="bridge-box">
          <h2>⚙️ {t.loginHint}</h2>
          <div className="grid-2">
            <label>
              <span>{t.provider}</span>
              <select value={provider} onChange={(e) => handleProviderChange(e.target.value)}>
                {Object.keys(providers).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>
            <label>
              <span>{t.model}</span>
              <select value={model} onChange={(e) => setModel(e.target.value)}>
                {providerModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={localMode}
              onChange={(e) => setLocalMode(e.target.checked)}
            />
            <span>{t.localMode}<small> — {t.localModeDesc}</small></span>
          </label>
        </section>

        <ChatWindow
          t={t}
          language={language}
          provider={provider}
          model={model}
          localMode={localMode}
          session={session}
        />

      </div>
    </main>
  )
}