import { useState, useEffect } from 'react'
import './App.css'

function App() {
    // --- EXISTING CALCULATOR STATE ---
    const [distance, setDistance] = useState('');
    const [distUnit, setDistUnit] = useState('km');
    const [time, setTime] = useState('');
    const [timeUnit, setTimeUnit] = useState('h');
    const [results, setResults] = useState(null);

    // --- NEW GPS STATE ---
    const [gpsSpeed, setGpsSpeed] = useState(null);
    const [gpsError, setGpsError] = useState('');
    const [isTracking, setIsTracking] = useState(false);
    const [watchId, setWatchId] = useState(null);

    // --- EXISTING LOGIC ---
    const toMeters = { km: 1000, miles: 1609.34, meters: 1, ft: 0.3048 };
    const toSeconds = { h: 3600, min: 60, s: 1 };

    const handleCalculate = () => {
        const distVal = parseFloat(distance);
        const timeVal = parseFloat(time);

        if (isNaN(distVal) || isNaN(timeVal)) {
            alert("Bitte geben Sie gültige Zahlen ein.");
            return;
        }
        if (timeVal === 0) {
            alert("Die Zeit darf nicht 0 sein.");
            return;
        }

        const distanceInMeters = distVal * toMeters[distUnit];
        const timeInSeconds = timeVal * toSeconds[timeUnit];
        const speedMetersPerSecond = distanceInMeters / timeInSeconds;

        const kmh = speedMetersPerSecond * 3.6;
        const mph = speedMetersPerSecond * 2.23694;

        setResults({
            kmh: kmh.toFixed(2),
            mph: mph.toFixed(2),
            base: speedMetersPerSecond.toFixed(2)
        });
    };

    // --- NEW GPS LOGIC ---
    const toggleGps = () => {
        if (isTracking) {
            // Stop Tracking
            navigator.geolocation.clearWatch(watchId);
            setIsTracking(false);
            setGpsSpeed(null);
        } else {
            // Start Tracking
            if (!("geolocation" in navigator)) {
                setGpsError("GPS wird von diesem Browser nicht unterstützt.");
                return;
            }

            const id = navigator.geolocation.watchPosition(
                (position) => {
                    // The browser gives speed in meters per second (m/s)
                    const speedMps = position.coords.speed;

                    if (speedMps === null) {
                        setGpsSpeed(0); // device doesn't know speed yet
                    } else {
                        // Convert m/s to km/h for display
                        const speedKmh = (speedMps * 3.6).toFixed(1);
                        setGpsSpeed(speedKmh);
                    }
                },
                (error) => {
                    setGpsError("Fehler beim Zugriff auf GPS: " + error.message);
                },
                {
                    enableHighAccuracy: true, // Uses GPS chip instead of WiFi (drains battery faster but accurate)
                    timeout: 5000,
                    maximumAge: 0
                }
            );
            setWatchId(id);
            setIsTracking(true);
            setGpsError('');
        }
    };

    // Cleanup when closing the app
    useEffect(() => {
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [watchId]);

    return (
        <div className="container">
            <h1>Geschwindigkeitsrechner</h1>

            {/* --- NEW GPS SECTION --- */}
            <div className="gps-section">
                <button
                    onClick={toggleGps}
                    style={{ backgroundColor: isTracking ? '#e63946' : '#2a9d8f' }}
                >
                    {isTracking ? 'GPS Stoppen' : 'Live GPS Tacho Starten'}
                </button>

                {gpsError && <p className="error-text">{gpsError}</p>}

                {isTracking && (
                    <div className="gps-result">
                        <h3>Aktuelle Geschwindigkeit</h3>
                        <div className="gps-big-number">
                            {gpsSpeed !== null ? gpsSpeed : "..."}
                            <span className="unit"> km/h</span>
                        </div>
                        <p className="small-text">Bewege dich, um einen Wert zu sehen!</p>
                    </div>
                )}
            </div>

            <hr style={{margin: '30px 0', opacity: 0.3}} />

            {/* --- EXISTING CALCULATOR --- */}
            <div className="input-group">
                <label>Strecke:</label>
                <div className="input-row">
                    <input
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="0"
                    />
                    <select value={distUnit} onChange={(e) => setDistUnit(e.target.value)}>
                        <option value="km">Kilometer (km)</option>
                        <option value="miles">Meilen</option>
                        <option value="meters">Meter (m)</option>
                        <option value="ft">Fuß (ft)</option>
                    </select>
                </div>
            </div>

            <div className="input-group">
                <label>Benötigte Zeit:</label>
                <div className="input-row">
                    <input
                        type="number"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="0"
                    />
                    <select value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)}>
                        <option value="h">Stunden</option>
                        <option value="min">Minuten</option>
                        <option value="s">Sekunden</option>
                    </select>
                </div>
            </div>

            <button onClick={handleCalculate}>Geschwindigkeit berechnen</button>

            {results && (
                <div className="result">
                    <h2>Ergebnisse</h2>
                    <div className="result-item"><strong>{results.kmh}</strong> km/h</div>
                    <div className="result-item"><strong>{results.mph}</strong> mph</div>
                </div>
            )}
        </div>
    )
}

export default App