const socket = io();

socket.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`);
});

document
  .getElementById('product-creation')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    createProduct();
  });

function createProduct() {
  let titleValue = document.getElementById('ftitle').value;
  let descriptionValue = document.getElementById('fdesc').value;
  let codeValue = document.getElementById('fcode').value;
  let priceValue = document.getElementById('fprice').value;
  let stockValue = document.getElementById('fstock').value;
  let categoryValue = document.getElementById('fcategory').value;
  const product = {
    title: titleValue,
    description: descriptionValue,
    code: codeValue,
    price: priceValue,
    stock: stockValue,
    category: categoryValue,
  };
  socket.emit('create_product_on_backend', {
    newProduct: product,
  });
}

document.querySelectorAll('.delete-prod').forEach((button) => {
  button.onclick = function () {
    socket.emit('delete_product_on_backend', {
      productId: this.id,
    });
  };
});

//FRONT ATAJA "product_created"
socket.on('product_created', (msg) => {
  document.getElementById('prod-deleted-msg').innerHTML = '';
  if (msg.status == 'error') {
    document.getElementById('success-msg').innerHTML = '';
    document.getElementById('error-msg').innerHTML = msg.details;
  } else {
    document.getElementById('error-msg').innerHTML = '';
    const prods = msg.details
      .map(
        (product) =>
          `<li><strong>${product.title}</strong>[id: ${product.id}]<p>${product.description}</p><p>Code: ${product.code}</p><p>Price: ${product.price}</p><p>Stock: ${product.stock}</p><p>Category: ${product.category}</p><button class="delete-prod" id="${product.id}">Delete</button></li>`
      )
      .join('');

    document.getElementsByClassName('alternating-colors')[0].innerHTML = prods;
    document.getElementById('success-msg').innerHTML =
      'Product Successfully Created! Check bottom rigth list to see it';
    //clear Form inputs
    let element = document.getElementById('product-creation');
    element.reset();
    //attach js event listener again
    document.querySelectorAll('.delete-prod').forEach((button) => {
      button.onclick = function () {
        socket.emit('delete_product_on_backend', {
          productId: this.id,
        });
      };
    });
  }
});

socket.on('product_deleted', (msg) => {
  const prods = msg.products
    .map(
      (product) =>
        `<li><strong>${product.title}</strong>[id: ${product.id}]<p>${product.description}</p><p>Code: ${product.code}</p><p>Price: ${product.price}</p><p>Stock: ${product.stock}</p><p>Category: ${product.category}</p><button class="delete-prod" id="${product.id}">Delete</button></li>`
    )
    .join('');

  document.getElementsByClassName('alternating-colors')[0].innerHTML = prods;
  document.getElementById('prod-deleted-msg').innerHTML = msg.details;
  document.getElementById('success-msg').innerHTML = '';
  document.getElementById('error-msg').innerHTML = '';
  window.scrollTo(0, 0);
  //attach js event listener again
  document.querySelectorAll('.delete-prod').forEach((button) => {
    button.onclick = function () {
      socket.emit('delete_product_on_backend', {
        productId: this.id,
      });
    };
  });
});
