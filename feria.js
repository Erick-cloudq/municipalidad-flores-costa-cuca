(function () {
  'use strict';
  const zone='America/Guatemala';
  const formatGT=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'});
  function nextFeast(now) {
    const fields=Object.fromEntries(formatGT.formatToParts(now).filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));
    const todayIsFeast=fields.month===2&&fields.day===2;
    const year=fields.year+((fields.month>2||(fields.month===2&&fields.day>2))?1:0);
    const timestamp=Date.UTC(year,1,2,6,0,0);
    const remaining=todayIsFeast?0:Math.max(0,timestamp-now.getTime());
    const seconds=Math.floor(remaining/1000);
    return {year,timestamp,todayIsFeast,days:Math.floor(seconds/86400),hours:Math.floor(seconds/3600)%24,minutes:Math.floor(seconds/60)%60,seconds:seconds%60};
  }
  function monthLayout(year,month) {
    return {offset:(new Date(Date.UTC(year,month,1)).getUTCDay()+6)%7,days:new Date(Date.UTC(year,month+1,0)).getUTCDate()};
  }
  if(typeof module!=='undefined'&&module.exports){module.exports={nextFeast,monthLayout};return;}
  const data=window.FLORES_FAIR_DATA;
  const $=selector=>document.querySelector(selector);
  if(!data||!$('#feria'))return;
  const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fullDate=new Intl.DateTimeFormat('es-GT',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'});
  const monthName=new Intl.DateTimeFormat('es-GT',{year:'numeric',month:'long',timeZone:'UTC'});
  let target=nextFeast(new Date());
  let year=target.year,month=1,selectedDay=2;
  function updateCountdown() {
    target=nextFeast(new Date());
    $('#fair-target-date').textContent=`2 de febrero de ${target.year}`;
    for(const unit of ['days','hours','minutes','seconds'])$('#fair-'+unit).textContent=unit==='days'?String(target[unit]):String(target[unit]).padStart(2,'0');
    $('#fair-countdown-message').textContent=target.todayIsFeast?'Hoy es el día principal de Candelaria.':'Cuenta regresiva al día principal, con la hora de Guatemala.';
  }
  updateCountdown();
  setInterval(updateCountdown,1000);
  function selectedDateKey(){return `${year}-${String(month+1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}`;}
  function renderDatePanel() {
    const isFeast=month===1&&selectedDay===2;
    const events=data.programEvents.filter(event=>event.date===selectedDateKey());
    $('#fair-selected-date').innerHTML=`<p class="eyebrow">DÍA SELECCIONADO</p><h4>${escape(fullDate.format(new Date(Date.UTC(year,month,selectedDay))))}</h4>${isFeast?'<div class="fair-date-event"><span>FECHA TRADICIONAL ANUAL</span><h5>Día principal de Candelaria</h5><p>La fecha central documentada es el 2 de febrero. Esta conmemoración anual se distingue del programa de actividades de cada edición.</p><a class="source-link" href="https://portal.segeplan.gob.gt/segeplan/wp-content/uploads/2022/09/PDM_922.pdf#page=28" target="_blank" rel="noopener noreferrer">Consultar la fuente</a></div>':''}${events.length?events.map(event=>`<div class="fair-date-event"><span>ACTIVIDAD CONFIRMADA</span><h5>${escape(event.title)}</h5><p>${escape(event.time||'Horario por confirmar')}${event.place?' · '+escape(event.place):''}</p><a class="source-link" href="${escape(event.source)}" target="_blank" rel="noopener noreferrer">Ver anuncio oficial</a></div>`).join(''):`<p class="fair-no-program">${isFeast?'Los eventos y horarios de esta edición están por confirmar.':'No hay actividades confirmadas para esta fecha en esta agenda.'}</p>`}`;
  }
  function renderCalendar(focusDay=false) {
    const info=monthLayout(year,month);
    selectedDay=Math.max(1,Math.min(selectedDay,info.days));
    $('#fair-calendar-title').textContent=monthName.format(new Date(Date.UTC(year,month,1))).replace(/^./,c=>c.toUpperCase());
    const blanks=Array.from({length:info.offset},()=>'<span class="fair-day-empty" aria-hidden="true"></span>').join('');
    $('#fair-calendar-days').innerHTML=blanks+Array.from({length:info.days},(_,i)=>{const day=i+1,feast=month===1&&day===2;return `<button class="fair-day${feast?' feast-day':''}${day===selectedDay?' selected':''}" data-day="${day}" aria-pressed="${day===selectedDay}" tabindex="${day===selectedDay?'0':'-1'}" aria-label="${escape(fullDate.format(new Date(Date.UTC(year,month,day))))}${feast?' · Día principal de Candelaria':''}">${day}${feast?'<span aria-hidden="true"></span>':''}</button>`;}).join('');
    renderDatePanel();
    if(focusDay)$(`#fair-calendar-days [data-day="${selectedDay}"]`).focus({preventScroll:true});
  }
  function changeMonth(delta){const date=new Date(Date.UTC(year,month+delta,1));year=date.getUTCFullYear();month=date.getUTCMonth();renderCalendar();}
  $('#fair-calendar-prev').addEventListener('click',()=>changeMonth(-1));
  $('#fair-calendar-next').addEventListener('click',()=>changeMonth(1));
  $('#fair-calendar-reset').addEventListener('click',()=>{target=nextFeast(new Date());year=target.year;month=1;selectedDay=2;renderCalendar(true);});
  $('#fair-calendar-days').addEventListener('click',event=>{const button=event.target.closest('[data-day]');if(!button)return;selectedDay=Number(button.dataset.day);renderCalendar(true);});
  $('#fair-calendar-days').addEventListener('keydown',event=>{const offsets={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};if(!(event.key in offsets)&&event.key!=='Home'&&event.key!=='End')return;event.preventDefault();const days=monthLayout(year,month).days;selectedDay=event.key==='Home'?1:event.key==='End'?days:Math.max(1,Math.min(days,selectedDay+offsets[event.key]));renderCalendar(true);});
  renderCalendar();
  $('#fair-gallery').innerHTML=data.gallery.map((photo,i)=>`<button class="fair-gallery-item" data-fair-photo="${i}" aria-label="Ampliar ${escape(photo.title)}"><img src="${escape(photo.file)}" alt="${escape(photo.alt)}" width="${photo.width}" height="${photo.height}" loading="lazy" style="object-position:${escape(photo.position||'center')};${photo.contain?'object-fit:contain;background:#efe9d5;':''}"><span class="fair-photo-plus" aria-hidden="true">＋</span><span class="fair-photo-label"><small>${escape(photo.tag)}</small><strong>${escape(photo.title)}</strong></span></button>`).join('');
  $('#fair-gallery').addEventListener('click',event=>{const button=event.target.closest('[data-fair-photo]');if(!button)return;const photo=data.gallery[Number(button.dataset.fairPhoto)];$('#photo-image').src=photo.file;$('#photo-image').alt=photo.alt;$('#photo-title').textContent=photo.title;$('#photo-credit').textContent=photo.credit;$('#photo-source').href=photo.source;$('#photo-source').textContent=photo.sourceLabel;$('#photo-dialog').showModal();});
  $('#fair-video-open').addEventListener('click',()=>{$('#fair-video').innerHTML='<iframe src="https://www.youtube.com/embed/w0LPpJjgMAM?feature=oembed" title="Puestos de la feria 2024 en Flores Costa Cuca, video de Daniel Méndez" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';});
})();
