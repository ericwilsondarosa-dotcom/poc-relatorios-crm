/* global BUSINESS_RULES */
(()=>{
  let origin=null;
  const esc=value=>value==null?'':String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const multiline=value=>esc(value).replace(/\n/g,'<br>');
  const block=(title,content,className='')=>content.replace(/<[^>]*>/g,'').trim()?`<section class="business-rule-section"><h3>${title}</h3><div class="${className}">${content}</div></section>`:'';
  const list=items=>`<ul>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;

  function periodRevenueExample(example){
    const rows=example.sales.map(([name,contact,sale,value,status,kind])=>{const contactClass=kind==='both'?'mark-lead':'';const saleClass=kind==='outside'?'': 'mark-sale';const rowClass=kind==='outside'?'row-outside':'';return `<tr class="${rowClass}"><td>${esc(name)}</td><td class="${contactClass}">${esc(contact)}</td><td class="${saleClass}">${esc(sale)}</td><td class="${saleClass}">${esc(value)}</td><td class="${status==='Sim'?'is-yes':'is-no'}">${esc(status)}</td></tr>`}).join('');
    const resultRows=example.resultRows.map(([sale,value],index)=>`<tr class="${index===example.resultRows.length-1?'conversion-total-row':''}"><td>${esc(sale)}</td><td>${esc(value)}</td></tr>`).join('');
    const details=example.details.map(detail=>`<div class="conversion-detail"><h5>${esc(detail.title)}</h5><div class="conversion-result">${detail.data.map(esc).join('\n')}</div>${detail.text.map(text=>`<p>${esc(text)}</p>`).join('')}</div>`).join('');
    return `<div class="conversion-example"><p>O usuário selecionou:</p><div class="conversion-period">${example.period.map(esc).join('\n')}</div><p>Durante o período, a loja realizou as seguintes vendas:</p><h4>Legenda visual</h4><div class="conversion-legend">${example.legend.map(([,icon,text])=>`<span><b aria-hidden="true">${esc(icon)}</b>${esc(text)}</span>`).join('')}</div><div class="conversion-table-wrap" tabindex="0" aria-label="Vendas do exemplo de faturamento no período"><table class="conversion-table"><thead><tr><th>Lead</th><th>Data do contato</th><th>Data da venda</th><th>Valor final da venda</th><th>Contabilizar?</th></tr></thead><tbody>${rows}</tbody></table></div><h4>Resultado do período</h4><div class="conversion-table-wrap" tabindex="0" aria-label="Valores contabilizados no faturamento"><table class="conversion-table conversion-dashboard"><thead><tr><th>Venda</th><th>Valor contabilizado</th></tr></thead><tbody>${resultRows}</tbody></table></div><div class="conversion-formula">${esc(example.sum)}</div><p>O indicador deve exibir:</p><div class="conversion-final">${esc(example.result)}</div><h4>Entendendo o exemplo</h4>${details}<div class="conversion-detail"><h5>Resultado final</h5><p>${esc(example.finalIntro)}</p>${list(example.finalItems)}<p>Somando os valores:</p><div class="conversion-result">${esc(example.finalSum)}</div><p>Portanto, o indicador deve exibir:</p></div><div class="conversion-final">${esc(example.result)}</div></div>`;
  }

  function realizedSalesExample(example){
    const rows=example.leads.map(([name,contact,sale,status,kind])=>{const contactClass=kind==='both'||kind==='lead'?'mark-lead':'';const saleClass=kind==='sale'||kind==='both'?'mark-sale':'';return `<tr class="${kind==='outside'?'row-outside':''}"><td>${esc(name)}</td><td class="${contactClass}">${esc(contact)}</td><td class="${saleClass}">${esc(sale)}</td><td class="${status==='Sim'?'is-yes':'is-no'}">${esc(status)}</td></tr>`}).join('');
    const dashboardRows=example.dashboard.map(([indicator,result])=>`<tr><td>${esc(indicator)}</td><td>${esc(result)}</td></tr>`).join('');
    const details=example.details.map(detail=>`<div class="conversion-detail"><h5>${esc(detail.title)}</h5>${(detail.paragraphs||[]).map(text=>`<p>${esc(text)}</p>`).join('')}${detail.contactItems?list(detail.contactItems):''}${(detail.middle||[]).map(text=>`<p>${esc(text)}</p>`).join('')}${detail.saleItems?list(detail.saleItems):''}${detail.items?list(detail.items):''}${detail.data?`<div class="conversion-result">${detail.data.map(esc).join('\n')}</div>`:''}${(detail.after||[]).map(text=>`<p>${esc(text)}</p>`).join('')}</div>`).join('');
    const validation=example.validation?`<h4>Exemplo resumido de validação</h4><div class="conversion-result">${example.validation.data.map(esc).join('\n')}\n\n${esc(example.validation.result)}</div><p>${esc(example.validation.text)}</p>`:'';
    return `<div class="conversion-example"><h4>Período selecionado</h4><div class="conversion-period">${example.period.map(esc).join('\n')}</div><h4>Dados do CRM</h4><h4>Legenda visual</h4><div class="conversion-legend">${example.legend.map(([,icon,text])=>`<span><b aria-hidden="true">${esc(icon)}</b>${esc(text)}</span>`).join('')}</div><div class="conversion-table-wrap" tabindex="0" aria-label="Exemplo de vendas realizadas no período"><table class="conversion-table"><thead><tr><th>Lead</th><th>Data do contato</th><th>Data da venda</th><th>Contabilizar?</th></tr></thead><tbody>${rows}</tbody></table></div><h4>Resultado apresentado no dashboard</h4><div class="conversion-table-wrap" tabindex="0" aria-label="Resultado de vendas realizadas"><table class="conversion-table conversion-dashboard"><thead><tr><th>Indicador</th><th>Resultado</th></tr></thead><tbody>${dashboardRows}</tbody></table></div><p>O card deve exibir:</p><div class="conversion-final">${esc(example.result)}</div><h4>Entendendo o exemplo</h4>${details}<div class="conversion-detail"><h5>Resultado final</h5><p>As vendas realizadas dentro do período foram:</p>${list(example.finalItems)}<p>Portanto:</p></div><div class="conversion-final">${esc(example.finalResult)}</div>${validation}</div>`;
  }

  function monthlyConversionExample(example){
    const rows=example.leads.map(([name,contact,sale,month,status])=>`<tr class="${status==='pending'?'row-outside':''}"><td>${esc(name)}</td><td class="mark-lead">${esc(contact)}</td><td class="${status==='converted'?'mark-sale':''}">${esc(sale)}</td><td class="${status==='converted'?'mark-both':'is-no'}">${esc(month)}</td></tr>`).join('');
    return `<div class="conversion-example"><p>O sistema apresenta os resultados de:</p>${list(example.months)}<div class="conversion-table-wrap" tabindex="0" aria-label="Exemplo da conversão por mês de entrada"><table class="conversion-table"><thead><tr><th>Lead</th><th>Data do contato</th><th>Data da venda</th><th>Conversão atribuída a</th></tr></thead><tbody>${rows}</tbody></table></div>${example.explanations.map(text=>`<p>${esc(text)}</p>`).join('')}<h4>Resultado</h4><div class="conversion-result">${example.results.map(esc).join('\n')}</div><p class="business-rule-note">${esc(example.note)}</p></div>`;
  }

  const renderExample=example=>example?.type==='monthly-conversion'?monthlyConversionExample(example):example?.type==='period-revenue'?periodRevenueExample(example):example?.type==='realized-sales'?realizedSalesExample(example):esc(example);

  function salesFunnelContent(rule){
    const journey=`<div class="funnel-rule-flow">${rule.journey.map((stage,index)=>`<strong>${esc(stage)}</strong>${index<rule.journey.length-1?'<span aria-hidden="true">↓</span>':''}`).join('')}</div>`;
    const stages=rule.stages.map(([title,text])=>`<div class="conversion-detail"><h5>${esc(title)}</h5><p>${esc(text)}</p></div>`).join('');
    const rows=rule.example.rows.map((row,index)=>`<tr class="funnel-example-stage-${index}">${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('');
    const step=rule.stepConversion.map(([title,formula,text])=>`<div class="conversion-detail"><h5>${esc(title)}</h5><div class="conversion-formula">${esc(formula)}</div><p>${esc(text)}</p></div>`).join('');
    const absolute=rule.absoluteConversion.map(([title,formula])=>`<div class="conversion-detail"><h5>${esc(title)}</h5><div class="conversion-formula">${esc(formula)}</div></div>`).join('');
    return block('O que representa',`<p>${esc(rule.description)}</p>${journey}<p>${esc(rule.overview)}</p>`)+block('Objetivo',`<p>${esc(rule.objective)}</p>`)+block('Base utilizada no funil',rule.base.map(text=>`<p>${esc(text)}</p>`).join('')+list(rule.cardDifferences)+`<p class="business-rule-note"><strong>${esc(rule.highlight)}</strong></p>`)+block('Etapas do funil',stages)+block('Exemplo prático',`<p>O usuário selecionou:</p><div class="conversion-period">${rule.example.period.map(esc).join('\n')}</div><p>${esc(rule.example.intro)}</p>${list(rule.example.counts)}<div class="funnel-rule-flow">${rule.example.flow.map((stage,index)=>`<strong>${esc(stage)}</strong>${index<rule.example.flow.length-1?'<span aria-hidden="true">↓</span>':''}`).join('')}</div><div class="conversion-table-wrap" tabindex="0" aria-label="Tabela do exemplo do Funil de vendas"><table class="conversion-table"><thead><tr><th>Etapa</th><th>Quantidade</th><th>Conversão da etapa</th><th>Conversão absoluta</th></tr></thead><tbody>${rows}</tbody></table></div>`)+block('Conversão da etapa',`<p>A conversão da etapa compara o resultado com a etapa imediatamente anterior.</p>${step}`)+block('Conversão absoluta',`<p>A conversão absoluta compara cada etapa com a quantidade inicial de leads. A base inicial do exemplo é de 100 leads.</p>${absolute}<p>${esc(rule.absoluteConclusion)}</p><div class="business-rule-note">${multiline(rule.comparison)}</div>`)+block('Gráfico e tabela',`<p>${esc(rule.graphTable)}</p><p>A tabela deve apresentar com precisão:</p>${list(rule.tablePurpose)}<p>Os valores do gráfico e da tabela devem sempre ser gerados a partir da mesma fonte de dados.</p>`)+block('Cuidado com divisão por zero',`<p>${esc(rule.zeroRule)}</p>`);
  }

  function teamPerformanceContent(rule){
    const rows=rule.example.rows.map(([agent,month,leads,sales,rate],index)=>`<tr class="${index%3===0?'agent-month-group-start':''}"><td><strong>${esc(agent)}</strong></td><td>${esc(month)}</td><td>${esc(leads)}</td><td>${esc(sales)}</td><td>${esc(rate)}</td></tr>`).join('');
    return block('O que representa',`<p>${multiline(rule.description)}</p>`)+block('Objetivo',`<p>${esc(rule.objective)}</p>`)+block('Primeira tabela — Período selecionado',`<p>${esc(rule.periodNote)}</p>${list(rule.periodTable)}`)+block('Segunda tabela — Conversão por atendente',`<p>${esc(rule.conversionText)}</p>${list(rule.conversionItems)}<p class="business-rule-note">${esc(rule.conversionNote)}</p>`)+block('Exemplo prático',`<div class="conversion-table-wrap" tabindex="0" aria-label="Exemplo da conversão por atendente"><table class="conversion-table"><thead><tr><th>Atendente</th><th>Mês de entrada</th><th>Leads</th><th>Vendas</th><th>Taxa de conversão</th></tr></thead><tbody>${rows}</tbody></table></div><p>${esc(rule.example.explanation)}</p><div class="conversion-formula">${esc(rule.example.formula)}</div><p>${esc(rule.example.conclusion)}</p>`);
  }

  function render(rule){
    if(rule.type==='sales-funnel')return salesFunnelContent(rule);
    if(rule.type==='team-performance')return teamPerformanceContent(rule);
    return block('O que representa',`<p>${multiline(rule.description)}</p>`)
      +(rule.objective?block('Objetivo',`<p>${esc(rule.objective)}</p>${rule.nameNote?`<p class="business-rule-note"><strong>Observação de nomenclatura:</strong> ${esc(rule.nameNote)}</p>`:''}`):'')
      +(rule.monthDefinition?block('Como os meses são definidos',`<p>${multiline(rule.monthDefinition)}</p>`):'')
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
