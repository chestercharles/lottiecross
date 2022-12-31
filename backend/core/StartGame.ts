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
}) => (params: {
  gameId: string;
  puzzleId: string;
  playerName: string;
  playerId: string;
}) => Promise<void>;

export const StartGame: ICreateGame = (deps) => {
  return async function startGame(params) {
    await assertGameIdIsNotInUse(params.gameId);
    const puzzle = await getPuzzle(params.puzzleId);
    const newGame = initializeGame(params, puzzle);
    await save(newGame);
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

  function initializeGame(
    params: {
      gameId: string;
      playerId: string;
      playerName: string;
      puzzleId: string;
    },
    puzzle: IPuzzle
  ): IGame {
    return {
      id: params.gameId,
      puzzle,
      players: [
        {
          id: params.playerId,
          name: params.playerName,
        },
      ],
    };
  }

  async function save(game: IGame) {
    await deps.gameRepo.put(game);
  }
};
