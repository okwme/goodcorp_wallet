<template lang="pug">
  #app
    #header GOODCORP
    wallet(v-if="unlocked")
    unlock(v-else) 
</template>

<script>
import Wallet from '@/components/Wallet'
import Unlock from '@/components/Unlock'
import {mapActions, mapState, mapGetters} from 'vuex'
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
      'address'
    ]),
    ...mapGetters([
      'unlocked'
    ])
  },
  methods: {
    ...mapActions(['init'])
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
  // letter-spacing:.1em;
}
label {
  font-size:48px;
  line-height:1.5em;
  color: $light;
  text-shadow: 2px 2px 2px #000;
  text-transform: uppercase;
}
a {
  font-size:24px;
  line-height:1.5em;
  font-family: arial black;
  color: $light;
  text-shadow: 2px 2px 2px #000; 
  text-decoration: none;
}
#list,
input[type="text"],
input[type="number"],
input[type="password"],
input[type="submit"] {

  font-size:24px;
  line-height:1.5em;
  font-family: arial black;
  // letter-spacing:.1em;

  margin:5px 5px;
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
input[type="submit"] {
  background-color: $light;
  color: $med;
  text-shadow: 2px 2px 2px #000; 

  -webkit-box-shadow:  2px 2px 2px 0px #000;
  -moz-box-shadow:  2px 2px 2px 0px #000;
  box-shadow:  2px 2px 2px 0px #000;
}
#header {
  font-size: 132px;
  line-height:1.5em;
  color: $light;
  text-shadow: 2px 2px 2px #000;
  max-width:1400px;
  text-align: right;
  margin: auto;
}
#app {

}
#nav {

}
</style>
