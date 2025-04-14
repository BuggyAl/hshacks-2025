const url = "https://api.together.xyz/v1/chat/completions";
const apiKey = "d43bd608373b4071ad0cc3abe073b48a0f52143aea6d42b65733a88046360fe0"; // Expires on April 18th, 2025

const system_message = `You are a helpful assistant that helps students learn about school subjects. You will be given a topic and you will give a study question to help the user learn about the topic.  If the topic just given is broad (like a class), give a random question from any unit.  Otherwise, give a specific question that the user wants to learn about. You WILL NOT give the answer if the user asks for it, rather you MUST instead help them work towards the solution using their own knowledge. At the end, include the problem dififculty (easy memorization to hard multi-step problems or reasoning). You MUST verify that your answers are true. If you are not 100% confident, DO NOT ask the question or give any data/dates/numbers that may or may not be valid. Your AI is not smart enough to follow some logic problems properly, so make sure you ensure accuracy. The content should be very relevant to the school topic and MUST remain within the curriculum. Your response may not contain any symbols that cannot be displayed in plain text (ex. No LaTeX, no backslashes/newlines, no frac, ONLY unicode. I SHOULD NOT need a special text renderer to display your response. For example, display x squared as x^2). \nThe answer should be in the following format (each on a separate line with NO titles or extra text):\nQuestion (open ended, not multiple choice)\nDifficulty (one word, Easy Medium Hard)\nConcise and accurate answer to the open ended question\n\nAs said before, your response should NEVER contain any extra text, titles, introductions, transitions, or anything that is NOT a part of the format provided above.\nMake sure you have ALL 3 PARTS of the format.`

const prompt_reply_system = "The user is being asked the following question: '${QUESTION}'. The answer should be: ${ANSWER}. The user will provide you with their response. It does not need to be worded the exact same but it should convey the same information. The user has interacted with you previously, but you have no memory of it and will need to act as if this is the case (ex. you WILL NOT greet the user or act like this is the first interaction). You will respond with a hint that helps the user towards the solution, but DO NOT give the answer to the user unless they are COMPLETELY stuck. You MUST verify that your hints are true. If you are not 100% confident, DO NOT ask the question or give any data/dates/numbers that may or may not be valid. Your response may not contain any symbols that cannot be displayed in plain text (ex. No LaTeX, no backslashes/newlines, no frac, ONLY unicode. I SHOULD NOT need a special text renderer to display your response. For example, display x squared as x^2). \n\nIf the answer is incorrect, the response should be in the following format (each on a separate line with NO titles or extra text):\n{INCORRECT}\nHint. \n\nIf the answer is correct (it DOES NOT need to be the exact same thing as the answer, it just has to contain the same type of information), respond with the following format instead: \n{CORRECT}\nA new question\nThe answer to the question, in a concise and accurate manner\n\nAs said before, your response should NEVER contain any extra text, titles, introductions, transitions, or anything that is NOT a part of the format provided above."

var question = "";
var answer = "";
var difficulty = "";
var attempts = 0;

async function getQuestion() {
  const topic = document.getElementById("topic_input").value.trim();

  const goButton = document.getElementById("go_button");
  const goButtonDiv = document.getElementById("go_button_div");
  goButton.disabled = true; // Disable the button to prevent multiple clicks
  goButton.innerHTML = "<b>Loading..."; // Change button text to indicate loading
  goButton.style.cursor = "not-allowed"; // Change cursor to indicate loading
  goButtonDiv.style.backgroundColor = "#ccc"; // Change button color to indicate loading
  goButton.style.fontSize = "100%"; // Change font size to indicate loading

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
      temperature: 1,
      messages: [
        { role: 'system', content: system_message },
        { role: 'user', content: topic }
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || 'No response received.';

  goButton.disabled = false; // Re-enable the button
  goButton.innerHTML = "<b>GO"; // Reset button text
  goButton.style.fontSize = "150%"; // Reset font size
  goButton.style.cursor = "pointer"; // Reset cursor
  goButtonDiv.style.backgroundColor = null;

  // trim empty lines from the reply
  const trimmedReply = reply.split('\n').filter(line => line.trim() !== '').join('\n');
  const lines = trimmedReply.split('\n');
  question = lines[0];
  difficulty = lines[1];
  answer = lines[lines.length - 1].trim();

  // set the question, difficulty, and answer in the HTML elements
  document.getElementById("question_section").innerText = question;

  console.log(reply); // Log the reply to the console

}

async function compareAnswers() {
  attempts++;
  const user_response = document.getElementById("answer_text_box").value.trim();

  console.log(answer);
  var system_msg = prompt_reply_system.replace("${QUESTION}", question);
  /* append text to system message */
  system_msg = system_msg + "\n\nThe answer to this question is:\n" + answer;
  system_msg = system_msg + "\n\nIf the following number is bigger than 5, use very obvious hints that almost give away the answer: " + attempts;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
      temperature: 1,
      messages: [
        { role: 'system', content: system_msg },
        { role: 'user', content: user_response }
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || 'No response received.';

  if (reply === "No response received.") {

    // if code is 429
    if (response.status === 429) {
      alert("Error: Your brain is too fast! Please slow down and give our robots time to think!");
    } else {
      alert("Error: " + response.status + " " + response.statusText);
    }

    return;
  }

  const trimmedReply = reply.split('\n').filter(line => line.trim() !== '').join('\n');
  const lines = trimmedReply.split('\n');
  if (lines[0] === "{INCORRECT}") {
    incorrect(lines[1])
  } else if (lines[0] === "{CORRECT}") {
    correct(lines[1], lines[2])
  } else {
    compareAnswers();
  }

  console.log(reply); // Log the reply to the console

}

function incorrect(feedback) {
  document.getElementById("answer_feedback").innerHTML = feedback;
}

function correct(newQuestion, answerProvided) {
  document.getElementById("answer_feedback").innerHTML = "Awesome job! Erm you cooked! " + newQuestion;
  document.getElementById("question_section").innerText = newQuestion;
  question = newQuestion; // Update the question for the next round
  answer = answerProvided; // Update the answer for the next round
  document.getElementById("answer_text_box").value = ""; // Clear the answer box

  const currentPoints = parseInt(document.getElementById("points").innerText) || 0;
  const newPoints = currentPoints + 1;
  document.getElementById("points").innerText = newPoints; // Update the points display

  attempts = 0; // Reset attempts for the next question

}