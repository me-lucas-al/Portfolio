import { EducationType } from "@portfolio/packages";
import type { Locale } from "@/i18n";

function formatPeriod(
  startDate: Date | string,
  endDate?: Date | string | null,
  locale: Locale = "pt",
  showMonth: boolean = true
) {
  const intlLocale = locale === "en" ? "en-US" : "pt-BR";
  const options: Intl.DateTimeFormatOptions = showMonth
    ? { month: "short", year: "numeric" } 
    : { year: "numeric" };                

  const formatter = new Intl.DateTimeFormat(intlLocale, options);

  const format = (date: Date | string) => {
    const str = formatter.format(new Date(date));
    return str.replace(/ de /g, " ").replace(/\./g, "").replace(/^\w/, (c) => c.toUpperCase());
  };

  const start = format(startDate);
  const end = endDate ? format(endDate) : (locale === "en" ? "Present" : "Atual");

  return `${start} — ${end}`;
}

interface EducationProps {
  educations: EducationType[]
  locale: Locale
}

export function Education({ educations, locale }: EducationProps) {
  if (!educations?.length) return null;

  const title = locale === "en" ? "Academic Background" : "Formação Acadêmica";

  return (
    <section id="formacao" className="py-24 scroll-mt-20">
      <div className="flex items-center gap-6 mb-12">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-blue-500 font-mono text-lg font-normal">05.</span>
          {title}
        </h3>
        <div className="h-px bg-neutral-900 flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {educations.map((edu) => {
          const course = locale === "en" ? (edu.courseEn || edu.course) : edu.course;
          return (
            <div
              key={edu.id}
              className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 hover:border-blue-900/50 transition-colors flex flex-col"
            >
              <span className="text-blue-500 font-mono text-xs mb-4 block">
                {edu.type}
              </span>
              <h4 className="text-lg font-bold text-white mb-2">{course}</h4>
              <p className="text-neutral-400 text-sm mb-4">{edu.institution}</p>
              <p className="text-neutral-500 text-sm font-mono mt-auto">
                {formatPeriod(edu.startDate, edu.endDate, locale, false)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}