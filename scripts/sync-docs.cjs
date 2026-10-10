const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const source=path.join(root,'dist');
const target=path.join(root,'docs');
const files=['middle-cards.js','middle-cards-ui.js','middle.js','middle-ui.js','action-card-data.js','player-cards.js','player-cards-ui.js','index.html','app.js','boards.js','capitalist.js','companies.js','engine.js','judge.js','style.css'];
const check=process.argv.includes('--check');
const differences=[];

for(const file of files){
  const from=path.join(source,file),to=path.join(target,file);
  const sourceContent=fs.readFileSync(from);
  const same=fs.existsSync(to)&&sourceContent.equals(fs.readFileSync(to));
  if(!same)differences.push(file);
  if(!check&&!same){fs.mkdirSync(target,{recursive:true});fs.writeFileSync(to,sourceContent);}
}

if(check&&differences.length){
  console.error(`docs/ が dist/ と一致しません: ${differences.join(', ')}`);
  process.exitCode=1;
}else if(check){
  console.log('PASS docs/ matches dist/');
}else{
  console.log(differences.length?`Updated docs/: ${differences.join(', ')}`:'docs/ is already up to date');
}
