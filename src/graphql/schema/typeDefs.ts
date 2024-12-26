import { DocumentNode } from "graphql";
import { gql } from "graphql-tag";

export const typeDefs: DocumentNode = gql`
  type MenuItem {
    id: ID!
    name: String!
    description: String
    halfPrice: Float
    fullPrice: Float
    price: Float
  }

  type Sandwiches {
    description: String!
    cold: [MenuItem!]!
    hot: [MenuItem!]!
  }

  type Option {
    id: ID!
    name: String!
    description: String!
    price: Float
  }

  type Fajitas {
    id: ID!
    description: String!
    price: Float!
    options: [Option!]
  }

  type Tacos {
    id: ID!
    description: String
    price: Float
    options: [Option!]
  }

  type Enchiladas {
    id: ID!
    name: String
    description: String!
    price: Float
    options: [Option!]
    sizes: [Option!]
  }

  type Menu {
    appetizers: [MenuItem!]!
    entrees: [MenuItem!]!
    sandwiches: Sandwiches!
    soupAndSaladCombos: [MenuItem!]!
    fajitas: [Fajitas!]!
    tacos: [Tacos!]!
    enchiladas: [Enchiladas!]!
    quiche: [MenuItem!]!
    greenSalads: [MenuItem!]!
  }

  type Query {
    menu: Menu!
  }
`;
