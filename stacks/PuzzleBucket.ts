import { Bucket, StackContext } from "@serverless-stack/resources";
import { Database } from "./Database";

export function PuzzleBucket({ stack }: StackContext) {
  const bucket = new Bucket(stack, "Puzzles");
  return bucket;
}
