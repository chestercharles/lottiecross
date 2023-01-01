import { Bucket, StackContext, use } from "@serverless-stack/resources";
import { Database } from "./Database";

export function PuzzleBucket({ stack }: StackContext) {
  const table = use(Database);
  const bucket = new Bucket(stack, "Puzzles", {
    notifications: {
      myNotification: {
        function: {
          handler: "functions/puzzlebucket/objectCreated.handler",
          bind: [table],
        },
        events: ["object_created"],
      },
    },
  });

  stack.addOutputs({
    bucketName: bucket.bucketName,
  });

  return bucket;
}
