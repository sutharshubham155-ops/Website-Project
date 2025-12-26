document.addEventListener("DOMContentLoaded", function () {

  const MAX_SCORE = 45;
  const answers = {};

  const data = {
    structure: [
      { q:"Do you have a clear, well-defined organizational structure with documented roles and accountability?", w:1.2,
        options:[
          {text:"Well-defined & documented structure, roles & JDs",v:3},
          {text:"Partially defined structure & roles / JDs",v:2},
          {text:"No clear structure or JDs",v:1}
        ]},
      { q:"Is there a structured and effective communication & reporting mechanism across departments?", w:1,
        options:[
          {text:"Structured & consistent",v:3},
          {text:"Informal but works",v:2},
          {text:"No clarity",v:1}
        ]},
      { q:"How are day-to-day operational decisions taken in the organization?", w:1.1,
        options:[
          {text:"Delegated & system-driven",v:3},
          {text:"Mixed / partially centralized",v:2},
          {text:"Highly centralized / unclear",v:1}
        ]}
    ],
    people: [
      { q:"Are employees clearly aware of their growth path and career progression?", w:1,
        options:[
          {text:"Clear growth roadmap",v:3},
          {text:"Some clarity",v:2},
          {text:"No clarity",v:1}
        ]},
      { q:"Do you have a strong and identifiable team of A-grade performers?", w:1.2,
        options:[
          {text:"Strong A-grade team",v:3},
          {text:"Average performers",v:2},
          {text:"Weak performance culture",v:1}
        ]},
      { q:"How frequently do you engage your team in capability building and brainstorming sessions?", w:0.8,
        options:[
          {text:"Weekly / Monthly",v:3},
          {text:"Quarterly",v:2},
          {text:"Rare / Never",v:1}
        ]}
    ],
    performance: [
      { q:"Does each employee contribute meaningfully to organizational growth in a measurable way?", w:1.2,
        options:[
          {text:"Measured & consistent",v:3},
          {text:"Inconsistent measurement",v:2},
          {text:"Not measured",v:1}
        ]},
      { q:"Do you have a defined and structured performance evaluation system?", w:1.3,
        options:[
          {text:"Defined PMS with periodic appraisals",v:3},
          {text:"Informal / irregular reviews",v:2},
          {text:"No evaluation system",v:1}
        ]},
      { q:"Do you track employee-wise profitability or productivity regularly?", w:1.1,
        options:[
          {text:"Tracked regularly",v:3},
          {text:"Tracked sometimes",v:2},
          {text:"Not tracked",v:1}
        ]}
    ],
    strategy: [
      { q:"How clearly is the organizational vision defined and communicated?", w:1.2,
        options:[
          {text:"3+ years clear vision",v:3},
          {text:"1–2 years basic vision",v:2},
          {text:"No vision",v:1}
        ]},
      { q:"To what extent are employees aligned with the organizational vision?", w:1,
        options:[
          {text:"Fully aligned workforce",v:3},
          {text:"Partially aligned",v:2},
          {text:"Not aligned",v:1}
        ]},
      { q:"Do you have a clear 360° action-oriented strategic plan?", w:1.3,
        options:[
          {text:"Clear 360° plan",v:3},
          {text:"Partial plan",v:2},
          {text:"No plan",v:1}
        ]},
      { q:"How structured is your approach to strategy planning for the upcoming quarter/year?", w:1.1,
        options:[
          {text:"Planned with clear timelines",v:3},
          {text:"Roughly planned",v:2},
          {text:"Not planned",v:1}
        ]}
    ],
    process: [
      { q:"Do you have well-defined SOPs for all critical departments?", w:1.3,
        options:[
          {text:"Defined for all departments",v:3},
          {text:"Defined for few",v:2},
          {text:"No SOPs",v:1}
        ]},
      { q:"Do you conduct regular process audits to ensure adherence and improvement?", w:1.2,
        options:[
          {text:"Regular audits",v:3},
          {text:"Occasional audits",v:2},
          {text:"No audits",v:1}
        ]}
    ]
  };

  const categoryList = document.getElementById("categoryList");
  const questionForm = document.getElementById("questionForm");
  const finalForm = document.getElementById("finalForm");
  const scorecard = document.getElementById("scorecard");
  const questionsDiv = document.getElementById("questions");
  const categoryTitle = document.getElementById("categoryTitle");

  document.querySelectorAll(".category-btn").forEach(btn=>{
    btn.onclick=()=>loadCategory(btn.dataset.cat);
  });

  function loadCategory(cat){
    categoryList.classList.add("hidden");
    questionForm.classList.remove("hidden");
    categoryTitle.textContent=cat.replace(/^\w/,c=>c.toUpperCase());
    questionsDiv.innerHTML="";

    data[cat].forEach((item,idx)=>{
      questionsDiv.innerHTML+=`
        <div class="question">
          <p>${item.q}</p>
          ${item.options.map(o=>`
            <label><input type="radio" name="${cat}-${idx}" value="${o.v}"> ${o.text}</label>
          `).join("")}
        </div>`;
    });
  }

  document.getElementById("backBtn").onclick=()=>{
    questionForm.classList.add("hidden");
    categoryList.classList.remove("hidden");
  };

  questionForm.onsubmit=e=>{
    e.preventDefault();
    const checked=questionForm.querySelectorAll("input:checked");
    const total=questionForm.querySelectorAll(".question").length;
    if(checked.length!==total) return alert("All questions are mandatory.");

    checked.forEach(i=>answers[i.name]=+i.value);

    questionForm.classList.add("hidden");
    categoryList.classList.remove("hidden");

    if(Object.keys(answers).length===15){
      categoryList.classList.add("hidden");
      finalForm.classList.remove("hidden");
    }
  };

  finalForm.onsubmit=e=>{
    e.preventDefault();
    let score=0;
    Object.keys(answers).forEach(k=>{
      const [c,i]=k.split("-");
      score+=answers[k]*data[c][i].w;
    });
    document.getElementById("finalScore").textContent=Math.round(score/MAX_SCORE*100)+"%";
    finalForm.classList.add("hidden");
    scorecard.classList.remove("hidden");
  };

});
// Enable tap-to-expand on mobile for interactive cards
document.querySelectorAll(".interactive-card").forEach(card => {
  card.addEventListener("click", () => {
    card.classList.toggle("active");
  });
});
/* ===============================
   NAVBAR SCROLL HIGHLIGHT – GUARANTEED
   =============================== */

(function () {
  const navLinks = document.querySelectorAll(".navlinks a");
  const sections = document.querySelectorAll("section[id]");

  if (!navLinks.length || !sections.length) return;

  function onScroll() {
    let scrollPos = window.scrollY + 150;
    let currentId = "";

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentId) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll);
  window.addEventListener("load", onScroll);
})();
/* ===============================
   NAVBAR SCROLL HIGHLIGHT (FINAL FIX)
   =============================== */

(function () {
  const navLinks = document.querySelectorAll(".nav a");
  const sections = document.querySelectorAll("section[id]");

  if (!navLinks.length || !sections.length) return;

  function highlightNav() {
    let scrollPos = window.scrollY + 160; // header offset
    let currentSection = sections[0].id;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentSection) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", highlightNav);
  window.addEventListener("load", highlightNav);
})();

