// Cart functionality for Caffeine Craze
const CART_STORAGE_KEY = "caffeinecraze_cart"

// Cart management functions
const CartManager = {
  // Get cart from localStorage
  getCart: () => {
    const cartData = localStorage.getItem(CART_STORAGE_KEY)
    return cartData ? JSON.parse(cartData) : []
  },

  // Save cart to localStorage
  saveCart: (cart) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  },

  // Add item to cart
  addItem: function (item) {
    const cart = this.getCart()

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id)

    if (existingItemIndex !== -1) {
      // Increment quantity if item already exists
      cart[existingItemIndex].quantity += item.quantity || 1
    } else {
      // Add new item with quantity
      cart.push({
        ...item,
        quantity: item.quantity || 1,
      })
    }

    this.saveCart(cart)
    this.updateCartCount()

    return cart
  },

  // Remove item from cart
  removeItem: function (itemId) {
    let cart = this.getCart()
    cart = cart.filter((item) => item.id !== itemId)
    this.saveCart(cart)
    this.updateCartCount()

    return cart
  },

  // Update item quantity
  updateQuantity: function (itemId, quantity) {
    const cart = this.getCart()
    const itemIndex = cart.findIndex((item) => item.id === itemId)

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return this.removeItem(itemId)
      }

      cart[itemIndex].quantity = quantity
      this.saveCart(cart)
      this.updateCartCount()
    }

    return cart
  },

  // Clear the entire cart
  clearCart: function () {
    localStorage.removeItem(CART_STORAGE_KEY)
    this.updateCartCount()
  },

  // Calculate cart total
  getCartTotal: function () {
    const cart = this.getCart()
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  },

  // Check if cart is empty
  isCartEmpty: function () {
    const cart = this.getCart()
    return cart.length === 0 || this.getCartTotal() <= 0
  },

  // Get total number of items in cart
  getItemCount: function () {
    const cart = this.getCart()
    return cart.reduce((count, item) => count + item.quantity, 0)
  },

  // Update cart count display
  updateCartCount: function () {
    const cartCountElement = document.getElementById("cart-count")
    if (cartCountElement) {
      const count = this.getItemCount()
      cartCountElement.textContent = count
      cartCountElement.style.display = count > 0 ? "flex" : "none"
    }
  },

  // Show notification when item is added to cart
  showNotification: (message) => {
    // Create notification element if it doesn't exist
    let notification = document.getElementById("cart-notification")

    if (!notification) {
      notification = document.createElement("div")
      notification.id = "cart-notification"
      document.body.appendChild(notification)
    }

    // Set message and show notification
    notification.textContent = message
    notification.classList.add("show")

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show")
    }, 3000)
  },
}

// Initialize cart count on page load
document.addEventListener("DOMContentLoaded", () => {
  CartManager.updateCartCount()
})

