export type Game = {
  id: string;
  players: Player[];
  puzzle: Puzzle;
};

export type Player = {
  id: string;
  name: string;
};

export type Puzzle = {
  id: string;
  title: string;
  author: string;
  copyright: string;
  note: string;
  width: number;
  height: number;
  clues: string[];
  solution: string;
  state: string;
};
