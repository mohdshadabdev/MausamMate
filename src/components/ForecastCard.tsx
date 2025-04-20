import React from 'react';
import { 
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog
} from 'lucide-react';
import { DailyForecast } from '../types/weather';
import { formatTemperature, formatDate, getWeatherIcon } from '../utils/weatherUtils';

interface ForecastCardProps {
  forecast: DailyForecast;
  units: 'metric' | 'imperial';
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, units }) => {
  const WeatherIcon = () => {
    const iconName = getWeatherIcon(forecast.weather.id);
    const props = { size: 24, className: "text-white" };
    
    switch (iconName) {
      case 'sun': return <Sun {...props} />;
      case 'cloud': return <Cloud {...props} />;
      case 'cloud-sun': return <Cloud {...props} />;
      case 'cloud-rain': return <CloudRain {...props} />;
      case 'cloud-snow': return <CloudSnow {...props} />;
      case 'cloud-lightning': return <CloudLightning {...props} />;
      case 'cloud-drizzle': return <CloudDrizzle {...props} />;
      case 'cloud-fog': return <CloudFog {...props} />;
      default: return <Cloud {...props} />;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex flex-col items-center transition-all duration-300 hover:bg-white/15">
      <p className="text-sm font-medium mb-2">
        {formatDate(Date.parse(forecast.date) / 1000, { weekday: 'short' })}
      </p>
      <div className="my-2">
        <WeatherIcon />
      </div>
      <p className="text-xs capitalize mb-2">{forecast.weather.description}</p>
      <div className="flex justify-between w-full mt-1">
        <span className="text-sm font-bold">{formatTemperature(forecast.temp_max, units)}</span>
        <span className="text-sm text-white/70">{formatTemperature(forecast.temp_min, units)}</span>
      </div>
    </div>
  );
};

export default ForecastCard;