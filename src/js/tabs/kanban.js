// 탭: 진행 현황(상태별 보드)
registerTab({id:'kan',label:'진행 현황',render(){
  const V=vis();return `<div class="bar"><b>상태별 보드</b>${filters()}</div><div class="kan">`+Object.keys(ST).map(s=>{const ts=V.filter(t=>t.status===s).sort((a,b)=>a.date.localeCompare(b.date));
    return `<div class="col" data-drop data-status="${s}"><h3>${ST[s]}<span class="note">${ts.length}건</span></h3>${ts.map(t=>chip(t,1)).join('')||'<p class="note">카드를 끌어다 놓으세요.</p>'}</div>`}).join('')+`</div>`}});
