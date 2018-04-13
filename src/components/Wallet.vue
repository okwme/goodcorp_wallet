<template lang="pug">
#wallet
  .left
    #globe
    #list
  .right
    #account
      input(v-model="address" readonly)
    #balance
      input(v-model="balance")
    #to
      label to
      input(v-model="to")
    #amt
      label amt
      input(v-model="amt")
    #send
      div(@click="send()")
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {

  name: 'Wallet',

  data () {
    return {
      balance: null,
      to: null,
      amt: null
    }
  },
  computed: {
    ...mapState([
      'address'
    ])
  },
  methods: {
    send () {
      console.log('send')
    }
  }
}
</script>

<style lang="css" scoped>
</style>