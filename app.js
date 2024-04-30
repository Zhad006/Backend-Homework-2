import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const pool = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todo list",
  password: "postgres2024",
  port: 5432,
});
pool.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Купить продукты" },
  { id: 2, title: "Убраться дома" },
];
// изменить код чтоб список задач вытягивался из таблицы items в БД
app.get("/", (req, res) => {
  pool.query('SELECT * FROM items', (error, results) => {
    if (error) {
      throw error;
    }
  res.render("index.ejs", {
    listTitle: "Сегодня",
    listItems: items,
  });
});
});

// изменить код так чтобы список задач добавлялся в таблицу items в БД
app.post("/add", (req, res) => {
  const item = req.body.newItem;
  pool.query('INSERT INTO items (title) VALUES ($1)', [item], (error, results) => {
    if (error) {
      throw error;
    }
  res.redirect("/");
});
});

app.post("/edit", (req, res) => {
  const itemId = req.body.updatedItemId;
  const newItemTitle = req.body.updatedItemTitle;
  pool.query('UPDATE items SET title = $1 WHERE id = $2', [newItemTitle, itemId], (error, results) => {
    if (error) {
      throw error;
    }
    res.redirect("/");
  });
});
//добавить код для редактирования списка задач в таблице БД

app.post("/delete", (req, res) => {
  const itemId = req.body.deleteItemId;
  pool.query('DELETE FROM items WHERE id = $1', [itemId], (error, results) => {
    if (error) {
      throw error;
    }
    res.redirect("/");
  });
});
//добавить код для удаления задачи

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
