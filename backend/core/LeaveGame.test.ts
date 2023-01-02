import { describe, it, expect } from "vitest";
import { InMemoryGameRepo } from "../test";
import { LeaveGame } from "./LeaveGame";
import { IGame } from "./types";

describe("LeaveGame", () => {
  it("removes a player from a game", async () => {
    const gameRepo = InMemoryGameRepo();

    const playerToLeaveId = "123456789";

    const existingGame: IGame = {
      id: "gameId",
      puzzle: {} as any,
      players: [
        { name: "Chester", id: playerToLeaveId },
        { name: "Katie", id: "987654321" },
      ],
    };
    await gameRepo.putPuzzle(existingGame.id, existingGame.puzzle);
    await gameRepo.addPlayer(existingGame.id, existingGame.players[0]);
    await gameRepo.addPlayer(existingGame.id, existingGame.players[1]);

    await LeaveGame({ gameRepo })({
      gameId: existingGame.id,
      playerId: playerToLeaveId,
    });

    const updatedGame = await gameRepo.get(existingGame.id);

    expect(updatedGame!.players).toHaveLength(1);
    const playerHasLeft = updatedGame!.players.every(
      (player) => player.id !== playerToLeaveId
    );
    expect(playerHasLeft).toBeTruthy();
  });
});
