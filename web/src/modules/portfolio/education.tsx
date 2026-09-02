import { EducationType } from "@portfolio/packages";
import { getDictionary, type Locale } from "@/i18n";
import { EducationGroup } from "./education-group";

interface EducationProps {
  educations: EducationType[]
  locale: Locale
}

export function Education({ educations, locale }: EducationProps) {
  if (!educations?.length) return null;

  const dict = getDictionary(locale).education;

  const academicEducations = educations.filter(
    (edu) => !edu.category || edu.category === "ACADEMIC"
  );
  const courseEducations = educations.filter(
    (edu) => edu.category === "COURSE"
  );

  const hasAcademic = academicEducations.length > 0;
  const hasCourses = courseEducations.length > 0;

  if (!hasAcademic && !hasCourses) return null;

  return (
    <section id="formacao" className="py-24 scroll-mt-20">
      {hasAcademic && (
        <EducationGroup
          title={dict.academicTitle}
          educations={academicEducations}
          locale={locale}
          viewCertificateLabel={dict.viewCertificate}
        />
      )}

      {hasCourses && (
        <div className={hasAcademic ? "mt-20" : ""}>
          <EducationGroup
            title={dict.coursesTitle}
            educations={courseEducations}
            locale={locale}
            viewCertificateLabel={dict.viewCertificate}
          />
        </div>
      )}
    </section>
  );
}
