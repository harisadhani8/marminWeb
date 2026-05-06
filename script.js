const HARGA_PER_ITEM = 3000; 

const menuData = [
  { id: 1, nama: "Martabak Coklat Keju",      img: "assets/cokke.png"  },
  { id: 2, nama: "Martabak Keju",         img: "assets/ke.png"     },
  { id: 3, nama: "Martabak Coklat",         img: "assets/susor.png"  },
  { id: 4, nama: "Martabak Oreo",   img: "assets/susov.png"  },
  { id: 5, nama: "Martabak Kacang",     img: "assets/cokka.png"  },
];

let cart = {};

const menuList = document.getElementById("menuList");

menuData.forEach((item) => {
  cart[item.nama] = 0;

  menuList.innerHTML += `
    <div class="menu-item">
      <p>${item.id}. ${item.nama}</p>
      <img src="${item.img}" alt="${item.nama}" loading="lazy">
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="updateQty('${item.nama}', -1)">−</button>
        <span class="qty-num" id="qty-${item.id}">0</span>
        <button class="qty-btn" onclick="updateQty('${item.nama}', 1)">+</button>
      </div>
    </div>
  `;
});

function updateQty(name, change) {
  const item = menuData.find((i) => i.nama === name);

  cart[name] = Math.max(0, cart[name] + change);

  document.getElementById(`qty-${item.id}`).innerText = cart[name];

  updateTotal();
}

function updateTotal() {
  const totalItem = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalHarga = totalItem * HARGA_PER_ITEM;

  const elTotal = document.getElementById("totalHarga");

  elTotal.innerText = "Rp " + totalHarga.toLocaleString("id-ID");

  elTotal.classList.remove("pop");
  void elTotal.offsetWidth;
  elTotal.classList.add("pop");
  setTimeout(() => elTotal.classList.remove("pop"), 200);
}

function navigateTo(pageId) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0, 0);
}

function validateMenuSelection() {
  const totalItem = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  if (totalItem === 0) {
    alert("Silahkan pilih martabaknya dulu yaa!");
  } else {
    navigateTo("form");
  }
}

function showSummary() {
  const nama  = document.getElementById("nama").value.trim();
  const kelas = document.getElementById("kelas").value.trim();
  const wa    = document.getElementById("whatsapp").value.trim();

  if (!nama || !kelas || !wa) {
    alert("Mohon isi dengan benar ya cuyy!");
    return;
  }

  document.getElementById("sum-nama").innerText  = nama;
  document.getElementById("sum-kelas").innerText = kelas;

  const sumItems = document.getElementById("sum-items");
  sumItems.innerHTML = ""; // Kosongkan dulu sebelum diisi ulang

  let totalItem  = 0;
  let totalHarga = 0;

  for (const [namaItem, qty] of Object.entries(cart)) {
    if (qty > 0) {
      const subtotal = qty * HARGA_PER_ITEM;
      totalItem  += qty;
      totalHarga += subtotal;

      sumItems.innerHTML += `
        <div class="summary-item-row">
          <span>${namaItem}</span>
          <span>${qty} pcs × Rp ${HARGA_PER_ITEM.toLocaleString("id-ID")} = <strong>Rp ${subtotal.toLocaleString("id-ID")}</strong></span>
        </div>
      `;
    }
  }

  document.getElementById("sum-total").innerText =
    `Rp ${totalHarga.toLocaleString("id-ID")} (${totalItem} pcs)`;

  navigateTo("summary");
}

function sendOrder() {
  const nama  = document.getElementById("nama").value.trim();
  const kelas = document.getElementById("kelas").value.trim();
  const wa    = document.getElementById("whatsapp").value.trim();

  let details = "";
  let totalItem  = 0;
  let totalHarga = 0;

  for (const [namaItem, qty] of Object.entries(cart)) {
    if (qty > 0) {
      totalItem  += qty;
      totalHarga += qty * HARGA_PER_ITEM;
      details    += `  • ${namaItem} (${qty} pcs)\n`;
    }
  }

  const message =
    `Halo Admin MarMin! 👋\n\n` +
    `Saya *${nama}* dari kelas *${kelas}* ingin memesan:\n\n` +
    `${details}\n` +
    `Total: *Rp ${totalHarga.toLocaleString("id-ID")}* (${totalItem} pcs)\n` +
    `No HP: ${wa}\n\n` +
    `Terima kasih! 🙏`;

  window.open(
    `https://wa.me/6281315544090?text=${encodeURIComponent(message)}`,
    "_blank"
  );

  showToast("✅ Pesanan berhasil dikirim ke WhatsApp!");

  navigateTo("success");
}

function showToast(pesan) {
  const toast = document.getElementById("toastNotif");
  toast.innerText = pesan;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function resetAndGoHome() {
  menuData.forEach((item) => {
    cart[item.nama] = 0;
    document.getElementById(`qty-${item.id}`).innerText = "0";
  });

  document.getElementById("totalHarga").innerText = "Rp 0";

  document.getElementById("nama").value      = "";
  document.getElementById("kelas").value     = "";
  document.getElementById("whatsapp").value  = "";

  navigateTo("hero");
}
