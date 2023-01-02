import { describe, it, expect } from "vitest";
import { InMemoryGameRepo } from "../test";
import { JoinGame } from "./JoinGame";

describe("JoinGame", () => {
  it("adds a player to a game", async () => {
    const gameRepo = InMemoryGameRepo();

    const existingGameId = "gameId";
    await gameRepo.putPuzzle(existingGameId, {} as any);

    const existingPlayer = { name: "Chester", id: "123456789" };
    await gameRepo.addPlayer(existingGameId, existingPlayer);

    const newPlayerId = "987654321";
    const newPlayerName = "Katie";

    await JoinGame({ gameRepo })({
      gameId: existingGameId,
      playerId: newPlayerId,
      playerName: "Katie",
    });

    const updatedGame = await gameRepo.get(existingGameId);

    expect(updatedGame!.players).toHaveLength(2);

    const newPlayer = updatedGame!.players.find(
      (player) => player.id === newPlayerId
    );
    expect(newPlayer!.name).toEqual(newPlayerName);
  });
});
