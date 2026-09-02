import { EducationType } from "@portfolio/packages";
import { getDictionary, type Locale } from "@/i18n";
import { EducationCertificateViewer } from "./education-certificate-viewer";

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

  const formatSingleDate = (date: Date | string) => {
    const str = formatter.format(new Date(date));
    return str.replace(/ de /g, " ").replace(/\./g, "").replace(/^\w/, (c) => c.toUpperCase());
  };

  const start = formatSingleDate(startDate);
  const end = endDate ? formatSingleDate(endDate) : getDictionary(locale).education.current;

  return `${start} — ${end}`;
}

interface EducationGroupProps {
  title: string;
  educations: EducationType[];
  locale: Locale;
  viewCertificateLabel: string;
}

export function EducationGroup({
  title,
  educations,
  locale,
  viewCertificateLabel,
}: EducationGroupProps) {
  if (!educations || educations.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-6 mb-12">
        <h3 className="font-display text-2xl font-bold text-fg">
          {title}
        </h3>
        <div className="h-px bg-line flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {educations.map((edu) => {
          const course = locale === "en" ? (edu.courseEn || edu.course) : edu.course;
          return (
            <div
              key={edu.id}
              className="p-6 rounded-2xl bg-surface border border-line hover:border-line-strong transition-colors flex flex-col"
            >
              <span className="text-muted-2 font-mono text-xs mb-4 block">
                {edu.type}
              </span>
              <h4 className="text-lg font-bold text-fg mb-2">{course}</h4>
              <p className="text-fg-muted text-sm mb-4">{edu.institution}</p>
              <p className="text-muted-2 text-sm font-mono mt-auto">
                {formatPeriod(edu.startDate, edu.endDate, locale, false)}
              </p>
              {edu.category === "COURSE" && edu.certificateUrl && (
                <EducationCertificateViewer
                  certificateUrl={edu.certificateUrl}
                  label={viewCertificateLabel}
                  srTitle={`${course} - ${edu.institution}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
