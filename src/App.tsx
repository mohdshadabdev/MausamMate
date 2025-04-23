import React, { useState, useEffect } from 'react';
import { getCurrentWeather, getForecast, getLocationByCoords } from './api/weatherService';
import { LocationData, Weather, Forecast, Units } from './types/weather';
import { getWeatherBackground, isDaytime } from './utils/weatherUtils';

// Components
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import WeatherDetails from './components/WeatherDetails';
import ForecastCard from './components/ForecastCard';
import WeatherLoader from './components/WeatherLoader';
import ErrorDisplay from './components/ErrorDisplay';
import { CloudRain } from 'lucide-react';

const backgroundImages = {
  clear: {
    day: "https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg",
    night: "https://images.pexels.com/photos/2469122/pexels-photo-2469122.jpeg"
  },
  clouds: {
    day: "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg",
    night: "https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg"
  },
  rain: {
    day: "https://images.pexels.com/photos/1463530/pexels-photo-1463530.jpeg",
    night: "https://images.pexels.com/photos/110874/pexels-photo-110874.jpeg"
  },
  snow: {
    day: "https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg",
    night: "https://images.pexels.com/photos/773594/pexels-photo-773594.jpeg"
  },
  default: {
    day: "https://images.pexels.com/photos/1054289/pexels-photo-1054289.jpeg",
    night: "https://images.pexels.com/photos/3389613/pexels-photo-3389613.jpeg"
  }
};

function App() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<Units>('metric');
  const [background, setBackground] = useState<string>('from-blue-600 to-blue-800');
  const [backgroundImage, setBackgroundImage] = useState<string>(backgroundImages.default.day);

  const getBackgroundImage = (weatherId: number, isDay: boolean) => {
    if (weatherId === 800) {
      return isDay ? backgroundImages.clear.day : backgroundImages.clear.night;
    } else if (weatherId >= 801 && weatherId <= 804) {
      return isDay ? backgroundImages.clouds.day : backgroundImages.clouds.night;
    } else if ((weatherId >= 300 && weatherId <= 321) || (weatherId >= 500 && weatherId <= 531)) {
      return isDay ? backgroundImages.rain.day : backgroundImages.rain.night;
    } else if (weatherId >= 600 && weatherId <= 622) {
      return isDay ? backgroundImages.snow.day : backgroundImages.snow.night;
    }
    return isDay ? backgroundImages.default.day : backgroundImages.default.night;
  };

  const getWeatherEffect = (weatherId: number) => {
    if ((weatherId >= 300 && weatherId <= 321) || (weatherId >= 500 && weatherId <= 531)) {
      return <div className="rain" />;
    } else if (weatherId >= 600 && weatherId <= 622) {
      return <div className="snow" />;
    }
    return null;
  };

  // Load weather data for a specific location
  const loadWeatherData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(lat, lon, units),
        getForecast(lat, lon, units)
      ]);
      
      setWeather(weatherData);
      setForecast(forecastData);
      
      const isDay = isDaytime(
        weatherData.current.sunrise,
        weatherData.current.sunset,
        weatherData.current.dt
      );
      setBackground(getWeatherBackground(weatherData.current.id, isDay));
      setBackgroundImage(getBackgroundImage(weatherData.current.id, isDay));
      
    } catch (error) {
      console.error('Failed to load weather data:', error);
      setError(`Failed to load weather data. ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle location selection
  const handleLocationSelect = (location: LocationData) => {
    loadWeatherData(location.lat, location.lon);
  };
  
  // Get user's current location
  const handleGetCurrentLocation = () => {
    setLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const locationData = await getLocationByCoords(latitude, longitude);
            handleLocationSelect(locationData);
          } catch (error) {
            console.error('Error getting location:', error);
            loadWeatherData(latitude, longitude);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Unable to get your location. ';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please allow location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'The request to get your location timed out.';
              break;
            default:
              errorMessage += 'Please search for a city.';
          }
          
          setError(errorMessage);
          setLoading(false);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000,
          maximumAge: 0 
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please search for a city.');
      setLoading(false);
    }
  };
  
  // Toggle temperature units
  const toggleUnits = () => {
    const newUnits = units === 'metric' ? 'imperial' : 'metric';
    setUnits(newUnits);
    
    if (weather) {
      loadWeatherData(weather.location.lat || 0, weather.location.lon || 0);
    }
  };
  
  // Load default location on first render
  useEffect(() => {
    handleGetCurrentLocation();
    
    const timeoutId = setTimeout(() => {
      if (loading && !weather) {
        const defaultLocation: LocationData = {
          name: 'New York',
          country: 'US',
          lat: 40.7128,
          lon: -74.0060,
          state: 'New York'
        };
        loadWeatherData(defaultLocation.lat, defaultLocation.lon);
      }
    }, 10000);
    
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Update document title with location
  useEffect(() => {
    if (weather) {
      document.title = `MausamNama | ${weather.location.name}`;
    } else {
      document.title = 'MausamNama';
    }
  }, [weather]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="weather-bg"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      {weather && getWeatherEffect(weather.current.id)}
      <div className={`min-h-screen bg-gradient-to-br ${background} bg-opacity-50 transition-colors duration-1000 ease-in-out relative z-10`}>
        <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col content-wrapper">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center">
              <CloudRain size={32} className="text-white mr-2" />
              <h1 className="text-3xl font-bold text-white">MausamNama</h1>
            </div>
            <SearchBar
              onLocationSelect={handleLocationSelect}
              onUseCurrentLocation={handleGetCurrentLocation}
            />
          </div>
          
          {loading ? (
            <div className="flex-grow flex items-center justify-center">
              <WeatherLoader />
            </div>
          ) : error ? (
            <div className="flex-grow flex items-center justify-center">
              <ErrorDisplay
                message={error}
                onRetry={handleGetCurrentLocation}
              />
            </div>
          ) : weather && forecast ? (
            <div className="flex-grow flex flex-col gap-8">
              <Header
                locationName={weather.location.name}
                country={weather.location.country}
                timestamp={weather.current.dt}
                toggleUnits={toggleUnits}
                units={units}
              />
              
              <WeatherCard
                currentWeather={weather.current}
                units={units}
              />
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">5-Day Forecast</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {forecast.daily.map((day) => (
                    <ForecastCard
                      key={day.date}
                      forecast={day}
                      units={units}
                    />
                  ))}
                </div>
              </div>
              
              <WeatherDetails
                currentWeather={weather.current}
                units={units}
              />
            </div>
          ) : null}
          
          <footer className="mt-auto pt-8 pb-4 text-center text-white/60 text-sm">
            <p>© 2025 MausamNama - Weather data provided by OpenWeatherMap</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;