import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import fs from 'node:fs';
const root=path.resolve(import.meta.dirname,'..');
const media=fs.readdirSync(path.join(root,'public'),{withFileTypes:true});
const dirs=media.filter(d=>d.isDirectory()).map(d=>d.name);
const files=media.filter(d=>d.isFile()).map(d=>d.name);
export default defineConfig({root,base:'/_ihl-pages/',plugins:[{
 name:'isolate-public-media',enforce:'pre',transform(code,id){
  if(!id.startsWith(path.join(root,'src'))||!/[.](tsx?|css)$/.test(id))return;
  for(const dir of dirs)for(const q of ['"',"'",'`'])code=code.split(q+'/'+dir+'/').join(q+'/_ihl-pages/'+dir+'/');
  for(const file of files)for(const q of ['"',"'",'`'])code=code.split(q+'/'+file+q).join(q+'/_ihl-pages/'+file+q);
  return code;
 }
},react(),tailwindcss()],build:{outDir:'/workspace/sites/ihl-protected-link-pages-build',emptyOutDir:true,rollupOptions:{input:{main:path.join(root,'index.html'),spanishHome:path.join(root,'es-home.html')}}},resolve:{alias:[{find:'@',replacement:root},{find:'@elevenlabs/client/dist/utils/WebSocketConnection.js',replacement:path.join(root,'src/lib/elevenlabs/WebSocketConnection.js')}]}});
