let FoodSection = document.querySelector(".food-cards");
let h1 = document.getElementById("sicxare");
let categories = document.querySelector(".categories");
let spicinessFilter = -1;
let noNutsFilter = false;
let vegetarianFilter = false;
let selectedCategory = "all";
h1.innerText = "Spiciness: Not Chosen";

function changesicxare(e) {
    spicinessFilter = parseInt(e.target.value);
    switch (spicinessFilter) {
        case -1:
            h1.innerText = "Spiciness: Not Chosen";
            break;
        case 0:
            h1.innerText = "Spiciness: 0";
            break;
        case 1:
            h1.innerText = "Spiciness: 1";
            break;
        case 2:
            h1.innerText = "Spiciness: 2";
            break;
        case 3:
            h1.innerText = "Spiciness: 3";
            break;
        case 4:
            h1.innerText = "Spiciness: 4";
            break;
        default:
            h1.innerText = "Spiciness: Not Chosen";
    }
}

document.getElementById("NoNuts").addEventListener("change", function() {
    noNutsFilter = this.checked;
});

document.getElementById("Vegeterian").addEventListener("change", function() {
    vegetarianFilter = this.checked;
});

document.querySelector(".reset-btn").addEventListener("click", function() {
    spicinessFilter = -1;
    noNutsFilter = false;
    vegetarianFilter = false;
    selectedCategory = "all";
    document.getElementById("sicxare").innerText = "Spiciness: Not Chosen";
    document.getElementById("NoNuts").checked = false;
    document.getElementById("Vegeterian").checked = false;
    filterProducts();
});

document.querySelector(".apply-btn").addEventListener("click", function() {
    filterProducts();
});

categories.addEventListener('click', function(e) {
    if (e.target.classList.contains('categories-name')) {
        selectedCategory = e.target.getAttribute('data-category');
        filterProducts();
    }
});

function filterProducts() {
    let filteredProducts = products.filter(product => {
        if (selectedCategory !== "all" && product.categoryId !== parseInt(selectedCategory)) {
            return false;
        }
        if (spicinessFilter !== -1 && product.spiciness !== spicinessFilter) {
            return false;
        }
        if (noNutsFilter && product.nuts) {
            return false;
        }
        if (vegetarianFilter && !product.vegeterian) {
            return false;
        }
        return true;
    });
    displayProducts(filteredProducts);
}

fetch('https://restaurant.stepprojects.ge/api/Products/GetAll')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        products = data;
        displayProducts(products);
    });

fetch('https://restaurant.stepprojects.ge/api/Categories/GetAll')
    .then(function (response) {
        return response.json();
    })
    .then(function (data1) {
        data1.forEach(item => {
            categories.innerHTML += `<button class="categories-name" data-category="${item.id}">${item.name}</button>`;
        });
    });

function displayProducts(products) {
  FoodSection.innerHTML = '';
  products.forEach(element => {
    let nutsColor = !element.nuts ? 'red' : 'black';
    let vegeterianColor = element.vegeterian ? 'red' : 'black';

    FoodSection.innerHTML += `
      <div class="card" style="width: 16rem; margin-bottom: 15px;">
        <img src="${element.image}" class="card-img-top h-50" alt="...">
        <div class="card-body">
          <h5 class="card-title">${element.name}</h5>
          <p class="card-spiciness">spiciness: ${element.spiciness}</p>
          <p>
            <span class="card-nuts" style="color: ${nutsColor}">no nuts</span> /
            <span class="card-vegeterian" style="color: ${vegeterianColor}">vegeterian</span>
          </p>
          <div class="d-flex justify-content-between align-items-end">
            <p class="card-text">${element.price} $</p>
            <button class="btn btn-primary add-to-cart-btn" data-id="${element.id}" data-name="${element.name}" data-price="${element.price}" data-image="${element.image}">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  });

  let addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', addToCart);
  });
}

function addToCart(event) {
  let product = {
    id: event.target.getAttribute('data-id'),
    name: event.target.getAttribute('data-name'),
    price: event.target.getAttribute('data-price'),
    image: event.target.getAttribute('data-image'),
    quantity: 1
  };
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let productIndex = cart.findIndex(p => p.id === product.id);
  
  if (productIndex > -1) {
    cart[productIndex].quantity++;
  } else {
    cart.push(product);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
}
