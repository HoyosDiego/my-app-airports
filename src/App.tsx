import { Map } from 'mapbox-gl';
import React, { useLayoutEffect, useRef, useState } from 'react';
import './App.css';
import locations from './locations.json';
import Select from "react-select";
import { dogOptions } from "./data";

const options = dogOptions;

function App() {

  const mapDiv = useRef<HTMLDivElement>(null);
  const [showMap, setShowMmap] = useState(false)
  const [options1, setOption1] = useState(options);
  const [options2, setOption2] = useState(options);
  const [coords1, setCoords1] = useState<any>();
  const [coords2, setCoords2] = useState<any>();
  const [millasNauticas, setMilalsNauticas] = useState<any>();

  useLayoutEffect(() => {
    console.log('entra en layout ', locations)
    if (showMap) {
      const map = new Map({
        container: mapDiv.current!, // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [-76.5506502, 3.2612939], // starting position [lng, lat]
        zoom: 14, // starting zoom
      });
    }
  }, [showMap])



  function haversine(coords1: any, coords2: any) {
    const R = 6371e3; // metres
    const φ1 = coords1.lat * Math.PI / 180; // φ, λ in radians
    const φ2 = coords2.lat * Math.PI / 180;
    const Δφ = (coords2.lat - coords1.lat) * Math.PI / 180;
    const Δλ = (coords2.lon - coords1.lon) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const Kilometers = R * c;
    const valueMilla = 0.539957;
    const MillaNautica = Kilometers * valueMilla;
    setMilalsNauticas(MillaNautica.toFixed(0))

    return Kilometers * valueMilla; // in metres
  }

  function handleChange(e: any, op: number) {
    setShowMmap(true);
    op === 1 ? setCoords1(e) : setCoords2(e)

  }

  return (
    <div className='container'
    >
      {showMap && (<div ref={mapDiv}
        className='map' col-10>
      </div>)}
      <div className='distance' col-2>
        <button onClick={() => !showMap ? setShowMmap(true) : setShowMmap(false)}>{!showMap ? "Show Map" : "Hide Map"}</button>
        <div className="select-container">
          <Select
            options={options1}
            onChange={(v1) => {
              handleChange(v1, 1)
            }}
          />
          <div style={{ height: 30 }} />
          <Select
            options={options2}
            onChange={(v2, a) => {
              handleChange(v2, 2)
            }}
          />
        </div>
        <button onClick={() => haversine({ lat: coords1.lat, lon: coords1.lng }, { lat: coords2.lat, lon: coords2.lng })}>Distancia</button>
        {millasNauticas && (<div>La distancia entre {coords1.label} Y {coords2.label} son {millasNauticas} Millas Nauticas</div>)}
      </div>

    </div>
  );
}

export default App;
