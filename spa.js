// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQbW8GZYx8s1TClUiG7r711piLJFtrANA",
  authDomain: "caffinecraze-93d3f.firebaseapp.com",
  projectId: "caffinecraze-93d3f",
  storageBucket: "caffinecraze-93d3f.firebasestorage.app",
  messagingSenderId: "774090459612",
  appId: "1:774090459612:web:28aa1e5d3a3de8d393e719",
  measurementId: "G-Z5VTH06PF5",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

// DOM Elements
const views = {
  login: document.getElementById("login-content"),
  register: document.getElementById("register-content"),
}

const elements = {
  // Login elements
  loginForm: document.getElementById("login-form"),
  loginEmail: document.getElementById("email"),
  loginPassword: document.getElementById("password"),
  googleLoginBtn: document.getElementById("google-login"),
  registerLink: document.getElementById("register-link"),
  forgotPasswordLink: document.getElementById("forgot-password"),
  errorMessage: document.getElementById("error-message"),
  successMessage: document.getElementById("success-message"),

  // Register elements
  registerForm: document.getElementById("register-form"),
  firstName: document.getElementById("firstName"),
  lastName: document.getElementById("lastName"),
  registerEmail: document.getElementById("register-email"),
  registerPassword: document.getElementById("register-password"),
  confirmPassword: document.getElementById("confirmPassword"),
  loginLink: document.getElementById("login-link"),
  registerErrorMessage: document.getElementById("register-error-message"),
  registerSuccessMessage: document.getElementById("register-success-message"),

  // Checkout elements
  welcomeMessage: document.getElementById("welcome-message"),
  logoutBtn: document.getElementById("logout-btn"),
  deliveryForm: document.getElementById("delivery-form"),

  // Navigation
  authNavItem: document.getElementById("auth-nav-item"),
  authLink: document.getElementById("auth-link"),
}

// SPA Navigation
function showView(viewId) {
  if (viewId === "login") {
    document.getElementById("login-tab").click()
  } else if (viewId === "register") {
    document.getElementById("register-tab").click()
  }
}

// Authentication state observer
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log("User is signed in:", user)

    // Update UI for authenticated user
    elements.authLink.innerHTML = '<img src="usericon.png" alt="User Icon" class="navbar-icon"> My Account'
    elements.authLink.addEventListener("click", (e) => {
      e.preventDefault()
      showView("checkout")
    })

    // Set welcome message
    const displayName = user.displayName || user.email
    elements.welcomeMessage.textContent = `Welcome, ${displayName}! You are now securely logged in.`

    // Auto-fill name if available
    if (user.displayName) {
      const fullNameInput = document.getElementById("fullName")
      if (fullNameInput) {
        fullNameInput.value = user.displayName
      }
    }

    // Show checkout view if user is authenticated
    showView("checkout")
  } else {
    // User is signed out
    console.log("User is signed out")

    // Update UI for non-authenticated user
    elements.authLink.innerHTML = '<img src="usericon.png" alt="User Icon" class="navbar-icon"> Login'
    elements.authLink.addEventListener("click", (e) => {
      e.preventDefault()
      showView("login")
    })

    // Show login view if user is not authenticated
    showView("login")
  }
})

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Handle tab switching
  document.getElementById("login-tab").addEventListener("click", (e) => {
    e.preventDefault()
    document.getElementById("login-content").classList.add("show", "active")
    document.getElementById("register-content").classList.remove("show", "active")
  })

  document.getElementById("register-tab").addEventListener("click", (e) => {
    e.preventDefault()
    document.getElementById("login-content").classList.remove("show", "active")
    document.getElementById("register-content").classList.add("show", "active")
  })

  // Login form submission
  elements.loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = elements.loginEmail.value
    const password = elements.loginPassword.value

    // Reset messages
    elements.errorMessage.style.display = "none"
    elements.successMessage.style.display = "none"

    // Sign in with email and password
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        elements.successMessage.textContent = "Login successful! Redirecting..."
        elements.successMessage.style.display = "block"

        // Redirect to index.html
        setTimeout(() => {
          window.location.href = "index.html"
        }, 1000)
      })
      .catch((error) => {
        const errorCode = error.code
        let message = "An error occurred. Please try again."

        // Customize error messages
        if (errorCode === "auth/invalid-email") {
          message = "Invalid email address format."
        } else if (errorCode === "auth/user-not-found") {
          message = "No account found with this email."
        } else if (errorCode === "auth/wrong-password") {
          message = "Incorrect password."
        } else if (errorCode === "auth/too-many-requests") {
          message = "Too many failed login attempts. Please try again later."
        }

        elements.errorMessage.textContent = message
        elements.errorMessage.style.display = "block"
      })
  })

  // Google login
  elements.googleLoginBtn.addEventListener("click", () => {
    // Reset messages
    elements.errorMessage.style.display = "none"
    elements.successMessage.style.display = "none"

    // Sign in with Google
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential?.accessToken
        // The signed-in user info
        const user = result.user

        elements.successMessage.textContent = "Google login successful! Redirecting..."
        elements.successMessage.style.display = "block"

        // Redirect to index.html
        setTimeout(() => {
          window.location.href = "index.html"
        }, 1000)
      })
      .catch((error) => {
        // Handle Errors here
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used
        const email = error.customData?.email
        // The AuthCredential type that was used
        const credential = GoogleAuthProvider.credentialFromError(error)

        elements.errorMessage.textContent = "Google login failed. Please try again."
        elements.errorMessage.style.display = "block"
        console.error("Google login error:", errorCode, errorMessage)
      })
  })

  // Register form submission
  elements.registerForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const firstName = elements.firstName.value
    const lastName = elements.lastName.value
    const email = elements.registerEmail.value
    const password = elements.registerPassword.value
    const confirmPassword = elements.confirmPassword.value

    // Reset messages
    elements.registerErrorMessage.style.display = "none"
    elements.registerSuccessMessage.style.display = "none"

    // Validate password
    if (password.length < 6) {
      elements.registerErrorMessage.textContent = "Password must be at least 6 characters long."
      elements.registerErrorMessage.style.display = "block"
      return
    }

    // Validate password match
    if (password !== confirmPassword) {
      elements.registerErrorMessage.textContent = "Passwords do not match."
      elements.registerErrorMessage.style.display = "block"
      return
    }

    // Create user with Firebase
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user

        // Update profile with name
        return updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        }).then(() => {
          elements.registerSuccessMessage.textContent = "Registration successful! Redirecting..."
          elements.registerSuccessMessage.style.display = "block"

          // Redirect to index.html after 2 seconds
          setTimeout(() => {
            window.location.href = "index.html"
          }, 2000)
        })
      })
      .catch((error) => {
        const errorCode = error.code
        let message = "An error occurred. Please try again."

        // Customize error messages
        if (errorCode === "auth/email-already-in-use") {
          message = "This email is already registered."
        } else if (errorCode === "auth/invalid-email") {
          message = "Invalid email address format."
        } else if (errorCode === "auth/weak-password") {
          message = "Password is too weak."
        }

        elements.registerErrorMessage.textContent = message
        elements.registerErrorMessage.style.display = "block"
      })
  })

  // Logout button
  elements.logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful
        showView("login")
      })
      .catch((error) => {
        // An error happened
        console.error("Logout error:", error)
      })
  })

  // Navigation between views
  elements.registerLink.addEventListener("click", (e) => {
    e.preventDefault()
    showView("register")
  })

  elements.loginLink.addEventListener("click", (e) => {
    e.preventDefault()
    showView("login")
  })

  elements.forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault()
    alert("Please contact customer support to reset your password.")
  })

  // Checkout form submission
  elements.deliveryForm.addEventListener("submit", (e) => {
    e.preventDefault()
    alert("Thank you for your order! Your delicious items will be delivered soon.")

    // Redirect to home page after order completion
    setTimeout(() => {
      window.location.href = "index.html"
    }, 2000)
  })

  // Initialize view based on authentication state
  const user = auth.currentUser
  if (user) {
    showView("checkout")
  } else {
    showView("login")
  }
})

// Helper function to load cart items (if any)
function loadCartItems() {
  const cartItemsContainer = document.getElementById("cart-items")
  const CART_STORAGE_KEY = "caffeinecraze_cart"

  // Get cart from localStorage
  const cartData = localStorage.getItem(CART_STORAGE_KEY)
  const cart = cartData ? JSON.parse(cartData) : []

  if (cart.length === 0) {
    // Cart is empty, show default message
    return
  }

  // Clear existing content
  cartItemsContainer.innerHTML = ""

  // Create cart items HTML
  let cartItemsHTML = '<div class="cart-items-list">'
  let total = 0

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity
    total += itemTotal

    cartItemsHTML += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price} x ${item.quantity}</div>
                </div>
                <div class="cart-item-total">₹${itemTotal}</div>
            </div>
        `
  })

  cartItemsHTML += `
        <div class="cart-total">
            <div class="cart-total-label">Total:</div>
            <div class="cart-total-amount">₹${total}</div>
        </div>
    </div>`

  // Add to container
  cartItemsContainer.innerHTML = cartItemsHTML
}

// Load cart items when checkout view is shown
document.addEventListener("DOMContentLoaded", () => {
  // Check if we're on the checkout view
  if (views.checkout.style.display !== "none") {
    loadCartItems()
  }

  // Add listener for view changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.target === views.checkout &&
        mutation.attributeName === "style" &&
        views.checkout.style.display !== "none"
      ) {
        loadCartItems()
      }
    })
  })

  // Start observing
  observer.observe(views.checkout, { attributes: true })
})

