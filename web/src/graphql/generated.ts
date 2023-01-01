export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type GQLGame = {
  __typename?: 'Game';
  id: Scalars['String'];
  puzzle?: Maybe<GQLPuzzle>;
};

export type GQLMutation = {
  __typename?: 'Mutation';
  startGame: GQLGame;
};


export type GQLMutationStartGameArgs = {
  input: GQLStartGameInput;
};

export type GQLPuzzle = {
  __typename?: 'Puzzle';
  id: Scalars['String'];
};

export type GQLQuery = {
  __typename?: 'Query';
  games: Array<GQLGame>;
  puzzles: Array<GQLPuzzle>;
};

export type GQLStartGameInput = {
  gameId: Scalars['String'];
  puzzleId: Scalars['String'];
};

export type GQLPuzzleListQueryVariables = Exact<{ [key: string]: never; }>;


export type GQLPuzzleListQuery = { __typename?: 'Query', puzzles: Array<{ __typename?: 'Puzzle', id: string }> };
