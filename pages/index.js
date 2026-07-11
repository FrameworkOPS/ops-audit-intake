import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import {
  SECTIONS,
  ALL_QUESTIONS,
  TOTAL_QUESTIONS,
  REVENUE_BANDS,
  TEAM_BANDS,
  MARKET_FOCUS,
  scoreAudit,
} from '@/data/audit';
import Report from '@/components/Report';

const STORAGE_KEY = 'fops-audit-v2';
const WEBHOOK_URL =
  process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL || 'https://hook.make.com/YOUR_WEBHOOK_ID_HERE';

const EMPTY_PROFILE = {
  company: '',
  name: '',
  email: '',
  revenue: '',
  team: '',
  focus: '',
};

function loadSaved() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function OpsAuditIntake() {
  const [step, setStep] = useState('intro'); // intro | quiz | analyzing | report
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [responses, setResponses] = useState({});
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState(null);
  const [profileErr, setProfileErr] = useState('');
  const [resumable, setResumable] = useState(false);
  const [webhookState, setWebhookState] = useState('idle');
  const advanceTimer = useRef(null);

  // ---- persistence ----
  useEffect(() => {
    const saved = loadSaved();
    if (saved && saved.step === 'quiz' && Object.keys(saved.responses || {}).length > 0) {
      setResumable(true);
    }
  }, []);

  useEffect(() => {
    if (step === 'intro' || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step: step === 'analyzing' ? 'quiz' : step, profile, responses, qIndex })
      );
    } catch {}
  }, [step, profile, responses, qIndex]);

  const resume = () => {
    const saved = loadSaved();
    if (!saved) return;
    setProfile({ ...EMPTY_PROFILE, ...saved.profile });
    setResponses(saved.responses || {});
    setQIndex(Math.min(saved.qIndex || 0, TOTAL_QUESTIONS - 1));
    setStep('quiz');
  };

  const restart = () => {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
    setStep('intro');
    setProfile(EMPTY_PROFILE);
    setResponses({});
    setQIndex(0);
    setScores(null);
    setResumable(false);
    setWebhookState('idle');
    window.scrollTo({ top: 0 });
  };

  // ---- intro / profile ----
  const setP = (k) => (e) => setProfile((p) => ({ ...p, [k]: e.target.value }));

  const startQuiz = () => {
    const emailOk = /.+@.+\..+/.test(profile.email.trim());
    if (!profile.company.trim()) return setProfileErr('Please enter your company name.');
    if (!emailOk) return setProfileErr('Please enter a valid email — your report is tied to it.');
    if (!profile.revenue) return setProfileErr('Please select your revenue range — it personalizes the financial impact estimates.');
    setProfileErr('');
    setStep('quiz');
    window.scrollTo({ top: 0 });
  };

  // ---- quiz ----
  const question = ALL_QUESTIONS[qIndex];
  const section = useMemo(
    () => SECTIONS.find((s) => s.id === question?.sectionId),
    [question]
  );
  const sectionIndex = SECTIONS.findIndex((s) => s.id === question?.sectionId);
  const qInSection = section
    ? section.questions.findIndex((q) => q.id === question.id) + 1
    : 0;
  const answered = Object.keys(responses).length;
  const progress = (answered / TOTAL_QUESTIONS) * 100;

  const finish = useCallback((finalResponses) => {
    const result = scoreAudit(finalResponses);
    setScores(result);
    setStep('analyzing');
    window.scrollTo({ top: 0 });

    // fire-and-forget intake webhook
    const payload = {
      submitted_at: new Date().toISOString(),
      company: profile.company,
      contact_name: profile.name,
      email: profile.email,
      revenue_band: profile.revenue,
      team_size: profile.team,
      market_focus: profile.focus,
      overall_score: result.overall,
      category_scores: Object.fromEntries(result.categories.map((c) => [c.id, c.score])),
      responses: finalResponses,
    };
    fetch(WEBHOOK_URL, { method: 'POST', body: JSON.stringify(payload) })
      .then(() => setWebhookState('sent'))
      .catch(() => setWebhookState('failed'));

    setTimeout(() => {
      setStep('report');
      window.scrollTo({ top: 0 });
    }, 1600);
  }, [profile]);

  const select = (value) => {
    if (advanceTimer.current) return; // ignore double-clicks during advance
    const next = { ...responses, [question.id]: value };
    setResponses(next);
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null;
      if (qIndex < TOTAL_QUESTIONS - 1) setQIndex(qIndex + 1);
      else finish(next);
    }, 260);
  };

  const back = () => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    if (qIndex > 0) setQIndex(qIndex - 1);
  };

  const forward = () => {
    if (responses[question.id] === undefined) return;
    if (qIndex < TOTAL_QUESTIONS - 1) setQIndex(qIndex + 1);
    else finish(responses);
  };

  // keyboard: 1–9 select, ← back, → / Enter next
  useEffect(() => {
    if (step !== 'quiz') return;
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= question.options.length) {
        select(question.options[num - 1].value);
      } else if (e.key === 'ArrowLeft') back();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') forward();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="app">
      <Head>
        <title>Roofing Operations Health Check | Framework Ops</title>
        <meta
          name="description"
          content="A 12-minute operations diagnostic for roofing contractors. Score 8 disciplines, benchmark against the industry, and see where margin is leaking."
        />
      </Head>

      {/* header */}
      <header className="site-header">
        <div className="shell header-inner">
          <img src="/logo.png" alt="Framework Ops" className="logo" />
          <div>
            <div className="brand">FRAMEWORK OPS</div>
            <div className="brand-sub">Roofing Operations Health Check</div>
          </div>
          {step === 'quiz' && (
            <button className="btn-ghost header-restart" onClick={restart}>
              Start over
            </button>
          )}
        </div>
      </header>

      <main className="shell main">
        {/* ---- intro ---- */}
        {step === 'intro' && (
          <div className="intro-grid">
            <div className="card intro-card">
              <div className="overline">Free 12-minute diagnostic</div>
              <h1>How much is your operation really costing you?</h1>
              <p className="lede">
                Answer {TOTAL_QUESTIONS} questions across 8 operational disciplines and get an
                interactive report: your scores against industry benchmarks, your biggest
                bottlenecks ranked by financial impact, and a prioritized roadmap. No sales
                pitch — just honest diagnostics.
              </p>

              <ul className="feature-list">
                <li><b>Scored profile</b> — 8 disciplines from sales to cash flow, benchmarked against the typical contractor</li>
                <li><b>Margin-at-risk estimate</b> — modeled from your revenue band and gap severity</li>
                <li><b>Priority roadmap</b> — what to fix first, and why</li>
              </ul>

              {resumable && (
                <div className="resume-banner">
                  You have an audit in progress.{' '}
                  <button className="link-btn" onClick={resume}>Resume where you left off →</button>
                </div>
              )}

              <div className="profile-form">
                <div className="field">
                  <label htmlFor="company">Company name *</label>
                  <input id="company" type="text" placeholder="Summit Roofing Co."
                    value={profile.company} onChange={setP('company')} />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="name">Your name</label>
                    <input id="name" type="text" placeholder="First name"
                      value={profile.name} onChange={setP('name')} />
                  </div>
                  <div className="field">
                    <label htmlFor="email">Work email *</label>
                    <input id="email" type="email" placeholder="you@company.com"
                      value={profile.email} onChange={setP('email')} />
                  </div>
                </div>
                <div className="field">
                  <label>Annual revenue *</label>
                  <div className="pill-group" role="radiogroup" aria-label="Annual revenue">
                    {REVENUE_BANDS.map((b) => (
                      <button key={b.id} type="button" role="radio"
                        aria-checked={profile.revenue === b.id}
                        className={`pill ${profile.revenue === b.id ? 'on' : ''}`}
                        onClick={() => setProfile((p) => ({ ...p, revenue: b.id }))}>
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Team size</label>
                    <div className="pill-group">
                      {TEAM_BANDS.map((b) => (
                        <button key={b.id} type="button"
                          className={`pill ${profile.team === b.id ? 'on' : ''}`}
                          onClick={() => setProfile((p) => ({ ...p, team: b.id }))}>
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <label>Market focus</label>
                    <div className="pill-group">
                      {MARKET_FOCUS.map((b) => (
                        <button key={b.id} type="button"
                          className={`pill ${profile.focus === b.id ? 'on' : ''}`}
                          onClick={() => setProfile((p) => ({ ...p, focus: b.id }))}>
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {profileErr && <p className="form-error" role="alert">{profileErr}</p>}

                <button className="btn btn-primary btn-lg" onClick={startQuiz}>
                  Start the diagnostic →
                </button>
                <p className="fine-print">
                  ~12 minutes · {TOTAL_QUESTIONS} questions · your answers auto-save ·
                  results delivered instantly
                </p>
              </div>
            </div>

            <aside className="intro-aside">
              <div className="card aside-card">
                <div className="overline">What gets measured</div>
                <ul className="section-preview">
                  {SECTIONS.map((s, i) => (
                    <li key={s.id}>
                      <span className="section-num">{i + 1}</span>
                      <div>
                        <b>{s.title}</b>
                        <span>{s.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card aside-card quote-card">
                <p>“Most $2–10M contractors are leaving 2–4% of revenue on the table in
                  operational leakage. The first step is knowing where.”</p>
                <div className="quote-attr">— Chance, Framework Ops</div>
              </div>
            </aside>
          </div>
        )}

        {/* ---- quiz ---- */}
        {step === 'quiz' && question && (
          <div className="quiz">
            <div className="quiz-progress">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-meta">
                <span>
                  Section {sectionIndex + 1} of {SECTIONS.length} · {section.title}
                </span>
                <span>{answered}/{TOTAL_QUESTIONS} answered</span>
              </div>
              <div className="section-pips" aria-hidden="true">
                {SECTIONS.map((s, i) => (
                  <span key={s.id}
                    className={`pip ${i < sectionIndex ? 'done' : i === sectionIndex ? 'now' : ''}`}
                    title={s.title} />
                ))}
              </div>
            </div>

            <div className="card quiz-card" key={question.id}>
              <div className="overline">{section.title} · question {qInSection} of {section.questions.length}</div>
              <h2 className="quiz-q">{question.question}</h2>
              <div className="options">
                {question.options.map((opt, i) => {
                  const selected = responses[question.id] === opt.value;
                  return (
                    <button key={i}
                      className={`option ${selected ? 'selected' : ''}`}
                      onClick={() => select(opt.value)}>
                      <span className="option-key" aria-hidden="true">{i + 1}</span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <div className="quiz-nav">
                <button className="btn btn-secondary" onClick={back} disabled={qIndex === 0}>
                  ← Back
                </button>
                <button className="btn btn-primary" onClick={forward}
                  disabled={responses[question.id] === undefined}>
                  {qIndex === TOTAL_QUESTIONS - 1 ? 'Generate my report' : 'Next'} →
                </button>
              </div>
              <p className="fine-print center">
                Tip: press <kbd>1</kbd>–<kbd>{question.options.length}</kbd> to answer,
                arrow keys to navigate
              </p>
            </div>
          </div>
        )}

        {/* ---- analyzing ---- */}
        {step === 'analyzing' && (
          <div className="card analyzing">
            <div className="spinner" aria-hidden="true" />
            <h2>Building your report…</h2>
            <p>Scoring 8 disciplines · benchmarking against industry data · modeling
              financial impact</p>
          </div>
        )}

        {/* ---- report ---- */}
        {step === 'report' && scores && (
          <Report
            profile={profile}
            responses={responses}
            scores={scores}
            onRestart={restart}
            webhookState={webhookState}
          />
        )}
      </main>

      <footer className="site-footer">
        <div className="shell">
          <p>Framework Ops × Macwood Capital — operational diagnostics for roofing contractors</p>
          <p className="footer-contact">chance@frameworkopsllc.com</p>
        </div>
      </footer>
    </div>
  );
}
