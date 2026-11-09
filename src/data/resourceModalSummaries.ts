import type { KnowledgeRouteId } from "./knowledgeCenterRoutes";

/**
 * Localized educational summary for an advisor-site resource modal.
 * Shared IHL content — not advisor-specific. Long-form source remains Knowledge Center.
 */
export type ResourceModalSummaryCopy = {
  category: string;
  headline: string;
  context: string;
  meaningTitle: string;
  meaningBody: string;
  considerationsTitle: string;
  considerations: string[];
  disclaimer: string;
};

export type ResourceModalSummary = {
  /** Canonical Knowledge Center route id */
  resourceId: KnowledgeRouteId;
  /** Canonical Knowledge Center deep-link path */
  sourcePath: string;
  en: ResourceModalSummaryCopy;
  es: ResourceModalSummaryCopy;
};

const DISCLAIMER_EN =
  "Educational guidance only. This overview does not constitute a loan offer, credit decision, or personalized financial advice. Program availability and terms vary.";

const DISCLAIMER_ES =
  "Solo orientación educativa. Este resumen no constituye una oferta de préstamo, una decisión de crédito ni asesoría financiera personalizada. La disponibilidad y los términos de los programas pueden variar.";

/**
 * Shared educational modal summaries for Mortgage Advisor subsites.
 * Condensed from Knowledge Center routes (EN + ES). Long-form remains at sourcePath.
 * Do not duplicate this copy per advisor.
 */
export const RESOURCE_MODAL_SUMMARIES: Partial<
  Record<KnowledgeRouteId, ResourceModalSummary>
> = {
  "start-here": {
    resourceId: "start-here",
    sourcePath: "/knowledge-center?path=start-here",
    en: {
      category: "Getting Oriented",
      headline: "Start Here",
      context:
        "If the mortgage world feels loud, you're not alone. You don't need every answer today — just enough to see where you are and what comes next. Start with a simple map: what matters first, how decisions unfold, and how to use what's ahead without drowning in detail.",
      meaningTitle: "What this means",
      meaningBody:
        "You're not behind — you're at the beginning. Most stress comes from not seeing the shape of the journey. Mortgages are a series of decisions in order, not one “best rate” moment you have to nail blindly. Clarity should come before pressure: understand trade-offs in plain language before anything feels like a push to pick a product.",
      considerationsTitle: "A calm way to move forward",
      considerations: [
        "Arrive as you are — no polished language or perfect numbers required to start.",
        "Be honest about where you stand today: buying, refinancing, or simply understanding.",
        "See how decisions usually unfold so you can pace yourself instead of solving everything at once.",
        "Pick the topic that matches your next real question — and skip what doesn't apply yet.",
      ],
      disclaimer: DISCLAIMER_EN,
    },
    es: {
      category: "Orientación Inicial",
      headline: "Comenzar Aquí",
      context:
        "Si el mundo hipotecario se siente ruidoso, no está solo. No necesita todas las respuestas hoy — solo las suficientes para ver dónde está y qué viene después. Comience con un mapa simple: qué importa primero, cómo se desarrollan las decisiones y cómo usar lo que viene sin ahogarse en detalles.",
      meaningTitle: "Qué significa esto",
      meaningBody:
        "No está atrasado — está al principio. La mayoría del estrés viene de no ver la forma del camino. Las hipotecas son una serie de decisiones en orden, no un momento de “mejor tasa” que tiene que acertar a ciegas. La claridad debe llegar antes que la presión: entienda las opciones en lenguaje claro antes de que algo se sienta como un empujón a elegir un producto.",
      considerationsTitle: "Una forma calmada de avanzar",
      considerations: [
        "Llegue como está — no necesita lenguaje pulido ni números perfectos para empezar.",
        "Sea honesto sobre dónde está hoy: comprando, refinanciando o simplemente entendiendo.",
        "Vea cómo suelen desarrollarse las decisiones para avanzar a su ritmo, sin intentar resolverlo todo a la vez.",
        "Elija el tema que coincida con su próxima pregunta real — y omita lo que aún no aplica.",
      ],
      disclaimer: DISCLAIMER_ES,
    },
  },

  buying: {
    resourceId: "buying",
    sourcePath: "/knowledge-center?path=buying",
    en: {
      category: "Buying a Home",
      headline: "Buying a Home",
      context:
        "Buying a home can feel overwhelming — not because it’s complicated, but because most people are never shown how it actually works. We break it down step by step: what matters, what to expect, and how to decide with confidence.",
      meaningTitle: "What this means",
      meaningBody:
        "Start with your numbers — not the home search. Fall in love with a payment range before you fall in love with a listing. Pre-approval isn’t paperwork — it’s leverage. Cash to close blindsides more buyers than the mortgage payment. The lowest rate isn’t the win — the right structure is.",
      considerationsTitle: "A calm way to move forward",
      considerations: [
        "Lock your budget and payment range before you tour a single house.",
        "Get pre-approved so you stop guessing and act from a real position.",
        "Shop inside your range — not around it.",
        "Winning offers are built — not bluffed.",
        "Remember: the number you qualify for isn’t the number you should live on.",
      ],
      disclaimer: DISCLAIMER_EN,
    },
    es: {
      category: "Comprar una Vivienda",
      headline: "Comprar una Vivienda",
      context:
        "Comprar una vivienda puede sentirse abrumador — no porque sea complicado, sino porque a la mayoría de las personas nunca se les muestra cómo funciona realmente. Lo desglosamos paso a paso: qué importa, qué esperar y cómo decidir con confianza.",
      meaningTitle: "Qué significa esto",
      meaningBody:
        "Comience con sus números — no con la búsqueda de vivienda. Enamórese de un rango de pago antes de enamorarse de un listado. La pre-aprobación no es papeleo — es apalancamiento. El efectivo para el cierre sorprende a más compradores que el pago de la hipoteca. La tasa más baja no es la victoria — la estructura correcta lo es.",
      considerationsTitle: "Una forma calmada de avanzar",
      considerations: [
        "Fije su presupuesto y rango de pago antes de visitar una sola casa.",
        "Obtenga pre-aprobación para dejar de adivinar y actuar desde una posición real.",
        "Compre dentro de su rango — no alrededor de él.",
        "Las ofertas ganadoras se construyen — no se improvisan.",
        "Recuerde: el número para el que califica no es el número en el que debería vivir.",
      ],
      disclaimer: DISCLAIMER_ES,
    },
  },

  numbers: {
    resourceId: "numbers",
    sourcePath: "/knowledge-center?path=numbers",
    en: {
      category: "Understanding the Numbers",
      headline: "Understanding My Numbers",
      context:
        "This is where most of the confusion lives — and where the smartest decisions are made. We break down how lenders actually evaluate your profile so you understand what’s working for you, what’s holding you back, and what you can improve.",
      meaningTitle: "What this means",
      meaningBody:
        "Your credit score doesn’t just determine approval — it determines how expensive your loan becomes. Income isn’t what matters — usable income is. One monthly payment can quietly reduce your buying power by tens of thousands. Guessing your numbers leads to bad decisions; clarity changes everything.",
      considerationsTitle: "A calm way to move forward",
      considerations: [
        "Review your credit profile beyond the three-digit score — payment history, usage, and account structure.",
        "Calculate DTI: income weighed against monthly obligations — where buying power is unlocked or constrained.",
        "Analyze income carefully: what you earn and what lenders can use are not always the same.",
        "Identify small, targeted improvements — timing matters.",
        "Align numbers with your goals: approval isn’t the finish line — fit with your life is.",
      ],
      disclaimer: DISCLAIMER_EN,
    },
    es: {
      category: "Entender los Números",
      headline: "Entendiendo Mis Números",
      context:
        "Aquí es donde vive la mayor parte de la confusión — y donde se toman las decisiones más inteligentes. Desglosamos cómo los prestamistas evalúan realmente su perfil para que entienda qué está funcionando para usted, qué le frena y qué puede mejorar.",
      meaningTitle: "Qué significa esto",
      meaningBody:
        "Su puntuación de crédito no solo determina la aprobación — determina qué tan costoso se vuelve su préstamo. Los ingresos no son lo que importa — los ingresos utilizables sí. Un pago mensual puede reducir silenciosamente su poder de compra en decenas de miles. Adivinar sus números lleva a malas decisiones; la claridad lo cambia todo.",
      considerationsTitle: "Una forma calmada de avanzar",
      considerations: [
        "Revise su perfil de crédito más allá de la puntuación — historial de pagos, uso y estructura de cuentas.",
        "Calcule el DTI: ingresos frente a obligaciones mensuales — donde el poder de compra se libera o se limita.",
        "Analice sus ingresos con cuidado: lo que gana y lo que los prestamistas pueden usar no siempre son lo mismo.",
        "Identifique mejoras pequeñas y específicas — el momento importa.",
        "Alinee los números con sus metas: la aprobación no es la línea de llegada — el ajuste con su vida lo es.",
      ],
      disclaimer: DISCLAIMER_ES,
    },
  },

  "loan-options": {
    resourceId: "loan-options",
    sourcePath: "/knowledge-center?path=loan-options",
    en: {
      category: "Choosing Loan Options",
      headline: "Loan Options & Programs",
      context:
        "Most people think choosing a loan is about finding the lowest rate. It’s not. The structure of your loan — how it’s built, how long you keep it, and how it fits your plan — often matters more than the rate itself.",
      meaningTitle: "What this means",
      meaningBody:
        "The lowest rate is often not the cheapest loan. Match the loan to your exit timeline — not the other way around. Flexibility is an asset. One quote isn’t a choice — it’s a default. Focusing only on the interest rate is where most buyers make the wrong decision.",
      considerationsTitle: "A calm way to move forward",
      considerations: [
        "Understand your timeline: your loan should match how long you plan to keep the home.",
        "Review multiple options — if you’re only shown one, you’re not seeing the full picture.",
        "Compare total cost — not just monthly payment.",
        "Choose the structure that fits your life — not the one that looks cheapest on the page.",
        "Once the strategy is clear, lock and move forward with confidence.",
      ],
      disclaimer: DISCLAIMER_EN,
    },
    es: {
      category: "Elegir Opciones de Préstamo",
      headline: "Opciones de Préstamo y Programas",
      context:
        "La mayoría de las personas piensan que elegir un préstamo se trata de encontrar la tasa más baja. No lo es. La estructura de su préstamo — cómo está construido, cuánto tiempo lo mantiene y cómo encaja en su plan — a menudo importa más que la tasa misma.",
      meaningTitle: "Qué significa esto",
      meaningBody:
        "La tasa más baja a menudo no es el préstamo más barato. Haga coincidir el préstamo con su cronograma de salida — no al revés. La flexibilidad es un activo. Una cotización no es una elección — es un valor predeterminado. Enfocarse solo en la tasa de interés es donde la mayoría de los compradores toma la decisión incorrecta.",
      considerationsTitle: "Una forma calmada de avanzar",
      considerations: [
        "Entienda su cronograma: su préstamo debe coincidir con cuánto tiempo planea mantener la vivienda.",
        "Revise múltiples opciones — si solo se le muestra una, no está viendo el panorama completo.",
        "Compare el costo total — no solo el pago mensual.",
        "Elija la estructura que se ajuste a su vida — no la que parece más barata en el papel.",
        "Una vez que la estrategia es clara, fije y avance con confianza.",
      ],
      disclaimer: DISCLAIMER_ES,
    },
  },

  "refinance-equity": {
    resourceId: "refinance-equity",
    sourcePath: "/knowledge-center?path=refinance-equity",
    en: {
      category: "Refinancing & Home Equity",
      headline: "Refinancing & Equity",
      context:
        "Refinancing isn’t just about getting a lower rate. It’s about improving your position — whether that means lowering your payment, accessing equity, or restructuring your loan to better fit your goals.",
      meaningTitle: "What this means",
      meaningBody:
        "A lower rate doesn’t automatically mean a better loan. The right timing follows your goals and horizon — not a rate headline. Equity is leverage: powerful when planned, costly when casual. Sometimes the best refinance is no refinance. Break-even is the number that turns a “deal” into real savings.",
      considerationsTitle: "A calm way to move forward",
      considerations: [
        "Understand your current position before making a move.",
        "Define your goal — refinancing without a clear goal leads to poor decisions.",
        "Evaluate multiple scenarios — not just one option.",
        "Determine if it’s worth it: rate can look good when the math doesn’t close.",
        "If it makes sense, move forward with clarity; if not, doing nothing can be the smart move.",
      ],
      disclaimer: DISCLAIMER_EN,
    },
    es: {
      category: "Refinanciamiento y Patrimonio",
      headline: "Refinanciamiento y Patrimonio",
      context:
        "Refinanciar no es solo obtener una tasa más baja. Se trata de mejorar su posición — ya sea reduciendo su pago, accediendo al patrimonio o reestructurando su préstamo para ajustarse mejor a sus metas.",
      meaningTitle: "Qué significa esto",
      meaningBody:
        "Una tasa más baja no significa automáticamente un mejor préstamo. El momento correcto sigue sus metas y horizonte — no un titular de tasa. El patrimonio es apalancamiento: poderoso cuando se planifica, costoso cuando es casual. A veces el mejor refinanciamiento es ningún refinanciamiento. El punto de equilibrio es el número que convierte un “trato” en ahorros reales.",
      considerationsTitle: "Una forma calmada de avanzar",
      considerations: [
        "Entienda su posición actual antes de hacer un movimiento.",
        "Defina su objetivo — refinanciar sin un objetivo claro lleva a malas decisiones.",
        "Evalúe múltiples escenarios — no solo una opción.",
        "Determine si vale la pena: la tasa puede parecer buena cuando la matemática no cierra.",
        "Si tiene sentido, avance con claridad; si no, no hacer nada puede ser el movimiento inteligente.",
      ],
      disclaimer: DISCLAIMER_ES,
    },
  },

  "quick-answers": {
    resourceId: "quick-answers",
    sourcePath: "/knowledge-center?path=quick-answers",
    en: {
      category: "Quick Answers",
      headline: "Quick Answers",
      context:
        "Not every question needs a long explanation. Here are clear, direct answers to the things most people ask — so you can move forward without getting stuck. Scan fast, then go deeper when you want more.",
      meaningTitle: "What this means",
      meaningBody:
        "Most questions have simple answers — if explained clearly. Confusion usually comes from how things are presented, not the topic itself. You don’t need to know everything to move forward — you need clarity on what matters right now. Getting unstuck beats getting perfect.",
      considerationsTitle: "A calm way to move forward",
      considerations: [
        "Focus on the question behind your question — what you type into search isn’t always what you’re actually worried about.",
        "Use answers to eliminate uncertainty — not add more; remove one unknown at a time.",
        "Remember: a fact on a page isn’t the same as that fact in your life.",
        "If something feels unclear, that’s useful — confusion often means you’re at a decision point, not that you’re behind.",
        "This is a starting point — then connect clarity to your real numbers and goals.",
      ],
      disclaimer: DISCLAIMER_EN,
    },
    es: {
      category: "Respuestas Rápidas",
      headline: "Respuestas Rápidas",
      context:
        "No todas las preguntas necesitan una explicación larga. Aquí están respuestas claras y directas a las cosas que la mayoría de las personas preguntan — para que pueda avanzar sin quedarse atascado. Explore rápido, luego profundice cuando quiera más.",
      meaningTitle: "Qué significa esto",
      meaningBody:
        "La mayoría de las preguntas tienen respuestas simples — si se explican claramente. La confusión generalmente viene de cómo se presentan las cosas, no del tema en sí. No necesita saberlo todo para avanzar — necesita claridad sobre lo que importa ahora mismo. Desatascarse supera a perfeccionar.",
      considerationsTitle: "Una forma calmada de avanzar",
      considerations: [
        "Enfóquese en la pregunta detrás de su pregunta — lo que escribe en la búsqueda no siempre es lo que realmente le preocupa.",
        "Use las respuestas para eliminar incertidumbre — no para agregar más; elimine una incógnita a la vez.",
        "Recuerde: un hecho en una página no es lo mismo que ese hecho en su vida.",
        "Si algo se siente poco claro, eso es útil — la confusión generalmente significa que está en un punto de decisión, no que está atrasado.",
        "Este es un punto de partida — luego conecte la claridad a sus números y metas reales.",
      ],
      disclaimer: DISCLAIMER_ES,
    },
  },
};

export function getResourceModalSummary(
  resourceId: KnowledgeRouteId | null | undefined,
): ResourceModalSummary | null {
  if (!resourceId) return null;
  return RESOURCE_MODAL_SUMMARIES[resourceId] ?? null;
}

export function getResourceModalSummaryCopy(
  resourceId: KnowledgeRouteId | null | undefined,
  lang: "en" | "es",
): ResourceModalSummaryCopy | null {
  const summary = getResourceModalSummary(resourceId);
  if (!summary) return null;
  return summary[lang];
}

/** True when a shared educational modal summary exists for this Knowledge Center route. */
export function hasResourceModalSummary(
  resourceId: KnowledgeRouteId | null | undefined,
): boolean {
  return getResourceModalSummary(resourceId) != null;
}
