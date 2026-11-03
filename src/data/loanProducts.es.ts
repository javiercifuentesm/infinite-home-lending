import type { LoanProductData } from "../components/LoanProductCard";

export const LOAN_PRODUCTS_ES: LoanProductData[] = [
  {
    id: "conventional",
    category: "purchase",
    featuredCard: true,
    tags: ["Más Común"],
    title: "Préstamo Convencional",
    shortDescription: "Financiamiento flexible sin restricciones de programas gubernamentales.",
    cardHook: "Compre una vivienda con términos flexibles y amplia selección de prestamistas—sin restricciones de programas de agencias.",
    highlightLine: "Desde tan solo **3% de cuota inicial** con opciones para **evitar el seguro hipotecario**",
    highlights: [
      "Sin restricciones de FHA/VA/USDA",
      "Excelente opción cuando el crédito e ingresos están bien documentados",
    ],
    expanded: {
      fullDescription:
        "Los préstamos convencionales son el camino más común al financiamiento de vivienda. Ofrecen tasas competitivas y términos flexibles para compradores con ingresos estables y buen crédito. Con una cuota inicial de al menos 3%, puede evitar muchas de las restricciones de los programas respaldados por el gobierno mientras accede a una amplia gama de opciones de plazo.",
      whoFor: [
        "Compradores con ingresos estables y buenas puntuaciones de crédito",
        "Quienes prefieren flexibilidad sin restricciones de programas gubernamentales",
        "Prestatarios que pueden documentar ingresos y activos de manera clara",
      ],
      benefits: [
        "Plazos flexibles y opciones de tasa fija o ajustable",
        "Potencialmente menores costos a largo plazo con 20% de cuota inicial (sin PMI)",
        "Ampliamente disponible entre prestamistas y tipos de propiedad",
        "Proceso más ágil comparado con algunos programas gubernamentales",
      ],
      howItWorks: [
        "Obtenga una pre-calificación para entender el rango de precio y pago mensual",
        "Presente una solicitud completa con documentación de ingresos y activos",
        "El prestamista revisa crédito, empleo y el avalúo de la propiedad",
        "Cierre su préstamo y financie su compra o refinanciamiento",
      ],
      reassurance: "¿No está seguro si el convencional es la opción correcta? Comparamos opciones con usted—sin presión.",
      primaryCta: { label: "Vea cómo se vería esto para usted", to: "/contact" },
    },
    modalDetail: {
      headline: "Tasas competitivas y términos flexibles—sin restricciones de programas gubernamentales",
      intro:
        "Los préstamos convencionales son el camino más común al financiamiento de vivienda. Ofrecen tasas competitivas y términos flexibles para compradores con ingresos estables y buen crédito.",
      whenMakesSenseBullets: [
        "Tiene ingresos estables y crédito que cumple las expectativas típicas del prestamista.",
        "Quiere flexibilidad sin las reglas adicionales de los programas respaldados por el gobierno.",
        "Está comparando opciones de tasa fija y ajustable entre muchos prestamistas.",
        "Puede dar menos del 20% de cuota inicial y está dispuesto a discutir las implicaciones del seguro hipotecario.",
      ],
      atAGlance: {
        bestFor: "Compradores que pueden documentar ingresos y activos claramente y prefieren lineamientos convencionales",
        minCredit: "Varía según el prestamista y programa; mejor crédito generalmente mejora el precio",
        downPayment: "Desde tan solo 3% para compradores calificados",
        keyAdvantage: "Opciones de plazo flexibles y amplia disponibilidad en tipos de propiedad",
      },
      overviewParagraphs: [
        "Con una cuota inicial de al menos 3%, puede evitar muchas de las restricciones de los programas respaldados por el gobierno mientras accede a una amplia gama de opciones de plazo.",
      ],
      whoTypically: [
        "Compradores con ingresos estables y buenas puntuaciones de crédito",
        "Quienes prefieren flexibilidad sin restricciones de programas gubernamentales",
        "Prestatarios que pueden documentar ingresos y activos de manera clara",
      ],
      keyRequirements: [
        "Puntuación de crédito típicamente 620 o más para muchos prestamistas (las reglas exactas varían)",
        "La cuota inicial frecuentemente comienza alrededor del 3%; dar el 20% generalmente evita el seguro hipotecario",
        "Sus deudas mensuales en relación con sus ingresos deben ajustarse a los límites del prestamista (frecuentemente bajo el 45–50%)",
        "La propiedad debe cumplir los estándares de avalúo y las reglas de propiedad del prestamista",
        "El seguro hipotecario generalmente aplica si da menos del 20% de cuota inicial",
      ],
      whyClientsChoose: [
        "Plazos flexibles y opciones de tasa fija o ajustable",
        "Potencialmente menores costos a largo plazo con 20% de cuota inicial (sin PMI)",
        "Ampliamente disponible entre prestamistas y tipos de propiedad",
        "Proceso más ágil comparado con algunos programas gubernamentales",
      ],
      whatToKeepInMind: [
        "El PMI puede aplicar cuando da menos del 20% de cuota inicial—su asesor de préstamos puede explicar cómo afecta su pago.",
        "Los costos de cierre y las cotizaciones de tasa varían según el prestamista—compare el panorama completo, no solo la tasa.",
      ],
    },
  },
  {
    id: "fha",
    category: "purchase",
    featuredCard: true,
    tags: ["Cuota Inicial Baja"],
    title: "Préstamo FHA",
    shortDescription: "Compre con tan solo 3.5% de cuota inicial.",
    cardHook: "Compre antes con una cuota inicial más baja y lineamientos que pueden ser más flexibles que muchos préstamos estándar.",
    highlightLine: "Comience con tan solo **3.5% de cuota inicial**—respaldado por el seguro hipotecario de la Administración Federal de Vivienda.",
    highlights: [
      "Crédito más flexible que muchos préstamos convencionales",
      "Opciones de tasa fija y ajustable disponibles",
    ],
    expanded: {
      fullDescription:
        "Los préstamos FHA están diseñados para ayudar a más personas a comprar una vivienda. Están asegurados por la Administración Federal de Vivienda, lo que permite a los prestamistas ofrecer cuotas iniciales más bajas y requisitos de crédito más flexibles que muchos productos convencionales. Son una opción sólida cuando necesita una barrera de entrada más baja.",
      whoFor: [
        "Compradores por primera vez o quienes tienen ahorros limitados para cuota inicial",
        "Prestatarios que están construyendo o reconstruyendo su crédito",
        "Compradores que quieren una inversión inicial menor a la que muchos préstamos convencionales requieren",
      ],
      benefits: [
        "Cuota inicial más baja que muchas opciones convencionales",
        "Los lineamientos de crédito pueden ser más flexibles",
        "Opciones de tasa fija y ajustable disponibles",
        "Puede usarse para compra o refinanciamiento en muchos casos",
      ],
      howItWorks: [
        "La pre-aprobación le ayuda a buscar con un presupuesto claro",
        "Aplica con documentación de ingresos, activos y crédito",
        "La propiedad debe cumplir los requisitos de propiedad FHA",
        "Al cierre, tendrá una hipoteca asegurada por FHA con seguro hipotecario según se requiera",
      ],
      reassurance: "¿Se pregunta si FHA supera al convencional para usted? Revisamos los números juntos.",
      primaryCta: { label: "Calcule sus números con esta opción", to: "/contact" },
    },
    modalDetail: {
      headline: "El seguro FHA ayuda a los prestamistas a ofrecer cuotas iniciales más bajas y lineamientos de crédito más flexibles",
      intro:
        "Los préstamos FHA están diseñados para ayudar a más personas a comprar una vivienda. Están asegurados por la Administración Federal de Vivienda, lo que permite a los prestamistas ofrecer cuotas iniciales más bajas y requisitos de crédito más flexibles que muchos productos convencionales.",
      whenMakesSenseBullets: [
        "Quiere una de las cuotas iniciales estándar más bajas disponibles en muchos programas.",
        "Su crédito aún está mejorando y necesita lineamientos más flexibles.",
        "Está cómodo con el seguro hipotecario como parte del panorama mensual.",
        "La vivienda puede cumplir los estándares federales de propiedad de vivienda.",
      ],
      atAGlance: {
        bestFor: "Compradores que necesitan una barrera de entrada más baja o están construyendo crédito",
        minCredit: "Frecuentemente más flexible que muchas opciones convencionales (varía según el prestamista)",
        downPayment: "Desde tan solo 3.5%",
        keyAdvantage: "El seguro hipotecario respaldado por el gobierno facilita el acceso a más prestatarios",
      },
      overviewParagraphs: ["Son una opción sólida cuando necesita una barrera de entrada más baja."],
      whoTypically: [
        "Compradores por primera vez o quienes tienen ahorros limitados para cuota inicial",
        "Prestatarios que están construyendo o reconstruyendo su crédito",
        "Compradores que quieren una inversión inicial menor a la que muchos préstamos convencionales requieren",
      ],
      keyRequirements: [
        "Los lineamientos de crédito frecuentemente son más flexibles que en muchos préstamos estándar (varía según el prestamista)",
        "Cuota inicial desde tan solo 3.5% en muchos préstamos de la Administración Federal de Vivienda",
        "Sus deudas mensuales en relación con sus ingresos deben ajustarse a los límites del prestamista (frecuentemente bajo el 45–50%)",
        "La propiedad debe cumplir los estándares federales de propiedad de vivienda y pasar el avalúo",
        "El seguro hipotecario (inicial y mensual) es requerido en estos préstamos",
      ],
      whyClientsChoose: [
        "Cuota inicial más baja que muchas opciones convencionales",
        "Los lineamientos de crédito pueden ser más flexibles",
        "Opciones de tasa fija y ajustable disponibles",
        "Puede usarse para compra o refinanciamiento en muchos casos",
      ],
      whatToKeepInMind: [
        "Los préstamos FHA requieren seguro hipotecario—inclúyalo en la comparación de costo mensual.",
        "La condición de la propiedad debe cumplir los requisitos FHA—su agente y prestamista pueden ayudarle a verificar.",
      ],
    },
    relatedProgramIds: ["dpa-advantage", "fha-repair-escrow", "fha-203k-limited"],
  },
  {
    id: "va",
    category: "purchase",
    tags: ["Para Veteranos"],
    title: "Préstamo VA",
    shortDescription: "Diseñado para veteranos elegibles y miembros en servicio activo.",
    cardHook: "Compre una vivienda con $0 de cuota inicial y sin seguro hipotecario privado en muchos casos—hecho para quienes sirvieron.",
    highlightLine: "**$0 de cuota inicial** para prestatarios elegibles; el seguro hipotecario privado generalmente no se requiere.",
    highlights: [
      "Tasas competitivas cuando califica",
      "Diseñado para veteranos, servicio activo y cónyuges sobrevivientes elegibles",
    ],
    expanded: {
      fullDescription:
        "Los préstamos VA están disponibles para veteranos, miembros en servicio activo y cónyuges sobrevivientes elegibles. Están respaldados por el Departamento de Asuntos de Veteranos y frecuentemente permiten $0 de cuota inicial sin PMI—convirtiéndolos en una de las herramientas de compra más poderosas para quienes califican.",
      whoFor: [
        "Veteranos y miembros en servicio activo de las Fuerzas Armadas de EE. UU.",
        "Cónyuges sobrevivientes elegibles",
        "Quienes cumplen los requisitos de elegibilidad y derecho del VA",
      ],
      benefits: [
        "Sin cuota inicial en muchos casos",
        "Sin PMI—potencialmente menor costo mensual que el convencional con cuota inicial baja",
        "Tasas de interés competitivas",
        "Costos de cierre limitados y sin penalidad por pago anticipado en préstamos VA",
      ],
      howItWorks: [
        "Obtenga su Certificado de Elegibilidad (COE)",
        "Obtenga pre-aprobación con un prestamista aprobado por VA",
        "Elija una vivienda que cumpla los requisitos mínimos de propiedad del VA",
        "Cierre con su préstamo respaldado por VA",
      ],
      reassurance: "Gracias por su servicio. Si es elegible, le ayudaremos a aprovechar al máximo su beneficio VA.",
      primaryCta: { label: "Hable de este escenario con un experto", to: "/contact" },
    },
    modalDetail: {
      headline: "El respaldo VA puede significar $0 de cuota inicial y sin PMI para prestatarios elegibles",
      intro: "Los préstamos VA están disponibles para veteranos, miembros en servicio activo y cónyuges sobrevivientes elegibles.",
      whenMakesSenseBullets: [
        "Tiene historial de servicio elegible y puede obtener su certificado de elegibilidad.",
        "Quiere limitar el efectivo al cierre—$0 de cuota inicial es posible en muchos casos.",
        "Prefiere no pagar seguro hipotecario privado en escenarios típicos.",
        "La vivienda que le gusta puede cumplir las reglas de propiedad del Departamento de Asuntos de Veteranos.",
      ],
      atAGlance: {
        bestFor: "Veteranos elegibles, miembros en servicio y cónyuges sobrevivientes que califican",
        downPayment: "$0 de cuota inicial en muchos casos para prestatarios elegibles",
        keyAdvantage: "Sin PMI en escenarios típicos—frecuentemente un ahorro mensual significativo versus convencional con cuota inicial baja",
      },
      overviewParagraphs: [
        "Están respaldados por el Departamento de Asuntos de Veteranos y frecuentemente permiten $0 de cuota inicial sin PMI—convirtiéndolos en una de las herramientas de compra más poderosas para quienes califican.",
      ],
      whoTypically: [
        "Veteranos y miembros en servicio activo de las Fuerzas Armadas de EE. UU.",
        "Cónyuges sobrevivientes elegibles",
        "Quienes cumplen los requisitos de elegibilidad y derecho del VA",
      ],
      keyRequirements: [
        "Las expectativas de puntuación de crédito varían según el prestamista; muchos buscan una puntuación sólida",
        "Sin cuota inicial en muchos casos para prestatarios elegibles",
        "Sus deudas mensuales en relación con sus ingresos deben ajustarse a los límites del prestamista (frecuentemente bajo el 45–50%)",
        "La propiedad debe cumplir las reglas de propiedad del Departamento de Asuntos de Veteranos y pasar el avalúo",
        "Necesita un Certificado de Elegibilidad que compruebe su elegibilidad basada en servicio",
      ],
      whyClientsChoose: [
        "Sin cuota inicial en muchos casos",
        "Sin PMI—potencialmente menor costo mensual que el convencional con cuota inicial baja",
        "Tasas de interés competitivas",
        "Costos de cierre limitados y sin penalidad por pago anticipado en préstamos VA",
      ],
      whatToKeepInMind: [
        "Aplican reglas de elegibilidad y derecho—su COE es un paso clave.",
        "Las tarifas de financiamiento VA y otros costos pueden aplicar dependiendo del historial de servicio y uso—solicite un desglose claro de tarifas.",
      ],
    },
  },
  {
    id: "usda",
    category: "purchase",
    tags: ["Rural y Suburbano"],
    title: "Préstamo USDA",
    shortDescription: "Sin cuota inicial en áreas rurales y suburbanas elegibles.",
    cardHook: "Compre en áreas elegibles sin cuota inicial cuando las reglas del Departamento de Agricultura de EE. UU. aplican.",
    highlightLine: "$0 de cuota inicial cuando usted y la propiedad califican para el programa de vivienda rural.",
    highlights: [
      "Los ingresos del hogar deben estar dentro de los límites de su área",
      "Opciones de tasa fija para pagos predecibles",
    ],
    expanded: {
      fullDescription:
        "Los préstamos USDA ayudan a los compradores a adquirir viviendas en áreas rurales y suburbanas elegibles sin cuota inicial. Los ingresos y la ubicación de la propiedad deben cumplir los lineamientos del USDA—pero para quienes califican, es una forma poderosa de comprar con efectivo inicial limitado.",
      whoFor: [
        "Compradores que adquieren en áreas geográficas elegibles del USDA",
        "Hogares dentro de los límites de ingresos del USDA para el área",
        "Quienes están cómodos con los requisitos de propiedad y avalúo del USDA",
      ],
      benefits: [
        "$0 de cuota inicial para prestatarios y propiedades elegibles",
        "Costos de seguro hipotecario por debajo del mercado en muchos casos",
        "Términos de tasa fija para pagos predecibles",
        "Apoya la propiedad de vivienda en comunidades rurales y algunos suburbanos",
      ],
      howItWorks: [
        "Confirme que la dirección de la propiedad está en un área elegible del USDA",
        "Verifique que los ingresos del hogar estén dentro de los límites para su región",
        "Aplique a través de un prestamista aprobado por USDA",
        "Cierre con un préstamo garantizado por USDA",
      ],
      reassurance: "¿No está seguro si su área califica? Podemos verificar la elegibilidad rápidamente.",
      primaryCta: { label: "Vea si este camino se ajusta a su área", to: "/contact" },
    },
    modalDetail: {
      headline: "Financiamiento sin cuota inicial cuando la vivienda y el hogar cumplen las reglas de elegibilidad del USDA",
      intro: "Los préstamos USDA ayudan a los compradores a adquirir viviendas en áreas rurales y suburbanas elegibles sin cuota inicial.",
      whenMakesSenseBullets: [
        "La dirección está en un área rural o suburbana elegible.",
        "Los ingresos de su hogar se ajustan a los límites de su región.",
        "Quiere un camino sin cuota inicial cuando usted y la propiedad califican.",
        "Está cómodo con las tarifas del programa que funcionan como seguro hipotecario en el pago.",
      ],
      atAGlance: {
        bestFor: "Compradores de ingresos moderados que adquieren en áreas elegibles del USDA",
        downPayment: "$0 de cuota inicial para prestatarios y propiedades elegibles",
        keyAdvantage: "Costos de seguro hipotecario por debajo del mercado en muchos casos",
      },
      overviewParagraphs: [
        "Los ingresos y la ubicación de la propiedad deben cumplir los lineamientos del USDA—pero para quienes califican, es una forma poderosa de comprar con efectivo inicial limitado.",
      ],
      whoTypically: [
        "Compradores que adquieren en áreas geográficas elegibles del USDA",
        "Hogares dentro de los límites de ingresos del USDA para el área",
        "Quienes están cómodos con los requisitos de propiedad y avalúo del USDA",
      ],
      keyRequirements: [
        "El crédito debe cumplir los estándares del prestamista para el programa de préstamo rural del Departamento de Agricultura de EE. UU.",
        "Sin cuota inicial cuando usted y la propiedad califican",
        "Los ingresos totales del hogar deben estar dentro de los límites de su área",
        "La vivienda debe estar en un área rural o suburbana elegible y pasar el avalúo",
        "Este programa incluye una tarifa de garantía que funciona como seguro hipotecario",
      ],
      whyClientsChoose: [
        "$0 de cuota inicial para prestatarios y propiedades elegibles",
        "Costos de seguro hipotecario por debajo del mercado en muchos casos",
        "Términos de tasa fija para pagos predecibles",
        "Apoya la propiedad de vivienda en comunidades rurales y algunos suburbanos",
      ],
      whatToKeepInMind: [
        "La elegibilidad es específica por ubicación e ingresos—verificamos ambas antes de que se comprometa.",
        "Los préstamos USDA incluyen seguro hipotecario—compare el costo mensual total, no solo la tasa.",
      ],
    },
  },
  {
    id: "refinance",
    category: "refinance",
    tags: ["Tasa/Plazo"],
    title: "Refinanciamiento",
    shortDescription: "Mejore su tasa o plazo—sin retirar patrimonio en efectivo.",
    cardHook: "Reduzca su pago o alinee su plazo—sin aumentar su saldo para retirar efectivo.",
    highlightLine: "Reemplace su préstamo en mejores términos cuando los ahorros justifiquen los costos de cierre.",
    highlights: [
      "Acorte o extienda su plazo según sus metas",
      "Claridad sobre el punto de equilibrio antes de comprometerse",
    ],
    expanded: {
      fullDescription:
        "Un refinanciamiento de tasa y plazo reemplaza su hipoteca existente con una nueva para mejorar su tasa de interés, pago o duración del préstamo—sin aumentar el saldo del préstamo para retirar efectivo. Es ideal cuando las tasas del mercado bajan, su crédito mejora, o quiere alinear su hipoteca con cuánto tiempo planea quedarse en la vivienda.",
      whoFor: [
        "Propietarios que quieren una tasa más baja o un plazo diferente",
        "Quienes cuyo valor de vivienda o crédito ha mejorado desde el cierre",
        "Prestatarios enfocados en ahorros mensuales o pagar el préstamo antes—no en retirar patrimonio como efectivo",
      ],
      benefits: [
        "Tasa o pago más bajo cuando los números le favorecen",
        "Flexibilidad de plazo—pague antes o alivie la presión mensual",
        "Un solo pago mensual; sin línea de patrimonio separada",
        "Posible eliminación del PMI cuando el LTV lo permite",
      ],
      howItWorks: [
        "Compare su préstamo actual con las tasas y términos de hoy",
        "Aplique y fije cuando los ahorros justifiquen los costos de cierre",
        "El avalúo y la suscripción confirman el valor y la elegibilidad",
        "Cierre—su préstamo anterior se paga y el nuevo comienza",
      ],
      reassurance: "Le mostramos la matemática del punto de equilibrio para que pueda decidir con confianza.",
      primaryCta: { label: "Calcule los números de un refinanciamiento", to: "/contact" },
    },
    modalDetail: {
      headline: "Mejore su tasa o plazo—sin aumentar su saldo para retirar efectivo",
      intro:
        "Un refinanciamiento de tasa y plazo reemplaza su hipoteca existente con una nueva para mejorar su tasa de interés, pago o duración del préstamo—sin aumentar el saldo del préstamo para retirar efectivo.",
      whenMakesSenseBullets: [
        "Las tasas actuales podrían mejorar su pago versus su préstamo actual.",
        "Su crédito o valor de vivienda ha mejorado desde que cerró.",
        "Quiere una duración de préstamo diferente que coincida con cuánto tiempo se quedará.",
        "No necesita retirar efectivo—solo mejores términos.",
      ],
      atAGlance: {
        bestFor: "Propietarios enfocados en tasa, pago o plazo—no en retirar patrimonio como efectivo",
        keyAdvantage: "Un pago hipotecario y matemática clara del punto de equilibrio cuando los números funcionan",
      },
      overviewParagraphs: [
        "Es ideal cuando las tasas del mercado bajan, su crédito mejora, o quiere alinear su hipoteca con cuánto tiempo planea quedarse en la vivienda.",
      ],
      whoTypically: [
        "Propietarios que quieren una tasa más baja o un plazo diferente",
        "Quienes cuyo valor de vivienda o crédito ha mejorado desde el cierre",
        "Prestatarios enfocados en ahorros mensuales o pagar el préstamo antes—no en retirar patrimonio como efectivo",
      ],
      keyRequirements: [
        "La puntuación de crédito debe cumplir los estándares del prestamista para un nuevo préstamo",
        "Necesita suficiente patrimonio para que el nuevo préstamo se ajuste a las reglas del prestamista sobre el tamaño del préstamo en relación con el valor de la vivienda",
        "Sus deudas mensuales en relación con sus ingresos deben mantenerse dentro de lo que su prestamista permite (frecuentemente bajo el 45–50%)",
        "La vivienda debe pasar el avalúo y cumplir las reglas de propiedad del prestamista",
        "Paga costos de cierre; los ahorros deben justificar el costo durante el tiempo que mantenga el préstamo",
      ],
      whyClientsChoose: [
        "Tasa o pago más bajo cuando los números le favorecen",
        "Flexibilidad de plazo—pague antes o alivie la presión mensual",
        "Un solo pago mensual; sin línea de patrimonio separada",
        "Posible eliminación del PMI cuando el LTV lo permite",
      ],
      whatToKeepInMind: [
        "Los costos de cierre importan—el tiempo del punto de equilibrio debe ajustarse a cuánto tiempo planea mantener el préstamo.",
        "Un refinanciamiento de tasa/plazo no retira efectivo—si necesita patrimonio como efectivo, compare las alternativas.",
      ],
    },
  },
  {
    id: "cash-out-refinance",
    category: "refinance",
    tags: ["Retiro de Efectivo"],
    title: "Refinanciamiento con Retiro de Efectivo",
    shortDescription: "Convierta patrimonio en efectivo con un solo pago hipotecario.",
    cardHook: "Libere patrimonio como efectivo mientras mantiene un solo pago hipotecario en lugar de manejar deudas de alta tasa.",
    highlightLine: "Acceda a fondos frecuentemente a tasas por debajo de muchas tarjetas de crédito o préstamos personales.",
    highlights: [
      "Suma global del patrimonio disponible al cierre",
      "Un solo pago mensual a manejar",
    ],
    expanded: {
      fullDescription:
        "Un refinanciamiento con retiro de efectivo reemplaza su hipoteca actual con un préstamo mayor y le paga la diferencia al cierre. Es una forma común de financiar renovaciones, consolidar deudas de mayor tasa, o cubrir gastos grandes—usando el patrimonio de la vivienda mientras mantiene un solo pago mensual.",
      whoFor: [
        "Propietarios con patrimonio significativo acumulado",
        "Quienes prefieren un pago de préstamo sobre múltiples deudas de alta tasa",
        "Prestatarios que planean mejoras importantes del hogar o gastos de vida",
      ],
      benefits: [
        "Acceda a una suma global basada en el patrimonio disponible y la calificación",
        "El interés puede ser menor que las opciones de préstamo sin garantía",
        "Posibles consideraciones fiscales—consulte a un profesional de impuestos",
        "Pago estructurado en el plazo hipotecario que usted elija",
      ],
      howItWorks: [
        "Determine cuánto patrimonio puede acceder de forma segura",
        "Aplique; la suscripción revisa ingresos, crédito y avalúo",
        "Cierre con un nuevo préstamo mayor a su saldo; reciba la diferencia en efectivo",
        "Pague según el calendario del nuevo préstamo",
      ],
      reassurance: "Revisaremos los números y las alternativas—incluyendo HELOC—para que elija lo que mejor se ajuste.",
      primaryCta: { label: "Vea cómo podría verse el retiro de efectivo para usted", to: "/contact" },
    },
    modalDetail: {
      headline: "Reemplace su hipoteca con un préstamo mayor y reciba la diferencia al cierre",
      intro: "Un refinanciamiento con retiro de efectivo reemplaza su hipoteca actual con un préstamo mayor y le paga la diferencia al cierre.",
      whenMakesSenseBullets: [
        "Tiene suficiente patrimonio para pedir prestado mientras deja un margen seguro.",
        "Quiere una suma global para renovación, pago de deuda o un gasto grande.",
        "Una tasa hipotecaria puede superar lo que pagaría en tarjetas o préstamos sin garantía.",
        "Prefiere un solo pago mensual en lugar de manejar varias deudas.",
      ],
      atAGlance: {
        bestFor: "Propietarios con patrimonio significativo que quieren una suma global en una primera hipoteca",
        keyAdvantage: "Potencial para tasas más bajas que muchas opciones de préstamo sin garantía",
      },
      overviewParagraphs: [
        "Es una forma común de financiar renovaciones, consolidar deudas de mayor tasa, o cubrir gastos grandes—usando el patrimonio de la vivienda mientras mantiene un solo pago mensual.",
      ],
      whoTypically: [
        "Propietarios con patrimonio significativo acumulado",
        "Quienes prefieren un pago de préstamo sobre múltiples deudas de alta tasa",
        "Prestatarios que planean mejoras importantes del hogar o gastos de vida",
      ],
      keyRequirements: [
        "La puntuación de crédito debe cumplir los estándares del prestamista para un préstamo con retiro de efectivo",
        "Necesita suficiente patrimonio después de retirar efectivo—los prestamistas establecen cuánto puede pedir prestado",
        "Sus deudas mensuales en relación con sus ingresos deben soportar el nuevo pago mayor (frecuentemente bajo el 45–50%)",
        "La vivienda debe pasar el avalúo y cumplir las reglas de propiedad del prestamista",
        "Recibe efectivo al cierre y paga todo con una nueva hipoteca",
      ],
      whyClientsChoose: [
        "Acceda a una suma global basada en el patrimonio disponible y la calificación",
        "El interés puede ser menor que las opciones de préstamo sin garantía",
        "Posibles consideraciones fiscales—consulte a un profesional de impuestos",
        "Pago estructurado en el plazo hipotecario que usted elija",
      ],
      whatToKeepInMind: [
        "Su vivienda garantiza el préstamo—pida prestado dentro de lo que puede sostener.",
        "El interés total pagado puede aumentar si extiende el plazo o aumenta el saldo—revise el costo a largo plazo.",
      ],
    },
  },
  {
    id: "heloc",
    category: "equity",
    tags: ["Acceso Flexible"],
    title: "HELOC",
    shortDescription: "Acceda al patrimonio de su vivienda cuando lo necesite.",
    cardHook: "Use su patrimonio según su calendario—retire lo que necesite, cuando lo necesite, no una suma global por adelantado.",
    highlightLine: "Mantenga su hipoteca actual mientras agrega una línea de crédito flexible contra su patrimonio.",
    highlights: [
      "Las tasas generalmente superan a la mayoría de las tarjetas de crédito",
      "El pago sigue lo que retire y los términos de su prestamista",
    ],
    expanded: {
      fullDescription:
        "Una Línea de Crédito sobre el Patrimonio de la Vivienda (HELOC) le permite pedir prestado contra el patrimonio que ha acumulado, con una línea revolvente de la que puede retirar durante un período definido. En lugar de un refinanciamiento de suma global, pide prestado lo que necesita cuando lo necesita—luego paga según su retiro y los términos del prestamista.",
      whoFor: [
        "Propietarios con patrimonio acumulado",
        "Quienes necesitan acceso flexible a fondos con el tiempo",
        "Mejoras del hogar, consolidación de deuda u otros usos planificados",
      ],
      benefits: [
        "Pida prestado solo lo que necesita",
        "Tasas más bajas que la mayoría de las tarjetas de crédito",
        "Estructura de pago flexible dependiendo del saldo retirado",
        "Mantenga su hipoteca existente mientras agrega un segundo gravamen",
      ],
      howItWorks: [
        "Se evalúa el patrimonio de su vivienda",
        "Se aprueba una línea de crédito hasta un límite establecido",
        "Retira fondos según los necesite durante el período de retiro",
        "Paga con el tiempo según el calendario de su prestamista",
      ],
      reassurance: "¿No está seguro si este es el camino correcto? Está completamente bien.",
      primaryCta: { label: "Explore una línea de crédito para su vivienda", to: "/contact" },
    },
    modalDetail: {
      headline: "Una línea revolvente garantizada por su patrimonio—retire lo que necesite, cuando lo necesite",
      intro:
        "Una Línea de Crédito sobre el Patrimonio de la Vivienda (HELOC) le permite pedir prestado contra el patrimonio que ha acumulado, con una línea revolvente de la que puede retirar durante un período definido.",
      whenMakesSenseBullets: [
        "Quiere retirar con el tiempo en lugar de tomar una suma global ahora.",
        "Está planeando proyectos o costos que llegan en etapas.",
        "Le gustaría mantener su primera hipoteca actual en su lugar.",
        "Una tasa de línea puede superar lo que pagaría en la mayoría de las tarjetas de crédito.",
      ],
      atAGlance: {
        bestFor: "Propietarios que quieren flexibilidad y pueden no necesitar una suma global por adelantado",
        keyAdvantage: "Mantenga su hipoteca existente mientras agrega un segundo gravamen para acceso a fondos",
      },
      overviewParagraphs: [
        "En lugar de un refinanciamiento de suma global, pide prestado lo que necesita cuando lo necesita—luego paga según su retiro y los términos del prestamista.",
      ],
      whoTypically: [
        "Propietarios con patrimonio acumulado",
        "Quienes necesitan acceso flexible a fondos con el tiempo",
        "Mejoras del hogar, consolidación de deuda u otros usos planificados",
      ],
      keyRequirements: [
        "La puntuación de crédito debe cumplir los estándares del prestamista para una línea de patrimonio de vivienda",
        "Necesita suficiente patrimonio en su vivienda para soportar la línea y los límites del prestamista",
        "Sus deudas mensuales en relación con sus ingresos deben mantenerse dentro de lo que su prestamista permite",
        "La vivienda es garantía; su prestamista puede requerir avalúo o valuación de la vivienda",
        "Su prestamista establece períodos de retiro y reglas de pago que debe seguir",
      ],
      whyClientsChoose: [
        "Pida prestado solo lo que necesita",
        "Tasas más bajas que la mayoría de las tarjetas de crédito",
        "Estructura de pago flexible dependiendo del saldo retirado",
        "Mantenga su hipoteca existente mientras agrega un segundo gravamen",
      ],
      whatToKeepInMind: [
        "Las tasas y retiros pueden cambiar con el tiempo—comprenda su período de retiro y los términos de pago.",
        "Un HELOC es un segundo gravamen—el riesgo de incumplimiento es serio; trate los retiros como préstamo garantizado.",
      ],
    },
  },
  {
    id: "reverse",
    category: "equity",
    tags: ["Solo 62+"],
    title: "Hipoteca Inversa",
    shortDescription: "Acceso al patrimonio a los 62+—sin pagos hipotecarios mensuales al prestamista.",
    cardHook: "A los 62+, acceda al patrimonio sin pagos hipotecarios mensuales al prestamista mientras permanece en su vivienda.",
    highlightLine: "Reciba fondos como suma global, pagos mensuales o línea de crédito—según las reglas del programa.",
    highlights: [
      "Usted sigue pagando impuestos, seguro y mantenimiento",
      "El momento del pago sigue su contrato—revise con un asesor calificado",
    ],
    expanded: {
      fullDescription:
        "Una hipoteca inversa permite a propietarios elegibles de 62 años o más acceder al patrimonio de la vivienda sin realizar pagos hipotecarios mensuales al prestamista. Usted sigue siendo responsable de los impuestos a la propiedad, el seguro de propietarios y el mantenimiento de la vivienda. Los ingresos del préstamo pueden estructurarse de varias maneras; el pago generalmente se vence cuando la vivienda se vende, ya no es su residencia principal u otras condiciones del contrato aplican. Consulte a un asesor calificado—este producto tiene consideraciones importantes a largo plazo.",
      whoFor: [
        "Propietarios de 62 años o más",
        "Quienes buscan complementar los ingresos de jubilación",
        "Quienes quieren permanecer en su vivienda a largo plazo",
      ],
      benefits: [
        "Sin pagos hipotecarios mensuales requeridos al prestamista (las obligaciones como impuestos y seguro permanecen)",
        "Acceso a fondos—consulte a un asesor financiero sobre su situación",
        "Capacidad de permanecer en su vivienda mientras accede al patrimonio",
        "Opciones de pago flexibles dependiendo del programa",
      ],
      howItWorks: [
        "Se evalúa el valor de la vivienda y la posición de patrimonio",
        "Se calcula el monto elegible del préstamo basado en la edad, tasas y reglas del programa",
        "Los fondos pueden distribuirse como suma global, pagos mensuales o línea de crédito",
        "El préstamo generalmente se paga cuando la vivienda se vende o ya no es la residencia principal",
      ],
      reassurance: "¿Tiene preguntas? Le guiamos paso a paso.",
      primaryCta: { label: "Hable de este escenario con un experto", to: "/contact" },
    },
    modalDetail: {
      headline: "Acceda al patrimonio a los 62+ sin pagos hipotecarios mensuales al prestamista",
      intro:
        "Una hipoteca inversa permite a propietarios elegibles de 62 años o más acceder al patrimonio de la vivienda sin realizar pagos hipotecarios mensuales al prestamista. Usted sigue siendo responsable de los impuestos a la propiedad, el seguro de propietarios y el mantenimiento de la vivienda.",
      whenMakesSenseBullets: [
        "Tiene 62 años o más y planea quedarse en esta vivienda por el futuro previsible.",
        "Quiere acceder al patrimonio sin pagos hipotecarios mensuales al prestamista.",
        "Puede mantenerse al día con los impuestos a la propiedad, el seguro y el mantenimiento.",
        "Revisará las implicaciones a largo plazo con un asesor calificado antes de decidir.",
      ],
      atAGlance: {
        bestFor: "Propietarios de 62+ que quieren permanecer en su vivienda mientras acceden al patrimonio",
        keyAdvantage: "Sin pagos hipotecarios mensuales requeridos al prestamista (impuestos, seguro y mantenimiento permanecen)",
      },
      overviewParagraphs: [
        "Los ingresos del préstamo pueden estructurarse de varias maneras; el pago generalmente se vence cuando la vivienda se vende, ya no es su residencia principal u otras condiciones del contrato aplican.",
        "Consulte a un asesor calificado—este producto tiene consideraciones importantes a largo plazo.",
      ],
      whoTypically: [
        "Propietarios de 62 años o más",
        "Quienes buscan complementar los ingresos de jubilación",
        "Quienes quieren permanecer en su vivienda a largo plazo",
      ],
      keyRequirements: [
        "El crédito y los ingresos se revisan para demostrar que puede pagar impuestos, seguro y mantenimiento",
        "Debe tener la edad suficiente (típicamente 62 o más) y suficiente patrimonio",
        "Sus ingresos y deudas deben cumplir las pruebas financieras del programa (los detalles varían según el prestamista)",
        "La vivienda debe ser su residencia principal y cumplir las reglas de propiedad del programa",
        "Debe completar la asesoría con una agencia de asesoría de vivienda federal antes del cierre",
      ],
      whyClientsChoose: [
        "Sin pagos hipotecarios mensuales requeridos al prestamista (las obligaciones como impuestos y seguro permanecen)",
        "Acceso a fondos—consulte a un asesor financiero sobre su situación",
        "Capacidad de permanecer en su vivienda mientras accede al patrimonio",
        "Opciones de pago flexibles dependiendo del programa",
      ],
      whatToKeepInMind: [
        "Debe mantenerse al día con los impuestos a la propiedad, el seguro de propietarios y el mantenimiento de la vivienda.",
        "El momento y los desencadenantes del pago son específicos del contrato—revíselos cuidadosamente con un asesor calificado.",
        "Los ingresos pueden afectar beneficios, impuestos y planificación patrimonial—consulte a profesionales calificados para su situación.",
      ],
    },
  },
  {
    id: "non-qm",
    category: "purchase",
    tags: ["Calificación Flexible"],
    title: "Préstamo No-QM",
    shortDescription: "Diseñado para prestatarios fuera de los lineamientos tradicionales.",
    cardHook: "Califique cuando su historia de ingresos no encaja en el molde tradicional—sin renunciar al financiamiento.",
    highlightLine: "Extractos bancarios, activos o suscripción flexible construida para trabajadores independientes e ingresos complejos.",
    highlights: [
      "Ideal para trabajadores independientes y documentación no tradicional",
      "Enfoque de suscripción flexible con divulgaciones claras",
    ],
    expanded: {
      fullDescription:
        "Los préstamos hipotecarios no calificados (Non-QM) son para prestatarios que no cumplen los lineamientos estándar de agencia o hipoteca calificada. Los prestamistas usan suscripción flexible y documentación alternativa—como extractos bancarios o ingresos basados en activos—para evaluar a prestatarios trabajadores independientes y otros con finanzas complejas. Los términos, tasas y requisitos varían según el prestamista y el programa.",
      whoFor: [
        "Prestatarios trabajadores independientes que necesitan alternativas a los talones de pago tradicionales",
        "Prestatarios con ingresos complejos, inversiones o múltiples fuentes de ingresos",
        "Quienes pueden calificar con activos o reservas sólidas pero no con los índices tradicionales solos",
      ],
      benefits: [
        "Opciones de documentación de ingresos alternativos",
        "Suscripción flexible para prestatarios bien calificados fuera de los estándares habituales",
        "Puede apoyar metas de compra o refinanciamiento cuando los programas tradicionales no son una opción",
        "Revisión clara de riesgos, tasas y costos para su situación",
      ],
      howItWorks: [
        "Comparta sus metas y documentación para que podamos revisar las opciones No-QM",
        "El prestamista evalúa ingresos, activos, crédito y la propiedad bajo un marco No-QM",
        "Recibe términos y divulgaciones que reflejan su situación única",
        "Cierre su préstamo con una comprensión clara del pago y los costos",
      ],
      reassurance: "¿Se pregunta si No-QM tiene sentido para usted? Comparamos opciones lado a lado—sin presión.",
      primaryCta: { label: "Vea cómo se vería esto para su situación", to: "/contact" },
    },
    modalDetail: {
      headline: "Financiamiento cuando sus ingresos o situación no encajan en el molde tradicional",
      intro:
        "Los préstamos hipotecarios no calificados (Non-QM) sirven a prestatarios que no cumplen los lineamientos estándar de agencia o hipoteca calificada. Los prestamistas usan documentación alternativa y suscripción flexible para evaluar a prestatarios trabajadores independientes y otros con finanzas complejas.",
      whenMakesSenseBullets: [
        "Es trabajador independiente o sus ingresos no encajan en un simple talón de pago.",
        "Puede documentar ingresos con extractos bancarios, activos u otros métodos permitidos.",
        "Los programas estándar lo rechazaron—pero sus finanzas siguen siendo sólidas.",
        "Quiere una imagen clara de la tasa, el pago y las divulgaciones antes de comprometerse.",
      ],
      atAGlance: {
        bestFor: "Prestatarios trabajadores independientes y otros con ingresos complejos o no tradicionales",
        minCredit: "Varía según el prestamista y programa; mejor crédito generalmente mejora el precio",
        downPayment: "Frecuentemente mayor que los mínimos típicos; depende del prestamista y el escenario",
        keyAdvantage: "Verificación de ingresos alternativa y suscripción flexible",
      },
      overviewParagraphs: [
        "Estos préstamos no son de talla única. Los términos, tasas y requisitos varían según el prestamista y el programa, y debe recibir divulgaciones claras sobre el pago y los costos.",
        "Los préstamos No-QM no están respaldados por el gobierno; su prestamista explicará cómo su préstamo se ajusta a sus metas y tolerancia al riesgo.",
      ],
      whoTypically: [
        "Prestatarios trabajadores independientes que necesitan alternativas a los talones de pago tradicionales",
        "Prestatarios con ingresos complejos, inversiones o múltiples fuentes de ingresos",
        "Quienes pueden calificar con activos o reservas sólidas pero no con los índices tradicionales solos",
      ],
      keyRequirements: [
        "Las expectativas de puntuación de crédito varían según el prestamista y el programa (frecuentemente diferente de los préstamos tradicionales)",
        "La cuota inicial frecuentemente es mayor que los mínimos típicos; depende de su prestamista y escenario",
        "Sus deudas mensuales en relación con sus ingresos deben ajustarse al marco de hipoteca no calificada de su prestamista (frecuentemente documentado con extractos bancarios o ingresos basados en activos)",
        "La vivienda debe pasar el avalúo y cumplir las reglas de propiedad del prestamista",
        "Estos préstamos no están respaldados por el gobierno; las tasas, tarifas y divulgaciones varían según el prestamista",
      ],
      whyClientsChoose: [
        "Opciones de documentación de ingresos alternativos",
        "Suscripción flexible para prestatarios bien calificados fuera de los estándares habituales",
        "Puede apoyar metas de compra o refinanciamiento cuando los programas tradicionales no son una opción",
        "Revisión clara de riesgos, tasas y costos para su situación",
      ],
      whatToKeepInMind: [
        "Los precios y términos No-QM pueden diferir de los préstamos tradicionales—compare el costo total, no solo la tasa.",
        "Debe recibir divulgaciones que expliquen su préstamo; haga preguntas hasta que el pago y los riesgos estén claros.",
        "Las protecciones regulatorias pueden diferir de los productos de hipoteca calificada—revise con su asesor de préstamos.",
      ],
    },
    relatedProgramIds: ["bank-statement", "1099-income", "asset-depletion", "pl-loan", "foreign-national"],
  },
  {
    id: "dscr",
    category: "purchase",
    tags: ["Inversionistas Inmobiliarios"],
    title: "Préstamos DSCR para Inversionistas",
    shortDescription:
      "Financiamiento de alquiler con fines comerciales que puede centrarse en el flujo de efectivo esperado de la propiedad.",
    cardHook:
      "Explore financiamiento para propiedades de inversión cuando la calificación puede enfocarse en los ingresos por alquiler en lugar de la documentación tradicional de empleo.",
    highlightLine:
      "Puede apoyar estrategias **elegibles de compra o refinanciamiento** basadas en el **perfil de alquiler de la propiedad**",
    highlights: [
      "Diseñado para propiedades de alquiler elegibles con fines comerciales",
      "Puede considerar estrategias de alquiler a corto y largo plazo",
      "La documentación tradicional de ingresos personales puede no ser requerida en programas elegibles",
    ],
    expanded: {
      fullDescription:
        "El financiamiento DSCR está diseñado para inversionistas inmobiliarios cuya calificación puede centrarse en el flujo de efectivo esperado de la propiedad de alquiler, en lugar de los ingresos tradicionales provenientes del empleo. Ya sea que esté comprando otra propiedad de alquiler, refinanciando una inversión existente o ampliando su portafolio, un préstamo DSCR puede ofrecer una estrategia de financiamiento basada en la propiedad.",
      whoFor: [
        "Inversionistas inmobiliarios",
        "Alquileres a corto plazo",
        "Alquileres a largo plazo",
        "Crecimiento de portafolio",
        "Refinanciamiento de propiedades de inversión",
      ],
      benefits: [
        "Flujo de efectivo de la propiedad al centro — La calificación se enfoca principalmente en los ingresos de alquiler esperados y la obligación de vivienda aplicable.",
        "Diseñado para inversionistas — Creado específicamente para financiamiento elegible de propiedades de alquiler con fines comerciales.",
        "Compra o refinanciamiento — Explore compra elegible, refinanciamiento de tasa y plazo, refinanciamiento con retiro de efectivo y otras estrategias de inversión.",
        "Alquileres a corto y largo plazo — Ciertas propiedades de alquiler tradicionales y elegibles a corto plazo pueden considerarse.",
      ],
      howItWorks: [
        "Comience con la inversión — Revisamos la propiedad, sus metas de inversión y la estrategia de financiamiento que está considerando.",
        "Revise el perfil de alquiler — Evaluamos los ingresos de alquiler esperados y otra información aplicable de la propiedad.",
        "Explore opciones DSCR disponibles — Comparamos estructuras de financiamiento elegibles según el prestatario, la propiedad, el perfil de alquiler y los requisitos del programa.",
        "Estructure el financiamiento — Ayudamos a determinar qué opción disponible se alinea mejor con la estrategia de inversión.",
        "Avance con orientación — Infinite Home Lending permanece involucrado desde la solicitud hasta el cierre.",
      ],
      reassurance:
        "Una inversión sólida comienza con la revisión adecuada. Exploremos si un préstamo DSCR se alinea con el flujo de efectivo esperado de su propiedad y sus metas de inversión.",
      primaryCta: { label: "Hablemos", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "Deje que el flujo de efectivo de la propiedad ayude a guiar su estrategia.",
      intro:
        "El financiamiento DSCR está diseñado para inversionistas inmobiliarios cuya calificación puede centrarse en el flujo de efectivo esperado de la propiedad de alquiler, en lugar de los ingresos tradicionales provenientes del empleo. Ya sea que esté comprando otra propiedad de alquiler, refinanciando una inversión existente o ampliando su portafolio, un préstamo DSCR puede ofrecer una estrategia de financiamiento basada en la propiedad.",
      whenMakesSenseBullets: [
        "Está financiando una propiedad de alquiler — Pueden considerarse estrategias de alquiler elegibles a corto o largo plazo.",
        "Prefiere una revisión centrada en la propiedad — La calificación se centra principalmente en los ingresos de alquiler esperados en lugar de los ingresos tradicionales del empleo.",
        "Está ampliando su portafolio — Los inversionistas pueden usar financiamiento DSCR para buscar propiedades de alquiler elegibles adicionales.",
        "Quiere un enfoque de calificación alternativo — La documentación tradicional de ingresos personales puede no ser requerida en programas DSCR elegibles.",
      ],
      atAGlance: {
        bestFor: "Inversionistas inmobiliarios que buscan financiamiento elegible para propiedades de alquiler",
        keyAdvantage:
          "Calificación centrada en la propiedad que puede basarse en los ingresos de alquiler esperados en lugar de la documentación tradicional de empleo",
      },
      overviewParagraphs: [
        "¿Qué es un préstamo DSCR? Es una hipoteca con fines comerciales diseñada para inversionistas elegibles en propiedades de alquiler. La calificación normalmente se enfoca en el flujo de efectivo de alquiler esperado de la propiedad en lugar de los ingresos tradicionales del empleo, sujeto a las pautas del programa aplicable.",
        "La Relación de Cobertura del Servicio de la Deuda, o DSCR, compara los ingresos de alquiler calificables de una propiedad con su obligación de vivienda aplicable. A diferencia de una hipoteca tradicional que puede depender en gran medida de los ingresos del empleo, un préstamo DSCR evalúa el flujo de efectivo esperado de la propiedad de alquiler bajo las pautas del programa aplicable.",
        "¿En qué se diferencia el DSCR de un préstamo convencional para propiedades de inversión? El financiamiento tradicional para propiedades de inversión generalmente evalúa los ingresos personales y las obligaciones de deuda del prestatario. El financiamiento DSCR pone mayor énfasis en el flujo de efectivo esperado de la propiedad de alquiler.",
        "¿Puede usarse el financiamiento DSCR para alquileres a corto plazo? Ciertas propiedades elegibles de alquiler a corto y largo plazo pueden calificar según la propiedad y los requisitos del programa. ¿Puede una LLC ser propietaria? Ciertas entidades comerciales elegibles o estructuras fiduciarias pueden estar permitidas según el programa de financiamiento y la estructura de la transacción.",
      ],
      whoTypically: [
        "Inversionistas inmobiliarios",
        "Alquileres a corto plazo",
        "Alquileres a largo plazo",
        "Crecimiento de portafolio",
        "Refinanciamiento de propiedades de inversión",
      ],
      keyRequirements: [
        "Los ingresos por alquiler impulsan el análisis — Los ingresos de alquiler esperados de la propiedad desempeñan un papel central en la calificación.",
        "Los ingresos personales pueden no ser el enfoque — La documentación tradicional de empleo o ingresos personales puede no ser requerida en programas elegibles.",
        "Diseñado para propiedades de inversión — El financiamiento DSCR generalmente está destinado a transacciones elegibles de propiedades de alquiler con fines comerciales.",
        "Las estrategias de portafolio pueden apoyarse — El programa puede ayudar a los inversionistas a financiar propiedades elegibles adicionales a medida que crece su portafolio de alquiler.",
      ],
      whyClientsChoose: [
        "La calificación puede centrarse en los ingresos de alquiler esperados y la obligación de vivienda aplicable",
        "Puede apoyar compra, refinanciamiento de tasa y plazo, refinanciamiento con retiro de efectivo y otras estrategias elegibles de inversión",
        "Diseñado para inversionistas cuya documentación o estructura de ingresos puede no encajar en vías tradicionales",
        "Orientación desde la solicitud hasta el cierre con una revisión clara y educativa de las opciones disponibles",
      ],
      whatToKeepInMind: [
        "Los términos, la elegibilidad y la estructura varían según el prestamista, el programa, la propiedad y el prestatario—no se publican ratios ni requisitos específicos en esta página.",
        "El financiamiento DSCR generalmente está destinado a transacciones de propiedades de alquiler con fines comerciales, no a residencias principales ocupadas por el propietario.",
        "Los alquileres a corto plazo elegibles, la propiedad en entidades y las estrategias de refinanciamiento dependen de la propiedad y los requisitos del programa.",
        "Esta descripción es educativa; su asesor de préstamos explicará las divulgaciones aplicables y los próximos pasos para su escenario.",
      ],
    },
    relatedProgramIds: ["non-qm", "conventional", "foreign-national"],
  },
  {
    id: "foreign-national",
    category: "purchase",
    tags: ["Inversionistas Internacionales"],
    title: "Préstamos para Compradores Extranjeros",
    shortDescription:
      "Explore financiamiento para propiedades de inversión en Estados Unidos diseñado para ciertos compradores internacionales elegibles cuyos ingresos y activos se documentan principalmente fuera del país.",
    cardHook:
      "Explore financiamiento para propiedades de inversión en Estados Unidos diseñado para ciertos compradores internacionales elegibles cuyos ingresos y activos se documentan principalmente fuera del país.",
    highlightLine:
      "La calificación puede considerar el **flujo de renta de la propiedad**, **activos internacionales** y **documentación financiera alternativa** según las pautas del programa aplicable",
    highlights: [
      "Diseñado para inversionistas internacionales elegibles",
      "Financiamiento para propiedades de inversión en EE. UU.",
      "Puede considerarse documentación internacional",
    ],
    expanded: {
      fullDescription:
        "El financiamiento para compradores extranjeros puede ayudar a ciertos inversionistas internacionales a comprar o refinanciar una propiedad de inversión en Estados Unidos. La evaluación puede considerar el flujo de renta esperado de la propiedad, los activos disponibles, la documentación financiera internacional y la estructura completa de la transacción, en lugar de depender exclusivamente de ingresos laborales o declaraciones de impuestos de Estados Unidos. Infinite Home Lending ayuda a los inversionistas internacionales a comprender los requisitos de documentación, propiedad, estructura legal y financiamiento antes de avanzar. La elegibilidad final depende de la residencia del prestatario, la documentación, los activos, la propiedad, la estructura de titularidad y las pautas vigentes del programa.",
      whoFor: [
        "Inversionistas Internacionales",
        "Residentes fuera de EE. UU.",
        "Propiedades de Inversión",
        "Propiedades de Renta",
        "Compradores Internacionales",
        "Titularidad mediante Entidad",
      ],
      benefits: [
        "DISEÑADO PARA INVERSIONISTAS INTERNACIONALES — Ciertos residentes fuera de Estados Unidos pueden solicitar financiamiento para propiedades de inversión elegibles.",
        "PUEDE NO REQUERIR EMPLEO EN ESTADOS UNIDOS — La evaluación puede no depender de ingresos laborales tradicionales ni de declaraciones de impuestos estadounidenses.",
        "EL FLUJO DE RENTA PUEDE APOYAR LA EVALUACIÓN — El ingreso de renta esperado de la propiedad puede desempeñar un papel importante en el análisis del financiamiento.",
        "PUEDEN CONSIDERARSE CIERTAS ENTIDADES — Algunas estructuras de propiedad mediante entidades comerciales estadounidenses pueden ser permitidas, sujetas a los requisitos del programa.",
      ],
      howItWorks: [
        "REVISE SU ESTRATEGIA DE INVERSIÓN — Conversamos sobre la propiedad objetivo, el uso previsto, los planes de titularidad, el país de residencia y los objetivos de financiamiento.",
        "IDENTIFIQUE LA DOCUMENTACIÓN NECESARIA — Revisamos el pasaporte, la residencia, la banca, los activos, las referencias de crédito, la entidad y otra documentación aplicable disponible.",
        "EVALÚE LA PROPIEDAD — El prestamista revisa el tipo de propiedad, el perfil de renta esperado, la valoración, la estructura de la transacción y los requisitos del programa aplicable.",
        "ESTRUCTURE EL FINANCIAMIENTO — Comparamos opciones de compra o refinanciamiento elegibles según el prestatario, la propiedad, los activos, la estructura de titularidad y el programa.",
        "AVANCE CON ORIENTACIÓN — Infinite Home Lending ayuda a coordinar la solicitud, la documentación, la suscripción y el proceso de cierre.",
      ],
      reassurance:
        "Invertir en bienes raíces en Estados Unidos desde el extranjero implica preguntas únicas sobre documentación y estructura. Exploremos si el financiamiento para compradores extranjeros puede alinearse con su propiedad, activos y metas de inversión.",
      primaryCta: { label: "Hablemos", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "¿Invierte en bienes raíces en Estados Unidos desde el extranjero? Puede existir una opción de financiamiento.",
      intro:
        "El financiamiento para compradores extranjeros puede ayudar a ciertos inversionistas internacionales a comprar o refinanciar una propiedad de inversión en Estados Unidos. La evaluación puede considerar el flujo de renta esperado de la propiedad, los activos disponibles, la documentación financiera internacional y la estructura completa de la transacción, en lugar de depender exclusivamente de ingresos laborales o declaraciones de impuestos de Estados Unidos. Infinite Home Lending ayuda a los inversionistas internacionales a comprender los requisitos de documentación, propiedad, estructura legal y financiamiento antes de avanzar. La elegibilidad final depende de la residencia del prestatario, la documentación, los activos, la propiedad, la estructura de titularidad y las pautas vigentes del programa.",
      whenMakesSenseBullets: [
        "VIVE FUERA DE ESTADOS UNIDOS — Es un comprador internacional elegible cuya residencia principal y actividad financiera están fuera de Estados Unidos.",
        "BUSCA UNA PROPIEDAD DE INVERSIÓN EN EE. UU. — Desea comprar o refinanciar una propiedad elegible destinada a fines de inversión.",
        "SU DOCUMENTACIÓN FINANCIERA ES INTERNACIONAL — Sus ingresos, activos, registros bancarios o referencias de crédito pueden originarse fuera de Estados Unidos.",
        "DESEA UNA REVISIÓN CENTRADA EN LA PROPIEDAD — La calificación puede dar un énfasis significativo al perfil de renta esperado de la propiedad y a la transacción de inversión completa.",
      ],
      atAGlance: {
        bestFor:
          "Inversionistas internacionales elegibles que compran o refinancian propiedades de inversión calificables en Estados Unidos",
        keyAdvantage:
          "El financiamiento puede evaluarse usando la propiedad, los activos disponibles, la documentación internacional y la estructura de la transacción sin depender exclusivamente de ingresos laborales tradicionales en Estados Unidos",
      },
      overviewParagraphs: [
        "¿Qué es un préstamo para compradores extranjeros? Es un programa hipotecario diseñado para ciertos prestatarios elegibles cuya residencia principal y actividad financiera están fuera de Estados Unidos. Estos programas pueden ayudar a compradores internacionales calificables a comprar o refinanciar bienes raíces elegibles en EE. UU., comúnmente con fines de inversión. La calificación puede considerar los ingresos de renta esperados de la propiedad, los activos del prestatario, registros financieros internacionales, la estructura de titularidad y otra documentación específica del programa. Los requisitos varían significativamente según el prestamista, el país, el perfil del prestatario, la propiedad y la transacción.",
        "¿Quién puede considerar este programa? Este enfoque puede ser relevante para residentes elegibles fuera de EE. UU., inversionistas inmobiliarios internacionales, compradores que viven y trabajan principalmente fuera de Estados Unidos, prestatarios cuyos ingresos y activos se documentan internacionalmente, compradores de propiedades de inversión elegibles en EE. UU., inversionistas extranjeros existentes que refinancian propiedades elegibles, compradores que consideran titularidad mediante una entidad estadounidense elegible e inversionistas sin un perfil tradicional de empleo en Estados Unidos. La ciudadanía o el estatus de residencia por sí solos no determinan la elegibilidad.",
        "¿Necesito ingresos en Estados Unidos? Los ingresos laborales tradicionales en EE. UU. pueden no ser requeridos bajo ciertos programas para compradores extranjeros. Sin embargo, el prestamista aún evaluará los activos del prestatario, la documentación financiera internacional, la capacidad de completar la transacción, el perfil de la propiedad y los requisitos del programa aplicable.",
        "¿Necesito crédito en Estados Unidos? Un perfil crediticio tradicional establecido en EE. UU. puede no ser siempre requerido. Según el programa, el prestamista puede revisar referencias de crédito alternativas, información crediticia internacional, historial bancario, activos, historial de vivienda u otra documentación. Los requisitos de evaluación crediticia varían según el prestamista y el perfil del prestatario.",
        "¿Es un préstamo DSCR? Algunos programas para compradores extranjeros usan un enfoque de calificación centrado en la propiedad similar al financiamiento DSCR. El prestamista puede comparar los ingresos de renta esperados de la propiedad con su obligación de vivienda aplicable. Sin embargo, no todos los programas para compradores extranjeros están estructurados de la misma manera, y siguen aplicando requisitos adicionales del prestatario, activos, entidad, propiedad y transacción.",
        "¿Qué uso de propiedad se considera típicamente? El financiamiento para compradores extranjeros comúnmente está diseñado para propiedades de inversión elegibles, en lugar de residencias principales ocupadas por el propietario.",
        "¿Puedo comprar mediante una LLC? Ciertas entidades comerciales estadounidenses calificables pueden estar permitidas para la titularidad, según el prestamista, la transacción, la propiedad, la estructura de titularidad y los requisitos del programa. El prestatario debe consultar con profesionales legales y fiscales apropiados sobre la formación y titularidad de la entidad. Infinite Home Lending no proporciona asesoría legal ni fiscal.",
        "¿Puedo comprar o refinanciar? Pueden considerarse transacciones elegibles de compra y refinanciamiento. Ciertos programas también pueden apoyar refinanciamiento de tasa y plazo, refinanciamiento con retiro de efectivo o estrategias de financiamiento diferido, sujeto a las pautas vigentes.",
        "¿Qué documentos financieros pueden requerirse? Los prestatarios deben esperar proporcionar identificación aceptable, documentación de residencia, estados de cuenta bancarios internacionales, estados de activos, documentación del origen de fondos, referencias de crédito o registros crediticios alternativos, historial de vivienda, documentos de entidad comercial cuando aplique, documentación de la propiedad y renta, y verificación de fondos necesarios para el cierre y reservas. Los documentos extranjeros pueden requerir traducción o certificación, y puede aplicarse documentación adicional solicitada por el prestamista.",
        "¿Pueden mis fondos permanecer fuera de Estados Unidos? Algunos programas pueden permitir que ciertos fondos permanezcan en una institución financiera extranjera elegible, mientras que otros fondos pueden necesitar transferirse, documentarse, mantenerse o depositarse en una cuenta estadounidense aceptable antes del cierre. Los plazos y requisitos de cuenta exactos dependen del prestamista y del programa.",
        "¿Necesito una visa? Los requisitos de visa, residencia, estatus de entrada e identificación varían según el prestamista y el programa. Algunos programas pueden requerir documentación de inmigración o viaje aceptable, mientras que otros pueden evaluar la residencia de manera diferente. El prestatario debe proporcionar documentación actual para revisión y consultar a un abogado de inmigración para orientación legal sobre inmigración.",
        "¿Cuál es la diferencia entre un préstamo para compradores extranjeros y un préstamo ITIN? Un préstamo para compradores extranjeros generalmente está diseñado para prestatarios cuya residencia principal y actividad financiera permanecen fuera de Estados Unidos. Un préstamo ITIN generalmente está diseñado para ciertos prestatarios que viven o ganan ingresos en Estados Unidos y usan un Número de Identificación Personal del Contribuyente en lugar de un número de Seguro Social. La vía correcta depende de la residencia, la ubicación de los ingresos, la documentación, el estatus migratorio y la transacción de la propiedad.",
      ],
      whoTypically: [
        "Inversionistas inmobiliarios internacionales",
        "Residentes fuera de EE. UU.",
        "Compradores que viven principalmente fuera de Estados Unidos",
        "Inversionistas que compran propiedades de alquiler en EE. UU.",
        "Inversionistas que refinancian propiedades elegibles en EE. UU.",
        "Prestatarios que usan activos internacionales",
        "Compradores con documentación financiera internacional",
        "Inversionistas que usan una entidad estadounidense elegible",
        "Compradores sin ingresos laborales tradicionales en EE. UU.",
        "Compradores cuya calificación puede centrarse parcialmente en el flujo de efectivo de la propiedad",
      ],
      keyRequirements: [
        "El prestatario debe cumplir la definición de residencia del programa",
        "Se requiere identificación y documentación de residencia aceptables",
        "La propiedad debe cumplir los requisitos de propiedad de inversión elegible",
        "Los activos internacionales deben documentarse y verificarse en cuanto a su origen",
        "Los fondos requeridos para el cierre y reservas deben verificarse",
        "Pueden requerirse referencias de crédito alternativas o internacionales",
        "El flujo de efectivo de la propiedad puede revisarse",
        "Las estructuras de titularidad elegibles deben documentarse",
        "Los documentos extranjeros pueden requerir traducción o certificación",
        "Pueden aplicar requisitos bancarios y de transferencia",
        "El prestatario, la propiedad, la estructura de titularidad y la transacción deben cumplir los estándares actuales de suscripción",
        "La elegibilidad final depende de una revisión completa",
      ],
      whyClientsChoose: [
        "Desean invertir en bienes raíces en EE. UU. mientras viven en el extranjero",
        "Pueden no tener ingresos laborales tradicionales en Estados Unidos",
        "Sus registros financieros y activos se mantienen internacionalmente",
        "El perfil de renta esperado de la propiedad puede apoyar la calificación",
        "Pueden considerarse ciertas estructuras de entidad estadounidense",
        "Pueden estar disponibles estrategias de compra y refinanciamiento",
        "Infinite Home Lending ayuda a organizar una vía de documentación transfronteriza",
        "El programa ofrece una alternativa a la calificación tradicional de prestatarios en EE. UU.",
      ],
      whatToKeepInMind: [
        "Los requisitos varían sustancialmente según el prestamista y el país del prestatario",
        "Comúnmente aplican restricciones para propiedades de inversión",
        "Pueden requerirse aportes del prestatario mayores que en financiamiento tradicional",
        "Pueden requerirse reservas y activos líquidos",
        "Los activos extranjeros deben documentarse y ser aceptables",
        "Pueden aplicar requisitos de conversión de moneda y transferencia",
        "Los documentos internacionales pueden requerir traducción certificada",
        "Pueden aplicar requisitos bancarios en EE. UU. antes del cierre",
        "Pueden necesitarse referencias de crédito o documentación crediticia alternativa",
        "La titularidad mediante entidad no elimina los requisitos de documentación personal",
        "Las tasas y precios pueden diferir del financiamiento tradicional de agencias",
        "Las preguntas fiscales, legales, migratorias y de entidad deben revisarse con profesionales calificados",
        "La aprobación depende del perfil completo del prestatario, la propiedad, la titularidad y la transacción",
        "La disponibilidad del programa puede variar según el estado, el prestamista, la ubicación de la propiedad y las circunstancias del prestatario",
      ],
    },
    relatedProgramIds: ["dscr", "non-qm", "asset-depletion"],
  },
  {
    id: "bank-statement",
    category: "purchase",
    tags: ["Trabajadores Independientes"],
    title: "Préstamos con Estados de Cuenta Bancarios",
    shortDescription:
      "Documentación alternativa de ingresos mediante estados de cuenta personales o comerciales para prestatarios elegibles que trabajan por cuenta propia.",
    cardHook:
      "Documente sus ingresos calificables mediante un historial elegible de estados de cuenta cuando las vías tradicionales con declaraciones de impuestos pueden no reflejar cómo gana.",
    highlightLine:
      "Puede apoyar estrategias **elegibles de compra o refinanciamiento** basadas en la **actividad de depósitos bancarios** en lugar de depender únicamente de declaraciones de impuestos tradicionales",
    highlights: [
      "Diseñado para prestatarios elegibles que trabajan por cuenta propia y dueños de negocios",
      "Los estados de cuenta personales o comerciales pueden ayudar a documentar ingresos calificables",
      "Pueden considerarse residencias principales, segundas viviendas y propiedades de inversión",
    ],
    expanded: {
      fullDescription:
        "Los Préstamos con Estados de Cuenta Bancarios ofrecen una forma alternativa para que prestatarios elegibles que trabajan por cuenta propia documenten sus ingresos utilizando estados de cuenta personales o comerciales, en lugar de depender únicamente de declaraciones de impuestos tradicionales. Ya sea que esté comprando una vivienda, refinanciando una hipoteca existente o explorando financiamiento para otra propiedad elegible, este programa puede ofrecer una vía de calificación alternativa basada en cómo gana realmente.",
      whoFor: [
        "Trabajadores Independientes",
        "Dueños de Negocios",
        "Contratistas Independientes",
        "Emprendedores",
        "Documentación Alternativa de Ingresos",
      ],
      benefits: [
        "Documentación de ingresos basada en su negocio — Los prestatarios elegibles pueden documentar ingresos mediante un historial de estados de cuenta personales o comerciales.",
        "Menor dependencia de declaraciones de impuestos tradicionales — La calificación puede usar documentación alternativa de ingresos en lugar de depender únicamente del análisis de declaraciones de impuestos tradicionales.",
        "Estrategias de propiedad flexibles — Pueden considerarse residencias principales, segundas viviendas y propiedades de inversión elegibles según los requisitos del programa.",
        "Compra o refinanciamiento — Las estrategias disponibles pueden incluir compras elegibles, refinanciamientos de tasa y plazo, refinanciamientos con retiro de efectivo y otras transacciones calificables.",
      ],
      howItWorks: [
        "Comience con su historia de ingresos — Conocemos cómo gana, cómo opera su negocio y qué desea lograr con el financiamiento.",
        "Revise su historial de estados de cuenta — Evaluamos estados de cuenta personales o comerciales elegibles y otra documentación aplicable.",
        "Determine los ingresos calificables — El prestamista aplica la metodología del programa correspondiente para determinar los ingresos calificables elegibles.",
        "Compare las opciones disponibles — Infinite Home Lending revisa los programas de Estados de Cuenta disponibles entre los prestamistas participantes.",
        "Avance con orientación — Permanecemos involucrados durante la suscripción y el cierre para que comprenda el proceso y los próximos pasos.",
      ],
      reassurance:
        "Su historia de ingresos importa. Exploremos si un Préstamo con Estados de Cuenta Bancarios se alinea con cómo gana y lo que desea lograr.",
      primaryCta: { label: "Hablemos", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "¿Trabaja por cuenta propia? Sus estados de cuenta pueden contar la historia de otra manera.",
      intro:
        "Los Préstamos con Estados de Cuenta Bancarios ofrecen una forma alternativa para que prestatarios elegibles que trabajan por cuenta propia documenten sus ingresos utilizando estados de cuenta personales o comerciales, en lugar de depender únicamente de declaraciones de impuestos tradicionales. Ya sea que esté comprando una vivienda, refinanciando una hipoteca existente o explorando financiamiento para otra propiedad elegible, este programa puede ofrecer una vía de calificación alternativa basada en cómo gana realmente.",
      whenMakesSenseBullets: [
        "Trabaja por cuenta propia — Sus ingresos pueden no encajar fácilmente en la documentación tradicional de W-2.",
        "Sus depósitos bancarios reflejan la actividad de su negocio — Los estados de cuenta personales o comerciales elegibles pueden usarse para ayudar a documentar ingresos calificables.",
        "Es propietario total o parcial de un negocio — Ciertos programas pueden acomodar prestatarios elegibles que poseen una participación calificable del negocio.",
        "Está comprando o refinanciando — El financiamiento con estados de cuenta puede apoyar estrategias elegibles de compra y refinanciamiento.",
      ],
      atAGlance: {
        bestFor:
          "Prestatarios que trabajan por cuenta propia cuyos ingresos calificables pueden representarse mejor mediante actividad elegible en estados de cuenta",
        keyAdvantage:
          "Documentación alternativa de ingresos que puede reducir la dependencia del análisis tradicional de declaraciones de impuestos",
      },
      overviewParagraphs: [
        "¿Qué es un Préstamo con Estados de Cuenta Bancarios? Es una hipoteca con documentación alternativa que puede permitir a prestatarios elegibles que trabajan por cuenta propia usar estados de cuenta personales o comerciales para ayudar a establecer ingresos calificables en lugar de depender únicamente de declaraciones de impuestos tradicionales.",
        "¿Para quién está diseñado normalmente? El financiamiento con estados de cuenta generalmente está diseñado para prestatarios elegibles que trabajan por cuenta propia, dueños de negocios, emprendedores y contratistas independientes cuyos ingresos pueden no estar plenamente representados por documentación tradicional.",
        "¿Cuántos meses de estados de cuenta se revisan? Según el programa, los prestamistas pueden revisar un historial definido de estados de cuenta personales o comerciales elegibles. El período exacto de documentación varía según el programa y el perfil del prestatario.",
        "¿Debo ser propietario del 100% de mi negocio? No necesariamente. Ciertos programas pueden acomodar prestatarios elegibles que poseen solo una porción calificable del negocio.",
        "¿Pueden usarse para propiedades de inversión? Ciertas residencias principales, segundas viviendas y propiedades de inversión elegibles pueden calificar según los requisitos del programa.",
        "¿Puedo refinanciar con un Préstamo con Estados de Cuenta? Los programas elegibles pueden apoyar estrategias de refinanciamiento de tasa y plazo y con retiro de efectivo.",
        "¿Cómo se calculan los ingresos del negocio? El prestamista revisa los depósitos elegibles y aplica la metodología del programa correspondiente para determinar los ingresos calificables. Según el negocio y el programa, puede requerirse documentación adicional.",
        "¿En qué se diferencia de un Préstamo de Ingresos 1099? Un Préstamo con Estados de Cuenta generalmente analiza el historial elegible de depósitos bancarios, mientras que un programa de Ingresos 1099 se centra más específicamente en las ganancias documentadas en formularios 1099.",
      ],
      whoTypically: [
        "Trabajadores Independientes",
        "Dueños de Negocios",
        "Contratistas Independientes",
        "Emprendedores",
        "Documentación Alternativa de Ingresos",
      ],
      keyRequirements: [
        "La actividad bancaria puede ayudar a documentar ingresos — En lugar de depender exclusivamente de declaraciones de impuestos tradicionales, los ingresos calificables pueden evaluarse mediante un historial elegible de estados de cuenta.",
        "Diseñado para ingresos de trabajadores independientes — El programa está diseñado para prestatarios cuya estructura de ingresos puede no encajar en métodos de documentación tradicionales.",
        "La propiedad del negocio puede ser flexible — Ciertos programas elegibles pueden acomodar prestatarios que poseen menos del 100% de un negocio.",
        "Documentación adicional puede apoyar la revisión — Según el programa y la estructura del negocio, puede requerirse documentación adicional como un estado de resultados o un análisis de gastos por terceros.",
      ],
      whyClientsChoose: [
        "Los ingresos pueden documentarse mediante un historial elegible de estados de cuenta personales o comerciales",
        "Puede reducir la dependencia del análisis tradicional de declaraciones de impuestos para ingresos calificables",
        "Pueden considerarse residencias principales, segundas viviendas y propiedades de inversión elegibles",
        "Orientación desde la solicitud hasta el cierre con una revisión clara y educativa de las opciones disponibles",
      ],
      whatToKeepInMind: [
        "Los términos, la elegibilidad, la documentación y la estructura del préstamo varían según el prestamista, el programa, el prestatario y la propiedad.",
        "Los programas de Estados de Cuenta usan métodos específicos para determinar depósitos elegibles e ingresos calificables.",
        "Puede requerirse documentación adicional según la estructura del negocio del prestatario y el programa aplicable.",
        "La elegibilidad de la propiedad y los tipos de transacción disponibles varían según el programa.",
        "Esta página es educativa. Infinite Home Lending revisará los requisitos del programa aplicable para el escenario individual del prestatario.",
      ],
    },
    relatedProgramIds: ["1099-income", "non-qm", "dscr", "asset-depletion", "pl-loan"],
  },
  {
    id: "1099-income",
    category: "purchase",
    tags: ["Trabajadores Independientes"],
    title: "Préstamos con Ingresos 1099",
    shortDescription:
      "Calificación alternativa para prestatarios elegibles cuyos ingresos se documentan mediante formularios 1099.",
    cardHook:
      "Califique usando ingresos 1099 documentados cuando las vías tradicionales de empleo W-2 pueden no reflejar cómo gana.",
    highlightLine:
      "Puede apoyar estrategias **elegibles de compra o refinanciamiento** basadas en **ingresos 1099 documentados** en lugar de depender únicamente de ingresos tradicionales de empleo",
    highlights: [
      "Diseñado para contratistas independientes, freelancers y trabajadores de la economía gig elegibles",
      "Los ingresos 1099 documentados pueden ayudar a establecer ingresos calificables",
      "Pueden considerarse viviendas ocupadas por el propietario, segundas viviendas y propiedades de inversión",
    ],
    expanded: {
      fullDescription:
        "Los Préstamos con Ingresos 1099 ofrecen una alternativa de calificación para prestatarios elegibles que trabajan por cuenta propia y cuyos ingresos se documentan mediante formularios 1099, en lugar de depender únicamente de ingresos tradicionales W-2. Para contratistas independientes, freelancers, consultores, trabajadores de la economía gig y otros profesionales elegibles que reciben ingresos 1099, este programa puede ofrecer una forma diferente de documentar ingresos para fines de calificación.",
      whoFor: [
        "Contratistas Independientes",
        "Freelancers",
        "Consultores",
        "Trabajadores Independientes",
        "Ingresos 1099",
      ],
      benefits: [
        "Use ingresos 1099 documentados — Los prestatarios elegibles pueden calificar usando ingresos 1099 documentados en lugar de depender únicamente del análisis tradicional de declaraciones de impuestos.",
        "Diseñado para trabajadores independientes — Creado para contratistas, freelancers, consultores, trabajadores de la economía gig y otros profesionales elegibles que reciben ingresos 1099.",
        "Los ingresos actuales pueden apoyar la revisión — Según el programa, los ingresos acumulados del año en curso pueden verificarse mediante estados de ganancias, talones de pago, estados de cuenta u otra documentación requerida.",
        "Compra o refinanciamiento — Los programas elegibles pueden apoyar compra, refinanciamiento de tasa y plazo, refinanciamiento con retiro de efectivo y otras estrategias de financiamiento calificables.",
      ],
      howItWorks: [
        "Comience con cómo gana — Revisamos sus ingresos 1099, historial laboral, ingresos actuales y lo que desea lograr con el financiamiento.",
        "Revise su documentación 1099 — Evaluamos los formularios 1099 aplicables y otra documentación requerida para el programa.",
        "Verifique los ingresos actuales — Los ingresos acumulados del año en curso pueden revisarse mediante estados de ganancias, talones de pago, estados de cuenta u otra documentación requerida por el programa.",
        "Compare las opciones disponibles — Infinite Home Lending revisa programas elegibles de Ingresos 1099 entre los prestamistas participantes.",
        "Avance con orientación — Permanecemos involucrados durante la suscripción y el cierre para que comprenda el proceso y los próximos pasos.",
      ],
      reassurance:
        "Cómo gana importa. Exploremos si un Préstamo con Ingresos 1099 se alinea con sus ingresos documentados y lo que desea lograr.",
      primaryCta: { label: "Hablemos", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "¿Contratista independiente? Sus ingresos 1099 pueden abrir otra alternativa.",
      intro:
        "Los Préstamos con Ingresos 1099 ofrecen una alternativa de calificación para prestatarios elegibles que trabajan por cuenta propia y cuyos ingresos se documentan mediante formularios 1099, en lugar de depender únicamente de ingresos tradicionales W-2. Para contratistas independientes, freelancers, consultores, trabajadores de la economía gig y otros profesionales elegibles que reciben ingresos 1099, este programa puede ofrecer una forma diferente de documentar ingresos para fines de calificación.",
      whenMakesSenseBullets: [
        "Gana ingresos mediante formularios 1099 — Sus ingresos provienen principalmente de trabajo por contrato, freelance, consultoría u otro trabajo por cuenta propia.",
        "Sus ingresos no encajan en un perfil W-2 tradicional — Los prestatarios elegibles pueden calificar usando ingresos 1099 documentados en lugar de ingresos tradicionales de empleo.",
        "Sus ingresos muestran consistencia — Un historial documentado de ingresos 1099 e ingresos actuales puede ayudar a apoyar la calificación, sujeto a los requisitos del programa.",
        "Está comprando o refinanciando — El financiamiento con Ingresos 1099 puede apoyar estrategias elegibles de compra y refinanciamiento.",
      ],
      atAGlance: {
        bestFor:
          "Contratistas independientes, freelancers, consultores, trabajadores de la economía gig y otros prestatarios elegibles cuyos ingresos se documentan principalmente mediante formularios 1099",
        keyAdvantage:
          "Documentación alternativa de ingresos que puede permitir a prestatarios elegibles con ingresos 1099 calificar sin depender únicamente del análisis tradicional de declaraciones de impuestos",
      },
      overviewParagraphs: [
        "¿Qué es un Préstamo con Ingresos 1099? Es una hipoteca con documentación alternativa que puede permitir a prestatarios elegibles que trabajan por cuenta propia usar ingresos 1099 documentados para establecer ingresos calificables en lugar de depender únicamente de declaraciones de impuestos tradicionales.",
        "¿Para quién está diseñado normalmente? Generalmente está diseñado para contratistas independientes, freelancers, consultores, trabajadores de la economía gig y otros prestatarios elegibles que trabajan por cuenta propia y reciben ingresos 1099.",
        "¿Necesito declaraciones de impuestos tradicionales para calificar? Ciertos programas elegibles de Ingresos 1099 pueden permitir la calificación usando ingresos 1099 documentados y otra documentación de ingresos requerida en lugar de depender únicamente del análisis tradicional de declaraciones de impuestos.",
        "¿Cómo se verifican los ingresos actuales? Según el programa, los ingresos acumulados del año en curso pueden verificarse mediante estados de ganancias, talones de pago, estados de cuenta u otra documentación requerida.",
        "¿Se requiere historial laboral? El prestamista puede revisar el historial de trabajo por cuenta propia, la línea de trabajo y la consistencia de los ingresos como parte del proceso de calificación. Los requisitos exactos varían según el programa.",
        "¿Puede usarse un Préstamo con Ingresos 1099 para refinanciar? Los programas elegibles pueden apoyar refinanciamiento de tasa y plazo, refinanciamiento con retiro de efectivo y otras estrategias de refinanciamiento calificables.",
        "¿Qué tipos de propiedades pueden calificar? Según el programa, pueden considerarse residencias ocupadas por el propietario, segundas viviendas y propiedades de inversión elegibles.",
        "¿En qué se diferencia de un Préstamo con Estados de Cuenta Bancarios? Un Préstamo con Ingresos 1099 generalmente se centra en ingresos 1099 documentados, mientras que un Préstamo con Estados de Cuenta típicamente analiza el historial elegible de depósitos bancarios personales o comerciales para ayudar a determinar los ingresos calificables.",
      ],
      whoTypically: [
        "Contratistas Independientes",
        "Freelancers",
        "Consultores",
        "Trabajadores Independientes",
        "Ingresos 1099",
      ],
      keyRequirements: [
        "Sus ingresos 1099 impulsan la revisión — La calificación puede centrarse en ingresos 1099 documentados en lugar de empleo tradicional W-2.",
        "Los ingresos actuales pueden verificarse de forma diferente — Según el programa, los ingresos acumulados del año en curso pueden revisarse mediante estados de ganancias, talones de pago, estados de cuenta u otra documentación requerida.",
        "Diseñado para trabajo independiente — El programa está diseñado para prestatarios cuyos ingresos provienen de trabajo por contrato, freelance, consultoría, economía gig u otro trabajo elegible por cuenta propia.",
        "Pueden estar disponibles opciones de propiedad — Según el programa, pueden considerarse viviendas ocupadas por el propietario, segundas viviendas y propiedades de inversión elegibles.",
      ],
      whyClientsChoose: [
        "La calificación puede centrarse en ingresos 1099 documentados en lugar de empleo tradicional W-2",
        "Los ingresos acumulados del año en curso pueden revisarse usando la documentación aplicable del programa",
        "Pueden considerarse viviendas ocupadas por el propietario, segundas viviendas y propiedades de inversión elegibles",
        "Orientación desde la solicitud hasta el cierre con una revisión clara y educativa de las opciones disponibles",
      ],
      whatToKeepInMind: [
        "Los términos, la elegibilidad, la documentación y la estructura del préstamo varían según el prestamista, el programa, el prestatario y la propiedad.",
        "Los programas de Ingresos 1099 pueden requerir un historial documentado de ingresos por cuenta propia y evidencia de ingresos actuales.",
        "El prestamista puede revisar la continuidad del trabajo, la fuente de ingresos y la documentación acumulada del año en curso aplicable.",
        "La elegibilidad de la propiedad y los tipos de transacción disponibles varían según el programa.",
        "Esta página es educativa. Infinite Home Lending revisará los requisitos del programa aplicable para el escenario individual del prestatario.",
      ],
    },
    relatedProgramIds: ["bank-statement", "non-qm", "dscr", "asset-depletion", "pl-loan"],
  },
  {
    id: "dpa-advantage",
    category: "purchase",
    tags: ["Asistencia para Cuota Inicial"],
    title: "DPA Advantage — Asistencia para el Pago Inicial",
    shortDescription:
      "Asistencia en forma de subvención para compradores elegibles que adquieren una residencia principal calificable.",
    cardHook:
      "La propiedad puede estar más cerca cuando parte del efectivo inicial necesario para la compra puede apoyarse con una subvención elegible.",
    highlightLine:
      "Puede proporcionar **asistencia en subvención equivalente al 2% o 3.5%** del precio de compra **sin reembolso** ni **segundo gravamen**, sujeto a elegibilidad",
    highlights: [
      "Diseñado para compradores elegibles que adquieren una residencia principal calificable",
      "La subvención puede reducir los fondos personales necesarios para la cuota inicial",
      "Puede combinarse con estructuras de financiamiento FHA elegibles",
    ],
    expanded: {
      fullDescription:
        "DPA Advantage está diseñado para ayudar a compradores elegibles a reducir uno de los mayores retos iniciales al comprar una vivienda: el pago inicial. El programa puede proporcionar asistencia en forma de subvención equivalente al 2% o 3.5% del precio de compra cuando se combina con una estructura de financiamiento FHA elegible. Debido a que la asistencia se ofrece como una subvención, no requiere reembolso ni establece un segundo gravamen sobre la propiedad. La elegibilidad y las combinaciones de programas disponibles están sujetas a las pautas aplicables.",
      whoFor: [
        "Compradores de Vivienda",
        "Compradores Primerizos",
        "Asistencia para Cuota Inicial",
        "Residencia Principal",
        "Financiamiento FHA",
      ],
      benefits: [
        "Asistencia en forma de subvención — Los prestatarios elegibles pueden recibir asistencia equivalente al 2% o 3.5% del precio de compra, sujeto a los requisitos del programa.",
        "Sin reembolso requerido — La asistencia DPA Advantage se estructura como una subvención y no como una segunda hipoteca reembolsable.",
        "Sin segundo gravamen — La subvención no requiere establecer un segundo gravamen sobre la propiedad.",
        "Puede funcionar con opciones FHA elegibles — DPA Advantage puede combinarse con financiamiento FHA calificable y ciertos programas FHA de renovación elegibles, sujeto a las pautas aplicables.",
      ],
      howItWorks: [
        "Comience con sus metas de propiedad — Revisamos lo que desea comprar, sus fondos disponibles y dónde la asistencia para la cuota inicial puede ayudar.",
        "Revise la elegibilidad DPA — Evaluamos al prestatario, la propiedad, la estructura de financiamiento y la vía de elegibilidad DPA Advantage aplicable.",
        "Combine la subvención con financiamiento elegible — Determinamos si DPA Advantage puede combinarse con una opción de financiamiento FHA disponible para su escenario.",
        "Complete la educación para compradores requerida — Los prestatarios elegibles completan la orientación para propietarios o educación para compradores aplicable.",
        "Avance con orientación — Infinite Home Lending permanece involucrado durante la solicitud, suscripción y cierre para que el financiamiento y la asistencia permanezcan claramente coordinados.",
      ],
      reassurance:
        "La asistencia para la cuota inicial puede cambiar la ecuación de comprar una vivienda. Revisemos si DPA Advantage puede ajustarse a sus metas y vía de financiamiento elegible.",
      primaryCta: { label: "Hablemos", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "Su pago inicial no tiene que ser el obstáculo entre usted y su nuevo hogar.",
      intro:
        "DPA Advantage está diseñado para ayudar a compradores elegibles a reducir uno de los mayores retos iniciales al comprar una vivienda: el pago inicial. El programa puede proporcionar asistencia en forma de subvención equivalente al 2% o 3.5% del precio de compra cuando se combina con una estructura de financiamiento FHA elegible. Debido a que la asistencia se ofrece como una subvención, no requiere reembolso ni establece un segundo gravamen sobre la propiedad. La elegibilidad y las combinaciones de programas disponibles están sujetas a las pautas aplicables.",
      whenMakesSenseBullets: [
        "Necesita ayuda con la cuota inicial — Los prestatarios elegibles pueden recibir asistencia en subvención que puede reducir los fondos personales necesarios para la compra.",
        "Está comprando una residencia principal — DPA Advantage está diseñado para compradores elegibles que adquieren una residencia principal calificable.",
        "Puede calificar a través de varias vías de elegibilidad — El programa incluye múltiples vías potenciales, incluyendo ciertos compradores primerizos y categorías ocupacionales, de ingresos o de ubicación de propiedad calificables.",
        "Está dispuesto a completar educación para compradores — Los prestatarios elegibles deben completar la orientación para propietarios o educación para compradores aplicable como parte de los requisitos del programa.",
      ],
      atAGlance: {
        bestFor:
          "Compradores elegibles que pueden beneficiarse de asistencia en subvención hacia la cuota inicial en una residencia principal calificable",
        keyAdvantage:
          "Asistencia para la cuota inicial en forma de subvención sin reembolso requerido ni segundo gravamen, sujeto a la elegibilidad del programa",
      },
      overviewParagraphs: [
        "¿Qué es DPA Advantage? Es un programa de asistencia para la cuota inicial diseñado para proporcionar a prestatarios elegibles fondos en subvención hacia la compra de una residencia principal calificable cuando se combina con financiamiento elegible.",
        "¿Cuánta asistencia puede estar disponible? El programa ofrece dos opciones de subvención: 2% o 3.5% del precio de compra, sujeto a elegibilidad y requisitos del programa aplicables.",
        "¿La subvención debe reembolsarse? Las pautas del programa indican que no se requiere reembolso.",
        "¿DPA Advantage crea una segunda hipoteca o gravamen? Las pautas del programa indican que no se requiere un segundo gravamen sobre la propiedad para la subvención.",
        "Las combinaciones de programas elegibles pueden incluir FHA 203(b), FHA Repair Escrow y FHA 203(k) Limitado o Estándar, sujeto a las pautas aplicables y requisitos de la transacción.",
      ],
      whoTypically: [
        "Compradores primerizos elegibles",
        "Ciertos primeros respondedores calificables",
        "Ciertos educadores",
        "Cierto personal médico",
        "Ciertos servidores públicos",
        "Cierto personal militar",
        "Prestatarios que pueden calificar bajo criterios de ingresos aplicables",
        "Propiedades elegibles ubicadas en tractos censales desatendidos calificables",
        "Otros compradores elegibles que cumplan los requisitos del programa aplicables",
      ],
      keyRequirements: [
        "La vivienda generalmente debe ser una residencia principal elegible.",
        "La elegibilidad del prestatario y la propiedad debe cumplir los requisitos FHA y DPA Advantage aplicables.",
        "Se requiere orientación para propietarios o educación para compradores aprobada.",
        "El programa debe combinarse con una estructura de financiamiento elegible.",
        "Aplican requisitos de tipo de propiedad y combinación de programas.",
      ],
      whyClientsChoose: [
        "Puede reducir los fondos personales necesarios para la cuota inicial",
        "La asistencia en subvención no requiere reembolso",
        "No se requiere segundo gravamen para la subvención",
        "Múltiples vías potenciales de elegibilidad para prestatarios",
        "Puede complementar ciertas estrategias FHA elegibles y de renovación",
        "IHL revisa el financiamiento y la asistencia juntos en lugar de tratarlos como decisiones separadas",
      ],
      whatToKeepInMind: [
        "DPA Advantage está sujeto a requisitos de elegibilidad del prestatario, la propiedad, FHA, el prestamista y el programa.",
        "No toda transacción o programa FHA puede combinarse con DPA Advantage.",
        "La educación o orientación para compradores es requerida bajo el programa.",
        "Pueden aplicar requisitos de ingresos, crédito, ocupación, propiedad, geografía y financiamiento.",
        "La disponibilidad del programa y las pautas pueden cambiar.",
        "Infinite Home Lending revisará los requisitos actuales para el escenario específico del prestatario.",
      ],
    },
    relatedProgramIds: ["fha", "fha-repair-escrow", "fha-203k-limited"],
  },
  {
    id: "asset-depletion",
    category: "purchase",
    tags: ["Calificación Alternativa"],
    title: "Hipoteca con Calificación por Activos",
    shortDescription:
      "Explore la calificación hipotecaria usando ciertos activos elegibles cuando los ingresos tradicionales de empleo pueden no contar toda su historia financiera.",
    cardHook:
      "Explore la calificación hipotecaria usando ciertos activos elegibles cuando los ingresos tradicionales de empleo pueden no contar toda su historia financiera.",
    highlightLine:
      "Los activos calificables pueden **convertirse en un ingreso mensual calculado** según las pautas del programa aplicable",
    highlights: [
      "Calificación centrada en activos",
      "Residencias principales y segundas viviendas",
      "Compra o refinanciamiento elegible de tasa y plazo",
    ],
    expanded: {
      fullDescription:
        "La calificación por activos puede ayudar a ciertos prestatarios elegibles a convertir activos que cumplen con los requisitos en un ingreso mensual calculado para fines hipotecarios. Puede ofrecer una alternativa para jubilados, trabajadores independientes, prestatarios con un patrimonio considerable y otras personas cuya solidez financiera se refleja mejor en sus activos que en un ingreso laboral tradicional. Los activos elegibles, la documentación, los cálculos, los requisitos de la propiedad y la disponibilidad del financiamiento están sujetos a las normas aplicables del programa y del prestamista.",
      whoFor: [
        "Jubilados",
        "Prestatarios con Patrimonio",
        "Trabajadores Independientes",
        "Inversionistas",
        "Activos Líquidos",
        "Calificación Alternativa",
      ],
      benefits: [
        "LA CALIFICACIÓN PUEDE CENTRARSE EN ACTIVOS ELEGIBLES — Ciertos activos calificables pueden usarse para calcular un ingreso mensual con fines de calificación hipotecaria.",
        "EL EMPLEO TRADICIONAL PUEDE NO SER EL ENFOQUE — Los prestatarios elegibles pueden calificar sin depender principalmente de salario o documentación tradicional de ingresos laborales.",
        "DISEÑADO PARA PERFILES FINANCIEROS CON ACTIVOS SÓLIDOS — El programa puede encajar con prestatarios cuyo balance es más fuerte que sus ingresos documentados tradicionalmente.",
        "OPCIONES DE COMPRA O REFINANCIAMIENTO ELEGIBLE — El financiamiento con calificación por activos puede apoyar estrategias de compra de residencia principal o segunda vivienda y refinanciamiento de tasa y plazo.",
      ],
      howItWorks: [
        "REVISE SU PERFIL FINANCIERO — Conversamos sobre sus metas de propiedad, activos disponibles, estructura de ingresos y necesidades generales de financiamiento.",
        "IDENTIFIQUE ACTIVOS POTENCIALMENTE ELEGIBLES — Se revisan cuentas corrientes, de ahorro, de inversión o de jubilación aplicables según las pautas del programa.",
        "CALCULE LOS INGRESOS CALIFICABLES — Los valores de activos elegibles se evalúan y convierten en un ingreso mensual calculado usando la metodología del programa aplicable.",
        "ESTRUCTURE EL FINANCIAMIENTO — Comparamos opciones de compra o refinanciamiento elegibles según el prestatario, la propiedad, los activos y los requisitos del programa.",
        "AVANCE CON ORIENTACIÓN — Infinite Home Lending ayuda a coordinar la documentación, la suscripción y el proceso del préstamo desde la solicitud hasta el cierre.",
      ],
      reassurance:
        "Sus documentos de ingresos pueden no reflejar toda su fortaleza financiera. Exploremos si la calificación por activos puede alinearse con sus activos, metas de propiedad y necesidades generales de financiamiento.",
      primaryCta: { label: "Hablemos", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "Sus activos también cuentan su historia financiera.",
      intro:
        "La calificación por activos puede ayudar a ciertos prestatarios elegibles a convertir activos que cumplen con los requisitos en un ingreso mensual calculado para fines hipotecarios. Puede ofrecer una alternativa para jubilados, trabajadores independientes, prestatarios con un patrimonio considerable y otras personas cuya solidez financiera se refleja mejor en sus activos que en un ingreso laboral tradicional. Los activos elegibles, la documentación, los cálculos, los requisitos de la propiedad y la disponibilidad del financiamiento están sujetos a las normas aplicables del programa y del prestamista.",
      whenMakesSenseBullets: [
        "TIENE ACTIVOS ELEGIBLES SUSTANCIALES — Su perfil financiero puede incluir ahorros, inversiones o activos de jubilación significativos que potencialmente apoyen la calificación.",
        "LOS INGRESOS TRADICIONALES NO CUENTAN TODA LA HISTORIA — Puede tener recursos financieros sólidos aunque el salario, los ingresos de empleo o las declaraciones de impuestos no reflejen su capacidad general para calificar.",
        "ESTÁ JUBILADO O CERCA DE LA JUBILACIÓN — Los prestatarios elegibles que dependen de ahorros o inversiones en lugar de ingresos regulares de empleo pueden beneficiarse de una revisión centrada en activos.",
        "BUSCA UNA VÍA DE CALIFICACIÓN ALTERNATIVA — Un ingreso mensual calculado puede derivarse de activos elegibles según las pautas del programa aplicable.",
      ],
      atAGlance: {
        bestFor:
          "Prestatarios elegibles con activos calificables sustanciales cuyos ingresos tradicionales de empleo o documentados pueden no representar plenamente su fortaleza financiera",
        keyAdvantage:
          "Ciertos activos elegibles pueden convertirse en ingresos mensuales calificables calculados según las pautas del programa aplicable",
      },
      overviewParagraphs: [
        "¿Qué es una Hipoteca con Calificación por Activos? Es un enfoque de calificación alternativa que puede permitir a prestatarios elegibles usar activos calificables para generar un ingreso mensual calculado para fines de suscripción hipotecaria. En lugar de depender principalmente de salario, sueldos o ingresos tradicionales de empleo, el programa evalúa activos elegibles bajo un método de cálculo aplicable. Esto no significa necesariamente que el prestatario deba gastar o liquidar esos activos. Los activos se revisan como parte del análisis de calificación, sujeto a los requisitos del programa aplicable.",
        "¿Quién puede considerar la calificación por activos? Este enfoque puede ser relevante para jubilados que viven de ahorros o inversiones, prestatarios con patrimonio considerable, trabajadores independientes con ingresos variables, prestatarios con activos líquidos calificables sustanciales y prestatarios cuyos ingresos documentados tradicionalmente no reflejan su posición financiera completa. También puede aplicarse a prestatarios elegibles que compran una residencia principal o segunda vivienda, o consideran un refinanciamiento elegible de tasa y plazo. Pertenecer a uno de estos grupos no garantiza la elegibilidad.",
        "¿Cómo se calculan los ingresos calificables? Los valores de activos elegibles se revisan bajo las reglas del programa aplicable y pueden dividirse durante un período definido para producir un ingreso mensual calificable calculado. Bajo las pautas del programa proporcionadas, los activos elegibles se evalúan usando un cálculo de depleción definido que puede dividir los valores de activos aplicables durante 84 meses. El tratamiento exacto depende del tipo de activo y los requisitos actuales del programa. No todos los prestamistas ni todos los programas de calificación por activos usan el mismo cálculo.",
        "¿Qué tipos de activos pueden considerarse? Los activos potencialmente elegibles pueden incluir ciertas cuentas de depósito, inversión y jubilación, como cuentas corrientes, de ahorro, certificados de depósito, cuentas de mercado monetario, acciones negociadas públicamente, bonos, fondos mutuos y ciertas cuentas de jubilación. El monto reconocido para calificación puede variar según el tipo de activo, la titularidad, la accesibilidad y las reglas del programa. Algunas cuentas de depósito pueden reconocerse de manera diferente a ciertos activos de inversión negociados públicamente, y los activos de jubilación pueden recibir un tratamiento distinto. Estas son mecánicas de suscripción específicas del prestamista—no reglas universales.",
        "¿Debo liquidar mis activos? No necesariamente. La calificación por activos generalmente usa activos elegibles para calcular un ingreso mensual calificable. Si algún fondo debe usarse para cuota inicial, costos de cierre, reservas u otro requisito de la transacción depende del prestatario, la propiedad y las pautas del programa aplicable.",
        "¿Se requiere empleo o ingresos tradicionales? Los ingresos tradicionales de empleo pueden no ser requeridos bajo un programa elegible de calificación por activos. Sin embargo, el perfil financiero completo del prestatario, sus obligaciones, activos, propiedad y transacción aún requieren revisión de suscripción.",
        "¿Qué transacciones pueden ser elegibles? El financiamiento con calificación por activos puede estar disponible para compras elegibles de residencia principal o segunda vivienda y ciertos refinanciamientos de tasa y plazo. La disponibilidad de refinanciamiento con retiro de efectivo no se representa en esta página.",
        "¿Qué tipos de propiedad pueden considerarse? Los tipos de propiedad elegibles pueden incluir ciertas viviendas unifamiliares, townhomes, PUDs y condominios usados como residencia principal o segunda vivienda, sujeto a las pautas aplicables.",
        "¿Qué documentación de activos se necesita? Los prestatarios deben esperar proporcionar estados de cuenta y documentación que establezcan la titularidad, el valor, la accesibilidad y el origen de los activos potencialmente calificables. Los activos pueden necesitar documentarse y mantenerse durante un período aplicable bajo los requisitos actuales del programa.",
      ],
      whoTypically: [
        "Jubilados",
        "Prestatarios con patrimonio considerable",
        "Trabajadores independientes",
        "Personas que viven de ahorros o inversiones",
        "Prestatarios con activos líquidos sustanciales",
        "Compradores de residencia principal",
        "Compradores de segunda vivienda",
        "Prestatarios elegibles para refinanciamiento de tasa y plazo",
      ],
      keyRequirements: [
        "Aplican requisitos de elegibilidad del prestatario",
        "Los activos deben cumplir estándares aplicables de titularidad y documentación",
        "Solo los activos elegibles pueden usarse en el cálculo",
        "Los valores de cuenta pueden ajustarse según el tipo de activo",
        "Los fondos necesarios para cierre, cuota inicial y reservas pueden tratarse por separado",
        "Pueden aplicar requisitos de activos restantes",
        "Pueden aplicar restricciones de residencia principal o segunda vivienda",
        "Aplican requisitos de compra elegible o refinanciamiento de tasa y plazo",
        "Aplican requisitos de propiedad y tasación",
        "La elegibilidad final depende del prestatario, la propiedad, los activos y la estructura del préstamo",
      ],
      whyClientsChoose: [
        "Sus activos pueden representar su fortaleza financiera con mayor precisión que los ingresos tradicionales",
        "Puede ofrecer una alternativa a la calificación centrada en el empleo",
        "Puede ser útil para jubilados o prestatarios con inversiones significativas",
        "Pueden estar disponibles opciones elegibles de compra y refinanciamiento de tasa y plazo",
        "Ofrece una revisión estructurada en lugar de asumir que los ingresos tradicionales son la única vía",
        "Infinite Home Lending puede comparar la estrategia con otras opciones de calificación alternativa",
      ],
      whatToKeepInMind: [
        "No todos los activos son elegibles",
        "Diferentes tipos de activos pueden recibir valores calificables distintos",
        "Los fondos necesarios para cuota inicial, costos de cierre o reservas pueden no estar disponibles para el cálculo de ingresos",
        "Pueden aplicar requisitos mínimos de activos restantes",
        "Pueden aplicar restricciones de ocupación de la propiedad",
        "El refinanciamiento con retiro de efectivo puede no estar disponible bajo el programa proporcionado",
        "La titularidad, accesibilidad, origen y documentación de los activos deben verificarse",
        "Los términos y requisitos varían según el prestamista y el programa",
        "La aprobación no se basa únicamente en el patrimonio neto total",
        "El perfil completo del prestatario y la propiedad debe revisarse",
      ],
    },
    relatedProgramIds: ["bank-statement", "non-qm", "1099-income", "pl-loan", "foreign-national"],
  },
  {
    id: "pl-loan",
    category: "purchase",
    tags: ["Trabajadores Independientes"],
    title: "Préstamo con Estado de Pérdidas y Ganancias",
    shortDescription:
      "Explore la calificación hipotecaria usando un Estado de Pérdidas y Ganancias aceptable cuando los ingresos de declaraciones de impuestos tradicionales pueden no reflejar el desempeño actual del negocio.",
    cardHook:
      "Explore la calificación hipotecaria usando un Estado de Pérdidas y Ganancias aceptable cuando los ingresos de declaraciones de impuestos tradicionales pueden no reflejar el desempeño actual del negocio.",
    highlightLine:
      "Los ingresos comerciales actuales pueden evaluarse mediante un **Estado de Pérdidas y Ganancias preparado profesionalmente**, según las pautas del programa aplicable",
    highlights: [
      "Diseñado para trabajadores por cuenta propia",
      "Pueden estar disponibles opciones de P&L de uno o dos años",
      "Estrategias de compra y refinanciamiento elegibles",
    ],
    expanded: {
      fullDescription:
        "Un préstamo con Estado de Pérdidas y Ganancias puede ayudar a ciertos prestatarios que trabajan por cuenta propia a calificar utilizando un estado financiero aceptable, en lugar de depender principalmente de declaraciones de impuestos tradicionales. Esta alternativa puede ser útil para propietarios de negocios, consultores, profesionales independientes y otros prestatarios cuyo desempeño comercial actual no se refleja completamente en la documentación tradicional de ingresos. La elegibilidad final depende del prestatario, el historial del negocio, la documentación de respaldo, la propiedad y los requisitos aplicables del programa.",
      whoFor: [
        "Trabajadores Independientes",
        "Dueños de Negocios",
        "Consultores",
        "Profesionales Independientes",
        "Negocios Establecidos",
        "Documentación Alternativa",
      ],
      benefits: [
        "USE UN ESTADO DE PÉRDIDAS Y GANANCIAS PROFESIONAL — Un estado financiero aceptable puede ayudar a documentar los ingresos del negocio.",
        "EL DESEMPEÑO ACTUAL DEL NEGOCIO PUEDE SER CONSIDERADO — La evaluación puede enfocarse en resultados operativos recientes en lugar de depender exclusivamente de ingresos históricos declarados.",
        "PUEDEN EXISTIR VARIAS OPCIONES DE TRANSACCIÓN — Se pueden considerar compras, refinanciamientos de tasa y plazo, refinanciamientos con retiro de efectivo y financiamiento diferido, según elegibilidad.",
        "PUEDEN CONSIDERARSE VARIOS TIPOS DE OCUPACIÓN — Ciertas residencias principales, segundas viviendas y propiedades de inversión pueden ser elegibles.",
      ],
      howItWorks: [
        "REVISE SU NEGOCIO Y SUS OBJETIVOS DE FINANCIAMIENTO — Conversamos sobre el historial de su negocio, su estructura de ingresos, sus planes de propiedad y sus objetivos de financiamiento.",
        "REÚNA LA DOCUMENTACIÓN P&L — Se revisa un Estado de Pérdidas y Ganancias aceptable preparado por un profesional calificado, junto con la documentación de respaldo aplicable.",
        "EVALÚE LOS INGRESOS DEL NEGOCIO — El prestamista revisa el P&L, el historial del negocio, la estructura de gastos, los estados de cuenta de respaldo y otra documentación requerida.",
        "COMPARE LAS OPCIONES DISPONIBLES — Evaluamos estructuras elegibles de compra o refinanciamiento según el prestatario, el negocio, la propiedad y los requisitos del programa.",
        "AVANCE CON ORIENTACIÓN — Infinite Home Lending ayuda a coordinar la solicitud, la documentación, la suscripción y el proceso de cierre.",
      ],
      reassurance:
        "Su negocio puede estar rindiendo bien aunque sus documentos fiscales tradicionales no lo reflejen por completo. Exploremos si un préstamo P&L se alinea con cómo gana y lo que desea lograr.",
      primaryCta: { label: "Hablemos", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "¿Trabaja por cuenta propia? El desempeño de su negocio puede ayudarle a calificar.",
      intro:
        "Un préstamo con Estado de Pérdidas y Ganancias puede ayudar a ciertos prestatarios que trabajan por cuenta propia a calificar utilizando un estado financiero aceptable, en lugar de depender principalmente de declaraciones de impuestos tradicionales. Esta alternativa puede ser útil para propietarios de negocios, consultores, profesionales independientes y otros prestatarios cuyo desempeño comercial actual no se refleja completamente en la documentación tradicional de ingresos. La elegibilidad final depende del prestatario, el historial del negocio, la documentación de respaldo, la propiedad y los requisitos aplicables del programa.",
      whenMakesSenseBullets: [
        "TRABAJA POR CUENTA PROPIA — Es propietario o opera un negocio establecido y recibe ingresos fuera de una estructura tradicional de empleo W-2.",
        "EL DESEMPEÑO ACTUAL DE SU NEGOCIO IMPORTA — Un Estado de Pérdidas y Ganancias preparado profesionalmente puede ayudar a documentar los ingresos del negocio usados para la calificación.",
        "SUS DECLARACIONES DE IMPUESTOS PUEDEN NO CONTAR TODA LA HISTORIA — El desempeño comercial reciente puede diferir de los ingresos reflejados en declaraciones de impuestos de años anteriores.",
        "BUSCA UNA VÍA DE DOCUMENTACIÓN ALTERNATIVA — Los prestatarios elegibles pueden calificar usando un estado P&L con la documentación de respaldo aplicable.",
      ],
      atAGlance: {
        bestFor:
          "Trabajadores por cuenta propia establecidos cuyos ingresos calificables pueden respaldarse mediante un Estado de Pérdidas y Ganancias aceptable",
        keyAdvantage:
          "El desempeño comercial actual puede considerarse mediante documentación alternativa en lugar de depender exclusivamente de ingresos de declaraciones de impuestos tradicionales",
      },
      overviewParagraphs: [
        "¿Qué es un préstamo con Estado de Pérdidas y Ganancias? Es un programa hipotecario con documentación alternativa diseñado para ciertos prestatarios elegibles que trabajan por cuenta propia. En lugar de depender principalmente de ingresos de declaraciones de impuestos tradicionales, el programa puede usar un Estado de Pérdidas y Ganancias aceptable para ayudar a determinar los ingresos calificables del negocio. El P&L debe cumplir los estándares del programa aplicable y puede necesitar prepararse o validarse por un profesional calificado. También pueden requerirse estados de cuenta bancarios, documentación comercial u otros registros según la transacción y el programa.",
        "¿Quién puede considerar un préstamo P&L? Este enfoque puede ser relevante para trabajadores por cuenta propia, propietarios de negocios establecidos, consultores, profesionales independientes, propietarios únicos, socios o dueños de negocios elegibles, y prestatarios cuyo desempeño comercial reciente puede diferir de ingresos de declaraciones de impuestos anteriores. También puede aplicarse a prestatarios que buscan una compra o refinanciamiento elegible, o consideran una residencia principal, segunda vivienda o propiedad de inversión. Trabajar por cuenta propia por sí solo no garantiza la elegibilidad.",
        "¿Cómo se documentan los ingresos? Los ingresos calificables pueden evaluarse usando un Estado de Pérdidas y Ganancias aceptable que cubra el período de revisión requerido. Los prestatarios elegibles pueden usar un P&L de uno o dos años, sujeto a los requisitos aplicables de documentación y suscripción. El P&L puede necesitar prepararse por un CPA, preparador de impuestos u otro profesional calificado. Pueden requerirse estados de cuenta bancarios de respaldo o documentación adicional según la estructura de la transacción y las pautas aplicables. Una hoja de cálculo preparada por el prestatario por sí sola generalmente no es suficiente.",
        "¿Se requieren estados de cuenta bancarios? Pueden serlo. Algunos programas P&L pueden permitir la calificación usando el P&L con estados de cuenta bancarios de respaldo limitados, mientras que otras estructuras pueden requerir estados de cuenta o documentación adicional. La cantidad y el tipo de documentación de respaldo dependen del prestatario, la transacción, el perfil del negocio y las pautas actuales del programa.",
        "¿En qué se diferencia de un préstamo con estados de cuenta bancarios? Un préstamo P&L generalmente evalúa ingresos usando un Estado de Pérdidas y Ganancias preparado profesionalmente. Un préstamo con estados de cuenta bancarios generalmente evalúa depósitos calificables mostrados en estados de cuenta personales o comerciales y puede aplicar un factor de gastos. Ambos son estrategias de documentación alternativa, pero dependen de evidencia diferente para evaluar ingresos.",
        "¿En qué se diferencia de un préstamo con ingresos 1099? Un préstamo con ingresos 1099 generalmente evalúa ganancias documentadas de contratista reportadas en uno o más formularios 1099. Un préstamo P&L evalúa el desempeño del negocio usando un Estado de Pérdidas y Ganancias aceptable. La vía apropiada depende de cómo gana el prestatario y qué documentos respaldan mejor el perfil financiero.",
        "¿Qué transacciones pueden ser elegibles? Pueden considerarse transacciones elegibles de compra, refinanciamiento de tasa y plazo, refinanciamiento con retiro de efectivo y financiamiento diferido, sujeto a los requisitos actuales del programa.",
        "¿Qué tipos de propiedad pueden considerarse? Pueden considerarse residencias principales, segundas viviendas y propiedades de inversión elegibles, sujeto a los requisitos de propiedad y del programa.",
        "¿Quién prepara el P&L? El Estado de Pérdidas y Ganancias puede necesitar prepararse o validarse por un CPA calificado, preparador de impuestos, contador u otro profesional aceptable, según las pautas del programa aplicable. El prestatario debe esperar que el prestamista revise al preparador, el período de reporte, la información del negocio, los ingresos, los gastos y la documentación de respaldo.",
        "¿Deben proporcionarse declaraciones de impuestos? Las declaraciones de impuestos tradicionales pueden no ser el documento principal de ingresos bajo un programa P&L elegible. Sin embargo, el prestamista aún puede requerir otra documentación comercial, de activos, de crédito o de la transacción. Los requisitos finales de documentación dependen del prestatario y del programa.",
      ],
      whoTypically: [
        "Trabajadores por cuenta propia",
        "Dueños de negocios",
        "Consultores",
        "Profesionales independientes",
        "Propietarios únicos",
        "Socios elegibles",
        "Prestatarios con historial operativo establecido",
        "Prestatarios cuyos ingresos comerciales actuales pueden no reflejarse plenamente en declaraciones de impuestos anteriores",
        "Compradores de residencia principal",
        "Compradores de segunda vivienda",
        "Inversionistas inmobiliarios",
        "Prestatarios elegibles para refinanciamiento",
      ],
      keyRequirements: [
        "El prestatario debe cumplir los requisitos aplicables de trabajo por cuenta propia",
        "El negocio debe tener un historial operativo aceptable",
        "El P&L debe cubrir el período de revisión requerido",
        "El P&L debe cumplir los estándares aplicables de preparación y validación",
        "Pueden requerirse estados de cuenta bancarios de respaldo",
        "La titularidad del negocio y los ingresos deben documentarse",
        "El prestamista debe revisar la estructura de gastos y la estabilidad del negocio",
        "Aplican requisitos de propiedad y transacción",
        "El crédito, los activos, las obligaciones y las reservas siguen sujetos a revisión de suscripción",
        "La elegibilidad final depende del perfil completo del prestatario y la propiedad",
      ],
      whyClientsChoose: [
        "Su desempeño comercial actual puede ser más sólido de lo que sugieren ingresos de declaraciones de impuestos anteriores",
        "Sus ingresos provienen de un negocio en lugar de empleo tradicional W-2",
        "Un estado financiero preparado profesionalmente puede explicar mejor el negocio",
        "Pueden estar disponibles múltiples tipos de transacción",
        "Pueden considerarse residencias principales, segundas viviendas y propiedades de inversión",
        "El programa ofrece una alternativa al análisis de ingresos basado únicamente en depósitos",
        "Infinite Home Lending puede comparar opciones P&L, estados de cuenta, 1099 y otras vías de documentación alternativa",
      ],
      whatToKeepInMind: [
        "El P&L debe cumplir los estándares actuales del programa",
        "No todo P&L preparado por el prestatario será aceptado",
        "Pueden requerirse estados de cuenta bancarios de respaldo",
        "La estabilidad del negocio y el historial operativo importan",
        "Los gastos y el ingreso neto serán revisados",
        "Puede requerirse documentación comercial adicional",
        "Los términos y la documentación varían según el prestamista y el programa",
        "Las tasas y precios pueden diferir del financiamiento tradicional de agencias",
        "Las reglas para propiedades de inversión pueden diferir de las de ocupación por el propietario",
        "La aprobación se basa en el perfil completo del prestatario, negocio, propiedad y transacción",
        "Un P&L no garantiza la aprobación",
      ],
    },
    relatedProgramIds: ["bank-statement", "1099-income", "non-qm", "asset-depletion"],
  },
  {
    id: "fha-repair-escrow",
    category: "purchase",
    tags: ["Propiedades HUD"],
    title: "FHA con Escrow para Reparaciones",
    shortDescription:
      "Compre ciertas viviendas HUD elegibles que necesitan reparaciones limitadas y complete el trabajo aprobado después del cierre mediante un escrow de reparaciones.",
    cardHook:
      "Compre ciertas viviendas de propiedad de HUD que necesitan reparaciones limitadas—y complete el trabajo aprobado después del cierre con fondos en escrow.",
    highlightLine:
      "Las reparaciones aprobadas pueden **completarse después del cierre** usando fondos en **escrow**, sujeto a los requisitos de HUD y FHA",
    highlights: [
      "Diseñado para ciertas viviendas de propiedad de HUD",
      "Las reparaciones limitadas pueden financiarse mediante escrow",
      "Solo financiamiento de compra",
    ],
    expanded: {
      fullDescription:
        "FHA Repair Escrow puede permitir que compradores elegibles adquieran ciertas propiedades de HUD que necesitan reparaciones limitadas antes de cumplir completamente con los requisitos de propiedad de FHA. En lugar de exigir que todas las reparaciones elegibles se completen antes del cierre, los fondos aprobados pueden mantenerse en una cuenta escrow para que el trabajo se complete después de la compra. El programa está diseñado para reparaciones limitadas y está sujeto a los requisitos aplicables de HUD, FHA, la propiedad, el prestamista y el programa.",
      whoFor: [
        "Propiedades HUD",
        "Compradores FHA",
        "Reparaciones Limitadas",
        "Ocupantes Propietarios",
        "Financiamiento de Compra",
      ],
      benefits: [
        "Compre una vivienda elegible que necesita reparaciones — Ciertas viviendas de propiedad de HUD pueden calificar para financiamiento FHA cuando las reparaciones requeridas pueden manejarse mediante un escrow de reparaciones aprobado.",
        "Complete reparaciones aprobadas después del cierre — Los fondos elegibles de reparación pueden mantenerse en escrow para que el trabajo necesario se complete después del cierre de la compra.",
        "Financiamiento de reparaciones limitadas integrado en la transacción — El programa puede ofrecer una vía más simple para viviendas que requieren reparaciones modestas en lugar de una estructura completa de financiamiento de renovación.",
        "Puede funcionar con ciertas estrategias de compra FHA — Según las pautas aplicables, FHA Repair Escrow puede usarse con ciertos programas de compra FHA elegibles.",
      ],
      howItWorks: [
        "Encuentre una propiedad HUD elegible — Revisamos la propiedad, la oportunidad de compra y la estructura de financiamiento FHA disponible.",
        "Identifique las reparaciones requeridas — La propiedad se evalúa para determinar qué reparaciones son necesarias para cumplir los requisitos aplicables de propiedad HUD/FHA.",
        "Establezca el escrow de reparaciones — Los fondos aprobados de reparación se incluyen en la transacción y se depositan en una cuenta escrow para trabajo elegible.",
        "Cierre y complete las reparaciones — Después del cierre, las reparaciones aprobadas se completan dentro del plazo requerido por el programa.",
        "Finalice el proceso de reparación — Se completan las inspecciones requeridas y los fondos del escrow se liberan según los requisitos del prestamista y del programa.",
      ],
      reassurance:
        "Una vivienda que necesita reparaciones no tiene que quedar fuera de alcance. Revisemos si FHA Repair Escrow puede ajustarse a la propiedad y sus metas de compra.",
      primaryCta: { label: "Hablemos", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "Una vivienda que necesita reparaciones todavía puede estar a su alcance.",
      intro:
        "FHA Repair Escrow puede permitir que compradores elegibles adquieran ciertas propiedades de HUD que necesitan reparaciones limitadas antes de cumplir completamente con los requisitos de propiedad de FHA. En lugar de exigir que todas las reparaciones elegibles se completen antes del cierre, los fondos aprobados pueden mantenerse en una cuenta escrow para que el trabajo se complete después de la compra. El programa está diseñado para reparaciones limitadas y está sujeto a los requisitos aplicables de HUD, FHA, la propiedad, el prestamista y el programa.",
      whenMakesSenseBullets: [
        "Está comprando una vivienda HUD elegible — El programa está diseñado para ciertas propiedades Real Estate Owned de HUD ofrecidas con financiamiento asegurado por FHA.",
        "La vivienda necesita reparaciones limitadas — La propiedad puede no cumplir completamente los requisitos mínimos de propiedad de FHA en su condición actual, pero puede volverse aceptable después de reparaciones elegibles.",
        "Quiere cerrar antes de que terminen las reparaciones — Los fondos elegibles de reparación pueden depositarse en escrow para que el trabajo aprobado se complete después del cierre.",
        "Las reparaciones son de alcance limitado — El programa permite reparaciones calificables de hasta $10,000, sujeto a los requisitos de HUD y del prestamista.",
      ],
      atAGlance: {
        bestFor:
          "Compradores elegibles que adquieren ciertas propiedades de propiedad de HUD que requieren reparaciones limitadas para cumplir los requisitos aplicables de propiedad FHA",
        keyAdvantage:
          "Las reparaciones aprobadas pueden completarse después del cierre usando fondos en escrow en lugar de exigir que todo el trabajo calificable termine antes de la compra",
      },
      overviewParagraphs: [
        "¿Qué es FHA Repair Escrow? Es una característica de financiamiento que puede permitir a un comprador elegible adquirir ciertas propiedades de propiedad de HUD que requieren reparaciones limitadas antes de satisfacer plenamente los requisitos mínimos de propiedad de FHA. Los fondos aprobados para reparaciones calificables se depositan en una cuenta escrow y el trabajo se completa después del cierre.",
        "¿Para qué tipo de propiedad está diseñado? El programa se aplica específicamente a ciertas propiedades Real Estate Owned (REO) de HUD que pueden considerarse asegurables con escrow de reparaciones. No está destinado como un programa general de reparaciones para toda propiedad.",
        "¿Cuánto trabajo de reparación puede incluirse? El programa permite reparaciones de hasta $10,000. El monto final aprobado del escrow también puede reflejar el costo necesario para cumplir los requisitos aplicables de HUD más la contingencia requerida por el programa. No todo escenario de reparación hasta ese límite califica automáticamente.",
        "¿Cuánto tiempo hay para completar las reparaciones? Las reparaciones deben completarse dentro de los 90 días posteriores al cierre, sujeto a las reglas aplicables del prestamista y del programa. Aplican requisitos de finalización, inspección y liberación de fondos antes de que los fondos del escrow se liberen por completo.",
        "¿Puede combinarse con otros programas FHA? FHA Repair Escrow puede combinarse con ciertos programas de compra FHA elegibles, como FHA $100 Down, Good Neighbor Next Door (GNND) o ciertas estructuras 203(k), sujeto a las pautas aplicables.",
      ],
      whoTypically: [
        "Compradores de viviendas de propiedad de HUD elegibles",
        "Prestatarios FHA",
        "Compradores ocupantes propietarios",
        "Propiedades que requieren reparaciones limitadas",
        "Compradores que desean completar reparaciones elegibles después del cierre",
        "Compradores que consideran oportunidades de compra HUD calificables",
      ],
      keyRequirements: [
        "Solo transacciones de compra",
        "La propiedad debe ser una vivienda de propiedad de HUD elegible",
        "Las reparaciones deben estar dentro de los límites aplicables del programa",
        "La propiedad debe cumplir los requisitos aplicables de HUD/FHA después de las reparaciones",
        "Los fondos de reparación se mantienen en escrow",
        "Las reparaciones requeridas deben completarse dentro del plazo del programa",
        "Se requieren inspecciones antes de liberar completamente los fondos del escrow",
        "Aplican requisitos de ocupación, tipo de propiedad, prestatario y elegibilidad FHA",
      ],
      whyClientsChoose: [
        "Abre la puerta a ciertas propiedades HUD que necesitan reparaciones limitadas",
        "Puede evitar exigir que todas las reparaciones elegibles se completen antes del cierre",
        "Los fondos de reparación se coordinan dentro de la transacción de compra FHA",
        "Útil cuando la propiedad necesita renovación modesta en lugar de extensa",
        "Puede funcionar junto con ciertas estrategias de compra FHA calificables",
        "IHL ayuda a coordinar el financiamiento, los requisitos de la propiedad y el proceso de reparación",
      ],
      whatToKeepInMind: [
        "FHA Repair Escrow aplica solo a propiedades y escenarios de reparación elegibles",
        "No sustituye un préstamo de renovación completa cuando las reparaciones son más extensas",
        "Aplican límites de reparación y requisitos de escrow",
        "Las reparaciones deben completarse dentro del plazo requerido",
        "Se requieren inspecciones de la propiedad y aprobación del prestamista",
        "Aplican requisitos de FHA, HUD, prestamista y propiedad",
        "Pueden aplicar restricciones por compras previas de propiedades HUD",
        "La disponibilidad del programa y los requisitos pueden cambiar",
        "Infinite Home Lending revisará los requisitos actuales para la propiedad y transacción específicas del prestatario",
      ],
    },
    relatedProgramIds: ["fha", "dpa-advantage", "fha-203k-limited"],
  },
  {
    id: "fha-203k-limited",
    category: "purchase",
    tags: ["Renovación FHA"],
    title: "FHA 203(k) Renovación Limitada",
    shortDescription:
      "Financie una compra o refinanciamiento elegible junto con renovaciones calificables de menor escala mediante una sola hipoteca FHA.",
    cardHook:
      "Compre o refinancie una vivienda e incluya mejoras calificables de menor escala y no estructurales dentro de la misma primera hipoteca.",
    highlightLine:
      "Una hipoteca puede ayudar a financiar tanto la vivienda como **mejoras elegibles no estructurales**",
    highlights: [
      "Compra o refinanciamiento elegible",
      "Renovaciones de menor escala",
      "Mejoras no estructurales",
    ],
    expanded: {
      fullDescription:
        "FHA 203(k) Renovación Limitada puede ayudar a prestatarios elegibles a comprar o refinanciar una vivienda e incluir ciertos costos de reparaciones, mejoras o renovaciones dentro de la misma primera hipoteca. Está diseñado para proyectos de menor escala que no sean estructurales, ofreciendo una manera práctica de financiar una propiedad que necesita mejoras sin tener que buscar un financiamiento separado después del cierre. La disponibilidad del programa, las mejoras elegibles, los requisitos de la propiedad y el financiamiento están sujetos a las normas aplicables de FHA y del prestamista.",
      whoFor: [
        "Compradores",
        "Propietarios",
        "Renovación",
        "Mejoras no estructurales",
        "Compra",
        "Refinanciamiento",
      ],
      benefits: [
        "Vivienda + mejoras en una hipoteca — Financie una compra o refinanciamiento elegible junto con costos de renovación calificables mediante una sola primera hipoteca.",
        "Diseñado para renovaciones de menor escala — El programa Limitado está destinado a proyectos calificables que no implican trabajo estructural.",
        "Convierta el potencial en posibilidad — Una vivienda que necesita actualizarse aún puede ser la indicada cuando las mejoras elegibles pueden incorporarse a la estrategia de financiamiento.",
        "Un proceso de renovación más coordinado — En lugar de buscar financiamiento separado después del cierre, los costos elegibles de mejoras pueden abordarse como parte de la transacción hipotecaria.",
      ],
      howItWorks: [
        "Explore la propiedad y sus planes — Revisamos la vivienda, sus metas de financiamiento y las mejoras que está considerando.",
        "Identifique mejoras elegibles — El proyecto propuesto se revisa para determinar si el trabajo cumple los requisitos aplicables de FHA 203(k) Limitado.",
        "Construya la estrategia de financiamiento — Los costos elegibles de renovación se incorporan a la estructura hipotecaria junto con la compra o el refinanciamiento.",
        "Cierre el préstamo — Una vez satisfechos los requisitos hipotecarios y de renovación, se cierra la transacción y el proceso de renovación puede avanzar.",
        "Complete el trabajo aprobado — Los fondos de renovación se administran según los requisitos aplicables de FHA y del prestamista a medida que se completa el trabajo aprobado.",
      ],
      reassurance:
        "No necesariamente tiene que encontrar una vivienda completamente renovada. Revisemos si FHA 203(k) Renovación Limitada puede ajustarse a la propiedad, sus planes y sus metas de financiamiento.",
      primaryCta: { label: "Hablemos", to: "/request-a-call" },
    },
    modalDetail: {
      headline: "Compra la casa. Hazla tuya.",
      intro:
        "FHA 203(k) Renovación Limitada puede ayudar a prestatarios elegibles a comprar o refinanciar una vivienda e incluir ciertos costos de reparaciones, mejoras o renovaciones dentro de la misma primera hipoteca. Está diseñado para proyectos de menor escala que no sean estructurales, ofreciendo una manera práctica de financiar una propiedad que necesita mejoras sin tener que buscar un financiamiento separado después del cierre. La disponibilidad del programa, las mejoras elegibles, los requisitos de la propiedad y el financiamiento están sujetos a las normas aplicables de FHA y del prestamista.",
      whenMakesSenseBullets: [
        "Encontró la vivienda indicada — pero necesita trabajo — Una propiedad puede tener la ubicación o el potencial que busca aunque ciertas áreas necesiten actualizarse.",
        "Quiere financiar las mejoras — Los costos elegibles de renovación pueden incluirse con el financiamiento de la vivienda en lugar de requerir una estrategia de financiamiento completamente separada después del cierre.",
        "Su proyecto es de menor alcance — FHA 203(k) Limitado está destinado a mejoras calificables que no son de naturaleza estructural.",
        "Está comprando o refinanciando — El programa puede usarse en transacciones elegibles de compra o refinanciamiento.",
      ],
      atAGlance: {
        bestFor:
          "Compradores o propietarios elegibles que desean financiar mejoras de menor escala y no estructurales como parte de una compra o refinanciamiento",
        keyAdvantage:
          "El financiamiento de la vivienda y los costos elegibles de renovación pueden combinarse en una sola primera hipoteca",
      },
      overviewParagraphs: [
        "¿Qué es FHA 203(k) Renovación Limitada? Es una hipoteca de renovación FHA diseñada para ayudar a prestatarios elegibles a financiar una vivienda junto con reparaciones, mejoras o renovaciones calificables de menor escala. El financiamiento puede usarse en una compra o refinanciamiento elegible y se estructura mediante una sola primera hipoteca.",
        "¿Para qué tipo de renovaciones está diseñado? FHA 203(k) Limitado está destinado a proyectos de menor escala que no son de naturaleza estructural. Es una estrategia de financiamiento de renovación más amplia que FHA Repair Escrow, que aplica a ciertas propiedades elegibles de propiedad de HUD que requieren reparaciones limitadas necesarias para cumplir los requisitos aplicables de la propiedad.",
        "¿Puede usarse para comprar una vivienda? Sí. Los prestatarios elegibles pueden financiar tanto la compra de una vivienda como costos calificables de reparación, mejora o renovación mediante una sola primera hipoteca.",
        "¿Puede usarse para un refinanciamiento? Sí. El programa también está disponible para transacciones elegibles de refinanciamiento. La elegibilidad final depende de la propiedad, la transacción, las mejoras propuestas y los requisitos aplicables de FHA y del prestamista.",
        "¿Cuánto trabajo de renovación puede financiarse? Según las pautas del programa proporcionadas, los costos elegibles de rehabilitación pueden totalizar hasta $75,000, sujetos a los requisitos de FHA, del prestamista, de la propiedad y de la transacción. No se indica un costo mínimo de rehabilitación en las pautas proporcionadas. Este es un límite del programa bajo las pautas actuales — no un monto garantizado disponible para todo prestatario.",
        "¿Se requiere un consultor HUD? FHA 203(k) Limitado generalmente no requiere la estructura de consultor HUD asociada con proyectos de renovación más extensos, sujeto a los requisitos aplicables del programa.",
        "¿Cómo se manejan los fondos de renovación? Los fondos de renovación se administran a través del proceso de renovación del préstamo y se liberan a medida que avanza el trabajo aprobado, sujeto a la documentación, inspección y requisitos aplicables del prestamista.",
        "Los tipos de propiedad elegibles pueden incluir ciertas residencias principales, viviendas manufacturadas, condominios aprobados por FHA, PUD y propiedades de propiedad de HUD, sujetos a los requisitos aplicables de FHA y del programa.",
      ],
      whoTypically: [
        "Compradores que consideran viviendas que necesitan actualizarse",
        "Propietarios que planean mejoras calificables durante un refinanciamiento",
        "Prestatarios que prefieren financiar renovaciones elegibles con la hipoteca",
        "Propiedades que necesitan mejoras de menor escala",
        "Prestatarios cuyo trabajo planificado no es estructural",
        "Compradores que ven potencial en una vivienda que no está lista para mudarse",
      ],
      keyRequirements: [
        "Aplican los requisitos de elegibilidad del prestatario FHA",
        "Aplican los requisitos de elegibilidad de la propiedad",
        "Aplican los requisitos de residencia principal",
        "Las mejoras propuestas deben calificar bajo las pautas de FHA 203(k) Limitado",
        "Los proyectos deben permanecer dentro del alcance aplicable del programa Limitado",
        "Pueden aplicar requisitos de documentación de renovación y contratista",
        "El trabajo y los fondos se administran según los requisitos aplicables de FHA y del prestamista",
        "Las transacciones de compra y refinanciamiento elegibles pueden calificar",
        "La aprobación final depende del prestatario, la propiedad, el proyecto y la estructura de financiamiento",
      ],
      whyClientsChoose: [
        "Financiar la vivienda y las mejoras calificables juntas",
        "Útil cuando una vivienda tiene potencial pero necesita actualizarse",
        "Diseñado específicamente para proyectos de renovación de menor escala",
        "Puede reducir la necesidad de buscar financiamiento de renovación separado después del cierre",
        "Disponible para ciertas compras y refinanciamientos",
        "IHL ayuda a coordinar la estrategia hipotecaria y de financiamiento de renovación",
      ],
      whatToKeepInMind: [
        "FHA 203(k) Limitado está destinado a proyectos no estructurales",
        "Las necesidades de renovación más extensas pueden requerir un programa de renovación diferente",
        "Las mejoras y costos elegibles deben cumplir las pautas aplicables",
        "Pueden aplicar requisitos de contratistas, documentación, inspecciones y control de fondos",
        "Los fondos de renovación no se entregan simplemente al prestatario como efectivo sin restricciones",
        "Aplican requisitos de elegibilidad de la propiedad y de FHA",
        "Este programa es diferente de FHA Repair Escrow, diseñado para ciertas propiedades elegibles de propiedad de HUD que requieren reparaciones limitadas mediante un escrow después de la compra",
        "DPA Advantage puede usarse junto con FHA 203(k) Limitado para prestatarios elegibles, sujeto a los requisitos del programa — no todo prestatario 203(k) califica para asistencia de cuota inicial",
        "Las pautas y disponibilidad del programa pueden cambiar",
        "La elegibilidad final se determina según el prestatario, la propiedad, el proyecto y la transacción específicos",
      ],
    },
    relatedProgramIds: ["fha", "fha-repair-escrow", "dpa-advantage"],
  },
];
