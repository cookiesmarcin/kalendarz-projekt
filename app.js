function renderWeeklyCalendar() {
    const calendarView = document.getElementById("calendar-view");
    calendarView.innerHTML = "";

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));

    calendarView.innerHTML += `<div class="shift-cell">Zmiany</div><div class="time-column">Godziny</div>`;

    const daysOfWeek = ["poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"];
    daysOfWeek.forEach((day, index) => {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + index);
        const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`;
        calendarView.innerHTML += `<div class="day-header">${day}<br><span class="date">${formattedDate}</span></div>`;
    });

    const shifts = [
        { label: "ZM.1", start: 6, end: 14, className: "shift-1" },
        { label: "ZM.2", start: 14, end: 22, className: "shift-2" },
        { label: "ZM.3", start: 22, end: 30, className: "shift-3" }
    ];

    shifts.forEach(shift => {
        const totalSlots = (shift.end - shift.start) * 4;
        calendarView.innerHTML += `<div class="shift-cell ${shift.className}" style="grid-row: span ${totalSlots};">${shift.label}</div>`;

        for (let time = shift.start * 60; time < shift.end * 60; time += 15) {
            const hour = Math.floor(time / 60) % 24;
            const minutes = time % 60;
            const formattedTime = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            const timeClass = minutes === 0 ? "time-column full-hour" : "time-column";
            calendarView.innerHTML += `<div class="${timeClass}">${formattedTime}</div>`;
            for (let i = 0; i < 7; i++) {
                const daySlotClass = minutes === 0 ? "time-slot full-hour" : "time-slot";
                calendarView.innerHTML += `<div class="${daySlotClass} ${shift.className}" data-day="${daysOfWeek[i]}" data-time="${formattedTime}"></div>`;
            }
        }
    });
}

renderWeeklyCalendar();

document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    if (e.target.classList.contains("time-slot") || e.target.classList.contains("delivery-block")) {
        document.querySelectorAll(".time-slot, .delivery-block").forEach(slot => slot.classList.remove("highlighted"));
        e.target.classList.add("highlighted");

        const contextMenu = document.getElementById("context-menu");
        contextMenu.style.top = `${e.pageY}px`;
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.display = "block";

        contextMenu.targetSlot = e.target.classList.contains("time-slot") ? e.target : e.target.closest(".time-slot");
    } else {
        document.getElementById("context-menu").style.display = "none";
    }
});

// Funkcja ukrywania menu kontekstowego i podświetlania przy kliknięciu lewym przyciskiem
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("time-slot")) {
        // Usuwanie wcześniejszego podświetlenia
        document.querySelectorAll(".time-slot").forEach(slot => slot.classList.remove("highlighted"));

        // Podświetlanie klikniętego slotu
        e.target.classList.add("highlighted");

        // Ukrycie menu kontekstowego
        document.getElementById("context-menu").style.display = "none";
    } else if (!e.target.classList.contains("context-menu") && !e.target.closest(".context-menu")) {
        document.getElementById("context-menu").style.display = "none";
    }
});

// Funkcja dodająca blok dostawy
function addDeliveryBlock() {
    const slot = document.getElementById("context-menu").targetSlot;

    // Sprawdzenie, czy slot nie zawiera już bloku dostawy
    if (slot.querySelector(".delivery-block")) {
        alert("Slot już zawiera blok dostawy.");
        document.getElementById("context-menu").style.display = "none";
        return;
    }

    // Tworzenie bloku dostawy, który wizualnie zajmie 3 sloty
    const deliveryBlock = document.createElement("div");
    deliveryBlock.classList.add("delivery-block");
    deliveryBlock.innerText = "DOSTAWA CHEMII - ABC";
    deliveryBlock.style.gridRow = `span 3`; // Zajmuje 3 sloty w pionie

    // Znalezienie daty z nagłówka kolumny (szukamy najbliższego .day-header w tej samej kolumnie)
    const columnIndex = Array.from(slot.parentElement.children).indexOf(slot) % 7; // Index kolumny 0-6
    const headerDateElement = document.querySelectorAll(".day-header .date")[columnIndex];
    const date = headerDateElement ? headerDateElement.innerText : "Nieznana data";

    const time = slot.getAttribute("data-time") || "Nieznany czas";
    const dayOfWeek = slot.getAttribute("data-day") || "Nieznany dzień";
    const name = deliveryBlock.innerText;

    // Dodanie obsługi prawokliknięcia i lewokliknięcia do ręcznie dodanego bloku
    deliveryBlock.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const contextMenu = document.getElementById("context-menu");
        contextMenu.targetSlot = deliveryBlock; // Przypisanie bloku do menu kontekstowego
        contextMenu.style.top = `${e.pageY}px`;
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.display = "block";
    });

    // Przypisanie obsługi kliknięcia lewym przyciskiem (otwarcie szczegółów lub inne akcje)
    deliveryBlock.addEventListener("click", () => {
        showTransportDetails(date, time, name, dayOfWeek, "Oczekuje", "12345");
    });

    // Dodajemy możliwość przesuwania bloku
    deliveryBlock.draggable = true;
    deliveryBlock.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", null);
        e.dataTransfer.setDragImage(new Image(), 0, 0); // Ukrycie domyślnego obrazu przeciągania
        deliveryBlock.classList.add("dragging");
    });

    deliveryBlock.addEventListener("dragend", () => {
        deliveryBlock.classList.remove("dragging");
    });

    // Dodajemy blok dostawy do wybranego slotu
    slot.appendChild(deliveryBlock);

    // Ukrycie menu kontekstowego po dodaniu transportu
    document.getElementById("context-menu").style.display = "none";
}


// Funkcja edytowania bloku dostawy (na razie placeholder)
function editDeliveryBlock() {
    alert("Funkcja edytowania transportu jest w trakcie wdrażania.");
}

// Funkcja usuwania bloku dostawy
function removeDeliveryBlock() {
    const contextMenu = document.getElementById("context-menu");
    const targetBlock = contextMenu.targetSlot.querySelector(".delivery-block");

    if (targetBlock) {
        targetBlock.remove();
        console.log("Blok dostawy został usunięty.");
    } else {
        console.log("Nie znaleziono bloku dostawy do usunięcia.");
    }

    contextMenu.style.display = "none";
}


// Funkcja pozwalająca na przeciąganie i upuszczanie bloku dostawy
document.querySelectorAll(".time-slot").forEach(slot => {
    slot.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    slot.addEventListener("drop", (e) => {
        e.preventDefault();
        const draggingBlock = document.querySelector(".dragging");
        if (draggingBlock) {
            e.target.appendChild(draggingBlock);
        }
    });
});

document.querySelectorAll(".delivery-block").forEach(block => {
    block.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const contextMenu = document.getElementById("context-menu");

        document.querySelectorAll(".time-slot, .delivery-block").forEach(el => el.classList.remove("highlighted"));
        block.classList.add("highlighted");
        
        contextMenu.targetSlot = block;

        contextMenu.style.top = `${e.pageY}px`;
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.display = "block";
        
        console.log("Menu kontekstowe dla bloku transportu wyświetlone.");
    });
});
async function loadDeliveries() {
    try {
        console.log('Rozpoczęcie wczytywania dostaw...');

        const response = await fetch('SAPdostawy.txt');
        if (!response.ok) {
            throw new Error(`Nie udało się wczytać pliku: ${response.status}`);
        }

        const text = await response.text();
        console.log('Zawartość pliku:', text);

        const lines = text.split('\n');
        lines.forEach((line, lineIndex) => {
            const columns = line.split('\t').map(col => col.trim());
            if (columns.length < 6 || !columns[1] || !columns[2]) {
                console.log(`Pominięto niekompletną lub pustą linię: ${line}`);
                return;
            }

            const date = columns[1];
            const time = columns[2];
            const name = columns[6] || "Brak nazwy dostawcy";

            console.log(`Linia ${lineIndex + 1}:`, columns);

            const [day, month, year] = date ? date.split('.') : ["01", "01", "1970"];
            const formattedDate = new Date(`${year}-${month}-${day}`);
            if (isNaN(formattedDate.getTime())) {
                console.log(`Nieprawidłowa data w linii: ${line}`);
                return;
            }
            const dayOfWeek = formattedDate.toLocaleDateString('pl-PL', { weekday: 'long' });

            const [hour, minute] = time ? time.split(':') : ["00", "00"];
            const formattedTime = `${(hour || "00").padStart(2, '0')}:${(minute || "00").padStart(2, '0')}`;

            const targetSlot = document.querySelector(`.time-slot[data-day="${dayOfWeek}"][data-time="${formattedTime}"]`);
            
            console.log('Znaleziony slot:', targetSlot);

            if (targetSlot) {
                const deliveryBlock = document.createElement('div');
                deliveryBlock.classList.add('delivery-block');
                
                // Ograniczenie liczby znaków do 20
                deliveryBlock.innerText = name.length > 20 ? name.slice(0, 20) + "..." : name;
                
                deliveryBlock.addEventListener("click", function () {
                    showTransportDetails(date, time, name, dayOfWeek, "Dostarczono", "12345");
                });
                
                // Ustawienie możliwości przeciągania
                deliveryBlock.draggable = true;
                deliveryBlock.addEventListener("dragstart", (e) => {
                    e.dataTransfer.setData("text/plain", null);
                    e.dataTransfer.setDragImage(new Image(), 0, 0); // Ukrycie domyślnego obrazu przeciągania
                    deliveryBlock.classList.add("dragging");
                });
            
                deliveryBlock.addEventListener("dragend", () => {
                    deliveryBlock.classList.remove("dragging");
                });
            
                // Obsługa kliknięcia prawym przyciskiem myszy
                deliveryBlock.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    document.querySelectorAll(".time-slot").forEach(slot => slot.classList.remove("highlighted"));
                    deliveryBlock.classList.add("highlighted");
            
                    const contextMenu = document.getElementById("context-menu");
                    contextMenu.style.top = `${e.pageY}px`;
                    contextMenu.style.left = `${e.pageX}px`;
                    contextMenu.style.display = "block";
            
                    // Przechowujemy referencję do bloku do usunięcia
                    contextMenu.targetBlock = deliveryBlock;
                });
            
                // Dodajemy blok dostawy do wybranego slotu
                targetSlot.appendChild(deliveryBlock);
                console.log('Dodano blok dostawy do slotu');
            }
            
        });
    } catch (error) {
        console.error('Błąd podczas wczytywania dostaw:', error);
    }
}

function showTransportDetails(date, time, name, dayOfWeek, status, number) {
    document.getElementById("transport-date").innerText = date;
    document.getElementById("transport-time").innerText = time;
    document.getElementById("transport-name").innerText = name;
    document.getElementById("transport-day").innerText = dayOfWeek;
    document.getElementById("transport-status").innerText = status;
    document.getElementById("transport-number").innerText = number;

    document.getElementById("slide-out-section").classList.add("open");
}

document.addEventListener("DOMContentLoaded", loadDeliveries);

document.addEventListener("DOMContentLoaded", function () {
    const slideOutSection = document.getElementById("slide-out-section");

    function showTransportDetails(date, time, name, dayOfWeek, status, number) {
        document.getElementById("transport-date").innerText = date;
        document.getElementById("transport-time").innerText = time;
        document.getElementById("transport-name").innerText = name;
        document.getElementById("transport-day").innerText = dayOfWeek;
        document.getElementById("transport-status").innerText = status;
        document.getElementById("transport-number").innerText = number;

        slideOutSection.classList.add("open");
    }

    document.addEventListener("click", function (e) {
        if (!slideOutSection.contains(e.target) && !e.target.classList.contains("delivery-block")) {
            slideOutSection.classList.remove("open");
        }
    });

    document.querySelectorAll(".delivery-block").forEach(block => {
        block.addEventListener("click", function () {
            const date = "28.10.2024";
            const time = "08:00";
            const name = this.innerText;
            const dayOfWeek = "Poniedziałek";
            const status = "Dostarczono";
            const number = "12345";

            showTransportDetails(date, time, name, dayOfWeek, status, number);
        });
    });
});

function sendSMS() {
    const phoneNumber = "48660719840"; // Wprowadź tutaj docelowy numer telefonu

    // Pobieranie wartości z wysuwanego menu
    const date = document.getElementById("transport-date").innerText;
    const time = document.getElementById("transport-time").innerText;
    const name = document.getElementById("transport-name").innerText;

    // Tworzenie treści wiadomości
    const message = `Data: ${date}, Godzina: ${time}, Nazwa: ${name}`;

    // Tworzenie URL do wysłania SMS
    const url = `http://10.221.62.234/http_api/send_sms?access_token=JcazqpEo0PwJcaPe7p5vdFaA2DvgHwaw&to=${phoneNumber}&message=${encodeURIComponent(message)}`;

    // Wysłanie żądania SMS przy użyciu fetch
    fetch(url)
        .then(response => {
            if (response.ok) {
                console.log("SMS został wysłany.");
            } else {
                console.error("Błąd podczas wysyłania SMS:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Błąd sieciowy podczas wysyłania SMS:", error);
        });
}

function sendEmail() {
    // Kod do wysyłania emaila
    console.log("Wysyłanie Email...");
    // Możesz dodać tu kod do wysłania emaila, np. przy pomocy API poczty.
}
