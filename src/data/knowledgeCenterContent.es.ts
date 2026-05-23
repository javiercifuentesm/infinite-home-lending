/** ES copy for Knowledge Center educational content */

import type { PillarBlock, ClarityCard, GlossaryEntry } from "./knowledgeCenterContent";

export const KNOWLEDGE_PILLARS_ES: PillarBlock[] = [
  {
    id: "pillar-options",
    title: "Entendiendo Sus Opciones",
    featuredTitle: "Corredor Hipotecario vs. Banco: Por Qué Importa Más de lo que Cree",
    featuredPreview:
      "Dónde obtiene su préstamo da forma a la orientación que recibe — no solo a la tasa en la página. Así es como un modelo de asesoramiento difiere de una ventanilla de producto único.",
    supporting: [
      { label: "Tasa Fija vs. Ajustable", detail: "Cuándo tiene sentido cada estructura y cómo pensar más allá del pago." },
      { label: "Lo que Realmente Significa la Pre-Aprobación", detail: "Cómo difiere de la pre-calificación y qué señala a los vendedores." },
      { label: "Cómo el Crédito Impacta su Hipoteca", detail: "Rangos de puntuación, tiempo y lo que realmente mueve la aguja." },
    ],
    ctaLabel: "Explore sus opciones con sus números",
    ctaTo: "/loan-structure-simulator",
  },
  {
    id: "pillar-buying",
    title: "El Proceso de Compra",
    featuredTitle: "El Proceso de Compra de Vivienda, Paso a Paso",
    featuredPreview:
      "Desde la primera conversación hasta las llaves — una secuencia tranquila para que siempre sepa qué viene después y por qué importa.",
    supporting: [
      { label: "Documentos que Necesitará", detail: "Una lista práctica para que nada le sorprenda a mitad del proceso." },
      { label: "Cómo Leer una Estimación de Préstamo", detail: "Los números que realmente importan para la comparación." },
      { label: "Qué Pasa en el Cierre", detail: "Qué esperar, quién está en la sala y cuánto tiempo realmente lleva." },
    ],
    ctaLabel: "Vea cómo se ve la compra financieramente",
    ctaTo: "/buy-vs-wait",
  },
  {
    id: "pillar-refinance",
    title: "Refinanciamiento y Patrimonio",
    featuredTitle: "¿Cuándo Tiene Sentido Realmente un Refinanciamiento?",
    featuredPreview:
      "Punto de equilibrio, metas y estructura — los refinanciamientos deben evaluarse como inversiones, no como titulares.",
    supporting: [
      { label: "Punto de equilibrio explicado", detail: "Cómo evaluar los costos frente al beneficio mensual y a largo plazo real." },
      { label: "Retiro de efectivo vs. Tasa y Plazo", detail: "Metas diferentes, estructuras diferentes — claridad primero." },
      { label: "Qué es un HELOC", detail: "Cómo las líneas de patrimonio revolventes difieren de un refinanciamiento tradicional." },
    ],
    ctaLabel: "Ejecute su escenario de refinanciamiento",
    ctaTo: "/loan-structure-simulator",
  },
  {
    id: "pillar-readiness",
    title: "Preparación Financiera",
    featuredTitle: "Cómo Saber si Está Financieramente Listo para Comprar",
    featuredPreview:
      "La preparación no es un número único — es flujo de caja, reservas, estabilidad y tiempo alineado con sus metas.",
    supporting: [
      { label: "Mejore su crédito", detail: "Movimientos de alto impacto que no dependen de trucos." },
      { label: "DTI explicado", detail: "Lo que evalúan los prestamistas y cómo pensar en su zona de confort." },
      { label: "Alquilar vs. Comprar", detail: "Un marco más allá del pago mensual — incluido el costo de oportunidad." },
    ],
    ctaLabel: "Verifique su preparación",
    ctaTo: "/buy-vs-wait",
  },
];

export const CLARITY_CARDS_ES: ClarityCard[] = [
  {
    id: "pmi",
    category: "Comprador por Primera Vez",
    question: "¿Qué es el PMI?",
    preview: "Seguro que protege al prestamista — y cuándo puede desaparecer.",
    answer:
      "El Seguro Hipotecario Privado (PMI) generalmente se requiere cuando su cuota inicial es inferior al 20% en un préstamo convencional. Protege al prestamista si incumple — no a usted — pero le ayuda a comprar con menos efectivo por adelantado. El PMI a menudo se elimina automáticamente una vez que alcanza el patrimonio suficiente, dependiendo de su programa de préstamo y términos.",
    readMorePillarId: "pillar-readiness",
    applyTo: "/buy-vs-wait",
  },
  {
    id: "preapproval",
    category: "Comprador por Primera Vez",
    question: "Pre-aprobación vs pre-calificación",
    preview: "Suenan similar — no son lo mismo.",
    answer:
      "La pre-calificación suele ser una revisión más ligera basada en lo que reporta. La pre-aprobación involucra verificación documentada de ingresos, activos y crédito — por lo que es más sólida para los vendedores y para su propia planificación. Ninguna es un compromiso final de préstamo, pero la pre-aprobación le acerca mucho más a números reales en los que puede confiar.",
    readMorePillarId: "pillar-options",
    applyTo: "/loan-structure-simulator",
  },
  {
    id: "dti",
    category: "Crédito",
    question: "¿Qué es el DTI?",
    preview: "Deuda en relación con los ingresos — y por qué se trata de más que un índice.",
    answer:
      "Su índice de deuda en relación con los ingresos (DTI) compara sus pagos de deuda mensual con sus ingresos mensuales brutos. Los prestamistas lo usan para medir la capacidad — pero su nivel de comodidad también importa. Le ayudamos a entender tanto el lineamiento como lo que se siente sostenible para su vida.",
    readMorePillarId: "pillar-readiness",
    applyTo: "/loan-structure-simulator",
  },
  {
    id: "apr",
    category: "Refinanciamiento",
    question: "APR vs tasa de interés",
    preview: "Por qué la tasa más baja no siempre es el mejor trato.",
    answer:
      "La tasa de interés es el costo de pedir prestado el capital. El APR incluye ciertos honorarios y costos expresados como un porcentaje anual — útil para la comparación, pero la mejor estructura sigue dependiendo de cuánto tiempo mantendrá el préstamo y sus metas de flujo de caja.",
    readMorePillarId: "pillar-options",
    applyTo: "/loan-structure-simulator",
  },
  {
    id: "points",
    category: "Refinanciamiento",
    question: "¿Qué son los puntos?",
    preview: "Comprar su tasa — cuándo vale la pena.",
    answer:
      "Los puntos son honorarios iniciales pagados para reducir su tasa de interés. Si tienen sentido depende de cuánto tiempo mantendrá el préstamo y su cronograma de punto de equilibrio — algo que modelamos claramente antes de comprometerse.",
    readMorePillarId: "pillar-refinance",
    applyTo: "/loan-structure-simulator",
  },
  {
    id: "escrow",
    category: "Comprador por Primera Vez",
    question: "¿Qué es el depósito en garantía?",
    preview: "Cómo se cobran los impuestos y el seguro con su pago.",
    answer:
      "El depósito en garantía es una cuenta que su administrador usa para pagar los impuestos a la propiedad y el seguro de propietarios en su nombre. Su pago mensual puede incluir capital, intereses y una porción para el depósito en garantía — le explicaremos qué está incluido y cómo puede cambiar con el tiempo.",
    readMorePillarId: "pillar-buying",
    applyTo: "/buy-vs-wait",
  },
];

export const GLOSSARY_ENTRIES_ES: GlossaryEntry[] = [
  { term: "Amortización", letter: "A", definition: "Pago de deuda a lo largo del tiempo en cuotas regulares de capital e interés." },
  { term: "APR (Tasa de Porcentaje Anual)", letter: "A", definition: "Una medida más amplia del costo de endeudamiento que solo el interés, incluyendo ciertos honorarios." },
  { term: "Costos de cierre", letter: "C", definition: "Honorarios y gastos para finalizar su préstamo y transferir la propiedad, separados de la cuota inicial." },
  { term: "DTI (Deuda en Relación con los Ingresos)", letter: "D", definition: "Pagos de deuda mensual divididos por los ingresos mensuales brutos; usado para evaluar la capacidad." },
  { term: "Depósito en garantía", letter: "D", definition: "Una cuenta usada para cobrar y pagar impuestos a la propiedad y seguro con su pago hipotecario." },
  { term: "Tasa fija", letter: "T", definition: "Una tasa de interés que permanece igual durante la vida del plazo del préstamo." },
  { term: "HELOC", letter: "H", definition: "Una Línea de Crédito sobre el Patrimonio de la Vivienda — préstamo revolvente garantizado por su vivienda." },
  { term: "Estimación de préstamo", letter: "E", definition: "Un formulario estandarizado que muestra términos, pagos y costos clave para que pueda comparar ofertas." },
  { term: "LTV (Préstamo en Relación con el Valor)", letter: "L", definition: "Monto del préstamo dividido por el valor de la propiedad — afecta las tasas y el seguro hipotecario." },
  { term: "PMI", letter: "P", definition: "Seguro Hipotecario Privado — a menudo requerido en préstamos convencionales con menos del 20% de cuota inicial." },
  { term: "Puntos", letter: "P", definition: "Honorarios iniciales opcionales usados para reducir su tasa de interés." },
  { term: "Pre-aprobación", letter: "P", definition: "Una revisión más sólida con documentación que la pre-calificación; más cercana a números confiables." },
  { term: "Refinanciamiento", letter: "R", definition: "Reemplazar su hipoteca con una nueva — a menudo para cambiar la tasa, el plazo o acceder al patrimonio." },
  { term: "Suscripción", letter: "S", definition: "El proceso del prestamista de verificar su información y aprobar el préstamo." },
];
