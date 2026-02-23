import { 
  SiReact, 
  SiTypescript, 
  SiTailwindcss, 
  SiNextdotjs, 
  SiJest,
  SiPostgresql,
  SiMongodb,
  SiPrisma,
  SiFastify,
  SiNodedotjs,
  SiDocker,
  SiGithubactions
} from "react-icons/si";
import { Layers } from "lucide-react"; // Ícone perfeito para representar as camadas da Clean Architecture

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: SiReact, hoverColor: "group-hover:text-[#61DAFB]" },
      { name: "Next.js", icon: SiNextdotjs, hoverColor: "group-hover:text-white" },
      { name: "TypeScript", icon: SiTypescript, hoverColor: "group-hover:text-[#3178C6]" },
      { name: "Tailwind CSS", icon: SiTailwindcss, hoverColor: "group-hover:text-[#06B6D4]" },
      { name: "Jest", icon: SiJest, hoverColor: "group-hover:text-[#C21325]" },
    ]
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, hoverColor: "group-hover:text-[#339933]" },
      { name: "Fastify", icon: SiFastify, hoverColor: "group-hover:text-white" },
      { name: "Clean Architecture", icon: Layers, hoverColor: "group-hover:text-white" },
      { name: "Prisma ORM", icon: SiPrisma, hoverColor: "group-hover:text-white" },
      { name: "PostgreSQL", icon: SiPostgresql, hoverColor: "group-hover:text-[#4169E1]" },
      { name: "MongoDB", icon: SiMongodb, hoverColor: "group-hover:text-[#47A248]" },
    ]
  },
  {
    title: "Tools",
    skills: [
      { name: "Docker", icon: SiDocker, hoverColor: "group-hover:text-[#2496ED]" },
      { name: "CI/CD", icon: SiGithubactions, hoverColor: "group-hover:text-[#2088FF]" },
    ]
  }
];

export function Skills() {
  return (
    <section id="tecnologias" className="py-24 scroll-mt-20">
      <div className="flex items-center gap-6 mb-12">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-blue-500 font-mono text-lg font-normal">02.</span> 
          Tecnologias
        </h3>
        <div className="h-px bg-neutral-900 flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {skillCategories.map((category) => (
          <div key={category.title} className="space-y-6">
            <h4 className="text-lg font-medium text-white/90 pb-2 border-b border-neutral-900">
              {category.title}
            </h4>
            <div className="flex flex-wrap gap-3">
              {category.skills.map((skill) => (
                <div 
                  key={skill.name} 
                  className="group flex items-center gap-2.5 px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm font-medium hover:border-neutral-700 hover:bg-neutral-900 transition-all cursor-default"
                >
                  <skill.icon className={`w-4 h-4 text-neutral-500 transition-colors ${skill.hoverColor}`} />
                  <span className="group-hover:text-white transition-colors">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}