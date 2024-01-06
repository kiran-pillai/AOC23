const fs = require('fs');
const data = fs.readFileSync('aoc_day8.txt', 'utf8').trim().split('\n');

//While lastVisited!=='ZZZ'
//keep counter of how many loops and multiply by length of directions array
//Loop through directions -> set lastVisited upon last direction
let directions = data[0].split('');
let stringRegex = /[A-Z]+/g;
let directionsMap = { L: 0, R: 1 };

function part1() {
  let vertices = data.slice(2).reduce((acc, vertex) => {
    let allStrings = vertex.match(stringRegex);
    acc.set(allStrings[0], [...allStrings.slice(1)]);
    return acc;
  }, new Map());

  let lastVisited;
  let counter = 0;
  let currentRoute;
  while (lastVisited !== 'ZZZ') {
    directions.forEach((direction, i) => {
      if (counter === 0) currentRoute = vertices.get('AAA');
      counter++;
      let nextRoute = currentRoute[directionsMap[direction]];
      if (i === directions.length - 1) lastVisited = nextRoute;
      currentRoute = vertices.get(nextRoute);
    });
  }
}

function part2() {
  let startingVertices = [];
  let directions = data[0]
    .split('')
    .map((direction) => (direction === 'L' ? 0 : 1));
  let vertices = data.slice(2).reduce((acc, vertex) => {
    let allStrings = vertex.match(stringRegex);
    acc.set(allStrings[0], [...allStrings.slice(1)]);
    if (allStrings[0].endsWith('A')) startingVertices.push(allStrings[0]);
    return acc;
  }, new Map());
  let index = 0;
  let steps = Array(startingVertices.length).fill(0);
  for (let vertex of startingVertices) {
    while (!vertex.endsWith('Z')) {
      for (let direction of directions) {
        steps[index]++;
        vertex = vertices.get(vertex)[direction];
        if (vertex.endsWith('Z')) break;
      }
    }
    index++;
  }
  console.log(lcm(steps));

  function lcm(numbers) {
    return numbers.reduce((acc, b) => (acc * b) / gcd(acc, b));
  }

  function gcd(...numbers) {
    return numbers.reduce((acc, b) => {
      while (b) {
        const t = b;
        b = acc % b;
        acc = t;
        console.log({ t, b, acc });
      }
      return acc;
    });
  }
  // return lcm(...steps);
}

//
part2();
