import express from "express";
const app = express();
app.use(express.json());

app.post("/", (req, res) => {
  console.log(req.body); // groupId確認用
  res.send("OK");        // LINEに200を返す
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
