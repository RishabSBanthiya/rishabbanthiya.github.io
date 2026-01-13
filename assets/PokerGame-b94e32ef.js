import{r,j as o}from"./index-421009aa.js";import{l as H}from"./index-d9998155.js";const M="https://rishabbanthiya-github-io.onrender.com";console.log("Poker Socket URL:",M);const K=()=>{const[t,S]=r.useState(null),[j,p]=r.useState(!1),[E,u]=r.useState(null),[I,N]=r.useState(null),[g,h]=r.useState(null),[w,y]=r.useState(null),x=r.useRef(null);r.useEffect(()=>{const n=H(M,{transports:["polling","websocket"],withCredentials:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:5});return n.on("connect",()=>{console.log("🔌 Connected to poker server"),p(!0),h(null)}),n.on("disconnect",()=>{console.log("🔌 Disconnected from poker server"),p(!1)}),n.on("connect_error",s=>{console.error("Connection error:",s),h("Failed to connect to server. Is the poker server running?"),p(!1)}),n.on("poker:room-joined",s=>{console.log("✓ Joined room:",s.config.roomId),u(s),h(null),localStorage.setItem("poker_current_room",s.config.roomId)}),n.on("poker:room-updated",s=>{console.log("↻ Room updated"),u(s)}),n.on("poker:game-state",s=>{console.log("🎲 Game state updated, phase:",s.phase),N(s),y(null)}),n.on("poker:player-action",(s,k)=>{console.log(`👤 Player action: ${s} - ${k.type}`)}),n.on("poker:round-start",s=>{console.log(`🎯 New round: ${s}`),y(null)}),n.on("poker:round-end",s=>{console.log("🏆 Round ended, winners:",s),y(s)}),n.on("poker:player-left",s=>{console.log(`👋 Player left: ${s}`)}),n.on("poker:error",s=>{console.error("❌ Poker error:",s),h(s)}),S(n),x.current=n,()=>{console.log("🔌 Cleaning up socket connection"),n.close()}},[]);const d=r.useCallback(n=>new Promise((s,k)=>{if(!t){k(new Error("Socket not connected"));return}t.emit("poker:create-room",n,v=>{v.success&&v.roomId?s(v.roomId):k(new Error(v.error||"Failed to create room"))})}),[t]),$=r.useCallback(n=>new Promise((s,k)=>{if(!t){k(new Error("Socket not connected"));return}t.emit("poker:join-room",n,v=>{v.success?s():k(new Error(v.error||"Failed to join room"))})}),[t]),C=r.useCallback(()=>{t&&(t.emit("poker:leave-room"),u(null),N(null),y(null),localStorage.removeItem("poker_current_room"))},[t]),R=r.useCallback(n=>{t&&t.emit("poker:action",n)},[t]),P=r.useCallback(()=>new Promise(n=>{if(!t){n([]);return}t.emit("poker:list-rooms",s=>{n(s)})}),[t]);return{socket:t,connected:j,currentRoom:E,gameState:I,error:g,createRoom:d,joinRoom:$,leaveRoom:C,makeAction:R,listRooms:P,winners:w}},W=({onCreateRoom:t,onJoinRoom:S,onListRooms:j,error:p})=>{const[E,u]=r.useState("menu"),[I,N]=r.useState([]),[g,h]=r.useState(""),[w,y]=r.useState(!1),[x,d]=r.useState(""),[$,C]=r.useState(""),[R,P]=r.useState(6),[n,s]=r.useState(1e3),[k,v]=r.useState(!1),[T,D]=r.useState(""),[m,e]=r.useState(""),[f,a]=r.useState(()=>localStorage.getItem("poker_player_name")||"");r.useEffect(()=>{p&&h(p)},[p]),r.useEffect(()=>{if(E==="list"){b();const i=setInterval(b,3e3);return()=>clearInterval(i)}},[E]);const b=async()=>{try{const i=await j();N(i)}catch(i){console.error("Failed to load rooms:",i)}},L=async()=>{if(!x.trim()){h("Room name is required");return}y(!0),h("");try{const i={roomName:x.trim(),password:$||void 0,maxPlayers:R,buyIn:n,smallBlind:Math.floor(n/100),bigBlind:Math.floor(n/50),isPublic:k};await t(i)}catch(i){h(i instanceof Error?i.message:"Failed to create room")}finally{y(!1)}},B=async i=>{const c=i||T;if(!c.trim()){h("Room ID is required");return}if(!f.trim()){h("Player name is required");return}y(!0),h("");try{localStorage.setItem("poker_player_name",f.trim()),await S(c.trim().toUpperCase(),m,f.trim())}catch(l){h(l instanceof Error?l.message:"Failed to join room")}finally{y(!1)}},A=()=>o.jsxs("div",{className:"poker-cli-container",children:[o.jsx("pre",{className:"poker-cli-output",children:`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         ♠♥♦♣     TERMINAL POKER ROOM     ♠♥♦♣                ║
║                   TEXAS HOLD'EM                               ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Select an option:                                            ║
║                                                               ║
║    1  - Create New Room                                       ║
║    2  - Join Private Room                                     ║
║    3  - Browse Public Rooms                                   ║
║                                                               ║
║  Type a number (1-3) and press Enter                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
${g?`
⚠️  ERROR: ${g}
`:""}
`}),o.jsxs("div",{className:"poker-cli-input-line",children:[o.jsx("span",{className:"poker-cli-prompt",children:"poker>"}),o.jsx("input",{type:"text",value:f||"",onChange:i=>{const c=i.target.value;c==="1"?u("create"):c==="2"?u("join"):c==="3"?u("list"):a(c)},onKeyDown:i=>{if(i.key==="Enter"){const c=f;c==="1"?u("create"):c==="2"?u("join"):c==="3"&&u("list"),a("")}},className:"poker-cli-input",placeholder:"Enter 1, 2, or 3",autoFocus:!0})]})]}),F=()=>o.jsxs("div",{className:"poker-cli-container",children:[o.jsx("pre",{className:"poker-cli-output",children:`
╔═══════════════════════════════════════════════════════════════╗
║                     CREATE NEW ROOM                           ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Room Name:        ${x.padEnd(43)}║
║  Password:         ${$?"****".padEnd(43):"(none)".padEnd(43)}║
║  Max Players:      ${R.toString().padEnd(43)}║
║  Buy-in:           $${n.toLocaleString().padEnd(42)}║
║  Public:           ${(k?"Yes":"No").padEnd(43)}║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║  Commands:                                                    ║
║    name <text>     - Set room name                            ║
║    pass <text>     - Set password (optional)                  ║
║    players <2-6>   - Set max players                          ║
║    buyin <amount>  - Set buy-in (500/1000/2500/5000/10000)   ║
║    public          - Toggle public/private                    ║
║    create          - Create the room                          ║
║    back            - Return to menu                           ║
╚═══════════════════════════════════════════════════════════════╝
${g?`
⚠️  ERROR: ${g}
`:""}
${w?`
⏳ Creating room...
`:""}
`}),o.jsxs("div",{className:"poker-cli-input-line",children:[o.jsx("span",{className:"poker-cli-prompt",children:"create>"}),o.jsx("input",{type:"text",onKeyDown:i=>{if(i.key==="Enter"){const c=i.currentTarget.value.trim().toLowerCase(),l=i.currentTarget.value.trim().split(" ");c==="back"?u("menu"):c==="create"?L():c==="public"?v(!k):l[0]==="name"&&l.length>1?d(l.slice(1).join(" ")):l[0]==="pass"&&l.length>1?C(l.slice(1).join(" ")):l[0]==="players"?P(Math.min(6,Math.max(2,parseInt(l[1])||6))):l[0]==="buyin"&&s(parseInt(l[1])||1e3),i.currentTarget.value=""}},className:"poker-cli-input",placeholder:"Enter command (e.g., 'name My Room', 'create')",autoFocus:!0,disabled:w})]})]}),_=()=>o.jsxs("div",{className:"poker-cli-container",children:[o.jsx("pre",{className:"poker-cli-output",children:`
╔═══════════════════════════════════════════════════════════════╗
║                      JOIN ROOM                                ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Your Name:        ${f.padEnd(43)}║
║  Room ID:          ${T.padEnd(43)}║
║  Password:         ${m?"****".padEnd(43):"(none)".padEnd(43)}║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║  Commands:                                                    ║
║    name <text>     - Set your player name                     ║
║    room <id>       - Set room ID (e.g., HST-A4F9)             ║
║    pass <text>     - Set password (if required)               ║
║    join            - Join the room                            ║
║    back            - Return to menu                           ║
╚═══════════════════════════════════════════════════════════════╝
${g?`
⚠️  ERROR: ${g}
`:""}
${w?`
⏳ Joining room...
`:""}
`}),o.jsxs("div",{className:"poker-cli-input-line",children:[o.jsx("span",{className:"poker-cli-prompt",children:"join>"}),o.jsx("input",{type:"text",onKeyDown:i=>{if(i.key==="Enter"){const c=i.currentTarget.value.trim().toLowerCase(),l=i.currentTarget.value.trim().split(" ");c==="back"?u("menu"):c==="join"?B():l[0]==="name"&&l.length>1?a(l.slice(1).join(" ")):l[0]==="room"&&l.length>1?D(l[1].toUpperCase()):l[0]==="pass"&&l.length>1&&e(l.slice(1).join(" ")),i.currentTarget.value=""}},className:"poker-cli-input",placeholder:"Enter command (e.g., 'room HST-A4F9', 'join')",autoFocus:!0,disabled:w})]})]}),U=()=>{let i=`
╔═══════════════════════════════════════════════════════════════╗
║                     PUBLIC ROOMS                              ║
╠═══════════════════════════════════════════════════════════════╣
`;return I.length===0?i+=`║                                                               ║
║         No public rooms available.                            ║
║         Create one to start playing!                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

Commands: back, refresh`:(i+=`║  ID          Room Name         Players  Buy-in   Status      ║
╟───────────────────────────────────────────────────────────────╢
`,I.forEach(c=>{const l=c.roomId.padEnd(12),O=(c.roomName+(c.hasPassword?" 🔒":"")).padEnd(18),J=`${c.currentPlayers}/${c.maxPlayers}`.padEnd(8),q=`$${c.buyIn.toLocaleString()}`.padEnd(9),Y=c.status.padEnd(12);i+=`║  ${l} ${O} ${J} ${q}${Y}║
`}),i+=`╚═══════════════════════════════════════════════════════════════╝

Commands:
  join <room-id>  - Join a room (e.g., 'join PUB-A4F9')
  refresh         - Refresh room list
  back            - Return to menu`),o.jsxs("div",{className:"poker-cli-container",children:[o.jsx("pre",{className:"poker-cli-output",children:i}),o.jsxs("div",{className:"poker-cli-input-line",children:[o.jsx("span",{className:"poker-cli-prompt",children:"rooms>"}),o.jsx("input",{type:"text",onKeyDown:c=>{if(c.key==="Enter"){const l=c.currentTarget.value.trim().toLowerCase(),O=c.currentTarget.value.trim().split(" ");l==="back"?u("menu"):l==="refresh"?b():O[0]==="join"&&O.length>1&&(D(O[1].toUpperCase()),u("join")),c.currentTarget.value=""}},className:"poker-cli-input",placeholder:"Enter command (e.g., 'join PUB-A4F9', 'refresh')",autoFocus:!0})]})]})};return o.jsxs("div",{className:"poker-lobby",children:[E==="menu"&&A(),E==="create"&&F(),E==="join"&&_(),E==="list"&&U()]})},G=({gameState:t,myPlayerId:S,winners:j,onAction:p,onLeaveRoom:E,roomName:u,roomId:I})=>{var m;const[N,g]=r.useState(""),[h,w]=r.useState([]),y=r.useRef(null),x=r.useRef(null);if(r.useEffect(()=>{x.current&&(x.current.scrollTop=x.current.scrollHeight)},[t,j]),r.useEffect(()=>{var e;(e=y.current)==null||e.focus()},[]),!t)return o.jsxs("div",{className:"poker-cli-container",children:[o.jsx("pre",{className:"poker-cli-output",children:`
╔════════════════════════════════════════════════════════════════╗
║                    🃏  ${u.padEnd(42)}║
║                    Room ID: ${I.padEnd(35)}║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║              Waiting for game to start...                     ║
║              Need at least 2 players                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

Type 'quit' to leave room
`}),o.jsxs("div",{className:"poker-cli-input-line",children:[o.jsx("span",{className:"poker-cli-prompt",children:"poker>"}),o.jsx("input",{ref:y,type:"text",value:N,onChange:e=>g(e.target.value),onKeyDown:e=>{e.key==="Enter"&&N.trim().toLowerCase()==="quit"&&E()},className:"poker-cli-input",autoFocus:!0})]})]});const d=t.players.find(e=>e.id===S),$=t.players.filter(e=>e.id!==S),C=((m=t.players[t.currentPlayerIndex])==null?void 0:m.id)===S,R=t.players[t.currentPlayerIndex],P=e=>{const f=e.rank.padEnd(2),a=e.suit;return`[${f}${a}]`},n=()=>"[##]",s=d?d.currentBet===t.currentBet:!1,k=d?t.currentBet-d.currentBet:0,v=t.currentBet*2,T=e=>{const a=e.trim().toLowerCase().split(" "),b=a[0];if(w([...h,e]),b==="quit"||b==="exit"||b==="leave"){E();return}if(C){switch(b){case"fold":case"f":p({type:"fold"});break;case"check":case"ch":s&&p({type:"check"});break;case"call":case"c":k>0&&p({type:"call",amount:k});break;case"raise":case"r":const L=parseInt(a[1]);L&&L>=v&&p({type:"raise",amount:L});break;case"allin":case"all-in":case"a":d&&p({type:"all-in",amount:d.chips});break}g("")}},D=()=>{let e=`
`;e+=`╔════════════════════════════════════════════════════════════════╗
`,e+=`║  🃏  TEXAS HOLD'EM - ${u.padEnd(42)}║
`,e+=`║  Room: ${I.padEnd(49)}POT: $${t.pot.toString().padStart(5)} ║
`,e+=`╠════════════════════════════════════════════════════════════════╣

`,j&&j.length>0&&(e+=`╔════════════════════════════════════════════════════════════════╗
`,e+=`║                        🏆 WINNER(S) 🏆                          ║
`,e+=`╠════════════════════════════════════════════════════════════════╣
`,j.forEach(a=>{e+=`║  ${a.playerName.padEnd(20)} ${a.hand.name.padEnd(20)} +$${a.amount.toString().padStart(6)} ║
`}),e+=`╚════════════════════════════════════════════════════════════════╝

`),e+=`  COMMUNITY CARDS [${t.phase.toUpperCase().padEnd(8)}]  POT: $${t.pot}
`,e+=`  ┌─────────────────────────────────────────────────┐
`,e+="  │  ";const f=["preflop","waiting"].includes(t.phase)?0:t.phase==="flop"?3:t.phase==="turn"?4:5;for(let a=0;a<5;a++)a<f&&t.communityCards[a]?e+=P(t.communityCards[a])+" ":e+="[  ??  ] ";if(e+=`│
`,e+=`  └─────────────────────────────────────────────────┘

`,$.length>0&&(e+=`  OPPONENTS:
`,$.forEach(a=>{const b=a.position==="dealer"?"[D]":a.position==="small-blind"?"[SB]":a.position==="big-blind"?"[BB]":"[P]",L=(R==null?void 0:R.id)===a.id?" ← TURN":"",B=a.folded?" [FOLDED]":a.allIn?" [ALL-IN]":"";e+=`  ${b} ${a.name.padEnd(15)} $${a.chips.toString().padStart(5)} | Bet: $${a.currentBet.toString().padStart(4)}${B}${L}
`,a.folded||(e+=`      Cards: ${n()} ${n()}`,a.lastAction&&(e+=`  Last: ${a.lastAction}`),e+=`
`)}),e+=`
`),d){e+=`╔════════════════════════════════════════════════════════════════╗
`,e+=`║  YOUR HAND${" ".repeat(53)}║
`,e+=`╠════════════════════════════════════════════════════════════════╣
`;const a=d.position==="dealer"?"DEALER":d.position==="small-blind"?"SMALL BLIND":d.position==="big-blind"?"BIG BLIND":"PLAYER";e+=`║  Position: ${a.padEnd(20)} Chips: $${d.chips.toString().padStart(10)}        ║
`,e+=`║  Current Bet: $${d.currentBet.toString().padStart(10)}                                    ║
`,e+=`║                                                                ║
`,e+="║  Cards:  ",d.cards.forEach(b=>{e+=`${P(b)} `}),e+=`${" ".repeat(41)}║
`,e+=`╚════════════════════════════════════════════════════════════════╝

`,C&&!d.folded&&t.phase!=="showdown"?(e+=`  YOUR TURN! Available commands:
`,e+=`  ┌──────────────────────────────────────────────────────┐
`,e+=`  │  fold           - Fold your hand                    │
`,s?e+=`  │  check          - Check (no bet)                    │
`:e+=`  │  call           - Call $${k.toString().padStart(4)}                          │
`,e+=`  │  raise <amt>    - Raise to <amt> (min: $${v.toString().padStart(4)})      │
`,e+=`  │  allin          - Go all-in ($${d.chips.toString().padStart(4)})                 │
`,e+=`  │  quit           - Leave game                         │
`,e+=`  └──────────────────────────────────────────────────────┘
`):!C&&!d.folded?e+=`  Waiting for ${R==null?void 0:R.name}...
`:d.folded&&(e+=`  You folded this hand. Waiting for next hand...
`)}return e};return o.jsxs("div",{className:"poker-cli-container",children:[o.jsx("div",{className:"poker-cli-output",ref:x,children:o.jsx("pre",{children:D()})}),o.jsxs("div",{className:"poker-cli-input-line",children:[o.jsx("span",{className:"poker-cli-prompt",children:"poker>"}),o.jsx("input",{ref:y,type:"text",value:N,onChange:e=>g(e.target.value),onKeyDown:e=>{e.key==="Enter"&&T(N)},className:"poker-cli-input",placeholder:C?"Enter command (e.g., 'call', 'raise 100', 'fold')":"Type 'quit' to leave",autoFocus:!0})]})]})},V=({onClose:t})=>{const{socket:S,connected:j,currentRoom:p,gameState:E,error:u,createRoom:I,joinRoom:N,leaveRoom:g,makeAction:h,listRooms:w,winners:y}=K(),[x,d]=r.useState({x:50,y:50}),[$,C]=r.useState(!1),[R,P]=r.useState({x:0,y:0}),n=r.useRef(null);r.useEffect(()=>{const m=localStorage.getItem("poker_current_room"),e=localStorage.getItem("poker_player_name");m&&e&&j&&!p&&(console.log("🔄 Attempting to rejoin room:",m),N({roomId:m,playerName:e,password:void 0}).catch(f=>{console.log("Could not rejoin previous room:",f.message),localStorage.removeItem("poker_current_room")}))},[j]);const s=m=>{n.current&&n.current.contains(m.target)&&(C(!0),P({x:m.clientX-x.x,y:m.clientY-x.y}))};r.useEffect(()=>{const m=f=>{$&&d({x:f.clientX-R.x,y:f.clientY-R.y})},e=()=>{C(!1)};return $&&(document.addEventListener("mousemove",m),document.addEventListener("mouseup",e)),()=>{document.removeEventListener("mousemove",m),document.removeEventListener("mouseup",e)}},[$,R]);const k=async m=>{try{await I(m)}catch(e){throw e}},v=async(m,e,f)=>{try{await N({roomId:m,password:e||void 0,playerName:f})}catch(a){throw a}},T=()=>{g()},D=()=>{p&&g(),t()};return j?o.jsx("div",{className:"poker-game-overlay",children:o.jsxs("div",{className:`poker-game-container ${$?"dragging":""}`,style:{transform:`translate(${x.x}px, ${x.y}px)`},onMouseDown:s,children:[o.jsxs("div",{className:"poker-game-header",ref:n,children:[o.jsxs("div",{className:"poker-terminal-buttons",children:[o.jsx("span",{className:"poker-terminal-button close",onClick:D}),o.jsx("span",{className:"poker-terminal-button minimize"}),o.jsx("span",{className:"poker-terminal-button maximize"})]}),o.jsx("h2",{children:"poker@terminal:~$"})]}),o.jsx("div",{className:"poker-game-content",children:p?o.jsx(G,{gameState:E,myPlayerId:(S==null?void 0:S.id)||"",winners:y,onAction:h,onLeaveRoom:T,roomName:p.config.roomName,roomId:p.config.roomId}):o.jsx(W,{onCreateRoom:k,onJoinRoom:v,onListRooms:w,error:u})})]})}):o.jsx("div",{className:"poker-game-wrapper",children:o.jsxs("div",{className:"poker-connecting",children:[o.jsx("h3",{children:"Connecting to Poker Server..."}),u&&o.jsxs("div",{className:"poker-error",children:[o.jsx("p",{children:u}),o.jsxs("p",{className:"poker-help-text",children:["Make sure the poker server is running on port 3001.",o.jsx("br",{}),"Run: ",o.jsx("code",{children:"cd server && npm run dev"})]})]}),o.jsx("button",{className:"poker-btn-secondary",onClick:t,children:"Back to Terminal"})]})})};export{V as PokerGame};
