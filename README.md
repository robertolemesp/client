This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
Começe por instalar as dependencias/bibliotecas selecionadas para a Missão (recomenda-se uso do yarn):

```bash
yarn 
#ou via npm
npm i
```
Then, run the development server:

```bash
# or
yarn dev
# or
npm run dev
# or
pnpm dev
# or
bun dev
```

# API
- Execute a aplicação servidor e consiga consumir os recursos da API (e vide seu respectivo README.md) via este client

Open [http://localhost:3000](http://localhost:3000) with your browser to access application.

# Login
- Utilizar o seguinte usuário: 
  test_user@seeding.com
  AlmostSecurePass123!

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Running Tests

# All
```bash
yarn test
# or
npm run test
```

# Run integration or unit tests
```bash
yarn jest path/to/your/test/file.spec.tsx
# or
npx jest path/to/your/test/file.spec.tsx
```

# Run e2e tests
Before all, the backend should run with test flag enabled, to do that set `APP_ENV` .env variable value to `test`.

Firstly, run our application Next's server:

```bash
yarn dev
# or
npm run dev
```

Secondly, run cypress:

```bash
yarn cypress
# or
npx cypress
```

Then the cypress GUI will open, click in the "E2E Testing" (which is the first option in cypress [14.1]). Cypress will initialize. After that, select the desired browser to be used, and click on "Start E2E Testing in <'selected-browser'>" Button. The browser will be opened through cypress proccess and will be mapped. 

And now, in the browser's window opened by Cypress, select our e2e test in the cypress folder tree called: "app.cy.ts"

----------

## Docker

- Follow this documentation to install docker and docker compose into your SO: 
  - [https://docker.com/](https://docs.docker.com/get-started/),
  - [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)
  and then:


### 1. Build And Start the containers

  ```bash
  docker-compose up --build
  ```


This will start the following services:
  - **app**: Runs the NextJS Node's Server which serves our application


Open [http://localhost:3000](http://localhost:3000) with your browser to access application.


----------

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
