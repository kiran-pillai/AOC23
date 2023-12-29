const fs = require('fs');
const util = require('util');
const data = fs.readFileSync('aoc_day2.txt', 'utf8').split('\n');

let cleanedData = data.map((item) => {
  let newObj = {};
  let object = item.split(':')[0];
  let key = object.split(' ')[1];
  newObj['id'] = Number(key);

  let entries = item.split(':')[1].split(';');
  let games = entries.map((entry) => {
    let colorMap = {};
    let colorEntries = entry.split(',');
    colorEntries.forEach((colorEntry) => {
      let trimmedColor = colorEntry.trim();
      let [freq, colorName] = trimmedColor.split(' ');
      colorMap[colorName] = Number(freq);
    });
    return colorMap;
  });
  newObj['games'] = games;
  return newObj;
});

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

// logNestedObjects([cleanedData], 'cleanedData');

const GAMEPLAYED = { red: 12, green: 13, blue: 14 };
let validGames = [];
const getValidGames = () => {
  let finalResult = cleanedData.reduce((acc, entry) => {
    let gameIsValid = true;
    entry.games.forEach((game) => {
      if (game['blue'] && game['blue'] > GAMEPLAYED['blue']) {
        return (gameIsValid = false);
      }
      if (game['red'] && game['red'] > GAMEPLAYED['red']) {
        return (gameIsValid = false);
      }
      if (game['green'] && game['green'] > GAMEPLAYED['green']) {
        return (gameIsValid = false);
      }
    });
    if (gameIsValid) {
      acc += entry.id;
      validGames.push(entry.id);
    } else {
    }

    return acc;
  }, 0);
  return finalResult;
};

//part 2

let sumOfPowers = cleanedData.reduce((acc, entry) => {
  let colorMap = {};
  entry.games.forEach((game) => {
    if (!colorMap['red'] && game['red']) colorMap['red'] = game['red'];
    if (!colorMap['green'] && game['green']) colorMap['green'] = game['green'];
    if (!colorMap['blue'] && game['blue']) colorMap['blue'] = game['blue'];
    else {
      game['red'] && (colorMap['red'] = Math.max(colorMap['red'], game['red']));
      game['green'] &&
        (colorMap['green'] = Math.max(colorMap['green'], game['green']));
      game['blue'] &&
        (colorMap['blue'] = Math.max(colorMap['blue'], game['blue']));
    }
  });
  console.log(colorMap);
  let power = colorMap['red'] * colorMap['green'] * colorMap['blue'];
  acc += power;
  return acc;
}, 0);
console.log(sumOfPowers);
