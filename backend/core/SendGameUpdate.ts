import { IGameRepo, IPlayerService } from "./types";

type ISendGameUpdate = (deps: {
  playerService: IPlayerService;
  gameRepo: IGameRepo;
}) => (params: { gameId: string }) => Promise<void>;

export const SendGameUpdate: ISendGameUpdate = (deps) => async (params) => {
  const game = await deps.gameRepo.get(params.gameId);
  if (!game) {
    throw new Error("Game not found");
  }

  await Promise.all(
    game.players.map(async (player) =>
      deps.playerService.sendGameUpdate(player.id, game)
    )
  );
};
