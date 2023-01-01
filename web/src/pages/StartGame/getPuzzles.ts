import { gql } from "@apollo/client/core";
import { query } from "svelte-apollo";
import type {
  GQLPuzzleListQuery,
  GQLPuzzleListQueryVariables,
} from "../../graphql/generated";

export const getPuzzles = () =>
  query<GQLPuzzleListQuery, GQLPuzzleListQueryVariables>(gql`
    query PuzzleList {
      puzzles {
        id
      }
    }
  `);
