import {
  IGame,
  IGameRepo,
  IPuzzleFile,
  IPuzzleFileReader,
  IPuzzleFileRepo,
} from "../core";

function clone<T extends {}>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const InMemoryGameRepo: () => IGameRepo = () => {
  let puzzleEntries: { gameId: string; puzzle: IGame["puzzle"] }[] = [];
  let playerEntries: {
    gameId: string;
    player: { id: string; name: string };
  }[] = [];
  return {
    async get(id) {
      const puzzleEntry = puzzleEntries.find(
        (puzzleEntry) => puzzleEntry.gameId === id
      );

      if (!puzzleEntry) {
        return null;
      }

      return {
        id: puzzleEntry.gameId,
        puzzle: puzzleEntry.puzzle,
        players: playerEntries
          .filter((playerEntry) => playerEntry.gameId === puzzleEntry.gameId)
          .map((playerEntry) => playerEntry.player),
      };
    },
    async find() {
      return puzzleEntries.map((puzzleEntry) => {
        return {
          id: puzzleEntry.gameId,
          puzzle: puzzleEntry.puzzle,
          players: playerEntries
            .filter((playerEntry) => playerEntry.gameId === puzzleEntry.gameId)
            .map((playerEntry) => playerEntry.player),
        };
      });
    },
    async putPuzzle(gameId, puzzle) {
      puzzleEntries = puzzleEntries.filter(
        (puzzleEntry) => puzzleEntry.gameId !== gameId
      );
      puzzleEntries.push({ gameId, puzzle: clone(puzzle) });
    },
    async addPlayer(gameId, player) {
      playerEntries.push({ gameId, player });
    },
    async removePlayer(gameId, playerId) {
      const playerToRemoveIndex = playerEntries.findIndex(
        (playerEntry) =>
          playerEntry.gameId === gameId && playerEntry.player.id === playerId
      );
      if (playerToRemoveIndex !== -1) {
        playerEntries.splice(playerToRemoveIndex, 1);
      }
    },
  };
};

export const InMemoryPuzzleFileRepo: () => IPuzzleFileRepo = () => {
  let puzzles: IPuzzleFile[] = [];
  return {
    async get(id) {
      const puzzle = puzzles.find((puzzle) => puzzle.id === id);
      if (puzzle) {
        return clone(puzzle);
      }

      return null;
    },
    async find() {
      return puzzles.map((puzzle) => clone(puzzle));
    },
    async put(newPuzzle) {
      puzzles = puzzles.filter((puzzle) => puzzle.id !== newPuzzle.id);
      puzzles.push(clone(newPuzzle));
    },
  };
};

export const MockPuzzleFileReader: (
  puzzle?: Partial<IPuzzleFile>
) => IPuzzleFileReader = (puzzle = {}) => {
  return {
    async readFile(_file) {
      return {
        id: "title",
        title: "title",
        author: "author",
        copyright: "copyright",
        note: "note",
        width: 15,
        height: 15,
        clues: ["clue 1", "clue 2"],
        solution: "ABC...DEF",
        state: "A--...D-F",
        hasState: true,
        ...puzzle,
      };
    },
  };
};
