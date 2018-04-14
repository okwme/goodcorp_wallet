<template lang="pug">
  #app
    #header GOODCORP
    wallet(v-if="unlocked")
    unlock(v-else) 
    h4#error(@click="setError(null)" v-if="error") {{error}}
    h4#status(@click="setStatus(null)" v-if="status") {{status}}
</template>

<script>
import Wallet from '@/components/Wallet'
import Unlock from '@/components/Unlock'
import {mapActions, mapState, mapGetters, mapMutations} from 'vuex'
export default {
  name: 'App',
  data () {
    return {
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    chainState () {
      console.log('chainState changed')
    }
  },
  computed: {
    ...mapState([
      'chainState',
      'accounts',
      'address',
      'error',
      'status'
    ]),
    ...mapGetters([
      'unlocked'
    ])
  },
  methods: {
    ...mapActions([
      'init',
      'setError',
      'setStatus'
    ])
  },
  components: {
    Wallet,
    Unlock
  }
}
</script>
<style lang="scss">

$light: #ffffff;
$med: #e6e6e6;
$dark: #d4d4d4;

body {
  background-color: $med;
  font-size:24px;
  line-height:1.5em;
  font-family: arial black;
}
label {
  font-size:48px;
  line-height:1.5em;
  vertical-align: bottom;
  color: $light;
  text-shadow: 2px 2px 2px #000;
  text-transform: uppercase;
}
a {
  font-size:24px;
  line-height:1.5em;
  font-family: arial black;
  text-transform: uppercase;
  color: $light;
  text-shadow: 2px 2px 2px #000; 
  text-decoration: none;
}
*:focus {outline:0;}
#list,
input[type="text"],
input[type="number"],
input[type="password"],
input[type="image"],
input[type="submit"] {

  font-size:24px;
  line-height:1.5em;
  font-family: arial black;
  // letter-spacing:.1em;
  text-align: right;
  margin:0px 5px 10px 5px;
  background-color: $dark;
  color: $light;
  border: none;
  border-radius: 5px;
  padding:5px;
  text-shadow: 2px 2px 2px #000; 
  -webkit-box-shadow: inset 2px 2px 2px 0px #000;
  -moz-box-shadow: inset 2px 2px 2px 0px #000;
  box-shadow: inset 2px 2px 2px 0px #000;
}
input[type="image"],
input[type="submit"] {

  font-family: arial black;
  background-color: $light;
  color: $dark;
  text-transform: uppercase;
  text-shadow: 0px 0px 0px #000; 
  margin:15px 5px;
  display:block;
  padding:5px;
  -webkit-box-shadow:  2px 2px 2px 0px #000;
  -moz-box-shadow:  2px 2px 2px 0px #000;
  box-shadow:  2px 2px 2px 0px #000;
}
#header {
  font-size: 132px;
  line-height:1em;
  color: $light;
  text-shadow: 2px 2px 2px #000;
  // max-width:1160px;
  text-align: center;
  margin: 0px 0px 50px 0px ;
}
#error {
  text-align: center;
  color: red;
  cursor: pointer;
}
#status {
  text-align: center;
  color: green;
  cursor: pointer;
}
</style>
