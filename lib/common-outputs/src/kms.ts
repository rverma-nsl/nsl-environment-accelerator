import * as t from 'io-ts';
import {createStructuredOutputFinder} from './structured-output';
import {StackOutput} from './stack-output';

export const DefaultKmsOutput = t.interface(
  {
    encryptionKeyName: t.string,
    encryptionKeyId: t.string,
    encryptionKeyArn: t.string,
  },
  'DefaultKms',
);

export type EbsKmsOutput = t.TypeOf<typeof DefaultKmsOutput>;

export const DefaultKmsOutputFinder = createStructuredOutputFinder(DefaultKmsOutput, finder => ({
  findOneByName: (props: { outputs: StackOutput[]; accountKey: string; region?: string }) =>
    finder.tryFindOne({
      outputs: props.outputs,
      accountKey: props.accountKey,
      region: props.region,
    }),
}));
