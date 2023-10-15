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
  };
  createCart();
});

//add to cart
const buttons = document.querySelectorAll('.addCartBtn');

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

//check cart
const cartBtn = document.getElementById('cartBtn');
cartBtn.addEventListener('click', function handleClick(event) {
  window.location.href = `http://localhost:8080/api/carts/${cartId}`;
});

//delete
const deleteBtn = document.querySelectorAll('.deleteBtn');

deleteBtn.forEach((btn) => {
  btn.addEventListener('click', function handleClick(event) {
    const confirmacion = window.confirm(
      '¿Estás seguro de que deseas eliminar este Producto?'
    );
    if (confirmacion) {
      prodId = this.id;
      deleteProduct();
    }
  });
});

const deleteProduct = async () => {
  const modalOverlay = document.getElementById('modal-overlay');
  modalOverlay.style.display = 'flex'; // Muestra el modal

  const response = await fetch(`http://localhost:8080/api/products/${prodId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const prodJson = await response.json(); //extract JSON from the http response
  //modalOverlay.style.display = 'none'; // Oculta el modal una vez que se complete la llamada
  window.location.href = `http://localhost:8080/api/products`;
};
