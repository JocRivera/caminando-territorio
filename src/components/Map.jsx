import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getFloraFauna } from '../services/apiService';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

// Asegúrate de corregir los íconos predeterminados de Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RoutingMachine = ({ waypoints }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const routingControl = L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: true,
            lineOptions: {
                styles: [{ color: 'blue', opacity: 1, weight: 5 }]
            }
        }).addTo(map);

        return () => map.removeControl(routingControl);
    }, [map, waypoints]);

    return null;
};

const Map = () => {
    const [floraFauna, setFloraFauna] = useState([]);
    const [center, setCenter] = useState([6.438610, -75.332093]);
    const radius = 10000; // 20 km

    useEffect(() => {
        const fetchData = async () => {
            const data = await getFloraFauna();
            console.log(data); // Verifica la estructura de los datos aquí
            setFloraFauna(data.results || []); // Asegura que sea un arreglo
            if (data.results && data.results.length > 0) {
                const firstItem = data.results[0];
                setCenter([firstItem.decimalLatitude, firstItem.decimalLongitude]);
            }
        };
        fetchData();
    }, []);

    const speciesIcon = new L.Icon({
        iconUrl: 'https://cdn.iconscout.com/icon/free/png-256/leaf-plant-ecology-nature-forest-ecosystem-3-3318.png',
        iconSize: [25, 25],
        iconAnchor: [12, 25],
        popupAnchor: [0, -25],
    });

    const waypoints = [
        L.latLng(6.438610, -75.332093), // Medellín
        L.latLng(6.2289, -75.5908) // Envigado
    ];

    return (
        <MapContainer center={center} zoom={10} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="https://www.opentopomap.org/copyright">OpenTopoMap</a> contributors'
            />
            <Circle
                center={center}
                radius={radius}
                pathOptions={{ color: 'red', fillOpacity: 0.1 }}
            />
            {floraFauna.map((item, index) => {
                if (!item.decimalLatitude || !item.decimalLongitude) return null;

                return (
                    <Marker
                        key={index}
                        position={[item.decimalLatitude, item.decimalLongitude]}
                        icon={speciesIcon}
                    >
                        <Popup>
                            <strong>Nombre Científico:</strong> {item.scientificName || 'N/A'}<br />
                            <strong>País:</strong> {item.country || 'N/A'}<br />
                            <strong>Fecha:</strong> {item.eventDate || 'N/A'}
                        </Popup>
                    </Marker>
                );
            })}
            <RoutingMachine waypoints={waypoints} />
        </MapContainer>
    );
};

export default Map;