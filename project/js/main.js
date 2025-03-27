$(document).ready(function(){
    $('#employeesTable').on('mouseover', 'tbody tr', function(){
        $(this).addClass('zebraHover');
    });

    $('#employeesTable').on('mouseout', 'tbody tr', function(){
        $(this).removeClass('zebraHover');
    });

    $('#employeesTable').on('click', 'tbody tr', function(){
        if ($(this).css('background-color') === 'yellow') {
            $(this).css('background', '');
        } else {
            $(this).css('background', 'yellow');
        }
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
    const aplikacijaFilter = document.getElementById('aplikacijaFilter');
    const stazFilter = document.getElementById('stazFilter');
    const employeesTable = document.getElementById('employeesTable').getElementsByTagName('tbody')[0];
    const totalEmployeesElement = document.createElement('div');

    totalEmployeesElement.style.color = 'red';
    document.querySelector('#ukupnoZaposlenih').appendChild(totalEmployeesElement);

    let employeesData = [];

    fetch('http://localhost:3000/employees')
        .then(response => response.json())
        .then(data => {
            employeesData = data;
            updateEmployeeTable(data);
            updateTotalEmployees(data.length);
        });

    // **Funkcija za konverziju datuma**
    function konvertujDatum(datum) {
        let parts = datum.split('.');
        return new Date(parts[2], parts[1] - 1, parts[0]); 
    }

    // Funkcija za izračunavanje radnog staža
    function izracunajRadniStaz(datumPocetka, datumKraja) {
        let startDate = konvertujDatum(datumPocetka);
        let endDate = datumKraja === "Traje" ? new Date() : konvertujDatum(datumKraja);

        if (isNaN(startDate) || isNaN(endDate)) return "N/A";

        let years = endDate.getFullYear() - startDate.getFullYear();
        let months = endDate.getMonth() - startDate.getMonth();
        let days = endDate.getDate() - startDate.getDate();

        if (days < 0) {
            months -= 1;
            days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years -= 1;
            months += 12;
        }

        return `${years} god, ${months} mes, ${days} dana`;
    }

    // **Ažuriranje tabele**
    function updateEmployeeTable(data) {
        employeesTable.innerHTML = '';

        data.forEach(employee => {
            let row = employeesTable.insertRow();
            row.setAttribute('data-id', employee.id);

            let radniStaz = izracunajRadniStaz(employee.pocRadnog, employee.krajRadnog); 

            row.innerHTML = `
                <td class="imePrezime">${employee.ime}</td>
                <td>${employee.datumRodjenja}</td>
                <td>${employee.jmbg}</td>
                <td>${employee.pol}</td>
                <td>${employee.pocRadnog}</td>
                <td>${employee.krajRadnog}</td>
                <td>${employee.radiNeradi}</td>
                <td>${employee.status}</td>
                <td>${employee.kvalifikacija}</td>
                <td>${employee.zvanje}</td>
                <td>${employee.pozicija}</td>
                <td>${employee.odeljenje}</td>
                <td>${employee.aplikacija}</td>
                <td>${employee.stacionar}</td>
                <td>${employee.odmor}</td>
                <td class="radniStaz">${radniStaz}</td>
                <td><button class="edit-btn"><i class="fa fa-pencil" aria-hidden="true"></i></button></td>
                <td><button class="delete-btn"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
            `;

            // Ako zaposlen više ne radi, ime dobija crvenu pozadinu
            if (employee.krajRadnog !== "Traje") {
                row.querySelector(".imePrezime").style.backgroundColor = "#ffcccc";
            }

            let radniStazCell = row.querySelector(".radniStaz");
            if (parseInt(radniStaz.split(" ")[0]) == 10) {
                radniStazCell.style.backgroundColor = "#ffdace";
                radniStazCell.style.color = "white";
            }
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const confirmDelete = window.confirm('Da li ste sigurni da želite da obrišete ovog zaposlenog?');
                if (confirmDelete) {
                    const row = button.closest('tr');
                    const employeeId = row.getAttribute('data-id');

                    fetch(`http://localhost:3000/employees/${employeeId}`, {
                        method: 'DELETE',
                    }).then(() => {
                        row.remove();
                        filterEmployees();
                    }).catch(error => {
                        console.error('Greška prilikom brisanja:', error);
                        alert('Došlo je do greške prilikom brisanja zaposlenog.');
                    });
                }
            });
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const row = button.closest('tr');
                const employeeId = row.getAttribute('data-id');
                window.location.href = `edit-employee.html?id=${employeeId}`;
            });
        });
    }

    function updateTotalEmployees(count) {
        totalEmployeesElement.textContent = `Ukupan broj zaposlenih: ${count}`;
    }

    searchInput.addEventListener('input', filterEmployees);
    searchJmbg.addEventListener('input', filterEmployees);
    departmentFilter.addEventListener('change', filterEmployees);
    positionFilter.addEventListener('change', filterEmployees);
    statusFilter.addEventListener('change', filterEmployees);
    zaposlenFilter.addEventListener('change', filterEmployees);
    stacionarFilter.addEventListener('change', filterEmployees);
    aplikacijaFilter.addEventListener('change', filterEmployees);
    stazFilter.addEventListener('change', filterEmployees);

    function filterEmployees() {
        const searchTerm = searchInput.value.toLowerCase();
        const searchJmbg1 = searchJmbg.value.toLowerCase();
        const selectedDepartment = departmentFilter.value;
        const selectedPosition = positionFilter.value;
        const selectedStatus = statusFilter.value;
        const selectedZaposlen = zaposlenFilter.value;
        const selectedStacionar = stacionarFilter.value;
        const selectedAplikacija = aplikacijaFilter.value;
        const selectedStaz = stazFilter.value;

        const filteredData = employeesData.filter(employee => {
            const matchesSearch = employee.ime.toLowerCase().includes(searchTerm);
            const matchesSearchJmbg = employee.jmbg.toLowerCase().includes(searchJmbg1);
            const matchesDepartment = selectedDepartment ? employee.odeljenje === selectedDepartment : true;
            const matchesPosition = selectedPosition ? employee.pozicija === selectedPosition : true;
            const matchesZaposlen = selectedZaposlen ? employee.radiNeradi === selectedZaposlen : true;
            const matchesStatus = selectedStatus ? employee.status === selectedStatus : true;
            const matchesStacionar = selectedStacionar ? employee.stacionar === selectedStacionar : true;
            const matchesAplikacija = selectedAplikacija ? employee.aplikacija === selectedAplikacija : true;
            const matchesStaz = selectedStaz ? parseInt(izracunajRadniStaz(employee.pocRadnog).split(" ")[0]) === parseInt(selectedStaz) : true;

            return matchesSearch && matchesSearchJmbg && matchesDepartment && matchesPosition && matchesStatus && matchesZaposlen && matchesStacionar && matchesStaz && matchesAplikacija;
        });

        updateEmployeeTable(filteredData);
        updateTotalEmployees(filteredData.length);
    }

    // Dodavanje funkcionalnosti za štampanje tabele
    const printBtn = document.getElementById('printBtn');

    printBtn.addEventListener('click', function() {
        const table = document.getElementById('employeesTable');
        const printWindow = window.open('', '', 'height=500,width=1920');
        printWindow.document.write('<html><head><title>Izveštaj o zaposlenima</title>');
        printWindow.document.write('<link rel="stylesheet" type="text/css" href="css/style.css">');  // Učitaj stilove iz CSS-a
        printWindow.document.write('</head><body>');
        // Dodaj logo i naziv klinike
        printWindow.document.write(`
            <div class="logo-print" style="text-align: center; margin-bottom: 20px;">
                <img src="asstes/images/logo-ll.png" alt="Logo klinike" style="height: 100px;">
                <h1>Klinika za psihijatrijske bolesti "Dr. Laza Lazarević"</h1>
            </div>
        `);
        printWindow.document.write('<h2>Izveštaj o zaposlenima</h2>');
        printWindow.document.write(totalEmployeesElement.textContent);
        printWindow.document.write(`<div class='pregled-stampanja'>
        <p class='boldovanje'>Organizaciona jedinica: ${departmentFilter.value ? departmentFilter.value : "Nije izabrano"}</p> |
        <p class='boldovanje'>Radno mesto po sistematizaciji: ${positionFilter.value ? positionFilter.value : "Nije izabrano"}</p> |
        <p class='boldovanje'>Status: ${statusFilter.value ? statusFilter.value : "Nije izabrano"}</p> |
        <p class='boldovanje'>Stacionar: ${stacionarFilter.value ? stacionarFilter.value : "Nije izabrano"}</p> |
        <p class='boldovanje'>Godina staža: ${stazFilter.value ? stazFilter.value : "Nije izabrano"}</p>
        <p class='boldovanje'>Aplikacija: ${aplikacijaFilter.value ? aplikacijaFilter.value : "Nije izabrano"}</p>
    </div>`);
        printWindow.document.write(table.outerHTML);  // Ispisujemo celu tabelu
        printWindow.document.write(`
            <div class="potpis-pecat">
                <h3>Potpis:</h3>
                <p>_______________________________</p>
            </div>
        `);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();  // Otvara dijalog za štampanje
        let originalDisplay = [];
        // Sakrivanje isključenih kolona pre štampe
        $(".column-toggle").each(function () {
            let column = $(this).data("column");
            if (!$(this).is(":checked")) {
                $("#employeesTable tr").each(function () {
                    let cell = $(this).find("th, td").eq(column);
                    originalDisplay[column] = cell.css("display");
                    cell.hide();
                });
            }
        });
    });


    // Dodavanje funkcionalnosti za selekciju kolona i štampanje
$(document).ready(function () {
    // Event listener za checkbox-eve koji kontrolišu vidljivost kolona
    $(".column-toggle").on("change", function () {
        let column = $(this).data("column");
        let isChecked = $(this).is(":checked");

        // Prikazuje ili sakriva kolonu na osnovu checkbox statusa
        $("#employeesTable tr").each(function () {
            $(this).find("th, td").eq(column).toggle(isChecked);
        });
    });
});

});
