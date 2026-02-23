import { EducationType } from "@portfolio/packages/schemas/education";

export function Education({ educations }: { educations: EducationType[] }) {
  if (!educations?.length) return null;

  return (
    <section id="formacao" className="py-24 scroll-mt-20">
      <h3 className="text-2xl font-bold text-white flex items-center gap-3">
        <span className="text-blue-500 font-mono text-lg font-normal">05.</span>
        Formação Acadêmica
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {educations.map((edu) => (
          <div
            key={edu.id}
            className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 hover:border-blue-900/50 transition-colors"
          >
            <span className="text-blue-500 font-mono text-xs mb-4 block">
              {edu.type}
            </span>
            <h4 className="text-lg font-bold text-white mb-2">{edu.course}</h4>
            <p className="text-neutral-400 text-sm mb-4">{edu.institution}</p>
            <p className="text-neutral-500 text-sm font-mono mt-auto">
              {edu.period}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
