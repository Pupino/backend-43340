export default class ProductDTO {
  constructor(product) {
    this.id = product._id || product.id; //this is how to handle mongoose _id or memory id
    this.title = product.title;
    this.description = product.description;
    this.code = product.code;
    this.price = product.price;
    this.stock = product.stock;
    this.category = product.category;
    this.status = product.status;
    this.owner = product.owner;
  }
}
