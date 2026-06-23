import request from "supertest";
import { describe, expect, it, test } from "vitest";

import app from "#app";
import employees from "#db/employees";

describe("Express app", () => {
  it("is defined", () => {
    expect(app).toBeDefined();
  });
  it("responds to requests", async () => {
    const response = await request(app).get("/");
    expect(response).toBeDefined();
  });
});

test("GET / sends the string 'Hello employees!' with status 200", async () => {
  const response = await request(app).get("/");
  expect(response.status).toBe(200);
  expect(response.text).toBe("Hello employees!");
});

test("GET /employees returns the list of employees with status 200", async () => {
  const response = await request(app).get("/employees");
  expect(response.status).toBe(200);
  expect(response.body).toEqual(employees);
});

describe("GET /employees/:id", () => {
  it("sends employee #1 with status 200", async () => {
    const response = await request(app).get("/employees/1");
    const expected = employees.find((employee) => employee.id === 1);
    expect(response.body).toEqual(expected);
  });
  it("sends 404 for non-existent employee", async () => {
    const response = await request(app).get("/employees/999");
    expect(response.status).toBe(404);
  });
});

describe("GET /employees/random", () => {
  it("sends an employee with ID and name", async () => {
    const response = await request(app).get("/employees/random");
    const employee = response.body;
    expect(employee).toHaveProperty("id");
    expect(employee).toHaveProperty("name");
  });

  it("does not send the same employee twice in a row", async () => {
    try {
      const employee1 = await request(app).get("/employees/random");
      const employee2 = await request(app).get("/employees/random");
      expect(employee1.body).not.toEqual(employee2.body);
    } catch (e) {
      e.message += `
        There is a small chance that the same employee is sent twice in a row,
        which will cause this test to fail. Try running the test again!
        This test should pass most of the time.
      `;
      throw e;
    }
  });
});
