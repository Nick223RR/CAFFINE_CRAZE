const CART_STORAGE_KEY = "caffeinecraze_cart";
const CartManager = {
    getCart: () => JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [],
    saveCart: (cart) => localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)),
    addItem: function (item) {
        let cart = this.getCart();
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            cart.push({ ...item, quantity: item.quantity || 1 });
        }
        this.saveCart(cart);
        this.updateCartCount();
    },
    removeItem: function (id) {
        let cart = this.getCart().filter(item => item.id !== id);
        this.saveCart(cart);
        this.updateCartCount();
    },
    clearCart: function () {
        localStorage.removeItem(CART_STORAGE_KEY);
        this.updateCartCount();
    },
    getCartTotal: function () {
        return this.getCart().reduce((total, item) => total + item.price * item.quantity, 0);
    },
    updateCartCount: function () {
        const cartCountElement = document.getElementById("cart-count");
        if (cartCountElement) {
            const count = this.getCart().reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = count;
        }
    },
    showNotification: function (message) {
        alert(message);
    }
};
document.addEventListener("DOMContentLoaded", CartManager.updateCartCount);
