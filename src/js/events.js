// 이벤트 위임: 클릭, 필터, 드래그 앤 드롭
/* ========= 이벤트 (위임) ========= */
const app=$('#app');let dragId=null;
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-a],[data-tab],[data-demo],[data-edit],.chip,[data-new]');if(!el)return;
  const a=el.dataset.a,M=S.m;
  if(el.dataset.tab){S.tab=el.dataset.tab;return render()}
  if(el.dataset.demo){const u=DEMO.find(x=>x.role===el.dataset.demo);S.user={...u,token:''};return guard(async()=>{await api.load();render()})}
  if(a==='sso'){if(CONFIG.SSO.loginUrl){location.href=CONFIG.SSO.loginUrl+'?returnTo='+encodeURIComponent(location.href);return}$('#acc').hidden=false;return}
  if(a==='out')return api.logout();if(a==='xls')return xls();
  if(a==='close')return $('#dlg').close();
  if(a==='del'){const id=$('#dlg').dataset.id,t0=S.tasks.find(x=>x.id===id);return guard(async()=>{S.tasks=S.tasks.filter(t=>t.id!==id);await api.delTask(id);logIt('삭제',t0);$('#dlg').close();render();toast('삭제했습니다.')})}
  if(a==='addeq'){const v=k=>$('#ne-'+k).value.trim(),id=v('id');if(!id||S.eqs.some(x=>x.id===id))return toast('설비 ID를 입력하세요. 중복 ID는 사용할 수 없습니다.');return guard(async()=>{const n={id,kind:v('kind'),line:v('line')};S.eqs.push(n);await api.saveEq(n);render();toast('설비를 추가했습니다.')})}
  if(a){({pm:()=>S.m=new Date(M.getFullYear(),M.getMonth()-1,1),nm:()=>S.m=new Date(M.getFullYear(),M.getMonth()+1,1),td:()=>S.m=new Date(today.getFullYear(),today.getMonth(),1),pw:()=>S.w=addD(S.w,-7),nw:()=>S.w=addD(S.w,7),tw:()=>S.w=addD(today,-today.getDay())})[a]?.();return render()}
  if(el.dataset.tpl)return;if(el.dataset.edit||el.classList.contains('chip'))return openTask(el.dataset.edit||el.dataset.id);
  if(el.dataset.new&&el.tagName==='BUTTON')openTask(null,el.dataset.new)});
document.addEventListener('dblclick',e=>{const c=e.target.closest('[data-new]');if(c&&c.tagName!=='BUTTON'&&!e.target.closest('.chip')&&S.user&&can())openTask(null,c.dataset.new,c.dataset.neweq)});
document.addEventListener('change',e=>{const f=e.target.dataset.f;if(f){S.f[f]=e.target.value;render()}});
document.addEventListener('dragstart',e=>{const c=e.target.closest('.chip');if(!c||!can())return e.preventDefault();dragId=c.dataset.id||'tpl'+c.dataset.tpl;e.dataTransfer.setData('text/plain',dragId);e.dataTransfer.effectAllowed='copyMove';c.classList.add('dragging')});
document.addEventListener('dragend',()=>{dragId=null;document.querySelectorAll('.dragging,.over').forEach(x=>x.classList.remove('dragging','over'))});
document.addEventListener('dragover',e=>{const z=e.target.closest('[data-drop]');if(z&&dragId){e.preventDefault();document.querySelectorAll('.over').forEach(x=>x!==z&&x.classList.remove('over'));z.classList.add('over')}});
document.addEventListener('drop',e=>{const z=e.target.closest('[data-drop]');if(!z||!dragId)return;e.preventDefault();const id=dragId;dragId=null;if(id.startsWith('tpl')){const k=id.slice(3),p=k==='PM'||k==='BM'?['',k]:TPL[+k];return openTask(null,z.dataset.date,z.dataset.eq||(S.f.eq!=='all'?S.f.eq:''),{title:p[0],type:p[1]})}
  const t0=S.tasks.find(x=>x.id===id),cp=e.altKey,t=cp?{...t0,id:'t'+Date.now(),status:'planned',series:''}:t0,old={...t0};if(z.dataset.date)t.date=z.dataset.date;if(z.dataset.eq)t.eq=z.dataset.eq;if(z.dataset.status)t.status=z.dataset.status;
  guard(async()=>{if(cp)S.tasks.push(t);try{await api.saveTask(t)}catch(err){if(cp)S.tasks.pop();else Object.assign(t,old);render();throw err}logIt(cp?'복사':'이동',t,diff(old,t));render();toast(cp?'복사했습니다.':'변경 내용을 저장했습니다.')})});
