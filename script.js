/* =====================================================
   MARMIN - script.js
   ===================================================== */

/* ─── DATA MENU ───────────────────────────────────────
   Array (daftar) berisi objek tiap menu.
   Harga ditulis di sini supaya mudah diubah kalau perlu. */
const menuData = [
  { id: 1, nama: "Martabak Coklat Keju",     img: "assets/cokke.png",  harga: 3000 },
  { id: 2, nama: "Martabak Keju Susu",        img: "assets/ke.png",     harga: 3000 },
  { id: 3, nama: "Martabak Susu Oreo",        img: "assets/susor.png",  harga: 3000 },
  { id: 4, nama: "Martabak Susu Ovomaltine",  img: "assets/susov.png",  harga: 3000 },
  { id: 5, nama: "Martabak Coklat Kacang",    img: "assets/cokka.png",  harga: 3000 },
];

/* ─── KERANJANG (CART) ────────────────────────────────
   Objek cart menyimpan jumlah pesanan tiap menu.
   Contoh isi cart setelah user memilih:
   { "Martabak Coklat Keju": 2, "Martabak Keju Susu": 0, ... } */
let cart = {};

/* Ambil elemen HTML dengan id "menuList" untuk kita isi */
const menuList = document.getElementById("menuList");

/* ─── RENDER KARTU MENU ───────────────────────────────
   Loop (perulangan) untuk membuat kartu HTML tiap menu */
menuData.forEach((item) => {
  /* Set jumlah awal = 0 untuk setiap menu */
  cart[item.nama] = 0;

  /* Buat HTML kartu menu dan tambahkan ke dalam menuList */
  menuList.innerHTML += `
    <div class="menu-item">
      <p class="menu-item-nama">${item.id}. ${item.nama}</p>
      <img src="${item.img}" alt="${item.nama}" />
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="updateQty('${item.nama}', -1)">−</button>
        <span class="qty-num" id="qty-${item.id}">0</span>
        <button class="qty-btn" onclick="updateQty('${item.nama}', 1)">+</button>
      </div>
    </div>
  `;
});

/* ─── UPDATE JUMLAH PESANAN ───────────────────────────
   Fungsi ini dipanggil saat tombol + atau - diklik.
   Parameter:
     name   = nama menu (misal "Martabak Coklat Keju")
     change = +1 (tambah) atau -1 (kurang)          */
function updateQty(name, change) {
  /* Cari item yang cocok namanya di array menuData */
  const item = menuData.find((i) => i.nama === name);

  /* Update jumlah di cart. Math.max(0, ...) memastikan
     angkanya tidak bisa kurang dari 0 */
  cart[name] = Math.max(0, cart[name] + change);

  /* Update tampilan angka di layar */
  document.getElementById(`qty-${item.id}`).innerText = cart[name];

  /* FITUR BARU: Setiap kali qty berubah, update total harga */
  updateTotalHarga();
}

/* ─── FITUR BARU: HITUNG & TAMPILKAN TOTAL HARGA ─────
   Fungsi ini menghitung total harga dari semua item di cart
   lalu menampilkannya di elemen #totalHargaTeks.           */
function updateTotalHarga() {
  let total = 0;

  /* Loop: kalikan jumlah pesanan tiap menu dengan harganya */
  menuData.forEach((item) => {
    total += cart[item.nama] * item.harga;
  });

  /* Format angka jadi Rupiah, contoh: 9000 → "Rp 9.000"
     toLocaleString('id-ID') adalah cara bawaan JavaScript
     untuk format angka sesuai standar Indonesia */
  const formatted = "Rp " + total.toLocaleString("id-ID");
  document.getElementById("totalHargaTeks").innerText = formatted;
}

/* ─── NAVIGASI ANTAR HALAMAN ──────────────────────────
   Fungsi ini menyembunyikan semua halaman (.page),
   lalu hanya menampilkan halaman yang dipilih (pageId). */
function navigateTo(pageId) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0, 0);  /* Scroll ke atas saat pindah halaman */
}

/* ─── VALIDASI SEBELUM KE FORM ────────────────────────
   Cegah user lanjut ke halaman form kalau belum memilih menu */
function validateMenuSelection() {
  /* Hitung total semua item di cart */
  const total = Object.values(cart).reduce((a, b) => a + b, 0);

  if (total === 0) {
    alert("Silahkan pilih martabak dulu ya!");
    return;  /* Hentikan fungsi, jangan lanjut ke bawah */
  }

  /* FITUR BARU: Tampilkan ringkasan pesanan di halaman form
     sebelum berpindah halaman */
  tampilkanRingkasan();
  navigateTo("form");
}

/* ─── FITUR BARU: TAMPILKAN RINGKASAN PESANAN ─────────
   Fungsi ini mengisi kotak ringkasan di halaman form
   dengan daftar item yang sudah dipilih + total harga.   */
function tampilkanRingkasan() {
  let isiHTML = "";
  let grandTotal = 0;

  /* Loop semua item, tampilkan hanya yang qty > 0 */
  menuData.forEach((item) => {
    if (cart[item.nama] > 0) {
      const subtotal = cart[item.nama] * item.harga;
      grandTotal += subtotal;

      isiHTML += `
        <div class="ringkasan-item">
          <span>${item.nama} x${cart[item.nama]}</span>
          <span>Rp ${subtotal.toLocaleString("id-ID")}</span>
        </div>
      `;
    }
  });

  /* Masukkan daftar item ke dalam elemen HTML */
  document.getElementById("isiRingkasan").innerHTML = isiHTML;

  /* Tampilkan total */
  document.getElementById("ringkasanTotal").innerHTML = `
    <span>TOTAL</span>
    <span>Rp ${grandTotal.toLocaleString("id-ID")}</span>
  `;
}

/* ─── KIRIM PESANAN VIA WHATSAPP ──────────────────────
   Fungsi ini membaca isian form, membuat pesan,
   lalu membuka WhatsApp dengan pesan yang sudah jadi.   */
function sendOrder() {
  const nama   = document.getElementById("nama").value.trim();
  const kelas  = document.getElementById("kelas").value.trim();
  const wa     = document.getElementById("whatsapp").value.trim();

  /* Validasi: semua field harus diisi */
  if (!nama || !kelas || !wa) {
    alert("Mohon lengkapi semua data diri!");
    return;
  }

  /* Buat teks detail pesanan untuk pesan WA */
  let detailPesanan = "";
  let totalPcs  = 0;
  let totalHarga = 0;

  for (const [namaMenu, jumlah] of Object.entries(cart)) {
    if (jumlah > 0) {
      const item = menuData.find((i) => i.nama === namaMenu);
      const subtotal = jumlah * item.harga;
      detailPesanan += `  • ${namaMenu} x${jumlah} = Rp ${subtotal.toLocaleString("id-ID")}\n`;
      totalPcs   += jumlah;
      totalHarga += subtotal;
    }
  }

  /* Gabungkan semua menjadi satu pesan yang rapi */
  const pesan =
    `Halo MarMin! 👋\n\n` +
    `Saya *${nama}* dari kelas *${kelas}* ingin memesan:\n\n` +
    `${detailPesanan}\n` +
    `Total: *${totalPcs} pcs* = *Rp ${totalHarga.toLocaleString("id-ID")}*\n\n` +
    `No HP: ${wa}\n\nTerima kasih!`;

  /* Buka WhatsApp di tab baru. encodeURIComponent mengubah
     teks biasa menjadi format URL yang aman (misal spasi → %20) */
  window.open(
    `https://wa.me/6281315544090?text=${encodeURIComponent(pesan)}`,
    "_blank"
  );

  /* FITUR BARU: Tampilkan notifikasi toast setelah order */
  tampilkanToast("🎉 Pesanan berhasil dikirim!");

  /* Pindah ke halaman sukses */
  navigateTo("success");
}

/* ─── FITUR BARU: TOAST NOTIFICATION ─────────────────
   Fungsi ini menampilkan kotak notifikasi kecil sementara.
   Cara kerjanya:
   1. Tambahkan class "show" → toast muncul (lihat CSS)
   2. Setelah 3 detik (3000ms), hapus class "show" → toast hilang */
function tampilkanToast(pesan) {
  const toast = document.getElementById("toastNotif");
  toast.innerText = pesan;
  toast.classList.add("show");

  /* setTimeout menjalankan kode di dalamnya setelah jeda tertentu */
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);  /* 3000 milidetik = 3 detik */
}

/* ─── RESET DAN KEMBALI KE AWAL ──────────────────────
   Reset semua cart ke 0 dan perbarui tampilan angka,
   lalu kembali ke halaman hero.                        */
function resetDanKembali() {
  /* Kembalikan semua qty ke 0 */
  menuData.forEach((item) => {
    cart[item.nama] = 0;
    document.getElementById(`qty-${item.id}`).innerText = 0;
  });

  /* Reset total harga */
  document.getElementById("totalHargaTeks").innerText = "Rp 0";

  /* Kosongkan field form */
  document.getElementById("nama").value    = "";
  document.getElementById("kelas").value   = "";
  document.getElementById("whatsapp").value = "";

  navigateTo("hero");
}
