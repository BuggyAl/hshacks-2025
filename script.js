const goButton = document.getElementById("go_button");
const answerButton = document.getElementById("answer_button");

goButton.addEventListener("click", function() {
  const input = document.getElementById("topic_input").value.trim();
  if (input !== "") {
    document.getElementById("bottom_section").style.visibility = "visible";
    getQuestion();
  } else {
    alert("Please enter some text.");
  }
});

answer_button.addEventListener("click", function() {
  const input = document.getElementById("answer_text_box").value.trim();
  if (input !== "") {
    compareAnswers();
  } else {
    alert("Please enter some text.");
  }
});