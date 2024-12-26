import request from "supertest";
import { app, server } from "../server";

/**
 * NOTE: Testing suite currently requires the dev server on port 3000 to be stopped.
 * TODO: Implement a way to run the tests on a different port.
 */

describe("GraphQL Server", () => {
  it("should return the correct menu data from the GraphQL query", async () => {
    const query = `
      {
        menu {
          appetizers {
            id
            name
            price
          }
        }
      }
    `;

    const response = await request(app)
      .post("/graphql")
      .send({ query })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.data.menu.appetizers).toBeInstanceOf(Array);
    expect(response.body.data.menu.appetizers[0]).toHaveProperty("id");
    expect(response.body.data.menu.appetizers[0]).toHaveProperty("name");
    expect(response.body.data.menu.appetizers[0]).toHaveProperty("price");
  });

  it("should return an error for invalid GraphQL queries", async () => {
    const invalidQuery = `
      {
        menu {
          appetizers {
            invalidField
          }
        }
      }
    `;

    const response = await request(app)
      .post("/graphql")
      .send({ query: invalidQuery })
      .set("Content-Type", "application/json");

    // Expect the response status code to be 200 (or adjust based on documentation)
    expect(response.status).toBe(200);

    // Check if errors exist in the response body
    expect(response.body.errors).toBeDefined();

    // Ensure the error message contains the invalid field
    expect(response.body.errors[0].message).toContain(
      'Cannot query field "invalidField" on type "MenuItem".'
    );
  });
});

// Close the server after tests are complete
afterAll(() => {
  server.close();
});
