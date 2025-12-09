// --- KONFIGURASI ---
const pdfUrl = 'WARTA JEMAAT GKI GMM EDISI 12 Tahun ke-22 (07-12-2025).pdf'; // Pastikan nama file ini sesuai
const bookElement = document.getElementById('book');

// Tampilkan nama file di HTML
document.getElementById('docName').innerText = pdfUrl;

// Inisialisasi Flipbook
const pageFlip = new St.PageFlip(bookElement, {
    width: 400,
    height: 566,
    size: 'stretch',
    minWidth: 300,
    maxWidth: 800,
    minHeight: 400,
    maxHeight: 1100,
    showCover: true,
});

async function loadPdf() {
    try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            
            const div = document.createElement('div');
            div.className = 'my-page';
            if (i === 1 || i === pdf.numPages) div.dataset.density = 'hard';
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            // Resolusi gambar
            const viewport = page.getViewport({ scale: 1.5 }); 
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
        
        // Update angka halaman awal
        updatePageInfo();

    } catch (error) {
        console.error("Error: " + error);
        document.getElementById('docName').innerText = "Gagal memuat: " + pdfUrl;
        document.getElementById('docName').style.color = "red";
    }
}

// Navigasi
document.getElementById('btnPrev').onclick = () => pageFlip.flipPrev();
document.getElementById('btnNext').onclick = () => pageFlip.flipNext();

// Update Angka saat dibalik
pageFlip.on('flip', (e) => {
    updatePageInfo();
});

function updatePageInfo() {
    // HANYA menampilkan angka
    // pageFlip.getCurrentPageIndex() dimulai dari 0, jadi kita tambah 1
    const currentPage = pageFlip.getCurrentPageIndex() + 1;
    document.getElementById('pageInfo').innerText = currentPage;
}

loadPdf();