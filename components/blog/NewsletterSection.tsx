'use client'

import { useState } from 'react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <section className="my-12 rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="px-8 py-12 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Fique por dentro das novidades</h2>
        <p className="text-white/70 text-sm mb-8 max-w-lg mx-auto">
          Receba os melhores artigos sobre tecnologia e gestão diretamente no seu e-mail.
        </p>
        {submitted ? (
          <p className="text-white font-medium">&#10003; Obrigado! Em breve você receberá nossas novidades.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu e-mail"
              required
              className="flex-1 px-4 py-2.5 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white whitespace-nowrap hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              Inscrever-se
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
