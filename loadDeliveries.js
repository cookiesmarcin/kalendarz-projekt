// loadDeliveries.js
import { addDeliveryBlock } from './deliveryManagement.js';

export async function loadDeliveries() {
    try {
        const response = await fetch('SAPdostawy.txt');
        if (!response.ok) throw new Error(`Nie udało się wczytać pliku: ${response.status}`);

        const text = await response.text();
        const lines = text.split('\n');
        
        lines.forEach(line => {
            const columns = line.split('\t').map(col => col.trim());
            if (columns.length < 6 || !columns[1] || !columns[2]) return;

            const [day, month, year] = columns[1].split('.');
            const formattedDate = new Date(`${year}-${month}-${day}`);
            const dayOfWeek = formattedDate.toLocaleDateString('pl-PL', { weekday: 'long' });

            const [hour, minute] = columns[2].split(':');
            const formattedTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;

            const targetSlot = document.querySelector(`.time-slot[data-day="${dayOfWeek}"][data-time="${formattedTime}"]`);
            if (targetSlot) addDeliveryBlock(targetSlot, columns[6] || "Brak nazwy dostawcy");
        });
    } catch (error) {
        console.error('Błąd podczas wczytywania dostaw:', error);
    }
}
