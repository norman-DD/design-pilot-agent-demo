import test from 'node:test';
import assert from 'node:assert/strict';
import {DIMENSIONS,evaluate,aggregate} from '../src/evaluator.js';
const full=(rating=4)=>Object.fromEntries(DIMENSIONS.map(d=>[d.id,rating]));
const proof=()=>Object.fromEntries(DIMENSIONS.map(d=>[d.id,'Vérification humaine documentée']));
test('aucune note si preuves manquantes',()=>{
 const r=evaluate({agentId:'cra',scenarioId:'octobre',ratings:full()});
 assert.equal(r.score,null);assert.equal(r.decision,'incomplete');
});
test('note pondérée sur 100',()=>{
 const r=evaluate({agentId:'cra',scenarioId:'octobre',ratings:full(3),evidence:proof(),reviewer:'evaluateur-humain'});
 assert.equal(r.score,75);assert.equal(r.decision,'needs_improvement');
});
test('blocage de sécurité prévaut sur score maximal',()=>{
 const r=evaluate({agentId:'prototypeur',scenarioId:'refonte',ratings:full(),evidence:proof(),blockingFailures:['Donnée sensible divulguée'],reviewer:'humain'});
 assert.equal(r.score,100);assert.equal(r.decision,'blocked');
});
test('un score élevé ne suffit pas sans relecteur humain',()=>{
 const r=evaluate({agentId:'audit',scenarioId:'site',ratings:full(),evidence:proof()});
 assert.equal(r.decision,'needs_improvement');
});
test('agrégation exclut les évaluations incomplètes',()=>{
 const a=evaluate({agentId:'cra',scenarioId:'s1',ratings:full(),evidence:proof(),reviewer:'humain'});
 const b=evaluate({agentId:'cra',scenarioId:'s2'});
 assert.deepEqual(aggregate([a,b]),{total:2,complete:1,incomplete:1,averageScore:100,blocked:0});
});

