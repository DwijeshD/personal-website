export const HOME_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Dwijesh Portfolio</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <style>
    *{
      margin:0;
      padding:0;
      box-sizing:border-box;
    }

    html,body{
      overflow-x:hidden;
      background:transparent;
    }

    body{
      color:#f5f5f5;
      font-family:'Space Grotesk',sans-serif;
    }

.container{
      max-width:1200px;
      margin:auto;
      padding:80px 60px;
    }

    .fade{
      opacity:0;
      transform:translateY(25px);
      animation:fadeUp 1s forwards;
    }

    .fade:nth-child(1){animation-delay:.2s;}
    .fade:nth-child(2){animation-delay:.5s;}
    .fade:nth-child(3){animation-delay:.8s;}
    .fade:nth-child(4){animation-delay:1.1s;}
    .fade:nth-child(5){animation-delay:1.4s;}
    .fade:nth-child(6){animation-delay:1.7s;}

    @keyframes fadeUp{
      to{
        opacity:1;
        transform:translateY(0);
      }
    }

    .top-text{
      color:#d7ff38;
      font-family:'JetBrains Mono',monospace;
      font-size:15px;
      margin-bottom:30px;
      letter-spacing:1px;
    }

    .hero{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:50px;
      min-height:70vh;
    }

    .left{
      flex:1;
    }

    .name{
      font-size:7rem;
      line-height:.9;
      font-weight:700;
      letter-spacing:-5px;
    }

    .name-top{
      color:#f0e8c4;
    }

    .name-bottom{
      color:#ff5a3c;
    }

    .tags{
      display:flex;
      gap:12px;
      flex-wrap:wrap;
      margin-top:35px;
    }

    .tag{
      border:1px solid rgba(255,255,255,.15);
      padding:10px 18px;
      border-radius:10px;
      background:rgba(255,255,255,.03);
      backdrop-filter:blur(10px);
      font-size:14px;
      color:#ddd;
      transition:.3s;
    }

    .tag:hover{
      transform:translateY(-3px);
      border-color:#ff5a3c;
    }

    .typing-wrapper{
      margin-top:40px;
      height:40px;
      display:flex;
      align-items:center;
    }

    #typer{
      font-size:1.2rem;
      color:#d7ff38;
      font-family:'JetBrains Mono',monospace;
      white-space:nowrap;
    }

    .cursor{
      color:#d7ff38;
      font-size:1.2rem;
      font-family:'JetBrains Mono',monospace;
      animation:blink .8s infinite;
    }

    @keyframes blink{
      50%{opacity:0;}
    }

    .description{
      margin-top:35px;
      color:#b9b9b9;
      line-height:1.8;
      max-width:650px;
      font-size:1.05rem;
    }


    .right{
      flex:1;
      display:flex;
      justify-content:center;
      align-items:center;
    }

    .glass-card{
      width:420px;
      height:420px;
      border-radius:30px;
      background:linear-gradient(
        145deg,
        rgba(255,255,255,.08),
        rgba(255,255,255,.02)
      );

      border:1px solid rgba(255,255,255,.08);

      backdrop-filter:blur(25px);

      position:relative;
      overflow:hidden;

      box-shadow:
        0 0 50px rgba(255,90,60,.08),
        inset 0 0 50px rgba(255,255,255,.02);

      animation:float 5s ease-in-out infinite;
    }

    @keyframes float{
      0%,100%{
        transform:translateY(0px);
      }
      50%{
        transform:translateY(-15px);
      }
    }

    .orb{
      position:absolute;
      border-radius:50%;
      filter:blur(20px);
    }

    .orb1{
      width:180px;
      height:180px;
      background:#ff5a3c;
      top:-30px;
      right:-30px;
      opacity:.35;
    }

    .orb2{
      width:140px;
      height:140px;
      background:#d7ff38;
      bottom:20px;
      left:20px;
      opacity:.2;
    }

    .mini-terminal{
      position:absolute;
      inset:40px;
      border-radius:20px;
      background:#0d0d0d;
      padding:25px;
      font-family:'JetBrains Mono',monospace;
      color:#ddd;
      border:1px solid rgba(255,255,255,.06);
    }

    .line{
      margin-bottom:18px;
      opacity:0;
      animation:fadeTerminal .5s forwards;
    }

    .line:nth-child(1){animation-delay:2s;}
    .line:nth-child(2){animation-delay:2.5s;}
    .line:nth-child(3){animation-delay:3s;}
    .line:nth-child(4){animation-delay:3.5s;}

    @keyframes fadeTerminal{
      to{
        opacity:1;
      }
    }

    .green{
      color:#d7ff38;
    }

    .orange{
      color:#ff5a3c;
    }

    .blue{
      color:#64b5ff;
    }

    .stats{
      margin-top:80px;
      display:grid;
      grid-template-columns:repeat(4,1fr);
      border:1px solid rgba(255,255,255,.08);
      border-radius:20px;
      overflow:hidden;
      background:rgba(255,255,255,.02);
    }

    .stat{
      padding:40px;
      text-align:center;
      border-right:1px solid rgba(255,255,255,.05);
    }

    .stat:last-child{
      border-right:none;
    }

    .stat h2{
      font-size:2.5rem;
      color:#f0e8c4;
    }

    .stat p{
      margin-top:10px;
      color:#888;
      letter-spacing:2px;
      font-size:12px;
    }

    @media(max-width:1000px){

      .hero{
        flex-direction:column;
      }

      .name{
        font-size:5rem;
      }

      .glass-card{
        width:100%;
        max-width:420px;
      }

      .stats{
        grid-template-columns:1fr 1fr;
      }
    }

    @media(max-width:700px){

      .container{
        padding:40px 25px;
      }

      .name{
        font-size:3.8rem;
      }

      .stats{
        grid-template-columns:1fr;
      }
    }

    /* ── recruiter additions ─────────────────────────── */

    .avail{
      display:inline-flex;
      align-items:center;
      gap:8px;
      border:1px solid rgba(215,255,56,.25);
      padding:8px 16px;
      border-radius:100px;
      font-size:12px;
      color:#d7ff38;
      background:rgba(215,255,56,.04);
      margin-bottom:28px;
      font-family:'JetBrains Mono',monospace;
      letter-spacing:.5px;
    }

    .avail-dot{
      width:7px;
      height:7px;
      border-radius:50%;
      background:#d7ff38;
      flex-shrink:0;
      animation:pulse 2s ease-in-out infinite;
    }

    @keyframes pulse{
      0%,100%{opacity:1;transform:scale(1);}
      50%{opacity:.3;transform:scale(.8);}
    }

    .links{
      display:flex;
      gap:12px;
      flex-wrap:wrap;
      margin-top:35px;
    }

    .link-btn{
      display:inline-flex;
      align-items:center;
      gap:8px;
      border:1px solid rgba(255,255,255,.15);
      padding:10px 18px;
      border-radius:10px;
      background:rgba(255,255,255,.03);
      backdrop-filter:blur(10px);
      font-size:14px;
      color:#ddd;
      text-decoration:none;
      font-family:'Space Grotesk',sans-serif;
      font-weight:500;
      transition:.3s;
    }

    .link-btn:hover{transform:translateY(-3px);}

    .link-linkedin:hover{border-color:#0a66c2;color:#0a66c2;}
    .link-github:hover{border-color:#e6edf3;color:#e6edf3;}
    .link-email:hover{border-color:#d7ff38;color:#d7ff38;}

    .link-cv{
      border-color:rgba(255,90,60,.4);
      color:#ff5a3c;
      background:rgba(255,90,60,.04);
    }

    .link-cv:hover{
      border-color:#ff5a3c;
      background:rgba(255,90,60,.1);
    }

  </style>
</head>

<body>

<div class="container">

  <div class="top-text fade">
    // hello world !! welcome to my portfolio
  </div>

  <section class="hero">

    <div class="left">

      <div class="fade">
        <div class="avail">
          <span class="avail-dot"></span>
          Open to new opportunities
        </div>
        <h1 class="name">
          <span class="name-top">Dwijesh</span><br>
          <span class="name-bottom">Dookraz</span>
        </h1>
      </div>

      <div class="tags fade">
        <div class="tag">Backend Engineer</div>
        <div class="tag">AI / ML Systems</div>
        <div class="tag">Python · FastAPI · Flask</div>
        <div class="tag">PyTorch · Deep Learning</div>
      </div>

<div class="typing-wrapper">
  <span id="typer"></span><span class="cursor">|</span>
</div>

      <p class="description fade">
        BSc Computer Science — First Class Honours, University of Southampton.
        Currently Backend Engineer at Nusmark building AI-powered calendar
        infrastructure. I work on production systems: APIs, OAuth flows,
        webhook pipelines, and deployed ML models that operate on real data.
      </p>

      <div class="links fade">
        <a href="https://www.linkedin.com/in/DwijeshD/" target="_blank" rel="noopener noreferrer" class="link-btn link-linkedin">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          LinkedIn
        </a>
        <a href="https://github.com/DwijeshD" target="_blank" rel="noopener noreferrer" class="link-btn link-github">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          GitHub
        </a>
        <a href="mailto:dwijeshdookraz1@gmail.com" class="link-btn link-email">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
          Email
        </a>
        <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" class="link-btn link-cv">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download CV
        </a>
      </div>

    </div>

    <div class="right fade">

      <div class="glass-card">

        <div class="orb orb1"></div>
        <div class="orb orb2"></div>

        <div class="mini-terminal">

          <div class="line">
            <span class="green">$</span> whoami
          </div>

          <div class="line">
            <span class="orange">Dwijesh Dookraz</span> — Backend Engineer
          </div>

          <div class="line">
            <span class="blue">Nusmark</span> · Python · FastAPI · AI Systems
          </div>

          <div class="line">
            hire: <span class="green">AVAILABLE</span>
          </div>

        </div>

      </div>

    </div>

  </section>

  <section class="stats fade">

    <div class="stat">
      <h2>3+</h2>
      <p>YEARS BUILDING</p>
    </div>

    <div class="stat">
      <h2>1st</h2>
      <p>CLASS HONOURS</p>
    </div>

    <div class="stat">
      <h2>20+</h2>
      <p>PROJECTS</p>
    </div>

    <div class="stat">
      <h2>BSc</h2>
      <p>COMP SCI · SOTON</p>
    </div>

  </section>

</div>

<script>
const phrases = [
  'Exploring LLMs & RAG pipelines',
  'Building autonomous AI agents',
  'Designing distributed systems',
  'Shipping production ML models',
  'Engineering real-time pipelines',
  'Obsessing over system correctness'
];

const typer = document.getElementById('typer');

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function tick() {
  const phrase = phrases[phraseIndex];

  if (!deleting) {
    typer.textContent = phrase.slice(0, charIndex++);

    if (charIndex > phrase.length) {
      deleting = true;
      setTimeout(tick, 1500);
      return;
    }
  } else {
    typer.textContent = phrase.slice(0, charIndex--);

    if (charIndex < 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      charIndex = 0;
    }
  }

  setTimeout(tick, deleting ? 35 : 60);
}

tick();
</script>
</body>
</html>`
