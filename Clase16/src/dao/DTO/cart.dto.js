export default class CartDTO {
  constructor(cart) {
    this.userId = cart[0].userId;
    this.id = cart[0]._id || cart[0].id; //this is how to handle mongoose _id or memory id
    this.productsArray = [];
    if (Array.isArray(cart[0].productsArray) && cart.productsArray[0].length) {
      //then cart have an array inside, the entry point is productsArray
      cart[0].productsArray.forEach((product, index) => {
        this.productsArray.push({
          prodId: product.prodId, //ROMINA! ver que en el caso de Mongo trae toda la descripcion del producto,hacer lo mismo con memoria
          quantity: product.quantity,
        });
      });
    }
  }
}
