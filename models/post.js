const db = require("../data/database");

class Post {
  constructor(tittle, content, id) {
    this.tittle = tittle;
    this.content = content;
    this.id = id;
  }

  async save() {
    const result = await db.getDb().collection("posts").insertOne({
      title: this.tittle,
      content: this.content,
    });

    return result;
  }
}

module.exports = Post;
