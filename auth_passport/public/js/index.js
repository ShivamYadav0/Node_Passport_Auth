let a=document.getElementById("login-box") 

let b=document.getElementById("sign-box") 
let cv=document.getElementById("card") 
let ctx=cv.getContext("2d");
let qcv=document.querySelector("#card") 
function toLogin (){
 // cv.style.animation="an5m 1s ease-in-out";
  cv.style.animation="anm2 0.3s ease-in-out";
  b.style.display="none"; 
  a.style.display="flex"; 
  
}
let cstyle = getComputedStyle(qcv)

function toSign (){
 // cv.style.animation="an5m 1s ease-in-out";
  cv.style.animation="anm 0.3s ease-in-out";//"translateX(-700px)"

  a.style.display="none"; 
  b.style.display="flex"; 
  
}



function draw(){
 //ctx.beginPath(); 
 ctx.moveTo(300,0); 
 let y=0;
 for(let i=0;i<155;i++){
   if(i<75) y+=1; 
   else if(i==75)y=y
   else y-=1;
    
 ctx.lineTo(300-3*y+y*y/100,i)
 ctx.lineWidth=0.1;
 ctx.stroke()
 ctx.fillStyle="#0fffff"
 ctx.globalAlpha=0.1;
 ctx.fill()
 
 }
 ctx.closePath();
 
}
draw()