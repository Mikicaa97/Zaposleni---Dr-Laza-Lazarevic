document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const departmentFilter = document.getElementById('departmentFilter');
    const positionFilter = document.getElementById('positionFilter');
    const statusFilter = document.getElementById('statusFilter');
    const employeesTable = document.getElementById('employeesTable').getElementsByTagName('tbody')[0];
    const totalEmployeesElement = document.createElement('div'); // Element za ukupan broj zaposlenih

    // Dodaj div za prikaz ukupnog broja zaposlenih ispod tabele
    totalEmployeesElement.style.marginTop = '20px';
    document.querySelector('#ukupnoZaposlenih').appendChild(totalEmployeesElement);

    let employeesData = []; // Inicijalizacija niza sa zaposlenima

    // Učitaj sve zaposlene
    fetch('http://localhost:3000/employees')
        .then(response => response.json())
        .then(data => {
            employeesData = data; // Postavljamo podatke o zaposlenima
            updateEmployeeTable(data); // Prvo učitaj sve zaposlene
            updateTotalEmployees(data.length); // Ažuriraj ukupan broj zaposlenih
        });

    // Funkcija za ažuriranje tabele
    function updateEmployeeTable(data) {
        // Očisti trenutnu tabelu
        employeesTable.innerHTML = '';

        // Dodaj zaposlene u tabelu
        data.forEach(employee => {
            let row = employeesTable.insertRow();
            row.setAttribute('data-id', employee.id);

            row.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.ime}</td>
                <td>${employee.datumRodjenja}</td>
                <td>${employee.jmbg}</td>
                <td>${employee.pol}</td>
                <td>${employee.status}</td>
                <td>${employee.kvalifikacija}</td>
                <td>${employee.pozicija}</td>
                <td>${employee.odeljenje}</td>
                <td>${employee.godOdmor}</td>
                <td><button class="delete-btn">Obriši</button></td>
                <td><button class="edit-btn">Izmeni</button></td>
            `;
        });

        // Brisanje zaposlenog
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const row = button.closest('tr');
                const employeeId = row.getAttribute('data-id');

                fetch(`http://localhost:3000/employees/${employeeId}`, {
                    method: 'DELETE',
                }).then(() => {
                    row.remove();
                    filterEmployees(); // Ponovo filtriraj i osveži ukupan broj zaposlenih
                });
            });
        });

        // Izmena zaposlenog
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const row = button.closest('tr');
                const employeeId = row.getAttribute('data-id');
        
                // Prebaci na stranicu za izmenu sa ID-em u URL-u
                window.location.href = `edit-employee.html?id=${employeeId}`;
            });
        });
        

    }

    // Funkcija za ažuriranje ukupnog broja zaposlenih
    function updateTotalEmployees(count) {
        totalEmployeesElement.textContent = `Ukupan broj zaposlenih: ${count}`;
    }

    // Pretraga i filtriranje zaposlenih
    searchInput.addEventListener('input', filterEmployees);
    departmentFilter.addEventListener('change', filterEmployees);
    positionFilter.addEventListener('change', filterEmployees);
    statusFilter.addEventListener('change', filterEmployees);

    function filterEmployees() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedDepartment = departmentFilter.value;
        const selectedPosition = positionFilter.value;
        const selectedStatus = statusFilter.value;

        // Filtriraj podatke
        const filteredData = employeesData.filter(employee => {
            const matchesSearch = employee.ime.toLowerCase().includes(searchTerm);
            const matchesDepartment = selectedDepartment ? employee.odeljenje === selectedDepartment : true;
            const matchesPosition = selectedPosition ? employee.pozicija === selectedPosition : true;
            const matchesStatus = selectedStatus ? employee.status === selectedStatus : true;

            return matchesSearch && matchesDepartment && matchesPosition && matchesStatus;
        });

        // Ažuriraj tabelu i ukupan broj zaposlenih
        updateEmployeeTable(filteredData);
        updateTotalEmployees(filteredData.length);
    }


    //izmena zaposlenog dodatak

    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('editEmployeeForm');
    
        // Preuzmi ID iz URL-a
        const urlParams = new URLSearchParams(window.location.search);
        const employeeId = urlParams.get('id');
    
        // Dohvati podatke o zaposlenom
        fetch(`http://localhost:3000/employees/${employeeId}`)
            .then(response => response.json())
            .then(employee => {
                // Popuni formu
                form.ime.value = employee.ime;
                form.datumRodjenja.value = employee.datumRodjenja;
                form.jmbg.value = employee.jmbg;
                form.status.value = employee.status;
                form.pozicija.value = employee.pozicija;
                form.odeljenje.value = employee.odeljenje;
                form.godOdmor.value = employee.godOdmor;
            });
    
        // Ažuriraj podatke o zaposlenom
        form.addEventListener('submit', function(e) {
            e.preventDefault();
    
            const updatedEmployee = {
                ime: form.ime.value,
                datumRodjenja: form.datumRodjenja.value,
                jmbg: form.jmbg.value,
                status: form.status.value,
                pozicija: form.pozicija.value,
                odeljenje: form.odeljenje.value,
                godOdmor: parseInt(form.godOdmor.value),
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
    
});
