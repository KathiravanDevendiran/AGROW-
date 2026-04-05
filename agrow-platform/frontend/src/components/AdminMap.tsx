"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix typical default icon issues with Next.js/Leaflet
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
}

// Pseudo-random coordinate generator for demo purposes 
// Converts a text string (location/name) into stable [Lat, Lng] coordinates
function getStableCoordinates(seedString: string, baseLat: number = 39.8, baseLng: number = -98.5): [number, number] {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Create deterministic pseudo-random offsets
    let seed1 = Math.sin(hash) * 10000;
    let seed2 = Math.cos(hash) * 10000;
    
    // Spread markers across roughly US bounds for demo
    const latOffset = (seed1 - Math.floor(seed1) - 0.5) * 15;
    const lngOffset = (seed2 - Math.floor(seed2) - 0.5) * 35;
    
    return [baseLat + latOffset, baseLng + lngOffset];
}

interface MapProps {
    users: any[];
    scans: any[];
}

export default function AdminMap({ users, scans }: MapProps) {
    if (typeof window === 'undefined') return <div className="w-full h-full bg-[#0A0F14]" />;

    return (
        <MapContainer 
            center={[39.8, -98.5]} 
            zoom={4} 
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%', background: '#0A0F14' }}
            className="z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {users.map(user => {
                const userScans = scans.filter(s => s.userName === user.name);
                const hasAnomaly = userScans.some(s => s.predictedDisease && s.predictedDisease !== 'Healthy');
                
                // Use the hash to place them consistently on the map so they don't move on refresh
                const position = getStableCoordinates(user.farmLocation + user.name);
                
                return (
                    <CircleMarker 
                        key={user.id} 
                        center={position} 
                        radius={hasAnomaly ? 10 : 6}
                        fillColor={hasAnomaly ? '#ef4444' : '#10b981'} // red-500 or emerald-500
                        color={hasAnomaly ? '#b91c1c' : '#047857'}
                        weight={2}
                        opacity={0.8}
                        fillOpacity={0.6}
                    >
                        <Popup className="bg-[#0A0F14] text-slate-800 border-white/10 rounded-xl">
                            <div className="font-sans font-medium min-w-[150px]">
                                <h3 className="font-bold text-lg mb-1">{user.name}</h3>
                                <p className="text-sm">📍 {user.farmLocation}</p>
                                <p className="text-sm">🌱 {user.farmCrop}</p>
                                <p className="text-sm mt-2 border-t pt-2">
                                    Status: {hasAnomaly ? <span className="text-red-500 font-bold">Anomaly Selected</span> : <span className="text-emerald-500 font-bold">Clear</span>}
                                </p>
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}
        </MapContainer>
    );
}
