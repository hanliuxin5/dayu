const express = require('express')

const app = express()
var requestCount = 0

app.get("/api/users", (req, res) => {

    requestCount++
    res.status(200)
    res.json(requestCount)
})

app.listen(3000, () => {
  console.log("服务启动: 3000")
})