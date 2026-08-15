// v7.2: race renderer uses the selected car's dedicated asset, not a color-filtered P1.
loadRaceSheets=function(){
 racePlayerSheet=new Image();racePlayerSheet.src=car().asset;
 raceCpuSheet=new Image();raceCpuSheet.src=cpuCar().asset;
};
drawSprite=function(ctx,img,c,x,y,w,h){
 if(!img||!img.complete||!img.naturalWidth)return false;
 ctx.drawImage(img,x,y,w,h);return true;
};
