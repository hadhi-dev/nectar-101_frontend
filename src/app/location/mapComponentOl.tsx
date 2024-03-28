import React, { useState, useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Modify } from 'ol/interaction';
import { Icon, Style } from 'ol/style';

interface Props {
  markedloc: { lat: number; lng: number } | null;
  sendData: (lat: number, lng: number) => void;
}

const OpenLayersMapComponent: React.FC<Props> = ({ markedloc, sendData }) => {
  const center = fromLonLat([76.961632, 11.004556]);
  const defaultZoom = 16;
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    const initialMap = new Map({
      target: 'openlayers-map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center,
        zoom: defaultZoom,
      }),
    });

    // Add draggable marker
    const markerLayer = new VectorLayer({
      source: new VectorSource({
        features: [new Feature({
          geometry: new Point(center),
        })],
      }),
      style: new Style({
        image: new Icon({
          src: 'https://openlayers.org/en/latest/examples/data/icon.png',
          size: [32, 32],
          anchor: [0.5, 1],
        }),
      }),
    });
    initialMap.addLayer(markerLayer);

    // Make marker draggable
    const source = markerLayer.getSource();
    if (source) {
      const modify = new Modify({ source });
      initialMap.addInteraction(modify);

      // Send data on marker drag end
      modify.on('modifyend', (event) => {
        const feature = event.features.getArray()[0];
        const geometry = feature?.getGeometry();
      
        if (geometry instanceof Point) {
          const coordinates = geometry.getCoordinates();
          const [lng, lat] = coordinates;
          sendData(lat, lng);
        }
      });
    }

    setMap(initialMap);

    return () => {
      if (initialMap) {
        initialMap.dispose();
      }
    };
  }, []);

  return <div id="openlayers-map" style={{ width: '100%', height: '60vh' }} />;
};

export default OpenLayersMapComponent;
