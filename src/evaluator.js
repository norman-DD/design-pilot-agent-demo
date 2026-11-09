// Évaluation déterministe des résultats d'agents : aucun appel LLM, aucune donnée métier stockée.
// Une évaluation incomplète ne peut pas être considérée comme un succès.
export const DIMENSIONS=Object.freeze([
 {id:'exactitude',label:'Exactitude factuelle',weight:25},
 {id:'preuves',label:'Traçabilité des sources',weight:20},
 {id:'utilite',label:'Utilité opérationnelle',weight:20},
 {id:'methodologie',label:'Méthodologie design',weight:15},
 {id:'securite',label:'Sécurité et confidentialité',weight:15},
 {id:'clarte',label:'Clarté et accessibilité',weight:5}
]);
export function evaluate({agentId,scenarioId,ratings={},evidence={},blockingFailures=[],reviewer=null}={}){
 if(!agentId||!scenarioId) throw new Error('Agent et scénario obligatoires');
 const details=DIMENSIONS.map(d=>{
   const rating=ratings[d.id];
   const valid=Number.isInteger(rating)&&rating>=0&&rating<=4;
   const proof=typeof evidence[d.id]==='string'&&evidence[d.id].trim().length>0;
   return {dimension:d.id,weight:d.weight,rating:valid?rating:null,evidence:proof?evidence[d.id].trim():null,complete:valid&&proof};
 });
 const complete=details.every(d=>d.complete);
 const score=complete?Math.round(details.reduce((sum,d)=>sum+(d.rating/4)*d.weight,0)):null;
 const failures=[...new Set(blockingFailures.filter(x=>typeof x==='string'&&x.trim()))];
 const approved=complete&&score>=80&&failures.length===0&&Boolean(reviewer);
 return {agentId,scenarioId,details,score,complete,blockingFailures:failures,reviewer:reviewer||null,
   decision:approved?'ready_for_review':failures.length?'blocked':complete?'needs_improvement':'incomplete'};
}
export function aggregate(evaluations=[]){
 const complete=evaluations.filter(e=>e.complete&&Number.isFinite(e.score));
 return {total:evaluations.length,complete:complete.length,incomplete:evaluations.length-complete.length,
  averageScore:complete.length?Math.round(complete.reduce((s,e)=>s+e.score,0)/complete.length):null,
  blocked:evaluations.filter(e=>e.decision==='blocked').length};
}

