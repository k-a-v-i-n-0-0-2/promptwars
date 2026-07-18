import React from 'react';
import AIPredictionPanel from './AIPredictionPanel';
import { CloudRain, Thermometer, Wind } from 'lucide-react';

const WeatherIntelligence = ({ stadiumData }) => {
  const { environment } = stadiumData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
            <CloudRain className="text-sky-400" />
            Weather Intelligence
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-void/40 rounded-xl p-4 border border-white/5 text-center">
              <Thermometer size={24} className="text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{environment.temperature}°C</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Temp</p>
            </div>
            <div className="bg-void/40 rounded-xl p-4 border border-white/5 text-center">
              <CloudRain size={24} className="text-sky-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{environment.rainProbability}%</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Rain Prob</p>
            </div>
            <div className="bg-void/40 rounded-xl p-4 border border-white/5 text-center">
              <Wind size={24} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{environment.windSpeed}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Wind km/h</p>
            </div>
            <div className="bg-void/40 rounded-xl p-4 border border-white/5 text-center">
              <div className="w-6 h-6 rounded-full bg-yellow-400/20 text-yellow-400 mx-auto mb-2 flex items-center justify-center font-bold text-xs">UV</div>
              <p className="text-2xl font-bold text-white">{environment.uvIndex}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">UV Index</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <AIPredictionPanel domain="weather" stadiumData={stadiumData} title="Weather Impact Analysis" />
      </div>
    </div>
  );
};

export default WeatherIntelligence;
