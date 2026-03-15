import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787';

const quickPrompts = {
  ar: ['تحسين الأمر', 'شرح الخطأ', 'سكريبت نشر مجاني', 'تحويل وصف إلى Bash'],
  en: ['Improve command', 'Explain error', 'Free deploy script', 'Convert brief to Bash']
};

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';

export default function ChatWindow({ t, language, provider, model, localMode, userId }) {
  ar: [
    'تحسين صياغة الأمر',
    'شرح خطأ الطرفية',
    'اقتراح سكربت للنشر المجاني',
    'تحويل نص عربي إلى أوامر Bash'
  ],
  en: [
    'Improve this command prompt',
    'Explain terminal error',
    'Suggest free deploy script',
    'Convert plain text to Bash'
  ]
};

export default function ChatWindow({ t, language, provider, model, localMode, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const onSend = async (event) => {
    event.preventDefault();
    const clean = input.trim();
    if (!clean) return;

    setMessages((prev) => [...prev, { role: 'user', text: clean }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: clean,
          provider,
          model,
          localMode,
          userId: userId || 'anonymous'
        })
      });

      const data = await response.json();
      const reply = data.output || t.demoReply;
      const meta = data.persisted ? '✓ DB' : `⚠ ${data.persistenceMessage || 'No DB'}`;
      setMessages((prev) => [...prev, { role: 'assistant', text: `${reply} (${meta})` }]);
    } catch (_error) {
      setMessages((prev) => [...prev, { role: 'assistant', text: t.networkError }]);
    } finally {
      setLoading(false);
    }
  const pushPrompt = (prompt) => {
    setInput(prompt);
  };

  const onSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({ message: userText, provider, model, localMode })
      });

      if (!response.ok) throw new Error('chat_request_failed');

      const data = await response.json();
      const runtimeHint = localMode
        ? language === 'ar'
          ? 'تشغيل محلي.'
          : 'Local mode.'
        : language === 'ar'
          ? 'تشغيل سحابي.'
          : 'Cloud mode.';

      setMessages((prev) => [...prev, { role: 'assistant', text: `${t.demoReply} ${runtimeHint} ${data.output}` }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: t.registerError }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="chat-shell">
      <div className="messages">
        {messages.map((message, index) => (
          <article key={`${message.role}-${index}`} className={`msg ${message.role}`}>
            <strong>{message.role === 'user' ? 'You' : 'FlixCod'}</strong>
            <p>{message.text}</p>
          </article>
        ))}
        {loading ? <p className="status">{t.statusProcessing}</p> : null}
      </div>

      <div className="quick-prompts">
        {quickPrompts[language].map((prompt) => (
          <button type="button" key={prompt} onClick={() => setInput(prompt)}>
          <button type="button" key={prompt} onClick={() => pushPrompt(prompt)}>
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={onSend} className="composer">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.chatPlaceholder} />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={user ? t.chatPlaceholder : t.requiredToUseTools}
          disabled={!user}
        />
        <button type="button" className="icon-btn" disabled>
          🎤
        </button>
        <button type="submit" className="send-btn" disabled={!user || loading}>
          ↑
        </button>
      </form>
    </section>
  );
}
