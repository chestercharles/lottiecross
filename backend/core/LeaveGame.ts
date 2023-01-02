import { IGameRepo } from "./types";

type ILeaveGame = (deps: {
  gameRepo: IGameRepo;
}) => (params: { gameId: string; playerId: string }) => Promise<void>;

export const LeaveGame: ILeaveGame = (deps) => async (params) => {
  const game = await deps.gameRepo.get(params.gameId);
  if (!game) {
    throw new Error("Game not found");
  }
  await deps.gameRepo.removePlayer(game.id, params.playerId);
};
