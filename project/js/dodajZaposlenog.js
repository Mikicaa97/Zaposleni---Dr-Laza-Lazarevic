document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('employeeForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Uzimanje vrednosti input polja
        const imeInput = document.getElementById('ime').value.trim();
        const jmbgInput = document.getElementById('jmbg').value.trim();
        const datumRodjenjaInput = document.getElementById('datumRodjenja').value.trim();
        const polInput = document.getElementById('pol').value.trim();
        const pocRadnogInput = document.getElementById('pocRadnog').value.trim();
        const krajRadnogInput = document.getElementById('krajRadnog').value.trim();
        const radiNeradiInput = document.getElementById('radiNeradi').value.trim();
        const statusInput = document.getElementById('status').value.trim();
        const kvalifikacijaInput = document.getElementById('kvalifikacija').value.trim();
        const zvanjeInput = document.getElementById('zvanje').value.trim();
        const pozicijaInput = document.getElementById('pozicija').value.trim();
        const odeljenjeInput = document.getElementById('odeljenje').value.trim();
        const aplikacijaInput = document.getElementById('aplikacija').value.trim();
        const stacionarInput = document.getElementById('stacionar').value.trim();
        const odmorInput = document.getElementById('odmor').value.trim();

        // Elementi za prikaz grešaka
        const imeError = document.getElementById('imeError');
        const jmbgError = document.getElementById('jmbgError');
        const datumRodjenjaError = document.getElementById('datumRodjenjaError');
        const polError = document.getElementById('polError');
        const pocRadnogError = document.getElementById('pocRadnogError');
        const krajRadnogError = document.getElementById('krajRadnogError');
        const radiNeradiError = document.getElementById('radiNeradiError');
        const statusError = document.getElementById('statusError');
        const kvalifikacijaError = document.getElementById('kvalifikacijaError');
        const zvanjeError = document.getElementById('zvanjeError');
        const pozicijaError = document.getElementById('pozicijaError');
        const odeljenjeError = document.getElementById('odeljenjeError');
        const aplikacijaError = document.getElementById('aplikacijaError');
        const stacionarError = document.getElementById('stacionarError');
        const odmorError = document.getElementById('odmorError');

        // Resetovanje grešaka
        imeError.textContent = '';
        jmbgError.textContent = '';
        datumRodjenjaError.textContent = '';
        polError.textContent = '';
        pocRadnogError.textContent = '';
        krajRadnogError.textContent = '';
        radiNeradiError.textContent = '';
        statusError.textContent = '';
        kvalifikacijaError.textContent = '';
        zvanjeError.textContent = '';
        pozicijaError.textContent = '';
        odeljenjeError.textContent = '';
        aplikacijaError.textContent = ''
        stacionarError.textContent = '';
        odmorError.textContent = '';

        // Regularni izrazi
        const imeRegex = /^[A-Za-zČĆŽŠĐčćžšđ ]{2,}$/;
        const jmbgRegex = /^[0-9]{13}$/;

        let isValid = true;

        // Provera za ime
        if (!imeRegex.test(imeInput)) {
            imeError.textContent = 'Ime mora imati više od jednog karaktera i sadržavati samo slova.';
            imeError.style.color = 'red';
            isValid = false;
        }

        // Provera za JMBG
        if (!jmbgRegex.test(jmbgInput)) {
            jmbgError.textContent = 'JMBG mora sadržati tačno 13 cifara.';
            jmbgError.style.color = 'red';
            isValid = false;
        }

        // Provera za datum rođenja
        const datumRodjenja = new Date(datumRodjenjaInput);
        const danas = new Date();
        const granicaGodine = danas.getFullYear() - 18;
        if (isNaN(datumRodjenja.getTime()) || datumRodjenja.getFullYear() > granicaGodine) {
            datumRodjenjaError.textContent = 'Osoba mora biti starija od 18 godina.';
            datumRodjenjaError.style.color = 'red';
            isValid = false;
        }

        // Provera za pol
        if (!polInput) {
            polError.textContent = 'Pol mora biti odabran.';
            polError.style.color = 'red';
            isValid = false;
        }

        // Provera za početak radnog odnosa
        if (!pocRadnogInput) {
            pocRadnogError.textContent = 'Početak radnog odnosa mora biti unet.';
            pocRadnogError.style.color = 'red';
            isValid = false;
        }

        //Zaposlen / Nezaposlen
        if (!radiNeradiInput) {
            radiNeradiError.textContent = 'Početak radnog odnosa mora biti unet.';
            radiNeradiError.style.color = 'red';
            isValid = false;
        }

        // Provera za status
        if (!statusInput) {
            statusError.textContent = 'Status mora biti odabran.';
            statusError.style.color = 'red';
            isValid = false;
        }

        // Provera za kvalifikaciju
        if (!kvalifikacijaInput) {
            kvalifikacijaError.textContent = 'Kvalifikacija mora biti uneta.';
            kvalifikacijaError.style.color = 'red';
            isValid = false;
        }

        //Provera statusa zvanja
        if (!zvanjeInput) {
            zvanjeError.textContent = 'Zvanje mora biti uneto.';
            zvanjeError.style.color = 'red';
            isValid = false;
        }

        // Provera za poziciju
        if (!pozicijaInput) {
            pozicijaError.textContent = 'Pozicija mora biti uneta.';
            pozicijaError.style.color = 'red';
            isValid = false;
        }

        // Provera za odeljenje
        if (!odeljenjeInput) {
            odeljenjeError.textContent = 'Odeljenje mora biti uneto.';
            odeljenjeError.style.color = 'red';
            isValid = false;
        }

        // Provera za stacionar
        if (!stacionarInput) {
            stacionarError.textContent = 'Stacionar mora biti uneto.';
            stacionarError.style.color = 'red';
            isValid = false;
        }

        // Provera za aplikaciju
        if (!aplikacijaInput) {
            aplikacijaError.textContent = 'Aplikacija mora biti uneto.';
            aplikacijaError.style.color = 'red';
            isValid = false;
        }

        // Provera za odmor
        if (!odmorInput) {
            odmorError.textContent = 'Odmor mora biti unet.';
            odmorError.style.color = 'red';
            isValid = false;
        }

        // Ako postoji greška, prekini proces
        if (!isValid) return;

        // Provera jedinstvenosti JMBG-a
        fetch('http://localhost:3000/employees')
            .then(response => response.json())
            .then(employees => {
                const existingEmployee = employees.find(employee => employee.jmbg === jmbgInput);

                if (existingEmployee) {
                    jmbgError.textContent = 'Zaposleni sa ovim JMBG-om već postoji.';
                    jmbgError.style.color = 'red';
                    return;
                }

                // Ako su sve provere prošle, kreiraj novog zaposlenog
                const newEmployee = {
                    ime: imeInput,
                    datumRodjenja: datumRodjenjaInput,
                    jmbg: jmbgInput,
                    pol: polInput,
                    pocRadnog: pocRadnogInput,
                    krajRadnog: krajRadnogInput,
                    radiNeradi: radiNeradiInput,
                    status: statusInput,
                    kvalifikacija: kvalifikacijaInput,
                    zvanje: zvanjeInput,
                    pozicija: pozicijaInput,
                    odeljenje: odeljenjeInput,
                    aplikacija: aplikacijaInput,
                    stacionar: stacionarInput,
                    odmor: odmorInput
                };

                fetch('http://localhost:3000/employees', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newEmployee),
                })
                .then(response => response.json())
                .then(() => {
                    alert('Zaposleni uspešno dodat!');
                    window.location.href = 'index.html';
                })
                .catch(error => {
                    console.error('Greška prilikom dodavanja zaposlenog:', error);
                });
            });
    });
});
