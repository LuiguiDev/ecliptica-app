import { useState } from 'react';
import Scene from './Scene.jsx';
import { ZODIAC, sunLongitude, signIndexForLongitude, dayToDate } from './constellations.js';

function EyeIcon({ visible }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
      {!visible && <line x1="4" y1="20" x2="20" y2="4" />}
    </svg>
  );
}

function PlayIcon({ playing }) {
  return playing ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <line x1="9" y1="6" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="18" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  );
}

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

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
        <div className="panel-top">
          <h1>El movimiento aparente del Sol</h1>
          <div className="panel-actions">
            <button
              type="button"
              className="icon-btn"
              aria-label={showLabels ? 'Ocultar nombres de constelaciones' : 'Mostrar nombres de constelaciones'}
              title="Nombres de constelaciones"
              aria-pressed={showLabels}
              onClick={() => setShowLabels(v => !v)}
            >
              <EyeIcon visible={showLabels} />
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label={playing ? 'Pausar' : 'Reproducir'}
              title={playing ? 'Pausar' : 'Reproducir'}
              onClick={() => setPlaying(p => !p)}
            >
              <PlayIcon playing={playing} />
            </button>
          </div>
        </div>

        <div className="current-sign">
          <span className="sign-name">{sign.name}</span>
          <span className="sign-range">{sign.range}</span>
        </div>

        <div className="control">
          <div className="date-row">
            <span>Fecha</span>
            <b>{dayToDate(Math.floor(day))}</b>
          </div>
          <div className="date-slider">
            <input
              type="range"
              min="1"
              max="365"
              step="1"
              value={Math.floor(day)}
              onChange={e => setDay(Number(e.target.value))}
            />
            <div className="ruler" aria-hidden="true" />
            <div className="months" aria-hidden="true">
              {MONTHS.map(m => <span key={m}>{m}</span>)}
            </div>
          </div>
        </div>

        <div className="control row speed-row">
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

        <p className="hint">Arrastra para rotar la vista · rueda para acercar</p>
      </div>
    </div>
  );
}
