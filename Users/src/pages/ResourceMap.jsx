import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapService } from '../api/services';
import LoadingSpinner from '../components/LoadingSpinner';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createIcon = (color, emoji) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
      background: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 3px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <span style="transform: rotate(45deg); font-size: 16px;">${emoji}</span>
    </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -32],
    });
};

const icons = {
    shelter: createIcon('#3b82f6', '❄️'),
    hospital: createIcon('#ef4444', '🏥'),
    water: createIcon('#06b6d4', '💧'),
};

const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, 14);
    }, [center, map]);
    return null;
};

const ResourceMap = () => {
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [selectedType, setSelectedType] = useState('all');

    const defaultCenter = [28.6139, 77.2090];

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => setUserLocation([position.coords.latitude, position.coords.longitude]),
                () => { }
            );
        }
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            setIsLoading(true);
            const data = await mapService.getNearby();
            setResources(data.resources || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredResources = selectedType === 'all'
        ? resources
        : resources.filter(r => r.type === selectedType);

    const typeConfig = {
        shelter: { label: 'Shelters', icon: '❄️', color: 'bg-blue-500', count: resources.filter(r => r.type === 'shelter').length },
        hospital: { label: 'Hospitals', icon: '🏥', color: 'bg-red-500', count: resources.filter(r => r.type === 'hospital').length },
        water: { label: 'Water', icon: '💧', color: 'bg-cyan-500', count: resources.filter(r => r.type === 'water').length },
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" text="Finding resources..." />
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-1">Nearby Resources</h2>
                <p className="text-white/50 text-sm">Find cooling centers & medical facilities</p>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                <button
                    onClick={() => setSelectedType('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all touch-target ${selectedType === 'all'
                            ? 'bg-white/20 text-white'
                            : 'bg-white/5 text-white/60'
                        }`}
                >
                    All ({resources.length})
                </button>
                {Object.entries(typeConfig).map(([type, config]) => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 touch-target ${selectedType === type
                                ? 'bg-white/20 text-white'
                                : 'bg-white/5 text-white/60'
                            }`}
                    >
                        <span>{config.icon}</span>
                        {config.count}
                    </button>
                ))}
            </div>

            {/* Map */}
            <div className="h-[45vh] min-h-[280px] rounded-2xl overflow-hidden border border-white/10 mb-4">
                <MapContainer
                    center={userLocation || defaultCenter}
                    zoom={14}
                    scrollWheelZoom={true}
                    className="w-full h-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapUpdater center={userLocation} />

                    {userLocation && (
                        <Marker
                            position={userLocation}
                            icon={L.divIcon({
                                className: 'user-marker',
                                html: `<div style="
                  width: 16px;
                  height: 16px;
                  background: #3b82f6;
                  border: 3px solid white;
                  border-radius: 50%;
                  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
                "></div>`,
                                iconSize: [16, 16],
                                iconAnchor: [8, 8],
                            })}
                        >
                            <Popup><strong>You are here</strong></Popup>
                        </Marker>
                    )}

                    {filteredResources.map((resource) => (
                        <Marker
                            key={resource.id}
                            position={[resource.lat, resource.lng]}
                            icon={icons[resource.type] || icons.shelter}
                        >
                            <Popup>
                                <div className="p-1 min-w-[180px]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span>{typeConfig[resource.type]?.icon}</span>
                                        <strong className="text-sm">{resource.name}</strong>
                                    </div>
                                    <p className="text-gray-600 text-xs mb-2">{resource.address}</p>
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${resource.lat},${resource.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-3 py-1 bg-blue-500 text-white text-xs rounded-lg"
                                    >
                                        Directions
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Resource List */}
            <div className="glass-card p-4">
                <p className="text-white/50 text-xs uppercase tracking-wide font-medium mb-3">
                    {filteredResources.length} locations
                </p>
                <div className="space-y-2 max-h-[180px] overflow-y-auto scrollbar-hide">
                    {filteredResources.map((resource) => (
                        <div
                            key={resource.id}
                            className="p-3 bg-white/5 rounded-xl flex items-center gap-3"
                        >
                            <div className={`w-9 h-9 rounded-lg ${typeConfig[resource.type]?.color || 'bg-gray-500'} 
                              flex items-center justify-center text-base shrink-0`}>
                                {typeConfig[resource.type]?.icon || '📍'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-white text-sm truncate">{resource.name}</h4>
                                <p className="text-white/40 text-xs truncate">{resource.address}</p>
                            </div>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${resource.lat},${resource.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-xs font-medium shrink-0"
                            >
                                Go
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResourceMap;
