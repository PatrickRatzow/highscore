import config from "config"
import r from "rethinkdb"

class Database {
  async connect() {
    try {
      const connection = await r.connect({
        host: config.get("database.host"),
        db: config.get("database.db"),
        password: config.get("database.password"),
        port: config.get("database.port"),
      })

      this.connection = connection
    } catch (err) {
      console.error(err)
    }
  }

  getConnection() {
    return this.connection
  }

  conn() {
    return this.getConnection()
  }
}

const database = new Database()
database.connect()

export default database
