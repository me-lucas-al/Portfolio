import type { Dictionary } from './pt'

export const en: Dictionary = {
  nav: {
    about: 'About',
    skills: 'Skills',
    projects: 'Projects',
    experience: 'Experience',
    education: 'Education',
    contact: 'Contact',
  },
  hero: {
    greeting:
      'Hi! I am Lucas Almeida, a full stack developer specialized in building scalable web applications and high-performance systems with Next.js, React and Node.js.',
    role: 'Full Stack Developer — Next.js, React and Node.js',
    resume: 'Resume',
  },
  about: { title: 'About Me' },
  skills: { title: 'Skills', tools: 'Tools' },
  projects: { title: 'Projects' },
  experience: { title: 'Experience', current: 'Present' },
  education: { title: 'Academic Background', current: 'Present' },
  contact: {
    title: 'Contact',
    heading: 'Get in Touch',
    description:
      "I'm always open to new opportunities and partnerships. Feel free to send me a message through any of the platforms below.",
    fallback: 'Visit the link',
    descriptions: {
      github: 'Visit my GitHub profile',
      linkedin: 'Connect with me on LinkedIn',
      whatsapp: 'Send me a message',
      email: 'Send me an email',
    },
  },
  header: { controlPanel: 'Control Panel', navigation: 'Navigation' },
  footer: {
    rights: 'All rights reserved.',
    description: 'Full Stack Developer & Next.js, React and Node.js Developer',
  },
}
