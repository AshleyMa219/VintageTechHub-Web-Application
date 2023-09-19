export default{
  addItemToCart(state, phone){
    state.cartItem.push(phone)
  },
  removeItemFromCart(state, phone){
    const target = state.cartItem.findIndex(item => item.id === phone.id)
    state.cartItem.splice(target, 1);
  }
}