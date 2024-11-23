import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
import { getStorage, ref, uploadBytes } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAD3zYZNcq0qTTsO6EoTIDJ0bxG7twAjis",
    authDomain: "hashtag-f8ebc.firebaseapp.com",
    projectId: "hashtag-f8ebc",
    storageBucket: "hashtag-f8ebc.appspot.com",
    messagingSenderId: "952411388513",
    appId: "1:952411388513:web:ae2bd007aaf196352d8820"
};

if (getApps().length === 0) {
    initializeApp(firebaseConfig);
}
const storage = getStorage()
const fbApp = getApp();
const fbStorage = getStorage(fbApp, "gs://hashtag-f8ebc.appspot.com");
const storageRef = ref(storage, 'images/image-file-name.png')

uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });



export {
    fbApp, fbStorage
} 