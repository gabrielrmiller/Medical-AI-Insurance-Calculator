import React, { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Bot,
  BarChart3,
  Info,
  MapPin,
  SlidersHorizontal,
} from 'lucide-react'
import './App.css'

type BotType = 'triage' | 'diagnostic' | 'treatment'
type TrendScenario = 'favourable' | 'neutral' | 'unfavourable'

interface StateRiskRow {
  code: string
  name?: string
  riskTier: 'Low' | 'Moderate' | 'High' | 'Very High'
  loadingFactor: number
  avgLossDccRatio: number
}

interface CalculatorInputs {
  state: string
  botType: BotType
  annualInteractions: number | ''
  trendScenario: TrendScenario
  settlementLagYears: number | ''
}

interface OptionalInputs {
  harmRate: number
  baseClaimRateHuman: number
  payoutRate: number
  averageSeverityPerPaidClaim: number
  expenseAndProfitLoading: number
}

const STATE_RISK_TABLE: StateRiskRow[] = [
  { code: 'AK', name: 'Alaska', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.5151 },
  { code: 'AL', name: 'Alabama', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.6019 },
  { code: 'AR', name: 'Arkansas', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.6599 },
  { code: 'AZ', name: 'Arizona', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.5364 },
  { code: 'CA', name: 'California', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.6644 },
  { code: 'CO', name: 'Colorado', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.5267 },
  { code: 'CT', name: 'Connecticut', riskTier: 'High', loadingFactor: 1.25, avgLossDccRatio: 0.8787 },
  { code: 'DC', name: 'District of Columbia', riskTier: 'Low', loadingFactor: 0.8, avgLossDccRatio: 0.4171 },
  { code: 'DE', name: 'Delaware', riskTier: 'High', loadingFactor: 1.25, avgLossDccRatio: 0.7923 },
  { code: 'FL', name: 'Florida', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.6675 },
  { code: 'GA', name: 'Georgia', riskTier: 'High', loadingFactor: 1.25, avgLossDccRatio: 0.8015 },
  { code: 'GU', name: 'Guam', riskTier: 'Low', loadingFactor: 0.8, avgLossDccRatio: 0.1195 },
  { code: 'HI', name: 'Hawaii', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.6498 },
  { code: 'IA', name: 'Iowa', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.6718 },
  { code: 'ID', name: 'Idaho', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.656 },
  { code: 'IL', name: 'Illinois', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.6848 },
  { code: 'IN', name: 'Indiana', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.5485 },
  { code: 'KS', name: 'Kansas', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.6027 },
  { code: 'KY', name: 'Kentucky', riskTier: 'High', loadingFactor: 1.25, avgLossDccRatio: 0.7679 },
  { code: 'LA', name: 'Louisiana', riskTier: 'Low', loadingFactor: 0.8, avgLossDccRatio: 0.4063 },
  { code: 'MA', name: 'Massachusetts', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.6108 },
  { code: 'MD', name: 'Maryland', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.6876 },
  { code: 'ME', name: 'Maine', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.5629 },
  { code: 'MI', name: 'Michigan', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.6096 },
  { code: 'MN', name: 'Minnesota', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.5984 },
  { code: 'MO', name: 'Missouri', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.5897 },
  { code: 'MS', name: 'Mississippi', riskTier: 'Low', loadingFactor: 0.8, avgLossDccRatio: 0.4239 },
  { code: 'MT', name: 'Montana', riskTier: 'High', loadingFactor: 1.25, avgLossDccRatio: 0.7599 },
  { code: 'NC', name: 'North Carolina', riskTier: 'Low', loadingFactor: 0.8, avgLossDccRatio: 0.4242 },
  { code: 'ND', name: 'North Dakota', riskTier: 'Low', loadingFactor: 0.8, avgLossDccRatio: 0.3398 },
  { code: 'NE', name: 'Nebraska', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.662 },
  { code: 'NH', name: 'New Hampshire', riskTier: 'High', loadingFactor: 1.25, avgLossDccRatio: 0.7567 },
  { code: 'NJ', name: 'New Jersey', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.6726 },
  { code: 'NM', name: 'New Mexico', riskTier: 'Very High', loadingFactor: 1.5, avgLossDccRatio: 1.2746 },
  { code: 'NV', name: 'Nevada', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.5842 },
  { code: 'NY', name: 'New York', riskTier: 'High', loadingFactor: 1.25, avgLossDccRatio: 0.8062 },
  { code: 'OH', name: 'Ohio', riskTier: 'Low', loadingFactor: 0.8, avgLossDccRatio: 0.344 },
  { code: 'OK', name: 'Oklahoma', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.6555 },
  { code: 'OR', name: 'Oregon', riskTier: 'High', loadingFactor: 1.25, avgLossDccRatio: 0.7743 },
  { code: 'PA', name: 'Pennsylvania', riskTier: 'High', loadingFactor: 1.25, avgLossDccRatio: 0.7805 },
  { code: 'PR', name: 'Puerto Rico', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.549 },
  { code: 'RI', name: 'Rhode Island', riskTier: 'High', loadingFactor: 1.25, avgLossDccRatio: 0.9692 },
  { code: 'SC', name: 'South Carolina', riskTier: 'High', loadingFactor: 1.25, avgLossDccRatio: 0.8277 },
  { code: 'SD', name: 'South Dakota', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.5842 },
  { code: 'TN', name: 'Tennessee', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.71 },
  { code: 'TX', name: 'Texas', riskTier: 'Low', loadingFactor: 0.8, avgLossDccRatio: 0.4431 },
  { code: 'UT', name: 'Utah', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.6564 },
  { code: 'VA', name: 'Virginia', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.5204 },
  { code: 'VT', name: 'Vermont', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.6046 },
  { code: 'WA', name: 'Washington', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.7171 },
  { code: 'WI', name: 'Wisconsin', riskTier: 'Low', loadingFactor: 0.8, avgLossDccRatio: 0.3175 },
  { code: 'WV', name: 'West Virginia', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.6729 },
  { code: 'WY', name: 'Wyoming', riskTier: 'Moderate', loadingFactor: 1.0, avgLossDccRatio: 0.5887 },
  { code: 'VI', name: 'U.S. Virgin Islands', riskTier: 'Low', loadingFactor: 0.8, avgLossDccRatio: 0.4001 },
]

const BOT_TYPE_DETAIL: Record<
  BotType,
  {
    label: string
    errorRate: number
    aiLitigationMultiplier: number
  }
> = {
  triage: {
    label: 'Triage',
    errorRate: 0.022,
    aiLitigationMultiplier: 2,
  },
  diagnostic: {
    label: 'Diagnostic',
    errorRate: 0.386,
    aiLitigationMultiplier: 3,
  },
  treatment: {
    label: 'Treatment Recommendation',
    errorRate: 0.75,
    aiLitigationMultiplier: 5,
  },
}

const TREND_SLOPE_BY_SCENARIO: Record<TrendScenario, number> = {
  favourable: -0.00414,
  neutral: 0,
  unfavourable: 0.00379,
}

const DEFAULT_HARM_RATE = 0.15 // 15%
const DEFAULT_BASE_CLAIM_RATE_HUMAN = 0.02 // 2%
const DEFAULT_PAYOUT_RATE = 0.22 // 22%
const DEFAULT_AVERAGE_SEVERITY_PER_PAID_CLAIM = 350_000 // $350,000
const DEFAULT_EXPENSE_AND_PROFIT_LOADING = 0.3 // 30%

const initialInputs: CalculatorInputs = {
  state: 'OH',
  botType: 'triage',
  annualInteractions: 5000,
  trendScenario: 'neutral',
  settlementLagYears: 2,
}

const initialOptionalInputs: OptionalInputs = {
  harmRate: DEFAULT_HARM_RATE,
  baseClaimRateHuman: DEFAULT_BASE_CLAIM_RATE_HUMAN,
  payoutRate: DEFAULT_PAYOUT_RATE,
  averageSeverityPerPaidClaim: DEFAULT_AVERAGE_SEVERITY_PER_PAID_CLAIM,
  expenseAndProfitLoading: DEFAULT_EXPENSE_AND_PROFIT_LOADING,
}

function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs)
  const [optional, setOptional] = useState<OptionalInputs>(initialOptionalInputs)
  type PercentField =
    | 'harmRate'
    | 'baseClaimRateHuman'
    | 'payoutRate'
    | 'expenseAndProfitLoading'
  const [optionalPercentInputs, setOptionalPercentInputs] = useState<
    Record<PercentField, string>
  >({
    harmRate: (DEFAULT_HARM_RATE * 100).toString(),
    baseClaimRateHuman: (DEFAULT_BASE_CLAIM_RATE_HUMAN * 100).toString(),
    payoutRate: (DEFAULT_PAYOUT_RATE * 100).toString(),
    expenseAndProfitLoading: (DEFAULT_EXPENSE_AND_PROFIT_LOADING * 100).toString(),
  })
  const [averageSeverityInput, setAverageSeverityInput] = useState<string>(
    DEFAULT_AVERAGE_SEVERITY_PER_PAID_CLAIM.toString(),
  )

  const selectedState =
    STATE_RISK_TABLE.find((row) => row.code === inputs.state) ?? STATE_RISK_TABLE[0]

  const botDetail = BOT_TYPE_DETAIL[inputs.botType]

  const annualInteractionsNumeric =
    typeof inputs.annualInteractions === 'number' && inputs.annualInteractions > 0
      ? inputs.annualInteractions
      : 0

  const settlementLagNumeric =
    typeof inputs.settlementLagYears === 'number' && inputs.settlementLagYears >= 0
      ? inputs.settlementLagYears
      : 0

  const harmRate = optional.harmRate ?? DEFAULT_HARM_RATE
  const baseClaimRateHuman = optional.baseClaimRateHuman ?? DEFAULT_BASE_CLAIM_RATE_HUMAN
  const payoutRate = optional.payoutRate ?? DEFAULT_PAYOUT_RATE
  const averageSeverityPerPaidClaim =
    optional.averageSeverityPerPaidClaim ?? DEFAULT_AVERAGE_SEVERITY_PER_PAID_CLAIM
  const expenseAndProfitLoading =
    optional.expenseAndProfitLoading ?? DEFAULT_EXPENSE_AND_PROFIT_LOADING

  const adjustedAiClaimRate = baseClaimRateHuman * botDetail.aiLitigationMultiplier

  const expectedAnnualPaidClaims =
    annualInteractionsNumeric *
    botDetail.errorRate *
    harmRate *
    adjustedAiClaimRate *
    payoutRate

  const baseExpectedLoss = expectedAnnualPaidClaims * averageSeverityPerPaidClaim

  const baseLossRatio = selectedState.avgLossDccRatio
  const trendSlope = TREND_SLOPE_BY_SCENARIO[inputs.trendScenario]
  const projectedLossRatio = baseLossRatio + trendSlope * settlementLagNumeric
  const trendAdjustmentFactor =
    baseLossRatio > 0 ? projectedLossRatio / baseLossRatio : 1

  const trendedExpectedLoss = baseExpectedLoss * trendAdjustmentFactor
  const geographicAdjustedLoss = trendedExpectedLoss * selectedState.loadingFactor

  const recommendedAnnualPremiumBeforeValidation =
    geographicAdjustedLoss > 0 && expenseAndProfitLoading < 1
      ? geographicAdjustedLoss / (1 - expenseAndProfitLoading)
      : 0

  const formatCurrency = (value: number) =>
    value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    })

  const formatPercent = (value: number, digits = 1) =>
    `${(value * 100).toFixed(digits).toString()}%`

  const handleNumberChange =
    (field: keyof CalculatorInputs) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value
      if (raw === '') {
        setInputs((prev: CalculatorInputs) => ({ ...prev, [field]: '' }))
        return
      }
      const numeric = Number(raw.replace(/,/g, ''))
      if (Number.isNaN(numeric)) return
      setInputs((prev: CalculatorInputs) => ({ ...prev, [field]: numeric }))
    }

  const handleSelectChange =
    (field: 'state' | 'botType' | 'trendScenario') =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as CalculatorInputs[typeof field]
      setInputs((prev) => ({ ...prev, [field]: value as never }))
    }

  const handleOptionalPercentChange =
    (field: keyof OptionalInputs) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value
      if (raw === '') {
        // Reset underlying model to default if cleared, but keep the input visually empty
        setOptional((prev) => ({ ...prev, [field]: initialOptionalInputs[field] }))
        setOptionalPercentInputs((prev) => ({
          ...prev,
          [field]: '',
        }))
        return
      }

      const numeric = Number(raw.replace(/,/g, ''))
      if (Number.isNaN(numeric)) {
        // Just mirror the raw input (up to 3 chars) if it's not a valid number yet
        setOptionalPercentInputs((prev) => ({
          ...prev,
          [field]: raw.slice(0, 3),
        }))
        return
      }

      const clamped = Math.min(numeric, 100)
      const clampedString = clamped.toString()

      setOptionalPercentInputs((prev) => ({
        ...prev,
        [field]: clampedString,
      }))

      const decimal = clamped / 100
      setOptional((prev) => ({ ...prev, [field]: decimal }))
    }

  const handleOptionalCurrencyChange =
    (field: keyof OptionalInputs) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value
      if (field === 'averageSeverityPerPaidClaim') {
        setAverageSeverityInput(raw)

        if (raw === '') {
          setOptional((prev) => ({
            ...prev,
            averageSeverityPerPaidClaim: DEFAULT_AVERAGE_SEVERITY_PER_PAID_CLAIM,
          }))
          return
        }
      } else if (raw === '') {
        setOptional((prev) => ({ ...prev, [field]: initialOptionalInputs[field] }))
        return
      }
      const numeric = Number(raw.replace(/,/g, ''))
      if (Number.isNaN(numeric)) return
      setOptional((prev) => ({ ...prev, [field]: numeric }))
    }

  const resetMandatory = () => {
    setInputs(initialInputs)
  }

  const resetOptional = () => {
    setOptional(initialOptionalInputs)
    setOptionalPercentInputs({
      harmRate: (DEFAULT_HARM_RATE * 100).toString(),
      baseClaimRateHuman: (DEFAULT_BASE_CLAIM_RATE_HUMAN * 100).toString(),
      payoutRate: (DEFAULT_PAYOUT_RATE * 100).toString(),
      expenseAndProfitLoading: (DEFAULT_EXPENSE_AND_PROFIT_LOADING * 100).toString(),
    })
    setAverageSeverityInput(DEFAULT_AVERAGE_SEVERITY_PER_PAID_CLAIM.toString())
  }

  const hasOutOfRangePercent =
    harmRate < 0 ||
    harmRate > 1 ||
    baseClaimRateHuman < 0 ||
    baseClaimRateHuman > 1 ||
    payoutRate < 0 ||
    payoutRate > 1 ||
    expenseAndProfitLoading < 0 ||
    expenseAndProfitLoading > 1

  const recommendedAnnualPremium = hasOutOfRangePercent ? 0 : recommendedAnnualPremiumBeforeValidation

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const [displayPremium, setDisplayPremium] = useState<number>(recommendedAnnualPremium)
  const premiumAnimRef = useRef<number | null>(null)
  const previousPremiumRef = useRef<number>(recommendedAnnualPremium)

  useEffect(() => {
    const from = previousPremiumRef.current
    const to = recommendedAnnualPremium
    previousPremiumRef.current = to

    if (!Number.isFinite(from) || !Number.isFinite(to)) {
      setDisplayPremium(to)
      return
    }

    const start = performance.now()
    const durationMs = 520

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayPremium(from + (to - from) * eased)
      if (t < 1) premiumAnimRef.current = requestAnimationFrame(tick)
    }

    if (premiumAnimRef.current) cancelAnimationFrame(premiumAnimRef.current)
    premiumAnimRef.current = requestAnimationFrame(tick)

    return () => {
      if (premiumAnimRef.current) cancelAnimationFrame(premiumAnimRef.current)
      premiumAnimRef.current = null
    }
  }, [recommendedAnnualPremium])

  const formatOneInInteractions = (rate: number) => {
    if (!Number.isFinite(rate) || rate <= 0) return '—'
    const oneIn = Math.round(1 / rate)
    if (!Number.isFinite(oneIn) || oneIn <= 0) return '—'
    return `1 in ${new Intl.NumberFormat('en-US').format(oneIn)} interactions`
  }

  const flowSteps = useMemo(
    () => [
      {
        kind: 'calc' as const,
        label: 'Net Payout Frequency Rate',
        value: formatOneInInteractions(
          botDetail.errorRate *
            harmRate *
            baseClaimRateHuman *
            botDetail.aiLitigationMultiplier *
            payoutRate,
        ),
        tip: 'Probability that any given patient interaction ultimately results in a paid malpractice claim, after accounting for AI-specific litigation risk.',
      },
      {
        kind: 'calc' as const,
        label: 'Expected Annual Paid Claims',
        value: expectedAnnualPaidClaims > 0 ? expectedAnnualPaidClaims.toFixed(3) : '—',
        tip: 'Net payout frequency rate × annual patient interactions.',
      },
      {
        kind: 'calc' as const,
        label: 'Severity',
        value:
          averageSeverityPerPaidClaim > 0 ? formatCurrency(averageSeverityPerPaidClaim) : '—',
        tip: 'Average paid claim amount (advanced assumption).',
      },
      {
        kind: 'calc' as const,
        label: 'Base Expected Loss',
        value: baseExpectedLoss > 0 ? formatCurrency(baseExpectedLoss) : '—',
        tip: 'Expected annual paid claims × severity.',
      },
      {
        kind: 'calc' as const,
        label: 'Geography & Trend Adjusted Expected Loss',
        value:
          baseExpectedLoss > 0 && geographicAdjustedLoss > 0
            ? `${formatCurrency(baseExpectedLoss)} → ${formatCurrency(geographicAdjustedLoss)}`
            : '—',
        tip: 'Applies both the state geographic loading factor and the trend projection in a single adjustment.',
      },
    ],
    [
      averageSeverityPerPaidClaim,
      baseClaimRateHuman,
      baseExpectedLoss,
      botDetail.aiLitigationMultiplier,
      botDetail.errorRate,
      expectedAnnualPaidClaims,
      formatCurrency,
      geographicAdjustedLoss,
      harmRate,
      payoutRate,
    ],
  )

  return (
    <div className="calc-page">
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

      <main className="calc-layout">
        <section className="card card-slate">
          <div className="panel-grid">
            <div>
              <div className="section-header">
                <h2>Mandatory inputs</h2>
                <div className="section-actions">
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => setShowInfo(true)}
                  >
                    <Info size={16} />
                    Info
                  </button>
                </div>
              </div>

              <div className="field-grid pills mandatory-inputs">
                <div className="field">
                  <label htmlFor="state">
                    <MapPin size={14} /> State of deployment
                  </label>
                  <select
                    id="state"
                    value={inputs.state}
                    onChange={handleSelectChange('state')}
                  >
                    {STATE_RISK_TABLE.map((row) => (
                      <option key={row.code} value={row.code}>
                        {row.name ?? row.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="botType">
                    <Bot size={14} /> Bot type
                  </label>
                  <select
                    id="botType"
                    value={inputs.botType}
                    onChange={handleSelectChange('botType')}
                  >
                    <option value="triage">Triage</option>
                    <option value="diagnostic">Diagnostic</option>
                    <option value="treatment">Treatment Recommendation</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="annualInteractions">Annual patient interactions</label>
                  <input
                    id="annualInteractions"
                    type="number"
                    min={0}
                    step={100}
                    value={inputs.annualInteractions}
                    onChange={handleNumberChange('annualInteractions')}
                    className="no-spinner"
                  />
                </div>

                <div className="field">
                  <label htmlFor="trendScenario">
                    <BarChart3 size={14} /> Health trend scenario
                  </label>
                  <select
                    id="trendScenario"
                    value={inputs.trendScenario}
                    onChange={handleSelectChange('trendScenario')}
                  >
                    <option value="favourable">Favourable (declining health risk)</option>
                    <option value="neutral">Neutral</option>
                    <option value="unfavourable">
                      Unfavourable (rising health risk)
                    </option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="settlementLagYears">Settlement lag (years)</label>
                  <input
                    id="settlementLagYears"
                    type="number"
                    min={0}
                    step={0.5}
                    value={inputs.settlementLagYears}
                    onChange={handleNumberChange('settlementLagYears')}
                    className="no-spinner"
                  />
                </div>
              </div>

              <div className="panel-footer">
                <button
                  type="button"
                  className="pill-button"
                  onClick={resetMandatory}
                >
                  Reset mandatory
                </button>
              </div>

              <div className="optional-panel">
                <button
                  type="button"
                  className="advanced-toggle"
                  onClick={() => setShowAdvanced((s) => !s)}
                >
                  <SlidersHorizontal size={16} />
                  {showAdvanced ? 'Hide advanced assumptions' : 'Show advanced assumptions'}
                  <span className="spacer" />
                  <ArrowDown size={16} className={showAdvanced ? 'rot' : ''} />
                </button>

                {showAdvanced && (
                  <>
                    <div className="divider" />
                    <div className="field-grid pills optional-grid advanced-inputs">
                      <div className="field">
                        <label htmlFor="harmRate">Harm rate</label>
                        <div className="input-with-suffix">
                          <input
                            id="harmRate"
                            type="number"
                            min={0}
                            step={0.1}
                            value={optionalPercentInputs.harmRate}
                            onChange={handleOptionalPercentChange('harmRate')}
                            className="no-spinner"
                          />
                          <span className="suffix">%</span>
                        </div>
                      </div>

                      <div className="field">
                        <label htmlFor="baseClaimRate">Base claim rate (human)</label>
                        <div className="input-with-suffix">
                          <input
                            id="baseClaimRate"
                            type="number"
                            min={0}
                            step={0.1}
                            value={optionalPercentInputs.baseClaimRateHuman}
                            onChange={handleOptionalPercentChange('baseClaimRateHuman')}
                            className="no-spinner"
                          />
                          <span className="suffix">%</span>
                        </div>
                      </div>

                      <div className="field">
                        <label htmlFor="payoutRate">Payout rate</label>
                        <div className="input-with-suffix">
                          <input
                            id="payoutRate"
                            type="number"
                            min={0}
                            step={0.1}
                            value={optionalPercentInputs.payoutRate}
                            onChange={handleOptionalPercentChange('payoutRate')}
                            className="no-spinner"
                          />
                          <span className="suffix">%</span>
                        </div>
                      </div>

                      <div className="field">
                        <label htmlFor="severity">Avg severity per paid claim</label>
                        <div className="input-with-suffix">
                          <input
                            id="severity"
                            type="number"
                            min={0}
                            step={10000}
                            value={averageSeverityInput}
                            onChange={handleOptionalCurrencyChange('averageSeverityPerPaidClaim')}
                            className="no-spinner"
                          />
                          <span className="suffix">$</span>
                        </div>
                      </div>

                      <div className="field">
                        <label htmlFor="loading">Expenses & profit loading</label>
                        <div className="input-with-suffix">
                          <input
                            id="loading"
                            type="number"
                            min={0}
                            step={0.5}
                            value={optionalPercentInputs.expenseAndProfitLoading}
                            onChange={handleOptionalPercentChange('expenseAndProfitLoading')}
                            className="no-spinner"
                          />
                          <span className="suffix">%</span>
                        </div>
                      </div>

                      <div className="optional-reset-cell">
                        <button type="button" className="pill-button" onClick={resetOptional}>
                          Reset optional
                        </button>
                      </div>
                    </div>
                    {hasOutOfRangePercent && (
                      <p className="optional-warning">
                        One or more percentage assumptions are outside the reasonable 0–100% range.
                        Please review these inputs.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="card card-results">
          <div className="results-head">
            <h2>Results</h2>
            <div className="results-sub">A visual chain from risk inputs to premium.</div>
          </div>

          <div className="flow-list" aria-label="Calculation flow">
            {flowSteps.map((s, idx) => (
              <React.Fragment key={s.label}>
                <div
                  className={`flow-card flow-${s.kind}`}
                  data-tip={s.tip}
                  tabIndex={0}
                >
                  <div className="flow-card-label">{s.label}</div>
                  <div className="flow-card-value">{s.value}</div>
                </div>
                {idx < flowSteps.length - 1 && (
                  <div className="flow-arrow" aria-hidden="true">
                    <ArrowRight size={14} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flow-arrow flow-arrow-premium" aria-hidden="true">
            <ArrowRight size={14} />
          </div>

          <div
            className="premium-hero premium-hero-glow"
            aria-label="Recommended annual premium"
            data-tip={`Includes expense & profit loading of ${formatPercent(expenseAndProfitLoading, 0)}.`}
            tabIndex={0}
          >
            <div className="premium-hero-label">Recommended Annual Premium</div>
            <div
              className={`premium-hero-value ${recommendedAnnualPremium > 0 ? 'pulse' : ''}`}
            >
              {recommendedAnnualPremium > 0
                ? formatCurrency(displayPremium)
                : hasOutOfRangePercent
                  ? 'Fix out-of-range inputs'
                  : '—'}
            </div>
          </div>
        </section>
      </main>

      {showInfo && (
        <div className="drawer-backdrop" role="presentation" onClick={() => setShowInfo(false)}>
          <aside
            className="drawer"
            role="dialog"
            aria-label="Additional information"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-head">
              <div className="drawer-title">Additional information</div>
              <button type="button" className="ghost-button" onClick={() => setShowInfo(false)}>
                Close
              </button>
            </div>
            <div className="drawer-body">
              <div className="kv">
                <div className="k">State avg loss & DCC ratio</div>
                <div className="v">{formatPercent(selectedState.avgLossDccRatio, 2)}</div>
              </div>
              <div className="kv">
                <div className="k">State risk tier</div>
                <div className="v">{selectedState.riskTier}</div>
              </div>
              <div className="kv">
                <div className="k">Loading factor</div>
                <div className="v">{selectedState.loadingFactor.toFixed(2)}x</div>
              </div>
              <div className="kv">
                <div className="k">Adjusted AI claim rate</div>
                <div className="v">{formatPercent(adjustedAiClaimRate, 1)}</div>
              </div>
            </div>
          </aside>
        </div>
      )}

      <footer className="calc-footer">
        <div>
          Built by Gabriel Miller | 2nd Year Actuarial Science Student | Data: NAIC 2010–2024 |
          Methodology: PMC12047852
        </div>
        <div className="muted-mini">
          Demonstrative model only. No AI health bot malpractice loss history exists.
        </div>
      </footer>

      <div className="mobile-premium-bar" aria-label="Mobile premium sticky bar">
        <div className="mobile-premium-label">Annual premium</div>
        <div className="mobile-premium-value">
          {recommendedAnnualPremium > 0
            ? formatCurrency(displayPremium)
            : hasOutOfRangePercent
              ? 'Fix inputs'
              : '—'}
        </div>
      </div>
    </div>
  )
}

export default App
