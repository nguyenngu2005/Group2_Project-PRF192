//chức năng hiện part khi vừa load xong trang
const init = () => {
  const parts = document.querySelectorAll(".part");
  document.querySelectorAll(".part").forEach((part) => {
    part.classList.remove("active");
    part.classList.remove("clicked");
  });
  document.querySelectorAll(".question").forEach((question) => {
    question.classList.remove("active");
    question.classList.remove("clicked");
  });
  parts.forEach((part) => {
    part.classList.add("active");
    console.log("done");
  });
};
document.addEventListener("DOMContentLoaded", init());

//chức năng thêm xoá toàn bộ .clicked và thêm .clicked cho part hoặc question được click
document.querySelector(".left-panel").addEventListener("click", (event) => {
  //xoá
  document.querySelectorAll(".part").forEach((part) => {
    part.classList.remove("clicked");
  });
  document.querySelectorAll(".question").forEach((question) => {
    question.classList.remove("clicked");
  });

  //hiện
  if (
    event.target.classList.contains("part") ||
    event.target.classList.contains("question")
  ) {
    event.target.classList.add("clicked");
  }
});

//chức năng hiện list câu hỏi khi click vào part
document.querySelector(".left-panel").addEventListener("click", (event) => {
  if (event.target.classList.contains("part")) {
    const part = event.target.dataset.target;
    const questions = document.querySelectorAll(".question");
    questions.forEach((question) => {
      if (question.dataset.part === part) {
        question.classList.toggle("active");
      }
    });
  }
});

//chức năng hiện đáp án khi click vào câu hỏi
document
  .querySelector(".left-panel")
  .addEventListener("click", async (event) => {
    if (event.target.classList.contains("question")) {
      const part = event.target.dataset.part;
      const question = event.target.dataset.question;

      const answerContainer = document.getElementById("answer-container");
      answerContainer.innerHTML = `<p class="loading">Loading...</p>`;
      try {
        let response = await fetch(`./data/answer/${part}/${question}.html`);
        if (response.ok) {
          answerContainer.innerHTML = await response.text();
          Prism.highlightAll();
          // add attribute style="background-color: rgb(65, 65, 65)" for tag pre inside answer-container
          const pres = answerContainer.querySelectorAll("pre");
          pres.forEach((pre) => {
            pre.style.backgroundColor = "rgb(65, 65, 65)";
          });
        } else {
          answerContainer.innerHTML = `<p class="loading">Answer not found</p>`;
        }
      } catch (error) {
        answerContainer.innerHTML = `<p class="loading">Answer is not available</p>`;
      }
    }
  });

//chặn sự kiện reset tag .form-header
document.querySelector(".form-header").addEventListener("submit", (event) => {
  event.preventDefault();
});

/**Chức năng search theo tên part hoặc tên question
 * Khi tìm thấy tên part sẽ hiện list part đó gồm các câu bên trong
 * Nếu chỉ tìm thấy tên question thì sẽ hiện part chứa question đó và chỉ question đó, ẩn các question khác trong part
 */

const searchFunction = (inputValue) => {
  if (inputValue.trim()) {
    let parts = document.querySelectorAll(".part");
    let questions = document.querySelectorAll(".question");

    let filteredParts = [...parts].filter((part) =>
      part.innerText.toLowerCase().includes(inputValue.toLowerCase())
    );
    let filteredQuestions = [...questions].filter((question) =>
      question.innerText.toLowerCase().includes(inputValue.toLowerCase())
    );

    //cho tất cả parts và questions ẩn
    document.querySelectorAll(".part").forEach((part) => {
      part.classList.remove("active");
      part.classList.remove("clicked");
    });
    document.querySelectorAll(".question").forEach((question) => {
      question.classList.remove("active");
      question.classList.remove("clicked");
    });

    //hiển thị theo filteredParts
    filteredParts.forEach((part) => {
      part.classList.add("active");
    });
    //hiển thị theo filteredQuestions
    filteredQuestions.forEach((question) => {
      question.classList.add("active");
    });
  } else {
    init();
  }
};

document.querySelector("#filter").addEventListener("keyup", (event) => {
  let inputValue = event.target.value;
  searchFunction(inputValue);
});

document.querySelector("#btnSearch").addEventListener("click", (event) => {
  let inputValue = document.querySelector("#filter").value;
  searchFunction(inputValue);
});
