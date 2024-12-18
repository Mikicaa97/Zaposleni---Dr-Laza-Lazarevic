document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('employeeForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const newEmployee = {
            ime: document.getElementById('ime').value,
            datumRodjenja: document.getElementById('datumRodjenja').value,
            jmbg: document.getElementById('jmbg').value,
            pol: document.getElementById('pol').value,
            status: document.getElementById('status').value,
            kvalifikacija: document.getElementById('kvalifikacija').value,
            pozicija: document.getElementById('pozicija').value,
            odeljenje: document.getElementById('odeljenje').value,
            godOdmor: document.getElementById('godOdmor').value,
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
            window.location.href = 'index.html';
        });
    });
});
