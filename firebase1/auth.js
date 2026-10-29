const authForm = document.getElementById("loginForm");
const authStatusText = document.getElementById("authStatus");
const authNameField = document.getElementById("authNameField");
const authNameInput = document.getElementById("authName");
const authSubmitButton = document.getElementById("authSubmit");
const authModeTabs = document.querySelectorAll("[data-auth-mode]");
const authSignedIn = document.getElementById("authSignedIn");
const authFormSection = document.querySelector(".auth-card");
const requestedReturn = new URLSearchParams(window.location.search).get("returnTo");
const returnTo = requestedReturn === "menu.html#cart" ? requestedReturn : "menu.html";
let authMode = "login";

function showAuthMessage(message) {
  authStatusText.textContent = message;
}

function saveUser(user) {
  const userRef = firebase.firestore().collection("users").doc(user.uid);

  return userRef.get().then(function (userDocument) {
    if (userDocument.exists) {
      return userRef.set({ email: user.email }, { merge: true });
    }

    return userRef.set({
      email: user.email,
      balance: 0,
    });
  });
}

function finishSignIn(user) {
  return saveUser(user).then(function () {
    showAuthMessage("Đăng nhập thành công. Đang quay lại đặt món...");
    window.location.href = returnTo;
  });
}

authModeTabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    authMode = tab.dataset.authMode;
    const isRegistering = authMode === "register";

    authModeTabs.forEach(function (modeTab) {
      const isSelected = modeTab === tab;
      modeTab.classList.toggle("active", isSelected);
      modeTab.setAttribute("aria-pressed", isSelected);
    });

    authNameField.hidden = !isRegistering;
    authNameInput.required = isRegistering;
    document.getElementById("authHeading").textContent = isRegistering
      ? "Tạo tài khoản Mộc"
      : "Chào mừng bạn trở lại";
    document.getElementById("authDescription").textContent = isRegistering
      ? "Đăng ký để lưu lại những lần ghé thăm Mộc."
      : "Đăng nhập để tiếp tục khám phá menu nhà Mộc.";
    authSubmitButton.innerHTML = isRegistering
      ? 'Tạo tài khoản <span aria-hidden="true">→</span>'
      : 'Đăng nhập <span aria-hidden="true">→</span>';
    showAuthMessage("");
  });
});

authForm.addEventListener("submit", function (event) {
  event.preventDefault();
  authSubmitButton.disabled = true;

  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  let signInRequest;

  if (authMode === "register") {
    signInRequest = firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function (result) {
        return result.user.updateProfile({
          displayName: authNameInput.value.trim(),
        }).then(function () {
          return result.user;
        });
      });
  } else {
    signInRequest = firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(function (result) {
        return result.user;
      });
  }

  signInRequest
    .then(finishSignIn)
    .catch(function (error) {
      showAuthMessage("Không thể hoàn tất: " + error.message);
      authSubmitButton.disabled = false;
    });
});

document.getElementById("googleLogin").addEventListener("click", function () {
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(googleProvider)
    .then(function (result) {
      return finishSignIn(result.user);
    })
    .catch(function (error) {
      showAuthMessage("Không thể đăng nhập Google: " + error.message);
    });
});

document.getElementById("facebookLogin").addEventListener("click", function () {
  const facebookProvider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(facebookProvider)
    .then(function (result) {
      return finishSignIn(result.user);
    })
    .catch(function (error) {
      showAuthMessage("Không thể đăng nhập Facebook: " + error.message);
    });
});



document.getElementById("authSignOut").addEventListener("click", function () {
  firebase.auth().signOut()
    .then(function () {
      authSignedIn.hidden = true;
      authFormSection.classList.remove("is-signed-in");
      authForm.reset();
      showAuthMessage("Bạn đã đăng xuất.");
    })
    .catch(function (error) {
      showAuthMessage("Không thể đăng xuất: " + error.message);
    });
});

firebase.auth().onAuthStateChanged(function (user) {
  if (!user) return;

  document.getElementById("signedInEmail").textContent = user.email;
  authSignedIn.hidden = false;
  authFormSection.classList.add("is-signed-in");
});
