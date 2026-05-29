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
    }

    body{
      background:#121212;
      color:#f5f5f5;
      font-family:'Space Grotesk',sans-serif;
    }

    .noise{
      position:fixed;
      inset:0;
      opacity:.03;
      background-image:url("https://grainy-gradients.vercel.app/noise.svg");
      pointer-events:none;
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

    .buttons{
      margin-top:40px;
      display:flex;
      gap:18px;
      flex-wrap:wrap;
    }

    .btn{
      padding:15px 28px;
      border:none;
      cursor:pointer;
      font-size:15px;
      border-radius:12px;
      transition:.3s;
      font-weight:500;
    }

    .btn-primary{
      background:#f0b52d;
      color:#111;
    }

    .btn-secondary{
      background:transparent;
      border:1px solid rgba(255,255,255,.2);
      color:white;
    }

    .btn:hover{
      transform:translateY(-4px);
      opacity:.9;
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

  </style>
</head>

<body>

<div class="noise"></div>

<div class="container">

  <div class="top-text fade">
    // hello world !! welcome to my portfolio
  </div>

  <section class="hero">

    <div class="left">

      <div class="fade">
        <h1 class="name">
          <span class="name-top">Dwijesh</span><br>
          <span class="name-bottom">Dookraz</span>
        </h1>
      </div>

      <div class="tags fade">
        <div class="tag">Backend Engineer</div>
        <div class="tag">AI / ML Dev</div>
        <div class="tag">Systems Design</div>
        <div class="tag">Python Engineer</div>
      </div>

<div class="typing-wrapper">
  <span id="typer"></span><span class="cursor">|</span>
</div>

      <p class="description fade">
        I build scalable AI systems, autonomous agents, and backend
        infrastructure. Focused on production-grade software engineering,
        local LLM orchestration, RAG pipelines, real-time integrations,
        and machine learning systems that actually ship.
      </p>

      <div class="buttons fade">
        <button class="btn btn-primary">Projects</button>
        <button class="btn btn-secondary">About Me</button>
        <button class="btn btn-secondary">Contact</button>
      </div>

    </div>

    <div class="right fade">

      <div class="glass-card">

        <div class="orb orb1"></div>
        <div class="orb orb2"></div>

        <div class="mini-terminal">

          <div class="line">
            <span class="green">$</span> boot portfolio.sh
          </div>

          <div class="line">
            Initialising <span class="orange">AI agents</span>...
          </div>

          <div class="line">
            Loading <span class="blue">LLM infrastructure</span>...
          </div>

          <div class="line">
            Status: <span class="green">ONLINE</span>
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
      <h2>20+</h2>
      <p>PROJECTS</p>
    </div>

    <div class="stat">
      <h2>AI</h2>
      <p>AUTOMATION</p>
    </div>

    <div class="stat">
      <h2>∞</h2>
      <p>ALWAYS LEARNING</p>
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
