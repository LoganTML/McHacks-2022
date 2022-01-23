/*jshint esversion: 6 */
/*jshint browser: true */
/*jshint devel: true */

// const $ = (query) => document.querySelector(query);

const left = document.getElementById('left');
const right = document.getElementById('right');

let room = 13;
let people = 10;
let coordinates = "9°58′N 84°50′W";
let degrees = 0;

// const shiftDegrees = (value) => (value + 1) % 360;

const run = () => {
  // For animation :
  // degrees = shiftDegrees(degrees);
  // const color = `hsl(${degrees}, 100%, 50%)`;
  // const variation = Math.sin(Date.now() / 1000);
  // const position = `0 ${0.5 + variation} -2`;
  // const rotation = `-90 0 ${degrees}`;

  let leftText = `value: Room ${room}\n People: ${people}`;
  let rightText = `value: Coordinates\n ${coordinates}; align: right`;
  
  left.setAttribute('text', leftText);
  right.setAttribute('text', rightText)

  // requestAnimationFrame(textAdj); (if we want to set up animation)
};
// requestAnimationFrame(textAdj); (calls the animation, needs to remove animate())
run();