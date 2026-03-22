const axios = require('axios');

async function test() {
  try {
    console.log("Testing Groq...");
    const groqRes = await axios.post('http://localhost:5000/api/analyze/chat', {
      githubUrl: 'https://github.com/Saurabh-Shinde-Patil/Repo-Analyzer',
      provider: 'groq',
      question: 'Hello'
    });
    console.log("Groq success:", groqRes.data);
  } catch (err) {
    console.error("Groq error:", err.response ? err.response.data : err.message);
  }

  try {
    console.log("Testing Llama...");
    const llamaRes = await axios.post('http://localhost:5000/api/analyze/chat', {
      githubUrl: 'https://github.com/Saurabh-Shinde-Patil/Repo-Analyzer',
      provider: 'llama',
      question: 'Hello'
    });
    console.log("Llama success:", llamaRes.data);
  } catch (err) {
    console.error("Llama error:", err.response ? err.response.data : err.message);
  }
}

test();
