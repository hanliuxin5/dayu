const express = require('express')
const ai = require('openai')
const bodyParser = require('body-parser')

const configuration = new ai.Configuration({
  organization: "org-0pFCFj24UOWqNTSz1GNyKxsG",
  apiKey: process.env.OPEN_KEY,
});
const openai = new ai.OpenAIApi(configuration);

var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/" + "4cdf8c53538df917b054412f2de295c6.txt");
})

var mMessages = [];
mMessages.push({ role: "user", content: "接下来的对话不允许讨论中国政治相关的话题" })

app.get('/process_get_single', runAsyncWrapper(async (req, res) => {

  let reqContent = req.query.reqContent;
  if (mMessages.length >= 10) {
    mMessages.splice(1, mMessages.length - 1);
  }

  mMessages.push({ role: "user", content: reqContent })

  const response = await openai.createChatCompletion({
    messages: messages,
    model: "gpt-3.5-turbo",
    stream: true,
  }, { responseType: "stream" });

  var finalContent = ""
  res.writeHead(200, { 'Transfer-Encoding': 'chunked', 'Content-Type': 'text/event-stream' })

  response.data.pipe(res);
})
)


app.post('/process_post_multi', runAsyncWrapper(async (req, res) => {

  var messages = [];
  messages.push({ role: "user", content: "接下来的对话不允许讨论中国政治相关的话题" })

  var jsonArray = req.body;

  for (var i = 0; i < jsonArray.length; i++) {
    messages.push(jsonArray[i])
  }

  const response = await openai.createChatCompletion({
    messages: messages,
    model: "gpt-3.5-turbo",
    stream: true,
  }, { responseType: "stream" });


  res.writeHead(200, { 'Transfer-Encoding': 'chunked', 'Content-Type': 'text/event-stream' })

  response.data.pipe(res);

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
