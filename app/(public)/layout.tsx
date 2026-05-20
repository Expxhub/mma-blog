import { Header } from '@/components/layout/Header'
import { PortalHeader } from '@/components/layout/PortalHeader'
import { Footer } from '@/components/layout/Footer'
import { getSettings } from '@/lib/settings'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { template } = await getSettings()

  return (
    <div className="min-h-screen flex flex-col">
      {template === 'portal' ? <PortalHeader /> : <Header />}
      <main
        className={`flex-1 w-full mx-auto px-4 py-8 ${
          template === 'portal' ? 'max-w-7xl' : 'max-w-6xl'
        }`}
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}
