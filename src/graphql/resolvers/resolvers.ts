import seedData from "@/data/seed";
import { IResolvers } from "@graphql-tools/utils";

export const resolvers: IResolvers = {
  Query: {
    menu: () => {
      console.log("Resolving menu:", JSON.stringify(seedData.menu, null, 2));
      return seedData.menu;
    },
    // Add more query resolvers as needed, such as appetizers, entrees, etc.
  },
};
