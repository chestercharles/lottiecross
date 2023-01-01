import { S3Handler } from "aws-lambda";
import { DynamoPuzzleFileRepo } from "dynamo";

export const handler: S3Handler = async (event) => {
  const s3Record = event.Records[0].s3;
  const Key = s3Record.object.key;
  await DynamoPuzzleFileRepo().put({ id: Key, path: Key });
};
