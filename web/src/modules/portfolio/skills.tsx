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
  SiGithubactions,
  SiVuedotjs,
  SiAngular,
  SiExpress,
  SiMysql,
  SiAmazonwebservices
} from "react-icons/si";
import { Layers, TerminalSquare } from "lucide-react";

// Mapping of common skill names to their icons and hover colors
const skillIconMap: Record<string, { icon: any, hoverColor: string }> = {
  "react": { icon: SiReact, hoverColor: "group-hover:text-[#61DAFB]" },
  "react.js": { icon: SiReact, hoverColor: "group-hover:text-[#61DAFB]" },
  "next.js": { icon: SiNextdotjs, hoverColor: "group-hover:text-white" },
  "nextjs": { icon: SiNextdotjs, hoverColor: "group-hover:text-white" },
  "next": { icon: SiNextdotjs, hoverColor: "group-hover:text-white" },
  "typescript": { icon: SiTypescript, hoverColor: "group-hover:text-[#3178C6]" },
  "ts": { icon: SiTypescript, hoverColor: "group-hover:text-[#3178C6]" },
  "tailwind css": { icon: SiTailwindcss, hoverColor: "group-hover:text-[#06B6D4]" },
  "tailwindcss": { icon: SiTailwindcss, hoverColor: "group-hover:text-[#06B6D4]" },
  "tailwind": { icon: SiTailwindcss, hoverColor: "group-hover:text-[#06B6D4]" },
  "jest": { icon: SiJest, hoverColor: "group-hover:text-[#C21325]" },
  "node.js": { icon: SiNodedotjs, hoverColor: "group-hover:text-[#339933]" },
  "nodejs": { icon: SiNodedotjs, hoverColor: "group-hover:text-[#339933]" },
  "node": { icon: SiNodedotjs, hoverColor: "group-hover:text-[#339933]" },
  "express": { icon: SiExpress, hoverColor: "group-hover:text-white" },
  "fastify": { icon: SiFastify, hoverColor: "group-hover:text-white" },
  "clean architecture": { icon: Layers, hoverColor: "group-hover:text-white" },
  "prisma orm": { icon: SiPrisma, hoverColor: "group-hover:text-white" },
  "prisma": { icon: SiPrisma, hoverColor: "group-hover:text-white" },
  "postgresql": { icon: SiPostgresql, hoverColor: "group-hover:text-[#4169E1]" },
  "postgres": { icon: SiPostgresql, hoverColor: "group-hover:text-[#4169E1]" },
  "mysql": { icon: SiMysql, hoverColor: "group-hover:text-[#4479A1]" },
  "mongodb": { icon: SiMongodb, hoverColor: "group-hover:text-[#47A248]" },
  "mongo": { icon: SiMongodb, hoverColor: "group-hover:text-[#47A248]" },
  "docker": { icon: SiDocker, hoverColor: "group-hover:text-[#2496ED]" },
  "ci/cd": { icon: SiGithubactions, hoverColor: "group-hover:text-[#2088FF]" },
  "github actions": { icon: SiGithubactions, hoverColor: "group-hover:text-[#2088FF]" },
  "aws": { icon: SiAmazonwebservices, hoverColor: "group-hover:text-[#FF9900]" },
  "vue": { icon: SiVuedotjs, hoverColor: "group-hover:text-[#4FC08D]" },
  "vue.js": { icon: SiVuedotjs, hoverColor: "group-hover:text-[#4FC08D]" },
  "angular": { icon: SiAngular, hoverColor: "group-hover:text-[#DD0031]" }
};

interface SkillsProps {
  frontend?: string;
  backend?: string;
  tools?: string;
}

export function Skills({ frontend, backend, tools }: SkillsProps) {
  const parseSkills = (str: string | undefined, defaultList: string[]) => {
    if (!str) return defaultList;
    return str.split(',').map(s => s.trim()).filter(s => s.length > 0);
  };

  const frontendSkills = parseSkills(frontend, ["React", "Next.js", "TypeScript", "Tailwind CSS", "Jest"]);
  const backendSkills = parseSkills(backend, ["Node.js", "Fastify", "Clean Architecture", "Prisma ORM", "PostgreSQL", "MongoDB"]);
  const toolsSkills = parseSkills(tools, ["Docker", "CI/CD", "Github Actions"]);

  const displayCategories = [
    { title: "Frontend", skills: frontendSkills },
    { title: "Backend", skills: backendSkills },
    { title: "Tools", skills: toolsSkills }
  ];

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
        {displayCategories.map((category) => (
          <div key={category.title} className="space-y-6">
            <h4 className="text-lg font-medium text-white/90 pb-2 border-b border-neutral-900">
              {category.title}
            </h4>
            <div className="flex flex-wrap gap-3">
              {category.skills.map((skillName) => {
                const normalized = skillName.toLowerCase();
                const config = skillIconMap[normalized] || { icon: TerminalSquare, hoverColor: "group-hover:text-blue-400" };
                const Icon = config.icon;

                return (
                  <div 
                    key={skillName} 
                    className="group flex items-center gap-2.5 px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm font-medium hover:border-neutral-700 hover:bg-neutral-900 transition-all cursor-default"
                  >
                    <Icon className={`w-4 h-4 text-neutral-500 transition-colors ${config.hoverColor}`} />
                    <span className="group-hover:text-white transition-colors">
                      {skillName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
