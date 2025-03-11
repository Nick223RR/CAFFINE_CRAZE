// Migration script for existing orders
// This script should be run once to update existing orders with sequential IDs

import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, doc, updateDoc, setDoc } from "firebase/firestore"

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

async function migrateOrders() {
  console.log("Starting order migration...")

  try {
    // Get all existing orders
    const ordersSnapshot = await getDocs(collection(db, "orders"))
    const orders = []

    // Collect all orders with their document IDs
    ordersSnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    console.log(`Found ${orders.length} orders to migrate`)

    // Sort orders by creation date (oldest first)
    orders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    // Create counter document with initial value
    const counterDocRef = doc(db, "counters", "orders")
    await setDoc(counterDocRef, { value: orders.length })

    console.log(`Set counter to ${orders.length}`)

    // Update each order with a sequential orderId
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i]
      const sequentialId = i + 1 // Start from 1

      // Skip if order already has an orderId
      if (order.orderId) {
        console.log(`Order ${order.id} already has orderId ${order.orderId}, skipping`)
        continue
      }

      // Update the order document with the sequential ID
      const orderDocRef = doc(db, "orders", order.id)
      await updateDoc(orderDocRef, { orderId: sequentialId })

      console.log(`Updated order ${order.id} with orderId ${sequentialId}`)
    }

    console.log("Migration completed successfully!")
  } catch (error) {
    console.error("Error during migration:", error)
  }
}

// Run the migration
migrateOrders()

