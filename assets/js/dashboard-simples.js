const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const brl=value=>value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const pct=value=>`${Number.isFinite(value)?value.toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1}):'0,0'}%`;
const dateKey=value=>value?value.slice(0,10):'';
const inRange=(value,start,end)=>value&&dateKey(value)>=start&&dateKey(value)<=end;
const groupBy=(items,key)=>items.reduce((groups,item)=>((groups[item[key]]??=[]).push(item),groups),{});
let filters={start:'',end:'',agent:''};
let charts={finance:null,source:null};

function localISO(date){const offset=date.getTimezoneOffset()*60000;return new Date(date.getTime()-offset).toISOString().slice(0,10)}
function currentMonth(){const now=new Date();return {start:localISO(new Date(now.getFullYear(),now.getMonth(),1)),end:localISO(now)}}
function formatDate(value){const [y,m,d]=value.split('-');return `${d}/${m}/${y}`}
function divide(value,total){return total?value/total*100:0}

function scopedLeads(agent=filters.agent){return DB.leads.filter(lead=>!agent||lead.agent===agent)}
function metrics(items){
  const leads=items.filter(lead=>inRange(lead.contact,filters.start,filters.end));
  const scheduled=items.filter(lead=>lead.visitScheduled&&inRange(lead.visitScheduledDate,filters.start,filters.end));
  const completed=items.filter(lead=>lead.visitCompleted&&inRange(lead.visitDate,filters.start,filters.end));
  const sold=items.filter(lead=>lead.status==='Venda'&&inRange(lead.saleDate,filters.start,filters.end));
  const revenue=sold.reduce((sum,lead)=>sum+lead.saleValue,0);
  return {leads:leads.length,scheduled:scheduled.length,visitsCompleted:completed.length,sales:sold.length,revenue,conversion:divide(sold.length,leads.length),ticket:sold.length?revenue/sold.length:0};
}
function cohort(items){
  const leads=items.filter(lead=>inRange(lead.contact,filters.start,filters.end));
  return {leads:leads.length,scheduled:leads.filter(x=>x.visitScheduled).length,completed:leads.filter(x=>x.visitCompleted).length,sales:leads.filter(x=>x.status==='Venda').length};
}
function rowStats(key){
  const base=scopedLeads();
  return Object.entries(groupBy(base,key)).map(([name,items])=>({name,...metrics(items)}));
}

function renderKpis(){
  const s=metrics(scopedLeads());
  const periodLeadSales=scopedLeads().filter(lead=>lead.status==='Venda'&&inRange(lead.contact,filters.start,filters.end)&&inRange(lead.saleDate,filters.start,filters.end)).length;
  const cards=[
    ['leads','Número de leads',s.leads,'◎','#2878d0'],
    ['scheduledVisitsPeriod','Visitas agendadas no período',s.scheduled,'◷','#6a5acd'],
    ['completedVisitsPeriod','Visitas realizadas no período',s.visitsCompleted,'✓','#198754'],
    ['sales','Vendas dos leads do período',periodLeadSales,'◆','#198754'],
    ['generalConversion','Conversão geral do período',pct(s.conversion),'↗','#198754'],
    ['periodRevenue','Faturamento no período',brl(s.revenue),'R$','#198754'],
    ['periodAverageTicket','Ticket médio do período',brl(s.ticket),'◇','#6a5acd']
  ];
  $('#kpis').innerHTML=cards.map(([key,name,value,icon,color])=>`<article class="kpi" style="--accent:${color}"><div class="kpi-top"><span>${name}</span><button class="kpi-info" type="button" data-business-rule="${key}" title="Ver regra de negócio" aria-label="Ver regra de negócio de ${name}"><span aria-hidden="true">i</span></button></div><strong>${value}</strong><span class="kpi-icon" aria-hidden="true">${icon}</span></article>`).join('');
}
function renderFunnel(){
  const c=cohort(scopedLeads()), stages=[['Leads',c.leads,100,100],['Visitas agendadas',c.scheduled,divide(c.scheduled,c.leads),divide(c.scheduled,c.leads)],['Visitas realizadas',c.completed,divide(c.completed,c.scheduled),divide(c.completed,c.leads)],['Vendas',c.sales,divide(c.sales,c.completed),divide(c.sales,c.leads)]];
  $('#funnel').innerHTML=stages.map(([name,count,step,total],i)=>`<div class="simple-funnel__step" style="--width:${100-i*12}%"><strong>${count} ${name}</strong><span>${i?pct(step)+' da etapa anterior':'100%'}</span>${i>1?`<small>${pct(total)} dos leads</small>`:''}</div>`).join('');
  $('#funnelTable').innerHTML=stages.map(([name,count,step,total])=>`<tr><td><strong>${name}</strong></td><td>${count}</td><td>${pct(step)}</td><td>${pct(total)}</td></tr>`).join('');
}
function renderAgents(){
  const sort=$('#agentSort').value, rows=rowStats('agent').sort((a,b)=>b[sort]-a[sort]);
  $('#agentTable').innerHTML=rows.map(row=>`<tr><td><strong>${row.name}</strong></td><td>${row.leads}</td><td>${row.scheduled}</td><td>${row.visitsCompleted}</td><td>${row.sales}</td><td>${pct(row.conversion)}</td><td>${brl(row.revenue)}</td><td>${brl(row.ticket)}</td></tr>`).join('')||'<tr><td colspan="8">Sem dados para o período.</td></tr>';
}
function chart(id,key,config){
  if(charts[key]){charts[key].destroy();charts[key]=null}
  const canvas=$(`#${id}`);
  if(canvas&&window.Chart) charts[key]=new Chart(canvas,config);
}
function renderFinance(){
  const rows=rowStats('agent').sort((a,b)=>b.revenue-a.revenue), total=rows.reduce((sum,row)=>sum+row.revenue,0);
  $('#financeTotal').textContent=brl(total);
  $('#financeTable').innerHTML=rows.map(row=>`<tr><td><strong>${row.name}</strong></td><td>${row.sales}</td><td>${brl(row.revenue)}</td><td>${pct(divide(row.revenue,total))}</td><td>${brl(row.ticket)}</td></tr>`).join('')||'<tr><td colspan="5">Sem dados para o período.</td></tr>';
  chart('financeChart','finance',{type:'bar',data:{labels:rows.map(x=>x.name),datasets:[{label:'Faturamento',data:rows.map(x=>x.revenue),backgroundColor:'#6a5acd',borderRadius:6}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,resizeDelay:180,animation:{duration:250},plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>`${brl(ctx.raw)} • ${pct(divide(ctx.raw,total))}`}}},scales:{x:{beginAtZero:true,ticks:{callback:value=>brl(value)},grid:{color:'#eee'}},y:{grid:{display:false}}}}});
}
function renderSources(){
  const rows=rowStats('source').sort((a,b)=>b.revenue-a.revenue);
  $('#sourceTable').innerHTML=rows.map(row=>`<tr><td><strong>${row.name}</strong></td><td>${row.leads}</td><td>${row.scheduled}</td><td>${row.visitsCompleted}</td><td>${row.sales}</td><td>${pct(row.conversion)}</td><td>${brl(row.revenue)}</td></tr>`).join('')||'<tr><td colspan="7">Sem dados para o período.</td></tr>';
  chart('sourceSimpleChart','source',{type:'bar',data:{labels:rows.map(x=>x.name),datasets:[{label:'Leads',data:rows.map(x=>x.leads),backgroundColor:'#2878d0',borderRadius:5},{label:'Vendas',data:rows.map(x=>x.sales),backgroundColor:'#198754',borderRadius:5}]},options:{responsive:true,maintainAspectRatio:false,resizeDelay:180,animation:{duration:250},plugins:{legend:{labels:{usePointStyle:true}}},scales:{x:{grid:{display:false}},y:{beginAtZero:true,ticks:{precision:0},grid:{color:'#eee'}}}}});
}
function render(){
  $('#periodLabel').textContent=`Período analisado: ${formatDate(filters.start)} a ${formatDate(filters.end)}`;
  renderKpis();renderFunnel();renderAgents();renderFinance();renderSources();
}
function setCurrentMonth(){const dates=currentMonth();$('#startDate').value=dates.start;$('#endDate').value=dates.end;$('#agent').value='';filters={...dates,agent:''}}
function applyFilters(){
  const start=$('#startDate').value,end=$('#endDate').value;
  if(!start||!end||start>end){$('#filterError').textContent='A data inicial não pode ser posterior à data final.';return false}
  $('#filterError').textContent='';filters={start,end,agent:$('#agent').value};render();return true;
}
function initHeader(){
  const trigger=$('#storeTrigger'),menu=$('#storeMenu');trigger.onclick=()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);trigger.setAttribute('aria-expanded',String(open))};
  $$('#storeMenu button').forEach(option=>option.onclick=()=>{$$('#storeMenu button').forEach(x=>x.setAttribute('aria-selected','false'));option.setAttribute('aria-selected','true');$('#storeName').textContent=option.textContent;menu.classList.remove('open');trigger.setAttribute('aria-expanded','false')});
  document.addEventListener('click',event=>{if(!event.target.closest('.mc-store')){menu.classList.remove('open');trigger.setAttribute('aria-expanded','false')}});
  $$('[data-demo]').forEach(button=>button.onclick=()=>{const toast=$('#toast');toast.textContent=button.dataset.demo;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200)});
}
document.addEventListener('DOMContentLoaded',()=>{
  DB.agents.forEach(agent=>$('#agent').insertAdjacentHTML('beforeend',`<option value="${agent}">${agent}</option>`));
  setCurrentMonth();initHeader();render();
  $('#filters').onsubmit=event=>{event.preventDefault();applyFilters()};
  $('#clearFilters').onclick=()=>{setCurrentMonth();$('#filterError').textContent='';render()};
  $('#agentSort').onchange=renderAgents;
});
