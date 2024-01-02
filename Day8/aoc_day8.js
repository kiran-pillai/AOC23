const fs = require('fs');
const data = fs.readFileSync('aoc_day8.txt', 'utf8').trim().split('\n');

//While lastVisited!=='ZZZ'
//keep counter of how many loops and multiply by length of directions array
//Loop through directions -> set lastVisited upon last direction
let directions = data[0].split('');
let stringRegex = /[A-Z]+/g;
let directionsMap = { L: 0, R: 1 };
let vertices = data.slice(2).reduce((acc, vertex) => {
  let allStrings = vertex.match(stringRegex);
  acc.set(allStrings[0], [...allStrings.slice(1)]);
  return acc;
}, new Map());

let lastVisited;
let counter = 0;
while (lastVisited !== 'ZZZ') {
  directions.forEach((direction, i) => {
    if (counter === 0) currentRoute = vertices.get('AAA');
    counter++;
    let nextRoute = currentRoute[directionsMap[direction]];
    if (i === directions.length - 1) lastVisited = nextRoute;
    currentRoute = vertices.get(nextRoute);
  });
}
