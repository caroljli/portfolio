// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random greeting to the page.
 */
function addRandomGreeting() {
  const greetings =
      ['Hello world!', '¡Hola Mundo!', '你好，世界！', 'Bonjour le monde!'];

  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}

/**
 * Collapses menus for blog page.
 */

function collapseMenu() {
    var i;
    var elements = document.getElementsByClassName("collapsible");

    for (i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
}

/**
 * Opens and closes the navigation bar.
 */

function openNav() {
    document.getElementById("nav").style.width = "200px";
    document.getElementById("nav-main").style.marginLeft = "200px";
}

function closeNav() {
    document.getElementById("nav").style.width = "0px";
    document.getElementById("nav-main").style.marginLeft = "0px";
}

/** 
 * Buttons for photo slider transitions, indexers.
 */

var index = 1;

function move(n) {
    show(index += n);
}

function current(n) {
    show(index = n);
}

function show(n) {
    var i;
    var slides = document.getElementsByClassName("slides");
    var indices = document.getElementsByClassName("index");

    if (n > slides.length) {
        index = 1;
    }

    if (n < 1) {
        index = slides.length;
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (i = 0; i < slides.length; i++) {
        indices[i].className = indices[i].className.replace(" active", "");
    }

    if (slides[index - 1] != null) {
        slides[index - 1].style.display = "block";
    }

    if (indices[index - 1] != null) {
        indices[index - 1].className += " active";
    }
}

/** 
 * Loads first indexed image for slideshow.
 */

window.onload = function() {
    show(1);
}

/**
 * Scrolls to top of page, appears when user starts scrolling.
 */

window.onscroll = function() {
    scrollUpHelper();
}

function scrollUp() {
    document.documentElement.scrollTop = 0;
}

function scrollUpHelper() {
    var top = document.getElementById("top-button");
    if (document.documentElement.scrollTop > 20) {
        top.style.display = "block";
    } else {
        top.style.display = "none";
    }
}

function back() {
    if (window.history) {
        window.history.back();
    }
}
