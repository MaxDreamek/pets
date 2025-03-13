const saveButton = document.getElementById('save-button');
const col2 = document.getElementById('col2');
const col3 = document.getElementById('col_3');
const col4 = document.getElementById('col_4');
const col5 = document.getElementById('col_5');

function saveData() {
  const data = {
    col2: col2.value,
    col3: col3.textContent,
    hoursDiff: hoursDiff,
    minutesDiff: minutesDiff,
    secondsDiff: secondsDiff,
    col5: col5.textContent
  };
  localStorage.setItem('data', JSON.stringify(data));
}

function loadData() {
  const data = localStorage.getItem('data');
  if (data) {
    const parsedData = JSON.parse(data);
    col2.value = parsedData.col2;
    col3.textContent = parsedData.col3;
    hoursDiff = parsedData.hoursDiff;
    minutesDiff = parsedData.minutesDiff;
    secondsDiff = parsedData.secondsDiff;
    col5.textContent = parsedData.col5;
    col4.textContent = `${hoursDiff.toString().padStart(2, '0')}:${minutesDiff.toString().padStart(2, '0')}:${secondsDiff.toString().padStart(2, '0')}`;

    // запускаем таймер
    setInterval(() => {
      secondsDiff--;
      if (secondsDiff < 0) {
        minutesDiff--;
        secondsDiff = 59;
      }
      if (minutesDiff < 0) {
        hoursDiff--;
        minutesDiff = 59;
      }
      if (hoursDiff < 0) {
        hoursDiff = 0;
        minutesDiff = 0;
        secondsDiff = 0;
      }
      col4.textContent = `${hoursDiff.toString().padStart(2, '0')}:${minutesDiff.toString().padStart(2, '0')}:${secondsDiff.toString().padStart(2, '0')}`;
      saveData();
    }, 1000);
  }
}

let hoursDiff, minutesDiff, secondsDiff;

saveButton.addEventListener('click', () => {
  const time = col2.value;
  const hours = parseInt(time.split(':')[0]);
  const minutes = parseInt(time.split(':')[1]);
  const seconds = parseInt(time.split(':')[2]);

  const col3Value = new Date();
  col3Value.setHours(hours + 6);
  col3Value.setMinutes(minutes);
  col3Value.setSeconds(seconds);
  col3.textContent = col3Value.toLocaleTimeString();

  const now = new Date();
  const diff = col3Value.getTime() - now.getTime();
  if (diff > 0) {
    hoursDiff = Math.floor(diff / 3600000);
    minutesDiff = Math.floor((diff % 3600000) / 60000);
    secondsDiff = Math.floor((diff % 60000) / 1000);
  } else {
    hoursDiff = 0;
    minutesDiff = 0;
    secondsDiff = 0;
  }

  const col5Value = (new Date().getTime() > col3Value.getTime()) & (new Date().getTime() < (col3Value.getTime() + (2 * 60 * 60 * 1000))); 
  col5.textContent = col5Value ? 'В ресе' : 'Пусто';
});

loadData();