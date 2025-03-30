import { defineConfig } from 'cypress'
 
export default defineConfig({
  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(_, __) {},
    baseUrl: 'http://localhost:3000',
  },
  env: {
    tsconfig: 'src/infrastructure/api/testing/tsconfig.cypress.json'
  }
})
