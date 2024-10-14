# TO-do

## Descrição

API desenvolvida em Node.js onde os usuários podem se cadastrar e persistir dados de tarefas. As senhas são criptografadas para maior segurança dos usuários. A aplicação conta com integração ao Redis para atualização de cache e persistência de dados no banco SQL.

Possui autenticação de token utilizando JWT, e o front-end se comunica com o back-end via Ajax.

**Upado na nuvem (não funcional):** [https://white-rock-01183cf0f.5.azurestaticapps.net](https://white-rock-01183cf0f.5.azurestaticapps.net) - correção em breve.

## Bibliotecas Utilizadas

- `bcrypt` - Para criptografia de senhas
- `cors` - Para habilitar CORS
- `express` - Framework para construção de APIs
- `jsonwebtoken` - Para autenticação com tokens
- `mysql2` - Para conexão com o banco de dados SQL
- `redis` - Para gerenciamento de cache

## Instalação de Dependências

Para instalar as dependências do projeto, utilize o seguinte comando:

```bash
npm install bcrypt cors express jsonwebtoken mysql2 redis
