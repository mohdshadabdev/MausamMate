import React from 'react';
import { 
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, Thermometer, Droplets, Wind, Gauge
} from 'lucide-react';
import { CurrentWeather } from '../types/weather';
import { formatTemperature, formatTime, getWeatherIcon } from '../utils/weatherUtils';

interface WeatherCardProps {
  currentWeather: CurrentWeather;
  units: 'metric' | 'imperial';
}

const WeatherCard: React.FC<WeatherCardProps> = ({ currentWeather, units }) => {
  const WeatherIcon = () => {
    const iconName = getWeatherIcon(currentWeather.id);
    const props = { size: 48, className: "text-white" };
    
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
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full shadow-lg text-white transition-all duration-300 hover:bg-white/15">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-4xl font-bold">
            {formatTemperature(currentWeather.temp, units)}
          </h2>
          <p className="text-lg capitalize">{currentWeather.description}</p>
        </div>
        <div className="flex items-center">
          <WeatherIcon />
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="flex flex-col items-center p-3 bg-white/10 rounded-lg">
          <Thermometer size={20} className="mb-1" />
          <p className="text-sm">Feels Like</p>
          <p className="font-semibold">{formatTemperature(currentWeather.feels_like, units)}</p>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-white/10 rounded-lg">
          <Droplets size={20} className="mb-1" />
          <p className="text-sm">Humidity</p>
          <p className="font-semibold">{currentWeather.humidity}%</p>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-white/10 rounded-lg">
          <Wind size={20} className="mb-1" />
          <p className="text-sm">Wind</p>
          <p className="font-semibold">
            {currentWeather.wind_speed} {units === 'metric' ? 'm/s' : 'mph'}
          </p>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-white/10 rounded-lg">
          <Gauge size={20} className="mb-1" />
          <p className="text-sm">Pressure</p>
          <p className="font-semibold">{currentWeather.pressure} hPa</p>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between text-sm">
        <div>
          <p className="text-white/80">Sunrise</p>
          <p className="font-medium">{formatTime(currentWeather.sunrise)}</p>
        </div>
        <div>
          <p className="text-white/80">Sunset</p>
          <p className="font-medium">{formatTime(currentWeather.sunset)}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;