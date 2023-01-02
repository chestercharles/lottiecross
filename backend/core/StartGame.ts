import {
  IGame,
  IGameRepo,
  IPuzzle,
  IPuzzleFileReader,
  IPuzzleFileRepo,
} from "./types";

type ICreateGame = (deps: {
  gameRepo: IGameRepo;
  puzzleFileRepo: IPuzzleFileRepo;
  puzzleFileReader: IPuzzleFileReader;
}) => (params: { gameId: string; puzzleId: string }) => Promise<void>;

export const StartGame: ICreateGame = (deps) => {
  return async function startGame(params) {
    await assertGameIdIsNotInUse(params.gameId);
    const puzzle = await getPuzzle(params.puzzleId);
    await deps.gameRepo.putPuzzle(params.gameId, puzzle);
  };

  async function assertGameIdIsNotInUse(gameId: string) {
    const game = await deps.gameRepo.get(gameId);

    if (game) {
      throw new Error("Game ID already in use");
    }
  }

  async function getPuzzle(puzzleId: string): Promise<IPuzzle> {
    const puzzleFile = await deps.puzzleFileRepo.get(puzzleId);

    if (!puzzleFile) {
      throw new Error("Puzzle does not exist");
    }

    return deps.puzzleFileReader.readFile(puzzleFile.path);
  }
};
