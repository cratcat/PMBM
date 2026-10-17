// 전역 상태(S)와 권한 확인
const S={user:null,tab:'cal',m:new Date(today.getFullYear(),today.getMonth(),1),w:addD(today,-today.getDay()),f:{type:'all',eq:'all',owner:'all'},eqs:[],tasks:[],log:[],part:[]};
const can=()=>!!ROLES[S.user.role].edit;
