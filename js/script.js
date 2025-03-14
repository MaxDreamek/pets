const saveButton = document.getElementById('save-button');
const rows = document.querySelectorAll('.column');
const timers = new Map(); // Хранит таймеры для каждой строки

function saveData() {
    const data = [];

    rows.forEach(row => {
        const col2 = row.querySelector('.col2-input').value;
        const col3 = row.querySelector('.col3').textContent;
        const col4 = row.querySelector('.col4').textContent;
        const col5 = row.querySelector('.col5').textContent;

        data.push({ col2, col3, col4, col5 });
    });

    localStorage.setItem('data', JSON.stringify(data));
}

function loadData() {
    const data = JSON.parse(localStorage.getItem('data'));

    if (data) {
        rows.forEach((row, index) => {
            if (data[index]) {
                row.querySelector('.col2-input').value = data[index].col2;
                row.querySelector('.col3').textContent = data[index].col3;
                row.querySelector('.col4').textContent = data[index].col4;
                row.querySelector('.col5').textContent = data[index].col5;
            }
        });
    }
}

function startTimer(row) {
    const col4 = row.querySelector('.col4');
    const col5 = row.querySelector('.col5');

    // Удаляем старый таймер, если он есть
    if (timers.has(row)) {
        clearInterval(timers.get(row));
        timers.delete(row);
    }

    function updateTimer() {
        let timeParts = col4.textContent.split(':').map(Number);
        let [hours, minutes, seconds] = timeParts;

        if (hours === 0 && minutes === 0 && seconds === 0) {
            col5.textContent = 'Пусто';
            clearInterval(timers.get(row)); // Останавливаем таймер
            timers.delete(row);
            return;
        }

        if (seconds > 0) {
            seconds--;
        } else if (minutes > 0) {
            minutes--;
            seconds = 59;
        } else if (hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
        }

        col4.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        col5.textContent = (hours === 0 && minutes === 0 && seconds === 0) ? 'В ресе' : 'Пусто';
    }

    // Запускаем таймер только если в `col4` есть время
    if (!col4.textContent.startsWith('00:00:00')) {
        const timerId = setInterval(updateTimer, 1000);
        timers.set(row, timerId);
    }
}

function sortRows() {
    const table = document.querySelector("table");
    const rows = Array.from(table.querySelectorAll(".column"));

    rows.sort((a, b) => {
        const timeA = a.querySelector(".col4").textContent.split(":").map(Number);
        const timeB = b.querySelector(".col4").textContent.split(":").map(Number);

        const totalSecondsA = timeA[0] * 3600 + timeA[1] * 60 + timeA[2];
        const totalSecondsB = timeB[0] * 3600 + timeB[1] * 60 + timeB[2];

        return totalSecondsA - totalSecondsB;
    });

    rows.forEach(row => table.appendChild(row));
}

saveButton.addEventListener('click', () => {
    rows.forEach(row => {
        const col2 = row.querySelector('.col2-input').value;
        const col3 = row.querySelector('.col3');
        const col4 = row.querySelector('.col4');
        const col5 = row.querySelector('.col5');

        if (col2) {
            const timeParts = col2.split(':');
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const seconds = timeParts[2] ? parseInt(timeParts[2]) : 0;

            const col3Value = new Date();
            col3Value.setHours(hours + 6);
            col3Value.setMinutes(minutes);
            col3Value.setSeconds(seconds);
            col3.textContent = col3Value.toLocaleTimeString();

            const now = new Date();
            const diff = col3Value.getTime() - now.getTime();
            let hoursDiff, minutesDiff, secondsDiff;

            if (diff > 0) {
                hoursDiff = Math.floor(diff / 3600000);
                minutesDiff = Math.floor((diff % 3600000) / 60000);
                secondsDiff = Math.floor((diff % 60000) / 1000);
            } else {
                hoursDiff = 0;
                minutesDiff = 0;
                secondsDiff = 0;
            }

            col4.textContent = `${hoursDiff.toString().padStart(2, '0')}:${minutesDiff.toString().padStart(2, '0')}:${secondsDiff.toString().padStart(2, '0')}`;

            startTimer(row);
        }
    });

    saveData();
    sortRows(); 
});

loadData();
rows.forEach(startTimer);
