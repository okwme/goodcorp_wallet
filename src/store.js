import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let wallet, client
export default new Vuex.Store({
  state: {
    accounts: [],
    address: null
  },
  mutations: {
    UPDATE_ADDRESS (state, address) {
      state.address = address
    },
    UPDATE_BALANCE (state, balance) {
      state.balance = balance
    }
  },
  actions: {
    async init ({dispatch}) {
      let state = await dispatch('getState')
      console.log('current blockchain state:')
      console.log(state)

      // send a transaction like:
      let result = await dispatch('sendTx', { foo: 'bar' })
      console.log('result of submitting a transaction:')
      console.log(result)
      
    },
    getState () {
      return fetch('/state').then(res=>res.json())
    },
    sendTx ({}, tx) {
      return fetch('/txs', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify(tx)
      }).then(res => res.json())
    }
  }
})
