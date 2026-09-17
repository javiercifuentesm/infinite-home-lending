import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calcCostForMonths, monthlyPayment, type WaitingInputs } from '../src/hooks/useWaitingMath';
import { parseReportRequest, reportRows } from '../src/lib/calculatorReport';
const cases = JSON.parse(readFileSync(new URL('./fixtures/calculator-math-reference.json', import.meta.url), 'utf8')) as {name:string;inputs:WaitingInputs;months:number;expected:Record<string,number>}[];
const close = (actual:number, expected:number, context:string) => {
  assert.ok(Number.isFinite(actual), context);
  assert.ok(Math.abs(actual-expected) < 0.00001, `${context}: ${actual} != ${expected}`);
};
test('all scenario outputs match independent 50-digit discounted cash-flow reference', () => {
 for (const c of cases) {
  const actual=calcCostForMonths(c.months,c.inputs);
  for (const key of ['futurePrice','priceIncrease','rentPaid','pmtNow','pmtThen','monthlyPmtIncrease','extraDown','extraClosing','equityMissed'] as const) close(actual[key],c.expected[key],`${c.name}/${key}`);
  close(actual.futurePrice*c.inputs.dp/100,c.expected.downLater,`${c.name}/down payment`);
  close(actual.futurePrice*(c.inputs.dp/100+.03),c.expected.cashLater,`${c.name}/closing cash`);
  assert.ok(actual.equityMissed>=-0.00001 && actual.equityMissed<=c.inputs.hp*(1-c.inputs.dp/100)+0.00001);
 }
});
test('scenario results do not expose the obsolete double-counted cost total', () => {
 const result=calcCostForMonths(6,cases[0].inputs);
 assert.ok(!('totalCost' in result));assert.ok(!('monthlyCostRate' in result));
});
test('an annual price assumption produces exactly that change at twelve months', () => {
 for(const appr of [-25,-3,0,3.5,25]) close(calcCostForMonths(12,{...cases[0].inputs,appr}).futurePrice,480000*(1+appr/100),`annual ${appr}`);
});
test('rent increases only at lease anniversaries, including month 13 and 25', () => {
 const i={...cases[0].inputs,ri:10};
 close(calcCostForMonths(12,i).rentPaid,28800,'12 months');
 close(calcCostForMonths(13,i).rentPaid,31440,'13 months');
 close(calcCostForMonths(25,i).rentPaid,63384,'25 months');
});
test('zero rate, tiny positive rate and all-cash scenarios stay finite', () => {
 close(monthlyPayment(432000,0,360),1200,'zero rate');
 close(monthlyPayment(432000,1e-12,360),1200,'near-zero rate');
 const allCash=calcCostForMonths(36,{...cases[0].inputs,dp:100});
 assert.equal(allCash.pmtNow,0);assert.equal(allCash.pmtThen,0);assert.equal(allCash.equityMissed,0);
});
test('English and Spanish reports display the independently calculated values', () => {
 const c=cases[0];
 for(const lang of ['en','es'] as const) {
  const request=parseReportRequest({submissionId:'73d10f05-f530-40a4-85e2-4de2433dd901',firstName:'Test',email:'test@example.com',state:'MD',lang,timeline:'exploring',emailConsent:false,inputs:c.inputs,waitMonths:c.months});
  const rows=reportRows(request);
  const money=(n:number)=>new Intl.NumberFormat(lang==='es'?'es-US':'en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
  const e=c.expected;
  assert.equal(rows[1].value,`${money(c.inputs.hp)} / ${money(e.futurePrice)}`);
  assert.equal(rows[6].value,`${money(e.pmtNow)} / ${money(e.pmtThen)}`);
  assert.equal(rows[7].value,money(e.monthlyPmtIncrease));
  assert.equal(rows[8].value,money(e.rentPaid));
  assert.equal(rows[9].value,money(e.priceIncrease));
  assert.equal(rows[10].value,`${money(e.downNow)} / ${money(e.downLater)}`);
  assert.equal(rows[12].value,`${money(e.cashNow)} / ${money(e.cashLater)}`);
  assert.equal(rows[13].value,money(e.equityMissed));
 }
});
