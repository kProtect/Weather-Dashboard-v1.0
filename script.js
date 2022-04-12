var searchEl = document.querySelector("#search")
var cityInputEl = document.querySelector("#city-input")
var cityEl = document.querySelector("#weather-city")
var tempEl = document.querySelector("#temp")
var windEl = document.querySelector("#wind")
var humidityEl = document.querySelector("#humidity")
var uvEl = document.querySelector("#uv")
var forecastEl = document.querySelector("#forecast")
var weatherIcon = document.querySelector("#icon")
var buttonEl = document.querySelector("#button")
var weatherEl = document.querySelector("#weather")
var forecast2El = document.querySelector("#forecast2")
var dateEl = document.querySelector("#date")

var baseUrl = "http://api.openweathermap.org/";
var apiKey = "f4c03d6ed80fcdd0a6dafd6b139817cc";


function generate5day (data) {
    forecastEl.innerHTML = "";
    data.forEach(function (day, index) {
        if(index === 0 || index > 5) {
            return;
        }
        var dt = day.dt;
        var date = moment(dt*1000).format("L");
        var temp = day.temp.day;
        var windSpd = day.wind_speed;
        var humidity = day.humidity;
        var icon = day.weather[0].icon;
        var div = document.createElement("div")
        var offsetClass = "";
        if ( index === 1) {
            offsetClass = "col-lg-offset-1"
        }
        div.classList = `card-weather-container col-sm-12 ${offsetClass} col-lg-2 text-light`;
        div.innerHTML = `
         <div class = "card-weather bg-dark p-1">
          <h4>${date}</h4>
             <img src="https://openweathermap.org/img/wn/${icon}.png" />
            <dl>
            <dt>Temp:</dt>
            <dd>${temp} F</dd>
            <dt>Wind:</dt>
            <dd>${windSpd} MPH</dd>
            <dt>Humidity</dt>
            <dd>${humidity}%</dd>
        </dl>
    </div>
`; 
        forecast2El.appendChild(div)
    })
    forecastEl.classList.remove("hide")
}

function getCityWeather(city) {
    var url = `${baseUrl}geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    fetch(url)
    .then(function(response) {
        return response.json()
    })
    .then(function (data) {
        if (!data.length) {
            alert("Please Input City Name!")
            return;
        }

        saveCityLoca(city);
        cityButtons();

        var cityObj = data[0];
        var lat = cityObj.lat;
        var lon = cityObj.lon;

        var weatherUrl = `${baseUrl}data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

        fetch(weatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            var date = moment(Date.now()).format("L")
            var current = data.current
            var temp = current.temp
            var winspd = current.wind_speed
            var humidity = current.humidity
            var uv = current.uvi
            var icon = current.weather[0].icon

            cityEl.textContent = city;
            dateEl.textContent = date;
            tempEl.textContent = temp;
            windEl.textContent = winspd + " MPH";
            tempEl.textContent = temp+" F";
            humidityEl.textContent = humidity + " %";
            uvEl.textContent = uv;

            if(uv < 3 ) {
                uvEl.classList.add("favorable")
            } else if (uv < 7) {
                uvEl.classList.add("moderate")
            } else {
                uvEl.classList.add("severe")
            }

            weatherIcon.src = `https://openweathermap.org/img/wn/${icon}.png`;
            weatherEl.classList.remove("hide");
            generate5day(data.daily)

        })

    })
}

function cityButtons() {
    buttonEl.innerHTML = "";
    var cities = localStorage.getItem("cities");
    if (cities) {
        cities = JSON.parse(cities);
    } else {
        cities = [];
    }

    cities.forEach(function (city) {
        var button = document.createElement("button")
        button.classList = "btn btn-secondary col-12"
        button.textContent = city;
        button.setAttribute("data-city", city)
        buttonEl.appendChild(button)
    });
}

function saveCityLoca(city) {
    city = city.toLowerCase()
  var cities = localStorage.getItem("cities");
  if (cities) {
    cities = JSON.parse(cities);
  } else {
    cities = [];
  }
  if (cities.includes(city)) {
    return;
  } else {
    cities.push(city);
    }

    localStorage.setItem("cities", JSON.stringify(cities))
}

function handleFormSubmit(evt) {
    evt.preventDefault();
    var city = cityInputEl.value
    getCityWeather(city)
}

function handleButtonClick(evt) {
    var target = evt.target
    var city = target.getAttribute("data-city")
    getCityWeather(city)

}

function addEventListeners() {
    searchEl.addEventListener("submit", handleFormSubmit)
    buttonEl.addEventListener("click", handleButtonClick)
}

function init(){
    addEventListeners()
    cityButtons()
}

init()