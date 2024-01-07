const fs = require('fs');
const data = fs
  .readFileSync('aoc_day9.txt', 'utf8')
  .trim()
  .split('\n')
  .reduce((acc, line) => {
    acc.push(
      line
        .split(' ')
        .filter((item) => Number(item) || item === '0')
        .map((item) => Number(item))
    );
    return acc;
  }, []);

/*loop through each subArray
//For each subarray, do a while loop to track the difference of each step -> loop should keep running as along as the differences have non zero val
  //store all the differences in a tracker array
//After the while condition is met-> loop over the tracker array of arrays
  //make a counter variable
  //Take the second to last subArray 
    //take the last value here
  //traverse up and always the last value of the above subArray to the most recently calculated value
  //once your at index 0 -> stop and add up all the calculated values
//Add this value to your global counter and continue traversing
  */

function part1() {
  let start;
  let end;
  let sumOfExtrapolatedValues = data.reduce((acc, valueHistory, i) => {
    if (i === 0) start = performance.now();
    let valueDiffs = [[...valueHistory]];
    let currentIndex = valueDiffs.length - 1;
    while (valueDiffs[currentIndex].some((diff) => diff !== 0)) {
      let nextIndex = valueDiffs.length;
      valueDiffs.push([]);
      for (let i = 0; i < valueDiffs[currentIndex].length - 1; i++) {
        let currentDiff = valueDiffs[currentIndex][i];
        let nextDiff = valueDiffs[currentIndex][i + 1];
        valueDiffs[nextIndex].push(nextDiff - currentDiff);
      }
      currentIndex = valueDiffs.length - 1;
    }
    currentIndex = valueDiffs.length - 1;

    for (let i = valueDiffs.length - 1; i > 0; i--) {
      let currentArr = valueDiffs[i];
      let prevArr = valueDiffs[i - 1];
      let lastValue = currentArr[currentArr.length - 1];
      let prevLastValue = prevArr[prevArr.length - 1];
      prevArr.push(lastValue + prevLastValue);
    }
    acc += valueDiffs[0][valueDiffs[0].length - 1];
    if (i === data.length - 1) end = performance.now();
    return acc;
  }, 0);

  console.log({ sumOfExtrapolatedValues, totalTime: end - start, start, end });
}

// part1();

function part2() {
  let start;
  let end;
  let sumOfExtrapolatedValues = data.reduce((acc, valueHistory, i) => {
    if (i === 0) start = performance.now();
    let valueDiffs = [[...valueHistory]];
    let currentIndex = valueDiffs.length - 1;
    while (valueDiffs[currentIndex].some((diff) => diff !== 0)) {
      let nextIndex = valueDiffs.length;
      valueDiffs.push([]);
      for (let i = 0; i < valueDiffs[currentIndex].length - 1; i++) {
        let currentDiff = valueDiffs[currentIndex][i];
        let nextDiff = valueDiffs[currentIndex][i + 1];
        valueDiffs[nextIndex].push(nextDiff - currentDiff);
      }
      currentIndex = valueDiffs.length - 1;
    }
    currentIndex = valueDiffs.length - 1;

    for (let i = valueDiffs.length - 1; i > 0; i--) {
      let currentArr = valueDiffs[i];
      let prevArr = valueDiffs[i - 1];
      let currFirstValue = currentArr[0];
      let prevFirstValue = prevArr[0];
      prevArr.unshift(prevFirstValue - currFirstValue);
    }
    acc += valueDiffs[0][0];
    if (i === data.length - 1) end = performance.now();
    return acc;
  }, 0);
  console.log({
    sumOfExtrapolatedValues,
    totalTime: end - start,
  });
}
part1();
part2();
