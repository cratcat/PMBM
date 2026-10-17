// 탭: 설비 관리(관리자 전용)
registerTab({id:'eq',label:'설비 관리',roles:['admin'],render(){
  return `<div class="panel"><h3>설비 목록</h3><table><tr><th>설비 ID</th><th>종류</th><th>위치</th><th>작업 수</th></tr>${S.eqs.map(e=>`<tr><td>${esc(e.id)}</td><td>${esc(e.kind)}</td><td>${esc(e.line)}</td><td>${S.tasks.filter(t=>t.eq===e.id).length}</td></tr>`).join('')}</table>
  <div class="fg"><div><label class="note">설비 ID</label><input id="ne-id" placeholder="예: ETCH-04"></div><div><label class="note">종류</label><input id="ne-kind" placeholder="예: 식각"></div><div><label class="note">위치</label><input id="ne-line" placeholder="예: Bay B"></div><button class="pri" data-a="addeq">설비 추가</button></div></div>`}});
