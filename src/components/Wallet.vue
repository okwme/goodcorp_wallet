<template lang="pug">
#wallet
  .left
    #globe
      img(src="/img/globe.png")
    #list
      div(v-for="(acct, i) in walletList" )
        a(@click.prevent="pick(i)" 
        href="#" 
        :key="acct.address"
        ) {{trim(acct.address)}} - {{acct.balance}}
  .right
    form(@submit.prevent="send({account:to, amount: amt})")
      #account
        label account 
        input(v-model="address" readonly type="text")
      #balance
        label balance 
        input(v-model="balance" readonly type="number")
      #to
        label to 
        input(v-model="to" type="text")
      #amt
        label amt 
        input(v-model="amt" type="text")
      #send
        input(type="submit" value="SEND")
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {

  name: 'Wallet',

  data () {
    return {
      to: null,
      amt: null
    }
  },
  computed: {
    ...mapState([
      'address',
      'chainState'
    ]),
    balance () {
      return this.chainState.accounts[this.address].balance
    },
    walletList () {
      return this.chainState && Object.keys(this.chainState.accounts).map((a) => {
        let foo = this.chainState.accounts[a]
        foo.address = a
        return foo
      })
    }
  },
  methods: {
    ...mapActions([
      'send'
    ]),
    trim (str) {
      return str.substring(0, 8) + '…'
    },
    pick (i) {
      console.log(this.walletList[i])
      this.to = this.walletList[i].address
    }
  }
}
</script>

<style lang="scss" scoped>
#wallet {
  width:100%;
  .left, .right {
    display: inline-block;
    width:50%;
  }
}
</style>