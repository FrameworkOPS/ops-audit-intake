// Framework Ops — Roofing Operations Audit
// Question bank, benchmarks, maturity model, and financial impact model.
//
// Scoring: every option carries a 1–10 value. Category score = mean of its
// question values (0–10 scale, one decimal). Benchmarks approximate a typical
// $2–10M roofing contractor and are shown alongside the client's score.

export const REVENUE_BANDS = [
  { id: 'lt1m', label: 'Under $1M', mid: 750_000 },
  { id: '1-3m', label: '$1M – $3M', mid: 2_000_000 },
  { id: '3-6m', label: '$3M – $6M', mid: 4_500_000 },
  { id: '6-10m', label: '$6M – $10M', mid: 8_000_000 },
  { id: '10-20m', label: '$10M – $20M', mid: 15_000_000 },
  { id: 'gt20m', label: '$20M+', mid: 25_000_000 },
];

export const TEAM_BANDS = [
  { id: '1-5', label: '1–5' },
  { id: '6-15', label: '6–15' },
  { id: '16-30', label: '16–30' },
  { id: '31-60', label: '31–60' },
  { id: '60+', label: '60+' },
];

export const MARKET_FOCUS = [
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'both', label: 'Both / Mixed' },
];

export const MATURITY_LEVELS = [
  {
    min: 0, max: 3.9, name: 'Reactive',
    summary:
      'Operations run on urgency and memory. The business depends heavily on the owner, and problems are discovered after they cost money. The upside: companies at this stage typically have the most recoverable margin.',
  },
  {
    min: 4, max: 5.9, name: 'Developing',
    summary:
      'Some systems exist, but they are inconsistent. Growth is possible but expensive — each new job adds friction, and margin leaks through handoffs, rework, and slow financial visibility.',
  },
  {
    min: 6, max: 7.4, name: 'Structured',
    summary:
      'Core processes are documented and mostly followed. The business runs without daily firefighting, but a handful of specific gaps still cap profitability and limit how fast you can scale.',
  },
  {
    min: 7.5, max: 8.9, name: 'Scalable',
    summary:
      'Operations are a competitive advantage. Systems, data, and people are aligned; the remaining work is optimization — squeezing more margin from a machine that already works.',
  },
  {
    min: 9, max: 10, name: 'Optimized',
    summary:
      'Best-in-class. Your operations outperform nearly every contractor we assess. The focus now is protecting what works while pursuing strategic growth.',
  },
];

// Benchmark distribution used for the percentile estimate
// (typical contractor overall score ≈ 5.5, sd ≈ 1.5).
export const BENCHMARK_MEAN = 5.5;
export const BENCHMARK_SD = 1.5;

// impactRate = share of annual revenue at stake in this category when the
// score is 0. Realized leakage scales with the gap: rate × (10 − score)/10 ×
// REALIZATION. Calibrated so a mid-scoring company shows ~2–4% of revenue.
export const REALIZATION = 0.3;

export const SECTIONS = [
  {
    id: 'sales',
    title: 'Sales & Estimating',
    short: 'Sales',
    benchmark: 5.8,
    impactRate: 0.035,
    description:
      'How predictably you turn leads into profitable, accurately-priced jobs.',
    insights: {
      strong:
        'Your sales engine is measured and repeatable — protect it by documenting what top performers do differently.',
      mid:
        'Sales works, but it depends on individual effort rather than a system. Tightening estimating discipline and pipeline visibility is usually a fast win.',
      low:
        'Revenue is unpredictable because the front end of the business is unmanaged. Estimating and pipeline gaps here compound into every downstream problem.',
    },
    questions: [
      {
        id: 'sales_pipeline',
        question: 'How much visibility do you have into your sales pipeline?',
        options: [
          { label: 'Full pipeline in a CRM — stages, values, close dates', value: 10 },
          { label: 'A list of open quotes we review sometimes', value: 6 },
          { label: 'It lives in the salesperson’s head or inbox', value: 3 },
          { label: 'We react to whatever comes in', value: 1 },
        ],
        rec: 'Stand up a simple pipeline (even a shared board) with stages and dollar values. You can’t forecast crews or cash without knowing what’s coming.',
      },
      {
        id: 'sales_close',
        question: 'Do you know your close rate — and does it get reviewed?',
        options: [
          { label: 'Yes — tracked by rep and lead source, reviewed regularly', value: 10 },
          { label: 'We know it roughly for the company overall', value: 6 },
          { label: 'We could work it out, but nobody looks at it', value: 3 },
          { label: 'No idea', value: 1 },
        ],
        rec: 'Track close rate by lead source monthly. It tells you where to spend marketing dollars and which reps need coaching — two of the highest-leverage numbers in the business.',
      },
      {
        id: 'sales_estimating',
        question: 'How are jobs estimated and priced?',
        options: [
          { label: 'Standardized templates or software with current costs', value: 10 },
          { label: 'Spreadsheet templates, updated occasionally', value: 6 },
          { label: 'Each estimator does it their own way', value: 3 },
          { label: 'Mostly experience and gut feel', value: 1 },
        ],
        rec: 'Standardize estimating on one template with current material and labor costs. Inconsistent estimating is the #1 upstream cause of margin erosion.',
      },
      {
        id: 'sales_pricing',
        question: 'When did you last review pricing against actual costs?',
        options: [
          { label: 'Within the last quarter — it’s a standing review', value: 10 },
          { label: 'Within the last year', value: 6 },
          { label: 'It’s been a couple of years', value: 3 },
          { label: 'Pricing hasn’t formally changed in a long time', value: 1 },
        ],
        rec: 'Put a quarterly pricing review on the calendar. Material and labor costs move faster than most contractors reprice — the difference comes straight out of margin.',
      },
      {
        id: 'sales_followup',
        question: 'What happens to quotes that don’t close right away?',
        options: [
          { label: 'Systematic follow-up sequence until won or dead', value: 10 },
          { label: 'We follow up once or twice manually', value: 6 },
          { label: 'Follow-up happens if someone remembers', value: 3 },
          { label: 'They just go quiet', value: 1 },
        ],
        rec: 'Build a simple 3-touch follow-up sequence for open quotes. For most contractors this is the cheapest revenue available — the estimate is already done.',
      },
    ],
  },
  {
    id: 'production',
    title: 'Production & Capacity',
    short: 'Production',
    benchmark: 5.6,
    impactRate: 0.04,
    description:
      'How efficiently work moves through the field — scheduling, utilization, and throughput.',
    insights: {
      strong:
        'Your field engine runs well. The opportunity is squeezing more billable days from the capacity you already have.',
      mid:
        'Production gets jobs done, but scheduling friction and utilization gaps quietly cap how much work you can take on.',
      low:
        'Field capacity is your growth ceiling right now. Scheduling and utilization problems mean you’re paying for capacity you can’t bill.',
    },
    questions: [
      {
        id: 'prod_utilization',
        question: 'What percentage of time are your crews billable / productive?',
        options: [
          { label: '85–100% — consistently booked', value: 10 },
          { label: '70–84% — mostly full with some gaps', value: 7 },
          { label: '55–69% — noticeable idle time', value: 4 },
          { label: 'Below 55% or we don’t know', value: 1 },
        ],
        rec: 'Measure crew utilization weekly. Every unbilled crew-day is pure cost — most contractors find 10–15% recoverable capacity as soon as they start measuring it.',
      },
      {
        id: 'prod_scheduling',
        question: 'How are jobs scheduled and crews assigned?',
        options: [
          { label: 'Scheduling software everyone can see', value: 10 },
          { label: 'Shared spreadsheet or calendar', value: 6 },
          { label: 'Mostly phone calls and texts', value: 3 },
          { label: 'Owner/manager decides day to day', value: 1 },
        ],
        rec: 'Move scheduling to a single shared system. When the schedule lives in one person’s head, every change creates confusion, idle crews, and missed commitments.',
      },
      {
        id: 'prod_ontime',
        question: 'How often do jobs finish on the schedule you promised?',
        options: [
          { label: 'Almost always — we plan buffers deliberately', value: 10 },
          { label: 'Usually, with occasional slips', value: 7 },
          { label: 'Slips are common; customers notice', value: 4 },
          { label: 'Schedules are more hope than plan', value: 1 },
        ],
        rec: 'Track promised vs. actual completion on every job. On-time performance drives referrals, cash collection speed, and crew morale simultaneously.',
      },
      {
        id: 'prod_bottleneck',
        question: 'What limits your ability to take on more work?',
        options: [
          { label: 'Nothing structural — we can scale up', value: 10 },
          { label: 'Crew availability / hiring', value: 6 },
          { label: 'Material or equipment constraints', value: 5 },
          { label: 'Owner / management capacity', value: 3 },
          { label: 'All of the above', value: 1 },
        ],
        rec: 'Name your #1 constraint and manage it deliberately. If the constraint is management capacity, no amount of hiring crews will let you grow — the fix is delegation and systems.',
      },
      {
        id: 'prod_timeline',
        question: 'How long from signed contract to job completion?',
        options: [
          { label: 'Under 2 weeks — tight and predictable', value: 9 },
          { label: '2–4 weeks', value: 7 },
          { label: '4–8 weeks', value: 5 },
          { label: '8+ weeks or unpredictable', value: 2 },
        ],
        rec: 'Map your contract-to-completion timeline and find where jobs sit idle. Long, unpredictable lead times lose customers to faster competitors and delay every dollar of cash.',
      },
    ],
  },
  {
    id: 'handoff',
    title: 'Sales-to-Production Handoff',
    short: 'Handoff',
    benchmark: 5.0,
    impactRate: 0.025,
    description:
      'How cleanly sold scope becomes built scope — the seam where most rework is born.',
    insights: {
      strong:
        'Your handoff is disciplined — a rarity. Keep the standard alive as you add estimators and crews.',
      mid:
        'The handoff works when people are careful, but it isn’t a system. Every miscommunication here becomes rework, change-order friction, or eaten cost.',
      low:
        'The sales-to-production seam is leaking badly. This is usually the fastest category to fix and one of the quickest paybacks in the whole audit.',
    },
    questions: [
      {
        id: 'handoff_process',
        question: 'How is project scope communicated to crews?',
        options: [
          { label: 'Standardized kickoff — docs, photos, scope sheet', value: 10 },
          { label: 'Email and sometimes a call', value: 6 },
          { label: 'Mostly phone / text', value: 3 },
          { label: 'Crew figures it out on site', value: 1 },
        ],
        rec: 'Create a one-page job packet (scope, materials, photos, access notes) that no job starts without. It’s the single cheapest rework-prevention tool that exists.',
      },
      {
        id: 'handoff_rework',
        question: 'How often does scope miscommunication cause rework?',
        options: [
          { label: 'Rarely — under 5% of jobs', value: 10 },
          { label: 'Occasionally — 5–15%', value: 6 },
          { label: 'Frequently — 15–30%', value: 3 },
          { label: 'Often — 30%+', value: 1 },
        ],
        rec: 'Log every rework event with its cause for 60 days. Rework is margin you already earned and then gave back — most of it traces to the same 2–3 handoff failures.',
      },
      {
        id: 'handoff_changeorders',
        question: 'How are change orders handled when scope shifts mid-job?',
        options: [
          { label: 'Documented, priced, and signed before work continues', value: 10 },
          { label: 'Usually documented, sometimes after the fact', value: 6 },
          { label: 'Verbal agreement, billed at the end (sometimes)', value: 3 },
          { label: 'We mostly eat the cost', value: 1 },
        ],
        rec: 'Adopt a no-signature-no-work change order rule. Contractors who enforce it typically recover 1–3% of annual revenue that was silently being given away.',
      },
      {
        id: 'handoff_documentation',
        question: 'Is there a documented handoff procedure people actually follow?',
        options: [
          { label: 'Yes — documented and consistently followed', value: 10 },
          { label: 'Documented, but compliance varies', value: 6 },
          { label: 'Minimal documentation exists', value: 3 },
          { label: 'No formal process', value: 1 },
        ],
        rec: 'Write the handoff checklist with the people who do it, keep it to one page, and make it the gate for scheduling. Documentation nobody follows is the same as none.',
      },
    ],
  },
  {
    id: 'costing',
    title: 'Job Costing & Profitability',
    short: 'Job Costing',
    benchmark: 4.9,
    impactRate: 0.045,
    description:
      'Whether you know — while you can still act — which jobs make money and why.',
    insights: {
      strong:
        'You have real-time margin visibility most contractors never build. Use it to prune unprofitable job types and double down on winners.',
      mid:
        'You learn job profitability eventually — which means too late to fix the job that’s bleeding. Faster costing feedback is the highest-ROI system you can build.',
      low:
        'You’re flying blind on the most important number in the business. Until job-level costing exists, every other improvement is guesswork.',
    },
    questions: [
      {
        id: 'cost_tracking',
        question: 'How are job costs tracked?',
        options: [
          { label: 'Real-time in software (QuickBooks job costing, JobNimbus, etc.)', value: 10 },
          { label: 'Reviewed monthly in accounting software', value: 6 },
          { label: 'Spreadsheets, maintained irregularly', value: 4 },
          { label: 'No formal system — we find out at invoicing', value: 1 },
        ],
        rec: 'Turn on job-level cost tracking in the tools you already own. Even weekly cost coding beats discovering a blown budget at invoice time.',
      },
      {
        id: 'cost_visibility',
        question: 'When do you know whether a job was profitable?',
        options: [
          { label: 'During the job — real-time', value: 10 },
          { label: 'Within a week of completion', value: 7 },
          { label: 'At the monthly accounting review', value: 4 },
          { label: 'After the final invoice is paid (or never)', value: 1 },
        ],
        rec: 'Institute a 48-hour job cost review after every completion while details are fresh. Speed of feedback is what turns costing data into changed behavior.',
      },
      {
        id: 'cost_variance',
        question: 'How often do jobs come in over budget?',
        options: [
          { label: 'Rarely — under 5%', value: 9 },
          { label: 'Occasionally — 5–15%', value: 6 },
          { label: 'Frequently — 15–30%', value: 3 },
          { label: 'Often — 30%+ (or unknown)', value: 1 },
        ],
        rec: 'Compare estimated vs. actual on every job and review the top 3 misses monthly. Budget overruns cluster — the same causes repeat until someone looks.',
      },
      {
        id: 'cost_margin',
        question: 'What’s your typical gross margin on jobs?',
        options: [
          { label: '40%+ ', value: 10 },
          { label: '30–39%', value: 7 },
          { label: '20–29%', value: 4 },
          { label: 'Below 20% or not sure', value: 1 },
        ],
        rec: 'Establish your true gross margin by job type. Healthy roofing operations run 35–45% gross — if you’re below 30%, either pricing or production costs need surgery.',
      },
      {
        id: 'cost_erosion',
        question: 'Do you know where margin is lost — specifically?',
        options: [
          { label: 'Yes — we track erosion by cause and attack the biggest', value: 10 },
          { label: 'We have a good informed hunch', value: 6 },
          { label: 'We see the total slip but not the why', value: 3 },
          { label: 'Not sure — that’s the problem', value: 1 },
        ],
        rec: 'Break margin erosion into causes: labor overruns, material waste, rework, scope creep, callbacks. You can’t fix "margin is down" — you can fix "labor ran 12% over on tear-offs."',
      },
    ],
  },
  {
    id: 'team',
    title: 'Team & Leadership',
    short: 'Team',
    benchmark: 5.4,
    impactRate: 0.03,
    description:
      'Whether the business runs on systems and people — or entirely on you.',
    insights: {
      strong:
        'You’ve built an organization, not just a crew list. The leverage now is developing the next layer of leaders.',
      mid:
        'The team functions, but too much still routes through the owner. Clarifying roles and installing a meeting rhythm typically frees 10+ owner-hours a week.',
      low:
        'The business is owner-dependent to a degree that caps growth and destroys resale value. Structure, delegation, and rhythm are the priority — before more sales.',
    },
    questions: [
      {
        id: 'team_structure',
        question: 'How clear is your organizational structure?',
        options: [
          { label: 'Clear roles, documented accountabilities', value: 10 },
          { label: 'Mostly clear, informally defined', value: 6 },
          { label: 'Fuzzy — roles overlap and gaps appear', value: 3 },
          { label: 'No real structure — everyone does everything', value: 1 },
        ],
        rec: 'Draw the accountability chart — every seat, one owner, measurable outcomes. Most "people problems" turn out to be structure problems wearing a disguise.',
      },
      {
        id: 'team_owner',
        question: 'If you stepped away for two weeks, what would happen?',
        options: [
          { label: 'Business runs normally — it’s been tested', value: 10 },
          { label: 'Mostly fine, with a backlog waiting for me', value: 7 },
          { label: 'Serious problems within days', value: 3 },
          { label: 'It would effectively stop', value: 1 },
        ],
        rec: 'List every decision only you can make, then systematically delegate the bottom half with written guardrails. Owner-dependence is the most expensive bottleneck in the company.',
      },
      {
        id: 'team_time',
        question: 'How is your time split between operations and strategy?',
        options: [
          { label: 'Mostly strategic — 70%+ working on the business', value: 10 },
          { label: 'Roughly balanced', value: 6 },
          { label: 'Mostly operational — 70%+ in the weeds', value: 3 },
          { label: 'All operational — strategy never happens', value: 1 },
        ],
        rec: 'Block four protected hours a week for working on the business. If the owner is the best-paid field coordinator in the company, growth is structurally impossible.',
      },
      {
        id: 'team_turnover',
        question: 'What’s your annual team turnover?',
        options: [
          { label: 'Under 10%', value: 10 },
          { label: '10–25%', value: 7 },
          { label: '25–50%', value: 4 },
          { label: 'Over 50% or not tracked', value: 1 },
        ],
        rec: 'Calculate the fully-loaded cost of each departure (recruiting, training, lost productivity — typically $8–15K per field employee). Retention is an ops metric, not an HR nicety.',
      },
      {
        id: 'team_meetings',
        question: 'Does leadership meet on a regular rhythm?',
        options: [
          { label: 'Weekly structured meeting with scorecard and issues list', value: 10 },
          { label: 'Regular but loosely structured', value: 6 },
          { label: 'Only when there’s a problem', value: 2 },
          { label: 'No recurring meetings', value: 1 },
        ],
        rec: 'Install a 45-minute weekly leadership meeting: numbers first, then the issue list. It’s the operating system every other improvement in this report runs on.',
      },
    ],
  },
  {
    id: 'tech',
    title: 'Technology & Systems',
    short: 'Technology',
    benchmark: 5.2,
    impactRate: 0.02,
    description:
      'Whether your tools multiply your team’s effort — or create duplicate work.',
    insights: {
      strong:
        'Your stack is integrated and adopted — the hard part. Now push toward automation of the remaining manual handoffs.',
      mid:
        'You own decent tools but they’re under-adopted or disconnected, so people re-enter the same data in multiple places. Consolidation beats new purchases.',
      low:
        'The business runs on paper, memory, and heroics. The goal isn’t fancy software — it’s one source of truth for jobs, customers, and money.',
    },
    questions: [
      {
        id: 'tech_stack',
        question: 'How integrated is your technology stack?',
        options: [
          { label: 'Fully integrated — systems talk to each other', value: 10 },
          { label: 'Mostly integrated with manual workarounds', value: 6 },
          { label: 'Multiple systems, manual re-entry between them', value: 3 },
          { label: 'Disconnected — duplicate data entry everywhere', value: 1 },
        ],
        rec: 'Map every place the same data gets typed twice. Each duplicate entry point is wasted hours and an error source — integrate or eliminate, tool by tool.',
      },
      {
        id: 'tech_crm',
        question: 'Is a CRM / job management system actually used?',
        options: [
          { label: 'Yes — the team lives in it daily', value: 9 },
          { label: 'Yes, but inconsistently', value: 5 },
          { label: 'We bought one; it’s mostly abandoned', value: 2 },
          { label: 'No — email and spreadsheets', value: 1 },
        ],
        rec: 'Pick one system as the source of truth and make it the only place work is official. Half-adopted software is worse than none — it splits reality in two.',
      },
      {
        id: 'tech_accounting',
        question: 'How is accounting set up?',
        options: [
          { label: 'Cloud accounting with job costing enabled', value: 10 },
          { label: 'Cloud accounting, basic setup', value: 6 },
          { label: 'Spreadsheet-based', value: 3 },
          { label: 'Minimal — cash in, cash out', value: 1 },
        ],
        rec: 'Get accounting onto QuickBooks Online or Xero with job costing and a contractor-savvy bookkeeper. Every financial insight in this report depends on this foundation.',
      },
      {
        id: 'tech_automation',
        question: 'How much of your admin workflow is automated?',
        options: [
          { label: 'Significant — saves 10+ hours a week', value: 10 },
          { label: 'Some — saves 5–10 hours a week', value: 6 },
          { label: 'Minimal automation', value: 3 },
          { label: 'Manual processes throughout', value: 1 },
        ],
        rec: 'Automate the top three repetitive admin tasks first (appointment reminders, invoice follow-ups, review requests). Each is a one-day setup that pays back weekly forever.',
      },
    ],
  },
  {
    id: 'financial',
    title: 'Financial Visibility & Cash Flow',
    short: 'Financials',
    benchmark: 4.8,
    impactRate: 0.025,
    description:
      'How fast the numbers reach you — and whether cash is managed or discovered.',
    insights: {
      strong:
        'You run the business on current numbers — a genuine competitive advantage. Layer in rolling forecasts to make growth decisions with confidence.',
      mid:
        'The books close eventually, but decisions are made on stale or partial data. Speeding up the close and tracking a weekly scorecard changes what you can see.',
      low:
        'Financial blindness is compounding every other gap in this report. Fast, accurate numbers are the prerequisite for fixing anything else with confidence.',
    },
    questions: [
      {
        id: 'fin_reporting',
        question: 'How quickly do you know monthly profitability?',
        options: [
          { label: 'Within 2–3 days of month end', value: 10 },
          { label: 'Within 1–2 weeks', value: 7 },
          { label: '3–4 weeks', value: 4 },
          { label: '30+ days, or we don’t really close months', value: 1 },
        ],
        rec: 'Set a 5-business-day close deadline with your bookkeeper. Numbers you get five weeks late describe a business that no longer exists.',
      },
      {
        id: 'fin_metrics',
        question: 'Are key operating metrics tracked and reviewed?',
        options: [
          { label: 'Weekly scorecard — margin, utilization, pipeline, cash', value: 10 },
          { label: 'Reviewed monthly or less', value: 6 },
          { label: 'A few metrics, informally', value: 3 },
          { label: 'No formal metrics', value: 1 },
        ],
        rec: 'Build a one-page weekly scorecard with 5–8 numbers: sales, gross margin %, crew utilization, AR over 30 days, cash. What gets watched weekly gets managed.',
      },
      {
        id: 'fin_ar',
        question: 'How fast do you collect after invoicing?',
        options: [
          { label: 'Under 15 days average — collections are systematic', value: 10 },
          { label: '15–30 days', value: 7 },
          { label: '30–60 days', value: 4 },
          { label: '60+ days, or AR isn’t really tracked', value: 1 },
        ],
        rec: 'Invoice same-day on completion and automate reminders at 7/14/21 days. Cutting collection time from 45 to 20 days is often worth more than a new crew.',
      },
      {
        id: 'fin_cashflow',
        question: 'Do you forecast cash flow forward?',
        options: [
          { label: 'Yes — 8–13 week rolling forecast, updated weekly', value: 10 },
          { label: 'Rough forward look, updated sometimes', value: 6 },
          { label: 'We watch the bank balance', value: 3 },
          { label: 'Cash surprises us regularly', value: 1 },
        ],
        rec: 'Start a simple 8-week cash forecast: expected in, committed out, week by week. Roofing is seasonal and lumpy — cash surprises are optional, not inevitable.',
      },
    ],
  },
  {
    id: 'customer',
    title: 'Customer Experience & Warranty',
    short: 'Customer',
    benchmark: 5.5,
    impactRate: 0.02,
    description:
      'Whether finished jobs generate referrals and reviews — or callbacks and silence.',
    insights: {
      strong:
        'Your customer machine compounds — reviews and referrals are lowering your acquisition cost every month. Protect the callback discipline that drives it.',
      mid:
        'Customers are satisfied but under-leveraged. A systematic review-and-referral process turns finished jobs into your cheapest lead source.',
      low:
        'Every job ends at final payment and the relationship value is left on the roof. Callbacks and quiet customers are a margin and marketing problem at once.',
    },
    questions: [
      {
        id: 'cust_communication',
        question: 'How are customers kept informed during a job?',
        options: [
          { label: 'Proactive updates at set milestones — every job', value: 10 },
          { label: 'Updates happen, but depend on who runs the job', value: 6 },
          { label: 'We respond when customers ask', value: 3 },
          { label: 'Communication is a common complaint', value: 1 },
        ],
        rec: 'Script 3–4 standard touchpoints (scheduled, starting, mid-job, walkthrough) and automate what you can. Communication is the cheapest driver of five-star reviews.',
      },
      {
        id: 'cust_callbacks',
        question: 'How often do warranty callbacks occur?',
        options: [
          { label: 'Rarely — under 3% of jobs, and tracked', value: 10 },
          { label: 'Occasionally — 3–8%', value: 7 },
          { label: 'Regularly — 8–15%', value: 3 },
          { label: 'Frequently, or we don’t track them', value: 1 },
        ],
        rec: 'Track callback rate by crew and by cause. Callbacks are unpaid rework plus reputation damage — the crews and details that generate them are knowable.',
      },
      {
        id: 'cust_reviews',
        question: 'Is there a system for collecting reviews and referrals?',
        options: [
          { label: 'Yes — automated ask after every job, tracked', value: 10 },
          { label: 'We ask when we remember', value: 5 },
          { label: 'Reviews happen organically only', value: 3 },
          { label: 'No — and our online presence shows it', value: 1 },
        ],
        rec: 'Automate the review request at final walkthrough while enthusiasm is peak. Going from 2 to 10 reviews a month measurably moves close rate and lead flow.',
      },
      {
        id: 'cust_followup',
        question: 'What happens after final payment?',
        options: [
          { label: 'Structured follow-up — check-ins, maintenance offers, referral asks', value: 10 },
          { label: 'Occasional follow-up for some customers', value: 6 },
          { label: 'A thank-you, then nothing', value: 3 },
          { label: 'Nothing — the relationship ends at payment', value: 1 },
        ],
        rec: 'Build a simple post-job sequence: 30-day check-in, annual inspection offer, referral ask. Past customers are the highest-margin revenue you will ever access.',
      },
    ],
  },
];

export const ALL_QUESTIONS = SECTIONS.flatMap((s) =>
  s.questions.map((q) => ({ ...q, sectionId: s.id, sectionTitle: s.title }))
);

export const TOTAL_QUESTIONS = ALL_QUESTIONS.length;

// ---------- scoring ----------

export function scoreAudit(responses) {
  const categories = SECTIONS.map((s) => {
    const vals = s.questions.map((q) => responses[q.id] ?? 0);
    const score = Math.round((vals.reduce((a, b) => a + b, 0) / s.questions.length) * 10) / 10;
    return {
      id: s.id,
      title: s.title,
      short: s.short,
      score,
      benchmark: s.benchmark,
      delta: Math.round((score - s.benchmark) * 10) / 10,
    };
  });
  const overall =
    Math.round(
      (categories.reduce((a, c) => a + c.score, 0) / categories.length) * 10
    ) / 10;
  return { categories, overall };
}

export function maturityFor(overall) {
  return (
    MATURITY_LEVELS.find((l) => overall >= l.min && overall <= l.max) ||
    MATURITY_LEVELS[0]
  );
}

export function statusFor(score) {
  if (score >= 7) return { key: 'strong', label: 'Strong', icon: '✓' };
  if (score >= 5) return { key: 'opportunity', label: 'Opportunity', icon: '▲' };
  return { key: 'critical', label: 'Critical gap', icon: '✕' };
}

// Percentile vs. the benchmark distribution (normal approximation).
export function percentileFor(overall) {
  const z = (overall - BENCHMARK_MEAN) / BENCHMARK_SD;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return Math.min(99, Math.max(1, Math.round(p * 100)));
}

// Estimated annual margin at risk, per category and total, given a revenue band.
export function impactModel(categories, revenueBandId) {
  const band = REVENUE_BANDS.find((b) => b.id === revenueBandId);
  if (!band) return null;
  const items = SECTIONS.map((s) => {
    const cat = categories.find((c) => c.id === s.id);
    const gap = Math.max(0, 10 - cat.score) / 10;
    const amount = band.mid * s.impactRate * gap * REALIZATION;
    return { id: s.id, title: s.title, short: s.short, amount, score: cat.score };
  }).sort((a, b) => b.amount - a.amount);
  const total = items.reduce((a, i) => a + i.amount, 0);
  return {
    band,
    items,
    low: total * 0.7,
    high: total * 1.15,
  };
}

export function formatMoney(n) {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `$${m >= 10 ? Math.round(m) : m.toFixed(1)}M`;
  }
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

// Ranked priorities: benchmark-relative gap weighted by financial impact rate.
export function prioritiesFor(responses, categories, count = 5) {
  return SECTIONS.map((s) => {
    const cat = categories.find((c) => c.id === s.id);
    const weakest = s.questions
      .map((q) => ({ q, val: responses[q.id] ?? 0 }))
      .sort((a, b) => a.val - b.val)
      .slice(0, 2)
      .filter((x) => x.val <= 6);
    return {
      id: s.id,
      title: s.title,
      short: s.short,
      score: cat.score,
      benchmark: s.benchmark,
      severity: (10 - cat.score) * s.impactRate * 100,
      insight: s.insights[cat.score >= 7.5 ? 'strong' : cat.score >= 5 ? 'mid' : 'low'],
      actions: weakest.map((x) => x.q.rec),
    };
  })
    .filter((p) => p.score < 7.5)
    .sort((a, b) => b.severity - a.severity)
    .slice(0, count);
}
