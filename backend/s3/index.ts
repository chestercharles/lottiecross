import AWS from "aws-sdk";
import { Bucket } from "@serverless-stack/node/bucket";
import { readpuz } from "@confuzzle/readpuz";
import { IPuzzleFileReader } from "../core";

export const S3PuzzleFileReader: () => IPuzzleFileReader = () => {
  const S3 = new AWS.S3();
  return {
    readFile: async (file: string) => {
      const object = await S3.getObject({
        Bucket: Bucket.Puzzles.bucketName,
        Key: file,
      }).promise();
      const buf = object.Body!.valueOf() as ArrayBuffer;
      const confuzzlePuzzle = readpuz(buf);
      return {
        ...confuzzlePuzzle,
        id: file,
      };
    },
  };
};
