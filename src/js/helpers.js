// 화면 공용 도구: 토스트, 탭 등록, 필터, 이력 기록, 반복 일정, 엑셀 내보내기
const toast=m=>{const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.display='none',1800)};
const guard=async f=>{try{await f()}catch(e){toast('서버 저장에 실패했습니다. 다시 시도해 주세요.')}};

/* ========= 탭 등록: 기능 추가 = registerTab 한 줄 ========= */
const TABS=[];const registerTab=t=>TABS.push(t);
const vis=()=>S.tasks.filter(t=>(S.f.type==='all'||t.type===S.f.type)&&(S.f.eq==='all'||t.eq===S.f.eq)&&(S.f.owner==='all'||t.owner===S.f.owner));
const KL={title:'제목',eq:'설비',type:'구분',date:'날짜',status:'상태',owner:'담당자'},sv=(k,x)=>k==='status'?ST[x]:x;
const diff=(a,b)=>Object.keys(KL).filter(k=>a[k]!==b[k]).map(k=>`${KL[k]} ${sv(k,a[k])}→${sv(k,b[k])}`).join(', ');
const now=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return fmt(d)+' '+p(d.getHours())+':'+p(d.getMinutes())};
const logIt=(act,t,detail='')=>{const l={at:now(),user:S.user.name,act,id:t.id,eq:t.eq,title:t.title,detail};S.log.unshift(l);api.addLog(l).catch(()=>{})};
const recur=(d,rep,n)=>{if(!rep||rep==='0')return[d];const x=parseInt(rep),u=rep.slice(-1),b=new Date(d+'T00:00');return[...Array(n)].map((_,i)=>{const z=new Date(b);u==='d'?z.setDate(b.getDate()+x*i):z.setMonth(b.getMonth()+x*i);return fmt(z)})};
const tplBar=()=>can()?`<div class="tpl"><span class="note">템플릿을 끌어다 놓아 작업 만들기</span>${TPL.map((p,i)=>`<div class="chip ${p[1]}" draggable="true" data-tpl="${i}">${p[1]} ${esc(p[0])}</div>`).join('')}</div>`:'';
const xls=()=>{try{const wb=XLSX.utils.book_new(),T=vis().sort((a,b)=>a.date.localeCompare(b.date)).map(t=>({설비:t.eq,구분:t.type,제목:t.title,날짜:t.date,상태:ST[t.status],담당자:t.owner,메모:t.note,반복:t.series?'Y':''})),L=S.log.map(l=>({일시:l.at,사용자:l.user,작업:l.act,설비:l.eq,제목:l.title,내용:l.detail}));XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(T),'작업');XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(L),'이력');XLSX.writeFile(wb,'PM_BM_'+TK+'.xlsx');toast('현재 필터 기준으로 내보냈습니다.')}catch(e){toast('엑셀 내보내기에 실패했습니다. 새로고침 후 다시 시도해 주세요.')}};
const late=t=>t.status!=='done'&&t.date<TK;
const chip=(t,card)=>`<div class="chip ${t.type} ${late(t)?'late':''} ${card?'card':''} ${can()?'':'ro'}" draggable="${can()}" data-id="${t.id}" title="${esc(t.eq+' '+t.title)}"><span class="s ${t.status}"></span>${card?`<b>${esc(t.eq)}</b> ${esc(t.title)}<small>${t.type} · ${esc(t.owner)} · ${t.date}</small>`:esc(t.eq)+' '+esc(t.title)}</div>`;
const filters=()=>`<span class="sp"></span><select data-f="type"><option value="all">PM+BM 전체</option><option value="PM"${S.f.type==='PM'?' selected':''}>PM만</option><option value="BM"${S.f.type==='BM'?' selected':''}>BM만</option></select><select data-f="eq"><option value="all">전체 설비</option>${S.eqs.map(e=>`<option${S.f.eq===e.id?' selected':''}>${esc(e.id)}</option>`).join('')}</select><select data-f="owner"><option value="all">전체 담당자</option>${[...new Set(S.tasks.map(t=>t.owner))].sort().map(o=>`<option${S.f.owner===o?' selected':''}>${esc(o)}</option>`).join('')}</select>`;
