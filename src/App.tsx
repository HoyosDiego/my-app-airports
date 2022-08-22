import { Map, Marker } from 'mapbox-gl';
import React, { useLayoutEffect, useRef, useState } from 'react';
import './App.css';
import Select from "react-select";
import { useGetAirport } from './hooks/useGetAirport';


let c1 = -76.5506502
let c2 = 3.2612939

function App() {
  const { airportList } = useGetAirport();
  const mapDiv = useRef<HTMLDivElement>(null);
  const [coords1, setCoords1] = useState<any>();
  const [coords2, setCoords2] = useState<any>();
  const [millasNauticas, setMilalsNauticas] = useState<any>();
  const [showMap, setShowMmap] = useState(false)

  useLayoutEffect(() => {
    if (coords1) {
      c1 = coords1.longitude
      c2 = coords1.latitude
    }
    if (showMap) {
      const map = new Map({
        container: mapDiv.current!, // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [c1, c2], // starting position [lng, lat]
        zoom: 10, // starting zoom
      });

      new Marker({
        color: '#61DAFB'
      })
        .setLngLat(map.getCenter())
        .addTo(map)
    }

  }, [showMap, coords1])



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

    return Kilometers * valueMilla; // in miles
  }

  function handleChange(e: any, op: number) {
    setShowMmap(true);
    op === 1 ? setCoords1(e) : setCoords2(e)

  }

  return (
    <div className='container'
    >
      {showMap && (<div ref={mapDiv}
        className='map'>
      </div>)}
      <div className='distance'>
        <div className='showMapContainer' onClick={() => !showMap ? setShowMmap(true) : setShowMmap(false)}>{!showMap ? "Show Map" : "Hide Map"}</div>
        {airportList ? <div className="select-container">
          <Select
            options={airportList}
            onChange={(v1) => {
              handleChange(v1, 1)
            }}
            getOptionLabel={(option) => `${option.name} `}
            getOptionValue={(option) => `${option.name} - ${option.iata}`}
          />
          <div style={{ height: 30 }} />
          <Select
            isSearchable={true}
            options={airportList}
            onChange={(v2, a) => {
              handleChange(v2, 2)
            }}
            getOptionLabel={(option) => `${option.name} `}
            getOptionValue={(option) => `${option.name} - ${option.iata}`}
          />
        </div>
          : <div>
            <h1>Loading</h1>
          </div>
        }
        <div className='distanceBtn' onClick={() => haversine({ lat: coords1.latitude, lon: coords1.longitude }, { lat: coords2.latitude, lon: coords2.longitude })}>Distance</div>
        {millasNauticas && (<div>The distance between {coords1.label} and {coords2.label} is {millasNauticas} nautical miles</div>)}

      </div>

    </div>
  );
}

export default App;
