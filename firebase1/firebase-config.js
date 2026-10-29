// 1. KHỞI TẠO FIREBASE
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKWq1930Dl8vNsNM-H2HyJS0dLH00HpmI",
  authDomain: "vinhcaulong.firebaseapp.com",
  projectId: "vinhcaulong",
  storageBucket: "vinhcaulong.firebasestorage.app",
  messagingSenderId: "70076172719",
  appId: "1:70076172719:web:82ef476acdbfd87a36075a",
  measurementId: "G-65F222CEN2"
};

// Kết nối tới Firebase
firebase.initializeApp(firebaseConfig);

// Kết nối tới Firestore (database)
const db = firebase.firestore();

// 2. XỬ LÝ ĐĂNG NHẬP / ĐĂNG XUẤT
// Tạo provider đăng nhập Google
const provider = new firebase.auth.GoogleAuthProvider();

// Hàm đăng nhập
function login() {
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;

      const emailElement = document.getElementById("email");
      if (emailElement) emailElement.innerText = user.email;
      setStatus("✅ Đăng nhập thành công");
      createUserIfNotExist(user);
      if (document.getElementById("authPage")) {
        window.location.href = "menu.html";
      }
    })
    .catch((err) => setStatus("❌ Lỗi đăng nhập: " + err.message));
}

// Hàm đăng xuất
function logout() {
  firebase.auth().signOut()
    .then(() => {
      setStatus("👋 Đã đăng xuất");

      const emailElement = document.getElementById("email");
      const balanceElement = document.getElementById("balance");
      if (emailElement) emailElement.innerText = "Chưa đăng nhập";
      if (balanceElement) balanceElement.innerText = "0";
    })
    .catch((err) => setStatus("❌ Lỗi đăng xuất: " + err.message));
}

// 3. TẠO USER TRONG DATABASE (Firestore)
function createUserIfNotExist(user) {
  const ref = db.collection("users").doc(user.uid);
  ref.get().then((doc) => {
    if (!doc.exists) {
      ref.set({
        email: user.email,
        balance: 0
      }).then(() => {
        // 🌟 Bắt đầu listener sau khi tạo user xong
        listenUser(user.uid);
      });
    } else {
      listenUser(user.uid);
    }
  });
}

// 4. LẤY DỮ LIỆU USER (REALTIME)
// Biến để lưu listener (tránh bị lặp)
// Listener realtime
let unsubscribe = null;

function listenUser(uid) {
  const ref = db.collection("users").doc(uid);
  if (unsubscribe) unsubscribe(); // huỷ listener cũ nếu có
  unsubscribe = ref.onSnapshot((doc) => {
    if (!doc.exists) return;
    const data = doc.data();

    const emailElement = document.getElementById("email");
    const balanceElement = document.getElementById("balance");
    if (emailElement) emailElement.innerText = data.email;
    if (balanceElement) balanceElement.innerText = data.balance;
  });
}

// 5. NẠP TIỀN
function deposit(uid) {
  const ref = db.collection("users").doc(uid);

  ref.update({
    // Tăng thêm 100000
    balance: firebase.firestore.FieldValue.increment(100000)
  })
  .then(() => {
    setStatus("💰 Nạp tiền thành công");
  })
  .catch((err) => {
    setStatus("❌ Lỗi nạp tiền: " + err.message);
  });
}

// 6. THEO DÕI TRẠNG THÁI ĐĂNG NHẬP
firebase.auth().onAuthStateChanged((user) => {
  const depositBtn = document.getElementById("depositBtn");
  if (!depositBtn) return;

  if (user) {
    // 1. ĐÃ ĐĂNG NHẬP
    console.log("Đã đăng nhập:", user.uid);

    setStatus("🔓 Đã đăng nhập");

    // 🌟 Hiển thị email ngay (không chờ Firestore)
    document.getElementById("email").innerText = user.email;

    // 🌟 Lắng nghe dữ liệu realtime từ Firestore
    listenUser(user.uid);

    // 🌟 Bật nút nạp tiền
    depositBtn.disabled = false;

    // 🌟 Gán sự kiện click (viết rõ ràng để dễ debug)
    depositBtn.onclick = null;

    depositBtn.onclick = function () {
      if (!user) {
        alert("Chưa đăng nhập!");
        return;
      }

      console.log("CLICK NẠP TIỀN");
      deposit(user.uid);
    };

  } else {
    // 2. CHƯA ĐĂNG NHẬP
    console.log("Chưa đăng nhập");

    setStatus("🔒 Chưa đăng nhập");

    // 🌟 Reset giao diện
    document.getElementById("email").innerText = "Chưa đăng nhập";
    document.getElementById("balance").innerText = "0";

    // 🌟 Tắt nút nạp tiền
    depositBtn.disabled = true;

    // 🌟 Xóa luôn sự kiện click để tránh bug
    depositBtn.onclick = null;
  }
});

// 7. Nạp tiền
function deposit(uid) {
  const user = firebase.auth().currentUser;
  console.log("👉 Bắt đầu nạp tiền cho UID:", uid);

  const ref = db.collection("users").doc(uid);

  // 🌟 Dùng set + merge để:
  // - Nếu chưa có document → tự tạo
  // - Nếu đã có → cập nhật
  ref.set({
    email: user.email, // 🌟 FIX QUAN TRỌNG
    balance: firebase.firestore.FieldValue.increment(100000)
  }, { merge: true })
  .then(() => {
    console.log("✅ Nạp tiền thành công");

    setStatus("💰 Đã nạp +100.000");

    // 🌟 FALLBACK (phòng trường hợp onSnapshot chưa chạy)
    // -> cập nhật UI ngay cho học sinh thấy
    const balanceEl = document.getElementById("balance");
    const current = Number(balanceEl.innerText) || 0;
    balanceEl.innerText = current + 100000;
  })
  .catch((err) => {
    console.error("❌ Lỗi khi nạp tiền:", err);
    setStatus("❌ Lỗi: " + err.message);
  });
}

// 8. HÀM HIỂN THỊ THÔNG BÁO
function setStatus(message) {
  const statusElement = document.getElementById("status");
  if (statusElement) statusElement.innerText = message;
}