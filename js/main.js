/************************************************
 * FINAL SAFE MAIN.JS – GOOGLE SHEET ENABLED
 * NO CRASH – NO BLANK PAGE
 ************************************************/

/* ========= GLOBAL STATE (IMPORTANT FIX) ========= */
let answers = {};   // 👈 FIXED: global scope

document.addEventListener("DOMContentLoaded", () => {

  console.log("main.js loaded successfully");

  /* ========= SECTION FADE-IN ========= */
  const sections = document.querySelectorAll(".section");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
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

  const MAX_SCORE = 45;
  let currentIndex = 0;

  const order = ["structure", "people", "performance", "strategy", "process"];

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

  const questionsDiv = document.getElementById("questions");
  const tabs = document.querySelectorAll(".tab");
  const questionForm = document.getElementById("questionForm");
  const finalForm = document.getElementById("finalForm");
  const scorecard = document.getElementById("scorecard");

  if (!questionsDiv) return;

  function renderCategory(cat) {
    questionsDiv.innerHTML = "";
    let qNo = 1;

    data[cat].forEach((item, idx) => {
      const name = `${cat}-${idx}`;
      questionsDiv.innerHTML += `
        <div class="question">
          <p><strong>Q${qNo++}. ${item.q}</strong></p>
          ${item.options.map((opt, i) => `
            <label>
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

    let total = 0;
    Object.keys(answers).forEach(k => {
      const [c, i] = k.split("-");
      total += answers[k] * data[c][i].w;
    });

    document.getElementById("finalScore").innerText =
      Math.round((total / MAX_SCORE) * 100) + "%";

    finalForm.classList.add("hidden");
    scorecard.classList.remove("hidden");

    sendToGoogleSheet();
  };

});

/* ========= GOOGLE SHEET SUBMIT ========= */
function sendToGoogleSheet() {
  const payload = {
    email: document.getElementById("userEmail").value,
    answers: answers,
    timestamp: new Date().toISOString()
  };

  fetch("https://script.google.com/macros/s/AKfycbwvqK_Pk_u4BiDb_qifmYx-9EYBBWyqzOu3TE26wo5GkxGNvz770eJW_aB4mwPJilSwoQ/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(() => console.log("Data sent to Google Sheet"))
  .catch(err => console.error("Sheet error:", err));
}
