/* ============================================================
   TECHSUPPORT PRO — JAVASCRIPT v2
   · Loader de entrada
   · TOROMAX AI — chatbot con API de Anthropic (IA real)
   · Mejoras de animaciones y micro-interacciones
   ============================================================ */

// ============ LOADER DE ENTRADA (solo una vez por sesión) ============
const loaderMessages = [
  'Inicializando sistema...',
  'Cargando módulos de soporte...',
  'Activando TOROMAX AI...',
  'Sistema listo ✓',
];
const loaderBar    = document.getElementById('loader-bar');
const loaderStatus = document.getElementById('loader-status');
const pageLoader   = document.getElementById('page-loader');

if (sessionStorage.getItem('loaderShown')) {
  // Ya se mostró antes en esta sesión — ocultar inmediatamente
  pageLoader.classList.add('hidden');
} else {
  // Primera visita — mostrar loader y marcar como visto
  sessionStorage.setItem('loaderShown', '1');
  let loadPct = 0;
  const loadInterval = setInterval(() => {
    loadPct += Math.random() * 15 + 6;
    if (loadPct > 100) loadPct = 100;
    loaderBar.style.width = loadPct + '%';
    const idx = Math.min(Math.floor((loadPct / 100) * loaderMessages.length), loaderMessages.length - 1);
    loaderStatus.textContent = loaderMessages[idx];
    if (loadPct >= 100) {
      clearInterval(loadInterval);
      setTimeout(() => pageLoader.classList.add('hidden'), 500);
    }
  }, 100);
}

// ============ CURSOR PERSONALIZADO ============
const cursor = document.querySelector('.cursor');
const trail  = document.querySelector('.cursor-trail');
let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  trail.style.left = trailX + 'px';
  trail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll('a, button, input, select, textarea, .service-card, .team-member, .price-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '20px';
    cursor.style.height = '20px';
    cursor.style.background = 'rgba(0,255,136,0.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '12px';
    cursor.style.height = '12px';
    cursor.style.background = 'var(--neon-green)';
  });
});

// ============ NAVBAR SCROLL ============
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ============ HAMBURGER MENU ============
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.style.display === 'flex';
  navLinks.style.display     = isOpen ? 'none' : 'flex';
  navLinks.style.flexDirection  = 'column';
  navLinks.style.position    = 'absolute';
  navLinks.style.top         = '70px';
  navLinks.style.right       = '0';
  navLinks.style.background  = 'rgba(5,8,16,0.97)';
  navLinks.style.padding     = '24px 32px';
  navLinks.style.border      = '1px solid rgba(0,255,136,0.15)';
  navLinks.style.borderRadius = '0 0 12px 12px';
  navLinks.style.backdropFilter = 'blur(16px)';
});

// ============ PARTÍCULAS CANVAS ============
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
});

const particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4,
    size: Math.random() * 2 + .5,
    color: Math.random() < .5 ? 'rgba(0,255,136,' : 'rgba(0,200,255,',
    alpha: Math.random() * .5 + .1,
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0)  p.x = canvas.width;
    if (p.x > canvas.width)  p.x = 0;
    if (p.y < 0)  p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q  = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(0,255,136,${.06 * (1 - dist/100)})`;
        ctx.lineWidth = .5;
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ============ TERMINAL ANIMADA ============
const termLines = [
  { text: '$ Iniciando diagnóstico del sistema...', cls: '' },
  { text: '> Verificando memoria RAM... OK', cls: 'success' },
  { text: '> Analizando disco duro... OK', cls: 'success' },
  { text: '> Buscando amenazas... OK', cls: 'success' },
  { text: '> Archivos temporales: 2.4 GB encontrados', cls: 'warn' },
  { text: '> Actualizaciones pendientes: 5', cls: 'warn' },
  { text: '> Temperatura CPU: 68°C (Normal)', cls: 'info' },
  { text: '> TOROMAX AI: Recomendación lista', cls: 'info' },
  { text: '$ Diagnóstico completado ✓', cls: 'success' },
  { text: '_', cls: '' },
];

const termBody = document.getElementById('terminal-body');
let lineIndex  = 0;

function addTermLine() {
  if (lineIndex < termLines.length) {
    const line = termLines[lineIndex];
    const el   = document.createElement('p');
    el.className = 't-line ' + line.cls;
    if (line.text !== '_') {
      el.textContent = line.text;
    } else {
      el.innerHTML = '<span class="t-prompt">█</span>';
      el.style.animation = 'blink 1s step-end infinite';
    }
    termBody.appendChild(el);
    termBody.scrollTop = termBody.scrollHeight;
    lineIndex++;
    if (lineIndex < termLines.length) {
      setTimeout(addTermLine, 600 + Math.random() * 400);
    } else {
      setTimeout(() => {
        termBody.innerHTML = '';
        lineIndex = 0;
        setTimeout(addTermLine, 1200);
      }, 3000);
    }
  }
}
setTimeout(addTermLine, 800);

// ============ CONTADOR ESTADÍSTICAS ============
function animateCount(el, target) {
  let current = 0;
  const step  = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 25);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.stat-number').forEach(el => {
        animateCount(el, parseInt(el.dataset.target));
      });
      statObserver.disconnect();
    }
  });
}, { threshold: .5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statObserver.observe(statsEl);

// ============ SCROLL REVEAL ============
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: .12 });

document.querySelectorAll('.services-grid .service-card').forEach((el, index) => {
  el.classList.add('reveal', `delay-${(index % 3) + 1}`);
  revealObserver.observe(el);
});
document.querySelectorAll('.section-header, .price-card, .team-member, .contact-item, .value-item, .faq-item').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ============ FAQ ACORDEÓN ============
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.parentElement;
    const isOpen = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isOpen) item.classList.add('active');
  });
});

// ============ FORMULARIO CONTACTO ============
function submitForm() {
  const loader  = document.getElementById('btn-loader');
  const btnText = document.getElementById('btn-text');
  loader.style.display = 'inline-block';
  btnText.textContent  = 'ENVIANDO...';
  setTimeout(() => {
    loader.style.display = 'none';
    btnText.textContent  = '✓ MENSAJE ENVIADO';
    document.querySelector('.btn-submit').style.background = '#00c853';
    setTimeout(() => {
      btnText.textContent = 'ENVIAR SOLICITUD ⚡';
      document.querySelector('.btn-submit').style.background = '';
    }, 3000);
  }, 1800);
}

// ============================================================
//  TOROMAX AI — CHATBOT CON INTELIGENCIA ARTIFICIAL REAL
//  API: Anthropic claude-sonnet-4-20250514
//  Sistema experto en soporte técnico + info del sitio
// ============================================================

const TOROMAX_SYSTEM = `Eres TOROMAX AI, el asistente inteligente de TechSupport Pro, empresa de soporte técnico especializado en Morelia, Michoacán, México.

=== SOBRE LA EMPRESA ===
TechSupport Pro ofrece soporte técnico remoto y presencial para computadoras (laptops, desktops, all-in-one, cualquier marca).
Marcas atendidas: HP, Dell, Lenovo, Asus, Acer, Mac, Samsung, cualquier ensamble o genérico.
Sistemas operativos: Windows (todas las versiones), Linux (Ubuntu, Mint, etc), macOS.
Horario: Lunes a Sábado 9:00am – 8:00pm.
Ubicación: Morelia, Michoacán, México.
WhatsApp/Teléfono: +52 (443) 000-0000
Correo: contacto@techsupport.mx

=== QUÉ ES EL SOPORTE REMOTO ===
El soporte remoto es cuando nuestros técnicos se conectan a tu computadora a través de internet usando software especializado (como AnyDesk o TeamViewer), con tu permiso. Tú puedes ver en pantalla todo lo que hacemos en tiempo real. Solo necesitas tener internet. Puedes desconectarnos en cualquier momento. Es completamente seguro porque solo iniciamos sesión cuando tú lo autorizas expresamente. Ideal para problemas de software, virus, optimización, instalación de programas. No requiere que salgas de casa.

=== QUÉ ES EL SOPORTE PRESENCIAL ===
El soporte presencial es cuando uno de nuestros técnicos va físicamente a tu domicilio o negocio en Morelia, o puedes llevar tu equipo. Se usa para problemas de hardware como limpieza interna de polvo, cambio de pasta térmica, reparación de piezas físicas, formateo completo, instalación de componentes (RAM, disco duro, etc). Requiere coordinar una cita y tiene cobertura en Morelia y área metropolitana.

=== SERVICIOS PREVENTIVOS (REMOTO) ===
1. Limpieza de Archivos Temporales: Eliminación de caché, archivos basura, carpetas temp que acumulan GB de espacio. Mejora velocidad y libera almacenamiento.
2. Instalación y Revisión de Antivirus: Instalamos antivirus premium (ESET, Kaspersky, Malwarebytes, etc), configuramos protección en tiempo real, escaneamos amenazas existentes.
3. Respaldo de Archivos en la Nube: Configuramos Google Drive, OneDrive o Dropbox para respaldo automático de documentos, fotos y datos importantes.
4. Limpieza Física y Lógica Completa: Combinación de limpieza presencial del hardware (polvo, ventiladores, pasta térmica) más optimización lógica del sistema.

=== SERVICIOS CORRECTIVOS (REMOTO + PRESENCIAL) ===
4. Eliminación de Virus o Malware: Detección y eliminación profunda de virus, troyanos, ransomware, spyware, adware. Incluye aislamiento de archivos infectados y restauración del sistema.
5. Recuperación de Archivos Eliminados: Usando herramientas forenses de software intentamos recuperar fotos, documentos, videos borrados accidentalmente o perdidos por formateo. IMPORTANTE: No manipules más el disco si quieres recuperar archivos.
6. Formateo de Máquinas: Instalación limpia del sistema operativo (Windows 10/11 o Linux), drivers oficiales, programas básicos, configuración de seguridad. Incluye respaldo previo de datos.

=== PLANES Y PRECIOS ===
- Plan Preventivo Básico: $150 MXN — REMOTO. Incluye: limpieza de archivos temporales, revisión de antivirus, optimización de arranque, informe digital del estado. NO incluye recuperación de archivos ni formateo.
- Plan Soporte Completo: $350 MXN — REMOTO + PRESENCIAL. Incluye: todo el básico + instalación de antivirus premium + respaldo en nube + eliminación de virus/malware + limpieza física del equipo.
- Plan Premium Todo Incluido: $600 MXN — TODO. Incluye: todo lo anterior + recuperación de archivos eliminados + formateo e instalación de SO + configuración de drivers + soporte post-servicio 7 días + garantía de satisfacción.
- Diagnóstico inicial: COMPLETAMENTE GRATIS.
- Los precios pueden variar según la complejidad del problema.
- El pago se realiza AL FINALIZAR el servicio, una vez que verificas que todo funciona.
- Métodos de pago: efectivo, transferencia bancaria, CoDi, Mercado Pago.

=== PREGUNTAS FRECUENTES ===
- ¿Es seguro el acceso remoto? Sí, 100%. Solo con tu autorización, puedes ver todo en tiempo real y desconectar cuando quieras.
- ¿Cuánto tarda un servicio? Limpieza de temporales: ~30 min. Eliminación de virus: 1-2 horas. Formateo: 2-4 horas.
- ¿Pueden perder mis datos? Siempre hacemos respaldo previo en servicios de riesgo. En formateo es respaldo obligatorio.
- ¿Tienen garantía? Sí. Si el problema regresa, volvemos sin costo adicional. El Plan Premium incluye 7 días de soporte post-servicio.
- ¿Trabajan con Mac? Sí, aunque algunos servicios tienen alcance limitado en macOS.

=== TU PERSONALIDAD ===
Eres amigable, directo y hablas en español mexicano casual. Usas emojis con moderación. Tus respuestas son concisas (máximo 4 oraciones) pero completas y útiles. Siempre ofreces una siguiente acción (agendar cita, contactar por WhatsApp, ver precios). Si no sabes algo, lo dices honestamente y derivas al WhatsApp. No inventas información.`;

let chatOpen    = false;
let chatHistory = [];

function openChat() {
  document.getElementById('chatbot-fab').style.display = 'none';
  document.getElementById('chatbot').classList.add('open');
  chatOpen = true;
}
function toggleChat() {
  document.getElementById('chatbot').classList.remove('open');
  document.getElementById('chatbot-fab').style.display = 'flex';
  chatOpen = false;
}
function sendQuick(text) {
  document.getElementById('chat-input').value = text;
  sendMessage();
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';

  appendMessage('user', text);
  chatHistory.push({ role: 'user', content: text });

  const typingId = appendTyping();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: TOROMAX_SYSTEM,
        messages: chatHistory,
      }),
    });

    const data = await response.json();
    removeTyping(typingId);

    if (data.content && data.content[0] && data.content[0].type === 'text') {
      const reply = data.content[0].text;
      chatHistory.push({ role: 'assistant', content: reply });
      appendMessage('bot', reply, true);
    } else {
      throw new Error('No content');
    }
  } catch (err) {
    removeTyping(typingId);
    const fallback = fallbackResponse(text.toLowerCase());
    chatHistory.push({ role: 'assistant', content: fallback });
    appendMessage('bot', fallback, false);
  }
}

// Respuestas de respaldo si la API no responde
function fallbackResponse(msg) {
  if (msg.includes('remoto'))
    return 'El soporte remoto es cuando nuestros técnicos se conectan a tu equipo por internet con tu permiso. Puedes ver todo en tiempo real y desconectar cuando quieras. Solo necesitas internet. 🖥️';
  if (msg.includes('presencial'))
    return 'El soporte presencial es cuando un técnico va a tu domicilio en Morelia, o traes tu equipo. Se usa para limpieza de hardware, formateos y problemas físicos. ¿Quieres agendar una visita? 🔧';
  if (msg.includes('virus') || msg.includes('malware') || msg.includes('infectada'))
    return 'Para virus o malware hacemos limpieza profunda con aislamiento de tus archivos. El Plan Soporte Completo cuesta $350 MXN e incluye esto. ¿Agendamos? 🛡️';
  if (msg.includes('lenta') || msg.includes('traba') || msg.includes('lento'))
    return 'Si tu PC está lenta, nuestro Plan Básico ($150 MXN) incluye limpieza de archivos basura y optimización de arranque. Se nota el cambio inmediatamente. ⚡';
  if (msg.includes('recuperar') || msg.includes('borre') || msg.includes('perdi'))
    return '¡No muevas nada más del disco! Podemos intentar recuperar tus archivos con herramientas especializadas. Este servicio está en el Plan Premium ($600 MXN). 💾';
  if (msg.includes('format') || msg.includes('windows') || msg.includes('reinstal'))
    return 'El formateo incluye instalación limpia de Windows o Linux, drivers y configuración básica por $600 MXN con respaldo garantizado previo. 💿';
  if (msg.includes('precio') || msg.includes('costo') || msg.includes('cuanto'))
    return 'Tenemos 3 planes: Básico $150 MXN, Soporte Completo $350 MXN y Premium $600 MXN todo incluido. Diagnóstico GRATIS. Pago al finalizar. 💰';
  if (msg.includes('hola') || msg.includes('buenos') || msg.includes('buenas'))
    return '¡Hola! Soy TOROMAX AI 🐂 ¿Qué problema tiene tu equipo hoy?';
  if (msg.includes('horario') || msg.includes('hora') || msg.includes('cuando'))
    return 'Atendemos Lunes a Sábado de 9:00am a 8:00pm. Puedes contactarnos por WhatsApp al +52 (443) 000-0000. 🕐';
  if (msg.includes('pago') || msg.includes('pagar') || msg.includes('efectivo'))
    return 'Aceptamos efectivo, transferencia bancaria, CoDi y Mercado Pago. El pago es al finalizar el servicio, cuando verificas que todo funciona correctamente. ✅';
  if (msg.includes('garantia') || msg.includes('garantía'))
    return 'Sí, todos nuestros servicios tienen garantía. Si el problema regresa, volvemos sin costo extra. El Plan Premium incluye 7 días de soporte post-servicio. 🛡️';
  return 'Para darte un diagnóstico preciso necesito más detalles. ¿Puedes describirme qué le pasa a tu equipo? O contáctanos directo al WhatsApp +52 (443) 000-0000. ⚡';
}

function appendMessage(role, text, isAI = false) {
  const msgs = document.getElementById('chat-messages');
  const div  = document.createElement('div');
  div.className = role === 'bot' ? 'bot-message' : 'user-message';

  const bullSVG = `<svg viewBox="0 0 30 26" width="24" height="20">
    <path d="M5 7 Q2 4 0 1 Q4 3 6 6" fill="#00ff88"/>
    <path d="M25 7 Q28 4 30 1 Q26 3 24 6" fill="#00ff88"/>
    <ellipse cx="15" cy="15" rx="11" ry="10" fill="#050810"/>
    <circle cx="10" cy="12" r="3.5" fill="#00ff88"/>
    <circle cx="20" cy="12" r="3.5" fill="#00ff88"/>
    <circle cx="10.5" cy="11.5" r="1.5" fill="#050810"/>
    <circle cx="20.5" cy="11.5" r="1.5" fill="#050810"/>
  </svg>`;

  if (role === 'bot') {
    div.innerHTML = `
      <span class="msg-avatar toromax-small-av">${bullSVG}</span>
      <div>
        ${isAI ? '<div class="ai-response-badge">⚡ TOROMAX AI</div>' : ''}
        <div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>
      </div>`;
  } else {
    div.innerHTML = `
      <div class="msg-bubble">${text}</div>
      <span class="msg-avatar">👤</span>`;
  }

  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function appendTyping() {
  const msgs = document.getElementById('chat-messages');
  const id   = 'typing-' + Date.now();
  const div  = document.createElement('div');
  div.id = id;
  div.className = 'bot-message typing-indicator';

  const bullSVG = `<svg viewBox="0 0 30 26" width="24" height="20">
    <path d="M5 7 Q2 4 0 1 Q4 3 6 6" fill="#00ff88"/>
    <path d="M25 7 Q28 4 30 1 Q26 3 24 6" fill="#00ff88"/>
    <ellipse cx="15" cy="15" rx="11" ry="10" fill="#050810"/>
    <circle cx="10" cy="12" r="3.5" fill="#00ff88"/>
    <circle cx="20" cy="12" r="3.5" fill="#00ff88"/>
    <circle cx="10.5" cy="11.5" r="1.5" fill="#050810"/>
    <circle cx="20.5" cy="11.5" r="1.5" fill="#050810"/>
  </svg>`;

  div.innerHTML = `
    <span class="msg-avatar toromax-small-av">${bullSVG}</span>
    <div class="msg-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    if (window.innerWidth < 768) navLinks.style.display = 'none';
  });
});

// ============ GLITCH LOGO ============
document.querySelector('.nav-logo')?.addEventListener('mouseenter', function() {
  this.style.animation = 'glitch .3s ease';
  setTimeout(() => this.style.animation = '', 300);
});

// ============ SCANLINE ============
const scanline = document.createElement('div');
scanline.style.cssText = `
  position:fixed;top:-2px;left:0;width:100%;height:2px;
  background:linear-gradient(transparent,rgba(0,255,136,0.08),transparent);
  z-index:9997;pointer-events:none;
  animation:scanline 8s linear infinite;
`;
document.head.insertAdjacentHTML('beforeend', `<style>@keyframes scanline{0%{top:-2px}100%{top:calc(100vh+2px)}}</style>`);
document.body.appendChild(scanline);

console.log('%cTECHSUPPORT PRO', 'color:#00ff88;font-family:monospace;font-size:24px;font-weight:900;text-shadow:0 0 10px #00ff88');
console.log('%c// TOROMAX AI activa ✓', 'color:#00c8ff;font-family:monospace');