
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCKWq1930Dl8vNsNM-H2HyJS0dLH00HpmI",
  authDomain: "vinhcaulong.firebaseapp.com",
  projectId: "vinhcaulong",
  storageBucket: "vinhcaulong.firebasestorage.app",
  messagingSenderId: "70076172719",
  appId: "1:70076172719:web:82ef476acdbfd87a36075a",
  measurementId: "G-65F222CEN2"
};

const app = initializeApp(firebaseConfig);

console.log("Firebase connected successfully!", app.name);

// Analytics chỉ khởi tạo khi môi trường trình duyệt hỗ trợ
if (typeof window !== "undefined") {
  try {
    const analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized!");
  } catch (error) {
    console.warn("Analytics chưa khởi tạo được:", error);
  }
}
