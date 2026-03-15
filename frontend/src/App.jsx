import { useEffect, useMemo, useState } from 'react';
import ChatWindow from './components/ChatWindow';
import { translations } from './i18n/translations';
import { supabase } from './lib/supabaseClient';
import { useMemo, useState } from 'react';
import ChatWindow from './components/ChatWindow';
import { translations } from './i18n/translations';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787';

const providers = {
  'Open Code': ['open-code-lite', 'open-code-proxy'],
  'Google Gemini': ['gemini-1.5-flash', 'gemini-2.0-flash-exp'],
  OpenClaw: ['openclaw-chat', 'openclaw-coder'],
  'Open Source': ['Qwen2.5-Coder-7B-Instruct', 'Llama-3.1-8B-Instruct']
};

export default function App() {
  const [language, setLanguage] = useState('ar');
  const [theme, setTheme] = useState('dark');
  const [provider, setProvider] = useState('Open Source');
  const [model, setModel] = useState(providers['Open Source'][0]);
  const [localMode, setLocalMode] = useState(true);
  const [connected, setConnected] = useState(false);
  const [email, setEmail] = useState('');
  const [session, setSession] = useState(null);

  const t = translations[language];
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const providerModels = useMemo(() => providers[provider] ?? [], [provider]);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const t = translations[language];
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const providerModels = useMemo(() => providers[provider] ?? [], [provider]);

  const handleProviderChange = (nextProvider) => {
    setProvider(nextProvider);
    setModel(providers[nextProvider][0]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatusMsg('');

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });

      if (!response.ok) throw new Error('registration_failed');

      const data = await response.json();
      setUser(data.user);
      setStatusMsg(t.registerSuccess);
    } catch {
      setStatusMsg(t.registerError);
    }
  };

  const connectProvider = () => {
    if (!user) {
      setStatusMsg(t.requiredToUseTools);
      return;
    }

    localStorage.setItem(
      'flixcod-provider',
      JSON.stringify({ provider, model, localMode, userId: user.id, at: new Date().toISOString() })
    );
    setConnected(true);
    setTimeout(() => setConnected(false), 1800);
  };

  const sendMagicLink = async () => {
    if (!supabase || !email) return;
    await supabase.auth.signInWithOtp({ email });
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <main className={`app ${theme}`} dir={dir}>
      <header className="topbar">
        <div>
          <h1>{t.appTitle}</h1>
          <p>{t.appTagline}</p>
        </div>

        <div className="controls">
          <label>
            {t.lang}
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} aria-label={t.theme}>
              <option value="dark">{t.dark}</option>
              <option value="light">{t.light}</option>
            </select>
          </label>
        </div>
      </header>

      <section className="bridge-box auth-box">
        <h2>{t.authTitle}</h2>
        <div className="auth-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.email}
            disabled={!supabase || Boolean(session)}
          />
          <button type="button" onClick={sendMagicLink} disabled={!supabase || Boolean(session)}>
            {t.sendMagicLink}
          </button>
          <button type="button" onClick={signOut} disabled={!session}>
            {t.signOut}
          </button>
        </div>
        {!supabase ? <p className="status">Supabase env missing. Auth disabled.</p> : null}
      </section>

      <section className="bridge-box">
        <h2>{t.loginHint}</h2>
        <div className="grid">
          <label>
            {t.provider}
            <select
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                setModel(providers[e.target.value][0]);
              }}
            >
            <select value={provider} onChange={(e) => handleProviderChange(e.target.value)}>
              {Object.keys(providers).map((item) => (
                <option key={item} value={item}>
                  {t.provider}: {item}
                </option>
              ))}
            </select>

            <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!user}>
              {providerModels.map((item) => (
                <option key={item} value={item}>
                  {t.model}: {item}
                </option>
              ))}
            </select>

            <label className="checkbox">
              <input
                type="checkbox"
                checked={localMode}
                onChange={(e) => setLocalMode(e.target.checked)}
                disabled={!user}
              />
              <span>
                {t.localMode}
                <small>{t.localModeDesc}</small>
              </span>
            </label>

      <ChatWindow
        t={t}
        language={language}
        provider={provider}
        model={model}
        localMode={localMode}
        userId={session?.user?.id}
      />
    </main>
  );
}
