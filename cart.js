let cartItemsContainer = document.querySelector('.cart-items');
let totalPriceElem = document.getElementById('total-price');
let checkoutBtn = document.querySelector('.checkout-btn');

function updateCartDisplay() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <button class="remove-btn" data-id="${item.id}">X</button>
                <img src="${item.image}" alt="${item.name}">
                <h5>${item.name}</h5>
                <div class="cart-item-details">
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <span class="item-price">${item.price} $</span>
                    <span class="item-total">${itemTotal.toFixed(2)} $</span>
                </div>
            </div>
        `;
    });

    totalPriceElem.textContent = totalPrice.toFixed(2);
}

cartItemsContainer.addEventListener('input', function(e) {
    if (e.target.classList.contains('quantity-input')) {
        let productId = e.target.getAttribute('data-id');
        let newQuantity = parseInt(e.target.value);
        updateProductQuantity(productId, newQuantity);
    }
});

cartItemsContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-btn')) {
        let productId = e.target.getAttribute('data-id');
        removeFromCart(productId);
    }
});

checkoutBtn.addEventListener('click', function() {
    if (confirm("Proceed to checkout?")) {
        localStorage.removeItem('cart');
        alert("Checkout complete!");
        updateCartDisplay();
    }
});

function updateProductQuantity(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1 && newQuantity > 0) {
        cart[productIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Initialize cart display
updateCartDisplay();
