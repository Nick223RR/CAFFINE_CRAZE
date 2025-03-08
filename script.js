// script.js - Updated to manage cart functionality

document.addEventListener('DOMContentLoaded', function () {
    console.log('Caffeine Craze website loaded successfully!');
    initializeCart();
});

// Function to initialize cart functionality
function initializeCart() {
    if (window.location.pathname.includes('product.html')) {
        setupProductPage();
    } else if (window.location.pathname.includes('proceed_button.html')) {
        displayCartItems();
    }
}

// Function to handle product page interactions
function setupProductPage() {
    document.querySelectorAll('.order-button').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            
            let item = this.closest('.menu-item');
            let itemName = item.querySelector('h5').innerText;
            let itemPrice = item.querySelector('.price').innerText.replace('₹', '').trim();
            let itemImage = item.querySelector('img').src;
            
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let existingItem = cart.find(i => i.name === itemName);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name: itemName, price: parseFloat(itemPrice), image: itemImage, quantity: 1 });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${itemName} added to cart!`);
        });
    });
}

// Function to display cart items in proceed_button.html
function displayCartItems() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartContainer = document.getElementById('cartItems');
    let cartTotal = document.getElementById('cartTotal');
    
    cartContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartContainer.innerHTML += `
            <div class="menu-item d-flex justify-content-between align-items-center">
                <img src="${item.image}" style="width: 50px; height: 50px; border-radius: 50%;">
                <span>${item.name} x ${item.quantity}</span>
                <span>₹${item.price * item.quantity}</span>
                <button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });
    
    cartTotal.innerText = `Total: ₹${total}`;
}

// Function to remove an item from the cart
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Function to clear cart after checkout
function proceedToCheckout() {
    alert('Thank you for your order!');
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
}
