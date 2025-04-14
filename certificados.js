document.addEventListener('DOMContentLoaded', () => {
    // Configurar PDF.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

    // Lista de PDFs
    const pdfs = [
        { path: 'pdf/docker-UDEMY.pdf', name: 'Docker - UDEMY 2025' },
        { path: 'pdf/html5-SNPP.pdf', name: 'HTML5 - SNPP 2021' },
        { path: 'pdf/ofimatica-SNPP.pdf', name: 'Ofimática Google Drive - SNPP 2021' },
        { path: 'pdf/soporte-SNPP.pdf', name: 'Soporte Técnico para PC - SNPP 2021' },
        { path: 'pdf/marketing-SNPP.pdf', name: 'Marketing Digital y Comercio Electronico - SNPP 2021' },
        { path: 'pdf/ingles-SNPP.pdf', name: 'Idioma Ingles Intermedio - SNPP 2021' },
        { path: 'pdf/guarani-SNPP.pdf', name: 'Idioma Guarani - SNPP 2021' },
        { path: 'pdf/css-SNPP.pdf', name: 'Diseño Web CSS - SNPP 2020' },
        { path: 'pdf/javascript-SNPP.pdf', name: 'Diseño Web JavaScript - SNPP 2020' },
        { path: 'pdf/php-db-SNPP.pdf', name: 'PHP y Base de Datos - SNPP 2020' },
        { path: 'pdf/dreanweaver-SNPP.pdf', name: 'Dreamweaver CC - SNPP 2020' },
        { path: 'pdf/admin-servidor-SNPP.pdf', name: 'Administración del Servidor Web Apache - SNPP 2020' },
        { path: 'pdf/ajax-SNPP.pdf', name: 'AJAX - SNPP 2020' },
        { path: 'pdf/ciberseguridad-SNPP.pdf', name: 'Fundamentos de Ciberseguridad - SNPP 2020' },
        { path: 'pdf/oracle-SNPP.pdf', name: 'Programación Oracle - SNPP 2020' },
        { path: 'pdf/photoshop-SNPP.pdf', name: 'Adobe Photoshop - SNPP 2020' },
        { path: 'pdf/corel-draw-SNPP.pdf', name: 'Corel Draw - SNPP 2019' },
        { path: 'pdf/mantenimiento-SNPP.pdf', name: 'Mantenimiento y Reparación de PC - SNPP 2015' }
    ];

    const track = document.querySelector('.carousel-track');
    const indicatorsContainer = document.querySelector('.carousel-indicators');

    // Generar los ítems del carrusel dinámicamente
    pdfs.forEach((pdf, index) => {
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        item.innerHTML = `
            <div class="pdf-container">
                <a href="${pdf.path}" download class="download-link">
                    <canvas class="pdf-canvas" data-pdf="${pdf.path}"></canvas>
                </a>
            </div>
            <p>${pdf.name}</p>
        `;
        track.appendChild(item);

        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
        indicatorsContainer.appendChild(indicator);
    });

    // Verificar y renderizar los PDFs
    const canvases = document.querySelectorAll('.pdf-canvas');
    canvases.forEach(canvas => {
        const pdfUrl = canvas.getAttribute('data-pdf');
        fetch(pdfUrl, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    renderFirstPage(pdfUrl, canvas);
                } else {
                    console.error(`El PDF no se encontró: ${pdfUrl}`);
                    canvas.parentElement.innerHTML = '<p style="color: red;">No se pudo cargar el certificado. Asegúrate de que el archivo exista.</p>';
                }
            })
            .catch(error => {
                console.error(`Error al verificar el PDF: ${pdfUrl}`, error);
                canvas.parentElement.innerHTML = '<p style="color: red;">Error al cargar el certificado.</p>';
            });
    });

    // Función para renderizar la primera página de un PDF en un canvas
    async function renderFirstPage(pdfUrl, canvas) {
        try {
            const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.0 });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const scale = Math.min(500 / viewport.width, 1);
            const scaledViewport = page.getViewport({ scale: scale });

            canvas.width = scaledViewport.width;
            canvas.height = scaledViewport.height;

            const context = canvas.getContext('2d');
            await page.render({
                canvasContext: context,
                viewport: scaledViewport
            }).promise;
        } catch (error) {
            console.error(`Error al renderizar el PDF: ${pdfUrl}`, error);
            canvas.parentElement.innerHTML = '<p style="color: red;">No se pudo cargar el certificado. Asegúrate de que el archivo exista.</p>';
        }
    }

    // Funcionalidad del carrusel
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicators = document.querySelectorAll('.indicator');
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    function updateCarousel() {
        currentTranslate = -currentIndex * 100;
        prevTranslate = currentTranslate;
        track.style.transform = `translateX(${currentTranslate}%)`;
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });

    let autoSlide = setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    }, 7000);

    function stopAutoSlide() {
        clearInterval(autoSlide);
    }

    function startAutoSlide() {
        autoSlide = setInterval(() => {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
        }, 5000);
    }

    track.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        prevTranslate = currentTranslate;
        stopAutoSlide();
        track.style.transition = 'none';
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        currentTranslate = prevTranslate + (diffX / track.offsetWidth) * 100;
        track.style.transform = `translateX(${currentTranslate}%)`;
    });

    track.addEventListener('touchend', () => {
        isDragging = false;
        track.style.transition = 'transform 0.5s ease';

        const threshold = 30;
        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -threshold && currentIndex < items.length - 1) {
            currentIndex++;
        } else if (movedBy > threshold && currentIndex > 0) {
            currentIndex--;
        }

        updateCarousel();
        startAutoSlide();
    });

    track.addEventListener('dragstart', (e) => e.preventDefault());
});