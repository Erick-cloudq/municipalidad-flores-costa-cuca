/* Sitio estático: no envía formularios ni recopila datos personales. */
(() => {
  'use strict';
  const data = window.FLORES_DATA;
  if (!data) return;
  const $ = (selector) => document.querySelector(selector);
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const normalize = (value) => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const sourceLink = (source) => `<a class="source-link" href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.label)}${source.pages ? ` · ${escape(source.pages)}` : ''}</a>`;
  let selectedYear = data.timeline.findIndex((item) => item.id === '1900');
  if (selectedYear < 0) selectedYear = 0;

  function renderTimeline() {
    $('#timeline-tabs').innerHTML = data.timeline.map((item, i) => `<button class="timeline-tab" role="tab" id="era-${i}" aria-controls="timeline-detail" aria-selected="${i === selectedYear}" tabindex="${i === selectedYear ? '0' : '-1'}" data-index="${i}"><span>${escape(item.shortLabel)}</span><strong>${escape(item.year)}</strong></button>`).join('');
    const item = data.timeline[selectedYear];
    $('#timeline-detail').setAttribute('aria-labelledby', `era-${selectedYear}`);
    $('#timeline-detail').innerHTML = `<div class="year" aria-hidden="true">${escape(item.year)}</div><p class="era">${escape(item.dateLabel)}</p><h3>${escape(item.title)}</h3>${item.paragraphs.map((text) => `<p>${escape(text)}</p>`).join('')}<div>${item.sources.slice(0, 2).map(sourceLink).join('<br>')}</div>`;
  }
  $('#timeline-tabs').addEventListener('click', (event) => {
    const tab = event.target.closest('[data-index]');
    if (!tab) return;
    selectedYear = Number(tab.dataset.index);
    renderTimeline();
    $(`#era-${selectedYear}`).focus({preventScroll:true});
  });
  $('#timeline-tabs').addEventListener('keydown', (event) => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    selectedYear = event.key === 'Home' ? 0 : event.key === 'End' ? data.timeline.length - 1 : (selectedYear + (event.key === 'ArrowRight' ? 1 : -1) + data.timeline.length) % data.timeline.length;
    renderTimeline();
    $(`#era-${selectedYear}`).focus({preventScroll:true});
    $(`#era-${selectedYear}`).scrollIntoView({block:'nearest',inline:'nearest'});
  });

  function renderMayors() {
    const query = normalize($('#mayor-search').value);
    const filter = $('#period-filter').value;
    const [start, end] = filter === 'all' ? [0, 9999] : filter.split('-').map(Number);
    const matches = data.mayors.filter((mayor) => normalize(mayor.name).includes(query) && (filter === 'all' || mayor.years.some((year) => year >= start && year <= end) || mayor.periods.some((period) => period.startYear <= end && period.endYear >= start)));
    $('#results-count').textContent = `${matches.length} de ${data.mayors.length} alcaldes documentados`;
    $('#empty-state').hidden = matches.length !== 0;
    $('#mayor-grid').innerHTML = matches.map((mayor) => `<article class="mayor-card ${mayor.featured ? 'featured' : ''}"><div class="mayor-top"><span class="initials" aria-hidden="true">${escape(mayor.initials)}</span><span class="mayor-badge">${escape(mayor.badge)}</span></div><h3>${escape(mayor.name)}</h3><p class="periods">${escape(mayor.periodLabel)}</p><p class="brief">${escape(mayor.brief)}</p><button data-mayor="${escape(mayor.id)}" aria-label="Ver ficha y fuentes de ${escape(mayor.name)}">Ver ficha y fuentes</button></article>`).join('');
  }
  $('#mayor-search').addEventListener('input', renderMayors);
  $('#period-filter').addEventListener('change', renderMayors);
  $('#clear-filters').addEventListener('click', () => {$('#mayor-search').value='';$('#period-filter').value='all';renderMayors();$('#mayor-search').focus();});
  $('#mayor-grid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-mayor]');
    if (!button) return;
    const mayor = data.mayors.find((item) => item.id === button.dataset.mayor);
    $('#dialog-body').innerHTML = `<p class="eyebrow">ARCHIVO MUNICIPAL / ALCALDES</p><h2 id="dialog-title">${escape(mayor.name)}</h2><p class="dialog-period">${escape(mayor.periodLabel)}</p><p>${escape(mayor.evidence)}</p>${mayor.periods.length ? `<h3>Períodos registrados</h3><ul>${mayor.periods.map((period) => `<li>${escape(period.label)}${period.fechanota ? `: ${escape(period.fechanota)}` : ''}</li>`).join('')}</ul>` : '<p>Las fuentes disponibles confirman el nombre y los años indicados. Las fechas exactas de inicio y fin del cargo siguen pendientes.</p>'}<h3>Documentos y fuentes</h3>${mayor.sources.map(sourceLink).join('<br>')}<p>Este archivo muestra evidencia disponible; los registros anteriores a 1985 siguen en investigación.</p>`;
    $('#detail-dialog').showModal();
  });

  $('#gallery-grid').innerHTML = data.gallery.map((photo, i) => `<button class="gallery-item" data-photo="${i}" aria-label="Ampliar ${escape(photo.title)}"><img src="${escape(photo.file)}" alt="${escape(photo.alt)}" loading="lazy" width="${photo.width}" height="${photo.height}" style="object-position:${escape(photo.position || 'center')}"><span class="gallery-zoom" aria-hidden="true">＋</span><span class="gallery-caption"><small>${escape(photo.tag)}</small><strong>${escape(photo.title)}</strong></span></button>`).join('');
  $('#gallery-grid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-photo]');
    if (!button) return;
    const photo = data.gallery[Number(button.dataset.photo)];
    $('#photo-image').src=photo.file;
    $('#photo-image').alt=photo.alt;
    $('#photo-title').textContent=photo.title;
    $('#photo-credit').textContent=photo.credit;
    $('#photo-source').href=photo.source;
    $('#photo-dialog').showModal();
  });
  $('#sources-list').innerHTML = data.featuredSources.map((source, i) => `<a class="source-item" href="${escape(source.url)}" target="_blank" rel="noopener noreferrer"><span class="source-number">0${i + 1}</span><span><strong>${escape(source.shortTitle)}</strong><small>${escape(source.description)}</small></span><span class="external" aria-hidden="true">↗</span></a>`).join('');
  $('#credits-button').addEventListener('click', () => {
    $('#dialog-body').innerHTML = `<p class="eyebrow">IMÁGENES Y DOCUMENTACIÓN</p><h2 id="dialog-title">Créditos de este recorrido</h2><h3>Fotografía del parque</h3><p>Oswaldo Galvan · 2 de noviembre de 2012 · Wikimedia Commons. Se utiliza la fotografía original con encuadres de presentación distintos para la portada y la galería.</p><a class="source-link" href="https://commons.wikimedia.org/wiki/File:Parque_Central_de_Flores_Costa_Cuca.jpg" target="_blank" rel="noopener noreferrer">Archivo original y atribución</a><br><a class="source-link" href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">Licencia CC BY-SA 4.0</a><h3>Símbolo de Flores Costa Cuca</h3><p>Municipalidad de Flores Costa Cuca, según la ficha de Wikimedia Commons · CC BY 4.0. El archivo presenta el escudo sobre una bandera de tres colores. Se conserva sin alterar el archivo original.</p><a class="source-link" href="https://commons.wikimedia.org/wiki/File:Coat_of_Flores_Costa_Cuca.jpg" target="_blank" rel="noopener noreferrer">Archivo original y ficha</a><br><a class="source-link" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">Licencia CC BY 4.0</a><h3>Contenido histórico</h3><p>Las fichas enlazan sus fuentes. La nómina anterior a 1985 y algunos períodos de ejercicio todavía requieren cotejo documental.</p><a class="source-link" href="historia-documentada.json" download>Descargar investigación y fuentes (JSON)</a><p>Proyecto informativo independiente. No recibe solicitudes, pagos ni trámites municipales.</p>`;
    $('#detail-dialog').showModal();
  });
  $('#dialog-close').addEventListener('click', () => $('#detail-dialog').close());
  $('#photo-close').addEventListener('click', () => $('#photo-dialog').close());
  for (const dialog of [$('#detail-dialog'),$('#photo-dialog')]) {
    dialog.addEventListener('click', (event) => {if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
  }
  $('#menu-toggle').addEventListener('click', () => {
    const open = $('#navigation').classList.toggle('open');
    $('#menu-toggle').setAttribute('aria-expanded', String(open));
    $('#menu-toggle').setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  function closeMenu(restoreFocus = false) {
    const wasOpen = $('#navigation').classList.contains('open');
    $('#navigation').classList.remove('open');
    $('#menu-toggle').setAttribute('aria-expanded','false');
    $('#menu-toggle').setAttribute('aria-label','Abrir menú');
    if (restoreFocus && wasOpen) $('#menu-toggle').focus();
  }
  $('#navigation').addEventListener('click', (event) => {if(event.target.closest('a'))closeMenu();});
  document.addEventListener('keydown', (event) => {if(event.key==='Escape')closeMenu(true);});
  function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    $('#theme-toggle').setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    try {localStorage.setItem('flores-theme', dark ? 'dark' : 'light');} catch (_) {}
  }
  let savedTheme=null;
  try {savedTheme=localStorage.getItem('flores-theme');} catch (_) {}
  if(savedTheme==='dark') setTheme(true);
  $('#theme-toggle').addEventListener('click', () => setTheme(!document.body.classList.contains('dark')));
  renderTimeline();
  renderMayors();
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('motion-ready');
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}), {threshold:.07});
    document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));
  }
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {entries.forEach((entry) => {if(entry.isIntersecting){document.querySelectorAll('#navigation a').forEach((link)=>link.classList.toggle('active',link.hash===`#${entry.target.id}`));}});},{rootMargin:'-15% 0px -60% 0px'});
    document.querySelectorAll('section[id]').forEach((section) => sectionObserver.observe(section));
  }
})();
