import { useState } from 'react'
import './App.css'

function App() {
    const [distance, setDistance] = useState('');
    const [distUnit, setDistUnit] = useState('km'); // Standard: Kilometer

    const [time, setTime] = useState('');
    const [timeUnit, setTimeUnit] = useState('h');  // Standard: Stunden

    const [results, setResults] = useState(null);

    // Umrechnungsfaktoren in Basiseinheiten (Meter und Sekunden)
    const toMeters = {
        km: 1000,
        miles: 1609.34,
        meters: 1,
        ft: 0.3048
    };

    const toSeconds = {
        h: 3600,
        min: 60,
        s: 1
    };

    const handleCalculate = () => {
        const distVal = parseFloat(distance);
        const timeVal = parseFloat(time);

        // Validierung auf Deutsch
        if (isNaN(distVal) || isNaN(timeVal)) {
            alert("Bitte geben Sie gültige Zahlen ein.");
            return;
        }

        if (timeVal === 0) {
            alert("Die Zeit darf nicht 0 sein.");
            return;
        }

        // 1. Umrechnung in Meter und Sekunden
        const distanceInMeters = distVal * toMeters[distUnit];
        const timeInSeconds = timeVal * toSeconds[timeUnit];

        // 2. Berechnung der Geschwindigkeit (m/s)
        const speedMetersPerSecond = distanceInMeters / timeInSeconds;

        // 3. Umrechnung in km/h und mph
        const kmh = speedMetersPerSecond * 3.6;
        const mph = speedMetersPerSecond * 2.23694;

        setResults({
            kmh: kmh.toFixed(2),
            mph: mph.toFixed(2),
            base: speedMetersPerSecond.toFixed(2)
        });
    };

    return (
        <div className="container">
            <h1>Geschwindigkeitsrechner</h1>

            {/* Eingabe für die Strecke (Distance) */}
            <div className="input-group">
                <label>Strecke:</label>
                <div className="input-row">
                    <input
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="0"
                    />
                    <select
                        value={distUnit}
                        onChange={(e) => setDistUnit(e.target.value)}
                    >
                        <option value="km">Kilometer (km)</option>
                        <option value="miles">Meilen</option>
                        <option value="meters">Meter (m)</option>
                        <option value="ft">Fuß (ft)</option>
                    </select>
                </div>
            </div>

            {/* Eingabe für die Zeit (Time) */}
            <div className="input-group">
                <label>Benötigte Zeit:</label>
                <div className="input-row">
                    <input
                        type="number"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="0"
                    />
                    <select
                        value={timeUnit}
                        onChange={(e) => setTimeUnit(e.target.value)}
                    >
                        <option value="h">Stunden</option>
                        <option value="min">Minuten</option>
                        <option value="s">Sekunden</option>
                    </select>
                </div>
            </div>

            <button onClick={handleCalculate}>Geschwindigkeit berechnen</button>

            {/* Ergebnisanzeige */}
            {results && (
                <div className="result">
                    <h2>Ergebnisse</h2>
                    <div className="result-item">
                        <strong>{results.kmh}</strong> km/h
                    </div>
                    <div className="result-item">
                        <strong>{results.mph}</strong> mph
                    </div>
                    <p className="small-text">({results.base} m/s)</p>
                </div>
            )}
        </div>
    )
}

export default App