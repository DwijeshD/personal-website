export const DEFAULT_CONTENT: Record<string, string> = {

  'home.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dwijesh Dookraz | Backend Engineer</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@300;400;500&family=Montserrat:wght@200;400;700;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0e0e0e;
            --accent-orange: #ff5e00;
            --accent-orange-glow: rgba(255, 94, 0, 0.4);
            --accent-blue: #00e5ff;
            --accent-blue-glow: rgba(0, 229, 255, 0.4);
            --text-main: #f0f0f0;
            --text-muted: #888888;
            --font-heading: 'Montserrat', sans-serif;
            --font-body: 'Inter', sans-serif;
            --font-cinematic: 'Cinzel', serif;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: var(--font-body);
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
            background-image: radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0e0e0e 100%);
        }
        .noise-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 9998; opacity: 0.04;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        .vignette {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 9997;
            box-shadow: inset 0 0 200px rgba(0,0,0,0.9);
        }
        .cinematic-bar { position: fixed; left: 0; width: 100vw; height: 8vh; background: #000; z-index: 9996; pointer-events: none; }
        .cinematic-bar.top { top: 0; }
        .cinematic-bar.bottom { bottom: 0; }
        .camera-ui {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 9998; padding: 2rem 3rem;
            display: flex; flex-direction: column; justify-content: space-between;
            font-family: 'Courier New', Courier, monospace;
            color: rgba(255,255,255,0.6); font-size: 0.9rem; letter-spacing: 2px;
        }
        .camera-top, .camera-bottom { display: flex; justify-content: space-between; align-items: center; }
        .rec-indicator { display: flex; align-items: center; gap: 10px; color: #ff3333; font-weight: bold; }
        .rec-dot { width: 12px; height: 12px; background-color: #ff3333; border-radius: 50%; animation: recBlink 1s infinite; }
        @keyframes recBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        #particle-canvas { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 0; }
        .energy-flash {
            position: fixed; top: 0; left: -100%; width: 50vw; height: 2px;
            background: linear-gradient(90deg, transparent, var(--accent-orange), transparent);
            z-index: 9999; box-shadow: 0 0 20px var(--accent-orange); opacity: 0; pointer-events: none;
        }
        .reveal-up { opacity: 0; transform: translateY(40px); transition: opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1); }
        .reveal-up.active { opacity: 1; transform: translateY(0); }
        .delay-1 { transition-delay: 0.2s; }
        .delay-2 { transition-delay: 0.4s; }
        .delay-3 { transition-delay: 0.6s; }
        section { position: relative; z-index: 10; padding: 100px 5%; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
        .section-title {
            font-family: var(--font-heading); font-size: 1.5rem; letter-spacing: 8px;
            color: var(--accent-orange); text-transform: uppercase; margin-bottom: 2rem;
            position: relative; display: inline-block;
        }
        .section-title::after {
            content: ''; position: absolute; left: 0; bottom: -10px; height: 1px; width: 0;
            background: var(--accent-orange); transition: width 1s ease-in-out; box-shadow: 0 0 10px var(--accent-orange);
        }
        .section-title.active::after { width: 100%; }
        .focus-reveal { filter: blur(15px); opacity: 0; transform: scale(1.05); transition: filter 1.5s cubic-bezier(0.2,1,0.2,1), opacity 1.5s ease, transform 1.5s ease; }
        .focus-reveal.active { filter: blur(0); opacity: 1; transform: scale(1); }
        .lower-third {
            background: linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 60%, transparent 100%);
            border-left: 5px solid #ff3333; padding: 2rem 3rem; display: inline-block;
            backdrop-filter: blur(8px); position: relative; box-shadow: -10px 10px 30px rgba(0,0,0,0.5);
        }
        .lower-third::before {
            content: 'SUBJECT PROFILE // RECORDING'; position: absolute; top: -12px; left: 0;
            background: #ff3333; color: #fff; font-size: 0.65rem; padding: 3px 8px;
            font-weight: bold; letter-spacing: 3px; font-family: monospace;
        }
        .subtitle-container { margin-top: auto; padding-bottom: 10vh; display: flex; flex-direction: column; align-items: center; z-index: 20; }
        .subtitle-cc {
            display: inline-block; background: rgba(0,0,0,0.85); color: #f0f0f0;
            font-family: var(--font-body); font-size: clamp(1.1rem,2vw,1.8rem);
            padding: 6px 16px; margin: 3px 0; line-height: 1.5; text-align: center;
            border-radius: 3px; text-shadow: 1px 1px 2px #000;
        }
        .subtitle-speaker { color: #ffd700; font-size: clamp(0.8rem,1.2vw,1rem); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; font-weight: bold; background: rgba(0,0,0,0.9); }
        .archival-stamp { position: absolute; top: 15px; right: 15px; font-family: monospace; color: rgba(255,255,255,0.4); font-size: 0.7rem; border: 1px solid rgba(255,255,255,0.2); padding: 3px 8px; letter-spacing: 2px; background: rgba(0,0,0,0.5); z-index: 10; }
        .act-prefix { color: var(--text-muted); font-size: 0.8rem; display: block; margin-bottom: 0.5rem; letter-spacing: 4px; }
        .narrative-line { display: block; opacity: 0; transform: translateY(20px); transition: all 1s ease; }
        .narrative-line.active { opacity: 1; transform: translateY(0); }
        #hero { display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 0 8%; }
        .hero-content { flex: 1; z-index: 2; }
        .hero-title { font-family: var(--font-heading); font-size: clamp(2rem,5vw,5rem); font-weight: 900; line-height: 1.1; letter-spacing: -2px; margin-bottom: 1rem; text-transform: uppercase; overflow: hidden; white-space: nowrap; }
        .hero-title .letter { display: inline-block; opacity: 0; transform: translateY(100%); transition: opacity 0.8s cubic-bezier(0.2,1,0.2,1), transform 0.8s cubic-bezier(0.2,1,0.2,1); }
        .hero-title.active .letter { opacity: 1; transform: translateY(0); }
        .hero-subtitle-wrapper { font-family: var(--font-body); font-size: clamp(1rem,1.5vw,1.5rem); color: var(--accent-blue); margin-bottom: 2rem; font-weight: 300; letter-spacing: 2px; height: 30px; }
        .typed-cursor { display: inline-block; width: 2px; height: 1.2em; background-color: var(--accent-blue); vertical-align: middle; animation: blink 1s step-end infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .hero-caption { font-family: var(--font-cinematic); font-size: 1.1rem; color: var(--text-muted); font-style: italic; border-left: 2px solid var(--accent-orange); padding-left: 1rem; opacity: 0; transform: translateX(-20px); transition: all 1s ease 2s; }
        .hero-caption.active { opacity: 1; transform: translateX(0); }
        .hero-visual { flex: 1; display: flex; justify-content: center; align-items: center; position: relative; }
        .avatar-wrapper { position: relative; width: 350px; height: 350px; border-radius: 50%; display: flex; justify-content: center; align-items: center; opacity: 0; transform: scale(1.1); filter: blur(10px); transition: all 2s cubic-bezier(0.16,1,0.3,1) 0.5s; }
        .avatar-wrapper.active { opacity: 1; transform: scale(1); filter: blur(0); }
        .avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; position: relative; z-index: 2; box-shadow: 0 0 50px rgba(0,0,0,0.8); filter: grayscale(20%) contrast(110%); }
        .energy-ring { position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px; border-radius: 50%; border: 1px solid transparent; background: linear-gradient(45deg, var(--accent-orange), transparent, var(--accent-blue)) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask-composite: exclude; animation: rotateRing 10s linear infinite; z-index: 1; opacity: 0.7; }
        .energy-ring-2 { position: absolute; top: -25px; left: -25px; right: -25px; bottom: -25px; border-radius: 50%; border: 1px dashed rgba(255,94,0,0.3); animation: rotateRing 15s linear infinite reverse; z-index: 1; }
        @keyframes rotateRing { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .scroll-indicator { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 10px; opacity: 0; animation: fadeIn 1s forwards 3s; }
        .scroll-line { width: 1px; height: 60px; background: linear-gradient(to bottom, var(--text-muted), transparent); position: relative; overflow: hidden; }
        .scroll-dot { position: absolute; top: 0; left: -1px; width: 3px; height: 10px; background: var(--accent-orange); border-radius: 2px; animation: scrollDown 2s infinite cubic-bezier(0.15,0.41,0.69,0.94); }
        @keyframes scrollDown { 0% { top: -10px; opacity: 0; } 30% { opacity: 1; } 100% { top: 60px; opacity: 0; } }
        @keyframes fadeIn { to { opacity: 1; } }
        #origin { max-width: 900px; margin: 0 auto; text-align: center; }
        #skills { padding: 100px 8%; }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 3rem; perspective: 1000px; }
        .skill-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 2.5rem 2rem; border-radius: 12px; position: relative; overflow: hidden; transform-style: preserve-3d; transition: transform 0.1s; cursor: pointer; }
        .skill-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 50% 0%, var(--accent-orange-glow), transparent 70%); opacity: 0; transition: opacity 0.5s ease; z-index: 0; }
        .skill-card:hover::before { opacity: 0.3; }
        .skill-card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 12px; border: 2px solid transparent; background: linear-gradient(45deg, var(--accent-orange), var(--accent-blue)) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask-composite: exclude; opacity: 0; transition: opacity 0.3s ease; }
        .skill-card:hover::after { opacity: 1; }
        .skill-category { font-family: var(--font-heading); font-size: 0.8rem; color: var(--accent-orange); letter-spacing: 2px; margin-bottom: 1rem; position: relative; z-index: 1; }
        .skill-list { list-style: none; position: relative; z-index: 1; }
        .skill-list li { font-size: 1.1rem; margin-bottom: 0.8rem; color: #ccc; display: flex; align-items: center; }
        .skill-list li::before { content: '▹'; color: var(--accent-blue); margin-right: 10px; font-size: 1.2rem; }
        #mission { padding: 100px 8%; align-items: center; }
        .timeline { position: relative; max-width: 800px; width: 100%; margin-top: 4rem; }
        .timeline::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 2px; height: 100%; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), var(--accent-blue), rgba(255,255,255,0.1), transparent); }
        .timeline-item { display: flex; justify-content: flex-end; padding-right: 50%; position: relative; margin-bottom: 4rem; width: 100%; opacity: 0; transform: translateY(30px); transition: all 0.8s ease; }
        .timeline-item:nth-child(even) { justify-content: flex-start; padding-right: 0; padding-left: 50%; }
        .timeline-item.active { opacity: 1; transform: translateY(0); }
        .timeline-node { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%) scale(0); width: 16px; height: 16px; border-radius: 50%; background: var(--bg-color); border: 2px solid var(--accent-blue); box-shadow: 0 0 15px var(--accent-blue-glow); z-index: 2; transition: transform 0.5s cubic-bezier(0.175,0.885,0.32,1.275) 0.3s; }
        .timeline-item.active .timeline-node { transform: translate(-50%,-50%) scale(1); }
        .timeline-content { width: 80%; padding: 2rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; position: relative; transition: all 0.3s ease; }
        .timeline-item:nth-child(odd) .timeline-content { text-align: right; margin-right: 30px; }
        .timeline-item:nth-child(even) .timeline-content { text-align: left; margin-left: 30px; }
        .timeline-content:hover { border-color: rgba(0,229,255,0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.5); transform: translateY(-5px); }
        .timeline-title { font-family: var(--font-heading); color: var(--accent-blue); font-size: 1.2rem; margin-bottom: 0.5rem; }
        .timeline-desc { color: var(--text-muted); line-height: 1.6; }
        #vision { text-align: center; padding: 150px 5%; position: relative; overflow: hidden; }
        #vision::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at center, rgba(0,229,255,0.05) 0%, transparent 50%); z-index: -1; animation: slowPulse 10s ease-in-out infinite alternate; }
        @keyframes slowPulse { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.2); opacity: 1; } }
        #closing { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: #000; position: relative; z-index: 20; }
        .credits-wrapper { width: 100%; text-align: center; font-family: var(--font-body); transform: translateY(100px); opacity: 0; transition: all 2s cubic-bezier(0.16,1,0.3,1); }
        .credits-wrapper.active { transform: translateY(0); opacity: 1; }
        .credit-role { color: var(--text-muted); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 0.3rem; }
        .credit-name { color: #fff; font-size: 1.8rem; margin-bottom: 3rem; font-weight: 500; letter-spacing: 2px; font-family: var(--font-cinematic); }
        .closing-main { font-family: var(--font-heading); font-size: clamp(2rem,5vw,5rem); font-weight: 900; text-transform: uppercase; letter-spacing: 5px; margin-bottom: 2rem; opacity: 0; transform: scale(0.9); transition: all 2s cubic-bezier(0.2,1,0.2,1); }
        .closing-main.active { opacity: 1; transform: scale(1); text-shadow: 0 0 40px rgba(255,255,255,0.2); }
        .closing-sub { font-family: var(--font-body); font-size: clamp(1rem,1.5vw,1.5rem); color: var(--accent-orange); letter-spacing: 3px; opacity: 0; transition: opacity 2s ease 1s; }
        .closing-sub.active { opacity: 1; }
        @media (max-width: 968px) {
            #hero { flex-direction: column-reverse; text-align: center; justify-content: center; gap: 4rem; }
            .hero-caption { border-left: none; border-top: 2px solid var(--accent-orange); padding-left: 0; padding-top: 1rem; display: inline-block; }
            .timeline::before { left: 20px; }
            .timeline-item, .timeline-item:nth-child(even) { justify-content: flex-start; padding-left: 60px; padding-right: 0; }
            .timeline-node { left: 20px; }
            .timeline-content, .timeline-item:nth-child(odd) .timeline-content, .timeline-item:nth-child(even) .timeline-content { width: 100%; text-align: left; margin: 0; }
            .avatar-wrapper { width: 280px; height: 280px; }
        }
    </style>
</head>
<body>
    <div class="noise-overlay"></div>
    <div class="vignette"></div>
    <div class="cinematic-bar top"></div>
    <div class="cinematic-bar bottom"></div>
    <div class="camera-ui">
        <div class="camera-top">
            <div class="rec-indicator"><div class="rec-dot"></div> REC</div>
            <div>ISO 800</div>
            <div>F 2.8</div>
        </div>
        <div class="camera-bottom">
            <div>CH 1/2 AUDIO</div>
            <div id="timecode">00:00:00:00</div>
        </div>
    </div>
    <canvas id="particle-canvas"></canvas>
    <div class="energy-flash" id="energy-flash"></div>

    <!-- Hero -->
    <section id="hero" class="focus-reveal">
        <div class="hero-content">
            <div class="lower-third reveal-up">
                <h1 class="hero-title" id="main-title">DWIJESH DOOKRAZ</h1>
                <div class="hero-subtitle-wrapper">
                    <span id="typed-text"></span><span class="typed-cursor"></span>
                </div>
                <p class="hero-caption" id="hero-caption">FILE NO: BE-482 // BACKEND SYSTEMS</p>
            </div>
        </div>
        <div class="hero-visual">
            <div class="avatar-wrapper" id="avatar-container">
                <div class="energy-ring"></div>
                <div class="energy-ring-2"></div>
                <svg class="avatar" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stop-color="#111111"/>
                            <stop offset="100%" stop-color="#000000"/>
                        </radialGradient>
                        <linearGradient id="rimLight" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#00e5ff"/>
                            <stop offset="50%" stop-color="#444444"/>
                            <stop offset="100%" stop-color="#ff5e00"/>
                        </linearGradient>
                    </defs>
                    <rect width="400" height="400" fill="url(#bgGrad)"/>
                    <g stroke="rgba(0, 229, 255, 0.08)" stroke-width="1">
                        <path d="M 0 50 L 400 50 M 0 100 L 400 100 M 0 150 L 400 150 M 0 200 L 400 200 M 0 250 L 400 250 M 0 300 L 400 300 M 0 350 L 400 350"/>
                        <path d="M 50 0 L 50 400 M 100 0 L 100 400 M 150 0 L 150 400 M 200 0 L 200 400 M 250 0 L 250 400 M 300 0 L 300 400 M 350 0 L 350 400"/>
                    </g>
                    <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,94,0,0.15)" stroke-width="2" stroke-dasharray="10 5"/>
                    <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(0,229,255,0.15)" stroke-width="1" stroke-dasharray="4 8"/>
                    <path d="M 200 100 C 160 100, 140 140, 140 180 C 140 220, 160 250, 180 270 C 180 270, 190 290, 190 310 L 210 310 C 210 290, 220 270, 220 270 C 240 250, 260 220, 260 180 C 260 140, 240 100, 200 100 Z" fill="#0a0a0a" stroke="url(#rimLight)" stroke-width="3"/>
                    <path d="M 190 310 C 150 310, 100 360, 80 400 L 320 400 C 300 360, 250 310, 210 310 Z" fill="#0a0a0a" stroke="url(#rimLight)" stroke-width="3"/>
                    <g fill="none" stroke="#00e5ff" stroke-width="1.5" opacity="0.6">
                        <path d="M 170 140 L 190 160 L 180 180"/>
                        <path d="M 230 140 L 210 160 L 220 180"/>
                        <path d="M 190 160 L 210 160"/>
                        <circle cx="170" cy="140" r="3" fill="#00e5ff"/>
                        <circle cx="230" cy="140" r="3" fill="#ff5e00"/>
                        <circle cx="180" cy="180" r="2" fill="#00e5ff"/>
                        <circle cx="220" cy="180" r="2" fill="#00e5ff"/>
                    </g>
                    <rect x="0" y="198" width="400" height="2" fill="rgba(0,229,255,0.4)">
                        <animate attributeName="y" values="-20;420;-20" dur="5s" repeatCount="indefinite"/>
                    </rect>
                    <path d="M 190 200 L 210 200 M 200 190 L 200 210" stroke="#ff3333" stroke-width="2" opacity="0.8"/>
                    <text x="110" y="380" fill="rgba(0,229,255,0.5)" font-family="monospace" font-size="12" letter-spacing="4">SUBJECT // DOOKRAZ</text>
                    <text x="130" y="60" fill="rgba(255,94,0,0.5)" font-family="monospace" font-size="10" letter-spacing="2">SCAN INITIALIZED</text>
                </svg>
            </div>
        </div>
        <div class="scroll-indicator">
            <span style="font-size:0.7rem;letter-spacing:2px;color:var(--text-muted);text-transform:uppercase;">Scroll to Play</span>
            <div class="scroll-line"><div class="scroll-dot"></div></div>
        </div>
    </section>

    <!-- Act I: Origin -->
    <section id="origin" class="focus-reveal">
        <div style="margin-bottom:auto;padding-top:60px;">
            <h2 class="section-title reveal-up"><span class="act-prefix">ACT I</span> The Origin</h2>
        </div>
        <div class="subtitle-container">
            <span class="subtitle-cc subtitle-speaker narrative-line">[Narrator V.O.]</span>
            <span class="subtitle-cc narrative-line">From the University of Southampton, First Class Honours —</span><br>
            <span class="subtitle-cc narrative-line delay-1">emerged a backend engineer who refused to build ordinary systems.</span><br>
            <span class="subtitle-cc narrative-line delay-2">Specialising in AI pipelines, OAuth flows, and production-grade APIs,</span><br>
            <span class="subtitle-cc narrative-line delay-3">Dwijesh builds systems that operate on real data, real users, real constraints.</span>
        </div>
    </section>

    <!-- Exhibit A: Skills -->
    <section id="skills" class="focus-reveal">
        <h2 class="section-title reveal-up"><span class="act-prefix">EXHIBIT A</span> Capability Matrix</h2>
        <div class="skills-grid">
            <div class="skill-card reveal-up delay-1">
                <div class="archival-stamp">SYS-01</div>
                <h3 class="skill-category">BACKEND ENGINEERING</h3>
                <ul class="skill-list">
                    <li>Python</li>
                    <li>Flask &amp; FastAPI</li>
                    <li>REST API Design</li>
                    <li>Java &amp; TypeScript</li>
                </ul>
            </div>
            <div class="skill-card reveal-up delay-2">
                <div class="archival-stamp">SYS-02</div>
                <h3 class="skill-category">AI / MACHINE LEARNING</h3>
                <ul class="skill-list">
                    <li>PyTorch</li>
                    <li>Deep Learning</li>
                    <li>Signal Processing (rPPG)</li>
                    <li>Optuna &amp; scikit-learn</li>
                </ul>
            </div>
            <div class="skill-card reveal-up delay-3">
                <div class="archival-stamp">SYS-03</div>
                <h3 class="skill-category">SYSTEMS &amp; CLOUD</h3>
                <ul class="skill-list">
                    <li>OAuth2 &amp; Webhooks</li>
                    <li>Event-Driven Architecture</li>
                    <li>Azure Functions</li>
                    <li>Docker &amp; Firestore</li>
                </ul>
            </div>
            <div class="skill-card reveal-up delay-1">
                <div class="archival-stamp">SYS-04</div>
                <h3 class="skill-category">DATA &amp; VALIDATION</h3>
                <ul class="skill-list">
                    <li>Feature Engineering</li>
                    <li>k-Fold Cross-Validation</li>
                    <li>MAE Evaluation</li>
                    <li>Preprocessing Pipelines</li>
                </ul>
            </div>
        </div>
    </section>

    <!-- Act II: Active Operations -->
    <section id="mission">
        <h2 class="section-title reveal-up"><span class="act-prefix">ACT II</span> Active Operations</h2>
        <div class="timeline">
            <div class="timeline-item">
                <div class="timeline-node"></div>
                <div class="timeline-content">
                    <div class="archival-stamp">OP: NUSMARK</div>
                    <h3 class="timeline-title">AI Calendar Integration System</h3>
                    <p class="timeline-desc">Full backend syncing Google &amp; Outlook calendars via OAuth2 and real-time webhooks. Transactional logic prevents duplication across concurrent events. Production deployed.</p>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-node"></div>
                <div class="timeline-content">
                    <div class="archival-stamp">OP: RPPG — 82%</div>
                    <h3 class="timeline-title">rPPG Heart Rate Prediction</h3>
                    <p class="timeline-desc">Deep learning model (OptimisedDeepPhys) estimating heart rate from video. Combined UBFC and self-collected datasets for fairness across skin tones. University dissertation, First Class grade.</p>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-node"></div>
                <div class="timeline-content">
                    <div class="archival-stamp">OP: PIPELINE</div>
                    <h3 class="timeline-title">ML Training Infrastructure</h3>
                    <p class="timeline-desc">PyTorch pipelines with Optuna hyperparameter tuning. Subject-aware k-fold validation. Memory-efficient chunked data loading for physiological signal data.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Act III: Vision -->
    <section id="vision" class="focus-reveal">
        <div style="margin-bottom:auto;padding-top:60px;">
            <h2 class="section-title reveal-up"><span class="act-prefix">ACT III</span> The Horizon</h2>
        </div>
        <div class="subtitle-container">
            <span class="subtitle-cc subtitle-speaker narrative-line">[Dwijesh Dookraz — Archival Tape 01]</span>
            <span class="subtitle-cc narrative-line">"The goal isn't clean architecture for its own sake —</span><br>
            <span class="subtitle-cc narrative-line delay-1">it's systems that don't break under real-world conditions."</span><br>
            <span class="subtitle-cc narrative-line delay-2">"Theory is only useful when it ships."</span>
        </div>
    </section>

    <!-- Closing Credits -->
    <section id="closing">
        <div class="credits-wrapper reveal-item">
            <div class="credit-role">Subject Matter</div>
            <div class="credit-name">Dwijesh Dookraz</div>
            <div class="credit-role">Core Technology</div>
            <div class="credit-name">Python · PyTorch · FastAPI</div>
            <div class="credit-role">Production Environment</div>
            <div class="credit-name">Nusmark Systems</div>
            <div style="margin-top:5rem;">
                <h1 class="closing-main" style="opacity:1;transform:scale(1);">BUILT FOR THE REAL WORLD</h1>
                <p class="closing-sub" style="opacity:1;">BACKEND · AI SYSTEMS · APPLIED ML — OPEN TO OPPORTUNITIES.</p>
            </div>
        </div>
    </section>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const energyFlash = document.getElementById('energy-flash');
            setTimeout(() => {
                energyFlash.style.opacity = '1';
                energyFlash.style.transform = 'translateX(200vw)';
                energyFlash.style.transition = 'transform 0.5s ease-in, opacity 0.5s ease-out';
                setTimeout(() => { energyFlash.remove(); }, 600);
            }, 500);
            setTimeout(() => {
                document.getElementById('avatar-container').classList.add('active');
                document.getElementById('hero-caption').classList.add('active');
            }, 800);

            const title = document.getElementById('main-title');
            const text = title.textContent;
            title.innerHTML = '';
            [...text].forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.className = char === ' ' ? 'letter space' : 'letter';
                if (char === ' ') span.style.width = '20px';
                span.style.transitionDelay = (index * 0.05) + 's';
                title.appendChild(span);
            });
            setTimeout(() => { title.classList.add('active'); }, 300);

            const subtitleText = 'Backend Engineer • AI Systems Builder • Applied ML';
            const typedTarget = document.getElementById('typed-text');
            let charIndex = 0;
            function typeWriter() {
                if (charIndex < subtitleText.length) {
                    typedTarget.textContent += subtitleText.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeWriter, Math.random() * 50 + 50);
                }
            }
            setTimeout(typeWriter, 1500);

            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('active');
                });
            }, { threshold: 0.2 });

            document.querySelectorAll('.reveal-up, .section-title, .closing-main, .closing-sub, .focus-reveal, .credits-wrapper, .timeline-item').forEach(el => {
                revealObserver.observe(el);
            });

            const narrativeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lines = entry.target.querySelectorAll('.narrative-line');
                        lines.forEach((line, idx) => {
                            setTimeout(() => { line.classList.add('active'); }, idx * 400);
                        });
                        narrativeObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            document.querySelectorAll('.subtitle-container').forEach(el => narrativeObserver.observe(el));

            document.querySelectorAll('.skill-card').forEach(card => {
                card.addEventListener('mousemove', e => {
                    const rect = card.getBoundingClientRect();
                    const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -10;
                    const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 10;
                    card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02,1.02,1.02)';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
                    card.style.transition = 'transform 0.5s ease';
                });
                card.addEventListener('mouseenter', () => { card.style.transition = 'transform 0.1s'; });
            });

            const canvas = document.getElementById('particle-canvas');
            const ctx = canvas.getContext('2d');
            let particles = [];
            function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();
            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 1.5 + 0.5;
                    this.speedY = (Math.random() * 0.5 + 0.1) * -1;
                    this.speedX = (Math.random() - 0.5) * 0.3;
                    this.opacity = Math.random() * 0.5;
                    this.color = Math.random() > 0.8 ? 'rgba(0,229,255,' : 'rgba(255,94,0,';
                }
                update() {
                    this.y += this.speedY; this.x += this.speedX;
                    if (this.y < 0) { this.y = canvas.height; this.x = Math.random() * canvas.width; }
                }
                draw() {
                    ctx.fillStyle = this.color + this.opacity + ')';
                    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
                }
            }
            function initParticles() {
                particles = [];
                const count = Math.min(window.innerWidth / 15, 100);
                for (let i = 0; i < count; i++) particles.push(new Particle());
            }
            function animateParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => { p.update(); p.draw(); });
                requestAnimationFrame(animateParticles);
            }
            initParticles(); animateParticles();

            const timecodeEl = document.getElementById('timecode');
            let frame = 0, sec = 0, min = 0, hr = 1;
            const pad = n => n.toString().padStart(2, '0');
            function updateTimecode() {
                frame++;
                if (frame >= 24) { frame = 0; sec++; if (sec >= 60) { sec = 0; min++; if (min >= 60) { min = 0; hr++; } } }
                timecodeEl.textContent = pad(hr) + ':' + pad(min) + ':' + pad(sec) + ':' + pad(frame);
                setTimeout(updateTimecode, 1000 / 24);
            }
            updateTimecode();
        });
    </script>
</body>
</html>`,

  'app.tsx': `const { useState, useEffect } = React

type Skill = { name: string; pct: number; color: string }

const SKILLS: Skill[] = [
  { name: 'Python',            pct: 90, color: '#3776ab' },
  { name: 'TypeScript',        pct: 82, color: '#3178c6' },
  { name: 'FastAPI / Flask',   pct: 85, color: '#009688' },
  { name: 'PyTorch',           pct: 78, color: '#ee4c2c' },
  { name: 'OAuth2 + Webhooks', pct: 88, color: '#f59e0b' },
  { name: 'Docker',            pct: 70, color: '#2496ed' },
]

function Bar({ name, pct, color, delay }: Skill & { delay: number }) {
  const [w, setW] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setW(pct), delay)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 13, fontFamily: 'Consolas,monospace',
        color: '#d4d4d4', marginBottom: 8,
      }}>
        <span>{name}</span>
        <span style={{ color: '#6c6c6c' }}>{pct}%</span>
      </div>
      <div style={{ height: 5, background: '#2d2d2d', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: w + '%',
          background: color,
          borderRadius: 3,
          transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  )
}

function App() {
  return (
    <div style={{ background: '#1e1e1e', minHeight: '100vh', padding: '48px', color: '#d4d4d4' }}>
      <div style={{ maxWidth: 560 }}>
        <div style={{
          fontSize: 11, color: '#6a9955', letterSpacing: '.15em',
          textTransform: 'uppercase', marginBottom: 16, fontFamily: 'Consolas,monospace',
        }}>
          {'// app.tsx — skills visualization'}
        </div>
        <h1 style={{
          fontSize: 28, fontWeight: 900, color: '#9cdcfe',
          letterSpacing: '-.01em', marginBottom: 6, fontFamily: 'Consolas,monospace',
        }}>
          Technical Skills
        </h1>
        <p style={{ fontSize: 13, color: '#6c6c6c', marginBottom: 36, fontFamily: 'Consolas,monospace', lineHeight: 1.6 }}>
          Backend · AI/ML · Infrastructure — proficiency by area.
        </p>
        {SKILLS.map((s, i) => (
          <Bar key={s.name} {...s} delay={i * 120} />
        ))}
        <div style={{
          marginTop: 28, padding: '12px 16px',
          background: '#252526', border: '1px solid #3c3c3c',
          borderRadius: 8, fontSize: 12, color: '#6a9955', fontFamily: 'Consolas,monospace',
        }}>
          {'// Edit this file — preview updates as you type'}
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)`,

  'styles.css': `/* VS Code Dark — Design System
   Edit this file to see the preview update live. */

:root {
  --bg:      #1e1e1e;
  --surface: #252526;
  --border:  #3c3c3c;
  --accent:  #0e639c;
  --accent2: #1177bb;
  --text:    #d4d4d4;
  --muted:   #6c6c6c;
  --green:   #6a9955;
  --teal:    #4ec9b0;
  --blue:    #9cdcfe;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: Consolas, 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.7;
}

/* ── Header ─────────────────────── */
.header {
  padding: 20px 32px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

h1 {
  font-size: 22px;
  font-weight: 900;
  color: var(--blue);
  letter-spacing: -.01em;
}

.subtitle {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}

/* ── Layout ─────────────────────── */
.container {
  padding: 32px;
  max-width: 800px;
}

section { margin-bottom: 40px; }

h2 {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: var(--green);
  margin-bottom: 16px;
}

h3 {
  font-size: 14px;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 6px;
}

/* ── Cards ──────────────────────── */
.flex { display: flex; gap: 12px; }

.card {
  flex: 1;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 18px 20px;
  transition: border-color .15s, transform .15s;
}

.card:hover {
  border-color: rgba(14, 99, 156, .5);
  transform: translateY(-1px);
}

.badge {
  display: inline-block;
  font-size: 10px;
  color: #dcdcaa;
  background: rgba(220, 220, 170, .1);
  border: 1px solid rgba(220, 220, 170, .25);
  border-radius: 4px;
  padding: 2px 8px;
  margin-bottom: 10px;
}

.content {
  font-size: 12px;
  color: rgba(212, 212, 212, .6);
  line-height: 1.7;
  margin-bottom: 14px;
}

/* ── Lists ──────────────────────── */
ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

li {
  padding-left: 18px;
  position: relative;
  font-size: 13px;
  color: rgba(212, 212, 212, .75);
}

li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #569cd6;
}

/* ── Interactive ─────────────────── */
a { color: var(--teal); text-decoration: none; }
a:hover { text-decoration: underline; }

button {
  padding: 7px 14px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 5px;
  font: 12px Consolas, monospace;
  cursor: pointer;
  transition: background .15s;
}

button:hover { background: var(--accent2); }

input[type="text"] {
  padding: 8px 12px;
  background: #2d2d2d;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  font: 13px Consolas, monospace;
  outline: none;
  width: 100%;
  transition: border-color .15s;
}

input[type="text"]:focus { border-color: var(--accent); }
input[type="text"]::placeholder { color: var(--muted); }

.item { margin-top: 12px; }

strong { color: var(--text); font-weight: 600; }`,

  'skills.json': `{
  "languages": ["Python", "Java", "JavaScript", "TypeScript", "Haskell", "C"],
  "backend": ["Flask", "FastAPI", "REST API Design"],
  "systems": ["Webhooks", "OAuth2", "Event-Driven Architecture"],
  "databases": ["Firestore", "NoSQL Patterns"],
  "cloud": ["Azure Functions", "Serverless Architecture"],
  "aiml": [
    "PyTorch",
    "Deep Learning",
    "Signal Processing (rPPG)",
    "Model Training Pipelines",
    "Optuna",
    "scikit-learn"
  ],
  "data": [
    "Feature Engineering",
    "Preprocessing",
    "MAE Evaluation",
    "k-Fold Cross-Validation"
  ],
  "tools": ["Git", "Docker", "API Integrations", "Automation Systems"]
}`,

  'server.ts': `// server.ts — Nusmark Calendar Platform

interface Endpoint {
  method: string
  path: string
  description: string
}

const API_VERSION: string = 'v1'
const BASE_URL: string = 'https://api.nusmark.com'

const endpoints: Endpoint[] = [
  { method: 'POST',   path: '/auth/google',           description: 'Initiate Google OAuth2 flow'          },
  { method: 'POST',   path: '/auth/outlook',          description: 'Initiate Microsoft OAuth2 flow'       },
  { method: 'GET',    path: '/calendar/events',       description: 'List synced calendar events'          },
  { method: 'POST',   path: '/calendar/sync',         description: 'Trigger manual sync'                  },
  { method: 'DELETE', path: '/calendar/events/:id',   description: 'Remove a calendar event'              },
  { method: 'POST',   path: '/webhooks/google',       description: 'Handle Google push notification'      },
  { method: 'POST',   path: '/webhooks/outlook',      description: 'Handle Microsoft change notification' },
  { method: 'GET',    path: '/health',                description: 'Service health check'                 },
]

console.log(BASE_URL + '/api/' + API_VERSION)
console.log('─────────────────────────────────────────────────────────────')
console.log('')
endpoints.forEach(({ method, path, description }) => {
  console.log('  ' + method.padEnd(8) + path.padEnd(28) + description)
})
console.log('')
console.warn('Stack: Python · FastAPI · Firestore · OAuth2 · Webhooks · Azure')`,

  'README.md': `# Dwijesh Dookraz

**Software Engineer — Backend, AI Systems, Applied Machine Learning**

---

## About

Computer Science graduate (First Class Honours) from the University of Southampton.
Focused on backend engineering and applied machine learning. I work on systems where theory meets
reality — APIs, webhooks, OAuth flows, distributed data handling, and ML models deployed on
imperfect data.

## Stack

- **Next.js 15** · App Router · Edge Runtime
- **React 19** · TypeScript · Tailwind CSS
- **OpenRouter** · llama-3.3-70b · SSE streaming
- **Monaco Editor** · Syntax highlighting · Live preview

## Projects

| Project | Stack | Status |
|---------|-------|--------|
| AI Calendar Integration | Python, FastAPI, OAuth2, Webhooks | Production |
| rPPG Heart Rate Prediction | PyTorch, Deep Learning | 82% |
| ML Pipelines | PyTorch, Optuna, k-Fold CV | Research |
| Recommender System | Matrix Factorization, SGD | Complete |
| Gene Expression Analysis | scikit-learn, PCA | Complete |

## Contact

- **GitHub:** https://github.com/DwijeshD
- **Email:** dwijeshdookraz1@gmail.com
- **LinkedIn:** https://linkedin.com/in/dwijesh-dookraz

> Currently open to backend / ML engineer roles.
`,

  'link-test.html': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Link Test</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Consolas, monospace; background: #1e1e1e; color: #d4d4d4; padding: 40px; }
  h1 { font-size: 18px; color: #9cdcfe; margin-bottom: 8px; }
  .subtitle { font-size: 11px; color: #6a9955; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 32px; }
  section { margin-bottom: 32px; }
  h2 { font-size: 12px; color: #569cd6; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #3c3c3c; }
  .row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; }
  a.btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 4px; font-size: 13px;
    text-decoration: none; cursor: pointer; border: 1px solid;
  }
  .primary   { background: #0e639c; color: #fff; border-color: #0e639c; }
  .secondary { background: transparent; color: #d4d4d4; border-color: #3c3c3c; }
  .danger    { background: transparent; color: #f44747; border-color: #f44747; }
  .result {
    margin-top: 12px; padding: 10px 14px; background: #252526;
    border: 1px solid #3c3c3c; border-radius: 4px;
    font-size: 12px; color: #6a9955; min-height: 36px;
  }
  #anchor-target { margin-top: 40px; padding: 20px; background: #252526; border: 1px solid #569cd6; border-radius: 4px; color: #9cdcfe; font-size: 13px; }
</style>
</head>
<body>
<h1>// Link Behavior Test</h1>
<p class="subtitle">iframe sandbox click handler verification</p>

<section>
  <h2>1 — href="#" (should do nothing)</h2>
  <div class="row">
    <a class="btn primary" href="#">Primary CTA</a>
    <a class="btn secondary" href="#">About Me</a>
    <a class="btn secondary" href="#">Contact</a>
  </div>
  <div class="result" id="r1">Click any button above — page must not navigate.</div>
</section>

<section>
  <h2>2 — External links target="_blank" (should open new tab)</h2>
  <div class="row">
    <a class="btn secondary" href="https://github.com/DwijeshD" target="_blank">GitHub</a>
    <a class="btn secondary" href="https://linkedin.com/in/dwijesh-dookraz" target="_blank">LinkedIn</a>
    <a class="btn secondary" href="https://anthropic.com" target="_blank">Anthropic</a>
  </div>
  <div class="result" id="r2">Click — should open external site in new tab without navigating this preview.</div>
</section>

<section>
  <h2>3 — mailto (should open email client)</h2>
  <div class="row">
    <a class="btn secondary" href="mailto:dwijeshdookraz1@gmail.com">Email Me</a>
  </div>
  <div class="result" id="r3">Click — should trigger system email client, preview stays.</div>
</section>

<section>
  <h2>4 — Anchor scroll (should scroll within page)</h2>
  <div class="row">
    <a class="btn danger" href="#anchor-target">Scroll to anchor ↓</a>
  </div>
</section>

<div id="anchor-target">✓ Anchor target — you scrolled here without navigating away.</div>

<script>
  document.querySelectorAll('a[href="#"]').forEach(function(a) {
    a.addEventListener('click', function() {
      document.getElementById('r1').textContent = '✓ PASS — href="#" blocked, page stayed.';
      document.getElementById('r1').style.color = '#4ec9b0';
    });
  });
  document.querySelectorAll('a[href^="http"]').forEach(function(a) {
    a.addEventListener('click', function() {
      document.getElementById('r2').textContent = '✓ PASS — external link clicked, check for new tab.';
      document.getElementById('r2').style.color = '#4ec9b0';
    });
  });
  document.querySelector('a[href^="mailto"]').addEventListener('click', function() {
    document.getElementById('r3').textContent = '✓ PASS — mailto triggered.';
    document.getElementById('r3').style.color = '#4ec9b0';
  });
</script>
</body>
</html>
`,
}
