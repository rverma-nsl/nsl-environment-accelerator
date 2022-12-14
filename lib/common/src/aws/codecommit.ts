import aws from './aws-client';
import {
    BatchGetRepositoriesOutput,
    CreateCommitInput,
    CreateRepositoryOutput,
    DeleteFileInput,
    DeleteFileOutput,
    GetBranchOutput,
    GetFileOutput,
    PutFileInput,
    PutFileOutput,
} from 'aws-sdk/clients/codecommit';
import {throttlingBackOff} from './backoff';

export class CodeCommit {
  private readonly client: aws.CodeCommit;

  public constructor(credentials?: aws.Credentials, region?: string) {
    this.client = new aws.CodeCommit({
      credentials,
      region,
    });
  }

  /**
   * Get File from Code Commit
   * @param repositoryName
   * @param filePath
   */
  async getFile(repositoryName: string, filePath: string, commitId?: string): Promise<GetFileOutput> {
    return throttlingBackOff(() =>
      this.client
        .getFile({
          repositoryName,
          filePath,
          commitSpecifier: commitId!,
        })
        .promise(),
    );
  }

  /**
   * Put File from Code Commit
   * @param putFileInput
   */
  async putFile(putFileInput: PutFileInput): Promise<PutFileOutput> {
    return throttlingBackOff(() => this.client.putFile(putFileInput).promise());
  }

  /**
   * Get Repository from Code Commit
   * @param repositoryName
   */
  async batchGetRepositories(repositoryNames: string[]): Promise<BatchGetRepositoriesOutput> {
    return throttlingBackOff(() =>
      this.client
        .batchGetRepositories({
          repositoryNames,
        })
        .promise(),
    );
  }

  /**
   * Get Branch from Repository in Code Commit
   * @param repositoryName
   * @param branchName
   */
  async getBranch(repositoryName: string, branchName: string): Promise<GetBranchOutput> {
    return throttlingBackOff(() =>
      this.client
        .getBranch({
          repositoryName,
          branchName,
        })
        .promise(),
    );
  }

  /**
   * Create Repository in Code Commit
   * @param repositoryName
   */
  async createRepository(repositoryName: string, repositoryDescription: string): Promise<CreateRepositoryOutput> {
    return throttlingBackOff(() =>
      this.client
        .createRepository({
          repositoryName,
          repositoryDescription,
        })
        .promise(),
    );
  }

  /**
   * Create Commit in Code Commit Repository
   * @param input: CreateCommitInput
   */
  async commit(input: CreateCommitInput): Promise<string> {
    const response = await throttlingBackOff(() => this.client.createCommit(input).promise());
    return response.commitId!;
  }

  /**
   * Put File from Code Commit
   * @param putFileInput
   */
  async deleteFile(input: DeleteFileInput): Promise<DeleteFileOutput> {
    return throttlingBackOff(() => this.client.deleteFile(input).promise());
  }

  /**
   * Create Branch in Code Commit Repository
   * @param repositoryName
   * @param branchName
   * @param commitId
   */
  async createBranch(repositoryName: string, branchName: string, commitId: string) {
    return throttlingBackOff(() =>
      this.client
        .createBranch({
          branchName,
          commitId,
          repositoryName,
        })
        .promise(),
    );
  }

  /**
   * Update Default branch of Code Commit Repository
   * @param repositoryName
   * @param branchName
   */
  async updateDefaultBranch(repositoryName: string, branchName: string) {
    return throttlingBackOff(() =>
      this.client
        .updateDefaultBranch({
          repositoryName,
          defaultBranchName: branchName,
        })
        .promise(),
    );
  }
}
