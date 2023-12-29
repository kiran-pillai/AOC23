const fs = require('fs');
const util = require('util');

//where is current directory
const data = fs.readFileSync('aoc_day1.txt', 'utf8').split('\n');
// let data = [
//   'two1nine',
//   'eightwothree',
//   'abcone2threexyz',
//   'xtwone3four',
//   '4nineeightseven2',
//   'zoneight234',
//   '7pqrstsixteen',
// ];
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

const findSum = data.reduce((accum, item, index) => {
  let i = 0;
  let sentence = item.split('');
  let firstNum = sentence.find((char) => Number(char));
  let lastNum = sentence.findLast((char) => Number(char));
  accum += Number(firstNum + lastNum);
  return accum;
}, 0);

let numMap = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};
let keys = Object.keys(numMap);

//ANSWERS:9937 (TOO LOW)
//9959 (TOO LOW)
//55607 (TOO LOW)

// .split(' ')
// .toReversed()
// .join('|')

let wordNumberRegex = /one|two|three|four|five|six|seven|eight|nine/g;
let arr = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];
let newRegex = arr.map((num) => num.split('').toReversed().join('')).join('|');
let backwardsRegex = /eno|owt|eerht|ruof|evif|xis|neves|thgie|enin/g;
console.log({ newRegex });
const findSum2 = data.reduce((accum, item, index) => {
  let sentence = item.split('');
  let wordFirstNumsMatches = [...item.matchAll(wordNumberRegex)];
  let wordLastNumsMatches = [
    ...item.split('').toReversed().join('').matchAll(backwardsRegex),
  ];
  let firstNum = sentence.findIndex((char) => Number(char));
  let firstWordNum = wordFirstNumsMatches?.[0] ?? -1;
  let lastNum = sentence.findLastIndex((char) => Number(char));
  let lastWordNum = wordLastNumsMatches?.[0] ?? -1;
  let first = firstWordNum
    ? firstWordNum.index < firstNum || firstNum === -1
      ? numMap[firstWordNum[0]]
      : sentence[firstNum]
    : sentence[firstNum];
  let last = lastWordNum
    ? item.length - 1 - lastWordNum.index > lastNum || lastNum === -1
      ? numMap[lastWordNum[0].split('').toReversed('').join('')]
      : sentence[lastNum]
    : lastNum;

  accum += Number(first + last);
  // accum.push([first, last], {
  //   firstWordNum,
  //   firstNum,
  //   last: lastWordNum.index,
  //   lastNum,
  //   lastWordNum,
  // });
  return accum;
}, 0);

logNestedObjects({ findSum2 }, '');

// const input = data;
// const NUM_WORDS = {
//   one: 1,
//   two: 2,
//   three: 3,
//   four: 4,
//   five: 5,
//   six: 6,
//   seven: 7,
//   eight: 8,
//   nine: 9,
// };

// const NUM_WORD_ENTRIES = Object.entries(NUM_WORDS);

// function strToNum(str, index) {
//   for (let [word, num] of NUM_WORD_ENTRIES) {
//     if (str.startsWith(word)) {
//       if (index === 1) console.log({ num, str, word });
//       return num;
//     }
//   }

//   // Will get filtered out
//   return '';
// }

// const numbersInLines = input.map((line, index) => {
//   const allNumbers = line
//     .split('')
//     .map((char, i) => {
//       const restOfLineFromChar = line.slice(i);
//       if (index === 1) console.log({ restOfLineFromChar, char });
//       // If we have a digit, return that. Otherwise, look to see if this char could be the start of a number word
//       return /\d/.test(char) ? char : strToNum(restOfLineFromChar, index);
//     })
//     .filter(Boolean);
//   if (index === 1) console.log({ allNumbers });
//   const firstNumber = allNumbers[0];
//   const lastNumber = allNumbers[allNumbers.length - 1];
//   return parseInt(`${firstNumber}${lastNumber}`, 10);
// });

// let sum = 0;
// for (let num of numbersInLines) {
//   sum += num;
// }

// console.log(sum);
