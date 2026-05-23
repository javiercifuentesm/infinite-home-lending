import type { KnowledgeRoute } from "./knowledgeCenterRoutes";

export const KNOWLEDGE_ROUTES_ES: Record<string, KnowledgeRoute> = {
  "start-here": {
    id: "start-here",
    label: "Comenzar Aquí",
    cardDescription:
      "Entrada tranquila — orientación, ritmo y un camino claro hacia el resto del Centro de Conocimiento.",
    heroIntro:
      "Si el mundo hipotecario se siente ruidoso, no está solo. Comience aquí para un mapa simple: qué importa primero, cómo se desarrollan las decisiones y cómo usar lo que viene sin ahogarse en detalles.",
    contextLines: [
      "No necesita todas las respuestas hoy — solo las suficientes para ver dónde está y qué viene después.",
      "Lo orientaremos primero, luego le señalaremos los temas que coincidan con su próxima pregunta real.",
      "Una vez que la secuencia encaje, el resto se siente más liviano — incluyendo las conversaciones por venir.",
      "La mayoría de las personas comienzan exactamente en este lugar — sin saber por dónde empezar. No está atrasado.",
      "Así es como pensar sobre el proceso:",
    ],
    whatMattersMost: [
      "No está atrasado — está al principio. La mayoría del estrés viene de no ver la forma del camino.",
      "Un buen próximo paso se ajusta a su vida y cronograma — no a una lista de verificación universal de internet.",
      "La victoria no es memorizar jerga — es saber lo suficiente para avanzar sin dudar en cada giro.",
    ],
    clarityCards: [
      {
        id: "sh-c1",
        title: "Por qué la orientación viene primero",
        summary:
          "Las hipotecas son una serie de decisiones en orden — no un momento de 'mejor tasa' que tiene que acertar a ciegas.",
        expandLabel: "Explorar esto",
        learnMore:
          "Cuando entiende qué se decide en cada paso, es más fácil enfocarse en lo que importa ahora — sin cargar la incertidumbre de lo que viene después.\n\nAsí está diseñado este espacio: comience con el mapa, luego profundice donde realmente ayuda.",
      },
      {
        id: "sh-c2",
        title: "Claridad antes que presión",
        summary: "Debe entender las compensaciones antes de que algo se sienta como una presión para elegir un producto.",
        expandLabel: "Profundizar",
        learnMore:
          "El asesoramiento significa entender sus opciones en lenguaje claro — alineado con sus metas, no con un guión.\n\nSi algo aún no está claro, esa es su señal para pausar y explorar más — no para apresurarse en una decisión.",
      },
      {
        id: "sh-c3",
        title: "Cómo avanzar por estos temas",
        summary: "Explore lo que ayuda, profundice donde importa y omita lo que no aplica a su etapa.",
        expandLabel: "Ver cómo funciona",
        learnMore:
          "No necesita pasar por todo.\n\nComience con lo que coincide con su situación hoy, y profundice solo donde agrega valor.\n\nSiempre puede volver — este espacio está construido para encontrarle donde sea que esté en el proceso.",
      },
    ],
    howItWorksSteps: [
      {
        id: "sh-s1",
        title: "Llegue como está",
        summary: "Sin requisitos previos — si es nuevo en esto, está en el lugar correcto.",
        learnMore:
          "No necesita lenguaje pulido ni números perfectos para empezar.\n\nEl objetivo es la orientación: un poco de estructura para que el proceso deje de sentirse como un giro ciego cada semana.",
      },
      {
        id: "sh-s2",
        title: "Entienda dónde está realmente hoy",
        summary:
          "Comprando, refinanciando o 'solo entendiendo' — ser honesto sobre hoy establece qué puerta abrir después.",
        learnMore:
          "Este es el momento en que la mayoría de las personas obtienen claridad — o se quedan atascadas.\n\nNo tiene que comprometerse con un camino el primer día — pero nombrar la dirección ayuda.\n\nIncluso un objetivo aproximado mantiene el ruido bajo: sabrá qué temas explorar y cuáles tomarse con calma.",
      },
      {
        id: "sh-s3",
        title: "Vea cómo se desarrollan las decisiones normalmente",
        summary:
          "La secuencia importa: algunas preguntas naturalmente vienen antes que otras — y eso es un alivio, no un obstáculo.",
        learnMore:
          "Las hipotecas no son aleatorias — ingresos, activos, cronograma y estructura se conectan en un ritmo predecible.\n\nVer el orden facilita el ritmo en lugar de intentar resolver todo a la vez.",
      },
      {
        id: "sh-s4",
        title: "Elija el tema que coincida con su próxima pregunta",
        summary: "Use el Centro de Conocimiento como un conjunto de puertas — no como una pared de tareas.",
        learnMore:
          "Entre en lo que se sienta más relevante — números, compra, tipos de préstamo, refinanciamiento o respuestas rápidas.\n\nSi no está seguro, manténgalo liviano: comience con resúmenes, luego expanda solo cuando algo pida más claridad.",
      },
      {
        id: "sh-s5",
        title: "Lleve la claridad a lo que sigue",
        summary: "Ya sea que siga leyendo o hable con alguien, sabrá qué está tratando de aprender.",
        learnMore:
          "La confianza no se trata de saberlo todo — se trata de saber qué pregunta está respondiendo.\n\nCon esa claridad, el resto de este espacio — y cualquier conversación que elija tener — se vuelve mucho más útil.\n\nEl próximo paso es simple: explore las secciones que se alinean con lo que quiere entender después.",
      },
    ],
    faqInitialCount: 4,
    faqAll: [
      {
        q: "¿Necesito leer todo antes de hacer cualquier otra cosa?",
        a: "No. Comience con lo que coincide con su pregunta — la profundidad puede esperar hasta que sea relevante.",
      },
      {
        q: "¿Necesito elegir un tipo de préstamo antes de hablar?",
        a: "No. La mayoría comienza con metas y cronograma; el ajuste del producto sigue una vez que el panorama es más claro.",
      },
      {
        q: "¿Explorar opciones afectará mi crédito?",
        a: "Una conversación estructurada no es una consulta de crédito. Cuando se necesite una revisión formal, se lo diremos primero.",
      },
      {
        q: "¿Esto se sentirá como un discurso de ventas?",
        a: "Estamos construidos alrededor de estrategia y comparación — debería terminar con menos preguntas abiertas, no más presión.",
      },
      {
        q: "¿Cuánto tiempo lleva obtener claridad inicial?",
        a: "A menudo una conversación enfocada — más larga si su situación tiene más partes en movimiento.",
      },
      {
        q: "¿Qué debo traer a una primera llamada?",
        a: "Metas, cronograma y números aproximados ayudan. La documentación completa viene cuando esté listo para profundizar.",
      },
    ],
    realTalk: {
      headline: "Una verdad tranquila",
      points: [
        "La mayoría del agobio no proviene de las matemáticas — proviene de no saber qué pasa después.",
        "No necesita cada acrónimo el primer día; necesita un sentido constante del orden.",
        "Cuando alguien no explica las compensaciones, está vendiendo un producto — no ayudándole a elegir un camino.",
      ],
    },
    contextualCta: {
      line: "¿Listo para explorar qué sigue para usted?",
      subline: "Explore los temas a su ritmo — o hable con nosotros cuando quiera una guía a su lado.",
      buttonLabel: "Hablar con un asesor",
    },
  },
  buying: {
    id: "buying",
    label: "Comprar una Vivienda",
    cardDescription:
      "Pre-aprobación, efectivo para el cierre y ofertas que ganan — el camino de compra sin las conjeturas.",
    heroIntro:
      "Comprar una vivienda puede sentirse abrumador — no porque sea complicado, sino porque a la mayoría de las personas nunca se les muestra cómo funciona realmente. Lo desglosamos paso a paso para que sepa qué importa, qué esperar y cómo decidir con confianza.",
    contextLines: [
      "Comprar una vivienda puede sentirse abrumador — no porque sea complicado, sino porque a la mayoría de las personas nunca se les muestra cómo funciona realmente.",
      "Lo desglosamos paso a paso: qué importa, qué esperar y cómo decidir con confianza.",
    ],
    whatMattersMost: [
      "Comience con sus números — no con la búsqueda de vivienda. Enamorese de un rango de pago antes de enamorarse de un listado.",
      "La pre-aprobación no es papeleo — es apalancamiento. Define lo que puede hacer y si los vendedores lo toman en serio.",
      "El efectivo para el cierre sorprende a más compradores que el pago de la hipoteca. La cuota inicial es solo parte de la historia.",
      "La tasa más baja no es la victoria — la estructura correcta lo es. Un préstamo 'barato' con los términos incorrectos puede costarle más.",
    ],
    clarityCards: [
      {
        id: "b-c1",
        title: "¿Cuánta vivienda puedo pagar?",
        summary: "El número para el que califica no es el número en el que debería vivir.",
        learnMore:
          "Los prestamistas hacen pruebas de estrés con máximos — no con su vida real.\n\nEjemplo: Aprobado para $3,200/mes no significa que $3,200 se siente seguro después de todo lo demás que maneja.\n\nAlineamos ambos para que no compre una casa y ahogue el resto de su presupuesto.",
      },
      {
        id: "b-c2",
        title: "¿Necesito el 20% de cuota inicial?",
        summary: "Esperar el 20% de cuota inicial es uno de los errores más costosos que cometen los compradores.",
        learnMore:
          "Puede comprar con mucho menos:\n\n• 3–5% de cuota inicial (Convencional)\n\n• 3.5% (FHA)\n\n• 0% (VA / USDA)\n\nLa pregunta real no es 'cuánto menos' — es qué estructura lo pone más fuerte a largo plazo.",
      },
      {
        id: "b-c3",
        title: "¿Qué es realmente la pre-aprobación?",
        summary: "No es una carta — es prueba de que puede cerrar.",
        learnMore:
          "Una pre-aprobación seria significa:\n\n• Crédito revisado\n\n• Ingresos validados\n\n• Suscripción iniciada\n\nSin estimaciones pretendiendo ser hechos — y usted negocia desde una posición de fortaleza.",
      },
      {
        id: "b-c4",
        title: "¿Qué es el efectivo para el cierre?",
        summary: "Rara vez es 'solo la cuota inicial' — y esa brecha rompe presupuestos.",
        learnMore:
          "El efectivo para el cierre incluye:\n\n• Cuota inicial\n• Costos de cierre (a menudo 2–5%)\n• Prepagos y depósitos en garantía\n\nEjemplo: Vivienda de $400K, 5% de cuota inicial = $20K de cuota — el efectivo total para el cierre suele ser de $28K–$32K.",
      },
      {
        id: "b-c5",
        title: "¿Trabajador independiente o 1099?",
        summary: "Lo que gana y lo que los prestamistas pueden usar en una hipoteca a menudo son diferentes.",
        learnMore:
          "Si presenta el Anexo C, usa depósitos bancarios o tiene ingresos irregulares, las calculadoras estándar pueden engañarle. Los prestamistas aplican adiciones, reglas de promediación y a veces programas de extracto bancario.\n\nEl Calificador Hipotecario para Independientes de Infinite Home Lending modela rutas de declaración de impuestos, flujo de efectivo de extracto bancario y un escenario de planificación para deducciones vs. poder de compra — lado a lado.",
      },
    ],
    howItWorksSteps: [
      {
        id: "b-s1",
        title: "Entienda sus números",
        summary: "Fije su presupuesto y rango de pago antes de visitar una sola casa.",
        learnMore: "Así deja de perseguir listados que no coinciden con su realidad.",
      },
      {
        id: "b-s2",
        title: "Obtenga pre-aprobación",
        summary: "Aquí es donde deja de adivinar y comienza a actuar desde una posición real.",
        learnMore:
          "Sabe para qué califica, cómo se ve el pago y qué estrategia encaja — y los vendedores lo tratan como un comprador que puede cumplir.",
      },
      {
        id: "b-s3",
        title: "Busque con claridad",
        summary: "Compre dentro de su rango — no alrededor de él.",
        learnMore: "Cuando sus límites están claros, decide más rápido y no negocia contra usted mismo.",
      },
      {
        id: "b-s4",
        title: "Haga una oferta",
        summary: "Las ofertas ganadoras se construyen — no se improvisan.",
        learnMore:
          "El precio es una palanca. Los términos, contingencias y el momento deciden quién recibe la llamada.\n\nLa oferta más fuerte suele ser la más clara — no siempre la más alta.",
      },
      {
        id: "b-s5",
        title: "Cierre con confianza",
        summary: "Del contrato a las llaves: avalúo, suscripción, aprobación final — en secuencia.",
        learnMore:
          "Esta fase es procedimental si el expediente está limpio — y frágil si no lo está.\n\nManténgase financieramente estable aquí; las sorpresas en la mesa casi siempre comienzan antes.",
      },
    ],
    faqInitialCount: 5,
    faqAll: [
      {
        q: "¿Cuánta vivienda puedo pagar si mejoro mi crédito?",
        a: "Su poder de compra depende de ingresos, deudas, tasas basadas en puntuación y cuota inicial — no solo de la puntuación. El Mapa de Poder de Compra de Infinite Home Lending proyecta el poder de compra hoy y a 90 días, 6 meses y 12 meses mientras modela crédito, pago de deuda, ahorros e ingresos — mapeados a precios medianos en los mercados reales de MD-DC-VA.",
      },
      {
        q: "¿Comprar una vivienda genera riqueza en comparación con alquilar?",
        a: "Depende de sus supuestos — especialmente la apreciación de la vivienda, el crecimiento del alquiler y lo que ganaría si invirtiera su cuota inicial en otro lugar. El Rastreador de Riqueza Hipotecaria de Infinite Home Lending modela seis flujos de riqueza en paralelo (incluido el costo de oportunidad honesto) y muestra el patrimonio neto en los años 5, 10, 20 y 30.",
      },
      {
        q: "¿Debo fijar mi tasa hipotecaria mientras estoy bajo contrato?",
        a: "Nadie toca una campana cuando las tasas llegan al fondo. El Motor de Decisión de Bloqueo de Tasa de Infinite Home Lending modela el costo y beneficio de cada opción en términos de dólares para que pueda alinear la decisión con su tolerancia al riesgo y cronograma.",
      },
      {
        q: "¿Cuál es la diferencia entre pre-calificación y pre-aprobación?",
        a: "La pre-calificación es una estimación. La pre-aprobación es verificada y tiene peso real.",
      },
      {
        q: "¿Cuánta vivienda puedo realmente pagar?",
        a: "Lo que califica vs. lo que encaja en su vida son diferentes. Ayudamos a definir ambos.",
      },
      {
        q: "¿Cuáles son los costos de cierre?",
        a: "Típicamente 2–5% cubriendo honorarios, servicios y prepagos.",
      },
      {
        q: "¿Qué es el efectivo para el cierre?",
        a: "El total de desembolso incluyendo cuota inicial y costos de cierre.",
      },
      {
        q: "¿Qué pasa si el avalúo resulta bajo?",
        a: "Puede renegociar, cubrir la brecha o ajustar la estructura según el contrato.",
      },
      {
        q: "¿Cuánto tiempo lleva la pre-aprobación?",
        a: "A menudo unos días con documentación completa — el tiempo depende de su expediente y capacidad de respuesta.",
      },
      {
        q: "¿Puedo cambiar el monto del préstamo después de la pre-aprobación?",
        a: "A veces — cambios materiales en ingresos, deuda o precio pueden requerir una actualización. Mantendremos su posición alineada con la realidad.",
      },
      {
        q: "¿Qué es el depósito de garantía?",
        a: "Un depósito que muestra buena fe en una oferta — manejado según el contrato y las prácticas locales.",
      },
    ],
    realTalk: {
      headline: "Siendo honestos",
      points: [
        "Las casas abiertas no van primero — su expediente sí. Omita los números y estará comprando a ciegas.",
        "El 'momento perfecto' es un mito. Las tasas se mueven. Los precios se mueven. La preparación supera al calendario.",
        "Perseguir la tasa más baja es una trampa. El costo total, la flexibilidad y cuánto tiempo mantendrá el préstamo deciden el verdadero ganador.",
        "Las ofertas rápidas pierden ante las claras. Los compradores que ganan saben exactamente qué están haciendo — y qué no harán.",
      ],
    },
    contextualCta: {
      line: "Tracemos cómo se ve esto realmente para usted.",
      subline: "Sus números, sus opciones y un próximo paso claro — sin presión, sin conjeturas.",
      buttonLabel: "Iniciar la conversación",
    },
  },
  numbers: {
    id: "numbers",
    label: "Entendiendo Mis Números",
    cardDescription:
      "Crédito, DTI, ingresos utilizables y cómo los prestamistas evalúan realmente su perfil — sin conjeturas.",
    heroIntro:
      "Aquí es donde vive la mayor parte de la confusión — y donde se toman las decisiones más inteligentes. Desglosamos cómo los prestamistas evalúan su perfil para que sepa qué está funcionando, qué le frena y qué puede mejorar.",
    contextLines: [
      "Aquí es donde vive la mayor parte de la confusión — y donde se toman las decisiones más inteligentes.",
      "Desglosamos cómo los prestamistas evalúan realmente su perfil para que entienda qué está funcionando para usted, qué le frena y qué puede mejorar.",
    ],
    whatMattersMost: [
      "Construir preparación no es una conjetura — puede vincular puntuación, deuda y ahorros a un camino de precio concreto.",
      "Su puntuación de crédito no solo determina la aprobación — determina qué tan costoso se vuelve su préstamo.",
      "Los ingresos no son lo que importa — los ingresos utilizables sí. Lo que los prestamistas pueden contar realmente a menudo es diferente de lo que gana.",
      "Un pago mensual puede reducir silenciosamente su poder de compra en decenas de miles.",
      "A menudo está más cerca de lo que cree — o más lejos de lo que se da cuenta. Adivinar sus números lleva a malas decisiones. La claridad lo cambia todo.",
    ],
    clarityCards: [
      {
        id: "n-c1",
        title: "¿Qué puntuación de crédito necesito?",
        summary: "El mínimo a menudo es más bajo de lo que la gente espera — pero el impacto real está en sus términos.",
        learnMore:
          "La mayoría de los préstamos Convencionales comienzan alrededor de 620, FHA puede llegar hasta 580.\n\nPero lo que importa más es cómo su puntuación afecta su tasa. Una puntuación de 740 vs 680 puede cambiar significativamente su tasa de interés — y con el tiempo, esa diferencia puede costar o ahorrar decenas de miles.",
      },
      {
        id: "n-c2",
        title: "¿Qué es la deuda en relación con los ingresos (DTI)?",
        summary: "Este es uno de los números más importantes en su aprobación.",
        learnMore:
          "El DTI mide cuánto de sus ingresos mensuales va hacia la deuda.\n\nEjemplo: Si gana $6,000/mes y tiene $2,400 en deuda → su DTI es del 40%.\n\nLa mayoría de los programas permiten alrededor del 43–50%, dependiendo del escenario. DTI más bajo = aprobación más sólida y mejores opciones.",
      },
      {
        id: "n-c3",
        title: "¿Cómo se evalúan mis ingresos?",
        summary: "Lo que gana y lo que los prestamistas pueden usar no siempre son lo mismo.",
        learnMore:
          "Los ingresos W-2 suelen ser directos. Los ingresos de trabajadores independientes se basan en declaraciones de impuestos después de deducciones. Los bonos y comisiones a menudo requieren historial.\n\nPor eso importa la planificación anticipada — especialmente para prestatarios trabajadores independientes.",
      },
      {
        id: "n-c4",
        title: "¿Puedo calificar con problemas de crédito?",
        summary: "En muchos casos, sí — depende del panorama completo.",
        learnMore:
          "Pagos tardíos, cobros o incluso una quiebra pasada no lo descalifican automáticamente.\n\nLo que más importa: tiempo desde el evento, comportamiento de pago actual y perfil financiero general.\n\nA menudo hay un camino hacia adelante — solo necesita estructurarse correctamente.",
      },
    ],
    howItWorksSteps: [
      {
        id: "n-s1",
        title: "Revise su perfil de crédito",
        summary:
          "Miramos más allá de la puntuación al historial de pagos, uso y estructura de cuentas — no solo un número de tres dígitos.",
        learnMore:
          "Vamos más allá de la puntuación y miramos el historial de pagos, el uso del crédito y la estructura de las cuentas. A veces pequeños ajustes pueden mejorar su posición rápidamente.",
      },
      {
        id: "n-s2",
        beforeTransition: "Ahora que entendemos su crédito…",
        title: "Calcule su DTI",
        summary: "Evaluamos sus ingresos frente a las obligaciones mensuales — aquí es donde el poder de compra se libera o se limita.",
        learnMore:
          "Analizamos sus ingresos y obligaciones mensuales para determinar su capacidad de endeudamiento. Aquí es donde el poder de compra se libera o se restringe.",
      },
      {
        id: "n-s3",
        beforeTransition: "A continuación, miramos lo que realmente gana…",
        title: "Analice sus ingresos",
        summary: "No todos los ingresos se tratan igual — la documentación y el historial determinan lo que cuenta.",
        learnMore:
          "No todos los ingresos se tratan igual. Estructuramos sus ingresos correctamente para que reflejen su verdadera fortaleza de calificación.",
      },
      {
        id: "n-s4",
        title: "Identifique oportunidades para mejorar",
        summary: "Movimientos pequeños y específicos pueden elevar su techo — el momento importa.",
        learnMore:
          "Ejemplos incluyen pagar deuda específica, ajustar el uso del crédito o el momento de su solicitud. Los pequeños movimientos pueden crear mejoras significativas.",
      },
      {
        id: "n-s5",
        title: "Alinee los números con sus metas",
        summary: "La aprobación no es la línea de llegada — el ajuste con su vida lo es.",
        learnMore:
          "La aprobación no es el objetivo — la alineación lo es. Hacemos coincidir sus números con su nivel de comodidad y planes a largo plazo.",
      },
    ],
    faqInitialCount: 5,
    faqAll: [
      {
        q: "¿Cómo sé qué puedo pagar a medida que mejoran mis finanzas?",
        a: "Comience con ingresos, deudas y tasas basadas en puntuación — luego haga una prueba de estrés de un cronograma. El Mapa de Poder de Compra de Infinite Home Lending proyecta el poder de compra a 90 días, 6 meses y 12 meses frente a los precios medianos en los mercados MD-DC-VA.",
      },
      {
        q: "¿Es ahora el momento correcto para comprar — para construir riqueza, no solo para el pago?",
        a: "La respuesta honesta depende de cuánto tiempo mantendrá la vivienda, el comportamiento del mercado local y si realmente invertiría el efectivo que pondría en una vivienda. Use el Rastreador de Riqueza Hipotecaria de Infinite Home Lending para una comparación transparente de 30 años.",
      },
      {
        q: "¿Qué puntuación de crédito necesito para comprar una vivienda?",
        a: "Depende del programa de préstamo, pero existen muchas opciones por debajo de lo que la gente espera. El mayor impacto es cómo su puntuación afecta su tasa y costo a largo plazo.",
      },
      {
        q: "Mi crédito no es bueno — ¿debo esperar?",
        a: "No necesariamente. El mejor primer paso es entender dónde está antes de decidir.\n\nMuchos compradores están más cerca de lo que creen.",
      },
      {
        q: "¿Cómo afecta el DTI a mi hipoteca?",
        a: "El DTI impacta directamente cuánto puede calificar. DTI más bajo típicamente significa más flexibilidad y mejores opciones.",
      },
      {
        q: "Soy trabajador independiente — ¿es más difícil calificar?",
        a: "Es más complejo, pero muy manejable con la estructura correcta. Planificar con anticipación hace una gran diferencia.",
      },
      {
        q: "¿Puedo usar fondos de regalo?",
        a: "Sí. La mayoría de los programas de préstamos permiten fondos de regalo con la documentación adecuada.",
      },
      {
        q: "¿Qué cuenta como deuda para mi DTI?",
        a: "Generalmente, las obligaciones mensuales recurrentes en su informe de crédito — préstamos de auto, préstamos estudiantiles, tarjetas de crédito, manutención de menores y su nuevo pago de vivienda.",
      },
      {
        q: "¿Cuánto tiempo necesito estar en mi trabajo?",
        a: "La estabilidad importa. Muchos programas buscan un historial laboral sólido en la misma línea de trabajo.",
      },
      {
        q: "¿La búsqueda de tasas afectará mi crédito?",
        a: "Múltiples consultas hipotecarias en una ventana corta a menudo se tratan como una sola consulta para fines de puntuación.",
      },
    ],
    realTalk: {
      headline: "Siendo honestos",
      points: [
        "La mayoría de las personas se enfocan en el número incorrecto — persiguen el precio de compra en lugar de entender el pago.",
        "Su límite de aprobación no es su presupuesto. Solo porque esté aprobado para ello no significa que deba gastarlo.",
        "Los cambios pequeños pueden crear grandes resultados. Pagar una deuda puede aumentar significativamente su poder de compra.",
        "Adivinar sus números es la forma más rápida de tomar una mala decisión. La claridad lo cambia todo.",
        "La mayoría de las malas decisiones de compra de vivienda no provienen de malas intenciones — provienen de no entender los números.",
      ],
    },
    contextualCta: {
      ctaReassurance: "Sin compromiso. Solo claridad.",
      line: "¿Quiere ver cómo se ven realmente sus números?",
      subline: "Revisaremos sus números, sus opciones y lo que realmente tiene sentido — sin presión.",
      buttonLabel: "Hablar con un asesor",
    },
  },
  "loan-options": {
    id: "loan-options",
    label: "Opciones de Préstamo y Programas",
    cardDescription: "Estructura primero, tasa segundo — el préstamo que se ajusta a su plan, no al anuncio.",
    heroIntro:
      "La mayoría de las personas piensan que elegir un préstamo se trata de encontrar la tasa más baja. No lo es. La estructura de su préstamo — cómo está construido, cuánto tiempo lo mantiene y cómo encaja en su plan — a menudo importa más que la tasa misma.",
    contextLines: [
      "La mayoría de las personas piensan que elegir un préstamo se trata de encontrar la tasa más baja. No lo es.",
      "La estructura de su préstamo — cómo está construido, cuánto tiempo lo mantiene y cómo encaja en su plan — a menudo importa más que la tasa misma.",
      "Le ayudamos a entender sus opciones para que pueda elegir la estrategia que realmente funciona para usted.",
    ],
    whatMattersMost: [
      "La tasa más baja a menudo no es el préstamo más barato.",
      "Haga coincidir el préstamo con su cronograma de salida — no al revés.",
      "La flexibilidad es un activo. Un 'trato' fijo puede costarle si la vida cambia.",
      "Una cotización no es una elección — es un valor predeterminado.",
    ],
    clarityCards: [
      {
        id: "lo-c1",
        title: "¿Cuál es la diferencia entre tipos de préstamo?",
        summary: "No todos los préstamos están construidos igual — y las diferencias importan más de lo que la mayoría se da cuenta.",
        learnMore:
          "Las opciones más comunes incluyen:\n\n• Préstamos Convencionales — flexibles, buena opción a largo plazo\n• Préstamos FHA — cuota inicial más baja, crédito más flexible\n• Préstamos VA — sin cuota inicial para compradores elegibles\n• Préstamos USDA — 0% en áreas elegibles\n\nLa elección correcta depende de su perfil de crédito, cuota inicial y plan a largo plazo.",
      },
      {
        id: "lo-c2",
        title: "¿Cuál es la diferencia entre un préstamo a 30 y 15 años?",
        summary: "No es solo sobre el pago — es sobre cómo usa el préstamo.",
        learnMore:
          "Ejemplo aproximado en un préstamo de $400K: un préstamo a 15 años puede pagar cientos más por mes que uno a 30 — pero puede ahorrar cinco cifras en interés total durante la vida del préstamo si se queda.\n\nUn préstamo a 30 años libera flujo de caja para reservas, inversión o vida — si realmente lo usará de esa manera.",
      },
      {
        id: "lo-c3",
        title: "¿Qué es una hipoteca de tasa ajustable (ARM)?",
        summary: "Un préstamo que cambia con el tiempo — pero no siempre de la manera que la gente piensa.",
        learnMore:
          "Los ARMs generalmente comienzan con una tasa más baja que la fija por un período establecido — a menudo 5, 7 o 10 años.\n\nContraintuitivo: si se muda o refinancia dentro de esa ventana, puede que nunca pague la tasa ajustada — capturó los años más baratos y se fue.",
      },
      {
        id: "lo-c4",
        title: "¿Debo enfocarme solo en la tasa de interés?",
        summary: "Aquí es donde la mayoría de los compradores toman la decisión incorrecta.",
        learnMore:
          "La tasa es una línea en la página — no toda la matemática.\n\nEscenario real: El Préstamo A tiene 0.25% menos de tasa pero $4K más en puntos. Si vende o refinancia antes del punto de equilibrio (a menudo años), la 'tasa más baja' perdió dinero.\n\nEvaluamos estructura, costos iniciales y cuánto tiempo lo mantendrá.",
      },
    ],
    howItWorksSteps: [
      {
        id: "lo-s1",
        title: "Entienda su cronograma",
        summary: "Su préstamo debe coincidir con cuánto tiempo planea mantener la vivienda.",
        learnMore:
          "La propiedad a corto vs. largo plazo cambia la estrategia de tasa, el tipo de préstamo y la estructura de costos — este paso es no negociable.",
      },
      {
        id: "lo-s2",
        title: "Revise sus opciones",
        summary: "Si solo se le muestra una opción, no está viendo el panorama completo.",
        learnMore:
          "Presentamos múltiples tipos de préstamo y combinaciones de tasa/estructura lado a lado — la comparación es el proceso, no un bono.",
      },
      {
        id: "lo-s3",
        title: "Compare el costo total — no solo el pago",
        summary: "El pago mensual solo no cuenta toda la historia.",
        learnMore:
          "Hacemos pruebas de estrés de interés total, costos iniciales y punto de equilibrio — para que 'asequible mensualmente' no oculte un costo total costoso.",
      },
      {
        id: "lo-s4",
        title: "Elija la estructura que se ajusta a su plan",
        summary: "Elija el préstamo que se ajuste a su vida — no el que parece más barato en el papel.",
        learnMore:
          "La estructura correcta se alinea con sus metas, cronograma y comodidad — no con el número más pequeño en el titular.",
      },
      {
        id: "lo-s5",
        title: "Fije y avance con confianza",
        summary: "Una vez que la estrategia es clara, la ejecución se vuelve simple.",
        learnMore: "Avanza sabiendo por qué lo eligió, cómo se comporta con el tiempo y qué esperar en cada paso.",
      },
    ],
    faqInitialCount: 5,
    faqAll: [
      {
        q: "¿Cómo pienso en fijar mi tasa vs. dejarla flotar?",
        a: "Trátelo como una pregunta de riesgo y costo, no una predicción. El Motor de Decisión de Bloqueo de Tasa muestra el beneficio y costo hipotético en dólares mensuales y de por vida.",
      },
      {
        q: "¿Cómo se comparan los préstamos FHA y Convencionales en costo total?",
        a: "La tasa es solo parte de la historia — el seguro hipotecario (PMI vs. MIP), cuánto tiempo permanece y su nivel de crédito cambian el ganador.",
      },
      {
        q: "¿Cuál es el mejor tipo de préstamo?",
        a: "No hay un préstamo mejor único — solo el que se ajusta a su situación y plan.",
      },
      {
        q: "¿Es un préstamo a 15 años siempre mejor que uno a 30 años?",
        a: "No necesariamente. Depende de sus metas, flujo de caja y necesidades de flexibilidad.",
      },
      {
        q: "¿Son riesgosas las hipotecas de tasa ajustable?",
        a: "No inherentemente. Cuando se combinan con el cronograma correcto, pueden ser muy efectivas.",
      },
      {
        q: "¿Debo elegir siempre la tasa más baja?",
        a: "No. La estructura, la flexibilidad y el costo a largo plazo a menudo importan más.",
      },
      {
        q: "¿Cuántas opciones debo ver?",
        a: "Al menos 2–3. Ver una opción limita su capacidad de tomar la decisión correcta.",
      },
      {
        q: "¿Cuál es la diferencia entre APR y tasa de interés?",
        a: "La tasa es el costo del préstamo; el APR incluye ciertos costos para ayudar a comparar ofertas — ambos importan, pero la estructura sigue siendo lo primero.",
      },
      {
        q: "¿Cuándo tienen sentido los puntos de descuento?",
        a: "Cuando mantendrá el préstamo más allá del punto de equilibrio — de lo contrario, puede pagar por una tasa más baja que nunca realiza completamente.",
      },
      {
        q: "¿Puedo cambiar de programa de préstamo después de fijar?",
        a: "A veces, pero puede afectar el precio y el tiempo. Alinearemos cualquier cambio con su estrategia antes de comprometerse.",
      },
    ],
    realTalk: {
      headline: "Siendo honestos",
      points: [
        "La mayoría de los compradores no eligen un préstamo — aceptan el que se les da.",
        "Préstamo incorrecto, razón incorrecta: generalmente no es mala intención — solo una opción en la mesa.",
        "La tasa más baja se vende sola. La estructura correcta requiere explicación — esa es la diferencia.",
        "El mejor préstamo se ajusta a su vida, cronograma y plan. La mayoría de las personas nunca ven esa comparación.",
      ],
    },
    contextualCta: {
      line: "Tracemos las estructuras de préstamo que realmente funcionan para usted.",
      subline:
        "Compensaciones lado a lado, resultados en lenguaje claro y un camino claro hacia adelante — sin presión, sin conjeturas.",
      buttonLabel: "Explore sus opciones",
    },
  },
  "refinance-equity": {
    id: "refinance-equity",
    label: "Refinanciamiento y Patrimonio",
    cardDescription:
      "Cuándo el refinanciamiento tiene sentido, cuándo no y cómo pensar estratégicamente sobre el patrimonio.",
    heroIntro:
      "Refinanciar no es solo obtener una tasa más baja — se trata de mejorar su posición. Le ayudamos a entender cuándo tiene sentido, cuándo no y qué considerar antes de hacer un movimiento.",
    contextLines: [
      "Refinanciar no es solo obtener una tasa más baja.",
      "Se trata de mejorar su posición — ya sea reduciendo su pago, accediendo al patrimonio o reestructurando su préstamo para ajustarse mejor a sus metas.",
      "Le ayudamos a entender cuándo tiene sentido, cuándo no y qué considerar antes de hacer un movimiento.",
    ],
    whatMattersMost: [
      "Una tasa más baja no significa automáticamente un mejor préstamo.",
      "El momento correcto sigue sus metas y horizonte — no un titular de tasa.",
      "El patrimonio es apalancamiento: poderoso cuando se planifica, costoso cuando es casual.",
      "A veces el mejor refinanciamiento es ningún refinanciamiento.",
    ],
    clarityCards: [
      {
        id: "r-c1",
        title: "¿Cuándo tiene sentido realmente refinanciar?",
        summary: "Un mejor titular no es lo mismo que un mejor resultado.",
        learnMore:
          "Refinanciar típicamente tiene sentido cuando reduce su pago mensual de manera significativa, reduce el costo total a largo plazo o mejora la estructura del préstamo.\n\nSi el beneficio es pequeño — o tarda demasiado en recuperarse — puede no valer la pena.",
      },
      {
        id: "r-c2",
        title: "¿Qué es el punto de equilibrio?",
        summary: "El número que convierte un 'trato' en ahorros reales — o un error costoso.",
        learnMore:
          "Su punto de equilibrio es cuánto tiempo lleva recuperar el costo de refinanciar.\n\nEjemplo: Si los costos de cierre son $6,000 y ahorra $200/mes, el punto de equilibrio es de 30 meses.\n\nSi refinancia y se muda antes de su punto de equilibrio, pierde dinero — incluso con una tasa más baja.",
      },
      {
        id: "r-c3",
        title: "¿Qué es un refinanciamiento con retiro de efectivo?",
        summary: "Efectivo en mano hoy — un préstamo mayor mañana.",
        learnMore:
          "Un refinanciamiento con retiro de efectivo le permite acceder al patrimonio como efectivo y reemplaza su préstamo actual con uno mayor.\n\nUsos comunes incluyen consolidación de deuda, mejoras del hogar y gastos grandes.\n\nEstá aumentando su saldo de préstamo — por lo que debe ser estratégico.",
      },
      {
        id: "r-c4",
        title: "¿Qué es un HELOC vs refinanciamiento?",
        summary: "El mismo patrimonio — dos apuestas diferentes sobre estructura y riesgo.",
        learnMore:
          "El refinanciamiento reemplaza su préstamo actual con nueva tasa y términos.\n\nUn HELOC es un segundo préstamo además de su hipoteca — acceso flexible a fondos, a menudo con una tasa variable.\n\nLa opción correcta depende de cuánto necesita, cómo planea usarlo y su tolerancia al riesgo.",
      },
    ],
    howItWorksSteps: [
      {
        id: "r-s1",
        title: "Entienda su posición actual",
        summary: "Antes de hacer un movimiento, necesita saber dónde está.",
        learnMore: "Revisamos su tasa actual, saldo del préstamo, pago mensual y posición de patrimonio.",
      },
      {
        id: "r-s2",
        title: "Defina su objetivo",
        summary: "Refinanciar sin un objetivo claro lleva a malas decisiones.",
        learnMore:
          "Los objetivos comunes incluyen reducir su pago, reducir el costo total, acceder al patrimonio o cambiar la estructura del préstamo.",
      },
      {
        id: "r-s3",
        title: "Evalúe escenarios",
        summary: "Debe ver múltiples opciones — no solo una.",
        learnMore: "Comparamos nuevos términos de préstamo, costo vs. ahorros y cronogramas de punto de equilibrio.",
      },
      {
        id: "r-s4",
        title: "Determine si vale la pena",
        summary: "Aquí es donde la mayoría toma la decisión incorrecta — la tasa parece buena, la matemática no cierra.",
        learnMore:
          "Este paso es donde el entusiasmo supera a la aritmética: una tasa brillante puede ocultar honorarios, restablecer la amortización o un punto de equilibrio que nunca alcanzará.\n\nSi el beneficio es mínimo o de corta duración, puede no justificar el costo.\n\nA veces la mejor decisión es no hacer nada.",
      },
      {
        id: "r-s5",
        title: "Avance con claridad",
        summary: "Si tiene sentido, la ejecución es sencilla.",
        learnMore: "Avanza sabiendo por qué lo está haciendo, qué ahorra o cambia y cómo encaja en su plan.",
      },
    ],
    faqInitialCount: 5,
    faqAll: [
      {
        q: "¿Cuánto cuesta refinanciar?",
        a: "Típicamente 2–5% del monto del préstamo, dependiendo de la estructura y los honorarios.",
      },
      {
        q: "¿Cuánto necesita bajar mi tasa para refinanciar?",
        a: "No hay regla fija — depende de su punto de equilibrio y metas.",
      },
      {
        q: "¿Puedo acceder a efectivo de mi vivienda?",
        a: "Sí, a través de un refinanciamiento con retiro de efectivo o HELOC, dependiendo de su situación.",
      },
      {
        q: "¿Qué es un punto de equilibrio?",
        a: "El tiempo que lleva recuperar el costo del refinanciamiento a través de los ahorros.",
      },
      {
        q: "¿Refinanciar siempre es una buena idea?",
        a: "No. Solo tiene sentido si mejora su posición.",
      },
      {
        q: "¿Cuánto tiempo hasta que llegue al punto de equilibrio en un refinanciamiento?",
        a: "Divida los costos de cierre por los ahorros mensuales para obtener los meses de recuperación — revisaremos sus números en términos claros.",
      },
      {
        q: "¿Refinanciar restablecerá mi amortización?",
        a: "A menudo sí en un nuevo préstamo — esa compensación es parte de lo que explicamos antes de que decida.",
      },
      {
        q: "HELOC vs refinanciamiento con retiro de efectivo — ¿cuál es mejor?",
        a: "Depende de cuánto necesita, cómo usará los fondos y si quiere una estructura fija o retiros flexibles.",
      },
    ],
    realTalk: {
      headline: "Siendo honestos",
      points: [
        "Una tasa más baja es fácil de vender — porque es fácil de entender.",
        "Refinanciar es una de las partes más comercializadas de la industria hipotecaria — y el discurso se mantiene simple a propósito.",
        "Pero una tasa más baja no siempre significa un mejor resultado: la mayoría de las personas refinancia sin mapear el costo, el cronograma o el impacto a largo plazo.",
        "A veces el movimiento más inteligente es no hacer nada.",
      ],
    },
    contextualCta: {
      line: "Analicemos si el refinanciamiento realmente mejora su posición.",
      subline:
        "Revisaremos su préstamo actual, sus opciones y lo que realmente dicen los números — para que pueda decidir con calma, con el panorama completo.",
      buttonLabel: "Revise sus opciones",
    },
  },
  "quick-answers": {
    id: "quick-answers",
    label: "Respuestas Rápidas",
    cardDescription: "Respuestas directas a preguntas comunes — explore rápido, expanda cuando quiera más.",
    heroIntro:
      "No todas las preguntas necesitan una explicación larga. Respuestas claras aquí para que pueda avanzar sin quedarse atascado.",
    contextLines: [
      "No todas las preguntas necesitan una explicación larga.",
      "Aquí están respuestas claras y directas a las cosas que la mayoría de las personas preguntan — para que pueda avanzar sin quedarse atascado.",
    ],
    whatMattersMost: [
      "La mayoría de las preguntas tienen respuestas simples — si se explican claramente. La confusión generalmente viene de cómo se presentan las cosas, no del tema en sí.",
      "No necesita saberlo todo para avanzar — necesita claridad sobre lo que importa ahora mismo.",
      "Desatascarse supera a perfeccionar — el progreso viene de la claridad, no de la cavilación.",
    ],
    claritySectionTitle: "Respuestas rápidas",
    clarityCards: [
      {
        id: "qa-c1",
        title: "¿Qué puntuación de crédito necesito para comprar una vivienda?",
        summary:
          "Muchos programas funcionan con puntuaciones en el rango de 580–620. Las puntuaciones más altas generalmente significan mejor precio — pero el tipo de préstamo correcto importa igual.",
        learnMore:
          "Los prestamistas no están juzgando su valor; están midiendo el riesgo. Una puntuación más fuerte generalmente significa una tasa más baja y un camino más fluido — pero el programa correcto sigue importando tanto como el número.\n\nPiense en la puntuación como una palanca: los ingresos, los ahorros y cuánto está pidiendo prestado dan forma al panorama completo.",
      },
      {
        id: "qa-c2",
        title: "¿Cuánto necesito para una cuota inicial?",
        summary:
          "A menudo 3–5% convencional, 3.5% FHA, 0% VA/USDA cuando califica. Rara vez necesita el 20% para comprar.",
        learnMore:
          "Menos cuota inicial puede significar un pago mensual más alto o seguro hipotecario — esa es la compensación, no una trampa. El objetivo es hacer coincidir su efectivo hoy con el pago con el que puede vivir mañana.\n\nEl convencional generalmente comienza alrededor del 3–5%, FHA en 3.5%, y VA/USDA puede ser 0% para compradores elegibles.",
      },
      {
        id: "qa-c3",
        title: "¿Cuáles son los costos de cierre?",
        summary:
          "Espere aproximadamente 2–5% del precio — separado de su cuota inicial. Es el costo de finalizar el préstamo y transferir la vivienda.",
        learnMore:
          "Estos no son honorarios misteriosos en un solo cubo: costos del prestamista, título, registro y configuración de impuestos y seguro son piezas comunes.\n\nConocer el rango anticipadamente le ayuda a presupuestar para que la línea de llegada no se sienta como una sorpresa.",
      },
      {
        id: "qa-c4",
        title: "¿Qué es la pre-aprobación?",
        summary:
          "Una revisión documentada de su crédito, ingresos y activos — para que sepa cuánto puede pedir prestado antes de enamorarse de una casa.",
        learnMore:
          "Supera a una estimación rápida porque los vendedores (y usted) obtienen un número realista, no una suposición.\n\nLa pre-calificación es más ligera; la pre-aprobación es más sólida porque el papeleo ya está en movimiento.",
      },
      {
        id: "qa-c5",
        title: "¿Cuánto tiempo toma el proceso?",
        summary:
          "Después de estar bajo contrato, muchas compras cierran en aproximadamente 21–30 días — el tiempo depende del avalúo, la suscripción y qué tan completo está el expediente.",
        learnMore:
          "El reloj realmente comienza una vez que está bajo contrato: el avalúo y la suscripción necesitan tiempo para alinearse.\n\nObtener la pre-aprobación por adelantado acorta la pista emocional — no está aprendiendo su presupuesto la misma semana en que está negociando.",
      },
      {
        id: "qa-c6",
        title: "¿Puedo comprar con deuda?",
        summary:
          "Sí. Los préstamos de auto, préstamos estudiantiles y tarjetas son normales. Lo que cuenta es si sus ingresos pueden cubrir cómodamente sus deudas más el nuevo pago de la vivienda.",
        learnMore:
          "Los suscriptores miran la deuda en relación con los ingresos — básicamente obligaciones mensuales vs. ingresos brutos — no un cuadro de puntuación moral.\n\nPagar deuda puede ayudar, pero no necesita una pizarra perfectamente vacía para calificar. La pregunta es el equilibrio, no el cero.",
      },
      {
        id: "qa-c7",
        title: "¿Debo esperar a que bajen las tasas?",
        summary:
          "Nadie toca una campana cuando las tasas llegan al fondo. Esperar solo gana si los ahorros superan lo que renuncia mientras espera — alquiler, precios o tiempo.",
        learnMore:
          "Las tasas son una entrada; su vida es la más grande. Una tasa ligeramente más alta en la vivienda correcta aún puede superar esperar años por un número 'perfecto' que puede que nunca llegue.\n\nLa pregunta útil no es 'cronometrar el mercado' — es si comprar se ajusta a su presupuesto y planes hoy.",
      },
      {
        id: "qa-c8",
        title: "¿Qué pasa después de que quedo bajo contrato?",
        summary:
          "Su préstamo pasa por avalúo, luego suscripción, luego una aprobación final — luego firma y financia. El mismo orden la mayor parte del tiempo.",
        learnMore:
          "El avalúo verifica el valor para el prestamista; la suscripción verifica que su expediente cumpla las reglas; el cierre es cuando los documentos y fondos se alinean.\n\nCargará algunas cosas, responderá algunas preguntas y señalaremos cualquier cosa anticipadamente para que el día del cierre se sienta tranquilo, no caótico.",
      },
    ],
    afterClarityBridge: {
      headline: "¿Todavía tiene una pregunta?",
      body: "Algunas situaciones necesitan más que una respuesta rápida — y ahí es donde ayudamos.",
    },
    howItWorksIntro:
      "Estas respuestas están diseñadas para darle claridad rápidamente — pero el valor real viene de entender cómo se aplican a su situación.\n\nCada respuesta destaca una pieza del panorama más grande. El objetivo no es aprender todo a la vez — es aclararse en lo que importa ahora mismo.",
    howItWorksSteps: [
      {
        id: "qa-s1",
        title: "Enfóquese en la pregunta detrás de su pregunta",
        summary: "Lo que escribe en la búsqueda no siempre es lo que realmente le preocupa.",
        learnMore:
          "La mayoría de las personas no solo tienen una pregunta — tienen una preocupación detrás.\n\nPor ejemplo:\n- '¿Cuánto necesito?' a menudo significa → ¿Puedo realmente pagar esto?\n- '¿Qué puntuación necesito?' a menudo significa → ¿Estoy listo todavía?\n\nComience ahí.\nEso es lo que le ayuda a avanzar.",
      },
      {
        id: "qa-s2",
        title: "Use las respuestas para eliminar incertidumbre — no para agregar más",
        summary: "No necesita resolver todo el panorama a la vez — elimine una incógnita a la vez.",
        learnMore:
          "Una vez que entiende lo que realmente está preguntando…\n\nNo necesita resolverlo todo a la vez.\n\nIntentarlo todo puede en realidad ralentizarle.\n\nEn cambio:\n→ use estas respuestas para eliminar una incertidumbre a la vez\n\nAsí es como se construye la claridad.",
      },
      {
        id: "qa-s3",
        title: "La misma respuesta significa cosas diferentes dependiendo de usted",
        summary: "Un hecho en una página no es lo mismo que ese hecho en su vida.",
        learnMore:
          "Ahora que está filtrando el ruido…\n\nUna respuesta por sí sola es útil — pero su situación determina su impacto.\n\nPor ejemplo:\n- Sí, puede calificar con cierta puntuación de crédito\n- Pero mejorarla podría cambiar su pago, opciones o flexibilidad\n\nAsí que la pregunta real se convierte en:\n¿Cómo se aplica esto a mí?",
      },
      {
        id: "qa-s4",
        title: "Si algo se siente poco claro, eso es útil",
        summary: "La confusión generalmente significa que está en un punto de decisión — no que está atrasado.",
        learnMore:
          "En este punto, cierta incertidumbre es normal…\n\nLa confusión no es un retroceso — es una señal.\n\nLa mayoría de las personas se sienten inseguras en esta etapa — no está atrasado.\n\nGeneralmente significa:\n→ hay una decisión que necesita más contexto\n\nY eso es completamente normal.\n\nEste proceso no se trata de tener respuestas perfectas —\nse trata de aclararse lo suficiente para avanzar con confianza.",
      },
      {
        id: "qa-s5",
        title: "Este es su punto de partida — no su paso final",
        summary: "Use esta sección para desatascarse — luego conecte sus números y metas reales.",
        learnMore:
          "Estas respuestas están aquí para ayudarle a desatascarse.\n\nDesde aquí, el próximo paso es simple:\n→ conecte esta claridad a sus números y metas reales\n\nAhí es donde todo empieza a encajar.",
      },
    ],
    faqAll: [],
    realTalk: {
      headline: "Habla directa",
      points: [
        "Si una respuesta evita sus números, está evitando su situación.",
        "Las respuestas rápidas eliminan fricción — no reemplazan la suscripción.",
        "La siguiente pregunta correcta supera a una respuesta perfecta a la incorrecta.",
      ],
    },
    contextualCta: {
      line: "Aclaremos lo que importa para su situación.",
      subline: "Responderemos sus preguntas, revisaremos sus opciones y le ayudaremos a avanzar con confianza.",
      buttonLabel: "Obtenga sus respuestas",
    },
  },
};

export const FEATURED_MISUNDERSTANDINGS_ES = [
  {
    id: "fm-1",
    title: "La tasa más baja gana",
    summary:
      "La estructura, el cronograma y los costos de cierre a menudo importan más que una fracción en la línea de tasa.",
  },
  {
    id: "fm-2",
    title: "La pre-aprobación es decoración opcional",
    summary: "En mercados competitivos, la pre-aprobación documentada señala seriedad — para usted y para los vendedores.",
  },
  {
    id: "fm-3",
    title: "Refinanciar = ahorros automáticos",
    summary: "El punto de equilibrio y las metas deciden si un refinanciamiento mejora su vida — no solo el titular.",
  },
  {
    id: "fm-4",
    title: "Las apps de crédito cuentan toda la historia",
    summary: "La suscripción usa historial documentado — alineamos las expectativas antes de las sorpresas.",
  },
];
