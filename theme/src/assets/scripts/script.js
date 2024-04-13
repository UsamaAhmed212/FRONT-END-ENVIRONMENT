"use strict";

const header = document.querySelector('h1');

header.innerText = 'Index html';

// Select the button element by its ID
const button = document.querySelector('.btn');

button.addEventListener('click', function() {
    // Change the background color of the button
    button.style.backgroundColor = 'red'; // You can change this to any color you prefer
  
    // Optional: Change the text color as well
    button.style.color = 'green';
});
