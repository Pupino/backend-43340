const purchaseBtn = document.getElementsByClassName('purchaseBtn');
purchaseBtn[0].addEventListener('click', function handleClick(event) {
  const confirmacion = window.confirm(
    '¿Estás seguro de que deseas hacer la compra?'
  );
  if (confirmacion) {
    cartId = this.id;
    purchaseCart();
  }
});

const purchaseCart = async () => {
  const modalOverlay = document.getElementById('modal-overlay');
  modalOverlay.style.display = 'flex'; // Muestra el modal

  const response = await fetch(
    `http://localhost:8080/api/carts/${cartId}/purchase`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const cartJson = await response.json(); //extract JSON from the http response
  // Accede al elemento HTML donde deseas mostrar el JSON
  const jsonOutput = document.getElementById('purchaseOutput');
  // Convierte el objeto JSON en una cadena formateada
  const jsonCadena = JSON.stringify(cartJson, null, 2);
  // Asigna la cadena JSON al elemento HTML //
  jsonOutput.textContent = jsonCadena;
  // Accede al elemento que deseas ocultar
  const cartInfo = document.getElementById('cartInfo');
  // Oculta el elemento cambiando su propiedad 'display' a 'none'
  cartInfo.style.display = 'none';
  modalOverlay.style.display = 'none'; // Oculta el modal una vez que se complete la llamada
};

//Clear Cart
const clearBtn = document.getElementsByClassName('clearBtn');
clearBtn[0].addEventListener('click', function handleClick(event) {
  const confirmacion = window.confirm(
    '¿Estás seguro de que deseas vaciar el carrito?'
  );
  if (confirmacion) {
    cartId = this.id;
    clearCart();
  }
});

const clearCart = async () => {
  const modalOverlay = document.getElementById('modal-overlay');
  modalOverlay.style.display = 'flex'; // Muestra el modal

  const response = await fetch(`http://localhost:8080/api/carts/${cartId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const cartJson = await response.json(); //extract JSON from the http response
  window.location.href = `http://localhost:8080/api/carts/${cartId}`;
};
