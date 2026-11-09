import test from 'node:test';
import assert from 'node:assert/strict';
import {reconcileCra} from '../src/cra-control.js';
const base={freelanceId:'F1',missionId:'M1',month:'2026-10',bdcId:'B1',days:10};
test('absence de preuve Malt ne vaut jamais validation',()=>{
 const r=reconcileCra({grist:[base],budget:[{bdcId:'B1',remainingTtc:100}]});
 assert.equal(r.summary.validated,0);
 assert.ok(r.checks[0].issues.some(x=>x.code==='MALT_NOT_VERIFIED'));
});
test('écart de jours détecté',()=>{
 const r=reconcileCra({grist:[base],malt:[{...base,days:9,status:'validated'}],budget:[{bdcId:'B1',remainingTtc:100}]});
 assert.ok(r.checks[0].issues.some(x=>x.code==='DAYS_MISMATCH'));
});
test('validation seulement si données concordantes et statut explicite',()=>{
 const r=reconcileCra({grist:[base],malt:[{...base,status:'validated'}],budget:[{bdcId:'B1',remainingTtc:100}]});
 assert.equal(r.summary.validated,1);
});
test('dépassement BDC signalé',()=>{
 const r=reconcileCra({grist:[base],malt:[{...base,status:'validated'}],budget:[{bdcId:'B1',remainingTtc:-25}]});
 assert.ok(r.checks[0].issues.some(x=>x.code==='BDC_NEGATIVE_BALANCE'));
});
test('doublons Malt ne sont pas validés',()=>{
 const m={...base,status:'validated'};
 const r=reconcileCra({grist:[base],malt:[m,m],budget:[{bdcId:'B1',remainingTtc:100}]});
 assert.ok(r.checks[0].issues.some(x=>x.code==='MALT_DUPLICATE'));
});

