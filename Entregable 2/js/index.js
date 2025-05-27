// declaracion Tienda y carrito
let storeProducts = [];
let allProducts = [];

const productsList = document.querySelector('.container-items');
const rowProduct = document.querySelector('.row-product');
const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.getElementById('contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

// boton mostrar carrito
const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');

btnCart.addEventListener('click', () => {
  containerCartProducts.classList.toggle('hidden-cart');
});



// boton abrir formulario
const btnToggleForm = document.getElementById('btn-toggle-form');
const containerAddProduct = document.querySelector('.container-add-product');

btnToggleForm.addEventListener('click', () => {
  containerAddProduct.classList.toggle('hidden');
});

document.querySelector('.close-form').addEventListener('click', () => {
  if (confirm('¿Estás seguro que quieres cerrar sin agregar el producto?')) {
    containerAddProduct.classList.add('hidden');
  }
});


// Agregar producto
const formAddProduct = document.getElementById('form-add-product');
const inputName = document.getElementById('product-name');
const inputPrice = document.getElementById('product-price');
const inputImage = document.getElementById('product-image');
const inputImageFile = document.getElementById('product-image-file');

formAddProduct.addEventListener('submit', e => {
  e.preventDefault();

  const name = inputName.value;
  const price = `$${inputPrice.value}`;

  const file = inputImageFile.files[0];
  if (!file) {
    alert('Por favor selecciona una imagen');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const image = reader.result;
    agregarProducto(name, price, image);
  };
  reader.readAsDataURL(file);
  formAddProduct.reset();
  containerAddProduct.classList.add('hidden');
});

function agregarProducto(name, price, image) {
  const newProduct = { name, price, image };
  storeProducts.push(newProduct);
  localStorage.setItem('storeProducts', JSON.stringify(storeProducts));
  renderProduct(newProduct);
  renderCarousel();
}

const savedProducts = localStorage.getItem('storeProducts');
if (savedProducts) {
  storeProducts = JSON.parse(savedProducts);
  storeProducts.forEach(product => renderProduct(product));
  renderCarousel();
}



/* Render productos */
function renderProduct(product) {
  const container = document.createElement('div');
  container.classList.add('item');
  container.innerHTML = `
    <figure><img src="${product.image}" alt="producto" /></figure>
    <div class="info-product">
      <h2>${product.name}</h2>
      <p class="price">${product.price}</p>
      <button class="btn-add-cart">Añadir al carrito</button>
    </div>
  `;
  productsList.appendChild(container);
}




/*======================= Renderizar carrusel ========================


======================================================================= */



function renderCarousel() {
  const carousel = document.querySelector('.carousel');
  carousel.innerHTML = '';
  const lastThreeProducts = storeProducts.slice(-3);

  lastThreeProducts.forEach(product => {
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    carousel.appendChild(img);
  });

  //Carrusel
  currentIndex = 0;
  updateCarousel();
}


let currentIndex = 0;

function updateCarousel() {
  const images = document.querySelectorAll('.carousel img');
  const offset = -currentIndex * 100;
  images.forEach(img => {
    img.style.transform = `translateX(${offset}%)`;
  });
}

// Flechas carrusel
document.querySelector('.prev').addEventListener('click', () => {
  const images = document.querySelectorAll('.carousel img');
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateCarousel();
});

document.querySelector('.next').addEventListener('click', () => {
  const images = document.querySelectorAll('.carousel img');
  currentIndex = (currentIndex + 1) % images.length;
  updateCarousel();
});

// Carrusel andante
setInterval(() => {
  const images = document.querySelectorAll('.carousel img');
  if (images.length > 0) {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
  }
}, 3000);


function showImageAtIndex(index) {
  const images = document.querySelectorAll('.carousel img');
  images.forEach(img => img.classList.remove('active'));
  images[index].classList.add('active');
}

document.querySelector('.prev').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + storeProducts.length) % storeProducts.length;
  showImageAtIndex(currentIndex);
});

document.querySelector('.next').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % storeProducts.length;
  showImageAtIndex(currentIndex);
});

setInterval(() => {
  if (storeProducts.length > 0) {
    currentIndex = (currentIndex + 1) % storeProducts.length;
    showImageAtIndex(currentIndex);
  }
}, 3000);


/* ======================== Carrito ========================= 


============================================================== */

productsList.addEventListener('click', e => {
  if (e.target.classList.contains('btn-add-cart')) {
    const productElement = e.target.parentElement;
    const infoProduct = {
      quantity: 1,
      title: productElement.querySelector('h2').textContent,
      price: productElement.querySelector('p').textContent,
    };

    const exists = allProducts.some(p => p.title === infoProduct.title);
    if (exists) {
      allProducts.forEach(p => {
        if (p.title === infoProduct.title) p.quantity++;
      });
    } else {
      allProducts.push(infoProduct);
    }

    getStarWarsRecommendations(infoProduct.title);
    showCart();
  }
});

rowProduct.addEventListener('click', e => {
  if (e.target.classList.contains('icon-close')) {
    const product = e.target.parentElement;
    const title = product.querySelector('p').textContent;
    const index = allProducts.findIndex(p => p.title === title);
    if (index !== -1) allProducts.splice(index, 1);
    showCart();
  }
});


/* Listar carrito */
function showCart() {
  if (!allProducts.length) {
    cartEmpty.classList.remove('hidden');
    rowProduct.classList.add('hidden');
    cartTotal.classList.add('hidden');
  } else {
    cartEmpty.classList.add('hidden');
    rowProduct.classList.remove('hidden');
    cartTotal.classList.remove('hidden');
  }

  rowProduct.innerHTML = '';
  let total = 0;
  let totalOfProducts = 0;

  allProducts.forEach(product => {
    const containerProduct = document.createElement('div');
    containerProduct.classList.add('cart-product');
    containerProduct.innerHTML = `
      <div class="info-cart-product">
        <span class="cantidad-producto-carrito">${product.quantity}</span>
        <p class="titulo-producto-carrito">${product.title}</p>
        <span class="precio-producto-carrito">${product.price}</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" class="icon-close" viewBox="0 0 24 24">
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>`;
    rowProduct.appendChild(containerProduct);

    total += parseInt(product.quantity * product.price.slice(1));
    totalOfProducts += product.quantity;
  });

  valorTotal.innerText = `$${total}`;
  countProducts.innerText = totalOfProducts;

  localStorage.setItem('cartProducts', JSON.stringify(allProducts));
}

/* Carga (f5) */
const savedCart = localStorage.getItem('cartProducts');
if (savedCart) {
  allProducts = JSON.parse(savedCart);
  showCart();
}


/* Recomendaciones Star Wars */
function getStarWarsRecommendations(query) {
  fetch(`https://swapi.py4e.com/api/people/?search=${query}`)
    .then(response => response.json())
    .then(data => {
      let container = document.querySelector('.recommendations');
      if (!container) {
        container = document.createElement('div');
        container.classList.add('recommendations');
        document.body.appendChild(container);
      }
      container.innerHTML = '<h3>Recomendados de Star Wars</h3>';
      data.results.slice(0, 3).forEach(personaje => {
        const div = document.createElement('div');
        div.classList.add('recommendation-item');
        div.innerHTML = `
          <p>Nombre: ${personaje.name}</p>
          <p>Altura: ${personaje.height} cm</p>
          <p>Género: ${personaje.gender}</p>`;
        container.appendChild(div);
      });
    })
    .catch(err => console.error('Error con la API SWAPI:', err));
}



