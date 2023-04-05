const express = require('express')
const ai = require('openai')

const configuration = new ai.Configuration({
  organization: "org-0pFCFj24UOWqNTSz1GNyKxsG",
  apiKey: "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",
});
const openai = new ai.OpenAIApi(configuration);

var app = express();

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/" + "index.html");
})

var messages = new Array();
messages.push({ role: "system", content: "You are a helpful assistant" })

app.get('/process_get', runAsyncWrapper(async (req, res) => {

  const tmpMessages = [
    // { role: "system", content: "You are a helpful assistant" },
    // { role: "user", content: "hello" },
    // { role: "assistant", content: "Hello! How can I assist you today?" },
    // { role: "user", content: "what i just say?" },
    // { role: "assistant", content: "You just said 'hello'. Is there anything else you would like to say or ask?" },
    // { role: "user", content: req.query.question },
  ];
  messages.push({ role: "user", content: req.query.question })

  const response = await openai.createChatCompletion({
    tmpMessages,
    model: "gpt-3.5-turbo",
  });

  messages.push({ role: "assistant", content: response.data.choices[0].messages.content })
  console.log(messages.length)
  res.end(JSON.stringify(response))
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