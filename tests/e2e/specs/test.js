// https://docs.cypress.io/api/introduction/api.html
const pin = '1234'
const key = 'df51f401a9611c838a8147d35b55c8e42918965f311e22043f77d62b0acfc65b'
const friend = '3HpfwsgoECnjSXBN4HAS1o87HxErQMQAc'
const setPrivKey = (key_ = key, pin_ = pin) => {
  cy.get('#app').find('#privkey').clear().type(key_)
  cy.get('#app').find('#newpin').clear().type(pin_)
  cy.get('form').submit()
}

const logIn = (pin_ = pin) => {
  cy.get('#app').find('#pin').clear().type(pin_)
  cy.get('form').submit()
}

const sendCoins = (amt = null, to = friend) => {
  cy.get('#app').find('#amt').clear()
  if (amt) {
    cy.get('#app').find('#amt').type(amt)
  }

  cy.get('#app').find('#to').clear()
  if (to) {
    console.log('to:::', to)
    cy.get('#app').find('#to').type(to)
  }

  cy.get('form').submit()
}

describe('happy path', () => {
  it('lands at the app, adds new private key and pin, sends coins to friend', () => {
    cy.visit('/')
    cy.get('#app').find('#unlock')
    setPrivKey()
    cy.get('#app').find('#wallet')
    const amt = 666
    cy.get('#balance').invoke('val').then((preBalance) => {
      sendCoins(amt)
      cy.wait(3000)
      cy.get('#balance').should('have.value', (preBalance - amt).toString())
    })
    cy.reload()
    cy.get('#app').find('#unlock')
    logIn()
    cy.get('#app').find('#wallet')
  })

  it('reports errors when setting an invalid privatekey or pin', () => {
    cy.visit('/')
    cy.get('#app').find('#unlock')
    setPrivKey('asdf', 1234)
    cy.contains('#error', 'Please make sure your private key is valid')
    setPrivKey(key, 123)
    cy.contains('#error', 'Please make sure your pin is more than 4 characters long')
  })

  it('reports errors when sending invalid txs', () => {
    cy.visit('/')
    cy.get('#app').find('#unlock')
    setPrivKey()
    cy.get('#app').find('#wallet')
    sendCoins(0)
    cy.contains('#error', 'Please select a valid amount')
    sendCoins(2, false)
    cy.contains('#error', 'WHOM TO?')
  })
})


