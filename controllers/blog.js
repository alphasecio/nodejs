const Blog = require("../models/blog");
const Comment = require("../models/comment");

function handleGetAddNewBlog(req, res) {
  return res.render("addBlog", { user: req.user });
}
async function handlePostAddNewBlog(req, res) {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageUrl: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
}
async function handleViewBlog(req, res) {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: "66026518eb3ef30965ce1c1b" }).populate(
    "createdBy"
  );
  return res.render("blog", {
    user: req.user,
    blog: blog,
    comments,
  });
}

async function handleAddCommentForBlog(req, res) {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
}

module.exports = {
  handleGetAddNewBlog,
  handlePostAddNewBlog,
  handleViewBlog,
  handleAddCommentForBlog,
};
