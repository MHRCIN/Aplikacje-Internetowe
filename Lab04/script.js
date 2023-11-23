const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.resultsBlock = document.querySelector(resultsBlockSelector);
    }

    getCurrentWeather(query) {
        const xhr = new XMLHttpRequest();
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${this.apiKey}&units=metric&lang=pl`;

        xhr.open('GET', url, true);
        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                console.log("XMLHttpRequest:", response);
                const currentDate = new Date(response.dt * 1000);
                const dateString = `${currentDate.toLocaleDateString("pl-PL")} ${currentDate.toLocaleTimeString("pl-PL")}`;
                const weatherData = {
                    date: dateString,
                    temperature: response.main.temp,
                    feelsLike: response.main.feels_like,
                    icon: response.weather[0].icon,
                    description: response.weather[0].description
                };
                const weatherBlock = this.createWeatherBlock(weatherData.date, weatherData.temperature, weatherData.feelsLike, weatherData.icon, weatherData.description);
                this.resultsBlock.appendChild(weatherBlock);
            } else {
                console.error("Error fetching weather data:", xhr.statusText);
            }
        };
        xhr.onerror = () => {
            console.error("Network Error");
        };
        xhr.send();
    }

    getForecast(query) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${this.apiKey}&units=metric&lang=pl`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log("Fetch (1)", response);
                return response.json();
            })
            .then(data => {
                console.log("Fetch (2)", data);
                data.list.forEach(item => {
                    const weatherData = {
                        date: new Date(item.dt * 1000).toLocaleString("pl-PL"),
                        temperature: item.main.temp,
                        feelsLike: item.main.feels_like,
                        icon: item.weather[0].icon,
                        description: item.weather[0].description
                    };
                    const weatherBlock = this.createWeatherBlock(weatherData.date, weatherData.temperature, weatherData.feelsLike, weatherData.icon, weatherData.description);
                    this.resultsBlock.appendChild(weatherBlock);
                });
            })
            .catch(error => {
                console.error("Error fetching forecast data:", error);
            });
    }


    getWeather(query) {
        this.resultsBlock.innerHTML = '';

        const locationNameBlock = document.querySelector("#locationName");
        locationNameBlock.innerText = `Pogoda dla: ${query}`;

        this.getCurrentWeather(query)
        this.getForecast(query);
    }

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {

        const weatherBlock = document.createElement("div");
        weatherBlock.className = "weather-block";

        const dateBlock = document.createElement("div");
        dateBlock.className = "weather-date";
        dateBlock.innerText = dateString;
        weatherBlock.appendChild(dateBlock);

        const temperatureBlock = document.createElement("div")
        temperatureBlock.className = "weather-temperature";
        temperatureBlock.innerHTML = `${temperature} &deg;C`;
        weatherBlock.appendChild(temperatureBlock);

        const temperatureFeelBlock = document.createElement("div")
        temperatureFeelBlock.className = "weather-temperature-feels-like";
        temperatureFeelBlock.innerHTML = `Odczuwalna: ${feelsLikeTemperature} &deg;C`;
        weatherBlock.appendChild(temperatureFeelBlock);

        const icon = document.createElement("img")
        icon.className = "weather-icon";
        icon.src= `https://openweathermap.org/img/wn/${iconName}@2x.png`
        weatherBlock.appendChild(icon);

        const descriptionBlock = document.createElement("div")
        descriptionBlock.className = "weather-description";
        descriptionBlock.innerHTML = description;
        weatherBlock.appendChild(descriptionBlock);

        return weatherBlock;
    }
}


document.weatherApp = new WeatherApp("7ded80d91f2b280ec979100cc8bbba94", "#weather-results-container");

document.querySelector("#checkButton").addEventListener("click", function() {
    const query = document.querySelector("#locationInput").value;
    document.weatherApp.getWeather(query);
});