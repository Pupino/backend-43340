let cartId;
let prodId;
document.addEventListener('DOMContentLoaded', function (event) {
  //console.log('Document Ready, create a cart!');
  const createCart = async () => {
    const response = await fetch('http://localhost:8080/api/carts', {
      method: 'POST',
      //body: myBody, // string or object
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const cartJson = await response.json(); //extract JSON from the http response
    //console.log(`cartJson: ${JSON.stringify(cartJson)}`);
    cartId = cartJson.data.id;
    //console.log(`cartId: ${cartId}`);
  };
  createCart();
});

const buttons = document.querySelectorAll('.cartBtn');

buttons.forEach((box) => {
  box.addEventListener('click', function handleClick(event) {
    //console.log('button clicked: ', event);
    //console.log('button id: ', this.id);
    //console.log(`Add prod id ${this.id} to cartId: ${cartId}`);
    prodId = this.id;
    addProdToCart();
  });
});

const addProdToCart = async () => {
  const data = { quantity: 1 };
  const response = await fetch(
    `http://localhost:8080/api/carts/${cartId}/products/${prodId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // string or object
    }
  );
  const cartJson = await response.json(); //extract JSON from the http response
  //console.log(`cartJson: ${JSON.stringify(cartJson)}`);
  //console.log(`Cart Status: ${cartJson.status}`);
};

// Handlebars.registerHelper('ifEmptyOrWhitespace', function (value, options) {
//   if (!value) {
//     return options.fn(this);
//   }
//   return value.replace(/\s*/g, '').length === 0
//     ? options.fn(this)
//     : options.inverse(this);
// });
