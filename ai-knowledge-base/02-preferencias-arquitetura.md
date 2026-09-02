# Preferências de arquitetura

> Esta seção é opinião e estilo pessoal, não inventário de tecnologias (isso já está em `Project.technologies` e nas skills do `SystemSetting`, via `db-source.ts`).

## Trade-offs que já enfrentei (Linguagens e Frameworks)

- **Java e Angular vs. Node.js e React:** Em sistemas que exigem uma arquitetura corporativa muito robusta e sólida, prefiro utilizar tecnologias onde a orientação a objetos e a estruturação são naturais e otimizadas (como Java e Angular).
- **Quando não usar Node.js:** Evito Node.js em aplicações que necessitam de multithreading real e intensivo. Por exemplo, em uma lógica recente com um modelo de IA speech-to-speech, foi perceptível que linguagens como Java ou Go são mais adequadas por possuírem multithreading de verdade nativo.
- **Quando não usar React (puro):** Evito React Client-Side quando o sistema depende de um SEO (Search Engine Optimization) muito forte, preferindo SSR nesses casos.
- **Next.js e Hospedagem em Nuvem:** Antigamente, eu hesitava em usar Next.js fora do ecossistema da Vercel (em AWS, Azure, GCP), pois exigia ferramentas como o OpenNext. Porém, com a evolução no Next 16, a chegada do *adapter API* e a mudança na política agressiva de cache (que não faz mais cache de tudo por padrão), o Next.js tornou-se uma opção viável e madura para mim em qualquer Cloud.
