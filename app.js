const dayEl = document.querySelector('.default_day');
const dateEl = document.querySelector('.default_date');

const btnEl = document.querySelector('.btn_search');
const searchBar = document.querySelector('.search_bar');

const appContainer = document.querySelector('.icons');
const description = document.querySelector('.icons img');
const dayInfo = document.querySelector('.day_info .currentData');


const listContent = document.querySelector('.list_content')

const weekTemp = document.querySelectorAll('.list_content .day_temp');
const weekImg = document.querySelectorAll('.list_content img')
const weekDay = document.querySelectorAll('.list_content .week_day');



const currentDeg = document.querySelector('.weather_temp');
const currentCloud = document.querySelector('.cloudtxt');
const img = document.querySelector('.weather_icon')

const currentTime = document.querySelector('.time')

const apiKey = '173623ae52e316a5245c191d628e93ab';

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];



const today = new Date();
const dayName = days[today.getDay()];
dayEl.textContent = dayName;

const month = today.toLocaleString('en', { month: 'long' });
const date = today.getDate();
const year = today.getFullYear();
dateEl.textContent = `${month} ${date} ${year}`;



function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('az-AZ', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    currentTime.innerText = timeStr


}

setInterval(updateTime, 1000);
updateTime();

btnEl.addEventListener('click', (e) => {
    e.preventDefault();
    const city = searchBar.value.trim();
    if (city !== "") {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=en`)
            .then(response => response.json())
            .then(data => {
                if (data.cod === '404') {
                    listContent.style.display = 'none'
                    dayInfo.style.display = 'none'
                    appContainer.style.display = 'block'
                    appContainer.innerHTML = `
                    <h3 class="weather_temp">${data.cod}</h2>
                        <h2 class="weather_temp" style="font-size: 30px;">${data.message}</h2>      
                    `



                }
                else {
                    dayInfo.style.display = 'block'
                    listContent.style.display = 'block'
                    appContainer.style.display = 'block'

                    appContainer.innerHTML = `
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png"  class="weather_icon">
                    <h3 class="weather_temp">${data.name}</h2>
                        <h2 class="weather_temp">${Math.round(data.main.temp)} &degC</h2>
                        <h3 class="cloudtxt">${data.weather[0].description}</h3>
                `
                    dayInfo.innerHTML = `
           <div class="content">
                        <p class="title">Name</p>
                        <span class="value">${data.name} , ${data.sys.country}</span>
                    </div>
                    <div class="content">
                        <p class="title">temp</p>
                        <span class="value">${Math.round(data.main.temp)}&degC</span>
                    </div>
                    <div class="content">
                        <p class="title">Humidity</p>
                        <span class="value">${data.main.humidity} %</span>
                    </div>
                    <div class="content">
                        <p class="title">Wind Speed</p>
                        <span class="value">${Math.round(data.wind.speed)} km/h</span>
                    </div>`
                    searchBar.value = '';
                    
                }
            });
    }
    else {
        alert('Please Enter City Name')
        appContainer.style.display = 'none'
        dayInfo.innerHTML = ''
        listContent.style.display = 'none'

    }


    function getForecast() {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                const dailyForecast = data.list.filter(item => item.dt_txt.includes("12:00:00"));
                showDays(dailyForecast);
                // console.log(dailyForecast);
                // console.log(data);
            });
    }




    function showDays(forecastArray) {
        forecastArray.slice(0, weekDay.length).forEach((item, index) => {
            const forecastDate = new Date(item.dt_txt);
            const shortDay = days[forecastDate.getDay()].slice(0, 3); // "Mon", "Tue" və s.
            weekDay[index].innerText = `${shortDay} 12AM`;
            weekTemp[index].innerText = `${Math.round(item.main.temp)}°C`;
            weekImg[index].src = `https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`

        });
    }


    getForecast()
});

