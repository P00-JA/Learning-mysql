const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const app = express();
const PORT = 3000;
dotenv.config();

app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.username,
  password:process.env.password,
  database:process.env.databaseName,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to myDataBase!");
});

app.get("/", (req, res) => {
  res.end("API working");
});

//create new employee table
const createEmployeeTable = `CREATE TABLE IF NOT EXISTS employee (id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255),department VARCHAR(255), company VARCHAR(255));`;
connection.query(createEmployeeTable, (error) => {
  if (error) throw error;
  console.log("table created/exits");
});

//employee status table
const employeeStatus = `CREATE TABLE IF NOT EXISTS employeeStatus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    status VARCHAR(255),
    employee_id INT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE ON UPDATE CASCADE
  )`;
connection.query(employeeStatus, (error) => {
  if (error) throw error;
  console.log("employee status table created!");
});

//post request for employee table
app.post("/employee-details", (req, res) => {
  const { name, department, company } = req.body;
  const insertEmployeeQuery = `INSERT INTO employee (name, department, company) VALUES (?, ?, ?)`;

  connection.query(
    insertEmployeeQuery,
    [name, department, company],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//post request for employee status table
app.post("/employee-status", (req, res) => {
  const { name, status, employee_id } = req.body;
  const insertTOEmployeeStatus = `INSERT INTO employeeStatus (name, status,employee_id) VALUES (?, ?,?)`;

  connection.query(
    insertTOEmployeeStatus,
    [name, status, employee_id],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// PUT request for employee table
app.put("/employee-details/:id", (req, res) => {
  const idToUpdate = req.params.id;
  const { name, department, company } = req.body;
  const updatedEmployee = { name, department, company };

  connection.query(
    "UPDATE employee SET ? WHERE id = ?",
    [updatedEmployee, idToUpdate],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// PUT request for employee status table
app.put("/employee-status/:id", (req, res) => {
  const idToUpdate = req.params.id;
  const { name, status, employee_id } = req.body;
  const updatedEmployeeStatus = { name, status, employee_id };

  connection.query(
    "UPDATE employeeStatus SET ? WHERE id = ?",
    [updatedEmployeeStatus, idToUpdate],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//delete request on employee table
app.delete("/employee-details/:id", (req, res) => {
  const idToDelete = req.params.id;
  connection.query(
    "DELETE FROM employee WHERE id = ?",
    [idToDelete],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//delete request on employee status table
app.delete("/employee-status/:id", (req, res) => {
  const idToDelete = req.params.id;
  connection.query(
    "DELETE FROM employeeStatus WHERE id = ?",
    [idToDelete],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//joins
//inner join
app.get("/api/inner-join", (req, res) => {
  const innerJoinQuery = `
    SELECT employee.name, employeeStatus.status
    FROM employee
    INNER JOIN employeeStatus ON employee.id = employeeStatus.employee_id;`;
  connection.query(innerJoinQuery, (error, result) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json(result);
    }
  });
});

//left join
app.get("/api/left-join", (req, res) => {
  const leftJoinQuery = `
    SELECT employee.name, employeeStatus.status
    FROM employee
    LEFT JOIN employeeStatus ON employee.id = employeeStatus.employee_id;`;
  connection.query(leftJoinQuery, (error, result) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json(result);
    }
  });
});

//right join
app.get("/api/right-join", (req, res) => {
  const rightJoinQuery = `
    SELECT employee.name,employee.department,employeeStatus.status
    FROM employee
    RIGHT JOIN employeeStatus ON employee.id = employeeStatus.employee_id;`;
  connection.query(rightJoinQuery, (error, result) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json(result);
    }
  });
});

//cross join
app.get("/api/cross-join", (req, res) => {
  const crossJoinQuery = `
    SELECT employee.name, employeeStatus.status
    FROM employee
    CROSS JOIN employeeStatus;`;
  connection.query(crossJoinQuery, (error, result) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json(result);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
