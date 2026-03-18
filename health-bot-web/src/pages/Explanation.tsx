import { Link } from 'react-router-dom'
import '../App.css'

export function Explanation() {
  return (
    <div className="app-root">
      <header className="app-header">
        <div>
          <h1>Model Explanation</h1>
          <p className="app-subtitle">
            Definitions, assumptions, and formulas used in the calculator.
          </p>
        </div>
        <div className="header-actions">
          <Link className="secondary-button" to="/">
            Back to calculator
          </Link>
        </div>
      </header>

      <main className="layout explanation-layout">
        <section className="panel">
          <h2>Mandatory inputs</h2>
          <div className="explanation-list">
            <div className="explanation-item">
              <div className="explanation-term">State of deployment</div>
              <div className="explanation-def">
                Selects the state’s historical average loss &amp; DCC ratio and the
                geographic loading factor.
              </div>
            </div>
            <div className="explanation-item">
              <div className="explanation-term">Bot type</div>
              <div className="explanation-def">
                Determines the bot’s error rate and the AI litigation multiplier.
              </div>
            </div>
            <div className="explanation-item">
              <div className="explanation-term">Annual patient interactions</div>
              <div className="explanation-def">
                Used as the exposure base for expected claims.
              </div>
            </div>
            <div className="explanation-item">
              <div className="explanation-term">Health trend scenario</div>
              <div className="explanation-def">
                Chooses an annual slope applied over the settlement lag to adjust the
                loss ratio forward.
              </div>
            </div>
            <div className="explanation-item">
              <div className="explanation-term">Settlement lag (years)</div>
              <div className="explanation-def">
                Average years from policy inception to claim settlement (used to project
                loss ratio).
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2>Optional adjustments (defaults)</h2>
          <div className="explanation-list">
            <div className="explanation-item">
              <div className="explanation-term">Harm rate</div>
              <div className="explanation-def">
                Proportion of bot errors that cause patient harm. Default: <b>15%</b>.
              </div>
            </div>
            <div className="explanation-item">
              <div className="explanation-term">Base claim rate (human)</div>
              <div className="explanation-def">
                Baseline claim filing rate applied after harm (human malpractice
                benchmark). Default: <b>2%</b>.
              </div>
            </div>
            <div className="explanation-item">
              <div className="explanation-term">Payout rate</div>
              <div className="explanation-def">
                Proportion of filed claims that result in payment. Default: <b>22%</b>.
              </div>
            </div>
            <div className="explanation-item">
              <div className="explanation-term">Average severity per paid claim</div>
              <div className="explanation-def">
                Average paid amount per paid claim. Default: <b>$350,000</b>.
              </div>
            </div>
            <div className="explanation-item">
              <div className="explanation-term">Expenses &amp; profit loading</div>
              <div className="explanation-def">
                Target operating expense + profit margin applied to losses. Default:{' '}
                <b>30%</b>.
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2>Core formulas</h2>
          <div className="explanation-list">
            <div className="explanation-item">
              <div className="explanation-term">Adjusted AI claim rate</div>
              <div className="explanation-def">
                \( \text{AdjustedClaimRate} = \text{BaseClaimRateHuman} \times
                \text{AILitigationMultiplier} \)
              </div>
            </div>
            <div className="explanation-item">
              <div className="explanation-term">Expected annual paid claims</div>
              <div className="explanation-def">
                \( \text{Claims} = \text{Interactions} \times \text{ErrorRate} \times
                \text{HarmRate} \times \text{AdjustedClaimRate} \times \text{PayoutRate}
                \)
              </div>
            </div>
            <div className="explanation-item">
              <div className="explanation-term">Base expected loss</div>
              <div className="explanation-def">
                \( \text{BaseLoss} = \text{Claims} \times
                \text{AverageSeverityPerPaidClaim} \)
              </div>
            </div>
            <div className="explanation-item">
              <div className="explanation-term">Trend-adjusted loss ratio</div>
              <div className="explanation-def">
                \( \text{ProjectedLossRatio} = \text{StateAvgLossDCCRatio} +
                (\text{Slope} \times \text{LagYears}) \)
              </div>
            </div>
            <div className="explanation-item">
              <div className="explanation-term">Trend adjustment factor</div>
              <div className="explanation-def">
                \( \text{TrendFactor} = \text{ProjectedLossRatio} \div
                \text{StateAvgLossDCCRatio} \)
              </div>
            </div>
            <div className="explanation-item">
              <div className="explanation-term">Trended &amp; geographic adjusted loss</div>
              <div className="explanation-def">
                \( \text{TrendedLoss} = \text{BaseLoss} \times \text{TrendFactor} \) then
                \( \text{GeoAdjustedLoss} = \text{TrendedLoss} \times
                \text{StateLoadingFactor} \)
              </div>
            </div>
            <div className="explanation-item">
              <div className="explanation-term">Recommended annual premium</div>
              <div className="explanation-def">
                \( \text{Premium} = \text{GeoAdjustedLoss} \div (1 -
                \text{ExpenseProfitLoading}) \)
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

