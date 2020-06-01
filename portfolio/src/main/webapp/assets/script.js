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
 * Fetches greetings from server and adds to servlet page.
 */

function getMessages() {
  fetch('/data').then(response => response.json()).then((messages) => {
    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.innerHTML = '';
    for (var i = 0; i < messages.length; i++) {
      messagesContainer.appendChild(
        createListElement(messages[i])
      );
    }
  });
}

function createListElement(text) {
  const listElem = document.createElement('li');
  listElem.innerText = text;
  return listElem;
}