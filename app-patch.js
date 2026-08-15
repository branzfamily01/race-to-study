// Keep a purchased bonus race alive after its ticket is consumed.
const _goBase=go;
canRace=function(){return permanentRace()||s.raceTickets>0||(u.screen==='race'&&(u.count!==null||u.race||u.result!==null))};
go=function(x){if(u.screen==='race'&&x!=='race'){u.result=null;u.count=null}return _goBase(x)};
