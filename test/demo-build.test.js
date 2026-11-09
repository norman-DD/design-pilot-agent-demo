import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
test('public build is isolated from private server and internal source identifiers',async()=>{const files=await readdir('dist');for(const forbidden of ['server.js','.env','.env.example','docs','scripts','test'])assert.ok(!files.includes(forbidden));const html=await readFile('dist/index.html','utf8');assert.match(html,/name="app-mode" content="demo"/);for(const file of ['index.html','evaluation.html','app.js','catalog.js']){const text=await readFile('dist/'+file,'utf8');assert.doesNotMatch(text,/grist\.numerique\.gouv\.fr/);}});
