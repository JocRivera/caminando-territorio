import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { getFloraFauna } from '../services/apiService';
import 'leaflet/dist/leaflet.css';

const Map = () => {
    const [floraFauna, setFloraFauna] = useState([]);
    const [route, setRoute] = useState([
        [6.2289, -75.5908],
        [6.2389, -75.6008]   // Punto de llegada
    ]);
    useEffect(() => {
        getFloraFauna().then(data => setFloraFauna(data.results));
    }, []);
    return (
        <MapContainer center={[6.2289, -75.5908]} zoom={13} style={{ height: '100vh' }}>
            <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {floraFauna.map((item, index) => (
                <Marker
                    key={index}
                    position={[item.decimalLatitude, item.decimalLongitude]}
                    icon={new L.Icon({
                        iconUrl: 'https://cdn.iconscout.com/icon/free/png-256/leaf-plant-ecology-nature-forest-ecosystem-3-3318.png',
                        iconSize: [25, 25],
                    })}
                >
                    <Popup>
                        <p>{item.scientificName}</p>
                    </Popup>
                </Marker>
            ))}
            <Polyline
                positions={route}
                color="blue"
                weight={5}
                opacity={0.7}
            />
        </MapContainer>
    )
}
export default Map;