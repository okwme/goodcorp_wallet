let lotion = require('lotion')
let shea = require('shea')
let coins = require('coins')

let app = lotion({
  devMode: process.env.PRODUCTION !== 'true'
})

app.use(coins({
  // coins options
  name: 'goodcoin',
  initialBalances: {
    'Q63F7qhMtouaC53zLNjFinZ5mgBzaAJuo': 21000000
  }
}))

app.useBlock(function (state, chainInfo) {
  // console.log(state)
})

app.use(shea('public/'))

let port = process.env.PORT || 3000
app.listen(port).then(({ GCI }) => {
  console.log('App GCI:', GCI)
  console.log('localhost:' + port)
})



      // import lotion from 'lotion'
      // import coins from 'coins'

      // client = await lotion.connect(APP_GCI)
      // wallet = coins.wallet(client)

      // // wallet methods:
      // let address = wallet.address()
      // console.log('address', address)
      // commit('UPDATE_ADDRESS', address)

      // let balance = await wallet.balance()
      // console.log('balance', balance)
      // commit('UPDATE_BALANCE', balance)

      // let result = await wallet.send('04oDVBPIYP8h5V1eC1PSc5JU6Vo', 5)
      // console.log(result) // { height: 42 }