// HipoCalc - Calculadora de Hipotecas y Amortizaciones
// Sistema Francés de Amortización

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  // Modo de Cálculo ('compra' | 'directo')
  let modoCalculo = 'compra';

  const btnModoCompra = document.getElementById('btn-modo-compra');
  const btnModoDirecto = document.getElementById('btn-modo-directo');
  const seccionCompraGastos = document.getElementById('seccion-compra-gastos');
  const seccionModoDirecto = document.getElementById('seccion-modo-directo');

  // Elementos Modo Compra
  const inputPrecioInmueble = document.getElementById('precio-inmueble');
  const inputPctFinanciacion = document.getElementById('pct-financiacion');
  const sliderFinanciacion = document.getElementById('slider-financiacion');
  const badgeEntradaPct = document.getElementById('badge-entrada-pct');
  const btnsLtv = document.querySelectorAll('[data-ltv-btn]');
  const chipsLtvDelta = document.querySelectorAll('[data-chip-ltv-delta]');

  const selectTipoVivienda = document.getElementById('tipo-vivienda');
  const selectCCAA = document.getElementById('select-ccaa');
  const contenedorItpReducido = document.getElementById('contenedor-itp-reducido');
  const checkItpReducido = document.getElementById('check-itp-reducido');
  const badgeTipoImpuesto = document.getElementById('badge-tipo-impuesto');
  const contenedorObraNuevaInfo = document.getElementById('contenedor-obra-nueva-info');
  const textoObraNuevaInfo = document.getElementById('texto-obra-nueva-info');
  const badgeObraNuevaImpuesto = document.getElementById('badge-obra-nueva-impuesto');

  const btnToggleDesgloseGastos = document.getElementById('btn-toggle-desglose-gastos');
  const panelDesgloseGastos = document.getElementById('panel-desglose-gastos');
  const iconoChevronGastos = document.getElementById('icono-chevron-gastos');
  const badgeTotalAranceles = document.getElementById('badge-total-aranceles');

  const inputGastoNotaria = document.getElementById('gasto-notaria');
  const inputGastoRegistro = document.getElementById('gasto-registro');
  const inputGastoGestoria = document.getElementById('gasto-gestoria');
  const inputGastoTasacion = document.getElementById('gasto-tasacion');

  const resAhorroTotalCompra = document.getElementById('res-ahorro-total-compra');
  const lblEntradaPct = document.getElementById('lbl-entrada-pct');
  const resDesgloseEntrada = document.getElementById('res-desglose-entrada');
  const lblTipoImpuestoCaja = document.getElementById('lbl-tipo-impuesto-caja');
  const resDesgloseImpuestos = document.getElementById('res-desglose-impuestos');
  const resDesgloseGastos = document.getElementById('res-desglose-gastos');
  const resImporteHipotecaCompra = document.getElementById('res-importe-hipoteca-compra');

  // Tipos impositivos por CCAA en España (ITP general, ITP reducido y IAJD compraventa)
  const CCAA_IMPUESTOS = {
    andalucia: { nombre: 'Andalucía', itp: 7.0, itpReducido: 3.5, iajd: 1.2 },
    aragon: { nombre: 'Aragón', itp: 8.0, itpReducido: 5.0, iajd: 1.5 },
    asturias: { nombre: 'Asturias', itp: 8.0, itpReducido: 3.0, iajd: 1.2 },
    baleares: { nombre: 'Baleares', itp: 8.0, itpReducido: 4.0, iajd: 1.5 },
    canarias: { nombre: 'Canarias', itp: 6.5, itpReducido: 4.0, iajd: 1.0, igic: 6.5 },
    cantabria: { nombre: 'Cantabria', itp: 10.0, itpReducido: 5.0, iajd: 1.5 },
    castilla_mancha: { nombre: 'Castilla-La Mancha', itp: 9.0, itpReducido: 5.0, iajd: 1.5 },
    castilla_leon: { nombre: 'Castilla y León', itp: 8.0, itpReducido: 4.0, iajd: 1.5 },
    cataluna: { nombre: 'Cataluña', itp: 10.0, itpReducido: 5.0, iajd: 1.5 },
    ceuta_melilla: { nombre: 'Ceuta y Melilla', itp: 6.0, itpReducido: 3.0, iajd: 0.5 },
    valencia: { nombre: 'Comunidad Valenciana', itp: 10.0, itpReducido: 6.0, iajd: 1.5 },
    extremadura: { nombre: 'Extremadura', itp: 8.0, itpReducido: 7.0, iajd: 1.5 },
    galicia: { nombre: 'Galicia', itp: 8.0, itpReducido: 3.0, iajd: 1.5 },
    madrid: { nombre: 'Madrid', itp: 6.0, itpReducido: 4.0, iajd: 0.75 },
    murcia: { nombre: 'Murcia', itp: 8.0, itpReducido: 3.0, iajd: 1.5 },
    navarra: { nombre: 'Navarra', itp: 6.0, itpReducido: 5.0, iajd: 0.5 },
    pais_vasco: { nombre: 'País Vasco', itp: 4.0, itpReducido: 2.5, iajd: 0.5 },
    la_rioja: { nombre: 'La Rioja', itp: 7.0, itpReducido: 5.0, iajd: 1.0 }
  };

  // Actualiza dinámicamente las etiquetas del desplegable CCAA según el tipo de vivienda
  function actualizarOpcionesCCAA(tipoViv) {
    if (!selectCCAA) return;
    const valorSeleccionado = selectCCAA.value;
    Array.from(selectCCAA.options).forEach(opt => {
      const data = CCAA_IMPUESTOS[opt.value];
      if (data) {
        if (tipoViv === 'segunda_mano') {
          const itpStr = data.itp.toString().replace('.', ',');
          opt.textContent = `${data.nombre} (ITP: ${itpStr}%)`;
        } else {
          const iajdStr = data.iajd.toString().replace('.', ',');
          const igicTxt = data.igic ? ` · IGIC: ${data.igic.toString().replace('.', ',')}%` : '';
          opt.textContent = `${data.nombre} (IAJD: ${iajdStr}%${igicTxt})`;
        }
      }
    });
    selectCCAA.value = valorSeleccionado;
  }

  // Elementos de entrada del préstamo
  const inputCapital = document.getElementById('capital');
  const inputInteres = document.getElementById('interes');
  const inputPlazo = document.getElementById('plazo');
  const btnUnidadAnios = document.getElementById('btn-unidad-anios');
  const btnUnidadMeses = document.getElementById('btn-unidad-meses');
  const badgeUnidadPlazo = document.getElementById('badge-unidad-plazo');
  const hintPlazoConversion = document.getElementById('hint-plazo-conversion');

  // Estado de unidad de plazo ('anios' | 'meses')
  let unidadPlazo = 'anios';

  // Amortización anticipada
  const checkAmort = document.getElementById('activar-amortizacion');
  const seccionAmort = document.getElementById('seccion-amortizacion');
  const radiosModalidad = document.getElementsByName('modalidad-amort');
  const selectTipoAmort = document.getElementById('tipo-amort');
  const lblImporteAmort = document.getElementById('lbl-importe-amort');
  const inputImporteAmort = document.getElementById('importe-amort');
  const hintImporteAmort = document.getElementById('hint-importe-amort');
  const alertaCuotaInsuficiente = document.getElementById('alerta-cuota-insuficiente');
  const textoAlertaInsuficiente = document.getElementById('texto-alerta-insuficiente');
  const lblMesAmort = document.getElementById('lbl-mes-amort');
  const inputMesAmort = document.getElementById('mes-amort');
  const mesAmortHint = document.getElementById('mes-amort-hint');
  const inputComisionAmort = document.getElementById('comision-amort');

  // Tarjetas de Resultados
  const resDesembolsoMes = document.getElementById('res-desembolso-mes');
  const badgeDesembolso = document.getElementById('badge-desembolso');
  const resDesembolsoSub = document.getElementById('res-desembolso-sub');

  const resCuotaBanco = document.getElementById('res-cuota-banco');
  const badgeCuotaBanco = document.getElementById('badge-cuota-banco');
  const resCuotaBancoSub = document.getElementById('res-cuota-banco-sub');

  const resIntereses = document.getElementById('res-intereses');
  const resAhorroIntereses = document.getElementById('res-ahorro-intereses');

  const lblDuracionTarjeta = document.getElementById('lbl-duracion-tarjeta');
  const resDuracion = document.getElementById('res-duracion');
  const resDuracionSub = document.getElementById('res-duracion-sub');

  const bannerImpacto = document.getElementById('banner-impacto');
  const bannerImpactoTexto = document.getElementById('banner-impacto-texto');

  // Gráficos y Tabs
  const canvasGrafico = document.getElementById('graficoHipoteca');
  const btnChartCuota = document.getElementById('btn-chart-cuota');
  const btnChartEvolution = document.getElementById('btn-chart-evolution');
  const btnChartDoughnut = document.getElementById('btn-chart-doughnut');
  const tabAnual = document.getElementById('tab-anual');
  const tabMensual = document.getElementById('tab-mensual');
  const cuerpoTabla = document.getElementById('cuerpo-tabla-amortizacion');

  let chartInstance = null;
  let tipoVistaGrafico = 'cuota'; // 'cuota' | 'evolution' | 'doughnut'
  let vistaTabla = 'anual'; // 'anual' | 'mensual'

  const formatoMoneda = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Botón de Compartir y Notificación Toast
  const btnCompartir = document.getElementById('btn-compartir');
  const toast = document.getElementById('toast');
  const toastMensaje = document.getElementById('toast-mensaje');
  let toastTimer = null;

  function mostrarToast(mensaje, duracion = 3000) {
    if (!toast || !toastMensaje) return;
    if (toastTimer) clearTimeout(toastTimer);
    toastMensaje.textContent = mensaje;
    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');
    toastTimer = setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
    }, duracion);
  }

  // Alternador de Modo de Cálculo (Comprar Vivienda vs Préstamo Directo)
  const modoBtnActivo = "px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer";
  const modoBtnInactivo = "px-2.5 py-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer";

  function fijarModoCalculo(nuevoModo) {
    modoCalculo = nuevoModo;
    if (nuevoModo === 'compra') {
      if (btnModoCompra) btnModoCompra.className = modoBtnActivo;
      if (btnModoDirecto) btnModoDirecto.className = modoBtnInactivo;
      if (seccionCompraGastos) seccionCompraGastos.classList.remove('hidden');
      if (seccionModoDirecto) seccionModoDirecto.classList.add('hidden');
    } else {
      modoCalculo = 'directo';
      if (btnModoDirecto) btnModoDirecto.className = modoBtnActivo;
      if (btnModoCompra) btnModoCompra.className = modoBtnInactivo;
      if (seccionCompraGastos) seccionCompraGastos.classList.add('hidden');
      if (seccionModoDirecto) seccionModoDirecto.classList.remove('hidden');
    }
  }

  if (btnModoCompra) {
    btnModoCompra.addEventListener('click', () => {
      fijarModoCalculo('compra');
      calcularYActualizar();
    });
  }

  if (btnModoDirecto) {
    btnModoDirecto.addEventListener('click', () => {
      fijarModoCalculo('directo');
      calcularYActualizar();
    });
  }

  // Estilos de botones rápidos de Financiación (LTV)
  const chipLtvActivo = "text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500 transition-all cursor-pointer";
  const chipLtvInactivo = "text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-indigo-900/40 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all cursor-pointer";

  function actualizarEstiloLtvBtns(ltvActivo) {
    btnsLtv.forEach(btn => {
      const val = parseFloat(btn.getAttribute('data-ltv-btn'));
      btn.className = (val === ltvActivo) ? chipLtvActivo : chipLtvInactivo;
    });
  }

  // Sincronización entre input numérico, slider y botones rápidos de Financiación
  if (inputPctFinanciacion) {
    inputPctFinanciacion.addEventListener('input', () => {
      let val = parseFloat(inputPctFinanciacion.value);
      if (isNaN(val)) val = 80;
      if (sliderFinanciacion) sliderFinanciacion.value = val;
      actualizarEstiloLtvBtns(val);
      calcularYActualizar();
    });
  }

  if (sliderFinanciacion) {
    sliderFinanciacion.addEventListener('input', () => {
      const val = parseFloat(sliderFinanciacion.value) || 80;
      if (inputPctFinanciacion) inputPctFinanciacion.value = val;
      actualizarEstiloLtvBtns(val);
      calcularYActualizar();
    });
  }

  chipsLtvDelta.forEach(btn => {
    btn.addEventListener('click', () => {
      const delta = parseFloat(btn.getAttribute('data-chip-ltv-delta')) || 0;
      let actual = parseFloat(inputPctFinanciacion?.value) || 80;
      let nuevo = Math.min(100, Math.max(5, actual + delta));
      if (inputPctFinanciacion) inputPctFinanciacion.value = nuevo;
      if (sliderFinanciacion) sliderFinanciacion.value = nuevo;
      actualizarEstiloLtvBtns(nuevo);
      calcularYActualizar();
    });
  });

  btnsLtv.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseFloat(btn.getAttribute('data-ltv-btn')) || 80;
      if (inputPctFinanciacion) inputPctFinanciacion.value = val;
      if (sliderFinanciacion) sliderFinanciacion.value = val;
      actualizarEstiloLtvBtns(val);
      calcularYActualizar();
    });
  });

  // Acordeón de Gastos
  if (btnToggleDesgloseGastos && panelDesgloseGastos) {
    btnToggleDesgloseGastos.addEventListener('click', () => {
      const cerrado = panelDesgloseGastos.classList.toggle('hidden');
      if (iconoChevronGastos) {
        iconoChevronGastos.style.transform = cerrado ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });
  }

  // Detección de edición manual de aranceles
  [inputGastoNotaria, inputGastoRegistro].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', () => {
        inp.dataset.autocalc = 'false';
      });
    }
  });

  // Cálculo de gastos e impuestos de compraventa e hipoteca
  function calcularGastosCompra() {
    const precio = parseFloat(inputPrecioInmueble?.value) || 0;
    const ltv = parseFloat(inputPctFinanciacion?.value) || 80;
    const tipoViv = selectTipoVivienda?.value || 'segunda_mano';
    const ccaaKey = selectCCAA?.value || 'madrid';
    const esReducido = checkItpReducido?.checked || false;
    const ccaaInfo = CCAA_IMPUESTOS[ccaaKey] || CCAA_IMPUESTOS.madrid;

    // Actualizar dinámicamente las etiquetas del desplegable CCAA según tipo de vivienda
    actualizarOpcionesCCAA(tipoViv);

    // 1. Porcentaje de impuesto aplicable y visibilidad de opciones
    let pctImpuesto = 0;
    let nombreImpuesto = '';
    if (tipoViv === 'segunda_mano') {
      // Mostrar fila de ITP reducido y ocultar aviso de obra nueva
      if (contenedorItpReducido) contenedorItpReducido.classList.remove('hidden');
      if (contenedorObraNuevaInfo) contenedorObraNuevaInfo.classList.add('hidden');

      const esReducido = checkItpReducido?.checked || false;
      pctImpuesto = esReducido ? ccaaInfo.itpReducido : ccaaInfo.itp;
      const pctStr = pctImpuesto.toFixed(1).replace('.0', '').replace('.', ',');
      nombreImpuesto = esReducido ? `ITP Reducido (${pctStr}%)` : `ITP (${pctStr}%)`;

      if (badgeTipoImpuesto) badgeTipoImpuesto.textContent = `ITP ${pctStr}%`;
    } else {
      // Obra Nueva: NO aplica ITP. Ocultar la opción de ITP por completo
      if (contenedorItpReducido) contenedorItpReducido.classList.add('hidden');
      if (contenedorObraNuevaInfo) contenedorObraNuevaInfo.classList.remove('hidden');

      const esCanarias = ccaaKey === 'canarias';
      const pctIva = esCanarias ? 6.5 : 10.0;
      const nombreIva = esCanarias ? 'IGIC' : 'IVA';
      const pctIajd = ccaaInfo.iajd;
      pctImpuesto = pctIva + pctIajd;

      const pctTotalStr = pctImpuesto.toFixed(2).replace('.00', '').replace('.', ',');
      const pctIvaStr = pctIva.toString().replace('.', ',');
      const iajdStr = pctIajd.toString().replace('.', ',');
      nombreImpuesto = `${nombreIva} + IAJD (${pctTotalStr}%)`;

      if (textoObraNuevaInfo) {
        textoObraNuevaInfo.innerHTML = `En obra nueva <strong>no aplica ITP</strong> (tributa ${nombreIva} ${pctIvaStr}% + IAJD ${iajdStr}%)`;
      }
      if (badgeObraNuevaImpuesto) {
        badgeObraNuevaImpuesto.textContent = `${pctTotalStr}%`;
      }
    }

    if (lblTipoImpuestoCaja) lblTipoImpuestoCaja.textContent = nombreImpuesto;

    // 2. Gastos arancelarios y tasación (auto-cálculo si no están editados a mano)
    let notaria = parseFloat(inputGastoNotaria?.value);
    if (isNaN(notaria) || inputGastoNotaria?.dataset.autocalc === 'true') {
      notaria = Math.round(Math.min(1400, Math.max(650, 600 + (precio * 0.0012))));
      if (inputGastoNotaria) {
        inputGastoNotaria.value = notaria;
        inputGastoNotaria.dataset.autocalc = 'true';
      }
    }

    let registro = parseFloat(inputGastoRegistro?.value);
    if (isNaN(registro) || inputGastoRegistro?.dataset.autocalc === 'true') {
      registro = Math.round(Math.min(750, Math.max(350, 300 + (precio * 0.0006))));
      if (inputGastoRegistro) {
        inputGastoRegistro.value = registro;
        inputGastoRegistro.dataset.autocalc = 'true';
      }
    }

    const gestoria = parseFloat(inputGastoGestoria?.value) || 350;
    const tasacion = parseFloat(inputGastoTasacion?.value) || 350;
    const totalAranceles = notaria + registro + gestoria + tasacion;

    if (badgeTotalAranceles) {
      badgeTotalAranceles.textContent = `(~${formatoMoneda.format(totalAranceles)})`;
    }

    // 3. Importes principales
    const hipoteca = Math.round(precio * (ltv / 100));
    const entrada = Math.max(0, precio - hipoteca);
    const totalImpuestos = Math.round(precio * (pctImpuesto / 100));
    const ahorroTotalNecesario = entrada + totalImpuestos + totalAranceles;

    // 4. Actualizar textos en la UI
    if (badgeEntradaPct) badgeEntradaPct.textContent = `Entrada: ${Math.max(0, Math.round(100 - ltv))}% (${formatoMoneda.format(entrada)})`;
    if (lblEntradaPct) lblEntradaPct.textContent = `${Math.max(0, Math.round(100 - ltv))}%`;
    if (resAhorroTotalCompra) resAhorroTotalCompra.textContent = formatoMoneda.format(ahorroTotalNecesario);
    if (resDesgloseEntrada) resDesgloseEntrada.textContent = formatoMoneda.format(entrada);
    if (resDesgloseImpuestos) resDesgloseImpuestos.textContent = formatoMoneda.format(totalImpuestos);
    if (resDesgloseGastos) resDesgloseGastos.textContent = formatoMoneda.format(totalAranceles);
    if (resImporteHipotecaCompra) resImporteHipotecaCompra.textContent = formatoMoneda.format(hipoteca);

    return {
      precio,
      ltv,
      hipoteca,
      entrada,
      pctImpuesto,
      totalImpuestos,
      totalAranceles,
      ahorroTotalNecesario
    };
  }

  // Alternador de unidad de plazo (Años vs Meses)
  const unidadBtnActivo = "px-2 py-0.5 rounded bg-white dark:bg-slate-800 shadow-xs text-indigo-700 dark:text-indigo-300 font-bold transition-all";
  const unidadBtnInactivo = "px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all";

  function actualizarLabelsChipsPlazo() {
    document.querySelectorAll('[data-chip-plazo-set]').forEach(btn => {
      const anios = btn.getAttribute('data-chip-plazo-set');
      const numSpan = btn.querySelector('.chip-plazo-num');
      const lblSpan = btn.querySelector('.chip-plazo-lbl');
      if (numSpan && lblSpan) {
        if (unidadPlazo === 'meses') {
          numSpan.textContent = parseInt(anios) * 12;
          lblSpan.textContent = 'm';
        } else {
          numSpan.textContent = anios;
          lblSpan.textContent = 'a';
        }
      }
    });
  }

  function fijarUnidadPlazo(nuevaUnidad, convertir = true) {
    if (nuevaUnidad === 'anios') {
      unidadPlazo = 'anios';
      btnUnidadAnios.className = unidadBtnActivo;
      btnUnidadMeses.className = unidadBtnInactivo;
      badgeUnidadPlazo.textContent = "años";
      inputPlazo.max = 50;
      if (convertir) {
        const meses = parseInt(inputPlazo.value) || 300;
        const anios = Math.round(meses / 12);
        inputPlazo.value = anios > 0 ? anios : 1;
      }
    } else {
      unidadPlazo = 'meses';
      btnUnidadMeses.className = unidadBtnActivo;
      btnUnidadAnios.className = unidadBtnInactivo;
      badgeUnidadPlazo.textContent = "meses";
      inputPlazo.max = 600;
      if (convertir) {
        const anios = parseFloat(inputPlazo.value) || 25;
        const meses = Math.round(anios * 12);
        inputPlazo.value = meses > 0 ? meses : 12;
      }
    }
    actualizarLabelsChipsPlazo();
    actualizarHintPlazo();
  }

  btnUnidadAnios.addEventListener('click', () => {
    if (unidadPlazo === 'anios') return;
    fijarUnidadPlazo('anios', true);
    calcularYActualizar();
  });

  btnUnidadMeses.addEventListener('click', () => {
    if (unidadPlazo === 'meses') return;
    fijarUnidadPlazo('meses', true);
    calcularYActualizar();
  });

  function actualizarHintPlazo() {
    const val = parseFloat(inputPlazo.value) || 0;
    if (unidadPlazo === 'anios') {
      const meses = Math.round(val * 12);
      hintPlazoConversion.textContent = `Equivale a ${meses} meses`;
    } else {
      const anios = (val / 12).toFixed(1);
      hintPlazoConversion.textContent = `Equivale a ${anios} años (${formatearTiempo(val)})`;
    }
  }

  inputPlazo.addEventListener('input', () => {
    actualizarHintPlazo();
    calcularYActualizar();
  });

  // Toggle Amortización
  checkAmort.addEventListener('change', () => {
    if (checkAmort.checked) {
      seccionAmort.classList.remove('opacity-40', 'pointer-events-none');
    } else {
      seccionAmort.classList.add('opacity-40', 'pointer-events-none');
    }
    calcularYActualizar();
  });

  // Configuración de modalidad de aportación
  function actualizarTextosTipoAmort() {
    const tipo = selectTipoAmort.value;
    if (tipo === 'pago_fijo') {
      lblImporteAmort.textContent = "Pago Mensual Total Deseado (€)";
      hintImporteAmort.textContent = `Pagas una cantidad fija mensual. Lo que sobre tras cubrir la cuota de la hipoteca se amortiza automáticamente.`;
      lblMesAmort.textContent = "¿A partir de qué mes comenzar el pago fijo?";
    } else if (tipo === 'recurrente') {
      lblImporteAmort.textContent = "Aportación Extra Cada Mes (€)";
      hintImporteAmort.textContent = `Sumarás este importe a tu cuota bancaria ordinaria cada mes.`;
      lblMesAmort.textContent = "¿A partir de qué mes comenzar a aportar?";
    } else {
      // puntual
      lblImporteAmort.textContent = "Importe de la Aportación Única (€)";
      hintImporteAmort.textContent = `Se amortizará este capital una única vez en el mes seleccionado.`;
      lblMesAmort.textContent = "¿En qué mes realizar la aportación?";
    }
  }

  selectTipoAmort.addEventListener('change', () => {
    const tipo = selectTipoAmort.value;
    let capital = 0;
    if (modoCalculo === 'compra') {
      capital = Math.round((parseFloat(inputPrecioInmueble?.value) || 0) * ((parseFloat(inputPctFinanciacion?.value) || 80) / 100));
    } else {
      capital = parseFloat(inputCapital.value) || 0;
    }
    const interesAnual = parseFloat(inputInteres.value) || 0;
    const totalMeses = obtenerTotalMeses();
    const r = (interesAnual / 100) / 12;
    const cuotaBase = calcularCuotaFrancesa(capital, r, totalMeses);

    actualizarTextosTipoAmort();

    if (tipo === 'pago_fijo') {
      if (parseFloat(inputImporteAmort.value) < cuotaBase || !inputImporteAmort.value) {
        const redondeado = Math.ceil(cuotaBase / 100) * 100;
        inputImporteAmort.value = redondeado > cuotaBase ? redondeado : Math.ceil(cuotaBase + 150);
      }
    } else if (tipo === 'recurrente') {
      if (parseFloat(inputImporteAmort.value) > 2000 || !inputImporteAmort.value) {
        inputImporteAmort.value = "200";
      }
    } else {
      // puntual
      if (parseFloat(inputImporteAmort.value) < 1000) {
        inputImporteAmort.value = "10000";
      }
    }

    actualizarHintMes();
    calcularYActualizar();
  });

  function actualizarHintMes() {
    const mes = parseInt(inputMesAmort.value) || 1;
    const anio = Math.floor((mes - 1) / 12) + 1;
    const mesEnAnio = ((mes - 1) % 12) + 1;
    mesAmortHint.textContent = `Año ${anio}, Mes ${mesEnAnio}`;
  }

  inputMesAmort.addEventListener('input', () => {
    actualizarHintMes();
    calcularYActualizar();
  });

  [inputCapital, inputInteres, inputImporteAmort, inputComisionAmort, inputPrecioInmueble, inputGastoNotaria, inputGastoRegistro, inputGastoGestoria, inputGastoTasacion].forEach(input => {
    if (input) input.addEventListener('input', calcularYActualizar);
  });

  [selectTipoVivienda, selectCCAA, checkItpReducido].forEach(input => {
    if (input) input.addEventListener('change', calcularYActualizar);
  });

  Array.from(radiosModalidad).forEach(radio => {
    radio.addEventListener('change', calcularYActualizar);
  });

  // Selector de Tipo de Gráfico (3 pestañas)
  function actualizarEstiloBotonesGrafico() {
    const activo = "px-3 py-1.5 rounded-lg font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 transition-colors";
    const inactivo = "px-3 py-1.5 rounded-lg font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors";

    btnChartCuota.className = tipoVistaGrafico === 'cuota' ? activo : inactivo;
    btnChartEvolution.className = tipoVistaGrafico === 'evolution' ? activo : inactivo;
    btnChartDoughnut.className = tipoVistaGrafico === 'doughnut' ? activo : inactivo;
  }

  btnChartCuota.addEventListener('click', () => {
    tipoVistaGrafico = 'cuota';
    actualizarEstiloBotonesGrafico();
    calcularYActualizar();
  });

  btnChartEvolution.addEventListener('click', () => {
    tipoVistaGrafico = 'evolution';
    actualizarEstiloBotonesGrafico();
    calcularYActualizar();
  });

  btnChartDoughnut.addEventListener('click', () => {
    tipoVistaGrafico = 'doughnut';
    actualizarEstiloBotonesGrafico();
    calcularYActualizar();
  });

  // Selector de Tabla
  const tabBtnActivo = "px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-slate-800 dark:text-white transition-all";
  const tabBtnInactivo = "px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all";

  tabAnual.addEventListener('click', () => {
    vistaTabla = 'anual';
    tabAnual.className = tabBtnActivo;
    tabMensual.className = tabBtnInactivo;
    calcularYActualizar();
  });

  tabMensual.addEventListener('click', () => {
    vistaTabla = 'mensual';
    tabMensual.className = tabBtnActivo;
    tabAnual.className = tabBtnInactivo;
    calcularYActualizar();
  });

  function obtenerTotalMeses() {
    const val = parseFloat(inputPlazo.value) || 0;
    if (unidadPlazo === 'meses') {
      return Math.max(1, Math.round(val));
    } else {
      return Math.max(1, Math.round(val * 12));
    }
  }

  // Fórmula Cuota Francesa
  function calcularCuotaFrancesa(capital, r, n) {
    if (n <= 0) return 0;
    if (r === 0) return capital / n;
    return capital * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  // Motor principal de simulación
  function simularHipoteca({
    capital,
    r,
    totalMeses,
    cuotaInicial,
    conAmortizacion = false,
    modalidad = 'cuota',
    tipoAmort = 'pago_fijo',
    importeAmort = 0,
    mesAmort = 1,
    comisionAmortPct = 0
  }) {
    let saldoPendiente = capital;
    let cuotaActual = cuotaInicial;
    let totalIntereses = 0;
    let totalAmortExtra = 0;
    let totalComisiones = 0;
    let totalPagado = 0;
    const meses = [];

    for (let m = 1; m <= totalMeses; m++) {
      if (saldoPendiente <= 0.005) break;

      const interesMes = saldoPendiente * r;
      let amortizacionCapital = cuotaActual - interesMes;

      if (amortizacionCapital > saldoPendiente) {
        amortizacionCapital = saldoPendiente;
        cuotaActual = interesMes + amortizacionCapital;
      }

      // Amortización anticipada si aplica
      let extra = 0;
      let comisionMes = 0;
      if (conAmortizacion && m >= mesAmort) {
        if (tipoAmort === 'pago_fijo') {
          const pagoObjetivo = importeAmort;
          if (pagoObjetivo > cuotaActual) {
            extra = pagoObjetivo - cuotaActual;
          }
        } else if (tipoAmort === 'recurrente') {
          extra = importeAmort;
        } else if (tipoAmort === 'puntual' && m === mesAmort) {
          extra = importeAmort;
        }

        extra = Math.min(extra, Math.max(0, saldoPendiente - amortizacionCapital));
        if (extra > 0 && comisionAmortPct > 0) {
          comisionMes = extra * (comisionAmortPct / 100);
        }
      }

      const pagoTotalMes = cuotaActual + extra + comisionMes;
      saldoPendiente = Math.max(0, saldoPendiente - amortizacionCapital - extra);
      totalIntereses += interesMes;
      totalAmortExtra += extra;
      totalComisiones += comisionMes;
      totalPagado += pagoTotalMes;

      meses.push({
        mes: m,
        cuotaBanco: cuotaActual,
        extra: extra,
        comision: comisionMes,
        pagoTotal: pagoTotalMes,
        interes: interesMes,
        capitalAmortizado: amortizacionCapital + extra,
        capitalOrd: amortizacionCapital,
        saldoPendiente: saldoPendiente
      });

      // Recálculo si se reduce cuota
      if (conAmortizacion && extra > 0 && modalidad === 'cuota' && saldoPendiente > 0.005) {
        const mesesRestantes = totalMeses - m;
        if (mesesRestantes > 0) {
          cuotaActual = calcularCuotaFrancesa(saldoPendiente, r, mesesRestantes);
        }
      }
    }

    return {
      meses,
      duracionMeses: meses.length,
      totalIntereses,
      totalAmortExtra,
      totalComisiones,
      totalPagado,
      cuotaInicial
    };
  }

  // Formateador de tiempo legible
  function formatearTiempo(mesesTotal) {
    const anios = Math.floor(mesesTotal / 12);
    const meses = mesesTotal % 12;
    if (anios > 0 && meses > 0) {
      return `${anios} año${anios > 1 ? 's' : ''} y ${meses} mes${meses > 1 ? 'es' : ''}`;
    } else if (anios > 0) {
      return `${anios} año${anios > 1 ? 's' : ''}`;
    } else {
      return `${meses} mes${meses > 1 ? 'es' : ''}`;
    }
  }

  // Cálculo general y actualización de UI
  function calcularYActualizar() {
    let capital = 0;
    if (modoCalculo === 'compra') {
      const datosCompra = calcularGastosCompra();
      capital = datosCompra.hipoteca;
      if (inputCapital) inputCapital.value = capital;
    } else {
      capital = parseFloat(inputCapital.value) || 0;
    }

    const interesAnual = parseFloat(inputInteres.value) || 0;
    const totalMeses = obtenerTotalMeses();

    if (capital <= 0 || totalMeses <= 0) return;

    const r = (interesAnual / 100) / 12;
    const cuotaOriginal = calcularCuotaFrancesa(capital, r, totalMeses);

    // Simulación estándar
    const baseSchedule = simularHipoteca({
      capital,
      r,
      totalMeses,
      cuotaInicial: cuotaOriginal,
      conAmortizacion: false
    });

    const tieneAmort = checkAmort.checked;
    let modalidad = 'cuota';
    for (const radio of radiosModalidad) {
      if (radio.checked) modalidad = radio.value;
    }

    const tipoAmort = selectTipoAmort.value;
    const importeAmort = parseFloat(inputImporteAmort.value) || 0;
    const mesAmort = parseInt(inputMesAmort.value) || 1;
    const comisionAmortPct = parseFloat(inputComisionAmort?.value) || 0;

    // Alerta pago fijo
    if (tieneAmort && tipoAmort === 'pago_fijo' && importeAmort < cuotaOriginal) {
      alertaCuotaInsuficiente.classList.remove('hidden');
      textoAlertaInsuficiente.textContent = `Tu cuota inicial es de ${formatoMoneda.format(cuotaOriginal)}. Fija un pago mensual superior a esa cifra para amortizar deuda.`;
    } else {
      alertaCuotaInsuficiente.classList.add('hidden');
    }

    // Simulación amortizada
    const amortSchedule = simularHipoteca({
      capital,
      r,
      totalMeses,
      cuotaInicial: cuotaOriginal,
      conAmortizacion: tieneAmort,
      modalidad,
      tipoAmort,
      importeAmort,
      mesAmort,
      comisionAmortPct
    });

    actualizarTarjetas({
      capital,
      cuotaOriginal,
      tieneAmort,
      modalidad,
      tipoAmort,
      importeAmort,
      mesAmort,
      comisionAmortPct,
      totalMeses,
      baseSchedule,
      amortSchedule
    });

    renderizarGrafico(amortSchedule, baseSchedule, capital, cuotaOriginal);
    renderizarTabla(amortSchedule);
    sincronizarURL();
  }

  // Actualizar tarjetas resumen
  function actualizarTarjetas({
    capital,
    cuotaOriginal,
    tieneAmort,
    modalidad,
    tipoAmort,
    importeAmort,
    mesAmort,
    totalMeses,
    baseSchedule,
    amortSchedule
  }) {
    const textoDuracionBase = formatearTiempo(totalMeses);

    if (!tieneAmort) {
      resDesembolsoMes.textContent = formatoMoneda.format(cuotaOriginal);
      badgeDesembolso.classList.add('hidden');
      resDesembolsoSub.textContent = `Cuota estándar mensual`;

      resCuotaBanco.textContent = formatoMoneda.format(cuotaOriginal);
      badgeCuotaBanco.classList.add('hidden');
      resCuotaBancoSub.textContent = `Fija durante todo el plazo`;

      resIntereses.textContent = formatoMoneda.format(baseSchedule.totalIntereses);
      resAhorroIntereses.textContent = `Coste total por intereses`;

      lblDuracionTarjeta.textContent = 'Duración del Préstamo';
      resDuracion.textContent = textoDuracionBase;
      resDuracionSub.textContent = `${totalMeses} cuotas mensuales`;

      bannerImpacto.classList.add('hidden');
      return;
    }

    const ahorroIntereses = Math.max(0, baseSchedule.totalIntereses - amortSchedule.totalIntereses);
    const mesesAhorrados = Math.max(0, baseSchedule.duracionMeses - amortSchedule.duracionMeses);

    // 1. Desembolso Mensual
    badgeDesembolso.classList.remove('hidden');
    if (tipoAmort === 'pago_fijo') {
      resDesembolsoMes.textContent = formatoMoneda.format(importeAmort);
      const extraInicial = Math.max(0, importeAmort - cuotaOriginal);
      resDesembolsoSub.textContent = `${formatoMoneda.format(cuotaOriginal)} hipoteca + ${formatoMoneda.format(extraInicial)} amortización`;
    } else if (tipoAmort === 'recurrente') {
      const desembolsoTotalInicial = cuotaOriginal + importeAmort;
      resDesembolsoMes.textContent = formatoMoneda.format(desembolsoTotalInicial);
      resDesembolsoSub.textContent = `${formatoMoneda.format(cuotaOriginal)} hipoteca + ${formatoMoneda.format(importeAmort)} extra`;
    } else {
      resDesembolsoMes.textContent = formatoMoneda.format(cuotaOriginal);
      resDesembolsoSub.textContent = `+ Aportación puntual de ${formatoMoneda.format(importeAmort)} en mes ${mesAmort}`;
    }

    // 2. Cuota Banco
    if (modalidad === 'cuota') {
      badgeCuotaBanco.classList.remove('hidden');
      if (tipoAmort === 'puntual') {
        const nuevaCuotaTrasAmort = amortSchedule.meses.length >= mesAmort 
          ? amortSchedule.meses[mesAmort - 1].cuotaBanco 
          : cuotaOriginal;
        resCuotaBanco.textContent = formatoMoneda.format(nuevaCuotaTrasAmort);
        resCuotaBancoSub.textContent = `Antes: ${formatoMoneda.format(cuotaOriginal)} (baja ${formatoMoneda.format(cuotaOriginal - nuevaCuotaTrasAmort)}/mes)`;
      } else {
        const segundaCuota = amortSchedule.meses.length > 1 ? amortSchedule.meses[1].cuotaBanco : cuotaOriginal;
        resCuotaBanco.textContent = `${formatoMoneda.format(segundaCuota)}`;
        resCuotaBancoSub.textContent = `Comienza en ${formatoMoneda.format(cuotaOriginal)} y se reduce mes a mes`;
      }
    } else {
      badgeCuotaBanco.classList.add('hidden');
      resCuotaBanco.textContent = formatoMoneda.format(cuotaOriginal);
      resCuotaBancoSub.textContent = `Se mantiene la cuota contractual fija`;
    }

    // 3. Intereses
    const totalComisiones = amortSchedule.totalComisiones || 0;
    const ahorroNeto = Math.max(0, ahorroIntereses - totalComisiones);

    resIntereses.textContent = formatoMoneda.format(amortSchedule.totalIntereses);
    if (totalComisiones > 0) {
      resAhorroIntereses.innerHTML = `<span class="text-emerald-600 font-bold">Ahorro neto: ${formatoMoneda.format(ahorroNeto)}</span> <span class="text-slate-400 text-[11px] block sm:inline">(${formatoMoneda.format(ahorroIntereses)} ahorro - ${formatoMoneda.format(totalComisiones)} comisiones)</span>`;
    } else {
      resAhorroIntereses.innerHTML = `<span class="text-emerald-600 font-bold">Ahorras ${formatoMoneda.format(ahorroIntereses)}</span> en intereses`;
    }

    // 4. Duración
    const duracionRealTexto = formatearTiempo(amortSchedule.duracionMeses);
    resDuracion.textContent = duracionRealTexto;
    if (mesesAhorrados > 0) {
      lblDuracionTarjeta.textContent = "Plazo Reducido";
      resDuracionSub.innerHTML = `<span class="text-emerald-600 font-bold">¡Te ahorras ${formatearTiempo(mesesAhorrados)} (${mesesAhorrados} meses)!</span>`;
    } else {
      lblDuracionTarjeta.textContent = "Duración";
      resDuracionSub.textContent = `Plazo completo mantenido`;
    }

    // Banner
    bannerImpacto.classList.remove('hidden');
    let explicacionBanner = "";
    const textoAhorro = totalComisiones > 0
      ? `un <strong>ahorro neto de ${formatoMoneda.format(ahorroNeto)}</strong> (ahorro de ${formatoMoneda.format(ahorroIntereses)} en intereses menos ${formatoMoneda.format(totalComisiones)} en comisiones)`
      : `<strong>${formatoMoneda.format(ahorroIntereses)}</strong> en intereses`;

    if (tipoAmort === 'pago_fijo') {
      const extraMes1 = Math.max(0, importeAmort - cuotaOriginal);
      if (modalidad === 'plazo') {
        explicacionBanner = `Fijando un pago mensual constante de <strong>${formatoMoneda.format(importeAmort)}</strong> (amortizando <strong>${formatoMoneda.format(extraMes1)} extra</strong> al mes), liquidarás tu hipoteca en solo <strong>${duracionRealTexto}</strong> (<strong>${formatearTiempo(mesesAhorrados)} antes</strong>) y obtendrás ${textoAhorro}.`;
      } else {
        explicacionBanner = `Fijando un pago de <strong>${formatoMoneda.format(importeAmort)}</strong> y reduciendo cuota, la cuota del banco bajará cada mes para darte tranquilidad, y manteniendo tu aportación terminarás en <strong>${duracionRealTexto}</strong>, obteniendo ${textoAhorro}.`;
      }
    } else if (tipoAmort === 'recurrente') {
      if (modalidad === 'plazo') {
        explicacionBanner = `Aportando <strong>${formatoMoneda.format(importeAmort)} extra</strong> cada mes, terminarás tu hipoteca <strong>${formatearTiempo(mesesAhorrados)} antes</strong> (en <strong>${duracionRealTexto}</strong>) y obtendrás ${textoAhorro}.`;
      } else {
        explicacionBanner = `Aportando <strong>${formatoMoneda.format(importeAmort)} extra</strong> al mes y reduciendo cuota, tu cuota mensual obligatoria irá disminuyendo progresivamente y obtendrás ${textoAhorro}.`;
      }
    } else {
      if (modalidad === 'plazo') {
        explicacionBanner = `Con una aportación puntual de <strong>${formatoMoneda.format(importeAmort)}</strong> en el mes ${mesAmort}, terminarás tu hipoteca <strong>${formatearTiempo(mesesAhorrados)} antes</strong> y obtendrás ${textoAhorro}.`;
      } else {
        explicacionBanner = `Con una aportación puntual de <strong>${formatoMoneda.format(importeAmort)}</strong> en el mes ${mesAmort}, tu cuota mensual bajará a <strong>${formatoMoneda.format(amortSchedule.meses[mesAmort - 1]?.cuotaBanco || 0)}</strong> (obtendrás ${textoAhorro}).`;
      }
    }

    bannerImpactoTexto.innerHTML = explicacionBanner;
  }

  // Gráficos con Chart.js
  function renderizarGrafico(schedule, baseSchedule, capital, cuotaOriginal) {
    if (!canvasGrafico) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = canvasGrafico.getContext('2d');
    const esDark = document.documentElement.classList.contains('dark');
    const colorTexto = esDark ? '#cbd5e1' : '#64748b';
    const colorGrid = esDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

    if (tipoVistaGrafico === 'cuota') {
      // Gráfica de Cuota Mensual a lo largo del tiempo
      const maxMeses = Math.max(baseSchedule.duracionMeses, schedule.duracionMeses);
      const numAnios = Math.ceil(maxMeses / 12);
      const labels = [];
      const dataCuotaBanco = [];
      const dataExtra = [];
      const dataCuotaOriginal = [];

      for (let y = 1; y <= numAnios; y++) {
        labels.push(`Año ${y}`);
        
        // Muestra de mitad de año o promedio de ese año
        const mesIdx = (y - 1) * 12 + 5; // mes 6 de ese año
        const mesVal = Math.min(mesIdx, maxMeses - 1);

        // Cuota Original
        if (mesVal < baseSchedule.meses.length) {
          dataCuotaOriginal.push(baseSchedule.meses[mesVal].cuotaBanco);
        } else {
          dataCuotaOriginal.push(0);
        }

        // Con Amortización
        if (mesVal < schedule.meses.length) {
          dataCuotaBanco.push(schedule.meses[mesVal].cuotaBanco);
          dataExtra.push(schedule.meses[mesVal].extra);
        } else {
          dataCuotaBanco.push(0);
          dataExtra.push(0);
        }
      }

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              type: 'line',
              label: 'Cuota Original Sin Amortizar',
              data: dataCuotaOriginal,
              borderColor: esDark ? '#94a3b8' : '#64748b',
              borderDash: [5, 5],
              borderWidth: 2,
              pointRadius: 0,
              fill: false,
              order: 1
            },
            {
              label: 'Cuota Banco',
              data: dataCuotaBanco,
              backgroundColor: '#4f46e5',
              stack: 'desembolso',
              borderRadius: 4,
              order: 2
            },
            {
              label: 'Aportación Extra Mensual',
              data: dataExtra,
              backgroundColor: '#10b981',
              stack: 'desembolso',
              borderRadius: 4,
              order: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
              ticks: { color: colorTexto },
              grid: { color: colorGrid }
            },
            y: {
              stacked: true,
              ticks: {
                color: colorTexto,
                callback: (val) => `${val.toFixed(0)} €`
              },
              grid: { color: colorGrid }
            }
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 14,
                padding: 16,
                color: colorTexto,
                font: { family: 'Inter', size: 12, weight: 500 }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return ` ${context.dataset.label}: ${formatoMoneda.format(context.raw)}`;
                },
                footer: function(tooltipItems) {
                  let total = 0;
                  tooltipItems.forEach(item => {
                    if (item.dataset.stack === 'desembolso') {
                      total += item.raw;
                    }
                  });
                  return total > 0 ? `Desembolso Total: ${formatoMoneda.format(total)}` : '';
                }
              }
            }
          }
        }
      });

    } else if (tipoVistaGrafico === 'evolution') {
      // Evolución de la deuda pendiente
      const numAnios = Math.ceil(baseSchedule.duracionMeses / 12);
      const labels = [];
      const dataAmort = [];
      const dataBase = [];

      for (let y = 0; y <= numAnios; y++) {
        labels.push(`Año ${y}`);
        if (y === 0) {
          dataAmort.push(capital);
          dataBase.push(capital);
        } else {
          const idxMes = y * 12 - 1;
          if (idxMes < schedule.meses.length) {
            dataAmort.push(schedule.meses[idxMes].saldoPendiente);
          } else {
            dataAmort.push(0);
          }
          if (idxMes < baseSchedule.meses.length) {
            dataBase.push(baseSchedule.meses[idxMes].saldoPendiente);
          } else {
            dataBase.push(0);
          }
        }
      }

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Hipoteca con Amortización',
              data: dataAmort,
              borderColor: '#10b981',
              backgroundColor: esDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.12)',
              fill: true,
              tension: 0.25,
              borderWidth: 2.5
            },
            {
              label: 'Hipoteca Original',
              data: dataBase,
              borderColor: esDark ? '#64748b' : '#94a3b8',
              borderDash: [5, 5],
              fill: false,
              tension: 0.25,
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: { color: colorTexto },
              grid: { color: colorGrid }
            },
            y: {
              ticks: {
                color: colorTexto,
                callback: (val) => `${(val / 1000).toFixed(0)}k €`
              },
              grid: { color: colorGrid }
            }
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 14,
                padding: 16,
                color: colorTexto,
                font: { family: 'Inter', size: 12, weight: 500 }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return ` ${context.dataset.label}: ${formatoMoneda.format(context.raw)}`;
                }
              }
            }
          }
        }
      });

    } else {
      // Gráfica de Distribución Doughnut
      const ahorroIntereses = Math.max(0, baseSchedule.totalIntereses - schedule.totalIntereses);
      const labels = ['Capital Prestado', 'Intereses a Pagar'];
      const data = [capital, schedule.totalIntereses];
      const backgroundColors = ['#4f46e5', '#f59e0b'];

      if (checkAmort.checked && ahorroIntereses > 10) {
        labels.push('Intereses Ahorrados');
        data.push(ahorroIntereses);
        backgroundColors.push('#10b981');
      }

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColors,
            borderWidth: 2,
            borderColor: esDark ? '#1e293b' : '#ffffff',
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 14,
                padding: 16,
                color: colorTexto,
                font: { family: 'Inter', size: 12, weight: 500 }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const val = context.raw;
                  return ` ${context.label}: ${formatoMoneda.format(val)}`;
                }
              }
            }
          },
          cutout: '68%'
        }
      });
    }
  }

  // Tabla de Amortización
  function renderizarTabla(schedule) {
    cuerpoTabla.innerHTML = '';
    const meses = schedule.meses;
    if (!meses || meses.length === 0) return;

    if (vistaTabla === 'anual') {
      const anios = {};

      meses.forEach(item => {
        const anio = Math.floor((item.mes - 1) / 12) + 1;
        if (!anios[anio]) {
          anios[anio] = {
            anio,
            totalCuotaBanco: 0,
            totalExtra: 0,
            totalPagado: 0,
            totalInteres: 0,
            totalAmortizado: 0,
            saldoFinal: item.saldoPendiente
          };
        }
        anios[anio].totalCuotaBanco += item.cuotaBanco;
        anios[anio].totalExtra += item.extra;
        anios[anio].totalPagado += item.pagoTotal;
        anios[anio].totalInteres += item.interes;
        anios[anio].totalAmortizado += item.capitalAmortizado;
        anios[anio].saldoFinal = item.saldoPendiente;
      });

      Object.values(anios).forEach(a => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors';
        tr.innerHTML = `
          <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">Año ${a.anio}</td>
          <td class="py-3 px-4 text-right font-medium text-slate-700 dark:text-slate-300">${formatoMoneda.format(a.totalCuotaBanco)}</td>
          <td class="py-3 px-4 text-right ${a.totalExtra > 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-slate-500'}">${a.totalExtra > 0 ? formatoMoneda.format(a.totalExtra) : '-'}</td>
          <td class="py-3 px-4 text-right font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-700/30">${formatoMoneda.format(a.totalPagado)}</td>
          <td class="py-3 px-4 text-right text-amber-600 dark:text-amber-400 font-medium">${formatoMoneda.format(a.totalInteres)}</td>
          <td class="py-3 px-4 text-right text-indigo-600 dark:text-indigo-400 font-medium">${formatoMoneda.format(a.totalAmortizado)}</td>
          <td class="py-3 px-4 text-right font-bold text-slate-800 dark:text-slate-200">${formatoMoneda.format(a.saldoFinal)}</td>
        `;
        cuerpoTabla.appendChild(tr);
      });

    } else {
      meses.forEach(m => {
        const tr = document.createElement('tr');
        tr.className = `hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors ${m.extra > 0 ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''}`;
        tr.innerHTML = `
          <td class="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">Mes ${m.mes}</td>
          <td class="py-2.5 px-4 text-right font-medium text-slate-700 dark:text-slate-300">${formatoMoneda.format(m.cuotaBanco)}</td>
          <td class="py-2.5 px-4 text-right ${m.extra > 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-slate-500'}">${m.extra > 0 ? formatoMoneda.format(m.extra) : '-'}</td>
          <td class="py-2.5 px-4 text-right font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-700/30">${formatoMoneda.format(m.pagoTotal)}</td>
          <td class="py-2.5 px-4 text-right text-amber-600 dark:text-amber-400 font-medium">${formatoMoneda.format(m.interes)}</td>
          <td class="py-2.5 px-4 text-right text-indigo-600 dark:text-indigo-400 font-medium">${formatoMoneda.format(m.capitalAmortizado)}</td>
          <td class="py-2.5 px-4 text-right font-bold text-slate-800 dark:text-slate-200">${formatoMoneda.format(m.saldoPendiente)}</td>
        `;
        cuerpoTabla.appendChild(tr);
      });
    }
  }

  // Sincronización de parámetros en la URL (Deep Linking)
  function sincronizarURL() {
    const params = new URLSearchParams();

    params.set('modo', modoCalculo);
    if (modoCalculo === 'compra') {
      if (inputPrecioInmueble?.value) params.set('precio', inputPrecioInmueble.value);
      if (inputPctFinanciacion?.value) params.set('ltv', inputPctFinanciacion.value);
      if (selectTipoVivienda?.value) params.set('viv', selectTipoVivienda.value);
      if (selectCCAA?.value) params.set('ccaa', selectCCAA.value);
      if (selectTipoVivienda?.value === 'segunda_mano' && checkItpReducido?.checked) params.set('red', '1');
    } else {
      if (inputCapital?.value) params.set('capital', inputCapital.value);
    }

    if (inputInteres.value) params.set('interes', inputInteres.value);
    if (inputPlazo.value) params.set('plazo', inputPlazo.value);
    if (unidadPlazo === 'meses') params.set('unidad', 'meses');

    if (checkAmort.checked) {
      params.set('amort', '1');
      let modalidad = 'cuota';
      for (const radio of radiosModalidad) {
        if (radio.checked) modalidad = radio.value;
      }
      params.set('mod', modalidad);
      params.set('tipo', selectTipoAmort.value);
      if (inputImporteAmort.value) params.set('extra', inputImporteAmort.value);
      if (inputMesAmort.value) params.set('mes', inputMesAmort.value);
      if (inputComisionAmort && parseFloat(inputComisionAmort.value) > 0) {
        params.set('comision', inputComisionAmort.value);
      }
    }

    const query = params.toString();
    const nuevaURL = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, '', nuevaURL);
  }

  function cargarDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('capital') && !params.has('interes') && !params.has('plazo') && !params.has('precio') && !params.has('modo')) return false;

    if (params.has('modo')) {
      const m = params.get('modo');
      fijarModoCalculo(m === 'directo' ? 'directo' : 'compra');
    } else if (params.has('capital') && !params.has('precio')) {
      fijarModoCalculo('directo');
    } else {
      fijarModoCalculo('compra');
    }

    if (params.has('precio') && inputPrecioInmueble) {
      const pr = parseFloat(params.get('precio'));
      if (!isNaN(pr) && pr > 0) inputPrecioInmueble.value = pr;
    }
    if (params.has('ltv') && inputPctFinanciacion) {
      const l = parseFloat(params.get('ltv'));
      if (!isNaN(l) && l > 0) {
        inputPctFinanciacion.value = l;
        if (sliderFinanciacion) sliderFinanciacion.value = l;
        actualizarEstiloLtvBtns(l);
      }
    }
    if (params.has('viv') && selectTipoVivienda) {
      const v = params.get('viv');
      if (['segunda_mano', 'obra_nueva'].includes(v)) selectTipoVivienda.value = v;
    }
    if (params.has('ccaa') && selectCCAA) {
      const c = params.get('ccaa');
      if (CCAA_IMPUESTOS[c]) selectCCAA.value = c;
    }
    if (params.has('red') && checkItpReducido) {
      checkItpReducido.checked = (params.get('red') === '1' || params.get('red') === 'true');
    }

    if (params.has('capital')) {
      const c = parseFloat(params.get('capital'));
      if (!isNaN(c) && c > 0) inputCapital.value = c;
    }
    if (params.has('interes')) {
      const i = parseFloat(params.get('interes'));
      if (!isNaN(i) && i >= 0) inputInteres.value = i;
    }
    if (params.has('unidad')) {
      const u = params.get('unidad');
      fijarUnidadPlazo(u === 'meses' ? 'meses' : 'anios', false);
    }
    if (params.has('plazo')) {
      const p = parseFloat(params.get('plazo'));
      if (!isNaN(p) && p > 0) inputPlazo.value = p;
    }
    if (params.has('amort')) {
      const amortActivo = params.get('amort') === '1' || params.get('amort') === 'true';
      checkAmort.checked = amortActivo;
      if (amortActivo) {
        seccionAmort.classList.remove('opacity-40', 'pointer-events-none');
      } else {
        seccionAmort.classList.add('opacity-40', 'pointer-events-none');
      }
    }
    if (params.has('mod')) {
      const m = params.get('mod');
      for (const radio of radiosModalidad) {
        radio.checked = (radio.value === m);
      }
    }
    if (params.has('tipo')) {
      const t = params.get('tipo');
      if (['pago_fijo', 'recurrente', 'puntual'].includes(t)) {
        selectTipoAmort.value = t;
        actualizarTextosTipoAmort();
      }
    }
    if (params.has('extra')) {
      const e = parseFloat(params.get('extra'));
      if (!isNaN(e) && e >= 0) inputImporteAmort.value = e;
    }
    if (params.has('mes')) {
      const m = parseInt(params.get('mes'));
      if (!isNaN(m) && m >= 1) inputMesAmort.value = m;
    }
    if (params.has('comision') && inputComisionAmort) {
      const com = parseFloat(params.get('comision'));
      if (!isNaN(com) && com >= 0) inputComisionAmort.value = com;
    }
    return true;
  }

  // Evento del botón Compartir
  if (btnCompartir) {
    btnCompartir.addEventListener('click', async () => {
      sincronizarURL();
      const url = window.location.href;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
          mostrarToast('¡Enlace con tu simulación copiado!');
        } else {
          const inputTemp = document.createElement('textarea');
          inputTemp.value = url;
          inputTemp.style.position = 'fixed';
          inputTemp.style.left = '-9999px';
          document.body.appendChild(inputTemp);
          inputTemp.focus();
          inputTemp.select();
          document.execCommand('copy');
          document.body.removeChild(inputTemp);
          mostrarToast('¡Enlace con tu simulación copiado!');
        }
      } catch (err) {
        mostrarToast('Copia el enlace desde la barra del navegador');
      }
    });
  }

  // Alternador de Modo Oscuro / Claro
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  let bloqueadorTema = false;

  function alternarTema() {
    if (bloqueadorTema) return;
    bloqueadorTema = true;
    setTimeout(() => { bloqueadorTema = false; }, 250);

    const esOscuro = document.documentElement.classList.toggle('dark');
    if (document.body) {
      document.body.classList.toggle('dark', esOscuro);
    }
    try {
      localStorage.setItem('hipocalc_theme', esOscuro ? 'dark' : 'light');
    } catch (e) {}
    // Volver a dibujar gráfico para actualizar colores de ejes, grids y leyenda al nuevo contraste
    calcularYActualizar();
  }
  window.alternarTema = alternarTema;
  window.calcularYActualizar = calcularYActualizar;

  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', alternarTema);
  }

  // Botones de ajuste rápido (Chips)
  function inicializarChips() {
    // Chips de Precio Inmueble Delta (-10k, +10k)
    document.querySelectorAll('[data-chip-precio-delta]').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseFloat(btn.getAttribute('data-chip-precio-delta')) || 0;
        const actual = parseFloat(inputPrecioInmueble?.value) || 0;
        const nuevo = Math.max(10000, actual + delta);
        if (inputPrecioInmueble) inputPrecioInmueble.value = nuevo;
        calcularYActualizar();
      });
    });

    // Chips de Precio Inmueble Fijo (150k, 200k, 250k, 300k, 400k)
    document.querySelectorAll('[data-chip-precio-set]').forEach(btn => {
      btn.addEventListener('click', () => {
        const valor = parseFloat(btn.getAttribute('data-chip-precio-set')) || 0;
        if (valor > 0) {
          if (inputPrecioInmueble) inputPrecioInmueble.value = valor;
          calcularYActualizar();
        }
      });
    });

    // Chips de Capital Delta (-10k, +10k)
    document.querySelectorAll('[data-chip-cap-delta]').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseFloat(btn.getAttribute('data-chip-cap-delta')) || 0;
        const actual = parseFloat(inputCapital.value) || 0;
        const nuevo = Math.max(1000, actual + delta);
        inputCapital.value = nuevo;
        calcularYActualizar();
      });
    });

    // Chips de Capital Fijo (100k, 150k, 200k, etc.)
    document.querySelectorAll('[data-chip-cap-set]').forEach(btn => {
      btn.addEventListener('click', () => {
        const valor = parseFloat(btn.getAttribute('data-chip-cap-set')) || 0;
        if (valor > 0) {
          inputCapital.value = valor;
          calcularYActualizar();
        }
      });
    });

    // Chips de Interés Fijo (2.0%, 2.5%, 3.0%, 3.5%)
    document.querySelectorAll('[data-chip-int-set]').forEach(btn => {
      btn.addEventListener('click', () => {
        const valor = parseFloat(btn.getAttribute('data-chip-int-set')) || 0;
        if (valor > 0) {
          inputInteres.value = valor;
          calcularYActualizar();
        }
      });
    });

    // Chips de Plazo Fijo (15, 20, 25, 30 años o meses según unidadPlazo)
    document.querySelectorAll('[data-chip-plazo-set]').forEach(btn => {
      btn.addEventListener('click', () => {
        const anios = parseFloat(btn.getAttribute('data-chip-plazo-set')) || 0;
        if (anios > 0) {
          inputPlazo.value = unidadPlazo === 'meses' ? anios * 12 : anios;
          actualizarHintPlazo();
          calcularYActualizar();
        }
      });
    });

    // Chips de Amortización Extra (+50€, +100€, +200€, +500€)
    document.querySelectorAll('[data-chip-amort-delta]').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseFloat(btn.getAttribute('data-chip-amort-delta')) || 0;
        const actual = parseFloat(inputImporteAmort.value) || 0;
        const nuevo = Math.max(0, actual + delta);
        inputImporteAmort.value = nuevo;
        calcularYActualizar();
      });
    });
  }

  // Inicializar estado (primero comprobar si hay datos en la URL)
  cargarDesdeURL();
  actualizarHintPlazo();
  actualizarHintMes();
  actualizarEstiloBotonesGrafico();
  inicializarChips();
  calcularYActualizar();
});
