import React from 'react';
import { Droplets, Eye, Wind, Gauge, Thermometer } from 'lucide-react';
import { CurrentWeather } from '../types/weather';
import { getWindDirection, visibilityToText } from '../utils/weatherUtils';

interface WeatherDetailsProps {
  currentWeather: CurrentWeather;
  units: 'metric' | 'imperial';
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ currentWeather, units }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full shadow-lg text-white">
      <h3 className="text-xl font-semibold mb-4">Weather Details</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg">
          <div className="p-2 bg-white/10 rounded-full">
            <Thermometer size={20} />
          </div>
          <div>
            <p className="text-sm text-white/70">Min / Max</p>
            <p className="font-medium">
              {Math.round(currentWeather.temp_min)}° / {Math.round(currentWeather.temp_max)}°
              {units === 'metric' ? 'C' : 'F'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg">
          <div className="p-2 bg-white/10 rounded-full">
            <Droplets size={20} />
          </div>
          <div>
            <p className="text-sm text-white/70">Humidity</p>
            <p className="font-medium">{currentWeather.humidity}%</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg">
          <div className="p-2 bg-white/10 rounded-full">
            <Wind size={20} />
          </div>
          <div>
            <p className="text-sm text-white/70">Wind</p>
            <p className="font-medium">
              {currentWeather.wind_speed} {units === 'metric' ? 'm/s' : 'mph'} 
              <span className="text-white/70 ml-1">
                {getWindDirection(currentWeather.wind_deg)}
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg">
          <div className="p-2 bg-white/10 rounded-full">
            <Gauge size={20} />
          </div>
          <div>
            <p className="text-sm text-white/70">Pressure</p>
            <p className="font-medium">{currentWeather.pressure} hPa</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg">
          <div className="p-2 bg-white/10 rounded-full">
            <Eye size={20} />
          </div>
          <div>
            <p className="text-sm text-white/70">Visibility</p>
            <p className="font-medium">
              {(currentWeather.visibility / 1000).toFixed(1)} km 
              <span className="text-white/70 ml-1">
                ({visibilityToText(currentWeather.visibility)})
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;