import Image from "next/image"
import profilePicture from "@/public/portfolio_profile.jpg"

interface AboutProps {
  text?: string;
}

export function About({ text }: AboutProps) {
  const defaultText = `Sou um Desenvolvedor Full Stack com foco em arquitetura de software, construindo aplicações web escaláveis e orientadas a resultados de negócios. Com experiência prática no ecossistema JavaScript e TypeScript, atuo diariamente com Node.js, React.js e Next.js.\n\nMinha experiência inclui a aplicação de Clean Architecture, refatoração de código, gerenciamento de bancos de dados relacionais e a estruturação de pipelines CI/CD com Docker para garantir entregas contínuas, estabilidade e segurança.`;
  
  const content = text || defaultText;
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');

  return (
    <section id="sobre" className="py-24 scroll-mt-20">
      <div className="flex items-center gap-6 mb-12">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-blue-500 font-mono text-lg font-normal">01.</span>
          Quem Sou
        </h3>
        <div className="h-px bg-neutral-900 flex-1" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12 items-center">
        <div className="text-neutral-400 text-lg leading-relaxed space-y-6">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full border-4 border-white overflow-hidden shadow-xl shadow-white/10">
            <Image
              src={profilePicture}
              alt="Lucas Almeida"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 256px, 288px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}