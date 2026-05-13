export function Footer() {
  return (
    <footer className="bg-brand-primary text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-bold text-lg">MMA Sistemas Blog</p>
            <p className="text-blue-200 text-sm mt-1">Tecnologia, gestão e inovação para empresas</p>
          </div>
          <nav className="flex gap-6 text-sm text-blue-200">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="https://www.mmasistemas.net.br" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">MMA Sistemas</a>
          </nav>
        </div>
        <div className="border-t border-blue-800 mt-6 pt-4 text-center text-blue-300 text-xs">
          © {new Date().getFullYear()} MMA Sistemas. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
