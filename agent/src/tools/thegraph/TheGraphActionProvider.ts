import { z } from "zod";
import {
  ActionProvider,
  CreateAction,
  WalletProvider,
} from "@coinbase/agentkit";

// 1. Define the input schema for the GraphQL query action
const GraphQuerySchema = z.object({
  endpoint: z.string().url(),
  query: z.string(),
});

// 2. Implement the custom Action Provider
class TheGraphActionProvider extends ActionProvider<WalletProvider> {
  constructor() {
    super("thegraph-action-provider", []); // unique provider key, no specific required actions
  }

  supportsNetwork = () => true; // support all networks

  @CreateAction({
    name: "graph-query",
    description:
      "Sends a GraphQL query to a The Graph API endpoint and returns the response.",
    schema: GraphQuerySchema,
  })
  async queryGraph(args: z.infer<typeof GraphQuerySchema>): Promise<string> {
    const { endpoint, query } = args;
    try {
      console.log(
        `TheGraphActionProvider: Sending GraphQL query to ${endpoint}`,
      );
      console.log(`TheGraphActionProvider: Query: ${query}`);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `TheGraphActionProvider: Network error ${response.status} - ${errorText}`,
        );
        throw new Error(
          `Network request failed with status ${response.status}: ${errorText}`,
        );
      }

      const result = await response.json();
      console.log("TheGraphActionProvider: Response:", JSON.stringify(result));

      if (result.errors && result.errors.length > 0) {
        const messages = result.errors.map(
          (e: any) => e.message || JSON.stringify(e),
        );
        console.error("TheGraphActionProvider: GraphQL errors:", messages);
        throw new Error(`GraphQL query failed: ${messages.join("; ")}`);
      }

      return JSON.stringify(result.data ?? result);
    } catch (err) {
      console.error("TheGraphActionProvider: Error executing query", err);
      throw err;
    }
  }
}

// 3. Export the provider (factory function)
export const theGraphActionProvider = () => new TheGraphActionProvider();
