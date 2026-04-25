const menuData = [
  { id: 1, nama: "Martabak Coklat Keju", img: "assets/cokke.png" },
  { id: 2, nama: "Martabak Keju", img: "assets/ke.png" },
  { id: 3, nama: "Martabak Coklat", img: "assets/susov.png" },
];

let cart = {};
const menuList = document.getElementById("menuList");

menuData.forEach((item) => {
  cart[item.nama] = 0;
  menuList.innerHTML += `
    <div class="menu-item">
        <p style="font-weight:900; color:dark-brown; font-size:1.1rem;">${item.nama}</p>
        <img src="${item.img}">
        <div class="qty-wrapper">
            <button class="qty-control-btn" onclick="updateQty('${item.nama}', -1)">-</button>
            <span id="qty-${item.id}" class="qty-display">0</span>
            <button class="qty-control-btn" onclick="updateQty('${item.nama}', 1)">+</button>
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
