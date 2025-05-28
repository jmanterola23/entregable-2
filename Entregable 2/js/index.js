// declaracion Tienda y carrito
let storeProducts = [];
let allProducts = [];
let currentIndex = 0;

console.log("stored",storeProducts);  // ✅ Debería mostrar los productos guardados
console.log("all", allProducts);  // ✅ Debería mostrar los productos guardados


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
const formAddProduct = document.getElementById('form-add-product');
const inputName = document.getElementById('product-name');
const inputPrice = document.getElementById('product-price');
const inputImage = document.getElementById('product-image');
const inputImageFile = document.getElementById('product-image-file');


btnToggleForm.addEventListener('click', () => {
  containerAddProduct.classList.toggle('hidden');
});

document.querySelector('.close-form').addEventListener('click', () => {
  containerAddProduct.classList.add('hidden');
});


// Agregar producto


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


const savedProducts = localStorage.getItem('storeProducts');
if (savedProducts) {
  storeProducts = JSON.parse(savedProducts);
  storeProducts.forEach(product => renderProduct(product));
  renderCarousel();
}

/* Carga (f5) */
const savedCart = localStorage.getItem('cartProducts');
if (savedCart) {
  allProducts = JSON.parse(savedCart);
  updateCart();
}









/*======================= Renderizar carousel ========================


======================================================================= */




function renderCarousel() {
  const carousel = document.querySelector('.carousel'); // ✅ nombre correcto
  carousel.innerHTML = '';
  const lastThreeProducts = storeProducts.slice(-3);
  lastThreeProducts.forEach(product => {
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    carousel.appendChild(img);
  });

  currentIndex = 0;
  updateCarousel();
}

function updateCarousel() {
  const images = document.querySelectorAll('.carousel img');
  const offset = -currentIndex * 100;
  images.forEach(img => {
    img.style.transform = `translateX(${offset}%)`;
  });
}


// Flechas carusel
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

// carousel andante
setInterval(() => {
  const images = document.querySelectorAll('.carousel img');
  if (images.length > 0) {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
  }
}, 3000);





/* ======================== Carrito ========================= 


============================================================== */

productsList.addEventListener('click', e => {
  if (e.target.classList.contains('btn-add-cart')) {
    const productElement = e.target.parentElement;
    const product = {
      quantity: 1,
      title: productElement.querySelector('h2').textContent,
      price: productElement.querySelector('.price').textContent,
      image: productElement.parentElement.querySelector('img').src  // 🟩 GUARDA LA IMAGEN
    };
    
    const exists = allProducts.some(p => p.title === product.title);
    if (exists) {
      allProducts = allProducts.map(p => {
        if (p.title === product.title) p.quantity++;
        return p;
      });
    } else {
      allProducts.push(product);
    }
    updateCart();
  }
});

// Eliminar

rowProduct.addEventListener('click', e => {
  if (e.target.classList.contains('icon-close')) {
    const product = e.target.parentElement;
    const title = product.querySelector('p').textContent;
    const index = allProducts.findIndex(p => p.title === title);
    if (index !== -1) allProducts.splice(index, 1);
    updateCart();
  }
});


/* Listar carrito */
function updateCart() {
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
        <img src="${product.image}" alt="producto" style="width: 40px; height: auto; border-radius: 5px; margin-right: 10px;">
        <p class="titulo-producto-carrito">${product.title}</p>
        <span class="precio-producto-carrito">${product.price}</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke-width="1.5" stroke="currentColor" class="icon-close">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12" />
      </svg>`;

    rowProduct.appendChild(containerProduct);

    const precioNumero = parseFloat(product.price.replace('$', ''));
    total += product.quantity * precioNumero;
    totalOfProducts += product.quantity;
  });

  valorTotal.textContent = `$${total}`;
  countProducts.textContent = totalOfProducts;

  localStorage.setItem('cartProducts', JSON.stringify(allProducts));
}






