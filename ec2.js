const Future = require('fluture');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });

const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

type id = string;

type DescribeParams = {
  DryRun?: boolean
}
export const describeInstances = (params: DescribeParams) =>
  Future.node(done => ec2.describeInstances(params, done));

type StartParams = {
  InstanceIds: Array<id>,
  DryRun?: boolean,
}
export const startInstances = (params: StartParams) =>
  Future.node(done => ec2.startInstances(params, done));

type StopParams = {
  InstanceIds: Array<id>,
  DryRun?: boolean,
}
export const stopInstances = (params: StopParams) =>
  Future.node(done => ec2.stopInstances(params, done));
