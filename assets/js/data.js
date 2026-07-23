const DB = (() => {
  const agents=['Carlos Mendes','Ana Souza','João Ferreira','Pedro Lima'], sources=['Instagram','Facebook','Google','OLX','Site','WhatsApp','Indicação','Marketplace','Feirão'], statuses=['Responder','Contatado','Atendimento','Aguardando cliente','Em negociação','Visita agendada','Venda','Não fechou','Sem resposta'], cities=['Caxias do Sul','Farroupilha','Bento Gonçalves','Flores da Cunha','Garibaldi','Carlos Barbosa','Vacaria'], vehicles=['Chevrolet Opala','Jeep Compass','Chevrolet Onix','Toyota Hilux','Jeep Renegade','Fiat Toro'], profiles=['Família','Primeiro carro','SUV','Pickup','Colecionador','Esportivo','Utilitário'], ranges=['Até R$ 20 mil','R$ 20 mil a R$ 30 mil','R$ 30 mil a R$ 40 mil','R$ 40 mil a R$ 50 mil','R$ 50 mil a R$ 70 mil','R$ 70 mil a R$ 100 mil','R$ 100 mil a R$ 150 mil','R$ 150 mil a R$ 200 mil','Acima de R$ 200 mil'];
  const first=['Marina','Rafael','Juliana','Bruno','Camila','Lucas','Fernanda','Gustavo','Patrícia','Diego','Aline','Marcelo'], last=['Silva','Costa','Oliveira','Ramos','Martins','Almeida','Pereira','Rocha','Ferreira','Souza'];
  const prices=[78000,118900,68900,189500,105900,147500];
  const leads=Array.from({length:120},(_,i)=>{ const status=statuses[(i*7+i%4)%statuses.length], sold=status==='Venda'; const d=new Date(2026,6,15-(i%75),8+(i*3)%14,(i*17)%60); return {id:i+1,name:`${first[i%first.length]} ${last[(i*3)%last.length]} ${i+1}`,agent:agents[(i*5+i%3)%4],source:sources[(i*7+i%5)%9],status,city:cities[(i*3+i%4)%7],state:i%17===0?'': 'RS',vehicle:vehicles[(i*5+i%2)%6],profile:i%7===0?'':profiles[(i*3)%7],range:i%9===0?'':ranges[(i*5)%9],contact:d.toISOString(),birth:i%6===0?'':`${1980+i%25}-0${1+i%9}-12`,saleDate:sold?new Date(d.getTime()+86400000*(2+i%9)).toISOString():'',saleValue:sold?prices[(i*5)%6]+(i%4)*1500:0,overdue:i%6===0,other:['Maverick','Maverik','Maverick V8','Landau','Opala SS','F250','F-250','Ford F250','Toyota SW4','Volkswagen Amarok'][i%10],trade:['Volkswagen Gol','Fiat Uno','Chevrolet Onix','Hyundai HB20','Fiat Toro','Toyota Hilux'][i%6]}; });
  // Coorte comercial do mês corrente. Os valores são fixos e as datas são
  // posicionadas no mês local do navegador para acompanhar o filtro padrão.
  const currentPlans=[
    {agent:agents[0],count:22,sales:[88900,92500,96800,101900,93900]},
    {agent:agents[2],count:20,sales:[84900,92100,97500,103600,106900]},
    {agent:agents[3],count:18,sales:[89900,96700,102400,109000]},
    {agent:agents[1],count:19,sales:[86500,91300,94700,98200,101300]}
  ];
  const today=new Date(), currentYear=today.getFullYear(), currentMonth=today.getMonth(), currentDay=today.getDate();
  const monthDate=day=>new Date(currentYear,currentMonth,Math.max(1,Math.min(day,currentDay)),12).toISOString();
  let currentIndex=0;
  currentPlans.forEach((plan,planIndex)=>{
    Array.from({length:plan.count},(_,position)=>{
      const sold=position<plan.sales.length;
      const contactDay=1+(currentIndex%Math.max(1,currentDay));
      const saleDay=Math.min(currentDay,contactDay+2+(position%4));
      const id=leads.length+1;
      leads.push({id,name:`${first[(id+planIndex)%first.length]} ${last[(id*3+position)%last.length]} ${id}`,agent:plan.agent,source:sources[(currentIndex*3+planIndex)%8],status:sold?statuses[6]:statuses[[2,4,0,3][position%4]],city:cities[(currentIndex+planIndex)%cities.length],state:'RS',vehicle:vehicles[(position+planIndex*2)%vehicles.length],profile:profiles[(currentIndex+2)%profiles.length],range:ranges[(currentIndex+4)%ranges.length],contact:monthDate(contactDay),birth:`${1982+currentIndex%22}-${String(1+currentIndex%9).padStart(2,'0')}-12`,saleDate:sold?monthDate(saleDay):'',saleValue:sold?plan.sales[position]:0,overdue:!sold&&position%7===0,other:['Maverick','Landau','Opala SS','F-250'][currentIndex%4],trade:['Volkswagen Gol','Fiat Uno','Chevrolet Onix','Hyundai HB20','Fiat Toro','Toyota Hilux'][currentIndex%6]});
      currentIndex++;
    });
  });
  // Coortes determinísticas dos três meses completos anteriores. Elas permitem
  // demonstrar conversões no mesmo mês e em meses posteriores ao contato.
  [3,2,1].forEach((monthOffset,monthIndex)=>{
    Array.from({length:12},(_,position)=>{
      const contact=new Date(currentYear,currentMonth-monthOffset,2+position*2,12);
      const sold=position<5;
      const saleMonthOffset=position<3?0:1+(position%2);
      const saleDate=sold?new Date(contact.getFullYear(),contact.getMonth()+saleMonthOffset,contact.getDate()+3,12):null;
      const id=leads.length+1;
      leads.push({id,name:`Coorte ${first[(id+monthIndex)%first.length]} ${last[(id+position)%last.length]} ${id}`,agent:agents[(position+monthIndex)%agents.length],source:sources[(position*2+monthIndex)%sources.length],status:sold?'Venda':statuses[[2,4,0,3,7,8][position%6]],city:cities[(position+monthIndex)%cities.length],state:'RS',vehicle:vehicles[(position+monthIndex)%vehicles.length],profile:profiles[(position+2)%profiles.length],range:ranges[(position+4)%ranges.length],contact:contact.toISOString(),birth:`${1983+position}-${String(1+position%9).padStart(2,'0')}-12`,saleDate:saleDate?.toISOString()||'',saleValue:sold?prices[(position+monthIndex)%prices.length]:0,overdue:!sold&&position%4===0,other:['Maverick','Landau','Opala SS','F-250'][position%4],trade:['Volkswagen Gol','Fiat Uno','Chevrolet Onix','Hyundai HB20'][position%4]});
    });
  });
  // Campos complementares usados pelo dashboard simplificado. A geração é
  // determinística e preserva todos os dados originais da POC completa.
  leads.forEach((lead,i)=>{
    const contact=new Date(lead.contact);
    const hasScheduledVisit=lead.status==='Venda'||i%3===0||i%7===0;
    const visitScheduledDate=hasScheduledVisit?new Date(contact.getTime()+86400000*(1+i%5)):null;
    const visitCompleted=hasScheduledVisit&&(lead.status==='Venda'||i%4!==0);
    const visitDate=visitCompleted?new Date(visitScheduledDate.getTime()+86400000*(i%2)):null;
    lead.visitScheduled=hasScheduledVisit;
    lead.visitScheduledDate=visitScheduledDate?.toISOString()||'';
    lead.visitCompleted=visitCompleted;
    lead.visitDate=visitDate?.toISOString()||'';
  });
  return {leads,agents,sources,statuses,cities,vehicles,profiles,ranges};
})();
