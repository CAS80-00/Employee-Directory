import express from "express";
import employees from "./db/employees.js";

const app = express();

// 1. GET / - Base Route
app.get("/", (req, res) => {
  res.send("Hello employees!");
});

// 2. GET /employees/random - Specific static path (MUST be before /:id)
app.get("/employees/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * employees.length);
  const randomEmployee = employees[randomIndex];
  res.json(randomEmployee);
});

// 3. GET /employees - Fetch all employees (MUST be before /:id)
app.get("/employees", (req, res) => {
  res.json(employees);
});

// 4. GET /employees/:id - Dynamic parameter route
app.get("/employees/:id", (req, res) => {
  // Convert URL parameter string (e.g., "1") into a strict Number (1)
  const id = Number(req.params.id);

  const employee = employees.find((emp) => emp.id === id);

  if (!employee) {
    return res.status(404).send(`No employee found with id: ${id}`);
  }

  res.json(employee);
});

// Export using ES Module default syntax to match Vitest expectations
export default app;
