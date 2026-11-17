var K='hydrolog_v1';
function $(i){return document.getElementById(i)}
function load(){try{var d=JSON.parse(localStorage.getItem(K));if(d&&d.water)return d}catch(e){}return{garden:null,plants:{},water:[],obs:[],acts:[],th:{phMin:5.5,phMax:6.5,ppmMin:600,ppmMax:900,tMax:28}}}
function save(d){try{localStorage.setItem(K,JSON.stringify(d))}catch(e){alert('Data gagal disimpan. Cek izin penyimpanan browser.')}}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function today(){var t=new Date();return t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0')}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function fd(t){return new Date(t+'T00:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}
function umur(t){return Math.max(0,Math.floor((new Date(today())-new Date(t))/864e5))}
function head(p){var l=[['dashboard','Dashboard'],['air','Kualitas air'],['peta','Peta tanaman'],['jurnal','Jurnal']];
 document.body.insertAdjacentHTML('afterbegin','<header><a class="br" href="index.html">HydroLog</a><nav>'+l.map(function(x){return'<a href="'+x[0]+'.html"'+(x[0]===p?' class="on"':'')+'>'+x[1]+'</a>'}).join('')+'</nav></header>')}
function need(){var d=load();if(!d.garden){location.href='setup.html';return null}return d}
function addAct(d,kat,desk,tgl){d.acts.push({id:uid(),tgl:tgl||today(),kat:kat,desk:desk,at:Date.now()})}
function peringatan(w,t){var a=[];
 if(w.ph!==''&&(w.ph<t.phMin||w.ph>t.phMax))a.push('pH '+w.ph+' di luar '+t.phMin+'–'+t.phMax);
 if(w.ppm!==''&&(w.ppm<t.ppmMin||w.ppm>t.ppmMax))a.push('PPM '+w.ppm+' di luar '+t.ppmMin+'–'+t.ppmMax);
 if(w.suhu!==''&&w.suhu>t.tMax)a.push('Suhu '+w.suhu+'°C di atas '+t.tMax);return a}
function chart(id,pts,lo,hi){var e=$(id);if(pts.length<2){e.innerHTML='<p class="m">Butuh minimal 2 data.</p>';return}
 var W=300,H=110,ys=pts.map(function(p){return p.y}).concat([lo,hi].filter(function(v){return v!=null}));
 var a=Math.min.apply(0,ys),b=Math.max.apply(0,ys);if(a==b){a-=1;b+=1}
 function X(i){return 10+i*(W-20)/(pts.length-1)}function Y(v){return H-14-(v-a)*(H-28)/(b-a)}
 var s='<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img">';
 if(lo!=null&&hi!=null)s+='<rect x="0" y="'+Y(hi)+'" width="'+W+'" height="'+Math.max(1,Y(lo)-Y(hi))+'" fill="#A8D5A2" opacity=".4"/>';
 s+='<polyline fill="none" stroke="#173D2A" stroke-width="2" points="'+pts.map(function(p,i){return X(i)+','+Y(p.y)}).join(' ')+'"/>';
 pts.forEach(function(p,i){s+='<circle cx="'+X(i)+'" cy="'+Y(p.y)+'" r="3" fill="#173D2A"><title>'+esc(p.x)+': '+p.y+'</title></circle>'});
 e.innerHTML=s+'<text x="10" y="'+(H-1)+'" font-size="9" fill="#5f6f64">'+esc(pts[0].x)+'</text><text x="'+(W-10)+'" y="'+(H-1)+'" font-size="9" text-anchor="end" fill="#5f6f64">'+esc(pts[pts.length-1].x)+'</text></svg>'}
function csv(nama,rows){var t=rows.map(function(r){return r.map(function(c){return'"'+String(c==null?'':c).replace(/"/g,'""')+'"'}).join(',')}).join('\n');
 var a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+t],{type:'text/csv'}));a.download=nama;a.click()}
