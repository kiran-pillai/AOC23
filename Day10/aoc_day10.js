const fs = require('fs');
const data = fs.readFileSync('aoc_day10.txt', 'utf8').trim().split('\n');
/*
| is a vertical pipe connecting north and south.
- is a horizontal pipe connecting east and west.
L is a 90-degree bend connecting north and east.
J is a 90-degree bend connecting north and west.
7 is a 90-degree bend connecting south and west.
F is a 90-degree bend connecting south and east.
. is ground; there is no pipe in this tile.
S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
*/

//create a function to find S
//Create a function to find out out possible paths from starting point
//. - NO
//- - Yes, if to the right or left of S - RIGHT, LEFT
//| - Yes, if Up or down from S -UP, DOWN
//L - Yes, if down or left from S - DOWN, LEFT
//J - Yes if left or up from S - UP, RIGHT
//7 - Yes, if down or right from S - DOWN, RIGHT
//F - Yes if up or left from S - UP, LEFT
//Create a function to keep moving pointer based on character in path - until we reach back to S
//needs to take into account which direcition we are going:
//have a counter variable
//keep traversing array
//add to coordinates based on condition and read character
//We have to keep into account which direction we are moving - Symbols can move pointers differently based on current direction
function part1() {
  let up = { '|': 'up', 7: 'left', F: 'right' };
  let left = { '-': 'left', L: 'up', F: 'down' };
  let down = { '|': 'down', J: 'left', L: 'right' };
  let right = { '-': 'right', J: 'up', 7: 'down' };

  let lookupMap = { up: up, down: down, right: right, left: left };

  function findS(arr) {
    let i = 0;
    for (const row of arr) {
      let rowArr = row.split('');
      let sIndex = rowArr.findIndex((char) => char === 'S');
      if (sIndex !== -1) {
        return [i, sIndex];
      }
      i++;
    }
  }
  let arrOfArrs = data.reduce((acc, row) => {
    acc.push(row.split(''));
    return acc;
  }, []);
  let s = findS(data);
  function findInitialNextChar(arr, sIndex) {
    let s = arr[sIndex[0]][sIndex[1]];
    let leftValue = arr[sIndex[0]][sIndex[1] - 1];
    let rightValue = arr[sIndex[0]][sIndex[1] + 1];
    let upValue = arr[sIndex[0] - 1][sIndex[1]];
    let downValue = arr[sIndex[0] + 1][sIndex[1]];
    if (up[upValue]) {
      return {
        coordinates: [sIndex[0] - 1, sIndex[1]],
        direction: 'up',
        char: upValue,
        nextDirection: up[upValue],
      };
    } else if (down[downValue]) {
      return {
        coordinates: [sIndex[0] + 1, sIndex[1]],
        direction: 'down',
        char: downValue,
        nextDirection: down[downValue],
      };
    } else if (left[leftValue]) {
      return {
        coordinates: [sIndex[0], sIndex[1] - 1],
        direction: 'left',
        char: leftValue,
        nextDirection: left[leftValue],
      };
    } else if (right[rightValue]) {
      return {
        coordinates: [sIndex[0], sIndex[1] + 1],
        direction: 'right',
        char: rightValue,
        nextDirection: right[rightValue],
      };
    }
  }
  const { coordinates, nextDirection: initialNextDirection } =
    findInitialNextChar(arrOfArrs, s);
  //   console.log({ coordinates, direction, char, initialNextDirection });
  function getNextChar(nextDirection, coordinates) {
    //calculate new coordinates based on nextDirection passed
    //grab the nextChar by indexing the arr with nextCharCoordinates
    //get nextDirection by looking up nextChar in previous nextDirection

    let nextCharCoordinates = [...coordinates];
    switch (nextDirection) {
      case 'up':
        nextCharCoordinates[0] = nextCharCoordinates[0] - 1;
        break;
      case 'down':
        nextCharCoordinates[0] = nextCharCoordinates[0] + 1;
        break;
      case 'left':
        nextCharCoordinates[1] = nextCharCoordinates[1] - 1;
        break;
      case 'right':
        nextCharCoordinates[1] = nextCharCoordinates[1] + 1;
        break;
    }
    let nextChar = arrOfArrs[nextCharCoordinates[0]][nextCharCoordinates[1]];
    return {
      nextCharCoordinates,
      nextChar,
      nextDirection: lookupMap[nextDirection][nextChar],
    };
  }
  //start traversing the loop
  //use nextDirection to add or subtract to coordinates
  //store the nextChar in current at the end of the loop
  //add to counter
  let current = coordinates;
  let nextDirection = initialNextDirection;
  let counter = 0;
  let allCoordinates = [coordinates];
  while (current[0] !== s[0] || current[1] !== s[1]) {
    counter++;
    const { nextCharCoordinates, nextDirection: calculatedNextDirection } =
      getNextChar(nextDirection, current);
    allCoordinates.push(nextCharCoordinates);
    current = nextCharCoordinates;
    nextDirection = calculatedNextDirection;
  }
  console.log(
    'allCoordinates',
    allCoordinates.toSorted(
      ([rowNumberA, columnNumberA], [rowNumberB, columnNumberB]) => {
        if (rowNumberA === rowNumberB) {
          return columnNumberA > columnNumberB ? 1 : -1;
        }
        return rowNumberA - rowNumberB;
      }
    )
  );
  return (counter + 1) / 2;
}
console.log(part1());
function part2() {
  // gather all coordinates contained by loop
  //   append
  // calculate all coordinates not in the loop
}
