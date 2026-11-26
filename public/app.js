const products = [
  {
    id: "pisang",
    name: "Keripik pisang",
    desc: "Renyah dengan rasa manis alami.",
    price: 16000,
    category: "Manis",
    badge: "Unggulan",
    rating: "★ 4,9",
    image: "./images/keripik-pisang.jpg",
  },
  {
    id: "singkong",
    name: "Keripik singkong",
    desc: "Rasa gurih untuk waktu santai.",
    price: 15000,
    category: "Gurih",
    badge: "Pilihan klasik",
    rating: "★ 4,8",
    image: "./images/keripik-singkong.jpg",
  },
  {
    id: "basreng",
    name: "Basreng daun jeruk",
    desc: "Gurih, pedas, dengan aroma daun jeruk.",
    price: 18000,
    category: "Pedas",
    badge: "Rasa favorit",
    rating: "★ 4,9",
    image: "./images/basreng.jpg",
  },
  {
    id: "makaroni",
    name: "Makaroni berbumbu",
    desc: "Potongan renyah dengan bumbu pilihan.",
    price: 14000,
    category: "Pedas",
    badge: "Renyah gurih",
    rating: "★ 4,7",
    image: "./images/makaroni.jpg",
  },
  {
    id: "kacang",
    name: "Kacang bawang",
    desc: "Camilan gurih yang nikmat dibagikan.",
    price: 17000,
    category: "Gurih",
    badge: "Teman berbagi",
    rating: "★ 4,8",
    image: "./images/kacang-bawang.jpg",
  },
];
const rupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
const grid = document.querySelector("#product-grid"),
  count = document.querySelector("#catalog-count"),
  cartItems = document.querySelector("#cart-items"),
  searchInput = document.querySelector("#product-search"),
  sortSelect = document.querySelector("#sort-products");
let cart = JSON.parse(localStorage.getItem("drysnack-cart") || "{}"),
  currentCategory = "Semua",
  searchTerm = "",
  sortMode = "featured";
function renderProducts() {
  let list = products.filter((p) => {
    const matchesCategory =
      currentCategory === "Semua" ||
      (currentCategory === "Favorit"
        ? ["pisang", "basreng"].includes(p.id)
        : p.category === currentCategory);
    const searchable = `${p.name} ${p.desc} ${p.category}`.toLocaleLowerCase(
      "id-ID",
    );
    return (
      matchesCategory &&
      searchable.includes(searchTerm.trim().toLocaleLowerCase("id-ID"))
    );
  });
  if (sortMode === "price-low") list.sort((a, b) => a.price - b.price);
  if (sortMode === "price-high") list.sort((a, b) => b.price - a.price);
  if (sortMode === "name")
    list.sort((a, b) => a.name.localeCompare(b.name, "id"));
  grid.innerHTML = list.length
    ? list
        .map(
          (p, i) =>
            `<article class="product-card" style="animation-delay:${i * 45}ms"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-badge">${p.badge}</span></div><div class="product-meta"><div class="product-topline"><h3 class="product-name">${p.name}</h3><span class="product-rating" aria-label="Peringkat ${p.rating}">${p.rating}</span></div><p class="product-desc">${p.desc}</p><div class="product-bottom"><span class="price">${rupiah(p.price)}</span><button class="add-button" data-add="${p.id}" aria-label="Tambahkan ${p.name} ke keranjang">Tambah +</button></div></div></article>`,
        )
        .join("")
    : '<div class="no-results">Camilan tidak ditemukan. Periksa kembali kata kunci atau kategori yang dipilih.</div>';
  count.textContent = `${list.length} ${list.length === 1 ? "pilihan camilan" : "pilihan camilan"}`;
}
function saveCart() {
  localStorage.setItem("drysnack-cart", JSON.stringify(cart));
  renderCart();
}
function renderCart() {
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0),
    total = entries.reduce(
      (sum, [id, qty]) => sum + products.find((p) => p.id === id).price * qty,
      0,
    ),
    units = entries.reduce((sum, [, qty]) => sum + qty, 0);
  document
    .querySelectorAll(".cart-count")
    .forEach((el) => (el.textContent = units));
  document.querySelector("#cart-subtotal").textContent = rupiah(total);
  document.querySelector("#checkout-total").textContent = rupiah(total);
  document.querySelector("#cart-empty").hidden = entries.length > 0;
  document.querySelector("#cart-footer").hidden = !entries.length;
  cartItems.innerHTML = entries
    .map(([id, qty]) => {
      const p = products.find((item) => item.id === id);
      return `<div class="cart-row"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><p>${rupiah(p.price)}</p><div class="quantity-control"><button data-qty="${id}" data-delta="-1" aria-label="Kurangi ${p.name}">−</button><span>${qty}</span><button data-qty="${id}" data-delta="1" aria-label="Tambah ${p.name}">+</button></div></div><button class="remove-item" data-remove="${id}" aria-label="Hapus ${p.name}">×</button></div>`;
    })
    .join("");
}
function toast(message) {
  const el = document.querySelector("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2300);
}
function openCart() {
  document.querySelector("#cart-drawer").classList.add("open");
  document.querySelector("#drawer-backdrop").classList.add("open");
  document.querySelector("#cart-drawer").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  document.querySelector("#cart-drawer").classList.remove("open");
  document.querySelector("#drawer-backdrop").classList.remove("open");
  document.querySelector("#cart-drawer").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]"),
    qty = e.target.closest("[data-qty]"),
    remove = e.target.closest("[data-remove]");
  if (add) {
    cart[add.dataset.add] = (cart[add.dataset.add] || 0) + 1;
    saveCart();
    const item = products.find((p) => p.id === add.dataset.add);
    toast(`${item.name} ditambahkan ke keranjang.`);
  }
  if (qty) {
    cart[qty.dataset.qty] = Math.max(
      0,
      (cart[qty.dataset.qty] || 0) + Number(qty.dataset.delta),
    );
    if (!cart[qty.dataset.qty]) delete cart[qty.dataset.qty];
    saveCart();
  }
  if (remove) {
    delete cart[remove.dataset.remove];
    saveCart();
  }
});
document.querySelector(".category-row").addEventListener("click", (e) => {
  const button = e.target.closest("[data-category]");
  if (!button) return;
  currentCategory = button.dataset.category;
  document.querySelectorAll(".category-chip").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderProducts();
});
searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value;
  renderProducts();
});
sortSelect.addEventListener("change", () => {
  sortMode = sortSelect.value;
  renderProducts();
});
document.addEventListener("keydown", (e) => {
  if (
    e.key === "/" &&
    document.activeElement !== searchInput &&
    !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
  ) {
    e.preventDefault();
    searchInput.focus();
  }
  if (e.key === "Escape") {
    closeCart();
    if (document.activeElement === searchInput) searchInput.blur();
  }
});
document
  .querySelectorAll(".basket-trigger")
  .forEach((button) => button.addEventListener("click", openCart));
document.querySelector(".close-drawer").addEventListener("click", closeCart);
document.querySelector("#drawer-backdrop").addEventListener("click", closeCart);
document.querySelector(".close-and-shop").addEventListener("click", closeCart);
document
  .querySelector(".checkout-trigger")
  .addEventListener("click", () =>
    document.querySelector("#checkout-dialog").showModal(),
  );
document
  .querySelector(".dialog-close")
  .addEventListener("click", () =>
    document.querySelector("#checkout-dialog").close(),
  );
document.querySelector("#checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!Object.keys(cart).length) return;
  const form = e.currentTarget;
  document.querySelector("#checkout-dialog").close();
  closeCart();
  cart = {};
  saveCart();
  form.reset();
  toast("Pesanan simulasi berhasil dikonfirmasi. Terima kasih.");
});
document.querySelector("#more-products").addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  sortSelect.value = "featured";
  sortMode = "featured";
  currentCategory = "Semua";
  document.querySelectorAll(".category-chip").forEach((button) => {
    const active = button.dataset.category === "Semua";
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderProducts();
  document
    .querySelector(".shop-content")
    .scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector(".mobile-menu").addEventListener("click", (e) => {
  const open = document.querySelector(".main-nav").classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".main-nav a").forEach((link) =>
  link.addEventListener("click", () => {
    document.querySelector(".main-nav").classList.remove("open");
    document
      .querySelector(".mobile-menu")
      .setAttribute("aria-expanded", "false");
  }),
);
renderProducts();
renderCart();
