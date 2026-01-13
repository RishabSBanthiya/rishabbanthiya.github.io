import{r as t,j as e}from"./index-421009aa.js";import{l as K}from"./index-d9998155.js";const _="https://rishabbanthiya-github-io.onrender.com",U=()=>{const[s,b]=t.useState(null),[i,k]=t.useState(!1),[j,d]=t.useState(null),[S,N]=t.useState(null),[v,p]=t.useState(null),[y,g]=t.useState(null),C=t.useRef(null);t.useEffect(()=>{const r=K(_,{transports:["polling","websocket"],withCredentials:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:5});return r.on("connect",()=>{console.log("🔌 Connected to BS Poker server"),k(!0),p(null)}),r.on("disconnect",()=>{console.log("🔌 Disconnected from BS Poker server"),k(!1)}),r.on("connect_error",n=>{console.error("Connection error:",n),p("Failed to connect to server. Is the poker server running?"),k(!1)}),r.on("bspoker:room-joined",n=>{console.log("✓ Joined BS Poker room:",n.config.roomId),d(n),p(null),localStorage.setItem("bspoker_current_room",n.config.roomId)}),r.on("bspoker:room-updated",n=>{console.log("↻ BS Poker room updated"),d(n)}),r.on("bspoker:game-state",n=>{console.log("🎲 BS Poker game state updated, phase:",n.phase),N(n),g(null)}),r.on("bspoker:player-action",(n,m)=>{console.log(`👤 Player action: ${n} - ${m.type}`)}),r.on("bspoker:round-end",n=>{console.log("🏆 Round ended:",n),g(n)}),r.on("bspoker:game-finished",()=>{console.log("🎮 Game finished!")}),r.on("bspoker:player-left",n=>{console.log(`👋 Player left: ${n}`)}),r.on("bspoker:error",n=>{console.error("❌ BS Poker error:",n),p(n)}),b(r),C.current=r,()=>{console.log("🔌 Cleaning up BS Poker socket connection"),r.close()}},[]);const T=t.useCallback(r=>new Promise((n,m)=>{if(!s){m(new Error("Socket not connected"));return}s.emit("bspoker:create-room",r,f=>{f.success&&f.roomId?n(f.roomId):m(new Error(f.error||"Failed to create room"))})}),[s]),E=t.useCallback(r=>new Promise((n,m)=>{if(!s){m(new Error("Socket not connected"));return}s.emit("bspoker:join-room",r,f=>{f.success?n():m(new Error(f.error||"Failed to join room"))})}),[s]),O=t.useCallback(()=>{s&&(s.emit("bspoker:leave-room"),d(null),N(null),g(null),localStorage.removeItem("bspoker_current_room"))},[s]),$=t.useCallback(()=>{s&&s.emit("bspoker:start-game")},[s]),w=t.useCallback(()=>{s&&(s.emit("bspoker:next-round"),g(null))},[s]),o=t.useCallback(r=>{s&&s.emit("bspoker:action",r)},[s]),c=t.useCallback(()=>new Promise(r=>{if(!s){r([]);return}s.emit("bspoker:list-rooms",n=>{r(n)})}),[s]);return{socket:s,connected:i,currentRoom:j,gameState:S,error:v,createRoom:T,joinRoom:E,leaveRoom:O,makeAction:o,startGame:$,nextRound:w,listRooms:c,roundResult:y}},J=({onCreateRoom:s,onJoinRoom:b,onListRooms:i,error:k})=>{const[j,d]=t.useState("menu"),[S,N]=t.useState([]),[v,p]=t.useState(""),[y,g]=t.useState(!1),[C,T]=t.useState(""),[E,O]=t.useState(""),[$,w]=t.useState(6),[o,c]=t.useState(!1),[r,n]=t.useState(""),[m,f]=t.useState(""),[x,P]=t.useState(()=>localStorage.getItem("bspoker_player_name")||"");t.useEffect(()=>{k&&p(k)},[k]),t.useEffect(()=>{if(j==="list"){h();const a=setInterval(h,3e3);return()=>clearInterval(a)}},[j]);const h=async()=>{try{const a=await i();N(a)}catch(a){console.error("Failed to load rooms:",a)}},R=async()=>{if(!C.trim()){p("Room name is required");return}g(!0),p("");try{const a={roomName:C.trim(),password:E||void 0,maxPlayers:$,isPublic:o};await s(a)}catch(a){p(a instanceof Error?a.message:"Failed to create room")}finally{g(!1)}},I=async a=>{const l=a||r;if(!l.trim()){p("Room ID is required");return}if(!x.trim()){p("Player name is required");return}g(!0),p("");try{localStorage.setItem("bspoker_player_name",x.trim()),await b(l.trim().toUpperCase(),m,x.trim())}catch(u){p(u instanceof Error?u.message:"Failed to join room")}finally{g(!1)}},B=()=>e.jsxs("div",{className:"poker-cli-container",children:[e.jsx("pre",{className:"poker-cli-output",children:`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         ♠♥♦♣     BS POKER (LIAR'S POKER)     ♠♥♦♣            ║
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
${v?`
⚠️  ERROR: ${v}
`:""}
`}),e.jsxs("div",{className:"poker-cli-input-line",children:[e.jsx("span",{className:"poker-cli-prompt",children:"bspoker>"}),e.jsx("input",{type:"text",value:x||"",onChange:a=>{const l=a.target.value;l==="1"?d("create"):l==="2"?d("join"):l==="3"?d("list"):P(l)},onKeyDown:a=>{if(a.key==="Enter"){const l=x;l==="1"?d("create"):l==="2"?d("join"):l==="3"&&d("list"),P("")}},className:"poker-cli-input",placeholder:"Enter 1, 2, or 3",autoFocus:!0})]})]}),D=()=>e.jsxs("div",{className:"poker-cli-container",children:[e.jsx("pre",{className:"poker-cli-output",children:`
╔═══════════════════════════════════════════════════════════════╗
║                     CREATE NEW ROOM                           ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Room Name:        ${C.padEnd(43)}║
║  Password:         ${E?"****".padEnd(43):"(none)".padEnd(43)}║
║  Max Players:      ${$.toString().padEnd(43)}║
║  Public:           ${(o?"Yes":"No").padEnd(43)}║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║  Commands:                                                    ║
║    name <text>     - Set room name                            ║
║    pass <text>     - Set password (optional)                  ║
║    players <2-8>   - Set max players                          ║
║    public          - Toggle public/private                    ║
║    create          - Create the room                          ║
║    back            - Return to menu                           ║
╚═══════════════════════════════════════════════════════════════╝
${v?`
⚠️  ERROR: ${v}
`:""}
${y?`
⏳ Creating room...
`:""}
`}),e.jsxs("div",{className:"poker-cli-input-line",children:[e.jsx("span",{className:"poker-cli-prompt",children:"create>"}),e.jsx("input",{type:"text",onKeyDown:a=>{if(a.key==="Enter"){const l=a.currentTarget.value.trim().toLowerCase(),u=a.currentTarget.value.trim().split(" ");l==="back"?d("menu"):l==="create"?R():l==="public"?c(!o):u[0]==="name"&&u.length>1?T(u.slice(1).join(" ")):u[0]==="pass"&&u.length>1?O(u.slice(1).join(" ")):u[0]==="players"&&w(Math.min(8,Math.max(2,parseInt(u[1])||6))),a.currentTarget.value=""}},className:"poker-cli-input",placeholder:"Enter command (e.g., 'name My Room', 'create')",autoFocus:!0,disabled:y})]})]}),F=()=>e.jsxs("div",{className:"poker-cli-container",children:[e.jsx("pre",{className:"poker-cli-output",children:`
╔═══════════════════════════════════════════════════════════════╗
║                      JOIN ROOM                                ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Your Name:        ${x.padEnd(43)}║
║  Room ID:          ${r.padEnd(43)}║
║  Password:         ${m?"****".padEnd(43):"(none)".padEnd(43)}║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║  Commands:                                                    ║
║    name <text>     - Set your player name                     ║
║    room <id>       - Set room ID (e.g., BSP-A4F9)             ║
║    pass <text>     - Set password (if required)               ║
║    join            - Join the room                            ║
║    back            - Return to menu                           ║
╚═══════════════════════════════════════════════════════════════╝
${v?`
⚠️  ERROR: ${v}
`:""}
${y?`
⏳ Joining room...
`:""}
`}),e.jsxs("div",{className:"poker-cli-input-line",children:[e.jsx("span",{className:"poker-cli-prompt",children:"join>"}),e.jsx("input",{type:"text",onKeyDown:a=>{if(a.key==="Enter"){const l=a.currentTarget.value.trim().toLowerCase(),u=a.currentTarget.value.trim().split(" ");l==="back"?d("menu"):l==="join"?I():u[0]==="name"&&u.length>1?P(u.slice(1).join(" ")):u[0]==="room"&&u.length>1?n(u[1].toUpperCase()):u[0]==="pass"&&u.length>1&&f(u.slice(1).join(" ")),a.currentTarget.value=""}},className:"poker-cli-input",placeholder:"Enter command (e.g., 'room BSP-A4F9', 'join')",autoFocus:!0,disabled:y})]})]}),M=()=>{let a=`
╔═══════════════════════════════════════════════════════════════╗
║                     PUBLIC ROOMS                              ║
╠═══════════════════════════════════════════════════════════════╣
`;return S.length===0?a+=`║                                                               ║
║         No public rooms available.                            ║
║         Create one to start playing!                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

Commands: back, refresh`:(a+=`║  ID          Room Name         Players      Status          ║
╟───────────────────────────────────────────────────────────────╢
`,S.forEach(l=>{const u=l.roomId.padEnd(12),L=(l.roomName+(l.hasPassword?" 🔒":"")).padEnd(18),A=`${l.currentPlayers}/${l.maxPlayers}`.padEnd(12),G=l.status.padEnd(16);a+=`║  ${u} ${L} ${A}${G}║
`}),a+=`╚═══════════════════════════════════════════════════════════════╝

Commands:
  join <room-id>  - Join a room (e.g., 'join BSP-A4F9')
  refresh         - Refresh room list
  back            - Return to menu`),e.jsxs("div",{className:"poker-cli-container",children:[e.jsx("pre",{className:"poker-cli-output",children:a}),e.jsxs("div",{className:"poker-cli-input-line",children:[e.jsx("span",{className:"poker-cli-prompt",children:"rooms>"}),e.jsx("input",{type:"text",onKeyDown:l=>{if(l.key==="Enter"){const u=l.currentTarget.value.trim().toLowerCase(),L=l.currentTarget.value.trim().split(" ");u==="back"?d("menu"):u==="refresh"?h():L[0]==="join"&&L.length>1&&(n(L[1].toUpperCase()),d("join")),l.currentTarget.value=""}},className:"poker-cli-input",placeholder:"Enter command (e.g., 'join BSP-A4F9', 'refresh')",autoFocus:!0})]})]})};return e.jsxs("div",{className:"poker-lobby",children:[j==="menu"&&B(),j==="create"&&D(),j==="join"&&F(),j==="list"&&M()]})},Y=[{value:"high-card",label:"High Card"},{value:"pair",label:"Pair"},{value:"two-pair",label:"Two Pair"},{value:"three-of-a-kind",label:"Three of a Kind"},{value:"straight",label:"Straight"},{value:"flush",label:"Flush"},{value:"full-house",label:"Full House"},{value:"four-of-a-kind",label:"Four of a Kind"},{value:"straight-flush",label:"Straight Flush"}],H=({gameState:s,myPlayerId:b,roundResult:i,onAction:k,onStartGame:j,onNextRound:d,onLeaveRoom:S,roomName:N,roomId:v})=>{if(!s)return e.jsxs("div",{className:"poker-cli-container",children:[e.jsx("pre",{className:"poker-cli-output",children:`
╔═══════════════════════════════════════════════════════════════╗
║                   BS POKER - WAITING                          ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Room: ${N.padEnd(56)}║
║  ID:   ${v.padEnd(56)}║
║                                                               ║
║  Players: 0                                                   ║
║                                                               ║
║  Waiting for game to start...                                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`}),e.jsxs("div",{className:"poker-cli-input-line",children:[e.jsx("span",{className:"poker-cli-prompt",children:"game>"}),e.jsx("input",{type:"text",onKeyDown:o=>{if(o.key==="Enter"){const c=o.currentTarget.value.trim().toLowerCase();c==="start"?j():c==="leave"&&S(),o.currentTarget.value=""}},className:"poker-cli-input",placeholder:"Commands: start, leave",autoFocus:!0})]})]});const p=s.players.find(o=>o.id===b),y=s.players[s.currentPlayerIndex],g=(y==null?void 0:y.id)===b,C=o=>`[${o.rank}${o.suit}]`,T=()=>p?p.cards.map(C).join(" "):"",E=()=>{if(s.phase!=="reveal"&&s.phase!=="round-end")return"";let o=`

╔═══════════════════════════════════════════════════════════════╗
`;return o+=`║                    ALL CARDS REVEALED                         ║
`,o+=`╠═══════════════════════════════════════════════════════════════╣
`,s.players.forEach(c=>{const r=c.name.padEnd(15),n=c.cards.map(C).join(" ");o+=`║  ${r}: ${n.padEnd(41)}║
`}),o+=`╚═══════════════════════════════════════════════════════════════╝
`,o},O=()=>{var r,n;if(!i)return"";let o=`
╔═══════════════════════════════════════════════════════════════╗
`;o+=`║                      ROUND RESULT                             ║
`,o+=`╠═══════════════════════════════════════════════════════════════╣
`,o+=`║  Guesser:  ${i.guesserPlayerName.padEnd(50)}║
`,o+=`║  Guess:    ${i.guess.description.padEnd(50)}║
`,o+=`║  Caller:   ${i.callerPlayerName.padEnd(50)}║
`,o+=`║                                                               ║
`,i.wasSuccessful?o+=`║  ✓ The hand EXISTS! ${i.callerPlayerName} loses!${" ".repeat(Math.max(0,31-i.callerPlayerName.length))}║
`:o+=`║  ✗ The hand does NOT exist! ${i.guesserPlayerName} loses!${" ".repeat(Math.max(0,24-i.guesserPlayerName.length))}║
`,o+=`║                                                               ║
`,o+=`║  ${i.loserName} now has ${i.wasSuccessful?((r=s.players.find(m=>m.id===i.loserId))==null?void 0:r.cardCount)||0:((n=s.players.find(m=>m.id===i.loserId))==null?void 0:n.cardCount)||0} cards.${" ".repeat(Math.max(0,35-i.loserName.length))}║
`;const c=s.players.find(m=>m.id===i.loserId);return c&&c.hasLost&&(o+=`║                                                               ║
`,o+=`║  💀 ${i.loserName} is OUT OF THE GAME!${" ".repeat(Math.max(0,38-i.loserName.length))}║
`),o+=`╚═══════════════════════════════════════════════════════════════╝
`,o},$=()=>{k({type:"bullshit"})};if(i){const o=`
╔═══════════════════════════════════════════════════════════════╗
║                    BS POKER - ROUND ${s.roundNumber.toString().padStart(2,"0")}                       ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Room: ${N.padEnd(56)}║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

Players:
${s.players.map(c=>{const r=c.hasLost?"💀":c.id===b?"👤":"  ",n=c.name.padEnd(15),m=`(${c.cardCount} cards)`;return`  ${r} ${n} ${m}`}).join(`
`)}
${E()}
${O()}
`;return e.jsxs("div",{className:"poker-cli-container",children:[e.jsx("pre",{className:"poker-cli-output",children:o}),e.jsxs("div",{className:"poker-cli-input-line",children:[e.jsx("span",{className:"poker-cli-prompt",children:"result>"}),e.jsx("input",{type:"text",onKeyDown:c=>{if(c.key==="Enter"){const r=c.currentTarget.value.trim().toLowerCase();r==="next"||r==="continue"?d():r==="leave"&&S(),c.currentTarget.value=""}},className:"poker-cli-input",placeholder:"Commands: next, leave",autoFocus:!0})]})]})}const w=`
╔═══════════════════════════════════════════════════════════════╗
║                    BS POKER - ROUND ${s.roundNumber.toString().padStart(2,"0")}                       ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Room: ${N.padEnd(56)}║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

Your Cards: ${T()}

Players:
${s.players.map(o=>{const r=o.id===y.id?"▶":" ",n=o.hasLost?"💀":o.id===b?"👤":"  ",m=o.name.padEnd(15),f=`(${o.cardCount} cards)`,x=o.lastAction||"";return`${r} ${n} ${m} ${f} ${x}`}).join(`
`)}

Current Guess: ${s.currentGuess?s.currentGuess.description:"None"}
${s.guessHistory.length>0?`
Recent Guesses:
${s.guessHistory.slice(-3).reverse().map(o=>`  ${o.playerName}: ${o.guess.description}`).join(`
`)}
`:""}
${g?`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR TURN!

Type your guess:
  guess <type> <rank>
  Examples:
    - guess pair K
    - guess flush
    - guess straight
    - guess three-of-a-kind A
  
Or call bullshit:
  bs
  
Leave game:
  leave
`:`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Waiting for ${y.name}...

${s.currentGuess?"You can call bullshit by typing: bs":""}
Commands: leave
`}
`;return e.jsxs("div",{className:"poker-cli-container",children:[e.jsx("pre",{className:"poker-cli-output",children:w}),e.jsxs("div",{className:"poker-cli-input-line",children:[e.jsx("span",{className:"poker-cli-prompt",children:"game>"}),e.jsx("input",{type:"text",onKeyDown:o=>{var c;if(o.key==="Enter"){const r=o.currentTarget.value.trim().toLowerCase(),n=r.split(" ");if(r==="leave")S();else if(r==="bs"||r==="bullshit")s.currentGuess&&$();else if(n[0]==="guess"&&n.length>=2){const m=n[1],f=((c=n[2])==null?void 0:c.toUpperCase())||"K",x=Y.find(P=>P.value===m||P.label.toLowerCase().replace(/\s/g,"-")===m);if(x&&g){const P={type:x.value,rank:f,description:`${x.label}${f?" of "+f+"s":""}`};k({type:"guess",guess:P})}}o.currentTarget.value=""}},className:"poker-cli-input",placeholder:g?"guess <type> <rank> or 'bs'":"Type 'bs' or 'leave'",autoFocus:!0,disabled:!g&&!s.currentGuess})]})]})},X=({onClose:s})=>{const{socket:b,connected:i,currentRoom:k,gameState:j,error:d,createRoom:S,joinRoom:N,leaveRoom:v,makeAction:p,startGame:y,nextRound:g,listRooms:C,roundResult:T}=U(),[E,O]=t.useState({x:50,y:50}),[$,w]=t.useState(!1),[o,c]=t.useState({x:0,y:0}),r=t.useRef(null);t.useEffect(()=>{const h=localStorage.getItem("bspoker_current_room"),R=localStorage.getItem("bspoker_player_name");h&&R&&i&&!k&&(console.log("🔄 Attempting to rejoin BS Poker room:",h),N({roomId:h,playerName:R,password:void 0}).catch(I=>{console.log("Could not rejoin previous room:",I.message),localStorage.removeItem("bspoker_current_room")}))},[i]);const n=h=>{r.current&&r.current.contains(h.target)&&(w(!0),c({x:h.clientX-E.x,y:h.clientY-E.y}))};t.useEffect(()=>{const h=I=>{$&&O({x:I.clientX-o.x,y:I.clientY-o.y})},R=()=>{w(!1)};return $&&(document.addEventListener("mousemove",h),document.addEventListener("mouseup",R)),()=>{document.removeEventListener("mousemove",h),document.removeEventListener("mouseup",R)}},[$,o]);const m=async h=>{try{await S(h)}catch(R){throw R}},f=async(h,R,I)=>{try{await N({roomId:h,password:R||void 0,playerName:I})}catch(B){throw B}},x=()=>{v()},P=()=>{k&&v(),s()};return i?e.jsx("div",{className:"poker-game-overlay",children:e.jsxs("div",{className:`poker-game-container ${$?"dragging":""}`,style:{transform:`translate(${E.x}px, ${E.y}px)`},onMouseDown:n,children:[e.jsxs("div",{className:"poker-game-header",ref:r,children:[e.jsxs("div",{className:"poker-terminal-buttons",children:[e.jsx("span",{className:"poker-terminal-button close",onClick:P}),e.jsx("span",{className:"poker-terminal-button minimize"}),e.jsx("span",{className:"poker-terminal-button maximize"})]}),e.jsx("h2",{children:"bspoker@terminal:~$"})]}),e.jsx("div",{className:"poker-game-content",children:k?e.jsx(H,{gameState:j,myPlayerId:(b==null?void 0:b.id)||"",roundResult:T,onAction:p,onStartGame:y,onNextRound:g,onLeaveRoom:x,roomName:k.config.roomName,roomId:k.config.roomId}):e.jsx(J,{onCreateRoom:m,onJoinRoom:f,onListRooms:C,error:d})})]})}):e.jsx("div",{className:"poker-game-wrapper",children:e.jsxs("div",{className:"poker-connecting",children:[e.jsx("h3",{children:"Connecting to BS Poker Server..."}),d&&e.jsxs("div",{className:"poker-error",children:[e.jsx("p",{children:d}),e.jsxs("p",{className:"poker-help-text",children:["Make sure the poker server is running on port 3001.",e.jsx("br",{}),"Run: ",e.jsx("code",{children:"cd server && npm run dev"})]})]}),e.jsx("button",{className:"poker-btn-secondary",onClick:s,children:"Back to Terminal"})]})})};export{X as BSPokerGame};
