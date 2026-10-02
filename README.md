# HipoCalc - Calculadora de Hipotecas y Amortizaciones

Aplicación web interactiva y ligera para el cálculo de cuotas de hipotecas bajo el **sistema de amortización francés**, con simulador completo de **amortizaciones anticipadas** (reducción de cuota o de plazo).

## 🚀 Características y Modalidades

- **Selector Flexible de Plazo (Años o Meses)**:
  - Permite introducir el plazo restante en **años** o en **meses** (ideal si ya llevas tiempo con tu hipoteca o para cálculos con meses exactos).
  - Conversión instantánea bidireccional con indicación textual de equivalencia.
- **Simulador de Amortización Anticipada con 3 Estrategias**:
  1. ⭐ **Complementar hasta una cantidad fija mensual (Tope mensual)**:
     - Permite fijar un desembolso fijo al mes (ej: 1.000 €).
     - Se paga la cuota del banco y la diferencia hasta el tope se amortiza automáticamente.
  2. **Aportación extra mensual fija (+X €/mes)**:
     - Suma un importe adicional fijo todos los meses por encima de la cuota bancaria ordinaria.
  3. **Aportación puntual única**:
     - Realiza una aportación extraordinaria de capital en un mes concreto.
- **Estrategias al Amortizar**:
  - **Reducir Cuota**: Mantiene la duración pactada y recalcula la cuota del banco a la baja.
  - **Reducir Plazo**: Mantiene la cuota mensual y calcula exactamente el tiempo que se ahorra (años y meses) y los intereses no pagados.
- **Gráficos Interactivos con Chart.js (3 Vistas)**:
  1. **Cuota Mensual**: Gráfica de barras apiladas que muestra la cuota que cobra el banco, la amortización extra mensual y una línea de referencia con la cuota original, visualizando claramente cuándo y cómo baja el pago o se extingue anticipadamente.
  2. **Evolución de Deuda**: Curva temporal de capital pendiente comparando el préstamo original frente al amortizado.
  3. **Distribución Capital/Interés**: Gráfico tipo donut con desglose de capital, intereses a pagar e intereses ahorrados.
- **Métricas Transparentes en 4 Tarjetas Clave**:
  - **Desembolso Mensual Total**: Lo que efectivamente pagas cada mes.
  - **Cuota Obligatoria Banco**: El recibo contractual exigido por la entidad bancaria.
  - **Total Intereses**: Coste de financiación y ahorro exacto conseguido.
  - **Duración Real / Plazo Ahorrado**: Años y meses reales hasta la extinción de la deuda.
- **Cuadro de Amortización Detallado**:
  - Resumen año a año y desglose mes a mes con columnas: Cuota Banco, Amort. Extra, Total Pagado, Intereses, Capital Amortizado y Saldo Pendiente.
- **Deep Linking y Compartir Simulación**:
  - Sincronización en tiempo real de todos los parámetros en la URL (`?capital=...&interes=...&plazo=...`).
  - Botón **Compartir** con copiado al portapapeles y notificación *toast* para enviar o guardar cualquier simulación exacta sin perder los datos.
- **Preparado para Producción Web (SEO y Favicon)**:
  - Favicon SVG moderno de alta resolución integrado.
  - Metadatos Open Graph y Twitter Cards para vistas previas atractivas al compartir en WhatsApp, Telegram o redes sociales.
- **Modo Oscuro Completo (Dark Mode)**:
  - Soporte nativo para modo oscuro con selector en cabecera (icono sol/luna).
  - Detección automática de la preferencia del sistema operativo (`prefers-color-scheme`).
  - Persistencia de la elección del usuario en `localStorage`.
  - Adaptación dinámica de las paletas de colores en los gráficos Chart.js (líneas guía, tipografías y contrastes de datos).
- **Botones de Ajuste Rápido (Chips Táctiles para Móviles)**:
  - Botones de 1 toque bajo cada campo para simular rápidamente sin necesidad de teclear:
    - **Capital**: `±10k €`, o valores directos `100k`, `150k`, `200k`, `250k`, `300k`.
    - **Interés**: `2.0%`, `2.5%`, `3.0%`, `3.5%`.
    - **Plazo**: `15`, `20`, `25`, `30` (se adapta automáticamente a años `a` o meses `m` según la unidad activa).
    - **Amortización extra**: `+50 €`, `+100 €`, `+200 €`, `+500 €`.
- **Rigor Financiero y Compensación Bancaria**:
  - Parámetro para introducir la **comisión por amortización anticipada** (% de compensación por reembolso del banco, según la Ley 5/2019 de crédito inmobiliario).
  - Cálculo del **ahorro neto real** descontando el coste de comisiones cobradas por el banco.
- **Aviso Legal y Disclaimer Financiero**:
  - Descargo de responsabilidad detallado en el pie de página aclarando el carácter informativo/orientativo de las simulaciones y la variabilidad según condiciones contractuales bancarias.

---

## 🌐 Despliegue en GitHub Pages (Sin compilación ni servidores)

Al ser una aplicación 100% estática (HTML, CSS vía Tailwind CDN, Vanilla JS y Chart.js), no requiere Node.js ni procesos de `build`.

### Pasos para publicar en GitHub Pages:

1. **Crear repositorio en GitHub**:
   - Crea un repositorio nuevo en GitHub (público o privado), por ejemplo `calculadora-hipoteca`.

2. **Subir los archivos**:
   ```bash
   git init
   git add .
   git commit -m "feat: HipoCalc v1.0 con modo oscuro y deep linking"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/calculadora-hipoteca.git
   git push -u origin main
   ```

3. **Activar GitHub Pages**:
   - En tu repositorio de GitHub, entra en **Settings** > **Pages**.
   - En **Source**, selecciona **Deploy from a branch**.
   - Selecciona la rama **`main`** y la carpeta **`/ (root)`**.
   - Pulsa **Save**.

En unos segundos tu calculadora estará disponible públicamente en:
`https://TU_USUARIO.github.io/calculadora-hipoteca/`

---

## 🛠️ Tecnologías Utilizadas

- **HTML5 Semántico & Accesible**.
- **Tailwind CSS (CDN)**: Diseño responsive, utility-first y tema oscuro con selector de clase.
- **Vanilla JavaScript (ES6+)**: Sistema de cálculo financiero preciso, sincronización URL y estado reactivo.
- **Chart.js**: Renderizado canvas optimizado y reactivo a temas claro/oscuro.
- **Lucide Icons**: Iconografía moderna y nítida.

