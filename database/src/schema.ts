import { pgTable, serial, text, timestamp, varchar, integer, boolean, json, uuid, pgEnum, customType } from 'drizzle-orm/pg-core';
import { vector } from 'drizzle-orm/pg-core'; // For pgvector

// Enums
export const rolesEnum = pgEnum('Roles', ['ADMIN', 'USER']);
export const educationCategoryEnum = pgEnum('EducationCategory', ['ACADEMIC', 'COURSE']);
export const timelineMilestoneKindEnum = pgEnum('TimelineMilestoneKind', ['MILESTONE', 'GAP']);

// Arrays (Postgres supports array types, we can use custom type or just built-in array if supported by drizzle, Drizzle supports text().array())

export const users = pgTable('User', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: rolesEnum('role').default('USER').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  titleEn: text('titleEn'),
  description: text('description'),
  descriptionEn: text('descriptionEn'),
  githubUrl: text('githubUrl').notNull(),
  technologies: text('technologies').array().notNull().default([]),
  deployUrl: text('deployUrl'),
  imagesUrl: text('imagesUrl').array().notNull().default([]),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const experiences = pgTable('Experience', {
  id: serial('id').primaryKey(),
  role: text('role').notNull(),
  roleEn: text('roleEn'),
  company: text('company').notNull(),
  startDate: timestamp('startDate').notNull(),
  endDate: timestamp('endDate'),
  description: text('description').notNull(),
  descriptionEn: text('descriptionEn'),
  techs: text('techs').array().notNull().default([]),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const educations = pgTable('Education', {
  id: serial('id').primaryKey(),
  course: text('course').notNull(),
  courseEn: text('courseEn'),
  institution: text('institution').notNull(),
  startDate: timestamp('startDate').notNull(),
  endDate: timestamp('endDate'),
  description: text('description'),
  descriptionEn: text('descriptionEn'),
  type: text('type').notNull(),
  typeEn: text('typeEn'),
  category: educationCategoryEnum('category').default('ACADEMIC').notNull(),
  certificateUrl: text('certificateUrl'),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const timelineMilestones = pgTable('timeline_milestones', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  kind: timelineMilestoneKindEnum('kind').default('MILESTONE').notNull(),
  dateLabelPt: text('dateLabelPt').notNull(),
  dateLabelEn: text('dateLabelEn'),
  titlePt: text('titlePt').notNull(),
  titleEn: text('titleEn'),
  impactPt: text('impactPt').notNull(),
  impactEn: text('impactEn'),
  narrationPt: text('narrationPt').notNull(),
  narrationEn: text('narrationEn'),
  problemPt: text('problemPt').notNull(),
  problemEn: text('problemEn'),
  inflectionPt: text('inflectionPt').notNull(),
  inflectionEn: text('inflectionEn'),
  solutionPt: text('solutionPt').notNull(),
  solutionEn: text('solutionEn'),
  tags: text('tags').array().notNull().default([]),
  beforeImageUrl: text('beforeImageUrl'),
  beforeImageAlt: text('beforeImageAlt'),
  afterImageUrl: text('afterImageUrl'),
  afterImageAlt: text('afterImageAlt'),
  sequence: json('sequence').default('[]'),
  graveyard: json('graveyard').default('[]'),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const systemSettings = pgTable('system_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  icon: text('icon').notNull(),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const chunks = pgTable('chunks', {
  id: uuid('id').defaultRandom().primaryKey(),
  source: text('source').notNull(),
  sourceType: text('sourceType').notNull(),
  chunkIndex: integer('chunkIndex').default(0).notNull(),
  locale: text('locale'),
  title: text('title'),
  content: text('content').notNull(),
  contentHash: text('contentHash').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }),
  lastSeenAt: timestamp('lastSeenAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const chatUsage = pgTable('chat_usage', {
  id: uuid('id').defaultRandom().primaryKey(),
  ipHash: text('ipHash').notNull(),
  kind: text('kind').default('chat').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export const assistantAnswers = pgTable('assistant_answers', {
  id: uuid('id').defaultRandom().primaryKey(),
  locale: text('locale').notNull(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }),
  hitCount: integer('hitCount').default(0).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const assistantSpeech = pgTable('assistant_speech', {
  id: uuid('id').defaultRandom().primaryKey(),
  textHash: text('textHash').notNull().unique(),
  audioUrl: text('audioUrl').notNull(),
  voice: text('voice').notNull(),
  model: text('model').notNull(),
  byteLength: integer('byteLength').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});
