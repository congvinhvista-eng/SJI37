// lấy phần tử ở trong html
const form = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginModeButton = document.getElementById("loginMode");
const registerModeButton = document.getElementById("registerMode");
const submitButton = document.getElementById("submitButton");
const googleButton = document.getElementById("googleButton");
const logoutButton = document.getElementById("logoutButton");
const userInfo = document.getElementById("userInfo");
const status = document.getElementById("status");
let mode = "login";

function setMode(nextMode) {
   // Cập nhật chế độ hiện tại
  mode = nextMode;
  // Thay đổi tiêu đề dựa trên chế độ
  // Nếu là login thì hiện "Đăng nhập"
  // Nếu không thì hiện "Đăng ký"
  document.getElementById("heading").textContent =
    mode === "login" ? "Đăng nhập" : "Đăng ký";
  loginModeButton.classList.toggle("secondary", mode !== "login");
  registerModeButton.classList.toggle("secondary", mode !== "register");
  loginModeButton.setAttribute("aria-pressed", String(mode === "login"));
  registerModeButton.setAttribute("aria-pressed", String(mode === "register"));
  status.textContent = "";
}

function showError(error) {
  const messages = {
    "auth/email-already-in-use": "Email này đã được đăng ký.",
    "auth/invalid-email": "Email không hợp lệ.",
    "auth/invalid-credential": "Email hoặc mật khẩu không đúng.",
    "auth/weak-password": "Mật khẩu cần có ít nhất 6 ký tự.",
    "auth/network-request-failed": "Không thể kết nối. Hãy kiểm tra mạng.",
    "auth/too-many-requests": "Bạn thử quá nhiều lần. Hãy chờ một lúc rồi thử lại.",
    "auth/popup-closed-by-user": "Bạn đã đóng cửa sổ đăng nhập Google.",
    "auth/popup-blocked": "Trình duyệt đã chặn cửa sổ đăng nhập. Hãy cho phép popup rồi thử lại.",
    "auth/unauthorized-domain": "Tên miền hiện tại chưa được cho phép trong Firebase Authentication.",
  };

  status.textContent = messages[error.code] || `Có lỗi xảy ra: ${error.message}`;
}

function validateInput(email, password) {
  if (!email.includes("@")) {
    status.textContent = "Email phải có ký tự @.";
    return false;
  }

  if (
    password.length < 6 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    status.textContent = "Mật khẩu cần ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số.";
    return false;
  }

  return true;
}

async function submitAuth(event) {
  event.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!validateInput(email, password)) return;

  submitButton.disabled = true;
  status.textContent = "";

  try {
    if (mode === "register") {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      status.textContent = "Đăng ký thành công!";
    } else {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      status.textContent = "Đăng nhập thành công!";
    }
  } catch (error) {
    showError(error);
  } finally {
    submitButton.disabled = false;
  }
}

async function signInWithGoogle() {
  googleButton.disabled = true;
  status.textContent = "";

  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
    status.textContent = "Đăng nhập Google thành công!";
  } catch (error) {
    showError(error);
  } finally {
    googleButton.disabled = false;
  }
}

loginModeButton.addEventListener("click", () => setMode("login"));
registerModeButton.addEventListener("click", () => setMode("register"));
form.addEventListener("submit", submitAuth);
googleButton.addEventListener("click", signInWithGoogle);

logoutButton.addEventListener("click", async () => {
  try {
    await firebase.auth().signOut();
    status.textContent = "Bạn đã đăng xuất.";
  } catch (error) {
    showError(error);
  }
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("userEmail").textContent = user.email || "Không có email";
    userInfo.hidden = false;
    logoutButton.hidden = false;
  } else {
    userInfo.hidden = true;
    logoutButton.hidden = true;
  }
});
