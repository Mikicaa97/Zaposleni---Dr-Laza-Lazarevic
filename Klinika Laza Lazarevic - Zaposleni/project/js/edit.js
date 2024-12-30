document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('editEmployeeForm');

    // Preuzmi ID iz URL-a
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('id');

    // Dohvati podatke o zaposlenom
    fetch(`http://localhost:3000/employees/${employeeId}`)
        .then(response => response.json())
        .then(employee => {
            // Popuni formu
            document.getElementById('ime').value = employee.ime;
            document.getElementById('datumRodjenja').value = employee.datumRodjenja;
            document.getElementById('jmbg').value = employee.jmbg;
            document.getElementById('pol').value = employee.pol;
            document.getElementById('pocRadnog').value = employee.pocRadnog;
            document.getElementById('krajRadnog').value = employee.krajRadnog;
            document.getElementById('radiNeradi').value = employee.radiNeradi;
            document.getElementById('status').value = employee.status;
            document.getElementById('kvalifikacija').value = employee.kvalifikacija;
            document.getElementById('pozicija').value = employee.pozicija;
            document.getElementById('odeljenje').value = employee.odeljenje;
            document.getElementById('stacionar').value = employee.stacionar;
        });

    // Ažuriraj podatke o zaposlenom
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const updatedEmployee = {
            ime: form.ime.value,
            datumRodjenja: form.datumRodjenja.value,
            jmbg: form.jmbg.value,
            pol: form.pol.value,
            pocRadnog: form.pocRadnog.value,
            krajRadnog: form.krajRadnog.value,
            radiNeradi: form.radiNeradi.value,
            status: form.status.value,
            kvalifikacija: form.kvalifikacija.value,
            pozicija: form.pozicija.value,
            odeljenje: form.odeljenje.value,
            stacionar: form.stacionar.value
        };

        fetch(`http://localhost:3000/employees/${employeeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEmployee),
        }).then(() => {
            alert('Podaci uspešno izmenjeni!');
            window.location.href = 'index.html';
        });
    });
});
