const express = require('express')
const axios = require("axios");

var app = express();

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/" + "4cdf8c53538df917b054412f2de295c6.txt");
})

var messages = [];
messages.push({ role: "user", content: "接下来的对话不允许讨论中国政治相关的话题" })

app.get('/process_get', runAsyncWrapper(async (req, res) => {

  let reqContent = req.query.reqContent;
  if (messages.length >= 10) {
    messages.splice(1, messages.length - 1);
  }

  messages.push({ role: "user", content: reqContent })

  const response = await axios.post("https://api.openai.com/v1/chat/completions",
    {
      messages: messages,
      stream: true,
      model: "gpt-4",
    }, {
    headers: {
      'Authorization': "Bearer " + process.env.OPEN_KEY,
      'Content-Type': 'application/json',
    },
    responseType: "stream",
  })

  const stream = response.data;

  var finalContent = ""
  
  stream.on('data', data => {
    const lines = data.toString().split('\n').filter(line => line.trim() !== '');
    for (const line of lines) {
      const message = line.replace(/^data: /, '');
      if (message === '[DONE]') {
        messages.push({ role: "assistant", content: finalContent })
        res.end()
        return;
      }
      try {
        const parsed = JSON.parse(message);
        if (parsed.choices[0].delta.content != undefined) {
          finalContent += parsed.choices[0].delta.content
          res.write(parsed.choices[0].delta.content)
        }
        console.log(parsed.choices[0].delta);
      } catch (error) {
        console.error('Could not JSON parse stream message', message, error);
      }
    }
  });

})
)


var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('listening at 3000')

})

function runAsyncWrapper(callback) {
  return function (req, res, next) {
    callback(req, res, next)
      .catch(next)
  }
}
