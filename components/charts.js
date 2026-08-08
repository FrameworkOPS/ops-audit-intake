import React, { useEffect, useRef, useState } from 'react';

// Status colors used for score marks. Marks that sit below 3:1 on white are
// always paired with an icon + text label (relief rule), never color alone.
export const STATUS_COLORS = {
  strong: '#1E5A4F',
  opportunity: '#D96A0B',
  critical: '#C0392B',
};

export function colorForScore(score) {
  if (score >= 7) return STATUS_COLORS.strong;
  if (score >= 5) return STATUS_COLORS.opportunity;
  return STATUS_COLORS.critical;
}

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased * 10) / 10);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

/**
 * Animated 240° score gauge. Fill carries severity; the track is the same
 * hue at a light step so state reads across the whole arc.
 */
export function ScoreGauge({ score, size = 220 }) {
  const [mounted, setMounted] = useState(false);
  const shown = useCountUp(score);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const color = colorForScore(score);
  const stroke = 14;
  const r = (size - stroke) / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 150; // degrees, 240° sweep
  const sweep = 240;
  const circumference = 2 * Math.PI * r;
  const arcLen = (sweep / 360) * circumference;
  const fillLen = arcLen * Math.max(0, Math.min(1, score / 10));

  const polar = (deg) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const [sx, sy] = polar(startAngle);
  const [ex, ey] = polar(startAngle + sweep);
  const track = `M ${sx} ${sy} A ${r} ${r} 0 1 1 ${ex} ${ey}`;

  return (
    <div className="gauge" style={{ width: size, height: size * 0.82 }}>
      <svg viewBox={`0 0 ${size} ${size * 0.86}`} width="100%" role="img"
        aria-label={`Overall operations score ${score} out of 10`}>
        <path d={track} fill="none" stroke={color} strokeOpacity="0.14"
          strokeWidth={stroke} strokeLinecap="round" />
        <path d={track} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLen} ${circumference}`}
          strokeDashoffset={mounted ? arcLen - fillLen : arcLen}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)' }}
        />
      </svg>
      <div className="gauge-center">
        <div className="gauge-value">{shown.toFixed(1)}</div>
        <div className="gauge-of">out of 10</div>
      </div>
    </div>
  );
}

/**
 * Radar chart — client profile (navy, emphasis) vs. industry benchmark
 * (de-emphasis gray). Hover a vertex for details; click to jump to the
 * category card. Values are always also available in the drill-down table.
 */
export function RadarChart({ data, onSelect }) {
  const [hover, setHover] = useState(null); // index
  const W = 520;
  const H = 430;
  const cx = W / 2;
  const cy = H / 2 + 4;
  const R = 138;
  const n = data.length;

  const pt = (i, v) => {
    const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
    const rr = (R * v) / 10;
    return [cx + rr * Math.cos(ang), cy + rr * Math.sin(ang)];
  };
  const poly = (key) =>
    data.map((d, i) => pt(i, d[key]).map((x) => x.toFixed(1)).join(',')).join(' ');

  const rings = [2.5, 5, 7.5, 10];

  return (
    <div className="radar-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="radar" role="img"
        aria-label="Category scores versus industry benchmark">
        {rings.map((v) => (
          <polygon key={v}
            points={Array.from({ length: n }, (_, i) =>
              pt(i, v).map((x) => x.toFixed(1)).join(',')).join(' ')}
            fill="none" stroke="var(--grid)" strokeWidth="1" />
        ))}
        {data.map((d, i) => {
          const [x, y] = pt(i, 10);
          return <line key={d.id} x1={cx} y1={cy} x2={x} y2={y}
            stroke="var(--grid)" strokeWidth="1" />;
        })}

        {/* benchmark (de-emphasis) */}
        <polygon points={poly('benchmark')} fill="none" stroke="var(--bench)"
          strokeWidth="2" strokeLinejoin="round" />
        {/* client (emphasis) */}
        <polygon points={poly('score')} fill="var(--navy)" fillOpacity="0.10"
          stroke="var(--navy)" strokeWidth="2" strokeLinejoin="round" />

        {data.map((d, i) => {
          const [x, y] = pt(i, d.score);
          return (
            <g key={d.id}>
              <circle cx={x} cy={y} r={hover === i ? 6 : 4.5} fill="var(--navy)"
                stroke="var(--card)" strokeWidth="2" style={{ transition: 'r .15s' }} />
            </g>
          );
        })}

        {/* axis labels + generous hover/click targets */}
        {data.map((d, i) => {
          const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
          const lx = cx + (R + 30) * Math.cos(ang);
          const ly = cy + (R + 26) * Math.sin(ang);
          const anchor =
            Math.abs(Math.cos(ang)) < 0.3 ? 'middle' : Math.cos(ang) > 0 ? 'start' : 'end';
          const [vx, vy] = pt(i, d.score);
          return (
            <g key={d.id}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect && onSelect(d.id)}
              style={{ cursor: onSelect ? 'pointer' : 'default' }}>
              <text x={lx} y={ly} textAnchor={anchor} className="radar-label"
                dominantBaseline="middle">{d.short}</text>
              <circle cx={vx} cy={vy} r="18" fill="transparent" />
            </g>
          );
        })}
      </svg>

      {hover !== null && (
        <div className="chart-tip" style={tipPos(hover, n, cx, cy, R, data, W, H)}>
          <div className="tip-title">{data[hover].title}</div>
          {/* light swatch steps — the tooltip surface is dark navy */}
          <div className="tip-row">
            <span className="tip-dot" style={{ background: '#8fb3e2' }} />
            You <b>{data[hover].score.toFixed(1)}</b>
          </div>
          <div className="tip-row">
            <span className="tip-dot" style={{ background: '#aeb6bf' }} />
            Industry <b>{data[hover].benchmark.toFixed(1)}</b>
          </div>
        </div>
      )}

      <div className="legend">
        <span className="legend-item"><span className="legend-swatch"
          style={{ background: 'var(--navy)' }} />Your score</span>
        <span className="legend-item"><span className="legend-swatch"
          style={{ background: 'var(--bench)' }} />Industry benchmark</span>
      </div>
    </div>
  );
}

function tipPos(i, n, cx, cy, R, data, W, H) {
  const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
  const x = cx + (R * data[i].score / 10) * Math.cos(ang);
  const y = cy + (R * data[i].score / 10) * Math.sin(ang);
  const left = Math.max(6, Math.min(72, (x / W) * 100));
  const top = Math.max(2, (y / H) * 100 - 4);
  return { left: `${left}%`, top: `${top}%` };
}

/**
 * Horizontal score meter, 0–10, with a benchmark tick. Fill carries the
 * status color; the track is the same hue at a light step. Always rendered
 * next to a text score + status label, so color never works alone.
 */
export function MeterBar({ score, benchmark, animate = true }) {
  const [mounted, setMounted] = useState(!animate);
  useEffect(() => {
    if (!animate) return;
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, [animate]);
  const color = colorForScore(score);
  return (
    <div className="meter" role="img"
      aria-label={`Score ${score} out of 10; industry benchmark ${benchmark}`}>
      <div className="meter-track" style={{ background: `${color}20` }}>
        <div className="meter-fill" style={{
          width: mounted ? `${score * 10}%` : 0,
          background: color,
        }} />
        <div className="meter-bench" style={{ left: `${benchmark * 10}%` }}
          title={`Industry benchmark: ${benchmark}`} />
      </div>
    </div>
  );
}

/** Tiny 0–10 inline bar for the per-question drill-down rows. */
export function MiniBar({ value }) {
  const color = colorForScore(value);
  return (
    <span className="minibar" aria-hidden="true">
      <span className="minibar-fill"
        style={{ width: `${value * 10}%`, background: color }} />
    </span>
  );
}
