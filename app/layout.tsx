import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | MMA Sistemas Blog',
    default: 'MMA Sistemas Blog',
  },
  description: 'Tecnologia, gestão e inovação para empresas',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-neutral-900 antialiased">{children}</body>
    </html>
  )
}
