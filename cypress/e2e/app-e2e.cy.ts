describe('First access redirects unauthenticated user from "/" to "/sign-in" route', () => {
  it('should redirect to /sign-in', () => {
    cy.visit('/')

    cy.location('pathname', { timeout: 3000 }).should('eq', '/sign-in')

    cy.get('form').should('exist')
    cy.contains('Bem vindo').should('exist')
    cy.get('input[name="email"]').should('exist')
    cy.get('input[name="password"]').should('exist')
    cy.contains('Entrar com GitHub').should('exist')
  })
})

describe('Authenticated user access', () => {
  // All remaining tests will run in the same closure in order to take advantage of a single session.
  // Session management (session share) is not handled by default by cypress

  // Also, we will only disconsider OAuth Sign In flow in this e2e test for some specific reasons, like: 
  // GH's OAuth UI can change from one day to the next, and the test may fail;
  // Handling cypress compatibility issues to GH's OAuth

  it("App's Full E2E Test", () => {
    // ======== Sign In ======== //
    cy.visit('/sign-in')

    cy.get('input[name="email"]').type('test_user@seeding.com')
    cy.get('input[name="password"]').type('AlmostSecurePass123!')
    
    cy.get('.credentials-form-submit').click()

    cy.wait(5000) // handles any possible server delay instead adding, handling/watching events or spinners statuses
     
    cy.url().should('include', '/')
    cy.url().should('eq', `${Cypress.config().baseUrl}/`)

    cy.get('h1').should('contain', 'Painel Administrativo')



    // ======== Adds Customer  ======== //
    cy.get('.add-customer-button').click()

    cy.get('.add-address-button').click()

    cy.get('.customer-form-submit').click()

    const customerFormFields = [
      ['name', 'email', 'birthday', 'rg', 'cpf', 'phone'],
      ['address_field_zipcode', 'address_field_street', 'address_field_number', 'address_field_city', 'address_field_state']
    ]

    customerFormFields[0].forEach(field => 
      cy.get(`input[name="${field}"]`).should('have.class', 'error')
    )

    cy.get('input[name="name"]').type('E2e Test User')
    cy.get('input[name="email"]').last().type('test_user@e2e.com')
    cy.get('input[name="birthday"]').type('01/01/2000')
    cy.get('input[name="rg"]').type('12.345.678-8')
    cy.get('input[name="cpf"]').type('123.456.789-99')
    cy.get('input[name="phone"]').type('(11) 94815-3588')

    cy.get('.customer-form-submit').click()

    customerFormFields[1].forEach(field => 
      cy.get(`input[name="${field}"]`).should('have.class', 'error')
    )

    cy.get('input[name="address_field_zipcode"]').type('02040-001')
    cy.get('input[name="address_field_street"').type('Street from e2e')
    cy.get('input[name="address_field_number"]').type('100')
    cy.get('input[name="address_field_city"]').type('São Paulo')
    cy.get('input[name="address_field_state"]').type('SP')

    cy.get('.add-address-button').click()

    cy.get('.remove-address-button').last().click()

    cy.get('input[name="address_field_zipcode_2').should('not.exist')

    cy.get('.add-address-button').click()

    cy.get('input[name="address_field_zipcode_2"]').type('02040-002')
    cy.get('input[name="address_field_street_2"').type('Street from e2e II')
    cy.get('input[name="address_field_number_2"]').type('200')
    cy.get('input[name="address_field_city_2"]').type('São Paulo')
    cy.get('input[name="address_field_state_2"]').type('SP')

    cy.get('.customer-form-submit').click()


    cy.wait(2000)

    // Verifies Customer has been added and displayed
    cy.get('table tbody tr').last().within(() => {
      cy.get('td').eq(0).should('contain', 'E2e Test User')
      cy.get('td').eq(1).should('contain', 'test_user@e2e.com')
      cy.get('td').eq(2).should('contain', '01/01/2000')
      cy.get('td').eq(3).should('contain', '12.345.678-8')
      cy.get('td').eq(4).should('contain', '123.456.789-99')
      cy.get('td').eq(5).should('contain', '(11) 94815-3588')
      cy.get('td').eq(7).should('contain', 'Ver')

      // Open address list modal
      cy.get('td').eq(7).click()
    })

    // Verify address is properly displayed in address list modal
    cy.get('.address-list').within(() => {
      cy.get('.address').first().within(() => {
        cy.get('p').eq(0).should('contain', 'Street from e2e'); cy.get('p').eq(0).should('contain', '100')
        cy.get('p').eq(1).should('contain', '02040-001')
        cy.get('p').eq(2).should('contain', 'São Paulo')
        cy.get('p').eq(3).should('contain', 'SP')
      })

      cy.get('.address').last().within(() => {
        cy.get('p').eq(0).should('contain', 'Street from e2e II'); cy.get('p').eq(0).should('contain', '200')
        cy.get('p').eq(1).should('contain', '02040-002')
        cy.get('p').eq(2).should('contain', 'São Paulo')
        cy.get('p').eq(3).should('contain', 'SP')
      })      
    })

    cy.get('.modal-close-button').click()

    cy.wait(2000)




    // ======== Edits Customer ======== //

    // Opens Customer Edit Form Modal
    cy.get('.edit-customer-icon').last().click()

    // Verify Customer's data is correctly shown in edit form
    cy.get('input[name="name"]').should('have.value', 'E2e Test User')
    cy.get('input[name="email"]').should('have.value', 'test_user@e2e.com')
    cy.get('input[name="birthday"]').should('have.value', '01/01/2000')
    cy.get('input[name="rg"]').should('have.value', '12.345.678-8')
    cy.get('input[name="cpf"]').should('have.value', '123.456.789-99')
    cy.get('input[name="phone"]').should('have.value', '(11) 94815-3588')

    cy.get('input[name="address_field_zipcode"]').should('have.value', '02040-001')
    cy.get('input[name="address_field_street"]').should('have.value', 'Street from e2e')
    cy.get('input[name="address_field_number"]').should('have.value', '100')
    cy.get('input[name="address_field_city"]').should('have.value', 'São Paulo')
    cy.get('input[name="address_field_state"]').should('have.value', 'SP')

    cy.get('input[name="address_field_zipcode_2"]').should('have.value', '02040-002')
    cy.get('input[name="address_field_street_2"]').should('have.value', 'Street from e2e II')
    cy.get('input[name="address_field_number_2"]').should('have.value', '200')
    cy.get('input[name="address_field_city_2"]').should('have.value', 'São Paulo')
    cy.get('input[name="address_field_state_2"]').should('have.value', 'SP')

    // Edit Customer name and some of address
    cy.get('input[name="name"]').clear().type('Updated E2e Test User')
    cy.get('input[name="address_field_street"]').clear().type('Updated Street from e2e')
    cy.get('input[name="address_field_number"]').clear().type('101')

    // Removes last address
    cy.get('.remove-address-button').last().click()  

    // Saves changes
    cy.get('.customer-form-submit').click()

    cy.wait(3000)
    
    // Verifies Customer Address's updated data is properly displayed in Address List
    cy.get('table tbody tr').last().within(() => {
      // Open address list modal
      cy.get('td').eq(7).click()
    })

    cy.get('.address-list').within(() => {
      cy.get('.address').should('have.length', 1)

      cy.get('.address').first().within(() => {
        cy.get('p').eq(0).should('contain', 'Updated Street from e2e'); cy.get('p').eq(0).should('contain', '101')
      })     
    })
    
    cy.get('.modal-close-button').last().click()



    
    // ======== Removes Customer ======== //
    cy.get('.remove-customer-icon').last().click()

    cy.wait(2000)

    cy.get('table tbody').should('have.length', 1)


    // ======== Sign Out ======== //
    cy.get('.sign-out-button').click()

    cy.wait(5000)

    cy.url().should('include', '/sign-in')
    cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`)

    cy.get('h1').should('contain', 'Bem vindo')
  })   
})
