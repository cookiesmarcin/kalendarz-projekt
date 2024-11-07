// calendarRender.js
export function renderWeeklyCalendar() {
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
