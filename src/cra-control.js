// Pure reconciliation logic. All inputs are normalized records; no network or storage.
const key = r => [r.freelanceId,r.month,r.missionId].map(v=>String(v??'').trim().toLowerCase()).join('|');
const num = v => Number(v);
const valid = v => v!=='' && v!==null && v!==undefined && Number.isFinite(num(v));
export function reconcileCra({grist=[],malt=[],budget=[]}={}){
  const maltByKey=new Map();
  for(const r of malt) {
    const k=key(r);
    if(!maltByKey.has(k)) maltByKey.set(k,[]);
    maltByKey.get(k).push(r);
  }
  const budgetById=new Map(budget.map(r=>[String(r.bdcId),r]));
  const checks=[];
  for(const r of grist){
    const matches=maltByKey.get(key(r))||[];
    const b=budgetById.get(String(r.bdcId));
    const issues=[];
    if(!valid(r.days)) issues.push({code:'CRA_DAYS_INVALID',level:'error',detail:'Jours Grist absents ou invalides'});
    if(matches.length>1) issues.push({code:'MALT_DUPLICATE',level:'warning',detail:'Plusieurs lignes Malt pour la même mission et période'});
    if(matches.length===0) issues.push({code:'MALT_NOT_VERIFIED',level:'unknown',detail:'Aucune preuve Malt importée : statut à vérifier manuellement'});
    if(matches.length===1){
      const m=matches[0];
      if(!valid(m.days)) issues.push({code:'MALT_DAYS_INVALID',level:'error',detail:'Jours Malt absents ou invalides'});
      else if(valid(r.days)&&Math.abs(num(r.days)-num(m.days))>0.001) issues.push({code:'DAYS_MISMATCH',level:'warning',detail:'Écart de jours entre Grist et Malt'});
      if(m.status!=='validated') issues.push({code:'MALT_UNCONFIRMED',level:'unknown',detail:'Validation Malt non confirmée'});
    }
    if(!b) issues.push({code:'BDC_NOT_FOUND',level:'warning',detail:'BDC absent du référentiel importé'});
    else if(valid(b.remainingTtc)&&num(b.remainingTtc)<-0.01) issues.push({code:'BDC_NEGATIVE_BALANCE',level:'warning',detail:'Reste à consommer TTC négatif'});
    checks.push({freelanceId:r.freelanceId,missionId:r.missionId,month:r.month,bdcId:r.bdcId,days:valid(r.days)?num(r.days):null,issues});
  }
  return {checks,summary:{total:checks.length,withIssues:checks.filter(x=>x.issues.length).length,validated:checks.filter(x=>!x.issues.length).length}};
}

