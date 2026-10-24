// 화면 렌더링: 로그인/헤더/탭 전환, 작업 등록·수정 창
/* ========= 화면 ========= */
function render() {
  const a=$('#app');
  if(!S.user){a.innerHTML=`<div class="login"><h1>설비 PM/BM 관리</h1><p class="note">회사 계정(SSO)으로 로그인하면 역할에 맞는 권한이 부여됩니다.</p><button class="pri" style="width:100%" data-a="sso">SSO로 로그인</button><div class="acc" id="acc" hidden><span class="note">데모 계정으로 역할별 화면을 확인하세요.</span>${DEMO.map(u=>`<button data-demo="${u.role}">${u.name} · ${ROLES[u.role].label}</button>`).join('')}</div></div>`;return}
  const T=TABS.filter(t=>!t.roles||t.roles.includes(S.user.role));if(!T.find(t=>t.id===S.tab))S.tab=T[0].id;
  a.innerHTML=`<header><div class="logo"><b>■</b> FAB 설비 PM/BM</div><nav>${T.map(t=>`<button data-tab="${t.id}" class="${t.id===S.tab?'on':''}">${t.label}</button>`).join('')}</nav><div class="who"><span class="note" style="color:#9aa3ad">${'서버 연결됨'}</span>${S.user.name}<em>${ROLES[S.user.role].label}</em><button data-a="xls">엑셀 내보내기</button><button data-a="out">로그아웃</button></div></header><main>${T.find(t=>t.id===S.tab).render()}${can()?`<p><button class="pri" data-new="${TK}">+ 작업 등록</button></p>`:''}</main>`}

function openTask(id,date,eq,pre){
  const t=id?S.tasks.find(x=>x.id===id):{type:'PM',status:'planned',date:date||TK,eq:eq||S.eqs[0]?.id,owner:S.user.name,title:'',note:'',...pre},ro=!can();
  const o=(arr,v)=>arr.map(([k,l])=>`<option value="${k}"${k===v?' selected':''}>${l}</option>`).join('');
  $('#dlg').innerHTML=`<form method="dialog" id="tf"><b>${id?'작업 상세':'새 작업 등록'}</b><fieldset style="border:0;padding:0;margin:0" ${ro?'disabled':''}>
  <label>제목</label><input name="title" required value="${esc(t.title)}">
  <div class="row"><div><label>설비</label><select name="eq">${o(S.eqs.map(e=>[e.id,e.id]),t.eq)}</select></div><div><label>구분</label><select name="type">${o([['PM','PM (예방정비)'],['BM','BM (고장정비)']],t.type)}</select></div></div>
  <div class="row"><div><label>날짜</label><input type="date" name="date" required value="${t.date}"></div><div><label>상태</label><select name="status">${o(Object.entries(ST),t.status)}</select></div></div>
  <label>담당자</label><input name="owner" value="${esc(t.owner)}"><label>메모</label><textarea name="note" rows="3">${esc(t.note)}</textarea>${id?'':`<div class="row"><div><label>반복 주기</label><select name="rep">${o([['0','반복 없음'],['7d','매주'],['14d','2주마다'],['1m','매월'],['3m','3개월마다'],['6m','6개월마다']],'0')}</select></div><div><label>총 횟수 (첫 일정 포함)</label><input type="number" name="cnt" min="1" max="60" value="6"></div></div>`}</fieldset>${id?`<div class="note" style="margin-top:12px">${S.log.filter(l=>l.id===id).slice(0,5).map(l=>`${l.at.slice(5)} ${esc(l.user)} ${esc(l.act)} ${esc(l.detail)}`).join('<br>')||'변경 이력이 없습니다.'}</div>`:''}
  <div class="act">${id&&!ro?'<button type="button" data-a="del" style="color:var(--bm)">삭제</button>':''}<span class="sp"></span><button type="button" data-a="close">${ro?'닫기':'취소'}</button>${ro?'':'<button class="pri" type="submit">저장</button>'}</div></form>`;
  const d=$('#dlg');d.dataset.id=id||'';d.showModal();
  $('#tf').onsubmit=e=>{e.preventDefault();const{rep,cnt,...f}=Object.fromEntries(new FormData(e.target));guard(async()=>{if(id){const b={...t};Object.assign(t,f);await api.saveTask(t);logIt('수정',t,diff(b,t))}else{const ds=recur(f.date,rep,+cnt||1),sr='s'+Date.now();for(const [i,dt] of ds.entries()){const n={...t,...f,date:dt,status:i?'planned':f.status,id:'t'+Date.now()+i,series:ds.length>1?sr:''};S.tasks.push(n);await api.saveTask(n);logIt('등록',n,ds.length>1?`반복 ${i+1}/${ds.length}`:'')}}d.close();render();toast('저장했습니다.')})}}

// 일반 스크립트(events.js, 탭 파일)에서 render()/openTask()를 부를 수 있게 전역에 등록
window.render=render;
window.openTask=openTask;
export { render, openTask };
