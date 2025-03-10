// Firestore operations for Caffeine Craze
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js"
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js"

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
const db = getFirestore(app)
const auth = getAuth(app)

// Firestore operations
const FirestoreService = {
  // Save order to Firestore
  saveOrder: async (orderData) => {
    try {
      // Add timestamp to order
      const orderWithTimestamp = {
        ...orderData,
        createdAt: new Date().toISOString(),
      }

      // Add order to 'orders' collection
      const docRef = await addDoc(collection(db, "orders"), orderWithTimestamp)

      // If user is logged in, add order reference to user's orders
      const user = auth.currentUser
      if (user) {
        // Get user document reference
        const userDocRef = doc(db, "users", user.uid)

        // Get current user data
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          // User exists, update orders array
          const userData = userDoc.data()
          const orders = userData.orders || []
          orders.push(docRef.id)

          await setDoc(userDocRef, { orders }, { merge: true })
        } else {
          // User doesn't exist, create new user document
          await setDoc(userDocRef, {
            email: user.email,
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
            orders: [docRef.id],
            createdAt: new Date().toISOString(),
          })
        }
      }

      return { success: true, orderId: docRef.id }
    } catch (error) {
      console.error("Error saving order:", error)
      return { success: false, error: error.message }
    }
  },

  // Get user's orders
  getUserOrders: async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        return { success: false, error: "User not logged in" }
      }

      // Get user document
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        return { success: true, orders: [] }
      }

      const userData = userDoc.data()
      const orderIds = userData.orders || []

      if (orderIds.length === 0) {
        return { success: true, orders: [] }
      }

      // Get all orders
      const orders = []
      for (const orderId of orderIds) {
        const orderDocRef = doc(db, "orders", orderId)
        const orderDoc = await getDoc(orderDocRef)

        if (orderDoc.exists()) {
          orders.push({
            id: orderId,
            ...orderDoc.data(),
          })
        }
      }

      // Sort orders by createdAt (newest first)
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      return { success: true, orders }
    } catch (error) {
      console.error("Error getting user orders:", error)
      return { success: false, error: error.message }
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      const user = auth.currentUser
      if (!user) {
        return { success: false, error: "User not logged in" }
      }

      // Get user document reference
      const userDocRef = doc(db, "users", user.uid)

      // Update user document
      await setDoc(userDocRef, profileData, { merge: true })

      return { success: true }
    } catch (error) {
      console.error("Error updating user profile:", error)
      return { success: false, error: error.message }
    }
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        return { success: false, error: "User not logged in" }
      }

      // Get user document
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        // Create basic profile if it doesn't exist
        const basicProfile = {
          email: user.email,
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          createdAt: new Date().toISOString(),
        }

        await setDoc(userDocRef, basicProfile)

        return { success: true, profile: basicProfile }
      }

      return { success: true, profile: userDoc.data() }
    } catch (error) {
      console.error("Error getting user profile:", error)
      return { success: false, error: error.message }
    }
  },
}

export default FirestoreService

