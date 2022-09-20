import {
  DescribeExecutionInput,
  DescribeExecutionOutput,
  ExecutionListItem,
  GetExecutionHistoryInput,
  HistoryEventList,
  ListExecutionsInput,
  StartExecutionInput,
  StopExecutionInput,
} from 'aws-sdk/clients/stepfunctions';
import aws from './aws-client';
import {throttlingBackOff} from './backoff';

export class StepFunctions {
  private readonly client: aws.StepFunctions;

  public constructor(credentials?: aws.Credentials, region?: string) {
    this.client = new aws.StepFunctions({
      credentials,
      region,
    });
  }

  /**
   * list Executions
   */
  async listExecutions(input: ListExecutionsInput): Promise<ExecutionListItem[]> {
    const executionList = [];
    let token;
    do {
      const executions = await throttlingBackOff(() => this.client.listExecutions(input).promise());
      executionList.push(...executions.executions);
      token = executions.nextToken;
    } while (token);
    return executionList;
  }

  /**
   * Run Statemachine
   */
  async startExecution(input: StartExecutionInput): Promise<string> {
    const execution = await throttlingBackOff(() => this.client.startExecution(input).promise());
    return execution.executionArn;
  }

  /**
   * get-execution-history
   */
  async getExecutionHistory(input: GetExecutionHistoryInput): Promise<HistoryEventList> {
    const executionHistory = await throttlingBackOff(() => this.client.getExecutionHistory(input).promise());
    return executionHistory.events;
  }

  /**
   * Stop Statemachine execution
   */
  async stopExecution(input: StopExecutionInput) {
    await throttlingBackOff(() => this.client.stopExecution(input).promise());
  }

  /**
   * describe-execution
   */
  async describeExecution(input: DescribeExecutionInput): Promise<DescribeExecutionOutput> {
    return throttlingBackOff(() => this.client.describeExecution(input).promise());
  }
}
