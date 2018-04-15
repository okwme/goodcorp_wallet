// https://docs.cypress.io/api/introduction/api.html
const pin = '1234'
const setPrivKey = () => {

  const key = 'df51f401a9611c838a8147d35b55c8e42918965f311e22043f77d62b0acfc65b'

  cy.get('#app').find('#privkey').type(key)
  cy.get('#app').find('#newpin').type(pin)
  cy.get('form').submit()
}

const logIn = () => {
  cy.get('#app').find('#pin').type(pin)
  cy.get('form').submit()
}

const sendCoins = (amt) => {
  const friend = '3HpfwsgoECnjSXBN4HAS1o87HxErQMQAc'
  cy.get('#app').find('#to').type(friend)
  cy.get('#app').find('#amt').type(amt)
  cy.get('form').submit()
}

describe('happy path', () => {
  it('lands at the app, adds new private key and pin, sends coins to friend', () => {
    cy.visit('/')
    cy.contains('h1', 'GOODCORP')
    setPrivKey()
    const amt = 666
    cy.get('#balance').invoke('val').then((preBalance) => {
      sendCoins(amt)
      cy.get('#balance').should('have.value', (preBalance - amt).toString())
    })
    cy.reload()
    logIn()
  })
})

