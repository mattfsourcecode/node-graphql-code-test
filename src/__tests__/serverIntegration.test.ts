import request from "supertest";
import { app, server } from "@/server";

/**
 * NOTE: Testing suite currently requires the dev server on port 3000 to be stopped.
 * TODO: Implement a way to run the tests on a different port.
 */

interface GraphQLResponse {
  data?: Record<string, unknown>;
  errors?: Array<{ message: string }>;
}

describe("GraphQL Server", () => {
  test("should return the correct menu data from the GraphQL query", async () => {
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
      .set("Content-Type", "application/json")
      .expect(200);

    const graphqlResponse = response.body as GraphQLResponse;
    const menu = graphqlResponse.data?.menu as {
      appetizers: Array<unknown>;
    };

    expect(menu.appetizers).toBeInstanceOf(Array);
    expect(menu.appetizers[0]).toHaveProperty("id");
    expect(menu.appetizers[0]).toHaveProperty("name");
    expect(menu.appetizers[0]).toHaveProperty("price");
  });

  test("should return an error for invalid GraphQL queries", async () => {
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
      .set("Content-Type", "application/json")
      .expect(200);

    const graphqlResponse = response.body as GraphQLResponse;

    expect(graphqlResponse.errors).toBeDefined();
    expect(graphqlResponse.errors?.[0].message).toContain(
      'Cannot query field "invalidField" on type "MenuItem".'
    );
  });
});

// Close the server after tests are complete
afterAll(() => {
  server.close();
});
