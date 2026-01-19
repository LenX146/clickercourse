// Простой вариант index.js
let days = 0;

// Функция для кнопки "НАЧАТЬ СЕЙЧАС!"
function showNo() {
    alert('НЕТ!');  // Простое уведомление
}

// Функция для добавления дня
function addDay() {
    days++;
    document.getElementById('score').textContent = days;
}

// Функция для удаления дня
function removeDay() {
    if (days > 0) {
        days--;
        document.getElementById('score').textContent = days;
    }
}

// Назначаем функции после загрузки страницы
window.onload = function() {
    document.getElementById('button0').onclick = showNo;
    document.getElementById('button').onclick = addDay;
    document.getElementById('button2').onclick = removeDay;
    document.getElementById('score').textContent = days;
};