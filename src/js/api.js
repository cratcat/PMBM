// 데이터 계층: 서버(REST) 또는 데모(localStorage) 입출력 — IMP(이온주입) 전용
/* ========= 데이터 계층 (서버 ↔ 화면) ========= */

// 이 화면에서 다루는 설비 종류. 설비의 kind가 이 값인 것만 표시합니다.
const IMP_KIND='이온주입';

// 데모 데이터 (실제 설비 ID와 PM 항목으로 바꿔 쓰세요)
const mock={
  eqs:[['T4201','Bay E (고전류)'],['T4202','Bay E (고전류)'],['T4203','Bay F (중전류)'],['T4204','Bay F (고에너지)']]
    .map(([id,line])=>({id,kind:IMP_KIND,line})),
  // 파티클 데모 데이터: 이틀에 한 번꼴로 측정(약 30%는 미측정), 일부 날짜는 Spec OUT. T4201은 최근 연속 상승
  part(){const B={T4201:9,T4202:7,T4203:11,T4204:6},X={T4201:[58,33],T4202:[76],T4203:[47,12,0],T4204:[21]},F={T4201:{6:12,4:14,2:16,0:17}},
      r=(a,b)=>Math.abs(Math.sin(a*12.9898+b*78.233)*43758.5453)%1,out=[];
    Object.keys(B).forEach((eq,k)=>{for(let o=94;o>=0;o--){const x=(X[eq]||[]).includes(o),f=(F[eq]||{})[o];
      if(!x&&f===undefined&&r(o,k)<.3)continue;
      out.push({id:'p'+eq+o,eq,date:fmt(addD(today,-o)),count:x?24:f!==undefined?f:Math.round(B[eq]+r(o+1,k+9)*7),kind:'정기',note:''})}});
    return out},
  // GPM TIP 데모 데이터: Spec OUT 직후 TIP 적용. end가 null이면 현재도 적용 중
  tip(){const d=n=>fmt(addD(today,-n));return [{eq:'T4201',start:d(33),end:d(32)},{eq:'T4202',start:d(76),end:d(75)},{eq:'T4203',start:d(47),end:d(45)},{eq:'T4203',start:d(12),end:d(11)},{eq:'T4203',start:d(0),end:null},{eq:'T4204',start:d(21),end:d(21)}]},
  tasks(){return [
    [-12,'T4201','PM','소스 헤드 필라멘트 교체','done','최정비'],
    [-6,'T4202','PM','아크 챔버 클린','done','이정비'],
    [-4,'T4203','BM','빔 전류 불안정 조치','done','최정비'],
    [-1,'T4201','PM','빔라인 클린','planned','최정비'],
    [0,'T4202','BM','진공 이상(리크) 조치','progress','이정비'],
    [0,'T4204','PM','크라이오 펌프 재생','progress','박엔지니어'],
    [2,'T4203','PM','도판트 가스 라인 점검','planned','이정비'],
    [3,'T4201','PM','패러데이 컵 점검','planned','박엔지니어'],
    [5,'T4204','BM','웨이퍼 핸들링 로봇 에러 조치','planned','최정비'],
    [7,'T4202','PM','소스 헤드 필라멘트 교체','planned','최정비'],
    [10,'T4203','PM','플래튼 점검','planned','이정비'],
    [14,'T4201','PM','진공 펌프 오버홀','planned','박엔지니어'],
    [21,'T4204','PM','분석 마그넷 점검','planned','최정비']
  ].map(([o,eq,type,title,status,owner],i)=>({id:'t'+i,eq,type,title,status,owner,date:fmt(addD(today,o)),note:''}))}
};

// 저장 키에 imp를 붙여, 이전에 저장된 다른 설비 데이터와 섞이지 않게 합니다.
const store=(k,v)=>{try{if(v===undefined)return JSON.parse(localStorage.getItem(k));localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}};
const http=async(p,o={})=>{const r=await fetch(CONFIG.API_BASE+p,{...o,credentials:'include',headers:{'Content-Type':'application/json'}});if(r.status===401){S.user=null;render();throw new Error(401)}if(!r.ok)throw new Error(r.status);return r.status===204?null:r.json()};
// GPM 응답을 화면 형식 {eq, start, end|null}로 맞춥니다. GPM의 실제 필드명에 맞게 이 함수만 고치세요.
const normTip=raw=>(Array.isArray(raw)?raw:raw.items||[]).map(r=>({eq:r.eq||r.eqpId||r.equipment,start:String(r.start||r.date||r.from||'').slice(0,10),end:String(r.end||r.date||r.to||'').slice(0,10)||null})).filter(t=>t.eq&&t.start);
const api={
  async load(){
    if(CONFIG.API_BASE){[S.tasks,S.eqs,S.log,S.part]=await Promise.all([http('/tasks'),http('/equipment'),http('/logs'),http('/particles')])}
    else{S.eqs=store('fab-imp2-eqs')||mock.eqs;S.tasks=store('fab-imp2-tasks')||mock.tasks();S.log=store('fab-imp2-log')||[];S.part=store('fab-imp2-part')||mock.part()}
    // IMP 설비와 그 설비의 작업만 남깁니다.
    S.eqs=S.eqs.filter(e=>e.kind===IMP_KIND);
    const ids=new Set(S.eqs.map(e=>e.id));
    S.tasks=S.tasks.filter(t=>ids.has(t.eq));
    S.part=S.part.filter(p=>ids.has(p.eq));
  },
  // GPM TIP 조회: GPM_URL이 있으면 직접, 없고 API_BASE가 있으면 백엔드 중계(/gpm/tip), 둘 다 없으면 데모
  async loadTip(from,to){const q='/tip?from='+from+'&to='+to;
    if(CONFIG.GPM_URL){const r=await fetch(CONFIG.GPM_URL+q,{credentials:'include'});if(!r.ok)throw new Error(r.status);return normTip(await r.json())}
    if(CONFIG.API_BASE)return normTip(await http('/gpm'+q));
    return normTip(mock.tip())},
  async saveTask(t){if(CONFIG.API_BASE)await http('/tasks/'+t.id,{method:'PUT',body:JSON.stringify(t)});else store('fab-imp2-tasks',S.tasks)},
  async delTask(id){if(CONFIG.API_BASE)await http('/tasks/'+id,{method:'DELETE'});else store('fab-imp2-tasks',S.tasks)},
  async saveEq(e){if(CONFIG.API_BASE)await http('/equipment/'+e.id,{method:'PUT',body:JSON.stringify(e)});else store('fab-imp2-eqs',S.eqs)},
  async savePart(p){if(CONFIG.API_BASE)await http('/particles/'+p.id,{method:'PUT',body:JSON.stringify(p)});else store('fab-imp2-part',S.part)},
  async delPart(id){if(CONFIG.API_BASE)await http('/particles/'+id,{method:'DELETE'});else store('fab-imp2-part',S.part)},
  async addLog(l){if(CONFIG.API_BASE)await http('/logs',{method:'POST',body:JSON.stringify(l)});else store('fab-imp2-log',S.log.slice(0,500))}
};
