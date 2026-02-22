import { useState, useEffect } from "react";

const COLORS = {
  bg: "#0B0F1A",
  surface: "#111827",
  surfaceAlt: "#1A2233",
  border: "#1E2D45",
  accent: "#2A7FBF",
  accentBright: "#3B9EE0",
  gold: "#C89B3C",
  text: "#E2E8F0",
  textMuted: "#7A8FA6",
  textDim: "#4A5568",
  danger: "#E05252",
  success: "#3DB87A",
  warning: "#D4934A",
};

const PILLARS = [
  {
    id: "people",
    label: "People & Org Structure",
    icon: "👥",
    questions: [
      { id: "p1", text: "How many employees do you have (FT + PT)?", type: "text" },
      { id: "p2", text: "Do you have an org chart or documented reporting structure?", type: "select", options: ["Yes, documented and current", "Informal/in my head", "No"] },
      { id: "p3", text: "What is your annual employee turnover rate?", type: "select", options: ["Under 10%", "10–25%", "25–50%", "Over 50%", "Unknown"] },
      { id: "p4", text: "Do you have documented job descriptions for key roles?", type: "select", options: ["Yes, all roles", "Some roles", "No"] },
      { id: "p5", text: "How would you rate team morale right now?", type: "select", options: ["Excellent", "Good", "Fair", "Poor"] },
      { id: "p6", text: "What is your biggest people challenge right now?", type: "textarea" },
    ],
  },
  {
    id: "financial",
    label: "Financial Health",
    icon: "💰",
    questions: [
      { id: "f1", text: "What is your approximate annual revenue?", type: "text" },
      { id: "f2", text: "Do you know your gross profit margin?", type: "select", options: ["Yes, I track it monthly", "Yes, roughly", "No"] },
      { id: "f3", text: "How often do you review financial statements?", type: "select", options: ["Weekly", "Monthly", "Quarterly", "Rarely or never"] },
      { id: "f4", text: "Do you have a formal budget or annual financial plan?", type: "select", options: ["Yes, detailed", "Loosely", "No"] },
      { id: "f5", text: "What is your current cash runway in months?", type: "select", options: ["6+ months", "3–6 months", "1–3 months", "Less than 1 month", "Unknown"] },
      { id: "f6", text: "What is your biggest financial concern right now?", type: "textarea" },
    ],
  },
  {
    id: "systems",
    label: "Systems & Tech Stack",
    icon: "⚙️",
    questions: [
      { id: "s1", text: "List the core software tools your business runs on:", type: "textarea" },
      { id: "s2", text: "Are your key operational processes documented (SOPs)?", type: "select", options: ["Yes, comprehensive", "Some are documented", "No, mostly tribal knowledge"] },
      { id: "s3", text: "How do you manage customer data and CRM?", type: "select", options: ["Dedicated CRM (HubSpot, Salesforce, etc.)", "Spreadsheets", "Loosely / no system", "No CRM"] },
      { id: "s4", text: "What percentage of your repetitive tasks are automated?", type: "select", options: ["Over 50%", "25–50%", "Under 25%", "None"] },
      { id: "s5", text: "How would you rate your team's technology adoption?", type: "select", options: ["Strong — we use tools well", "Mixed — inconsistent usage", "Weak — tools are underutilized"] },
      { id: "s6", text: "What operational bottleneck costs you the most time or money?", type: "textarea" },
    ],
  },
  {
    id: "sales",
    label: "Sales & Pipeline",
    icon: "📈",
    questions: [
      { id: "sl1", text: "What is your primary lead source?", type: "text" },
      { id: "sl2", text: "Do you have a documented sales process?", type: "select", options: ["Yes, formal and followed", "Informal but consistent", "No defined process"] },
      { id: "sl3", text: "What is your approximate close rate on proposals?", type: "select", options: ["Over 50%", "30–50%", "15–30%", "Under 15%", "Unknown"] },
      { id: "sl4", text: "Do you track pipeline value (opportunities × probability)?", type: "select", options: ["Yes, consistently", "Sometimes", "No"] },
      { id: "sl5", text: "What is your average sales cycle length?", type: "select", options: ["Same day", "1–7 days", "1–4 weeks", "1–3 months", "Over 3 months"] },
      { id: "sl6", text: "What is the biggest gap in your sales or revenue generation?", type: "textarea" },
    ],
  },
];

const META_QUESTIONS = [
  { id: "m1", text: "Company name", type: "text" },
  { id: "m2", text: "Industry / type of business", type: "text" },
  { id: "m3", text: "Years in operation", type: "text" },
  { id: "m4", text: "Your role / title", type: "text" },
  { id: "m5", text: "What is the #1 reason you are seeking operational support?", type: "textarea" },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: ${COLORS.bg};
    color: ${COLORS.text};
    min-height: 100vh;
  }

  .app {
    max-width: 780px;
    margin: 0 auto;
    padding: 48px 24px 80px;
  }

  .header {
    margin-bottom: 48px;
    padding-bottom: 32px;
    border-bottom: 1px solid ${COLORS.border};
  }

  .logo-line {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .logo-mark {
    width: 32px;
    height: 32px;
    background: ${COLORS.accent};
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    flex-shrink: 0;
  }

  .logo-text {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: ${COLORS.accent};
  }

  h1 {
    font-family: 'DM Serif Display', serif;
    font-size: 36px;
    line-height: 1.15;
    color: ${COLORS.text};
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 15px;
    color: ${COLORS.textMuted};
    line-height: 1.6;
    max-width: 540px;
  }

  .progress-bar-wrap {
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .progress-bar-track {
    flex: 1;
    height: 3px;
    background: ${COLORS.border};
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: ${COLORS.accent};
    border-radius: 2px;
    transition: width 0.4s ease;
  }

  .progress-label {
    font-size: 12px;
    color: ${COLORS.textMuted};
    white-space: nowrap;
    font-weight: 500;
    letter-spacing: 0.05em;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
  }

  .section-icon {
    font-size: 22px;
    line-height: 1;
  }

  .section-label {
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    color: ${COLORS.text};
  }

  .question-group {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 40px;
  }

  .question {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  label {
    font-size: 14px;
    font-weight: 500;
    color: ${COLORS.textMuted};
    letter-spacing: 0.01em;
  }

  input[type="text"],
  select,
  textarea {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    color: ${COLORS.text};
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    border-radius: 6px;
    padding: 10px 14px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s;
    -webkit-appearance: none;
  }

  input[type="text"]:focus,
  select:focus,
  textarea:focus {
    border-color: ${COLORS.accent};
    box-shadow: 0 0 0 3px rgba(42,127,191,0.12);
  }

  select {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237A8FA6' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }

  textarea {
    min-height: 90px;
    resize: vertical;
    line-height: 1.6;
  }

  .nav-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 36px;
    padding-top: 32px;
    border-top: 1px solid ${COLORS.border};
  }

  button {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    border-radius: 6px;
    padding: 11px 24px;
    transition: all 0.2s;
    letter-spacing: 0.02em;
  }

  .btn-primary {
    background: ${COLORS.accent};
    color: #fff;
  }

  .btn-primary:hover {
    background: ${COLORS.accentBright};
    transform: translateY(-1px);
  }

  .btn-primary:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  .btn-ghost {
    background: transparent;
    color: ${COLORS.textMuted};
    border: 1px solid ${COLORS.border};
  }

  .btn-ghost:hover {
    border-color: ${COLORS.accent};
    color: ${COLORS.text};
  }

  .review-section {
    margin-bottom: 36px;
  }

  .review-pillar {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    padding: 20px 24px;
    margin-bottom: 12px;
  }

  .review-pillar-title {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${COLORS.accent};
    margin-bottom: 14px;
  }

  .review-qa {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .review-q {
    font-size: 12px;
    color: ${COLORS.textMuted};
  }

  .review-a {
    font-size: 14px;
    color: ${COLORS.text};
  }

  .notes-area {
    margin-bottom: 32px;
  }

  .notes-area label {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${COLORS.gold};
  }

  .generating {
    text-align: center;
    padding: 60px 0;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid ${COLORS.border};
    border-top-color: ${COLORS.accent};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .gen-text {
    color: ${COLORS.textMuted};
    font-size: 15px;
  }

  /* REPORT STYLES */
  .report-header {
    text-align: center;
    margin-bottom: 48px;
    padding-bottom: 32px;
    border-bottom: 1px solid ${COLORS.border};
  }

  .report-badge {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: ${COLORS.accent};
    border: 1px solid ${COLORS.accent};
    border-radius: 20px;
    padding: 4px 14px;
    margin-bottom: 16px;
  }

  .report-company {
    font-family: 'DM Serif Display', serif;
    font-size: 30px;
    margin-bottom: 6px;
  }

  .report-date {
    font-size: 13px;
    color: ${COLORS.textMuted};
  }

  .score-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 40px;
  }

  .score-card {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .score-card-label {
    font-size: 13px;
    color: ${COLORS.textMuted};
    font-weight: 500;
  }

  .score-value {
    font-family: 'DM Serif Display', serif;
    font-size: 28px;
  }

  .score-high { color: ${COLORS.success}; }
  .score-mid { color: ${COLORS.warning}; }
  .score-low { color: ${COLORS.danger}; }

  .report-block {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    padding: 24px 28px;
    margin-bottom: 16px;
  }

  .report-block-title {
    font-family: 'DM Serif Display', serif;
    font-size: 20px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .report-block-content {
    font-size: 14px;
    line-height: 1.75;
    color: ${COLORS.textMuted};
    white-space: pre-wrap;
  }

  .print-btn {
    background: ${COLORS.surfaceAlt};
    color: ${COLORS.textMuted};
    border: 1px solid ${COLORS.border};
    margin-left: 12px;
  }

  .print-btn:hover {
    border-color: ${COLORS.gold};
    color: ${COLORS.gold};
  }

  .error-msg {
    background: rgba(224,82,82,0.1);
    border: 1px solid rgba(224,82,82,0.3);
    color: ${COLORS.danger};
    border-radius: 8px;
    padding: 14px 18px;
    font-size: 14px;
    margin-top: 20px;
  }

  @media print {
    .nav-row, .progress-bar-wrap, .header { display: none; }
    body { background: white; color: black; }
  }
`;

// Steps: 0=meta, 1-4=pillars, 5=review, 6=generating, 7=report
export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviewNotes, setReviewNotes] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const totalSteps = 1 + PILLARS.length + 1; // meta + pillars + review
  const progressPct = step >= 6 ? 100 : Math.round((step / totalSteps) * 100);

  const setAnswer = (id, val) => setAnswers(prev => ({ ...prev, [id]: val }));

  const buildPrompt = () => {
    const meta = META_QUESTIONS.map(q => `${q.text}: ${answers[q.id] || "—"}`).join("\n");
    const pillarsText = PILLARS.map(p => {
      const qs = p.questions.map(q => `  Q: ${q.text}\n  A: ${answers[q.id] || "—"}`).join("\n");
      return `### ${p.label}\n${qs}`;
    }).join("\n\n");

    return `You are a senior fractional COO consultant preparing a business diagnostic report for a client of Framework Ops LLC. 
Analyze the intake responses below and produce a structured JSON report.

CLIENT INFO:
${meta}

INTAKE RESPONSES:
${pillarsText}

${reviewNotes ? `CONSULTANT NOTES (added by COO reviewer):\n${reviewNotes}` : ""}

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "executiveSummary": "3-4 sentence overall assessment. Be direct, honest, and specific to their situation.",
  "overallScore": <integer 1-10>,
  "pillars": [
    {
      "id": "people",
      "label": "People & Org Structure",
      "score": <integer 1-10>,
      "summary": "2-3 sentence honest assessment",
      "recommendations": ["Specific action 1", "Specific action 2", "Specific action 3"]
    },
    {
      "id": "financial",
      "label": "Financial Health",
      "score": <integer 1-10>,
      "summary": "2-3 sentence honest assessment",
      "recommendations": ["Specific action 1", "Specific action 2", "Specific action 3"]
    },
    {
      "id": "systems",
      "label": "Systems & Tech Stack",
      "score": <integer 1-10>,
      "summary": "2-3 sentence honest assessment",
      "recommendations": ["Specific action 1", "Specific action 2", "Specific action 3"]
    },
    {
      "id": "sales",
      "label": "Sales & Pipeline",
      "score": <integer 1-10>,
      "summary": "2-3 sentence honest assessment",
      "recommendations": ["Specific action 1", "Specific action 2", "Specific action 3"]
    }
  ],
  "topPriorities": ["Most critical action across all areas", "Second priority", "Third priority"],
  "closingStatement": "2-3 sentence note from the COO perspective on what will make the biggest difference."
}`;
  };

  const generateReport = async () => {
    setStep(6);
    setError(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 2000,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });
      const data = await response.json();
      console.log("API response:", JSON.stringify(data));
      if (!response.ok) throw new Error(data.error?.message || `HTTP ${response.status}`);
      const text = data.content?.map(c => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      console.log("Parsed text:", clean);
      const parsed = JSON.parse(clean);
      setReport(parsed);
      setStep(7);
    } catch (e) {
      setError(`Generation failed: ${e.message}. Check browser console for details.`);
      setStep(5);
    }
  };

  const scoreClass = (s) => s >= 7 ? "score-high" : s >= 4 ? "score-mid" : "score-low";

  const renderMeta = () => (
    <div>
      <div className="section-header">
        <span className="section-label">About Your Business</span>
      </div>
      <div className="question-group">
        {META_QUESTIONS.map(q => (
          <div key={q.id} className="question">
            <label>{q.text}</label>
            {q.type === "textarea" ? (
              <textarea value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} placeholder="Your answer..." />
            ) : (
              <input type="text" value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} placeholder="Your answer..." />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPillar = (pillar) => (
    <div>
      <div className="section-header">
        <span className="section-icon">{pillar.icon}</span>
        <span className="section-label">{pillar.label}</span>
      </div>
      <div className="question-group">
        {pillar.questions.map(q => (
          <div key={q.id} className="question">
            <label>{q.text}</label>
            {q.type === "select" ? (
              <select value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)}>
                <option value="">Select an option</option>
                {q.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : q.type === "textarea" ? (
              <textarea value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} placeholder="Your answer..." />
            ) : (
              <input type="text" value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} placeholder="Your answer..." />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderReview = () => (
    <div>
      <div className="section-header">
        <span className="section-label">Review & Add Notes</span>
      </div>
      <div className="review-section">
        {PILLARS.map(p => (
          <div key={p.id} className="review-pillar">
            <div className="review-pillar-title">{p.icon} {p.label}</div>
            {p.questions.map(q => (
              <div key={q.id} className="review-qa">
                <span className="review-q">{q.text}</span>
                <span className="review-a">{answers[q.id] || <em style={{color: COLORS.textDim}}>Not answered</em>}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="notes-area">
        <label>Consultant Notes (optional)</label>
        <textarea
          style={{minHeight: 120}}
          placeholder="Add any observations, context, or flags before generating the report..."
          value={reviewNotes}
          onChange={e => setReviewNotes(e.target.value)}
        />
      </div>
    </div>
  );

  const renderGenerating = () => (
    <div className="generating">
      <div className="spinner" />
      <p className="gen-text">Generating diagnostic report...</p>
    </div>
  );

  const renderReport = () => {
    const r = report;
    const company = answers["m1"] || "Client";
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    return (
      <div>
        <div className="report-header">
          <div className="report-badge">Framework Ops — Operational Diagnostic</div>
          <div className="report-company">{company}</div>
          <div className="report-date">{today}</div>
        </div>

        <div className="report-block">
          <div className="report-block-title">Executive Summary</div>
          <div className="report-block-content">{r.executiveSummary}</div>
        </div>

        <div className="score-grid">
          <div className="score-card" style={{gridColumn: "1/-1", background: COLORS.surfaceAlt}}>
            <span className="score-card-label" style={{fontSize: 14}}>Overall Business Health Score</span>
            <span className={`score-value ${scoreClass(r.overallScore)}`}>{r.overallScore}<span style={{fontSize: 16, color: COLORS.textDim}}>/10</span></span>
          </div>
          {r.pillars.map(p => (
            <div key={p.id} className="score-card">
              <span className="score-card-label">{p.label}</span>
              <span className={`score-value ${scoreClass(p.score)}`}>{p.score}<span style={{fontSize: 14, color: COLORS.textDim}}>/10</span></span>
            </div>
          ))}
        </div>

        {r.pillars.map(p => (
          <div key={p.id} className="report-block">
            <div className="report-block-title">
              {PILLARS.find(x => x.id === p.id)?.icon} {p.label}
              <span className={`score-value ${scoreClass(p.score)}`} style={{fontSize: 18, marginLeft: "auto"}}>{p.score}/10</span>
            </div>
            <div className="report-block-content" style={{marginBottom: 16}}>{p.summary}</div>
            <div style={{display: "flex", flexDirection: "column", gap: 8}}>
              {p.recommendations.map((rec, i) => (
                <div key={i} style={{display: "flex", gap: 10, alignItems: "flex-start"}}>
                  <span style={{color: COLORS.accent, fontWeight: 700, marginTop: 1, flexShrink: 0}}>{i + 1}.</span>
                  <span style={{fontSize: 14, color: COLORS.text, lineHeight: 1.6}}>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="report-block" style={{borderColor: COLORS.gold, borderWidth: 1}}>
          <div className="report-block-title">Top Priorities</div>
          <div style={{display: "flex", flexDirection: "column", gap: 12}}>
            {r.topPriorities.map((p, i) => (
              <div key={i} style={{display: "flex", gap: 14, alignItems: "flex-start"}}>
                <span style={{color: COLORS.gold, fontFamily: "'DM Serif Display', serif", fontSize: 20, lineHeight: 1, flexShrink: 0}}>{i + 1}</span>
                <span style={{fontSize: 14, color: COLORS.text, lineHeight: 1.6, paddingTop: 3}}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="report-block" style={{background: "rgba(42,127,191,0.06)"}}>
          <div className="report-block-title" style={{fontSize: 16, color: COLORS.accent}}>From the COO's Desk</div>
          <div className="report-block-content">{r.closingStatement}</div>
        </div>

        <div className="nav-row">
          <button className="btn-ghost" onClick={() => { setStep(0); setReport(null); setAnswers({}); setReviewNotes(""); }}>Start Over</button>
          <div>
            <button className="btn-ghost print-btn" onClick={() => window.print()}>Print / Save PDF</button>
          </div>
        </div>
      </div>
    );
  };

  const canAdvance = () => {
    if (step === 0) return META_QUESTIONS.slice(0, 2).every(q => answers[q.id]?.trim());
    return true;
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="logo-line">
            <div className="logo-mark" />
            <span className="logo-text">Framework Ops LLC</span>
          </div>
          <h1>Operational Diagnostic</h1>
          <p className="subtitle">A structured assessment of your business across people, finance, systems, and sales. Takes about 10 minutes.</p>
        </div>

        {step < 6 && step > 0 && (
          <div className="progress-bar-wrap">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{width: `${progressPct}%`}} />
            </div>
            <span className="progress-label">{progressPct}%</span>
          </div>
        )}

        {step === 0 && renderMeta()}
        {step >= 1 && step <= 4 && renderPillar(PILLARS[step - 1])}
        {step === 5 && renderReview()}
        {step === 6 && renderGenerating()}
        {step === 7 && renderReport()}

        {step < 5 && (
          <div className="nav-row">
            {step > 0 ? (
              <button className="btn-ghost" onClick={() => setStep(s => s - 1)}>← Back</button>
            ) : <div />}
            <button className="btn-primary" disabled={!canAdvance()} onClick={() => setStep(s => s + 1)}>
              {step === 4 ? "Review Responses →" : "Continue →"}
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="nav-row">
            <button className="btn-ghost" onClick={() => setStep(4)}>← Back</button>
            <button className="btn-primary" onClick={generateReport}>Generate Report →</button>
          </div>
        )}

        {error && <div className="error-msg">{error}</div>}
      </div>
    </>
  );
}
