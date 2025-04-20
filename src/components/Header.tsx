import React from 'react';
import { MapPin, Calendar, Thermometer } from 'lucide-react';
import { formatDate } from '../utils/weatherUtils';

interface HeaderProps {
  locationName: string;
  country: string;
  timestamp: number;
  toggleUnits: () => void;
  units: 'metric' | 'imperial';
}

const Header: React.FC<HeaderProps> = ({ 
  locationName, 
  country, 
  timestamp, 
  toggleUnits,
  units
}) => {
  return (
    <header className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <div className="flex items-center">
          <MapPin size={20} className="text-white mr-2" />
          <h1 className="text-2xl font-bold text-white">
            {locationName}, {country}
          </h1>
        </div>
        <div className="flex items-center mt-2 text-white/80">
          <Calendar size={16} className="mr-2" />
          <span>{formatDate(timestamp, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
      
      <button 
        onClick={toggleUnits}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
      >
        <Thermometer size={16} className="text-white" />
        <span className="text-white font-medium">
          {units === 'metric' ? '°C' : '°F'}
        </span>
      </button>
    </header>
  );
};

export default Header;