const Post = require("../models/post");
const validationSession = require("../utility/validation-session");

function getHome(req, res) {
  res.render("welcome", { csrfToken: req.csrfToken() });
}

async function getAdmin(req, res) {
  if (!res.locals.isAuth) {
    return res.status(401).render("401");
  }

  const posts = await Post.fetchAll();

  sessionErrorData = validationSession.getSessionErrorData(req);

  res.render("admin", {
    posts: posts,
    inputData: sessionErrorData,
    csrfToken: req.csrfToken(),
  });
}

async function createPost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (
    !enteredTitle ||
    !enteredContent ||
    enteredTitle.trim() === "" ||
    enteredContent.trim() === ""
  ) {
    req.session.inputData = {
      hasError: true,
      message: "Invalid input - please check your data.",
      title: enteredTitle,
      content: enteredContent,
    };

    res.redirect("/admin");
    return; // or return res.redirect('/admin'); => Has the same effect
  }

  const newPost = new Post(enteredTitle, enteredContent);
  await newPost.save();

  res.redirect("/admin");
}

async function getSinglePost(req, res) {
  const post = new Post(null, null, req.params.id);
  await post.fetch();

  if (!post.title || !post.content) {
    return res.render("404");
  }

  sessionErrorData = validationSession.getSessionErrorData(req);

  res.render("single-post", {
    post: post,
    inputData: sessionErrorData,
    csrfToken: req.csrfToken(),
  });
}

async function updatePost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (
    !enteredTitle ||
    !enteredContent ||
    enteredTitle.trim() === "" ||
    enteredContent.trim() === ""
  ) {
    req.session.inputData = {
      hasError: true,
      message: "Invalid input - please check your data.",
      title: enteredTitle,
      content: enteredContent,
    };

    res.redirect(`/posts/${req.params.id}/edit`);
    return;
  }

  const post = new Post(enteredTitle, enteredContent, req.params.id);
  await post.save();

  res.redirect("/admin");
}

async function deletePost(req, res) {
  const post = new Post("", "", req.params.id);
  await post.delete();
  res.redirect("/admin");
}

module.exports = {
  getHome: getHome,
  getAdmin: getAdmin,
  createPost: createPost,
  getSinglePost: getSinglePost,
  updatePost: updatePost,
  deletePost: deletePost,
};