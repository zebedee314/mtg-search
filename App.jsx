import React from 'react';

const App = () => {
  return (
    <div>
      <h1>MTG Collection Hunter</h1>
      {import { useState, useCallback } from "react";

const MISSING_DICE = [
  { set: "Apocalypse",  color: "white" },
  { set: "Apocalypse",  color: "blue"  },
  { set: "Odyssey",     color: "green" },
  { set: "Torment",     color: "green" },
  { set: "Judgment",    color: "white" },
  { set: "Onslaught",   color: "blue"  },
  { set: "Onslaught",   color: "black" },
  { set: "Onslaught",   color: "red"   },
  { set: "Onslaught",   color: "green" },
  { set: "Scourge",     color: "red"   },
  { set: "Scourge",     color: "green" },
  { set: "Mirrodin",    color: "blue"  },
  { set: "Eventide",    color: "red"   },
];

const MISSING_CARDS = [
  { name: "Murkfiend Liege", set: "Eventide", year: 2008, colors: "Blue/Green" },
  { name: "Mindwrack Liege", set: "Eventide", year: 2008, colors: "Blue/Black" },
];

const DIE_SITES = [
  { id: "ebay",             label: "eBay" },
  { id: "tcgplayer",        label: "TCGPlayer" },
  { id: "cardtrader",       label: "Card Trader" },
  { id: "reddit",           label: "Reddit" },
  { id: "magiclibrarities", label: "Magic Librarities" },
  { id: "cardmarket",       label: "Cardmarket" },
  { id: "google",           label: "Google (whole web)" },
];

const CARD_SITES = [
  { id: "ebay",       label: "eBay" },
  { id: "tcgplayer",  label: "TCGPlayer" },
  { id: "cardmarket", label: "Cardmarket" },
  { id: "cardtrader", label: "Card Trader" },
  { id: "reddit",     label: "Reddit" },
  { id: "google",     label: "Google (whole web)" },
];

const COLOR_STYLES = {
  white: { bg: "rgba(232,228,216,0.1)", border: "rgba(232,228,216,0.35)", text: "#e8e4d8" },
  blue:  { bg: "rgba(74,127,193,0.18)",  border: "#4a7fc1", text: "#7ab0e0" },
  black: { bg: "rgba(106,90,205,0.18)",  border: "#8070c0", text: "#a090e0" },
  red:   { bg: "rgba(201,64,64,0.18)",   border: "#c94040", text: "#e07070" },
  green: { bg: "rgba(58,138,74,0.18)",   border: "#3a8a4a", text: "#6abf6a" },
};

function ColorPip({ color }) {
  const s = COLOR_STYLES[color];
  return (
    <div style={{ width:24,height:24,borderRadius:4,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:s.bg,border:`1px solid ${s.border}`,fontSize:8,fontWeight:700,color:s.text,letterSpacing:1,textTransform:"uppercase" }}>
      {color.slice(0,2).toUpperCase()}
    </div>
  );
}

function StatusDot({ isScanning, hasListings, hasResult }) {
  return (
    <div style={{ width:7,height:7,borderRadius:"50%",background:isScanning?"#7ab0e0":hasListings?"#c9a84c":hasResult?"#444":"#2a2a38",boxShadow:isScanning?"0 0 6px #7ab0e0":hasListings?"0 0 6px #c9a84c":"none" }} />
  );
}

function ScanBtn({ onClick, disabled, isScanning, hasResult }) {
  return (
    <button onClick={onClick} disabled={disabled||isScanning}
      style={{ padding:"4px 12px",borderRadius:4,fontSize:11,border:"1px solid #2a2a38",background:"transparent",color:disabled||isScanning?"#444":"#8a8478",cursor:disabled||isScanning?"not-allowed":"pointer",fontFamily:"Georgia,serif" }}>
      {isScanning?"Scanning…":hasResult?"Re-scan":"Scan"}
    </button>
  );
}

function ResultBlock({ result, isScanning }) {
  if (!result) return null;
  const hasListings = result.listings?.length > 0;
  return (
    <div style={{ borderTop:"1px solid #2a2a38",paddingTop:9,marginTop:2 }}>
      {isScanning ? (
        <div style={{ fontSize:11,color:"#7ab0e0",fontStyle:"italic" }}>⟳ Searching…</div>
      ) : hasListings ? (
        <>
          <div style={{ fontSize:11,fontWeight:700,color:"#c9a84c",marginBottom:5 }}>
            ✦ {result.listings.length} listing{result.listings.length!==1?"s":""} found
          </div>
          {result.listings.map((l,i) => (
            <div key={i} style={{ fontSize:10,lineHeight:1.6,padding:"5px 8px",marginBottom:4,background:"rgba(201,168,76,0.05)",borderRadius:4,borderLeft:"2px solid #7a6430",color:"#e8e4d8" }}>
              <strong style={{ color:"#c9a84c" }}>{l.site}</strong>
              {l.price && <span style={{ color:"#6abf6a" }}> — {l.price}</span>}
              <br/>
              {l.url
                ? <a href={l.url} target="_blank" rel="noreferrer" style={{ color:"#c9a84c",fontSize:10,wordBreak:"break-all" }}>{l.title||l.url}</a>
                : <span style={{ color:"#8a8478" }}>{l.title}</span>
              }
            </div>
          ))}
        </>
      ) : (
        <div style={{ fontSize:11,color:"#555",fontStyle:"italic" }}>— No listings found</div>
      )}
    </div>
  );
}

function buildSiteList(siteIds) {
  const map = {
    ebay:"eBay (ebay.com)",
    tcgplayer:"TCGPlayer (tcgplayer.com)",
    cardtrader:"Card Trader (cardtrader.com)",
    reddit:"Reddit (reddit.com/r/mtg, reddit.com/r/mtgfinance, reddit.com/r/magiccardmarket)",
    magiclibrarities:"Magic Librarities (magiclibrarities.info)",
    cardmarket:"Cardmarket (cardmarket.com)",
    google:"a broad Google web search covering small hobby shops, independent dealers, personal sale pages, forums, and any site across the entire internet",
  };
  return siteIds.map(s => map[s]||s).join("; ");
}

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:1500,
      tools:[{type:"web_search_20250305",name:"web_search"}],
      messages:[{role:"user",content:prompt}],
    }),
  });
  const data = await res.json();
  const text = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
  let listings = [];
  try {
    const match = text.replace(/```json|```/g,"").trim().match(/\[[\s\S]*?\]/);
    if (match) listings = JSON.parse(match[0]);
  } catch(e) {}
  return listings;
}

function LogBox({ logs }) {
  if (!logs.length) return null;
  return (
    <div style={{ marginTop:12,background:"#080809",border:"1px solid #1e1e2a",borderRadius:6,padding:"9px 11px",fontFamily:"monospace",fontSize:10,maxHeight:120,overflowY:"auto" }}>
      {logs.map(l => (
        <div key={l.id} style={{ marginBottom:2,color:l.type==="found"?"#c9a84c":l.type==="ok"?"#6abf6a":l.type==="err"?"#c94040":"#7ab0e0",fontWeight:l.type==="found"?700:400 }}>
          {l.msg}
        </div>
      ))}
    </div>
  );
}

function SiteToggles({ sites, activeSites, setActiveSites }) {
  return (
    <div style={{ display:"flex",flexWrap:"wrap",gap:7,marginBottom:16 }}>
      {sites.map(site => {
        const active = activeSites.has(site.id);
        return (
          <button key={site.id}
            onClick={() => setActiveSites(p => { const n=new Set(p); n.has(site.id)?n.delete(site.id):n.add(site.id); return n; })}
            style={{ padding:"5px 13px",borderRadius:20,fontSize:11,fontFamily:"Georgia,serif",border:`1px solid ${active?"#7a6430":"#2a2a38"}`,background:active?"rgba(201,168,76,0.08)":"transparent",color:active?"#c9a84c":"#8a8478",cursor:"pointer" }}>
            {site.label}
          </button>
        );
      })}
    </div>
  );
}

function DiceTab() {
  const [activeSites,setActiveSites] = useState(new Set(["ebay","tcgplayer","cardtrader","reddit","google"]));
  const [results,setResults]         = useState({});
  const [scanning,setScanning]       = useState({});
  const [scanningAll,setScanningAll] = useState(false);
  const [logs,setLogs]               = useState([]);
  const addLog = useCallback((msg,type="") => setLogs(p=>[...p,{msg,type,id:Math.random()}]),[]);
  const dieKey = d => `${d.set}-${d.color}`;

  const searchDie = useCallback(async (die) => {
    const key = dieKey(die);
    setScanning(p=>({...p,[key]:true}));
    setResults(p=>({...p,[key]:{listings:[]}}));
    const prompt = `Search the web for current listings of a Magic: The Gathering "${die.set}" set ${die.color} spindown life counter die for sale or trade.\n\nSearch across: ${buildSiteList([...activeSites])}\n\nMTG spindowns are d20-shaped life counter dice from MTG booster packs. Be thorough — include small hobby shops and independent dealers.\n\nReturn ONLY a JSON array: [{"site":"...","title":"...","url":"...","price":"..."}]. If nothing found return []. JSON only.`;
    try {
      const listings = await callClaude(prompt);
      setResults(p=>({...p,[key]:{listings}}));
      addLog(listings.length>0 ? `✦ FOUND: ${die.set} ${die.color} — ${listings.length} listing(s)` : `✓ ${die.set} ${die.color} — none`, listings.length>0?"found":"ok");
    } catch(err) {
      setResults(p=>({...p,[key]:{listings:[],error:true}}));
      addLog(`✗ Error: ${die.set} ${die.color} — ${err.message}`,"err");
    }
    setScanning(p=>({...p,[key]:false}));
  }, [activeSites, addLog]);

  const scanAll = useCallback(async () => {
    if (scanningAll) return;
    setScanningAll(true); setLogs([]); setResults({});
    addLog(`Sites: ${[...activeSites].join(", ")}`,"info");
    addLog(`Searching ${MISSING_DICE.length} spindowns...`,"info");
    for (const die of MISSING_DICE) {
      await searchDie(die);
      await new Promise(r=>setTimeout(r,350));
    }
    setScanningAll(false);
  }, [scanningAll, activeSites, searchDie, addLog]);

  const totalFound = Object.values(results).reduce((s,r)=>s+(r?.listings?.length||0),0);

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"center",gap:40,padding:"12px 20px",background:"#141418",borderBottom:"1px solid #2a2a38",flexWrap:"wrap" }}>
        {[{n:13,label:"Missing",color:"#c94040"},{n:Object.keys(results).length,label:"Scanned",color:"#7ab0e0"},{n:totalFound,label:"Found",color:totalFound>0?"#c9a84c":"#6abf6a"}].map(s=>(
          <div key={s.label} style={{ textAlign:"center" }}>
            <div style={{ fontSize:22,fontWeight:700,color:s.color }}>{s.n}</div>
            <div style={{ fontSize:10,color:"#8a8478",textTransform:"uppercase",letterSpacing:"0.12em" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:"20px 16px 40px" }}>
        <div style={{ background:"#141418",border:"1px solid #2a2a38",borderRadius:10,padding:"16px 18px",marginBottom:22 }}>
          <div style={{ fontSize:11,color:"#c9a84c",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:5 }}>⚙ Scan Settings</div>
          <div style={{ fontSize:11,color:"#8a8478",fontStyle:"italic",marginBottom:13,lineHeight:1.6 }}>Select marketplaces. "Google (whole web)" casts a wide net across hobby shops, independent dealers, and anywhere on the internet.</div>
          <SiteToggles sites={DIE_SITES} activeSites={activeSites} setActiveSites={setActiveSites} />
          <button onClick={scanAll} disabled={scanningAll}
            style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"10px 22px",borderRadius:8,fontSize:12,fontFamily:"Georgia,serif",border:`1px solid ${scanningAll?"#5a4820":"#7a6430"}`,background:scanningAll?"rgba(201,168,76,0.04)":"rgba(201,168,76,0.1)",color:scanningAll?"#7a6430":"#c9a84c",cursor:scanningAll?"not-allowed":"pointer" }}>
            {scanningAll && <div style={{ width:11,height:11,border:"2px solid #7a6430",borderTopColor:"#c9a84c",borderRadius:"50%",animation:"spin 0.75s linear infinite" }} />}
            {scanningAll ? "Scanning…" : "⚄ Scan All Missing Spindowns"}
          </button>
          <LogBox logs={logs} />
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:13 }}>
          <span style={{ fontSize:10,color:"#7a6430",letterSpacing:"0.15em",textTransform:"uppercase",whiteSpace:"nowrap" }}>Missing Spindowns</span>
          <div style={{ flex:1,height:1,background:"#2a2a38" }} />
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:11 }}>
          {MISSING_DICE.map(die => {
            const key=dieKey(die), result=results[key]??null, isScanning=!!scanning[key], hasListings=result?.listings?.length>0;
            return (
              <div key={key} style={{ background:hasListings?"#1c180a":"#1e1414",border:`1px solid ${hasListings?"#7a6430":isScanning?"#4a7fc1":"#5a2828"}`,borderRadius:8,padding:"13px 14px",display:"flex",flexDirection:"column",gap:7 }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <span style={{ fontSize:13,fontWeight:600,color:"#e8e4d8" }}>{die.set}</span>
                  <ColorPip color={die.color} />
                </div>
                <div style={{ fontSize:11,color:"#8a8478",fontStyle:"italic" }}>Need <span style={{ color:"#c94040",fontStyle:"normal",fontWeight:700 }}>1</span> more {die.color} spindown</div>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <ScanBtn onClick={()=>searchDie(die)} disabled={scanningAll} isScanning={isScanning} hasResult={!!result} />
                  <StatusDot isScanning={isScanning} hasListings={hasListings} hasResult={!!result} />
                </div>
                <ResultBlock result={result} isScanning={isScanning} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CardsTab() {
  const [activeSites,setActiveSites] = useState(new Set(["ebay","tcgplayer","cardmarket","cardtrader","reddit","google"]));
  const [results,setResults]         = useState({});
  const [scanning,setScanning]       = useState({});
  const [scanningAll,setScanningAll] = useState(false);
  const [logs,setLogs]               = useState([]);
  const addLog = useCallback((msg,type="") => setLogs(p=>[...p,{msg,type,id:Math.random()}]),[]);
  const cardKey = c => c.name.replace(/\s+/g,"-");

  const searchCard = useCallback(async (card) => {
    const key = cardKey(card);
    setScanning(p=>({...p,[key]:true}));
    setResults(p=>({...p,[key]:{listings:[]}}));
    const prompt = `Search the web for current listings of "${card.name}" — a Magic: The Gathering card from ${card.set} (${card.year}) — specifically the FOIL RUSSIAN language version from its original ${card.set} printing.\n\nSearch across: ${buildSiteList([...activeSites])}\n\nThis is rare — search thoroughly including Eastern European MTG dealers, Russian MTG communities, small shops, and forums. Do not return non-foil, non-Russian, or reprint editions.\n\nReturn ONLY a JSON array: [{"site":"...","title":"...","url":"...","price":"..."}]. If nothing found return []. JSON only.`;
    try {
      const listings = await callClaude(prompt);
      setResults(p=>({...p,[key]:{listings}}));
      addLog(listings.length>0 ? `✦ FOUND: ${card.name} — ${listings.length} listing(s)` : `✓ ${card.name} — none`, listings.length>0?"found":"ok");
    } catch(err) {
      setResults(p=>({...p,[key]:{listings:[],error:true}}));
      addLog(`✗ Error: ${card.name} — ${err.message}`,"err");
    }
    setScanning(p=>({...p,[key]:false}));
  }, [activeSites, addLog]);

  const scanAll = useCallback(async () => {
    if (scanningAll) return;
    setScanningAll(true); setLogs([]); setResults({});
    addLog(`Sites: ${[...activeSites].join(", ")}`,"info");
    addLog(`Searching ${MISSING_CARDS.length} foil Russian cards...`,"info");
    for (const card of MISSING_CARDS) {
      await searchCard(card);
      await new Promise(r=>setTimeout(r,350));
    }
    setScanningAll(false);
  }, [scanningAll, activeSites, searchCard, addLog]);

  const totalFound = Object.values(results).reduce((s,r)=>s+(r?.listings?.length||0),0);

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"center",gap:40,padding:"12px 20px",background:"#141418",borderBottom:"1px solid #2a2a38",flexWrap:"wrap" }}>
        {[{n:2,label:"Missing Cards",color:"#c94040"},{n:Object.keys(results).length,label:"Scanned",color:"#7ab0e0"},{n:totalFound,label:"Found",color:totalFound>0?"#c9a84c":"#6abf6a"}].map(s=>(
          <div key={s.label} style={{ textAlign:"center" }}>
            <div style={{ fontSize:22,fontWeight:700,color:s.color }}>{s.n}</div>
            <div style={{ fontSize:10,color:"#8a8478",textTransform:"uppercase",letterSpacing:"0.12em" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:"20px 16px 40px" }}>
        <div style={{ background:"#141418",border:"1px solid #2a2a38",borderRadius:10,padding:"16px 18px",marginBottom:22 }}>
          <div style={{ fontSize:11,color:"#c9a84c",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:5 }}>⚙ Scan Settings</div>
          <div style={{ fontSize:11,color:"#8a8478",fontStyle:"italic",marginBottom:13,lineHeight:1.6 }}>Searching for foil Russian first-print editions. "Google (whole web)" also hits Eastern European dealers, Russian MTG communities, and independent shops.</div>
          <SiteToggles sites={CARD_SITES} activeSites={activeSites} setActiveSites={setActiveSites} />
          <button onClick={scanAll} disabled={scanningAll}
            style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"10px 22px",borderRadius:8,fontSize:12,fontFamily:"Georgia,serif",border:`1px solid ${scanningAll?"#5a4820":"#7a6430"}`,background:scanningAll?"rgba(201,168,76,0.04)":"rgba(201,168,76,0.1)",color:scanningAll?"#7a6430":"#c9a84c",cursor:scanningAll?"not-allowed":"pointer" }}>
            {scanningAll && <div style={{ width:11,height:11,border:"2px solid #7a6430",borderTopColor:"#c9a84c",borderRadius:"50%",animation:"spin 0.75s linear infinite" }} />}
            {scanningAll ? "Scanning…" : "✦ Scan All Missing Cards"}
          </button>
          <LogBox logs={logs} />
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:13 }}>
          <span style={{ fontSize:10,color:"#7a6430",letterSpacing:"0.15em",textTransform:"uppercase",whiteSpace:"nowrap" }}>Missing Foil Russian Cards</span>
          <div style={{ flex:1,height:1,background:"#2a2a38" }} />
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14 }}>
          {MISSING_CARDS.map(card => {
            const key=cardKey(card), result=results[key]??null, isScanning=!!scanning[key], hasListings=result?.listings?.length>0;
            return (
              <div key={key} style={{ background:hasListings?"#1c180a":"#0e1620",border:`1px solid ${hasListings?"#7a6430":isScanning?"#4a7fc1":"#1a3050"}`,borderRadius:8,padding:"16px 18px",display:"flex",flexDirection:"column",gap:8 }}>
                <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10 }}>
                  <div>
                    <div style={{ fontSize:15,fontWeight:700,color:"#e8e4d8" }}>{card.name}</div>
                    <div style={{ fontSize:11,color:"#5a7a9a",marginTop:2 }}>{card.set} · {card.year} · {card.colors}</div>
                  </div>
                  <div style={{ fontSize:10,color:"#7a6430",background:"rgba(201,168,76,0.08)",border:"1px solid #7a6430",borderRadius:4,padding:"3px 7px",flexShrink:0,whiteSpace:"nowrap" }}>🇷🇺 Foil RU</div>
                </div>
                <div style={{ fontSize:11,color:"#8a8478",fontStyle:"italic" }}>Foil Russian — first printing only</div>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <ScanBtn onClick={()=>searchCard(card)} disabled={scanningAll} isScanning={isScanning} hasResult={!!result} />
                  <StatusDot isScanning={isScanning} hasListings={hasListings} hasResult={!!result} />
                </div>
                <ResultBlock result={result} isScanning={isScanning} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("dice");
  return (
    <div style={{ background:"#0d0d0f",minHeight:"100vh",color:"#e8e4d8",fontFamily:"Georgia,serif" }}>
      <div style={{ textAlign:"center",padding:"24px 20px 16px",borderBottom:"1px solid #2a2a38",background:"linear-gradient(180deg,rgba(201,168,76,0.05) 0%,transparent 100%)" }}>
        <div style={{ fontSize:"clamp(1.1rem,3vw,1.9rem)",fontWeight:900,color:"#c9a84c",letterSpacing:"0.06em",textShadow:"0 0 30px rgba(201,168,76,0.3)" }}>
          ⚄ MTG Collection Hunter
        </div>
        <div style={{ color:"#8a8478",fontStyle:"italic",marginTop:4,fontSize:12 }}>
          Automated AI scanning across the entire web
        </div>
      </div>
      <div style={{ display:"flex",borderBottom:"1px solid #2a2a38",background:"#0f0f12" }}>
        {[{id:"dice",label:"⚄ Spindowns"},{id:"cards",label:"✦ Foil Russian Cards"}].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ padding:"12px 26px",fontSize:13,fontFamily:"Georgia,serif",border:"none",borderBottom:`2px solid ${tab===t.id?"#c9a84c":"transparent"}`,background:"transparent",color:tab===t.id?"#c9a84c":"#8a8478",cursor:"pointer",letterSpacing:"0.04em" }}>
            {t.label}
          </button>
        ))}
      </div>
      {tab==="dice"  && <DiceTab />}
      {tab==="cards" && <CardsTab />}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}}
    </div>
  );
};
export default App;
