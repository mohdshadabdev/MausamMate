import React from 'react';
import { CloudRain } from 'lucide-react';

const WeatherLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-bounce mb-4">
        <CloudRain size={48} className="text-white" />
      </div>
      <h2 className="text-2xl font-semibold text-white mb-2">Loading Weather</h2>
      <p className="text-white/70">Fetching the latest forecast data...</p>
    </div>
  );
};

export default WeatherLoader;