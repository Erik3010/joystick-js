(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const e of i)if(e.type==="childList")for(const r of e.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function s(i){const e={};return i.integrity&&(e.integrity=i.integrity),i.referrerpolicy&&(e.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?e.credentials="include":i.crossorigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function n(i){if(i.ep)return;i.ep=!0;const e=s(i);fetch(i.href,e)}})();const u=(o,t,s)=>Math.max(t,Math.min(s,o)),g=o=>o*(180/Math.PI),x=(o,t,s)=>(t/=s/2,t<1?o/2*Math.pow(t,3):(t-=2,o/2*(Math.pow(t,3)+2))),m=o=>Math.sign(o)===-1?360+o:o,p=(o,{props:t={},classList:s=[],textContent:n=null})=>{const i=document.createElement(o);for(const e in t)i.setAttribute(e,t[e]);for(const e in s)i.classList.add(s[e]);return n&&(i.textContent=n),i};class y{constructor({ctx:t,x:s,y:n,radius:i,color:e=null}){this.ctx=t,this.x=s,this.y=n,this.radius=i,this.color=e}draw(){this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(this.x,this.y,this.radius,0,2*Math.PI),this.ctx.closePath(),this.color&&(this.ctx.fillStyle=this.color,this.ctx.fill()),this.ctx.stroke(),this.ctx.restore()}}class M extends y{constructor({ctx:t,x:s,y:n,radius:i,color:e}){super({ctx:t,x:s,y:n,radius:i,color:e}),this.animateBackSpeed=10,this.currentFrame=0,this.step=30}movePosition({x:t,y:s}){this.y+=s,this.x+=t}async animate(t,s){const n={x:s.x-this.x,y:s.y-this.y},i={x:this.x,y:this.y};return new Promise(e=>{const r=()=>{if(this.currentFrame>this.step)return this.currentFrame=0,e();this.x=i.x+x(n.x,this.currentFrame,this.step),this.y=i.y+x(n.y,this.currentFrame,this.step),this.currentFrame++,requestAnimationFrame(r)};r()})}async animateV1(t,s){const n={x:Math.sign(t.x),y:Math.sign(t.y)},i=e=>this[e]<=s[e]&&n[e]===-1||this[e]>=s[e]&&n[e]===1?(this[e]=s[e],!0):(this[e]+=t[e]*this.animateBackSpeed,!1);return new Promise(e=>{const r=()=>{const c=i("x"),a=i("y");if(c&&a)return e();requestAnimationFrame(r)};r()})}}const h={UP:"UP",BOTTOM:"BOTTOM",LEFT:"LEFT",RIGHT:"RIGHT"},f={[h.UP]:{min:225,max:315},[h.BOTTOM]:{min:45,max:135},[h.LEFT]:{min:135,max:225},[h.RIGHT]:{min:315,max:45}};class C{constructor({selector:t,options:s,onMove:n}){this.defaultOptions={size:300,padding:0},this.options=Object.assign({},this.defaultOptions,s),this.onMove=n,this.selector=t,this.containerEl=document.querySelector(this.selector),this.canvas=p("canvas",{props:{width:this.options.size,height:this.options.size,id:"canvas"}}),this.ctx=this.canvas.getContext("2d"),this.containerEl.appendChild(this.canvas),this.containerSize=this.canvas.width,this.padding=this.options.padding,this.isMouseDown=!1,this.outerCircle=null,this.controlCircle=null,this.angle={radian:0,degree:0},this.force=0}get diameter(){return this.containerSize-this.padding*2}get radius(){return this.diameter/2}get controlCircleDiameter(){return 100}get controlCircleRadius(){return this.controlCircleDiameter/2}get centerCoordinate(){return{x:this.diameter/2+this.padding,y:this.diameter/2+this.padding}}init(){const{x:t,y:s}=this.centerCoordinate;this.outerCircle=new y({ctx:this.ctx,x:t,y:s,radius:this.radius}),this.controlCircle=new M({ctx:this.ctx,x:t,y:s,radius:this.controlCircleRadius,color:"rgba(0,0,0,0.5)"}),this.render(),this.registerListener()}registerListener(){this.canvas.addEventListener("mousedown",this.handleMouseDown.bind(this)),window.addEventListener("mousemove",this.handleMouseMove.bind(this)),window.addEventListener("mouseup",this.handleMouseUp.bind(this))}handleMouseDown(){this.isMouseDown=!0}handleMouseMove(t){if(!this.isMouseDown)return;const{x:s,y:n}=this.centerCoordinate,{x:i,y:e}=this.getMouseCoordinate(t),r={x:i-s,y:e-n},c=Math.hypot(r.y,r.x);this.force=c/this.radius*100;const a=this.getAngleByMouse({x:i,y:e}),d=this.getCoordinateByAngle(a),l={x:c<this.radius?i:d.x,y:c<this.radius?e:d.y};this.controlCircle.x=l.x,this.controlCircle.y=l.y,this.angle={radian:a,degree:g(a)},this.onMove({force:this.force,angle:this.angle,direction:this.direction,position:{x:this.controlCircle.x-s,y:this.controlCircle.y-n}})}async handleMouseUp(t){const{x:s,y:n}=this.centerCoordinate,{x:i,y:e}=this.getMouseCoordinate(t);this.isMouseDown=!1;const r=this.getAngleByMouse({x:i,y:e}),c={x:Math.cos(r)*-1,y:Math.sin(r)*-1};await this.controlCircle.animate(c,this.centerCoordinate),this.controlCircle.x=s,this.controlCircle.y=n}get direction(){const t=m(this.angle.degree);for(const[s,n]of Object.entries(f))if(t>n.min&&t<=n.max)return s;return h.RIGHT}getMouseCoordinate({clientX:t,clientY:s}){const{x:n,y:i}=this.canvas.getBoundingClientRect();return{x:u(t-n,0,this.canvas.width),y:u(s-i,0,this.canvas.height)}}getAngleByMouse({x:t,y:s}){const{x:n,y:i}=this.centerCoordinate;return Math.atan2(s-i,t-n)}getCoordinateByAngle(t){const{x:s,y:n}=this.centerCoordinate,i=Math.cos(t)*this.radius+s,e=Math.sin(t)*this.radius+n;return{x:i,y:e}}draw(){this.outerCircle.draw(),this.controlCircle.draw()}render(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.draw(),requestAnimationFrame(this.render.bind(this))}}const w=new C({selector:"#joystick",options:{size:300,padding:30},onMove:o=>{console.log(o)}});w.init();
