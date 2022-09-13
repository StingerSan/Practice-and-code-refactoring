// const { ObjectID } = require("bson");
const mongodb = require("mongodb");
const db = require("../data/database");

const ObjectID = mongodb.ObjectId;

class Post {
  constructor(tittle, content, id) {
    this.tittle = tittle;
    this.content = content;

    if (id) {
      this.id = new ObjectID(id);
    }
  }

  async save() {
    let result;
    if (this.id) {
      result = await db
        .getDb()
        .collection("posts")
        .updateOne(
          { _id: this.id },
          { $set: { title: this.title, content: this.content } }
        );
    } else {
      result = await db.getDb().collection("posts").insertOne({
        title: this.tittle,
        content: this.content,
      });
    }

    return result;
  }

  async delete() {
    if (!this.id) {
      return;
    }
    const result = await db
      .getDb()
      .collection("posts")
      .deleteOne({ _id: this.id });
    return result;
  }
}

module.exports = Post;
