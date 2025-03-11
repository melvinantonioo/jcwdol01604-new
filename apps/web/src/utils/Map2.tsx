
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Prevent leaflet errors on SSR
const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
    //@ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconUrl: markerIcon.src,
        iconRetinaUrl: markerIcon2x.src,
        shadowUrl: markerShadow.src
    });
}

interface MapProps {
    center?: [number, number] | null; // ✅ Bisa null saat data belum ada
};

// Komponen untuk update pusat peta saat `center` berubah
const ChangeView: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 10); // **Setel pusat dan zoom**
    }, [center, map]);
    return null;
};

const Map2: React.FC<MapProps> = ({ center }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Hindari masalah render awal di SSR
    if (!center) return <p className="text-center text-gray-500">📍 Lokasi belum tersedia</p>;

    const safeCenter: [number, number] = center ?? [0, 0];

    return (
        <MapContainer
            center={center as L.LatLngExpression || [51, -0.9]} //default value map
            zoom={center ? 4 : 2}
            scrollWheelZoom={false}
            className='h-[35vh] rounded-lg'
        >
            {/* <ChangeView center={safeCenter} />  */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {center && <Marker position={center as L.LatLngExpression} />}
            <Marker position={center} />
        </MapContainer>
    );
};

export default Map2;
