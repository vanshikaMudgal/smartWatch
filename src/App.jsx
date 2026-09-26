import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Check, Pause, Play, RotateCcw, ShieldCheck } from 'lucide-react';

const steps = [
  { distance: 260, instruction: 'TURN RIGHT', turn: 'right' },
  { distance: 180, instruction: 'GO STRAIGHT', turn: 'straight' },
  { distance: 120, instruction: 'TURN LEFT', turn: 'left' },
  { distance: 70, instruction: 'GO STRAIGHT', turn: 'straight' },
  { distance: 25, instruction: 'SAFE ZONE AHEAD', turn: 'safe' },
  { distance: 0, instruction: 'SAFE ZONE REACHED', turn: 'complete' },
];

const workerPositions = [
  { x: 96, y: 343 },
  { x: 160, y: 285 },
  { x: 216, y: 237 },
  { x: 280, y: 179 },
  { x: 327, y: 124 },
  { x: 327, y: 124 },
];

function getStartLabel(isPaused, complete) {
  if (complete) return 'SIMULATION COMPLETE';
  if (isPaused) return 'RESUME SIMULATION';
  return 'START SIMULATION';
}

function DirectionIcon({ turn }) {
  if (turn === 'complete') return <Check aria-hidden="true" />;
  if (turn === 'safe') return <ShieldCheck aria-hidden="true" />;
  if (turn === 'left') return <ArrowLeft aria-hidden="true" />;
  if (turn === 'straight') return <ArrowUp aria-hidden="true" />;
  return <ArrowRight aria-hidden="true" />;
}

function RouteMap({ stepIndex, complete }) {
  const position = workerPositions[stepIndex];
  const progress = stepIndex / (steps.length - 1);

  return (
    <svg className="route-map" viewBox="0 0 400 400" role="img" aria-label="Simplified evacuation route to the safe zone">
      <defs>
        <pattern id="map-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#b9c6c5" strokeOpacity=".045" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="#202a30" />
      <rect width="400" height="400" fill="url(#map-grid)" />
      <path d="M-15 79 78 78 112 108 176 105 213 71 291 70 321 42 414 39M-18 199 47 196 79 225 143 224 173 192 238 192 270 222 333 222 420 184M38 420 40 330 76 299 77 254 109 222M190 -12 191 70 218 98 218 159 189 191 190 265 221 300 221 412M303 -14 302 46 332 75 333 141 305 171 306 220 344 258 344 333 390 376" fill="none" stroke="#53616a" strokeWidth="2" strokeOpacity=".52" />
      <path d="M12 143 64 142 85 162 130 162M251 355 289 321 289 280 319 250 379 250M116 16 117 49 143 75M12 275 40 275" fill="none" stroke="#46565f" strokeWidth="2" strokeOpacity=".55" />
      <path d="M96 343 160 285 216 237 280 179 327 124 327 80" fill="none" stroke="#74b8fa" strokeOpacity=".18" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M96 343 160 285 216 237 280 179 327 124 327 80" fill="none" stroke={complete ? '#72c890' : '#5ba9f4'} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="440" strokeDashoffset={440 * (1 - progress)} className="route-progress" />
      <path d="M327 98V79" stroke={complete ? '#72c890' : '#5ba9f4'} strokeWidth="5" strokeLinecap="round" />
      <path d="m320 87 7-9 7 9" fill="none" stroke={complete ? '#72c890' : '#5ba9f4'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="327" cy="80" r="14" fill="#72c890" fillOpacity=".15" />
      <circle cx="327" cy="80" r="8" fill="#72c890" stroke="#dff5e5" strokeWidth="2" />
      <text x="327" y="53" textAnchor="middle" className="safe-map-label">SAFE</text>
      <circle cx={position.x} cy={position.y} r="17" fill="#5ba9f4" fillOpacity=".17" className="marker-halo" />
      <circle cx={position.x} cy={position.y} r="8" fill="#65b4ff" stroke="#f7fbff" strokeWidth="3" className="worker-marker" />
      <circle cx="216" cy="237" r="3" fill="#d8e9f6" />
      <circle cx="280" cy="179" r="3" fill="#d8e9f6" />
    </svg>
  );
}

function Watch({ stepIndex, isRunning, isPaused, complete, onStart, onPause, onReset }) {
  const step = steps[stepIndex];

  return (
    <section className={`watch-assembly${complete ? ' watch-assembly--safe' : ''}`} aria-label="Worker safety smartwatch simulation">
      <div className="watch-screen">
        <div className={`watch-status ${complete ? 'watch-status--safe' : ''}`}>
          <span className="status-light" />
          <span>{complete ? 'SAFE ZONE' : 'ROCKFALL DETECTED'}</span>
          <span className="status-time">STEP {String(stepIndex + 1).padStart(2, '0')} / 06</span>
        </div>
        <div className={`route-active-label${complete ? ' route-active-label--safe' : ''}`}>
          {complete ? 'SAFE ZONE SECURED' : 'EVACUATION ROUTE ACTIVE'}
        </div>
        <progress className={`watch-progress${complete ? ' watch-progress--safe' : ''}`} aria-label="Route progress" value={stepIndex} max={steps.length - 1} />
        <div className="map-wrap"><RouteMap stepIndex={stepIndex} complete={complete} /></div>
        <div className={`watch-guidance${complete ? ' watch-guidance--safe' : ''}`} aria-live="polite">
          <div className="guidance-topline">
            <span className="distance-number">{complete ? 'SAFE' : step.distance}</span>
            <span className="distance-unit">{complete ? '' : 'm'}</span>
            <span className="direction-arrow"><DirectionIcon turn={step.turn} /></span>
          </div>
          <div className="instruction-text">{step.instruction}</div>
        </div>
        <div className="watch-controls" aria-label="Simulation controls">
          {!isRunning ? (
            <button className="control-button control-button--primary" onClick={onStart} disabled={complete} aria-label={getStartLabel(isPaused, complete)} title={getStartLabel(isPaused, complete)}>
              <Play size={15} fill="currentColor" />
            </button>
          ) : (
            <button className="control-button control-button--primary" onClick={onPause} aria-label="Pause simulation" title="Pause simulation">
              <Pause size={15} fill="currentColor" />
            </button>
          )}
          <button className="reset-button" onClick={onReset} aria-label="Reset simulation" title="Reset simulation"><RotateCcw size={16} /></button>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const complete = stepIndex === steps.length - 1;

  useEffect(() => {
    if (!isRunning) return undefined;
    const timer = window.setInterval(() => {
      setStepIndex((current) => Math.min(current + 1, steps.length - 1));
    }, 4500);
    return () => window.clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (complete) {
      setIsRunning(false);
      setIsPaused(false);
    }
  }, [complete]);

  function startSimulation() {
    if (!complete) {
      setIsPaused(false);
      setIsRunning(true);
    }
  }

  function pauseSimulation() {
    setIsRunning(false);
    setIsPaused(true);
  }

  function resetSimulation() {
    setIsRunning(false);
    setIsPaused(false);
    setStepIndex(0);
  }

  return (
    <main className="app-shell">
        <Watch stepIndex={stepIndex} isRunning={isRunning} isPaused={isPaused} complete={complete} onStart={startSimulation} onPause={pauseSimulation} onReset={resetSimulation} />
    </main>
  );
}