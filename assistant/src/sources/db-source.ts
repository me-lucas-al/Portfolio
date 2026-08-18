import {
  makeExperienceService,
  makeEducationService,
  makeProjectService,
  makeSystemSettingService,
  makeLinkService,
} from "@portfolio/core/src/factories/_index";
import { hashContent } from "../ingest/hash";
import { ChunkSource, RawChunk } from "./chunk-source.interface";

function formatPeriod(startDate: Date, endDate: Date | null, currentLabel: string): string {
  const startYear = startDate.getFullYear();
  const endLabel = endDate ? String(endDate.getFullYear()) : currentLabel;
  return `${startYear} - ${endLabel}`;
}

function makeChunk(
  source: string,
  sourceType: string,
  chunkIndex: number,
  locale: string | null,
  title: string,
  content: string,
): RawChunk {
  return {
    source,
    sourceType,
    chunkIndex,
    locale,
    title,
    content,
    contentHash: hashContent(content),
  };
}

export class DbSource implements ChunkSource {
  namespace = "db:";

  async *collect(): AsyncIterable<RawChunk> {
    yield* this.collectExperiences();
    yield* this.collectEducations();
    yield* this.collectProjects();
    yield* this.collectSystemSettings();
    yield* this.collectLinks();
  }

  private async *collectExperiences(): AsyncIterable<RawChunk> {
    const experiences = await makeExperienceService().getAllExperiences();

    for (const experience of experiences) {
      const source = `db:experience/${experience.id}`;
      const periodPt = formatPeriod(experience.startDate, experience.endDate, "Atual");
      const periodEn = formatPeriod(experience.startDate, experience.endDate, "Present");

      const contentPt = [
        `Experiência profissional: ${experience.role} na ${experience.company} (${periodPt}).`,
        experience.techs.length > 0 ? `Tecnologias: ${experience.techs.join(", ")}.` : "",
        experience.description,
      ]
        .filter(Boolean)
        .join("\n");

      yield makeChunk(source, "experience", 0, "pt", experience.role, contentPt);

      if (experience.roleEn || experience.descriptionEn) {
        const contentEn = [
          `Professional experience: ${experience.roleEn ?? experience.role} at ${experience.company} (${periodEn}).`,
          experience.techs.length > 0 ? `Technologies: ${experience.techs.join(", ")}.` : "",
          experience.descriptionEn ?? experience.description,
        ]
          .filter(Boolean)
          .join("\n");

        yield makeChunk(source, "experience", 1, "en", experience.roleEn ?? experience.role, contentEn);
      }
    }
  }

  private async *collectEducations(): AsyncIterable<RawChunk> {
    const educations = await makeEducationService().getAllEducations();

    for (const education of educations) {
      const source = `db:education/${education.id}`;
      const periodPt = formatPeriod(education.startDate, education.endDate, "Atual");
      const periodEn = formatPeriod(education.startDate, education.endDate, "Present");

      const contentPt = `Formação acadêmica: ${education.course} - ${education.institution} (${periodPt}). Tipo: ${education.type}.`;
      yield makeChunk(source, "education", 0, "pt", education.course, contentPt);

      if (education.courseEn) {
        const contentEn = `Academic background: ${education.courseEn} - ${education.institution} (${periodEn}). Type: ${education.type}.`;
        yield makeChunk(source, "education", 1, "en", education.courseEn, contentEn);
      }
    }
  }

  private async *collectProjects(): AsyncIterable<RawChunk> {
    const projects = await makeProjectService().getAllProjects();

    for (const project of projects) {
      const source = `db:project/${project.id}`;
      const deployLinePt = project.deployUrl ? `. Deploy: ${project.deployUrl}` : "";
      const deployLineEn = project.deployUrl ? `. Deploy: ${project.deployUrl}` : "";

      const contentPt = [
        `Projeto: ${project.title}.`,
        project.description ?? "",
        project.technologies.length > 0 ? `Tecnologias: ${project.technologies.join(", ")}.` : "",
        `Repositório: ${project.githubUrl}${deployLinePt}`,
      ]
        .filter(Boolean)
        .join("\n");

      yield makeChunk(source, "project", 0, "pt", project.title, contentPt);

      if (project.titleEn || project.descriptionEn) {
        const contentEn = [
          `Project: ${project.titleEn ?? project.title}.`,
          project.descriptionEn ?? project.description ?? "",
          project.technologies.length > 0 ? `Technologies: ${project.technologies.join(", ")}.` : "",
          `Repository: ${project.githubUrl}${deployLineEn}`,
        ]
          .filter(Boolean)
          .join("\n");

        yield makeChunk(source, "project", 1, "en", project.titleEn ?? project.title, contentEn);
      }
    }
  }

  private async *collectSystemSettings(): AsyncIterable<RawChunk> {
    const settings = await makeSystemSettingService().getAll();

    for (const setting of settings) {
      if (!setting.value?.trim()) continue;

      const source = `db:systemSetting/${setting.key}`;
      const locale = setting.key.endsWith("_en") ? "en" : null;
      const content = `${setting.key}: ${setting.value}`;

      yield makeChunk(source, "systemSetting", 0, locale, setting.key, content);
    }
  }

  private async *collectLinks(): AsyncIterable<RawChunk> {
    const links = await makeLinkService().getAllLinks();

    for (const link of links) {
      const source = `db:link/${link.id}`;
      const content = `Link de contato: ${link.title} -> ${link.url}`;

      yield makeChunk(source, "link", 0, null, link.title, content);
    }
  }
}
