const url = "https://api.mistral.ai/v1/chat/completions";
const apiKey = "aVjtxllitGxCYthfpVfsnxk7BUecjlis"; // Replace with your actual API key

const system_message = `You are a helpful assistant that helps students learn about school subjects. You will be given a topic and you will give a study question and hints to help the user learn about the topic. You WILL NOT give the answer if the user asks for it, rather you MUST instead help them work towards the solution using their own knowledge.`

async function getQuestion() {
  const prompt = "Give me a study question for the topic: '${TOPIC}', and then hints that progressively help give the answer. If the topic just given is broad (like a class), give a random question from any unit. Otherwise, give a specific question that the user wants to learn about. The problem can be multiple steps long (if applicable). At the end, include the problem dififculty (easy memorization to hard multi-step problems or reasoning) and the answer. You should have between 2 and 5 hints. The hints should be unique to the subject, so go into specific details related to the subject. The content should be very relevant to the school topic and MUST remain within the curriculum.\nThe answer should be in the following format (each on a separate line with NO titles):\nQuestion\nDifficulty (one word, Easy Medium Hard)\nHint 1\n\nHint 2\nHint 3\n...\nHint X\nAnswer"
  const topic = document.getElementById("topic_input").value.trim();

  prompt.replace("${TOPIC}", topic);

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || 'No response received.';

  console.log(reply); // Log the reply to the console

}


fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${apiKey}`
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Error:", error));
