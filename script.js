(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const content = $('#module-content');
  const modules = ['phishing','passwords','logs','network','response'];
  let completed = new Set();
  let current = 'phishing';
  const meta = {
    phishing:['MODULE 01 / AWARENESS','Signal spotting','INTERACTIVE EXERCISE'],
    passwords:['MODULE 02 / IDENTITY','Password basics','LOCAL DEMO'],
    logs:['MODULE 03 / OBSERVATION','Read the logs','FICTIONAL DATA'],
    network:['MODULE 04 / FOUNDATIONS','Network basics','QUICK REFERENCE'],
    response:['MODULE 05 / DECISIONS','Incident response','SCENARIO SIMULATOR']
  };
  const setProgress = () => {
    $('#progress-label').textContent = `${completed.size} / 5 MODULES`;
    document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('done', completed.has(b.dataset.module)));
  };
  const finish = id => { completed.add(id); setProgress(); };
  function show(id) {
    current=id;
    document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.module===id));
    const m=meta[id]; $('#module-kicker').textContent=m[0]; $('#module-title').textContent=m[1]; $('#module-tag').textContent=m[2];
    $('#module-count').textContent=`${String(modules.indexOf(id)+1).padStart(2,'0')} — 05`;
    ({phishing, passwords, logs, network, response}[id])();
  }
  document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>show(b.dataset.module)));

  function phishing(){
    content.innerHTML=`
      <p class="exercise-intro">A message lands in your inbox. Inspect the details and choose the safest next step. Look for urgency, mismatched sender details and unusual requests.</p>
      <div class="prompt-card">
        <div class="prompt-top"><span>INCOMING MESSAGE / SAMPLE 014</span><span>09:42 AM</span></div>
        <div class="mail-from">From: Account Support &lt;helpdesk@secure-account-alert.example&gt;</div>
        <div class="mail-from">To: learner@sample.local</div>
        <div class="mail-subject">ACTION REQUIRED: Your account will close today</div>
        <div class="mail-body">Hello,<br><br>We noticed unusual activity. Your account access will be paused in 30 minutes. Use the button below to confirm your details immediately.<br><br><u>Review account now</u><br><br>Support Team</div>
      </div>
      <div class="eyebrow">WHAT WOULD YOU DO?</div>
      <div class="choice-grid">
        <button class="choice" data-answer="a">A — Click quickly so the account isn't closed</button>
        <button class="choice" data-answer="b">B — Don't click; verify through the official app or known website</button>
        <button class="choice" data-answer="c">C — Reply and ask the sender to prove who they are</button>
        <button class="choice" data-answer="d">D — Forward it to friends to ask if it's real</button>
      </div><div id="phish-feedback" aria-live="polite"></div>
      <div class="action-row"><button class="secondary" id="phish-reset">RESET EXERCISE ↺</button></div>`;
    content.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{
      content.querySelectorAll('[data-answer]').forEach(x=>x.classList.remove('selected')); b.classList.add('selected');
      const good=b.dataset.answer==='b'; $('#phish-feedback').innerHTML=`<div class="feedback ${good?'':'bad'}"><strong>${good?'Good call.':'Not the safest choice.'}</strong> ${good?'Urgent deadlines and requests to confirm details are warning signs. Open the service independently using a trusted route, and report the message through the proper channel.':'Avoid interacting with suspicious messages. Do not use their links or reply. Verify independently through a known official channel.'}</div>`;
      if(good) finish('phishing');
    }));
    $('#phish-reset').addEventListener('click',phishing);
  }

  function passwords(){
    content.innerHTML=`
      <p class="exercise-intro">Explore how password length and variety affect a password's resilience. This is a simple educational estimate, not a real security audit.</p>
      <div class="prompt-card"><div class="prompt-top"><span>LOCAL PASSWORD DEMO</span><span>NOT SENT ANYWHERE</span></div>
      <label class="field-label" for="demo-pass">TYPE A FICTIONAL EXAMPLE — NEVER YOUR REAL PASSWORD</label>
      <input class="text-field" id="demo-pass" type="text" autocomplete="off" placeholder="Try a made-up example">
      <div class="meter"><div class="meter-fill" id="meter-fill"></div></div>
      <p id="pass-rating" class="hint">Enter a made-up example to see general guidance.</p></div>
      <div class="concept-grid">
        <div class="concept"><strong>Longer is better</strong><p>Long, unique passphrases are generally harder to guess than short, predictable ones.</p></div>
        <div class="concept"><strong>Unique per account</strong><p>Don't reuse passwords. A password manager can help keep unique credentials.</p></div>
        <div class="concept"><strong>Use MFA</strong><p>Multi-factor authentication adds another check beyond a password.</p></div>
        <div class="concept"><strong>Keep it private</strong><p>Never share passwords in chats, forms or with people claiming to be support.</p></div>
      </div>`;
    $('#demo-pass').addEventListener('input',e=>{
      const v=e.target.value; const len=v.length; const variety=[/[a-z]/.test(v),/[A-Z]/.test(v),/[0-9]/.test(v),/[^A-Za-z0-9]/.test(v)].filter(Boolean).length;
      let score=Math.min(100,Math.max(0,(len*5)+(variety*8)-( /(123|password|qwerty|admin)/i.test(v)?28:0 )));
      $('#meter-fill').style.width=score+'%';
      let msg=len===0?'Enter a made-up example to see general guidance.':len<12?'Short example: try a longer, unique passphrase.':score<65?'Getting better. Aim for length, uniqueness and unpredictability.':'Stronger-looking example. A password manager and MFA still matter.';
      $('#pass-rating').textContent=msg;
      if(len>=12)finish('passwords');
    });
  }

  const rows=[
    ['09:11:03','LOGIN','user-014','Successful sign-in','normal'],
    ['09:14:27','LOGIN','user-014','Failed sign-in attempt','review'],
    ['09:14:31','LOGIN','user-014','Failed sign-in attempt','review'],
    ['09:15:02','FILE','user-022','Opened shared handbook','normal'],
    ['09:18:44','ACCESS','user-014','New device approval requested','review'],
    ['09:22:10','UPDATE','system','Routine software update','normal']
  ];
  function logs(){
    content.innerHTML=`<p class="exercise-intro">These fictional audit events come from a made-up training environment. Mark the events you would investigate first. One unusual event is not proof of wrongdoing; context matters.</p>
    <div class="prompt-top"><span>TRAINING LOG / DAY 04</span><span>6 EVENTS</span></div>
    <table class="log-table"><thead><tr><th>TIME</th><th>TYPE</th><th>ACTOR</th><th>EVENT</th><th>REVIEW?</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td><button data-log="${i}">FLAG</button></td></tr>`).join('')}</tbody></table>
    <div id="log-feedback" aria-live="polite" class="hint">Tip: repeated failed sign-ins and unexpected approval requests deserve context and review.</div>
    <div class="action-row"><button class="primary" id="check-logs">CHECK MY REVIEW</button><button class="secondary" id="clear-logs">CLEAR</button></div>`;
    const flagged=new Set();
    content.querySelectorAll('[data-log]').forEach(b=>b.addEventListener('click',()=>{const i=+b.dataset.log;if(flagged.has(i)){flagged.delete(i);b.textContent='FLAG';b.closest('tr').className='';}else{flagged.add(i);b.textContent='FLAGGED';b.closest('tr').className='flagged';}}));
    $('#clear-logs').addEventListener('click',logs);
    $('#check-logs').addEventListener('click',()=>{const correct=[1,2,4];const hits=correct.filter(x=>flagged.has(x)).length;const extras=[...flagged].filter(x=>!correct.includes(x)).length;$('#log-feedback').innerHTML=`<div class="feedback ${hits===3&&extras===0?'':'bad'}"><strong>${hits===3&&extras===0?'Nice analysis.':'Review the context again.'}</strong> You flagged ${hits} of 3 suggested events${extras?`, with ${extras} extra flag(s)`:''}. Repeated failures and a new-device approval request are worth checking. This is a learning example, not a verdict.</div>`;if(hits===3&&extras===0)finish('logs');});
  }

  function network(){
    content.innerHTML=`<p class="exercise-intro">A quick field guide to common network concepts. Tap a card to reveal the everyday analogy.</p>
    <div class="concept-grid" id="network-cards">
      <button class="concept reveal"><strong>IP address</strong><p>A numerical address used to identify an interface on a network. <em>Tap for analogy.</em></p></button>
      <button class="concept reveal"><strong>DNS</strong><p>Translates human-readable domain names into the addresses computers use. <em>Tap for analogy.</em></p></button>
      <button class="concept reveal"><strong>Router</strong><p>Forwards traffic between networks. <em>Tap for analogy.</em></p></button>
      <button class="concept reveal"><strong>HTTPS</strong><p>HTTP protected by encryption using TLS. <em>Tap for analogy.</em></p></button>
      <button class="concept reveal"><strong>Firewall</strong><p>Applies rules to allow or block network traffic. <em>Tap for analogy.</em></p></button>
      <button class="concept reveal"><strong>Packet</strong><p>A small formatted unit of data carried across a network. <em>Tap for analogy.</em></p></button>
    </div><div id="network-feedback" class="hint">Reveal all six cards to complete this module.</div>`;
    const analogies=['Like a delivery address for a device on a network.','Like a contacts list that finds the number behind a name.','Like a road junction directing traffic to the right route.','Like a sealed, private envelope between your browser and a website.','Like a checkpoint that follows a set of entry rules.','Like one labelled parcel in a larger delivery.'];
    let opened=new Set();
    content.querySelectorAll('.reveal').forEach((b,i)=>b.addEventListener('click',()=>{b.querySelector('p').textContent=analogies[i];opened.add(i);$('#network-feedback').textContent=`${opened.size} / 6 concepts explored`;if(opened.size===6)finish('network');}));
  }

  const steps=[
    {q:'A teammate reports a suspicious message asking them to sign in. What is your first move?',a:['Tell them not to click and preserve the message for reporting','Try the link yourself to see where it goes','Delete everything immediately'],correct:0,why:'Avoid interacting with the link. Preserve useful evidence and use the organisation’s reporting process.'},
    {q:'You suspect an account may be compromised. What next?',a:['Ignore it until more alerts arrive','Follow the organisation’s approved account-security and incident reporting process','Post the details publicly'],correct:1,why:'Use the approved response process and notify the responsible support or security team. Don’t investigate beyond your role.'},
    {q:'After reporting, what helps the response team?',a:['Share clear facts: time, system, message and what happened','Guess who caused it','Change unrelated settings'],correct:0,why:'Accurate observations help responders assess the situation. Separate facts from assumptions.'}
  ];
  function response(){
    let step=0;
    const draw=()=>{const s=steps[step];content.innerHTML=`<p class="exercise-intro">Work through a fictional workplace scenario. Choose the safest defender action at each stage.</p><div class="prompt-top"><span>SCENARIO / ${String(step+1).padStart(2,'0')} OF 03</span><span>DECISION PRACTICE</span></div><div class="progress-track"><div style="width:${step/3*100}%"></div></div><div class="scenario-step">${s.q}</div><div class="choice-grid">${s.a.map((x,i)=>`<button class="choice" data-step="${i}">${String.fromCharCode(65+i)} — ${x}</button>`).join('')}</div><div id="response-feedback" aria-live="polite"></div>`;content.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{content.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');const good=+b.dataset.step===s.correct;$('#response-feedback').innerHTML=`<div class="feedback ${good?'':'bad'}"><strong>${good?'Good decision.':'Try a safer approach.'}</strong> ${s.why}</div><div class="action-row"><button class="primary" id="next-step">${step===2?'FINISH SCENARIO':'NEXT STEP →'}</button></div>`;$('#next-step').addEventListener('click',()=>{if(!good){b.classList.remove('selected');$('#response-feedback').innerHTML='';return;}if(step<2){step++;draw();}else{finish('response');content.innerHTML=`<div class="prompt-card"><div class="eyebrow">SCENARIO COMPLETE</div><h2>Calm, careful, documented.</h2><p class="exercise-intro">You completed the incident-response scenario. Remember: follow your organisation’s process, stay within your role and report observations clearly.</p><button class="primary" id="restart-response">RUN IT AGAIN ↺</button></div>`;$('#restart-response').addEventListener('click',response);}});}));};draw();
  }

  show('phishing');
})();