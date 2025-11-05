// Firebase Cloud Messaging Service Worker
// This file handles background push notifications

// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js")

// Declare Firebase variable before using it
const firebase = self.firebase

// Initialize Firebase in the service worker
// Note: These values should match your Firebase config
firebase.initializeApp({
  apiKey: "AIzaSyBqVLKCGZLqJqVLKCGZLqJqVLKCGZLqJqV",
  authDomain: "achadinhos-xpress.firebaseapp.com",
  projectId: "achadinhos-xpress",
  storageBucket: "achadinhos-xpress.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef",
})

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[FCM SW] Received background message:", payload)

  const notificationTitle = payload.notification?.title || "Nova Notificação"
  const notificationOptions = {
    body: payload.notification?.body || "Você tem uma nova mensagem",
    icon: "/icon-192.jpg",
    badge: "/icon-192.jpg",
    tag: payload.data?.tag || "default",
    data: payload.data,
    requireInteraction: false,
    vibrate: [200, 100, 200],
  }

  return self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("[FCM SW] Notification clicked:", event.notification)

  event.notification.close()

  // Get the URL to open from notification data or default to home
  const urlToOpen = event.notification.data?.url || "/"

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus()
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    }),
  )
})
