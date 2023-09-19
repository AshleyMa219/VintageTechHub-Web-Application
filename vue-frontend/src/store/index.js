import { createStore } from 'vuex'
// import mutations from './mutations';
// import actions from './actions';
// import getters from './getters';

const state = {
  // user:  JSON.parse(window.sessionStorage.getItem('user')||'null'),
  cartItem: [],
  selectPhoneItem: {},
  cart: [],
  memoryCart: [],
  searchResult: {}
}

const mutations = {
  // SET_USER(state, payload) {
  //   state.user = payload
  //   window.sessionStorage.setItem('user',JSON.stringify(payload))
  // },
  setSelectedPhone(state, payload){
    for(let i = 0; i < state.memoryCart.length; i++){
      if(state.memoryCart[i]._id === payload._id){
        state.selectPhoneItem = state.memoryCart[i]
        return
      }
    }
    state.selectPhoneItem = payload
    state.memoryCart.push(payload)
  },
  addToCart(state, payload){
    for(let i = 0; i < state.cart.length; i++){
      if(state.cart[i].id == payload.id){
        state.cart[i].quantity += payload.quantity
        return
      }
    }
    state.cart.push(payload)
  },
  deleteItem(state, payload){
    for(let i = 0; i < state.memoryCart.length; i++){
      if(state.memoryCart[i]._id === payload.id){
        state.memoryCart[i].stock = payload.originalRemain
        console.log(state.memoryCart[i].stock);
      }
    }
    state.cart = state.cart.filter(item => {
      return item.id !== payload.id
    })
  },
  clearCart(state, payload){
    state.cart = []
  },
  InputSearch(state, payload){
    state.searchResult = payload
  }
}

const actions = {
  addToCart(context, phone){
    context.commit('addToCart', phone)
  },
}

export default createStore({
  state, mutations, actions
})