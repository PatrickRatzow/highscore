import express from "express"
import config from "config"
import db from "./database"
import r from "rethinkdb"

const port = config.get("port")
const secretKeyCfg = config.get("secretKey")
const app = express()

app.get("/upload/:secretKey/:name/:hs", async (req, res) => {
  const secretKey = req.params.secretKey
  if (!secretKey || secretKey == undefined || secretKey != secretKeyCfg) {
    res.json({
      error: true
    })

    return
  }

  const name = req.params.name
  const hs = req.params.hs
  if (!name || !hs || name == undefined || hs == undefined) { 
    res.json({
      error: true
    })

    return
  }

  const query = await r.table("highscore")
    .filter({
      name,
      highscore: hs
    }).run(db.conn())
  const queryArr = await query.toArray()

  if (queryArr.length == 0) {
    const time = new Date().getTime()

    await r.table("highscore")
      .insert({
        name,
        highscore: hs,
        time
      }).run(db.conn())
    
      res.json({
        error: false
      })
  } else {
    res.json({
      error: true
    })
  }
})

app.get("/", async (req, res) => {
  const query = await r.table("highscore")
    .orderBy(r.asc("highscore"), r.asc("time"))
    .limit(10)
    .run(db.conn())
  const queryArr = await query.toArray()

  res.json(queryArr)
})

app.listen(port, () => {
  console.log("Server is listening")
})
