// Weather Types
export interface LocationData {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  description: string;
  icon: string;
  id: number;
  wind_speed: number;
  wind_deg: number;
  pressure: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  dt: number;
}

export interface DailyForecast {
  date: string;
  temp_min: number;
  temp_max: number;
  weather: {
    id: number;
    description: string;
    icon: string;
  };
  dt: number;
}

export interface Weather {
  location: {
    name: string;
    country: string;
  };
  current: CurrentWeather;
}

export interface Forecast {
  location: {
    name: string;
    country: string;
  };
  daily: DailyForecast[];
}

export type Units = 'metric' | 'imperial';