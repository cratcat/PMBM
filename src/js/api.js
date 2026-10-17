// 데이터 계층: 서버(REST) 또는 데모(localStorage) 입출력 — IMP(이온주입) 전용
/* ========= 데이터 계층 (서버 ↔ 화면) ========= */

// 이 화면에서 다루는 설비 종류. 설비의 kind가 이 값인 것만 표시합니다.
const IMP_KIND='이온주입';

// 데모 데이터 (실제 설비 ID와 PM 항목으로 바꿔 쓰세요)
const mock={
  eqs:[['IMP-01','Bay E (고전류)'],['IMP-02','Bay E (고전류)'],['IMP-03','Bay F (중전류)'],['IMP-04','Bay F (고에너지)']]
    .map(([id,line])=>({id,kind:IMP_KIND,line})),
  tasks(){return [
    [-12,'IMP-01','PM','소스 헤드 필라멘트 교체','done','최정비'],
    [-6,'IMP-02','PM','아크 챔버 클린','done','이정비'],
    [-4,'IMP-03','BM','빔 전류 불안정 조치','done','최정비'],
    [-1,'IMP-01','PM','빔라인 클린','planned','최정비'],
    [0,'IMP-02','BM','진공 이상(리크) 조치','progress','이정비'],
    [0,'IMP-04','PM','크라이오 펌프 재생','progress','박엔지니어'],
    [2,'IMP-03','PM','도판트 가스 라인 점검','planned','이정비'],
    [3,'IMP-01','PM','패러데이 컵 점검','planned','박엔지니어'],
    [5,'IMP-04','BM','웨이퍼 핸들링 로봇 에러 조치','planned','최정비'],
    [7,'IMP-02','PM','소스 헤드 필라멘트 교체','planned','최정비'],
    [10,'IMP-03','PM','플래튼 점검','planned','이정비'],
    [14,'IMP-01','PM','진공 펌프 오버홀','planned','박엔지니어'],
    [21,'IMP-04','PM','분석 마그넷 점검','planned','최정비']
  ].map(([o,eq,type,title,status,owner],i)=>({id:'t'+i,eq,type,title,status,owner,date:fmt(addD(today,o)),note:''}))}
};

// 저장 키에 imp를 붙여, 이전에 저장된 다른 설비 데이터와 섞이지 않게 합니다.
const store=(k,v)=>{try{if(v===undefined)return JSON.parse(localStorage.getItem(k));localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}};
const http=async(p,o={})=>{const r=await fetch(CONFIG.API_BASE+p,{...o,credentials:'include',headers:{'Content-Type':'application/json'}});if(r.status===401){S.user=null;render();throw new Error(401)}if(!r.ok)throw new Error(r.status);return r.status===204?null:r.json()};
const api={
  async load(){
    if(CONFIG.API_BASE){[S.tasks,S.eqs,S.log]=await Promise.all([http('/tasks'),http('/equipment'),http('/logs')])}
    else{S.eqs=store('fab-imp-eqs')||mock.eqs;S.tasks=store('fab-imp-tasks')||mock.tasks();S.log=store('fab-imp-log')||[]}
    // IMP 설비와 그 설비의 작업만 남깁니다.
    S.eqs=S.eqs.filter(e=>e.kind===IMP_KIND);
    const ids=new Set(S.eqs.map(e=>e.id));
    S.tasks=S.tasks.filter(t=>ids.has(t.eq));
  },
  async saveTask(t){if(CONFIG.API_BASE)await http('/tasks/'+t.id,{method:'PUT',body:JSON.stringify(t)});else store('fab-imp-tasks',S.tasks)},
  async delTask(id){if(CONFIG.API_BASE)await http('/tasks/'+id,{method:'DELETE'});else store('fab-imp-tasks',S.tasks)},
  async saveEq(e){if(CONFIG.API_BASE)await http('/equipment/'+e.id,{method:'PUT',body:JSON.stringify(e)});else store('fab-imp-eqs',S.eqs)},
  async addLog(l){if(CONFIG.API_BASE)await http('/logs',{method:'POST',body:JSON.stringify(l)});else store('fab-imp-log',S.log.slice(0,500))}
};
