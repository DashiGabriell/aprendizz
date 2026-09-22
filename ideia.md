O vídeo apresenta uma estratégia prática para quem deseja se tornar um desenvolvedor backend contratável em poucos meses, sem a necessidade de aprender tecnologias infinitas ou dominar todo o ecossistema desde o início. O foco é construir competências reais e uma base sólida, em vez de apenas acumular certificados.

Roteiro de estudos recomendado:

1. Fundamentos (0:00 - 4:02): Não comece por frameworks. Entenda primeiro como a web funciona, especificamente o protocolo HTTP (requisições, respostas, headers, status codes).
2. Escolha uma Stack (4:03 - 5:02): Escolha uma linguagem e framework (ex: Node.js com TypeScript ou Java com Spring Boot) e mantenha-se nela tempo suficiente para se tornar proficiente, evitando a troca constante de tecnologias.
3. Banco de Dados (5:03 - 5:52): Priorize o aprendizado de SQL puro (joins, índices, transações) em vez de depender apenas de ORMs, que escondem a complexidade necessária para resolver problemas reais.
4. Prática com Projetos (5:53 - 6:42): Construa um projeto relevante (como um sistema de gestão de academia) que te force a lidar com modelagem de dados, autenticação e validações.
5. Ferramentas de Profissional (6:43 - 9:53): Aprenda a implementar autenticação (quem você é) vs autorização (o que você pode fazer), além de testes, Git (fluxos reais como Pull Requests), Docker e processos de deploy.
6. Resolução de Problemas (9:54 - 10:33): Desenvolva a habilidade de debugar e ler códigos escritos por outras pessoas, saindo da bolha dos seus próprios projetos.

O que ignorar agora (10:34 - 11:39):
O autor enfatiza que você não precisa aprender tecnologias complexas como Kubernetes, arquitetura de microsserviços ou dominar todos os serviços da AWS antes de conseguir sua primeira vaga. O objetivo é construir a "base da casa" antes de tentar fazer o teto.

Dica final:
Comece a procurar emprego antes de se sentir 100% pronto (12:15). As entrevistas fazem parte do aprendizado, ajudando a identificar suas lacunas técnicas para os próximos estudos.

https://youtu.be/Lb_ukEG8U-k?is=YvRUTSkk3MjB5Sk0


Eu preciso de ajuda para estudar isso

Gabriel, vamos transformar esse roteiro em um plano de estudos de Backend focado em empregabilidade, mas adaptado à sua realidade.

Você já tem contato com desenvolvimento de aplicações, Supabase, React, TypeScript, APIs e projetos próprios, como o AondeTem e a V-Project. Isso significa que você não precisa necessariamente começar do zero.

O que precisamos fazer é transformar o conhecimento que você já adquiriu em uma base sólida de Backend, para que você consiga:

Desenvolver APIs profissionais do zero.
Entender o que acontece por trás de uma aplicação web.
Trabalhar com bancos de dados relacionais sem depender exclusivamente de ferramentas visuais ou ORMs.
Construir sistemas seguros, testáveis e preparados para produção.
Ter projetos no GitHub que demonstrem suas competências para recrutadores.
Conseguir explicar suas decisões técnicas durante entrevistas.

A ideia não é estudar tudo sobre Backend. É estudar o que um desenvolvedor Backend Júnior precisa saber para trabalhar em uma equipe real.

1. Nossa estratégia: Node.js + TypeScript

Minha sugestão inicial é você seguir com Node.js + TypeScript + PostgreSQL.

Essa escolha faz sentido para você porque já trabalha com TypeScript e aplicações web. Você poderá aproveitar parte do conhecimento atual, enquanto aprofunda o Backend.

Tecnologia	O que você vai aprender
JavaScript	Fundamentos da linguagem no servidor
TypeScript	Tipagem, interfaces, tipos e organização
Node.js	Execução de JavaScript no Backend
HTTP	Comunicação entre clientes e servidores
Express	Construção de APIs REST
PostgreSQL	Modelagem, consultas e integridade de dados
Git e GitHub	Versionamento e colaboração
Jest ou Vitest	Testes automatizados
Docker	Ambiente de desenvolvimento reproduzível
Deploy	Publicação e manutenção de APIs

Não vamos começar com microsserviços, Kubernetes ou arquiteturas excessivamente complexas.

Nosso primeiro objetivo é você conseguir construir, explicar, testar e publicar uma API completa.

2. Seu plano de estudos — 12 semanas

A proposta é estudar de segunda a sexta, por aproximadamente 1h30 a 2h por dia. Isso dá cerca de 90 a 120 horas de estudo ao longo de 12 semanas.

É um plano intensivo de construção de base, não uma promessa de contratação em 90 dias. Seu progresso dependerá do domínio que você já tem e da prática realizada.

Fase 1 — Entender a Web e o Backend
Semana 1: Como a Web funciona

Objetivo: entender o que acontece quando alguém acessa um site, faz login ou envia um formulário.

Estude:

O que é cliente e servidor.
O que é HTTP e HTTPS.
Requisições e respostas.
Métodos HTTP: GET, POST, PUT, PATCH e DELETE.
Headers, body e query parameters.
Status codes: 200, 201, 400, 401, 403, 404 e 500.
JSON e comunicação entre aplicações.

Prática obrigatória:
Use o navegador e o Postman ou Insomnia para inspecionar requisições HTTP. Crie requisições para uma API pública e identifique seus métodos, headers, parâmetros e respostas.

Você estará pronto para avançar quando conseguir explicar o caminho de uma requisição do navegador até o servidor e de volta.

Semana 2: Node.js e TypeScript no Backend

Objetivo: sair do TypeScript usado no Frontend e começar a utilizá-lo no servidor.

Estude:

O que é Node.js.
Diferenças entre Frontend e Backend.
Módulos e imports.
NPM e gerenciamento de dependências.
Async/await e Promises.
Tratamento de erros.
Variáveis de ambiente.
Organização de arquivos e módulos.

Prática obrigatória:

Construa um pequeno programa em Node.js que receba dados, processe informações e retorne resultados. Depois, transforme-o em um servidor HTTP simples.

Fase 2 — Construir APIs e dominar bancos de dados
Semana 3: Construção de APIs REST

Estude:

O que é uma API REST.
Rotas e controllers.
Parâmetros de rota e query.
Request e Response.
Validação de dados.
Tratamento centralizado de erros.
Separação de responsabilidades.

Prática: crie uma API de gerenciamento de tarefas com operações de cadastro, consulta, atualização e exclusão.

Semana 4: PostgreSQL e SQL de verdade

Essa será uma das semanas mais importantes do seu aprendizado.

Estude:

Tabelas, linhas e colunas.
Chaves primárias e estrangeiras.
Relacionamentos 1:1, 1:N e N:N.
SELECT, INSERT, UPDATE e DELETE.
JOINs.
GROUP BY e funções de agregação.
Índices.
Constraints.
Transações.

Prática: modele um banco de dados para um sistema de academias, com alunos, planos, pagamentos e matrículas.

Não quero que você apenas consiga fazer um CRUD. Quero que entenda por que os dados foram modelados daquela maneira.

Semana 5: Integração entre API e Banco de Dados

Estude:

Conexão do Node.js com PostgreSQL.
Pool de conexões.
Queries parametrizadas.
SQL Injection.
Repositórios e organização da camada de dados.
Paginação, filtros e ordenação.
Migrations.

Prática: conecte sua API ao PostgreSQL e faça com que os dados persistam no banco.

Ao final da quinta semana, você deverá ter uma API funcional, conectada a um banco de dados relacional.

Fase 3 — Segurança e qualidade profissional
Semana 6: Autenticação e autorização

Estude:

Hash de senhas.
Login e cadastro.
Sessões e tokens.
JWT.
Autenticação versus autorização.
Middleware.
Controle de acesso por perfil.
Proteção de rotas.

Prática: implemente cadastro e login, além de uma área administrativa acessível apenas a usuários autorizados.

Semana 7: Testes automatizados

Estude:

Por que testar.
Testes unitários.
Testes de integração.
Testes de endpoints.
Mocks e stubs.
Cobertura de testes.
Testes de cenários de erro.

Prática: escreva testes para cadastro de usuários, autenticação e operações de banco de dados.

Semana 8: Git e fluxo de trabalho profissional

Estude:

Branches.
Commits bem escritos.
Pull Requests.
Merge e resolução de conflitos.
Code Review.
Issues.
README técnico.

Prática: desenvolva uma nova funcionalidade em uma branch separada, faça commits organizados e abra um Pull Request no GitHub.

Mesmo trabalhando sozinho, você pode simular esse fluxo para aprender a trabalhar de maneira colaborativa.

Fase 4 — Preparação para o mercado
Semana 9: Docker

Estude:

O que é containerização.
Imagens e containers.
Dockerfile.
Docker Compose.
Variáveis de ambiente.
Como executar uma API e um PostgreSQL em containers.

Prática: coloque sua API e seu banco de dados em um ambiente Docker funcional.

Semana 10: Deploy e produção

Estude:

Build e execução em produção.
Configuração de variáveis de ambiente.
Logs.
CORS.
Health checks.
Migrações em produção.
Conceitos básicos de CI/CD.

Prática: publique sua API, conecte-a a um banco de dados hospedado e documente como utilizá-la.

Semana 11: Projeto de portfólio

Agora você construirá um projeto completo, utilizando o conhecimento acumulado.

Minha sugestão é desenvolver uma API de gestão de uma pequena academia, contendo:

Cadastro e autenticação de usuários.
Controle de alunos.
Cadastro de planos.
Matrículas.
Controle de pagamentos.
Perfis de acesso.
PostgreSQL.
Testes automatizados.
Docker.
Deploy.

O diferencial será a qualidade técnica, não a quantidade de funcionalidades.

Semana 12: Entrevistas e resolução de problemas

Estude e pratique:

Leitura de código escrito por terceiros.
Debugging.
Refatoração.
Resolução de problemas com arrays, objetos, strings e mapas.
Perguntas comuns de Backend Júnior.
Explicação de decisões técnicas.
Simulações de entrevistas.

Comece a se candidatar a vagas compatíveis com seu nível, mesmo que ainda existam lacunas.

Não espere concluir as 12 semanas para olhar o mercado.

3. Como vamos estudar juntos

Não quero que você apenas leia conteúdos e assista a vídeos. Vamos trabalhar em um ciclo de aprendizado que obrigue você a realmente compreender o assunto.

Seu ciclo diário de estudos
Tempo	Atividade
20 min	Aprender um conceito
20 min	Analisar exemplos de código
40 min	Resolver um exercício sem copiar
10 min	Revisar o que aprendeu e registrar dúvidas

Se tiver duas horas disponíveis, use o tempo adicional para aprofundar os exercícios.

Uma regra importante: não vamos pular de assunto só porque você conseguiu fazer o código funcionar. Você precisa conseguir explicar o que fez.

Para cada assunto, podemos seguir este formato:

Eu explico o conceito de forma didática.
Mostro exemplos práticos.
Proponho exercícios progressivos.
Você tenta resolver.
Eu reviso sua solução e explico os erros.
Só então avançamos para o próximo tópico.

Você pode inclusive me enviar seu código do Cursor ou do GitHub para revisarmos juntos.

4. Seu primeiro projeto: Backend de um sistema real

Quero aproveitar sua experiência com o AondeTem.

Em vez de criar cinco projetos pequenos e desconectados, podemos construir uma API de gestão de comércios locais, inspirada no AondeTem, ao longo dos estudos.

Imagine uma API que permita:

POST   /auth/register
POST   /auth/login

GET    /businesses
GET    /businesses/:id
POST   /businesses
PATCH  /businesses/:id
DELETE /businesses/:id

POST   /businesses/:id/reviews
GET    /businesses/:id/reviews

Inicialmente, ela pode funcionar com dados simulados. Depois, evoluímos para PostgreSQL, autenticação, autorização, testes, Docker e deploy.

Isso permitirá que você veja a evolução de uma aplicação real, desde um servidor simples até uma API pronta para ser apresentada em seu portfólio.

Atenção: o objetivo desse projeto de estudos será construir o Backend de forma independente. Não depender exclusivamente do Supabase para resolver tudo por você. Você pode continuar usando o Supabase como infraestrutura PostgreSQL, mas precisará entender o que acontece por trás das operações.

5. Vamos começar pelo primeiro assunto

Antes de avançarmos, quero estabelecer um ponto de partida.

Aula 01 — O que realmente acontece quando uma aplicação faz uma requisição?

Imagine que um usuário entre no AondeTem e clique em uma loja.

O caminho simplificado é:

O Frontend solicita os dados da loja.
A requisição HTTP chega à API.
O Backend interpreta a requisição.
O Backend consulta o banco de dados.
O banco retorna os dados.
O Backend envia uma resposta HTTP em JSON.
O Frontend apresenta as informações ao usuário.

Esse fluxo é a base de praticamente tudo que você construirá como desenvolvedor Backend.

Seu primeiro exercício, antes de escrever qualquer código:

Imagine que o usuário acesse a ficha de um comércio no AondeTem.

Responda com suas próprias palavras:

Qual é a função do Frontend nesse processo?
O que é uma requisição HTTP?
Por que o Frontend não deveria acessar diretamente o banco de dados com credenciais administrativas?
Qual seria a responsabilidade do Backend nessa operação?
O que você imagina que aconteceria se o comércio solicitado não existisse no banco?

Não precisa pesquisar nem buscar respostas perfeitas. Quero entender como você raciocina hoje.

A partir das suas respostas, vamos iniciar sua primeira aula de Backend de verdade, identificando o que você já domina e o que precisamos fortalecer.