function go() {
    const input = document.getElementById("topic_input").value.trim();
    if (input !== "") {
      getQuestion();
    } else {
      alert("Please enter some text.");
    }
}