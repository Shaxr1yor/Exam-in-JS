const form = document.getElementById("faq-form");
const questionInput = document.getElementById("question");
const answerInput = document.getElementById("answer");
const accordion = document.getElementById("accordion");
const faq = document.querySelector(".faq");
const addAccordion = document.querySelector(".add-acardion");

let faqs = [];

addAccordion.addEventListener("click", () => {
  addAccordion.style.display = "none";
  faq.style.display = "flex";
});

async function getData() {
  const res = await fetch("https://faq-crud.onrender.com/api/faqs");
  const result = await res.json();
  faqs = result.data.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));
  renderFaqs();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newFaq = {
    id: Date.now(),
    question: questionInput.value,
    answer: answerInput.value,
  };
  faqs.push(newFaq);
  renderFaqs();
  form.reset();
  faq.style.display = "none";
  addAccordion.style.display = "flex";
});

function renderFaqs() {
  accordion.innerHTML = "";
  faqs.forEach((faq) => {
    const item = document.createElement("div");
    item.classList.add("item");
    item.innerHTML = `
      <div class="question">
        <span>${faq.question}</span>
        <div class="actions">
          <i class="fa-solid fa-angle-down"></i>
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>
      </div>
      <div class="answer">${faq.answer}</div>
    `;

    item.querySelector(".question").addEventListener("click", (e) => {
      if (
        !e.target.classList.contains("edit") &&
        !e.target.classList.contains("delete")
      ) {
        item.classList.toggle("open");
      }
    });

    item.querySelector(".edit").addEventListener("click", () => {
      const newQ = prompt("Yangi savol:", faq.question);
      const newA = prompt("Yangi javob:", faq.answer);
      if (newQ && newA) {
        faq.question = newQ;
        faq.answer = newA;
        renderFaqs();
      }
    });

    item.querySelector(".delete").addEventListener("click", () => {
      faqs = faqs.filter((f) => f.id !== faq.id);
      renderFaqs();
    });

    accordion.prepend(item);
  });
}

getData();
