document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial
    let qrCode = null;
    
    // Inicializar QR Code
    function initQRCode() {
        const qrContainer = document.getElementById("qrCode");
        qrContainer.innerHTML = ''; // Limpiar contenedor
        
        qrCode = new QRCode(qrContainer, {
            text: "Ingresa una URL",
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    
    initQRCode();

    // Manejar tabs
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            tab.classList.add('active');
            const targetContent = document.getElementById(tab.dataset.tab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Manejar input de URL
    const urlInput = document.querySelector('.url-input');
    let typingTimer;
    
    urlInput.addEventListener('input', function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            updateQRCode(this.value);
        }, 500);
    });

    // Manejar colores
    const mainColor = document.getElementById('mainColor');
    const bgColor = document.getElementById('bgColor');
    
    mainColor.addEventListener('change', function() {
        updateQRCode(urlInput.value, this.value, bgColor.value);
    });
    
    bgColor.addEventListener('change', function() {
        updateQRCode(urlInput.value, mainColor.value, this.value);
    });

    // Manejar tamaño
    const sizeRange = document.querySelector('.size-range');
    const sizeValue = document.querySelector('.size-value');
    
    sizeRange.addEventListener('input', function() {
        sizeValue.textContent = `${this.value}x${this.value}`;
        updateQRSize(parseInt(this.value));
    });

    // Funciones de actualización
    function updateQRCode(text, darkColor = "#000000", lightColor = "#ffffff") {
        if (!text) return; // No actualizar si no hay texto
        
        const qrContainer = document.getElementById("qrCode");
        qrContainer.innerHTML = '';
        
        qrCode = new QRCode(qrContainer, {
            text: text,
            width: parseInt(sizeRange.value),
            height: parseInt(sizeRange.value),
            colorDark: darkColor,
            colorLight: lightColor,
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    function updateQRSize(size) {
        if (urlInput.value) {
            updateQRCode(urlInput.value, mainColor.value, bgColor.value);
        }
    }

    // Manejar descarga
    document.querySelector('.btn-download').addEventListener('click', function() {
        if (!urlInput.value) {
            alert('Por favor, ingresa una URL primero');
            return;
        }
        
        const format = document.querySelector('.format-select').value;
        const canvas = document.querySelector('#qrCode canvas');
        
        if (canvas) {
            const dataUrl = canvas.toDataURL(`image/${format}`);
            const link = document.createElement('a');
            link.download = `qr-code.${format}`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });
}); 