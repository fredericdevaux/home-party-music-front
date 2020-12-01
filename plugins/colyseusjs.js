import * as Colyseus from 'colyseus.js'

export default ({ app }, inject) => {
  inject('colyseus', Colyseus)
}
