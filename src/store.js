import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import coins from 'coins'
import secp256k1 from 'secp256k1'
import CryptoJS from 'crypto-js'

Vue.use(Vuex)
let interval
const isHex = function (inputString) {
  var re = /[0-9A-Fa-f]{6}/g;
  return re.test(inputString)
}
export default new Vuex.Store({
  state: {
    privateKey: null,
    privateKeyHash: null,
    pin: null,
    address: null,
    chainState: null,
    chainStateHash: null
  },
  mutations: {
    SET_CHAIN_STATE (state, chainState) {
      state.chainState = chainState
    },
    SET_CHAIN_STATE_HASH (state, chainStateHash) {
      state.chainStateHash = chainStateHash
    },
    SET_PIN (state, pin) {
      state.pin = pin
    },
    SET_PRIVATE_KEY (state, privateKey) {
      state.privateKey = privateKey
    },
    SET_PRIVATE_KEY_HASH (state, privateKeyHash) {
      state.privateKeyHash = privateKeyHash
    },
    UPDATE_ADDRESS (state, address) {
      state.address = address
    },
    UPDATE_BALANCE (state, balance) {
      state.balance = balance
    }
  },
  getters: {
    unlocked (state, dispatch) {
      return state.pin && state.privateKeyHash && state.privateKey
    }
  },
  actions: {
    async init ({dispatch}) {
      await dispatch('getState')

      if (interval) clearInterval(interval)
      interval = setInterval(() => {
        dispatch('getState')
      }, 1000)
    },
    async login ({dispatch, commit}) {
      let privKey = await dispatch('decryptPrivateKey')
      let privKeyBuffer = Buffer.from(privKey, 'hex')
      if (secp256k1.privateKeyVerify(privKeyBuffer)) {
        commit('UPDATE_ADDRESS', coins.wallet(privKeyBuffer).address())
        commit('SET_PRIVATE_KEY', privKey)
      } else {
        alert('Please try again')
      }
    },
    hashPrivateKey ({state, commit}) {
      if (state.pin.length < 4) {
        alert('Please make sure your pin is more than 4 characters long')
        return false
      }
      if (!isHex(state.privateKey)) {
        alert('Please make sure your private key is valid')
        return false
      }
      let privKey = Buffer.from(state.privateKey, 'hex')
      if (!secp256k1.privateKeyVerify(privKey)) {
        alert('Please make sure your private key is valid')
        return false
      }
      commit('UPDATE_ADDRESS', coins.wallet(privKey).address())
      commit('SET_PRIVATE_KEY_HASH', CryptoJS.AES.encrypt(state.privateKey, state.pin).toString())
      return true
    },
    decryptPrivateKey ({state}) {
      if (!state.privateKeyHash || !state.pin) return false
      var bytes  = CryptoJS.AES.decrypt(state.privateKeyHash.toString(), state.pin)
      return bytes.toString(CryptoJS.enc.Utf8)
    },
    getState ({state, commit}) {
      fetch('/state').then(async res=>{
        let chainState = await res.json()
        let chainStateHash = CryptoJS.MD5(chainState)
        if(state.chainStateHash !== chainStateHash.toString()) {
          commit('SET_CHAIN_STATE', chainState)
          commit('SET_CHAIN_STATE_HASH', chainStateHash.toString())
        }
      })
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
  },
  plugins: [createPersistedState({
    paths: ['privateKeyHash', 'chainState', 'chainStateHash']
  })]
})
