"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { Map } from "leaflet";
import { vitrithuctap } from "../../../functions/company"
import type { CongTyThucTap } from "../../../models/model-all";
import { FaExclamationTriangle, FaSearch, FaMapMarkerAlt, FaExpand, FaCompress, FaCopy } from "react-icons/fa";

interface MapModalProps {
  company: CongTyThucTap;
  onClose: () => void;
}

// Fix default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function CompanyMapModal({ company, onClose}: MapModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; long: number } | null>(
    company.lat && company.long
      ? { lat: company.lat, long: company.long }
      : null
  );
  const [showWarning, setShowWarning] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const mapRef = useRef<Map>(null);

  useEffect(() => {
    if (!company.lat || !company.long) {
      setShowWarning(true);
    }
  }, [company]);

  // Debounced search function for realtime updates
  const debouncedSearch = useRef<NodeJS.Timeout | null>(null);
  const handleSearchQueryChange = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (debouncedSearch.current) {
        clearTimeout(debouncedSearch.current);
      }

      debouncedSearch.current = setTimeout(async () => {
        if (query.length < 3) {
          setSearchResults([]);
          return;
        }

        setIsSearching(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
              query
            )}&format=json&limit=5`
          );
          const data = await res.json();
          setSearchResults(data);
        } catch (err) {
          console.error("Lỗi tìm kiếm:", err);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300); // Giảm xuống 300ms cho realtime mượt hơn
    },
    []
  );

  useEffect(() => {
    return () => {
      if (debouncedSearch.current) {
        clearTimeout(debouncedSearch.current);
      }
    };
  }, []);

  const handleSelectResult = useCallback((result: any) => {
    const newPosition = { lat: parseFloat(result.lat), long: parseFloat(result.lon) };
    setSelectedPosition(newPosition);
    setSearchResults([]); // Hide results after selection
    setSearchQuery(result.display_name.split(',')[0]); // Update query to selected name
    
    // Fly to the new position smoothly
    if (mapRef.current) {
      mapRef.current.flyTo([newPosition.lat, newPosition.long], 16, { duration: 1 });
    }
  }, []);

  const handleConfirm = () => {
    if (selectedPosition) {
      vitrithuctap(company.macongty, selectedPosition.lat, selectedPosition.long);
      onClose();
    } else {
      alert("Vui lòng chọn vị trí trước khi xác nhận!");
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const newPosition = { lat: e.latlng.lat, long: e.latlng.lng };
        setSelectedPosition(newPosition);
        setSearchResults([]); // Clear search results on map click
        // Optionally fly to clicked position, but since it's already clicked, map handles it
      },
    });

    return selectedPosition ? (
      <Marker position={[selectedPosition.lat, selectedPosition.long]} />
    ) : null;
  }

  const handleCopyCoords = (coords: string) => {
    navigator.clipboard.writeText(coords).then(() => {
      // Optional: Show a brief success message
      console.log('Copied to clipboard:', coords);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  return (
    <div className={`p-4 w-full bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300`}>
      {/* Header - Always show, but compact in full screen */}
      <div className={`flex items-center justify-between mb-4 pb-3 border-b border-gray-200 `}>
        <h3 className={`text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2 `}>
          <FaMapMarkerAlt className="text-blue-600" />
          Cập nhật vị trí: {company.tencongty}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullScreen}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
            title={isFullScreen ? "Thu nhỏ" : "Mở rộng toàn màn hình"}
          >
            {isFullScreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
          >
            ×
          </button>
        </div>
      </div>

      {/* Warning Alert - Compact in full screen */}
      {showWarning && (
        <div className={`flex items-start gap-2 mb-4 p-3 ${isFullScreen ? 'text-xs p-2' : 'p-4 mb-6' } bg-amber-50 border-l-4 border-amber-400 rounded-md`}>
          <FaExclamationTriangle className={`text-amber-600 mt-0.5 flex-shrink-0 ${isFullScreen ? 'text-sm' : ''}`} />
          <span className={`text-sm ${isFullScreen ? 'text-xs' : 'text-amber-800' } leading-relaxed text-amber-800`}>
            Chưa có địa chỉ hoặc tọa độ. Vui lòng chọn vị trí trên bản đồ hoặc tìm kiếm.
          </span>
        </div>
      )}

      {/* Search Section - Always show, compact in full screen */}
      <div className={`mb-4 ${isFullScreen ? 'mb-2' : 'mb-6'}`}>
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${isFullScreen ? 'text-xs mb-1' : 'mb-2'}`}>
          Tìm kiếm địa chỉ
        </label>
        <div className="relative">
          <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${isFullScreen ? 'left-2 text-sm' : ''}`} />
          <input
            type="text"
            placeholder="Nhập địa chỉ (tối thiểu 3 ký tự)..."
            value={searchQuery}
            onChange={(e) => handleSearchQueryChange(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 ${isFullScreen ? 'py-1 text-sm' : 'py-3' } border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
          />
        </div>
        {isSearching && (
          <p className={`text-xs text-gray-500 mt-1 flex items-center gap-1 ${isFullScreen ? 'text-xs mt-0.5' : ''}`}>
            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Đang tìm kiếm...
          </p>
        )}
      </div>

      {/* Search Results - Compact in full screen */}
      {searchResults.length > 0 && (
        <div className={`mb-4 max-h-24 md:max-h-32 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 ${isFullScreen ? 'max-h-20 text-xs' : ''}`}>
          {searchResults.map((result, idx) => (
            <div
              key={idx}
              className={`p-2 md:p-3 border-b border-gray-100 last:border-b-0 hover:bg-white cursor-pointer transition-colors ${isFullScreen ? 'p-1.5 text-xs' : ''}`}
              onClick={() => handleSelectResult(result)}
            >
              <p className={`text-sm font-medium text-gray-900 truncate ${isFullScreen ? 'text-xs' : 'md:text-sm'}`}>{result.display_name.split(',')[0]}</p>
              <p className={`text-xs text-gray-500 ${isFullScreen ? 'text-xs' : ''}`}>{result.display_name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Selected Position - Always show, compact in full screen */}
      {selectedPosition && (
        <div className={`mb-4 p-3 ${isFullScreen ? 'p-2 mb-2 text-xs' : 'p-4 mb-6' } bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm`}>
          <p className={`text-sm font-semibold text-blue-800 flex items-center gap-2 mb-2 ${isFullScreen ? 'text-xs mb-1' : 'mb-3'}`}>
            <FaMapMarkerAlt className="text-blue-600" />
            Vị trí đã chọn
          </p>
          <div className={`grid grid-cols-1 gap-1 md:gap-2 ${isFullScreen ? 'text-xs' : 'text-sm'}`}>
            <div className="flex justify-between items-center p-2 bg-white rounded border">
              <span className="text-gray-600">Vĩ độ (Lat):</span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-blue-700">{selectedPosition.lat.toFixed(6)}</span>
                <button
                  onClick={() => handleCopyCoords(selectedPosition.lat.toFixed(6))}
                  className="p-0.5 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Copy"
                >
                  <FaCopy className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded border">
              <span className="text-gray-600">Kinh độ (Lng):</span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-blue-700">{selectedPosition.long.toFixed(6)}</span>
                <button
                  onClick={() => handleCopyCoords(selectedPosition.long.toFixed(6))}
                  className="p-0.5 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Copy"
                >
                  <FaCopy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Section */}
      <div className={`mb-4 relative ${isFullScreen ? 'mb-0 flex-1' : ''}`}>
        {!isFullScreen && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bản đồ (Click để chọn vị trí)
          </label>
        )}
        <div className={`rounded-lg overflow-hidden border border-gray-200 shadow-sm ${isFullScreen ? 'h-full' : 'h-80'}`}>
          <MapContainer
            center={
              selectedPosition
                ? [selectedPosition.lat, selectedPosition.long]
                : [10.7769, 106.7009] // Default to Ho Chi Minh City
            }
            zoom={selectedPosition ? 16 : 14}
            className="h-full w-full"
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {selectedPosition && (
              <Marker position={[selectedPosition.lat, selectedPosition.long]}>
                <Popup className="text-center">
                  <strong>{company.tencongty}</strong><br />
                  Lat: {selectedPosition.lat.toFixed(4)}<br />
                  Long: {selectedPosition.long.toFixed(4)}
                </Popup>
              </Marker>
            )}
            <LocationMarker />
          </MapContainer>
        </div>
        {isFullScreen && (
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={toggleFullScreen}
              className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <FaCompress className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons - Only show if not full screen */}
      {!isFullScreen && (
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 md:px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedPosition}
            className="px-4 md:px-6 py-2 text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <FaMapMarkerAlt className="w-4 h-4" />
            Xác nhận
          </button>
        </div>
      )}
    </div>
  );
}