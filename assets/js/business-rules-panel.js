/* global BUSINESS_RULES */
(()=>{
  let origin=null;
  const esc=value=>String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const multiline=value=>esc(value).replace(/\n/g,'<br>');
  const block=(title,content,className='')=>`<section class="business-rule-section"><h3>${title}</h3><div class="${className}">${content}</div></section>`;
  const list=items=>`<ul>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;

  function conversionExample(example){
    const leadRows=example.leads.map(([name,contact,sale,status,kind])=>{const contactClass=kind==='both'?'mark-both':kind==='lead'?'mark-lead':'';const saleClass=kind==='both'?'mark-both':kind==='sale'?'mark-sale':'';return `<tr class="${kind==='outside'?'row-outside':''}"><td>${esc(name)}</td><td class="${contactClass}">${esc(contact)}</td><td class="${saleClass}">${esc(sale)}</td><td class="${status.startsWith('Sim')?'is-yes':'is-no'}">${esc(status)}</td></tr>`}).join('');
    const dashboardRows=example.dashboard.map(([indicator,result])=>`<tr><td>${esc(indicator)}</td><td>${esc(result)}</td></tr>`).join('');
    const details=example.details.map(detail=>`<div class="conversion-detail"><h5>${esc(detail.title)}</h5>${(detail.paragraphs||[]).map(text=>`<p>${esc(text)}</p>`).join('')}${detail.items?list(detail.items):''}${(detail.after||[]).map(text=>`<p>${esc(text)}</p>`).join('')}${detail.result?`<div class="conversion-result">${esc(detail.result)}</div>`:''}</div>`).join('');
    return `<div class="conversion-example"><h4>Período selecionado</h4><p>O usuário aplicou o seguinte filtro:</p><div class="conversion-period">${example.period.map(esc).join('\n')}</div><h4>Legenda visual</h4><div class="conversion-legend">${example.legend.map(([,icon,text])=>`<span><b aria-hidden="true">${esc(icon)}</b>${esc(text)}</span>`).join('')}</div><h4>Tabela do exemplo</h4><div class="conversion-table-wrap" tabindex="0" aria-label="Tabela do exemplo de taxa de conversão"><table class="conversion-table"><thead><tr><th>Lead</th><th>Data do contato</th><th>Data da venda</th><th>Entra na taxa de conversão?</th></tr></thead><tbody>${leadRows}</tbody></table></div><h4>Resultado apresentado no dashboard</h4><div class="conversion-table-wrap" tabindex="0" aria-label="Resultados do exemplo"><table class="conversion-table conversion-dashboard"><thead><tr><th>Indicador</th><th>Resultado</th></tr></thead><tbody>${dashboardRows}</tbody></table></div><div class="conversion-formula">${esc(example.formula)}</div><h4>Entendendo o exemplo</h4>${details}<div class="conversion-final">${esc(example.finalResult)}</div></div>`;
  }

  function periodSalesExample(example){
    const rows=example.leads.map(([name,contact,sale,status,kind])=>{const contactClass=kind==='both'?'mark-both':kind==='lead'?'mark-lead':'';const saleClass=kind==='both'?'mark-both':kind==='sale'?'mark-sale':'';return `<tr><td>${esc(name)}</td><td class="${contactClass}">${esc(contact)}</td><td class="${saleClass}">${esc(sale)}</td><td class="${status==='Sim'?'is-yes':'is-no'}">${esc(status)}</td></tr>`}).join('');
    const details=example.details.map(detail=>`<div class="conversion-detail"><h5>${esc(detail.title)}</h5><div class="conversion-result">${detail.dates.map(esc).join('\n')}</div>${detail.text.map(text=>`<p>${esc(text)}</p>`).join('')}</div>`).join('');
    return `<div class="conversion-example"><p>O usuário selecionou:</p><div class="conversion-period">${example.period.map(esc).join('\n')}</div><h4>Legenda visual</h4><div class="conversion-legend">${example.legend.map(([,icon,text])=>`<span><b aria-hidden="true">${esc(icon)}</b>${esc(text)}</span>`).join('')}</div><div class="conversion-table-wrap" tabindex="0" aria-label="Tabela do exemplo de vendas dos leads do período"><table class="conversion-table"><thead><tr><th>Lead</th><th>Data do contato</th><th>Data da venda</th><th>Contabilizar?</th></tr></thead><tbody>${rows}</tbody></table></div><h4>Resultado do exemplo</h4><div class="conversion-final">${esc(example.result)}</div><p>${esc(example.summary)}</p><h4>Entendendo o exemplo</h4>${details}<div class="conversion-detail"><h5>Resultado final</h5><p>${esc(example.finalText)}</p>${list(example.criteria)}</div><div class="conversion-final">${esc(example.result)}</div><h4>Importante</h4><p class="business-rule-note">${multiline(example.important)}</p><div class="conversion-formula">${esc(example.wideExample)}</div><p>${esc(example.importantEnd)}</p></div>`;
  }

  function periodRevenueExample(example){
    const rows=example.sales.map(([name,contact,sale,value,status,kind])=>{const contactClass=kind==='both'?'mark-lead':'';const saleClass=kind==='outside'?'': 'mark-sale';const rowClass=kind==='outside'?'row-outside':'';return `<tr class="${rowClass}"><td>${esc(name)}</td><td class="${contactClass}">${esc(contact)}</td><td class="${saleClass}">${esc(sale)}</td><td class="${saleClass}">${esc(value)}</td><td class="${status==='Sim'?'is-yes':'is-no'}">${esc(status)}</td></tr>`}).join('');
    const resultRows=example.resultRows.map(([sale,value],index)=>`<tr class="${index===example.resultRows.length-1?'conversion-total-row':''}"><td>${esc(sale)}</td><td>${esc(value)}</td></tr>`).join('');
    const details=example.details.map(detail=>`<div class="conversion-detail"><h5>${esc(detail.title)}</h5><div class="conversion-result">${detail.data.map(esc).join('\n')}</div>${detail.text.map(text=>`<p>${esc(text)}</p>`).join('')}</div>`).join('');
    return `<div class="conversion-example"><p>O usuário selecionou:</p><div class="conversion-period">${example.period.map(esc).join('\n')}</div><p>Durante o período, a loja realizou as seguintes vendas:</p><h4>Legenda visual</h4><div class="conversion-legend">${example.legend.map(([,icon,text])=>`<span><b aria-hidden="true">${esc(icon)}</b>${esc(text)}</span>`).join('')}</div><div class="conversion-table-wrap" tabindex="0" aria-label="Vendas do exemplo de faturamento no período"><table class="conversion-table"><thead><tr><th>Lead</th><th>Data do contato</th><th>Data da venda</th><th>Valor final da venda</th><th>Contabilizar?</th></tr></thead><tbody>${rows}</tbody></table></div><h4>Resultado do período</h4><div class="conversion-table-wrap" tabindex="0" aria-label="Valores contabilizados no faturamento"><table class="conversion-table conversion-dashboard"><thead><tr><th>Venda</th><th>Valor contabilizado</th></tr></thead><tbody>${resultRows}</tbody></table></div><div class="conversion-formula">${esc(example.sum)}</div><p>O indicador deve exibir:</p><div class="conversion-final">${esc(example.result)}</div><h4>Entendendo o exemplo</h4>${details}<div class="conversion-detail"><h5>Resultado final</h5><p>${esc(example.finalIntro)}</p>${list(example.finalItems)}<p>Somando os valores:</p><div class="conversion-result">${esc(example.finalSum)}</div><p>Portanto, o indicador deve exibir:</p></div><div class="conversion-final">${esc(example.result)}</div></div>`;
  }

  const renderExample=example=>example?.type==='conversion'?conversionExample(example):example?.type==='period-sales'?periodSalesExample(example):example?.type==='period-revenue'?periodRevenueExample(example):esc(example);

  function render(rule){
    return block('O que representa',`<p>${multiline(rule.description)}</p>`)
      +(rule.objective?block('Objetivo',`<p>${esc(rule.objective)}</p>${rule.nameNote?`<p class="business-rule-note"><strong>Observação de nomenclatura:</strong> ${esc(rule.nameNote)}</p>`:''}`):'')
      +(rule.fields?.length?block('Campos utilizados',list(rule.fields)):'')
      +(rule.periodRule?block('Regra do período',`<p>${multiline(rule.periodRule)}</p>${rule.periodNote?`<p class="business-rule-note">${esc(rule.periodNote)}</p>`:''}`):'')
      +(rule.agentRule?block('Filtro de atendente',`<p>${esc(rule.agentRule)}</p>`):'')
      +(rule.calculation?block('Cálculo',esc(rule.calculation),'business-rule-formula'):'')
      +(rule.businessRules?.length?block('Regras de negócio',list(rule.businessRules)):'')
      +(rule.specialCases?.length?block('Situações especiais',list(rule.specialCases)):'')
      +block('Exemplo prático',renderExample(rule.example),rule.example?.type==='conversion'?'':'business-rule-example');
  }

  function open(button){
    const rule=BUSINESS_RULES[button.dataset.businessRule];
    if(!rule)return;
    origin=button;
    const panel=document.querySelector('#businessRulePanel');
    const overlay=document.querySelector('#businessRuleOverlay');
    document.querySelector('#businessRuleTitle').textContent=rule.title;
    document.querySelector('#businessRuleContent').innerHTML=render(rule);
    overlay.hidden=false;
    requestAnimationFrame(()=>{overlay.classList.add('is-open');panel.classList.add('is-open')});
    panel.setAttribute('aria-hidden','false');
    document.body.classList.add('business-rule-lock');
    document.querySelector('#businessRuleClose').focus();
  }

  function close(){
    const panel=document.querySelector('#businessRulePanel');
    const overlay=document.querySelector('#businessRuleOverlay');
    if(panel.getAttribute('aria-hidden')==='true')return;
    panel.classList.remove('is-open');overlay.classList.remove('is-open');
    panel.setAttribute('aria-hidden','true');document.body.classList.remove('business-rule-lock');
    setTimeout(()=>{overlay.hidden=true;origin?.focus();origin=null},240);
  }

  document.addEventListener('click',event=>{const button=event.target.closest('[data-business-rule]');if(button){event.preventDefault();event.stopPropagation();open(button)}});
  document.addEventListener('DOMContentLoaded',()=>{document.querySelector('#businessRuleClose').onclick=close;document.querySelector('#businessRuleOverlay').onclick=close});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
})();
