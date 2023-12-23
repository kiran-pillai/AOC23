const fs = require('fs');
const util = require('util');
const data = fs.readFileSync('aoc_day4.txt', 'utf8').trim().split('\n');
let cleanedData = data.map((item) => {
  let newObj = { winning_nums: {}, given_nums: {} };
  let unCleanedNumArrays = item.split(':')[1].trim().split('|');

  let winning_nums = unCleanedNumArrays[0].trim().split(' ');
  let given_nums = unCleanedNumArrays[1].trim().split(' ');

  //convert to hashmap for easy lookup
  winning_nums.forEach((item) => {
    if (!isNaN(parseInt(item))) {
      newObj.winning_nums[item] = true;
    }
  });
  given_nums.forEach((item) => {
    if (!isNaN(parseInt(item))) {
      newObj.given_nums[item] = true;
    }
  });
  return newObj;
});
function part1() {
  //ANSWERS:
  // 15205

  const pointsTotal = cleanedData.reduce((acc, game, i) => {
    let given_nums = game.given_nums;
    let winning_nums = game.winning_nums;
    let counter = 0;
    for (const number in given_nums) {
      if (winning_nums[number]) counter++;
    }
    if (counter > 0) {
      acc += 2 ** (counter - 1);
    }
    return acc;
  }, 0);
  return pointsTotal;
}

function part2() {
  //{1:1,2:2,3:4,4:7,5:3}
  //CARD 1 WINNERS: (4) - 2,3,4,5 (COPIES)
  //CARD 2 (1 COPY) WINNERS: (2) - 3,4(COPIES)
  //CARD 3 (3 COPIES) WINNERS: (2) - 4,5 (COPIES)

  //1). CHECK MATCHES AND KEEP TRACK OF TOTAL PER GAME
  //2). USE COUNTER TO FIND SUBSEQUENT GAMES' COPIES (IF OUT OF RANGE TAKE DIFFERENCE OF ARRLENGTH AND INDEX POSITION)
  //3). INCREMENT COUNTER TO SUBSEQUENT GAME FREQUENCY MAP OBJ

  const cardFreqMap = cleanedData.reduce((acc, game, i) => {
    acc[i] = 1;
    return acc;
  }, {});
  let totalCopies = cleanedData.reduce((acc, game, i) => {
    let given_nums = game.given_nums;
    let winning_nums = game.winning_nums;
    let matches = 0;
    for (const number in given_nums) {
      if (winning_nums[number]) matches++;
    }
    if (matches > 0) {
      let nextGames =
        i + matches < cleanedData.length
          ? i + matches
          : cleanedData - i > 0
          ? i + (cleanedData - i)
          : 0;
      let numberOfCurrentCardCopies = cardFreqMap[i];
      let currentIndex = i + 1;
      while (currentIndex <= nextGames) {
        cardFreqMap[currentIndex] += numberOfCurrentCardCopies;
        currentIndex++;
      }
    }
    acc += cardFreqMap[i];

    return acc;
  }, 0);
  return totalCopies;
}
