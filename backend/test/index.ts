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
  let games: IGame[] = [];
  return {
    async get(id) {
      const game = games.find((game) => game.id === id);
      if (game) {
        return clone(game);
      }

      return null;
    },
    async find() {
      return games.map((game) => clone(game));
    },
    async put(newGame) {
      games = games.filter((game) => game.id !== newGame.id);
      games.push(clone(newGame));
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
