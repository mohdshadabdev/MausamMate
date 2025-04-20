import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { LocationData } from '../types/weather';
import { searchLocation } from '../api/weatherService';

interface SearchBarProps {
  onLocationSelect: (location: LocationData) => void;
  onUseCurrentLocation: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect, onUseCurrentLocation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsSearching(true);
        try {
          const locations = await searchLocation(query);
          setResults(locations);
          setIsDropdownOpen(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setIsDropdownOpen(false);
      }
    }, 500);
    
    return () => clearTimeout(searchTimer);
  }, [query]);
  
  const handleSelectLocation = (location: LocationData) => {
    onLocationSelect(location);
    setQuery('');
    setIsDropdownOpen(false);
  };
  
  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-white/70" />
        </div>
        <input
          type="text"
          className="w-full p-3 pl-10 pr-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setIsDropdownOpen(true)}
        />
        <button
          onClick={onUseCurrentLocation}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-white/10 transition-colors"
          title="Use current location"
        >
          <MapPin size={18} className="text-white" />
        </button>
      </div>
      
      {isDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border border-white/10 shadow-lg overflow-hidden max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-white/70">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((location, index) => (
                <li 
                  key={`${location.name}-${location.lat}-${location.lon}`}
                  className="border-b border-white/10 last:border-b-0"
                >
                  <button
                    className="w-full text-left p-3 hover:bg-white/10 transition-colors text-white"
                    onClick={() => handleSelectLocation(location)}
                  >
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-white/70">
                      {location.state ? `${location.state}, ` : ''}{location.country}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length > 2 ? (
            <div className="p-4 text-center text-white/70">
              No locations found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;