import {cp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
// Explicit allowlist: never copies backend, private docs, environment or Grist mapping.
await rm('dist',{recursive:true,force:true}); await mkdir('dist/engine',{recursive:true});
for(const file of ['index.html','app.js','catalog.js','style.css']) await cp(file,'dist/'+file);
const html=(await readFile('dist/index.html','utf8')).replace('content="private"','content="demo"');
await writeFile('dist/index.html',html);await writeFile('dist/evaluation.html',html.replace('content="demo"','content="demo"')); 
await cp('src/evaluator.js','dist/engine/evaluator.js');await cp('src/cra-control.js','dist/engine/cra-control.js');
await cp('node_modules/@gouvfr/dsfr/dist','dist/dsfr',{recursive:true});
await writeFile('dist/.nojekyll','');
console.log('Demo built: fictional fixtures, local DSFR assets, no backend.');
