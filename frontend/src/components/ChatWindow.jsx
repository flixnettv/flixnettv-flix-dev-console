useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const quickPrompts = {
  ar: [
    'تحسين صياغة الأمر',
    'شرح خطأ الطرفية',
    'سكريبت نشر مجاني على Vercel',
    'تحويل نص عربي إلى أوامر Bash'
  ],
  en: [
    'Improve this command',
    'Explain terminal error',
    'Free deploy script to Vercel',
    'Convert plain text to Bash'
  ]
}

export default function ChatWindow({ t, language, provider, model, localMode, session }) {
  const [messages, setMessages] = useState([])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const addMsg = (role, text) =>
    setMessages((prev) => [...prev, { role, text }])

  const onSend = async (e) => {
    e.preventDefault()
    const clean = input.trim()
    if (!clean || loading) return

    addMsg('user', clean)
    setInput('')
    setLoading(true)

    try {
      const endpoint = import.meta.env.VITE_SUPABASE_URL
        ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`
        : `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787'}/api/chat`

      const headers = { 'Content-Type': 'application/json' }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const res  = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: clean, provider, model, localMode })
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const meta = data.persisted ? '✓ محفوظ' : session ? '⚠ لم يُحفظ' : '— بدون حساب'
      addMsg('assistant', `${data.output}  (${meta})`)
    } catch {
      addMsg('assistant', t.networkError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="chat-shell">
      <div className="messages">
        {messages.length === 0 && (
          <p className="empty-hint">
            {language === 'ar' ? '💬 ابدأ بكتابة سؤالك...' : '💬 Start typing your question...'}
          </p>
        )}
        {messages.map((msg, i) => (
          <article key={i} className={`msg ${msg.role}`}>
            <strong>{msg.role === 'user' ? '👤' : '⚡ FlixCod'}</strong>
            <p>{msg.text}</p>
          </article>
        ))}
        {loading && <p className="status-processing">⏳ {t.statusProcessing}</p>}
        <div ref={bottomRef} />
      </div>

      <div className="quick-prompts">
        {quickPrompts[language].map((p) => (
          <button key={p} type="button" onClick={() => setInput(p)}>{p}</button>
        ))}
      </div>

      <form onSubmit={onSend} className="composer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chatPlaceholder}
          disabled={loading}
        />
        <button type="button" className="icon-btn" disabled title="Voice — coming soon">🎤</button>
        <button type="submit" className="send-btn" disabled={!input.trim() || loading}>↑</button>
      </form>
    </section>
  )
}