import { IGameRepo } from "./types";

type IUpdateGamePuzzleState = (deps: {
  gameRepo: IGameRepo;
}) => (params: { gameId: string; newState: string }) => Promise<void>;

export const UpdateGamePuzzleState: IUpdateGamePuzzleState =
  (deps) => async (params) => {
    const game = await deps.gameRepo.get(params.gameId);
    if (!game) {
      throw new Error("Game not found");
    }
    let newPuzzle = { ...game.puzzle, state: params.newState };
    await deps.gameRepo.putPuzzle(game.id, newPuzzle);
  };
