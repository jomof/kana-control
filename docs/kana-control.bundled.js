/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let s=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=n.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n.set(i,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const n=1===t.length?t[0]:e.reduce((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new s(n,t,i)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:o,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:u,getOwnPropertySymbols:h,getPrototypeOf:d}=Object,f=globalThis,p=f.trustedTypes,m=p?p.emptyScript:"",g=f.reactiveElementPolyfillSupport,b=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},w=(t,e)=>!o(t,e),y={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:w};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&c(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:s}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:n,set(e){const r=n?.call(this);s?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=d(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...u(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,n)=>{if(e)i.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of n){const n=document.createElement("style"),s=t.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=e.cssText,i.appendChild(n)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=n;const r=s.fromAttribute(e,t.type);this[n]=r??this._$Ej?.get(n)??r,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const n=this.constructor,s=this[t];if(i??=n.getPropertyOptions(t),!((i.hasChanged??w)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:s},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==s||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===n&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,n=this[e];!0!==t||this._$AL.has(e)||void 0===n||this.C(e,void 0,i,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[b("elementProperties")]=new Map,k[b("finalized")]=new Map,g?.({ReactiveElement:k}),(f.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,$=x.trustedTypes,j=$?$.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+O,_=`<${E}>`,A=document,z=()=>A.createComment(""),C=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,M="[ \t\n\f\r]",q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,J=/-->/g,P=/>/g,D=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),T=/'/g,U=/"/g,R=/^(?:script|style|textarea|title)$/i,I=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),G=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),L=new WeakMap,B=A.createTreeWalker(A,129);function H(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==j?j.createHTML(e):e}const W=(t,e)=>{const i=t.length-1,n=[];let s,r=2===e?"<svg>":3===e?"<math>":"",a=q;for(let e=0;e<i;e++){const i=t[e];let o,c,l=-1,u=0;for(;u<i.length&&(a.lastIndex=u,c=a.exec(i),null!==c);)u=a.lastIndex,a===q?"!--"===c[1]?a=J:void 0!==c[1]?a=P:void 0!==c[2]?(R.test(c[2])&&(s=RegExp("</"+c[2],"g")),a=D):void 0!==c[3]&&(a=D):a===D?">"===c[0]?(a=s??q,l=-1):void 0===c[1]?l=-2:(l=a.lastIndex-c[2].length,o=c[1],a=void 0===c[3]?D:'"'===c[3]?U:T):a===U||a===T?a=D:a===J||a===P?a=q:(a=D,s=void 0);const h=a===D&&t[e+1].startsWith("/>")?" ":"";r+=a===q?i+_:l>=0?(n.push(o),i.slice(0,l)+S+i.slice(l)+O+h):i+O+(-2===l?e:h)}return[H(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class V{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let s=0,r=0;const a=t.length-1,o=this.parts,[c,l]=W(t,e);if(this.el=V.createElement(c,i),B.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=B.nextNode())&&o.length<a;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(S)){const e=l[r++],i=n.getAttribute(t).split(O),a=/([.?@])?(.*)/.exec(e);o.push({type:1,index:s,name:a[2],strings:i,ctor:"."===a[1]?Y:"?"===a[1]?tt:"@"===a[1]?et:X}),n.removeAttribute(t)}else t.startsWith(O)&&(o.push({type:6,index:s}),n.removeAttribute(t));if(R.test(n.tagName)){const t=n.textContent.split(O),e=t.length-1;if(e>0){n.textContent=$?$.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],z()),B.nextNode(),o.push({type:2,index:++s});n.append(t[e],z())}}}else if(8===n.nodeType)if(n.data===E)o.push({type:2,index:s});else{let t=-1;for(;-1!==(t=n.data.indexOf(O,t+1));)o.push({type:7,index:s}),t+=O.length-1}s++}}static createElement(t,e){const i=A.createElement("template");return i.innerHTML=t,i}}function F(t,e,i=t,n){if(e===G)return e;let s=void 0!==n?i._$Co?.[n]:i._$Cl;const r=C(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),void 0===r?s=void 0:(s=new r(t),s._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=s:i._$Cl=s),void 0!==s&&(e=F(t,s._$AS(t,e.values),s,n)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??A).importNode(e,!0);B.currentNode=n;let s=B.nextNode(),r=0,a=0,o=i[0];for(;void 0!==o;){if(r===o.index){let e;2===o.type?e=new Z(s,s.nextSibling,this,t):1===o.type?e=new o.ctor(s,o.name,o.strings,this,t):6===o.type&&(e=new it(s,this,t)),this._$AV.push(e),o=i[++a]}r!==o?.index&&(s=B.nextNode(),r++)}return B.currentNode=A,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=F(this,t,e),C(t)?t===K||null==t||""===t?(this._$AH!==K&&this._$AR(),this._$AH=K):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==K&&C(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=V.createElement(H(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new Q(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=L.get(t.strings);return void 0===e&&L.set(t.strings,e=new V(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const s of t)n===e.length?e.push(i=new Z(this.O(z()),this.O(z()),this,this.options)):i=e[n],i._$AI(s),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,s){this.type=1,this._$AH=K,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(t,e=this,i,n){const s=this.strings;let r=!1;if(void 0===s)t=F(this,t,e,0),r=!C(t)||t!==this._$AH&&t!==G,r&&(this._$AH=t);else{const n=t;let a,o;for(t=s[0],a=0;a<s.length-1;a++)o=F(this,n[i+a],e,a),o===G&&(o=this._$AH[a]),r||=!C(o)||o!==this._$AH[a],o===K?t=K:t!==K&&(t+=(o??"")+s[a+1]),this._$AH[a]=o}r&&!n&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Y extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class tt extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class et extends X{constructor(t,e,i,n,s){super(t,e,i,n,s),this.type=5}_$AI(t,e=this){if((t=F(this,t,e,0)??K)===G)return;const i=this._$AH,n=t===K&&i!==K||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==K&&(i===K||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){F(this,t)}}const nt=x.litHtmlPolyfillSupport;nt?.(V,Z),(x.litHtmlVersions??=[]).push("3.3.1");const st=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class rt extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const n=i?.renderBefore??e;let s=n._$litPart$;if(void 0===s){const t=i?.renderBefore??null;n._$litPart$=s=new Z(e.insertBefore(z(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}rt._$litElement$=!0,rt.finalized=!0,st.litElementHydrateSupport?.({LitElement:rt});const at=st.litElementPolyfillSupport;at?.({LitElement:rt}),(st.litElementVersions??=[]).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:w},ct=(t=ot,e,i)=>{const{kind:n,metadata:s}=i;let r=globalThis.litPropertyMetadata.get(s);if(void 0===r&&globalThis.litPropertyMetadata.set(s,r=new Map),"setter"===n&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===n){const{name:n}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(n,s,t)},init(e){return void 0!==e&&this.C(n,void 0,t,e),e}}}if("setter"===n){const{name:n}=i;return function(i){const s=this[n];e.call(this,i),this.requestUpdate(n,s,t)}}throw Error("Unsupported decorator location: "+n)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function lt(t){return(e,i)=>"object"==typeof i?ct(t,e,i):((t,e,i)=>{const n=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),n?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ut(t){return lt({...t,state:!0,attribute:!1})}function ht(t){return null===t?"null":t!==Object(t)?typeof t:{}.toString.call(t).slice(8,-1).toLowerCase()}function dt(t){return"string"!==ht(t)||!t.length}function ft(t="",e,i){if(dt(t))return!1;const n=t.charCodeAt(0);return e<=n&&n<=i}const pt="toHiragana",mt="toKatakana",gt="hepburn",bt={useObsoleteKana:!1,passRomaji:!1,convertLongVowelMark:!0,upcaseKatakana:!1,IMEMode:!1,romanization:gt},vt=12353,wt=12449,yt=[65377,65381],kt=[...[[12352,12447],[12448,12543],yt,[65382,65439]],...[[12288,12351],yt,[12539,12540],[65281,65295],[65306,65311],[65339,65343],[65371,65376],[65504,65518]],[65313,65338],[65345,65370],[65296,65305],[19968,40959],[13312,19903]],xt=[[0,127],[256,257],[274,275],[298,299],[332,333],[362,363]],$t=[[32,47],[58,63],[91,96],[123,126],[8216,8217],[8220,8221]];function jt(t="",e){const i="regexp"===ht(e);return!dt(t)&&[...t].every(t=>{const n=function(t=""){return kt.some(([e,i])=>ft(t,e,i))}(t);return i?n||e.test(t):n})}var St=Number.isNaN||function(t){return"number"==typeof t&&t!=t};function Ot(t,e){return t===e||!(!St(t)||!St(e))}function Et(t,e){if(t.length!==e.length)return!1;for(var i=0;i<t.length;i++)if(!Ot(t[i],e[i]))return!1;return!0}function _t(t,e){void 0===e&&(e=Et);var i=null;function n(){for(var n=[],s=0;s<arguments.length;s++)n[s]=arguments[s];if(i&&i.lastThis===this&&e(n,i.lastArgs))return i.lastResult;var r=t.apply(this,n);return i={lastResult:r,lastArgs:n,lastThis:this},r}return n.clear=function(){i=null},n}var At=Object.prototype.hasOwnProperty;function zt(t,e,i){for(i of t.keys())if(Ct(i,e))return i}function Ct(t,e){var i,n,s;if(t===e)return!0;if(t&&e&&(i=t.constructor)===e.constructor){if(i===Date)return t.getTime()===e.getTime();if(i===RegExp)return t.toString()===e.toString();if(i===Array){if((n=t.length)===e.length)for(;n--&&Ct(t[n],e[n]););return-1===n}if(i===Set){if(t.size!==e.size)return!1;for(n of t){if((s=n)&&"object"==typeof s&&!(s=zt(e,s)))return!1;if(!e.has(s))return!1}return!0}if(i===Map){if(t.size!==e.size)return!1;for(n of t){if((s=n[0])&&"object"==typeof s&&!(s=zt(e,s)))return!1;if(!Ct(n[1],e.get(s)))return!1}return!0}if(i===ArrayBuffer)t=new Uint8Array(t),e=new Uint8Array(e);else if(i===DataView){if((n=t.byteLength)===e.byteLength)for(;n--&&t.getInt8(n)===e.getInt8(n););return-1===n}if(ArrayBuffer.isView(t)){if((n=t.byteLength)===e.byteLength)for(;n--&&t[n]===e[n];);return-1===n}if(!i||"object"==typeof t){for(i in n=0,t){if(At.call(t,i)&&++n&&!At.call(e,i))return!1;if(!(i in e)||!Ct(t[i],e[i]))return!1}return Object.keys(e).length===n}}return t!=t&&e!=e}const Nt=(t={})=>Object.assign({},bt,t);function Mt(t,e,i){const n=e;function s(t,e){const i=t.charAt(0);return r(Object.assign({"":i},n[i]),t.slice(1),e,e+1)}function r(t,e,n,a){if(!e)return i||1===Object.keys(t).length?t[""]?[[n,a,t[""]]]:[]:[[n,a,null]];if(1===Object.keys(t).length)return[[n,a,t[""]]].concat(s(e,a));const o=function(t,e){if(void 0!==t[e])return Object.assign({"":t[""]+e},t[e])}(t,e.charAt(0));return void 0===o?[[n,a,t[""]]].concat(s(e,a)):r(o,e.slice(1),n,a+1)}return s(t,0)}function qt(t){return Object.entries(t).reduce((t,[e,i])=>{const n="string"===ht(i);return t[e]=n?{"":i}:qt(i),t},{})}function Jt(t,e){return e.split("").reduce((t,e)=>(void 0===t[e]&&(t[e]={}),t[e]),t)}function Pt(t={}){const e={};return"object"===ht(t)&&Object.entries(t).forEach(([t,i])=>{let n=e;t.split("").forEach(t=>{void 0===n[t]&&(n[t]={}),n=n[t]}),n[""]=i}),function(t){return function t(e,i){return void 0===e||"string"===ht(e)?i:Object.entries(i).reduce((i,[n,s])=>(i[n]=t(e[n],s),i),e)}(JSON.parse(JSON.stringify(t)),e)}}function Dt(t,e){return e?"function"===ht(e)?e(t):Pt(e)(t):t}const Tt={a:"あ",i:"い",u:"う",e:"え",o:"お",k:{a:"か",i:"き",u:"く",e:"け",o:"こ"},s:{a:"さ",i:"し",u:"す",e:"せ",o:"そ"},t:{a:"た",i:"ち",u:"つ",e:"て",o:"と"},n:{a:"な",i:"に",u:"ぬ",e:"ね",o:"の"},h:{a:"は",i:"ひ",u:"ふ",e:"へ",o:"ほ"},m:{a:"ま",i:"み",u:"む",e:"め",o:"も"},y:{a:"や",u:"ゆ",o:"よ"},r:{a:"ら",i:"り",u:"る",e:"れ",o:"ろ"},w:{a:"わ",i:"ゐ",e:"ゑ",o:"を"},g:{a:"が",i:"ぎ",u:"ぐ",e:"げ",o:"ご"},z:{a:"ざ",i:"じ",u:"ず",e:"ぜ",o:"ぞ"},d:{a:"だ",i:"ぢ",u:"づ",e:"で",o:"ど"},b:{a:"ば",i:"び",u:"ぶ",e:"べ",o:"ぼ"},p:{a:"ぱ",i:"ぴ",u:"ぷ",e:"ぺ",o:"ぽ"},v:{a:"ゔぁ",i:"ゔぃ",u:"ゔ",e:"ゔぇ",o:"ゔぉ"}},Ut={".":"。",",":"、",":":"：","/":"・","!":"！","?":"？","~":"〜","-":"ー","‘":"「","’":"」","“":"『","”":"』","[":"［","]":"］","(":"（",")":"）","{":"｛","}":"｝"},Rt={k:"き",s:"し",t:"ち",n:"に",h:"ひ",m:"み",r:"り",g:"ぎ",z:"じ",d:"ぢ",b:"び",p:"ぴ",v:"ゔ",q:"く",f:"ふ"},It={ya:"ゃ",yi:"ぃ",yu:"ゅ",ye:"ぇ",yo:"ょ"},Gt={a:"ぁ",i:"ぃ",u:"ぅ",e:"ぇ",o:"ぉ"},Kt={sh:"sy",ch:"ty",cy:"ty",chy:"ty",shy:"sy",j:"zy",jy:"zy",shi:"si",chi:"ti",tsu:"tu",ji:"zi",fu:"hu"},Lt=Object.assign({tu:"っ",wa:"ゎ",ka:"ヵ",ke:"ヶ"},Gt,It),Bt={yi:"い",wu:"う",ye:"いぇ",wi:"うぃ",we:"うぇ",kwa:"くぁ",whu:"う",tha:"てゃ",thu:"てゅ",tho:"てょ",dha:"でゃ",dhu:"でゅ",dho:"でょ"},Ht={wh:"う",kw:"く",qw:"く",q:"く",gw:"ぐ",sw:"す",ts:"つ",th:"て",tw:"と",dh:"で",dw:"ど",fw:"ふ",f:"ふ"};function Wt(){const t=qt(Tt),e=e=>Jt(t,e);function i(t){return Object.entries(t).reduce((t,[e,n])=>(t[e]=e?i(n):`っ${n}`,t),{})}return Object.entries(Rt).forEach(([t,i])=>{Object.entries(It).forEach(([n,s])=>{e(t+n)[""]=i+s})}),Object.entries(Ut).forEach(([t,i])=>{e(t)[""]=i}),Object.entries(Ht).forEach(([t,i])=>{Object.entries(Gt).forEach(([n,s])=>{e(t+n)[""]=i+s})}),["n","n'","xn"].forEach(t=>{e(t)[""]="ん"}),t.c=JSON.parse(JSON.stringify(t.k)),Object.entries(Kt).forEach(([t,i])=>{const n=t.slice(0,t.length-1),s=t.charAt(t.length-1);e(n)[s]=JSON.parse(JSON.stringify(e(i)))}),Object.entries(Lt).forEach(([t,i])=>{const n=t=>t.charAt(t.length-1),s=t=>t.slice(0,t.length-1),r=e(`x${t}`);r[""]=i;var a;e(`l${s(t)}`)[n(t)]=r,(a=t,[...Object.entries(Kt),["c","k"]].reduce((t,[e,i])=>a.startsWith(i)?t.concat(a.replace(i,e)):t,[])).forEach(i=>{["l","x"].forEach(r=>{e(r+s(i))[n(i)]=e(r+t)})})}),Object.entries(Bt).forEach(([t,i])=>{e(t)[""]=i}),[...Object.keys(Rt),"c","y","w","j"].forEach(e=>{const n=t[e];n[e]=i(n)}),delete t.n.n,Object.freeze(JSON.parse(JSON.stringify(t)))}let Vt=null;const Ft=Pt({wi:"ゐ",we:"ゑ"});function Qt(t=""){return!dt(t)&&ft(t,65,90)}function Zt(t=""){return!dt(t)&&12540===t.charCodeAt(0)}function Xt(t=""){return!dt(t)&&12539===t.charCodeAt(0)}function Yt(t=""){return!dt(t)&&(!!Zt(t)||ft(t,vt,12438))}const te=_t((t,e,i)=>{let n=(null==Vt&&(Vt=Wt()),Vt);return n=t?function(t){const e=JSON.parse(JSON.stringify(t));return e.n.n={"":"ん"},e.n[" "]={"":"ん"},e}(n):n,n=e?Ft(n):n,i&&(n=Dt(n,i)),n},Ct);function ee(t="",e={},i){let n;return i?n=e:(n=Nt(e),i=te(n.IMEMode,n.useObsoleteKana,n.customKanaMapping)),function(t="",e={},i){const{IMEMode:n,useObsoleteKana:s,customKanaMapping:r}=e;i||(i=te(n,s,r));return Mt(t.toLowerCase(),i,!n)}(t,n,i).map(e=>{const[i,s,r]=e;if(null===r)return t.slice(i);const a=n.IMEMode===pt,o=n.IMEMode===mt||[...t.slice(i,s)].every(Qt);return a||!o?r:function(t=""){const e=[];return t.split("").forEach(t=>{if(Zt(t)||Xt(t))e.push(t);else if(Yt(t)){const i=t.charCodeAt(0)+96,n=String.fromCharCode(i);e.push(n)}else e.push(t)}),e.join("")}(r)}).join("")}let ie=[];function ne(t){const e=Object.assign({},Nt(t),{IMEMode:t.IMEMode||!0}),i=te(e.IMEMode,e.useObsoleteKana,e.customKanaMapping),n=[...Object.keys(i),...Object.keys(i).map(t=>t.toUpperCase())];return function({target:t}){undefined!==t.value&&"true"!==t.dataset.ignoreComposition&&function(t,e,i,n){const[s,r,a]=function(t="",e=0,i=[]){let n,s,r;0===e&&i.includes(t[0])?[n,s,r]=function(t,e){return["",...re(t,t=>e.includes(t)||!jt(t,/[0-9]/))]}(t,i):e>0?[n,s,r]=function(t="",e=0){const[i,n]=re([...t.slice(0,e)].reverse(),t=>!jt(t));return[n.reverse().join(""),i.split("").reverse().join(""),t.slice(e)]}(t,e):([n,s]=re(t,t=>!i.includes(t)),[s,r]=re(s,t=>!jt(t)));return[n,s,r]}(t.value,t.selectionEnd,n),o=ee(r,e,i);if(r!==o){const e=s.length+o.length,i=s+o+a;t.value=i,a.length?setTimeout(()=>t.setSelectionRange(e,e),1):t.setSelectionRange(e,e)}else t.value}(t,e,i,n)}}function se({type:t,target:e,data:i}){/Mac/.test(window.navigator&&window.navigator.platform)&&("compositionupdate"===t&&jt(i)&&(e.dataset.ignoreComposition="true"),"compositionend"===t&&(e.dataset.ignoreComposition="false"))}function re(t={},e=t=>!!t){const i=[],{length:n}=t;let s=0;for(;s<n&&e(t[s],s);)i.push(t[s]),s+=1;return[i.join(""),t.slice(s)]}const ae={input:({target:{value:t,selectionStart:e,selectionEnd:i}})=>console.log("input:",{value:t,selectionStart:e,selectionEnd:i}),compositionstart:()=>console.log("compositionstart"),compositionupdate:({target:{value:t,selectionStart:e,selectionEnd:i},data:n})=>console.log("compositionupdate",{data:n,value:t,selectionStart:e,selectionEnd:i}),compositionend:()=>console.log("compositionend")},oe=["TEXTAREA","INPUT"];let ce=0;function le(t={},e={},i=!1){if(!oe.includes(t.nodeName))throw new Error(`Element provided to Wanakana bind() was not a valid input or textarea element.\n Received: (${JSON.stringify(t)})`);if(t.hasAttribute("data-wanakana-id"))return;const n=ne(e),s=(ce+=1,`${Date.now()}${ce}`),r={};var a;[{name:"data-wanakana-id",value:s},{name:"lang",value:"ja"},{name:"autoCapitalize",value:"none"},{name:"autoCorrect",value:"off"},{name:"autoComplete",value:"off"},{name:"spellCheck",value:"false"}].forEach(e=>{r[e.name]=t.getAttribute(e.name),t.setAttribute(e.name,e.value)}),t.dataset.previousAttributes=JSON.stringify(r),t.addEventListener("input",n),t.addEventListener("compositionupdate",se),t.addEventListener("compositionend",se),function(t,e,i){ie=ie.concat({id:t,inputHandler:e,compositionHandler:i})}(s,n,se),!0===i&&(a=t,Object.entries(ae).forEach(([t,e])=>a.addEventListener(t,e)))}function ue(t="",e){const i="regexp"===ht(e);return!dt(t)&&[...t].every(t=>{const n=function(t=""){return!dt(t)&&xt.some(([e,i])=>ft(t,e,i))}(t);return i?n||e.test(t):n})}function he(t=""){return ft(t,wt,12540)}function de(t=""){return!dt(t)&&[...t].every(Yt)}function fe(t=""){return!dt(t)&&[...t].every(he)}function pe(t=""){return ft(t,19968,40879)||function(t=""){return!dt(t)&&12293===t.charCodeAt(0)}(t)}function me(t=""){return!dt(t)&&[...t].every(pe)}const ge={a:"あ",i:"い",u:"う",e:"え",o:"う"};function be(t="",e,{isDestinationRomaji:i,convertLongVowelMark:n}={}){let s="";return t.split("").reduce((r,a,o)=>{if(Xt(a)||((t,e)=>Zt(t)&&e<1)(a,o)||(t=>["ヶ","ヵ"].includes(t))(a))return r.concat(a);if(n&&s&&((t,e)=>Zt(t)&&e>0)(a,o)){const n=e(s).slice(-1);return he(t[o-1])&&"o"===n&&i?r.concat("お"):r.concat(ge[n])}if(!Zt(a)&&he(a)){const t=a.charCodeAt(0)+-96,e=String.fromCharCode(t);return s=e,r.concat(e)}return s="",r.concat(a)},[]).join("")}let ve=null;const we={あ:"a",い:"i",う:"u",え:"e",お:"o",か:"ka",き:"ki",く:"ku",け:"ke",こ:"ko",さ:"sa",し:"shi",す:"su",せ:"se",そ:"so",た:"ta",ち:"chi",つ:"tsu",て:"te",と:"to",な:"na",に:"ni",ぬ:"nu",ね:"ne",の:"no",は:"ha",ひ:"hi",ふ:"fu",へ:"he",ほ:"ho",ま:"ma",み:"mi",む:"mu",め:"me",も:"mo",ら:"ra",り:"ri",る:"ru",れ:"re",ろ:"ro",や:"ya",ゆ:"yu",よ:"yo",わ:"wa",ゐ:"wi",ゑ:"we",を:"wo",ん:"n",が:"ga",ぎ:"gi",ぐ:"gu",げ:"ge",ご:"go",ざ:"za",じ:"ji",ず:"zu",ぜ:"ze",ぞ:"zo",だ:"da",ぢ:"ji",づ:"zu",で:"de",ど:"do",ば:"ba",び:"bi",ぶ:"bu",べ:"be",ぼ:"bo",ぱ:"pa",ぴ:"pi",ぷ:"pu",ぺ:"pe",ぽ:"po",ゔぁ:"va",ゔぃ:"vi",ゔ:"vu",ゔぇ:"ve",ゔぉ:"vo"},ye={"。":".","、":",","：":":","・":"/","！":"!","？":"?","〜":"~",ー:"-","「":"‘","」":"’","『":"“","』":"”","［":"[","］":"]","（":"(","）":")","｛":"{","｝":"}","　":" "},ke=["あ","い","う","え","お","や","ゆ","よ"],xe={ゃ:"ya",ゅ:"yu",ょ:"yo"},$e={ぃ:"yi",ぇ:"ye"},je={ぁ:"a",ぃ:"i",ぅ:"u",ぇ:"e",ぉ:"o"},Se=["き","に","ひ","み","り","ぎ","び","ぴ","ゔ","く","ふ"],Oe={し:"sh",ち:"ch",じ:"j",ぢ:"j"},Ee={っ:"",ゃ:"ya",ゅ:"yu",ょ:"yo",ぁ:"a",ぃ:"i",ぅ:"u",ぇ:"e",ぉ:"o"},_e={b:"b",c:"t",d:"d",f:"f",g:"g",h:"h",j:"j",k:"k",m:"m",p:"p",q:"q",r:"r",s:"s",t:"t",v:"v",w:"w",x:"x",z:"z"};function Ae(){return null==ve&&(ve=function(){const t=qt(we),e=e=>Jt(t,e),i=(t,i)=>{e(t)[""]=i};return Object.entries(ye).forEach(([t,i])=>{e(t)[""]=i}),[...Object.entries(xe),...Object.entries(je)].forEach(([t,e])=>{i(t,e)}),Se.forEach(t=>{const n=e(t)[""][0];Object.entries(xe).forEach(([e,s])=>{i(t+e,n+s)}),Object.entries($e).forEach(([e,s])=>{i(t+e,n+s)})}),Object.entries(Oe).forEach(([t,e])=>{Object.entries(xe).forEach(([n,s])=>{i(t+n,e+s[1])}),i(`${t}ぃ`,`${e}yi`),i(`${t}ぇ`,`${e}e`)}),t["っ"]=ze(t),Object.entries(Ee).forEach(([t,e])=>{i(t,e)}),ke.forEach(t=>{i(`ん${t}`,`n'${e(t)[""]}`)}),Object.freeze(JSON.parse(JSON.stringify(t)))}()),ve}function ze(t){return Object.entries(t).reduce((t,[e,i])=>{if(e)t[e]=ze(i);else{const n=i.charAt(0);t[e]=Object.keys(_e).includes(n)?_e[n]+i:i}return t},{})}const Ce=_t((t,e)=>{let i=function(t){return t===gt?Ae():{}}(t);return e&&(i=Dt(i,e)),i},Ct);function Ne(t="",e={},i){const n=Nt(e);return i||(i=Ce(n.romanization,n.customRomajiMapping)),function(t,e,i){i||(i=Ce(e.romanization,e.customRomajiMapping));const n=Object.assign({},{isDestinationRomaji:!0},e);return Mt(be(t,Ne,n),i,!e.IMEMode)}(t,n,i).map(e=>{const[i,s,r]=e;return n.upcaseKatakana&&fe(t.slice(i,s))?r.toUpperCase():r}).join("")}function Me(t="",e={}){const i=Nt(e);if(i.passRomaji)return be(t,Ne,i);if(function(t="",e={passKanji:!0}){const i=[...t];let n=!1;return e.passKanji||(n=i.some(me)),(i.some(de)||i.some(fe))&&i.some(ue)&&!n}(t,{passKanji:!0})){return ee(be(t,Ne,i).toLowerCase(),i)}return ue(t)||function(t=""){return!dt(t)&&$t.some(([e,i])=>ft(t,e,i))}(t)?ee(t.toLowerCase(),i):be(t,Ne,i)}const qe=new Set(["general","proper-noun","common-noun","numeral","case-particle","binding-particle","adverbial-particle","conjunctive-particle","sentence-final-particle","nominal-particle","aux-verb-stem","bound","verbal","adjectival","adjectival-noun-like","nominal","tari","filler","letter","ascii-art","period","comma","open-bracket","close-bracket"]),Je=new Set(["general","verbal-suru","verbal-suru-adj","adverbial","adjectival-noun-possible","counter","counter-possible","place-name","person-name","kaomoji"]),Pe=new Set(["general","country","given-name","surname"]),De=new Set(["aux-ta","aux-da","aux-desu","aux-masu","aux-nai","aux-nu","aux-reru","aux-tai","aux-rashii","aux-mai","aux-ja","aux-ya","aux-nanda","aux-hen","godan-ra","godan-ka","godan-ga","godan-sa","godan-ta","godan-na","godan-ba","godan-ma","godan-waa","upper-ichidan-a","upper-ichidan-ka","upper-ichidan-ga","upper-ichidan-za","upper-ichidan-ta","upper-ichidan-na","upper-ichidan-ha","upper-ichidan-ba","upper-ichidan-ma","upper-ichidan-ra","lower-ichidan-a","lower-ichidan-ka","lower-ichidan-ga","lower-ichidan-sa","lower-ichidan-za","lower-ichidan-ta","lower-ichidan-da","lower-ichidan-na","lower-ichidan-ha","lower-ichidan-ba","lower-ichidan-ma","lower-ichidan-ra","ka-irregular","sa-irregular","i-adjective","classical-sa-irregular","classical-ra-irregular","classical-adj-ku","classical-adj-shiku","classical-aux-tari-perfective","classical-aux-tari-assertive","classical-aux-nari","classical-aux-ri","classical-aux-beshi","classical-aux-zu","classical-aux-ki","classical-aux-keri","classical-aux-gotoshi","classical-aux-maji","classical-aux-mu","classical-aux-ji","classical-aux-nu","classical-aux-rashi","classical-aux-ramu","classical-aux-zamasu","classical-upper-nidan-ta","classical-upper-nidan-da","classical-upper-nidan-ba","classical-lower-nidan-a","classical-lower-nidan-ka","classical-lower-nidan-ga","classical-lower-nidan-sa","classical-lower-nidan-da","classical-lower-nidan-na","classical-lower-nidan-ha","classical-lower-nidan-ma","classical-lower-nidan-ra","classical-yodan-ka","classical-yodan-sa","classical-yodan-ta","classical-yodan-ha","classical-yodan-ma","classical-yodan-ra"]),Te=new Set(["terminal","terminal-nasal","terminal-geminate","terminal-fused","terminal-u-euphonic","continuative","continuative-geminate","continuative-nasal","continuative-i-euphonic","continuative-u-euphonic","continuative-ni","continuative-abbreviated","continuative-fused","continuative-auxiliary","attributive","attributive-nasal","attributive-abbreviated","attributive-auxiliary","irrealis","irrealis-sa","irrealis-se","irrealis-nasal","irrealis-auxiliary","conditional","conditional-fused","imperative","volitional-presumptive","realis","stem","stem-sa","ku-form"]);var Ue,Re,Ie;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Ge(t,e,i,n){if(n===e.length)return[];for(let s=i;s<t.length;s++){const i=t[s].reading;if(e.startsWith(i,n)){const r=Ge(t,e,s+1,n+i.length);if(r)return[s,...r]}}return null}function Ke(t,e){if(t.length>0&&Array.isArray(t[0])){const i=t,n=Le(i);return i.map(t=>n.includes(t)?Ke(t,e):{matched:null})}const i=t,n=Ge(i,e,0,0);if(!n)return{matched:null};const s=[];for(const t of n)i[t].marked||(i[t].marked=!0,s.push(t));return{matched:s}}function Le(t){if(0===t.length)return[];const e=t.map(t=>t.reduce((t,e)=>t+(e.marked?1:0),0)),i=Math.max(...e);return t.filter((t,n)=>e[n]===i)}function Be(t){if(0===t.length)throw new Error("No groups provided");const e=Le(t);if(1===e.length)return e[0];let i=e[0],n=i.length;for(let t=1;t<e.length;t++){const s=e[t];s.length<n&&(i=s,n=s.length)}return i}function He(t){const e=["記号","aux-symbol","aux-symbol:period","aux-symbol:comma"];return t.every(t=>e.some(e=>t.pos?.startsWith(e))||t.marked)}function We(t){const e=function(t){return t.match(/⌈[^⌉]*⌉/g)||[]}(t);return e.map(t=>{const e=function(t){const e={surface:"",pos:"",posDetail1:"",posDetail2:"",posDetail3:"",conjugatedType:"",conjugatedForm:"",baseOrth:"",lemma:"",reading:""},i=t.match(/ˢ(.*?)ᵖ/s);i&&(e.surface=i[1]);const n=t.match(/ᵖ([^⌉ᵇᵈʳ]+)/);if(n){const t=n[1].split(":");e.pos=t.length>0?t[0]:"";for(let i=1;i<t.length;i++){const n=t[i];n&&(Te.has(n)?e.conjugatedForm=n:De.has(n)?e.conjugatedType=n:Je.has(n)?e.posDetail1?e.posDetail2=n:e.posDetail1=n:Pe.has(n)?e.posDetail3=n:qe.has(n)?e.posDetail1?e.posDetail2=n:e.posDetail1=n:e.posDetail1?e.posDetail2?e.posDetail3?e.conjugatedType?e.conjugatedForm||(e.conjugatedForm=n):e.conjugatedType=n:e.posDetail3=n:e.posDetail2=n:e.posDetail1=n)}}const s=t.match(/ᵇ([^⌉ᵈʳ]+)/);s&&(e.baseOrth=s[1]);const r=t.match(/ᵈ([^⌉ʳ]+)/);r&&(e.lemma=r[1]);const a=t.match(/ʳ([^⌉]+)/);return a&&(e.reading=a[1]),e}(t),i=e.reading?Me(e.reading):Me(e.surface);return{surface_form:e.surface,reading:i,pos:e.pos,marked:!1}})}async function Ve(t,e,i){const n=e.map(t=>{const e=i[t];if(!e?.kotogram)throw new Error(`Missing kotogram data for answer: "${t}"`);return We(e.kotogram)});return{english:t,japanese:e,parsed:n,answerGrammar:i}}!function(t){t.VERY_FORMAL="very_formal",t.FORMAL="formal",t.NEUTRAL="neutral",t.CASUAL="casual",t.VERY_CASUAL="very_casual",t.UNPRAGMATIC_FORMALITY="unpragmatic_formality"}(Ue||(Ue={})),function(t){t.MASCULINE="masculine",t.FEMININE="feminine",t.NEUTRAL="neutral",t.UNPRAGMATIC_GENDER="unpragmatic_gender"}(Re||(Re={})),function(t){t.SONKEIGO="sonkeigo",t.KENJOGO="kenjogo",t.KANSAIBEN="kansaiben",t.HAKATABEN="hakataben",t.KYOSHIGO="kyoshigo",t.NETSLANG="netslang",t.OJOUSAMA="ojousama",t.GUNTAI="guntai",t.JOSEIGO="joseigo",t.DANSEIGO="danseigo",t.BURIKKO="burikko",t.NEUTRAL="neutral",t.TOHOKU="tohoku",t.BUSHI="bushi"}(Ie||(Ie={}));
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Fe=function(t,e,i,n){for(var s,r=arguments.length,a=r<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n,o=t.length-1;o>=0;o--)(s=t[o])&&(a=(r<3?s(a):r>3?s(e,i,a):s(e,i))||a);return r>3&&a&&Object.defineProperty(e,i,a),a};let Qe=class extends rt{constructor(){super(...arguments),this.question=null,this.parsedEnglish=[],this._furiganaVisibility=[],this._wrongAttempts=0,this._correctAttempts=[],this._revealedHintIndices=new Set,this._revealedAnswer=!1,this._expandedGrammarAnswer=null,this.debug=!1,this.initialScore=100,this.correctGuessFactor=.95,this.incorrectGuessFactor=.7,this.score=-1}static{this.styles=r`
    :host {
      display: block;
      position: relative;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
      /* Allow both light & dark; rely on page color scheme */
    }

    #score {
      position: absolute;
      top: 10px;
      right: 10px;
      font-family: 'Noto Sans JP', sans-serif;
      font-size: 20px;
      font-weight: bold;
      color: #666;
    }

    input#kana-input {
      box-sizing: border-box;
      width: 100%;
      padding-left: 2.5em;
      padding-right: 2.5em;
      border-radius: 8px;

      font-family: 'Noto Sans JP', sans-serif;
      font-size: 22px;
      line-height: 33px;
      text-align: center;
    }

    .input-wrapper {
      position: relative;
      width: 100%;
    }

    #action-button {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 24px;
      padding: 0;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      transition: background-color 0.2s;
      z-index: 1;
    }

    #action-button:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    #action-button.complete {
      color: #4caf50;
    }

    #action-button.skip {
      color: #999;
    }

    #action-button.hint {
      color: #ff9800;
    }

    #english {
      font-family: 'Noto Sans JP', sans-serif;
      font-size: 30px;
      text-align: center;
      width: 100%;
      margin-bottom: 10px;
    }

    .english-word[has-furigana] {
      cursor: pointer;
    }

    #skeleton {
      font-family: 'Noto Sans JP', sans-serif;
      font-size: 22px;
      text-align: center;
      width: 100%;
      margin-bottom: 10px;
    }

      #skeleton .skeleton {
        display: flex;
        justify-content: center;
        align-items: baseline;
        gap: 0.2em;
        flex-wrap: wrap;
        line-height: 2;
      }

      #skeleton .token {
        font-weight: normal;
        color: #999;
      }

      #skeleton .token.marked {
        font-weight: bold;
        color: #000;
      }

      #skeleton .token.missed {
        font-weight: bold;
        color: #f57f17;
      }

      #skeleton .completed {
        color: #4caf50;
        font-size: 1.5em;
        margin-left: 0.3em;
      }

      #possible-answers {
        margin-top: 20px;
        text-align: center;
        font-family: 'Noto Sans JP', sans-serif;
      }

      .possible-answer {
        margin-bottom: 8px;
        font-size: 18px;
        color: #666;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .possible-answer:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      .grammar-badges {
        display: flex;
        justify-content: center;
        gap: 4px;
        margin-top: 4px;
        flex-wrap: wrap;
      }

      .grammar-badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 10px;
        color: white;
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: 0.5px;
      }

      .grammar-badge.formality-formal { background: #2196f3; }
      .grammar-badge.formality-neutral { background: #9e9e9e; }
      .grammar-badge.formality-casual { background: #ff9800; }

      .grammar-badge.gender-masculine { background: #3f51b5; }
      .grammar-badge.gender-feminine { background: #e91e63; }

      .grammar-badge.register { background: #673ab7; }

      .grammar-detail {
        margin-top: 8px;
        padding: 12px;
        background: #f5f5f5;
        border-radius: 8px;
        font-size: 14px;
        text-align: left;
      }

      .grammar-detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
      }

      .grammar-detail-label {
        font-weight: 500;
        color: #666;
      }

      .grammar-detail-value {
        color: #333;
      }

      /* Dark mode adjustments */
      @media (prefers-color-scheme: dark) {
        :host {
          background-color: #121212;
          border-color: #444;
        }
        #score {
          color: #aaa;
        }
        #skeleton .token.marked {
          color: #eee;
        }
        #skeleton .token.missed {
          color: #ffeb3b;
        }
        #skeleton .token {
          color: #888;
        }
        span#english, #english {
          color: #eee;
        }
        .possible-answer {
          color: #aaa;
        }
        .possible-answer:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        .grammar-detail {
          background: #2a2a2a;
        }
        .grammar-detail-label {
          color: #aaa;
        }
        .grammar-detail-value {
          color: #ddd;
        }
      }
  `}async supplyQuestion(t){this.question=structuredClone(t),this.parsedEnglish=function(t){const e=/([a-zA-Z0-9_']+)\s*(?:\[([^\]]+)\])?/g,i=[];let n;for(;null!==(n=e.exec(t));)i.push({englishWord:n[1],furigana:n[2]||""});return i}(t.english),this._furiganaVisibility=new Array(this.parsedEnglish.length).fill(!1),this._wrongAttempts=0,this._correctAttempts=[],this._revealedHintIndices.clear(),this._revealedAnswer=!1,this._expandedGrammarAnswer=null,this.score=-1;const e=this.renderRoot.querySelector("#kana-input");e&&(e.value=""),this.requestUpdate()}render(){const t=this.question?this.question.parsed:[],e=t.length>0?Be(t):[],i=t.length>0&&He(e),n=e.some(t=>t.marked);let s="skip",r="⏭",a="Skip Question";return i?(s="complete",r="➜",a="Next Question"):this._revealedAnswer?(s="skip",r="⏭",a="Next Question"):n&&(s="hint",r="?",a="Reveal Answer"),I`
      ${-1!==this.score?I`<div id="score">${this.score}</div>`:null}
      ${this.parsedEnglish.length>0?I`
            <div id="english" part="english">
              ${this.parsedEnglish.map((t,e)=>I`
                  <span
                    class="english-word"
                    ?has-furigana=${""!==t.furigana}
                    @click=${()=>this._handleEnglishWordClick(e)}
                  >
                    ${this._furiganaVisibility[e]&&t.furigana?I`<ruby
                          ><rb>${t.englishWord}</rb
                          ><rt>${t.furigana}</rt></ruby
                        >`:t.englishWord}
                  </span>
                `)}
            </div>
          `:I`<div id="english" part="english" style="color: #999;">
            Loading question...
          </div>`}
      ${this.question?I`<div id="skeleton" part="skeleton">${this._renderSkeleton()}</div>`:null}
      <div class="input-wrapper">
        <input
          id="kana-input"
          part="kana-input"
          type="text"
          autocapitalize="none"
          autocomplete="off"
          spellcheck="false"
          placeholder="日本語"
          ?disabled=${this._revealedAnswer}
          @keydown=${this._handleKeydown}
        />
        <button
          id="action-button"
          part="action-button"
          class="${s}"
          @click=${this._handleActionButtonClick}
          title="${a}"
        >
          ${r}
        </button>
      </div>
      ${i||this._revealedAnswer?this._renderPossibleAnswers():null}
      ${this.debug&&this.question?I`<div id="debug-output" part="debug" style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px; font-family: monospace; font-size: 14px;">
            ${this._renderDebugInfo()}
          </div>`:null}
    `}firstUpdated(){const t=this.renderRoot.querySelector("#kana-input");t&&le(t,{IMEMode:!0})}_handleKeydown(t){if(!this.question||"Enter"!==t.key||this._revealedAnswer)return;const e=this.question.parsed;if(He(Be(e)))return this.dispatchEvent(new CustomEvent("question-complete",{bubbles:!0,composed:!0,detail:this._getEventDetail()})),void this.dispatchEvent(new CustomEvent("request-next-question",{bubbles:!0,composed:!0}));const i=t.target,n=i.value,s=Ke(e,Me(n));if(s.some(t=>null!==t.matched&&t.matched.length>0)){this._correctAttempts=[...this._correctAttempts,n];const t=He(Be(e));if(t)-1===this.score&&(this.score=this.initialScore);else{let t=-1===this.score?this.initialScore:this.score;t=Math.round(t*this.correctGuessFactor),this.score=t}i.value="",t&&this.requestUpdate()}else{this._wrongAttempts++;let t=-1===this.score?this.initialScore:this.score;t=Math.round(t*this.incorrectGuessFactor),this.score=t}this.requestUpdate()}_handleActionButtonClick(){if(!this.question)return;const t=Be(this.question.parsed),e=He(t),i=t.some(t=>t.marked);if(e)this.dispatchEvent(new CustomEvent("question-complete",{bubbles:!0,composed:!0,detail:this._getEventDetail()})),this.dispatchEvent(new CustomEvent("request-next-question",{bubbles:!0,composed:!0}));else if(this._revealedAnswer)this.dispatchEvent(new CustomEvent("question-skipped",{bubbles:!0,composed:!0,detail:this._getEventDetail()})),this.dispatchEvent(new CustomEvent("request-next-question",{bubbles:!0,composed:!0}));else if(i){const e=t.filter(t=>!t.marked&&"記号"!==t.pos).length;let i=-1===this.score?this.initialScore:this.score;for(let t=0;t<e;t++)i=Math.round(i*this.incorrectGuessFactor);this.score=i,this._revealedAnswer=!0,this.requestUpdate()}else this.dispatchEvent(new CustomEvent("question-skipped",{bubbles:!0,composed:!0,detail:this._getEventDetail()})),this.dispatchEvent(new CustomEvent("request-next-question",{bubbles:!0,composed:!0}))}_getEventDetail(){if(!this.question)return{};const t=Be(this.question.parsed).map(t=>"記号"===t.pos||t.marked?t.surface_form:"_".repeat(t.surface_form.length)).join(""),e=Array.from(this._revealedHintIndices).sort((t,e)=>t-e).map(t=>this.parsedEnglish[t].englishWord);return{finalSkeleton:t,wrongAttempts:this._wrongAttempts,correctAttempts:[...this._correctAttempts],englishHints:e,score:this.score}}_handleEnglishWordClick(t){if(this.parsedEnglish&&this.parsedEnglish[t]&&this.parsedEnglish[t].furigana&&t<this._furiganaVisibility.length){const e=!this._furiganaVisibility[t];this._furiganaVisibility[t]=e,e&&this._revealedHintIndices.add(t)}this.requestUpdate()}_renderSkeleton(){if(!this.question)return I`<div>Loading question...</div>`;const t=Be(this.question.parsed),e=He(t),i=t.map(t=>t.surface_form).join(""),n=this.question.answerGrammar?.[i];return I`
      <div class="skeleton">
        ${t.map(t=>{if("記号"===t.pos)return I`${t.surface_form}`;if(this._revealedAnswer){const e=!t.marked,i=e?"token missed":"token marked";if(e&&t.reading){const e=Me(t.reading);if(e!==Me(t.surface_form))return I`<span class="${i}"
                    ><ruby>${t.surface_form}<rt>${e}</rt></ruby></span
                  >`}return I`<span class="${i}"
                  >${t.surface_form}</span
                >`}return I`<span class="token ${t.marked?"marked":""}"
                  >${t.marked?t.surface_form:"_".repeat(t.surface_form.length)}</span
                >`})}
        ${e?I`<span class="completed">✓</span>`:""}
      </div>
      ${(e||this._revealedAnswer)&&n?this._renderGrammarBadges(n):null}
    `}_renderPossibleAnswers(){if(!this.question)return null;const t=this.question.parsed,e=Be(t).map(t=>t.surface_form).join(""),i=t.filter(t=>t.map(t=>t.surface_form).join("")!==e);return 0===i.length?null:I`
      <div id="possible-answers">
        <div style="font-size: 14px; color: #888; margin-bottom: 8px;">Other possible answers:</div>
        ${i.map(t=>{const e=t.map(t=>t.surface_form).join(""),i=this.question?.answerGrammar?.[e],n=this._expandedGrammarAnswer===e;return I`
            <div class="possible-answer" @click=${()=>this._toggleGrammarDetail(e)}>
              <div>
                ${t.map(t=>{if("記号"===t.pos)return I`${t.surface_form}`;if(t.reading){const e=Me(t.reading);if(e!==Me(t.surface_form))return I`<ruby>${t.surface_form}<rt>${e}</rt></ruby>`}return I`${t.surface_form}`})}
              </div>
              ${i?this._renderGrammarBadges(i):null}
              ${i&&n?this._renderGrammarDetail(i):null}
            </div>
          `})}
      </div>
    `}_toggleGrammarDetail(t){this._expandedGrammarAnswer===t?this._expandedGrammarAnswer=null:this._expandedGrammarAnswer=t,this.requestUpdate()}_renderGrammarBadges(t){const e=[];e.push(I`
      <span class="grammar-badge formality-${t.formality}">
        ${t.formality}
      </span>
    `),"neutral"!==t.gender&&e.push(I`
        <span class="grammar-badge gender-${t.gender}">
          ${t.gender}
        </span>
      `);for(const i of t.registers)"neutral"!==i&&e.push(I`
          <span class="grammar-badge register">${i}</span>
        `);return I`<div class="grammar-badges">${e}</div>`}_renderGrammarDetail(t){return I`
      <div class="grammar-detail">
        <div class="grammar-detail-row">
          <span class="grammar-detail-label">Formality:</span>
          <span class="grammar-detail-value">${t.formality} (${t.formality_score.toFixed(3)})</span>
        </div>
        <div class="grammar-detail-row">
          <span class="grammar-detail-label">Gender:</span>
          <span class="grammar-detail-value">${t.gender} (${t.gender_score.toFixed(3)})</span>
        </div>
        <div class="grammar-detail-row">
          <span class="grammar-detail-label">Registers:</span>
          <span class="grammar-detail-value">${t.registers.join(", ")||"none"}</span>
        </div>
        <div class="grammar-detail-row">
          <span class="grammar-detail-label">Grammaticality:</span>
          <span class="grammar-detail-value">${t.is_grammatic?"✓":"✗"} (${(100*t.grammaticality_score).toFixed(1)}%)</span>
        </div>
      </div>
    `}_renderDebugInfo(){if(!this.question)return I`<div>No question loaded</div>`;const t=this.question.parsed.filter(t=>{const e=t.some(t=>t.marked),i=!t.some(t=>t.marked);return e||i});return I`
      <div style="margin-bottom: 5px; font-weight: bold; color: #666;">
        Debug: ${t.length} possible sentence${1!==t.length?"s":""}
      </div>
      ${t.map((t,e)=>I`
          <div style="padding: 2px 0; color: #333;">
            ${e+1}. ${t.map(t=>t.surface_form).join("")}
          </div>
        `)}
    `}};Fe([ut()],Qe.prototype,"question",void 0),Fe([ut()],Qe.prototype,"parsedEnglish",void 0),Fe([ut()],Qe.prototype,"_furiganaVisibility",void 0),Fe([ut()],Qe.prototype,"_wrongAttempts",void 0),Fe([ut()],Qe.prototype,"_correctAttempts",void 0),Fe([ut()],Qe.prototype,"_revealedAnswer",void 0),Fe([ut()],Qe.prototype,"_expandedGrammarAnswer",void 0),Fe([lt({type:Boolean})],Qe.prototype,"debug",void 0),Fe([lt({type:Number})],Qe.prototype,"initialScore",void 0),Fe([lt({type:Number})],Qe.prototype,"correctGuessFactor",void 0),Fe([lt({type:Number})],Qe.prototype,"incorrectGuessFactor",void 0),Fe([ut()],Qe.prototype,"score",void 0),Qe=Fe([(t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("kana-control")],Qe);export{Qe as KanaControl,Ve as makeQuestion};
