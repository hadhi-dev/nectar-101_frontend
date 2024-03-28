import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface Props {
  markedloc: { lat: number; lng: number } | null;
  sendData: (lat: number, lng: number) => void;
}

const MapComponent: React.FC<Props> = ({ markedloc, sendData }) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [newPlace, setNewPlace] = useState({
    lat: 0,
    long: 0,
  });

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWJkdWxoYWRoaSIsImEiOiJjbHVhanpvc2Ywa3E4Mml0NWNqM3ZmZmN1In0.IIRx4xkxI1DYKZn-f9vJTA';

    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/abdulhadhi/cluaklpzc00vx01pr7oo3ag6g',
        center: [76.961632, 11.004556],
        zoom: 10
      });

      mapInstance.on('load', () => {
        setMap(mapInstance);
      });
    };

    if (!map) {
      initializeMap();
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map]);

  const handleMapClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (sendData && map) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const lngLat = map.unproject([x, y]);
      sendData(lngLat.lat, lngLat.lng);
    }
  };

  useEffect(() => {
    if (map && markedloc) {
      map.flyTo({ center: [markedloc.lng, markedloc.lat], zoom: 10 });
    }
  }, [ markedloc]);

  return <div id="map-container" style={{ width: '100%', height: '40vh' }} onClick={handleMapClick} />;
};

export default MapComponent;
