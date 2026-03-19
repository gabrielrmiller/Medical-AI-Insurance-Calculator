import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronsDown,
  LineChart as LineChartIcon,
  Scale,
  Shield,
  Sigma,
} from 'lucide-react'
import '../App.css'

type SectionId =
  | 'hero'
  | 'problem'
  | 'analogy'
  | 'model'
  | 'multiplier'
  | 'assumptions'
  | 'about'

function useRevealOnScroll() {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!nodes.length) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).dataset.reveal = 'shown'
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
    )

    for (const n of nodes) io.observe(n)
    return () => io.disconnect()
  }, [])

  return rootRef
}

const lossRatioSeries = [
  { year: 2010, ratio: 51.0 },
  { year: 2011, ratio: 54.68 },
  { year: 2012, ratio: 60.65 },
  { year: 2013, ratio: 59.42 },
  { year: 2014, ratio: 60.9 },
  { year: 2015, ratio: 65.5 },
  { year: 2016, ratio: 73.21 },
  { year: 2017, ratio: 70.77 },
  { year: 2018, ratio: 68.4 },
  { year: 2019, ratio: 79.83 },
  { year: 2020, ratio: 78.26 },
  { year: 2021, ratio: 74.21 },
  { year: 2022, ratio: 73.2 },
  { year: 2023, ratio: 72.59 },
  { year: 2024, ratio: 71.05 },
]

function formatPct(v: number) {
  return `${v.toFixed(2)}%`
}

function scrollToSection(id: SectionId) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Explainer() {
  const rootRef = useRevealOnScroll()

  return (
    <div className="explainer-root" ref={rootRef}>
      <header className="topbar">
        <div className="topbar-left">
          <div className="brand-mark" aria-hidden="true">
            <Activity size={16} />
          </div>
          <div className="brand">
            <div className="brand-title">Medical AI Insurance Calculator</div>
            <div className="brand-subtitle">
              The first actuarial framework for pricing AI health bot malpractice liability — built
              on 15 years of NAIC medical professional liability data across 54 US jurisdictions.
            </div>
          </div>
        </div>

        <nav className="topbar-nav" aria-label="Primary navigation">
          <NavLink className="nav-pill" to="/" end>
            Calculator
          </NavLink>
          <NavLink className="nav-pill" to="/explainer">
            Explanation
          </NavLink>
        </nav>
      </header>

      <main className="explainer-main fullbleed">
        <section id="hero" className="explainer-section explainer-hero">
          <div className="explainer-hero-grid">
            <div className="explainer-hero-copy" data-reveal="hidden">
              <div className="explainer-kicker">
                <Sigma size={16} /> Actuarial pricing, adapted for AI
              </div>
              <h1>What does it cost to insure an AI doctor?</h1>
              <p className="explainer-lede">
                A clean, defensible framework for pricing <b>AI health bot medical malpractice
                liability</b> — built on the closest available analogue: U.S. medical professional
                liability experience.
              </p>
              <div className="explainer-hero-actions">
                <Link className="explainer-cta-primary" to="/">
                  Open the calculator <ArrowRight size={16} />
                </Link>
                <button
                  className="explainer-cta-secondary"
                  type="button"
                  onClick={() => scrollToSection('problem')}
                >
                  Read the model story <ChevronsDown size={16} />
                </button>
              </div>
              <div className="explainer-microproof">
                <div className="pill">
                  <CheckCircle2 size={16} />
                  Uses NAIC (2010–2024) experience as baseline
                </div>
                <div className="pill">
                  <CheckCircle2 size={16} />
                  Explicit frequency × severity chain
                </div>
                <div className="pill pill-accent">
                  <CheckCircle2 size={16} />
                  Green outputs for premium focus
                </div>
              </div>
            </div>

            <div className="explainer-hero-card" data-reveal="hidden">
              <div className="explainer-hero-card-title">Model at a glance</div>
              <div className="flow-mini">
                <div className="flow-mini-step">
                  <div className="flow-mini-label">Bot type</div>
                  <div className="flow-mini-value">Accuracy → error rate</div>
                </div>
                <div className="flow-mini-step">
                  <div className="flow-mini-label">Frequency</div>
                  <div className="flow-mini-value">Error × harm × claim × payout</div>
                </div>
                <div className="flow-mini-step">
                  <div className="flow-mini-label">Severity</div>
                  <div className="flow-mini-value">Average paid claim size</div>
                </div>
                <div className="flow-mini-step">
                  <div className="flow-mini-label">Geo & trend</div>
                  <div className="flow-mini-value">Tier loading + slope × lag</div>
                </div>
                <div className="flow-mini-step flow-mini-step-accent">
                  <div className="flow-mini-label">Premium</div>
                  <div className="flow-mini-value">Expected loss ÷ (1 − expense loading)</div>
                </div>
              </div>
              <div className="explainer-hero-card-foot">
                <span>Consultancy-grade narrative.</span>
                <span className="muted">Minimal assumptions, clearly stated.</span>
              </div>
            </div>
          </div>
        </section>

        <section id="problem" className="explainer-section">
          <div className="explainer-section-head" data-reveal="hidden">
            <div className="section-icon">
              <Scale size={18} />
            </div>
            <h2>The problem</h2>
            <p>
              AI health bots are moving into clinical settings with <b>no actuarial loss history</b>.
              Insurers can’t price what they can’t benchmark — and that becomes a deployment blocker.
            </p>
          </div>

          <div className="two-col" data-reveal="hidden">
            <div className="card">
              <div className="card-title">Why it matters</div>
              <p className="card-text">
                Without liability coverage, hospitals face an unbounded tail risk. That slows
                adoption, which delays the benefits people actually care about: access, triage,
                and preventive guidance at scale.
              </p>
            </div>
            <div className="card card-accent">
              <div className="card-title">Insurance is infrastructure</div>
              <p className="card-text">
                Think of malpractice insurance as the missing layer between “promising AI” and
                “deployable AI.” Pricing creates a path for underwriting, capacity, and safe
                adoption incentives.
              </p>
            </div>
          </div>
        </section>

        <section id="analogy" className="explainer-section">
          <div className="explainer-section-head" data-reveal="hidden">
            <div className="section-icon">
              <LineChartIcon size={18} />
            </div>
            <h2>The analogy</h2>
            <p>
              We anchor the model to NAIC medical professional liability data (2010–2024, U.S.
              jurisdictions) as the closest human analogue.
            </p>
          </div>

          <div className="two-col" data-reveal="hidden">
            <div className="card">
              <div className="card-title">Loss ratio, in plain English</div>
              <p className="card-text card-text-lede">
                A loss ratio is the share of premium that goes back out the door in claims and
                claim-handling costs. Higher ratios mean more of the premium is consumed by losses,
                leaving less margin for expenses and profit.
              </p>
            </div>

            <div className="card">
              <div className="card-title">Loss &amp; DCC ratio trend</div>
              <div className="chart-wrap" aria-label="Loss ratio line chart">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart
                    data={lossRatioSeries}
                    margin={{ top: 10, right: 28, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis
                      dataKey="year"
                      interval="preserveStartEnd"
                      tickCount={7}
                      minTickGap={10}
                      padding={{ left: 4, right: 10 }}
                      tick={{
                        fill: 'rgba(255,255,255,0.7)',
                        fontSize: 10,
                        angle: -35,
                        textAnchor: 'end',
                      }}
                      tickMargin={6}
                      axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                      tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                    />
                    <YAxis
                      tickFormatter={(v) => `${v}%`}
                      domain={[45, 85]}
                      tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                      tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                    />
                    <Tooltip
                      formatter={(v) => [formatPct(Number(v ?? 0)), 'Loss & DCC ratio']}
                      labelFormatter={(l) => `Year ${l}`}
                      contentStyle={{
                        background: 'rgba(10, 14, 26, 0.92)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 10,
                        color: 'rgba(255,255,255,0.9)',
                      }}
                    />
                    {/* Mean intentionally not shown as a hardcoded number */}

                    {/* (Removed special-date annotations for cleaner small-width layout) */}

                    <Line
                      type="monotone"
                      dataKey="ratio"
                      stroke="rgba(34,197,94,0.95)"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        <section id="model" className="explainer-section">
          <div className="explainer-section-head" data-reveal="hidden">
            <div className="section-icon">
              <Sigma size={18} />
            </div>
            <h2>The model — how it works</h2>
            <p>
              The pricing engine is intentionally simple: <b>frequency × severity</b>, then apply
              <b> geographic</b> and <b>trend</b> adjustments, then load for expenses &amp; profit.
            </p>
          </div>

          <div className="flow" data-reveal="hidden">
            <div className="flow-step">
              <div className="flow-step-body">
                <div className="flow-step-title">Step 1: Bot type → accuracy (source: PMC12047852)</div>
                <div className="flow-step-subtitle">
                  Accuracy determines error rate.
                </div>
                <div className="big-metrics">
                  <div className="big-metric">
                    <div className="big-metric-label">Triage</div>
                    <div className="big-metric-value">97.8%</div>
                  </div>
                  <div className="big-metric">
                    <div className="big-metric-label">Diagnostic</div>
                    <div className="big-metric-value">61.4%</div>
                  </div>
                  <div className="big-metric">
                    <div className="big-metric-label">Treatment</div>
                    <div className="big-metric-value">25.0%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flow-step">
              <div className="flow-step-body">
                <div className="flow-step-title">Step 2: Frequency chain</div>
                <div className="flow-formula">
                  Error Rate × Harm Rate × Claim Rate × AI Litigation Multiplier × Payout Rate
                </div>
              </div>
            </div>

            <div className="flow-step">
              <div className="flow-step-body">
                <div className="flow-step-title">Step 3: Severity</div>
                <div className="flow-formula">Average paid claim size (NPDB data)</div>
              </div>
            </div>

            <div className="flow-step">
              <div className="flow-step-body">
                <div className="flow-step-title">Step 4: Geographic loading (example states)</div>
                <div className="table">
                  <div className="table-row table-head">
                    <div>State</div>
                    <div>Avg Loss &amp; DCC</div>
                    <div>Tier</div>
                  </div>
                  <div className="table-row">
                    <div>OH</div>
                    <div>34.40%</div>
                    <div>Tier 1: Low</div>
                  </div>
                  <div className="table-row">
                    <div>CA</div>
                    <div>66.44%</div>
                    <div>Tier 2: Moderate</div>
                  </div>
                  <div className="table-row">
                    <div>NY</div>
                    <div>80.62%</div>
                    <div>Tier 3: High</div>
                  </div>
                  <div className="table-row">
                    <div>NM</div>
                    <div>127.46%</div>
                    <div>Tier 4: Very High</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flow-step">
              <div className="flow-step-body">
                <div className="flow-step-title">Step 5: Trend projection</div>
                <div className="big-metrics">
                  <div className="big-metric">
                    <div className="big-metric-label">Favourable</div>
                    <div className="big-metric-value">−0.414%/yr</div>
                  </div>
                  <div className="big-metric">
                    <div className="big-metric-label">Neutral</div>
                    <div className="big-metric-value">0%</div>
                  </div>
                  <div className="big-metric">
                    <div className="big-metric-label">Unfavourable</div>
                    <div className="big-metric-value">+0.379%/yr</div>
                  </div>
                </div>
                <div className="flow-step-subtitle">
                  Favourable reflects improving national health dynamics (e.g., GLP‑1 adoption,
                  prevention, earlier interventions). Unfavourable reflects rising risk trends.
                </div>
              </div>
            </div>

            <div className="flow-step flow-step-accent">
              <div className="flow-step-body">
                <div className="flow-step-title">Step 6: Premium</div>
                <div className="flow-formula flow-formula-accent">
                  Premium = Geographic Adjusted Loss ÷ (1 − expense loading)
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="multiplier" className="explainer-section">
          <div className="explainer-section-head" data-reveal="hidden">
            <div className="section-icon">
              <Shield size={18} />
            </div>
            <h2>The AI litigation multiplier — why AI is different</h2>
            <p>
              We explicitly load claim frequency for AI because the legal and behavioral dynamics
              differ from human clinicians.
            </p>
          </div>

          <div className="grid-3" data-reveal="hidden">
            <div className="card">
              <div className="card-title">No personal relationship</div>
              <p className="card-text">
                Patients may feel less reluctance to litigate when there isn’t a trusted human
                relationship to protect.
              </p>
            </div>
            <div className="card">
              <div className="card-title">Deep-pocket defendants</div>
              <p className="card-text">
                Vendors and health systems can look like attractive defendants, increasing the
                incentive to file and pursue claims.
              </p>
            </div>
            <div className="card">
              <div className="card-title">Explainability in court</div>
              <p className="card-text">
                “Black box” decisioning can create evidentiary friction and raise the probability
                disputes become litigated rather than quietly settled.
              </p>
            </div>
            <div className="card">
              <div className="card-title">Novel precedent</div>
              <p className="card-text">
                Early cases define precedent. That can temporarily increase litigation intensity as
                boundaries are tested.
              </p>
            </div>
            <div className="card">
              <div className="card-title">Public skepticism</div>
              <p className="card-text">
                AI in healthcare is high-stakes. Skepticism can reduce tolerance for adverse events
                and increase escalation.
              </p>
            </div>
            <div className="card card-accent">
              <div className="card-title">Multiplier by bot type</div>
              <p className="card-text">
                Applied as a relative uplift by bot type (triage &lt; diagnostic &lt; treatment),
                reflecting higher litigation intensity for higher-stakes outputs.
              </p>
            </div>
          </div>
        </section>

        <section id="assumptions" className="explainer-section">
          <div className="explainer-section-head" data-reveal="hidden">
            <div className="section-icon">
              <Sigma size={18} />
            </div>
            <h2>Key assumptions &amp; limitations</h2>
            <p>
              Transparency is part of the product. This is a demonstrative pricing framework,
              designed to be auditable and adjustable.
            </p>
          </div>

          <div className="two-col" data-reveal="hidden">
            <div className="card">
              <div className="card-title">Major assumptions</div>
              <ul className="clean-list">
                <li>Human malpractice data is the baseline analogue (NAIC 2010–2024).</li>
                <li>Bot accuracy by type from PMC12047852 (risk of dataset bias).</li>
                <li>Frequency chain uses harm rate, claim rate, payout rate, and an AI litigation uplift.</li>
                <li>Severity uses an average paid-claim benchmark (NPDB reference).</li>
                <li>AI litigation uplift varies by bot type; it is judgemental (no AI loss history).</li>
                <li>Trend slopes are scenario-based and applied over settlement lag.</li>
              </ul>
            </div>
            <div className="card card-warning">
              <div className="card-title">Explicit limitation</div>
              <p className="card-text">
                <b>No AI health bot malpractice loss history exists</b> today. This model does not
                claim to be the market price. It’s a structured way to reason from analogous data,
                document assumptions, and evolve as experience emerges.
              </p>
              <p className="card-text">
                The PMC study can overstate real-world performance when models are tested on known
                cases rather than messy, live presentations.
              </p>
            </div>
          </div>
        </section>

        <section id="about" className="explainer-section explainer-footer">
          <div className="footer-card" data-reveal="hidden">
            <div className="footer-title">About</div>
            <p className="footer-text">
              Built by a 2nd year actuarial science student exploring AI insurance as an emerging
              field. The goal is to make early AI liability underwriting more legible — and easier
              to improve.
            </p>
            <div className="footer-actions">
              <Link className="explainer-cta-primary" to="/">
                Open the calculator <ArrowRight size={16} />
              </Link>
              <Link className="explainer-cta-secondary" to="/explanation">
                Technical notes
              </Link>
            </div>
            <div className="footer-fineprint">
              For demonstrative purposes only. Not insurance advice.
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

