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

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  
  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();

  if (!question || !answer) {
    alert("Iltimos savol va javob kiriting");
    return;
  }

  const newFaq = {
    question,
    answer,
  }

  const resPost = await fetch("https://faq-crud.onrender.com/api/faqs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newFaq),
  });

  if (resPost.ok) {
    await getData();
    form.reset();
    faq.style.display = "none";
    addAccordion.style.display = "flex";
  } else {
    alert("Qo‘shishda xatolik yuz berdi.");
  }
});

function renderFaqs() {
  accordion.innerHTML = "";
  faqs.forEach((faq) => {
    const item = document.createElement("div");
    item.classList.add("item");
    item.innerHTML = `
      <div class="question">
        <span>${faq.question}</span>
          <i class="fa-solid fa-angle-down"></i>
      </div>
      <div class="answer">${faq.answer}
          <div class="actions">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
          </div>
          </div>
      
    `;

    item.querySelector(".question").addEventListener("click", (e) => {
      item.classList.toggle("open");
    });

    item.querySelector(".edit").addEventListener("click", async () => {
      const newQ = prompt("Yangi savol:", faq.question);
      const newA = prompt("Yangi javob:", faq.answer);
      if (newQ && newA) {
        const resPut = await fetch(
          `https://faq-crud.onrender.com/api/faqs/${faq.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question: newQ,
              answer: newA,
            }),
          }
        );

        if (resPut.ok) {
          await getData();
        } else {
          alert("Tahrirlashda xatolik yuz berdi.");
        }
      }
    });

    item.querySelector(".delete").addEventListener("click", async () => {
      const res = await fetch(
        `https://faq-crud.onrender.com/api/faqs/${faq.id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        await getData();
      } else {
        alert("O‘chirishda xatolik yuz berdi.");
      }
    });

    accordion.prepend(item);
  });
}

getData();
