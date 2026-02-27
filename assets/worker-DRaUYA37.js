var e=((e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports))(((e,t)=>{t.exports={}}));function t(e,t){return t.forEach(function(t){t&&typeof t!=`string`&&!Array.isArray(t)&&Object.keys(t).forEach(function(n){if(n!==`default`&&!(n in e)){var r=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(e,n,r.get?r:{enumerable:!0,get:function(){return t[n]}})}})}),Object.freeze(e)}function n(e,t,n,r){function i(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||=Promise)(function(n,a){function o(e){try{c(r.next(e))}catch(e){a(e)}}function s(e){try{c(r.throw(e))}catch(e){a(e)}}function c(e){e.done?n(e.value):i(e.value).then(o,s)}c((r=r.apply(e,t||[])).next())})}function r(e,t){var n={label:0,sent:function(){if(a[0]&1)throw a[1];return a[1]},trys:[],ops:[]},r,i,a,o;return o={next:s(0),throw:s(1),return:s(2)},typeof Symbol==`function`&&(o[Symbol.iterator]=function(){return this}),o;function s(e){return function(t){return c([e,t])}}function c(s){if(r)throw TypeError(`Generator is already executing.`);for(;o&&(o=0,s[0]&&(n=0)),n;)try{if(r=1,i&&(a=s[0]&2?i.return:s[0]?i.throw||((a=i.return)&&a.call(i),0):i.next)&&!(a=a.call(i,s[1])).done)return a;switch(i=0,a&&(s=[s[0]&2,a.value]),s[0]){case 0:case 1:a=s;break;case 4:return n.label++,{value:s[1],done:!1};case 5:n.label++,i=s[1],s=[0];continue;case 7:s=n.ops.pop(),n.trys.pop();continue;default:if((a=n.trys,!(a=a.length>0&&a[a.length-1]))&&(s[0]===6||s[0]===2)){n=0;continue}if(s[0]===3&&(!a||s[1]>a[0]&&s[1]<a[3])){n.label=s[1];break}if(s[0]===6&&n.label<a[1]){n.label=a[1],a=s;break}if(a&&n.label<a[2]){n.label=a[2],n.ops.push(s);break}a[2]&&n.ops.pop(),n.trys.pop();continue}s=t.call(e,n)}catch(e){s=[6,e],i=0}finally{r=a=0}if(s[0]&5)throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}}var i=class{constructor(e,t){this.backend=e,this.dataMover=t,this.data=new WeakMap,this.dataIdsCount=0}get(e){return this.data.has(e)||this.dataMover.moveData(this.backend,e),this.data.get(e)}set(e,t){this.dataIdsCount++,this.data.set(e,t)}has(e){return this.data.has(e)}delete(e){return this.dataIdsCount--,this.data.delete(e)}numDataIds(){return this.dataIdsCount}},a=class{refCount(e){return o(`refCount`)}incRef(e){return o(`incRef`)}timerAvailable(){return!0}time(e){return o(`time`)}read(e){return o(`read`)}readSync(e){return o(`readSync`)}readToGPU(e,t){return o(`readToGPU`)}numDataIds(){return o(`numDataIds`)}disposeData(e,t){return o(`disposeData`)}write(e,t,n){return o(`write`)}move(e,t,n,r,i){return o(`move`)}memory(){return o(`memory`)}floatPrecision(){return o(`floatPrecision`)}epsilon(){return this.floatPrecision()===32?1e-7:1e-4}dispose(){return o(`dispose`)}};function o(e){throw Error(`'${e}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function s(e,t,n){return Math.max(e,Math.min(t,n))}function c(e,t,n){let r=e[t];e[t]=e[n],e[n]=r}function l(e,t){if(!e)throw Error(typeof t==`string`?t:t())}function u(e,t,n=``){l(m(e,t),()=>n+` Shapes ${e} and ${t} must match`)}function d(e){l(e!=null,()=>`The input to the tensor constructor must be a non-null value.`)}function f(e,t=[],n=!1){if(t??=[],Array.isArray(e)||T(e)&&!n)for(let r=0;r<e.length;++r)f(e[r],t,n);else t.push(e);return t}function p(e){if(e.length===0)return 1;let t=e[0];for(let n=1;n<e.length;n++)t*=e[n];return t}function m(e,t){if(e===t)return!0;if(e==null||t==null||e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}function h(e){return e%1==0}function g(e,t){return t<=e.length?e:e+` `.repeat(t-e.length)}function _(e,t){let n=1,r=-1;for(let t=0;t<e.length;++t)if(e[t]>=0)n*=e[t];else if(e[t]===-1){if(r!==-1)throw Error(`Shapes can only have 1 implicit size. Found -1 at dim ${r} and dim ${t}`);r=t}else if(e[t]<0)throw Error(`Shapes can not be < 0. Found ${e[t]} at dim ${t}`);if(r===-1){if(t>0&&t!==n)throw Error(`Size(${t}) must match the product of shape ${e}`);return e}if(n===0)throw Error(`Cannot infer the missing size in [${e}] when there are 0 elements`);if(t%n!==0)throw Error(`The implicit shape can't be a fractional number. Got ${t} / ${n}`);let i=e.slice();return i[r]=t/n,i}function v(e,t){let n=t.length;return e=e==null?t.map((e,t)=>t):[].concat(e),l(e.every(e=>e>=-n&&e<n),()=>`All values in axis param must be in range [-${n}, ${n}) but got axis ${e}`),l(e.every(e=>h(e)),()=>`All values in axis param must be integers but got axis ${e}`),e.map(e=>e<0?n+e:e)}function y(e,t){let n=[],r=[],i=t!=null&&Array.isArray(t)&&t.length===0,a=t==null||i?null:v(t,e).sort(),o=0;for(let t=0;t<e.length;++t){if(a!=null){if(a[o]===t&&e[t]!==1)throw Error(`Can't squeeze axis ${t} since its dim '${e[t]}' is not 1`);(a[o]==null||a[o]>t)&&e[t]===1&&(n.push(e[t]),r.push(t)),a[o]<=t&&o++}e[t]!==1&&(n.push(e[t]),r.push(t))}return{newShape:n,keptDims:r}}function b(e,t){let n=null;if(e==null||e===`float32`)n=new Float32Array(t);else if(e===`int32`)n=new Int32Array(t);else if(e===`bool`)n=new Uint8Array(t);else throw Error(`Unknown data type ${e}`);return n}function x(e,t){let n=null;if(e==null||e===`float32`)n=new Float32Array(t);else if(e===`int32`)n=new Int32Array(t);else if(e===`bool`)n=new Uint8Array(t);else if(e===`string`)n=Array(t);else throw Error(`Unknown data type ${e}`);return n}function S(e,t){for(let n=0;n<e.length;n++){let r=e[n];if(isNaN(r)||!isFinite(r))throw Error(`A tensor of type ${t} being uploaded contains ${r}.`)}}function C(e){return e===`bool`||e===`complex64`||e===`float32`||e===`int32`||e===`string`}function w(e,t){return!(t===`complex64`||t===`float32`&&e!==`complex64`||t===`int32`&&e!==`float32`&&e!==`complex64`||t===`bool`&&e===`bool`)}function T(e){return e instanceof Float32Array||e instanceof Int32Array||e instanceof Uint8Array||e instanceof Uint8ClampedArray}function E(e){if(e===`float32`||e===`int32`)return 4;if(e===`complex64`)return 8;if(e===`bool`)return 1;throw Error(`Unknown dtype ${e}`)}function D(e){if(e==null)return 0;let t=0;return e.forEach(e=>t+=e.length),t}function O(e){return typeof e==`string`||e instanceof String}function ee(e){return typeof e==`boolean`}function te(e){return typeof e==`number`}function ne(e){return Array.isArray(e)?ne(e[0]):e instanceof Float32Array?`float32`:e instanceof Int32Array||e instanceof Uint8Array||e instanceof Uint8ClampedArray?`int32`:te(e)?`float32`:O(e)?`string`:ee(e)?`bool`:`float32`}function re(e){return!!(e&&e.constructor&&e.call&&e.apply)}function k(e){let t=e.length;if(t<2)return[];let n=Array(t-1);n[t-2]=e[t-1];for(let r=t-3;r>=0;--r)n[r]=n[r+1]*e[r+1];return n}function ie(e,t,n,r=!1){let i=[];if(t.length===1){let a=t[0]*(r?2:1);for(let t=0;t<a;t++)i[t]=n[e+t]}else{let a=t[0],o=t.slice(1),s=o.reduce((e,t)=>e*t)*(r?2:1);for(let t=0;t<a;t++)i[t]=ie(e+t*s,o,n,r)}return i}function ae(e,t,n=!1){if(e.length===0)return t[0];let r=e.reduce((e,t)=>e*t)*(n?2:1);if(r===0)return[];if(r!==t.length)throw Error(`[${e}] does not match the input size ${t.length}${n?` for a complex tensor`:``}.`);return ie(0,e,t,n)}function oe(e,t){let n=A(e,t);for(let e=0;e<n.length;e++)n[e]=1;return n}function A(e,t){if(t==null||t===`float32`||t===`complex64`)return new Float32Array(e);if(t===`int32`)return new Int32Array(e);if(t===`bool`)return new Uint8Array(e);throw Error(`Unknown data type ${t}`)}function se(e,t){let n=e.reduce((e,t)=>e*t,1);if(t==null||t===`float32`)return ae(e,new Float32Array(n));if(t===`int32`)return ae(e,new Int32Array(n));if(t===`bool`)return ae(e,new Uint8Array(n));throw Error(`Unknown data type ${t}`)}function ce(e){e.forEach(t=>{l(Number.isInteger(t)&&t>=0,()=>`Tensor must have a shape comprised of positive integers but got shape [${e}].`)})}function le(e,t,n){if(t===0)return 0;if(t===1)return e[0];let r=e[e.length-1];for(let t=0;t<e.length-1;++t)r+=n[t]*e[t];return r}function ue(e,t,n){if(t===0)return[];if(t===1)return[e];let r=Array(t);for(let t=0;t<r.length-1;++t)r[t]=Math.floor(e/n[t]),e-=r[t]*n[t];return r[r.length-1]=e,r}function de(e){return e&&e.then&&typeof e.then==`function`}
/**
* @license
* Copyright 2017 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const fe=`tfjsflags`;var pe=class{constructor(e){this.global=e,this.flags={},this.flagRegistry={},this.urlFlags={},this.getQueryParams=me,this.populateURLFlags()}setPlatform(e,t){this.platform!=null&&(j().getBool(`IS_TEST`)||j().getBool(`PROD`)||console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${e}.`)),this.platformName=e,this.platform=t}registerFlag(e,t,n){if(this.flagRegistry[e]={evaluationFn:t,setHook:n},this.urlFlags[e]!=null){let t=this.urlFlags[e];j().getBool(`IS_TEST`)||j().getBool(`PROD`)||console.warn(`Setting feature override from URL ${e}: ${t}.`),this.set(e,t)}}async getAsync(e){return e in this.flags||(this.flags[e]=await this.evaluateFlag(e)),this.flags[e]}get(e){if(e in this.flags)return this.flags[e];let t=this.evaluateFlag(e);if(de(t))throw Error(`Flag ${e} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[e]=t,this.flags[e]}getNumber(e){return this.get(e)}getBool(e){return this.get(e)}getFlags(){return this.flags}get features(){return this.flags}set(e,t){if(this.flagRegistry[e]==null)throw Error(`Cannot set flag ${e} as it has not been registered.`);this.flags[e]=t,this.flagRegistry[e].setHook!=null&&this.flagRegistry[e].setHook(t)}evaluateFlag(e){if(this.flagRegistry[e]==null)throw Error(`Cannot evaluate flag '${e}': no evaluation function found.`);return this.flagRegistry[e].evaluationFn()}setFlags(e){this.flags=Object.assign({},e)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(this.global===void 0||this.global.location===void 0||this.global.location.search===void 0)return;let e=this.getQueryParams(this.global.location.search);fe in e&&e[fe].split(`,`).forEach(e=>{let[t,n]=e.split(`:`);this.urlFlags[t]=ge(t,n)})}};function me(e){let t={};return e.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,(e,...n)=>(he(t,n[0],n[1]),n.join(`=`))),t}function he(e,t,n){e[decodeURIComponent(t)]=decodeURIComponent(n||``)}function ge(e,t){if(t=t.toLowerCase(),t===`true`||t===`false`)return t===`true`;if(`${+t}`===t)return+t;throw Error(`Could not parse value flag value ${t} for flag ${e}.`)}function j(){return _e}let _e=null;function ve(e){_e=e}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
let ye;function be(){if(ye==null){let e;if(typeof window<`u`)e=window;else if(typeof global<`u`)e=global;else if(typeof process<`u`)e=process;else if(typeof self<`u`)e=self;else throw Error(`Could not find a global object`);ye=e}return ye}function xe(){let e=be();return e._tfGlobals??=new Map,e._tfGlobals}function Se(e,t){let n=xe();if(n.has(e))return n.get(e);{let r=t();return n.set(e,r),n.get(e)}}const Ce=`Acos`,we=`Acosh`,Te=`AddN`,Ee=`ArgMax`,De=`ArgMin`,Oe=`Asin`,ke=`Asinh`,Ae=`Atan`,je=`Atanh`,Me=`Atan2`,Ne=`AvgPool`,Pe=`AvgPool3D`,Fe=`BatchMatMul`,Ie=`BatchToSpaceND`,Le=`Bincount`,Re=`BroadcastArgs`,ze=`Cast`,Be=`Ceil`,Ve=`ClipByValue`,He=`Complex`,Ue=`ComplexAbs`,We=`Concat`,Ge=`Conv2D`,Ke=`Conv2DBackpropFilter`,qe=`Conv2DBackpropInput`,Je=`Conv3D`,Ye=`Conv3DBackpropInputV2`,Xe=`Cosh`,Ze=`Cumprod`,Qe=`Cumsum`,$e=`CropAndResize`,et=`DenseBincount`,tt=`DepthToSpace`,nt=`DepthwiseConv2dNative`,rt=`DepthwiseConv2dNativeBackpropFilter`,it=`DepthwiseConv2dNativeBackpropInput`,at=`Diag`,ot=`Dilation2D`,st=`Dilation2DBackpropInput`,ct=`Dilation2DBackpropFilter`,lt=`RealDiv`,ut=`Einsum`,dt=`Equal`,ft=`ExpandDims`,pt=`Expm1`,mt=`Fill`,ht=`FlipLeftRight`,gt=`Floor`,_t=`FloorDiv`,vt=`FusedBatchNorm`,yt=`GatherV2`,bt=`GatherNd`,xt=`Greater`,St=`GreaterEqual`,Ct=`Identity`,wt=`IFFT`,Tt=`Imag`,Et=`IsFinite`,Dt=`IsInf`,Ot=`IsNan`,kt=`LeakyRelu`,At=`Less`,jt=`LessEqual`,Mt=`LinSpace`,Nt=`Log1p`,Pt=`LogicalAnd`,Ft=`LogicalNot`,It=`LogicalOr`,Lt=`Maximum`,Rt=`MaxPool`,zt=`MaxPool3D`,Bt=`MaxPoolWithArgmax`,Vt=`Mean`,Ht=`Minimum`,Ut=`MirrorPad`,Wt=`Multinomial`,Gt=`Multiply`,Kt=`NotEqual`,qt=`NonMaxSuppressionV3`,Jt=`NonMaxSuppressionV4`,Yt=`NonMaxSuppressionV5`,Xt=`OnesLike`,Zt=`OneHot`,Qt=`Pack`,$t=`PadV2`,en=`Prelu`,tn=`Prod`,nn=`RaggedGather`,rn=`RaggedTensorToTensor`,an=`Range`,on=`Real`,sn=`Reciprocal`,cn=`Relu`,ln=`Reshape`,un=`ResizeNearestNeighbor`,dn=`ResizeBilinear`,fn=`Relu6`,pn=`Reverse`,mn=`Round`,hn=`Rsqrt`,gn=`ScatterNd`,_n=`SearchSorted`,vn=`Select`,yn=`Selu`,bn=`Slice`,xn=`Sinh`,Sn=`Sign`,Cn=`Sigmoid`,wn=`Softplus`,Tn=`Sqrt`,En=`SpaceToBatchND`,Dn=`SplitV`,On=`Softmax`,kn=`SparseFillEmptyRows`,An=`SparseReshape`,jn=`SparseSegmentMean`,Mn=`SparseSegmentSum`,Nn=`SparseToDense`,Pn=`SquaredDifference`,Fn=`StridedSlice`,In=`StringNGrams`,Ln=`StringSplit`,Rn=`StringToHashBucketFast`,zn=`Tanh`,Bn=`Tile`,Vn=`TopK`,Hn=`Transform`,Un=`Transpose`,Wn=`Unique`,Gn=`Unpack`,Kn=`UnsortedSegmentSum`,qn=`ZerosLike`,Jn=`Step`,Yn=`RotateWithOffset`,Xn=`_FusedMatMul`,Zn=`FusedConv2D`,Qn=`FusedDepthwiseConv2D`;
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function $n(...e){j().getBool(`IS_TEST`)||j().getBool(`PROD`)||console.warn(...e)}
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const er=Se(`kernelRegistry`,()=>new Map),tr=Se(`gradRegistry`,()=>new Map);function nr(e,t){let n=or(e,t);return er.get(n)}function rr(e){return tr.get(e)}function ir(e){let t=er.entries(),n=[];for(;;){let{done:r,value:i}=t.next();if(r)break;let[a,o]=i,[s]=a.split(`_`);s===e&&n.push(o)}return n}function ar(e){let{kernelName:t,backendName:n}=e,r=or(t,n);er.has(r)&&$n(`The kernel '${t}' for backend '${n}' is already registered`),er.set(r,e)}function or(e,t){return`${t}_${e}`}var sr=typeof globalThis<`u`?globalThis:typeof window<`u`?window:typeof global<`u`?global:typeof self<`u`?self:{};function cr(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,`default`)?e.default:e}function lr(e){if(e.__esModule)return e;var t=e.default;if(typeof t==`function`){var n=function e(){return this instanceof e?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};n.prototype=t.prototype}else n={};return Object.defineProperty(n,`__esModule`,{value:!0}),Object.keys(e).forEach(function(t){var r=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(n,t,r.get?r:{enumerable:!0,get:function(){return e[t]}})}),n}var ur=fr,dr=null;try{dr=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}function fr(e,t,n){this.low=e|0,this.high=t|0,this.unsigned=!!n}fr.prototype.__isLong__,Object.defineProperty(fr.prototype,`__isLong__`,{value:!0});function pr(e){return(e&&e.__isLong__)===!0}fr.isLong=pr;var mr={},hr={};function gr(e,t){var n,r,i;return t?(e>>>=0,(i=0<=e&&e<256)&&(r=hr[e],r)?r:(n=M(e,(e|0)<0?-1:0,!0),i&&(hr[e]=n),n)):(e|=0,(i=-128<=e&&e<128)&&(r=mr[e],r)?r:(n=M(e,e<0?-1:0,!1),i&&(mr[e]=n),n))}fr.fromInt=gr;function _r(e,t){if(isNaN(e))return t?Or:Dr;if(t){if(e<0)return Or;if(e>=wr)return Nr}else{if(e<=-Tr)return Pr;if(e+1>=Tr)return Mr}return e<0?_r(-e,t).neg():M(e%Cr|0,e/Cr|0,t)}fr.fromNumber=_r;function M(e,t,n){return new fr(e,t,n)}fr.fromBits=M;var vr=Math.pow;function yr(e,t,n){if(e.length===0)throw Error(`empty string`);if(e===`NaN`||e===`Infinity`||e===`+Infinity`||e===`-Infinity`)return Dr;if(typeof t==`number`?(n=t,t=!1):t=!!t,n||=10,n<2||36<n)throw RangeError(`radix`);var r;if((r=e.indexOf(`-`))>0)throw Error(`interior hyphen`);if(r===0)return yr(e.substring(1),t,n).neg();for(var i=_r(vr(n,8)),a=Dr,o=0;o<e.length;o+=8){var s=Math.min(8,e.length-o),c=parseInt(e.substring(o,o+s),n);if(s<8){var l=_r(vr(n,s));a=a.mul(l).add(_r(c))}else a=a.mul(i),a=a.add(_r(c))}return a.unsigned=t,a}fr.fromString=yr;function br(e,t){return typeof e==`number`?_r(e,t):typeof e==`string`?yr(e,t):M(e.low,e.high,typeof t==`boolean`?t:e.unsigned)}fr.fromValue=br;var xr=65536,Sr=1<<24,Cr=xr*xr,wr=Cr*Cr,Tr=wr/2,Er=gr(Sr),Dr=gr(0);fr.ZERO=Dr;var Or=gr(0,!0);fr.UZERO=Or;var kr=gr(1);fr.ONE=kr;var Ar=gr(1,!0);fr.UONE=Ar;var jr=gr(-1);fr.NEG_ONE=jr;var Mr=M(-1,2147483647,!1);fr.MAX_VALUE=Mr;var Nr=M(-1,-1,!0);fr.MAX_UNSIGNED_VALUE=Nr;var Pr=M(0,-2147483648,!1);fr.MIN_VALUE=Pr;var N=fr.prototype;N.toInt=function(){return this.unsigned?this.low>>>0:this.low},N.toNumber=function(){return this.unsigned?(this.high>>>0)*Cr+(this.low>>>0):this.high*Cr+(this.low>>>0)},N.toString=function(e){if(e||=10,e<2||36<e)throw RangeError(`radix`);if(this.isZero())return`0`;if(this.isNegative())if(this.eq(Pr)){var t=_r(e),n=this.div(t),r=n.mul(t).sub(this);return n.toString(e)+r.toInt().toString(e)}else return`-`+this.neg().toString(e);for(var i=_r(vr(e,6),this.unsigned),a=this,o=``;;){var s=a.div(i),c=(a.sub(s.mul(i)).toInt()>>>0).toString(e);if(a=s,a.isZero())return c+o;for(;c.length<6;)c=`0`+c;o=``+c+o}},N.getHighBits=function(){return this.high},N.getHighBitsUnsigned=function(){return this.high>>>0},N.getLowBits=function(){return this.low},N.getLowBitsUnsigned=function(){return this.low>>>0},N.getNumBitsAbs=function(){if(this.isNegative())return this.eq(Pr)?64:this.neg().getNumBitsAbs();for(var e=this.high==0?this.low:this.high,t=31;t>0&&!(e&1<<t);t--);return this.high==0?t+1:t+33},N.isZero=function(){return this.high===0&&this.low===0},N.eqz=N.isZero,N.isNegative=function(){return!this.unsigned&&this.high<0},N.isPositive=function(){return this.unsigned||this.high>=0},N.isOdd=function(){return(this.low&1)==1},N.isEven=function(){return(this.low&1)==0},N.equals=function(e){return pr(e)||(e=br(e)),this.unsigned!==e.unsigned&&this.high>>>31==1&&e.high>>>31==1?!1:this.high===e.high&&this.low===e.low},N.eq=N.equals,N.notEquals=function(e){return!this.eq(e)},N.neq=N.notEquals,N.ne=N.notEquals,N.lessThan=function(e){return this.comp(e)<0},N.lt=N.lessThan,N.lessThanOrEqual=function(e){return this.comp(e)<=0},N.lte=N.lessThanOrEqual,N.le=N.lessThanOrEqual,N.greaterThan=function(e){return this.comp(e)>0},N.gt=N.greaterThan,N.greaterThanOrEqual=function(e){return this.comp(e)>=0},N.gte=N.greaterThanOrEqual,N.ge=N.greaterThanOrEqual,N.compare=function(e){if(pr(e)||(e=br(e)),this.eq(e))return 0;var t=this.isNegative(),n=e.isNegative();return t&&!n?-1:!t&&n?1:this.unsigned?e.high>>>0>this.high>>>0||e.high===this.high&&e.low>>>0>this.low>>>0?-1:1:this.sub(e).isNegative()?-1:1},N.comp=N.compare,N.negate=function(){return!this.unsigned&&this.eq(Pr)?Pr:this.not().add(kr)},N.neg=N.negate,N.add=function(e){pr(e)||(e=br(e));var t=this.high>>>16,n=this.high&65535,r=this.low>>>16,i=this.low&65535,a=e.high>>>16,o=e.high&65535,s=e.low>>>16,c=e.low&65535,l=0,u=0,d=0,f=0;return f+=i+c,d+=f>>>16,f&=65535,d+=r+s,u+=d>>>16,d&=65535,u+=n+o,l+=u>>>16,u&=65535,l+=t+a,l&=65535,M(d<<16|f,l<<16|u,this.unsigned)},N.subtract=function(e){return pr(e)||(e=br(e)),this.add(e.neg())},N.sub=N.subtract,N.multiply=function(e){if(this.isZero())return Dr;if(pr(e)||(e=br(e)),dr)return M(dr.mul(this.low,this.high,e.low,e.high),dr.get_high(),this.unsigned);if(e.isZero())return Dr;if(this.eq(Pr))return e.isOdd()?Pr:Dr;if(e.eq(Pr))return this.isOdd()?Pr:Dr;if(this.isNegative())return e.isNegative()?this.neg().mul(e.neg()):this.neg().mul(e).neg();if(e.isNegative())return this.mul(e.neg()).neg();if(this.lt(Er)&&e.lt(Er))return _r(this.toNumber()*e.toNumber(),this.unsigned);var t=this.high>>>16,n=this.high&65535,r=this.low>>>16,i=this.low&65535,a=e.high>>>16,o=e.high&65535,s=e.low>>>16,c=e.low&65535,l=0,u=0,d=0,f=0;return f+=i*c,d+=f>>>16,f&=65535,d+=r*c,u+=d>>>16,d&=65535,d+=i*s,u+=d>>>16,d&=65535,u+=n*c,l+=u>>>16,u&=65535,u+=r*s,l+=u>>>16,u&=65535,u+=i*o,l+=u>>>16,u&=65535,l+=t*c+n*s+r*o+i*a,l&=65535,M(d<<16|f,l<<16|u,this.unsigned)},N.mul=N.multiply,N.divide=function(e){if(pr(e)||(e=br(e)),e.isZero())throw Error(`division by zero`);if(dr)return!this.unsigned&&this.high===-2147483648&&e.low===-1&&e.high===-1?this:M((this.unsigned?dr.div_u:dr.div_s)(this.low,this.high,e.low,e.high),dr.get_high(),this.unsigned);if(this.isZero())return this.unsigned?Or:Dr;var t,n,r;if(this.unsigned){if(e.unsigned||(e=e.toUnsigned()),e.gt(this))return Or;if(e.gt(this.shru(1)))return Ar;r=Or}else{if(this.eq(Pr))return e.eq(kr)||e.eq(jr)?Pr:e.eq(Pr)?kr:(t=this.shr(1).div(e).shl(1),t.eq(Dr)?e.isNegative()?kr:jr:(n=this.sub(e.mul(t)),r=t.add(n.div(e)),r));if(e.eq(Pr))return this.unsigned?Or:Dr;if(this.isNegative())return e.isNegative()?this.neg().div(e.neg()):this.neg().div(e).neg();if(e.isNegative())return this.div(e.neg()).neg();r=Dr}for(n=this;n.gte(e);){t=Math.max(1,Math.floor(n.toNumber()/e.toNumber()));for(var i=Math.ceil(Math.log(t)/Math.LN2),a=i<=48?1:vr(2,i-48),o=_r(t),s=o.mul(e);s.isNegative()||s.gt(n);)t-=a,o=_r(t,this.unsigned),s=o.mul(e);o.isZero()&&(o=kr),r=r.add(o),n=n.sub(s)}return r},N.div=N.divide,N.modulo=function(e){return pr(e)||(e=br(e)),dr?M((this.unsigned?dr.rem_u:dr.rem_s)(this.low,this.high,e.low,e.high),dr.get_high(),this.unsigned):this.sub(this.div(e).mul(e))},N.mod=N.modulo,N.rem=N.modulo,N.not=function(){return M(~this.low,~this.high,this.unsigned)},N.and=function(e){return pr(e)||(e=br(e)),M(this.low&e.low,this.high&e.high,this.unsigned)},N.or=function(e){return pr(e)||(e=br(e)),M(this.low|e.low,this.high|e.high,this.unsigned)},N.xor=function(e){return pr(e)||(e=br(e)),M(this.low^e.low,this.high^e.high,this.unsigned)},N.shiftLeft=function(e){return pr(e)&&(e=e.toInt()),(e&=63)==0?this:e<32?M(this.low<<e,this.high<<e|this.low>>>32-e,this.unsigned):M(0,this.low<<e-32,this.unsigned)},N.shl=N.shiftLeft,N.shiftRight=function(e){return pr(e)&&(e=e.toInt()),(e&=63)==0?this:e<32?M(this.low>>>e|this.high<<32-e,this.high>>e,this.unsigned):M(this.high>>e-32,this.high>=0?0:-1,this.unsigned)},N.shr=N.shiftRight,N.shiftRightUnsigned=function(e){if(pr(e)&&(e=e.toInt()),e&=63,e===0)return this;var t=this.high;if(e<32){var n=this.low;return M(n>>>e|t<<32-e,t>>>e,this.unsigned)}else if(e===32)return M(t,0,this.unsigned);else return M(t>>>e-32,0,this.unsigned)},N.shru=N.shiftRightUnsigned,N.shr_u=N.shiftRightUnsigned,N.toSigned=function(){return this.unsigned?M(this.low,this.high,!1):this},N.toUnsigned=function(){return this.unsigned?this:M(this.low,this.high,!0)},N.toBytes=function(e){return e?this.toBytesLE():this.toBytesBE()},N.toBytesLE=function(){var e=this.high,t=this.low;return[t&255,t>>>8&255,t>>>16&255,t>>>24,e&255,e>>>8&255,e>>>16&255,e>>>24]},N.toBytesBE=function(){var e=this.high,t=this.low;return[e>>>24,e>>>16&255,e>>>8&255,e&255,t>>>24,t>>>16&255,t>>>8&255,t&255]},fr.fromBytes=function(e,t,n){return n?fr.fromBytesLE(e,t):fr.fromBytesBE(e,t)},fr.fromBytesLE=function(e,t){return new fr(e[0]|e[1]<<8|e[2]<<16|e[3]<<24,e[4]|e[5]<<8|e[6]<<16|e[7]<<24,t)},fr.fromBytesBE=function(e,t){return new fr(e[4]<<24|e[5]<<16|e[6]<<8|e[7],e[0]<<24|e[1]<<16|e[2]<<8|e[3],t)};var Fr=cr(ur);
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const Ir=Fr||t({__proto__:null,default:Fr},[ur]);function Lr(e){return Ir.fromString(e,!0,16)}const Rr=Lr(`c3a5c85c97cb3127`),zr=Lr(`b492b66fbe98f273`),Br=Lr(`9ae16a3b2f90404f`);function Vr(e){return e.xor(e.shru(47))}function Hr(e,t,n){let r=e.slice(t,t+n);return Ir.fromBytes(Array.from(r),!0,!0)}function P(e,t){return Hr(e,t,8)}function Ur(e,t){return Hr(e,t,4)}function Wr(e,t){return t===0?e:e.shru(t).or(e.shl(64-t))}function Gr(e,t,n=Lr(`9ddfea08eb382d69`)){let r=e.xor(t).mul(n);r=r.xor(r.shru(47));let i=t.xor(r).mul(n);return i=i.xor(i.shru(47)),i=i.mul(n),i}function Kr(e,t,n,r,i,a){i=i.add(e),a=Wr(a.add(i).add(r),21);let o=i;return i=i.add(t),i=i.add(n),a=a.add(Wr(i,44)),[i.add(r),a.add(o)]}function qr(e,t,n,r){return Kr(P(e,t),P(e,t+8),P(e,t+16),P(e,t+24),n,r)}function Jr(e,t=e.length){if(t>=8){let n=Br.add(t*2),r=P(e,0).add(Br),i=P(e,t-8);return Gr(Wr(i,37).mul(n).add(r),Wr(r,25).add(i).mul(n),n)}if(t>=4){let n=Br.add(t*2);return Gr(Ur(e,0).shl(3).add(t),Ur(e,t-4),n)}if(t>0){let n=e[0],r=e[t>>1],i=e[t-1],a=n+(r<<8),o=t+(i<<2);return Vr(Br.mul(a).xor(Rr.mul(o))).mul(Br)}return Br}function Yr(e,t=e.length){let n=Br.add(t*2),r=P(e,0).mul(zr),i=P(e,8),a=P(e,t-8).mul(n),o=P(e,t-16).mul(Br);return Gr(Wr(r.add(i),43).add(Wr(a,30)).add(o),r.add(Wr(i.add(Br),18)).add(a),n)}function Xr(e,t=e.length){let n=Br.add(t*2),r=P(e,0).mul(Br),i=P(e,8),a=P(e,t-8).mul(n),o=P(e,t-16).mul(Br),s=Wr(r.add(i),43).add(Wr(a,30)).add(o),c=Gr(s,r.add(Wr(i.add(Br),18)).add(a),n),l=P(e,16).mul(n),u=P(e,24),d=s.add(P(e,t-32)).mul(n),f=c.add(P(e,t-24)).mul(n);return Gr(Wr(l.add(u),43).add(Wr(d,30)).add(f),l.add(Wr(u.add(r),18)).add(d),n)}function Zr(e,t=e.length){let n=Ir.fromNumber(81,!0);if(t<=32)return t<=16?Jr(e,t):Yr(e,t);if(t<=64)return Xr(e,t);let r=n,i=n.mul(zr).add(113),a=Vr(i.mul(Br).add(113)).mul(Br),o=[Ir.UZERO,Ir.UZERO],s=[Ir.UZERO,Ir.UZERO];r=r.mul(Br).add(P(e,0));let c=0,l=(t-1>>6)*64,u=l+(t-1&63)-63;do r=Wr(r.add(i).add(o[0]).add(P(e,c+8)),37).mul(zr),i=Wr(i.add(o[1]).add(P(e,c+48)),42).mul(zr),r=r.xor(s[1]),i=i.add(o[0]).add(P(e,c+40)),a=Wr(a.add(s[0]),33).mul(zr),o=qr(e,c,o[1].mul(zr),r.add(s[0])),s=qr(e,c+32,a.add(s[1]),i.add(P(e,c+16))),[a,r]=[r,a],c+=64;while(c!==l);let d=zr.add(a.and(255).shl(1));return c=u,s[0]=s[0].add(t-1&63),o[0]=o[0].add(s[0]),s[0]=s[0].add(o[0]),r=Wr(r.add(i).add(o[0]).add(P(e,c+8)),37).mul(d),i=Wr(i.add(o[1]).add(P(e,c+48)),42).mul(d),r=r.xor(s[1].mul(9)),i=i.add(o[0].mul(9).add(P(e,c+40))),a=Wr(a.add(s[0]),33).mul(d),o=qr(e,c,o[1].mul(d),r.add(s[0])),s=qr(e,c+32,a.add(s[1]),i.add(P(e,c+16))),[a,r]=[r,a],Gr(Gr(o[0],s[0],d).add(Vr(i).mul(Rr)).add(a),Gr(o[1],s[1],d).add(r),d)}
/**
* @license
* Copyright 2017 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Qr(e,t){return t===`string`?ni(e):ei([e],t)}function $r(e,t){return e instanceof Float32Array&&t===`float32`||e instanceof Int32Array&&t===`int32`||e instanceof Uint8Array&&t===`bool`}function ei(e,t){if(t===`string`)throw Error(`Cannot convert a string[] to a TypedArray`);if(Array.isArray(e)&&(e=f(e)),j().getBool(`DEBUG`)&&S(e,t),$r(e,t))return e;if(t==null||t===`float32`||t===`complex64`)return new Float32Array(e);if(t===`int32`)return new Int32Array(e);if(t===`bool`){let t=new Uint8Array(e.length);for(let n=0;n<t.length;++n)Math.round(e[n])!==0&&(t[n]=1);return t}else throw Error(`Unknown data type ${t}`)}function ti(){return j().platform.now()}function ni(e,t=`utf-8`){return t||=`utf-8`,j().platform.encode(e,t)}function ri(e,t=`utf-8`){return t||=`utf-8`,j().platform.decode(e,t)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var ii=class{constructor(e,t){this.backendTimer=e,this.logger=t,t??(this.logger=new oi)}profileKernel(e,t,n){let r,i=()=>{r=n()},a,o=ti();if(this.backendTimer.timerAvailable())a=this.backendTimer.time(i);else{i();for(let e of r)e.dataSync();a=Promise.resolve({kernelMs:ti()-o})}if(j().getBool(`CHECK_COMPUTATION_FOR_ERRORS`))for(let t=0;t<r.length;t++){let n=r[t];n.data().then(t=>{ai(t,n.dtype,e)})}return{kernelName:e,outputs:r,inputs:t,timeMs:a.then(e=>e.kernelMs),extraInfo:a.then(e=>e.getExtraProfileInfo==null?``:e.getExtraProfileInfo())}}logKernelProfile(e){let{kernelName:t,outputs:n,timeMs:r,inputs:i,extraInfo:a}=e;n.forEach(e=>{Promise.all([e.data(),r,a]).then(n=>{this.logger.logKernelProfile(t,e,n[0],n[1],i,n[2])})})}};function ai(e,t,n){if(t!==`float32`)return!1;for(let t=0;t<e.length;t++){let r=e[t];if(isNaN(r)||!isFinite(r))return console.warn(`Found ${r} in the result of '${n}'`),!0}return!1}var oi=class{logKernelProfile(e,t,n,r,i,a){let o=typeof r==`number`?g(`${r}ms`,9):r.error,s=g(e,25),c=t.rank,l=t.size,u=g(t.shape.toString(),14),d=``;for(let e in i){let n=i[e];if(n!=null){let r=n.shape||t.shape,i=r.length;d+=`${e}: ${i}D ${i>0?r:``} `}}console.log(`%c${s}\t%c${o}\t%c${c}D ${u}\t%c${l}\t%c${d}\t%c${a}`,`font-weight:bold`,`color:red`,`color:blue`,`color: orange`,`color: green`,`color: steelblue`)}};
/**
* @license
* Copyright 2017 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function si(e,t,n){let r={},i={};for(let e=0;e<t.length;e++)r[t[e].id]=!0;for(let n=0;n<e.length;n++){let a=e[n],o=a.inputs;for(let e in o){let n=o[e],s=!1;for(let e=0;e<t.length;e++)if(r[n.id]){a.outputs.forEach(e=>r[e.id]=!0),s=!0,i[a.id]=!0;break}if(s)break}}let a={};a[n.id]=!0;let o={};for(let t=e.length-1;t>=0;t--){let n=e[t],r=n.inputs;for(let e=0;e<n.outputs.length;e++)if(a[n.outputs[e].id]){for(let e in r)a[r[e].id]=!0,o[n.id]=!0;break}}let s=[];for(let t=0;t<e.length;t++){let n=e[t];if(i[n.id]&&o[n.id]){let e={};for(let t in n.inputs){let i=n.inputs[t];r[i.id]&&(e[t]=i)}let t=Object.assign({},n);t.inputs=e,t.outputs=n.outputs,s.push(t)}}return s}function ci(e,t,n,r){for(let i=t.length-1;i>=0;i--){let a=t[i],o=[];if(a.outputs.forEach(t=>{let n=e[t.id];n==null?o.push(null):o.push(n)}),a.gradient==null)throw Error(`Cannot compute gradient: gradient function not found for ${a.kernelName}.`);let s=a.gradient(o);for(let t in a.inputs){if(!(t in s))throw Error(`Cannot backprop through input ${t}. Available gradients found: ${Object.keys(s)}.`);let i=n(()=>s[t]());if(i.dtype!==`float32`)throw Error(`Error in gradient for op ${a.kernelName}. The gradient of input ${t} must have 'float32' dtype, but has '${i.dtype}'`);let o=a.inputs[t];if(!m(i.shape,o.shape))throw Error(`Error in gradient for op ${a.kernelName}. The gradient of input '${t}' has shape '${i.shape}', which does not match the shape of the input '${o.shape}'`);if(e[o.id]==null)e[o.id]=i;else{let t=e[o.id];e[o.id]=r(t,i),t.dispose()}}}}function li(e,t,n,r){let i=k(t),a=ui(e,t,n,i),o=t.length,s=pi(e,t,n,i,a),c=[`Tensor`];return r&&(c.push(`  dtype: ${n}`),c.push(`  rank: ${o}`),c.push(`  shape: [${t}]`),c.push(`  values:`)),c.push(s.map(e=>`    `+e).join(`
`)),c.join(`
`)}function ui(e,t,n,r){let i=p(t),a=r[r.length-1],o=Array(a).fill(0),s=t.length,c=n===`complex64`?mi(e):e;if(s>1)for(let e=0;e<i/a;e++){let t=e*a;for(let e=0;e<a;e++)o[e]=Math.max(o[e],di(c[t+e],0,n).length)}return o}function di(e,t,n){let r;return r=Array.isArray(e)?`${parseFloat(e[0].toFixed(7))} + ${parseFloat(e[1].toFixed(7))}j`:O(e)?`'${e}'`:n===`bool`?fi(e):parseFloat(e.toFixed(7)).toString(),g(r,t)}function fi(e){return e===0?`false`:`true`}function pi(e,t,n,r,i,a=!0){let o=n===`complex64`?2:1,s=t[0],c=t.length;if(c===0)return n===`complex64`?[di(mi(e)[0],0,n)]:n===`bool`?[fi(e[0])]:[e[0].toString()];if(c===1){if(s>20){let t=3*o,r=Array.from(e.slice(0,t)),a=Array.from(e.slice((s-3)*o,s*o));return n===`complex64`&&(r=mi(r),a=mi(a)),[`[`+r.map((e,t)=>di(e,i[t],n)).join(`, `)+`, ..., `+a.map((e,t)=>di(e,i[s-3+t],n)).join(`, `)+`]`]}return[`[`+(n===`complex64`?mi(e):Array.from(e)).map((e,t)=>di(e,i[t],n)).join(`, `)+`]`]}let l=t.slice(1),u=r.slice(1),d=r[0]*o,f=[];if(s>20){for(let t=0;t<3;t++){let r=t*d,a=r+d;f.push(...pi(e.slice(r,a),l,n,u,i,!1))}f.push(`...`);for(let t=s-3;t<s;t++){let r=t*d,a=r+d;f.push(...pi(e.slice(r,a),l,n,u,i,t===s-1))}}else for(let t=0;t<s;t++){let r=t*d,a=r+d;f.push(...pi(e.slice(r,a),l,n,u,i,t===s-1))}let p=c===2?`,`:``;f[0]=`[`+f[0]+p;for(let e=1;e<f.length-1;e++)f[e]=` `+f[e]+p;let m=`,
`;for(let e=2;e<c;e++)m+=`
`;return f[f.length-1]=` `+f[f.length-1]+`]`+(a?``:m),f}function mi(e){let t=[];for(let n=0;n<e.length;n+=2)t.push([e[n],e[n+1]]);return t}
/**
* @license
* Copyright 2017 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var hi=class{constructor(e,t,n){if(this.dtype=t,this.shape=e.slice(),this.size=p(e),n!=null){let e=n.length;l(e===this.size,()=>`Length of values '${e}' does not match the size inferred by the shape '${this.size}'.`)}if(t===`complex64`)throw Error(`complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).`);this.values=n||x(t,this.size),this.strides=k(e)}set(e,...t){t.length===0&&(t=[0]),l(t.length===this.rank,()=>`The number of provided coordinates (${t.length}) must match the rank (${this.rank})`);let n=this.locToIndex(t);this.values[n]=e}get(...e){e.length===0&&(e=[0]);let t=0;for(let n of e){if(n<0||n>=this.shape[t]){let t=`Requested out of range element at ${e}.   Buffer shape=${this.shape}`;throw Error(t)}t++}let n=e[e.length-1];for(let t=0;t<e.length-1;++t)n+=this.strides[t]*e[t];return this.values[n]}locToIndex(e){if(this.rank===0)return 0;if(this.rank===1)return e[0];let t=e[e.length-1];for(let n=0;n<e.length-1;++n)t+=this.strides[n]*e[n];return t}indexToLoc(e){if(this.rank===0)return[];if(this.rank===1)return[e];let t=Array(this.shape.length);for(let n=0;n<t.length-1;++n)t[n]=Math.floor(e/this.strides[n]),e-=t[n]*this.strides[n];return t[t.length-1]=e,t}get rank(){return this.shape.length}toTensor(){return gi().makeTensor(this.values,this.shape,this.dtype)}};let gi=null,_i=null;function vi(e){gi=e}function yi(e){_i=e}var bi=class{constructor(e,t,n,r){this.kept=!1,this.isDisposedInternal=!1,this.shape=e.slice(),this.dtype=t||`float32`,this.size=p(e),this.strides=k(e),this.dataId=n,this.id=r,this.rankType=this.rank<5?this.rank.toString():`higher`}get rank(){return this.shape.length}async buffer(){let e=await this.data();return _i.buffer(this.shape,this.dtype,e)}bufferSync(){return _i.buffer(this.shape,this.dtype,this.dataSync())}async array(){let e=await this.data();return ae(this.shape,e,this.dtype===`complex64`)}arraySync(){return ae(this.shape,this.dataSync(),this.dtype===`complex64`)}async data(){this.throwIfDisposed();let e=gi().read(this.dataId);if(this.dtype===`string`){let t=await e;try{return t.map(e=>ri(e))}catch{throw Error(`Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().`)}}return e}dataToGPU(e){return this.throwIfDisposed(),gi().readToGPU(this.dataId,e)}dataSync(){this.throwIfDisposed();let e=gi().readSync(this.dataId);if(this.dtype===`string`)try{return e.map(e=>ri(e))}catch{throw Error(`Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().`)}return e}async bytes(){this.throwIfDisposed();let e=await gi().read(this.dataId);return this.dtype===`string`?e:new Uint8Array(e.buffer)}dispose(){this.isDisposed||(gi().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw Error(`Tensor is disposed.`)}print(e=!1){return _i.print(this,e)}clone(){return this.throwIfDisposed(),_i.clone(this)}toString(e=!1){return li(this.dataSync(),this.shape,this.dtype,e)}cast(e){return this.throwIfDisposed(),_i.cast(this,e)}variable(e=!0,t,n){return this.throwIfDisposed(),gi().makeVariable(this,e,t,n)}};Object.defineProperty(bi,Symbol.hasInstance,{value:e=>!!e&&e.data!=null&&e.dataSync!=null&&e.throwIfDisposed!=null});function xi(){return Se(`Tensor`,()=>bi)}xi();var Si=class extends bi{constructor(e,t,n,r){super(e.shape,e.dtype,e.dataId,r),this.trainable=t,this.name=n}assign(e){if(e.dtype!==this.dtype)throw Error(`dtype of the new value (${e.dtype}) and previous value (${this.dtype}) must match`);if(!m(e.shape,this.shape))throw Error(`shape of the new value (${e.shape}) and previous value (${this.shape}) must match`);gi().disposeTensor(this),this.dataId=e.dataId,gi().incRef(this,null)}dispose(){gi().disposeVariable(this),this.isDisposedInternal=!0}};Object.defineProperty(Si,Symbol.hasInstance,{value:e=>e instanceof bi&&e.assign!=null&&e.assign instanceof Function});
/**
* @license
* Copyright 2017 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Ci;(function(e){e.R0=`R0`,e.R1=`R1`,e.R2=`R2`,e.R3=`R3`,e.R4=`R4`,e.R5=`R5`,e.R6=`R6`})(Ci||={});var wi;(function(e){e.float32=`float32`,e.int32=`int32`,e.bool=`int32`,e.complex64=`complex64`})(wi||={});var Ti;(function(e){e.float32=`float32`,e.int32=`int32`,e.bool=`bool`,e.complex64=`complex64`})(Ti||={});var Ei;(function(e){e.float32=`float32`,e.int32=`float32`,e.bool=`float32`,e.complex64=`complex64`})(Ei||={});var Di;(function(e){e.float32=`complex64`,e.int32=`complex64`,e.bool=`complex64`,e.complex64=`complex64`})(Di||={});const Oi={float32:Ei,int32:wi,bool:Ti,complex64:Di};function ki(e,t){if(e===`string`||t===`string`){if(e===`string`&&t===`string`)return`string`;throw Error(`Can not upcast ${e} with ${t}`)}return Oi[e][t]}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ai(e,t){if(e.dtype===t.dtype)return[e,t];let n=ki(e.dtype,t.dtype);return[e.cast(n),t.cast(n)]}function ji(e,t){l(e.dtype===t.dtype,()=>`The dtypes of the first(${e.dtype}) and second(${t.dtype}) input must match`)}function Mi(e){let t=[];return Ni(e,t,new Set),t}function Ni(e,t,n){if(e==null)return;if(e instanceof bi){t.push(e);return}if(!Pi(e))return;let r=e;for(let e in r){let i=r[e];n.has(i)||(n.add(i),Ni(i,t,n))}}function Pi(e){return Array.isArray(e)||typeof e==`object`}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Fi(e){return e.kernelName!=null}var Ii=class{constructor(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null,get kernelNames(){return Array.from(new Set(this.kernels.map(e=>e.name)))}}}dispose(){for(let e in this.registeredVariables)this.registeredVariables[e].dispose()}},Li=class e{constructor(e){this.ENV=e,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new Ii}async ready(){if(this.pendingBackendInit!=null)return this.pendingBackendInit.then(()=>{});if(this.backendInstance!=null)return;let e=this.getSortedBackends();for(let t=0;t<e.length;t++){let n=e[t];if(await this.initializeBackend(n).success){await this.setBackend(n);return}}throw Error(`Could not initialize any backends, all backend initializations failed.`)}get backend(){if(this.pendingBackendInit!=null)throw Error(`Backend '${this.backendName}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);if(this.backendInstance==null){let{name:e,asyncInit:t}=this.initializeBackendsAndReturnBest();if(t)throw Error(`The highest priority backend '${e}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);this.setBackend(e)}return this.backendInstance}backendNames(){return Object.keys(this.registryFactory)}findBackend(e){if(!(e in this.registry))if(e in this.registryFactory){let{asyncInit:t}=this.initializeBackend(e);if(t)return null}else return null;return this.registry[e]}findBackendFactory(e){return e in this.registryFactory?this.registryFactory[e].factory:null}registerBackend(e,t,n=1){return e in this.registryFactory?($n(`${e} backend was already registered. Reusing existing backend factory.`),!1):(this.registryFactory[e]={factory:t,priority:n},!0)}async setBackend(e){if(this.registryFactory[e]==null)throw Error(`Backend name '${e}' not found in registry`);if(this.backendName=e,this.registry[e]==null){this.backendInstance=null;let{success:t,asyncInit:n}=this.initializeBackend(e);if(!(n?await t:t))return!1}return this.backendInstance=this.registry[e],this.setupRegisteredKernels(),this.profiler=new ii(this.backendInstance),!0}setupRegisteredKernels(){ir(this.backendName).forEach(e=>{e.setupFunc!=null&&e.setupFunc(this.backendInstance)})}disposeRegisteredKernels(e){ir(e).forEach(t=>{t.disposeFunc!=null&&t.disposeFunc(this.registry[e])})}initializeBackend(e){let t=this.registryFactory[e];if(t==null)throw Error(`Cannot initialize backend ${e}, no registration found.`);try{let n=t.factory();if(n&&!(n instanceof a)&&typeof n.then==`function`){let t=++this.pendingBackendInitId,r=n.then(n=>t<this.pendingBackendInitId?!1:(this.registry[e]=n,this.pendingBackendInit=null,!0)).catch(n=>t<this.pendingBackendInitId?!1:(this.pendingBackendInit=null,$n(`Initialization of backend ${e} failed`),$n(n.stack||n.message),!1));return this.pendingBackendInit=r,{success:r,asyncInit:!0}}else return this.registry[e]=n,{success:!0,asyncInit:!1}}catch(t){return $n(`Initialization of backend ${e} failed`),$n(t.stack||t.message),{success:!1,asyncInit:!1}}}removeBackend(e){if(!(e in this.registryFactory))throw Error(`${e} backend not found in registry`);this.backendName===e&&this.pendingBackendInit!=null&&this.pendingBackendInitId++,e in this.registry&&(this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e]),delete this.registryFactory[e],this.backendName===e&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)}getSortedBackends(){if(Object.keys(this.registryFactory).length===0)throw Error(`No backend found in registry.`);return Object.keys(this.registryFactory).sort((e,t)=>this.registryFactory[t].priority-this.registryFactory[e].priority)}initializeBackendsAndReturnBest(){let e=this.getSortedBackends();for(let t=0;t<e.length;t++){let n=e[t],{success:r,asyncInit:i}=this.initializeBackend(n);if(i||r)return{name:n,asyncInit:i}}throw Error(`Could not initialize any backends, all backend initializations failed.`)}moveData(e,t){let n=this.state.tensorInfo.get(t),r=n.backend,i=this.readSync(t),a=r.refCount(t);r.disposeData(t,!0),n.backend=e,e.move(t,i,n.shape,n.dtype,a),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++}tidy(e,t){let n=null;if(t==null){if(typeof e!=`function`)throw Error(`Please provide a function to tidy()`);t=e}else{if(typeof e!=`string`&&!(e instanceof String))throw Error(`When calling with two arguments, the first argument to tidy() must be a string`);if(typeof t!=`function`)throw Error(`When calling with two arguments, the 2nd argument to tidy() must be a function`);n=e}let r;return this.scopedRun(()=>this.startScope(n),()=>this.endScope(r),()=>(r=t(),r instanceof Promise&&console.error(`Cannot return a Promise inside of tidy.`),r))}scopedRun(e,t,n){e();try{let e=n();return t(),e}catch(e){throw t(),e}}nextTensorId(){return e.nextTensorId++}nextVariableId(){return e.nextVariableId++}clone(e){let t=F.runKernel(Ct,{x:e}),n={x:e};return this.addTapeNode(this.state.activeScope.name,n,[t],e=>({x:()=>{let t={x:e};return F.runKernel(ze,t,{dtype:`float32`})}}),[],{}),t}runKernel(e,t,n){if(this.backendName??this.backend,nr(e,this.backendName)==null)throw Error(`Kernel '${e}' not registered for backend '${this.backendName}'`);return this.runKernelFunc({kernelName:e,inputs:t,attrs:n})}shouldCheckForMemLeaks(){return this.ENV.getBool(`IS_TEST`)}checkKernelForMemLeak(e,t,n){let r=this.backend.numDataIds(),i=0;n.forEach(e=>{i+=e.dtype===`complex64`?3:1});let a=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],o=r-t-i-a;if(o>0)throw Error(`Backend '${this.backendName}' has an internal memory leak (${o} data ids) after running '${e}'`)}runKernelFunc(e){let t,n=[],r=this.isTapeOn(),i=this.state.numBytes,a=this.state.numTensors;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0);let o;this.backendName??this.backend;let s,c=Fi(e)?e.kernelName:this.state.activeScope==null?``:this.state.activeScope.name;if(Fi(e)){let{kernelName:t,inputs:i,attrs:a}=e;this.backendName??this.backend;let c=nr(t,this.backendName);l(c!=null,()=>`Cannot find registered kernel '${t}' for backend '${this.backendName}'`),o=()=>{let e=this.backend.numDataIds();s=c.kernelFunc({inputs:i,attrs:a,backend:this.backend});let o=Array.isArray(s)?s:[s];this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(t,e,o);let l=o.map(e=>e.rank==null?this.makeTensorFromTensorInfo(e):e);if(r){let e=this.getTensorsForGradient(t,i,l);n=this.saveTensorsForBackwardMode(e)}return l}}else{let{forwardFunc:t}=e,i=e=>{r&&(n=e.map(e=>this.keep(this.clone(e))))};o=()=>{let e=this.backend.numDataIds();s=this.tidy(()=>t(this.backend,i));let n=Array.isArray(s)?s:[s];return this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(c,e,n),n}}let{inputs:u,attrs:d}=e,f=Fi(e)?null:e.backwardsFunc,p;return this.scopedRun(()=>this.state.kernelDepth++,()=>this.state.kernelDepth--,()=>{!this.ENV.getBool(`DEBUG`)&&!this.state.profiling?t=o():(p=this.profiler.profileKernel(c,u,()=>o()),this.ENV.getBool(`DEBUG`)&&this.profiler.logKernelProfile(p),t=p.outputs)}),r&&this.addTapeNode(c,u,t,f,n,d),this.state.profiling&&this.state.activeProfile.kernels.push({name:c,bytesAdded:this.state.numBytes-i,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-a,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(u).map(e=>u[e]==null?null:u[e].shape),outputShapes:t.map(e=>e.shape),kernelTimeMs:p.timeMs,extraInfo:p.extraInfo}),Array.isArray(s)?t:t[0]}saveTensorsForBackwardMode(e){return e.map(e=>this.keep(this.clone(e)))}getTensorsForGradient(e,t,n){let r=rr(e);if(r!=null){let e=r.inputsToSave||[],i=r.outputsToSave||[],a;r.saveAllInputs?(l(Array.isArray(t),()=>`saveAllInputs is true, expected inputs to be an array.`),a=Object.keys(t).map(e=>t[e])):a=e.map(e=>t[e]);let o=n.filter((e,t)=>i[t]);return a.concat(o)}return[]}makeTensor(e,t,n,r){if(e==null)throw Error(`Values passed to engine.makeTensor() are null`);n||=`float32`,r||=this.backend;let i=e;n===`string`&&O(e[0])&&(i=e.map(e=>ni(e)));let a=r.write(i,t,n),o=new bi(t,n,a,this.nextTensorId());if(this.trackTensor(o,r),n===`string`){let e=this.state.tensorInfo.get(a),t=D(i);this.state.numBytes+=t-e.bytes,e.bytes=t}return o}makeTensorFromDataId(e,t,n,r){n||=`float32`;let i={dataId:e,shape:t,dtype:n};return this.makeTensorFromTensorInfo(i,r)}makeTensorFromTensorInfo(e,t){let{dataId:n,shape:r,dtype:i}=e,a=new bi(r,i,n,this.nextTensorId());return this.trackTensor(a,t),a}makeVariable(e,t=!0,n,r){n||=this.nextVariableId().toString(),r!=null&&r!==e.dtype&&(e=e.cast(r));let i=new Si(e,t,n,this.nextTensorId());if(this.state.registeredVariables[i.name]!=null)throw Error(`Variable with name ${i.name} was already registered`);return this.state.registeredVariables[i.name]=i,this.incRef(i,this.backend),i}trackTensor(e,t){this.state.numTensors++,e.dtype===`string`&&this.state.numStringTensors++;let n=0;e.dtype!==`complex64`&&e.dtype!==`string`&&(n=e.size*E(e.dtype)),this.state.numBytes+=n,this.state.tensorInfo.has(e.dataId)||(this.state.numDataBuffers++,this.state.tensorInfo.set(e.dataId,{backend:t||this.backend,dtype:e.dtype,shape:e.shape,bytes:n})),e instanceof Si||this.track(e)}incRef(e,t){this.trackTensor(e,t),this.backend.incRef(e.dataId)}removeDataId(e,t){this.state.tensorInfo.has(e)&&this.state.tensorInfo.get(e).backend===t&&(this.state.tensorInfo.delete(e),this.state.numDataBuffers--)}disposeTensor(e){if(!this.state.tensorInfo.has(e.dataId))return;let t=this.state.tensorInfo.get(e.dataId);if(this.state.numTensors--,e.dtype===`string`&&(this.state.numStringTensors--,this.state.numBytes-=t.bytes),e.dtype!==`complex64`&&e.dtype!==`string`){let t=e.size*E(e.dtype);this.state.numBytes-=t}t.backend.disposeData(e.dataId)&&this.removeDataId(e.dataId,t.backend)}disposeVariables(){for(let e in this.state.registeredVariables){let t=this.state.registeredVariables[e];this.disposeVariable(t)}}disposeVariable(e){this.disposeTensor(e),this.state.registeredVariables[e.name]!=null&&delete this.state.registeredVariables[e.name]}memory(){let e=this.backend.memory();return e.numTensors=this.state.numTensors,e.numDataBuffers=this.state.numDataBuffers,e.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(e.unreliable=!0,e.reasons??=[],e.reasons.push(`Memory usage by string tensors is approximate (2 bytes per character)`)),e}async profile(e){this.state.profiling=!0;let t=this.state.numBytes,n=this.state.numTensors;this.state.activeProfile.kernels=[],this.state.activeProfile.result=await e(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max(...this.state.activeProfile.kernels.map(e=>e.totalBytesSnapshot)),this.state.activeProfile.newBytes=this.state.numBytes-t,this.state.activeProfile.newTensors=this.state.numTensors-n;for(let e of this.state.activeProfile.kernels)e.kernelTimeMs=await e.kernelTimeMs,e.extraInfo=await e.extraInfo;return this.state.activeProfile}isTapeOn(){return this.state.gradientDepth>0&&this.state.kernelDepth===0}addTapeNode(e,t,n,r,i,a){let o={id:this.state.nextTapeNodeId++,kernelName:e,inputs:t,outputs:n,saved:i},s=rr(e);s!=null&&(r=s.gradFunc),r!=null&&(o.gradient=e=>(e=e.map((e,t)=>{if(e==null){let e=n[t],r=A(e.size,e.dtype);return this.makeTensor(r,e.shape,e.dtype)}return e}),r(e.length>1?e:e[0],i,a))),this.state.activeTape.push(o)}keep(e){return e.kept=!0,e}startTape(){this.state.gradientDepth===0&&(this.state.activeTape=[]),this.state.gradientDepth++}endTape(){this.state.gradientDepth--}startScope(e){let t={track:[],name:`unnamed scope`,id:this.state.nextScopeId++};e&&(t.name=e),this.state.scopeStack.push(t),this.state.activeScope=t}endScope(e){let t=Mi(e),n=new Set(t.map(e=>e.id));for(let e=0;e<this.state.activeScope.track.length;e++){let t=this.state.activeScope.track[e];!t.kept&&!n.has(t.id)&&t.dispose()}let r=this.state.scopeStack.pop();this.state.activeScope=this.state.scopeStack.length===0?null:this.state.scopeStack[this.state.scopeStack.length-1],t.forEach(e=>{!e.kept&&e.scopeId===r.id&&this.track(e)})}gradients(e,t,n,r=!1){if(l(t.length>0,()=>`gradients() received an empty list of xs.`),n!=null&&n.dtype!==`float32`)throw Error(`dy must have 'float32' dtype, but has '${n.dtype}'`);let i=this.scopedRun(()=>this.startTape(),()=>this.endTape(),()=>this.tidy(`forward`,e));l(i instanceof bi,()=>`The result y returned by f() must be a tensor.`);let a=si(this.state.activeTape,t,i);if(!r&&a.length===0&&t.length>0)throw Error(`Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.`);return this.tidy(`backward`,()=>{let e={};e[i.id]=n??Ri(i.shape),ci(e,a,e=>this.tidy(e),Bi);let r=t.map(t=>e[t.id]);return this.state.gradientDepth===0&&(this.state.activeTape.forEach(e=>{for(let t of e.saved)t.dispose()}),this.state.activeTape=null),{value:i,grads:r}})}customGrad(e){return l(re(e),()=>`The f passed in customGrad(f) must be a function.`),(...t)=>{l(t.every(e=>e instanceof bi),()=>`The args passed in customGrad(f)(x1, x2,...) must all be tensors`);let n,r={};return t.forEach((e,t)=>{r[t]=e}),this.runKernelFunc({forwardFunc:(r,i)=>(n=e(...t,i),l(n.value instanceof bi,()=>"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor"),l(re(n.gradFunc),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function."),n.value),backwardsFunc:(e,r)=>{let i=n.gradFunc(e,r),a=Array.isArray(i)?i:[i];l(a.length===t.length,()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...)."),l(a.every(e=>e instanceof bi),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors.");let o={};return a.forEach((e,t)=>{o[t]=()=>e}),o},inputs:r})}}readSync(e){return this.state.tensorInfo.get(e).backend.readSync(e)}read(e){return this.state.tensorInfo.get(e).backend.read(e)}readToGPU(e,t){return this.state.tensorInfo.get(e).backend.readToGPU(e,t)}async time(e){let t=ti(),n=await this.backend.time(e);return n.wallMs=ti()-t,n}track(e){return this.state.activeScope!=null&&(e.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(e)),e}get registeredVariables(){return this.state.registeredVariables}reset(){for(let e in this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new Ii,this.registry)this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null}};Li.nextTensorId=0,Li.nextVariableId=0;function Ri(e){let t=oe(p(e),`float32`);return F.makeTensor(t,e,`float32`)}function zi(){let e=be();return e._tfengine??=new Li(new pe(e)),ve(e._tfengine.ENV),vi(()=>e._tfengine),e._tfengine}const F=zi();function Bi(e,t){let n={a:e,b:t};return F.runKernel(`Add`,n)}
/**
* @license
* Copyright 2017 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Vi(){return typeof window<`u`&&window.document!=null||typeof WorkerGlobalScope<`u`}
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const Hi=j();Hi.registerFlag(`DEBUG`,()=>!1,e=>{e&&console.warn(`Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.`)}),Hi.registerFlag(`IS_BROWSER`,()=>Vi()),Hi.registerFlag(`IS_NODE`,()=>typeof process<`u`&&process.versions!==void 0&&process.versions.node!==void 0),Hi.registerFlag(`IS_CHROME`,()=>typeof navigator<`u`&&navigator!=null&&navigator.userAgent!=null&&/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor)),Hi.registerFlag(`PROD`,()=>!1),Hi.registerFlag(`TENSORLIKE_CHECK_SHAPE_CONSISTENCY`,()=>Hi.getBool(`DEBUG`)),Hi.registerFlag(`DEPRECATION_WARNINGS_ENABLED`,()=>!0),Hi.registerFlag(`IS_TEST`,()=>!1),Hi.registerFlag(`CHECK_COMPUTATION_FOR_ERRORS`,()=>!0),Hi.registerFlag(`WRAP_TO_IMAGEBITMAP`,()=>!1),Hi.registerFlag(`ENGINE_COMPILE_ONLY`,()=>!1),Hi.registerFlag(`CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU`,()=>!1),Hi.registerFlag(`USE_SETTIMEOUTCUSTOM`,()=>!1);
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ui(e,t){let n=e;if(T(e))return t===`string`?[]:[e.length];if(!Array.isArray(e))return[];let r=[];for(;Array.isArray(n)||T(n)&&t!==`string`;)r.push(n.length),n=n[0];return Array.isArray(e)&&j().getBool(`TENSORLIKE_CHECK_SHAPE_CONSISTENCY`)&&Wi(e,r,[]),r}function Wi(e,t,n){if(n||=[],!Array.isArray(e)&&!T(e)){l(t.length===0,()=>`Element arr[${n.join(`][`)}] is a primitive, but should be an array/TypedArray of ${t[0]} elements`);return}l(t.length>0,()=>`Element arr[${n.join(`][`)}] should be a primitive, but is an array of ${e.length} elements`),l(e.length===t[0],()=>`Element arr[${n.join(`][`)}] should have ${t[0]} elements, but has ${e.length} elements`);let r=t.slice(1);for(let t=0;t<e.length;++t)Wi(e[t],r,n.concat(t))}function Gi(e,t,n,r){if(e!==`string_or_numeric`){if(e==null)throw Error(`Expected dtype cannot be null.`);if(e!==`numeric`&&e!==t||e===`numeric`&&t===`string`)throw Error(`Argument '${n}' passed to '${r}' must be ${e} tensor, but got ${t} tensor`)}}function I(e,t,n,r=`numeric`){if(e instanceof bi)return Gi(r,e.dtype,t,n),e;let i=ne(e);if(i!==`string`&&[`bool`,`int32`,`float32`].indexOf(r)>=0&&(i=r),Gi(r,i,t,n),e==null||!T(e)&&!Array.isArray(e)&&typeof e!=`number`&&typeof e!=`boolean`&&typeof e!=`string`){let r=e==null?`null`:e.constructor.name;throw Error(`Argument '${t}' passed to '${n}' must be a Tensor or TensorLike, but got '${r}'`)}let a=Ui(e,i);!T(e)&&!Array.isArray(e)&&(e=[e]);let o=i===`string`?f(e,[],!0):ei(e,i);return F.makeTensor(o,a,i)}function Ki(e,t,n,r=`numeric`){if(!Array.isArray(e))throw Error(`Argument ${t} passed to ${n} must be a \`Tensor[]\` or \`TensorLike[]\``);return e.map((e,i)=>I(e,`${t}[${i}]`,n,r))}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const qi=`__op`;function L(e){let t=Object.keys(e);if(t.length!==1)throw Error(`Please provide an object with a single key (operation name) mapping to a function. Got an object with ${t.length} keys.`);let n=t[0],r=e[n];n.endsWith(`_`)&&(n=n.substring(0,n.length-1)),n+=qi;let i=(...e)=>{F.startScope(n);try{let t=r(...e);return de(t)&&console.error(`Cannot return a Promise inside of tidy.`),F.endScope(t),t}catch(e){throw F.endScope(null),e}};return Object.defineProperty(i,`name`,{value:n,configurable:!0}),i}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ji(e,t){let n=I(e,`real`,`complex`),r=I(t,`imag`,`complex`);u(n.shape,r.shape,`real and imag shapes, ${n.shape} and ${r.shape}, must match in call to tf.complex().`);let i={real:n,imag:r};return F.runKernel(He,i)}const Yi=L({complex_:Ji});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Xi(e,t,n,r){if(r??=ne(e),r===`complex64`)throw Error(`Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).`);if(!T(e)&&!Array.isArray(e)&&typeof e!=`number`&&typeof e!=`boolean`&&typeof e!=`string`)throw Error(`values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray`);if(t!=null){ce(t);let e=p(t),r=p(n);l(e===r,()=>`Based on the provided shape, [${t}], the tensor should have ${e} values but has ${r}`);for(let e=0;e<n.length;++e){let r=n[e],i=e===n.length-1?r!==p(t.slice(e)):!0;l(n[e]===t[e]||!i,()=>`Error creating a new Tensor. Inferred shape (${n}) does not match the provided shape (${t}). `)}}return!T(e)&&!Array.isArray(e)&&(e=[e]),t||=n,e=r===`string`?f(e,[],!0):ei(e,r),F.makeTensor(e,t,r)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Zi(e,t,n){return Xi(e,t,Ui(e,n),n)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const Qi={float32:4,float16:2,int32:4,uint16:2,uint8:1,bool:1,complex64:8};async function $i(e,t){let n=[],r=[],i=Array.isArray(e)?e.map(e=>e.name):Object.keys(e);for(let a=0;a<i.length;++a){let o=i[a],s=Array.isArray(e)?e[a].tensor:e[o];if(s.dtype!==`float32`&&s.dtype!==`int32`&&s.dtype!==`bool`&&s.dtype!==`string`&&s.dtype!==`complex64`)throw Error(`Unsupported dtype in weight '${o}': ${s.dtype}`);let c={name:o,shape:s.shape,dtype:s.dtype};if(s.dtype===`string`){let e=new Promise(async e=>{let t=await s.bytes(),n=t.reduce((e,t)=>e+t.length,0)+4*t.length,r=new Uint8Array(n),i=0;for(let e=0;e<t.length;e++){let n=t[e],a=new Uint8Array(new Uint32Array([n.length]).buffer);r.set(a,i),i+=4,r.set(n,i),i+=n.length}e(r)});r.push(e)}else r.push(s.data());t!=null&&(c.group=t),n.push(c)}return{data:ta(await Promise.all(r)),specs:n}}function ea(e,t){let n={},r,i=0;for(let a of t){let t=a.name,o=a.dtype,s=a.shape,c=p(s),l;if(`quantization`in a){let n=a.quantization;if(n.dtype===`uint8`||n.dtype===`uint16`){if(!(`min`in n&&`scale`in n))throw Error(`Weight ${a.name} with quantization ${n.dtype} doesn't have corresponding metadata min and scale.`)}else if(n.dtype===`float16`){if(o!==`float32`)throw Error(`Weight ${a.name} is quantized with ${n.dtype} which only supports weights of type float32 not ${o}.`)}else throw Error(`Weight ${a.name} has unknown quantization dtype ${n.dtype}. Supported quantization dtypes are: 'uint8', 'uint16', and 'float16'.`);let s=Qi[n.dtype],u=e.slice(i,i+c*s),d=n.dtype===`uint8`?new Uint8Array(u):new Uint16Array(u);if(o===`float32`)if(n.dtype===`uint8`||n.dtype===`uint16`){l=new Float32Array(d.length);for(let e=0;e<d.length;e++){let t=d[e];l[e]=t*n.scale+n.min}}else if(n.dtype===`float16`)r===void 0&&(r=ga()),l=r(d);else throw Error(`Unsupported quantization type ${n.dtype} for weight type float32.`);else if(o===`int32`){if(n.dtype!==`uint8`&&n.dtype!==`uint16`)throw Error(`Unsupported quantization type ${n.dtype} for weight type int32.`);l=new Int32Array(d.length);for(let e=0;e<d.length;e++){let t=d[e];l[e]=Math.round(t*n.scale+n.min)}}else throw Error(`Unsupported dtype in weight '${t}': ${o}`);i+=c*s}else if(o===`string`){let t=p(a.shape);l=[];for(let n=0;n<t;n++){let t=new Uint32Array(e.slice(i,i+4))[0];i+=4;let n=new Uint8Array(e.slice(i,i+t));l.push(n),i+=t}}else{let r=Qi[o],a=e.slice(i,i+c*r);if(o===`float32`)l=new Float32Array(a);else if(o===`int32`)l=new Int32Array(a);else if(o===`bool`)l=new Uint8Array(a);else if(o===`complex64`){l=new Float32Array(a);let e=new Float32Array(l.length/2),r=new Float32Array(l.length/2);for(let t=0;t<e.length;t++)e[t]=l[t*2],r[t]=l[t*2+1];let i=Zi(e,s,`float32`),o=Zi(r,s,`float32`);n[t]=Yi(i,o),i.dispose(),o.dispose()}else throw Error(`Unsupported dtype in weight '${t}': ${o}`);i+=c*r}o!==`complex64`&&(n[t]=Zi(l,s,o))}return n}function ta(e){if(e===null)throw Error(`Invalid input value: ${JSON.stringify(e)}`);let t=0,n=[];e.forEach(e=>{if(t+=e.byteLength,n.push(e.byteLength===e.buffer.byteLength?e:new e.constructor(e)),!(e instanceof Float32Array||e instanceof Int32Array||e instanceof Uint8Array))throw Error(`Unsupported TypedArray subtype: ${e.constructor.name}`)});let r=new Uint8Array(t),i=0;return n.forEach(e=>{r.set(new Uint8Array(e.buffer),i),i+=e.byteLength}),r.buffer}const na=typeof Buffer<`u`&&(typeof Blob>`u`||typeof atob>`u`||typeof btoa>`u`);function ra(e){return na?Buffer.byteLength(e):new Blob([e]).size}function ia(e){if(na)return Buffer.from(e).toString(`base64`);let t=new Uint8Array(e),n=``;for(let e=0,r=t.length;e<r;e++)n+=String.fromCharCode(t[e]);return btoa(n)}function aa(e){if(na){let t=Buffer.from(e,`base64`);return t.buffer.slice(t.byteOffset,t.byteOffset+t.byteLength)}let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;++e)n.set([t.charCodeAt(e)],e);return n.buffer}function oa(e){if(e.length===1)return e[0];let t=0;e.forEach(e=>{t+=e.byteLength});let n=new Uint8Array(t),r=0;return e.forEach(e=>{n.set(new Uint8Array(e),r),r+=e.byteLength}),n.buffer}function sa(e){for(e=e.trim();e.endsWith(`/`);)e=e.slice(0,e.length-1);let t=e.split(`/`);return t[t.length-1]}function ca(e,t){let n={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,weightsManifest:t};return e.signature!=null&&(n.signature=e.signature),e.userDefinedMetadata!=null&&(n.userDefinedMetadata=e.userDefinedMetadata),e.modelInitializer!=null&&(n.modelInitializer=e.modelInitializer),e.trainingConfig!=null&&(n.trainingConfig=e.trainingConfig),n}function la(e,t,n){let r={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy};if(e.trainingConfig!=null&&(r.trainingConfig=e.trainingConfig),e.weightsManifest!=null){if(!t)throw Error(`modelJSON has weightsManifest but weightSpecs is null`);if(!n)throw Error(`modelJSON has weightsManifest but weightData is null`);r.weightSpecs=t,r.weightData=n}return e.signature!=null&&(r.signature=e.signature),e.userDefinedMetadata!=null&&(r.userDefinedMetadata=e.userDefinedMetadata),e.modelInitializer!=null&&(r.modelInitializer=e.modelInitializer),r}async function ua(e,t){let n,r;return e.weightsManifest!=null&&([n,r]=await t(e.weightsManifest)),la(e,n,r)}function da(e){if(e.modelTopology instanceof ArrayBuffer)throw Error(`Expected JSON model topology, received ArrayBuffer.`);return{dateSaved:new Date,modelTopologyType:`JSON`,modelTopologyBytes:e.modelTopology==null?0:ra(JSON.stringify(e.modelTopology)),weightSpecsBytes:e.weightSpecs==null?0:ra(JSON.stringify(e.weightSpecs)),weightDataBytes:e.weightData==null?0:e.weightData.byteLength}}function fa(e){let t=[];for(let n of e)t.push(...n.weights);return t}function pa(){let e=e=>{let t=e<<13,n=0;for(;!(t&8388608);)n-=8388608,t<<=1;return t&=-8388609,n+=947912704,t|n},t=new Uint32Array(2048);t[0]=0;for(let n=1;n<1024;n++)t[n]=e(n);for(let e=1024;e<2048;e++)t[e]=939524096+(e-1024<<13);return t}function ma(){let e=new Uint32Array(64);e[0]=0,e[31]=1199570944,e[32]=2147483648,e[63]=3347054592;for(let t=1;t<31;t++)e[t]=t<<23;for(let t=33;t<63;t++)e[t]=2147483648+(t-32<<23);return e}function ha(){let e=new Uint32Array(64);for(let t=0;t<64;t++)e[t]=1024;return e[0]=e[32]=0,e}function ga(){let e=pa(),t=ma(),n=ha();return r=>{let i=new ArrayBuffer(4*r.length),a=new Uint32Array(i);for(let i=0;i<r.length;i++){let o=r[i];a[i]=e[n[o>>10]+(o&1023)]+t[o>>10]}return new Float32Array(i)}}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var _a=class e{constructor(){this.saveRouters=[],this.loadRouters=[]}static getInstance(){return e.instance??=new e,e.instance}static registerSaveRouter(t){e.getInstance().saveRouters.push(t)}static registerLoadRouter(t){e.getInstance().loadRouters.push(t)}static getSaveHandlers(t){return e.getHandlers(t,`save`)}static getLoadHandlers(t,n){return e.getHandlers(t,`load`,n)}static getHandlers(t,n,r){let i=[];return(n===`load`?e.getInstance().loadRouters:e.getInstance().saveRouters).forEach(e=>{let n=e(t,r);n!==null&&i.push(n)}),i}};const va=e=>_a.registerSaveRouter(e),ya=e=>_a.registerLoadRouter(e),ba=e=>_a.getSaveHandlers(e),xa=(e,t)=>_a.getLoadHandlers(e,t),Sa=`tensorflowjs`,Ca=`models_store`,wa=`model_info_store`;function Ta(){if(!j().getBool(`IS_BROWSER`))throw Error(`Failed to obtain IndexedDB factory because the current environmentis not a web browser.`);let e=typeof window>`u`?self:window,t=e.indexedDB||e.mozIndexedDB||e.webkitIndexedDB||e.msIndexedDB||e.shimIndexedDB;if(t==null)throw Error(`The current browser does not appear to support IndexedDB.`);return t}function Ea(e){let t=e.result;t.createObjectStore(Ca,{keyPath:`modelPath`}),t.createObjectStore(wa,{keyPath:`modelPath`})}var Da=class{constructor(e){if(this.indexedDB=Ta(),e==null||!e)throw Error(`For IndexedDB, modelPath must not be null, undefined or empty.`);this.modelPath=e}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw Error(`BrowserLocalStorage.save() does not support saving model topology in binary formats yet.`);return this.databaseAction(this.modelPath,e)}async load(){return this.databaseAction(this.modelPath)}databaseAction(e,t){return new Promise((e,n)=>{let r=this.indexedDB.open(Sa,1);r.onupgradeneeded=()=>Ea(r),r.onsuccess=()=>{let i=r.result;if(t==null){let t=i.transaction(Ca,`readonly`),r=t.objectStore(Ca).get(this.modelPath);r.onsuccess=()=>{if(r.result==null)return i.close(),n(Error(`Cannot find model with path '${this.modelPath}' in IndexedDB.`));e(r.result.modelArtifacts)},r.onerror=e=>(i.close(),n(r.error)),t.oncomplete=()=>i.close()}else{let r=da(t),a=i.transaction(wa,`readwrite`),o=a.objectStore(wa),s=o.put({modelPath:this.modelPath,modelArtifactsInfo:r}),c;s.onsuccess=()=>{c=i.transaction(Ca,`readwrite`);let s=c.objectStore(Ca).put({modelPath:this.modelPath,modelArtifacts:t,modelArtifactsInfo:r});s.onsuccess=()=>e({modelArtifactsInfo:r}),s.onerror=e=>{o=a.objectStore(wa);let t=o.delete(this.modelPath);t.onsuccess=()=>(i.close(),n(s.error)),t.onerror=e=>(i.close(),n(s.error))}},s.onerror=e=>(i.close(),n(s.error)),a.oncomplete=()=>{c==null?i.close():c.oncomplete=()=>i.close()}}},r.onerror=e=>n(r.error)})}};Da.URL_SCHEME=`indexeddb://`;const Oa=e=>j().getBool(`IS_BROWSER`)&&!Array.isArray(e)&&e.startsWith(Da.URL_SCHEME)?ka(e.slice(Da.URL_SCHEME.length)):null;_a.registerSaveRouter(Oa),_a.registerLoadRouter(Oa);function ka(e){return new Da(e)}function Aa(e){return e.startsWith(Da.URL_SCHEME)?e.slice(Da.URL_SCHEME.length):e}var ja=class{constructor(){this.indexedDB=Ta()}async listModels(){return new Promise((e,t)=>{let n=this.indexedDB.open(Sa,1);n.onupgradeneeded=()=>Ea(n),n.onsuccess=()=>{let r=n.result,i=r.transaction(wa,`readonly`),a=i.objectStore(wa).getAll();a.onsuccess=()=>{let t={};for(let e of a.result)t[e.modelPath]=e.modelArtifactsInfo;e(t)},a.onerror=e=>(r.close(),t(a.error)),i.oncomplete=()=>r.close()},n.onerror=e=>t(n.error)})}async removeModel(e){return e=Aa(e),new Promise((t,n)=>{let r=this.indexedDB.open(Sa,1);r.onupgradeneeded=()=>Ea(r),r.onsuccess=()=>{let i=r.result,a=i.transaction(wa,`readwrite`),o=a.objectStore(wa),s=o.get(e),c;s.onsuccess=()=>{if(s.result==null)return i.close(),n(Error(`Cannot find model with path '${e}' in IndexedDB.`));{let r=o.delete(e),a=()=>{c=i.transaction(Ca,`readwrite`);let r=c.objectStore(Ca).delete(e);r.onsuccess=()=>t(s.result.modelArtifactsInfo),r.onerror=e=>n(s.error)};r.onsuccess=a,r.onerror=e=>(a(),i.close(),n(s.error))}},s.onerror=e=>(i.close(),n(s.error)),a.oncomplete=()=>{c==null?i.close():c.oncomplete=()=>i.close()}},r.onerror=e=>n(r.error)})}};
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const Ma=`tensorflowjs_models`,Na=`info`;function Pa(e){return{info:[Ma,e,Na].join(`/`),topology:[Ma,e,`model_topology`].join(`/`),weightSpecs:[Ma,e,`weight_specs`].join(`/`),weightData:[Ma,e,`weight_data`].join(`/`),modelMetadata:[Ma,e,`model_metadata`].join(`/`)}}function Fa(e){for(let t of Object.values(e))window.localStorage.removeItem(t)}function Ia(e){let t=e.split(`/`);if(t.length<3)throw Error(`Invalid key format: ${e}`);return t.slice(1,t.length-1).join(`/`)}function La(e){return e.startsWith(Ra.URL_SCHEME)?e.slice(Ra.URL_SCHEME.length):e}var Ra=class{constructor(e){if(!j().getBool(`IS_BROWSER`)||typeof window>`u`||window.localStorage===void 0)throw Error(`The current environment does not support local storage.`);if(this.LS=window.localStorage,e==null||!e)throw Error(`For local storage, modelPath must not be null, undefined or empty.`);this.modelPath=e,this.keys=Pa(this.modelPath)}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw Error(`BrowserLocalStorage.save() does not support saving model topology in binary formats yet.`);{let t=JSON.stringify(e.modelTopology),n=JSON.stringify(e.weightSpecs),r=da(e);try{this.LS.setItem(this.keys.info,JSON.stringify(r)),this.LS.setItem(this.keys.topology,t),this.LS.setItem(this.keys.weightSpecs,n),this.LS.setItem(this.keys.weightData,ia(e.weightData));let i={format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,signature:e.signature==null?void 0:e.signature,userDefinedMetadata:e.userDefinedMetadata==null?void 0:e.userDefinedMetadata,modelInitializer:e.modelInitializer==null?void 0:e.modelInitializer,trainingConfig:e.trainingConfig==null?void 0:e.trainingConfig};return this.LS.setItem(this.keys.modelMetadata,JSON.stringify(i)),{modelArtifactsInfo:r}}catch{throw Fa(this.keys),Error(`Failed to save model '${this.modelPath}' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=${r.modelTopologyBytes}, weightSpecsBytes=${r.weightSpecsBytes}, weightDataBytes=${r.weightDataBytes}.`)}}}async load(){let e=JSON.parse(this.LS.getItem(this.keys.info));if(e==null)throw Error(`In local storage, there is no model with name '${this.modelPath}'`);if(e.modelTopologyType!==`JSON`)throw Error(`BrowserLocalStorage does not support loading non-JSON model topology yet.`);let t={},n=JSON.parse(this.LS.getItem(this.keys.topology));if(n==null)throw Error(`In local storage, the topology of model '${this.modelPath}' is missing.`);t.modelTopology=n;let r=JSON.parse(this.LS.getItem(this.keys.weightSpecs));if(r==null)throw Error(`In local storage, the weight specs of model '${this.modelPath}' are missing.`);t.weightSpecs=r;let i=this.LS.getItem(this.keys.modelMetadata);if(i!=null){let e=JSON.parse(i);t.format=e.format,t.generatedBy=e.generatedBy,t.convertedBy=e.convertedBy,e.signature!=null&&(t.signature=e.signature),e.userDefinedMetadata!=null&&(t.userDefinedMetadata=e.userDefinedMetadata),e.modelInitializer!=null&&(t.modelInitializer=e.modelInitializer),e.trainingConfig!=null&&(t.trainingConfig=e.trainingConfig)}let a=this.LS.getItem(this.keys.weightData);if(a==null)throw Error(`In local storage, the binary weight values of model '${this.modelPath}' are missing.`);return t.weightData=aa(a),t}};Ra.URL_SCHEME=`localstorage://`;const za=e=>j().getBool(`IS_BROWSER`)&&!Array.isArray(e)&&e.startsWith(Ra.URL_SCHEME)?Ba(e.slice(Ra.URL_SCHEME.length)):null;_a.registerSaveRouter(za),_a.registerLoadRouter(za);function Ba(e){return new Ra(e)}var Va=class{constructor(){l(j().getBool(`IS_BROWSER`),()=>`Current environment is not a web browser`),l(typeof window>`u`||window.localStorage!==void 0,()=>`Current browser does not appear to support localStorage`),this.LS=window.localStorage}async listModels(){let e={};Ma+``,``+Na;for(let t=0;t<this.LS.length;++t){let n=this.LS.key(t);if(n.startsWith(`tensorflowjs_models/`)&&n.endsWith(`/info`)){let t=Ia(n);e[t]=JSON.parse(this.LS.getItem(n))}}return e}async removeModel(e){e=La(e);let t=Pa(e);if(this.LS.getItem(t.info)==null)throw Error(`Cannot find model at path '${e}'`);let n=JSON.parse(this.LS.getItem(t.info));return Fa(t),n}},Ha=class e{constructor(){this.managers={}}static getInstance(){return e.instance??=new e,e.instance}static registerManager(t,n){l(t!=null,()=>`scheme must not be undefined or null.`),t.endsWith(`://`)&&(t=t.slice(0,t.indexOf(`://`))),l(t.length>0,()=>`scheme must not be an empty string.`);let r=e.getInstance();l(r.managers[t]==null,()=>`A model store manager is already registered for scheme '${t}'.`),r.managers[t]=n}static getManager(t){let n=e.getInstance().managers[t];if(n==null)throw Error(`Cannot find model manager for scheme '${t}'`);return n}static getSchemes(){return Object.keys(e.getInstance().managers)}};function Ua(e){if(e.indexOf(`://`)===-1)throw Error(`The url string provided does not contain a scheme. Supported schemes are: ${Ha.getSchemes().join(`,`)}`);return{scheme:e.split(`://`)[0],path:e.split(`://`)[1]}}async function Wa(e,t,n=!1){l(e!==t,()=>`Old path and new path are the same: '${e}'`);let r=_a.getLoadHandlers(e);l(r.length>0,()=>`Copying failed because no load handler is found for source URL ${e}.`),l(r.length<2,()=>`Copying failed because more than one (${r.length}) load handlers for source URL ${e}.`);let i=r[0],a=_a.getSaveHandlers(t);l(a.length>0,()=>`Copying failed because no save handler is found for destination URL ${t}.`),l(a.length<2,()=>`Copying failed because more than one (${r.length}) save handlers for destination URL ${t}.`);let o=a[0],s=Ua(e).scheme,c=Ua(e).path,u=s===Ua(e).scheme,d=await i.load();n&&u&&await Ha.getManager(s).removeModel(c);let f=await o.save(d);return n&&!u&&await Ha.getManager(s).removeModel(c),f.modelArtifactsInfo}async function Ga(){let e=Ha.getSchemes(),t={};for(let n of e){let e=await Ha.getManager(n).listModels();for(let r in e){let i=n+`://`+r;t[i]=e[r]}}return t}async function Ka(e){let t=Ua(e);return Ha.getManager(t.scheme).removeModel(t.path)}async function qa(e,t){return Wa(e,t,!1)}async function Ja(e,t){return Wa(e,t,!0)}
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Ya=class{constructor(){this.messageName=`setTimeoutCustom`,this.functionRefs=[],this.handledMessageCount=0,this.hasEventListener=!1}fetch(e,t){return fetch(e,t)}now(){return performance.now()}encode(e,t){if(t!==`utf-8`&&t!==`utf8`)throw Error(`Browser's encoder only supports utf-8, but got ${t}`);return this.textEncoder??=new TextEncoder,this.textEncoder.encode(e)}decode(e,t){return new TextDecoder(t).decode(e)}setTimeoutCustom(e,t){if(!window||!j().getBool(`USE_SETTIMEOUTCUSTOM`)){setTimeout(e,t);return}this.functionRefs.push(e),setTimeout(()=>{window.postMessage({name:this.messageName,index:this.functionRefs.length-1},`*`)},t),this.hasEventListener||(this.hasEventListener=!0,window.addEventListener(`message`,e=>{if(e.source===window&&e.data.name===this.messageName){e.stopPropagation();let t=this.functionRefs[e.data.index];t(),this.handledMessageCount++,this.handledMessageCount===this.functionRefs.length&&(this.functionRefs=[],this.handledMessageCount=0)}},!0))}};if(j().get(`IS_BROWSER`)){j().setPlatform(`browser`,new Ya);try{Ha.registerManager(Ra.URL_SCHEME,new Va)}catch{}try{Ha.registerManager(Da.URL_SCHEME,new ja)}catch{}}
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Xa=class{constructor(){this.util=e(),this.textEncoder=new this.util.TextEncoder}fetch(e,t){return j().global.fetch(e,t)}now(){let e=process.hrtime();return e[0]*1e3+e[1]/1e6}encode(e,t){if(t!==`utf-8`&&t!==`utf8`)throw Error(`Node built-in encoder only supports utf-8, but got ${t}`);return this.textEncoder.encode(e)}decode(e,t){return e.length===0?``:new this.util.TextDecoder(t).decode(e)}};j().get(`IS_NODE`)&&!j().get(`IS_BROWSER`)&&j().setPlatform(`node`,new Xa);
/**
* @license
* Copyright 2020 Google Inc. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function R(e,t=`float32`,n){return t||=`float32`,ce(e),new hi(e,t,n)}
/**
* @license
* Copyright 2020 Google Inc. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Za(e,t){let n=I(e,`x`,`cast`);if(!C(t))throw Error(`Failed to cast to unknown dtype ${t}`);if(t===`string`&&n.dtype!==`string`||t!==`string`&&n.dtype===`string`)throw Error(`Only strings can be casted to strings`);let r={x:n},i={dtype:t};return F.runKernel(ze,r,i)}const Qa=L({cast_:Za});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function $a(e){let t={x:I(e,`x`,`clone`,`string_or_numeric`)};return F.runKernel(Ct,t)}const eo=L({clone_:$a});
/**
* @license
* Copyright 2020 Google Inc. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function to(e,t=!1){console.log(e.toString(t))}zi(),yi({buffer:R,cast:Qa,clone:eo,print:to});function no(e){return new Promise(e=>setTimeout(e)).then(e)}var ro=class e{constructor(t){if(!j().getBool(`IS_BROWSER`))throw Error(`browserDownloads() cannot proceed because the current environment is not a browser.`);t.startsWith(e.URL_SCHEME)&&(t=t.slice(e.URL_SCHEME.length)),(t==null||t.length===0)&&(t=`model`),this.modelJsonFileName=t+`.json`,this.weightDataFileName=t+`.weights.bin`}async save(e){if(typeof document>`u`)throw Error("Browser downloads are not supported in this environment since `document` is not present");let t=window.URL.createObjectURL(new Blob([e.weightData],{type:`application/octet-stream`}));if(e.modelTopology instanceof ArrayBuffer)throw Error(`BrowserDownloads.save() does not support saving model topology in binary formats yet.`);{let n=ca(e,[{paths:[`./`+this.weightDataFileName],weights:e.weightSpecs}]),r=window.URL.createObjectURL(new Blob([JSON.stringify(n)],{type:`application/json`})),i=this.modelJsonAnchor==null?document.createElement(`a`):this.modelJsonAnchor;if(i.download=this.modelJsonFileName,i.href=r,await no(()=>i.dispatchEvent(new MouseEvent(`click`))),e.weightData!=null){let e=this.weightDataAnchor==null?document.createElement(`a`):this.weightDataAnchor;e.download=this.weightDataFileName,e.href=t,await no(()=>e.dispatchEvent(new MouseEvent(`click`)))}return{modelArtifactsInfo:da(e)}}}};ro.URL_SCHEME=`downloads://`;var io=class{constructor(e){if(e==null||e.length<1)throw Error(`When calling browserFiles, at least 1 file is required, but received ${e}`);this.jsonFile=e[0],this.weightsFiles=e.slice(1)}async load(){return new Promise((e,t)=>{let n=new FileReader;n.onload=n=>{let r=JSON.parse(n.target.result),i=r.modelTopology;if(i==null){t(Error(`modelTopology field is missing from file ${this.jsonFile.name}`));return}if(r.weightsManifest==null){t(Error(`weightManifest field is missing from file ${this.jsonFile.name}`));return}if(this.weightsFiles.length===0){e({modelTopology:i});return}e(ua(r,e=>this.loadWeights(e)))},n.onerror=e=>t(`Failed to read model topology and weights manifest JSON from file '${this.jsonFile.name}'. BrowserFiles supports loading Keras-style tf.Model artifacts only.`),n.readAsText(this.jsonFile)})}loadWeights(e){let t=[],n=[];for(let r of e)t.push(...r.weights),n.push(...r.paths);let r=this.checkManifestAndWeightFiles(e),i=n.map(e=>this.loadWeightsFile(e,r[e]));return Promise.all(i).then(e=>[t,oa(e)])}loadWeightsFile(e,t){return new Promise((n,r)=>{let i=new FileReader;i.onload=e=>{let t=e.target.result;n(t)},i.onerror=t=>r(`Failed to weights data from file of path '${e}'.`),i.readAsArrayBuffer(t)})}checkManifestAndWeightFiles(e){let t=[],n=this.weightsFiles.map(e=>sa(e.name)),r={};for(let i of e)i.paths.forEach(e=>{let i=sa(e);if(t.indexOf(i)!==-1)throw Error(`Duplicate file basename found in weights manifest: '${i}'`);if(t.push(i),n.indexOf(i)===-1)throw Error(`Weight file with basename '${i}' is not provided.`);r[e]=this.weightsFiles[n.indexOf(i)]});if(t.length!==this.weightsFiles.length)throw Error(`Mismatch in the number of files in weights manifest (${t.length}) and the number of weight files provided (${this.weightsFiles.length}).`);return r}};_a.registerSaveRouter(e=>j().getBool(`IS_BROWSER`)&&!Array.isArray(e)&&e.startsWith(ro.URL_SCHEME)?ao(e.slice(ro.URL_SCHEME.length)):null);function ao(e=`model`){return new ro(e)}function oo(e){return new io(e)}
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function so(e,t,n,r){o(e),n??=0,r??=1,s(n,r);let i=0,a=a=>(a.then(a=>(t(n+ ++i/e.length*(r-n)),a)),a);function o(e){l(e!=null&&Array.isArray(e)&&e.length>0,()=>`promises must be a none empty array`)}function s(e,t){l(e>=0&&e<=1,()=>`Progress fraction must be in range [0, 1], but got startFraction ${e}`),l(t>=0&&t<=1,()=>`Progress fraction must be in range [0, 1], but got endFraction ${t}`),l(t>=e,()=>`startFraction must be no more than endFraction, but got startFraction ${e} and endFraction ${t}`)}return Promise.all(e.map(a))}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
async function co(e,t){t??={};let n=t.fetchFunc==null?j().platform.fetch:t.fetchFunc,r=e.map(e=>n(e,t.requestInit,{isBinary:!0})),i=(t.onProgress==null?await Promise.all(r):await so(r,t.onProgress,0,.5)).map(e=>e.arrayBuffer());return t.onProgress==null?await Promise.all(i):await so(i,t.onProgress,.5,1)}async function lo(e,t=``,n,r){return uo(e=>co(e,{requestInit:r}))(e,t,n)}function uo(e){return async(t,n=``,r)=>{let i=t.map(()=>!1),a={},o=r==null?[]:r.map(()=>!1),s=[];if(t.forEach((e,t)=>{let n=0;e.weights.forEach(e=>{let c=Qi[`quantization`in e?e.quantization.dtype:e.dtype]*p(e.shape),l=()=>{i[t]=!0,a[t]??(a[t]=[]),a[t].push({manifestEntry:e,groupOffset:n,sizeBytes:c})};r==null?l():r.forEach((t,n)=>{t===e.name&&(l(),o[n]=!0)}),s.push(e.name),n+=c})}),!o.every(e=>e)){let e=r.filter((e,t)=>!o[t]);throw Error(`Could not find weights in manifest with names: ${e.join(`, `)}. \nManifest JSON has weights with names: ${s.join(`, `)}.`)}let c=i.reduce((e,t,n)=>(t&&e.push(n),e),[]),l=[];c.forEach(e=>{t[e].paths.forEach(e=>{let t=n+(n.endsWith(`/`)?``:`/`)+e;l.push(t)})});let u=await e(l),d={},f=0;return c.forEach(e=>{let n=t[e].paths.length,r=0;for(let e=0;e<n;e++)r+=u[f+e].byteLength;let i=new ArrayBuffer(r),o=new Uint8Array(i),s=0;for(let e=0;e<n;e++){let t=new Uint8Array(u[f+e]);o.set(t,s),s+=t.byteLength}a[e].forEach(e=>{let t=ea(i.slice(e.groupOffset,e.groupOffset+e.sizeBytes),[e.manifestEntry]);for(let e in t)d[e]=t[e]}),f+=n}),d}}var fo=class{constructor(e,t){if(this.DEFAULT_METHOD=`POST`,t??={},this.weightPathPrefix=t.weightPathPrefix,this.onProgress=t.onProgress,this.weightUrlConverter=t.weightUrlConverter,t.fetchFunc==null?this.fetch=j().platform.fetch:(l(typeof t.fetchFunc==`function`,()=>"Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)"),this.fetch=t.fetchFunc),l(e!=null&&e.length>0,()=>`URL path for http must not be null, undefined or empty.`),Array.isArray(e)&&l(e.length===2,()=>`URL paths for http must have a length of 2, (actual length is ${e.length}).`),this.path=e,t.requestInit!=null&&t.requestInit.body!=null)throw Error(`requestInit is expected to have no pre-existing body, but has one.`);this.requestInit=t.requestInit||{}}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw Error(`BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.`);let t=Object.assign({method:this.DEFAULT_METHOD},this.requestInit);t.body=new FormData;let n=ca(e,[{paths:[`./model.weights.bin`],weights:e.weightSpecs}]);t.body.append(`model.json`,new Blob([JSON.stringify(n)],{type:`application/json`}),`model.json`),e.weightData!=null&&t.body.append(`model.weights.bin`,new Blob([e.weightData],{type:`application/octet-stream`}),`model.weights.bin`);let r=await this.fetch(this.path,t);if(r.ok)return{modelArtifactsInfo:da(e),responses:[r]};throw Error(`BrowserHTTPRequest.save() failed due to HTTP response status ${r.status}.`)}async load(){let e=await this.fetch(this.path,this.requestInit);if(!e.ok)throw Error(`Request to ${this.path} failed with status code ${e.status}. Please verify this URL points to the model JSON of the model to load.`);let t;try{t=await e.json()}catch{let e=`Failed to parse model JSON of response from ${this.path}.`;throw this.path.endsWith(`.pb`)?e+=` Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository.`:e+=` Please make sure the server is serving valid JSON for this request.`,Error(e)}let n=t.modelTopology,r=t.weightsManifest;if(n==null&&r==null)throw Error(`The JSON from HTTP path ${this.path} contains neither model topology or manifest for weights.`);return ua(t,e=>this.loadWeights(e))}async loadWeights(e){let[t,n]=po(Array.isArray(this.path)?this.path[1]:this.path),r=this.weightPathPrefix||t,i=fa(e),a=[],o=[];for(let t of e)for(let e of t.paths)this.weightUrlConverter==null?a.push(r+e+n):o.push(this.weightUrlConverter(e));return this.weightUrlConverter&&a.push(...await Promise.all(o)),[i,oa(await co(a,{requestInit:this.requestInit,fetchFunc:this.fetch,onProgress:this.onProgress}))]}};fo.URL_SCHEME_REGEX=/^https?:\/\//;function po(e){let t=e.lastIndexOf(`/`),n=e.lastIndexOf(`?`),r=e.substring(0,t),i=n>t?e.substring(n):``;return[r+`/`,i]}function mo(e){return e.match(fo.URL_SCHEME_REGEX)!=null}const ho=(e,t)=>{if(typeof fetch>`u`&&(t==null||t.fetchFunc==null))return null;{let n=!0;if(n=Array.isArray(e)?e.every(e=>mo(e)):mo(e),n)return go(e,t)}return null};_a.registerSaveRouter(ho),_a.registerLoadRouter(ho);function go(e,t){return new fo(e,t)}function _o(e,t){return go(e,t)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var vo=class{constructor(e){this.modelArtifacts=e}load(){return this.modelArtifacts}},yo=class{constructor(e){this.saveHandler=e}save(e){return this.saveHandler(e)}},bo=class{constructor(e){e.load&&(this.load=()=>Promise.resolve(e.load())),e.save&&(this.save=t=>Promise.resolve(e.save(t)))}};function xo(e,t,n,r){return new bo(So(...arguments))}function So(e,t,n,r){return arguments.length===1?e.modelTopology!=null||e.weightSpecs!=null?new vo(e):(console.warn(`Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release.`),new vo({modelTopology:e})):(console.warn(`Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release.`),new vo({modelTopology:e,weightSpecs:t,weightData:n,trainingConfig:r}))}function Co(e){return new yo(e)}function wo(e){return new yo(e)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var To=Object.freeze({__proto__:null,browserFiles:oo,browserHTTPRequest:_o,concatenateArrayBuffers:oa,copyModel:qa,decodeWeights:ea,encodeWeights:$i,fromMemory:xo,fromMemorySync:So,getLoadHandlers:xa,getModelArtifactsForJSON:ua,getModelArtifactsForJSONSync:la,getModelArtifactsInfoForJSON:da,getSaveHandlers:ba,getWeightSpecs:fa,http:go,isHTTPScheme:mo,listModels:Ga,loadWeights:lo,moveModel:Ja,registerLoadRouter:ya,registerSaveRouter:va,removeModel:Ka,weightsLoaderFactory:uo,withSaveHandler:Co,withSaveHandlerSync:wo});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Eo(e,t,n=!1,r=!1){let i=I(e,`a`,`matMul`),a=I(t,`b`,`matMul`);[i,a]=Ai(i,a);let o={a:i,b:a},s={transposeA:n,transposeB:r};return F.runKernel(Fe,o,s)}const z=L({matMul_:Eo});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Do(e,t,n=1,r=0,i=`int32`){if(t<2)throw Error(`Error in oneHot: depth must be >=2, but it is ${t}`);let a={indices:I(e,`indices`,`oneHot`,`int32`)},o={dtype:i,depth:t,onValue:n,offValue:r};return F.runKernel(Zt,a,o)}const Oo=L({oneHot_:Do});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ko(){return F}function Ao(e,t){return F.tidy(e,t)}function jo(e){Mi(e).forEach(e=>e.dispose())}function Mo(e){return F.keep(e)}function No(e){return F.setBackend(e)}function Po(e,t,n=1){return F.registerBackend(e,t,n)}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Fo(e){let t={input:I(e,`input`,`imag`)};return F.runKernel(Tt,t)}const Io=L({imag_:Fo});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Lo(e){let t={x:I(e,`x`,`neg`)};return F.runKernel(`Neg`,t)}const Ro=L({neg_:Lo});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function zo(e){let t={input:I(e,`input`,`real`)};return F.runKernel(on,t)}const Bo=L({real_:zo});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Vo(e,t,n){let r=I(e,`x`,`transpose`);if(t??=r.shape.map((e,t)=>t).reverse(),l(r.rank===t.length,()=>`Error in transpose: rank of input ${r.rank} must match length of perm ${t}.`),t.forEach(e=>{l(e>=0&&e<r.rank,()=>`All entries in 'perm' must be between 0 and ${r.rank-1} but got ${t}`)}),r.rank<=1)return r.clone();let i={x:r},a={perm:t};return r.dtype===`complex64`?Ao(()=>{let e=Bo(r),t=Io(r);return e=F.runKernel(Un,{x:e},a),t=F.runKernel(Un,{x:t},a),n&&(t=Ro(t)),Yi(e,t)}):F.runKernel(Un,i,a)}const Ho=L({transpose_:Vo});
/**
* @license
* Copyright 2017 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Uo(e,t){let n=e.length,r=[];for(let i=0;i<n;i++){let a=n-1-i,o=e[a]||1;(t[t.length-1-i]||1)>1&&o===1&&r.unshift(a)}return r}function Wo(e,t){let n=[];for(let r=0;r<t.length;r++){let i=e[e.length-r-1],a=t.length-r-1,o=t[a];(i==null||i===1&&o>1)&&n.unshift(a)}return n}function Go(e,t){let n=[],r=Math.max(e.length,t.length);for(let i=0;i<r;i++){let r=e[e.length-i-1];r??=1;let a=t[t.length-i-1];if(a??=1,r===1)n.unshift(a);else if(a===1)n.unshift(r);else if(r!==a){let n=`Operands could not be broadcast together with shapes ${e} and ${t}.`;throw Error(n)}else n.unshift(r)}return n}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ko(e,t,n){if(d(e),t!=null&&t.length!==3)throw Error(`tensor3d() requires shape to have three numbers`);let r=Ui(e,n);if(r.length!==3&&r.length!==1)throw Error(`tensor3d() requires values to be number[][][] or flat/TypedArray`);if(r.length===1&&t==null)throw Error("tensor3d() requires shape to be provided when `values` are a flat array");return Xi(e,t,r,n)}function qo(e,t){let n=e.shape.length,r=t.shape.length;if(n<1)throw Error(`tf.gatherND() expects the input to be rank 1 or higher, but the rank was ${n}.`);if(r<1)throw Error(`tf.gatherND() expects the indices to be rank 1 or higher, but the rank was ${r}.`);if(t.dtype!==`int32`)throw Error(`tf.gatherND() expects the indices to be int32 type, but the dtype was ${t.dtype}.`);if(t.shape[r-1]>n)throw Error(`index innermost dimension length must be <= tensor rank; saw: ${t.shape[r-1]} vs. ${n}`);if(p(e.shape)===0)throw Error(`Requested more than 0 entries, but input is empty. Input shape: ${e.shape}.`);let i=t.shape,a=i[i.length-1],o=1;for(let e=0;e<i.length-1;++e)o*=i[e];let s=e.shape,c=i.slice();c.pop();let l=1;for(let e=a;e<n;++e)l*=s[e],c.push(s[e]);let u=[...k(e.shape).map(e=>e/l),1].slice(0,a);return[c,o,l,u]}function Jo(e,t,n){let r=t.rank>1?t.shape[t.rank-1]:1,i=t.rank>1?t.rank-1:1,a=`Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: ${n.shape}, indices.shape: ${t.shape}, shape: ${e}, sliceDim: ${r}, and batchDim: ${i}.`;if(n.rank<i)throw Error(a+` update.rank < ${i}. `);if(e.length<r+(n.rank-i))throw Error(a+` Output shape length < ${r+(n.rank-i)}`);if(n.rank!==i+e.length-r)throw Error(a+` update.rank != ${i+e.length-r}`);for(let e=0;e<i;++e)if(n.shape[e]!==t.shape[e])throw Error(a+` updates.shape[${e}] (${n.shape[e]}) != indices.shape[${e}] (${t.shape[e]}).`);for(let t=0;t<n.rank-i;++t)if(n.shape[t+i]!==e[t+r])throw Error(a+` updates.shape[${t+i}] (${n.shape[t+i]}) != shape[${t+i}] (${e[t+i]})`)}function Yo(e,t,n){if(t.rank<1)throw Error(`tf.scatterND() expects the indices to be rank 1 or higher, but the rank was ${t.rank}.`);if(e.rank<1)throw Error(`tf.scatterND() expects the updates to be rank 1 or higher, but the rank was ${e.rank}.`);if(t.dtype!==`int32`)throw Error(`The dtype of 'indices' should be int32, but got dtype: ${t.dtype}`);if(n.length<1)throw Error(`Output rank must be greater or equal to 1, but got shape: ${n}`);if(n.length===0){if(t.size===0)throw Error(`Indices specified for empty output. indices shape: ${t.shape}`);if(e.size===0)throw Error(`Updates specified for empty output. updates shape: ${e.shape}`)}Jo(n,t,e)}function Xo(e,t,n){let r=t.shape.length,i=r>1?t.shape[r-1]:1,a=n.length,o=1;for(let e=i;e<a;++e)o*=n[e];let s=i<1?1:i,c=p(t.shape)/s,l=[...k(n.slice(0,i)),1],u=p(n);return{sliceRank:i,numUpdates:c,sliceSize:o,strides:l,outputSize:u}}function Zo(e,t,n){let r=e.shape.length;l(r===t.length,()=>`Error in slice${r}D: Length of begin ${t} must match the rank of the array (${r}).`),l(r===n.length,()=>`Error in slice${r}D: Length of size ${n} must match the rank of the array (${r}).`);for(let i=0;i<r;++i)l(t[i]+n[i]<=e.shape[i],()=>`Error in slice${r}D: begin[${i}] + size[${i}] (${t[i]+n[i]}) would overflow input.shape[${i}] (${e.shape[i]})`)}function Qo(e,t,n){let r=[];for(let i=0;i<e.length;i++)r[i]=Math.ceil((t[i]-e[i])/n[i]);return r}function $o(e,t,n){let r=n.length;for(let e=0;e<n.length;e++)if(n[e]>1){r=e;break}for(let i=r+1;i<n.length;i++)if(t[i]>0||n[i]!==e[i])return!1;return!0}function es(e,t){let n=e.length>0?e[e.length-1]:1;for(let r=0;r<e.length-1;r++)n+=e[r]*t[r];return n}function ts(e,t,n){let r,i=e.shape.length;r=typeof t==`number`?[t,...Array(i-1).fill(0)]:t.length<i?t.concat(Array(i-t.length).fill(0)):t.slice(),r.forEach(e=>{l(e!==-1,()=>`slice() does not support negative begin indexing.`)});let a;return a=n==null?Array(i).fill(-1):typeof n==`number`?[n,...Array(i-1).fill(-1)]:n.length<i?n.concat(Array(i-n.length).fill(-1)):n,a=a.map((t,n)=>t>=0?t:(l(t===-1,()=>`Negative size values should be exactly -1 but got ${t} for the slice() size at index ${n}.`),e.shape[n]-r[n])),[r,a]}function ns(e,t,n,r,i,a,o,s,c){let l;if(r==null?(l=Array(t.length),l.fill(1)):l=r,o!=null&&o&o-1)throw Error(`Multiple ellipses in slice is not allowed.`);let u=!1,d={dims:l.length,numAddAxisAfterEllipsis:0,begin:t.slice(),end:n.slice(),strides:l.slice(),beginMask:i,endMask:a,ellipsisMask:o,newAxisMask:s,shrinkAxisMask:c};for(let e=0;e<d.dims;e++)u&&1<<e&s&&d.numAddAxisAfterEllipsis++,1<<e&o&&(u=!0);u||(d.ellipsisMask|=1<<d.dims,d.dims++);let f={dims:e.length,beginMask:0,endMask:0,beginValid:!1,endValid:!1};rs(d,f);let p=!0,m=!0,h=!0,g=[],_=[];for(let t=0;t<e.length;++t){if(f.strides[t]===0)throw Error(`strides[${t}] must be non-zero`);let n=!!(f.shrinkAxisMask&1<<t),r=e[t];if(r===-1){g.push(n?1:-1);continue}let i=[f.beginMask&1<<t,f.endMask&1<<t],a=[f.strides[t]>0?0:-1,f.strides[t]>0?r:r-1];if(n&&f.strides[t]<=0)throw Error(`only stride 1 allowed on non-range indexing.`);h&&=f.strides[t]===1;let o=!!(f.beginMask&1<<t&&f.endMask&1<<t);if(f.beginValid&&f.endValid){if(n){let e=f.begin[t]<0?r+f.begin[t]:f.begin[t];if(f.begin[t]=e,f.end[t]=f.begin[t]+1,e<0||e>=r)throw Error(`slice index ${f.begin[t]} of dimension ${t} out of bounds.`)}else f.begin[t]=is(f.begin[t],0,f.strides[t],r,i,a),f.end[t]=is(f.end[t],1,f.strides[t],r,i,a);let e=f.strides[t]===1&&f.begin[t]===0&&f.end[t]===r;p&&=e,m&&=t===0&&f.strides[t]===1||e}else p=p&&f.strides[t]===1&&o,m&&=t===0&&f.strides[t]===1||o;let s,c=!1;if(f.beginValid&&f.endValid?(s=f.end[t]-f.begin[t],c=!0):n?(s=1,c=!0):o&&r>=0&&(s=f.strides[t]<0?-r:r,c=!0),c){let e;e=s===0||s<0!=f.strides[t]<0?0:Math.trunc(s/f.strides[t])+(s%f.strides[t]===0?0:1),g.push(e)}else g.push(-1)}for(let e=0;e<f.finalShapeGatherIndices.length;++e){let t=f.finalShapeGatherIndices[e];t>=0?_.push(g[t]):t===-2&&_.push(1)}return{finalShapeSparse:_.filter((e,t)=>f.finalShapeGatherIndices[t]!==-2),finalShape:_,isIdentity:p,sliceDim0:m,isSimpleSlice:h,begin:f.begin,end:f.end,strides:f.strides}}function rs(e,t){t.beginMask=0,t.endMask=0,t.shrinkAxisMask=0;let n=0;t.beginValid=e.begin!=null,t.endValid=e.end!=null,t.begin=Array(t.dims),t.end=Array(t.dims),t.strides=Array(t.dims),t.finalShapeGatherIndices=[],t.finalShapeGatherIndicesSparse=[],t.inputShapeGatherIndicesSparse=Array(t.dims);for(let r=0;r<e.dims;r++)if(1<<r&e.ellipsisMask){let i=Math.min(t.dims-(e.dims-r)+1+e.numAddAxisAfterEllipsis,t.dims);for(;n<i;n++)t.begin[n]=0,t.end[n]=0,t.strides[n]=1,t.beginMask|=1<<n,t.endMask|=1<<n,t.finalShapeGatherIndices.push(n),t.finalShapeGatherIndicesSparse.push(-1),t.inputShapeGatherIndicesSparse[n]=r}else if(1<<r&e.newAxisMask)t.finalShapeGatherIndices.push(-2),t.finalShapeGatherIndicesSparse.push(-1);else{if(n===t.begin.length)throw Error(`Index out of range using input dim ${n}; input has only ${t.dims} dims, ${t.begin.length}.`);e.begin!=null&&(t.begin[n]=e.begin[r]),e.end!=null&&(t.end[n]=e.end[r]),t.strides[n]=e.strides[r],e.beginMask&1<<r&&(t.beginMask|=1<<n),e.endMask&1<<r&&(t.endMask|=1<<n),e.shrinkAxisMask&1<<r?(t.finalShapeGatherIndices.push(-1),t.finalShapeGatherIndicesSparse.push(-1),t.shrinkAxisMask|=1<<n):(t.finalShapeGatherIndices.push(n),t.finalShapeGatherIndicesSparse.push(r)),t.inputShapeGatherIndicesSparse[n]=r,n++}}function is(e,t,n,r,i,a){if(i[t])return n>0?a[t]:a[t+1&1];{let t=e<0?r+e:e;return t<a[0]?a[0]:t>a[1]?a[1]:t}}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function as(e,t){let n=I(e,`a`,`add`),r=I(t,`b`,`add`);[n,r]=Ai(n,r);let i={a:n,b:r};return F.runKernel(`Add`,i)}const os=L({add_:as});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ss(e,t){let n=I(e,`a`,`floorDiv`),r=I(t,`b`,`floorDiv`);[n,r]=Ai(n,r);let i={a:n,b:r};return F.runKernel(_t,i)}const cs=L({floorDiv_:ss});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ls(e,t){let n=I(e,`a`,`div`),r=I(t,`b`,`div`);if([n,r]=Ai(n,r),n.dtype===`int32`&&r.dtype===`int32`)return cs(n,r);let i={a:n,b:r};return F.runKernel(lt,i,{})}const us=L({div_:ls});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ds(e,t){let n=I(e,`a`,`mul`),r=I(t,`b`,`mul`);[n,r]=Ai(n,r);let i={a:n,b:r};return F.runKernel(Gt,i)}const B=L({mul_:ds});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function fs(e){let t=I(e,`x`,`abs`);if(t.dtype===`complex64`){let e={x:t};return F.runKernel(Ue,e)}else{let e={x:t};return F.runKernel(`Abs`,e)}}const ps=L({abs_:fs});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ms(e){let t={x:I(e,`x`,`acos`)};return F.runKernel(Ce,t)}const hs=L({acos_:ms});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function gs(e){let t={x:I(e,`x`,`acosh`)};return F.runKernel(we,t)}const _s=L({acosh_:gs});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function vs(e){l(Array.isArray(e),()=>`The argument passed to tf.addN() must be a list of tensors`),l(e.length>=1,()=>`Must pass at least one tensor to tf.addN(), but got ${e.length}`);let t=e.map((e,t)=>I(e,`tensors${t}`,`addN`)),n=t[0];t.forEach(e=>{if(e.dtype!==n.dtype)throw Error(`All tensors passed to tf.addN() must have the same dtype`)}),t.forEach(e=>{if(!m(e.shape,n.shape))throw Error(`All tensors passed to tf.addN() must have the same shape`)});let r=t;return F.runKernel(Te,r)}const ys=L({addN_:vs});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function bs(e,t=null,n=!1){let r={x:I(e,`x`,`all`,`bool`)},i={axis:t,keepDims:n};return F.runKernel(`All`,r,i)}const xs=L({all_:bs});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ss(e,t=null,n=!1){let r={x:I(e,`x`,`any`,`bool`)},i={axis:t,keepDims:n};return F.runKernel(`Any`,r,i)}const Cs=L({any_:Ss});
/**
* @license
* Copyright 2020 Google Inc. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ws(e,t=0){let n={x:I(e,`x`,`argMax`)},r={axis:t};return F.runKernel(Ee,n,r)}const Ts=L({argMax_:ws});
/**
* @license
* Copyright 2020 Google Inc. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Es(e,t=0){let n={x:I(e,`x`,`argMin`)},r={axis:t};return F.runKernel(De,n,r)}const Ds=L({argMin_:Es});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Os(e){let t={x:I(e,`x`,`asin`)};return F.runKernel(Oe,t)}const ks=L({asin_:Os});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function As(e){let t={x:I(e,`x`,`asinh`)};return F.runKernel(ke,t)}const js=L({asinh_:As});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ms(e){let t={x:I(e,`x`,`atan`)};return F.runKernel(Ae,t)}const Ns=L({atan_:Ms});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ps(e,t){let n=I(e,`a`,`atan2`),r=I(t,`b`,`atan2`);[n,r]=Ai(n,r);let i={a:n,b:r};return F.runKernel(Me,i)}const Fs=L({atan2_:Ps});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Is(e){let t={x:I(e,`x`,`atanh`)};return F.runKernel(je,t)}const Ls=L({atanh_:Is});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Rs(e,t,n,r,i=`NHWC`,a){let o=e[3];return Vs(e,[...t,o],n,a,r,null,null,ec(i))}function zs(e,t,n,r,i,a,o=`channelsLast`){let[s,c]=Ks(t),l;if(o===`channelsLast`)l=[s,c,e[3],e[3]];else if(o===`channelsFirst`)l=[s,c,e[1],e[1]];else throw Error(`Unknown dataFormat ${o}`);return Vs(e,l,n,r,i,a,!1,o)}function Bs(e,t,n,r,i,a,o=`NDHWC`){let[s,c,l]=qs(t),u,d;if(o===`NDHWC`)d=`channelsLast`,u=[s,c,l,e[4],e[4]];else if(o===`NCDHW`)d=`channelsFirst`,u=[s,c,l,e[1],e[1]];else throw Error(`Unknown dataFormat ${o}`);return Hs(e,u,n,r,i,!1,d,a)}function Vs(e,t,n,r,i,a,o=!1,s=`channelsLast`){let[c,l,u,d]=[-1,-1,-1,-1];if(s===`channelsLast`)[c,l,u,d]=e;else if(s===`channelsFirst`)[c,d,l,u]=e;else throw Error(`Unknown dataFormat ${s}`);let[f,p,,m]=t,[h,g]=Ks(n),[_,v]=Ks(r),y=Js(f,_),b=Js(p,v),{padInfo:x,outHeight:S,outWidth:C}=Ys(i,l,u,h,g,y,b,a,s),w=o?m*d:m,T;return s===`channelsFirst`?T=[c,w,S,C]:s===`channelsLast`&&(T=[c,S,C,w]),{batchSize:c,dataFormat:s,inHeight:l,inWidth:u,inChannels:d,outHeight:S,outWidth:C,outChannels:w,padInfo:x,strideHeight:h,strideWidth:g,filterHeight:f,filterWidth:p,effectiveFilterHeight:y,effectiveFilterWidth:b,dilationHeight:_,dilationWidth:v,inShape:e,outShape:T,filterShape:t}}function Hs(e,t,n,r,i,a=!1,o=`channelsLast`,s){let[c,l,u,d,f]=[-1,-1,-1,-1,-1];if(o===`channelsLast`)[c,l,u,d,f]=e;else if(o===`channelsFirst`)[c,f,l,u,d]=e;else throw Error(`Unknown dataFormat ${o}`);let[p,m,h,,g]=t,[_,v,y]=qs(n),[b,x,S]=qs(r),C=Js(p,b),w=Js(m,x),T=Js(h,S),{padInfo:E,outDepth:D,outHeight:O,outWidth:ee}=Xs(i,l,u,d,_,v,y,C,w,T,s),te=a?g*f:g,ne;return o===`channelsFirst`?ne=[c,te,D,O,ee]:o===`channelsLast`&&(ne=[c,D,O,ee,te]),{batchSize:c,dataFormat:o,inDepth:l,inHeight:u,inWidth:d,inChannels:f,outDepth:D,outHeight:O,outWidth:ee,outChannels:te,padInfo:E,strideDepth:_,strideHeight:v,strideWidth:y,filterDepth:p,filterHeight:m,filterWidth:h,effectiveFilterDepth:C,effectiveFilterHeight:w,effectiveFilterWidth:T,dilationDepth:b,dilationHeight:x,dilationWidth:S,inShape:e,outShape:ne,filterShape:t}}function Us(e,t,n,r,i){r??=Gs(e,t,n);let a=e[0],o=e[1];return[Zs((a-t+2*r)/n+1,i),Zs((o-t+2*r)/n+1,i)]}function Ws(e,t,n,r,i,a){i??=Gs(e,t,r);let o=e[0],s=e[1],c=e[2];return[Zs((o-t+2*i)/r+1,a),Zs((s-t+2*i)/r+1,a),Zs((c-t+2*i)/r+1,a),n]}function Gs(e,t,n,r=1){let i=Js(t,r);return Math.floor((e[0]*(n-1)-n+i)/2)}function Ks(e){return typeof e==`number`?[e,e,e]:e.length===2?[e[0],e[1],1]:e}function qs(e){return typeof e==`number`?[e,e,e]:e}function Js(e,t){return t<=1?e:e+(e-1)*(t-1)}function Ys(e,t,n,r,i,a,o,s,c){let l,u,d;if(typeof e==`number`){l={top:e,bottom:e,left:e,right:e,type:e===0?`VALID`:`NUMBER`};let i=Us([t,n],a,r,e,s);u=i[0],d=i[1]}else if(e===`same`){u=Math.ceil(t/r),d=Math.ceil(n/i);let e=Math.max(0,(u-1)*r+a-t),s=Math.max(0,(d-1)*i+o-n),c=Math.floor(e/2),f=e-c,p=Math.floor(s/2);l={top:c,bottom:f,left:p,right:s-p,type:`SAME`}}else if(e===`valid`)l={top:0,bottom:0,left:0,right:0,type:`VALID`},u=Math.ceil((t-a+1)/r),d=Math.ceil((n-o+1)/i);else if(typeof e==`object`){let f=c===`channelsLast`?e[1][0]:e[2][0],p=c===`channelsLast`?e[1][1]:e[2][1],m=c===`channelsLast`?e[2][0]:e[3][0],h=c===`channelsLast`?e[2][1]:e[3][1];l={top:f,bottom:p,left:m,right:h,type:f===0&&p===0&&m===0&&h===0?`VALID`:`EXPLICIT`},u=Zs((t-a+f+p)/r+1,s),d=Zs((n-o+m+h)/i+1,s)}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:l,outHeight:u,outWidth:d}}function Xs(e,t,n,r,i,a,o,s,c,l,u){let d,f,p,m;if(typeof e==`number`){d={top:e,bottom:e,left:e,right:e,front:e,back:e,type:e===0?`VALID`:`NUMBER`};let a=Ws([t,n,r,1],s,1,i,e,u);f=a[0],p=a[1],m=a[2]}else if(e===`same`){f=Math.ceil(t/i),p=Math.ceil(n/a),m=Math.ceil(r/o);let e=(f-1)*i+s-t,u=(p-1)*a+c-n,h=(m-1)*o+l-r,g=Math.floor(e/2),_=e-g,v=Math.floor(u/2),y=u-v,b=Math.floor(h/2);d={top:v,bottom:y,left:b,right:h-b,front:g,back:_,type:`SAME`}}else if(e===`valid`)d={top:0,bottom:0,left:0,right:0,front:0,back:0,type:`VALID`},f=Math.ceil((t-s+1)/i),p=Math.ceil((n-c+1)/a),m=Math.ceil((r-l+1)/o);else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:d,outDepth:f,outHeight:p,outWidth:m}}function Zs(e,t){if(!t)return Math.trunc(e);switch(t){case`round`:return Math.round(e);case`ceil`:return Math.ceil(e);case`floor`:return Math.floor(e);default:throw Error(`Unknown roundingMode ${t}`)}}function Qs(e){let[t,n,r]=Ks(e);return t===1&&n===1&&r===1}function $s(e,t){return Qs(e)||Qs(t)}function ec(e){if(e===`NHWC`)return`channelsLast`;if(e===`NCHW`)return`channelsFirst`;throw Error(`Unknown dataFormat ${e}`)}function tc(e,t,n){if(n!=null){if(typeof t==`string`)throw Error(`Error in ${e}: pad must be an integer when using dimRoundingMode ${n} but got pad ${t}.`);if(typeof t==`number`)l(h(t),()=>`Error in ${e}: pad must be an integer when using dimRoundingMode ${n} but got pad ${t}.`);else if(typeof t==`object`)t.forEach(t=>{t.forEach(t=>{l(h(t),()=>`Error in ${e}: pad must be an integer when using dimRoundingMode ${n} but got pad ${t}.`)})});else throw Error(`Error in ${e}: Unknown padding parameter: ${t}`)}}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function nc(e,t){let n={x:I(e,`x`,`reshape`,`string_or_numeric`)},r={shape:t};return F.runKernel(ln,n,r)}const V=L({reshape_:nc});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function rc(e,t,n,r,i){let a=I(e,`x`,`avgPool`,`float32`);l($s(n,1),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${n} and dilations '1'`);let o=a,s=!1;a.rank===3&&(s=!0,o=V(a,[1,a.shape[0],a.shape[1],a.shape[2]])),l(o.rank===4,()=>`Error in avgPool: x must be rank 4 but got rank ${o.rank}.`),tc(`avgPool`,r,i);let c={x:o},u={filterSize:t,strides:n,pad:r,dimRoundingMode:i},d=F.runKernel(Ne,c,u);return d=Qa(d,a.dtype),s?V(d,[d.shape[1],d.shape[2],d.shape[3]]):d}const ic=L({avgPool_:rc});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ac(e,t,n,r,i,a=`NDHWC`){let o=I(e,`x`,`avgPool3d`,`float32`),s=o,c=!1;o.rank===4&&(c=!0,s=V(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),l(s.rank===5,()=>`Error in avgPool3d: x must be rank 5 but got rank ${s.rank}.`),l(a===`NDHWC`,()=>`Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of ${a}`),tc(`avgPool3d`,r,i);let u={x:s},d={filterSize:t,strides:n,pad:r,dimRoundingMode:i,dataFormat:a},f=F.runKernel(Pe,u,d);return f=Qa(f,s.dtype),c?V(f,[f.shape[1],f.shape[2],f.shape[3],f.shape[4]]):f}const oc=L({avgPool3d_:ac});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function sc(e,t=0){l(e.length>=1,()=>`Pass at least one tensor to concat`);let n=Ki(e,`tensors`,`concat`,`string_or_numeric`);if(n[0].dtype===`complex64`&&n.forEach(e=>{if(e.dtype!==`complex64`)throw Error(`Cannot concatenate complex64 tensors with a tensor
          with dtype ${e.dtype}. `)}),n.length===1)return eo(n[0]);let r=n,i={axis:t};return F.runKernel(We,r,i)}const cc=L({concat_:sc});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function lc(e){let t={x:I(e,`x`,`sigmoid`,`float32`)};return F.runKernel(Cn,t)}const uc=L({sigmoid_:lc});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function dc(e,t,n){let r=I(e,`x`,`slice`,`string_or_numeric`);if(r.rank===0)throw Error(`Slicing scalar is not possible`);let i={x:r},a={begin:t,size:n};return F.runKernel(bn,i,a)}const H=L({slice_:dc});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function fc(e){let t={x:I(e,`x`,`tanh`,`float32`)};return F.runKernel(zn,t)}const pc=L({tanh_:fc});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function mc(e,t,n,r,i,a){let o=I(e,`forgetBias`,`basicLSTMCell`),s=I(t,`lstmKernel`,`basicLSTMCell`),c=I(n,`lstmBias`,`basicLSTMCell`),l=I(r,`data`,`basicLSTMCell`),u=I(i,`c`,`basicLSTMCell`),d=os(z(cc([l,I(a,`h`,`basicLSTMCell`)],1),s),c),f=d.shape[0],p=d.shape[1]/4,m=[f,p],h=H(d,[0,0],m),g=H(d,[0,p],m),_=H(d,[0,p*2],m),v=H(d,[0,p*3],m),y=os(B(uc(h),pc(g)),B(u,uc(os(o,_))));return[y,B(pc(y),uc(v))]}const hc=L({basicLSTMCell_:mc});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function gc(e,t,n){let r=I(e,`x`,`batchToSpaceND`),i=t.reduce((e,t)=>e*t);l(r.rank>=1+t.length,()=>`input rank is ${r.rank} but should be > than blockShape.length ${t.length}`),l(n.length===t.length,()=>`crops.length is ${n.length} but should be equal to blockShape.length  ${t.length}`),l(r.shape[0]%i===0,()=>`input tensor batch is ${r.shape[0]} but is not divisible by the product of the elements of blockShape ${t.join(` * `)} === ${i}`);let a={x:r},o={blockShape:t,crops:n};return F.runKernel(Ie,a,o)}const _c=L({batchToSpaceND_:gc});function vc(e){let t;return t=e.rank===0||e.rank===1?V(e,[1,1,1,e.size]):e.rank===2?V(e,[1,1,e.shape[0],e.shape[1]]):e.rank===3?V(e,[1,e.shape[0],e.shape[1],e.shape[2]]):e,t}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function yc(e,t,n,r,i,a){a??=.001;let o=I(e,`x`,`batchNorm`),s=I(t,`mean`,`batchNorm`),c=I(n,`variance`,`batchNorm`),u;i!=null&&(u=I(i,`scale`,`batchNorm`));let d;r!=null&&(d=I(r,`offset`,`batchNorm`)),l(s.rank===c.rank,()=>`Batch normalization gradient requires mean and variance to have equal ranks.`),l(d==null||s.rank===d.rank,()=>`Batch normalization gradient requires mean and offset to have equal ranks.`),l(u==null||s.rank===u.rank,()=>`Batch normalization gradient requires mean and scale to have equal ranks.`);let f={x:vc(o),scale:u,offset:d,mean:s,variance:c},p={varianceEpsilon:a};return V(F.runKernel(vt,f,p),o.shape)}const bc=L({batchNorm_:yc});function xc(e,t,n,r,i,a){let o=I(e,`x`,`batchNorm`),s=I(t,`mean`,`batchNorm`),c=I(n,`variance`,`batchNorm`),u;i!=null&&(u=I(i,`scale`,`batchNorm`));let d;return r!=null&&(d=I(r,`offset`,`batchNorm`)),l(o.rank===2,()=>`Error in batchNorm2D: x must be rank 2 but got rank ${o.rank}.`),l(s.rank===2||s.rank===1,()=>`Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank ${s.rank}.`),l(c.rank===2||c.rank===1,()=>`Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank ${c.rank}.`),u!=null&&l(u.rank===2||u.rank===1,()=>`Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank ${u.rank}.`),d!=null&&l(d.rank===2||d.rank===1,()=>`Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank ${d.rank}.`),bc(o,s,c,d,u,a)}const Sc=L({batchNorm2d_:xc});function Cc(e,t,n,r,i,a){let o=I(e,`x`,`batchNorm`),s=I(t,`mean`,`batchNorm`),c=I(n,`variance`,`batchNorm`),u;i!=null&&(u=I(i,`scale`,`batchNorm`));let d;return r!=null&&(d=I(r,`offset`,`batchNorm`)),l(o.rank===3,()=>`Error in batchNorm3D: x must be rank 3 but got rank ${o.rank}.`),l(s.rank===3||s.rank===1,()=>`Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank ${s.rank}.`),l(c.rank===3||c.rank===1,()=>`Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank ${c.rank}.`),u!=null&&l(u.rank===3||u.rank===1,()=>`Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank ${u.rank}.`),d!=null&&l(d.rank===3||d.rank===1,()=>`Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank ${d.rank}.`),bc(o,s,c,d,u,a)}const wc=L({batchNorm3d_:Cc});function Tc(e,t,n,r,i,a){let o=I(e,`x`,`batchNorm`),s=I(t,`mean`,`batchNorm`),c=I(n,`variance`,`batchNorm`),u;i!=null&&(u=I(i,`scale`,`batchNorm`));let d;return r!=null&&(d=I(r,`offset`,`batchNorm`)),l(o.rank===4,()=>`Error in batchNorm4D: x must be rank 4 but got rank ${o.rank}.`),l(s.rank===4||s.rank===1,()=>`Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank ${s.rank}.`),l(c.rank===4||c.rank===1,()=>`Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank ${c.rank}.`),u!=null&&l(u.rank===4||u.rank===1,()=>`Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank ${u.rank}.`),d!=null&&l(d.rank===4||d.rank===1,()=>`Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank ${d.rank}.`),bc(o,s,c,d,u,a)}const Ec=L({batchNorm4d_:Tc});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Dc(e,t,n){let r=I(e,`x`,`bincount`),i=I(t,`weights`,`bincount`);l(r.dtype===`int32`,()=>`Error in bincount: input dtype must be int32, but got ${r.dtype}`),l(n>=0,()=>`size must be non-negative, but got ${n}.`),l(i.size===r.size||i.size===0,()=>`Error in bincount: weights must have the same size as input or0-length, but got input shape: ${r.shape}, weights shape: ${i.shape}.`);let a={x:r,weights:i},o={size:n};return F.runKernel(Le,a,o)}const Oc=L({bincount_:Dc});
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function kc(e,t){let n=I(e,`s0`,`broadcastArgs`,`int32`),r=I(t,`s1`,`broadcastArgs`,`int32`);if(n.rank!==1)throw Error(`broadcastArgs(): first input must be a vector (rank=1). Has rank ${n.rank}`);if(r.rank!==1)throw Error(`broadcastArgs(): second input must be a vector (rank=1). Has rank ${r.rank}`);let i={s0:n,s1:r};return F.runKernel(Re,i)}const Ac=L({broadcastArgs_:kc});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function jc(e,t){let n=I(e,`broadcastTo`,`x`),r=n.shape;if(t.some(e=>!(e>0)||e%1!=0))throw Error(`broadcastTo(): Invalid broadcast shape [${t}].`);if(t.length<n.rank)throw Error(`broadcastTo(): shape.length=${t.length} < input.rank=${n.rank}.`);if(t.length>n.rank){let e=n.shape.slice();for(;e.length<t.length;)e.unshift(1);n=V(n,e)}let i=n.shape,a=Array.from(t);for(let e=t.length-1;e>=0;e--)if(i[e]===t[e])a[e]=1;else if(n.shape[e]!==1)throw Error(`broadcastTo(): [${r}] cannot be broadcast to [${t}].`);if(a.map((e,t)=>e>1?t:-1).filter(e=>e>=0).length===0)return eo(n);let o={x:n},s={reps:a};return F.runKernel(Bn,o,s)}const Mc=L({broadcastTo_:jc});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Nc(e){let t={x:I(e,`x`,`ceil`,`float32`)};return F.runKernel(Be,t)}const Pc=L({ceil_:Nc});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Fc(e,t,n){let r={shape:e,value:t,dtype:n};return F.runKernel(mt,{},r)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ic(e,t,n){let r=I(e,`x`,`clipByValue`);if(l(t<=n,()=>`Error in clip: min (${t}) must be less than or equal to max (${n}).`),t===n)return Fc(r.shape,t,r.dtype);let i={x:r},a={clipValueMin:t,clipValueMax:n};return F.runKernel(Ve,i,a)}const Lc=L({clipByValue_:Ic});function Rc(e){return cc(e,0)}const zc=L({concat1d_:Rc});function Bc(e,t){return cc(e,t)}const Vc=L({concat2d_:Bc});function Hc(e,t){return cc(e,t)}const Uc=L({concat3d_:Hc});function Wc(e,t){return cc(e,t)}const Gc=L({concat4d_:Wc});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Kc(e,t,n,r,i=`NHWC`,a=[1,1],o){let s=I(e,`x`,`conv2d`,`float32`),c=I(t,`filter`,`conv2d`,`float32`),u=s,d=!1;s.rank===3&&(d=!0,u=V(s,[1,s.shape[0],s.shape[1],s.shape[2]])),l(u.rank===4,()=>`Error in conv2d: input must be rank 4, but got rank ${u.rank}.`),l(c.rank===4,()=>`Error in conv2d: filter must be rank 4, but got rank ${c.rank}.`),tc(`conv2d`,r,o);let f=i===`NHWC`?u.shape[3]:u.shape[1];l(f===c.shape[2],()=>`Error in conv2d: depth of input (${f}) must match input depth for filter ${c.shape[2]}.`),l($s(n,a),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`);let p={x:u,filter:c},m={strides:n,pad:r,dataFormat:i,dilations:a,dimRoundingMode:o},h=F.runKernel(Ge,p,m);return d?V(h,[h.shape[1],h.shape[2],h.shape[3]]):h}const qc=L({conv2d_:Kc});function Jc(e,t,n,r,i=`NWC`,a=1,o){let s=I(e,`x`,`conv1d`),c=I(t,`filter`,`conv1d`),u=s,d=!1;s.rank===2&&(d=!0,u=V(s,[1,s.shape[0],s.shape[1]])),l(u.rank===3,()=>`Error in conv1d: input must be rank 3, but got rank ${u.rank}.`),l(c.rank===3,()=>`Error in conv1d: filter must be rank 3, but got rank ${c.rank}.`),tc(`conv1d`,r,o),l(u.shape[2]===c.shape[1],()=>`Error in conv1d: depth of input (${u.shape[2]}) must match input depth for filter ${c.shape[1]}.`),l($s(n,a),()=>`Error in conv1D: Either stride or dilation must be 1. Got stride ${n} and dilation '${a}'`),l(i===`NWC`,()=>`Error in conv1d: got dataFormat of ${i} but only NWC is currently supported.`);let f=V(c,[1,c.shape[0],c.shape[1],c.shape[2]]),p=qc(V(u,[u.shape[0],1,u.shape[1],u.shape[2]]),f,[1,n],r,`NHWC`,[1,a],o);return d?V(p,[p.shape[2],p.shape[3]]):V(p,[p.shape[0],p.shape[2],p.shape[3]])}const Yc=L({conv1d_:Jc});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Xc(e,t,n,r,i,a=`NHWC`,o){l(e.length===t.rank,()=>`Length of inShape (${e.length}) and rank of dy (${t.rank}) must match`);let s=e,c=t,u=!1;t.rank===3&&(u=!0,c=V(t,[1,t.shape[0],t.shape[1],t.shape[2]]),s=[1,e[0],e[1],e[2]]),l(s.length===4,()=>`Error in conv2dDerInput: inShape must be length 4, but got length ${s.length}.`),l(c.rank===4,()=>`Error in conv2dDerInput: dy must be rank 4, but got rank ${c.rank}`),l(n.rank===4,()=>`Error in conv2dDerInput: filter must be rank 4, but got rank ${n.rank}`);let d=a===`NHWC`?s[3]:s[1],f=a===`NHWC`?c.shape[3]:c.shape[1];l(d===n.shape[2],()=>`Error in conv2dDerInput: depth of input (${d}) must match input depth for filter ${n.shape[2]}.`),l(f===n.shape[3],()=>`Error in conv2dDerInput: depth of output (${f}) must match output depth for filter ${n.shape[3]}.`),tc(`conv2dDerInput`,i,o);let p={dy:c,filter:n},m={strides:r,pad:i,dataFormat:a,dimRoundingMode:o,inputShape:s},h=F.runKernel(qe,p,m);return u?V(h,[h.shape[1],h.shape[2],h.shape[3]]):h}const Zc=L({conv2DBackpropInput_:Xc});function Qc(e,t,n,r,i,a){return Zc(n,I(e,`x`,`conv2dTranspose`),I(t,`filter`,`conv2dTranspose`),r,i,`NHWC`,a)}const $c=L({conv2dTranspose_:Qc});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function el(e,t,n,r,i=`NDHWC`,a=[1,1,1]){let o=I(e,`x`,`conv3d`),s=I(t,`filter`,`conv3d`),c=o,u=!1;o.rank===4&&(u=!0,c=V(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),l(c.rank===5,()=>`Error in conv3d: input must be rank 5, but got rank ${c.rank}.`),l(s.rank===5,()=>`Error in conv3d: filter must be rank 5, but got rank ${s.rank}.`),l(c.shape[4]===s.shape[3],()=>`Error in conv3d: depth of input (${c.shape[4]}) must match input depth for filter ${s.shape[3]}.`),l($s(n,a),()=>`Error in conv3D: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`),l(i===`NDHWC`,()=>`Error in conv3d: got dataFormat of ${i} but only NDHWC is currently supported.`);let d={x:c,filter:s},f={strides:n,pad:r,dataFormat:i,dilations:a},p=F.runKernel(Je,d,f);return u?V(p,[p.shape[1],p.shape[2],p.shape[3],p.shape[4]]):p}const tl=L({conv3d_:el});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function nl(e,t,n,r,i){l(e.length===t.rank,()=>`Length of inShape (${e.length}) and rank of dy (${t.rank}) must match`);let a=e,o=t,s=!1;t.rank===4&&(s=!0,o=V(t,[1,t.shape[0],t.shape[1],t.shape[2],t.shape[3]]),a=[1,e[0],e[1],e[2],e[3]]);let c=a[4],u=o.shape[4];l(a.length===5,()=>`Error in conv3dDerInput: inShape must be length 5, but got length ${a.length}.`),l(o.rank===5,()=>`Error in conv3dDerInput: dy must be rank 5, but got rank ${o.rank}`),l(n.rank===5,()=>`Error in conv3dDerInput: filter must be rank 5, but got rank ${n.rank}`),l(c===n.shape[3],()=>`Error in conv3dDerInput: depth of input (${c}) must match input depth for filter ${n.shape[3]}.`),l(u===n.shape[4],()=>`Error in conv3dDerInput: depth of output (${u}) must match output depth for filter ${n.shape[4]}.`);let d={dy:o,filter:n},f={pad:i,strides:r,inputShape:a},p=F.runKernel(Ye,d,f);return s?V(p,[p.shape[1],p.shape[2],p.shape[3],p.shape[4]]):p}const rl=L({conv3DBackpropInput_:nl});function il(e,t,n,r,i){return rl(n,I(e,`x`,`conv3dTranspose`),I(t,`filter`,`conv3dTranspose`),r,i)}const al=L({conv3dTranspose_:il});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ol(e){let t={x:I(e,`x`,`cos`,`float32`)};return F.runKernel(`Cos`,t)}const sl=L({cos_:ol});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function cl(e){let t={x:I(e,`x`,`cosh`,`float32`)};return F.runKernel(Xe,t)}const ll=L({cosh_:cl});
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the 'License');
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an 'AS IS' BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ul(e,t=0,n=!1,r=!1){let i={x:I(e,`x`,`cumprod`)},a={axis:t,exclusive:n,reverse:r};return F.runKernel(Ze,i,a)}const dl=L({cumprod_:ul});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function fl(e,t=0,n=!1,r=!1){let i={x:I(e,`x`,`cumsum`)},a={axis:t,exclusive:n,reverse:r};return F.runKernel(Qe,i,a)}const pl=L({cumsum_:fl});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ml(e,t,n,r=!1){let i=I(e,`x`,`denseBincount`),a=I(t,`weights`,`denseBincount`);l(i.dtype===`int32`,()=>`Error in denseBincount: input dtype must be int32, but got ${i.dtype}`),l(i.rank<=2,()=>`Error in denseBincount: input must be at most rank 2, but got rank ${i.rank}.`),l(n>=0,()=>`size must be non-negative, but got ${n}.`),l(a.size===i.size||a.size===0,()=>`Error in denseBincount: weights must have the same shape as x or 0-length, but got x shape: ${i.shape}, weights shape: ${a.shape}.`);let o={x:i,weights:a},s={size:n,binaryOutput:r};return F.runKernel(et,o,s)}const hl=L({denseBincount_:ml});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function gl(e,t,n=`NHWC`){let r=I(e,`x`,`depthToSpace`,`float32`),i=n===`NHWC`?r.shape[1]:r.shape[2],a=n===`NHWC`?r.shape[2]:r.shape[3],o=n===`NHWC`?r.shape[3]:r.shape[1];l(t>1,()=>`blockSize should be > 1 for depthToSpace, but was: ${t}`),l(i*t>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${i} and ${t}  for depthToSpace with input shape
    ${r.shape}`),l(a*t>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${a} and ${t} for depthToSpace with input shape
        ${r.shape}`),l(o%(t*t)===0,()=>`Dimension size must be evenly divisible by ${t*t} but is ${o} for depthToSpace with input shape ${r.shape}`);let s={x:r},c={blockSize:t,dataFormat:n};return F.runKernel(tt,s,c)}const _l=L({depthToSpace_:gl});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function vl(e,t,n,r,i=`NHWC`,a=[1,1],o){let s=I(e,`x`,`depthwiseConv2d`,`float32`),c=I(t,`filter`,`depthwiseConv2d`,`float32`),u=s,d=!1;s.rank===3&&(d=!0,u=V(s,[1,s.shape[0],s.shape[1],s.shape[2]])),l(u.rank===4,()=>`Error in depthwiseConv2d: input must be rank 4, but got rank ${u.rank}.`),l(c.rank===4,()=>`Error in depthwiseConv2d: filter must be rank 4, but got rank ${c.rank}.`);let f=i===`NHWC`?u.shape[3]:u.shape[1];l(f===c.shape[2],()=>`Error in depthwiseConv2d: number of input channels (${f}) must match the inChannels dimension in filter ${c.shape[2]}.`),tc(`depthwiseConv2d`,r,o);let p={x:u,filter:c},m={strides:n,pad:r,dataFormat:i,dilations:a,dimRoundingMode:o},h=F.runKernel(nt,p,m);return d?V(h,[h.shape[1],h.shape[2],h.shape[3]]):h}const yl=L({depthwiseConv2d_:vl});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function bl(e){let t={x:I(e,`x`,`diag`)};return F.runKernel(at,t)}const xl=L({diag_:bl});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Sl(e,t,n,r,i=[1,1],a=`NHWC`){let o=I(e,`x`,`dilation2d`),s=I(t,`filter`,`dilation2d`);l(o.rank===3||o.rank===4,()=>`Error in dilation2d: input must be rank 3 or 4, but got rank ${o.rank}.`),l(s.rank===3,()=>`Error in dilation2d: filter must be rank 3, but got rank ${s.rank}.`),l(a===`NHWC`,()=>`Error in dilation2d: Only NHWC is currently supported, but got dataFormat of ${a}`);let c=o,u=!1;o.rank===3&&(c=V(o,[1,o.shape[0],o.shape[1],o.shape[2]]),u=!0);let d={x:c,filter:s},f={strides:n,pad:r,dilations:i},p=F.runKernel(ot,d,f);return u?V(p,[p.shape[1],p.shape[2],p.shape[3]]):p}const Cl=L({dilation2d_:Sl});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function wl(e,t){let n=I(e,`a`,`equal`,`string_or_numeric`),r=I(t,`b`,`equal`,`string_or_numeric`);[n,r]=Ai(n,r),Go(n.shape,r.shape);let i={a:n,b:r};return F.runKernel(dt,i)}const Tl=L({equal_:wl});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function El(e,t,n){let r=I(t,`a`,`where`),i=I(n,`b`,`where`),a=I(e,`condition`,`where`,`bool`),o=Go(Go(a.shape,r.shape),i.shape),s={condition:Mc(a,o),t:Mc(r,o),e:Mc(i,o)};return F.runKernel(vn,s)}const Dl=L({where_:El});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ol(e){let t={x:I(e,`x`,`zerosLike`)};return F.runKernel(qn,t)}const kl=L({zerosLike_:Ol});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Al(e,t){let n=I(e,`a`,`div`),r=I(t,`b`,`div`);[n,r]=Ai(n,r);let i=us(n,r),a=kl(i);return Dl(Tl(r,a),a,i)}const jl=L({divNoNan_:Al});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ml(e,t){let n=I(e,`t1`,`dot`),r=I(t,`t2`,`dot`);l((n.rank===1||n.rank===2)&&(r.rank===1||r.rank===2),()=>`Error in dot: inputs must all be rank 1 or 2, but got ranks ${n.rank} and ${r.rank}.`);let i=n.rank===1?n.size:n.shape[1],a=r.rank===1?r.size:r.shape[0];if(l(i===a,()=>`Error in dot: inner dimensions of inputs must match, but got ${i} and ${a}.`),n.rank===1&&r.rank===1)return V(z(V(n,[1,-1]),V(r,[-1,1])),[]);if(n.rank===1&&r.rank===2){let e=z(V(n,[1,-1]),V(r,[r.shape[0],r.shape[1]]));return V(e,[e.size])}else if(n.rank===2&&r.rank===1){let e=z(n,V(r,[-1,1]));return V(e,[e.size])}else return z(n,V(r,[r.shape[0],r.shape[1]]))}const Nl=L({dot_:Ml});
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Pl(e,...t){let n=t.map((e,t)=>I(e,`tensors${t}`,`einsum`)),r={equation:e};return F.runKernel(ut,n,r)}const Fl=L({einsum_:Pl});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Il(e){let t={x:I(e,`x`,`elu`,`float32`)};return F.runKernel(`Elu`,t)}const Ll=L({elu_:Il});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Rl(e){let t=I(e,`x`,`erf`);l(t.dtype===`int32`||t.dtype===`float32`,()=>"Input dtype must be `int32` or `float32`."),t.dtype===`int32`&&(t=Qa(t,`float32`));let n={x:t};return F.runKernel(`Erf`,n)}const zl=L({erf_:Rl});
/**
* @license
* Copyright 2017 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Bl(e,t){for(let n=0;n<e.length;++n)if(e[e.length-n-1]!==t-1-n)return!1;return!0}function Vl(e,t,n){let r=e.length+t.length,i=[],a=0,o=0;for(let s=0;s<r;s++)n.indexOf(s)===-1?i.push(e[a++]):i.push(t[o++]);return i}function Hl(e,t){let n=[],r=e.length;for(let i=0;i<r;i++)t.indexOf(i)===-1&&n.push(e[i]);return[n,t.map(t=>e[t])]}function Ul(e,t){return Vl(e,t.map(e=>1),t)}function Wl(e,t,n){l(Bl(t,n),()=>`${e} supports only inner-most axes for now. Got axes ${t} and rank-${n} input.`)}function Gl(e,t){if(Bl(e,t))return null;let n=[];for(let r=0;r<t;++r)e.indexOf(r)===-1&&n.push(r);return e.forEach(e=>n.push(e)),n}function Kl(e){return e.map((e,t)=>[t,e]).sort((e,t)=>e[1]-t[1]).map(e=>e[0])}function ql(e,t){let n=[];for(let r=t-e;r<t;++r)n.push(r);return n}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Jl(e,t=null,n=!1){let r={x:I(e,`x`,`max`)},i={reductionIndices:t,keepDims:n};return F.runKernel(`Max`,r,i)}const Yl=L({max_:Jl});
/**
* @license
* Copyright 2020 Google Inc. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Xl(e,t=null,n=!1){let r={x:I(e,`x`,`min`)},i={axis:t,keepDims:n};return F.runKernel(`Min`,r,i)}const Zl=L({min_:Xl});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ql(e,t){let n=I(e,`base`,`pow`),r=I(t,`exp`,`pow`);[n,r]=Ai(n,r);let i={a:n,b:r};return F.runKernel(`Pow`,i)}const $l=L({pow_:Ql});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function U(e,t){if((T(e)&&t!==`string`||Array.isArray(e))&&t!==`complex64`)throw Error(`Error creating a new Scalar: value must be a primitive (number|boolean|string)`);if(t===`string`&&T(e)&&!(e instanceof Uint8Array))throw Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return Xi(e,[],[],t)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function eu(e){let t={x:I(e,`x`,`sqrt`,`float32`)};return F.runKernel(Tn,t)}const tu=L({sqrt_:eu});
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function nu(e){let t=I(e,`x`,`square`);return F.runKernel(`Square`,{x:t},{})}const ru=L({square_:nu});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function iu(e,t=null,n=!1){let r=I(e,`x`,`sum`);r.dtype===`bool`&&(r=Qa(r,`int32`));let i={x:r},a={axis:t,keepDims:n};return F.runKernel(`Sum`,i,a)}const W=L({sum_:iu});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function au(e,t=`euclidean`,n=null,r=!1){e=I(e,`x`,`norm`);let i=ou(e,t,n),a=i.shape;if(r){let t=v(n,e.shape);a=Ul(i.shape,t)}return V(i,a)}function ou(e,t,n=null){if(e.rank===0)return ps(e);if(e.rank!==1&&n===null)return ou(V(e,[-1]),t,n);if(e.rank===1||typeof n==`number`||Array.isArray(n)&&n.length===1){if(t===1)return W(ps(e),n);if(t===1/0)return Yl(ps(e),n);if(t===-1/0)return Zl(ps(e),n);if(t===`euclidean`||t===2)return tu(W($l(ps(e),U(2,`int32`)),n));throw Error(`Error in norm: invalid ord value: ${t}`)}if(Array.isArray(n)&&n.length===2){if(t===1)return Yl(W(ps(e),n[0]),n[1]-1);if(t===1/0)return Yl(W(ps(e),n[1]),n[0]);if(t===-1/0)return Zl(W(ps(e),n[1]),n[0]);if(t===`fro`||t===`euclidean`)return tu(W(ru(e),n));throw Error(`Error in norm: invalid ord value: ${t}`)}throw Error(`Error in norm: invalid axis: ${n}`)}const su=L({norm_:au});
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function cu(e,t=null,n=!1){return su(e,`euclidean`,t,n)}const lu=L({euclideanNorm_:cu});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function uu(e){let t={x:I(e,`x`,`exp`)};return F.runKernel(`Exp`,t)}const du=L({exp_:uu});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function fu(e,t=0){let n=I(e,`x`,`expandDims`,`string_or_numeric`);l(t<=n.rank,()=>`Axis must be <= rank of the tensor`);let r={input:n},i={dim:t};return F.runKernel(ft,r,i)}const pu=L({expandDims_:fu});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function mu(e){let t={x:I(e,`x`,`expm1`)};return F.runKernel(pt,t)}const hu=L({expm1_:mu});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function gu(e,t){let n=I(e,`x`,`tile`,`string_or_numeric`);l(n.rank===t.length,()=>`Error in transpose: rank of input ${n.rank} must match length of reps ${t}.`);let r={x:n},i={reps:t};return F.runKernel(Bn,r,i)}const _u=L({tile_:gu});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function vu(e,t,n,r=`float32`){t??=e;let i=R([e,t],r),a=e<=t?e:t;for(let e=0;e<a;++e)i.set(1,e,e);let o=V(i.toTensor(),[e,t]);if(n==null)return o;if(n.length===1)return _u(pu(o,0),[n[0],1,1]);if(n.length===2)return _u(pu(pu(o,0),0),[n[0],n[1],1,1]);if(n.length===3)return _u(pu(pu(pu(o,0),0),0),[n[0],n[1],n[2],1,1]);throw Error(`eye() currently supports only 1D and 2D batchShapes, but received ${n.length}D.`)}const yu=L({eye_:vu});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function bu(e){let t={x:I(e,`x`,`floor`,`float32`)};return F.runKernel(gt,t)}const xu=L({floor_:bu});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Su(e,t,n=0,r=0){let i={x:I(e,`x`,`gather`),indices:I(t,`indices`,`gather`,`int32`)},a={axis:n,batchDims:r};return F.runKernel(yt,i,a)}const Cu=L({gather_:Su});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function wu(e,t){let n=I(e,`a`,`greater`,`string_or_numeric`),r=I(t,`b`,`greater`,`string_or_numeric`);[n,r]=Ai(n,r),Go(n.shape,r.shape);let i={a:n,b:r};return F.runKernel(xt,i)}const Tu=L({greater_:wu});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Eu(e,t){let n=I(e,`a`,`greaterEqual`,`string_or_numeric`),r=I(t,`b`,`greaterEqual`,`string_or_numeric`);[n,r]=Ai(n,r),Go(n.shape,r.shape);let i={a:n,b:r};return F.runKernel(St,i)}const Du=L({greaterEqual_:Eu});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ou(e){let t={x:I(e,`x`,`isFinite`)};return F.runKernel(Et,t)}const ku=L({isFinite_:Ou});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Au(e){let t={x:I(e,`x`,`isInf`)};return F.runKernel(Dt,t)}const ju=L({isInf_:Au});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Mu(e){let t={x:I(e,`x`,`isNaN`)};return F.runKernel(Ot,t)}const Nu=L({isNaN_:Mu});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Pu(e,t=.2){let n={x:I(e,`x`,`leakyRelu`)},r={alpha:t};return F.runKernel(kt,n,r)}const Fu=L({leakyRelu_:Pu});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Iu(e,t){let n=I(e,`a`,`less`,`string_or_numeric`),r=I(t,`b`,`less`,`string_or_numeric`);[n,r]=Ai(n,r),Go(n.shape,r.shape);let i={a:n,b:r};return F.runKernel(At,i)}const Lu=L({less_:Iu});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ru(e,t){let n=I(e,`a`,`lessEqual`,`string_or_numeric`),r=I(t,`b`,`lessEqual`,`string_or_numeric`);[n,r]=Ai(n,r),Go(n.shape,r.shape);let i={a:n,b:r};return F.runKernel(jt,i)}const zu=L({lessEqual_:Ru});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Bu(e,t,n){if(n<=0)throw Error(`The number of values should be positive.`);let r={start:e,stop:t,num:n};return F.runKernel(Mt,{},r)}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Vu(e,t=5,n=1,r=1,i=.5){let a=I(e,`x`,`localResponseNormalization`);l(a.rank===4||a.rank===3,()=>`Error in localResponseNormalization: x must be rank 3 or 4 but got
               rank ${a.rank}.`),l(h(t),()=>`Error in localResponseNormalization: depthRadius must be an integer but got depthRadius ${t}.`);let o=a,s=!1;a.rank===3&&(s=!0,o=V(a,[1,a.shape[0],a.shape[1],a.shape[2]]));let c={x:o},u={depthRadius:t,bias:n,alpha:r,beta:i},d=F.runKernel(`LRN`,c,u);return s?V(d,[d.shape[1],d.shape[2],d.shape[3]]):d}const Hu=L({localResponseNormalization_:Vu});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Uu(e){let t={x:I(e,`x`,`log`,`float32`)};return F.runKernel(`Log`,t)}const Wu=L({log_:Uu});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Gu(e){let t={x:I(e,`x`,`log1p`)};return F.runKernel(Nt,t)}const Ku=L({log1p_:Gu});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function qu(e){return F.customGrad(e)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ju(e){let t={x:I(e,`x`,`softplus`)};return F.runKernel(wn,t)}const Yu=L({softplus_:Ju});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Xu(e){let t=I(e,`x`,`logSigmoid`);return qu(e=>({value:Ro(Yu(Ro(e))),gradFunc:t=>B(t,uc(Ro(e)))}))(t)}const Zu=L({logSigmoid_:Xu});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Qu(e,t){let n=I(e,`a`,`sub`),r=I(t,`b`,`sub`);[n,r]=Ai(n,r);let i={a:n,b:r};return F.runKernel(`Sub`,i)}const G=L({sub_:Qu});
/**
* @license
* Copyright 2020 Google Inc. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function $u(e,t=-1){let n=I(e,`logits`,`logSoftmax`);if(t===-1&&(t=n.rank-1),t!==n.rank-1)throw Error(`Log Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and axis was ${t}`);return qu((e,n)=>{let r=G(e,Yl(e,t,!0)),i=G(Qa(r,`float32`),Wu(W(du(r),t,!0)));return n([i]),{value:i,gradFunc:(e,n)=>{let[r]=n,i=du(r);return G(e,B(W(e,t,!0),i))}}})(n)}const ed=L({logSoftmax_:$u});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function td(e,t=null,n=!1){let r=I(e,`x`,`logSumExp`),i=v(t,r.shape),a=Yl(r,i,!0),o=Wu(W(du(G(r,a)),i)),s=os(V(a,o.shape),o);return n?V(s,Ul(s.shape,i)):s}const nd=L({logSumExp_:td});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function rd(e,t){let n=I(e,`a`,`logicalAnd`,`bool`),r=I(t,`b`,`logicalAnd`,`bool`);Go(n.shape,r.shape);let i={a:n,b:r};return F.runKernel(Pt,i)}const id=L({logicalAnd_:rd});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ad(e){let t={x:I(e,`x`,`logicalNot`,`bool`)};return F.runKernel(Ft,t)}const od=L({logicalNot_:ad});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function sd(e,t){let n=I(e,`a`,`logicalOr`,`bool`),r=I(t,`b`,`logicalOr`,`bool`);Go(n.shape,r.shape);let i={a:n,b:r};return F.runKernel(It,i)}const cd=L({logicalOr_:sd});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ld(e,t){let n=I(e,`a`,`logicalXor`,`bool`),r=I(t,`b`,`logicalXor`,`bool`);return Go(n.shape,r.shape),id(cd(e,t),od(id(e,t)))}const ud=L({logicalXor_:ld}),dd=2147483648;function fd(e,t,n=`left`){let r=I(e,`sortedSequence`,`searchSorted`),i=I(t,`values`,`searchSorted`),a=r.shape[r.shape.length-1],o=i.shape[i.shape.length-1],s=V(r,[-1,a]),c=V(i,[-1,o]);if(s.rank<2)throw Error(`Sorted input argument must be at least 2-dimensional`);if(s.shape[0]!==c.shape[0])throw Error(`Leading dimension of 'sortedSequence' and 'values' must match.`);if(p(c.shape)>=dd)throw Error(`values tensor size must less than ${dd}`);if(s.shape[1]>=dd)throw Error(`trailing dim_size must less than ${dd} for int32 output type, was ${s.shape[1]}`);let l={sortedSequence:s,values:c},u={side:n};return F.runKernel(_n,l,u)}const pd=L({searchSorted_:fd});
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function md(e,t){return pd(e,t,`left`)}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function hd(e,t,n,r,i){let a=I(e,`x`,`maxPool`),o=a,s=!1;a.rank===3&&(s=!0,o=V(a,[1,a.shape[0],a.shape[1],a.shape[2]])),l(o.rank===4,()=>`Error in maxPool: input must be rank 4 but got rank ${o.rank}.`),l($s(n,1),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${n} and dilations '1'`),tc(`maxPool`,r,i);let c={x:o},u={filterSize:t,strides:n,pad:r,dimRoundingMode:i},d=F.runKernel(Rt,c,u);return s?V(d,[d.shape[1],d.shape[2],d.shape[3]]):d}const gd=L({maxPool_:hd});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function _d(e,t=[1,1,1],n,r,i,a=`NDHWC`){let o=I(e,`x`,`maxPool3d`),s=o,c=!1;o.rank===4&&(c=!0,s=V(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),l(s.rank===5,()=>`Error in maxPool3d: x must be rank 5 but got rank ${s.rank}.`),l(a===`NDHWC`,()=>`Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of ${a}`),tc(`maxPool3d`,r,i);let u={x:s},d={filterSize:t,strides:n,pad:r,dimRoundingMode:i,dataFormat:a},f=F.runKernel(zt,u,d);return c?V(f,[f.shape[1],f.shape[2],f.shape[3],f.shape[4]]):f}const vd=L({maxPool3d_:_d});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function yd(e,t,n,r,i=!1){let a={x:I(e,`x`,`maxPoolWithArgmax`)},o={filterSize:t,strides:n,pad:r,includeBatchInIndex:i},s=F.runKernel(Bt,a,o);return{result:s[0],indexes:s[1]}}const bd=L({maxPoolWithArgmax_:yd});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function xd(e,t){let n=I(e,`a`,`maximum`),r=I(t,`b`,`maximum`);[n,r]=Ai(n,r),n.dtype===`bool`&&(n=Qa(n,`int32`),r=Qa(r,`int32`)),Go(n.shape,r.shape);let i={a:n,b:r};return F.runKernel(Lt,i)}const Sd=L({maximum_:xd});
/**
* @license
* Copyright 2020 Google Inc. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Cd(e,t=null,n=!1){let r={x:I(e,`x`,`mean`)},i={axis:t,keepDims:n};return F.runKernel(Vt,r,i)}const wd=L({mean_:Cd});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Td(e,t=`float32`){if(t===`complex64`)return Yi(Td(e,`float32`),Td(e,`float32`));let n=A(p(e),t);return F.makeTensor(n,e,t)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ed(e,t=`float32`){if(t===`complex64`)return Yi(Ed(e,`float32`),Td(e,`float32`));let n=oe(p(e),t);return F.makeTensor(n,e,t)}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Dd(e,t,{indexing:n=`xy`}={}){if(n!==`xy`&&n!==`ij`)throw TypeError(`${n} is not a valid third argument to meshgrid`);if(e===void 0)return[];let r=I(e,`x`,`meshgrid`,e instanceof bi?e.dtype:`float32`);if(t===void 0)return[r];let i=I(t,`y`,`meshgrid`,t instanceof bi?t.dtype:`float32`),a=p(r.shape),o=p(i.shape);return n===`xy`?(r=V(r,[1,-1]),i=V(i,[-1,1]),[z(Ed([o,1],r.dtype),r),z(i,Ed([1,a],i.dtype))]):(r=V(r,[-1,1]),i=V(i,[1,-1]),[z(r,Ed([1,o],r.dtype)),z(Ed([a,1],i.dtype),i)])}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Od(e,t){let n=I(e,`a`,`minimum`),r=I(t,`b`,`minimum`);[n,r]=Ai(n,r),n.dtype===`bool`&&(n=Qa(n,`int32`),r=Qa(r,`int32`)),Go(n.shape,r.shape);let i={a:n,b:r};return F.runKernel(Ht,i)}const kd=L({minimum_:Od});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ad(e,t,n){l(n===`reflect`||n===`symmetric`,()=>`Invalid mode. Mode must be either reflect or symmetric. Got ${n}.`);let r=I(e,`x`,`mirrorPad`);if(r.rank===0)throw Error(`mirrorPad(scalar) is not defined. Pass non-scalar to mirrorPad`);l(t.length===r.rank,()=>`Padding doesn't match input. Must be ${r.rank}. Got ${t.length}.`);let i=n===`reflect`?1:0;for(let e=0;e<r.rank;e++)l(t[e].length===2,()=>`Invalid number of paddings. Must be length of 2 each.`),l(t[e][0]>=0&&t[e][0]<=r.shape[e]-i&&t[e][1]>=0&&t[e][1]<=r.shape[e]-i,()=>`Padding in dimension ${e} cannot be greater than or equal to ${r.shape[e]-i} or less than 0 for input of shape ${r.shape}`);let a={paddings:t,mode:n},o={x:r};return F.runKernel(Ut,o,a)}const jd=L({mirrorPad_:Ad});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Md(e,t){let n=I(e,`a`,`mod`),r=I(t,`b`,`mod`);[n,r]=Ai(n,r);let i={a:n,b:r};return F.runKernel(`Mod`,i)}const Nd=L({mod_:Md});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Pd(e,t=null,n=!1){e=I(e,`x`,`moments`);let r=v(t,e.shape),i=wd(e,r,n),a=i.shape;return n||(a=Ul(i.shape,r)),{mean:i,variance:wd(ru(G(Qa(e,`float32`),V(i,a))),r,n)}}const Fd=L({moments_:Pd});function Id(e,t,n,r){let i=I(t,`data`,`multiRNNCell`),a=Ki(n,`c`,`multiRNNCell`),o=Ki(r,`h`,`multiRNNCell`),s=i,c=[];for(let t=0;t<e.length;t++){let n=e[t](s,a[t],o[t]);c.push(n[0]),c.push(n[1]),s=n[1]}let l=[],u=[];for(let e=0;e<c.length;e+=2)l.push(c[e]),u.push(c[e+1]);return[l,u]}const Ld=L({multiRNNCell_:Id});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Rd(e,t,n,r=!1){let i=I(e,`logits`,`multinomial`),a=i.size,o=i.rank;if(a<2)throw Error(`Error in multinomial: you need at least 2 outcomes, but got ${a}.`);if(o>2)throw Error(`Rank of probabilities must be 1 or 2, but is ${o}`);n||=Math.random();let s={logits:o===1?V(i,[1,-1]):i},c={numSamples:t,seed:n,normalized:r},l=F.runKernel(Wt,s,c);return o===1?V(l,[l.size]):l}const zd=L({multinomial_:Rd});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Bd(e,t){let n=I(e,`a`,`notEqual`,`string_or_numeric`),r=I(t,`b`,`notEqual`,`string_or_numeric`);[n,r]=Ai(n,r),Go(n.shape,r.shape);let i={a:n,b:r};return F.runKernel(Kt,i)}const Vd=L({notEqual_:Bd});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Hd(e){let t={x:I(e,`x`,`onesLike`)};return F.runKernel(Xt,t)}const Ud=L({onesLike_:Hd});function Wd(e,t){let n=I(e,`v1`,`outerProduct`),r=I(t,`v2`,`outerProduct`);return l(n.rank===1&&r.rank===1,()=>`Error in outerProduct: inputs must be rank 1, but got ranks ${n.rank} and ${r.rank}.`),z(V(n,[-1,1]),V(r,[1,-1]))}const Gd=L({outerProduct_:Wd});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Kd(e,t,n=0){let r=I(e,`x`,`pad`);if(r.rank===0)throw Error(`pad(scalar) is not defined. Pass non-scalar to pad`);let i={paddings:t,constantValue:n},a={x:r};return F.runKernel($t,a,i)}const qd=L({pad_:Kd});function Jd(e,t,n=0){return l(t.length===2,()=>`Invalid number of paddings. Must be length of 2.`),qd(e,[t],n)}const Yd=L({pad1d_:Jd});function Xd(e,t,n=0){return l(t.length===2&&t[0].length===2&&t[1].length===2,()=>`Invalid number of paddings. Must be length of 2 each.`),qd(e,t,n)}const Zd=L({pad2d_:Xd});function Qd(e,t,n=0){return l(t.length===3&&t[0].length===2&&t[1].length===2&&t[2].length===2,()=>`Invalid number of paddings. Must be length of 2 each.`),qd(e,t,n)}const $d=L({pad3d_:Qd});function ef(e,t,n=0){return l(t.length===4&&t[0].length===2&&t[1].length===2&&t[2].length===2&&t[3].length===2,()=>`Invalid number of paddings. Must be length of 2 each.`),qd(e,t,n)}const tf=L({pad4d_:ef});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function nf(e,t,n){let r=I(e,`x`,`spaceToBatchND`);l(r.rank>=1+t.length,()=>`input rank ${r.rank} should be > than [blockShape] ${t.length}`),l(n.length===t.length,()=>`paddings.shape[0] ${n.length} must be equal to [blockShape] ${t.length}`),l(r.shape.reduce((e,r,i)=>i>0&&i<=t.length?e&&(r+n[i-1][0]+n[i-1][1])%t[i-1]===0:e,!0),()=>`input spatial dimensions ${r.shape.slice(1)} with paddings ${n.toString()} must be divisible by blockShapes ${t.toString()}`);let i={x:r},a={blockShape:t,paddings:n};return F.runKernel(En,i,a)}const rf=L({spaceToBatchND_:nf});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function af(e,t,n,r,i,a,o){i??=[1,1],a??=1,r===0&&(r=`valid`);let s=I(e,`x`,`maxPool`),c=s,u=!1;s.rank===3&&(u=!0,c=V(s,[1,s.shape[0],s.shape[1],s.shape[2]])),l($s(a,i),()=>`Error in pool: Either strides or dilations must be 1. Got strides ${a} and dilations '${i}'`);let d=zs(c.shape,t,a,i,r),f=[d.dilationHeight,d.dilationWidth],p;p=r===`same`?sf([d.filterHeight,d.filterWidth],f):[[0,0],[0,0]];let m=f[0]===1&&f[1]===1,[h,g]=of([d.inHeight,d.inWidth],f,p),_=m?r:`valid`,v=m?c:rf(c,f,h),y=(n===`avg`?()=>ic(v,t,a,_,o):()=>gd(v,t,a,_,o))(),b=m?y:_c(y,f,g);return u?V(b,[b.shape[1],b.shape[2],b.shape[3]]):b}function of(e,t,n){let r=n.map(e=>e[0]),i=n.map(e=>e[1]),a=e.concat(r,i),o=t.map((e,t)=>(e-a[t]%e)%e),s=i.map((e,t)=>e+o[t]);return[t.map((e,t)=>[r[t],s[t]]),t.map((e,t)=>[0,o[t]])]}function sf(e,t){let n=e.map((e,n)=>e+(e-1)*(t[n]-1)).map(e=>e-1),r=n.map(e=>Math.floor(e/2)),i=n.map((e,t)=>e-r[t]);return n.map((e,t)=>[r[t],i[t]])}const cf=L({pool_:af});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function lf(e,t){let n={x:I(e,`x`,`prelu`),alpha:I(t,`alpha`,`prelu`)};return F.runKernel(en,n)}const uf=L({prelu_:lf});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function df(e,t=null,n=!1){let r=I(e,`x`,`prod`);r.dtype===`bool`&&(r=Qa(r,`int32`));let i={x:r},a={axis:t,keepDims:n};return F.runKernel(tn,i,a)}const ff=L({prod_:df});
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function pf(e,t,n,r){let i={paramsNestedSplits:e.map((e,t)=>I(e,`tensors${t}`,`raggedGather`,`int32`)),paramsDenseValues:I(t,`paramsDenseValues`,`raggedGather`),indices:I(n,`indices`,`raggedGather`,`int32`)},a={outputRaggedRank:r},o=F.runKernel(nn,i,a);return{outputNestedSplits:o.slice(0,o.length-1),outputDenseValues:o[o.length-1]}}const mf=L({raggedGather_:pf});
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function hf(e,t,n,r,i){let a=I(e,`shape`,`raggedTensorToTensor`,`int32`),o=I(t,`values`,`raggedTensorToTensor`),s={shape:a,values:o,defaultValue:I(n,`defaultValue`,`raggedTensorToTensor`,o.dtype),rowPartitionTensors:r.map((e,t)=>I(e,`tensors${t}`,`raggedTensorToTensor`,`int32`))},c={rowPartitionTypes:i};return F.runKernel(rn,s,c)}const gf=L({raggedTensorToTensor_:hf});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function _f(e,t,n){let r=p(e),i=null;if(n==null||n===`float32`)i=new Float32Array(r);else if(n===`int32`)i=new Int32Array(r);else if(n===`bool`)i=new Uint8Array(r);else throw Error(`Unknown data type ${n}`);for(let e=0;e<r;e++)i[e]=t();return F.makeTensor(i,e,n)}const vf=L({rand_:_f});var yf={exports:{}};yf.exports,(function(e){(function(e,t,n){function r(e){var t=this,n=o();t.next=function(){var e=2091639*t.s0+t.c*23283064365386963e-26;return t.s0=t.s1,t.s1=t.s2,t.s2=e-(t.c=e|0)},t.c=1,t.s0=n(` `),t.s1=n(` `),t.s2=n(` `),t.s0-=n(e),t.s0<0&&(t.s0+=1),t.s1-=n(e),t.s1<0&&(t.s1+=1),t.s2-=n(e),t.s2<0&&(t.s2+=1),n=null}function i(e,t){return t.c=e.c,t.s0=e.s0,t.s1=e.s1,t.s2=e.s2,t}function a(e,t){var n=new r(e),a=t&&t.state,o=n.next;return o.int32=function(){return n.next()*4294967296|0},o.double=function(){return o()+(o()*2097152|0)*11102230246251565e-32},o.quick=o,a&&(typeof a==`object`&&i(a,n),o.state=function(){return i(n,{})}),o}function o(){var e=4022871197;return function(t){t=String(t);for(var n=0;n<t.length;n++){e+=t.charCodeAt(n);var r=.02519603282416938*e;e=r>>>0,r-=e,r*=e,e=r>>>0,r-=e,e+=r*4294967296}return(e>>>0)*23283064365386963e-26}}t&&t.exports?t.exports=a:n&&n.amd?n(function(){return a}):this.alea=a})(sr,e,!1)})(yf);var bf=yf.exports,xf={exports:{}};xf.exports,(function(e){(function(e,t,n){function r(e){var t=this,n=``;t.x=0,t.y=0,t.z=0,t.w=0,t.next=function(){var e=t.x^t.x<<11;return t.x=t.y,t.y=t.z,t.z=t.w,t.w^=t.w>>>19^e^e>>>8},e===(e|0)?t.x=e:n+=e;for(var r=0;r<n.length+64;r++)t.x^=n.charCodeAt(r)|0,t.next()}function i(e,t){return t.x=e.x,t.y=e.y,t.z=e.z,t.w=e.w,t}function a(e,t){var n=new r(e),a=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21);while(e===0);return e},o.int32=n.next,o.quick=o,a&&(typeof a==`object`&&i(a,n),o.state=function(){return i(n,{})}),o}t&&t.exports?t.exports=a:n&&n.amd?n(function(){return a}):this.xor128=a})(sr,e,!1)})(xf);var Sf=xf.exports,Cf={exports:{}};Cf.exports,(function(e){(function(e,t,n){function r(e){var t=this,n=``;t.next=function(){var e=t.x^t.x>>>2;return t.x=t.y,t.y=t.z,t.z=t.w,t.w=t.v,(t.d=t.d+362437|0)+(t.v=t.v^t.v<<4^(e^e<<1))|0},t.x=0,t.y=0,t.z=0,t.w=0,t.v=0,e===(e|0)?t.x=e:n+=e;for(var r=0;r<n.length+64;r++)t.x^=n.charCodeAt(r)|0,r==n.length&&(t.d=t.x<<10^t.x>>>4),t.next()}function i(e,t){return t.x=e.x,t.y=e.y,t.z=e.z,t.w=e.w,t.v=e.v,t.d=e.d,t}function a(e,t){var n=new r(e),a=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21);while(e===0);return e},o.int32=n.next,o.quick=o,a&&(typeof a==`object`&&i(a,n),o.state=function(){return i(n,{})}),o}t&&t.exports?t.exports=a:n&&n.amd?n(function(){return a}):this.xorwow=a})(sr,e,!1)})(Cf);var wf=Cf.exports,Tf={exports:{}};Tf.exports,(function(e){(function(e,t,n){function r(e){var t=this;t.next=function(){var e=t.x,n=t.i,r=e[n],i;return r^=r>>>7,i=r^r<<24,r=e[n+1&7],i^=r^r>>>10,r=e[n+3&7],i^=r^r>>>3,r=e[n+4&7],i^=r^r<<7,r=e[n+7&7],r^=r<<13,i^=r^r<<9,e[n]=i,t.i=n+1&7,i};function n(e,t){var n,r=[];if(t===(t|0))r[0]=t;else for(t=``+t,n=0;n<t.length;++n)r[n&7]=r[n&7]<<15^t.charCodeAt(n)+r[n+1&7]<<13;for(;r.length<8;)r.push(0);for(n=0;n<8&&r[n]===0;++n);for(n==8?r[7]=-1:r[n],e.x=r,e.i=0,n=256;n>0;--n)e.next()}n(t,e)}function i(e,t){return t.x=e.x.slice(),t.i=e.i,t}function a(e,t){e??=+new Date;var n=new r(e),a=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21);while(e===0);return e},o.int32=n.next,o.quick=o,a&&(a.x&&i(a,n),o.state=function(){return i(n,{})}),o}t&&t.exports?t.exports=a:n&&n.amd?n(function(){return a}):this.xorshift7=a})(sr,e,!1)})(Tf);var Ef=Tf.exports,Df={exports:{}};Df.exports,(function(e){(function(e,t,n){function r(e){var t=this;t.next=function(){var e=t.w,n=t.X,r=t.i,i,a;return t.w=e=e+1640531527|0,a=n[r+34&127],i=n[r=r+1&127],a^=a<<13,i^=i<<17,a^=a>>>15,i^=i>>>12,a=n[r]=a^i,t.i=r,a+(e^e>>>16)|0};function n(e,t){var n,r,i,a,o,s=[],c=128;for(t===(t|0)?(r=t,t=null):(t+=`\0`,r=0,c=Math.max(c,t.length)),i=0,a=-32;a<c;++a)t&&(r^=t.charCodeAt((a+32)%t.length)),a===0&&(o=r),r^=r<<10,r^=r>>>15,r^=r<<4,r^=r>>>13,a>=0&&(o=o+1640531527|0,n=s[a&127]^=r+o,i=n==0?i+1:0);for(i>=128&&(s[(t&&t.length||0)&127]=-1),i=127,a=512;a>0;--a)r=s[i+34&127],n=s[i=i+1&127],r^=r<<13,n^=n<<17,r^=r>>>15,n^=n>>>12,s[i]=r^n;e.w=o,e.X=s,e.i=i}n(t,e)}function i(e,t){return t.i=e.i,t.w=e.w,t.X=e.X.slice(),t}function a(e,t){e??=+new Date;var n=new r(e),a=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21);while(e===0);return e},o.int32=n.next,o.quick=o,a&&(a.X&&i(a,n),o.state=function(){return i(n,{})}),o}t&&t.exports?t.exports=a:n&&n.amd?n(function(){return a}):this.xor4096=a})(sr,e,!1)})(Df);var Of=Df.exports,kf={exports:{}};kf.exports,(function(e){(function(e,t,n){function r(e){var t=this,n=``;t.next=function(){var e=t.b,n=t.c,r=t.d,i=t.a;return e=e<<25^e>>>7^n,n=n-r|0,r=r<<24^r>>>8^i,i=i-e|0,t.b=e=e<<20^e>>>12^n,t.c=n=n-r|0,t.d=r<<16^n>>>16^i,t.a=i-e|0},t.a=0,t.b=0,t.c=-1640531527,t.d=1367130551,e===Math.floor(e)?(t.a=e/4294967296|0,t.b=e|0):n+=e;for(var r=0;r<n.length+20;r++)t.b^=n.charCodeAt(r)|0,t.next()}function i(e,t){return t.a=e.a,t.b=e.b,t.c=e.c,t.d=e.d,t}function a(e,t){var n=new r(e),a=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21);while(e===0);return e},o.int32=n.next,o.quick=o,a&&(typeof a==`object`&&i(a,n),o.state=function(){return i(n,{})}),o}t&&t.exports?t.exports=a:n&&n.amd?n(function(){return a}):this.tychei=a})(sr,e,!1)})(kf);var Af=kf.exports,jf={exports:{}},Mf=lr(Object.freeze({__proto__:null,default:{}}));(function(e){(function(t,n,r){var i=256,a=6,o=52,s=`random`,c=r.pow(i,a),l=r.pow(2,o),u=l*2,d=i-1,f;function p(e,t,o){var d=[];t=t==1?{entropy:!0}:t||{};var f=_(g(t.entropy?[e,y(n)]:e??v(),3),d),p=new m(d),b=function(){for(var e=p.g(a),t=c,n=0;e<l;)e=(e+n)*i,t*=i,n=p.g(1);for(;e>=u;)e/=2,t/=2,n>>>=1;return(e+n)/t};return b.int32=function(){return p.g(4)|0},b.quick=function(){return p.g(4)/4294967296},b.double=b,_(y(p.S),n),(t.pass||o||function(e,t,n,i){return i&&(i.S&&h(i,p),e.state=function(){return h(p,{})}),n?(r[s]=e,t):e})(b,f,`global`in t?t.global:this==r,t.state)}function m(e){var t,n=e.length,r=this,a=0,o=r.i=r.j=0,s=r.S=[];for(n||(e=[n++]);a<i;)s[a]=a++;for(a=0;a<i;a++)s[a]=s[o=d&o+e[a%n]+(t=s[a])],s[o]=t;(r.g=function(e){for(var t,n=0,a=r.i,o=r.j,s=r.S;e--;)t=s[a=d&a+1],n=n*i+s[d&(s[a]=s[o=d&o+t])+(s[o]=t)];return r.i=a,r.j=o,n})(i)}function h(e,t){return t.i=e.i,t.j=e.j,t.S=e.S.slice(),t}function g(e,t){var n=[],r=typeof e,i;if(t&&r==`object`)for(i in e)try{n.push(g(e[i],t-1))}catch{}return n.length?n:r==`string`?e:e+`\0`}function _(e,t){for(var n=e+``,r,i=0;i<n.length;)t[d&i]=d&(r^=t[d&i]*19)+n.charCodeAt(i++);return y(t)}function v(){try{var e;return f&&(e=f.randomBytes)?e=e(i):(e=new Uint8Array(i),(t.crypto||t.msCrypto).getRandomValues(e)),y(e)}catch{var r=t.navigator,a=r&&r.plugins;return[+new Date,t,a,t.screen,y(n)]}}function y(e){return String.fromCharCode.apply(0,e)}if(_(r.random(),n),e.exports){e.exports=p;try{f=Mf}catch{}}else r[`seed`+s]=p})(typeof self<`u`?self:sr,[],Math)})(jf);var Nf=jf.exports,Pf=bf,Ff=Sf,If=wf,Lf=Ef,Rf=Of,zf=Af,Bf=Nf;Bf.alea=Pf,Bf.xor128=Ff,Bf.xorwow=If,Bf.xorshift7=Lf,Bf.xor4096=Rf,Bf.tychei=zf;var Vf=Bf,Hf=class{constructor(e,t,n,r,i){this.mean=e,this.stdDev=t,this.dtype=n,this.nextVal=NaN,this.truncated=r,this.truncated&&(this.upper=this.mean+this.stdDev*2,this.lower=this.mean-this.stdDev*2);let a=i||Math.random();this.random=Vf.alea(a.toString())}nextValue(){if(!isNaN(this.nextVal)){let e=this.nextVal;return this.nextVal=NaN,e}let e,t,n=!1;for(;!n;){let r,i,a;do r=2*this.random()-1,i=2*this.random()-1,a=r*r+i*i;while(a>=1||a===0);let o=Math.sqrt(-2*Math.log(a)/a);e=this.mean+this.stdDev*r*o,t=this.mean+this.stdDev*i*o,(!this.truncated||this.isValidTruncated(e))&&(n=!0)}return(!this.truncated||this.isValidTruncated(t))&&(this.nextVal=this.convertValue(t)),this.convertValue(e)}convertValue(e){return this.dtype==null||this.dtype===`float32`?e:Math.round(e)}isValidTruncated(e){return e<=this.upper&&e>=this.lower}},Uf=class{constructor(e,t,n,r){this.alpha=e,this.beta=1/t,this.dtype=n;let i=r||Math.random();this.randu=Vf.alea(i.toString()),this.randn=new Hf(0,1,n,!1,this.randu()),e<1?this.d=e+2/3:this.d=e-1/3,this.c=1/Math.sqrt(9*this.d)}nextValue(){let e,t,n,r,i,a;for(;;){do r=this.randn.nextValue(),a=1+this.c*r;while(a<=0);if(a*=a*a,e=r*r,t=1-.331*e*e,n=.5*e+this.d*(1-a+Math.log(a)),i=this.randu(),i<t||Math.log(i)<n)break}return a=1/this.beta*this.d*a,this.alpha<1&&(a*=this.randu()**(1/this.alpha)),this.convertValue(a)}convertValue(e){return this.dtype===`float32`?e:Math.round(e)}},Wf=class{constructor(e=0,t=1,n,r){if(this.canReturnFloat=()=>this.dtype==null||this.dtype===`float32`,this.min=e,this.range=t-e,this.dtype=n,r??=Math.random(),typeof r==`number`&&(r=r.toString()),!this.canReturnFloat()&&this.range<=1)throw Error(`The difference between ${e} - ${t} <= 1 and dtype is not float`);this.random=Vf.alea(r)}convertValue(e){return this.canReturnFloat()?e:Math.round(e)}nextValue(){return this.convertValue(this.min+this.range*this.random())}};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Gf(e,t,n=1,r=`float32`,i){if(n??=1,r??=`float32`,r!==`float32`&&r!==`int32`)throw Error(`Unsupported data type ${r}`);let a=new Uf(t,n,r,i),o=R(e,r);for(let e=0;e<o.values.length;e++)o.values[e]=a.nextValue();return o.toTensor()}const Kf=L({randomGamma_:Gf});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function qf(e,t=0,n=1,r,i){if(r!=null&&r===`bool`)throw Error(`Unsupported data type ${r}`);let a=new Hf(t,n,r,!1,i),o=R(e,r);for(let e=0;e<o.values.length;e++)o.values[e]=a.nextValue();return o.toTensor()}const Jf=L({randomNormal_:qf});
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Yf(e,t,n){if(t!=null&&t===`bool`)throw Error(`Unsupported data type ${t}`);return Jf(e,0,1,t,n)}const Xf=L({randomStandardNormal_:Yf});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Zf(e,t=0,n=1,r=`float32`,i){let a=R(e,r),o=new Wf(t,n,null,i);for(let e=0;e<a.values.length;e++)a.values[e]=o.nextValue();return a.toTensor()}const Qf=L({randomUniform_:Zf});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function $f(e,t,n=1,r=`float32`){if(n===0)throw Error(`Cannot have a step of zero`);let i={start:e,stop:t,step:n,dtype:r};return F.runKernel(an,{},i)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ep(e){let t={x:I(e,`x`,`reciprocal`)};return F.runKernel(sn,t)}const tp=L({reciprocal_:ep});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function np(e){let t={x:I(e,`x`,`relu`)};return F.runKernel(cn,t)}const rp=L({relu_:np});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ip(e){let t={x:I(e,`x`,`relu6`)};return F.runKernel(fn,t)}const ap=L({relu6_:ip});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function op(e,t){let n={x:I(e,`x`,`reverse`)},r={dims:t};return F.runKernel(pn,n,r)}const sp=L({reverse_:op});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function cp(e){let t=I(e,`x`,`reverse`);return l(t.rank===1,()=>`Error in reverse1D: x must be rank 1 but got rank ${t.rank}.`),sp(t,0)}const lp=L({reverse1d_:cp});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function up(e,t){let n=I(e,`x`,`reverse`);return l(n.rank===2,()=>`Error in reverse2D: x must be rank 2 but got rank ${n.rank}.`),sp(n,t)}const dp=L({reverse2d_:up});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function fp(e,t){let n=I(e,`x`,`reverse`);return l(n.rank===3,()=>`Error in reverse3D: x must be rank 3 but got rank ${n.rank}.`),sp(n,t)}const pp=L({reverse3d_:fp});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function mp(e,t){let n=I(e,`x`,`reverse`);return l(n.rank===4,()=>`Error in reverse4D: x must be rank 4 but got rank ${n.rank}.`),sp(n,t)}const hp=L({reverse4d_:mp});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function gp(e){let t={x:I(e,`x`,`round`)};return F.runKernel(mn,t)}const _p=L({round_:gp});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function vp(e){let t={x:I(e,`x`,`rsqrt`,`float32`)};return F.runKernel(hn,t)}const yp=L({rsqrt_:vp});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function bp(e){let t={x:I(e,`x`,`selu`)};return F.runKernel(yn,t)}const xp=L({selu_:bp});function Sp(e,t,n,r,i,a=[1,1],o=`NHWC`){let s=I(e,`x`,`separableConv2d`),c=I(t,`depthwiseFilter`,`separableConv2d`),u=I(n,`pointwiseFilter`,`separableConv2d`),d=s,f=!1;if(s.rank===3&&(f=!0,d=V(s,[1,s.shape[0],s.shape[1],s.shape[2]])),o===`NCHW`)throw Error(`separableConv2d currently does not support dataFormat NCHW; only NHWC is supported`);l(d.rank===4,()=>`Error in separableConv2d: input must be rank 4, but got rank ${d.rank}.`),l(c.rank===4,()=>`Error in separableConv2d: depthwise filter must be rank 4, but got rank ${c.rank}.`),l(u.rank===4,()=>`Error in separableConv2d: pointwise filter must be rank 4, but got rank ${c.rank}.`),l(u.shape[0]===1,()=>`Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got ${u.shape[0]}.`),l(u.shape[1]===1,()=>`Error in separableConv2d: the second dimension of pointwise filter must be 1, but got ${u.shape[1]}.`);let p=c.shape[2],m=c.shape[3];l(u.shape[2]===p*m,()=>`Error in separableConv2d: the third dimension of pointwise filter must be ${p*m}, but got ${u.shape[2]}.`);let h=qc(yl(d,c,r,i,o,a),u,1,`valid`,o);return f?V(h,[h.shape[1],h.shape[2],h.shape[3]]):h}const Cp=L({separableConv2d_:Sp});
/**
* @license
* Copyright 2020 Google Inc. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
async function wp(e,t){let n=I(e,`x`,`setdiff1d`),r=I(t,`y`,`setdiff1d`);l(n.dtype===r.dtype,()=>`x and y should have the same dtype, but got x (${n.dtype}) and y (${r.dtype}).`),l(n.rank===1,()=>`x should be 1D tensor, but got x (${n.shape}).`),l(r.rank===1,()=>`y should be 1D tensor, but got y (${r.shape}).`);let i=await n.data(),a=await r.data(),o=new Set(a),s=0;for(let e=0;e<i.length;e++)o.has(i[e])||s++;let c=new hi([s],n.dtype),u=new hi([s],`int32`);for(let e=0,t=0;e<i.length;e++)o.has(i[e])||(c.values[t]=i[e],u.values[t]=e,t++);return[c.toTensor(),u.toTensor()]}const Tp=wp;
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ep(e){let t={x:I(e,`x`,`sign`)};return F.runKernel(Sn,t)}const Dp=L({sign_:Ep});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Op(e){let t={x:I(e,`x`,`sin`,`float32`)};return F.runKernel(`Sin`,t)}const kp=L({sin_:Op});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ap(e){let t={x:I(e,`x`,`sinh`)};return F.runKernel(xn,t)}const jp=L({sinh_:Ap});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Mp(e,t,n){let r=I(e,`x`,`slice1d`);return l(r.rank===1,()=>`slice1d expects a rank-1 tensor, but got a rank-${r.rank} tensor`),H(r,[t],[n])}const Np=L({slice1d_:Mp});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Pp(e,t,n){let r=I(e,`x`,`slice2d`);return l(r.rank===2,()=>`slice2d expects a rank-2 tensor, but got a rank-${r.rank} tensor`),H(r,t,n)}const Fp=L({slice2d_:Pp});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ip(e,t,n){let r=I(e,`x`,`slice3d`);return l(r.rank===3,()=>`slice3d expects a rank-3 tensor, but got a rank-${r.rank} tensor`),H(r,t,n)}const Lp=L({slice3d_:Ip});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Rp(e,t,n){let r=I(e,`x`,`slice4d`);return l(r.rank===4,()=>`slice4d expects a rank-4 tensor, but got a rank-${r.rank} tensor`),H(r,t,n)}const zp=L({slice4d_:Rp});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Bp(e,t=-1){let n=I(e,`logits`,`softmax`,`float32`);if(t===-1&&(t=n.rank-1),t!==n.rank-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and dim was ${t}`);let r={logits:n},i={dim:t};return F.runKernel(On,r,i)}const Vp=L({softmax_:Bp});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Hp(e){l(e.dtype===`complex64`,()=>`The dtype for tf.spectral.fft() must be complex64 but got ${e.dtype}.`);let t={input:e};return F.runKernel(`FFT`,t)}const Up=L({fft_:Hp});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Wp(e){l(e.dtype===`complex64`,()=>`The dtype for tf.spectral.ifft() must be complex64 but got ${e.dtype}.`);let t={input:e};return F.runKernel(wt,t)}const Gp=L({ifft_:Wp});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Kp(e){let t=e.shape[e.shape.length-1],n=e.size/t,r;if(t<=2)r=Gp(V(e,[n,t]));else{let i=[n,2*(t-1)],a=V(Bo(e),[n,t]),o=V(Io(e),[n,t]),s=sp(H(a,[0,1],[n,t-2]),1),c=B(sp(H(o,[0,1],[n,t-2]),1),U(-1));r=Gp(V(Yi(cc([a,s],1),cc([o,c],1)),[i[0],i[1]]))}if(r=Bo(r),e.rank===3&&e.shape[0]!==0){let t=r,n=e.shape[0];r=V(r,[n,r.shape[0]/n,r.shape[1]]),t.dispose()}return r}const qp=L({irfft_:Kp});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Jp(e,t,n=0){let r={x:I(e,`x`,`split`)},i={numOrSizeSplits:t,axis:n};return F.runKernel(Dn,r,i)}const Yp=L({split_:Jp});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Xp(e,t){l(e.dtype===`float32`,()=>`The dtype for rfft() must be real value but got ${e.dtype}`);let n=e.shape[e.shape.length-1],r=e.size/n,i;if(t!=null&&t<n){let r=e.shape.map(e=>0),a=e.shape.map(e=>e);a[e.shape.length-1]=t,i=H(e,r,a),n=t}else if(t!=null&&t>n){let r=e.shape.map(e=>e);r[e.shape.length-1]=t-n,i=cc([e,Td(r)],e.shape.length-1),n=t}else i=e;let a=kl(i),o=Up(V(Yi(i,a),[r,n])),s=Math.floor(n/2)+1,c=Bo(o),u=Io(o),d=Yp(c,[s,n-s],c.shape.length-1),f=Yp(u,[s,n-s],u.shape.length-1),p=i.shape.slice();return p[i.shape.length-1]=s,V(Yi(d[0],f[0]),p)}const Zp=L({rfft_:Xp});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Qp(e,t){let n=I(e,`a`,`squaredDifference`),r=I(t,`b`,`squaredDifference`);[n,r]=Ai(n,r),Go(n.shape,r.shape);let i={a:n,b:r};return F.runKernel(Pn,i,{})}const $p=L({squaredDifference_:Qp});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function em(e,t){let n=I(e,`x`,`squeeze`,`string_or_numeric`);return V(n,y(n.shape,t).newShape)}const tm=L({squeeze_:em});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function nm(e,t=0){let n=Ki(e,`tensors`,`stack`,`string_or_numeric`);l(n.length>=1,()=>`Pass at least one tensor to tf.stack`),n.length>0&&l(t<=n[0].rank,()=>`Axis must be <= rank of the tensor`);let r=n,i={axis:t};return F.runKernel(Qt,r,i)}const rm=L({stack_:nm});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function im(e,t=0){let n={x:I(e,`x`,`step`)},r={alpha:t};return F.runKernel(Jn,n,r)}const am=L({step_:im});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function om(e,t,n,r,i=0,a=0,o=0,s=0,c=0){let l={x:I(e,`x`,`stridedSlice`,`string_or_numeric`)},u={begin:t,end:n,strides:r,beginMask:i,endMask:a,ellipsisMask:o,newAxisMask:s,shrinkAxisMask:c};return F.runKernel(Fn,l,u)}const sm=L({stridedSlice_:om});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function cm(e){let t={x:I(e,`x`,`tan`,`float32`)};return F.runKernel(`Tan`,t)}const lm=L({tan_:cm});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function um(e,t){d(e);let n=Ui(e,t);if(n.length!==1)throw Error(`tensor1d() requires values to be a flat/TypedArray`);return Xi(e,null,n,t)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function dm(e,t,n){if(d(e),t!=null&&t.length!==2)throw Error(`tensor2d() requires shape to have two numbers`);let r=Ui(e,n);if(r.length!==2&&r.length!==1)throw Error(`tensor2d() requires values to be number[][] or flat/TypedArray`);if(r.length===1&&t==null)throw Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");return Xi(e,t,r,n)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function fm(e,t,n){if(d(e),t!=null&&t.length!==4)throw Error(`tensor4d() requires shape to have four numbers`);let r=Ui(e,n);if(r.length!==4&&r.length!==1)throw Error(`tensor4d() requires values to be number[][][][] or flat/TypedArray`);if(r.length===1&&t==null)throw Error("tensor4d() requires shape to be provided when `values` are a flat array");return Xi(e,t,r,n)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function pm(e,t,n){if(d(e),t!=null&&t.length!==5)throw Error(`tensor5d() requires shape to have five numbers`);let r=Ui(e,n);if(r.length!==5&&r.length!==1)throw Error(`tensor5d() requires values to be number[][][][][] or flat/TypedArray`);if(r.length===1&&t==null)throw Error("tensor5d() requires shape to be provided when `values` are a flat array");return Xi(e,t,r,n)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function mm(e,t,n){if(d(e),t!=null&&t.length!==6)throw Error(`tensor6d() requires shape to have six numbers`);let r=Ui(e,n);if(r.length!==6&&r.length!==1)throw Error(`tensor6d() requires values to be number[][][][][][] or flat/TypedArray`);if(r.length===1&&t==null)throw Error("tensor6d() requires shape to be provided when `values` are a flat array");return t||=r,Xi(e,t,r,n)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function hm(e,t=1,n=!0){let r=I(e,`x`,`topk`);if(r.rank===0)throw Error(`topk() expects the input to be of rank 1 or higher`);let i=r.shape[r.shape.length-1];if(t<0)throw Error(`'k' passed to topk() must be >= 0 but got ${t}`);if(t>i)throw Error(`'k' passed to topk() must be <= the last dimension (${i}) but got ${t}`);let a={x:r},o={k:t,sorted:n},[s,c]=F.runKernel(Vn,a,o);return{values:s,indices:c}}const gm=L({topk_:hm});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function _m(e,t=0,n=1,r,i){if(r!=null&&r===`bool`)throw Error(`Unsupported data type $ { dtype }`);let a=new Hf(t,n,r,!0,i),o=R(e,r);for(let e=0;e<o.values.length;e++)o.values[e]=a.nextValue();return o.toTensor()}const vm=L({truncatedNormal_:_m});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ym(e,t=0){let n=I(e,`x`,`unique`,`string_or_numeric`);l(n.rank>0,()=>`The input tensor must be at least 1D`);let r={x:n},i={axis:t},[a,o]=F.runKernel(Wn,r,i);return{values:a,indices:o}}const bm=L({unique_:ym});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function xm(e,t,n){let r=I(e,`x`,`unsortedSegmentSum`),i=I(t,`segmentIds`,`unsortedSegmentSum`,`int32`);l(h(n),()=>`numSegments must be of dtype int`);let a={x:r,segmentIds:i},o={numSegments:n};return F.runKernel(Kn,a,o)}const Sm=L({unsortedSegmentSum_:xm});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Cm(e,t=0){let n=I(e,`x`,`unstack`,`string_or_numeric`);l(t>=-n.shape.length&&t<n.shape.length,()=>`Axis = ${t} is not in [-${n.shape.length}, ${n.shape.length})`);let r={value:n},i={axis:t};return F.runKernel(Gn,r,i)}const wm=L({unstack_:Cm});
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Tm(e,t){return pd(e,t,`right`)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Em(e,t=!0,n,r){return F.makeVariable(e,t,n,r)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Dm(e,t){let n=[];for(let e=0;e<t.length;e++)t[e]&&n.push(e);let r=R(e,`int32`),i=R([n.length,e.length],`int32`);for(let t=0;t<n.length;t++){let a=r.indexToLoc(n[t]),o=t*e.length;i.values.set(a,o)}return i.toTensor()}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
async function Om(e){let t=I(e,`condition`,`whereAsync`,`bool`),n=await t.data(),r=Dm(t.shape,n);return e!==t&&t.dispose(),r}const km=Om;
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
async function Am(e,t,n){let r=I(e,`tensor`,`boolMask`),i=I(t,`mask`,`boolMask`,`bool`),a=n??0,o=i.rank,s=r.shape;l(o>0,()=>`mask cannot be scalar`),u(s.slice(a,a+o),i.shape,`mask's shape must match the first K dimensions of tensor's shape,`);let c=1;for(let e=a;e<a+o;e++)c*=s[e];let d=V(r,s.slice(0,a).concat([c],s.slice(a+o))),f=V(i,[-1]),p=await km(f),m=tm(p,[1]),h=Cu(d,m,a);return e!==r&&r.dispose(),t!==i&&i.dispose(),m.dispose(),d.dispose(),f.dispose(),p.dispose(),h}const jm=Am;
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Mm(e,t,n,r,i=!0){let a=I(e,`v`,`movingAverage`),o=I(t,`x`,`movingAverage`),s=I(n,`decay`,`movingAverage`);ji(a,o),l(m(a.shape,o.shape),()=>`Shape mismatch in v and x`);let c=U(1),u=G(c,s),d=B(G(o,a),u);if(i){l(r!=null,()=>`When using zeroDebias: true, step is required.`);let e=I(r,`step`,`movingAverage`);d=us(d,G(c,$l(s,e)))}return os(a,d)}const Nm=L({movingAverage_:Mm});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Pm(e,t,n){let r=I(e,`indices`,`scatterND`,`int32`),i=I(t,`updates`,`scatterND`);Yo(i,r,n);let a={indices:r,updates:i},o={shape:n};return F.runKernel(gn,a,o)}const Fm=L({scatterND_:Pm});function Im(e,t,n,r){if(e.dtype!==`int32`)throw Error(`tf.sparseToDense() expects the indices to be int32 type, but the dtype was ${e.dtype}.`);if(e.rank>2)throw Error(`sparseIndices should be a scalar, vector, or matrix, but got shape ${e.shape}.`);let i=e.rank>0?e.shape[0]:1,a=e.rank>1?e.shape[1]:1;if(n.length!==a)throw Error(`outputShape has incorrect number of elements:, ${n.length}, should be: ${a}.`);let o=t.size;if(!(t.rank===0||t.rank===1&&o===i))throw Error(`sparseValues has incorrect shape ${t.shape}, should be [] or [${i}]`);if(t.dtype!==r.dtype)throw Error(`sparseValues.dtype must match defaultValues.dtype`)}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Lm(e,t,n,r=0){let i=I(e,`sparseIndices`,`sparseToDense`,`int32`),a=I(t,`sparseValues`,`sparseToDense`,`string_or_numeric`),o=I(r,`defaultValue`,`sparseToDense`,a.dtype);Im(i,a,n,o);let s={sparseIndices:i,sparseValues:a,defaultValue:o},c={outputShape:n};return F.runKernel(Nn,s,c)}const Rm=L({sparseToDense_:Lm});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function zm(e,t){let n=I(t,`indices`,`gatherND`,`int32`),r={params:I(e,`x`,`gatherND`,`string_or_numeric`),indices:n};return F.runKernel(bt,r)}const Bm=L({gatherND_:zm});
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Vm(e,t){if(t==null)return e.shape.slice();if(m(e.shape,t))return t;if(e.shape.length===t.length){let n=[];for(let r=0;r<e.shape.length;r++)t[r]==null&&e.shape[r]!=null?n.push(e.shape[r]):n.push(t[r]);return n}return t}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Hm(e,t,n,r){let i=I(e,`x`,`dropout`);if(l(i.dtype===`float32`,()=>`x has to be a floating point tensor since it's going to be scaled, but got a ${i.dtype} tensor instead.`),l(t>=0&&t<1,()=>`rate must be a float in the range [0, 1), but got ${t}.`),t===0)return e instanceof bi?i.clone():i;let a=Vm(i,n),o=1-t;return B(i,us(xu(os(Qf(a,0,1,`float32`,r),o)),o))}const Um=L({dropout_:Hm});
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Wm(e){return Math.floor(2**Math.ceil(Math.log(e)/Math.log(2)))}function Gm(e,t,n){let r=1-e%2,i=new Float32Array(e);for(let a=0;a<e;++a){let o=2*Math.PI*a/(e+r-1);i[a]=t-n*Math.cos(o)}return um(i,`float32`)}
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
async function Km(e,t,n=1){let r=I(e,`predictions`,`inTopK`),i=I(t,`targets`,`inTopK`);l(r.rank>1,()=>`inTopK() expects the predictions to be of rank 2 or higher, but got ${r.rank}`),l(r.rank-1===i.rank,()=>`predictions rank should be 1 larger than targets rank, but got predictions rank ${r.rank} and targets rank ${i.rank}`),u(r.shape.slice(0,r.shape.length-1),i.shape,`predictions's shape should be align with the targets' shape, except the last dimension.`);let a=r.shape[r.shape.length-1];l(n>0&&n<=a,()=>`'k' passed to inTopK() must be > 0 && <= the predictions last dimension (${a}), but got ${n}`);let o=await r.data(),s=await i.data(),[c,d]=[o.length/a,a],f=b(`bool`,c);for(let e=0;e<c;e++){let t=e*d,r=o.subarray(t,t+d),i=[];for(let e=0;e<r.length;e++)i.push({value:r[e],index:e});i.sort((e,t)=>t.value-e.value),f[e]=0;for(let t=0;t<n;t++)if(i[t].index===s[e]){f[e]=1;break}}return e!==r&&r.dispose(),t!==i&&i.dispose(),Zi(f,i.shape,`bool`)}const qm=Km;
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Jm(e,t,n,r,i,a=`NHWC`,o){let s=e;e.rank===3&&(s=V(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let c=t;c.rank===3&&(c=V(t,[1,t.shape[0],t.shape[1],t.shape[2]])),l(s.rank===4,()=>`Error in conv2dDerFilter: input must be rank 4, but got shape ${s.shape}.`),l(c.rank===4,()=>`Error in conv2dDerFilter: dy must be rank 4, but got shape ${c.shape}.`),l(n.length===4,()=>`Error in conv2dDerFilter: filterShape must be length 4, but got ${n}.`);let u=a===`NHWC`?s.shape[3]:s.shape[1],d=a===`NHWC`?c.shape[3]:c.shape[1];l(u===n[2],()=>`Error in conv2dDerFilter: depth of input ${u}) must match input depth in filter (${n[2]}.`),l(d===n[3],()=>`Error in conv2dDerFilter: depth of dy (${d}) must match output depth for filter (${n[3]}).`),tc(`conv2dDerFilter`,i,o);let f={x:s,dy:c},p={strides:r,pad:i,dataFormat:a,dimRoundingMode:o,filterShape:n};return F.runKernel(Ke,f,p)}const Ym=L({conv2DBackpropFilter_:Jm});
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Xm(e,t,n){if(n==null||n===`linear`)return e;if(n===`relu`)return B(e,am(t));throw Error(`Cannot compute gradient for fused activation ${n}.`)}function Zm(e,t){let n=t,r=Wo(e.shape,t.shape);return r.length>0&&(n=W(n,r)),V(n,e.shape)}function Qm(e,t,n,r){if(t===`linear`)return e;if(t===`relu`)return rp(e);if(t===`elu`)return Ll(e);if(t===`relu6`)return ap(e);if(t===`prelu`)return uf(e,n);if(t===`leakyrelu`)return Fu(e,r);if(t===`sigmoid`)return uc(e);throw Error(`Unknown fused activation ${t}.`)}const $m=(e,t)=>!(e>0)||t===`linear`;
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function eh({x:e,filter:t,strides:n,pad:r,dataFormat:i=`NHWC`,dilations:a=[1,1],dimRoundingMode:o,bias:s,activation:c=`linear`,preluActivationWeights:u,leakyreluAlpha:d}){if(c||=`linear`,$m(F.state.gradientDepth,c)===!1){l(i===`NHWC`,()=>`Error in fused conv2d: got dataFormat of ${i} but only NHWC is currently supported for the case of gradient depth is 0 and the activation is not linear.`);let f=qc(e,t,n,r,i,a,o);return s!=null&&(f=os(f,s)),Qm(f,c,u,d)}let f=I(e,`x`,`conv2d`,`float32`),p=I(t,`filter`,`conv2d`,`float32`),m=f,h=!1;f.rank===3&&(h=!0,m=V(f,[1,f.shape[0],f.shape[1],f.shape[2]])),l(m.rank===4,()=>`Error in fused conv2d: input must be rank 4, but got rank ${m.rank}.`),l(p.rank===4,()=>`Error in fused conv2d: filter must be rank 4, but got rank ${p.rank}.`),tc(`fused conv2d`,r,o);let g=i===`NHWC`?m.shape[3]:m.shape[1];l(p.shape[2]===g,()=>`Error in conv2d: depth of input (${g}) must match input depth for filter ${p.shape[2]}.`),l($s(n,a),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`);let _=Vs(m.shape,p.shape,n,a,r,o),v;s!=null&&(v=I(s,`bias`,`fused conv2d`),[v]=Ai(v,f),i===`NHWC`?Go(_.outShape,v.shape):(l(v.shape.length<=1,()=>`Error in fused conv2d: only supports scalar or 1-D Tensor bias for NCHW format but got the bias of rank-${v.shape.length}.`),l(v.shape.length===0||v.shape[0]===_.outChannels||v.shape[0]===1,()=>`Error in fused conv2d: bias shape (${v.shape}) is not compatible with the number of output channels (${_.outChannels})`)));let y;if(u!=null){let e=u.shape;if(l(e.length<=1||e.length===3,()=>`Error in fused conv2d: only supports scalar, 1-D Tensor or 3-D Tensor PReLU activation weights but got a tensor of rank-${e.length}.`),e.length===1)l(e[0]===1||e[0]===_.outChannels,()=>`Error in fused conv2d: PReLU activation weights (${e}) is not compatible with the number of output channels (${_.outChannels}).`);else if(e.length===3)try{Go(e,_.outShape)}catch{let t=`Error in fused conv2d: PReLU activation weights (${e}) is not compatible with the output shape of the conv2d (${_.outShape}).`;throw Error(t)}y=I(u,`prelu weights`,`fused conv2d`)}let b=(e,t)=>{l(i===`NHWC`,()=>`Error in gradient of fused conv2D: got dataFormat of ${i} but only NHWC is currently supported.`);let[o,s,u,d]=t,f=Xm(e,u,c);l(Qs(a),()=>`Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${a}'`);let p=[Zc(s.shape,f,o,n,r),Ym(s,f,o.shape,n,r)];if(d!=null){let e=Zm(d,f);p.push(e)}return p},x={x:m,filter:p,bias:v,preluActivationWeights:y},S={strides:n,pad:r,dataFormat:i,dilations:a,dimRoundingMode:o,activation:c,leakyreluAlpha:d};return s==null?qu((e,t,n)=>{let r=F.runKernel(Zn,x,S);return n([t,e,r]),h&&(r=V(r,[r.shape[1],r.shape[2],r.shape[3]])),{value:r,gradFunc:b}})(m,p):qu((e,t,n,r)=>{let i=F.runKernel(Zn,x,S);return r([t,e,i,n]),h&&(i=V(i,[i.shape[1],i.shape[2],i.shape[3]])),{value:i,gradFunc:b}})(m,p,v)}const th=L({fusedConv2d_:eh});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function nh(e,t,n,r,i,a=[1,1],o){let s=e;e.rank===3&&(s=V(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let c=t;c.rank===3&&(c=V(t,[1,t.shape[0],t.shape[1],t.shape[2]]));let l={x:s,dy:c},u={strides:r,pad:i,dimRoundingMode:o,dilations:a,filterShape:n};return F.runKernel(rt,l,u)}const rh=L({depthwiseConv2dNativeBackpropFilter_:nh});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ih(e,t,n,r,i,a=[1,1],o){let s=t,c=!1;t.rank===3&&(c=!0,s=V(t,[1,t.shape[0],t.shape[1],t.shape[2]]));let l={dy:s,filter:n},u={strides:r,pad:i,dimRoundingMode:o,dilations:a,inputShape:e},d=F.runKernel(it,l,u);return c?V(d,[d.shape[1],d.shape[2],d.shape[3]]):d}const ah=L({depthwiseConv2dNativeBackpropInput_:ih});
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function oh({x:e,filter:t,strides:n,pad:r,dataFormat:i=`NHWC`,dilations:a=[1,1],dimRoundingMode:o,bias:s,activation:c=`linear`,preluActivationWeights:u,leakyreluAlpha:d}){if($m(F.state.gradientDepth,c)===!1){let l=yl(e,t,n,r,i,a,o);return s!=null&&(l=os(l,s)),Qm(l,c,u,d)}let f=I(e,`x`,`depthwiseConv2d`,`float32`),p=I(t,`filter`,`depthwiseConv2d`,`float32`),m=f,h=!1;f.rank===3&&(h=!0,m=V(f,[1,f.shape[0],f.shape[1],f.shape[2]])),l(m.rank===4,()=>`Error in fused depthwiseConv2d: input must be rank 4, but got rank ${m.rank}.`),l(p.rank===4,()=>`Error in fused depthwiseConv2d: filter must be rank 4, but got rank ${p.rank}.`),l(m.shape[3]===p.shape[2],()=>`Error in fused depthwiseConv2d: number of input channels (${m.shape[3]}) must match the inChannels dimension in filter ${p.shape[2]}.`),a??=[1,1],l($s(n,a),()=>`Error in fused depthwiseConv2d: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`),tc(`fused depthwiseConv2d`,r,o);let g=Vs(m.shape,p.shape,n,a,r,o,!0),_;s!=null&&(_=I(s,`bias`,`fused conv2d`),[_]=Ai(_,f),Go(g.outShape,_.shape));let v;u!=null&&(v=I(u,`prelu weights`,`fused depthwiseConv2d`));let y=(e,t)=>{l(Qs(a),()=>`Error in gradient of fused depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '${a}'`);let[i,s,u,d]=t,f=Xm(e,u,c),p=ah(s.shape,f,i,n,r,a,o),m=rh(s,f,i.shape,n,r,a,o);return d==null?[p,m]:[p,m,Zm(_,f)]},b={x:m,filter:p,bias:_,preluActivationWeights:v},x={strides:n,pad:r,dataFormat:i,dilations:a,dimRoundingMode:o,activation:c,leakyreluAlpha:d};return s==null?qu((e,t,n)=>{let r=F.runKernel(Qn,b,x);return n([t,e,r]),h&&(r=V(r,[r.shape[1],r.shape[2],r.shape[3]])),{value:r,gradFunc:y}})(m,p):qu((e,t,n,r)=>{let i=F.runKernel(Qn,b,x);return r([t,e,i,n]),h&&(i=V(i,[i.shape[1],i.shape[2],i.shape[3]])),{value:i,gradFunc:y}})(m,p,_)}const sh=L({fusedDepthwiseConv2d_:oh});
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ch({a:e,b:t,transposeA:n=!1,transposeB:r=!1,bias:i,activation:a=`linear`,preluActivationWeights:o,leakyreluAlpha:s=.2}){if($m(F.state.gradientDepth,a)===!1){let c=z(e,t,n,r);return i!=null&&(c=os(c,i)),Qm(c,a,o,s)}let c=I(e,`a`,`fused matMul`),u=I(t,`b`,`fused matMul`);[c,u]=Ai(c,u);let d=n?c.shape[c.rank-2]:c.shape[c.rank-1],f=r?u.shape[u.rank-1]:u.shape[u.rank-2],m=n?c.shape[c.rank-1]:c.shape[c.rank-2],h=r?u.shape[u.rank-2]:u.shape[u.rank-1],g=c.shape.slice(0,-2),_=u.shape.slice(0,-2),v=p(g),y=p(_);l(d===f,()=>`Error in fused matMul: inner shapes (${d}) and (${f}) of Tensors with shapes ${c.shape} and ${u.shape} and transposeA=${n} and transposeB=${r} must match.`);let b=Go(c.shape.slice(0,-2),u.shape.slice(0,-2)).concat([m,h]),x=n?V(c,[v,d,m]):V(c,[v,m,d]),S=r?V(u,[y,h,f]):V(u,[y,f,h]),C;i!=null&&(C=I(i,`bias`,`fused matMul`),[C]=Ai(C,c),Go(b,C.shape));let w;o!=null&&(w=I(o,`prelu weights`,`fused matMul`));let T=(e,t)=>{let[o,s,c,l]=t,u=Xm(V(e,c.shape),c,a),d,f;if(!n&&!r?(d=z(u,s,!1,!0),f=z(o,u,!0,!1)):!n&&r?(d=z(u,s,!1,!1),f=z(u,o,!0,!1)):n&&!r?(d=z(s,u,!1,!0),f=z(o,u,!1,!1)):(d=z(s,u,!0,!0),f=z(u,o,!0,!0)),i!=null){let e=Zm(l,u);return[d,f,e]}else return[d,f]},E={a:x,b:S,bias:C,preluActivationWeights:w},D={transposeA:n,transposeB:r,activation:a,leakyreluAlpha:s};return i==null?qu((e,t,n)=>{let r=F.runKernel(Xn,E,D);return n([e,t,r]),{value:V(r,b),gradFunc:T}})(x,S):qu((e,t,n,r)=>{let i=F.runKernel(Xn,E,D);return r([e,t,i,n]),{value:V(i,b),gradFunc:T}})(x,S,C)}const lh=L({fusedMatMul_:ch});
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var uh=Object.freeze({__proto__:null,conv2d:th,depthwiseConv2d:sh,matMul:lh});
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function dh(e){return Gm(e,.54,.46)}const fh=L({hammingWindow_:dh});
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ph(e){return Gm(e,.5,.5)}const mh=L({hannWindow_:ph});
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function hh(e,t,n,r=!1,i=0){let a=0,o=[];for(;a+t<=e.size;)o.push(H(e,a,t)),a+=n;if(r)for(;a<e.size;){let r=a+t-e.size,s=cc([H(e,a,t-r),Fc([r],i)]);o.push(s),a+=n}return o.length===0?dm([],[0,t]):V(cc(o),[o.length,t])}const gh=L({frame_:hh});
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function _h(e,t,n,r,i=mh){return r??=Wm(t),Zp(B(gh(e,t,n),i(t)),r)}const vh=L({stft_:_h});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function yh(e,t,n,r,i=`bilinear`,a=0){let o=I(e,`image`,`cropAndResize`),s=I(t,`boxes`,`cropAndResize`,`float32`),c=I(n,`boxInd`,`cropAndResize`,`int32`),u=s.shape[0];l(o.rank===4,()=>`Error in cropAndResize: image must be rank 4,but got rank ${o.rank}.`),l(s.rank===2&&s.shape[1]===4,()=>`Error in cropAndResize: boxes must be have size [${u},4] but had shape ${s.shape}.`),l(c.rank===1&&c.shape[0]===u,()=>`Error in cropAndResize: boxInd must be have size [${u}] but had shape ${s.shape}.`),l(r.length===2,()=>`Error in cropAndResize: cropSize must be of length 2, but got length ${r.length}.`),l(r[0]>=1&&r[1]>=1,()=>`cropSize must be atleast [1,1], but was ${r}`),l(i===`bilinear`||i===`nearest`,()=>`method must be bilinear or nearest, but was ${i}`);let d={image:o,boxes:s,boxInd:c},f={method:i,extrapolationValue:a,cropSize:r};return F.runKernel($e,d,f)}const bh=L({cropAndResize_:yh});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function xh(e){let t=I(e,`image`,`flipLeftRight`,`float32`);l(t.rank===4,()=>`Error in flipLeftRight: image must be rank 4,but got rank ${t.rank}.`);let n={image:t};return F.runKernel(ht,n,{})}const Sh=L({flipLeftRight_:xh});
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ch(e){let t=I(e,`image`,`grayscaleToRGB`),n=t.rank-1,r=t.shape[n];l(t.rank>=2,()=>`Error in grayscaleToRGB: images must be at least rank 2, but got rank ${t.rank}.`),l(r===1,()=>`Error in grayscaleToRGB: last dimension of a grayscale image should be size 1, but got size ${r}.`);let i=Array(t.rank);return i.fill(1,0,n),i[n]=3,_u(t,i)}const wh=L({grayscaleToRGB_:Ch});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Th(e,t,n=0,r=.5){let i=I(e,`image`,`rotateWithOffset`,`float32`);l(i.rank===4,()=>`Error in rotateWithOffset: image must be rank 4,but got rank ${i.rank}.`);let a={image:i},o={radians:t,fillValue:n,center:r};return F.runKernel(Yn,a,o)}const Eh=L({rotateWithOffset_:Th});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Dh(e,t,n,r,i,a){r??=.5,i??=-1/0,a??=0;let o=e.shape[0];return n=Math.min(n,o),l(0<=r&&r<=1,()=>`iouThreshold must be in [0, 1], but was '${r}'`),l(e.rank===2,()=>`boxes must be a 2D tensor, but was of rank '${e.rank}'`),l(e.shape[1]===4,()=>`boxes must have 4 columns, but 2nd dimension was ${e.shape[1]}`),l(t.rank===1,()=>`scores must be a 1D tensor`),l(t.shape[0]===o,()=>`scores has incompatible shape with boxes. Expected ${o}, but was ${t.shape[0]}`),l(0<=a&&a<=1,()=>`softNmsSigma must be in [0, 1], but was '${a}'`),{maxOutputSize:n,iouThreshold:r,scoreThreshold:i,softNmsSigma:a}}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Oh(e,t,n,r=.5,i=-1/0){let a=I(e,`boxes`,`nonMaxSuppression`,`float32`),o=I(t,`scores`,`nonMaxSuppression`,`float32`),s=Dh(a,o,n,r,i);n=s.maxOutputSize,r=s.iouThreshold,i=s.scoreThreshold;let c={maxOutputSize:n,iouThreshold:r,scoreThreshold:i};return F.runKernel(qt,{boxes:a,scores:o},c)}const kh=L({nonMaxSuppression_:Oh});
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ah(e,t,n){let r=jh(e,t,n),i=r<0?-(r+1):r;e.splice(i,0,t)}function jh(e,t,n){return Nh(e,t,n||Mh)}function Mh(e,t){return e>t?1:e<t?-1:0}function Nh(e,t,n){let r=0,i=e.length,a=0,o=!1;for(;r<i;){a=r+(i-r>>>1);let s=n(t,e[a]);s>0?r=a+1:(i=a,o=!s)}return o?r:-r-1}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ph(e,t,n,r,i){return Lh(e,t,n,r,i,0)}function Fh(e,t,n,r,i,a){return Lh(e,t,n,r,i,0,!1,a,!0)}function Ih(e,t,n,r,i,a){return Lh(e,t,n,r,i,a,!0)}function Lh(e,t,n,r,i,a,o=!1,s=!1,c=!1){let l=[];for(let e=0;e<t.length;e++)t[e]>i&&l.push({score:t[e],boxIndex:e,suppressBeginIndex:0});l.sort(Bh);let u=a>0?-.5/a:0,d=[],f=[];for(;d.length<n&&l.length>0;){let t=l.pop(),{score:n,boxIndex:a,suppressBeginIndex:o}=t;if(n<i)break;let s=!1;for(let n=d.length-1;n>=o;--n){let o=Rh(e,a,d[n]);if(o>=r){s=!0;break}if(t.score*=zh(r,u,o),t.score<=i)break}t.suppressBeginIndex=d.length,s||(t.score===n?(d.push(a),f.push(t.score)):t.score>i&&Ah(l,t,Bh))}let p=d.length,m=n-p;s&&m>0&&(d.push(...Array(m).fill(0)),f.push(...Array(m).fill(0)));let h={selectedIndices:d};return o&&(h.selectedScores=f),c&&(h.validOutputs=p),h}function Rh(e,t,n){let r=e.subarray(t*4,t*4+4),i=e.subarray(n*4,n*4+4),a=Math.min(r[0],r[2]),o=Math.min(r[1],r[3]),s=Math.max(r[0],r[2]),c=Math.max(r[1],r[3]),l=Math.min(i[0],i[2]),u=Math.min(i[1],i[3]),d=Math.max(i[0],i[2]),f=Math.max(i[1],i[3]),p=(s-a)*(c-o),m=(d-l)*(f-u);if(p<=0||m<=0)return 0;let h=Math.max(a,l),g=Math.max(o,u),_=Math.min(s,d),v=Math.min(c,f),y=Math.max(_-h,0)*Math.max(v-g,0);return y/(p+m-y)}function zh(e,t,n){let r=Math.exp(t*n*n);return n<=e?r:0}function Bh(e,t){return e.score-t.score||e.score===t.score&&t.boxIndex-e.boxIndex}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
async function Vh(e,t,n,r=.5,i=-1/0){let a=I(e,`boxes`,`nonMaxSuppressionAsync`),o=I(t,`scores`,`nonMaxSuppressionAsync`),s=Dh(a,o,n,r,i);n=s.maxOutputSize,r=s.iouThreshold,i=s.scoreThreshold;let c=await Promise.all([a.data(),o.data()]),l=c[0],u=c[1],{selectedIndices:d}=Ph(l,u,n,r,i);return a!==e&&a.dispose(),o!==t&&o.dispose(),um(d,`int32`)}const Hh=Vh;
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Uh(e,t,n,r=.5,i=-1/0,a=0){let o=I(e,`boxes`,`nonMaxSuppression`),s=I(t,`scores`,`nonMaxSuppression`),c=Dh(o,s,n,r,i,a);n=c.maxOutputSize,r=c.iouThreshold,i=c.scoreThreshold,a=c.softNmsSigma;let l={boxes:o,scores:s},u={maxOutputSize:n,iouThreshold:r,scoreThreshold:i,softNmsSigma:a},d=F.runKernel(Yt,l,u);return{selectedIndices:d[0],selectedScores:d[1]}}const Wh=L({nonMaxSuppressionWithScore_:Uh});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
async function Gh(e,t,n,r=.5,i=-1/0,a=0){let o=I(e,`boxes`,`nonMaxSuppressionAsync`),s=I(t,`scores`,`nonMaxSuppressionAsync`),c=Dh(o,s,n,r,i,a);n=c.maxOutputSize,r=c.iouThreshold,i=c.scoreThreshold,a=c.softNmsSigma;let l=await Promise.all([o.data(),s.data()]),u=l[0],d=l[1],{selectedIndices:f,selectedScores:p}=Ih(u,d,n,r,i,a);return o!==e&&o.dispose(),s!==t&&s.dispose(),{selectedIndices:um(f,`int32`),selectedScores:um(p)}}const Kh=Gh;
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function qh(e,t,n,r=.5,i=-1/0,a=!1){let o=I(e,`boxes`,`nonMaxSuppression`),s=I(t,`scores`,`nonMaxSuppression`),c=Dh(o,s,n,r,i,null),l=c.maxOutputSize,u=c.iouThreshold,d=c.scoreThreshold,f={boxes:o,scores:s},p={maxOutputSize:l,iouThreshold:u,scoreThreshold:d,padToMaxOutputSize:a},m=F.runKernel(Jt,f,p);return{selectedIndices:m[0],validOutputs:m[1]}}const Jh=L({nonMaxSuppressionPadded_:qh});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
async function Yh(e,t,n,r=.5,i=-1/0,a=!1){let o=I(e,`boxes`,`nonMaxSuppressionAsync`),s=I(t,`scores`,`nonMaxSuppressionAsync`),c=Dh(o,s,n,r,i,null),l=c.maxOutputSize,u=c.iouThreshold,d=c.scoreThreshold,[f,p]=await Promise.all([o.data(),s.data()]),{selectedIndices:m,validOutputs:h}=Fh(f,p,l,u,d,a);return o!==e&&o.dispose(),s!==t&&s.dispose(),{selectedIndices:um(m,`int32`),validOutputs:U(h,`int32`)}}const Xh=Yh;
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Zh(e,t,n=!1,r=!1){let i=I(e,`images`,`resizeBilinear`);l(i.rank===3||i.rank===4,()=>`Error in resizeBilinear: x must be rank 3 or 4, but got rank ${i.rank}.`),l(t.length===2,()=>`Error in resizeBilinear: new shape must 2D, but got shape ${t}.`),l(r===!1||n===!1,()=>`Error in resizeBilinear: If halfPixelCenters is true, alignCorners must be false.`);let a=i,o=!1;i.rank===3&&(o=!0,a=V(i,[1,i.shape[0],i.shape[1],i.shape[2]]));let s={images:a},c={alignCorners:n,halfPixelCenters:r,size:t},u=F.runKernel(dn,s,c);return o?V(u,[u.shape[1],u.shape[2],u.shape[3]]):u}const Qh=L({resizeBilinear_:Zh});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function $h(e,t,n=!1,r=!1){let i=I(e,`images`,`resizeNearestNeighbor`);l(i.rank===3||i.rank===4,()=>`Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank ${i.rank}.`),l(t.length===2,()=>`Error in resizeNearestNeighbor: new shape must 2D, but got shape ${t}.`),l(i.dtype===`float32`||i.dtype===`int32`,()=>"`images` must have `int32` or `float32` as dtype"),l(r===!1||n===!1,()=>`Error in resizeNearestNeighbor: If halfPixelCenters is true, alignCorners must be false.`);let a=i,o=!1;i.rank===3&&(o=!0,a=V(i,[1,i.shape[0],i.shape[1],i.shape[2]]));let s={images:a},c={alignCorners:n,halfPixelCenters:r,size:t},u=F.runKernel(un,s,c);return o?V(u,[u.shape[1],u.shape[2],u.shape[3]]):u}const eg=L({resizeNearestNeighbor_:$h});
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* https://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function tg(e,t=`binary`,n=!1,r=.5){let i=I(e,`image`,`threshold`),a=i.shape[0]*i.shape[1],o=B(um([r]),255),s,c,u,d;if(l(i.rank===3,()=>`Error in threshold: image must be rank 3,but got rank ${i.rank}.`),l(i.shape[2]===3||i.shape[2]===1,()=>`Error in threshold: image color channel must be equal to 3 or 1but got ${i.shape[2]}.`),l(i.dtype===`int32`||i.dtype===`float32`,()=>`Error in dtype: image dtype must be int32 or float32,but got dtype ${i.dtype}.`),l(t===`otsu`||t===`binary`,()=>`Method must be binary or otsu, but was ${t}`),i.shape[2]===3){[s,c,u]=Yp(i,[1,1,1],-1);let e=B(s,.2989),t=B(c,.587),n=B(u,.114);d=os(os(e,t),n)}else d=e;return t===`otsu`&&(o=ng(Oc(Qa(_p(d),`int32`),Zi([]),256),a)),Qa(B(n?zu(d,o):Tu(d,o),255),`int32`)}function ng(e,t){let n=um([-1]),r=um([0]),i=um([0]),a,o,s,c,l,u;for(let d=0;d<e.size-1;d++){a=H(e,0,d+1),o=H(e,d+1),l=us(W(a),t),u=us(W(o),t),s=us(W(B(a,$f(0,a.size))),W(a));let f=Fc(o.shape,a.size),p=os($f(0,o.size),f);c=us(W(B(o,p)),W(o));let m=G(s,c),h=G(s,c);i=B(B(B(l,u),m),h);let g=Tu(i,r);r=Dl(g,i,r),n=Dl(g,um([d]),n)}return n}const rg=L({threshold_:tg});
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ig(e,t,n=`nearest`,r=`constant`,i=0,a){let o=I(e,`image`,`transform`,`float32`),s=I(t,`transforms`,`transform`,`float32`);l(o.rank===4,()=>`Error in transform: image must be rank 4,but got rank ${o.rank}.`),l(s.rank===2&&(s.shape[0]===o.shape[0]||s.shape[0]===1)&&s.shape[1]===8,()=>`Error in transform: Input transform should be batch x 8 or 1 x 8`),l(a==null||a.length===2,()=>`Error in transform: outputShape must be [height, width] or null, but got ${a}.`);let c={image:o,transforms:s},u={interpolation:n,fillMode:r,fillValue:i,outputShape:a};return F.runKernel(Hn,c,u)}const ag=L({transform_:ig});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function og(e,t,n){l(t%1==0,()=>`bandPart(): numLower must be an integer, got ${t}.`),l(n%1==0,()=>`bandPart(): numUpper must be an integer, got ${n}.`);let r=I(e,`a`,`bandPart`);l(r.rank>=2,()=>`bandPart(): Rank must be at least 2, got ${r.rank}.`);let i=r.shape,[a,o]=r.shape.slice(-2);if(!(t<=a))throw Error(`bandPart(): numLower (${t}) must not be greater than the number of rows (${a}).`);if(!(n<=o))throw Error(`bandPart(): numUpper (${n}) must not be greater than the number of columns (${o}).`);t<0&&(t=a),n<0&&(n=o);let s=G(V($f(0,a,1,`int32`),[-1,1]),$f(0,o,1,`int32`)),c=id(zu(s,U(+t,`int32`)),Du(s,U(-n,`int32`))),u=Td([a,o],r.dtype);return V(rm(wm(V(r,[-1,a,o])).map(e=>Dl(c,e,u))),i)}const sg=L({bandPart_:og});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function cg(e){let t;if(Array.isArray(e)){t=!1,l(e!=null&&e.length>0,()=>`Gram-Schmidt process: input must not be null, undefined, or empty`);let n=e[0].shape[0];for(let t=1;t<e.length;++t)l(e[t].shape[0]===n,()=>`Gram-Schmidt: Non-unique lengths found in the input vectors: (${e[t].shape[0]} vs. ${n})`)}else t=!0,e=Yp(e,e.shape[0],0).map(e=>tm(e,[0]));l(e.length<=e[0].shape[0],()=>`Gram-Schmidt: Number of vectors (${e.length}) exceeds number of dimensions (${e[0].shape[0]}).`);let n=[],r=e;for(let t=0;t<e.length;++t)n.push(F.tidy(()=>{let e=r[t];if(t>0)for(let r=0;r<t;++r){let t=B(W(B(n[r],e)),n[r]);e=G(e,t)}return us(e,su(e,`euclidean`))}));return t?rm(n,0):n}const lg=L({gramSchmidt_:cg});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ug(e,t=!1){if(l(e.rank>=2,()=>`qr() requires input tensor to have a rank >= 2, but got rank ${e.rank}`),e.rank===2)return dg(e,t);{let n=wm(V(e,[e.shape.slice(0,e.shape.length-2).reduce((e,t)=>e*t),e.shape[e.shape.length-2],e.shape[e.shape.length-1]]),0),r=[],i=[];return n.forEach(e=>{let[n,a]=dg(e,t);r.push(n),i.push(a)}),[V(rm(r,0),e.shape),V(rm(i,0),e.shape)]}}function dg(e,t=!1){return F.tidy(()=>{l(e.shape.length===2,()=>`qr2d() requires a 2D Tensor, but got a ${e.shape.length}D Tensor.`);let n=e.shape[0],r=e.shape[1],i=yu(n),a=eo(e),o=dm([[1]],[1,1]),s=eo(o),c=n>=r?r:n;for(let e=0;e<c;++e){let t=a,c=s,l=i;[s,a,i]=F.tidy(()=>{let t=H(a,[e,e],[n-e,1]),c=su(t),l=H(a,[e,e],[1,1]),u=Dl(Tu(l,0),dm([[-1]]),dm([[1]])),d=G(l,B(u,c)),f=us(t,d);s=f.shape[0]===1?eo(o):cc([o,H(f,[1,0],[f.shape[0]-1,f.shape[1]])],0);let p=Ro(us(z(u,d),c)),m=H(a,[e,0],[n-e,r]),h=B(p,s),g=Ho(s);if(e===0)a=G(m,z(h,z(g,m)));else{let t=G(m,z(h,z(g,m)));a=cc([H(a,[0,0],[e,r]),t],0)}let _=Ho(h),v=H(i,[0,e],[n,i.shape[1]-e]);if(e===0)i=G(v,z(z(v,s),_));else{let t=G(v,z(z(v,s),_));i=cc([H(i,[0,0],[n,e]),t],1)}return[s,a,i]}),jo([t,c,l])}return!t&&n>r&&(i=H(i,[0,0],[n,r]),a=H(a,[0,0],[r,r])),[i,a]})}const fg=L({qr_:ug});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var pg;(function(e){e[e.NONE=0]=`NONE`,e[e.MEAN=1]=`MEAN`,e[e.SUM=2]=`SUM`,e[e.SUM_BY_NONZERO_WEIGHTS=3]=`SUM_BY_NONZERO_WEIGHTS`})(pg||={});function mg(e,t,n=pg.SUM_BY_NONZERO_WEIGHTS){let r=I(e,`losses`,`computeWeightedLoss`),i=null;t!=null&&(i=I(t,`weights`,`computeWeightedLoss`));let a=i==null?r:B(r,i);if(n===pg.NONE)return a;if(n===pg.SUM)return W(a);if(n===pg.MEAN){if(i==null)return wd(a);{let e=r.size/i.size,t=us(W(a),W(i));return e>1?us(t,U(e)):t}}if(n===pg.SUM_BY_NONZERO_WEIGHTS){if(i==null)return us(W(a),U(r.size));{let e=Qa(W(Vd(B(i,Ed(r.shape)),U(0))),`float32`);return us(W(a),e)}}throw Error(`Unknown reduction: ${n}`)}const hg=L({computeWeightedLoss_:mg});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function gg(e,t,n,r=pg.SUM_BY_NONZERO_WEIGHTS){let i=I(e,`labels`,`absoluteDifference`),a=I(t,`predictions`,`absoluteDifference`),o=null;return n!=null&&(o=I(n,`weights`,`absoluteDifference`)),u(i.shape,a.shape,`Error in absoluteDifference: `),hg(ps(G(i,a)),o,r)}const _g=L({absoluteDifference_:gg});function vg(e,t,n,r,i=pg.SUM_BY_NONZERO_WEIGHTS){let a=I(e,`labels`,`cosineDistance`),o=I(t,`predictions`,`cosineDistance`),s=null;return r!=null&&(s=I(r,`weights`,`cosineDistance`)),u(a.shape,o.shape,`Error in cosineDistance: `),hg(G(U(1),W(B(a,o),n,!0)),s,i)}const yg=L({cosineDistance_:vg});function bg(e,t,n,r=pg.SUM_BY_NONZERO_WEIGHTS){let i=I(e,`labels`,`hingeLoss`),a=I(t,`predictions`,`hingeLoss`),o=null;n!=null&&(o=I(n,`weights`,`hingeLoss`)),u(i.shape,a.shape,`Error in hingeLoss: `);let s=U(1);return i=G(B(U(2),i),s),hg(rp(G(s,B(i,a))),o,r)}const xg=L({hingeLoss_:bg});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Sg(e,t,n,r=1,i=pg.SUM_BY_NONZERO_WEIGHTS){let a=I(e,`labels`,`huberLoss`),o=I(t,`predictions`,`huberLoss`),s=null;n!=null&&(s=I(n,`weights`,`huberLoss`)),u(a.shape,o.shape,`Error in huberLoss: `);let c=U(r),l=ps(G(o,a)),d=kd(l,c),f=G(l,d);return hg(os(B(U(.5),ru(d)),B(c,f)),s,i)}const Cg=L({huberLoss_:Sg});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function wg(e,t,n,r=1e-7,i=pg.SUM_BY_NONZERO_WEIGHTS){let a=I(e,`labels`,`logLoss`),o=I(t,`predictions`,`logLoss`),s=null;n!=null&&(s=I(n,`weights`,`logLoss`)),u(a.shape,o.shape,`Error in logLoss: `);let c=U(1),l=U(r);return hg(G(Ro(B(a,Wu(os(o,l)))),B(G(c,a),Wu(os(G(c,o),l)))),s,i)}const Tg=L({logLoss_:wg});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Eg(e,t,n,r=pg.SUM_BY_NONZERO_WEIGHTS){let i=I(e,`labels`,`meanSquaredError`),a=I(t,`predictions`,`meanSquaredError`),o=null;return n!=null&&(o=I(n,`weights`,`meanSquaredError`)),u(i.shape,a.shape,`Error in meanSquaredError: `),hg($p(i,a),o,r)}const Dg=L({meanSquaredError_:Eg});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Og(e,t){let n=I(e,`labels`,`sigmoidCrossEntropyWithLogits`),r=I(t,`logits`,`sigmoidCrossEntropyWithLogits`);u(n.shape,r.shape,`Error in sigmoidCrossEntropyWithLogits: `);let i=rp(r),a=B(r,n),o=Ku(du(Ro(ps(r))));return os(G(i,a),o)}function kg(e,t,n,r=0,i=pg.SUM_BY_NONZERO_WEIGHTS){let a=I(e,`multiClassLabels`,`sigmoidCrossEntropy`),o=I(t,`logits`,`sigmoidCrossEntropy`),s=null;if(n!=null&&(s=I(n,`weights`,`sigmoidCrossEntropy`)),u(a.shape,o.shape,`Error in sigmoidCrossEntropy: `),r>0){let e=U(r),t=U(1),n=U(.5);a=os(B(a,G(t,e)),B(n,e))}return hg(Og(a,o),s,i)}const Ag=L({sigmoidCrossEntropy_:kg});
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function jg(e,t,n=-1){if(n===-1&&(n=t.rank-1),n!==t.rank-1)throw Error(`Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank ${t.rank} and dim was ${n}`);return qu((e,t,r)=>{let i=nd(t,[n],!0),a=G(Qa(t,`float32`),i);return r([e,a]),{value:W(Ro(B(a,e)),[n]),gradFunc:(e,t)=>{let[r,i]=t,a=Ul(e.shape,[n]);return[B(V(e,a),G(Qa(r,`float32`),du(i))),B(V(e,a),G(du(i),Qa(r,`float32`)))]}}})(e,t)}function Mg(e,t,n,r=0,i=pg.SUM_BY_NONZERO_WEIGHTS){let a=I(e,`onehotLabels`,`softmaxCrossEntropy`),o=I(t,`logits`,`softmaxCrossEntropy`),s=null;if(n!=null&&(s=I(n,`weights`,`softmaxCrossEntropy`)),u(a.shape,o.shape,`Error in softmaxCrossEntropy: `),r>0){let e=U(r),t=U(1),n=U(a.shape[1]);a=os(B(a,G(t,e)),us(e,n))}return hg(jg(a,o),s,i)}const Ng=L({softmaxCrossEntropy_:Mg});
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Pg(e,t,n,r){let i=I(e,`indices`,`sparseFillEmptyRows`,`int32`),a=I(t,`values`,`sparseFillEmptyRows`),o=I(n,`denseShape`,`sparseFillEmptyRows`,`int32`),s=I(r,`defaultValue`,`sparseFillEmptyRows`,a.dtype);if(i.rank!==2)throw Error(`Indices should be Tensor2D but received shape
        ${i.shape}`);if(a.rank!==1)throw Error(`Values should be Tensor1D but received shape ${a.shape}`);if(o.rank!==1)throw Error(`Dense shape should be Tensor1D but received shape ${o.shape}`);if(s.rank!==0)throw Error(`Default value should be a scalar but received shape ${s.shape}`);let c={indices:i,values:a,denseShape:o,defaultValue:s},l=F.runKernel(kn,c);return{outputIndices:l[0],outputValues:l[1],emptyRowIndicator:l[2],reverseIndexMap:l[3]}}const Fg=L({sparseFillEmptyRows_:Pg});
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ig(e,t,n){let r=I(e,`inputIndices`,`sparseReshape`,`int32`),i=I(t,`inputShape`,`sparseReshape`,`int32`),a=I(n,`newShape`,`sparseReshape`,`int32`);if(r.rank!==2)throw Error(`Input indices should be Tensor2D but received shape
        ${r.shape}`);if(i.rank!==1)throw Error(`Input shape should be Tensor1D but received shape ${i.shape}`);if(a.rank!==1)throw Error(`New shape should be Tensor1D but received shape ${a.shape}`);let o={inputIndices:r,inputShape:i,newShape:a},s=F.runKernel(An,o);return{outputIndices:s[0],outputShape:s[1]}}const Lg=L({sparseReshape_:Ig});
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Rg(e,t,n){let r=I(e,`data`,`sparseSegmentMean`),i=I(t,`indices`,`sparseSegmentMean`,`int32`),a=I(n,`segmentIds`,`sparseSegmentMean`,`int32`);if(r.rank<1)throw Error(`Data should be at least 1 dimensional but received scalar`);if(i.rank!==1)throw Error(`Indices should be Tensor1D but received shape
          ${i.shape}`);if(a.rank!==1)throw Error(`Segment ids should be Tensor1D but received shape
          ${a.shape}`);let o={data:r,indices:i,segmentIds:a};return F.runKernel(jn,o)}const zg=L({sparseSegmentMean_:Rg});
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Bg(e,t,n){let r=I(e,`data`,`sparseSegmentSum`),i=I(t,`indices`,`sparseSegmentSum`,`int32`),a=I(n,`segmentIds`,`sparseSegmentSum`,`int32`);if(r.rank<1)throw Error(`Data should be at least 1 dimensional but received scalar`);if(i.rank!==1)throw Error(`Indices should be Tensor1D but received shape
         ${i.shape}`);if(a.rank!==1)throw Error(`Segment ids should be Tensor1D but received shape
         ${a.shape}`);let o={data:r,indices:i,segmentIds:a};return F.runKernel(Mn,o)}const Vg=L({sparseSegmentSum_:Bg});
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Hg(e,t,n,r,i,a,o,s){let c=I(e,`data`,`stringNGrams`,`string`);if(c.dtype!==`string`)throw Error(`Data must be of datatype string`);if(c.shape.length!==1)throw Error(`Data must be a vector, saw: ${c.shape}`);let l=I(t,`dataSplits`,`stringNGrams`);if(l.dtype!==`int32`)throw Error(`Data splits must be of datatype int32`);let u={separator:n,nGramWidths:r,leftPad:i,rightPad:a,padWidth:o,preserveShortSequences:s},d={data:c,dataSplits:l},f=F.runKernel(In,d,u);return{nGrams:f[0],nGramsSplits:f[1]}}const Ug=L({stringNGrams_:Hg});
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Wg(e,t,n=!0){let r=I(e,`input`,`stringSplit`,`string`),i=I(t,`delimiter`,`stringSplit`,`string`);if(r.rank!==1)throw Error(`Input should be Tensor1D but received shape ${r.shape}`);if(i.rank!==0)throw Error(`Delimiter should be a scalar but received shape ${i.shape}`);let a={skipEmpty:n},o={input:r,delimiter:i},s=F.runKernel(Ln,o,a);return{indices:s[0],values:s[1],shape:s[2]}}const Gg=L({stringSplit_:Wg});
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Kg(e,t){let n=I(e,`input`,`stringToHashBucketFast`,`string`),r={numBuckets:t};if(t<=0)throw Error(`Number of buckets must be at least 1`);let i={input:n};return F.runKernel(Rn,i,r)}const qg=L({stringToHashBucketFast_:Kg}),Jg={fft:Up,ifft:Gp,rfft:Zp,irfft:qp},Yg={hammingWindow:fh,hannWindow:mh,frame:gh,stft:vh},Xg={flipLeftRight:Sh,grayscaleToRGB:wh,resizeNearestNeighbor:eg,resizeBilinear:Qh,rotateWithOffset:Eh,cropAndResize:bh,nonMaxSuppression:kh,nonMaxSuppressionAsync:Hh,nonMaxSuppressionWithScore:Wh,nonMaxSuppressionWithScoreAsync:Kh,nonMaxSuppressionPadded:Jh,nonMaxSuppressionPaddedAsync:Xh,threshold:rg,transform:ag},Zg={bandPart:sg,gramSchmidt:lg,qr:fg},Qg={absoluteDifference:_g,computeWeightedLoss:hg,cosineDistance:yg,hingeLoss:xg,huberLoss:Cg,logLoss:Tg,meanSquaredError:Dg,sigmoidCrossEntropy:Ag,softmaxCrossEntropy:Ng},$g={sparseFillEmptyRows:Fg,sparseReshape:Lg,sparseSegmentMean:zg,sparseSegmentSum:Vg},e_={stringNGrams:Ug,stringSplit:Gg,stringToHashBucketFast:qg};
/**
* @license
* Copyright 2017 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function t_(e,t){let n=e[0].length;e.forEach((e,t)=>{l(e.length===n,()=>`Error in concat${n}D: rank of tensors[${t}] must be the same as the rank of the rest (${n})`)}),l(t>=0&&t<n,()=>`Error in concat${n}D: axis must be between 0 and ${n-1}.`);let r=e[0];e.forEach((e,i)=>{for(let a=0;a<n;a++)l(a===t||e[a]===r[a],()=>`Error in concat${n}D: Shape of tensors[${i}] (${e}) does not match the shape of the rest (${r}) along the non-concatenated axis ${i}.`)})}function n_(e,t){let n=e[0].slice();for(let r=1;r<e.length;r++)n[t]+=e[r][t];return n}
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var r_;(function(e){e[e.FIRST_DIM_SIZE=0]=`FIRST_DIM_SIZE`,e[e.VALUE_ROWIDS=1]=`VALUE_ROWIDS`,e[e.ROW_LENGTHS=2]=`ROW_LENGTHS`,e[e.ROW_SPLITS=3]=`ROW_SPLITS`,e[e.ROW_LIMITS=4]=`ROW_LIMITS`,e[e.ROW_STARTS=5]=`ROW_STARTS`})(r_||={});function i_(e,t,n){let r=[];if(n==null&&t==null)return r;if(t==null)for(;r.length<e+n.length;)r.push(-1);else r=t.slice();if(n==null)return r;if(e+n.length!==r.length)throw Error(`rt input.shape and shape=${t} are incompatible: rt input.rank = ${e+n.length}, but shape.rank = ${r.length}`);for(let i=1;i<n.length;++i){let a=n[i],o=r[r.length-n.length+i],s=r[o];if(a>=0)if(s>=0){if(s!==a)throw Error(`rt input.shape and shape=${t} are incompatible: rt input.shape[${i+e}] = ${a} but shape[${i+e}] = ${s}`)}else r[o]=a}return r}function a_(e){let t={FIRST_DIM_SIZE:r_.FIRST_DIM_SIZE,VALUE_ROWIDS:r_.VALUE_ROWIDS,ROW_LENGTHS:r_.ROW_LENGTHS,ROW_SPLITS:r_.ROW_SPLITS,ROW_LIMITS:r_.ROW_LIMITS,ROW_STARTS:r_.ROW_STARTS},n=[];for(let r of e)if(r in t)n.push(t[r]);else break;return n}function o_(e){return e.length===0?0:e[0]===r_.FIRST_DIM_SIZE?e.length-1:e.length}function s_(e,t){if(e==null||t==null)return;let n=e.length,r=t.length;if(n>=r)throw Error(`defaultValue.shape=${e} and ragged tensor flatValues.shape=${t}, are incompatible: defaultValue.rank = ${n} must be less than ragged tensor input flatValues.rank = ${r})`);for(let i=0;i<Math.min(n,r-1);++i){let n=e[i],r=t[i+1];if(n>=0&&r>=0&&n!==1&&n!==r)throw Error(`defaultValue.shape=${e}, and ragged tensor input flatValues.shape=${t} are incompatible: defaultValue.shape[${i-e.length}] = ${n} but ragged tensor input.flatValues.shape[${i-e.length}] = ${r}`)}}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function c_(e,t,n){return[n*(typeof e==`number`?e:e[0]),t*(typeof e==`number`?e:e[1])]}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function l_(e,t,n,r=!0){let i=[];if(r)i=i.concat(t.slice(0)),i.push(e[0]/n),i=i.concat(e.slice(1));else{i=i.concat(e[0]);let n=t.length;for(let r=0;r<n;++r)i=i.concat([e[r+1]/t[r],t[r]]);i=i.concat(e.slice(n+1))}return i}function u_(e,t,n=!0){let r=[];if(n){r.push(t);for(let n=t+1;n<e;++n)n<=2*t?(r.push(n),r.push(n-(t+1))):r.push(n)}else{let n=[],i=[];for(let r=1;r<e;++r)r>=t*2+1||r%2==1?i.push(r):n.push(r);r.push(...n),r.push(0),r.push(...i)}return r}function d_(e,t,n,r=!0){let i=[];r?i.push(e[0]/n):i.push(e[0]*n);for(let n=1;n<e.length;++n)n<=t.length?r?i.push(t[n-1]*e[n]):i.push(e[n]/t[n-1]):i.push(e[n]);return i}function f_(e,t){let n=[0];for(let r=0;r<t;++r)n.push(e[r][0]);return n}function p_(e,t,n){let r=e.slice(0,1);for(let i=0;i<n;++i)r.push(e[i+1]-t[i][0]-t[i][1]);return r}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function m_(e,t){if(e.length!==t.length)throw Error(`Cannot merge real and imag arrays of different lengths. real:${e.length}, imag: ${t.length}.`);let n=new Float32Array(e.length*2);for(let r=0;r<n.length;r+=2)n[r]=e[r/2],n[r+1]=t[r/2];return n}function h_(e){let t=new Float32Array(e.length/2),n=new Float32Array(e.length/2);for(let r=0;r<e.length;r+=2)t[r/2]=e[r],n[r/2]=e[r+1];return{real:t,imag:n}}function g_(e){let t=Math.ceil(e.length/4),n=new Float32Array(t),r=new Float32Array(t);for(let t=0;t<e.length;t+=4)n[Math.floor(t/4)]=e[t],r[Math.floor(t/4)]=e[t+1];return{real:n,imag:r}}function __(e){let t=Math.floor(e.length/4),n=new Float32Array(t),r=new Float32Array(t);for(let t=2;t<e.length;t+=4)n[Math.floor(t/4)]=e[t],r[Math.floor(t/4)]=e[t+1];return{real:n,imag:r}}function v_(e,t){return{real:e[t*2],imag:e[t*2+1]}}function y_(e,t,n,r){e[r*2]=t,e[r*2+1]=n}function b_(e,t){let n=new Float32Array(e/2),r=new Float32Array(e/2);for(let i=0;i<Math.ceil(e/2);i++){let a=(t?2:-2)*Math.PI*(i/e);n[i]=Math.cos(a),r[i]=Math.sin(a)}return{real:n,imag:r}}function x_(e,t,n){let r=(n?2:-2)*Math.PI*(e/t);return{real:Math.cos(r),imag:Math.sin(r)}}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const S_=/->/g;function C_(e,t){e=e.replace(/\s/g,``);let n=(e.length-e.replace(S_,``).length)/2;if(n<1)throw Error(`Equations without an arrow are not supported.`);if(n>1)throw Error(`Equation must contain exactly one arrow ("->").`);let[r,i]=e.split(`->`);l(r.indexOf(`...`)===-1,()=>`The ellipsis notation ("...") is not supported yet.`);let a=r.split(`,`),o=a.length;if(t!==o)throw Error(`Expected ${o} input tensors, received ${t}`);if(o>2)throw Error(`Support for more than 2 input tensors is not implemented yet.`);let s=[];for(let e=0;e<i.length;++e){let t=i[e];if(!a.some(e=>e.indexOf(t)!==-1))throw Error(`Output subscripts contain the label ${t} not present in the input subscripts.`);s.indexOf(t)===-1&&s.push(t)}for(let e=0;e<r.length;++e){let t=r[e];s.indexOf(t)===-1&&t!==`,`&&s.push(t)}let c=Array(a.length);for(let e=0;e<o;++e){if(new Set(a[e].split(``)).size!==a[e].length)throw Error(`Found duplicate axes in input component ${a[e]}. Support for duplicate axes in input is not implemented yet.`);c[e]=[];for(let t=0;t<a[e].length;++t)c[e].push(s.indexOf(a[e][t]))}let u=s.length,d=i.length,f=[];for(let e=d;e<u;++e)f.push(e);return{allDims:s,summedDims:f,idDims:c}}function w_(e,t){let n=Array(e);n.fill(-1);for(let e=0;e<t.length;++e)n[t[e]]=e;let r=[];for(let t=0;t<e;++t)n[t]===-1&&r.push(t);return n=n.filter(e=>e!==-1),{permutationIndices:n,expandDims:r}}function T_(e,t,n){let r=Array(e);for(let e=0;e<n.length;++e){let i=n[e].shape;for(let n=0;n<t[e].length;++n)r[t[e][n]]===void 0?r[t[e][n]]=i[n]:l(r[t[e][n]]===i[n],()=>`Expected dimension ${r[t[e][n]]} at axis ${n} of input shaped ${JSON.stringify(i)}, but got dimension ${i[n]}`)}}function E_(e,t){let n=e,r=[],i=0;e.length===0&&n.push(-1),i=e.length+1;for(let e=0;e<i;++e)r.push([]);let a=[];for(let e=0;e<n.length;++e){let i=n[e],o=O_(t,i);for(let t of o)a.indexOf(t)===-1&&(r[e].push(t),a.push(t))}return{path:n,steps:r}}function D_(e){return e.every((e,t)=>e===t)}function O_(e,t){let n=[];for(let r=0;r<e.length;++r)(e[r].length===0||e[r].indexOf(t)!==-1||t===-1)&&n.push(r);return n}function k_(e,t,n=0){let r=[];if(typeof t==`number`)l(e.shape[n]%t===0,()=>`Number of splits must evenly divide the axis.`),r=Array(t).fill(e.shape[n]/t);else{l(t.reduce((e,t)=>(t===-1&&(e+=1),e),0)<=1,()=>`There should be only one negative value in split array.`);let i=t.indexOf(-1);if(i!==-1){let r=t.reduce((e,t)=>t>0?e+t:e);t[i]=e.shape[n]-r}l(e.shape[n]===t.reduce((e,t)=>e+t),()=>`The sum of sizes must match the size of the axis dimension.`),r=t}return r}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function A_(e){return`Received SparseTensor with denseShape[0] = 0 but
  indices.shape[0] = ${e}`}function j_(e,t){return`indices(${e}, 0) is invalid: ${t} < 0`}function M_(e,t,n){return`indices(${e}, 0) is invalid: ${t} >= ${n}`}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function N_(e,t){return`only one output dimension may be -1, not both ${e} and ${t}`}function P_(e,t){return`size ${e} must be non-negative, not ${t}`}function F_(){return`reshape cannot infer the missing input size for an empty tensor unless all specified input sizes are non-zero`}function I_(e,t){return`Input to reshape is a SparseTensor with ${p(e)}
  dense values, but the requested shape requires a multiple of ${p(t)}. inputShape=${e} outputShape= ${t}`}function L_(e,t){return`Input to reshape is a tensor with ${p(e)} dense values, but the requested shape has ${p(t)}. inputShape=${e} outputShape=${t}`}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function R_(){return`segment ids must be >= 0`}function z_(){return`segment ids are not increasing`}function B_(e,t){return`Segment id ${e} out of range [0, ${t}), possibly because segmentIds input is not sorted.`}function V_(e,t,n){return`Bad: indices[${e}] == ${t} out of range [0, ${n})`}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function H_(e,t,n,r){let i=t.shape.length,a=e.shape.length;if(r!==0&&(r<-i||r>i))throw Error(`Expect batchDims in the range of [-${i}, ${i}], but got ${r}`);if(r<0&&(r+=i),r>a)throw Error(`batchDims (${r}) must be less than rank(x) (
    ${a}).`);if(n<r)throw Error(`batchDims (${r}) must be less than or equal to axis (${n}).`);for(let n=0;n<r;++n)if(e.shape[n]!==t.shape[n])throw Error(`x.shape[${n}]: ${e.shape[n]} should be equal to indices.shape[${n}]: ${t.shape[n]}.`);let o=e.shape[n],s=[],c=1,l=1,u=1;for(let t=0;t<r;++t)s.push(e.shape[t]),c*=e.shape[t];for(let t=r;t<n;t++)s.push(e.shape[t]),l*=e.shape[t];for(let e=r;e<i;e++)s.push(t.shape[e]);for(let t=n+1;t<a;t++)s.push(e.shape[t]),u*=e.shape[t];return{batchSize:c,sliceSize:u,outerSize:l,dimSize:o,outputShape:s}}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function U_(e){try{return e.map(e=>ri(e))}catch(e){throw Error(`Failed to decode encoded string bytes into utf-8, error: ${e}`)}}function W_(e){return e.map(e=>ni(e))}j().registerFlag(`KEEP_INTERMEDIATE_TENSORS`,()=>!1,e=>{e&&console.warn(`Keep intermediate tensors is ON. This will print the values of all intermediate tensors during model inference. Not all models support this mode. For details, check e2e/benchmarks/ model_config.js. This significantly impacts performance.`)});
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* =============================================================================
*/
var G_;(function(e){e[e.DT_INVALID=0]=`DT_INVALID`,e[e.DT_FLOAT=1]=`DT_FLOAT`,e[e.DT_DOUBLE=2]=`DT_DOUBLE`,e[e.DT_INT32=3]=`DT_INT32`,e[e.DT_UINT8=4]=`DT_UINT8`,e[e.DT_INT16=5]=`DT_INT16`,e[e.DT_INT8=6]=`DT_INT8`,e[e.DT_STRING=7]=`DT_STRING`,e[e.DT_COMPLEX64=8]=`DT_COMPLEX64`,e[e.DT_INT64=9]=`DT_INT64`,e[e.DT_BOOL=10]=`DT_BOOL`,e[e.DT_QINT8=11]=`DT_QINT8`,e[e.DT_QUINT8=12]=`DT_QUINT8`,e[e.DT_QINT32=13]=`DT_QINT32`,e[e.DT_BFLOAT16=14]=`DT_BFLOAT16`,e[e.DT_QINT16=15]=`DT_QINT16`,e[e.DT_QUINT16=16]=`DT_QUINT16`,e[e.DT_UINT16=17]=`DT_UINT16`,e[e.DT_COMPLEX128=18]=`DT_COMPLEX128`,e[e.DT_HALF=19]=`DT_HALF`,e[e.DT_RESOURCE=20]=`DT_RESOURCE`,e[e.DT_VARIANT=21]=`DT_VARIANT`,e[e.DT_UINT32=22]=`DT_UINT32`,e[e.DT_UINT64=23]=`DT_UINT64`,e[e.DT_FLOAT_REF=101]=`DT_FLOAT_REF`,e[e.DT_DOUBLE_REF=102]=`DT_DOUBLE_REF`,e[e.DT_INT32_REF=103]=`DT_INT32_REF`,e[e.DT_UINT8_REF=104]=`DT_UINT8_REF`,e[e.DT_INT16_REF=105]=`DT_INT16_REF`,e[e.DT_INT8_REF=106]=`DT_INT8_REF`,e[e.DT_STRING_REF=107]=`DT_STRING_REF`,e[e.DT_COMPLEX64_REF=108]=`DT_COMPLEX64_REF`,e[e.DT_INT64_REF=109]=`DT_INT64_REF`,e[e.DT_BOOL_REF=110]=`DT_BOOL_REF`,e[e.DT_QINT8_REF=111]=`DT_QINT8_REF`,e[e.DT_QUINT8_REF=112]=`DT_QUINT8_REF`,e[e.DT_QINT32_REF=113]=`DT_QINT32_REF`,e[e.DT_BFLOAT16_REF=114]=`DT_BFLOAT16_REF`,e[e.DT_QINT16_REF=115]=`DT_QINT16_REF`,e[e.DT_QUINT16_REF=116]=`DT_QUINT16_REF`,e[e.DT_UINT16_REF=117]=`DT_UINT16_REF`,e[e.DT_COMPLEX128_REF=118]=`DT_COMPLEX128_REF`,e[e.DT_HALF_REF=119]=`DT_HALF_REF`,e[e.DT_RESOURCE_REF=120]=`DT_RESOURCE_REF`,e[e.DT_VARIANT_REF=121]=`DT_VARIANT_REF`,e[e.DT_UINT32_REF=122]=`DT_UINT32_REF`,e[e.DT_UINT64_REF=123]=`DT_UINT64_REF`})(G_||={});var K_;(function(e){(function(e){e[e.LEGACY=0]=`LEGACY`,e[e.V1=1]=`V1`,e[e.V2=2]=`V2`})(e.CheckpointFormatVersion||={})})(K_||={});
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const q_={};function J_(e){return q_[e]}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function K(e,t,n,r,i){let a=t.inputParams[e];if(a&&a.inputIndexStart!==void 0){let e=a.inputIndexStart,o=a.inputIndexEnd===0?void 0:a.inputIndexEnd===void 0?e+1:a.inputIndexEnd;if(a.type===`tensor`)return Y_(t.inputNames[a.inputIndexStart],n,r,i);if(a.type===`tensors`)return t.inputNames.slice(e,o).map(e=>Y_(e,n,r,i));let s=Y_(t.inputNames.slice(e)[0],n,r,i),c=s.dataSync();return a.type===`number`?c[0]:ae(s.shape,c)}let o=t.attrParams[e];return o&&o.value}function Y_(e,t,n,r){let[i,a]=$_(e);if(r!=null){let e=r.getHashTableHandleByName(i);if(e!=null)return e}let o=n.currentContextIds.find(e=>!!t[Q_(i,e)]);return o===void 0?void 0:t[Q_(i,o)][a]}function X_(e,t,n){return t[Q_(e,n.currentContextId)]}function Z_(e,t){let[n,r,i]=$_(e);return[Q_(n,t&&t.currentContextId),r,i]}function Q_(e,t){return t?`${e}-${t}`:e}function $_(e){let t=e.split(`:`);if(t.length===1)return[e,0,void 0];let n=t[0],r=t.length===3?t[1]:void 0;return[n,Number(t[t.length-1]),r]}function ev(e,t,n){let r=K(`pad`,e,t,n);if(r===`explicit`){r=K(`explicitPaddings`,e,t,n);let i=[[0,0],[0,0],[0,0],[0,0]];for(let e=0;e<4;e++)i[e][0]=r[e*2],i[e][1]=r[e*2+1];return i}return r}function tv(e){return e.kept?e:eo(e)}var nv=Object.freeze({__proto__:null,json:[{tfOpName:`Add`,category:`arithmetic`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`AddV2`,category:`arithmetic`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`AddN`,category:`arithmetic`,inputs:[{start:0,end:0,name:`tensors`,type:`tensors`}]},{tfOpName:`BiasAdd`,category:`arithmetic`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0},{tfName:`data_format`,name:`dataFormat`,type:`string`,notSupported:!0}]},{tfOpName:`Sub`,category:`arithmetic`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`RealDiv`,category:`arithmetic`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Div`,category:`arithmetic`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`DivNoNan`,category:`arithmetic`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`FloorDiv`,category:`arithmetic`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Mul`,category:`arithmetic`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Maximum`,category:`arithmetic`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Minimum`,category:`arithmetic`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Pow`,category:`arithmetic`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`SquaredDifference`,category:`arithmetic`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Mod`,category:`arithmetic`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`FloorMod`,category:`arithmetic`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]}]}),rv=Object.freeze({__proto__:null,json:[{tfOpName:`Abs`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Acos`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Asin`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Atan`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Atan2`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`y`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Ceil`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`ClipByValue`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`clipValueMin`,type:`number`},{start:2,name:`clipValueMax`,type:`number`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Complex`,category:`basic_math`,inputs:[{start:0,name:`real`,type:`tensor`},{start:1,name:`imag`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`ComplexAbs`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Cos`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Cosh`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Elu`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Exp`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Floor`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Log`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Imag`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0},{tfName:`Tout`,name:`outputType`,type:`dtype`,notSupported:!0}]},{tfOpName:`Neg`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Real`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0},{tfName:`Tout`,name:`outputType`,type:`dtype`,notSupported:!0}]},{tfOpName:`Prelu`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`alpha`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Relu`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Relu6`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Selu`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Sigmoid`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Sin`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Sinh`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Sqrt`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Rsqrt`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Square`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Tan`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Tanh`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Sign`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Round`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Expm1`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Log1p`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Reciprocal`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Softplus`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Asinh`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Acosh`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Atanh`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Erf`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Prod`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`axes`,type:`number[]`}],attrs:[{tfName:`keep_dims`,name:`keepDims`,type:`bool`,notSupported:!0},{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`LeakyRelu`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`alpha`,name:`alpha`,type:`number`,defaultValue:.2},{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`IsNan`,category:`basic_math`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]}]}),iv=Object.freeze({__proto__:null,json:[{tfOpName:`EmptyTensorList`,category:`control`,inputs:[{start:0,name:`elementShape`,type:`shape`},{start:1,name:`maxNumElements`,type:`number`}],attrs:[{tfName:`element_dtype`,name:`elementDType`,type:`dtype`}]},{tfOpName:`LoopCond`,category:`control`,inputs:[{start:0,name:`pred`,type:`tensor`}]},{tfOpName:`Switch`,category:`control`,inputs:[{start:0,name:`data`,type:`tensor`},{start:1,name:`pred`,type:`tensor`}]},{tfOpName:`Merge`,category:`control`,inputs:[{start:0,end:0,name:`tensors`,type:`tensors`}]},{tfOpName:`Enter`,category:`control`,inputs:[{start:0,name:`tensor`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0},{tfName:`frame_name`,name:`frameName`,type:`string`},{tfName:`is_constant`,name:`isConstant`,type:`bool`}]},{tfOpName:`Exit`,category:`control`,inputs:[{start:0,name:`tensor`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`NextIteration`,category:`control`,inputs:[{start:0,name:`tensor`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`TensorArrayV3`,category:`control`,inputs:[{start:0,name:`size`,type:`number`}],attrs:[{tfName:`dtype`,name:`dtype`,type:`dtype`},{tfName:`element_shape`,name:`elementShape`,type:`shape`},{tfName:`dynamic_size`,name:`dynamicSize`,type:`bool`},{tfName:`clear_after_read`,name:`clearAfterRead`,type:`bool`},{tfName:`identical_element_shapes`,name:`identicalElementShapes`,type:`bool`},{tfName:`tensor_array_name`,name:`name`,type:`string`}]},{tfOpName:`TensorArrayWriteV3`,category:`control`,inputs:[{start:0,name:`tensorArrayId`,type:`tensor`},{start:1,name:`index`,type:`number`},{start:2,name:`tensor`,type:`tensor`},{start:3,name:`flowIn`,type:`number`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`TensorArrayReadV3`,category:`control`,inputs:[{start:0,name:`tensorArrayId`,type:`tensor`},{start:1,name:`index`,type:`number`},{start:2,name:`flowIn`,type:`number`}],attrs:[{tfName:`dtype`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`TensorArrayGatherV3`,category:`control`,inputs:[{start:0,name:`tensorArrayId`,type:`tensor`},{start:1,name:`indices`,type:`number[]`},{start:2,name:`flowIn`,type:`number`}],attrs:[{tfName:`dtype`,name:`dtype`,type:`dtype`},{tfName:`element_shape`,name:`elementShape`,type:`shape`}]},{tfOpName:`TensorArrayScatterV3`,category:`control`,inputs:[{start:0,name:`tensorArrayId`,type:`tensor`},{start:1,name:`indices`,type:`number[]`},{start:2,name:`tensor`,type:`tensor`},{start:3,name:`flowIn`,type:`number`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`}]},{tfOpName:`TensorArrayConcatV3`,category:`control`,inputs:[{start:0,name:`tensorArrayId`,type:`tensor`},{start:1,name:`flowIn`,type:`number`}],attrs:[{tfName:`dtype`,name:`dtype`,type:`dtype`},{tfName:`element_shape_except0`,name:`elementShapeExcept0`,type:`shape`,notSupported:!0}]},{tfOpName:`TensorArraySplitV3`,category:`control`,inputs:[{start:0,name:`tensorArrayId`,type:`tensor`},{start:1,name:`tensor`,type:`tensor`},{start:2,name:`lengths`,type:`number[]`},{start:3,name:`flowIn`,type:`number`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`}]},{tfOpName:`TensorArraySizeV3`,category:`control`,inputs:[{start:0,name:`tensorArrayId`,type:`tensor`},{start:1,name:`flowIn`,type:`number`}]},{tfOpName:`TensorArrayCloseV3`,category:`control`,inputs:[{start:0,name:`tensorArrayId`,type:`tensor`}]},{tfOpName:`StatelessIf`,category:`control`,inputs:[{start:0,name:`cond`,type:`tensor`},{start:1,end:0,name:`args`,type:`tensors`}],attrs:[{tfName:`then_branch`,name:`thenBranch`,type:`func`},{tfName:`else_branch`,name:`elseBranch`,type:`func`}]},{tfOpName:`If`,category:`control`,inputs:[{start:0,name:`cond`,type:`tensor`},{start:1,end:0,name:`args`,type:`tensors`}],attrs:[{tfName:`then_branch`,name:`thenBranch`,type:`func`},{tfName:`else_branch`,name:`elseBranch`,type:`func`}]},{tfOpName:`StatelessWhile`,category:`control`,inputs:[{start:0,end:0,name:`args`,type:`tensors`}],attrs:[{tfName:`cond`,name:`cond`,type:`func`},{tfName:`body`,name:`body`,type:`func`}]},{tfOpName:`While`,category:`control`,inputs:[{start:0,end:0,name:`args`,type:`tensors`}],attrs:[{tfName:`cond`,name:`cond`,type:`func`},{tfName:`body`,name:`body`,type:`func`}]},{tfOpName:`TensorListScatter`,category:`control`,inputs:[{start:0,name:`tensor`,type:`tensor`},{start:1,name:`indices`,type:`number[]`},{start:2,name:`elementShape`,type:`shape`}],attrs:[{tfName:`element_dtype`,name:`elementDType`,type:`dtype`}]},{tfOpName:`TensorListScatterV2`,category:`control`,inputs:[{start:0,name:`tensor`,type:`tensor`},{start:1,name:`indices`,type:`number[]`},{start:2,name:`elementShape`,type:`shape`},{start:3,name:`numElements`,type:`number`}],attrs:[{tfName:`element_dtype`,name:`elementDType`,type:`dtype`}]},{tfOpName:`TensorListGather`,category:`control`,inputs:[{start:0,name:`tensorListId`,type:`tensor`},{start:1,name:`indices`,type:`number[]`},{start:2,name:`elementShape`,type:`shape`}],attrs:[{tfName:`element_dtype`,name:`elementDType`,type:`dtype`}]},{tfOpName:`TensorListGetItem`,category:`control`,inputs:[{start:0,name:`tensorListId`,type:`tensor`},{start:1,name:`index`,type:`number`},{start:2,name:`elementShape`,type:`shape`}],attrs:[{tfName:`element_dtype`,name:`elementDType`,type:`dtype`}]},{tfOpName:`TensorListSetItem`,category:`control`,inputs:[{start:0,name:`tensorListId`,type:`tensor`},{start:1,name:`index`,type:`number`},{start:2,name:`tensor`,type:`tensor`}],attrs:[{tfName:`element_dtype`,name:`elementDType`,type:`dtype`}]},{tfOpName:`TensorListReserve`,category:`control`,inputs:[{start:0,name:`elementShape`,type:`shape`},{start:1,name:`numElements`,type:`number`}],attrs:[{tfName:`element_dtype`,name:`elementDType`,type:`dtype`}]},{tfOpName:`TensorListFromTensor`,category:`control`,inputs:[{start:0,name:`tensor`,type:`tensor`},{start:1,name:`elementShape`,type:`shape`}],attrs:[{tfName:`element_dtype`,name:`elementDType`,type:`dtype`}]},{tfOpName:`TensorListStack`,category:`control`,inputs:[{start:0,name:`tensorListId`,type:`tensor`},{start:1,name:`elementShape`,type:`shape`}],attrs:[{tfName:`element_dtype`,name:`elementDType`,type:`dtype`},{tfName:`num_elements`,name:`numElements`,type:`dtype`}]},{tfOpName:`TensorListSplit`,category:`control`,inputs:[{start:0,name:`tensor`,type:`tensor`},{start:1,name:`elementShape`,type:`shape`},{start:2,name:`lengths`,type:`number[]`}],attrs:[{tfName:`element_dtype`,name:`elementDType`,type:`dtype`}]},{tfOpName:`TensorListConcat`,category:`control`,inputs:[{start:0,name:`tensorListId`,type:`tensor`}],attrs:[{tfName:`element_shape`,name:`elementShape`,type:`shape`},{tfName:`element_dtype`,name:`elementDType`,type:`dtype`}]},{tfOpName:`TensorListConcatV2`,category:`control`,inputs:[{start:0,name:`tensorListId`,type:`tensor`}],attrs:[{tfName:`element_shape`,name:`elementShape`,type:`shape`},{tfName:`element_dtype`,name:`elementDType`,type:`dtype`}]},{tfOpName:`TensorListPopBack`,category:`control`,inputs:[{start:0,name:`tensorListId`,type:`tensor`},{start:1,name:`elementShape`,type:`shape`}],attrs:[{tfName:`element_dtype`,name:`elementDType`,type:`dtype`}]},{tfOpName:`TensorListPushBack`,category:`control`,inputs:[{start:0,name:`tensorListId`,type:`tensor`},{start:1,name:`tensor`,type:`tensor`}],attrs:[{tfName:`element_dtype`,name:`elementDType`,type:`dtype`}]},{tfOpName:`TensorListLength`,category:`control`,inputs:[{start:0,name:`tensorListId`,type:`tensor`}]},{tfOpName:`TensorListResize`,category:`control`,inputs:[{start:0,name:`tensorListId`,type:`tensor`},{start:1,name:`size`,type:`number`}]}]}),av=Object.freeze({__proto__:null,json:[{tfOpName:`AvgPool`,category:`convolution`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`strides`,name:`strides`,type:`number[]`},{tfName:`padding`,name:`pad`,type:`string`},{tfName:`data_format`,name:`dataFormat`,type:`string`,notSupported:!0},{tfName:`ksize`,name:`kernelSize`,type:`number[]`},{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`MaxPool`,category:`convolution`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`strides`,name:`strides`,type:`number[]`},{tfName:`padding`,name:`pad`,type:`string`},{tfName:`data_format`,name:`dataFormat`,type:`string`,notSupported:!0},{tfName:`ksize`,name:`kernelSize`,type:`number[]`},{tfName:`explicit_paddings`,name:`explicitPaddings`,type:`number[]`,defaultValue:[],notSupported:!0},{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`MaxPoolWithArgmax`,category:`convolution`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`strides`,name:`strides`,type:`number[]`},{tfName:`padding`,name:`pad`,type:`string`},{tfName:`ksize`,name:`kernelSize`,type:`number[]`},{tfName:`include_batch_in_index`,name:`includeBatchInIndex`,type:`bool`},{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`AvgPool3D`,category:`convolution`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`strides`,name:`strides`,type:`number[]`},{tfName:`padding`,name:`pad`,type:`string`},{tfName:`data_format`,name:`dataFormat`,type:`string`,notSupported:!0},{tfName:`ksize`,name:`kernelSize`,type:`number[]`},{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`MaxPool3D`,category:`convolution`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`strides`,name:`strides`,type:`number[]`},{tfName:`padding`,name:`pad`,type:`string`},{tfName:`data_format`,name:`dataFormat`,type:`string`,notSupported:!0},{tfName:`ksize`,name:`kernelSize`,type:`number[]`},{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Conv1D`,category:`convolution`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`filter`,type:`tensor`}],attrs:[{tfName:`stride`,name:`stride`,type:`number`},{tfName:`padding`,name:`pad`,type:`string`},{tfName:`data_format`,name:`dataFormat`,type:`string`,defaultValue:`NWC`},{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0},{tfName:`dilation`,name:`dilation`,type:`number`,defaultValue:1}]},{tfOpName:`Conv2D`,category:`convolution`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`filter`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0},{tfName:`strides`,name:`strides`,type:`number[]`},{tfName:`padding`,name:`pad`,type:`string`},{tfName:`useCudnnOnGpu`,name:`useCudnnOnGpu`,type:`bool`},{tfName:`data_format`,name:`dataFormat`,type:`string`,defaultValue:`NHWC`},{tfName:`explicit_paddings`,name:`explicitPaddings`,type:`number[]`,defaultValue:[]},{tfName:`dilations`,name:`dilations`,type:`number[]`}]},{tfOpName:`_FusedConv2D`,category:`convolution`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`filter`,type:`tensor`},{start:2,end:0,name:`args`,type:`tensors`}],attrs:[{tfName:`num_args`,name:`numArgs`,type:`number`},{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0},{tfName:`strides`,name:`strides`,type:`number[]`},{tfName:`padding`,name:`pad`,type:`string`},{tfName:`explicit_paddings`,name:`explicitPaddings`,type:`number[]`,defaultValue:[]},{tfName:`use_cudnn_on_gpu`,name:`useCudnnOnGpu`,type:`bool`,defaultValue:!0},{tfName:`data_format`,name:`dataFormat`,type:`string`,defaultValue:`NHWC`},{tfName:`dilations`,name:`dilations`,type:`number[]`,defaultValue:[1,1,1,1]},{tfName:`fused_ops`,name:`fusedOps`,type:`string[]`,defaultValue:[]},{tfName:`epsilon`,name:`epsilon`,type:`number`,defaultValue:1e-4},{tfName:`leakyrelu_alpha`,name:`leakyreluAlpha`,type:`number`,defaultValue:.2}]},{tfOpName:`Conv2DBackpropInput`,category:`convolution`,inputs:[{start:2,name:`x`,type:`tensor`},{start:1,name:`filter`,type:`tensor`},{start:0,name:`outputShape`,type:`number[]`}],attrs:[{tfName:`strides`,name:`strides`,type:`number[]`},{tfName:`padding`,name:`pad`,type:`string`},{tfName:`data_format`,name:`dataFormat`,type:`string`,notSupported:!0},{tfName:`explicit_paddings`,name:`explicitPaddings`,type:`number[]`,defaultValue:[]},{tfName:`dilations`,name:`dilations`,type:`number[]`,notSupported:!0}]},{tfOpName:`DepthwiseConv2d`,category:`convolution`,inputs:[{start:0,name:`input`,type:`tensor`},{start:1,name:`filter`,type:`tensor`}],attrs:[{tfName:`strides`,name:`strides`,type:`number[]`},{tfName:`padding`,name:`pad`,type:`string`},{tfName:`data_format`,name:`dataFormat`,type:`string`,defaultValue:`NHWC`},{tfName:`explicit_paddings`,name:`explicitPaddings`,type:`number[]`,defaultValue:[]},{tfName:`dilations`,name:`dilations`,type:`number[]`}]},{tfOpName:`DepthwiseConv2dNative`,category:`convolution`,inputs:[{start:0,name:`input`,type:`tensor`},{start:1,name:`filter`,type:`tensor`}],attrs:[{tfName:`strides`,name:`strides`,type:`number[]`},{tfName:`padding`,name:`pad`,type:`string`},{tfName:`data_format`,name:`dataFormat`,type:`string`,defaultValue:`NHWC`},{tfName:`explicit_paddings`,name:`explicitPaddings`,type:`number[]`,defaultValue:[]},{tfName:`dilations`,name:`dilations`,type:`number[]`}]},{tfOpName:`FusedDepthwiseConv2dNative`,category:`convolution`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`filter`,type:`tensor`},{start:2,end:0,name:`args`,type:`tensors`}],attrs:[{tfName:`num_args`,name:`numArgs`,type:`number`},{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0},{tfName:`strides`,name:`strides`,type:`number[]`},{tfName:`padding`,name:`pad`,type:`string`},{tfName:`data_format`,name:`dataFormat`,type:`string`,defaultValue:`NHWC`},{tfName:`dilations`,name:`dilations`,type:`number[]`,defaultValue:[1,1,1,1]},{tfName:`fused_ops`,name:`fusedOps`,type:`string[]`,defaultValue:[]},{tfName:`explicit_paddings`,name:`explicitPaddings`,type:`number[]`,defaultValue:[]}]},{tfOpName:`Conv3D`,category:`convolution`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`filter`,type:`tensor`}],attrs:[{tfName:`strides`,name:`strides`,type:`number[]`},{tfName:`padding`,name:`pad`,type:`string`},{tfName:`data_format`,name:`dataFormat`,type:`string`,defaultValue:`NHWC`},{tfName:`dilations`,name:`dilations`,type:`number[]`}]},{tfOpName:`Dilation2D`,category:`convolution`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`filter`,type:`tensor`}],attrs:[{tfName:`strides`,name:`strides`,type:`number[]`},{tfName:`rates`,name:`dilations`,type:`number[]`},{tfName:`padding`,name:`pad`,type:`string`}]}]}),ov=Object.freeze({__proto__:null,json:[{tfOpName:`Fill`,category:`creation`,inputs:[{start:0,name:`shape`,type:`number[]`},{start:1,name:`value`,type:`number`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`}]},{tfOpName:`LinSpace`,category:`creation`,inputs:[{start:0,name:`start`,type:`number`},{start:1,name:`stop`,type:`number`},{start:2,name:`num`,type:`number`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`OneHot`,category:`creation`,inputs:[{start:0,name:`indices`,type:`tensor`},{start:1,name:`depth`,type:`number`},{start:2,name:`onValue`,type:`number`,defaultValue:1},{start:3,name:`offValue`,type:`number`,defaultValue:0}],attrs:[{tfName:`axis`,name:`axis`,type:`number`,notSupported:!0},{tfName:`T`,name:`dtype`,type:`dtype`}]},{tfOpName:`Ones`,category:`creation`,inputs:[{start:0,name:`shape`,type:`number[]`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`}]},{tfOpName:`OnesLike`,category:`creation`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`dtype`,name:`dtype`,type:`dtype`}]},{tfOpName:`RandomStandardNormal`,category:`creation`,inputs:[{start:0,name:`shape`,type:`number[]`}],attrs:[{tfName:`seed`,name:`seed`,type:`number`,defaultValue:0},{tfName:`seed2`,name:`seed2`,type:`number`,defaultValue:0,notSupported:!0},{tfName:`dtype`,name:`dtype`,type:`dtype`},{tfName:`T`,name:`T`,type:`number`,notSupported:!0}]},{tfOpName:`RandomUniform`,category:`creation`,inputs:[{start:0,name:`shape`,type:`number[]`}],attrs:[{tfName:`minval`,name:`minval`,type:`number`,defaultValue:0},{tfName:`maxval`,name:`maxval`,type:`number`,defaultValue:1},{tfName:`dtype`,name:`dtype`,type:`dtype`},{tfName:`seed`,name:`seed`,type:`number`,defaultValue:0},{tfName:`seed2`,name:`seed2`,type:`number`,defaultValue:0,notSupported:!0},{tfName:`T`,name:`T`,type:`number`,notSupported:!0}]},{tfOpName:`Range`,category:`creation`,inputs:[{start:0,name:`start`,type:`number`},{start:1,name:`stop`,type:`number`},{start:2,name:`step`,type:`number`,defaultValue:0}],attrs:[{tfName:`Tidx`,name:`dtype`,type:`dtype`}]},{tfOpName:`TruncatedNormal`,category:`creation`,inputs:[{start:0,name:`shape`,type:`number[]`}],attrs:[{tfName:`means`,name:`mean`,type:`number`,defaultValue:0},{tfName:`stddev`,name:`stdDev`,type:`number`,defaultValue:1},{tfName:`seed`,name:`seed`,type:`number`},{tfName:`seed2`,name:`seed2`,type:`number`,defaultValue:0,notSupported:!0},{tfName:`dtype`,name:`dtype`,type:`dtype`},{tfName:`T`,name:`T`,type:`number`,notSupported:!0}]},{tfOpName:`Zeros`,category:`creation`,inputs:[{start:0,name:`shape`,type:`number[]`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`}]},{tfOpName:`ZerosLike`,category:`creation`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`}]},{tfOpName:`Multinomial`,category:`creation`,inputs:[{start:0,name:`logits`,type:`tensor`},{start:1,name:`numSamples`,type:`number`}],attrs:[{tfName:`seed`,name:`seed`,type:`number`},{tfName:`seed2`,name:`seed2`,type:`number`},{tfName:`T`,name:`dtype`,type:`dtype`},{tfName:`output_dtype`,name:`output_dtype`,type:`dtype`}]}]}),sv=Object.freeze({__proto__:null,json:[{tfOpName:`NonMaxSuppressionV2`,category:`dynamic`,inputs:[{start:0,name:`boxes`,type:`tensor`},{start:1,name:`scores`,type:`tensor`},{start:2,name:`maxOutputSize`,type:`number`},{start:3,name:`iouThreshold`,type:`number`}]},{tfOpName:`NonMaxSuppressionV3`,category:`dynamic`,inputs:[{start:0,name:`boxes`,type:`tensor`},{start:1,name:`scores`,type:`tensor`},{start:2,name:`maxOutputSize`,type:`number`},{start:3,name:`iouThreshold`,type:`number`},{start:4,name:`scoreThreshold`,type:`number`}]},{tfOpName:`NonMaxSuppressionV4`,category:`dynamic`,inputs:[{start:0,name:`boxes`,type:`tensor`},{start:1,name:`scores`,type:`tensor`},{start:2,name:`maxOutputSize`,type:`number`},{start:3,name:`iouThreshold`,type:`number`},{start:4,name:`scoreThreshold`,type:`number`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0},{tfName:`T_threshold`,name:`threshold`,type:`dtype`,notSupported:!0},{tfName:`pad_to_max_output_size`,name:`padToMaxOutputSize`,type:`bool`}]},{tfOpName:`NonMaxSuppressionV5`,category:`dynamic`,inputs:[{start:0,name:`boxes`,type:`tensor`},{start:1,name:`scores`,type:`tensor`},{start:2,name:`maxOutputSize`,type:`number`},{start:3,name:`iouThreshold`,type:`number`},{start:4,name:`scoreThreshold`,type:`number`},{start:5,name:`softNmsSigma`,type:`number`}]},{tfOpName:`Where`,category:`dynamic`,inputs:[{start:0,name:`condition`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`ListDiff`,category:`dynamic`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`y`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]}]}),cv=Object.freeze({__proto__:null,json:[{tfOpName:`LowerBound`,category:`evaluation`,inputs:[{start:0,name:`sortedSequence`,type:`tensor`},{start:1,name:`values`,type:`tensor`}]},{tfOpName:`TopKV2`,category:`evaluation`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`k`,type:`number`}],attrs:[{tfName:`sorted`,name:`sorted`,type:`bool`}]},{tfOpName:`UpperBound`,category:`evaluation`,inputs:[{start:0,name:`sortedSequence`,type:`tensor`},{start:1,name:`values`,type:`tensor`}]},{tfOpName:`Unique`,category:`evaluation`,inputs:[{start:0,name:`x`,type:`tensor`}]},{tfOpName:`UniqueV2`,category:`evaluation`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`axis`,type:`number`}]}]}),lv=Object.freeze({__proto__:null,json:[{tfOpName:`PlaceholderWithDefault`,category:`graph`,inputs:[{start:0,name:`default`,type:`tensor`}],attrs:[{tfName:`shape`,name:`shape`,type:`shape`},{tfName:`dtype`,name:`dtype`,type:`dtype`}]},{tfOpName:`Placeholder`,category:`graph`,attrs:[{tfName:`shape`,name:`shape`,type:`shape`},{tfName:`dtype`,name:`dtype`,type:`dtype`}]},{tfOpName:`Const`,category:`graph`},{tfOpName:`Identity`,category:`graph`,inputs:[{start:0,name:`x`,type:`tensor`}]},{tfOpName:`IdentityN`,category:`graph`,inputs:[{start:0,end:0,name:`x`,type:`tensors`}]},{tfOpName:`Snapshot`,category:`graph`,inputs:[{start:0,name:`x`,type:`tensor`}]},{tfOpName:`Rank`,category:`graph`,inputs:[{start:0,name:`x`,type:`tensor`}]},{tfOpName:`Size`,category:`graph`,inputs:[{start:0,name:`x`,type:`tensor`}]},{tfOpName:`Shape`,category:`graph`,inputs:[{start:0,name:`x`,type:`tensor`}]},{tfOpName:`ShapeN`,category:`graph`,inputs:[{start:0,end:0,name:`x`,type:`tensors`}]},{tfOpName:`Print`,category:`graph`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`data`,type:`tensors`}],attrs:[{tfName:`message`,name:`message`,type:`string`},{tfName:`first_n`,name:`firstN`,type:`number`,notSupported:!0},{tfName:`summarize`,name:`summarize`,type:`number`,defaultValue:3}]},{tfOpName:`NoOp`,category:`graph`,inputs:[]},{tfOpName:`StopGradient`,category:`graph`,inputs:[{start:0,name:`x`,type:`tensor`}]},{tfOpName:`FakeQuantWithMinMaxVars`,category:`graph`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`min`,name:`min`,type:`number`},{tfName:`max`,name:`max`,type:`number`}]}]}),uv=Object.freeze({__proto__:null,json:[{tfOpName:`HashTable`,category:`hash_table`,inputs:[],attrs:[{tfName:`shared_name`,name:`sharedName`,type:`string`},{tfName:`use_node_name_sharing`,name:`useNodeNameSharing`,type:`bool`},{tfName:`key_dtype`,name:`keyDType`,type:`dtype`},{tfName:`value_dtype`,name:`valueDType`,type:`dtype`}]},{tfOpName:`HashTableV2`,category:`hash_table`,inputs:[],attrs:[{tfName:`shared_name`,name:`sharedName`,type:`string`},{tfName:`use_node_name_sharing`,name:`useNodeNameSharing`,type:`bool`},{tfName:`key_dtype`,name:`keyDType`,type:`dtype`},{tfName:`value_dtype`,name:`valueDType`,type:`dtype`}]},{tfOpName:`LookupTableImport`,category:`hash_table`,inputs:[{start:0,name:`tableHandle`,type:`tensor`},{start:1,name:`keys`,type:`tensor`},{start:2,name:`values`,type:`tensor`}],attrs:[{tfName:`Tin`,name:`tIn`,type:`dtype`,notSupported:!0},{tfName:`Tout`,name:`tOut`,type:`dtype`,notSupported:!0}]},{tfOpName:`LookupTableImportV2`,category:`hash_table`,inputs:[{start:0,name:`tableHandle`,type:`tensor`},{start:1,name:`keys`,type:`tensor`},{start:2,name:`values`,type:`tensor`}],attrs:[{tfName:`Tin`,name:`tIn`,type:`dtype`,notSupported:!0},{tfName:`Tout`,name:`tOut`,type:`dtype`,notSupported:!0}]},{tfOpName:`LookupTableFind`,category:`hash_table`,inputs:[{start:0,name:`tableHandle`,type:`tensor`},{start:1,name:`keys`,type:`tensor`},{start:2,name:`defaultValue`,type:`tensor`}],attrs:[{tfName:`Tin`,name:`tIn`,type:`dtype`,notSupported:!0},{tfName:`Tout`,name:`tOut`,type:`dtype`,notSupported:!0}]},{tfOpName:`LookupTableFindV2`,category:`hash_table`,inputs:[{start:0,name:`tableHandle`,type:`tensor`},{start:1,name:`keys`,type:`tensor`},{start:2,name:`defaultValue`,type:`tensor`}],attrs:[{tfName:`Tin`,name:`tIn`,type:`dtype`,notSupported:!0},{tfName:`Tout`,name:`tOut`,type:`dtype`,notSupported:!0}]},{tfOpName:`LookupTableSize`,category:`hash_table`,inputs:[{start:0,name:`tableHandle`,type:`tensor`}]},{tfOpName:`LookupTableSizeV2`,category:`hash_table`,inputs:[{start:0,name:`tableHandle`,type:`tensor`}]}]}),dv=Object.freeze({__proto__:null,json:[{tfOpName:`ResizeBilinear`,category:`image`,inputs:[{start:0,name:`images`,type:`tensor`},{start:1,name:`size`,type:`number[]`}],attrs:[{tfName:`align_corners`,name:`alignCorners`,type:`bool`},{tfName:`half_pixel_centers`,name:`halfPixelCenters`,type:`bool`},{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`ResizeNearestNeighbor`,category:`image`,inputs:[{start:0,name:`images`,type:`tensor`},{start:1,name:`size`,type:`number[]`}],attrs:[{tfName:`align_corners`,name:`alignCorners`,type:`bool`},{tfName:`half_pixel_centers`,name:`halfPixelCenters`,type:`bool`},{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`CropAndResize`,category:`image`,inputs:[{start:0,name:`image`,type:`tensor`},{start:1,name:`boxes`,type:`tensor`},{start:2,name:`boxInd`,type:`tensor`},{start:3,name:`cropSize`,type:`number[]`}],attrs:[{tfName:`method`,name:`method`,type:`string`},{tfName:`extrapolation_value`,name:`extrapolationValue`,type:`number`}]},{tfOpName:`ImageProjectiveTransformV3`,category:`image`,inputs:[{start:0,name:`images`,type:`tensor`},{start:1,name:`transforms`,type:`tensor`},{start:2,name:`outputShape`,type:`number[]`},{start:3,name:`fillValue`,type:`number`}],attrs:[{tfName:`interpolation`,name:`interpolation`,type:`string`},{tfName:`fill_mode`,name:`fillMode`,type:`string`}]}]}),fv=Object.freeze({__proto__:null,json:[{tfOpName:`Equal`,category:`logical`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`NotEqual`,category:`logical`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Greater`,category:`logical`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`GreaterEqual`,category:`logical`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Less`,category:`logical`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`LessEqual`,category:`logical`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`LogicalAnd`,category:`logical`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`LogicalNot`,category:`logical`,inputs:[{start:0,name:`a`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`LogicalOr`,category:`logical`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Select`,category:`logical`,inputs:[{start:0,name:`condition`,type:`tensor`},{start:1,name:`a`,type:`tensor`},{start:2,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`SelectV2`,category:`logical`,inputs:[{start:0,name:`condition`,type:`tensor`},{start:1,name:`a`,type:`tensor`},{start:2,name:`b`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]}]}),pv=Object.freeze({__proto__:null,json:[{tfOpName:`_FusedMatMul`,category:`matrices`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`},{start:2,end:0,name:`args`,type:`tensors`}],attrs:[{tfName:`num_args`,name:`numArgs`,type:`number`},{tfName:`fused_ops`,name:`fusedOps`,type:`string[]`,defaultValue:[]},{tfName:`epsilon`,name:`epsilon`,type:`number`,defaultValue:1e-4},{tfName:`transpose_a`,name:`transposeA`,type:`bool`,defaultValue:!1},{tfName:`transpose_b`,name:`transposeB`,type:`bool`,defaultValue:!1},{tfName:`leakyrelu_alpha`,name:`leakyreluAlpha`,type:`number`,defaultValue:.2},{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`MatMul`,category:`matrices`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`transpose_a`,name:`transposeA`,type:`bool`,defaultValue:!1},{tfName:`transpose_b`,name:`transposeB`,type:`bool`,defaultValue:!1},{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`BatchMatMul`,category:`matrices`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`adj_x`,name:`transposeA`,type:`bool`,defaultValue:!1},{tfName:`adj_y`,name:`transposeB`,type:`bool`,defaultValue:!1},{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`BatchMatMulV2`,category:`matrices`,inputs:[{start:0,name:`a`,type:`tensor`},{start:1,name:`b`,type:`tensor`}],attrs:[{tfName:`adj_x`,name:`transposeA`,type:`bool`,defaultValue:!1},{tfName:`adj_y`,name:`transposeB`,type:`bool`,defaultValue:!1},{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Transpose`,category:`matrices`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`perm`,type:`number[]`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`Einsum`,category:`matrices`,inputs:[{start:0,end:0,name:`tensors`,type:`tensors`}],attrs:[{tfName:`equation`,name:`equation`,type:`string`},{tfName:`N`,name:`n`,type:`number`,defaultValue:2},{tfName:`T`,name:`dtype`,type:`dtype`}]}]}),mv=Object.freeze({__proto__:null,json:[{tfOpName:`EuclideanNorm`,category:`normalization`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`axis`,type:`number[]`}],attrs:[{tfName:`keep_dims`,name:`keepDims`,type:`bool`,defaultValue:!1}]},{tfOpName:`FusedBatchNorm`,category:`normalization`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`scale`,type:`tensor`},{start:2,name:`offset`,type:`tensor`},{start:3,name:`mean`,type:`tensor`},{start:4,name:`variance`,type:`tensor`}],attrs:[{tfName:`epsilon`,name:`epsilon`,type:`number`,defaultValue:.001},{tfName:`data_format`,name:`dataFormat`,type:`string`,notSupported:!0}]},{tfOpName:`FusedBatchNormV2`,category:`normalization`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`scale`,type:`tensor`},{start:2,name:`offset`,type:`tensor`},{start:3,name:`mean`,type:`tensor`},{start:4,name:`variance`,type:`tensor`}],attrs:[{tfName:`epsilon`,name:`epsilon`,type:`number`,defaultValue:.001},{tfName:`data_format`,name:`dataFormat`,type:`string`,notSupported:!0}]},{tfOpName:`FusedBatchNormV3`,category:`normalization`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`scale`,type:`tensor`},{start:2,name:`offset`,type:`tensor`},{start:3,name:`mean`,type:`tensor`},{start:4,name:`variance`,type:`tensor`}],attrs:[{tfName:`epsilon`,name:`epsilon`,type:`number`,defaultValue:.001},{tfName:`data_format`,name:`dataFormat`,type:`string`,notSupported:!0}]},{tfOpName:`LRN`,category:`normalization`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`depth_radius`,name:`radius`,type:`number`,defaultValue:5},{tfName:`bias`,name:`bias`,type:`number`,defaultValue:1},{tfName:`alpha`,name:`alpha`,type:`number`,defaultValue:1},{tfName:`beta`,name:`beta`,type:`number`,defaultValue:.5}]},{tfOpName:`Softmax`,category:`normalization`,inputs:[{start:0,name:`x`,type:`tensor`}]},{tfOpName:`LogSoftmax`,category:`normalization`,inputs:[{start:0,name:`x`,type:`tensor`}]},{tfOpName:`SparseToDense`,category:`normalization`,inputs:[{start:0,name:`sparseIndices`,type:`tensor`},{start:1,name:`outputShape`,type:`number[]`},{start:2,name:`sparseValues`,type:`tensor`},{start:3,name:`defaultValue`,type:`tensor`}],attrs:[{tfName:`validate_indices`,name:`validateIndices`,type:`bool`,defaultValue:!0,notSupported:!0}]}]}),hv=Object.freeze({__proto__:null,json:[{tfOpName:`Bincount`,category:`reduction`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`size`,type:`number`},{start:2,name:`weights`,type:`tensor`}]},{tfOpName:`DenseBincount`,category:`reduction`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`size`,type:`number`},{start:2,name:`weights`,type:`tensor`}],attrs:[{tfName:`binary_output`,name:`binaryOutput`,type:`bool`}]},{tfOpName:`Max`,category:`reduction`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`axis`,type:`number[]`}],attrs:[{tfName:`keep_dims`,name:`keepDims`,type:`bool`}]},{tfOpName:`Mean`,category:`reduction`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`axis`,type:`number[]`}],attrs:[{tfName:`keep_dims`,name:`keepDims`,type:`bool`}]},{tfOpName:`Min`,category:`reduction`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`axis`,type:`number[]`}],attrs:[{tfName:`keep_dims`,name:`keepDims`,type:`bool`}]},{tfOpName:`Sum`,category:`reduction`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`axis`,type:`number[]`}],attrs:[{tfName:`keep_dims`,name:`keepDims`,type:`bool`}]},{tfOpName:`All`,category:`reduction`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`axis`,type:`number[]`}],attrs:[{tfName:`keep_dims`,name:`keepDims`,type:`bool`}]},{tfOpName:`Any`,category:`reduction`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`axis`,type:`number[]`}],attrs:[{tfName:`keep_dims`,name:`keepDims`,type:`bool`}]},{tfOpName:`ArgMax`,category:`reduction`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`axis`,type:`number`}]},{tfOpName:`ArgMin`,category:`reduction`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`axis`,type:`number`}]},{tfOpName:`Prod`,category:`reduction`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`axis`,type:`number[]`}],attrs:[{tfName:`keep_dims`,name:`keepDims`,type:`bool`}]},{tfOpName:`Cumprod`,category:`reduction`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`axis`,type:`number`}],attrs:[{tfName:`exclusive`,name:`exclusive`,type:`bool`},{tfName:`reverse`,name:`reverse`,type:`bool`}]},{tfOpName:`Cumsum`,category:`reduction`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`axis`,type:`number`}],attrs:[{tfName:`exclusive`,name:`exclusive`,type:`bool`},{tfName:`reverse`,name:`reverse`,type:`bool`}]}]}),gv=Object.freeze({__proto__:null,json:[{tfOpName:`ConcatV2`,category:`slice_join`,inputs:[{start:0,end:-1,name:`tensors`,type:`tensors`},{start:-1,name:`axis`,type:`number`}],attrs:[{tfName:`N`,name:`n`,type:`number`,defaultValue:2}]},{tfOpName:`Concat`,category:`slice_join`,inputs:[{start:1,end:0,name:`tensors`,type:`tensors`},{start:0,name:`axis`,type:`number`}],attrs:[{tfName:`N`,name:`n`,type:`number`,defaultValue:2}]},{tfOpName:`GatherV2`,category:`slice_join`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`indices`,type:`tensor`},{start:2,name:`axis`,type:`number`,defaultValue:0}],attrs:[{tfName:`batch_dims`,name:`batchDims`,type:`number`,defaultValue:0}]},{tfOpName:`Gather`,category:`slice_join`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`indices`,type:`tensor`}],attrs:[{tfName:`validate_indices`,name:`validateIndices`,type:`bool`,notSupported:!0}]},{tfOpName:`Reverse`,category:`slice_join`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`dims`,type:`bool[]`}]},{tfOpName:`ReverseV2`,category:`slice_join`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`axis`,type:`number[]`}]},{tfOpName:`Slice`,category:`slice_join`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`begin`,type:`number[]`},{start:2,name:`size`,type:`number[]`}]},{tfOpName:`StridedSlice`,category:`slice_join`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`begin`,type:`number[]`},{start:2,name:`end`,type:`number[]`},{start:3,name:`strides`,type:`number[]`}],attrs:[{tfName:`begin_mask`,name:`beginMask`,type:`number`,defaultValue:0},{tfName:`end_mask`,name:`endMask`,type:`number`,defaultValue:0},{tfName:`new_axis_mask`,name:`newAxisMask`,type:`number`,defaultValue:0},{tfName:`ellipsis_mask`,name:`ellipsisMask`,type:`number`,defaultValue:0},{tfName:`shrink_axis_mask`,name:`shrinkAxisMask`,type:`number`,defaultValue:0}]},{tfOpName:`Pack`,category:`slice_join`,inputs:[{start:0,end:0,name:`tensors`,type:`tensors`}],attrs:[{tfName:`axis`,name:`axis`,type:`number`,defaultValue:0}]},{tfOpName:`Unpack`,category:`slice_join`,inputs:[{start:0,name:`tensor`,type:`tensor`}],attrs:[{tfName:`axis`,name:`axis`,type:`number`,defaultValue:0},{tfName:`num`,name:`num`,type:`number`,defaultValue:0,notSupported:!0}]},{tfOpName:`Tile`,category:`slice_join`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`reps`,type:`number[]`}]},{tfOpName:`Split`,category:`slice_join`,inputs:[{start:0,name:`axis`,type:`number`,defaultValue:0},{start:1,name:`x`,type:`tensor`}],attrs:[{tfName:`num_split`,name:`numOrSizeSplits`,type:`number`,defaultValue:1}]},{tfOpName:`SplitV`,category:`slice_join`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`numOrSizeSplits`,type:`number[]`},{start:2,name:`axis`,type:`number`,defaultValue:0}]},{tfOpName:`ScatterNd`,category:`slice_join`,inputs:[{start:0,name:`indices`,type:`tensor`},{start:1,name:`values`,type:`tensor`},{start:2,name:`shape`,type:`number[]`}]},{tfOpName:`GatherNd`,category:`slice_join`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`indices`,type:`tensor`}]},{tfOpName:`SparseToDense`,category:`slice_join`,inputs:[{start:0,name:`sparseIndices`,type:`tensor`},{start:1,name:`outputShape`,type:`number[]`},{start:2,name:`sparseValues`,type:`tensor`},{start:3,name:`defaultValue`,type:`tensor`}],attrs:[{tfName:`validate_indices`,name:`validateIndices`,type:`bool`,defaultValue:!1,notSupported:!0}]}]}),_v=Object.freeze({__proto__:null,json:[{tfOpName:`SparseFillEmptyRows`,category:`sparse`,inputs:[{start:0,name:`indices`,type:`tensor`},{start:1,name:`values`,type:`tensor`},{start:2,name:`denseShape`,type:`tensor`},{start:3,name:`defaultValue`,type:`tensor`}]},{tfOpName:`SparseReshape`,category:`sparse`,inputs:[{start:0,name:`inputIndices`,type:`tensor`},{start:1,name:`inputShape`,type:`tensor`},{start:2,name:`newShape`,type:`tensor`}],attrs:[{tfName:`T`,name:`dtype`,type:`dtype`,notSupported:!0}]},{tfOpName:`SparseSegmentMean`,category:`sparse`,inputs:[{start:0,name:`data`,type:`tensor`},{start:1,name:`indices`,type:`tensor`},{start:2,name:`segmentIds`,type:`tensor`}]},{tfOpName:`SparseSegmentSum`,category:`sparse`,inputs:[{start:0,name:`data`,type:`tensor`},{start:1,name:`indices`,type:`tensor`},{start:2,name:`segmentIds`,type:`tensor`}]}]}),vv=Object.freeze({__proto__:null,json:[{tfOpName:`FFT`,category:`spectral`,inputs:[{start:0,name:`x`,type:`tensor`}]},{tfOpName:`IFFT`,category:`spectral`,inputs:[{start:0,name:`x`,type:`tensor`}]},{tfOpName:`RFFT`,category:`spectral`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`fft_length`,type:`number`,notSupported:!0}]},{tfOpName:`IRFFT`,category:`spectral`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`fft_length`,type:`number`,notSupported:!0}]}]}),yv=Object.freeze({__proto__:null,json:[{tfOpName:`StringNGrams`,category:`string`,inputs:[{start:0,name:`data`,type:`tensor`},{start:1,name:`dataSplits`,type:`tensor`}],attrs:[{tfName:`separator`,name:`separator`,type:`string`},{tfName:`ngram_widths`,name:`nGramWidths`,type:`number[]`},{tfName:`left_pad`,name:`leftPad`,type:`string`},{tfName:`right_pad`,name:`rightPad`,type:`string`},{tfName:`pad_width`,name:`padWidth`,type:`number`},{tfName:`preserve_short_sequences`,name:`preserveShortSequences`,type:`bool`}],outputs:[`ngrams`,`ngrams_splits`]},{tfOpName:`StringSplit`,category:`string`,inputs:[{start:0,name:`input`,type:`tensor`},{start:1,name:`delimiter`,type:`tensor`}],attrs:[{tfName:`skip_empty`,name:`skipEmpty`,type:`bool`}],outputs:[`indices`,`values`,`shape`]},{tfOpName:`StringToHashBucketFast`,category:`string`,inputs:[{start:0,name:`input`,type:`tensor`}],attrs:[{tfName:`num_buckets`,name:`numBuckets`,type:`number`}]}]}),bv=Object.freeze({__proto__:null,json:[{tfOpName:`Cast`,category:`transformation`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`SrcT`,name:`sdtype`,type:`dtype`,notSupported:!0},{tfName:`DstT`,name:`dtype`,type:`dtype`}]},{tfOpName:`ExpandDims`,category:`transformation`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`axis`,type:`number`}]},{tfOpName:`MirrorPad`,category:`transformation`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`padding`,type:`number[]`}],attrs:[{tfName:`mode`,name:`mode`,type:`string`}]},{tfOpName:`Pad`,category:`transformation`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`padding`,type:`number[]`}],attrs:[{tfName:`constant_value`,name:`constantValue`,type:`number`,defaultValue:0}]},{tfOpName:`PadV2`,category:`transformation`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`padding`,type:`number[]`},{start:2,name:`constantValue`,type:`number`,defaultValue:0}]},{tfOpName:`Reshape`,category:`transformation`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`shape`,type:`number[]`}]},{tfOpName:`Squeeze`,category:`transformation`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`axis`,tfDeprecatedName:`squeeze_dims`,name:`axis`,type:`number[]`}]},{tfOpName:`SpaceToBatchND`,category:`transformation`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`blockShape`,type:`number[]`},{start:2,name:`paddings`,type:`number[]`}]},{tfOpName:`BatchToSpaceND`,category:`transformation`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`blockShape`,type:`number[]`},{start:2,name:`crops`,type:`number[]`}]},{tfOpName:`DepthToSpace`,category:`transformation`,inputs:[{start:0,name:`x`,type:`tensor`}],attrs:[{tfName:`block_size`,name:`blockSize`,type:`number`},{tfName:`data_format`,name:`dataFormat`,type:`string`}]},{tfOpName:`BroadcastTo`,category:`transformation`,inputs:[{start:0,name:`x`,type:`tensor`},{start:1,name:`shape`,type:`number[]`}],attrs:[]},{tfOpName:`BroadcastArgs`,category:`transformation`,inputs:[{start:0,name:`s0`,type:`tensor`},{start:1,name:`s1`,type:`tensor`}],attrs:[]}]}),xv=class{static get Instance(){return this._instance||=new this}constructor(){let e=[nv,rv,iv,av,ov,sv,cv,lv,uv,dv,fv,pv,mv,hv,gv,_v,vv,yv,bv];this.opMappers=[].concat(...e.map(e=>e.json)).reduce((e,t)=>(e[t.tfOpName]=t,e),{})}transformGraph(e,t={}){let n=e.node,r=[],i=[],a=[],o=n.reduce((e,t)=>(e[t.name]=this.mapNode(t),t.op.startsWith(`Placeholder`)?r.push(e[t.name]):t.op===`Const`?i.push(e[t.name]):(t.input==null||t.input.length===0)&&a.push(e[t.name]),e),{}),s=[],c=[],l={},u={};t!=null&&(l=this.mapSignatureEntries(t.inputs),u=this.mapSignatureEntries(t.outputs));let d=Object.keys(o);d.forEach(e=>{let t=o[e];t.inputNames.forEach((e,n)=>{let[r,,i]=Z_(e),a=o[r];if(a.outputs!=null){let e=a.outputs.indexOf(i);if(e!==-1){let i=`${r}:${e}`;t.inputNames[n]=i}}t.inputs.push(a),a.children.push(t)})}),Object.keys(u).length===0?d.forEach(e=>{let t=o[e];t.children.length===0&&c.push(t)}):Object.keys(u).forEach(e=>{let[t]=Z_(e),n=o[t];n!=null&&(n.signatureKey=u[e],c.push(n))}),Object.keys(l).length>0?Object.keys(l).forEach(e=>{let[t]=Z_(e),n=o[t];n&&(n.signatureKey=l[e],s.push(n))}):s=r;let f={};e.library!=null&&e.library.function!=null&&(f=e.library.function.reduce((e,t)=>(e[t.signature.name]=this.mapFunction(t),e),{}));let p={nodes:o,inputs:s,outputs:c,weights:i,placeholders:r,signature:t,functions:f};return a.length>0&&(p.initNodes=a),p}mapSignatureEntries(e){return Object.keys(e||{}).reduce((t,n)=>(t[e[n].name]=n,t),{})}mapNode(e){let t=J_(e.op)||this.opMappers[e.op]||{};e.attr??={};let n={name:e.name,op:e.op,category:t.category,inputNames:(e.input||[]).map(e=>e.startsWith(`^`)?e.slice(1):e),inputs:[],children:[],inputParams:{},attrParams:{},rawAttrs:e.attr,outputs:t.outputs};return t.inputs!=null&&(n.inputParams=t.inputs.reduce((e,t)=>(e[t.name]={type:t.type,inputIndexStart:t.start,inputIndexEnd:t.end},e),{})),t.attrs!=null&&(n.attrParams=t.attrs.reduce((t,n)=>{let r=n.type,i;switch(n.type){case`string`:i=wv(e.attr,n.tfName,n.defaultValue),i===void 0&&n.tfDeprecatedName&&(i=wv(e.attr,n.tfDeprecatedName,n.defaultValue));break;case`string[]`:i=Pv(e.attr,n.tfName,n.defaultValue),i===void 0&&n.tfDeprecatedName&&(i=Pv(e.attr,n.tfDeprecatedName,n.defaultValue));break;case`number`:i=Ev(e.attr,n.tfName,n.defaultValue||0),i===void 0&&n.tfDeprecatedName&&(i=Ev(e.attr,n.tfDeprecatedName,n.defaultValue));break;case`number[]`:i=Nv(e.attr,n.tfName,n.defaultValue),i===void 0&&n.tfDeprecatedName&&(i=Nv(e.attr,n.tfDeprecatedName,n.defaultValue));break;case`bool`:i=Tv(e.attr,n.tfName,n.defaultValue),i===void 0&&n.tfDeprecatedName&&(i=Tv(e.attr,n.tfDeprecatedName,n.defaultValue));break;case`bool[]`:i=Iv(e.attr,n.tfName,n.defaultValue),i===void 0&&n.tfDeprecatedName&&(i=Iv(e.attr,n.tfDeprecatedName,n.defaultValue));break;case`shape`:i=Mv(e.attr,n.tfName,n.defaultValue),i===void 0&&n.tfDeprecatedName&&(i=Mv(e.attr,n.tfDeprecatedName,n.defaultValue));break;case`shape[]`:i=Fv(e.attr,n.tfName,n.defaultValue),i===void 0&&n.tfDeprecatedName&&(i=Fv(e.attr,n.tfDeprecatedName,n.defaultValue));break;case`dtype`:i=kv(e.attr,n.tfName,n.defaultValue),i===void 0&&n.tfDeprecatedName&&(i=kv(e.attr,n.tfDeprecatedName,n.defaultValue));break;case`dtype[]`:i=Av(e.attr,n.tfName,n.defaultValue),i===void 0&&n.tfDeprecatedName&&(i=Av(e.attr,n.tfDeprecatedName,n.defaultValue));break;case`func`:i=Ov(e.attr,n.tfName,n.defaultValue),i===void 0&&n.tfDeprecatedName&&(i=Ov(e.attr,n.tfDeprecatedName,n.defaultValue));break;case`tensor`:case`tensors`:break;default:throw Error(`Unsupported param type: ${n.type} for op: ${e.op}`)}return t[n.name]={value:i,type:r},t},{})),n}mapFunction(e){let t=e.nodeDef,n=[],r=[],i={};t!=null&&(i=t.reduce((e,t)=>(e[t.name]=this.mapNode(t),t.op===`Const`&&r.push(e[t.name]),e),{}));let a=[],o=[];e.signature.inputArg.forEach(e=>{let[t]=Z_(e.name),n={name:t,op:`Placeholder`,inputs:[],inputNames:[],category:`graph`,inputParams:{},attrParams:{dtype:{value:Dv(e.type),type:`dtype`}},children:[]};n.signatureKey=e.name,a.push(n),i[t]=n}),Object.keys(i).forEach(e=>{let t=i[e];t.inputNames.forEach((e,n)=>{let[r,,a]=Z_(e),o=i[r];if(o.outputs!=null){let e=o.outputs.indexOf(a);if(e!==-1){let i=`${r}:${e}`;t.inputNames[n]=i}}t.inputs.push(o),o.children.push(t)})});let s=e.ret;e.signature.outputArg.forEach(e=>{let[t,n]=Z_(s[e.name]),r=i[t];r!=null&&(r.defaultOutput=n,o.push(r))});let c=this.mapArgsToSignature(e);return{nodes:i,inputs:a,outputs:o,weights:r,placeholders:n,signature:c}}mapArgsToSignature(e){return{methodName:e.signature.name,inputs:e.signature.inputArg.reduce((e,t)=>(e[t.name]=this.mapArgToTensorInfo(t),e),{}),outputs:e.signature.outputArg.reduce((t,n)=>(t[n.name]=this.mapArgToTensorInfo(n,e.ret),t),{})}}mapArgToTensorInfo(e,t){let n=e.name;return t!=null&&(n=t[n]),{name:n,dtype:e.type}}};function Sv(e){let t=j().global;if(t.atob!==void 0)return t.atob(e);if(typeof Buffer<`u`)return new Buffer(e,`base64`).toString();throw Error(`Unable to decode base64 in this environment. Missing built-in atob() or Buffer()`)}function Cv(e,t){let n=Array.isArray(e)?String.fromCharCode.apply(null,e):Sv(e);return t?n:n.toLowerCase()}function wv(e,t,n,r=!1){let i=e[t];return i==null?n:Cv(i.s,r)}function Tv(e,t,n){let r=e[t];return r?r.b:n}function Ev(e,t,n){let r=e[t]||{},i=r.i==null?r.f==null?n:r.f:r.i;return typeof i==`number`?i:parseInt(i,10)}function Dv(e){switch(typeof e==`string`&&(e=G_[e]),e){case G_.DT_FLOAT:case G_.DT_HALF:return`float32`;case G_.DT_INT32:case G_.DT_INT64:case G_.DT_INT8:case G_.DT_UINT8:return`int32`;case G_.DT_BOOL:return`bool`;case G_.DT_DOUBLE:return`float32`;case G_.DT_STRING:return`string`;default:return null}}function Ov(e,t,n){let r=e[t];return r&&r.func?r.func.name:n}function kv(e,t,n){let r=e[t];return r&&r.type?Dv(r.type):n}function Av(e,t,n){let r=e[t];return r&&r.list&&r.list.type?r.list.type.map(e=>Dv(e)):n}function jv(e){if(!e.unknownRank)return e.dim==null?[]:e.dim.map(e=>typeof e.size==`number`?e.size:parseInt(e.size,10))}function Mv(e,t,n){let r=e[t];return r&&r.shape?jv(r.shape):n}function Nv(e,t,n){let r=e[t];return r?((r.list.f&&r.list.f.length?r.list.f:r.list.i)||[]).map(e=>typeof e==`number`?e:parseInt(e,10)):n}function Pv(e,t,n,r=!1){let i=e[t];return i&&i.list&&i.list.s?i.list.s.map(e=>Cv(e,r)):n}function Fv(e,t,n){let r=e[t];return r&&r.list&&r.list.shape?r.list.shape.map(e=>jv(e)):n}function Iv(e,t,n){let r=e[t];return r&&r.list&&r.list.b?r.list.b:n}
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Lv=class{constructor(e,t,n){this.node=e,this.tensorMap=t,this.context=n,this.inputs=[],this.attrs={},this.inputs=e.inputNames.map(e=>this.getInput(e)),e.rawAttrs!=null&&(this.attrs=Object.keys(e.rawAttrs).reduce((e,t)=>(e[t]=this.getAttr(t),e),{}))}getInput(e){return Y_(e,this.tensorMap,this.context)}getAttr(e,t){let n=this.node.rawAttrs[e];if(n.tensor!=null)return Y_(e,this.tensorMap,this.context);if(n.i!=null||n.f!=null)return Ev(this.node.rawAttrs,e,t);if(n.s!=null)return wv(this.node.rawAttrs,e,t);if(n.b!=null)return Tv(this.node.rawAttrs,e,t);if(n.shape!=null)return Mv(this.node.rawAttrs,e,t);if(n.type!=null)return kv(this.node.rawAttrs,e,t);if(n.list!=null){if(n.list.i!=null||n.list.f!=null)return Nv(this.node.rawAttrs,e,t);if(n.list.s!=null)return Pv(this.node.rawAttrs,e,t);if(n.list.shape!=null)return Fv(this.node.rawAttrs,e,t);if(n.list.b!=null)return Iv(this.node.rawAttrs,e,t);if(n.list.type!=null)return Av(this.node.rawAttrs,e,t)}return t}},Rv=Object.freeze({__proto__:null,OP_SCOPE_SUFFIX:qi,abs:ps,acos:hs,acosh:_s,add:os,addN:ys,all:xs,any:Cs,argMax:Ts,argMin:Ds,asin:ks,asinh:js,atan:Ns,atan2:Fs,atanh:Ls,avgPool:ic,avgPool3d:oc,basicLSTMCell:hc,batchNorm:bc,batchNorm2d:Sc,batchNorm3d:wc,batchNorm4d:Ec,batchToSpaceND:_c,bincount:Oc,booleanMaskAsync:jm,broadcastArgs:Ac,broadcastTo:Mc,buffer:R,cast:Qa,ceil:Pc,clipByValue:Lc,clone:eo,complex:Yi,concat:cc,concat1d:zc,concat2d:Vc,concat3d:Uc,concat4d:Gc,conv1d:Yc,conv2d:qc,conv2dTranspose:$c,conv3d:tl,conv3dTranspose:al,cos:sl,cosh:ll,cosineWindow:Gm,cumprod:dl,cumsum:pl,denseBincount:hl,depthToSpace:_l,depthwiseConv2d:yl,diag:xl,dilation2d:Cl,div:us,divNoNan:jl,dot:Nl,dropout:Um,einsum:Fl,elu:Ll,enclosingPowerOfTwo:Wm,equal:Tl,erf:zl,euclideanNorm:lu,exp:du,expandDims:pu,expm1:hu,eye:yu,fft:Up,fill:Fc,floor:xu,floorDiv:cs,fused:uh,gather:Cu,gatherND:Bm,greater:Tu,greaterEqual:Du,ifft:Gp,imag:Io,image:Xg,inTopKAsync:qm,irfft:qp,isFinite:ku,isInf:ju,isNaN:Nu,leakyRelu:Fu,less:Lu,lessEqual:zu,linalg:Zg,linspace:Bu,localResponseNormalization:Hu,log:Wu,log1p:Ku,logSigmoid:Zu,logSoftmax:ed,logSumExp:nd,logicalAnd:id,logicalNot:od,logicalOr:cd,logicalXor:ud,losses:Qg,lowerBound:md,matMul:z,max:Yl,maxPool:gd,maxPool3d:vd,maxPoolWithArgmax:bd,maximum:Sd,mean:wd,meshgrid:Dd,min:Zl,minimum:kd,mirrorPad:jd,mod:Nd,moments:Fd,movingAverage:Nm,mul:B,multiRNNCell:Ld,multinomial:zd,neg:Ro,norm:su,notEqual:Vd,oneHot:Oo,ones:Ed,onesLike:Ud,op:L,outerProduct:Gd,pad:qd,pad1d:Yd,pad2d:Zd,pad3d:$d,pad4d:tf,pool:cf,pow:$l,prelu:uf,print:to,prod:ff,raggedGather:mf,raggedTensorToTensor:gf,rand:vf,randomGamma:Kf,randomNormal:Jf,randomStandardNormal:Xf,randomUniform:Qf,range:$f,real:Bo,reciprocal:tp,relu:rp,relu6:ap,reshape:V,reverse:sp,reverse1d:lp,reverse2d:dp,reverse3d:pp,reverse4d:hp,rfft:Zp,round:_p,rsqrt:yp,scalar:U,scatterND:Fm,searchSorted:pd,selu:xp,separableConv2d:Cp,setdiff1dAsync:Tp,sigmoid:uc,sign:Dp,signal:Yg,sin:kp,sinh:jp,slice:H,slice1d:Np,slice2d:Fp,slice3d:Lp,slice4d:zp,softmax:Vp,softplus:Yu,spaceToBatchND:rf,sparse:$g,sparseToDense:Rm,spectral:Jg,split:Yp,sqrt:tu,square:ru,squaredDifference:$p,squeeze:tm,stack:rm,step:am,stridedSlice:sm,string:e_,sub:G,sum:W,tan:lm,tanh:pc,tensor:Zi,tensor1d:um,tensor2d:dm,tensor3d:Ko,tensor4d:fm,tensor5d:pm,tensor6d:mm,tile:_u,topk:gm,transpose:Ho,truncatedNormal:vm,unique:bm,unsortedSegmentSum:Sm,unstack:wm,upperBound:Tm,variable:Em,where:Dl,whereAsync:km,zeros:Td,zerosLike:kl});
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const zv=(e,t,n,r=Rv)=>{switch(e.op){case`BiasAdd`:case`AddV2`:case`Add`:return[r.add(K(`a`,e,t,n),K(`b`,e,t,n))];case`AddN`:return[r.addN(K(`tensors`,e,t,n))];case`FloorMod`:case`Mod`:return[r.mod(K(`a`,e,t,n),K(`b`,e,t,n))];case`Mul`:return[r.mul(K(`a`,e,t,n),K(`b`,e,t,n))];case`RealDiv`:case`Div`:return[r.div(K(`a`,e,t,n),K(`b`,e,t,n))];case`DivNoNan`:return[r.divNoNan(K(`a`,e,t,n),K(`b`,e,t,n))];case`FloorDiv`:return[r.floorDiv(K(`a`,e,t,n),K(`b`,e,t,n))];case`Sub`:return[r.sub(K(`a`,e,t,n),K(`b`,e,t,n))];case`Minimum`:return[r.minimum(K(`a`,e,t,n),K(`b`,e,t,n))];case`Maximum`:return[r.maximum(K(`a`,e,t,n),K(`b`,e,t,n))];case`Pow`:return[r.pow(K(`a`,e,t,n),K(`b`,e,t,n))];case`SquaredDifference`:return[r.squaredDifference(K(`a`,e,t,n),K(`b`,e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}},Bv=(e,t,n,r=Rv)=>{switch(e.op){case`Abs`:case`ComplexAbs`:return[r.abs(K(`x`,e,t,n))];case`Acos`:return[r.acos(K(`x`,e,t,n))];case`Acosh`:return[r.acosh(K(`x`,e,t,n))];case`Asin`:return[r.asin(K(`x`,e,t,n))];case`Asinh`:return[r.asinh(K(`x`,e,t,n))];case`Atan`:return[r.atan(K(`x`,e,t,n))];case`Atan2`:return[r.atan2(K(`x`,e,t,n),K(`y`,e,t,n))];case`Atanh`:return[r.atanh(K(`x`,e,t,n))];case`Ceil`:return[r.ceil(K(`x`,e,t,n))];case`Complex`:return[r.complex(K(`real`,e,t,n),K(`imag`,e,t,n))];case`Cos`:return[r.cos(K(`x`,e,t,n))];case`Cosh`:return[r.cosh(K(`x`,e,t,n))];case`Elu`:return[r.elu(K(`x`,e,t,n))];case`Erf`:return[r.erf(K(`x`,e,t,n))];case`Exp`:return[r.exp(K(`x`,e,t,n))];case`Expm1`:return[r.expm1(K(`x`,e,t,n))];case`Floor`:return[r.floor(K(`x`,e,t,n))];case`Log`:return[r.log(K(`x`,e,t,n))];case`Log1p`:return[r.log1p(K(`x`,e,t,n))];case`Imag`:return[r.imag(K(`x`,e,t,n))];case`Neg`:return[r.neg(K(`x`,e,t,n))];case`Reciprocal`:return[r.reciprocal(K(`x`,e,t,n))];case`Real`:return[r.real(K(`x`,e,t,n))];case`Relu`:return[r.relu(K(`x`,e,t,n))];case`Round`:return[r.round(K(`x`,e,t,n))];case`Selu`:return[r.selu(K(`x`,e,t,n))];case`Sigmoid`:return[r.sigmoid(K(`x`,e,t,n))];case`Sin`:return[r.sin(K(`x`,e,t,n))];case`Sign`:return[r.sign(K(`x`,e,t,n))];case`Sinh`:return[r.sinh(K(`x`,e,t,n))];case`Softplus`:return[r.softplus(K(`x`,e,t,n))];case`Sqrt`:return[r.sqrt(K(`x`,e,t,n))];case`Square`:return[r.square(K(`x`,e,t,n))];case`Tanh`:return[r.tanh(K(`x`,e,t,n))];case`Tan`:return[r.tan(K(`x`,e,t,n))];case`ClipByValue`:return[r.clipByValue(K(`x`,e,t,n),K(`clipValueMin`,e,t,n),K(`clipValueMax`,e,t,n))];case`Relu6`:return[r.relu6(K(`x`,e,t,n))];case`Rsqrt`:return[r.rsqrt(Y_(e.inputNames[0],t,n))];case`Prod`:return[r.prod(K(`x`,e,t,n),K(`axes`,e,t,n))];case`LeakyRelu`:return[r.leakyRelu(K(`x`,e,t,n),K(`alpha`,e,t,n))];case`Prelu`:return[r.prelu(K(`x`,e,t,n),K(`alpha`,e,t,n))];case`IsNan`:return[r.isNaN(Y_(e.inputNames[0],t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Vv(e,t,n=``){if(!(typeof e==`number`||typeof t==`number`)){l(e.length===t.length,()=>n+` Shapes ${e} and ${t} must match`);for(let r=0;r<e.length;r++){let i=e[r],a=t[r];l(i<0||a<0||i===a,()=>n+` Shapes ${e} and ${t} must match`)}}}function Hv(e){return!(typeof e==`number`||e.some(e=>e<0))}function Uv(e,t,n){let r=Wv(e,n),i=!Hv(r);if(i&&t.length===0)throw Error(`Tried to calculate elements of an empty list with non-fully-defined elementShape: ${r}`);if(i&&t.forEach(e=>{r=Wv(e.shape,r)}),!Hv(r))throw Error(`Non-fully-defined elementShape: ${r}`);return r}function Wv(e,t){if(typeof e==`number`)return t;if(typeof t==`number`)return e;if(e.length!==t.length)throw Error(`Incompatible ranks during merge: ${e} vs. ${t}`);let n=[];for(let r=0;r<e.length;++r){let i=e[r],a=t[r];if(i>=0&&a>=0&&i!==a)throw Error(`Incompatible shape during merge: ${e} vs. ${t}`);n[r]=i>=0?i:a}return n}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Gv=class{constructor(e,t,n,r,i,a,o){this.name=e,this.dtype=t,this.maxSize=n,this.elementShape=r,this.identicalElementShapes=i,this.dynamicSize=a,this.clearAfterRead=o,this.tensors=[],this.closed_=!1,this.idTensor=U(0),Mo(this.idTensor)}get id(){return this.idTensor.id}get closed(){return this.closed_}clearAndClose(e){this.tensors.forEach(t=>{(e==null||!e.has(t.tensor.id))&&t.tensor.dispose()}),this.tensors=[],this.closed_=!0,this.idTensor.dispose()}size(){return this.tensors.length}read(e){if(this.closed_)throw Error(`TensorArray ${this.name} has already been closed.`);if(e<0||e>=this.size())throw Error(`Tried to read from index ${e}, but array size is: ${this.size()}`);let t=this.tensors[e];if(t.cleared)throw Error(`TensorArray ${this.name}: Could not read index ${e} twice because it was cleared after a previous read (perhaps try setting clear_after_read = false?).`);return this.clearAfterRead&&(t.cleared=!0),t.read=!0,t.tensor}readMany(e){return e.map(e=>this.read(e))}write(e,t){if(this.closed_)throw Error(`TensorArray ${this.name} has already been closed.`);if(e<0||!this.dynamicSize&&e>=this.maxSize)throw Error(`Tried to write to index ${e}, but array is not resizeable and size is: ${this.maxSize}`);let n=this.tensors[e]||{};if(t.dtype!==this.dtype)throw Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e},
          because the value dtype is ${t.dtype}, but TensorArray dtype is ${this.dtype}.`);if(this.size()===0&&(this.elementShape==null||this.elementShape.length===0)&&(this.elementShape=t.shape),Vv(this.elementShape,t.shape,`TensorArray ${this.name}: Could not write to TensorArray index ${e}.`),n.read)throw Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e}, because it has already been read.`);if(n.written)throw Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e}, because it has already been written.`);n.tensor=t,Mo(t),n.written=!0,this.tensors[e]=n}writeMany(e,t){if(e.length!==t.length)throw Error(`TensorArray ${this.name}: could not write multiple tensors,because the index size: ${e.length} is not the same as tensors size: ${t.length}.`);e.forEach((e,n)=>this.write(e,t[n]))}gather(e,t){if(t&&t!==this.dtype)throw Error(`TensorArray dtype is ${this.dtype} but gather requested dtype ${t}`);if(e)e=e.slice(0,this.size());else{e=[];for(let t=0;t<this.size();t++)e.push(t)}if(e.length===0)return Zi([],[0].concat(this.elementShape));let n=this.readMany(e);return Vv(this.elementShape,n[0].shape,`TensorArray shape mismatch: `),rm(n,0)}concat(e){if(e&&e!==this.dtype)throw Error(`TensorArray dtype is ${this.dtype} but concat requested dtype ${e}`);if(this.size()===0)return Zi([],[0].concat(this.elementShape));let t=[];for(let e=0;e<this.size();e++)t.push(e);let n=this.readMany(t);return Vv(this.elementShape,n[0].shape,`TensorArray shape mismatch: tensor array shape (${this.elementShape}) vs first tensor shape (${n[0].shape})`),cc(n,0)}scatter(e,t){if(t.dtype!==this.dtype)throw Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${t.dtype}`);if(e.length!==t.shape[0])throw Error(`Expected len(indices) == tensor.shape[0], but saw: ${e.length} vs. ${t.shape[0]}`);let n=Math.max(...e);if(!this.dynamicSize&&n>=this.maxSize)throw Error(`Max index must be < array size (${n}  vs. ${this.maxSize})`);this.writeMany(e,wm(t,0))}split(e,t){if(t.dtype!==this.dtype)throw Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${t.dtype}`);let n=0,r=e.map(e=>(n+=e,n));if(n!==t.shape[0])throw Error(`Expected sum of lengths to be equal to
          tensor.shape[0], but sum of lengths is
        ${n}, and tensor's shape is: ${t.shape}`);if(!this.dynamicSize&&e.length!==this.maxSize)throw Error(`TensorArray's size is not equal to the size of lengths (${this.maxSize} vs. ${e.length}), and the TensorArray is not marked as dynamically resizeable`);let i=n===0?0:t.size/n,a=[];Ao(()=>{t=V(t,[1,n,i]);for(let n=0;n<e.length;++n){let o=[0,n===0?0:r[n-1],0],s=[1,e[n],i];a[n]=V(H(t,o,s),this.elementShape)}return a});let o=[];for(let t=0;t<e.length;t++)o[t]=t;this.writeMany(o,a)}},Kv=class e{constructor(e,t,n,r=-1){this.tensors=e,this.elementShape=t,this.elementDtype=n,e?.forEach(e=>{if(n!==e.dtype)throw Error(`Invalid data types; op elements ${n}, but list elements ${e.dtype}`);Vv(t,e.shape,`TensorList shape mismatch: `),Mo(e)}),this.idTensor=U(0),this.maxNumElements=r,Mo(this.idTensor)}get id(){return this.idTensor.id}copy(){return new e([...this.tensors],this.elementShape,this.elementDtype)}clearAndClose(e){this.tensors.forEach(t=>{(e==null||!e.has(t.id))&&t.dispose()}),this.tensors.length=0,this.idTensor.dispose()}size(){return this.tensors.length}stack(e,t,n=-1){if(t!==this.elementDtype)throw Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);if(n!==-1&&this.tensors.length!==n)throw Error(`Operation expected a list with ${n} elements but got a list with ${this.tensors.length} elements.`);Vv(e,this.elementShape,`TensorList shape mismatch: `);let r=Uv(this.elementShape,this.tensors,e);return Ao(()=>rm(this.tensors.map(e=>V(e,r)),0))}popBack(e,t){if(t!==this.elementDtype)throw Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);if(this.size()===0)throw Error(`Trying to pop from an empty list.`);let n=Uv(this.elementShape,this.tensors,e),r=this.tensors.pop();return r.kept=!1,Vv(r.shape,e,`TensorList shape mismatch: `),V(r,n)}pushBack(e){if(e.dtype!==this.elementDtype)throw Error(`Invalid data types; op elements ${e.dtype}, but list elements ${this.elementDtype}`);if(Vv(e.shape,this.elementShape,`TensorList shape mismatch: `),this.maxNumElements===this.size())throw Error(`Trying to push element into a full list.`);Mo(e),this.tensors.push(e)}resize(t){if(t<0)throw Error(`TensorListResize expects size to be non-negative. Got: ${t}`);if(this.maxNumElements!==-1&&t>this.maxNumElements)throw Error(`TensorListResize input size ${t} is greater maxNumElement ${this.maxNumElements}.`);let n=new e([],this.elementShape,this.elementDtype,this.maxNumElements);n.tensors.length=t;for(let e=0;e<Math.min(this.tensors.length,t);++e)n.tensors[e]=this.tensors[e];return n}getItem(e,t,n){if(n!==this.elementDtype)throw Error(`Invalid data types; op elements ${n}, but list elements ${this.elementDtype}`);if(e<0||e>this.tensors.length)throw Error(`Trying to access element ${e} in a list with ${this.tensors.length} elements.`);if(this.tensors[e]==null)throw Error(`element at index ${e} is null.`);Vv(this.tensors[e].shape,t,`TensorList shape mismatch: `);let r=Uv(this.elementShape,this.tensors,t);return V(this.tensors[e],r)}setItem(e,t){if(t.dtype!==this.elementDtype)throw Error(`Invalid data types; op elements ${t.dtype}, but list elements ${this.elementDtype}`);if(e<0||this.maxNumElements!==-1&&e>=this.maxNumElements)throw Error(`Trying to set element ${e} in a list with max ${this.maxNumElements} elements.`);Vv(this.elementShape,t.shape,`TensorList shape mismatch: `),Mo(t),this.tensors[e]!=null&&(this.tensors[e].kept=!1),this.tensors[e]=t}gather(e,t,n){if(t!==this.elementDtype)throw Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);Vv(this.elementShape,n,`TensorList shape mismatch: `),e=e.slice(0,this.size());let r=Uv(this.elementShape,this.tensors,n);return e.length===0?Zi([],[0].concat(r)):Ao(()=>rm(e.map(e=>V(this.tensors[e],r)),0))}concat(e,t){if(e&&e!==this.elementDtype)throw Error(`TensorList dtype is ${this.elementDtype} but concat requested dtype ${e}`);Vv(this.elementShape,t,`TensorList shape mismatch: `);let n=Uv(this.elementShape,this.tensors,t);return this.size()===0?Zi([],[0].concat(n)):Ao(()=>cc(this.tensors.map(e=>V(e,n)),0))}};function qv(e,t,n){let r=e.dtype;if(e.shape.length<1)throw Error(`Tensor must be at least a vector, but saw shape: ${e.shape}`);if(e.dtype!==n)throw Error(`Invalid data types; op elements ${e.dtype}, but list elements ${n}`);return Vv(e.shape.slice(1),t,`TensorList shape mismatch: `),new Kv(wm(e),t,r)}function Jv(e,t,n,r){return new Kv([],e,t,r)}function Yv(e,t,n,r){if(t.length!==e.shape[0])throw Error(`Expected len(indices) == tensor.shape[0], but saw: ${t.length} vs. ${e.shape[0]}`);let i=Math.max(...t);if(r!=null&&r!==-1&&i>=r)throw Error(`Max index must be < array size (${i}  vs. ${r})`);let a=new Kv([],n,e.dtype,r),o=wm(e,0);return t.forEach((e,t)=>{a.setItem(e,o[t])}),a}function Xv(e,t,n){let r=0,i=t.map(e=>(r+=e,r));if(r!==e.shape[0])throw Error(`Expected sum of lengths to be equal to
          tensor.shape[0], but sum of lengths is
        ${r}, and tensor's shape is: ${e.shape}`);let a=Wv(e.shape.slice(1),n),o=r===0?0:e.size/r,s=Ao(()=>{let n=[];e=V(e,[1,r,o]);for(let r=0;r<t.length;++r){let s=[0,r===0?0:i[r-1],0],c=[1,t[r],o];n[r]=V(H(e,s,c),a)}return e.dispose(),n}),c=new Kv([],n,e.dtype,t.length);for(let e=0;e<s.length;e++)c.setItem(e,s[e]);return c}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const Zv=async(e,t,n)=>{switch(e.op){case`If`:case`StatelessIf`:{let r=K(`thenBranch`,e,t,n),i=K(`elseBranch`,e,t,n),a=K(`cond`,e,t,n),o=K(`args`,e,t,n);return(await a.data())[0]?n.functionMap[r].executeFunctionAsync(o,n.tensorArrayMap,n.tensorListMap):n.functionMap[i].executeFunctionAsync(o,n.tensorArrayMap,n.tensorListMap)}case`While`:case`StatelessWhile`:{let r=K(`body`,e,t,n),i=K(`cond`,e,t,n),a=K(`args`,e,t,n),o=await n.functionMap[i].executeFunctionAsync(a,n.tensorArrayMap,n.tensorListMap),s=a.map(e=>e.id),c=await o[0].data();o.forEach(e=>{!e.kept&&s.indexOf(e.id)===-1&&e.dispose()});let l=a;for(;c[0];){let e=l;l=await n.functionMap[r].executeFunctionAsync(l,n.tensorArrayMap,n.tensorListMap);let t=l.map(e=>e.id);e.forEach(e=>{!e.kept&&s.indexOf(e.id)===-1&&t.indexOf(e.id)===-1&&e.dispose()});let a=await n.functionMap[i].executeFunctionAsync(l,n.tensorArrayMap,n.tensorListMap);c=await a[0].data(),a.forEach(e=>{!e.kept&&s.indexOf(e.id)===-1&&t.indexOf(e.id)===-1&&e.dispose()})}return l}case`LoopCond`:return[tv(K(`pred`,e,t,n))];case`Switch`:{let r=K(`pred`,e,t,n),i=K(`data`,e,t,n);return i.kept||(i=tv(i)),(await r.data())[0]?[void 0,i]:[i,void 0]}case`Merge`:{let r=e.inputNames.find(e=>Y_(e,t,n)!==void 0);return r?[tv(Y_(r,t,n))]:void 0}case`Enter`:{let r=K(`frameName`,e,t,n),i=K(`tensor`,e,t,n);return n.enterFrame(r),[tv(i)]}case`Exit`:{let r=K(`tensor`,e,t,n);return n.exitFrame(),[tv(r)]}case`NextIteration`:{let r=K(`tensor`,e,t,n);return n.nextIteration(),[tv(r)]}case`TensorArrayV3`:{let r=K(`size`,e,t,n),i=K(`dtype`,e,t,n),a=K(`elementShape`,e,t,n),o=K(`dynamicSize`,e,t,n),s=K(`clearAfterRead`,e,t,n),c=K(`identicalElementShapes`,e,t,n),l=new Gv(K(`name`,e,t,n),i,r,a,c,o,s);return n.addTensorArray(l),[l.idTensor,U(1)]}case`TensorArrayWriteV3`:{let r=K(`tensorArrayId`,e,t,n),i=K(`index`,e,t,n),a=K(`tensor`,e,t,n),o=n.getTensorArray(r.id);return o.write(i,a),[o.idTensor]}case`TensorArrayReadV3`:{let r=K(`tensorArrayId`,e,t,n),i=K(`index`,e,t,n);return[n.getTensorArray(r.id).read(i)]}case`TensorArrayGatherV3`:{let r=K(`tensorArrayId`,e,t,n),i=K(`indices`,e,t,n),a=K(`dtype`,e,t,n);return[n.getTensorArray(r.id).gather(i,a)]}case`TensorArrayScatterV3`:{let r=K(`tensorArrayId`,e,t,n),i=K(`indices`,e,t,n),a=K(`tensor`,e,t,n),o=n.getTensorArray(r.id);return o.scatter(i,a),[o.idTensor]}case`TensorArrayConcatV3`:{let r=K(`tensorArrayId`,e,t,n),i=n.getTensorArray(r.id),a=K(`dtype`,e,t,n);return[i.concat(a)]}case`TensorArraySplitV3`:{let r=K(`tensorArrayId`,e,t,n),i=K(`tensor`,e,t,n),a=K(`lengths`,e,t,n),o=n.getTensorArray(r.id);return o.split(a,i),[o.idTensor]}case`TensorArraySizeV3`:{let r=K(`tensorArrayId`,e,t,n);return[U(n.getTensorArray(r.id).size(),`int32`)]}case`TensorArrayCloseV3`:{let r=K(`tensorArrayId`,e,t,n),i=n.getTensorArray(r.id);return i.clearAndClose(),[i.idTensor]}case`TensorListSetItem`:{let r=K(`tensorListId`,e,t,n),i=K(`index`,e,t,n),a=K(`tensor`,e,t,n),o=n.getTensorList(r.id);return o.setItem(i,a),[o.idTensor]}case`TensorListGetItem`:{let r=K(`tensorListId`,e,t,n),i=K(`index`,e,t,n),a=K(`elementShape`,e,t,n),o=K(`elementDType`,e,t,n);return[n.getTensorList(r.id).getItem(i,a,o)]}case`TensorListScatterV2`:case`TensorListScatter`:{let r=K(`indices`,e,t,n),i=Yv(K(`tensor`,e,t,n),r,K(`elementShape`,e,t,n),K(`numElements`,e,t,n));return n.addTensorList(i),[i.idTensor]}case`TensorListReserve`:case`EmptyTensorList`:{let r=K(`elementShape`,e,t,n),i=K(`elementDType`,e,t,n),a;a=e.op===`TensorListReserve`?`numElements`:`maxNumElements`;let o=K(a,e,t,n),s=Jv(r,i,o,e.op===`TensorListReserve`?-1:o);return n.addTensorList(s),[s.idTensor]}case`TensorListGather`:{let r=K(`tensorListId`,e,t,n),i=K(`indices`,e,t,n),a=K(`elementShape`,e,t,n),o=K(`elementDType`,e,t,n);return[n.getTensorList(r.id).gather(i,o,a)]}case`TensorListStack`:{let r=K(`tensorListId`,e,t,n),i=K(`elementShape`,e,t,n),a=K(`elementDType`,e,t,n),o=K(`numElements`,e,t,n);return[n.getTensorList(r.id).stack(i,a,o)]}case`TensorListFromTensor`:{let r=qv(K(`tensor`,e,t,n),K(`elementShape`,e,t,n),K(`elementDType`,e,t,n));return n.addTensorList(r),[r.idTensor]}case`TensorListConcat`:case`TensorListConcatV2`:{let r=K(`tensorListId`,e,t,n),i=n.getTensorList(r.id),a=K(`dtype`,e,t,n),o=K(`elementShape`,e,t,n);return[i.concat(a,o)]}case`TensorListPushBack`:{let r=K(`tensorListId`,e,t,n),i=K(`tensor`,e,t,n),a=n.getTensorList(r.id);return a.pushBack(i),[a.idTensor]}case`TensorListPopBack`:{let r=K(`tensorListId`,e,t,n),i=K(`elementShape`,e,t,n),a=K(`elementDType`,e,t,n);return[n.getTensorList(r.id).popBack(i,a)]}case`TensorListSplit`:{let r=K(`tensor`,e,t,n),i=K(`elementShape`,e,t,n),a=Xv(r,K(`lengths`,e,t,n),i);return n.addTensorList(a),[a.idTensor]}case`TensorListLength`:{let r=K(`tensorListId`,e,t,n);return[U(n.getTensorList(r.id).size(),`int32`)]}case`TensorListResize`:{let r=K(`tensorListId`,e,t,n),i=K(`size`,e,t,n),a=n.getTensorList(r.id).resize(i);return n.addTensorList(a),[a.idTensor]}default:throw TypeError(`Node type ${e.op} is not implemented`)}};
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Qv(e,t,n){let[r,i]=K(`fusedOps`,e,t,n),a=r===`biasadd`,o=!a,s=i===`prelu`,c=r===`fusedbatchnorm`,l=K(`numArgs`,e,t,n);if(a){if(s&&l!==2)throw Error(`FusedConv2d and DepthwiseConv2d with BiasAdd and Prelu must have two extra arguments: bias and alpha.`);if(!s&&a&&l!==1)throw Error(`FusedConv2d and DepthwiseConv2d with BiasAdd must have one extra argument: bias.`)}if(c)throw Error(`FusedConv2d and DepthwiseConv2d with FusedBatchNorm is not supported`);let u=K(`strides`,e,t,n),d=ev(e,t,n),f=K(`dataFormat`,e,t,n).toUpperCase(),p=K(`dilations`,e,t,n),[m,h]=K(`args`,e,t,n);o&&(h=m,m=void 0);let g=K(`leakyreluAlpha`,e,t,n);return{stride:u,pad:d,dataFormat:f,dilations:p,biasArg:m,preluArg:h,activationFunc:i,leakyreluAlpha:g}}const $v=(e,t,n,r=Rv)=>{switch(e.op){case`Conv1D`:{let i=K(`stride`,e,t,n),a=K(`pad`,e,t,n),o=K(`dataFormat`,e,t,n).toUpperCase(),s=K(`dilation`,e,t,n);return[r.conv1d(K(`x`,e,t,n),K(`filter`,e,t,n),i,a,o,s)]}case`Conv2D`:{let i=K(`strides`,e,t,n),a=ev(e,t,n),o=K(`dataFormat`,e,t,n).toUpperCase(),s=K(`dilations`,e,t,n);return[r.conv2d(K(`x`,e,t,n),K(`filter`,e,t,n),[i[1],i[2]],a,o,[s[1],s[2]])]}case`_FusedConv2D`:{let{stride:i,pad:a,dataFormat:o,dilations:s,biasArg:c,preluArg:l,activationFunc:u,leakyreluAlpha:d}=Qv(e,t,n);return[r.fused.conv2d({x:K(`x`,e,t,n),filter:K(`filter`,e,t,n),strides:[i[1],i[2]],pad:a,dataFormat:o,dilations:[s[1],s[2]],bias:c,activation:u,preluActivationWeights:l,leakyreluAlpha:d})]}case`FusedDepthwiseConv2dNative`:{let{stride:i,pad:a,dataFormat:o,dilations:s,biasArg:c,preluArg:l,activationFunc:u,leakyreluAlpha:d}=Qv(e,t,n);return[r.fused.depthwiseConv2d({x:K(`x`,e,t,n),filter:K(`filter`,e,t,n),strides:[i[1],i[2]],pad:a,dataFormat:o,dilations:[s[1],s[2]],bias:c,activation:u,preluActivationWeights:l,leakyreluAlpha:d})]}case`Conv2DBackpropInput`:case`Conv2dTranspose`:{let i=K(`outputShape`,e,t,n),a=K(`strides`,e,t,n),o=ev(e,t,n);return[r.conv2dTranspose(K(`x`,e,t,n),K(`filter`,e,t,n),i,[a[1],a[2]],o)]}case`DepthwiseConv2dNative`:case`DepthwiseConv2d`:{let i=K(`strides`,e,t,n),a=ev(e,t,n),o=K(`dilations`,e,t,n),s=K(`dataFormat`,e,t,n).toUpperCase();return[r.depthwiseConv2d(K(`input`,e,t,n),K(`filter`,e,t,n),[i[1],i[2]],a,s,[o[1],o[2]])]}case`Conv3D`:{let i=K(`strides`,e,t,n),a=K(`pad`,e,t,n),o=K(`dataFormat`,e,t,n).toUpperCase(),s=K(`dilations`,e,t,n);return[r.conv3d(K(`x`,e,t,n),K(`filter`,e,t,n),[i[1],i[2],i[3]],a,o,[s[1],s[2],s[3]])]}case`AvgPool`:{let i=K(`strides`,e,t,n),a=K(`pad`,e,t,n),o=K(`kernelSize`,e,t,n);return[r.avgPool(K(`x`,e,t,n),[o[1],o[2]],[i[1],i[2]],a)]}case`MaxPool`:{let i=K(`strides`,e,t,n),a=K(`pad`,e,t,n),o=K(`kernelSize`,e,t,n);return[r.maxPool(K(`x`,e,t,n),[o[1],o[2]],[i[1],i[2]],a)]}case`MaxPoolWithArgmax`:{let i=K(`strides`,e,t,n),a=K(`pad`,e,t,n),o=K(`kernelSize`,e,t,n),s=K(`includeBatchInIndex`,e,t,n),{result:c,indexes:l}=r.maxPoolWithArgmax(K(`x`,e,t,n),[o[1],o[2]],[i[1],i[2]],a,s);return[c,l]}case`AvgPool3D`:{let i=K(`strides`,e,t,n),a=K(`pad`,e,t,n),o=K(`kernelSize`,e,t,n);return[r.avgPool3d(K(`x`,e,t,n),[o[1],o[2],o[3]],[i[1],i[2],i[3]],a)]}case`MaxPool3D`:{let i=K(`strides`,e,t,n),a=K(`pad`,e,t,n),o=K(`kernelSize`,e,t,n);return[r.maxPool3d(K(`x`,e,t,n),[o[1],o[2],o[3]],[i[1],i[2],i[3]],a)]}case`Dilation2D`:{let i=K(`strides`,e,t,n),a=K(`pad`,e,t,n),o=K(`dilations`,e,t,n),s=i[1],c=i[2],l=o[1],u=o[2];return[r.dilation2d(K(`x`,e,t,n),K(`filter`,e,t,n),[s,c],a,[l,u],`NHWC`)]}default:throw TypeError(`Node type ${e.op} is not implemented`)}},ey=(e,t,n,r=Rv)=>{switch(e.op){case`Fill`:{let i=K(`shape`,e,t,n),a=K(`dtype`,e,t,n),o=K(`value`,e,t,n);return[r.fill(i,o,a)]}case`LinSpace`:{let i=K(`start`,e,t,n),a=K(`stop`,e,t,n),o=K(`num`,e,t,n);return[r.linspace(i,a,o)]}case`Multinomial`:{let i=K(`logits`,e,t,n),a=K(`numSamples`,e,t,n),o=K(`seed`,e,t,n);return[r.multinomial(i,a,o)]}case`OneHot`:{let i=K(`indices`,e,t,n),a=K(`depth`,e,t,n),o=K(`onValue`,e,t,n),s=K(`offValue`,e,t,n),c=K(`dtype`,e,t,n);return[r.oneHot(i,a,o,s,c)]}case`Ones`:return[r.ones(K(`shape`,e,t,n),K(`dtype`,e,t,n))];case`OnesLike`:return[r.onesLike(K(`x`,e,t,n))];case`RandomStandardNormal`:return[r.randomStandardNormal(K(`shape`,e,t,n),K(`dtype`,e,t,n),K(`seed`,e,t,n))];case`RandomUniform`:return[r.randomUniform(K(`shape`,e,t,n),K(`minval`,e,t,n),K(`maxval`,e,t,n),K(`dtype`,e,t,n))];case`Range`:{let i=K(`start`,e,t,n),a=K(`stop`,e,t,n),o=K(`step`,e,t,n);return[r.range(i,a,o,K(`dtype`,e,t,n))]}case`TruncatedNormal`:{let i=K(`shape`,e,t,n),a=K(`mean`,e,t,n),o=K(`stdDev`,e,t,n),s=K(`seed`,e,t,n);return[r.truncatedNormal(i,a,o,K(`dtype`,e,t,n),s)]}case`Zeros`:return[r.zeros(K(`shape`,e,t,n),K(`dtype`,e,t,n))];case`ZerosLike`:return[r.zerosLike(K(`x`,e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}};
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ty(e,t,n){return{boxes:K(`boxes`,e,t,n),scores:K(`scores`,e,t,n),maxOutputSize:K(`maxOutputSize`,e,t,n),iouThreshold:K(`iouThreshold`,e,t,n),scoreThreshold:K(`scoreThreshold`,e,t,n),softNmsSigma:K(`softNmsSigma`,e,t,n)}}const ny=async(e,t,n,r,i=Rv)=>{switch(e.op){case`NonMaxSuppressionV5`:{let{boxes:r,scores:a,maxOutputSize:o,iouThreshold:s,scoreThreshold:c,softNmsSigma:l}=ty(e,t,n),u=await i.image.nonMaxSuppressionWithScoreAsync(r,a,o,s,c,l);return[u.selectedIndices,u.selectedScores]}case`NonMaxSuppressionV4`:{let{boxes:r,scores:a,maxOutputSize:o,iouThreshold:s,scoreThreshold:c}=ty(e,t,n),l=K(`padToMaxOutputSize`,e,t,n),u=await i.image.nonMaxSuppressionPaddedAsync(r,a,o,s,c,l);return[u.selectedIndices,u.validOutputs]}case`NonMaxSuppressionV3`:case`NonMaxSuppressionV2`:{let{boxes:r,scores:a,maxOutputSize:o,iouThreshold:s,scoreThreshold:c}=ty(e,t,n);return[await i.image.nonMaxSuppressionAsync(r,a,o,s,c)]}case`Where`:{let r=i.cast(K(`condition`,e,t,n),`bool`),a=[await i.whereAsync(r)];return r.dispose(),a}case`ListDiff`:return i.setdiff1dAsync(K(`x`,e,t,n),K(`y`,e,t,n));default:throw TypeError(`Node type ${e.op} is not implemented`)}},ry=(e,t,n,r=Rv)=>{switch(e.op){case`LowerBound`:{let i=K(`sortedSequence`,e,t,n),a=K(`values`,e,t,n);return[r.lowerBound(i,a)]}case`TopKV2`:{let i=K(`x`,e,t,n),a=K(`k`,e,t,n),o=K(`sorted`,e,t,n),s=r.topk(i,a,o);return[s.values,s.indices]}case`UpperBound`:{let i=K(`sortedSequence`,e,t,n),a=K(`values`,e,t,n);return[r.upperBound(i,a)]}case`Unique`:{let i=K(`x`,e,t,n),a=r.unique(i);return[a.values,a.indices]}case`UniqueV2`:{let i=K(`x`,e,t,n),a=K(`axis`,e,t,n),o=r.unique(i,a);return[o.values,o.indices]}default:throw TypeError(`Node type ${e.op} is not implemented`)}},iy=(e,t,n,r=Rv)=>{switch(e.op){case`Const`:return t[e.name];case`PlaceholderWithDefault`:let i=K(`default`,e,t,n);return[Y_(e.name,t,n)||i];case`Placeholder`:return[Y_(e.name,t,n)];case`Identity`:case`StopGradient`:case`FakeQuantWithMinMaxVars`:return[tv(K(`x`,e,t,n))];case`IdentityN`:return K(`x`,e,t,n).map(e=>tv(e));case`Snapshot`:return[tv(K(`x`,e,t,n))];case`Shape`:return[r.tensor1d(K(`x`,e,t,n).shape,`int32`)];case`ShapeN`:return K(`x`,e,t,n).map(e=>r.tensor1d(e.shape));case`Size`:return[r.scalar(K(`x`,e,t,n).size,`int32`)];case`Rank`:return[r.scalar(K(`x`,e,t,n).rank,`int32`)];case`NoOp`:return[r.scalar(1)];case`Print`:let a=K(`x`,e,t,n),o=K(`data`,e,t,n),s=K(`message`,e,t,n),c=K(`summarize`,e,t,n);console.warn(`The graph has a tf.print() operation,usually used for debugging, which slows down performance.`),console.log(s);for(let e=0;e<o.length;e++)console.log(Array.prototype.slice.call(o[e].dataSync()).slice(0,c));return[a];default:throw TypeError(`Node type ${e.op} is not implemented`)}};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var ay=class{constructor(e,t){this.keyDType=e,this.valueDType=t,this.handle=U(0),this.tensorMap=new Map,Mo(this.handle)}get id(){return this.handle.id}clearAndClose(){this.tensorMap.forEach(e=>e.dispose()),this.tensorMap.clear(),this.handle.dispose()}size(){return this.tensorMap.size}tensorSize(){return U(this.size(),`int32`)}async import(e,t){this.checkKeyAndValueTensor(e,t);let n=await e.data();return this.tensorMap.forEach(e=>e.dispose()),this.tensorMap.clear(),Ao(()=>{let e=wm(t),r=n.length,i=e.length;l(r===i,()=>`The number of elements doesn't match, keys has ${r} elements, the values has ${i} elements.`);for(let t=0;t<r;t++){let r=n[t],i=e[t];Mo(i),this.tensorMap.set(r,i)}return this.handle})}async find(e,t){this.checkKeyAndValueTensor(e,t);let n=await e.data();return Ao(()=>{let e=[];for(let r=0;r<n.length;r++){let i=n[r],a=this.findWithDefault(i,t);e.push(a)}return rm(e)})}findWithDefault(e,t){return this.tensorMap.get(e)??t}checkKeyAndValueTensor(e,t){if(e.dtype!==this.keyDType)throw Error(`Expect key dtype ${this.keyDType}, but got ${e.dtype}`);if(t.dtype!==this.valueDType)throw Error(`Expect value dtype ${this.valueDType}, but got ${t.dtype}`)}};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const oy=async(e,t,n,r)=>{switch(e.op){case`HashTable`:case`HashTableV2`:{let i=new ay(K(`keyDType`,e,t,n),K(`valueDType`,e,t,n));return r.addHashTable(e.name,i),[i.handle]}case`LookupTableImport`:case`LookupTableImportV2`:{let i=K(`tableHandle`,e,t,n,r),a=K(`keys`,e,t,n),o=K(`values`,e,t,n);return[await r.getHashTableById(i.id).import(a,o)]}case`LookupTableFind`:case`LookupTableFindV2`:{let i=K(`tableHandle`,e,t,n,r),a=K(`keys`,e,t,n),o=K(`defaultValue`,e,t,n);return[await r.getHashTableById(i.id).find(a,o)]}case`LookupTableSize`:case`LookupTableSizeV2`:{let i=K(`tableHandle`,e,t,n,r);return[r.getHashTableById(i.id).tensorSize()]}default:throw TypeError(`Node type ${e.op} is not implemented`)}},sy=(e,t,n,r=Rv)=>{switch(e.op){case`ResizeBilinear`:{let i=K(`images`,e,t,n),a=K(`size`,e,t,n),o=K(`alignCorners`,e,t,n),s=K(`halfPixelCenters`,e,t,n);return[r.image.resizeBilinear(i,[a[0],a[1]],o,s)]}case`ResizeNearestNeighbor`:{let i=K(`images`,e,t,n),a=K(`size`,e,t,n),o=K(`alignCorners`,e,t,n),s=K(`halfPixelCenters`,e,t,n);return[r.image.resizeNearestNeighbor(i,[a[0],a[1]],o,s)]}case`CropAndResize`:{let i=K(`image`,e,t,n),a=K(`boxes`,e,t,n),o=K(`boxInd`,e,t,n),s=K(`cropSize`,e,t,n),c=K(`method`,e,t,n),l=K(`extrapolationValue`,e,t,n);return[r.image.cropAndResize(i,a,o,s,c,l)]}case`ImageProjectiveTransformV3`:{let i=K(`images`,e,t,n),a=K(`transforms`,e,t,n),o=K(`outputShape`,e,t,n),s=K(`fillValue`,e,t,n),c=K(`interpolation`,e,t,n),l=K(`fillMode`,e,t,n);return[r.image.transform(i,a,c.toLowerCase(),l.toLowerCase(),s,o)]}default:throw TypeError(`Node type ${e.op} is not implemented`)}},cy=(e,t,n,r=Rv)=>{switch(e.op){case`Equal`:return[r.equal(K(`a`,e,t,n),K(`b`,e,t,n))];case`NotEqual`:return[r.notEqual(K(`a`,e,t,n),K(`b`,e,t,n))];case`Greater`:return[r.greater(K(`a`,e,t,n),K(`b`,e,t,n))];case`GreaterEqual`:return[r.greaterEqual(K(`a`,e,t,n),K(`b`,e,t,n))];case`Less`:return[r.less(K(`a`,e,t,n),K(`b`,e,t,n))];case`LessEqual`:return[r.lessEqual(K(`a`,e,t,n),K(`b`,e,t,n))];case`LogicalAnd`:return[r.logicalAnd(K(`a`,e,t,n),K(`b`,e,t,n))];case`LogicalNot`:return[r.logicalNot(K(`a`,e,t,n))];case`LogicalOr`:return[r.logicalOr(K(`a`,e,t,n),K(`b`,e,t,n))];case`Select`:case`SelectV2`:return[r.where(K(`condition`,e,t,n),K(`a`,e,t,n),K(`b`,e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}},ly=(e,t,n,r=Rv)=>{switch(e.op){case`BatchMatMul`:case`BatchMatMulV2`:case`MatMul`:return[r.matMul(K(`a`,e,t,n),K(`b`,e,t,n),K(`transposeA`,e,t,n),K(`transposeB`,e,t,n))];case`Einsum`:return[r.einsum(K(`equation`,e,t,n),...K(`tensors`,e,t,n))];case`Transpose`:return[r.transpose(K(`x`,e,t,n),K(`perm`,e,t,n))];case`_FusedMatMul`:let[i,a]=K(`fusedOps`,e,t,n),o=i===`biasadd`,s=a===`prelu`,c=K(`numArgs`,e,t,n),l=K(`leakyreluAlpha`,e,t,n);if(o){if(s&&c!==2)throw Error(`Fused MatMul with BiasAdd and Prelu must have two extra arguments: bias and alpha.`);if(!s&&c!==1)throw Error(`Fused MatMul with BiasAdd must have one extra argument: bias.`)}let[u,d]=K(`args`,e,t,n);return[r.fused.matMul({a:K(`a`,e,t,n),b:K(`b`,e,t,n),transposeA:K(`transposeA`,e,t,n),transposeB:K(`transposeB`,e,t,n),bias:u,activation:a,preluActivationWeights:d,leakyreluAlpha:l})];default:throw TypeError(`Node type ${e.op} is not implemented`)}},uy=(e,t,n,r=Rv)=>{switch(e.op){case`EuclideanNorm`:return[r.euclideanNorm(K(`x`,e,t,n),K(`axis`,e,t,n),K(`keepDims`,e,t,n))];case`FusedBatchNorm`:case`FusedBatchNormV2`:return[r.batchNorm(K(`x`,e,t,n),K(`mean`,e,t,n),K(`variance`,e,t,n),K(`offset`,e,t,n),K(`scale`,e,t,n),K(`epsilon`,e,t,n))];case`FusedBatchNormV3`:return[r.batchNorm(K(`x`,e,t,n),K(`mean`,e,t,n),K(`variance`,e,t,n),K(`offset`,e,t,n),K(`scale`,e,t,n),K(`epsilon`,e,t,n))];case`LRN`:return[r.localResponseNormalization(K(`x`,e,t,n),K(`radius`,e,t,n),K(`bias`,e,t,n),K(`alpha`,e,t,n),K(`beta`,e,t,n))];case`Softmax`:return[r.softmax(K(`x`,e,t,n))];case`LogSoftmax`:return[r.logSoftmax(K(`x`,e,t,n))];case`SparseToDense`:return[r.sparseToDense(K(`sparseIndices`,e,t,n),K(`outputShape`,e,t,n),K(`sparseValues`,e,t,n),K(`defaultValue`,e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}},dy=(e,t,n,r=Rv)=>{switch(e.op){case`Max`:{let i=K(`axis`,e,t,n),a=K(`keepDims`,e,t,n);return[r.max(K(`x`,e,t,n),i,a)]}case`Mean`:{let i=K(`axis`,e,t,n),a=K(`keepDims`,e,t,n);return[r.mean(K(`x`,e,t,n),i,a)]}case`Min`:{let i=K(`axis`,e,t,n),a=K(`keepDims`,e,t,n);return[r.min(K(`x`,e,t,n),i,a)]}case`Sum`:{let i=K(`axis`,e,t,n),a=K(`keepDims`,e,t,n);return[r.sum(K(`x`,e,t,n),i,a)]}case`All`:{let i=K(`axis`,e,t,n),a=K(`keepDims`,e,t,n);return[r.all(K(`x`,e,t,n),i,a)]}case`Any`:{let i=K(`axis`,e,t,n),a=K(`keepDims`,e,t,n);return[r.any(K(`x`,e,t,n),i,a)]}case`ArgMax`:{let i=K(`axis`,e,t,n);return[r.argMax(K(`x`,e,t,n),i)]}case`ArgMin`:{let i=K(`axis`,e,t,n);return[r.argMin(K(`x`,e,t,n),i)]}case`Prod`:{let i=K(`axis`,e,t,n),a=K(`keepDims`,e,t,n);return[r.prod(K(`x`,e,t,n),i,a)]}case`Cumprod`:{let i=K(`axis`,e,t,n),a=K(`exclusive`,e,t,n),o=K(`reverse`,e,t,n);return[r.cumprod(K(`x`,e,t,n),i,a,o)]}case`Cumsum`:{let i=K(`axis`,e,t,n),a=K(`exclusive`,e,t,n),o=K(`reverse`,e,t,n);return[r.cumsum(K(`x`,e,t,n),i,a,o)]}case`Bincount`:let i=K(`x`,e,t,n),a=K(`weights`,e,t,n),o=K(`size`,e,t,n);return[r.bincount(i,a,o)];case`DenseBincount`:{let i=K(`x`,e,t,n),a=K(`weights`,e,t,n),o=K(`size`,e,t,n),s=K(`binaryOutput`,e,t,n);return[r.denseBincount(i,a,o,s)]}default:throw TypeError(`Node type ${e.op} is not implemented`)}},fy=(e,t,n,r=Rv)=>{switch(e.op){case`ConcatV2`:case`Concat`:{let i=K(`n`,e,t,n),a=K(`axis`,e,t,n),o=K(`tensors`,e,t,n);return o=o.slice(0,i),[r.concat(o,a)]}case`Gather`:{let i=K(`x`,e,t,n),a=K(`indices`,e,t,n);return[r.gather(i,r.cast(a,`int32`),0)]}case`GatherV2`:{let i=K(`axis`,e,t,n),a=K(`batchDims`,e,t,n),o=K(`x`,e,t,n),s=K(`indices`,e,t,n);return[r.gather(o,r.cast(s,`int32`),i,a)]}case`Reverse`:{let i=K(`dims`,e,t,n),a=[];for(let e=0;e<i.length;e++)i[e]&&a.push(e);let o=K(`x`,e,t,n);return[r.reverse(o,a)]}case`ReverseV2`:{let i=K(`axis`,e,t,n),a=K(`x`,e,t,n);return[r.reverse(a,i)]}case`Slice`:{let i=K(`begin`,e,t,n),a=K(`size`,e,t,n);return[r.slice(K(`x`,e,t,n),i,a)]}case`StridedSlice`:{let i=K(`begin`,e,t,n),a=K(`end`,e,t,n),o=K(`strides`,e,t,n),s=K(`beginMask`,e,t,n),c=K(`endMask`,e,t,n),l=K(`ellipsisMask`,e,t,n),u=K(`newAxisMask`,e,t,n),d=K(`shrinkAxisMask`,e,t,n),f=K(`x`,e,t,n);return[r.stridedSlice(f,i,a,o,s,c,l,u,d)]}case`Pack`:return Ao(()=>{let i=K(`axis`,e,t,n),a=K(`tensors`,e,t,n),o=a[0].shape,s=r.squeeze(a[0]).shape,c=a.map(e=>{let t=m(e.shape,o);if(!t&&!m(r.squeeze(e).shape,s))throw Error(`the input tensors shape does not match`);return t?e:r.reshape(e,o)});return[r.stack(c,i)]});case`Unpack`:{let i=K(`axis`,e,t,n),a=K(`tensor`,e,t,n);return r.unstack(a,i)}case`Tile`:{let i=K(`reps`,e,t,n);return[r.tile(K(`x`,e,t,n),i)]}case`Split`:case`SplitV`:{let i=K(`axis`,e,t,n),a=K(`numOrSizeSplits`,e,t,n),o=K(`x`,e,t,n);return r.split(o,a,i)}case`ScatterNd`:{let i=K(`indices`,e,t,n),a=K(`values`,e,t,n),o=K(`shape`,e,t,n);return[r.scatterND(i,a,o)]}case`GatherNd`:{let i=K(`x`,e,t,n),a=K(`indices`,e,t,n);return[r.gatherND(i,a)]}case`SparseToDense`:{let i=K(`sparseIndices`,e,t,n),a=K(`outputShape`,e,t,n),o=K(`sparseValues`,e,t,n),s=K(`defaultValue`,e,t,n);return[r.sparseToDense(i,o,a,o.dtype===s.dtype?s:r.cast(s,o.dtype))]}default:throw TypeError(`Node type ${e.op} is not implemented`)}},py=(e,t,n,r=Rv)=>{switch(e.op){case`SparseFillEmptyRows`:{let{outputIndices:i,outputValues:a,emptyRowIndicator:o,reverseIndexMap:s}=r.sparse.sparseFillEmptyRows(K(`indices`,e,t,n),K(`values`,e,t,n),K(`denseShape`,e,t,n),K(`defaultValue`,e,t,n));return[i,a,o,s]}case`SparseReshape`:{let{outputIndices:i,outputShape:a}=r.sparse.sparseReshape(K(`inputIndices`,e,t,n),K(`inputShape`,e,t,n),K(`newShape`,e,t,n));return[i,a]}case`SparseSegmentMean`:return[r.sparse.sparseSegmentMean(K(`data`,e,t,n),K(`indices`,e,t,n),K(`segmentIds`,e,t,n))];case`SparseSegmentSum`:return[r.sparse.sparseSegmentSum(K(`data`,e,t,n),K(`indices`,e,t,n),K(`segmentIds`,e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}},my=(e,t,n,r=Rv)=>{switch(e.op){case`FFT`:return[r.fft(K(`x`,e,t,n))];case`IFFT`:return[r.ifft(K(`x`,e,t,n))];case`RFFT`:return[r.rfft(K(`x`,e,t,n))];case`IRFFT`:return[r.irfft(K(`x`,e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}},hy=(e,t,n,r=Rv)=>{switch(e.op){case`StringNGrams`:{let{nGrams:i,nGramsSplits:a}=r.string.stringNGrams(K(`data`,e,t,n),K(`dataSplits`,e,t,n),K(`separator`,e,t,n),K(`nGramWidths`,e,t,n),K(`leftPad`,e,t,n),K(`rightPad`,e,t,n),K(`padWidth`,e,t,n),K(`preserveShortSequences`,e,t,n));return[i,a]}case`StringSplit`:{let{indices:i,values:a,shape:o}=r.string.stringSplit(K(`input`,e,t,n),K(`delimiter`,e,t,n),K(`skipEmpty`,e,t,n));return[i,a,o]}case`StringToHashBucketFast`:return[r.string.stringToHashBucketFast(K(`input`,e,t,n),K(`numBuckets`,e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}},gy=(e,t,n,r=Rv)=>{switch(e.op){case`Cast`:return[r.cast(K(`x`,e,t,n),K(`dtype`,e,t,n))];case`ExpandDims`:{let i=K(`axis`,e,t,n);return[r.expandDims(K(`x`,e,t,n),i)]}case`Squeeze`:{let i=K(`axis`,e,t,n);return[r.squeeze(K(`x`,e,t,n),i)]}case`Reshape`:return[r.reshape(K(`x`,e,t,n),K(`shape`,e,t,n))];case`MirrorPad`:return[r.mirrorPad(K(`x`,e,t,n),K(`padding`,e,t,n),K(`mode`,e,t,n))];case`PadV2`:case`Pad`:return[r.pad(K(`x`,e,t,n),K(`padding`,e,t,n),K(`constantValue`,e,t,n))];case`SpaceToBatchND`:{let i=K(`blockShape`,e,t,n),a=K(`paddings`,e,t,n);return[r.spaceToBatchND(K(`x`,e,t,n),i,a)]}case`BatchToSpaceND`:{let i=K(`blockShape`,e,t,n),a=K(`crops`,e,t,n);return[r.batchToSpaceND(K(`x`,e,t,n),i,a)]}case`DepthToSpace`:{let i=K(`blockSize`,e,t,n),a=K(`dataFormat`,e,t,n).toUpperCase();return[r.depthToSpace(K(`x`,e,t,n),i,a)]}case`BroadcastTo`:return[r.broadcastTo(K(`x`,e,t,n),K(`shape`,e,t,n))];case`BroadcastArgs`:return[r.broadcastArgs(K(`s0`,e,t,n),K(`s1`,e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}};
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function _y(e,t,n,r,i=Ao){let a=((e,t,n)=>{switch(e.category){case`arithmetic`:return i(()=>zv(e,t,n));case`basic_math`:return i(()=>Bv(e,t,n));case`control`:return Zv(e,t,n);case`convolution`:return i(()=>$v(e,t,n));case`creation`:return i(()=>ey(e,t,n));case`dynamic`:return ny(e,t,n);case`evaluation`:return i(()=>ry(e,t,n));case`image`:return i(()=>sy(e,t,n));case`graph`:return i(()=>iy(e,t,n));case`logical`:return i(()=>cy(e,t,n));case`matrices`:return i(()=>ly(e,t,n));case`normalization`:return i(()=>uy(e,t,n));case`reduction`:return i(()=>dy(e,t,n));case`slice_join`:return i(()=>fy(e,t,n));case`sparse`:return i(()=>py(e,t,n));case`spectral`:return i(()=>my(e,t,n));case`string`:return i(()=>hy(e,t,n));case`transformation`:return i(()=>gy(e,t,n));case`hash_table`:return oy(e,t,n,r);case`custom`:let a=J_(e.op);if(a&&a.customExecutor)return a.customExecutor(new Lv(e,t,n));throw TypeError(`Custom op ${e.op} is not registered.`);default:throw TypeError(`Unknown op '${e.op}'. File an issue at https://github.com/tensorflow/tfjs/issues so we can add it, or register a custom execution with tf.registerOp()`)}})(e,t,n);return de(a)?a.then(e=>[].concat(e)):[].concat(a)}var vy=class{constructor(e={},t={},n={},r={}){this.weightMap=e,this.tensorArrayMap=t,this.tensorListMap=n,this.functionMap=r,this.rootContext={id:0,frameName:``,iterationId:0},this.contexts=[this.rootContext],this.lastId=0,this.generateCurrentContextIds()}newFrame(e,t){return{id:e,frameName:t,iterationId:0}}set currentContext(e){this.contexts!==e&&(this.contexts=e,this.generateCurrentContextIds())}get currentContext(){return this.contexts}get currentContextId(){return this._currentContextIds[0]}get currentContextIds(){return this._currentContextIds}generateCurrentContextIds(){let e=[];for(let t=0;t<this.contexts.length-1;t++){let n=this.contexts.slice(0,this.contexts.length-t);e.push(this.contextIdforContexts(n))}e.push(``),this._currentContextIds=e}contextIdforContexts(e){return e?e.map(e=>e.id===0&&e.iterationId===0?``:`${e.frameName}-${e.iterationId}`).join(`/`):``}enterFrame(e){this.contexts&&(this.lastId++,this.contexts=this.contexts.slice(),this.contexts.push(this.newFrame(this.lastId,e)),this._currentContextIds.unshift(this.contextIdforContexts(this.contexts)))}exitFrame(){if(this.contexts&&this.contexts.length>1)this.contexts=this.contexts.slice(),this.contexts.splice(-1),this.currentContextIds.shift();else throw Error(`Cannot exit frame, the context is empty`)}nextIteration(){if(this.contexts&&this.contexts.length>0){this.contexts=this.contexts.slice(),this.lastId++;let e=Object.assign({},this.contexts[this.contexts.length-1]);e.iterationId+=1,e.id=this.lastId,this.contexts.splice(-1,1,e),this._currentContextIds.splice(0,1,this.contextIdforContexts(this.contexts))}else throw Error(`Cannot increase frame iteration, the context is empty`)}getWeight(e){return this.weightMap[e]}addTensorArray(e){this.tensorArrayMap[e.id]=e}getTensorArray(e){return this.tensorArrayMap[e]}addTensorList(e){this.tensorListMap[e.id]=e}getTensorList(e){return this.tensorListMap[e]}dispose(e){for(let t in this.tensorArrayMap)this.tensorArrayMap[t].clearAndClose(e);for(let t in this.tensorListMap)this.tensorListMap[t].clearAndClose(e)}};
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function yy(e,t,n,r){let i=new Set,a=[],o=null,s=null,c=new Set,l=Object.keys(e).map(e=>$_(e)[0]),u=[];r!=null&&(u=r.map(e=>$_(e.name)[0]));let d=[...t];for(;d.length>0;){let e=d.pop();if((wy(e)||Ty(e)||Ey(e))&&(o??(o=e,s=o.children.map(e=>e.name).filter(e=>i.has(e)))),i.add(e.name),n[e.name]==null&&l.indexOf(e.name)===-1&&u.indexOf(e.name)===-1){if(e.inputs.length===0){a.push(e.name);continue}e.inputs.forEach(e=>{c.has(e.name)||(c.add(e.name),d.push(e))})}}return{inputs:e,outputs:t,usedNodes:i,missingInputs:a,dynamicNode:o,syncInputs:s}}function by(e,t,n){let{usedNodes:r,inputs:i}=n,a=[],o=Object.keys(i).map(e=>$_(e)[0]).map(t=>e.nodes[t]),s=e.initNodes;o.forEach(e=>{r.has(e.name)&&a.push(e)}),e.weights.forEach(e=>{r.has(e.name)&&a.push(e)}),s?.forEach(e=>{r.has(e.name)&&a.push(e)});let c=new Set,l=[];for(;a.length>0;){let e=a.pop();c.add(e.name),t[e.name]||l.push(e),e.children.forEach(e=>{!c.has(e.name)&&r.has(e.name)&&e.inputs.every(e=>c.has(e.name))&&a.push(e)})}return l}const xy=[`Switch`,`Merge`,`Enter`,`Exit`,`NextIteration`,`StatelessIf`,`StatelessWhile`,`if`,`While`],Sy=[`NonMaxSuppressionV2`,`NonMaxSuppressionV3`,`NonMaxSuppressionV5`,`Where`],Cy=[`HashTable`,`HashTableV2`,`LookupTableImport`,`LookupTableImportV2`,`LookupTableFind`,`LookupTableFindV2`,`LookupTableSize`,`LookupTableSizeV2`];function wy(e){return xy.indexOf(e.op)>=0}function Ty(e){return Sy.indexOf(e.op)>=0}function Ey(e){return Cy.indexOf(e.op)>=0}
/**
* @license
* Copyright 2018 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Dy=class e{constructor(t,n){this.graph=t,this.parent=n,this.compiledMap=new Map,this._weightMap={},this.SEPERATOR=`,`,this._functions={},this._functionExecutorMap={},this.intermediateTensors={},this.keepTensorForDebug=!1,this._outputs=t.outputs,this._inputs=t.inputs,this._initNodes=t.initNodes,this._signature=t.signature,this._functions=t.functions,t.functions!=null&&Object.keys(t.functions).forEach(n=>{this._functionExecutorMap[n]=new e(t.functions[n],this)})}get weightIds(){return this.parent?this.parent.weightIds:this._weightIds}get functionExecutorMap(){return this.parent?this.parent.functionExecutorMap:this._functionExecutorMap}get weightMap(){return this.parent?this.parent.weightMap:this._weightMap}set weightMap(e){let t=Object.keys(e).map(t=>e[t].map(e=>e.id));this._weightIds=[].concat(...t),this._weightMap=e}set resourceManager(e){this._resourceManager=e}get inputs(){return this._inputs.map(e=>({name:e.name,shape:e.attrParams.shape?e.attrParams.shape.value:void 0,dtype:e.attrParams.dtype?e.attrParams.dtype.value:void 0}))}get outputs(){return this._outputs.map(e=>({name:e.name,shape:e.attrParams.shape?e.attrParams.shape.value:void 0,dtype:e.attrParams.dtype?e.attrParams.dtype.value:void 0}))}get inputNodes(){return this._inputs.map(e=>e.signatureKey||e.name)}get outputNodes(){return this._outputs.map(e=>{let t=e.signatureKey||e.name;return e.defaultOutput?`${t}:${e.defaultOutput}`:t})}get functions(){return Object.keys(this._functions).reduce((e,t)=>(e[t]=this._functions[t].signature,e),{})}getCompilationKey(e,t){let n=e.map(e=>e.name).sort(),r=t.map(e=>e.name).sort();return n.join(this.SEPERATOR)+`--`+r.join(this.SEPERATOR)}compile(e,t){let n=yy(e,t,this.weightMap,this._initNodes),{missingInputs:r,dynamicNode:i,syncInputs:a}=n;if(i!=null)throw Error(`This execution contains the node '${i.name}', which has the dynamic op '${i.op}'. Please use model.executeAsync() instead. Alternatively, to avoid the dynamic ops, specify the inputs [${a}]`);if(r.length>0){let n=t.map(e=>e.name),i=Object.keys(e);throw Error(`Cannot compute the outputs [${n}] from the provided inputs [${i}]. Missing the following inputs: [${r}]`)}return by(this.graph,this.weightMap,n)}execute(e,t){e=this.mapInputs(e);let n=Object.keys(e).sort();this.checkInputs(e),this.checkInputShapeAndType(e),t=this.mapOutputs(t),this.checkOutputs(t);let r=n.map(e=>this.graph.nodes[$_(e)[0]]),i=t.map(e=>$_(e)[0]),a=i.map(e=>this.graph.nodes[e]);this.resetIntermediateTensors(),a.length===0&&(a=this._outputs);let o=this.getCompilationKey(r,a),s=this.compiledMap.get(o);s??(s=this.compile(e,a),this.compiledMap.set(o,s));let c={},l={};return Ao(()=>{let n=new vy(this.weightMap,c,l,this.functionExecutorMap),r=Object.assign({},this.weightMap);Object.keys(e).forEach(t=>{let[n,i]=$_(t),a=[];a[i]=e[t],r[n]=a});let a=this.getFrozenTensorIds(r),o={};for(let e=0;e<s.length;e++){let t=s[e];if(!r[t.name]){let e=_y(t,r,n,this._resourceManager);if(de(e))throw Error(`The execution of the op '${t.op}' returned a promise. Please use model.executeAsync() instead.`);r[t.name]=e,this.checkTensorForDisposal(t.name,t,r,n,a,i,o)}}return this.parent??n.dispose(a),t.map(e=>Y_(e,r,n))})}getFrozenTensorIds(e){let t=[].concat.apply([],Object.keys(e).map(t=>e[t]).map(e=>e.map(e=>e.id)));return new Set(t)}checkTensorForDisposal(e,t,n,r,i,a,o){t.category===`control`||a.indexOf(e)!==-1||(n[e].forEach(e=>{e!=null&&(o[e.id]=(o[e.id]||0)+t.children.length)}),t.inputs.forEach(e=>{e.category!==`control`&&X_(e.name,n,r)?.forEach(e=>{if(e&&!e.kept&&!i.has(e.id)){let n=o[e.id];if(n===1){if(!this.keepTensorForDebug)e.dispose();else{let[n,i]=Z_(t.name,r);this.intermediateTensors[n]||(this.intermediateTensors[n]=[]),this.intermediateTensors[n][i]=e}delete o[e.id]}else n!=null&&o[e.id]--}})}))}async executeAsync(e,t){return this._executeAsync(e,t)}disposeIntermediateTensors(){this.intermediateTensors&&(Object.keys(this.intermediateTensors).forEach(e=>this.intermediateTensors[e].forEach(e=>e.dispose())),this.disposeTensorsMap())}disposeTensorsMap(){this.tensorsMap&&Object.keys(this.tensorsMap).forEach(e=>{this.tensorsMap[e].forEach(e=>{e&&!e.kept&&!e.isDisposed&&!this.keepIds.has(e.id)&&e.dispose()})})}getIntermediateTensors(){return this.tensorsMap}resetIntermediateTensors(){for(let e in this.intermediateTensors)this.intermediateTensors[e].forEach(e=>e.dispose()),delete this.intermediateTensors[e]}async _executeAsync(e,t,n=!1,r={},i={}){n||(e=this.mapInputs(e),this.checkInputs(e),this.checkInputShapeAndType(e),t=this.mapOutputs(t),this.checkOutputs(t));try{this.keepTensorForDebug=j().getBool(`KEEP_INTERMEDIATE_TENSORS`)}catch(e){console.warn(e.message)}this.resetIntermediateTensors();let a=new vy(this.weightMap,r,i,this.functionExecutorMap);this.tensorsMap=await this.executeWithControlFlow(e,a,t,n);let o=t.map(e=>Y_(e,this.tensorsMap,a)),s=o.map(e=>e.id),c=Object.keys(e).map(t=>e[t].id);return this.keepIds=new Set([...s,...c,...this.weightIds]),this.keepTensorForDebug||this.disposeTensorsMap(),this.parent??a.dispose(this.keepIds),o}async executeFunctionAsync(e,t,n){let r=e.reduce((e,t,n)=>(e[this.inputs[n].name]=t,e),{});return this._executeAsync(r,this.outputNodes,!0,t,n)}async executeWithControlFlow(e,t,n,r){let i=Object.keys(e),a=i.map(e=>this.graph.nodes[$_(e)[0]]),o=n.map(e=>$_(e)[0]),s=o.map(e=>this.graph.nodes[e]);s.length===0&&(s=this._outputs);let{usedNodes:c,missingInputs:l,dynamicNode:u,syncInputs:d}=yy(e,s,this.weightMap,this._initNodes),f=[...a,...this.graph.weights,...this._initNodes||[]].map(e=>({node:e,contexts:t.currentContext})),p=Object.assign({},this.weightMap);Object.keys(e).forEach(t=>{let[n,r]=$_(t),i=[];i[r]=e[t],p[n]=i});let m={},h=this.getFrozenTensorIds(p),g={};for(;f.length>0;){let e=this.processStack(a,f,t,p,g,h,o,m,c);await Promise.all(e)}u==null&&!r&&console.warn(`This model execution did not contain any nodes with control flow or dynamic output shapes. You can use model.execute() instead.`);let _=s.filter(e=>!wy(e)&&!Y_(e.name,p,t)).map(e=>e.name);if(_.length>0){let e=``;throw u!=null&&(e=`Alternatively, to avoid the dynamic ops, use model.execute() and specify the inputs [${d}]`),Error(`Cannot compute the outputs [${_}] from the provided inputs [${i}]. Consider providing the following inputs: [${l}]. ${e}`)}return p}processStack(e,t,n,r,i,a,o,s,c){let l=[];for(;t.length>0;){let e=t.pop();n.currentContext=e.contexts;let u=``;if(e.node.op===`Enter`&&K(`isConstant`,e.node,r,n)&&([u]=Z_(e.node.name,n)),r[e.node.name]==null){let d=_y(e.node,r,n,this._resourceManager);u||([u]=Z_(e.node.name,n));let f=n.currentContext;de(d)?l.push(d.then(l=>(r[u]=l,n.currentContext=f,this.checkTensorForDisposal(u,e.node,r,n,a,o,s),this.processChildNodes(e.node,t,n,r,i,c),l))):(r[u]=d,this.checkTensorForDisposal(u,e.node,r,n,a,o,s),this.processChildNodes(e.node,t,n,r,i,c))}else this.processChildNodes(e.node,t,n,r,i,c)}return l}processChildNodes(e,t,n,r,i,a){e.children.forEach(e=>{let[o]=Z_(e.name,n);i[o]||!a.has(e.name)||(e.op===`Merge`?e.inputNames.some(e=>!!Y_(e,r,n))&&(i[o]=!0,t.push({contexts:n.currentContext,node:e})):e.inputNames.every(e=>!!Y_(e,r,n))&&(i[o]=!0,t.push({contexts:n.currentContext,node:e})))})}dispose(){Object.keys(this.weightMap).forEach(e=>this.weightMap[e].forEach(e=>e.dispose()))}checkInputShapeAndType(e){Object.keys(e).forEach(t=>{let n=e[t],[r]=$_(t),i=this.graph.nodes[r];if(i.attrParams.shape&&i.attrParams.shape.value){let e=i.attrParams.shape.value;l(e.length===n.shape.length&&n.shape.every((t,n)=>e[n]===-1||e[n]===t),()=>`The shape of dict['${i.name}'] provided in model.execute(dict) must be [${e}], but was [${n.shape}]`)}i.attrParams.dtype&&i.attrParams.dtype.value&&l(n.dtype===i.attrParams.dtype.value,()=>`The dtype of dict['${i.name}'] provided in model.execute(dict) must be ${i.attrParams.dtype.value}, but was ${n.dtype}`)})}mapInputs(e){let t={};for(let n in e)if(this._signature!=null&&this._signature.inputs!=null&&this._signature.inputs[n]!=null){let r=this._signature.inputs[n];t[r.name]=e[n]}else t[n]=e[n];return t}checkInputs(e){let t=Object.keys(e).filter(e=>{let[t]=$_(e);return this.graph.nodes[t]==null});if(t.length>0)throw Error(`The dict provided in model.execute(dict) has keys: [${t}] that are not part of graph`)}mapOutputs(e){return e.map(e=>this._signature!=null&&this._signature.outputs!=null&&this._signature.outputs[e]!=null?this._signature.outputs[e].name:e,{})}checkOutputs(e){e.forEach(e=>{let[t]=$_(e);if(!this.graph.nodes[t])throw Error(`The output '${e}' is not found in the graph`)})}},Oy=class{constructor(e={},t={}){this.hashTableNameToHandle=e,this.hashTableMap=t}addHashTable(e,t){this.hashTableNameToHandle[e]=t.handle,this.hashTableMap[t.id]=t}getHashTableHandleByName(e){return this.hashTableNameToHandle[e]}getHashTableById(e){return this.hashTableMap[e]}dispose(){for(let e in this.hashTableMap)this.hashTableMap[e].clearAndClose(),delete this.hashTableMap[e];for(let e in this.hashTableNameToHandle)this.hashTableNameToHandle[e].dispose(),delete this.hashTableNameToHandle[e]}},ky=class{constructor(e,t={},n=To){this.modelUrl=e,this.loadOptions=t,this.version=`n/a`,this.io=n,t??(this.loadOptions={}),this.resourceManager=new Oy}get modelVersion(){return this.version}get inputNodes(){return this.executor.inputNodes}get outputNodes(){return this.executor.outputNodes}get inputs(){return this.executor.inputs}get outputs(){return this.executor.outputs}get weights(){return this.executor.weightMap}get metadata(){return this.artifacts.userDefinedMetadata}get modelSignature(){return this.signature}get modelStructuredOutputKeys(){return this.structuredOutputKeys}findIOHandler(){let e=this.modelUrl;if(e.load!=null)this.handler=e;else if(this.loadOptions.requestInit!=null)this.handler=this.io.browserHTTPRequest(e,this.loadOptions);else{let t=this.io.getLoadHandlers(e,this.loadOptions);if(t.length===0)t.push(this.io.browserHTTPRequest(e,this.loadOptions));else if(t.length>1)throw Error(`Found more than one (${t.length}) load handlers for URL '${[e]}'`);this.handler=t[0]}}load(){if(this.findIOHandler(),this.handler.load==null)throw Error("Cannot proceed with model loading because the IOHandler provided does not have the `load` method implemented.");let e=this.handler.load();return de(e)?e.then(e=>this.loadSync(e)):this.loadSync(e)}loadSync(e){this.artifacts=e;let t=this.artifacts.modelTopology,n=this.artifacts.signature;if(this.artifacts.userDefinedMetadata!=null){let e=this.artifacts.userDefinedMetadata;e.signature!=null&&(n=e.signature),e.structuredOutputKeys!=null&&(this.structuredOutputKeys=e.structuredOutputKeys)}this.signature=n,this.version=`${t.versions.producer}.${t.versions.minConsumer}`;let r=this.io.decodeWeights(this.artifacts.weightData,this.artifacts.weightSpecs);return this.executor=new Dy(xv.Instance.transformGraph(t,this.signature)),this.executor.weightMap=this.convertTensorMapToTensorsMap(r),this.executor.resourceManager=this.resourceManager,e.modelInitializer!=null&&e.modelInitializer.node!=null&&(this.initializer=new Dy(xv.Instance.transformGraph(e.modelInitializer)),this.initializer.weightMap=this.executor.weightMap,this.initializer.resourceManager=this.resourceManager,this.initializer.executeAsync({},[])),!0}async save(e,t){if(typeof e==`string`){let t=this.io.getSaveHandlers(e);if(t.length===0)throw Error(`Cannot find any save handlers for URL '${e}'`);if(t.length>1)throw Error(`Found more than one (${t.length}) save handlers for URL '${e}'`);e=t[0]}if(e.save==null)throw Error("GraphModel.save() cannot proceed because the IOHandler provided does not have the `save` attribute defined.");return e.save(this.artifacts)}predict(e,t){let n=this.execute(e,this.outputNodes);if(this.structuredOutputKeys){let e=n instanceof bi?[n]:n,t={};return e.forEach((e,n)=>t[this.structuredOutputKeys[n]]=e),t}return n}normalizeInputs(e){if(!(e instanceof bi)&&!Array.isArray(e))return e;if(e=Array.isArray(e)?e:[e],e.length!==this.inputNodes.length)throw Error(`Input tensor count mismatch,the graph model has ${this.inputNodes.length} placeholders, while there are ${e.length} input tensors.`);return this.inputNodes.reduce((t,n,r)=>(t[n]=e[r],t),{})}normalizeOutputs(e){return e||=this.outputNodes,Array.isArray(e)?e:[e]}execute(e,t){e=this.normalizeInputs(e),t=this.normalizeOutputs(t);let n=this.executor.execute(e,t);return n.length>1?n:n[0]}async executeAsync(e,t){e=this.normalizeInputs(e),t=this.normalizeOutputs(t);let n=await this.executor.executeAsync(e,t);return n.length>1?n:n[0]}getIntermediateTensors(){return this.executor.getIntermediateTensors()}disposeIntermediateTensors(){this.executor.disposeIntermediateTensors()}convertTensorMapToTensorsMap(e){return Object.keys(e).reduce((t,n)=>(t[n]=[e[n]],t),{})}dispose(){this.executor.dispose(),this.initializer&&this.initializer.dispose(),this.resourceManager.dispose()}};async function Ay(e,t={},n=To){if(e==null)throw Error(`modelUrl in loadGraphModel() cannot be null. Please provide a url or an IOHandler that loads the model`);t??={},t.fromTFHub&&typeof e==`string`&&(e=jy(e));let r=new ky(e,t,n);return await r.load(),r}function jy(e){return e.endsWith(`/`)||(e+=`/`),`${e}model.json?tfjs-format=file`}
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function q(e,t){Array.isArray(e)||(e=[e]),e.forEach(e=>{e!=null&&l(e.dtype!==`complex64`,()=>`${t} does not support complex64 tensors in the CPU backend.`)})}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const My=Dm;var Ny=class e extends a{constructor(){super(),this.blockSize=48,this.firstUse=!0,this.data=new i(this,ko())}nextDataId(){return e.nextDataId++}write(e,t,n){this.firstUse&&(this.firstUse=!1,j().get(`IS_NODE`)&&$n(`
============================
Hi, looks like you are running TensorFlow.js in Node.js. To speed things up dramatically, install our node backend, visit https://github.com/tensorflow/tfjs-node for more details. 
============================`));let r={id:this.nextDataId()};return this.data.set(r,{values:e,dtype:n,refCount:1}),r}makeTensorInfo(e,t,n){let r;if(t===`string`&&n!=null&&n.length>0&&O(n[0])){let i=n.map(e=>ni(e));r=this.write(i,e,t)}else r=this.write(n,e,t);return{dataId:r,shape:e,dtype:t}}refCount(e){return this.data.has(e)?this.data.get(e).refCount:0}incRef(e){let t=this.data.get(e);t.refCount++}decRef(e){if(this.data.has(e)){let t=this.data.get(e);t.refCount--}}move(e,t,n,r,i){this.data.set(e,{values:t,dtype:r,refCount:i})}numDataIds(){return this.data.numDataIds()}async read(e){return this.readSync(e)}readSync(e){let{dtype:t,complexTensorInfos:n}=this.data.get(e);return t===`complex64`?m_(this.readSync(n.real.dataId),this.readSync(n.imag.dataId)):this.data.get(e).values}bufferSync(e){let t=this.readSync(e.dataId);if(e.dtype===`string`)try{let n=t.map(e=>ri(e));return R(e.shape,e.dtype,n)}catch{throw Error(`Failed to decode encoded string bytes into utf-8`)}return R(e.shape,e.dtype,t)}makeOutput(e,t,n){return ko().makeTensorFromTensorInfo(this.makeTensorInfo(t,n,e),this)}disposeData(e,t=!1){if(this.data.has(e)){if(this.data.get(e).refCount--,!t&&this.data.get(e).refCount>0)return!1;let{complexTensorInfos:n}=this.data.get(e);n!=null&&(this.disposeData(n.real.dataId,!0),this.disposeData(n.imag.dataId,!0)),this.data.delete(e)}return!0}disposeIntermediateTensorInfo(e){this.disposeData(e.dataId)}async time(e){let t=ti();return e(),{kernelMs:ti()-t}}memory(){return{unreliable:!0,reasons:[`The reported memory is an upper bound. Due to automatic garbage collection, the true allocated memory may be less.`]}}where(e){q([e],`where`);let t=this.readSync(e.dataId);return My(e.shape,t)}dispose(){}floatPrecision(){return 32}epsilon(){return super.epsilon()}};Ny.nextDataId=0;
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the License);
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an AS IS BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Py(e){let t=new Float32Array(e.length);for(let n=0;n<e.length;++n)t[n]=Math.abs(e[n]);return t}const Fy={kernelName:`Abs`,backendName:`cpu`,kernelFunc:e=>{let{x:t}=e.inputs,n=e.backend;q(t,`abs`);let r=new Float32Array(p(t.shape)),i=n.data.get(t.dataId).values;return r=Py(i),n.makeOutput(r,t.shape,t.dtype)}};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Iy(e){return(t,n,r,i,a)=>{let o=Go(t,n),s=o.length,c=k(o),l=b(a,p(o)),u=t.length,d=n.length,f=k(t),m=k(n),h=Uo(t,o),g=Uo(n,o);if(h.length+g.length===0)for(let t=0;t<l.length;++t)l[t]=e(r[t%r.length],i[t%i.length]);else for(let t=0;t<l.length;++t){let n=ue(t,s,c),a=n.slice(-u);h.forEach(e=>a[e]=0);let o=le(a,u,f),p=n.slice(-d);g.forEach(e=>p[e]=0);let _=le(p,d,m);l[t]=e(r[o],i[_])}return[l,o]}}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ly(e){let{inputs:t,backend:n}=e,{real:r,imag:i}=t,a=n.data.get(r.dataId).values,o=n.data.get(i.dataId).values,s=n.makeTensorInfo(r.shape,`complex64`),c=n.data.get(s.dataId);return c.complexTensorInfos={real:n.makeTensorInfo(r.shape,`float32`,a),imag:n.makeTensorInfo(i.shape,`float32`,o)},s}const Ry={kernelName:He,backendName:`cpu`,kernelFunc:Ly};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function zy(e,t,n=`float32`){if(n===`complex64`)return Ly({inputs:{real:zy(e,t,`float32`),imag:zy(e,t,`float32`)},backend:e});let r=A(p(t),n);return e.makeTensorInfo(t,n,r)}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function By(e){let{inputs:t,backend:n}=e,{x:r}=t;return n.incRef(r.dataId),{dataId:r.dataId,shape:r.shape,dtype:r.dtype}}const Vy={kernelName:Ct,backendName:`cpu`,kernelFunc:By};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Hy(e){let{inputs:t,backend:n}=e,{input:r}=t,i=n.data.get(r.dataId).complexTensorInfos.real,a=n.data.get(i.dataId).values;return n.makeTensorInfo(i.shape,i.dtype,a)}const Uy={kernelName:on,backendName:`cpu`,kernelFunc:Hy};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Wy(e,t,n,r){if(r===`int32`)return[t,`int32`,Int32Array.from(e)];if(r===`bool`){let r=ei([0],n),[i,a]=Iy((e,t)=>e===t?0:1)(t,[],e,r,`bool`);return[a,`bool`,i]}throw Error(`Error in Cast: failed to cast ${n} to ${r}`)}function Gy(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{dtype:a}=r;if(a===`complex64`){if(i.dtype===`complex64`)return By({inputs:{x:i},backend:n});let e=zy(n,i.shape,i.dtype),t=Gy({inputs:{x:i},backend:n,attrs:{dtype:`float32`}}),r=Ly({inputs:{real:t,imag:e},backend:n});return n.disposeIntermediateTensorInfo(e),n.disposeIntermediateTensorInfo(t),r}if(i.dtype===`complex64`){let e=Hy({inputs:{input:i},backend:n}),t=Gy({inputs:{x:e},backend:n,attrs:{dtype:a}});return n.disposeIntermediateTensorInfo(e),t}if(!w(i.dtype,a)){let e=By({inputs:{x:i},backend:n});return{dataId:e.dataId,shape:e.shape,dtype:a}}let o=n.data.get(i.dataId).values,[s,c,l]=Wy(o,i.shape,i.dtype,a);return n.makeTensorInfo(s,c,l)}const Ky={kernelName:ze,backendName:`cpu`,kernelFunc:Gy};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function qy(e,t,n,r){return n==null?({inputs:n,backend:i})=>{let{a,b:o}=n,s=i;q([a,o],e);let c=s.data.get(a.dataId).values,l=s.data.get(o.dataId).values,u=a.dtype===`string`?U_(c):c,d=a.dtype===`string`?U_(l):l,f=r||a.dtype,[p,m]=t(a.shape,o.shape,u,d,f);return s.makeTensorInfo(m,f,p)}:({inputs:e,backend:i})=>{let{a,b:o}=e,s=i;if(a.dtype===`complex64`||o.dtype===`complex64`){let e=Gy({inputs:{x:a},backend:s,attrs:{dtype:`complex64`}}),t=s.data.get(e.dataId),r=t.complexTensorInfos.real,i=t.complexTensorInfos.imag,c=s.data.get(r.dataId).values,l=s.data.get(i.dataId).values,u=Gy({inputs:{x:o},backend:s,attrs:{dtype:`complex64`}}),d=s.data.get(u.dataId),f=d.complexTensorInfos.real,p=d.complexTensorInfos.imag,m=s.data.get(f.dataId).values,h=s.data.get(p.dataId).values,[g,_,v]=n(a.shape,o.shape,c,l,m,h),y=s.makeTensorInfo(v,`float32`,g),b=s.makeTensorInfo(v,`float32`,_),x=Ly({inputs:{real:y,imag:b},backend:s});return s.disposeIntermediateTensorInfo(e),s.disposeIntermediateTensorInfo(u),s.disposeIntermediateTensorInfo(y),s.disposeIntermediateTensorInfo(b),x}else{let e=s.data.get(a.dataId).values,n=s.data.get(o.dataId).values,i=r||a.dtype,[c,l]=t(a.shape,o.shape,e,n,i);return s.makeTensorInfo(l,i,c)}}}function Jy(e){return(t,n,r,i,a,o)=>{let s=Go(t,n),c=p(s),l=s.length,u=k(s),d=b(`float32`,c),f=b(`float32`,c),m=Uo(t,s),h=Uo(n,s),g=m_(r,i),_=m_(a,o),v=t.length,y=k(t),x=n.length,S=k(n);if(m.length+h.length===0)for(let t=0;t<d.length;t++){let n=t%g.length,r=t%_.length,i=e(g[n*2],g[n*2+1],_[r*2],_[r*2+1]);d[t]=i.real,f[t]=i.imag}else for(let t=0;t<d.length;t++){let n=ue(t,l,u),r=n.slice(-v);m.forEach(e=>r[e]=0);let i=le(r,v,y),a=n.slice(-x);h.forEach(e=>a[e]=0);let o=le(a,x,S),s=e(g[i*2],g[i*2+1],_[o*2],_[o*2+1]);d[t]=s.real,f[t]=s.imag}return[d,f,s]}}const Yy=qy(`Add`,Iy(((e,t)=>e+t)),Jy(((e,t,n,r)=>({real:e+n,imag:t+r})))),Xy={kernelName:`Add`,backendName:`cpu`,kernelFunc:Yy};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Zy(e,t,n,r,i){let a=p(r),o=A(i,n);for(let n=0;n<e.length;n++){let r=e[n];if(r<0)throw Error(`Input x must be non-negative!`);r>=i||(a>0?o[r]+=t[n]:o[r]+=1)}return o}function Qy(e,t,n,r=!1){let i=e.shape[0],a=e.shape[1],o=R([i,n],t.dtype);for(let s=0;s<i;s++)for(let i=0;i<a;i++){let a=e.get(s,i);if(a<0)throw Error(`Input x must be non-negative!`);a>=n||(r?o.set(1,s,a):t.size>0?o.set(o.get(s,a)+t.get(s,i),s,a):o.set(o.get(s,a)+1,s,a))}return o}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function $y(e){return(t,n,r)=>{let i=b(n,t.length);for(let n=0;n<t.length;++n)i[n]=e(t[n],r);return i}}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function J(e,t,n){return({inputs:r,attrs:i,backend:a})=>{let{x:o}=r;if(q(o,e),o.dtype===`string`||n===`string`)throw Error(`unaryKernelFunc does not support string input/output`);let s=a,c=s.data.get(o.dataId).values,l=p(o.shape),u=n||o.dtype,d=x(u,l);for(let e=0;e<l;++e)d[e]=t(c[e],i);return s.makeTensorInfo(o.shape,u,d)}}function eb(e,t,n){return({inputs:r,attrs:i,backend:a})=>{let{x:o}=r;if(q(o,e),o.dtype===`string`||n===`string`)throw Error(`unaryKernelFunc does not support string input/output`);let s=a,c=s.data.get(o.dataId).values,l=n||o.dtype,u=t(c,l,i);return s.makeTensorInfo(o.shape,l,u)}}const tb={kernelName:Be,backendName:`cpu`,kernelFunc:eb(Be,$y(e=>Math.ceil(e)))};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function nb(e,t,n,r){let i=x(n,p(t));if(r&&n!==`string`){let t=0;e.forEach(e=>{let n=p(e.shape);i.set(e.vals,t),t+=n})}else{let r=0;e.forEach(e=>{let a=n===`string`?U_(e.vals):e.vals,o=0;for(let n=0;n<e.shape[0];++n){let s=n*t[1]+r;for(let t=0;t<e.shape[1];++t)i[s+t]=a[o++]}r+=e.shape[1]})}return i}const rb=qy(dt,Iy((e,t)=>e===t?1:0),null,`bool`),ib={kernelName:dt,backendName:`cpu`,kernelFunc:rb},ab=eb(`Exp`,$y(e=>Math.exp(e)),`float32`),ob={kernelName:`Exp`,backendName:`cpu`,kernelFunc:ab},sb={kernelName:pt,backendName:`cpu`,kernelFunc:eb(pt,$y(e=>Math.expm1(e)))},cb={kernelName:gt,backendName:`cpu`,kernelFunc:eb(gt,$y(e=>Math.floor(e)))};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function lb(e,t,n,r,i,a,o,s,c){let l=R([r,a],n);for(let n=0;n<r;n++){let r=[],u=0;for(let t=0;t<i;t++){let a=e[n*i+t];u+=a*o[t],r.push(a)}if(u<0||u>=c/a)throw Error(`Invalid indices: ${r} does not index into ${s}`);for(let e=0;e<a;e++)l.values[n*a+e]=t.get(...t.indexToLoc(u*a+e))}return l}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ub(e,t,n){let r=R(n,e.dtype);for(let n=0;n<r.size;++n){let i=r.indexToLoc(n).slice(),a=i[0],o=i[2],s=t.locToIndex([a,o]);i[2]=t.values[s];let c=e.locToIndex(i);0<=c&&c<e.values.length&&(r.values[n]=e.values[c])}return r}const db={kernelName:xt,backendName:`cpu`,kernelFunc:qy(xt,Iy((e,t)=>e>t?1:0),null,`bool`)},fb={kernelName:St,backendName:`cpu`,kernelFunc:qy(St,Iy((e,t)=>e>=t?1:0),null,`bool`)},pb={kernelName:At,backendName:`cpu`,kernelFunc:qy(At,Iy((e,t)=>e<t?1:0),null,`bool`)},mb={kernelName:jt,backendName:`cpu`,kernelFunc:qy(jt,Iy((e,t)=>e<=t?1:0),null,`bool`)};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function hb(e,t,n){let r=(t-e)/(n-1),i=A(n,`float32`);i[0]=e;for(let e=1;e<i.length;e++)i[e]=i[e-1]+r;return i}const gb={kernelName:`Log`,backendName:`cpu`,kernelFunc:eb(`Log`,$y(e=>Math.log(e)))};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function _b(e,t,n,r){let i=b(r,p(n));for(let n=0;n<i.length;++n){let r=n*t,a=e[r];for(let n=0;n<t;++n){let t=e[r+n];(Number.isNaN(t)||t>a)&&(a=t)}i[n]=a}return i}const vb={kernelName:Lt,backendName:`cpu`,kernelFunc:qy(Lt,Iy(((e,t)=>Math.max(e,t))))},yb={kernelName:Ht,backendName:`cpu`,kernelFunc:qy(Ht,Iy(((e,t)=>Math.min(e,t))))},bb=Iy(((e,t)=>e*t)),xb=qy(Gt,bb,Jy(((e,t,n,r)=>({real:e*n-t*r,imag:e*r+t*n})))),Sb={kernelName:Gt,backendName:`cpu`,kernelFunc:xb};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Cb(e,t,n){return bb([],t,Qr(-1,n),e,n)}function wb(e){let{inputs:t,backend:n}=e,{x:r}=t;q(r,`neg`);let i=n.data.get(r.dataId).values,[a,o]=Cb(i,r.shape,r.dtype);return n.makeTensorInfo(o,r.dtype,a)}const Tb={kernelName:`Neg`,backendName:`cpu`,kernelFunc:wb},Eb={kernelName:Kt,backendName:`cpu`,kernelFunc:qy(Kt,Iy(((e,t)=>e===t?0:1)),null,`bool`)};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Db(e,t,n,r,i){let a=t.length,o=p(t),s=k(t),c=k(i),l=b(n,p(i));for(let t=0;t<o;++t){let n=ue(t,a,s),i=Array(n.length);for(let e=0;e<i.length;e++)i[e]=n[r[e]];let o=le(i,a,c);l[o]=e[t]}return l}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ob(e){let{inputs:t,attrs:n,backend:r}=e,{x:i}=t,{perm:a}=n;q(i,`transpose`);let o=i.shape.length,s=Array(o);for(let e=0;e<s.length;e++)s[e]=i.shape[a[e]];let c=r.data.get(i.dataId).values,l=Db(c,i.shape,i.dtype,a,s);return{dataId:r.write(l,s,i.dtype),shape:s,dtype:i.dtype}}const kb={kernelName:Un,backendName:`cpu`,kernelFunc:Ob};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ab(e,t,n,r){let[i,a]=Hl(e,r),o=ki(t,`int32`),s=A(p(i),o),c=p(a);for(let e=0;e<s.length;++e){let t=e*c,r=1;for(let e=0;e<c;++e)r*=n[t+e];s[e]=r}return{outVals:s,outShape:i,outDtype:o}}function jb(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a,keepDims:o}=r;q(i,`prod`);let s=i.shape.length,c=v(a,i.shape),l=Gl(c,s),u=c,d=i,f=[];l!=null&&(d=Ob({inputs:{x:i},backend:n,attrs:{perm:l}}),f.push(d),u=ql(u.length,s));let p=n.data.get(d.dataId).values,{outVals:m,outShape:h,outDtype:g}=Ab(d.shape,d.dtype,p,u),_=h;return o&&(_=Ul(h,c)),f.forEach(e=>n.disposeIntermediateTensorInfo(e)),n.makeTensorInfo(_,g,m)}const Mb={kernelName:tn,backendName:`cpu`,kernelFunc:jb};
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Nb(e,t,n){e.forEach((e,r)=>{if(e<0||e>=n){let i=ue(r,t.length,k(t)).join(`,`);throw Error(`indices[${i}] = ${e} is not in [0, ${n})`)}})}function Pb(e,t){for(let n=0;n<e.length;++n){let r=e[n],i=n===e.length-1?t:e[n+1].length;if(r.length===0)throw Error(`Ragged splits may not be empty`);if(r[0]<0)throw Error(`Ragged splits must be non-negative`);if(r[r.length-1]>i)throw Error(`Ragged splits must not point past values`);for(let e=1;e<r.length;++e)if(r[e-1]>r[e])throw Error(`Ragged splits must be sorted in ascending order`)}}function Fb(e,t,n,r){let i=[],a=0,o=t.length-1+n.length,s=Array(o).fill(null).map(()=>[0]);Pb(n,r);let c=1;for(let e=0;e<t.length-1;++e){c*=t[e];let n=t[e+1];for(let t=1;t<c+1;++t)s[e].push(t*n)}for(let r=0;r<e.length;++r){let o=e[r],c=e[r]+1;for(let e=0;e<n.length;++e){let r=n[e],i=e+t.length-1;if(i>=0){let e=s[i],t=e[e.length-1]-r[o];for(let e=o;e<c;++e)s[i].push(r[e+1]+t)}o=r[o],c=r[c]}c!==o&&(i.push([o,c]),a+=c-o)}return{outSplits:s,valueSlices:i,numValues:a}}function Ib(e){let t=[];for(let n=0;n<e.length;++n){let r=e[n].length,i=x(`int32`,r);t.push(i),e[n].forEach((e,t)=>i[t]=e)}return t}function Lb(e,t){let n=e.slice(0,t);for(;n.length<t;)n.push(1);for(let r=t;r<e.length;r++)n[t-1]*=e[r];return n}function Rb(e,t,n,r,i,a){let o=Lb(t,2)[1],s=Lb(a,2)[1],c=0;for(let t of n)for(let n=t[0];n<t[1];++n){for(let t=0;t<r;++t)i[c*s+t]=e[n*o+t];++c}}function zb(e,t,n,r,i){let a=t.slice();a[0]=i;let o=x(n,p(a)),s=e.length;return Rb(e,t,r,s===0?0:s/t[0],o,a),[o,a]}function Bb(e,t,n,r,i,a,o,s){if(e.length===0)throw Error(`paramsNestedSplits must be non empty`);if(t[0].length===0)throw Error(`Split tensors must not be scalars`);if(Nb(a,o,t[0][0]-1),r.length===0)throw Error(`params.rank must be nonzero`);let c=r[0],{outSplits:l,valueSlices:u,numValues:d}=Fb(a,o,e,c),f=Ib(l),p=zb(n,r,i,u,d);return[f,p[0],p[1]]}
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Vb=r_,Hb=class e{constructor(e,t,n,r,i,a,o,s,c,l){this.shape=e,this.shapeShape=t,this.values=n,this.valuesShape=r,this.valuesDType=i,this.defaultValue=a,this.defaultValueShape=o,this.rowPartitionValues=s,this.rowPartitionValuesShapes=c,this.rowPartitionTypes=a_(l),this.raggedRank=o_(this.rowPartitionTypes)}getRowPartitionTypeByDimension(e){return this.rowPartitionTypes[0]===Vb.FIRST_DIM_SIZE?this.rowPartitionTypes[e+1]:this.rowPartitionTypes[e]}getRowPartitionTensor(e){return this.rowPartitionTypes[0]===Vb.FIRST_DIM_SIZE?this.rowPartitionValues[e+1]:this.rowPartitionValues[e]}getMaxWidth(t){let n=this.getRowPartitionTensor(t-1);switch(this.getRowPartitionTypeByDimension(t-1)){case Vb.VALUE_ROWIDS:return e.getMaxWidthValueRowID(n);case Vb.ROW_SPLITS:return e.getMaxWidthRowSplit(n);default:throw Error(`Cannot handle partition type ${Vb[this.getRowPartitionTypeByDimension(t-1)]}`)}}static getMaxWidthRowSplit(e){let t=e.length;if(t===0||t===1)return 0;let n=0;for(let r=0;r<t-1;++r){let t=e[r+1]-e[r];t>n&&(n=t)}return n}static getMaxWidthValueRowID(e){let t=e.length;if(t===0)return 0;let n=0,r=e[0],i=0;for(let a=1;a<t;++a){let t=e[a];t!==r&&(r=t,i=Math.max(a-n,i),n=a)}return Math.max(t-n,i)}tensorShapeFromTensor(e,t,n=!0){if(t.length===0){if(e[0]===-1)return[];throw Error(`The only valid scalar shape tensor is the fully unknown shape specified as -1.`)}return Wb(e,n)}calculateOutputSize(e){let t=this.valuesShape,n=this.defaultValueShape;s_(n,t);let r=this.tensorShapeFromTensor(this.shape,this.shapeShape),i=i_(this.raggedRank,r,t);i[0]<0&&(i[0]=e);for(let e=1;e<=this.raggedRank;++e)i[e]<0&&(i[e]=this.getMaxWidth(e));return i}calculateFirstParentOutputIndex(e,t,n){let r=Math.min(e,n),i=[],a=0;for(let e=0;e<r;++e,a+=t)i.push(a);for(let t=r;t<e;++t)i.push(-1);return l(i.length===e,()=>`Final length of result must be equal to firstDimension.`),i}calculateOutputIndexRowSplit(e,t,n,r){let i=e.length,a=[];for(let o=0;o<i-1;++o){let i=e[o+1]-e[o],s=Math.min(r,i),c=t[o];c===-1&&(s=0);for(let e=0;e<s;++e)a.push(c),c+=n;for(let e=0;e<i-s;++e)a.push(-1)}if(i>0&&a.length!==e[i-1])throw Error(`Invalid row split size.`);return a}calculateOutputIndexValueRowID(e,t,n,r){let i=e.length,a=[];if(i===0)return[];let o=0,s=e[0];if(s>=t.length)throw Error(`Got currentValueRowId=${s}, which is not less than ${t.length}`);let c=t[s];a.push(c);for(let l=1;l<i;++l){let i=e[l];if(i===s)c>=0&&(++o,o<r?c+=n:c=-1);else{if(o=0,s=i,i>=t.length)throw Error(`Got nextValueRowId=${i} which is not less than ${t.length}`);c=t[i]}a.push(c)}if(a.length!==e.length)throw Error(`Invalid row ids.`);return a}calculateOutputIndex(e,t,n,r){let i=this.getRowPartitionTensor(e),a=this.getRowPartitionTypeByDimension(e);switch(a){case Vb.VALUE_ROWIDS:return this.calculateOutputIndexValueRowID(i,t,n,r);case Vb.ROW_SPLITS:if(i.length-1>t.length)throw Error(`Row partition size is greater than output size: ${i.length-1} > ${t.length}`);return this.calculateOutputIndexRowSplit(i,t,n,r);default:throw Error(`Unsupported partition type: ${Vb[a]}`)}}getFirstDimensionSize(){let e=this.rowPartitionValues[0];if(this.rowPartitionTypes.length===0)throw Error(`No row_partition_types given.`);let t=this.rowPartitionTypes[0];switch(t){case Vb.FIRST_DIM_SIZE:return e[0];case Vb.VALUE_ROWIDS:throw Error(`Cannot handle VALUE_ROWIDS in first dimension.`);case Vb.ROW_SPLITS:return this.rowPartitionValuesShapes[0][0]-1;default:throw Error(`Cannot handle type ${Vb[t]}`)}}compute(){if(this.rowPartitionValues[0].length<=0)throw Error(`Invalid first partition input. Tensor requires at least one element.`);let e=this.getFirstDimensionSize(),t=this.calculateOutputSize(e),n=Array(this.raggedRank+1);n[n.length-1]=1;for(let e=n.length-2;e>=0;--e)n[e]=n[e+1]*t[e+1];let r=Wb(t,!1),i=x(this.valuesDType,p(r));if(n[0]*t[0]>0){let a=this.calculateFirstParentOutputIndex(e,n[0],t[0]);for(let e=1;e<=this.raggedRank;++e)a=this.calculateOutputIndex(e-1,a,n[e],t[e]);this.setOutput(this.raggedRank,a,i,r)}return[r,i]}setOutput(e,t,n,r){if(n.length===0)return;let i=this.values,a=n,o=r.slice();o=o.slice(e+1);let s=p(o),c=t.length,l=this.defaultValue;if(l.length!==s&&l.length!==1){let e=this.defaultValueShape;Ao(()=>{l=Mc(V(l,e),o).dataSync()})}let u=0,d=0,f=0;for(let e=0;e<=c;++e){let r=e<c?t[e]:-1;if(r===f){++f;continue}if(d<f){let e=i.subarray(u*s);Ub(a.subarray(d*s),e,(f-d)*s)}if(e>=c){let e=n.length;r=Math.floor(e/s)}if(r>f)if(this.defaultValue.length===1)a.subarray(f*s,r*s).fill(this.defaultValue[0]),f=r;else for(;r>f;)Ub(a.slice(f*s),l,s),++f;r<0?(u=e+1,d=f):(u=e,d=f,f=d+1)}}};function Ub(e,t,n){for(let r=0;r<n;r++)e[r]=t[r]}function Wb(e,t){let n=[];for(let r of e){if(r<0){if(!t)throw Error(`Dimension ${r} must be >= 0`);if(r<-1)throw Error(`Dimension ${r} must be >= -1`);r=-1}n.push(r)}return n}function Gb(e,t,n,r,i,a,o,s,c,l){return new Hb(e,t,n,r,i,a,o,s,c,l).compute()}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Kb(e,t,n,r){if(e===t||e<t&&n<0||t<e&&n>1)return A(0,r);let i=A(Math.abs(Math.ceil((t-e)/n)),r);t<e&&n===1&&(n=-1),i[0]=e;for(let e=1;e<i.length;e++)i[e]=i[e-1]+n;return i}const qb={kernelName:hn,backendName:`cpu`,kernelFunc:eb(hn,$y(e=>1/Math.sqrt(e)))};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Jb(e,t,n,r,i,a,o,s,c,l){let u=[r/i,i],d=e.values,f=t.values;if(r===0)return R(n,t.dtype);let p=R(u,t.dtype);typeof c==`string`||typeof c==`number`?p.values.fill(c):typeof c==`boolean`&&p.values.fill(+c);for(let e=0;e<a;e++){let a=[],c=0;for(let t=0;t<o;t++){let n=d[e*o+t];a.push(n),c+=n*s[t]}if(c<0||c>=r/i)throw Error(`Invalid indices: ${a} does not index into ${n}`);for(let n=0;n<i;n++)l?p.values[c*i+n]+=f[e*i+n]:p.values[c*i+n]=t.rank===0?f[0]:f[e*i+n]}return p}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the License);
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an AS IS BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const Yb=J(Cn,e=>1/(1+Math.exp(-e))),Xb={kernelName:Cn,backendName:`cpu`,kernelFunc:Yb};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Zb(e,t,n,r,i){let a=$o(r,t,n),o=p(n),s=k(r);if(a){let n=es(t,s);return i===`string`?e.slice(n,n+o):e.subarray(n,n+o)}let c=R(r,i,i===`string`?U_(e):e),l=R(n,i);for(let e=0;e<l.size;++e){let n=l.indexToLoc(e),r=n.map((e,n)=>e+t[n]);l.set(c.get(...r),...n)}return i===`string`?W_(l.values):l.values}function Qb(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{begin:a,size:o}=r;q(i,`slice`);let[s,c]=ts(i,a,o);Zo(i,s,c);let l=n.data.get(i.dataId).values,u=Zb(l,s,c,i.shape,i.dtype);return n.makeTensorInfo(c,i.dtype,u)}const $b={kernelName:bn,backendName:`cpu`,kernelFunc:Qb};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ex(e,t,n,r,i,a,o){let s=t[0],c=a[0],l=Array(c),u=Array(s),d=t[1];if(c===0){if(s!==0)throw Error(A_(s));let e=x(n,0),t=x(i,0);return[e,[0,d],t,l,u]}let f=!0,p=0,m=Array(c).fill(0);for(let t=0;t<s;++t){let n=e[t*d];if(n<0)throw Error(j_(t,n));if(n>=c)throw Error(M_(t,n,c));++m[n],f&&=n>=p,p=n}let h=!0;for(let e=0;e<c;++e){let t=m[e]===0;l[e]=t,h&&=!t,m[e]=Math.max(m[e],1),e>0&&(m[e]+=m[e-1])}if(h&&f){let t=e,n=r;for(let e=0;e<s;++e)u[e]=e;return[t,[s,d],n,l,u]}else{let t=m[c-1],a=x(n,t*d),f=x(i,t),p=Array(c).fill(0);for(let t=0;t<s;++t){let n=e[t*d],i=p[n],o=(n===0?0:m[n-1])+i;p[n]++;for(let n=0;n<d;++n)a[o*d+n]=e[t*d+n];f[o]=r[t],u[t]=o}for(let e=0;e<c;++e)if(p[e]===0){let t=e===0?0:m[e-1];a[t*d+0]=e;for(let e=1;e<d;++e)a[t*d+e]=0;f[t]=o}return[a,[t,d],f,l,u]}}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function tx(e,t,n,r,i){let a=p(r),o=t[0],s=i.length,c=[],l=1,u=-1;for(let e=0;e<s;++e){let t=i[e];if(t===-1){if(u!==-1)throw Error(N_(u,e));u=e,c.push(1)}else{if(t<0)throw Error(P_(e,t));l*=t,c.push(t)}}if(u!==-1){if(l<=0)throw Error(F_());let e=Math.trunc(a/l);if(l*e!==a)throw Error(I_(r,c));c[u]=e}if(p(c)!==a)throw Error(L_(r,c));let d=r.length,f=[];if(d>0){f[d-1]=1;for(let e=d-2;e>=0;--e)f[e]=f[e+1]*r[e+1]}let m=[];if(s>0){m[s-1]=1;for(let e=s-2;e>=0;--e)m[e]=m[e+1]*c[e+1]}let h=x(n,o*s);for(let t=0;t<o;++t){let n=0;for(let r=0;r<d;++r)n+=e[t*d+r]*f[r];for(let e=0;e<s;++e)h[t*s+e]=Math.trunc(n/m[e]),n%=m[e]}return[h,[o,s],c]}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function nx(e,t,n,r,i,a=!1,o=0){let s=r.length,c=[t[0],e.length/t[0]],l=c[1],u=s>0?i[s-1]+1:0;if(u<0)throw Error(R_());let d=t.slice();d[0]=u;let f=x(n,d.reduce((e,t)=>e*t,1));if(s===0)return u>0&&f.fill(o),[f,d];if(u<=0)throw Error(R_());let p=0,m=1,h=0,g=i[p];for(;;){let t=0;if(m<s){if(t=i[m],g===t){++m;continue}if(g>=t)throw Error(z_())}if(g<0||g>=u)throw Error(B_(g,u));g>h&&f.fill(o,h*l,g*l);for(let t=p;t<m;++t){let n=r[t];if(n<0||n>=c[0])throw Error(V_(t,r[t],c[0]));for(let t=0;t<l;t++)f[g*l+t]+=e[n*l+t]}if(a)for(let e=0;e<l;e++)f[g*l+e]/=m-p;if(p=m,++m,h=g+1,g=t,m>s)break}return h<u&&f.fill(o,h*l,u*l),[f,d]}const rx={kernelName:Tn,backendName:`cpu`,kernelFunc:J(Tn,e=>Math.sqrt(e))},ix={kernelName:Pn,backendName:`cpu`,kernelFunc:qy(Pn,Iy(((e,t)=>{let n=e-t;return n*n})))};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ax(e,t,n,r){let i=R(e,t.dtype);for(let e=0;e<i.size;e++){let a=i.indexToLoc(e),o=Array(a.length);for(let e=0;e<o.length;e++)o[e]=a[e]*n[e]+r[e];i.set(t.get(...o),...a)}return i}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var ox=class{constructor(e,t,n,r,i,a){this.separator=ni(e),this.nGramWidths=t,this.leftPad=ni(n),this.rightPad=ni(r),this.padWidth=i,this.preserveShort=a}getPadWidth(e){return Math.min(this.padWidth<0?e-1:this.padWidth,e-1)}getNumNGrams(e,t){let n=this.getPadWidth(t);return Math.max(0,e+2*n-t+1)}createNGrams(e,t,n,r,i,a){for(let o=0;o<i;++o){let s=this.getPadWidth(a),c=Math.max(0,s-o),l=Math.max(0,s-(i-(o+1))),u=a-(c+l),d=t+(c>0?0:o-s),f=0;f+=c*this.leftPad.length;for(let t=0;t<u;++t)f+=e[d+t].length;f+=l*this.rightPad.length;let p=c+l+u-1;f+=p*this.separator.length,n[r+o]=new Uint8Array(f);let m=n[r+o],h=0,g=e=>e.forEach(e=>m[h++]=e);for(let e=0;e<c;++e)g(this.leftPad),g(this.separator);for(let t=0;t<u-1;++t)g(e[d+t]),g(this.separator);if(u>0){g(e[d+u-1]);for(let e=0;e<l;++e)g(this.separator),g(this.rightPad)}else{for(let e=0;e<l-1;++e)g(this.rightPad),g(this.separator);g(this.rightPad)}}}compute(e,t){let n=e.length,r=t.length;if(r>0){let e=t[0];if(e!==0)throw Error(`First split value must be 0, got ${e}`);for(let i=1;i<r;++i){let r=t[i]>=e;if(r&&=t[i]<=n,!r)throw Error(`Invalid split value ${t[i]}, must be in [${e}, ${n}]`);e=t[i]}if(e!==n)throw Error(`Last split value must be data size. Expected ${n}, got ${e}`)}let i=r-1,a=x(`int32`,r);if(n===0||r===0){let e=Array(n);for(let e=0;e<=i;++e)a[e]=0;return[e,a]}a[0]=0;for(let e=1;e<=i;++e){let n=t[e]-t[e-1],r=0;this.nGramWidths.forEach(e=>{r+=this.getNumNGrams(n,e)}),this.preserveShort&&n>0&&r===0&&(r=1),a[e]=a[e-1]+r}let o=Array(a[i]);for(let n=0;n<i;++n){let r=t[n],i=a[n];if(this.nGramWidths.forEach(a=>{let s=t[n+1]-t[n],c=this.getNumNGrams(s,a);this.createNGrams(e,r,o,i,c,a),i+=c}),this.preserveShort&&i===a[n]){let a=t[n+1]-t[n];if(a===0)continue;let s=a+2*this.padWidth;this.createNGrams(e,r,o,i,1,s)}}return[o,a]}};function sx(e,t,n,r,i,a,o,s){return new ox(n,r,i,a,o,s).compute(e,t)}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function cx(e,t,n,r){if(!e.length)return;if(t.length===0){for(let t=0;t<e.length;++t)r.push(e.subarray(t,t+1));return}if(t.length===1){let i=t[0],a=e.indexOf(i);for(;a!==-1;){let t=e.subarray(0,a);(!n||t.length!==0)&&r.push(t),e=e.subarray(a+1),a=e.indexOf(i)}(!n||e.length!==0)&&r.push(e);return}let i=0;for(let a=0;a<e.length+1;a++)if(a===e.length||t.indexOf(e[a])!==-1){let t=e.subarray(i,a);(!n||t.length!==0)&&r.push(t),i=a+1}}function lx(e,t,n){let r=e.length,i=[],a=0,o=0,s=Array(r);for(let c=0;c<r;++c){let r=i.length;cx(e[c],t,n,i);let l=i.length-r;s[c]=l,a+=l,o=Math.max(o,l)}let c=x(`int32`,a*2),l=Array(a),u=[r,o],d=0;for(let e=0;e<r;++e)for(let t=0;t<s[e];++t)c[d*2]=e,c[d*2+1]=t,l[d]=i[d],++d;return[c,l,u]}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ux(e,t){let n=x(`int32`,e.length);for(let r=0;r<e.length;++r)n[r]=Zr(e[r]).modulo(t).getLowBitsUnsigned();return n}const dx=qy(`Sub`,Iy(((e,t)=>e-t)),Jy(((e,t,n,r)=>({real:e-n,imag:t-r})))),fx={kernelName:`Sub`,backendName:`cpu`,kernelFunc:dx};
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function px(e,t){let n=Array(e.rank);for(let r=0;r<n.length;r++)n[r]=e.shape[r]*t[r];let r=R(n,e.dtype);for(let t=0;t<r.values.length;++t){let n=r.indexToLoc(t),i=Array(e.rank);for(let t=0;t<i.length;t++)i[t]=n[t]%e.shape[t];let a=e.locToIndex(i);r.values[t]=e.values[a]}return r}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const mx=(e,t)=>{let n=t.value-e.value;return n===0?e.index-t.index:n};function hx(e,t,n=0,r=e.length-1){for(;r>n;){if(r-n>600){let i=r-n+1,a=t-n+1,o=Math.log(i),s=.5*Math.exp(2*o/3),c=.5*Math.sqrt(o*s*(i-s)/i)*Math.sign(a-i/2);hx(e,t,Math.max(n,Math.floor(t-a*s/i+c)),Math.min(r,Math.floor(t+(i-a)*s/i+c)))}let i=e[t],a=n,o=r;for(c(e,n,t),mx(e[r],i)>0&&c(e,n,r);a<o;){for(c(e,a,o),a++,o--;mx(e[a],i)<0;)a+=1;for(;mx(e[o],i)>0;)--o}mx(e[n],i)===0?c(e,n,o):(o+=1,c(e,o,r)),o<=t&&(n=o+1),t<=o&&(r=o-1)}}function gx(e,t,n,r,i){let a=t[t.length-1],[o,s]=[e.length/a,a],c=b(n,o*r),l=b(`int32`,o*r);for(let t=0;t<o;t++){let n=t*s,a=e.subarray(n,n+s),o=Array(a.length);a.forEach((e,t)=>o[t]={value:e,index:t}),r<o.length&&(hx(o,r),o=o.slice(0,r)),i&&o.sort(mx);let u=t*r,d=c.subarray(u,u+r),f=l.subarray(u,u+r);for(let e=0;e<r;e++)d[e]=o[e].value,f[e]=o[e].index}let u=t.slice();return u[u.length-1]=r,[R(u,n,c),R(u,`int32`,l)]}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function _x(e,t,n,r){let i=v(t,n)[0],a=[1,n[0],1];for(let e=0;e<i;e++)a[0]*=n[e];a[1]=n[i];for(let e=i+1;e<n.length;e++)a[2]*=n[e];let o={},s=new Int32Array(n[i]),c=new hi(a,r,e),l=[],u=a[0]===1&&a[2]===1;for(let t=0;t<n[i];t++){let n;if(u)n=e[t].toString();else{let e=[];for(let n=0;n<a[0];n++)for(let r=0;r<a[2];r++)e.push(c.get(n,t,r));n=e.join(`,`)}if(o[n]!==void 0)s[t]=o[n];else{let e=Object.keys(o).length;o[n]=e,s[t]=e,l.push(t)}}let d=a.slice();d[1]=Object.keys(o).length;let f=new hi(d,r);l.forEach((e,t)=>{for(let n=0;n<a[0];n++)for(let r=0;r<a[2];r++)f.set(c.get(n,e,r),n,t,r)});let p=n.slice();return p[i]=d[1],{outputValues:f.values,outputShape:p,indices:s}}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
Po(`cpu`,()=>new Ny,1);
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the License);
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an AS IS BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const vx=J(`Elu`,e=>e>=0?e:Math.exp(e)-1),yx={kernelName:`Elu`,backendName:`cpu`,kernelFunc:vx};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function bx(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{alpha:a}=r;q([i],`leakyRelu`);let o=p(i.shape),s=n.data.get(i.dataId).values,c=b(`float32`,o);for(let e=0;e<s.length;e++)c[e]=s[e]<0?a*s[e]:s[e];return n.makeTensorInfo(i.shape,`float32`,c)}const xx={kernelName:kt,backendName:`cpu`,kernelFunc:bx},Sx=Iy((e,t)=>e<0?t*e:e);function Cx(e){let{inputs:t,backend:n}=e,{x:r,alpha:i}=t;q([r,i],`prelu`);let a=n.data.get(r.dataId).values,o=n.data.get(i.dataId).values,[s,c]=Sx(r.shape,i.shape,a,o,`float32`);return n.makeTensorInfo(c,`float32`,s)}const wx={kernelName:en,backendName:`cpu`,kernelFunc:Cx},Tx=J(cn,e=>Math.max(0,e)),Ex={kernelName:cn,backendName:`cpu`,kernelFunc:Tx},Dx=J(fn,e=>Math.min(Math.max(0,e),6)),Ox={kernelName:fn,backendName:`cpu`,kernelFunc:Dx};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function kx(e,t,n,r,i){if(n===`linear`)return By({inputs:{x:t},backend:e});if(n===`relu`)return Tx({inputs:{x:t},backend:e});if(n===`elu`)return vx({inputs:{x:t},backend:e});if(n===`relu6`)return Dx({inputs:{x:t},backend:e});if(n===`prelu`)return Cx({inputs:{x:t,alpha:r},backend:e});if(n===`leakyrelu`)return bx({inputs:{x:t},backend:e,attrs:{alpha:i}});if(n===`sigmoid`)return Yb({inputs:{x:t},backend:e});throw Error(`Activation ${n} has not been implemented for the CPU backend.`)}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Y(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{shape:a}=r,o=p(i.shape),s=_(a,o),c=p(s);l(o===c,()=>`The new shape (${s}) has ${c} elements and the old shape (${i.shape}) has ${o} elements. The new shape and old shape must have the same number of elements.`),n.incRef(i.dataId);let u=n.data.get(i.dataId);if(u.complexTensorInfos!=null){let e=u.complexTensorInfos.real,t=u.complexTensorInfos.imag;e.shape=s,t.shape=s}return{dataId:i.dataId,shape:s,dtype:i.dtype}}const Ax={kernelName:ln,backendName:`cpu`,kernelFunc:Y};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the License);
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an AS IS BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function jx(e){let{inputs:t,backend:n,attrs:r}=e,{a:i,b:a}=t,{transposeA:o,transposeB:s}=r;q([i,a],`matMul`);let c=i.shape.length,u=a.shape.length,d=o?i.shape[c-2]:i.shape[c-1],f=s?a.shape[u-1]:a.shape[u-2],m=o?i.shape[c-1]:i.shape[c-2],h=s?a.shape[u-2]:a.shape[u-1],g=i.shape.slice(0,-2),_=a.shape.slice(0,-2),v=p(g),y=p(_),b=Go(i.shape.slice(0,-2),a.shape.slice(0,-2)).concat([m,h]);l(d===f,()=>`Error in matMul: inner shapes (${d}) and (${f}) of Tensors with shapes ${i.shape} and ${a.shape} and transposeA=${o} and transposeB=${s} must match.`);let x=o?[v,d,m]:[v,m,d],S=s?[y,h,f]:[y,f,h],C=Y({inputs:{x:i},backend:n,attrs:{shape:x}}),w=Y({inputs:{x:a},backend:n,attrs:{shape:S}}),T=o?C.shape[1]:C.shape[2],E=o?C.shape[2]:C.shape[1],D=s?w.shape[1]:w.shape[2],O=Math.max(v,y),ee=n.data.get(C.dataId).values,te=n.data.get(w.dataId).values,ne=k(C.shape),re=k(w.shape),[ie,ae,oe]=o?[ne[0],1,ne[1]]:[ne[0],ne[1],1],[A,se,ce]=s?[1,re[1],re[0]]:[re[1],1,re[0]],le=E*D,ue=R([O,E,D],C.dtype),de=ue.values,fe=n.blockSize;for(let e=0;e<O;e++)for(let t=0;t<E;t+=fe)for(let n=0;n<D;n+=fe)for(let r=0;r<T;r+=fe){let i=Math.min(t+fe,E),a=Math.min(n+fe,D),o=Math.min(r+fe,T);for(let s=t;s<i;s++)for(let t=n;t<a;t++){let n=0;for(let i=r;i<o;i++){let r=Math.min(e,v-1)*ie,a=Math.min(e,y-1)*ce,o=ee[r+s*ae+i*oe],c=te[i*A+t*se+a];n+=o*c}de[e*le+(s*D+t)]+=n}}return n.disposeIntermediateTensorInfo(C),n.disposeIntermediateTensorInfo(w),n.makeTensorInfo(b,ue.dtype,ue.values)}const Mx={kernelName:Fe,backendName:`cpu`,kernelFunc:jx};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the License);
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an AS IS BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Nx(e){let{inputs:t,backend:n,attrs:r}=e,{a:i,b:a,bias:o,preluActivationWeights:s}=t,{transposeA:c,transposeB:l,activation:u,leakyreluAlpha:d}=r,f,p,m,h=[];f=jx({inputs:{a:i,b:a},attrs:{transposeA:c,transposeB:l},backend:n}),o&&(p=Yy({inputs:{a:f,b:o},backend:n}),h.push(f),f=p),u&&(m=kx(n,f,u,s,d),h.push(f),f=m);for(let e of h)n.disposeIntermediateTensorInfo(e);return f}const Px={kernelName:Xn,backendName:`cpu`,kernelFunc:Nx},Fx={kernelName:Ce,backendName:`cpu`,kernelFunc:J(Ce,e=>Math.acos(e))},Ix={kernelName:we,backendName:`cpu`,kernelFunc:J(we,e=>Math.acosh(e))};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Lx(e){let{inputs:t,backend:n}=e,r=t;q(t,`addN`);let i=r.map(e=>n.data.get(e.dataId).values),a=R(r[0].shape,r[0].dtype),o=a.values;for(let e=0;e<r.length;e++){let t=i[e];for(let e=0;e<o.length;e++)o[e]+=t[e]}return n.makeTensorInfo(a.shape,a.dtype,a.values)}const Rx={kernelName:Te,backendName:`cpu`,kernelFunc:Lx};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function zx(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a,keepDims:o}=r;q(i,`all`);let s=v(a,i.shape),c=s,l=Gl(c,i.shape.length),u=i;l!=null&&(u=Ob({inputs:{x:i},backend:n,attrs:{perm:l}}),c=ql(c.length,i.shape.length)),Wl(`all`,c,u.shape.length);let[d,f]=Hl(u.shape,c),m=p(f),h=A(p(d),u.dtype),g=n.data.get(u.dataId).values;for(let e=0;e<h.length;++e){let t=e*m,n=g[t];for(let e=0;e<m;++e){let r=g[t+e];n&&=r}h[e]=n}l!=null&&n.disposeIntermediateTensorInfo(u);let _=n.makeTensorInfo(d,u.dtype,h);if(o){let e=Ul(d,s),t=Y({inputs:{x:_},backend:n,attrs:{shape:e}});return n.disposeIntermediateTensorInfo(_),t}return _}const Bx={kernelName:`All`,backendName:`cpu`,kernelFunc:zx};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Vx(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a,keepDims:o}=r;q(i,`any`);let s=v(a,i.shape),c=s,l=Gl(c,i.shape.length),u=i;l!=null&&(u=Ob({inputs:{x:i},backend:n,attrs:{perm:l}}),c=ql(c.length,i.shape.length)),Wl(`any`,c,u.shape.length);let[d,f]=Hl(u.shape,c),m=p(f),h=A(p(d),u.dtype),g=n.data.get(u.dataId).values;for(let e=0;e<h.length;++e){let t=e*m,n=g[t];for(let e=0;e<m;++e){let r=g[t+e];n||=r}h[e]=n}l!=null&&n.disposeIntermediateTensorInfo(u);let _=n.makeTensorInfo(d,u.dtype,h);if(o){let e=Ul(d,s),t=Y({inputs:{x:_},backend:n,attrs:{shape:e}});return n.disposeIntermediateTensorInfo(_),t}return _}const Hx={kernelName:`Any`,backendName:`cpu`,kernelFunc:Vx};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ux(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a}=r;q(i,`argMax`);let o=v(a,i.shape),s=Gl(o,i.shape.length),c=i,l=[];s!=null&&(c=Ob({inputs:{x:i},backend:n,attrs:{perm:s}}),l.push(c),o=ql(o.length,c.shape.length)),o=[o[0]],Wl(`argMax`,o,c.shape.length);let[u,d]=Hl(c.shape,o),f=A(p(u),`int32`),m=p(d),h=n.data.get(c.dataId).values;for(let e=0;e<f.length;++e){let t=e*m,n=h[t],r=0;for(let e=0;e<m;++e){let i=h[t+e];i>n&&(n=i,r=e)}f[e]=r}return l.forEach(e=>n.disposeIntermediateTensorInfo(e)),n.makeTensorInfo(u,`int32`,f)}const Wx={kernelName:Ee,backendName:`cpu`,kernelFunc:Ux};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Gx(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a}=r;q(i,`argMin`);let o=v(a,i.shape),s=Gl(o,i.shape.length),c=i,l=[];s!=null&&(c=Ob({inputs:{x:i},backend:n,attrs:{perm:s}}),l.push(c),o=ql(o.length,c.shape.length)),o=[o[0]],Wl(`argMin`,o,c.shape.length);let[u,d]=Hl(c.shape,o),f=A(p(u),`int32`),m=p(d),h=n.data.get(c.dataId).values;for(let e=0;e<f.length;++e){let t=e*m,n=h[t],r=0;for(let e=0;e<m;++e){let i=h[t+e];i<n&&(n=i,r=e)}f[e]=r}return l.forEach(e=>n.disposeIntermediateTensorInfo(e)),n.makeTensorInfo(u,`int32`,f)}const Kx={kernelName:De,backendName:`cpu`,kernelFunc:Gx},qx={kernelName:Oe,backendName:`cpu`,kernelFunc:J(Oe,e=>Math.asin(e))},Jx={kernelName:ke,backendName:`cpu`,kernelFunc:J(ke,e=>Math.asinh(e))},Yx={kernelName:Ae,backendName:`cpu`,kernelFunc:J(Ae,e=>Math.atan(e))},Xx={kernelName:Me,backendName:`cpu`,kernelFunc:qy(Me,Iy((e,t)=>Math.atan2(e,t)))},Zx={kernelName:je,backendName:`cpu`,kernelFunc:J(je,e=>Math.atanh(e))};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Qx(e,t,n,r,i,a){let o=i.strideHeight,s=i.strideWidth,c=i.dilationHeight,l=i.dilationWidth,u=i.effectiveFilterHeight,d=i.effectiveFilterWidth,f=i.padInfo.top,p=i.padInfo.left,m=a===`max`?-1/0:1/0,h=R(i.outShape,n),g=h.values,_=i.outShape[1]*i.outShape[2]*i.outShape[3],v=i.outShape[2]*i.outShape[3],y=i.outShape[3];for(let t=0;t<i.batchSize;++t){let n=t*_,h=t*r[0];for(let t=0;t<i.inChannels;++t)for(let _=0;_<i.outHeight;++_){let b=_*o-f,x=Math.max(0,b),S=Math.min(i.inHeight,u+b),C=n+_*v;for(let n=0;n<i.outWidth;++n){let o=n*s-p,u=Math.max(0,o),f=Math.min(i.inWidth,d+o),_=m,v=0,b=0;for(let n=x;n<S;n+=c){let i=h+n*r[1];for(let n=u;n<f;n+=l){let o=e[i+n*r[2]+t];a===`max`&&o>_?_=o:a===`avg`&&(v+=o,b++)}if(isNaN(_))break}let w=C+n*y+t;g[w]=a===`avg`?v/b:_}}}return h}function $x(e,t,n,r,i=!1,a=!1){let o=R(r.outShape,`int32`),s=r.strideHeight,c=r.strideWidth,l=r.dilationHeight,u=r.dilationWidth,d=r.effectiveFilterHeight,f=r.effectiveFilterWidth,p=r.padInfo.top,m=r.padInfo.left,h=R(t,n,e);for(let e=0;e<r.batchSize;++e)for(let t=0;t<r.inChannels;++t)for(let n=0;n<r.outHeight;++n){let g=n*s-p,_=g;for(;_<0;)_+=l;let v=Math.min(r.inHeight,d+g);for(let s=0;s<r.outWidth;++s){let d=s*c-m,p=d;for(;p<0;)p+=u;let y=Math.min(r.inWidth,f+d),b=-1/0,x=-1;for(let n=_;n<v;n+=l){let o=n-g;for(let s=p;s<y;s+=u){let c=s-d,l=h.get(e,n,s,t);l>b&&(b=l,x=i?a?((e*r.inHeight+n)*r.inWidth+s)*r.inChannels+t:(n*r.inWidth+s)*r.inChannels+t:o*f+c)}}o.set(x,e,n,s,t)}}return o}function eS(e,t,n,r,i,a){let o=i.strideDepth,s=i.strideHeight,c=i.strideWidth,l=i.dilationDepth,u=i.dilationHeight,d=i.dilationWidth,f=i.effectiveFilterDepth,p=i.effectiveFilterHeight,m=i.effectiveFilterWidth,h=i.padInfo.front,g=i.padInfo.top,_=i.padInfo.left,v=a===`max`?-1/0:1/0,y=R(i.outShape,n),b=y.values,x=i.outShape[1]*i.outShape[2]*i.outShape[3]*i.outShape[4],S=i.outShape[2]*i.outShape[3]*i.outShape[4],C=i.outShape[3]*i.outShape[4],w=i.outShape[4];for(let t=0;t<i.batchSize;++t){let n=t*x,y=t*r[0];for(let t=0;t<i.inChannels;++t)for(let x=0;x<i.outDepth;++x){let T=x*o-h,E=T;for(;E<0;)E+=l;let D=Math.min(i.inDepth,f+T),O=n+x*S;for(let n=0;n<i.outHeight;++n){let o=n*s-g,f=o;for(;f<0;)f+=u;let h=Math.min(i.inHeight,p+o),x=O+n*C;for(let n=0;n<i.outWidth;++n){let o=n*c-_,s=o;for(;s<0;)s+=d;let p=Math.min(i.inWidth,m+o),g=x+n*w,S=v,C=0,T=0;for(let n=E;n<D;n+=l){let i=y+n*r[1];for(let n=f;n<h;n+=u){let o=i+n*r[2];for(let n=s;n<p;n+=d){let i=e[o+n*r[3]+t];if(a===`max`&&i>S?S=i:a===`avg`&&(C+=i,T++),isNaN(S))break}if(isNaN(S))break}if(isNaN(S))break}let O=g+t;b[O]=a===`avg`?C/T:S}}}}return y}function tS(e,t){let n=R(t.outShape,`int32`),r=t.strideDepth,i=t.strideHeight,a=t.strideWidth,o=t.dilationDepth,s=t.dilationHeight,c=t.dilationWidth,l=t.effectiveFilterDepth,u=t.effectiveFilterHeight,d=t.effectiveFilterWidth,f=t.padInfo.front,p=t.padInfo.top,m=t.padInfo.left;for(let h=0;h<t.batchSize;++h)for(let g=0;g<t.inChannels;++g)for(let _=0;_<t.outDepth;++_){let v=_*r-f,y=v;for(;y<0;)y+=o;let b=Math.min(t.inDepth,l+v);for(let r=0;r<t.outHeight;++r){let l=r*i-p,f=l;for(;f<0;)f+=s;let x=Math.min(t.inHeight,u+l);for(let i=0;i<t.outWidth;++i){let p=i*a-m,S=p;for(;S<0;)S+=c;let C=Math.min(t.inWidth,d+p),w=-1/0,T=-1;for(let t=y;t<b;t+=o){let n=t-v;for(let r=f;r<x;r+=s){let i=r-l;for(let a=S;a<C;a+=c){let o=a-p,s=e.get(h,t,r,a,g);s>=w&&(w=s,T=n*u*d+i*u+o)}}}n.set(T,h,_,r,i,g)}}}return n}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function nS(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t;q(i,`avgPool`);let{filterSize:a,strides:o,pad:s,dimRoundingMode:c}=r;l($s(o,1),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${o} and dilations '1'`);let u=zs(i.shape,a,o,1,s,c),d;if(u.filterWidth===1&&u.filterHeight===1&&m(u.inShape,u.outShape))d=By({inputs:{x:i},backend:n});else{let e=n.data.get(i.dataId).values,t=k(i.shape),r=Qx(e,i.shape,i.dtype,t,u,`avg`);d=n.makeTensorInfo(u.outShape,i.dtype,r.values)}return d}const rS={kernelName:Ne,backendName:`cpu`,kernelFunc:nS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function iS(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{filterSize:a,strides:o,pad:s,dimRoundingMode:c,dataFormat:l}=r;q(i,`avgPool3d`);let u=Bs(i.shape,a,o,1,s,c,l),d=n.data.get(i.dataId).values,f=eS(d,i.shape,i.dtype,k(i.shape),u,`avg`);return n.makeTensorInfo(f.shape,`float32`,f.values)}const aS={kernelName:Pe,backendName:`cpu`,kernelFunc:iS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function oS(e){let{inputs:t,backend:n,attrs:r}=e,{dy:i,input:a}=t,{filterSize:o,strides:s,pad:c,dimRoundingMode:l}=r;q([i,a],`avgPool3DGrad`);let u=Bs(a.shape,o,s,1,c,l),d=u.strideDepth,f=u.strideHeight,p=u.strideWidth,m=u.filterDepth,h=u.filterHeight,g=u.filterWidth,_=u.dilationDepth,v=u.dilationHeight,y=u.dilationWidth,b=u.effectiveFilterDepth,x=u.effectiveFilterHeight,S=u.effectiveFilterWidth,C=b-1-u.padInfo.front,w=S-1-u.padInfo.left,T=x-1-u.padInfo.top,E=R(a.shape,`float32`),D=1/(m*h*g),O=n.bufferSync(i);for(let e=0;e<u.batchSize;++e)for(let t=0;t<u.inChannels;++t)for(let n=0;n<u.inDepth;++n)for(let r=0;r<u.inHeight;++r)for(let i=0;i<u.inWidth;++i){let a=n-C,o=r-T,s=i-w,c=0;for(let n=0;n<b;n+=_){let r=(a+n)/d;if(!(r<0||r>=u.outDepth||Math.floor(r)!==r))for(let n=0;n<x;n+=v){let i=(o+n)/f;if(!(i<0||i>=u.outHeight||Math.floor(i)!==i))for(let n=0;n<S;n+=y){let a=(s+n)/p;if(a<0||a>=u.outWidth||Math.floor(a)!==a)continue;let o=O.get(e,r,i,a,t);c+=o}}}E.set(c*D,e,n,r,i,t)}return n.makeTensorInfo(E.shape,E.dtype,E.values)}const sS={kernelName:`AvgPool3DGrad`,backendName:`cpu`,kernelFunc:oS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function cS(e){let{inputs:t,backend:n,attrs:r}=e,{dy:i,input:a}=t,o=a;q([i,a],`avgPoolGrad`);let{filterSize:s,strides:c,pad:l}=r,u=zs(o.shape,s,c,1,l),d=u.strideHeight,f=u.strideWidth,p=u.filterHeight,m=u.filterWidth,h=u.dilationHeight,g=u.dilationWidth,_=u.effectiveFilterHeight,v=u.effectiveFilterWidth,y=v-1-u.padInfo.left,b=_-1-u.padInfo.top,x=R(o.shape,`float32`),S=1/(p*m),C=n.data.get(i.dataId).values,w=R(i.shape,`float32`,C);for(let e=0;e<u.batchSize;++e)for(let t=0;t<u.inChannels;++t)for(let n=0;n<u.inHeight;++n)for(let r=0;r<u.inWidth;++r){let i=n-b,a=r-y,o=0;for(let n=0;n<_;n+=h){let r=(i+n)/d;if(!(r<0||r>=u.outHeight||Math.floor(r)!==r))for(let n=0;n<v;n+=g){let i=(a+n)/f;if(i<0||i>=u.outWidth||Math.floor(i)!==i)continue;let s=w.get(e,r,i,t);o+=s}}x.set(o*S,e,n,r,t)}return n.makeTensorInfo(x.shape,x.dtype,x.values)}const lS={kernelName:`AvgPoolGrad`,backendName:`cpu`,kernelFunc:cS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function uS(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,scale:a,offset:o,mean:s,variance:c}=t;l(s.shape.length===c.shape.length,()=>`Batch normalization gradient requires mean and variance to have equal ranks.`),l(o==null||s.shape.length===o.shape.length,()=>`Batch normalization gradient requires mean and offset to have equal ranks.`),l(a==null||s.shape.length===a.shape.length,()=>`Batch normalization gradient requires mean and scale to have equal ranks.`),q([i,s,c,a,o],`batchNorm`);let{varianceEpsilon:u}=r;u??=.001;let d=n.data.get(i.dataId).values,f=n.data.get(s.dataId).values,p=n.data.get(c.dataId).values,m=a?n.data.get(a.dataId).values:new Float32Array([1]),h=o?n.data.get(o.dataId).values:new Float32Array([0]),g=new Float32Array(d.length),_=h.length,v=m.length,y=p.length,b=f.length,x=0,S=0,C=0,w=0;for(let e=0;e<d.length;++e)g[e]=h[x++]+(d[e]-f[S++])*m[C++]/Math.sqrt(p[w++]+u),x>=_&&(x=0),S>=b&&(S=0),C>=v&&(C=0),w>=y&&(w=0);return n.makeTensorInfo(i.shape,i.dtype,g)}const dS={kernelName:vt,backendName:`cpu`,kernelFunc:uS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function fS(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{blockShape:a,crops:o}=r;q([i],`batchToSpaceND`);let s=a.reduce((e,t)=>e*t),c=l_(i.shape,a,s),l=u_(c.length,a.length),u=d_(i.shape,a,s),d=f_(o,a.length),f=p_(u,o,a.length),p=Y({inputs:{x:i},backend:n,attrs:{shape:c}}),m=Ob({inputs:{x:p},backend:n,attrs:{perm:l}}),h=Y({inputs:{x:m},backend:n,attrs:{shape:u}}),g=Qb({inputs:{x:h},backend:n,attrs:{begin:d,size:f}});return n.disposeIntermediateTensorInfo(p),n.disposeIntermediateTensorInfo(m),n.disposeIntermediateTensorInfo(h),g}const pS={kernelName:Ie,backendName:`cpu`,kernelFunc:fS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function mS(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,weights:a}=t,{size:o}=r,s=n.data.get(i.dataId).values,c=n.data.get(a.dataId).values,l=Zy(s,c,a.dtype,a.shape,o);return n.makeTensorInfo([o],a.dtype,l)}const hS={kernelName:Le,backendName:`cpu`,kernelFunc:mS};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function gS(e){let{inputs:t,backend:n}=e,{s0:r,s1:i}=t,a=n.data.get(r.dataId).values,o=n.data.get(i.dataId).values,s=Go(Array.from(a),Array.from(o));return n.makeTensorInfo([s.length],`int32`,Int32Array.from(s))}const _S={kernelName:Re,backendName:`cpu`,kernelFunc:gS},vS={kernelName:Ve,backendName:`cpu`,kernelFunc:J(Ve,(e,t)=>{let n=t;return e>n.clipValueMax?n.clipValueMax:e<n.clipValueMin?n.clipValueMin:e})},yS={kernelName:Ue,backendName:`cpu`,kernelFunc:e=>{let{x:t}=e.inputs,n=e.backend,r=new Float32Array(p(t.shape)),i=n.data.get(t.dataId),a=i.complexTensorInfos.real,o=i.complexTensorInfos.imag,s=n.data.get(a.dataId).values,c=n.data.get(o.dataId).values;for(let e=0;e<s.length;e++){let t=s[e],n=c[e];r[e]=Math.hypot(t,n)}return n.makeOutput(r,t.shape,`float32`)}};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function bS(e){let{inputs:t,backend:n}=e,{input:r}=t,i=n.data.get(r.dataId).complexTensorInfos.imag,a=n.data.get(i.dataId).values;return n.makeTensorInfo(i.shape,i.dtype,a)}const xS={kernelName:Tt,backendName:`cpu`,kernelFunc:bS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function SS(e){let{inputs:t,backend:n,attrs:r}=e,{axis:i}=r,a=v(i,t[0].shape)[0];t_(t.map(e=>e.shape),a);let o=n_(t.map(e=>e.shape),a);if(p(o)===0)return n.makeTensorInfo(o,t[0].dtype,[]);let s=t.filter(e=>p(e.shape)>0);if(s.length===1)return By({inputs:{x:s[0]},backend:n});if(s[0].dtype===`complex64`){let e=s.map(e=>Hy({inputs:{input:e},backend:n})),t=s.map(e=>bS({inputs:{input:e},backend:n})),r=SS({inputs:e,backend:n,attrs:{axis:a}}),i=SS({inputs:t,backend:n,attrs:{axis:a}}),o=Ly({inputs:{real:r,imag:i},backend:n});return e.forEach(e=>n.disposeIntermediateTensorInfo(e)),t.forEach(e=>n.disposeIntermediateTensorInfo(e)),n.disposeIntermediateTensorInfo(r),n.disposeIntermediateTensorInfo(i),o}let c=s.map(e=>{let t=[-1,p(e.shape.slice(a))];return Y({inputs:{x:e},backend:n,attrs:{shape:t}})}),l=c.map(e=>({vals:n.data.get(e.dataId).values,shape:e.shape}));o=n_(c.map(e=>e.shape),1);let u=c[0].shape[0]===1,d=nb(l,o,t[0].dtype,u),f=n_(s.map(e=>e.shape),a),m=n.makeTensorInfo(f,t[0].dtype,d);return c.forEach(e=>n.disposeIntermediateTensorInfo(e)),m}const CS={kernelName:We,backendName:`cpu`,kernelFunc:SS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function wS(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,filter:a}=t,{strides:o,pad:s,dataFormat:c,dilations:l,dimRoundingMode:u}=r;q([i,a],`conv2d`);let d=ec(c),f=Vs(i.shape,a.shape,o,l,s,u,!1,d),p=f.filterHeight,m=f.filterWidth,h=f.dilationHeight,g=f.dilationWidth,_=f.padInfo.left,v=f.padInfo.top,y=f.dataFormat===`channelsLast`,b=new hi(f.outShape,i.dtype),x=k(i.shape),S=k(a.shape),C=x[0],w=y?x[1]:x[2],T=y?x[2]:1,E=y?1:x[1],D=b.strides[0],O=y?b.strides[1]:b.strides[2],ee=y?b.strides[2]:1,te=y?1:b.strides[1],ne=n.data.get(i.dataId).values,re=n.data.get(a.dataId).values,ie=b.values;for(let e=0;e<f.batchSize;++e){let t=e*C,n=e*D;for(let e=0;e<f.outHeight;++e){let r=n+e*O,i=e*f.strideHeight-v;for(let e=0;e<p;++e){let n=i+e*h;if(n<0||n>=f.inHeight)continue;let a=e*S[0],o=t+n*w;for(let e=0;e<f.outWidth;++e){let t=r+e*ee,n=e*f.strideWidth-_;for(let e=0;e<m;++e){let r=n+e*g;if(r<0||r>=f.inWidth)continue;let i=a+e*S[1],s=o+r*T,c=i;for(let e=0;e<f.inChannels;++e){let n=ne[s+e*E];for(let e=0;e<f.outChannels;++e)ie[t+e*te]+=n*re[c+e];c+=f.outChannels}}}}}}return n.makeTensorInfo(b.shape,b.dtype,ie)}const TS={kernelName:Ge,backendName:`cpu`,kernelFunc:wS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ES(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,dy:a}=t,{strides:o,pad:s,dataFormat:c,dimRoundingMode:l,filterShape:u}=r;q([i,a],`conv2dBackpropFilter`);let d=ec(c),f=Vs(i.shape,u,o,1,s,l,!1,d),{strideHeight:p,strideWidth:m,filterHeight:h,filterWidth:g}=f,_=f.dataFormat===`channelsLast`,v=new hi(f.filterShape,`float32`),y=f.padInfo.left,b=f.padInfo.top,x=n.data.get(i.dataId).values,S=n.data.get(a.dataId).values,C=new hi(i.shape,i.dtype,x),w=new hi(a.shape,a.dtype,S);for(let e=0;e<h;++e){let t=Math.max(0,Math.ceil((b-e)/p)),n=Math.min(f.outHeight,(f.inHeight+b-e)/p);for(let r=0;r<g;++r){let i=Math.max(0,Math.ceil((y-r)/m)),a=Math.min(f.outWidth,(f.inWidth+y-r)/m);for(let o=0;o<f.inChannels;++o)for(let s=0;s<f.outChannels;++s){let c=0;for(let l=0;l<f.batchSize;++l)for(let u=t;u<n;++u){let t=e+u*p-b;for(let e=i;e<a;++e){let n=r+e*m-y;_?c+=C.get(l,t,n,o)*w.get(l,u,e,s):c+=C.get(l,o,t,n)*w.get(l,s,u,e)}}v.set(c,e,r,o,s)}}}return n.makeTensorInfo(v.shape,v.dtype,v.values)}const DS={kernelName:Ke,backendName:`cpu`,kernelFunc:ES};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function OS(e){let{inputs:t,backend:n,attrs:r}=e,{dy:i,filter:a}=t,{inputShape:o,strides:s,pad:c,dataFormat:l,dimRoundingMode:u}=r;q([i,a],`conv2dBackpropInput`);let d=k(a.shape),f=k(i.shape),p=ec(l),m=Vs(o,a.shape,s,1,c,u,!1,p),h=new hi(m.inShape,`float32`),g=h.values,_=n.data.get(i.dataId).values,v=n.data.get(a.dataId).values,[y,b,x]=d,{batchSize:S,filterHeight:C,filterWidth:w,inChannels:T,inHeight:E,inWidth:D,outChannels:O,outHeight:ee,outWidth:te,strideHeight:ne,strideWidth:re}=m;p=m.dataFormat;let ie=C-1-m.padInfo.top,ae=w-1-m.padInfo.left,oe=p===`channelsLast`,A=h.strides[0],se=oe?h.strides[1]:h.strides[2],ce=oe?h.strides[2]:1,le=oe?1:h.strides[1],ue=f[0],de=oe?f[1]:f[2],fe=oe?f[2]:1,pe=oe?1:f[1];for(let e=0;e<S;++e)for(let t=0;t<T;++t)for(let n=0;n<E;++n){let r=n-ie,i=Math.max(0,Math.ceil(r/ne)),a=Math.min(ee,(C+r)/ne);for(let o=0;o<D;++o){let s=o-ae,c=Math.max(0,Math.ceil(s/re)),l=Math.min(te,(w+s)/re),u=0;for(let n=i;n<a;++n){let i=n*ne-r;for(let r=c;r<l;++r){let a=r*re-s,o=ue*e+de*n+fe*r,c=y*(C-1-i)+b*(w-1-a)+x*t;for(let e=0;e<O;++e){let t=_[o+pe*e],n=v[c+e];u+=t*n}}}let d=A*e+se*n+ce*o+le*t;g[d]=u}}return n.makeTensorInfo(h.shape,h.dtype,h.values)}const kS={kernelName:qe,backendName:`cpu`,kernelFunc:OS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function AS(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,filter:a}=t,{strides:o,pad:s,dilations:c}=r;q([i,a],`conv3d`);let l=Hs(i.shape,a.shape,o,c,s),{filterDepth:u,filterHeight:d,filterWidth:f,dilationDepth:p,dilationHeight:m,dilationWidth:h,padInfo:g}=l,_=g.front,v=g.left,y=g.top,b=new hi(l.outShape,i.dtype),x=n.data.get(i.dataId).values,S=n.data.get(a.dataId).values,C=b.values,w=k(i.shape),T=k(a.shape);for(let e=0;e<l.batchSize;++e){let t=e*w[0],n=e*b.strides[0];for(let e=0;e<l.outDepth;++e){let r=n+e*b.strides[1],i=e*l.strideDepth-_;for(let e=0;e<u;++e){let n=i+e*p;if(n<0||n>=l.inDepth)continue;let a=e*T[0],o=t+n*w[1];for(let e=0;e<l.outHeight;++e){let t=r+e*b.strides[2],n=e*l.strideHeight-y;for(let e=0;e<d;++e){let r=n+e*m;if(r<0||r>=l.inHeight)continue;let i=a+e*T[1],s=o+r*w[2];for(let e=0;e<l.outWidth;++e){let n=t+e*l.outChannels,r=e*l.strideWidth-v;for(let e=0;e<f;++e){let t=r+e*h;if(t<0||t>=l.inWidth)continue;let a=i+e*T[2],o=s+t*l.inChannels,c=a;for(let e=0;e<l.inChannels;++e){let t=x[o+e];for(let e=0;e<l.outChannels;++e)C[n+e]+=t*S[c+e];c+=l.outChannels}}}}}}}}return n.makeTensorInfo(b.shape,b.dtype,b.values)}const jS={kernelName:Je,backendName:`cpu`,kernelFunc:AS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function MS(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,dy:a}=t,{strides:o,pad:s,filterShape:c}=r;q([i,a],`conv3dBackpropFilterV2`);let l=k(i.shape),u=k(a.shape),d=Hs(i.shape,c,o,1,s),f=d.strideDepth,p=d.strideHeight,m=d.strideWidth,h=d.filterDepth,g=d.filterHeight,_=d.filterWidth,v=new hi(d.filterShape,`float32`),y=v.values,[b,x,S,C]=v.strides,w=n.data.get(a.dataId).values,[T,E,D,O]=u,ee=n.data.get(i.dataId).values,[te,ne,re,ie]=l,ae=d.padInfo.front,oe=d.padInfo.left,A=d.padInfo.top;for(let e=0;e<h;++e){let t=Math.max(0,Math.ceil((ae-e)/f)),n=Math.min(d.outDepth,(d.inDepth+ae-e)/f),r=e*b;for(let i=0;i<g;++i){let a=Math.max(0,Math.ceil((A-i)/p)),o=Math.min(d.outHeight,(d.inHeight+A-i)/p),s=i*x+r;for(let r=0;r<_;++r){let c=Math.max(0,Math.ceil((oe-r)/m)),l=Math.min(d.outWidth,(d.inWidth+oe-r)/m),u=r*S+s;for(let s=0;s<d.inChannels;++s){let h=s*C+u;for(let u=0;u<d.outChannels;++u){let g=0;for(let h=0;h<d.batchSize;++h){let d=h*te,_=h*T;for(let h=t;h<n;++h){let t=(e+h*f-ae)*ne+d,n=h*E+_;for(let e=a;e<o;++e){let a=(i+e*p-A)*re+t,o=e*D+n;for(let e=c;e<l;++e){let t=(r+e*m-oe)*ie+a,n=e*O+o;g+=ee[t+s]*w[n+u]}}}}y[h+u]=g}}}}}return n.makeTensorInfo(v.shape,v.dtype,v.values)}const NS={kernelName:`Conv3DBackpropFilterV2`,backendName:`cpu`,kernelFunc:MS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function PS(e){let{inputs:t,backend:n,attrs:r}=e,{dy:i,filter:a}=t,{pad:o,strides:s,inputShape:c}=r;q([i],`conv3dBackpropInputV2`);let l=k(i.shape),u=k(a.shape),d=Hs(c,a.shape,s,1,o),f=new hi(d.inShape,`float32`),p=f.values,[m,h,g,_]=f.strides,v=n.data.get(i.dataId).values,[y,b,x,S]=l,C=n.data.get(a.dataId).values,[w,T,E,D]=u,{batchSize:O,filterDepth:ee,filterHeight:te,filterWidth:ne,inChannels:re,inDepth:ie,inHeight:ae,inWidth:oe,outChannels:A,outDepth:se,outHeight:ce,outWidth:le,strideDepth:ue,strideHeight:de,strideWidth:fe}=d,pe=ee-1-d.padInfo.front,me=te-1-d.padInfo.top,he=ne-1-d.padInfo.left;for(let e=0;e<O;++e)for(let t=0;t<re;++t)for(let n=0;n<ie;++n){let r=n-pe,i=Math.max(0,Math.ceil(r/ue)),a=Math.min(se,(ee+r)/ue);for(let o=0;o<ae;++o){let s=o-me,c=Math.max(0,Math.ceil(s/de)),l=Math.min(ce,(te+s)/de);for(let u=0;u<oe;++u){let d=u-he,f=Math.max(0,Math.ceil(d/fe)),O=Math.min(le,(ne+d)/fe),re=0;for(let n=i;n<a;++n){let i=n*ue-r;for(let r=c;r<l;++r){let a=r*de-s;for(let o=f;o<O;++o){let s=o*fe-d,c=y*e+b*n+x*r+S*o,l=w*(ee-1-i)+T*(te-1-a)+E*(ne-1-s)+D*t;for(let e=0;e<A;++e){let t=v[c+e],n=C[l+e];re+=t*n}}}}p[m*e+h*n+g*o+_*u+t]=re}}}return n.makeTensorInfo(f.shape,f.dtype,f.values)}const FS={kernelName:Ye,backendName:`cpu`,kernelFunc:PS},IS={kernelName:`Cos`,backendName:`cpu`,kernelFunc:J(`Cos`,e=>Math.cos(e))},LS={kernelName:Xe,backendName:`cpu`,kernelFunc:J(Xe,e=>Math.cosh(e))};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function RS(e){let{inputs:t,backend:n,attrs:r}=e,{image:i,boxes:a,boxInd:o}=t,{cropSize:s,method:c,extrapolationValue:l}=r,[u,d,f,p]=i.shape,m=a.shape[0],[h,g]=s,_=R([m,h,g,p],`float32`),v=n.data.get(a.dataId).values,y=n.data.get(o.dataId).values,b=n.data.get(i.dataId).values,x=k(i.shape),S=k(_.shape);for(let e=0;e<m;e++){let t=e*4,n=v[t],r=v[t+1],i=v[t+2],a=v[t+3],o=y[e];if(o>=u)continue;let s=h>1?(i-n)*(d-1)/(h-1):0,m=g>1?(a-r)*(f-1)/(g-1):0;for(let t=0;t<h;t++){let u=h>1?n*(d-1)+t*s:.5*(n+i)*(d-1);if(u<0||u>d-1){for(let n=0;n<g;n++)for(let r=0;r<p;r++){let i=r+n*S[2]+t*S[1]+e*S[0];_.values[i]=l}continue}if(c===`bilinear`){let n=Math.floor(u),i=Math.ceil(u),s=u-n;for(let c=0;c<g;c++){let u=g>1?r*(f-1)+c*m:.5*(r+a)*(f-1);if(u<0||u>f-1){for(let n=0;n<p;n++){let r=n+c*S[2]+t*S[1]+e*S[0];_.values[r]=l}continue}let d=Math.floor(u),h=Math.ceil(u),v=u-d;for(let r=0;r<p;r++){let a=r+d*x[2]+n*x[1]+o*x[0],l=b[a];a=r+h*x[2]+n*x[1]+o*x[0];let u=b[a];a=r+d*x[2]+i*x[1]+o*x[0];let f=b[a];a=r+h*x[2]+i*x[1]+o*x[0];let p=b[a],m=l+(u-l)*v,g=f+(p-f)*v;a=r+c*S[2]+t*S[1]+e*S[0],_.values[a]=m+(g-m)*s}}}else for(let n=0;n<g;++n){let i=g>1?r*(f-1)+n*m:.5*(r+a)*(f-1);if(i<0||i>f-1){for(let r=0;r<p;r++){let i=r+n*S[2]+t*S[1]+e*S[0];_.values[i]=l}continue}let s=Math.round(i),c=Math.round(u);for(let r=0;r<p;r++){let i=r+s*x[2]+c*x[1]+o*x[0],a=r+n*S[2]+t*S[1]+e*S[0];_.values[a]=b[i]}}}}return n.makeTensorInfo(_.shape,_.dtype,_.values)}const zS={kernelName:$e,backendName:`cpu`,kernelFunc:RS};
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function BS(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a,exclusive:o,reverse:s}=r;q(i,`cumprod`);let c=Gl([a],i.shape.length),l=i;c!=null&&(l=Ob({inputs:{x:i},backend:n,attrs:{perm:c}}));let u=ql(1,i.shape.length)[0];if(u!==l.shape.length-1)throw Error(`backend.cumprod in CPU expects an inner-most axis=${l.shape.length-1} but got axis=${u}`);let d=ki(l.dtype,`int32`),f=oe(p(l.shape),d),m=n.data.get(l.dataId).values,h=l.shape[l.shape.length-1],g=s?(e,t)=>e+h-t-1:(e,t)=>e+t;for(let e=0;e<m.length;e+=h)for(let t=0;t<h;t++){let n=g(e,t);if(t===0)f[n]=o?1:m[n];else{let r=g(e,t-1);f[n]=o?m[r]*f[r]:m[n]*f[r]}}let _=n.makeTensorInfo(l.shape,d,f);if(c!=null){let e=Kl(c),t=Ob({inputs:{x:_},backend:n,attrs:{perm:e}});return n.disposeIntermediateTensorInfo(_),n.disposeIntermediateTensorInfo(l),t}return _}const VS={kernelName:Ze,backendName:`cpu`,kernelFunc:BS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function HS(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a,exclusive:o,reverse:s}=r;q(i,`cumsum`);let c=Gl([a],i.shape.length),l=i;c!=null&&(l=Ob({inputs:{x:i},backend:n,attrs:{perm:c}}));let u=ql(1,i.shape.length)[0];if(u!==l.shape.length-1)throw Error(`backend.cumsum in CPU expects an inner-most axis=${l.shape.length-1} but got axis=${u}`);let d=ki(l.dtype,`int32`),f=A(p(l.shape),d),m=n.data.get(l.dataId).values,h=l.shape[l.shape.length-1],g=s?(e,t)=>e+h-t-1:(e,t)=>e+t;for(let e=0;e<m.length;e+=h)for(let t=0;t<h;t++){let n=g(e,t);if(t===0)f[n]=o?0:m[n];else{let r=g(e,t-1);f[n]=o?m[r]+f[r]:m[n]+f[r]}}let _=n.makeTensorInfo(l.shape,d,f);if(c!=null){let e=Kl(c),t=Ob({inputs:{x:_},backend:n,attrs:{perm:e}});return n.disposeIntermediateTensorInfo(_),n.disposeIntermediateTensorInfo(l),t}return _}const US={kernelName:Qe,backendName:`cpu`,kernelFunc:HS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function WS(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,weights:a}=t,{size:o,binaryOutput:s}=r;if(i.shape.length===1){let e=n.data.get(i.dataId).values,t=n.data.get(a.dataId).values,r=Zy(e,t,a.dtype,a.shape,o);return n.makeTensorInfo([o],a.dtype,r)}else if(i.shape.length===2){let e=Qy(n.bufferSync(i),n.bufferSync(a),o,s);return n.makeTensorInfo(e.shape,a.dtype,e.values)}throw Error(`Error in denseBincount: input must be at most rank 2, but got rank${i.shape.length}.`)}const GS={kernelName:et,backendName:`cpu`,kernelFunc:WS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function KS(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{blockSize:a,dataFormat:o}=r;l(o===`NHWC`,()=>`Only NHWC dataFormat supported on CPU for depthToSpace. Got ${o}`);let s=i.shape[0],c=i.shape[1],u=i.shape[2],d=i.shape[3],f=c*a,p=u*a,m=d/(a*a),h=n.data.get(i.dataId).values,g=new Float32Array(s*f*p*m),_=0;for(let e=0;e<s;++e)for(let t=0;t<f;++t){let n=Math.floor(t/a),r=t%a;for(let t=0;t<p;++t){let i=Math.floor(t/a),o=t%a,s=(r*a+o)*m;for(let t=0;t<m;++t){let r=t+s+d*(i+u*(n+c*e));g[_++]=h[r]}}}return n.makeTensorInfo([s,f,p,m],i.dtype,g)}const qS={kernelName:tt,backendName:`cpu`,kernelFunc:KS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function JS(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,filter:a}=t,{strides:o,pad:s,dilations:c,dimRoundingMode:u}=r;q([i,a],`depthwiseConv2DNative`);let d=k(i.shape),f=k(a.shape),p=c;p??=[1,1],l($s(o,p),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${o} and dilations '${p}'`);let m=Vs(i.shape,a.shape,o,p,s,u,!0),{filterHeight:h,filterWidth:g,dilationHeight:_,dilationWidth:v,padInfo:y}=m,b=y.left,x=y.top,S=m.outChannels/m.inChannels,C=new hi(m.outShape,i.dtype),w=n.data.get(i.dataId).values,T=n.data.get(a.dataId).values,E=C.values;for(let e=0;e<m.batchSize;++e){let t=e*d[0],n=e*C.strides[0];for(let e=0;e<m.outHeight;++e){let r=n+e*C.strides[1],i=e*m.strideHeight-x;for(let e=0;e<h;++e){let n=i+e*_;if(n<0||n>=m.inHeight)continue;let a=e*f[0],o=t+n*d[1];for(let e=0;e<m.outWidth;++e){let t=r+e*C.strides[2],n=e*m.strideWidth-b;for(let e=0;e<g;++e){let r=n+e*v;if(r<0||r>=m.inWidth)continue;let i=a+e*f[1],s=o+r*m.inChannels,c=t,l=i;for(let e=0;e<m.inChannels;++e){let t=w[s+e];for(let e=0;e<S;++e)E[c+e]+=t*T[l+e];c+=S,l+=S}}}}}}return n.makeTensorInfo(C.shape,C.dtype,C.values)}const YS={kernelName:nt,backendName:`cpu`,kernelFunc:JS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function XS(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,dy:a}=t,{strides:o,dilations:s,pad:c,dimRoundingMode:l,filterShape:u}=r;q([i,a],`depthwiseConv2dNativeBackpropFilter`);let d=Vs(i.shape,u,o,s,c,l,!0),{strideHeight:f,strideWidth:p,filterHeight:m,filterWidth:h}=d,g=new hi(d.filterShape,`float32`),_=d.padInfo.left,v=d.padInfo.top,y=d.outChannels/d.inChannels,b=n.data.get(i.dataId).values,x=new hi(i.shape,i.dtype,b),S=n.data.get(a.dataId).values,C=new hi(a.shape,a.dtype,S);for(let e=0;e<m;++e){let t=Math.max(0,Math.ceil((v-e)/f)),n=Math.min(d.outHeight,(d.inHeight+v-e)/f);for(let r=0;r<h;++r){let i=Math.max(0,Math.ceil((_-r)/p)),a=Math.min(d.outWidth,(d.inWidth+_-r)/p);for(let o=0;o<d.outChannels;++o){let s=Math.trunc(o/y),c=o%y,l=0;for(let c=0;c<d.batchSize;++c)for(let u=t;u<n;++u){let t=e+u*f-v;for(let e=i;e<a;++e){let n=r+e*p-_;l+=x.get(c,t,n,s)*C.get(c,u,e,o)}}g.set(l,e,r,s,c)}}}return n.makeTensorInfo(g.shape,g.dtype,g.values)}const ZS={kernelName:rt,backendName:`cpu`,kernelFunc:XS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function QS(e){let{inputs:t,backend:n,attrs:r}=e,{dy:i,filter:a}=t,{strides:o,dilations:s,pad:c,dimRoundingMode:l,inputShape:u}=r;q([i,a],`depthwiseConv2DNativeBackpropInput`);let d=k(i.shape),f=k(a.shape),p=Vs(u,a.shape,o,s,c,l,!0),m=new hi(p.inShape,`float32`),h=m.values,[g,_,v]=m.strides,y=n.data.get(i.dataId).values,[b,x,S]=d,C=n.data.get(a.dataId).values,[w,T,E]=f,{batchSize:D,filterHeight:O,filterWidth:ee,inChannels:te,inHeight:ne,inWidth:re,outChannels:ie,outHeight:ae,outWidth:oe,strideHeight:A,strideWidth:se}=p,ce=O-1-p.padInfo.top,le=ee-1-p.padInfo.left,ue=ie/te;for(let e=0;e<D;++e)for(let t=0;t<te;++t)for(let n=0;n<ne;++n){let r=n-ce,i=Math.max(0,Math.ceil(r/A)),a=Math.min(ae,(O+r)/A);for(let o=0;o<re;++o){let s=o-le,c=Math.max(0,Math.ceil(s/se)),l=Math.min(oe,(ee+s)/se),u=0;for(let n=i;n<a;++n){let i=n*A-r;for(let r=c;r<l;++r){let a=r*se-s,o=b*e+x*n+S*r,c=w*(O-1-i)+T*(ee-1-a)+E*t;for(let e=0;e<ue;++e){let n=y[o+(t*ue+e)],r=C[c+e];u+=n*r}}}h[g*e+_*n+v*o+t]=u}}return n.makeTensorInfo(m.shape,m.dtype,m.values)}const $S={kernelName:it,backendName:`cpu`,kernelFunc:QS};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function eC(e){let{inputs:t,backend:n}=e,{x:r}=t,i=p(r.shape),a=n.data.get(r.dataId).values,o=R([i,i],r.dtype),s=o.values;for(let e=0;e<a.length;e++)s[e*i+e]=a[e];let c=[...r.shape,...r.shape];return n.makeTensorInfo(c,o.dtype,o.values)}const tC={kernelName:at,backendName:`cpu`,kernelFunc:eC},nC={kernelName:ot,backendName:`cpu`,kernelFunc:({inputs:e,backend:t,attrs:n})=>{let{x:r,filter:i}=e,{strides:a,pad:o,dilations:s}=n,c=t,l=c.data.get(r.dataId).values,u=r.shape.length,d=c.data.get(i.dataId).values,f=i.shape.length,{batchSize:m,inHeight:h,inWidth:g,inChannels:_,outHeight:v,outWidth:y,padInfo:b,strideHeight:S,strideWidth:C,filterHeight:w,filterWidth:T,dilationHeight:E,dilationWidth:D,outShape:O}=Rs(r.shape,i.shape,a,o,`NHWC`,s),ee=p(O),te=O.length,ne=x(r.dtype,ee);for(let e=0;e<m;++e)for(let t=0;t<v;++t){let n=t*S-b.top;for(let a=0;a<y;++a){let o=a*C-b.left;for(let s=0;s<_;++s){let c=-(2**53-1);for(let t=0;t<w;++t){let a=n+t*E;if(a>=0&&a<h)for(let n=0;n<T;++n){let p=o+n*D;if(p>=0&&p<g){let o=le([e,a,p,s],u,k(r.shape)),m=le([t,n,s],f,k(i.shape)),h=l[o]+d[m];h>c&&(c=h)}}}let p=le([e,t,a,s],te,k(O));ne[p]=c}}}return{dataId:c.write(ei(ne,r.dtype),O,r.dtype),shape:O,dtype:r.dtype}}},rC={kernelName:ct,backendName:`cpu`,kernelFunc:({inputs:e,backend:t,attrs:n})=>{let{x:r,filter:i,dy:a}=e,{strides:o,pad:s,dilations:c}=n,u=t,d=ae(r.shape,u.data.get(r.dataId).values),f=ae(i.shape,u.data.get(i.dataId).values),{batchSize:p,inHeight:m,inWidth:h,inChannels:g,outHeight:_,outWidth:v,padInfo:y,strideHeight:b,strideWidth:x,filterHeight:S,filterWidth:C,dilationHeight:w,dilationWidth:T,outShape:E}=Rs(r.shape,i.shape,o,s,`NHWC`,c);l(a.rank===E.length,()=>`Error in ${ct}, dy must have the same rank as output ${E.length}, but got ${a.rank}`);let D=ae(E,u.data.get(a.dataId).values),O=se(i.shape,i.dtype);for(let e=0;e<p;++e)for(let t=0;t<_;++t){let n=t*b-y.top;for(let r=0;r<v;++r){let i=r*x-y.left;for(let a=0;a<g;++a){let o=-(2**53-1),s=0,c=0;for(let t=0;t<S;++t){let r=n+t*w;if(r>=0&&r<m)for(let n=0;n<C;++n){let l=i+n*T;if(l>=0&&l<h){let i=d[e][r][l][a]+f[t][n][a];i>o&&(o=i,s=t,c=n)}}}O[s][c][a]+=D[e][t][r][a]}}}return{dataId:u.write(ei(O,r.dtype),i.shape,i.dtype),shape:i.shape,dtype:i.dtype}}},iC={kernelName:st,backendName:`cpu`,kernelFunc:({inputs:e,backend:t,attrs:n})=>{let{x:r,filter:i,dy:a}=e,{strides:o,pad:s,dilations:c}=n,u=t,d=ae(r.shape,u.data.get(r.dataId).values),f=ae(i.shape,u.data.get(i.dataId).values),{batchSize:p,inHeight:m,inWidth:h,inChannels:g,outHeight:_,outWidth:v,padInfo:y,strideHeight:b,strideWidth:x,filterHeight:S,filterWidth:C,dilationHeight:w,dilationWidth:T,outShape:E}=Rs(r.shape,i.shape,o,s,`NHWC`,c);l(a.rank===E.length,()=>`Error in ${st}, dy must have the same rank as output ${E.length}, but got ${a.rank}`);let D=ae(E,u.data.get(a.dataId).values),O=se(r.shape,r.dtype);for(let e=0;e<p;++e)for(let t=0;t<_;++t){let n=t*b-y.top;for(let r=0;r<v;++r){let i=r*x-y.left;for(let a=0;a<g;++a){let o=-(2**53-1),s=n<0?0:n,c=i<0?0:i;for(let t=0;t<S;++t){let r=n+t*w;if(r>=0&&r<m)for(let n=0;n<C;++n){let l=i+n*T;if(l>=0&&l<h){let i=d[e][r][l][a]+f[t][n][a];i>o&&(o=i,s=r,c=l)}}}O[e][s][c][a]+=D[e][t][r][a]}}}return{dataId:u.write(ei(O,r.dtype),r.shape,r.dtype),shape:r.shape,dtype:r.dtype}}};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function aC(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a,keepDims:o}=r;q(i,`sum`);let s;s=i.dtype===`bool`?Gy({inputs:{x:i},backend:n,attrs:{dtype:`int32`}}):By({inputs:{x:i},backend:n});let c=s.shape.length,l=v(a,s.shape),u=Gl(l,c),d=l,f=s;u!=null&&(f=Ob({inputs:{x:s},backend:n,attrs:{perm:u}}),d=ql(d.length,c)),Wl(`sum`,d,f.shape.length);let[m,h]=Hl(f.shape,d),g=zy(n,m,ki(f.dtype,`int32`)),_=p(h),y=n.data.get(g.dataId).values,b=n.data.get(f.dataId).values;for(let e=0;e<y.length;++e){let t=e*_,n=0;for(let e=0;e<_;++e)n+=b[t+e];y[e]=n}if(o){let e=Ul(g.shape,l),t=g;g=Y({inputs:{x:g},backend:n,attrs:{shape:e}}),n.disposeIntermediateTensorInfo(t)}return n.disposeIntermediateTensorInfo(s),u!=null&&n.disposeIntermediateTensorInfo(f),g}const oC={kernelName:`Sum`,backendName:`cpu`,kernelFunc:aC};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function sC(e){let{inputs:t,backend:n,attrs:r}=e,{equation:i}=r,a=t,{allDims:o,summedDims:s,idDims:c}=C_(i,a.length);T_(o.length,c,a);let{path:l,steps:u}=E_(s,c),d=u.length,f=null,p=o.length,h=[];for(let e=0;e<d;++e){for(let t of u[e]){let{permutationIndices:e,expandDims:r}=w_(p,c[t]),i;D_(e)?i=a[t]:(i=Ob({inputs:{x:a[t]},backend:n,attrs:{perm:e}}),h.push(i));let o=i.shape.slice();for(let e=0;e<r.length;++e)o.splice(r[e],0,1);m(i.shape,o)||(i=Y({inputs:{x:i},backend:n,attrs:{shape:o}}),h.push(i)),f===null?f=i:(f=xb({inputs:{a:i,b:f},backend:n}),h.push(f))}e<d-1&&(l[e]>=0&&(f=aC({inputs:{x:f},backend:n,attrs:{axis:l[e]-(o.length-p),keepDims:!1}}),h.push(f)),p--)}for(let e of h)e!==f&&n.disposeIntermediateTensorInfo(e);return f}const cC={kernelName:ut,backendName:`cpu`,kernelFunc:sC};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function lC(e){let{inputs:t,backend:n}=e,{dy:r,y:i}=t;q([r,i],`eluGrad`);let a=new Float32Array(p(i.shape)),o=n.data.get(i.dataId).values,s=n.data.get(r.dataId).values;for(let e=0;e<o.length;++e){let t=o[e];t>=1?a[e]=s[e]:a[e]=s[e]*(t+1)}return n.makeTensorInfo(i.shape,`float32`,a)}const uC={kernelName:`EluGrad`,backendName:`cpu`,kernelFunc:lC},dC={kernelName:`Erf`,backendName:`cpu`,kernelFunc:J(`Erf`,e=>{let t=Math.sign(e),n=Math.abs(e),r=1/(1+.3275911*n);return t*(1-((((1.061405429*r+-1.453152027)*r+1.421413741)*r+-.284496736)*r+.254829592)*r*Math.exp(-n*n))})};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function fC(e){let{inputs:t,backend:n,attrs:r}=e,{input:i}=t,{dim:a}=r,o=i.shape.length,s=i.shape.slice(),c=a;return a<0&&(l(-(o+1)<=a,()=>`Axis must be in the interval [${-(o+1)}, ${o}]`),c=o+a+1),s.splice(c,0,1),Y({inputs:{x:i},backend:n,attrs:{shape:s}})}const pC={kernelName:ft,backendName:`cpu`,kernelFunc:fC},mC=qy(lt,Iy((e,t)=>e/t)),hC={kernelName:lt,backendName:`cpu`,kernelFunc:mC};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function gC(e,t,n){let r=e.shape,i=r[0],a=r[1],o=n.data.get(e.dataId),s=o.complexTensorInfos.real,c=o.complexTensorInfos.imag,l=[i,a],u=p(l),d=b(`float32`,u),f=b(`float32`,u);for(let e=0;e<i;e++){let r=Qb({inputs:{x:s},backend:n,attrs:{begin:[e,0],size:[1,a]}}),i=Qb({inputs:{x:c},backend:n,attrs:{begin:[e,0],size:[1,a]}}),o=Ly({inputs:{real:r,imag:i},backend:n}),{real:l,imag:u}=_C(o,t,n),p=m_(l,u);for(let t=0;t<a;t++){let n=v_(p,t);d[e*a+t]=n.real,f[e*a+t]=n.imag}n.disposeIntermediateTensorInfo(r),n.disposeIntermediateTensorInfo(i),n.disposeIntermediateTensorInfo(o)}let m=n.makeTensorInfo(l,`float32`,d),h=n.makeTensorInfo(l,`float32`,f),g=Ly({inputs:{real:m,imag:h},backend:n});return n.disposeIntermediateTensorInfo(m),n.disposeIntermediateTensorInfo(h),g}function _C(e,t,n){let r=p(e.shape),i=n.data.get(e.dataId),a=n.data.get(i.complexTensorInfos.real.dataId).values,o=n.data.get(i.complexTensorInfos.imag.dataId).values;if(vC(r)){let i=yC(a,o,r,t,n),s=[e.shape[0],e.shape[1]];if(t){let e=n.makeTensorInfo(s,`float32`,i.real),t=n.makeTensorInfo(s,`float32`,i.imag),a=n.makeTensorInfo([],`float32`,Qr(r,`float32`)),o=By({inputs:{x:a},backend:n}),c=hC.kernelFunc({inputs:{a:e,b:a},backend:n}),l=hC.kernelFunc({inputs:{a:t,b:o},backend:n}),u=n.data.get(c.dataId).values,d=n.data.get(l.dataId).values;return n.disposeIntermediateTensorInfo(e),n.disposeIntermediateTensorInfo(t),n.disposeIntermediateTensorInfo(a),n.disposeIntermediateTensorInfo(o),n.disposeIntermediateTensorInfo(c),n.disposeIntermediateTensorInfo(l),{real:u,imag:d}}return i}else return h_(bC(m_(a,o),r,t))}function vC(e){return(e&e-1)==0}function yC(e,t,n,r,i){if(n===1)return{real:e,imag:t};let a=m_(e,t),o=n/2,s=g_(a),c=s.real,l=s.imag,u=[c.length],d=i.makeTensorInfo(u,`float32`,c),f=i.makeTensorInfo(u,`float32`,l),p=Ly({inputs:{real:d,imag:f},backend:i}),m=__(a),h=m.real,g=m.imag,_=[h.length],v=i.makeTensorInfo(_,`float32`,h),y=i.makeTensorInfo(_,`float32`,g),b=Ly({inputs:{real:v,imag:y},backend:i}),x=yC(c,l,o,r,i),S=x.real,C=x.imag,w=[S.length],T=i.makeTensorInfo(w,`float32`,S),E=i.makeTensorInfo(w,`float32`,C),D=Ly({inputs:{real:T,imag:E},backend:i}),O=yC(h,g,o,r,i),ee=O.real,te=O.imag,ne=[ee.length],re=i.makeTensorInfo(ne,`float32`,ee),k=i.makeTensorInfo(ne,`float32`,te),ie=Ly({inputs:{real:re,imag:k},backend:i}),ae=b_(n,r),oe=[ae.real.length],A=i.makeTensorInfo(oe,`float32`,ae.real),se=i.makeTensorInfo(oe,`float32`,ae.imag),ce=Ly({inputs:{real:A,imag:se},backend:i}),le=xb({inputs:{a:ce,b:ie},backend:i}),ue=Yy({inputs:{a:D,b:le},backend:i}),de=dx({inputs:{a:D,b:le},backend:i}),fe=Hy({inputs:{input:ue},backend:i}),pe=Hy({inputs:{input:de},backend:i}),me=bS({inputs:{input:ue},backend:i}),he=bS({inputs:{input:de},backend:i}),ge=SS({inputs:[fe,pe],backend:i,attrs:{axis:0}}),j=SS({inputs:[me,he],backend:i,attrs:{axis:0}}),_e=i.data.get(ge.dataId).values,ve=i.data.get(j.dataId).values;return i.disposeIntermediateTensorInfo(d),i.disposeIntermediateTensorInfo(f),i.disposeIntermediateTensorInfo(p),i.disposeIntermediateTensorInfo(v),i.disposeIntermediateTensorInfo(y),i.disposeIntermediateTensorInfo(b),i.disposeIntermediateTensorInfo(T),i.disposeIntermediateTensorInfo(E),i.disposeIntermediateTensorInfo(D),i.disposeIntermediateTensorInfo(re),i.disposeIntermediateTensorInfo(k),i.disposeIntermediateTensorInfo(ie),i.disposeIntermediateTensorInfo(A),i.disposeIntermediateTensorInfo(se),i.disposeIntermediateTensorInfo(ce),i.disposeIntermediateTensorInfo(le),i.disposeIntermediateTensorInfo(ue),i.disposeIntermediateTensorInfo(de),i.disposeIntermediateTensorInfo(fe),i.disposeIntermediateTensorInfo(me),i.disposeIntermediateTensorInfo(pe),i.disposeIntermediateTensorInfo(he),i.disposeIntermediateTensorInfo(ge),i.disposeIntermediateTensorInfo(j),{real:_e,imag:ve}}function bC(e,t,n){let r=new Float32Array(t*2);for(let i=0;i<t;i++){let a=0,o=0;for(let r=0;r<t;r++){let s=x_(i*r,t,n),c=v_(e,r);a+=c.real*s.real-c.imag*s.imag,o+=c.real*s.imag+c.imag*s.real}n&&(a/=t,o/=t),y_(r,a,o,i)}return r}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function xC(e){let{inputs:t,backend:n}=e,{input:r}=t,i=p(r.shape),a=r.shape[r.shape.length-1],o=i/a,s=Y({inputs:{x:r},backend:n,attrs:{shape:[o,a]}}),c=gC(s,!1,n),l=Y({inputs:{x:c},backend:n,attrs:{shape:r.shape}});return n.disposeIntermediateTensorInfo(s),n.disposeIntermediateTensorInfo(c),l}const SC={kernelName:`FFT`,backendName:`cpu`,kernelFunc:xC};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function CC(e){let{backend:t,attrs:n}=e,{shape:r,value:i,dtype:a}=n,o=a||ne(i),s=x(o,p(r));return TC(s,i,o),t.makeTensorInfo(r,o,s)}const wC={kernelName:mt,backendName:`cpu`,kernelFunc:CC};function TC(e,t,n){e.fill(t)}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const EC={kernelName:ht,backendName:`cpu`,kernelFunc:({inputs:e,attrs:t,backend:n})=>{let{image:r}=e,i=n,a=b(r.dtype,p(r.shape)),[o,s,c,l]=r.shape,u=i.data.get(r.dataId).values;for(let e=0;e<o;e++){let t=e*c*s*l;for(let e=0;e<s;e++){let n=c*l*e;for(let e=0;e<c;e++){let r=e*l;for(let i=0;i<l;i++){let o=Math.round(c-e-1),s=t+n+r+i,d=u[s];if(o>=0&&o<c){let e=o*l;d=u[t+n+e+i]}a[s]=d}}}}return{dataId:i.write(a,r.shape,r.dtype),shape:r.shape,dtype:r.dtype}}},DC={kernelName:_t,backendName:`cpu`,kernelFunc:qy(_t,Iy((e,t)=>Math.floor(e/t)),null,`int32`)};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function OC(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,filter:a,bias:o,preluActivationWeights:s}=t,{strides:c,pad:l,dataFormat:u,dilations:d,dimRoundingMode:f,activation:p,leakyreluAlpha:m}=r,h=wS({inputs:{x:i,filter:a},backend:n,attrs:{strides:c,pad:l,dataFormat:u,dilations:d,dimRoundingMode:f}});if(o){let e=h;if(u===`NCHW`&&o.shape.length===1&&o.shape[0]!==1){let e=Y({inputs:{x:o},backend:n,attrs:{shape:[o.shape[0],1,1]}});h=Yy({inputs:{a:h,b:e},backend:n}),n.disposeIntermediateTensorInfo(e)}else h=Yy({inputs:{a:h,b:o},backend:n});n.disposeIntermediateTensorInfo(e)}if(p){let e=h;if(u===`NCHW`&&p===`prelu`&&s.shape.length===1&&s.shape[0]!==1){let e=Y({inputs:{x:s},backend:n,attrs:{shape:[s.shape[0],1,1]}});h=kx(n,h,p,e,m),n.disposeIntermediateTensorInfo(e)}else h=kx(n,h,p,s,m);n.disposeIntermediateTensorInfo(e)}return h}const kC={kernelName:Zn,backendName:`cpu`,kernelFunc:OC};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function AC(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,filter:a,bias:o,preluActivationWeights:s}=t,{strides:c,pad:l,dataFormat:u,dilations:d,dimRoundingMode:f,activation:p,leakyreluAlpha:m}=r,h=JS({inputs:{x:i,filter:a},backend:n,attrs:{strides:c,pad:l,dataFormat:u,dilations:d,dimRoundingMode:f}});if(o){let e=h;h=Yy({inputs:{a:h,b:o},backend:n}),n.disposeIntermediateTensorInfo(e)}if(p){let e=h;h=kx(n,h,p,s,m),n.disposeIntermediateTensorInfo(e)}return h}const jC={kernelName:Qn,backendName:`cpu`,kernelFunc:AC};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function MC(e){let{inputs:t,backend:n}=e,{params:r,indices:i}=t,a=p(r.shape),o=i.shape,s=o[o.length-1],[c,l,u,d]=qo(r,i);if(l===0)return n.makeTensorInfo(c,r.dtype,[]);let f=n.data.get(i.dataId).values,m=lb(f,n.bufferSync(r),r.dtype,l,s,u,d,r.shape,a);return n.makeTensorInfo(c,r.dtype,m.values)}const NC={kernelName:bt,backendName:`cpu`,kernelFunc:MC};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function PC(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,indices:a}=t,{axis:o,batchDims:s}=r;q([i,a],`gatherV2`);let c=v(o,i.shape)[0],u=n.data.get(a.dataId).values,d=i.shape[c];for(let e=0;e<u.length;++e){let t=u[e];l(t<=d-1&&t>=0,()=>`GatherV2: the index value ${t} is not in [0, ${d-1}]`)}let f=s;s??(f=0);let m=p(a.shape),h=H_(i,a,c,f),g=Y({inputs:{x:i},backend:n,attrs:{shape:[h.batchSize,h.outerSize,h.dimSize,h.sliceSize]}}),_=Y({inputs:{x:a},backend:n,attrs:{shape:[h.batchSize,m/h.batchSize]}}),y=[h.batchSize,h.outerSize,m/h.batchSize,h.sliceSize],b=n.bufferSync(_),x=ub(n.bufferSync(g),b,y);return n.disposeIntermediateTensorInfo(g),n.disposeIntermediateTensorInfo(_),n.makeTensorInfo(h.outputShape,x.dtype,x.values)}const FC={kernelName:yt,backendName:`cpu`,kernelFunc:PC};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function IC(e){let{inputs:t,backend:n}=e,{input:r}=t,i=p(r.shape),a=r.shape[r.shape.length-1],o=i/a,s=Y({inputs:{x:r},backend:n,attrs:{shape:[o,a]}}),c=gC(s,!0,n),l=Y({inputs:{x:c},backend:n,attrs:{shape:r.shape}});return n.disposeIntermediateTensorInfo(s),n.disposeIntermediateTensorInfo(c),l}const LC={kernelName:wt,backendName:`cpu`,kernelFunc:IC},RC={kernelName:Et,backendName:`cpu`,kernelFunc:J(Et,e=>Number.isFinite(e)?1:0,`bool`)},zC={kernelName:Dt,backendName:`cpu`,kernelFunc:J(Dt,e=>Math.abs(e)===1/0?1:0,`bool`)},BC={kernelName:Ot,backendName:`cpu`,kernelFunc:J(Ot,e=>Number.isNaN(e)?1:0,`bool`)};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function VC(e){let{backend:t,attrs:n}=e,{start:r,stop:i,num:a}=n,o=hb(r,i,a);return t.makeTensorInfo([o.length],`float32`,o)}const HC={kernelName:Mt,backendName:`cpu`,kernelFunc:VC},UC={kernelName:Nt,backendName:`cpu`,kernelFunc:J(Nt,e=>Math.log1p(e))},WC={kernelName:Pt,backendName:`cpu`,kernelFunc:qy(Pt,Iy((e,t)=>e&&t),null,`bool`)},GC={kernelName:Ft,backendName:`cpu`,kernelFunc:J(Ft,e=>e?0:1,`bool`)},KC={kernelName:It,backendName:`cpu`,kernelFunc:qy(It,Iy((e,t)=>e||t),null,`bool`)};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function qC(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{depthRadius:a,bias:o,alpha:s,beta:c}=r;q(i,`LRN`);let l=i.shape[3],u=l-1,d=n.data.get(i.dataId).values,f=p(i.shape),m=new Float32Array(f);function h(e){let t=e%l,n=e-t+Math.max(0,t-a),r=e-t+Math.min(t+a,u),i=0;for(;n<=r;n++){let e=d[n];i+=e*e}return i}for(let e=0;e<f;e++){let t=h(e);m[e]=d[e]*(o+s*t)**+-c}return n.makeTensorInfo(i.shape,i.dtype,m)}const JC={kernelName:`LRN`,backendName:`cpu`,kernelFunc:qC};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function YC(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,y:a,dy:o}=t,{depthRadius:s,bias:c,alpha:l,beta:u}=r;q(o,`LRNGrad`);let d=p(o.shape),f=o.shape[3],m=n.data.get(o.dataId).values,h=n.data.get(i.dataId).values,g=n.data.get(a.dataId).values,_=new Float32Array(d),v=d;for(let e=0;e<v;e++){let t=e%f,n=e-t+Math.max(0,t-s),r=e-t+Math.min(f,t+s+1),i=0;for(let e=n;e<r;e++)i+=h[e]**2;i=l*i+c;for(let t=n;t<r;t++){let n=-2*l*u*h[t]*g[e]/i;e===t&&(n+=i**+-u),n*=m[e],_[t]+=n}}return n.makeTensorInfo(o.shape,i.dtype,_)}const XC={kernelName:`LRNGrad`,backendName:`cpu`,kernelFunc:YC};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ZC(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{reductionIndices:a,keepDims:o}=r,s=n,c=i.shape,l=c.length,u=v(a,c),d=u,f=Gl(d,l),m=s.data.get(i.dataId).values;if(f!=null){let e=Array(l);for(let t=0;t<e.length;t++)e[t]=c[f[t]];m=Db(m,c,i.dtype,f,e),d=ql(d.length,l),c=e}q(i,`max`),Wl(`max`,d,l);let[h,g]=Hl(c,d),_=p(g),y=_b(m,_,h,i.dtype),b=s.write(y,h,i.dtype),x=h;return o&&(x=Ul(h,u)),{dataId:b,shape:x,dtype:i.dtype}}const QC={kernelName:`Max`,backendName:`cpu`,kernelFunc:ZC};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function $C(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t;q(i,`maxPool`);let{filterSize:a,strides:o,pad:s,dimRoundingMode:c}=r;l($s(o,1),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${o} and dilations '1'`);let u=zs(i.shape,a,o,1,s,c),d;if(u.filterWidth===1&&u.filterHeight===1&&m(u.inShape,u.outShape))d=By({inputs:{x:i},backend:n});else{let e=n.data.get(i.dataId).values,t=k(i.shape),r=Qx(e,i.shape,i.dtype,t,u,`max`);d=n.makeTensorInfo(u.outShape,i.dtype,r.values)}return d}const ew={kernelName:Rt,backendName:`cpu`,kernelFunc:$C};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function tw(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{filterSize:a,strides:o,pad:s,dimRoundingMode:c,dataFormat:l}=r;q(i,`maxPool3d`);let u=Bs(i.shape,a,o,1,s,c,l),d=n.data.get(i.dataId).values,f=eS(d,i.shape,i.dtype,k(i.shape),u,`max`);return n.makeTensorInfo(f.shape,`float32`,f.values)}const nw={kernelName:zt,backendName:`cpu`,kernelFunc:tw};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function rw(e){let{inputs:t,backend:n,attrs:r}=e,{dy:i,input:a}=t,{filterSize:o,strides:s,pad:c,dimRoundingMode:l}=r;q([i,a],`maxPool3DGrad`);let u=Bs(a.shape,o,s,1,c,l),d=tS(n.bufferSync(a),u),f=u.strideDepth,p=u.strideHeight,m=u.strideWidth,h=u.dilationDepth,g=u.dilationHeight,_=u.dilationWidth,v=u.effectiveFilterDepth,y=u.effectiveFilterHeight,b=u.effectiveFilterWidth,x=v-1-u.padInfo.front,S=b-1-u.padInfo.left,C=y-1-u.padInfo.top,w=R(a.shape,`float32`),T=n.bufferSync(i);for(let e=0;e<u.batchSize;++e)for(let t=0;t<u.inChannels;++t)for(let n=0;n<u.inDepth;++n)for(let r=0;r<u.inHeight;++r)for(let i=0;i<u.inWidth;++i){let a=n-x,o=r-C,s=i-S,c=0;for(let n=0;n<v;n+=h){let r=(a+n)/f;if(!(r<0||r>=u.outDepth||Math.floor(r)!==r))for(let i=0;i<y;i+=g){let a=(o+i)/p;if(!(a<0||a>=u.outHeight||Math.floor(a)!==a))for(let o=0;o<b;o+=_){let l=(s+o)/m;if(l<0||l>=u.outWidth||Math.floor(l)!==l)continue;let f=v*y*b-1-d.get(e,r,a,l,t)===n*y*b+i*b+o?1:0;if(f===0)continue;let p=T.get(e,r,a,l,t);c+=p*f}}}w.set(c,e,n,r,i,t)}return n.makeTensorInfo(w.shape,w.dtype,w.values)}const iw={kernelName:`MaxPool3DGrad`,backendName:`cpu`,kernelFunc:rw};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function aw(e){let{inputs:t,backend:n,attrs:r}=e,{dy:i,input:a,output:o}=t,s=a;q([a,o],`maxPoolGrad`);let{filterSize:c,strides:l,pad:u,dimRoundingMode:d}=r,f=zs(s.shape,c,l,1,u,d),p=n.data.get(s.dataId).values,m=R(f.outShape,s.dtype,$x(p,s.shape,s.dtype,f).values),h=f.strideHeight,g=f.strideWidth,_=f.dilationHeight,v=f.dilationWidth,y=f.effectiveFilterHeight,b=f.effectiveFilterWidth,x=b-1-f.padInfo.left,S=y-1-f.padInfo.top,C=R(s.shape,`float32`),w=n.data.get(i.dataId).values,T=R(i.shape,`float32`,w);for(let e=0;e<f.batchSize;++e)for(let t=0;t<f.inChannels;++t)for(let n=0;n<f.inHeight;++n)for(let r=0;r<f.inWidth;++r){let i=n-S,a=r-x,o=0;for(let n=0;n<y;n+=_){let r=(i+n)/h;if(!(r<0||r>=f.outHeight||Math.floor(r)!==r))for(let i=0;i<b;i+=v){let s=(a+i)/g;if(s<0||s>=f.outWidth||Math.floor(s)!==s)continue;let c=y*b-1-m.get(e,r,s,t)===n*b+i?1:0;if(c===0)continue;let l=T.get(e,r,s,t);o+=l*c}}C.set(o,e,n,r,t)}return n.makeTensorInfo(C.shape,C.dtype,C.values)}const ow={kernelName:`MaxPoolGrad`,backendName:`cpu`,kernelFunc:aw};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function sw(e,t,n,r,i){let a=Qx(e,t,n,k(t),i,`max`),o=$x(e,t,n,i,!0,r);return[a.values,o.values]}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const cw={kernelName:Bt,backendName:`cpu`,kernelFunc:({inputs:e,attrs:t,backend:n})=>{let{x:r}=e,{filterSize:i,strides:a,pad:o,includeBatchInIndex:s}=t,c=n;q(r,`MaxPoolWithArgmax`);let l=c.data.get(r.dataId).values,u=zs(r.shape,i,a,[1,1],o),[d,f]=sw(l,r.shape,r.dtype,s,u),p=c.write(d,u.outShape,r.dtype),m=c.write(f,u.outShape,r.dtype);return[{dataId:p,shape:u.outShape,dtype:r.dtype},{dataId:m,shape:u.outShape,dtype:`int32`}]}};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function lw(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a,keepDims:o}=r,s=v(a,i.shape),c=Hl(i.shape,s)[1],l=p(c),u=[],d=n.makeTensorInfo([],`float32`,new Float32Array([l]));u.push(d);let f=Gy({inputs:{x:i},backend:n,attrs:{dtype:`float32`}});u.push(f);let m=mC({inputs:{a:f,b:d},backend:n});u.push(m);let h=aC({inputs:{x:m},backend:n,attrs:{axis:a,keepDims:o}});return u.forEach(e=>n.disposeIntermediateTensorInfo(e)),h}const uw={kernelName:Vt,backendName:`cpu`,kernelFunc:lw};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function dw(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a,keepDims:o}=r;q(i,`min`);let s=v(a,i.shape),c=s,l=Gl(c,i.shape.length),u=i;l!=null&&(u=Ob({inputs:{x:i},backend:n,attrs:{perm:l}}),c=ql(c.length,i.shape.length)),Wl(`min`,c,u.shape.length);let[d,f]=Hl(u.shape,c),m=p(f),h=A(p(d),u.dtype),g=n.data.get(u.dataId).values;for(let e=0;e<h.length;++e){let t=e*m,n=g[t];for(let e=0;e<m;++e){let r=g[t+e];(Number.isNaN(r)||r<n)&&(n=r)}h[e]=n}l!=null&&n.disposeIntermediateTensorInfo(u);let _=n.makeTensorInfo(d,u.dtype,h);if(o){let e=Ul(d,s),t=Y({inputs:{x:_},backend:n,attrs:{shape:e}});return n.disposeIntermediateTensorInfo(_),t}return _}const fw={kernelName:`Min`,backendName:`cpu`,kernelFunc:dw};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function pw(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{paddings:a,mode:o}=r;q(i,`mirrorPad`);let s=a.map((e,t)=>e[0]+i.shape[t]+e[1]),c=a.map(e=>e[0]),l=a.map((e,t)=>e[0]+i.shape[t]),u=o===`reflect`?0:1,d=n.data.get(i.dataId).values,f=i.shape.length,m=k(i.shape),h=p(s),g=s.length,_=k(s),v=b(i.dtype,h);for(let e=0;e<h;e++){let t=ue(e,g,_);for(let e=0;e<g;e++)t[e]<c[e]?t[e]=c[e]*2-t[e]-u:t[e]>=l[e]&&(t[e]=(l[e]-1)*2-t[e]+u);t=t.map((e,t)=>e-c[t]),v[e]=d[le(t,f,m)]}return{dataId:n.write(v,s,i.dtype),shape:s,dtype:i.dtype}}const mw={kernelName:Ut,backendName:`cpu`,kernelFunc:pw},hw={kernelName:`Mod`,backendName:`cpu`,kernelFunc:qy(`Mod`,Iy(((e,t)=>{let n=e%t;return e<0&&t<0||e>=0&&t>=0?n:(n+t)%t})))};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function gw(e){let{inputs:t,backend:n,attrs:r}=e,{logits:i}=t,{dim:a}=r,o=i.shape.length,s=a;if(s===-1&&(s=o-1),s!==o-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${o} and dim was ${s}`);let c=v([s],i.shape),l=ZC({inputs:{x:i},backend:n,attrs:{reductionIndices:c,keepDims:!1}}),u=Ul(l.shape,c),d=Y({inputs:{x:l},backend:n,attrs:{shape:u}}),f=dx({inputs:{a:i,b:d},backend:n}),p=ab({inputs:{x:f},backend:n}),m=aC({inputs:{x:p},backend:n,attrs:{axis:c,keepDims:!1}}),h=Y({inputs:{x:m},backend:n,attrs:{shape:u}}),g=mC({inputs:{a:p,b:h},backend:n});return n.disposeIntermediateTensorInfo(l),n.disposeIntermediateTensorInfo(d),n.disposeIntermediateTensorInfo(f),n.disposeIntermediateTensorInfo(p),n.disposeIntermediateTensorInfo(m),n.disposeIntermediateTensorInfo(h),g}const _w={kernelName:On,backendName:`cpu`,kernelFunc:gw};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function vw(e){let{inputs:t,backend:n,attrs:r}=e,{logits:i}=t,{numSamples:a,seed:o,normalized:s}=r;q(i,`multinomial`);let c=s?i:gw({inputs:{logits:i},backend:n,attrs:{dim:-1}}),l=c.shape[0],u=c.shape[1],d=n.data.get(c.dataId).values,f=[l,a],m=A(p(f),`int32`);for(let e=0;e<l;++e){let t=e*u,n=new Float32Array(u-1);n[0]=d[t];for(let e=1;e<n.length;++e)n[e]=n[e-1]+d[t+e];let r=Vf.alea(o.toString()),i=e*a;for(let e=0;e<a;++e){let t=r();m[i+e]=n.length;for(let r=0;r<n.length;r++)if(t<n[r]){m[i+e]=r;break}}}return s||n.disposeIntermediateTensorInfo(c),n.makeTensorInfo(f,`int32`,m)}const yw={kernelName:Wt,backendName:`cpu`,kernelFunc:vw},bw=Ph;function xw(e){let{inputs:t,backend:n,attrs:r}=e,{boxes:i,scores:a}=t,{maxOutputSize:o,iouThreshold:s,scoreThreshold:c}=r;q(i,`NonMaxSuppression`);let l=n.data.get(i.dataId).values,u=n.data.get(a.dataId).values,{selectedIndices:d}=bw(l,u,o,s,c);return n.makeTensorInfo([d.length],`int32`,new Int32Array(d))}const Sw={kernelName:qt,backendName:`cpu`,kernelFunc:xw},Cw=Fh;function ww(e){let{inputs:t,backend:n,attrs:r}=e,{boxes:i,scores:a}=t,{maxOutputSize:o,iouThreshold:s,scoreThreshold:c,padToMaxOutputSize:l}=r;q(i,`NonMaxSuppressionPadded`);let u=n.data.get(i.dataId).values,d=n.data.get(a.dataId).values,{selectedIndices:f,validOutputs:p}=Cw(u,d,o,s,c,l);return[n.makeTensorInfo([f.length],`int32`,new Int32Array(f)),n.makeTensorInfo([],`int32`,new Int32Array([p]))]}const Tw={kernelName:Jt,backendName:`cpu`,kernelFunc:ww},Ew=Ih;function Dw(e){let{inputs:t,backend:n,attrs:r}=e,{boxes:i,scores:a}=t,{maxOutputSize:o,iouThreshold:s,scoreThreshold:c,softNmsSigma:l}=r;q(i,`NonMaxSuppressionWithScore`);let u=n.data.get(i.dataId).values,d=n.data.get(a.dataId).values,{selectedIndices:f,selectedScores:p}=Ew(u,d,o,s,c,l);return[n.makeTensorInfo([f.length],`int32`,new Int32Array(f)),n.makeTensorInfo([p.length],`float32`,new Float32Array(p))]}const Ow={kernelName:Yt,backendName:`cpu`,kernelFunc:Dw};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function kw(e){let{inputs:t,backend:n,attrs:r}=e,{indices:i}=t,{dtype:a,depth:o,onValue:s,offValue:c}=r;q(i,`oneHot`);let l=p(i.shape),u=new Float32Array(l*o);u.fill(c);let d=n.data.get(i.dataId).values;for(let e=0;e<l;++e)d[e]>=0&&d[e]<o&&(u[e*o+d[e]]=s);return n.makeTensorInfo([...i.shape,o],a,u)}const Aw={kernelName:Zt,backendName:`cpu`,kernelFunc:kw};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function jw(e){let{inputs:t,backend:n}=e,{x:r}=t;if(r.dtype===`string`)throw Error(`zerosLike is not supported for string tensors`);if(r.dtype===`complex64`){let e=Hy({inputs:{input:r},backend:n}),t=jw({inputs:{x:e},backend:n}),i=bS({inputs:{input:r},backend:n}),a=jw({inputs:{x:i},backend:n}),o=Ly({inputs:{real:t,imag:a},backend:n});return n.disposeIntermediateTensorInfo(e),n.disposeIntermediateTensorInfo(t),n.disposeIntermediateTensorInfo(i),n.disposeIntermediateTensorInfo(a),o}else return CC({backend:n,attrs:{shape:r.shape,value:0,dtype:r.dtype}})}const Mw={kernelName:qn,backendName:`cpu`,kernelFunc:jw};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Nw(e){let{inputs:t,backend:n}=e,{x:r}=t;if(r.dtype===`string`)throw Error(`onesLike is not supported for string tensors`);if(r.dtype===`complex64`){let e=Hy({inputs:{input:r},backend:n}),t=Nw({inputs:{x:e},backend:n}),i=bS({inputs:{input:r},backend:n}),a=jw({inputs:{x:i},backend:n}),o=Ly({inputs:{real:t,imag:a},backend:n});return n.disposeIntermediateTensorInfo(e),n.disposeIntermediateTensorInfo(t),n.disposeIntermediateTensorInfo(i),n.disposeIntermediateTensorInfo(a),o}else return CC({backend:n,attrs:{shape:r.shape,value:1,dtype:r.dtype}})}const Pw={kernelName:Xt,backendName:`cpu`,kernelFunc:Nw};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Fw(e){let{inputs:t,backend:n,attrs:r}=e,{axis:i}=r;if(t.length===1)return fC({inputs:{input:t[0]},backend:n,attrs:{dim:i}});let a=t[0].shape,o=t[0].dtype;t.forEach(e=>{u(a,e.shape,`All tensors passed to stack must have matching shapes`),l(o===e.dtype,()=>`All tensors passed to stack must have matching dtypes`)});let s=[],c=SS({inputs:t.map(e=>{let t=fC({inputs:{input:e},backend:n,attrs:{dim:i}});return s.push(t),t}),backend:n,attrs:{axis:i}});return s.forEach(e=>n.disposeIntermediateTensorInfo(e)),c}const Iw={kernelName:Qt,backendName:`cpu`,kernelFunc:Fw};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Lw(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{paddings:a,constantValue:o}=r;q(i,`pad`);let s=a.map((e,t)=>e[0]+i.shape[t]+e[1]),c=a.map(e=>e[0]),l=n.data.get(i.dataId).values,u=p(i.shape),d=i.shape.length,f=k(i.shape),m=p(s),h=s.length,g=k(s),_=b(i.dtype,m);o!==0&&_.fill(o);for(let e=0;e<u;e++){let t=le(ue(e,d,f).map((e,t)=>e+c[t]),h,g);_[t]=l[e]}return{dataId:n.write(_,s,i.dtype),shape:s,dtype:i.dtype}}const Rw={kernelName:$t,backendName:`cpu`,kernelFunc:Lw},zw={kernelName:`Pow`,backendName:`cpu`,kernelFunc:qy(`Pow`,Iy((e,t)=>e**+t))};
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Bw(e){let{inputs:t,backend:n,attrs:r}=e,{paramsNestedSplits:i,paramsDenseValues:a,indices:o}=t,s=i.map(e=>n.data.get(e.dataId).values),c=i.map(e=>e.shape),l=n.data.get(a.dataId).values,u=n.data.get(o.dataId).values,[d,f,p]=Bb(s,c,l,a.shape,a.dtype,u,o.shape),m=d.map(e=>n.makeTensorInfo([e.length],`int32`,e)),h=n.makeTensorInfo(p,a.dtype,f);return m.concat([h])}const Vw={kernelName:nn,backendName:`cpu`,kernelFunc:Bw};
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Hw(e){let{inputs:t,backend:n,attrs:r}=e,{shape:i,values:a,defaultValue:o,rowPartitionTensors:s}=t,{rowPartitionTypes:c}=r,l=n.data.get(i.dataId).values,u=n.data.get(a.dataId).values,d=n.data.get(o.dataId).values,f=s.map(e=>n.data.get(e.dataId).values),p=s.map(e=>e.shape),[m,h]=Gb(l,i.shape,u,a.shape,a.dtype,d,o.shape,f,p,c);return n.makeTensorInfo(m,a.dtype,h)}const Uw={kernelName:rn,backendName:`cpu`,kernelFunc:Hw};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ww(e){let{backend:t,attrs:n}=e,{start:r,stop:i,dtype:a,step:o}=n,s=Kb(r,i,o,a);return t.makeTensorInfo([s.length],a,s)}const Gw={kernelName:an,backendName:`cpu`,kernelFunc:Ww},Kw={kernelName:sn,backendName:`cpu`,kernelFunc:J(sn,e=>1/e)};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function qw(e){let{inputs:t,backend:n,attrs:r}=e,{images:i}=t,{alignCorners:a,halfPixelCenters:o,size:s}=r;q(i,`resizeBilinear`);let c=k(i.shape),[l,u]=s,[d,f,m,h]=i.shape,g=n.data.get(i.dataId).values,_=new Float32Array(p([d,l,u,h])),v=[a&&l>1?f-1:f,a&&u>1?m-1:m],y=[a&&l>1?l-1:l,a&&u>1?u-1:u],b=0,x=v[0]/y[0],S=v[1]/y[1];for(let e=0;e<d;e++)for(let t=0;t<l;t++){let n;n=o?x*(t+.5)-.5:x*t;let r=Math.max(0,Math.floor(n)),i=n-r,a=Math.min(f-1,Math.ceil(n)),s=e*c[0]+r*c[1],l=e*c[0]+a*c[1];for(let e=0;e<u;e++){let t;t=o?S*(e+.5)-.5:S*e;let n=Math.max(0,Math.floor(t)),r=t-n,a=Math.min(m-1,Math.ceil(t)),u=s+n*c[2],d=l+n*c[2],f=s+a*c[2],p=l+a*c[2];for(let e=0;e<h;e++){let t=g[u+e],n=g[d+e],a=g[f+e],o=g[p+e],s=t+(a-t)*r,c=s+(n+(o-n)*r-s)*i;_[b++]=c}}}return n.makeTensorInfo([d,l,u,h],`float32`,_)}const Jw={kernelName:dn,backendName:`cpu`,kernelFunc:qw};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Yw(e){let{inputs:t,backend:n,attrs:r}=e,{images:i,dy:a}=t,{alignCorners:o}=r;q([a,i],`resizeBilinearGrad`);let s=k(i.shape),[c,l,u,d]=i.shape,[,f,p]=a.shape,m=new Float32Array(c*l*u*d),h=[o&&f>1?l-1:l,o&&p>1?u-1:u],g=[o&&f>1?f-1:f,o&&p>1?p-1:p],_=h[0]/g[0],v=h[1]/g[1],y=n.data.get(a.dataId).values,b=0;for(let e=0;e<c;e++){let t=e*s[0];for(let e=0;e<f;e++){let n=e*_,r=Math.floor(n),i=Math.min(Math.ceil(n),l-1),a=t+r*s[1],o=t+i*s[1],c=n-r,f=1-c;for(let e=0;e<p;e++){let t=e*v,n=Math.floor(t),r=Math.min(Math.ceil(t),u-1),i=t-n,l=1-i,p=a+n*s[2],h=a+r*s[2],g=o+n*s[2],_=o+r*s[2],x=f*l,S=f*i,C=c*l,w=c*i;for(let e=0;e<d;e++){let t=y[b++];m[p+e]+=t*x,m[h+e]+=t*S,m[g+e]+=t*C,m[_+e]+=t*w}}}}return n.makeTensorInfo([c,u,l,d],`float32`,m)}const Xw={kernelName:`ResizeBilinearGrad`,backendName:`cpu`,kernelFunc:Yw};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Zw(e){let{inputs:t,backend:n,attrs:r}=e,{images:i}=t,{alignCorners:a,halfPixelCenters:o,size:s}=r;q(i,`resizeNearestNeighbor`);let c=k(i.shape),[l,u]=s,[d,f,p,m]=i.shape,h=n.data.get(i.dataId).values,g=new Float32Array(d*l*u*m),_=[a&&l>1?f-1:f,a&&u>1?p-1:p],v=[a&&l>1?l-1:l,a&&u>1?u-1:u],y=_[0]/v[0],b=_[1]/v[1],x=0;for(let e=0;e<d;e++){let t=e*c[0];for(let e=0;e<l;e++){let n=o?y*(e+.5):y*e,r=Math.min(f-1,a?Math.round(n):Math.floor(n));o&&(r=Math.max(0,r));let i=t+r*c[1];for(let e=0;e<u;e++){let t=o?b*(e+.5):b*e,n=Math.min(p-1,a?Math.round(t):Math.floor(t));o&&(n=Math.max(0,n));let r=i+n*c[2];for(let e=0;e<m;e++){let t=h[r+e];g[x++]=t}}}}return n.makeTensorInfo([d,l,u,m],i.dtype,g)}const Qw={kernelName:un,backendName:`cpu`,kernelFunc:Zw};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function $w(e){let{inputs:t,backend:n,attrs:r}=e,{images:i,dy:a}=t,{alignCorners:o}=r;q([a,i],`resizeNearestNeighborGrad`);let s=k(i.shape),c=k(a.shape),[l,u,d,f]=i.shape,[,p,m]=a.shape,h=new Float32Array(l*u*d*f),g=n.data.get(a.dataId).values,_=[o&&p>1?u-1:u,o&&m>1?d-1:d],v=[o&&p>1?p-1:p,o&&m>1?m-1:m],y=_[0]/v[0],b=_[1]/v[1],x=1/y,S=1/b,C=Math.ceil(x)*2+2,w=Math.ceil(S)*2+2;for(let e=0;e<l;e++){let t=e*s[0];for(let e=0;e<u;e++){let n=t+e*s[1],r=Math.floor(e*x),i=Math.floor(r-C/2);for(let r=0;r<d;r++){let a=n+r*s[2],l=Math.floor(r*S),_=Math.floor(l-w/2);for(let n=0;n<f;n++){let s=0;for(let a=0;a<C;a++){let l=a+i;if(l<0||l>=p)continue;let f=t+l*c[1],h=l*y,v=Math.min(u-1,o?Math.round(h):Math.floor(h));if(e===v)for(let e=0;e<w;e++){let t=e+_;if(t<0||t>=m)continue;let i=f+t*c[2],a=t*b,l=Math.min(d-1,o?Math.round(a):Math.floor(a));r===l&&(s+=g[i+n])}}h[a+n]=s}}}}return n.makeTensorInfo(i.shape,i.dtype,h)}const eT={kernelName:`ResizeNearestNeighborGrad`,backendName:`cpu`,kernelFunc:$w};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function tT(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{dims:a}=r;q(i,`reverse`);let o=i.shape.length,s=v(a,i.shape);if(o===0)return By({inputs:{x:i},backend:n});let c=new hi(i.shape,i.dtype),l=n.bufferSync(i);for(let e=0;e<c.size;e++){let t=c.indexToLoc(e),n=t.slice();s.forEach(e=>n[e]=i.shape[e]-1-n[e]),c.set(l.get(...n),...t)}return n.makeTensorInfo(c.shape,c.dtype,c.values)}const nT={kernelName:pn,backendName:`cpu`,kernelFunc:tT},rT={kernelName:Yn,backendName:`cpu`,kernelFunc:({inputs:e,attrs:t,backend:n})=>{let{image:r}=e,{radians:i,fillValue:a,center:o}=t,s=n,c=b(r.dtype,p(r.shape)),[l,u,d,f]=r.shape,[m,h]=c_(o,u,d),g=Math.sin(i),_=Math.cos(i),v=s.data.get(r.dataId).values;for(let e=0;e<l;e++){let t=e*d*u*f;for(let e=0;e<u;e++){let n=d*f*e;for(let r=0;r<d;r++){let i=r*f;for(let o=0;o<f;o++){let s=[l,e,r,o],p=s[2],y=s[1],b=(p-m)*_-(y-h)*g,x=(p-m)*g+(y-h)*_;b=Math.round(b+m),x=Math.round(x+h);let S=a;if(typeof a!=`number`&&(S=o===3?255:a[o]),b>=0&&b<d&&x>=0&&x<u){let e=d*f*x,n=b*f;S=v[t+e+n+o]}let C=t+n+i+o;c[C]=S}}}}return{dataId:s.write(c,r.shape,r.dtype),shape:r.shape,dtype:r.dtype}}},iT={kernelName:mn,backendName:`cpu`,kernelFunc:J(mn,e=>{let t=Math.floor(e);return e-t<.5?Math.floor(e):e-t>.5?Math.ceil(e):t%2==0?t:t+1})};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function aT(e){let{inputs:t,backend:n,attrs:r}=e,{indices:i,updates:a}=t,{shape:o}=r,{sliceRank:s,numUpdates:c,sliceSize:l,strides:u,outputSize:d}=Xo(a,i,o),f=Jb(n.bufferSync(i),n.bufferSync(a),o,d,l,c,s,u,0,!0);return n.makeTensorInfo(o,f.dtype,f.values)}const oT={kernelName:gn,backendName:`cpu`,kernelFunc:aT};
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function sT(e,t){let n=0,r=e.length,i=0;for(;n<r;)i=Math.floor((n+r)/2),e[i]<t?n=i+1:r=i;return r}function cT(e,t){let n=0,r=e.length,i=0;for(;n<r;)i=Math.floor((n+r)/2),e[i]<=t?n=i+1:r=i;return r}function lT(e,t,n,r,i,a){let o=x(`int32`,n*i);for(let s=0;s<n;++s){let n=e.slice(s*r,(s+1)*r),c=s*i;for(let e=0;e<i;++e)o[c+e]=a===`left`?sT(n,t[e+c]):cT(n,t[e+c])}return o}
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function uT(e){let{inputs:t,backend:n,attrs:r}=e,{sortedSequence:i,values:a}=t,{side:o}=r,s=n.data.get(i.dataId).values,c=n.data.get(a.dataId).values,l=lT(s,c,i.shape[0],i.shape[1],a.shape[1],o);return n.makeTensorInfo(a.shape,`int32`,l)}const dT={kernelName:_n,backendName:`cpu`,kernelFunc:uT};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function fT(e){let{inputs:t,backend:n}=e,{condition:r,t:i,e:a}=t;q([r,i,a],`select`);let o=r.shape.length,s=n.data.get(r.dataId).values,c=n.data.get(i.dataId).values,l=n.data.get(a.dataId).values,u=ki(i.dtype,a.dtype),d=A(p(i.shape),u),f=0,m=o===0||o>1||i.shape.length===1?1:p(i.shape.slice(1));for(let e=0;e<s.length;e++)for(let t=0;t<m;t++)s[e]===1?d[f++]=c[e]:d[f++]=l[e];return n.makeTensorInfo(i.shape,u,d)}const pT={kernelName:vn,backendName:`cpu`,kernelFunc:fT},mT={kernelName:yn,backendName:`cpu`,kernelFunc:J(yn,e=>e>=0?1.0507009873554805*e:1.7580993408473768*(Math.exp(e)-1))},hT={kernelName:Sn,backendName:`cpu`,kernelFunc:J(Sn,e=>e<0?-1:e>0?1:0)},gT={kernelName:`Sin`,backendName:`cpu`,kernelFunc:J(`Sin`,e=>Math.sin(e))},_T={kernelName:xn,backendName:`cpu`,kernelFunc:J(xn,e=>Math.sinh(e))},vT=Math.log(1.1920928955078125e-7)+2,yT={kernelName:wn,backendName:`cpu`,kernelFunc:J(wn,e=>{let t=e>-vT,n=e<vT,r=Math.exp(e),i;return i=n?r:t?e:Math.log(1+r),i})};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function bT(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{blockShape:a,paddings:o}=r;q([i],`spaceToBatchND`);let s=p(a),c=[[0,0]];c.push(...o);for(let e=1+a.length;e<i.shape.length;++e)c.push([0,0]);let l=Rw.kernelFunc({inputs:{x:i},backend:n,attrs:{paddings:c,constantValue:0}}),u=l_(l.shape,a,s,!1),d=u_(u.length,a.length,!1),f=d_(l.shape,a,s,!1),m=Y({inputs:{x:l},backend:n,attrs:{shape:u}}),h=Ob({inputs:{x:m},backend:n,attrs:{perm:d}}),g=Y({inputs:{x:h},backend:n,attrs:{shape:f}});return n.disposeIntermediateTensorInfo(l),n.disposeIntermediateTensorInfo(m),n.disposeIntermediateTensorInfo(h),g}const xT={kernelName:En,backendName:`cpu`,kernelFunc:bT};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ST(e){let{inputs:t,backend:n}=e,{indices:r,values:i,denseShape:a,defaultValue:o}=t;if(a.shape.length!==1)throw Error(`Dense shape must be a vector, saw:
        ${a.shape}`);if(r.shape.length!==2)throw Error(`Indices must be a matrix, saw:
        ${r.shape}`);if(i.shape.length!==1)throw Error(`Values must be a vector, saw:
        ${i.shape}`);if(o.shape.length!==0)throw Error(`Default value must be a scalar, saw:
        ${o.shape}`);let s=n.data.get(r.dataId).values,c=n.data.get(i.dataId).values,l=n.data.get(a.dataId).values,u=n.data.get(o.dataId).values[0],[d,f,p,m,h]=ex(s,r.shape,r.dtype,c,i.dtype,l,u);return[n.makeTensorInfo(f,r.dtype,d),n.makeTensorInfo([f[0]],i.dtype,p),n.makeTensorInfo([m.length],`bool`,new Uint8Array(m.map(e=>Number(e)))),n.makeTensorInfo([h.length],r.dtype,new Int32Array(h))]}const CT={kernelName:kn,backendName:`cpu`,kernelFunc:ST};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function wT(e){let{inputs:t,backend:n}=e,{inputIndices:r,inputShape:i,newShape:a}=t;if(r.shape.length!==2)throw Error(`Input indices should be a matrix but received shape
        ${r.shape}`);if(i.shape.length!==1)throw Error(`Input shape should be a vector but received shape
        ${i.shape}`);if(a.shape.length!==1)throw Error(`Target shape should be a vector but received shape ${a.shape}`);let o=Array.from(n.data.get(i.dataId).values),s=n.data.get(r.dataId).values,c=Array.from(n.data.get(a.dataId).values),[l,u,d]=tx(s,r.shape,r.dtype,o,c);return[n.makeTensorInfo(u,r.dtype,l),n.makeTensorInfo([d.length],a.dtype,new Int32Array(d))]}const TT={kernelName:An,backendName:`cpu`,kernelFunc:wT};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ET(e){let{inputs:t,backend:n}=e,{data:r,indices:i,segmentIds:a}=t;if(r.shape.length<1)throw Error(`Data should be at least 1 dimensional but received scalar`);if(i.shape.length!==1)throw Error(`Indices should be a vector but received shape
          ${i.shape}`);if(a.shape.length!==1)throw Error(`Segment ids should be a vector but received shape
          ${a.shape}`);if(i.shape[0]!==a.shape[0])throw Error(`segmentIds and indices should have same size.`);let o=n.data.get(r.dataId).values,s=n.data.get(i.dataId).values,c=n.data.get(a.dataId).values,[l,u]=nx(o,r.shape,r.dtype,s,c,!0);return n.makeTensorInfo(u,r.dtype,l)}const DT={kernelName:jn,backendName:`cpu`,kernelFunc:ET};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function OT(e){let{inputs:t,backend:n}=e,{data:r,indices:i,segmentIds:a}=t;if(r.shape.length<1)throw Error(`Data should be at least 1 dimensional but received scalar`);if(i.shape.length!==1)throw Error(`Indices should be a vector but received shape
         ${i.shape}`);if(a.shape.length!==1)throw Error(`Segment ids should be a vector but received shape
         ${a.shape}`);if(i.shape[0]!==a.shape[0])throw Error(`segmentIds and indices should have same size.`);let o=n.data.get(r.dataId).values,s=n.data.get(i.dataId).values,c=n.data.get(a.dataId).values,[l,u]=nx(o,r.shape,r.dtype,s,c);return n.makeTensorInfo(u,r.dtype,l)}const kT={kernelName:Mn,backendName:`cpu`,kernelFunc:OT};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function AT(e){let{inputs:t,backend:n,attrs:r}=e,{sparseIndices:i,sparseValues:a,defaultValue:o}=t,{outputShape:s}=r,{sliceRank:c,numUpdates:l,sliceSize:u,strides:d,outputSize:f}=Xo(a,i,s),p=n.bufferSync(i),m;switch(a.dtype){case`bool`:m=Jb(p,n.bufferSync(a),s,f,u,l,c,d,!!n.data.get(o.dataId).values[0],!1);break;case`float32`:{let e=n.bufferSync(a),t=n.data.get(o.dataId).values[0];m=Jb(p,e,s,f,u,l,c,d,t,!1);break}case`int32`:{let e=n.bufferSync(a),t=n.data.get(o.dataId).values[0];m=Jb(p,e,s,f,u,l,c,d,t,!1);break}case`string`:m=Jb(p,n.bufferSync(a),s,f,u,l,c,d,ri(n.data.get(o.dataId).values[0]),!1);break;default:throw Error(`Unsupported type ${a.dtype}`)}return n.makeTensorInfo(s,m.dtype,m.values)}const jT={kernelName:Nn,backendName:`cpu`,kernelFunc:AT};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function MT(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{numOrSizeSplits:a,axis:o}=r,s=v(o,i.shape)[0],c=k_(i,a,s),l=Array(i.shape.length).fill(0),u=i.shape.slice();return c.map(e=>{let t=[...u];t[s]=e;let r=Qb({inputs:{x:i},backend:n,attrs:{begin:l,size:t}});return l[s]+=e,r})}const NT={kernelName:Dn,backendName:`cpu`,kernelFunc:MT},PT={kernelName:`Square`,backendName:`cpu`,kernelFunc:({inputs:e,backend:t})=>{let{x:n}=e,r=t;q(n,`square`);let i=r.data.get(n.dataId).values,a=new Float32Array(i.length);for(let e=0;e<i.length;++e){let t=i[e];a[e]=t*t}return{dataId:r.write(a,n.shape,n.dtype),shape:n.shape,dtype:n.dtype}}},FT={kernelName:Jn,backendName:`cpu`,kernelFunc:J(Jn,(e,t)=>{let n=t;return isNaN(e)?NaN:e>0?1:n.alpha})};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function IT(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{begin:a,end:o,strides:s,beginMask:c,endMask:u,ellipsisMask:d,newAxisMask:f,shrinkAxisMask:p}=r;q(i,`stridedSlice`);let{finalShapeSparse:m,finalShape:h,isIdentity:g,sliceDim0:_,isSimpleSlice:v,begin:y,end:b,strides:x}=ns(i.shape,a,o,s,c,u,d,f,p),S;if(g)S=Y({inputs:{x:i},backend:n,attrs:{shape:h}});else if(_||v){l(i.shape.length>=1,()=>`Input must have rank at least 1, got: ${i.shape.length}`);let e=Qo(y,b,x),t=Qb({inputs:{x:i},backend:n,attrs:{begin:y,size:e}});S=Y({inputs:{x:t},backend:n,attrs:{shape:h}}),n.disposeIntermediateTensorInfo(t)}else{let e=ax(m,n.bufferSync(i),x,y);S=n.makeTensorInfo(h,e.dtype,e.values)}return S}const LT={kernelName:Fn,backendName:`cpu`,kernelFunc:IT};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function RT(e){let{inputs:t,backend:n,attrs:r}=e,{separator:i,nGramWidths:a,leftPad:o,rightPad:s,padWidth:c,preserveShortSequences:l}=r,{data:u,dataSplits:d}=t,f=n.data.get(u.dataId).values,p=n.data.get(d.dataId).values,[m,h]=sx(f,p,i,a,o,s,c,l);return[n.makeTensorInfo([m.length],`string`,m),n.makeTensorInfo(d.shape,`int32`,h)]}const zT={kernelName:In,backendName:`cpu`,kernelFunc:RT};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function BT(e){let{inputs:t,backend:n,attrs:r}=e,{skipEmpty:i}=r,{input:a,delimiter:o}=t;if(a.dtype!==`string`)throw Error(`Input must be of datatype string`);if(a.shape.length!==1)throw Error(`Input must be a vector, got shape: ${a.shape}`);if(o.shape.length!==0)throw Error(`Delimiter must be a scalar, got shape: ${o.shape}`);let s=n.data.get(a.dataId).values,c=n.data.get(o.dataId).values[0],[l,u,d]=lx(s,c,i),f=u.length;return[n.makeTensorInfo([f,2],`int32`,l),n.makeTensorInfo([f],`string`,u),n.makeTensorInfo([2],`int32`,new Int32Array(d))]}const VT={kernelName:Ln,backendName:`cpu`,kernelFunc:BT};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function HT(e){let{inputs:t,backend:n,attrs:r}=e,{numBuckets:i}=r,{input:a}=t;if(a.dtype!==`string`)throw Error(`Input must be of datatype string`);if(i<=0)throw Error(`Number of buckets must be at least 1`);let o=n.data.get(a.dataId).values,s=ux(o,i);return n.makeTensorInfo(a.shape,`int32`,s)}const UT={kernelName:Rn,backendName:`cpu`,kernelFunc:HT},WT={kernelName:`Tan`,backendName:`cpu`,kernelFunc:J(`Tan`,e=>Math.tan(e))},GT={kernelName:zn,backendName:`cpu`,kernelFunc:J(zn,e=>Math.tanh(e))};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function KT(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{reps:a}=r;q(i,`tile`);let o=px(n.bufferSync(i),a);return n.makeTensorInfo(o.shape,o.dtype,o.values)}const qT={kernelName:Bn,backendName:`cpu`,kernelFunc:KT};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function JT(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{k:a,sorted:o}=r;q(i,`topk`);let s=n.data.get(i.dataId).values,[c,l]=gx(s,i.shape,i.dtype,a,o);return[n.makeTensorInfo(c.shape,c.dtype,c.values),n.makeTensorInfo(l.shape,l.dtype,l.values)]}const YT={kernelName:Vn,backendName:`cpu`,kernelFunc:JT};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function XT(e){let{inputs:t,attrs:n,backend:r}=e,{image:i,transforms:a}=t,{interpolation:o,fillMode:s,fillValue:c,outputShape:l}=n,[u,d,f,m]=i.shape,[h,g]=l??[d,f],_=[u,h,g,m],v=k(i.shape),y=v[0],x=v[1],S=v[2],C=k(_),w=C[0],T=C[1],E=C[2],D=b(i.dtype,p(_));D.fill(c);let O=r.data.get(i.dataId).values,ee=r.data.get(a.dataId).values;for(let e=0;e<u;++e){let t=a.shape[0]===1?ee:ee.subarray(e*8,e*8+8);for(let n=0;n<h;++n)for(let r=0;r<g;++r)for(let i=0;i<m;++i){let a,l=t[6]*r+t[7]*n+1;if(l===0)continue;let u=(t[0]*r+t[1]*n+t[2])/l,p=(t[3]*r+t[4]*n+t[5])/l,m=QT(u,f,s),h=QT(p,d,s);switch(o){case`nearest`:a=iE(O,d,f,y,x,S,e,h,m,i,c);break;case`bilinear`:a=aE(O,d,f,y,x,S,e,h,m,i,c);break;default:throw Error(`Error in Transform: Expect 'nearest' or 'bilinear', but got ${o}`)}let g=e*w+n*T+r*E+i;D[g]=a}return r.makeTensorInfo(_,i.dtype,D)}return{dataId:r.write(D,_,i.dtype),shape:i.shape,dtype:i.dtype}}const ZT={kernelName:Hn,backendName:`cpu`,kernelFunc:XT};function QT(e,t,n){switch(n){case`reflect`:return $T(e,t);case`wrap`:return eE(e,t);case`nearest`:return nE(e,t);case`constant`:default:return tE(e)}}function $T(e,t){let n=e;if(n<0)if(t<=1)n=0;else{let e=2*t;n<e&&(n=e*Math.trunc(-n/e)+n),n=n<-t?n+e:-n-1}else if(n>t-1)if(t<=1)n=0;else{let e=2*t;n-=e*Math.trunc(n/e),n>=t&&(n=e-n-1)}return s(0,n,t-1)}function eE(e,t){let n=e;if(n<0)if(t<=1)n=0;else{let e=t-1;n+=t*(Math.trunc(-n/e)+1)}else if(n>t-1)if(t<=1)n=0;else{let e=t-1;n-=t*Math.trunc(n/e)}return s(0,n,t-1)}function tE(e,t){return e}function nE(e,t){return s(0,e,t-1)}function rE(e,t,n,r,i,a,o,s,c,l,u){let d=o*r+s*i+c*a+l;return 0<=s&&s<t&&0<=c&&c<n?e[d]:u}function iE(e,t,n,r,i,a,o,s,c,l,u){return rE(e,t,n,r,i,a,o,Math.round(s),Math.round(c),l,u)}function aE(e,t,n,r,i,a,o,s,c,l,u){let d=Math.floor(s),f=Math.floor(c),p=d+1,m=f+1,h=(m-c)*rE(e,t,n,r,i,a,o,d,f,l,u)+(c-f)*rE(e,t,n,r,i,a,o,d,m,l,u),g=(m-c)*rE(e,t,n,r,i,a,o,p,f,l,u)+(c-f)*rE(e,t,n,r,i,a,o,p,m,l,u);return(p-s)*h+(s-d)*g}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the License);
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an AS IS BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function oE(e){let{inputs:t,attrs:n,backend:r}=e,{axis:i}=n,{x:a}=t;q(a,`unique`);let o=r.data.get(a.dataId).values,{outputValues:s,outputShape:c,indices:l}=_x(o,i,a.shape,a.dtype);return[r.makeTensorInfo(c,a.dtype,s),r.makeTensorInfo([l.length],`int32`,l)]}const sE={kernelName:Wn,backendName:`cpu`,kernelFunc:oE};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function cE(e){let{inputs:t,backend:n,attrs:r}=e,{value:i}=t,{axis:a}=r;a<0&&(a+=i.shape.length);let o=i.shape.length,s=i.shape[a],c=Array(o-1),l=0;for(let e=0;e<o;e++)e!==a&&(c[l++]=i.shape[e]);let u=Array(o).fill(0),d=i.shape.slice();d[a]=1;let f=Array(s);for(let e=0;e<f.length;e++){u[a]=e;let t=Qb({inputs:{x:i},backend:n,attrs:{begin:u,size:d}});f[e]=Y({inputs:{x:t},backend:n,attrs:{shape:c}}),n.disposeIntermediateTensorInfo(t)}return f}const lE={kernelName:Gn,backendName:`cpu`,kernelFunc:cE};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function uE(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,segmentIds:a}=t,{numSegments:o}=r;q(i,`unsortedSegmentSum`);let s=i.shape.length,c=a.shape.length,l=[],u=[],d=s-c,f=a;for(let e=0;e<d;++e){let t=fC({inputs:{input:f},backend:n,attrs:{dim:e+1}});f=t,u.push(t)}for(let e=0;e<o;++e){let t=Qr(e,`int32`),r=n.makeTensorInfo([],`int32`,t),a=rb({inputs:{a:r,b:f},backend:n}),o=Gy({inputs:{x:a},backend:n,attrs:{dtype:`float32`}}),s=xb({inputs:{a:o,b:i},backend:n}),c=aC({inputs:{x:s},backend:n,attrs:{axis:0,keepDims:!1}});l.push(c),u.push(r),u.push(a),u.push(o),u.push(s),u.push(c)}let p=Fw({inputs:l,backend:n,attrs:{axis:0}});return u.forEach(e=>n.disposeIntermediateTensorInfo(e)),p}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const dE=[Px,Fy,Fx,Ix,Xy,Rx,Bx,Hx,Wx,Kx,qx,Jx,Yx,Xx,Zx,rS,aS,sS,lS,Mx,dS,pS,hS,_S,Ky,tb,vS,Ry,yS,CS,TS,DS,kS,jS,NS,FS,IS,LS,zS,VS,US,GS,qS,YS,ZS,$S,tC,nC,rC,iC,cC,yx,uC,ib,dC,ob,pC,sb,SC,wC,EC,cb,DC,kC,jC,NC,FC,db,fb,Vy,LC,xS,RC,zC,BC,xx,pb,mb,HC,gb,UC,WC,GC,KC,JC,XC,QC,vb,ew,nw,iw,ow,cw,uw,fw,yb,mw,hw,yw,Sb,Tb,Sw,Tw,Ow,Eb,Aw,Pw,Iw,Rw,zw,wx,Mb,Vw,Uw,Gw,Uy,hC,Kw,Ex,Ox,Ax,Jw,Xw,Qw,eT,nT,rT,iT,qb,oT,dT,pT,mT,Xb,hT,gT,_T,$b,_w,yT,xT,CT,TT,DT,kT,jT,NT,rx,PT,ix,FT,LT,zT,VT,UT,fx,oC,WT,GT,qT,YT,ZT,kb,sE,lE,{kernelName:Kn,backendName:`cpu`,kernelFunc:uE},Mw];for(let e of dE)ar(e);var fE=function(){function e(e,t){this.modelJSON=e,this.weights=t}return e.prototype.load=function(){return n(this,void 0,void 0,function(){var e,t,n=this;return r(this,function(r){if(e=this.modelJSON.modelTopology,t=this.modelJSON.weightsManifest,e===null&&t===null)throw Error(`The model contains neither model topology or manifest for weights.`);return[2,this.getModelArtifactsForJSON(this.modelJSON,function(e){return n.loadWeights(e)})]})})},e.prototype.getModelArtifactsForJSON=function(e,t){return n(this,void 0,void 0,function(){var n,i,a,o;return r(this,function(r){switch(r.label){case 0:return n={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy},e.trainingConfig!==null&&(n.trainingConfig=e.trainingConfig),e.weightsManifest===null?[3,2]:[4,t(e.weightsManifest)];case 1:i=r.sent(),a=i[0],o=i[1],n.weightSpecs=a,n.weightData=o,r.label=2;case 2:return e.signature!==null&&(n.signature=e.signature),e.userDefinedMetadata!==null&&(n.userDefinedMetadata=e.userDefinedMetadata),e.modelInitializer!==null&&(n.modelInitializer=e.modelInitializer),[2,n]}})})},e.prototype.loadWeights=function(e){return n(this,void 0,void 0,function(){var t,n,i,a;return r(this,function(r){for(t=[],n=0,i=e;n<i.length;n++)a=i[n],t.push.apply(t,a.weights);return[2,[t,this.weights]]})})},e}(),pE=function(){function e(t){this._modelJsonLoaderFunc=t?.modelJsonLoaderFunc,this._weightsLoaderFunc=t?.weightsLoaderFunc,this._minContentSize=t?.minContentSize??e.DEFAULT_MIN_CONTENT_SIZE,this._maxContentSize=t?.maxContentSize??e.DEFAULT_MAX_CONTENT_SIZE,this._normalizeNewline=t?.normalizeNewline??!0}return e.prototype.getModelJSON=function(){return n(this,void 0,void 0,function(){var e;return r(this,function(t){switch(t.label){case 0:return this._modelJson?[2,this._modelJson]:(e=this,[4,this._modelJsonLoaderFunc()]);case 1:return e._modelJson=t.sent(),[2,this._modelJson]}})})},e.prototype.getWeights=function(){return n(this,void 0,void 0,function(){var e;return r(this,function(t){switch(t.label){case 0:return this._weights?[2,this._weights]:(e=this,[4,this._weightsLoaderFunc()]);case 1:return e._weights=t.sent(),[2,this._weights]}})})},e.prototype.loadModel=function(){return n(this,void 0,void 0,function(){var e,t,n,i;return r(this,function(r){switch(r.label){case 0:return this._model?[2]:(e=j(),e.set(`IS_NODE`,!1),e.set(`PROD`,!0),[4,No(`cpu`)]);case 1:if(!r.sent())throw Error(`Unable to set backend to CPU.`);return[4,this.getModelJSON()];case 2:return t=r.sent(),[4,this.getWeights()];case 3:return n=r.sent(),i=this,[4,Ay(new fE(t,n))];case 4:return i._model=r.sent(),[2]}})})},e.prototype.runModel=function(e){return n(this,void 0,void 0,function(){var t,n,i,a,o,s,c,l,c;return r(this,function(r){switch(r.label){case 0:return!e||e.length<this._minContentSize?[2,[]]:[4,this.loadModel()];case 1:return r.sent(),e.length>=this._maxContentSize&&(e=e.substring(0,this._maxContentSize)),this._normalizeNewline&&(e=e.replace(/\r\n/g,`
`)),[4,this._model.executeAsync(Zi([e]))];case 2:for(t=r.sent(),n=Array.isArray(t)?t[0]:t,i=Array.isArray(t)?t[1]:t,a=n.dataSync(),o=i.dataSync(),s=[],c=0;c<o.length;c++)s.push({languageId:o[c],confidence:a[c]});for(l=0,c=0;c<a.length;c++)a[c]>a[l]&&(l=c);return[2,s.sort(function(e,t){return t.confidence-e.confidence})]}})})},e.prototype.dispose=function(){var e;(e=this._model)==null||e.dispose()},e.DEFAULT_MAX_CONTENT_SIZE=1e5,e.DEFAULT_MIN_CONTENT_SIZE=20,e}();const mE=globalThis.performance.now.bind(globalThis.performance);var hE=class e{static create(t){return new e(t)}constructor(e){this._now=e===!1?Date.now:mE,this._startTime=this._now(),this._stopTime=-1}stop(){this._stopTime=this._now()}reset(){this._startTime=this._now(),this._stopTime=-1}elapsed(){return this._stopTime===-1?this._now()-this._startTime:this._stopTime-this._startTime}},gE=class e{static{this.CHANNEL_NAME=`languageDetectionWorkerHost`}static getChannel(t){return t.getChannel(e.CHANNEL_NAME)}static setChannel(t,n){t.setChannel(e.CHANNEL_NAME,n)}},_E;function vE(e,t){let n=Object.create(null);for(let r of e){let e=t(r),i=n[e];i||=n[e]=[],i.push(r)}return n}(class{static{_E=Symbol.toStringTag}constructor(e,t){this.toKey=t,this._map=new Map,this[_E]=`SetWithKey`;for(let t of e)this.add(t)}get size(){return this._map.size}add(e){let t=this.toKey(e);return this._map.set(t,e),this}delete(e){return this._map.delete(this.toKey(e))}has(e){return this._map.has(this.toKey(e))}*entries(){for(let e of this._map.values())yield[e,e]}keys(){return this.values()}*values(){for(let e of this._map.values())yield e}clear(){this._map.clear()}forEach(e,t){this._map.forEach(n=>e.call(t,n,n,this))}[Symbol.iterator](){return this.values()}});const yE=new class{constructor(){this.listeners=[],this.unexpectedErrorHandler=function(e){setTimeout(()=>{throw e.stack?TE.isErrorNoTelemetry(e)?new TE(e.message+`

`+e.stack):Error(e.message+`

`+e.stack):e},0)}}addListener(e){return this.listeners.push(e),()=>{this._removeListener(e)}}emit(e){this.listeners.forEach(t=>{t(e)})}_removeListener(e){this.listeners.splice(this.listeners.indexOf(e),1)}setUnexpectedErrorHandler(e){this.unexpectedErrorHandler=e}getUnexpectedErrorHandler(){return this.unexpectedErrorHandler}onUnexpectedError(e){this.unexpectedErrorHandler(e),this.emit(e)}onUnexpectedExternalError(e){this.unexpectedErrorHandler(e)}};function bE(e){CE(e)||yE.onUnexpectedError(e)}function xE(e){if(e instanceof Error){let{name:t,message:n,cause:r}=e;return{$isError:!0,name:t,message:n,stack:e.stacktrace||e.stack,noTelemetry:TE.isErrorNoTelemetry(e),cause:r?xE(r):void 0,code:e.code}}return e}const SE=`Canceled`;function CE(e){return e instanceof wE?!0:e instanceof Error&&e.name===SE&&e.message===SE}var wE=class extends Error{constructor(){super(SE),this.name=this.message}};(class e extends Error{static{this._name=`PendingMigrationError`}static is(t){return t instanceof e||t instanceof Error&&t.name===e._name}constructor(t){super(t),this.name=e._name}});var TE=class e extends Error{constructor(e){super(e),this.name=`CodeExpectedError`}static fromError(t){if(t instanceof e)return t;let n=new e;return n.message=t.message,n.stack=t.stack,n}static isErrorNoTelemetry(e){return e.name===`CodeExpectedError`}},EE=class e extends Error{constructor(t){super(t||`An unexpected bug occurred.`),Object.setPrototypeOf(this,e.prototype)}};function DE(e,t,n=0,r=e.length){let i=n,a=r;for(;i<a;){let n=Math.floor((i+a)/2);t(e[n])?i=n+1:a=n}return i-1}(class e{static{this.assertInvariants=!1}constructor(e){this._array=e,this._findLastMonotonousLastIdx=0}findLastMonotonous(t){if(e.assertInvariants){if(this._prevFindLastPredicate){for(let e of this._array)if(this._prevFindLastPredicate(e)&&!t(e))throw Error(`MonotonousArray: current predicate must be weaker than (or equal to) the previous predicate.`)}this._prevFindLastPredicate=t}let n=DE(this._array,t,this._findLastMonotonousLastIdx);return this._findLastMonotonousLastIdx=n+1,n===-1?void 0:this._array[n]}});var OE;(function(e){function t(e){return e<0}e.isLessThan=t;function n(e){return e<=0}e.isLessThanOrEqual=n;function r(e){return e>0}e.isGreaterThan=r;function i(e){return e===0}e.isNeitherLessOrGreaterThan=i,e.greaterThan=1,e.lessThan=-1,e.neitherLessOrGreaterThan=0})(OE||={});function kE(e,t){return(n,r)=>t(e(n),e(r))}const AE=(e,t)=>e-t;(class e{static{this.empty=new e(e=>{})}constructor(e){this.iterate=e}forEach(e){this.iterate(t=>(e(t),!0))}toArray(){let e=[];return this.iterate(t=>(e.push(t),!0)),e}filter(t){return new e(e=>this.iterate(n=>t(n)?e(n):!0))}map(t){return new e(e=>this.iterate(n=>e(t(n))))}some(e){let t=!1;return this.iterate(n=>(t=e(n),!t)),t}findFirst(e){let t;return this.iterate(n=>e(n)?(t=n,!1):!0),t}findLast(e){let t;return this.iterate(n=>(e(n)&&(t=n),!0)),t}findLastMaxBy(e){let t,n=!0;return this.iterate(r=>((n||OE.isGreaterThan(e(r,t)))&&(n=!1,t=r),!0)),t}});var jE,ME=class{constructor(e,t){this.uri=e,this.value=t}};function NE(e){return Array.isArray(e)}var PE=class e{static{this.defaultToKey=e=>e.toString()}constructor(t,n){if(this[jE]=`ResourceMap`,t instanceof e)this.map=new Map(t.map),this.toKey=n??e.defaultToKey;else if(NE(t)){this.map=new Map,this.toKey=n??e.defaultToKey;for(let[e,n]of t)this.set(e,n)}else this.map=new Map,this.toKey=t??e.defaultToKey}set(e,t){return this.map.set(this.toKey(e),new ME(e,t)),this}get(e){return this.map.get(this.toKey(e))?.value}has(e){return this.map.has(this.toKey(e))}get size(){return this.map.size}clear(){this.map.clear()}delete(e){return this.map.delete(this.toKey(e))}forEach(e,t){t!==void 0&&(e=e.bind(t));for(let[t,n]of this.map)e(n.value,n.uri,this)}*values(){for(let e of this.map.values())yield e.value}*keys(){for(let e of this.map.values())yield e.uri}*entries(){for(let e of this.map.values())yield[e.uri,e.value]}*[(jE=Symbol.toStringTag,Symbol.iterator)](){for(let[,e]of this.map)yield[e.uri,e.value]}};Symbol.toStringTag,Symbol.iterator;var FE;(function(e){e[e.None=0]=`None`,e[e.AsOld=1]=`AsOld`,e[e.AsNew=2]=`AsNew`})(FE||={}),Symbol.toStringTag,Symbol.iterator;var IE=class{constructor(){this.map=new Map}add(e,t){let n=this.map.get(e);n||(n=new Set,this.map.set(e,n)),n.add(t)}delete(e,t){let n=this.map.get(e);n&&(n.delete(t),n.size===0&&this.map.delete(e))}forEach(e,t){let n=this.map.get(e);n&&n.forEach(t)}get(e){return this.map.get(e)||new Set}};function LE(e){return!!e&&typeof e[Symbol.iterator]==`function`}var RE;(function(e){function t(e){return!!e&&typeof e==`object`&&typeof e[Symbol.iterator]==`function`}e.is=t;let n=Object.freeze([]);function r(){return n}e.empty=r;function*i(e){yield e}e.single=i;function a(e){return t(e)?e:i(e)}e.wrap=a;function o(e){return e??n}e.from=o;function*s(e){for(let t=e.length-1;t>=0;t--)yield e[t]}e.reverse=s;function c(e){return!e||e[Symbol.iterator]().next().done===!0}e.isEmpty=c;function l(e){return e[Symbol.iterator]().next().value}e.first=l;function u(e,t){let n=0;for(let r of e)if(t(r,n++))return!0;return!1}e.some=u;function d(e,t){let n=0;for(let r of e)if(!t(r,n++))return!1;return!0}e.every=d;function f(e,t){for(let n of e)if(t(n))return n}e.find=f;function*p(e,t){for(let n of e)t(n)&&(yield n)}e.filter=p;function*m(e,t){let n=0;for(let r of e)yield t(r,n++)}e.map=m;function*h(e,t){let n=0;for(let r of e)yield*t(r,n++)}e.flatMap=h;function*g(...e){for(let t of e)LE(t)?yield*t:yield t}e.concat=g;function _(e,t,n){let r=n;for(let n of e)r=t(r,n);return r}e.reduce=_;function v(e){let t=0;for(let n of e)t++;return t}e.length=v;function*y(e,t,n=e.length){for(t<-e.length&&(t=0),t<0&&(t+=e.length),n<0?n+=e.length:n>e.length&&(n=e.length);t<n;t++)yield e[t]}e.slice=y;function b(t,n=1/0){let r=[];if(n===0)return[r,t];let i=t[Symbol.iterator]();for(let t=0;t<n;t++){let t=i.next();if(t.done)return[r,e.empty()];r.push(t.value)}return[r,{[Symbol.iterator](){return i}}]}e.consume=b;async function x(e){let t=[];for await(let n of e)t.push(n);return t}e.asyncToArray=x;async function S(e){let t=[];for await(let n of e)t=t.concat(n);return t}e.asyncToArrayFlat=S})(RE||={}),class e{constructor(){this.livingDisposables=new Map}static{this.idx=0}getDisposableData(t){let n=this.livingDisposables.get(t);return n||(n={parent:null,source:null,isSingleton:!1,value:t,idx:e.idx++},this.livingDisposables.set(t,n)),n}trackDisposable(e){let t=this.getDisposableData(e);t.source||=Error().stack}setParent(e,t){let n=this.getDisposableData(e);n.parent=t}markAsDisposed(e){this.livingDisposables.delete(e)}markAsSingleton(e){this.getDisposableData(e).isSingleton=!0}getRootParent(e,t){let n=t.get(e);if(n)return n;let r=e.parent?this.getRootParent(this.getDisposableData(e.parent),t):e;return t.set(e,r),r}getTrackedDisposables(){let e=new Map;return[...this.livingDisposables.entries()].filter(([,t])=>t.source!==null&&!this.getRootParent(t,e).isSingleton).flatMap(([e])=>e)}computeLeakingDisposables(e=10,t){let n;if(t)n=t;else{let e=new Map,t=[...this.livingDisposables.values()].filter(t=>t.source!==null&&!this.getRootParent(t,e).isSingleton);if(t.length===0)return;let r=new Set(t.map(e=>e.value));if(n=t.filter(e=>!(e.parent&&r.has(e.parent))),n.length===0)throw Error(`There are cyclic diposable chains!`)}if(!n)return;function r(e){function t(e,t){for(;e.length>0&&t.some(t=>typeof t==`string`?t===e[0]:e[0].match(t));)e.shift()}let n=e.source.split(`
`).map(e=>e.trim().replace(`at `,``)).filter(e=>e!==``);return t(n,[`Error`,/^trackDisposable \(.*\)$/,/^DisposableTracker.trackDisposable \(.*\)$/]),n.reverse()}let i=new IE;for(let e of n){let t=r(e);for(let n=0;n<=t.length;n++)i.add(t.slice(0,n).join(`
`),e)}n.sort(kE(e=>e.idx,AE));let a=``,o=0;for(let t of n.slice(0,e)){o++;let e=r(t),s=[];for(let t=0;t<e.length;t++){let a=e[t];a=`(shared with ${i.get(e.slice(0,t+1).join(`
`)).size}/${n.length} leaks) at ${a}`;let o=vE([...i.get(e.slice(0,t).join(`
`))].map(e=>r(e)[t]),e=>e);delete o[e[t]];for(let[e,t]of Object.entries(o))t&&s.unshift(`    - stacktraces of ${t.length} other leaks continue with ${e}`);s.unshift(a)}a+=`\n\n\n==================== Leaking disposable ${o}/${n.length}: ${t.value.constructor.name} ====================\n${s.join(`
`)}\n============================================================\n\n`}return n.length>e&&(a+=`\n\n\n... and ${n.length-e} more leaking disposables\n\n`),{leaks:n,details:a}}};function zE(e){return null?.trackDisposable(e),e}function BE(e){null?.markAsDisposed(e)}function VE(e,t){null?.setParent(e,t)}function HE(e){if(RE.is(e)){let t=[];for(let n of e)if(n)try{n.dispose()}catch(e){t.push(e)}if(t.length===1)throw t[0];if(t.length>1)throw AggregateError(t,`Encountered errors while disposing of store`);return Array.isArray(e)?[]:e}else if(e)return e.dispose(),e}function UE(...e){return GE(()=>HE(e))}var WE=class{constructor(e){this._isDisposed=!1,this._fn=e,zE(this)}dispose(){if(!this._isDisposed){if(!this._fn)throw Error(`Unbound disposable context: Need to use an arrow function to preserve the value of this`);this._isDisposed=!0,BE(this),this._fn()}}};function GE(e){return new WE(e)}var KE=class e{static{this.DISABLE_DISPOSED_WARNING=!1}constructor(){this._toDispose=new Set,this._isDisposed=!1,zE(this)}dispose(){this._isDisposed||(BE(this),this._isDisposed=!0,this.clear())}get isDisposed(){return this._isDisposed}clear(){if(this._toDispose.size!==0)try{HE(this._toDispose)}finally{this._toDispose.clear()}}add(t){if(!t||t===qE.None)return t;if(t===this)throw Error(`Cannot register a disposable on itself!`);return VE(t,this),this._isDisposed?e.DISABLE_DISPOSED_WARNING||console.warn(Error(`Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!`).stack):this._toDispose.add(t),t}delete(e){if(e){if(e===this)throw Error(`Cannot dispose a disposable on itself!`);this._toDispose.delete(e),e.dispose()}}deleteAndLeak(e){e&&this._toDispose.delete(e)&&VE(e,null)}assertNotDisposed(){this._isDisposed&&bE(new EE(`Object disposed`))}},qE=class{static{this.None=Object.freeze({dispose(){}})}constructor(){this._store=new KE,zE(this),VE(this._store,this)}dispose(){BE(this),this._store.dispose()}_register(e){if(e===this)throw Error(`Cannot register a disposable on itself!`);return this._store.add(e)}},JE=class e{static{this.Undefined=new e(void 0)}constructor(t){this.element=t,this.next=e.Undefined,this.prev=e.Undefined}},YE=class{constructor(){this._first=JE.Undefined,this._last=JE.Undefined,this._size=0}get size(){return this._size}isEmpty(){return this._first===JE.Undefined}clear(){let e=this._first;for(;e!==JE.Undefined;){let t=e.next;e.prev=JE.Undefined,e.next=JE.Undefined,e=t}this._first=JE.Undefined,this._last=JE.Undefined,this._size=0}unshift(e){return this._insert(e,!1)}push(e){return this._insert(e,!0)}_insert(e,t){let n=new JE(e);if(this._first===JE.Undefined)this._first=n,this._last=n;else if(t){let e=this._last;this._last=n,n.prev=e,e.next=n}else{let e=this._first;this._first=n,n.next=e,e.prev=n}this._size+=1;let r=!1;return()=>{r||(r=!0,this._remove(n))}}shift(){if(this._first!==JE.Undefined){let e=this._first.element;return this._remove(this._first),e}}pop(){if(this._last!==JE.Undefined){let e=this._last.element;return this._remove(this._last),e}}peek(){if(this._last!==JE.Undefined)return this._last.element}_remove(e){if(e.prev!==JE.Undefined&&e.next!==JE.Undefined){let t=e.prev;t.next=e.next,e.next.prev=t}else e.prev===JE.Undefined&&e.next===JE.Undefined?(this._first=JE.Undefined,this._last=JE.Undefined):e.next===JE.Undefined?(this._last=this._last.prev,this._last.next=JE.Undefined):e.prev===JE.Undefined&&(this._first=this._first.next,this._first.prev=JE.Undefined);--this._size}*[Symbol.iterator](){let e=this._first;for(;e!==JE.Undefined;)yield e.element,e=e.next}},XE;(function(e){e.None=()=>qE.None;function t(e,t,n){return f(e,()=>void 0,0,void 0,t??!0,void 0,n)}e.defer=t;function n(e){return(t,n=null,r)=>{let i=!1,a;return a=e(e=>{if(!i)return a?a.dispose():i=!0,t.call(n,e)},null,r),i&&a.dispose(),a}}e.once=n;function r(t,n){return e.once(e.filter(t,n))}e.onceIf=r;function i(e,t,n){return u((n,r=null,i)=>e(e=>n.call(r,t(e)),null,i),n)}e.map=i;function a(e,t,n){return u((n,r=null,i)=>e(e=>{t(e),n.call(r,e)},null,i),n)}e.forEach=a;function o(e,t,n){return u((n,r=null,i)=>e(e=>t(e)&&n.call(r,e),null,i),n)}e.filter=o;function s(e){return e}e.signal=s;function c(...e){return(t,n=null,r)=>d(UE(...e.map(e=>e(e=>t.call(n,e)))),r)}e.any=c;function l(e,t,n,r){let a=n;return i(e,e=>(a=t(a,e),a),r)}e.reduce=l;function u(e,t){let n,r=new iD({onWillAddFirstListener(){n=e(r.fire,r)},onDidRemoveLastListener(){n?.dispose()}});return t?.add(r),r.event}function d(e,t){return t instanceof Array?t.push(e):t&&t.add(e),e}function f(e,t,n=100,r=!1,i=!1,a,o){let s,c,l,u=0,d,f=new iD({leakWarningThreshold:a,onWillAddFirstListener(){s=e(e=>{u++,c=t(c,e),r&&!l&&(f.fire(c),c=void 0),d=()=>{let e=c;c=void 0,l=void 0,(!r||u>1)&&f.fire(e),u=0},typeof n==`number`?(l&&clearTimeout(l),l=setTimeout(d,n)):l===void 0&&(l=null,queueMicrotask(d))})},onWillRemoveListener(){i&&u>0&&d?.()},onDidRemoveLastListener(){d=void 0,s.dispose()}});return o?.add(f),f.event}e.debounce=f;function p(t,n=0,r,i){return e.debounce(t,(e,t)=>e?(e.push(t),e):[t],n,void 0,r??!0,void 0,i)}e.accumulate=p;function m(e,t,n=100,r=!0,i=!0,a,o){let s,c,l,u=0,d=new iD({leakWarningThreshold:a,onWillAddFirstListener(){s=e(e=>{u++,c=t(c,e),l===void 0&&(r&&(d.fire(c),c=void 0,u=0),typeof n==`number`?l=setTimeout(()=>{i&&u>0&&d.fire(c),c=void 0,l=void 0,u=0},n):(l=0,queueMicrotask(()=>{i&&u>0&&d.fire(c),c=void 0,l=void 0,u=0})))})},onDidRemoveLastListener(){s.dispose()}});return o?.add(d),d.event}e.throttle=m;function h(e,t=(e,t)=>e===t,n){let r=!0,i;return o(e,e=>{let n=r||!t(e,i);return r=!1,i=e,n},n)}e.latch=h;function g(t,n,r){return[e.filter(t,n,r),e.filter(t,e=>!n(e),r)]}e.split=g;function _(e,t=!1,n=[],r){let i=n.slice(),a=e(e=>{i?i.push(e):s.fire(e)});r&&r.add(a);let o=()=>{i?.forEach(e=>s.fire(e)),i=null},s=new iD({onWillAddFirstListener(){a||(a=e(e=>s.fire(e)),r&&r.add(a))},onDidAddFirstListener(){i&&(t?setTimeout(o):o())},onDidRemoveLastListener(){a&&a.dispose(),a=null}});return r&&r.add(s),s.event}e.buffer=_;function v(e,t){return(n,r,i)=>{let a=t(new b);return e(function(e){let t=a.evaluate(e);t!==y&&n.call(r,t)},void 0,i)}}e.chain=v;let y=Symbol(`HaltChainable`);class b{constructor(){this.steps=[]}map(e){return this.steps.push(e),this}forEach(e){return this.steps.push(t=>(e(t),t)),this}filter(e){return this.steps.push(t=>e(t)?t:y),this}reduce(e,t){let n=t;return this.steps.push(t=>(n=e(n,t),n)),this}latch(e=(e,t)=>e===t){let t=!0,n;return this.steps.push(r=>{let i=t||!e(r,n);return t=!1,n=r,i?r:y}),this}evaluate(e){for(let t of this.steps)if(e=t(e),e===y)break;return e}}function x(e,t,n=e=>e){let r=(...e)=>i.fire(n(...e)),i=new iD({onWillAddFirstListener:()=>e.on(t,r),onDidRemoveLastListener:()=>e.removeListener(t,r)});return i.event}e.fromNodeEventEmitter=x;function S(e,t,n=e=>e){let r=(...e)=>i.fire(n(...e)),i=new iD({onWillAddFirstListener:()=>e.addEventListener(t,r),onDidRemoveLastListener:()=>e.removeEventListener(t,r)});return i.event}e.fromDOMEventEmitter=S;function C(e,t){let r,i,a=new Promise(a=>{i=n(e)(a),oD(i,t),r=()=>{sD(i,t)}});return a.cancel=r,t&&a.finally(()=>sD(i,t)),a}e.toPromise=C;function w(e,t){return e(e=>t.fire(e))}e.forward=w;function T(e,t,n){return t(n),e(e=>t(e))}e.runAndSubscribe=T;class E{constructor(e,t){this._observable=e,this._counter=0,this._hasChanged=!1,this.emitter=new iD({onWillAddFirstListener:()=>{e.addObserver(this),this._observable.reportChanges()},onDidRemoveLastListener:()=>{e.removeObserver(this)}}),t&&t.add(this.emitter)}beginUpdate(e){this._counter++}handlePossibleChange(e){}handleChange(e,t){this._hasChanged=!0}endUpdate(e){this._counter--,this._counter===0&&(this._observable.reportChanges(),this._hasChanged&&(this._hasChanged=!1,this.emitter.fire(this._observable.get())))}}function D(e,t){return new E(e,t).emitter.event}e.fromObservable=D;function O(e){return(t,n,r)=>{let i=0,a=!1,o={beginUpdate(){i++},endUpdate(){i--,i===0&&(e.reportChanges(),a&&(a=!1,t.call(n)))},handlePossibleChange(){},handleChange(){a=!0}};e.addObserver(o),e.reportChanges();let s={dispose(){e.removeObserver(o)}};return oD(s,r),s}}e.fromObservableLight=O})(XE||={});var ZE=class e{static{this.all=new Set}static{this._idPool=0}constructor(t){this.listenerCount=0,this.invocationCount=0,this.elapsedOverall=0,this.durations=[],this.name=`${t}_${e._idPool++}`,e.all.add(this)}start(e){this._stopWatch=new hE,this.listenerCount=e}stop(){if(this._stopWatch){let e=this._stopWatch.elapsed();this.durations.push(e),this.elapsedOverall+=e,this.invocationCount+=1,this._stopWatch=void 0}}},QE=class e{static{this._idPool=1}constructor(t,n,r=(e._idPool++).toString(16).padStart(3,`0`)){this._errorHandler=t,this.threshold=n,this.name=r,this._warnCountdown=0}dispose(){this._stacks?.clear()}check(e,t){let n=this.threshold;if(n<=0||t<n)return;this._stacks||=new Map;let r=this._stacks.get(e.value)||0;if(this._stacks.set(e.value,r+1),--this._warnCountdown,this._warnCountdown<=0){this._warnCountdown=n*.5;let[e,r]=this.getMostFrequentStack(),i=`[${this.name}] potential listener LEAK detected, having ${t} listeners already. MOST frequent listener (${r}):`;console.warn(i),console.warn(e);let a=new eD(i,e);this._errorHandler(a)}return()=>{let t=this._stacks.get(e.value)||0;this._stacks.set(e.value,t-1)}}getMostFrequentStack(){if(!this._stacks)return;let e,t=0;for(let[n,r]of this._stacks)(!e||t<r)&&(e=[n,r],t=r);return e}},$E=class e{static create(){return new e(Error().stack??``)}constructor(e){this.value=e}print(){console.warn(this.value.split(`
`).slice(2).join(`
`))}},eD=class extends Error{constructor(e,t){super(e),this.name=`ListenerLeakError`,this.stack=t}},tD=class extends Error{constructor(e,t){super(e),this.name=`ListenerRefusalError`,this.stack=t}};let nD=0;var rD=class{constructor(e){this.value=e,this.id=nD++}},iD=class{constructor(e){this._size=0,this._options=e,this._leakageMon=this._options?.leakWarningThreshold?new QE(e?.onListenerError??bE,this._options?.leakWarningThreshold??-1):void 0,this._perfMon=this._options?._profName?new ZE(this._options._profName):void 0,this._deliveryQueue=this._options?.deliveryQueue}dispose(){this._disposed||(this._disposed=!0,this._deliveryQueue?.current===this&&this._deliveryQueue.reset(),this._listeners&&(this._listeners=void 0,this._size=0),this._options?.onDidRemoveLastListener?.(),this._leakageMon?.dispose())}get event(){return this._event??=(e,t,n)=>{if(this._leakageMon&&this._size>this._leakageMon.threshold**2){let e=`[${this._leakageMon.name}] REFUSES to accept new listeners because it exceeded its threshold by far (${this._size} vs ${this._leakageMon.threshold})`;console.warn(e);let t=this._leakageMon.getMostFrequentStack()??[`UNKNOWN stack`,-1],n=new tD(`${e}. HINT: Stack shows most frequent listener (${t[1]}-times)`,t[0]);return(this._options?.onListenerError||bE)(n),qE.None}if(this._disposed)return qE.None;t&&(e=e.bind(t));let r=new rD(e),i;this._leakageMon&&this._size>=Math.ceil(this._leakageMon.threshold*.2)&&(r.stack=$E.create(),i=this._leakageMon.check(r.stack,this._size+1)),this._listeners?this._listeners instanceof rD?(this._deliveryQueue??=new aD,this._listeners=[this._listeners,r]):this._listeners.push(r):(this._options?.onWillAddFirstListener?.(this),this._listeners=r,this._options?.onDidAddFirstListener?.(this)),this._options?.onDidAddListener?.(this),this._size++;let a=GE(()=>{i?.(),this._removeListener(r)});return oD(a,n),a},this._event}_removeListener(e){if(this._options?.onWillRemoveListener?.(this),!this._listeners)return;if(this._size===1){this._listeners=void 0,this._options?.onDidRemoveLastListener?.(this),this._size=0;return}let t=this._listeners,n=t.indexOf(e);if(n===-1)throw console.log(`disposed?`,this._disposed),console.log(`size?`,this._size),console.log(`arr?`,JSON.stringify(this._listeners)),Error(`Attempted to dispose unknown listener`);this._size--,t[n]=void 0;let r=this._deliveryQueue.current===this;if(this._size*2<=t.length){let e=0;for(let n=0;n<t.length;n++)t[n]?t[e++]=t[n]:r&&e<this._deliveryQueue.end&&(this._deliveryQueue.end--,e<this._deliveryQueue.i&&this._deliveryQueue.i--);t.length=e}}_deliver(e,t){if(!e)return;let n=this._options?.onListenerError||bE;if(!n){e.value(t);return}try{e.value(t)}catch(e){n(e)}}_deliverQueue(e){let t=e.current._listeners;for(;e.i<e.end;)this._deliver(t[e.i++],e.value);e.reset()}fire(e){if(this._deliveryQueue?.current&&(this._deliverQueue(this._deliveryQueue),this._perfMon?.stop()),this._perfMon?.start(this._size),this._listeners)if(this._listeners instanceof rD)this._deliver(this._listeners,e);else{let t=this._deliveryQueue;t.enqueue(this,e,this._listeners.length),this._deliverQueue(t)}this._perfMon?.stop()}hasListeners(){return this._size>0}},aD=class{constructor(){this.i=-1,this.end=0}enqueue(e,t,n){this.i=0,this.end=n,this.current=e,this.value=t}reset(){this.i=this.end,this.current=void 0,this.value=void 0}};function oD(e,t){t instanceof KE?t.add(e):Array.isArray(t)&&t.push(e)}function sD(e,t){if(t instanceof KE)t.delete(e);else if(Array.isArray(t)){let n=t.indexOf(e);n!==-1&&t.splice(n,1)}e.dispose()}const cD=Object.freeze(function(e,t){let n=setTimeout(e.bind(t),0);return{dispose(){clearTimeout(n)}}});var lD;(function(e){function t(t){return t===e.None||t===e.Cancelled||t instanceof uD?!0:!t||typeof t!=`object`?!1:typeof t.isCancellationRequested==`boolean`&&typeof t.onCancellationRequested==`function`}e.isCancellationToken=t,e.None=Object.freeze({isCancellationRequested:!1,onCancellationRequested:XE.None}),e.Cancelled=Object.freeze({isCancellationRequested:!0,onCancellationRequested:cD})})(lD||={});var uD=class{constructor(){this._isCancelled=!1,this._emitter=null}cancel(){this._isCancelled||(this._isCancelled=!0,this._emitter&&(this._emitter.fire(void 0),this.dispose()))}get isCancellationRequested(){return this._isCancelled}get onCancellationRequested(){return this._isCancelled?cD:(this._emitter||=new iD,this._emitter.event)}dispose(){this._emitter&&=(this._emitter.dispose(),null)}},X;(function(e){e[e.Null=0]=`Null`,e[e.Backspace=8]=`Backspace`,e[e.Tab=9]=`Tab`,e[e.LineFeed=10]=`LineFeed`,e[e.CarriageReturn=13]=`CarriageReturn`,e[e.Space=32]=`Space`,e[e.ExclamationMark=33]=`ExclamationMark`,e[e.DoubleQuote=34]=`DoubleQuote`,e[e.Hash=35]=`Hash`,e[e.DollarSign=36]=`DollarSign`,e[e.PercentSign=37]=`PercentSign`,e[e.Ampersand=38]=`Ampersand`,e[e.SingleQuote=39]=`SingleQuote`,e[e.OpenParen=40]=`OpenParen`,e[e.CloseParen=41]=`CloseParen`,e[e.Asterisk=42]=`Asterisk`,e[e.Plus=43]=`Plus`,e[e.Comma=44]=`Comma`,e[e.Dash=45]=`Dash`,e[e.Period=46]=`Period`,e[e.Slash=47]=`Slash`,e[e.Digit0=48]=`Digit0`,e[e.Digit1=49]=`Digit1`,e[e.Digit2=50]=`Digit2`,e[e.Digit3=51]=`Digit3`,e[e.Digit4=52]=`Digit4`,e[e.Digit5=53]=`Digit5`,e[e.Digit6=54]=`Digit6`,e[e.Digit7=55]=`Digit7`,e[e.Digit8=56]=`Digit8`,e[e.Digit9=57]=`Digit9`,e[e.Colon=58]=`Colon`,e[e.Semicolon=59]=`Semicolon`,e[e.LessThan=60]=`LessThan`,e[e.Equals=61]=`Equals`,e[e.GreaterThan=62]=`GreaterThan`,e[e.QuestionMark=63]=`QuestionMark`,e[e.AtSign=64]=`AtSign`,e[e.A=65]=`A`,e[e.B=66]=`B`,e[e.C=67]=`C`,e[e.D=68]=`D`,e[e.E=69]=`E`,e[e.F=70]=`F`,e[e.G=71]=`G`,e[e.H=72]=`H`,e[e.I=73]=`I`,e[e.J=74]=`J`,e[e.K=75]=`K`,e[e.L=76]=`L`,e[e.M=77]=`M`,e[e.N=78]=`N`,e[e.O=79]=`O`,e[e.P=80]=`P`,e[e.Q=81]=`Q`,e[e.R=82]=`R`,e[e.S=83]=`S`,e[e.T=84]=`T`,e[e.U=85]=`U`,e[e.V=86]=`V`,e[e.W=87]=`W`,e[e.X=88]=`X`,e[e.Y=89]=`Y`,e[e.Z=90]=`Z`,e[e.OpenSquareBracket=91]=`OpenSquareBracket`,e[e.Backslash=92]=`Backslash`,e[e.CloseSquareBracket=93]=`CloseSquareBracket`,e[e.Caret=94]=`Caret`,e[e.Underline=95]=`Underline`,e[e.BackTick=96]=`BackTick`,e[e.a=97]=`a`,e[e.b=98]=`b`,e[e.c=99]=`c`,e[e.d=100]=`d`,e[e.e=101]=`e`,e[e.f=102]=`f`,e[e.g=103]=`g`,e[e.h=104]=`h`,e[e.i=105]=`i`,e[e.j=106]=`j`,e[e.k=107]=`k`,e[e.l=108]=`l`,e[e.m=109]=`m`,e[e.n=110]=`n`,e[e.o=111]=`o`,e[e.p=112]=`p`,e[e.q=113]=`q`,e[e.r=114]=`r`,e[e.s=115]=`s`,e[e.t=116]=`t`,e[e.u=117]=`u`,e[e.v=118]=`v`,e[e.w=119]=`w`,e[e.x=120]=`x`,e[e.y=121]=`y`,e[e.z=122]=`z`,e[e.OpenCurlyBrace=123]=`OpenCurlyBrace`,e[e.Pipe=124]=`Pipe`,e[e.CloseCurlyBrace=125]=`CloseCurlyBrace`,e[e.Tilde=126]=`Tilde`,e[e.NoBreakSpace=160]=`NoBreakSpace`,e[e.U_Combining_Grave_Accent=768]=`U_Combining_Grave_Accent`,e[e.U_Combining_Acute_Accent=769]=`U_Combining_Acute_Accent`,e[e.U_Combining_Circumflex_Accent=770]=`U_Combining_Circumflex_Accent`,e[e.U_Combining_Tilde=771]=`U_Combining_Tilde`,e[e.U_Combining_Macron=772]=`U_Combining_Macron`,e[e.U_Combining_Overline=773]=`U_Combining_Overline`,e[e.U_Combining_Breve=774]=`U_Combining_Breve`,e[e.U_Combining_Dot_Above=775]=`U_Combining_Dot_Above`,e[e.U_Combining_Diaeresis=776]=`U_Combining_Diaeresis`,e[e.U_Combining_Hook_Above=777]=`U_Combining_Hook_Above`,e[e.U_Combining_Ring_Above=778]=`U_Combining_Ring_Above`,e[e.U_Combining_Double_Acute_Accent=779]=`U_Combining_Double_Acute_Accent`,e[e.U_Combining_Caron=780]=`U_Combining_Caron`,e[e.U_Combining_Vertical_Line_Above=781]=`U_Combining_Vertical_Line_Above`,e[e.U_Combining_Double_Vertical_Line_Above=782]=`U_Combining_Double_Vertical_Line_Above`,e[e.U_Combining_Double_Grave_Accent=783]=`U_Combining_Double_Grave_Accent`,e[e.U_Combining_Candrabindu=784]=`U_Combining_Candrabindu`,e[e.U_Combining_Inverted_Breve=785]=`U_Combining_Inverted_Breve`,e[e.U_Combining_Turned_Comma_Above=786]=`U_Combining_Turned_Comma_Above`,e[e.U_Combining_Comma_Above=787]=`U_Combining_Comma_Above`,e[e.U_Combining_Reversed_Comma_Above=788]=`U_Combining_Reversed_Comma_Above`,e[e.U_Combining_Comma_Above_Right=789]=`U_Combining_Comma_Above_Right`,e[e.U_Combining_Grave_Accent_Below=790]=`U_Combining_Grave_Accent_Below`,e[e.U_Combining_Acute_Accent_Below=791]=`U_Combining_Acute_Accent_Below`,e[e.U_Combining_Left_Tack_Below=792]=`U_Combining_Left_Tack_Below`,e[e.U_Combining_Right_Tack_Below=793]=`U_Combining_Right_Tack_Below`,e[e.U_Combining_Left_Angle_Above=794]=`U_Combining_Left_Angle_Above`,e[e.U_Combining_Horn=795]=`U_Combining_Horn`,e[e.U_Combining_Left_Half_Ring_Below=796]=`U_Combining_Left_Half_Ring_Below`,e[e.U_Combining_Up_Tack_Below=797]=`U_Combining_Up_Tack_Below`,e[e.U_Combining_Down_Tack_Below=798]=`U_Combining_Down_Tack_Below`,e[e.U_Combining_Plus_Sign_Below=799]=`U_Combining_Plus_Sign_Below`,e[e.U_Combining_Minus_Sign_Below=800]=`U_Combining_Minus_Sign_Below`,e[e.U_Combining_Palatalized_Hook_Below=801]=`U_Combining_Palatalized_Hook_Below`,e[e.U_Combining_Retroflex_Hook_Below=802]=`U_Combining_Retroflex_Hook_Below`,e[e.U_Combining_Dot_Below=803]=`U_Combining_Dot_Below`,e[e.U_Combining_Diaeresis_Below=804]=`U_Combining_Diaeresis_Below`,e[e.U_Combining_Ring_Below=805]=`U_Combining_Ring_Below`,e[e.U_Combining_Comma_Below=806]=`U_Combining_Comma_Below`,e[e.U_Combining_Cedilla=807]=`U_Combining_Cedilla`,e[e.U_Combining_Ogonek=808]=`U_Combining_Ogonek`,e[e.U_Combining_Vertical_Line_Below=809]=`U_Combining_Vertical_Line_Below`,e[e.U_Combining_Bridge_Below=810]=`U_Combining_Bridge_Below`,e[e.U_Combining_Inverted_Double_Arch_Below=811]=`U_Combining_Inverted_Double_Arch_Below`,e[e.U_Combining_Caron_Below=812]=`U_Combining_Caron_Below`,e[e.U_Combining_Circumflex_Accent_Below=813]=`U_Combining_Circumflex_Accent_Below`,e[e.U_Combining_Breve_Below=814]=`U_Combining_Breve_Below`,e[e.U_Combining_Inverted_Breve_Below=815]=`U_Combining_Inverted_Breve_Below`,e[e.U_Combining_Tilde_Below=816]=`U_Combining_Tilde_Below`,e[e.U_Combining_Macron_Below=817]=`U_Combining_Macron_Below`,e[e.U_Combining_Low_Line=818]=`U_Combining_Low_Line`,e[e.U_Combining_Double_Low_Line=819]=`U_Combining_Double_Low_Line`,e[e.U_Combining_Tilde_Overlay=820]=`U_Combining_Tilde_Overlay`,e[e.U_Combining_Short_Stroke_Overlay=821]=`U_Combining_Short_Stroke_Overlay`,e[e.U_Combining_Long_Stroke_Overlay=822]=`U_Combining_Long_Stroke_Overlay`,e[e.U_Combining_Short_Solidus_Overlay=823]=`U_Combining_Short_Solidus_Overlay`,e[e.U_Combining_Long_Solidus_Overlay=824]=`U_Combining_Long_Solidus_Overlay`,e[e.U_Combining_Right_Half_Ring_Below=825]=`U_Combining_Right_Half_Ring_Below`,e[e.U_Combining_Inverted_Bridge_Below=826]=`U_Combining_Inverted_Bridge_Below`,e[e.U_Combining_Square_Below=827]=`U_Combining_Square_Below`,e[e.U_Combining_Seagull_Below=828]=`U_Combining_Seagull_Below`,e[e.U_Combining_X_Above=829]=`U_Combining_X_Above`,e[e.U_Combining_Vertical_Tilde=830]=`U_Combining_Vertical_Tilde`,e[e.U_Combining_Double_Overline=831]=`U_Combining_Double_Overline`,e[e.U_Combining_Grave_Tone_Mark=832]=`U_Combining_Grave_Tone_Mark`,e[e.U_Combining_Acute_Tone_Mark=833]=`U_Combining_Acute_Tone_Mark`,e[e.U_Combining_Greek_Perispomeni=834]=`U_Combining_Greek_Perispomeni`,e[e.U_Combining_Greek_Koronis=835]=`U_Combining_Greek_Koronis`,e[e.U_Combining_Greek_Dialytika_Tonos=836]=`U_Combining_Greek_Dialytika_Tonos`,e[e.U_Combining_Greek_Ypogegrammeni=837]=`U_Combining_Greek_Ypogegrammeni`,e[e.U_Combining_Bridge_Above=838]=`U_Combining_Bridge_Above`,e[e.U_Combining_Equals_Sign_Below=839]=`U_Combining_Equals_Sign_Below`,e[e.U_Combining_Double_Vertical_Line_Below=840]=`U_Combining_Double_Vertical_Line_Below`,e[e.U_Combining_Left_Angle_Below=841]=`U_Combining_Left_Angle_Below`,e[e.U_Combining_Not_Tilde_Above=842]=`U_Combining_Not_Tilde_Above`,e[e.U_Combining_Homothetic_Above=843]=`U_Combining_Homothetic_Above`,e[e.U_Combining_Almost_Equal_To_Above=844]=`U_Combining_Almost_Equal_To_Above`,e[e.U_Combining_Left_Right_Arrow_Below=845]=`U_Combining_Left_Right_Arrow_Below`,e[e.U_Combining_Upwards_Arrow_Below=846]=`U_Combining_Upwards_Arrow_Below`,e[e.U_Combining_Grapheme_Joiner=847]=`U_Combining_Grapheme_Joiner`,e[e.U_Combining_Right_Arrowhead_Above=848]=`U_Combining_Right_Arrowhead_Above`,e[e.U_Combining_Left_Half_Ring_Above=849]=`U_Combining_Left_Half_Ring_Above`,e[e.U_Combining_Fermata=850]=`U_Combining_Fermata`,e[e.U_Combining_X_Below=851]=`U_Combining_X_Below`,e[e.U_Combining_Left_Arrowhead_Below=852]=`U_Combining_Left_Arrowhead_Below`,e[e.U_Combining_Right_Arrowhead_Below=853]=`U_Combining_Right_Arrowhead_Below`,e[e.U_Combining_Right_Arrowhead_And_Up_Arrowhead_Below=854]=`U_Combining_Right_Arrowhead_And_Up_Arrowhead_Below`,e[e.U_Combining_Right_Half_Ring_Above=855]=`U_Combining_Right_Half_Ring_Above`,e[e.U_Combining_Dot_Above_Right=856]=`U_Combining_Dot_Above_Right`,e[e.U_Combining_Asterisk_Below=857]=`U_Combining_Asterisk_Below`,e[e.U_Combining_Double_Ring_Below=858]=`U_Combining_Double_Ring_Below`,e[e.U_Combining_Zigzag_Above=859]=`U_Combining_Zigzag_Above`,e[e.U_Combining_Double_Breve_Below=860]=`U_Combining_Double_Breve_Below`,e[e.U_Combining_Double_Breve=861]=`U_Combining_Double_Breve`,e[e.U_Combining_Double_Macron=862]=`U_Combining_Double_Macron`,e[e.U_Combining_Double_Macron_Below=863]=`U_Combining_Double_Macron_Below`,e[e.U_Combining_Double_Tilde=864]=`U_Combining_Double_Tilde`,e[e.U_Combining_Double_Inverted_Breve=865]=`U_Combining_Double_Inverted_Breve`,e[e.U_Combining_Double_Rightwards_Arrow_Below=866]=`U_Combining_Double_Rightwards_Arrow_Below`,e[e.U_Combining_Latin_Small_Letter_A=867]=`U_Combining_Latin_Small_Letter_A`,e[e.U_Combining_Latin_Small_Letter_E=868]=`U_Combining_Latin_Small_Letter_E`,e[e.U_Combining_Latin_Small_Letter_I=869]=`U_Combining_Latin_Small_Letter_I`,e[e.U_Combining_Latin_Small_Letter_O=870]=`U_Combining_Latin_Small_Letter_O`,e[e.U_Combining_Latin_Small_Letter_U=871]=`U_Combining_Latin_Small_Letter_U`,e[e.U_Combining_Latin_Small_Letter_C=872]=`U_Combining_Latin_Small_Letter_C`,e[e.U_Combining_Latin_Small_Letter_D=873]=`U_Combining_Latin_Small_Letter_D`,e[e.U_Combining_Latin_Small_Letter_H=874]=`U_Combining_Latin_Small_Letter_H`,e[e.U_Combining_Latin_Small_Letter_M=875]=`U_Combining_Latin_Small_Letter_M`,e[e.U_Combining_Latin_Small_Letter_R=876]=`U_Combining_Latin_Small_Letter_R`,e[e.U_Combining_Latin_Small_Letter_T=877]=`U_Combining_Latin_Small_Letter_T`,e[e.U_Combining_Latin_Small_Letter_V=878]=`U_Combining_Latin_Small_Letter_V`,e[e.U_Combining_Latin_Small_Letter_X=879]=`U_Combining_Latin_Small_Letter_X`,e[e.LINE_SEPARATOR=8232]=`LINE_SEPARATOR`,e[e.PARAGRAPH_SEPARATOR=8233]=`PARAGRAPH_SEPARATOR`,e[e.NEXT_LINE=133]=`NEXT_LINE`,e[e.U_CIRCUMFLEX=94]=`U_CIRCUMFLEX`,e[e.U_GRAVE_ACCENT=96]=`U_GRAVE_ACCENT`,e[e.U_DIAERESIS=168]=`U_DIAERESIS`,e[e.U_MACRON=175]=`U_MACRON`,e[e.U_ACUTE_ACCENT=180]=`U_ACUTE_ACCENT`,e[e.U_CEDILLA=184]=`U_CEDILLA`,e[e.U_MODIFIER_LETTER_LEFT_ARROWHEAD=706]=`U_MODIFIER_LETTER_LEFT_ARROWHEAD`,e[e.U_MODIFIER_LETTER_RIGHT_ARROWHEAD=707]=`U_MODIFIER_LETTER_RIGHT_ARROWHEAD`,e[e.U_MODIFIER_LETTER_UP_ARROWHEAD=708]=`U_MODIFIER_LETTER_UP_ARROWHEAD`,e[e.U_MODIFIER_LETTER_DOWN_ARROWHEAD=709]=`U_MODIFIER_LETTER_DOWN_ARROWHEAD`,e[e.U_MODIFIER_LETTER_CENTRED_RIGHT_HALF_RING=722]=`U_MODIFIER_LETTER_CENTRED_RIGHT_HALF_RING`,e[e.U_MODIFIER_LETTER_CENTRED_LEFT_HALF_RING=723]=`U_MODIFIER_LETTER_CENTRED_LEFT_HALF_RING`,e[e.U_MODIFIER_LETTER_UP_TACK=724]=`U_MODIFIER_LETTER_UP_TACK`,e[e.U_MODIFIER_LETTER_DOWN_TACK=725]=`U_MODIFIER_LETTER_DOWN_TACK`,e[e.U_MODIFIER_LETTER_PLUS_SIGN=726]=`U_MODIFIER_LETTER_PLUS_SIGN`,e[e.U_MODIFIER_LETTER_MINUS_SIGN=727]=`U_MODIFIER_LETTER_MINUS_SIGN`,e[e.U_BREVE=728]=`U_BREVE`,e[e.U_DOT_ABOVE=729]=`U_DOT_ABOVE`,e[e.U_RING_ABOVE=730]=`U_RING_ABOVE`,e[e.U_OGONEK=731]=`U_OGONEK`,e[e.U_SMALL_TILDE=732]=`U_SMALL_TILDE`,e[e.U_DOUBLE_ACUTE_ACCENT=733]=`U_DOUBLE_ACUTE_ACCENT`,e[e.U_MODIFIER_LETTER_RHOTIC_HOOK=734]=`U_MODIFIER_LETTER_RHOTIC_HOOK`,e[e.U_MODIFIER_LETTER_CROSS_ACCENT=735]=`U_MODIFIER_LETTER_CROSS_ACCENT`,e[e.U_MODIFIER_LETTER_EXTRA_HIGH_TONE_BAR=741]=`U_MODIFIER_LETTER_EXTRA_HIGH_TONE_BAR`,e[e.U_MODIFIER_LETTER_HIGH_TONE_BAR=742]=`U_MODIFIER_LETTER_HIGH_TONE_BAR`,e[e.U_MODIFIER_LETTER_MID_TONE_BAR=743]=`U_MODIFIER_LETTER_MID_TONE_BAR`,e[e.U_MODIFIER_LETTER_LOW_TONE_BAR=744]=`U_MODIFIER_LETTER_LOW_TONE_BAR`,e[e.U_MODIFIER_LETTER_EXTRA_LOW_TONE_BAR=745]=`U_MODIFIER_LETTER_EXTRA_LOW_TONE_BAR`,e[e.U_MODIFIER_LETTER_YIN_DEPARTING_TONE_MARK=746]=`U_MODIFIER_LETTER_YIN_DEPARTING_TONE_MARK`,e[e.U_MODIFIER_LETTER_YANG_DEPARTING_TONE_MARK=747]=`U_MODIFIER_LETTER_YANG_DEPARTING_TONE_MARK`,e[e.U_MODIFIER_LETTER_UNASPIRATED=749]=`U_MODIFIER_LETTER_UNASPIRATED`,e[e.U_MODIFIER_LETTER_LOW_DOWN_ARROWHEAD=751]=`U_MODIFIER_LETTER_LOW_DOWN_ARROWHEAD`,e[e.U_MODIFIER_LETTER_LOW_UP_ARROWHEAD=752]=`U_MODIFIER_LETTER_LOW_UP_ARROWHEAD`,e[e.U_MODIFIER_LETTER_LOW_LEFT_ARROWHEAD=753]=`U_MODIFIER_LETTER_LOW_LEFT_ARROWHEAD`,e[e.U_MODIFIER_LETTER_LOW_RIGHT_ARROWHEAD=754]=`U_MODIFIER_LETTER_LOW_RIGHT_ARROWHEAD`,e[e.U_MODIFIER_LETTER_LOW_RING=755]=`U_MODIFIER_LETTER_LOW_RING`,e[e.U_MODIFIER_LETTER_MIDDLE_GRAVE_ACCENT=756]=`U_MODIFIER_LETTER_MIDDLE_GRAVE_ACCENT`,e[e.U_MODIFIER_LETTER_MIDDLE_DOUBLE_GRAVE_ACCENT=757]=`U_MODIFIER_LETTER_MIDDLE_DOUBLE_GRAVE_ACCENT`,e[e.U_MODIFIER_LETTER_MIDDLE_DOUBLE_ACUTE_ACCENT=758]=`U_MODIFIER_LETTER_MIDDLE_DOUBLE_ACUTE_ACCENT`,e[e.U_MODIFIER_LETTER_LOW_TILDE=759]=`U_MODIFIER_LETTER_LOW_TILDE`,e[e.U_MODIFIER_LETTER_RAISED_COLON=760]=`U_MODIFIER_LETTER_RAISED_COLON`,e[e.U_MODIFIER_LETTER_BEGIN_HIGH_TONE=761]=`U_MODIFIER_LETTER_BEGIN_HIGH_TONE`,e[e.U_MODIFIER_LETTER_END_HIGH_TONE=762]=`U_MODIFIER_LETTER_END_HIGH_TONE`,e[e.U_MODIFIER_LETTER_BEGIN_LOW_TONE=763]=`U_MODIFIER_LETTER_BEGIN_LOW_TONE`,e[e.U_MODIFIER_LETTER_END_LOW_TONE=764]=`U_MODIFIER_LETTER_END_LOW_TONE`,e[e.U_MODIFIER_LETTER_SHELF=765]=`U_MODIFIER_LETTER_SHELF`,e[e.U_MODIFIER_LETTER_OPEN_SHELF=766]=`U_MODIFIER_LETTER_OPEN_SHELF`,e[e.U_MODIFIER_LETTER_LOW_LEFT_ARROW=767]=`U_MODIFIER_LETTER_LOW_LEFT_ARROW`,e[e.U_GREEK_LOWER_NUMERAL_SIGN=885]=`U_GREEK_LOWER_NUMERAL_SIGN`,e[e.U_GREEK_TONOS=900]=`U_GREEK_TONOS`,e[e.U_GREEK_DIALYTIKA_TONOS=901]=`U_GREEK_DIALYTIKA_TONOS`,e[e.U_GREEK_KORONIS=8125]=`U_GREEK_KORONIS`,e[e.U_GREEK_PSILI=8127]=`U_GREEK_PSILI`,e[e.U_GREEK_PERISPOMENI=8128]=`U_GREEK_PERISPOMENI`,e[e.U_GREEK_DIALYTIKA_AND_PERISPOMENI=8129]=`U_GREEK_DIALYTIKA_AND_PERISPOMENI`,e[e.U_GREEK_PSILI_AND_VARIA=8141]=`U_GREEK_PSILI_AND_VARIA`,e[e.U_GREEK_PSILI_AND_OXIA=8142]=`U_GREEK_PSILI_AND_OXIA`,e[e.U_GREEK_PSILI_AND_PERISPOMENI=8143]=`U_GREEK_PSILI_AND_PERISPOMENI`,e[e.U_GREEK_DASIA_AND_VARIA=8157]=`U_GREEK_DASIA_AND_VARIA`,e[e.U_GREEK_DASIA_AND_OXIA=8158]=`U_GREEK_DASIA_AND_OXIA`,e[e.U_GREEK_DASIA_AND_PERISPOMENI=8159]=`U_GREEK_DASIA_AND_PERISPOMENI`,e[e.U_GREEK_DIALYTIKA_AND_VARIA=8173]=`U_GREEK_DIALYTIKA_AND_VARIA`,e[e.U_GREEK_DIALYTIKA_AND_OXIA=8174]=`U_GREEK_DIALYTIKA_AND_OXIA`,e[e.U_GREEK_VARIA=8175]=`U_GREEK_VARIA`,e[e.U_GREEK_OXIA=8189]=`U_GREEK_OXIA`,e[e.U_GREEK_DASIA=8190]=`U_GREEK_DASIA`,e[e.U_IDEOGRAPHIC_FULL_STOP=12290]=`U_IDEOGRAPHIC_FULL_STOP`,e[e.U_LEFT_CORNER_BRACKET=12300]=`U_LEFT_CORNER_BRACKET`,e[e.U_RIGHT_CORNER_BRACKET=12301]=`U_RIGHT_CORNER_BRACKET`,e[e.U_LEFT_BLACK_LENTICULAR_BRACKET=12304]=`U_LEFT_BLACK_LENTICULAR_BRACKET`,e[e.U_RIGHT_BLACK_LENTICULAR_BRACKET=12305]=`U_RIGHT_BLACK_LENTICULAR_BRACKET`,e[e.U_OVERLINE=8254]=`U_OVERLINE`,e[e.UTF8_BOM=65279]=`UTF8_BOM`,e[e.U_FULLWIDTH_SEMICOLON=65307]=`U_FULLWIDTH_SEMICOLON`,e[e.U_FULLWIDTH_COMMA=65292]=`U_FULLWIDTH_COMMA`})(X||={});function dD(){return globalThis._VSCODE_NLS_LANGUAGE}dD()===`pseudo`||typeof document<`u`&&document.location&&typeof document.location.hash==`string`&&document.location.hash.indexOf(`pseudo=true`);let fD=!1,pD=!1,mD=!1,hD=!1,gD=!1,_D=!1,vD=`en`,yD;const bD=globalThis;let xD;bD.vscode!==void 0&&bD.vscode.process!==void 0?xD=bD.vscode.process:typeof process<`u`&&typeof process?.versions?.node==`string`&&(xD=process);const SD=typeof xD?.versions?.electron==`string`&&xD?.type===`renderer`;if(typeof xD==`object`){fD=xD.platform===`win32`,pD=xD.platform===`darwin`,mD=xD.platform===`linux`,mD&&xD.env.SNAP&&xD.env.SNAP_REVISION,xD.env.CI||xD.env.BUILD_ARTIFACTSTAGINGDIRECTORY||xD.env.GITHUB_WORKSPACE,vD=`en`;let e=xD.env.VSCODE_NLS_CONFIG;if(e)try{let t=JSON.parse(e);t.userLocale,t.osLocale,vD=t.resolvedLanguage||`en`,t.languagePack?.translationsConfigFile}catch{}hD=!0}else typeof navigator==`object`&&!SD?(yD=navigator.userAgent,fD=yD.indexOf(`Windows`)>=0,pD=yD.indexOf(`Macintosh`)>=0,_D=(yD.indexOf(`Macintosh`)>=0||yD.indexOf(`iPad`)>=0||yD.indexOf(`iPhone`)>=0)&&!!navigator.maxTouchPoints&&navigator.maxTouchPoints>0,mD=yD.indexOf(`Linux`)>=0,yD?.indexOf(`Mobi`),gD=!0,vD=dD()||`en`,navigator.language.toLowerCase()):console.error(`Unable to resolve platform.`);var CD;(function(e){e[e.Web=0]=`Web`,e[e.Mac=1]=`Mac`,e[e.Linux=2]=`Linux`,e[e.Windows=3]=`Windows`})(CD||={}),CD.Web,pD?CD.Mac:fD?CD.Windows:mD&&CD.Linux;const wD=fD,TD=pD,ED=mD,DD=hD,OD=gD,kD=gD&&typeof bD.importScripts==`function`?bD.origin:void 0,AD=yD,jD=vD;var MD;(function(e){function t(){return jD}e.value=t;function n(){return jD.length===2?jD===`en`:jD.length>=3?jD[0]===`e`&&jD[1]===`n`&&jD[2]===`-`:!1}e.isDefaultVariant=n;function r(){return jD===`en`}e.isDefault=r})(MD||={});const ND=typeof bD.postMessage==`function`&&!bD.importScripts;(()=>{if(ND){let e=[];bD.addEventListener(`message`,t=>{if(t.data&&t.data.vscodeScheduleAsyncWork)for(let n=0,r=e.length;n<r;n++){let r=e[n];if(r.id===t.data.vscodeScheduleAsyncWork){e.splice(n,1),r.callback();return}}});let t=0;return n=>{let r=++t;e.push({id:r,callback:n}),bD.postMessage({vscodeScheduleAsyncWork:r},`*`)}}return e=>setTimeout(e)})();var PD;(function(e){e[e.Windows=1]=`Windows`,e[e.Macintosh=2]=`Macintosh`,e[e.Linux=3]=`Linux`})(PD||={}),pD||_D?PD.Macintosh:fD?PD.Windows:PD.Linux;const FD=!!(AD&&AD.indexOf(`Chrome`)>=0);AD&&AD.indexOf(`Firefox`),!FD&&AD&&AD.indexOf(`Safari`),AD&&AD.indexOf(`Edg/`),AD&&AD.indexOf(`Android`);let ID;const LD=globalThis.vscode;if(LD!==void 0&&LD.process!==void 0){let e=LD.process;ID={get platform(){return e.platform},get arch(){return e.arch},get env(){return e.env},cwd(){return e.cwd()}}}else ID=typeof process<`u`&&typeof process?.versions?.node==`string`?{get platform(){return process.platform},get arch(){return process.arch},get env(){return{}},cwd(){return{}.VSCODE_CWD||process.cwd()}}:{get platform(){return wD?`win32`:TD?`darwin`:`linux`},get arch(){},get env(){return{}},cwd(){return`/`}};const RD=ID.cwd,zD=ID.env,BD=ID.platform;ID.arch;var VD=class extends Error{constructor(e,t,n){let r;typeof t==`string`&&t.indexOf(`not `)===0?(r=`must not be`,t=t.replace(/^not /,``)):r=`must be`;let i=`The "${e}" ${e.indexOf(`.`)===-1?`argument`:`property`} ${r} of type ${t}`;i+=`. Received type ${typeof n}`,super(i),this.code=`ERR_INVALID_ARG_TYPE`}};function HD(e,t){if(typeof e!=`object`||!e)throw new VD(t,`Object`,e)}function UD(e,t){if(typeof e!=`string`)throw new VD(t,`string`,e)}const WD=BD===`win32`;function Z(e){return e===47||e===92}function GD(e){return e===47}function KD(e){return e>=65&&e<=90||e>=97&&e<=122}function qD(e,t,n,r){let i=``,a=0,o=-1,s=0,c=0;for(let l=0;l<=e.length;++l){if(l<e.length)c=e.charCodeAt(l);else if(r(c))break;else c=47;if(r(c)){if(!(o===l-1||s===1))if(s===2){if(i.length<2||a!==2||i.charCodeAt(i.length-1)!==46||i.charCodeAt(i.length-2)!==46){if(i.length>2){let e=i.lastIndexOf(n);e===-1?(i=``,a=0):(i=i.slice(0,e),a=i.length-1-i.lastIndexOf(n)),o=l,s=0;continue}else if(i.length!==0){i=``,a=0,o=l,s=0;continue}}t&&(i+=i.length>0?`${n}..`:`..`,a=2)}else i.length>0?i+=`${n}${e.slice(o+1,l)}`:i=e.slice(o+1,l),a=l-o-1;o=l,s=0}else c===46&&s!==-1?++s:s=-1}return i}function JD(e){return e?`${e[0]===`.`?``:`.`}${e}`:``}function YD(e,t){HD(t,`pathObject`);let n=t.dir||t.root,r=t.base||`${t.name||``}${JD(t.ext)}`;return n?n===t.root?`${n}${r}`:`${n}${e}${r}`:r}const XD={resolve(...e){let t=``,n=``,r=!1;for(let i=e.length-1;i>=-1;i--){let a;if(i>=0){if(a=e[i],UD(a,`paths[${i}]`),a.length===0)continue}else t.length===0?a=RD():(a=zD[`=${t}`]||RD(),(a===void 0||a.slice(0,2).toLowerCase()!==t.toLowerCase()&&a.charCodeAt(2)===92)&&(a=`${t}\\`));let o=a.length,s=0,c=``,l=!1,u=a.charCodeAt(0);if(o===1)Z(u)&&(s=1,l=!0);else if(Z(u))if(l=!0,Z(a.charCodeAt(1))){let e=2,t=e;for(;e<o&&!Z(a.charCodeAt(e));)e++;if(e<o&&e!==t){let n=a.slice(t,e);for(t=e;e<o&&Z(a.charCodeAt(e));)e++;if(e<o&&e!==t){for(t=e;e<o&&!Z(a.charCodeAt(e));)e++;(e===o||e!==t)&&(c=`\\\\${n}\\${a.slice(t,e)}`,s=e)}}}else s=1;else KD(u)&&a.charCodeAt(1)===58&&(c=a.slice(0,2),s=2,o>2&&Z(a.charCodeAt(2))&&(l=!0,s=3));if(c.length>0)if(t.length>0){if(c.toLowerCase()!==t.toLowerCase())continue}else t=c;if(r){if(t.length>0)break}else if(n=`${a.slice(s)}\\${n}`,r=l,l&&t.length>0)break}return n=qD(n,!r,`\\`,Z),r?`${t}\\${n}`:`${t}${n}`||`.`},normalize(e){UD(e,`path`);let t=e.length;if(t===0)return`.`;let n=0,r,i=!1,a=e.charCodeAt(0);if(t===1)return GD(a)?`\\`:e;if(Z(a))if(i=!0,Z(e.charCodeAt(1))){let i=2,a=i;for(;i<t&&!Z(e.charCodeAt(i));)i++;if(i<t&&i!==a){let o=e.slice(a,i);for(a=i;i<t&&Z(e.charCodeAt(i));)i++;if(i<t&&i!==a){for(a=i;i<t&&!Z(e.charCodeAt(i));)i++;if(i===t)return`\\\\${o}\\${e.slice(a)}\\`;i!==a&&(r=`\\\\${o}\\${e.slice(a,i)}`,n=i)}}}else n=1;else KD(a)&&e.charCodeAt(1)===58&&(r=e.slice(0,2),n=2,t>2&&Z(e.charCodeAt(2))&&(i=!0,n=3));let o=n<t?qD(e.slice(n),!i,`\\`,Z):``;if(o.length===0&&!i&&(o=`.`),o.length>0&&Z(e.charCodeAt(t-1))&&(o+=`\\`),!i&&r===void 0&&e.includes(`:`)){if(o.length>=2&&KD(o.charCodeAt(0))&&o.charCodeAt(1)===58)return`.\\${o}`;let n=e.indexOf(`:`);do if(n===t-1||Z(e.charCodeAt(n+1)))return`.\\${o}`;while((n=e.indexOf(`:`,n+1))!==-1)}return r===void 0?i?`\\${o}`:o:i?`${r}\\${o}`:`${r}${o}`},isAbsolute(e){UD(e,`path`);let t=e.length;if(t===0)return!1;let n=e.charCodeAt(0);return Z(n)||t>2&&KD(n)&&e.charCodeAt(1)===58&&Z(e.charCodeAt(2))},join(...e){if(e.length===0)return`.`;let t,n;for(let r=0;r<e.length;++r){let i=e[r];UD(i,`path`),i.length>0&&(t===void 0?t=n=i:t+=`\\${i}`)}if(t===void 0)return`.`;let r=!0,i=0;if(typeof n==`string`&&Z(n.charCodeAt(0))){++i;let e=n.length;e>1&&Z(n.charCodeAt(1))&&(++i,e>2&&(Z(n.charCodeAt(2))?++i:r=!1))}if(r){for(;i<t.length&&Z(t.charCodeAt(i));)i++;i>=2&&(t=`\\${t.slice(i)}`)}return XD.normalize(t)},relative(e,t){if(UD(e,`from`),UD(t,`to`),e===t)return``;let n=XD.resolve(e),r=XD.resolve(t);if(n===r||(e=n.toLowerCase(),t=r.toLowerCase(),e===t))return``;if(n.length!==e.length||r.length!==t.length){let e=n.split(`\\`),t=r.split(`\\`);e[e.length-1]===``&&e.pop(),t[t.length-1]===``&&t.pop();let i=e.length,a=t.length,o=i<a?i:a,s;for(s=0;s<o&&e[s].toLowerCase()===t[s].toLowerCase();s++);return s===0?r:s===o?a>o?t.slice(s).join(`\\`):i>o?`..\\`.repeat(i-1-s)+`..`:``:`..\\`.repeat(i-s)+t.slice(s).join(`\\`)}let i=0;for(;i<e.length&&e.charCodeAt(i)===92;)i++;let a=e.length;for(;a-1>i&&e.charCodeAt(a-1)===92;)a--;let o=a-i,s=0;for(;s<t.length&&t.charCodeAt(s)===92;)s++;let c=t.length;for(;c-1>s&&t.charCodeAt(c-1)===92;)c--;let l=c-s,u=o<l?o:l,d=-1,f=0;for(;f<u;f++){let n=e.charCodeAt(i+f);if(n!==t.charCodeAt(s+f))break;n===92&&(d=f)}if(f!==u){if(d===-1)return r}else{if(l>u){if(t.charCodeAt(s+f)===92)return r.slice(s+f+1);if(f===2)return r.slice(s+f)}o>u&&(e.charCodeAt(i+f)===92?d=f:f===2&&(d=3)),d===-1&&(d=0)}let p=``;for(f=i+d+1;f<=a;++f)(f===a||e.charCodeAt(f)===92)&&(p+=p.length===0?`..`:`\\..`);return s+=d,p.length>0?`${p}${r.slice(s,c)}`:(r.charCodeAt(s)===92&&++s,r.slice(s,c))},toNamespacedPath(e){if(typeof e!=`string`||e.length===0)return e;let t=XD.resolve(e);if(t.length<=2)return e;if(t.charCodeAt(0)===92){if(t.charCodeAt(1)===92){let e=t.charCodeAt(2);if(e!==63&&e!==46)return`\\\\?\\UNC\\${t.slice(2)}`}}else if(KD(t.charCodeAt(0))&&t.charCodeAt(1)===58&&t.charCodeAt(2)===92)return`\\\\?\\${t}`;return t},dirname(e){UD(e,`path`);let t=e.length;if(t===0)return`.`;let n=-1,r=0,i=e.charCodeAt(0);if(t===1)return Z(i)?e:`.`;if(Z(i)){if(n=r=1,Z(e.charCodeAt(1))){let i=2,a=i;for(;i<t&&!Z(e.charCodeAt(i));)i++;if(i<t&&i!==a){for(a=i;i<t&&Z(e.charCodeAt(i));)i++;if(i<t&&i!==a){for(a=i;i<t&&!Z(e.charCodeAt(i));)i++;if(i===t)return e;i!==a&&(n=r=i+1)}}}}else KD(i)&&e.charCodeAt(1)===58&&(n=t>2&&Z(e.charCodeAt(2))?3:2,r=n);let a=-1,o=!0;for(let n=t-1;n>=r;--n)if(Z(e.charCodeAt(n))){if(!o){a=n;break}}else o=!1;if(a===-1){if(n===-1)return`.`;a=n}return e.slice(0,a)},basename(e,t){t!==void 0&&UD(t,`suffix`),UD(e,`path`);let n=0,r=-1,i=!0,a;if(e.length>=2&&KD(e.charCodeAt(0))&&e.charCodeAt(1)===58&&(n=2),t!==void 0&&t.length>0&&t.length<=e.length){if(t===e)return``;let o=t.length-1,s=-1;for(a=e.length-1;a>=n;--a){let c=e.charCodeAt(a);if(Z(c)){if(!i){n=a+1;break}}else s===-1&&(i=!1,s=a+1),o>=0&&(c===t.charCodeAt(o)?--o===-1&&(r=a):(o=-1,r=s))}return n===r?r=s:r===-1&&(r=e.length),e.slice(n,r)}for(a=e.length-1;a>=n;--a)if(Z(e.charCodeAt(a))){if(!i){n=a+1;break}}else r===-1&&(i=!1,r=a+1);return r===-1?``:e.slice(n,r)},extname(e){UD(e,`path`);let t=0,n=-1,r=0,i=-1,a=!0,o=0;e.length>=2&&e.charCodeAt(1)===58&&KD(e.charCodeAt(0))&&(t=r=2);for(let s=e.length-1;s>=t;--s){let t=e.charCodeAt(s);if(Z(t)){if(!a){r=s+1;break}continue}i===-1&&(a=!1,i=s+1),t===46?n===-1?n=s:o!==1&&(o=1):n!==-1&&(o=-1)}return n===-1||i===-1||o===0||o===1&&n===i-1&&n===r+1?``:e.slice(n,i)},format:YD.bind(null,`\\`),parse(e){UD(e,`path`);let t={root:``,dir:``,base:``,ext:``,name:``};if(e.length===0)return t;let n=e.length,r=0,i=e.charCodeAt(0);if(n===1)return Z(i)?(t.root=t.dir=e,t):(t.base=t.name=e,t);if(Z(i)){if(r=1,Z(e.charCodeAt(1))){let t=2,i=t;for(;t<n&&!Z(e.charCodeAt(t));)t++;if(t<n&&t!==i){for(i=t;t<n&&Z(e.charCodeAt(t));)t++;if(t<n&&t!==i){for(i=t;t<n&&!Z(e.charCodeAt(t));)t++;t===n?r=t:t!==i&&(r=t+1)}}}}else if(KD(i)&&e.charCodeAt(1)===58){if(n<=2)return t.root=t.dir=e,t;if(r=2,Z(e.charCodeAt(2))){if(n===3)return t.root=t.dir=e,t;r=3}}r>0&&(t.root=e.slice(0,r));let a=-1,o=r,s=-1,c=!0,l=e.length-1,u=0;for(;l>=r;--l){if(i=e.charCodeAt(l),Z(i)){if(!c){o=l+1;break}continue}s===-1&&(c=!1,s=l+1),i===46?a===-1?a=l:u!==1&&(u=1):a!==-1&&(u=-1)}return s!==-1&&(a===-1||u===0||u===1&&a===s-1&&a===o+1?t.base=t.name=e.slice(o,s):(t.name=e.slice(o,a),t.base=e.slice(o,s),t.ext=e.slice(a,s))),o>0&&o!==r?t.dir=e.slice(0,o-1):t.dir=t.root,t},sep:`\\`,delimiter:`;`,win32:null,posix:null},ZD=(()=>{if(WD){let e=/\\/g;return()=>{let t=RD().replace(e,`/`);return t.slice(t.indexOf(`/`))}}return()=>RD()})(),Q={resolve(...e){let t=``,n=!1;for(let r=e.length-1;r>=0&&!n;r--){let i=e[r];UD(i,`paths[${r}]`),i.length!==0&&(t=`${i}/${t}`,n=i.charCodeAt(0)===47)}if(!n){let e=ZD();t=`${e}/${t}`,n=e.charCodeAt(0)===47}return t=qD(t,!n,`/`,GD),n?`/${t}`:t.length>0?t:`.`},normalize(e){if(UD(e,`path`),e.length===0)return`.`;let t=e.charCodeAt(0)===47,n=e.charCodeAt(e.length-1)===47;return e=qD(e,!t,`/`,GD),e.length===0?t?`/`:n?`./`:`.`:(n&&(e+=`/`),t?`/${e}`:e)},isAbsolute(e){return UD(e,`path`),e.length>0&&e.charCodeAt(0)===47},join(...e){if(e.length===0)return`.`;let t=[];for(let n=0;n<e.length;++n){let r=e[n];UD(r,`path`),r.length>0&&t.push(r)}return t.length===0?`.`:Q.normalize(t.join(`/`))},relative(e,t){if(UD(e,`from`),UD(t,`to`),e===t||(e=Q.resolve(e),t=Q.resolve(t),e===t))return``;let n=e.length,r=n-1,i=t.length-1,a=r<i?r:i,o=-1,s=0;for(;s<a;s++){let n=e.charCodeAt(1+s);if(n!==t.charCodeAt(1+s))break;n===47&&(o=s)}if(s===a)if(i>a){if(t.charCodeAt(1+s)===47)return t.slice(1+s+1);if(s===0)return t.slice(1+s)}else r>a&&(e.charCodeAt(1+s)===47?o=s:s===0&&(o=0));let c=``;for(s=1+o+1;s<=n;++s)(s===n||e.charCodeAt(s)===47)&&(c+=c.length===0?`..`:`/..`);return`${c}${t.slice(1+o)}`},toNamespacedPath(e){return e},dirname(e){if(UD(e,`path`),e.length===0)return`.`;let t=e.charCodeAt(0)===47,n=-1,r=!0;for(let t=e.length-1;t>=1;--t)if(e.charCodeAt(t)===47){if(!r){n=t;break}}else r=!1;return n===-1?t?`/`:`.`:t&&n===1?`//`:e.slice(0,n)},basename(e,t){t!==void 0&&UD(t,`suffix`),UD(e,`path`);let n=0,r=-1,i=!0,a;if(t!==void 0&&t.length>0&&t.length<=e.length){if(t===e)return``;let o=t.length-1,s=-1;for(a=e.length-1;a>=0;--a){let c=e.charCodeAt(a);if(c===47){if(!i){n=a+1;break}}else s===-1&&(i=!1,s=a+1),o>=0&&(c===t.charCodeAt(o)?--o===-1&&(r=a):(o=-1,r=s))}return n===r?r=s:r===-1&&(r=e.length),e.slice(n,r)}for(a=e.length-1;a>=0;--a)if(e.charCodeAt(a)===47){if(!i){n=a+1;break}}else r===-1&&(i=!1,r=a+1);return r===-1?``:e.slice(n,r)},extname(e){UD(e,`path`);let t=-1,n=0,r=-1,i=!0,a=0;for(let o=e.length-1;o>=0;--o){let s=e[o];if(s===`/`){if(!i){n=o+1;break}continue}r===-1&&(i=!1,r=o+1),s===`.`?t===-1?t=o:a!==1&&(a=1):t!==-1&&(a=-1)}return t===-1||r===-1||a===0||a===1&&t===r-1&&t===n+1?``:e.slice(t,r)},format:YD.bind(null,`/`),parse(e){UD(e,`path`);let t={root:``,dir:``,base:``,ext:``,name:``};if(e.length===0)return t;let n=e.charCodeAt(0)===47,r;n?(t.root=`/`,r=1):r=0;let i=-1,a=0,o=-1,s=!0,c=e.length-1,l=0;for(;c>=r;--c){let t=e.charCodeAt(c);if(t===47){if(!s){a=c+1;break}continue}o===-1&&(s=!1,o=c+1),t===46?i===-1?i=c:l!==1&&(l=1):i!==-1&&(l=-1)}if(o!==-1){let r=a===0&&n?1:a;i===-1||l===0||l===1&&i===o-1&&i===a+1?t.base=t.name=e.slice(r,o):(t.name=e.slice(r,i),t.base=e.slice(r,o),t.ext=e.slice(i,o))}return a>0?t.dir=e.slice(0,a-1):n&&(t.dir=`/`),t},sep:`/`,delimiter:`:`,win32:null,posix:null};Q.win32=XD.win32=XD,Q.posix=XD.posix=Q;const QD=WD?XD.normalize:Q.normalize;WD?XD.isAbsolute:Q.isAbsolute;const $D=WD?XD.join:Q.join,eO=WD?XD.resolve:Q.resolve,tO=WD?XD.relative:Q.relative,nO=WD?XD.dirname:Q.dirname;WD?XD.basename:Q.basename,WD?XD.extname:Q.extname,WD?XD.parse:Q.parse;const rO=WD?XD.sep:Q.sep;function iO(e){return e}var aO=class{constructor(e,t){this.lastCache=void 0,this.lastArgKey=void 0,typeof e==`function`?(this._fn=e,this._computeKey=iO):(this._fn=t,this._computeKey=e.getCacheKey)}get(e){let t=this._computeKey(e);return this.lastArgKey!==t&&(this.lastArgKey=t,this.lastCache=this._fn(e)),this.lastCache}},oO;(function(e){e[e.Uninitialized=0]=`Uninitialized`,e[e.Running=1]=`Running`,e[e.Completed=2]=`Completed`})(oO||={});var sO=class{constructor(e){this.executor=e,this._state=oO.Uninitialized}get hasValue(){return this._state===oO.Completed}get value(){if(this._state===oO.Uninitialized){this._state=oO.Running;try{this._value=this.executor()}catch(e){this._error=e}finally{this._state=oO.Completed}}else if(this._state===oO.Running)throw Error(`Cannot read the value of a lazy that is being initialized`);if(this._error)throw this._error;return this._value}get rawValue(){return this._value}},cO;(function(e){e[e.MAX_SAFE_SMALL_INTEGER=1073741824]=`MAX_SAFE_SMALL_INTEGER`,e[e.MIN_SAFE_SMALL_INTEGER=-1073741824]=`MIN_SAFE_SMALL_INTEGER`,e[e.MAX_UINT_8=255]=`MAX_UINT_8`,e[e.MAX_UINT_16=65535]=`MAX_UINT_16`,e[e.MAX_UINT_32=4294967295]=`MAX_UINT_32`,e[e.UNICODE_SUPPLEMENTARY_PLANE_BEGIN=65536]=`UNICODE_SUPPLEMENTARY_PLANE_BEGIN`})(cO||={});function lO(e){return e<0?0:e>cO.MAX_UINT_32?cO.MAX_UINT_32:e|0}function uO(e){return e.split(/\r\n|\r|\n/)}function dO(e,t){return e<t?-1:e>t?1:0}function fO(e,t,n=0,r=e.length,i=0,a=t.length){for(;n<r&&i<a;n++,i++){let r=e.charCodeAt(n),a=t.charCodeAt(i);if(r<a)return-1;if(r>a)return 1}let o=r-n,s=a-i;return o<s?-1:o>s?1:0}function pO(e,t,n=0,r=e.length,i=0,a=t.length){for(;n<r&&i<a;n++,i++){let o=e.charCodeAt(n),s=t.charCodeAt(i);if(o===s)continue;if(o>=128||s>=128)return fO(e.toLowerCase(),t.toLowerCase(),n,r,i,a);mO(o)&&(o-=32),mO(s)&&(s-=32);let c=o-s;if(c!==0)return c}let o=r-n,s=a-i;return o<s?-1:o>s?1:0}function mO(e){return e>=X.a&&e<=X.z}function hO(e){return e>=X.A&&e<=X.Z}function gO(e,t){return e.length===t.length&&pO(e,t)===0}function _O(e,t){let n=t.length;return n<=e.length&&pO(e,t,0,n)===0}RegExp(`(?:`+[`(?:\\x1b\\[|\\x9b)[=?>!]?[\\d;:]*["$#'* ]?[a-zA-Z@^\`{}|~]`,`(?:\\x1b\\]|\\x9d).*?(?:\\x1b\\\\|\\x07|\\x9c)`,`\\x1b(?:[ #%\\(\\)\\*\\+\\-\\.\\/]?[a-zA-Z0-9\\|}~@])`].join(`|`)+`)`,`g`),String.fromCharCode(X.UTF8_BOM);var vO;(function(e){e[e.Other=0]=`Other`,e[e.Prepend=1]=`Prepend`,e[e.CR=2]=`CR`,e[e.LF=3]=`LF`,e[e.Control=4]=`Control`,e[e.Extend=5]=`Extend`,e[e.Regional_Indicator=6]=`Regional_Indicator`,e[e.SpacingMark=7]=`SpacingMark`,e[e.L=8]=`L`,e[e.V=9]=`V`,e[e.T=10]=`T`,e[e.LV=11]=`LV`,e[e.LVT=12]=`LVT`,e[e.ZWJ=13]=`ZWJ`,e[e.Extended_Pictographic=14]=`Extended_Pictographic`})(vO||={}),class e{static{this._INSTANCE=null}static getInstance(){return e._INSTANCE||=new e,e._INSTANCE}constructor(){this._data=yO()}getGraphemeBreakType(e){if(e<32)return e===X.LineFeed?vO.LF:e===X.CarriageReturn?vO.CR:vO.Control;if(e<127)return vO.Other;let t=this._data,n=t.length/3,r=1;for(;r<=n;)if(e<t[3*r])r=2*r;else if(e>t[3*r+1])r=2*r+1;else return t[3*r+2];return vO.Other}};function yO(){return JSON.parse(`[0,0,0,51229,51255,12,44061,44087,12,127462,127487,6,7083,7085,5,47645,47671,12,54813,54839,12,128678,128678,14,3270,3270,5,9919,9923,14,45853,45879,12,49437,49463,12,53021,53047,12,71216,71218,7,128398,128399,14,129360,129374,14,2519,2519,5,4448,4519,9,9742,9742,14,12336,12336,14,44957,44983,12,46749,46775,12,48541,48567,12,50333,50359,12,52125,52151,12,53917,53943,12,69888,69890,5,73018,73018,5,127990,127990,14,128558,128559,14,128759,128760,14,129653,129655,14,2027,2035,5,2891,2892,7,3761,3761,5,6683,6683,5,8293,8293,4,9825,9826,14,9999,9999,14,43452,43453,5,44509,44535,12,45405,45431,12,46301,46327,12,47197,47223,12,48093,48119,12,48989,49015,12,49885,49911,12,50781,50807,12,51677,51703,12,52573,52599,12,53469,53495,12,54365,54391,12,65279,65279,4,70471,70472,7,72145,72147,7,119173,119179,5,127799,127818,14,128240,128244,14,128512,128512,14,128652,128652,14,128721,128722,14,129292,129292,14,129445,129450,14,129734,129743,14,1476,1477,5,2366,2368,7,2750,2752,7,3076,3076,5,3415,3415,5,4141,4144,5,6109,6109,5,6964,6964,5,7394,7400,5,9197,9198,14,9770,9770,14,9877,9877,14,9968,9969,14,10084,10084,14,43052,43052,5,43713,43713,5,44285,44311,12,44733,44759,12,45181,45207,12,45629,45655,12,46077,46103,12,46525,46551,12,46973,46999,12,47421,47447,12,47869,47895,12,48317,48343,12,48765,48791,12,49213,49239,12,49661,49687,12,50109,50135,12,50557,50583,12,51005,51031,12,51453,51479,12,51901,51927,12,52349,52375,12,52797,52823,12,53245,53271,12,53693,53719,12,54141,54167,12,54589,54615,12,55037,55063,12,69506,69509,5,70191,70193,5,70841,70841,7,71463,71467,5,72330,72342,5,94031,94031,5,123628,123631,5,127763,127765,14,127941,127941,14,128043,128062,14,128302,128317,14,128465,128467,14,128539,128539,14,128640,128640,14,128662,128662,14,128703,128703,14,128745,128745,14,129004,129007,14,129329,129330,14,129402,129402,14,129483,129483,14,129686,129704,14,130048,131069,14,173,173,4,1757,1757,1,2200,2207,5,2434,2435,7,2631,2632,5,2817,2817,5,3008,3008,5,3201,3201,5,3387,3388,5,3542,3542,5,3902,3903,7,4190,4192,5,6002,6003,5,6439,6440,5,6765,6770,7,7019,7027,5,7154,7155,7,8205,8205,13,8505,8505,14,9654,9654,14,9757,9757,14,9792,9792,14,9852,9853,14,9890,9894,14,9937,9937,14,9981,9981,14,10035,10036,14,11035,11036,14,42654,42655,5,43346,43347,7,43587,43587,5,44006,44007,7,44173,44199,12,44397,44423,12,44621,44647,12,44845,44871,12,45069,45095,12,45293,45319,12,45517,45543,12,45741,45767,12,45965,45991,12,46189,46215,12,46413,46439,12,46637,46663,12,46861,46887,12,47085,47111,12,47309,47335,12,47533,47559,12,47757,47783,12,47981,48007,12,48205,48231,12,48429,48455,12,48653,48679,12,48877,48903,12,49101,49127,12,49325,49351,12,49549,49575,12,49773,49799,12,49997,50023,12,50221,50247,12,50445,50471,12,50669,50695,12,50893,50919,12,51117,51143,12,51341,51367,12,51565,51591,12,51789,51815,12,52013,52039,12,52237,52263,12,52461,52487,12,52685,52711,12,52909,52935,12,53133,53159,12,53357,53383,12,53581,53607,12,53805,53831,12,54029,54055,12,54253,54279,12,54477,54503,12,54701,54727,12,54925,54951,12,55149,55175,12,68101,68102,5,69762,69762,7,70067,70069,7,70371,70378,5,70720,70721,7,71087,71087,5,71341,71341,5,71995,71996,5,72249,72249,7,72850,72871,5,73109,73109,5,118576,118598,5,121505,121519,5,127245,127247,14,127568,127569,14,127777,127777,14,127872,127891,14,127956,127967,14,128015,128016,14,128110,128172,14,128259,128259,14,128367,128368,14,128424,128424,14,128488,128488,14,128530,128532,14,128550,128551,14,128566,128566,14,128647,128647,14,128656,128656,14,128667,128673,14,128691,128693,14,128715,128715,14,128728,128732,14,128752,128752,14,128765,128767,14,129096,129103,14,129311,129311,14,129344,129349,14,129394,129394,14,129413,129425,14,129466,129471,14,129511,129535,14,129664,129666,14,129719,129722,14,129760,129767,14,917536,917631,5,13,13,2,1160,1161,5,1564,1564,4,1807,1807,1,2085,2087,5,2307,2307,7,2382,2383,7,2497,2500,5,2563,2563,7,2677,2677,5,2763,2764,7,2879,2879,5,2914,2915,5,3021,3021,5,3142,3144,5,3263,3263,5,3285,3286,5,3398,3400,7,3530,3530,5,3633,3633,5,3864,3865,5,3974,3975,5,4155,4156,7,4229,4230,5,5909,5909,7,6078,6085,7,6277,6278,5,6451,6456,7,6744,6750,5,6846,6846,5,6972,6972,5,7074,7077,5,7146,7148,7,7222,7223,5,7416,7417,5,8234,8238,4,8417,8417,5,9000,9000,14,9203,9203,14,9730,9731,14,9748,9749,14,9762,9763,14,9776,9783,14,9800,9811,14,9831,9831,14,9872,9873,14,9882,9882,14,9900,9903,14,9929,9933,14,9941,9960,14,9974,9974,14,9989,9989,14,10006,10006,14,10062,10062,14,10160,10160,14,11647,11647,5,12953,12953,14,43019,43019,5,43232,43249,5,43443,43443,5,43567,43568,7,43696,43696,5,43765,43765,7,44013,44013,5,44117,44143,12,44229,44255,12,44341,44367,12,44453,44479,12,44565,44591,12,44677,44703,12,44789,44815,12,44901,44927,12,45013,45039,12,45125,45151,12,45237,45263,12,45349,45375,12,45461,45487,12,45573,45599,12,45685,45711,12,45797,45823,12,45909,45935,12,46021,46047,12,46133,46159,12,46245,46271,12,46357,46383,12,46469,46495,12,46581,46607,12,46693,46719,12,46805,46831,12,46917,46943,12,47029,47055,12,47141,47167,12,47253,47279,12,47365,47391,12,47477,47503,12,47589,47615,12,47701,47727,12,47813,47839,12,47925,47951,12,48037,48063,12,48149,48175,12,48261,48287,12,48373,48399,12,48485,48511,12,48597,48623,12,48709,48735,12,48821,48847,12,48933,48959,12,49045,49071,12,49157,49183,12,49269,49295,12,49381,49407,12,49493,49519,12,49605,49631,12,49717,49743,12,49829,49855,12,49941,49967,12,50053,50079,12,50165,50191,12,50277,50303,12,50389,50415,12,50501,50527,12,50613,50639,12,50725,50751,12,50837,50863,12,50949,50975,12,51061,51087,12,51173,51199,12,51285,51311,12,51397,51423,12,51509,51535,12,51621,51647,12,51733,51759,12,51845,51871,12,51957,51983,12,52069,52095,12,52181,52207,12,52293,52319,12,52405,52431,12,52517,52543,12,52629,52655,12,52741,52767,12,52853,52879,12,52965,52991,12,53077,53103,12,53189,53215,12,53301,53327,12,53413,53439,12,53525,53551,12,53637,53663,12,53749,53775,12,53861,53887,12,53973,53999,12,54085,54111,12,54197,54223,12,54309,54335,12,54421,54447,12,54533,54559,12,54645,54671,12,54757,54783,12,54869,54895,12,54981,55007,12,55093,55119,12,55243,55291,10,66045,66045,5,68325,68326,5,69688,69702,5,69817,69818,5,69957,69958,7,70089,70092,5,70198,70199,5,70462,70462,5,70502,70508,5,70750,70750,5,70846,70846,7,71100,71101,5,71230,71230,7,71351,71351,5,71737,71738,5,72000,72000,7,72160,72160,5,72273,72278,5,72752,72758,5,72882,72883,5,73031,73031,5,73461,73462,7,94192,94193,7,119149,119149,7,121403,121452,5,122915,122916,5,126980,126980,14,127358,127359,14,127535,127535,14,127759,127759,14,127771,127771,14,127792,127793,14,127825,127867,14,127897,127899,14,127945,127945,14,127985,127986,14,128000,128007,14,128021,128021,14,128066,128100,14,128184,128235,14,128249,128252,14,128266,128276,14,128335,128335,14,128379,128390,14,128407,128419,14,128444,128444,14,128481,128481,14,128499,128499,14,128526,128526,14,128536,128536,14,128543,128543,14,128556,128556,14,128564,128564,14,128577,128580,14,128643,128645,14,128649,128649,14,128654,128654,14,128660,128660,14,128664,128664,14,128675,128675,14,128686,128689,14,128695,128696,14,128705,128709,14,128717,128719,14,128725,128725,14,128736,128741,14,128747,128748,14,128755,128755,14,128762,128762,14,128981,128991,14,129009,129023,14,129160,129167,14,129296,129304,14,129320,129327,14,129340,129342,14,129356,129356,14,129388,129392,14,129399,129400,14,129404,129407,14,129432,129442,14,129454,129455,14,129473,129474,14,129485,129487,14,129648,129651,14,129659,129660,14,129671,129679,14,129709,129711,14,129728,129730,14,129751,129753,14,129776,129782,14,917505,917505,4,917760,917999,5,10,10,3,127,159,4,768,879,5,1471,1471,5,1536,1541,1,1648,1648,5,1767,1768,5,1840,1866,5,2070,2073,5,2137,2139,5,2274,2274,1,2363,2363,7,2377,2380,7,2402,2403,5,2494,2494,5,2507,2508,7,2558,2558,5,2622,2624,7,2641,2641,5,2691,2691,7,2759,2760,5,2786,2787,5,2876,2876,5,2881,2884,5,2901,2902,5,3006,3006,5,3014,3016,7,3072,3072,5,3134,3136,5,3157,3158,5,3260,3260,5,3266,3266,5,3274,3275,7,3328,3329,5,3391,3392,7,3405,3405,5,3457,3457,5,3536,3537,7,3551,3551,5,3636,3642,5,3764,3772,5,3895,3895,5,3967,3967,7,3993,4028,5,4146,4151,5,4182,4183,7,4226,4226,5,4253,4253,5,4957,4959,5,5940,5940,7,6070,6070,7,6087,6088,7,6158,6158,4,6432,6434,5,6448,6449,7,6679,6680,5,6742,6742,5,6754,6754,5,6783,6783,5,6912,6915,5,6966,6970,5,6978,6978,5,7042,7042,7,7080,7081,5,7143,7143,7,7150,7150,7,7212,7219,5,7380,7392,5,7412,7412,5,8203,8203,4,8232,8232,4,8265,8265,14,8400,8412,5,8421,8432,5,8617,8618,14,9167,9167,14,9200,9200,14,9410,9410,14,9723,9726,14,9733,9733,14,9745,9745,14,9752,9752,14,9760,9760,14,9766,9766,14,9774,9774,14,9786,9786,14,9794,9794,14,9823,9823,14,9828,9828,14,9833,9850,14,9855,9855,14,9875,9875,14,9880,9880,14,9885,9887,14,9896,9897,14,9906,9916,14,9926,9927,14,9935,9935,14,9939,9939,14,9962,9962,14,9972,9972,14,9978,9978,14,9986,9986,14,9997,9997,14,10002,10002,14,10017,10017,14,10055,10055,14,10071,10071,14,10133,10135,14,10548,10549,14,11093,11093,14,12330,12333,5,12441,12442,5,42608,42610,5,43010,43010,5,43045,43046,5,43188,43203,7,43302,43309,5,43392,43394,5,43446,43449,5,43493,43493,5,43571,43572,7,43597,43597,7,43703,43704,5,43756,43757,5,44003,44004,7,44009,44010,7,44033,44059,12,44089,44115,12,44145,44171,12,44201,44227,12,44257,44283,12,44313,44339,12,44369,44395,12,44425,44451,12,44481,44507,12,44537,44563,12,44593,44619,12,44649,44675,12,44705,44731,12,44761,44787,12,44817,44843,12,44873,44899,12,44929,44955,12,44985,45011,12,45041,45067,12,45097,45123,12,45153,45179,12,45209,45235,12,45265,45291,12,45321,45347,12,45377,45403,12,45433,45459,12,45489,45515,12,45545,45571,12,45601,45627,12,45657,45683,12,45713,45739,12,45769,45795,12,45825,45851,12,45881,45907,12,45937,45963,12,45993,46019,12,46049,46075,12,46105,46131,12,46161,46187,12,46217,46243,12,46273,46299,12,46329,46355,12,46385,46411,12,46441,46467,12,46497,46523,12,46553,46579,12,46609,46635,12,46665,46691,12,46721,46747,12,46777,46803,12,46833,46859,12,46889,46915,12,46945,46971,12,47001,47027,12,47057,47083,12,47113,47139,12,47169,47195,12,47225,47251,12,47281,47307,12,47337,47363,12,47393,47419,12,47449,47475,12,47505,47531,12,47561,47587,12,47617,47643,12,47673,47699,12,47729,47755,12,47785,47811,12,47841,47867,12,47897,47923,12,47953,47979,12,48009,48035,12,48065,48091,12,48121,48147,12,48177,48203,12,48233,48259,12,48289,48315,12,48345,48371,12,48401,48427,12,48457,48483,12,48513,48539,12,48569,48595,12,48625,48651,12,48681,48707,12,48737,48763,12,48793,48819,12,48849,48875,12,48905,48931,12,48961,48987,12,49017,49043,12,49073,49099,12,49129,49155,12,49185,49211,12,49241,49267,12,49297,49323,12,49353,49379,12,49409,49435,12,49465,49491,12,49521,49547,12,49577,49603,12,49633,49659,12,49689,49715,12,49745,49771,12,49801,49827,12,49857,49883,12,49913,49939,12,49969,49995,12,50025,50051,12,50081,50107,12,50137,50163,12,50193,50219,12,50249,50275,12,50305,50331,12,50361,50387,12,50417,50443,12,50473,50499,12,50529,50555,12,50585,50611,12,50641,50667,12,50697,50723,12,50753,50779,12,50809,50835,12,50865,50891,12,50921,50947,12,50977,51003,12,51033,51059,12,51089,51115,12,51145,51171,12,51201,51227,12,51257,51283,12,51313,51339,12,51369,51395,12,51425,51451,12,51481,51507,12,51537,51563,12,51593,51619,12,51649,51675,12,51705,51731,12,51761,51787,12,51817,51843,12,51873,51899,12,51929,51955,12,51985,52011,12,52041,52067,12,52097,52123,12,52153,52179,12,52209,52235,12,52265,52291,12,52321,52347,12,52377,52403,12,52433,52459,12,52489,52515,12,52545,52571,12,52601,52627,12,52657,52683,12,52713,52739,12,52769,52795,12,52825,52851,12,52881,52907,12,52937,52963,12,52993,53019,12,53049,53075,12,53105,53131,12,53161,53187,12,53217,53243,12,53273,53299,12,53329,53355,12,53385,53411,12,53441,53467,12,53497,53523,12,53553,53579,12,53609,53635,12,53665,53691,12,53721,53747,12,53777,53803,12,53833,53859,12,53889,53915,12,53945,53971,12,54001,54027,12,54057,54083,12,54113,54139,12,54169,54195,12,54225,54251,12,54281,54307,12,54337,54363,12,54393,54419,12,54449,54475,12,54505,54531,12,54561,54587,12,54617,54643,12,54673,54699,12,54729,54755,12,54785,54811,12,54841,54867,12,54897,54923,12,54953,54979,12,55009,55035,12,55065,55091,12,55121,55147,12,55177,55203,12,65024,65039,5,65520,65528,4,66422,66426,5,68152,68154,5,69291,69292,5,69633,69633,5,69747,69748,5,69811,69814,5,69826,69826,5,69932,69932,7,70016,70017,5,70079,70080,7,70095,70095,5,70196,70196,5,70367,70367,5,70402,70403,7,70464,70464,5,70487,70487,5,70709,70711,7,70725,70725,7,70833,70834,7,70843,70844,7,70849,70849,7,71090,71093,5,71103,71104,5,71227,71228,7,71339,71339,5,71344,71349,5,71458,71461,5,71727,71735,5,71985,71989,7,71998,71998,5,72002,72002,7,72154,72155,5,72193,72202,5,72251,72254,5,72281,72283,5,72344,72345,5,72766,72766,7,72874,72880,5,72885,72886,5,73023,73029,5,73104,73105,5,73111,73111,5,92912,92916,5,94095,94098,5,113824,113827,4,119142,119142,7,119155,119162,4,119362,119364,5,121476,121476,5,122888,122904,5,123184,123190,5,125252,125258,5,127183,127183,14,127340,127343,14,127377,127386,14,127491,127503,14,127548,127551,14,127744,127756,14,127761,127761,14,127769,127769,14,127773,127774,14,127780,127788,14,127796,127797,14,127820,127823,14,127869,127869,14,127894,127895,14,127902,127903,14,127943,127943,14,127947,127950,14,127972,127972,14,127988,127988,14,127992,127994,14,128009,128011,14,128019,128019,14,128023,128041,14,128064,128064,14,128102,128107,14,128174,128181,14,128238,128238,14,128246,128247,14,128254,128254,14,128264,128264,14,128278,128299,14,128329,128330,14,128348,128359,14,128371,128377,14,128392,128393,14,128401,128404,14,128421,128421,14,128433,128434,14,128450,128452,14,128476,128478,14,128483,128483,14,128495,128495,14,128506,128506,14,128519,128520,14,128528,128528,14,128534,128534,14,128538,128538,14,128540,128542,14,128544,128549,14,128552,128555,14,128557,128557,14,128560,128563,14,128565,128565,14,128567,128576,14,128581,128591,14,128641,128642,14,128646,128646,14,128648,128648,14,128650,128651,14,128653,128653,14,128655,128655,14,128657,128659,14,128661,128661,14,128663,128663,14,128665,128666,14,128674,128674,14,128676,128677,14,128679,128685,14,128690,128690,14,128694,128694,14,128697,128702,14,128704,128704,14,128710,128714,14,128716,128716,14,128720,128720,14,128723,128724,14,128726,128727,14,128733,128735,14,128742,128744,14,128746,128746,14,128749,128751,14,128753,128754,14,128756,128758,14,128761,128761,14,128763,128764,14,128884,128895,14,128992,129003,14,129008,129008,14,129036,129039,14,129114,129119,14,129198,129279,14,129293,129295,14,129305,129310,14,129312,129319,14,129328,129328,14,129331,129338,14,129343,129343,14,129351,129355,14,129357,129359,14,129375,129387,14,129393,129393,14,129395,129398,14,129401,129401,14,129403,129403,14,129408,129412,14,129426,129431,14,129443,129444,14,129451,129453,14,129456,129465,14,129472,129472,14,129475,129482,14,129484,129484,14,129488,129510,14,129536,129647,14,129652,129652,14,129656,129658,14,129661,129663,14,129667,129670,14,129680,129685,14,129705,129708,14,129712,129718,14,129723,129727,14,129731,129733,14,129744,129750,14,129754,129759,14,129768,129775,14,129783,129791,14,917504,917504,4,917506,917535,4,917632,917759,4,918000,921599,4,0,9,4,11,12,4,14,31,4,169,169,14,174,174,14,1155,1159,5,1425,1469,5,1473,1474,5,1479,1479,5,1552,1562,5,1611,1631,5,1750,1756,5,1759,1764,5,1770,1773,5,1809,1809,5,1958,1968,5,2045,2045,5,2075,2083,5,2089,2093,5,2192,2193,1,2250,2273,5,2275,2306,5,2362,2362,5,2364,2364,5,2369,2376,5,2381,2381,5,2385,2391,5,2433,2433,5,2492,2492,5,2495,2496,7,2503,2504,7,2509,2509,5,2530,2531,5,2561,2562,5,2620,2620,5,2625,2626,5,2635,2637,5,2672,2673,5,2689,2690,5,2748,2748,5,2753,2757,5,2761,2761,7,2765,2765,5,2810,2815,5,2818,2819,7,2878,2878,5,2880,2880,7,2887,2888,7,2893,2893,5,2903,2903,5,2946,2946,5,3007,3007,7,3009,3010,7,3018,3020,7,3031,3031,5,3073,3075,7,3132,3132,5,3137,3140,7,3146,3149,5,3170,3171,5,3202,3203,7,3262,3262,7,3264,3265,7,3267,3268,7,3271,3272,7,3276,3277,5,3298,3299,5,3330,3331,7,3390,3390,5,3393,3396,5,3402,3404,7,3406,3406,1,3426,3427,5,3458,3459,7,3535,3535,5,3538,3540,5,3544,3550,7,3570,3571,7,3635,3635,7,3655,3662,5,3763,3763,7,3784,3789,5,3893,3893,5,3897,3897,5,3953,3966,5,3968,3972,5,3981,3991,5,4038,4038,5,4145,4145,7,4153,4154,5,4157,4158,5,4184,4185,5,4209,4212,5,4228,4228,7,4237,4237,5,4352,4447,8,4520,4607,10,5906,5908,5,5938,5939,5,5970,5971,5,6068,6069,5,6071,6077,5,6086,6086,5,6089,6099,5,6155,6157,5,6159,6159,5,6313,6313,5,6435,6438,7,6441,6443,7,6450,6450,5,6457,6459,5,6681,6682,7,6741,6741,7,6743,6743,7,6752,6752,5,6757,6764,5,6771,6780,5,6832,6845,5,6847,6862,5,6916,6916,7,6965,6965,5,6971,6971,7,6973,6977,7,6979,6980,7,7040,7041,5,7073,7073,7,7078,7079,7,7082,7082,7,7142,7142,5,7144,7145,5,7149,7149,5,7151,7153,5,7204,7211,7,7220,7221,7,7376,7378,5,7393,7393,7,7405,7405,5,7415,7415,7,7616,7679,5,8204,8204,5,8206,8207,4,8233,8233,4,8252,8252,14,8288,8292,4,8294,8303,4,8413,8416,5,8418,8420,5,8482,8482,14,8596,8601,14,8986,8987,14,9096,9096,14,9193,9196,14,9199,9199,14,9201,9202,14,9208,9210,14,9642,9643,14,9664,9664,14,9728,9729,14,9732,9732,14,9735,9741,14,9743,9744,14,9746,9746,14,9750,9751,14,9753,9756,14,9758,9759,14,9761,9761,14,9764,9765,14,9767,9769,14,9771,9773,14,9775,9775,14,9784,9785,14,9787,9791,14,9793,9793,14,9795,9799,14,9812,9822,14,9824,9824,14,9827,9827,14,9829,9830,14,9832,9832,14,9851,9851,14,9854,9854,14,9856,9861,14,9874,9874,14,9876,9876,14,9878,9879,14,9881,9881,14,9883,9884,14,9888,9889,14,9895,9895,14,9898,9899,14,9904,9905,14,9917,9918,14,9924,9925,14,9928,9928,14,9934,9934,14,9936,9936,14,9938,9938,14,9940,9940,14,9961,9961,14,9963,9967,14,9970,9971,14,9973,9973,14,9975,9977,14,9979,9980,14,9982,9985,14,9987,9988,14,9992,9996,14,9998,9998,14,10000,10001,14,10004,10004,14,10013,10013,14,10024,10024,14,10052,10052,14,10060,10060,14,10067,10069,14,10083,10083,14,10085,10087,14,10145,10145,14,10175,10175,14,11013,11015,14,11088,11088,14,11503,11505,5,11744,11775,5,12334,12335,5,12349,12349,14,12951,12951,14,42607,42607,5,42612,42621,5,42736,42737,5,43014,43014,5,43043,43044,7,43047,43047,7,43136,43137,7,43204,43205,5,43263,43263,5,43335,43345,5,43360,43388,8,43395,43395,7,43444,43445,7,43450,43451,7,43454,43456,7,43561,43566,5,43569,43570,5,43573,43574,5,43596,43596,5,43644,43644,5,43698,43700,5,43710,43711,5,43755,43755,7,43758,43759,7,43766,43766,5,44005,44005,5,44008,44008,5,44012,44012,7,44032,44032,11,44060,44060,11,44088,44088,11,44116,44116,11,44144,44144,11,44172,44172,11,44200,44200,11,44228,44228,11,44256,44256,11,44284,44284,11,44312,44312,11,44340,44340,11,44368,44368,11,44396,44396,11,44424,44424,11,44452,44452,11,44480,44480,11,44508,44508,11,44536,44536,11,44564,44564,11,44592,44592,11,44620,44620,11,44648,44648,11,44676,44676,11,44704,44704,11,44732,44732,11,44760,44760,11,44788,44788,11,44816,44816,11,44844,44844,11,44872,44872,11,44900,44900,11,44928,44928,11,44956,44956,11,44984,44984,11,45012,45012,11,45040,45040,11,45068,45068,11,45096,45096,11,45124,45124,11,45152,45152,11,45180,45180,11,45208,45208,11,45236,45236,11,45264,45264,11,45292,45292,11,45320,45320,11,45348,45348,11,45376,45376,11,45404,45404,11,45432,45432,11,45460,45460,11,45488,45488,11,45516,45516,11,45544,45544,11,45572,45572,11,45600,45600,11,45628,45628,11,45656,45656,11,45684,45684,11,45712,45712,11,45740,45740,11,45768,45768,11,45796,45796,11,45824,45824,11,45852,45852,11,45880,45880,11,45908,45908,11,45936,45936,11,45964,45964,11,45992,45992,11,46020,46020,11,46048,46048,11,46076,46076,11,46104,46104,11,46132,46132,11,46160,46160,11,46188,46188,11,46216,46216,11,46244,46244,11,46272,46272,11,46300,46300,11,46328,46328,11,46356,46356,11,46384,46384,11,46412,46412,11,46440,46440,11,46468,46468,11,46496,46496,11,46524,46524,11,46552,46552,11,46580,46580,11,46608,46608,11,46636,46636,11,46664,46664,11,46692,46692,11,46720,46720,11,46748,46748,11,46776,46776,11,46804,46804,11,46832,46832,11,46860,46860,11,46888,46888,11,46916,46916,11,46944,46944,11,46972,46972,11,47000,47000,11,47028,47028,11,47056,47056,11,47084,47084,11,47112,47112,11,47140,47140,11,47168,47168,11,47196,47196,11,47224,47224,11,47252,47252,11,47280,47280,11,47308,47308,11,47336,47336,11,47364,47364,11,47392,47392,11,47420,47420,11,47448,47448,11,47476,47476,11,47504,47504,11,47532,47532,11,47560,47560,11,47588,47588,11,47616,47616,11,47644,47644,11,47672,47672,11,47700,47700,11,47728,47728,11,47756,47756,11,47784,47784,11,47812,47812,11,47840,47840,11,47868,47868,11,47896,47896,11,47924,47924,11,47952,47952,11,47980,47980,11,48008,48008,11,48036,48036,11,48064,48064,11,48092,48092,11,48120,48120,11,48148,48148,11,48176,48176,11,48204,48204,11,48232,48232,11,48260,48260,11,48288,48288,11,48316,48316,11,48344,48344,11,48372,48372,11,48400,48400,11,48428,48428,11,48456,48456,11,48484,48484,11,48512,48512,11,48540,48540,11,48568,48568,11,48596,48596,11,48624,48624,11,48652,48652,11,48680,48680,11,48708,48708,11,48736,48736,11,48764,48764,11,48792,48792,11,48820,48820,11,48848,48848,11,48876,48876,11,48904,48904,11,48932,48932,11,48960,48960,11,48988,48988,11,49016,49016,11,49044,49044,11,49072,49072,11,49100,49100,11,49128,49128,11,49156,49156,11,49184,49184,11,49212,49212,11,49240,49240,11,49268,49268,11,49296,49296,11,49324,49324,11,49352,49352,11,49380,49380,11,49408,49408,11,49436,49436,11,49464,49464,11,49492,49492,11,49520,49520,11,49548,49548,11,49576,49576,11,49604,49604,11,49632,49632,11,49660,49660,11,49688,49688,11,49716,49716,11,49744,49744,11,49772,49772,11,49800,49800,11,49828,49828,11,49856,49856,11,49884,49884,11,49912,49912,11,49940,49940,11,49968,49968,11,49996,49996,11,50024,50024,11,50052,50052,11,50080,50080,11,50108,50108,11,50136,50136,11,50164,50164,11,50192,50192,11,50220,50220,11,50248,50248,11,50276,50276,11,50304,50304,11,50332,50332,11,50360,50360,11,50388,50388,11,50416,50416,11,50444,50444,11,50472,50472,11,50500,50500,11,50528,50528,11,50556,50556,11,50584,50584,11,50612,50612,11,50640,50640,11,50668,50668,11,50696,50696,11,50724,50724,11,50752,50752,11,50780,50780,11,50808,50808,11,50836,50836,11,50864,50864,11,50892,50892,11,50920,50920,11,50948,50948,11,50976,50976,11,51004,51004,11,51032,51032,11,51060,51060,11,51088,51088,11,51116,51116,11,51144,51144,11,51172,51172,11,51200,51200,11,51228,51228,11,51256,51256,11,51284,51284,11,51312,51312,11,51340,51340,11,51368,51368,11,51396,51396,11,51424,51424,11,51452,51452,11,51480,51480,11,51508,51508,11,51536,51536,11,51564,51564,11,51592,51592,11,51620,51620,11,51648,51648,11,51676,51676,11,51704,51704,11,51732,51732,11,51760,51760,11,51788,51788,11,51816,51816,11,51844,51844,11,51872,51872,11,51900,51900,11,51928,51928,11,51956,51956,11,51984,51984,11,52012,52012,11,52040,52040,11,52068,52068,11,52096,52096,11,52124,52124,11,52152,52152,11,52180,52180,11,52208,52208,11,52236,52236,11,52264,52264,11,52292,52292,11,52320,52320,11,52348,52348,11,52376,52376,11,52404,52404,11,52432,52432,11,52460,52460,11,52488,52488,11,52516,52516,11,52544,52544,11,52572,52572,11,52600,52600,11,52628,52628,11,52656,52656,11,52684,52684,11,52712,52712,11,52740,52740,11,52768,52768,11,52796,52796,11,52824,52824,11,52852,52852,11,52880,52880,11,52908,52908,11,52936,52936,11,52964,52964,11,52992,52992,11,53020,53020,11,53048,53048,11,53076,53076,11,53104,53104,11,53132,53132,11,53160,53160,11,53188,53188,11,53216,53216,11,53244,53244,11,53272,53272,11,53300,53300,11,53328,53328,11,53356,53356,11,53384,53384,11,53412,53412,11,53440,53440,11,53468,53468,11,53496,53496,11,53524,53524,11,53552,53552,11,53580,53580,11,53608,53608,11,53636,53636,11,53664,53664,11,53692,53692,11,53720,53720,11,53748,53748,11,53776,53776,11,53804,53804,11,53832,53832,11,53860,53860,11,53888,53888,11,53916,53916,11,53944,53944,11,53972,53972,11,54000,54000,11,54028,54028,11,54056,54056,11,54084,54084,11,54112,54112,11,54140,54140,11,54168,54168,11,54196,54196,11,54224,54224,11,54252,54252,11,54280,54280,11,54308,54308,11,54336,54336,11,54364,54364,11,54392,54392,11,54420,54420,11,54448,54448,11,54476,54476,11,54504,54504,11,54532,54532,11,54560,54560,11,54588,54588,11,54616,54616,11,54644,54644,11,54672,54672,11,54700,54700,11,54728,54728,11,54756,54756,11,54784,54784,11,54812,54812,11,54840,54840,11,54868,54868,11,54896,54896,11,54924,54924,11,54952,54952,11,54980,54980,11,55008,55008,11,55036,55036,11,55064,55064,11,55092,55092,11,55120,55120,11,55148,55148,11,55176,55176,11,55216,55238,9,64286,64286,5,65056,65071,5,65438,65439,5,65529,65531,4,66272,66272,5,68097,68099,5,68108,68111,5,68159,68159,5,68900,68903,5,69446,69456,5,69632,69632,7,69634,69634,7,69744,69744,5,69759,69761,5,69808,69810,7,69815,69816,7,69821,69821,1,69837,69837,1,69927,69931,5,69933,69940,5,70003,70003,5,70018,70018,7,70070,70078,5,70082,70083,1,70094,70094,7,70188,70190,7,70194,70195,7,70197,70197,7,70206,70206,5,70368,70370,7,70400,70401,5,70459,70460,5,70463,70463,7,70465,70468,7,70475,70477,7,70498,70499,7,70512,70516,5,70712,70719,5,70722,70724,5,70726,70726,5,70832,70832,5,70835,70840,5,70842,70842,5,70845,70845,5,70847,70848,5,70850,70851,5,71088,71089,7,71096,71099,7,71102,71102,7,71132,71133,5,71219,71226,5,71229,71229,5,71231,71232,5,71340,71340,7,71342,71343,7,71350,71350,7,71453,71455,5,71462,71462,7,71724,71726,7,71736,71736,7,71984,71984,5,71991,71992,7,71997,71997,7,71999,71999,1,72001,72001,1,72003,72003,5,72148,72151,5,72156,72159,7,72164,72164,7,72243,72248,5,72250,72250,1,72263,72263,5,72279,72280,7,72324,72329,1,72343,72343,7,72751,72751,7,72760,72765,5,72767,72767,5,72873,72873,7,72881,72881,7,72884,72884,7,73009,73014,5,73020,73021,5,73030,73030,1,73098,73102,7,73107,73108,7,73110,73110,7,73459,73460,5,78896,78904,4,92976,92982,5,94033,94087,7,94180,94180,5,113821,113822,5,118528,118573,5,119141,119141,5,119143,119145,5,119150,119154,5,119163,119170,5,119210,119213,5,121344,121398,5,121461,121461,5,121499,121503,5,122880,122886,5,122907,122913,5,122918,122922,5,123566,123566,5,125136,125142,5,126976,126979,14,126981,127182,14,127184,127231,14,127279,127279,14,127344,127345,14,127374,127374,14,127405,127461,14,127489,127490,14,127514,127514,14,127538,127546,14,127561,127567,14,127570,127743,14,127757,127758,14,127760,127760,14,127762,127762,14,127766,127768,14,127770,127770,14,127772,127772,14,127775,127776,14,127778,127779,14,127789,127791,14,127794,127795,14,127798,127798,14,127819,127819,14,127824,127824,14,127868,127868,14,127870,127871,14,127892,127893,14,127896,127896,14,127900,127901,14,127904,127940,14,127942,127942,14,127944,127944,14,127946,127946,14,127951,127955,14,127968,127971,14,127973,127984,14,127987,127987,14,127989,127989,14,127991,127991,14,127995,127999,5,128008,128008,14,128012,128014,14,128017,128018,14,128020,128020,14,128022,128022,14,128042,128042,14,128063,128063,14,128065,128065,14,128101,128101,14,128108,128109,14,128173,128173,14,128182,128183,14,128236,128237,14,128239,128239,14,128245,128245,14,128248,128248,14,128253,128253,14,128255,128258,14,128260,128263,14,128265,128265,14,128277,128277,14,128300,128301,14,128326,128328,14,128331,128334,14,128336,128347,14,128360,128366,14,128369,128370,14,128378,128378,14,128391,128391,14,128394,128397,14,128400,128400,14,128405,128406,14,128420,128420,14,128422,128423,14,128425,128432,14,128435,128443,14,128445,128449,14,128453,128464,14,128468,128475,14,128479,128480,14,128482,128482,14,128484,128487,14,128489,128494,14,128496,128498,14,128500,128505,14,128507,128511,14,128513,128518,14,128521,128525,14,128527,128527,14,128529,128529,14,128533,128533,14,128535,128535,14,128537,128537,14]`)}var bO;(function(e){e[e.zwj=8205]=`zwj`,e[e.emojiVariantSelector=65039]=`emojiVariantSelector`,e[e.enclosingKeyCap=8419]=`enclosingKeyCap`,e[e.space=32]=`space`})(bO||={}),class e{static{this.ambiguousCharacterData=new sO(()=>JSON.parse(`{"_common":[8232,32,8233,32,5760,32,8192,32,8193,32,8194,32,8195,32,8196,32,8197,32,8198,32,8200,32,8201,32,8202,32,8287,32,8199,32,8239,32,2042,95,65101,95,65102,95,65103,95,8208,45,8209,45,8210,45,65112,45,1748,45,8259,45,727,45,8722,45,10134,45,11450,45,1549,44,1643,44,184,44,42233,44,894,59,2307,58,2691,58,1417,58,1795,58,1796,58,5868,58,65072,58,6147,58,6153,58,8282,58,1475,58,760,58,42889,58,8758,58,720,58,42237,58,451,33,11601,33,660,63,577,63,2429,63,5038,63,42731,63,119149,46,8228,46,1793,46,1794,46,42510,46,68176,46,1632,46,1776,46,42232,46,1373,96,65287,96,8219,96,1523,96,8242,96,1370,96,8175,96,65344,96,900,96,8189,96,8125,96,8127,96,8190,96,697,96,884,96,712,96,714,96,715,96,756,96,699,96,701,96,700,96,702,96,42892,96,1497,96,2036,96,2037,96,5194,96,5836,96,94033,96,94034,96,65339,91,10088,40,10098,40,12308,40,64830,40,65341,93,10089,41,10099,41,12309,41,64831,41,10100,123,119060,123,10101,125,65342,94,8270,42,1645,42,8727,42,66335,42,5941,47,8257,47,8725,47,8260,47,9585,47,10187,47,10744,47,119354,47,12755,47,12339,47,11462,47,20031,47,12035,47,65340,92,65128,92,8726,92,10189,92,10741,92,10745,92,119311,92,119355,92,12756,92,20022,92,12034,92,42872,38,708,94,710,94,5869,43,10133,43,66203,43,8249,60,10094,60,706,60,119350,60,5176,60,5810,60,5120,61,11840,61,12448,61,42239,61,8250,62,10095,62,707,62,119351,62,5171,62,94015,62,8275,126,732,126,8128,126,8764,126,65372,124,65293,45,118002,50,120784,50,120794,50,120804,50,120814,50,120824,50,130034,50,42842,50,423,50,1000,50,42564,50,5311,50,42735,50,119302,51,118003,51,120785,51,120795,51,120805,51,120815,51,120825,51,130035,51,42923,51,540,51,439,51,42858,51,11468,51,1248,51,94011,51,71882,51,118004,52,120786,52,120796,52,120806,52,120816,52,120826,52,130036,52,5070,52,71855,52,118005,53,120787,53,120797,53,120807,53,120817,53,120827,53,130037,53,444,53,71867,53,118006,54,120788,54,120798,54,120808,54,120818,54,120828,54,130038,54,11474,54,5102,54,71893,54,119314,55,118007,55,120789,55,120799,55,120809,55,120819,55,120829,55,130039,55,66770,55,71878,55,2819,56,2538,56,2666,56,125131,56,118008,56,120790,56,120800,56,120810,56,120820,56,120830,56,130040,56,547,56,546,56,66330,56,2663,57,2920,57,2541,57,3437,57,118009,57,120791,57,120801,57,120811,57,120821,57,120831,57,130041,57,42862,57,11466,57,71884,57,71852,57,71894,57,9082,97,65345,97,119834,97,119886,97,119938,97,119990,97,120042,97,120094,97,120146,97,120198,97,120250,97,120302,97,120354,97,120406,97,120458,97,593,97,945,97,120514,97,120572,97,120630,97,120688,97,120746,97,65313,65,117974,65,119808,65,119860,65,119912,65,119964,65,120016,65,120068,65,120120,65,120172,65,120224,65,120276,65,120328,65,120380,65,120432,65,913,65,120488,65,120546,65,120604,65,120662,65,120720,65,5034,65,5573,65,42222,65,94016,65,66208,65,119835,98,119887,98,119939,98,119991,98,120043,98,120095,98,120147,98,120199,98,120251,98,120303,98,120355,98,120407,98,120459,98,388,98,5071,98,5234,98,5551,98,65314,66,8492,66,117975,66,119809,66,119861,66,119913,66,120017,66,120069,66,120121,66,120173,66,120225,66,120277,66,120329,66,120381,66,120433,66,42932,66,914,66,120489,66,120547,66,120605,66,120663,66,120721,66,5108,66,5623,66,42192,66,66178,66,66209,66,66305,66,65347,99,8573,99,119836,99,119888,99,119940,99,119992,99,120044,99,120096,99,120148,99,120200,99,120252,99,120304,99,120356,99,120408,99,120460,99,7428,99,1010,99,11429,99,43951,99,66621,99,128844,67,71913,67,71922,67,65315,67,8557,67,8450,67,8493,67,117976,67,119810,67,119862,67,119914,67,119966,67,120018,67,120174,67,120226,67,120278,67,120330,67,120382,67,120434,67,1017,67,11428,67,5087,67,42202,67,66210,67,66306,67,66581,67,66844,67,8574,100,8518,100,119837,100,119889,100,119941,100,119993,100,120045,100,120097,100,120149,100,120201,100,120253,100,120305,100,120357,100,120409,100,120461,100,1281,100,5095,100,5231,100,42194,100,8558,68,8517,68,117977,68,119811,68,119863,68,119915,68,119967,68,120019,68,120071,68,120123,68,120175,68,120227,68,120279,68,120331,68,120383,68,120435,68,5024,68,5598,68,5610,68,42195,68,8494,101,65349,101,8495,101,8519,101,119838,101,119890,101,119942,101,120046,101,120098,101,120150,101,120202,101,120254,101,120306,101,120358,101,120410,101,120462,101,43826,101,1213,101,8959,69,65317,69,8496,69,117978,69,119812,69,119864,69,119916,69,120020,69,120072,69,120124,69,120176,69,120228,69,120280,69,120332,69,120384,69,120436,69,917,69,120492,69,120550,69,120608,69,120666,69,120724,69,11577,69,5036,69,42224,69,71846,69,71854,69,66182,69,119839,102,119891,102,119943,102,119995,102,120047,102,120099,102,120151,102,120203,102,120255,102,120307,102,120359,102,120411,102,120463,102,43829,102,42905,102,383,102,7837,102,1412,102,119315,70,8497,70,117979,70,119813,70,119865,70,119917,70,120021,70,120073,70,120125,70,120177,70,120229,70,120281,70,120333,70,120385,70,120437,70,42904,70,988,70,120778,70,5556,70,42205,70,71874,70,71842,70,66183,70,66213,70,66853,70,65351,103,8458,103,119840,103,119892,103,119944,103,120048,103,120100,103,120152,103,120204,103,120256,103,120308,103,120360,103,120412,103,120464,103,609,103,7555,103,397,103,1409,103,117980,71,119814,71,119866,71,119918,71,119970,71,120022,71,120074,71,120126,71,120178,71,120230,71,120282,71,120334,71,120386,71,120438,71,1292,71,5056,71,5107,71,42198,71,65352,104,8462,104,119841,104,119945,104,119997,104,120049,104,120101,104,120153,104,120205,104,120257,104,120309,104,120361,104,120413,104,120465,104,1211,104,1392,104,5058,104,65320,72,8459,72,8460,72,8461,72,117981,72,119815,72,119867,72,119919,72,120023,72,120179,72,120231,72,120283,72,120335,72,120387,72,120439,72,919,72,120494,72,120552,72,120610,72,120668,72,120726,72,11406,72,5051,72,5500,72,42215,72,66255,72,731,105,9075,105,65353,105,8560,105,8505,105,8520,105,119842,105,119894,105,119946,105,119998,105,120050,105,120102,105,120154,105,120206,105,120258,105,120310,105,120362,105,120414,105,120466,105,120484,105,618,105,617,105,953,105,8126,105,890,105,120522,105,120580,105,120638,105,120696,105,120754,105,1110,105,42567,105,1231,105,43893,105,5029,105,71875,105,65354,106,8521,106,119843,106,119895,106,119947,106,119999,106,120051,106,120103,106,120155,106,120207,106,120259,106,120311,106,120363,106,120415,106,120467,106,1011,106,1112,106,65322,74,117983,74,119817,74,119869,74,119921,74,119973,74,120025,74,120077,74,120129,74,120181,74,120233,74,120285,74,120337,74,120389,74,120441,74,42930,74,895,74,1032,74,5035,74,5261,74,42201,74,119844,107,119896,107,119948,107,120000,107,120052,107,120104,107,120156,107,120208,107,120260,107,120312,107,120364,107,120416,107,120468,107,8490,75,65323,75,117984,75,119818,75,119870,75,119922,75,119974,75,120026,75,120078,75,120130,75,120182,75,120234,75,120286,75,120338,75,120390,75,120442,75,922,75,120497,75,120555,75,120613,75,120671,75,120729,75,11412,75,5094,75,5845,75,42199,75,66840,75,1472,108,8739,73,9213,73,65512,73,1633,108,1777,73,66336,108,125127,108,118001,108,120783,73,120793,73,120803,73,120813,73,120823,73,130033,73,65321,73,8544,73,8464,73,8465,73,117982,108,119816,73,119868,73,119920,73,120024,73,120128,73,120180,73,120232,73,120284,73,120336,73,120388,73,120440,73,65356,108,8572,73,8467,108,119845,108,119897,108,119949,108,120001,108,120053,108,120105,73,120157,73,120209,73,120261,73,120313,73,120365,73,120417,73,120469,73,448,73,120496,73,120554,73,120612,73,120670,73,120728,73,11410,73,1030,73,1216,73,1493,108,1503,108,1575,108,126464,108,126592,108,65166,108,65165,108,1994,108,11599,73,5825,73,42226,73,93992,73,66186,124,66313,124,119338,76,8556,76,8466,76,117985,76,119819,76,119871,76,119923,76,120027,76,120079,76,120131,76,120183,76,120235,76,120287,76,120339,76,120391,76,120443,76,11472,76,5086,76,5290,76,42209,76,93974,76,71843,76,71858,76,66587,76,66854,76,65325,77,8559,77,8499,77,117986,77,119820,77,119872,77,119924,77,120028,77,120080,77,120132,77,120184,77,120236,77,120288,77,120340,77,120392,77,120444,77,924,77,120499,77,120557,77,120615,77,120673,77,120731,77,1018,77,11416,77,5047,77,5616,77,5846,77,42207,77,66224,77,66321,77,119847,110,119899,110,119951,110,120003,110,120055,110,120107,110,120159,110,120211,110,120263,110,120315,110,120367,110,120419,110,120471,110,1400,110,1404,110,65326,78,8469,78,117987,78,119821,78,119873,78,119925,78,119977,78,120029,78,120081,78,120185,78,120237,78,120289,78,120341,78,120393,78,120445,78,925,78,120500,78,120558,78,120616,78,120674,78,120732,78,11418,78,42208,78,66835,78,3074,111,3202,111,3330,111,3458,111,2406,111,2662,111,2790,111,3046,111,3174,111,3302,111,3430,111,3664,111,3792,111,4160,111,1637,111,1781,111,65359,111,8500,111,119848,111,119900,111,119952,111,120056,111,120108,111,120160,111,120212,111,120264,111,120316,111,120368,111,120420,111,120472,111,7439,111,7441,111,43837,111,959,111,120528,111,120586,111,120644,111,120702,111,120760,111,963,111,120532,111,120590,111,120648,111,120706,111,120764,111,11423,111,4351,111,1413,111,1505,111,1607,111,126500,111,126564,111,126596,111,65259,111,65260,111,65258,111,65257,111,1726,111,64428,111,64429,111,64427,111,64426,111,1729,111,64424,111,64425,111,64423,111,64422,111,1749,111,3360,111,4125,111,66794,111,71880,111,71895,111,66604,111,1984,79,2534,79,2918,79,12295,79,70864,79,71904,79,118000,79,120782,79,120792,79,120802,79,120812,79,120822,79,130032,79,65327,79,117988,79,119822,79,119874,79,119926,79,119978,79,120030,79,120082,79,120134,79,120186,79,120238,79,120290,79,120342,79,120394,79,120446,79,927,79,120502,79,120560,79,120618,79,120676,79,120734,79,11422,79,1365,79,11604,79,4816,79,2848,79,66754,79,42227,79,71861,79,66194,79,66219,79,66564,79,66838,79,9076,112,65360,112,119849,112,119901,112,119953,112,120005,112,120057,112,120109,112,120161,112,120213,112,120265,112,120317,112,120369,112,120421,112,120473,112,961,112,120530,112,120544,112,120588,112,120602,112,120646,112,120660,112,120704,112,120718,112,120762,112,120776,112,11427,112,65328,80,8473,80,117989,80,119823,80,119875,80,119927,80,119979,80,120031,80,120083,80,120187,80,120239,80,120291,80,120343,80,120395,80,120447,80,929,80,120504,80,120562,80,120620,80,120678,80,120736,80,11426,80,5090,80,5229,80,42193,80,66197,80,119850,113,119902,113,119954,113,120006,113,120058,113,120110,113,120162,113,120214,113,120266,113,120318,113,120370,113,120422,113,120474,113,1307,113,1379,113,1382,113,8474,81,117990,81,119824,81,119876,81,119928,81,119980,81,120032,81,120084,81,120188,81,120240,81,120292,81,120344,81,120396,81,120448,81,11605,81,119851,114,119903,114,119955,114,120007,114,120059,114,120111,114,120163,114,120215,114,120267,114,120319,114,120371,114,120423,114,120475,114,43847,114,43848,114,7462,114,11397,114,43905,114,119318,82,8475,82,8476,82,8477,82,117991,82,119825,82,119877,82,119929,82,120033,82,120189,82,120241,82,120293,82,120345,82,120397,82,120449,82,422,82,5025,82,5074,82,66740,82,5511,82,42211,82,94005,82,65363,115,119852,115,119904,115,119956,115,120008,115,120060,115,120112,115,120164,115,120216,115,120268,115,120320,115,120372,115,120424,115,120476,115,42801,115,445,115,1109,115,43946,115,71873,115,66632,115,65331,83,117992,83,119826,83,119878,83,119930,83,119982,83,120034,83,120086,83,120138,83,120190,83,120242,83,120294,83,120346,83,120398,83,120450,83,1029,83,1359,83,5077,83,5082,83,42210,83,94010,83,66198,83,66592,83,119853,116,119905,116,119957,116,120009,116,120061,116,120113,116,120165,116,120217,116,120269,116,120321,116,120373,116,120425,116,120477,116,8868,84,10201,84,128872,84,65332,84,117993,84,119827,84,119879,84,119931,84,119983,84,120035,84,120087,84,120139,84,120191,84,120243,84,120295,84,120347,84,120399,84,120451,84,932,84,120507,84,120565,84,120623,84,120681,84,120739,84,11430,84,5026,84,42196,84,93962,84,71868,84,66199,84,66225,84,66325,84,119854,117,119906,117,119958,117,120010,117,120062,117,120114,117,120166,117,120218,117,120270,117,120322,117,120374,117,120426,117,120478,117,42911,117,7452,117,43854,117,43858,117,651,117,965,117,120534,117,120592,117,120650,117,120708,117,120766,117,1405,117,66806,117,71896,117,8746,85,8899,85,117994,85,119828,85,119880,85,119932,85,119984,85,120036,85,120088,85,120140,85,120192,85,120244,85,120296,85,120348,85,120400,85,120452,85,1357,85,4608,85,66766,85,5196,85,42228,85,94018,85,71864,85,8744,118,8897,118,65366,118,8564,118,119855,118,119907,118,119959,118,120011,118,120063,118,120115,118,120167,118,120219,118,120271,118,120323,118,120375,118,120427,118,120479,118,7456,118,957,118,120526,118,120584,118,120642,118,120700,118,120758,118,1141,118,1496,118,71430,118,43945,118,71872,118,119309,86,1639,86,1783,86,8548,86,117995,86,119829,86,119881,86,119933,86,119985,86,120037,86,120089,86,120141,86,120193,86,120245,86,120297,86,120349,86,120401,86,120453,86,1140,86,11576,86,5081,86,5167,86,42719,86,42214,86,93960,86,71840,86,66845,86,623,119,119856,119,119908,119,119960,119,120012,119,120064,119,120116,119,120168,119,120220,119,120272,119,120324,119,120376,119,120428,119,120480,119,7457,119,1121,119,1309,119,1377,119,71434,119,71438,119,71439,119,43907,119,71910,87,71919,87,117996,87,119830,87,119882,87,119934,87,119986,87,120038,87,120090,87,120142,87,120194,87,120246,87,120298,87,120350,87,120402,87,120454,87,1308,87,5043,87,5076,87,42218,87,5742,120,10539,120,10540,120,10799,120,65368,120,8569,120,119857,120,119909,120,119961,120,120013,120,120065,120,120117,120,120169,120,120221,120,120273,120,120325,120,120377,120,120429,120,120481,120,5441,120,5501,120,5741,88,9587,88,66338,88,71916,88,65336,88,8553,88,117997,88,119831,88,119883,88,119935,88,119987,88,120039,88,120091,88,120143,88,120195,88,120247,88,120299,88,120351,88,120403,88,120455,88,42931,88,935,88,120510,88,120568,88,120626,88,120684,88,120742,88,11436,88,11613,88,5815,88,42219,88,66192,88,66228,88,66327,88,66855,88,611,121,7564,121,65369,121,119858,121,119910,121,119962,121,120014,121,120066,121,120118,121,120170,121,120222,121,120274,121,120326,121,120378,121,120430,121,120482,121,655,121,7935,121,43866,121,947,121,8509,121,120516,121,120574,121,120632,121,120690,121,120748,121,1199,121,4327,121,71900,121,65337,89,117998,89,119832,89,119884,89,119936,89,119988,89,120040,89,120092,89,120144,89,120196,89,120248,89,120300,89,120352,89,120404,89,120456,89,933,89,978,89,120508,89,120566,89,120624,89,120682,89,120740,89,11432,89,1198,89,5033,89,5053,89,42220,89,94019,89,71844,89,66226,89,119859,122,119911,122,119963,122,120015,122,120067,122,120119,122,120171,122,120223,122,120275,122,120327,122,120379,122,120431,122,120483,122,7458,122,43923,122,71876,122,71909,90,66293,90,65338,90,8484,90,8488,90,117999,90,119833,90,119885,90,119937,90,119989,90,120041,90,120197,90,120249,90,120301,90,120353,90,120405,90,120457,90,918,90,120493,90,120551,90,120609,90,120667,90,120725,90,5059,90,42204,90,71849,90,65282,34,65283,35,65284,36,65285,37,65286,38,65290,42,65291,43,65294,46,65295,47,65296,48,65298,50,65299,51,65300,52,65301,53,65302,54,65303,55,65304,56,65305,57,65308,60,65309,61,65310,62,65312,64,65316,68,65318,70,65319,71,65324,76,65329,81,65330,82,65333,85,65334,86,65335,87,65343,95,65346,98,65348,100,65350,102,65355,107,65357,109,65358,110,65361,113,65362,114,65364,116,65365,117,65367,119,65370,122,65371,123,65373,125,119846,109],"_default":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"cs":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"de":[65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"es":[8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"fr":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"it":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"ja":[8211,45,8218,44,65281,33,8216,96,8245,96,180,96,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65292,44,65297,49,65307,59],"ko":[8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"pl":[65374,126,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"pt-BR":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"qps-ploc":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"ru":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,305,105,921,73,1009,112,215,120,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"tr":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"zh-hans":[160,32,65374,126,8218,44,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65297,49],"zh-hant":[8211,45,65374,126,8218,44,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89]}`))}static{this.cache=new aO(t=>{let n=t.split(`,`);function r(e){let t=new Map;for(let n=0;n<e.length;n+=2)t.set(e[n],e[n+1]);return t}function i(e,t){let n=new Map(e);for(let[e,r]of t)n.set(e,r);return n}function a(e,t){if(!e)return t;let n=new Map;for(let[r,i]of e)t.has(r)&&n.set(r,i);return n}let o=this.ambiguousCharacterData.value,s=n.filter(e=>!e.startsWith(`_`)&&Object.hasOwn(o,e));s.length===0&&(s=[`_default`]);let c;for(let e of s){let t=r(o[e]);c=a(c,t)}return new e(i(r(o._common),c))})}static getInstance(t){return e.cache.get(Array.from(t).join(`,`))}static{this._locales=new sO(()=>Object.keys(e.ambiguousCharacterData.value).filter(e=>!e.startsWith(`_`)))}static getLocales(){return e._locales.value}constructor(e){this.confusableDictionary=e}isAmbiguous(e){return this.confusableDictionary.has(e)}containsAmbiguousCharacter(e){for(let t=0;t<e.length;t++){let n=e.codePointAt(t);if(typeof n==`number`&&this.isAmbiguous(n))return!0}return!1}getPrimaryConfusable(e){return this.confusableDictionary.get(e)}getConfusableCodePoints(){return new Set(this.confusableDictionary.keys())}},class e{static getRawData(){return JSON.parse(`{"_common":[11,12,13,127,847,1564,4447,4448,6068,6069,6155,6156,6157,6158,7355,7356,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8204,8205,8206,8207,8234,8235,8236,8237,8238,8239,8287,8288,8289,8290,8291,8292,8293,8294,8295,8296,8297,8298,8299,8300,8301,8302,8303,10240,12644,65024,65025,65026,65027,65028,65029,65030,65031,65032,65033,65034,65035,65036,65037,65038,65039,65279,65440,65520,65521,65522,65523,65524,65525,65526,65527,65528,65532,78844,119155,119156,119157,119158,119159,119160,119161,119162,917504,917505,917506,917507,917508,917509,917510,917511,917512,917513,917514,917515,917516,917517,917518,917519,917520,917521,917522,917523,917524,917525,917526,917527,917528,917529,917530,917531,917532,917533,917534,917535,917536,917537,917538,917539,917540,917541,917542,917543,917544,917545,917546,917547,917548,917549,917550,917551,917552,917553,917554,917555,917556,917557,917558,917559,917560,917561,917562,917563,917564,917565,917566,917567,917568,917569,917570,917571,917572,917573,917574,917575,917576,917577,917578,917579,917580,917581,917582,917583,917584,917585,917586,917587,917588,917589,917590,917591,917592,917593,917594,917595,917596,917597,917598,917599,917600,917601,917602,917603,917604,917605,917606,917607,917608,917609,917610,917611,917612,917613,917614,917615,917616,917617,917618,917619,917620,917621,917622,917623,917624,917625,917626,917627,917628,917629,917630,917631,917760,917761,917762,917763,917764,917765,917766,917767,917768,917769,917770,917771,917772,917773,917774,917775,917776,917777,917778,917779,917780,917781,917782,917783,917784,917785,917786,917787,917788,917789,917790,917791,917792,917793,917794,917795,917796,917797,917798,917799,917800,917801,917802,917803,917804,917805,917806,917807,917808,917809,917810,917811,917812,917813,917814,917815,917816,917817,917818,917819,917820,917821,917822,917823,917824,917825,917826,917827,917828,917829,917830,917831,917832,917833,917834,917835,917836,917837,917838,917839,917840,917841,917842,917843,917844,917845,917846,917847,917848,917849,917850,917851,917852,917853,917854,917855,917856,917857,917858,917859,917860,917861,917862,917863,917864,917865,917866,917867,917868,917869,917870,917871,917872,917873,917874,917875,917876,917877,917878,917879,917880,917881,917882,917883,917884,917885,917886,917887,917888,917889,917890,917891,917892,917893,917894,917895,917896,917897,917898,917899,917900,917901,917902,917903,917904,917905,917906,917907,917908,917909,917910,917911,917912,917913,917914,917915,917916,917917,917918,917919,917920,917921,917922,917923,917924,917925,917926,917927,917928,917929,917930,917931,917932,917933,917934,917935,917936,917937,917938,917939,917940,917941,917942,917943,917944,917945,917946,917947,917948,917949,917950,917951,917952,917953,917954,917955,917956,917957,917958,917959,917960,917961,917962,917963,917964,917965,917966,917967,917968,917969,917970,917971,917972,917973,917974,917975,917976,917977,917978,917979,917980,917981,917982,917983,917984,917985,917986,917987,917988,917989,917990,917991,917992,917993,917994,917995,917996,917997,917998,917999],"cs":[173,8203,12288],"de":[173,8203,12288],"es":[8203,12288],"fr":[173,8203,12288],"it":[160,173,12288],"ja":[173],"ko":[173,12288],"pl":[173,8203,12288],"pt-BR":[173,8203,12288],"qps-ploc":[160,173,8203,12288],"ru":[173,12288],"tr":[160,173,8203,12288],"zh-hans":[160,173,8203,12288],"zh-hant":[173,12288]}`)}static{this._data=void 0}static getData(){return this._data||=new Set([...Object.values(e.getRawData())].flat()),this._data}static isInvisibleCharacter(t){return e.getData().has(t)}static containsInvisibleCharacter(t){for(let n=0;n<t.length;n++){let r=t.codePointAt(n);if(typeof r==`number`&&(e.isInvisibleCharacter(r)||r===bO.space))return!0}return!1}static get codePoints(){return e.getData()}};var xO;(function(e){e[e.BASE=36]=`BASE`,e[e.TMIN=1]=`TMIN`,e[e.TMAX=26]=`TMAX`,e[e.SKEW=38]=`SKEW`,e[e.DAMP=700]=`DAMP`,e[e.INITIAL_BIAS=72]=`INITIAL_BIAS`,e[e.INITIAL_N=128]=`INITIAL_N`,e[e.DELIMITER=45]=`DELIMITER`})(xO||={});function SO(e){return e===X.Slash||e===X.Backslash}function CO(e){return e.replace(/[\\/]/g,Q.sep)}function wO(e){return e.indexOf(`/`)===-1&&(e=CO(e)),/^[a-zA-Z]:(\/|$)/.test(e)&&(e=`/`+e),e}function TO(e,t=Q.sep){if(!e)return``;let n=e.length,r=e.charCodeAt(0);if(SO(r)){if(SO(e.charCodeAt(1))&&!SO(e.charCodeAt(2))){let r=3,i=r;for(;r<n&&!SO(e.charCodeAt(r));r++);if(i!==r&&!SO(e.charCodeAt(r+1))){for(r+=1;r<n;r++)if(SO(e.charCodeAt(r)))return e.slice(0,r+1).replace(/[\\/]/g,t)}}return t}else if(DO(r)&&e.charCodeAt(1)===X.Colon)return SO(e.charCodeAt(2))?e.slice(0,2)+t:e.slice(0,2);let i=e.indexOf(`://`);if(i!==-1){for(i+=3;i<n;i++)if(SO(e.charCodeAt(i)))return e.slice(0,i+1)}return``}function EO(e,t,n,r=rO){if(e===t)return!0;if(!e||!t||t.length>e.length)return!1;if(n){if(!_O(e,t))return!1;if(t.length===e.length)return!0;let n=t.length;return t.charAt(t.length-1)===r&&n--,e.charAt(n)===r}return t.charAt(t.length-1)!==r&&(t+=r),e.indexOf(t)===0}function DO(e){return e>=X.A&&e<=X.Z||e>=X.a&&e<=X.z}var OO;(function(e){e[e.Uri=1]=`Uri`,e[e.Regexp=2]=`Regexp`,e[e.ScmResource=3]=`ScmResource`,e[e.ScmResourceGroup=4]=`ScmResourceGroup`,e[e.ScmProvider=5]=`ScmProvider`,e[e.CommentController=6]=`CommentController`,e[e.CommentThread=7]=`CommentThread`,e[e.CommentThreadInstance=8]=`CommentThreadInstance`,e[e.CommentThreadReply=9]=`CommentThreadReply`,e[e.CommentNode=10]=`CommentNode`,e[e.CommentThreadNode=11]=`CommentThreadNode`,e[e.TimelineActionContext=12]=`TimelineActionContext`,e[e.NotebookCellActionContext=13]=`NotebookCellActionContext`,e[e.NotebookActionContext=14]=`NotebookActionContext`,e[e.TerminalContext=15]=`TerminalContext`,e[e.TestItemContext=16]=`TestItemContext`,e[e.Date=17]=`Date`,e[e.TestMessageMenuArgs=18]=`TestMessageMenuArgs`,e[e.ChatViewContext=19]=`ChatViewContext`,e[e.LanguageModelToolResult=20]=`LanguageModelToolResult`,e[e.LanguageModelTextPart=21]=`LanguageModelTextPart`,e[e.LanguageModelThinkingPart=22]=`LanguageModelThinkingPart`,e[e.LanguageModelPromptTsxPart=23]=`LanguageModelPromptTsxPart`,e[e.LanguageModelDataPart=24]=`LanguageModelDataPart`,e[e.AgentSessionContext=25]=`AgentSessionContext`,e[e.ChatResponsePullRequestPart=26]=`ChatResponsePullRequestPart`})(OO||={});const kO=/^\w[\w\d+.-]*$/,AO=/^\//,jO=/^\/\//;function MO(e,t){if(!e.scheme&&t)throw Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${e.authority}", path: "${e.path}", query: "${e.query}", fragment: "${e.fragment}"}`);if(e.scheme&&!kO.test(e.scheme))throw Error(`[UriError]: Scheme contains illegal characters.`);if(e.path){if(e.authority){if(!AO.test(e.path))throw Error(`[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character`)}else if(jO.test(e.path))throw Error(`[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")`)}}function NO(e,t){return!e&&!t?`file`:e}function PO(e,t){switch(e){case`https`:case`http`:case`file`:t?t[0]!==FO&&(t=FO+t):t=FO;break}return t}const FO=`/`,IO=/^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;var LO=class e{static isUri(t){return t instanceof e?!0:!t||typeof t!=`object`?!1:typeof t.authority==`string`&&typeof t.fragment==`string`&&typeof t.path==`string`&&typeof t.query==`string`&&typeof t.scheme==`string`&&typeof t.fsPath==`string`&&typeof t.with==`function`&&typeof t.toString==`function`}constructor(e,t,n,r,i,a=!1){typeof e==`object`?(this.scheme=e.scheme||``,this.authority=e.authority||``,this.path=e.path||``,this.query=e.query||``,this.fragment=e.fragment||``):(this.scheme=NO(e,a),this.authority=t||``,this.path=PO(this.scheme,n||``),this.query=r||``,this.fragment=i||``,MO(this,a))}get fsPath(){return UO(this,!1)}with(e){if(!e)return this;let{scheme:t,authority:n,path:r,query:i,fragment:a}=e;return t===void 0?t=this.scheme:t===null&&(t=``),n===void 0?n=this.authority:n===null&&(n=``),r===void 0?r=this.path:r===null&&(r=``),i===void 0?i=this.query:i===null&&(i=``),a===void 0?a=this.fragment:a===null&&(a=``),t===this.scheme&&n===this.authority&&r===this.path&&i===this.query&&a===this.fragment?this:new zO(t,n,r,i,a)}static parse(e,t=!1){let n=IO.exec(e);return n?new zO(n[2]||``,qO(n[4]||``),qO(n[5]||``),qO(n[7]||``),qO(n[9]||``),t):new zO(``,``,``,``,``)}static file(e){let t=``;if(wD&&(e=e.replace(/\\/g,`/`)),e[0]===`/`&&e[1]===`/`){let n=e.indexOf(`/`,2);n===-1?(t=e.substring(2),e=`/`):(t=e.substring(2,n),e=e.substring(n)||`/`)}return new zO(`file`,t,e,``,``)}static from(e,t){return new zO(e.scheme,e.authority,e.path,e.query,e.fragment,t)}static joinPath(t,...n){if(!t.path)throw Error(`[UriError]: cannot call joinPath on URI without path`);let r;return r=wD&&t.scheme===`file`?e.file(XD.join(UO(t,!0),...n)).path:Q.join(t.path,...n),t.with({path:r})}toString(e=!1){return WO(this,e)}toJSON(){return this}static revive(t){if(t){if(t instanceof e)return t;{let e=new zO(t);return e._formatted=t.external??null,e._fsPath=t._sep===RO?t.fsPath??null:null,e}}else return t}[Symbol.for(`debug.description`)](){return`URI(${this.toString()})`}};const RO=wD?1:void 0;var zO=class extends LO{constructor(){super(...arguments),this._formatted=null,this._fsPath=null}get fsPath(){return this._fsPath||=UO(this,!1),this._fsPath}toString(e=!1){return e?WO(this,!0):(this._formatted||=WO(this,!1),this._formatted)}toJSON(){let e={$mid:OO.Uri};return this._fsPath&&(e.fsPath=this._fsPath,e._sep=RO),this._formatted&&(e.external=this._formatted),this.path&&(e.path=this.path),this.scheme&&(e.scheme=this.scheme),this.authority&&(e.authority=this.authority),this.query&&(e.query=this.query),this.fragment&&(e.fragment=this.fragment),e}};const BO={[X.Colon]:`%3A`,[X.Slash]:`%2F`,[X.QuestionMark]:`%3F`,[X.Hash]:`%23`,[X.OpenSquareBracket]:`%5B`,[X.CloseSquareBracket]:`%5D`,[X.AtSign]:`%40`,[X.ExclamationMark]:`%21`,[X.DollarSign]:`%24`,[X.Ampersand]:`%26`,[X.SingleQuote]:`%27`,[X.OpenParen]:`%28`,[X.CloseParen]:`%29`,[X.Asterisk]:`%2A`,[X.Plus]:`%2B`,[X.Comma]:`%2C`,[X.Semicolon]:`%3B`,[X.Equals]:`%3D`,[X.Space]:`%20`};function VO(e,t,n){let r,i=-1;for(let a=0;a<e.length;a++){let o=e.charCodeAt(a);if(o>=X.a&&o<=X.z||o>=X.A&&o<=X.Z||o>=X.Digit0&&o<=X.Digit9||o===X.Dash||o===X.Period||o===X.Underline||o===X.Tilde||t&&o===X.Slash||n&&o===X.OpenSquareBracket||n&&o===X.CloseSquareBracket||n&&o===X.Colon)i!==-1&&(r+=encodeURIComponent(e.substring(i,a)),i=-1),r!==void 0&&(r+=e.charAt(a));else{r===void 0&&(r=e.substr(0,a));let t=BO[o];t===void 0?i===-1&&(i=a):(i!==-1&&(r+=encodeURIComponent(e.substring(i,a)),i=-1),r+=t)}}return i!==-1&&(r+=encodeURIComponent(e.substring(i))),r===void 0?e:r}function HO(e){let t;for(let n=0;n<e.length;n++){let r=e.charCodeAt(n);r===X.Hash||r===X.QuestionMark?(t===void 0&&(t=e.substr(0,n)),t+=BO[r]):t!==void 0&&(t+=e[n])}return t===void 0?e:t}function UO(e,t){let n;return n=e.authority&&e.path.length>1&&e.scheme===`file`?`//${e.authority}${e.path}`:e.path.charCodeAt(0)===X.Slash&&(e.path.charCodeAt(1)>=X.A&&e.path.charCodeAt(1)<=X.Z||e.path.charCodeAt(1)>=X.a&&e.path.charCodeAt(1)<=X.z)&&e.path.charCodeAt(2)===X.Colon?t?e.path.substr(1):e.path[1].toLowerCase()+e.path.substr(2):e.path,wD&&(n=n.replace(/\//g,`\\`)),n}function WO(e,t){let n=t?HO:VO,r=``,{scheme:i,authority:a,path:o,query:s,fragment:c}=e;if(i&&(r+=i,r+=`:`),(a||i===`file`)&&(r+=`/`,r+=`/`),a){let e=a.indexOf(`@`);if(e!==-1){let t=a.substr(0,e);a=a.substr(e+1),e=t.lastIndexOf(`:`),e===-1?r+=n(t,!1,!1):(r+=n(t.substr(0,e),!1,!1),r+=`:`,r+=n(t.substr(e+1),!1,!0)),r+=`@`}a=a.toLowerCase(),e=a.lastIndexOf(`:`),e===-1?r+=n(a,!1,!0):(r+=n(a.substr(0,e),!1,!0),r+=a.substr(e))}if(o){if(o.length>=3&&o.charCodeAt(0)===X.Slash&&o.charCodeAt(2)===X.Colon){let e=o.charCodeAt(1);e>=X.A&&e<=X.Z&&(o=`/${String.fromCharCode(e+32)}:${o.substr(3)}`)}else if(o.length>=2&&o.charCodeAt(1)===X.Colon){let e=o.charCodeAt(0);e>=X.A&&e<=X.Z&&(o=`${String.fromCharCode(e+32)}:${o.substr(2)}`)}r+=n(o,!0,!1)}return s&&(r+=`?`,r+=n(s,!1,!1)),c&&(r+=`#`,r+=t?c:VO(c,!1,!1)),r}function GO(e){try{return decodeURIComponent(e)}catch{return e.length>3?e.substr(0,3)+GO(e.substr(3)):e}}const KO=/(%[0-9A-Za-z][0-9A-Za-z])+/g;function qO(e){return e.match(KO)?e.replace(KO,e=>GO(e)):e}var JO;(function(e){e.inMemory=`inmemory`,e.vscode=`vscode`,e.internal=`private`,e.walkThrough=`walkThrough`,e.walkThroughSnippet=`walkThroughSnippet`,e.http=`http`,e.https=`https`,e.file=`file`,e.mailto=`mailto`,e.untitled=`untitled`,e.data=`data`,e.command=`command`,e.vscodeRemote=`vscode-remote`,e.vscodeRemoteResource=`vscode-remote-resource`,e.vscodeManagedRemoteResource=`vscode-managed-remote-resource`,e.vscodeUserData=`vscode-userdata`,e.vscodeCustomEditor=`vscode-custom-editor`,e.vscodeNotebookCell=`vscode-notebook-cell`,e.vscodeNotebookCellMetadata=`vscode-notebook-cell-metadata`,e.vscodeNotebookCellMetadataDiff=`vscode-notebook-cell-metadata-diff`,e.vscodeNotebookCellOutput=`vscode-notebook-cell-output`,e.vscodeNotebookCellOutputDiff=`vscode-notebook-cell-output-diff`,e.vscodeNotebookMetadata=`vscode-notebook-metadata`,e.vscodeInteractiveInput=`vscode-interactive-input`,e.vscodeSettings=`vscode-settings`,e.vscodeWorkspaceTrust=`vscode-workspace-trust`,e.vscodeTerminal=`vscode-terminal`,e.vscodeChatCodeBlock=`vscode-chat-code-block`,e.vscodeChatCodeCompareBlock=`vscode-chat-code-compare-block`,e.vscodeChatEditor=`vscode-chat-editor`,e.vscodeChatInput=`chatSessionInput`,e.vscodeLocalChatSession=`vscode-chat-session`,e.webviewPanel=`webview-panel`,e.vscodeWebview=`vscode-webview`,e.vscodeBrowser=`vscode-browser`,e.extension=`extension`,e.vscodeFileResource=`vscode-file`,e.tmp=`tmp`,e.vsls=`vsls`,e.vscodeSourceControl=`vscode-scm`,e.commentsInput=`comment`,e.codeSetting=`code-setting`,e.outputChannel=`output`,e.accessibleView=`accessible-view`,e.chatEditingSnapshotScheme=`chat-editing-snapshot-text-model`,e.chatEditingModel=`chat-editing-text-model`,e.copilotPr=`copilot-pr`})(JO||={});const YO=new class{constructor(){this._hosts=Object.create(null),this._ports=Object.create(null),this._connectionTokens=Object.create(null),this._preferredWebSchema=`http`,this._delegate=null,this._serverRootPath=`/`}setPreferredWebSchema(e){this._preferredWebSchema=e}setDelegate(e){this._delegate=e}setServerRootPath(e,t){this._serverRootPath=Q.join(t??`/`,XO(e))}getServerRootPath(){return this._serverRootPath}get _remoteResourcesPath(){return Q.join(this._serverRootPath,JO.vscodeRemoteResource)}set(e,t,n){this._hosts[e]=t,this._ports[e]=n}setConnectionToken(e,t){this._connectionTokens[e]=t}getPreferredWebSchema(){return this._preferredWebSchema}rewrite(e){if(this._delegate)try{return this._delegate(e)}catch(t){return bE(t),e}let t=e.authority,n=this._hosts[t];n&&n.indexOf(`:`)!==-1&&n.indexOf(`[`)===-1&&(n=`[${n}]`);let r=this._ports[t],i=this._connectionTokens[t],a=`path=${encodeURIComponent(e.path)}`;return typeof i==`string`&&(a+=`&tkn=${encodeURIComponent(i)}`),LO.from({scheme:OD?this._preferredWebSchema:JO.vscodeRemoteResource,authority:`${n}:${r}`,path:this._remoteResourcesPath,query:a})}};function XO(e){return`${e.quality??`oss`}-${e.commit??`dev`}`}new class e{constructor(){this.staticBrowserUris=new PE,this.appResourcePathUrls=new Map,this.appResourceUrlMapper=[]}static{this.FALLBACK_AUTHORITY=`vscode-app`}registerAppResourcePathUrl(e,t){this.appResourcePathUrls.set(e,t)}registerAppResourceLoader(e){this.appResourceUrlMapper.push(e)}toUrl(e){let t=this.appResourcePathUrls.get(e);typeof t==`function`&&(t=t());for(let t of this.appResourceUrlMapper){let n=t(e);if(n)return n}return new URL(t??e,globalThis.location?.href??import.meta.url).toString()}asBrowserUri(e){let t=this.toUri(e);return this.uriToBrowserUri(t)}uriToBrowserUri(t){return t.scheme===JO.vscodeRemote?YO.rewrite(t):t.scheme===JO.file&&(DD||kD===`${JO.vscodeFileResource}://${e.FALLBACK_AUTHORITY}`)?t.with({scheme:JO.vscodeFileResource,authority:t.authority||e.FALLBACK_AUTHORITY,query:null,fragment:null}):this.staticBrowserUris.get(t)??t}asFileUri(e){let t=this.toUri(e);return this.uriToFileUri(t)}uriToFileUri(t){return t.scheme===JO.vscodeFileResource?t.with({scheme:JO.file,authority:t.authority===e.FALLBACK_AUTHORITY?null:t.authority,query:null,fragment:null}):t}toUri(e){if(LO.isUri(e))return e;if(globalThis._VSCODE_FILE_ROOT){let t=globalThis._VSCODE_FILE_ROOT;if(/^\w[\w\d+.-]*:\/\//.test(t))return LO.joinPath(LO.parse(t,!0),e);let n=$D(t,e);return LO.file(n)}return LO.parse(this.toUrl(e))}registerStaticBrowserUri(e,t){return this.staticBrowserUris.set(e,t),GE(()=>{this.staticBrowserUris.get(e)===t&&this.staticBrowserUris.delete(e)})}getRegisteredBrowserUris(){return this.staticBrowserUris.keys()}};var ZO;(function(e){let t=new Map([[`1`,{"Cross-Origin-Opener-Policy":`same-origin`}],[`2`,{"Cross-Origin-Embedder-Policy":`require-corp`}],[`3`,{"Cross-Origin-Opener-Policy":`same-origin`,"Cross-Origin-Embedder-Policy":`require-corp`}]]);e.CoopAndCoep=Object.freeze(t.get(`3`));let n=`vscode-coi`;function r(e){let r;typeof e==`string`?r=new URL(e).searchParams:e instanceof URL?r=e.searchParams:LO.isUri(e)&&(r=new URL(e.toString(!0)).searchParams);let i=r?.get(n);if(i)return t.get(i)}e.getHeadersFromQuery=r;function i(e,t,r){if(!globalThis.crossOriginIsolated)return;let i=t&&r?`3`:r?`2`:`1`;e instanceof URLSearchParams?e.set(n,i):e[n]=i}e.addSearchParam=i})(ZO||={});function QO(e){return UO(e,!0)}var $O=class{constructor(e){this._ignorePathCasing=e}compare(e,t,n=!1){return e===t?0:dO(this.getComparisonKey(e,n),this.getComparisonKey(t,n))}isEqual(e,t,n=!1){return e===t?!0:!e||!t?!1:this.getComparisonKey(e,n)===this.getComparisonKey(t,n)}getComparisonKey(e,t=!1){return e.with({path:this._ignorePathCasing(e)?e.path.toLowerCase():void 0,fragment:t?null:void 0}).toString()}ignorePathCasing(e){return this._ignorePathCasing(e)}isEqualOrParent(e,t,n=!1){if(e.scheme===t.scheme){if(e.scheme===JO.file)return EO(QO(e),QO(t),this._ignorePathCasing(e))&&e.query===t.query&&(n||e.fragment===t.fragment);if(tk(e.authority,t.authority))return EO(e.path,t.path,this._ignorePathCasing(e),`/`)&&e.query===t.query&&(n||e.fragment===t.fragment)}return!1}joinPath(e,...t){return LO.joinPath(e,...t)}basenameOrAuthority(e){return ek(e)||e.authority}basename(e){return Q.basename(e.path)}extname(e){return Q.extname(e.path)}dirname(e){if(e.path.length===0)return e;let t;return e.scheme===JO.file?t=LO.file(nO(QO(e))).path:(t=Q.dirname(e.path),e.authority&&t.length&&t.charCodeAt(0)!==X.Slash&&(console.error(`dirname("${e.toString})) resulted in a relative path`),t=`/`)),e.with({path:t})}normalizePath(e){if(!e.path.length)return e;let t;return t=e.scheme===JO.file?LO.file(QD(QO(e))).path:Q.normalize(e.path),e.with({path:t})}relativePath(e,t){if(e.scheme!==t.scheme||!tk(e.authority,t.authority))return;if(e.scheme===JO.file){let n=tO(QO(e),QO(t));return wD?CO(n):n}let n=e.path||`/`,r=t.path||`/`;if(this._ignorePathCasing(e)){let e=0;for(let t=Math.min(n.length,r.length);e<t&&!(n.charCodeAt(e)!==r.charCodeAt(e)&&n.charAt(e).toLowerCase()!==r.charAt(e).toLowerCase());e++);n=r.substr(0,e)+n.substr(e)}return Q.relative(n,r)}resolvePath(e,t){if(e.scheme===JO.file){let n=LO.file(eO(QO(e),t));return e.with({authority:n.authority,path:n.path})}return t=wO(t),e.with({path:Q.resolve(e.path,t)})}isAbsolutePath(e){return!!e.path&&e.path[0]===`/`}isEqualAuthority(e,t){return e===t||e!==void 0&&t!==void 0&&gO(e,t)}hasTrailingPathSeparator(e,t=rO){if(e.scheme===JO.file){let n=QO(e);return n.length>TO(n).length&&n[n.length-1]===t}else{let t=e.path;return t.length>1&&t.charCodeAt(t.length-1)===X.Slash&&!/^[a-zA-Z]:(\/$|\\$)/.test(e.fsPath)}}removeTrailingPathSeparator(e,t=rO){return nk(e,t)?e.with({path:e.path.substr(0,e.path.length-1)}):e}addTrailingPathSeparator(e,t=rO){let n=!1;if(e.scheme===JO.file){let r=QO(e);n=r!==void 0&&r.length===TO(r).length&&r[r.length-1]===t}else{t=`/`;let r=e.path;n=r.length===1&&r.charCodeAt(r.length-1)===X.Slash}return!n&&!nk(e,t)?e.with({path:e.path+`/`}):e}};const $=new $O(()=>!1);new $O(e=>e.scheme===JO.file?!ED:!0),new $O(e=>!0),$.isEqual.bind($),$.isEqualOrParent.bind($),$.getComparisonKey.bind($),$.basenameOrAuthority.bind($);const ek=$.basename.bind($);$.extname.bind($),$.dirname.bind($),$.joinPath.bind($),$.normalizePath.bind($),$.relativePath.bind($),$.resolvePath.bind($),$.isAbsolutePath.bind($);const tk=$.isEqualAuthority.bind($),nk=$.hasTrailingPathSeparator.bind($);$.removeTrailingPathSeparator.bind($),$.addTrailingPathSeparator.bind($);var rk;(function(e){e.META_DATA_LABEL=`label`,e.META_DATA_DESCRIPTION=`description`,e.META_DATA_SIZE=`size`,e.META_DATA_MIME=`mime`;function t(t){let n=new Map;t.path.substring(t.path.indexOf(`;`)+1,t.path.lastIndexOf(`;`)).split(`;`).forEach(e=>{let[t,r]=e.split(`:`);t&&r&&n.set(t,r)});let r=t.path.substring(0,t.path.indexOf(`;`));return r&&n.set(e.META_DATA_MIME,r),n}e.parseMetaData=t})(rk||={}),(function(){let e=globalThis;typeof e.requestIdleCallback!=`function`||e.cancelIdleCallback})();var ik;(function(e){e[e.Resolved=0]=`Resolved`,e[e.Rejected=1]=`Rejected`})(ik||={});var ak=class e{static fromPromise(t){let n=new e;return n.settleWith(t),n}get isRejected(){return this.outcome?.outcome===ik.Rejected}get isResolved(){return this.outcome?.outcome===ik.Resolved}get isSettled(){return!!this.outcome}get value(){return this.outcome?.outcome===ik.Resolved?this.outcome?.value:void 0}constructor(){this.p=new Promise((e,t)=>{this.completeCallback=e,this.errorCallback=t})}complete(e){return this.isSettled?Promise.resolve():new Promise(t=>{this.completeCallback(e),this.outcome={outcome:ik.Resolved,value:e},t()})}error(e){return this.isSettled?Promise.resolve():new Promise(t=>{this.errorCallback(e),this.outcome={outcome:ik.Rejected,value:e},t()})}settleWith(e){return e.then(e=>this.complete(e),e=>this.error(e))}cancel(){return this.error(new wE)}},ok;(function(e){async function t(e){let t,n=await Promise.all(e.map(e=>e.then(e=>e,e=>{t||=e})));if(t!==void 0)throw t;return n}e.settled=t;function n(e){return new Promise(async(t,n)=>{try{await e(t,n)}catch(e){n(e)}})}e.withAsyncBody=n})(ok||={});var sk;(function(e){e[e.Initial=0]=`Initial`,e[e.DoneOK=1]=`DoneOK`,e[e.DoneError=2]=`DoneError`})(sk||={}),class e{static fromArray(t){return new e(e=>{e.emitMany(t)})}static fromPromise(t){return new e(async e=>{e.emitMany(await t)})}static fromPromisesResolveOrder(t){return new e(async e=>{await Promise.all(t.map(async t=>e.emitOne(await t)))})}static merge(t){return new e(async e=>{await Promise.all(t.map(async t=>{for await(let n of t)e.emitOne(n)}))})}static{this.EMPTY=e.fromArray([])}constructor(e,t){this._state=sk.Initial,this._results=[],this._error=null,this._onReturn=t,this._onStateChanged=new iD,queueMicrotask(async()=>{let t={emitOne:e=>this.emitOne(e),emitMany:e=>this.emitMany(e),reject:e=>this.reject(e)};try{await Promise.resolve(e(t)),this.resolve()}catch(e){this.reject(e)}finally{t.emitOne=void 0,t.emitMany=void 0,t.reject=void 0}})}[Symbol.asyncIterator](){let e=0;return{next:async()=>{do{if(this._state===sk.DoneError)throw this._error;if(e<this._results.length)return{done:!1,value:this._results[e++]};if(this._state===sk.DoneOK)return{done:!0,value:void 0};await XE.toPromise(this._onStateChanged.event)}while(!0)},return:async()=>(this._onReturn?.(),{done:!0,value:void 0})}}static map(t,n){return new e(async e=>{for await(let r of t)e.emitOne(n(r))})}map(t){return e.map(this,t)}static filter(t,n){return new e(async e=>{for await(let r of t)n(r)&&e.emitOne(r)})}filter(t){return e.filter(this,t)}static coalesce(t){return e.filter(t,e=>!!e)}coalesce(){return e.coalesce(this)}static async toPromise(e){let t=[];for await(let n of e)t.push(n);return t}toPromise(){return e.toPromise(this)}emitOne(e){this._state===sk.Initial&&(this._results.push(e),this._onStateChanged.fire())}emitMany(e){this._state===sk.Initial&&(this._results=this._results.concat(e),this._onStateChanged.fire())}resolve(){this._state===sk.Initial&&(this._state=sk.DoneOK,this._onStateChanged.fire())}reject(e){this._state===sk.Initial&&(this._state=sk.DoneError,this._error=e,this._onStateChanged.fire())}};var ck=class{constructor(){this._unsatisfiedConsumers=[],this._unconsumedValues=[]}get hasFinalValue(){return!!this._finalValue}produce(e){if(this._ensureNoFinalValue(),this._unsatisfiedConsumers.length>0){let t=this._unsatisfiedConsumers.shift();this._resolveOrRejectDeferred(t,e)}else this._unconsumedValues.push(e)}produceFinal(e){this._ensureNoFinalValue(),this._finalValue=e;for(let t of this._unsatisfiedConsumers)this._resolveOrRejectDeferred(t,e);this._unsatisfiedConsumers.length=0}_ensureNoFinalValue(){if(this._finalValue)throw new EE(`ProducerConsumer: cannot produce after final value has been set`)}_resolveOrRejectDeferred(e,t){t.ok?e.complete(t.value):e.error(t.error)}consume(){if(this._unconsumedValues.length>0||this._finalValue){let e=this._unconsumedValues.length>0?this._unconsumedValues.shift():this._finalValue;return e.ok?Promise.resolve(e.value):Promise.reject(e.error)}else{let e=new ak;return this._unsatisfiedConsumers.push(e),e.p}}};(class e{constructor(e,t){this._onReturn=t,this._producerConsumer=new ck,this._iterator={next:()=>this._producerConsumer.consume(),return:()=>(this._onReturn?.(),Promise.resolve({done:!0,value:void 0})),throw:async e=>(this._finishError(e),{done:!0,value:void 0})},queueMicrotask(async()=>{let t=e({emitOne:e=>this._producerConsumer.produce({ok:!0,value:{done:!1,value:e}}),emitMany:e=>{for(let t of e)this._producerConsumer.produce({ok:!0,value:{done:!1,value:t}})},reject:e=>this._finishError(e)});if(!this._producerConsumer.hasFinalValue)try{await t,this._finishOk()}catch(e){this._finishError(e)}})}static fromArray(t){return new e(e=>{e.emitMany(t)})}static fromPromise(t){return new e(async e=>{e.emitMany(await t)})}static fromPromisesResolveOrder(t){return new e(async e=>{await Promise.all(t.map(async t=>e.emitOne(await t)))})}static merge(t){return new e(async e=>{await Promise.all(t.map(async t=>{for await(let n of t)e.emitOne(n)}))})}static{this.EMPTY=e.fromArray([])}static map(t,n){return new e(async e=>{for await(let r of t)e.emitOne(n(r))})}static tee(t){let n,r,i=new ak,a=async()=>{if(!(!n||!r))try{for await(let e of t)n.emitOne(e),r.emitOne(e)}catch(e){n.reject(e),r.reject(e)}finally{i.complete()}};return[new e(async e=>(n=e,a(),i.p)),new e(async e=>(r=e,a(),i.p))]}map(t){return e.map(this,t)}static coalesce(t){return e.filter(t,e=>!!e)}coalesce(){return e.coalesce(this)}static filter(t,n){return new e(async e=>{for await(let r of t)n(r)&&e.emitOne(r)})}filter(t){return e.filter(this,t)}_finishOk(){this._producerConsumer.hasFinalValue||this._producerConsumer.produceFinal({ok:!0,value:{done:!0,value:void 0}})}_finishError(e){this._producerConsumer.hasFinalValue||this._producerConsumer.produceFinal({ok:!1,error:e})}[Symbol.asyncIterator](){return this._iterator}});var lk=class e{constructor(e,t){this.lineNumber=e,this.column=t}with(t=this.lineNumber,n=this.column){return t===this.lineNumber&&n===this.column?this:new e(t,n)}delta(e=0,t=0){return this.with(Math.max(1,this.lineNumber+e),Math.max(1,this.column+t))}equals(t){return e.equals(this,t)}static equals(e,t){return!e&&!t?!0:!!e&&!!t&&e.lineNumber===t.lineNumber&&e.column===t.column}isBefore(t){return e.isBefore(this,t)}static isBefore(e,t){return e.lineNumber<t.lineNumber?!0:t.lineNumber<e.lineNumber?!1:e.column<t.column}isBeforeOrEqual(t){return e.isBeforeOrEqual(this,t)}static isBeforeOrEqual(e,t){return e.lineNumber<t.lineNumber?!0:t.lineNumber<e.lineNumber?!1:e.column<=t.column}static compare(e,t){let n=e.lineNumber|0,r=t.lineNumber|0;return n===r?(e.column|0)-(t.column|0):n-r}clone(){return new e(this.lineNumber,this.column)}toString(){return`(`+this.lineNumber+`,`+this.column+`)`}static lift(t){return new e(t.lineNumber,t.column)}static isIPosition(e){return!!e&&typeof e.lineNumber==`number`&&typeof e.column==`number`}toJSON(){return{lineNumber:this.lineNumber,column:this.column}}},uk=class e{constructor(e,t,n,r){e>n||e===n&&t>r?(this.startLineNumber=n,this.startColumn=r,this.endLineNumber=e,this.endColumn=t):(this.startLineNumber=e,this.startColumn=t,this.endLineNumber=n,this.endColumn=r)}isEmpty(){return e.isEmpty(this)}static isEmpty(e){return e.startLineNumber===e.endLineNumber&&e.startColumn===e.endColumn}containsPosition(t){return e.containsPosition(this,t)}static containsPosition(e,t){return!(t.lineNumber<e.startLineNumber||t.lineNumber>e.endLineNumber||t.lineNumber===e.startLineNumber&&t.column<e.startColumn||t.lineNumber===e.endLineNumber&&t.column>e.endColumn)}static strictContainsPosition(e,t){return!(t.lineNumber<e.startLineNumber||t.lineNumber>e.endLineNumber||t.lineNumber===e.startLineNumber&&t.column<=e.startColumn||t.lineNumber===e.endLineNumber&&t.column>=e.endColumn)}containsRange(t){return e.containsRange(this,t)}static containsRange(e,t){return!(t.startLineNumber<e.startLineNumber||t.endLineNumber<e.startLineNumber||t.startLineNumber>e.endLineNumber||t.endLineNumber>e.endLineNumber||t.startLineNumber===e.startLineNumber&&t.startColumn<e.startColumn||t.endLineNumber===e.endLineNumber&&t.endColumn>e.endColumn)}strictContainsRange(t){return e.strictContainsRange(this,t)}static strictContainsRange(e,t){return!(t.startLineNumber<e.startLineNumber||t.endLineNumber<e.startLineNumber||t.startLineNumber>e.endLineNumber||t.endLineNumber>e.endLineNumber||t.startLineNumber===e.startLineNumber&&t.startColumn<=e.startColumn||t.endLineNumber===e.endLineNumber&&t.endColumn>=e.endColumn)}plusRange(t){return e.plusRange(this,t)}static plusRange(t,n){let r,i,a,o;return n.startLineNumber<t.startLineNumber?(r=n.startLineNumber,i=n.startColumn):n.startLineNumber===t.startLineNumber?(r=n.startLineNumber,i=Math.min(n.startColumn,t.startColumn)):(r=t.startLineNumber,i=t.startColumn),n.endLineNumber>t.endLineNumber?(a=n.endLineNumber,o=n.endColumn):n.endLineNumber===t.endLineNumber?(a=n.endLineNumber,o=Math.max(n.endColumn,t.endColumn)):(a=t.endLineNumber,o=t.endColumn),new e(r,i,a,o)}intersectRanges(t){return e.intersectRanges(this,t)}static intersectRanges(t,n){let r=t.startLineNumber,i=t.startColumn,a=t.endLineNumber,o=t.endColumn,s=n.startLineNumber,c=n.startColumn,l=n.endLineNumber,u=n.endColumn;return r<s?(r=s,i=c):r===s&&(i=Math.max(i,c)),a>l?(a=l,o=u):a===l&&(o=Math.min(o,u)),r>a||r===a&&i>o?null:new e(r,i,a,o)}equalsRange(t){return e.equalsRange(this,t)}static equalsRange(e,t){return!e&&!t?!0:!!e&&!!t&&e.startLineNumber===t.startLineNumber&&e.startColumn===t.startColumn&&e.endLineNumber===t.endLineNumber&&e.endColumn===t.endColumn}getEndPosition(){return e.getEndPosition(this)}static getEndPosition(e){return new lk(e.endLineNumber,e.endColumn)}getStartPosition(){return e.getStartPosition(this)}static getStartPosition(e){return new lk(e.startLineNumber,e.startColumn)}toString(){return`[`+this.startLineNumber+`,`+this.startColumn+` -> `+this.endLineNumber+`,`+this.endColumn+`]`}setEndPosition(t,n){return new e(this.startLineNumber,this.startColumn,t,n)}setStartPosition(t,n){return new e(t,n,this.endLineNumber,this.endColumn)}collapseToStart(){return e.collapseToStart(this)}static collapseToStart(t){return new e(t.startLineNumber,t.startColumn,t.startLineNumber,t.startColumn)}collapseToEnd(){return e.collapseToEnd(this)}static collapseToEnd(t){return new e(t.endLineNumber,t.endColumn,t.endLineNumber,t.endColumn)}delta(t){return new e(this.startLineNumber+t,this.startColumn,this.endLineNumber+t,this.endColumn)}isSingleLine(){return this.startLineNumber===this.endLineNumber}static fromPositions(t,n=t){return new e(t.lineNumber,t.column,n.lineNumber,n.column)}static lift(t){return t?new e(t.startLineNumber,t.startColumn,t.endLineNumber,t.endColumn):null}static isIRange(e){return!!e&&typeof e.startLineNumber==`number`&&typeof e.startColumn==`number`&&typeof e.endLineNumber==`number`&&typeof e.endColumn==`number`}static areIntersectingOrTouching(e,t){return!(e.endLineNumber<t.startLineNumber||e.endLineNumber===t.startLineNumber&&e.endColumn<t.startColumn||t.endLineNumber<e.startLineNumber||t.endLineNumber===e.startLineNumber&&t.endColumn<e.startColumn)}static areIntersecting(e,t){return!(e.endLineNumber<t.startLineNumber||e.endLineNumber===t.startLineNumber&&e.endColumn<=t.startColumn||t.endLineNumber<e.startLineNumber||t.endLineNumber===e.startLineNumber&&t.endColumn<=e.startColumn)}static areOnlyIntersecting(e,t){return!(e.endLineNumber<t.startLineNumber-1||e.endLineNumber===t.startLineNumber&&e.endColumn<t.startColumn-1||t.endLineNumber<e.startLineNumber-1||t.endLineNumber===e.startLineNumber&&t.endColumn<e.startColumn-1)}static compareRangesUsingStarts(e,t){if(e&&t){let n=e.startLineNumber|0,r=t.startLineNumber|0;if(n===r){let n=e.startColumn|0,r=t.startColumn|0;if(n===r){let n=e.endLineNumber|0,r=t.endLineNumber|0;return n===r?(e.endColumn|0)-(t.endColumn|0):n-r}return n-r}return n-r}return(e?1:0)-(t?1:0)}static compareRangesUsingEnds(e,t){return e.endLineNumber===t.endLineNumber?e.endColumn===t.endColumn?e.startLineNumber===t.startLineNumber?e.startColumn-t.startColumn:e.startLineNumber-t.startLineNumber:e.endColumn-t.endColumn:e.endLineNumber-t.endLineNumber}static spansMultipleLines(e){return e.endLineNumber>e.startLineNumber}toJSON(){return this}};function dk(e=``){let t=`(-?\\d*\\.\\d\\w*)|([^`;for(let n of`\`~!@#$%^&*()-=+[{]}\\|;:'",.<>/?`)e.indexOf(n)>=0||(t+=`\\`+n);return t+=`\\s]+)`,new RegExp(t,`g`)}const fk=dk();function pk(e){let t=fk;if(e&&e instanceof RegExp)if(e.global)t=e;else{let n=`g`;e.ignoreCase&&(n+=`i`),e.multiline&&(n+=`m`),e.unicode&&(n+=`u`),t=new RegExp(e.source,n)}return t.lastIndex=0,t}const mk=new YE;mk.unshift({maxLen:1e3,windowSize:15,timeBudget:150});function hk(e,t,n,r,i){if(t=pk(t),i||=RE.first(mk),n.length>i.maxLen){let a=e-i.maxLen/2;return a<0?a=0:r+=a,n=n.substring(a,e+i.maxLen/2),hk(e,t,n,r,i)}let a=Date.now(),o=e-1-r,s=-1,c=null;for(let e=1;!(Date.now()-a>=i.timeBudget);e++){let r=o-i.windowSize*e;t.lastIndex=Math.max(0,r);let a=gk(t,n,o,s);if(!a&&c||(c=a,r<=0))break;s=r}if(c){let e={word:c[0],startColumn:r+1+c.index,endColumn:r+1+c.index+c[0].length};return t.lastIndex=0,e}return null}function gk(e,t,n,r){let i;for(;i=e.exec(t);){let t=i.index||0;if(t<=n&&e.lastIndex>=n)return i;if(r>0&&t>r)return null}return null}var _k=class{constructor(e){this.values=e,this.prefixSum=new Uint32Array(e.length),this.prefixSumValidIndex=new Int32Array(1),this.prefixSumValidIndex[0]=-1}getCount(){return this.values.length}insertValues(e,t){e=lO(e);let n=this.values,r=this.prefixSum,i=t.length;return i===0?!1:(this.values=new Uint32Array(n.length+i),this.values.set(n.subarray(0,e),0),this.values.set(n.subarray(e),e+i),this.values.set(t,e),e-1<this.prefixSumValidIndex[0]&&(this.prefixSumValidIndex[0]=e-1),this.prefixSum=new Uint32Array(this.values.length),this.prefixSumValidIndex[0]>=0&&this.prefixSum.set(r.subarray(0,this.prefixSumValidIndex[0]+1)),!0)}setValue(e,t){return e=lO(e),t=lO(t),this.values[e]===t?!1:(this.values[e]=t,e-1<this.prefixSumValidIndex[0]&&(this.prefixSumValidIndex[0]=e-1),!0)}removeValues(e,t){e=lO(e),t=lO(t);let n=this.values,r=this.prefixSum;if(e>=n.length)return!1;let i=n.length-e;return t>=i&&(t=i),t===0?!1:(this.values=new Uint32Array(n.length-t),this.values.set(n.subarray(0,e),0),this.values.set(n.subarray(e+t),e),this.prefixSum=new Uint32Array(this.values.length),e-1<this.prefixSumValidIndex[0]&&(this.prefixSumValidIndex[0]=e-1),this.prefixSumValidIndex[0]>=0&&this.prefixSum.set(r.subarray(0,this.prefixSumValidIndex[0]+1)),!0)}getTotalSum(){return this.values.length===0?0:this._getPrefixSum(this.values.length-1)}getPrefixSum(e){return e<0?0:(e=lO(e),this._getPrefixSum(e))}_getPrefixSum(e){if(e<=this.prefixSumValidIndex[0])return this.prefixSum[e];let t=this.prefixSumValidIndex[0]+1;t===0&&(this.prefixSum[0]=this.values[0],t++),e>=this.values.length&&(e=this.values.length-1);for(let n=t;n<=e;n++)this.prefixSum[n]=this.prefixSum[n-1]+this.values[n];return this.prefixSumValidIndex[0]=Math.max(this.prefixSumValidIndex[0],e),this.prefixSum[e]}getIndexOf(e){e=Math.floor(e),this.getTotalSum();let t=0,n=this.values.length-1,r=0,i=0,a=0;for(;t<=n;)if(r=t+(n-t)/2|0,i=this.prefixSum[r],a=i-this.values[r],e<a)n=r-1;else if(e>=i)t=r+1;else break;return new vk(r,e-a)}},vk=class{constructor(e,t){this.index=e,this.remainder=t,this._prefixSumIndexOfResultBrand=void 0,this.index=e,this.remainder=t}},yk=class{constructor(e,t,n,r){this._uri=e,this._lines=t,this._eol=n,this._versionId=r,this._lineStarts=null,this._cachedTextValue=null}dispose(){this._lines.length=0}get version(){return this._versionId}getText(){return this._cachedTextValue===null&&(this._cachedTextValue=this._lines.join(this._eol)),this._cachedTextValue}onEvents(e){e.eol&&e.eol!==this._eol&&(this._eol=e.eol,this._lineStarts=null);let t=e.changes;for(let e of t)this._acceptDeleteRange(e.range),this._acceptInsertText(new lk(e.range.startLineNumber,e.range.startColumn),e.text);this._versionId=e.versionId,this._cachedTextValue=null}_ensureLineStarts(){if(!this._lineStarts){let e=this._eol.length,t=this._lines.length,n=new Uint32Array(t);for(let r=0;r<t;r++)n[r]=this._lines[r].length+e;this._lineStarts=new _k(n)}}_setLineText(e,t){this._lines[e]=t,this._lineStarts&&this._lineStarts.setValue(e,this._lines[e].length+this._eol.length)}_acceptDeleteRange(e){if(e.startLineNumber===e.endLineNumber){if(e.startColumn===e.endColumn)return;this._setLineText(e.startLineNumber-1,this._lines[e.startLineNumber-1].substring(0,e.startColumn-1)+this._lines[e.startLineNumber-1].substring(e.endColumn-1));return}this._setLineText(e.startLineNumber-1,this._lines[e.startLineNumber-1].substring(0,e.startColumn-1)+this._lines[e.endLineNumber-1].substring(e.endColumn-1)),this._lines.splice(e.startLineNumber,e.endLineNumber-e.startLineNumber),this._lineStarts&&this._lineStarts.removeValues(e.startLineNumber,e.endLineNumber-e.startLineNumber)}_acceptInsertText(e,t){if(t.length===0)return;let n=uO(t);if(n.length===1){this._setLineText(e.lineNumber-1,this._lines[e.lineNumber-1].substring(0,e.column-1)+n[0]+this._lines[e.lineNumber-1].substring(e.column-1));return}n[n.length-1]+=this._lines[e.lineNumber-1].substring(e.column-1),this._setLineText(e.lineNumber-1,this._lines[e.lineNumber-1].substring(0,e.column-1)+n[0]);let r=new Uint32Array(n.length-1);for(let t=1;t<n.length;t++)this._lines.splice(e.lineNumber+t-1,0,n[t]),r[t-1]=n[t].length+this._eol.length;this._lineStarts&&this._lineStarts.insertValues(e.lineNumber,r)}},bk=class{constructor(){this._models=Object.create(null)}bindToServer(e){e.setChannel(`workerTextModelSync`,this)}getModel(e){return this._models[e]}getModels(){let e=[];return Object.keys(this._models).forEach(t=>e.push(this._models[t])),e}$acceptNewModel(e){this._models[e.url]=new xk(LO.parse(e.url),e.lines,e.EOL,e.versionId)}$acceptModelChanged(e,t){this._models[e]&&this._models[e].onEvents(t)}$acceptRemovedModel(e){this._models[e]&&delete this._models[e]}},xk=class extends yk{get uri(){return this._uri}get eol(){return this._eol}getValue(){return this.getText()}findMatches(e){let t=[];for(let n=0;n<this._lines.length;n++){let r=this._lines[n],i=this.offsetAt(new lk(n+1,1)),a=r.matchAll(e);for(let e of a)(e.index||e.index===0)&&(e.index+=i),t.push(e)}return t}getLinesContent(){return this._lines.slice(0)}getLineCount(){return this._lines.length}getLineContent(e){return this._lines[e-1]}getWordAtPosition(e,t){let n=hk(e.column,pk(t),this._lines[e.lineNumber-1],0);return n?new uk(e.lineNumber,n.startColumn,e.lineNumber,n.endColumn):null}getWordUntilPosition(e,t){let n=this.getWordAtPosition(e,t);return n?{word:this._lines[e.lineNumber-1].substring(n.startColumn-1,e.column-1),startColumn:n.startColumn,endColumn:e.column}:{word:``,startColumn:e.column,endColumn:e.column}}words(e){let t=this._lines,n=this._wordenize.bind(this),r=0,i=``,a=0,o=[];return{*[Symbol.iterator](){for(;;)if(a<o.length){let e=i.substring(o[a].start,o[a].end);a+=1,yield e}else if(r<t.length)i=t[r],o=n(i,e),a=0,r+=1;else break}}}getLineWords(e,t){let n=this._lines[e-1],r=this._wordenize(n,t),i=[];for(let e of r)i.push({word:n.substring(e.start,e.end),startColumn:e.start+1,endColumn:e.end+1});return i}_wordenize(e,t){let n=[],r;for(t.lastIndex=0;(r=t.exec(e))&&r[0].length!==0;)n.push({start:r.index,end:r.index+r[0].length});return n}getValueInRange(e){if(e=this._validateRange(e),e.startLineNumber===e.endLineNumber)return this._lines[e.startLineNumber-1].substring(e.startColumn-1,e.endColumn-1);let t=this._eol,n=e.startLineNumber-1,r=e.endLineNumber-1,i=[];i.push(this._lines[n].substring(e.startColumn-1));for(let e=n+1;e<r;e++)i.push(this._lines[e]);return i.push(this._lines[r].substring(0,e.endColumn-1)),i.join(t)}offsetAt(e){return e=this._validatePosition(e),this._ensureLineStarts(),this._lineStarts.getPrefixSum(e.lineNumber-2)+(e.column-1)}positionAt(e){e=Math.floor(e),e=Math.max(0,e),this._ensureLineStarts();let t=this._lineStarts.getIndexOf(e),n=this._lines[t.index].length;return{lineNumber:1+t.index,column:1+Math.min(t.remainder,n)}}_validateRange(e){let t=this._validatePosition({lineNumber:e.startLineNumber,column:e.startColumn}),n=this._validatePosition({lineNumber:e.endLineNumber,column:e.endColumn});return t.lineNumber!==e.startLineNumber||t.column!==e.startColumn||n.lineNumber!==e.endLineNumber||n.column!==e.endColumn?{startLineNumber:t.lineNumber,startColumn:t.column,endLineNumber:n.lineNumber,endColumn:n.column}:e}_validatePosition(e){if(!lk.isIPosition(e))throw Error(`bad position`);let{lineNumber:t,column:n}=e,r=!1;if(t<1)t=1,n=1,r=!0;else if(t>this._lines.length)t=this._lines.length,n=this._lines[t-1].length+1,r=!0;else{let e=this._lines[t-1].length+1;n<1?(n=1,r=!0):n>e&&(n=e,r=!0)}return r?{lineNumber:t,column:n}:e}};function Sk(e){return new Ck(e)}var Ck=class e{static{this.expectedRelativeConfidence=.2}static{this.positiveConfidenceCorrectionBucket1=.05}static{this.positiveConfidenceCorrectionBucket2=.025}static{this.negativeConfidenceCorrection=.5}constructor(e){this._requestHandlerBrand=void 0,this._workerTextModelSyncServer=new bk,this._loadFailed=!1,this.modelIdToCoreId=new Map,this._host=gE.getChannel(e),this._workerTextModelSyncServer.bindToServer(e)}async $detectLanguage(e,t,n,r){let i=[],a=[],o=new hE,s=this.getTextForDetection(e);if(!s)return;let c=await(async()=>{for await(let e of this.detectLanguagesImpl(s)){this.modelIdToCoreId.has(e.languageId)||this.modelIdToCoreId.set(e.languageId,await this._host.$getLanguageId(e.languageId));let t=this.modelIdToCoreId.get(e.languageId);t&&(!r?.length||r.includes(t))&&(i.push(t),a.push(e.confidence))}if(o.stop(),i.length)return this._host.$sendTelemetryEvent(i,a,o.elapsed()),i[0]})();if(c)return c}getTextForDetection(e){let t=this._workerTextModelSyncServer.getModel(e);if(!t)return;let n=t.positionAt(1e4);return t.getValueInRange({startColumn:1,startLineNumber:1,endColumn:n.column,endLineNumber:n.lineNumber})}async getModelOperations(){return this._modelOperations||=new pE({modelJsonLoaderFunc:async()=>{let e=await fetch(await this._host.$getModelJsonUri());try{return await e.json()}catch{throw Error(`Failed to parse model JSON.`)}},weightsLoaderFunc:async()=>await(await fetch(await this._host.$getWeightsUri())).arrayBuffer()}),this._modelOperations}adjustLanguageConfidence(t){switch(t.languageId){case`js`:case`html`:case`json`:case`ts`:case`css`:case`py`:case`xml`:case`php`:t.confidence+=e.positiveConfidenceCorrectionBucket1;break;case`cpp`:case`sh`:case`java`:case`cs`:case`c`:t.confidence+=e.positiveConfidenceCorrectionBucket2;break;case`bat`:case`ini`:case`makefile`:case`sql`:case`csv`:case`toml`:t.confidence-=e.negativeConfidenceCorrection;break}return t}async*detectLanguagesImpl(t){if(this._loadFailed)return;let n;try{n=await this.getModelOperations()}catch(e){console.log(e),this._loadFailed=!0;return}let r;try{r=await n.runModel(t)}catch(e){console.warn(e)}if(!r||r.length===0||r[0].confidence<e.expectedRelativeConfidence)return;let i=this.adjustLanguageConfidence(r[0]);if(i.confidence<e.expectedRelativeConfidence)return;let a=[i];for(let t of r)if(t!==i)if(t=this.adjustLanguageConfidence(t),a[a.length-1].confidence-t.confidence>=e.expectedRelativeConfidence){for(;a.length;)yield a.shift();if(t.confidence>e.expectedRelativeConfidence){a.push(t);continue}return}else{if(t.confidence>e.expectedRelativeConfidence){a.push(t);continue}return}}};const wk=`default`;var Tk;(function(e){e[e.Request=0]=`Request`,e[e.Reply=1]=`Reply`,e[e.SubscribeEvent=2]=`SubscribeEvent`,e[e.Event=3]=`Event`,e[e.UnsubscribeEvent=4]=`UnsubscribeEvent`})(Tk||={});var Ek=class{constructor(e,t,n,r,i){this.vsWorker=e,this.req=t,this.channel=n,this.method=r,this.args=i,this.type=Tk.Request}},Dk=class{constructor(e,t,n,r){this.vsWorker=e,this.seq=t,this.res=n,this.err=r,this.type=Tk.Reply}},Ok=class{constructor(e,t,n,r,i){this.vsWorker=e,this.req=t,this.channel=n,this.eventName=r,this.arg=i,this.type=Tk.SubscribeEvent}},kk=class{constructor(e,t,n){this.vsWorker=e,this.req=t,this.event=n,this.type=Tk.Event}},Ak=class{constructor(e,t){this.vsWorker=e,this.req=t,this.type=Tk.UnsubscribeEvent}},jk=class{constructor(e){this._workerId=-1,this._handler=e,this._lastSentReq=0,this._pendingReplies=Object.create(null),this._pendingEmitters=new Map,this._pendingEvents=new Map}setWorkerId(e){this._workerId=e}async sendMessage(e,t,n){let r=String(++this._lastSentReq);return new Promise((i,a)=>{this._pendingReplies[r]={resolve:i,reject:a},this._send(new Ek(this._workerId,r,e,t,n))})}listen(e,t,n){let r=null,i=new iD({onWillAddFirstListener:()=>{r=String(++this._lastSentReq),this._pendingEmitters.set(r,i),this._send(new Ok(this._workerId,r,e,t,n))},onDidRemoveLastListener:()=>{this._pendingEmitters.delete(r),this._send(new Ak(this._workerId,r)),r=null}});return i.event}handleMessage(e){!e||!e.vsWorker||this._workerId!==-1&&e.vsWorker!==this._workerId||this._handleMessage(e)}createProxyToRemoteChannel(e,t){return new Proxy(Object.create(null),{get:(n,r)=>(typeof r==`string`&&!n[r]&&(Nk(r)?n[r]=t=>this.listen(e,r,t):Mk(r)?n[r]=this.listen(e,r,void 0):r.charCodeAt(0)===X.DollarSign&&(n[r]=async(...n)=>(await t?.(),this.sendMessage(e,r,n)))),n[r])})}_handleMessage(e){switch(e.type){case Tk.Reply:return this._handleReplyMessage(e);case Tk.Request:return this._handleRequestMessage(e);case Tk.SubscribeEvent:return this._handleSubscribeEventMessage(e);case Tk.Event:return this._handleEventMessage(e);case Tk.UnsubscribeEvent:return this._handleUnsubscribeEventMessage(e)}}_handleReplyMessage(e){if(!this._pendingReplies[e.seq]){console.warn(`Got reply to unknown seq`);return}let t=this._pendingReplies[e.seq];if(delete this._pendingReplies[e.seq],e.err){let n=e.err;if(e.err.$isError){let t=Error();t.name=e.err.name,t.message=e.err.message,t.stack=e.err.stack,n=t}t.reject(n);return}t.resolve(e.res)}_handleRequestMessage(e){let t=e.req;this._handler.handleMessage(e.channel,e.method,e.args).then(e=>{this._send(new Dk(this._workerId,t,e,void 0))},e=>{e.detail instanceof Error&&(e.detail=xE(e.detail)),this._send(new Dk(this._workerId,t,void 0,xE(e)))})}_handleSubscribeEventMessage(e){let t=e.req,n=this._handler.handleEvent(e.channel,e.eventName,e.arg)(e=>{this._send(new kk(this._workerId,t,e))});this._pendingEvents.set(t,n)}_handleEventMessage(e){let t=this._pendingEmitters.get(e.req);if(t===void 0){console.warn(`Got event for unknown req`);return}t.fire(e.event)}_handleUnsubscribeEventMessage(e){let t=this._pendingEvents.get(e.req);if(t===void 0){console.warn(`Got unsubscribe for unknown req`);return}t.dispose(),this._pendingEvents.delete(e.req)}_send(e){let t=[];if(e.type===Tk.Request)for(let n=0;n<e.args.length;n++){let r=e.args[n];r instanceof ArrayBuffer&&t.push(r)}else e.type===Tk.Reply&&e.res instanceof ArrayBuffer&&t.push(e.res);this._handler.sendMessage(e,t)}};function Mk(e){return e[0]===`o`&&e[1]===`n`&&hO(e.charCodeAt(2))}function Nk(e){return/^onDynamic/.test(e)&&hO(e.charCodeAt(9))}var Pk=class{constructor(e,t){this._localChannels=new Map,this._remoteChannels=new Map,this._protocol=new jk({sendMessage:(t,n)=>{e(t,n)},handleMessage:(e,t,n)=>this._handleMessage(e,t,n),handleEvent:(e,t,n)=>this._handleEvent(e,t,n)}),this.requestHandler=t(this)}onmessage(e){this._protocol.handleMessage(e)}_handleMessage(e,t,n){if(e===wk&&t===`$initialize`)return this.initialize(n[0]);let r=e===wk?this.requestHandler:this._localChannels.get(e);if(!r)return Promise.reject(Error(`Missing channel ${e} on worker thread`));let i=r[t];if(typeof i!=`function`)return Promise.reject(Error(`Missing method ${t} on worker thread channel ${e}`));try{return Promise.resolve(i.apply(r,n))}catch(e){return Promise.reject(e)}}_handleEvent(e,t,n){let r=e===wk?this.requestHandler:this._localChannels.get(e);if(!r)throw Error(`Missing channel ${e} on worker thread`);if(Nk(t)){let e=r[t];if(typeof e!=`function`)throw Error(`Missing dynamic event ${t} on request handler.`);let i=e.call(r,n);if(typeof i!=`function`)throw Error(`Missing dynamic event ${t} on request handler.`);return i}if(Mk(t)){let e=r[t];if(typeof e!=`function`)throw Error(`Missing event ${t} on request handler.`);return e}throw Error(`Malformed event name ${t}`)}setChannel(e,t){this._localChannels.set(e,t)}getChannel(e){let t=this._remoteChannels.get(e);return t===void 0&&(t=this._protocol.createProxyToRemoteChannel(e),this._remoteChannels.set(e,t)),t}async initialize(e){this._protocol.setWorkerId(e)}};let Fk=!1;function Ik(e){if(Fk)throw Error(`WebWorker already initialized!`);Fk=!0;let t=new Pk(e=>globalThis.postMessage(e),t=>e(t));return globalThis.onmessage=e=>{t.onmessage(e.data)},t}function Lk(e){globalThis.onmessage=t=>{Fk||Ik(e)}}Lk(Sk);