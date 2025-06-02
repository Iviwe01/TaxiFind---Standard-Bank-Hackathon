document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'bfa1e29f8a5262dc23edf2d10e1e8c80';
    const temperatureElement = document.getElementById('temperature');
    const humidityElement = document.getElementById('humidity');
    const weatherStatusElement = document.getElementById('weather-status');

    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                temperatureElement.textContent = `Temperature: ${data.main.temp}°C`;
                humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
                weatherStatusElement.textContent = `Weather: ${data.weather[0].description}`;
            })
            .catch(error => {
                temperatureElement.textContent = 'Failed to fetch weather data';
                humidityElement.textContent = '';
                weatherStatusElement.textContent = '';
            });
    });
});

