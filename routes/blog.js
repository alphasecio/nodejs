const { Router } = require("express");
const {
  handleGetAddNewBlog,
  handlePostAddNewBlog,
  handleViewBlog,
  handleAddCommentForBlog,
} = require("../controllers/blog");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });
const router = Router();

router.get("/add-new", handleGetAddNewBlog);
router.post("/add-new", upload.single("coverImage"), handlePostAddNewBlog);
router.get("/:id", handleViewBlog)
router.post("/comment/:blogId", handleAddCommentForBlog)

module.exports = router;
