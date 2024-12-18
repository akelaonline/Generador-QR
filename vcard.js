document.addEventListener('DOMContentLoaded', function() {
    let qrCode = new QRCodeStyling({
        width: 400,
        height: 400,
        data: "",
        dotsOptions: {
            color: "#000000",
            type: "square"
        },
        cornersSquareOptions: {
            type: "square"
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 0
        }
    });

    // Inicializar el código QR en el contenedor
    qrCode.append(document.getElementById("vcardQrCode"));

    // Manejar las pestañas
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // Manejar opciones de estilo de puntos
    const dotsStyleOptions = document.querySelectorAll('[data-dots-type]');
    dotsStyleOptions.forEach(option => {
        option.addEventListener('click', () => {
            dotsStyleOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            qrCode.update({
                dotsOptions: {
                    type: option.dataset.dotsType
                }
            });
        });
    });

    // Manejar opciones de estilo de esquinas
    const cornerStyleOptions = document.querySelectorAll('[data-corner-type]');
    cornerStyleOptions.forEach(option => {
        option.addEventListener('click', () => {
            cornerStyleOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            qrCode.update({
                cornersSquareOptions: {
                    type: option.dataset.cornerType
                }
            });
        });
    });

    // Manejar opciones de color
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            qrCode.update({
                dotsOptions: {
                    color: option.dataset.color
                },
                cornersSquareOptions: {
                    color: option.dataset.color
                }
            });
        });
    });

    // Campos del formulario VCARD
    const vcardInputs = {
        // Información Personal
        name: document.getElementById('vcard-name'),
        title: document.getElementById('vcard-title'),
        company: document.getElementById('vcard-company'),
        
        // Contacto
        email: document.getElementById('vcard-email'),
        email2: document.getElementById('vcard-email2'),
        phone: document.getElementById('vcard-phone'),
        mobile: document.getElementById('vcard-mobile'),
        fax: document.getElementById('vcard-fax'),
        
        // Web y Redes Sociales
        website: document.getElementById('vcard-website'),
        linkedin: document.getElementById('vcard-linkedin'),
        twitter: document.getElementById('vcard-twitter'),
        facebook: document.getElementById('vcard-facebook'),
        instagram: document.getElementById('vcard-instagram'),
        
        // Ubicación
        street: document.getElementById('vcard-street'),
        city: document.getElementById('vcard-city'),
        state: document.getElementById('vcard-state'),
        country: document.getElementById('vcard-country'),
        postal: document.getElementById('vcard-postal'),
        
        // Información Adicional
        birthday: document.getElementById('vcard-birthday'),
        notes: document.getElementById('vcard-notes')
    };

    // Función para generar el string VCARD
    function generateVCardString() {
        const name = vcardInputs.name.value;
        const title = vcardInputs.title.value;
        const company = vcardInputs.company.value;
        const email = vcardInputs.email.value;
        const email2 = vcardInputs.email2.value;
        const phone = vcardInputs.phone.value;
        const mobile = vcardInputs.mobile.value;
        const fax = vcardInputs.fax.value;
        const website = vcardInputs.website.value;
        const linkedin = vcardInputs.linkedin.value;
        const twitter = vcardInputs.twitter.value;
        const facebook = vcardInputs.facebook.value;
        const instagram = vcardInputs.instagram.value;
        const street = vcardInputs.street.value;
        const city = vcardInputs.city.value;
        const state = vcardInputs.state.value;
        const country = vcardInputs.country.value;
        const postal = vcardInputs.postal.value;
        const birthday = vcardInputs.birthday.value;
        const notes = vcardInputs.notes.value;

        let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';

        if (name) vcard += `FN:${name}\n`;
        if (title) vcard += `TITLE:${title}\n`;
        if (company) vcard += `ORG:${company}\n`;
        
        // Emails
        if (email) vcard += `EMAIL;TYPE=INTERNET:${email}\n`;
        if (email2) vcard += `EMAIL;TYPE=INTERNET:${email2}\n`;
        
        // Teléfonos
        if (phone) vcard += `TEL;TYPE=WORK,VOICE:${phone}\n`;
        if (mobile) vcard += `TEL;TYPE=CELL,VOICE:${mobile}\n`;
        if (fax) vcard += `TEL;TYPE=FAX:${fax}\n`;
        
        // URLs
        if (website) vcard += `URL:${website}\n`;
        if (linkedin) vcard += `X-SOCIALPROFILE;TYPE=linkedin:${linkedin}\n`;
        if (twitter) vcard += `X-SOCIALPROFILE;TYPE=twitter:${twitter}\n`;
        if (facebook) vcard += `X-SOCIALPROFILE;TYPE=facebook:${facebook}\n`;
        if (instagram) vcard += `X-SOCIALPROFILE;TYPE=instagram:${instagram}\n`;
        
        // Dirección
        if (street || city || state || country || postal) {
            vcard += `ADR;TYPE=WORK:;;${street};${city};${state};${postal};${country}\n`;
        }
        
        // Información adicional
        if (birthday) vcard += `BDAY:${birthday}\n`;
        if (notes) vcard += `NOTE:${notes}\n`;
        
        vcard += 'END:VCARD';
        return vcard;
    }

    // Manejar cambios en los inputs
    Object.values(vcardInputs).forEach(input => {
        if (input) { // Verificar que el elemento existe
            input.addEventListener('input', () => {
                const vcard = generateVCardString();
                qrCode.update({
                    data: vcard
                });
            });
        }
    });

    // Manejar cambios en el formato y tamaño
    const formatSelect = document.getElementById('vcard-format-select');
    const sizeSlider = document.getElementById('vcard-size-slider');
    const sizeValue = document.getElementById('vcard-size-value');

    sizeSlider.addEventListener('input', (e) => {
        const size = parseInt(e.target.value);
        sizeValue.textContent = `${size}x${size}`;
        qrCode.update({
            width: size,
            height: size
        });
    });

    // Manejar descarga
    const downloadBtn = document.getElementById('vcard-download-btn');
    downloadBtn.addEventListener('click', () => {
        const format = formatSelect.value;
        qrCode.download({
            extension: format
        });
    });
});
