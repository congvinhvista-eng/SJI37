const questions = [
  {
    question: "Ngôn ngữ nào tạo cấu trúc trang web?",
    answers: ["CSS", "HTML", "Python", "SQL"],
    correct: 1
  },
  {
    question: "Thủ đô của Nhật Bản là gì?",
    answers: ["Osaka", "Kyoto", "Tokyo", "Nagoya"],
    correct: 2
  },
  {
    question: "12 × 8 bằng bao nhiêu?",
    answers: ["86", "96", "88", "108"],
    correct: 1
  },
  {
    question: "CSS dùng chủ yếu để làm gì?",
    answers: ["Tạo kiểu giao diện", "Lưu dữ liệu", "Tạo cơ sở dữ liệu", "Gửi email"],
    correct: 0
  }
];

const home = document.getElementById("home");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const leaderboard = document.getElementById("leaderboard");

let current = 0;
let score = 0;
let answered = false;

function showSection(section) {
  [home, quiz, result, leaderboard].forEach(item => item.hidden = true);
  section.hidden = false;
}

function startQuiz() {
  current = 0;
  score = 0;
  document.getElementById("score").textContent = score;
  showSection(quiz);
  showQuestion();
}

function showQuestion() {
  answered = false;
  const item = questions[current];
  document.getElementById("questionNumber").textContent =
    `Câu ${current + 1}/${questions.length}`;
  document.getElementById("question").textContent = item.question;
  document.getElementById("feedback").textContent = "";
  document.getElementById("nextBtn").disabled = true;
  document.getElementById("nextBtn").textContent =
    current === questions.length - 1 ? "Xem kết quả" : "Tiếp theo";

  const answers = document.getElementById("answers");
  answers.replaceChildren();

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
    button.addEventListener("click", () => chooseAnswer(index, button));
    answers.appendChild(button);
  });
}

function chooseAnswer(index, clickedButton) {
  if (answered) return;
  answered = true;

  const item = questions[current];
  const buttons = document.querySelectorAll(".answer");
  buttons.forEach(button => button.disabled = true);
  buttons[item.correct].classList.add("correct");

  if (index === item.correct) {
    score += 10;
    document.getElementById("feedback").textContent = "Chính xác! 🎉";
  } else {
    clickedButton.classList.add("wrong");
    document.getElementById("feedback").textContent = "Chưa đúng rồi!";
  }

  document.getElementById("score").textContent = score;
  document.getElementById("nextBtn").disabled = false;
}

function nextQuestion() {
  if (!answered) return;

  if (current < questions.length - 1) {
    current++;
    showQuestion();
  } else {
    document.getElementById("finalScore").textContent = score;
    showSection(result);
  }
}

function getScores() {
  try {
    return JSON.parse(localStorage.getItem("quizScores") || "[]");
  } catch {
    return [];
  }
}

function saveScore() {
  const name = prompt("Nhập tên của bạn:");
  if (!name || !name.trim()) return;

  const scores = getScores();
  scores.push({
    name: name.trim().slice(0, 30),
    score,
    date: new Date().toLocaleDateString("vi-VN")
  });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem("quizScores", JSON.stringify(scores.slice(0, 20)));
  showLeaderboard();
}

function showLeaderboard() {
  showSection(leaderboard);
  const list = document.getElementById("scoresList");
  const scores = getScores();
  list.replaceChildren();
  document.getElementById("emptyMessage").hidden = scores.length > 0;

  scores.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} — ${item.score} điểm (${item.date})`;
    list.appendChild(li);
  });
}

document.getElementById("startBtn").addEventListener("click", startQuiz);
document.getElementById("nextBtn").addEventListener("click", nextQuestion);
document.getElementById("saveBtn").addEventListener("click", saveScore);
document.getElementById("againBtn").addEventListener("click", startQuiz);
document.getElementById("showBoardBtn").addEventListener("click", showLeaderboard);
document.getElementById("homeBtn").addEventListener("click", () => showSection(home));
