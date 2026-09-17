# Calculator math audit — September 17, 2026

Scope: the Buying Now or Later calculator, its English and Spanish emailed scenario reports, and the scenario values in advisor alerts and HubSpot notes. This does not audit unrelated IHL tools.

Calculation version: waiting-scenarios-v3-2026-09.

## Corrections

The annual home-price change input now means an actual annual percentage change: projected price = current price × (1 + annual change / 100)^(waiting months / 12). The previous formula divided the annual change by 12 and compounded monthly, so the effective annual change did not match the field label. For example, -3% now means exactly -3% after twelve months.

The shared calculation keeps full precision; dollar amounts are rounded only when formatted for display. Down payments and closing cash no longer use a prematurely rounded projected price. A difference between displayed rounded payments may occasionally differ by $1 from the independently rounded exact payment change.

Mortgage payment evaluation uses a numerically stable equivalent of the standard level-payment amortization formula, including zero and extremely small positive interest rates. Principal repayment is limited to the loan term.

The obsolete totalCost and monthlyCostRate formulas and seven unused display components were removed. Adding rent, the entire price change, the down-payment change and closing-cost change is not a valid net cost comparison: down payment represents equity and is already part of price. Neither the public calculator nor its report exposes that total.

## Assumptions and formulas

- Mortgage principal = price × (1 − down-payment percentage / 100).
- Monthly interest rate = annual mortgage interest rate / 1200; this input is the interest rate, not APR.
- Level monthly P&I payment = principal × monthly rate / (1 − (1 + monthly rate)^(-loan months)); zero-rate payment = principal / loan months.
- Current and future purchases each use the selected full 15-, 20- or 30-year amortization term and their respective assumed interest rates.
- Rent stays fixed for the first twelve months. The annual rent change applies at month 13, again at month 25, etc. It is not a monthly rent escalator.
- Down payment = respective price × down-payment percentage / 100.
- Closing costs = respective price × 3%. This is a fixed illustration, not a lender quote.
- Down payment plus closing cash = respective price × (down-payment percentage / 100 + 0.03). Reserves, lender-specific charges and other cash requirements are not modeled separately.
- Principal repaid = current original loan minus its remaining balance after the waiting period's scheduled monthly payments. It excludes appreciation and down-payment equity.
- Payment change = future P&I minus current P&I; price change = projected price minus current price. Negative changes remain negative.
- Taxes, homeowners insurance, mortgage insurance, HOA fees, maintenance, investment returns, tax effects and selling costs are excluded. This is a comparison of separate scenarios, not a complete rent-versus-buy return calculation or prediction.

## Recipient test scenario: corrected dollar values

Inputs: $480,000 home price; $2,400 monthly rent; 10% down; 6.75% current interest; 5% future interest; -3% annual price change; 0% annual rent change; 30-year loan; six-month wait.

| Measure | Received test email | Corrected |
| --- | ---: | ---: |
| Projected home price | $472,845 | $472,745 |
| Current P&I | $2,802 | $2,802 |
| Future P&I | $2,285 | $2,284 |
| P&I change | -$517 | -$518 |
| Rent during wait | $14,400 | $14,400 |
| Projected price change | -$7,155 | -$7,255 |
| Current down payment | $48,000 | $48,000 |
| Future down payment | $47,285 | $47,275 |
| Current down payment + closing cash | $62,400 | $62,400 |
| Future down payment + closing cash | $61,470 | $61,457 |
| Principal repaid during wait | $2,263 | $2,263 |

Emails already delivered retain the prior calculations. New reports use the corrected version after deployment.

## Independent verification

scripts/calculator-math-reference.py uses Python Decimal at 50-digit precision. It computes mortgage payments by summing independently discounted monthly cash flows, and principal repayment from a closed-form balance; it does not import the application formulas. The checked-in reference fixtures cover 118 scenarios including all three loan terms, 1/6/12/13/24/25/36-month waiting periods, falling/flat/rising prices, lease anniversaries, zero/tiny/high interest, 0%/100% down, and supported minimum/maximum home prices.

The application matches every checked reference amount within $0.00001 before display rounding. English and Spanish report formatting is checked against the independent fixture. All 19 math and automation tests pass.

Reproduce with:

```sh
python scripts/calculator-math-reference.py
node --import tsx --test tests/calculatorMath.test.ts tests/calculatorAutomation.test.ts
npm run build
```
