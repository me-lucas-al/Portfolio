export function About() {
  return (
    <section id="sobre" className="py-24 scroll-mt-20">
      <div className="flex items-center gap-6 mb-12">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-blue-500 font-mono text-lg font-normal">01.</span> 
          Quem Sou
        </h3>
        <div className="h-px bg-neutral-900 flex-1" />
      </div>

      <div className="text-neutral-400 text-lg leading-relaxed space-y-6 max-w-3xl">
        <p>
          Sou um Desenvolvedor Full Stack com foco em arquitetura de software, construindo aplicações web escaláveis e orientadas a resultados de negócios. Com experiência prática no ecossistema JavaScript e TypeScript, atuo diariamente com Node.js, React.js e Next.js.
        </p>
        <p>
          Minha experiência inclui a aplicação de Clean Architecture, refatoração de código, gerenciamento de bancos de dados relacionais e a estruturação de pipelines CI/CD com Docker para garantir entregas contínuas, estabilidade e segurança.
        </p>
      </div>
    </section>
  )
}