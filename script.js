const menuData = [
  { id: 1, nama: "Martabak Coklat Keju", img: "assets/cokke.png" },
  { id: 2, nama: "Martabak Keju Susu", img: "assets/ke.png" },
  { id: 3, nama: "Martabak Susu Oreo", img: "assets/susor.png" },
  { id: 4, nama: "Martabak Susu Ovomaltine", img: "assets/susov.png" },
  { id: 5, nama: "Martabak Coklat Kacang", img: "assets/cokka.png" },
];

let cart = {};
const menuList = document.getElementById("menuList");

// Generate Menu List
menuData.forEach((item) => {
  cart[item.nama] = 0;
  menuList.innerHTML += `
    <div class="menu-item">
        <p style="font-weight:900; color:white; font-size:1.1rem;">${item.id}. ${item.nama}</p>
        <img src="${item.img}" alt="${item.nama}">
        <div class="qty-ctrl">
            <button class="qty-btn" onclick="updateQty('${item.nama}', -1)">-</button>
            <span class="qty-num" id="qty-${item.id}">0</span>
            <button class="qty-btn" onclick="updateQty('${item.nama}', 1)">+</button>
        </div>
    </div>`;
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
  window.scrollTo(0, 0);
}

function validateMenuSelection() {
  const total = Object.values(cart).reduce((a, b) => a + b, 0);
  if (total === 0) {
    alert("Silahkan pilih martabak dulu ya!");
  } else {
    navigateTo("form");
  }
}

function sendOrder() {
  const nama = document.getElementById("nama").value;
  const kelas = document.getElementById("kelas").value;
  const wa = document.getElementById("whatsapp").value;

  if (!nama || !kelas || !wa) return alert("Mohon lengkapi data diri!");

  let details = "";
  for (const [k, v] of Object.entries(cart)) {
    if (v > 0) details += `  • ${k} (${v} pcs)\n`;
  }

  const message = `Halo MarMin! 👋\n\nSaya *${nama}* dari kelas *${kelas}* ingin memesan:\n\n${details}\nNo HP: ${wa}\n\nTerima kasih!`;
  window.open(
    `https://wa.me/6281315544090?text=${encodeURIComponent(message)}`,
    "_blank",
  );
  navigateTo("success");
}
