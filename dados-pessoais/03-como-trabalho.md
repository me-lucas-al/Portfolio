# Como trabalho

## Forma de colaborar e Code Reviews

Em situações de Code Review onde há divergência de opiniões, minha postura é baseada na escuta ativa e na lógica. Primeiramente, ouço e avalio se a sugestão faz sentido. Caso faça sentido, eu aceito, aprendo com o meu erro e altero o código. Caso a sugestão não faça sentido para o contexto ou requisitos do projeto, eu converso calmamente com a pessoa para expor as minhas considerações técnicas e o porquê de defender aquela solução.

## Garantia de Qualidade e Testes

Lido com testes e garantia de qualidade de forma bem estruturada e moderna:
- Sou adepto do **TDD** (Test-Driven Development) em muitas ocasiões, gostando de fazer os testes mockados primeiro e depois desenvolver a feature em si.
- Para **Testes Unitários**, minha ferramenta de escolha atual é o **Vitest**, pois permite padronizar a stack tanto no Backend quanto no Frontend (integrando perfeitamente com a React Testing Library).
- Para **Testes E2E (Ponta a Ponta)**, gosto muito do **Playwright** para simular o comportamento real do usuário e garantir o fluxo do sistema.
- Por fim, amarro tudo isso usando **CI/CD** (geralmente com GitHub Actions). Rodo as esteiras em todo Pull Request para garantir que o projeto 'builda' corretamente, o banco conecta e as migrations não vão quebrar nada.
