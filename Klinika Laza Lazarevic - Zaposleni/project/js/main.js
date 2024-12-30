$(document).ready(function(){
    $('#employeesTable').on('mouseover', 'tbody tr', function(){
        $(this).addClass('zebraHover');
    });

    $('#employeesTable').on('mouseout', 'tbody tr', function(){
        $(this).removeClass('zebraHover');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const searchJmbg = document.getElementById('searchJmbg');
    const departmentFilter = document.getElementById('departmentFilter');
    const positionFilter = document.getElementById('positionFilter');
    const statusFilter = document.getElementById('statusFilter');
    const zaposlenFilter = document.getElementById('zaposlenFilter');
    const stacionarFilter = document.getElementById('stacionarFilter');
    const employeesTable = document.getElementById('employeesTable').getElementsByTagName('tbody')[0];
    const totalEmployeesElement = document.createElement('div'); // Element za ukupan broj zaposlenih

    // Dodaj div za prikaz ukupnog broja zaposlenih ispod tabele
    totalEmployeesElement.style.marginTop = '20px';
    document.querySelector('#ukupnoZaposlenih').appendChild(totalEmployeesElement);

    let employeesData = []; // Inicijalizacija niza sa zaposlenima

    fetch('http://localhost:3000/employees')
    .then(response => {
        console.log('API je dostupan. Status:', response.status);
    })
    .catch(error => {
        console.error('API nije dostupan:', error);
    });
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
//<td>${employee.id}</td>
            row.innerHTML = `
                <td>${employee.ime}</td>
                <td>${employee.datumRodjenja}</td>
                <td>${employee.jmbg}</td>
                <td>${employee.pol}</td>
                <td>${employee.pocRadnog}</td>
                <td>${employee.krajRadnog}</td>
                <td>${employee.radiNeradi}</td>
                <td>${employee.status}</td>
                <td>${employee.kvalifikacija}</td>
                <td>${employee.pozicija}</td>
                <td>${employee.odeljenje}</td>
                <td>${employee.stacionar}</td>
                <td><button class="edit-btn">Izmeni</button></td>
                <td><button class="delete-btn">Obriši</button></td>
            `;
        });

        // Brisanje zaposlenog
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                // Prikaži potvrdu korisniku
                const confirmDelete = window.confirm('Da li ste sigurni da želite da obrišete ovog zaposlenog?');
        
                // Ako korisnik potvrdi brisanje
                if (confirmDelete) {
                    const row = button.closest('tr');
                    const employeeId = row.getAttribute('data-id');
        
                    fetch(`http://localhost:3000/employees/${employeeId}`, {
                        method: 'DELETE',
                    }).then(() => {
                        row.remove(); // Ukloni red iz tabele
                        filterEmployees(); // Ponovo filtriraj i osveži ukupan broj zaposlenih
                    }).catch(error => {
                        console.error('Greška prilikom brisanja:', error);
                        alert('Došlo je do greške prilikom brisanja zaposlenog.');
                    });
                }
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
    searchJmbg.addEventListener('input', filterEmployees);
    departmentFilter.addEventListener('change', filterEmployees);
    positionFilter.addEventListener('change', filterEmployees);
    statusFilter.addEventListener('change', filterEmployees);
    zaposlenFilter.addEventListener('change', filterEmployees);
    stacionarFilter.addEventListener('change', filterEmployees);

    function filterEmployees() {
        const searchTerm = searchInput.value.toLowerCase();
        const searchJmbg1 = searchJmbg.value.toLowerCase();
        const selectedDepartment = departmentFilter.value;
        const selectedPosition = positionFilter.value;
        const selectedStatus = statusFilter.value;
        const selectedZaposlen = zaposlenFilter.value;
        const selectedStacionar = stacionarFilter.value;

        // Filtriraj podatke
        const filteredData = employeesData.filter(employee => {
            const matchesSearch = employee.ime.toLowerCase().includes(searchTerm);
            const matchesSearchJmbg = employee.jmbg.toLowerCase().includes(searchJmbg1);
            const matchesDepartment = selectedDepartment ? employee.odeljenje === selectedDepartment : true;
            const matchesPosition = selectedPosition ? employee.pozicija === selectedPosition : true;
            const matchesZaposlen = selectedZaposlen ? employee.radiNeradi === selectedZaposlen : true;
            const matchesStatus = selectedStatus ? employee.status === selectedStatus : true;
            const matchesStacionar = selectedStacionar ? employee.stacionar === selectedStacionar : true;

            return matchesSearch && matchesSearchJmbg && matchesDepartment && matchesPosition && matchesStatus && matchesZaposlen && matchesStacionar;
        });

        // Ažuriraj tabelu i ukupan broj zaposlenih
        updateEmployeeTable(filteredData);
        updateTotalEmployees(filteredData.length);
    }
});
