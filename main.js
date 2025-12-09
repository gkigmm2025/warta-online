// --- KONFIGURASI ---
const pdfUrl = 'WARTA JEMAAT GKI GMM EDISI 12 Tahun ke-22 (07-12-2025).pdf'; // Ganti dengan nama file PDF Anda
const bookElement = document.getElementById('book');

// Inisialisasi Flipbook
const pageFlip = new St.PageFlip(bookElement, {
    width: 400,  // Lebar dasar (resolusi render)
    height: 566, // Tinggi dasar (sesuai rasio A4 biasanya)
    size: 'stretch',
    minWidth: 300,
    maxWidth: 800,
    minHeight: 400,
    maxHeight: 1100,
    showCover: true,
});

// Fungsi untuk merender PDF ke Flipbook
async function loadPdf() {
    try {
        // 1. Load Dokumen PDF
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        console.log("PDF Loaded, total pages: " + pdf.numPages);

        // 2. Loop setiap halaman PDF
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            
            // Buat elemen Div pembungkus halaman
            const div = document.createElement('div');
            div.className = 'my-page';
            if (i === 1 || i === pdf.numPages) div.dataset.density = 'hard'; // Hard cover
            
            // Buat Canvas untuk menggambar PDF
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            // Atur skala resolusi (agar tidak pecah di HP)
            const viewport = page.getViewport({ scale: 1.5 }); 
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Render halaman PDF ke Canvas
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            // Masukkan canvas ke div, div ke buku
            div.appendChild(canvas);
            bookElement.appendChild(div);
        }

        // 3. Update Flipbook setelah semua halaman masuk
        pageFlip.loadFromHTML(document.querySelectorAll('.my-page'));
        
        // Update info halaman
        updatePageInfo();

    } catch (error) {
        console.error("Gagal memuat PDF: " + error);
        bookElement.innerHTML = "<p>Gagal memuat file PDF. Pastikan nama file benar.</p>";
    }
}

// Navigasi Tombol
document.getElementById('btnPrev').onclick = () => pageFlip.flipPrev();
document.getElementById('btnNext').onclick = () => pageFlip.flipNext();

// Update Info Halaman saat dibalik
pageFlip.on('flip', (e) => {
    updatePageInfo();
});

function updatePageInfo() {
    // Menampilkan halaman saat ini (indeks + 1 karena indeks mulai dari 0)
    // Tapi karena mode buku (2 halaman), logikanya agak beda, ini simpelnya:
    document.getElementById('pageInfo').innerText = 
        `Halaman ${pageFlip.getCurrentPageIndex() + 1}`;
}

// Jalankan fungsi
loadPdf();