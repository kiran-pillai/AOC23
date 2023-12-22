const fs = require('fs');
//where is current directory
const data = fs.readFileSync('aoc_day1.txt', 'utf8').split('\n');

const findSum = data.reduce((accum, item) => {
  let mergedNumber = [];
  let i = 0;
  while (i < item.length) {
    let charCopy = item[i].split('').join('');
    if (Number(charCopy)) mergedNumber.push(charCopy);
    i++;
  }
  accum += Number(mergedNumber[0] + mergedNumber[mergedNumber.length - 1]);
  return accum;
}, 0);

console.log(findSum);
