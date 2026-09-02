# FAQ para recrutadores

> O objetivo é responder direto, sem repetir dados que o assistente já busca no banco (disponibilidade de currículo, links de contato etc.).

## Qual foi o bug mais difícil ou maior desafio técnico que o Lucas já resolveu?

Foi um episódio envolvendo um dos sistemas mais importantes da empresa chamado **Star Lockers**. O sistema simplesmente caiu e todas as informações de variáveis de ambiente do servidor foram perdidas. 

Para piorar a situação: era uma sexta-feira, eu era muito novo na empresa e estava completamente sozinho, pois meu colega de TI mais experiente só voltaria na segunda-feira. Como o sistema era extremamente utilizado nos finais de semana, eu precisava agir rápido, mesmo não tendo grande domínio de servidores VPS na época.

As variáveis de ambiente locais eram bastante diferentes das variáveis que rodavam em produção. Tive que mapear, adaptar e testar cada uma na raça para o servidor. Literalmente no último minuto, instantes antes de ir embora, eu consegui subir o sistema novamente. Foi um momento de extrema pressão que demonstrou minha resiliência e capacidade de resolução de problemas de forma autônoma.

## Casos de Sucesso e Desafios por Projeto

### Como você reduziu em 91% o tempo de carregamento na Star Seg?
A chave foi mudar radicalmente a estratégia de renderização e de gerenciamento de estado. Antes, a busca dependia de Client-Side Rendering pesando `useEffect`. Eu refatorei a arquitetura para ser o mais Server-Side possível no Next.js. Movi a paginação para **Server Actions** e passei a controlar as buscas e filtros via **Search Params na URL**, abandonando os estados locais assíncronos. Com a carga inicial sendo feita no servidor, o ganho de performance foi massivo.

### Como funciona o sistema de tradução de erros com IA na Star Seg?
Para traduzir erros técnicos (como restrições de banco) em alertas amigáveis para o usuário, integrei a aplicação com os modelos **Gemini Flash e Gemma**. Como cada chamada à IA tem custo financeiro e de latência, construí um **mecanismo de cache no banco de dados**. Quando ocorre um erro técnico, o sistema primeiro consulta a tabela de cache; se já houve aquele erro antes, ele devolve a tradução na hora. Se for um erro inédito, ele chama a IA, exibe para o usuário e salva a resposta no banco para a próxima vez. Isso cortou custos e otimizou requisições.

### Por que você introduziu o Docker no fluxo de desenvolvimento da Star Seg?
Para garantir **paridade de ambiente**. Antes usávamos XAMPP no Windows (que é *case-insensitive*), mas o servidor de produção era Linux (*case-sensitive*). Um dia, uma *migration* do Prisma foi com a capitalização errada: passou batido no dev, mas quebrou a produção. Arrumar isso gerou um erro de *drift* no estado do Prisma que causou muitas dores de cabeça. Para matar o mal pela raiz, subi o banco local via **Docker** (baseado em Linux). Nunca mais tivemos bugs de ambiente.

### Qual foi o maior desafio no Front-end do BNR System?
A tela mais complexa foi a interface de vendas de peças automotivas, que precisava ter a robustez e a usabilidade de um "Mercado Livre". O desafio foi orquestrar os múltiplos estados simultâneos: buscas textuais, filtros avançados, paginação e exibição. Para conseguir gerenciar toda essa comunicação sem *prop drilling*, estruturei tudo utilizando a **Context API** do React.

### Como foi lidar com arquivos complexos no MedSea Connect (Java)?
O projeto exigia centralizar todo o histórico dos pacientes (exames, anexos, laudos médicos, fotos). A regra de negócio mais desafiadora na época foi o mecanismo de armazenamento de arquivos, pois decidimos gravar tudo diretamente no banco de dados MySQL em formato **BLOB**. Gerenciar uploads, converter streams de arquivos binários e orquestrar isso com o Hibernate no Java Spring Boot sem degradar a performance foi um desafio de extrema complexidade que nós superamos.
