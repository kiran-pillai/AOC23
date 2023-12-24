const fs = require('fs');
const data = fs.readFileSync('aoc_day5.txt', 'utf8').trim().split('\n');
const util = require('util');

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

//destination range start, source range start, range length
//stop once we hit max value in lookup array (seeds)
//create new lookup array after each "dict iteration"
let seedArr = data[0]
  .split(':')[1]
  .split(' ')
  .slice(1)
  .map((item) => Number(item));
let currentProp;
let mapLookups = data
  .slice(2)
  .filter((item) => item)
  .reduce((acc, item) => {
    if (item.includes('map')) {
      currentProp = item;
      acc[item] = [];
    } else {
      let row = item.split(' ');
      let numbers = row.map((item) => Number(item));
      acc[currentProp].push(numbers);
    }
    return acc;
  }, {});

function part1() {
  let finalSourceValues = Object.values(mapLookups).reduce(
    (acc, map, index) => {
      let sourceArr = index === 0 ? seedArr : [...acc];
      let nextSource = [];
      for (const row of map) {
        //find if any sources are <=the totalRange of the row
        //if they are splice them out of sourceArr and into new array to iterate over
        //find destination value of source values
        let [destRangeStart, sourceRangeStart, rangeLength] = row;
        let totalRange = sourceRangeStart + rangeLength - 1;
        let foundSourceValues = sourceArr.filter(
          (value) => sourceRangeStart <= value && totalRange >= value
        );
        if (foundSourceValues.length) {
          foundSourceValues.forEach((foundSourceVal) => {
            let difference = foundSourceVal - sourceRangeStart;
            let sourceDestination = difference + destRangeStart;
            nextSource.push(sourceDestination);
          });
          //update sourceArr so we don't check already found source numbers
          sourceArr = sourceArr.filter(
            (num) => !foundSourceValues.includes(num)
          );
        }
      }

      if (sourceArr.length) {
        nextSource = nextSource.concat(sourceArr);
      }
      acc = [...nextSource];
      if (index === Object.values(mapLookups)?.length - 1) {
        return acc.reduce(
          (lowestNumber, number) => Math.min(number, lowestNumber),
          Infinity
        );
      }
      return acc;
    },
    []
  );
  return finalSourceValues;
}
console.log(part1());
