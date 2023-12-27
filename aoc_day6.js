const fs = require('fs');
const util = require('util');
const data = fs.readFileSync('aoc_day6.txt', 'utf8').trim().split('\n');

let cleanData = (_data) => {
  let map = [];
  let times = _data[0].match(/[\d]+/g);
  let distances = _data[1].match(/[\d]+/g);
  //   console.log({ times, distances });
  for (let i = 0; i < times.length; i++) {
    map.push([Number(times[i]), Number(distances[i])]);
  }
  return map;
};

const logNestedObjects = (params, identifier) => {
  if (!Array.isArray(params)) {
    console.log(
      identifier,
      util.inspect(params, false, null, true /* enable colors */)
    );
  } else {
    params.forEach((param) => {
      console.log(
        identifier,
        util.inspect(param, false, null, true /* enable colors */)
      );
    });
  }
};

function part1(input) {
  let numberOfWays = 1;
  for (let race of input) {
    const [time, record] = race;
    let counter = 0;
    //diff of charge time and time * charge time= distance
    for (let i = 0; i <= time; i++) {
      if ((time - i) * i > record) {
        counter++;
      }
    }
    numberOfWays *= counter;
  }
  return numberOfWays;
}
console.log(part1(cleanData(data)));
