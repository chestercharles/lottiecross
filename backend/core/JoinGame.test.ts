import { describe, it, expect } from "vitest";
import { InMemoryGameRepo } from "../test";
import { JoinGame } from "./JoinGame";
import { IGame } from "./types";

describe("JoinGame", () => {
  function setup() {
    const gameRepo = InMemoryGameRepo();
    const joinGame = JoinGame({ gameRepo });
    return {
      gameRepo,
      joinGame,
    };
  }

  it("adds a player to a game", async () => {
    const gameRepo = InMemoryGameRepo();

    const existingGame: IGame = {
      id: "gameId",
      puzzleId: "puzzleId",
      serializedGame: "serializedGame",
      players: [{ name: "Chester", id: "123456789" }],
    };

    await gameRepo.put(existingGame);

    const newPlayerId = "987654321";
    const newPlayerName = "Katie";

    await JoinGame({ gameRepo })({
      gameId: existingGame.id,
      playerId: newPlayerId,
      playerName: "Katie",
    });

    const updatedGame = await gameRepo.get(existingGame.id);

    expect(updatedGame!.players).toHaveLength(2);

    const newPlayer = updatedGame!.players.find(
      (player) => player.id === newPlayerId
    );
    expect(newPlayer!.name).toEqual(newPlayerName);
  });
});
