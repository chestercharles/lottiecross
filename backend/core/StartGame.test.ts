import { describe, it, expect } from "vitest";
import {
  InMemoryGameRepo,
  InMemoryPuzzleFileRepo,
  MockPuzzleFileReader,
} from "../test";
import { StartGame } from "./StartGame";
import { IPuzzle, IPuzzleFile } from "./types";

describe("StartGame", () => {
  function setup() {
    const gameRepo = InMemoryGameRepo();
    const puzzleFileRepo = InMemoryPuzzleFileRepo();
    const puzzleFileReader = MockPuzzleFileReader();
    const createGame = StartGame({
      gameRepo,
      puzzleFileRepo,
      puzzleFileReader,
    });
    return {
      gameRepo,
      puzzleFileRepo,
      createGame,
    };
  }

  it("starts a game", async () => {
    const { gameRepo, puzzleFileRepo, createGame } = setup();

    const puzzleFile: IPuzzleFile = {
      id: "puzzleId",
      path: "file",
    };

    await puzzleFileRepo.put(puzzleFile);

    const gameId = "gameId";

    await createGame({
      gameId,
      puzzleId: puzzleFile.id,
      playerId: "playerId",
      playerName: "playerName",
    });

    const newGame = await gameRepo.get(gameId);

    expect(newGame).toBeTruthy();
  });

  it.skip("initializes a game from puzzle", async () => {
    const { gameRepo, puzzleFileRepo, createGame } = setup();

    const puzzleFile: IPuzzleFile = {
      id: "puzzleId",
      path: "file",
    };

    await puzzleFileRepo.put(puzzleFile);

    const gameId = "gameId";

    await createGame({
      gameId,
      puzzleId: puzzleFile.id,
      playerId: "playerId",
      playerName: "playerName",
    });

    const newGame = await gameRepo.get(gameId);

    expect(newGame!.puzzle).toBeTruthy();
  });
});
