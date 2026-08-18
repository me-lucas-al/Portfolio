import Image from "next/image"
import profilePicture from "@/public/portfolio_profile.jpg"
import { getDictionary, type Locale } from "@/i18n"

interface AboutProps {
  textPt?: string;
  textEn?: string;
  locale?: Locale;
}

export function About({ textPt, textEn, locale = "pt" }: AboutProps) {
  const isEn = locale === "en";
  const defaultTextPt = `Como Lucas Almeida, atuo como desenvolvedor full stack focado em arquitetura de software, construindo aplicações web escaláveis e orientadas a resultados. Com experiência sólida no ecossistema JavaScript e TypeScript, trabalho diariamente com Next.js, React e Node.js de alta performance.\n\nMinha trajetória como desenvolvedor inclui a aplicação de Clean Architecture, otimização de performance, bancos de dados relacionais e a estruturação de pipelines CI/CD com Docker para garantir entregas contínuas, estabilidade e segurança.`;

  const defaultTextEn = `As Lucas Almeida, I work as a full stack developer focused on software architecture, building scalable and result-oriented web applications. With strong experience in the JavaScript and TypeScript ecosystem, I work daily with high-performance Next.js, React, and Node.js.\n\nMy journey as a developer includes applying Clean Architecture, performance optimization, relational databases, and structuring CI/CD pipelines with Docker to ensure continuous delivery, stability, and security.`;

  const content = isEn ? (textEn || textPt || defaultTextEn) : (textPt || defaultTextPt);
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');
  const title = getDictionary(locale).about.title;

  return (
    <section id="sobre" className="py-24 scroll-mt-20">
      <div className="flex items-center gap-6 mb-12">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-blue-500 font-mono text-lg font-normal">01.</span>
          {title}
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
              alt="Lucas Almeida - Desenvolvedor Next.js, React e Node.js"
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