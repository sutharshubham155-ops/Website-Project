/************************************************
 * FINAL PRODUCTION MAIN.JS – FIXED SCORING
 ************************************************/

/* ========= GLOBAL STATE ========= */
let answers = {};

/* ========= RESULT BANDS (from Excel: Final Result Reply) ========= */
const RESULT_BANDS = [
  {
    min: 0, max: 20,
    shortReply: "Business depends heavily on the owner.\nSystems need to be built.",
    currentStatusTitle: "What Is Stopping Your Growth",
    currentStatus: "Your business runs mainly on your personal effort.\nMost decisions depend on you.\nRoles are unclear, systems are weak, and daily operations are handled reactively.\nIf you try to grow now, problems will multiply.",
    actionPlanTitle: "Foundation Building Plan",
    keyActions: "Define clear roles and responsibilities.\nDocumenting the key processes.\nSet weekly review meetings.\nCreate basic performance tracking.\nReduce day-to-day owner dependency."
  },
  {
    min: 21, max: 40,
    shortReply: "Structure exists, but execution is inconsistent.",
    currentStatusTitle: "Where Stability Is Missing",
    currentStatus: "Some structure exists, but it is not followed consistently.\nWork gets done, but accountability and tracking are weak.\nGrowth creates pressure because systems are not strong enough to support it.",
    actionPlanTitle: "Discipline & Control Plan",
    keyActions: "Standardize SOPs.\nIntroduce simple KPI dashboards.\nFix accountability gaps.\nEstablish monthly performance reviews."
  },
  {
    min: 41, max: 60,
    shortReply: "Stability present, but alignment gaps slow growth.",
    currentStatusTitle: "Where Alignment Is Required",
    currentStatus: "Departments are functioning, but alignment between teams is weak.\nProcesses exist, yet results vary.\nGrowth is possible, but internal coordination needs strengthening.",
    actionPlanTitle: "Alignment & Governance Plan",
    keyActions: "Align department goals.\nStrengthen reporting systems.\nImprove cross-team communication.\nIntroduce structured management reviews."
  },
  {
    min: 61, max: 75,
    shortReply: "Business is stable, but leadership bandwidth limits growth.",
    currentStatusTitle: "What Is Limiting Scale",
    currentStatus: "Operations are stable and systems are working.\nHowever, growth still depends on leadership involvement.\nMiddle management may not be fully empowered.\nScaling requires delegation and stronger management depth.",
    actionPlanTitle: "Delegation & System Strengthening Plan",
    keyActions: "Define decision authority levels.\nDevelop second-line leaders.\nStrengthen performance management.\nAutomate routine reporting."
  },
  {
    min: 76, max: 90,
    shortReply: "Strong systems in place.\nFocus now on optimization.",
    currentStatusTitle: "Where Growth Can Accelerate",
    currentStatus: "Strong systems and controls are in place.\nOwner dependency is low.\nThe business is ready to optimize margins, improve efficiency, and expand strategically.",
    actionPlanTitle: "Optimization & Expansion Plan",
    keyActions: "Improve process efficiency.\nControl costs.\nStrengthen strategic planning.\nBuild expansion roadmap."
  },
  {
    min: 91, max: 100,
    shortReply: "System-driven business ready for expansion and valuation growth.",
    currentStatusTitle: "Your Strategic Position",
    currentStatus: "The business runs on systems, not individuals.\nPerformance is measurable and predictable.\nThe focus now shifts to innovation, expansion, and long-term enterprise value creation.",
    actionPlanTitle: "Enterprise Growth Roadmap",
    keyActions: "Enter new markets.\nStrengthen leadership bench.\nBuild innovation systems.\nPrepare valuation and long-term growth strategy."
  }
];

function pickResultBand(pct){
  return RESULT_BANDS.find(b => pct >= b.min && pct <= b.max) || RESULT_BANDS[0];
}

function fillList(el, text){
  if (!el) return;
  const lines = String(text || "").split("\n").map(s => s.trim()).filter(Boolean);
  el.innerHTML = lines.map(l => `<li>${escapeHtml(l)}</li>`).join("");
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}



/* ========= QUESTION DATA ========= */
const data = {
    structure: [
      { q:"Do you have a clear, well-defined organizational structure with documented roles and accountability?", w:1.2,
        options:["Well-defined & documented structure, roles & JDs","Partially defined structure & roles / JDs","No clear structure or JDs"] },
      { q:"Is there a structured and effective communication & reporting mechanism across departments?", w:1,
        options:["Structured & consistent","Informal but works","No clarity"] },
      { q:"How are day-to-day operational decisions taken in the organization?", w:1.1,
        options:["Delegated & system-driven","Mixed / partially centralized","Highly centralized / unclear"] }
    ],
    people: [
      { q:"Are employees clearly aware of their growth path and career progression?", w:1,
        options:["Clear growth roadmap","Some clarity","No clarity"] },
      { q:"Do you have a strong and identifiable team of A-grade performers?", w:1.2,
        options:["Strong A-grade team","Average performers","Weak performance culture"] },
      { q:"How frequently do you engage your team in capability building and brainstorming sessions?", w:0.8,
        options:["Weekly / Monthly","Quarterly","Rare / Never"] }
    ],
    performance: [
      { q:"Does each employee contribute meaningfully to organizational growth in a measurable way?", w:1.2,
        options:["Measured & consistent","Inconsistent measurement","Not measured"] },
      { q:"Do you have a defined and structured performance evaluation system?", w:1.3,
        options:["Defined PMS with periodic appraisals","Informal / irregular reviews","No evaluation system"] },
      { q:"Do you track employee-wise profitability or productivity regularly?", w:1.1,
        options:["Tracked regularly","Tracked sometimes","Not tracked"] }
    ],
    strategy: [
      { q:"How clearly is the organizational vision defined and communicated?", w:1.2,
        options:["3+ years clear vision","1–2 years basic vision","No vision"] },
      { q:"To what extent are employees aligned with the organizational vision?", w:1,
        options:["Fully aligned workforce","Partially aligned","Not aligned"] },
      { q:"Do you have a clear 360° action-oriented strategic plan?", w:1.3,
        options:["Clear 360° plan","Partial plan","No plan"] },
      { q:"How structured is your approach to strategy planning for the upcoming quarter/year?", w:1.1,
        options:["Planned with clear timelines","Roughly planned","Not planned"] }
    ],
    process: [
      { q:"Do you have well-defined SOPs for all critical departments?", w:1.3,
        options:["Defined for all departments","Defined for few","No SOPs"] },
      { q:"Do you conduct regular process audits to ensure adherence and improvement?", w:1.2,
        options:["Regular audits","Occasional audits","No audits"] }
    ]
  };

document.addEventListener("DOMContentLoaded", () => {

  console.log("main.js loaded");

  /* ========= CATEGORY ORDER (for continuous question numbering) ========= */
  const catOrder = ["structure","people","performance","strategy","process"];
  const catStart = {};
  let running = 1;
  catOrder.forEach(c => { catStart[c] = running; running += (data[c] ? data[c].length : 0); });

  /* ========= SECTION FADE-IN ========= */
  const sections = document.querySelectorAll(".section");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.15 }
  );
  sections.forEach(sec => observer.observe(sec));

  /* ========= NAVBAR SCROLL HIGHLIGHT ========= */
  const navLinks = document.querySelectorAll(".nav a");

  window.addEventListener("scroll", () => {
    let scrollPos = window.scrollY + 160;
    let currentId = "";

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) currentId = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentId) {
        link.classList.add("active");
      }
    });
  });

  /* ========= INTERACTIVE CARDS ========= */
  document.querySelectorAll(".interactive-card").forEach(card => {
    card.addEventListener("click", () => {
      card.classList.toggle("active");
    });
  });

  /* ========= LET’S INTROSPECT ========= */

  let currentIndex = 0;
  const order = ["structure", "people", "performance", "strategy", "process"];

  

  const questionsDiv = document.getElementById("questions");
  const tabs = document.querySelectorAll(".tab");
  const questionForm = document.getElementById("questionForm");
  const finalForm = document.getElementById("finalForm");
  const scorecard = document.getElementById("scorecard");

  function renderCategory(cat) {
    questionsDiv.innerHTML = "";
    let qNo = (catStart && catStart[cat]) ? catStart[cat] : 1;

    data[cat].forEach((item, idx) => {
      const name = `${cat}-${idx}`;
      questionsDiv.innerHTML += `
        <div class="question">
          <p><strong>Q${qNo++}. ${item.q}</strong></p>
          ${item.options.map((opt, i) => `
            <label class="option">
              <input type="radio" name="${name}" value="${3 - i}"
              ${answers[name] === (3 - i) ? "checked" : ""}>
              ${opt}
            </label>
          `).join("")}
        </div>
      `;
    });
  }

  renderCategory(order[currentIndex]);

  tabs.forEach((tab, idx) => {
    tab.onclick = () => {
      currentIndex = idx;
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderCategory(order[currentIndex]);
    };
  });

  questionForm.onsubmit = e => {
    e.preventDefault();

    const currentCat = order[currentIndex];
    const checked = questionForm.querySelectorAll("input:checked");

    if (checked.length !== data[currentCat].length) {
      alert("All questions are mandatory.");
      return;
    }

    checked.forEach(r => answers[r.name] = Number(r.value));

    if (currentIndex < order.length - 1) {
      currentIndex++;
      tabs[currentIndex].click();
    } else {
      questionForm.classList.add("hidden");
      finalForm.classList.remove("hidden");
    }
  };

  finalForm.onsubmit = e => {
    e.preventDefault();

    let totalScore = 0;
    let maxScore = 0;

    Object.keys(data).forEach(cat => {
      data[cat].forEach(q => {
        maxScore += 3 * q.w;
      });
    });

    Object.keys(answers).forEach(k => {
      const [c, i] = k.split("-");
      totalScore += answers[k] * data[c][i].w;
    });

    const percentage = Math.round((totalScore / maxScore) * 100);

    document.getElementById("finalScore").innerText = percentage + "%";

    // Fill scorecard details (short reply + current status + action plan)
    const band = pickResultBand(percentage);
    const shortReplyEl = document.getElementById("shortReply");
    if (shortReplyEl) shortReplyEl.innerHTML = escapeHtml(band.shortReply).replaceAll("\n","<br>");

    const csTitleEl = document.getElementById("currentStatusTitle");
    if (csTitleEl) csTitleEl.textContent = band.currentStatusTitle;
    fillList(document.getElementById("currentStatusList"), band.currentStatus);

    const apTitleEl = document.getElementById("actionPlanTitle");
    if (apTitleEl) apTitleEl.textContent = band.actionPlanTitle;
    fillList(document.getElementById("actionPlanList"), band.keyActions);

    finalForm.classList.add("hidden");
    scorecard.classList.remove("hidden");

    sendToGoogleSheet(percentage);
  };

});

/* ========= GOOGLE SHEET (NO-CORS SAFE) ========= */
function sendToGoogleSheet(finalScore) {

  fetch("https://script.google.com/macros/s/AKfycbyCNRc-9T-AdVnyQEQg52jl01LIB7J1ZIb08UJyeomIh0IYkoUI9YzYJY8sgB-5Wh44Bw/exec", {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({
      email: document.getElementById("userEmail").value,
      answers: answers,
      score: finalScore,
      timestamp: new Date().toISOString()
    })
  });

  console.log("Assessment submitted successfully");
}
// BOTA Hover Panel Logic

const botaCards = document.querySelectorAll(".bota-card");
const botaContents = document.querySelectorAll(".bota-content");

botaCards.forEach(card => {

  card.addEventListener("mouseenter", () => {

    const target = card.dataset.target;

    // Hide all
    botaContents.forEach(content => {
      content.style.display = "none";
    });

    // Show selected
    document.getElementById(target).style.display = "block";

  });

});
