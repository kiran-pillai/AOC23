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

// logNestedObjects(Object.values(mapLookups).toReversed());

function part1(initialSourceValues) {
  let finalSourceValues = Object.values(mapLookups).reduce(
    (acc, map, index) => {
      let sourceArr = index === 0 ? initialSourceValues : [...acc];
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
        let sorted = map.reduce(
          (acc, item) => Math.min(item[1], acc),
          Infinity
        );
        return sorted;
        // return acc.reduce(
        //   (lowestNumber, number) => Math.min(number, lowestNumber),
        //   Infinity
        // );
      }
      return acc;
    },
    []
  );
  return finalSourceValues;
}
// console.log(part1([25265009]));
let current;
let seedArrPart2 = seedArr
  .reduce((acc, number, i) => {
    if (i % 2 === 0) {
      current = { rangeStart: number };
    } else {
      current = { ...current, range: number };
      acc.push(current);
    }
    return acc;
  }, [])
  ?.reduce((acc, row, index) => {
    const { rangeStart, range } = row;
    acc = Math.min(acc, range);
    return acc;
  }, Infinity);

let mapLookupValues = Object.values(mapLookups);
const smallestDestinationValue = mapLookupValues[
  mapLookupValues.length - 1
].reduce(
  (acc, row, i) => {
    const [destRangeStart, sourceRangeStart, rangeLength] = row;
    let newObj =
      acc.destRangeStart < destRangeStart
        ? { ...acc }
        : { destRangeStart, sourceRangeStart, rangeLength };
    acc = { ...newObj };
    return acc;
  },
  { destRangeStart: Infinity }
);
console.log('smallestDestinationValue', smallestDestinationValue);

//PART 2
//REVERSE ENGINEER
//REVERSE OBJECT VALUES ARRAY AND GRAB SMALLEST STARTING VALUE FOR DESTINATION ITEM[0]
//MOVE (SOURCE START RANGE AND RANGE) UP TO THE NEXT MAP AND CHECK IF ANY MAP'S DESTINATION START RANGE IS >=PREV SOURCE START RANGE AND PREV TOTAL RANGE <= NEW TOTAL RANGE
//IF THEY ARE, TAKE SMALLEST POSSIBLE VALUE (COMPARE WITH TEMP VAR) AND MOVE NEW SOURCE START RANGE AND RANGE TO NEXT MAP

let smallestSourceValue = mapLookupValues
  .toReversed()
  ?.reduce((acc, map, i) => {
    const [prevDestRangeStart, prevSourceRangeStart, prevRangeLength] = [
      ...acc,
    ];
    let prevTotalRange = prevDestRangeStart + prevRangeLength - 1;
    let minValue = [Infinity, Infinity, Infinity];
    if (i === 0) console.log('initialAccum', { acc });
    for (const row of map) {
      let [destRangeStart, sourceRangeStart, rangeLength] = row;
      let totalRange = destRangeStart + rangeLength - 1;
      if (destRangeStart === 36297311)
        console.log('debug here', {
          prevTotalRange,
          destRangeStart,
          prevDestRangeStart,
          acc,
        });
      if (
        destRangeStart >= prevDestRangeStart &&
        destRangeStart < prevTotalRange
      ) {
        if (destRangeStart < minValue.destRangeStart) {
          minValue = { ...row };
        }
      }
    }
    acc = !minValue.includes(Infinity) ? minValue : [...acc];
    return acc;
  }, Object.values(smallestDestinationValue));
console.log({
  smallestSourceValue,
});
