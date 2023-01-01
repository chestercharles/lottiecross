import { ApolloServer } from "@apollo/server";
import { startServerAndCreateLambdaHandler } from "@as-integrations/aws-lambda";
import { DynamoGameRepo, DynamoPuzzleFileRepo } from "../../dynamo";
import { S3PuzzleFileReader } from "../../s3";
import {
  IGameRepo,
  IPuzzleFileReader,
  IPuzzleFileRepo,
  StartGame,
} from "../../core";
import { schema } from "./schema";
import { GQLResolvers } from "./generated";

type Context = {
  gameRepo: IGameRepo;
  puzzleFileRepo: IPuzzleFileRepo;
  puzzleFileReader: IPuzzleFileReader;
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
  Mutation: {
    startGame: async (_parent, args, context) => {
      await StartGame({
        gameRepo: context.gameRepo,
        puzzleFileRepo: context.puzzleFileRepo,
        puzzleFileReader: context.puzzleFileReader,
      })({
        puzzleId: args.input.puzzleId,
        gameId: args.input.gameId,
      });

      const game = await context.gameRepo.get(args.input.gameId);
      if (!game) {
        throw new Error("Game not found");
      }

      return game;
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
    puzzleFileReader: S3PuzzleFileReader(),
  }),
});
