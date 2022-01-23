/*jshint esversion: 6 */
/*jshint browser: true */
/*jshint devel: true */

const $ = (query) => document.querySelector(query);

const sphere = $('a-sphere');

const animate = () => {
  const position = `0 ${0.5 + variation} -2`;
  sphere.setAttribute('position', position);

  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);