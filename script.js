const menuData = [
  { id: 1, nama: "Martabak Coklat Keju", img: "assets/cokke.png" },
  { id: 2, nama: "Martabak Keju Susu", img: "assets/ke.png" },
  { id: 3, nama: "Martabak Susu Oreo", img: "assets/susor.png" },
  { id: 4, nama: "Martabak Susu Ovomaltine", img: "assets/susov.png" },
  { id: 5, nama: "Martabak Coklat Kacang", img: "assets/cokka.png" },
];

let cart = {};

const menuList = document.getElementById("menuList");
menuData.forEach((item) => {
  cart[item.nama] = 0;
  menuList.innerHTML += `
        <div class="menu-item">
            <p>${item.id}. ${item.nama}</p>
            <img src="${item.img}" alt="${item.nama}">
            <div class="qty-ctrl">
                <button class="qty-btn" onclick="updateQty('${item.nama}', -1)">-</button>
                <span id="qty-${item.id}">0</span>
                <button class="qty-btn" onclick="updateQty('${item.nama}', 1)">+</button>
            </div>
        </div>
    `;
});

function updateQty(name, change) {
  const item = menuData.find((i) => i.nama === name);
  cart[name] = Math.max(0, cart[name] + change);
  document.getElementById(`qty-${item.id}`).innerText = cart[name];
}

function navigateTo(pageId) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

function sendOrder() {
  const nama = document.getElementById("nama").value;
  const kelas = document.getElementById("kelas").value;
  const phone = "6281315544090"; 

  let itemDetails = "";
  for (const [key, val] of Object.entries(cart)) {
    if (val > 0) itemDetails += `-${key} sebanyak ${val}\n`;
  }

  if (itemDetails === "") return alert("Pilih menu dulu!");
  if (!nama || !kelas) return alert("Isi data diri dulu!");

  const message = `Halo Admin MarMin! 👋
Saya ingin memesan Martabak Mini dengan detail berikut:

👤 Nama: ${nama}
📍 Kelas: ${kelas}

🛒 Detail Pesanan:
${itemDetails}
Mohon segera diproses ya, Kak. Terima kasih!`;

  const encodedMsg = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${encodedMsg}`, "_blank");
  navigateTo("success");
}
