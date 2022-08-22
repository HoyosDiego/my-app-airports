import { useEffect, useState } from 'react';
import { LocationAirport } from '../interfaces/AirportInterface';

export const useGetAirport = () => {

    const [airportList, setAirportList] = useState<LocationAirport[]>([])


    const GetAirports = () => {

        const opt = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '39e13e4f6emsh2d9301de37a3124p1a30c6jsne6642d6fd456',
                'X-RapidAPI-Host': 'airports-by-api-ninjas.p.rapidapi.com'
            }
        };

        fetch('https://airports-by-api-ninjas.p.rapidapi.com/v1/airports?country=US', opt)
            .then(response => response.json())
            .then(response => loadData(response))
            .catch(err => console.error(err));
    }

    const loadData = (airporlist: any) => {

        const Airpot: [] = airporlist
        const newAirpot: LocationAirport[] = Airpot.map(({ latitude, longitude, iata, name }) => {
            return {
                latitude, longitude, iata, name
            }
        })

        setAirportList([...airportList, ...newAirpot])

    }

    useEffect(() => {

        GetAirports();
    }, [])

    return { airportList }
}