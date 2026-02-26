import { ExperienceType } from "@portfolio/packages";

function formatPeriod(startDate: Date | string, endDate?: Date | string | null, showMonth: boolean = true) {
  const options: Intl.DateTimeFormatOptions = showMonth
    ? { month: "short", year: "numeric" }
    : { year: "numeric" };

  const formatter = new Intl.DateTimeFormat("pt-BR", options);

  const format = (date: Date | string) => {
    const str = formatter.format(new Date(date));
    return str.replace(/ de /g, " ").replace(/\./g, "").replace(/^\w/, (c) => c.toUpperCase());
  };

  const start = format(startDate);
  const end = endDate ? format(endDate) : "Atual";

  return `${start} — ${end}`;
}

export function Experience({ experiences }: { experiences: ExperienceType[] }) {
  if (!experiences?.length) return null;

  return (
    <section id="experiencia" className="py-24 scroll-mt-20">
      <h3 className="text-2xl font-bold text-white flex items-center gap-3">
        <span className="text-blue-500 font-mono text-lg font-normal">04.</span>
        Experiências
      </h3>
      <div className="space-y-12">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="group flex flex-col md:flex-row gap-4 md:gap-8"
          >
            <div className="md:w-1/4 text-neutral-500 font-mono text-sm mt-1">
              {/* Substituindo o exp.period pela função */}
              {formatPeriod(exp.startDate, exp.endDate)}
            </div>
            <div className="md:w-3/4 space-y-3">
              <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                {exp.role} ·{" "}
                <span className="font-medium text-neutral-300">
                  {exp.company}
                </span>
              </h4>
              <p className="text-neutral-400 leading-relaxed text-sm">
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {exp.techs?.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs font-mono text-blue-400 bg-blue-950/30 border border-blue-900/30 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}