import { Weather, Forecast, LocationData } from '../types/weather';

const API_KEY = '4accce1552e0dccdc3908c5b33f5e325'; // This is a demo key - in production use environment variables
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export async function getCurrentWeather(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric'): Promise<Weather> {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to fetch current weather data: ${response.status} ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    return {
      location: {
        name: data.name,
        country: data.sys.country,
        lat,
        lon,
      },
      current: {
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        id: data.weather[0].id,
        wind_speed: data.wind.speed,
        wind_deg: data.wind.deg,
        pressure: data.main.pressure,
        visibility: data.visibility,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        dt: data.dt,
      }
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
}

export async function getForecast(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric'): Promise<Forecast> {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to fetch forecast data: ${response.status} ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Process the forecast data to get daily forecasts
    const dailyForecasts = processDailyForecasts(data.list);
    
    return {
      location: {
        name: data.city.name,
        country: data.city.country,
        lat,
        lon,
      },
      daily: dailyForecasts
    };
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
}

export async function searchLocation(query: string): Promise<LocationData[]> {
  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to search location: ${response.status} ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon
    }));
  } catch (error) {
    console.error('Error searching location:', error);
    throw error;
  }
}

// Helper function to process forecast data into daily forecasts
function processDailyForecasts(forecastList: any[]) {
  const dailyData: Record<string, any[]> = {};
  
  // Group forecast data by day
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    
    dailyData[date].push(item);
  });
  
  // Process each day's data to get min/max temps and most common weather condition
  return Object.entries(dailyData).map(([date, items]) => {
    const temps = items.map(item => item.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    
    // Get the most common weather condition for the day
    const weatherCounts: Record<string, number> = {};
    items.forEach(item => {
      const weatherId = item.weather[0].id;
      weatherCounts[weatherId] = (weatherCounts[weatherId] || 0) + 1;
    });
    
    const mostCommonWeatherId = Object.entries(weatherCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    const midDayItem = items.find(item => {
      const hour = new Date(item.dt * 1000).getHours();
      return hour >= 12 && hour <= 15;
    }) || items[0];
    
    return {
      date,
      temp_min: minTemp,
      temp_max: maxTemp,
      weather: {
        id: parseInt(mostCommonWeatherId),
        description: midDayItem.weather[0].description,
        icon: midDayItem.weather[0].icon
      },
      dt: items[0].dt
    };
  }).slice(0, 5); // Limit to 5 days
}

export async function getLocationByCoords(lat: number, lon: number): Promise<LocationData> {
  try {
    const response = await fetch(
      `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to get location by coordinates: ${response.status} ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error('Location not found for provided coordinates');
    }
    
    return {
      name: data[0].name,
      country: data[0].country,
      state: data[0].state,
      lat: data[0].lat,
      lon: data[0].lon
    };
  } catch (error) {
    console.error('Error getting location by coordinates:', error);
    throw error;
  }
}