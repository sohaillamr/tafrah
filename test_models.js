const key = process.env.GROQ_API_KEY || "gsk_test";
async function testModel(model) {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": Bearer ,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [{role: "user", content: "hi"}]
      })
    });
    console.log(model, res.status);
    console.log(await res.text());
  } catch(e) { console.error(e); }
}
testModel("llama-3.1-8b-instant");
testModel("llama-3.3-70b-versatile");
