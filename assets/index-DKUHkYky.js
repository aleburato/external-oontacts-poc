var D=Object.defineProperty;var L=(e,t,a)=>t in e?D(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a;var m=(e,t,a)=>L(e,typeof t!="symbol"?t+"":t,a);import{D as O,r as i,u as y,j as n,a as b,c as M}from"./vendor-YCrArcGf.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();function N(e){return e[Math.floor(Math.random()*e.length)]}function k(){return N(["work","mobile","other"])}function A(){return N(["Gerhold Inc","Dibbert Group","Hane, Dicki and Borer","Fritsch LLC","Shields, Beatty and Zemlak","Jaskolski, Luettgen and Zieme","Hoeger Group","Bins, Rice and Friesen","Toy, Morissette and Bartell","Larson and Sons","Wisozk, O'Keefe and Wolff","Von-Kreiger","Nolan, Volkman and Nader","Erdman-Wehner","Beatty Inc","Cremin PLC","Douglas, Bailey and Gutkowski","Quitzon LLC","Batz and Sons","Bode Inc","Douglas-Schneider","Powlowski, Lowe and Beer","Kshlerin, Pagac and Hodkiewicz","Connelly and Sons","Smitham Ltd","Crooks PLC","Goldner PLC","Corkery, Hodkiewicz and Huels","Kovacek Inc","Von-Marvin","Gibson, Block and Dooley","Flatley-Bernier","Schumm Inc","Ziemann PLC","Mayer Ltd","Okuneva, Parisian and Sporer","Greenholt, Bradtke and Huel","Medhurst and Sons","Hermiston-Reichel","Spencer, Bins and Thompson","Raynor Inc","Koelpin Group","Schaden Group","Maggio-Ernser","Goodwin, Howe and Stamm","O'Connell, Greenfelder and Feest","Schneider, Marquardt and Beier","D'Amore-Cormier","Wunsch-Hamill","Homenick Group"])}class B{constructor(t,a){m(this,"getTotalContactsCount",async()=>(await this.getExternalContacts({start:0,limit:1})).total);m(this,"getExternalContacts",async({start:t,limit:a})=>{const o=new URLSearchParams({start:`${t}`,limit:`${a}`}),r=await(await fetch(`https://webexapis.com/v1/contacts/organizations/${this.orgId}/contacts/search?${o}`,{method:"GET",headers:{Authorization:`Bearer ${this._authToken}`}})).json(),c=r.result;return{start:r.start,contacts:c.map(l=>{var d;return{id:l.contactId,givenName:l.firstName,familyName:l.lastName,displayName:`${l.firstName} ${l.lastName}`,companyName:A(),phoneNumbers:((d=l.phoneNumbers)==null?void 0:d.map(u=>`${u.value};${k()}`))||[]}}),total:r.total,limit:r.limit}});this.orgId=t,this._authToken=a}}let x;function T(){return x||(x=new B("1f11209c-7b1d-4ffc-8179-dabb90e2fb79","MGE3YTY2MDMtZmI5Zi00Zjg0LTliMGItMjU3NmUzNTk4OThmMDI0MzdlMjUtZDFj_P0A1_1f11209c-7b1d-4ffc-8179-dabb90e2fb79")),x}const f=new O("ExternalContactsDatabase");f.version(1).stores({contacts:"id, displayName, companyName, givenName, familyName, *phoneNumbers",meta:""});class G{constructor(t){m(this,"clearDb",async({lastRetrievedApiTotal:t,orgId:a})=>{await this.db.contacts.clear(),await this.db.meta.put({orgId:a,lastRetrievedApiTotal:t,nextContactOffset:0,failedContactInsertionAttempts:0,timestamp:new Date().toISOString()},"lastMeta")});m(this,"getImportStatus",async()=>await this.db.transaction("r",[this.db.contacts,this.db.meta],async()=>{const t=await this.db.meta.get("lastMeta");return{orgId:(t==null?void 0:t.orgId)||"",lastRetrievedApiTotal:(t==null?void 0:t.lastRetrievedApiTotal)??-1,contactsCount:await this.db.contacts.count(),nextOffset:(t==null?void 0:t.nextContactOffset)??0,insertionErrors:(t==null?void 0:t.failedContactInsertionAttempts)??0}}));m(this,"addContacts",async t=>{await this.db.transaction("rw",[this.db.contacts,this.db.meta],async()=>{var a,o;try{await this.db.contacts.bulkAdd(t)}catch(s){if((s==null?void 0:s.name)==="BulkError"){const r=s,c=((a=await this.db.meta.get("lastMeta"))==null?void 0:a.failedContactInsertionAttempts)||0;await this.db.meta.update("lastMeta",{failedContactInsertionAttempts:c+((o=r.failures)==null?void 0:o.length)||0}),this.logBulkError(r)}}})});m(this,"queryContacts",async({search:t,limit:a,start:o})=>{const s=this.db.contacts,r=t?s.where("displayName").startsWithIgnoreCase(t).or("companyName").startsWithIgnoreCase(t).or("givenName").startsWithIgnoreCase(t).or("familyName").startsWithIgnoreCase(t).or("phoneNumbers").startsWithIgnoreCase(t).distinct():s.toCollection(),c=new Set(await r.primaryKeys()),l=[];let d=0;return await s.orderBy("givenName").until(()=>l.length>=a).eachPrimaryKey(u=>{c.has(u)&&(d>=o?l.push(s.get(u)):d++)}),{contacts:await Promise.all(l),totalContacts:c.size}});m(this,"updateNextOffset",async t=>{await this.db.meta.update("lastMeta",{nextContactOffset:t})});m(this,"logBulkError",t=>{var a,o;try{console.error(((a=t.failures)==null?void 0:a.length)+" insertions failed!"),(o=t.failures)==null||o.forEach(s=>{console.error(s.message)});for(const[s,r]of Object.entries(t.failuresByPos))console.error(`Operation ${s} failed with ${r}`)}catch{}});this.db=t}}let C;function j(e=f){return C||(C=new G(e)),C}const $=1e3,W=5e4;async function R({_dbRepo:e,_contactsApi:t,_pageSize:a}={_dbRepo:j(),_contactsApi:T(),_pageSize:W}){console.log(">>> resumeOrStartPopulatingDb: BEGIN");const o=await t.getTotalContactsCount(),s=t.orgId,{lastRetrievedApiTotal:r,orgId:c}=await e.getImportStatus();(r!==o||c!==s)&&(console.log(">>> resumeOrStartPopulatingDb: clearing DB for API/DB mismatch",{lastRetrievedApiTotal:r,apiTotal:o,orgId:c,currentOrgId:s}),await e.clearDb({lastRetrievedApiTotal:o,orgId:s}));let l=0;for(;;){if(++l>$)throw new Error("Max number of calls exceeded");const{contactsCount:d,insertionErrors:u,nextOffset:h}=await e.getImportStatus();if(console.log(`>>> resumeOrStartPopulatingDb (${l}): `,{apiTotal:o,contactsCount:d,insertionErrors:u,nextOffset:h}),h>=o){console.log(`>>> resumeOrStartPopulatingDb (${l}): offset exceeded total, ${d}/${o} contacts have been ingested`,{contactsCount:d,apiTotal:o,nextOffset:h});break}const p=await t.getExternalContacts({limit:a,start:h});console.log(`>>> resumeOrStartPopulatingDb (${l}), called getExternalContacts: `,{limit:a,start:h},p),await e.addContacts(p.contacts),console.log(`>>> resumeOrStartPopulatingDb (${l}), added contacts to repo`),await e.updateNextOffset(h+a)}console.log(">>> resumeOrStartPopulatingDb: OVER")}function H(){const e=i.useRef(!1),[t,a]=i.useState(!1);return i.useEffect(()=>{e.current||(e.current=!0,R().then(()=>{a(!0)}))},[]),t}function z({search:e,start:t,limit:a}){return y(async()=>({...await j().queryContacts({search:e,start:t,limit:a}),search:e}),[e,t,a],void 0)}const w=i.createContext({setMaxPage:()=>{}}),I=i.memo(({queryResults:e,searchTerm:t,page:a})=>{const o=(a-1)*g+1,s=Math.min(o+e.contacts.length-1,e.totalContacts),r=Math.ceil(e.totalContacts/g),{setMaxPage:c}=i.useContext(w);return i.useEffect(()=>{c(r)},[r,c]),n.jsx("div",{className:"contactListHeaderWrapper",children:n.jsxs("h3",{children:["Query results ",t?`matching '${t}'`:""," (",o,"...",s,"/ ",e.totalContacts,")"]})})});I.displayName="ContactListHeader";const S=i.memo(({startOffset:e,contacts:t})=>n.jsx("div",{className:"contactListTableWrapper",children:n.jsxs("table",{children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{className:"rightAlign",children:"#"}),n.jsx("th",{children:"Display Name"}),n.jsx("th",{children:"Given Name"}),n.jsx("th",{children:"Family Name"}),n.jsx("th",{children:"Company Name"}),n.jsx("th",{children:"Phone Numbers"}),n.jsx("th",{children:"Contact ID"})]},"thead")}),n.jsx("tbody",{children:t.map((a,o)=>n.jsxs("tr",{children:[n.jsx("td",{className:"rightAlign",children:e+o+1}),n.jsx("td",{children:a.displayName}),n.jsx("td",{children:a.givenName}),n.jsx("td",{children:a.familyName}),n.jsx("td",{children:a.companyName||""}),n.jsx("td",{children:a.phoneNumbers.map(s=>s.split(";")[0]).join(", ")}),n.jsx("td",{children:a.id})]},a.id))})]})}));S.displayName="ContactListTable";const g=1e3,P=i.memo(({searchTerm:e,page:t})=>{const a=(t-1)*g,o=z({search:e,start:a,limit:g});return console.log(">>> render contacts list",o,e),n.jsxs("div",{className:"contactsListWrapper",children:[o&&e===o.search?n.jsx(I,{queryResults:o,searchTerm:e,page:t}):n.jsx("h3",{children:"Loading..."}),(o==null?void 0:o.contacts)&&n.jsx(S,{contacts:o==null?void 0:o.contacts,startOffset:a})]})});P.displayName="ContactList";const v=i.memo(({onSearchChange:e,onPageChange:t,maxPage:a})=>{const[o,s]=i.useState(""),[r,c]=i.useState(1),l=b(o,300).trim(),d=b(r,300);i.useEffect(()=>{e(l)},[l,e]),i.useEffect(()=>{t(d)},[t,d]);const u=i.useCallback(p=>{s(p.target.value)},[]),h=i.useCallback(p=>{c(Number(p.target.value))},[]);return n.jsxs("div",{className:"contactSearchWrapper",children:[n.jsx("input",{placeholder:"Type here to search for contacts...",id:"searchbox",type:"text",value:o,onChange:u}),n.jsx("label",{htmlFor:"pagesizebox",children:"Page "}),n.jsx("input",{id:"pagebox",onChange:h,value:r,type:"number",min:"1",max:a})]})});v.displayName="ContactSearch";function F(){return y(async()=>{const e=await f.contacts.count(),t=await f.meta.get("lastMeta");return t?{contactsCount:e,...t}:void 0})}const E=i.memo(()=>{const e=F();return e&&n.jsxs("div",{className:"dbInfoWrapper",children:["Last update: ",n.jsx("b",{children:new Date(e.timestamp).toLocaleString()}),". Total contacts: DB: ",n.jsx("b",{children:e.contactsCount})," / API: ",n.jsx("b",{children:e.lastRetrievedApiTotal})," (",n.jsxs("span",{className:"insertionErrors",children:[e.failedContactInsertionAttempts," errors"]}),")"]})});E.displayName="DbInfo";function Z(){H();const[e,t]=i.useState(""),[a,o]=i.useState(1),[s,r]=i.useState(1),c=i.useMemo(()=>({setMaxPage:r}),[]);return n.jsxs(w.Provider,{value:c,children:[n.jsxs("section",{className:"contactsTopWrapper",children:[n.jsx(v,{onSearchChange:t,onPageChange:o,maxPage:s}),n.jsx(E,{})]}),e&&n.jsx(P,{searchTerm:e,page:a})]})}const K="0.4.2";function _(){return n.jsxs("div",{className:"mainContainer",children:[n.jsx(Z,{}),n.jsxs("span",{id:"version-tag",children:["Version: ",K]})]})}M(document.getElementById("root")).render(n.jsx(i.StrictMode,{children:n.jsx(_,{})}));
