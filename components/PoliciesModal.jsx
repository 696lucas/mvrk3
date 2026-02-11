"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  {
    id: "cookies",
    label: "Política de cookies",
    content: (
      <>
        <p>La presente Política de cookies forma parte de la Política de privacidad del Sitio Web www.mvrk.es.</p>
        <h4>1. ¿Qué son las cookies?</h4>
        <p>
          Las cookies son pequeños archivos de texto que se almacenan en el dispositivo del usuario cuando visita determinadas páginas web. Permiten recordar
          acciones y preferencias para no tener que configurarlas de nuevo al navegar.
        </p>
        <h4>2. Tipos de cookies utilizadas</h4>
        <p>En el Sitio Web se pueden utilizar:</p>
        <ul>
          <li><strong>Cookies técnicas o necesarias:</strong> imprescindibles para el funcionamiento (carrito, pago, inicio de sesión). No requieren consentimiento.</li>
          <li><strong>Cookies de preferencias o personalización:</strong> recuerdan idioma u otras opciones de acceso.</li>
          <li><strong>Cookies de análisis o medición:</strong> cuantifican usuarios y uso del sitio para mejorar productos y servicios.</li>
          <li><strong>Cookies de publicidad comportamental:</strong> elaboran perfiles de navegación para mostrar publicidad según esos perfiles.</li>
        </ul>
        <p>
          [Aquí debes detallar qué cookies/servicios usas realmente: p.ej., Google Analytics, píxel de Facebook/Instagram, etc. Cada app de Shopify suele
          aportar su propia descripción y tabla de cookies.]
        </p>
        <h4>3. Gestión del consentimiento</h4>
        <p>
          Al entrar por primera vez se muestra un banner o panel para aceptar todas las cookies, rechazar las no necesarias o configurarlas por categorías. El
          usuario puede modificar sus preferencias en cualquier momento desde ese panel o desde su navegador.
        </p>
        <h4>4. Cómo desactivar o eliminar cookies desde el navegador</h4>
        <p>
          Se pueden permitir, bloquear o eliminar cookies desde la configuración del navegador (Chrome, Firefox, Safari, Edge, etc.). Consulta la ayuda oficial de
          cada navegador.
        </p>
        <h4>5. Actualización de la Política de cookies</h4>
        <p>
          Esta política puede modificarse por cambios legales o por cambios en el uso de cookies. Revisa la política periódicamente.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    label: "Política de privacidad",
    content: (
      <>
        <p>En cumplimiento del RGPD y la LOPDGDD se informa sobre el tratamiento de datos personales.</p>
        <h4>1. Responsable del tratamiento</h4>
        <p>
          Responsable: www.mvrk.es · Email de contacto: <a href="mailto:shop@mvrk.es">shop@mvrk.es</a>
        </p>
        <h4>2. Datos personales que tratamos</h4>
        <ul>
          <li>Identificativos: nombre, apellidos.</li>
          <li>Contacto: dirección postal, email.</li>
          <li>Transacción: productos adquiridos, importe, número de pedido, método de pago (los datos de tarjeta los gestiona la pasarela; el Responsable no accede a ellos).</li>
          <li>Navegación: IP, dispositivo, navegador, páginas visitadas, tiempo de permanencia (cookies).</li>
        </ul>
        <h4>3. Finalidades del tratamiento</h4>
        <ul>
          <li>Gestionar compras: pedidos, cobros, envíos, devoluciones y atención al cliente.</li>
          <li>Atender consultas, solicitudes e incidencias enviadas al email de contacto.</li>
          <li>Cumplir obligaciones legales (fiscal, contable, consumo, etc.).</li>
          <li>Enviar comunicaciones comerciales sobre Mvrk y su merchandising cuando el usuario lo haya autorizado expresamente (newsletter, casilla de consentimiento).</li>
          <li>Analizar el uso del Sitio Web mediante herramientas estadísticas para mejorar la experiencia (según cookies aceptadas).</li>
        </ul>
        <h4>4. Legitimación</h4>
        <ul>
          <li>Ejecución de un contrato de compraventa o medidas precontractuales (art. 6.1.b RGPD).</li>
          <li>Cumplimiento de obligaciones legales (art. 6.1.c RGPD).</li>
          <li>Consentimiento para comunicaciones comerciales y cookies no técnicas (art. 6.1.a RGPD).</li>
          <li>Interés legítimo en mejorar el servicio y la experiencia (art. 6.1.f RGPD) dentro de los límites normativos.</li>
        </ul>
        <h4>5. Destinatarios de los datos</h4>
        <p>
          No se cederán datos a terceros salvo obligación legal. Para prestar el servicio puede ser necesario compartir datos con proveedores tecnológicos y de
          hosting, plataformas de e-commerce y pago (Shopify), transporte y logística, y proveedores de analítica/marketing según la Política de cookies y el
          consentimiento prestado. Se firmarán contratos de encargo de tratamiento cuando proceda.
        </p>
        <h4>6. Transferencias internacionales</h4>
        <p>
          Si se usan servicios que impliquen transferencias internacionales (p.ej., herramientas de Shopify, analítica o email marketing), se adoptarán garantías
          adecuadas (cláusulas contractuales tipo, decisiones de adecuación, etc.).
        </p>
        <h4>7. Plazos de conservación</h4>
        <ul>
          <li>Datos de clientes: mientras exista relación contractual y, después, durante los plazos legales (fiscal/contable).</li>
          <li>Comerciales: hasta que el usuario revoque su consentimiento o solicite supresión.</li>
          <li>Navegación: según los plazos indicados en la Política de cookies.</li>
        </ul>
        <h4>8. Derechos de los usuarios</h4>
        <p>
          Acceso, rectificación, supresión, oposición, limitación y portabilidad. Para ejercerlos, escribir a <a href="mailto:shop@mvrk.es">shop@mvrk.es</a> indicando el derecho y adjuntando documento identificativo. Se puede reclamar ante la AEPD (<a href="https://www.aepd.es" target="_blank" rel="noreferrer">www.aepd.es</a>).
        </p>
        <h4>9. Seguridad de los datos</h4>
        <p>www.mvrk.es ha adoptado medidas técnicas y organizativas para garantizar confidencialidad, integridad y disponibilidad de los datos.</p>
        <h4>10. Menores de edad</h4>
        <p>Las compras están dirigidas a mayores de 18 años. Si se detectan datos de menores sin consentimiento, se suprimirán de inmediato.</p>
        <h4>11. Actualización</h4>
        <p>La política podrá modificarse por cambios legales o en el tratamiento; se anunciará en el Sitio Web.</p>
      </>
    ),
  },
  {
    id: "terms",
    label: "Condiciones de contratación",
    content: (
      <>
        <p>Las siguientes Condiciones Generales regulan la compra de merchandising del artista Mvrk en https://shop.mvrk.es (el “Sitio Web”).</p>
        <h4>1. Identidad del vendedor</h4>
        <p>Vendedor: www.mvrk.es · Email de atención al cliente: <a href="mailto:shop@mvrk.es">shop@mvrk.es</a></p>
        <h4>2. Aceptación de las condiciones</h4>
        <p>Al realizar un pedido se aceptan íntegramente estas Condiciones al marcar la casilla correspondiente durante la compra.</p>
        <h4>3. Proceso de compra</h4>
        <ol>
          <li>Seleccionar productos (talla, color, unidades) y añadir al carrito.</li>
          <li>Revisar resumen con productos, cantidades, precio total, impuestos y gastos de envío.</li>
          <li>Facilitar datos de envío/facturación y elegir método de pago.</li>
          <li>Confirmar pago; se mostrará y enviará confirmación al email facilitado.</li>
        </ol>
        <p>El Vendedor puede rechazar pedidos por datos incompletos, indicios de fraude, falta de stock u otras causas justificadas; se notificará y, si procede, se reembolsará.</p>
        <h4>4. Precios e impuestos</h4>
        <ul>
          <li>Precios en euros (EUR), impuestos incluidos salvo indicación en contrario.</li>
          <li>Gastos de envío se muestran durante la compra y se añaden antes de confirmar.</li>
          <li>Los productos se facturan según tarifas vigentes al momento de la compra.</li>
        </ul>
        <h4>5. Métodos de pago</h4>
        <p>Pago con tarjeta de crédito o débito mediante pasarelas seguras integradas en Shopify. El Vendedor no accede a los datos bancarios completos.</p>
        <h4>6. Envíos</h4>
        <ul>
          <li>Zonas de envío: toda España.</li>
          <li>Plazo estimado: 3 a 5 días laborables desde la confirmación (salvo incidencias).</li>
          <li>Empresa de transporte: DHL.</li>
          <li>Coste estándar: 5 € por pedido (salvo promociones o condiciones especiales).</li>
          <li>Si el paquete se devuelve por causa imputable al cliente, los costes del nuevo envío serán asumidos por el cliente.</li>
        </ul>
        <h4>7. Disponibilidad de productos</h4>
        <p>Todos los pedidos están sujetos a disponibilidad. Si falta stock tras el pedido, se informará y se ofrecerá esperar reposición, cambiar producto o reembolsar.</p>
        <h4>8. Derecho de desistimiento (14 días)</h4>
        <p>
          14 días naturales desde la recepción para desistir. Comunicar por email a <a href="mailto:shop@mvrk.es">shop@mvrk.es</a> indicando número de pedido, contacto y productos a devolver. Enviar los productos sin usar, sin lavar, con embalaje y etiquetado original. Los gastos de devolución se gestionan caso por caso; contactar previamente para condiciones. Reembolso con el mismo método de pago, en máximo 30 días desde la recepción y comprobación.
        </p>
        <h4>9. Exclusiones del derecho de desistimiento</h4>
        <p>No se aceptan devoluciones de productos usados, lavados, sin embalaje/etiquetas, en mal estado por causa del cliente, o cualquier excepción legal. Sin perjuicio de devoluciones por producto defectuoso o error en el envío.</p>
        <h4>10. Productos defectuosos o error en el envío</h4>
        <p>
          Contactar con <a href="mailto:shop@mvrk.es">shop@mvrk.es</a> adjuntando fotos y descripción. Se ofrecerá sustitución, vale o reembolso. En estos casos, los gastos de devolución y, en su caso, nuevo envío, los asume el Vendedor.
        </p>
        <h4>11. Cambios de talla</h4>
        <p>
          14 días desde la recepción. Prenda sin usar ni lavar, con etiquetas y embalaje original. Las condiciones concretas (costes, gestión) se confirman por email. Contactar indicando pedido, modelo, talla recibida y talla deseada.
        </p>
        <h4>12. Atención al cliente y reclamaciones</h4>
        <p>Email: <a href="mailto:shop@mvrk.es">shop@mvrk.es</a></p>
        <h4>13. Legislación aplicable y jurisdicción</h4>
        <p>Legislación española. Para conflictos, Juzgados y Tribunales de Madrid salvo fuero imperativo de consumidores.</p>
      </>
    ),
  },
  {
    id: "legal",
    label: "Aviso legal",
    content: (
      <>
        <p>
          En cumplimiento de la LSSI-CE se informa que el Sitio Web https://shop.mvrk.es es titularidad de www.mvrk.es. Correo de contacto: <a href="mailto:shop@mvrk.es">shop@mvrk.es</a>.
        </p>
        <p>El acceso y uso del Sitio Web implica la aceptación plena de este Aviso Legal.</p>
        <h4>1. Propiedad intelectual e industrial</h4>
        <p>
          Todos los contenidos (textos, fotografías, gráficos, logotipos, imágenes, diseño, código fuente, merchandising y elementos asociados a la marca y al artista Mvrk) son propiedad de www.mvrk.es o de terceros autorizantes, protegidos por la normativa de propiedad intelectual e industrial. Queda prohibida su reproducción, distribución, comunicación pública o transformación sin autorización expresa.
        </p>
        <h4>2. Enlaces</h4>
        <p>Los enlaces a sitios de terceros son ajenos a www.mvrk.es, que no ejerce control ni asume responsabilidad sobre sus contenidos.</p>
        <h4>3. Limitación de responsabilidad</h4>
        <p>www.mvrk.es no garantiza la disponibilidad y continuidad del Sitio Web y excluye responsabilidad por daños derivados de su falta de disponibilidad.</p>
        <h4>4. Legislación aplicable y jurisdicción</h4>
        <p>Se aplicará la legislación española. Las partes se someten a los Juzgados y Tribunales de Madrid, salvo fuero imperativo de consumidores.</p>
      </>
    ),
  },
];

export default function PoliciesModal() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState("cookies");

  useEffect(() => {
    // CSS inyectado
    const css =
      ".pb-policy-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(5px);z-index:999995;display:none;}" +
      ".pb-policy-overlay.is-open{display:block;}" +
      ".pb-policy-modal{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(96vw,900px);max-height:min(92vh,900px);overflow:hidden;background:#0d0d0d;color:#fff;border-radius:16px;border:1px solid rgba(255,255,255,.08);box-shadow:0 30px 80px rgba(0,0,0,.65);}" +
      ".pb-policy-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.08);gap:12px;}" +
      ".pb-policy-title{margin:0;font:800 17px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;letter-spacing:.01em;}" +
      ".pb-policy-tabs{display:flex;flex-wrap:wrap;gap:8px;}" +
      ".pb-policy-tab{appearance:none;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.06);color:#fff;padding:8px 12px;border-radius:10px;font:700 12px/1.2 system-ui;text-transform:uppercase;letter-spacing:.04em;cursor:pointer;transition:all .15s ease;}" +
      ".pb-policy-tab:hover,.pb-policy-tab:focus-visible{border-color:rgba(255,255,255,.22);}" +
      ".pb-policy-tab.active{background:#eae400;color:#111;border-color:#eae400;}" +
      ".pb-policy-close{appearance:none;border:0;background:transparent;color:#fff;font:800 18px/1 system-ui;cursor:pointer;padding:6px 8px;border-radius:8px;}" +
      ".pb-policy-body{padding:16px;overflow-y:auto;max-height:calc(92vh - 72px);scrollbar-width:thin;scrollbar-color:#555 transparent;}" +
      ".pb-policy-body::-webkit-scrollbar{width:10px;} .pb-policy-body::-webkit-scrollbar-thumb{background:#3a3a3a;border-radius:10px;} .pb-policy-body::-webkit-scrollbar-track{background:transparent;}" +
      ".pb-policy-body h4{margin:18px 0 8px;font:800 15px/1.25 system-ui;text-transform:uppercase;letter-spacing:.02em;}" +
      ".pb-policy-body p{margin:8px 0;font:500 14px/1.5 system-ui;color:#e7e7e7;}" +
      ".pb-policy-body ul,.pb-policy-body ol{margin:8px 0 12px 18px;padding:0;color:#e7e7e7;font:500 14px/1.45 system-ui;}" +
      ".pb-policy-body li{margin:4px 0;}" +
      ".pb-policy-body a{color:#eae400;text-decoration:none;} .pb-policy-body a:hover{text-decoration:underline;}" +
      "@media(max-width:600px){.pb-policy-modal{width:94vw;max-height:92vh;} .pb-policy-header{flex-direction:column;align-items:flex-start;} .pb-policy-tabs{width:100%;} .pb-policy-tab{flex:1;} .pb-policy-body{max-height:calc(92vh - 120px);} }";
    const style = document.createElement("style");
    style.setAttribute("data-pb-policy", "");
    style.textContent = css;
    document.head.appendChild(style);

    const links = Array.from(document.querySelectorAll('a[href="/shipping"], .pb-footer-link[href="/shipping"]'));
    const onClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    };
    links.forEach((a) => a.addEventListener("click", onClick, { passive: false }));

    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);

    return () => {
      links.forEach((a) => a.removeEventListener("click", onClick));
      window.removeEventListener("keydown", onEsc);
      style.remove();
    };
  }, []);

  if (!open) return <div className="pb-policy-overlay" />;

  const active = SECTIONS.find((s) => s.id === section) || SECTIONS[0];

  return (
    <div className={"pb-policy-overlay " + (open ? "is-open" : "")} onClick={() => setOpen(false)}>
      <div
        className="pb-policy-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Políticas"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pb-policy-header">
          <div className="pb-policy-title">Políticas y condiciones</div>
          <div className="pb-policy-tabs" role="tablist">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                className={"pb-policy-tab " + (s.id === active.id ? "active" : "")}
                onClick={() => setSection(s.id)}
                role="tab"
                aria-selected={s.id === active.id}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button className="pb-policy-close" onClick={() => setOpen(false)} aria-label="Cerrar">
            ×
          </button>
        </div>
        <div className="pb-policy-body" role="document">
          {active.content}
        </div>
      </div>
    </div>
  );
}
