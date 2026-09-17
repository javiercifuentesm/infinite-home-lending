"""Independent 50-digit reference: discounted cash flows + closed-form balance.
Run from the repository root to regenerate the checked-in audit fixtures.
"""
from decimal import Decimal as D, getcontext
import json
from pathlib import Path
getcontext().prec = 50

def reference(i, m):
    hp, rent, dp, rate, appr, ri, future, lt = [D(str(i[k])) for k in ('hp','rent','dp','rate','appr','ri','futureRate','lt')]
    n = int(lt * 12)
    price = hp * (1 + appr / 100) ** (D(m) / 12)
    loan = hp * (1 - dp / 100)
    def payment(principal, annual):
        r = annual / 1200
        # Discount each monthly payment independently, rather than using the app formula.
        return principal / sum((1 + r) ** (-t) for t in range(1, n + 1))
    now, later = payment(loan, rate), payment(price * (1 - dp / 100), future)
    r = rate / 1200
    k = min(m, n)
    balance = loan - now * k if r == 0 else loan * (1 + r) ** k - now * ((1 + r) ** k - 1) / r
    values = dict(futurePrice=price, priceIncrease=price-hp, rentPaid=sum(rent * (1 + ri/100) ** (t//12) for t in range(m)), pmtNow=now, pmtThen=later, monthlyPmtIncrease=later-now, extraDown=(price-hp)*dp/100, extraClosing=(price-hp)*D('.03'), equityMissed=loan-balance, downNow=hp*dp/100, downLater=price*dp/100, cashNow=hp*(dp/100+D('.03')), cashLater=price*(dp/100+D('.03')))
    return {k: float(v) for k,v in values.items()}
base=dict(hp=480000,rent=2400,dp=10,rate=6.75,appr=-3,ri=0,futureRate=5,lt=30)
cases=[dict(name='received-email-corrected',inputs=base,months=6)]
for term in (15,20,30):
 for change in (-25,-3,0,3.5,25):
  for months in (1,6,12,13,24,25,36):
   i=dict(base,lt=term,appr=change,ri=3.5)
   cases.append(dict(name=f'{term}y-{change}pct-{months}m',inputs=i,months=months))
for dp in (0,100):
 for rate in (0,1e-12,25):
  for hp in (10000,10000000):
   i=dict(base,dp=dp,rate=rate,futureRate=rate,hp=hp,ri=-25)
   cases.append(dict(name=f'edge-{dp}-{rate}-{hp}',inputs=i,months=36))
for c in cases: c['expected']=reference(c['inputs'],c['months'])
Path('tests/fixtures/calculator-math-reference.json').write_text(json.dumps(cases,indent=2)+'\n')
print(f'{len(cases)} independent reference scenarios generated')
print(json.dumps(cases[0]['expected'],indent=2))
