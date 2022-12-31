export type IGame = {
  id: string;
  puzzle: IPuzzle;
  players: { name: string; id: string }[];
};

export type IPuzzle = {
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

export type IPuzzleFile = {
  id: string;
  path: string;
};

export interface IGameRepo {
  get(id: string): Promise<IGame | null>;
  find(): Promise<IGame[]>;
  put(game: IGame): Promise<void>;
}

export interface IPuzzleFileRepo {
  get(id: string): Promise<IPuzzleFile | null>;
  find(): Promise<IPuzzleFile[]>;
  put(puzzle: IPuzzleFile): Promise<void>;
}

export type Move = {
  tileNumber: string;
  tileValue: string;
};

export interface IPuzzleFileReader {
  readFile(file: string): Promise<IPuzzle>;
}

export interface ICollaborationService {
  broadcastMove(playerId: string, move: Move): Promise<void>;
}
