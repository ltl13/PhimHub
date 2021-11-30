import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyABNBQ55pE7ojt6jhb7jmWlSmB-k_qP484',
  authDomain: 'test-752b7.firebaseapp.com',
  projectId: 'test-752b7',
  storageBucket: 'test-752b7.appspot.com',
  messagingSenderId: '765882217823',
  appId: '1:765882217823:web:c8c6888d0f5dcf344ef2ea',
  measurementId: 'G-H5XXKLYSG3',
};

const firebaseApp = initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp);

export default storage;
