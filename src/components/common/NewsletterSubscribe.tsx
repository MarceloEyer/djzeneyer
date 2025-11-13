import React, { useEffect, useRef, useState } from 'react';

type Props = {
  /** MailPoet list ID (if your endpoint supports it). Default: 1 */
  listId?: number;
  /** Optional className to style the wrapper */
  className?: string;
  /** Callback after successful subscribe */
  onSuccess?: (payload?: any) => void;
};

const NewsletterSubscribe: React.FC<Props> = ({ listId = 1, className = '', onSuccess }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const validateEmail = (value: string) => {
    return /^\S+@\S+\.\S+$/.test(value.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateEmail(email)) {
      setMessage('Informe um e‑mail válido.');
      setStatus('error');
      return;
    }

    setStatus('loading');

    const restUrl = (window as any).wpData?.restUrl ?? `${window.location.origin}/wp-json/`;
    const nonce = (window as any).wpData?.nonce ?? '';

    abortRef.current = new AbortController();

    try {
      const res = await fetch(`${restUrl}djzeneyer/v1/subscribe`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(nonce ? { 'X-WP-Nonce': nonce } : {}),
        },
        body: JSON.stringify({ email: email.trim(), listId }),
        signal: abortRef.current.signal,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // WP_Error usually returns a message or nested data
        const errMessage = (data && (data.message || (data.data && data.data.message))) || 'Falha ao inscrever.';
        throw new Error(errMessage);
      }

      setStatus('success');
      setMessage((data && (data.message || 'Inscrito com sucesso! Verifique seu e-mail.')) || 'Inscrito com sucesso!');
      setEmail('');
      onSuccess?.(data);
    } catch (error: any) {
      if (error?.name === 'AbortError') return;
      setStatus('error');
      setMessage(error?.message || 'Erro desconhecido. Tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-md ${className}`}>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <label htmlFor="newsletter-email" className="sr-only">Email</label>

        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu melhor e‑mail"
          autoComplete="email"
          required
          aria-required
          className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/10 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={status === 'loading'}
        />

        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center px-4 py-2 rounded-md font-medium btn btn-primary"
        >
          {status === 'loading' ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-75" />
            </svg>
          ) : status === 'success' ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            'Inscrever'
          )}
        </button>
      </div>

      <p role="status" aria-live="polite" className={`mt-2 text-sm ${status === 'error' ? 'text-rose-400' : 'text-green-400'}`}>
        {message}
      </p>
    </form>
  );
};

export default NewsletterSubscribe;
