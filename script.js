/* NULISINAJA - Premium Logic 2026 
   Fokus pada performa scroll dan sinkronisasi class CSS
*/

const menuToggle = document.getElementById('menuToggle');
const menuOverlay = document.getElementById('menuOverlay');
const menuLinks = document.querySelectorAll('.menu-link');
const header = document.querySelector('header');

// 1. Toggle Menu Logic dengan Scroll Lock
menuToggle.addEventListener('click', () => {
    const isOpen = menuOverlay.classList.toggle('open');
    menuToggle.classList.toggle('active');
    
    // Gunakan class 'no-scroll' di body agar lebih konsisten daripada inline overflow
    if (isOpen) {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }
});

// 2. Tutup menu saat link diklik (Smooth Transition)
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        menuOverlay.classList.remove('open');
        document.body.classList.remove('no-scroll');
    });
});

// 3. Navbar Logic (Scroll to Top & Glassmorphism)
// Fungsi ini yang memicu header.scrolled di CSS untuk naik ke top: 0
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, { passive: true }); // 'passive' meningkatkan performa scroll di mobile

// 4. Smooth Scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetId !== '#' && targetElement) {
            e.preventDefault();
            
            // Memberikan sedikit offset jika navbar menutupi konten
            const offset = 80; 
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// --- Hero Slider Logic ---
const track = document.getElementById('sliderTrack');
const dots = document.querySelectorAll('.dot');
let activeIndex = 0;

function updateDots(index) {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Auto Slide every 5 seconds
let autoSlide = setInterval(() => {
    activeIndex = (activeIndex + 1) % 3;
    const scrollAmount = track.offsetWidth * activeIndex;
    track.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    updateDots(activeIndex);
}, 5000);

// Manual Scroll Sync
track.addEventListener('scroll', () => {
    const index = Math.round(track.scrollLeft / track.offsetWidth);
    if (index !== activeIndex) {
        activeIndex = index;
        updateDots(activeIndex);
    }
});

// Stop auto-slide on user interaction
track.addEventListener('touchstart', () => clearInterval(autoSlide));

/* --- Smart Counter Logic: Trigger on Scroll --- */
const observerOptions = {
    threshold: 0.6 // Mulai hitung saat 60% elemen terlihat
};

const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 detik selesai
            const startTime = performance.now();

            const updateNumber = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing Out: Cepat di awal, melambat di akhir (Premium feel)
                const easeOut = 1 - Math.pow(1 - progress, 4);
                const currentVal = Math.floor(easeOut * target);

                counter.innerText = currentVal;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    counter.innerText = target; // Pastikan angka akhir tepat
                }
            };

            requestAnimationFrame(updateNumber);
            observer.unobserve(counter); // Berhenti mengamati setelah jalan sekali
        }
    });
}, observerOptions);

// Daftarkan semua span stat-number ke observer
document.querySelectorAll('.stat-number').forEach(el => countObserver.observe(el));


function switchTab(type) {
    // 1. Ambil semua tombol dan grid
    const buttons = document.querySelectorAll('.tab-btn');
    const websiteGrid = document.getElementById('website-grid');
    const penulisanGrid = document.getElementById('penulisan-grid');

    // 2. Reset semua status aktif pada tombol
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // 3. Tambahkan class active ke tombol yang diklik (menggunakan event target)
    event.currentTarget.classList.add('active');

    // 4. Logika perpindahan grid agar tidak rusak
    if (type === 'website') {
        penulisanGrid.classList.remove('active');
        // Beri jeda sedikit agar transisi opacity terasa smooth
        setTimeout(() => {
            penulisanGrid.style.display = 'none';
            websiteGrid.style.display = 'grid';
            setTimeout(() => websiteGrid.classList.add('active'), 10);
        }, 10);
    } else {
        websiteGrid.classList.remove('active');
        setTimeout(() => {
            websiteGrid.style.display = 'none';
            penulisanGrid.style.display = 'grid';
            setTimeout(() => penulisanGrid.classList.add('active'), 10);
        }, 10);
    }
}


const modal = document.getElementById('orderModal');
const packageText = document.querySelector('#selectedPackageText span');
const form = document.getElementById('orderForm');
const submitBtn = document.querySelector('.btn-submit');

// Buka Modal
function openModal(packageName) {
    packageText.innerText = packageName;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Tutup Modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Klik luar modal
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

// Format waktu Indonesia
function getWaktu() {
    return new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Generate Order ID
function getOrderID() {
    return 'ORD-' + Date.now().toString().slice(-6);
}

// Validasi sederhana
function validateForm(nama, hp, email) {
    if (!nama || !hp || !email) {
        alert('Semua field wajib diisi!');
        return false;
    }

    if (!/^08[0-9]{8,13}$/.test(hp)) {
        alert('Nomor WhatsApp tidak valid!');
        return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        alert('Email tidak valid!');
        return false;
    }

    return true;
}

// Submit ke Telegram
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const hp = document.getElementById('hp').value.trim();
    const email = document.getElementById('email').value.trim();
    const paket = packageText.innerText;

    if (!validateForm(nama, hp, email)) return;

    // UI Loading
    submitBtn.innerText = 'Mengirim...';
    submitBtn.disabled = true;

    const token = '8258338893:AAEqzURPWiF2sYQkv3Td9bOkHSasD7-cnyM';
    const chat_id = '8063917939';

    const message = `
<pre>
📥 ORDER MASUK - NULISINAJA
━━━━━━━━━━━━━━━━━━━━━━━━

Order ID     : ${getOrderID()}
Paket        : ${paket}
Nama         : ${nama}
WhatsApp     : ${hp}
Email        : ${email}
Waktu        : ${getWaktu()}

━━━━━━━━━━━━━━━━━━━━━━━━
</pre>
    `;

    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            chat_id: chat_id,
            text: message,
            parse_mode: 'HTML'
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.ok) {
            kurangiSlot(); // SLOT BERKURANG
            alert('Pesanan berhasil dikirim!');
            form.reset();
            setTimeout(closeModal, 300);
        } else {
            alert('Gagal kirim ke Telegram');
        }
    })
    .catch(() => {
        alert('Gagal mengirim pesanan. Coba lagi.');
    })
    .finally(() => {
        submitBtn.innerText = 'Kirim Pesanan';
        submitBtn.disabled = false;
    });
});

// SLOT SYSTEM RESET 3 MINGGU
const SLOT_KEY = 'slotWebsite';
const RESET_KEY = 'slotResetDate';
const MAX_SLOT = 3;
const RESET_DAYS = 21;

// Cek reset slot
function checkResetSlot() {
    const lastReset = localStorage.getItem(RESET_KEY);
    const now = new Date().getTime();
    let slot = localStorage.getItem(SLOT_KEY);

    // Jika pertama kali / slot tidak ada → set ke MAX_SLOT
    if (!lastReset || !slot) {
        localStorage.setItem(RESET_KEY, now);
        localStorage.setItem(SLOT_KEY, MAX_SLOT);
    } else {
        const diffDays = (now - lastReset) / (1000 * 60 * 60 * 24);

        if (diffDays >= RESET_DAYS) {
            localStorage.setItem(SLOT_KEY, MAX_SLOT);
            localStorage.setItem(RESET_KEY, now);
        }
    }
}

// Update tampilan slot
function updateSlotUI() {
    const slotLabel = document.getElementById('slotLabel');
    const slotBtn = document.getElementById('slotBtn');

    let slot = parseInt(localStorage.getItem(SLOT_KEY));

    // Jika slot tidak ada / NaN → reset ke MAX_SLOT
    if (isNaN(slot)) {
        slot = MAX_SLOT;
        localStorage.setItem(SLOT_KEY, slot);
    }

    if (slot > 0) {
        slotBtn.disabled = false;
        slotBtn.innerText = 'Ambil Slot';
        slotBtn.style.background = '';

        if (slot == 1) {
            slotLabel.innerText = 'Slot Terakhir!';
            slotLabel.style.background = 'orange';
        } else if (slot <= 2) {
            slotLabel.innerText = 'Hampir Habis! Sisa ' + slot + ' Slot';
            slotLabel.style.background = 'orange';
        } else {
            slotLabel.innerText = 'Sisa ' + slot + ' Slot';
            slotLabel.style.background = '';
        }
    } else {
        slotLabel.innerText = 'Sold Out';
        slotLabel.style.background = 'red';
        slotBtn.innerText = 'Sold Out';
        slotBtn.disabled = true;
        slotBtn.style.background = 'gray';
    }
}

// Kurangi slot (dipanggil setelah order berhasil)
function kurangiSlot() {
    let slot = parseInt(localStorage.getItem(SLOT_KEY));

    if (isNaN(slot)) slot = MAX_SLOT;

    slot--;

    if (slot < 0) slot = 0;

    localStorage.setItem(SLOT_KEY, slot);
    updateSlotUI();
}

//Reset manual (buat testing)
function resetSlot() {
    localStorage.setItem(SLOT_KEY, MAX_SLOT);
    localStorage.setItem(RESET_KEY, new Date().getTime());
    updateSlotUI();
    alert('Slot direset ke ' + MAX_SLOT);
}

// Jalankan saat halaman dibuka
checkResetSlot();

// Reset slot dari URL
if (window.location.search.includes('resetslot')) {
    localStorage.setItem(SLOT_KEY, MAX_SLOT);
    localStorage.setItem(RESET_KEY, new Date().getTime());
    alert('Slot berhasil direset ke ' + MAX_SLOT);
}

updateSlotUI();
