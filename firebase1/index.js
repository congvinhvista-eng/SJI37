

// Sửa tên, mô tả, giá và đường dẫn ảnh trong danh sách này.
const menu = [
  {
    name: "Matcha xanh mát",
    description: "Matcha · Sữa yến mạch",
    price: 59000,
    image: "https://images.unsplash.com/photo-1766426910014-63a302fa137e?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    name: "Latte sữa hạnh nhân",
    description: "Cà phê · Sữa hạnh nhân",
    price: 49000,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1637&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    name: "Mocha socola",
    description: "Cà phê · Socola · Sữa tươi",
    price: 55000,
    image: "https://plus.unsplash.com/premium_photo-1673459683929-3f3574de7e75?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D ",
  },
  {
    name: "Cà phê sữa đá",
    description: "Cà phê phin · Sữa đặc",
    price: 35000,
    image: "https://plus.unsplash.com/premium_photo-1677607237294-b041e4b57391?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    name: "Bạc xỉu",
    description: "Sữa tươi · Cà phê",
    price: 39000,
    image: "https://images.unsplash.com/photo-1658646479124-bc31e6849497?q=80&w=1551&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    name: "Cappuccino",
    description: "Espresso · Sữa · Bọt sữa",
    price: 52000,
    image: "https://images.unsplash.com/photo-1761783768352-e7f42bfa9988?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    name: "Caramel macchiato",
    description: "Espresso · Sữa · Caramel",
    price: 59000,
    image: "https://images.unsplash.com/photo-1662047102608-a6f2e492411f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    name: "Cold brew cam",
    description: "Cà phê ủ lạnh · Cam tươi",
    price: 49000,
    image: "https://plus.unsplash.com/premium_photo-1670469009826-db07ab733925?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    name: "Cacao nóng",
    description: "Cacao nguyên chất · Sữa tươi",
    price: 45000,
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    name: "Trà đào cam sả",
    description: "Trà · Đào · Cam · Sả",
    price: 45000,
    image: "https://plus.unsplash.com/premium_photo-1687977547426-33ff1d8683d3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    name: "Matcha latte",
    description: "Matcha · Sữa tươi",
    price: 55000,
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
];



const menuGrid = document.getElementById("menuGrid");
const menuPage = document.getElementById("menuPage");
const drinksToShow = menuPage ? menu : menu.slice(0, 3);

if (menuGrid) {
  drinksToShow.forEach(function (drink, index) {
    menuGrid.innerHTML += `
      <article class="menu-card">
        <div class="menu-image">
          ${drink.image ? `<img class="menu-photo" src="${drink.image}" alt="${drink.name}">` : ""}
        </div>
        <div class="menu-card-info">
          <div>
            <h3>${drink.name}</h3>
            <p>${drink.description}</p>
          </div>
          <span class="price">${drink.price.toLocaleString("vi-VN")}đ</span>
        </div>
        ${menuPage ? `<button class="button button-cart" id="addToCartBtn-${index}" type="button" data-drink-index="${index}">Thêm vào giỏ</button>` : ""}
      </article>
    `;
  });
}

const cart = [];
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const cartMessage = document.getElementById("cartMessage");

function updateCart() {
  if (!cartCount || !cartTotal || !placeOrderBtn) return;

  const totalCount = cart.reduce(function (sum, drink) {
    return sum + drink.quantity;
  }, 0);
  const totalPrice = cart.reduce(function (sum, drink) {
    return sum + drink.price * drink.quantity;
  }, 0);

  cartCount.textContent = totalCount;
  cartTotal.textContent = totalPrice.toLocaleString("vi-VN") + "đ";
  placeOrderBtn.disabled = totalCount === 0;
}

if (menuPage && menuGrid) {
  menuGrid.addEventListener("click", function (event) {
    const button = event.target.closest("[data-drink-index]");
    if (!button) return;

    const drink = menu[Number(button.dataset.drinkIndex)];
    const itemInCart = cart.find(function (item) {
      return item.name === drink.name;
    });

    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      cart.push({ name: drink.name, price: drink.price, quantity: 1 });
    }

    updateCart();
    cartMessage.textContent = "Đã thêm " + drink.name + " vào giỏ.";
  });
}

if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", function () {
    cartMessage.textContent = "Giỏ hàng đã sẵn sàng. Đặt món trực tuyến hiện chưa được kết nối.";
  });
}


const loadMoreBtn = document.getElementById("loadMoreBtn");
const menuLoginStatus = document.getElementById("menuLoginStatus");

firebase.auth().onAuthStateChanged(function (user) {
  if (loadMoreBtn) {
    loadMoreBtn.disabled = !user;
    loadMoreBtn.onclick = user ? function () {
      window.location.href = "menu.html";
    } : null;
  }

  if (menuPage) {
    if (user) {
      menuPage.hidden = false;
    } else {
      if (menuLoginStatus) {
        menuLoginStatus.textContent = "Bạn cần đăng nhập để xem menu. Đang quay lại trang tài khoản...";
      }
      window.location.replace("index.html#account");
    }
  }
});
