let passengersData = [];
let start = 0;
const batchSize = 15;

const tableBody = document.getElementById("passengersBody");
const input = document.getElementById("searchInput");

// Подгружаю данные из файла json
fetch("passengers.json")
  .then((response) => response.json())
  .then((data) => {
    passengersData = data;
    loadPassengers();
  });

// Добавляю в таблицу строки с отображением данных
function loadPassengers() {
  const end = Math.min(start + batchSize, passengersData.length);

  for (let i = start; i < end; i++) {
    const passenger = passengersData[i];
    const row = tableBody.insertRow();
    row.insertCell().textContent = passenger.name;
    row.insertCell().textContent = passenger.gender;
    row.insertCell().textContent = Math.round(passenger.age);
    row.insertCell().textContent = passenger.survived ? "Yes" : "No";
  }
  start = end;
}

// При достижении нижнего края таблицы подгружаю новые данные
window.onscroll = function () {
  let tableBottom = tableBody.offsetTop + tableBody.offsetHeight;

  // Останавливаю функцию, если используется поиск
  if (input.value.length !== 0) {
    return;
  }

  // Проверяю, достиг ли конца таблицы
  if (window.innerHeight + window.scrollY >= tableBottom) {
    for (let i = 0; i < 1; i++) {
      loadPassengers();
    }
  }
};

/*Реализую функцию поиска
Для этого получаю вводимые пользователем данные
Затем привожу их к нижнему регистру*/
input.addEventListener("input", (e) => {
  const searchValue = e.currentTarget.value;

  // Проверяю, включены ли вводимые данные в существующие значения
  const filteredPassengers = passengersData.filter((passenger) => {
    const searchValueLowerCase = searchValue.toLowerCase();
    const nameIncludes = passenger.name
      .toLowerCase()
      .includes(searchValueLowerCase);
    const genderMatches =
      passenger.gender.toLowerCase() === searchValueLowerCase ||
      (searchValueLowerCase === "male" &&
        passenger.gender.toLowerCase() === "m") ||
      (searchValueLowerCase === "female" &&
        passenger.gender.toLowerCase() === "f");
    const ageIncludes = String(Math.round(passenger.age)).includes(searchValue);
    const survivedIncludes =
      String(passenger.survived ? "Yes" : "No")
        .toLowerCase()
        .includes(searchValueLowerCase) &&
      passenger.name.toLowerCase() !== "no";

    return nameIncludes || genderMatches || ageIncludes || survivedIncludes;
  });

  tableBody.innerHTML = "";

  // Оставляю в таблице только объекты из запроса
  filteredPassengers.forEach((passenger) => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = passenger.name;
    row.insertCell().textContent = passenger.gender;
    row.insertCell().textContent = Math.round(passenger.age);
    row.insertCell().textContent = passenger.survived ? "Yes" : "No";
  });
});