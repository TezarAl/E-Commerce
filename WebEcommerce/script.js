document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. LOGIKA LOGIN (Hanya berjalan jika elemen login ada)
    // =========================================================
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) { 
        loginForm.addEventListener('submit', function(event) {
            // Mencegah form untuk melakukan submit standar (refresh halaman)
            event.preventDefault();
        
            // Mengambil nilai dari input
            const usernameInput = document.getElementById('username').value;
            const passwordInput = document.getElementById('password').value;
            const messageElement = document.getElementById('message');
        
            // Menghilangkan pesan sebelumnya
            messageElement.classList.add('hidden');
            messageElement.classList.remove('success', 'error');
        
            // **Logika Validasi Sederhana**
            const validUsername = "zar";
            const validPassword = "aa";
        
            if (usernameInput === validUsername && passwordInput === validPassword) {
                // Login Berhasil
                messageElement.textContent = "Login Berhasil! Selamat datang.";
                messageElement.classList.add('success');
            } else {
                // Login Gagal
                messageElement.textContent = "Username atau Password salah.";
                messageElement.classList.add('error');
            }
        
            // Menampilkan pesan
            messageElement.classList.remove('hidden');
        });
    }

    // =========================================================
    // 2. LOGIKA KERANJANG (Setelah perbaikan)
    // =========================================================
    
    // Selector tombol: hanya mencari ikon Remixicon yang seragam
    const addBtns = Array.from(document.querySelectorAll('.ri-shopping-cart-2-fill'));

    // Helper: parse harga dari teks "Rp89.000" -> number 89000
    function parsePrice(text) {
        if (!text) return 0;
        const digits = text.replace(/\D+/g, '');
        return digits ? parseInt(digits, 10) : 0;
    }

    // Ambil data cart dari localStorage
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch (e) {
            console.error('localStorage getCart error', e);
            return [];
        }
    }
    function saveCart(cart) {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartIcon();
        } catch (e) {
            console.error('localStorage saveCart error', e);
        }
    }

    // Update badge pada icon keranjang di nav (icon .fa-cart-shopping)
    function updateCartIcon() {
        const cart = getCart();
        const total = cart.reduce((s, it) => s + (it.qty || 0), 0);
        // Selector untuk ikon keranjang di navbar (fa-cart-shopping)
        const cartIcon = document.querySelector('.fa-cart-shopping'); 
        if (cartIcon) {
            cartIcon.setAttribute('data-count', total);
            if (total > 0) cartIcon.classList.add('has-items'); else cartIcon.classList.remove('has-items');
        }
    }

    // Tambah produk ke cart
    function addToCart(product) {
        const cart = getCart();
        const existing = cart.find(it => it.name === product.name && it.price === product.price);
        if (existing) {
            existing.qty = (existing.qty || 0) + 1;
        } else {
            product.qty = 1;
            cart.push(product);
        }
        saveCart(cart);
        // Notifikasi
        if (window.alert) {
            alert(`${product.name} ditambahkan ke keranjang!`);
        }
        console.log('Cart now:', cart);
    }

    // Fungsi untuk ekstrak info produk dari elemen .pro terdekat
    function extractProductData(proEl) {
        if (!proEl) return null;
        const nameEl = proEl.querySelector('h5');
        const priceEl = proEl.querySelector('h4');
        const imgEl = proEl.querySelector('img');

        const name = nameEl ? nameEl.textContent.trim() : 'Produk Tanpa Nama';
        const price = priceEl ? parsePrice(priceEl.textContent) : 0;
        const image = imgEl ? imgEl.src : '';

        return { name, price, image };
    }

    // Attach listener ke semua tombol yang ditemukan
    addBtns.forEach((btn, index) => {
        console.log(`[DEBUG] Tombol keranjang #${index + 1} ditemukan.`);
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            // Cari ancestor .pro
            const proEl = btn.closest('.pro');
            
            const product = extractProductData(proEl);
            
            if (!product || product.price === 0) {
                console.error('Data produk gagal diekstrak.', product);
                alert('Gagal menambahkan: Data produk (nama atau harga) tidak ditemukan.');
                return;
            }

            // Tambah ke keranjang
            addToCart(product);
        });
    });

    // Peringatan jika tidak ada tombol yang terdeteksi
    if (addBtns.length === 0) {
        console.warn('Tidak menemukan tombol add-to-cart (.ri-shopping-cart-2-fill). Periksa kembali file index.html Anda.');
    } else {
        console.info(`${addBtns.length} tombol keranjang ditemukan dan siap.`)
    }

    // Inisialisasi icon
    updateCartIcon();
});