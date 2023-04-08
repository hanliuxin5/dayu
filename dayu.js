const express = require('express')
const ai = require('openai')

const configuration = new ai.Configuration({
  organization: "org-0pFCFj24UOWqNTSz1GNyKxsG",
  apiKey: process.env.OPEN_KEY,
});
const openai = new ai.OpenAIApi(configuration);

var app = express();

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/" + "index.html");
})


app.get('/process_get', runAsyncWrapper(async (req, res) => {

  const tmpMessages = [
    { role: "user", content: "hello" },
  ];

  const response = await openai.createChatCompletion({
    messages: tmpMessages,
    model: "gpt-3.5-turbo",
  });
  const content = response.data.choices[0].message.content
  
  res.end(content)
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