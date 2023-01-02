import { IGameRepo, IPlayerService } from "./types";

type IRemoveDisconnectedPlayers = (deps: {
  playerService: IPlayerService;
  gameRepo: IGameRepo;
}) => (params: { gameId: string }) => Promise<void>;

export const RemoveDisconnectedPlayers: IRemoveDisconnectedPlayers =
  (deps) => async (params) => {
    const game = await deps.gameRepo.get(params.gameId);
    if (!game) {
      throw new Error("Game not found");
    }

    for (const player of game.players) {
      const playerIsActive = await deps.playerService.isPlayerStillConnected(
        player.id
      );
      if (!playerIsActive) {
        await deps.gameRepo.removePlayer(game.id, player.id);
      }
    }
  };
