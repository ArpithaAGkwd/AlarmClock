const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
const alarmContainer = document.querySelector("#alarms-container");
const ringTone = new Audio('./file/ringtone.mp3');


// Get the current date
const currentDate = new Date();

// Array of week days and months
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Get the week day, month, day, and year
const weekDay = weekDays[currentDate.getDay()];
const month = months[currentDate.getMonth()];
const day = currentDate.getDate();
const year = currentDate.getFullYear();

// Update the HTML elements with the values
document.getElementById('week').textContent = weekDay;
document.getElementById('month').textContent = month;
document.getElementById('date').textContent = day;
document.getElementById('year').textContent = year;


// Adding Hours, Minutes, Seconds in DropDown Menu
window.addEventListener("DOMContentLoaded", (event) => {
  dropDownMenu(1, 12, setHours);
  dropDownMenu(0, 59, setMinutes);
  dropDownMenu(0, 59, setSeconds);
  setInterval(getCurrentTime, 1000);
  fetchAlarm();
});

// Event Listener added to Set Alarm Button
setAlarmButton.addEventListener("click", getInput);

function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
    dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
}

function getCurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTime.innerHTML = time;
  return time;
}


function getInput(e) {
  e.preventDefault();
  const hourValue = setHours.value;
  const minuteValue = setMinutes.value;
  const secondValue = setSeconds.value;
  const amPmValue = setAmPm.value;

  const alarmTime = convertToTime(
    hourValue,
    minuteValue,
    secondValue,
    amPmValue
  );
  setAlarm(alarmTime);
}

// Converting time to 24 hour format
function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
      alert("alarm about to set off !!")
      ringTone.play();
    }
    document.querySelector("#stopAlarm").addEventListener("click", stopAlarm);
  }, 500);

  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

// Alarms set by user Dislayed in HTML
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="btn btn-dark" data-id=${intervalId}>Delete</button>
              `;
  const deleteButton = alarm.querySelector(".btn-dark");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));
  alarmContainer.prepend(alarm);
}

// Is alarms saved in Local Storage?
function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);
  return alarms;
}

// save alarm to local storage
function saveAlarm(time) {
  const alarms = checkAlarams();
  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

// Fetching alarms from local storage
function fetchAlarm() {
  const alarms = checkAlarams();
  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}


function deleteAlarm(event, time, intervalId) {
  const self = event.target;
  clearInterval(intervalId);
  const alarm = self.parentElement;
  console.log(time);

  deleteAlarmFromLocal(time);
  alarm.remove();
}

function deleteAlarmFromLocal(time) {
  const alarms = checkAlarams();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function stopAlarm() {
  ringTone.pause();
}

