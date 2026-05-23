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
  },
];
