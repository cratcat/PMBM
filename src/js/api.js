// 데이터 계층: 서버(REST) 또는 데모(localStorage) 입출력
/* ========= 데이터 계층 (서버 ↔ 화면) ========= */
const mock={
  eqs:[['CVD-01','CVD','Bay A'],['ETCH-02','식각','Bay B'],['CMP-01','CMP','Bay C'],['LITH-03','노광','Bay D'],['IMP-01','이온주입','Bay E'],['CLN-02','세정','Bay C']].map(([id,kind,line])=>({id,kind,line})),
  tasks(){return [[-9,'CVD-01','PM','월간 챔버 클린','done','박엔지니어'],[-3,'ETCH-02','BM','RF 매칭 불량 교체','done','김정비'],[-1,'CMP-01','PM','패드 컨디셔너 교체','planned','최정비'],[0,'LITH-03','PM','렌즈 얼라인 점검','progress','박엔지니어'],[0,'ETCH-02','BM','가스 라인 리크','progress','김정비'],[2,'CVD-01','PM','히터 점검','planned','박엔지니어'],[3,'IMP-01','PM','소스 헤드 교체','planned','최정비'],[3,'CLN-02','PM','약액 라인 플러시','planned','이정비'],[5,'CMP-01','BM','슬러리 펌프 점검','planned','최정비'],[8,'LITH-03','PM','쿨링 시스템 점검','planned','박엔지니어'],[11,'ETCH-02','PM','월간 챔버 클린','planned','김정비'],[14,'IMP-01','PM','진공 펌프 오버홀','planned','최정비'],[18,'CVD-01','PM','월간 챔버 클린','planned','박엔지니어']].map(([o,eq,type,title,status,owner],i)=>({id:'t'+i,eq,type,title,status,owner,date:fmt(addD(today,o)),note:''}))}
};
const store=(k,v)=>{try{if(v===undefined)return JSON.parse(localStorage.getItem(k));localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}};
const http=async(p,o={})=>{const r=await fetch(CONFIG.API_BASE+p,{...o,credentials:'include',headers:{'Content-Type':'application/json'}});if(r.status===401){S.user=null;render();throw new Error(401)}if(!r.ok)throw new Error(r.status);return r.status===204?null:r.json()};
const api={
  async load(){if(CONFIG.API_BASE){[S.tasks,S.eqs,S.log]=await Promise.all([http('/tasks'),http('/equipment'),http('/logs')]);return}
    S.eqs=store('fab-eqs')||mock.eqs;S.tasks=store('fab-tasks')||mock.tasks();S.log=store('fab-log')||[]},
  async saveTask(t){if(CONFIG.API_BASE)await http('/tasks/'+t.id,{method:'PUT',body:JSON.stringify(t)});else store('fab-tasks',S.tasks)},
  async delTask(id){if(CONFIG.API_BASE)await http('/tasks/'+id,{method:'DELETE'});else store('fab-tasks',S.tasks)},
  async saveEq(e){if(CONFIG.API_BASE)await http('/equipment/'+e.id,{method:'PUT',body:JSON.stringify(e)});else store('fab-eqs',S.eqs)},
  async addLog(l){if(CONFIG.API_BASE)await http('/logs',{method:'POST',body:JSON.stringify(l)});else store('fab-log',S.log.slice(0,500))}
};
