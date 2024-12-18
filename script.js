document.addEventListener('DOMContentLoaded', function() {
    // Inicialización de la navegación
    initNavigation();
    
    // Inicialización de los generadores QR
    initURLQRGenerator();
    initVCARDQRGenerator();
});

// Manejo de la navegación
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = item.dataset.section;

            // Actualizar navegación
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Mostrar sección correspondiente
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// Generador QR para URLs
function initURLQRGenerator() {
    const urlQrCode = new QRCodeStyling({
        width: 256,
        height: 256,
        data: "Ingresa una URL",
        dotsOptions: {
            color: "#000000",
            type: "square"
        },
        backgroundOptions: {
            color: "#ffffff",
        }
    });

    urlQrCode.append(document.getElementById("qrCode"));

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
        
        urlQrCode.update({
            data: text,
            dotsOptions: {
                color: darkColor
            },
            backgroundOptions: {
                color: lightColor
            }
        });
    }

    function updateQRSize(size) {
        if (urlInput.value) {
            updateQRCode(urlInput.value, mainColor.value, bgColor.value);
        }
        urlQrCode.update({
            width: size,
            height: size
        });
    }

    // Manejar descarga
    document.querySelector('.btn-download').addEventListener('click', function() {
        if (!urlInput.value) {
            alert('Por favor, ingresa una URL primero');
            return;
        }
        
        const format = document.querySelector('.format-select').value;
        urlQrCode.download({
            extension: format
        });
    });
}

// Generador QR para VCARD
function initVCARDQRGenerator() {
    const vcardQrCode = new QRCodeStyling({
        width: 256,
        height: 256,
        data: "BEGIN:VCARD\nVERSION:3.0\nEND:VCARD",
        dotsOptions: {
            color: "#000000",
            type: "square"
        },
        backgroundOptions: {
            color: "#ffffff",
        }
    });

    vcardQrCode.append(document.getElementById("vcardQrCode"));

    // Campos del formulario VCARD
    const vcardInputs = {
        name: document.getElementById('vcard-name'),
        title: document.getElementById('vcard-title'),
        company: document.getElementById('vcard-company'),
        email: document.getElementById('vcard-email'),
        phone: document.getElementById('vcard-phone'),
        mobile: document.getElementById('vcard-mobile'),
        website: document.getElementById('vcard-website'),
        address: document.getElementById('vcard-address'),
        linkedin: document.getElementById('vcard-linkedin')
    };

    // Función para generar el string VCARD
    function generateVCARDString() {
        let vcard = [
            'BEGIN:VCARD',
            'VERSION:3.0'
        ];

        if (vcardInputs.name.value) {
            vcard.push(`FN:${vcardInputs.name.value}`);
            vcard.push(`N:${vcardInputs.name.value.split(' ').reverse().join(';')}`);
        }
        if (vcardInputs.title.value) vcard.push(`TITLE:${vcardInputs.title.value}`);
        if (vcardInputs.company.value) vcard.push(`ORG:${vcardInputs.company.value}`);
        if (vcardInputs.email.value) vcard.push(`EMAIL:${vcardInputs.email.value}`);
        if (vcardInputs.phone.value) vcard.push(`TEL;TYPE=WORK:${vcardInputs.phone.value}`);
        if (vcardInputs.mobile.value) vcard.push(`TEL;TYPE=CELL:${vcardInputs.mobile.value}`);
        if (vcardInputs.website.value) vcard.push(`URL:${vcardInputs.website.value}`);
        if (vcardInputs.address.value) vcard.push(`ADR:;;${vcardInputs.address.value}`);
        if (vcardInputs.linkedin.value) vcard.push(`X-SOCIALPROFILE;TYPE=linkedin:${vcardInputs.linkedin.value}`);

        vcard.push('END:VCARD');
        return vcard.join('\n');
    }

    // Actualizar QR cuando se modifique cualquier campo
    Object.values(vcardInputs).forEach(input => {
        input.addEventListener('input', () => {
            const vcardString = generateVCARDString();
            vcardQrCode.update({
                data: vcardString
            });
        });
    });

    // Control de tamaño
    const vcardSizeSlider = document.getElementById('vcard-size-slider');
    const vcardSizeValue = document.getElementById('vcard-size-value');

    vcardSizeSlider.addEventListener('input', function() {
        const size = parseInt(this.value);
        vcardSizeValue.textContent = `${size}x${size}`;
        vcardQrCode.update({
            width: size,
            height: size
        });
    });

    // Botón de descarga
    const vcardDownloadBtn = document.getElementById('vcard-download-btn');
    vcardDownloadBtn.addEventListener('click', () => {
        const format = document.getElementById('vcard-format-select').value;
        vcardQrCode.download({
            extension: format
        });
    });
}