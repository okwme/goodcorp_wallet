<template lang="pug">
  form#unlock(@submit.prevent="submit")
    template(v-if="privateKeyHash")
      label Enter Pin
      input#pin(v-model="pin" type="password")
    template(v-else)
      div
        label Enter Private Key 
          a(@click.stop="generate()" href="#") (New)
          input#privkey(v-model="privateKey" type="text")
      div
        label Create New Pin
          input#newpin(v-model="pin" type="text")
    div
      input(type="image" src="/img/submit.png")
    a(@click.stop="reset()" href="#") Reset
</template>

<script>
import secp256k1 from 'secp256k1'
const { randomBytes } = require('crypto')
import {mapActions, mapState, mapGetters, mapMutations} from 'vuex'
export default {

  name: 'Unlock',

  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'privateKeyHash'
    ]),
    pin: {
      get () {
        return this.$store.state.pin
      },
      set (newVal) {
        this.setPin(newVal)
      }
    },
    privateKey: {
      get () {
        return this.$store.state.privateKey
      },
      set (newVal) {
        this.setPrivateKey(newVal)
      }
    }
  },
  methods: {
    generate () {
      let foo
      do {
        foo = randomBytes(32)
        this.privateKey = foo.toString('hex')
      } while (!secp256k1.privateKeyVerify(foo))
    },
    reset () {
      this.setPin(null)
      this.setPrivateKey(null)
      this.setPrivateKeyHash(null)
    },
    submit () {
      this.privateKeyHash ? this.login() : this.hashPrivateKey()
    },
    ...mapMutations({
      'setPin': 'SET_PIN',
      'setPrivateKey': 'SET_PRIVATE_KEY',
      'setPrivateKeyHash': 'SET_PRIVATE_KEY_HASH'
    }),
    ...mapActions([
      'hashPrivateKey',
      'login'
    ])
  }
}
</script>

<style lang="css" scoped>
form {
  text-align: center;
}
input {
  display: block;
  margin-left:auto;
  margin-right:auto;
  text-align: center;
}
</style>