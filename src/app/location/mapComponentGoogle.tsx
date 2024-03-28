import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface Props {
  markedloc: { lat: number; lng: number } | null;
  sendData: (lat: number, lng: number) => void;
}

const containerStyle = {
  width: '100%',
  height: '40vh'
};

const center = {
  lat: 11.004556,
  lng: 76.961632
};

const defaultZoom = 16;

const MapComponent: React.FC<Props> = ({ markedloc, sendData }) => {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey as string
  });

  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (markedloc && markedloc.lat > 0) {
      setMarkers([markedloc]);
    } else {
      setMarkers([{ lat: 13.067439, lng: 80.237617 }]);
    }
  }, [markedloc]);

  const onLoad = useCallback(function callback(map: any) {
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach(marker => bounds.extend(marker));
    map.fitBounds(bounds);
    setMap(map);
  }, [markers]);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  const handleMapClick = (event: any) => {
    const newMarker = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setMarkers([newMarker]);
    sendData(newMarker.lat, newMarker.lng);
  };

  const handleMarkerDragEnd = (event: any) => {
    const newMarker = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setMarkers([newMarker]);
    sendData(newMarker.lat, newMarker.lng);
  };

  return (
    <div className="w-full">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={(e) => handleMapClick(e)}
          center={markers.length > 0 ? markers[0] : center}
          zoom={markers.length > 0 ? defaultZoom : 10}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker}
              draggable={true}
              onDragEnd={(e) => handleMarkerDragEnd(e)}
            />
          ))}
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default MapComponent;
