'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix per i marker di default di Leaflet in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Coordinate delle regioni italiane
const italianRegionsCoordinates: Record<string, [number, number]> = {
  'Valle d\'Aosta': [45.7389, 7.4215],
  'Piemonte': [45.0732, 7.6808],
  'Liguria': [44.4125, 8.9328],
  'Lombardia': [45.4773, 9.1815],
  'Trentino-Alto Adige': [46.4983, 11.3548],
  'Veneto': [45.4299, 12.3397],
  'Friuli-Venezia Giulia': [46.0747, 13.2335],
  'Emilia-Romagna': [44.4949, 11.3426],
  'Toscana': [43.7711, 11.2486],
  'Marche': [43.6158, 13.5189],
  'Umbria': [43.1122, 12.3888],
  'Lazio': [41.8933, 12.4829],
  'Abruzzo': [42.3498, 13.3995],
  'Molise': [41.5607, 14.6749],
  'Campania': [40.8259, 14.8046],
  'Puglia': [40.6443, 16.6107],
  'Basilicata': [40.6443, 15.8061],
  'Calabria': [39.2279, 16.2134],
  'Sicilia': [37.5079, 14.0934],
  'Sardegna': [39.2171, 9.1097]
};

interface InteractiveMapProps {
  selectedRegion: string;
  onRegionSelect: (region: string) => void;
  italianRegions: Array<{
    name: string;
    emoji: string;
    population: string;
    petitions: number;
    signatures: number;
    capital: string;
    provinces: string[];
  }>;
}

// Componente per gestire click sulla mappa
function MapEvents({ onRegionSelect }: { onRegionSelect: (region: string) => void }) {
  useMapEvents({
    click: (e) => {
      console.log('Cliccato sulla mappa:', e.latlng);
    },
  });
  return null;
}

export default function InteractiveMap({ selectedRegion, onRegionSelect, italianRegions }: InteractiveMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Caricamento mappa...</div>
      </div>
    );
  }

  // Crea icone personalizzate per le regioni
  const createCustomIcon = (emoji: string, isSelected: boolean) => {
    return L.divIcon({
      html: `
        <div style="
          background: ${isSelected ? '#3B82F6' : '#ffffff'};
          border: 3px solid ${isSelected ? '#1D4ED8' : '#64748B'};
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: all 0.2s ease;
        ">
          ${emoji}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
      className: 'custom-region-icon'
    });
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border-2 border-blue-100 relative z-0">
      <MapContainer
        center={[42.8719, 12.5674]} // Centro dell'Italia
        zoom={6}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapEvents onRegionSelect={onRegionSelect} />

        {italianRegions.map((region) => {
          const coordinates = italianRegionsCoordinates[region.name];
          if (!coordinates) return null;

          return (
            <Marker
              key={region.name}
              position={coordinates}
              icon={createCustomIcon(region.emoji, region.name === selectedRegion)}
              eventHandlers={{
                click: () => {
                  onRegionSelect(region.name);
                }
              }}
            >
              <Popup>
                <div className="p-2 min-w-48">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{region.emoji}</span>
                    <h3 className="font-bold text-gray-900">{region.name}</h3>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>👥</strong> {region.population} abitanti</p>
                    <p><strong>🏛️</strong> Capoluogo: {region.capital}</p>
                    <p><strong>📋</strong> {region.petitions} petizioni attive</p>
                    <p><strong>✍️</strong> {region.signatures.toLocaleString('it-IT')} firme raccolte</p>
                    <p><strong>📍</strong> {region.provinces.length} province</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <div className="flex flex-wrap gap-1">
                      {region.provinces.slice(0, 3).map((province, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {province}
                        </span>
                      ))}
                      {region.provinces.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          +{region.provinces.length - 3} altre
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}