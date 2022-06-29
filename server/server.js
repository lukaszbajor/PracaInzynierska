import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import SessionFileStore from "session-file-store";
import { createRequire } from "module";
import { CronJob } from "cron";
const require = createRequire(import.meta.url);

const FileStore = new SessionFileStore(session);

const saltRounds = 10;

let app = express();
let port = process.env.PORT || 3000;

app.use(
  session({
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      path: `.sessions`,
    }),
    cookie: {
      httpOnly: true,
      expires: 3600000,
    },
  })
);

const { text, json } = bodyParser;
app.use(text());
app.use(json());
app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const connectToDatabase = async () => {
  return mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "account_balance_db",
  });
};

const query = async (sql, params = []) => {
  const db = await connectToDatabase();
  const [results] = await db.execute(sql, params);
  db.end();
  return results;
};

const returnMsg = (res, msg, code = 200) => {
  res.status(code);
  res.send(msg);
  return res.end();
};

const cron = new CronJob("*/1 * * * *", async () => {
  const resCyclicExpired = await query(
    `SELECT * FROM incomes WHERE last_cyclic_date < NOW() - INTERVAL cyclic_days DAY and is_cyclic = 1 `
  );
  if (!resCyclicExpired.length) {
    return;
  }
  resCyclicExpired.forEach(async (item) => {
    await query(
      "INSERT INTO incomes(name, value, id_category, id_user) VALUES (?,?,?,?)",
      [
        item.name,
        Number(item.value),
        Number(item.id_category),
        Number(item.id_user),
      ]
    );
    await query(
      "UPDATE users SET current_balance = current_balance + ? WHERE id = ?",
      [item.value, item.id_user]
    );
    await query("UPDATE incomes SET last_cyclic_date = NOW() WHERE id = ?", [
      item.id,
    ]);
  });
});

const cron2 = new CronJob("*/1 * * * *", async () => {
  const resCyclicExpired = await query(
    `SELECT * FROM expenses WHERE last_cyclic_date < NOW() - INTERVAL cyclic_days DAY and is_cyclic = 1 `
  );
  if (!resCyclicExpired.length) {
    return;
  }
  resCyclicExpired.forEach(async (item) => {
    await query(
      "INSERT INTO expenses(name, value, id_category, id_user) VALUES (?,?,?,?)",
      [
        item.name,
        Number(item.value),
        Number(item.id_category),
        Number(item.id_user),
      ]
    );
    await query(
      "UPDATE users SET current_balance = current_balance - ? WHERE id = ?",
      [item.value, item.id_user]
    );
    await query("UPDATE expenses SET last_cyclic_date = NOW() WHERE id = ?", [
      item.id,
    ]);
  });
});

cron.start();
cron2.start();

//First get

app.get("/login", async (req, res) => {
  if (req.session.user) {
    const user = (
      await query("SELECT * FROM users WHERE id = ?", [req.session.user.id])
    )[0];

    return returnMsg(res, { loggedIn: true, userData: user });
  }

  return returnMsg(res, { loggedIn: false });
});

app.get("/logout", (req, res) => {
  req.session.destroy();

  return returnMsg(res, "Pomyślnie wylogowano!");
});

//Register

app.post("/register", async (req, res) => {
  const { name, login, pass, pass2, email, sex, savings, current_balance } =
    req.body;

  const userExists = await query("SELECT * from users WHERE login = ?", [
    login,
  ]);

  if (userExists.length) {
    return returnMsg(res, "Taki użytkownik istnieje.", 409);
  }
  if (pass != pass2) {
    return returnMsg(res, "Hasła różnią się!", 400);
  }
  if (login.length < 5) {
    return returnMsg(res, "Login jest za krótki!", 400);
  }

  const hash = await bcrypt.hash(pass, saltRounds);
  const results = await query(
    "INSERT INTO users(name, login, pass, email, sex, savings, current_balance) VALUES (?,?,?,?,?,?,?)",
    [
      name,
      login,
      hash,
      email,
      sex,
      Number(savings),
      Number(current_balance).toFixed(2),
    ]
  );

  return returnMsg(res, "Rejestracja pomyślna!", 201);
});

//Login

app.post("/login", async (req, res) => {
  const { login, pass } = req.body;
  const user = await query("SELECT * FROM users WHERE login = ?", [login]);

  if (user.length) {
    const match = await bcrypt.compare(pass, user[0].pass);

    if (match) {
      req.session.user = user[0];

      return returnMsg(res, user[0]);
    } else {
      return returnMsg(res, "Dane są niepoprawne!", 400);
    }
  } else {
    return returnMsg(res, "Dane są niepoprawne!", 400);
  }
});

//GET ALL CATEGORY

app.get("/allcategoryin", async (req, res) => {
  const results = await query("SELECT * FROM category_in");
  if (results.length < 0) {
    return returnMsg(res, "Nie ma takiej kategorii", 401);
  }

  return returnMsg(res, results);
});
app.get("/allcategoryexp", async (req, res) => {
  const results = await query("SELECT * FROM category_exp");
  if (results.length < 0) {
    return returnMsg(res, "Nie ma takiej kategorii", 401);
  }

  return returnMsg(res, results);
});

//ADD INCOME

app.post("/addincome", async (req, res) => {
  const { name, value, id_category, date, id_user, is_cyclic, cyclic_days } =
    req.body;

  const results = await query(
    "INSERT INTO incomes(name, value, id_category, date, id_user, is_cyclic, cyclic_days) VALUES (?,?,?,?,?,?,?)",
    [
      name,
      Number(value),
      Number(id_category),
      date,
      Number(id_user),
      is_cyclic ?? 0,
      cyclic_days ?? null,
    ]
  );
  return returnMsg(res, "Akcja dodana!", 201);
});

app.post("/addexpense", async (req, res) => {
  const { name, value, id_category, date, id_user, is_cyclic, cyclic_days } =
    req.body;

  const results = await query(
    "INSERT INTO expenses(name, value, id_category, date, id_user, is_cyclic, cyclic_days) VALUES (?,?,?,?,?,?,?)",
    [
      name,
      Number(value),
      Number(id_category),
      date,
      Number(id_user),
      is_cyclic ?? 0,
      cyclic_days ?? null,
    ]
  );
  return returnMsg(res, "Akcja dodana!", 201);
});

//UPDATE BALANCE

app.put("/updatebalance", async (req, res) => {
  const { id, current_balance } = req.body;
  const results = await query(
    "UPDATE users SET current_balance = ? WHERE id = ?",
    [Number(current_balance).toFixed(2), id]
  );

  const user = req.session.user;
  user.current_balance = current_balance;

  req.session.user = user;

  return returnMsg(res, "Update", 201);
});

//HISTORY ACTIONS
//History Incomes
app.get("/allincomes", async (req, res) => {
  const results = await query("SELECT * FROM incomes ORDER BY date DESC");
  if (results.length > 0) {
    return returnMsg(res, results, 201);
  }
  return returnMsg(res, "Brak akcji!");
});

//History Expenses

app.get("/allexpenses", async (req, res) => {
  const results = await query("SELECT * FROM expenses ORDER BY date DESC ");
  if (results.length > 0) {
    return returnMsg(res, results, 201);
  }
  return returnMsg(res, []);
});

//Delete Action

app.delete("/deleteincome/:id", async (req, res) => {
  const { id } = req.params.id;
  const results = await query(
    `DELETE FROM incomes WHERE id = ${req.params.id}`
  );
  if (results) {
    return returnMsg(res, "Poprawnie usunięto!", 201);
  } else {
    return returnMsg(res, "Coś poszło nie tak", 401);
  }
});

app.delete("/deleteexpense/:id", async (req, res) => {
  const { id } = req.params.id;
  const results = await query(
    `DELETE FROM expenses WHERE id = ${req.params.id}`
  );
  if (results) {
    return returnMsg(res, "Poprawnie usunięto!", 201);
  } else {
    return returnMsg(res, "Coś poszło nie tak", 401);
  }
});

//AddDebtor

app.post("/adddebtor", async (req, res) => {
  const { name, value, date, id_user } = req.body;

  const results = await query(
    "INSERT INTO debtors(name, value, date, id_user) VALUES (?,?,?,?)",
    [name, Number(value), date, Number(id_user)]
  );
  return returnMsg(res, "Dodano dłużnika", 201);
});

app.get("/alldebtors", async (req, res) => {
  const results = await query("SELECT * FROM debtors ORDER BY date DESC ");
  if (results.length > 0) {
    return returnMsg(res, results, 201);
  }
  return returnMsg(res, "Brak akcji!");
});

app.delete("/deletedebtor/:id", async (req, res) => {
  const { id } = req.params.id;
  const results = await query(
    `DELETE FROM debtors WHERE id = ${req.params.id}`
  );
  if (results) {
    return returnMsg(res, "Poprawnie usunięto!", 201);
  } else {
    return returnMsg(res, "Coś poszło nie tak", 401);
  }
});

//STATS

app.get("/getstatsexpenses", async (req, res) => {
  let idU = req.session.user.id;
  const results = await query(
    `SELECT SUM(expenses.value) AS procent, category_exp.name FROM expenses INNER JOIN category_exp ON category_exp.id = expenses.id_category WHERE expenses.id_user = ${idU} GROUP BY expenses.id_category`
  );
  if (results.length > 0) {
    return returnMsg(res, results, 201);
  }
  return returnMsg(res, "");
});
app.get("/getstatsincomes", async (req, res) => {
  let idU = req.session.user.id;
  const results = await query(
    `SELECT SUM(incomes.value) AS procent, category_in.name FROM incomes INNER JOIN category_in ON category_in.id = incomes.id_category WHERE incomes.id_user = ${idU} GROUP BY incomes.id_category`
  );
  if (results.length > 0) {
    return returnMsg(res, results, 201);
  }
  return returnMsg(res, "");
});

//Second stats

app.get("/getstatstwoexpenses", async (req, res) => {
  let idU = req.session.user.id;
  const results = await query(
    `
SELECT SUM(expenses.value) AS procent, MONTH(expenses.date)
FROM  expenses
WHERE YEAR(expenses.date) = 2020 AND expenses.id_user = ${idU}
GROUP BY MONTH(expenses.date)
`
  );
  if (results.length > 0) {
    return returnMsg(res, results, 201);
  }
  return returnMsg(res, "");
});
//2021
app.get("/getstatstwoexpenses-1", async (req, res) => {
  let idU = req.session.user.id;
  const results = await query(
    `
SELECT SUM(expenses.value) AS procent, MONTH(expenses.date)
FROM  expenses
WHERE YEAR(expenses.date) = 2021 AND expenses.id_user = ${idU}
GROUP BY MONTH(expenses.date)
`
  );
  if (results.length > 0) {
    return returnMsg(res, results, 201);
  }
  return returnMsg(res, "");
});
//2022

app.get("/getstatstwoexpenses-2", async (req, res) => {
  let idU = req.session.user.id;
  const results = await query(
    `
SELECT SUM(expenses.value) AS procent, MONTH(expenses.date)
FROM  expenses
WHERE YEAR(expenses.date) = 2022 AND expenses.id_user = ${idU}
GROUP BY MONTH(expenses.date)
`
  );
  if (results.length > 0) {
    return returnMsg(res, results, 201);
  }
  return returnMsg(res, "");
});

//Second stats

app.get("/getstatstwoincomes", async (req, res) => {
  let idU = req.session.user.id;
  const results = await query(
    `
SELECT SUM(incomes.value) AS procent, MONTH(incomes.date)
FROM  incomes
WHERE YEAR(incomes.date) = 2020 AND incomes.id_user = ${idU}
GROUP BY MONTH(incomes.date)
`
  );
  if (results.length > 0) {
    return returnMsg(res, results, 201);
  }
  return returnMsg(res, "");
});

app.get("/getstatstwoincomes-1", async (req, res) => {
  let idU = req.session.user.id;
  const results = await query(
    `
SELECT SUM(incomes.value) AS procent, MONTH(incomes.date)
FROM  incomes
WHERE YEAR(incomes.date) = 2021 AND incomes.id_user = ${idU}
GROUP BY MONTH(incomes.date)
`
  );
  if (results.length > 0) {
    return returnMsg(res, results, 201);
  }
  return returnMsg(res, "");
});

app.get("/getstatstwoincomes-2", async (req, res) => {
  let idU = req.session.user.id;
  const results = await query(
    `
SELECT SUM(incomes.value) AS procent, MONTH(incomes.date)
FROM  incomes
WHERE YEAR(incomes.date) = 2022 AND incomes.id_user = ${idU}
GROUP BY MONTH(incomes.date)
`
  );
  if (results.length > 0) {
    return returnMsg(res, results, 201);
  }
  return returnMsg(res, "");
});

//Change savings

app.put("/updatesavings", async (req, res) => {
  const { id, savings } = req.body;
  const results = await query("UPDATE users SET savings = ? WHERE id = ?", [
    Number(savings).toFixed(2),
    id,
  ]);

  const user = req.session.user;
  user.savings = savings;

  req.session.user = user;

  return returnMsg(res, "Update", 201);
});

//Change password

app.put("/changepass", async (req, res) => {
  const { id, pass, pass2 } = req.body;
  if (pass != pass2) {
    return returnMsg(res, "Hasła różnią się!", 400);
  }
  const hash = await bcrypt.hash(pass, saltRounds);
  const results = await query("UPDATE users SET pass = ? WHERE id = ?", [
    hash,
    id,
  ]);

  return returnMsg(res, "Zmieniono hasło!", 201);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
