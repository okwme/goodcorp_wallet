import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import coins from 'coins'
import secp256k1 from 'secp256k1'
import CryptoJS from 'crypto-js'
import axios from 'axios'

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
    chainStateHash: null,
    status: null,
    error: null,
    sending: false
  },
  mutations: {
    UPDATE_SENDING (state, sending) {
      state.sending = sending
    },
    UPDATE_ERROR (state, error) {
      state.error = error
    },
    UPDATE_STATUS (state, status) {
      state.status = status
    },
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
      try {
        let privKey = await dispatch('decryptPrivateKey')
        let privKeyBuffer = Buffer.from(privKey, 'hex')
        if (secp256k1.privateKeyVerify(privKeyBuffer)) {
          commit('UPDATE_ADDRESS', coins.wallet(privKeyBuffer).address())
          commit('SET_PRIVATE_KEY', privKey)
        } else {
          dispatch('setError', 'Incorrect credentials, please try again')
        }
      } catch (error) {
        dispatch('setError', error)
      }
    },
    setError ({commit}, error) {
      commit('UPDATE_ERROR', error)
      if (error) {
        setTimeout(() => {
          commit('UPDATE_ERROR', null)
        }, 3000)
      }
    },
    setStatus ({commit}, status) {
      commit('UPDATE_STATUS', status)
      if (status) {
        setTimeout(() => {
          commit('UPDATE_STATUS', null)
        }, 3000)
      }
    },
    hashPrivateKey ({state, commit, dispatch}) {
      if (state.pin.length < 4) {
        dispatch('setError', 'Please make sure your pin is more than 4 characters long')
        return false
      }
      if (!isHex(state.privateKey)) {
        dispatch('setError', 'Please make sure your private key is valid')
        return false
      }
      let privKey = Buffer.from(state.privateKey, 'hex')
      if (!secp256k1.privateKeyVerify(privKey)) {
        dispatch('setError', 'Please make sure your private key is valid')
        return false
      }
      commit('UPDATE_ADDRESS', coins.wallet(privKey).address())
      commit('SET_PRIVATE_KEY_HASH', CryptoJS.AES.encrypt(state.privateKey, state.pin).toString())
      return true
    },
    decryptPrivateKey ({state, dispatch}) {
      if (!state.privateKeyHash || !state.pin) return false
      try {
        var bytes  = CryptoJS.AES.decrypt(state.privateKeyHash.toString('hex'), state.pin)
        return bytes.toString(CryptoJS.enc.Utf8)
      } catch (error) {
        dispatch('setError', error)
      }
    },
    getState ({state, commit}) {
      fetch('/state').then(async res=>{
        let chainState = await res.json()
        let chainStateHash = CryptoJS.MD5(JSON.stringify(chainState)).toString()
        if(state.chainStateHash !== chainStateHash) {
          commit('SET_CHAIN_STATE', chainState)
          commit('SET_CHAIN_STATE_HASH', chainStateHash)
        }
      })
    },
    send ({state, dispatch, commit}, {account, amount}) {
      if (state.sending) return
      commit('UPDATE_SENDING', true)
      let tx = {
        from: {
          amount: parseInt(amount),
          sequence: state.chainState.accounts[state.address].sequence,
          pubkey: secp256k1.publicKeyCreate(Buffer.from(state.privateKey, 'hex'))
        },
        to: {
          amount: parseInt(amount),
          address: account
        }
      }

      // sign tx
      let sigHash = coins.getSigHash(tx)
      tx.from.signature = secp256k1.sign(sigHash, Buffer.from(state.privateKey, 'hex')).signature
      return dispatch('sendTx', tx)
    },
    sendTx ({dispatch, commit}, tx) {
      dispatch('setStatus', 'Sending')
      return new Promise((resolve, reject) => {
        axios.post('/txs', tx).then((res) => {
          commit('UPDATE_SENDING', false)
          console.log(res)
          if (res.data.result.check_tx.code === 2) {
            dispatch('setStatus', res.data.result.check_tx.log)
            reject()
          } else {
            dispatch('setStatus', 'Success')
            resolve()
          }
        }).catch((error) => {
          commit('UPDATE_SENDING', false)
          reject(error)
        })
      })
    }
  },
  plugins: [createPersistedState({
    paths: ['privateKeyHash', 'chainState', 'chainStateHash']
  })]
})
