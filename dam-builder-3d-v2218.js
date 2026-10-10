(()=>{var $h=0,oc=1,Kh=2;var Ur=1,ho=2,Os=3,Ci=0,Kt=1,sn=2,Yn=0,Ri=1,lc=2,cc=3,hc=4,Qh=5;var Zi=100,jh=101,eu=102,tu=103,nu=104,iu=200,su=201,ru=202,au=203,uc=204,dc=205,ou=206,lu=207,cu=208,hu=209,uu=210,du=211,fu=212,pu=213,mu=214,Ca=0,Ra=1,Ia=2,bs=3,Pa=4,La=5,Da=6,Na=7,fc=0,gu=1,xu=2,On=0,pc=1,mc=2,gc=3,Fr=4,xc=5,_c=6,vc=7;var yc=300,Ii=301,Ji=302,uo=303,fo=304,Or=306,Si=1e3,Hn=1001,Ua=1002,Zt=1003,_u=1004;var Br=1005;var kt=1006,po=1007;var En=1008;var dn=1009,Mc=1010,bc=1011,Bs=1012,mo=1013,Bn=1014,Tn=1015,vn=1016,go=1017,xo=1018,zs=1020,Sc=35902,wc=35899,Ec=1021,Tc=1022,An=1023,Wn=1026,Pi=1027,_o=1028,vo=1029,Li=1030,yo=1031;var Mo=1033,zr=33776,kr=33777,Vr=33778,Gr=33779,bo=35840,So=35841,wo=35842,Eo=35843,To=36196,Ao=37492,Co=37496,Ro=37488,Io=37489,Hr=37490,Po=37491,Lo=37808,Do=37809,No=37810,Uo=37811,Fo=37812,Oo=37813,Bo=37814,zo=37815,ko=37816,Vo=37817,Go=37818,Ho=37819,Wo=37820,Xo=37821,qo=36492,Yo=36494,Zo=36495,Jo=36283,$o=36284,Wr=36285,Ko=36286;var or=2300,Fa=2301,Ta=2302,Yl=2303,Zl=2400,Jl=2401,$l=2402;var vu=3200;var Qo=0,yu=1,li="",Jt="srgb",lr="srgb-linear",cr="linear",Mt="srgb";var Aa=7680;var Mu=519,bu=512,Su=513,wu=514,jo=515,Eu=516,Tu=517,el=518,Au=519,Cu=35044,Xr=35048;var Ac="300 es",Nn=2e3,Ss=2001;function of(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function lf(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function hr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ru(){let i=hr("canvas");return i.style.display="block",i}var xh={},ws=null;function Cc(...i){let e="THREE."+i.shift();ws?ws("log",e,...i):console.log(e,...i)}function Iu(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function $e(...i){i=Iu(i);let e="THREE."+i.shift();if(ws)ws("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Je(...i){i=Iu(i);let e="THREE."+i.shift();if(ws)ws("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Vi(...i){let e=i.join(" ");e in xh||(xh[e]=!0,$e(...i))}function Pu(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Lu={[Ca]:Ra,[Ia]:Da,[Pa]:Na,[bs]:La,[Ra]:Ca,[Da]:Ia,[Na]:Pa,[La]:bs},Xn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Ml=Math.PI/180,Oa=180/Math.PI;function ks(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(tn[i&255]+tn[i>>8&255]+tn[i>>16&255]+tn[i>>24&255]+"-"+tn[e&255]+tn[e>>8&255]+"-"+tn[e>>16&15|64]+tn[e>>24&255]+"-"+tn[t&63|128]+tn[t>>8&255]+"-"+tn[t>>16&255]+tn[t>>24&255]+tn[n&255]+tn[n>>8&255]+tn[n>>16&255]+tn[n>>24&255]).toLowerCase()}function ht(i,e,t){return Math.max(e,Math.min(t,i))}function cf(i,e){return(i%e+e)%e}function bl(i,e,t){return(1-t)*i+t*e}function Ks(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function hn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Nc=class Nc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ht(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ht(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Nc.prototype.isVector2=!0;var pe=Nc,Sn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],d=n[s+2],f=n[s+3],h=r[a+0],m=r[a+1],g=r[a+2],b=r[a+3];if(f!==b||l!==h||c!==m||d!==g){let p=l*h+c*m+d*g+f*b;p<0&&(h=-h,m=-m,g=-g,b=-b,p=-p);let u=1-o;if(p<.9995){let y=Math.acos(p),v=Math.sin(y);u=Math.sin(u*y)/v,o=Math.sin(o*y)/v,l=l*u+h*o,c=c*u+m*o,d=d*u+g*o,f=f*u+b*o}else{l=l*u+h*o,c=c*u+m*o,d=d*u+g*o,f=f*u+b*o;let y=1/Math.sqrt(l*l+c*c+d*d+f*f);l*=y,c*=y,d*=y,f*=y}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],d=n[s+3],f=r[a],h=r[a+1],m=r[a+2],g=r[a+3];return e[t]=o*g+d*f+l*m-c*h,e[t+1]=l*g+d*h+c*f-o*m,e[t+2]=c*g+d*m+o*h-l*f,e[t+3]=d*g-o*f-l*h-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),d=o(s/2),f=o(r/2),h=l(n/2),m=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=h*d*f+c*m*g,this._y=c*m*f-h*d*g,this._z=c*d*g+h*m*f,this._w=c*d*f-h*m*g;break;case"YXZ":this._x=h*d*f+c*m*g,this._y=c*m*f-h*d*g,this._z=c*d*g-h*m*f,this._w=c*d*f+h*m*g;break;case"ZXY":this._x=h*d*f-c*m*g,this._y=c*m*f+h*d*g,this._z=c*d*g+h*m*f,this._w=c*d*f-h*m*g;break;case"ZYX":this._x=h*d*f-c*m*g,this._y=c*m*f+h*d*g,this._z=c*d*g-h*m*f,this._w=c*d*f+h*m*g;break;case"YZX":this._x=h*d*f+c*m*g,this._y=c*m*f+h*d*g,this._z=c*d*g-h*m*f,this._w=c*d*f-h*m*g;break;case"XZY":this._x=h*d*f-c*m*g,this._y=c*m*f-h*d*g,this._z=c*d*g+h*m*f,this._w=c*d*f+h*m*g;break;default:$e("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],d=t[6],f=t[10],h=n+o+f;if(h>0){let m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(d-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(n>o&&n>f){let m=2*Math.sqrt(1+n-o-f);this._w=(d-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>f){let m=2*Math.sqrt(1+o-n-f);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+d)/m}else{let m=2*Math.sqrt(1+f-n-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ht(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=n*d+a*o+s*c-r*l,this._y=s*d+a*l+r*o-n*c,this._z=r*d+a*c+n*l-s*o,this._w=a*d-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),d=Math.sin(c);l=Math.sin(l*c)/d,t=Math.sin(t*c)/d,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Uc=class Uc{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(_h.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(_h.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),d=2*(o*t-r*s),f=2*(r*n-a*t);return this.x=t+l*c+a*f-o*d,this.y=n+l*d+o*c-r*f,this.z=s+l*f+r*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this.z=ht(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this.z=ht(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ht(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Sl.copy(this).projectOnVector(e),this.sub(Sl)}reflect(e){return this.sub(Sl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ht(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Uc.prototype.isVector3=!0;var B=Uc,Sl=new B,_h=new Sn,Fc=class Fc{constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=l,d[6]=n,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],d=n[4],f=n[7],h=n[2],m=n[5],g=n[8],b=s[0],p=s[3],u=s[6],y=s[1],v=s[4],_=s[7],E=s[2],S=s[5],T=s[8];return r[0]=a*b+o*y+l*E,r[3]=a*p+o*v+l*S,r[6]=a*u+o*_+l*T,r[1]=c*b+d*y+f*E,r[4]=c*p+d*v+f*S,r[7]=c*u+d*_+f*T,r[2]=h*b+m*y+g*E,r[5]=h*p+m*v+g*S,r[8]=h*u+m*_+g*T,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*a*d-t*o*c-n*r*d+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],f=d*a-o*c,h=o*l-d*r,m=c*r-a*l,g=t*f+n*h+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let b=1/g;return e[0]=f*b,e[1]=(s*c-d*n)*b,e[2]=(o*n-s*a)*b,e[3]=h*b,e[4]=(d*t-s*l)*b,e[5]=(s*r-o*t)*b,e[6]=m*b,e[7]=(n*l-c*t)*b,e[8]=(a*t-n*r)*b,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Vi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(wl.makeScale(e,t)),this}rotate(e){return Vi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(wl.makeRotation(-e)),this}translate(e,t){return Vi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(wl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Fc.prototype.isMatrix3=!0;var tt=Fc,wl=new tt,vh=new tt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),yh=new tt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function hf(){let i={enabled:!0,workingColorSpace:lr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Mt&&(s.r=ni(s.r),s.g=ni(s.g),s.b=ni(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Mt&&(s.r=Ms(s.r),s.g=Ms(s.g),s.b=Ms(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===li?cr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Vi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Vi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[lr]:{primaries:e,whitePoint:n,transfer:cr,toXYZ:vh,fromXYZ:yh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Jt},outputColorSpaceConfig:{drawingBufferColorSpace:Jt}},[Jt]:{primaries:e,whitePoint:n,transfer:Mt,toXYZ:vh,fromXYZ:yh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Jt}}}),i}var dt=hf();function ni(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ms(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var os,Ba=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{os===void 0&&(os=hr("canvas")),os.width=e.width,os.height=e.height;let s=os.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=os}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=hr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ni(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ni(t[n]/255)*255):t[n]=ni(t[n]);return{data:t,width:e.width,height:e.height}}else return $e("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},uf=0,Es=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:uf++}),this.uuid=ks(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(El(s[a].image)):r.push(El(s[a]))}else r=El(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function El(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ba.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:($e("Texture: Unable to serialize Texture."),{})}var df=0,Tl=new B,cn=class i extends Xn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Hn,s=Hn,r=kt,a=En,o=An,l=dn,c=i.DEFAULT_ANISOTROPY,d=li){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:df++}),this.uuid=ks(),this.name="",this.source=new Es(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new pe(0,0),this.repeat=new pe(1,1),this.center=new pe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new tt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Tl).x}get height(){return this.source.getSize(Tl).y}get depth(){return this.source.getSize(Tl).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){$e(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){$e(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==yc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Si:e.x=e.x-Math.floor(e.x);break;case Hn:e.x=e.x<0?0:1;break;case Ua:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Si:e.y=e.y-Math.floor(e.y);break;case Hn:e.y=e.y<0?0:1;break;case Ua:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};cn.DEFAULT_IMAGE=null;cn.DEFAULT_MAPPING=yc;cn.DEFAULT_ANISOTROPY=1;var Oc=class Oc{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],d=l[4],f=l[8],h=l[1],m=l[5],g=l[9],b=l[2],p=l[6],u=l[10];if(Math.abs(d-h)<.01&&Math.abs(f-b)<.01&&Math.abs(g-p)<.01){if(Math.abs(d+h)<.1&&Math.abs(f+b)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(c+1)/2,_=(m+1)/2,E=(u+1)/2,S=(d+h)/4,T=(f+b)/4,x=(g+p)/4;return v>_&&v>E?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=S/n,r=T/n):_>E?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=S/s,r=x/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=T/r,s=x/r),this.set(n,s,r,t),this}let y=Math.sqrt((p-g)*(p-g)+(f-b)*(f-b)+(h-d)*(h-d));return Math.abs(y)<.001&&(y=1),this.x=(p-g)/y,this.y=(f-b)/y,this.z=(h-d)/y,this.w=Math.acos((c+m+u-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this.z=ht(this.z,e.z,t.z),this.w=ht(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this.z=ht(this.z,e,t),this.w=ht(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ht(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Oc.prototype.isVector4=!0;var It=Oc,za=class extends Xn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:kt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new It(0,0,e,t),this.scissorTest=!1,this.viewport=new It(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new cn(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:kt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Es(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},un=class extends za{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},ur=class extends cn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=Hn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var ka=class extends cn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=Hn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var co=class co{constructor(e,t,n,s,r,a,o,l,c,d,f,h,m,g,b,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,d,f,h,m,g,b,p)}set(e,t,n,s,r,a,o,l,c,d,f,h,m,g,b,p){let u=this.elements;return u[0]=e,u[4]=t,u[8]=n,u[12]=s,u[1]=r,u[5]=a,u[9]=o,u[13]=l,u[2]=c,u[6]=d,u[10]=f,u[14]=h,u[3]=m,u[7]=g,u[11]=b,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new co().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/ls.setFromMatrixColumn(e,0).length(),r=1/ls.setFromMatrixColumn(e,1).length(),a=1/ls.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),d=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){let h=a*d,m=a*f,g=o*d,b=o*f;t[0]=l*d,t[4]=-l*f,t[8]=c,t[1]=m+g*c,t[5]=h-b*c,t[9]=-o*l,t[2]=b-h*c,t[6]=g+m*c,t[10]=a*l}else if(e.order==="YXZ"){let h=l*d,m=l*f,g=c*d,b=c*f;t[0]=h+b*o,t[4]=g*o-m,t[8]=a*c,t[1]=a*f,t[5]=a*d,t[9]=-o,t[2]=m*o-g,t[6]=b+h*o,t[10]=a*l}else if(e.order==="ZXY"){let h=l*d,m=l*f,g=c*d,b=c*f;t[0]=h-b*o,t[4]=-a*f,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*d,t[9]=b-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let h=a*d,m=a*f,g=o*d,b=o*f;t[0]=l*d,t[4]=g*c-m,t[8]=h*c+b,t[1]=l*f,t[5]=b*c+h,t[9]=m*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let h=a*l,m=a*c,g=o*l,b=o*c;t[0]=l*d,t[4]=b-h*f,t[8]=g*f+m,t[1]=f,t[5]=a*d,t[9]=-o*d,t[2]=-c*d,t[6]=m*f+g,t[10]=h-b*f}else if(e.order==="XZY"){let h=a*l,m=a*c,g=o*l,b=o*c;t[0]=l*d,t[4]=-f,t[8]=c*d,t[1]=h*f+b,t[5]=a*d,t[9]=m*f-g,t[2]=g*f-m,t[6]=o*d,t[10]=b*f+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ff,e,pf)}lookAt(e,t,n){let s=this.elements;return fn.subVectors(e,t),fn.lengthSq()===0&&(fn.z=1),fn.normalize(),xi.crossVectors(n,fn),xi.lengthSq()===0&&(Math.abs(n.z)===1?fn.x+=1e-4:fn.z+=1e-4,fn.normalize(),xi.crossVectors(n,fn)),xi.normalize(),na.crossVectors(fn,xi),s[0]=xi.x,s[4]=na.x,s[8]=fn.x,s[1]=xi.y,s[5]=na.y,s[9]=fn.y,s[2]=xi.z,s[6]=na.z,s[10]=fn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],d=n[1],f=n[5],h=n[9],m=n[13],g=n[2],b=n[6],p=n[10],u=n[14],y=n[3],v=n[7],_=n[11],E=n[15],S=s[0],T=s[4],x=s[8],M=s[12],A=s[1],I=s[5],R=s[9],L=s[13],P=s[2],F=s[6],U=s[10],z=s[14],q=s[3],W=s[7],Z=s[11],j=s[15];return r[0]=a*S+o*A+l*P+c*q,r[4]=a*T+o*I+l*F+c*W,r[8]=a*x+o*R+l*U+c*Z,r[12]=a*M+o*L+l*z+c*j,r[1]=d*S+f*A+h*P+m*q,r[5]=d*T+f*I+h*F+m*W,r[9]=d*x+f*R+h*U+m*Z,r[13]=d*M+f*L+h*z+m*j,r[2]=g*S+b*A+p*P+u*q,r[6]=g*T+b*I+p*F+u*W,r[10]=g*x+b*R+p*U+u*Z,r[14]=g*M+b*L+p*z+u*j,r[3]=y*S+v*A+_*P+E*q,r[7]=y*T+v*I+_*F+E*W,r[11]=y*x+v*R+_*U+E*Z,r[15]=y*M+v*L+_*z+E*j,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],f=e[6],h=e[10],m=e[14],g=e[3],b=e[7],p=e[11],u=e[15],y=l*m-c*h,v=o*m-c*f,_=o*h-l*f,E=a*m-c*d,S=a*h-l*d,T=a*f-o*d;return t*(b*y-p*v+u*_)-n*(g*y-p*E+u*S)+s*(g*v-b*E+u*T)-r*(g*_-b*S+p*T)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],d=e[10];return t*(a*d-o*c)-n*(r*d-o*l)+s*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],f=e[9],h=e[10],m=e[11],g=e[12],b=e[13],p=e[14],u=e[15],y=t*o-n*a,v=t*l-s*a,_=t*c-r*a,E=n*l-s*o,S=n*c-r*o,T=s*c-r*l,x=d*b-f*g,M=d*p-h*g,A=d*u-m*g,I=f*p-h*b,R=f*u-m*b,L=h*u-m*p,P=y*L-v*R+_*I+E*A-S*M+T*x;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let F=1/P;return e[0]=(o*L-l*R+c*I)*F,e[1]=(s*R-n*L-r*I)*F,e[2]=(b*T-p*S+u*E)*F,e[3]=(h*S-f*T-m*E)*F,e[4]=(l*A-a*L-c*M)*F,e[5]=(t*L-s*A+r*M)*F,e[6]=(p*_-g*T-u*v)*F,e[7]=(d*T-h*_+m*v)*F,e[8]=(a*R-o*A+c*x)*F,e[9]=(n*A-t*R-r*x)*F,e[10]=(g*S-b*_+u*y)*F,e[11]=(f*_-d*S-m*y)*F,e[12]=(o*M-a*I-l*x)*F,e[13]=(t*I-n*M+s*x)*F,e[14]=(b*v-g*E-p*y)*F,e[15]=(d*E-f*v+h*y)*F,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,d=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,d*o+n,d*l-s*a,0,c*l-s*o,d*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,d=a+a,f=o+o,h=r*c,m=r*d,g=r*f,b=a*d,p=a*f,u=o*f,y=l*c,v=l*d,_=l*f,E=n.x,S=n.y,T=n.z;return s[0]=(1-(b+u))*E,s[1]=(m+_)*E,s[2]=(g-v)*E,s[3]=0,s[4]=(m-_)*S,s[5]=(1-(h+u))*S,s[6]=(p+y)*S,s[7]=0,s[8]=(g+v)*T,s[9]=(p-y)*T,s[10]=(1-(h+b))*T,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=ls.set(s[0],s[1],s[2]).length(),o=ls.set(s[4],s[5],s[6]).length(),l=ls.set(s[8],s[9],s[10]).length();r<0&&(a=-a),In.copy(this);let c=1/a,d=1/o,f=1/l;return In.elements[0]*=c,In.elements[1]*=c,In.elements[2]*=c,In.elements[4]*=d,In.elements[5]*=d,In.elements[6]*=d,In.elements[8]*=f,In.elements[9]*=f,In.elements[10]*=f,t.setFromRotationMatrix(In),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=Nn,l=!1){let c=this.elements,d=2*r/(t-e),f=2*r/(n-s),h=(t+e)/(t-e),m=(n+s)/(n-s),g,b;if(l)g=r/(a-r),b=a*r/(a-r);else if(o===Nn)g=-(a+r)/(a-r),b=-2*a*r/(a-r);else if(o===Ss)g=-a/(a-r),b=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=f,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=b,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Nn,l=!1){let c=this.elements,d=2/(t-e),f=2/(n-s),h=-(t+e)/(t-e),m=-(n+s)/(n-s),g,b;if(l)g=1/(a-r),b=a/(a-r);else if(o===Nn)g=-2/(a-r),b=-(a+r)/(a-r);else if(o===Ss)g=-1/(a-r),b=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=f,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=g,c[14]=b,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};co.prototype.isMatrix4=!0;var gt=co,ls=new B,In=new gt,ff=new B(0,0,0),pf=new B(1,1,1),xi=new B,na=new B,fn=new B,Mh=new gt,bh=new Sn,Un=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],d=s[9],f=s[2],h=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(ht(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ht(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(ht(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ht(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ht(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-ht(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,m),this._y=0);break;default:$e("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Mh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Mh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return bh.setFromEuler(this),this.setFromQuaternion(bh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Un.DEFAULT_ORDER="XYZ";var Ts=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},mf=0,Sh=new B,cs=new Sn,Kn=new gt,ia=new B,Qs=new B,gf=new B,xf=new Sn,wh=new B(1,0,0),Eh=new B(0,1,0),Th=new B(0,0,1),Ah={type:"added"},_f={type:"removed"},hs={type:"childadded",child:null},Al={type:"childremoved",child:null},Ot=class i extends Xn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:mf++}),this.uuid=ks(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new B,t=new Un,n=new Sn,s=new B(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new gt},normalMatrix:{value:new tt}}),this.matrix=new gt,this.matrixWorld=new gt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ts,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return cs.setFromAxisAngle(e,t),this.quaternion.multiply(cs),this}rotateOnWorldAxis(e,t){return cs.setFromAxisAngle(e,t),this.quaternion.premultiply(cs),this}rotateX(e){return this.rotateOnAxis(wh,e)}rotateY(e){return this.rotateOnAxis(Eh,e)}rotateZ(e){return this.rotateOnAxis(Th,e)}translateOnAxis(e,t){return Sh.copy(e).applyQuaternion(this.quaternion),this.position.add(Sh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wh,e)}translateY(e){return this.translateOnAxis(Eh,e)}translateZ(e){return this.translateOnAxis(Th,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Kn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ia.copy(e):ia.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Qs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Kn.lookAt(Qs,ia,this.up):Kn.lookAt(ia,Qs,this.up),this.quaternion.setFromRotationMatrix(Kn),s&&(Kn.extractRotation(s.matrixWorld),cs.setFromRotationMatrix(Kn),this.quaternion.premultiply(cs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Je("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ah),hs.child=e,this.dispatchEvent(hs),hs.child=null):Je("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(_f),Al.child=e,this.dispatchEvent(Al),Al.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Kn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Kn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Kn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ah),hs.child=e,this.dispatchEvent(hs),hs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,e,gf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,xf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){let f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),f=a(e.shapes),h=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),d.length>0&&(n.images=d),f.length>0&&(n.shapes=f),h.length>0&&(n.skeletons=h),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){let l=[];for(let c in o){let d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Ot.DEFAULT_UP=new B(0,1,0);Ot.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var at=class extends Ot{constructor(){super(),this.isGroup=!0,this.type="Group"}},vf={type:"move"},As=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new at,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new at,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new at,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let b of e.hand.values()){let p=t.getJointPose(b,n),u=this._getHandJoint(c,b);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}let d=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=d.position.distanceTo(f.position),m=.02,g=.005;c.inputState.pinching&&h>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(vf)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new at;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Du={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_i={h:0,s:0,l:0},sa={h:0,s:0,l:0};function Cl(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Te=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Jt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,dt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=dt.workingColorSpace){return this.r=e,this.g=t,this.b=n,dt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=dt.workingColorSpace){if(e=cf(e,1),t=ht(t,0,1),n=ht(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Cl(a,r,e+1/3),this.g=Cl(a,r,e),this.b=Cl(a,r,e-1/3)}return dt.colorSpaceToWorking(this,s),this}setStyle(e,t=Jt){function n(r){r!==void 0&&parseFloat(r)<1&&$e("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:$e("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);$e("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Jt){let n=Du[e.toLowerCase()];return n!==void 0?this.setHex(n,t):$e("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ni(e.r),this.g=ni(e.g),this.b=ni(e.b),this}copyLinearToSRGB(e){return this.r=Ms(e.r),this.g=Ms(e.g),this.b=Ms(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Jt){return dt.workingToColorSpace(nn.copy(this),e),Math.round(ht(nn.r*255,0,255))*65536+Math.round(ht(nn.g*255,0,255))*256+Math.round(ht(nn.b*255,0,255))}getHexString(e=Jt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=dt.workingColorSpace){dt.workingToColorSpace(nn.copy(this),t);let n=nn.r,s=nn.g,r=nn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,d=(o+a)/2;if(o===a)l=0,c=0;else{let f=a-o;switch(c=d<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=dt.workingColorSpace){return dt.workingToColorSpace(nn.copy(this),t),e.r=nn.r,e.g=nn.g,e.b=nn.b,e}getStyle(e=Jt){dt.workingToColorSpace(nn.copy(this),e);let t=nn.r,n=nn.g,s=nn.b;return e!==Jt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(_i),this.setHSL(_i.h+e,_i.s+t,_i.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(_i),e.getHSL(sa);let n=bl(_i.h,sa.h,t),s=bl(_i.s,sa.s,t),r=bl(_i.l,sa.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},nn=new Te;Te.NAMES=Du;var dr=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Te(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var Gi=class extends Ot{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Un,this.environmentIntensity=1,this.environmentRotation=new Un,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Pn=new B,Qn=new B,Rl=new B,jn=new B,us=new B,ds=new B,Ch=new B,Il=new B,Pl=new B,Ll=new B,Dl=new It,Nl=new It,Ul=new It,bi=class i{constructor(e=new B,t=new B,n=new B){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Pn.subVectors(e,t),s.cross(Pn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Pn.subVectors(s,t),Qn.subVectors(n,t),Rl.subVectors(e,t);let a=Pn.dot(Pn),o=Pn.dot(Qn),l=Pn.dot(Rl),c=Qn.dot(Qn),d=Qn.dot(Rl),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;let h=1/f,m=(c*l-o*d)*h,g=(a*d-o*l)*h;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,jn)===null?!1:jn.x>=0&&jn.y>=0&&jn.x+jn.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,jn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,jn.x),l.addScaledVector(a,jn.y),l.addScaledVector(o,jn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return Dl.setScalar(0),Nl.setScalar(0),Ul.setScalar(0),Dl.fromBufferAttribute(e,t),Nl.fromBufferAttribute(e,n),Ul.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Dl,r.x),a.addScaledVector(Nl,r.y),a.addScaledVector(Ul,r.z),a}static isFrontFacing(e,t,n,s){return Pn.subVectors(n,t),Qn.subVectors(e,t),Pn.cross(Qn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Pn.subVectors(this.c,this.b),Qn.subVectors(this.a,this.b),Pn.cross(Qn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;us.subVectors(s,n),ds.subVectors(r,n),Il.subVectors(e,n);let l=us.dot(Il),c=ds.dot(Il);if(l<=0&&c<=0)return t.copy(n);Pl.subVectors(e,s);let d=us.dot(Pl),f=ds.dot(Pl);if(d>=0&&f<=d)return t.copy(s);let h=l*f-d*c;if(h<=0&&l>=0&&d<=0)return a=l/(l-d),t.copy(n).addScaledVector(us,a);Ll.subVectors(e,r);let m=us.dot(Ll),g=ds.dot(Ll);if(g>=0&&m<=g)return t.copy(r);let b=m*c-l*g;if(b<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(ds,o);let p=d*g-m*f;if(p<=0&&f-d>=0&&m-g>=0)return Ch.subVectors(r,s),o=(f-d)/(f-d+(m-g)),t.copy(s).addScaledVector(Ch,o);let u=1/(p+b+h);return a=b*u,o=h*u,t.copy(n).addScaledVector(us,a).addScaledVector(ds,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},qn=class{constructor(e=new B(1/0,1/0,1/0),t=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Ln.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Ln.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Ln.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Ln):Ln.fromBufferAttribute(r,a),Ln.applyMatrix4(e.matrixWorld),this.expandByPoint(Ln);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ra.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ra.copy(n.boundingBox)),ra.applyMatrix4(e.matrixWorld),this.union(ra)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ln),Ln.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(js),aa.subVectors(this.max,js),fs.subVectors(e.a,js),ps.subVectors(e.b,js),ms.subVectors(e.c,js),vi.subVectors(ps,fs),yi.subVectors(ms,ps),Fi.subVectors(fs,ms);let t=[0,-vi.z,vi.y,0,-yi.z,yi.y,0,-Fi.z,Fi.y,vi.z,0,-vi.x,yi.z,0,-yi.x,Fi.z,0,-Fi.x,-vi.y,vi.x,0,-yi.y,yi.x,0,-Fi.y,Fi.x,0];return!Fl(t,fs,ps,ms,aa)||(t=[1,0,0,0,1,0,0,0,1],!Fl(t,fs,ps,ms,aa))?!1:(oa.crossVectors(vi,yi),t=[oa.x,oa.y,oa.z],Fl(t,fs,ps,ms,aa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ln).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ln).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ei[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ei[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ei[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ei[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ei[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ei[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ei[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ei[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ei),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ei=[new B,new B,new B,new B,new B,new B,new B,new B],Ln=new B,ra=new qn,fs=new B,ps=new B,ms=new B,vi=new B,yi=new B,Fi=new B,js=new B,aa=new B,oa=new B,Oi=new B;function Fl(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Oi.fromArray(i,r);let o=s.x*Math.abs(Oi.x)+s.y*Math.abs(Oi.y)+s.z*Math.abs(Oi.z),l=e.dot(Oi),c=t.dot(Oi),d=n.dot(Oi);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}var zt=new B,la=new pe,yf=0,Yt=class extends Xn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:yf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Cu,this.updateRanges=[],this.gpuType=Tn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)la.fromBufferAttribute(this,t),la.applyMatrix3(e),this.setXY(t,la.x,la.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyMatrix3(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyMatrix4(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyNormalMatrix(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.transformDirection(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ks(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=hn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ks(t,this.array)),t}setX(e,t){return this.normalized&&(t=hn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ks(t,this.array)),t}setY(e,t){return this.normalized&&(t=hn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ks(t,this.array)),t}setZ(e,t){return this.normalized&&(t=hn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ks(t,this.array)),t}setW(e,t){return this.normalized&&(t=hn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=hn(t,this.array),n=hn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=hn(t,this.array),n=hn(n,this.array),s=hn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=hn(t,this.array),n=hn(n,this.array),s=hn(s,this.array),r=hn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var fr=class extends Yt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var pr=class extends Yt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var He=class extends Yt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Mf=new qn,er=new B,Ol=new B,ii=class{constructor(e=new B,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Mf.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;er.subVectors(e,this.center);let t=er.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(er,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ol.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(er.copy(e.center).add(Ol)),this.expandByPoint(er.copy(e.center).sub(Ol))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},bf=0,bn=new gt,Bl=new Ot,gs=new B,pn=new qn,tr=new qn,qt=new B,St=class i extends Xn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:bf++}),this.uuid=ks(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(of(e)?pr:fr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new tt().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return bn.makeRotationFromQuaternion(e),this.applyMatrix4(bn),this}rotateX(e){return bn.makeRotationX(e),this.applyMatrix4(bn),this}rotateY(e){return bn.makeRotationY(e),this.applyMatrix4(bn),this}rotateZ(e){return bn.makeRotationZ(e),this.applyMatrix4(bn),this}translate(e,t,n){return bn.makeTranslation(e,t,n),this.applyMatrix4(bn),this}scale(e,t,n){return bn.makeScale(e,t,n),this.applyMatrix4(bn),this}lookAt(e){return Bl.lookAt(e),Bl.updateMatrix(),this.applyMatrix4(Bl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gs).negate(),this.translate(gs.x,gs.y,gs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new He(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&$e("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];pn.setFromBufferAttribute(r),this.morphTargetsRelative?(qt.addVectors(this.boundingBox.min,pn.min),this.boundingBox.expandByPoint(qt),qt.addVectors(this.boundingBox.max,pn.max),this.boundingBox.expandByPoint(qt)):(this.boundingBox.expandByPoint(pn.min),this.boundingBox.expandByPoint(pn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Je('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ii);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(e){let n=this.boundingSphere.center;if(pn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];tr.setFromBufferAttribute(o),this.morphTargetsRelative?(qt.addVectors(pn.min,tr.min),pn.expandByPoint(qt),qt.addVectors(pn.max,tr.max),pn.expandByPoint(qt)):(pn.expandByPoint(tr.min),pn.expandByPoint(tr.max))}pn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)qt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(qt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)qt.fromBufferAttribute(o,c),l&&(gs.fromBufferAttribute(e,c),qt.add(gs)),s=Math.max(s,n.distanceToSquared(qt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Je('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Je("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Yt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let x=0;x<n.count;x++)o[x]=new B,l[x]=new B;let c=new B,d=new B,f=new B,h=new pe,m=new pe,g=new pe,b=new B,p=new B;function u(x,M,A){c.fromBufferAttribute(n,x),d.fromBufferAttribute(n,M),f.fromBufferAttribute(n,A),h.fromBufferAttribute(r,x),m.fromBufferAttribute(r,M),g.fromBufferAttribute(r,A),d.sub(c),f.sub(c),m.sub(h),g.sub(h);let I=1/(m.x*g.y-g.x*m.y);isFinite(I)&&(b.copy(d).multiplyScalar(g.y).addScaledVector(f,-m.y).multiplyScalar(I),p.copy(f).multiplyScalar(m.x).addScaledVector(d,-g.x).multiplyScalar(I),o[x].add(b),o[M].add(b),o[A].add(b),l[x].add(p),l[M].add(p),l[A].add(p))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let x=0,M=y.length;x<M;++x){let A=y[x],I=A.start,R=A.count;for(let L=I,P=I+R;L<P;L+=3)u(e.getX(L+0),e.getX(L+1),e.getX(L+2))}let v=new B,_=new B,E=new B,S=new B;function T(x){E.fromBufferAttribute(s,x),S.copy(E);let M=o[x];v.copy(M),v.sub(E.multiplyScalar(E.dot(M))).normalize(),_.crossVectors(S,M);let I=_.dot(l[x])<0?-1:1;a.setXYZW(x,v.x,v.y,v.z,I)}for(let x=0,M=y.length;x<M;++x){let A=y[x],I=A.start,R=A.count;for(let L=I,P=I+R;L<P;L+=3)T(e.getX(L+0)),T(e.getX(L+1)),T(e.getX(L+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Yt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,m=n.count;h<m;h++)n.setXYZ(h,0,0,0);let s=new B,r=new B,a=new B,o=new B,l=new B,c=new B,d=new B,f=new B;if(e)for(let h=0,m=e.count;h<m;h+=3){let g=e.getX(h+0),b=e.getX(h+1),p=e.getX(h+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,b),a.fromBufferAttribute(t,p),d.subVectors(a,r),f.subVectors(s,r),d.cross(f),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,b),c.fromBufferAttribute(n,p),o.add(d),l.add(d),c.add(d),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(b,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let h=0,m=t.count;h<m;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),d.subVectors(a,r),f.subVectors(s,r),d.cross(f),n.setXYZ(h+0,d.x,d.y,d.z),n.setXYZ(h+1,d.x,d.y,d.z),n.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)qt.fromBufferAttribute(e,t),qt.normalize(),e.setXYZ(t,qt.x,qt.y,qt.z)}toNonIndexed(){function e(o,l){let c=o.array,d=o.itemSize,f=o.normalized,h=new c.constructor(l.length*d),m=0,g=0;for(let b=0,p=l.length;b<p;b++){o.isInterleavedBufferAttribute?m=l[b]*o.data.stride+o.offset:m=l[b]*d;for(let u=0;u<d;u++)h[g++]=c[m++]}return new Yt(h,d,f)}if(this.index===null)return $e("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let d=0,f=c.length;d<f;d++){let h=c[d],m=e(h,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],d=[];for(let f=0,h=c.length;f<h;f++){let m=c[f];d.push(m.toJSON(e.data))}d.length>0&&(s[l]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let d=s[c];this.setAttribute(c,d.clone(t))}let r=e.morphAttributes;for(let c in r){let d=[],f=r[c];for(let h=0,m=f.length;h<m;h++)d.push(f[h].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,d=a.length;c<d;c++){let f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var zl=new B,Sf=new B,wf=new tt,Dn=class{constructor(e=new B(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=zl.subVectors(n,t).cross(Sf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(zl),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||wf.getNormalMatrix(e),s=this.coplanarPoint(zl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Ef=0,si=class extends Xn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=ks(),this.name="",this.type="Material",this.blending=Ri,this.side=Ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=uc,this.blendDst=dc,this.blendEquation=Zi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Te(0,0,0),this.blendAlpha=0,this.depthFunc=bs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Mu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Aa,this.stencilZFail=Aa,this.stencilZPass=Aa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){$e(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){$e(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Te().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Dn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new pe().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new pe().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var ti=new B,kl=new B,ca=new B,ha=new B,Cs=class{constructor(e=new B,t=new B(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ti)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ti.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ti.copy(this.origin).addScaledVector(this.direction,t),ti.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){kl.copy(e).add(t).multiplyScalar(.5),ca.copy(t).sub(e).normalize(),ha.copy(this.origin).sub(kl);let r=e.distanceTo(t)*.5,a=-this.direction.dot(ca),o=ha.dot(this.direction),l=-ha.dot(ca),c=ha.lengthSq(),d=Math.abs(1-a*a),f,h,m,g;if(d>0)if(f=a*l-o,h=a*o-l,g=r*d,f>=0)if(h>=-g)if(h<=g){let b=1/d;f*=b,h*=b,m=f*(f+a*h+2*o)+h*(a*f+h+2*l)+c}else h=r,f=Math.max(0,-(a*h+o)),m=-f*f+h*(h+2*l)+c;else h=-r,f=Math.max(0,-(a*h+o)),m=-f*f+h*(h+2*l)+c;else h<=-g?(f=Math.max(0,-(-a*r+o)),h=f>0?-r:Math.min(Math.max(-r,-l),r),m=-f*f+h*(h+2*l)+c):h<=g?(f=0,h=Math.min(Math.max(-r,-l),r),m=h*(h+2*l)+c):(f=Math.max(0,-(a*r+o)),h=f>0?r:Math.min(Math.max(-r,-l),r),m=-f*f+h*(h+2*l)+c);else h=a>0?-r:r,f=Math.max(0,-(a*h+o)),m=-f*f+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(kl).addScaledVector(ca,h),m}intersectSphere(e,t){if(e.radius<0)return null;ti.subVectors(e.center,this.origin);let n=ti.dot(this.direction),s=ti.dot(ti)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),d>=0?(r=(e.min.y-h.y)*d,a=(e.max.y-h.y)*d):(r=(e.max.y-h.y)*d,a=(e.min.y-h.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(o=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ti)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,d=o.z,f=e.x-a.x,h=e.y-a.y,m=e.z-a.z,g=t.x-a.x,b=t.y-a.y,p=t.z-a.z,u=n.x-a.x,y=n.y-a.y,v=n.z-a.z,_=Math.abs(l),E=Math.abs(c),S=Math.abs(d),T,x,M,A,I,R,L,P,F,U,z,q;if(_>=E&&_>=S?(M=l,R=f,F=g,q=u,l>=0?(T=c,x=d,A=h,I=m,L=b,P=p,U=y,z=v):(T=d,x=c,A=m,I=h,L=p,P=b,U=v,z=y)):E>=S?(M=c,R=h,F=b,q=y,c>=0?(T=d,x=l,A=m,I=f,L=p,P=g,U=v,z=u):(T=l,x=d,A=f,I=m,L=g,P=p,U=u,z=v)):(M=d,R=m,F=p,q=v,d>=0?(T=l,x=c,A=f,I=h,L=g,P=b,U=u,z=y):(T=c,x=l,A=h,I=f,L=b,P=g,U=y,z=u)),M===0)return null;let W=T/M,Z=x/M,j=1/M,xe=A-W*R,he=I-Z*R,Xe=L-W*F,qe=P-Z*F,nt=U-W*q,ee=z-Z*q,ie=nt*qe-ee*Xe,de=xe*ee-he*nt,ze=Xe*he-qe*xe;if(s){if(ie<0||de<0||ze<0)return null}else if((ie<0||de<0||ze<0)&&(ie>0||de>0||ze>0))return null;let fe=ie+de+ze;if(fe===0)return null;let De=j*(ie*R+de*F+ze*q);return(fe>0?De<0:De>0)?null:this.at(De/fe,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Hi=class extends si{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.combine=fc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Rh=new gt,Bi=new Cs,ua=new ii,Ih=new B,da=new B,fa=new B,pa=new B,Vl=new B,ma=new B,Ph=new B,ga=new B,We=class extends Ot{constructor(e=new St,t=new Hi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){ma.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let d=o[l],f=r[l];d!==0&&(Vl.fromBufferAttribute(f,e),a?ma.addScaledVector(Vl,d):ma.addScaledVector(Vl.sub(t),d))}t.add(ma)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ua.copy(n.boundingSphere),ua.applyMatrix4(r),Bi.copy(e.ray).recast(e.near),!(ua.containsPoint(Bi.origin)===!1&&(Bi.intersectSphere(ua,Ih)===null||Bi.origin.distanceToSquared(Ih)>(e.far-e.near)**2))&&(Rh.copy(r).invert(),Bi.copy(e.ray).applyMatrix4(Rh),!(n.boundingBox!==null&&Bi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Bi)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,d=r.attributes.uv1,f=r.attributes.normal,h=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,b=h.length;g<b;g++){let p=h[g],u=a[p.materialIndex],y=Math.max(p.start,m.start),v=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let _=y,E=v;_<E;_+=3){let S=o.getX(_),T=o.getX(_+1),x=o.getX(_+2);s=xa(this,u,e,n,c,d,f,S,T,x),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let g=Math.max(0,m.start),b=Math.min(o.count,m.start+m.count);for(let p=g,u=b;p<u;p+=3){let y=o.getX(p),v=o.getX(p+1),_=o.getX(p+2);s=xa(this,a,e,n,c,d,f,y,v,_),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,b=h.length;g<b;g++){let p=h[g],u=a[p.materialIndex],y=Math.max(p.start,m.start),v=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let _=y,E=v;_<E;_+=3){let S=_,T=_+1,x=_+2;s=xa(this,u,e,n,c,d,f,S,T,x),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let g=Math.max(0,m.start),b=Math.min(l.count,m.start+m.count);for(let p=g,u=b;p<u;p+=3){let y=p,v=p+1,_=p+2;s=xa(this,a,e,n,c,d,f,y,v,_),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}};function Tf(i,e,t,n,s,r,a,o){let l;if(e.side===Kt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Ci,o),l===null)return null;ga.copy(o),ga.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(ga);return c<t.near||c>t.far?null:{distance:c,point:ga.clone(),object:i}}function xa(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,da),i.getVertexPosition(l,fa),i.getVertexPosition(c,pa);let d=Tf(i,e,t,n,da,fa,pa,Ph);if(d){let f=new B;bi.getBarycoord(Ph,da,fa,pa,f),s&&(d.uv=bi.getInterpolatedAttribute(s,o,l,c,f,new pe)),r&&(d.uv1=bi.getInterpolatedAttribute(r,o,l,c,f,new pe)),a&&(d.normal=bi.getInterpolatedAttribute(a,o,l,c,f,new B),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));let h={a:o,b:l,c,normal:new B,materialIndex:0};bi.getNormal(da,fa,pa,h.normal),d.face=h,d.barycoord=f}return d}var mr=class extends cn{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Zt,d=Zt,f,h){super(null,a,o,l,c,d,s,r,f,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Rs=class extends Yt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},xs=new gt,Lh=new gt,_a=[],Dh=new qn,Af=new gt,nr=new We,ir=new ii,ri=class extends We{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Rs(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Af)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new qn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,xs),Dh.copy(e.boundingBox).applyMatrix4(xs),this.boundingBox.union(Dh)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ii),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,xs),ir.copy(e.boundingSphere).applyMatrix4(xs),this.boundingSphere.union(ir)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(nr.geometry=this.geometry,nr.material=this.material,nr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ir.copy(this.boundingSphere),ir.applyMatrix4(n),e.ray.intersectsSphere(ir)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,xs),Lh.multiplyMatrices(n,xs),nr.matrixWorld=Lh,nr.raycast(e,_a);for(let a=0,o=_a.length;a<o;a++){let l=_a[a];l.instanceId=r,l.object=this,t.push(l)}_a.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Rs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new mr(new Float32Array(s*this.count),s,this.count,_o,Tn));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},zi=new ii,Cf=new pe(.5,.5),va=new B,Is=class{constructor(e=new Dn,t=new Dn,n=new Dn,s=new Dn,r=new Dn,a=new Dn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Nn,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],d=r[4],f=r[5],h=r[6],m=r[7],g=r[8],b=r[9],p=r[10],u=r[11],y=r[12],v=r[13],_=r[14],E=r[15];if(s[0].setComponents(c-a,m-d,u-g,E-y).normalize(),s[1].setComponents(c+a,m+d,u+g,E+y).normalize(),s[2].setComponents(c+o,m+f,u+b,E+v).normalize(),s[3].setComponents(c-o,m-f,u-b,E-v).normalize(),n)s[4].setComponents(l,h,p,_).normalize(),s[5].setComponents(c-l,m-h,u-p,E-_).normalize();else if(s[4].setComponents(c-l,m-h,u-p,E-_).normalize(),t===Nn)s[5].setComponents(c+l,m+h,u+p,E+_).normalize();else if(t===Ss)s[5].setComponents(l,h,p,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),zi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),zi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(zi)}intersectsSprite(e){zi.center.set(0,0,0);let t=Cf.distanceTo(e.center);return zi.radius=.7071067811865476+t,zi.applyMatrix4(e.matrixWorld),this.intersectsSphere(zi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(va.x=s.normal.x>0?e.max.x:e.min.x,va.y=s.normal.y>0?e.max.y:e.min.y,va.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(va)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Va=class extends si{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Te(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Nh=new gt,Kl=new Cs,ya=new ii,Ma=new B,gr=class extends Ot{constructor(e=new St,t=new Va){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ya.copy(n.boundingSphere),ya.applyMatrix4(s),ya.radius+=r,e.ray.intersectsSphere(ya)===!1)return;Nh.copy(s).invert(),Kl.copy(e.ray).applyMatrix4(Nh);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,f=n.attributes.position;if(c!==null){let h=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let g=h,b=m;g<b;g++){let p=c.getX(g);Ma.fromBufferAttribute(f,p),Uh(Ma,p,l,s,e,t,this)}}else{let h=Math.max(0,a.start),m=Math.min(f.count,a.start+a.count);for(let g=h,b=m;g<b;g++)Ma.fromBufferAttribute(f,g),Uh(Ma,g,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Uh(i,e,t,n,s,r,a){let o=Kl.distanceSqToPoint(i);if(o<t){let l=new B;Kl.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var xr=class extends cn{constructor(e=[],t=Ii,n,s,r,a,o,l,c,d){super(e,t,n,s,r,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},_r=class extends cn{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var wi=class extends cn{constructor(e,t,n=Bn,s,r,a,o=Zt,l=Zt,c,d=Wn,f=1){if(d!==Wn&&d!==Pi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:f};super(h,s,r,a,o,l,d,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Es(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Ga=class extends wi{constructor(e,t=Bn,n=Ii,s,r,a=Zt,o=Zt,l,c=Wn){let d={width:e,height:e,depth:1},f=[d,d,d,d,d,d];super(e,e,t,n,s,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},vr=class extends cn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},mn=class i extends St{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],d=[],f=[],h=0,m=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new He(c,3)),this.setAttribute("normal",new He(d,3)),this.setAttribute("uv",new He(f,2));function g(b,p,u,y,v,_,E,S,T,x,M){let A=_/T,I=E/x,R=_/2,L=E/2,P=S/2,F=T+1,U=x+1,z=0,q=0,W=new B;for(let Z=0;Z<U;Z++){let j=Z*I-L;for(let xe=0;xe<F;xe++){let he=xe*A-R;W[b]=he*y,W[p]=j*v,W[u]=P,c.push(W.x,W.y,W.z),W[b]=0,W[p]=0,W[u]=S>0?1:-1,d.push(W.x,W.y,W.z),f.push(xe/T),f.push(1-Z/x),z+=1}}for(let Z=0;Z<x;Z++)for(let j=0;j<T;j++){let xe=h+j+F*Z,he=h+j+F*(Z+1),Xe=h+(j+1)+F*(Z+1),qe=h+(j+1)+F*Z;l.push(xe,he,qe),l.push(he,Xe,qe),q+=6}o.addGroup(m,q,M),m+=q,h+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Vt=class i extends St{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let d=[],f=[],h=[],m=[],g=0,b=[],p=n/2,u=0;y(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new He(f,3)),this.setAttribute("normal",new He(h,3)),this.setAttribute("uv",new He(m,2));function y(){let _=new B,E=new B,S=0,T=(t-e)/n;for(let x=0;x<=r;x++){let M=[],A=x/r,I=A*(t-e)+e;for(let R=0;R<=s;R++){let L=R/s,P=L*l+o,F=Math.sin(P),U=Math.cos(P);E.x=I*F,E.y=-A*n+p,E.z=I*U,f.push(E.x,E.y,E.z),_.set(F,T,U).normalize(),h.push(_.x,_.y,_.z),m.push(L,1-A),M.push(g++)}b.push(M)}for(let x=0;x<s;x++)for(let M=0;M<r;M++){let A=b[M][x],I=b[M+1][x],R=b[M+1][x+1],L=b[M][x+1];(e>0||M!==0)&&(d.push(A,I,L),S+=3),(t>0||M!==r-1)&&(d.push(I,R,L),S+=3)}c.addGroup(u,S,0),u+=S}function v(_){let E=g,S=new pe,T=new B,x=0,M=_===!0?e:t,A=_===!0?1:-1;for(let R=1;R<=s;R++)f.push(0,p*A,0),h.push(0,A,0),m.push(.5,.5),g++;let I=g;for(let R=0;R<=s;R++){let P=R/s*l+o,F=Math.cos(P),U=Math.sin(P);T.x=M*U,T.y=p*A,T.z=M*F,f.push(T.x,T.y,T.z),h.push(0,A,0),S.x=F*.5+.5,S.y=U*.5*A+.5,m.push(S.x,S.y),g++}for(let R=0;R<s;R++){let L=E+R,P=I+R;_===!0?d.push(P,P+1,L):d.push(P+1,P,L),x+=3}c.addGroup(u,x,_===!0?1:2),u+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Wi=class i extends Vt{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Ha=class i extends St{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),c(n),d(),this.setAttribute("position",new He(r,3)),this.setAttribute("normal",new He(r.slice(),3)),this.setAttribute("uv",new He(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(y){let v=new B,_=new B,E=new B;for(let S=0;S<t.length;S+=3)m(t[S+0],v),m(t[S+1],_),m(t[S+2],E),l(v,_,E,y)}function l(y,v,_,E){let S=E+1,T=[];for(let x=0;x<=S;x++){T[x]=[];let M=y.clone().lerp(_,x/S),A=v.clone().lerp(_,x/S),I=S-x;for(let R=0;R<=I;R++)R===0&&x===S?T[x][R]=M:T[x][R]=M.clone().lerp(A,R/I)}for(let x=0;x<S;x++)for(let M=0;M<2*(S-x)-1;M++){let A=Math.floor(M/2);M%2===0?(h(T[x][A+1]),h(T[x+1][A]),h(T[x][A])):(h(T[x][A+1]),h(T[x+1][A+1]),h(T[x+1][A]))}}function c(y){let v=new B;for(let _=0;_<r.length;_+=3)v.x=r[_+0],v.y=r[_+1],v.z=r[_+2],v.normalize().multiplyScalar(y),r[_+0]=v.x,r[_+1]=v.y,r[_+2]=v.z}function d(){let y=new B;for(let v=0;v<r.length;v+=3){y.x=r[v+0],y.y=r[v+1],y.z=r[v+2];let _=p(y)/2/Math.PI+.5,E=u(y)/Math.PI+.5;a.push(_,1-E)}g(),f()}function f(){for(let y=0;y<a.length;y+=6){let v=a[y+0],_=a[y+2],E=a[y+4],S=Math.max(v,_,E),T=Math.min(v,_,E);S>.9&&T<.1&&(v<.2&&(a[y+0]+=1),_<.2&&(a[y+2]+=1),E<.2&&(a[y+4]+=1))}}function h(y){r.push(y.x,y.y,y.z)}function m(y,v){let _=y*3;v.x=e[_+0],v.y=e[_+1],v.z=e[_+2]}function g(){let y=new B,v=new B,_=new B,E=new B,S=new pe,T=new pe,x=new pe;for(let M=0,A=0;M<r.length;M+=9,A+=6){y.set(r[M+0],r[M+1],r[M+2]),v.set(r[M+3],r[M+4],r[M+5]),_.set(r[M+6],r[M+7],r[M+8]),S.set(a[A+0],a[A+1]),T.set(a[A+2],a[A+3]),x.set(a[A+4],a[A+5]),E.copy(y).add(v).add(_).divideScalar(3);let I=p(E);b(S,A+0,y,I),b(T,A+2,v,I),b(x,A+4,_,I)}}function b(y,v,_,E){E<0&&y.x===1&&(a[v]=y.x-1),_.x===0&&_.z===0&&(a[v]=E/2/Math.PI+.5)}function p(y){return Math.atan2(y.z,-y.x)}function u(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var gn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){$e("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let d=n[s],h=n[s+1]-d,m=(a-d)/h;return(s+m)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new pe:new B);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new B,s=[],r=[],a=[],o=new B,l=new gt;for(let m=0;m<=e;m++){let g=m/e;s[m]=this.getTangentAt(g,new B)}r[0]=new B,a[0]=new B;let c=Number.MAX_VALUE,d=Math.abs(s[0].x),f=Math.abs(s[0].y),h=Math.abs(s[0].z);d<=c&&(c=d,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),h<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let m=1;m<=e;m++){if(r[m]=r[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(ht(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(l.makeRotationAxis(o,g))}a[m].crossVectors(s[m],r[m])}if(t===!0){let m=Math.acos(ht(r[0].dot(r[e]),-1,1));m/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(m=-m);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],m*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Ps=class extends gn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new pe){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let d=Math.cos(this.aRotation),f=Math.sin(this.aRotation),h=l-this.aX,m=c-this.aY;l=h*d-m*f+this.aX,c=h*f+m*d+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Wa=class extends Ps{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Rc(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,d,f){let h=(a-r)/c-(o-r)/(c+d)+(o-a)/d,m=(o-a)/d-(l-a)/(d+f)+(l-o)/f;h*=d,m*=d,s(a,o,h,m)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var Fh=new B,Oh=new B,Gl=new Rc,Hl=new Rc,Wl=new Rc,Ls=class extends gn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new B){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,d;this.closed||o>0?c=s[(o-1)%r]:(Oh.subVectors(s[0],s[1]).add(s[0]),c=Oh);let f=s[o%r],h=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(Fh.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=Fh),this.curveType==="centripetal"||this.curveType==="chordal"){let m=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(f),m),b=Math.pow(f.distanceToSquared(h),m),p=Math.pow(h.distanceToSquared(d),m);b<1e-4&&(b=1),g<1e-4&&(g=b),p<1e-4&&(p=b),Gl.initNonuniformCatmullRom(c.x,f.x,h.x,d.x,g,b,p),Hl.initNonuniformCatmullRom(c.y,f.y,h.y,d.y,g,b,p),Wl.initNonuniformCatmullRom(c.z,f.z,h.z,d.z,g,b,p)}else this.curveType==="catmullrom"&&(Gl.initCatmullRom(c.x,f.x,h.x,d.x,this.tension),Hl.initCatmullRom(c.y,f.y,h.y,d.y,this.tension),Wl.initCatmullRom(c.z,f.z,h.z,d.z,this.tension));return n.set(Gl.calc(l),Hl.calc(l),Wl.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new B().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Bh(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function Rf(i,e){let t=1-i;return t*t*e}function If(i,e){return 2*(1-i)*i*e}function Pf(i,e){return i*i*e}function rr(i,e,t,n){return Rf(i,e)+If(i,t)+Pf(i,n)}function Lf(i,e){let t=1-i;return t*t*t*e}function Df(i,e){let t=1-i;return 3*t*t*i*e}function Nf(i,e){return 3*(1-i)*i*i*e}function Uf(i,e){return i*i*i*e}function ar(i,e,t,n,s){return Lf(i,e)+Df(i,t)+Nf(i,n)+Uf(i,s)}var yr=class extends gn{constructor(e=new pe,t=new pe,n=new pe,s=new pe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new pe){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ar(e,s.x,r.x,a.x,o.x),ar(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Xa=class extends gn{constructor(e=new B,t=new B,n=new B,s=new B){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new B){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ar(e,s.x,r.x,a.x,o.x),ar(e,s.y,r.y,a.y,o.y),ar(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Mr=class extends gn{constructor(e=new pe,t=new pe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new pe){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new pe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},qa=class extends gn{constructor(e=new B,t=new B){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new B){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new B){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},br=class extends gn{constructor(e=new pe,t=new pe,n=new pe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new pe){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(rr(e,s.x,r.x,a.x),rr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ya=class extends gn{constructor(e=new B,t=new B,n=new B){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new B){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(rr(e,s.x,r.x,a.x),rr(e,s.y,r.y,a.y),rr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Sr=class extends gn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new pe){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],d=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(Bh(o,l.x,c.x,d.x,f.x),Bh(o,l.y,c.y,d.y,f.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new pe().fromArray(s))}return this}},Ql=Object.freeze({__proto__:null,ArcCurve:Wa,CatmullRomCurve3:Ls,CubicBezierCurve:yr,CubicBezierCurve3:Xa,EllipseCurve:Ps,LineCurve:Mr,LineCurve3:qa,QuadraticBezierCurve:br,QuadraticBezierCurve3:Ya,SplineCurve:Sr}),Za=class extends gn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ql[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let d=l[c];n&&n.equals(d)||(t.push(d),n=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Ql[s.type]().fromJSON(s))}return this}},wn=class extends Za{constructor(e){super(),this.type="Path",this.currentPoint=new pe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Mr(this.currentPoint.clone(),new pe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new br(this.currentPoint.clone(),new pe(e,t),new pe(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new yr(this.currentPoint.clone(),new pe(e,t),new pe(n,s),new pe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Sr(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){let c=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+c,t+d,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){let c=new Ps(e,t,n,s,r,a,o,l);if(this.curves.length>0){let f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);let d=c.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},xn=class extends wn{constructor(e){super(e),this.uuid=ks(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new wn().fromJSON(s))}return this}};function Ff(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Nu(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=Vf(i,e,r,t)),i.length>80*t){o=i[0],l=i[1];let d=o,f=l;for(let h=t;h<s;h+=t){let m=i[h],g=i[h+1];m<o&&(o=m),g<l&&(l=g),m>d&&(d=m),g>f&&(f=g)}c=Math.max(d-o,f-l),c=c!==0?32767/c:0}return wr(r,a,t,o,l,c,0),a}function Nu(i,e,t,n,s){let r;if(s===Qf(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=zh(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=zh(a/n|0,i[a],i[a+1],r);return r&&Ds(r,r.next)&&(Tr(r),r=r.next),r}function Xi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Ds(t,t.next)||Lt(t.prev,t,t.next)===0)){if(Tr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function wr(i,e,t,n,s,r,a){if(!i)return;!a&&r&&qf(i,n,s,r);let o=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?Bf(i,n,s,r):Of(i)){e.push(l.i,i.i,c.i),Tr(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=zf(Xi(i),e),wr(i,e,t,n,s,r,2)):a===2&&kf(i,e,t,n,s,r):wr(Xi(i),e,t,n,s,r,1);break}}}function Of(i){let e=i.prev,t=i,n=i.next;if(Lt(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,d=Math.min(s,r,a),f=Math.min(o,l,c),h=Math.max(s,r,a),m=Math.max(o,l,c),g=n.next;for(;g!==e;){if(g.x>=d&&g.x<=h&&g.y>=f&&g.y<=m&&sr(s,o,r,l,a,c,g.x,g.y)&&Lt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Bf(i,e,t,n){let s=i.prev,r=i,a=i.next;if(Lt(s,r,a)>=0)return!1;let o=s.x,l=r.x,c=a.x,d=s.y,f=r.y,h=a.y,m=Math.min(o,l,c),g=Math.min(d,f,h),b=Math.max(o,l,c),p=Math.max(d,f,h),u=jl(m,g,e,t,n),y=jl(b,p,e,t,n),v=i.prevZ,_=i.nextZ;for(;v&&v.z>=u&&_&&_.z<=y;){if(v.x>=m&&v.x<=b&&v.y>=g&&v.y<=p&&v!==s&&v!==a&&sr(o,d,l,f,c,h,v.x,v.y)&&Lt(v.prev,v,v.next)>=0||(v=v.prevZ,_.x>=m&&_.x<=b&&_.y>=g&&_.y<=p&&_!==s&&_!==a&&sr(o,d,l,f,c,h,_.x,_.y)&&Lt(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;v&&v.z>=u;){if(v.x>=m&&v.x<=b&&v.y>=g&&v.y<=p&&v!==s&&v!==a&&sr(o,d,l,f,c,h,v.x,v.y)&&Lt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;_&&_.z<=y;){if(_.x>=m&&_.x<=b&&_.y>=g&&_.y<=p&&_!==s&&_!==a&&sr(o,d,l,f,c,h,_.x,_.y)&&Lt(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function zf(i,e){let t=i;do{let n=t.prev,s=t.next.next;!Ds(n,s)&&Fu(n,t,t.next,s)&&Er(n,s)&&Er(s,n)&&(e.push(n.i,t.i,s.i),Tr(t),Tr(t.next),t=i=s),t=t.next}while(t!==i);return Xi(t)}function kf(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Jf(a,o)){let l=Ou(a,o);a=Xi(a,a.next),l=Xi(l,l.next),wr(a,e,t,n,s,r,0),wr(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Vf(i,e,t,n){let s=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=Nu(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Zf(c))}s.sort(Gf);for(let r=0;r<s.length;r++)t=Hf(s[r],t);return t}function Gf(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Hf(i,e){let t=Wf(i,e);if(!t)return e;let n=Ou(t,i);return Xi(n,n.next),Xi(t,t.next)}function Wf(i,e){let t=e,n=i.x,s=i.y,r=-1/0,a;if(Ds(i,t))return t;do{if(Ds(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let f=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=n&&f>r&&(r=f,a=t.x<t.next.x?t:t.next,f===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,l=a.x,c=a.y,d=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Uu(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let f=Math.abs(s-t.y)/(n-t.x);Er(t,i)&&(f<d||f===d&&(t.x>a.x||t.x===a.x&&Xf(a,t)))&&(a=t,d=f)}t=t.next}while(t!==o);return a}function Xf(i,e){return Lt(i.prev,i,e.prev)<0&&Lt(e.next,i,i.next)<0}function qf(i,e,t,n){let s=i;do s.z===0&&(s.z=jl(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Yf(s)}function Yf(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function jl(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Zf(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Uu(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function sr(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&Uu(i,e,t,n,s,r,a,o)}function Jf(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!$f(i,e)&&(Er(i,e)&&Er(e,i)&&Kf(i,e)&&(Lt(i.prev,i,e.prev)||Lt(i,e.prev,e))||Ds(i,e)&&Lt(i.prev,i,i.next)>0&&Lt(e.prev,e,e.next)>0)}function Lt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Ds(i,e){return i.x===e.x&&i.y===e.y}function Fu(i,e,t,n){let s=Sa(Lt(i,e,t)),r=Sa(Lt(i,e,n)),a=Sa(Lt(t,n,i)),o=Sa(Lt(t,n,e));return!!(s!==r&&a!==o||s===0&&ba(i,t,e)||r===0&&ba(i,n,e)||a===0&&ba(t,i,n)||o===0&&ba(t,e,n))}function ba(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Sa(i){return i>0?1:i<0?-1:0}function $f(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Fu(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Er(i,e){return Lt(i.prev,i,i.next)<0?Lt(i,e,i.next)>=0&&Lt(i,i.prev,e)>=0:Lt(i,e,i.prev)<0||Lt(i,i.next,e)<0}function Kf(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Ou(i,e){let t=ec(i.i,i.x,i.y),n=ec(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function zh(i,e,t,n){let s=ec(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Tr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ec(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Qf(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var tc=class{static triangulate(e,t,n=2){return Ff(e,t,n)}},ki=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];kh(e),Vh(n,e);let a=e.length;t.forEach(kh);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Vh(n,t[l]);let o=tc.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function kh(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Vh(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var ai=class i extends St{constructor(e=new xn([new pe(.5,.5),new pe(-.5,.5),new pe(-.5,-.5),new pe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){let c=e[o];a(c)}this.setAttribute("position",new He(s,3)),this.setAttribute("uv",new He(r,2)),this.computeVertexNormals();function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,d=t.steps!==void 0?t.steps:1,f=t.depth!==void 0?t.depth:1,h=t.bevelEnabled!==void 0?t.bevelEnabled:!0,m=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:m-.1,b=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3,u=t.extrudePath,y=t.UVGenerator!==void 0?t.UVGenerator:jf,v,_=!1,E,S,T,x;if(u){v=u.getSpacedPoints(d),_=!0,h=!1;let N=u.isCatmullRomCurve3?u.closed:!1;E=u.computeFrenetFrames(d,N),S=new B,T=new B,x=new B}h||(p=0,m=0,g=0,b=0);let M=o.extractPoints(c),A=M.shape,I=M.holes;if(!ki.isClockWise(A)){A=A.reverse();for(let N=0,H=I.length;N<H;N++){let k=I[N];ki.isClockWise(k)&&(I[N]=k.reverse())}}function L(N){let k=10000000000000001e-36,Y=N[0];for(let se=1;se<=N.length;se++){let me=se%N.length,Ae=N[me],Le=Ae.x-Y.x,Be=Ae.y-Y.y,O=Le*Le+Be*Be,et=Math.max(Math.abs(Ae.x),Math.abs(Ae.y),Math.abs(Y.x),Math.abs(Y.y)),Qe=k*et*et;if(O<=Qe){N.splice(me,1),se--;continue}Y=Ae}}L(A),I.forEach(L);let P=I.length,F=A;for(let N=0;N<P;N++){let H=I[N];A=A.concat(H)}function U(N,H,k){return H||Je("ExtrudeGeometry: vec does not exist"),N.clone().addScaledVector(H,k)}let z=A.length;function q(N,H,k){let Y,se,me,Ae=N.x-H.x,Le=N.y-H.y,Be=k.x-N.x,O=k.y-N.y,et=Ae*Ae+Le*Le,Qe=Ae*O-Le*Be;if(Math.abs(Qe)>Number.EPSILON){let D=Math.sqrt(et),w=Math.sqrt(Be*Be+O*O),X=H.x-Le/D,K=H.y+Ae/D,te=k.x-O/w,ue=k.y+Be/w,ge=((te-X)*O-(ue-K)*Be)/(Ae*O-Le*Be);Y=X+Ae*ge-N.x,se=K+Le*ge-N.y;let ne=Y*Y+se*se;if(ne<=2)return new pe(Y,se);me=Math.sqrt(ne/2)}else{let D=!1;Ae>Number.EPSILON?Be>Number.EPSILON&&(D=!0):Ae<-Number.EPSILON?Be<-Number.EPSILON&&(D=!0):Math.sign(Le)===Math.sign(O)&&(D=!0),D?(Y=-Le,se=Ae,me=Math.sqrt(et)):(Y=Ae,se=Le,me=Math.sqrt(et/2))}return new pe(Y/me,se/me)}let W=[];for(let N=0,H=F.length,k=H-1,Y=N+1;N<H;N++,k++,Y++)k===H&&(k=0),Y===H&&(Y=0),W[N]=q(F[N],F[k],F[Y]);let Z=[],j,xe=W.concat();for(let N=0,H=P;N<H;N++){let k=I[N];j=[];for(let Y=0,se=k.length,me=se-1,Ae=Y+1;Y<se;Y++,me++,Ae++)me===se&&(me=0),Ae===se&&(Ae=0),j[Y]=q(k[Y],k[me],k[Ae]);Z.push(j),xe=xe.concat(j)}let he;if(p===0)he=ki.triangulateShape(F,I);else{let N=[],H=[];for(let k=0;k<p;k++){let Y=k/p,se=m*Math.cos(Y*Math.PI/2),me=g*Math.sin(Y*Math.PI/2)+b;for(let Ae=0,Le=F.length;Ae<Le;Ae++){let Be=U(F[Ae],W[Ae],me);de(Be.x,Be.y,-se),Y===0&&N.push(Be)}for(let Ae=0,Le=P;Ae<Le;Ae++){let Be=I[Ae];j=Z[Ae];let O=[];for(let et=0,Qe=Be.length;et<Qe;et++){let D=U(Be[et],j[et],me);de(D.x,D.y,-se),Y===0&&O.push(D)}Y===0&&H.push(O)}}he=ki.triangulateShape(N,H)}let Xe=he.length,qe=g+b;for(let N=0;N<z;N++){let H=h?U(A[N],xe[N],qe):A[N];_?(T.copy(E.normals[0]).multiplyScalar(H.x),S.copy(E.binormals[0]).multiplyScalar(H.y),x.copy(v[0]).add(T).add(S),de(x.x,x.y,x.z)):de(H.x,H.y,0)}for(let N=1;N<=d;N++)for(let H=0;H<z;H++){let k=h?U(A[H],xe[H],qe):A[H];_?(T.copy(E.normals[N]).multiplyScalar(k.x),S.copy(E.binormals[N]).multiplyScalar(k.y),x.copy(v[N]).add(T).add(S),de(x.x,x.y,x.z)):de(k.x,k.y,f/d*N)}for(let N=p-1;N>=0;N--){let H=N/p,k=m*Math.cos(H*Math.PI/2),Y=g*Math.sin(H*Math.PI/2)+b;for(let se=0,me=F.length;se<me;se++){let Ae=U(F[se],W[se],Y);de(Ae.x,Ae.y,f+k)}for(let se=0,me=I.length;se<me;se++){let Ae=I[se];j=Z[se];for(let Le=0,Be=Ae.length;Le<Be;Le++){let O=U(Ae[Le],j[Le],Y);_?de(O.x,O.y+v[d-1].y,v[d-1].x+k):de(O.x,O.y,f+k)}}}nt(),ee();function nt(){let N=s.length/3;if(h){let H=0,k=z*H;for(let Y=0;Y<Xe;Y++){let se=he[Y];ze(se[2]+k,se[1]+k,se[0]+k)}H=d+p*2,k=z*H;for(let Y=0;Y<Xe;Y++){let se=he[Y];ze(se[0]+k,se[1]+k,se[2]+k)}}else{for(let H=0;H<Xe;H++){let k=he[H];ze(k[2],k[1],k[0])}for(let H=0;H<Xe;H++){let k=he[H];ze(k[0]+z*d,k[1]+z*d,k[2]+z*d)}}n.addGroup(N,s.length/3-N,0)}function ee(){let N=s.length/3,H=0;ie(F,H),H+=F.length;for(let k=0,Y=I.length;k<Y;k++){let se=I[k];ie(se,H),H+=se.length}n.addGroup(N,s.length/3-N,1)}function ie(N,H){let k=N.length;for(;--k>=0;){let Y=k,se=k-1;se<0&&(se=N.length-1);for(let me=0,Ae=d+p*2;me<Ae;me++){let Le=z*me,Be=z*(me+1),O=H+Y+Le,et=H+se+Le,Qe=H+se+Be,D=H+Y+Be;fe(O,et,Qe,D)}}}function de(N,H,k){l.push(N),l.push(H),l.push(k)}function ze(N,H,k){De(N),De(H),De(k);let Y=s.length/3,se=y.generateTopUV(n,s,Y-3,Y-2,Y-1);Re(se[0]),Re(se[1]),Re(se[2])}function fe(N,H,k,Y){De(N),De(H),De(Y),De(H),De(k),De(Y);let se=s.length/3,me=y.generateSideWallUV(n,s,se-6,se-3,se-2,se-1);Re(me[0]),Re(me[1]),Re(me[3]),Re(me[1]),Re(me[2]),Re(me[3])}function De(N){s.push(l[N*3+0]),s.push(l[N*3+1]),s.push(l[N*3+2])}function Re(N){r.push(N.x),r.push(N.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return ep(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,a=e.shapes.length;r<a;r++){let o=t[e.shapes[r]];n.push(o)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Ql[s.type]().fromJSON(s)),new i(n,e.options)}},jf={generateTopUV:function(i,e,t,n,s){let r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[s*3],d=e[s*3+1];return[new pe(r,a),new pe(o,l),new pe(c,d)]},generateSideWallUV:function(i,e,t,n,s,r){let a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],d=e[n*3+1],f=e[n*3+2],h=e[s*3],m=e[s*3+1],g=e[s*3+2],b=e[r*3],p=e[r*3+1],u=e[r*3+2];return Math.abs(o-d)<Math.abs(a-c)?[new pe(a,1-l),new pe(c,1-f),new pe(h,1-g),new pe(b,1-u)]:[new pe(o,1-l),new pe(d,1-f),new pe(m,1-g),new pe(p,1-u)]}};function ep(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var qi=class i extends Ha{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Fn=class i extends St{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,d=l+1,f=e/o,h=t/l,m=[],g=[],b=[],p=[];for(let u=0;u<d;u++){let y=u*h-a;for(let v=0;v<c;v++){let _=v*f-r;g.push(_,-y,0),b.push(0,0,1),p.push(v/o),p.push(1-u/l)}}for(let u=0;u<l;u++)for(let y=0;y<o;y++){let v=y+c*u,_=y+c*(u+1),E=y+1+c*(u+1),S=y+1+c*u;m.push(v,_,S),m.push(_,E,S)}this.setIndex(m),this.setAttribute("position",new He(g,3)),this.setAttribute("normal",new He(b,3)),this.setAttribute("uv",new He(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var oi=class i extends St{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,d=[],f=new B,h=new B,m=[],g=[],b=[],p=[];for(let u=0;u<=n;u++){let y=[],v=u/n,_=a+v*o,E=e*Math.cos(_),S=Math.sqrt(e*e-E*E),T=0;u===0&&a===0?T=.5/t:u===n&&l===Math.PI&&(T=-.5/t);for(let x=0;x<=t;x++){let M=x/t,A=s+M*r;f.x=-S*Math.cos(A),f.y=E,f.z=S*Math.sin(A),g.push(f.x,f.y,f.z),h.copy(f).normalize(),b.push(h.x,h.y,h.z),p.push(M+T,1-v),y.push(c++)}d.push(y)}for(let u=0;u<n;u++)for(let y=0;y<t;y++){let v=d[u][y+1],_=d[u][y],E=d[u+1][y],S=d[u+1][y+1];(u!==0||a>0)&&m.push(v,_,S),(u!==n-1||l<Math.PI)&&m.push(_,E,S)}this.setIndex(m),this.setAttribute("position",new He(g,3)),this.setAttribute("normal",new He(b,3)),this.setAttribute("uv",new He(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Yi=class i extends St{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],d=[],f=[],h=new B,m=new B,g=new B;for(let b=0;b<=n;b++){let p=a+b/n*o;for(let u=0;u<=s;u++){let y=u/s*r;m.x=(e+t*Math.cos(p))*Math.cos(y),m.y=(e+t*Math.cos(p))*Math.sin(y),m.z=t*Math.sin(p),c.push(m.x,m.y,m.z),h.x=e*Math.cos(y),h.y=e*Math.sin(y),g.subVectors(m,h).normalize(),d.push(g.x,g.y,g.z),f.push(u/s),f.push(b/n)}}for(let b=1;b<=n;b++)for(let p=1;p<=s;p++){let u=(s+1)*b+p-1,y=(s+1)*(b-1)+p-1,v=(s+1)*(b-1)+p,_=(s+1)*b+p;l.push(u,y,_),l.push(y,v,_)}this.setIndex(l),this.setAttribute("position",new He(c,3)),this.setAttribute("normal",new He(d,3)),this.setAttribute("uv",new He(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function $i(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Gh(s))s.isRenderTargetTexture?($e("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Gh(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function rn(i){let e={};for(let t=0;t<i.length;t++){let n=$i(i[t]);for(let s in n)e[s]=n[s]}return e}function Gh(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function tp(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Ic(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:dt.workingColorSpace}var Bu={clone:$i,merge:rn},np=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ip=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Gt=class extends si{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=np,this.fragmentShader=ip,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=$i(e.uniforms),this.uniformsGroups=tp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Te().setHex(s.value);break;case"v2":this.uniforms[n].value=new pe().fromArray(s.value);break;case"v3":this.uniforms[n].value=new B().fromArray(s.value);break;case"v4":this.uniforms[n].value=new It().fromArray(s.value);break;case"m3":this.uniforms[n].value=new tt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new gt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Ja=class extends Gt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},ft=class extends si{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Te(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Qo,this.normalScale=new pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ar=class extends ft{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new pe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ht(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Te(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Te(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Te(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var $a=class extends si{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=vu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ka=class extends si{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function _s(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Xl(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Ei=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Qa=class extends Ei{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Zl,endingEnd:Zl}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Jl:r=e,o=2*t-n;break;case $l:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Jl:a=e,l=2*n-t;break;case $l:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,d=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*d,this._offsetNext=a*d}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,d=this._offsetPrev,f=this._offsetNext,h=this._weightPrev,m=this._weightNext,g=(n-t)/(s-t),b=g*g,p=b*g,u=-h*p+2*h*b-h*g,y=(1+h)*p+(-1.5-2*h)*b+(-.5+h)*g+1,v=(-1-m)*p+(1.5+m)*b+.5*g,_=m*p-m*b;for(let E=0;E!==o;++E)r[E]=u*a[d+E]+y*a[c+E]+v*a[l+E]+_*a[f+E];return r}},ja=class extends Ei{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,d=(n-t)/(s-t),f=1-d;for(let h=0;h!==o;++h)r[h]=a[c+h]*f+a[l+h]*d;return r}},eo=class extends Ei{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},to=class extends Ei{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,d=this.inTangents,f=this.outTangents;if(!d||!f){let g=(n-t)/(s-t),b=1-g;for(let p=0;p!==o;++p)r[p]=a[c+p]*b+a[l+p]*g;return r}let h=o*2,m=e-1;for(let g=0;g!==o;++g){let b=a[c+g],p=a[l+g],u=m*h+g*2,y=f[u],v=f[u+1],_=e*h+g*2,E=d[_],S=d[_+1],T=rp(n,t,y,E,s);r[g]=zu(T,b,v,S,p)}return r}};function zu(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function sp(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function rp(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=zu(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let l=sp(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var _n=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=_s(t,this.TimeBufferType),this.values=_s(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:_s(e.times,Array),values:_s(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),Xl(e.settings)&&(n.settings={inTangents:_s(e.settings.inTangents,Array),outTangents:_s(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new eo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ja(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Qa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new to(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case or:t=this.InterpolantFactoryMethodDiscrete;break;case Fa:t=this.InterpolantFactoryMethodLinear;break;case Ta:t=this.InterpolantFactoryMethodSmooth;break;case Yl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return $e("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return or;case this.InterpolantFactoryMethodLinear:return Fa;case this.InterpolantFactoryMethodSmooth:return Ta;case this.InterpolantFactoryMethodBezier:return Yl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;Xl(this.settings)&&(Hh(this.settings.inTangents,e),Hh(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Je("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Je("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Je("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Je("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&lf(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Je("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ta,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],d=e[o+1];if(c!==d&&(o!==1||c!==e[0]))if(s)l=!0;else{let f=o*n,h=f-n,m=f+n;for(let g=0;g!==n;++g){let b=t[f+g];if(b!==t[h+g]||b!==t[m+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let f=o*n,h=a*n;for(let m=0;m!==n;++m)t[h+m]=t[f+m]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,Xl(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Hh(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}_n.prototype.ValueTypeName="";_n.prototype.TimeBufferType=Float32Array;_n.prototype.ValueBufferType=Float32Array;_n.prototype.DefaultInterpolation=Fa;var Ti=class extends _n{constructor(e,t,n){super(e,t,n)}};Ti.prototype.ValueTypeName="bool";Ti.prototype.ValueBufferType=Array;Ti.prototype.DefaultInterpolation=or;Ti.prototype.InterpolantFactoryMethodLinear=void 0;Ti.prototype.InterpolantFactoryMethodSmooth=void 0;var no=class extends _n{constructor(e,t,n,s){super(e,t,n,s)}};no.prototype.ValueTypeName="color";var io=class extends _n{constructor(e,t,n,s){super(e,t,n,s)}};io.prototype.ValueTypeName="number";var so=class extends Ei{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let d=c+o;c!==d;c+=4)Sn.slerpFlat(r,0,a,c-o,a,c,l);return r}},Cr=class extends _n{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new so(this.times,this.values,this.getValueSize(),e)}};Cr.prototype.ValueTypeName="quaternion";Cr.prototype.InterpolantFactoryMethodSmooth=void 0;var Ai=class extends _n{constructor(e,t,n){super(e,t,n)}};Ai.prototype.ValueTypeName="string";Ai.prototype.ValueBufferType=Array;Ai.prototype.DefaultInterpolation=or;Ai.prototype.InterpolantFactoryMethodLinear=void 0;Ai.prototype.InterpolantFactoryMethodSmooth=void 0;var ro=class extends _n{constructor(e,t,n,s){super(e,t,n,s)}};ro.prototype.ValueTypeName="vector";var ao=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(d){o++,r===!1&&s.onStart!==void 0&&s.onStart(d,a,o),r=!0},this.itemEnd=function(d){a++,s.onProgress!==void 0&&s.onProgress(d,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(d){s.onError!==void 0&&s.onError(d)},this.resolveURL=function(d){return d=d.normalize("NFC"),l?l(d):d},this.setURLModifier=function(d){return l=d,this},this.addHandler=function(d,f){return c.push(d,f),this},this.removeHandler=function(d){let f=c.indexOf(d);return f!==-1&&c.splice(f,2),this},this.getHandler=function(d){for(let f=0,h=c.length;f<h;f+=2){let m=c[f],g=c[f+1];if(m.global&&(m.lastIndex=0),m.test(d))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},ku=new ao,oo=class{constructor(e){this.manager=e!==void 0?e:ku,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};oo.DEFAULT_MATERIAL_NAME="__DEFAULT";var Ns=class extends Ot{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Te(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Rr=class extends Ns{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Te(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},ql=new gt,Wh=new B,Xh=new B,Ir=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new pe(512,512),this.mapType=dn,this.map=null,this.mapPass=null,this.matrix=new gt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Is,this._frameExtents=new pe(1,1),this._viewportCount=1,this._viewports=[new It(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Wh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Wh),Xh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Xh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){ql.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(ql,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===Ss||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(ql)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},wa=new B,Ea=new Sn,Gn=new B,Pr=class extends Ot{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new gt,this.projectionMatrix=new gt,this.projectionMatrixInverse=new gt,this.coordinateSystem=Nn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(wa,Ea,Gn),Gn.x===1&&Gn.y===1&&Gn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(wa,Ea,Gn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(wa,Ea,Gn),Gn.x===1&&Gn.y===1&&Gn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(wa,Ea,Gn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Mi=new B,qh=new pe,Yh=new pe,$t=class extends Pr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Oa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ml*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Oa*2*Math.atan(Math.tan(Ml*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Mi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Mi.x,Mi.y).multiplyScalar(-e/Mi.z),Mi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Mi.x,Mi.y).multiplyScalar(-e/Mi.z)}getViewSize(e,t){return this.getViewBounds(e,qh,Yh),t.subVectors(Yh,qh)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ml*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var nc=class extends Ir{constructor(){super(new $t(90,1,.5,500)),this.isPointLightShadow=!0}},Lr=class extends Ns{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new nc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Us=class extends Pr{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ic=class extends Ir{constructor(){super(new Us(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Dr=class extends Ns{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.target=new Ot,this.shadow=new ic}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var vs=-90,ys=1,Fs=class extends Ot{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new $t(vs,ys,e,t);s.layers=this.layers,this.add(s);let r=new $t(vs,ys,e,t);r.layers=this.layers,this.add(r);let a=new $t(vs,ys,e,t);a.layers=this.layers,this.add(a);let o=new $t(vs,ys,e,t);o.layers=this.layers,this.add(o);let l=new $t(vs,ys,e,t);l.layers=this.layers,this.add(l);let c=new $t(vs,ys,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===Nn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ss)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,d]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let b=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=b,e.setRenderTarget(n,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,d),e.setRenderTarget(f,h,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},lo=class extends $t{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Pc="\\[\\]\\.:\\/",ap=new RegExp("["+Pc+"]","g"),Lc="[^"+Pc+"]",op="[^"+Pc.replace("\\.","")+"]",lp=/((?:WC+[\/:])*)/.source.replace("WC",Lc),cp=/(WCOD+)?/.source.replace("WCOD",op),hp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Lc),up=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Lc),dp=new RegExp("^"+lp+cp+hp+up+"$"),fp=["material","materials","bones","map"],sc=class{constructor(e,t,n){let s=n||Rt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Rt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(ap,"")}static parseTrackName(e){let t=dp.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);fp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){$e("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Je("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Je("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Je("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let d=0;d<e.length;d++)if(e[d].name===c){c=d;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Je("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Je("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Je("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Je("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;Je("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Je("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Je("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Rt.Composite=sc;Rt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Rt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Rt.prototype.GetterByBindingType=[Rt.prototype._getValue_direct,Rt.prototype._getValue_array,Rt.prototype._getValue_arrayElement,Rt.prototype._getValue_toArray];Rt.prototype.SetterByBindingTypeAndVersioning=[[Rt.prototype._setValue_direct,Rt.prototype._setValue_direct_setNeedsUpdate,Rt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_array,Rt.prototype._setValue_array_setNeedsUpdate,Rt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_arrayElement,Rt.prototype._setValue_arrayElement_setNeedsUpdate,Rt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_fromArray,Rt.prototype._setValue_fromArray_setNeedsUpdate,Rt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var b_=new Float32Array(1);var Zh=new gt,Nr=class{constructor(e,t,n=0,s=1/0){this.ray=new Cs(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Ts,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Je("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Zh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Zh),this}intersectObject(e,t=!0,n=[]){return rc(e,this,n,t),n.sort(Jh),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)rc(e[s],this,n,t);return n.sort(Jh),n}};function Jh(i,e){return i.distance-e.distance}function rc(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)rc(r[a],e,t,!0)}}var Bc=class Bc{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};Bc.prototype.isMatrix2=!0;var ac=Bc;function Dc(i,e,t,n){let s=pp(n);switch(t){case Ec:return i*e;case _o:return i*e/s.components*s.byteLength;case vo:return i*e/s.components*s.byteLength;case Li:return i*e*2/s.components*s.byteLength;case yo:return i*e*2/s.components*s.byteLength;case Tc:return i*e*3/s.components*s.byteLength;case An:return i*e*4/s.components*s.byteLength;case Mo:return i*e*4/s.components*s.byteLength;case zr:case kr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Vr:case Gr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case So:case Eo:return Math.max(i,16)*Math.max(e,8)/4;case bo:case wo:return Math.max(i,8)*Math.max(e,8)/2;case To:case Ao:case Ro:case Io:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Co:case Hr:case Po:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Lo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Do:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case No:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Uo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Fo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Oo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Bo:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case zo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case ko:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Vo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Go:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Ho:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Wo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Xo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case qo:case Yo:case Zo:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Jo:case $o:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Wr:case Ko:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function pp(i){switch(i){case dn:case Mc:return{byteLength:1,components:1};case Bs:case bc:case vn:return{byteLength:2,components:1};case go:case xo:return{byteLength:2,components:4};case Bn:case mo:case Tn:return{byteLength:4,components:1};case Sc:case wc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?$e("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function ld(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Mp(i){let e=new WeakMap;function t(o,l){let c=o.array,d=o.usage,f=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,d),o.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){let d=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,d);else{f.sort((m,g)=>m.start-g.start);let h=0;for(let m=1;m<f.length;m++){let g=f[h],b=f[m];b.start<=g.start+g.count+1?g.count=Math.max(g.count,b.start+b.count-g.start):(++h,f[h]=b)}f.length=h+1;for(let m=0,g=f.length;m<g;m++){let b=f[m];i.bufferSubData(c,b.start*d.BYTES_PER_ELEMENT,d,b.start,b.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var bp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Sp=`#ifdef USE_ALPHAHASH
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
#endif`,wp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ep=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Tp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ap=`#ifdef USE_ALPHATEST
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
#endif`,Rp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ip=`#ifdef USE_BATCHING
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
#endif`,Pp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Lp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Dp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Np=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Up=`#ifdef USE_IRIDESCENCE
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
#endif`,Fp=`#ifdef USE_BUMPMAP
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
#endif`,Op=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Bp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,zp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,kp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Vp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Gp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Hp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Wp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Xp=`#define PI 3.141592653589793
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
} // validated`,qp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Yp=`vec3 transformedNormal = objectNormal;
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
#endif`,Zp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Jp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$p=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Kp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Qp="gl_FragColor = linearToOutputTexel( gl_FragColor );",jp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,em=`#ifdef USE_ENVMAP
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
#endif`,tm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,nm=`#ifdef USE_ENVMAP
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
#endif`,im=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,sm=`#ifdef USE_ENVMAP
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
#endif`,rm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,am=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,om=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,lm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,cm=`#ifdef USE_GRADIENTMAP
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
}`,hm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,um=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,dm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,fm=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,pm=`#ifdef USE_ENVMAP
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
#endif`,mm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,gm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,xm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,_m=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,vm=`PhysicalMaterial material;
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
#endif`,ym=`uniform sampler2D dfgLUT;
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
}`,Mm=`
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
#endif`,bm=`#if defined( RE_IndirectDiffuse )
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
#endif`,Sm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,wm=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Em=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Tm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Am=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Cm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Rm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Im=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Pm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Lm=`#if defined( USE_POINTS_UV )
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
#endif`,Dm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Nm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Um=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Fm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Om=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bm=`#ifdef USE_MORPHTARGETS
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
#endif`,zm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,km=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Vm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Gm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Wm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Xm=`#ifdef USE_NORMALMAP
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
#endif`,qm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ym=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Zm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Jm=`#ifdef USE_IRIDESCENCEMAP
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
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Km=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Qm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,jm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,e0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,t0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,n0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,i0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,s0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,r0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,a0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,o0=`float getShadowMask() {
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
}`,l0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,c0=`#ifdef USE_SKINNING
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
#endif`,h0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,u0=`#ifdef USE_SKINNING
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
#endif`,d0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,f0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,p0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,m0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,g0=`#ifdef USE_TRANSMISSION
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
#endif`,x0=`#ifdef USE_TRANSMISSION
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
#endif`,_0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,v0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,y0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,M0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,b0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,S0=`uniform sampler2D t2D;
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
}`,w0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,E0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,T0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,A0=`uniform samplerCube tCube;
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
}`,R0=`#if DEPTH_PACKING == 3200
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
}`,I0=`#define DISTANCE
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
}`,P0=`#define DISTANCE
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
}`,L0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,D0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,N0=`uniform float scale;
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
}`,U0=`uniform vec3 diffuse;
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
}`,F0=`#include <common>
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
}`,O0=`uniform vec3 diffuse;
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
}`,B0=`#define LAMBERT
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
}`,z0=`#define LAMBERT
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
}`,k0=`#define MATCAP
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
}`,V0=`#define MATCAP
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
}`,G0=`#define NORMAL
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
}`,H0=`#define NORMAL
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
}`,W0=`#define PHONG
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
}`,X0=`#define PHONG
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
}`,q0=`#define STANDARD
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
}`,Y0=`#define STANDARD
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
}`,Z0=`#define TOON
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
}`,J0=`#define TOON
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
}`,K0=`uniform vec3 diffuse;
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
}`,Q0=`#include <common>
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
}`,j0=`uniform vec3 color;
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
}`,eg=`uniform float rotation;
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
}`,tg=`uniform vec3 diffuse;
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
}`,lt={alphahash_fragment:bp,alphahash_pars_fragment:Sp,alphamap_fragment:wp,alphamap_pars_fragment:Ep,alphatest_fragment:Tp,alphatest_pars_fragment:Ap,aomap_fragment:Cp,aomap_pars_fragment:Rp,batching_pars_vertex:Ip,batching_vertex:Pp,begin_vertex:Lp,beginnormal_vertex:Dp,bsdfs:Np,iridescence_fragment:Up,bumpmap_pars_fragment:Fp,clipping_planes_fragment:Op,clipping_planes_pars_fragment:Bp,clipping_planes_pars_vertex:zp,clipping_planes_vertex:kp,color_fragment:Vp,color_pars_fragment:Gp,color_pars_vertex:Hp,color_vertex:Wp,common:Xp,cube_uv_reflection_fragment:qp,defaultnormal_vertex:Yp,displacementmap_pars_vertex:Zp,displacementmap_vertex:Jp,emissivemap_fragment:$p,emissivemap_pars_fragment:Kp,colorspace_fragment:Qp,colorspace_pars_fragment:jp,envmap_fragment:em,envmap_common_pars_fragment:tm,envmap_pars_fragment:nm,envmap_pars_vertex:im,envmap_physical_pars_fragment:pm,envmap_vertex:sm,fog_vertex:rm,fog_pars_vertex:am,fog_fragment:om,fog_pars_fragment:lm,gradientmap_pars_fragment:cm,lightmap_pars_fragment:hm,lights_lambert_fragment:um,lights_lambert_pars_fragment:dm,lights_pars_begin:fm,lights_toon_fragment:mm,lights_toon_pars_fragment:gm,lights_phong_fragment:xm,lights_phong_pars_fragment:_m,lights_physical_fragment:vm,lights_physical_pars_fragment:ym,lights_fragment_begin:Mm,lights_fragment_maps:bm,lights_fragment_end:Sm,lightprobes_pars_fragment:wm,logdepthbuf_fragment:Em,logdepthbuf_pars_fragment:Tm,logdepthbuf_pars_vertex:Am,logdepthbuf_vertex:Cm,map_fragment:Rm,map_pars_fragment:Im,map_particle_fragment:Pm,map_particle_pars_fragment:Lm,metalnessmap_fragment:Dm,metalnessmap_pars_fragment:Nm,morphinstance_vertex:Um,morphcolor_vertex:Fm,morphnormal_vertex:Om,morphtarget_pars_vertex:Bm,morphtarget_vertex:zm,normal_fragment_begin:km,normal_fragment_maps:Vm,normal_pars_fragment:Gm,normal_pars_vertex:Hm,normal_vertex:Wm,normalmap_pars_fragment:Xm,clearcoat_normal_fragment_begin:qm,clearcoat_normal_fragment_maps:Ym,clearcoat_pars_fragment:Zm,iridescence_pars_fragment:Jm,opaque_fragment:$m,packing:Km,premultiplied_alpha_fragment:Qm,project_vertex:jm,dithering_fragment:e0,dithering_pars_fragment:t0,roughnessmap_fragment:n0,roughnessmap_pars_fragment:i0,shadowmap_pars_fragment:s0,shadowmap_pars_vertex:r0,shadowmap_vertex:a0,shadowmask_pars_fragment:o0,skinbase_vertex:l0,skinning_pars_vertex:c0,skinning_vertex:h0,skinnormal_vertex:u0,specularmap_fragment:d0,specularmap_pars_fragment:f0,tonemapping_fragment:p0,tonemapping_pars_fragment:m0,transmission_fragment:g0,transmission_pars_fragment:x0,uv_pars_fragment:_0,uv_pars_vertex:v0,uv_vertex:y0,worldpos_vertex:M0,background_vert:b0,background_frag:S0,backgroundCube_vert:w0,backgroundCube_frag:E0,cube_vert:T0,cube_frag:A0,depth_vert:C0,depth_frag:R0,distance_vert:I0,distance_frag:P0,equirect_vert:L0,equirect_frag:D0,linedashed_vert:N0,linedashed_frag:U0,meshbasic_vert:F0,meshbasic_frag:O0,meshlambert_vert:B0,meshlambert_frag:z0,meshmatcap_vert:k0,meshmatcap_frag:V0,meshnormal_vert:G0,meshnormal_frag:H0,meshphong_vert:W0,meshphong_frag:X0,meshphysical_vert:q0,meshphysical_frag:Y0,meshtoon_vert:Z0,meshtoon_frag:J0,points_vert:$0,points_frag:K0,shadow_vert:Q0,shadow_frag:j0,sprite_vert:eg,sprite_frag:tg},Se={common:{diffuse:{value:new Te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new tt}},envmap:{envMap:{value:null},envMapRotation:{value:new tt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new tt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new tt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new tt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new tt},normalScale:{value:new pe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new tt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new tt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new tt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new tt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new B},probesMax:{value:new B},probesResolution:{value:new B}},points:{diffuse:{value:new Te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0},uvTransform:{value:new tt}},sprite:{diffuse:{value:new Te(16777215)},opacity:{value:1},center:{value:new pe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}}},Jn={basic:{uniforms:rn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.fog]),vertexShader:lt.meshbasic_vert,fragmentShader:lt.meshbasic_frag},lambert:{uniforms:rn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new Te(0)},envMapIntensity:{value:1}}]),vertexShader:lt.meshlambert_vert,fragmentShader:lt.meshlambert_frag},phong:{uniforms:rn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new Te(0)},specular:{value:new Te(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:lt.meshphong_vert,fragmentShader:lt.meshphong_frag},standard:{uniforms:rn([Se.common,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.roughnessmap,Se.metalnessmap,Se.fog,Se.lights,{emissive:{value:new Te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:lt.meshphysical_vert,fragmentShader:lt.meshphysical_frag},toon:{uniforms:rn([Se.common,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.gradientmap,Se.fog,Se.lights,{emissive:{value:new Te(0)}}]),vertexShader:lt.meshtoon_vert,fragmentShader:lt.meshtoon_frag},matcap:{uniforms:rn([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,{matcap:{value:null}}]),vertexShader:lt.meshmatcap_vert,fragmentShader:lt.meshmatcap_frag},points:{uniforms:rn([Se.points,Se.fog]),vertexShader:lt.points_vert,fragmentShader:lt.points_frag},dashed:{uniforms:rn([Se.common,Se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:lt.linedashed_vert,fragmentShader:lt.linedashed_frag},depth:{uniforms:rn([Se.common,Se.displacementmap]),vertexShader:lt.depth_vert,fragmentShader:lt.depth_frag},normal:{uniforms:rn([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,{opacity:{value:1}}]),vertexShader:lt.meshnormal_vert,fragmentShader:lt.meshnormal_frag},sprite:{uniforms:rn([Se.sprite,Se.fog]),vertexShader:lt.sprite_vert,fragmentShader:lt.sprite_frag},background:{uniforms:{uvTransform:{value:new tt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:lt.background_vert,fragmentShader:lt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new tt}},vertexShader:lt.backgroundCube_vert,fragmentShader:lt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:lt.cube_vert,fragmentShader:lt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:lt.equirect_vert,fragmentShader:lt.equirect_frag},distance:{uniforms:rn([Se.common,Se.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:lt.distance_vert,fragmentShader:lt.distance_frag},shadow:{uniforms:rn([Se.lights,Se.fog,{color:{value:new Te(0)},opacity:{value:1}}]),vertexShader:lt.shadow_vert,fragmentShader:lt.shadow_frag}};Jn.physical={uniforms:rn([Jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new tt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new tt},clearcoatNormalScale:{value:new pe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new tt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new tt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new tt},sheen:{value:0},sheenColor:{value:new Te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new tt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new tt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new tt},transmissionSamplerSize:{value:new pe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new tt},attenuationDistance:{value:0},attenuationColor:{value:new Te(0)},specularColor:{value:new Te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new tt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new tt},anisotropyVector:{value:new pe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new tt}}]),vertexShader:lt.meshphysical_vert,fragmentShader:lt.meshphysical_frag};var tl={r:0,b:0,g:0},ng=new gt,cd=new tt;cd.set(-1,0,0,0,1,0,0,0,1);function ig(i,e,t,n,s,r){let a=new Te(0),o=s===!0?0:1,l,c,d=null,f=0,h=null;function m(y){let v=y.isScene===!0?y.background:null;if(v&&v.isTexture){let _=y.backgroundBlurriness>0;v=e.get(v,_)}return v}function g(y){let v=!1,_=m(y);_===null?p(a,o):_&&_.isColor&&(p(_,1),v=!0);let E=i.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||v)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function b(y,v){let _=m(v);_&&(_.isCubeTexture||_.mapping===Or)?(c===void 0&&(c=new We(new mn(1,1,1),new Gt({name:"BackgroundCubeMaterial",uniforms:$i(Jn.backgroundCube.uniforms),vertexShader:Jn.backgroundCube.vertexShader,fragmentShader:Jn.backgroundCube.fragmentShader,side:Kt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,S,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=_,c.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(ng.makeRotationFromEuler(v.backgroundRotation)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(cd),c.material.toneMapped=dt.getTransfer(_.colorSpace)!==Mt,(d!==_||f!==_.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,d=_,f=_.version,h=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new We(new Fn(2,2),new Gt({name:"BackgroundMaterial",uniforms:$i(Jn.background.uniforms),vertexShader:Jn.background.vertexShader,fragmentShader:Jn.background.fragmentShader,side:Ci,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=dt.getTransfer(_.colorSpace)!==Mt,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(d!==_||f!==_.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,d=_,f=_.version,h=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function p(y,v){y.getRGB(tl,Ic(i)),t.buffers.color.setClear(tl.r,tl.g,tl.b,v,r)}function u(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,v=1){a.set(y),o=v,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,p(a,o)},render:g,addToRenderList:b,dispose:u}}function sg(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,a=!1;function o(I,R,L,P,F){let U=!1,z=f(I,P,L,R);r!==z&&(r=z,c(r.object)),U=m(I,P,L,F),U&&g(I,P,L,F),F!==null&&e.update(F,i.ELEMENT_ARRAY_BUFFER),(U||a)&&(a=!1,_(I,R,L,P),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function l(){return i.createVertexArray()}function c(I){return i.bindVertexArray(I)}function d(I){return i.deleteVertexArray(I)}function f(I,R,L,P){let F=P.wireframe===!0,U=n[R.id];U===void 0&&(U={},n[R.id]=U);let z=I.isInstancedMesh===!0?I.id:0,q=U[z];q===void 0&&(q={},U[z]=q);let W=q[L.id];W===void 0&&(W={},q[L.id]=W);let Z=W[F];return Z===void 0&&(Z=h(l()),W[F]=Z),Z}function h(I){let R=[],L=[],P=[];for(let F=0;F<t;F++)R[F]=0,L[F]=0,P[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:L,attributeDivisors:P,object:I,attributes:{},index:null}}function m(I,R,L,P){let F=r.attributes,U=R.attributes,z=0,q=L.getAttributes();for(let W in q)if(q[W].location>=0){let j=F[W],xe=U[W];if(xe===void 0&&(W==="instanceMatrix"&&I.instanceMatrix&&(xe=I.instanceMatrix),W==="instanceColor"&&I.instanceColor&&(xe=I.instanceColor)),j===void 0||j.attribute!==xe||xe&&j.data!==xe.data)return!0;z++}return r.attributesNum!==z||r.index!==P}function g(I,R,L,P){let F={},U=R.attributes,z=0,q=L.getAttributes();for(let W in q)if(q[W].location>=0){let j=U[W];j===void 0&&(W==="instanceMatrix"&&I.instanceMatrix&&(j=I.instanceMatrix),W==="instanceColor"&&I.instanceColor&&(j=I.instanceColor));let xe={};xe.attribute=j,j&&j.data&&(xe.data=j.data),F[W]=xe,z++}r.attributes=F,r.attributesNum=z,r.index=P}function b(){let I=r.newAttributes;for(let R=0,L=I.length;R<L;R++)I[R]=0}function p(I){u(I,0)}function u(I,R){let L=r.newAttributes,P=r.enabledAttributes,F=r.attributeDivisors;L[I]=1,P[I]===0&&(i.enableVertexAttribArray(I),P[I]=1),F[I]!==R&&(i.vertexAttribDivisor(I,R),F[I]=R)}function y(){let I=r.newAttributes,R=r.enabledAttributes;for(let L=0,P=R.length;L<P;L++)R[L]!==I[L]&&(i.disableVertexAttribArray(L),R[L]=0)}function v(I,R,L,P,F,U,z){z===!0?i.vertexAttribIPointer(I,R,L,F,U):i.vertexAttribPointer(I,R,L,P,F,U)}function _(I,R,L,P){b();let F=P.attributes,U=L.getAttributes(),z=R.defaultAttributeValues;for(let q in U){let W=U[q];if(W.location>=0){let Z=F[q];if(Z===void 0&&(q==="instanceMatrix"&&I.instanceMatrix&&(Z=I.instanceMatrix),q==="instanceColor"&&I.instanceColor&&(Z=I.instanceColor)),Z!==void 0){let j=Z.normalized,xe=Z.itemSize,he=e.get(Z);if(he===void 0)continue;let Xe=he.buffer,qe=he.type,nt=he.bytesPerElement,ee=qe===i.INT||qe===i.UNSIGNED_INT||Z.gpuType===mo;if(Z.isInterleavedBufferAttribute){let ie=Z.data,de=ie.stride,ze=Z.offset;if(ie.isInstancedInterleavedBuffer){for(let fe=0;fe<W.locationSize;fe++)u(W.location+fe,ie.meshPerAttribute);I.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let fe=0;fe<W.locationSize;fe++)p(W.location+fe);i.bindBuffer(i.ARRAY_BUFFER,Xe);for(let fe=0;fe<W.locationSize;fe++)v(W.location+fe,xe/W.locationSize,qe,j,de*nt,(ze+xe/W.locationSize*fe)*nt,ee)}else{if(Z.isInstancedBufferAttribute){for(let ie=0;ie<W.locationSize;ie++)u(W.location+ie,Z.meshPerAttribute);I.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let ie=0;ie<W.locationSize;ie++)p(W.location+ie);i.bindBuffer(i.ARRAY_BUFFER,Xe);for(let ie=0;ie<W.locationSize;ie++)v(W.location+ie,xe/W.locationSize,qe,j,xe*nt,xe/W.locationSize*ie*nt,ee)}}else if(z!==void 0){let j=z[q];if(j!==void 0)switch(j.length){case 2:i.vertexAttrib2fv(W.location,j);break;case 3:i.vertexAttrib3fv(W.location,j);break;case 4:i.vertexAttrib4fv(W.location,j);break;default:i.vertexAttrib1fv(W.location,j)}}}}y()}function E(){M();for(let I in n){let R=n[I];for(let L in R){let P=R[L];for(let F in P){let U=P[F];for(let z in U)d(U[z].object),delete U[z];delete P[F]}}delete n[I]}}function S(I){if(n[I.id]===void 0)return;let R=n[I.id];for(let L in R){let P=R[L];for(let F in P){let U=P[F];for(let z in U)d(U[z].object),delete U[z];delete P[F]}}delete n[I.id]}function T(I){for(let R in n){let L=n[R];for(let P in L){let F=L[P];if(F[I.id]===void 0)continue;let U=F[I.id];for(let z in U)d(U[z].object),delete U[z];delete F[I.id]}}}function x(I){for(let R in n){let L=n[R],P=I.isInstancedMesh===!0?I.id:0,F=L[P];if(F!==void 0){for(let U in F){let z=F[U];for(let q in z)d(z[q].object),delete z[q];delete F[U]}delete L[P],Object.keys(L).length===0&&delete n[R]}}}function M(){A(),a=!0,r!==s&&(r=s,c(r.object))}function A(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:M,resetDefaultState:A,dispose:E,releaseStatesOfGeometry:S,releaseStatesOfObject:x,releaseStatesOfProgram:T,initAttributes:b,enableAttribute:p,disableUnusedAttributes:y}}function rg(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,d){d!==0&&(i.drawArraysInstanced(n,l,c,d),t.update(c,n,d))}function o(l,c,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,d);let h=0;for(let m=0;m<d;m++)h+=c[m];t.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function ag(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let T=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(T){return!(T!==An&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){let x=T===vn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==dn&&T!==Tn&&!x&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",d=l(c);d!==c&&($e("WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);let f=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&$e("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),u=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=i.getParameter(i.MAX_SAMPLES),S=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:m,maxVertexTextures:g,maxTextureSize:b,maxCubemapSize:p,maxAttributes:u,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:_,maxSamples:E,samples:S}}function og(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Dn,o=new tt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){let m=f.length!==0||h||n!==0||s;return s=h,n=f.length,m},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,h){t=d(f,h,0)},this.setState=function(f,h,m){let g=f.clippingPlanes,b=f.clipIntersection,p=f.clipShadows,u=i.get(f);if(!s||g===null||g.length===0||r&&!p)r?d(null):c();else{let y=r?0:n,v=y*4,_=u.clippingState||null;l.value=_,_=d(g,h,v,m);for(let E=0;E!==v;++E)_[E]=t[E];u.clippingState=_,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(f,h,m,g){let b=f!==null?f.length:0,p=null;if(b!==0){if(p=l.value,g!==!0||p===null){let u=m+b*4,y=h.matrixWorldInverse;o.getNormalMatrix(y),(p===null||p.length<u)&&(p=new Float32Array(u));for(let v=0,_=m;v!==b;++v,_+=4)a.copy(f[v]).applyMatrix4(y,o),a.normal.toArray(p,_),p[_+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,p}}var Gs=4,lg=6,cg=20,hg=256,qr=new Us,Vu=new Te,zc=null,kc=0,Vc=0,Gc=!1,ug=new B,Ki=new B,Ws=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=ug}=r;zc=this._renderer.getRenderTarget(),kc=this._renderer.getActiveCubeFace(),Vc=this._renderer.getActiveMipmapLevel(),Gc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Wu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(zc,kc,Vc),this._renderer.xr.enabled=Gc,e.scissorTest=!1,Vs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ii||e.mapping===Ji?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),zc=this._renderer.getRenderTarget(),kc=this._renderer.getActiveCubeFace(),Vc=this._renderer.getActiveMipmapLevel(),Gc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:kt,minFilter:kt,generateMipmaps:!1,type:vn,format:An,colorSpace:lr,depthBuffer:!1},s=Gu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Gu(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=dg(r)),this._blurMaterial=pg(r,e,t),this._ggxMaterial=fg(r,e,t)}return s}_compileMaterial(e){let t=new We(new St,e);this._renderer.compile(t,qr)}_sceneToCubeUV(e,t,n,s,r){let l=new $t(90,1,t,n),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,m=f.toneMapping;f.getClearColor(Vu),f.toneMapping=On,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new We(new mn,new Hi({name:"PMREM.Background",side:Kt,depthWrite:!1,depthTest:!1})));let b=this._backgroundBox,p=b.material,u=!1,y=e.background;y?y.isColor&&(p.color.copy(y),e.background=null,u=!0):(p.color.copy(Vu),u=!0);for(let v=0;v<6;v++){let _=v%3;_===0?(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+d[v],r.y,r.z)):_===1?(l.up.set(0,0,c[v]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+d[v],r.z)):(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+d[v]));let E=this._cubeSize;Vs(s,_*E,v>2?E:0,E,E),f.setRenderTarget(s),u&&f.render(b,l),f.render(e,l)}f.toneMapping=m,f.autoClear=h,e.background=y}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Ii||e.mapping===Ji;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Wu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hu());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;Vs(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,qr)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-d*d),h=c*1.25,m=f*h,{_lodMax:g}=this,b=this._sizeLods[n],p=3*b*(n>g-Gs?n-g+Gs:0),u=4*(this._cubeSize-b);l.envMap.value=e.texture,l.roughness.value=m,l.mipInt.value=g-t,Vs(r,p,u,3*b,2*b),s.setRenderTarget(r),s.render(o,qr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,Vs(e,p,u,3*b,2*b),s.setRenderTarget(e),s.render(o,qr)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,s,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let d=this._sizeLods[s],f=3*d*(s>this._lodMax-Gs?s-this._lodMax+Gs:0),h=4*(this._cubeSize-d);Vs(t,f,h,3*d,2*d),a.setRenderTarget(t),a.render(l,qr)}};function dg(i){let e=[],t=[],n=i,s=i-Gs+1+lg;for(let r=0;r<s;r++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),l=-o,c=1+o,d=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,h=6,m=3,g=new Float32Array(m*h*f),b=new Float32Array(m*h*f);for(let u=0;u<f;u++){let y=u%3*2/3-1,v=u>2?0:-1,_=[y,v,0,y+2/3,v,0,y+2/3,v+1,0,y,v,0,y+2/3,v+1,0,y,v+1,0];g.set(_,m*h*u);for(let E=0;E<h;E++){let S=d[E*2]*2-1,T=d[E*2+1]*2-1;u===0?Ki.set(1,T,S):u===1?Ki.set(-S,1,-T):u===2?Ki.set(-S,T,1):u===3?Ki.set(-1,T,-S):u===4?Ki.set(-S,-1,T):Ki.set(S,T,-1),Ki.toArray(b,(u*h+E)*m)}}let p=new St;p.setAttribute("position",new Yt(g,m)),p.setAttribute("outputDirection",new Yt(b,m)),t.push(new We(p,null)),n>Gs&&n--}return{lodMeshes:t,sizeLods:e}}function Gu(i,e,t){let n=new un(i,e,t);return n.texture.mapping=Or,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Vs(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function fg(i,e,t){return new Gt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:hg,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:sl(),fragmentShader:`

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
		`,blending:Yn,depthTest:!1,depthWrite:!1})}function pg(i,e,t){return new Gt({name:"SphericalGaussianBlur",defines:{SAMPLES:cg,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:sl(),fragmentShader:`

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
		`,blending:Yn,depthTest:!1,depthWrite:!1})}function Hu(){return new Gt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:sl(),fragmentShader:`

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
		`,blending:Yn,depthTest:!1,depthWrite:!1})}function Wu(){return new Gt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:sl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Yn,depthTest:!1,depthWrite:!1})}function sl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Xs=class extends un{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new xr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new mn(5,5,5),r=new Gt({name:"CubemapFromEquirect",uniforms:$i(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Kt,blending:Yn});r.uniforms.tEquirect.value=t;let a=new We(s,r),o=t.minFilter;return t.minFilter===En&&(t.minFilter=kt),new Fs(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};function mg(i){let e=new WeakMap,t=new WeakMap,n=null;function s(h,m=!1){return h==null?null:m?a(h):r(h)}function r(h){if(h&&h.isTexture){let m=h.mapping;if(m===uo||m===fo)if(e.has(h)){let g=e.get(h).texture;return o(g,h.mapping)}else{let g=h.image;if(g&&g.height>0){let b=new Xs(g.height);return b.fromEquirectangularTexture(i,h),e.set(h,b),h.addEventListener("dispose",c),o(b.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){let m=h.mapping,g=m===uo||m===fo,b=m===Ii||m===Ji;if(g||b){let p=t.get(h),u=p!==void 0?p.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==u)return n===null&&(n=new Ws(i)),p=g?n.fromEquirectangular(h,p):n.fromCubemap(h,p),p.texture.pmremVersion=h.pmremVersion,t.set(h,p),p.texture;if(p!==void 0)return p.texture;{let y=h.image;return g&&y&&y.height>0||b&&y&&l(y)?(n===null&&(n=new Ws(i)),p=g?n.fromEquirectangular(h):n.fromCubemap(h),p.texture.pmremVersion=h.pmremVersion,t.set(h,p),h.addEventListener("dispose",d),p.texture):null}}}return h}function o(h,m){return m===uo?h.mapping=Ii:m===fo&&(h.mapping=Ji),h}function l(h){let m=0,g=6;for(let b=0;b<g;b++)h[b]!==void 0&&m++;return m===g}function c(h){let m=h.target;m.removeEventListener("dispose",c);let g=e.get(m);g!==void 0&&(e.delete(m),g.dispose())}function d(h){let m=h.target;m.removeEventListener("dispose",d);let g=t.get(m);g!==void 0&&(t.delete(m),g.dispose())}function f(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function gg(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Vi("WebGLRenderer: "+n+" extension not supported."),s}}}function xg(i,e,t,n){let s={},r=new WeakMap;function a(f){let h=f.target;h.index!==null&&e.remove(h.index);for(let g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",a),delete s[h.id];let m=r.get(h);m&&(e.remove(m),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(f,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function l(f){let h=f.attributes;for(let m in h)e.update(h[m],i.ARRAY_BUFFER)}function c(f){let h=[],m=f.index,g=f.attributes.position,b=0;if(g===void 0)return;if(m!==null){let y=m.array;b=m.version;for(let v=0,_=y.length;v<_;v+=3){let E=y[v+0],S=y[v+1],T=y[v+2];h.push(E,S,S,T,T,E)}}else{let y=g.array;b=g.version;for(let v=0,_=y.length/3-1;v<_;v+=3){let E=v+0,S=v+1,T=v+2;h.push(E,S,S,T,T,E)}}let p=new(g.count>=65535?pr:fr)(h,1);p.version=b;let u=r.get(f);u&&e.remove(u),r.set(f,p)}function d(f){let h=r.get(f);if(h){let m=f.index;m!==null&&h.version<m.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:d}}function _g(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,h){i.drawElements(n,h,r,f*a),t.update(h,n,1)}function c(f,h,m){m!==0&&(i.drawElementsInstanced(n,h,r,f*a,m),t.update(h,n,m))}function d(f,h,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,f,0,m);let b=0;for(let p=0;p<m;p++)b+=h[p];t.update(b,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d}function vg(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Je("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function yg(i,e,t){let n=new WeakMap,s=new It;function r(a,o,l){let c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=d!==void 0?d.length:0,h=n.get(o);if(h===void 0||h.count!==f){let M=function(){T.dispose(),n.delete(o),o.removeEventListener("dispose",M)};h!==void 0&&h.texture.dispose();let m=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,b=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],u=o.morphAttributes.normal||[],y=o.morphAttributes.color||[],v=0;m===!0&&(v=1),g===!0&&(v=2),b===!0&&(v=3);let _=o.attributes.position.count*v,E=1;_>e.maxTextureSize&&(E=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);let S=new Float32Array(_*E*4*f),T=new ur(S,_,E,f);T.type=Tn,T.needsUpdate=!0;let x=v*4;for(let A=0;A<f;A++){let I=p[A],R=u[A],L=y[A],P=_*E*4*A;for(let F=0;F<I.count;F++){let U=F*x;m===!0&&(s.fromBufferAttribute(I,F),S[P+U+0]=s.x,S[P+U+1]=s.y,S[P+U+2]=s.z,S[P+U+3]=0),g===!0&&(s.fromBufferAttribute(R,F),S[P+U+4]=s.x,S[P+U+5]=s.y,S[P+U+6]=s.z,S[P+U+7]=0),b===!0&&(s.fromBufferAttribute(L,F),S[P+U+8]=s.x,S[P+U+9]=s.y,S[P+U+10]=s.z,S[P+U+11]=L.itemSize===4?s.w:1)}}h={count:f,texture:T,size:new pe(_,E)},n.set(o,h),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let m=0;for(let b=0;b<c.length;b++)m+=c[b];let g=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function Mg(i,e,t,n,s){let r=new WeakMap;function a(c){let d=s.render.frame,f=c.geometry,h=e.get(c,f);if(r.get(h)!==d&&(e.update(h),r.set(h,d)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==d&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,d))),c.isSkinnedMesh){let m=c.skeleton;r.get(m)!==d&&(m.update(),r.set(m,d))}return h}function o(){r=new WeakMap}function l(c){let d=c.target;d.removeEventListener("dispose",l),n.releaseStatesOfObject(d),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:a,dispose:o}}var bg={[pc]:"LINEAR_TONE_MAPPING",[mc]:"REINHARD_TONE_MAPPING",[gc]:"CINEON_TONE_MAPPING",[Fr]:"ACES_FILMIC_TONE_MAPPING",[_c]:"AGX_TONE_MAPPING",[vc]:"NEUTRAL_TONE_MAPPING",[xc]:"CUSTOM_TONE_MAPPING"};function Sg(i,e,t,n,s,r){let a=new un(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new St;c.setAttribute("position",new He([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new He([0,2,0,0,2,0],2));let d=new Ja({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new We(c,d),h=new Us(-1,1,1,-1,0,1),m=null,g=null,b=!1,p,u=null,y=[],v=!1;this.setSize=function(_,E){a.setSize(_,E),o!==null&&o.setSize(_,E),l!==null&&l.setSize(_,E);for(let S=0;S<y.length;S++){let T=y[S];T.setSize&&T.setSize(_,E)}},this.setEffects=function(_){y=_,v=y.length>0&&y[0].isRenderPass===!0;let E=a.width,S=a.height;y.length>0&&o===null&&(o=new un(E,S,{type:vn,depthBuffer:!1,stencilBuffer:!1}),l=new un(E,S,{type:vn,depthBuffer:!1,stencilBuffer:!1}));for(let T=0;T<y.length;T++){let x=y[T];x.setSize&&x.setSize(E,S)}},this.begin=function(_,E){if(b||_.toneMapping===On&&y.length===0)return!1;if(u=E,E!==null){let S=E.width,T=E.height;(a.width!==S||a.height!==T)&&this.setSize(S,T)}return v===!1&&_.setRenderTarget(a),p=_.toneMapping,_.toneMapping=On,!0},this.hasRenderPass=function(){return v},this.end=function(_,E){_.toneMapping=p,b=!0;let S=a,T=o;for(let x=0;x<y.length;x++){let M=y[x];M.enabled!==!1&&(M.render(_,T,S,E),M.needsSwap!==!1&&(S=T,T=T===o?l:o))}if(m!==_.outputColorSpace||g!==_.toneMapping){m=_.outputColorSpace,g=_.toneMapping,d.defines={},dt.getTransfer(m)===Mt&&(d.defines.SRGB_TRANSFER="");let x=bg[g];x&&(d.defines[x]=""),d.needsUpdate=!0}d.uniforms.tDiffuse.value=S.texture,_.setRenderTarget(u),_.render(f,h),u=null,b=!1},this.isCompositing=function(){return b},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),d.dispose()}}var hd=new cn,Xc=new wi(1,1),ud=new ur,dd=new ka,fd=new xr,Xu=[],qu=[],Yu=new Float32Array(16),Zu=new Float32Array(9),Ju=new Float32Array(4);function qs(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Xu[s];if(r===void 0&&(r=new Float32Array(s),Xu[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Ht(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Wt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function rl(i,e){let t=qu[e];t===void 0&&(t=new Int32Array(e),qu[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function wg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Eg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;i.uniform2fv(this.addr,e),Wt(t,e)}}function Tg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ht(t,e))return;i.uniform3fv(this.addr,e),Wt(t,e)}}function Ag(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;i.uniform4fv(this.addr,e),Wt(t,e)}}function Cg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ht(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Wt(t,e)}else{if(Ht(t,n))return;Ju.set(n),i.uniformMatrix2fv(this.addr,!1,Ju),Wt(t,n)}}function Rg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ht(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Wt(t,e)}else{if(Ht(t,n))return;Zu.set(n),i.uniformMatrix3fv(this.addr,!1,Zu),Wt(t,n)}}function Ig(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ht(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Wt(t,e)}else{if(Ht(t,n))return;Yu.set(n),i.uniformMatrix4fv(this.addr,!1,Yu),Wt(t,n)}}function Pg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Lg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;i.uniform2iv(this.addr,e),Wt(t,e)}}function Dg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ht(t,e))return;i.uniform3iv(this.addr,e),Wt(t,e)}}function Ng(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;i.uniform4iv(this.addr,e),Wt(t,e)}}function Ug(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Fg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;i.uniform2uiv(this.addr,e),Wt(t,e)}}function Og(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ht(t,e))return;i.uniform3uiv(this.addr,e),Wt(t,e)}}function Bg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;i.uniform4uiv(this.addr,e),Wt(t,e)}}function zg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Xc.compareFunction=t.isReversedDepthBuffer()?el:jo,r=Xc):r=hd,t.setTexture2D(e||r,s)}function kg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||dd,s)}function Vg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||fd,s)}function Gg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||ud,s)}function Hg(i){switch(i){case 5126:return wg;case 35664:return Eg;case 35665:return Tg;case 35666:return Ag;case 35674:return Cg;case 35675:return Rg;case 35676:return Ig;case 5124:case 35670:return Pg;case 35667:case 35671:return Lg;case 35668:case 35672:return Dg;case 35669:case 35673:return Ng;case 5125:return Ug;case 36294:return Fg;case 36295:return Og;case 36296:return Bg;case 35678:case 36198:case 36298:case 36306:case 35682:return zg;case 35679:case 36299:case 36307:return kg;case 35680:case 36300:case 36308:case 36293:return Vg;case 36289:case 36303:case 36311:case 36292:return Gg}}function Wg(i,e){i.uniform1fv(this.addr,e)}function Xg(i,e){let t=qs(e,this.size,2);i.uniform2fv(this.addr,t)}function qg(i,e){let t=qs(e,this.size,3);i.uniform3fv(this.addr,t)}function Yg(i,e){let t=qs(e,this.size,4);i.uniform4fv(this.addr,t)}function Zg(i,e){let t=qs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Jg(i,e){let t=qs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function $g(i,e){let t=qs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Kg(i,e){i.uniform1iv(this.addr,e)}function Qg(i,e){i.uniform2iv(this.addr,e)}function jg(i,e){i.uniform3iv(this.addr,e)}function ex(i,e){i.uniform4iv(this.addr,e)}function tx(i,e){i.uniform1uiv(this.addr,e)}function nx(i,e){i.uniform2uiv(this.addr,e)}function ix(i,e){i.uniform3uiv(this.addr,e)}function sx(i,e){i.uniform4uiv(this.addr,e)}function rx(i,e,t){let n=this.cache,s=e.length,r=rl(t,s);Ht(n,r)||(i.uniform1iv(this.addr,r),Wt(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Xc:a=hd;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function ax(i,e,t){let n=this.cache,s=e.length,r=rl(t,s);Ht(n,r)||(i.uniform1iv(this.addr,r),Wt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||dd,r[a])}function ox(i,e,t){let n=this.cache,s=e.length,r=rl(t,s);Ht(n,r)||(i.uniform1iv(this.addr,r),Wt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||fd,r[a])}function lx(i,e,t){let n=this.cache,s=e.length,r=rl(t,s);Ht(n,r)||(i.uniform1iv(this.addr,r),Wt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||ud,r[a])}function cx(i){switch(i){case 5126:return Wg;case 35664:return Xg;case 35665:return qg;case 35666:return Yg;case 35674:return Zg;case 35675:return Jg;case 35676:return $g;case 5124:case 35670:return Kg;case 35667:case 35671:return Qg;case 35668:case 35672:return jg;case 35669:case 35673:return ex;case 5125:return tx;case 36294:return nx;case 36295:return ix;case 36296:return sx;case 35678:case 36198:case 36298:case 36306:case 35682:return rx;case 35679:case 36299:case 36307:return ax;case 35680:case 36300:case 36308:case 36293:return ox;case 36289:case 36303:case 36311:case 36292:return lx}}var qc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Hg(t.type)}},Yc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=cx(t.type)}},Zc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Hc=/(\w+)(\])?(\[|\.)?/g;function $u(i,e){i.seq.push(e),i.map[e.id]=e}function hx(i,e,t){let n=i.name,s=n.length;for(Hc.lastIndex=0;;){let r=Hc.exec(n),a=Hc.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){$u(t,c===void 0?new qc(o,i,e):new Yc(o,i,e));break}else{let f=t.map[o];f===void 0&&(f=new Zc(o),$u(t,f)),t=f}}}var Hs=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);hx(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function Ku(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var ux=37297,dx=0;function fx(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var Qu=new tt;function px(i){dt._getMatrix(Qu,dt.workingColorSpace,i);let e=`mat3( ${Qu.elements.map(t=>t.toFixed(4))} )`;switch(dt.getTransfer(i)){case cr:return[e,"LinearTransferOETF"];case Mt:return[e,"sRGBTransferOETF"];default:return $e("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function ju(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+fx(i.getShaderSource(e),o)}else return r}function mx(i,e){let t=px(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var gx={[pc]:"Linear",[mc]:"Reinhard",[gc]:"Cineon",[Fr]:"ACESFilmic",[_c]:"AgX",[vc]:"Neutral",[xc]:"Custom"};function xx(i,e){let t=gx[e];return t===void 0?($e("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var nl=new B;function _x(){dt.getLuminanceCoefficients(nl);let i=nl.x.toFixed(4),e=nl.y.toFixed(4),t=nl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function vx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Zr).join(`
`)}function yx(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Mx(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Zr(i){return i!==""}function ed(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function td(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var bx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Jc(i){return i.replace(bx,wx)}var Sx=new Map;function wx(i,e){let t=lt[e];if(t===void 0){let n=Sx.get(e);if(n!==void 0)t=lt[n],$e('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Jc(t)}var Ex=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nd(i){return i.replace(Ex,Tx)}function Tx(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function id(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}var Ax={[Ur]:"SHADOWMAP_TYPE_PCF",[Os]:"SHADOWMAP_TYPE_VSM"};function Cx(i){return Ax[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Rx={[Ii]:"ENVMAP_TYPE_CUBE",[Ji]:"ENVMAP_TYPE_CUBE",[Or]:"ENVMAP_TYPE_CUBE_UV"};function Ix(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Rx[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var Px={[Ji]:"ENVMAP_MODE_REFRACTION"};function Lx(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Px[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Dx={[fc]:"ENVMAP_BLENDING_MULTIPLY",[gu]:"ENVMAP_BLENDING_MIX",[xu]:"ENVMAP_BLENDING_ADD"};function Nx(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Dx[i.combine]||"ENVMAP_BLENDING_NONE"}function Ux(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Fx(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=Cx(t),c=Ix(t),d=Lx(t),f=Nx(t),h=Ux(t),m=vx(t),g=yx(r),b=s.createProgram(),p,u,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Zr).join(`
`),p.length>0&&(p+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Zr).join(`
`),u.length>0&&(u+=`
`)):(p=[id(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Zr).join(`
`),u=[id(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==On?"#define TONE_MAPPING":"",t.toneMapping!==On?lt.tonemapping_pars_fragment:"",t.toneMapping!==On?xx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",lt.colorspace_pars_fragment,mx("linearToOutputTexel",t.outputColorSpace),_x(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Zr).join(`
`)),a=Jc(a),a=ed(a,t),a=td(a,t),o=Jc(o),o=ed(o,t),o=td(o,t),a=nd(a),o=nd(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,u=["#define varying in",t.glslVersion===Ac?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ac?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);let v=y+p+a,_=y+u+o,E=Ku(s,s.VERTEX_SHADER,v),S=Ku(s,s.FRAGMENT_SHADER,_);s.attachShader(b,E),s.attachShader(b,S),t.index0AttributeName!==void 0?s.bindAttribLocation(b,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(b,0,"position"),s.linkProgram(b);function T(I){if(i.debug.checkShaderErrors){let R=s.getProgramInfoLog(b)||"",L=s.getShaderInfoLog(E)||"",P=s.getShaderInfoLog(S)||"",F=R.trim(),U=L.trim(),z=P.trim(),q=!0,W=!0;if(s.getProgramParameter(b,s.LINK_STATUS)===!1)if(q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,b,E,S);else{let Z=ju(s,E,"vertex"),j=ju(s,S,"fragment");Je("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(b,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+F+`
`+Z+`
`+j)}else F!==""?$e("WebGLProgram: Program Info Log:",F):(U===""||z==="")&&(W=!1);W&&(I.diagnostics={runnable:q,programLog:F,vertexShader:{log:U,prefix:p},fragmentShader:{log:z,prefix:u}})}s.deleteShader(E),s.deleteShader(S),x=new Hs(s,b),M=Mx(s,b)}let x;this.getUniforms=function(){return x===void 0&&T(this),x};let M;this.getAttributes=function(){return M===void 0&&T(this),M};let A=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=s.getProgramParameter(b,ux)),A},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(b),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=dx++,this.cacheKey=e,this.usedTimes=1,this.program=b,this.vertexShader=E,this.fragmentShader=S,this}var Ox=0,$c=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Kc(e),t.set(e,n)),n}},Kc=class{constructor(e){this.id=Ox++,this.code=e,this.usedTimes=0}};function Bx(i){return i===Li||i===Hr||i===Wr}function zx(i,e,t,n,s,r){let a=new Ts,o=new $c,l=new Set,c=[],d=new Map,f=n.logarithmicDepthBuffer,h=n.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return l.add(x),x===0?"uv":`uv${x}`}function b(x,M,A,I,R,L){let P=I.fog,F=R.geometry,U=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?I.environment:null,z=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,q=e.get(x.envMap||U,z),W=q&&q.mapping===Or?q.image.height:null,Z=m[x.type];x.precision!==null&&(h=n.getMaxPrecision(x.precision),h!==x.precision&&$e("WebGLProgram.getParameters:",x.precision,"not supported, using",h,"instead."));let j=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,xe=j!==void 0?j.length:0,he=0;F.morphAttributes.position!==void 0&&(he=1),F.morphAttributes.normal!==void 0&&(he=2),F.morphAttributes.color!==void 0&&(he=3);let Xe,qe,nt,ee;if(Z){let Et=Jn[Z];Xe=Et.vertexShader,qe=Et.fragmentShader}else{Xe=x.vertexShader,qe=x.fragmentShader;let Et=o.getVertexShaderStage(x),vt=o.getFragmentShaderStage(x);o.update(x,Et,vt),nt=Et.id,ee=vt.id}let ie=i.getRenderTarget(),de=i.state.buffers.depth.getReversed(),ze=R.isInstancedMesh===!0,fe=R.isBatchedMesh===!0,De=!!x.map,Re=!!x.matcap,N=!!q,H=!!x.aoMap,k=!!x.lightMap,Y=!!x.bumpMap&&x.wireframe===!1,se=!!x.normalMap,me=!!x.displacementMap,Ae=!!x.emissiveMap,Le=!!x.metalnessMap,Be=!!x.roughnessMap,O=x.anisotropy>0,et=x.clearcoat>0,Qe=x.dispersion>0,D=x.retroreflectivity>0,w=x.iridescence>0,X=x.sheen>0,K=x.transmission>0,te=O&&!!x.anisotropyMap,ue=et&&!!x.clearcoatMap,ge=et&&!!x.clearcoatNormalMap,ne=et&&!!x.clearcoatRoughnessMap,oe=w&&!!x.iridescenceMap,_e=w&&!!x.iridescenceThicknessMap,ke=X&&!!x.sheenColorMap,be=X&&!!x.sheenRoughnessMap,ve=!!x.specularMap,Ve=!!x.specularColorMap,Ye=!!x.specularIntensityMap,rt=K&&!!x.transmissionMap,G=K&&!!x.thicknessMap,ye=!!x.gradientMap,ae=!!x.alphaMap,Me=x.alphaTest>0,Ce=!!x.alphaHash,ce=!!x.extensions,Ge=On;x.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(Ge=i.toneMapping);let Fe={shaderID:Z,shaderType:x.type,shaderName:x.name,vertexShader:Xe,fragmentShader:qe,defines:x.defines,customVertexShaderID:nt,customFragmentShaderID:ee,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:h,batching:fe,batchingColor:fe&&R._colorsTexture!==null,instancing:ze,instancingColor:ze&&R.instanceColor!==null,instancingMorph:ze&&R.morphTexture!==null,outputColorSpace:ie===null?i.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:dt.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:De,matcap:Re,envMap:N,envMapMode:N&&q.mapping,envMapCubeUVHeight:W,aoMap:H,lightMap:k,bumpMap:Y,normalMap:se,displacementMap:me,emissiveMap:Ae,normalMapObjectSpace:se&&x.normalMapType===yu,normalMapTangentSpace:se&&x.normalMapType===Qo,packedNormalMap:se&&x.normalMapType===Qo&&Bx(x.normalMap.format),metalnessMap:Le,roughnessMap:Be,anisotropy:O,anisotropyMap:te,clearcoat:et,clearcoatMap:ue,clearcoatNormalMap:ge,clearcoatRoughnessMap:ne,dispersion:Qe,retroreflection:D,iridescence:w,iridescenceMap:oe,iridescenceThicknessMap:_e,sheen:X,sheenColorMap:ke,sheenRoughnessMap:be,specularMap:ve,specularColorMap:Ve,specularIntensityMap:Ye,transmission:K,transmissionMap:rt,thicknessMap:G,gradientMap:ye,opaque:x.transparent===!1&&x.blending===Ri&&x.alphaToCoverage===!1,alphaMap:ae,alphaTest:Me,alphaHash:Ce,combine:x.combine,mapUv:De&&g(x.map.channel),aoMapUv:H&&g(x.aoMap.channel),lightMapUv:k&&g(x.lightMap.channel),bumpMapUv:Y&&g(x.bumpMap.channel),normalMapUv:se&&g(x.normalMap.channel),displacementMapUv:me&&g(x.displacementMap.channel),emissiveMapUv:Ae&&g(x.emissiveMap.channel),metalnessMapUv:Le&&g(x.metalnessMap.channel),roughnessMapUv:Be&&g(x.roughnessMap.channel),anisotropyMapUv:te&&g(x.anisotropyMap.channel),clearcoatMapUv:ue&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:ge&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ne&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:oe&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:_e&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:ke&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:be&&g(x.sheenRoughnessMap.channel),specularMapUv:ve&&g(x.specularMap.channel),specularColorMapUv:Ve&&g(x.specularColorMap.channel),specularIntensityMapUv:Ye&&g(x.specularIntensityMap.channel),transmissionMapUv:rt&&g(x.transmissionMap.channel),thicknessMapUv:G&&g(x.thicknessMap.channel),alphaMapUv:ae&&g(x.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(se||O),vertexNormals:!!F.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:R.isPoints===!0&&!!F.attributes.uv&&(De||ae),fog:!!P,useFog:x.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||F.attributes.normal===void 0&&se===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:de,skinning:R.isSkinnedMesh===!0,hasPositionAttribute:F.attributes.position!==void 0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:he,numSunLights:M.sun.length,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numSunLightShadows:M.sunShadowMap.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numLightProbeGrids:L.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ge,decodeVideoTexture:De&&x.map.isVideoTexture===!0&&dt.getTransfer(x.map.colorSpace)===Mt,decodeVideoTextureEmissive:Ae&&x.emissiveMap.isVideoTexture===!0&&dt.getTransfer(x.emissiveMap.colorSpace)===Mt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===sn,flipSided:x.side===Kt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:ce&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ce&&x.extensions.multiDraw===!0||fe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Fe.vertexUv1s=l.has(1),Fe.vertexUv2s=l.has(2),Fe.vertexUv3s=l.has(3),l.clear(),Fe}function p(x){let M=[];if(x.shaderID?M.push(x.shaderID):(M.push(x.customVertexShaderID),M.push(x.customFragmentShaderID)),x.defines!==void 0)for(let A in x.defines)M.push(A),M.push(x.defines[A]);return x.isRawShaderMaterial===!1&&(u(M,x),y(M,x),M.push(i.outputColorSpace)),M.push(x.customProgramCacheKey),M.join()}function u(x,M){x.push(M.precision),x.push(M.outputColorSpace),x.push(M.envMapMode),x.push(M.envMapCubeUVHeight),x.push(M.mapUv),x.push(M.alphaMapUv),x.push(M.lightMapUv),x.push(M.aoMapUv),x.push(M.bumpMapUv),x.push(M.normalMapUv),x.push(M.displacementMapUv),x.push(M.emissiveMapUv),x.push(M.metalnessMapUv),x.push(M.roughnessMapUv),x.push(M.anisotropyMapUv),x.push(M.clearcoatMapUv),x.push(M.clearcoatNormalMapUv),x.push(M.clearcoatRoughnessMapUv),x.push(M.iridescenceMapUv),x.push(M.iridescenceThicknessMapUv),x.push(M.sheenColorMapUv),x.push(M.sheenRoughnessMapUv),x.push(M.specularMapUv),x.push(M.specularColorMapUv),x.push(M.specularIntensityMapUv),x.push(M.transmissionMapUv),x.push(M.thicknessMapUv),x.push(M.combine),x.push(M.fogExp2),x.push(M.sizeAttenuation),x.push(M.morphTargetsCount),x.push(M.morphAttributeCount),x.push(M.numSunLights),x.push(M.numDirLights),x.push(M.numPointLights),x.push(M.numSpotLights),x.push(M.numSpotLightMaps),x.push(M.numHemiLights),x.push(M.numRectAreaLights),x.push(M.numSunLightShadows),x.push(M.numDirLightShadows),x.push(M.numPointLightShadows),x.push(M.numSpotLightShadows),x.push(M.numSpotLightShadowsWithMaps),x.push(M.numLightProbes),x.push(M.shadowMapType),x.push(M.toneMapping),x.push(M.numClippingPlanes),x.push(M.numClipIntersection),x.push(M.depthPacking)}function y(x,M){a.disableAll(),M.instancing&&a.enable(0),M.instancingColor&&a.enable(1),M.instancingMorph&&a.enable(2),M.matcap&&a.enable(3),M.envMap&&a.enable(4),M.normalMapObjectSpace&&a.enable(5),M.normalMapTangentSpace&&a.enable(6),M.clearcoat&&a.enable(7),M.iridescence&&a.enable(8),M.alphaTest&&a.enable(9),M.vertexColors&&a.enable(10),M.vertexAlphas&&a.enable(11),M.vertexUv1s&&a.enable(12),M.vertexUv2s&&a.enable(13),M.vertexUv3s&&a.enable(14),M.vertexTangents&&a.enable(15),M.anisotropy&&a.enable(16),M.alphaHash&&a.enable(17),M.batching&&a.enable(18),M.dispersion&&a.enable(19),M.retroreflection&&a.enable(24),M.batchingColor&&a.enable(20),M.gradientMap&&a.enable(21),M.packedNormalMap&&a.enable(22),M.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),M.numLightProbeGrids>0&&a.enable(22),M.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function v(x){let M=m[x.type],A;if(M){let I=Jn[M];A=Bu.clone(I.uniforms)}else A=x.uniforms;return A}function _(x,M){let A=d.get(M);return A!==void 0?++A.usedTimes:(A=new Fx(i,M,x,s),c.push(A),d.set(M,A)),A}function E(x){if(--x.usedTimes===0){let M=c.indexOf(x);c[M]=c[c.length-1],c.pop(),d.delete(x.cacheKey),x.destroy()}}function S(x){o.remove(x)}function T(){o.dispose()}return{getParameters:b,getProgramCacheKey:p,getUniforms:v,acquireProgram:_,releaseProgram:E,releaseShaderCache:S,programs:c,dispose:T}}function kx(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Vx(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function sd(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function rd(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(h){let m=0;return h.isInstancedMesh&&(m+=2),h.isSkinnedMesh&&(m+=1),m}function o(h,m,g,b,p,u){let y=i[e];return y===void 0?(y={id:h.id,object:h,geometry:m,material:g,materialVariant:a(h),groupOrder:b,renderOrder:h.renderOrder,z:p,group:u},i[e]=y):(y.id=h.id,y.object=h,y.geometry=m,y.material=g,y.materialVariant=a(h),y.groupOrder=b,y.renderOrder=h.renderOrder,y.z=p,y.group=u),e++,y}function l(h,m,g,b,p,u,y){y.reversedDepth===!0&&(p=-p);let v=o(h,m,g,b,p,u);g.transmission>0?n.push(v):g.transparent===!0?s.push(v):t.push(v)}function c(h,m,g,b,p,u){let y=o(h,m,g,b,p,u);g.transmission>0?n.unshift(y):g.transparent===!0?s.unshift(y):t.unshift(y)}function d(h,m){t.length>1&&t.sort(h||Vx),n.length>1&&n.sort(m||sd),s.length>1&&s.sort(m||sd)}function f(){for(let h=e,m=i.length;h<m;h++){let g=i[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:f,sort:d}}function Gx(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new rd,i.set(n,[a])):s>=r.length?(a=new rd,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Hx(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new B,color:new Te};break;case"SpotLight":t={position:new B,direction:new B,color:new Te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new B,color:new Te,distance:0,decay:0};break;case"HemisphereLight":t={direction:new B,skyColor:new Te,groundColor:new Te};break;case"RectAreaLight":t={color:new Te,position:new B,halfWidth:new B,halfHeight:new B};break}return i[e.id]=t,t}}}function Wx(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Xx=0;function qx(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Yx(i){let e=new Hx,t=Wx(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new B);let s=new B,r=new gt,a=new gt;function o(c){let d=0,f=0,h=0;for(let R=0;R<9;R++)n.probe[R].set(0,0,0);let m=0,g=0,b=0,p=0,u=0,y=0,v=0,_=0,E=0,S=0,T=0,x=0,M=0,A=0;c.sort(qx);for(let R=0,L=c.length;R<L;R++){let P=c[R],F=P.color,U=P.intensity,z=P.distance,q=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Li?q=P.shadow.map.texture:q=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)d+=F.r*U,f+=F.g*U,h+=F.b*U;else if(P.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(P.sh.coefficients[W],U);A++}else if(P.isSunLight){let W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let Z=P.shadow,j=t.get(P);j.shadowIntensity=Z.intensity,j.shadowBias=Z.bias,j.shadowNormalBias=Z.normalBias,j.shadowRadius=Z.radius,j.shadowMapSize.copy(Z.mapSize).multiply(Z.getFrameExtents()),n.sunShadow[g]=j,n.sunShadowMap[g]=q;let xe=Z.getViewportCount();for(let he=0;he<xe;he++)n.sunShadowMatrix[b+he]=Z.getMatrix(he),n.sunShadowCascade[b+he]=Z._cascadeData[he];b+=xe,g++}n.sun[m]=W,m++}else if(P.isDirectionalLight){let W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let Z=P.shadow,j=t.get(P);j.shadowIntensity=Z.intensity,j.shadowBias=Z.bias,j.shadowNormalBias=Z.normalBias,j.shadowRadius=Z.radius,j.shadowMapSize=Z.mapSize,n.directionalShadow[p]=j,n.directionalShadowMap[p]=q,n.directionalShadowMatrix[p]=P.shadow.matrix,E++}n.directional[p]=W,p++}else if(P.isSpotLight){let W=e.get(P);W.position.setFromMatrixPosition(P.matrixWorld),W.color.copy(F).multiplyScalar(U),W.distance=z,W.coneCos=Math.cos(P.angle),W.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),W.decay=P.decay,n.spot[y]=W;let Z=P.shadow;if(P.map&&(n.spotLightMap[x]=P.map,x++,Z.updateMatrices(P),P.castShadow&&M++),n.spotLightMatrix[y]=Z.matrix,P.castShadow){let j=t.get(P);j.shadowIntensity=Z.intensity,j.shadowBias=Z.bias,j.shadowNormalBias=Z.normalBias,j.shadowRadius=Z.radius,j.shadowMapSize=Z.mapSize,n.spotShadow[y]=j,n.spotShadowMap[y]=q,T++}y++}else if(P.isRectAreaLight){let W=e.get(P);W.color.copy(F).multiplyScalar(U),W.halfWidth.set(P.width*.5,0,0),W.halfHeight.set(0,P.height*.5,0),n.rectArea[v]=W,v++}else if(P.isPointLight){let W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),W.distance=P.distance,W.decay=P.decay,P.castShadow){let Z=P.shadow,j=t.get(P);j.shadowIntensity=Z.intensity,j.shadowBias=Z.bias,j.shadowNormalBias=Z.normalBias,j.shadowRadius=Z.radius,j.shadowMapSize=Z.mapSize,j.shadowCameraNear=Z.camera.near,j.shadowCameraFar=Z.camera.far,n.pointShadow[u]=j,n.pointShadowMap[u]=q,n.pointShadowMatrix[u]=P.shadow.matrix,S++}n.point[u]=W,u++}else if(P.isHemisphereLight){let W=e.get(P);W.skyColor.copy(P.color).multiplyScalar(U),W.groundColor.copy(P.groundColor).multiplyScalar(U),n.hemi[_]=W,_++}}v>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Se.LTC_FLOAT_1,n.rectAreaLTC2=Se.LTC_FLOAT_2):(n.rectAreaLTC1=Se.LTC_HALF_1,n.rectAreaLTC2=Se.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=f,n.ambient[2]=h;let I=n.hash;(I.sunLength!==m||I.directionalLength!==p||I.pointLength!==u||I.spotLength!==y||I.rectAreaLength!==v||I.hemiLength!==_||I.numSunShadows!==g||I.numDirectionalShadows!==E||I.numPointShadows!==S||I.numSpotShadows!==T||I.numSpotMaps!==x||I.numLightProbes!==A)&&(n.sun.length=m,n.directional.length=p,n.spot.length=y,n.rectArea.length=v,n.point.length=u,n.hemi.length=_,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=b,n.sunShadowCascade.length=b,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.directionalShadowMatrix.length=E,n.pointShadow.length=S,n.pointShadowMap.length=S,n.pointShadowMatrix.length=S,n.spotShadow.length=T,n.spotShadowMap.length=T,n.spotLightMatrix.length=T+x-M,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=M,n.numLightProbes=A,I.sunLength=m,I.directionalLength=p,I.pointLength=u,I.spotLength=y,I.rectAreaLength=v,I.hemiLength=_,I.numSunShadows=g,I.numDirectionalShadows=E,I.numPointShadows=S,I.numSpotShadows=T,I.numSpotMaps=x,I.numLightProbes=A,n.version=Xx++)}function l(c,d){let f=0,h=0,m=0,g=0,b=0,p=0,u=d.matrixWorldInverse;for(let y=0,v=c.length;y<v;y++){let _=c[y];if(_.isSunLight){let E=n.sun[f];E.direction.setFromMatrixPosition(_.matrixWorld),E.direction.transformDirection(u),f++}else if(_.isDirectionalLight){let E=n.directional[h];E.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(u),h++}else if(_.isSpotLight){let E=n.spot[g];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(u),E.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(u),g++}else if(_.isRectAreaLight){let E=n.rectArea[b];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(u),a.identity(),r.copy(_.matrixWorld),r.premultiply(u),a.extractRotation(r),E.halfWidth.set(_.width*.5,0,0),E.halfHeight.set(0,_.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),b++}else if(_.isPointLight){let E=n.point[m];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(u),m++}else if(_.isHemisphereLight){let E=n.hemi[p];E.direction.setFromMatrixPosition(_.matrixWorld),E.direction.transformDirection(u),p++}}}return{setup:o,setupView:l,state:n}}function ad(i){let e=new Yx(i),t=[],n=[],s=[];function r(h){f.camera=h,t.length=0,n.length=0,s.length=0}function a(h){t.push(h)}function o(h){n.push(h)}function l(h){s.push(h)}function c(){e.setup(t)}function d(h){e.setupView(t,h)}let f={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:d,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Zx(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new ad(i),e.set(s,[o])):r>=a.length?(o=new ad(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var Jx=`void main() {
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
}`,Kx=[new B(1,0,0),new B(-1,0,0),new B(0,1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1)],Qx=[new B(0,-1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1),new B(0,-1,0),new B(0,-1,0)],od=new gt,Yr=new B,Wc=new B;function jx(i,e,t){let n=new Is,s=new pe,r=new pe,a=new It,o=new $a,l=new Ka,c={},d=t.maxTextureSize,f={[Ci]:Kt,[Kt]:Ci,[sn]:sn},h=new Gt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new pe},radius:{value:4}},vertexShader:Jx,fragmentShader:$x}),m=h.clone();m.defines.HORIZONTAL_PASS=1;let g=new St;g.setAttribute("position",new Yt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new We(g,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ur;let u=this.type;this.render=function(S,T,x){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||S.length===0)return;this.type===ho&&($e("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ur);let M=i.getRenderTarget(),A=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),R=i.state;R.setBlending(Yn),R.buffers.depth.getReversed()===!0?R.buffers.color.setClear(0,0,0,0):R.buffers.color.setClear(1,1,1,1),R.buffers.depth.setTest(!0),R.setScissorTest(!1);let L=u!==this.type;L&&T.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(F=>F.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,F=S.length;P<F;P++){let U=S[P],z=U.shadow;if(z===void 0){$e("WebGLShadowMap:",U,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);let q=z.getFrameExtents();s.multiply(q),r.copy(z.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/q.x),s.x=r.x*q.x,z.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/q.y),s.y=r.y*q.y,z.mapSize.y=r.y));let W=i.state.buffers.depth.getReversed();if(z.camera._reversedDepth=W,z.map===null||L===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===Os){if(U.isPointLight){$e("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new un(s.x,s.y,{format:Li,type:vn,minFilter:kt,magFilter:kt,generateMipmaps:!1}),z.map.texture.name=U.name+".shadowMap",z.map.depthTexture=new wi(s.x,s.y,Tn),z.map.depthTexture.name=U.name+".shadowMapDepth",z.map.depthTexture.format=Wn,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Zt,z.map.depthTexture.magFilter=Zt}else U.isPointLight?(z.map=new Xs(s.x),z.map.depthTexture=new Ga(s.x,Bn)):(z.map=new un(s.x,s.y),z.map.depthTexture=new wi(s.x,s.y,Bn)),z.map.depthTexture.name=U.name+".shadowMap",z.map.depthTexture.format=Wn,this.type===Ur?(z.map.depthTexture.compareFunction=W?el:jo,z.map.depthTexture.minFilter=kt,z.map.depthTexture.magFilter=kt):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Zt,z.map.depthTexture.magFilter=Zt);z.camera.updateProjectionMatrix()}z.map.isWebGLCubeRenderTarget!==!0&&(z.map.width!==s.x||z.map.height!==s.y)&&z.map.setSize(s.x,s.y);let Z=z.map.isWebGLCubeRenderTarget?6:z.getViewportCount();U.isPointLight!==!0&&z.updateMatrices(U,x);for(let j=0;j<Z;j++){let xe=z.getCamera(j);if(U.isPointLight){let he=z.camera,Xe=z.matrix,qe=U.distance||he.far;qe!==he.far&&(he.far=qe,he.updateProjectionMatrix()),Yr.setFromMatrixPosition(U.matrixWorld),he.position.copy(Yr),Wc.copy(he.position),Wc.add(Kx[j]),he.up.copy(Qx[j]),he.lookAt(Wc),he.updateMatrixWorld(),Xe.makeTranslation(-Yr.x,-Yr.y,-Yr.z),od.multiplyMatrices(he.projectionMatrix,he.matrixWorldInverse),z._frustum.setFromProjectionMatrix(od,he.coordinateSystem,he.reversedDepth)}if(z.map.isWebGLCubeRenderTarget)i.setRenderTarget(z.map,j),i.clear();else{j===0&&(i.setRenderTarget(z.map),i.clear());let he=z.getViewport(j);a.set(r.x*he.x,r.y*he.y,r.x*he.z,r.y*he.w),R.viewport(a)}n=z.getFrustum(j),_(T,x,xe,U,this.type)}z.isPointLightShadow!==!0&&this.type===Os&&y(z,x),z.needsUpdate=!1}u=this.type,p.needsUpdate=!1,i.setRenderTarget(M,A,I)};function y(S,T){let x=e.update(b);h.defines.VSM_SAMPLES!==S.blurSamples&&(h.defines.VSM_SAMPLES=S.blurSamples,m.defines.VSM_SAMPLES=S.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),S.mapPass===null?S.mapPass=new un(s.x,s.y,{format:Li,type:vn}):(S.mapPass.width!==S.map.width||S.mapPass.height!==S.map.height)&&S.mapPass.setSize(S.map.width,S.map.height),h.uniforms.shadow_pass.value=S.map.depthTexture,h.uniforms.resolution.value.set(S.map.width,S.map.height),h.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(T,null,x,h,b,null),m.uniforms.shadow_pass.value=S.mapPass.texture,m.uniforms.resolution.value.set(S.map.width,S.map.height),m.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(T,null,x,m,b,null)}function v(S,T,x,M){let A=null,I=x.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(I!==void 0)A=I;else if(A=x.isPointLight===!0?l:o,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){let R=A.uuid,L=T.uuid,P=c[R];P===void 0&&(P={},c[R]=P);let F=P[L];F===void 0&&(F=A.clone(),P[L]=F,T.addEventListener("dispose",E)),A=F}if(A.visible=T.visible,A.wireframe=T.wireframe,M===Os?A.side=T.shadowSide!==null?T.shadowSide:T.side:A.side=T.shadowSide!==null?T.shadowSide:f[T.side],A.alphaMap=T.alphaMap,A.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,A.map=T.map,A.clipShadows=T.clipShadows,A.clippingPlanes=T.clippingPlanes,A.clipIntersection=T.clipIntersection,A.displacementMap=T.displacementMap,A.displacementScale=T.displacementScale,A.displacementBias=T.displacementBias,A.wireframeLinewidth=T.wireframeLinewidth,A.linewidth=T.linewidth,x.isPointLight===!0&&A.isMeshDistanceMaterial===!0){let R=i.properties.get(A);R.light=x}return A}function _(S,T,x,M,A){if(S.visible===!1)return;if(S.layers.test(T.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&A===Os)&&(!S.frustumCulled||S.intersectsFrustum(n))){S.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,S.matrixWorld);let L=e.update(S),P=S.material;if(Array.isArray(P)){let F=L.groups;for(let U=0,z=F.length;U<z;U++){let q=F[U],W=P[q.materialIndex];if(W&&W.visible){let Z=v(S,W,M,A);S.onBeforeShadow(i,S,T,x,L,Z,q),i.renderBufferDirect(x,null,L,Z,S,q),S.onAfterShadow(i,S,T,x,L,Z,q)}}}else if(P.visible){let F=v(S,P,M,A);S.onBeforeShadow(i,S,T,x,L,F,null),i.renderBufferDirect(x,null,L,F,S,null),S.onAfterShadow(i,S,T,x,L,F,null)}}let R=S.children;for(let L=0,P=R.length;L<P;L++)_(R[L],T,x,M,A)}function E(S){S.target.removeEventListener("dispose",E);for(let x in c){let M=c[x],A=S.target.uuid;A in M&&(M[A].dispose(),delete M[A])}}}function e_(i,e){function t(){let G=!1,ye=new It,ae=null,Me=new It(0,0,0,0);return{setMask:function(Ce){ae!==Ce&&!G&&(i.colorMask(Ce,Ce,Ce,Ce),ae=Ce)},setLocked:function(Ce){G=Ce},setClear:function(Ce,ce,Ge,Fe,Et){Et===!0&&(Ce*=Fe,ce*=Fe,Ge*=Fe),ye.set(Ce,ce,Ge,Fe),Me.equals(ye)===!1&&(i.clearColor(Ce,ce,Ge,Fe),Me.copy(ye))},reset:function(){G=!1,ae=null,Me.set(-1,0,0,0)}}}function n(){let G=!1,ye=!1,ae=null,Me=null,Ce=null;return{setReversed:function(ce){if(ye!==ce){let Ge=e.get("EXT_clip_control");ce?Ge.clipControlEXT(Ge.LOWER_LEFT_EXT,Ge.ZERO_TO_ONE_EXT):Ge.clipControlEXT(Ge.LOWER_LEFT_EXT,Ge.NEGATIVE_ONE_TO_ONE_EXT),ye=ce;let Fe=Ce;Ce=null,this.setClear(Fe)}},getReversed:function(){return ye},setTest:function(ce){ce?ie(i.DEPTH_TEST):de(i.DEPTH_TEST)},setMask:function(ce){ae!==ce&&!G&&(i.depthMask(ce),ae=ce)},setFunc:function(ce){if(ye&&(ce=Lu[ce]),Me!==ce){switch(ce){case Ca:i.depthFunc(i.NEVER);break;case Ra:i.depthFunc(i.ALWAYS);break;case Ia:i.depthFunc(i.LESS);break;case bs:i.depthFunc(i.LEQUAL);break;case Pa:i.depthFunc(i.EQUAL);break;case La:i.depthFunc(i.GEQUAL);break;case Da:i.depthFunc(i.GREATER);break;case Na:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Me=ce}},setLocked:function(ce){G=ce},setClear:function(ce){Ce!==ce&&(Ce=ce,ye&&(ce=1-ce),i.clearDepth(ce))},reset:function(){G=!1,ae=null,Me=null,Ce=null,ye=!1}}}function s(){let G=!1,ye=null,ae=null,Me=null,Ce=null,ce=null,Ge=null,Fe=null,Et=null;return{setTest:function(vt){G||(vt?ie(i.STENCIL_TEST):de(i.STENCIL_TEST))},setMask:function(vt){ye!==vt&&!G&&(i.stencilMask(vt),ye=vt)},setFunc:function(vt,Rn,kn){(ae!==vt||Me!==Rn||Ce!==kn)&&(i.stencilFunc(vt,Rn,kn),ae=vt,Me=Rn,Ce=kn)},setOp:function(vt,Rn,kn){(ce!==vt||Ge!==Rn||Fe!==kn)&&(i.stencilOp(vt,Rn,kn),ce=vt,Ge=Rn,Fe=kn)},setLocked:function(vt){G=vt},setClear:function(vt){Et!==vt&&(i.clearStencil(vt),Et=vt)},reset:function(){G=!1,ye=null,ae=null,Me=null,Ce=null,ce=null,Ge=null,Fe=null,Et=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,d={},f={},h={},m=new WeakMap,g=[],b=null,p=!1,u=null,y=null,v=null,_=null,E=null,S=null,T=null,x=new Te(0,0,0),M=0,A=!1,I=null,R=null,L=null,P=null,F=null,U=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,q=0,W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(W)[1]),z=q>=1):W.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),z=q>=2);let Z=null,j={},xe=i.getParameter(i.SCISSOR_BOX),he=i.getParameter(i.VIEWPORT),Xe=new It().fromArray(xe),qe=new It().fromArray(he);function nt(G,ye,ae,Me){let Ce=new Uint8Array(4),ce=i.createTexture();i.bindTexture(G,ce),i.texParameteri(G,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(G,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ge=0;Ge<ae;Ge++)G===i.TEXTURE_3D||G===i.TEXTURE_2D_ARRAY?i.texImage3D(ye,0,i.RGBA,1,1,Me,0,i.RGBA,i.UNSIGNED_BYTE,Ce):i.texImage2D(ye+Ge,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ce);return ce}let ee={};ee[i.TEXTURE_2D]=nt(i.TEXTURE_2D,i.TEXTURE_2D,1),ee[i.TEXTURE_CUBE_MAP]=nt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[i.TEXTURE_2D_ARRAY]=nt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ee[i.TEXTURE_3D]=nt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ie(i.DEPTH_TEST),a.setFunc(bs),Y(!1),se(oc),ie(i.CULL_FACE),H(Yn);function ie(G){d[G]!==!0&&(i.enable(G),d[G]=!0)}function de(G){d[G]!==!1&&(i.disable(G),d[G]=!1)}function ze(G,ye){return h[G]!==ye?(i.bindFramebuffer(G,ye),h[G]=ye,G===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=ye),G===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=ye),!0):!1}function fe(G,ye){let ae=g,Me=!1;if(G){ae=m.get(ye),ae===void 0&&(ae=[],m.set(ye,ae));let Ce=G.textures;if(ae.length!==Ce.length||ae[0]!==i.COLOR_ATTACHMENT0){for(let ce=0,Ge=Ce.length;ce<Ge;ce++)ae[ce]=i.COLOR_ATTACHMENT0+ce;ae.length=Ce.length,Me=!0}}else ae[0]!==i.BACK&&(ae[0]=i.BACK,Me=!0);Me&&i.drawBuffers(ae)}function De(G){return b!==G?(i.useProgram(G),b=G,!0):!1}let Re={[Zi]:i.FUNC_ADD,[jh]:i.FUNC_SUBTRACT,[eu]:i.FUNC_REVERSE_SUBTRACT};Re[tu]=i.MIN,Re[nu]=i.MAX;let N={[iu]:i.ZERO,[su]:i.ONE,[ru]:i.SRC_COLOR,[uc]:i.SRC_ALPHA,[uu]:i.SRC_ALPHA_SATURATE,[cu]:i.DST_COLOR,[ou]:i.DST_ALPHA,[au]:i.ONE_MINUS_SRC_COLOR,[dc]:i.ONE_MINUS_SRC_ALPHA,[hu]:i.ONE_MINUS_DST_COLOR,[lu]:i.ONE_MINUS_DST_ALPHA,[du]:i.CONSTANT_COLOR,[fu]:i.ONE_MINUS_CONSTANT_COLOR,[pu]:i.CONSTANT_ALPHA,[mu]:i.ONE_MINUS_CONSTANT_ALPHA};function H(G,ye,ae,Me,Ce,ce,Ge,Fe,Et,vt){if(G===Yn){p===!0&&(de(i.BLEND),p=!1);return}if(p===!1&&(ie(i.BLEND),p=!0),G!==Qh){if(G!==u||vt!==A){if((y!==Zi||E!==Zi)&&(i.blendEquation(i.FUNC_ADD),y=Zi,E=Zi),vt)switch(G){case Ri:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case lc:i.blendFunc(i.ONE,i.ONE);break;case cc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case hc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Je("WebGLState: Invalid blending: ",G);break}else switch(G){case Ri:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case lc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case cc:Je("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case hc:Je("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Je("WebGLState: Invalid blending: ",G);break}v=null,_=null,S=null,T=null,x.set(0,0,0),M=0,u=G,A=vt}return}Ce=Ce||ye,ce=ce||ae,Ge=Ge||Me,(ye!==y||Ce!==E)&&(i.blendEquationSeparate(Re[ye],Re[Ce]),y=ye,E=Ce),(ae!==v||Me!==_||ce!==S||Ge!==T)&&(i.blendFuncSeparate(N[ae],N[Me],N[ce],N[Ge]),v=ae,_=Me,S=ce,T=Ge),(Fe.equals(x)===!1||Et!==M)&&(i.blendColor(Fe.r,Fe.g,Fe.b,Et),x.copy(Fe),M=Et),u=G,A=!1}function k(G,ye){G.side===sn?de(i.CULL_FACE):ie(i.CULL_FACE);let ae=G.side===Kt;ye&&(ae=!ae),Y(ae),G.blending===Ri&&G.transparent===!1?H(Yn):H(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),a.setFunc(G.depthFunc),a.setTest(G.depthTest),a.setMask(G.depthWrite),r.setMask(G.colorWrite);let Me=G.stencilWrite;o.setTest(Me),Me&&(o.setMask(G.stencilWriteMask),o.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),o.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),Ae(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?ie(i.SAMPLE_ALPHA_TO_COVERAGE):de(i.SAMPLE_ALPHA_TO_COVERAGE)}function Y(G){I!==G&&(G?i.frontFace(i.CW):i.frontFace(i.CCW),I=G)}function se(G){G!==$h?(ie(i.CULL_FACE),G!==R&&(G===oc?i.cullFace(i.BACK):G===Kh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):de(i.CULL_FACE),R=G}function me(G){G!==L&&(z&&i.lineWidth(G),L=G)}function Ae(G,ye,ae){G?(ie(i.POLYGON_OFFSET_FILL),(P!==ye||F!==ae)&&(P=ye,F=ae,a.getReversed()&&(ye=-ye),i.polygonOffset(ye,ae))):de(i.POLYGON_OFFSET_FILL)}function Le(G){G?ie(i.SCISSOR_TEST):de(i.SCISSOR_TEST)}function Be(G){G===void 0&&(G=i.TEXTURE0+U-1),Z!==G&&(i.activeTexture(G),Z=G)}function O(G,ye,ae){ae===void 0&&(Z===null?ae=i.TEXTURE0+U-1:ae=Z);let Me=j[ae];Me===void 0&&(Me={type:void 0,texture:void 0},j[ae]=Me),(Me.type!==G||Me.texture!==ye)&&(Z!==ae&&(i.activeTexture(ae),Z=ae),i.bindTexture(G,ye||ee[G]),Me.type=G,Me.texture=ye)}function et(){let G=j[Z];G!==void 0&&G.type!==void 0&&(i.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function Qe(){try{i.compressedTexImage2D(...arguments)}catch(G){Je("WebGLState:",G)}}function D(){try{i.compressedTexImage3D(...arguments)}catch(G){Je("WebGLState:",G)}}function w(){try{i.texSubImage2D(...arguments)}catch(G){Je("WebGLState:",G)}}function X(){try{i.texSubImage3D(...arguments)}catch(G){Je("WebGLState:",G)}}function K(){try{i.compressedTexSubImage2D(...arguments)}catch(G){Je("WebGLState:",G)}}function te(){try{i.compressedTexSubImage3D(...arguments)}catch(G){Je("WebGLState:",G)}}function ue(){try{i.texStorage2D(...arguments)}catch(G){Je("WebGLState:",G)}}function ge(){try{i.texStorage3D(...arguments)}catch(G){Je("WebGLState:",G)}}function ne(){try{i.texImage2D(...arguments)}catch(G){Je("WebGLState:",G)}}function oe(){try{i.texImage3D(...arguments)}catch(G){Je("WebGLState:",G)}}function _e(G){return f[G]!==void 0?f[G]:i.getParameter(G)}function ke(G,ye){f[G]!==ye&&(i.pixelStorei(G,ye),f[G]=ye)}function be(G){Xe.equals(G)===!1&&(i.scissor(G.x,G.y,G.z,G.w),Xe.copy(G))}function ve(G){qe.equals(G)===!1&&(i.viewport(G.x,G.y,G.z,G.w),qe.copy(G))}function Ve(G,ye){let ae=c.get(ye);ae===void 0&&(ae=new WeakMap,c.set(ye,ae));let Me=ae.get(G);Me===void 0&&(Me=i.getUniformBlockIndex(ye,G.name),ae.set(G,Me))}function Ye(G,ye){let Me=c.get(ye).get(G);l.get(ye)!==Me&&(i.uniformBlockBinding(ye,Me,G.__bindingPointIndex),l.set(ye,Me))}function rt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),d={},f={},Z=null,j={},h={},m=new WeakMap,g=[],b=null,p=!1,u=null,y=null,v=null,_=null,E=null,S=null,T=null,x=new Te(0,0,0),M=0,A=!1,I=null,R=null,L=null,P=null,F=null,Xe.set(0,0,i.canvas.width,i.canvas.height),qe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ie,disable:de,bindFramebuffer:ze,drawBuffers:fe,useProgram:De,setBlending:H,setMaterial:k,setFlipSided:Y,setCullFace:se,setLineWidth:me,setPolygonOffset:Ae,setScissorTest:Le,activeTexture:Be,bindTexture:O,unbindTexture:et,compressedTexImage2D:Qe,compressedTexImage3D:D,texImage2D:ne,texImage3D:oe,pixelStorei:ke,getParameter:_e,updateUBOMapping:Ve,uniformBlockBinding:Ye,texStorage2D:ue,texStorage3D:ge,texSubImage2D:w,texSubImage3D:X,compressedTexSubImage2D:K,compressedTexSubImage3D:te,scissor:be,viewport:ve,reset:rt}}function t_(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new pe,d=new WeakMap,f=new Set,h,m=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(D,w){return g?new OffscreenCanvas(D,w):hr("canvas")}function p(D,w,X){let K=1,te=Qe(D);if((te.width>X||te.height>X)&&(K=X/Math.max(te.width,te.height)),K<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){let ue=Math.floor(K*te.width),ge=Math.floor(K*te.height);h===void 0&&(h=b(ue,ge));let ne=w?b(ue,ge):h;return ne.width=ue,ne.height=ge,ne.getContext("2d").drawImage(D,0,0,ue,ge),$e("WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+ue+"x"+ge+")."),ne}else return"data"in D&&$e("WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),D;return D}function u(D){return D.generateMipmaps}function y(D){i.generateMipmap(D)}function v(D){return D.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?i.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function _(D,w,X,K,te,ue=!1){if(D!==null){if(i[D]!==void 0)return i[D];$e("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let ge;K&&(ge=e.get("EXT_texture_norm16"),ge||$e("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ne=w;if(w===i.RED&&(X===i.FLOAT&&(ne=i.R32F),X===i.HALF_FLOAT&&(ne=i.R16F),X===i.UNSIGNED_BYTE&&(ne=i.R8),X===i.UNSIGNED_SHORT&&ge&&(ne=ge.R16_EXT),X===i.SHORT&&ge&&(ne=ge.R16_SNORM_EXT)),w===i.RED_INTEGER&&(X===i.UNSIGNED_BYTE&&(ne=i.R8UI),X===i.UNSIGNED_SHORT&&(ne=i.R16UI),X===i.UNSIGNED_INT&&(ne=i.R32UI),X===i.BYTE&&(ne=i.R8I),X===i.SHORT&&(ne=i.R16I),X===i.INT&&(ne=i.R32I)),w===i.RG&&(X===i.FLOAT&&(ne=i.RG32F),X===i.HALF_FLOAT&&(ne=i.RG16F),X===i.UNSIGNED_BYTE&&(ne=i.RG8),X===i.UNSIGNED_SHORT&&ge&&(ne=ge.RG16_EXT),X===i.SHORT&&ge&&(ne=ge.RG16_SNORM_EXT)),w===i.RG_INTEGER&&(X===i.UNSIGNED_BYTE&&(ne=i.RG8UI),X===i.UNSIGNED_SHORT&&(ne=i.RG16UI),X===i.UNSIGNED_INT&&(ne=i.RG32UI),X===i.BYTE&&(ne=i.RG8I),X===i.SHORT&&(ne=i.RG16I),X===i.INT&&(ne=i.RG32I)),w===i.RGB_INTEGER&&(X===i.UNSIGNED_BYTE&&(ne=i.RGB8UI),X===i.UNSIGNED_SHORT&&(ne=i.RGB16UI),X===i.UNSIGNED_INT&&(ne=i.RGB32UI),X===i.BYTE&&(ne=i.RGB8I),X===i.SHORT&&(ne=i.RGB16I),X===i.INT&&(ne=i.RGB32I)),w===i.RGBA_INTEGER&&(X===i.UNSIGNED_BYTE&&(ne=i.RGBA8UI),X===i.UNSIGNED_SHORT&&(ne=i.RGBA16UI),X===i.UNSIGNED_INT&&(ne=i.RGBA32UI),X===i.BYTE&&(ne=i.RGBA8I),X===i.SHORT&&(ne=i.RGBA16I),X===i.INT&&(ne=i.RGBA32I)),w===i.RGB&&(X===i.UNSIGNED_SHORT&&ge&&(ne=ge.RGB16_EXT),X===i.SHORT&&ge&&(ne=ge.RGB16_SNORM_EXT),X===i.UNSIGNED_INT_5_9_9_9_REV&&(ne=i.RGB9_E5),X===i.UNSIGNED_INT_10F_11F_11F_REV&&(ne=i.R11F_G11F_B10F)),w===i.RGBA){let oe=ue?cr:dt.getTransfer(te);X===i.FLOAT&&(ne=i.RGBA32F),X===i.HALF_FLOAT&&(ne=i.RGBA16F),X===i.UNSIGNED_BYTE&&(ne=oe===Mt?i.SRGB8_ALPHA8:i.RGBA8),X===i.UNSIGNED_SHORT&&ge&&(ne=ge.RGBA16_EXT),X===i.SHORT&&ge&&(ne=ge.RGBA16_SNORM_EXT),X===i.UNSIGNED_SHORT_4_4_4_4&&(ne=i.RGBA4),X===i.UNSIGNED_SHORT_5_5_5_1&&(ne=i.RGB5_A1)}return(ne===i.R16F||ne===i.R32F||ne===i.RG16F||ne===i.RG32F||ne===i.RGBA16F||ne===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ne}function E(D,w){let X;return D?w===null||w===Bn||w===zs?X=i.DEPTH24_STENCIL8:w===Tn?X=i.DEPTH32F_STENCIL8:w===Bs&&(X=i.DEPTH24_STENCIL8,$e("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Bn||w===zs?X=i.DEPTH_COMPONENT24:w===Tn?X=i.DEPTH_COMPONENT32F:w===Bs&&(X=i.DEPTH_COMPONENT16),X}function S(D,w){return u(D)===!0||D.isFramebufferTexture&&D.minFilter!==Zt&&D.minFilter!==kt?Math.log2(Math.max(w.width,w.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?w.mipmaps.length:1}function T(D){let w=D.target;w.removeEventListener("dispose",T),M(w),w.isVideoTexture&&d.delete(w),w.isHTMLTexture&&f.delete(w)}function x(D){let w=D.target;w.removeEventListener("dispose",x),I(w)}function M(D){let w=n.get(D);if(w.__webglInit===void 0)return;let X=D.source,K=m.get(X);if(K){let te=K[w.__cacheKey];te.usedTimes--,te.usedTimes===0&&A(D),Object.keys(K).length===0&&m.delete(X)}n.remove(D)}function A(D){let w=n.get(D);i.deleteTexture(w.__webglTexture);let X=D.source,K=m.get(X);delete K[w.__cacheKey],a.memory.textures--}function I(D){let w=n.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),n.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(w.__webglFramebuffer[K]))for(let te=0;te<w.__webglFramebuffer[K].length;te++)i.deleteFramebuffer(w.__webglFramebuffer[K][te]);else i.deleteFramebuffer(w.__webglFramebuffer[K]);w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer[K])}else{if(Array.isArray(w.__webglFramebuffer))for(let K=0;K<w.__webglFramebuffer.length;K++)i.deleteFramebuffer(w.__webglFramebuffer[K]);else i.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&i.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let K=0;K<w.__webglColorRenderbuffer.length;K++)w.__webglColorRenderbuffer[K]&&i.deleteRenderbuffer(w.__webglColorRenderbuffer[K]);w.__webglDepthRenderbuffer&&i.deleteRenderbuffer(w.__webglDepthRenderbuffer)}let X=D.textures;for(let K=0,te=X.length;K<te;K++){let ue=n.get(X[K]);ue.__webglTexture&&(i.deleteTexture(ue.__webglTexture),a.memory.textures--),n.remove(X[K])}n.remove(D)}let R=0;function L(){R=0}function P(){return R}function F(D){R=D}function U(){let D=R;return D>=s.maxTextures&&$e("WebGLTextures: Trying to use "+(D+1)+" texture units while this GPU supports only "+s.maxTextures),R+=1,D}function z(D){let w=[];return w.push(D.wrapS),w.push(D.wrapT),w.push(D.wrapR||0),w.push(D.magFilter),w.push(D.minFilter),w.push(D.anisotropy),w.push(D.internalFormat),w.push(D.format),w.push(D.type),w.push(D.generateMipmaps),w.push(D.premultiplyAlpha),w.push(D.flipY),w.push(D.unpackAlignment),w.push(D.colorSpace),w.join()}function q(D,w){let X=n.get(D);if(D.isVideoTexture&&O(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&X.__version!==D.version){let K=D.image;if(K===null)$e("WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)$e("WebGLRenderer: Texture marked for update but image is incomplete");else{de(X,D,w);return}}else D.isExternalTexture&&(X.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,X.__webglTexture,i.TEXTURE0+w)}function W(D,w){let X=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&X.__version!==D.version){de(X,D,w);return}else D.isExternalTexture&&(X.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,X.__webglTexture,i.TEXTURE0+w)}function Z(D,w){let X=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&X.__version!==D.version){de(X,D,w);return}t.bindTexture(i.TEXTURE_3D,X.__webglTexture,i.TEXTURE0+w)}function j(D,w){let X=n.get(D);if(D.isCubeDepthTexture!==!0&&D.version>0&&X.__version!==D.version){ze(X,D,w);return}t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture,i.TEXTURE0+w)}let xe={[Si]:i.REPEAT,[Hn]:i.CLAMP_TO_EDGE,[Ua]:i.MIRRORED_REPEAT},he={[Zt]:i.NEAREST,[_u]:i.NEAREST_MIPMAP_NEAREST,[Br]:i.NEAREST_MIPMAP_LINEAR,[kt]:i.LINEAR,[po]:i.LINEAR_MIPMAP_NEAREST,[En]:i.LINEAR_MIPMAP_LINEAR},Xe={[bu]:i.NEVER,[Au]:i.ALWAYS,[Su]:i.LESS,[jo]:i.LEQUAL,[wu]:i.EQUAL,[el]:i.GEQUAL,[Eu]:i.GREATER,[Tu]:i.NOTEQUAL};function qe(D,w){if(w.type===Tn&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===kt||w.magFilter===po||w.magFilter===Br||w.magFilter===En||w.minFilter===kt||w.minFilter===po||w.minFilter===Br||w.minFilter===En)&&$e("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(D,i.TEXTURE_WRAP_S,xe[w.wrapS]),i.texParameteri(D,i.TEXTURE_WRAP_T,xe[w.wrapT]),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,xe[w.wrapR]),i.texParameteri(D,i.TEXTURE_MAG_FILTER,he[w.magFilter]),i.texParameteri(D,i.TEXTURE_MIN_FILTER,he[w.minFilter]),w.compareFunction&&(i.texParameteri(D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(D,i.TEXTURE_COMPARE_FUNC,Xe[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Zt||w.minFilter!==Br&&w.minFilter!==En||w.type===Tn&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){let X=e.get("EXT_texture_filter_anisotropic");i.texParameterf(D,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function nt(D,w){let X=!1;D.__webglInit===void 0&&(D.__webglInit=!0,w.addEventListener("dispose",T));let K=w.source,te=m.get(K);te===void 0&&(te={},m.set(K,te));let ue=z(w);if(ue!==D.__cacheKey){te[ue]===void 0&&(te[ue]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,X=!0),te[ue].usedTimes++;let ge=te[D.__cacheKey];ge!==void 0&&(te[D.__cacheKey].usedTimes--,ge.usedTimes===0&&A(w)),D.__cacheKey=ue,D.__webglTexture=te[ue].texture}return X}function ee(D,w,X){return Math.floor(Math.floor(D/X)/w)}function ie(D,w,X,K){let ue=D.updateRanges;if(ue.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,w.width,w.height,X,K,w.data);else{ue.sort((ke,be)=>ke.start-be.start);let ge=0;for(let ke=1;ke<ue.length;ke++){let be=ue[ge],ve=ue[ke],Ve=be.start+be.count,Ye=ee(ve.start,w.width,4),rt=ee(be.start,w.width,4);ve.start<=Ve+1&&Ye===rt&&ee(ve.start+ve.count-1,w.width,4)===Ye?be.count=Math.max(be.count,ve.start+ve.count-be.start):(++ge,ue[ge]=ve)}ue.length=ge+1;let ne=t.getParameter(i.UNPACK_ROW_LENGTH),oe=t.getParameter(i.UNPACK_SKIP_PIXELS),_e=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,w.width);for(let ke=0,be=ue.length;ke<be;ke++){let ve=ue[ke],Ve=Math.floor(ve.start/4),Ye=Math.ceil(ve.count/4),rt=Ve%w.width,G=Math.floor(Ve/w.width),ye=Ye,ae=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,rt),t.pixelStorei(i.UNPACK_SKIP_ROWS,G),t.texSubImage2D(i.TEXTURE_2D,0,rt,G,ye,ae,X,K,w.data)}D.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,ne),t.pixelStorei(i.UNPACK_SKIP_PIXELS,oe),t.pixelStorei(i.UNPACK_SKIP_ROWS,_e)}}function de(D,w,X){let K=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(K=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&(K=i.TEXTURE_3D);let te=nt(D,w),ue=w.source;t.bindTexture(K,D.__webglTexture,i.TEXTURE0+X);let ge=n.get(ue);if(ue.version!==ge.__version||te===!0){if(t.activeTexture(i.TEXTURE0+X),(typeof ImageBitmap<"u"&&w.image instanceof ImageBitmap)===!1){let ae=dt.getPrimaries(dt.workingColorSpace),Me=w.colorSpace===li?null:dt.getPrimaries(w.colorSpace),Ce=w.colorSpace===li||ae===Me?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce)}t.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment);let oe=p(w.image,!1,s.maxTextureSize);oe=et(w,oe);let _e=r.convert(w.format,w.colorSpace),ke=r.convert(w.type),be=_(w.internalFormat,_e,ke,w.normalized,w.colorSpace,w.isVideoTexture);qe(K,w);let ve,Ve=w.mipmaps,Ye=w.isVideoTexture!==!0,rt=ge.__version===void 0||te===!0,G=ue.dataReady,ye=S(w,oe);if(w.isDepthTexture)be=E(w.format===Pi,w.type),rt&&(Ye?t.texStorage2D(i.TEXTURE_2D,1,be,oe.width,oe.height):t.texImage2D(i.TEXTURE_2D,0,be,oe.width,oe.height,0,_e,ke,null));else if(w.isDataTexture)if(Ve.length>0){Ye&&rt&&t.texStorage2D(i.TEXTURE_2D,ye,be,Ve[0].width,Ve[0].height);for(let ae=0,Me=Ve.length;ae<Me;ae++)ve=Ve[ae],Ye?G&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,ve.width,ve.height,_e,ke,ve.data):t.texImage2D(i.TEXTURE_2D,ae,be,ve.width,ve.height,0,_e,ke,ve.data);w.generateMipmaps=!1}else Ye?(rt&&t.texStorage2D(i.TEXTURE_2D,ye,be,oe.width,oe.height),G&&ie(w,oe,_e,ke)):t.texImage2D(i.TEXTURE_2D,0,be,oe.width,oe.height,0,_e,ke,oe.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){Ye&&rt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ye,be,Ve[0].width,Ve[0].height,oe.depth);for(let ae=0,Me=Ve.length;ae<Me;ae++)if(ve=Ve[ae],w.format!==An)if(_e!==null)if(Ye){if(G)if(w.layerUpdates.size>0){let Ce=Dc(ve.width,ve.height,w.format,w.type);for(let ce of w.layerUpdates){let Ge=ve.data.subarray(ce*Ce/ve.data.BYTES_PER_ELEMENT,(ce+1)*Ce/ve.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,ce,ve.width,ve.height,1,_e,Ge)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,0,ve.width,ve.height,oe.depth,_e,ve.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ae,be,ve.width,ve.height,oe.depth,0,ve.data,0,0);else $e("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ye?G&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,0,ve.width,ve.height,oe.depth,_e,ke,ve.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ae,be,ve.width,ve.height,oe.depth,0,_e,ke,ve.data);w.layerUpdates.size>0&&w.clearLayerUpdates()}else{Ye&&rt&&t.texStorage2D(i.TEXTURE_2D,ye,be,Ve[0].width,Ve[0].height);for(let ae=0,Me=Ve.length;ae<Me;ae++)ve=Ve[ae],w.format!==An?_e!==null?Ye?G&&t.compressedTexSubImage2D(i.TEXTURE_2D,ae,0,0,ve.width,ve.height,_e,ve.data):t.compressedTexImage2D(i.TEXTURE_2D,ae,be,ve.width,ve.height,0,ve.data):$e("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ye?G&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,ve.width,ve.height,_e,ke,ve.data):t.texImage2D(i.TEXTURE_2D,ae,be,ve.width,ve.height,0,_e,ke,ve.data)}else if(w.isDataArrayTexture)if(Ye){if(rt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ye,be,oe.width,oe.height,oe.depth),G)if(w.layerUpdates.size>0){let ae=Dc(oe.width,oe.height,w.format,w.type);for(let Me of w.layerUpdates){let Ce=oe.data.subarray(Me*ae/oe.data.BYTES_PER_ELEMENT,(Me+1)*ae/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Me,oe.width,oe.height,1,_e,ke,Ce)}w.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,_e,ke,oe.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,be,oe.width,oe.height,oe.depth,0,_e,ke,oe.data);else if(w.isData3DTexture)Ye?(rt&&t.texStorage3D(i.TEXTURE_3D,ye,be,oe.width,oe.height,oe.depth),G&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,_e,ke,oe.data)):t.texImage3D(i.TEXTURE_3D,0,be,oe.width,oe.height,oe.depth,0,_e,ke,oe.data);else if(w.isFramebufferTexture){if(rt)if(Ye)t.texStorage2D(i.TEXTURE_2D,ye,be,oe.width,oe.height);else{let ae=oe.width,Me=oe.height;for(let Ce=0;Ce<ye;Ce++)t.texImage2D(i.TEXTURE_2D,Ce,be,ae,Me,0,_e,ke,null),ae>>=1,Me>>=1}}else if(w.isHTMLTexture){if("texElementImage2D"in i){let ae=i.canvas;if(ae.hasAttribute("layoutsubtree")||ae.setAttribute("layoutsubtree","true"),oe.parentNode!==ae){ae.appendChild(oe),f.add(w),ae.onpaint=Me=>{let Ce=Me.changedElements;for(let ce of f)Ce.includes(ce.image)&&(ce.needsUpdate=!0)},ae.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,oe);else{let Ce=i.RGBA,ce=i.RGBA,Ge=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Ce,ce,Ge,oe)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Ve.length>0){if(Ye&&rt){let ae=Qe(Ve[0]);t.texStorage2D(i.TEXTURE_2D,ye,be,ae.width,ae.height)}for(let ae=0,Me=Ve.length;ae<Me;ae++)ve=Ve[ae],Ye?G&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,_e,ke,ve):t.texImage2D(i.TEXTURE_2D,ae,be,_e,ke,ve);w.generateMipmaps=!1}else if(Ye){if(rt){let ae=Qe(oe);t.texStorage2D(i.TEXTURE_2D,ye,be,ae.width,ae.height)}G&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,_e,ke,oe)}else t.texImage2D(i.TEXTURE_2D,0,be,_e,ke,oe);u(w)&&y(K),ge.__version=ue.version,w.onUpdate&&w.onUpdate(w)}D.__version=w.version}function ze(D,w,X){if(w.image.length!==6)return;let K=nt(D,w),te=w.source;t.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+X);let ue=n.get(te);if(te.version!==ue.__version||K===!0){t.activeTexture(i.TEXTURE0+X);let ge=dt.getPrimaries(dt.workingColorSpace),ne=w.colorSpace===li?null:dt.getPrimaries(w.colorSpace),oe=w.colorSpace===li||ge===ne?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,oe);let _e=w.isCompressedTexture||w.image[0].isCompressedTexture,ke=w.image[0]&&w.image[0].isDataTexture,be=[];for(let ce=0;ce<6;ce++)!_e&&!ke?be[ce]=p(w.image[ce],!0,s.maxCubemapSize):be[ce]=ke?w.image[ce].image:w.image[ce],be[ce]=et(w,be[ce]);let ve=be[0],Ve=r.convert(w.format,w.colorSpace),Ye=r.convert(w.type),rt=_(w.internalFormat,Ve,Ye,w.normalized,w.colorSpace),G=w.isVideoTexture!==!0,ye=ue.__version===void 0||K===!0,ae=te.dataReady,Me=S(w,ve);qe(i.TEXTURE_CUBE_MAP,w);let Ce;if(_e){G&&ye&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Me,rt,ve.width,ve.height);for(let ce=0;ce<6;ce++){Ce=be[ce].mipmaps;for(let Ge=0;Ge<Ce.length;Ge++){let Fe=Ce[Ge];w.format!==An?Ve!==null?G?ae&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Ge,0,0,Fe.width,Fe.height,Ve,Fe.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Ge,rt,Fe.width,Fe.height,0,Fe.data):$e("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):G?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Ge,0,0,Fe.width,Fe.height,Ve,Ye,Fe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Ge,rt,Fe.width,Fe.height,0,Ve,Ye,Fe.data)}}}else{if(Ce=w.mipmaps,G&&ye){Ce.length>0&&Me++;let ce=Qe(be[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Me,rt,ce.width,ce.height)}for(let ce=0;ce<6;ce++)if(ke){G?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,0,0,be[ce].width,be[ce].height,Ve,Ye,be[ce].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,rt,be[ce].width,be[ce].height,0,Ve,Ye,be[ce].data);for(let Ge=0;Ge<Ce.length;Ge++){let Et=Ce[Ge].image[ce].image;G?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Ge+1,0,0,Et.width,Et.height,Ve,Ye,Et.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Ge+1,rt,Et.width,Et.height,0,Ve,Ye,Et.data)}}else{G?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,0,0,Ve,Ye,be[ce]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,rt,Ve,Ye,be[ce]);for(let Ge=0;Ge<Ce.length;Ge++){let Fe=Ce[Ge];G?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Ge+1,0,0,Ve,Ye,Fe.image[ce]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Ge+1,rt,Ve,Ye,Fe.image[ce])}}}u(w)&&y(i.TEXTURE_CUBE_MAP),ue.__version=te.version,w.onUpdate&&w.onUpdate(w)}D.__version=w.version}function fe(D,w,X,K,te,ue){let ge=r.convert(X.format,X.colorSpace),ne=r.convert(X.type),oe=_(X.internalFormat,ge,ne,X.normalized,X.colorSpace),_e=n.get(w),ke=n.get(X);if(ke.__renderTarget=w,!_e.__hasExternalTextures){let be=Math.max(1,w.width>>ue),ve=Math.max(1,w.height>>ue);te===i.TEXTURE_3D||te===i.TEXTURE_2D_ARRAY?t.texImage3D(te,ue,oe,be,ve,w.depth,0,ge,ne,null):t.texImage2D(te,ue,oe,be,ve,0,ge,ne,null)}t.bindFramebuffer(i.FRAMEBUFFER,D),Be(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,te,ke.__webglTexture,0,Le(w)):(te===i.TEXTURE_2D||te>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,K,te,ke.__webglTexture,ue),t.bindFramebuffer(i.FRAMEBUFFER,null)}function De(D,w,X){if(i.bindRenderbuffer(i.RENDERBUFFER,D),w.depthBuffer){let K=w.depthTexture,te=K&&K.isDepthTexture?K.type:null,ue=E(w.stencilBuffer,te),ge=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Be(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Le(w),ue,w.width,w.height):X?i.renderbufferStorageMultisample(i.RENDERBUFFER,Le(w),ue,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,ue,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ge,i.RENDERBUFFER,D)}else{let K=w.textures;for(let te=0;te<K.length;te++){let ue=K[te],ge=r.convert(ue.format,ue.colorSpace),ne=r.convert(ue.type),oe=_(ue.internalFormat,ge,ne,ue.normalized,ue.colorSpace);Be(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Le(w),oe,w.width,w.height):X?i.renderbufferStorageMultisample(i.RENDERBUFFER,Le(w),oe,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,oe,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Re(D,w,X){let K=w.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,D),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let te=n.get(w.depthTexture);if(te.__renderTarget=w,(!te.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),K){if(te.__webglInit===void 0&&(te.__webglInit=!0,w.depthTexture.addEventListener("dispose",T)),te.__webglTexture===void 0){te.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,te.__webglTexture),qe(i.TEXTURE_CUBE_MAP,w.depthTexture);let _e=r.convert(w.depthTexture.format),ke=r.convert(w.depthTexture.type),be;w.depthTexture.format===Wn?be=i.DEPTH_COMPONENT24:w.depthTexture.format===Pi&&(be=i.DEPTH24_STENCIL8);for(let ve=0;ve<6;ve++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,be,w.width,w.height,0,_e,ke,null)}}else q(w.depthTexture,0);let ue=te.__webglTexture,ge=Le(w),ne=K?i.TEXTURE_CUBE_MAP_POSITIVE_X+X:i.TEXTURE_2D,oe=w.depthTexture.format===Pi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(w.depthTexture.format===Wn)Be(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,oe,ne,ue,0,ge):i.framebufferTexture2D(i.FRAMEBUFFER,oe,ne,ue,0);else if(w.depthTexture.format===Pi)Be(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,oe,ne,ue,0,ge):i.framebufferTexture2D(i.FRAMEBUFFER,oe,ne,ue,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function N(D){let w=n.get(D),X=D.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==D.depthTexture){let K=D.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),K){let te=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,K.removeEventListener("dispose",te)};K.addEventListener("dispose",te),w.__depthDisposeCallback=te}w.__boundDepthTexture=K}if(D.depthTexture&&!w.__autoAllocateDepthBuffer)if(X)for(let K=0;K<6;K++)Re(w.__webglFramebuffer[K],D,K);else{let K=D.texture.mipmaps;K&&K.length>0?Re(w.__webglFramebuffer[0],D,0):Re(w.__webglFramebuffer,D,0)}else if(X){w.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[K]),w.__webglDepthbuffer[K]===void 0)w.__webglDepthbuffer[K]=i.createRenderbuffer(),De(w.__webglDepthbuffer[K],D,!1);else{let te=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=w.__webglDepthbuffer[K];i.bindRenderbuffer(i.RENDERBUFFER,ue),i.framebufferRenderbuffer(i.FRAMEBUFFER,te,i.RENDERBUFFER,ue)}}else{let K=D.texture.mipmaps;if(K&&K.length>0?t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=i.createRenderbuffer(),De(w.__webglDepthbuffer,D,!1);else{let te=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=w.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ue),i.framebufferRenderbuffer(i.FRAMEBUFFER,te,i.RENDERBUFFER,ue)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function H(D,w,X){let K=n.get(D);w!==void 0&&fe(K.__webglFramebuffer,D,D.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),X!==void 0&&N(D)}function k(D){let w=D.texture,X=n.get(D),K=n.get(w);D.addEventListener("dispose",x);let te=D.textures,ue=D.isWebGLCubeRenderTarget===!0,ge=te.length>1;if(ge||(K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture()),K.__version=w.version,a.memory.textures++),ue){X.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(w.mipmaps&&w.mipmaps.length>0){X.__webglFramebuffer[ne]=[];for(let oe=0;oe<w.mipmaps.length;oe++)X.__webglFramebuffer[ne][oe]=i.createFramebuffer()}else X.__webglFramebuffer[ne]=i.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){X.__webglFramebuffer=[];for(let ne=0;ne<w.mipmaps.length;ne++)X.__webglFramebuffer[ne]=i.createFramebuffer()}else X.__webglFramebuffer=i.createFramebuffer();if(ge)for(let ne=0,oe=te.length;ne<oe;ne++){let _e=n.get(te[ne]);_e.__webglTexture===void 0&&(_e.__webglTexture=i.createTexture(),a.memory.textures++)}if(D.samples>0&&Be(D)===!1){X.__webglMultisampledFramebuffer=i.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let ne=0;ne<te.length;ne++){let oe=te[ne];X.__webglColorRenderbuffer[ne]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,X.__webglColorRenderbuffer[ne]);let _e=r.convert(oe.format,oe.colorSpace),ke=r.convert(oe.type),be=_(oe.internalFormat,_e,ke,oe.normalized,oe.colorSpace,D.isXRRenderTarget===!0),ve=Le(D);i.renderbufferStorageMultisample(i.RENDERBUFFER,ve,be,D.width,D.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ne,i.RENDERBUFFER,X.__webglColorRenderbuffer[ne])}i.bindRenderbuffer(i.RENDERBUFFER,null),D.depthBuffer&&(X.__webglDepthRenderbuffer=i.createRenderbuffer(),De(X.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ue){t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),qe(i.TEXTURE_CUBE_MAP,w);for(let ne=0;ne<6;ne++)if(w.mipmaps&&w.mipmaps.length>0)for(let oe=0;oe<w.mipmaps.length;oe++)fe(X.__webglFramebuffer[ne][oe],D,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,oe);else fe(X.__webglFramebuffer[ne],D,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);u(w)&&y(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ge){for(let ne=0,oe=te.length;ne<oe;ne++){let _e=te[ne],ke=n.get(_e),be=i.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(be=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(be,ke.__webglTexture),qe(be,_e),fe(X.__webglFramebuffer,D,_e,i.COLOR_ATTACHMENT0+ne,be,0),u(_e)&&y(be)}t.unbindTexture()}else{let ne=i.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(ne=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ne,K.__webglTexture),qe(ne,w),w.mipmaps&&w.mipmaps.length>0)for(let oe=0;oe<w.mipmaps.length;oe++)fe(X.__webglFramebuffer[oe],D,w,i.COLOR_ATTACHMENT0,ne,oe);else fe(X.__webglFramebuffer,D,w,i.COLOR_ATTACHMENT0,ne,0);u(w)&&y(ne),t.unbindTexture()}D.depthBuffer&&N(D)}function Y(D){let w=D.textures;for(let X=0,K=w.length;X<K;X++){let te=w[X];if(u(te)){let ue=v(D),ge=n.get(te).__webglTexture;t.bindTexture(ue,ge),y(ue),t.unbindTexture()}}}let se=[],me=[];function Ae(D){if(D.samples>0){if(Be(D)===!1){let w=D.textures,X=D.width,K=D.height,te=i.COLOR_BUFFER_BIT,ue=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ge=n.get(D),ne=w.length>1;if(ne)for(let _e=0;_e<w.length;_e++)t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ge.__webglMultisampledFramebuffer);let oe=D.texture.mipmaps;oe&&oe.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ge.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ge.__webglFramebuffer);for(let _e=0;_e<w.length;_e++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(te|=i.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(te|=i.STENCIL_BUFFER_BIT)),ne){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ge.__webglColorRenderbuffer[_e]);let ke=n.get(w[_e]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ke,0)}i.blitFramebuffer(0,0,X,K,0,0,X,K,te,i.NEAREST),l===!0&&(se.length=0,me.length=0,se.push(i.COLOR_ATTACHMENT0+_e),D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&(se.push(ue),me.push(ue),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,me)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,se))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ne)for(let _e=0;_e<w.length;_e++){t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.RENDERBUFFER,ge.__webglColorRenderbuffer[_e]);let ke=n.get(w[_e]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.TEXTURE_2D,ke,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ge.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&l){let w=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[w])}}}function Le(D){return Math.min(s.maxSamples,D.samples)}function Be(D){let w=n.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function O(D){let w=a.render.frame;d.get(D)!==w&&(d.set(D,w),D.update())}function et(D,w){let X=D.colorSpace,K=D.format,te=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||X!==lr&&X!==li&&(dt.getTransfer(X)===Mt?(K!==An||te!==dn)&&$e("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Je("WebGLTextures: Unsupported texture color space:",X)),w}function Qe(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=L,this.getTextureUnits=P,this.setTextureUnits=F,this.setTexture2D=q,this.setTexture2DArray=W,this.setTexture3D=Z,this.setTextureCube=j,this.rebindTextures=H,this.setupRenderTarget=k,this.updateRenderTargetMipmap=Y,this.updateMultisampleRenderTarget=Ae,this.setupDepthRenderbuffer=N,this.setupFrameBufferTexture=fe,this.useMultisampledRTT=Be,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function n_(i,e){function t(n,s=li){let r,a=dt.getTransfer(s);if(n===dn)return i.UNSIGNED_BYTE;if(n===go)return i.UNSIGNED_SHORT_4_4_4_4;if(n===xo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Sc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===wc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Mc)return i.BYTE;if(n===bc)return i.SHORT;if(n===Bs)return i.UNSIGNED_SHORT;if(n===mo)return i.INT;if(n===Bn)return i.UNSIGNED_INT;if(n===Tn)return i.FLOAT;if(n===vn)return i.HALF_FLOAT;if(n===Ec)return i.ALPHA;if(n===Tc)return i.RGB;if(n===An)return i.RGBA;if(n===Wn)return i.DEPTH_COMPONENT;if(n===Pi)return i.DEPTH_STENCIL;if(n===_o)return i.RED;if(n===vo)return i.RED_INTEGER;if(n===Li)return i.RG;if(n===yo)return i.RG_INTEGER;if(n===Mo)return i.RGBA_INTEGER;if(n===zr||n===kr||n===Vr||n===Gr)if(a===Mt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===zr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===kr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===zr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===kr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Gr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===bo||n===So||n===wo||n===Eo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===bo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===So)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===wo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Eo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===To||n===Ao||n===Co||n===Ro||n===Io||n===Hr||n===Po)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===To||n===Ao)return a===Mt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Co)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Ro)return r.COMPRESSED_R11_EAC;if(n===Io)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Hr)return r.COMPRESSED_RG11_EAC;if(n===Po)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Lo||n===Do||n===No||n===Uo||n===Fo||n===Oo||n===Bo||n===zo||n===ko||n===Vo||n===Go||n===Ho||n===Wo||n===Xo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Lo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Do)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===No)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Uo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Fo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Oo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Bo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===zo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ko)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Vo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Go)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ho)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Wo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Xo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===qo||n===Yo||n===Zo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===qo)return a===Mt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Yo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Zo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Jo||n===$o||n===Wr||n===Ko)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Jo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===$o)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Wr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ko)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===zs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var i_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,s_=`
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

}`,Qc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new vr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Gt({vertexShader:i_,fragmentShader:s_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new We(new Fn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},jc=class extends Xn{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,d=null,f=null,h=null,m=null,g=null,b=typeof XRWebGLBinding<"u",p=new Qc,u={},y=t.getContextAttributes(),v=null,_=null,E=[],S=[],T=new pe,x=null,M=null,A=new $t;A.viewport=new It;let I=new $t;I.viewport=new It;let R=[A,I],L=new lo,P=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ee){let ie=E[ee];return ie===void 0&&(ie=new As,E[ee]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(ee){let ie=E[ee];return ie===void 0&&(ie=new As,E[ee]=ie),ie.getGripSpace()},this.getHand=function(ee){let ie=E[ee];return ie===void 0&&(ie=new As,E[ee]=ie),ie.getHandSpace()};function U(ee){let ie=S.indexOf(ee.inputSource);if(ie===-1)return;let de=E[ie];de!==void 0&&(de.update(ee.inputSource,ee.frame,c||a),de.dispatchEvent({type:ee.type,data:ee.inputSource}))}function z(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",q);for(let ee=0;ee<E.length;ee++){let ie=S[ee];ie!==null&&(S[ee]=null,E[ee].disconnect(ie))}P=null,F=null,p.reset();for(let ee in u)delete u[ee];if(e.setRenderTarget(v),m=null,h=null,f=null,s=null,_=null,nt.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(T.width,T.height,!1),M!==null){let ee=M.camera;ee.fov=M.fov,ee.zoom=M.zoom,ee.updateProjectionMatrix(),M=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ee){r=ee,n.isPresenting===!0&&$e("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ee){o=ee,n.isPresenting===!0&&$e("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(ee){c=ee},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return f===null&&b&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(ee){if(s=ee,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",z),s.addEventListener("inputsourceschange",q),y.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(T),b&&"createProjectionLayer"in XRWebGLBinding.prototype){let de=null,ze=null,fe=null;y.depth&&(fe=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,de=y.stencil?Pi:Wn,ze=y.stencil?zs:Bn);let De={colorFormat:t.RGBA8,depthFormat:fe,scaleFactor:r};f=this.getBinding(),h=f.createProjectionLayer(De),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),_=new un(h.textureWidth,h.textureHeight,{format:An,type:dn,depthTexture:new wi(h.textureWidth,h.textureHeight,ze,void 0,void 0,void 0,void 0,void 0,void 0,de),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let de={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,de),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),_=new un(m.framebufferWidth,m.framebufferHeight,{format:An,type:dn,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1,storeMultisampledDepthBuffer:m.ignoreDepthValues===!1,storeMultisampledStencilBuffer:m.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),nt.setContext(s),nt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function q(ee){for(let ie=0;ie<ee.removed.length;ie++){let de=ee.removed[ie],ze=S.indexOf(de);ze>=0&&(S[ze]=null,E[ze].disconnect(de))}for(let ie=0;ie<ee.added.length;ie++){let de=ee.added[ie],ze=S.indexOf(de);if(ze===-1){for(let De=0;De<E.length;De++)if(De>=S.length){S.push(de),ze=De;break}else if(S[De]===null){S[De]=de,ze=De;break}if(ze===-1)break}let fe=E[ze];fe&&fe.connect(de)}}let W=new B,Z=new B;function j(ee,ie,de){W.setFromMatrixPosition(ie.matrixWorld),Z.setFromMatrixPosition(de.matrixWorld);let ze=W.distanceTo(Z),fe=ie.projectionMatrix.elements,De=de.projectionMatrix.elements,Re=fe[14]/(fe[10]-1),N=fe[14]/(fe[10]+1),H=(fe[9]+1)/fe[5],k=(fe[9]-1)/fe[5],Y=(fe[8]-1)/fe[0],se=(De[8]+1)/De[0],me=Re*Y,Ae=Re*se,Le=ze/(-Y+se),Be=Le*-Y;if(ie.matrixWorld.decompose(ee.position,ee.quaternion,ee.scale),ee.translateX(Be),ee.translateZ(Le),ee.matrixWorld.compose(ee.position,ee.quaternion,ee.scale),ee.matrixWorldInverse.copy(ee.matrixWorld).invert(),fe[10]===-1)ee.projectionMatrix.copy(ie.projectionMatrix),ee.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{let O=Re+Le,et=N+Le,Qe=me-Be,D=Ae+(ze-Be),w=H*N/et*O,X=k*N/et*O;ee.projectionMatrix.makePerspective(Qe,D,w,X,O,et),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert()}}function xe(ee,ie){ie===null?ee.matrixWorld.copy(ee.matrix):ee.matrixWorld.multiplyMatrices(ie.matrixWorld,ee.matrix),ee.matrixWorldInverse.copy(ee.matrixWorld).invert()}this.updateCamera=function(ee){if(s===null)return;let ie=ee.near,de=ee.far;p.texture!==null&&(p.depthNear>0&&(ie=p.depthNear),p.depthFar>0&&(de=p.depthFar)),L.near=I.near=A.near=ie,L.far=I.far=A.far=de,(P!==L.near||F!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),P=L.near,F=L.far),L.layers.mask=ee.layers.mask|6,A.layers.mask=L.layers.mask&-5,I.layers.mask=L.layers.mask&-3;let ze=ee.parent,fe=L.cameras;xe(L,ze);for(let De=0;De<fe.length;De++)xe(fe[De],ze);fe.length===2?j(L,A,I):L.projectionMatrix.copy(A.projectionMatrix),M===null&&ee.isPerspectiveCamera&&(M={camera:ee,fov:ee.fov,zoom:ee.zoom}),he(ee,L,ze)};function he(ee,ie,de){de===null?ee.matrix.copy(ie.matrixWorld):(ee.matrix.copy(de.matrixWorld),ee.matrix.invert(),ee.matrix.multiply(ie.matrixWorld)),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.updateMatrixWorld(!0),ee.projectionMatrix.copy(ie.projectionMatrix),ee.projectionMatrixInverse.copy(ie.projectionMatrixInverse),ee.isPerspectiveCamera&&(ee.fov=Oa*2*Math.atan(1/ee.projectionMatrix.elements[5]),ee.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(h===null&&m===null))return l},this.setFoveation=function(ee){l=ee,h!==null&&(h.fixedFoveation=ee),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=ee)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(L)},this.getCameraTexture=function(ee){return u[ee]};let Xe=null;function qe(ee,ie){if(d=ie.getViewerPose(c||a),g=ie,d!==null){let de=d.views;m!==null&&(e.setRenderTargetFramebuffer(_,m.framebuffer),e.setRenderTarget(_));let ze=!1;de.length!==L.cameras.length&&(L.cameras.length=0,ze=!0);for(let N=0;N<de.length;N++){let H=de[N],k=null;if(m!==null)k=m.getViewport(H);else{let se=f.getViewSubImage(h,H);k=se.viewport,N===0&&(e.setRenderTargetTextures(_,se.colorTexture,se.depthStencilTexture),e.setRenderTarget(_))}let Y=R[N];Y===void 0&&(Y=new $t,Y.layers.enable(N),Y.viewport=new It,R[N]=Y),Y.matrix.fromArray(H.transform.matrix),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.projectionMatrix.fromArray(H.projectionMatrix),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert(),Y.viewport.set(k.x,k.y,k.width,k.height),N===0&&(L.matrix.copy(Y.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),ze===!0&&L.cameras.push(Y)}let fe=s.enabledFeatures;if(fe&&fe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&b){f=n.getBinding();let N=f.getDepthInformation(de[0]);N&&N.isValid&&N.texture&&p.init(N,s.renderState)}if(fe&&fe.includes("camera-access")&&b){e.state.unbindTexture(),f=n.getBinding();for(let N=0;N<de.length;N++){let H=de[N].camera;if(H){let k=u[H];k||(k=new vr,u[H]=k);let Y=f.getCameraImage(H);k.sourceTexture=Y}}}}for(let de=0;de<E.length;de++){let ze=S[de],fe=E[de];ze!==null&&fe!==void 0&&fe.update(ze,ie,c||a)}Xe&&Xe(ee,ie),ie.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ie}),g=null}let nt=new ld;nt.setAnimationLoop(qe),this.setAnimationLoop=function(ee){Xe=ee},this.dispose=function(){}}},r_=new gt,pd=new tt;pd.set(-1,0,0,0,1,0,0,0,1);function a_(i,e){function t(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,Ic(i)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function s(p,u,y,v,_){u.isNodeMaterial?u.uniformsNeedUpdate=!1:u.isMeshBasicMaterial?r(p,u):u.isMeshLambertMaterial?(r(p,u),u.envMap&&(p.envMapIntensity.value=u.envMapIntensity)):u.isMeshToonMaterial?(r(p,u),f(p,u)):u.isMeshPhongMaterial?(r(p,u),d(p,u),u.envMap&&(p.envMapIntensity.value=u.envMapIntensity)):u.isMeshStandardMaterial?(r(p,u),h(p,u),u.isMeshPhysicalMaterial&&m(p,u,_)):u.isMeshMatcapMaterial?(r(p,u),g(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),b(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(a(p,u),u.isLineDashedMaterial&&o(p,u)):u.isPointsMaterial?l(p,u,y,v):u.isSpriteMaterial?c(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,t(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,t(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===Kt&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,t(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===Kt&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,t(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,t(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);let y=e.get(u),v=y.envMap,_=y.envMapRotation;v&&(p.envMap.value=v,p.envMapRotation.value.setFromMatrix4(r_.makeRotationFromEuler(_)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(pd),p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap&&(p.lightMap.value=u.lightMap,p.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,p.lightMapTransform)),u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,p.aoMapTransform))}function a(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,t(u.map,p.mapTransform))}function o(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function l(p,u,y,v){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*y,p.scale.value=v*.5,u.map&&(p.map.value=u.map,t(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function c(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,t(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function d(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function f(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function h(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,p.roughnessMapTransform)),u.envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function m(p,u,y){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Kt&&p.clearcoatNormalScale.value.negate())),u.dispersion>0&&(p.dispersion.value=u.dispersion),u.retroreflectivity>0&&(p.retroreflectivity.value=u.retroreflectivity),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,u){u.matcap&&(p.matcap.value=u.matcap)}function b(p,u){let y=e.get(u).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function o_(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,E){let S=E.program;n.uniformBlockBinding(_,S)}function c(_,E){let S=s[_.id];S===void 0&&(p(_),S=d(_),s[_.id]=S,_.addEventListener("dispose",y));let T=E.program;n.updateUBOMapping(_,T);let x=e.render.frame;r[_.id]!==x&&(h(_),r[_.id]=x)}function d(_){let E=f();_.__bindingPointIndex=E;let S=i.createBuffer(),T=_.__size,x=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,T,x),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,S),S}function f(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return Je("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(_){let E=s[_.id],S=_.uniforms,T=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let x=0,M=S.length;x<M;x++){let A=S[x];if(Array.isArray(A))for(let I=0,R=A.length;I<R;I++)m(A[I],x,I,T);else m(A,x,0,T)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(_,E,S,T){if(b(_,E,S,T)===!0){let x=_.__offset,M=_.value;if(Array.isArray(M)){let A=0;for(let I=0;I<M.length;I++){let R=M[I],L=u(R);g(R,_.__data,A),typeof R!="number"&&typeof R!="boolean"&&!R.isMatrix3&&!ArrayBuffer.isView(R)&&(A+=L.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(M,_.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,x,_.__data)}}function g(_,E,S){typeof _=="number"||typeof _=="boolean"?E[0]=_:_.isMatrix3?(E[0]=_.elements[0],E[1]=_.elements[1],E[2]=_.elements[2],E[3]=0,E[4]=_.elements[3],E[5]=_.elements[4],E[6]=_.elements[5],E[7]=0,E[8]=_.elements[6],E[9]=_.elements[7],E[10]=_.elements[8],E[11]=0):ArrayBuffer.isView(_)?E.set(new _.constructor(_.buffer,_.byteOffset,E.length)):_.toArray(E,S)}function b(_,E,S,T){let x=_.value,M=E+"_"+S;if(T[M]===void 0)return typeof x=="number"||typeof x=="boolean"?T[M]=x:ArrayBuffer.isView(x)?T[M]=x.slice():T[M]=x.clone(),!0;{let A=T[M];if(typeof x=="number"||typeof x=="boolean"){if(A!==x)return T[M]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(A.equals(x)===!1)return A.copy(x),!0}}return!1}function p(_){let E=_.uniforms,S=0,T=16;for(let M=0,A=E.length;M<A;M++){let I=Array.isArray(E[M])?E[M]:[E[M]];for(let R=0,L=I.length;R<L;R++){let P=I[R],F=Array.isArray(P.value)?P.value:[P.value];for(let U=0,z=F.length;U<z;U++){let q=F[U],W=u(q),Z=S%T,j=Z%W.boundary,xe=Z+j;S+=j,xe!==0&&T-xe<W.storage&&(S+=T-xe),P.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=S,S+=W.storage}}}let x=S%T;return x>0&&(S+=T-x),_.__size=S,_.__cache={},this}function u(_){let E={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(E.boundary=4,E.storage=4):_.isVector2?(E.boundary=8,E.storage=8):_.isVector3||_.isColor?(E.boundary=16,E.storage=12):_.isVector4?(E.boundary=16,E.storage=16):_.isMatrix3?(E.boundary=48,E.storage=48):_.isMatrix4?(E.boundary=64,E.storage=64):_.isTexture?$e("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(_)?(E.boundary=16,E.storage=_.byteLength):$e("WebGLRenderer: Unsupported uniform value type.",_),E}function y(_){let E=_.target;E.removeEventListener("dispose",y);let S=a.indexOf(E.__bindingPointIndex);a.splice(S,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function v(){for(let _ in s)i.deleteBuffer(s[_]);a=[],s={},r={}}return{bind:l,update:c,dispose:v}}var l_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Zn=null;function c_(){return Zn===null&&(Zn=new mr(l_,16,16,Li,vn),Zn.name="DFG_LUT",Zn.minFilter=kt,Zn.magFilter=kt,Zn.wrapS=Hn,Zn.wrapT=Hn,Zn.generateMipmaps=!1,Zn.needsUpdate=!0),Zn}var il=class{constructor(e={}){let{canvas:t=Ru(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:m=dn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;let b=m,p=new Set([Mo,yo,vo]),u=new Set([dn,Bn,Bs,zs,go,xo]),y=new Uint32Array(4),v=new Int32Array(4),_=new B,E=null,S=null,T=[],x=[],M=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=On,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let A=this,I=!1,R=null,L=null,P=null,F=null;this._outputColorSpace=Jt;let U=0,z=0,q=null,W=-1,Z=null,j=new It,xe=new It,he=null,Xe=new Te(0),qe=0,nt=t.width,ee=t.height,ie=1,de=null,ze=null,fe=new It(0,0,nt,ee),De=new It(0,0,nt,ee),Re=!1,N=new Is,H=!1,k=!1,Y=new gt,se=new B,me=new It,Ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Le=!1;function Be(){return q===null?ie:1}let O=n;function et(C,V){return t.getContext(C,V)}let Qe,D,w,X,K,te,ue,ge,ne,oe,_e,ke,be,ve,Ve,Ye,rt,G,ye,ae,Me,Ce,ce;try{let C={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",Et,!1),t.addEventListener("webglcontextrestored",vt,!1),t.addEventListener("webglcontextcreationerror",Rn,!1),O===null){let V="webgl2";if(O=et(V,C),O===null)throw et(V)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ge()}catch(C){throw t.removeEventListener("webglcontextlost",Et,!1),t.removeEventListener("webglcontextrestored",vt,!1),t.removeEventListener("webglcontextcreationerror",Rn,!1),Je("WebGLRenderer: "+C.message),C}function Ge(){Qe=new gg(O),Qe.init(),Me=new n_(O,Qe),D=new ag(O,Qe,e,Me),w=new e_(O,Qe),D.reversedDepthBuffer&&h&&w.buffers.depth.setReversed(!0),L=O.createFramebuffer(),P=O.createFramebuffer(),F=O.createFramebuffer(),X=new vg(O),K=new kx,te=new t_(O,Qe,w,K,D,Me,X),ue=new mg(A),ge=new Mp(O),Ce=new sg(O,ge),ne=new xg(O,ge,X,Ce),oe=new Mg(O,ne,ge,Ce,X),G=new yg(O,D,te),Ve=new og(K),_e=new zx(A,ue,Qe,D,Ce,Ve),ke=new a_(A,K),be=new Gx,ve=new Zx(Qe),rt=new ig(A,ue,w,oe,g,l),Ye=new jx(A,oe,D),ce=new o_(O,X,D,w),ye=new rg(O,Qe,X),ae=new _g(O,Qe,X),X.programs=_e.programs,A.capabilities=D,A.extensions=Qe,A.properties=K,A.renderLists=be,A.shadowMap=Ye,A.state=w,A.info=X}b!==dn&&(M=new Sg(b,t.width,t.height,o,s,r));let Fe=new jc(A,O);this.xr=Fe,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){let C=Qe.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){let C=Qe.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(C){C!==void 0&&(ie=C,this.setSize(nt,ee,!1))},this.getSize=function(C){return C.set(nt,ee)},this.setSize=function(C,V,Q=!0){if(Fe.isPresenting){$e("WebGLRenderer: Can't change size while VR device is presenting.");return}nt=C,ee=V,t.width=Math.floor(C*ie),t.height=Math.floor(V*ie),Q===!0&&(t.style.width=C+"px",t.style.height=V+"px"),M!==null&&M.setSize(t.width,t.height),this.setViewport(0,0,C,V)},this.getDrawingBufferSize=function(C){return C.set(nt*ie,ee*ie).floor()},this.setDrawingBufferSize=function(C,V,Q){nt=C,ee=V,ie=Q,t.width=Math.floor(C*Q),t.height=Math.floor(V*Q),this.setViewport(0,0,C,V)},this.setEffects=function(C){if(b===dn){Je("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(C){for(let V=0;V<C.length;V++)if(C[V].isOutputPass===!0){$e("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}M.setEffects(C||[])},this.getCurrentViewport=function(C){return C.copy(j)},this.getViewport=function(C){return C.copy(fe)},this.setViewport=function(C,V,Q,J){C.isVector4?fe.set(C.x,C.y,C.z,C.w):fe.set(C,V,Q,J),w.viewport(j.copy(fe).multiplyScalar(ie).round())},this.getScissor=function(C){return C.copy(De)},this.setScissor=function(C,V,Q,J){C.isVector4?De.set(C.x,C.y,C.z,C.w):De.set(C,V,Q,J),w.scissor(xe.copy(De).multiplyScalar(ie).round())},this.getScissorTest=function(){return Re},this.setScissorTest=function(C){w.setScissorTest(Re=C)},this.setOpaqueSort=function(C){de=C},this.setTransparentSort=function(C){ze=C},this.getClearColor=function(C){return C.copy(rt.getClearColor())},this.setClearColor=function(){rt.setClearColor(...arguments)},this.getClearAlpha=function(){return rt.getClearAlpha()},this.setClearAlpha=function(){rt.setClearAlpha(...arguments)},this.clear=function(C=!0,V=!0,Q=!0){let J=0;if(C){let $=!1;if(q!==null){let Ee=q.texture.format;$=p.has(Ee)}if($){let Ee=q.texture.type,Pe=u.has(Ee),we=rt.getClearColor(),Ne=rt.getClearAlpha(),Oe=we.r,ot=we.g,ut=we.b;Pe?(y[0]=Oe,y[1]=ot,y[2]=ut,y[3]=Ne,O.clearBufferuiv(O.COLOR,0,y)):(v[0]=Oe,v[1]=ot,v[2]=ut,v[3]=Ne,O.clearBufferiv(O.COLOR,0,v))}else J|=O.COLOR_BUFFER_BIT}V&&(J|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Q&&(J|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),J!==0&&O.clear(J)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(C){C.setRenderer(this),R=C},this.dispose=function(){t.removeEventListener("webglcontextlost",Et,!1),t.removeEventListener("webglcontextrestored",vt,!1),t.removeEventListener("webglcontextcreationerror",Rn,!1),rt.dispose(),be.dispose(),ve.dispose(),K.dispose(),ue.dispose(),oe.dispose(),Ce.dispose(),ce.dispose(),_e.dispose(),Fe.dispose(),Fe.removeEventListener("sessionstart",lh),Fe.removeEventListener("sessionend",ch),Ui.stop()};function Et(C){C.preventDefault(),Cc("WebGLRenderer: Context Lost."),I=!0}function vt(){Cc("WebGLRenderer: Context Restored."),I=!1;let C=X.autoReset,V=Ye.enabled,Q=Ye.autoUpdate,J=Ye.needsUpdate,$=Ye.type;Ge(),X.autoReset=C,Ye.enabled=V,Ye.autoUpdate=Q,Ye.needsUpdate=J,Ye.type=$}function Rn(C){Je("WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function kn(C){let V=C.target;V.removeEventListener("dispose",kn),jd(V)}function jd(C){ef(C),K.remove(C)}function ef(C){let V=K.get(C).programs;V!==void 0&&(V.forEach(function(Q){_e.releaseProgram(Q)}),C.isShaderMaterial&&_e.releaseShaderCache(C))}this.renderBufferDirect=function(C,V,Q,J,$,Ee){V===null&&(V=Ae);let Pe=$.isMesh&&$.matrixWorld.determinantAffine()<0,we=sf(C,V,Q,J,$);w.setMaterial(J,Pe);let Ne=Q.index,Oe=1;if(J.wireframe===!0){if(Ne=ne.getWireframeAttribute(Q),Ne===void 0)return;Oe=2}let ot=Q.drawRange,ut=Q.attributes.position,Ue=ot.start*Oe,yt=(ot.start+ot.count)*Oe;Ee!==null&&(Ue=Math.max(Ue,Ee.start*Oe),yt=Math.min(yt,(Ee.start+Ee.count)*Oe)),Ne!==null?(Ue=Math.max(Ue,0),yt=Math.min(yt,Ne.count)):ut!=null&&(Ue=Math.max(Ue,0),yt=Math.min(yt,ut.count));let Bt=yt-Ue;if(Bt<0||Bt===1/0)return;Ce.setup($,J,we,Q,Ne);let Ct,wt=ye;if(Ne!==null&&(Ct=ge.get(Ne),wt=ae,wt.setIndex(Ct)),$.isMesh)J.wireframe===!0?(w.setLineWidth(J.wireframeLinewidth*Be()),wt.setMode(O.LINES)):wt.setMode(O.TRIANGLES);else if($.isLine){let en=J.linewidth;en===void 0&&(en=1),w.setLineWidth(en*Be()),$.isLineSegments?wt.setMode(O.LINES):$.isLineLoop?wt.setMode(O.LINE_LOOP):wt.setMode(O.LINE_STRIP)}else $.isPoints?wt.setMode(O.POINTS):$.isSprite&&wt.setMode(O.TRIANGLES);if($.isBatchedMesh)if(Qe.get("WEBGL_multi_draw"))wt.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{let en=$._multiDrawStarts,Ie=$._multiDrawCounts,ln=$._multiDrawCount,mt=Ne?ge.get(Ne).bytesPerElement:1,Mn=K.get(J).currentProgram.getUniforms();for(let Vn=0;Vn<ln;Vn++)Mn.setValue(O,"_gl_DrawID",Vn),wt.render(en[Vn]/mt,Ie[Vn])}else if($.isInstancedMesh)wt.renderInstances(Ue,Bt,$.count);else if(Q.isInstancedBufferGeometry){let en=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,Ie=Math.min(Q.instanceCount,en);wt.renderInstances(Ue,Bt,Ie)}else wt.render(Ue,Bt)};function oh(C,V,Q,J){R!==null&&C.isNodeMaterial&&R.setObject(J,C),H===!0&&Ve.setState(C,Q,!1),C.transparent===!0&&C.side===sn&&C.forceSinglePass===!1?(C.side=Kt,C.needsUpdate=!0,ta(C,V,J),C.side=Ci,C.needsUpdate=!0,ta(C,V,J),C.side=sn):ta(C,V,J)}this.compile=function(C,V,Q=null){Q===null&&(Q=C),R!==null&&R.renderStart(C,V,Q),S=ve.get(Q),S.init(V),x.push(S),Q.traverseVisible(function($){$.isLight&&$.layers.test(V.layers)&&(S.pushLight($),$.castShadow&&S.pushShadow($))}),C!==Q&&C.traverseVisible(function($){$.isLight&&$.layers.test(V.layers)&&(S.pushLight($),$.castShadow&&S.pushShadow($))}),S.setupLights(),R!==null&&R.updateLights(S.state.lightsArray),k=this.localClippingEnabled,H=Ve.init(this.clippingPlanes,k),H===!0&&Ve.setGlobalState(this.clippingPlanes,V),R!==null&&Ye.render(S.state.shadowsArray,Q,V);let J=new Set;return C.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;let Ee=$.material;if(Ee)if(Array.isArray(Ee))for(let Pe=0;Pe<Ee.length;Pe++){let we=Ee[Pe];oh(we,Q,V,$),J.add(we)}else oh(Ee,Q,V,$),J.add(Ee)}),S=x.pop(),R!==null&&R.renderEnd(),J},this.compileAsync=function(C,V,Q=null){let J=this.compile(C,V,Q);return new Promise($=>{function Ee(){if(J.forEach(function(Pe){let Ne=K.get(Pe).currentProgram;(Ne===void 0||Ne.isReady())&&J.delete(Pe)}),J.size===0){$(C);return}setTimeout(Ee,10)}Qe.get("KHR_parallel_shader_compile")!==null?Ee():setTimeout(Ee,10)})};let vl=null;function tf(C){vl&&vl(C)}function lh(){Ui.stop()}function ch(){Ui.start()}let Ui=new ld;Ui.setAnimationLoop(tf),typeof self<"u"&&Ui.setContext(self),this.setAnimationLoop=function(C){vl=C,Fe.setAnimationLoop(C),C===null?Ui.stop():Ui.start()},Fe.addEventListener("sessionstart",lh),Fe.addEventListener("sessionend",ch),this.render=function(C,V){if(V!==void 0&&V.isCamera!==!0){Je("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;R!==null&&R.renderStart(C,V);let Q=Fe.enabled===!0&&Fe.isPresenting===!0,J=M!==null&&(q===null||Q)&&M.begin(A,q);if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),Fe.enabled===!0&&Fe.isPresenting===!0&&(M===null||M.isCompositing()===!1)&&(Fe.cameraAutoUpdate===!0&&Fe.updateCamera(V),V=Fe.getCamera()),C.isScene===!0&&C.onBeforeRender(A,C,V,q),S=ve.get(C,x.length),S.init(V),S.state.textureUnits=te.getTextureUnits(),x.push(S),Y.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),N.setFromProjectionMatrix(Y,Nn,V.reversedDepth),k=this.localClippingEnabled,H=Ve.init(this.clippingPlanes,k),E=be.get(C,T.length),E.init(),T.push(E),Fe.enabled===!0&&Fe.isPresenting===!0){let Pe=A.xr.getDepthSensingMesh();Pe!==null&&yl(Pe,V,-1/0,A.sortObjects)}yl(C,V,0,A.sortObjects),E.finish(),R!==null&&R.updateLights(S.state.lightsArray),A.sortObjects===!0&&E.sort(de,ze),Le=Fe.enabled===!1||Fe.isPresenting===!1||Fe.hasDepthSensing()===!1,Le&&rt.addToRenderList(E,C),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),H===!0&&Ve.beginShadows();let $=S.state.shadowsArray;if(Ye.render($,C,V),H===!0&&Ve.endShadows(),(J&&M.hasRenderPass())===!1){let Pe=E.opaque,we=E.transmissive;if(S.setupLights(),V.isArrayCamera){let Ne=V.cameras;if(we.length>0)for(let Oe=0,ot=Ne.length;Oe<ot;Oe++){let ut=Ne[Oe];uh(Pe,we,C,ut)}Le&&rt.render(C);for(let Oe=0,ot=Ne.length;Oe<ot;Oe++){let ut=Ne[Oe];hh(E,C,ut,ut.viewport)}}else we.length>0&&uh(Pe,we,C,V),Le&&rt.render(C),hh(E,C,V)}q!==null&&z===0&&(te.updateMultisampleRenderTarget(q),te.updateRenderTargetMipmap(q)),J&&M.end(A),C.isScene===!0&&C.onAfterRender(A,C,V),Ce.resetDefaultState(),W=-1,Z=null,x.pop(),x.length>0?(S=x[x.length-1],te.setTextureUnits(S.state.textureUnits),H===!0&&Ve.setGlobalState(A.clippingPlanes,S.state.camera)):S=null,T.pop(),T.length>0?E=T[T.length-1]:E=null,R!==null&&R.renderEnd()};function yl(C,V,Q,J){if(C.visible===!1)return;if(C.layers.test(V.layers)){if(C.isGroup)Q=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(V);else if(C.isLightProbeGrid)S.pushLightProbeGrid(C);else if(C.isLight)S.pushLight(C),C.castShadow&&S.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||C.intersectsFrustum(N)){J&&me.setFromMatrixPosition(C.matrixWorld).applyMatrix4(Y);let Pe=oe.update(C),we=C.material;we.visible&&E.push(C,Pe,we,Q,me.z,null,V)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||C.intersectsFrustum(N))){let Pe=oe.update(C),we=C.material;if(J&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),me.copy(C.boundingSphere.center)):(Pe.boundingSphere===null&&Pe.computeBoundingSphere(),me.copy(Pe.boundingSphere.center)),me.applyMatrix4(C.matrixWorld).applyMatrix4(Y)),Array.isArray(we)){let Ne=Pe.groups;for(let Oe=0,ot=Ne.length;Oe<ot;Oe++){let ut=Ne[Oe],Ue=we[ut.materialIndex];Ue&&Ue.visible&&E.push(C,Pe,Ue,Q,me.z,ut,V)}}else we.visible&&E.push(C,Pe,we,Q,me.z,null,V)}}let Ee=C.children;for(let Pe=0,we=Ee.length;Pe<we;Pe++)yl(Ee[Pe],V,Q,J)}function hh(C,V,Q,J){let{opaque:$,transmissive:Ee,transparent:Pe}=C;S.setupLightsView(Q),H===!0&&Ve.setGlobalState(A.clippingPlanes,Q),J&&w.viewport(j.copy(J)),$.length>0&&ea($,V,Q),Ee.length>0&&ea(Ee,V,Q),Pe.length>0&&ea(Pe,V,Q),w.buffers.depth.setTest(!0),w.buffers.depth.setMask(!0),w.buffers.color.setMask(!0),w.setPolygonOffset(!1)}function uh(C,V,Q,J){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[J.id]===void 0){let Ue=Qe.has("EXT_color_buffer_half_float")||Qe.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[J.id]=new un(1,1,{generateMipmaps:!0,type:Ue?vn:dn,minFilter:En,samples:Math.max(4,D.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:dt.workingColorSpace})}let Ee=S.state.transmissionRenderTarget[J.id],Pe=J.viewport||j;Ee.setSize(Pe.z*A.transmissionResolutionScale,Pe.w*A.transmissionResolutionScale);let we=A.getRenderTarget(),Ne=A.getActiveCubeFace(),Oe=A.getActiveMipmapLevel();A.setRenderTarget(Ee),A.getClearColor(Xe),qe=A.getClearAlpha(),qe<1&&A.setClearColor(16777215,.5),A.clear(),Le&&rt.render(Q);let ot=A.toneMapping;A.toneMapping=On;let ut=J.viewport;if(J.viewport!==void 0&&(J.viewport=void 0),S.setupLightsView(J),H===!0&&Ve.setGlobalState(A.clippingPlanes,J),ea(C,Q,J),te.updateMultisampleRenderTarget(Ee),te.updateRenderTargetMipmap(Ee),Qe.has("WEBGL_multisampled_render_to_texture")===!1){let Ue=!1;for(let yt=0,Bt=V.length;yt<Bt;yt++){let Ct=V[yt],{object:wt,geometry:en,material:Ie,group:ln}=Ct;if(Ie.side===sn&&wt.layers.test(J.layers)){let mt=Ie.side;Ie.side=Kt,Ie.needsUpdate=!0,dh(wt,Q,J,en,Ie,ln),Ie.side=mt,Ie.needsUpdate=!0,Ue=!0}}Ue===!0&&(te.updateMultisampleRenderTarget(Ee),te.updateRenderTargetMipmap(Ee))}A.setRenderTarget(we,Ne,Oe),A.setClearColor(Xe,qe),ut!==void 0&&(J.viewport=ut),A.toneMapping=ot}function ea(C,V,Q){let J=V.isScene===!0?V.overrideMaterial:null;for(let $=0,Ee=C.length;$<Ee;$++){let Pe=C[$],{object:we,geometry:Ne,group:Oe}=Pe,ot=Pe.material;ot.allowOverride===!0&&J!==null&&(ot=J),we.layers.test(Q.layers)&&dh(we,V,Q,Ne,ot,Oe)}}function dh(C,V,Q,J,$,Ee){R!==null&&$.isNodeMaterial&&R.setObject(C,$),C.onBeforeRender(A,V,Q,J,$,Ee),C.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),$.onBeforeRender(A,V,Q,J,C,Ee),$.transparent===!0&&$.side===sn&&$.forceSinglePass===!1?($.side=Kt,$.needsUpdate=!0,A.renderBufferDirect(Q,V,J,$,C,Ee),$.side=Ci,$.needsUpdate=!0,A.renderBufferDirect(Q,V,J,$,C,Ee),$.side=sn):A.renderBufferDirect(Q,V,J,$,C,Ee),C.onAfterRender(A,V,Q,J,$,Ee)}function ta(C,V,Q){V.isScene!==!0&&(V=Ae);let J=K.get(C),$=S.state.lights,Ee=S.state.shadowsArray,Pe=$.state.version,we=_e.getParameters(C,$.state,Ee,V,Q,S.state.lightProbeGridArray),Ne=_e.getProgramCacheKey(we),Oe=J.programs;J.environment=C.isMeshStandardMaterial||C.isMeshLambertMaterial||C.isMeshPhongMaterial?V.environment:null,J.fog=V.fog;let ot=C.isMeshStandardMaterial||C.isMeshLambertMaterial&&!C.envMap||C.isMeshPhongMaterial&&!C.envMap;J.envMap=ue.get(C.envMap||J.environment,ot),J.envMapRotation=J.environment!==null&&C.envMap===null?V.environmentRotation:C.envMapRotation,Oe===void 0&&(C.addEventListener("dispose",kn),Oe=new Map,J.programs=Oe);let ut=Oe.get(Ne);if(ut!==void 0){if(J.currentProgram===ut&&J.lightsStateVersion===Pe)return ph(C,we),ut}else we.uniforms=_e.getUniforms(C),R!==null&&C.isNodeMaterial&&R.build(C,Q,we),C.onBeforeCompile(we,A),ut=_e.acquireProgram(we,Ne),Oe.set(Ne,ut),J.uniforms=we.uniforms;let Ue=J.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Ue.clippingPlanes=Ve.uniform),ph(C,we),J.needsLights=af(C),J.lightsStateVersion=Pe,J.needsLights&&(Ue.ambientLightColor.value=$.state.ambient,Ue.lightProbe.value=$.state.probe,Ue.sunLights.value=$.state.sun,Ue.sunLightShadows.value=$.state.sunShadow,Ue.directionalLights.value=$.state.directional,Ue.directionalLightShadows.value=$.state.directionalShadow,Ue.spotLights.value=$.state.spot,Ue.spotLightShadows.value=$.state.spotShadow,Ue.rectAreaLights.value=$.state.rectArea,Ue.ltc_1.value=$.state.rectAreaLTC1,Ue.ltc_2.value=$.state.rectAreaLTC2,Ue.pointLights.value=$.state.point,Ue.pointLightShadows.value=$.state.pointShadow,Ue.hemisphereLights.value=$.state.hemi,Ue.sunShadowMatrix.value=$.state.sunShadowMatrix,Ue.sunShadowCascade.value=$.state.sunShadowCascade,Ue.directionalShadowMatrix.value=$.state.directionalShadowMatrix,Ue.spotLightMatrix.value=$.state.spotLightMatrix,Ue.spotLightMap.value=$.state.spotLightMap,Ue.pointShadowMatrix.value=$.state.pointShadowMatrix),J.lightProbeGrid=S.state.lightProbeGridArray.length>0,J.currentProgram=ut,J.uniformsList=null,ut}function fh(C){if(C.uniformsList===null){let V=C.currentProgram.getUniforms();C.uniformsList=Hs.seqWithValue(V.seq,C.uniforms)}return C.uniformsList}function ph(C,V){let Q=K.get(C);Q.outputColorSpace=V.outputColorSpace,Q.batching=V.batching,Q.batchingColor=V.batchingColor,Q.instancing=V.instancing,Q.instancingColor=V.instancingColor,Q.instancingMorph=V.instancingMorph,Q.skinning=V.skinning,Q.morphTargets=V.morphTargets,Q.morphNormals=V.morphNormals,Q.morphColors=V.morphColors,Q.morphTargetsCount=V.morphTargetsCount,Q.numClippingPlanes=V.numClippingPlanes,Q.numIntersection=V.numClipIntersection,Q.vertexAlphas=V.vertexAlphas,Q.vertexTangents=V.vertexTangents,Q.toneMapping=V.toneMapping}function nf(C,V){if(C.length===0)return null;if(C.length===1)return C[0].texture!==null?C[0]:null;_.setFromMatrixPosition(V.matrixWorld);for(let Q=0,J=C.length;Q<J;Q++){let $=C[Q];if($.texture!==null&&$.boundingBox.containsPoint(_))return $}return null}function sf(C,V,Q,J,$){V.isScene!==!0&&(V=Ae),te.resetTextureUnits();let Ee=V.fog,Pe=J.isMeshStandardMaterial||J.isMeshLambertMaterial||J.isMeshPhongMaterial?V.environment:null,we=q===null?A.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:dt.workingColorSpace,Ne=J.isMeshStandardMaterial||J.isMeshLambertMaterial&&!J.envMap||J.isMeshPhongMaterial&&!J.envMap,Oe=ue.get(J.envMap||Pe,Ne),ot=J.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,ut=!!Q.attributes.tangent&&(!!J.normalMap||J.anisotropy>0),Ue=!!Q.morphAttributes.position,yt=!!Q.morphAttributes.normal,Bt=!!Q.morphAttributes.color,Ct=On;J.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(Ct=A.toneMapping);let wt=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,en=wt!==void 0?wt.length:0,Ie=K.get(J),ln=S.state.lights;if(H===!0&&(k===!0||C!==Z)){let Tt=C===Z&&J.id===W;Ve.setState(J,C,Tt)}let mt=!1;J.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==ln.state.version||Ie.outputColorSpace!==we||$.isBatchedMesh&&Ie.batching===!1||!$.isBatchedMesh&&Ie.batching===!0||$.isBatchedMesh&&Ie.batchingColor===!0&&$._colorsTexture===null||$.isBatchedMesh&&Ie.batchingColor===!1&&$._colorsTexture!==null||$.isInstancedMesh&&Ie.instancing===!1||!$.isInstancedMesh&&Ie.instancing===!0||$.isSkinnedMesh&&Ie.skinning===!1||!$.isSkinnedMesh&&Ie.skinning===!0||$.isInstancedMesh&&Ie.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&Ie.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&Ie.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&Ie.instancingMorph===!1&&$.morphTexture!==null||Ie.envMap!==Oe||J.fog===!0&&Ie.fog!==Ee||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==Ve.numPlanes||Ie.numIntersection!==Ve.numIntersection)||Ie.vertexAlphas!==ot||Ie.vertexTangents!==ut||Ie.morphTargets!==Ue||Ie.morphNormals!==yt||Ie.morphColors!==Bt||Ie.toneMapping!==Ct||Ie.morphTargetsCount!==en||!!Ie.lightProbeGrid!=S.state.lightProbeGridArray.length>0)&&(mt=!0):(mt=!0,Ie.__version=J.version);let Mn=Ie.currentProgram;mt===!0&&(Mn=ta(J,V,$),R&&J.isNodeMaterial&&R.onUpdateProgram(J,Mn,Ie));let Vn=!1,pi=!1,rs=!1,bt=Mn.getUniforms(),Ft=Ie.uniforms;if(w.useProgram(Mn.program)&&(Vn=!0,pi=!0,rs=!0),J.id!==W&&(W=J.id,pi=!0),Ie.needsLights){let Tt=nf(S.state.lightProbeGridArray,$);Ie.lightProbeGrid!==Tt&&(Ie.lightProbeGrid=Tt,pi=!0)}if(Vn||Z!==C){w.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),bt.setValue(O,"projectionMatrix",C.projectionMatrix),bt.setValue(O,"viewMatrix",C.matrixWorldInverse);let gi=bt.map.cameraPosition;gi!==void 0&&gi.setValue(O,se.setFromMatrixPosition(C.matrixWorld)),D.logarithmicDepthBuffer&&bt.setValue(O,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(J.isMeshPhongMaterial||J.isMeshToonMaterial||J.isMeshLambertMaterial||J.isMeshBasicMaterial||J.isMeshStandardMaterial||J.isShaderMaterial)&&bt.setValue(O,"isOrthographic",C.isOrthographicCamera===!0),Z!==C&&(Z=C,pi=!0,rs=!0)}if(Ie.needsLights&&(ln.state.sunShadowMap.length>0&&bt.setValue(O,"sunShadowMap",ln.state.sunShadowMap,te),ln.state.directionalShadowMap.length>0&&bt.setValue(O,"directionalShadowMap",ln.state.directionalShadowMap,te),ln.state.spotShadowMap.length>0&&bt.setValue(O,"spotShadowMap",ln.state.spotShadowMap,te),ln.state.pointShadowMap.length>0&&bt.setValue(O,"pointShadowMap",ln.state.pointShadowMap,te)),$.isSkinnedMesh){bt.setOptional(O,$,"bindMatrix"),bt.setOptional(O,$,"bindMatrixInverse");let Tt=$.skeleton;Tt&&(Tt.boneTexture===null&&Tt.computeBoneTexture(),bt.setValue(O,"boneTexture",Tt.boneTexture,te))}$.isBatchedMesh&&(bt.setOptional(O,$,"batchingTexture"),bt.setValue(O,"batchingTexture",$._matricesTexture,te),bt.setOptional(O,$,"batchingIdTexture"),bt.setValue(O,"batchingIdTexture",$._indirectTexture,te),bt.setOptional(O,$,"batchingColorTexture"),$._colorsTexture!==null&&bt.setValue(O,"batchingColorTexture",$._colorsTexture,te));let mi=Q.morphAttributes;if((mi.position!==void 0||mi.normal!==void 0||mi.color!==void 0)&&G.update($,Q,Mn),(pi||Ie.receiveShadow!==$.receiveShadow)&&(Ie.receiveShadow=$.receiveShadow,bt.setValue(O,"receiveShadow",$.receiveShadow)),(J.isMeshStandardMaterial||J.isMeshLambertMaterial||J.isMeshPhongMaterial)&&J.envMap===null&&V.environment!==null&&(Ft.envMapIntensity.value=V.environmentIntensity),Ft.dfgLUT!==void 0&&(Ft.dfgLUT.value=c_()),pi){if(bt.setValue(O,"toneMappingExposure",A.toneMappingExposure),Ie.needsLights&&rf(Ft,rs),Ee&&J.fog===!0&&ke.refreshFogUniforms(Ft,Ee),ke.refreshMaterialUniforms(Ft,J,ie,ee,S.state.transmissionRenderTarget[C.id]),Ie.needsLights&&Ie.lightProbeGrid){let Tt=Ie.lightProbeGrid;Ft.probesSH.value=Tt.texture,Ft.probesMin.value.copy(Tt.boundingBox.min),Ft.probesMax.value.copy(Tt.boundingBox.max),Ft.probesResolution.value.copy(Tt.resolution)}Hs.upload(O,fh(Ie),Ft,te)}if(J.isShaderMaterial&&J.uniformsNeedUpdate===!0&&(Hs.upload(O,fh(Ie),Ft,te),J.uniformsNeedUpdate=!1),J.isSpriteMaterial&&bt.setValue(O,"center",$.center),bt.setValue(O,"modelViewMatrix",$.modelViewMatrix),bt.setValue(O,"normalMatrix",$.normalMatrix),bt.setValue(O,"modelMatrix",$.matrixWorld),J.uniformsGroups!==void 0){let Tt=J.uniformsGroups;for(let gi=0,as=Tt.length;gi<as;gi++){let gh=Tt[gi];ce.update(gh,Mn),ce.bind(gh,Mn)}}return Mn}function rf(C,V){C.ambientLightColor.needsUpdate=V,C.lightProbe.needsUpdate=V,C.sunLights.needsUpdate=V,C.sunLightShadows.needsUpdate=V,C.directionalLights.needsUpdate=V,C.directionalLightShadows.needsUpdate=V,C.pointLights.needsUpdate=V,C.pointLightShadows.needsUpdate=V,C.spotLights.needsUpdate=V,C.spotLightShadows.needsUpdate=V,C.rectAreaLights.needsUpdate=V,C.hemisphereLights.needsUpdate=V}function af(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return U},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return q},this.setRenderTargetTextures=function(C,V,Q){let J=K.get(C);J.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,J.__autoAllocateDepthBuffer===!1&&(J.__useRenderToTexture=!1),K.get(C.texture).__webglTexture=V,K.get(C.depthTexture).__webglTexture=J.__autoAllocateDepthBuffer?void 0:Q,J.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,V){let Q=K.get(C);Q.__webglFramebuffer=V,Q.__useDefaultFramebuffer=V===void 0},this.setRenderTarget=function(C,V=0,Q=0){q=C,U=V,z=Q;let J=null,$=!1,Ee=!1;if(C){let we=K.get(C);if(we.__useDefaultFramebuffer!==void 0){w.bindFramebuffer(O.FRAMEBUFFER,we.__webglFramebuffer),j.copy(C.viewport),xe.copy(C.scissor),he=C.scissorTest,w.viewport(j),w.scissor(xe),w.setScissorTest(he),W=-1;return}else if(we.__webglFramebuffer===void 0)te.setupRenderTarget(C);else if(we.__hasExternalTextures)te.rebindTextures(C,K.get(C.texture).__webglTexture,K.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){let ot=C.depthTexture;if(we.__boundDepthTexture!==ot){if(ot!==null&&K.has(ot)&&(C.width!==ot.image.width||C.height!==ot.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");te.setupDepthRenderbuffer(C)}}let Ne=C.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(Ee=!0);let Oe=K.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(Oe[V])?J=Oe[V][Q]:J=Oe[V],$=!0):C.samples>0&&te.useMultisampledRTT(C)===!1?J=K.get(C).__webglMultisampledFramebuffer:Array.isArray(Oe)?J=Oe[Q]:J=Oe,j.copy(C.viewport),xe.copy(C.scissor),he=C.scissorTest}else j.copy(fe).multiplyScalar(ie).floor(),xe.copy(De).multiplyScalar(ie).floor(),he=Re;if(Q!==0&&(J=L),w.bindFramebuffer(O.FRAMEBUFFER,J)&&w.drawBuffers(C,J),w.viewport(j),w.scissor(xe),w.setScissorTest(he),$){let we=K.get(C.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+V,we.__webglTexture,Q)}else if(Ee){let we=V;for(let Ne=0;Ne<C.textures.length;Ne++){let Oe=K.get(C.textures[Ne]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+Ne,Oe.__webglTexture,Q,we)}}else if(C!==null&&Q!==0){let we=K.get(C.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,we.__webglTexture,Q)}W=-1};function mh(C){let V=K.get(C);return(V.__readFormat!==C.format||V.__readType!==C.type)&&(V.__readFormat=C.format,V.__readType=C.type,V.__formatReadable=D.textureFormatReadable(C.format),V.__typeReadable=D.textureTypeReadable(C.type)),V}this.readRenderTargetPixels=function(C,V,Q,J,$,Ee,Pe,we=0){if(!(C&&C.isWebGLRenderTarget)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ne=K.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Pe!==void 0&&(Ne=Ne[Pe]),Ne){w.bindFramebuffer(O.FRAMEBUFFER,Ne);try{let Oe=C.textures[we],ot=Oe.format,ut=Oe.type;C.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+we);let Ue=mh(Oe);if(Ue.__formatReadable===!1){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ue.__typeReadable===!1){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=C.width-J&&Q>=0&&Q<=C.height-$&&O.readPixels(V,Q,J,$,Me.convert(ot),Me.convert(ut),Ee)}finally{let Oe=q!==null?K.get(q).__webglFramebuffer:null;w.bindFramebuffer(O.FRAMEBUFFER,Oe)}}},this.readRenderTargetPixelsAsync=async function(C,V,Q,J,$,Ee,Pe,we=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ne=K.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Pe!==void 0&&(Ne=Ne[Pe]),Ne)if(V>=0&&V<=C.width-J&&Q>=0&&Q<=C.height-$){w.bindFramebuffer(O.FRAMEBUFFER,Ne);let Oe=C.textures[we],ot=Oe.format,ut=Oe.type;C.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+we);let Ue=mh(Oe);if(Ue.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ue.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let yt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,yt),O.bufferData(O.PIXEL_PACK_BUFFER,Ee.byteLength,O.STREAM_READ),O.readPixels(V,Q,J,$,Me.convert(ot),Me.convert(ut),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);let Bt=q!==null?K.get(q).__webglFramebuffer:null;w.bindFramebuffer(O.FRAMEBUFFER,Bt);let Ct=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await Pu(O,Ct,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,yt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Ee),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(yt),O.deleteSync(Ct),Ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,V=null,Q=0){let J=Math.pow(2,-Q),$=Math.floor(C.image.width*J),Ee=Math.floor(C.image.height*J),Pe=V!==null?V.x:0,we=V!==null?V.y:0;te.setTexture2D(C,0),O.copyTexSubImage2D(O.TEXTURE_2D,Q,0,0,Pe,we,$,Ee),w.unbindTexture()},this.copyTextureToTexture=function(C,V,Q=null,J=null,$=0,Ee=0){let Pe,we,Ne,Oe,ot,ut,Ue,yt,Bt,Ct=C.isCompressedTexture?C.mipmaps[Ee]:C.image;if(Q!==null)Pe=Q.max.x-Q.min.x,we=Q.max.y-Q.min.y,Ne=Q.isBox3?Q.max.z-Q.min.z:1,Oe=Q.min.x,ot=Q.min.y,ut=Q.isBox3?Q.min.z:0;else{let Ft=Math.pow(2,-$);Pe=Math.floor(Ct.width*Ft),we=Math.floor(Ct.height*Ft),C.isDataArrayTexture?Ne=Ct.depth:C.isData3DTexture?Ne=Math.floor(Ct.depth*Ft):Ne=1,Oe=0,ot=0,ut=0}J!==null?(Ue=J.x,yt=J.y,Bt=J.z):(Ue=0,yt=0,Bt=0);let wt=Me.convert(V.format),en=Me.convert(V.type),Ie;V.isData3DTexture?(te.setTexture3D(V,0),Ie=O.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(te.setTexture2DArray(V,0),Ie=O.TEXTURE_2D_ARRAY):(te.setTexture2D(V,0),Ie=O.TEXTURE_2D),w.activeTexture(O.TEXTURE0),w.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,V.flipY),w.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),w.pixelStorei(O.UNPACK_ALIGNMENT,V.unpackAlignment);let ln=w.getParameter(O.UNPACK_ROW_LENGTH),mt=w.getParameter(O.UNPACK_IMAGE_HEIGHT),Mn=w.getParameter(O.UNPACK_SKIP_PIXELS),Vn=w.getParameter(O.UNPACK_SKIP_ROWS),pi=w.getParameter(O.UNPACK_SKIP_IMAGES);w.pixelStorei(O.UNPACK_ROW_LENGTH,Ct.width),w.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Ct.height),w.pixelStorei(O.UNPACK_SKIP_PIXELS,Oe),w.pixelStorei(O.UNPACK_SKIP_ROWS,ot),w.pixelStorei(O.UNPACK_SKIP_IMAGES,ut);let rs=C.isDataArrayTexture||C.isData3DTexture,bt=V.isDataArrayTexture||V.isData3DTexture;if(C.isDepthTexture){let Ft=K.get(C),mi=K.get(V),Tt=K.get(Ft.__renderTarget),gi=K.get(mi.__renderTarget);w.bindFramebuffer(O.READ_FRAMEBUFFER,Tt.__webglFramebuffer),w.bindFramebuffer(O.DRAW_FRAMEBUFFER,gi.__webglFramebuffer);for(let as=0;as<Ne;as++)rs&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,K.get(C).__webglTexture,$,ut+as),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,K.get(V).__webglTexture,Ee,Bt+as)),O.blitFramebuffer(Oe,ot,Pe,we,Ue,yt,Pe,we,O.DEPTH_BUFFER_BIT,O.NEAREST);w.bindFramebuffer(O.READ_FRAMEBUFFER,null),w.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if($!==0||C.isRenderTargetTexture||K.has(C)){let Ft=K.get(C),mi=K.get(V);w.bindFramebuffer(O.READ_FRAMEBUFFER,P),w.bindFramebuffer(O.DRAW_FRAMEBUFFER,F);for(let Tt=0;Tt<Ne;Tt++)rs?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ft.__webglTexture,$,ut+Tt):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ft.__webglTexture,$),bt?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,mi.__webglTexture,Ee,Bt+Tt):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,mi.__webglTexture,Ee),$!==0?O.blitFramebuffer(Oe,ot,Pe,we,Ue,yt,Pe,we,O.COLOR_BUFFER_BIT,O.NEAREST):bt?O.copyTexSubImage3D(Ie,Ee,Ue,yt,Bt+Tt,Oe,ot,Pe,we):O.copyTexSubImage2D(Ie,Ee,Ue,yt,Oe,ot,Pe,we);w.bindFramebuffer(O.READ_FRAMEBUFFER,null),w.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else bt?C.isDataTexture||C.isData3DTexture?O.texSubImage3D(Ie,Ee,Ue,yt,Bt,Pe,we,Ne,wt,en,Ct.data):V.isCompressedArrayTexture?O.compressedTexSubImage3D(Ie,Ee,Ue,yt,Bt,Pe,we,Ne,wt,Ct.data):O.texSubImage3D(Ie,Ee,Ue,yt,Bt,Pe,we,Ne,wt,en,Ct):C.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Ee,Ue,yt,Pe,we,wt,en,Ct.data):C.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Ee,Ue,yt,Ct.width,Ct.height,wt,Ct.data):O.texSubImage2D(O.TEXTURE_2D,Ee,Ue,yt,Pe,we,wt,en,Ct);w.pixelStorei(O.UNPACK_ROW_LENGTH,ln),w.pixelStorei(O.UNPACK_IMAGE_HEIGHT,mt),w.pixelStorei(O.UNPACK_SKIP_PIXELS,Mn),w.pixelStorei(O.UNPACK_SKIP_ROWS,Vn),w.pixelStorei(O.UNPACK_SKIP_IMAGES,pi),Ee===0&&V.generateMipmaps&&O.generateMipmap(Ie),w.unbindTexture()},this.initRenderTarget=function(C){K.get(C).__webglFramebuffer===void 0&&te.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?te.setTextureCube(C,0):C.isData3DTexture?te.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?te.setTexture2DArray(C,0):te.setTexture2D(C,0),w.unbindTexture()},this.resetState=function(){U=0,z=0,q=null,w.reset(),Ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Nn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=dt._getDrawingBufferColorSpace(e),t.unpackColorSpace=dt._getUnpackColorSpace()}};var je=(i,e,t)=>i<e?e:i>t?t:i,xt=(i,e,t)=>i+(e-i)*t,pt=(i,e,t)=>{let n=je((t-i)/(e-i),0,1);return n*n*(3-2*n)};function Di(i){let e=i>>>0;return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function al(i,e,t){let n=Math.imul(i,374761393)+Math.imul(e,668265263)+Math.imul(t,2147483647);return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967295}function ci(i,e,t=0,n=0){let s=Math.floor(i),r=Math.floor(e),a=i-s,o=e-r,l=a*a*(3-2*a),c=o*o*(3-2*o),d=s+1,f=r+1;n>0&&(s=(s%n+n)%n,r=(r%n+n)%n,d=(s+1)%n,f=(r+1)%n);let h=al(s,r,t),m=al(d,r,t),g=al(s,f,t),b=al(d,f,t);return xt(xt(h,m,l),xt(g,b,l),c)}function Dt(i,e,t=5,n=0,s=0){let r=0,a=.5,o=1,l=0;for(let c=0;c<t;c++)r+=a*ci(i*o,e*o,n+c*17,s?s*o:0),l+=a,a*=.5,o*=2;return r/l}function md(i,e,t=5,n=0){let s=0,r=.5,a=1,o=0;for(let l=0;l<t;l++){let c=1-Math.abs(ci(i*a,e*a,n+l*31)*2-1);s+=r*c*c,o+=r,r*=.5,a*=2}return s/o}function Ys(i){let e=document.createElement("canvas");return e.width=e.height=i,e}function Zs(i,e,t){let n=new _r(i);return n.wrapS=n.wrapT=Si,n.anisotropy=t,n.generateMipmaps=!0,n.minFilter=En,n.magFilter=kt,e&&(n.colorSpace=Jt),n}function Jr(i,e,t,n){let s=Ys(i),r=Ys(i),a=Ys(i),o=s.getContext("2d"),l=r.getContext("2d"),c=a.getContext("2d"),d=o.createImageData(i,i),f=l.createImageData(i,i),h=c.createImageData(i,i),m=new Float32Array(i*i);for(let g=0;g<i;g++)for(let b=0;b<i;b++){let p=n(b/i,g/i,b,g),u=g*i+b;d.data[u*4]=je(p[0],0,1)*255,d.data[u*4+1]=je(p[1],0,1)*255,d.data[u*4+2]=je(p[2],0,1)*255,d.data[u*4+3]=255,m[u]=p[3];let y=je(p[4]==null?.85:p[4],0,1)*255;h.data[u*4]=h.data[u*4+1]=h.data[u*4+2]=y,h.data[u*4+3]=255}for(let g=0;g<i;g++)for(let b=0;b<i;b++){let p=m[g*i+(b+i-1)%i],u=m[g*i+(b+1)%i],y=m[(g+i-1)%i*i+b],v=m[(g+1)%i*i+b],_=(p-u)*t,E=(y-v)*t,S=1,T=Math.hypot(_,E,S);_/=T,E/=T,S/=T;let x=(g*i+b)*4;f.data[x]=(_*.5+.5)*255,f.data[x+1]=(E*.5+.5)*255,f.data[x+2]=(S*.5+.5)*255,f.data[x+3]=255}return o.putImageData(d,0,0),l.putImageData(f,0,0),c.putImageData(h,0,0),{map:Zs(s,!0,e),normal:Zs(r,!1,e),rough:Zs(a,!1,e)}}function gd(i=4,e=512){let t={};t.concrete=Jr(e,i,2.2,(n,s)=>{let r=Dt(n*6,s*6,4,3,6),a=Dt(n*48,s*48,3,9,48),o=ci(n*90,s*90,5,90)>.93?1:0,l=Math.abs(s*4%1-.5)>.492?1:0,c=Dt(n*3,s*14,3,21,3),d=.56+(r-.5)*.18+(a-.5)*.12-o*.12-l*.16-Math.max(0,c-.55)*.35;return[d*1,d*1,d*.97,d*.7+a*.3-o*.5-l*.6,.9-o*.1]}),t.wood=Jr(e,i,2.6,(n,s)=>{let r=Math.floor(s*6),a=s*6%1,o=r*.37,l=Dt((n+o)*4,s*90,4,41+r,0),c=Math.sin((l*14+n*3+o)*6.283)*.5+.5,d=a<.035||a>.965?1:0,f=Math.max(0,1-Math.hypot((n+o)%1-.5,(a-.5)*.4)*8)*(ci(r,1,7)>.6?1:0),h=.35+c*.22+(l-.5)*.25-d*.28-f*.2,m=ci(r,3,11);return[h*(.95+m*.2)*1,h*.68,h*.42,h*.8-d*.7-f*.2,.78]}),t.stone=Jr(e,i,3.2,(n,s)=>{let a=Math.floor(s*5),o=(n*3+a%2*.5)%1,l=s*5%1,c=a+Math.floor(n*3+a%2*.5),d=o<.04||o>.96||l<.06||l>.94?1:0,f=.45+ci(c,9,5)*.25,h=Dt(n*24,s*24,4,51,24),m=d?.3:f+(h-.5)*.22;return[m*1.02,m,m*.92,d?0:.55+(h-.5)*.5,d?.98:.86]}),t.rock=Jr(e,i,4,(n,s)=>{let r=Dt(n*8,s*8,6,61,8),a=Dt(n*3,s*3,4,71,3),o=Math.sin((s*22+a*5)*6.283)*.5+.5,l=Dt(n*32,s*32,3,83,32),c=.5+(r-.5)*.5+(a-.5)*.22+(o-.5)*.06+(l-.5)*.12;return[c,c,c,r*.6+a*.2+o*.1+l*.3,.92]}),t.iron=Jr(256,i,1.2,(n,s)=>{let r=ci(n*3,s*80,13,0)*.5+Dt(n*12,s*12,3,17,12)*.5,a=.2+r*.14;return[a,a*1.02,a*1.08,r,.45+r*.2]});{let s=Ys(256),r=s.getContext("2d"),a=r.createImageData(256,256),o=(l,c)=>Dt(l*4,c*4,3,91,4)*.78+Dt(l*16,c*16,2,93,16)*.22;for(let l=0;l<256;l++)for(let c=0;c<256;c++){let d=c/256,f=l/256,h=1/256,m=(o(d+h,f)-o(d-h,f))*11,g=(o(d,f+h)-o(d,f-h))*11,b=(l*256+c)*4;a.data[b]=je(.5+m,0,1)*255,a.data[b+1]=je(.5+g,0,1)*255,a.data[b+2]=Dt(d*10,f*10,4,97,10)*255,a.data[b+3]=255}r.putImageData(a,0,0),t.water=Zs(s,!1,i)}{let s=Ys(256),r=s.getContext("2d");r.fillStyle="#b9b2a4",r.fillRect(0,0,256,256);let a=r.getImageData(0,0,256,256);for(let o=0;o<256*256;o++){let l=(ci(o%256*.25,Math.floor(o/256)*.25,3)-.5)*36;a.data[o*4]+=l,a.data[o*4+1]+=l,a.data[o*4+2]+=l}r.putImageData(a,0,0),r.translate(256/2,256/2),r.strokeStyle="#5e584d",r.lineWidth=3;for(let o=0;o<8;o++){r.save(),r.rotate(o*Math.PI/4);for(let l=0;l<6;l++)r.beginPath(),r.moveTo(24,-6+l*5),r.lineTo(124,-22+l*8),r.stroke();r.restore()}r.fillStyle="#2a2723",r.beginPath(),r.arc(0,0,20,0,6.283),r.fill(),t.millstone={map:Zs(s,!0,i)}}{let r=Ys(128),a=r.getContext("2d");a.fillStyle="#3b2a1e",a.fillRect(0,0,128,128);let o=Di(9);for(let l=0;l<400;l++)a.fillStyle="rgba("+(70+o()*40|0)+","+(48+o()*25|0)+",30,0.5)",a.fillRect(o()*128,o()*128,2+o()*6,1);a.fillStyle="#c9a36a";for(let l=0;l<8;l++)a.fillRect(l*16+7,0,2,128);t.belt={map:Zs(r,!0,i)}}return t}var $r=new B(.52,.64,.56).normalize(),LM=new Te("#f1c3a6"),DM=new Te("#1f3480"),NM=new Te("#8aa6e6"),Kr=new Te("#aebbd6"),eh=`
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
}`;function xd(){let i=new Gt({side:Kt,depthWrite:!1,fog:!1,uniforms:{uSunDir:{value:$r},uTime:{value:0},uLin:{value:0}},vertexShader:"varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * p; gl_Position.z = gl_Position.w; }",fragmentShader:`${eh}
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
      }`}),e=new We(new oi(900,32,20),i);return e.frustumCulled=!1,e.renderOrder=-10,e.name="sky",e}function _d(i,e){let t=new Ws(i),n=new Gi,s=e.clone();n.add(s);let r=t.fromScene(n,0,1,2e3);return t.dispose(),r.texture}function ol(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new St,c=0;for(let d=0;d<i.length;++d){let f=i[d],h=0;if(t!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let m in f.attributes){if(!n.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;r[m]===void 0&&(r[m]=[]),r[m].push(f.attributes[m]),h++}if(h!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let m in f.morphAttributes){if(!s.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+".  .morphAttributes must be consistent throughout all geometries."),null;a[m]===void 0&&(a[m]=[]),a[m].push(f.morphAttributes[m])}if(e){let m;if(t)m=f.index.count;else if(f.attributes.position!==void 0)m=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,m,d),c+=m}}if(t){let d=0,f=[];for(let h=0;h<i.length;++h){let m=i[h].index;for(let g=0;g<m.count;++g)f.push(m.getX(g)+d);d+=i[h].attributes.position.count}l.setIndex(f)}for(let d in r){let f=vd(r[d]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" attribute."),null;l.setAttribute(d,f)}for(let d in a){let f=a[d][0].length;if(f!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[d]=[];for(let h=0;h<f;++h){let m=[];for(let b=0;b<a[d].length;++b)m.push(a[d][b][h]);let g=vd(m);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" morphAttribute."),null;l.morphAttributes[d].push(g)}}}return l}function vd(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let d=i[c];if(e===void 0&&(e=d.array.constructor),e!==d.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=d.itemSize),t!==d.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=d.normalized),n!==d.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=d.gpuType),s!==d.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=d.count*t}let a=new e(r),o=new Yt(a,t,n),l=0;for(let c=0;c<i.length;++c){let d=i[c];if(d.isInterleavedBufferAttribute){let f=l/t;for(let h=0,m=d.count;h<m;h++)for(let g=0;g<t;g++){let b=d.getComponent(h,g);o.setComponent(h+f,g,b)}}else a.set(d.array,l);l+=d.count*t}return s!==void 0&&(o.gpuType=s),o}var zn=9,hi=10.2;var ll=-1.4,ct={x:7,y:3.6,z:-1,r:3.4},yd=i=>-1+6*Math.sin(i*.045+.6)*pt(-8,22,i),th=i=>i<18?xt(.3,-.3,pt(4,18,i)):-.3-1.1*pt(40,125,i),cl=i=>xt(ct.x,yd(i)+1.5,pt(3,34,i))+4*Math.sin(i*.11)*pt(8,40,i);function h_(i){let e=[[-140,40],[-60,34],[-26,18],[-20,15],[-6,15],[12,22],[60,40],[105,62],[170,420]];for(let t=0;t<e.length-1;t++)if(i<=e[t+1][0]){let n=pt(e[t][0],e[t+1][0],i);return xt(e[t][1],e[t+1][1],n)}return 420}function Qt(i,e){let t=Math.abs(i-yd(e)),n=h_(e),s=Math.max(0,t-n),r=md(i*.022+3,e*.022-5,5,4),a=15*pt(0,6.5,s)+.34*Math.pow(s,1.22)*(.75+.9*r);a+=pt(6,50,s)*(r-.35)*34+Dt(i*.07,e*.07,4,8)*4.2*pt(0,12,s)+(Dt(i*.35,e*.35,3,12)-.5)*.9*pt(0,8,s),a+=pt(-100,-150,e)*(30+34*r);let o=pt(-6,-17.5,e),l=xt(-.012*Math.max(0,e-4)-2.5*pt(110,190,e),-5.5,o);a+=l+(Dt(i*.2,e*.2,3,3)-.5)*.35*(1-o);let c=Math.abs(i-cl(e)),d=pt(-3,3,e)*(1-o),f=(1-pt(2,6.5,c))*d;a=xt(a,Math.min(a,th(e)-.55+.18*Math.sin(e*.3+i*.2)),f*.95);let h=u_(i,e),m=(1-pt(1.4,4.2,h))*(1-o)*pt(-15,-7,e);return a=xt(a,Math.min(a,-.7),m*.95),a}var Qi=[[-13.5,-9],[-12.8,-3],[-11.2,3],[-8,7.2],[-3,9.6],[3,10.8],[6.6,11.2]];function u_(i,e){let t=1e9;for(let n=0;n<Qi.length-1;n++){let s=Qi[n][0],r=Qi[n][1],a=Qi[n+1][0],o=Qi[n+1][1],l=a-s,c=o-r,d=je(((i-s)*l+(e-r)*c)/(l*l+c*c),0,1);t=Math.min(t,Math.hypot(i-(s+l*d),e-(r+c*d)))}return t}function Md(i,e){let t=e==="low"?150:200,n=170,s=215,r=-5,a=new Fn(2,2,t,t);a.rotateX(-Math.PI/2);let o=a.attributes.position,l=new Float32Array(o.count*3),c=a.attributes.uv,d=u=>Math.sign(u)*Math.pow(Math.abs(u),1.7);for(let u=0;u<o.count;u++){let y=d(o.getX(u))*n,v=r+d(o.getZ(u))*s;o.setX(u,y),o.setZ(u,v),o.setY(u,Qt(y,v)),c.setXY(u,y*.045,v*.045)}a.computeVertexNormals();let f=a.attributes.normal,h={rockD:new Te("#45433f"),rockL:new Te("#8c867b"),grassD:new Te("#4d6e30"),grassL:new Te("#7c9a42"),dirt:new Te("#7a6548"),snow:new Te("#f2f6fc"),shore:new Te("#8d8472"),scree:new Te("#7d7468"),sand:new Te("#c4b08c")},m=new Te,g=new Te;for(let u=0;u<o.count;u++){let y=o.getX(u),v=o.getY(u),_=o.getZ(u),E=f.getY(u),S=Dt(y*.09,_*.09,3,5),T=Math.sin(v*1.6+Dt(y*.05,_*.05,3,2)*7)*.5+.5;m.copy(h.rockD).lerp(h.rockL,je(S*.9+T*.25,0,1)),m.lerp(h.scree,pt(.45,.72,E)*.55);let x=pt(.66,.86,E)*(1-pt(16,30,v))*pt(-.3,.3,v);g.copy(h.grassD).lerp(h.grassL,Dt(y*.18,_*.18,3,9)),m.lerp(g,x*.95),m.lerp(h.shore,(1-pt(-.9,-.1,v))*.9),m.lerp(h.sand,pt(92,128,_)*(1-pt(.4,2.6,v))*.92),m.lerp(h.dirt,(1-pt(8.2,9.8,Math.abs(v-zn)))*.5*(_<-17?1:0));let M=pt(32+S*14,46+S*12,v)*pt(.3,.62,E+.15);m.lerp(h.snow,M);let A=(.72+.28*Dt(y*.5,_*.5,2,15))*(.78+.22*pt(.2,.8,E));l[u*3]=m.r*A,l[u*3+1]=m.g*A,l[u*3+2]=m.b*A}a.setAttribute("color",new Yt(l,3));let b=new ft({vertexColors:!0,roughness:.98,metalness:0});b.onBeforeCompile=u=>{u.uniforms.uDetail={value:i.rock.map},u.vertexShader=u.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWP; varying vec3 vWN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vWP = position; vWN = normal;`),u.fragmentShader=u.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vWP; varying vec3 vWN; uniform sampler2D uDetail;
vec3 tri(vec3 p, vec3 n, float s){ vec3 w = pow(abs(n), vec3(4.0)); w /= (w.x + w.y + w.z); return texture2D(uDetail, p.zy * s).rgb * w.x + texture2D(uDetail, p.xz * s).rgb * w.y + texture2D(uDetail, p.xy * s).rgb * w.z; }`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
{ vec3 nn2 = normalize(vWN); float h = dot(tri(vWP, nn2, 1.3), vec3(0.34)) * 0.3 + dot(tri(vWP, nn2, 0.42), vec3(0.34)) * 0.4 + dot(tri(vWP, nn2, 0.11), vec3(0.34)) * 0.3; vec3 dpx = dFdx(-vViewPosition), dpy = dFdy(-vViewPosition); float dhx = dFdx(h), dhy = dFdy(h); vec3 r1 = cross(dpy, normal), r2 = cross(normal, dpx); float det = dot(dpx, r1); vec3 gr = sign(det) * (dhx * r1 + dhy * r2); normal = normalize(abs(det) * normal - 1.15 * gr); }`).replace("#include <color_fragment>",`#include <color_fragment>
{ vec3 nn = normalize(vWN); vec3 d = tri(vWP, nn, 0.42) * 0.38 + tri(vWP, nn, 0.11) * 0.42 + tri(vWP, nn, 0.021) * 0.2; diffuseColor.rgb *= 1.12 + (d.r - 0.5) * 2.1; }`)};let p=new We(a,b);return p.receiveShadow=!0,p.name="terrain",p}function bd(i,e){let t=Di(77),n=new Vt(.12,.2,1.4,5),s=[],r=(g,b)=>{let p=new Float32Array(g.attributes.position.count*3);for(let u=0;u<p.length;u+=3)p[u]=b.r,p[u+1]=b.g,p[u+2]=b.b;return g.setAttribute("color",new Yt(p,3)),g};n.translate(0,.7,0),r(n,new Te("#4a3322")),s.push(n);for(let g=0;g<3;g++){let b=new Wi(1.25-g*.3,1.9-g*.2,7);b.translate(0,1.7+g*1.05,0),r(b,new Te().setHSL(.31,.4,.055+g*.022)),s.push(b)}let a=ol(s);a.computeBoundingSphere();let o=new ft({vertexColors:!0,roughness:.95,flatShading:!0}),l=[],c=0;for(;l.length<i&&c++<i*30;){let g=(t()-.5)*220,b=-60+t()*130,p=Qt(g,b);if(p<.6||p>26)continue;let u=1.2,y=(Qt(g+u,b)-Qt(g-u,b))/(2*u),v=(Qt(g,b+u)-Qt(g,b-u))/(2*u);Math.hypot(y,v)>.75||b>-17&&Math.abs(g-cl(b))<8||e&&e(g,b)||p>8.2&&p<10.4&&b<-17||l.push([g,p,b,.8+t()*1.5,t()*6.28,t()])}let d=new ri(a,o,l.length),f=new gt,h=new Ot,m=new Te;return l.forEach((g,b)=>{h.position.set(g[0],g[1]-.15,g[2]),h.scale.set(g[3]*(.85+g[5]*.3),g[3],g[3]*(.85+g[5]*.3)),h.rotation.y=g[4],h.updateMatrix(),d.setMatrixAt(b,h.matrix),m.setHSL(.02*g[5],0,.7+g[5]*.5),d.setColorAt(b,m)}),d.castShadow=!0,d.receiveShadow=!1,d.name="forest",d.userData.count=l.length,d}function Sd(i){let a=Math.round(100)+1,o=Math.round((-17.2- -150)/2)+1,l=new Float32Array(a*o);for(let v=0;v<o;v++)for(let _=0;_<a;_++)l[v*a+_]=Qt(-100+_*2,-150+v*2);let c=[],d=[],f=[],h=new Int32Array(a*o).fill(-1),m=(v,_)=>{let E=_*a+v;return h[E]<0&&(h[E]=c.length/3,c.push(-100+v*2,zn,-150+_*2),d.push(-100+v*2,-150+_*2)),h[E]};for(let v=0;v<o-1;v++)for(let _=0;_<a-1;_++){let E=Math.min(l[v*a+_],l[v*a+_+1],l[(v+1)*a+_],l[(v+1)*a+_+1]),S=-100+(_+.5)*2,T=-150+(v+.5)*2;if(E<zn+.8&&!(S>3&&S<11&&T>-26&&T<-17.5)){let x=m(_,v),M=m(_+1,v),A=m(_,v+1),I=m(_+1,v+1);f.push(x,A,M,M,A,I)}}let g=new St;g.setAttribute("position",new He(c,3)),g.setAttribute("uv",new He(d,2));let b=c.length/3,p=new Float32Array(b*3),u=new Float32Array(b*3);for(let v=0;v<b;v++)p[v*3+1]=1,u[v*3]=1;g.setAttribute("normal",new He(p,3)),g.setAttribute("aTan",new He(u,3)),g.setAttribute("aFoam",new He(new Float32Array(b),1)),g.setIndex(f);let y=new We(g,i);return y.name="lake",y.renderOrder=1,y.frustumCulled=!1,y}function wd(i,e){let c=e==="low"?70:110,d=Math.round(c*.7),f=[],h=[],m=[],g=new Int32Array((c+1)*(d+1)).fill(-1),b=(x,M)=>{let A=-1300+2600*x/c,I=-1e3+1700*M/d,R=A<-170||A>170||I<-220||I>210;return[A,I,R]},p=new Te("#6c6a68"),u=new Te("#9a948a"),y=new Te("#f2f6fc"),v=new Te("#4a5a38"),_=new Te,E=(x,M)=>{let A=M*(c+1)+x;if(g[A]<0){let[I,R]=b(x,M),L=Qt(I,R)-2;g[A]=f.length/3,f.push(I,L,R);let P=Dt(I*.01,R*.01,3,3);_.copy(p).lerp(u,P),_.lerp(v,(1-pt(10,60,L))*.6),_.lerp(y,pt(70+P*40,130+P*40,L)),m.push(_.r,_.g,_.b)}return g[A]};for(let x=0;x<d;x++)for(let M=0;M<c;M++){let A=b(M,x),I=b(M+1,x),R=b(M,x+1),L=b(M+1,x+1);if(!(A[2]||I[2]||R[2]||L[2]))continue;let P=E(M,x),F=E(M+1,x),U=E(M,x+1),z=E(M+1,x+1);h.push(P,U,F,F,U,z)}let S=new St;S.setAttribute("position",new He(f,3)),S.setAttribute("color",new He(m,3)),S.setIndex(h),S.computeVertexNormals();let T=new We(S,i.clone());return T.material.polygonOffset=!0,T.material.polygonOffsetFactor=3,T.material.polygonOffsetUnits=3,T.name="farRange",T.frustumCulled=!1,T}function hl(i,e,t){let n=[],s=i,r=e,a=Qt(s,r);for(let o=0;o<90&&a>zn+.4;o++){let c=(Qt(s+1.5,r)-Qt(s-1.5,r))/3,d=(Qt(s,r+1.5)-Qt(s,r-1.5))/(2*1.5),f=Math.hypot(c,d)||1;n.push([s,a+.35,r]),s-=c/f*1.6,r-=d/f*1.6,a=Qt(s,r)}return n.push([s,zn+.05,r]),n}function Ed(i,e){let o=Math.round(173.33333333333334)+1,l=Math.round(270/3)+1,c=new Float32Array(o*l);for(let T=0;T<l;T++)for(let x=0;x<o;x++)c[T*o+x]=Qt(-260+x*3,60+T*3);let d=[],f=[],h=[],m=[],g=new Int32Array(o*l).fill(-1),b=(T,x)=>{let M=x*o+T;return g[M]<0&&(g[M]=d.length/3,d.push(-260+T*3,ll,60+x*3),f.push(-260+T*3,60+x*3),h.push(je(1-(ll-c[M])/1.6,0,1))),g[M]};for(let T=0;T<l-1;T++)for(let x=0;x<o-1;x++)if(Math.min(c[T*o+x],c[T*o+x+1],c[(T+1)*o+x],c[(T+1)*o+x+1])<ll+.4){let A=b(x,T),I=b(x+1,T),R=b(x,T+1),L=b(x+1,T+1);m.push(A,R,I,I,R,L)}let p=d.length/3,u=2600;[[-u,329],[u,329],[-u,u],[u,u]].forEach(T=>{d.push(T[0],ll,T[1]),f.push(T[0],T[1]),h.push(0)}),m.push(p,p+2,p+1,p+1,p+2,p+3);let y=new St,v=d.length/3,_=new Float32Array(v*3),E=new Float32Array(v*3);for(let T=0;T<v;T++)_[T*3+1]=1,E[T*3]=1;y.setAttribute("position",new He(d,3)),y.setAttribute("uv",new He(f,2)),y.setAttribute("normal",new He(_,3)),y.setAttribute("aTan",new He(E,3)),y.setAttribute("aFoam",new He(new Float32Array(h),1)),y.setIndex(m);let S=new We(y,i);return S.name="sea",S.renderOrder=1,S.frustumCulled=!1,S}var nh=[];function Td(i,e){return{uTime:{value:0},uSunDir:{value:$r},uTex:{value:i.water},uFogColor:{value:Kr.clone()},uFogDensity:{value:e}}}function ui(i,e={}){let t=new Gt({transparent:e.transparent!==!1,depthWrite:!!e.depthWrite,side:sn,fog:!1,uniforms:Object.assign({},i,{uSpeed:{value:e.speed||0},uAmp:{value:e.amp==null?1:e.amp},uScale:{value:e.scale||.22},uStretch:{value:e.stretch||1},uAcross:{value:e.across||3.2},uShallow:{value:new Te(e.shallow||"#4fb6c4")},uDeep:{value:new Te(e.deep||"#0f4a78")},uOpacity:{value:e.opacity==null?.9:e.opacity},uFoam:{value:e.foam==null?1:e.foam},uEdgeFoam:{value:e.edgeFoam==null?.6:e.edgeFoam},uFlow:{value:e.flow==null?1:e.flow},uClear:{value:e.clear==null?.5:e.clear},uWhite:{value:e.white||0},uEnv:{value:null},uEnvAmt:{value:0}}),vertexShader:`
      attribute vec3 aTan; attribute float aFoam;
      varying vec3 vW, vN, vT; varying vec2 vUv; varying float vFoam;
      void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vT = normalize(mat3(modelMatrix) * aTan); vUv = uv; vFoam = aFoam; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`${eh}
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
      }`});return nh.push(t),t}function ji(i,e,t,n){let s=i.length,r=new Float32Array(s*6),a=new Float32Array(s*6),o=new Float32Array(s*6),l=new Float32Array(s*4),c=new Float32Array(s*2),d=[],f=0,h=new B,m=new B,g=new B,b=new B(0,1,0);for(let u=0;u<s;u++){let y=i[Math.max(0,u-1)],v=i[Math.min(s-1,u+1)];h.copy(v).sub(y).normalize(),u>0&&(f+=i[u].distanceTo(i[u-1])),n?m.copy(n):m.crossVectors(b,h).normalize(),g.crossVectors(h,m).normalize(),g.y<0&&!n&&g.negate();let _=(typeof e=="function"?e(u,u/(s-1)):e)/2,E=t?t(u,u/(s-1)):0;for(let S=0;S<2;S++){let T=S?1:-1,x=(u*2+S)*3;r[x]=i[u].x+m.x*_*T,r[x+1]=i[u].y+m.y*_*T,r[x+2]=i[u].z+m.z*_*T,a[x]=g.x,a[x+1]=g.y,a[x+2]=g.z,o[x]=h.x,o[x+1]=h.y,o[x+2]=h.z,l[(u*2+S)*2]=f,l[(u*2+S)*2+1]=S,c[u*2+S]=E}if(u<s-1){let S=u*2;d.push(S,S+1,S+2,S+1,S+3,S+2)}}let p=new St;return p.setAttribute("position",new He(r,3)),p.setAttribute("normal",new He(a,3)),p.setAttribute("aTan",new He(o,3)),p.setAttribute("uv",new He(l,2)),p.setAttribute("aFoam",new He(c,1)),p.setIndex(d),p.userData.n=s,p}function Ad(i){return ui(i,{speed:.05,amp:.45,scale:.1,across:.1,deep:"#0c3c66",shallow:"#2f7f95",opacity:1,clear:1,edgeFoam:0,transparent:!1,depthWrite:!0})}function Cd(i){return ui(i,{speed:.07,amp:.7,scale:.05,across:.05,deep:"#0a4a78",shallow:"#2aa3b8",opacity:1,clear:1,edgeFoam:0,foam:1.2,transparent:!1,depthWrite:!0})}function le(i,e,t,n=.25){let s=new mn(i,e,t),r=s.attributes.uv,a=[[t,e],[t,e],[i,t],[i,t],[i,e],[i,e]];for(let o=0;o<6;o++)for(let l=0;l<4;l++){let c=o*4+l;r.setXY(c,r.getX(c)*a[o][0]*n,r.getY(c)*a[o][1]*n)}return s}function it(i,e,t,n=16,s=.25){let r=new Vt(i,e,t,n,1),a=r.attributes.uv,o=Math.PI*2*Math.max(i,e);for(let l=0;l<a.count;l++)a.setXY(l,a.getX(l)*o*s,a.getY(l)*t*s);return r}function re(i,e=0,t=0,n=0,s=0,r=0,a=0){return s&&i.rotateX(s),r&&i.rotateY(r),a&&i.rotateZ(a),i.translate(e,t,n),i}function Ke(i){let e=i.map(n=>n.index?n.toNonIndexed():n);e.forEach(n=>{for(let s of Object.keys(n.attributes))s!=="position"&&s!=="normal"&&s!=="uv"&&n.deleteAttribute(s);if(!n.attributes.uv){let s=n.attributes.position.count;n.setAttribute("uv",new n.attributes.position.constructor(new Float32Array(s*2),2))}});let t=ol(e,!1);return e.forEach(n=>n.dispose()),t}var di=(i,e)=>[Math.cos(e)*i,Math.sin(e)*i];function Rd(i,e,t,n,s=0,r="trap",a=0,o=0){let l=new xn,c=Math.PI*2/i;for(let f=0;f<i;f++){let h=f*c;(r==="saw"?[di(t,h),di(e,h+c*.08),di(t,h+c*.92-1e-4)]:[di(t,h),di(e,h+c*.2),di(e,h+c*.46),di(t,h+c*.66)]).forEach((g,b)=>f===0&&b===0?l.moveTo(g[0],g[1]):l.lineTo(g[0],g[1]))}let d=new wn;d.absarc(0,0,n,0,Math.PI*2,!0),l.holes.push(d);for(let f=0;f<s;f++){let h=(f+.14)/s*Math.PI*2,m=(f+.86)/s*Math.PI*2,g=new wn,b=6;for(let p=0;p<=b;p++){let u=di(o,h+(m-h)*p/b);p?g.lineTo(u[0],u[1]):g.moveTo(u[0],u[1])}for(let p=b;p>=0;p--){let u=di(a,h+(m-h)*p/b);g.lineTo(u[0],u[1])}l.holes.push(g)}return l}function ul(i,e,t=.02,n=24){let s=new ai(i,{depth:e,bevelEnabled:t>0,bevelSize:t,bevelThickness:t,bevelSegments:1,curveSegments:n});return s.translate(0,0,-e/2),s}var fi=7.8,an=7,ih=-15,Js=-1.6,es=7.8,Id=2.2,Xt={x0:-9,x1:2.4,z0:-7,z1:3.5,floorY:7};function d_(i,e){let t=(n,s={})=>new ft(Object.assign({map:n.map,normalMap:n.normal,roughnessMap:n.rough,roughness:1,metalness:0,normalScale:{x:1,y:1}},s));return{concrete:t(i.concrete,{color:14999768}),concreteDark:t(i.concrete,{color:10131086}),stone:t(i.stone,{color:13617080}),wood:t(i.wood,{color:14730400}),woodDark:t(i.wood,{color:9071180}),roof:t(i.wood,{color:7035466}),iron:t(i.iron,{color:16777215,metalness:.85,roughness:1}),brass:new ft({color:14067016,metalness:.9,roughness:.32}),steel:new ft({color:9279910,metalness:.9,roughness:.38}),paintRed:new ft({color:11680302,metalness:.2,roughness:.55}),dark:new ft({color:724242,roughness:1}),glass:new ft({color:16769184,emissive:16758858,emissiveIntensity:0,roughness:.4})}}function At(i,e,t=!0,n){let s=new We(i,e);return s.castShadow=t,s.receiveShadow=!0,n&&(s.name=n),s}function Pd(i,e,t){let n=new xn;t.forEach((r,a)=>a?n.lineTo(r[0],r[1]):n.moveTo(r[0],r[1]));let s=new ai(n,{depth:e-i,bevelEnabled:!0,bevelSize:.12,bevelThickness:.12,bevelSegments:1,curveSegments:4});return s.rotateY(Math.PI/2),s.translate(i,0,0),s.attributes.uv.array.forEach((r,a,o)=>o[a]=r*.22),s}function sh(i,e,t,n,s){return At(Pd(e,t,n),s,!0,"dam")}var jt=[-3,0,3.2,6,8.2,10.2];function f_(i,e){if(!e)return Ld(i);let t=[[17.6,-7],[17.6,i]];for(let n=4;n>=0;n--)t.push([17.6-e[n],n===4?i:jt[n+1]],[17.6-e[n],jt[n]]);return t.push([17.6-e[0],-7]),t}var Ld=i=>[[17.6,-7],[17.6,i],[14,i],[13.7,9.4],[12.9,6.8],[11.8,3.6],[10.2,0],[8.4,-3],[6.9,-7]],p_=()=>{let i=[[17.6,-7],[17.6,zn],[14.4,zn]],e=14.4,t=zn;for(let n=0;n<6;n++){let s=t-1.5;i.push([e-.15,t],[e-.15,s]),t=s,e-=.62,i.push([e,s])}return i.push([8.6,-2.2],[6.9,-7]),i},m_=[[17.6,-7],[17.6,es],[13.6,es],[12.9,6.8],[11.8,3.6],[10.2,0],[8.4,-3],[6.9,-7]];function Dd(i,e,t){let n=d_(i,e),s=new at,r={root:s,M:n,parts:{}},a=e===0,o=a?n.wood:n.concrete,l=new at;l.name="damGroup";let c=[[-22,-16],[-9,5.3],[8.7,22]].map(k=>{let Y=sh(n,k[0],k[1],Ld(hi),n.concrete);return Y.userData.x0=k[0],Y.userData.x1=k[1],Y});l.add(c[0],sh(n,-16,-9,p_(),n.concrete),c[1],sh(n,5.3,8.7,m_,n.concreteDark),c[2]),r.rebuildDam=k=>c.forEach(Y=>{let se=Y.geometry;Y.geometry=Pd(Y.userData.x0,Y.userData.x1,f_(hi,k)),se.dispose()});let d=[];d.push(re(le(14.2,.8,.35),-15,hi+.4,-17.4)),d.push(re(le(26.8,.8,.35),8.6,hi+.4,-17.4)),l.add(At(Ke(d),n.concrete));let f=[];for(let k=-21;k<=21;k+=2.1)k>4.4&&k<9.6||f.push(re(it(.04,.04,1,5),k,hi+.5,-14.45));f.push(re(it(.035,.035,14,5),-14.5,hi+1,-14.45,0,0,Math.PI/2),re(it(.035,.035,11.5,5),15.5,hi+1,-14.45,0,0,Math.PI/2)),l.add(At(Ke(f),n.steel,!1));let h=[];for(let k=0;k<4;k++){let Y=-4+k*7.4;Y>4&&Y<10||h.push(re(le(1.1,.9,.5),Y,5.6,-13.05,-.38))}h.push(re(le(1.1,.9,.5),15,5.6,-13.05,-.38)),l.add(At(Ke(h),n.dark,!1)),r.parts.dam=l,s.add(l);let m=[];[[4.75,-17.2],[4.75,-15.4],[9.25,-17.2],[9.25,-15.4]].forEach(k=>m.push(re(le(.5,4.2,.5),k[0],hi+2.1-.2,k[1]))),m.push(re(le(5.4,.3,2.6),7,14.1,-16.3),re(le(5.4,.25,.45),7,12.4,-17.2),re(le(5.4,.25,.45),7,12.4,-15.4));let g=new at;g.add(At(Ke(m),n.concrete)),g.name="gateHouse";let b=[];for(let k=-2;k<=2;k++)b.push(re(it(.03,.03,.9,5),7+k*1.3,14.7,-17.5),re(it(.03,.03,.9,5),7+k*1.3,14.7,-15.1));b.push(re(it(.03,.03,5.4,5),7,15.15,-17.5,0,0,Math.PI/2),re(it(.03,.03,5.4,5),7,15.15,-15.1,0,0,Math.PI/2)),g.add(At(Ke(b),n.steel,!1));let p=At(le(1.2,.8,.9,.3),n.paintRed,!0);p.position.set(7,14.65,-16.3),g.add(p);let u=new at;u.position.set(7,14.65,-15.75),u.add(At(new Yi(.34,.035,8,22),n.steel,!1));for(let k=0;k<4;k++){let Y=At(it(.025,.025,.68,5),n.steel,!1);Y.rotation.z=k*Math.PI/4,u.add(Y)}u.add(At(it(.07,.07,.12,10),n.brass,!1)),u.children[u.children.length-1].rotation.x=Math.PI/2,g.add(u),r.parts.handwheel=u;let y=new at;y.name="gate";let v=[re(le(3,3.2,.14,.4),0,0,0)];for(let k=0;k<3;k++)v.push(re(le(3,.16,.34,.4),0,-1.1+k*1.1,.2));v.push(re(le(.1,3.2,.34,.4),-1.45,0,.2),re(le(.1,3.2,.34,.4),1.45,0,.2)),y.add(At(Ke(v),n.steel));let _=[];[-1.1,1.1].forEach(k=>_.push(re(it(.06,.06,8,8),k,4,0)));let E=At(Ke(_),n.iron,!1);y.add(E);let S=At(Ke([re(le(.32,.24,.3),-1.1,1.7,0),re(le(.32,.24,.3),1.1,1.7,0)]),n.brass,!1);y.add(S),y.position.set(7,es+1.6,-16.35),g.add(y),r.parts.gate=y,r.parts.gateHouse=g,s.add(g),g.add(At(Ke([re(le(.18,6.4,.5),5.2,es+3.2,-16.35),re(le(.18,6.4,.5),8.8,es+3.2,-16.35)]),n.steel,!1));let T=Js-ih,x=(ih+Js)/2,M=new at;M.name="flume";let A=[re(le(3.5,.4,T),an,fi-.2,x),re(le(.32,1.05,T),an-1.55,fi+.52,x),re(le(.32,1.05,T),an+1.55,fi+.52,x)];for(let k=ih+1;k<Js;k+=2.4)A.push(re(le(3.9,.14,.2),an,fi+1.1,k));M.add(At(Ke(A),o));let I=[];[-11.2,-7.6,-4.2].forEach(k=>{I.push(re(le(2.5,7.6,1.3,.3),an,3.6,k),re(le(3.3,.45,1.7,.3),an,7.45,k),re(le(3,.6,1.5,.3),an,-.1,k))}),M.add(At(Ke(I),n.stone));let R=[];[-11.2,-7.6,-4.2].forEach(k=>{R.push(re(le(.16,4.2,.16),an-1.2,5,k+.9,0,0,.5),re(le(.16,4.2,.16),an+1.2,5,k+.9,0,0,-.5))}),M.add(At(Ke(R),n.woodDark,!0)),M.add(At(re(le(2.6,.12,.7),an,fi-.02,Js+.28,.12),n.iron,!0)),r.parts.flume=M,s.add(M);let L=[re(le(.6,1.9,9.6,.3),ct.x-2,.05,1.7),re(le(.6,1.9,9.6,.3),ct.x+2,.05,1.7),re(le(4.6,.4,9.6,.3),ct.x,-.95,1.7)];L.push(re(le(1.4,3.8,1.6,.3),10.3,1.9,ct.z),re(le(1.4,3.8,1.6,.3),3.1,1.9,ct.z));let P=At(Ke(L),n.stone);r.parts.tailrace=P,s.add(P);let F=new at;F.name="mill";let{x0:U,x1:z,z0:q,z1:W,floorY:Z}=Xt,j=z-U,xe=W-q,he=(U+z)/2,Xe=(q+W)/2,qe=[re(le(j+.6,.7,xe+.6,.3),he,.35,Xe),re(le(j,7,.7,.3),he,3.5,q+.35),re(le(.7,7,xe,.3),U+.35,3.5,Xe)];F.add(At(Ke(qe),n.stone));let nt=[];[[U+.4,q+.4],[z-.4,q+.4],[U+.4,W-.4],[z-.4,W-.4],[he,q+.4],[he,W-.4]].forEach(k=>{nt.push(re(le(.42,12.4,.42),k[0],6.2+.4,k[1]))}),[3.2,Z,11.6].forEach(k=>{nt.push(re(le(j,.38,.38),he,k,q+.4),re(le(j,.38,.38),he,k,W-.4),re(le(.38,.38,xe),U+.4,k,Xe),re(le(.38,.38,xe),z-.4,k,Xe))});for(let k=U+1.2;k<z;k+=1.75)nt.push(re(le(.28,.4,xe-.6),k,Z-.3,Xe));F.add(At(Ke(nt),n.woodDark));let ee=[re(le(j-.2,.22,xe-.2,.3),he,Z-.04,Xe)];F.add(At(Ke(ee),n.wood));let ie=[re(le(j,4.6,.25,.3),he,Z+2.3,q+.4),re(le(.25,4.6,xe,.3),U+.4,Z+2.3,Xe)];F.add(At(Ke(ie),n.wood));let de=q-1,ze=q+xe*.74,fe=(ze-de)/2,De=.55,Re=fe*Math.tan(De),N=fe/Math.cos(De),H=11.9;return[-1,1].forEach(k=>{let Y=At(le(j+2.4,.3,N+.5,.3),n.roof);Y.rotation.x=k*De,Y.position.set(he,H+Re/2+.15,de+fe+k*fe/2),F.add(Y)}),F.add(At(le(j+2.4,.22,.34,.3),n.woodDark),At(re(le(j+2.4,.22,.34,.3),0,0,0),n.woodDark)),F.children[F.children.length-2].position.set(he,H+Re+.2,de+fe),F.children[F.children.length-1].visible=!1,r.parts.mill=F,s.add(F),r}function Nd(i){let e=new at,t=Di(5),n=new qi(1,1),s=n.attributes.position;for(let l=0;l<s.count;l++){let c=.82+.3*Math.sin(s.getX(l)*3.1+s.getY(l)*2.3+s.getZ(l)*4.7);s.setXYZ(l,s.getX(l)*c,s.getY(l)*c*.78,s.getZ(l)*c)}n.computeVertexNormals();let r=[];for(let l=0;l<46;l++){let c=t()*Math.PI*2,d=(t()-.5)*70,f=-9+t()*52;d>3.5&&d<10.5&&f<6||d>Xt.x0-1&&d<Xt.x1+1&&f>Xt.z0-1&&f<Xt.z1+1||r.push([d,f,.35+t()*t()*1.8,c])}let a=new ri(n,new ft({color:9077112,roughness:.95,flatShading:!1}),r.length),o=new Ot;return r.forEach((l,c)=>{o.position.set(l[0],Qt(l[0],l[1])+l[2]*.12,l[1]),o.scale.set(l[2],l[2],l[2]*(.8+c%3*.15)),o.rotation.set(0,l[3],0),o.updateMatrix(),a.setMatrixAt(c,o.matrix)}),a.castShadow=!0,a.receiveShadow=!0,e.add(a),e}function rh(){try{let i=navigator,e=i.deviceMemory||4,t=i.hardwareConcurrency||4;if(e<=2||t<=4)return"low";if(e>=8&&t>=8)return"high"}catch{}return"medium"}function Ud(i,e={}){let t=e.quality||rh(),n=new il({canvas:i,antialias:t!=="low",alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!!e.preserve}),s=[];i.addEventListener("webglcontextlost",u=>{u.preventDefault(),s.forEach(y=>y())}),n.outputColorSpace=Jt,n.toneMapping=Fr,n.toneMappingExposure=1.05,n.shadowMap.enabled=t!=="low",n.shadowMap.type=ho;let r=new Gi,a=.003;r.fog=new dr(Kr.getHex(),a),r.background=Kr.clone();let o=gd(t==="low"?2:4,t==="low"?256:512),l=xd();r.add(l),r.environment=_d(n,l),r.environmentIntensity=.55;let c=new Dr(16766632,3.1);if(c.position.copy($r).multiplyScalar(90).add(new B(4,3,-4)),c.target.position.set(4,3,-4),r.add(c,c.target),n.shadowMap.enabled){let u=t==="high"?2048:1024;c.castShadow=!0,c.shadow.mapSize.set(u,u);let y=c.shadow.camera;y.left=-30,y.right=30,y.top=26,y.bottom=-26,y.near=20,y.far=200,c.shadow.bias=-4e-4,c.shadow.normalBias=.04}r.add(new Rr(10204392,4866100,.85));let d=new $t(52,1,.5,1800),f=Td(o,a),h={renderer:n,scene:r,camera:d,sun:c,T:o,shared:f,q:t,sky:l,lost:s},m=Md(o,t);r.add(m),h.terrain=m,r.add(wd(m.material,t));let g=Sd(Ad(f));r.add(g),h.lake=g;let b=Ed(Cd(f));r.add(b),h.sea=b,h.forest=bd(t==="low"?260:t==="high"?700:480,(u,y)=>u>37&&u<54&&y>-72&&y<-30||u>-9&&u<6&&y>8&&y<24||u>-19&&u<-8&&y>-9&&y<4),r.add(h.forest);let p=Dd(o,e.tier||0,t);return r.add(p.root),h.arch=p,r.add(Nd(p.M)),h}function Fd(i,e,t,n){let s=i.renderer;s.setPixelRatio(n),s.setSize(e,t,!1),i.camera.aspect=e/t,i.camera.updateProjectionMatrix()}function Od(i,e){let{renderer:t,scene:n,q:s,sky:r}=i,a=s==="low"?128:256,o=e.map(f=>f.visible);e.forEach(f=>f.visible=!1),i.lake.visible=!1,i.sea.visible=!1,r.material.uniforms.uLin.value=1;let l=(f,h,m)=>{let g=new Xs(a,{type:vn,generateMipmaps:!0,minFilter:En}),b=new Fs(1,3e3,g);return b.position.set(f,h,m),n.add(b),b.update(t,n),n.remove(b),g},c=l(0,13,-34),d=l(6,4,6);r.material.uniforms.uLin.value=0,i.lake.visible=!0,i.sea.visible=!0,e.forEach((f,h)=>f.visible=o[h]),nh.forEach(f=>{f.uniforms.uEnv.value=(f===i.lake.material?c:d).texture,f.uniforms.uEnvAmt.value=1}),i.reflections=[c,d]}var _t=(i,e,t=!0,n)=>{let s=new We(i,e);return s.castShadow=t,s.receiveShadow=!0,n&&(s.name=n),s};function dl(i,e,t,n,s,r,a=0){let o=Math.hypot(t-i,n-e),l=le(s,o,r,.5),c=Math.atan2(n-e,t-i);return l.rotateX(c),l.translate(a,(i+t)/2,(e+n)/2),l}var $n=(i,e)=>[i*Math.cos(e),i*Math.sin(e)],on={crownR:1.05,crownN:36,lanternR:.55,lanternN:19,pitX:.9,lanternX:.09},Ze={y:1.2,z:2.2,blade:3.45,arborX0:2.7,arborX1:5.6,fastX:4.62,looseX:5.18,pulleyR:.27},fl={x:4.9,r:.78};function Bd(i,e,t,n){let s=new at,r={root:s},a=ct.x,o=ct.y,l=ct.z,c=ct.r,d=new at;d.position.set(a,o,l),r.drive=d;let f=[],h=[],m=[],g=20,b=.62,p=.3,u=1.2,y=(Re,N,H,k)=>{let Y=new xn;Y.absarc(0,0,Re,0,Math.PI*2,!1);let se=new wn;se.absarc(0,0,N,0,Math.PI*2,!0),Y.holes.push(se);let me=ul(Y,H,.02,48);return me.rotateY(Math.PI/2),me.translate(k,0,0),me};[-u,u].forEach(Re=>{f.push(y(c+.02,c-p,.16,Re),y(c-.62,c-.78,.12,Re))});for(let Re=-1;Re<=1;Re+=2)for(let N=0;N<8;N++){let H=N*Math.PI/4+(Re>0?Math.PI/8:0),k=$n(b*.8,H),Y=$n(c-p+.05,H);f.push(dl(k[0],k[1],Y[0],Y[1],.2,.16,Re*(u-.25)))}let v=Math.PI*2/g;for(let Re=0;Re<g;Re++){let N=Re*v,H=$n(c-.62,N),k=$n(c+.03,N),Y=$n(c-.62,N+v*0),se=$n(c-.02,N+v*.96);f.push(dl(H[0],H[1],k[0],k[1],2*u-.1,.07),dl(Y[0],Y[1],se[0],se[1],2*u-.1,.06))}f.push(re(it(b,b,2*u-.1,20),0,0,0,0,0,Math.PI/2)),[-.95,.95].forEach(Re=>h.push(re(it(b+.04,b+.04,.12,20),Re,0,0,0,0,Math.PI/2))),[-u,u].forEach(Re=>{for(let N=0;N<g;N+=2){let H=N*v,k=$n(c-.34,H);h.push(re(le(.05,.1,.1,1),Re+(Re>0?.1:-.1),k[0],k[1],H))}}),r.wheelWood=_t(Ke(f),i.wood,!0,"wheelWood"),d.add(r.wheelWood),d.add(_t(Ke(h),i.iron,!0));let _=-.2-a,E=9.9-a;if(d.add(_t(re(it(.17,.17,E-_,14),(_+E)/2,0,0,0,0,Math.PI/2),i.iron,!0,"axle")),[3.1-a,10.3-a].forEach(Re=>m.push(re(it(.2,.2,.9,14),Re,0,0,0,0,Math.PI/2))),d.add(_t(Ke(m),i.brass,!0)),n>0){let Re=[];for(let N=0;N<n;N++)Re.push(re(it(b+.1+N*.03,b+.1+N*.03,.09,20),1.15+.14*N,0,0,0,0,Math.PI/2),re(it(b+.1+N*.03,b+.1+N*.03,.09,20),-1.15-.14*N,0,0,0,0,Math.PI/2));d.add(_t(Ke(Re),i.brass,!0))}{let Re=on.pitX-a,N=new xn;N.absarc(0,0,1.22,0,Math.PI*2,!1);let H=new wn;H.absarc(0,0,.22,0,Math.PI*2,!0),N.holes.push(H);for(let se=0;se<6;se++){let me=(se+.18)/6*Math.PI*2,Ae=(se+.82)/6*Math.PI*2,Le=new wn;for(let Be=0;Be<=6;Be++){let O=$n(1,me+(Ae-me)*Be/6);Be?Le.lineTo(O[0],O[1]):Le.moveTo(O[0],O[1])}for(let Be=6;Be>=0;Be--){let O=$n(.42,me+(Ae-me)*Be/6);Le.lineTo(O[0],O[1])}N.holes.push(Le)}let k=ul(N,.24,.02,40);k.rotateY(Math.PI/2),k.translate(Re,0,0);let Y=[];for(let se=0;se<on.crownN;se++){let me=se*Math.PI*2/on.crownN,Ae=$n(on.crownR,me),Le=le(.38,.17,.13,1);Le.rotateX(me+Math.PI/2),Le.translate(Re-.27,Ae[0],Ae[1]),Y.push(Le)}d.add(_t(k,i.wood,!0,"pitWheel"),_t(Ke(Y),i.woodDark,!0,"cogs"))}d.add(_t(re(it(fl.r,fl.r,1.15,28),fl.x-a+.2,0,0,0,0,Math.PI/2),i.iron,!0,"axlePulley")),s.add(d);let S=new at,T=on.lanternX,x=l,M=o+on.crownR;r.lantern=S,S.position.set(T,0,x);let A=[],I=on.lanternR;A.push(re(it(I+.06,I+.06,.1,24),0,M-.34,0),re(it(I+.06,I+.06,.1,24),0,M+.34,0));for(let Re=0;Re<on.lanternN;Re++){let N=Re*Math.PI*2/on.lanternN;A.push(re(it(.05,.05,.68,6),Math.cos(N)*I,M,Math.sin(N)*I))}S.add(_t(Ke(A),i.woodDark,!0,"lanternStaves")),S.add(_t(re(it(.13,.13,5.4,10),0,M+2.4,0),i.iron,!0,"shaft"));let R=Xt.floorY+.25,L=_t(re(it(1,1,.3,40),0,R+.62,0),new ft({map:e.millstone.map,color:16777215,roughness:.95}),!0,"runnerStone");S.add(L);let P=_t(re(it(1.04,1.04,.32,40),0,R+.2,0),i.stone,!0);r.bedstone=P,S.add(P),S.add(_t(re(it(.16,.16,.5,10),0,R+1,0),i.iron,!0)),S.add(_t(le(2.2,.08,.1,1),i.iron,!0)),S.children[S.children.length-1].position.set(0,R+.82,0),s.add(S);let F=[],U=_t(new Vt(1.32,1.32,.62,40,1,!0),new ft({map:e.wood.map,normalMap:e.wood.normal,color:13215612,side:sn,roughness:.8}),!0);U.position.set(T,R+.45,x),s.add(U),[[-.9,-.9],[.9,-.9],[-.9,.9],[.9,.9]].forEach(Re=>F.push(re(le(.14,2.4,.14,1),T+Re[0],R+1.6,x+Re[1])));let z=new Vt(.2,.95,.9,4,1,!0);z.rotateY(Math.PI/4),z.translate(T,R+3.15,x),s.add(_t(Ke(F),i.woodDark),_t(z,new ft({map:e.wood.map,color:12096616,side:sn,roughness:.85}),!0));let q=_t(dl(R+.45,0,R-.65,1.2,.34,.06),i.wood,!0);q.position.set(T+1.15,0,x+.3),q.rotation.y=0,s.add(q);let W=_t(le(.7,.9,.5,1),new ft({color:14207395,roughness:1}),!0);W.position.set(T+1.15,Xt.floorY+.5,x+1.6),s.add(W);let Z=_t(new Vt(.05,.38,.5,14),new ft({color:16052194,roughness:1}),!1);Z.position.set(T+1.15,Xt.floorY+.16,x+2.2),Z.scale.y=.01,r.flour=Z,s.add(Z);let j=new at;j.position.set(T-1.7,Xt.floorY+.12,x+1.5);let xe=_t(le(.14,1.9,.14,1),i.woodDark,!0,"lever");xe.position.y=.95,j.add(xe);let he=_t(new Vt(.16,.16,.2,12),i.paintRed,!0,"leverKnob");he.rotation.z=Math.PI/2,he.position.y=1.95,j.add(he),j.add(_t(le(.5,.3,.3,1),i.stone,!0)),j.children[j.children.length-1].position.set(0,0,0),r.lever=j,s.add(j);let Xe=new at;Xe.name="sawmill",r.sawGroup=Xe,s.add(Xe);let qe=new at;qe.position.set(0,Ze.y,Ze.z),r.arbor=qe,qe.add(_t(re(it(.1,.1,Ze.arborX1-Ze.arborX0+.8,10),(Ze.arborX0+Ze.arborX1)/2,0,0,0,0,Math.PI/2),i.iron,!0)),qe.add(_t(re(it(Ze.pulleyR,Ze.pulleyR,.46,24),Ze.fastX,0,0,0,0,Math.PI/2),i.iron,!0));let nt=_t(re(it(Ze.pulleyR,Ze.pulleyR,.46,24),Ze.looseX,0,0,0,0,Math.PI/2),i.steel,!0);r.loose=nt,qe.add(nt);let ee=Rd(52,1,.9,.12,0,"saw"),ie=ul(ee,.035,0,24);ie.rotateY(Math.PI/2),ie.translate(Ze.blade,0,0),qe.add(_t(ie,i.steel,!0,"sawBlade"),_t(re(it(.3,.3,.08,20),Ze.blade+.05,0,0,0,0,Math.PI/2),i.iron,!0)),Xe.add(qe);let de=[re(le(.4,1.7,.4,1),Ze.arborX0-.2,.85,Ze.z-.4),re(le(.4,1.7,.4,1),Ze.arborX1+.1,.85,Ze.z-.4),re(le(.4,1.7,.4,1),Ze.arborX0-.2,.85,Ze.z+.4),re(le(.4,1.7,.4,1),Ze.arborX1+.1,.85,Ze.z+.4)];de.push(re(le(Ze.arborX1-Ze.arborX0+.8,.22,1.3,1),(Ze.arborX0+Ze.arborX1)/2,1.78-.9+0,Ze.z)),Xe.add(_t(Ke(de),i.woodDark));let ze=[re(le(9,.16,.2,1),5,.62,Ze.z-.5),re(le(9,.16,.2,1),5,.62,Ze.z+.5)];Xe.add(_t(Ke(ze),i.iron));let fe=_t(it(.38,.4,2.6,14),new ft({map:e.wood.map,normalMap:e.wood.normal,color:11569756,roughness:.9}),!0,"log");fe.rotation.z=Math.PI/2,fe.position.set(6,1.05,Ze.z),r.log=fe,Xe.add(fe);let De=_t(le(1.4,.16,.7,1),i.wood,!0);return De.visible=!1,r.sawn=De,Xe.add(De),r.beltTex=e.belt.map.clone(),r.beltTex.wrapS=r.beltTex.wrapT=Si,r.beltTex.needsUpdate=!0,r.belt=g_(new B(0,o,l),fl.r+.02,new B(0,Ze.y,Ze.z),Ze.pulleyR+.02,.4,r.beltTex),r.belt.position.x=Ze.fastX,Xe.add(r.belt),r}function g_(i,e,t,n,s,r){let a=t.y-i.y,o=t.z-i.z,l=Math.hypot(a,o),c=Math.atan2(o,a),d=Math.acos((e-n)/l),f=[];for(let _=0;_<=24;_++){let E=c+d+(Math.PI*2-2*d)*_/24;f.push([i.y+e*Math.cos(E),i.z+e*Math.sin(E)])}for(let _=0;_<=24;_++){let E=c-d+2*d*_/24;f.push([t.y+n*Math.cos(E),t.z+n*Math.sin(E)])}let h=f.length,m=[],g=[],b=[],p=[],u=0;for(let _=0;_<h;_++){let E=f[_],S=f[(_+1)%h],T=f[(_+h-1)%h];_&&(u+=Math.hypot(E[0]-T[0],E[1]-T[1]));let x=S[0]-T[0],M=S[1]-T[1],A=Math.hypot(x,M)||1,I=M/A,R=-x/A;for(let F=0;F<2;F++)m.push((F?1:-1)*s/2,E[0],E[1]),p.push(0,I,R),g.push(F,u/1.2);let L=_*2,P=(_+1)%h*2;b.push(L,L+1,P,L+1,P+1,P)}let y=new St;y.setAttribute("position",new He(m,3)),y.setAttribute("normal",new He(p,3)),y.setAttribute("uv",new He(g,2)),y.setIndex(b);let v=new We(y,new ft({map:r,color:16777215,roughness:.7,side:sn}));return v.castShadow=!0,v.receiveShadow=!0,v.name="belt",v}var pl=20,yn=(i,e,t)=>new B(i,e,t);function zd(i,e){let t=new at,n=i.shared,s={},r=(u,y,v,_,E)=>{let S=ji(u,y,v,E),T=new We(S,ui(n,_));return T.frustumCulled=!1,T.renderOrder=3,t.add(T),T};{let u=[];for(let y=0;y<=10;y++)u.push(yn(an,fi+.04,xt(-16.35,-13.4,y/10)));s.gateOut=r(u,2.9,y=>1-y/12,{speed:1.4,amp:1.1,scale:.35,stretch:.55,shallow:"#7ad2d6",deep:"#2a86a8",opacity:.9,clear:.2,edgeFoam:.5})}{let u=[];for(let y=0;y<=30;y++)u.push(yn(an,fi+.06,xt(-13.4,Js+.15,y/30)));s.flume=r(u,2.5,y=>y<6?.85-y*.13:.1+.08*Math.sin(y),{speed:1,amp:.9,scale:.3,stretch:.5,shallow:"#5cc0cc",deep:"#1f7096",opacity:.88,clear:.25,edgeFoam:.55})}{let u=[];for(let y=0;y<=12;y++){let v=y/12;u.push(yn(an,xt(fi+.08,ct.y+ct.r+.05,v),ct.z-.55+.26*v*v))}s.jet=r(u,2.3,y=>.25+y/20,{speed:3.2,amp:1.3,scale:.5,stretch:.7,shallow:"#bfeaf0",deep:"#5fb6d0",opacity:.9,clear:.1,edgeFoam:.8,white:.25},new B(1,0,0))}{let u=[];for(let y=0;y<=20;y++)u.push(yn(ct.x,.32-0*y,xt(-2.9,6.2,y/20)));s.tail=r(u,3.45,y=>y<7?.95:.35,{speed:1,amp:1.2,scale:.28,stretch:.45,shallow:"#7fc7cc",deep:"#2d7fa0",opacity:.9,clear:.2,edgeFoam:.7})}{let u=[];for(let y=0;y<=80;y++){let v=xt(6,150,Math.pow(y/80,1.15));u.push(yn(cl(v),th(v)+.02,v))}s.river=r(u,(y,v)=>xt(4.4,22,Math.pow(v,1.6)),y=>.25+.45*Math.abs(Math.sin(y*.8))*(y<30?1:.4),{speed:.9,amp:1,scale:.12,stretch:.3,across:2.4,shallow:"#69b4b8",deep:"#216e8d",opacity:.92,clear:.4,edgeFoam:.9})}{let u=[],y=14.4,v=zn;u.push(yn(-12.5,v+.06,-y-1.2),yn(-12.5,v+.06,-y));for(let _=0;_<6;_++){let E=v-1.5;u.push(yn(-12.5,v+.07,-(y-.15)),yn(-12.5,E+.5,-(y-.15)+.05),yn(-12.5,E+.07,-(y-.15)+.1)),v=E,y-=.62,u.push(yn(-12.5,E+.07,-y))}s.spill=r(u,6.2,_=>_%4===3?.9:.4,{speed:2.4,amp:1.4,scale:.4,stretch:.7,shallow:"#cfeff2",deep:"#6dbdd6",opacity:.88,clear:.1,edgeFoam:.9,white:.2},new B(1,0,0))}{let u=new Ls(Qi.map(v=>yn(v[0],-.22,v[1])),!1,"catmullrom",.5),y=u.getPoints(54);y.forEach((v,_)=>v.y=xt(-.22,.08,_/y.length)),s.stream=r(y,(v,_)=>xt(3.4,4.8,_),v=>v<12?1:.35,{speed:1.2,amp:1.2,scale:.2,stretch:.4,shallow:"#7cc8cc",deep:"#2a7d9b",opacity:.92,clear:.3,edgeFoam:.8})}{let u=hl(-6,-140,60);if(u.length>8){let y=u.map(v=>yn(v[0],v[1],v[2]));s.fall=r(y,(v,_)=>xt(2.2,4.6,_),(v,_)=>.4+.5*_,{speed:2.6,amp:1.2,scale:.25,stretch:.5,across:2.2,shallow:"#dff6fa",deep:"#9fd4e6",opacity:.9,clear:.1,edgeFoam:.9,white:.4},new B(1,0,0)),s.fallBase=y[y.length-1]}}let a=new Ar({color:5814490,roughness:.08,metalness:0,transparent:!0,opacity:.88,envMapIntensity:1.6,clearcoat:.6}),o=new ri(new oi(1,12,8),a,pl);o.frustumCulled=!1,o.renderOrder=4,e.add(o),s.fill=o,s.group=t;let l=(u,y)=>{let v=u*y;return Math.floor(v)+(Math.random()<v-Math.floor(v)?1:0)},c=new gt,d=new Sn,f=new Un,h=new B,m=new B,g=Math.PI*2,b=g/pl,p={x:-12.5,y:.35,z:-8.9};return s.update=function(u,y,v,_,E,S,T){let x=je(u.Qg/u.Qref,0,1),M=je(u.spill/u.Qref,0,1),A=S?0:1,I=T,R=(F,U)=>{let z=F.material.uniforms;for(let q in U)z[q].value=U[q]};if(s.gateOut.visible=s.flume.visible=x>.03&&I>.4,s.flume.visible){let F=.14+.62*Math.pow(x,.66);s.flume.position.y=F,s.gateOut.position.y=F*.7,R(s.flume,{uSpeed:A*(.5+2.4*x),uFlow:.35+x*.65,uOpacity:.55+.35*Math.min(1,x*3)}),R(s.gateOut,{uSpeed:A*(1.2+3.2*x),uFlow:.5+x*.5,uOpacity:.55+.35*Math.min(1,x*3)})}s.jet.visible=x>.04&&I>.5,s.jet.visible&&(s.jet.scale.x=je(.35+.7*Math.sqrt(x),.3,1.05),R(s.jet,{uSpeed:A*(3+3*x),uFlow:x,uOpacity:.6+.3*Math.min(1,x*4)}));let L=je(u.rpm/48,0,1.2);if(s.tail.visible=I>.5,R(s.tail,{uSpeed:A*(.6+1.6*x),uFlow:.35+.65*Math.max(x,L),uFoam:.55+.9*L}),s.river.visible=I>.3,R(s.river,{uSpeed:A*.9,uFlow:.55+.25*x}),s.spill.visible=s.stream.visible=M>.02&&I>.6,s.spill.visible){let F=.35+.55*Math.min(1,M*2.2);R(s.spill,{uSpeed:A*(1.4+3*M),uFlow:.35+.65*M,uOpacity:F,uWhite:.12+.2*M}),R(s.stream,{uSpeed:A*(.7+1.6*M),uFlow:.4+.6*M,uFoam:.5+M}),s.spill.scale.x=.45+.55*Math.sqrt(M)}let P=Math.pow(x,.7);for(let F=0;F<pl;F++){let U=F*b,z=((U+_+Math.PI)%g+g)%g-Math.PI,q=0;z<-.05&&z>-2.95&&(q=z>-.5?pt(-.05,-.5,z):z>-1.5?1:1-pt(-1.5,-2.95,z)),q*=P;let W=ct.r-.3,Z=U+b*.42;f.set(-_,0,0),d.setFromEuler(f),h.set(0,W*Math.cos(Z),W*Math.sin(Z)),m.set(1.05,Math.max(1e-4,.13*q),.3*Math.max(.2,q)),c.compose(h,d,m),o.setMatrixAt(F,c)}if(o.instanceMatrix.needsUpdate=!0,E&&!S){if(s.fallBase)for(let U=l(24,y);U--;)E.mist.emit(s.fallBase.x+(Math.random()-.5)*5,s.fallBase.y+.4,s.fallBase.z+(Math.random()-.5)*2,(Math.random()-.5)*.6,.8+Math.random(),.3,3.2,3.2,.3);let F=U=>{let z=U*y;return Math.floor(z)+(Math.random()<z-Math.floor(z)?1:0)};for(let U=F(70*x*x);U--;)E.spray.emit(an+(Math.random()-.5)*1.6,ct.y+ct.r+.1,ct.z-.35+Math.random()*.3,(Math.random()-.5)*1.4,1.2+Math.random()*2,(Math.random()-.3)*1.4,.7+Math.random()*.5,.16,.55);for(let U=F(55*L*(.4+x));U--;)E.spray.emit(ct.x+(Math.random()-.5)*2.2,.5,ct.z-2.6+Math.random()*1.5,(Math.random()-.5)*1.8,1.4+Math.random()*2.2,(Math.random()-.3)*2.5,.9+Math.random()*.5,.2,.6);for(let U=F(26*L*x);U--;){let z=Math.floor(Math.random()*pl),q=-1.6-Math.random()*1.2,W=ct.y+Math.cos(q)*(ct.r-.4),Z=ct.z+Math.sin(q)*(ct.r-.4);E.spray.emit(ct.x+(Math.random()-.5)*2.2,W,Z,(Math.random()-.5)*.4,-.5,-.4,.7,.12,.5)}for(let U=F(90*M);U--;)E.mist.emit(p.x+(Math.random()-.5)*5,p.y+.2,p.z+.4+Math.random()*1.6,(Math.random()-.5)*.8,.5+Math.random()*1.2,.6+Math.random(),1.8+Math.random(),.9,.34);for(let U=F(14*x);U--;)E.mist.emit(an+(Math.random()-.5)*2,ct.y+ct.r-.6,ct.z-.3+Math.random()*.4,(Math.random()-.5)*.6,.5+Math.random(),.2,1.4,.8,.2)}},s}function Ni(i,e,t={}){let n=new St,s=new He(i*3,3).setUsage(Xr),r=new He(i,1).setUsage(Xr),a=new He(i,1).setUsage(Xr);n.setAttribute("position",s),n.setAttribute("aSize",r),n.setAttribute("aAlpha",a);let o=s.array,l=new Float32Array(i*3),c=new Float32Array(i),d=new Float32Array(i),f=new Float32Array(i),h=new Float32Array(i);for(let u=0;u<i;u++)o[u*3+1]=-999;let m=new Gt({transparent:!0,depthWrite:!1,blending:Ri,uniforms:{uColor:{value:new Te(e)},uScale:{value:400}},vertexShader:"attribute float aSize; attribute float aAlpha; varying float vA; uniform float uScale; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = clamp(aSize * uScale / -mv.z, 1.0, 56.0); vA = aAlpha; }",fragmentShader:"varying float vA; uniform vec3 uColor; void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c) * 2.0; float a = smoothstep(1.0, 0.2, d) * vA; if(a < 0.01) discard; gl_FragColor = vec4(uColor, a); }"}),g=new gr(n,m);g.frustumCulled=!1,g.renderOrder=5;let b=0,p=i;return{points:g,mat:m,setCap(u){p=Math.min(i,u)},emit(u,y,v,_,E,S,T,x,M){if(!(p<=0))for(let A=0;A<p;A++){let I=(b+A)%p;if(c[I]<=0){b=(I+1)%p,o[I*3]=u,o[I*3+1]=y,o[I*3+2]=v,l[I*3]=_,l[I*3+1]=E,l[I*3+2]=S,c[I]=T,d[I]=0,f[I]=x,h[I]=M;return}}},update(u,y=9,v=.4,_=.8){let E=n.attributes.position,S=n.attributes.aSize,T=n.attributes.aAlpha;for(let x=0;x<i;x++){if(c[x]<=0){S.array[x]!==0&&(S.array[x]=0,T.array[x]=0,o[x*3+1]=-999);continue}if(d[x]+=u,d[x]>=c[x]){c[x]=0,S.array[x]=0,T.array[x]=0,o[x*3+1]=-999;continue}let M=d[x]/c[x],A=Math.max(0,1-v*u);l[x*3]*=A,l[x*3+2]*=A,l[x*3+1]=l[x*3+1]*A-y*u,o[x*3]+=l[x*3]*u,o[x*3+1]+=l[x*3+1]*u,o[x*3+2]+=l[x*3+2]*u,S.array[x]=f[x]*(1+_*M),T.array[x]=h[x]*(1-M)*Math.min(1,M*14)}E.needsUpdate=!0,S.needsUpdate=!0,T.needsUpdate=!0},clear(){for(let u=0;u<i;u++)c[u]=0,o[u*3+1]=-999;n.attributes.position.needsUpdate=!0},dispose(){n.dispose(),m.dispose()}}}var Pt={x0:3.8,x1:10.2,z0:-25.1,z1:-17.6,gateZ:-25.6,sill:6.2,travel:2.6,cx:7};function kd(i){let{mats:e,world:t}=i,n=new at;n.name="millpond";let s=(S,T,x,M,A,I)=>re(le(S,T,x,.3),M,A,I),r=[];r.push(s(1.2,17,8.6,3.2,2.6,-21.8),s(1.2,17,8.6,10.8,2.6,-21.8)),r.push(s(2.2,17,1.2,4.3,2.6,Pt.gateZ),s(2.2,17,1.2,9.7,2.6,Pt.gateZ)),r.push(s(4,11.8,1.2,7,.3,Pt.gateZ));let a=new We(Ke(r),e.stone);a.castShadow=!0,a.receiveShadow=!0,n.add(a);let o=new at,l=[re(le(3.2,4,.14,.4),0,0,0)];for(let S=0;S<4;S++)l.push(re(le(3.2,.16,.3,.4),0,-1.5+S*1,.18));o.add(Object.assign(new We(Ke(l),e.steel),{castShadow:!0,receiveShadow:!0})),o.add(Object.assign(new We(Ke([re(it(.06,.06,7.5,8),-1.2,3.7,0),re(it(.06,.06,7.5,8),1.2,3.7,0)]),e.iron),{castShadow:!0})),o.position.set(7,Pt.sill+2,Pt.gateZ+.35),n.add(o);let c=[re(le(5.4,.28,2),7,13.4,Pt.gateZ),re(le(.5,3.4,.5),4.6,11.7,Pt.gateZ+.5),re(le(.5,3.4,.5),9.4,11.7,Pt.gateZ+.5),re(le(.5,3.4,.5),4.6,11.7,Pt.gateZ-.5),re(le(.5,3.4,.5),9.4,11.7,Pt.gateZ-.5)];n.add(Object.assign(new We(Ke(c),e.concrete),{castShadow:!0,receiveShadow:!0}));let d=Object.assign(new We(le(1.1,.7,.8,.3),e.paintRed),{castShadow:!0});d.position.set(7,13.9,Pt.gateZ),n.add(d);let f=new at;f.position.set(7,13.9,Pt.gateZ+.5),f.add(new We(new Yi(.32,.035,8,20),e.steel));for(let S=0;S<4;S++){let T=new We(it(.025,.025,.64,5),e.steel);T.rotation.z=S*Math.PI/4,f.add(T)}n.add(f);let h=new Fn(Pt.x1-Pt.x0,Pt.z1-Pt.z0,1,1);h.rotateX(-Math.PI/2);let m=h.attributes.position.count,g=h.attributes.uv,b=h.attributes.position,p=new Float32Array(m*3),u=new Float32Array(m);for(let S=0;S<m;S++)p[S*3]=1,g.setXY(S,b.getX(S)+Pt.cx,b.getZ(S));h.setAttribute("aTan",new b.constructor(p,3)),h.setAttribute("aFoam",new b.constructor(u,1));let y=ui(t.shared,{speed:.12,amp:.7,scale:.16,across:.16,deep:"#0d4a74",shallow:"#2f8aa0",opacity:1,clear:1,edgeFoam:0,transparent:!1,depthWrite:!0}),v=new We(h,y);v.position.set(Pt.cx,8.6,(Pt.z0+Pt.z1)/2),v.renderOrder=1,n.add(v);let _=[];for(let S=0;S<=10;S++)_.push(new B(7,8.6,xt(Pt.gateZ+.2,Pt.gateZ+4.6,S/10)));let E=new We(ji(_,3,S=>1-S/12),ui(t.shared,{speed:2,amp:1.2,scale:.35,stretch:.6,shallow:"#9fe0e4",deep:"#3a96b4",opacity:.9,clear:.1,edgeFoam:.6,white:.2}));return E.renderOrder=3,E.frustumCulled=!1,n.add(E),n.userData.noReflect=!1,i.scene.add(n),i.parts.millpond=n,i.parts.releaseGate=o,i.parts.releaseWheel=f,i.parts.pondSurface=v,i.extras.push(n),i.hook.push((S,T,x,M)=>{o.position.y=Pt.sill+2+S.relA*Pt.travel,f.rotation.z=S.relA*9*Math.PI,v.position.y=S.pondL;let A=je(S.Qrel/13,0,1.6);if(E.visible=A>.04&&S.resL>6.4,E.visible){E.position.y=Math.min(S.pondL,S.resL)-8.6+.04;let I=E.material.uniforms;I.uSpeed.value=M?0:1+3*A,I.uFlow.value=.4+.6*Math.min(1,A),I.uOpacity.value=.5+.4*Math.min(1,A*2)}}),n}var Nt={x0:-15.4,x1:-9.6,z0:-5.2,z1:1.6,shaftY:ct.y,shaftZ:ct.z,camX:-12.6};function Vd(i){let{mats:e,em:t}=i,n=new at;n.name="factory",n.visible=!1;let s=(M,A,I=!0)=>{let R=new We(M,A);return R.castShadow=I,R.receiveShadow=!0,R},{x0:r,x1:a,z0:o,z1:l}=Nt,c=(r+a)/2,d=(o+l)/2;n.add(s(Ke([re(le(a-r+.6,.6,l-o+.6,.3),c,.3,d),re(le(a-r,6.2,.7,.3),c,3.1,o+.35),re(le(.7,6.2,l-o,.3),r+.35,3.1,d)]),e.stone));let f=[];[[r+.4,l-.4],[a-.4,l-.4],[a-.4,o+.4]].forEach(M=>f.push(re(le(.36,6.4,.36),M[0],3.4,M[1]))),f.push(re(le(a-r,.34,.34),c,6.4,l-.4),re(le(.34,.34,l-o),a-.4,6.4,d)),n.add(s(Ke(f),e.woodDark));let h=s(le(a-r+1.6,.3,l-o+1.6,.3),e.roof);h.rotation.z=-.1,h.position.set(c,7,d),n.add(h);let m=s(Ke([re(it(.62,.78,9.4,14),0,4.7,0),re(it(.8,.8,.5,14),0,9.5,0)]),new ft({color:9128504,roughness:.95}));m.position.set(r+1.6,0,o+1.4),n.add(m);let g=new at;g.position.set(0,Nt.shaftY,Nt.shaftZ);let b=Nt.camX-1.4,p=0;g.add(s(re(it(.15,.15,p-b,12),(b+p)/2,0,0,0,0,Math.PI/2),e.iron));let u=[re(it(.34,.34,1.3,16),Nt.camX,0,0,0,0,Math.PI/2)];for(let M=0;M<4;M++){let A=M*Math.PI/2,I=le(.4,.34,.22,1);I.translate(0,.46,0),I.rotateX(A),I.translate(Nt.camX,0,0),u.push(I)}g.add(s(Ke(u),e.iron)),n.add(g),n.add(s(Ke([-3,-6.4,-9.4].map(M=>re(le(.7,.9,.9,1),M,Nt.shaftY-.6,Nt.shaftZ)).concat([re(le(.7,.9,.9,1),Nt.camX-1.3,Nt.shaftY-.6,Nt.shaftZ)])),e.stone));let y=new at;y.position.set(Nt.camX,1.9,Nt.shaftZ+1.7);let v=s(le(.3,.3,4.4,.5),e.wood);v.position.set(0,0,-.6),y.add(v);let _=s(le(.7,.8,.9,1),e.iron);_.position.set(0,-.15,1.65),y.add(_),n.add(y),n.add(s(Ke([re(le(.5,2.3,.5,1),Nt.camX,.9+.2,Nt.shaftZ+1.7+0),re(le(1,.9,1.4,1),Nt.camX,.55+0,Nt.shaftZ+3.35+0)]),e.iron));let E=[];for(let M=0;M<10;M++){let A=s(le(2.4,.12,.7,1),e.wood);A.position.set(6+M%2*.05,.1+.13*M,4.6),A.visible=!1,E.push(A),n.add(A)}i.scene.add(n),i.parts.factory=n,i.parts.hammer=y,i.extras.push(n);let S=0,T=0,x=0;return i.pickables=i.pickables||[],i.hook.push((M,A,I,R)=>{let L=M.M>=3;if(n.visible=L,!L)return;g.rotation.x=i.mach.drive.rotation.x;let P=Math.abs(i.mach.drive.rotation.x),F=g.rotation.x,U=M.as[2]&&M.run[2],z=M.as[2]?Math.sin(F*4):0,q=M.as[2]?je(z,0,1):0;if(y.rotation.x=-.52*(R?U?.3:0:Math.pow(q,.6)),!R&&M.as[2]&&T>.05&&z<=.05&&U)for(let Z=0;Z<6;Z++)t.spark.emit(Nt.camX+(Math.random()-.5)*.6,1.4,Nt.shaftZ+3.2,(Math.random()-.5)*3,2+Math.random()*2.5,1.5+Math.random()*2,.5,.06,.9);T=z,!R&&M.as.some(Boolean)&&Math.random()<A*(6+24*je(M.units/80,0,1)+10*(M.run[2]?1:0))&&t.smoke.emit(r+1.6+(Math.random()-.5)*.4,10,o+1.4+(Math.random()-.5)*.4,.5+Math.random()*.6,1.4+Math.random(),(Math.random()-.5)*.4,3,.7,.34);let W=Math.min(10,Math.floor(M.units/6));W!==x&&(E.forEach((Z,j)=>Z.visible=j<W),x=W)}),n}var Ut={x:-1.5,z:15.5,sc:.4,w:2.6,rows:5,k:1.55},Qr=-3,x_=10.2;function Gd(i){let{mats:e}=i,t=new at;t.name="damLab",t.visible=!1,t.position.set(Ut.x,0,Ut.z),t.scale.setScalar(Ut.k);let n=(S,T,x=!0)=>{let M=new We(S,T);return M.castShadow=x,M.receiveShadow=!0,M},s=Ut.sc,r=(x_-Qr)*s,a=.55;t.add(n(Ke([re(le(5.6,a,5.8,.3),0,a/2,0),re(le(5.9,.16,6.1,.3),0,.08,0)]),e.stone));let o=new at;o.position.y=a,t.add(o);let l=new ft({map:i.T.concrete.map,normalMap:i.T.concrete.normal,color:14999768,roughness:.9}),c=n(new mn(.01,.01,.01),l);o.add(c);let d=new ft({color:3843792,roughness:.08,metalness:0,transparent:!0,opacity:.55,envMapIntensity:1.4}),f=new We(new mn(Ut.w,1,2.6),d);f.castShadow=!1,o.add(f);let h=it(.08,.08,1,8),m=new Wi(.2,.36,10);h.translate(0,.5,0),m.translate(0,1.18,0);let g=[],b=new ft({color:16752114,emissive:15929530,emissiveIntensity:.35,roughness:.5});for(let S=0;S<Ut.rows;S++){let T=new at;T.add(n(h,b,!1),n(m,b,!1)),T.rotation.x=Math.PI/2,o.add(T),g.push(T)}let p=[];for(let S=0;S<Ut.rows;S++){let T=new We(new mn(Ut.w+.4,.5,2.4),new Hi({visible:!1}));T.userData.row=S,o.add(T),p.push(T)}let u=new ft({color:10479359,roughness:.05,transparent:!0,opacity:.8}),y=new We(new mn(Ut.w*.7,.05,.5),u);y.visible=!1,o.add(y),i.scene.add(t),i.parts.damLab=t,i.extras.push(t);let v={group:t,hits:p,th:[0,0,0,0,0],need:[4,4,3,2,1],lev:0,fail:-1,show:!1},_=()=>{let S=v.th.map(A=>1.8+1.7*A),T=-1.3,x=A=>(jt[A]-Qr)*s,M=[[T,0],[T,r]];for(let A=4;A>=0;A--)M.push([T+S[A]*s,A===4?r:x(A+1)],[T+S[A]*s,x(A)]);return M.push([T+S[0]*s,0]),M};v.rebuild=()=>{let S=new xn;_().forEach((A,I)=>I?S.lineTo(A[0],A[1]):S.moveTo(A[0],A[1]));let x=new ai(S,{depth:Ut.w,bevelEnabled:!1});x.rotateY(-Math.PI/2),x.translate(Ut.w/2,0,0),x.attributes.uv.array.forEach((A,I,R)=>R[I]=A*.6);let M=c.geometry;c.geometry=x,M.dispose();for(let A=0;A<Ut.rows;A++){let I=((jt[A]+jt[A+1])/2-Qr)*s;p[A].position.set(0,I,-.3),p[A].scale.set(1,(jt[A+1]-jt[A])*s/.5,1)}},v.update=S=>{let T=je(S,0,Ut.rows),x=T/Ut.rows*r;f.scale.y=Math.max(.001,x),f.position.set(0,x/2,-1.3-1.3);for(let M=0;M<Ut.rows;M++){let A=((jt[M]+jt[M+1])/2-Qr)*s,I=Math.max(0,x-A),R=g[M];R.visible=I>.02;let L=.25+I*1.9;R.scale.set(1,L,1),R.position.set(0,A,-1.3-L-.18),R.children.forEach(P=>{P.material=M===v.fail?E:b})}if(y.visible=v.fail>=0,v.fail>=0){let M=((jt[v.fail]+jt[v.fail+1])/2-Qr)*s;y.position.set(0,M,-1.3+(1.8+1.7*v.th[v.fail])*s+.2)}c.material.color.setHex(v.fail>=0?15775704:14999768)};let E=new ft({color:16726890,emissive:16718421,emissiveIntensity:.9,roughness:.4});return v.rebuild(),v.update(0),v}var ml={x0:40.2,x1:50.8,z0:-69,z1:-33,top:25},__=(i,e)=>[49.4-(e-36)/178*8.6,-51-(i-180)*.115],v_={1:{nodes:{src:["src",180,36],F1:["fork",180,104,["T1","T2"],0],T1:["tgt",84,208,"RESERVOIR"],T2:["tgt",276,208,"TERRACES"]},route0:{F1:0}},2:{nodes:{src:["src",180,36],F1:["fork",150,92,["T1","F2"],2],F2:["fork",250,140,["T2","D1"],2],T1:["tgt",70,208,"RESERVOIR"],T2:["tgt",206,214,"TERRACES"],D1:["drain",314,214,"SCREE"]},route0:{F1:0,F2:0}},3:{nodes:{src:["src",180,36],F1:["fork",180,84,["F2","F3"],0],F2:["fork",96,136,["T1","D1"],2],F3:["fork",264,136,["T2","T3"],0],T1:["tgt",54,214,"RESERVOIR"],D1:["drain",138,218,"SCREE"],T2:["tgt",222,214,"TERRACES"],T3:["tgt",308,214,"VILLAGE WELL"]},route0:{F1:0,F2:0,F3:0}}};function Hd(i){let{mats:e,world:t}=i,n=new at;n.name="source",i.scene.add(n),i.extras.push(n);let s=(_,E,S=!0)=>{let T=new We(_,E);return T.castShadow=S,T.receiveShadow=!0,T},{x0:r,x1:a,z0:o,z1:l,top:c}=ml,d=(o+l)/2;n.add(s(Ke([re(le(a-r,c-6,l-o,.3),(r+a)/2,(c+6)/2,d)]),e.stone)),n.add(s(le(a-r-.2,.12,l-o-.2,.3),new ft({color:5195320,roughness:1}))),n.children[n.children.length-1].position.set((r+a)/2,c+.02,d),n.add(s(Ke([re(le(.5,.9,l-o,.3),r+.25,c+.45,d),re(le(a-r,.9,.5,.3),(r+a)/2,c+.45,o+.25),re(le(a-r,.9,.5,.3),(r+a)/2,c+.45,l-.25)]),e.concrete));let f=Di(11),h=new qi(1,1),m=[];for(let _=0;_<6;_++){let E=h.clone();E.scale(1.2+f()*1.2,.9+f()*.8,1.2+f()*1.2),E.translate(50.4+(f()-.5)*2.2,c+.6+f()*.8,-50+(f()-.5)*3.4),m.push(E)}n.add(s(Ke(m),new ft({color:8222316,roughness:.95})));let g=s(new Vt(1.1,1.1,.12,20),new ft({color:5228512,roughness:.05,transparent:!0,opacity:.85}),!1);g.position.set(49.6,c+1.3,-50),n.add(g);let b=new at;n.add(b);let p={group:n,layout:0,nodes:{},edges:[],flaps:{},hits:[],basins:{},drains:{},fall:null,state:{route:{},flows:{},fill:{},lake:0}},u=()=>{for(b.traverse(_=>{_.geometry&&_.geometry.dispose(),_.material&&_.material.dispose&&_.material.dispose()});b.children.length;)b.remove(b.children[0])},y=_=>ui(t.shared,_);p.setLayout=_=>{u(),p.layout=_,p.nodes={},p.edges=[],p.flaps={},p.hits=[],p.basins={},p.drains={},p.fall=null;let E=v_[_],S=p.nodes,T=c+.02;Object.keys(E.nodes).forEach(A=>{let I=E.nodes[A],[R,L]=__(I[1],I[2]);S[A]={id:A,t:I[0],x:R,z:L,o:I[0]==="fork"?I[3]:null,name:I[0]==="tgt"||I[0]==="drain"?I[3]:null,m:I[0]==="fork"?I[4]:0}}),S.src.o=[Object.keys(S).find(A=>S[A].t==="fork")];let x=[];Object.keys(S).forEach(A=>(S[A].o||[]).forEach(I=>{let R=S[A],L=S[I],P=L.x-R.x,F=L.z-R.z,U=Math.hypot(P,F),z=Math.atan2(P,F);[re(le(1.7,.14,U,.4),0,.07,0),re(le(.2,.62,U,.4),-.75,.31,0),re(le(.2,.62,U,.4),.75,.31,0)].forEach(Z=>{Z.rotateY(z),Z.translate((R.x+L.x)/2,T,(R.z+L.z)/2),x.push(Z)});let q=[];for(let Z=0;Z<=8;Z++)q.push(new B(xt(R.x,L.x,Z/8),T+.3,xt(R.z,L.z,Z/8)));let W=new We(ji(q,1.15,Z=>Z<2?.7:.15),y({speed:1,amp:1,scale:.4,stretch:.6,shallow:"#8fe0e8",deep:"#2a86a8",opacity:.9,clear:.2,edgeFoam:.5}));W.frustumCulled=!1,W.renderOrder=3,b.add(W),p.edges.push({a:A,b:I,rib:W})})),x.length&&b.add(s(Ke(x),e.concrete)),Object.keys(S).forEach(A=>{let I=S[A];if(I.t==="fork"){let R=s(le(2.6,.9,2.6,.4),e.stone);R.position.set(I.x,T+.45,I.z),b.add(R);let L=new at;L.position.set(I.x,T+1.15,I.z),L.add(s(le(.22,.14,2,.5),e.woodDark),s(it(.22,.22,.28,12),e.brass,!1)),b.add(L),p.flaps[A]=L;let P=new We(new Vt(1.5,1.5,1.6,10),new e.dark.constructor({visible:!1,transparent:!0,opacity:0}));P.position.set(I.x,T+.9,I.z),P.userData.fork=A,b.add(P),p.hits.push(P)}else if(I.t==="tgt"){let P=s(Ke([re(le(4.2,.2,4.2,.4),0,.1,0),re(le(4.2,1.3,.4,.4),0,.65,1.9000000000000001),re(le(4.2,1.3,.4,.4),0,.65,-1.9000000000000001),re(le(.4,1.3,4.2,.4),1.9000000000000001,.65,0),re(le(.4,1.3,4.2,.4),-1.9000000000000001,.65,0)]),e.stone);P.position.set(I.x,T,I.z),b.add(P);let F=new Fn(4.2-.8,4.2-.8);F.rotateX(-Math.PI/2);let U=F.attributes.position.count,z=new Float32Array(U*3),q=new Float32Array(U);for(let Z=0;Z<U;Z++)z[Z*3]=1,F.attributes.uv.setXY(Z,F.attributes.position.getX(Z)+I.x,F.attributes.position.getZ(Z)+I.z);F.setAttribute("aTan",new F.attributes.position.constructor(z,3)),F.setAttribute("aFoam",new F.attributes.position.constructor(q,1));let W=new We(F,y({speed:.1,amp:.6,scale:.3,across:.3,deep:"#0d4a74",shallow:"#3da0b8",opacity:1,clear:1,edgeFoam:0,transparent:!1,depthWrite:!0}));W.position.set(I.x,T+.25,I.z),b.add(W),p.basins[A]={wp:W,y0:T+.25,y1:T+1.15}}else if(I.t==="drain"){let R=s(new Vt(1.5,1.7,.3,14),new ft({color:1382172,roughness:1}),!1);R.position.set(I.x,T+.15,I.z),b.add(R);let L=s(Ke([0,1,2,3].map(P=>re(le(2.6,.06,.1,1),0,0,-.9+P*.6))),e.iron);L.position.set(I.x,T+.32,I.z),b.add(L),p.drains[A]={x:I.x,z:I.z}}});let M=S.T1;if(M){let A=[M.x-2.2,T+.3,M.z],I=s(le(2.4,.7,1.8,.4),e.stone);I.position.set(A[0]-.4,T+.35,A[2]),b.add(I);let R=hl(ml.x0-.5,M.z,c);if(R.length>3){let L=[new B(A[0]-.4,T+.6,A[2])].concat(R.map(F=>new B(F[0],F[1]+.05,F[2]))),P=new We(ji(L,(F,U)=>xt(1.6,3.4,U),(F,U)=>.4+.5*U,new B(0,0,1)),y({speed:2.6,amp:1.2,scale:.25,stretch:.5,across:2.2,shallow:"#dff6fa",deep:"#9fd4e6",opacity:.92,clear:.1,edgeFoam:.9,white:.35}));P.frustumCulled=!1,P.renderOrder=3,b.add(P),p.fall={mesh:P,base:L[L.length-1]}}}p.apply(p.state)},p.apply=_=>{p.state=_};let v=[.6,0,-.6];return i.hook.push((_,E,S,T,x)=>{let M=p.state,A=M.Qmax||12,I=i.em;if(p.edges.forEach(R=>{let L=M.edge&&M.edge[R.a+">"+R.b]||0,P=R.rib.material.uniforms,F=je(L/A,0,1);R.rib.visible=F>.01,P.uSpeed.value=T?0:.6+2.4*F,P.uFlow.value=.3+.7*F,R.rib.scale.x=.5+.5*Math.sqrt(F)}),Object.keys(p.flaps).forEach(R=>{let L=p.flaps[R],P=v[p.nodes[R].m];L.rotation.y+=(P-L.rotation.y)*Math.min(1,E*8)}),Object.keys(p.basins).forEach(R=>{let L=p.basins[R],P=je(M.fill&&M.fill[R]||0,0,1);L.wp.position.y=xt(L.y0,L.y1,P)}),p.fall){let R=je((M.fall!=null?M.fall:M.edge&&M.edge["F1>T1"]||0)/A,0,1);p.fall.mesh.visible=R>.02;let L=p.fall.mesh.material.uniforms;if(L.uSpeed.value=T?0:1.6+3*R,L.uFlow.value=.3+.7*R,p.fall.mesh.scale.x=.4+.6*Math.sqrt(R),!T&&R>.05){let P=R*30*E,F=Math.floor(P)+(Math.random()<P-Math.floor(P)?1:0);for(let U=0;U<F;U++)I.mist.emit(p.fall.base.x+(Math.random()-.5)*3,_.resL+.4,p.fall.base.z+(Math.random()-.5)*3,(Math.random()-.5)*.6,.8+Math.random(),(Math.random()-.5)*.6,2.4,1,.3)}}Object.keys(p.drains).forEach(R=>{let L=M.drain&&M.drain[R]||0;if(!T&&L>.1){let P=L*6*E,F=Math.floor(P)+(Math.random()<P-Math.floor(P)?1:0);for(let U=0;U<F;U++)I.spray.emit(p.drains[R].x+(Math.random()-.5)*2,c+.5,p.drains[R].z+(Math.random()-.5)*2,(Math.random()-.5)*1.5,1.2+Math.random(),(Math.random()-.5)*1.5,.6,.12,.6)}}),g.scale.y=1+.2*Math.sin(S*3)}),p.setLayout(1),i.source=p,i.parts.source=n,p}function gl(i,e){let t=i.nodes,n={},s={},r={};return(function a(o,l){let c=t[o];if(c.t==="fork"){let d=c.m===0?l:c.m===1?l/2:0,f=l-d;n[o+">"+c.o[0]]=d,n[o+">"+c.o[1]]=f,a(c.o[0],d),a(c.o[1],f)}else c.t==="src"?(n["src>"+c.o[0]]=l,a(c.o[0],l)):(c.t==="drain"&&(r[o]=l),s[o]=l)})("src",e),{edge:n,flows:s,drain:r}}var ah=i=>i*i*(3-2*i),ts=i=>1+2.5*Math.pow(i-1,3)+1.5*Math.pow(i-1,2),ns=(i,e,t)=>je((i-e)/(t-e),0,1),jr={wheel:{target:[2,7.2,-9],dir:[.5,.16,.85],tall:56,wide:34},lab:{target:[0,4,0],dir:[.34,.2,.92],tall:66,wide:44},gate:{target:[7,9,-13],dir:[.3,.24,.92],tall:38,wide:25},dam:{target:[2,5.5,-13],dir:[.38,.12,.92],tall:62,wide:40},lake:{target:[0,9,-42],dir:[.08,.3,.95],tall:74,wide:48},source:{target:[43,22,-48],dir:[-.62,.52,.3],tall:50,wide:32},factory:{target:[-3,3.6,-1],dir:[.34,.26,.9],tall:70,wide:46},ocean:{target:[6,0,62],dir:[0,.3,-.95],tall:110,wide:72}};function Wd(i){let{canvas:e,stageEl:t,kit:n,level:s}=i,r=i.up,a=()=>n.reduced(),o=s>=6?2:s>=3?1:0,l=Ud(e,{tier:o,quality:i.quality}),{scene:c,camera:d,renderer:f,sun:h,q:m}=l,g=l.arch.M,b=l.T,p=l.arch.parts,u=Bd(g,b,o,r.bear);c.add(u.root);let y=m==="low"?1:m==="high"?3:2,v={spray:Ni(160*y,"#f4fbff"),mist:Ni(90*y,"#e4eef4"),dust:Ni(90*y,"#f6efdc"),chips:Ni(60*y,"#d8b88a"),rain:Ni(120*y,"#d6e6ff"),smoke:Ni(70*y,"#7d7f88"),spark:Ni(50*y,"#ffb050")};Object.values(v).forEach(x=>{c.add(x.points),x.mat.uniforms.uScale.value=600}),v.rain.mat.uniforms.uScale.value=260,v.spark.mat.uniforms.uScale.value=380;let _=zd(l,u.drive);c.add(_.group),[[-2.6,Xt.floorY+2.7,-3.5],[-6,Xt.floorY+2.7,-3.5],[-4.2,3.7,-3],[Ze.blade+.4,3.4,Ze.z+1.6]].forEach(x=>{let M=new We(new oi(.15,10,8),g.glass);M.position.set(x[0],x[1],x[2]);let A=new We(new Vt(.015,.015,1.2,4),g.dark);A.position.set(x[0],x[1]+.7,x[2]),c.add(M,A)});let S=new Lr(16758886,0,26,1.6);S.position.set(-3.2,Xt.floorY+3,-3),c.add(S);let T={world:l,scene:c,camera:d,renderer:f,sun:h,q:m,mats:g,T:b,parts:p,mach:u,em:v,rig:_,lamp:S,tierN:o,env:i,extras:[],hotList:[],pickList:[],onTap:null};return T.hook=[],kd(T),Vd(T),T.lab=Gd(T),Hd(T),T.vs={gateA:0,relA:1,resL:9,pondL:9,Qg:0,Qref:13,spill:0,Qriver:0,rpm:0,as:[!1,!1,!1],run:[!1,!1,!1],M:2,P:0,D:0,units:0,rain:0},T}function Xd(i){let{world:e,scene:t,camera:n,renderer:s,sun:r,q:a,parts:o,mach:l,em:c,rig:d,lamp:f,env:h}=i,m=h.kit,g=()=>m.reduced(),b=h.canvas,p=h.stageEl,u=i.vs,y=new B;try{Od(e,[d.group,c.spray.points,c.mist.points,c.dust.points,c.chips.points,c.rain.points,c.smoke.points,c.spark.points,...i.extras.filter(N=>N&&N.userData&&N.userData.noReflect)])}catch(N){console.warn("[DamBuilder3D] reflection bake skipped: "+(N&&N.message))}let v={yaw:0,pitch:0,yawT:0,pitchT:0,hold:0,intro:0,celeb:0},_={target:new B(...jr.wheel.target),dir:new B(...jr.wheel.dir).normalize(),tall:jr.wheel.tall,wide:jr.wheel.wide},E={target:new B,dir:new B,tall:0,wide:0},S="wheel",T=1,x=null,M=0,A=!0,I=0,R=!1;i.setShot=(N,H)=>{let k=jr[N];!k||N===S&&T>=1||(S=N,E.target.copy(_.target),E.dir.copy(_.dir),E.tall=_.tall,E.wide=_.wide,i._to={target:new B(...k.target),dir:new B(...k.dir).normalize(),tall:k.tall,wide:k.wide},T=H||g()?1:0,T===1&&L(1),A=!0)};function L(N){let H=ah(N),k=i._to;_.target.lerpVectors(E.target,k.target,H),_.dir.lerpVectors(E.dir,k.dir,H).normalize(),_.tall=xt(E.tall,k.tall,H),_.wide=xt(E.wide,k.wide,H)}function P(N){T<1&&(T=Math.min(1,T+N/1.7),L(T));let H=n.aspect,k=xt(_.tall,_.wide,je((H-.6)/1.4,0,1)),Y=v.celeb?ah(je(v.celeb/1.6,0,1)):0,se=g()||i.introDone?1:ah(je(v.intro/3,0,1)),me=k*(1-.22*Y)*xt(1.5,1,se);v.hold=Math.max(0,v.hold-N),v.hold===0&&!x&&(v.yawT*=Math.pow(.35,N),v.pitchT*=Math.pow(.35,N)),v.yaw+=(v.yawT-v.yaw)*Math.min(1,N*6),v.pitch+=(v.pitchT-v.pitch)*Math.min(1,N*6);let Ae=g()?0:Math.sin(M*.23)*.035,Le=Math.atan2(_.dir.x,_.dir.z)+v.yaw+Ae+(1-se)*.6-Y*.2,Be=Math.asin(_.dir.y)+v.pitch+(1-se)*.32-Y*.04,O=Math.cos(Be),et=_.target;n.position.set(et.x+Math.sin(Le)*O*me,et.y+Math.sin(Be)*me,et.z+Math.cos(Le)*O*me);let Qe=et.y+(H<1?xt(2,0,je((H-.5)/.5,0,1)):0);n.lookAt(et.x-Y*3.2,Qe,et.z+Y*.8)}i.cam=v,i.introDone=!!h.keepIntro,i.setHot=N=>{i.hotList.forEach(H=>H.b.remove()),i.hotList=[],(N||[]).forEach(H=>{let k=document.createElement("button");k.type="button",k.className="db3dHot",k.innerHTML="<i></i><span>"+H.label+"</span>",k.setAttribute("aria-label",H.aria||H.label),k.addEventListener("click",Y=>{Y.stopPropagation(),H.fn()}),p.appendChild(k),i.hotList.push({b:k,anchor:H.anchor,state:H.state,text:H.text,span:k.querySelector("span"),k:H.label})})};let F=new Nr,U=new pe;function z(N){let H=b.getBoundingClientRect();U.set((N.clientX-H.left)/H.width*2-1,-((N.clientY-H.top)/H.height)*2+1),F.setFromCamera(U,n);let k=i.pickList.map(se=>se.object).filter(Boolean),Y=F.intersectObjects(k,!0);if(Y.length)for(let se=Y[0].object;se;se=se.parent){let me=i.pickList.find(Ae=>Ae.object===se);if(me){i.onTap&&i.onTap(me.id,N,Y[0]);return}}}b.addEventListener("pointerdown",N=>{x={x:N.clientX,y:N.clientY,moved:!1,yaw:v.yawT,pitch:v.pitchT,t:performance.now()};try{b.setPointerCapture(N.pointerId)}catch{}}),b.addEventListener("pointermove",N=>{if(!x)return;let H=N.clientX-x.x,k=N.clientY-x.y;Math.abs(H)+Math.abs(k)>9&&(x.moved=!0),x.moved&&(v.yawT=je(x.yaw-H*.005,-.5,.5),v.pitchT=je(x.pitch+k*.003,-.16,.22),v.hold=3,A=!0)}),b.addEventListener("pointerup",N=>{x&&!x.moved&&performance.now()-x.t<600&&(!i.introDone&&!g()?v.intro=Math.max(v.intro,3.2):z(N)),x=null}),b.addEventListener("pointercancel",()=>{x=null});let q=document.createElement("div");q.className="db3dAdvice",q.setAttribute("role","status"),q.setAttribute("aria-live","polite"),q.hidden=!0,p.appendChild(q);let W=document.createElementNS("http://www.w3.org/2000/svg","svg");W.setAttribute("class","db3dFc"),W.setAttribute("viewBox","0 0 100 34"),W.setAttribute("aria-label","Rain forecast"),W.hidden=!0,W.innerHTML='<rect x="0" y="0" width="100" height="34" rx="6" fill="rgba(6,7,13,.7)" stroke="#6a72d8"/><text x="50" y="9" text-anchor="middle" font-size="5.2" font-weight="800" fill="#9bdcf2" font-family="system-ui">RAIN FORECAST \xB7 NEXT 14 s</text><polyline points="" fill="none" stroke="#2fd2ff" stroke-width="1.6" stroke-linejoin="round"/><line x1="6" x2="6" y1="12" y2="31" stroke="#ff9df2" stroke-width="1"/>',p.appendChild(W);let Z="";i.setAdvice=N=>{if(!N){q.hidden=!0,Z="";return}let H=N.tone+"|"+N.text;H!==Z&&(Z=H,q.hidden=!1,q.className="db3dAdvice "+N.tone,q.textContent=N.text)},i.setForecast=(N,H,k=14,Y=0,se=1)=>{if(!N){W.hidden=!0;return}W.hidden=!1;let me="";for(let Ae=0;Ae<=28;Ae++){let Le=N(H+Ae*k/28);me+=(6+Ae*3.3).toFixed(1)+","+(31-je((Le-Y)/(se-Y),0,1)*17).toFixed(1)+" "}W.querySelector("polyline").setAttribute("points",me)};let j=Math.min(window.devicePixelRatio||1,a==="high"?2:a==="medium"?1.5:1),xe=0;function he(){let N=p.getBoundingClientRect();Fd(e,Math.max(160,Math.round(N.width)),Math.max(120,Math.round(N.height)),j),A=!0}let Xe=new ResizeObserver(he);Xe.observe(p),he(),e.lost.push(()=>{h.onLost&&h.onLost()}),i.size=he,i.dirty=()=>{A=!0},i.skipIntro=()=>{v.intro=4,A=!0},i.celebrate=()=>{R=!0,v.celeb=.001,A=!0;for(let N=0;N<40&&!g();N++)c.dust.emit(-3+Math.random()*6,Xt.floorY+1+Math.random()*2,-3+Math.random()*3,(Math.random()-.5)*1.5,.8+Math.random(),Math.random()-.5,2.4,.7,.5)},i.endCelebrate=()=>{R=!1,v.celeb=0},i.project=(N,H,k)=>{let Y=new B(N,H,k).project(n),se=b.getBoundingClientRect();return[se.left+(Y.x*.5+.5)*se.width,se.top+(-Y.y*.5+.5)*se.height]},i.pixels=()=>{let N=s.getContext(),H=24,k=new Uint8Array(4),Y=[];for(let se=1;se<H;se++)for(let me=1;me<H;me++)N.readPixels(Math.floor(N.drawingBufferWidth*me/H),Math.floor(N.drawingBufferHeight*se/H),1,1,N.RGBA,N.UNSIGNED_BYTE,k),Y.push([k[0],k[1],k[2]]);return Y},i.info=()=>({info:s.info.render,mem:s.info.memory,quality:a,dpr:j}),i.state={get introAll(){return g()?1:je(v.intro/3.2,0,1)},get time(){return M}};let qe=(N,H,k=-1)=>{N.scale.y=Math.max(.001,H),N.position.y=k*(1-H)};function nt(N,H){if(H||i.introDone){i._built||([o.dam,o.flume,o.tailrace,o.mill].forEach(Y=>{Y.scale.set(1,1,1),Y.position.set(0,0,0),Y.visible=!0}),o.gateHouse.position.y=0,o.gateHouse.visible=!0,l.drive.scale.setScalar(1),l.drive.visible=!0,l.lantern.scale.setScalar(1),l.lever.visible=!0,l.root.visible=!0,i._built=!0);return}qe(o.dam,ts(ns(N,.1,1.1)),-7),o.gateHouse.position.y=(1-ts(ns(N,.9,1.7)))*10,o.gateHouse.visible=N>.9,qe(o.flume,ts(ns(N,1.2,2)),0),o.flume.visible=N>1.2,qe(o.tailrace,ts(ns(N,1.4,2.1)),-1),o.tailrace.visible=N>1.4,qe(o.mill,ts(ns(N,1.5,2.4)),0),o.mill.visible=N>1.5;let k=ts(ns(N,1.9,2.8));l.drive.scale.setScalar(Math.max(.001,k)),l.drive.visible=N>1.9,l.lantern.scale.setScalar(Math.max(.001,ts(ns(N,2.1,2.9)))),l.lever.visible=N>2.2,l.root.visible=N>2}nt(0,g());let ee=0,ie=0,de=Ze.fastX,ze=0,fe=0,De=0,Re=0;return i.vis={get lift(){return ie},get beltX(){return de},get saw(){return u.M>=2?l.arbor.rotation.x:null}},i.frame=function(N){N=Math.min(N,.1),M+=N,!i.introDone&&(g()||(!h.isPlaying||h.isPlaying()))&&(v.intro+=N*(h.fast?2.6:1));let H=g(),k=u.rpm*.2,Y=k*Math.PI*2/60,se=H?1:je(v.intro/3.2,0,1);if(se>=1&&(i.introDone=!0),R&&(v.celeb+=N),H){if(!A&&M-I<.25)return;l.drive.rotation.x=-k*.9}else l.drive.rotation.x-=Y*N;o.gate.position.y=es+1.6+u.gateA*Id,o.handwheel.rotation.z=u.gateA*9*Math.PI;let me=u.as[0]?1:0;if(ie+=((1-me)*.62-ie)*Math.min(1,N*4),l.lantern.position.y=ie,ze+=((me?1:-1)*.5-ze)*Math.min(1,N*6),l.lever.rotation.z=ze,Re=me?Y*(on.crownN/on.lanternN):Re*Math.pow(.15,N),l.lantern.rotation.y+=(H?0:Re)*N,H&&me&&(l.lantern.rotation.y=k*1.7),l.sawGroup.visible=u.M>=2,u.M>=2){let O=u.as[1]?1:0;de+=((O?Ze.fastX:Ze.looseX)-de)*Math.min(1,N*5),l.belt.position.x=de;let et=.78/Ze.pulleyR;fe=O?Y*et:fe*Math.pow(.2,N),l.arbor.rotation.x-=(H?0:fe)*N,H&&O&&(l.arbor.rotation.x=-k*3),H||(l.beltTex.offset.y-=Y*.78/1.2*N);let Qe=l.log;O&&u.run[1]&&(De+=N*.16*(u.P/Math.max(u.D,1)),De>3.2&&(De=0)),Qe.position.x=6.1-De,!H&&O&&u.run[1]&&Math.random()<N*40&&De>1.3&&c.chips.emit(Ze.blade+.1,Ze.y+.5,Ze.z+.2,1.4+Math.random(),1.5+Math.random()*1.5,(Math.random()-.5)*2,.7,.1,.8)}u.run[0]&&(ee+=N,l.flour.scale.y=Math.min(1,.01+ee/30),!H&&Math.random()<N*20&&c.dust.emit(on.lanternX+(Math.random()-.5)*1.8,Xt.floorY+1.1,ct.z+(Math.random()-.5)*1.8,(Math.random()-.5)*.5,.35,(Math.random()-.5)*.5,2.2,.55,.28));let Ae=(u.run.some(Boolean)?1:0)*.85+(i.tierN>=2?.25:0)+(R?.6:0);f.intensity+=(Ae*38-f.intensity)*Math.min(1,N*3),i.mat_glass(f.intensity/20),nt(v.intro,H),P(N),e.lake.position.y=u.resL-9,d.update({Qg:u.Qg,Qref:u.Qref,spill:u.spill,rpm:u.rpm},N,M,l.drive.rotation.x,c,H,se);for(let O of i.hook)O(u,N,M,H,se);if(s.toneMappingExposure=1.05+(R?.22*Math.sin(je(v.celeb/1.6,0,1)*Math.PI):0),e.shared.uTime.value=H?0:M,e.sky.material.uniforms.uTime.value=H?0:M,!H&&u.rain>.02){let O=u.rain*90*N*60;for(let et=0,Qe=Math.floor(O)+(Math.random()<O-Math.floor(O)?1:0);et<Qe;et++)c.rain.emit(-34+Math.random()*74,34,-88+Math.random()*78,.6,-20,.4,1.9,.07,.55)}H||(c.rain.update(N,0,0,0),c.smoke.update(N,-.5,.3,2.2),c.spark.update(N,9,.2,-.4)),H||(c.spray.update(N,9,.5,.7),c.mist.update(N,-.3,.8,1.6),c.dust.update(N,-.02,.6,1.4),c.chips.update(N,9,.4,.2));let Le=b.clientWidth,Be=b.clientHeight;i.hotList.forEach(O=>{y.copy(O.anchor).project(n);let et=y.z<1&&se>.95&&!i.hotHidden;if(O.b.style.display=et?"flex":"none",et){if(O.b.style.transform="translate("+((y.x*.5+.5)*Le-22).toFixed(0)+"px,"+((-y.y*.5+.5)*Be-22).toFixed(0)+"px)",O.text){let D=O.text();D!==O.k&&(O.k=D,O.span.textContent=D)}let Qe=O.state?O.state():null;O.b.classList.toggle("on",!!(Qe&&Qe.on)),O.b.classList.toggle("run",!!(Qe&&Qe.run))}}),s.render(t,n),I=M,A=!1,N>.034?xe+=N:xe=Math.max(0,xe-N),xe>1.2&&j>.7?(j=Math.max(.7,j*.8),xe=0,he()):xe>1.2&&r.castShadow&&(r.castShadow=!1,xe=0)},i.mat_glass=N=>{i.mats.glass.emissiveIntensity=N},i.dispose=function(){Xe.disconnect(),i.hotList.forEach(N=>N.b.remove()),q.remove(),W.remove(),t.traverse(N=>{N.geometry&&N.geometry.dispose(),N.material&&(Array.isArray(N.material)?N.material:[N.material]).forEach(H=>{for(let k in H){let Y=H[k];Y&&Y.isTexture&&Y.dispose()}if(H.uniforms)for(let k in H.uniforms){let Y=H.uniforms[k].value;Y&&Y.isTexture&&Y.dispose()}H.dispose()})}),e.reflections&&e.reflections.forEach(N=>N.dispose()),Object.values(e.T).forEach(N=>Object.values(N).forEach(H=>H&&H.dispose&&H.dispose())),t.environment&&t.environment.dispose(),s.dispose();try{s.forceContextLoss()}catch{}},i}var is=(i,e,t)=>i<e?e:i>t?t:i;function ss(i,e={},t={}){let n=Math.max(1,i|0),s=e.bear|0,r=e.liner|0,a={level:n,t:0,Qref:13,cap:14,eta:.6+.06*s,defs:[{id:"mill",name:"MILL",d:3,r:1},{id:"saw",name:"SAW",d:4,r:1.4},{id:"hammer",name:"HAMMER",d:5,r:1.8}]};return a.M=t.M!=null?t.M:Math.min(2,1+(n-1>>1)),a.as=[!1,!1,!1],a.run=[!1,!1,!1],a.resCap=150*(1+.1*r),a.resV=(t.resFrac!=null?t.resFrac:3/(9.8-6))*a.resCap,a.pondCap=60,a.pin=t.pin==null?null:t.pin,a.pinSupply=a.Qref,a.pondV=.8*a.pondCap,a.inflow=t.inflow||(()=>12),a.relCoef=t.relCoef||40,a.relSat=!!t.relSat,a.relSet=t.rel==null?1:t.rel,a.relA=a.relSet,a.gateSet=0,a.gateA=0,a.resL=0,a.pondL=0,a.Qin=0,a.Qrel=0,a.spillRes=0,a.spillPond=0,a.Qg=0,a.P=0,a.D=0,a.f=1,a.rpm=0,a.Qriver=0,a.units=0,a.overtopped=!1,a.dynamicLake=!!t.dynamicLake,a.setGate=o=>{a.gateSet=is(Math.round(o/5)*5,0,100)},a.setRelease=o=>{a.relSet=is(o,0,1)},a.engage=(o,l)=>{o>=0&&o<a.M&&(a.as[o]=l==null?!a.as[o]:!!l)},a.levels=()=>{a.resL=6+(9.8-6)*a.resV/a.resCap,a.pondL=a.pin!=null?a.pin:7.8+(9.2-7.8)*a.pondV/a.pondCap},a.levels(),a.step=o=>{a.t+=o,a.levels(),a.relA+=is(a.relSet-a.relA,-.5*o,.5*o),a.gateA+=is(a.gateSet/100-a.gateA,-.6*o,.6*o);let l=Math.max(0,a.resL-a.pondL),c=Math.sqrt(l/1.2);a.Qrel=a.resL<=6+.05?0:a.relA*a.relCoef*(a.relSat?Math.min(1,c):c),a.spillRes=a.resL>9?12*Math.pow(a.resL-9,1.5):0;let d=is((a.pondL-7.8)/(9-7.8),0,1.3);a.Qg=a.gateA*13*Math.sqrt(d),a.pin!=null?(a.spillPond=Math.max(0,a.pinSupply-a.Qg),a.Qrel=a.Qg+a.spillPond):(a.spillPond=a.pondL>9?14*Math.pow(a.pondL-9,1.5):0,a.pondV=is(a.pondV+(a.Qrel-a.Qg-a.spillPond)*o,0,a.pondCap)),a.Qin=a.inflow(a.t),(a.pin==null||a.dynamicLake)&&(a.resV=is(a.resV+(a.Qin-a.Qrel-a.spillRes)*o,0,a.resCap)),a.overtopped=a.resL>=9.8-.005,a.P=a.eta*Math.min(a.Qg,a.cap),a.D=0,a.defs.forEach((h,m)=>{m<a.M&&a.as[m]&&(a.D+=h.d)}),a.f=a.D>0?Math.min(1,a.P/a.D):1;let f=Math.min(a.Qg/a.cap,1.3)*48*(a.D>0&&a.f<1?.25+.75*a.f:1);a.rpm+=(f-a.rpm)*Math.min(1,o*2.5),a.defs.forEach((h,m)=>{a.run[m]=m<a.M&&a.as[m]&&a.Qg>0&&a.P>=h.d-1e-9}),a.D>0&&a.Qg>0&&a.defs.forEach((h,m)=>{m<a.M&&a.as[m]&&(a.units+=h.r*a.f*o)}),a.Qriver=a.Qg+a.spillPond+a.spillRes},a.advice=()=>{let o=a.run.filter((f,h)=>f&&h<a.M).length,l=a.as.filter((f,h)=>f&&h<a.M).length,c=a.spillPond+a.spillRes,d=a.Qg/Math.max(.01,a.Qg+c);return a.overtopped?{tone:"bad",text:"RESERVOIR OVERTOPPING \u2014 release more water now"}:a.resL>9+.15?{tone:"warn",text:"RESERVOIR OVERFULL \u2014 open the release; water is going over the spillway"}:a.resL<7.8+.1&&a.pin==null?{tone:"warn",text:"LAKE TOO LOW \u2014 the gate can't draw water; close the release"}:a.Qg>.5&&l===0?{tone:"warn",text:"WATER IS TURNING THE WHEEL BUT NOTHING IS CONNECTED \u2014 engage a machine"}:l>0&&o<l?{tone:"warn",text:"MACHINES STARVED \u2014 power "+a.P.toFixed(1)+" < need "+a.D.toFixed(1)+": open the gate or drop a machine"}:c>2.5&&a.Qg<a.cap*.95?{tone:"warn",text:"WASTING WATER \u2014 "+c.toFixed(1)+" L/s is spilling past the wheel: open the gate"}:o>0&&o===l&&d>.8?{tone:"good",text:"EFFICIENT \u2014 "+Math.round(d*100)+"% of the water is working, all machines running"}:a.Qg<.2?{tone:"info",text:"GATE CLOSED \u2014 no water reaches the wheel"}:{tone:"info",text:"ADJUST THE GATE AND ENGAGE MACHINES"}},a}var st=(i,e=1)=>i.toFixed(e);function _l(i,e,t,n,s,r,a,o,l="%"){let c=document.createElement("div");c.className="dbSl",c.innerHTML='<label for="'+e+'">'+t+'</label><input id="'+e+'" type="range" min="'+n+'" max="'+s+'" step="'+r+'" value="'+a+'"><output></output>';let d=c.querySelector("input"),f=c.querySelector("output"),h=()=>{f.textContent=Math.round(+d.value)+l};return d.addEventListener("input",()=>{h(),o(+d.value)}),h(),i.appendChild(c),{input:d,set(m){d.value=m,h()}}}function Cn(i,e,t,n="72px"){let s=document.createElement("button");return s.type="button",s.className="dbBtn",s.style.minWidth=n,s.textContent=e,s.addEventListener("click",t),i.appendChild(s),s}function $s(i,e,t){let n=i.vs;if(i.source&&!i.source.manual){let s=Math.max(0,e.Qin);i.source.apply({Qmax:12,edge:{"src>F1":s,"F1>T1":s},fall:s,fill:{}})}n.gateA=e.gateA,n.relA=e.relA,n.resL=e.resL,n.pondL=e.pondL,n.Qg=e.Qg,n.Qref=e.Qref,n.spill=e.spillPond+e.spillRes,n.Qriver=e.Qriver,n.rpm=e.rpm,n.as=e.as,n.run=e.run,n.M=e.M,n.P=e.P,n.D=e.D,n.units=e.units,t&&Object.assign(n,t)}function qd(i,e){let{api:t,ctl:n,level:s,up:r}=i,a=i.kit,o=()=>a.reduced(),l=ss(s,r,{pin:9}),c={t:0,HOLD:4,holdT:0,TL:Math.round(45-Math.min(s-1,10)*1.5),done:!1,failed:!1,why:""};e.setShot("wheel",!0);let d=_l(n,"db3dGate","SLUICE GATE",0,100,5,0,p=>{l.setGate(p),d.set(l.gateSet),t.sfx("tick"),e.dirty()});Cn(n,"\u2212 GATE",()=>{l.setGate(l.gateSet-5),d.set(l.gateSet),t.sfx("tick"),e.dirty()}),Cn(n,"GATE +",()=>{l.setGate(l.gateSet+5),d.set(l.gateSet),t.sfx("tick"),e.dirty()});let f=[Cn(n,"MILL \xB7 OFF",()=>h(0))];l.M>1&&f.push(Cn(n,"SAW \xB7 OFF",()=>h(1)));function h(p){c.done||c.failed||(l.engage(p),t.sfx(l.as[p]?"click":"tick"),t.inspect(p?"saw":"mill"),e.dirty())}function m(){f.forEach((p,u)=>{let y=l.as[u];p.textContent=(u?"SAW \xB7 ":"MILL \xB7 ")+(y?"ENGAGED":"OFF"),p.classList.toggle("on",y),p.setAttribute("aria-pressed",y?"true":"false")})}m(),e.setHot([{label:"MILL",anchor:new B(on.lanternX-1.7,Xt.floorY+2.4,ct.z+1.5),fn:()=>h(0),state:()=>({on:l.as[0],run:l.run[0]})}].concat(l.M>1?[{label:"SAW",anchor:new B(Ze.fastX+.1,Ze.y+1.3,Ze.z),fn:()=>h(1),state:()=>({on:l.as[1],run:l.run[1]})}]:[]));let{mach:g,parts:b}=e;return e.pickList=[{object:g.lever,id:"mill"},{object:g.lantern,id:"mill"},{object:g.sawGroup,id:"saw"},{object:b.gate,id:"gate"},{object:b.handwheel,id:"gate"},{object:b.gateHouse,id:"gate"},{object:g.wheelWood,id:"wheel"},{object:g.drive,id:"wheel"},{object:b.dam,id:"dam"}],e.onTap=p=>{p==="mill"?h(0):p==="saw"&&l.M>1?h(1):t.inspect(p)},e.hotHidden=!1,{H:l,tips:"Drag the SLUICE GATE slider (or \xB1 buttons) to lift the gate and send water down the flume. Then ENGAGE the mill clutch"+(l.M>1?" and the saw belt":"")+" \u2014 tap the hotspots, the lever / belt in the scene, or the buttons. Every machine must run at once for 4 seconds. Drag the scene to look around.",explain:"A waterwheel converts moving water into rotation. More flow means a faster wheel and more power (power \u2248 efficiency \xD7 flow). A machine only works when the wheel can supply the power it needs \u2014 engage too many and the wheel slows under load.",hint:"Lift the gate until the POWER bar passes what the engaged machines need. Water you don't send to the wheel goes over the spillway. Engage every machine (tap the glowing hotspots) and hold it.",celebrateMs:1700,gauges:[{id:"f0",label:"FLOW TO WHEEL"},{id:"r0",label:"WHEEL SPEED"},{id:"p0",label:"POWER / NEED"},{id:"hold",label:"ALL RUNNING"},{id:"time",label:"TIME LEFT"}],step(p){if(!e.introDone&&!o()||c.done||c.failed)return;c.t+=p,l.step(p);let u=!0;for(let y=0;y<l.M;y++)l.run[y]||(u=!1);if(u?c.holdT+=p:c.holdT=0,c.holdT>=c.HOLD){c.done=!0;return}c.t>=c.TL&&(c.failed=!0,c.why="Time ran out before every machine was running.")},status(){return c.done?"success":c.failed?"fail":"playing"},efficient(){return c.done&&c.t<=c.TL*.6},failReason(){return c.why},celebrate(){e.celebrate()},skipIntro(){e.skipIntro()},project:(p,u,y)=>e.project(p,u,y),pixels:()=>e.pixels(),_view:{cam:e.cam},dbg(){let p=e.info();return{Q:l.Qg,P:l.P,D:l.D,rpm:l.rpm,a:l.gateA,sp:l.gateSet,as:l.as.slice(0,l.M),run:l.run.slice(0,l.M),holdT:c.holdT,t:c.t,TL:c.TL,Q0:l.Qref,cap:l.cap,eta:l.eta,M:l.M,wheelAngle:g.drive.rotation.x,stoneAngle:g.lantern.rotation.y,lift:e.vis.lift,gateY:b.gate.position.y,introDone:e.introDone,info:p.info,mem:p.mem,quality:p.quality,dpr:p.dpr,saw:e.vis.saw,beltX:e.vis.beltX}},gauge(p){let u=l.eta*l.cap,y=l.D>0&&l.P>=l.D-1e-9,v=Math.max(0,c.TL-c.t);p.gauge("f0",st(l.Qg)+" L/s",l.Qg/(l.cap*1.3),{tone:""}),p.gauge("r0",st(l.rpm*.2)+" rpm",l.rpm/62),p.gauge("p0",st(l.P)+" / "+st(l.D),l.P/u,{band:l.D>0?[Math.min(1,l.D/u),1]:null,tone:y?"good":l.D>0?"warn":""}),p.gauge("hold",st(c.holdT)+" / "+c.HOLD+" s",c.holdT/c.HOLD,{tone:c.holdT>0?"good":""}),p.gauge("time",st(v,0)+" s",v/c.TL,{tone:v<8?"warn":""}),m()},inspect(p){return p==="gate"?{t:"SLUICE GATE",b:"Opening "+Math.round(l.gateA*100)+"% \u2192 "+st(l.Qg)+" L/s to the wheel; the other "+st(l.Qref-l.Qg)+" L/s spills over the dam."}:p==="wheel"?{t:"OVERSHOT WATERWHEEL",b:st(l.rpm*.2)+" rpm \xB7 power "+st(l.P)+" (\u03B7 "+Math.round(l.eta*100)+"%) \xB7 water falls into the buckets and its weight turns the wheel."}:p==="mill"?{t:"MILL CLUTCH",b:"Needs "+l.defs[0].d+" power. "+(l.as[0]?l.run[0]?"Running: the crown wheel drives the lantern pinion and the millstone.":"Engaged but starved \u2014 open the gate more.":"Out of gear. Tap to engage.")}:p==="saw"?{t:"SAW BELT",b:"Needs "+(l.defs[1]?l.defs[1].d:4)+" power. "+(l.as[1]?l.run[1]?"Running: the belt rides the fast pulley and drives the blade.":"Engaged but starved \u2014 open the gate more.":"Belt on the loose pulley (idle). Tap to shift it.")}:p==="dam"?{t:"CONCRETE DAM",b:"A gravity dam: its weight resists the lake's push. Water not sent to the wheel goes over the stepped spillway."}:null},draw(p){$s(e,l),e.frame(p)},destroy(){e.setHot([]),e.pickList=[],e.onTap=null}}}function Yd(i,e){let{api:t,ctl:n,level:s,up:r}=i,a=i.kit,o=()=>a.reduced(),l=r.act|0,c=s,d=[6,9,10.5,7,10,8,9.5,5,10.5,9,6,10.5],f=1+Math.min(2,Math.floor((c-1)/3)),h=[];for(let M=0;M<f;M++)h.push(d[(c*2+M*5)%12]);let m=c<4?0:Math.min(.34,.08*(c-3)),g=Math.max(.5,1.4-.1*(c-1))+.3*l,b=3,p=24*f+6,u=[5,4,2.5,1][l],y=ss(s,r,{pin:9,M:1});y.engage(0,!0);let v={t:0,idx:0,holdT:0,done:!1,failed:!1};e.setShot("gate",!0);let _=_l(n,"db3dGate","SLUICE GATE",0,100,u,0,M=>{E(M)});function E(M){y.gateSet=je(Math.round(M/u)*u,0,100),_.set(y.gateSet),t.sfx("tick"),e.dirty()}Cn(n,"\u2212 GATE",()=>E(y.gateSet-u)),Cn(n,"GATE +",()=>E(y.gateSet+u));let{mach:S,parts:T}=e;e.setHot([{label:"GATE",anchor:new B(7,12.2,-16.35),fn:()=>t.inspect("gate"),state:()=>({run:Math.abs(y.Qg-h[Math.min(v.idx,f-1)])<=g})}]),e.pickList=[{object:T.gate,id:"gate"},{object:T.gateHouse,id:"gate"},{object:T.pondSurface,id:"pond"},{object:S.wheelWood,id:"wheel"},{object:T.flume,id:"flume"}],e.onTap=M=>t.inspect(M),e.hotHidden=!1;let x=()=>h[Math.min(v.idx,f-1)];return{H:y,tips:"Drag the SLUICE GATE slider (or use the \xB1 buttons) and watch the flow gauge and the wheel. Put the flow inside the pink band and keep it there until the bar fills. A deeper millpond pushes harder, so when the pond level changes the same gate gives a different flow.",explain:"A sluice gate regulates flow: more opening lets more water through, and deeper water (more head) pushes it out faster \u2014 flow \u2248 opening \xD7 \u221Ahead. Operators keep adjusting the gate to hold a target flow as conditions change.",hint:"Small gate changes make small flow changes. Move the gate until the FLOW bar sits in the green band, then keep still \u2014 if the pond level drifts, nudge the gate to compensate.",celebrateMs:1500,gauges:[{id:"gate",label:"GATE OPEN"},{id:"head",label:"POND LEVEL"},{id:"flow",label:"FLOW"},{id:"tgt",label:"TARGET"},{id:"hold",label:"HOLD"},{id:"time",label:"TIME LEFT"}],step(M){if(!(!e.introDone&&!o())&&!(v.done||v.failed)){if(v.t+=M,y.pin=9-m*(.5+.5*Math.sin(2*Math.PI*v.t/14)),y.step(M),Math.abs(y.Qg-x())<=g?v.holdT+=M:v.holdT=Math.max(0,v.holdT-2*M),v.holdT>=b){if(v.idx++,v.holdT=0,t.sfx("good"),v.idx>=f){v.done=!0;return}t.say("Target reached! New target: "+st(x())+" L/s")}v.t>=p&&(v.failed=!0)}},status(){return v.done?"success":v.failed?"fail":"playing"},efficient(){return v.done&&v.t<=p*.7},failReason(){return"Time ran out before the flow was held in the target band ("+st(x()-g)+"\u2013"+st(x()+g)+" L/s)."},celebrate(){e.celebrate()},skipIntro(){e.skipIntro()},project:(M,A,I)=>e.project(M,A,I),pixels:()=>e.pixels(),_view:{cam:e.cam},dbg(){let M=e.info();return{Q:y.Qg,h:y.pondL,a:y.gateA,sp:y.gateSet,tg:h.slice(),idx:v.idx,tol:g,holdT:v.holdT,TL:p,t:v.t,rpm:y.rpm,P:y.P,as:y.as.slice(0,1),run:y.run.slice(0,1),gateY:T.gate.position.y,introDone:e.introDone,info:M.info,mem:M.mem,quality:M.quality,wheelAngle:S.drive.rotation.x}},gauge(M){let A=Math.abs(y.Qg-x())<=g,I=13;M.gauge("gate",Math.round(y.gateA*100)+"%",y.gateA),M.gauge("head",st(y.pondL,2)+" m",(y.pondL-7.8)/1.4),M.gauge("flow",st(y.Qg)+" L/s",y.Qg/I,{band:[je((x()-g)/I,0,1),je((x()+g)/I,0,1)],tone:A?"good":""}),M.gauge("tgt",st(x())+" \xB1"+st(g)+" ("+Math.min(v.idx+1,f)+"/"+f+")",x()/I),M.gauge("hold",st(v.holdT)+" / "+b+" s",v.holdT/b,{tone:A?"good":""}),M.gauge("time",st(Math.max(0,p-v.t),0)+" s",Math.max(0,p-v.t)/p,{tone:p-v.t<6?"warn":""}),e.setAdvice(A?{tone:"good",text:"ON TARGET \u2014 hold it steady ("+st(y.Qg)+" L/s)"}:y.Qg<x()?{tone:"warn",text:"TOO LITTLE FLOW \u2014 open the gate a little"}:{tone:"warn",text:"TOO MUCH FLOW \u2014 close the gate a little"})},inspect(M){return M==="gate"?{t:"SLUICE GATE",b:"Opening "+Math.round(y.gateA*100)+"% \xD7 \u221Ahead "+st(Math.sqrt(Math.max(0,(y.pondL-7.8)/1.2)),2)+" \u2192 "+st(y.Qg)+" L/s. Drag the slider to move it."}:M==="pond"?{t:"MILLPOND",b:"Level "+st(y.pondL,2)+" m. The deeper it is, the harder the water pushes through the gate (flow \u221D \u221Ahead)."}:M==="wheel"?{t:"WATERWHEEL",b:st(y.rpm*.2)+" rpm \u2014 it follows the flow the gate lets through."}:M==="flume"?{t:"FLUME",b:"Carries "+st(y.Qg)+" L/s from the gate to the top of the wheel."}:null},draw(M){$s(e,y),e.frame(M)},destroy(){e.setHot([]),e.pickList=[],e.onTap=null,e.setAdvice(null)}}}function Zd(i,e){let{api:t,ctl:n,level:s,up:r}=i,a=i.kit,o=()=>a.reduced(),l=s,c=Math.min(l-1,10),d=5+.3*c,f=3+.35*c,h=Math.ceil(1.2*(d+f)*10)/10,m=36+2*Math.min(l-1,6),g=l>=4?2:1,b=[8+l*3%5,19+l*2%4,29+l%4],p=M=>{let A=d+.5*Math.sin(.9*M);return b.forEach(I=>{let R=(M-I)/6;Math.abs(R)<1&&(A+=f*(1-R*R))}),A},u=ss(s,r,{pin:7.8,M:1,inflow:p,relCoef:h,relSat:!0,dynamicLake:!0,rel:0});u.resCap=240*(1+.1*(r.liner|0)),u.resV=(8.7-6)/3.8*u.resCap,u.relSet=0,u.relA=0,u.gateSet=40,u.gateA=.4,u.engage(0,!0);let y=8.2,v=9.2,_={t:0,stress:0,inBand:0,done:!1,failed:!1,why:"",open:[!1,!1]};e.setShot("lake",!0);let E=[],S=()=>{u.relSet=_.open.slice(0,g).filter(Boolean).length/g;for(let M=0;M<g;M++)E[M].textContent=(g>1?"RELEASE "+"AB"[M]:"RESERVOIR RELEASE")+": "+(_.open[M]?"OPEN":"CLOSED"),E[M].classList.toggle("on",_.open[M]),E[M].setAttribute("aria-pressed",_.open[M]?"true":"false")},T=M=>{_.done||_.failed||(_.open[M]=!_.open[M],t.sfx(_.open[M]?"splash":"click"),S(),e.dirty())};for(let M=0;M<g;M++)E.push(Cn(n,"",()=>T(M),"150px"));S();let{parts:x}=e;return e.setHot([{label:"RELEASE",anchor:new B(7,14.6,-25.6),fn:()=>T(0),state:()=>({on:_.open[0]})}]),e.pickList=[{object:x.releaseGate,id:"rel"},{object:x.releaseWheel,id:"rel"},{object:x.millpond,id:"rel"},{object:x.dam,id:"dam"}],e.onTap=M=>{M==="rel"?T(0):t.inspect(M)},e.hotHidden=!1,{H:u,tips:"Open or close the RESERVOIR RELEASE (button, hotspot, or tap the release gate in the scene). Watch the forecast: store water before a dry spell, release it before the storm arrives. Keep the lake level inside the green band \u2014 too full spills over the dam, too low starves the mill.",explain:"A reservoir is a buffer: its level changes by inflow minus release. Holding water back before dry weather and releasing it ahead of a storm keeps the level safe \u2014 neither overflowing nor running dry.",hint:"The level only changes by inflow \u2212 release. If the forecast shows a storm coming, open the release early to make room; if it's dry, close it and keep the water.",celebrateMs:1500,gauges:[{id:"lev",label:"LAKE LEVEL"},{id:"in",label:"INFLOW"},{id:"out",label:"RELEASE"},{id:"st",label:"STRESS"},{id:"time",label:"TIME LEFT"}],step(M){if(!(!e.introDone&&!o())&&!(_.done||_.failed)){if(_.t+=M,u.step(M),u.overtopped){_.failed=!0,_.why="The reservoir overtopped the dam! More water came in than went out and the level reached the crest.";return}if(u.resL<y||u.resL>v?_.stress+=M:(_.stress=Math.max(0,_.stress-.6*M),_.inBand+=M),_.stress>=5){_.failed=!0,_.why="The lake stayed outside the safe band for too long ("+(u.resL>v?"too full \u2014 water was wasted over the spillway":"too low \u2014 the mill could not draw water")+").";return}_.t>=m&&(_.done=!0)}},status(){return _.done?"success":_.failed?"fail":"playing"},efficient(){return _.done&&_.inBand/Math.max(1,_.t)>=.92},failReason(){return _.why},celebrate(){e.celebrate()},skipIntro(){e.skipIntro()},project:(M,A,I)=>e.project(M,A,I),pixels:()=>e.pixels(),_view:{cam:e.cam},dbg(){let M=e.info();return{f:(u.resL-6)/3.8,L:u.resL,qin:u.Qin,qout:u.Qrel,open:_.open.slice(),valves:g,D:m,t:_.t,stress:_.stress,LO:y,HI:v,spill:u.spillRes,introDone:e.introDone,info:M.info,mem:M.mem,quality:M.quality,relA:u.relA,pondL:u.pondL}},gauge(M){let A=u.resL<y||u.resL>v;M.gauge("lev",st(u.resL,2)+" m",(u.resL-6)/3.8,{band:[(y-6)/3.8,(v-6)/3.8],tone:A?"warn":"good"}),M.gauge("in",st(u.Qin)+" L/s",u.Qin/(d+f+.5)),M.gauge("out",st(u.Qrel)+" L/s",u.Qrel/h),M.gauge("st",st(_.stress)+" / 5",_.stress/5,{tone:_.stress>.2?"warn":""}),M.gauge("time",st(Math.max(0,m-_.t),0)+" s",Math.max(0,m-_.t)/m),e.setForecast(p,_.t,14,d-1,d+f+1),e.setAdvice(u.resL>v?{tone:"bad",text:"TOO FULL \u2014 open the release (water is spilling over the dam)"}:u.resL<y?{tone:"bad",text:"TOO LOW \u2014 close the release and store water"}:u.Qin>d+f*.5?{tone:"info",text:"STORM INFLOW \u2014 the lake is rising"}:{tone:"good",text:"LAKE IN THE SAFE BAND"})},inspect(M){return M==="rel"?{t:"RESERVOIR RELEASE",b:(_.open.some(Boolean)?"Open: releasing up to ":"Closed: would release up to ")+st(h)+" L/s into the millpond. Tap to "+(_.open[0]?"close":"open")+"."}:M==="dam"?{t:"DAM",b:"Holds the lake at "+st(u.resL,2)+" m. Above 9.0 m water goes over the spillway; at 9.8 m it overtops the crest."}:null},draw(M){$s(e,u,{rain:je((u.Qin-d-.6)/f,0,1)}),e.frame(M)},destroy(){e.setHot([]),e.pickList=[],e.onTap=null,e.setAdvice(null),e.setForecast(null),e.vs.rain=0}}}function Jd(i,e){let{api:t,ctl:n,level:s,up:r}=i,a=i.kit,o=()=>a.reduced(),l=s,c=l>=3?3:2,d=l>=3,h=ss(s,r,{pin:null,M:c,inflow:R=>10.5+1.5*Math.sin(.35*R)*.5-(d&&R>18&&R<28?3:0),relCoef:20,relSat:!0,dynamicLake:!0,rel:.5,resFrac:.72});h.resCap=220*(1+.1*(r.liner|0)),h.resV=.72*h.resCap,h.pondV=.78*h.pondCap,h.relSet=.5,h.relA=.5,h.gateSet=50,h.gateA=.5;let m=Math.min(1,h.eta*13/h.defs.slice(0,c).reduce((R,L)=>R+L.d,0)),g=h.defs.slice(0,c).reduce((R,L)=>R+L.r,0),b=Math.round(.85*g*m*20),p=Math.round(46+14*Math.max(0,1-(l-1)/10)),u={t:0,done:!1,failed:!1,why:"",okRiver:0};e.setShot("factory",!0);let y=_l(n,"db3dRel","RELEASE",0,100,5,50,R=>{h.setRelease(R/100),t.sfx("tick"),e.dirty()}),v=_l(n,"db3dGate","SLUICE GATE",0,100,5,50,R=>{h.setGate(R),t.sfx("tick"),e.dirty()}),_=h.defs.slice(0,c).map((R,L)=>Cn(n,R.name+" \xB7 OFF",()=>E(L),"92px"));function E(R){u.done||u.failed||(h.engage(R),t.sfx(h.as[R]?"click":"tick"),t.inspect(["mill","saw","hammer"][R]),e.dirty())}function S(){_.forEach((R,L)=>{let P=h.as[L];R.textContent=h.defs[L].name+" \xB7 "+(P?"ON":"OFF"),R.classList.toggle("on",P),R.setAttribute("aria-pressed",P?"true":"false")})}S();let T=["factory","ocean","wheel","lake"],x=0,M=Cn(n,"VIEW: FACTORY",()=>{x=(x+1)%T.length,e.setShot(T[x]),M.textContent="VIEW: "+T[x].toUpperCase()},"120px"),{mach:A,parts:I}=e;return e.setHot([{label:"MILL",anchor:new B(on.lanternX-1.7,Xt.floorY+2.4,ct.z+1.5),fn:()=>E(0),state:()=>({on:h.as[0],run:h.run[0]})},{label:"SAW",anchor:new B(Ze.fastX+.1,Ze.y+1.3,Ze.z),fn:()=>E(1),state:()=>({on:h.as[1],run:h.run[1]})}].concat(c>=3?[{label:"HAMMER",anchor:new B(Nt.camX,3.6,Nt.shaftZ+1.7),fn:()=>E(2),state:()=>({on:h.as[2],run:h.run[2]})}]:[])),e.pickList=[{object:A.lever,id:"mill"},{object:A.lantern,id:"mill"},{object:A.sawGroup,id:"saw"},{object:I.hammer,id:"hammer"},{object:I.factory,id:"hammer"},{object:I.gate,id:"gate"},{object:I.releaseGate,id:"rel"},{object:A.wheelWood,id:"wheel"}],e.onTap=R=>{R==="mill"?E(0):R==="saw"?E(1):R==="hammer"&&c>=3?E(2):t.inspect(R)},e.hotHidden=!1,{H:h,tips:"Run the whole chain: set the RESERVOIR RELEASE (lake \u2192 millpond), the SLUICE GATE (millpond \u2192 wheel) and switch the machines on. Draining the lake too fast drops the head and the flow; too little water starves the wheel; every extra machine loads it. Reach the production target \u2014 and the spill and river show where the rest of the water goes.",explain:"A hydraulic system is a chain: store (reservoir), regulate (release and gate), convert (wheel), produce (machines). Each stage depends on the one before it: drain the lake too fast and the flow falls; open the gate too little and the wheel starves; overload it and everything slows.",hint:"Keep the LAKE near its level while the POWER bar stays above what the engaged machines need. If machines starve, open the gate or switch one off; if water spills, you are wasting power.",celebrateMs:1800,gauges:[{id:"lake",label:"LAKE LEVEL"},{id:"flow",label:"FLOW TO WHEEL"},{id:"pw",label:"POWER / NEED"},{id:"units",label:"UNITS MADE"},{id:"sea",label:"TO THE OCEAN"},{id:"time",label:"TIME LEFT"}],step(R){if(!(!e.introDone&&!o())&&!(u.done||u.failed)){if(u.t+=R,h.step(R),h.units>=b){u.done=!0;return}u.t>=p&&(u.failed=!0,u.why="Time ran out at "+Math.floor(h.units)+" / "+b+" units. "+(h.resL<8?"The lake ran low, so the head and flow dropped.":h.D>0&&h.f<1?"Power was below the machines' need.":h.D===0?"No machine was switched on.":"The system was not producing fast enough."))}},status(){return u.done?"success":u.failed?"fail":"playing"},efficient(){return u.done&&u.t<=p*.7},failReason(){return u.why},celebrate(){e.celebrate()},skipIntro(){e.skipIntro()},project:(R,L,P)=>e.project(R,L,P),pixels:()=>e.pixels(),_view:{cam:e.cam},dbg(){let R=e.info();return{L:h.resL,pondL:h.pondL,Qin:h.Qin,Qrel:h.Qrel,Qg:h.Qg,P:h.P,D:h.D,f:h.f,units:h.units,U:b,TL:p,t:u.t,Mn:c,rpm:h.rpm,as:h.as.slice(0,c),run:h.run.slice(0,c),Qriver:h.Qriver,spill:h.spillRes+h.spillPond,relA:h.relA,gateA:h.gateA,introDone:e.introDone,info:R.info,mem:R.mem,quality:R.quality}},gauge(R){let L=h.D>0&&h.P>=h.D-1e-9,P=h.eta*h.cap;R.gauge("lake",st(h.resL,2)+" m",(h.resL-6)/3.8,{band:[(8.2-6)/3.8,(9.2-6)/3.8],tone:h.resL<8||h.resL>9.3?"warn":"good"}),R.gauge("flow",st(h.Qg)+" L/s",h.Qg/14),R.gauge("pw",st(h.P)+" / "+st(h.D),h.P/P,{band:h.D>0?[Math.min(1,h.D/P),1]:null,tone:L?"good":h.D>0?"warn":""}),R.gauge("units",Math.floor(h.units)+" / "+b,h.units/b,{tone:"good"}),R.gauge("sea",st(h.Qriver)+" L/s",h.Qriver/20,{tone:"good"}),R.gauge("time",st(Math.max(0,p-u.t),0)+" s",Math.max(0,p-u.t)/p,{tone:p-u.t<10?"warn":""}),e.setAdvice(h.advice()),S()},inspect(R){return R==="mill"?{t:"MILL",b:"Needs "+h.defs[0].d+" power. "+(h.as[0]?h.run[0]?"Running.":"Starved \u2014 open the gate or drop a machine.":"Out of gear. Tap to engage.")}:R==="saw"?{t:"SAWMILL",b:"Needs "+h.defs[1].d+" power. "+(h.as[1]?h.run[1]?"Running.":"Starved.":"Belt idle. Tap to engage.")}:R==="hammer"?{t:"TRIP HAMMER",b:"Needs "+h.defs[2].d+" power. "+(h.as[2]?"Engaged.":"Off.")}:R==="gate"?{t:"SLUICE GATE",b:Math.round(h.gateA*100)+"% \u2192 "+st(h.Qg)+" L/s to the wheel."}:R==="rel"?{t:"RESERVOIR RELEASE",b:Math.round(h.relA*100)+"% \u2192 "+st(h.Qrel)+" L/s from the lake into the millpond."}:R==="wheel"?{t:"WATERWHEEL",b:st(h.rpm*.2)+" rpm \xB7 power "+st(h.P)}:null},draw(R){$s(e,h,{rain:(d&&u.t>16&&u.t<30,0)}),e.frame(R)},destroy(){e.setHot([]),e.pickList=[],e.onTap=null,e.setAdvice(null)}}}var xl={};function $d(i,e){let{api:t,ctl:n,level:s}=i,r=i.kit,a=()=>r.reduced(),o=s,l=5,c=4/l,d=4,f=Math.max(1,5-(o-1>>1)),h=[],m=.45+.03*Math.min(o,8),g=0;for(let U=0;U<l;U++)h[U]=Math.ceil((l-U)*c-1e-9),g+=h[U];let b=g+f,p=xl[o]?xl[o].slice():[0,0,0,0,0],u=e.lab,y=e.world.arch,v={phase:"build",lev:0,failRow:-1,leakT:0,holdT:0,t:0,attempts:0},_=[-3,0,3.2,6,8.2,9],E=U=>{let z=Math.min(l-1,Math.floor(U)),q=U-z;return _[z]+(_[z+1]-_[z])*je(q,0,1)},S=()=>p.reduce((U,z)=>U+z,0),T=(U,z)=>z>0?Math.ceil(z*c-1e-9):0,x=ss(s,M(i),{pin:9,M:1});function M(U){return U.up}e.setShot("lab",!0),u.show=!0,u.group.visible=!0,u.th=p,u.need=h;let A=()=>{u.th=p,u.rebuild(),y.rebuildDam(p.map(U=>1.8+1.7*U))};A();let I=U=>{if(v.phase!=="build")return;let z=p[U]+1,q=S()-p[U]+z;z>d||q>b?(z<=d&&q>b&&t.say("Out of blocks \u2014 lift cleared. Spend them where the pressure is highest."),p[U]=0,t.sfx("bad")):(p[U]=z,t.sfx("tick")),A(),e.dirty()},R=Cn(n,"\u25B6 FILL RESERVOIR",()=>{if(v.phase==="build"){if(S()===0){t.say("Build some wall first \u2014 tap a lift on the model."),t.sfx("bad");return}v.phase="fill",v.attempts++,t.sfx("splash")}},"150px"),L=Cn(n,"CLEAR WALL",()=>{if(v.phase==="build"){for(let U=0;U<l;U++)p[U]=0;A(),t.sfx("click")}},"110px"),P=[];for(let U=0;U<l;U++){let z=((jt[U]+jt[U+1])/2+3)*Ut.sc;P.push({label:"L"+(U+1)+" \xB7 "+p[U],text:()=>"L"+(U+1)+" \xB7 "+p[U],aria:"Wall lift "+(U+1),anchor:new B(Ut.x-2.1*Ut.k,(.55+z)*Ut.k,Ut.z-.2*Ut.k),fn:()=>I(U),state:()=>({on:p[U]>=h[U],run:!1})})}e.setHot(P),e.pickList=u.hits.map(U=>({object:U,id:"row"+U.userData.row})).concat([{object:e.parts.dam,id:"dam"}]),e.onTap=U=>{U.indexOf("row")===0?I(+U.slice(3)):t.inspect(U)},e.hotHidden=!1;let F=()=>v.phase==="leak"||v.phase==="failed";return{H:x,tips:"Tap a lift of the wall (the numbered markers or the section model) to thicken it \u2014 1 to 4 blocks, then back to 0. You only have a few blocks. Longer pink arrows = more pressure. Press FILL RESERVOIR when you are ready.",explain:"Water pressure grows with depth, so the deepest part of a dam carries the biggest load. That's why real dams are thick at the base and thinner toward the top: strength goes where the pressure is.",hint:"Look at the pink arrows on the model: the longest ones are at the bottom. Give the bottom lifts the thickest wall and the top lifts only a little.",celebrateMs:1500,gauges:[{id:"lev",label:"RESERVOIR"},{id:"prs",label:"BASE PRESSURE"},{id:"blk",label:"BLOCKS LEFT"}],step(U){if(!(!e.introDone&&!a()))if(v.t+=U,v.phase==="fill"){v.lev=Math.min(l,v.lev+m*U);for(let z=0;z<l;z++){let q=v.lev-z;if(q>0&&p[z]<T(z,q)){v.phase="leak",v.failRow=z,v.leakT=0,xl[o]=p.slice(),t.sfx("bad"),u.fail=z;return}}v.lev>=l&&(v.phase="hold",v.holdT=0)}else v.phase==="hold"?(v.holdT+=U,v.holdT>=1.5&&(v.phase="done",delete xl[o])):v.phase==="leak"&&(v.leakT+=U,v.leakT>=1.6&&(v.phase="failed"))},status(){return v.phase==="done"?"success":v.phase==="failed"?"fail":"playing"},efficient(){return S()<=g+1&&v.attempts===1},failReason(){let U=v.failRow;return"Lift "+(U+1)+" from the bottom leaked: the water above it pushes with pressure level "+h[U]+", but that lift only had "+p[U]+" block"+(p[U]===1?"":"s")+"."},celebrate(){e.celebrate()},skipIntro(){e.skipIntro()},project:(U,z,q)=>e.project(U,z,q),pixels:()=>e.pixels(),_view:{cam:e.cam},dbg(){let U=e.info();return{R:l,need:h.slice(),th:p.slice(),budget:b,used:S(),lev:v.lev,phase:v.phase,minTotal:g,resL:e.vs.resL,introDone:e.introDone,info:U.info,mem:U.mem,quality:U.quality,failRow:v.failRow}},gauge(U){let z=Math.max(0,v.lev),q=Math.min(4,Math.ceil(z*c-1e-9));U.gauge("lev",Math.round(v.lev/l*100)+"%",v.lev/l),U.gauge("prs","level "+q+"/4",Math.min(1,z*c/4),{tone:v.phase==="leak"?"warn":""}),U.gauge("blk",b-S()+" / "+b,(b-S())/b,{tone:b-S()===0?"warn":""}),R.disabled=L.disabled=v.phase!=="build",e.setAdvice(F()?{tone:"bad",text:"LEAK in lift "+(v.failRow+1)+" \u2014 it was too thin for the pressure there"}:v.phase==="fill"?{tone:"info",text:"RESERVOIR RISING \u2014 pressure grows with depth"}:v.phase==="hold"?{tone:"good",text:"THE WALL HOLDS"}:{tone:"info",text:"BUILD THE WALL: thickest at the base, where the pressure is greatest"})},inspect(U){if(U.indexOf("row")===0){let z=+U.slice(3);return{t:"WALL LIFT "+(z+1),b:"Pressure at full reservoir: level "+h[z]+" \xB7 you placed "+p[z]+". "+(p[z]>=h[z]?"Holds.":"Too thin!")}}return U==="dam"?{t:"THE DAM",b:"Your wall, lift by lift. The reservoir will push on it harder the deeper it gets."}:null},draw(U){let z=v.lev,q=E(z);if($s(e,x,{resL:q,pondL:Math.min(9,Math.max(7.8,q))}),u.update(z),v.phase==="leak"||v.phase==="failed"){let W=v.failRow,Z=1.8+1.7*p[W],j=-(17.6-Z),xe=Math.max(.4,(jt[W]+jt[W+1])/2);if(!a())for(let he=0;he<3;he++)e.em.spray.emit(-3+(Math.random()-.5)*4,xe,j+.2,(Math.random()-.5)*1.2,.4+Math.random(),3+Math.random()*3,.9,.2,.7)}e.frame(U)},destroy(){e.setHot([]),e.pickList=[],e.onTap=null,e.setAdvice(null),u.show=!1,u.group.visible=!1,u.fail=-1,y.rebuildDam(null)}}}function Kd(i,e){let{api:t,ctl:n,level:s}=i,r=i.kit,a=()=>r.reduced(),o=s,l=Math.min(3,1+(o-1>>1)),c=e.source;c.manual=!0,c.setLayout(l);let d=c.nodes,f=Object.keys(d).filter(L=>d[L].t==="fork"),h=Object.keys(d).filter(L=>d[L].t==="tgt"),m=6,g=18+3*Math.min(o-1,8),b={};h.forEach(L=>b[L]=0);let p=g*h.length,u=Math.max(1.3,1.9-.06*(o-1)),y=Math.round(p/m*u+5),v={t:0,done:!1,failed:!1,spilled:0},_=gl(c,m),E=ss(s,i.up,{pin:9,M:1});e.setShot("source",!0);let S=["\u25C0","\u25C0\u25B6","\u25B6"],T=["A","B","C"],x=L=>{v.done||v.failed||(d[L].m=(d[L].m+1)%3,t.sfx("click"),t.inspect("fork:"+L),_=gl(c,m),e.dirty(),A())},M=f.map((L,P)=>Cn(n,"",()=>x(L),"104px"));function A(){f.forEach((L,P)=>{M[P].textContent="FORK "+T[P]+" "+S[d[L].m]})}A();let I=ml.top+1.9;e.setHot(f.map((L,P)=>({label:"FORK "+T[P],text:()=>T[P]+" "+S[d[L].m],aria:"Fork "+T[P],anchor:new B(d[L].x,I,d[L].z),fn:()=>x(L),state:()=>({on:d[L].m!==1,run:!1})}))),e.pickList=c.hits.map(L=>({object:L,id:"fork:"+L.userData.fork})),e.onTap=L=>{L.indexOf("fork:")===0?x(L.slice(5)):t.inspect(L)},e.hotHidden=!1;let R=L=>je(b[L]/g,0,1);return{H:E,tips:"Tap a fork (the lettered markers, or the wooden flap on the terrace) to turn it: \u25C0 everything left \xB7 \u25C0\u25B6 split 50/50 \xB7 \u25B6 everything right. Fill every basin before time runs out \u2014 the RESERVOIR chute is a waterfall into the lake, and a full basin spills, so send the water on to the next one.",explain:"Water always follows the open channel downhill, and it separates wherever a channel forks. Controlling the forks controls where the water goes \u2014 and any water sent to a full basin or the scree drain is wasted.",hint:"Send all the water to one basin first, then turn the fork to the next. Never leave a fork pointing at the scree drain or at a basin that's already full.",celebrateMs:1500,gauges:[{id:"q",label:"SPRING FLOW"}].concat(h.map(L=>({id:L,label:d[L].name}))).concat([{id:"time",label:"TIME LEFT"}]),step(L){if(!e.introDone&&!a()||v.done||v.failed)return;v.t+=L,_=gl(c,m);let P=!0;h.forEach(F=>{let U=_.flows[F]||0;b[F]<g?b[F]=Math.min(g,b[F]+U*L):v.spilled+=U*L,b[F]<g-1e-6&&(P=!1)}),P?v.done=!0:v.t>=y&&(v.failed=!0)},status(){return v.done?"success":v.failed?"fail":"playing"},efficient(){return v.done&&v.t<=y*.8},failReason(){return"Time ran out. "+h.map(L=>d[L].name+" "+Math.round(R(L)*100)+"%").join(" \xB7 ")+"."},celebrate(){e.celebrate()},skipIntro(){e.skipIntro()},project:(L,P,F)=>e.project(L,P,F),pixels:()=>e.pixels(),_view:{cam:e.cam},dbg(){let L=e.info();return{Q0:m,need:g,TL:y,t:v.t,modes:f.map(P=>d[P].m),targets:h.map(P=>({id:P,name:d[P].name,v:b[P],need:g})),spilled:v.spilled,c:l,introDone:e.introDone,info:L.info,mem:L.mem,quality:L.quality,resL:e.vs.resL}},gauge(L){L.gauge("q",st(m)+" L/s",1),h.forEach(z=>{let q=R(z);L.gauge(z,Math.round(q*100)+"%",q,{tone:q>=.999?"good":""})});let P=Math.max(0,y-v.t);L.gauge("time",st(P)+" s",P/y,{tone:P<4?"warn":""});let F=Object.keys(_.drain).reduce((z,q)=>z+_.drain[q],0),U=h.reduce((z,q)=>z+(b[q]>=g-1e-6&&_.flows[q]||0),0);e.setAdvice(F>.2?{tone:"warn",text:"WATER IS BEING LOST DOWN THE SCREE DRAIN \u2014 turn the fork"}:U>.2?{tone:"warn",text:"A FULL BASIN IS SPILLING \u2014 send the water on to the next one"}:{tone:"good",text:"ALL THE WATER IS GOING TO USE"})},inspect(L){if(L.indexOf("fork:")===0){let P=L.slice(5);return{t:"FORK "+T[f.indexOf(P)],b:["Sends everything LEFT.","Splits 50/50.","Sends everything RIGHT."][d[P].m]+" Tap to change."}}return null},draw(L){let P=_.flows.T1||0,F=6+3*R("T1"),U={};h.forEach(z=>U[z]=R(z)),c.apply({Qmax:m,edge:_.edge,fill:U,drain:_.drain,fall:P}),$s(e,E,{resL:F,Qrel:0}),e.vs.resL=F,e.frame(L)},destroy(){e.setHot([]),e.pickList=[],e.onTap=null,e.setAdvice(null),c.manual=!1,c.setLayout(1)}}}function y_(){try{let i=document.createElement("canvas"),e=i.getContext("webgl2",{failIfMajorPerformanceCaveat:!1});if(!e)return!1;let t=e.getExtension("WEBGL_lose_context");return t&&t.loseContext(),!0}catch{return!1}}var Qd={0:Kd,1:$d,2:Zd,3:Yd,4:qd,5:Jd};function M_(i){let e=i.holder||(i.holder={});return e.stage||(e.stage=Xd(Wd(i))),e.stage}window.DamBuilder3D={version:"V2.2.19",supported:y_,tier:rh,has:i=>!!Qd[i],create(i,e){let t=Qd[i];if(!t)return null;let n=M_(e);return t(e,n)},dispose(i){i&&i.stage&&(i.stage.dispose(),i.stage=null)}};})();
