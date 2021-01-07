const firebaseConfig = {
    apiKey: "test",
    authDomain: "fleet-radar-299112.firebaseapp.com",
    projectId: "fleet-radar-299112",
    storageBucket: "fleet-radar-299112.appspot.com",
    messagingSenderId: "895377398415",
    appId: "1:895377398415:web:0edb13bc5d138b98b3aefa"
};

// Initialize Firebase
window.firebase.initializeApp(firebaseConfig);
const messaging = window.firebase.messaging();
messaging.getToken({vapidKey: "BJWAxinpUXb487t6NHrnt2KkGEGY-vXsHxu7s9p8EH3mhhufu2cBc18QQrAQNABZoGt6BwRn4e4SfPkHGC1F9BE"});
