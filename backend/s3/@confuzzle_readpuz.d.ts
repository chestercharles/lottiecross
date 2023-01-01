// <reference types="node" />

declare module "@confuzzle/readpuz" {
  export type ConfuzzlePuzzle = {
    title: string;
    author: string;
    copyright: string;
    note: string;
    width: number;
    height: number;
    clues: string[];
    solution: string;
    state: string;
    hasState: boolean;
  };
  export function readpuz(
    buf: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>
  ): ConfuzzlePuzzle;
}
