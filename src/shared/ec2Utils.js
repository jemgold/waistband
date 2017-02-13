import { compose, concat, equals, evolve, filter, flatten, map, path, pluck,
  prop, sum, take } from 'ramda';

// omg what a yak shave to find prices
// Amazon's pricing API is a 90mb file(!)
// so I'm just going to hardcore prices for now.
// https://aws.amazon.com/ec2/pricing/on-demand/
// (^\S+).+\$(\S+).+$
const prices = {
  't2.nano': 0.0059,
  't2.micro': 0.012,
  't2.small': 0.023,
  't2.medium': 0.047,
  't2.large': 0.094,
  't2.xlarge': 0.188,
  't2.2xlarge': 0.376,
  'm4.large': 0.108,
  'm4.xlarge': 0.215,
  'm4.2xlarge': 0.431,
  'm4.4xlarge': 0.862,
  'm4.10xlarge': 2.155,
  'm4.16xlarge': 3.447,
  'm3.medium': 0.067,
  'm3.large': 0.133,
  'm3.xlarge': 0.266,
  'm3.2xlarge': 0.532,
  'c4.large': 0.1,
  'c4.xlarge': 0.199,
  'c4.2xlarge': 0.398,
  'c4.4xlarge': 0.796,
  'c4.8xlarge': 1.591,
  'c3.large': 0.105,
  'c3.xlarge': 0.21,
  'c3.2xlarge': 0.42,
  'c3.4xlarge': 0.84,
  'c3.8xlarge': 1.68,
  'p2.xlarge': 0.9,
  'p2.8xlarge': 7.2,
  'p2.16xlarge': 14.4,
  'g2.2xlarge': 0.65,
  'g2.8xlarge': 2.6,
  'x1.16xlarge': 6.669,
  'x1.32xlarge': 13.338,
  'r3.large': 0.166,
  'r3.xlarge': 0.333,
  'r3.2xlarge': 0.665,
  'r3.4xlarge': 1.33,
  'r3.8xlarge': 2.66,
  'r4.large': 0.133,
  'r4.xlarge': 0.266,
  'r4.2xlarge': 0.532,
  'r4.4xlarge': 1.064,
  'r4.8xlarge': 2.128,
  'r4.16xlarge': 4.256,
  'i2.xlarge': 0.853,
  'i2.2xlarge': 1.705,
  'i2.4xlarge': 3.41,
  'i2.8xlarge': 6.82,
  'd2.xlarge': 0.69,
  'd2.2xlarge': 1.38,
  'd2.4xlarge': 2.76,
  'd2.8xlarge': 5.52,
};

export const states = {
  pending: 'pending',
  running: 'running',
  shuttingDown: 'shutting-down',
  terminated: 'terminated',
  stopping: 'stopping',
  stopped: 'stopped',
};

// Instance

// isRunning :: Instance -> bool
export const isRunning = compose(
  equals(states.running),
  path(['State', 'Name']),
);

// getPrice :: Instance -> float
export const getPrice = instance =>
  prices[instance.InstanceType];

// Sterilize :: Instance -> Instance
export const sterlize = evolve({
  PublicIpAddress: compose(concat('0.123'), take(6)),
  InstanceId: compose(concat('•••••'), take(6)),
});

// Response
// getAllInstances :: Response -> Instance[]
export const getAllInstances = compose(
  flatten,
  pluck('Instances'),
  prop('Reservations'),
);

// runningInstances :: Response -> integer
export const runningInstanceCost = compose(
  sum,
  map(getPrice),
  filter(isRunning),
  getAllInstances,
);
