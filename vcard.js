document.addEventListener('DOMContentLoaded', function() {
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

    vcardQrCode.append(document.getElementById('vcardQrCode'));

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
    function generateVCARDString() {
        let vcard = [
            'BEGIN:VCARD',
            'VERSION:3.0'
        ];

        // Información Personal
        if (vcardInputs.name.value) {
            vcard.push(`FN:${vcardInputs.name.value}`);
            vcard.push(`N:${vcardInputs.name.value.split(' ').reverse().join(';')}`);
        }
        if (vcardInputs.title.value) vcard.push(`TITLE:${vcardInputs.title.value}`);
        if (vcardInputs.company.value) vcard.push(`ORG:${vcardInputs.company.value}`);
        
        // Contacto
        if (vcardInputs.email.value) vcard.push(`EMAIL;TYPE=WORK:${vcardInputs.email.value}`);
        if (vcardInputs.email2.value) vcard.push(`EMAIL;TYPE=HOME:${vcardInputs.email2.value}`);
        if (vcardInputs.phone.value) vcard.push(`TEL;TYPE=WORK:${vcardInputs.phone.value}`);
        if (vcardInputs.mobile.value) vcard.push(`TEL;TYPE=CELL:${vcardInputs.mobile.value}`);
        if (vcardInputs.fax.value) vcard.push(`TEL;TYPE=FAX:${vcardInputs.fax.value}`);
        
        // Web y Redes Sociales
        if (vcardInputs.website.value) vcard.push(`URL:${vcardInputs.website.value}`);
        if (vcardInputs.linkedin.value) vcard.push(`X-SOCIALPROFILE;TYPE=linkedin:${vcardInputs.linkedin.value}`);
        if (vcardInputs.twitter.value) vcard.push(`X-SOCIALPROFILE;TYPE=twitter:${vcardInputs.twitter.value}`);
        if (vcardInputs.facebook.value) vcard.push(`X-SOCIALPROFILE;TYPE=facebook:${vcardInputs.facebook.value}`);
        if (vcardInputs.instagram.value) vcard.push(`X-SOCIALPROFILE;TYPE=instagram:${vcardInputs.instagram.value}`);
        
        // Ubicación
        if (vcardInputs.street.value || vcardInputs.city.value || vcardInputs.state.value || 
            vcardInputs.country.value || vcardInputs.postal.value) {
            const adr = [
                '', // PO box
                '', // Extended address
                vcardInputs.street.value || '',
                vcardInputs.city.value || '',
                vcardInputs.state.value || '',
                vcardInputs.postal.value || '',
                vcardInputs.country.value || ''
            ];
            vcard.push(`ADR;TYPE=WORK:${adr.join(';')}`);
        }
        
        // Información Adicional
        if (vcardInputs.birthday.value) vcard.push(`BDAY:${vcardInputs.birthday.value}`);
        if (vcardInputs.notes.value) vcard.push(`NOTE:${vcardInputs.notes.value}`);

        vcard.push('END:VCARD');
        return vcard.join('\n');
    }

    // Actualizar QR cuando se modifique cualquier campo
    Object.values(vcardInputs).forEach(input => {
        if (input) { // Verificar que el elemento existe
            input.addEventListener('input', () => {
                const vcardString = generateVCARDString();
                vcardQrCode.update({
                    data: vcardString
                });
            });
        }
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
        if (!vcardInputs.name.value) {
            alert('Por favor, ingresa al menos el nombre completo');
            return;
        }

        const format = document.getElementById('vcard-format-select').value;
        vcardQrCode.download({
            extension: format
        });
    });
});
