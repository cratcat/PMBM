// 진입점: SSO 세션 확인 후 첫 화면 렌더링
(async()=>{if(CONFIG.SSO.meUrl){try{const r=await fetch(CONFIG.SSO.meUrl,{credentials:'include'});if(r.ok){const u=await r.json();S.user={...u,role:ROLES[u.role]?u.role:'viewer'};await api.load()}}catch(e){}}render()})();
render();
