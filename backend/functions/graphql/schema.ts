export const schema = `#graphql
  type Puzzle {
    id: String!
  }

  type Game {
    id: String!
    puzzle: Puzzle
  }

  type Query {
    puzzles: [Puzzle!]!
    games: [Game!]!
  }
`;
