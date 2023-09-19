export default{
  getCartItems(state){
    return [...state.cartItem]
  },
  getCartItemCount(state){
    return [...state.cartItem].length
  }
}