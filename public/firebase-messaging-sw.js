// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyAGOCt6xacdN2B_c4G4SmfaZTPBoK8_C2w",
    authDomain: "fleet-radar-299112.firebaseapp.com",
    projectId: "fleet-radar-299112",
    storageBucket: "fleet-radar-299112.appspot.com",
    messagingSenderId: "895377398415",
    appId: "1:895377398415:web:0edb13bc5d138b98b3aefa"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    // const notificationTitle = 'Background Message Title';
    // const notificationOptions = {
    //   body: 'Background Message body.',
    //   icon: '/firebase-logo.png'
    // };
  
    // self.registration.showNotification(notificationTitle,
    //   notificationOptions);
  });
  