import redis

r = redis.Redis(
  host='redis-11073.c1.ap-southeast-1-1.ec2.cloud.redislabs.com',
  port=11073,
  password='rfJeWDL8kH7DZ2Wrwl4FOsZtVmzB9CVF',
  decode_responses=True)

print(r.ping(), "masuk connect")