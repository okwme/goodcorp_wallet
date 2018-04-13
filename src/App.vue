<template lang="pug">
  #app
    #header
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
#app {

}
#nav {

}
</style>
