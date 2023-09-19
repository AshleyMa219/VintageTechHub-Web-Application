export default{
  addItemToCart(context, phone){
    context.commit('addItemToCart', phone)
  },
  removeItemFromCart(context, phone){
    context.commit('removeItemFromCart', phone)
  }
}