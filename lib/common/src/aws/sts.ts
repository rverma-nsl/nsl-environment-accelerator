import aws from './aws-client';
import * as sts from 'aws-sdk/clients/sts';
import {throttlingBackOff} from './backoff';

export class STS {
  private readonly client: aws.STS;
  private readonly cache: { [roleArn: string]: aws.Credentials } = {};

  constructor(credentials?: aws.Credentials) {
    let region;
    let endpoint;
    if (process.env.AWS_REGION) {
      region = process.env.AWS_REGION;
      endpoint = `sts.${process.env.AWS_REGION}.amazonaws.com`;
    }

    this.client = new aws.STS({
      credentials,
      region,
      endpoint,
    });
  }

  async getCallerIdentity(): Promise<sts.GetCallerIdentityResponse> {
    return throttlingBackOff(() => this.client.getCallerIdentity().promise());
  }

  async getCredentialsForRoleArn(assumeRoleArn: string, durationSeconds: number = 3600): Promise<aws.Credentials> {
    if (this.cache[assumeRoleArn]) {
      const cachedCredentials = this.cache[assumeRoleArn];
      const currentDate = new Date();
      if (cachedCredentials.expireTime && cachedCredentials.expireTime.getTime() < currentDate.getTime()) {
        return cachedCredentials;
      }
    }

    const response = await throttlingBackOff(() =>
      this.client
        .assumeRole({
          RoleArn: assumeRoleArn,
          RoleSessionName: 'temporary', // TODO Generate a random name
          DurationSeconds: durationSeconds,
        })
        .promise(),
    );

    const stsCredentials = response.Credentials!;
    const credentials = new aws.Credentials({
      accessKeyId: stsCredentials.AccessKeyId,
      secretAccessKey: stsCredentials.SecretAccessKey,
      sessionToken: stsCredentials.SessionToken,
    });
    this.cache[assumeRoleArn] = credentials;
    return credentials;
  }

  async getCredentialsForAccountAndRole(
    accountId: string,
    assumeRole: string,
    durationSeconds?: number,
  ): Promise<aws.Credentials> {
    return this.getCredentialsForRoleArn(`arn:aws:iam::${accountId}:role/${assumeRole}`, durationSeconds);
  }
}
