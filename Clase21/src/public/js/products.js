let cartId;
let prodId;
document.addEventListener('DOMContentLoaded', function (event) {
  const createCart = async () => {
    const response = await fetch('http://localhost:8080/api/carts', {
      method: 'POST',
      //body: myBody, // string or object
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const cartJson = await response.json(); //extract JSON from the http response
    cartId = cartJson.data.id;
    console.log(`cartId: ${cartId}`);
  };
  createCart();
});

const buttons = document.querySelectorAll('.cartBtn');

buttons.forEach((box) => {
  box.addEventListener('click', function handleClick(event) {
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
};
