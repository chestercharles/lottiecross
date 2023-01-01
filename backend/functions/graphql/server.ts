import { ApolloServer } from "@apollo/server";
import { startServerAndCreateLambdaHandler } from "@as-integrations/aws-lambda";
import { DynamoGameRepo, DynamoPuzzleFileRepo } from "../../dynamo";
import { IGameRepo, IPuzzleFileRepo } from "../../core";
import { GQLResolvers } from "./generated";
import { schema } from "./schema";

type Context = {
  gameRepo: IGameRepo;
  puzzleFileRepo: IPuzzleFileRepo;
};

const resolvers: GQLResolvers<Context> = {
  Query: {
    puzzles: async (_parent, _args, context) => {
      return context.puzzleFileRepo.find();
    },
    games: async (_parent, _args, context) => {
      return context.gameRepo.find();
    },
  },
  Game: {
    puzzle: async (parent, args, context) => {
      return context.puzzleFileRepo.get(parent.puzzle.id);
    },
  },
};

const server = new ApolloServer<Context>({
  typeDefs: schema,
  resolvers,
});

export const handler = startServerAndCreateLambdaHandler(server, {
  context: async () => ({
    gameRepo: DynamoGameRepo(),
    puzzleFileRepo: DynamoPuzzleFileRepo(),
  }),
});
