import React, { useState } from 'react';
import {
  SECTIONS,
  maturityFor,
  statusFor,
  percentileFor,
  impactModel,
  formatMoney,
  prioritiesFor,
  REVENUE_BANDS,
} from '@/data/audit';
import { ScoreGauge, RadarChart, MeterBar, MiniBar, colorForScore } from '@/components/charts';

function StatusChip({ score }) {
  const s = statusFor(score);
  return (
    <span className={`chip chip-${s.key}`}>
      <span aria-hidden="true">{s.icon}</span> {s.label}
    </span>
  );
}

function CategoryCard({ section, cat, responses, open, onToggle }) {
  return (
    <div className={`cat-card ${open ? 'open' : ''}`} id={`cat-${section.id}`}>
      <button className="cat-head" onClick={onToggle} aria-expanded={open}>
        <div className="cat-head-main">
          <div className="cat-title-row">
            <h3>{section.title}</h3>
            <StatusChip score={cat.score} />
          </div>
          <p className="cat-desc">{section.description}</p>
          <div className="cat-meter-row">
            <MeterBar score={cat.score} benchmark={section.benchmark} />
            <div className="cat-score">
              <b>{cat.score.toFixed(1)}</b>
              <span className={`delta ${cat.delta >= 0 ? 'up' : 'down'}`}>
                {cat.delta >= 0 ? '+' : ''}{cat.delta.toFixed(1)} vs industry
              </span>
            </div>
          </div>
        </div>
        <span className="cat-caret" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>

      <div className="cat-body" hidden={!open}>
        <p className="cat-insight">
          {section.insights[cat.score >= 7.5 ? 'strong' : cat.score >= 5 ? 'mid' : 'low']}
        </p>
        <div className="qa-table" role="table" aria-label={`${section.title} answers`}>
          <div className="qa-row qa-head" role="row">
            <span role="columnheader">Question</span>
            <span role="columnheader">Your answer</span>
            <span role="columnheader" className="qa-score-col">Score</span>
          </div>
          {section.questions.map((q) => {
            const val = responses[q.id] ?? 0;
            const opt = q.options.find((o) => o.value === val);
            const weak = val <= 5;
            return (
              <div className="qa-row" role="row" key={q.id}>
                <span role="cell" className="qa-q">{q.question}</span>
                <span role="cell" className="qa-a">{opt ? opt.label : '—'}</span>
                <span role="cell" className="qa-score-col qa-score">
                  <MiniBar value={val} />
                  <b style={{ color: colorForScore(val) }}>{val}</b>
                </span>
                {weak && (
                  <span role="cell" className="qa-rec">
                    <b>Recommendation:</b> {q.rec}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Report({ profile, responses, scores, onRestart, webhookState }) {
  const [openCats, setOpenCats] = useState(() => {
    // open the weakest category by default so the report invites exploration
    const weakest = [...scores.categories].sort((a, b) => a.score - b.score)[0];
    return new Set(weakest ? [weakest.id] : []);
  });

  const maturity = maturityFor(scores.overall);
  const percentile = percentileFor(scores.overall);
  const impact = impactModel(scores.categories, profile.revenue);
  const priorities = prioritiesFor(responses, scores.categories);
  const sorted = [...scores.categories].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const band = REVENUE_BANDS.find((b) => b.id === profile.revenue);

  const radarData = SECTIONS.map((s) => {
    const c = scores.categories.find((x) => x.id === s.id);
    return { id: s.id, title: s.title, short: s.short, score: c.score, benchmark: s.benchmark };
  });

  const toggleCat = (id) =>
    setOpenCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const jumpToCat = (id) => {
    setOpenCats((prev) => new Set(prev).add(id));
    requestAnimationFrame(() => {
      document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const expandAll = () => setOpenCats(new Set(SECTIONS.map((s) => s.id)));

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="report">
      {/* in-page nav */}
      <nav className="report-nav no-print" aria-label="Report sections">
        <a href="#overview">Overview</a>
        <a href="#profile-chart">Profile</a>
        <a href="#categories">Deep dive</a>
        <a href="#priorities">Priorities</a>
        <a href="#impact">Impact</a>
        <a href="#next">Next steps</a>
      </nav>

      {/* ---- Overview ---- */}
      <section className="card hero-card" id="overview">
        <div className="hero-meta">
          <div className="overline">Operations audit report</div>
          <h1>{profile.company}</h1>
          <p className="hero-sub">
            Prepared for {profile.name || 'you'} · {reportDate}
            {band ? ` · ${band.label} annual revenue` : ''}
          </p>
          <div className="maturity">
            <span className="maturity-badge" style={{ background: colorForScore(scores.overall) }}>
              {maturity.name}
            </span>
            <span className="maturity-scale" aria-hidden="true">
              {['Reactive', 'Developing', 'Structured', 'Scalable', 'Optimized'].map((m) => (
                <span key={m} className={m === maturity.name ? 'on' : ''}>{m}</span>
              ))}
            </span>
          </div>
          <p className="maturity-summary">{maturity.summary}</p>
          <p className="percentile">
            Your overall score is higher than <b>~{percentile}%</b> of roofing contractors
            we assess.
          </p>
        </div>
        <div className="hero-gauge">
          <ScoreGauge score={scores.overall} />
          <div className="gauge-caption">Overall operations score</div>
        </div>
      </section>

      {/* ---- Stat tiles ---- */}
      <section className="tiles">
        <div className="card tile">
          <div className="tile-label">Strongest area</div>
          <div className="tile-value">{strongest.short}</div>
          <div className="tile-detail">
            <StatusChip score={strongest.score} /> {strongest.score.toFixed(1)}/10 — protect it
          </div>
        </div>
        <div className="card tile">
          <div className="tile-label">Biggest gap</div>
          <div className="tile-value">{weakest.short}</div>
          <div className="tile-detail">
            <StatusChip score={weakest.score} /> {weakest.score.toFixed(1)}/10 — start here
          </div>
        </div>
        <div className="card tile">
          <div className="tile-label">Est. annual margin at risk</div>
          <div className="tile-value">
            {impact ? `${formatMoney(impact.low)}–${formatMoney(impact.high)}` : '—'}
          </div>
          <div className="tile-detail">Based on your revenue band and gap severity</div>
        </div>
      </section>

      {/* ---- Radar ---- */}
      <section className="card" id="profile-chart">
        <div className="card-head">
          <h2>Your operations profile</h2>
          <p>Eight disciplines, scored 0–10, against the typical contractor we assess.
            Hover for detail; click a label to jump to that section.</p>
        </div>
        <RadarChart data={radarData} onSelect={jumpToCat} />
      </section>

      {/* ---- Category deep dive ---- */}
      <section id="categories">
        <div className="section-head">
          <h2>Category deep dive</h2>
          <button className="btn-ghost no-print" onClick={expandAll}>Expand all</button>
        </div>
        {SECTIONS.map((s) => (
          <CategoryCard
            key={s.id}
            section={s}
            cat={scores.categories.find((c) => c.id === s.id)}
            responses={responses}
            open={openCats.has(s.id)}
            onToggle={() => toggleCat(s.id)}
          />
        ))}
      </section>

      {/* ---- Priorities ---- */}
      {priorities.length > 0 && (
        <section className="card" id="priorities">
          <div className="card-head">
            <h2>Your priority roadmap</h2>
            <p>Ranked by financial impact — how far each area sits below best practice,
              weighted by how much revenue that discipline touches.</p>
          </div>
          <ol className="priority-list">
            {priorities.map((p, i) => (
              <li key={p.id} className="priority">
                <div className="priority-rank" aria-hidden="true">{i + 1}</div>
                <div className="priority-body">
                  <div className="priority-title-row">
                    <h3>{p.title}</h3>
                    <StatusChip score={p.score} />
                  </div>
                  <p className="priority-insight">{p.insight}</p>
                  {p.actions.length > 0 && (
                    <ul className="priority-actions">
                      {p.actions.map((a, j) => <li key={j}>{a}</li>)}
                    </ul>
                  )}
                  <button className="btn-ghost btn-sm no-print" onClick={() => jumpToCat(p.id)}>
                    See full breakdown →
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ---- Financial impact ---- */}
      {impact && (
        <section className="card" id="impact">
          <div className="card-head">
            <h2>Where the money is</h2>
            <p>Estimated annual margin at risk by category, modeled from your scores and
              a {impact.band.label} revenue band. Directional, not a quote — the audit
              itself verifies these numbers against your actual books.</p>
          </div>
          <div className="impact-hero">
            {formatMoney(impact.low)}<span className="impact-dash">–</span>{formatMoney(impact.high)}
            <span className="impact-per"> / year</span>
          </div>
          <div className="impact-bars">
            {impact.items.filter((i) => i.amount >= 1000).map((item) => {
              const max = impact.items[0].amount || 1;
              return (
                <div className="impact-row" key={item.id}>
                  <span className="impact-name">{item.short}</span>
                  <span className="impact-track">
                    <span className="impact-fill" style={{ width: `${(item.amount / max) * 100}%` }} />
                  </span>
                  <span className="impact-amount">{formatMoney(item.amount)}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ---- CTA ---- */}
      <section className="card cta-card" id="next">
        <h2>Turn this snapshot into a plan</h2>
        <p>
          This self-assessment shows where to look. The full Framework Ops audit goes
          inside the business — your books, your jobs, your systems — and returns a
          prioritized, costed fix list. Most clients see payback within 3–6 months of
          implementing the findings.
        </p>
        <div className="cta-actions no-print">
          <a
            className="btn btn-primary"
            href={`mailto:chance@frameworkopsllc.com?subject=${encodeURIComponent(
              `Ops audit follow-up — ${profile.company}`
            )}&body=${encodeURIComponent(
              `Hi Chance,\n\nI just completed the operations health check for ${profile.company} (overall score: ${scores.overall}/10) and I'd like to talk about the full audit.\n\n${profile.name || ''}`
            )}`}
          >
            Book a follow-up with Chance
          </a>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            Print / save as PDF
          </button>
        </div>
        <p className="cta-note">
          {webhookState === 'sent'
            ? `A copy of these results was sent to ${profile.email}. Chance will follow up within one business day.`
            : `Results recorded for ${profile.email}. Chance will follow up within one business day.`}
          {' '}No spam, no pressure.
        </p>
      </section>

      <div className="report-footer no-print">
        <button className="btn-ghost" onClick={onRestart}>Retake the diagnostic</button>
      </div>
    </div>
  );
}
