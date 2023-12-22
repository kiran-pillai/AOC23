const fs = require('fs');
const util = require('util');
const data = fs.readFileSync('aoc_day3.txt', 'utf8').split('\n');

let unAllowedCharacters = new Set();

//FIND UNALLOWED CHARACTERS
data.forEach((row) => {
  row.split('').forEach((char) => {
    if (!char.match(/[0-9]/g) && char !== '.') {
      unAllowedCharacters.add(char);
    }
  });
});

function getYIndices(index) {
  let STRINGLENGTH = 140;
  let start = index - 3;
  let end = index + 4;
  //We want to subtract by 3 and add by 4 if possible

  //start: if we are less than three:
  //take difference of index and 0
  start = start < 0 ? index - 0 : start;

  //end: if end>stringlength+4:
  //take difference between stringlength and 3
  end =
    end > STRINGLENGTH
      ? end - STRINGLENGTH !== 4
        ? STRINGLENGTH
        : undefined
      : end;

  return { start, end };
}
const numbersRegex = /\d+/g;

function getXIndices(index) {
  //right index
  let STRINGLENGTH = 140;

  let leftIdx = index - 3;
  let rightIdx = index + 4;

  rightIdx =
    rightIdx > STRINGLENGTH
      ? rightIdx - STRINGLENGTH !== 4
        ? STRINGLENGTH
        : undefined
      : rightIdx;
  leftIdx = leftIdx < 0 ? undefined : leftIdx;

  return { leftIdx, rightIdx };
}
// //check if subarray has symbols
// const hasSymbols = (str) =>
//   Boolean(str?.split('')?.find((char) => isNaN(char) && char !== '.'));

// let sumOfPartNumbers = data.reduce((acc, row, rowIndex) => {
//   //iterate over matched numbers
//   let numbers = row.matchAll(numbersRegex);
//   for (const number of numbers) {
//     let numValue = Number(number[0]);
//     const { start, end } = getYIndices(number.index, number[0].length);
//     //right index
//     let forwardIdx =
//       number.index === row.length - 1
//         ? undefined
//         : number[0].length + number.index;
//     //left index
//     let prevIdx = number.index === 0 ? undefined : number.index - 1;
//     //grab values
//     let forward = data[rowIndex]?.[forwardIdx];
//     let prev = data[rowIndex]?.[prevIdx];
//     //Does left or right have symbols?
//     let neighborsHaveSymbols =
//       (hasSymbols(prev) ?? false) || (hasSymbols(forward) ?? false);
//     //top values
//     let above = data[rowIndex - 1]?.slice(start, end);
//     //bottom values
//     let below = data[rowIndex + 1]?.slice(start, end);
//     let topFloorHasSymbols = hasSymbols(above) ?? false;
//     let bottomFloorHasSymbols = hasSymbols(below) ?? false;
//     let isPartNumber =
//       topFloorHasSymbols || bottomFloorHasSymbols || neighborsHaveSymbols;
//     if (isPartNumber) acc += numValue;
//   }
//   return acc;
// }, 0);
// console.log(sumOfPartNumbers);

//Part 2

//ANSWERS: 45969777
//47039321 (Too low)
//54631842 (Too low)
//58639121

const getYNeighbors = (str, index, rowIdx, starIdx) => {
  const leftIdx = index - 1;
  const centerIdx = index;
  const rightIdx = index + 1;

  const left = str[leftIdx];
  const center = str[centerIdx];
  const right = str[rightIdx];

  if (isNaN(left) && isNaN(center) && isNaN(right)) return undefined;
  else {
    const gears = [];

    if (!isNaN(left) || !isNaN(center) || !isNaN(right)) {
      let allNumbers = str.matchAll(numbersRegex);

      for (const number of allNumbers) {
        if (rowIdx === 138 && starIdx === 90) {
          console.log({ number });
        }
        if (
          (number.index < leftIdx &&
            number[0].length + number.index < leftIdx) ||
          number.index > rightIdx
        ) {
          continue;
        }

        gears.push(number[0]);
      }
    }
    return gears?.length ? gears : undefined;
  }
};

const getXNeighbors = (str, direction, rowIdx, starIdx) => {
  if (direction === 'right') {
    if (isNaN(str[0])) return undefined;
    else {
      let i = 0;
      let current = str[i];
      let num = '';
      while (!isNaN(current) && i < 3) {
        num += current;
        i++;
        current = str[i];
      }
      return num ? num : undefined;
    }
  } else {
    // if (rowIdx === 137 && starIdx === 71) {
    //   console.log({ str: !isNaN(str[str.length - 1]) });
    // }
    if (isNaN(str[str.length - 1])) return undefined;
    else {
      let i = str[str.length - 1];
      let current = str[i];
      let num = '';

      while (!isNaN(current) && i > -1) {
        num = `${current}${num}`;
        i--;
        current = str[i];
      }
      return num ? num : undefined;
    }
  }
};
const starRegex = /[*]/g;
const getPartNumbers = (str) => str?.split('')?.filter((char) => !isNaN(char));
let sumOfGearRatios = data.reduce((acc, row, rowIndex) => {
  let stars = row.matchAll(starRegex);
  for (const star of stars) {
    let partNumbersArr = [];
    //check left, right, top and above

    /*TOP AND BOTTOM
     *have to dynamically check string of .slice(index-1,index+2)
     *if number occurs is in three spots incrementally check to the right and left
     *if number only occurs in middle grab it and return it
     *if number occurs in left or right incrementally increase window and grab them when it ends
     */

    /* LEFT AND RIGHT
     *If number occurs immediatley to right or left incrementally increase window till number stops
     */
    const { start, end } = getYIndices(star.index);
    const { leftIdx, rightIdx } = getXIndices(star.index);
    const topFloor = data[rowIndex - 1]?.slice(start, end);
    const bottomFloor = data[rowIndex + 1]?.slice(start, end);
    const topFloorNeighbors = getYNeighbors(topFloor, 3, rowIndex, star.index);
    const bottomFloorNeighbors = getYNeighbors(
      bottomFloor,
      3,
      rowIndex,
      star.index
    );
    const rightNeighbor = data[rowIndex]?.slice(star.index + 1, rightIdx);
    const leftNeighbor = data[rowIndex]?.slice(leftIdx, star.index);
    const leftNeighbors = getXNeighbors(
      leftNeighbor,
      'left',
      rowIndex,
      star.index
    );
    const rightNeighbors = getXNeighbors(rightNeighbor, 'right');

    const allPossibilities = [
      topFloorNeighbors,
      bottomFloorNeighbors,
      rightNeighbors,
      leftNeighbors,
    ]
      .filter((arr) => arr)
      ?.flat();
    if (allPossibilities?.length == 2) {
      acc += Number(allPossibilities[0]) * Number(allPossibilities[1]);
    }
    // let allPossibilities = [
    //   topFloor,
    //   bottomFloor,
    //   rightNeighbor,
    //   leftNeighbor,
    // ]?.filter((item) => item);
    // if (rowIndex === 51 && star.index === 136) {
    //   console.log('51', {
    //     index: star.index,
    //     topFloor,
    //     bottomFloor,
    //     leftIdx,
    //     rightIdx,
    //     leftNeighbor,
    //     rightNeighbor,
    //     topFloorNeighbors,
    //     bottomFloorNeighbors,
    //   });
    // }
    // console.log({
    //   index: star.index,
    //   topFloor,
    //   bottomFloor,
    //   leftIdx,
    //   rightIdx,
    //   leftNeighbor,
    //   rightNeighbor,
    //   topFloorNeighbors,
    //   bottomFloorNeighbors,
    //   leftNeighbors,
    //   rightNeighbors,
    //   rowIndex,
    // });
    // allPossibilities.forEach((str) => {
    //   if (partNumbersArr?.length < 3) {
    //     const partNumbers = str.match(numbersRegex);
    //     if (partNumbers) partNumbersArr = [...partNumbers, ...partNumbersArr];
    //   }
    // });

    //only add to accumulator if length is exactly 2 as per instructions
    // if (partNumbersArr?.length === 2) {
    //   // console.log({ index: star.index, rowIndex, partNumbersArr });
    //   acc += Number(partNumbersArr[0]) * Number(partNumbersArr[1]);
    // }
  }
  return acc;
}, 0);

console.log({ sumOfGearRatios });
const numberIndices = [];
let input = data;
const resultArray = [];
for (let i = 0; i < input.length; i++) {
  const numbers = input[i].replace(/\./g, ' ');

  for (const match of numbers.matchAll(/\*/g)) {
    for (let j = match.index; j < match.index + match[0].length; j++) {
      const surrounding = [
        (input[i - 1] ?? '')[j - 1] ?? '.',
        (input[i - 1] ?? '')[j] ?? '.',
        (input[i - 1] ?? '')[j + 1] ?? '.',
        (input[i] ?? '')[j - 1] ?? '.',
        (input[i] ?? '')[j] ?? '.',
        (input[i] ?? '')[j + 1] ?? '.',
        (input[i + 1] ?? '')[j - 1] ?? '.',
        (input[i + 1] ?? '')[j] ?? '.',
        (input[i + 1] ?? '')[j + 1] ?? '.',
      ];
      const indices = [
        [i - 1, j - 1],
        [i - 1, j],
        [i - 1, j + 1],
        [i, j - 1],
        [i, j],
        [i, j + 1],
        [i + 1, j - 1],
        [i + 1, j],
        [i + 1, j + 1],
      ];
      const localNumberIndices = [];
      for (let k = 0; k < surrounding.length; k++) {
        if (
          /\d/.test(surrounding[k]) &&
          (!/\d/.test(surrounding[k - 1] ?? '') || k % 3 == 0)
        )
          localNumberIndices.push(indices[k]);
      }
      if (localNumberIndices.length == 2)
        numberIndices.push(...localNumberIndices);
    }
  }
}

for (const index of numberIndices) {
  const [i, j] = index;
  const line = input[i];
  const num = ['', '', '', line[j], '', '', ''];
  if (/\d/.test(line[j - 1] ?? '')) num[2] = line[j - 1];
  if (num[2] != '' && /\d/.test(line[j - 2] ?? '')) num[1] = line[j - 2];
  if (num[1] != '' && /\d/.test(line[j - 3] ?? '')) num[0] = line[j - 3];
  if (/\d/.test(line[j + 1] ?? '')) num[4] = line[j + 1];
  if (num[4] != '' && /\d/.test(line[j + 2] ?? '')) num[5] = line[j + 2];
  if (num[5] != '' && /\d/.test(line[j + 3] ?? '')) num[6] = line[j + 3];
  resultArray.push(num.join(''));
}

console.log(
  resultArray.reduce(
    (a, x, i, r) => a + (i % 2 == 0 ? parseInt(x) * parseInt(r[i + 1]) : 0),
    0
  )
);
