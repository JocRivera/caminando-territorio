import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, LayersControl, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import { getFloraFauna } from '../services/apiService';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import 'leaflet-gpx'; // Importa la librería para manejar GPX

// Asegúrate de corregir los íconos predeterminados de Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GPXTrack = ({ gpxFile }) => {
    const map = useMap();

    useEffect(() => {
        const gpxLayer = new L.GPX(gpxFile, {
            async: true,
            marker_options: {
                startIconUrl: 'https://cdn.rawgit.com/mpetazzoni/leaflet-gpx/master/pin-icon-start.png',
                endIconUrl: 'https://cdn.rawgit.com/mpetazzoni/leaflet-gpx/master/pin-icon-end.png',
                shadowUrl: 'https://cdn.rawgit.com/mpetazzoni/leaflet-gpx/master/pin-shadow.png'
            }
        }).addTo(map);

        gpxLayer.on('click', () => {
            // map.fitBounds(e.target.getBounds());
            map.fitBounds(gpxLayer.getBounds());
        })

        return () => {
            map.removeLayer(gpxLayer);
        };
    }, [map, gpxFile]);

    return null;
};

const RoutingMachine = ({ waypoints }) => {
    const map = useMap();

    useEffect(() => {
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


    // useEffect(() => {
    //     const fetchData = async () => {
    //         const data = await getFloraFauna();
    //         setFloraFauna(data.results || []); // Asegura que sea un arreglo
    //         if (data.results && data.results.length > 0) {
    //             const firstItem = data.results[0];
    //         }
    //     };
    //     fetchData();
    // }, []);


    const floraFaunaData = [
        { decimalLatitude: 6.448610, decimalLongitude: -75.352093, scientificName: 'Pseudotsuga menziesii', country: 'Colombia', eventDate: '2024-09-01' },
        { decimalLatitude: 6.438610, decimalLongitude: -75.332093, scientificName: 'Eucalyptus globulus', country: 'Colombia', eventDate: '2024-09-02' },
    ];
    const [floraFauna, setFloraFauna] = useState(floraFaunaData);
    const [center, setCenter] = useState([6.438610, -75.332093]);
    const radius = 10000; // 10 km

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
            <LayersControl position="topright">
                <LayersControl.Overlay name="Biodiversidad" >
                    <FeatureGroup>

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
                    </FeatureGroup>

                </LayersControl.Overlay>
            </LayersControl>
            {/* <RoutingMachine waypoints={waypoints} /> */}
            <GPXTrack gpxFile="/barbosa-la-quintero-concepcion-r010.gpx" />
        </MapContainer>
    );
};

export default Map;
