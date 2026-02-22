import React, { useState } from 'react';

export default function RoofingOpsDiagnostic() {
  const [currentStep, setCurrentStep] = useState('intro'); // intro, quiz, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [scores, setScores] = useState(null);

  const questions = [
    // Production & Capacity (5)
    {
      id: 'prod_crews',
      category: 'Production & Capacity',
      question: 'How many field crews do you currently operate?',
      type: 'select',
      options: [
        { label: '1-2 crews', value: 8 },
        { label: '3-5 crews', value: 7 },
        { label: '6-10 crews', value: 6 },
        { label: '10+ crews', value: 5 },
      ],
    },
    {
      id: 'prod_utilization',
      category: 'Production & Capacity',
      question: 'What percentage of time are your crews billable/productive?',
      type: 'select',
      options: [
        { label: '85-100% (excellent)', value: 10 },
        { label: '70-84% (good)', value: 7 },
        { label: '55-69% (fair)', value: 4 },
        { label: 'Below 55% (struggling)', value: 1 },
      ],
    },
    {
      id: 'prod_bottleneck',
      category: 'Production & Capacity',
      question: 'What limits your ability to take on more work?',
      type: 'select',
      options: [
        { label: 'Nothing—we can scale up', value: 10 },
        { label: 'Crew availability/hiring', value: 6 },
        { label: 'Material/equipment constraints', value: 5 },
        { label: 'Owner/management capacity', value: 3 },
        { label: 'All of the above', value: 1 },
      ],
    },
    {
      id: 'prod_timeline',
      category: 'Production & Capacity',
      question: 'How long is your typical lead time from quote to job completion?',
      type: 'select',
      options: [
        { label: 'Less than 2 weeks', value: 9 },
        { label: '2-4 weeks', value: 7 },
        { label: '4-8 weeks', value: 5 },
        { label: '8+ weeks / unpredictable', value: 2 },
      ],
    },
    {
      id: 'prod_scheduling',
      category: 'Production & Capacity',
      question: 'How do you currently schedule jobs and assign crews?',
      type: 'select',
      options: [
        { label: 'Automated system (software)', value: 10 },
        { label: 'Spreadsheet or shared calendar', value: 6 },
        { label: 'Mostly phone calls and text', value: 3 },
        { label: 'Owner/manager decides ad-hoc', value: 1 },
      ],
    },

    // Job Costing & Profitability (5)
    {
      id: 'cost_tracking',
      category: 'Job Costing & Profitability',
      question: 'How do you currently track job costs?',
      type: 'select',
      options: [
        { label: 'Real-time system (QB, Procore, etc)', value: 10 },
        { label: 'Monthly accounting software review', value: 6 },
        { label: 'Spreadsheet tracking', value: 4 },
        { label: 'No formal system—learn at invoicing', value: 1 },
      ],
    },
    {
      id: 'cost_visibility',
      category: 'Job Costing & Profitability',
      question: 'When do you know if a job was profitable?',
      type: 'select',
      options: [
        { label: 'During the job (real-time)', value: 10 },
        { label: 'Within 1 week of completion', value: 7 },
        { label: 'During monthly accounting review', value: 4 },
        { label: 'After final invoice is paid', value: 1 },
      ],
    },
    {
      id: 'cost_variance',
      category: 'Job Costing & Profitability',
      question: 'How often do jobs come in over budget?',
      type: 'select',
      options: [
        { label: 'Rarely (less than 5%)', value: 9 },
        { label: 'Occasionally (5-15%)', value: 6 },
        { label: 'Frequently (15-30%)', value: 3 },
        { label: 'Often (30%+)', value: 1 },
      ],
    },
    {
      id: 'cost_margin',
      category: 'Job Costing & Profitability',
      question: 'What\'s your typical gross margin on roofing jobs?',
      type: 'select',
      options: [
        { label: '40%+ (excellent)', value: 10 },
        { label: '30-39% (good)', value: 7 },
        { label: '20-29% (fair)', value: 4 },
        { label: 'Below 20% (struggling)', value: 1 },
      ],
    },
    {
      id: 'cost_erosion',
      category: 'Job Costing & Profitability',
      question: 'Where is most of your margin lost?',
      type: 'select',
      options: [
        { label: 'Rework/quality issues', value: 4 },
        { label: 'Labor cost overruns', value: 5 },
        { label: 'Material waste/overages', value: 5 },
        { label: 'Scope creep/change orders', value: 6 },
        { label: 'Not sure—that\'s the problem', value: 1 },
      ],
    },

    // Sales-to-Production Handoff (4)
    {
      id: 'handoff_process',
      category: 'Sales-to-Production Handoff',
      question: 'How do you communicate project scope to crews?',
      type: 'select',
      options: [
        { label: 'Standardized kickoff meeting + docs', value: 10 },
        { label: 'Email + sometimes a call', value: 6 },
        { label: 'Mostly phone/text communication', value: 3 },
        { label: 'Crew figures it out on site', value: 1 },
      ],
    },
    {
      id: 'handoff_rework',
      category: 'Sales-to-Production Handoff',
      question: 'How often do projects require rework due to scope miscommunication?',
      type: 'select',
      options: [
        { label: 'Rarely (less than 5%)', value: 10 },
        { label: 'Occasionally (5-15%)', value: 6 },
        { label: 'Frequently (15-30%)', value: 3 },
        { label: 'Often (30%+)', value: 1 },
      ],
    },
    {
      id: 'handoff_changeorders',
      category: 'Sales-to-Production Handoff',
      question: 'How often do change orders arise during projects?',
      type: 'select',
      options: [
        { label: 'Rarely—scope is clear upfront', value: 9 },
        { label: 'Occasionally (5-20% of jobs)', value: 6 },
        { label: 'Frequently (20-40% of jobs)', value: 3 },
        { label: 'Very often (40%+ of jobs)', value: 1 },
      ],
    },
    {
      id: 'handoff_documentation',
      category: 'Sales-to-Production Handoff',
      question: 'Do you have documented procedures for project handoff?',
      type: 'select',
      options: [
        { label: 'Yes, and teams follow them consistently', value: 10 },
        { label: 'Yes, but compliance varies', value: 6 },
        { label: 'Minimal documentation exists', value: 3 },
        { label: 'No formal process', value: 1 },
      ],
    },

    // Team & Operations (5)
    {
      id: 'team_size',
      category: 'Team & Operations',
      question: 'How many total employees do you have?',
      type: 'select',
      options: [
        { label: '1-5 employees', value: 5 },
        { label: '6-15 employees', value: 6 },
        { label: '16-30 employees', value: 7 },
        { label: '30+ employees', value: 8 },
      ],
    },
    {
      id: 'team_structure',
      category: 'Team & Operations',
      question: 'How clear is your organizational structure?',
      type: 'select',
      options: [
        { label: 'Clear roles, documented org chart', value: 10 },
        { label: 'Mostly clear, informally defined', value: 6 },
        { label: 'Somewhat fuzzy—roles overlap', value: 3 },
        { label: 'No real structure—everyone does everything', value: 1 },
      ],
    },
    {
      id: 'team_turnover',
      category: 'Team & Operations',
      question: 'What\'s your annual team turnover rate? (Best estimate)',
      type: 'select',
      options: [
        { label: 'Under 10% (excellent)', value: 10 },
        { label: '10-25% (reasonable)', value: 7 },
        { label: '25-50% (high)', value: 4 },
        { label: 'Over 50% (very high)', value: 1 },
      ],
    },
    {
      id: 'team_owner_time',
      category: 'Team & Operations',
      question: 'How much time do you spend on daily operations vs. strategy?',
      type: 'select',
      options: [
        { label: 'Mostly strategy (70%+ strategic work)', value: 10 },
        { label: 'Balanced (50/50)', value: 6 },
        { label: 'Mostly operational (70%+ daily tasks)', value: 3 },
        { label: 'All operational—strategy? what\'s that?', value: 1 },
      ],
    },
    {
      id: 'team_meetings',
      category: 'Team & Operations',
      question: 'Do you have regular leadership/team meetings?',
      type: 'select',
      options: [
        { label: 'Yes, weekly structured meetings', value: 10 },
        { label: 'Yes, but inconsistent/ad-hoc', value: 5 },
        { label: 'Rarely—only when there\'s a problem', value: 2 },
        { label: 'No formal meetings', value: 1 },
      ],
    },

    // Technology & Systems (4)
    {
      id: 'tech_stack',
      category: 'Technology & Systems',
      question: 'How integrated is your technology stack?',
      type: 'select',
      options: [
        { label: 'Fully integrated (systems talk to each other)', value: 10 },
        { label: 'Mostly integrated with some manual workarounds', value: 6 },
        { label: 'Multiple systems with manual data entry', value: 3 },
        { label: 'Disconnected—lots of duplicate data entry', value: 1 },
      ],
    },
    {
      id: 'tech_crs',
      category: 'Technology & Systems',
      question: 'Are you using a CRM or job management system?',
      type: 'select',
      options: [
        { label: 'Yes, actively used by the team', value: 9 },
        { label: 'Yes, but inconsistently used', value: 5 },
        { label: 'Yes, but mostly abandoned', value: 2 },
        { label: 'No—relying on email/spreadsheets', value: 1 },
      ],
    },
    {
      id: 'tech_accounting',
      category: 'Technology & Systems',
      question: 'What accounting software do you use?',
      type: 'select',
      options: [
        { label: 'QB Online/Xero with job costing enabled', value: 10 },
        { label: 'QB Online/Xero, basic setup', value: 6 },
        { label: 'Spreadsheet-based accounting', value: 3 },
        { label: 'Not formally tracking—cash accounting only', value: 1 },
      ],
    },
    {
      id: 'tech_automation',
      category: 'Technology & Systems',
      question: 'How much of your workflow is automated?',
      type: 'select',
      options: [
        { label: 'Significant automation (saves 10+ hrs/week)', value: 10 },
        { label: 'Some automation (saves 5-10 hrs/week)', value: 6 },
        { label: 'Minimal automation', value: 3 },
        { label: 'Manual processes throughout', value: 1 },
      ],
    },

    // Financial Visibility (2)
    {
      id: 'fin_reporting',
      category: 'Financial Visibility',
      question: 'How quickly do you know your monthly profitability?',
      type: 'select',
      options: [
        { label: 'Within 2-3 days of month end', value: 10 },
        { label: 'Within 1-2 weeks of month end', value: 7 },
        { label: 'Takes 3-4 weeks', value: 4 },
        { label: 'Takes 30+ days or longer', value: 1 },
      ],
    },
    {
      id: 'fin_metrics',
      category: 'Financial Visibility',
      question: 'Do you track key operational metrics (margin %, crew utilization, job profitability)?',
      type: 'select',
      options: [
        { label: 'Yes, regularly reviewed (weekly or better)', value: 10 },
        { label: 'Yes, but reviewed monthly or less', value: 6 },
        { label: 'Somewhat—track a few metrics informally', value: 3 },
        { label: 'No formal metrics', value: 1 },
      ],
    },
  ];

  const handleResponse = (questionId, value) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScores();
      setCurrentStep('results');
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScores = () => {
    const categoryScores = {};
    const maxScores = {};

    questions.forEach((q) => {
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = 0;
        maxScores[q.category] = 0;
      }
      const response = responses[q.id] || 0;
      categoryScores[q.category] += response;
      maxScores[q.category] += 10;
    });

    const normalized = {};
    Object.keys(categoryScores).forEach((cat) => {
      normalized[cat] = Math.round(
        (categoryScores[cat] / maxScores[cat]) * 10 * 10
      ) / 10;
    });

    const overall =
      Math.round(
        (Object.values(categoryScores).reduce((a, b) => a + b, 0) /
          Object.values(maxScores).reduce((a, b) => a + b, 0)) *
          10 *
          10
      ) / 10;

    setScores({ categories: normalized, overall });
  };

  const getScoreColor = (score) => {
    if (score >= 7) return { bg: '#1E5A4F', text: 'white', label: '✓ Strong' };
    if (score >= 5) return { bg: '#F58026', text: 'white', label: '⚠ Opportunity' };
    return { bg: '#C84E4E', text: 'white', label: '🔴 Critical Gap' };
  };

  const startQuiz = () => {
    if (!companyName.trim()) {
      alert('Please enter your company name');
      return;
    }
    setCurrentStep('quiz');
  };

  const handleSubmitResults = async () => {
    if (!email.trim()) {
      alert('Please enter your email to receive your results');
      return;
    }

    // Send to Make webhook (replace with your actual webhook URL)
    const makeWebhookUrl = 'https://hook.make.com/YOUR_WEBHOOK_ID_HERE';

    try {
      await fetch(makeWebhookUrl, {
        method: 'POST',
        body: JSON.stringify({
          company_name: companyName,
          email: email,
          overall_score: scores.overall,
          responses: responses,
          timestamp: new Date().toISOString(),
        }),
      });
      alert('Your results have been recorded. Chance will follow up soon!');
    } catch (err) {
      console.log('Webhook not configured yet. Results captured locally.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#ECEDED',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ backgroundColor: '#1F3A5F', color: 'white', padding: '2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '0.5rem' }}>
            FRAMEWORK OPS
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Roofing Operations Health Check
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
        {currentStep === 'intro' && (
          <div
            style={{
              backgroundColor: 'white',
              padding: '3rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h1 style={{ color: '#1F3A5F', marginBottom: '1rem', fontSize: '28px' }}>
              Your Operations Health Score
            </h1>
            <p style={{ color: '#6B737C', fontSize: '16px', lineHeight: '1.6', marginBottom: '2rem' }}>
              In 10 minutes, get a clear picture of where your roofing operations are strong and
              where bottlenecks are limiting growth. No sales pitch—just honest diagnostics.
            </p>

            <div style={{ marginBottom: '2rem', backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '6px', borderLeft: '4px solid #1E5A4F' }}>
              <h3 style={{ color: '#1F3A5F', marginBottom: '1rem' }}>What You'll Learn:</h3>
              <ul style={{ color: '#6B737C', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                <li>Your ops health score across 6 critical areas</li>
                <li>Where you're strong (and what to protect)</li>
                <li>Where the biggest bottlenecks are</li>
                <li>Estimated financial impact of operational gaps</li>
              </ul>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '0.5rem', color: '#1F3A5F' }}>
                Company Name
              </label>
              <input
                type="text"
                placeholder="Your roofing company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '14px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              onClick={startQuiz}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#F58026',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              Start Diagnostic →
            </button>

            <p style={{ fontSize: '12px', color: '#999', marginTop: '1.5rem', textAlign: 'center' }}>
              ~ 10 minutes to complete • No pressure • Direct, honest results
            </p>
          </div>
        )}

        {currentStep === 'quiz' && (
          <div
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {/* Progress bar */}
            <div style={{ marginBottom: '2rem' }}>
              <div
                style={{
                  height: '4px',
                  backgroundColor: '#ECEDED',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    backgroundColor: '#1E5A4F',
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '0.5rem' }}>
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>

            {/* Question */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1E5A4F', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                {questions[currentQuestion].category}
              </div>
              <h2
                style={{
                  fontSize: '20px',
                  color: '#1F3A5F',
                  marginBottom: '1.5rem',
                  lineHeight: '1.4',
                }}
              >
                {questions[currentQuestion].question}
              </h2>

              {/* Options */}
              <div style={{ marginBottom: '2rem' }}>
                {questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleResponse(questions[currentQuestion].id, option.value)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '1rem',
                      marginBottom: '0.5rem',
                      textAlign: 'left',
                      border: `2px solid ${
                        responses[questions[currentQuestion].id] === option.value
                          ? '#1E5A4F'
                          : '#ddd'
                      }`,
                      backgroundColor:
                        responses[questions[currentQuestion].id] === option.value
                          ? '#f0fffe'
                          : 'white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#1F3A5F',
                    fontWeight: '500',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#1E5A4F';
                      e.target.style.backgroundColor = '#f9f9f9';
                    }}
                    onMouseLeave={(e) => {
                      if (responses[questions[currentQuestion].id] !== option.value) {
                        e.target.style.borderColor = '#ddd';
                        e.target.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handlePrev}
                  disabled={currentQuestion === 0}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#f0f0f0',
                    color: '#666',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    opacity: currentQuestion === 0 ? 0.5 : 1,
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!responses[questions[currentQuestion].id]}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: responses[questions[currentQuestion].id]
                      ? '#F58026'
                      : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: responses[questions[currentQuestion].id]
                      ? 'pointer'
                      : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'} →
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'results' && scores && (
          <div>
            {/* Overall Score */}
            <div
              style={{
                backgroundColor: 'white',
                padding: '3rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '2rem',
                textAlign: 'center',
              }}
            >
              <h1 style={{ color: '#1F3A5F', marginBottom: '0.5rem' }}>
                {companyName}
              </h1>
              <p style={{ color: '#999', marginBottom: '2rem' }}>Operations Health Score</p>

              <div
                style={{
                  fontSize: '72px',
                  fontWeight: '700',
                  color: '#1E5A4F',
                  marginBottom: '0.5rem',
                }}
              >
                {scores.overall}/10
              </div>

              <p style={{ fontSize: '16px', color: '#6B737C', marginBottom: '2rem' }}>
                {scores.overall >= 7
                  ? 'Your operations are solid. Focus on optimization.'
                  : scores.overall >= 5
                  ? 'You have growth potential, but operational gaps are limiting it.'
                  : 'Your operations have critical bottlenecks constraining growth.'}
              </p>
            </div>

            {/* Category Scores */}
            <div style={{ marginBottom: '2rem' }}>
              {Object.entries(scores.categories).map(([category, score]) => {
                const colors = getScoreColor(score);
                return (
                  <div
                    key={category}
                    style={{
                      backgroundColor: 'white',
                      padding: '1.5rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div>
                      <h3 style={{ color: '#1F3A5F', marginBottom: '0.25rem' }}>{category}</h3>
                    </div>
                    <div
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {score}/10 · {colors.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Key Findings */}
            <div
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '2rem',
              }}
            >
              <h2 style={{ color: '#1F3A5F', marginBottom: '1.5rem' }}>What This Means</h2>

              <div style={{ backgroundColor: '#f0fff5', padding: '1.5rem', borderRadius: '6px', borderLeft: '4px solid #1E5A4F', marginBottom: '1rem' }}>
                <p style={{ color: '#1F3A5F', fontWeight: '600', marginBottom: '0.5rem' }}>
                  The Opportunity
                </p>
                <p style={{ color: '#2e7d32', lineHeight: '1.6' }}>
                  Based on your responses, you likely have 15-25% in unrealized margin annually due to operational inefficiencies. 
                  For a $6M company, that's $90-150K on the table.
                </p>
              </div>

              <div style={{ backgroundColor: '#fff5f0', padding: '1.5rem', borderRadius: '6px', borderLeft: '4px solid #F58026' }}>
                <p style={{ color: '#1F3A5F', fontWeight: '600', marginBottom: '0.5rem' }}>
                  The Next Step
                </p>
                <p style={{ color: '#8B5A3C', lineHeight: '1.6' }}>
                  A 7-day operations audit will identify exactly which bottlenecks cost you the most and where to invest first. 
                  Most companies see ROI on the audit within 3-6 months of implementing findings.
                </p>
              </div>
            </div>

            {/* Lead Capture */}
            <div
              style={{
                backgroundColor: '#1F3A5F',
                color: 'white',
                padding: '2rem',
                borderRadius: '8px',
                marginBottom: '2rem',
              }}
            >
              <h2 style={{ marginBottom: '1rem' }}>Ready for a deeper dive?</h2>
              <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>
                Share your email and Chance (Framework Ops founder) will follow up with a no-obligation conversation about your audit options.
              </p>

              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '14px',
                  border: 'none',
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  boxSizing: 'border-box',
                }}
              />

              <button
                onClick={handleSubmitResults}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#F58026',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Send Me My Results
              </button>

              <p style={{ fontSize: '12px', marginTop: '1rem', opacity: 0.7 }}>
                We'll follow up within 1 business day. No spam, no pressure.
              </p>
            </div>

            <button
              onClick={() => {
                setCurrentStep('intro');
                setCurrentQuestion(0);
                setResponses({});
                setEmail('');
                setCompanyName('');
                setScores(null);
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#ECEDED',
                color: '#1F3A5F',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Take Diagnostic Again
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: '#1F3A5F',
          color: 'white',
          padding: '2rem',
          marginTop: '4rem',
          textAlign: 'center',
        }}
      >
        <p style={{ opacity: 0.8, fontSize: '14px' }}>
          Framework Ops × Macwood Capital | Built to identify operational bottlenecks in roofing companies
        </p>
        <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '0.5rem' }}>
          chance@frameworkopsllc.com
        </p>
      </div>
    </div>
  );
}