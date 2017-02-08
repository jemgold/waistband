const { Future } = require('ramda-fantasy');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });

const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

type id = string;

type DescribeParams = {
  DryRun?: boolean
}
export const describeInstances = (params: DescribeParams) =>
  new Future((reject, resolve) =>
    ec2.describeInstances(params, (err, data) => {
      if (err) { reject(err); }
      if (data) { resolve(data); }
    }),
  );

type StartParams = {
  InstanceIds: Array<id>,
  DryRun?: boolean,
}
export const startInstances = (params: StartParams) =>
  new Future((reject, resolve) => {
    ec2.stopInstances(params, (err, data) => {
      if (err) { reject(err); }
      if (data) { resolve(data); }
    });
  });

type StopParams = {
  InstanceIds: Array<id>,
  DryRun?: boolean,
}
export const stopInstances = (params: StopParams) =>
  new Future((reject, resolve) => {
    ec2.stopInstances(params, (err, data) => {
      if (err) { reject(err); }
      if (data) { resolve(data); }
    });
  });
