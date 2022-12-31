import { IGameRepo } from "./types";

type IJoinGame = (deps: {
  gameRepo: IGameRepo;
}) => (params: {
  gameId: string;
  playerName: string;
  playerId: string;
}) => Promise<void>;

export const JoinGame: IJoinGame = (deps) => async (params) => {
  const game = await deps.gameRepo.get(params.gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  game.players.push({
    name: params.playerName,
    id: params.playerId,
  });

  deps.gameRepo.put(game);
};
