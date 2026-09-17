import { useMemo, useState, type CSSProperties } from "react";
import {
  calcCostForMonths,
  type WaitingInputs,
} from "../../hooks/useWaitingMath";
import { WaitingInputs as WaitingInputsForm } from "./WaitingInputs";
import { WaitingSlider } from "./WaitingSlider";
import { CalculatorReportForm } from "./CalculatorReportForm";
import { WaitingCTA } from "./WaitingCTA";
import { SmartToolIntro } from "./SmartToolIntro";
import { useLanguage } from "../../i18n/LanguageContext";

const defaultInputs: WaitingInputs = {
  hp: 480000,
  rent: 2400,
  dp: 10,
  rate: 6.75,
  appr: 3.5,
  ri: 3.5,
  futureRate: 6.75,
  lt: 30,
};

export default function WaitingCalculator() {
  const { t, lang } = useLanguage();
  const es = lang === "es";
  const money = (value: number) => new Intl.NumberFormat(es ? "es-US" : "en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  const pick = (en: string, spanish: string) => es ? spanish : en;
  const [inputs, setInputs] = useState<WaitingInputs>(defaultInputs);
  const [waitMonths, setWaitMonths] = useState(6);

  const data = useMemo(() => calcCostForMonths(waitMonths, inputs), [waitMonths, inputs]);

  return (
    <div
      className="true-cost-waiting mx-auto max-w-5xl px-4 pb-16 pt-0 font-[Lato,system-ui,sans-serif] sm:px-6 lg:px-8"
      style={
        {
          "--tcw-text-primary": "#0B2A4A",
          "--tcw-text-secondary": "#475569",
          "--tcw-text-muted": "#64748b",
          "--tcw-border": "#e2e8f0",
          "--tcw-surface": "#ffffff",
        } as CSSProperties
      }
    >
      <SmartToolIntro title={t("tool.waiting.title")}>
        <p>{pick("Compare buying now with buying later using your own assumptions. Prices and rates can rise or fall; either choice may make sense for your household.", "Compare comprar ahora con comprar después usando sus propios supuestos. Los precios y las tasas pueden subir o bajar; ambas opciones pueden tener sentido para su hogar.")}</p>
      </SmartToolIntro>

      <section className="mt-10 space-y-8">
        <WaitingInputsForm inputs={inputs} onChange={setInputs} />
        <WaitingSlider waitMonths={waitMonths} onChange={setWaitMonths} />
        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-2xl font-bold text-[#0B2A4A]">{pick("Your scenario comparison", "Su comparación de escenarios")}</h2>
          <div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead><tr className="border-b"><th className="pb-3">{pick("Estimate", "Estimación")}</th><th className="pb-3">{pick("Buy now", "Comprar ahora")}</th><th className="pb-3">{pick(`Buy in ${waitMonths} months`, `Comprar en ${waitMonths} meses`)}</th></tr></thead>
            <tbody>
              {[
                [pick("Home price", "Precio de vivienda"), money(inputs.hp), money(data.futurePrice)],
                [pick("Assumed interest rate", "Tasa de interés supuesta"), `${inputs.rate}%`, `${inputs.futureRate}%`],
                [pick("Monthly principal & interest", "Capital e interés mensual"), money(data.pmtNow), money(data.pmtThen)],
                [pick("Down payment", "Cuota inicial"), money(inputs.hp * inputs.dp / 100), money(data.futurePrice * inputs.dp / 100)],
                [pick("Closing costs (3% assumption)", "Costos de cierre (supuesto de 3%)"), money(inputs.hp * .03), money(data.futurePrice * .03)],
              ].map(([label, now, later]) => <tr className="border-b" key={label}><th className="py-4 pr-3 font-normal">{label}</th><td className="py-4 pr-3 font-semibold">{now}</td><td className="py-4 font-semibold">{later}</td></tr>)}
            </tbody>
          </table></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              [pick("Rent during the wait", "Arriendo durante la espera"), money(data.rentPaid)],
              [pick("Projected home price change", "Cambio proyectado del precio"), money(data.priceIncrease)],
              [pick("Monthly P&I change (later minus now)", "Cambio mensual de capital e interés (después menos actual)"), money(data.monthlyPmtIncrease)],
            ].map(([label, value]) => <div className="rounded-xl bg-slate-50 p-4" key={label}><p className="text-xs text-slate-600">{label}</p><p className="mt-2 text-2xl font-bold text-[#0B2A4A]">{value}</p></div>)}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-slate-600">{pick("These figures are separate estimates; they are not added into a net cost of waiting. The payment excludes taxes, insurance, mortgage insurance, HOA fees, maintenance and other ownership costs. This comparison also excludes savings returns, tax effects and selling costs. It is an illustration, not a forecast, approval or loan offer.", "Estas cifras son estimaciones separadas; no se suman como costo neto de esperar. El pago excluye impuestos, seguros, seguro hipotecario, HOA, mantenimiento y otros costos de propiedad. Esta comparación también excluye rendimiento de ahorros, efectos fiscales y costos de venta. Es una ilustración, no una predicción, aprobación ni oferta de préstamo.")}</p>
        </section>
        <CalculatorReportForm inputs={inputs} waitMonths={waitMonths} />
        <WaitingCTA />
        <p className="text-center text-[10px] leading-relaxed text-[var(--tcw-text-muted)]">
          {t("tool.waiting.disclaimer")}
        </p>
      </section>
    </div>
  );
}
