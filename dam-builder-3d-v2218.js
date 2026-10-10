(()=>{var $h=0,lc=1,Qh=2;var Br=1,fo=2,Vs=3,Ci=0,$t=1,sn=2,Zn=0,Ii=1,cc=2,hc=3,uc=4,jh=5;var Ki=100,eu=101,tu=102,nu=103,iu=104,su=200,ru=201,au=202,ou=203,dc=204,fc=205,lu=206,cu=207,hu=208,uu=209,du=210,fu=211,pu=212,mu=213,gu=214,Ia=0,Pa=1,La=2,Ts=3,Da=4,Na=5,Ua=6,Fa=7,pc=0,xu=1,_u=2,Bn=0,mc=1,gc=2,xc=3,zr=4,_c=5,vc=6,yc=7;var Mc=300,Pi=301,$i=302,po=303,mo=304,kr=306,wi=1e3,Wn=1001,Oa=1002,Zt=1003,vu=1004;var Vr=1005;var kt=1006,go=1007;var Tn=1008;var dn=1009,bc=1010,Sc=1011,Gs=1012,xo=1013,zn=1014,An=1015,vn=1016,_o=1017,vo=1018,Hs=1020,wc=35902,Ec=35899,Tc=1021,Ac=1022,Rn=1023,Xn=1026,Li=1027,yo=1028,Mo=1029,Di=1030,bo=1031;var So=1033,Gr=33776,Hr=33777,Wr=33778,Xr=33779,wo=35840,Eo=35841,To=35842,Ao=35843,Ro=36196,Co=37492,Io=37496,Po=37488,Lo=37489,qr=37490,Do=37491,No=37808,Uo=37809,Fo=37810,Oo=37811,Bo=37812,zo=37813,ko=37814,Vo=37815,Go=37816,Ho=37817,Wo=37818,Xo=37819,qo=37820,Yo=37821,Zo=36492,Jo=36494,Ko=36495,$o=36283,Qo=36284,Yr=36285,jo=36286;var ur=2300,Ba=2301,Ra=2302,Zl=2303,Jl=2400,Kl=2401,$l=2402;var yu=3200;var el=0,Mu=1,ci="",Jt="srgb",dr="srgb-linear",fr="linear",Mt="srgb";var Ca=7680;var bu=519,Su=512,wu=513,Eu=514,tl=515,Tu=516,Au=517,nl=518,Ru=519,Cu=35044,Zr=35048;var Rc="300 es",Un=2e3,As=2001;function lf(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function cf(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function pr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Iu(){let i=pr("canvas");return i.style.display="block",i}var _h={},Rs=null;function Cc(...i){let e="THREE."+i.shift();Rs?Rs("log",e,...i):console.log(e,...i)}function Pu(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ke(...i){i=Pu(i);let e="THREE."+i.shift();if(Rs)Rs("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Je(...i){i=Pu(i);let e="THREE."+i.shift();if(Rs)Rs("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Gi(...i){let e=i.join(" ");e in _h||(_h[e]=!0,Ke(...i))}function Lu(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Du={[Ia]:Pa,[La]:Ua,[Da]:Fa,[Ts]:Na,[Pa]:Ia,[Ua]:La,[Fa]:Da,[Na]:Ts},qn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var bl=Math.PI/180,za=180/Math.PI;function Ws(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(tn[i&255]+tn[i>>8&255]+tn[i>>16&255]+tn[i>>24&255]+"-"+tn[e&255]+tn[e>>8&255]+"-"+tn[e>>16&15|64]+tn[e>>24&255]+"-"+tn[t&63|128]+tn[t>>8&255]+"-"+tn[t>>16&255]+tn[t>>24&255]+tn[n&255]+tn[n>>8&255]+tn[n>>16&255]+tn[n>>24&255]).toLowerCase()}function ct(i,e,t){return Math.max(e,Math.min(t,i))}function hf(i,e){return(i%e+e)%e}function Sl(i,e,t){return(1-t)*i+t*e}function tr(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function hn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Uc=class Uc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ct(this.x,e.x,t.x),this.y=ct(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ct(this.x,e,t),this.y=ct(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ct(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Uc.prototype.isVector2=!0;var ye=Uc,wn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],d=n[s+2],f=n[s+3],h=r[a+0],m=r[a+1],x=r[a+2],b=r[a+3];if(f!==b||l!==h||c!==m||d!==x){let p=l*h+c*m+d*x+f*b;p<0&&(h=-h,m=-m,x=-x,b=-b,p=-p);let u=1-o;if(p<.9995){let y=Math.acos(p),v=Math.sin(y);u=Math.sin(u*y)/v,o=Math.sin(o*y)/v,l=l*u+h*o,c=c*u+m*o,d=d*u+x*o,f=f*u+b*o}else{l=l*u+h*o,c=c*u+m*o,d=d*u+x*o,f=f*u+b*o;let y=1/Math.sqrt(l*l+c*c+d*d+f*f);l*=y,c*=y,d*=y,f*=y}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],d=n[s+3],f=r[a],h=r[a+1],m=r[a+2],x=r[a+3];return e[t]=o*x+d*f+l*m-c*h,e[t+1]=l*x+d*h+c*f-o*m,e[t+2]=c*x+d*m+o*h-l*f,e[t+3]=d*x-o*f-l*h-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),d=o(s/2),f=o(r/2),h=l(n/2),m=l(s/2),x=l(r/2);switch(a){case"XYZ":this._x=h*d*f+c*m*x,this._y=c*m*f-h*d*x,this._z=c*d*x+h*m*f,this._w=c*d*f-h*m*x;break;case"YXZ":this._x=h*d*f+c*m*x,this._y=c*m*f-h*d*x,this._z=c*d*x-h*m*f,this._w=c*d*f+h*m*x;break;case"ZXY":this._x=h*d*f-c*m*x,this._y=c*m*f+h*d*x,this._z=c*d*x+h*m*f,this._w=c*d*f-h*m*x;break;case"ZYX":this._x=h*d*f-c*m*x,this._y=c*m*f+h*d*x,this._z=c*d*x-h*m*f,this._w=c*d*f+h*m*x;break;case"YZX":this._x=h*d*f+c*m*x,this._y=c*m*f+h*d*x,this._z=c*d*x-h*m*f,this._w=c*d*f-h*m*x;break;case"XZY":this._x=h*d*f-c*m*x,this._y=c*m*f-h*d*x,this._z=c*d*x+h*m*f,this._w=c*d*f+h*m*x;break;default:Ke("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],d=t[6],f=t[10],h=n+o+f;if(h>0){let m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(d-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(n>o&&n>f){let m=2*Math.sqrt(1+n-o-f);this._w=(d-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>f){let m=2*Math.sqrt(1+o-n-f);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+d)/m}else{let m=2*Math.sqrt(1+f-n-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ct(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=n*d+a*o+s*c-r*l,this._y=s*d+a*l+r*o-n*c,this._z=r*d+a*c+n*l-s*o,this._w=a*d-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),d=Math.sin(c);l=Math.sin(l*c)/d,t=Math.sin(t*c)/d,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Fc=class Fc{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(vh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(vh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),d=2*(o*t-r*s),f=2*(r*n-a*t);return this.x=t+l*c+a*f-o*d,this.y=n+l*d+o*c-r*f,this.z=s+l*f+r*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ct(this.x,e.x,t.x),this.y=ct(this.y,e.y,t.y),this.z=ct(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ct(this.x,e,t),this.y=ct(this.y,e,t),this.z=ct(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ct(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return wl.copy(this).projectOnVector(e),this.sub(wl)}reflect(e){return this.sub(wl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Fc.prototype.isVector3=!0;var O=Fc,wl=new O,vh=new wn,Oc=class Oc{constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=l,d[6]=n,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],d=n[4],f=n[7],h=n[2],m=n[5],x=n[8],b=s[0],p=s[3],u=s[6],y=s[1],v=s[4],_=s[7],E=s[2],w=s[5],T=s[8];return r[0]=a*b+o*y+l*E,r[3]=a*p+o*v+l*w,r[6]=a*u+o*_+l*T,r[1]=c*b+d*y+f*E,r[4]=c*p+d*v+f*w,r[7]=c*u+d*_+f*T,r[2]=h*b+m*y+x*E,r[5]=h*p+m*v+x*w,r[8]=h*u+m*_+x*T,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*a*d-t*o*c-n*r*d+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],f=d*a-o*c,h=o*l-d*r,m=c*r-a*l,x=t*f+n*h+s*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);let b=1/x;return e[0]=f*b,e[1]=(s*c-d*n)*b,e[2]=(o*n-s*a)*b,e[3]=h*b,e[4]=(d*t-s*l)*b,e[5]=(s*r-o*t)*b,e[6]=m*b,e[7]=(n*l-c*t)*b,e[8]=(a*t-n*r)*b,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Gi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(El.makeScale(e,t)),this}rotate(e){return Gi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(El.makeRotation(-e)),this}translate(e,t){return Gi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(El.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Oc.prototype.isMatrix3=!0;var et=Oc,El=new et,yh=new et().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Mh=new et().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function uf(){let i={enabled:!0,workingColorSpace:dr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Mt&&(s.r=ii(s.r),s.g=ii(s.g),s.b=ii(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Mt&&(s.r=Es(s.r),s.g=Es(s.g),s.b=Es(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ci?fr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Gi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Gi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[dr]:{primaries:e,whitePoint:n,transfer:fr,toXYZ:yh,fromXYZ:Mh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Jt},outputColorSpaceConfig:{drawingBufferColorSpace:Jt}},[Jt]:{primaries:e,whitePoint:n,transfer:Mt,toXYZ:yh,fromXYZ:Mh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Jt}}}),i}var dt=uf();function ii(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Es(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var us,ka=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{us===void 0&&(us=pr("canvas")),us.width=e.width,us.height=e.height;let s=us.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=us}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=pr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ii(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ii(t[n]/255)*255):t[n]=ii(t[n]);return{data:t,width:e.width,height:e.height}}else return Ke("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},df=0,Cs=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:df++}),this.uuid=Ws(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Tl(s[a].image)):r.push(Tl(s[a]))}else r=Tl(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Tl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ka.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ke("Texture: Unable to serialize Texture."),{})}var ff=0,Al=new O,cn=class i extends qn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Wn,s=Wn,r=kt,a=Tn,o=Rn,l=dn,c=i.DEFAULT_ANISOTROPY,d=ci){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ff++}),this.uuid=Ws(),this.name="",this.source=new Cs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ye(0,0),this.repeat=new ye(1,1),this.center=new ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new et,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Al).x}get height(){return this.source.getSize(Al).y}get depth(){return this.source.getSize(Al).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ke(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ke(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Mc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case wi:e.x=e.x-Math.floor(e.x);break;case Wn:e.x=e.x<0?0:1;break;case Oa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case wi:e.y=e.y-Math.floor(e.y);break;case Wn:e.y=e.y<0?0:1;break;case Oa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};cn.DEFAULT_IMAGE=null;cn.DEFAULT_MAPPING=Mc;cn.DEFAULT_ANISOTROPY=1;var Bc=class Bc{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],d=l[4],f=l[8],h=l[1],m=l[5],x=l[9],b=l[2],p=l[6],u=l[10];if(Math.abs(d-h)<.01&&Math.abs(f-b)<.01&&Math.abs(x-p)<.01){if(Math.abs(d+h)<.1&&Math.abs(f+b)<.1&&Math.abs(x+p)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(c+1)/2,_=(m+1)/2,E=(u+1)/2,w=(d+h)/4,T=(f+b)/4,g=(x+p)/4;return v>_&&v>E?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=w/n,r=T/n):_>E?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=w/s,r=g/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=T/r,s=g/r),this.set(n,s,r,t),this}let y=Math.sqrt((p-x)*(p-x)+(f-b)*(f-b)+(h-d)*(h-d));return Math.abs(y)<.001&&(y=1),this.x=(p-x)/y,this.y=(f-b)/y,this.z=(h-d)/y,this.w=Math.acos((c+m+u-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ct(this.x,e.x,t.x),this.y=ct(this.y,e.y,t.y),this.z=ct(this.z,e.z,t.z),this.w=ct(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ct(this.x,e,t),this.y=ct(this.y,e,t),this.z=ct(this.z,e,t),this.w=ct(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ct(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Bc.prototype.isVector4=!0;var It=Bc,Va=class extends qn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:kt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new It(0,0,e,t),this.scissorTest=!1,this.viewport=new It(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new cn(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:kt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Cs(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},un=class extends Va{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},mr=class extends cn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=Wn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ga=class extends cn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=Wn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var uo=class uo{constructor(e,t,n,s,r,a,o,l,c,d,f,h,m,x,b,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,d,f,h,m,x,b,p)}set(e,t,n,s,r,a,o,l,c,d,f,h,m,x,b,p){let u=this.elements;return u[0]=e,u[4]=t,u[8]=n,u[12]=s,u[1]=r,u[5]=a,u[9]=o,u[13]=l,u[2]=c,u[6]=d,u[10]=f,u[14]=h,u[3]=m,u[7]=x,u[11]=b,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new uo().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/ds.setFromMatrixColumn(e,0).length(),r=1/ds.setFromMatrixColumn(e,1).length(),a=1/ds.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),d=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){let h=a*d,m=a*f,x=o*d,b=o*f;t[0]=l*d,t[4]=-l*f,t[8]=c,t[1]=m+x*c,t[5]=h-b*c,t[9]=-o*l,t[2]=b-h*c,t[6]=x+m*c,t[10]=a*l}else if(e.order==="YXZ"){let h=l*d,m=l*f,x=c*d,b=c*f;t[0]=h+b*o,t[4]=x*o-m,t[8]=a*c,t[1]=a*f,t[5]=a*d,t[9]=-o,t[2]=m*o-x,t[6]=b+h*o,t[10]=a*l}else if(e.order==="ZXY"){let h=l*d,m=l*f,x=c*d,b=c*f;t[0]=h-b*o,t[4]=-a*f,t[8]=x+m*o,t[1]=m+x*o,t[5]=a*d,t[9]=b-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let h=a*d,m=a*f,x=o*d,b=o*f;t[0]=l*d,t[4]=x*c-m,t[8]=h*c+b,t[1]=l*f,t[5]=b*c+h,t[9]=m*c-x,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let h=a*l,m=a*c,x=o*l,b=o*c;t[0]=l*d,t[4]=b-h*f,t[8]=x*f+m,t[1]=f,t[5]=a*d,t[9]=-o*d,t[2]=-c*d,t[6]=m*f+x,t[10]=h-b*f}else if(e.order==="XZY"){let h=a*l,m=a*c,x=o*l,b=o*c;t[0]=l*d,t[4]=-f,t[8]=c*d,t[1]=h*f+b,t[5]=a*d,t[9]=m*f-x,t[2]=x*f-m,t[6]=o*d,t[10]=b*f+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(pf,e,mf)}lookAt(e,t,n){let s=this.elements;return fn.subVectors(e,t),fn.lengthSq()===0&&(fn.z=1),fn.normalize(),_i.crossVectors(n,fn),_i.lengthSq()===0&&(Math.abs(n.z)===1?fn.x+=1e-4:fn.z+=1e-4,fn.normalize(),_i.crossVectors(n,fn)),_i.normalize(),sa.crossVectors(fn,_i),s[0]=_i.x,s[4]=sa.x,s[8]=fn.x,s[1]=_i.y,s[5]=sa.y,s[9]=fn.y,s[2]=_i.z,s[6]=sa.z,s[10]=fn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],d=n[1],f=n[5],h=n[9],m=n[13],x=n[2],b=n[6],p=n[10],u=n[14],y=n[3],v=n[7],_=n[11],E=n[15],w=s[0],T=s[4],g=s[8],M=s[12],A=s[1],C=s[5],I=s[9],P=s[13],L=s[2],F=s[6],N=s[10],B=s[14],Z=s[3],Y=s[7],Q=s[11],q=s[15];return r[0]=a*w+o*A+l*L+c*Z,r[4]=a*T+o*C+l*F+c*Y,r[8]=a*g+o*I+l*N+c*Q,r[12]=a*M+o*P+l*B+c*q,r[1]=d*w+f*A+h*L+m*Z,r[5]=d*T+f*C+h*F+m*Y,r[9]=d*g+f*I+h*N+m*Q,r[13]=d*M+f*P+h*B+m*q,r[2]=x*w+b*A+p*L+u*Z,r[6]=x*T+b*C+p*F+u*Y,r[10]=x*g+b*I+p*N+u*Q,r[14]=x*M+b*P+p*B+u*q,r[3]=y*w+v*A+_*L+E*Z,r[7]=y*T+v*C+_*F+E*Y,r[11]=y*g+v*I+_*N+E*Q,r[15]=y*M+v*P+_*B+E*q,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],f=e[6],h=e[10],m=e[14],x=e[3],b=e[7],p=e[11],u=e[15],y=l*m-c*h,v=o*m-c*f,_=o*h-l*f,E=a*m-c*d,w=a*h-l*d,T=a*f-o*d;return t*(b*y-p*v+u*_)-n*(x*y-p*E+u*w)+s*(x*v-b*E+u*T)-r*(x*_-b*w+p*T)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],d=e[10];return t*(a*d-o*c)-n*(r*d-o*l)+s*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],f=e[9],h=e[10],m=e[11],x=e[12],b=e[13],p=e[14],u=e[15],y=t*o-n*a,v=t*l-s*a,_=t*c-r*a,E=n*l-s*o,w=n*c-r*o,T=s*c-r*l,g=d*b-f*x,M=d*p-h*x,A=d*u-m*x,C=f*p-h*b,I=f*u-m*b,P=h*u-m*p,L=y*P-v*I+_*C+E*A-w*M+T*g;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let F=1/L;return e[0]=(o*P-l*I+c*C)*F,e[1]=(s*I-n*P-r*C)*F,e[2]=(b*T-p*w+u*E)*F,e[3]=(h*w-f*T-m*E)*F,e[4]=(l*A-a*P-c*M)*F,e[5]=(t*P-s*A+r*M)*F,e[6]=(p*_-x*T-u*v)*F,e[7]=(d*T-h*_+m*v)*F,e[8]=(a*I-o*A+c*g)*F,e[9]=(n*A-t*I-r*g)*F,e[10]=(x*w-b*_+u*y)*F,e[11]=(f*_-d*w-m*y)*F,e[12]=(o*M-a*C-l*g)*F,e[13]=(t*C-n*M+s*g)*F,e[14]=(b*v-x*E-p*y)*F,e[15]=(d*E-f*v+h*y)*F,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,d=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,d*o+n,d*l-s*a,0,c*l-s*o,d*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,d=a+a,f=o+o,h=r*c,m=r*d,x=r*f,b=a*d,p=a*f,u=o*f,y=l*c,v=l*d,_=l*f,E=n.x,w=n.y,T=n.z;return s[0]=(1-(b+u))*E,s[1]=(m+_)*E,s[2]=(x-v)*E,s[3]=0,s[4]=(m-_)*w,s[5]=(1-(h+u))*w,s[6]=(p+y)*w,s[7]=0,s[8]=(x+v)*T,s[9]=(p-y)*T,s[10]=(1-(h+b))*T,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=ds.set(s[0],s[1],s[2]).length(),o=ds.set(s[4],s[5],s[6]).length(),l=ds.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Pn.copy(this);let c=1/a,d=1/o,f=1/l;return Pn.elements[0]*=c,Pn.elements[1]*=c,Pn.elements[2]*=c,Pn.elements[4]*=d,Pn.elements[5]*=d,Pn.elements[6]*=d,Pn.elements[8]*=f,Pn.elements[9]*=f,Pn.elements[10]*=f,t.setFromRotationMatrix(Pn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=Un,l=!1){let c=this.elements,d=2*r/(t-e),f=2*r/(n-s),h=(t+e)/(t-e),m=(n+s)/(n-s),x,b;if(l)x=r/(a-r),b=a*r/(a-r);else if(o===Un)x=-(a+r)/(a-r),b=-2*a*r/(a-r);else if(o===As)x=-a/(a-r),b=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=f,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=x,c[14]=b,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Un,l=!1){let c=this.elements,d=2/(t-e),f=2/(n-s),h=-(t+e)/(t-e),m=-(n+s)/(n-s),x,b;if(l)x=1/(a-r),b=a/(a-r);else if(o===Un)x=-2/(a-r),b=-(a+r)/(a-r);else if(o===As)x=-1/(a-r),b=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=f,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=x,c[14]=b,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};uo.prototype.isMatrix4=!0;var gt=uo,ds=new O,Pn=new gt,pf=new O(0,0,0),mf=new O(1,1,1),_i=new O,sa=new O,fn=new O,bh=new gt,Sh=new wn,Fn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],d=s[9],f=s[2],h=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(ct(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ct(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(ct(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ct(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ct(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-ct(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,m),this._y=0);break;default:Ke("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return bh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(bh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Sh.setFromEuler(this),this.setFromQuaternion(Sh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Fn.DEFAULT_ORDER="XYZ";var Is=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},gf=0,wh=new O,fs=new wn,Qn=new gt,ra=new O,nr=new O,xf=new O,_f=new wn,Eh=new O(1,0,0),Th=new O(0,1,0),Ah=new O(0,0,1),Rh={type:"added"},vf={type:"removed"},ps={type:"childadded",child:null},Rl={type:"childremoved",child:null},Ot=class i extends qn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:gf++}),this.uuid=Ws(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new O,t=new Fn,n=new wn,s=new O(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new gt},normalMatrix:{value:new et}}),this.matrix=new gt,this.matrixWorld=new gt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Is,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return fs.setFromAxisAngle(e,t),this.quaternion.multiply(fs),this}rotateOnWorldAxis(e,t){return fs.setFromAxisAngle(e,t),this.quaternion.premultiply(fs),this}rotateX(e){return this.rotateOnAxis(Eh,e)}rotateY(e){return this.rotateOnAxis(Th,e)}rotateZ(e){return this.rotateOnAxis(Ah,e)}translateOnAxis(e,t){return wh.copy(e).applyQuaternion(this.quaternion),this.position.add(wh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Eh,e)}translateY(e){return this.translateOnAxis(Th,e)}translateZ(e){return this.translateOnAxis(Ah,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Qn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ra.copy(e):ra.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),nr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Qn.lookAt(nr,ra,this.up):Qn.lookAt(ra,nr,this.up),this.quaternion.setFromRotationMatrix(Qn),s&&(Qn.extractRotation(s.matrixWorld),fs.setFromRotationMatrix(Qn),this.quaternion.premultiply(fs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Je("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Rh),ps.child=e,this.dispatchEvent(ps),ps.child=null):Je("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(vf),Rl.child=e,this.dispatchEvent(Rl),Rl.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Qn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Qn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Qn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Rh),ps.child=e,this.dispatchEvent(ps),ps.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nr,e,xf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nr,_f,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){let f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),f=a(e.shapes),h=a(e.skeletons),m=a(e.animations),x=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),d.length>0&&(n.images=d),f.length>0&&(n.shapes=f),h.length>0&&(n.skeletons=h),m.length>0&&(n.animations=m),x.length>0&&(n.nodes=x)}return n.object=s,n;function a(o){let l=[];for(let c in o){let d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Ot.DEFAULT_UP=new O(0,1,0);Ot.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var rt=class extends Ot{constructor(){super(),this.isGroup=!0,this.type="Group"}},yf={type:"move"},Ps=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new rt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new rt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new rt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let b of e.hand.values()){let p=t.getJointPose(b,n),u=this._getHandJoint(c,b);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}let d=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=d.position.distanceTo(f.position),m=.02,x=.005;c.inputState.pinching&&h>m+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=m-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(yf)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new rt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Nu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},vi={h:0,s:0,l:0},aa={h:0,s:0,l:0};function Cl(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Ce=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Jt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,dt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=dt.workingColorSpace){return this.r=e,this.g=t,this.b=n,dt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=dt.workingColorSpace){if(e=hf(e,1),t=ct(t,0,1),n=ct(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Cl(a,r,e+1/3),this.g=Cl(a,r,e),this.b=Cl(a,r,e-1/3)}return dt.colorSpaceToWorking(this,s),this}setStyle(e,t=Jt){function n(r){r!==void 0&&parseFloat(r)<1&&Ke("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ke("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ke("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Jt){let n=Nu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ke("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ii(e.r),this.g=ii(e.g),this.b=ii(e.b),this}copyLinearToSRGB(e){return this.r=Es(e.r),this.g=Es(e.g),this.b=Es(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Jt){return dt.workingToColorSpace(nn.copy(this),e),Math.round(ct(nn.r*255,0,255))*65536+Math.round(ct(nn.g*255,0,255))*256+Math.round(ct(nn.b*255,0,255))}getHexString(e=Jt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=dt.workingColorSpace){dt.workingToColorSpace(nn.copy(this),t);let n=nn.r,s=nn.g,r=nn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,d=(o+a)/2;if(o===a)l=0,c=0;else{let f=a-o;switch(c=d<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=dt.workingColorSpace){return dt.workingToColorSpace(nn.copy(this),t),e.r=nn.r,e.g=nn.g,e.b=nn.b,e}getStyle(e=Jt){dt.workingToColorSpace(nn.copy(this),e);let t=nn.r,n=nn.g,s=nn.b;return e!==Jt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(vi),this.setHSL(vi.h+e,vi.s+t,vi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(vi),e.getHSL(aa);let n=Sl(vi.h,aa.h,t),s=Sl(vi.s,aa.s,t),r=Sl(vi.l,aa.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},nn=new Ce;Ce.NAMES=Nu;var gr=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ce(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var Hi=class extends Ot{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Fn,this.environmentIntensity=1,this.environmentRotation=new Fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Ln=new O,jn=new O,Il=new O,ei=new O,ms=new O,gs=new O,Ch=new O,Pl=new O,Ll=new O,Dl=new O,Nl=new It,Ul=new It,Fl=new It,Si=class i{constructor(e=new O,t=new O,n=new O){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Ln.subVectors(e,t),s.cross(Ln);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Ln.subVectors(s,t),jn.subVectors(n,t),Il.subVectors(e,t);let a=Ln.dot(Ln),o=Ln.dot(jn),l=Ln.dot(Il),c=jn.dot(jn),d=jn.dot(Il),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;let h=1/f,m=(c*l-o*d)*h,x=(a*d-o*l)*h;return r.set(1-m-x,x,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,ei)===null?!1:ei.x>=0&&ei.y>=0&&ei.x+ei.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,ei)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ei.x),l.addScaledVector(a,ei.y),l.addScaledVector(o,ei.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return Nl.setScalar(0),Ul.setScalar(0),Fl.setScalar(0),Nl.fromBufferAttribute(e,t),Ul.fromBufferAttribute(e,n),Fl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Nl,r.x),a.addScaledVector(Ul,r.y),a.addScaledVector(Fl,r.z),a}static isFrontFacing(e,t,n,s){return Ln.subVectors(n,t),jn.subVectors(e,t),Ln.cross(jn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ln.subVectors(this.c,this.b),jn.subVectors(this.a,this.b),Ln.cross(jn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;ms.subVectors(s,n),gs.subVectors(r,n),Pl.subVectors(e,n);let l=ms.dot(Pl),c=gs.dot(Pl);if(l<=0&&c<=0)return t.copy(n);Ll.subVectors(e,s);let d=ms.dot(Ll),f=gs.dot(Ll);if(d>=0&&f<=d)return t.copy(s);let h=l*f-d*c;if(h<=0&&l>=0&&d<=0)return a=l/(l-d),t.copy(n).addScaledVector(ms,a);Dl.subVectors(e,r);let m=ms.dot(Dl),x=gs.dot(Dl);if(x>=0&&m<=x)return t.copy(r);let b=m*c-l*x;if(b<=0&&c>=0&&x<=0)return o=c/(c-x),t.copy(n).addScaledVector(gs,o);let p=d*x-m*f;if(p<=0&&f-d>=0&&m-x>=0)return Ch.subVectors(r,s),o=(f-d)/(f-d+(m-x)),t.copy(s).addScaledVector(Ch,o);let u=1/(p+b+h);return a=b*u,o=h*u,t.copy(n).addScaledVector(ms,a).addScaledVector(gs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Yn=class{constructor(e=new O(1/0,1/0,1/0),t=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Dn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Dn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Dn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Dn):Dn.fromBufferAttribute(r,a),Dn.applyMatrix4(e.matrixWorld),this.expandByPoint(Dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),oa.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),oa.copy(n.boundingBox)),oa.applyMatrix4(e.matrixWorld),this.union(oa)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Dn),Dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ir),la.subVectors(this.max,ir),xs.subVectors(e.a,ir),_s.subVectors(e.b,ir),vs.subVectors(e.c,ir),yi.subVectors(_s,xs),Mi.subVectors(vs,_s),Oi.subVectors(xs,vs);let t=[0,-yi.z,yi.y,0,-Mi.z,Mi.y,0,-Oi.z,Oi.y,yi.z,0,-yi.x,Mi.z,0,-Mi.x,Oi.z,0,-Oi.x,-yi.y,yi.x,0,-Mi.y,Mi.x,0,-Oi.y,Oi.x,0];return!Ol(t,xs,_s,vs,la)||(t=[1,0,0,0,1,0,0,0,1],!Ol(t,xs,_s,vs,la))?!1:(ca.crossVectors(yi,Mi),t=[ca.x,ca.y,ca.z],Ol(t,xs,_s,vs,la))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ti[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ti[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ti[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ti[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ti[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ti[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ti[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ti[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ti),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ti=[new O,new O,new O,new O,new O,new O,new O,new O],Dn=new O,oa=new Yn,xs=new O,_s=new O,vs=new O,yi=new O,Mi=new O,Oi=new O,ir=new O,la=new O,ca=new O,Bi=new O;function Ol(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Bi.fromArray(i,r);let o=s.x*Math.abs(Bi.x)+s.y*Math.abs(Bi.y)+s.z*Math.abs(Bi.z),l=e.dot(Bi),c=t.dot(Bi),d=n.dot(Bi);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}var zt=new O,ha=new ye,Mf=0,Yt=class extends qn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Mf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Cu,this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ha.fromBufferAttribute(this,t),ha.applyMatrix3(e),this.setXY(t,ha.x,ha.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyMatrix3(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyMatrix4(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyNormalMatrix(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.transformDirection(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=tr(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=hn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=tr(t,this.array)),t}setX(e,t){return this.normalized&&(t=hn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=tr(t,this.array)),t}setY(e,t){return this.normalized&&(t=hn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=tr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=hn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=tr(t,this.array)),t}setW(e,t){return this.normalized&&(t=hn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=hn(t,this.array),n=hn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=hn(t,this.array),n=hn(n,this.array),s=hn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=hn(t,this.array),n=hn(n,this.array),s=hn(s,this.array),r=hn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var xr=class extends Yt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var _r=class extends Yt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Xe=class extends Yt{constructor(e,t,n){super(new Float32Array(e),t,n)}},bf=new Yn,sr=new O,Bl=new O,si=class{constructor(e=new O,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):bf.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;sr.subVectors(e,this.center);let t=sr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(sr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Bl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(sr.copy(e.center).add(Bl)),this.expandByPoint(sr.copy(e.center).sub(Bl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Sf=0,Sn=new gt,zl=new Ot,ys=new O,pn=new Yn,rr=new Yn,qt=new O,St=class i extends qn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Sf++}),this.uuid=Ws(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(lf(e)?_r:xr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new et().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Sn.makeRotationFromQuaternion(e),this.applyMatrix4(Sn),this}rotateX(e){return Sn.makeRotationX(e),this.applyMatrix4(Sn),this}rotateY(e){return Sn.makeRotationY(e),this.applyMatrix4(Sn),this}rotateZ(e){return Sn.makeRotationZ(e),this.applyMatrix4(Sn),this}translate(e,t,n){return Sn.makeTranslation(e,t,n),this.applyMatrix4(Sn),this}scale(e,t,n){return Sn.makeScale(e,t,n),this.applyMatrix4(Sn),this}lookAt(e){return zl.lookAt(e),zl.updateMatrix(),this.applyMatrix4(zl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ys).negate(),this.translate(ys.x,ys.y,ys.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Xe(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ke("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Yn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];pn.setFromBufferAttribute(r),this.morphTargetsRelative?(qt.addVectors(this.boundingBox.min,pn.min),this.boundingBox.expandByPoint(qt),qt.addVectors(this.boundingBox.max,pn.max),this.boundingBox.expandByPoint(qt)):(this.boundingBox.expandByPoint(pn.min),this.boundingBox.expandByPoint(pn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Je('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new si);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(e){let n=this.boundingSphere.center;if(pn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];rr.setFromBufferAttribute(o),this.morphTargetsRelative?(qt.addVectors(pn.min,rr.min),pn.expandByPoint(qt),qt.addVectors(pn.max,rr.max),pn.expandByPoint(qt)):(pn.expandByPoint(rr.min),pn.expandByPoint(rr.max))}pn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)qt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(qt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)qt.fromBufferAttribute(o,c),l&&(ys.fromBufferAttribute(e,c),qt.add(ys)),s=Math.max(s,n.distanceToSquared(qt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Je('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Je("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Yt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let g=0;g<n.count;g++)o[g]=new O,l[g]=new O;let c=new O,d=new O,f=new O,h=new ye,m=new ye,x=new ye,b=new O,p=new O;function u(g,M,A){c.fromBufferAttribute(n,g),d.fromBufferAttribute(n,M),f.fromBufferAttribute(n,A),h.fromBufferAttribute(r,g),m.fromBufferAttribute(r,M),x.fromBufferAttribute(r,A),d.sub(c),f.sub(c),m.sub(h),x.sub(h);let C=1/(m.x*x.y-x.x*m.y);isFinite(C)&&(b.copy(d).multiplyScalar(x.y).addScaledVector(f,-m.y).multiplyScalar(C),p.copy(f).multiplyScalar(m.x).addScaledVector(d,-x.x).multiplyScalar(C),o[g].add(b),o[M].add(b),o[A].add(b),l[g].add(p),l[M].add(p),l[A].add(p))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let g=0,M=y.length;g<M;++g){let A=y[g],C=A.start,I=A.count;for(let P=C,L=C+I;P<L;P+=3)u(e.getX(P+0),e.getX(P+1),e.getX(P+2))}let v=new O,_=new O,E=new O,w=new O;function T(g){E.fromBufferAttribute(s,g),w.copy(E);let M=o[g];v.copy(M),v.sub(E.multiplyScalar(E.dot(M))).normalize(),_.crossVectors(w,M);let C=_.dot(l[g])<0?-1:1;a.setXYZW(g,v.x,v.y,v.z,C)}for(let g=0,M=y.length;g<M;++g){let A=y[g],C=A.start,I=A.count;for(let P=C,L=C+I;P<L;P+=3)T(e.getX(P+0)),T(e.getX(P+1)),T(e.getX(P+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Yt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,m=n.count;h<m;h++)n.setXYZ(h,0,0,0);let s=new O,r=new O,a=new O,o=new O,l=new O,c=new O,d=new O,f=new O;if(e)for(let h=0,m=e.count;h<m;h+=3){let x=e.getX(h+0),b=e.getX(h+1),p=e.getX(h+2);s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,b),a.fromBufferAttribute(t,p),d.subVectors(a,r),f.subVectors(s,r),d.cross(f),o.fromBufferAttribute(n,x),l.fromBufferAttribute(n,b),c.fromBufferAttribute(n,p),o.add(d),l.add(d),c.add(d),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(b,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let h=0,m=t.count;h<m;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),d.subVectors(a,r),f.subVectors(s,r),d.cross(f),n.setXYZ(h+0,d.x,d.y,d.z),n.setXYZ(h+1,d.x,d.y,d.z),n.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)qt.fromBufferAttribute(e,t),qt.normalize(),e.setXYZ(t,qt.x,qt.y,qt.z)}toNonIndexed(){function e(o,l){let c=o.array,d=o.itemSize,f=o.normalized,h=new c.constructor(l.length*d),m=0,x=0;for(let b=0,p=l.length;b<p;b++){o.isInterleavedBufferAttribute?m=l[b]*o.data.stride+o.offset:m=l[b]*d;for(let u=0;u<d;u++)h[x++]=c[m++]}return new Yt(h,d,f)}if(this.index===null)return Ke("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let d=0,f=c.length;d<f;d++){let h=c[d],m=e(h,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],d=[];for(let f=0,h=c.length;f<h;f++){let m=c[f];d.push(m.toJSON(e.data))}d.length>0&&(s[l]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let d=s[c];this.setAttribute(c,d.clone(t))}let r=e.morphAttributes;for(let c in r){let d=[],f=r[c];for(let h=0,m=f.length;h<m;h++)d.push(f[h].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,d=a.length;c<d;c++){let f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var kl=new O,wf=new O,Ef=new et,Nn=class{constructor(e=new O(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=kl.subVectors(n,t).cross(wf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(kl),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Ef.getNormalMatrix(e),s=this.coplanarPoint(kl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Tf=0,ri=class extends qn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Tf++}),this.uuid=Ws(),this.name="",this.type="Material",this.blending=Ii,this.side=Ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=dc,this.blendDst=fc,this.blendEquation=Ki,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ce(0,0,0),this.blendAlpha=0,this.depthFunc=Ts,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=bu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ca,this.stencilZFail=Ca,this.stencilZPass=Ca,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ke(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ke(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ce().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Nn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ye().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ye().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var ni=new O,Vl=new O,ua=new O,da=new O,Ls=class{constructor(e=new O,t=new O(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ni)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ni.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ni.copy(this.origin).addScaledVector(this.direction,t),ni.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Vl.copy(e).add(t).multiplyScalar(.5),ua.copy(t).sub(e).normalize(),da.copy(this.origin).sub(Vl);let r=e.distanceTo(t)*.5,a=-this.direction.dot(ua),o=da.dot(this.direction),l=-da.dot(ua),c=da.lengthSq(),d=Math.abs(1-a*a),f,h,m,x;if(d>0)if(f=a*l-o,h=a*o-l,x=r*d,f>=0)if(h>=-x)if(h<=x){let b=1/d;f*=b,h*=b,m=f*(f+a*h+2*o)+h*(a*f+h+2*l)+c}else h=r,f=Math.max(0,-(a*h+o)),m=-f*f+h*(h+2*l)+c;else h=-r,f=Math.max(0,-(a*h+o)),m=-f*f+h*(h+2*l)+c;else h<=-x?(f=Math.max(0,-(-a*r+o)),h=f>0?-r:Math.min(Math.max(-r,-l),r),m=-f*f+h*(h+2*l)+c):h<=x?(f=0,h=Math.min(Math.max(-r,-l),r),m=h*(h+2*l)+c):(f=Math.max(0,-(a*r+o)),h=f>0?r:Math.min(Math.max(-r,-l),r),m=-f*f+h*(h+2*l)+c);else h=a>0?-r:r,f=Math.max(0,-(a*h+o)),m=-f*f+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Vl).addScaledVector(ua,h),m}intersectSphere(e,t){if(e.radius<0)return null;ni.subVectors(e.center,this.origin);let n=ni.dot(this.direction),s=ni.dot(ni)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),d>=0?(r=(e.min.y-h.y)*d,a=(e.max.y-h.y)*d):(r=(e.max.y-h.y)*d,a=(e.min.y-h.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(o=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ni)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,d=o.z,f=e.x-a.x,h=e.y-a.y,m=e.z-a.z,x=t.x-a.x,b=t.y-a.y,p=t.z-a.z,u=n.x-a.x,y=n.y-a.y,v=n.z-a.z,_=Math.abs(l),E=Math.abs(c),w=Math.abs(d),T,g,M,A,C,I,P,L,F,N,B,Z;if(_>=E&&_>=w?(M=l,I=f,F=x,Z=u,l>=0?(T=c,g=d,A=h,C=m,P=b,L=p,N=y,B=v):(T=d,g=c,A=m,C=h,P=p,L=b,N=v,B=y)):E>=w?(M=c,I=h,F=b,Z=y,c>=0?(T=d,g=l,A=m,C=f,P=p,L=x,N=v,B=u):(T=l,g=d,A=f,C=m,P=x,L=p,N=u,B=v)):(M=d,I=m,F=p,Z=v,d>=0?(T=l,g=c,A=f,C=h,P=x,L=b,N=u,B=y):(T=c,g=l,A=h,C=f,P=b,L=x,N=y,B=u)),M===0)return null;let Y=T/M,Q=g/M,q=1/M,_e=A-Y*I,pe=C-Q*I,Ve=P-Y*F,We=L-Q*F,je=N-Y*Z,te=B-Q*Z,ie=je*We-te*Ve,ge=_e*te-pe*je,Ge=Ve*pe-We*_e;if(s){if(ie<0||ge<0||Ge<0)return null}else if((ie<0||ge<0||Ge<0)&&(ie>0||ge>0||Ge>0))return null;let xe=ie+ge+Ge;if(xe===0)return null;let Fe=q*(ie*I+ge*F+Ge*Z);return(xe>0?Fe<0:Fe>0)?null:this.at(Fe/xe,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Wi=class extends ri{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ce(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=pc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Ih=new gt,zi=new Ls,fa=new si,Ph=new O,pa=new O,ma=new O,ga=new O,Gl=new O,xa=new O,Lh=new O,_a=new O,qe=class extends Ot{constructor(e=new St,t=new Wi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){xa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let d=o[l],f=r[l];d!==0&&(Gl.fromBufferAttribute(f,e),a?xa.addScaledVector(Gl,d):xa.addScaledVector(Gl.sub(t),d))}t.add(xa)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),fa.copy(n.boundingSphere),fa.applyMatrix4(r),zi.copy(e.ray).recast(e.near),!(fa.containsPoint(zi.origin)===!1&&(zi.intersectSphere(fa,Ph)===null||zi.origin.distanceToSquared(Ph)>(e.far-e.near)**2))&&(Ih.copy(r).invert(),zi.copy(e.ray).applyMatrix4(Ih),!(n.boundingBox!==null&&zi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,zi)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,d=r.attributes.uv1,f=r.attributes.normal,h=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,b=h.length;x<b;x++){let p=h[x],u=a[p.materialIndex],y=Math.max(p.start,m.start),v=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let _=y,E=v;_<E;_+=3){let w=o.getX(_),T=o.getX(_+1),g=o.getX(_+2);s=va(this,u,e,n,c,d,f,w,T,g),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let x=Math.max(0,m.start),b=Math.min(o.count,m.start+m.count);for(let p=x,u=b;p<u;p+=3){let y=o.getX(p),v=o.getX(p+1),_=o.getX(p+2);s=va(this,a,e,n,c,d,f,y,v,_),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let x=0,b=h.length;x<b;x++){let p=h[x],u=a[p.materialIndex],y=Math.max(p.start,m.start),v=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let _=y,E=v;_<E;_+=3){let w=_,T=_+1,g=_+2;s=va(this,u,e,n,c,d,f,w,T,g),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let x=Math.max(0,m.start),b=Math.min(l.count,m.start+m.count);for(let p=x,u=b;p<u;p+=3){let y=p,v=p+1,_=p+2;s=va(this,a,e,n,c,d,f,y,v,_),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}};function Af(i,e,t,n,s,r,a,o){let l;if(e.side===$t?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Ci,o),l===null)return null;_a.copy(o),_a.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(_a);return c<t.near||c>t.far?null:{distance:c,point:_a.clone(),object:i}}function va(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,pa),i.getVertexPosition(l,ma),i.getVertexPosition(c,ga);let d=Af(i,e,t,n,pa,ma,ga,Lh);if(d){let f=new O;Si.getBarycoord(Lh,pa,ma,ga,f),s&&(d.uv=Si.getInterpolatedAttribute(s,o,l,c,f,new ye)),r&&(d.uv1=Si.getInterpolatedAttribute(r,o,l,c,f,new ye)),a&&(d.normal=Si.getInterpolatedAttribute(a,o,l,c,f,new O),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));let h={a:o,b:l,c,normal:new O,materialIndex:0};Si.getNormal(pa,ma,ga,h.normal),d.face=h,d.barycoord=f}return d}var vr=class extends cn{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Zt,d=Zt,f,h){super(null,a,o,l,c,d,s,r,f,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ds=class extends Yt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ms=new gt,Dh=new gt,ya=[],Nh=new Yn,Rf=new gt,ar=new qe,or=new si,ai=class extends qe{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ds(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Rf)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Yn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ms),Nh.copy(e.boundingBox).applyMatrix4(Ms),this.boundingBox.union(Nh)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new si),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ms),or.copy(e.boundingSphere).applyMatrix4(Ms),this.boundingSphere.union(or)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(ar.geometry=this.geometry,ar.material=this.material,ar.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),or.copy(this.boundingSphere),or.applyMatrix4(n),e.ray.intersectsSphere(or)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ms),Dh.multiplyMatrices(n,Ms),ar.matrixWorld=Dh,ar.raycast(e,ya);for(let a=0,o=ya.length;a<o;a++){let l=ya[a];l.instanceId=r,l.object=this,t.push(l)}ya.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ds(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new vr(new Float32Array(s*this.count),s,this.count,yo,An));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ki=new si,Cf=new ye(.5,.5),Ma=new O,Ns=class{constructor(e=new Nn,t=new Nn,n=new Nn,s=new Nn,r=new Nn,a=new Nn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Un,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],d=r[4],f=r[5],h=r[6],m=r[7],x=r[8],b=r[9],p=r[10],u=r[11],y=r[12],v=r[13],_=r[14],E=r[15];if(s[0].setComponents(c-a,m-d,u-x,E-y).normalize(),s[1].setComponents(c+a,m+d,u+x,E+y).normalize(),s[2].setComponents(c+o,m+f,u+b,E+v).normalize(),s[3].setComponents(c-o,m-f,u-b,E-v).normalize(),n)s[4].setComponents(l,h,p,_).normalize(),s[5].setComponents(c-l,m-h,u-p,E-_).normalize();else if(s[4].setComponents(c-l,m-h,u-p,E-_).normalize(),t===Un)s[5].setComponents(c+l,m+h,u+p,E+_).normalize();else if(t===As)s[5].setComponents(l,h,p,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ki.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ki.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ki)}intersectsSprite(e){ki.center.set(0,0,0);let t=Cf.distanceTo(e.center);return ki.radius=.7071067811865476+t,ki.applyMatrix4(e.matrixWorld),this.intersectsSphere(ki)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Ma.x=s.normal.x>0?e.max.x:e.min.x,Ma.y=s.normal.y>0?e.max.y:e.min.y,Ma.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ma)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ha=class extends ri{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ce(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Uh=new gt,Ql=new Ls,ba=new si,Sa=new O,yr=class extends Ot{constructor(e=new St,t=new Ha){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ba.copy(n.boundingSphere),ba.applyMatrix4(s),ba.radius+=r,e.ray.intersectsSphere(ba)===!1)return;Uh.copy(s).invert(),Ql.copy(e.ray).applyMatrix4(Uh);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,f=n.attributes.position;if(c!==null){let h=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let x=h,b=m;x<b;x++){let p=c.getX(x);Sa.fromBufferAttribute(f,p),Fh(Sa,p,l,s,e,t,this)}}else{let h=Math.max(0,a.start),m=Math.min(f.count,a.start+a.count);for(let x=h,b=m;x<b;x++)Sa.fromBufferAttribute(f,x),Fh(Sa,x,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Fh(i,e,t,n,s,r,a){let o=Ql.distanceSqToPoint(i);if(o<t){let l=new O;Ql.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var Mr=class extends cn{constructor(e=[],t=Pi,n,s,r,a,o,l,c,d){super(e,t,n,s,r,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},br=class extends cn{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ei=class extends cn{constructor(e,t,n=zn,s,r,a,o=Zt,l=Zt,c,d=Xn,f=1){if(d!==Xn&&d!==Li)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:f};super(h,s,r,a,o,l,d,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Cs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Wa=class extends Ei{constructor(e,t=zn,n=Pi,s,r,a=Zt,o=Zt,l,c=Xn){let d={width:e,height:e,depth:1},f=[d,d,d,d,d,d];super(e,e,t,n,s,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Sr=class extends cn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},mn=class i extends St{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],d=[],f=[],h=0,m=0;x("z","y","x",-1,-1,n,t,e,a,r,0),x("z","y","x",1,-1,n,t,-e,a,r,1),x("x","z","y",1,1,e,n,t,s,a,2),x("x","z","y",1,-1,e,n,-t,s,a,3),x("x","y","z",1,-1,e,t,n,s,r,4),x("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Xe(c,3)),this.setAttribute("normal",new Xe(d,3)),this.setAttribute("uv",new Xe(f,2));function x(b,p,u,y,v,_,E,w,T,g,M){let A=_/T,C=E/g,I=_/2,P=E/2,L=w/2,F=T+1,N=g+1,B=0,Z=0,Y=new O;for(let Q=0;Q<N;Q++){let q=Q*C-P;for(let _e=0;_e<F;_e++){let pe=_e*A-I;Y[b]=pe*y,Y[p]=q*v,Y[u]=L,c.push(Y.x,Y.y,Y.z),Y[b]=0,Y[p]=0,Y[u]=w>0?1:-1,d.push(Y.x,Y.y,Y.z),f.push(_e/T),f.push(1-Q/g),B+=1}}for(let Q=0;Q<g;Q++)for(let q=0;q<T;q++){let _e=h+q+F*Q,pe=h+q+F*(Q+1),Ve=h+(q+1)+F*(Q+1),We=h+(q+1)+F*Q;l.push(_e,pe,We),l.push(pe,Ve,We),Z+=6}o.addGroup(m,Z,M),m+=Z,h+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Vt=class i extends St{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let d=[],f=[],h=[],m=[],x=0,b=[],p=n/2,u=0;y(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new Xe(f,3)),this.setAttribute("normal",new Xe(h,3)),this.setAttribute("uv",new Xe(m,2));function y(){let _=new O,E=new O,w=0,T=(t-e)/n;for(let g=0;g<=r;g++){let M=[],A=g/r,C=A*(t-e)+e;for(let I=0;I<=s;I++){let P=I/s,L=P*l+o,F=Math.sin(L),N=Math.cos(L);E.x=C*F,E.y=-A*n+p,E.z=C*N,f.push(E.x,E.y,E.z),_.set(F,T,N).normalize(),h.push(_.x,_.y,_.z),m.push(P,1-A),M.push(x++)}b.push(M)}for(let g=0;g<s;g++)for(let M=0;M<r;M++){let A=b[M][g],C=b[M+1][g],I=b[M+1][g+1],P=b[M][g+1];(e>0||M!==0)&&(d.push(A,C,P),w+=3),(t>0||M!==r-1)&&(d.push(C,I,P),w+=3)}c.addGroup(u,w,0),u+=w}function v(_){let E=x,w=new ye,T=new O,g=0,M=_===!0?e:t,A=_===!0?1:-1;for(let I=1;I<=s;I++)f.push(0,p*A,0),h.push(0,A,0),m.push(.5,.5),x++;let C=x;for(let I=0;I<=s;I++){let L=I/s*l+o,F=Math.cos(L),N=Math.sin(L);T.x=M*N,T.y=p*A,T.z=M*F,f.push(T.x,T.y,T.z),h.push(0,A,0),w.x=F*.5+.5,w.y=N*.5*A+.5,m.push(w.x,w.y),x++}for(let I=0;I<s;I++){let P=E+I,L=C+I;_===!0?d.push(L,L+1,P):d.push(L+1,L,P),g+=3}c.addGroup(u,g,_===!0?1:2),u+=g}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Xi=class i extends Vt{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Xa=class i extends St{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),c(n),d(),this.setAttribute("position",new Xe(r,3)),this.setAttribute("normal",new Xe(r.slice(),3)),this.setAttribute("uv",new Xe(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(y){let v=new O,_=new O,E=new O;for(let w=0;w<t.length;w+=3)m(t[w+0],v),m(t[w+1],_),m(t[w+2],E),l(v,_,E,y)}function l(y,v,_,E){let w=E+1,T=[];for(let g=0;g<=w;g++){T[g]=[];let M=y.clone().lerp(_,g/w),A=v.clone().lerp(_,g/w),C=w-g;for(let I=0;I<=C;I++)I===0&&g===w?T[g][I]=M:T[g][I]=M.clone().lerp(A,I/C)}for(let g=0;g<w;g++)for(let M=0;M<2*(w-g)-1;M++){let A=Math.floor(M/2);M%2===0?(h(T[g][A+1]),h(T[g+1][A]),h(T[g][A])):(h(T[g][A+1]),h(T[g+1][A+1]),h(T[g+1][A]))}}function c(y){let v=new O;for(let _=0;_<r.length;_+=3)v.x=r[_+0],v.y=r[_+1],v.z=r[_+2],v.normalize().multiplyScalar(y),r[_+0]=v.x,r[_+1]=v.y,r[_+2]=v.z}function d(){let y=new O;for(let v=0;v<r.length;v+=3){y.x=r[v+0],y.y=r[v+1],y.z=r[v+2];let _=p(y)/2/Math.PI+.5,E=u(y)/Math.PI+.5;a.push(_,1-E)}x(),f()}function f(){for(let y=0;y<a.length;y+=6){let v=a[y+0],_=a[y+2],E=a[y+4],w=Math.max(v,_,E),T=Math.min(v,_,E);w>.9&&T<.1&&(v<.2&&(a[y+0]+=1),_<.2&&(a[y+2]+=1),E<.2&&(a[y+4]+=1))}}function h(y){r.push(y.x,y.y,y.z)}function m(y,v){let _=y*3;v.x=e[_+0],v.y=e[_+1],v.z=e[_+2]}function x(){let y=new O,v=new O,_=new O,E=new O,w=new ye,T=new ye,g=new ye;for(let M=0,A=0;M<r.length;M+=9,A+=6){y.set(r[M+0],r[M+1],r[M+2]),v.set(r[M+3],r[M+4],r[M+5]),_.set(r[M+6],r[M+7],r[M+8]),w.set(a[A+0],a[A+1]),T.set(a[A+2],a[A+3]),g.set(a[A+4],a[A+5]),E.copy(y).add(v).add(_).divideScalar(3);let C=p(E);b(w,A+0,y,C),b(T,A+2,v,C),b(g,A+4,_,C)}}function b(y,v,_,E){E<0&&y.x===1&&(a[v]=y.x-1),_.x===0&&_.z===0&&(a[v]=E/2/Math.PI+.5)}function p(y){return Math.atan2(y.z,-y.x)}function u(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var gn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ke("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let d=n[s],h=n[s+1]-d,m=(a-d)/h;return(s+m)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new ye:new O);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new O,s=[],r=[],a=[],o=new O,l=new gt;for(let m=0;m<=e;m++){let x=m/e;s[m]=this.getTangentAt(x,new O)}r[0]=new O,a[0]=new O;let c=Number.MAX_VALUE,d=Math.abs(s[0].x),f=Math.abs(s[0].y),h=Math.abs(s[0].z);d<=c&&(c=d,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),h<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let m=1;m<=e;m++){if(r[m]=r[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();let x=Math.acos(ct(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(l.makeRotationAxis(o,x))}a[m].crossVectors(s[m],r[m])}if(t===!0){let m=Math.acos(ct(r[0].dot(r[e]),-1,1));m/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(m=-m);for(let x=1;x<=e;x++)r[x].applyMatrix4(l.makeRotationAxis(s[x],m*x)),a[x].crossVectors(s[x],r[x])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Us=class extends gn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new ye){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let d=Math.cos(this.aRotation),f=Math.sin(this.aRotation),h=l-this.aX,m=c-this.aY;l=h*d-m*f+this.aX,c=h*f+m*d+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},qa=class extends Us{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Ic(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,d,f){let h=(a-r)/c-(o-r)/(c+d)+(o-a)/d,m=(o-a)/d-(l-a)/(d+f)+(l-o)/f;h*=d,m*=d,s(a,o,h,m)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var Oh=new O,Bh=new O,Hl=new Ic,Wl=new Ic,Xl=new Ic,Fs=class extends gn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new O){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,d;this.closed||o>0?c=s[(o-1)%r]:(Bh.subVectors(s[0],s[1]).add(s[0]),c=Bh);let f=s[o%r],h=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(Oh.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=Oh),this.curveType==="centripetal"||this.curveType==="chordal"){let m=this.curveType==="chordal"?.5:.25,x=Math.pow(c.distanceToSquared(f),m),b=Math.pow(f.distanceToSquared(h),m),p=Math.pow(h.distanceToSquared(d),m);b<1e-4&&(b=1),x<1e-4&&(x=b),p<1e-4&&(p=b),Hl.initNonuniformCatmullRom(c.x,f.x,h.x,d.x,x,b,p),Wl.initNonuniformCatmullRom(c.y,f.y,h.y,d.y,x,b,p),Xl.initNonuniformCatmullRom(c.z,f.z,h.z,d.z,x,b,p)}else this.curveType==="catmullrom"&&(Hl.initCatmullRom(c.x,f.x,h.x,d.x,this.tension),Wl.initCatmullRom(c.y,f.y,h.y,d.y,this.tension),Xl.initCatmullRom(c.z,f.z,h.z,d.z,this.tension));return n.set(Hl.calc(l),Wl.calc(l),Xl.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new O().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function zh(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function If(i,e){let t=1-i;return t*t*e}function Pf(i,e){return 2*(1-i)*i*e}function Lf(i,e){return i*i*e}function cr(i,e,t,n){return If(i,e)+Pf(i,t)+Lf(i,n)}function Df(i,e){let t=1-i;return t*t*t*e}function Nf(i,e){let t=1-i;return 3*t*t*i*e}function Uf(i,e){return 3*(1-i)*i*i*e}function Ff(i,e){return i*i*i*e}function hr(i,e,t,n,s){return Df(i,e)+Nf(i,t)+Uf(i,n)+Ff(i,s)}var wr=class extends gn{constructor(e=new ye,t=new ye,n=new ye,s=new ye){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ye){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(hr(e,s.x,r.x,a.x,o.x),hr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ya=class extends gn{constructor(e=new O,t=new O,n=new O,s=new O){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new O){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(hr(e,s.x,r.x,a.x,o.x),hr(e,s.y,r.y,a.y,o.y),hr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Er=class extends gn{constructor(e=new ye,t=new ye){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ye){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ye){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Za=class extends gn{constructor(e=new O,t=new O){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new O){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new O){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Tr=class extends gn{constructor(e=new ye,t=new ye,n=new ye){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ye){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(cr(e,s.x,r.x,a.x),cr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ja=class extends gn{constructor(e=new O,t=new O,n=new O){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new O){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(cr(e,s.x,r.x,a.x),cr(e,s.y,r.y,a.y),cr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ar=class extends gn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ye){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],d=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(zh(o,l.x,c.x,d.x,f.x),zh(o,l.y,c.y,d.y,f.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new ye().fromArray(s))}return this}},jl=Object.freeze({__proto__:null,ArcCurve:qa,CatmullRomCurve3:Fs,CubicBezierCurve:wr,CubicBezierCurve3:Ya,EllipseCurve:Us,LineCurve:Er,LineCurve3:Za,QuadraticBezierCurve:Tr,QuadraticBezierCurve3:Ja,SplineCurve:Ar}),Ka=class extends gn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new jl[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let d=l[c];n&&n.equals(d)||(t.push(d),n=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new jl[s.type]().fromJSON(s))}return this}},En=class extends Ka{constructor(e){super(),this.type="Path",this.currentPoint=new ye,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Er(this.currentPoint.clone(),new ye(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Tr(this.currentPoint.clone(),new ye(e,t),new ye(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new wr(this.currentPoint.clone(),new ye(e,t),new ye(n,s),new ye(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Ar(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){let c=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+c,t+d,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){let c=new Us(e,t,n,s,r,a,o,l);if(this.curves.length>0){let f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);let d=c.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},xn=class extends En{constructor(e){super(e),this.uuid=Ws(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new En().fromJSON(s))}return this}};function Of(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Uu(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=Gf(i,e,r,t)),i.length>80*t){o=i[0],l=i[1];let d=o,f=l;for(let h=t;h<s;h+=t){let m=i[h],x=i[h+1];m<o&&(o=m),x<l&&(l=x),m>d&&(d=m),x>f&&(f=x)}c=Math.max(d-o,f-l),c=c!==0?32767/c:0}return Rr(r,a,t,o,l,c,0),a}function Uu(i,e,t,n,s){let r;if(s===jf(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=kh(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=kh(a/n|0,i[a],i[a+1],r);return r&&Os(r,r.next)&&(Ir(r),r=r.next),r}function qi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Os(t,t.next)||Lt(t.prev,t,t.next)===0)){if(Ir(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Rr(i,e,t,n,s,r,a){if(!i)return;!a&&r&&Yf(i,n,s,r);let o=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?zf(i,n,s,r):Bf(i)){e.push(l.i,i.i,c.i),Ir(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=kf(qi(i),e),Rr(i,e,t,n,s,r,2)):a===2&&Vf(i,e,t,n,s,r):Rr(qi(i),e,t,n,s,r,1);break}}}function Bf(i){let e=i.prev,t=i,n=i.next;if(Lt(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,d=Math.min(s,r,a),f=Math.min(o,l,c),h=Math.max(s,r,a),m=Math.max(o,l,c),x=n.next;for(;x!==e;){if(x.x>=d&&x.x<=h&&x.y>=f&&x.y<=m&&lr(s,o,r,l,a,c,x.x,x.y)&&Lt(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function zf(i,e,t,n){let s=i.prev,r=i,a=i.next;if(Lt(s,r,a)>=0)return!1;let o=s.x,l=r.x,c=a.x,d=s.y,f=r.y,h=a.y,m=Math.min(o,l,c),x=Math.min(d,f,h),b=Math.max(o,l,c),p=Math.max(d,f,h),u=ec(m,x,e,t,n),y=ec(b,p,e,t,n),v=i.prevZ,_=i.nextZ;for(;v&&v.z>=u&&_&&_.z<=y;){if(v.x>=m&&v.x<=b&&v.y>=x&&v.y<=p&&v!==s&&v!==a&&lr(o,d,l,f,c,h,v.x,v.y)&&Lt(v.prev,v,v.next)>=0||(v=v.prevZ,_.x>=m&&_.x<=b&&_.y>=x&&_.y<=p&&_!==s&&_!==a&&lr(o,d,l,f,c,h,_.x,_.y)&&Lt(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;v&&v.z>=u;){if(v.x>=m&&v.x<=b&&v.y>=x&&v.y<=p&&v!==s&&v!==a&&lr(o,d,l,f,c,h,v.x,v.y)&&Lt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;_&&_.z<=y;){if(_.x>=m&&_.x<=b&&_.y>=x&&_.y<=p&&_!==s&&_!==a&&lr(o,d,l,f,c,h,_.x,_.y)&&Lt(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function kf(i,e){let t=i;do{let n=t.prev,s=t.next.next;!Os(n,s)&&Ou(n,t,t.next,s)&&Cr(n,s)&&Cr(s,n)&&(e.push(n.i,t.i,s.i),Ir(t),Ir(t.next),t=i=s),t=t.next}while(t!==i);return qi(t)}function Vf(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Kf(a,o)){let l=Bu(a,o);a=qi(a,a.next),l=qi(l,l.next),Rr(a,e,t,n,s,r,0),Rr(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Gf(i,e,t,n){let s=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=Uu(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Jf(c))}s.sort(Hf);for(let r=0;r<s.length;r++)t=Wf(s[r],t);return t}function Hf(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Wf(i,e){let t=Xf(i,e);if(!t)return e;let n=Bu(t,i);return qi(n,n.next),qi(t,t.next)}function Xf(i,e){let t=e,n=i.x,s=i.y,r=-1/0,a;if(Os(i,t))return t;do{if(Os(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let f=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=n&&f>r&&(r=f,a=t.x<t.next.x?t:t.next,f===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,l=a.x,c=a.y,d=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Fu(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let f=Math.abs(s-t.y)/(n-t.x);Cr(t,i)&&(f<d||f===d&&(t.x>a.x||t.x===a.x&&qf(a,t)))&&(a=t,d=f)}t=t.next}while(t!==o);return a}function qf(i,e){return Lt(i.prev,i,e.prev)<0&&Lt(e.next,i,i.next)<0}function Yf(i,e,t,n){let s=i;do s.z===0&&(s.z=ec(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Zf(s)}function Zf(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function ec(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Jf(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Fu(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function lr(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&Fu(i,e,t,n,s,r,a,o)}function Kf(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!$f(i,e)&&(Cr(i,e)&&Cr(e,i)&&Qf(i,e)&&(Lt(i.prev,i,e.prev)||Lt(i,e.prev,e))||Os(i,e)&&Lt(i.prev,i,i.next)>0&&Lt(e.prev,e,e.next)>0)}function Lt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Os(i,e){return i.x===e.x&&i.y===e.y}function Ou(i,e,t,n){let s=Ea(Lt(i,e,t)),r=Ea(Lt(i,e,n)),a=Ea(Lt(t,n,i)),o=Ea(Lt(t,n,e));return!!(s!==r&&a!==o||s===0&&wa(i,t,e)||r===0&&wa(i,n,e)||a===0&&wa(t,i,n)||o===0&&wa(t,e,n))}function wa(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Ea(i){return i>0?1:i<0?-1:0}function $f(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Ou(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Cr(i,e){return Lt(i.prev,i,i.next)<0?Lt(i,e,i.next)>=0&&Lt(i,i.prev,e)>=0:Lt(i,e,i.prev)<0||Lt(i,i.next,e)<0}function Qf(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Bu(i,e){let t=tc(i.i,i.x,i.y),n=tc(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function kh(i,e,t,n){let s=tc(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ir(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function tc(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function jf(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var nc=class{static triangulate(e,t,n=2){return Of(e,t,n)}},Vi=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Vh(e),Gh(n,e);let a=e.length;t.forEach(Vh);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Gh(n,t[l]);let o=nc.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function Vh(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Gh(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var oi=class i extends St{constructor(e=new xn([new ye(.5,.5),new ye(-.5,.5),new ye(-.5,-.5),new ye(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){let c=e[o];a(c)}this.setAttribute("position",new Xe(s,3)),this.setAttribute("uv",new Xe(r,2)),this.computeVertexNormals();function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,d=t.steps!==void 0?t.steps:1,f=t.depth!==void 0?t.depth:1,h=t.bevelEnabled!==void 0?t.bevelEnabled:!0,m=t.bevelThickness!==void 0?t.bevelThickness:.2,x=t.bevelSize!==void 0?t.bevelSize:m-.1,b=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3,u=t.extrudePath,y=t.UVGenerator!==void 0?t.UVGenerator:ep,v,_=!1,E,w,T,g;if(u){v=u.getSpacedPoints(d),_=!0,h=!1;let $=u.isCatmullRomCurve3?u.closed:!1;E=u.computeFrenetFrames(d,$),w=new O,T=new O,g=new O}h||(p=0,m=0,x=0,b=0);let M=o.extractPoints(c),A=M.shape,C=M.holes;if(!Vi.isClockWise(A)){A=A.reverse();for(let $=0,ae=C.length;$<ae;$++){let W=C[$];Vi.isClockWise(W)&&(C[$]=W.reverse())}}function P($){let W=10000000000000001e-36,U=$[0];for(let k=1;k<=$.length;k++){let re=k%$.length,ue=$[re],de=ue.x-U.x,me=ue.y-U.y,z=de*de+me*me,ht=Math.max(Math.abs(ue.x),Math.abs(ue.y),Math.abs(U.x),Math.abs(U.y)),it=W*ht*ht;if(z<=it){$.splice(re,1),k--;continue}U=ue}}P(A),C.forEach(P);let L=C.length,F=A;for(let $=0;$<L;$++){let ae=C[$];A=A.concat(ae)}function N($,ae,W){return ae||Je("ExtrudeGeometry: vec does not exist"),$.clone().addScaledVector(ae,W)}let B=A.length;function Z($,ae,W){let U,k,re,ue=$.x-ae.x,de=$.y-ae.y,me=W.x-$.x,z=W.y-$.y,ht=ue*ue+de*de,it=ue*z-de*me;if(Math.abs(it)>Number.EPSILON){let D=Math.sqrt(ht),S=Math.sqrt(me*me+z*z),H=ae.x-de/D,X=ae.y+ue/D,ee=W.x-z/S,fe=W.y+me/S,ve=((ee-H)*z-(fe-X)*me)/(ue*z-de*me);U=H+ue*ve-$.x,k=X+de*ve-$.y;let ne=U*U+k*k;if(ne<=2)return new ye(U,k);re=Math.sqrt(ne/2)}else{let D=!1;ue>Number.EPSILON?me>Number.EPSILON&&(D=!0):ue<-Number.EPSILON?me<-Number.EPSILON&&(D=!0):Math.sign(de)===Math.sign(z)&&(D=!0),D?(U=-de,k=ue,re=Math.sqrt(ht)):(U=ue,k=de,re=Math.sqrt(ht/2))}return new ye(U/re,k/re)}let Y=[];for(let $=0,ae=F.length,W=ae-1,U=$+1;$<ae;$++,W++,U++)W===ae&&(W=0),U===ae&&(U=0),Y[$]=Z(F[$],F[W],F[U]);let Q=[],q,_e=Y.concat();for(let $=0,ae=L;$<ae;$++){let W=C[$];q=[];for(let U=0,k=W.length,re=k-1,ue=U+1;U<k;U++,re++,ue++)re===k&&(re=0),ue===k&&(ue=0),q[U]=Z(W[U],W[re],W[ue]);Q.push(q),_e=_e.concat(q)}let pe;if(p===0)pe=Vi.triangulateShape(F,C);else{let $=[],ae=[];for(let W=0;W<p;W++){let U=W/p,k=m*Math.cos(U*Math.PI/2),re=x*Math.sin(U*Math.PI/2)+b;for(let ue=0,de=F.length;ue<de;ue++){let me=N(F[ue],Y[ue],re);ge(me.x,me.y,-k),U===0&&$.push(me)}for(let ue=0,de=L;ue<de;ue++){let me=C[ue];q=Q[ue];let z=[];for(let ht=0,it=me.length;ht<it;ht++){let D=N(me[ht],q[ht],re);ge(D.x,D.y,-k),U===0&&z.push(D)}U===0&&ae.push(z)}}pe=Vi.triangulateShape($,ae)}let Ve=pe.length,We=x+b;for(let $=0;$<B;$++){let ae=h?N(A[$],_e[$],We):A[$];_?(T.copy(E.normals[0]).multiplyScalar(ae.x),w.copy(E.binormals[0]).multiplyScalar(ae.y),g.copy(v[0]).add(T).add(w),ge(g.x,g.y,g.z)):ge(ae.x,ae.y,0)}for(let $=1;$<=d;$++)for(let ae=0;ae<B;ae++){let W=h?N(A[ae],_e[ae],We):A[ae];_?(T.copy(E.normals[$]).multiplyScalar(W.x),w.copy(E.binormals[$]).multiplyScalar(W.y),g.copy(v[$]).add(T).add(w),ge(g.x,g.y,g.z)):ge(W.x,W.y,f/d*$)}for(let $=p-1;$>=0;$--){let ae=$/p,W=m*Math.cos(ae*Math.PI/2),U=x*Math.sin(ae*Math.PI/2)+b;for(let k=0,re=F.length;k<re;k++){let ue=N(F[k],Y[k],U);ge(ue.x,ue.y,f+W)}for(let k=0,re=C.length;k<re;k++){let ue=C[k];q=Q[k];for(let de=0,me=ue.length;de<me;de++){let z=N(ue[de],q[de],U);_?ge(z.x,z.y+v[d-1].y,v[d-1].x+W):ge(z.x,z.y,f+W)}}}je(),te();function je(){let $=s.length/3;if(h){let ae=0,W=B*ae;for(let U=0;U<Ve;U++){let k=pe[U];Ge(k[2]+W,k[1]+W,k[0]+W)}ae=d+p*2,W=B*ae;for(let U=0;U<Ve;U++){let k=pe[U];Ge(k[0]+W,k[1]+W,k[2]+W)}}else{for(let ae=0;ae<Ve;ae++){let W=pe[ae];Ge(W[2],W[1],W[0])}for(let ae=0;ae<Ve;ae++){let W=pe[ae];Ge(W[0]+B*d,W[1]+B*d,W[2]+B*d)}}n.addGroup($,s.length/3-$,0)}function te(){let $=s.length/3,ae=0;ie(F,ae),ae+=F.length;for(let W=0,U=C.length;W<U;W++){let k=C[W];ie(k,ae),ae+=k.length}n.addGroup($,s.length/3-$,1)}function ie($,ae){let W=$.length;for(;--W>=0;){let U=W,k=W-1;k<0&&(k=$.length-1);for(let re=0,ue=d+p*2;re<ue;re++){let de=B*re,me=B*(re+1),z=ae+U+de,ht=ae+k+de,it=ae+k+me,D=ae+U+me;xe(z,ht,it,D)}}}function ge($,ae,W){l.push($),l.push(ae),l.push(W)}function Ge($,ae,W){Fe($),Fe(ae),Fe(W);let U=s.length/3,k=y.generateTopUV(n,s,U-3,U-2,U-1);Pe(k[0]),Pe(k[1]),Pe(k[2])}function xe($,ae,W,U){Fe($),Fe(ae),Fe(U),Fe(ae),Fe(W),Fe(U);let k=s.length/3,re=y.generateSideWallUV(n,s,k-6,k-3,k-2,k-1);Pe(re[0]),Pe(re[1]),Pe(re[3]),Pe(re[1]),Pe(re[2]),Pe(re[3])}function Fe($){s.push(l[$*3+0]),s.push(l[$*3+1]),s.push(l[$*3+2])}function Pe($){r.push($.x),r.push($.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return tp(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,a=e.shapes.length;r<a;r++){let o=t[e.shapes[r]];n.push(o)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new jl[s.type]().fromJSON(s)),new i(n,e.options)}},ep={generateTopUV:function(i,e,t,n,s){let r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[s*3],d=e[s*3+1];return[new ye(r,a),new ye(o,l),new ye(c,d)]},generateSideWallUV:function(i,e,t,n,s,r){let a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],d=e[n*3+1],f=e[n*3+2],h=e[s*3],m=e[s*3+1],x=e[s*3+2],b=e[r*3],p=e[r*3+1],u=e[r*3+2];return Math.abs(o-d)<Math.abs(a-c)?[new ye(a,1-l),new ye(c,1-f),new ye(h,1-x),new ye(b,1-u)]:[new ye(o,1-l),new ye(d,1-f),new ye(m,1-x),new ye(p,1-u)]}};function tp(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Yi=class i extends Xa{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var On=class i extends St{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,d=l+1,f=e/o,h=t/l,m=[],x=[],b=[],p=[];for(let u=0;u<d;u++){let y=u*h-a;for(let v=0;v<c;v++){let _=v*f-r;x.push(_,-y,0),b.push(0,0,1),p.push(v/o),p.push(1-u/l)}}for(let u=0;u<l;u++)for(let y=0;y<o;y++){let v=y+c*u,_=y+c*(u+1),E=y+1+c*(u+1),w=y+1+c*u;m.push(v,_,w),m.push(_,E,w)}this.setIndex(m),this.setAttribute("position",new Xe(x,3)),this.setAttribute("normal",new Xe(b,3)),this.setAttribute("uv",new Xe(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var li=class i extends St{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,d=[],f=new O,h=new O,m=[],x=[],b=[],p=[];for(let u=0;u<=n;u++){let y=[],v=u/n,_=a+v*o,E=e*Math.cos(_),w=Math.sqrt(e*e-E*E),T=0;u===0&&a===0?T=.5/t:u===n&&l===Math.PI&&(T=-.5/t);for(let g=0;g<=t;g++){let M=g/t,A=s+M*r;f.x=-w*Math.cos(A),f.y=E,f.z=w*Math.sin(A),x.push(f.x,f.y,f.z),h.copy(f).normalize(),b.push(h.x,h.y,h.z),p.push(M+T,1-v),y.push(c++)}d.push(y)}for(let u=0;u<n;u++)for(let y=0;y<t;y++){let v=d[u][y+1],_=d[u][y],E=d[u+1][y],w=d[u+1][y+1];(u!==0||a>0)&&m.push(v,_,w),(u!==n-1||l<Math.PI)&&m.push(_,E,w)}this.setIndex(m),this.setAttribute("position",new Xe(x,3)),this.setAttribute("normal",new Xe(b,3)),this.setAttribute("uv",new Xe(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Zi=class i extends St{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],d=[],f=[],h=new O,m=new O,x=new O;for(let b=0;b<=n;b++){let p=a+b/n*o;for(let u=0;u<=s;u++){let y=u/s*r;m.x=(e+t*Math.cos(p))*Math.cos(y),m.y=(e+t*Math.cos(p))*Math.sin(y),m.z=t*Math.sin(p),c.push(m.x,m.y,m.z),h.x=e*Math.cos(y),h.y=e*Math.sin(y),x.subVectors(m,h).normalize(),d.push(x.x,x.y,x.z),f.push(u/s),f.push(b/n)}}for(let b=1;b<=n;b++)for(let p=1;p<=s;p++){let u=(s+1)*b+p-1,y=(s+1)*(b-1)+p-1,v=(s+1)*(b-1)+p,_=(s+1)*b+p;l.push(u,y,_),l.push(y,v,_)}this.setIndex(l),this.setAttribute("position",new Xe(c,3)),this.setAttribute("normal",new Xe(d,3)),this.setAttribute("uv",new Xe(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function Qi(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Hh(s))s.isRenderTargetTexture?(Ke("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Hh(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function rn(i){let e={};for(let t=0;t<i.length;t++){let n=Qi(i[t]);for(let s in n)e[s]=n[s]}return e}function Hh(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function np(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Pc(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:dt.workingColorSpace}var zu={clone:Qi,merge:rn},ip=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,sp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Gt=class extends ri{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ip,this.fragmentShader=sp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Qi(e.uniforms),this.uniformsGroups=np(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Ce().setHex(s.value);break;case"v2":this.uniforms[n].value=new ye().fromArray(s.value);break;case"v3":this.uniforms[n].value=new O().fromArray(s.value);break;case"v4":this.uniforms[n].value=new It().fromArray(s.value);break;case"m3":this.uniforms[n].value=new et().fromArray(s.value);break;case"m4":this.uniforms[n].value=new gt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},$a=class extends Gt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},ft=class extends ri{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ce(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ce(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=el,this.normalScale=new ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Pr=class extends ft{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ye(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ct(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ce(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ce(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ce(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Qa=class extends ri{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=yu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},ja=class extends ri{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function bs(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function ql(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Ti=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},eo=class extends Ti{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Jl,endingEnd:Jl}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Kl:r=e,o=2*t-n;break;case $l:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Kl:a=e,l=2*n-t;break;case $l:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,d=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*d,this._offsetNext=a*d}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,d=this._offsetPrev,f=this._offsetNext,h=this._weightPrev,m=this._weightNext,x=(n-t)/(s-t),b=x*x,p=b*x,u=-h*p+2*h*b-h*x,y=(1+h)*p+(-1.5-2*h)*b+(-.5+h)*x+1,v=(-1-m)*p+(1.5+m)*b+.5*x,_=m*p-m*b;for(let E=0;E!==o;++E)r[E]=u*a[d+E]+y*a[c+E]+v*a[l+E]+_*a[f+E];return r}},to=class extends Ti{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,d=(n-t)/(s-t),f=1-d;for(let h=0;h!==o;++h)r[h]=a[c+h]*f+a[l+h]*d;return r}},no=class extends Ti{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},io=class extends Ti{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,d=this.inTangents,f=this.outTangents;if(!d||!f){let x=(n-t)/(s-t),b=1-x;for(let p=0;p!==o;++p)r[p]=a[c+p]*b+a[l+p]*x;return r}let h=o*2,m=e-1;for(let x=0;x!==o;++x){let b=a[c+x],p=a[l+x],u=m*h+x*2,y=f[u],v=f[u+1],_=e*h+x*2,E=d[_],w=d[_+1],T=ap(n,t,y,E,s);r[x]=ku(T,b,v,w,p)}return r}};function ku(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function rp(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function ap(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=ku(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let l=rp(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var _n=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=bs(t,this.TimeBufferType),this.values=bs(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:bs(e.times,Array),values:bs(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),ql(e.settings)&&(n.settings={inTangents:bs(e.settings.inTangents,Array),outTangents:bs(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new no(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new to(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new eo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new io(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case ur:t=this.InterpolantFactoryMethodDiscrete;break;case Ba:t=this.InterpolantFactoryMethodLinear;break;case Ra:t=this.InterpolantFactoryMethodSmooth;break;case Zl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ke("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ur;case this.InterpolantFactoryMethodLinear:return Ba;case this.InterpolantFactoryMethodSmooth:return Ra;case this.InterpolantFactoryMethodBezier:return Zl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;ql(this.settings)&&(Wh(this.settings.inTangents,e),Wh(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Je("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Je("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Je("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Je("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&cf(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Je("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ra,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],d=e[o+1];if(c!==d&&(o!==1||c!==e[0]))if(s)l=!0;else{let f=o*n,h=f-n,m=f+n;for(let x=0;x!==n;++x){let b=t[f+x];if(b!==t[h+x]||b!==t[m+x]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let f=o*n,h=a*n;for(let m=0;m!==n;++m)t[h+m]=t[f+m]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,ql(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Wh(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}_n.prototype.ValueTypeName="";_n.prototype.TimeBufferType=Float32Array;_n.prototype.ValueBufferType=Float32Array;_n.prototype.DefaultInterpolation=Ba;var Ai=class extends _n{constructor(e,t,n){super(e,t,n)}};Ai.prototype.ValueTypeName="bool";Ai.prototype.ValueBufferType=Array;Ai.prototype.DefaultInterpolation=ur;Ai.prototype.InterpolantFactoryMethodLinear=void 0;Ai.prototype.InterpolantFactoryMethodSmooth=void 0;var so=class extends _n{constructor(e,t,n,s){super(e,t,n,s)}};so.prototype.ValueTypeName="color";var ro=class extends _n{constructor(e,t,n,s){super(e,t,n,s)}};ro.prototype.ValueTypeName="number";var ao=class extends Ti{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let d=c+o;c!==d;c+=4)wn.slerpFlat(r,0,a,c-o,a,c,l);return r}},Lr=class extends _n{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new ao(this.times,this.values,this.getValueSize(),e)}};Lr.prototype.ValueTypeName="quaternion";Lr.prototype.InterpolantFactoryMethodSmooth=void 0;var Ri=class extends _n{constructor(e,t,n){super(e,t,n)}};Ri.prototype.ValueTypeName="string";Ri.prototype.ValueBufferType=Array;Ri.prototype.DefaultInterpolation=ur;Ri.prototype.InterpolantFactoryMethodLinear=void 0;Ri.prototype.InterpolantFactoryMethodSmooth=void 0;var oo=class extends _n{constructor(e,t,n,s){super(e,t,n,s)}};oo.prototype.ValueTypeName="vector";var lo=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(d){o++,r===!1&&s.onStart!==void 0&&s.onStart(d,a,o),r=!0},this.itemEnd=function(d){a++,s.onProgress!==void 0&&s.onProgress(d,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(d){s.onError!==void 0&&s.onError(d)},this.resolveURL=function(d){return d=d.normalize("NFC"),l?l(d):d},this.setURLModifier=function(d){return l=d,this},this.addHandler=function(d,f){return c.push(d,f),this},this.removeHandler=function(d){let f=c.indexOf(d);return f!==-1&&c.splice(f,2),this},this.getHandler=function(d){for(let f=0,h=c.length;f<h;f+=2){let m=c[f],x=c[f+1];if(m.global&&(m.lastIndex=0),m.test(d))return x}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Vu=new lo,co=class{constructor(e){this.manager=e!==void 0?e:Vu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};co.DEFAULT_MATERIAL_NAME="__DEFAULT";var Bs=class extends Ot{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ce(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Dr=class extends Bs{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ce(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Yl=new gt,Xh=new O,qh=new O,Nr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ye(512,512),this.mapType=dn,this.map=null,this.mapPass=null,this.matrix=new gt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ns,this._frameExtents=new ye(1,1),this._viewportCount=1,this._viewports=[new It(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Xh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Xh),qh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(qh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){Yl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Yl,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===As||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Yl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Ta=new O,Aa=new wn,Hn=new O,Ur=class extends Ot{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new gt,this.projectionMatrix=new gt,this.projectionMatrixInverse=new gt,this.coordinateSystem=Un,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ta,Aa,Hn),Hn.x===1&&Hn.y===1&&Hn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ta,Aa,Hn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Ta,Aa,Hn),Hn.x===1&&Hn.y===1&&Hn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ta,Aa,Hn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},bi=new O,Yh=new ye,Zh=new ye,Kt=class extends Ur{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=za*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(bl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return za*2*Math.atan(Math.tan(bl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){bi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(bi.x,bi.y).multiplyScalar(-e/bi.z),bi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(bi.x,bi.y).multiplyScalar(-e/bi.z)}getViewSize(e,t){return this.getViewBounds(e,Yh,Zh),t.subVectors(Zh,Yh)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(bl*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var ic=class extends Nr{constructor(){super(new Kt(90,1,.5,500)),this.isPointLightShadow=!0}},Fr=class extends Bs{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new ic}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},zs=class extends Ur{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},sc=class extends Nr{constructor(){super(new zs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ji=class extends Bs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.target=new Ot,this.shadow=new sc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var Ss=-90,ws=1,ks=class extends Ot{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Kt(Ss,ws,e,t);s.layers=this.layers,this.add(s);let r=new Kt(Ss,ws,e,t);r.layers=this.layers,this.add(r);let a=new Kt(Ss,ws,e,t);a.layers=this.layers,this.add(a);let o=new Kt(Ss,ws,e,t);o.layers=this.layers,this.add(o);let l=new Kt(Ss,ws,e,t);l.layers=this.layers,this.add(l);let c=new Kt(Ss,ws,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===Un)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===As)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,d]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;let b=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=b,e.setRenderTarget(n,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,d),e.setRenderTarget(f,h,m),e.xr.enabled=x,n.texture.needsPMREMUpdate=!0}},ho=class extends Kt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Lc="\\[\\]\\.:\\/",op=new RegExp("["+Lc+"]","g"),Dc="[^"+Lc+"]",lp="[^"+Lc.replace("\\.","")+"]",cp=/((?:WC+[\/:])*)/.source.replace("WC",Dc),hp=/(WCOD+)?/.source.replace("WCOD",lp),up=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Dc),dp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Dc),fp=new RegExp("^"+cp+hp+up+dp+"$"),pp=["material","materials","bones","map"],rc=class{constructor(e,t,n){let s=n||Ct.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Ct=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(op,"")}static parseTrackName(e){let t=fp.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);pp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ke("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Je("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Je("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Je("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let d=0;d<e.length;d++)if(e[d].name===c){c=d;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Je("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Je("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Je("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Je("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;Je("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Je("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Je("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ct.Composite=rc;Ct.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ct.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ct.prototype.GetterByBindingType=[Ct.prototype._getValue_direct,Ct.prototype._getValue_array,Ct.prototype._getValue_arrayElement,Ct.prototype._getValue_toArray];Ct.prototype.SetterByBindingTypeAndVersioning=[[Ct.prototype._setValue_direct,Ct.prototype._setValue_direct_setNeedsUpdate,Ct.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_array,Ct.prototype._setValue_array_setNeedsUpdate,Ct.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_arrayElement,Ct.prototype._setValue_arrayElement_setNeedsUpdate,Ct.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_fromArray,Ct.prototype._setValue_fromArray_setNeedsUpdate,Ct.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var S_=new Float32Array(1);var Jh=new gt,Or=class{constructor(e,t,n=0,s=1/0){this.ray=new Ls(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Is,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Je("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Jh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Jh),this}intersectObject(e,t=!0,n=[]){return ac(e,this,n,t),n.sort(Kh),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)ac(e[s],this,n,t);return n.sort(Kh),n}};function Kh(i,e){return i.distance-e.distance}function ac(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)ac(r[a],e,t,!0)}}var zc=class zc{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};zc.prototype.isMatrix2=!0;var oc=zc;function Nc(i,e,t,n){let s=mp(n);switch(t){case Tc:return i*e;case yo:return i*e/s.components*s.byteLength;case Mo:return i*e/s.components*s.byteLength;case Di:return i*e*2/s.components*s.byteLength;case bo:return i*e*2/s.components*s.byteLength;case Ac:return i*e*3/s.components*s.byteLength;case Rn:return i*e*4/s.components*s.byteLength;case So:return i*e*4/s.components*s.byteLength;case Gr:case Hr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Wr:case Xr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Eo:case Ao:return Math.max(i,16)*Math.max(e,8)/4;case wo:case To:return Math.max(i,8)*Math.max(e,8)/2;case Ro:case Co:case Po:case Lo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Io:case qr:case Do:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case No:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Uo:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Fo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Oo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Bo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case zo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ko:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Vo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Go:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ho:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Wo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Xo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case qo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Yo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Zo:case Jo:case Ko:return Math.ceil(i/4)*Math.ceil(e/4)*16;case $o:case Qo:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Yr:case jo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function mp(i){switch(i){case dn:case bc:return{byteLength:1,components:1};case Gs:case Sc:case vn:return{byteLength:2,components:1};case _o:case vo:return{byteLength:2,components:4};case zn:case xo:case An:return{byteLength:4,components:1};case wc:case Ec:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Ke("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function cd(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function bp(i){let e=new WeakMap;function t(o,l){let c=o.array,d=o.usage,f=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,d),o.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){let d=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,d);else{f.sort((m,x)=>m.start-x.start);let h=0;for(let m=1;m<f.length;m++){let x=f[h],b=f[m];b.start<=x.start+x.count+1?x.count=Math.max(x.count,b.start+b.count-x.start):(++h,f[h]=b)}f.length=h+1;for(let m=0,x=f.length;m<x;m++){let b=f[m];i.bufferSubData(c,b.start*d.BYTES_PER_ELEMENT,d,b.start,b.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Sp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,wp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ep=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Tp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ap=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Rp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Cp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Ip=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Pp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Lp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Dp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Np=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Up=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Fp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Op=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Bp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,zp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,kp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Vp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Gp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Hp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Wp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Xp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,qp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Yp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Zp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Jp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Kp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$p=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Qp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,jp="gl_FragColor = linearToOutputTexel( gl_FragColor );",em=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,tm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,nm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,im=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,sm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,rm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,am=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,om=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,lm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,cm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,hm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,um=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,dm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,fm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,pm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,mm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,gm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,xm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_m=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,vm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ym=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Mm=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,bm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Sm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,wm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Em=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Tm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Am=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Rm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Cm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Im=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Pm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Lm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Dm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Nm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Um=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Fm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Om=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Bm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,km=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Gm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Hm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Wm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Xm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,qm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ym=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Zm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Jm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Km=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$m=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Qm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,jm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,e0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,t0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,n0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,i0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,s0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,r0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,a0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,o0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,l0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,c0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,h0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,u0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,d0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,f0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,p0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,m0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,g0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,x0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,_0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,v0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,y0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,M0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,b0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,S0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,w0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,E0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,T0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,A0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,R0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,C0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,I0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,P0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,L0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,D0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,N0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,U0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,F0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,O0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,B0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,z0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,k0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,V0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,G0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,H0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,W0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,X0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,q0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Y0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Z0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,J0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,K0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Q0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,j0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,eg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ng=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ot={alphahash_fragment:Sp,alphahash_pars_fragment:wp,alphamap_fragment:Ep,alphamap_pars_fragment:Tp,alphatest_fragment:Ap,alphatest_pars_fragment:Rp,aomap_fragment:Cp,aomap_pars_fragment:Ip,batching_pars_vertex:Pp,batching_vertex:Lp,begin_vertex:Dp,beginnormal_vertex:Np,bsdfs:Up,iridescence_fragment:Fp,bumpmap_pars_fragment:Op,clipping_planes_fragment:Bp,clipping_planes_pars_fragment:zp,clipping_planes_pars_vertex:kp,clipping_planes_vertex:Vp,color_fragment:Gp,color_pars_fragment:Hp,color_pars_vertex:Wp,color_vertex:Xp,common:qp,cube_uv_reflection_fragment:Yp,defaultnormal_vertex:Zp,displacementmap_pars_vertex:Jp,displacementmap_vertex:Kp,emissivemap_fragment:$p,emissivemap_pars_fragment:Qp,colorspace_fragment:jp,colorspace_pars_fragment:em,envmap_fragment:tm,envmap_common_pars_fragment:nm,envmap_pars_fragment:im,envmap_pars_vertex:sm,envmap_physical_pars_fragment:mm,envmap_vertex:rm,fog_vertex:am,fog_pars_vertex:om,fog_fragment:lm,fog_pars_fragment:cm,gradientmap_pars_fragment:hm,lightmap_pars_fragment:um,lights_lambert_fragment:dm,lights_lambert_pars_fragment:fm,lights_pars_begin:pm,lights_toon_fragment:gm,lights_toon_pars_fragment:xm,lights_phong_fragment:_m,lights_phong_pars_fragment:vm,lights_physical_fragment:ym,lights_physical_pars_fragment:Mm,lights_fragment_begin:bm,lights_fragment_maps:Sm,lights_fragment_end:wm,lightprobes_pars_fragment:Em,logdepthbuf_fragment:Tm,logdepthbuf_pars_fragment:Am,logdepthbuf_pars_vertex:Rm,logdepthbuf_vertex:Cm,map_fragment:Im,map_pars_fragment:Pm,map_particle_fragment:Lm,map_particle_pars_fragment:Dm,metalnessmap_fragment:Nm,metalnessmap_pars_fragment:Um,morphinstance_vertex:Fm,morphcolor_vertex:Om,morphnormal_vertex:Bm,morphtarget_pars_vertex:zm,morphtarget_vertex:km,normal_fragment_begin:Vm,normal_fragment_maps:Gm,normal_pars_fragment:Hm,normal_pars_vertex:Wm,normal_vertex:Xm,normalmap_pars_fragment:qm,clearcoat_normal_fragment_begin:Ym,clearcoat_normal_fragment_maps:Zm,clearcoat_pars_fragment:Jm,iridescence_pars_fragment:Km,opaque_fragment:$m,packing:Qm,premultiplied_alpha_fragment:jm,project_vertex:e0,dithering_fragment:t0,dithering_pars_fragment:n0,roughnessmap_fragment:i0,roughnessmap_pars_fragment:s0,shadowmap_pars_fragment:r0,shadowmap_pars_vertex:a0,shadowmap_vertex:o0,shadowmask_pars_fragment:l0,skinbase_vertex:c0,skinning_pars_vertex:h0,skinning_vertex:u0,skinnormal_vertex:d0,specularmap_fragment:f0,specularmap_pars_fragment:p0,tonemapping_fragment:m0,tonemapping_pars_fragment:g0,transmission_fragment:x0,transmission_pars_fragment:_0,uv_pars_fragment:v0,uv_pars_vertex:y0,uv_vertex:M0,worldpos_vertex:b0,background_vert:S0,background_frag:w0,backgroundCube_vert:E0,backgroundCube_frag:T0,cube_vert:A0,cube_frag:R0,depth_vert:C0,depth_frag:I0,distance_vert:P0,distance_frag:L0,equirect_vert:D0,equirect_frag:N0,linedashed_vert:U0,linedashed_frag:F0,meshbasic_vert:O0,meshbasic_frag:B0,meshlambert_vert:z0,meshlambert_frag:k0,meshmatcap_vert:V0,meshmatcap_frag:G0,meshnormal_vert:H0,meshnormal_frag:W0,meshphong_vert:X0,meshphong_frag:q0,meshphysical_vert:Y0,meshphysical_frag:Z0,meshtoon_vert:J0,meshtoon_frag:K0,points_vert:$0,points_frag:Q0,shadow_vert:j0,shadow_frag:eg,sprite_vert:tg,sprite_frag:ng},Te={common:{diffuse:{value:new Ce(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new et}},envmap:{envMap:{value:null},envMapRotation:{value:new et},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new et}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new et}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new et},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new et},normalScale:{value:new ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new et},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new et}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new et}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new et}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ce(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new O},probesMax:{value:new O},probesResolution:{value:new O}},points:{diffuse:{value:new Ce(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0},uvTransform:{value:new et}},sprite:{diffuse:{value:new Ce(16777215)},opacity:{value:1},center:{value:new ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}}},Kn={basic:{uniforms:rn([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.fog]),vertexShader:ot.meshbasic_vert,fragmentShader:ot.meshbasic_frag},lambert:{uniforms:rn([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new Ce(0)},envMapIntensity:{value:1}}]),vertexShader:ot.meshlambert_vert,fragmentShader:ot.meshlambert_frag},phong:{uniforms:rn([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new Ce(0)},specular:{value:new Ce(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ot.meshphong_vert,fragmentShader:ot.meshphong_frag},standard:{uniforms:rn([Te.common,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.roughnessmap,Te.metalnessmap,Te.fog,Te.lights,{emissive:{value:new Ce(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ot.meshphysical_vert,fragmentShader:ot.meshphysical_frag},toon:{uniforms:rn([Te.common,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.gradientmap,Te.fog,Te.lights,{emissive:{value:new Ce(0)}}]),vertexShader:ot.meshtoon_vert,fragmentShader:ot.meshtoon_frag},matcap:{uniforms:rn([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,{matcap:{value:null}}]),vertexShader:ot.meshmatcap_vert,fragmentShader:ot.meshmatcap_frag},points:{uniforms:rn([Te.points,Te.fog]),vertexShader:ot.points_vert,fragmentShader:ot.points_frag},dashed:{uniforms:rn([Te.common,Te.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ot.linedashed_vert,fragmentShader:ot.linedashed_frag},depth:{uniforms:rn([Te.common,Te.displacementmap]),vertexShader:ot.depth_vert,fragmentShader:ot.depth_frag},normal:{uniforms:rn([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,{opacity:{value:1}}]),vertexShader:ot.meshnormal_vert,fragmentShader:ot.meshnormal_frag},sprite:{uniforms:rn([Te.sprite,Te.fog]),vertexShader:ot.sprite_vert,fragmentShader:ot.sprite_frag},background:{uniforms:{uvTransform:{value:new et},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ot.background_vert,fragmentShader:ot.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new et}},vertexShader:ot.backgroundCube_vert,fragmentShader:ot.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ot.cube_vert,fragmentShader:ot.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ot.equirect_vert,fragmentShader:ot.equirect_frag},distance:{uniforms:rn([Te.common,Te.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ot.distance_vert,fragmentShader:ot.distance_frag},shadow:{uniforms:rn([Te.lights,Te.fog,{color:{value:new Ce(0)},opacity:{value:1}}]),vertexShader:ot.shadow_vert,fragmentShader:ot.shadow_frag}};Kn.physical={uniforms:rn([Kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new et},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new et},clearcoatNormalScale:{value:new ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new et},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new et},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new et},sheen:{value:0},sheenColor:{value:new Ce(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new et},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new et},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new et},transmissionSamplerSize:{value:new ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new et},attenuationDistance:{value:0},attenuationColor:{value:new Ce(0)},specularColor:{value:new Ce(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new et},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new et},anisotropyVector:{value:new ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new et}}]),vertexShader:ot.meshphysical_vert,fragmentShader:ot.meshphysical_frag};var il={r:0,b:0,g:0},ig=new gt,hd=new et;hd.set(-1,0,0,0,1,0,0,0,1);function sg(i,e,t,n,s,r){let a=new Ce(0),o=s===!0?0:1,l,c,d=null,f=0,h=null;function m(y){let v=y.isScene===!0?y.background:null;if(v&&v.isTexture){let _=y.backgroundBlurriness>0;v=e.get(v,_)}return v}function x(y){let v=!1,_=m(y);_===null?p(a,o):_&&_.isColor&&(p(_,1),v=!0);let E=i.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||v)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function b(y,v){let _=m(v);_&&(_.isCubeTexture||_.mapping===kr)?(c===void 0&&(c=new qe(new mn(1,1,1),new Gt({name:"BackgroundCubeMaterial",uniforms:Qi(Kn.backgroundCube.uniforms),vertexShader:Kn.backgroundCube.vertexShader,fragmentShader:Kn.backgroundCube.fragmentShader,side:$t,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,w,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=_,c.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(ig.makeRotationFromEuler(v.backgroundRotation)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(hd),c.material.toneMapped=dt.getTransfer(_.colorSpace)!==Mt,(d!==_||f!==_.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,d=_,f=_.version,h=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new qe(new On(2,2),new Gt({name:"BackgroundMaterial",uniforms:Qi(Kn.background.uniforms),vertexShader:Kn.background.vertexShader,fragmentShader:Kn.background.fragmentShader,side:Ci,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=dt.getTransfer(_.colorSpace)!==Mt,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(d!==_||f!==_.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,d=_,f=_.version,h=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function p(y,v){y.getRGB(il,Pc(i)),t.buffers.color.setClear(il.r,il.g,il.b,v,r)}function u(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,v=1){a.set(y),o=v,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,p(a,o)},render:x,addToRenderList:b,dispose:u}}function rg(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,a=!1;function o(C,I,P,L,F){let N=!1,B=f(C,L,P,I);r!==B&&(r=B,c(r.object)),N=m(C,L,P,F),N&&x(C,L,P,F),F!==null&&e.update(F,i.ELEMENT_ARRAY_BUFFER),(N||a)&&(a=!1,_(C,I,P,L),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function l(){return i.createVertexArray()}function c(C){return i.bindVertexArray(C)}function d(C){return i.deleteVertexArray(C)}function f(C,I,P,L){let F=L.wireframe===!0,N=n[I.id];N===void 0&&(N={},n[I.id]=N);let B=C.isInstancedMesh===!0?C.id:0,Z=N[B];Z===void 0&&(Z={},N[B]=Z);let Y=Z[P.id];Y===void 0&&(Y={},Z[P.id]=Y);let Q=Y[F];return Q===void 0&&(Q=h(l()),Y[F]=Q),Q}function h(C){let I=[],P=[],L=[];for(let F=0;F<t;F++)I[F]=0,P[F]=0,L[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:P,attributeDivisors:L,object:C,attributes:{},index:null}}function m(C,I,P,L){let F=r.attributes,N=I.attributes,B=0,Z=P.getAttributes();for(let Y in Z)if(Z[Y].location>=0){let q=F[Y],_e=N[Y];if(_e===void 0&&(Y==="instanceMatrix"&&C.instanceMatrix&&(_e=C.instanceMatrix),Y==="instanceColor"&&C.instanceColor&&(_e=C.instanceColor)),q===void 0||q.attribute!==_e||_e&&q.data!==_e.data)return!0;B++}return r.attributesNum!==B||r.index!==L}function x(C,I,P,L){let F={},N=I.attributes,B=0,Z=P.getAttributes();for(let Y in Z)if(Z[Y].location>=0){let q=N[Y];q===void 0&&(Y==="instanceMatrix"&&C.instanceMatrix&&(q=C.instanceMatrix),Y==="instanceColor"&&C.instanceColor&&(q=C.instanceColor));let _e={};_e.attribute=q,q&&q.data&&(_e.data=q.data),F[Y]=_e,B++}r.attributes=F,r.attributesNum=B,r.index=L}function b(){let C=r.newAttributes;for(let I=0,P=C.length;I<P;I++)C[I]=0}function p(C){u(C,0)}function u(C,I){let P=r.newAttributes,L=r.enabledAttributes,F=r.attributeDivisors;P[C]=1,L[C]===0&&(i.enableVertexAttribArray(C),L[C]=1),F[C]!==I&&(i.vertexAttribDivisor(C,I),F[C]=I)}function y(){let C=r.newAttributes,I=r.enabledAttributes;for(let P=0,L=I.length;P<L;P++)I[P]!==C[P]&&(i.disableVertexAttribArray(P),I[P]=0)}function v(C,I,P,L,F,N,B){B===!0?i.vertexAttribIPointer(C,I,P,F,N):i.vertexAttribPointer(C,I,P,L,F,N)}function _(C,I,P,L){b();let F=L.attributes,N=P.getAttributes(),B=I.defaultAttributeValues;for(let Z in N){let Y=N[Z];if(Y.location>=0){let Q=F[Z];if(Q===void 0&&(Z==="instanceMatrix"&&C.instanceMatrix&&(Q=C.instanceMatrix),Z==="instanceColor"&&C.instanceColor&&(Q=C.instanceColor)),Q!==void 0){let q=Q.normalized,_e=Q.itemSize,pe=e.get(Q);if(pe===void 0)continue;let Ve=pe.buffer,We=pe.type,je=pe.bytesPerElement,te=We===i.INT||We===i.UNSIGNED_INT||Q.gpuType===xo;if(Q.isInterleavedBufferAttribute){let ie=Q.data,ge=ie.stride,Ge=Q.offset;if(ie.isInstancedInterleavedBuffer){for(let xe=0;xe<Y.locationSize;xe++)u(Y.location+xe,ie.meshPerAttribute);C.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let xe=0;xe<Y.locationSize;xe++)p(Y.location+xe);i.bindBuffer(i.ARRAY_BUFFER,Ve);for(let xe=0;xe<Y.locationSize;xe++)v(Y.location+xe,_e/Y.locationSize,We,q,ge*je,(Ge+_e/Y.locationSize*xe)*je,te)}else{if(Q.isInstancedBufferAttribute){for(let ie=0;ie<Y.locationSize;ie++)u(Y.location+ie,Q.meshPerAttribute);C.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let ie=0;ie<Y.locationSize;ie++)p(Y.location+ie);i.bindBuffer(i.ARRAY_BUFFER,Ve);for(let ie=0;ie<Y.locationSize;ie++)v(Y.location+ie,_e/Y.locationSize,We,q,_e*je,_e/Y.locationSize*ie*je,te)}}else if(B!==void 0){let q=B[Z];if(q!==void 0)switch(q.length){case 2:i.vertexAttrib2fv(Y.location,q);break;case 3:i.vertexAttrib3fv(Y.location,q);break;case 4:i.vertexAttrib4fv(Y.location,q);break;default:i.vertexAttrib1fv(Y.location,q)}}}}y()}function E(){M();for(let C in n){let I=n[C];for(let P in I){let L=I[P];for(let F in L){let N=L[F];for(let B in N)d(N[B].object),delete N[B];delete L[F]}}delete n[C]}}function w(C){if(n[C.id]===void 0)return;let I=n[C.id];for(let P in I){let L=I[P];for(let F in L){let N=L[F];for(let B in N)d(N[B].object),delete N[B];delete L[F]}}delete n[C.id]}function T(C){for(let I in n){let P=n[I];for(let L in P){let F=P[L];if(F[C.id]===void 0)continue;let N=F[C.id];for(let B in N)d(N[B].object),delete N[B];delete F[C.id]}}}function g(C){for(let I in n){let P=n[I],L=C.isInstancedMesh===!0?C.id:0,F=P[L];if(F!==void 0){for(let N in F){let B=F[N];for(let Z in B)d(B[Z].object),delete B[Z];delete F[N]}delete P[L],Object.keys(P).length===0&&delete n[I]}}}function M(){A(),a=!0,r!==s&&(r=s,c(r.object))}function A(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:M,resetDefaultState:A,dispose:E,releaseStatesOfGeometry:w,releaseStatesOfObject:g,releaseStatesOfProgram:T,initAttributes:b,enableAttribute:p,disableUnusedAttributes:y}}function ag(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,d){d!==0&&(i.drawArraysInstanced(n,l,c,d),t.update(c,n,d))}function o(l,c,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,d);let h=0;for(let m=0;m<d;m++)h+=c[m];t.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function og(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let T=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(T){return!(T!==Rn&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){let g=T===vn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==dn&&T!==An&&!g&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",d=l(c);d!==c&&(Ke("WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);let f=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Ke("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),u=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=i.getParameter(i.MAX_SAMPLES),w=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:m,maxVertexTextures:x,maxTextureSize:b,maxCubemapSize:p,maxAttributes:u,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:_,maxSamples:E,samples:w}}function lg(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Nn,o=new et,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){let m=f.length!==0||h||n!==0||s;return s=h,n=f.length,m},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,h){t=d(f,h,0)},this.setState=function(f,h,m){let x=f.clippingPlanes,b=f.clipIntersection,p=f.clipShadows,u=i.get(f);if(!s||x===null||x.length===0||r&&!p)r?d(null):c();else{let y=r?0:n,v=y*4,_=u.clippingState||null;l.value=_,_=d(x,h,v,m);for(let E=0;E!==v;++E)_[E]=t[E];u.clippingState=_,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(f,h,m,x){let b=f!==null?f.length:0,p=null;if(b!==0){if(p=l.value,x!==!0||p===null){let u=m+b*4,y=h.matrixWorldInverse;o.getNormalMatrix(y),(p===null||p.length<u)&&(p=new Float32Array(u));for(let v=0,_=m;v!==b;++v,_+=4)a.copy(f[v]).applyMatrix4(y,o),a.normal.toArray(p,_),p[_+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,p}}var qs=4,cg=6,hg=20,ug=256,Jr=new zs,Gu=new Ce,kc=null,Vc=0,Gc=0,Hc=!1,dg=new O,ji=new O,Zs=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=dg}=r;kc=this._renderer.getRenderTarget(),Vc=this._renderer.getActiveCubeFace(),Gc=this._renderer.getActiveMipmapLevel(),Hc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Wu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(kc,Vc,Gc),this._renderer.xr.enabled=Hc,e.scissorTest=!1,Xs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Pi||e.mapping===$i?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),kc=this._renderer.getRenderTarget(),Vc=this._renderer.getActiveCubeFace(),Gc=this._renderer.getActiveMipmapLevel(),Hc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:kt,minFilter:kt,generateMipmaps:!1,type:vn,format:Rn,colorSpace:dr,depthBuffer:!1},s=Hu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Hu(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=fg(r)),this._blurMaterial=mg(r,e,t),this._ggxMaterial=pg(r,e,t)}return s}_compileMaterial(e){let t=new qe(new St,e);this._renderer.compile(t,Jr)}_sceneToCubeUV(e,t,n,s,r){let l=new Kt(90,1,t,n),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,m=f.toneMapping;f.getClearColor(Gu),f.toneMapping=Bn,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new qe(new mn,new Wi({name:"PMREM.Background",side:$t,depthWrite:!1,depthTest:!1})));let b=this._backgroundBox,p=b.material,u=!1,y=e.background;y?y.isColor&&(p.color.copy(y),e.background=null,u=!0):(p.color.copy(Gu),u=!0);for(let v=0;v<6;v++){let _=v%3;_===0?(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+d[v],r.y,r.z)):_===1?(l.up.set(0,0,c[v]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+d[v],r.z)):(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+d[v]));let E=this._cubeSize;Xs(s,_*E,v>2?E:0,E,E),f.setRenderTarget(s),u&&f.render(b,l),f.render(e,l)}f.toneMapping=m,f.autoClear=h,e.background=y}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Pi||e.mapping===$i;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Wu());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;Xs(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Jr)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-d*d),h=c*1.25,m=f*h,{_lodMax:x}=this,b=this._sizeLods[n],p=3*b*(n>x-qs?n-x+qs:0),u=4*(this._cubeSize-b);l.envMap.value=e.texture,l.roughness.value=m,l.mipInt.value=x-t,Xs(r,p,u,3*b,2*b),s.setRenderTarget(r),s.render(o,Jr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=x-n,Xs(e,p,u,3*b,2*b),s.setRenderTarget(e),s.render(o,Jr)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,s,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let d=this._sizeLods[s],f=3*d*(s>this._lodMax-qs?s-this._lodMax+qs:0),h=4*(this._cubeSize-d);Xs(t,f,h,3*d,2*d),a.setRenderTarget(t),a.render(l,Jr)}};function fg(i){let e=[],t=[],n=i,s=i-qs+1+cg;for(let r=0;r<s;r++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),l=-o,c=1+o,d=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,h=6,m=3,x=new Float32Array(m*h*f),b=new Float32Array(m*h*f);for(let u=0;u<f;u++){let y=u%3*2/3-1,v=u>2?0:-1,_=[y,v,0,y+2/3,v,0,y+2/3,v+1,0,y,v,0,y+2/3,v+1,0,y,v+1,0];x.set(_,m*h*u);for(let E=0;E<h;E++){let w=d[E*2]*2-1,T=d[E*2+1]*2-1;u===0?ji.set(1,T,w):u===1?ji.set(-w,1,-T):u===2?ji.set(-w,T,1):u===3?ji.set(-1,T,-w):u===4?ji.set(-w,-1,T):ji.set(w,T,-1),ji.toArray(b,(u*h+E)*m)}}let p=new St;p.setAttribute("position",new Yt(x,m)),p.setAttribute("outputDirection",new Yt(b,m)),t.push(new qe(p,null)),n>qs&&n--}return{lodMeshes:t,sizeLods:e}}function Hu(i,e,t){let n=new un(i,e,t);return n.texture.mapping=kr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Xs(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function pg(i,e,t){return new Gt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:ug,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:al(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function mg(i,e,t){return new Gt({name:"SphericalGaussianBlur",defines:{SAMPLES:hg,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:al(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function Wu(){return new Gt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:al(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function Xu(){return new Gt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:al(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function al(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Js=class extends un{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Mr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new mn(5,5,5),r=new Gt({name:"CubemapFromEquirect",uniforms:Qi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:$t,blending:Zn});r.uniforms.tEquirect.value=t;let a=new qe(s,r),o=t.minFilter;return t.minFilter===Tn&&(t.minFilter=kt),new ks(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};function gg(i){let e=new WeakMap,t=new WeakMap,n=null;function s(h,m=!1){return h==null?null:m?a(h):r(h)}function r(h){if(h&&h.isTexture){let m=h.mapping;if(m===po||m===mo)if(e.has(h)){let x=e.get(h).texture;return o(x,h.mapping)}else{let x=h.image;if(x&&x.height>0){let b=new Js(x.height);return b.fromEquirectangularTexture(i,h),e.set(h,b),h.addEventListener("dispose",c),o(b.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){let m=h.mapping,x=m===po||m===mo,b=m===Pi||m===$i;if(x||b){let p=t.get(h),u=p!==void 0?p.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==u)return n===null&&(n=new Zs(i)),p=x?n.fromEquirectangular(h,p):n.fromCubemap(h,p),p.texture.pmremVersion=h.pmremVersion,t.set(h,p),p.texture;if(p!==void 0)return p.texture;{let y=h.image;return x&&y&&y.height>0||b&&y&&l(y)?(n===null&&(n=new Zs(i)),p=x?n.fromEquirectangular(h):n.fromCubemap(h),p.texture.pmremVersion=h.pmremVersion,t.set(h,p),h.addEventListener("dispose",d),p.texture):null}}}return h}function o(h,m){return m===po?h.mapping=Pi:m===mo&&(h.mapping=$i),h}function l(h){let m=0,x=6;for(let b=0;b<x;b++)h[b]!==void 0&&m++;return m===x}function c(h){let m=h.target;m.removeEventListener("dispose",c);let x=e.get(m);x!==void 0&&(e.delete(m),x.dispose())}function d(h){let m=h.target;m.removeEventListener("dispose",d);let x=t.get(m);x!==void 0&&(t.delete(m),x.dispose())}function f(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function xg(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Gi("WebGLRenderer: "+n+" extension not supported."),s}}}function _g(i,e,t,n){let s={},r=new WeakMap;function a(f){let h=f.target;h.index!==null&&e.remove(h.index);for(let x in h.attributes)e.remove(h.attributes[x]);h.removeEventListener("dispose",a),delete s[h.id];let m=r.get(h);m&&(e.remove(m),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(f,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function l(f){let h=f.attributes;for(let m in h)e.update(h[m],i.ARRAY_BUFFER)}function c(f){let h=[],m=f.index,x=f.attributes.position,b=0;if(x===void 0)return;if(m!==null){let y=m.array;b=m.version;for(let v=0,_=y.length;v<_;v+=3){let E=y[v+0],w=y[v+1],T=y[v+2];h.push(E,w,w,T,T,E)}}else{let y=x.array;b=x.version;for(let v=0,_=y.length/3-1;v<_;v+=3){let E=v+0,w=v+1,T=v+2;h.push(E,w,w,T,T,E)}}let p=new(x.count>=65535?_r:xr)(h,1);p.version=b;let u=r.get(f);u&&e.remove(u),r.set(f,p)}function d(f){let h=r.get(f);if(h){let m=f.index;m!==null&&h.version<m.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:d}}function vg(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,h){i.drawElements(n,h,r,f*a),t.update(h,n,1)}function c(f,h,m){m!==0&&(i.drawElementsInstanced(n,h,r,f*a,m),t.update(h,n,m))}function d(f,h,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,f,0,m);let b=0;for(let p=0;p<m;p++)b+=h[p];t.update(b,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d}function yg(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Je("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Mg(i,e,t){let n=new WeakMap,s=new It;function r(a,o,l){let c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=d!==void 0?d.length:0,h=n.get(o);if(h===void 0||h.count!==f){let M=function(){T.dispose(),n.delete(o),o.removeEventListener("dispose",M)};h!==void 0&&h.texture.dispose();let m=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,b=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],u=o.morphAttributes.normal||[],y=o.morphAttributes.color||[],v=0;m===!0&&(v=1),x===!0&&(v=2),b===!0&&(v=3);let _=o.attributes.position.count*v,E=1;_>e.maxTextureSize&&(E=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);let w=new Float32Array(_*E*4*f),T=new mr(w,_,E,f);T.type=An,T.needsUpdate=!0;let g=v*4;for(let A=0;A<f;A++){let C=p[A],I=u[A],P=y[A],L=_*E*4*A;for(let F=0;F<C.count;F++){let N=F*g;m===!0&&(s.fromBufferAttribute(C,F),w[L+N+0]=s.x,w[L+N+1]=s.y,w[L+N+2]=s.z,w[L+N+3]=0),x===!0&&(s.fromBufferAttribute(I,F),w[L+N+4]=s.x,w[L+N+5]=s.y,w[L+N+6]=s.z,w[L+N+7]=0),b===!0&&(s.fromBufferAttribute(P,F),w[L+N+8]=s.x,w[L+N+9]=s.y,w[L+N+10]=s.z,w[L+N+11]=P.itemSize===4?s.w:1)}}h={count:f,texture:T,size:new ye(_,E)},n.set(o,h),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let m=0;for(let b=0;b<c.length;b++)m+=c[b];let x=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(i,"morphTargetBaseInfluence",x),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function bg(i,e,t,n,s){let r=new WeakMap;function a(c){let d=s.render.frame,f=c.geometry,h=e.get(c,f);if(r.get(h)!==d&&(e.update(h),r.set(h,d)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==d&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,d))),c.isSkinnedMesh){let m=c.skeleton;r.get(m)!==d&&(m.update(),r.set(m,d))}return h}function o(){r=new WeakMap}function l(c){let d=c.target;d.removeEventListener("dispose",l),n.releaseStatesOfObject(d),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:a,dispose:o}}var Sg={[mc]:"LINEAR_TONE_MAPPING",[gc]:"REINHARD_TONE_MAPPING",[xc]:"CINEON_TONE_MAPPING",[zr]:"ACES_FILMIC_TONE_MAPPING",[vc]:"AGX_TONE_MAPPING",[yc]:"NEUTRAL_TONE_MAPPING",[_c]:"CUSTOM_TONE_MAPPING"};function wg(i,e,t,n,s,r){let a=new un(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new St;c.setAttribute("position",new Xe([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Xe([0,2,0,0,2,0],2));let d=new $a({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new qe(c,d),h=new zs(-1,1,1,-1,0,1),m=null,x=null,b=!1,p,u=null,y=[],v=!1;this.setSize=function(_,E){a.setSize(_,E),o!==null&&o.setSize(_,E),l!==null&&l.setSize(_,E);for(let w=0;w<y.length;w++){let T=y[w];T.setSize&&T.setSize(_,E)}},this.setEffects=function(_){y=_,v=y.length>0&&y[0].isRenderPass===!0;let E=a.width,w=a.height;y.length>0&&o===null&&(o=new un(E,w,{type:vn,depthBuffer:!1,stencilBuffer:!1}),l=new un(E,w,{type:vn,depthBuffer:!1,stencilBuffer:!1}));for(let T=0;T<y.length;T++){let g=y[T];g.setSize&&g.setSize(E,w)}},this.begin=function(_,E){if(b||_.toneMapping===Bn&&y.length===0)return!1;if(u=E,E!==null){let w=E.width,T=E.height;(a.width!==w||a.height!==T)&&this.setSize(w,T)}return v===!1&&_.setRenderTarget(a),p=_.toneMapping,_.toneMapping=Bn,!0},this.hasRenderPass=function(){return v},this.end=function(_,E){_.toneMapping=p,b=!0;let w=a,T=o;for(let g=0;g<y.length;g++){let M=y[g];M.enabled!==!1&&(M.render(_,T,w,E),M.needsSwap!==!1&&(w=T,T=T===o?l:o))}if(m!==_.outputColorSpace||x!==_.toneMapping){m=_.outputColorSpace,x=_.toneMapping,d.defines={},dt.getTransfer(m)===Mt&&(d.defines.SRGB_TRANSFER="");let g=Sg[x];g&&(d.defines[g]=""),d.needsUpdate=!0}d.uniforms.tDiffuse.value=w.texture,_.setRenderTarget(u),_.render(f,h),u=null,b=!1},this.isCompositing=function(){return b},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),d.dispose()}}var ud=new cn,qc=new Ei(1,1),dd=new mr,fd=new Ga,pd=new Mr,qu=[],Yu=[],Zu=new Float32Array(16),Ju=new Float32Array(9),Ku=new Float32Array(4);function Ks(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=qu[s];if(r===void 0&&(r=new Float32Array(s),qu[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Ht(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Wt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ol(i,e){let t=Yu[e];t===void 0&&(t=new Int32Array(e),Yu[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Eg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Tg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;i.uniform2fv(this.addr,e),Wt(t,e)}}function Ag(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ht(t,e))return;i.uniform3fv(this.addr,e),Wt(t,e)}}function Rg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;i.uniform4fv(this.addr,e),Wt(t,e)}}function Cg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ht(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Wt(t,e)}else{if(Ht(t,n))return;Ku.set(n),i.uniformMatrix2fv(this.addr,!1,Ku),Wt(t,n)}}function Ig(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ht(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Wt(t,e)}else{if(Ht(t,n))return;Ju.set(n),i.uniformMatrix3fv(this.addr,!1,Ju),Wt(t,n)}}function Pg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ht(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Wt(t,e)}else{if(Ht(t,n))return;Zu.set(n),i.uniformMatrix4fv(this.addr,!1,Zu),Wt(t,n)}}function Lg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Dg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;i.uniform2iv(this.addr,e),Wt(t,e)}}function Ng(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ht(t,e))return;i.uniform3iv(this.addr,e),Wt(t,e)}}function Ug(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;i.uniform4iv(this.addr,e),Wt(t,e)}}function Fg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Og(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;i.uniform2uiv(this.addr,e),Wt(t,e)}}function Bg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ht(t,e))return;i.uniform3uiv(this.addr,e),Wt(t,e)}}function zg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;i.uniform4uiv(this.addr,e),Wt(t,e)}}function kg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(qc.compareFunction=t.isReversedDepthBuffer()?nl:tl,r=qc):r=ud,t.setTexture2D(e||r,s)}function Vg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||fd,s)}function Gg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||pd,s)}function Hg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||dd,s)}function Wg(i){switch(i){case 5126:return Eg;case 35664:return Tg;case 35665:return Ag;case 35666:return Rg;case 35674:return Cg;case 35675:return Ig;case 35676:return Pg;case 5124:case 35670:return Lg;case 35667:case 35671:return Dg;case 35668:case 35672:return Ng;case 35669:case 35673:return Ug;case 5125:return Fg;case 36294:return Og;case 36295:return Bg;case 36296:return zg;case 35678:case 36198:case 36298:case 36306:case 35682:return kg;case 35679:case 36299:case 36307:return Vg;case 35680:case 36300:case 36308:case 36293:return Gg;case 36289:case 36303:case 36311:case 36292:return Hg}}function Xg(i,e){i.uniform1fv(this.addr,e)}function qg(i,e){let t=Ks(e,this.size,2);i.uniform2fv(this.addr,t)}function Yg(i,e){let t=Ks(e,this.size,3);i.uniform3fv(this.addr,t)}function Zg(i,e){let t=Ks(e,this.size,4);i.uniform4fv(this.addr,t)}function Jg(i,e){let t=Ks(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Kg(i,e){let t=Ks(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function $g(i,e){let t=Ks(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Qg(i,e){i.uniform1iv(this.addr,e)}function jg(i,e){i.uniform2iv(this.addr,e)}function ex(i,e){i.uniform3iv(this.addr,e)}function tx(i,e){i.uniform4iv(this.addr,e)}function nx(i,e){i.uniform1uiv(this.addr,e)}function ix(i,e){i.uniform2uiv(this.addr,e)}function sx(i,e){i.uniform3uiv(this.addr,e)}function rx(i,e){i.uniform4uiv(this.addr,e)}function ax(i,e,t){let n=this.cache,s=e.length,r=ol(t,s);Ht(n,r)||(i.uniform1iv(this.addr,r),Wt(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=qc:a=ud;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function ox(i,e,t){let n=this.cache,s=e.length,r=ol(t,s);Ht(n,r)||(i.uniform1iv(this.addr,r),Wt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||fd,r[a])}function lx(i,e,t){let n=this.cache,s=e.length,r=ol(t,s);Ht(n,r)||(i.uniform1iv(this.addr,r),Wt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||pd,r[a])}function cx(i,e,t){let n=this.cache,s=e.length,r=ol(t,s);Ht(n,r)||(i.uniform1iv(this.addr,r),Wt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||dd,r[a])}function hx(i){switch(i){case 5126:return Xg;case 35664:return qg;case 35665:return Yg;case 35666:return Zg;case 35674:return Jg;case 35675:return Kg;case 35676:return $g;case 5124:case 35670:return Qg;case 35667:case 35671:return jg;case 35668:case 35672:return ex;case 35669:case 35673:return tx;case 5125:return nx;case 36294:return ix;case 36295:return sx;case 36296:return rx;case 35678:case 36198:case 36298:case 36306:case 35682:return ax;case 35679:case 36299:case 36307:return ox;case 35680:case 36300:case 36308:case 36293:return lx;case 36289:case 36303:case 36311:case 36292:return cx}}var Yc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Wg(t.type)}},Zc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=hx(t.type)}},Jc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Wc=/(\w+)(\])?(\[|\.)?/g;function $u(i,e){i.seq.push(e),i.map[e.id]=e}function ux(i,e,t){let n=i.name,s=n.length;for(Wc.lastIndex=0;;){let r=Wc.exec(n),a=Wc.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){$u(t,c===void 0?new Yc(o,i,e):new Zc(o,i,e));break}else{let f=t.map[o];f===void 0&&(f=new Jc(o),$u(t,f)),t=f}}}var Ys=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);ux(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function Qu(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var dx=37297,fx=0;function px(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var ju=new et;function mx(i){dt._getMatrix(ju,dt.workingColorSpace,i);let e=`mat3( ${ju.elements.map(t=>t.toFixed(4))} )`;switch(dt.getTransfer(i)){case fr:return[e,"LinearTransferOETF"];case Mt:return[e,"sRGBTransferOETF"];default:return Ke("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function ed(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+px(i.getShaderSource(e),o)}else return r}function gx(i,e){let t=mx(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var xx={[mc]:"Linear",[gc]:"Reinhard",[xc]:"Cineon",[zr]:"ACESFilmic",[vc]:"AgX",[yc]:"Neutral",[_c]:"Custom"};function _x(i,e){let t=xx[e];return t===void 0?(Ke("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var sl=new O;function vx(){dt.getLuminanceCoefficients(sl);let i=sl.x.toFixed(4),e=sl.y.toFixed(4),t=sl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function yx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter($r).join(`
`)}function Mx(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function bx(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function $r(i){return i!==""}function td(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function nd(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Sx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Kc(i){return i.replace(Sx,Ex)}var wx=new Map;function Ex(i,e){let t=ot[e];if(t===void 0){let n=wx.get(e);if(n!==void 0)t=ot[n],Ke('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Kc(t)}var Tx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function id(i){return i.replace(Tx,Ax)}function Ax(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function sd(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var Rx={[Br]:"SHADOWMAP_TYPE_PCF",[Vs]:"SHADOWMAP_TYPE_VSM"};function Cx(i){return Rx[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Ix={[Pi]:"ENVMAP_TYPE_CUBE",[$i]:"ENVMAP_TYPE_CUBE",[kr]:"ENVMAP_TYPE_CUBE_UV"};function Px(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Ix[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var Lx={[$i]:"ENVMAP_MODE_REFRACTION"};function Dx(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Lx[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Nx={[pc]:"ENVMAP_BLENDING_MULTIPLY",[xu]:"ENVMAP_BLENDING_MIX",[_u]:"ENVMAP_BLENDING_ADD"};function Ux(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Nx[i.combine]||"ENVMAP_BLENDING_NONE"}function Fx(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Ox(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=Cx(t),c=Px(t),d=Dx(t),f=Ux(t),h=Fx(t),m=yx(t),x=Mx(r),b=s.createProgram(),p,u,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter($r).join(`
`),p.length>0&&(p+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter($r).join(`
`),u.length>0&&(u+=`
`)):(p=[sd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter($r).join(`
`),u=[sd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Bn?"#define TONE_MAPPING":"",t.toneMapping!==Bn?ot.tonemapping_pars_fragment:"",t.toneMapping!==Bn?_x("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ot.colorspace_pars_fragment,gx("linearToOutputTexel",t.outputColorSpace),vx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter($r).join(`
`)),a=Kc(a),a=td(a,t),a=nd(a,t),o=Kc(o),o=td(o,t),o=nd(o,t),a=id(a),o=id(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,u=["#define varying in",t.glslVersion===Rc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Rc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);let v=y+p+a,_=y+u+o,E=Qu(s,s.VERTEX_SHADER,v),w=Qu(s,s.FRAGMENT_SHADER,_);s.attachShader(b,E),s.attachShader(b,w),t.index0AttributeName!==void 0?s.bindAttribLocation(b,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(b,0,"position"),s.linkProgram(b);function T(C){if(i.debug.checkShaderErrors){let I=s.getProgramInfoLog(b)||"",P=s.getShaderInfoLog(E)||"",L=s.getShaderInfoLog(w)||"",F=I.trim(),N=P.trim(),B=L.trim(),Z=!0,Y=!0;if(s.getProgramParameter(b,s.LINK_STATUS)===!1)if(Z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,b,E,w);else{let Q=ed(s,E,"vertex"),q=ed(s,w,"fragment");Je("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(b,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+F+`
`+Q+`
`+q)}else F!==""?Ke("WebGLProgram: Program Info Log:",F):(N===""||B==="")&&(Y=!1);Y&&(C.diagnostics={runnable:Z,programLog:F,vertexShader:{log:N,prefix:p},fragmentShader:{log:B,prefix:u}})}s.deleteShader(E),s.deleteShader(w),g=new Ys(s,b),M=bx(s,b)}let g;this.getUniforms=function(){return g===void 0&&T(this),g};let M;this.getAttributes=function(){return M===void 0&&T(this),M};let A=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=s.getProgramParameter(b,dx)),A},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(b),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=fx++,this.cacheKey=e,this.usedTimes=1,this.program=b,this.vertexShader=E,this.fragmentShader=w,this}var Bx=0,$c=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Qc(e),t.set(e,n)),n}},Qc=class{constructor(e){this.id=Bx++,this.code=e,this.usedTimes=0}};function zx(i){return i===Di||i===qr||i===Yr}function kx(i,e,t,n,s,r){let a=new Is,o=new $c,l=new Set,c=[],d=new Map,f=n.logarithmicDepthBuffer,h=n.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(g){return l.add(g),g===0?"uv":`uv${g}`}function b(g,M,A,C,I,P){let L=C.fog,F=I.geometry,N=g.isMeshStandardMaterial||g.isMeshLambertMaterial||g.isMeshPhongMaterial?C.environment:null,B=g.isMeshStandardMaterial||g.isMeshLambertMaterial&&!g.envMap||g.isMeshPhongMaterial&&!g.envMap,Z=e.get(g.envMap||N,B),Y=Z&&Z.mapping===kr?Z.image.height:null,Q=m[g.type];g.precision!==null&&(h=n.getMaxPrecision(g.precision),h!==g.precision&&Ke("WebGLProgram.getParameters:",g.precision,"not supported, using",h,"instead."));let q=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,_e=q!==void 0?q.length:0,pe=0;F.morphAttributes.position!==void 0&&(pe=1),F.morphAttributes.normal!==void 0&&(pe=2),F.morphAttributes.color!==void 0&&(pe=3);let Ve,We,je,te;if(Q){let Et=Kn[Q];Ve=Et.vertexShader,We=Et.fragmentShader}else{Ve=g.vertexShader,We=g.fragmentShader;let Et=o.getVertexShaderStage(g),vt=o.getFragmentShaderStage(g);o.update(g,Et,vt),je=Et.id,te=vt.id}let ie=i.getRenderTarget(),ge=i.state.buffers.depth.getReversed(),Ge=I.isInstancedMesh===!0,xe=I.isBatchedMesh===!0,Fe=!!g.map,Pe=!!g.matcap,$=!!Z,ae=!!g.aoMap,W=!!g.lightMap,U=!!g.bumpMap&&g.wireframe===!1,k=!!g.normalMap,re=!!g.displacementMap,ue=!!g.emissiveMap,de=!!g.metalnessMap,me=!!g.roughnessMap,z=g.anisotropy>0,ht=g.clearcoat>0,it=g.dispersion>0,D=g.retroreflectivity>0,S=g.iridescence>0,H=g.sheen>0,X=g.transmission>0,ee=z&&!!g.anisotropyMap,fe=ht&&!!g.clearcoatMap,ve=ht&&!!g.clearcoatNormalMap,ne=ht&&!!g.clearcoatRoughnessMap,oe=S&&!!g.iridescenceMap,Me=S&&!!g.iridescenceThicknessMap,Oe=H&&!!g.sheenColorMap,Ee=H&&!!g.sheenRoughnessMap,be=!!g.specularMap,ke=!!g.specularColorMap,Ye=!!g.specularIntensityMap,st=X&&!!g.transmissionMap,G=X&&!!g.thicknessMap,Se=!!g.gradientMap,le=!!g.alphaMap,we=g.alphaTest>0,Ie=!!g.alphaHash,he=!!g.extensions,He=Bn;g.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(He=i.toneMapping);let Be={shaderID:Q,shaderType:g.type,shaderName:g.name,vertexShader:Ve,fragmentShader:We,defines:g.defines,customVertexShaderID:je,customFragmentShaderID:te,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:h,batching:xe,batchingColor:xe&&I._colorsTexture!==null,instancing:Ge,instancingColor:Ge&&I.instanceColor!==null,instancingMorph:Ge&&I.morphTexture!==null,outputColorSpace:ie===null?i.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:dt.workingColorSpace,alphaToCoverage:!!g.alphaToCoverage,map:Fe,matcap:Pe,envMap:$,envMapMode:$&&Z.mapping,envMapCubeUVHeight:Y,aoMap:ae,lightMap:W,bumpMap:U,normalMap:k,displacementMap:re,emissiveMap:ue,normalMapObjectSpace:k&&g.normalMapType===Mu,normalMapTangentSpace:k&&g.normalMapType===el,packedNormalMap:k&&g.normalMapType===el&&zx(g.normalMap.format),metalnessMap:de,roughnessMap:me,anisotropy:z,anisotropyMap:ee,clearcoat:ht,clearcoatMap:fe,clearcoatNormalMap:ve,clearcoatRoughnessMap:ne,dispersion:it,retroreflection:D,iridescence:S,iridescenceMap:oe,iridescenceThicknessMap:Me,sheen:H,sheenColorMap:Oe,sheenRoughnessMap:Ee,specularMap:be,specularColorMap:ke,specularIntensityMap:Ye,transmission:X,transmissionMap:st,thicknessMap:G,gradientMap:Se,opaque:g.transparent===!1&&g.blending===Ii&&g.alphaToCoverage===!1,alphaMap:le,alphaTest:we,alphaHash:Ie,combine:g.combine,mapUv:Fe&&x(g.map.channel),aoMapUv:ae&&x(g.aoMap.channel),lightMapUv:W&&x(g.lightMap.channel),bumpMapUv:U&&x(g.bumpMap.channel),normalMapUv:k&&x(g.normalMap.channel),displacementMapUv:re&&x(g.displacementMap.channel),emissiveMapUv:ue&&x(g.emissiveMap.channel),metalnessMapUv:de&&x(g.metalnessMap.channel),roughnessMapUv:me&&x(g.roughnessMap.channel),anisotropyMapUv:ee&&x(g.anisotropyMap.channel),clearcoatMapUv:fe&&x(g.clearcoatMap.channel),clearcoatNormalMapUv:ve&&x(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ne&&x(g.clearcoatRoughnessMap.channel),iridescenceMapUv:oe&&x(g.iridescenceMap.channel),iridescenceThicknessMapUv:Me&&x(g.iridescenceThicknessMap.channel),sheenColorMapUv:Oe&&x(g.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&x(g.sheenRoughnessMap.channel),specularMapUv:be&&x(g.specularMap.channel),specularColorMapUv:ke&&x(g.specularColorMap.channel),specularIntensityMapUv:Ye&&x(g.specularIntensityMap.channel),transmissionMapUv:st&&x(g.transmissionMap.channel),thicknessMapUv:G&&x(g.thicknessMap.channel),alphaMapUv:le&&x(g.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(k||z),vertexNormals:!!F.attributes.normal,vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!F.attributes.uv&&(Fe||le),fog:!!L,useFog:g.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:g.wireframe===!1&&(g.flatShading===!0||F.attributes.normal===void 0&&k===!1&&(g.isMeshLambertMaterial||g.isMeshPhongMaterial||g.isMeshStandardMaterial||g.isMeshPhysicalMaterial)),sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:ge,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:F.attributes.position!==void 0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:_e,morphTextureStride:pe,numSunLights:M.sun.length,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numSunLightShadows:M.sunShadowMap.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numLightProbeGrids:P.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:g.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:He,decodeVideoTexture:Fe&&g.map.isVideoTexture===!0&&dt.getTransfer(g.map.colorSpace)===Mt,decodeVideoTextureEmissive:ue&&g.emissiveMap.isVideoTexture===!0&&dt.getTransfer(g.emissiveMap.colorSpace)===Mt,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===sn,flipSided:g.side===$t,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:he&&g.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(he&&g.extensions.multiDraw===!0||xe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return Be.vertexUv1s=l.has(1),Be.vertexUv2s=l.has(2),Be.vertexUv3s=l.has(3),l.clear(),Be}function p(g){let M=[];if(g.shaderID?M.push(g.shaderID):(M.push(g.customVertexShaderID),M.push(g.customFragmentShaderID)),g.defines!==void 0)for(let A in g.defines)M.push(A),M.push(g.defines[A]);return g.isRawShaderMaterial===!1&&(u(M,g),y(M,g),M.push(i.outputColorSpace)),M.push(g.customProgramCacheKey),M.join()}function u(g,M){g.push(M.precision),g.push(M.outputColorSpace),g.push(M.envMapMode),g.push(M.envMapCubeUVHeight),g.push(M.mapUv),g.push(M.alphaMapUv),g.push(M.lightMapUv),g.push(M.aoMapUv),g.push(M.bumpMapUv),g.push(M.normalMapUv),g.push(M.displacementMapUv),g.push(M.emissiveMapUv),g.push(M.metalnessMapUv),g.push(M.roughnessMapUv),g.push(M.anisotropyMapUv),g.push(M.clearcoatMapUv),g.push(M.clearcoatNormalMapUv),g.push(M.clearcoatRoughnessMapUv),g.push(M.iridescenceMapUv),g.push(M.iridescenceThicknessMapUv),g.push(M.sheenColorMapUv),g.push(M.sheenRoughnessMapUv),g.push(M.specularMapUv),g.push(M.specularColorMapUv),g.push(M.specularIntensityMapUv),g.push(M.transmissionMapUv),g.push(M.thicknessMapUv),g.push(M.combine),g.push(M.fogExp2),g.push(M.sizeAttenuation),g.push(M.morphTargetsCount),g.push(M.morphAttributeCount),g.push(M.numSunLights),g.push(M.numDirLights),g.push(M.numPointLights),g.push(M.numSpotLights),g.push(M.numSpotLightMaps),g.push(M.numHemiLights),g.push(M.numRectAreaLights),g.push(M.numSunLightShadows),g.push(M.numDirLightShadows),g.push(M.numPointLightShadows),g.push(M.numSpotLightShadows),g.push(M.numSpotLightShadowsWithMaps),g.push(M.numLightProbes),g.push(M.shadowMapType),g.push(M.toneMapping),g.push(M.numClippingPlanes),g.push(M.numClipIntersection),g.push(M.depthPacking)}function y(g,M){a.disableAll(),M.instancing&&a.enable(0),M.instancingColor&&a.enable(1),M.instancingMorph&&a.enable(2),M.matcap&&a.enable(3),M.envMap&&a.enable(4),M.normalMapObjectSpace&&a.enable(5),M.normalMapTangentSpace&&a.enable(6),M.clearcoat&&a.enable(7),M.iridescence&&a.enable(8),M.alphaTest&&a.enable(9),M.vertexColors&&a.enable(10),M.vertexAlphas&&a.enable(11),M.vertexUv1s&&a.enable(12),M.vertexUv2s&&a.enable(13),M.vertexUv3s&&a.enable(14),M.vertexTangents&&a.enable(15),M.anisotropy&&a.enable(16),M.alphaHash&&a.enable(17),M.batching&&a.enable(18),M.dispersion&&a.enable(19),M.retroreflection&&a.enable(24),M.batchingColor&&a.enable(20),M.gradientMap&&a.enable(21),M.packedNormalMap&&a.enable(22),M.vertexNormals&&a.enable(23),g.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),M.numLightProbeGrids>0&&a.enable(22),M.hasPositionAttribute&&a.enable(23),g.push(a.mask)}function v(g){let M=m[g.type],A;if(M){let C=Kn[M];A=zu.clone(C.uniforms)}else A=g.uniforms;return A}function _(g,M){let A=d.get(M);return A!==void 0?++A.usedTimes:(A=new Ox(i,M,g,s),c.push(A),d.set(M,A)),A}function E(g){if(--g.usedTimes===0){let M=c.indexOf(g);c[M]=c[c.length-1],c.pop(),d.delete(g.cacheKey),g.destroy()}}function w(g){o.remove(g)}function T(){o.dispose()}return{getParameters:b,getProgramCacheKey:p,getUniforms:v,acquireProgram:_,releaseProgram:E,releaseShaderCache:w,programs:c,dispose:T}}function Vx(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Gx(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function rd(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function ad(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(h){let m=0;return h.isInstancedMesh&&(m+=2),h.isSkinnedMesh&&(m+=1),m}function o(h,m,x,b,p,u){let y=i[e];return y===void 0?(y={id:h.id,object:h,geometry:m,material:x,materialVariant:a(h),groupOrder:b,renderOrder:h.renderOrder,z:p,group:u},i[e]=y):(y.id=h.id,y.object=h,y.geometry=m,y.material=x,y.materialVariant=a(h),y.groupOrder=b,y.renderOrder=h.renderOrder,y.z=p,y.group=u),e++,y}function l(h,m,x,b,p,u,y){y.reversedDepth===!0&&(p=-p);let v=o(h,m,x,b,p,u);x.transmission>0?n.push(v):x.transparent===!0?s.push(v):t.push(v)}function c(h,m,x,b,p,u){let y=o(h,m,x,b,p,u);x.transmission>0?n.unshift(y):x.transparent===!0?s.unshift(y):t.unshift(y)}function d(h,m){t.length>1&&t.sort(h||Gx),n.length>1&&n.sort(m||rd),s.length>1&&s.sort(m||rd)}function f(){for(let h=e,m=i.length;h<m;h++){let x=i[h];if(x.id===null)break;x.id=null,x.object=null,x.geometry=null,x.material=null,x.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:f,sort:d}}function Hx(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new ad,i.set(n,[a])):s>=r.length?(a=new ad,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Wx(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new O,color:new Ce};break;case"SpotLight":t={position:new O,direction:new O,color:new Ce,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new O,color:new Ce,distance:0,decay:0};break;case"HemisphereLight":t={direction:new O,skyColor:new Ce,groundColor:new Ce};break;case"RectAreaLight":t={color:new Ce,position:new O,halfWidth:new O,halfHeight:new O};break}return i[e.id]=t,t}}}function Xx(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var qx=0;function Yx(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Zx(i){let e=new Wx,t=Xx(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new O);let s=new O,r=new gt,a=new gt;function o(c){let d=0,f=0,h=0;for(let I=0;I<9;I++)n.probe[I].set(0,0,0);let m=0,x=0,b=0,p=0,u=0,y=0,v=0,_=0,E=0,w=0,T=0,g=0,M=0,A=0;c.sort(Yx);for(let I=0,P=c.length;I<P;I++){let L=c[I],F=L.color,N=L.intensity,B=L.distance,Z=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===Di?Z=L.shadow.map.texture:Z=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)d+=F.r*N,f+=F.g*N,h+=F.b*N;else if(L.isLightProbe){for(let Y=0;Y<9;Y++)n.probe[Y].addScaledVector(L.sh.coefficients[Y],N);A++}else if(L.isSunLight){let Y=e.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let Q=L.shadow,q=t.get(L);q.shadowIntensity=Q.intensity,q.shadowBias=Q.bias,q.shadowNormalBias=Q.normalBias,q.shadowRadius=Q.radius,q.shadowMapSize.copy(Q.mapSize).multiply(Q.getFrameExtents()),n.sunShadow[x]=q,n.sunShadowMap[x]=Z;let _e=Q.getViewportCount();for(let pe=0;pe<_e;pe++)n.sunShadowMatrix[b+pe]=Q.getMatrix(pe),n.sunShadowCascade[b+pe]=Q._cascadeData[pe];b+=_e,x++}n.sun[m]=Y,m++}else if(L.isDirectionalLight){let Y=e.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let Q=L.shadow,q=t.get(L);q.shadowIntensity=Q.intensity,q.shadowBias=Q.bias,q.shadowNormalBias=Q.normalBias,q.shadowRadius=Q.radius,q.shadowMapSize=Q.mapSize,n.directionalShadow[p]=q,n.directionalShadowMap[p]=Z,n.directionalShadowMatrix[p]=L.shadow.matrix,E++}n.directional[p]=Y,p++}else if(L.isSpotLight){let Y=e.get(L);Y.position.setFromMatrixPosition(L.matrixWorld),Y.color.copy(F).multiplyScalar(N),Y.distance=B,Y.coneCos=Math.cos(L.angle),Y.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),Y.decay=L.decay,n.spot[y]=Y;let Q=L.shadow;if(L.map&&(n.spotLightMap[g]=L.map,g++,Q.updateMatrices(L),L.castShadow&&M++),n.spotLightMatrix[y]=Q.matrix,L.castShadow){let q=t.get(L);q.shadowIntensity=Q.intensity,q.shadowBias=Q.bias,q.shadowNormalBias=Q.normalBias,q.shadowRadius=Q.radius,q.shadowMapSize=Q.mapSize,n.spotShadow[y]=q,n.spotShadowMap[y]=Z,T++}y++}else if(L.isRectAreaLight){let Y=e.get(L);Y.color.copy(F).multiplyScalar(N),Y.halfWidth.set(L.width*.5,0,0),Y.halfHeight.set(0,L.height*.5,0),n.rectArea[v]=Y,v++}else if(L.isPointLight){let Y=e.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity),Y.distance=L.distance,Y.decay=L.decay,L.castShadow){let Q=L.shadow,q=t.get(L);q.shadowIntensity=Q.intensity,q.shadowBias=Q.bias,q.shadowNormalBias=Q.normalBias,q.shadowRadius=Q.radius,q.shadowMapSize=Q.mapSize,q.shadowCameraNear=Q.camera.near,q.shadowCameraFar=Q.camera.far,n.pointShadow[u]=q,n.pointShadowMap[u]=Z,n.pointShadowMatrix[u]=L.shadow.matrix,w++}n.point[u]=Y,u++}else if(L.isHemisphereLight){let Y=e.get(L);Y.skyColor.copy(L.color).multiplyScalar(N),Y.groundColor.copy(L.groundColor).multiplyScalar(N),n.hemi[_]=Y,_++}}v>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Te.LTC_FLOAT_1,n.rectAreaLTC2=Te.LTC_FLOAT_2):(n.rectAreaLTC1=Te.LTC_HALF_1,n.rectAreaLTC2=Te.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=f,n.ambient[2]=h;let C=n.hash;(C.sunLength!==m||C.directionalLength!==p||C.pointLength!==u||C.spotLength!==y||C.rectAreaLength!==v||C.hemiLength!==_||C.numSunShadows!==x||C.numDirectionalShadows!==E||C.numPointShadows!==w||C.numSpotShadows!==T||C.numSpotMaps!==g||C.numLightProbes!==A)&&(n.sun.length=m,n.directional.length=p,n.spot.length=y,n.rectArea.length=v,n.point.length=u,n.hemi.length=_,n.sunShadow.length=x,n.sunShadowMap.length=x,n.sunShadowMatrix.length=b,n.sunShadowCascade.length=b,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.directionalShadowMatrix.length=E,n.pointShadow.length=w,n.pointShadowMap.length=w,n.pointShadowMatrix.length=w,n.spotShadow.length=T,n.spotShadowMap.length=T,n.spotLightMatrix.length=T+g-M,n.spotLightMap.length=g,n.numSpotLightShadowsWithMaps=M,n.numLightProbes=A,C.sunLength=m,C.directionalLength=p,C.pointLength=u,C.spotLength=y,C.rectAreaLength=v,C.hemiLength=_,C.numSunShadows=x,C.numDirectionalShadows=E,C.numPointShadows=w,C.numSpotShadows=T,C.numSpotMaps=g,C.numLightProbes=A,n.version=qx++)}function l(c,d){let f=0,h=0,m=0,x=0,b=0,p=0,u=d.matrixWorldInverse;for(let y=0,v=c.length;y<v;y++){let _=c[y];if(_.isSunLight){let E=n.sun[f];E.direction.setFromMatrixPosition(_.matrixWorld),E.direction.transformDirection(u),f++}else if(_.isDirectionalLight){let E=n.directional[h];E.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(u),h++}else if(_.isSpotLight){let E=n.spot[x];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(u),E.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(u),x++}else if(_.isRectAreaLight){let E=n.rectArea[b];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(u),a.identity(),r.copy(_.matrixWorld),r.premultiply(u),a.extractRotation(r),E.halfWidth.set(_.width*.5,0,0),E.halfHeight.set(0,_.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),b++}else if(_.isPointLight){let E=n.point[m];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(u),m++}else if(_.isHemisphereLight){let E=n.hemi[p];E.direction.setFromMatrixPosition(_.matrixWorld),E.direction.transformDirection(u),p++}}}return{setup:o,setupView:l,state:n}}function od(i){let e=new Zx(i),t=[],n=[],s=[];function r(h){f.camera=h,t.length=0,n.length=0,s.length=0}function a(h){t.push(h)}function o(h){n.push(h)}function l(h){s.push(h)}function c(){e.setup(t)}function d(h){e.setupView(t,h)}let f={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:d,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Jx(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new od(i),e.set(s,[o])):r>=a.length?(o=new od(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var Kx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,$x=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Qx=[new O(1,0,0),new O(-1,0,0),new O(0,1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1)],jx=[new O(0,-1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1),new O(0,-1,0),new O(0,-1,0)],ld=new gt,Kr=new O,Xc=new O;function e_(i,e,t){let n=new Ns,s=new ye,r=new ye,a=new It,o=new Qa,l=new ja,c={},d=t.maxTextureSize,f={[Ci]:$t,[$t]:Ci,[sn]:sn},h=new Gt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ye},radius:{value:4}},vertexShader:Kx,fragmentShader:$x}),m=h.clone();m.defines.HORIZONTAL_PASS=1;let x=new St;x.setAttribute("position",new Yt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new qe(x,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Br;let u=this.type;this.render=function(w,T,g){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;this.type===fo&&(Ke("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Br);let M=i.getRenderTarget(),A=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),I=i.state;I.setBlending(Zn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);let P=u!==this.type;P&&T.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(F=>F.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,F=w.length;L<F;L++){let N=w[L],B=N.shadow;if(B===void 0){Ke("WebGLShadowMap:",N,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);let Z=B.getFrameExtents();s.multiply(Z),r.copy(B.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/Z.x),s.x=r.x*Z.x,B.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/Z.y),s.y=r.y*Z.y,B.mapSize.y=r.y));let Y=i.state.buffers.depth.getReversed();if(B.camera._reversedDepth=Y,B.map===null||P===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===Vs){if(N.isPointLight){Ke("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new un(s.x,s.y,{format:Di,type:vn,minFilter:kt,magFilter:kt,generateMipmaps:!1}),B.map.texture.name=N.name+".shadowMap",B.map.depthTexture=new Ei(s.x,s.y,An),B.map.depthTexture.name=N.name+".shadowMapDepth",B.map.depthTexture.format=Xn,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Zt,B.map.depthTexture.magFilter=Zt}else N.isPointLight?(B.map=new Js(s.x),B.map.depthTexture=new Wa(s.x,zn)):(B.map=new un(s.x,s.y),B.map.depthTexture=new Ei(s.x,s.y,zn)),B.map.depthTexture.name=N.name+".shadowMap",B.map.depthTexture.format=Xn,this.type===Br?(B.map.depthTexture.compareFunction=Y?nl:tl,B.map.depthTexture.minFilter=kt,B.map.depthTexture.magFilter=kt):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Zt,B.map.depthTexture.magFilter=Zt);B.camera.updateProjectionMatrix()}B.map.isWebGLCubeRenderTarget!==!0&&(B.map.width!==s.x||B.map.height!==s.y)&&B.map.setSize(s.x,s.y);let Q=B.map.isWebGLCubeRenderTarget?6:B.getViewportCount();N.isPointLight!==!0&&B.updateMatrices(N,g);for(let q=0;q<Q;q++){let _e=B.getCamera(q);if(N.isPointLight){let pe=B.camera,Ve=B.matrix,We=N.distance||pe.far;We!==pe.far&&(pe.far=We,pe.updateProjectionMatrix()),Kr.setFromMatrixPosition(N.matrixWorld),pe.position.copy(Kr),Xc.copy(pe.position),Xc.add(Qx[q]),pe.up.copy(jx[q]),pe.lookAt(Xc),pe.updateMatrixWorld(),Ve.makeTranslation(-Kr.x,-Kr.y,-Kr.z),ld.multiplyMatrices(pe.projectionMatrix,pe.matrixWorldInverse),B._frustum.setFromProjectionMatrix(ld,pe.coordinateSystem,pe.reversedDepth)}if(B.map.isWebGLCubeRenderTarget)i.setRenderTarget(B.map,q),i.clear();else{q===0&&(i.setRenderTarget(B.map),i.clear());let pe=B.getViewport(q);a.set(r.x*pe.x,r.y*pe.y,r.x*pe.z,r.y*pe.w),I.viewport(a)}n=B.getFrustum(q),_(T,g,_e,N,this.type)}B.isPointLightShadow!==!0&&this.type===Vs&&y(B,g),B.needsUpdate=!1}u=this.type,p.needsUpdate=!1,i.setRenderTarget(M,A,C)};function y(w,T){let g=e.update(b);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null?w.mapPass=new un(s.x,s.y,{format:Di,type:vn}):(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)&&w.mapPass.setSize(w.map.width,w.map.height),h.uniforms.shadow_pass.value=w.map.depthTexture,h.uniforms.resolution.value.set(w.map.width,w.map.height),h.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(T,null,g,h,b,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value.set(w.map.width,w.map.height),m.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(T,null,g,m,b,null)}function v(w,T,g,M){let A=null,C=g.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(C!==void 0)A=C;else if(A=g.isPointLight===!0?l:o,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){let I=A.uuid,P=T.uuid,L=c[I];L===void 0&&(L={},c[I]=L);let F=L[P];F===void 0&&(F=A.clone(),L[P]=F,T.addEventListener("dispose",E)),A=F}if(A.visible=T.visible,A.wireframe=T.wireframe,M===Vs?A.side=T.shadowSide!==null?T.shadowSide:T.side:A.side=T.shadowSide!==null?T.shadowSide:f[T.side],A.alphaMap=T.alphaMap,A.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,A.map=T.map,A.clipShadows=T.clipShadows,A.clippingPlanes=T.clippingPlanes,A.clipIntersection=T.clipIntersection,A.displacementMap=T.displacementMap,A.displacementScale=T.displacementScale,A.displacementBias=T.displacementBias,A.wireframeLinewidth=T.wireframeLinewidth,A.linewidth=T.linewidth,g.isPointLight===!0&&A.isMeshDistanceMaterial===!0){let I=i.properties.get(A);I.light=g}return A}function _(w,T,g,M,A){if(w.visible===!1)return;if(w.layers.test(T.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&A===Vs)&&(!w.frustumCulled||w.intersectsFrustum(n))){w.modelViewMatrix.multiplyMatrices(g.matrixWorldInverse,w.matrixWorld);let P=e.update(w),L=w.material;if(Array.isArray(L)){let F=P.groups;for(let N=0,B=F.length;N<B;N++){let Z=F[N],Y=L[Z.materialIndex];if(Y&&Y.visible){let Q=v(w,Y,M,A);w.onBeforeShadow(i,w,T,g,P,Q,Z),i.renderBufferDirect(g,null,P,Q,w,Z),w.onAfterShadow(i,w,T,g,P,Q,Z)}}}else if(L.visible){let F=v(w,L,M,A);w.onBeforeShadow(i,w,T,g,P,F,null),i.renderBufferDirect(g,null,P,F,w,null),w.onAfterShadow(i,w,T,g,P,F,null)}}let I=w.children;for(let P=0,L=I.length;P<L;P++)_(I[P],T,g,M,A)}function E(w){w.target.removeEventListener("dispose",E);for(let g in c){let M=c[g],A=w.target.uuid;A in M&&(M[A].dispose(),delete M[A])}}}function t_(i,e){function t(){let G=!1,Se=new It,le=null,we=new It(0,0,0,0);return{setMask:function(Ie){le!==Ie&&!G&&(i.colorMask(Ie,Ie,Ie,Ie),le=Ie)},setLocked:function(Ie){G=Ie},setClear:function(Ie,he,He,Be,Et){Et===!0&&(Ie*=Be,he*=Be,He*=Be),Se.set(Ie,he,He,Be),we.equals(Se)===!1&&(i.clearColor(Ie,he,He,Be),we.copy(Se))},reset:function(){G=!1,le=null,we.set(-1,0,0,0)}}}function n(){let G=!1,Se=!1,le=null,we=null,Ie=null;return{setReversed:function(he){if(Se!==he){let He=e.get("EXT_clip_control");he?He.clipControlEXT(He.LOWER_LEFT_EXT,He.ZERO_TO_ONE_EXT):He.clipControlEXT(He.LOWER_LEFT_EXT,He.NEGATIVE_ONE_TO_ONE_EXT),Se=he;let Be=Ie;Ie=null,this.setClear(Be)}},getReversed:function(){return Se},setTest:function(he){he?ie(i.DEPTH_TEST):ge(i.DEPTH_TEST)},setMask:function(he){le!==he&&!G&&(i.depthMask(he),le=he)},setFunc:function(he){if(Se&&(he=Du[he]),we!==he){switch(he){case Ia:i.depthFunc(i.NEVER);break;case Pa:i.depthFunc(i.ALWAYS);break;case La:i.depthFunc(i.LESS);break;case Ts:i.depthFunc(i.LEQUAL);break;case Da:i.depthFunc(i.EQUAL);break;case Na:i.depthFunc(i.GEQUAL);break;case Ua:i.depthFunc(i.GREATER);break;case Fa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}we=he}},setLocked:function(he){G=he},setClear:function(he){Ie!==he&&(Ie=he,Se&&(he=1-he),i.clearDepth(he))},reset:function(){G=!1,le=null,we=null,Ie=null,Se=!1}}}function s(){let G=!1,Se=null,le=null,we=null,Ie=null,he=null,He=null,Be=null,Et=null;return{setTest:function(vt){G||(vt?ie(i.STENCIL_TEST):ge(i.STENCIL_TEST))},setMask:function(vt){Se!==vt&&!G&&(i.stencilMask(vt),Se=vt)},setFunc:function(vt,In,Vn){(le!==vt||we!==In||Ie!==Vn)&&(i.stencilFunc(vt,In,Vn),le=vt,we=In,Ie=Vn)},setOp:function(vt,In,Vn){(he!==vt||He!==In||Be!==Vn)&&(i.stencilOp(vt,In,Vn),he=vt,He=In,Be=Vn)},setLocked:function(vt){G=vt},setClear:function(vt){Et!==vt&&(i.clearStencil(vt),Et=vt)},reset:function(){G=!1,Se=null,le=null,we=null,Ie=null,he=null,He=null,Be=null,Et=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,d={},f={},h={},m=new WeakMap,x=[],b=null,p=!1,u=null,y=null,v=null,_=null,E=null,w=null,T=null,g=new Ce(0,0,0),M=0,A=!1,C=null,I=null,P=null,L=null,F=null,N=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),B=!1,Z=0,Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(Y)[1]),B=Z>=1):Y.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),B=Z>=2);let Q=null,q={},_e=i.getParameter(i.SCISSOR_BOX),pe=i.getParameter(i.VIEWPORT),Ve=new It().fromArray(_e),We=new It().fromArray(pe);function je(G,Se,le,we){let Ie=new Uint8Array(4),he=i.createTexture();i.bindTexture(G,he),i.texParameteri(G,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(G,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let He=0;He<le;He++)G===i.TEXTURE_3D||G===i.TEXTURE_2D_ARRAY?i.texImage3D(Se,0,i.RGBA,1,1,we,0,i.RGBA,i.UNSIGNED_BYTE,Ie):i.texImage2D(Se+He,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ie);return he}let te={};te[i.TEXTURE_2D]=je(i.TEXTURE_2D,i.TEXTURE_2D,1),te[i.TEXTURE_CUBE_MAP]=je(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),te[i.TEXTURE_2D_ARRAY]=je(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),te[i.TEXTURE_3D]=je(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ie(i.DEPTH_TEST),a.setFunc(Ts),U(!1),k(lc),ie(i.CULL_FACE),ae(Zn);function ie(G){d[G]!==!0&&(i.enable(G),d[G]=!0)}function ge(G){d[G]!==!1&&(i.disable(G),d[G]=!1)}function Ge(G,Se){return h[G]!==Se?(i.bindFramebuffer(G,Se),h[G]=Se,G===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=Se),G===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=Se),!0):!1}function xe(G,Se){let le=x,we=!1;if(G){le=m.get(Se),le===void 0&&(le=[],m.set(Se,le));let Ie=G.textures;if(le.length!==Ie.length||le[0]!==i.COLOR_ATTACHMENT0){for(let he=0,He=Ie.length;he<He;he++)le[he]=i.COLOR_ATTACHMENT0+he;le.length=Ie.length,we=!0}}else le[0]!==i.BACK&&(le[0]=i.BACK,we=!0);we&&i.drawBuffers(le)}function Fe(G){return b!==G?(i.useProgram(G),b=G,!0):!1}let Pe={[Ki]:i.FUNC_ADD,[eu]:i.FUNC_SUBTRACT,[tu]:i.FUNC_REVERSE_SUBTRACT};Pe[nu]=i.MIN,Pe[iu]=i.MAX;let $={[su]:i.ZERO,[ru]:i.ONE,[au]:i.SRC_COLOR,[dc]:i.SRC_ALPHA,[du]:i.SRC_ALPHA_SATURATE,[hu]:i.DST_COLOR,[lu]:i.DST_ALPHA,[ou]:i.ONE_MINUS_SRC_COLOR,[fc]:i.ONE_MINUS_SRC_ALPHA,[uu]:i.ONE_MINUS_DST_COLOR,[cu]:i.ONE_MINUS_DST_ALPHA,[fu]:i.CONSTANT_COLOR,[pu]:i.ONE_MINUS_CONSTANT_COLOR,[mu]:i.CONSTANT_ALPHA,[gu]:i.ONE_MINUS_CONSTANT_ALPHA};function ae(G,Se,le,we,Ie,he,He,Be,Et,vt){if(G===Zn){p===!0&&(ge(i.BLEND),p=!1);return}if(p===!1&&(ie(i.BLEND),p=!0),G!==jh){if(G!==u||vt!==A){if((y!==Ki||E!==Ki)&&(i.blendEquation(i.FUNC_ADD),y=Ki,E=Ki),vt)switch(G){case Ii:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case cc:i.blendFunc(i.ONE,i.ONE);break;case hc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case uc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Je("WebGLState: Invalid blending: ",G);break}else switch(G){case Ii:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case cc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case hc:Je("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case uc:Je("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Je("WebGLState: Invalid blending: ",G);break}v=null,_=null,w=null,T=null,g.set(0,0,0),M=0,u=G,A=vt}return}Ie=Ie||Se,he=he||le,He=He||we,(Se!==y||Ie!==E)&&(i.blendEquationSeparate(Pe[Se],Pe[Ie]),y=Se,E=Ie),(le!==v||we!==_||he!==w||He!==T)&&(i.blendFuncSeparate($[le],$[we],$[he],$[He]),v=le,_=we,w=he,T=He),(Be.equals(g)===!1||Et!==M)&&(i.blendColor(Be.r,Be.g,Be.b,Et),g.copy(Be),M=Et),u=G,A=!1}function W(G,Se){G.side===sn?ge(i.CULL_FACE):ie(i.CULL_FACE);let le=G.side===$t;Se&&(le=!le),U(le),G.blending===Ii&&G.transparent===!1?ae(Zn):ae(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),a.setFunc(G.depthFunc),a.setTest(G.depthTest),a.setMask(G.depthWrite),r.setMask(G.colorWrite);let we=G.stencilWrite;o.setTest(we),we&&(o.setMask(G.stencilWriteMask),o.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),o.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),ue(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?ie(i.SAMPLE_ALPHA_TO_COVERAGE):ge(i.SAMPLE_ALPHA_TO_COVERAGE)}function U(G){C!==G&&(G?i.frontFace(i.CW):i.frontFace(i.CCW),C=G)}function k(G){G!==$h?(ie(i.CULL_FACE),G!==I&&(G===lc?i.cullFace(i.BACK):G===Qh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ge(i.CULL_FACE),I=G}function re(G){G!==P&&(B&&i.lineWidth(G),P=G)}function ue(G,Se,le){G?(ie(i.POLYGON_OFFSET_FILL),(L!==Se||F!==le)&&(L=Se,F=le,a.getReversed()&&(Se=-Se),i.polygonOffset(Se,le))):ge(i.POLYGON_OFFSET_FILL)}function de(G){G?ie(i.SCISSOR_TEST):ge(i.SCISSOR_TEST)}function me(G){G===void 0&&(G=i.TEXTURE0+N-1),Q!==G&&(i.activeTexture(G),Q=G)}function z(G,Se,le){le===void 0&&(Q===null?le=i.TEXTURE0+N-1:le=Q);let we=q[le];we===void 0&&(we={type:void 0,texture:void 0},q[le]=we),(we.type!==G||we.texture!==Se)&&(Q!==le&&(i.activeTexture(le),Q=le),i.bindTexture(G,Se||te[G]),we.type=G,we.texture=Se)}function ht(){let G=q[Q];G!==void 0&&G.type!==void 0&&(i.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function it(){try{i.compressedTexImage2D(...arguments)}catch(G){Je("WebGLState:",G)}}function D(){try{i.compressedTexImage3D(...arguments)}catch(G){Je("WebGLState:",G)}}function S(){try{i.texSubImage2D(...arguments)}catch(G){Je("WebGLState:",G)}}function H(){try{i.texSubImage3D(...arguments)}catch(G){Je("WebGLState:",G)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(G){Je("WebGLState:",G)}}function ee(){try{i.compressedTexSubImage3D(...arguments)}catch(G){Je("WebGLState:",G)}}function fe(){try{i.texStorage2D(...arguments)}catch(G){Je("WebGLState:",G)}}function ve(){try{i.texStorage3D(...arguments)}catch(G){Je("WebGLState:",G)}}function ne(){try{i.texImage2D(...arguments)}catch(G){Je("WebGLState:",G)}}function oe(){try{i.texImage3D(...arguments)}catch(G){Je("WebGLState:",G)}}function Me(G){return f[G]!==void 0?f[G]:i.getParameter(G)}function Oe(G,Se){f[G]!==Se&&(i.pixelStorei(G,Se),f[G]=Se)}function Ee(G){Ve.equals(G)===!1&&(i.scissor(G.x,G.y,G.z,G.w),Ve.copy(G))}function be(G){We.equals(G)===!1&&(i.viewport(G.x,G.y,G.z,G.w),We.copy(G))}function ke(G,Se){let le=c.get(Se);le===void 0&&(le=new WeakMap,c.set(Se,le));let we=le.get(G);we===void 0&&(we=i.getUniformBlockIndex(Se,G.name),le.set(G,we))}function Ye(G,Se){let we=c.get(Se).get(G);l.get(Se)!==we&&(i.uniformBlockBinding(Se,we,G.__bindingPointIndex),l.set(Se,we))}function st(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),d={},f={},Q=null,q={},h={},m=new WeakMap,x=[],b=null,p=!1,u=null,y=null,v=null,_=null,E=null,w=null,T=null,g=new Ce(0,0,0),M=0,A=!1,C=null,I=null,P=null,L=null,F=null,Ve.set(0,0,i.canvas.width,i.canvas.height),We.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ie,disable:ge,bindFramebuffer:Ge,drawBuffers:xe,useProgram:Fe,setBlending:ae,setMaterial:W,setFlipSided:U,setCullFace:k,setLineWidth:re,setPolygonOffset:ue,setScissorTest:de,activeTexture:me,bindTexture:z,unbindTexture:ht,compressedTexImage2D:it,compressedTexImage3D:D,texImage2D:ne,texImage3D:oe,pixelStorei:Oe,getParameter:Me,updateUBOMapping:ke,uniformBlockBinding:Ye,texStorage2D:fe,texStorage3D:ve,texSubImage2D:S,texSubImage3D:H,compressedTexSubImage2D:X,compressedTexSubImage3D:ee,scissor:Ee,viewport:be,reset:st}}function n_(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ye,d=new WeakMap,f=new Set,h,m=new WeakMap,x=!1;try{x=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(D,S){return x?new OffscreenCanvas(D,S):pr("canvas")}function p(D,S,H){let X=1,ee=it(D);if((ee.width>H||ee.height>H)&&(X=H/Math.max(ee.width,ee.height)),X<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){let fe=Math.floor(X*ee.width),ve=Math.floor(X*ee.height);h===void 0&&(h=b(fe,ve));let ne=S?b(fe,ve):h;return ne.width=fe,ne.height=ve,ne.getContext("2d").drawImage(D,0,0,fe,ve),Ke("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+fe+"x"+ve+")."),ne}else return"data"in D&&Ke("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),D;return D}function u(D){return D.generateMipmaps}function y(D){i.generateMipmap(D)}function v(D){return D.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?i.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function _(D,S,H,X,ee,fe=!1){if(D!==null){if(i[D]!==void 0)return i[D];Ke("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let ve;X&&(ve=e.get("EXT_texture_norm16"),ve||Ke("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ne=S;if(S===i.RED&&(H===i.FLOAT&&(ne=i.R32F),H===i.HALF_FLOAT&&(ne=i.R16F),H===i.UNSIGNED_BYTE&&(ne=i.R8),H===i.UNSIGNED_SHORT&&ve&&(ne=ve.R16_EXT),H===i.SHORT&&ve&&(ne=ve.R16_SNORM_EXT)),S===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(ne=i.R8UI),H===i.UNSIGNED_SHORT&&(ne=i.R16UI),H===i.UNSIGNED_INT&&(ne=i.R32UI),H===i.BYTE&&(ne=i.R8I),H===i.SHORT&&(ne=i.R16I),H===i.INT&&(ne=i.R32I)),S===i.RG&&(H===i.FLOAT&&(ne=i.RG32F),H===i.HALF_FLOAT&&(ne=i.RG16F),H===i.UNSIGNED_BYTE&&(ne=i.RG8),H===i.UNSIGNED_SHORT&&ve&&(ne=ve.RG16_EXT),H===i.SHORT&&ve&&(ne=ve.RG16_SNORM_EXT)),S===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(ne=i.RG8UI),H===i.UNSIGNED_SHORT&&(ne=i.RG16UI),H===i.UNSIGNED_INT&&(ne=i.RG32UI),H===i.BYTE&&(ne=i.RG8I),H===i.SHORT&&(ne=i.RG16I),H===i.INT&&(ne=i.RG32I)),S===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(ne=i.RGB8UI),H===i.UNSIGNED_SHORT&&(ne=i.RGB16UI),H===i.UNSIGNED_INT&&(ne=i.RGB32UI),H===i.BYTE&&(ne=i.RGB8I),H===i.SHORT&&(ne=i.RGB16I),H===i.INT&&(ne=i.RGB32I)),S===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(ne=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(ne=i.RGBA16UI),H===i.UNSIGNED_INT&&(ne=i.RGBA32UI),H===i.BYTE&&(ne=i.RGBA8I),H===i.SHORT&&(ne=i.RGBA16I),H===i.INT&&(ne=i.RGBA32I)),S===i.RGB&&(H===i.UNSIGNED_SHORT&&ve&&(ne=ve.RGB16_EXT),H===i.SHORT&&ve&&(ne=ve.RGB16_SNORM_EXT),H===i.UNSIGNED_INT_5_9_9_9_REV&&(ne=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&(ne=i.R11F_G11F_B10F)),S===i.RGBA){let oe=fe?fr:dt.getTransfer(ee);H===i.FLOAT&&(ne=i.RGBA32F),H===i.HALF_FLOAT&&(ne=i.RGBA16F),H===i.UNSIGNED_BYTE&&(ne=oe===Mt?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT&&ve&&(ne=ve.RGBA16_EXT),H===i.SHORT&&ve&&(ne=ve.RGBA16_SNORM_EXT),H===i.UNSIGNED_SHORT_4_4_4_4&&(ne=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(ne=i.RGB5_A1)}return(ne===i.R16F||ne===i.R32F||ne===i.RG16F||ne===i.RG32F||ne===i.RGBA16F||ne===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ne}function E(D,S){let H;return D?S===null||S===zn||S===Hs?H=i.DEPTH24_STENCIL8:S===An?H=i.DEPTH32F_STENCIL8:S===Gs&&(H=i.DEPTH24_STENCIL8,Ke("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===zn||S===Hs?H=i.DEPTH_COMPONENT24:S===An?H=i.DEPTH_COMPONENT32F:S===Gs&&(H=i.DEPTH_COMPONENT16),H}function w(D,S){return u(D)===!0||D.isFramebufferTexture&&D.minFilter!==Zt&&D.minFilter!==kt?Math.log2(Math.max(S.width,S.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?S.mipmaps.length:1}function T(D){let S=D.target;S.removeEventListener("dispose",T),M(S),S.isVideoTexture&&d.delete(S),S.isHTMLTexture&&f.delete(S)}function g(D){let S=D.target;S.removeEventListener("dispose",g),C(S)}function M(D){let S=n.get(D);if(S.__webglInit===void 0)return;let H=D.source,X=m.get(H);if(X){let ee=X[S.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&A(D),Object.keys(X).length===0&&m.delete(H)}n.remove(D)}function A(D){let S=n.get(D);i.deleteTexture(S.__webglTexture);let H=D.source,X=m.get(H);delete X[S.__cacheKey],a.memory.textures--}function C(D){let S=n.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),n.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(S.__webglFramebuffer[X]))for(let ee=0;ee<S.__webglFramebuffer[X].length;ee++)i.deleteFramebuffer(S.__webglFramebuffer[X][ee]);else i.deleteFramebuffer(S.__webglFramebuffer[X]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[X])}else{if(Array.isArray(S.__webglFramebuffer))for(let X=0;X<S.__webglFramebuffer.length;X++)i.deleteFramebuffer(S.__webglFramebuffer[X]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let X=0;X<S.__webglColorRenderbuffer.length;X++)S.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[X]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let H=D.textures;for(let X=0,ee=H.length;X<ee;X++){let fe=n.get(H[X]);fe.__webglTexture&&(i.deleteTexture(fe.__webglTexture),a.memory.textures--),n.remove(H[X])}n.remove(D)}let I=0;function P(){I=0}function L(){return I}function F(D){I=D}function N(){let D=I;return D>=s.maxTextures&&Ke("WebGLTextures: Trying to use "+(D+1)+" texture units while this GPU supports only "+s.maxTextures),I+=1,D}function B(D){let S=[];return S.push(D.wrapS),S.push(D.wrapT),S.push(D.wrapR||0),S.push(D.magFilter),S.push(D.minFilter),S.push(D.anisotropy),S.push(D.internalFormat),S.push(D.format),S.push(D.type),S.push(D.generateMipmaps),S.push(D.premultiplyAlpha),S.push(D.flipY),S.push(D.unpackAlignment),S.push(D.colorSpace),S.join()}function Z(D,S){let H=n.get(D);if(D.isVideoTexture&&z(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&H.__version!==D.version){let X=D.image;if(X===null)Ke("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Ke("WebGLRenderer: Texture marked for update but image is incomplete");else{ge(H,D,S);return}}else D.isExternalTexture&&(H.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+S)}function Y(D,S){let H=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&H.__version!==D.version){ge(H,D,S);return}else D.isExternalTexture&&(H.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+S)}function Q(D,S){let H=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&H.__version!==D.version){ge(H,D,S);return}t.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+S)}function q(D,S){let H=n.get(D);if(D.isCubeDepthTexture!==!0&&D.version>0&&H.__version!==D.version){Ge(H,D,S);return}t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+S)}let _e={[wi]:i.REPEAT,[Wn]:i.CLAMP_TO_EDGE,[Oa]:i.MIRRORED_REPEAT},pe={[Zt]:i.NEAREST,[vu]:i.NEAREST_MIPMAP_NEAREST,[Vr]:i.NEAREST_MIPMAP_LINEAR,[kt]:i.LINEAR,[go]:i.LINEAR_MIPMAP_NEAREST,[Tn]:i.LINEAR_MIPMAP_LINEAR},Ve={[Su]:i.NEVER,[Ru]:i.ALWAYS,[wu]:i.LESS,[tl]:i.LEQUAL,[Eu]:i.EQUAL,[nl]:i.GEQUAL,[Tu]:i.GREATER,[Au]:i.NOTEQUAL};function We(D,S){if(S.type===An&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===kt||S.magFilter===go||S.magFilter===Vr||S.magFilter===Tn||S.minFilter===kt||S.minFilter===go||S.minFilter===Vr||S.minFilter===Tn)&&Ke("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(D,i.TEXTURE_WRAP_S,_e[S.wrapS]),i.texParameteri(D,i.TEXTURE_WRAP_T,_e[S.wrapT]),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,_e[S.wrapR]),i.texParameteri(D,i.TEXTURE_MAG_FILTER,pe[S.magFilter]),i.texParameteri(D,i.TEXTURE_MIN_FILTER,pe[S.minFilter]),S.compareFunction&&(i.texParameteri(D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(D,i.TEXTURE_COMPARE_FUNC,Ve[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Zt||S.minFilter!==Vr&&S.minFilter!==Tn||S.type===An&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){let H=e.get("EXT_texture_filter_anisotropic");i.texParameterf(D,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function je(D,S){let H=!1;D.__webglInit===void 0&&(D.__webglInit=!0,S.addEventListener("dispose",T));let X=S.source,ee=m.get(X);ee===void 0&&(ee={},m.set(X,ee));let fe=B(S);if(fe!==D.__cacheKey){ee[fe]===void 0&&(ee[fe]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,H=!0),ee[fe].usedTimes++;let ve=ee[D.__cacheKey];ve!==void 0&&(ee[D.__cacheKey].usedTimes--,ve.usedTimes===0&&A(S)),D.__cacheKey=fe,D.__webglTexture=ee[fe].texture}return H}function te(D,S,H){return Math.floor(Math.floor(D/H)/S)}function ie(D,S,H,X){let fe=D.updateRanges;if(fe.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,S.width,S.height,H,X,S.data);else{fe.sort((Oe,Ee)=>Oe.start-Ee.start);let ve=0;for(let Oe=1;Oe<fe.length;Oe++){let Ee=fe[ve],be=fe[Oe],ke=Ee.start+Ee.count,Ye=te(be.start,S.width,4),st=te(Ee.start,S.width,4);be.start<=ke+1&&Ye===st&&te(be.start+be.count-1,S.width,4)===Ye?Ee.count=Math.max(Ee.count,be.start+be.count-Ee.start):(++ve,fe[ve]=be)}fe.length=ve+1;let ne=t.getParameter(i.UNPACK_ROW_LENGTH),oe=t.getParameter(i.UNPACK_SKIP_PIXELS),Me=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,S.width);for(let Oe=0,Ee=fe.length;Oe<Ee;Oe++){let be=fe[Oe],ke=Math.floor(be.start/4),Ye=Math.ceil(be.count/4),st=ke%S.width,G=Math.floor(ke/S.width),Se=Ye,le=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,st),t.pixelStorei(i.UNPACK_SKIP_ROWS,G),t.texSubImage2D(i.TEXTURE_2D,0,st,G,Se,le,H,X,S.data)}D.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,ne),t.pixelStorei(i.UNPACK_SKIP_PIXELS,oe),t.pixelStorei(i.UNPACK_SKIP_ROWS,Me)}}function ge(D,S,H){let X=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(X=i.TEXTURE_3D);let ee=je(D,S),fe=S.source;t.bindTexture(X,D.__webglTexture,i.TEXTURE0+H);let ve=n.get(fe);if(fe.version!==ve.__version||ee===!0){if(t.activeTexture(i.TEXTURE0+H),(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)===!1){let le=dt.getPrimaries(dt.workingColorSpace),we=S.colorSpace===ci?null:dt.getPrimaries(S.colorSpace),Ie=S.colorSpace===ci||le===we?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ie)}t.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment);let oe=p(S.image,!1,s.maxTextureSize);oe=ht(S,oe);let Me=r.convert(S.format,S.colorSpace),Oe=r.convert(S.type),Ee=_(S.internalFormat,Me,Oe,S.normalized,S.colorSpace,S.isVideoTexture);We(X,S);let be,ke=S.mipmaps,Ye=S.isVideoTexture!==!0,st=ve.__version===void 0||ee===!0,G=fe.dataReady,Se=w(S,oe);if(S.isDepthTexture)Ee=E(S.format===Li,S.type),st&&(Ye?t.texStorage2D(i.TEXTURE_2D,1,Ee,oe.width,oe.height):t.texImage2D(i.TEXTURE_2D,0,Ee,oe.width,oe.height,0,Me,Oe,null));else if(S.isDataTexture)if(ke.length>0){Ye&&st&&t.texStorage2D(i.TEXTURE_2D,Se,Ee,ke[0].width,ke[0].height);for(let le=0,we=ke.length;le<we;le++)be=ke[le],Ye?G&&t.texSubImage2D(i.TEXTURE_2D,le,0,0,be.width,be.height,Me,Oe,be.data):t.texImage2D(i.TEXTURE_2D,le,Ee,be.width,be.height,0,Me,Oe,be.data);S.generateMipmaps=!1}else Ye?(st&&t.texStorage2D(i.TEXTURE_2D,Se,Ee,oe.width,oe.height),G&&ie(S,oe,Me,Oe)):t.texImage2D(i.TEXTURE_2D,0,Ee,oe.width,oe.height,0,Me,Oe,oe.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Ye&&st&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Se,Ee,ke[0].width,ke[0].height,oe.depth);for(let le=0,we=ke.length;le<we;le++)if(be=ke[le],S.format!==Rn)if(Me!==null)if(Ye){if(G)if(S.layerUpdates.size>0){let Ie=Nc(be.width,be.height,S.format,S.type);for(let he of S.layerUpdates){let He=be.data.subarray(he*Ie/be.data.BYTES_PER_ELEMENT,(he+1)*Ie/be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,le,0,0,he,be.width,be.height,1,Me,He)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,le,0,0,0,be.width,be.height,oe.depth,Me,be.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,le,Ee,be.width,be.height,oe.depth,0,be.data,0,0);else Ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ye?G&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,le,0,0,0,be.width,be.height,oe.depth,Me,Oe,be.data):t.texImage3D(i.TEXTURE_2D_ARRAY,le,Ee,be.width,be.height,oe.depth,0,Me,Oe,be.data);S.layerUpdates.size>0&&S.clearLayerUpdates()}else{Ye&&st&&t.texStorage2D(i.TEXTURE_2D,Se,Ee,ke[0].width,ke[0].height);for(let le=0,we=ke.length;le<we;le++)be=ke[le],S.format!==Rn?Me!==null?Ye?G&&t.compressedTexSubImage2D(i.TEXTURE_2D,le,0,0,be.width,be.height,Me,be.data):t.compressedTexImage2D(i.TEXTURE_2D,le,Ee,be.width,be.height,0,be.data):Ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ye?G&&t.texSubImage2D(i.TEXTURE_2D,le,0,0,be.width,be.height,Me,Oe,be.data):t.texImage2D(i.TEXTURE_2D,le,Ee,be.width,be.height,0,Me,Oe,be.data)}else if(S.isDataArrayTexture)if(Ye){if(st&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Se,Ee,oe.width,oe.height,oe.depth),G)if(S.layerUpdates.size>0){let le=Nc(oe.width,oe.height,S.format,S.type);for(let we of S.layerUpdates){let Ie=oe.data.subarray(we*le/oe.data.BYTES_PER_ELEMENT,(we+1)*le/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,we,oe.width,oe.height,1,Me,Oe,Ie)}S.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,Me,Oe,oe.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ee,oe.width,oe.height,oe.depth,0,Me,Oe,oe.data);else if(S.isData3DTexture)Ye?(st&&t.texStorage3D(i.TEXTURE_3D,Se,Ee,oe.width,oe.height,oe.depth),G&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,Me,Oe,oe.data)):t.texImage3D(i.TEXTURE_3D,0,Ee,oe.width,oe.height,oe.depth,0,Me,Oe,oe.data);else if(S.isFramebufferTexture){if(st)if(Ye)t.texStorage2D(i.TEXTURE_2D,Se,Ee,oe.width,oe.height);else{let le=oe.width,we=oe.height;for(let Ie=0;Ie<Se;Ie++)t.texImage2D(i.TEXTURE_2D,Ie,Ee,le,we,0,Me,Oe,null),le>>=1,we>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in i){let le=i.canvas;if(le.hasAttribute("layoutsubtree")||le.setAttribute("layoutsubtree","true"),oe.parentNode!==le){le.appendChild(oe),f.add(S),le.onpaint=we=>{let Ie=we.changedElements;for(let he of f)Ie.includes(he.image)&&(he.needsUpdate=!0)},le.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,oe);else{let Ie=i.RGBA,he=i.RGBA,He=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Ie,he,He,oe)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(ke.length>0){if(Ye&&st){let le=it(ke[0]);t.texStorage2D(i.TEXTURE_2D,Se,Ee,le.width,le.height)}for(let le=0,we=ke.length;le<we;le++)be=ke[le],Ye?G&&t.texSubImage2D(i.TEXTURE_2D,le,0,0,Me,Oe,be):t.texImage2D(i.TEXTURE_2D,le,Ee,Me,Oe,be);S.generateMipmaps=!1}else if(Ye){if(st){let le=it(oe);t.texStorage2D(i.TEXTURE_2D,Se,Ee,le.width,le.height)}G&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Me,Oe,oe)}else t.texImage2D(i.TEXTURE_2D,0,Ee,Me,Oe,oe);u(S)&&y(X),ve.__version=fe.version,S.onUpdate&&S.onUpdate(S)}D.__version=S.version}function Ge(D,S,H){if(S.image.length!==6)return;let X=je(D,S),ee=S.source;t.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+H);let fe=n.get(ee);if(ee.version!==fe.__version||X===!0){t.activeTexture(i.TEXTURE0+H);let ve=dt.getPrimaries(dt.workingColorSpace),ne=S.colorSpace===ci?null:dt.getPrimaries(S.colorSpace),oe=S.colorSpace===ci||ve===ne?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,oe);let Me=S.isCompressedTexture||S.image[0].isCompressedTexture,Oe=S.image[0]&&S.image[0].isDataTexture,Ee=[];for(let he=0;he<6;he++)!Me&&!Oe?Ee[he]=p(S.image[he],!0,s.maxCubemapSize):Ee[he]=Oe?S.image[he].image:S.image[he],Ee[he]=ht(S,Ee[he]);let be=Ee[0],ke=r.convert(S.format,S.colorSpace),Ye=r.convert(S.type),st=_(S.internalFormat,ke,Ye,S.normalized,S.colorSpace),G=S.isVideoTexture!==!0,Se=fe.__version===void 0||X===!0,le=ee.dataReady,we=w(S,be);We(i.TEXTURE_CUBE_MAP,S);let Ie;if(Me){G&&Se&&t.texStorage2D(i.TEXTURE_CUBE_MAP,we,st,be.width,be.height);for(let he=0;he<6;he++){Ie=Ee[he].mipmaps;for(let He=0;He<Ie.length;He++){let Be=Ie[He];S.format!==Rn?ke!==null?G?le&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,He,0,0,Be.width,Be.height,ke,Be.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,He,st,Be.width,Be.height,0,Be.data):Ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):G?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,He,0,0,Be.width,Be.height,ke,Ye,Be.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,He,st,Be.width,Be.height,0,ke,Ye,Be.data)}}}else{if(Ie=S.mipmaps,G&&Se){Ie.length>0&&we++;let he=it(Ee[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,we,st,he.width,he.height)}for(let he=0;he<6;he++)if(Oe){G?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,0,0,Ee[he].width,Ee[he].height,ke,Ye,Ee[he].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,st,Ee[he].width,Ee[he].height,0,ke,Ye,Ee[he].data);for(let He=0;He<Ie.length;He++){let Et=Ie[He].image[he].image;G?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,He+1,0,0,Et.width,Et.height,ke,Ye,Et.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,He+1,st,Et.width,Et.height,0,ke,Ye,Et.data)}}else{G?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,0,0,ke,Ye,Ee[he]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,st,ke,Ye,Ee[he]);for(let He=0;He<Ie.length;He++){let Be=Ie[He];G?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,He+1,0,0,ke,Ye,Be.image[he]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,He+1,st,ke,Ye,Be.image[he])}}}u(S)&&y(i.TEXTURE_CUBE_MAP),fe.__version=ee.version,S.onUpdate&&S.onUpdate(S)}D.__version=S.version}function xe(D,S,H,X,ee,fe){let ve=r.convert(H.format,H.colorSpace),ne=r.convert(H.type),oe=_(H.internalFormat,ve,ne,H.normalized,H.colorSpace),Me=n.get(S),Oe=n.get(H);if(Oe.__renderTarget=S,!Me.__hasExternalTextures){let Ee=Math.max(1,S.width>>fe),be=Math.max(1,S.height>>fe);ee===i.TEXTURE_3D||ee===i.TEXTURE_2D_ARRAY?t.texImage3D(ee,fe,oe,Ee,be,S.depth,0,ve,ne,null):t.texImage2D(ee,fe,oe,Ee,be,0,ve,ne,null)}t.bindFramebuffer(i.FRAMEBUFFER,D),me(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,ee,Oe.__webglTexture,0,de(S)):(ee===i.TEXTURE_2D||ee>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,ee,Oe.__webglTexture,fe),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Fe(D,S,H){if(i.bindRenderbuffer(i.RENDERBUFFER,D),S.depthBuffer){let X=S.depthTexture,ee=X&&X.isDepthTexture?X.type:null,fe=E(S.stencilBuffer,ee),ve=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;me(S)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,de(S),fe,S.width,S.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,de(S),fe,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,fe,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ve,i.RENDERBUFFER,D)}else{let X=S.textures;for(let ee=0;ee<X.length;ee++){let fe=X[ee],ve=r.convert(fe.format,fe.colorSpace),ne=r.convert(fe.type),oe=_(fe.internalFormat,ve,ne,fe.normalized,fe.colorSpace);me(S)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,de(S),oe,S.width,S.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,de(S),oe,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,oe,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Pe(D,S,H){let X=S.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,D),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let ee=n.get(S.depthTexture);if(ee.__renderTarget=S,(!ee.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),X){if(ee.__webglInit===void 0&&(ee.__webglInit=!0,S.depthTexture.addEventListener("dispose",T)),ee.__webglTexture===void 0){ee.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,ee.__webglTexture),We(i.TEXTURE_CUBE_MAP,S.depthTexture);let Me=r.convert(S.depthTexture.format),Oe=r.convert(S.depthTexture.type),Ee;S.depthTexture.format===Xn?Ee=i.DEPTH_COMPONENT24:S.depthTexture.format===Li&&(Ee=i.DEPTH24_STENCIL8);for(let be=0;be<6;be++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,Ee,S.width,S.height,0,Me,Oe,null)}}else Z(S.depthTexture,0);let fe=ee.__webglTexture,ve=de(S),ne=X?i.TEXTURE_CUBE_MAP_POSITIVE_X+H:i.TEXTURE_2D,oe=S.depthTexture.format===Li?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(S.depthTexture.format===Xn)me(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,oe,ne,fe,0,ve):i.framebufferTexture2D(i.FRAMEBUFFER,oe,ne,fe,0);else if(S.depthTexture.format===Li)me(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,oe,ne,fe,0,ve):i.framebufferTexture2D(i.FRAMEBUFFER,oe,ne,fe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function $(D){let S=n.get(D),H=D.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==D.depthTexture){let X=D.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),X){let ee=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,X.removeEventListener("dispose",ee)};X.addEventListener("dispose",ee),S.__depthDisposeCallback=ee}S.__boundDepthTexture=X}if(D.depthTexture&&!S.__autoAllocateDepthBuffer)if(H)for(let X=0;X<6;X++)Pe(S.__webglFramebuffer[X],D,X);else{let X=D.texture.mipmaps;X&&X.length>0?Pe(S.__webglFramebuffer[0],D,0):Pe(S.__webglFramebuffer,D,0)}else if(H){S.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[X]),S.__webglDepthbuffer[X]===void 0)S.__webglDepthbuffer[X]=i.createRenderbuffer(),Fe(S.__webglDepthbuffer[X],D,!1);else{let ee=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=S.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,fe),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,fe)}}else{let X=D.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),Fe(S.__webglDepthbuffer,D,!1);else{let ee=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,fe),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,fe)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function ae(D,S,H){let X=n.get(D);S!==void 0&&xe(X.__webglFramebuffer,D,D.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&$(D)}function W(D){let S=D.texture,H=n.get(D),X=n.get(S);D.addEventListener("dispose",g);let ee=D.textures,fe=D.isWebGLCubeRenderTarget===!0,ve=ee.length>1;if(ve||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=S.version,a.memory.textures++),fe){H.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(S.mipmaps&&S.mipmaps.length>0){H.__webglFramebuffer[ne]=[];for(let oe=0;oe<S.mipmaps.length;oe++)H.__webglFramebuffer[ne][oe]=i.createFramebuffer()}else H.__webglFramebuffer[ne]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){H.__webglFramebuffer=[];for(let ne=0;ne<S.mipmaps.length;ne++)H.__webglFramebuffer[ne]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(ve)for(let ne=0,oe=ee.length;ne<oe;ne++){let Me=n.get(ee[ne]);Me.__webglTexture===void 0&&(Me.__webglTexture=i.createTexture(),a.memory.textures++)}if(D.samples>0&&me(D)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ne=0;ne<ee.length;ne++){let oe=ee[ne];H.__webglColorRenderbuffer[ne]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[ne]);let Me=r.convert(oe.format,oe.colorSpace),Oe=r.convert(oe.type),Ee=_(oe.internalFormat,Me,Oe,oe.normalized,oe.colorSpace,D.isXRRenderTarget===!0),be=de(D);i.renderbufferStorageMultisample(i.RENDERBUFFER,be,Ee,D.width,D.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ne,i.RENDERBUFFER,H.__webglColorRenderbuffer[ne])}i.bindRenderbuffer(i.RENDERBUFFER,null),D.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),Fe(H.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(fe){t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),We(i.TEXTURE_CUBE_MAP,S);for(let ne=0;ne<6;ne++)if(S.mipmaps&&S.mipmaps.length>0)for(let oe=0;oe<S.mipmaps.length;oe++)xe(H.__webglFramebuffer[ne][oe],D,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,oe);else xe(H.__webglFramebuffer[ne],D,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);u(S)&&y(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ve){for(let ne=0,oe=ee.length;ne<oe;ne++){let Me=ee[ne],Oe=n.get(Me),Ee=i.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Ee=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Ee,Oe.__webglTexture),We(Ee,Me),xe(H.__webglFramebuffer,D,Me,i.COLOR_ATTACHMENT0+ne,Ee,0),u(Me)&&y(Ee)}t.unbindTexture()}else{let ne=i.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(ne=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ne,X.__webglTexture),We(ne,S),S.mipmaps&&S.mipmaps.length>0)for(let oe=0;oe<S.mipmaps.length;oe++)xe(H.__webglFramebuffer[oe],D,S,i.COLOR_ATTACHMENT0,ne,oe);else xe(H.__webglFramebuffer,D,S,i.COLOR_ATTACHMENT0,ne,0);u(S)&&y(ne),t.unbindTexture()}D.depthBuffer&&$(D)}function U(D){let S=D.textures;for(let H=0,X=S.length;H<X;H++){let ee=S[H];if(u(ee)){let fe=v(D),ve=n.get(ee).__webglTexture;t.bindTexture(fe,ve),y(fe),t.unbindTexture()}}}let k=[],re=[];function ue(D){if(D.samples>0){if(me(D)===!1){let S=D.textures,H=D.width,X=D.height,ee=i.COLOR_BUFFER_BIT,fe=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ve=n.get(D),ne=S.length>1;if(ne)for(let Me=0;Me<S.length;Me++)t.bindFramebuffer(i.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ve.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ve.__webglMultisampledFramebuffer);let oe=D.texture.mipmaps;oe&&oe.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ve.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ve.__webglFramebuffer);for(let Me=0;Me<S.length;Me++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ee|=i.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ee|=i.STENCIL_BUFFER_BIT)),ne){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ve.__webglColorRenderbuffer[Me]);let Oe=n.get(S[Me]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Oe,0)}i.blitFramebuffer(0,0,H,X,0,0,H,X,ee,i.NEAREST),l===!0&&(k.length=0,re.length=0,k.push(i.COLOR_ATTACHMENT0+Me),D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&(k.push(fe),re.push(fe),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,re)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,k))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ne)for(let Me=0;Me<S.length;Me++){t.bindFramebuffer(i.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.RENDERBUFFER,ve.__webglColorRenderbuffer[Me]);let Oe=n.get(S[Me]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ve.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.TEXTURE_2D,Oe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ve.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&l){let S=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function de(D){return Math.min(s.maxSamples,D.samples)}function me(D){let S=n.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function z(D){let S=a.render.frame;d.get(D)!==S&&(d.set(D,S),D.update())}function ht(D,S){let H=D.colorSpace,X=D.format,ee=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||H!==dr&&H!==ci&&(dt.getTransfer(H)===Mt?(X!==Rn||ee!==dn)&&Ke("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Je("WebGLTextures: Unsupported texture color space:",H)),S}function it(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=N,this.resetTextureUnits=P,this.getTextureUnits=L,this.setTextureUnits=F,this.setTexture2D=Z,this.setTexture2DArray=Y,this.setTexture3D=Q,this.setTextureCube=q,this.rebindTextures=ae,this.setupRenderTarget=W,this.updateRenderTargetMipmap=U,this.updateMultisampleRenderTarget=ue,this.setupDepthRenderbuffer=$,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=me,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function i_(i,e){function t(n,s=ci){let r,a=dt.getTransfer(s);if(n===dn)return i.UNSIGNED_BYTE;if(n===_o)return i.UNSIGNED_SHORT_4_4_4_4;if(n===vo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===wc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ec)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===bc)return i.BYTE;if(n===Sc)return i.SHORT;if(n===Gs)return i.UNSIGNED_SHORT;if(n===xo)return i.INT;if(n===zn)return i.UNSIGNED_INT;if(n===An)return i.FLOAT;if(n===vn)return i.HALF_FLOAT;if(n===Tc)return i.ALPHA;if(n===Ac)return i.RGB;if(n===Rn)return i.RGBA;if(n===Xn)return i.DEPTH_COMPONENT;if(n===Li)return i.DEPTH_STENCIL;if(n===yo)return i.RED;if(n===Mo)return i.RED_INTEGER;if(n===Di)return i.RG;if(n===bo)return i.RG_INTEGER;if(n===So)return i.RGBA_INTEGER;if(n===Gr||n===Hr||n===Wr||n===Xr)if(a===Mt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Gr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Wr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Gr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Wr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Xr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===wo||n===Eo||n===To||n===Ao)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===wo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Eo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===To)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ao)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ro||n===Co||n===Io||n===Po||n===Lo||n===qr||n===Do)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ro||n===Co)return a===Mt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Io)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Po)return r.COMPRESSED_R11_EAC;if(n===Lo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===qr)return r.COMPRESSED_RG11_EAC;if(n===Do)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===No||n===Uo||n===Fo||n===Oo||n===Bo||n===zo||n===ko||n===Vo||n===Go||n===Ho||n===Wo||n===Xo||n===qo||n===Yo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===No)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Uo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Fo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Oo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Bo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===zo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ko)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Vo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Go)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ho)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Wo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Xo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===qo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Yo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Zo||n===Jo||n===Ko)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Zo)return a===Mt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Jo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ko)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===$o||n===Qo||n===Yr||n===jo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===$o)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Qo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Yr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===jo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Hs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var s_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,r_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,jc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Sr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Gt({vertexShader:s_,fragmentShader:r_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new qe(new On(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},eh=class extends qn{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,d=null,f=null,h=null,m=null,x=null,b=typeof XRWebGLBinding<"u",p=new jc,u={},y=t.getContextAttributes(),v=null,_=null,E=[],w=[],T=new ye,g=null,M=null,A=new Kt;A.viewport=new It;let C=new Kt;C.viewport=new It;let I=[A,C],P=new ho,L=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(te){let ie=E[te];return ie===void 0&&(ie=new Ps,E[te]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(te){let ie=E[te];return ie===void 0&&(ie=new Ps,E[te]=ie),ie.getGripSpace()},this.getHand=function(te){let ie=E[te];return ie===void 0&&(ie=new Ps,E[te]=ie),ie.getHandSpace()};function N(te){let ie=w.indexOf(te.inputSource);if(ie===-1)return;let ge=E[ie];ge!==void 0&&(ge.update(te.inputSource,te.frame,c||a),ge.dispatchEvent({type:te.type,data:te.inputSource}))}function B(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",Z);for(let te=0;te<E.length;te++){let ie=w[te];ie!==null&&(w[te]=null,E[te].disconnect(ie))}L=null,F=null,p.reset();for(let te in u)delete u[te];if(e.setRenderTarget(v),m=null,h=null,f=null,s=null,_=null,je.stop(),n.isPresenting=!1,e.setPixelRatio(g),e.setSize(T.width,T.height,!1),M!==null){let te=M.camera;te.fov=M.fov,te.zoom=M.zoom,te.updateProjectionMatrix(),M=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(te){r=te,n.isPresenting===!0&&Ke("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(te){o=te,n.isPresenting===!0&&Ke("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(te){c=te},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return f===null&&b&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(te){if(s=te,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",B),s.addEventListener("inputsourceschange",Z),y.xrCompatible!==!0&&await t.makeXRCompatible(),g=e.getPixelRatio(),e.getSize(T),b&&"createProjectionLayer"in XRWebGLBinding.prototype){let ge=null,Ge=null,xe=null;y.depth&&(xe=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ge=y.stencil?Li:Xn,Ge=y.stencil?Hs:zn);let Fe={colorFormat:t.RGBA8,depthFormat:xe,scaleFactor:r};f=this.getBinding(),h=f.createProjectionLayer(Fe),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),_=new un(h.textureWidth,h.textureHeight,{format:Rn,type:dn,depthTexture:new Ei(h.textureWidth,h.textureHeight,Ge,void 0,void 0,void 0,void 0,void 0,void 0,ge),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let ge={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,ge),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),_=new un(m.framebufferWidth,m.framebufferHeight,{format:Rn,type:dn,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1,storeMultisampledDepthBuffer:m.ignoreDepthValues===!1,storeMultisampledStencilBuffer:m.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),je.setContext(s),je.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function Z(te){for(let ie=0;ie<te.removed.length;ie++){let ge=te.removed[ie],Ge=w.indexOf(ge);Ge>=0&&(w[Ge]=null,E[Ge].disconnect(ge))}for(let ie=0;ie<te.added.length;ie++){let ge=te.added[ie],Ge=w.indexOf(ge);if(Ge===-1){for(let Fe=0;Fe<E.length;Fe++)if(Fe>=w.length){w.push(ge),Ge=Fe;break}else if(w[Fe]===null){w[Fe]=ge,Ge=Fe;break}if(Ge===-1)break}let xe=E[Ge];xe&&xe.connect(ge)}}let Y=new O,Q=new O;function q(te,ie,ge){Y.setFromMatrixPosition(ie.matrixWorld),Q.setFromMatrixPosition(ge.matrixWorld);let Ge=Y.distanceTo(Q),xe=ie.projectionMatrix.elements,Fe=ge.projectionMatrix.elements,Pe=xe[14]/(xe[10]-1),$=xe[14]/(xe[10]+1),ae=(xe[9]+1)/xe[5],W=(xe[9]-1)/xe[5],U=(xe[8]-1)/xe[0],k=(Fe[8]+1)/Fe[0],re=Pe*U,ue=Pe*k,de=Ge/(-U+k),me=de*-U;if(ie.matrixWorld.decompose(te.position,te.quaternion,te.scale),te.translateX(me),te.translateZ(de),te.matrixWorld.compose(te.position,te.quaternion,te.scale),te.matrixWorldInverse.copy(te.matrixWorld).invert(),xe[10]===-1)te.projectionMatrix.copy(ie.projectionMatrix),te.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{let z=Pe+de,ht=$+de,it=re-me,D=ue+(Ge-me),S=ae*$/ht*z,H=W*$/ht*z;te.projectionMatrix.makePerspective(it,D,S,H,z,ht),te.projectionMatrixInverse.copy(te.projectionMatrix).invert()}}function _e(te,ie){ie===null?te.matrixWorld.copy(te.matrix):te.matrixWorld.multiplyMatrices(ie.matrixWorld,te.matrix),te.matrixWorldInverse.copy(te.matrixWorld).invert()}this.updateCamera=function(te){if(s===null)return;let ie=te.near,ge=te.far;p.texture!==null&&(p.depthNear>0&&(ie=p.depthNear),p.depthFar>0&&(ge=p.depthFar)),P.near=C.near=A.near=ie,P.far=C.far=A.far=ge,(L!==P.near||F!==P.far)&&(s.updateRenderState({depthNear:P.near,depthFar:P.far}),L=P.near,F=P.far),P.layers.mask=te.layers.mask|6,A.layers.mask=P.layers.mask&-5,C.layers.mask=P.layers.mask&-3;let Ge=te.parent,xe=P.cameras;_e(P,Ge);for(let Fe=0;Fe<xe.length;Fe++)_e(xe[Fe],Ge);xe.length===2?q(P,A,C):P.projectionMatrix.copy(A.projectionMatrix),M===null&&te.isPerspectiveCamera&&(M={camera:te,fov:te.fov,zoom:te.zoom}),pe(te,P,Ge)};function pe(te,ie,ge){ge===null?te.matrix.copy(ie.matrixWorld):(te.matrix.copy(ge.matrixWorld),te.matrix.invert(),te.matrix.multiply(ie.matrixWorld)),te.matrix.decompose(te.position,te.quaternion,te.scale),te.updateMatrixWorld(!0),te.projectionMatrix.copy(ie.projectionMatrix),te.projectionMatrixInverse.copy(ie.projectionMatrixInverse),te.isPerspectiveCamera&&(te.fov=za*2*Math.atan(1/te.projectionMatrix.elements[5]),te.zoom=1)}this.getCamera=function(){return P},this.getFoveation=function(){if(!(h===null&&m===null))return l},this.setFoveation=function(te){l=te,h!==null&&(h.fixedFoveation=te),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=te)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(P)},this.getCameraTexture=function(te){return u[te]};let Ve=null;function We(te,ie){if(d=ie.getViewerPose(c||a),x=ie,d!==null){let ge=d.views;m!==null&&(e.setRenderTargetFramebuffer(_,m.framebuffer),e.setRenderTarget(_));let Ge=!1;ge.length!==P.cameras.length&&(P.cameras.length=0,Ge=!0);for(let $=0;$<ge.length;$++){let ae=ge[$],W=null;if(m!==null)W=m.getViewport(ae);else{let k=f.getViewSubImage(h,ae);W=k.viewport,$===0&&(e.setRenderTargetTextures(_,k.colorTexture,k.depthStencilTexture),e.setRenderTarget(_))}let U=I[$];U===void 0&&(U=new Kt,U.layers.enable($),U.viewport=new It,I[$]=U),U.matrix.fromArray(ae.transform.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale),U.projectionMatrix.fromArray(ae.projectionMatrix),U.projectionMatrixInverse.copy(U.projectionMatrix).invert(),U.viewport.set(W.x,W.y,W.width,W.height),$===0&&(P.matrix.copy(U.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale)),Ge===!0&&P.cameras.push(U)}let xe=s.enabledFeatures;if(xe&&xe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&b){f=n.getBinding();let $=f.getDepthInformation(ge[0]);$&&$.isValid&&$.texture&&p.init($,s.renderState)}if(xe&&xe.includes("camera-access")&&b){e.state.unbindTexture(),f=n.getBinding();for(let $=0;$<ge.length;$++){let ae=ge[$].camera;if(ae){let W=u[ae];W||(W=new Sr,u[ae]=W);let U=f.getCameraImage(ae);W.sourceTexture=U}}}}for(let ge=0;ge<E.length;ge++){let Ge=w[ge],xe=E[ge];Ge!==null&&xe!==void 0&&xe.update(Ge,ie,c||a)}Ve&&Ve(te,ie),ie.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ie}),x=null}let je=new cd;je.setAnimationLoop(We),this.setAnimationLoop=function(te){Ve=te},this.dispose=function(){}}},a_=new gt,md=new et;md.set(-1,0,0,0,1,0,0,0,1);function o_(i,e){function t(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,Pc(i)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function s(p,u,y,v,_){u.isNodeMaterial?u.uniformsNeedUpdate=!1:u.isMeshBasicMaterial?r(p,u):u.isMeshLambertMaterial?(r(p,u),u.envMap&&(p.envMapIntensity.value=u.envMapIntensity)):u.isMeshToonMaterial?(r(p,u),f(p,u)):u.isMeshPhongMaterial?(r(p,u),d(p,u),u.envMap&&(p.envMapIntensity.value=u.envMapIntensity)):u.isMeshStandardMaterial?(r(p,u),h(p,u),u.isMeshPhysicalMaterial&&m(p,u,_)):u.isMeshMatcapMaterial?(r(p,u),x(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),b(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(a(p,u),u.isLineDashedMaterial&&o(p,u)):u.isPointsMaterial?l(p,u,y,v):u.isSpriteMaterial?c(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,t(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,t(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===$t&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,t(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===$t&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,t(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,t(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);let y=e.get(u),v=y.envMap,_=y.envMapRotation;v&&(p.envMap.value=v,p.envMapRotation.value.setFromMatrix4(a_.makeRotationFromEuler(_)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(md),p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap&&(p.lightMap.value=u.lightMap,p.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,p.lightMapTransform)),u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,p.aoMapTransform))}function a(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,t(u.map,p.mapTransform))}function o(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function l(p,u,y,v){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*y,p.scale.value=v*.5,u.map&&(p.map.value=u.map,t(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function c(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,t(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function d(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function f(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function h(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,p.roughnessMapTransform)),u.envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function m(p,u,y){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===$t&&p.clearcoatNormalScale.value.negate())),u.dispersion>0&&(p.dispersion.value=u.dispersion),u.retroreflectivity>0&&(p.retroreflectivity.value=u.retroreflectivity),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,p.specularIntensityMapTransform))}function x(p,u){u.matcap&&(p.matcap.value=u.matcap)}function b(p,u){let y=e.get(u).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function l_(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,E){let w=E.program;n.uniformBlockBinding(_,w)}function c(_,E){let w=s[_.id];w===void 0&&(p(_),w=d(_),s[_.id]=w,_.addEventListener("dispose",y));let T=E.program;n.updateUBOMapping(_,T);let g=e.render.frame;r[_.id]!==g&&(h(_),r[_.id]=g)}function d(_){let E=f();_.__bindingPointIndex=E;let w=i.createBuffer(),T=_.__size,g=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,T,g),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,w),w}function f(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return Je("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(_){let E=s[_.id],w=_.uniforms,T=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let g=0,M=w.length;g<M;g++){let A=w[g];if(Array.isArray(A))for(let C=0,I=A.length;C<I;C++)m(A[C],g,C,T);else m(A,g,0,T)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(_,E,w,T){if(b(_,E,w,T)===!0){let g=_.__offset,M=_.value;if(Array.isArray(M)){let A=0;for(let C=0;C<M.length;C++){let I=M[C],P=u(I);x(I,_.__data,A),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(A+=P.storage/Float32Array.BYTES_PER_ELEMENT)}}else x(M,_.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,g,_.__data)}}function x(_,E,w){typeof _=="number"||typeof _=="boolean"?E[0]=_:_.isMatrix3?(E[0]=_.elements[0],E[1]=_.elements[1],E[2]=_.elements[2],E[3]=0,E[4]=_.elements[3],E[5]=_.elements[4],E[6]=_.elements[5],E[7]=0,E[8]=_.elements[6],E[9]=_.elements[7],E[10]=_.elements[8],E[11]=0):ArrayBuffer.isView(_)?E.set(new _.constructor(_.buffer,_.byteOffset,E.length)):_.toArray(E,w)}function b(_,E,w,T){let g=_.value,M=E+"_"+w;if(T[M]===void 0)return typeof g=="number"||typeof g=="boolean"?T[M]=g:ArrayBuffer.isView(g)?T[M]=g.slice():T[M]=g.clone(),!0;{let A=T[M];if(typeof g=="number"||typeof g=="boolean"){if(A!==g)return T[M]=g,!0}else{if(ArrayBuffer.isView(g))return!0;if(A.equals(g)===!1)return A.copy(g),!0}}return!1}function p(_){let E=_.uniforms,w=0,T=16;for(let M=0,A=E.length;M<A;M++){let C=Array.isArray(E[M])?E[M]:[E[M]];for(let I=0,P=C.length;I<P;I++){let L=C[I],F=Array.isArray(L.value)?L.value:[L.value];for(let N=0,B=F.length;N<B;N++){let Z=F[N],Y=u(Z),Q=w%T,q=Q%Y.boundary,_e=Q+q;w+=q,_e!==0&&T-_e<Y.storage&&(w+=T-_e),L.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=w,w+=Y.storage}}}let g=w%T;return g>0&&(w+=T-g),_.__size=w,_.__cache={},this}function u(_){let E={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(E.boundary=4,E.storage=4):_.isVector2?(E.boundary=8,E.storage=8):_.isVector3||_.isColor?(E.boundary=16,E.storage=12):_.isVector4?(E.boundary=16,E.storage=16):_.isMatrix3?(E.boundary=48,E.storage=48):_.isMatrix4?(E.boundary=64,E.storage=64):_.isTexture?Ke("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(_)?(E.boundary=16,E.storage=_.byteLength):Ke("WebGLRenderer: Unsupported uniform value type.",_),E}function y(_){let E=_.target;E.removeEventListener("dispose",y);let w=a.indexOf(E.__bindingPointIndex);a.splice(w,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function v(){for(let _ in s)i.deleteBuffer(s[_]);a=[],s={},r={}}return{bind:l,update:c,dispose:v}}var c_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Jn=null;function h_(){return Jn===null&&(Jn=new vr(c_,16,16,Di,vn),Jn.name="DFG_LUT",Jn.minFilter=kt,Jn.magFilter=kt,Jn.wrapS=Wn,Jn.wrapT=Wn,Jn.generateMipmaps=!1,Jn.needsUpdate=!0),Jn}var rl=class{constructor(e={}){let{canvas:t=Iu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:m=dn}=e;this.isWebGLRenderer=!0;let x;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");x=n.getContextAttributes().alpha}else x=a;let b=m,p=new Set([So,bo,Mo]),u=new Set([dn,zn,Gs,Hs,_o,vo]),y=new Uint32Array(4),v=new Int32Array(4),_=new O,E=null,w=null,T=[],g=[],M=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Bn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let A=this,C=!1,I=null,P=null,L=null,F=null;this._outputColorSpace=Jt;let N=0,B=0,Z=null,Y=-1,Q=null,q=new It,_e=new It,pe=null,Ve=new Ce(0),We=0,je=t.width,te=t.height,ie=1,ge=null,Ge=null,xe=new It(0,0,je,te),Fe=new It(0,0,je,te),Pe=!1,$=new Ns,ae=!1,W=!1,U=new gt,k=new O,re=new It,ue={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},de=!1;function me(){return Z===null?ie:1}let z=n;function ht(R,V){return t.getContext(R,V)}let it,D,S,H,X,ee,fe,ve,ne,oe,Me,Oe,Ee,be,ke,Ye,st,G,Se,le,we,Ie,he;try{let R={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",Et,!1),t.addEventListener("webglcontextrestored",vt,!1),t.addEventListener("webglcontextcreationerror",In,!1),z===null){let V="webgl2";if(z=ht(V,R),z===null)throw ht(V)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}He()}catch(R){throw t.removeEventListener("webglcontextlost",Et,!1),t.removeEventListener("webglcontextrestored",vt,!1),t.removeEventListener("webglcontextcreationerror",In,!1),Je("WebGLRenderer: "+R.message),R}function He(){it=new xg(z),it.init(),we=new i_(z,it),D=new og(z,it,e,we),S=new t_(z,it),D.reversedDepthBuffer&&h&&S.buffers.depth.setReversed(!0),P=z.createFramebuffer(),L=z.createFramebuffer(),F=z.createFramebuffer(),H=new yg(z),X=new Vx,ee=new n_(z,it,S,X,D,we,H),fe=new gg(A),ve=new bp(z),Ie=new rg(z,ve),ne=new _g(z,ve,H,Ie),oe=new bg(z,ne,ve,Ie,H),G=new Mg(z,D,ee),ke=new lg(X),Me=new kx(A,fe,it,D,Ie,ke),Oe=new o_(A,X),Ee=new Hx,be=new Jx(it),st=new sg(A,fe,S,oe,x,l),Ye=new e_(A,oe,D),he=new l_(z,H,D,S),Se=new ag(z,it,H),le=new vg(z,it,H),H.programs=Me.programs,A.capabilities=D,A.extensions=it,A.properties=X,A.renderLists=Ee,A.shadowMap=Ye,A.state=S,A.info=H}b!==dn&&(M=new wg(b,t.width,t.height,o,s,r));let Be=new eh(A,z);this.xr=Be,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){let R=it.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){let R=it.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(R){R!==void 0&&(ie=R,this.setSize(je,te,!1))},this.getSize=function(R){return R.set(je,te)},this.setSize=function(R,V,j=!0){if(Be.isPresenting){Ke("WebGLRenderer: Can't change size while VR device is presenting.");return}je=R,te=V,t.width=Math.floor(R*ie),t.height=Math.floor(V*ie),j===!0&&(t.style.width=R+"px",t.style.height=V+"px"),M!==null&&M.setSize(t.width,t.height),this.setViewport(0,0,R,V)},this.getDrawingBufferSize=function(R){return R.set(je*ie,te*ie).floor()},this.setDrawingBufferSize=function(R,V,j){je=R,te=V,ie=j,t.width=Math.floor(R*j),t.height=Math.floor(V*j),this.setViewport(0,0,R,V)},this.setEffects=function(R){if(b===dn){Je("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(R){for(let V=0;V<R.length;V++)if(R[V].isOutputPass===!0){Ke("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}M.setEffects(R||[])},this.getCurrentViewport=function(R){return R.copy(q)},this.getViewport=function(R){return R.copy(xe)},this.setViewport=function(R,V,j,J){R.isVector4?xe.set(R.x,R.y,R.z,R.w):xe.set(R,V,j,J),S.viewport(q.copy(xe).multiplyScalar(ie).round())},this.getScissor=function(R){return R.copy(Fe)},this.setScissor=function(R,V,j,J){R.isVector4?Fe.set(R.x,R.y,R.z,R.w):Fe.set(R,V,j,J),S.scissor(_e.copy(Fe).multiplyScalar(ie).round())},this.getScissorTest=function(){return Pe},this.setScissorTest=function(R){S.setScissorTest(Pe=R)},this.setOpaqueSort=function(R){ge=R},this.setTransparentSort=function(R){Ge=R},this.getClearColor=function(R){return R.copy(st.getClearColor())},this.setClearColor=function(){st.setClearColor(...arguments)},this.getClearAlpha=function(){return st.getClearAlpha()},this.setClearAlpha=function(){st.setClearAlpha(...arguments)},this.clear=function(R=!0,V=!0,j=!0){let J=0;if(R){let K=!1;if(Z!==null){let Re=Z.texture.format;K=p.has(Re)}if(K){let Re=Z.texture.type,De=u.has(Re),Ae=st.getClearColor(),Ne=st.getClearAlpha(),ze=Ae.r,at=Ae.g,ut=Ae.b;De?(y[0]=ze,y[1]=at,y[2]=ut,y[3]=Ne,z.clearBufferuiv(z.COLOR,0,y)):(v[0]=ze,v[1]=at,v[2]=ut,v[3]=Ne,z.clearBufferiv(z.COLOR,0,v))}else J|=z.COLOR_BUFFER_BIT}V&&(J|=z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),j&&(J|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),J!==0&&z.clear(J)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(R){R.setRenderer(this),I=R},this.dispose=function(){t.removeEventListener("webglcontextlost",Et,!1),t.removeEventListener("webglcontextrestored",vt,!1),t.removeEventListener("webglcontextcreationerror",In,!1),st.dispose(),Ee.dispose(),be.dispose(),X.dispose(),fe.dispose(),oe.dispose(),Ie.dispose(),he.dispose(),Me.dispose(),Be.dispose(),Be.removeEventListener("sessionstart",ch),Be.removeEventListener("sessionend",hh),Fi.stop()};function Et(R){R.preventDefault(),Cc("WebGLRenderer: Context Lost."),C=!0}function vt(){Cc("WebGLRenderer: Context Restored."),C=!1;let R=H.autoReset,V=Ye.enabled,j=Ye.autoUpdate,J=Ye.needsUpdate,K=Ye.type;He(),H.autoReset=R,Ye.enabled=V,Ye.autoUpdate=j,Ye.needsUpdate=J,Ye.type=K}function In(R){Je("WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Vn(R){let V=R.target;V.removeEventListener("dispose",Vn),ef(V)}function ef(R){tf(R),X.remove(R)}function tf(R){let V=X.get(R).programs;V!==void 0&&(V.forEach(function(j){Me.releaseProgram(j)}),R.isShaderMaterial&&Me.releaseShaderCache(R))}this.renderBufferDirect=function(R,V,j,J,K,Re){V===null&&(V=ue);let De=K.isMesh&&K.matrixWorld.determinantAffine()<0,Ae=rf(R,V,j,J,K);S.setMaterial(J,De);let Ne=j.index,ze=1;if(J.wireframe===!0){if(Ne=ne.getWireframeAttribute(j),Ne===void 0)return;ze=2}let at=j.drawRange,ut=j.attributes.position,Ue=at.start*ze,yt=(at.start+at.count)*ze;Re!==null&&(Ue=Math.max(Ue,Re.start*ze),yt=Math.min(yt,(Re.start+Re.count)*ze)),Ne!==null?(Ue=Math.max(Ue,0),yt=Math.min(yt,Ne.count)):ut!=null&&(Ue=Math.max(Ue,0),yt=Math.min(yt,ut.count));let Bt=yt-Ue;if(Bt<0||Bt===1/0)return;Ie.setup(K,J,Ae,j,Ne);let Rt,wt=Se;if(Ne!==null&&(Rt=ve.get(Ne),wt=le,wt.setIndex(Rt)),K.isMesh)J.wireframe===!0?(S.setLineWidth(J.wireframeLinewidth*me()),wt.setMode(z.LINES)):wt.setMode(z.TRIANGLES);else if(K.isLine){let en=J.linewidth;en===void 0&&(en=1),S.setLineWidth(en*me()),K.isLineSegments?wt.setMode(z.LINES):K.isLineLoop?wt.setMode(z.LINE_LOOP):wt.setMode(z.LINE_STRIP)}else K.isPoints?wt.setMode(z.POINTS):K.isSprite&&wt.setMode(z.TRIANGLES);if(K.isBatchedMesh)if(it.get("WEBGL_multi_draw"))wt.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else{let en=K._multiDrawStarts,Le=K._multiDrawCounts,ln=K._multiDrawCount,mt=Ne?ve.get(Ne).bytesPerElement:1,bn=X.get(J).currentProgram.getUniforms();for(let Gn=0;Gn<ln;Gn++)bn.setValue(z,"_gl_DrawID",Gn),wt.render(en[Gn]/mt,Le[Gn])}else if(K.isInstancedMesh)wt.renderInstances(Ue,Bt,K.count);else if(j.isInstancedBufferGeometry){let en=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,Le=Math.min(j.instanceCount,en);wt.renderInstances(Ue,Bt,Le)}else wt.render(Ue,Bt)};function lh(R,V,j,J){I!==null&&R.isNodeMaterial&&I.setObject(J,R),ae===!0&&ke.setState(R,j,!1),R.transparent===!0&&R.side===sn&&R.forceSinglePass===!1?(R.side=$t,R.needsUpdate=!0,ia(R,V,J),R.side=Ci,R.needsUpdate=!0,ia(R,V,J),R.side=sn):ia(R,V,J)}this.compile=function(R,V,j=null){j===null&&(j=R),I!==null&&I.renderStart(R,V,j),w=be.get(j),w.init(V),g.push(w),j.traverseVisible(function(K){K.isLight&&K.layers.test(V.layers)&&(w.pushLight(K),K.castShadow&&w.pushShadow(K))}),R!==j&&R.traverseVisible(function(K){K.isLight&&K.layers.test(V.layers)&&(w.pushLight(K),K.castShadow&&w.pushShadow(K))}),w.setupLights(),I!==null&&I.updateLights(w.state.lightsArray),W=this.localClippingEnabled,ae=ke.init(this.clippingPlanes,W),ae===!0&&ke.setGlobalState(this.clippingPlanes,V),I!==null&&Ye.render(w.state.shadowsArray,j,V);let J=new Set;return R.traverse(function(K){if(!(K.isMesh||K.isPoints||K.isLine||K.isSprite))return;let Re=K.material;if(Re)if(Array.isArray(Re))for(let De=0;De<Re.length;De++){let Ae=Re[De];lh(Ae,j,V,K),J.add(Ae)}else lh(Re,j,V,K),J.add(Re)}),w=g.pop(),I!==null&&I.renderEnd(),J},this.compileAsync=function(R,V,j=null){let J=this.compile(R,V,j);return new Promise(K=>{function Re(){if(J.forEach(function(De){let Ne=X.get(De).currentProgram;(Ne===void 0||Ne.isReady())&&J.delete(De)}),J.size===0){K(R);return}setTimeout(Re,10)}it.get("KHR_parallel_shader_compile")!==null?Re():setTimeout(Re,10)})};let yl=null;function nf(R){yl&&yl(R)}function ch(){Fi.stop()}function hh(){Fi.start()}let Fi=new cd;Fi.setAnimationLoop(nf),typeof self<"u"&&Fi.setContext(self),this.setAnimationLoop=function(R){yl=R,Be.setAnimationLoop(R),R===null?Fi.stop():Fi.start()},Be.addEventListener("sessionstart",ch),Be.addEventListener("sessionend",hh),this.render=function(R,V){if(V!==void 0&&V.isCamera!==!0){Je("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;I!==null&&I.renderStart(R,V);let j=Be.enabled===!0&&Be.isPresenting===!0,J=M!==null&&(Z===null||j)&&M.begin(A,Z);if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),Be.enabled===!0&&Be.isPresenting===!0&&(M===null||M.isCompositing()===!1)&&(Be.cameraAutoUpdate===!0&&Be.updateCamera(V),V=Be.getCamera()),R.isScene===!0&&R.onBeforeRender(A,R,V,Z),w=be.get(R,g.length),w.init(V),w.state.textureUnits=ee.getTextureUnits(),g.push(w),U.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),$.setFromProjectionMatrix(U,Un,V.reversedDepth),W=this.localClippingEnabled,ae=ke.init(this.clippingPlanes,W),E=Ee.get(R,T.length),E.init(),T.push(E),Be.enabled===!0&&Be.isPresenting===!0){let De=A.xr.getDepthSensingMesh();De!==null&&Ml(De,V,-1/0,A.sortObjects)}Ml(R,V,0,A.sortObjects),E.finish(),I!==null&&I.updateLights(w.state.lightsArray),A.sortObjects===!0&&E.sort(ge,Ge),de=Be.enabled===!1||Be.isPresenting===!1||Be.hasDepthSensing()===!1,de&&st.addToRenderList(E,R),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ae===!0&&ke.beginShadows();let K=w.state.shadowsArray;if(Ye.render(K,R,V),ae===!0&&ke.endShadows(),(J&&M.hasRenderPass())===!1){let De=E.opaque,Ae=E.transmissive;if(w.setupLights(),V.isArrayCamera){let Ne=V.cameras;if(Ae.length>0)for(let ze=0,at=Ne.length;ze<at;ze++){let ut=Ne[ze];dh(De,Ae,R,ut)}de&&st.render(R);for(let ze=0,at=Ne.length;ze<at;ze++){let ut=Ne[ze];uh(E,R,ut,ut.viewport)}}else Ae.length>0&&dh(De,Ae,R,V),de&&st.render(R),uh(E,R,V)}Z!==null&&B===0&&(ee.updateMultisampleRenderTarget(Z),ee.updateRenderTargetMipmap(Z)),J&&M.end(A),R.isScene===!0&&R.onAfterRender(A,R,V),Ie.resetDefaultState(),Y=-1,Q=null,g.pop(),g.length>0?(w=g[g.length-1],ee.setTextureUnits(w.state.textureUnits),ae===!0&&ke.setGlobalState(A.clippingPlanes,w.state.camera)):w=null,T.pop(),T.length>0?E=T[T.length-1]:E=null,I!==null&&I.renderEnd()};function Ml(R,V,j,J){if(R.visible===!1)return;if(R.layers.test(V.layers)){if(R.isGroup)j=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(V);else if(R.isLightProbeGrid)w.pushLightProbeGrid(R);else if(R.isLight)w.pushLight(R),R.castShadow&&w.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||R.intersectsFrustum($)){J&&re.setFromMatrixPosition(R.matrixWorld).applyMatrix4(U);let De=oe.update(R),Ae=R.material;Ae.visible&&E.push(R,De,Ae,j,re.z,null,V)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||R.intersectsFrustum($))){let De=oe.update(R),Ae=R.material;if(J&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),re.copy(R.boundingSphere.center)):(De.boundingSphere===null&&De.computeBoundingSphere(),re.copy(De.boundingSphere.center)),re.applyMatrix4(R.matrixWorld).applyMatrix4(U)),Array.isArray(Ae)){let Ne=De.groups;for(let ze=0,at=Ne.length;ze<at;ze++){let ut=Ne[ze],Ue=Ae[ut.materialIndex];Ue&&Ue.visible&&E.push(R,De,Ue,j,re.z,ut,V)}}else Ae.visible&&E.push(R,De,Ae,j,re.z,null,V)}}let Re=R.children;for(let De=0,Ae=Re.length;De<Ae;De++)Ml(Re[De],V,j,J)}function uh(R,V,j,J){let{opaque:K,transmissive:Re,transparent:De}=R;w.setupLightsView(j),ae===!0&&ke.setGlobalState(A.clippingPlanes,j),J&&S.viewport(q.copy(J)),K.length>0&&na(K,V,j),Re.length>0&&na(Re,V,j),De.length>0&&na(De,V,j),S.buffers.depth.setTest(!0),S.buffers.depth.setMask(!0),S.buffers.color.setMask(!0),S.setPolygonOffset(!1)}function dh(R,V,j,J){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[J.id]===void 0){let Ue=it.has("EXT_color_buffer_half_float")||it.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[J.id]=new un(1,1,{generateMipmaps:!0,type:Ue?vn:dn,minFilter:Tn,samples:Math.max(4,D.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:dt.workingColorSpace})}let Re=w.state.transmissionRenderTarget[J.id],De=J.viewport||q;Re.setSize(De.z*A.transmissionResolutionScale,De.w*A.transmissionResolutionScale);let Ae=A.getRenderTarget(),Ne=A.getActiveCubeFace(),ze=A.getActiveMipmapLevel();A.setRenderTarget(Re),A.getClearColor(Ve),We=A.getClearAlpha(),We<1&&A.setClearColor(16777215,.5),A.clear(),de&&st.render(j);let at=A.toneMapping;A.toneMapping=Bn;let ut=J.viewport;if(J.viewport!==void 0&&(J.viewport=void 0),w.setupLightsView(J),ae===!0&&ke.setGlobalState(A.clippingPlanes,J),na(R,j,J),ee.updateMultisampleRenderTarget(Re),ee.updateRenderTargetMipmap(Re),it.has("WEBGL_multisampled_render_to_texture")===!1){let Ue=!1;for(let yt=0,Bt=V.length;yt<Bt;yt++){let Rt=V[yt],{object:wt,geometry:en,material:Le,group:ln}=Rt;if(Le.side===sn&&wt.layers.test(J.layers)){let mt=Le.side;Le.side=$t,Le.needsUpdate=!0,fh(wt,j,J,en,Le,ln),Le.side=mt,Le.needsUpdate=!0,Ue=!0}}Ue===!0&&(ee.updateMultisampleRenderTarget(Re),ee.updateRenderTargetMipmap(Re))}A.setRenderTarget(Ae,Ne,ze),A.setClearColor(Ve,We),ut!==void 0&&(J.viewport=ut),A.toneMapping=at}function na(R,V,j){let J=V.isScene===!0?V.overrideMaterial:null;for(let K=0,Re=R.length;K<Re;K++){let De=R[K],{object:Ae,geometry:Ne,group:ze}=De,at=De.material;at.allowOverride===!0&&J!==null&&(at=J),Ae.layers.test(j.layers)&&fh(Ae,V,j,Ne,at,ze)}}function fh(R,V,j,J,K,Re){I!==null&&K.isNodeMaterial&&I.setObject(R,K),R.onBeforeRender(A,V,j,J,K,Re),R.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),K.onBeforeRender(A,V,j,J,R,Re),K.transparent===!0&&K.side===sn&&K.forceSinglePass===!1?(K.side=$t,K.needsUpdate=!0,A.renderBufferDirect(j,V,J,K,R,Re),K.side=Ci,K.needsUpdate=!0,A.renderBufferDirect(j,V,J,K,R,Re),K.side=sn):A.renderBufferDirect(j,V,J,K,R,Re),R.onAfterRender(A,V,j,J,K,Re)}function ia(R,V,j){V.isScene!==!0&&(V=ue);let J=X.get(R),K=w.state.lights,Re=w.state.shadowsArray,De=K.state.version,Ae=Me.getParameters(R,K.state,Re,V,j,w.state.lightProbeGridArray),Ne=Me.getProgramCacheKey(Ae),ze=J.programs;J.environment=R.isMeshStandardMaterial||R.isMeshLambertMaterial||R.isMeshPhongMaterial?V.environment:null,J.fog=V.fog;let at=R.isMeshStandardMaterial||R.isMeshLambertMaterial&&!R.envMap||R.isMeshPhongMaterial&&!R.envMap;J.envMap=fe.get(R.envMap||J.environment,at),J.envMapRotation=J.environment!==null&&R.envMap===null?V.environmentRotation:R.envMapRotation,ze===void 0&&(R.addEventListener("dispose",Vn),ze=new Map,J.programs=ze);let ut=ze.get(Ne);if(ut!==void 0){if(J.currentProgram===ut&&J.lightsStateVersion===De)return mh(R,Ae),ut}else Ae.uniforms=Me.getUniforms(R),I!==null&&R.isNodeMaterial&&I.build(R,j,Ae),R.onBeforeCompile(Ae,A),ut=Me.acquireProgram(Ae,Ne),ze.set(Ne,ut),J.uniforms=Ae.uniforms;let Ue=J.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Ue.clippingPlanes=ke.uniform),mh(R,Ae),J.needsLights=of(R),J.lightsStateVersion=De,J.needsLights&&(Ue.ambientLightColor.value=K.state.ambient,Ue.lightProbe.value=K.state.probe,Ue.sunLights.value=K.state.sun,Ue.sunLightShadows.value=K.state.sunShadow,Ue.directionalLights.value=K.state.directional,Ue.directionalLightShadows.value=K.state.directionalShadow,Ue.spotLights.value=K.state.spot,Ue.spotLightShadows.value=K.state.spotShadow,Ue.rectAreaLights.value=K.state.rectArea,Ue.ltc_1.value=K.state.rectAreaLTC1,Ue.ltc_2.value=K.state.rectAreaLTC2,Ue.pointLights.value=K.state.point,Ue.pointLightShadows.value=K.state.pointShadow,Ue.hemisphereLights.value=K.state.hemi,Ue.sunShadowMatrix.value=K.state.sunShadowMatrix,Ue.sunShadowCascade.value=K.state.sunShadowCascade,Ue.directionalShadowMatrix.value=K.state.directionalShadowMatrix,Ue.spotLightMatrix.value=K.state.spotLightMatrix,Ue.spotLightMap.value=K.state.spotLightMap,Ue.pointShadowMatrix.value=K.state.pointShadowMatrix),J.lightProbeGrid=w.state.lightProbeGridArray.length>0,J.currentProgram=ut,J.uniformsList=null,ut}function ph(R){if(R.uniformsList===null){let V=R.currentProgram.getUniforms();R.uniformsList=Ys.seqWithValue(V.seq,R.uniforms)}return R.uniformsList}function mh(R,V){let j=X.get(R);j.outputColorSpace=V.outputColorSpace,j.batching=V.batching,j.batchingColor=V.batchingColor,j.instancing=V.instancing,j.instancingColor=V.instancingColor,j.instancingMorph=V.instancingMorph,j.skinning=V.skinning,j.morphTargets=V.morphTargets,j.morphNormals=V.morphNormals,j.morphColors=V.morphColors,j.morphTargetsCount=V.morphTargetsCount,j.numClippingPlanes=V.numClippingPlanes,j.numIntersection=V.numClipIntersection,j.vertexAlphas=V.vertexAlphas,j.vertexTangents=V.vertexTangents,j.toneMapping=V.toneMapping}function sf(R,V){if(R.length===0)return null;if(R.length===1)return R[0].texture!==null?R[0]:null;_.setFromMatrixPosition(V.matrixWorld);for(let j=0,J=R.length;j<J;j++){let K=R[j];if(K.texture!==null&&K.boundingBox.containsPoint(_))return K}return null}function rf(R,V,j,J,K){V.isScene!==!0&&(V=ue),ee.resetTextureUnits();let Re=V.fog,De=J.isMeshStandardMaterial||J.isMeshLambertMaterial||J.isMeshPhongMaterial?V.environment:null,Ae=Z===null?A.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:dt.workingColorSpace,Ne=J.isMeshStandardMaterial||J.isMeshLambertMaterial&&!J.envMap||J.isMeshPhongMaterial&&!J.envMap,ze=fe.get(J.envMap||De,Ne),at=J.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,ut=!!j.attributes.tangent&&(!!J.normalMap||J.anisotropy>0),Ue=!!j.morphAttributes.position,yt=!!j.morphAttributes.normal,Bt=!!j.morphAttributes.color,Rt=Bn;J.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(Rt=A.toneMapping);let wt=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,en=wt!==void 0?wt.length:0,Le=X.get(J),ln=w.state.lights;if(ae===!0&&(W===!0||R!==Q)){let Tt=R===Q&&J.id===Y;ke.setState(J,R,Tt)}let mt=!1;J.version===Le.__version?(Le.needsLights&&Le.lightsStateVersion!==ln.state.version||Le.outputColorSpace!==Ae||K.isBatchedMesh&&Le.batching===!1||!K.isBatchedMesh&&Le.batching===!0||K.isBatchedMesh&&Le.batchingColor===!0&&K._colorsTexture===null||K.isBatchedMesh&&Le.batchingColor===!1&&K._colorsTexture!==null||K.isInstancedMesh&&Le.instancing===!1||!K.isInstancedMesh&&Le.instancing===!0||K.isSkinnedMesh&&Le.skinning===!1||!K.isSkinnedMesh&&Le.skinning===!0||K.isInstancedMesh&&Le.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&Le.instancingColor===!1&&K.instanceColor!==null||K.isInstancedMesh&&Le.instancingMorph===!0&&K.morphTexture===null||K.isInstancedMesh&&Le.instancingMorph===!1&&K.morphTexture!==null||Le.envMap!==ze||J.fog===!0&&Le.fog!==Re||Le.numClippingPlanes!==void 0&&(Le.numClippingPlanes!==ke.numPlanes||Le.numIntersection!==ke.numIntersection)||Le.vertexAlphas!==at||Le.vertexTangents!==ut||Le.morphTargets!==Ue||Le.morphNormals!==yt||Le.morphColors!==Bt||Le.toneMapping!==Rt||Le.morphTargetsCount!==en||!!Le.lightProbeGrid!=w.state.lightProbeGridArray.length>0)&&(mt=!0):(mt=!0,Le.__version=J.version);let bn=Le.currentProgram;mt===!0&&(bn=ia(J,V,K),I&&J.isNodeMaterial&&I.onUpdateProgram(J,bn,Le));let Gn=!1,mi=!1,cs=!1,bt=bn.getUniforms(),Ft=Le.uniforms;if(S.useProgram(bn.program)&&(Gn=!0,mi=!0,cs=!0),J.id!==Y&&(Y=J.id,mi=!0),Le.needsLights){let Tt=sf(w.state.lightProbeGridArray,K);Le.lightProbeGrid!==Tt&&(Le.lightProbeGrid=Tt,mi=!0)}if(Gn||Q!==R){S.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),bt.setValue(z,"projectionMatrix",R.projectionMatrix),bt.setValue(z,"viewMatrix",R.matrixWorldInverse);let xi=bt.map.cameraPosition;xi!==void 0&&xi.setValue(z,k.setFromMatrixPosition(R.matrixWorld)),D.logarithmicDepthBuffer&&bt.setValue(z,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(J.isMeshPhongMaterial||J.isMeshToonMaterial||J.isMeshLambertMaterial||J.isMeshBasicMaterial||J.isMeshStandardMaterial||J.isShaderMaterial)&&bt.setValue(z,"isOrthographic",R.isOrthographicCamera===!0),Q!==R&&(Q=R,mi=!0,cs=!0)}if(Le.needsLights&&(ln.state.sunShadowMap.length>0&&bt.setValue(z,"sunShadowMap",ln.state.sunShadowMap,ee),ln.state.directionalShadowMap.length>0&&bt.setValue(z,"directionalShadowMap",ln.state.directionalShadowMap,ee),ln.state.spotShadowMap.length>0&&bt.setValue(z,"spotShadowMap",ln.state.spotShadowMap,ee),ln.state.pointShadowMap.length>0&&bt.setValue(z,"pointShadowMap",ln.state.pointShadowMap,ee)),K.isSkinnedMesh){bt.setOptional(z,K,"bindMatrix"),bt.setOptional(z,K,"bindMatrixInverse");let Tt=K.skeleton;Tt&&(Tt.boneTexture===null&&Tt.computeBoneTexture(),bt.setValue(z,"boneTexture",Tt.boneTexture,ee))}K.isBatchedMesh&&(bt.setOptional(z,K,"batchingTexture"),bt.setValue(z,"batchingTexture",K._matricesTexture,ee),bt.setOptional(z,K,"batchingIdTexture"),bt.setValue(z,"batchingIdTexture",K._indirectTexture,ee),bt.setOptional(z,K,"batchingColorTexture"),K._colorsTexture!==null&&bt.setValue(z,"batchingColorTexture",K._colorsTexture,ee));let gi=j.morphAttributes;if((gi.position!==void 0||gi.normal!==void 0||gi.color!==void 0)&&G.update(K,j,bn),(mi||Le.receiveShadow!==K.receiveShadow)&&(Le.receiveShadow=K.receiveShadow,bt.setValue(z,"receiveShadow",K.receiveShadow)),(J.isMeshStandardMaterial||J.isMeshLambertMaterial||J.isMeshPhongMaterial)&&J.envMap===null&&V.environment!==null&&(Ft.envMapIntensity.value=V.environmentIntensity),Ft.dfgLUT!==void 0&&(Ft.dfgLUT.value=h_()),mi){if(bt.setValue(z,"toneMappingExposure",A.toneMappingExposure),Le.needsLights&&af(Ft,cs),Re&&J.fog===!0&&Oe.refreshFogUniforms(Ft,Re),Oe.refreshMaterialUniforms(Ft,J,ie,te,w.state.transmissionRenderTarget[R.id]),Le.needsLights&&Le.lightProbeGrid){let Tt=Le.lightProbeGrid;Ft.probesSH.value=Tt.texture,Ft.probesMin.value.copy(Tt.boundingBox.min),Ft.probesMax.value.copy(Tt.boundingBox.max),Ft.probesResolution.value.copy(Tt.resolution)}Ys.upload(z,ph(Le),Ft,ee)}if(J.isShaderMaterial&&J.uniformsNeedUpdate===!0&&(Ys.upload(z,ph(Le),Ft,ee),J.uniformsNeedUpdate=!1),J.isSpriteMaterial&&bt.setValue(z,"center",K.center),bt.setValue(z,"modelViewMatrix",K.modelViewMatrix),bt.setValue(z,"normalMatrix",K.normalMatrix),bt.setValue(z,"modelMatrix",K.matrixWorld),J.uniformsGroups!==void 0){let Tt=J.uniformsGroups;for(let xi=0,hs=Tt.length;xi<hs;xi++){let xh=Tt[xi];he.update(xh,bn),he.bind(xh,bn)}}return bn}function af(R,V){R.ambientLightColor.needsUpdate=V,R.lightProbe.needsUpdate=V,R.sunLights.needsUpdate=V,R.sunLightShadows.needsUpdate=V,R.directionalLights.needsUpdate=V,R.directionalLightShadows.needsUpdate=V,R.pointLights.needsUpdate=V,R.pointLightShadows.needsUpdate=V,R.spotLights.needsUpdate=V,R.spotLightShadows.needsUpdate=V,R.rectAreaLights.needsUpdate=V,R.hemisphereLights.needsUpdate=V}function of(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return N},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return Z},this.setRenderTargetTextures=function(R,V,j){let J=X.get(R);J.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,J.__autoAllocateDepthBuffer===!1&&(J.__useRenderToTexture=!1),X.get(R.texture).__webglTexture=V,X.get(R.depthTexture).__webglTexture=J.__autoAllocateDepthBuffer?void 0:j,J.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,V){let j=X.get(R);j.__webglFramebuffer=V,j.__useDefaultFramebuffer=V===void 0},this.setRenderTarget=function(R,V=0,j=0){Z=R,N=V,B=j;let J=null,K=!1,Re=!1;if(R){let Ae=X.get(R);if(Ae.__useDefaultFramebuffer!==void 0){S.bindFramebuffer(z.FRAMEBUFFER,Ae.__webglFramebuffer),q.copy(R.viewport),_e.copy(R.scissor),pe=R.scissorTest,S.viewport(q),S.scissor(_e),S.setScissorTest(pe),Y=-1;return}else if(Ae.__webglFramebuffer===void 0)ee.setupRenderTarget(R);else if(Ae.__hasExternalTextures)ee.rebindTextures(R,X.get(R.texture).__webglTexture,X.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){let at=R.depthTexture;if(Ae.__boundDepthTexture!==at){if(at!==null&&X.has(at)&&(R.width!==at.image.width||R.height!==at.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");ee.setupDepthRenderbuffer(R)}}let Ne=R.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(Re=!0);let ze=X.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(ze[V])?J=ze[V][j]:J=ze[V],K=!0):R.samples>0&&ee.useMultisampledRTT(R)===!1?J=X.get(R).__webglMultisampledFramebuffer:Array.isArray(ze)?J=ze[j]:J=ze,q.copy(R.viewport),_e.copy(R.scissor),pe=R.scissorTest}else q.copy(xe).multiplyScalar(ie).floor(),_e.copy(Fe).multiplyScalar(ie).floor(),pe=Pe;if(j!==0&&(J=P),S.bindFramebuffer(z.FRAMEBUFFER,J)&&S.drawBuffers(R,J),S.viewport(q),S.scissor(_e),S.setScissorTest(pe),K){let Ae=X.get(R.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+V,Ae.__webglTexture,j)}else if(Re){let Ae=V;for(let Ne=0;Ne<R.textures.length;Ne++){let ze=X.get(R.textures[Ne]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+Ne,ze.__webglTexture,j,Ae)}}else if(R!==null&&j!==0){let Ae=X.get(R.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Ae.__webglTexture,j)}Y=-1};function gh(R){let V=X.get(R);return(V.__readFormat!==R.format||V.__readType!==R.type)&&(V.__readFormat=R.format,V.__readType=R.type,V.__formatReadable=D.textureFormatReadable(R.format),V.__typeReadable=D.textureTypeReadable(R.type)),V}this.readRenderTargetPixels=function(R,V,j,J,K,Re,De,Ae=0){if(!(R&&R.isWebGLRenderTarget)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ne=X.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&De!==void 0&&(Ne=Ne[De]),Ne){S.bindFramebuffer(z.FRAMEBUFFER,Ne);try{let ze=R.textures[Ae],at=ze.format,ut=ze.type;R.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+Ae);let Ue=gh(ze);if(Ue.__formatReadable===!1){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ue.__typeReadable===!1){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=R.width-J&&j>=0&&j<=R.height-K&&z.readPixels(V,j,J,K,we.convert(at),we.convert(ut),Re)}finally{let ze=Z!==null?X.get(Z).__webglFramebuffer:null;S.bindFramebuffer(z.FRAMEBUFFER,ze)}}},this.readRenderTargetPixelsAsync=async function(R,V,j,J,K,Re,De,Ae=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ne=X.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&De!==void 0&&(Ne=Ne[De]),Ne)if(V>=0&&V<=R.width-J&&j>=0&&j<=R.height-K){S.bindFramebuffer(z.FRAMEBUFFER,Ne);let ze=R.textures[Ae],at=ze.format,ut=ze.type;R.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+Ae);let Ue=gh(ze);if(Ue.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ue.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let yt=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,yt),z.bufferData(z.PIXEL_PACK_BUFFER,Re.byteLength,z.STREAM_READ),z.readPixels(V,j,J,K,we.convert(at),we.convert(ut),0),z.bindBuffer(z.PIXEL_PACK_BUFFER,null);let Bt=Z!==null?X.get(Z).__webglFramebuffer:null;S.bindFramebuffer(z.FRAMEBUFFER,Bt);let Rt=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await Lu(z,Rt,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,yt),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,Re),z.bindBuffer(z.PIXEL_PACK_BUFFER,null),z.deleteBuffer(yt),z.deleteSync(Rt),Re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,V=null,j=0){let J=Math.pow(2,-j),K=Math.floor(R.image.width*J),Re=Math.floor(R.image.height*J),De=V!==null?V.x:0,Ae=V!==null?V.y:0;ee.setTexture2D(R,0),z.copyTexSubImage2D(z.TEXTURE_2D,j,0,0,De,Ae,K,Re),S.unbindTexture()},this.copyTextureToTexture=function(R,V,j=null,J=null,K=0,Re=0){let De,Ae,Ne,ze,at,ut,Ue,yt,Bt,Rt=R.isCompressedTexture?R.mipmaps[Re]:R.image;if(j!==null)De=j.max.x-j.min.x,Ae=j.max.y-j.min.y,Ne=j.isBox3?j.max.z-j.min.z:1,ze=j.min.x,at=j.min.y,ut=j.isBox3?j.min.z:0;else{let Ft=Math.pow(2,-K);De=Math.floor(Rt.width*Ft),Ae=Math.floor(Rt.height*Ft),R.isDataArrayTexture?Ne=Rt.depth:R.isData3DTexture?Ne=Math.floor(Rt.depth*Ft):Ne=1,ze=0,at=0,ut=0}J!==null?(Ue=J.x,yt=J.y,Bt=J.z):(Ue=0,yt=0,Bt=0);let wt=we.convert(V.format),en=we.convert(V.type),Le;V.isData3DTexture?(ee.setTexture3D(V,0),Le=z.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(ee.setTexture2DArray(V,0),Le=z.TEXTURE_2D_ARRAY):(ee.setTexture2D(V,0),Le=z.TEXTURE_2D),S.activeTexture(z.TEXTURE0),S.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,V.flipY),S.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),S.pixelStorei(z.UNPACK_ALIGNMENT,V.unpackAlignment);let ln=S.getParameter(z.UNPACK_ROW_LENGTH),mt=S.getParameter(z.UNPACK_IMAGE_HEIGHT),bn=S.getParameter(z.UNPACK_SKIP_PIXELS),Gn=S.getParameter(z.UNPACK_SKIP_ROWS),mi=S.getParameter(z.UNPACK_SKIP_IMAGES);S.pixelStorei(z.UNPACK_ROW_LENGTH,Rt.width),S.pixelStorei(z.UNPACK_IMAGE_HEIGHT,Rt.height),S.pixelStorei(z.UNPACK_SKIP_PIXELS,ze),S.pixelStorei(z.UNPACK_SKIP_ROWS,at),S.pixelStorei(z.UNPACK_SKIP_IMAGES,ut);let cs=R.isDataArrayTexture||R.isData3DTexture,bt=V.isDataArrayTexture||V.isData3DTexture;if(R.isDepthTexture){let Ft=X.get(R),gi=X.get(V),Tt=X.get(Ft.__renderTarget),xi=X.get(gi.__renderTarget);S.bindFramebuffer(z.READ_FRAMEBUFFER,Tt.__webglFramebuffer),S.bindFramebuffer(z.DRAW_FRAMEBUFFER,xi.__webglFramebuffer);for(let hs=0;hs<Ne;hs++)cs&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,X.get(R).__webglTexture,K,ut+hs),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,X.get(V).__webglTexture,Re,Bt+hs)),z.blitFramebuffer(ze,at,De,Ae,Ue,yt,De,Ae,z.DEPTH_BUFFER_BIT,z.NEAREST);S.bindFramebuffer(z.READ_FRAMEBUFFER,null),S.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(K!==0||R.isRenderTargetTexture||X.has(R)){let Ft=X.get(R),gi=X.get(V);S.bindFramebuffer(z.READ_FRAMEBUFFER,L),S.bindFramebuffer(z.DRAW_FRAMEBUFFER,F);for(let Tt=0;Tt<Ne;Tt++)cs?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Ft.__webglTexture,K,ut+Tt):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Ft.__webglTexture,K),bt?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,gi.__webglTexture,Re,Bt+Tt):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,gi.__webglTexture,Re),K!==0?z.blitFramebuffer(ze,at,De,Ae,Ue,yt,De,Ae,z.COLOR_BUFFER_BIT,z.NEAREST):bt?z.copyTexSubImage3D(Le,Re,Ue,yt,Bt+Tt,ze,at,De,Ae):z.copyTexSubImage2D(Le,Re,Ue,yt,ze,at,De,Ae);S.bindFramebuffer(z.READ_FRAMEBUFFER,null),S.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else bt?R.isDataTexture||R.isData3DTexture?z.texSubImage3D(Le,Re,Ue,yt,Bt,De,Ae,Ne,wt,en,Rt.data):V.isCompressedArrayTexture?z.compressedTexSubImage3D(Le,Re,Ue,yt,Bt,De,Ae,Ne,wt,Rt.data):z.texSubImage3D(Le,Re,Ue,yt,Bt,De,Ae,Ne,wt,en,Rt):R.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,Re,Ue,yt,De,Ae,wt,en,Rt.data):R.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,Re,Ue,yt,Rt.width,Rt.height,wt,Rt.data):z.texSubImage2D(z.TEXTURE_2D,Re,Ue,yt,De,Ae,wt,en,Rt);S.pixelStorei(z.UNPACK_ROW_LENGTH,ln),S.pixelStorei(z.UNPACK_IMAGE_HEIGHT,mt),S.pixelStorei(z.UNPACK_SKIP_PIXELS,bn),S.pixelStorei(z.UNPACK_SKIP_ROWS,Gn),S.pixelStorei(z.UNPACK_SKIP_IMAGES,mi),Re===0&&V.generateMipmaps&&z.generateMipmap(Le),S.unbindTexture()},this.initRenderTarget=function(R){X.get(R).__webglFramebuffer===void 0&&ee.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?ee.setTextureCube(R,0):R.isData3DTexture?ee.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?ee.setTexture2DArray(R,0):ee.setTexture2D(R,0),S.unbindTexture()},this.resetState=function(){N=0,B=0,Z=null,S.reset(),Ie.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=dt._getDrawingBufferColorSpace(e),t.unpackColorSpace=dt._getUnpackColorSpace()}};var $e=(i,e,t)=>i<e?e:i>t?t:i,xt=(i,e,t)=>i+(e-i)*t,pt=(i,e,t)=>{let n=$e((t-i)/(e-i),0,1);return n*n*(3-2*n)};function Ni(i){let e=i>>>0;return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function ll(i,e,t){let n=Math.imul(i,374761393)+Math.imul(e,668265263)+Math.imul(t,2147483647);return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967295}function hi(i,e,t=0,n=0){let s=Math.floor(i),r=Math.floor(e),a=i-s,o=e-r,l=a*a*(3-2*a),c=o*o*(3-2*o),d=s+1,f=r+1;n>0&&(s=(s%n+n)%n,r=(r%n+n)%n,d=(s+1)%n,f=(r+1)%n);let h=ll(s,r,t),m=ll(d,r,t),x=ll(s,f,t),b=ll(d,f,t);return xt(xt(h,m,l),xt(x,b,l),c)}function Nt(i,e,t=5,n=0,s=0){let r=0,a=.5,o=1,l=0;for(let c=0;c<t;c++)r+=a*hi(i*o,e*o,n+c*17,s?s*o:0),l+=a,a*=.5,o*=2;return r/l}function gd(i,e,t=5,n=0){let s=0,r=.5,a=1,o=0;for(let l=0;l<t;l++){let c=1-Math.abs(hi(i*a,e*a,n+l*31)*2-1);s+=r*c*c,o+=r,r*=.5,a*=2}return s/o}function $s(i){let e=document.createElement("canvas");return e.width=e.height=i,e}function Qs(i,e,t){let n=new br(i);return n.wrapS=n.wrapT=wi,n.anisotropy=t,n.generateMipmaps=!0,n.minFilter=Tn,n.magFilter=kt,e&&(n.colorSpace=Jt),n}function Qr(i,e,t,n){let s=$s(i),r=$s(i),a=$s(i),o=s.getContext("2d"),l=r.getContext("2d"),c=a.getContext("2d"),d=o.createImageData(i,i),f=l.createImageData(i,i),h=c.createImageData(i,i),m=new Float32Array(i*i);for(let x=0;x<i;x++)for(let b=0;b<i;b++){let p=n(b/i,x/i,b,x),u=x*i+b;d.data[u*4]=$e(p[0],0,1)*255,d.data[u*4+1]=$e(p[1],0,1)*255,d.data[u*4+2]=$e(p[2],0,1)*255,d.data[u*4+3]=255,m[u]=p[3];let y=$e(p[4]==null?.85:p[4],0,1)*255;h.data[u*4]=h.data[u*4+1]=h.data[u*4+2]=y,h.data[u*4+3]=255}for(let x=0;x<i;x++)for(let b=0;b<i;b++){let p=m[x*i+(b+i-1)%i],u=m[x*i+(b+1)%i],y=m[(x+i-1)%i*i+b],v=m[(x+1)%i*i+b],_=(p-u)*t,E=(y-v)*t,w=1,T=Math.hypot(_,E,w);_/=T,E/=T,w/=T;let g=(x*i+b)*4;f.data[g]=(_*.5+.5)*255,f.data[g+1]=(E*.5+.5)*255,f.data[g+2]=(w*.5+.5)*255,f.data[g+3]=255}return o.putImageData(d,0,0),l.putImageData(f,0,0),c.putImageData(h,0,0),{map:Qs(s,!0,e),normal:Qs(r,!1,e),rough:Qs(a,!1,e)}}function xd(i=4,e=512){let t={};t.concrete=Qr(e,i,2.2,(n,s)=>{let r=Nt(n*6,s*6,4,3,6),a=Nt(n*48,s*48,3,9,48),o=hi(n*90,s*90,5,90)>.93?1:0,l=Math.abs(s*4%1-.5)>.492?1:0,c=Nt(n*3,s*14,3,21,3),d=.56+(r-.5)*.18+(a-.5)*.12-o*.12-l*.16-Math.max(0,c-.55)*.35;return[d*1,d*1,d*.97,d*.7+a*.3-o*.5-l*.6,.9-o*.1]}),t.wood=Qr(e,i,2.6,(n,s)=>{let r=Math.floor(s*6),a=s*6%1,o=r*.37,l=Nt((n+o)*4,s*90,4,41+r,0),c=Math.sin((l*14+n*3+o)*6.283)*.5+.5,d=a<.035||a>.965?1:0,f=Math.max(0,1-Math.hypot((n+o)%1-.5,(a-.5)*.4)*8)*(hi(r,1,7)>.6?1:0),h=.35+c*.22+(l-.5)*.25-d*.28-f*.2,m=hi(r,3,11);return[h*(.95+m*.2)*1,h*.68,h*.42,h*.8-d*.7-f*.2,.78]}),t.stone=Qr(e,i,3.2,(n,s)=>{let a=Math.floor(s*5),o=(n*3+a%2*.5)%1,l=s*5%1,c=a+Math.floor(n*3+a%2*.5),d=o<.04||o>.96||l<.06||l>.94?1:0,f=.45+hi(c,9,5)*.25,h=Nt(n*24,s*24,4,51,24),m=d?.3:f+(h-.5)*.22;return[m*1.02,m,m*.92,d?0:.55+(h-.5)*.5,d?.98:.86]}),t.rock=Qr(e,i,4,(n,s)=>{let r=Nt(n*8,s*8,6,61,8),a=Nt(n*3,s*3,4,71,3),o=Math.sin((s*22+a*5)*6.283)*.5+.5,l=Nt(n*32,s*32,3,83,32),c=.5+(r-.5)*.5+(a-.5)*.22+(o-.5)*.06+(l-.5)*.12;return[c,c,c,r*.6+a*.2+o*.1+l*.3,.92]}),t.iron=Qr(256,i,1.2,(n,s)=>{let r=hi(n*3,s*80,13,0)*.5+Nt(n*12,s*12,3,17,12)*.5,a=.2+r*.14;return[a,a*1.02,a*1.08,r,.45+r*.2]});{let s=$s(256),r=s.getContext("2d"),a=r.createImageData(256,256),o=(l,c)=>Nt(l*4,c*4,3,91,4)*.78+Nt(l*16,c*16,2,93,16)*.22;for(let l=0;l<256;l++)for(let c=0;c<256;c++){let d=c/256,f=l/256,h=1/256,m=(o(d+h,f)-o(d-h,f))*11,x=(o(d,f+h)-o(d,f-h))*11,b=(l*256+c)*4;a.data[b]=$e(.5+m,0,1)*255,a.data[b+1]=$e(.5+x,0,1)*255,a.data[b+2]=Nt(d*10,f*10,4,97,10)*255,a.data[b+3]=255}r.putImageData(a,0,0),t.water=Qs(s,!1,i)}{let s=$s(256),r=s.getContext("2d");r.fillStyle="#b9b2a4",r.fillRect(0,0,256,256);let a=r.getImageData(0,0,256,256);for(let o=0;o<256*256;o++){let l=(hi(o%256*.25,Math.floor(o/256)*.25,3)-.5)*36;a.data[o*4]+=l,a.data[o*4+1]+=l,a.data[o*4+2]+=l}r.putImageData(a,0,0),r.translate(256/2,256/2),r.strokeStyle="#5e584d",r.lineWidth=3;for(let o=0;o<8;o++){r.save(),r.rotate(o*Math.PI/4);for(let l=0;l<6;l++)r.beginPath(),r.moveTo(24,-6+l*5),r.lineTo(124,-22+l*8),r.stroke();r.restore()}r.fillStyle="#2a2723",r.beginPath(),r.arc(0,0,20,0,6.283),r.fill(),t.millstone={map:Qs(s,!0,i)}}{let r=$s(128),a=r.getContext("2d");a.fillStyle="#3b2a1e",a.fillRect(0,0,128,128);let o=Ni(9);for(let l=0;l<400;l++)a.fillStyle="rgba("+(70+o()*40|0)+","+(48+o()*25|0)+",30,0.5)",a.fillRect(o()*128,o()*128,2+o()*6,1);a.fillStyle="#c9a36a";for(let l=0;l<8;l++)a.fillRect(l*16+7,0,2,128);t.belt={map:Qs(r,!0,i)}}return t}var jr=new O(.52,.64,.56).normalize(),DM=new Ce("#f1c3a6"),NM=new Ce("#1f3480"),UM=new Ce("#8aa6e6"),ea=new Ce("#aebbd6"),th=`
uniform vec3 uSunDir;
vec3 skyColor(vec3 d){
  float h = clamp(d.y, -0.2, 1.0);
  vec3 hor = vec3(0.945, 0.765, 0.651), mid = vec3(0.541, 0.651, 0.902), zen = vec3(0.122, 0.204, 0.502);
  vec3 c = mix(hor, mid, smoothstep(0.0, 0.28, h));
  c = mix(c, zen, smoothstep(0.22, 0.95, h));
  float s = max(dot(d, uSunDir), 0.0);
  c += vec3(1.0, 0.72, 0.42) * (pow(s, 6.0) * 0.28 + pow(s, 48.0) * 0.55);
  c += vec3(1.0, 0.93, 0.8) * smoothstep(0.9993, 0.9998, s) * 2.2;
  return c;
}`;function _d(){let i=new Gt({side:$t,depthWrite:!1,fog:!1,uniforms:{uSunDir:{value:jr},uTime:{value:0},uLin:{value:0}},vertexShader:"varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * p; gl_Position.z = gl_Position.w; }",fragmentShader:`${th}
      varying vec3 vDir; uniform float uTime, uLin;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
      float fbm(vec2 p){ float s = 0.0, a = 0.5; for(int i = 0; i < 4; i++){ s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
      void main(){
        vec3 d = normalize(vDir); vec3 c = skyColor(d);
        // high stratocumulus bands, lit warm toward the sun
        vec2 cp = d.xz / max(d.y, 0.05) * 0.55 + vec2(uTime * 0.004, 0.0);
        float cl = smoothstep(0.52, 0.8, fbm(cp * 1.6)) * smoothstep(0.02, 0.22, d.y);
        float lit = pow(max(dot(d, uSunDir), 0.0), 3.0);
        c = mix(c, mix(vec3(0.72, 0.62, 0.74), vec3(1.0, 0.82, 0.66), lit), cl * 0.55);
        if(uLin > 0.5) c = pow(c, vec3(2.2));
        gl_FragColor = vec4(c, 1.0);
      }`}),e=new qe(new li(900,32,20),i);return e.frustumCulled=!1,e.renderOrder=-10,e.name="sky",e}function vd(i,e){let t=new Zs(i),n=new Hi,s=e.clone();n.add(s);let r=t.fromScene(n,0,1,2e3);return t.dispose(),r.texture}function cl(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new St,c=0;for(let d=0;d<i.length;++d){let f=i[d],h=0;if(t!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let m in f.attributes){if(!n.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;r[m]===void 0&&(r[m]=[]),r[m].push(f.attributes[m]),h++}if(h!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let m in f.morphAttributes){if(!s.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+".  .morphAttributes must be consistent throughout all geometries."),null;a[m]===void 0&&(a[m]=[]),a[m].push(f.morphAttributes[m])}if(e){let m;if(t)m=f.index.count;else if(f.attributes.position!==void 0)m=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,m,d),c+=m}}if(t){let d=0,f=[];for(let h=0;h<i.length;++h){let m=i[h].index;for(let x=0;x<m.count;++x)f.push(m.getX(x)+d);d+=i[h].attributes.position.count}l.setIndex(f)}for(let d in r){let f=yd(r[d]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" attribute."),null;l.setAttribute(d,f)}for(let d in a){let f=a[d][0].length;if(f!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[d]=[];for(let h=0;h<f;++h){let m=[];for(let b=0;b<a[d].length;++b)m.push(a[d][b][h]);let x=yd(m);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" morphAttribute."),null;l.morphAttributes[d].push(x)}}}return l}function yd(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let d=i[c];if(e===void 0&&(e=d.array.constructor),e!==d.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=d.itemSize),t!==d.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=d.normalized),n!==d.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=d.gpuType),s!==d.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=d.count*t}let a=new e(r),o=new Yt(a,t,n),l=0;for(let c=0;c<i.length;++c){let d=i[c];if(d.isInterleavedBufferAttribute){let f=l/t;for(let h=0,m=d.count;h<m;h++)for(let x=0;x<t;x++){let b=d.getComponent(h,x);o.setComponent(h+f,x,b)}}else a.set(d.array,l);l+=d.count*t}return s!==void 0&&(o.gpuType=s),o}var kn=9,ui=10.2;var hl=-1.4,lt={x:7,y:3.6,z:-1,r:3.4},Md=i=>-1+6*Math.sin(i*.045+.6)*pt(-8,22,i),nh=i=>i<18?xt(.3,-.3,pt(4,18,i)):-.3-1.1*pt(40,125,i),ul=i=>xt(lt.x,Md(i)+1.5,pt(3,34,i))+4*Math.sin(i*.11)*pt(8,40,i);function u_(i){let e=[[-140,40],[-60,34],[-26,18],[-20,15],[-6,15],[12,22],[60,40],[105,62],[170,420]];for(let t=0;t<e.length-1;t++)if(i<=e[t+1][0]){let n=pt(e[t][0],e[t+1][0],i);return xt(e[t][1],e[t+1][1],n)}return 420}function Qt(i,e){let t=Math.abs(i-Md(e)),n=u_(e),s=Math.max(0,t-n),r=gd(i*.022+3,e*.022-5,5,4),a=15*pt(0,6.5,s)+.34*Math.pow(s,1.22)*(.75+.9*r);a+=pt(6,50,s)*(r-.35)*34+Nt(i*.07,e*.07,4,8)*4.2*pt(0,12,s)+(Nt(i*.35,e*.35,3,12)-.5)*.9*pt(0,8,s),a+=pt(-100,-150,e)*(30+34*r);let o=pt(-6,-17.5,e),l=xt(-.012*Math.max(0,e-4)-2.5*pt(110,190,e),-5.5,o);a+=l+(Nt(i*.2,e*.2,3,3)-.5)*.35*(1-o);let c=Math.abs(i-ul(e)),d=pt(-3,3,e)*(1-o),f=(1-pt(2,6.5,c))*d;a=xt(a,Math.min(a,nh(e)-.55+.18*Math.sin(e*.3+i*.2)),f*.95);let h=d_(i,e),m=(1-pt(1.4,4.2,h))*(1-o)*pt(-15,-7,e);return a=xt(a,Math.min(a,-.7),m*.95),a}var es=[[-13.5,-9],[-12.8,-3],[-11.2,3],[-8,7.2],[-3,9.6],[3,10.8],[6.6,11.2]];function d_(i,e){let t=1e9;for(let n=0;n<es.length-1;n++){let s=es[n][0],r=es[n][1],a=es[n+1][0],o=es[n+1][1],l=a-s,c=o-r,d=$e(((i-s)*l+(e-r)*c)/(l*l+c*c),0,1);t=Math.min(t,Math.hypot(i-(s+l*d),e-(r+c*d)))}return t}function bd(i,e){let t=e==="low"?150:200,n=170,s=215,r=-5,a=new On(2,2,t,t);a.rotateX(-Math.PI/2);let o=a.attributes.position,l=new Float32Array(o.count*3),c=a.attributes.uv,d=u=>Math.sign(u)*Math.pow(Math.abs(u),1.7);for(let u=0;u<o.count;u++){let y=d(o.getX(u))*n,v=r+d(o.getZ(u))*s;o.setX(u,y),o.setZ(u,v),o.setY(u,Qt(y,v)),c.setXY(u,y*.045,v*.045)}a.computeVertexNormals();let f=a.attributes.normal,h={rockD:new Ce("#45433f"),rockL:new Ce("#8c867b"),grassD:new Ce("#4d6e30"),grassL:new Ce("#7c9a42"),dirt:new Ce("#7a6548"),snow:new Ce("#f2f6fc"),shore:new Ce("#8d8472"),scree:new Ce("#7d7468"),sand:new Ce("#c4b08c")},m=new Ce,x=new Ce;for(let u=0;u<o.count;u++){let y=o.getX(u),v=o.getY(u),_=o.getZ(u),E=f.getY(u),w=Nt(y*.09,_*.09,3,5),T=Math.sin(v*1.6+Nt(y*.05,_*.05,3,2)*7)*.5+.5;m.copy(h.rockD).lerp(h.rockL,$e(w*.9+T*.25,0,1)),m.lerp(h.scree,pt(.45,.72,E)*.55);let g=pt(.66,.86,E)*(1-pt(16,30,v))*pt(-.3,.3,v);x.copy(h.grassD).lerp(h.grassL,Nt(y*.18,_*.18,3,9)),m.lerp(x,g*.95),m.lerp(h.shore,(1-pt(-.9,-.1,v))*.9),m.lerp(h.sand,pt(92,128,_)*(1-pt(.4,2.6,v))*.92),m.lerp(h.dirt,(1-pt(8.2,9.8,Math.abs(v-kn)))*.5*(_<-17?1:0));let M=pt(32+w*14,46+w*12,v)*pt(.3,.62,E+.15);m.lerp(h.snow,M);let A=(.72+.28*Nt(y*.5,_*.5,2,15))*(.78+.22*pt(.2,.8,E));l[u*3]=m.r*A,l[u*3+1]=m.g*A,l[u*3+2]=m.b*A}a.setAttribute("color",new Yt(l,3));let b=new ft({vertexColors:!0,roughness:.98,metalness:0});b.onBeforeCompile=u=>{u.uniforms.uDetail={value:i.rock.map},u.vertexShader=u.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWP; varying vec3 vWN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vWP = position; vWN = normal;`),u.fragmentShader=u.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vWP; varying vec3 vWN; uniform sampler2D uDetail;
vec3 tri(vec3 p, vec3 n, float s){ vec3 w = pow(abs(n), vec3(4.0)); w /= (w.x + w.y + w.z); return texture2D(uDetail, p.zy * s).rgb * w.x + texture2D(uDetail, p.xz * s).rgb * w.y + texture2D(uDetail, p.xy * s).rgb * w.z; }`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
{ vec3 nn2 = normalize(vWN); float h = dot(tri(vWP, nn2, 1.3), vec3(0.34)) * 0.3 + dot(tri(vWP, nn2, 0.42), vec3(0.34)) * 0.4 + dot(tri(vWP, nn2, 0.11), vec3(0.34)) * 0.3; vec3 dpx = dFdx(-vViewPosition), dpy = dFdy(-vViewPosition); float dhx = dFdx(h), dhy = dFdy(h); vec3 r1 = cross(dpy, normal), r2 = cross(normal, dpx); float det = dot(dpx, r1); vec3 gr = sign(det) * (dhx * r1 + dhy * r2); normal = normalize(abs(det) * normal - 1.15 * gr); }`).replace("#include <color_fragment>",`#include <color_fragment>
{ vec3 nn = normalize(vWN); vec3 d = tri(vWP, nn, 0.42) * 0.38 + tri(vWP, nn, 0.11) * 0.42 + tri(vWP, nn, 0.021) * 0.2; diffuseColor.rgb *= 1.12 + (d.r - 0.5) * 2.1; }`)};let p=new qe(a,b);return p.receiveShadow=!0,p.name="terrain",p}function Sd(i,e){let t=Ni(77),n=new Vt(.12,.2,1.4,5),s=[],r=(x,b)=>{let p=new Float32Array(x.attributes.position.count*3);for(let u=0;u<p.length;u+=3)p[u]=b.r,p[u+1]=b.g,p[u+2]=b.b;return x.setAttribute("color",new Yt(p,3)),x};n.translate(0,.7,0),r(n,new Ce("#4a3322")),s.push(n);for(let x=0;x<3;x++){let b=new Xi(1.25-x*.3,1.9-x*.2,7);b.translate(0,1.7+x*1.05,0),r(b,new Ce().setHSL(.31,.4,.055+x*.022)),s.push(b)}let a=cl(s);a.computeBoundingSphere();let o=new ft({vertexColors:!0,roughness:.95,flatShading:!0}),l=[],c=0;for(;l.length<i&&c++<i*30;){let x=(t()-.5)*220,b=-60+t()*130,p=Qt(x,b);if(p<.6||p>26)continue;let u=1.2,y=(Qt(x+u,b)-Qt(x-u,b))/(2*u),v=(Qt(x,b+u)-Qt(x,b-u))/(2*u);Math.hypot(y,v)>.75||b>-17&&Math.abs(x-ul(b))<8||e&&e(x,b)||p>8.2&&p<10.4&&b<-17||l.push([x,p,b,.8+t()*1.5,t()*6.28,t()])}let d=new ai(a,o,l.length),f=new gt,h=new Ot,m=new Ce;return l.forEach((x,b)=>{h.position.set(x[0],x[1]-.15,x[2]),h.scale.set(x[3]*(.85+x[5]*.3),x[3],x[3]*(.85+x[5]*.3)),h.rotation.y=x[4],h.updateMatrix(),d.setMatrixAt(b,h.matrix),m.setHSL(.02*x[5],0,.7+x[5]*.5),d.setColorAt(b,m)}),d.castShadow=!0,d.receiveShadow=!1,d.name="forest",d.userData.count=l.length,d}function wd(i){let a=Math.round(100)+1,o=Math.round((-17.2- -150)/2)+1,l=new Float32Array(a*o);for(let v=0;v<o;v++)for(let _=0;_<a;_++)l[v*a+_]=Qt(-100+_*2,-150+v*2);let c=[],d=[],f=[],h=new Int32Array(a*o).fill(-1),m=(v,_)=>{let E=_*a+v;return h[E]<0&&(h[E]=c.length/3,c.push(-100+v*2,kn,-150+_*2),d.push(-100+v*2,-150+_*2)),h[E]};for(let v=0;v<o-1;v++)for(let _=0;_<a-1;_++){let E=Math.min(l[v*a+_],l[v*a+_+1],l[(v+1)*a+_],l[(v+1)*a+_+1]),w=-100+(_+.5)*2,T=-150+(v+.5)*2;if(E<kn+.8&&!(w>3&&w<11&&T>-26&&T<-17.5)){let g=m(_,v),M=m(_+1,v),A=m(_,v+1),C=m(_+1,v+1);f.push(g,A,M,M,A,C)}}let x=new St;x.setAttribute("position",new Xe(c,3)),x.setAttribute("uv",new Xe(d,2));let b=c.length/3,p=new Float32Array(b*3),u=new Float32Array(b*3);for(let v=0;v<b;v++)p[v*3+1]=1,u[v*3]=1;x.setAttribute("normal",new Xe(p,3)),x.setAttribute("aTan",new Xe(u,3)),x.setAttribute("aFoam",new Xe(new Float32Array(b),1)),x.setIndex(f);let y=new qe(x,i);return y.name="lake",y.renderOrder=1,y.frustumCulled=!1,y}function Ed(i,e){let c=e==="low"?70:110,d=Math.round(c*.7),f=[],h=[],m=[],x=new Int32Array((c+1)*(d+1)).fill(-1),b=(g,M)=>{let A=-1300+2600*g/c,C=-1e3+1700*M/d,I=A<-170||A>170||C<-220||C>210;return[A,C,I]},p=new Ce("#6c6a68"),u=new Ce("#9a948a"),y=new Ce("#f2f6fc"),v=new Ce("#4a5a38"),_=new Ce,E=(g,M)=>{let A=M*(c+1)+g;if(x[A]<0){let[C,I]=b(g,M),P=Qt(C,I)-2;x[A]=f.length/3,f.push(C,P,I);let L=Nt(C*.01,I*.01,3,3);_.copy(p).lerp(u,L),_.lerp(v,(1-pt(10,60,P))*.6),_.lerp(y,pt(70+L*40,130+L*40,P)),m.push(_.r,_.g,_.b)}return x[A]};for(let g=0;g<d;g++)for(let M=0;M<c;M++){let A=b(M,g),C=b(M+1,g),I=b(M,g+1),P=b(M+1,g+1);if(!(A[2]||C[2]||I[2]||P[2]))continue;let L=E(M,g),F=E(M+1,g),N=E(M,g+1),B=E(M+1,g+1);h.push(L,N,F,F,N,B)}let w=new St;w.setAttribute("position",new Xe(f,3)),w.setAttribute("color",new Xe(m,3)),w.setIndex(h),w.computeVertexNormals();let T=new qe(w,i.clone());return T.material.polygonOffset=!0,T.material.polygonOffsetFactor=3,T.material.polygonOffsetUnits=3,T.name="farRange",T.frustumCulled=!1,T}function dl(i,e,t){let n=[],s=i,r=e,a=Qt(s,r);for(let o=0;o<90&&a>kn+.4;o++){let c=(Qt(s+1.5,r)-Qt(s-1.5,r))/3,d=(Qt(s,r+1.5)-Qt(s,r-1.5))/(2*1.5),f=Math.hypot(c,d)||1;n.push([s,a+.35,r]),s-=c/f*1.6,r-=d/f*1.6,a=Qt(s,r)}return n.push([s,kn+.05,r]),n}function Td(i,e){let o=Math.round(173.33333333333334)+1,l=Math.round(270/3)+1,c=new Float32Array(o*l);for(let T=0;T<l;T++)for(let g=0;g<o;g++)c[T*o+g]=Qt(-260+g*3,60+T*3);let d=[],f=[],h=[],m=[],x=new Int32Array(o*l).fill(-1),b=(T,g)=>{let M=g*o+T;return x[M]<0&&(x[M]=d.length/3,d.push(-260+T*3,hl,60+g*3),f.push(-260+T*3,60+g*3),h.push($e(1-(hl-c[M])/1.6,0,1))),x[M]};for(let T=0;T<l-1;T++)for(let g=0;g<o-1;g++)if(Math.min(c[T*o+g],c[T*o+g+1],c[(T+1)*o+g],c[(T+1)*o+g+1])<hl+.4){let A=b(g,T),C=b(g+1,T),I=b(g,T+1),P=b(g+1,T+1);m.push(A,I,C,C,I,P)}let p=d.length/3,u=2600;[[-u,329],[u,329],[-u,u],[u,u]].forEach(T=>{d.push(T[0],hl,T[1]),f.push(T[0],T[1]),h.push(0)}),m.push(p,p+2,p+1,p+1,p+2,p+3);let y=new St,v=d.length/3,_=new Float32Array(v*3),E=new Float32Array(v*3);for(let T=0;T<v;T++)_[T*3+1]=1,E[T*3]=1;y.setAttribute("position",new Xe(d,3)),y.setAttribute("uv",new Xe(f,2)),y.setAttribute("normal",new Xe(_,3)),y.setAttribute("aTan",new Xe(E,3)),y.setAttribute("aFoam",new Xe(new Float32Array(h),1)),y.setIndex(m);let w=new qe(y,i);return w.name="sea",w.renderOrder=1,w.frustumCulled=!1,w}var ih=[];function Ad(i,e){return{uTime:{value:0},uSunDir:{value:jr},uTex:{value:i.water},uFogColor:{value:ea.clone()},uFogDensity:{value:e}}}function di(i,e={}){let t=new Gt({transparent:e.transparent!==!1,depthWrite:!!e.depthWrite,side:sn,fog:!1,uniforms:Object.assign({},i,{uSpeed:{value:e.speed||0},uAmp:{value:e.amp==null?1:e.amp},uScale:{value:e.scale||.22},uStretch:{value:e.stretch||1},uAcross:{value:e.across||3.2},uShallow:{value:new Ce(e.shallow||"#4fb6c4")},uDeep:{value:new Ce(e.deep||"#0f4a78")},uOpacity:{value:e.opacity==null?.9:e.opacity},uFoam:{value:e.foam==null?1:e.foam},uEdgeFoam:{value:e.edgeFoam==null?.6:e.edgeFoam},uFlow:{value:e.flow==null?1:e.flow},uClear:{value:e.clear==null?.5:e.clear},uWhite:{value:e.white||0},uEnv:{value:null},uEnvAmt:{value:0}}),vertexShader:`
      attribute vec3 aTan; attribute float aFoam;
      varying vec3 vW, vN, vT; varying vec2 vUv; varying float vFoam;
      void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vT = normalize(mat3(modelMatrix) * aTan); vUv = uv; vFoam = aFoam; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`${th}
      uniform float uTime, uSpeed, uAmp, uScale, uStretch, uAcross, uOpacity, uFoam, uEdgeFoam, uFlow, uClear, uWhite, uFogDensity; uniform sampler2D uTex;
      uniform samplerCube uEnv; uniform float uEnvAmt; uniform vec3 uShallow, uDeep, uFogColor; varying vec3 vW, vN, vT; varying vec2 vUv; varying float vFoam;
      void main(){
        vec3 N = normalize(vN), T = normalize(vT - N * dot(vN, vT)), B = cross(N, T);
        float s = uSpeed * uTime;
        vec2 p1 = vec2(vUv.x * uScale * uStretch - s * 0.55, vUv.y * uAcross);
        vec2 p2 = vec2(vUv.x * uScale * 2.3 * uStretch - s * 0.9 + 0.37, vUv.y * uAcross * 1.8 + 0.2);
        vec4 a = texture2D(uTex, p1), b = texture2D(uTex, p2);
        float dist = length(cameraPosition - vW); vec2 g = ((a.xy - 0.5) * 1.0 + (b.xy - 0.5) * 0.45) * (0.5 + 0.8 * uFlow) * uAmp / (1.0 + dist * 0.035);
        vec3 n = normalize(N + T * g.x * 1.1 + B * g.y * 1.1);
        vec3 V = normalize(cameraPosition - vW);
        float ndv = clamp(dot(n, V), 0.0, 1.0);
        float fres = 0.03 + 0.97 * pow(1.0 - ndv, 4.0);
        vec3 R = reflect(-V, n); R.y = abs(R.y) * 0.85 + 0.04;
        vec3 sky = skyColor(R);
        if(uEnvAmt > 0.5){ vec3 e = textureCube(uEnv, R).rgb; e = clamp((e * (2.51 * e + 0.03)) / (e * (2.43 * e + 0.59) + 0.14), 0.0, 1.0); sky = mix(sky, pow(e, vec3(1.0 / 2.2)), 0.92); }
        float edge = min(vUv.y, 1.0 - vUv.y) * 2.0;
        float depth = clamp(uClear + (1.0 - uClear) * smoothstep(0.0, 0.5, edge), 0.0, 1.0);
        vec3 body = mix(uShallow, uDeep, depth) * (0.94 + 0.12 * a.z);
        vec3 col = mix(body, sky, clamp(fres * 1.15, 0.0, 1.0));
        vec3 L = normalize(uSunDir); vec3 H = normalize(L + V);
        float glint = pow(max(dot(n, H), 0.0), 140.0) * 1.2 + pow(max(dot(n, H), 0.0), 30.0) * 0.1;
        col += vec3(1.0, 0.86, 0.66) * glint;
        // foam: noise threshold boosted by flow, per-vertex turbulence and the banks
        float fn = texture2D(uTex, vec2(vUv.x * uScale * 1.3 * uStretch - s * 0.75, vUv.y * uAcross * 1.5)).z * 0.6 + b.z * 0.4;
        float foam = smoothstep(0.55, 0.78, fn + vFoam * 0.5 - 0.1) * clamp(vFoam * uFoam, 0.0, 1.0);
        foam += smoothstep(0.78, 1.0, 1.0 - edge) * uEdgeFoam * (0.4 + 0.6 * fn) * (0.35 + 0.65 * uFlow);
        foam = clamp(foam + uWhite * (0.55 + 0.45 * fn), 0.0, 1.0);
        col = mix(col, vec3(0.95, 0.98, 1.0) * (0.78 + 0.22 * ndv), foam * 0.9);
        float alpha = clamp(uOpacity * (0.6 + 0.4 * depth) + fres * 0.3 + foam * 0.4, 0.0, 1.0);
        float d = length(cameraPosition - vW); float f = 1.0 - exp(-pow(d * uFogDensity, 2.0));
        col = mix(col, uFogColor, clamp(f, 0.0, 1.0));
        gl_FragColor = vec4(col, alpha);
      }`});return ih.push(t),t}function ts(i,e,t,n){let s=i.length,r=new Float32Array(s*6),a=new Float32Array(s*6),o=new Float32Array(s*6),l=new Float32Array(s*4),c=new Float32Array(s*2),d=[],f=0,h=new O,m=new O,x=new O,b=new O(0,1,0);for(let u=0;u<s;u++){let y=i[Math.max(0,u-1)],v=i[Math.min(s-1,u+1)];h.copy(v).sub(y).normalize(),u>0&&(f+=i[u].distanceTo(i[u-1])),n?m.copy(n):m.crossVectors(b,h).normalize(),x.crossVectors(h,m).normalize(),x.y<0&&!n&&x.negate();let _=(typeof e=="function"?e(u,u/(s-1)):e)/2,E=t?t(u,u/(s-1)):0;for(let w=0;w<2;w++){let T=w?1:-1,g=(u*2+w)*3;r[g]=i[u].x+m.x*_*T,r[g+1]=i[u].y+m.y*_*T,r[g+2]=i[u].z+m.z*_*T,a[g]=x.x,a[g+1]=x.y,a[g+2]=x.z,o[g]=h.x,o[g+1]=h.y,o[g+2]=h.z,l[(u*2+w)*2]=f,l[(u*2+w)*2+1]=w,c[u*2+w]=E}if(u<s-1){let w=u*2;d.push(w,w+1,w+2,w+1,w+3,w+2)}}let p=new St;return p.setAttribute("position",new Xe(r,3)),p.setAttribute("normal",new Xe(a,3)),p.setAttribute("aTan",new Xe(o,3)),p.setAttribute("uv",new Xe(l,2)),p.setAttribute("aFoam",new Xe(c,1)),p.setIndex(d),p.userData.n=s,p}function Rd(i){return di(i,{speed:.05,amp:.45,scale:.1,across:.1,deep:"#0c3c66",shallow:"#2f7f95",opacity:1,clear:1,edgeFoam:0,transparent:!1,depthWrite:!0})}function Cd(i){return di(i,{speed:.07,amp:.7,scale:.05,across:.05,deep:"#0a4a78",shallow:"#2aa3b8",opacity:1,clear:1,edgeFoam:0,foam:1.2,transparent:!1,depthWrite:!0})}function ce(i,e,t,n=.25){let s=new mn(i,e,t),r=s.attributes.uv,a=[[t,e],[t,e],[i,t],[i,t],[i,e],[i,e]];for(let o=0;o<6;o++)for(let l=0;l<4;l++){let c=o*4+l;r.setXY(c,r.getX(c)*a[o][0]*n,r.getY(c)*a[o][1]*n)}return s}function tt(i,e,t,n=16,s=.25){let r=new Vt(i,e,t,n,1),a=r.attributes.uv,o=Math.PI*2*Math.max(i,e);for(let l=0;l<a.count;l++)a.setXY(l,a.getX(l)*o*s,a.getY(l)*t*s);return r}function se(i,e=0,t=0,n=0,s=0,r=0,a=0){return s&&i.rotateX(s),r&&i.rotateY(r),a&&i.rotateZ(a),i.translate(e,t,n),i}function Qe(i){let e=i.map(n=>n.index?n.toNonIndexed():n);e.forEach(n=>{for(let s of Object.keys(n.attributes))s!=="position"&&s!=="normal"&&s!=="uv"&&n.deleteAttribute(s);if(!n.attributes.uv){let s=n.attributes.position.count;n.setAttribute("uv",new n.attributes.position.constructor(new Float32Array(s*2),2))}});let t=cl(e,!1);return e.forEach(n=>n.dispose()),t}var fi=(i,e)=>[Math.cos(e)*i,Math.sin(e)*i];function Id(i,e,t,n,s=0,r="trap",a=0,o=0){let l=new xn,c=Math.PI*2/i;for(let f=0;f<i;f++){let h=f*c;(r==="saw"?[fi(t,h),fi(e,h+c*.08),fi(t,h+c*.92-1e-4)]:[fi(t,h),fi(e,h+c*.2),fi(e,h+c*.46),fi(t,h+c*.66)]).forEach((x,b)=>f===0&&b===0?l.moveTo(x[0],x[1]):l.lineTo(x[0],x[1]))}let d=new En;d.absarc(0,0,n,0,Math.PI*2,!0),l.holes.push(d);for(let f=0;f<s;f++){let h=(f+.14)/s*Math.PI*2,m=(f+.86)/s*Math.PI*2,x=new En,b=6;for(let p=0;p<=b;p++){let u=fi(o,h+(m-h)*p/b);p?x.lineTo(u[0],u[1]):x.moveTo(u[0],u[1])}for(let p=b;p>=0;p--){let u=fi(a,h+(m-h)*p/b);x.lineTo(u[0],u[1])}l.holes.push(x)}return l}function fl(i,e,t=.02,n=24){let s=new oi(i,{depth:e,bevelEnabled:t>0,bevelSize:t,bevelThickness:t,bevelSegments:1,curveSegments:n});return s.translate(0,0,-e/2),s}var pi=7.8,an=7,sh=-15,js=-1.6,ns=7.8,Pd=2.2,Xt={x0:-9,x1:2.4,z0:-7,z1:3.5,floorY:7};function f_(i,e){let t=(n,s={})=>new ft(Object.assign({map:n.map,normalMap:n.normal,roughnessMap:n.rough,roughness:1,metalness:0,normalScale:{x:1,y:1}},s));return{concrete:t(i.concrete,{color:14999768}),concreteDark:t(i.concrete,{color:10131086}),stone:t(i.stone,{color:13617080}),wood:t(i.wood,{color:14730400}),woodDark:t(i.wood,{color:9071180}),roof:t(i.wood,{color:7035466}),iron:t(i.iron,{color:16777215,metalness:.85,roughness:1}),brass:new ft({color:14067016,metalness:.9,roughness:.32}),steel:new ft({color:9279910,metalness:.9,roughness:.38}),paintRed:new ft({color:11680302,metalness:.2,roughness:.55}),dark:new ft({color:724242,roughness:1}),glass:new ft({color:16769184,emissive:16758858,emissiveIntensity:0,roughness:.4})}}function At(i,e,t=!0,n){let s=new qe(i,e);return s.castShadow=t,s.receiveShadow=!0,n&&(s.name=n),s}function Ld(i,e,t){let n=new xn;t.forEach((r,a)=>a?n.lineTo(r[0],r[1]):n.moveTo(r[0],r[1]));let s=new oi(n,{depth:e-i,bevelEnabled:!0,bevelSize:.12,bevelThickness:.12,bevelSegments:1,curveSegments:4});return s.rotateY(Math.PI/2),s.translate(i,0,0),s.attributes.uv.array.forEach((r,a,o)=>o[a]=r*.22),s}function rh(i,e,t,n,s){return At(Ld(e,t,n),s,!0,"dam")}var jt=[-3,0,3.2,6,8.2,10.2];function p_(i,e){if(!e)return Dd(i);let t=[[17.6,-7],[17.6,i]];for(let n=4;n>=0;n--)t.push([17.6-e[n],n===4?i:jt[n+1]],[17.6-e[n],jt[n]]);return t.push([17.6-e[0],-7]),t}var Dd=i=>[[17.6,-7],[17.6,i],[14,i],[13.7,9.4],[12.9,6.8],[11.8,3.6],[10.2,0],[8.4,-3],[6.9,-7]],m_=()=>{let i=[[17.6,-7],[17.6,kn],[14.4,kn]],e=14.4,t=kn;for(let n=0;n<6;n++){let s=t-1.5;i.push([e-.15,t],[e-.15,s]),t=s,e-=.62,i.push([e,s])}return i.push([8.6,-2.2],[6.9,-7]),i},g_=[[17.6,-7],[17.6,ns],[13.6,ns],[12.9,6.8],[11.8,3.6],[10.2,0],[8.4,-3],[6.9,-7]];function Nd(i,e,t){let n=f_(i,e),s=new rt,r={root:s,M:n,parts:{}},a=e===0,o=a?n.wood:n.concrete,l=new rt;l.name="damGroup";let c=[[-22,-16],[-9,5.3],[8.7,22]].map(W=>{let U=rh(n,W[0],W[1],Dd(ui),n.concrete);return U.userData.x0=W[0],U.userData.x1=W[1],U});l.add(c[0],rh(n,-16,-9,m_(),n.concrete),c[1],rh(n,5.3,8.7,g_,n.concreteDark),c[2]),r.rebuildDam=W=>c.forEach(U=>{let k=U.geometry;U.geometry=Ld(U.userData.x0,U.userData.x1,p_(ui,W)),k.dispose()});let d=[];d.push(se(ce(14.2,.8,.35),-15,ui+.4,-17.4)),d.push(se(ce(26.8,.8,.35),8.6,ui+.4,-17.4)),l.add(At(Qe(d),n.concrete));let f=[];for(let W=-21;W<=21;W+=2.1)W>4.4&&W<9.6||f.push(se(tt(.04,.04,1,5),W,ui+.5,-14.45));f.push(se(tt(.035,.035,14,5),-14.5,ui+1,-14.45,0,0,Math.PI/2),se(tt(.035,.035,11.5,5),15.5,ui+1,-14.45,0,0,Math.PI/2)),l.add(At(Qe(f),n.steel,!1));let h=[];for(let W=0;W<4;W++){let U=-4+W*7.4;U>4&&U<10||h.push(se(ce(1.1,.9,.5),U,5.6,-13.05,-.38))}h.push(se(ce(1.1,.9,.5),15,5.6,-13.05,-.38)),l.add(At(Qe(h),n.dark,!1)),r.parts.dam=l,s.add(l);let m=[];[[4.75,-17.2],[4.75,-15.4],[9.25,-17.2],[9.25,-15.4]].forEach(W=>m.push(se(ce(.5,4.2,.5),W[0],ui+2.1-.2,W[1]))),m.push(se(ce(5.4,.3,2.6),7,14.1,-16.3),se(ce(5.4,.25,.45),7,12.4,-17.2),se(ce(5.4,.25,.45),7,12.4,-15.4));let x=new rt;x.add(At(Qe(m),n.concrete)),x.name="gateHouse";let b=[];for(let W=-2;W<=2;W++)b.push(se(tt(.03,.03,.9,5),7+W*1.3,14.7,-17.5),se(tt(.03,.03,.9,5),7+W*1.3,14.7,-15.1));b.push(se(tt(.03,.03,5.4,5),7,15.15,-17.5,0,0,Math.PI/2),se(tt(.03,.03,5.4,5),7,15.15,-15.1,0,0,Math.PI/2)),x.add(At(Qe(b),n.steel,!1));let p=At(ce(1.2,.8,.9,.3),n.paintRed,!0);p.position.set(7,14.65,-16.3),x.add(p);let u=new rt;u.position.set(7,14.65,-15.75),u.add(At(new Zi(.34,.035,8,22),n.steel,!1));for(let W=0;W<4;W++){let U=At(tt(.025,.025,.68,5),n.steel,!1);U.rotation.z=W*Math.PI/4,u.add(U)}u.add(At(tt(.07,.07,.12,10),n.brass,!1)),u.children[u.children.length-1].rotation.x=Math.PI/2,x.add(u),r.parts.handwheel=u;let y=new rt;y.name="gate";let v=[se(ce(3,3.2,.14,.4),0,0,0)];for(let W=0;W<3;W++)v.push(se(ce(3,.16,.34,.4),0,-1.1+W*1.1,.2));v.push(se(ce(.1,3.2,.34,.4),-1.45,0,.2),se(ce(.1,3.2,.34,.4),1.45,0,.2)),y.add(At(Qe(v),n.steel));let _=[];[-1.1,1.1].forEach(W=>_.push(se(tt(.06,.06,8,8),W,4,0)));let E=At(Qe(_),n.iron,!1);y.add(E);let w=At(Qe([se(ce(.32,.24,.3),-1.1,1.7,0),se(ce(.32,.24,.3),1.1,1.7,0)]),n.brass,!1);y.add(w),y.position.set(7,ns+1.6,-16.35),x.add(y),r.parts.gate=y,r.parts.gateHouse=x,s.add(x),x.add(At(Qe([se(ce(.18,6.4,.5),5.2,ns+3.2,-16.35),se(ce(.18,6.4,.5),8.8,ns+3.2,-16.35)]),n.steel,!1));let T=js-sh,g=(sh+js)/2,M=new rt;M.name="flume";let A=[se(ce(3.5,.4,T),an,pi-.2,g),se(ce(.32,1.05,T),an-1.55,pi+.52,g),se(ce(.32,1.05,T),an+1.55,pi+.52,g)];for(let W=sh+1;W<js;W+=2.4)A.push(se(ce(3.9,.14,.2),an,pi+1.1,W));M.add(At(Qe(A),o));let C=[];[-11.2,-7.6,-4.2].forEach(W=>{C.push(se(ce(2.5,7.6,1.3,.3),an,3.6,W),se(ce(3.3,.45,1.7,.3),an,7.45,W),se(ce(3,.6,1.5,.3),an,-.1,W))}),M.add(At(Qe(C),n.stone));let I=[];[-11.2,-7.6,-4.2].forEach(W=>{I.push(se(ce(.16,4.2,.16),an-1.2,5,W+.9,0,0,.5),se(ce(.16,4.2,.16),an+1.2,5,W+.9,0,0,-.5))}),M.add(At(Qe(I),n.woodDark,!0)),M.add(At(se(ce(2.6,.12,.7),an,pi-.02,js+.28,.12),n.iron,!0)),r.parts.flume=M,s.add(M);let P=[se(ce(.6,1.9,9.6,.3),lt.x-2,.05,1.7),se(ce(.6,1.9,9.6,.3),lt.x+2,.05,1.7),se(ce(4.6,.4,9.6,.3),lt.x,-.95,1.7)];P.push(se(ce(1.4,3.8,1.6,.3),10.3,1.9,lt.z),se(ce(1.4,3.8,1.6,.3),3.1,1.9,lt.z));let L=At(Qe(P),n.stone);r.parts.tailrace=L,s.add(L);let F=new rt;F.name="mill";let{x0:N,x1:B,z0:Z,z1:Y,floorY:Q}=Xt,q=B-N,_e=Y-Z,pe=(N+B)/2,Ve=(Z+Y)/2,We=[se(ce(q+.6,.7,_e+.6,.3),pe,.35,Ve),se(ce(q,7,.7,.3),pe,3.5,Z+.35),se(ce(.7,7,_e,.3),N+.35,3.5,Ve)];F.add(At(Qe(We),n.stone));let je=[];[[N+.4,Z+.4],[B-.4,Z+.4],[N+.4,Y-.4],[B-.4,Y-.4],[pe,Z+.4],[pe,Y-.4]].forEach(W=>{je.push(se(ce(.42,12.4,.42),W[0],6.2+.4,W[1]))}),[3.2,Q,11.6].forEach(W=>{je.push(se(ce(q,.38,.38),pe,W,Z+.4),se(ce(q,.38,.38),pe,W,Y-.4),se(ce(.38,.38,_e),N+.4,W,Ve),se(ce(.38,.38,_e),B-.4,W,Ve))});for(let W=N+1.2;W<B;W+=1.75)je.push(se(ce(.28,.4,_e-.6),W,Q-.3,Ve));F.add(At(Qe(je),n.woodDark));let te=[se(ce(q-.2,.22,_e-.2,.3),pe,Q-.04,Ve)];F.add(At(Qe(te),n.wood));let ie=[se(ce(q,4.6,.25,.3),pe,Q+2.3,Z+.4),se(ce(.25,4.6,_e,.3),N+.4,Q+2.3,Ve)];F.add(At(Qe(ie),n.wood));let ge=Z-1,Ge=Z+_e*.74,xe=(Ge-ge)/2,Fe=.55,Pe=xe*Math.tan(Fe),$=xe/Math.cos(Fe),ae=11.9;return[-1,1].forEach(W=>{let U=At(ce(q+2.4,.3,$+.5,.3),n.roof);U.rotation.x=W*Fe,U.position.set(pe,ae+Pe/2+.15,ge+xe+W*xe/2),F.add(U)}),F.add(At(ce(q+2.4,.22,.34,.3),n.woodDark),At(se(ce(q+2.4,.22,.34,.3),0,0,0),n.woodDark)),F.children[F.children.length-2].position.set(pe,ae+Pe+.2,ge+xe),F.children[F.children.length-1].visible=!1,r.parts.mill=F,s.add(F),r}function Ud(i){let e=new rt,t=Ni(5),n=new Yi(1,1),s=n.attributes.position;for(let l=0;l<s.count;l++){let c=.82+.3*Math.sin(s.getX(l)*3.1+s.getY(l)*2.3+s.getZ(l)*4.7);s.setXYZ(l,s.getX(l)*c,s.getY(l)*c*.78,s.getZ(l)*c)}n.computeVertexNormals();let r=[];for(let l=0;l<46;l++){let c=t()*Math.PI*2,d=(t()-.5)*70,f=-9+t()*52;d>3.5&&d<10.5&&f<6||d>Xt.x0-1&&d<Xt.x1+1&&f>Xt.z0-1&&f<Xt.z1+1||r.push([d,f,.35+t()*t()*1.8,c])}let a=new ai(n,new ft({color:9077112,roughness:.95,flatShading:!1}),r.length),o=new Ot;return r.forEach((l,c)=>{o.position.set(l[0],Qt(l[0],l[1])+l[2]*.12,l[1]),o.scale.set(l[2],l[2],l[2]*(.8+c%3*.15)),o.rotation.set(0,l[3],0),o.updateMatrix(),a.setMatrixAt(c,o.matrix)}),a.castShadow=!0,a.receiveShadow=!0,e.add(a),e}function ah(){try{let i=navigator,e=i.deviceMemory||4,t=i.hardwareConcurrency||4;if(e<=2||t<=4)return"low";if(e>=8&&t>=8)return"high"}catch{}return"medium"}function Fd(i,e={}){let t=e.quality||ah(),n=new rl({canvas:i,antialias:t!=="low",alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!!e.preserve}),s=[];i.addEventListener("webglcontextlost",u=>{u.preventDefault(),s.forEach(y=>y())}),n.outputColorSpace=Jt,n.toneMapping=zr,n.toneMappingExposure=1.05,n.shadowMap.enabled=t!=="low",n.shadowMap.type=fo;let r=new Hi,a=.003;r.fog=new gr(ea.getHex(),a),r.background=ea.clone();let o=xd(t==="low"?2:4,t==="low"?256:512),l=_d();r.add(l),r.environment=vd(n,l),r.environmentIntensity=.55;let c=new Ji(16766632,3.1);if(c.position.copy(jr).multiplyScalar(90).add(new O(4,3,-4)),c.target.position.set(4,3,-4),r.add(c,c.target),n.shadowMap.enabled){let u=t==="high"?2048:1024;c.castShadow=!0,c.shadow.mapSize.set(u,u);let y=c.shadow.camera;y.left=-30,y.right=30,y.top=26,y.bottom=-26,y.near=20,y.far=200,c.shadow.bias=-4e-4,c.shadow.normalBias=.04}r.add(new Dr(10204392,4866100,.85));let d=new Kt(52,1,.5,1800),f=Ad(o,a),h={renderer:n,scene:r,camera:d,sun:c,T:o,shared:f,q:t,sky:l,lost:s},m=bd(o,t);r.add(m),h.terrain=m,r.add(Ed(m.material,t));let x=wd(Rd(f));r.add(x),h.lake=x;let b=Td(Cd(f));r.add(b),h.sea=b,h.forest=Sd(t==="low"?260:t==="high"?700:480,(u,y)=>u>37&&u<54&&y>-72&&y<-30||u>-9&&u<6&&y>8&&y<24||u>-19&&u<-8&&y>-9&&y<4),r.add(h.forest);let p=Nd(o,e.tier||0,t);return r.add(p.root),h.arch=p,r.add(Ud(p.M)),h}function Od(i,e,t,n){let s=i.renderer;s.setPixelRatio(n),s.setSize(e,t,!1),i.camera.aspect=e/t,i.camera.updateProjectionMatrix()}function Bd(i,e){let{renderer:t,scene:n,q:s,sky:r}=i,a=s==="low"?128:256,o=e.map(f=>f.visible);e.forEach(f=>f.visible=!1),i.lake.visible=!1,i.sea.visible=!1,r.material.uniforms.uLin.value=1;let l=(f,h,m)=>{let x=new Js(a,{type:vn,generateMipmaps:!0,minFilter:Tn}),b=new ks(1,3e3,x);return b.position.set(f,h,m),n.add(b),b.update(t,n),n.remove(b),x},c=l(0,13,-34),d=l(6,4,6);r.material.uniforms.uLin.value=0,i.lake.visible=!0,i.sea.visible=!0,e.forEach((f,h)=>f.visible=o[h]),ih.forEach(f=>{f.uniforms.uEnv.value=(f===i.lake.material?c:d).texture,f.uniforms.uEnvAmt.value=1}),i.reflections=[c,d]}var _t=(i,e,t=!0,n)=>{let s=new qe(i,e);return s.castShadow=t,s.receiveShadow=!0,n&&(s.name=n),s};function pl(i,e,t,n,s,r,a=0){let o=Math.hypot(t-i,n-e),l=ce(s,o,r,.5),c=Math.atan2(n-e,t-i);return l.rotateX(c),l.translate(a,(i+t)/2,(e+n)/2),l}var $n=(i,e)=>[i*Math.cos(e),i*Math.sin(e)],on={crownR:1.05,crownN:36,lanternR:.55,lanternN:19,pitX:.9,lanternX:.09},Ze={y:1.2,z:2.2,blade:3.45,arborX0:2.7,arborX1:5.6,fastX:4.62,looseX:5.18,pulleyR:.27},ml={x:4.9,r:.78};function zd(i,e,t,n){let s=new rt,r={root:s},a=lt.x,o=lt.y,l=lt.z,c=lt.r,d=new rt;d.position.set(a,o,l),r.drive=d;let f=[],h=[],m=[],x=20,b=.62,p=.3,u=1.2,y=(Pe,$,ae,W)=>{let U=new xn;U.absarc(0,0,Pe,0,Math.PI*2,!1);let k=new En;k.absarc(0,0,$,0,Math.PI*2,!0),U.holes.push(k);let re=fl(U,ae,.02,48);return re.rotateY(Math.PI/2),re.translate(W,0,0),re};[-u,u].forEach(Pe=>{f.push(y(c+.02,c-p,.16,Pe),y(c-.62,c-.78,.12,Pe))});for(let Pe=-1;Pe<=1;Pe+=2)for(let $=0;$<8;$++){let ae=$*Math.PI/4+(Pe>0?Math.PI/8:0),W=$n(b*.8,ae),U=$n(c-p+.05,ae);f.push(pl(W[0],W[1],U[0],U[1],.2,.16,Pe*(u-.25)))}let v=Math.PI*2/x;for(let Pe=0;Pe<x;Pe++){let $=Pe*v,ae=$n(c-.62,$),W=$n(c+.03,$),U=$n(c-.62,$+v*0),k=$n(c-.02,$+v*.96);f.push(pl(ae[0],ae[1],W[0],W[1],2*u-.1,.07),pl(U[0],U[1],k[0],k[1],2*u-.1,.06))}f.push(se(tt(b,b,2*u-.1,20),0,0,0,0,0,Math.PI/2)),[-.95,.95].forEach(Pe=>h.push(se(tt(b+.04,b+.04,.12,20),Pe,0,0,0,0,Math.PI/2))),[-u,u].forEach(Pe=>{for(let $=0;$<x;$+=2){let ae=$*v,W=$n(c-.34,ae);h.push(se(ce(.05,.1,.1,1),Pe+(Pe>0?.1:-.1),W[0],W[1],ae))}}),r.wheelWood=_t(Qe(f),i.wood,!0,"wheelWood"),d.add(r.wheelWood),d.add(_t(Qe(h),i.iron,!0));let _=-.2-a,E=9.9-a;if(d.add(_t(se(tt(.17,.17,E-_,14),(_+E)/2,0,0,0,0,Math.PI/2),i.iron,!0,"axle")),[3.1-a,10.3-a].forEach(Pe=>m.push(se(tt(.2,.2,.9,14),Pe,0,0,0,0,Math.PI/2))),d.add(_t(Qe(m),i.brass,!0)),n>0){let Pe=[];for(let $=0;$<n;$++)Pe.push(se(tt(b+.1+$*.03,b+.1+$*.03,.09,20),1.15+.14*$,0,0,0,0,Math.PI/2),se(tt(b+.1+$*.03,b+.1+$*.03,.09,20),-1.15-.14*$,0,0,0,0,Math.PI/2));d.add(_t(Qe(Pe),i.brass,!0))}{let Pe=on.pitX-a,$=new xn;$.absarc(0,0,1.22,0,Math.PI*2,!1);let ae=new En;ae.absarc(0,0,.22,0,Math.PI*2,!0),$.holes.push(ae);for(let k=0;k<6;k++){let re=(k+.18)/6*Math.PI*2,ue=(k+.82)/6*Math.PI*2,de=new En;for(let me=0;me<=6;me++){let z=$n(1,re+(ue-re)*me/6);me?de.lineTo(z[0],z[1]):de.moveTo(z[0],z[1])}for(let me=6;me>=0;me--){let z=$n(.42,re+(ue-re)*me/6);de.lineTo(z[0],z[1])}$.holes.push(de)}let W=fl($,.24,.02,40);W.rotateY(Math.PI/2),W.translate(Pe,0,0);let U=[];for(let k=0;k<on.crownN;k++){let re=k*Math.PI*2/on.crownN,ue=$n(on.crownR,re),de=ce(.38,.17,.13,1);de.rotateX(re+Math.PI/2),de.translate(Pe-.27,ue[0],ue[1]),U.push(de)}d.add(_t(W,i.wood,!0,"pitWheel"),_t(Qe(U),i.woodDark,!0,"cogs"))}d.add(_t(se(tt(ml.r,ml.r,1.15,28),ml.x-a+.2,0,0,0,0,Math.PI/2),i.iron,!0,"axlePulley")),s.add(d);let w=new rt,T=on.lanternX,g=l,M=o+on.crownR;r.lantern=w,w.position.set(T,0,g);let A=[],C=on.lanternR;A.push(se(tt(C+.06,C+.06,.1,24),0,M-.34,0),se(tt(C+.06,C+.06,.1,24),0,M+.34,0));for(let Pe=0;Pe<on.lanternN;Pe++){let $=Pe*Math.PI*2/on.lanternN;A.push(se(tt(.05,.05,.68,6),Math.cos($)*C,M,Math.sin($)*C))}w.add(_t(Qe(A),i.woodDark,!0,"lanternStaves")),w.add(_t(se(tt(.13,.13,5.4,10),0,M+2.4,0),i.iron,!0,"shaft"));let I=Xt.floorY+.25,P=_t(se(tt(1,1,.3,40),0,I+.62,0),new ft({map:e.millstone.map,color:16777215,roughness:.95}),!0,"runnerStone");w.add(P);let L=_t(se(tt(1.04,1.04,.32,40),0,I+.2,0),i.stone,!0);r.bedstone=L,w.add(L),w.add(_t(se(tt(.16,.16,.5,10),0,I+1,0),i.iron,!0)),w.add(_t(ce(2.2,.08,.1,1),i.iron,!0)),w.children[w.children.length-1].position.set(0,I+.82,0),s.add(w);let F=[],N=_t(new Vt(1.32,1.32,.62,40,1,!0),new ft({map:e.wood.map,normalMap:e.wood.normal,color:13215612,side:sn,roughness:.8}),!0);N.position.set(T,I+.45,g),s.add(N),[[-.9,-.9],[.9,-.9],[-.9,.9],[.9,.9]].forEach(Pe=>F.push(se(ce(.14,2.4,.14,1),T+Pe[0],I+1.6,g+Pe[1])));let B=new Vt(.2,.95,.9,4,1,!0);B.rotateY(Math.PI/4),B.translate(T,I+3.15,g),s.add(_t(Qe(F),i.woodDark),_t(B,new ft({map:e.wood.map,color:12096616,side:sn,roughness:.85}),!0));let Z=_t(pl(I+.45,0,I-.65,1.2,.34,.06),i.wood,!0);Z.position.set(T+1.15,0,g+.3),Z.rotation.y=0,s.add(Z);let Y=_t(ce(.7,.9,.5,1),new ft({color:14207395,roughness:1}),!0);Y.position.set(T+1.15,Xt.floorY+.5,g+1.6),s.add(Y);let Q=_t(new Vt(.05,.38,.5,14),new ft({color:16052194,roughness:1}),!1);Q.position.set(T+1.15,Xt.floorY+.16,g+2.2),Q.scale.y=.01,r.flour=Q,s.add(Q);let q=new rt;q.position.set(T-1.7,Xt.floorY+.12,g+1.5);let _e=_t(ce(.14,1.9,.14,1),i.woodDark,!0,"lever");_e.position.y=.95,q.add(_e);let pe=_t(new Vt(.16,.16,.2,12),i.paintRed,!0,"leverKnob");pe.rotation.z=Math.PI/2,pe.position.y=1.95,q.add(pe),q.add(_t(ce(.5,.3,.3,1),i.stone,!0)),q.children[q.children.length-1].position.set(0,0,0),r.lever=q,s.add(q);let Ve=new rt;Ve.name="sawmill",r.sawGroup=Ve,s.add(Ve);let We=new rt;We.position.set(0,Ze.y,Ze.z),r.arbor=We,We.add(_t(se(tt(.1,.1,Ze.arborX1-Ze.arborX0+.8,10),(Ze.arborX0+Ze.arborX1)/2,0,0,0,0,Math.PI/2),i.iron,!0)),We.add(_t(se(tt(Ze.pulleyR,Ze.pulleyR,.46,24),Ze.fastX,0,0,0,0,Math.PI/2),i.iron,!0));let je=_t(se(tt(Ze.pulleyR,Ze.pulleyR,.46,24),Ze.looseX,0,0,0,0,Math.PI/2),i.steel,!0);r.loose=je,We.add(je);let te=Id(52,1,.9,.12,0,"saw"),ie=fl(te,.035,0,24);ie.rotateY(Math.PI/2),ie.translate(Ze.blade,0,0),We.add(_t(ie,i.steel,!0,"sawBlade"),_t(se(tt(.3,.3,.08,20),Ze.blade+.05,0,0,0,0,Math.PI/2),i.iron,!0)),Ve.add(We);let ge=[se(ce(.4,1.7,.4,1),Ze.arborX0-.2,.85,Ze.z-.4),se(ce(.4,1.7,.4,1),Ze.arborX1+.1,.85,Ze.z-.4),se(ce(.4,1.7,.4,1),Ze.arborX0-.2,.85,Ze.z+.4),se(ce(.4,1.7,.4,1),Ze.arborX1+.1,.85,Ze.z+.4)];ge.push(se(ce(Ze.arborX1-Ze.arborX0+.8,.22,1.3,1),(Ze.arborX0+Ze.arborX1)/2,1.78-.9+0,Ze.z)),Ve.add(_t(Qe(ge),i.woodDark));let Ge=[se(ce(9,.16,.2,1),5,.62,Ze.z-.5),se(ce(9,.16,.2,1),5,.62,Ze.z+.5)];Ve.add(_t(Qe(Ge),i.iron));let xe=_t(tt(.38,.4,2.6,14),new ft({map:e.wood.map,normalMap:e.wood.normal,color:11569756,roughness:.9}),!0,"log");xe.rotation.z=Math.PI/2,xe.position.set(6,1.05,Ze.z),r.log=xe,Ve.add(xe);let Fe=_t(ce(1.4,.16,.7,1),i.wood,!0);return Fe.visible=!1,r.sawn=Fe,Ve.add(Fe),r.beltTex=e.belt.map.clone(),r.beltTex.wrapS=r.beltTex.wrapT=wi,r.beltTex.needsUpdate=!0,r.belt=x_(new O(0,o,l),ml.r+.02,new O(0,Ze.y,Ze.z),Ze.pulleyR+.02,.4,r.beltTex),r.belt.position.x=Ze.fastX,Ve.add(r.belt),r}function x_(i,e,t,n,s,r){let a=t.y-i.y,o=t.z-i.z,l=Math.hypot(a,o),c=Math.atan2(o,a),d=Math.acos((e-n)/l),f=[];for(let _=0;_<=24;_++){let E=c+d+(Math.PI*2-2*d)*_/24;f.push([i.y+e*Math.cos(E),i.z+e*Math.sin(E)])}for(let _=0;_<=24;_++){let E=c-d+2*d*_/24;f.push([t.y+n*Math.cos(E),t.z+n*Math.sin(E)])}let h=f.length,m=[],x=[],b=[],p=[],u=0;for(let _=0;_<h;_++){let E=f[_],w=f[(_+1)%h],T=f[(_+h-1)%h];_&&(u+=Math.hypot(E[0]-T[0],E[1]-T[1]));let g=w[0]-T[0],M=w[1]-T[1],A=Math.hypot(g,M)||1,C=M/A,I=-g/A;for(let F=0;F<2;F++)m.push((F?1:-1)*s/2,E[0],E[1]),p.push(0,C,I),x.push(F,u/1.2);let P=_*2,L=(_+1)%h*2;b.push(P,P+1,L,P+1,L+1,L)}let y=new St;y.setAttribute("position",new Xe(m,3)),y.setAttribute("normal",new Xe(p,3)),y.setAttribute("uv",new Xe(x,2)),y.setIndex(b);let v=new qe(y,new ft({map:r,color:16777215,roughness:.7,side:sn}));return v.castShadow=!0,v.receiveShadow=!0,v.name="belt",v}var gl=20,yn=(i,e,t)=>new O(i,e,t);function kd(i,e){let t=new rt,n=i.shared,s={},r=(u,y,v,_,E)=>{let w=ts(u,y,v,E),T=new qe(w,di(n,_));return T.frustumCulled=!1,T.renderOrder=3,t.add(T),T};{let u=[];for(let y=0;y<=10;y++)u.push(yn(an,pi+.04,xt(-16.35,-13.4,y/10)));s.gateOut=r(u,2.9,y=>1-y/12,{speed:1.4,amp:1.1,scale:.35,stretch:.55,shallow:"#7ad2d6",deep:"#2a86a8",opacity:.9,clear:.2,edgeFoam:.5})}{let u=[];for(let y=0;y<=30;y++)u.push(yn(an,pi+.06,xt(-13.4,js+.15,y/30)));s.flume=r(u,2.5,y=>y<6?.85-y*.13:.1+.08*Math.sin(y),{speed:1,amp:.9,scale:.3,stretch:.5,shallow:"#5cc0cc",deep:"#1f7096",opacity:.88,clear:.25,edgeFoam:.55})}{let u=[];for(let y=0;y<=12;y++){let v=y/12;u.push(yn(an,xt(pi+.08,lt.y+lt.r+.05,v),lt.z-.55+.26*v*v))}s.jet=r(u,2.3,y=>.25+y/20,{speed:3.2,amp:1.3,scale:.5,stretch:.7,shallow:"#bfeaf0",deep:"#5fb6d0",opacity:.9,clear:.1,edgeFoam:.8,white:.25},new O(1,0,0))}{let u=[];for(let y=0;y<=20;y++)u.push(yn(lt.x,.32-0*y,xt(-2.9,6.2,y/20)));s.tail=r(u,3.45,y=>y<7?.95:.35,{speed:1,amp:1.2,scale:.28,stretch:.45,shallow:"#7fc7cc",deep:"#2d7fa0",opacity:.9,clear:.2,edgeFoam:.7})}{let u=[];for(let y=0;y<=80;y++){let v=xt(6,150,Math.pow(y/80,1.15));u.push(yn(ul(v),nh(v)+.02,v))}s.river=r(u,(y,v)=>xt(4.4,22,Math.pow(v,1.6)),y=>.25+.45*Math.abs(Math.sin(y*.8))*(y<30?1:.4),{speed:.9,amp:1,scale:.12,stretch:.3,across:2.4,shallow:"#69b4b8",deep:"#216e8d",opacity:.92,clear:.4,edgeFoam:.9})}{let u=[],y=14.4,v=kn;u.push(yn(-12.5,v+.06,-y-1.2),yn(-12.5,v+.06,-y));for(let _=0;_<6;_++){let E=v-1.5;u.push(yn(-12.5,v+.07,-(y-.15)),yn(-12.5,E+.5,-(y-.15)+.05),yn(-12.5,E+.07,-(y-.15)+.1)),v=E,y-=.62,u.push(yn(-12.5,E+.07,-y))}s.spill=r(u,6.2,_=>_%4===3?.9:.4,{speed:2.4,amp:1.4,scale:.4,stretch:.7,shallow:"#cfeff2",deep:"#6dbdd6",opacity:.88,clear:.1,edgeFoam:.9,white:.2},new O(1,0,0))}{let u=new Fs(es.map(v=>yn(v[0],-.22,v[1])),!1,"catmullrom",.5),y=u.getPoints(54);y.forEach((v,_)=>v.y=xt(-.22,.08,_/y.length)),s.stream=r(y,(v,_)=>xt(3.4,4.8,_),v=>v<12?1:.35,{speed:1.2,amp:1.2,scale:.2,stretch:.4,shallow:"#7cc8cc",deep:"#2a7d9b",opacity:.92,clear:.3,edgeFoam:.8})}{let u=dl(-6,-140,60);if(u.length>8){let y=u.map(v=>yn(v[0],v[1],v[2]));s.fall=r(y,(v,_)=>xt(2.2,4.6,_),(v,_)=>.4+.5*_,{speed:2.6,amp:1.2,scale:.25,stretch:.5,across:2.2,shallow:"#dff6fa",deep:"#9fd4e6",opacity:.9,clear:.1,edgeFoam:.9,white:.4},new O(1,0,0)),s.fallBase=y[y.length-1]}}let a=new Pr({color:5814490,roughness:.08,metalness:0,transparent:!0,opacity:.88,envMapIntensity:1.6,clearcoat:.6}),o=new ai(new li(1,12,8),a,gl);o.frustumCulled=!1,o.renderOrder=4,e.add(o),s.fill=o,s.group=t;let l=(u,y)=>{let v=u*y;return Math.floor(v)+(Math.random()<v-Math.floor(v)?1:0)},c=new gt,d=new wn,f=new Fn,h=new O,m=new O,x=Math.PI*2,b=x/gl,p={x:-12.5,y:.35,z:-8.9};return s.update=function(u,y,v,_,E,w,T){let g=$e(u.Qg/u.Qref,0,1),M=$e(u.spill/u.Qref,0,1),A=w?0:1,C=T,I=(F,N)=>{let B=F.material.uniforms;for(let Z in N)B[Z].value=N[Z]};if(s.gateOut.visible=s.flume.visible=g>.03&&C>.4,s.flume.visible){let F=.14+.62*Math.pow(g,.66);s.flume.position.y=F,s.gateOut.position.y=F*.7,I(s.flume,{uSpeed:A*(.5+2.4*g),uFlow:.35+g*.65,uOpacity:.55+.35*Math.min(1,g*3)}),I(s.gateOut,{uSpeed:A*(1.2+3.2*g),uFlow:.5+g*.5,uOpacity:.55+.35*Math.min(1,g*3)})}s.jet.visible=g>.04&&C>.5,s.jet.visible&&(s.jet.scale.x=$e(.35+.7*Math.sqrt(g),.3,1.05),I(s.jet,{uSpeed:A*(3+3*g),uFlow:g,uOpacity:.6+.3*Math.min(1,g*4)}));let P=$e(u.rpm/48,0,1.2);if(s.tail.visible=C>.5,I(s.tail,{uSpeed:A*(.6+1.6*g),uFlow:.35+.65*Math.max(g,P),uFoam:.55+.9*P}),s.river.visible=C>.3,I(s.river,{uSpeed:A*.9*$e(.3+.7*(u.Qriver==null?u.Qref:u.Qriver)/u.Qref,.3,1.5),uFlow:.55+.25*g}),s.spill.visible=s.stream.visible=M>.02&&C>.6,s.spill.visible){let F=.35+.55*Math.min(1,M*2.2);I(s.spill,{uSpeed:A*(1.4+3*M),uFlow:.35+.65*M,uOpacity:F,uWhite:.12+.2*M}),I(s.stream,{uSpeed:A*(.7+1.6*M),uFlow:.4+.6*M,uFoam:.5+M}),s.spill.scale.x=.45+.55*Math.sqrt(M)}let L=Math.pow(g,.7);for(let F=0;F<gl;F++){let N=F*b,B=((N+_+Math.PI)%x+x)%x-Math.PI,Z=0;B<-.05&&B>-2.95&&(Z=B>-.5?pt(-.05,-.5,B):B>-1.5?1:1-pt(-1.5,-2.95,B)),Z*=L;let Y=lt.r-.3,Q=N+b*.42;f.set(-_,0,0),d.setFromEuler(f),h.set(0,Y*Math.cos(Q),Y*Math.sin(Q)),m.set(1.05,Math.max(1e-4,.13*Z),.3*Math.max(.2,Z)),c.compose(h,d,m),o.setMatrixAt(F,c)}if(o.instanceMatrix.needsUpdate=!0,E&&!w){if(s.fallBase)for(let N=l(24,y);N--;)E.mist.emit(s.fallBase.x+(Math.random()-.5)*5,s.fallBase.y+.4,s.fallBase.z+(Math.random()-.5)*2,(Math.random()-.5)*.6,.8+Math.random(),.3,3.2,3.2,.3);let F=N=>{let B=N*y;return Math.floor(B)+(Math.random()<B-Math.floor(B)?1:0)};for(let N=F(70*g*g);N--;)E.spray.emit(an+(Math.random()-.5)*1.6,lt.y+lt.r+.1,lt.z-.35+Math.random()*.3,(Math.random()-.5)*1.4,1.2+Math.random()*2,(Math.random()-.3)*1.4,.7+Math.random()*.5,.16,.55);for(let N=F(55*P*(.4+g));N--;)E.spray.emit(lt.x+(Math.random()-.5)*2.2,.5,lt.z-2.6+Math.random()*1.5,(Math.random()-.5)*1.8,1.4+Math.random()*2.2,(Math.random()-.3)*2.5,.9+Math.random()*.5,.2,.6);for(let N=F(26*P*g);N--;){let B=Math.floor(Math.random()*gl),Z=-1.6-Math.random()*1.2,Y=lt.y+Math.cos(Z)*(lt.r-.4),Q=lt.z+Math.sin(Z)*(lt.r-.4);E.spray.emit(lt.x+(Math.random()-.5)*2.2,Y,Q,(Math.random()-.5)*.4,-.5,-.4,.7,.12,.5)}for(let N=F(90*M);N--;)E.mist.emit(p.x+(Math.random()-.5)*5,p.y+.2,p.z+.4+Math.random()*1.6,(Math.random()-.5)*.8,.5+Math.random()*1.2,.6+Math.random(),1.8+Math.random(),.9,.34);for(let N=F(14*g);N--;)E.mist.emit(an+(Math.random()-.5)*2,lt.y+lt.r-.6,lt.z-.3+Math.random()*.4,(Math.random()-.5)*.6,.5+Math.random(),.2,1.4,.8,.2)}},s}function Ui(i,e,t={}){let n=new St,s=new Xe(i*3,3).setUsage(Zr),r=new Xe(i,1).setUsage(Zr),a=new Xe(i,1).setUsage(Zr);n.setAttribute("position",s),n.setAttribute("aSize",r),n.setAttribute("aAlpha",a);let o=s.array,l=new Float32Array(i*3),c=new Float32Array(i),d=new Float32Array(i),f=new Float32Array(i),h=new Float32Array(i);for(let u=0;u<i;u++)o[u*3+1]=-999;let m=new Gt({transparent:!0,depthWrite:!1,blending:Ii,uniforms:{uColor:{value:new Ce(e)},uScale:{value:400}},vertexShader:"attribute float aSize; attribute float aAlpha; varying float vA; uniform float uScale; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = clamp(aSize * uScale / -mv.z, 1.0, 56.0); vA = aAlpha; }",fragmentShader:"varying float vA; uniform vec3 uColor; void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c) * 2.0; float a = smoothstep(1.0, 0.2, d) * vA; if(a < 0.01) discard; gl_FragColor = vec4(uColor, a); }"}),x=new yr(n,m);x.frustumCulled=!1,x.renderOrder=5;let b=0,p=i;return{points:x,mat:m,setCap(u){p=Math.min(i,u)},emit(u,y,v,_,E,w,T,g,M){if(!(p<=0))for(let A=0;A<p;A++){let C=(b+A)%p;if(c[C]<=0){b=(C+1)%p,o[C*3]=u,o[C*3+1]=y,o[C*3+2]=v,l[C*3]=_,l[C*3+1]=E,l[C*3+2]=w,c[C]=T,d[C]=0,f[C]=g,h[C]=M;return}}},update(u,y=9,v=.4,_=.8){let E=n.attributes.position,w=n.attributes.aSize,T=n.attributes.aAlpha;for(let g=0;g<i;g++){if(c[g]<=0){w.array[g]!==0&&(w.array[g]=0,T.array[g]=0,o[g*3+1]=-999);continue}if(d[g]+=u,d[g]>=c[g]){c[g]=0,w.array[g]=0,T.array[g]=0,o[g*3+1]=-999;continue}let M=d[g]/c[g],A=Math.max(0,1-v*u);l[g*3]*=A,l[g*3+2]*=A,l[g*3+1]=l[g*3+1]*A-y*u,o[g*3]+=l[g*3]*u,o[g*3+1]+=l[g*3+1]*u,o[g*3+2]+=l[g*3+2]*u,w.array[g]=f[g]*(1+_*M),T.array[g]=h[g]*(1-M)*Math.min(1,M*14)}E.needsUpdate=!0,w.needsUpdate=!0,T.needsUpdate=!0},clear(){for(let u=0;u<i;u++)c[u]=0,o[u*3+1]=-999;n.attributes.position.needsUpdate=!0},dispose(){n.dispose(),m.dispose()}}}var Pt={x0:3.8,x1:10.2,z0:-25.1,z1:-17.6,gateZ:-25.6,sill:6.2,travel:2.6,cx:7};function Vd(i){let{mats:e,world:t}=i,n=new rt;n.name="millpond";let s=(w,T,g,M,A,C)=>se(ce(w,T,g,.3),M,A,C),r=[];r.push(s(1.2,17,8.6,3.2,2.6,-21.8),s(1.2,17,8.6,10.8,2.6,-21.8)),r.push(s(2.2,17,1.2,4.3,2.6,Pt.gateZ),s(2.2,17,1.2,9.7,2.6,Pt.gateZ)),r.push(s(4,11.8,1.2,7,.3,Pt.gateZ));let a=new qe(Qe(r),e.stone);a.castShadow=!0,a.receiveShadow=!0,n.add(a);let o=new rt,l=[se(ce(3.2,4,.14,.4),0,0,0)];for(let w=0;w<4;w++)l.push(se(ce(3.2,.16,.3,.4),0,-1.5+w*1,.18));o.add(Object.assign(new qe(Qe(l),e.steel),{castShadow:!0,receiveShadow:!0})),o.add(Object.assign(new qe(Qe([se(tt(.06,.06,7.5,8),-1.2,3.7,0),se(tt(.06,.06,7.5,8),1.2,3.7,0)]),e.iron),{castShadow:!0})),o.position.set(7,Pt.sill+2,Pt.gateZ+.35),n.add(o);let c=[se(ce(5.4,.28,2),7,13.4,Pt.gateZ),se(ce(.5,3.4,.5),4.6,11.7,Pt.gateZ+.5),se(ce(.5,3.4,.5),9.4,11.7,Pt.gateZ+.5),se(ce(.5,3.4,.5),4.6,11.7,Pt.gateZ-.5),se(ce(.5,3.4,.5),9.4,11.7,Pt.gateZ-.5)];n.add(Object.assign(new qe(Qe(c),e.concrete),{castShadow:!0,receiveShadow:!0}));let d=Object.assign(new qe(ce(1.1,.7,.8,.3),e.paintRed),{castShadow:!0});d.position.set(7,13.9,Pt.gateZ),n.add(d);let f=new rt;f.position.set(7,13.9,Pt.gateZ+.5),f.add(new qe(new Zi(.32,.035,8,20),e.steel));for(let w=0;w<4;w++){let T=new qe(tt(.025,.025,.64,5),e.steel);T.rotation.z=w*Math.PI/4,f.add(T)}n.add(f);let h=new On(Pt.x1-Pt.x0,Pt.z1-Pt.z0,1,1);h.rotateX(-Math.PI/2);let m=h.attributes.position.count,x=h.attributes.uv,b=h.attributes.position,p=new Float32Array(m*3),u=new Float32Array(m);for(let w=0;w<m;w++)p[w*3]=1,x.setXY(w,b.getX(w)+Pt.cx,b.getZ(w));h.setAttribute("aTan",new b.constructor(p,3)),h.setAttribute("aFoam",new b.constructor(u,1));let y=di(t.shared,{speed:.12,amp:.7,scale:.16,across:.16,deep:"#0d4a74",shallow:"#2f8aa0",opacity:1,clear:1,edgeFoam:0,transparent:!1,depthWrite:!0}),v=new qe(h,y);v.position.set(Pt.cx,8.6,(Pt.z0+Pt.z1)/2),v.renderOrder=1,n.add(v);let _=[];for(let w=0;w<=10;w++)_.push(new O(7,8.6,xt(Pt.gateZ+.2,Pt.gateZ+4.6,w/10)));let E=new qe(ts(_,3,w=>1-w/12),di(t.shared,{speed:2,amp:1.2,scale:.35,stretch:.6,shallow:"#9fe0e4",deep:"#3a96b4",opacity:.9,clear:.1,edgeFoam:.6,white:.2}));return E.renderOrder=3,E.frustumCulled=!1,n.add(E),n.userData.noReflect=!1,i.scene.add(n),i.parts.millpond=n,i.parts.releaseGate=o,i.parts.releaseWheel=f,i.parts.pondSurface=v,i.extras.push(n),i.hook.push((w,T,g,M)=>{o.position.y=Pt.sill+2+w.relA*Pt.travel,f.rotation.z=w.relA*9*Math.PI,v.position.y=w.pondL;let A=$e(w.Qrel/13,0,1.6);if(E.visible=A>.04&&w.resL>6.4,E.visible){E.position.y=Math.min(w.pondL,w.resL)-8.6+.04;let C=E.material.uniforms;C.uSpeed.value=M?0:1+3*A,C.uFlow.value=.4+.6*Math.min(1,A),C.uOpacity.value=.5+.4*Math.min(1,A*2)}}),n}var Ut={x0:-15.4,x1:-9.6,z0:-5.2,z1:1.6,shaftY:lt.y,shaftZ:lt.z,camX:-12.6};function Gd(i){let{mats:e,em:t}=i,n=new rt;n.name="factory",n.visible=!1;let s=(M,A,C=!0)=>{let I=new qe(M,A);return I.castShadow=C,I.receiveShadow=!0,I},{x0:r,x1:a,z0:o,z1:l}=Ut,c=(r+a)/2,d=(o+l)/2;n.add(s(Qe([se(ce(a-r+.6,.6,l-o+.6,.3),c,.3,d),se(ce(a-r,6.2,.7,.3),c,3.1,o+.35),se(ce(.7,6.2,l-o,.3),r+.35,3.1,d)]),e.stone));let f=[];[[r+.4,l-.4],[a-.4,l-.4],[a-.4,o+.4]].forEach(M=>f.push(se(ce(.36,6.4,.36),M[0],3.4,M[1]))),f.push(se(ce(a-r,.34,.34),c,6.4,l-.4),se(ce(.34,.34,l-o),a-.4,6.4,d)),n.add(s(Qe(f),e.woodDark));let h=s(ce(a-r+1.6,.3,l-o+1.6,.3),e.roof);h.rotation.z=-.1,h.position.set(c,7,d),n.add(h);let m=s(Qe([se(tt(.62,.78,9.4,14),0,4.7,0),se(tt(.8,.8,.5,14),0,9.5,0)]),new ft({color:9128504,roughness:.95}));m.position.set(r+1.6,0,o+1.4),n.add(m);let x=new rt;x.position.set(0,Ut.shaftY,Ut.shaftZ);let b=Ut.camX-1.4,p=0;x.add(s(se(tt(.15,.15,p-b,12),(b+p)/2,0,0,0,0,Math.PI/2),e.iron));let u=[se(tt(.34,.34,1.3,16),Ut.camX,0,0,0,0,Math.PI/2)];for(let M=0;M<4;M++){let A=M*Math.PI/2,C=ce(.4,.34,.22,1);C.translate(0,.46,0),C.rotateX(A),C.translate(Ut.camX,0,0),u.push(C)}x.add(s(Qe(u),e.iron)),n.add(x),n.add(s(Qe([-3,-6.4,-9.4].map(M=>se(ce(.7,.9,.9,1),M,Ut.shaftY-.6,Ut.shaftZ)).concat([se(ce(.7,.9,.9,1),Ut.camX-1.3,Ut.shaftY-.6,Ut.shaftZ)])),e.stone));let y=new rt;y.position.set(Ut.camX,1.9,Ut.shaftZ+1.7);let v=s(ce(.3,.3,4.4,.5),e.wood);v.position.set(0,0,-.6),y.add(v);let _=s(ce(.7,.8,.9,1),e.iron);_.position.set(0,-.15,1.65),y.add(_),n.add(y),n.add(s(Qe([se(ce(.5,2.3,.5,1),Ut.camX,.9+.2,Ut.shaftZ+1.7+0),se(ce(1,.9,1.4,1),Ut.camX,.55+0,Ut.shaftZ+3.35+0)]),e.iron));let E=[];for(let M=0;M<10;M++){let A=s(ce(2.4,.12,.7,1),e.wood);A.position.set(6+M%2*.05,.1+.13*M,4.6),A.visible=!1,E.push(A),n.add(A)}i.scene.add(n),i.parts.factory=n,i.parts.hammer=y,i.extras.push(n);let w=0,T=0,g=0;return i.pickables=i.pickables||[],i.hook.push((M,A,C,I)=>{let P=M.M>=3;if(n.visible=P,!P)return;x.rotation.x=i.mach.drive.rotation.x;let L=Math.abs(i.mach.drive.rotation.x),F=x.rotation.x,N=M.as[2]&&M.run[2],B=M.as[2]?Math.sin(F*4):0,Z=M.as[2]?$e(B,0,1):0;if(y.rotation.x=-.52*(I?N?.3:0:Math.pow(Z,.6)),!I&&M.as[2]&&T>.05&&B<=.05&&N)for(let Q=0;Q<6;Q++)t.spark.emit(Ut.camX+(Math.random()-.5)*.6,1.4,Ut.shaftZ+3.2,(Math.random()-.5)*3,2+Math.random()*2.5,1.5+Math.random()*2,.5,.06,.9);T=B,!I&&M.as.some(Boolean)&&Math.random()<A*(6+24*$e(M.units/80,0,1)+10*(M.run[2]?1:0))&&t.smoke.emit(r+1.6+(Math.random()-.5)*.4,10,o+1.4+(Math.random()-.5)*.4,.5+Math.random()*.6,1.4+Math.random(),(Math.random()-.5)*.4,3,.7,.34);let Y=Math.min(10,Math.floor(M.units/6));Y!==g&&(E.forEach((Q,q)=>Q.visible=q<Y),g=Y)}),n}var Dt={x:-1.5,z:15.5,sc:.4,w:2.6,rows:5,k:1.55},ta=-3,__=10.2;function Hd(i){let{mats:e}=i,t=new rt;t.name="damLab",t.visible=!1,t.position.set(Dt.x,0,Dt.z),t.scale.setScalar(Dt.k);let n=(T,g,M=!0)=>{let A=new qe(T,g);return A.castShadow=M,A.receiveShadow=!0,A},s=Dt.sc,r=s*1.6,a=(__-ta)*s,o=.55;t.add(n(Qe([se(ce(5.6,o,5.8,.3),0,o/2,0),se(ce(5.9,.16,6.1,.3),0,.08,0)]),e.stone));let l=new rt;l.position.y=o,t.add(l);let c=new ft({map:i.T.concrete.map,normalMap:i.T.concrete.normal,color:14999768,roughness:.9}),d=n(new mn(.01,.01,.01),c);l.add(d);let f=new ft({color:3843792,roughness:.08,metalness:0,transparent:!0,opacity:.55,envMapIntensity:1.4}),h=new qe(new mn(Dt.w,1,2.6),f);h.castShadow=!1,l.add(h);let m=tt(.15,.15,1,10),x=new Xi(.4,.62,12);m.translate(0,.5,0),x.translate(0,1.31,0);let b=[],p=new ft({color:16752114,emissive:15929530,emissiveIntensity:.65,roughness:.5});for(let T=0;T<Dt.rows;T++){let g=new rt;g.add(n(m,p,!1),n(x,p,!1)),g.rotation.x=Math.PI/2,l.add(g),b.push(g)}let u=[];for(let T=0;T<Dt.rows;T++){let g=new qe(new mn(Dt.w+.4,.5,2.4),new Wi({visible:!1}));g.userData.row=T,l.add(g),u.push(g)}let y=new ft({color:10479359,roughness:.05,transparent:!0,opacity:.8}),v=new qe(new mn(Dt.w*.7,.05,.5),y);v.visible=!1,l.add(v),i.scene.add(t),i.parts.damLab=t,i.extras.push(t);let _={group:t,hits:u,th:[0,0,0,0,0],need:[4,4,3,2,1],lev:0,fail:-1,show:!1},E=()=>{let T=_.th.map(C=>1.8+1.7*C),g=-1.3,M=C=>(jt[C]-ta)*s,A=[[g,0],[g,a]];for(let C=4;C>=0;C--)A.push([g+T[C]*r,C===4?a:M(C+1)],[g+T[C]*r,M(C)]);return A.push([g+T[0]*r,0]),A};_.rebuild=()=>{let T=new xn;E().forEach((C,I)=>I?T.lineTo(C[0],C[1]):T.moveTo(C[0],C[1]));let M=new oi(T,{depth:Dt.w,bevelEnabled:!1});M.rotateY(-Math.PI/2),M.translate(Dt.w/2,0,0),M.attributes.uv.array.forEach((C,I,P)=>P[I]=C*.6);let A=d.geometry;d.geometry=M,A.dispose();for(let C=0;C<Dt.rows;C++){let I=((jt[C]+jt[C+1])/2-ta)*s;u[C].position.set(0,I,-.3),u[C].scale.set(1,(jt[C+1]-jt[C])*s/.5,1)}},_.update=T=>{let g=$e(T,0,Dt.rows),M=g/Dt.rows*a;h.scale.y=Math.max(.001,M),h.position.set(0,M/2,-1.3-1.3);for(let A=0;A<Dt.rows;A++){let C=((jt[A]+jt[A+1])/2-ta)*s,I=Math.max(0,M-C),P=b[A];P.visible=I>.02;let L=.25+I*1.9;P.scale.set(1,L,1),P.position.set(0,C,-1.3-L-.34),P.children.forEach(F=>{F.material=A===_.fail?w:p})}if(v.visible=_.fail>=0,_.fail>=0){let A=((jt[_.fail]+jt[_.fail+1])/2-ta)*s;v.position.set(0,A,-1.3+(1.8+1.7*_.th[_.fail])*r+.2)}d.material.color.setHex(_.fail>=0?15775704:14999768)};let w=new ft({color:16726890,emissive:16718421,emissiveIntensity:.9,roughness:.4});return _.rebuild(),_.update(0),_}var Mn={x0:40.2,x1:50.8,z0:-69,z1:-33,top:25},v_=(i,e)=>[49.4-(e-36)/178*8.6,-51-(i-180)*.115],y_={1:{nodes:{src:["src",180,36],F1:["fork",180,104,["T1","T2"],0],T1:["tgt",84,208,"RESERVOIR"],T2:["tgt",276,208,"TERRACES"]},route0:{F1:0}},2:{nodes:{src:["src",180,36],F1:["fork",150,92,["T1","F2"],2],F2:["fork",250,140,["T2","D1"],2],T1:["tgt",70,208,"RESERVOIR"],T2:["tgt",206,214,"TERRACES"],D1:["drain",314,214,"SCREE"]},route0:{F1:0,F2:0}},3:{nodes:{src:["src",180,36],F1:["fork",180,84,["F2","F3"],0],F2:["fork",96,136,["T1","D1"],2],F3:["fork",264,136,["T2","T3"],0],T1:["tgt",54,214,"RESERVOIR"],D1:["drain",138,218,"SCREE"],T2:["tgt",222,214,"TERRACES"],T3:["tgt",308,214,"VILLAGE WELL"]},route0:{F1:0,F2:0,F3:0}}};function Wd(i){let{mats:e,world:t}=i,n=new rt;n.name="source",i.scene.add(n),i.extras.push(n);let s=(E,w,T=!0)=>{let g=new qe(E,w);return g.castShadow=T,g.receiveShadow=!0,g},{x0:r,x1:a,z0:o,z1:l,top:c}=Mn,d=(o+l)/2;n.add(s(Qe([se(ce(a-r,c-6,l-o,.3),(r+a)/2,(c+6)/2,d)]),e.stone)),n.add(s(ce(a-r-.2,.12,l-o-.2,.3),new ft({color:5195320,roughness:1}))),n.children[n.children.length-1].position.set((r+a)/2,c+.02,d),n.add(s(Qe([se(ce(.5,.9,l-o,.3),r+.25,c+.45,d),se(ce(a-r,.9,.5,.3),(r+a)/2,c+.45,o+.25),se(ce(a-r,.9,.5,.3),(r+a)/2,c+.45,l-.25)]),e.concrete));let f=Ni(11),h=new Yi(1,1),m=[];for(let E=0;E<6;E++){let w=h.clone();w.scale(1.2+f()*1.2,.9+f()*.8,1.2+f()*1.2),w.translate(50.4+(f()-.5)*2.2,c+.6+f()*.8,-50+(f()-.5)*3.4),m.push(w)}n.add(s(Qe(m),new ft({color:8222316,roughness:.95})));let x=s(new Vt(1.1,1.1,.12,20),new ft({color:5228512,roughness:.05,transparent:!0,opacity:.85}),!1);x.position.set(49.6,c+1.3,-50),n.add(x);let b=new rt;n.add(b);let p={group:n,layout:0,nodes:{},edges:[],flaps:{},hits:[],basins:{},drains:{},fall:null,state:{route:{},flows:{},fill:{},lake:0}},u=()=>{for(b.traverse(E=>{E.geometry&&E.geometry.dispose(),E.material&&E.material.dispose&&E.material.dispose()});b.children.length;)b.remove(b.children[0])},y=E=>di(t.shared,E);p.setLayout=E=>{u(),p.layout=E,p.nodes={},p.edges=[],p.flaps={},p.hits=[],p.basins={},p.drains={},p.fall=null;let w=y_[E],T=p.nodes,g=c+.02;Object.keys(w.nodes).forEach(C=>{let I=w.nodes[C],[P,L]=v_(I[1],I[2]);T[C]={id:C,t:I[0],x:P,z:L,o:I[0]==="fork"?I[3]:null,name:I[0]==="tgt"||I[0]==="drain"?I[3]:null,m:I[0]==="fork"?I[4]:0}}),T.src.o=[Object.keys(T).find(C=>T[C].t==="fork")];let M=[];Object.keys(T).forEach(C=>(T[C].o||[]).forEach(I=>{let P=T[C],L=T[I],F=L.x-P.x,N=L.z-P.z,B=Math.hypot(F,N),Z=Math.atan2(F,N);[se(ce(1.7,.14,B,.4),0,.07,0),se(ce(.2,.62,B,.4),-.75,.31,0),se(ce(.2,.62,B,.4),.75,.31,0)].forEach(q=>{q.rotateY(Z),q.translate((P.x+L.x)/2,g,(P.z+L.z)/2),M.push(q)});let Y=[];for(let q=0;q<=8;q++)Y.push(new O(xt(P.x,L.x,q/8),g+.3,xt(P.z,L.z,q/8)));let Q=new qe(ts(Y,1.15,q=>q<2?.7:.15),y({speed:1,amp:1,scale:.4,stretch:.6,shallow:"#8fe0e8",deep:"#2a86a8",opacity:.9,clear:.2,edgeFoam:.5}));Q.frustumCulled=!1,Q.renderOrder=3,b.add(Q),p.edges.push({a:C,b:I,rib:Q})})),M.length&&b.add(s(Qe(M),e.concrete)),Object.keys(T).forEach(C=>{let I=T[C];if(I.t==="fork"){let P=s(ce(2.6,.9,2.6,.4),e.stone);P.position.set(I.x,g+.45,I.z),b.add(P);let L=new rt;L.position.set(I.x,g+1.15,I.z),L.add(s(ce(.22,.14,2,.5),e.woodDark),s(tt(.22,.22,.28,12),e.brass,!1)),b.add(L),p.flaps[C]=L;let F=new qe(new Vt(1.5,1.5,1.6,10),new e.dark.constructor({visible:!1,transparent:!0,opacity:0}));F.position.set(I.x,g+.9,I.z),F.userData.fork=C,b.add(F),p.hits.push(F)}else if(I.t==="tgt"){let F=s(Qe([se(ce(4.2,.2,4.2,.4),0,.1,0),se(ce(4.2,1.3,.4,.4),0,.65,1.9000000000000001),se(ce(4.2,1.3,.4,.4),0,.65,-1.9000000000000001),se(ce(.4,1.3,4.2,.4),1.9000000000000001,.65,0),se(ce(.4,1.3,4.2,.4),-1.9000000000000001,.65,0)]),e.stone);F.position.set(I.x,g,I.z),b.add(F);let N=new On(4.2-.8,4.2-.8);N.rotateX(-Math.PI/2);let B=N.attributes.position.count,Z=new Float32Array(B*3),Y=new Float32Array(B);for(let q=0;q<B;q++)Z[q*3]=1,N.attributes.uv.setXY(q,N.attributes.position.getX(q)+I.x,N.attributes.position.getZ(q)+I.z);N.setAttribute("aTan",new N.attributes.position.constructor(Z,3)),N.setAttribute("aFoam",new N.attributes.position.constructor(Y,1));let Q=new qe(N,y({speed:.1,amp:.6,scale:.3,across:.3,deep:"#0d4a74",shallow:"#3da0b8",opacity:1,clear:1,edgeFoam:0,transparent:!1,depthWrite:!0}));Q.position.set(I.x,g+.25,I.z),b.add(Q),p.basins[C]={wp:Q,y0:g+.25,y1:g+1.15}}else if(I.t==="drain"){let P=s(new Vt(1.5,1.7,.3,14),new ft({color:1382172,roughness:1}),!1);P.position.set(I.x,g+.15,I.z),b.add(P);let L=s(Qe([0,1,2,3].map(F=>se(ce(2.6,.06,.1,1),0,0,-.9+F*.6))),e.iron);L.position.set(I.x,g+.32,I.z),b.add(L),p.drains[C]={x:I.x,z:I.z}}});let A=T.T1;if(A){let C=[A.x-2.2,g+.3,A.z],I=s(ce(2.4,.7,1.8,.4),e.stone);I.position.set(C[0]-.4,g+.35,C[2]),b.add(I);let P=dl(Mn.x0-.5,A.z,c);if(P.length>3){let L=[new O(C[0]-.4,g+.6,C[2])].concat(P.map(N=>new O(N[0],N[1]+.05,N[2]))),F=new qe(ts(L,(N,B)=>xt(1.6,3.4,B),(N,B)=>.4+.5*B,new O(0,0,1)),y({speed:2.6,amp:1.2,scale:.25,stretch:.5,across:2.2,shallow:"#dff6fa",deep:"#9fd4e6",opacity:.92,clear:.1,edgeFoam:.9,white:.35}));F.frustumCulled=!1,F.renderOrder=3,b.add(F),p.fall={mesh:F,base:L[L.length-1]}}}p.apply(p.state)},p.apply=E=>{p.state=E};let v=[.6,0,-.6],_=new Ji(16771528,0);return _.position.set(Mn.x0-40,Mn.top+34,(Mn.z0+Mn.z1)/2+12),_.target.position.set((Mn.x0+Mn.x1)/2,Mn.top,(Mn.z0+Mn.z1)/2),i.scene.add(_,_.target),i.extras.push(_),i.hook.push((E,w,T,g,M)=>{let A=p.state,C=A.Qmax||12,I=i.em;if(_.intensity+=((i.shotName()==="source"?2.6:0)-_.intensity)*Math.min(1,w*4),p.edges.forEach(P=>{let L=A.edge&&A.edge[P.a+">"+P.b]||0,F=P.rib.material.uniforms,N=$e(L/C,0,1);P.rib.visible=N>.01,F.uSpeed.value=g?0:.6+2.4*N,F.uFlow.value=.3+.7*N,P.rib.scale.x=.5+.5*Math.sqrt(N)}),Object.keys(p.flaps).forEach(P=>{let L=p.flaps[P],F=v[p.nodes[P].m];L.rotation.y+=(F-L.rotation.y)*Math.min(1,w*8)}),Object.keys(p.basins).forEach(P=>{let L=p.basins[P],F=$e(A.fill&&A.fill[P]||0,0,1);L.wp.position.y=xt(L.y0,L.y1,F)}),p.fall){let P=$e((A.fall!=null?A.fall:A.edge&&A.edge["F1>T1"]||0)/C,0,1);p.fall.mesh.visible=P>.02;let L=p.fall.mesh.material.uniforms;if(L.uSpeed.value=g?0:1.6+3*P,L.uFlow.value=.3+.7*P,p.fall.mesh.scale.x=.4+.6*Math.sqrt(P),!g&&P>.05){let F=P*30*w,N=Math.floor(F)+(Math.random()<F-Math.floor(F)?1:0);for(let B=0;B<N;B++)I.mist.emit(p.fall.base.x+(Math.random()-.5)*3,E.resL+.4,p.fall.base.z+(Math.random()-.5)*3,(Math.random()-.5)*.6,.8+Math.random(),(Math.random()-.5)*.6,2.4,1,.3)}}Object.keys(p.drains).forEach(P=>{let L=A.drain&&A.drain[P]||0;if(!g&&L>.1){let F=L*6*w,N=Math.floor(F)+(Math.random()<F-Math.floor(F)?1:0);for(let B=0;B<N;B++)I.spray.emit(p.drains[P].x+(Math.random()-.5)*2,c+.5,p.drains[P].z+(Math.random()-.5)*2,(Math.random()-.5)*1.5,1.2+Math.random(),(Math.random()-.5)*1.5,.6,.12,.6)}}),x.scale.y=1+.2*Math.sin(T*3)}),p.setLayout(1),i.source=p,i.parts.source=n,p}function xl(i,e){let t=i.nodes,n={},s={},r={};return(function a(o,l){let c=t[o];if(c.t==="fork"){let d=c.m===0?l:c.m===1?l/2:0,f=l-d;n[o+">"+c.o[0]]=d,n[o+">"+c.o[1]]=f,a(c.o[0],d),a(c.o[1],f)}else c.t==="src"?(n["src>"+c.o[0]]=l,a(c.o[0],l)):(c.t==="drain"&&(r[o]=l),s[o]=l)})("src",e),{edge:n,flows:s,drain:r}}var oh=i=>i*i*(3-2*i),is=i=>1+2.5*Math.pow(i-1,3)+1.5*Math.pow(i-1,2),ss=(i,e,t)=>$e((i-e)/(t-e),0,1),rs={wheel:{target:[2,7.2,-9],dir:[.5,.16,.85],tall:56,wide:34},lab:{target:[-1.5,4.3,15.5],dir:[.88,.26,-.38],tall:24,wide:17},gate:{target:[7,9,-13],dir:[.3,.24,.92],tall:38,wide:25},dam:{target:[2,5.5,-13],dir:[.38,.12,.92],tall:62,wide:40},lake:{target:[0,9,-42],dir:[.08,.3,.95],tall:74,wide:48},source:{target:[44.5,24,-50],dir:[-.5,.8,.3],tall:58,wide:40},factory:{target:[-6,3.6,-1],dir:[.36,.28,.89],tall:52,wide:40},ocean:{target:[5,0,74],dir:[0,.46,-.89],tall:104,wide:70}};function Xd(i){let e=rs,{canvas:t,stageEl:n,kit:s,level:r}=i,a=i.up,o=()=>s.reduced(),l=r>=6?2:r>=3?1:0,c=Fd(t,{tier:l,quality:i.quality}),{scene:d,camera:f,renderer:h,sun:m,q:x}=c,b=c.arch.M,p=c.T,u=c.arch.parts,y=zd(b,p,l,a.bear);d.add(y.root);let v=x==="low"?1:x==="high"?3:2,_={spray:Ui(160*v,"#f4fbff"),mist:Ui(90*v,"#e4eef4"),dust:Ui(90*v,"#f6efdc"),chips:Ui(60*v,"#d8b88a"),rain:Ui(120*v,"#d6e6ff"),smoke:Ui(70*v,"#7d7f88"),spark:Ui(50*v,"#ffb050")};Object.values(_).forEach(M=>{d.add(M.points),M.mat.uniforms.uScale.value=600}),_.rain.mat.uniforms.uScale.value=260,_.spark.mat.uniforms.uScale.value=380;let E=kd(c,y.drive);d.add(E.group),[[-2.6,Xt.floorY+2.7,-3.5],[-6,Xt.floorY+2.7,-3.5],[-4.2,3.7,-3],[Ze.blade+.4,3.4,Ze.z+1.6]].forEach(M=>{let A=new qe(new li(.15,10,8),b.glass);A.position.set(M[0],M[1],M[2]);let C=new qe(new Vt(.015,.015,1.2,4),b.dark);C.position.set(M[0],M[1]+.7,M[2]),d.add(A,C)});let T=new Fr(16758886,0,26,1.6);T.position.set(-3.2,Xt.floorY+3,-3),d.add(T);let g={world:c,scene:d,camera:f,renderer:h,sun:m,q:x,mats:b,T:p,parts:u,mach:y,em:_,rig:E,lamp:T,tierN:l,env:i,extras:[],hotList:[],pickList:[],onTap:null};return g.hook=[],Vd(g),Gd(g),g.lab=Hd(g),Wd(g),g.vs={gateA:0,relA:1,Qrel:0,resL:9,pondL:9,Qg:0,Qref:13,spill:0,Qriver:0,rpm:0,as:[!1,!1,!1],run:[!1,!1,!1],M:2,P:0,D:0,units:0,rain:0},g}function qd(i){let{world:e,scene:t,camera:n,renderer:s,sun:r,q:a,parts:o,mach:l,em:c,rig:d,lamp:f,env:h}=i,m=h.kit,x=()=>m.reduced(),b=h.canvas,p=h.stageEl,u=i.vs,y=new O;try{Bd(e,[d.group,c.spray.points,c.mist.points,c.dust.points,c.chips.points,c.rain.points,c.smoke.points,c.spark.points,...i.extras.filter(U=>U&&U.userData&&U.userData.noReflect)])}catch(U){console.warn("[DamBuilder3D] reflection bake skipped: "+(U&&U.message))}let v={yaw:0,pitch:0,yawT:0,pitchT:0,hold:0,intro:0,celeb:0},_={target:new O(...rs.wheel.target),dir:new O(...rs.wheel.dir).normalize(),tall:rs.wheel.tall,wide:rs.wheel.wide},E={target:new O,dir:new O,tall:0,wide:0},w="wheel",T=1,g=null,M=0,A=!0,C=0,I=!1,P={t0:performance.now(),last:0,dts:[],lost:0,builtMs:i.buildMs||null},L=3600;function F(){let U=performance.now();if(P.last){let k=U-P.last;k>0&&k<1e3&&(P.dts.push(k),P.dts.length>L&&P.dts.shift())}P.last=U}if(e.lost.push(()=>{P.lost++}),i.perfReport=()=>{let U=P.dts.slice().sort((me,z)=>me-z),k=U.length,re=me=>k?U[Math.min(k-1,Math.floor(me*k))]:null,ue=k?U.reduce((me,z)=>me+z,0)/k:null,de=s.getContext().getExtension("WEBGL_debug_renderer_info");return{frames:k,fps:ue?+(1e3/ue).toFixed(1):null,p50ms:re(.5)&&+re(.5).toFixed(1),p95ms:re(.95)&&+re(.95).toFixed(1),p99ms:re(.99)&&+re(.99).toFixed(1),worstMs:k?+U[k-1].toFixed(1):null,over16:k?+(U.filter(me=>me>16.9).length/k*100).toFixed(1):null,over33:k?+(U.filter(me=>me>33.5).length/k*100).toFixed(1):null,quality:a,dpr:+Ve.toFixed(2),devicePixelRatio:window.devicePixelRatio,viewport:[innerWidth,innerHeight],canvas:[b.width,b.height],draw:s.info.render.calls,tris:s.info.render.triangles,geoms:s.info.memory.geometries,textures:s.info.memory.textures,shadows:!!r.castShadow,contextLost:P.lost,gpu:de?s.getContext().getParameter(de.UNMASKED_RENDERER_WEBGL):"unavailable",vendor:de?s.getContext().getParameter(de.UNMASKED_VENDOR_WEBGL):"unavailable",jsHeapMB:performance.memory?+(performance.memory.usedJSHeapSize/1048576).toFixed(1):null,cores:navigator.hardwareConcurrency||null,deviceMemoryGB:navigator.deviceMemory||null,saveData:!!(navigator.connection&&navigator.connection.saveData),reducedMotion:x(),buildMs:P.builtMs,seconds:+((performance.now()-P.t0)/1e3).toFixed(1),ua:navigator.userAgent}},i.perfReset=()=>{P.dts.length=0,P.last=0,P.t0=performance.now()},/[?&]b3dperf=1/.test(location.search)){let U=document.createElement("div");U.setAttribute("style","position:absolute;left:6px;top:6px;z-index:9;padding:4px 7px;border-radius:8px;background:rgba(0,0,0,.72);color:#9fe;font:700 10px/1.3 monospace;pointer-events:auto;white-space:pre");let k=document.createElement("button");k.type="button",k.textContent="COPY REPORT",k.setAttribute("style","display:block;margin-top:3px;min-height:32px;padding:0 8px;font:700 10px monospace;border-radius:6px;border:1px solid #2fd2ff;background:#06070d;color:#fff");let re=document.createElement("span");U.appendChild(re),U.appendChild(k),p.appendChild(U),k.addEventListener("click",de=>{de.stopPropagation();let me=JSON.stringify(i.perfReport(),null,1);try{navigator.clipboard.writeText(me)}catch{}window.__damPerf=me,k.textContent="COPIED (also window.__damPerf)",setTimeout(()=>k.textContent="COPY REPORT",1800)});let ue=setInterval(()=>{if(!U.isConnected){clearInterval(ue);return}let de=i.perfReport();re.textContent=(de.fps||"\u2013")+" fps  p95 "+(de.p95ms||"\u2013")+` ms
`+de.quality+"  dpr "+de.dpr+"  "+de.draw+" calls"},500)}i.shots=rs,i.shotName=()=>w,i.setShot=(U,k)=>{let re=rs[U];!re||U===w&&T>=1||(w=U,E.target.copy(_.target),E.dir.copy(_.dir),E.tall=_.tall,E.wide=_.wide,i._to={target:new O(...re.target),dir:new O(...re.dir).normalize(),tall:re.tall,wide:re.wide},T=k||x()?1:0,T===1&&N(1),A=!0)};function N(U){let k=oh(U),re=i._to;_.target.lerpVectors(E.target,re.target,k),_.dir.lerpVectors(E.dir,re.dir,k).normalize(),_.tall=xt(E.tall,re.tall,k),_.wide=xt(E.wide,re.wide,k)}function B(U){T<1&&(T=Math.min(1,T+U/1.7),N(T));let k=n.aspect,re=xt(_.tall,_.wide,$e((k-.6)/1.4,0,1)),ue=v.celeb?oh($e(v.celeb/1.6,0,1)):0,de=x()||i.introDone?1:oh($e(v.intro/3,0,1)),me=re*(1-.22*ue)*xt(1.5,1,de);v.hold=Math.max(0,v.hold-U),v.hold===0&&!g&&(v.yawT*=Math.pow(.35,U),v.pitchT*=Math.pow(.35,U)),v.yaw+=(v.yawT-v.yaw)*Math.min(1,U*6),v.pitch+=(v.pitchT-v.pitch)*Math.min(1,U*6);let z=x()?0:Math.sin(M*.23)*.035,ht=Math.atan2(_.dir.x,_.dir.z)+v.yaw+z+(1-de)*.6-ue*.2,it=Math.asin(_.dir.y)+v.pitch+(1-de)*.32-ue*.04,D=Math.cos(it),S=_.target;n.position.set(S.x+Math.sin(ht)*D*me,S.y+Math.sin(it)*me,S.z+Math.cos(ht)*D*me);let H=S.y+(k<1?xt(2,0,$e((k-.5)/.5,0,1)):0);n.lookAt(S.x-ue*3.2,H,S.z+ue*.8)}i.cam=v,i.introDone=!!h.keepIntro,i.setHot=U=>{i.hotList.forEach(k=>k.b.remove()),i.hotList=[],(U||[]).forEach(k=>{let re=document.createElement("button");re.type="button",re.className="db3dHot"+((k.pill!=null?k.pill:String(k.label).length>4)?" pill":""),re.innerHTML="<i></i><span>"+k.label+"</span>",re.setAttribute("aria-label",k.aria||k.label),re.addEventListener("click",ue=>{ue.stopPropagation(),k.fn()}),p.appendChild(re),i.hotList.push({b:re,anchor:k.anchor,state:k.state,text:k.text,span:re.querySelector("span"),k:k.label})})};let Z=new Or,Y=new ye;function Q(U){let k=b.getBoundingClientRect();Y.set((U.clientX-k.left)/k.width*2-1,-((U.clientY-k.top)/k.height)*2+1),Z.setFromCamera(Y,n);let re=i.pickList.map(de=>de.object).filter(Boolean),ue=Z.intersectObjects(re,!0);if(ue.length)for(let de=ue[0].object;de;de=de.parent){let me=i.pickList.find(z=>z.object===de);if(me){i.onTap&&i.onTap(me.id,U,ue[0]);return}}}b.addEventListener("pointerdown",U=>{g={x:U.clientX,y:U.clientY,moved:!1,yaw:v.yawT,pitch:v.pitchT,t:performance.now()};try{b.setPointerCapture(U.pointerId)}catch{}}),b.addEventListener("pointermove",U=>{if(!g)return;let k=U.clientX-g.x,re=U.clientY-g.y;Math.abs(k)+Math.abs(re)>9&&(g.moved=!0),g.moved&&(v.yawT=$e(g.yaw-k*.005,-.5,.5),v.pitchT=$e(g.pitch+re*.003,-.16,.22),v.hold=3,A=!0)}),b.addEventListener("pointerup",U=>{g&&!g.moved&&performance.now()-g.t<600&&(!i.introDone&&!x()?v.intro=Math.max(v.intro,3.2):Q(U)),g=null}),b.addEventListener("pointercancel",()=>{g=null});let q=document.createElement("div");q.className="db3dAdvice",q.setAttribute("role","status"),q.setAttribute("aria-live","polite"),q.hidden=!0,p.appendChild(q);let _e=document.createElementNS("http://www.w3.org/2000/svg","svg");_e.setAttribute("class","db3dFc"),_e.setAttribute("viewBox","0 0 100 34"),_e.setAttribute("aria-label","Rain forecast"),_e.style.cssText="width:128px;height:44px;display:none",_e.innerHTML='<rect x="0" y="0" width="100" height="34" rx="6" fill="rgba(6,7,13,.7)" stroke="#6a72d8"/><text x="50" y="9" text-anchor="middle" font-size="5.2" font-weight="800" fill="#9bdcf2" font-family="system-ui">RAIN FORECAST \xB7 NEXT 14 s</text><polyline points="" fill="none" stroke="#2fd2ff" stroke-width="1.6" stroke-linejoin="round"/><line x1="6" x2="6" y1="12" y2="31" stroke="#ff9df2" stroke-width="1"/>',p.appendChild(_e);let pe="";i.setAdvice=U=>{if(!U){q.hidden=!0,pe="";return}let k=U.tone+"|"+U.text;k!==pe&&(pe=k,q.hidden=!1,q.className="db3dAdvice "+U.tone,q.textContent=U.text)},i.setForecast=(U,k,re=14,ue=0,de=1)=>{if(!U){_e.style.display="none";return}_e.style.display="block";let me="";for(let z=0;z<=28;z++){let ht=U(k+z*re/28);me+=(6+z*3.3).toFixed(1)+","+(31-$e((ht-ue)/(de-ue),0,1)*17).toFixed(1)+" "}_e.querySelector("polyline").setAttribute("points",me)};let Ve=Math.min(window.devicePixelRatio||1,a==="high"?2:a==="medium"?1.5:1),We=0;function je(){let U=p.getBoundingClientRect();Od(e,Math.max(160,Math.round(U.width)),Math.max(120,Math.round(U.height)),Ve),A=!0}let te=new ResizeObserver(je);te.observe(p),je(),e.lost.push(()=>{h.onLost&&h.onLost()}),i.size=je,i.dirty=()=>{A=!0},i.skipIntro=()=>{v.intro=4,A=!0},i.celebrate=()=>{I=!0,v.celeb=.001,A=!0;for(let U=0;U<40&&!x();U++)c.dust.emit(-3+Math.random()*6,Xt.floorY+1+Math.random()*2,-3+Math.random()*3,(Math.random()-.5)*1.5,.8+Math.random(),Math.random()-.5,2.4,.7,.5)},i.endCelebrate=()=>{I=!1,v.celeb=0},i.project=(U,k,re)=>{let ue=new O(U,k,re).project(n),de=b.getBoundingClientRect();return[de.left+(ue.x*.5+.5)*de.width,de.top+(-ue.y*.5+.5)*de.height]},i.pixels=()=>{let U=s.getContext(),k=24,re=new Uint8Array(4),ue=[];for(let de=1;de<k;de++)for(let me=1;me<k;me++)U.readPixels(Math.floor(U.drawingBufferWidth*me/k),Math.floor(U.drawingBufferHeight*de/k),1,1,U.RGBA,U.UNSIGNED_BYTE,re),ue.push([re[0],re[1],re[2]]);return ue},i.info=()=>({info:s.info.render,mem:s.info.memory,quality:a,dpr:Ve}),i.state={get introAll(){return x()?1:$e(v.intro/3.2,0,1)},get time(){return M}};let ie=(U,k,re=-1)=>{U.scale.y=Math.max(.001,k),U.position.y=re*(1-k)};function ge(U,k){if(k||i.introDone){i._built||([o.dam,o.flume,o.tailrace,o.mill].forEach(ue=>{ue.scale.set(1,1,1),ue.position.set(0,0,0),ue.visible=!0}),o.gateHouse.position.y=0,o.gateHouse.visible=!0,l.drive.scale.setScalar(1),l.drive.visible=!0,l.lantern.scale.setScalar(1),l.lever.visible=!0,l.root.visible=!0,i._built=!0);return}ie(o.dam,is(ss(U,.1,1.1)),-7),o.gateHouse.position.y=(1-is(ss(U,.9,1.7)))*10,o.gateHouse.visible=U>.9,ie(o.flume,is(ss(U,1.2,2)),0),o.flume.visible=U>1.2,ie(o.tailrace,is(ss(U,1.4,2.1)),-1),o.tailrace.visible=U>1.4,ie(o.mill,is(ss(U,1.5,2.4)),0),o.mill.visible=U>1.5;let re=is(ss(U,1.9,2.8));l.drive.scale.setScalar(Math.max(.001,re)),l.drive.visible=U>1.9,l.lantern.scale.setScalar(Math.max(.001,is(ss(U,2.1,2.9)))),l.lever.visible=U>2.2,l.root.visible=U>2}ge(0,x());let Ge=0,xe=0,Fe=Ze.fastX,Pe=0,$=0,ae=0,W=0;return i.vis={get lift(){return xe},get beltX(){return Fe},get saw(){return u.M>=2?l.arbor.rotation.x:null}},i.frame=function(U){F(),U=Math.min(U,.1),M+=U,!i.introDone&&(x()||(!h.isPlaying||h.isPlaying()))&&(v.intro+=U*(h.fast?2.6:1));let k=x(),re=u.rpm*.2,ue=re*Math.PI*2/60,de=k?1:$e(v.intro/3.2,0,1);if(de>=1&&(i.introDone=!0),I&&(v.celeb+=U),k){if(!A&&M-C<.25)return;l.drive.rotation.x=-re*.9}else l.drive.rotation.x-=ue*U;o.gate.position.y=ns+1.6+u.gateA*Pd,o.handwheel.rotation.z=u.gateA*9*Math.PI;let me=u.as[0]?1:0;if(xe+=((1-me)*.62-xe)*Math.min(1,U*4),l.lantern.position.y=xe,Pe+=((me?1:-1)*.5-Pe)*Math.min(1,U*6),l.lever.rotation.z=Pe,W=me?ue*(on.crownN/on.lanternN):W*Math.pow(.15,U),l.lantern.rotation.y+=(k?0:W)*U,k&&me&&(l.lantern.rotation.y=re*1.7),l.sawGroup.visible=u.M>=2,u.M>=2){let S=u.as[1]?1:0;Fe+=((S?Ze.fastX:Ze.looseX)-Fe)*Math.min(1,U*5),l.belt.position.x=Fe;let H=.78/Ze.pulleyR;$=S?ue*H:$*Math.pow(.2,U),l.arbor.rotation.x-=(k?0:$)*U,k&&S&&(l.arbor.rotation.x=-re*3),k||(l.beltTex.offset.y-=ue*.78/1.2*U);let X=l.log;S&&u.run[1]&&(ae+=U*.16*(u.P/Math.max(u.D,1)),ae>3.2&&(ae=0)),X.position.x=6.1-ae,!k&&S&&u.run[1]&&Math.random()<U*40&&ae>1.3&&c.chips.emit(Ze.blade+.1,Ze.y+.5,Ze.z+.2,1.4+Math.random(),1.5+Math.random()*1.5,(Math.random()-.5)*2,.7,.1,.8)}u.run[0]&&(Ge+=U,l.flour.scale.y=Math.min(1,.01+Ge/30),!k&&Math.random()<U*20&&c.dust.emit(on.lanternX+(Math.random()-.5)*1.8,Xt.floorY+1.1,lt.z+(Math.random()-.5)*1.8,(Math.random()-.5)*.5,.35,(Math.random()-.5)*.5,2.2,.55,.28));let z=(u.run.some(Boolean)?1:0)*.85+(i.tierN>=2?.25:0)+(I?.6:0);f.intensity+=(z*38-f.intensity)*Math.min(1,U*3),i.mat_glass(f.intensity/20),ge(v.intro,k),B(U),e.lake.position.y=u.resL-9,d.update({Qg:u.Qg,Qref:u.Qref,spill:u.spill,rpm:u.rpm,Qriver:u.Qriver},U,M,l.drive.rotation.x,c,k,de);for(let S of i.hook)S(u,U,M,k,de);if(s.toneMappingExposure=1.05+(I?.22*Math.sin($e(v.celeb/1.6,0,1)*Math.PI):0),e.shared.uTime.value=k?0:M,e.sky.material.uniforms.uTime.value=k?0:M,!k&&u.rain>.02){let S=u.rain*90*U*60;for(let H=0,X=Math.floor(S)+(Math.random()<S-Math.floor(S)?1:0);H<X;H++)c.rain.emit(-34+Math.random()*74,34,-88+Math.random()*78,.6,-20,.4,1.9,.07,.55)}k||(c.rain.update(U,0,0,0),c.smoke.update(U,-.5,.3,2.2),c.spark.update(U,9,.2,-.4)),k||(c.spray.update(U,9,.5,.7),c.mist.update(U,-.3,.8,1.6),c.dust.update(U,-.02,.6,1.4),c.chips.update(U,9,.4,.2));let ht=b.clientWidth,it=b.clientHeight,D=[];i.hotList.forEach(S=>{y.copy(S.anchor).project(n);let H=y.z<1&&de>.95&&!i.hotHidden;if(S.b.style.display=H?"flex":"none",H){if(S.px=(y.x*.5+.5)*ht,S.py=(-y.y*.5+.5)*it,S.w=S.b.offsetWidth||44,S.text){let ee=S.text();ee!==S.k&&(S.k=ee,S.span.textContent=ee)}let X=S.state?S.state():null;S.b.classList.toggle("on",!!(X&&X.on)),S.b.classList.toggle("run",!!(X&&X.run)),D.push(S)}});for(let S=0;S<4;S++)for(let H=0;H<D.length;H++)for(let X=H+1;X<D.length;X++){let ee=D[H],fe=D[X],ve=(ee.w+fe.w)/2-Math.abs(ee.px-fe.px),ne=46-Math.abs(ee.py-fe.py);if(ve>0&&ne>0){let oe=ee.py<=fe.py?ee:fe,Me=oe===ee?fe:ee,Oe=ne/2+1;oe.py-=Oe,Me.py+=Oe}}D.forEach(S=>{S.b.style.transform="translate("+(S.px-S.w/2).toFixed(0)+"px,"+($e(S.py,22,it-22)-22).toFixed(0)+"px)"}),s.render(t,n),C=M,A=!1,U>.034?We+=U:We=Math.max(0,We-U),We>1.2&&Ve>.7?(Ve=Math.max(.7,Ve*.8),We=0,je()):We>1.2&&r.castShadow&&(r.castShadow=!1,We=0)},i.mat_glass=U=>{i.mats.glass.emissiveIntensity=U},i.probe=()=>({lakeY:e.lake.position.y,gateY:o.gate.position.y,relGateY:o.releaseGate?o.releaseGate.position.y:null,wheelAngle:l.drive.rotation.x,lanternAngle:l.lantern.rotation.y,arborAngle:l.arbor.rotation.x,lampI:f.intensity,hammerAngle:o.hammer?o.hammer.rotation.x:null,hammerVisible:o.factory?o.factory.visible:null,flumeVisible:d.flume.visible,spillVisible:d.spill.visible,riverU:d.river.material.uniforms.uSpeed.value,tailU:d.tail.material.uniforms.uSpeed.value,flumeU:d.flume.material.uniforms.uSpeed.value}),i.dispose=function(){te.disconnect(),i.hotList.forEach(U=>U.b.remove()),q.remove(),_e.remove(),t.traverse(U=>{U.geometry&&U.geometry.dispose(),U.material&&(Array.isArray(U.material)?U.material:[U.material]).forEach(k=>{for(let re in k){let ue=k[re];ue&&ue.isTexture&&ue.dispose()}if(k.uniforms)for(let re in k.uniforms){let ue=k.uniforms[re].value;ue&&ue.isTexture&&ue.dispose()}k.dispose&&k.dispose()})}),e.reflections&&e.reflections.forEach(U=>U.dispose()),Object.values(e.T).forEach(U=>Object.values(U).forEach(k=>k&&k.dispose&&k.dispose())),t.environment&&t.environment.dispose(),s.dispose();try{s.forceContextLoss()}catch{}},i}var as=(i,e,t)=>i<e?e:i>t?t:i;function os(i,e={},t={}){let n=Math.max(1,i|0),s=e.bear|0,r=e.liner|0,a={level:n,t:0,Qref:13,cap:14,eta:.6+.06*s,defs:[{id:"mill",name:"MILL",d:3,r:1},{id:"saw",name:"SAW",d:4,r:1.4},{id:"hammer",name:"HAMMER",d:5,r:1.8}]};return a.M=t.M!=null?t.M:Math.min(2,1+(n-1>>1)),a.as=[!1,!1,!1],a.run=[!1,!1,!1],a.resCap=150*(1+.1*r),a.resV=(t.resFrac!=null?t.resFrac:3/(9.8-6))*a.resCap,a.pondCap=60,a.pin=t.pin==null?null:t.pin,a.pinSupply=a.Qref,a.pondV=.8*a.pondCap,a.inflow=t.inflow||(()=>12),a.relCoef=t.relCoef||40,a.relSat=!!t.relSat,a.relSet=t.rel==null?1:t.rel,a.relA=a.relSet,a.gateSet=0,a.gateA=0,a.resL=0,a.pondL=0,a.Qin=0,a.Qrel=0,a.spillRes=0,a.spillPond=0,a.Qg=0,a.P=0,a.D=0,a.f=1,a.rpm=0,a.Qriver=0,a.units=0,a.overtopped=!1,a.dynamicLake=!!t.dynamicLake,a.freeRel=!!t.freeRel,a.setGate=o=>{a.gateSet=as(Math.round(o/5)*5,0,100)},a.setRelease=o=>{a.relSet=as(o,0,1)},a.engage=(o,l)=>{o>=0&&o<a.M&&(a.as[o]=l==null?!a.as[o]:!!l)},a.levels=()=>{a.resL=6+(9.8-6)*a.resV/a.resCap,a.pondL=a.pin!=null?a.pin:7.8+(9.2-7.8)*a.pondV/a.pondCap},a.levels(),a.step=o=>{a.t+=o,a.levels(),a.relA+=as(a.relSet-a.relA,-.5*o,.5*o),a.gateA+=as(a.gateSet/100-a.gateA,-.6*o,.6*o);let l=Math.max(0,a.resL-a.pondL),c=Math.sqrt(l/1.2);a.Qrel=a.resL<=6+.05?0:a.relA*a.relCoef*(a.relSat?Math.min(1,c):c),a.spillRes=a.resL>9?12*Math.pow(a.resL-9,1.5):0;let d=as((a.pondL-7.8)/(9-7.8),0,1.3);a.Qg=a.gateA*13*Math.sqrt(d),a.freeRel?a.spillPond=0:a.pin!=null?(a.spillPond=Math.max(0,a.pinSupply-a.Qg),a.Qrel=a.Qg+a.spillPond):(a.spillPond=a.pondL>9?14*Math.pow(a.pondL-9,1.5):0,a.pondV=as(a.pondV+(a.Qrel-a.Qg-a.spillPond)*o,0,a.pondCap)),a.Qin=a.inflow(a.t),(a.pin==null||a.dynamicLake)&&(a.resV=as(a.resV+(a.Qin-a.Qrel-a.spillRes)*o,0,a.resCap)),a.overtopped=a.resL>=9.8-.005,a.P=a.eta*Math.min(a.Qg,a.cap),a.D=0,a.defs.forEach((h,m)=>{m<a.M&&a.as[m]&&(a.D+=h.d)}),a.f=a.D>0?Math.min(1,a.P/a.D):1;let f=Math.min(a.Qg/a.cap,1.3)*48*(a.D>0&&a.f<1?.25+.75*a.f:1);a.rpm+=(f-a.rpm)*Math.min(1,o*2.5),a.defs.forEach((h,m)=>{a.run[m]=m<a.M&&a.as[m]&&a.Qg>0&&a.P>=h.d-1e-9}),a.D>0&&a.Qg>0&&a.defs.forEach((h,m)=>{m<a.M&&a.as[m]&&(a.units+=h.r*a.f*o)}),a.Qriver=a.Qg+a.spillPond+a.spillRes+(a.freeRel?a.Qrel:0)},a.advice=()=>{let o=a.run.filter((f,h)=>f&&h<a.M).length,l=a.as.filter((f,h)=>f&&h<a.M).length,c=a.spillPond+a.spillRes,d=a.Qg/Math.max(.01,a.Qg+c);return a.overtopped?{tone:"bad",text:"RESERVOIR OVERTOPPING \u2014 release more water now"}:a.resL>9+.15?{tone:"warn",text:"RESERVOIR OVERFULL \u2014 open the release; water is going over the spillway"}:a.resL<7.8+.1&&a.pin==null?{tone:"warn",text:"LAKE TOO LOW \u2014 the gate can't draw water; close the release"}:a.Qg>.5&&l===0?{tone:"warn",text:"WATER IS TURNING THE WHEEL BUT NOTHING IS CONNECTED \u2014 engage a machine"}:l>0&&o<l?{tone:"warn",text:"MACHINES STARVED \u2014 power "+a.P.toFixed(1)+" < need "+a.D.toFixed(1)+": open the gate or drop a machine"}:c>2.5&&a.Qg<a.cap*.95?{tone:"warn",text:"WASTING WATER \u2014 "+c.toFixed(1)+" L/s is spilling past the wheel: open the gate"}:o>0&&o===l&&d>.8?{tone:"good",text:"EFFICIENT \u2014 "+Math.round(d*100)+"% of the water is working, all machines running"}:a.Qg<.2?{tone:"info",text:"GATE CLOSED \u2014 no water reaches the wheel"}:{tone:"info",text:"ADJUST THE GATE AND ENGAGE MACHINES"}},a}var nt=(i,e=1)=>i.toFixed(e);function vl(i,e,t,n,s,r,a,o,l="%"){let c=document.createElement("div");c.className="dbSl",c.innerHTML='<label for="'+e+'">'+t+'</label><input id="'+e+'" type="range" min="'+n+'" max="'+s+'" step="'+r+'" value="'+a+'"><output></output>';let d=c.querySelector("input"),f=c.querySelector("output"),h=()=>{f.textContent=Math.round(+d.value)+l};return d.addEventListener("input",()=>{h(),o(+d.value)}),h(),i.appendChild(c),{input:d,set(m){d.value=m,h()}}}function Cn(i,e,t,n="72px"){let s=document.createElement("button");return s.type="button",s.className="dbBtn",s.style.minWidth=n,s.textContent=e,s.addEventListener("click",t),i.appendChild(s),s}function er(i,e,t){let n=i.vs;if(i.source&&!i.source.manual){let s=Math.max(0,e.Qin);i.source.apply({Qmax:12,edge:{"src>F1":s,"F1>T1":s},fall:s,fill:{}})}n.gateA=e.gateA,n.relA=e.relA,n.Qrel=e.Qrel,n.resL=e.resL,n.pondL=e.pondL,n.Qg=e.Qg,n.Qref=e.Qref,n.spill=e.spillPond+e.spillRes,n.Qriver=e.Qriver,n.rpm=e.rpm,n.as=e.as,n.run=e.run,n.M=e.M,n.P=e.P,n.D=e.D,n.units=e.units,t&&Object.assign(n,t)}function Yd(i,e){let{api:t,ctl:n,level:s,up:r}=i,a=i.kit,o=()=>a.reduced(),l=os(s,r,{pin:9}),c={t:0,HOLD:4,holdT:0,TL:Math.round(45-Math.min(s-1,10)*1.5),done:!1,failed:!1,why:""};e.setShot("wheel",!0);let d=vl(n,"db3dGate","SLUICE GATE",0,100,5,0,p=>{l.setGate(p),d.set(l.gateSet),t.sfx("tick"),e.dirty()});Cn(n,"\u2212 GATE",()=>{l.setGate(l.gateSet-5),d.set(l.gateSet),t.sfx("tick"),e.dirty()}),Cn(n,"GATE +",()=>{l.setGate(l.gateSet+5),d.set(l.gateSet),t.sfx("tick"),e.dirty()});let f=[Cn(n,"MILL \xB7 OFF",()=>h(0))];l.M>1&&f.push(Cn(n,"SAW \xB7 OFF",()=>h(1)));function h(p){c.done||c.failed||(l.engage(p),t.sfx(l.as[p]?"click":"tick"),t.inspect(p?"saw":"mill"),e.dirty())}function m(){f.forEach((p,u)=>{let y=l.as[u];p.textContent=(u?"SAW \xB7 ":"MILL \xB7 ")+(y?"ENGAGED":"OFF"),p.classList.toggle("on",y),p.setAttribute("aria-pressed",y?"true":"false")})}m(),e.setHot([{label:"MILL",anchor:new O(on.lanternX-1.7,Xt.floorY+2.4,lt.z+1.5),fn:()=>h(0),state:()=>({on:l.as[0],run:l.run[0]})}].concat(l.M>1?[{label:"SAW",anchor:new O(Ze.fastX+.1,Ze.y+1.3,Ze.z),fn:()=>h(1),state:()=>({on:l.as[1],run:l.run[1]})}]:[]));let{mach:x,parts:b}=e;return e.pickList=[{object:x.lever,id:"mill"},{object:x.lantern,id:"mill"},{object:x.sawGroup,id:"saw"},{object:b.gate,id:"gate"},{object:b.handwheel,id:"gate"},{object:b.gateHouse,id:"gate"},{object:x.wheelWood,id:"wheel"},{object:x.drive,id:"wheel"},{object:b.dam,id:"dam"}],e.onTap=p=>{p==="mill"?h(0):p==="saw"&&l.M>1?h(1):t.inspect(p)},e.hotHidden=!1,{H:l,tips:"Drag the SLUICE GATE slider (or \xB1 buttons) to lift the gate and send water down the flume. Then ENGAGE the mill clutch"+(l.M>1?" and the saw belt":"")+" \u2014 tap the hotspots, the lever / belt in the scene, or the buttons. Every machine must run at once for 4 seconds. Drag the scene to look around.",explain:"A waterwheel converts moving water into rotation. More flow means a faster wheel and more power (power \u2248 efficiency \xD7 flow). A machine only works when the wheel can supply the power it needs \u2014 engage too many and the wheel slows under load.",hint:"Lift the gate until the POWER bar passes what the engaged machines need. Water you don't send to the wheel goes over the spillway. Engage every machine (tap the glowing hotspots) and hold it.",celebrateMs:1700,gauges:[{id:"f0",label:"FLOW TO WHEEL"},{id:"r0",label:"WHEEL SPEED"},{id:"p0",label:"POWER / NEED"},{id:"hold",label:"ALL RUNNING"},{id:"time",label:"TIME LEFT"}],step(p){if(!e.introDone&&!o()||c.done||c.failed)return;c.t+=p,l.step(p);let u=!0;for(let y=0;y<l.M;y++)l.run[y]||(u=!1);if(u?c.holdT+=p:c.holdT=0,c.holdT>=c.HOLD){c.done=!0;return}c.t>=c.TL&&(c.failed=!0,c.why="Time ran out before every machine was running.")},status(){return c.done?"success":c.failed?"fail":"playing"},efficient(){return c.done&&c.t<=c.TL*.6},failReason(){return c.why},celebrate(){e.celebrate()},skipIntro(){e.skipIntro()},project:(p,u,y)=>e.project(p,u,y),pixels:()=>e.pixels(),_view:{cam:e.cam},dbg(){let p=e.info();return{Q:l.Qg,P:l.P,D:l.D,rpm:l.rpm,a:l.gateA,sp:l.gateSet,as:l.as.slice(0,l.M),run:l.run.slice(0,l.M),holdT:c.holdT,t:c.t,TL:c.TL,Q0:l.Qref,cap:l.cap,eta:l.eta,M:l.M,wheelAngle:x.drive.rotation.x,stoneAngle:x.lantern.rotation.y,lift:e.vis.lift,gateY:b.gate.position.y,introDone:e.introDone,info:p.info,mem:p.mem,quality:p.quality,dpr:p.dpr,saw:e.vis.saw,beltX:e.vis.beltX}},gauge(p){let u=l.eta*l.cap,y=l.D>0&&l.P>=l.D-1e-9,v=Math.max(0,c.TL-c.t);p.gauge("f0",nt(l.Qg)+" L/s",l.Qg/(l.cap*1.3),{tone:""}),p.gauge("r0",nt(l.rpm*.2)+" rpm",l.rpm/62),p.gauge("p0",nt(l.P)+" / "+nt(l.D),l.P/u,{band:l.D>0?[Math.min(1,l.D/u),1]:null,tone:y?"good":l.D>0?"warn":""}),p.gauge("hold",nt(c.holdT)+" / "+c.HOLD+" s",c.holdT/c.HOLD,{tone:c.holdT>0?"good":""}),p.gauge("time",nt(v,0)+" s",v/c.TL,{tone:v<8?"warn":""}),m()},inspect(p){return p==="gate"?{t:"SLUICE GATE",b:"Opening "+Math.round(l.gateA*100)+"% \u2192 "+nt(l.Qg)+" L/s to the wheel; the other "+nt(l.Qref-l.Qg)+" L/s spills over the dam."}:p==="wheel"?{t:"OVERSHOT WATERWHEEL",b:nt(l.rpm*.2)+" rpm \xB7 power "+nt(l.P)+" (\u03B7 "+Math.round(l.eta*100)+"%) \xB7 water falls into the buckets and its weight turns the wheel."}:p==="mill"?{t:"MILL CLUTCH",b:"Needs "+l.defs[0].d+" power. "+(l.as[0]?l.run[0]?"Running: the crown wheel drives the lantern pinion and the millstone.":"Engaged but starved \u2014 open the gate more.":"Out of gear. Tap to engage.")}:p==="saw"?{t:"SAW BELT",b:"Needs "+(l.defs[1]?l.defs[1].d:4)+" power. "+(l.as[1]?l.run[1]?"Running: the belt rides the fast pulley and drives the blade.":"Engaged but starved \u2014 open the gate more.":"Belt on the loose pulley (idle). Tap to shift it.")}:p==="dam"?{t:"CONCRETE DAM",b:"A gravity dam: its weight resists the lake's push. Water not sent to the wheel goes over the stepped spillway."}:null},draw(p){er(e,l),e.frame(p)},destroy(){e.setHot([]),e.pickList=[],e.onTap=null}}}function Zd(i,e){let{api:t,ctl:n,level:s,up:r}=i,a=i.kit,o=()=>a.reduced(),l=r.act|0,c=s,d=[6,9,10.5,7,10,8,9.5,5,10.5,9,6,10.5],f=1+Math.min(2,Math.floor((c-1)/3)),h=[];for(let M=0;M<f;M++)h.push(d[(c*2+M*5)%12]);let m=c<4?0:Math.min(.34,.08*(c-3)),x=Math.max(.5,1.4-.1*(c-1))+.3*l,b=3,p=24*f+6,u=[5,4,2.5,1][l],y=os(s,r,{pin:9,M:1});y.engage(0,!0);let v={t:0,idx:0,holdT:0,done:!1,failed:!1};e.setShot("gate",!0);let _=vl(n,"db3dGate","SLUICE GATE",0,100,u,0,M=>{E(M)});function E(M){y.gateSet=$e(Math.round(M/u)*u,0,100),_.set(y.gateSet),t.sfx("tick"),e.dirty()}Cn(n,"\u2212 GATE",()=>E(y.gateSet-u)),Cn(n,"GATE +",()=>E(y.gateSet+u));let{mach:w,parts:T}=e;e.setHot([{label:"GATE",anchor:new O(7,12.2,-16.35),fn:()=>t.inspect("gate"),state:()=>({run:Math.abs(y.Qg-h[Math.min(v.idx,f-1)])<=x})}]),e.pickList=[{object:T.gate,id:"gate"},{object:T.gateHouse,id:"gate"},{object:T.pondSurface,id:"pond"},{object:w.wheelWood,id:"wheel"},{object:T.flume,id:"flume"}],e.onTap=M=>t.inspect(M),e.hotHidden=!1;let g=()=>h[Math.min(v.idx,f-1)];return{H:y,tips:"Drag the SLUICE GATE slider (or use the \xB1 buttons) and watch the flow gauge and the wheel. Put the flow inside the pink band and keep it there until the bar fills. A deeper millpond pushes harder, so when the pond level changes the same gate gives a different flow.",explain:"A sluice gate regulates flow: more opening lets more water through, and deeper water (more head) pushes it out faster \u2014 flow \u2248 opening \xD7 \u221Ahead. Operators keep adjusting the gate to hold a target flow as conditions change.",hint:"Small gate changes make small flow changes. Move the gate until the FLOW bar sits in the green band, then keep still \u2014 if the pond level drifts, nudge the gate to compensate.",celebrateMs:1500,gauges:[{id:"gate",label:"GATE OPEN"},{id:"head",label:"POND LEVEL"},{id:"flow",label:"FLOW"},{id:"tgt",label:"TARGET"},{id:"hold",label:"HOLD"},{id:"time",label:"TIME LEFT"}],step(M){if(!(!e.introDone&&!o())&&!(v.done||v.failed)){if(v.t+=M,y.pin=9-m*(.5+.5*Math.sin(2*Math.PI*v.t/14)),y.step(M),Math.abs(y.Qg-g())<=x?v.holdT+=M:v.holdT=Math.max(0,v.holdT-2*M),v.holdT>=b){if(v.idx++,v.holdT=0,t.sfx("good"),v.idx>=f){v.done=!0;return}t.say("Target reached! New target: "+nt(g())+" L/s")}v.t>=p&&(v.failed=!0)}},status(){return v.done?"success":v.failed?"fail":"playing"},efficient(){return v.done&&v.t<=p*.7},failReason(){return"Time ran out before the flow was held in the target band ("+nt(g()-x)+"\u2013"+nt(g()+x)+" L/s)."},celebrate(){e.celebrate()},skipIntro(){e.skipIntro()},project:(M,A,C)=>e.project(M,A,C),pixels:()=>e.pixels(),_view:{cam:e.cam},dbg(){let M=e.info();return{Q:y.Qg,h:y.pondL,a:y.gateA,sp:y.gateSet,tg:h.slice(),idx:v.idx,tol:x,holdT:v.holdT,TL:p,t:v.t,rpm:y.rpm,P:y.P,as:y.as.slice(0,1),run:y.run.slice(0,1),gateY:T.gate.position.y,introDone:e.introDone,info:M.info,mem:M.mem,quality:M.quality,wheelAngle:w.drive.rotation.x}},gauge(M){let A=Math.abs(y.Qg-g())<=x,C=13;M.gauge("gate",Math.round(y.gateA*100)+"%",y.gateA),M.gauge("head",nt(y.pondL,2)+" m",(y.pondL-7.8)/1.4),M.gauge("flow",nt(y.Qg)+" L/s",y.Qg/C,{band:[$e((g()-x)/C,0,1),$e((g()+x)/C,0,1)],tone:A?"good":""}),M.gauge("tgt",nt(g())+" \xB1"+nt(x)+" ("+Math.min(v.idx+1,f)+"/"+f+")",g()/C),M.gauge("hold",nt(v.holdT)+" / "+b+" s",v.holdT/b,{tone:A?"good":""}),M.gauge("time",nt(Math.max(0,p-v.t),0)+" s",Math.max(0,p-v.t)/p,{tone:p-v.t<6?"warn":""}),e.setAdvice(A?{tone:"good",text:"ON TARGET \u2014 hold it steady ("+nt(y.Qg)+" L/s)"}:y.Qg<g()?{tone:"warn",text:"TOO LITTLE FLOW \u2014 open the gate a little"}:{tone:"warn",text:"TOO MUCH FLOW \u2014 close the gate a little"})},inspect(M){return M==="gate"?{t:"SLUICE GATE",b:"Opening "+Math.round(y.gateA*100)+"% \xD7 \u221Ahead "+nt(Math.sqrt(Math.max(0,(y.pondL-7.8)/1.2)),2)+" \u2192 "+nt(y.Qg)+" L/s. Drag the slider to move it."}:M==="pond"?{t:"MILLPOND",b:"Level "+nt(y.pondL,2)+" m. The deeper it is, the harder the water pushes through the gate (flow \u221D \u221Ahead)."}:M==="wheel"?{t:"WATERWHEEL",b:nt(y.rpm*.2)+" rpm \u2014 it follows the flow the gate lets through."}:M==="flume"?{t:"FLUME",b:"Carries "+nt(y.Qg)+" L/s from the gate to the top of the wheel."}:null},draw(M){er(e,y),e.frame(M)},destroy(){e.setHot([]),e.pickList=[],e.onTap=null,e.setAdvice(null)}}}function Jd(i,e){let{api:t,ctl:n,level:s,up:r}=i,a=i.kit,o=()=>a.reduced(),l=s,c=Math.min(l-1,10),d=5+.3*c,f=3+.35*c,h=Math.ceil(1.2*(d+f)*10)/10,m=36+2*Math.min(l-1,6),x=l>=4?2:1,b=[8+l*3%5,19+l*2%4,29+l%4],p=M=>{let A=d+.5*Math.sin(.9*M);return b.forEach(C=>{let I=(M-C)/6;Math.abs(I)<1&&(A+=f*(1-I*I))}),A},u=os(s,r,{pin:7.8,M:1,inflow:p,relCoef:h,relSat:!0,dynamicLake:!0,rel:0,freeRel:!0});u.resCap=240*(1+.1*(r.liner|0)),u.resV=(8.7-6)/3.8*u.resCap,u.relSet=0,u.relA=0,u.gateSet=40,u.gateA=.4,u.engage(0,!0);let y=8.2,v=9.2,_={t:0,stress:0,inBand:0,done:!1,failed:!1,why:"",open:[!1,!1]};e.setShot("lake",!0);let E=[],w=()=>{u.relSet=_.open.slice(0,x).filter(Boolean).length/x;for(let M=0;M<x;M++)E[M].textContent=(x>1?"RELEASE "+"AB"[M]:"RESERVOIR RELEASE")+": "+(_.open[M]?"OPEN":"CLOSED"),E[M].classList.toggle("on",_.open[M]),E[M].setAttribute("aria-pressed",_.open[M]?"true":"false")},T=M=>{_.done||_.failed||(_.open[M]=!_.open[M],t.sfx(_.open[M]?"splash":"click"),w(),e.dirty())};for(let M=0;M<x;M++)E.push(Cn(n,"",()=>T(M),"150px"));w();let{parts:g}=e;return e.setHot([{label:"RELEASE",anchor:new O(7,14.6,-25.6),fn:()=>T(0),state:()=>({on:_.open[0]})}]),e.pickList=[{object:g.releaseGate,id:"rel"},{object:g.releaseWheel,id:"rel"},{object:g.millpond,id:"rel"},{object:g.dam,id:"dam"}],e.onTap=M=>{M==="rel"?T(0):t.inspect(M)},e.hotHidden=!1,{H:u,tips:"Open or close the RESERVOIR RELEASE (button, hotspot, or tap the release gate in the scene). Watch the forecast: store water before a dry spell, release it before the storm arrives. Keep the lake level inside the green band \u2014 too full spills over the dam, too low starves the mill.",explain:"A reservoir is a buffer: its level changes by inflow minus release. Holding water back before dry weather and releasing it ahead of a storm keeps the level safe \u2014 neither overflowing nor running dry.",hint:"The level only changes by inflow \u2212 release. If the forecast shows a storm coming, open the release early to make room; if it's dry, close it and keep the water.",celebrateMs:1500,gauges:[{id:"lev",label:"LAKE LEVEL"},{id:"in",label:"INFLOW"},{id:"out",label:"RELEASE"},{id:"st",label:"STRESS"},{id:"time",label:"TIME LEFT"}],step(M){if(!(!e.introDone&&!o())&&!(_.done||_.failed)){if(_.t+=M,u.step(M),u.overtopped){_.failed=!0,_.why="The reservoir overtopped the dam! More water came in than went out and the level reached the crest.";return}if(u.resL<y||u.resL>v?_.stress+=M:(_.stress=Math.max(0,_.stress-.6*M),_.inBand+=M),_.stress>=5){_.failed=!0,_.why="The lake stayed outside the safe band for too long ("+(u.resL>v?"too full \u2014 water was wasted over the spillway":"too low \u2014 the mill could not draw water")+").";return}_.t>=m&&(_.done=!0)}},status(){return _.done?"success":_.failed?"fail":"playing"},efficient(){return _.done&&_.inBand/Math.max(1,_.t)>=.92},failReason(){return _.why},celebrate(){e.celebrate()},skipIntro(){e.skipIntro()},project:(M,A,C)=>e.project(M,A,C),pixels:()=>e.pixels(),_view:{cam:e.cam},dbg(){let M=e.info();return{f:(u.resL-6)/3.8,L:u.resL,qin:u.Qin,qout:u.Qrel,open:_.open.slice(),valves:x,D:m,t:_.t,stress:_.stress,LO:y,HI:v,spill:u.spillRes,introDone:e.introDone,info:M.info,mem:M.mem,quality:M.quality,relA:u.relA,pondL:u.pondL}},gauge(M){let A=u.resL<y||u.resL>v;M.gauge("lev",nt(u.resL,2)+" m",(u.resL-6)/3.8,{band:[(y-6)/3.8,(v-6)/3.8],tone:A?"warn":"good"}),M.gauge("in",nt(u.Qin)+" L/s",u.Qin/(d+f+.5)),M.gauge("out",nt(u.Qrel)+" L/s",u.Qrel/h),M.gauge("st",nt(_.stress)+" / 5",_.stress/5,{tone:_.stress>.2?"warn":""}),M.gauge("time",nt(Math.max(0,m-_.t),0)+" s",Math.max(0,m-_.t)/m),e.setForecast(p,_.t,14,d-1,d+f+1),e.setAdvice(u.resL>v?{tone:"bad",text:"TOO FULL \u2014 open the release (water is spilling over the dam)"}:u.resL<y?{tone:"bad",text:"TOO LOW \u2014 close the release and store water"}:u.Qin>d+f*.5?{tone:"info",text:"STORM INFLOW \u2014 the lake is rising"}:{tone:"good",text:"LAKE IN THE SAFE BAND"})},inspect(M){return M==="rel"?{t:"RESERVOIR RELEASE",b:(_.open.some(Boolean)?"Open: releasing up to ":"Closed: would release up to ")+nt(h)+" L/s into the millpond. Tap to "+(_.open[0]?"close":"open")+"."}:M==="dam"?{t:"DAM",b:"Holds the lake at "+nt(u.resL,2)+" m. Above 9.0 m water goes over the spillway; at 9.8 m it overtops the crest."}:null},draw(M){er(e,u,{rain:$e((u.Qin-d-.6)/f,0,1)}),e.frame(M)},destroy(){e.setHot([]),e.pickList=[],e.onTap=null,e.setAdvice(null),e.setForecast(null),e.vs.rain=0}}}function Kd(i,e){let{api:t,ctl:n,level:s,up:r}=i,a=i.kit,o=()=>a.reduced(),l=s,c=l>=3?3:2,d=l>=3,h=os(s,r,{pin:null,M:c,inflow:I=>10.5+1.5*Math.sin(.35*I)*.5-(d&&I>18&&I<28?3:0),relCoef:20,relSat:!0,dynamicLake:!0,rel:.5,resFrac:.72});h.resCap=220*(1+.1*(r.liner|0)),h.resV=.72*h.resCap,h.pondV=.78*h.pondCap,h.relSet=.5,h.relA=.5,h.gateSet=50,h.gateA=.5;let m=Math.min(1,h.eta*13/h.defs.slice(0,c).reduce((I,P)=>I+P.d,0)),x=h.defs.slice(0,c).reduce((I,P)=>I+P.r,0),b=Math.round(.85*x*m*20),p=Math.round(46+14*Math.max(0,1-(l-1)/10)),u={t:0,done:!1,failed:!1,why:"",okRiver:0};e.setShot("factory",!0);let y=vl(n,"db3dRel","RELEASE",0,100,5,50,I=>{h.setRelease(I/100),t.sfx("tick"),e.dirty()}),v=vl(n,"db3dGate","SLUICE GATE",0,100,5,50,I=>{h.setGate(I),t.sfx("tick"),e.dirty()}),_=h.defs.slice(0,c).map((I,P)=>Cn(n,I.name+" \xB7 OFF",()=>E(P),"92px"));function E(I){u.done||u.failed||(h.engage(I),t.sfx(h.as[I]?"click":"tick"),t.inspect(["mill","saw","hammer"][I]),e.dirty())}function w(){_.forEach((I,P)=>{let L=h.as[P];I.textContent=h.defs[P].name+" \xB7 "+(L?"ON":"OFF"),I.classList.toggle("on",L),I.setAttribute("aria-pressed",L?"true":"false")})}w();let T=["factory","ocean","wheel","lake"],g=0,M=Cn(n,"VIEW: FACTORY",()=>{g=(g+1)%T.length,e.setShot(T[g]),M.textContent="VIEW: "+T[g].toUpperCase()},"120px"),{mach:A,parts:C}=e;return e.setHot([{label:"MILL",anchor:new O(on.lanternX-1.7,Xt.floorY+2.4,lt.z+1.5),fn:()=>E(0),state:()=>({on:h.as[0],run:h.run[0]})},{label:"SAW",anchor:new O(Ze.fastX+.1,Ze.y+1.3,Ze.z),fn:()=>E(1),state:()=>({on:h.as[1],run:h.run[1]})}].concat(c>=3?[{label:"HAMMER",anchor:new O(Ut.camX,3.6,Ut.shaftZ+1.7),fn:()=>E(2),state:()=>({on:h.as[2],run:h.run[2]})}]:[])),e.pickList=[{object:A.lever,id:"mill"},{object:A.lantern,id:"mill"},{object:A.sawGroup,id:"saw"},{object:C.hammer,id:"hammer"},{object:C.factory,id:"hammer"},{object:C.gate,id:"gate"},{object:C.releaseGate,id:"rel"},{object:A.wheelWood,id:"wheel"}],e.onTap=I=>{I==="mill"?E(0):I==="saw"?E(1):I==="hammer"&&c>=3?E(2):t.inspect(I)},e.hotHidden=!1,{H:h,tips:"Run the whole chain: set the RESERVOIR RELEASE (lake \u2192 millpond), the SLUICE GATE (millpond \u2192 wheel) and switch the machines on. Draining the lake too fast drops the head and the flow; too little water starves the wheel; every extra machine loads it. Reach the production target \u2014 and the spill and river show where the rest of the water goes.",explain:"A hydraulic system is a chain: store (reservoir), regulate (release and gate), convert (wheel), produce (machines). Each stage depends on the one before it: drain the lake too fast and the flow falls; open the gate too little and the wheel starves; overload it and everything slows.",hint:"Keep the LAKE near its level while the POWER bar stays above what the engaged machines need. If machines starve, open the gate or switch one off; if water spills, you are wasting power.",celebrateMs:1800,gauges:[{id:"lake",label:"LAKE LEVEL"},{id:"flow",label:"FLOW TO WHEEL"},{id:"pw",label:"POWER / NEED"},{id:"units",label:"UNITS MADE"},{id:"sea",label:"TO THE OCEAN"},{id:"time",label:"TIME LEFT"}],step(I){if(!(!e.introDone&&!o())&&!(u.done||u.failed)){if(u.t+=I,h.step(I),h.units>=b){u.done=!0;return}u.t>=p&&(u.failed=!0,u.why="Time ran out at "+Math.floor(h.units)+" / "+b+" units. "+(h.resL<8?"The lake ran low, so the head and flow dropped.":h.D>0&&h.f<1?"Power was below the machines' need.":h.D===0?"No machine was switched on.":"The system was not producing fast enough."))}},status(){return u.done?"success":u.failed?"fail":"playing"},efficient(){return u.done&&u.t<=p*.7},failReason(){return u.why},celebrate(){e.celebrate()},skipIntro(){e.skipIntro()},project:(I,P,L)=>e.project(I,P,L),pixels:()=>e.pixels(),_view:{cam:e.cam},dbg(){let I=e.info();return{L:h.resL,pondL:h.pondL,Qin:h.Qin,Qrel:h.Qrel,Qg:h.Qg,P:h.P,D:h.D,f:h.f,units:h.units,U:b,TL:p,t:u.t,Mn:c,rpm:h.rpm,as:h.as.slice(0,c),run:h.run.slice(0,c),Qriver:h.Qriver,spill:h.spillRes+h.spillPond,relA:h.relA,gateA:h.gateA,introDone:e.introDone,info:I.info,mem:I.mem,quality:I.quality}},gauge(I){let P=h.D>0&&h.P>=h.D-1e-9,L=h.eta*h.cap;I.gauge("lake",nt(h.resL,2)+" m",(h.resL-6)/3.8,{band:[(8.2-6)/3.8,(9.2-6)/3.8],tone:h.resL<8||h.resL>9.3?"warn":"good"}),I.gauge("flow",nt(h.Qg)+" L/s",h.Qg/14),I.gauge("pw",nt(h.P)+" / "+nt(h.D),h.P/L,{band:h.D>0?[Math.min(1,h.D/L),1]:null,tone:P?"good":h.D>0?"warn":""}),I.gauge("units",Math.floor(h.units)+" / "+b,h.units/b,{tone:"good"}),I.gauge("sea",nt(h.Qriver)+" L/s",h.Qriver/20,{tone:"good"}),I.gauge("time",nt(Math.max(0,p-u.t),0)+" s",Math.max(0,p-u.t)/p,{tone:p-u.t<10?"warn":""}),e.setAdvice(h.advice()),w()},inspect(I){return I==="mill"?{t:"MILL",b:"Needs "+h.defs[0].d+" power. "+(h.as[0]?h.run[0]?"Running.":"Starved \u2014 open the gate or drop a machine.":"Out of gear. Tap to engage.")}:I==="saw"?{t:"SAWMILL",b:"Needs "+h.defs[1].d+" power. "+(h.as[1]?h.run[1]?"Running.":"Starved.":"Belt idle. Tap to engage.")}:I==="hammer"?{t:"TRIP HAMMER",b:"Needs "+h.defs[2].d+" power. "+(h.as[2]?"Engaged.":"Off.")}:I==="gate"?{t:"SLUICE GATE",b:Math.round(h.gateA*100)+"% \u2192 "+nt(h.Qg)+" L/s to the wheel."}:I==="rel"?{t:"RESERVOIR RELEASE",b:Math.round(h.relA*100)+"% \u2192 "+nt(h.Qrel)+" L/s from the lake into the millpond."}:I==="wheel"?{t:"WATERWHEEL",b:nt(h.rpm*.2)+" rpm \xB7 power "+nt(h.P)}:null},draw(I){er(e,h,{rain:(d&&u.t>16&&u.t<30,0)}),e.frame(I)},destroy(){e.setHot([]),e.pickList=[],e.onTap=null,e.setAdvice(null)}}}var _l={};function $d(i,e){let{api:t,ctl:n,level:s}=i,r=i.kit,a=()=>r.reduced(),o=s,l=5,c=4/l,d=4,f=Math.max(1,5-(o-1>>1)),h=[],m=.45+.03*Math.min(o,8),x=0;for(let N=0;N<l;N++)h[N]=Math.ceil((l-N)*c-1e-9),x+=h[N];let b=x+f,p=_l[o]?_l[o].slice():[0,0,0,0,0],u=e.lab,y=e.world.arch,v={phase:"build",lev:0,failRow:-1,leakT:0,holdT:0,t:0,attempts:0},_=[-3,0,3.2,6,8.2,9],E=N=>{let B=Math.min(l-1,Math.floor(N)),Z=N-B;return _[B]+(_[B+1]-_[B])*$e(Z,0,1)},w=()=>p.reduce((N,B)=>N+B,0),T=(N,B)=>B>0?Math.ceil(B*c-1e-9):0,g=os(s,M(i),{pin:9,M:1});function M(N){return N.up}e.setShot("lab",!0),u.show=!0,u.group.visible=!0,u.th=p,u.need=h;let A=()=>{u.th=p,u.rebuild(),y.rebuildDam(p.map(N=>1.8+1.7*N))};A();let C=N=>{if(v.phase!=="build")return;let B=p[N]+1,Z=w()-p[N]+B;B>d||Z>b?(B<=d&&Z>b&&t.say("Out of blocks \u2014 lift cleared. Spend them where the pressure is highest."),p[N]=0,t.sfx("bad")):(p[N]=B,t.sfx("tick")),A(),e.dirty()},I=Cn(n,"\u25B6 FILL RESERVOIR",()=>{if(v.phase==="build"){if(w()===0){t.say("Build some wall first \u2014 tap a lift on the model."),t.sfx("bad");return}v.phase="fill",v.attempts++,t.sfx("splash")}},"150px"),P=Cn(n,"CLEAR WALL",()=>{if(v.phase==="build"){for(let N=0;N<l;N++)p[N]=0;A(),t.sfx("click")}},"110px"),L=[];for(let N=0;N<l;N++){let B=((jt[N]+jt[N+1])/2+3)*Dt.sc;L.push({label:"L"+(N+1)+" \xB7 "+p[N],text:()=>"L"+(N+1)+" \xB7 "+p[N],aria:"Wall lift "+(N+1),pill:!0,anchor:new O(Dt.x+(Dt.w/2+.55)*Dt.k,(.55+B)*Dt.k,Dt.z-.3*Dt.k),fn:()=>C(N),state:()=>({on:p[N]>=h[N],run:!1})})}e.setHot(L),e.pickList=u.hits.map(N=>({object:N,id:"row"+N.userData.row})).concat([{object:e.parts.dam,id:"dam"}]),e.onTap=N=>{N.indexOf("row")===0?C(+N.slice(3)):t.inspect(N)},e.hotHidden=!1;let F=()=>v.phase==="leak"||v.phase==="failed";return{H:g,tips:"Tap a lift of the wall (the numbered markers or the section model) to thicken it \u2014 1 to 4 blocks, then back to 0. You only have a few blocks. Longer pink arrows = more pressure. Press FILL RESERVOIR when you are ready.",explain:"Water pressure grows with depth, so the deepest part of a dam carries the biggest load. That's why real dams are thick at the base and thinner toward the top: strength goes where the pressure is.",hint:"Look at the pink arrows on the model: the longest ones are at the bottom. Give the bottom lifts the thickest wall and the top lifts only a little.",celebrateMs:1500,gauges:[{id:"lev",label:"RESERVOIR"},{id:"prs",label:"BASE PRESSURE"},{id:"blk",label:"BLOCKS LEFT"}],step(N){if(!(!e.introDone&&!a()))if(v.t+=N,v.phase==="fill"){v.lev=Math.min(l,v.lev+m*N);for(let B=0;B<l;B++){let Z=v.lev-B;if(Z>0&&p[B]<T(B,Z)){v.phase="leak",v.failRow=B,v.leakT=0,_l[o]=p.slice(),t.sfx("bad"),u.fail=B;return}}v.lev>=l&&(v.phase="hold",v.holdT=0)}else v.phase==="hold"?(v.holdT+=N,v.holdT>=1.5&&(v.phase="done",delete _l[o])):v.phase==="leak"&&(v.leakT+=N,v.leakT>=1.6&&(v.phase="failed"))},status(){return v.phase==="done"?"success":v.phase==="failed"?"fail":"playing"},efficient(){return w()<=x+1&&v.attempts===1},failReason(){let N=v.failRow;return"Lift "+(N+1)+" from the bottom leaked: the water above it pushes with pressure level "+h[N]+", but that lift only had "+p[N]+" block"+(p[N]===1?"":"s")+"."},celebrate(){e.celebrate()},skipIntro(){e.skipIntro()},project:(N,B,Z)=>e.project(N,B,Z),pixels:()=>e.pixels(),_view:{cam:e.cam},dbg(){let N=e.info();return{R:l,need:h.slice(),th:p.slice(),budget:b,used:w(),lev:v.lev,phase:v.phase,minTotal:x,resL:e.vs.resL,introDone:e.introDone,info:N.info,mem:N.mem,quality:N.quality,failRow:v.failRow}},gauge(N){let B=Math.max(0,v.lev),Z=Math.min(4,Math.ceil(B*c-1e-9));N.gauge("lev",Math.round(v.lev/l*100)+"%",v.lev/l),N.gauge("prs","level "+Z+"/4",Math.min(1,B*c/4),{tone:v.phase==="leak"?"warn":""}),N.gauge("blk",b-w()+" / "+b,(b-w())/b,{tone:b-w()===0?"warn":""}),I.disabled=P.disabled=v.phase!=="build",e.setAdvice(F()?{tone:"bad",text:"LEAK in lift "+(v.failRow+1)+" \u2014 it was too thin for the pressure there"}:v.phase==="fill"?{tone:"info",text:"RESERVOIR RISING \u2014 pressure grows with depth"}:v.phase==="hold"?{tone:"good",text:"THE WALL HOLDS"}:{tone:"info",text:"BUILD THE WALL: thickest at the base, where the pressure is greatest"})},inspect(N){if(N.indexOf("row")===0){let B=+N.slice(3);return{t:"WALL LIFT "+(B+1),b:"Pressure at full reservoir: level "+h[B]+" \xB7 you placed "+p[B]+". "+(p[B]>=h[B]?"Holds.":"Too thin!")}}return N==="dam"?{t:"THE DAM",b:"Your wall, lift by lift. The reservoir will push on it harder the deeper it gets."}:null},draw(N){let B=v.lev,Z=E(B);if(er(e,g,{resL:Z,pondL:Math.min(9,Math.max(7.8,Z))}),u.update(B),v.phase==="leak"||v.phase==="failed"){let Y=v.failRow,Q=1.8+1.7*p[Y],q=-(17.6-Q),_e=Math.max(.4,(jt[Y]+jt[Y+1])/2);if(!a())for(let pe=0;pe<3;pe++)e.em.spray.emit(-3+(Math.random()-.5)*4,_e,q+.2,(Math.random()-.5)*1.2,.4+Math.random(),3+Math.random()*3,.9,.2,.7)}e.frame(N)},destroy(){e.setHot([]),e.pickList=[],e.onTap=null,e.setAdvice(null),u.show=!1,u.group.visible=!1,u.fail=-1,y.rebuildDam(null)}}}function Qd(i,e){let{api:t,ctl:n,level:s}=i,r=i.kit,a=()=>r.reduced(),o=s,l=Math.min(3,1+(o-1>>1)),c=e.source;c.manual=!0,c.setLayout(l);let d=c.nodes,f=Object.keys(d).filter(P=>d[P].t==="fork"),h=Object.keys(d).filter(P=>d[P].t==="tgt"),m=6,x=18+3*Math.min(o-1,8),b={};h.forEach(P=>b[P]=0);let p=x*h.length,u=Math.max(1.3,1.9-.06*(o-1)),y=Math.round(p/m*u+5),v={t:0,done:!1,failed:!1,spilled:0},_=xl(c,m),E=os(s,i.up,{pin:9,M:1});e.setShot("source",!0);let w=["\u25C0","\u25C0\u25B6","\u25B6"],T=["A","B","C"],g=P=>{v.done||v.failed||(d[P].m=(d[P].m+1)%3,t.sfx("click"),t.inspect("fork:"+P),_=xl(c,m),e.dirty(),A())},M=f.map((P,L)=>Cn(n,"",()=>g(P),"104px"));function A(){f.forEach((P,L)=>{M[L].textContent="FORK "+T[L]+" "+w[d[P].m]})}A();let C=Mn.top+1.9;e.setHot(f.map((P,L)=>({label:"FORK "+T[L],text:()=>T[L]+" "+w[d[P].m],aria:"Fork "+T[L],anchor:new O(d[P].x,C,d[P].z),fn:()=>g(P),state:()=>({on:d[P].m!==1,run:!1})}))),e.pickList=c.hits.map(P=>({object:P,id:"fork:"+P.userData.fork})),e.onTap=P=>{P.indexOf("fork:")===0?g(P.slice(5)):t.inspect(P)},e.hotHidden=!1;let I=P=>$e(b[P]/x,0,1);return{H:E,tips:"Tap a fork (the lettered markers, or the wooden flap on the terrace) to turn it: \u25C0 everything left \xB7 \u25C0\u25B6 split 50/50 \xB7 \u25B6 everything right. Fill every basin before time runs out \u2014 the RESERVOIR chute is a waterfall into the lake, and a full basin spills, so send the water on to the next one.",explain:"Water always follows the open channel downhill, and it separates wherever a channel forks. Controlling the forks controls where the water goes \u2014 and any water sent to a full basin or the scree drain is wasted.",hint:"Send all the water to one basin first, then turn the fork to the next. Never leave a fork pointing at the scree drain or at a basin that's already full.",celebrateMs:1500,gauges:[{id:"q",label:"SPRING FLOW"}].concat(h.map(P=>({id:P,label:d[P].name}))).concat([{id:"time",label:"TIME LEFT"}]),step(P){if(!e.introDone&&!a()||v.done||v.failed)return;v.t+=P,_=xl(c,m);let L=!0;h.forEach(F=>{let N=_.flows[F]||0;b[F]<x?b[F]=Math.min(x,b[F]+N*P):v.spilled+=N*P,b[F]<x-1e-6&&(L=!1)}),L?v.done=!0:v.t>=y&&(v.failed=!0)},status(){return v.done?"success":v.failed?"fail":"playing"},efficient(){return v.done&&v.t<=y*.8},failReason(){return"Time ran out. "+h.map(P=>d[P].name+" "+Math.round(I(P)*100)+"%").join(" \xB7 ")+"."},celebrate(){e.celebrate()},skipIntro(){e.skipIntro()},project:(P,L,F)=>e.project(P,L,F),pixels:()=>e.pixels(),_view:{cam:e.cam},dbg(){let P=e.info();return{Q0:m,need:x,TL:y,t:v.t,modes:f.map(L=>d[L].m),targets:h.map(L=>({id:L,name:d[L].name,v:b[L],need:x})),flows:Object.assign({},_.flows),lost:Object.keys(_.drain).reduce((L,F)=>L+_.drain[F],0),spilled:v.spilled,fall:_.flows.T1||0,c:l,introDone:e.introDone,info:P.info,mem:P.mem,quality:P.quality,resL:e.vs.resL}},gauge(P){P.gauge("q",nt(m)+" L/s",1),h.forEach(B=>{let Z=I(B);P.gauge(B,Math.round(Z*100)+"%",Z,{tone:Z>=.999?"good":""})});let L=Math.max(0,y-v.t);P.gauge("time",nt(L)+" s",L/y,{tone:L<4?"warn":""});let F=Object.keys(_.drain).reduce((B,Z)=>B+_.drain[Z],0),N=h.reduce((B,Z)=>B+(b[Z]>=x-1e-6&&_.flows[Z]||0),0);e.setAdvice(F>.2?{tone:"warn",text:"WATER IS BEING LOST DOWN THE SCREE DRAIN \u2014 turn the fork"}:N>.2?{tone:"warn",text:"A FULL BASIN IS SPILLING \u2014 send the water on to the next one"}:{tone:"good",text:"ALL THE WATER IS GOING TO USE"})},inspect(P){if(P.indexOf("fork:")===0){let L=P.slice(5);return{t:"FORK "+T[f.indexOf(L)],b:["Sends everything LEFT.","Splits 50/50.","Sends everything RIGHT."][d[L].m]+" Tap to change."}}return null},draw(P){let L=_.flows.T1||0,F=6+3*I("T1"),N={};h.forEach(B=>N[B]=I(B)),c.apply({Qmax:m,edge:_.edge,fill:N,drain:_.drain,fall:L}),er(e,E,{resL:F,Qrel:0}),e.vs.resL=F,e.frame(P)},destroy(){e.setHot([]),e.pickList=[],e.onTap=null,e.setAdvice(null),c.manual=!1,c.setLayout(1)}}}function M_(){try{let i=document.createElement("canvas"),e=i.getContext("webgl2",{failIfMajorPerformanceCaveat:!1});if(!e)return!1;let t=e.getExtension("WEBGL_lose_context");return t&&t.loseContext(),!0}catch{return!1}}var jd={0:Qd,1:$d,2:Jd,3:Zd,4:Yd,5:Kd},ls=null;function b_(i){let e=i.holder||(i.holder={});if(!e.stage){let t=performance.now(),n=Xd(i);n.buildMs=Math.round(performance.now()-t),e.stage=qd(n),ls=e.stage}return e.stage}window.DamBuilder3D={version:"V2.2.20",supported:M_,tier:ah,has:i=>!!jd[i],perfReport:()=>ls&&ls.perfReport?ls.perfReport():null,perfReset:()=>ls&&ls.perfReset&&ls.perfReset(),create(i,e){let t=jd[i];if(!t)return null;let n=b_(e),s=t(e,n);return s&&(s.probe=()=>n.probe()),s},dispose(i){i&&i.stage&&(i.stage.dispose(),i.stage=null)}};})();
