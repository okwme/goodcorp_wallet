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
        input(v-model="address" readonly type="text")
      #balance
        label.block balance 
        input(v-model="balance" readonly type="number")
      #to
        label to 
        input(v-model="to" type="text")
      #amt
        label amt 
        input(v-model="amt" type="text")
      #send
        input(type="image" src="/img/send.png" value="SEND")
      img(src="/img/arrow.png")
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
    account () {
      return this.chainState && this.chainState.accounts[this.address]
    },
    balance () {
      console.log(this.account)
      return this.account ? this.account.balance : 0
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
      return str.substring(0, 8)
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .left, .right {
      min-width: 500px;
      max-width: 500px;
      flex-basis: auto; /* default value */
      flex-grow: 1;
  }
  .left {
    // min-width: 450px;
    // max-width: 450px;
  }
  .right {
    text-align: right;
    margin-left:50px;
    .block {
      display: block;
      margin-right:50px;
    }
    input[type="image"] {
      margin-left:290px;
      margin-right: 0px;
    }
    img {
      position:relative;
      left:105px;
    }
  }
  #list{
    text-align:left;
    margin-top:50px;
    margin-left:160px;
    a {
      // font-family: courier;
    }
  }
}
</style>