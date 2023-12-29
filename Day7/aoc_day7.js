const fs = require('fs');
const util = require('util');
const data = fs.readFileSync('aoc_day7.txt', 'utf8').trim().split('\n');

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

//do a frequency map of all letters
//check for rules in frequency map
//FIVE OF A KIND {K:5}
//four of a kind + J
//FOUR OF A KIND {K:4,A:1}
//3 of a kind + J
//FULL HOUSE -THREE CARDS SAME THEN TWO CARDS SAME ({K:3,A:2})
//TWO PAIR + J, THREE OF A KIND + J
//THREE OF A KIND - THREE CARDS SAME {K:3,A:1,Q:1}
//TWO PAIR + J
//TWO PAIR - TWO CARDS ARE THE SAME AND TWO CARDS ARE THE SAME, ONE REMAINING CARD ({K:2,Q:2,A:1})
//ONE PAIR - TWO CARDS SAME, THREE CARDS DIFFERENT - {K:2,A:1,Q:1,J:1}
//HIGH CARD - FIVE DISTINCT CARDS - {K:1,A:1,Q:1,J:1,2:1}

//MAP ARRAY OF ARRAYS AND MAKE FREQ MAP
//USE A OF As TO RANK ALL CARDS ->ASSIGN A RANK IN REDUCE FUNCTION
//SORT THE ARRAY BASED ON RANK
//PARTITION ARRAYS BASED ON RANK AND SORT BASED ON TIEBREAKER RULES
//COMPARE LETTER BY LETTER
//MERGE SORTED PARTITION ARRAYS BACK TOGETHER

function findType(freqMap, flag) {
  let freqValues = Object.values(freqMap);
  let freqCards = Object.keys(freqMap);
  flag && console.log({ freqValues, freqCards });
  //five of a kind
  if (freqCards.length === 1) {
    return 7;
  }
  //high card
  else if (freqCards.length === 5) return 1;
  //four of a kind
  else if (
    freqCards.length === 2 &&
    freqValues.length === 2 &&
    freqValues.includes(4)
  )
    return 6;
  //fullhouse
  else if (
    freqCards.length === 2 &&
    freqValues.length === 2 &&
    freqValues.includes(3) &&
    freqValues.includes(2)
  )
    return 5;
  //three of a kind
  else if (
    freqCards.length === 3 &&
    freqValues.length === 3 &&
    freqValues.filter((val) => val === 1).length === 2 &&
    freqValues.includes(3)
  )
    return 4;
  //two pair
  else if (
    freqCards.length === 3 &&
    freqValues.filter((val) => val === 2).length === 2 &&
    freqValues.filter((val) => val === 1).length === 1
  )
    return 3;
  //one pair
  else if (
    freqCards.length === 4 &&
    freqValues.filter((val) => val === 1).length === 3 &&
    freqValues.includes(2)
  )
    return 2;
}

//PART2 ANSWERS
//249514666 - TOO LOW
//249,631,254
function findType2(freqMap, flag) {
  let freqValues = Object.values(freqMap);
  let freqCards = Object.keys(freqMap);
  let mostFreqCard = Object.entries(freqMap).reduce(
    (acc, [key, value]) => (key !== 'J' ? Math.max(value, acc) : acc),
    0
  );

  let numberOfJs = freqMap['J'] ?? 0;

  const fourOfAKind =
    !numberOfJs &&
    freqCards.length === 2 &&
    freqValues.length === 2 &&
    freqValues.includes(4);

  const fullHouse =
    !numberOfJs &&
    freqCards.length === 2 &&
    freqValues.length === 2 &&
    freqValues.includes(3) &&
    freqValues.includes(2);

  const threeOfAKind =
    !numberOfJs &&
    freqCards.length === 3 &&
    freqValues.length === 3 &&
    freqValues.filter((val) => val === 1).length === 2 &&
    freqValues.includes(3);

  const twoPair =
    !numberOfJs &&
    freqCards.length === 3 &&
    freqValues.filter((val) => val === 2).length === 2 &&
    freqValues.filter((val) => val === 1).length === 1;

  const onePair =
    !numberOfJs &&
    freqCards.length === 4 &&
    freqValues.filter((val) => val === 1).length === 3 &&
    freqValues.includes(2);

  const highCard = freqCards.length === 5;
  //five of a kind
  //JJJJK -> {J:4,K:1}
  //JJJKK -> {J:3,K:2}
  //J6J66
  if (freqCards.length === 1 || mostFreqCard + numberOfJs === 5) {
    return 7;
  }
  //{J:2,K:1,Q:2}

  //four of a kind
  else if (fourOfAKind || (numberOfJs && mostFreqCard + numberOfJs === 4))
    return 6;
  //fullhouse
  //{J:1,K:2,Q:2}
  //{J:1,K:3,Q:1}
  //includes a 3 or a 2 -> if three get
  else if (
    fullHouse ||
    (numberOfJs &&
      freqValues.includes(2) &&
      freqCards.length === 3 &&
      numberOfJs === 1)
  )
    return 5;
  //three of a kind
  else if (threeOfAKind || (numberOfJs && mostFreqCard + numberOfJs === 3))
    return 4;
  //two pair
  else if (twoPair) return 3;
  //one pair
  else if (onePair || (highCard && numberOfJs)) return 2;
  //high card
  else if (highCard) return 1;
}

let card_values = {
  A: 13,
  K: 12,
  Q: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  J: 1,
};

//ANSWERS:
// 247,432,253 (too low)
// 248,559,379
function getTotalWinnings(part) {
  const cleanedData = data.map((item) => item.split(' '));
  const rankedCards = cleanedData.reduce((acc, handEntries) => {
    const [hand, bid] = handEntries;
    let freqMap = hand.split('').reduce((acc, card) => {
      if (!acc[card]) {
        acc[card] = 1;
      } else {
        acc[card] = acc[card] + 1;
      }
      return acc;
    }, {});
    let type = part === 'part1' ? findType(freqMap) : findType2(freqMap);
    let handObj = { hand, bid, type };
    acc.push(handObj);
    return acc;
  }, []);
  let partitionedCards = rankedCards.toSorted((a, b) => {
    if (a.type === b.type) {
      let handA = a.hand;
      let handB = b.hand;

      for (let i = 0; i < a.hand.length; i++) {
        let currentCardA = handA[i];
        let currentCardB = handB[i];

        if (card_values[currentCardA] !== card_values[currentCardB]) {
          if (card_values[currentCardA] < card_values[currentCardB]) return -1;
          return 1;
        }
      }
    }
    return a.type - b.type;
  });
  return partitionedCards.reduce(
    (acc, item, i) => (acc += Number(item.bid) * (i + 1)),
    0
  );
}
console.log(getTotalWinnings('part1'));
console.log(getTotalWinnings('part2'));
