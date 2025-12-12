// --- KONFIGURASI ---
const pdfUrl = 'WARTA JEMAAT GKI GMM EDISI 12 Tahun ke-22 (07-12-2025).pdf'; // Pastikan nama file ini sesuai
const bookElement = document.getElementById('book');

// Tampilkan nama file (opsional, di CSS disembunyikan)
document.getElementById('docName').innerText = pdfUrl;

// Inisialisasi Flipbook dengan Mode Responsif Penuh
const pageFlip = new St.PageFlip(bookElement, {
    width: 500, // Ukuran dasar
    height: 707, // Rasio A4 (1:1.414)
    
    size: 'stretch', // PENTING: Agar melar mengikuti wadah
    
    // Kita longgarkan batasannya agar tidak terpotong di Google Sites
    minWidth: 100,
    maxWidth: 3000,
    minHeight: 100,
    maxHeight: 3000,
    
    showCover: true,
    usePortrait: true, // Agar di HP/Layar sempit jadi 1 halaman
    maxShadowOpacity: 0.5
});

async function loadPdf() {
    try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            
            const div = document.createElement('div');
            div.className = 'my-page';
            
            // Hard cover untuk depan & belakang
            if (i === 1 || i === pdf.numPages) div.dataset.density = 'hard';
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            // Scale lebih tinggi agar tajam saat di-zoom
            const viewport = page.getViewport({ scale: 2 }); 
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            div.appendChild(canvas);
            bookElement.appendChild(div);
        }

        pageFlip.loadFromHTML(document.querySelectorAll('.my-page'));
        updatePageInfo();

    } catch (error) {
        console.error("Error: " + error);
        document.getElementById('docName').style.display = "block";
        document.getElementById('docName').innerText = "Gagal memuat PDF.";
    }
}

document.getElementById('btnPrev').onclick = () => pageFlip.flipPrev();
document.getElementById('btnNext').onclick = () => pageFlip.flipNext();

pageFlip.on('flip', (e) => {
    updatePageInfo();
});

function updatePageInfo() {
    const currentPage = pageFlip.getCurrentPageIndex() + 1;
    document.getElementById('pageInfo').innerText = currentPage;
}

loadPdf();