import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
test('preview starts without CLI port flags and serves only the fictional build',async()=>{const server=spawn(process.execPath,['scripts/preview.js'],{env:{...process.env,PORT:'39742'},stdio:['ignore','pipe','pipe']});try{await once(server.stdout,'data');const r=await fetch('http://127.0.0.1:39742/');assert.equal(r.status,200);assert.match(await r.text(),/content="demo"/);assert.equal((await fetch('http://127.0.0.1:39742/api/status')).status,404);}finally{server.kill();await once(server,'exit');}});
