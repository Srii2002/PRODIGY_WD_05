import React, { useState, useEffect } from 'react';
import './WeatherApp.css';
import search_icon from "../Assets/search.png";
import clear_icon from "../Assets/clear.png";
import cloud_icon from "../Assets/cloud.png";
import drizzle_icon from "../Assets/drizzle.png";
import rain_icon from "../Assets/rain.png";
import snow_icon from "../Assets/snow.png";
import wind_icon from "../Assets/wind.png";
import humidity_icon from "../Assets/humidity.png";
import clearBg from "../Assets/clear-bg.jpg";
import cloudBg from "../Assets/cloud-bg.jpg";
import drizzleBg from "../Assets/drizzle-bg.jpeg";
import rainBg from "../Assets/rain-bg.jpeg";
import snowBg from "../Assets/snow-bg.jpeg";

const WeatherApp = () => {
  const api_key = "fa169df5d9ab8cf1548f8abe18da9e3e";
  const [wicon, setWicon] = useState(cloud_icon);
  const [backgroundImage, setBackgroundImage] = useState(cloudBg);
  const [error, setError] = useState(null);
  const [showWeatherData, setShowWeatherData] = useState(true);

  const searchByCity = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=${api_key}`;
    const response = await fetch(url);
    return response.json();
  };

  const searchByCoordinates = async (coords) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=Metric&appid=${api_key}`;
    const response = await fetch(url);
    return response.json();
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await searchByCoordinates({ latitude, longitude });
          updateWeather(data);
        });
      } catch (error) {
        setError("Error fetching location");
        setShowWeatherData(false);
        setBackgroundImage("white"); 
      }
    };

    fetchWeather();
  }, []);

  const updateWeather = (data) => {
    if (data.cod === "404") {
      setError("City not found");
      setShowWeatherData(false);
      setBackgroundImage("white"); 
      return;
    }

    setError(null);
    setShowWeatherData(true);

    const humidity = document.getElementsByClassName("humidity-percent")[0];
    const wind = document.getElementsByClassName("wind-rate")[0];
    const temperature = document.getElementsByClassName("weather-temp")[0];
    const location = document.getElementsByClassName("weather-location")[0];

    if (humidity) humidity.innerHTML = data.main.humidity + "%";
    if (wind) wind.innerHTML = data.wind.speed + "km/hr";
    if (temperature) temperature.innerHTML = data.main.temp + "°C";
    if (location) location.innerHTML = data.name;

    if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
      setWicon(clear_icon);
      setBackgroundImage(clearBg);
    } else if (data.weather[0].icon === "02d" || data.weather[0].icon === "02n") {
      setWicon(cloud_icon);
      setBackgroundImage(cloudBg);
    } else if (data.weather[0].icon === "03d" || data.weather[0].icon === "03n") {
      setWicon(drizzle_icon);
      setBackgroundImage(drizzleBg);
    } else if (data.weather[0].icon === "04d" || data.weather[0].icon === "04n") {
      setWicon(rain_icon);
      setBackgroundImage(rainBg);
    } else if (data.weather[0].icon === "09d" || data.weather[0].icon === "09n") {
      setWicon(snow_icon);
      setBackgroundImage(snowBg);
    } else if (data.weather[0].icon === "10d" || data.weather[0].icon === "10n") {
      setWicon(rain_icon);
      setBackgroundImage(rainBg);
    } else if (data.weather[0].icon === "13d" || data.weather[0].icon === "13n") {
      setWicon(snow_icon);
      setBackgroundImage(snowBg);
    } else {
      setWicon(cloud_icon);
      setBackgroundImage(cloudBg);
    }
  };

  const search = async () => {
    const cityInput = document.getElementsByClassName("cityInput");
    if (cityInput.length === 0 || cityInput[0].value === "") {
      return 0;
    }

    const data = await searchByCity(cityInput[0].value);
    updateWeather(data);
  };

  return (
    <div
      className='outer-container'
      style={{
        backgroundImage: `url(${backgroundImage === "white" ? "none" : backgroundImage})`,
        backgroundColor: backgroundImage === "white" ? "white" : "transparent",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className='container'>
        <div className='top-bar'>
          <input type="text" className="cityInput" placeholder='search' />
          <div className='search_icon' onClick={search}>
            <img src={search_icon} alt="" />
          </div>
        </div>
        {error && (
          <div className="error-message">
            <b style={{ fontSize: '3rem', color: 'red', textAlign: 'center' }}>{error}</b>
          </div>
        )}
        {showWeatherData && (
          <>
            <div className="weather-image">
              <img src={wicon} alt="" />
            </div>
            <div className="weather-temp">24°C</div>
            <div className="weather-location">Chennai</div>
            <div className="data-container">
              <div className="element">
                <img src={humidity_icon} alt="" className='icon'/>
                <div className="data">
                  <div className="humidity-percent">50%</div>
                  <div className="text">Humidity</div>
                </div>
              </div>
              <div className="element">
                <img src={wind_icon} alt="" className='icon'/>
                <div className="data">
                  <div className="wind-rate">18km/hr</div>
                  <div className="text">Wind Speed</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
