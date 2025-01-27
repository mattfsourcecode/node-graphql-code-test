import request from "supertest";
import { app, createServer } from "@/server";
import { findAvailablePort } from "@/utils/ports";
import { IncomingMessage, Server, ServerResponse } from "http";

/**
 * This file contains integration tests for the GraphQL server using SuperTest.
 * The test suite runs on a dynamically selected port to avoid conflicts with
 * the development server, allowing both to run simultaneously.
 */

interface GraphQLResponse {
  data?: Record<string, unknown>;
  errors?: Array<{ message: string }>;
}

process.env.NODE_ENV = "test";

let testServer: Server<typeof IncomingMessage, typeof ServerResponse>;

beforeAll(async () => {
  const port: number = await findAvailablePort(4000);
  testServer = await createServer(port.toString());
});

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

// Close the test server after tests are complete
afterAll((done) => {
  testServer.close(done);
});
