/* =====================================================
   STEPSTYLE STORE - MAIN.JS
   Semua logic dibungkus DOMContentLoaded
   Tujuan: memastikan HTML sudah siap sebelum JS jalan
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     CART STATE
     Cart disimpan di array supaya:
     - Bisa tambah produk
     - Bisa update quantity
     - Bisa dihapus
     - Bisa dirender ulang dengan mudah
  ===================================================== */
  let cart = [];

  /* =====================================================
     ADD TO CART
     Ambil semua tombol Add to Cart yang ada di dalam .product card saja
  ===================================================== */
  const addToCartButtons = document.querySelectorAll(".product-card .primary-button");

  // Loop semua tombol Add to Cart
  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {

      // Ambil elemen card terdekat dari tombol
      // Ini aman kalau struktur di dalam card berubah
      const card = button.closest(".product-card");
      if (!card) return;

      // Ambil data produk dari isi HTML
      const name = card.querySelector("h3").innerText;
      const price = card.querySelector(".price").innerText;
      const image = card.querySelector("img").src;

      // Kirim data produk ke fungsi cart
      addToCart({ name, price, image });
    });
  });


  /* =====================================================
     FUNCTION ADD TO CART
     Cek apakah produk sudah ada di cart
     - Kalau ada, quantity ditambah
     - Kalau belum, push produk baru
  ===================================================== */
  function addToCart(product) {

    // Cari produk dengan nama yang sama
    const existingItem = cart.find(item => item.name === product.name);

    if (existingItem) {
      // Jika produk sudah ada, tambah quantity
      existingItem.quantity += 1;
    } else {
      // Jika belum ada, masukkan ke cart
      cart.push({
        ...product,
        quantity: 1
      });
    }

    // Setelah update cart, tampilkan popup
    openCartPopup();
  }


  /* =====================================================
     CART ICON
     Klik icon cart untuk buka popup cart
  ===================================================== */
  const cartIcon = document.querySelector(".cart");

  if (cartIcon) {
    cartIcon.addEventListener("click", openCartPopup);
  }


  /* =====================================================
     CART POPUP
     Popup dibuat ulang setiap kali cart berubah
     Supaya data selalu sinkron
  ===================================================== */
  function openCartPopup() {

    // Hapus popup lama supaya tidak dobel
    let popup = document.querySelector(".cart-popup");
    if (popup) popup.remove();

    // Buat elemen popup baru
    popup = document.createElement("div");
    popup.className = "cart-popup";

    // Isi popup pakai template string
    popup.innerHTML = `
      <div class="cart-popup-inner">
        <h3>Cart</h3>

        ${cart.length === 0 ? "<p>Cart kosong</p>" : ""}

        <div class="cart-items">
          ${cart.map((item, index) => `
            <div class="cart-item">
              <img src="${item.image}">
              <div>
                <p>${item.name}</p>
                <p>${item.price}</p>

                <!-- Kontrol quantity -->
                <div class="qty">
                  <button data-action="minus" data-index="${index}">-</button>
                  <span>${item.quantity}</span>
                  <button data-action="plus" data-index="${index}">+</button>
                </div>
              </div>
            </div>
          `).join("")}
        </div>

        <button class="primary-button checkout-btn">Checkout</button>
        <button class="secondary-button close-cart">Close</button>
      </div>
    `;

    // Masukkan popup ke body
    document.body.appendChild(popup);

    // Tombol close untuk menutup popup
    popup.querySelector(".close-cart").onclick = () => popup.remove();

    // Tombol checkout untuk lanjut ke modal checkout
    popup.querySelector(".checkout-btn").onclick = openCheckoutModal;

    // Event untuk tombol plus dan minus quantity
    popup.querySelectorAll(".qty button").forEach(btn => {
      btn.addEventListener("click", () => {

        // Ambil index produk dari data attribute
        const index = btn.dataset.index;

        // Tentukan apakah tambah atau kurang
        const action = btn.dataset.action;

        changeQty(index, action === "plus" ? 1 : -1);
      });
    });
  }


  /* =====================================================
     CHANGE QUANTITY
     - Quantity bertambah atau berkurang
     - Jika quantity 0, produk dihapus
  ===================================================== */
  function changeQty(index, amount) {
    cart[index].quantity += amount;

    // Hapus item jika quantity 0
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    // Render ulang popup agar data update
    openCartPopup();
  }


  /* =====================================================
     CHECKOUT MODAL
     Modal konfirmasi sebelum checkout
  ===================================================== */
  function openCheckoutModal() {
    const modal = document.createElement("div");
    modal.className = "checkout-modal";

    modal.innerHTML = `
      <div class="checkout-box">
        <h3>Checkout</h3>

        <!-- Hitung total item di cart -->
        <p>Total item: ${cart.reduce((t, i) => t + i.quantity, 0)}</p>

        <button class="primary-button confirm-checkout">Confirm</button>
        <button class="secondary-button cancel-checkout">Cancel</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Batalkan checkout
    modal.querySelector(".cancel-checkout").onclick = () => modal.remove();

    // Konfirmasi checkout
    modal.querySelector(".confirm-checkout").onclick = () => {
      modal.remove();
      successCheckout();
    };
  }


  /* =====================================================
     SUCCESS CHECKOUT
     Feedback visual setelah checkout berhasil
  ===================================================== */
  function successCheckout() {
    const success = document.createElement("div");
    success.className = "checkout-success";

    success.innerHTML = `
      <div class="success-box">
        <h2>Success</h2>
        <p>Pesanan kamu diproses</p>
      </div>
    `;

    document.body.appendChild(success);

    // Kosongkan cart setelah checkout
    cart = [];

    // Hilangkan popup sukses setelah 2 detik
    setTimeout(() => {
      success.remove();
    }, 2000);
  }


  /* =====================================================
     CONTACT FORM
     Validasi sederhana tanpa backend
  ===================================================== */
  const form = document.querySelector(".form");

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      // Ambil value input
      const name = form.querySelector("input[type='text']").value;
      const email = form.querySelector("input[type='email']").value;
      const message = form.querySelector("textarea").value;

      // Validasi kosong
      if (!name || !email || !message) {
        alert("Lengkapi semua field");
        return;
      }

      // Simulasi kirim data
      alert("Pesan berhasil dikirim");

      // Reset form
      form.reset();
    });
  }

});
