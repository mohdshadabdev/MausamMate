import { WeatherCondition } from '../types/weather';

export function formatTemperature(temp: number, units: 'metric' | 'imperial'): string {
  const roundedTemp = Math.round(temp);
  return `${roundedTemp}°${units === 'metric' ? 'C' : 'F'}`;
}

export function formatDate(timestamp: number, options: Intl.DateTimeFormatOptions = {}): string {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...options
  }).format(date);
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

export function getWeatherBackground(weatherId: number, isDay: boolean): string {
  // Weather condition codes from OpenWeatherMap API
  // https://openweathermap.org/weather-conditions
  
  // Clear sky
  if (weatherId === 800) {
    return isDay 
      ? 'from-blue-400 to-blue-600'
      : 'from-navy-800 to-indigo-900';
  }
  
  // Few clouds, scattered clouds
  if (weatherId >= 801 && weatherId <= 802) {
    return isDay 
      ? 'from-blue-300 to-blue-500'
      : 'from-gray-800 to-indigo-900';
  }
  
  // Broken clouds, overcast
  if (weatherId >= 803 && weatherId <= 804) {
    return isDay 
      ? 'from-gray-300 to-blue-400'
      : 'from-gray-700 to-gray-900';
  }
  
  // Rain, drizzle
  if ((weatherId >= 300 && weatherId <= 321) || (weatherId >= 500 && weatherId <= 531)) {
    return isDay 
      ? 'from-gray-400 to-blue-500'
      : 'from-gray-700 to-blue-900';
  }
  
  // Thunderstorm
  if (weatherId >= 200 && weatherId <= 232) {
    return isDay 
      ? 'from-gray-600 to-purple-700'
      : 'from-gray-800 to-purple-900';
  }
  
  // Snow
  if (weatherId >= 600 && weatherId <= 622) {
    return isDay 
      ? 'from-gray-200 to-blue-300'
      : 'from-gray-600 to-blue-800';
  }
  
  // Atmosphere (fog, mist, etc.)
  if (weatherId >= 700 && weatherId <= 781) {
    return isDay 
      ? 'from-gray-300 to-gray-500'
      : 'from-gray-700 to-gray-900';
  }
  
  // Default
  return isDay 
    ? 'from-blue-400 to-blue-600'
    : 'from-gray-800 to-indigo-900';
}

export function isDaytime(sunrise: number, sunset: number, current: number): boolean {
  return current >= sunrise && current <= sunset;
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function getWeatherIcon(condition: number): string {
  // Map OpenWeatherMap condition codes to Lucide icon names
  // Full list of condition codes: https://openweathermap.org/weather-conditions
  
  // Thunderstorm
  if (condition >= 200 && condition < 300) {
    return 'cloud-lightning';
  }
  
  // Drizzle
  if (condition >= 300 && condition < 400) {
    return 'cloud-drizzle';
  }
  
  // Rain
  if (condition >= 500 && condition < 600) {
    return 'cloud-rain';
  }
  
  // Snow
  if (condition >= 600 && condition < 700) {
    return 'cloud-snow';
  }
  
  // Atmosphere (fog, mist, etc.)
  if (condition >= 700 && condition < 800) {
    return 'cloud-fog';
  }
  
  // Clear
  if (condition === 800) {
    return 'sun';
  }
  
  // Clouds
  if (condition > 800) {
    if (condition === 801) return 'cloud-sun';
    if (condition === 802) return 'cloud';
    return 'clouds';
  }
  
  // Default
  return 'cloud';
}

export function visibilityToText(visibility: number): string {
  const visibilityKm = visibility / 1000;
  
  if (visibilityKm < 1) {
    return 'Poor';
  } else if (visibilityKm < 4) {
    return 'Moderate';
  } else if (visibilityKm < 10) {
    return 'Good';
  } else {
    return 'Excellent';
  }
}