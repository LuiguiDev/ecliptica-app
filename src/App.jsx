import { useState } from 'react';
import Scene from './Scene.jsx';
import { ZODIAC, sunLongitude, signIndexForLongitude, dayToDate } from './constellations.js';

export default function App() {
  const [day, setDay] = useState(1); // 1 de enero
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(20); // días por segundo
  const [showLabels, setShowLabels] = useState(true);

  const sign = ZODIAC[signIndexForLongitude(sunLongitude(day))];

  return (
    <div className="app">
      <Scene day={day} playing={playing} speed={speed} setDay={setDay} showLabels={showLabels} />

      <div className="panel">
        <h1>El movimiento aparente del Sol</h1>

        <div className="current-sign">
          <span className="sign-name">{sign.name}</span>
          <span className="sign-range">{sign.range}</span>
        </div>

        <div className="control">
          <label>
            Fecha: <b>{dayToDate(Math.floor(day))}</b>
          </label>
          <input
            type="range"
            min="1"
            max="365"
            step="1"
            value={Math.floor(day)}
            onChange={e => setDay(Number(e.target.value))}
          />
        </div>

        <div className="control row">
          <button onClick={() => setPlaying(p => !p)}>{playing ? 'Pausar' : 'Reproducir'}</button>
          <label>
            Velocidad: <b>{speed} días/s</b>
            <input
              type="range"
              min="1"
              max="90"
              step="1"
              value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="control row">
          <label className="check">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={e => setShowLabels(e.target.checked)}
            />
            Nombres de constelaciones
          </label>
        </div>

        <p className="hint">Arrastra para rotar la vista · rueda para acercar</p>
      </div>
    </div>
  );
}
