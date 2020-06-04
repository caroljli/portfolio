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
 * Moves slider by n increments.
 */

// initial index value
var index = 0;

function move(n) {
  show(index += n);
}

/** 
 * Displays current image on slider.
 */

function current(n) {
  show(index = n);
}

/** 
 * Shows the current slide by index n and hides all other slides,
 * changes display of index indicator (dot) to active if current indexed 
 * slide is showing, otherwise sets indicator as inactive.
 */

function show(n) {
  var i;

  // all image slides
  var slides = document.getElementsByClassName("slides");

  // indices for each of the scrolling dots (index indicator) for current image
  var indices = document.getElementsByClassName("index");

  // resets index if n doesn't point to an image in the slider
  if (n > slides.length - 1) {
    index = 0;
  }

  // sets index to max index if n is less than first index
  if (n < 0) {
    index = slides.length - 1;
  }

  // set all image slides display to none and all index indicator displays to none 
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    indices[i].className = indices[i].className.replace(" active", "");
  }

  if (slides[index] != null) {
    slides[index].style.display = "block";
  }

  if (indices[index] != null) {
    indices[index].className += " active";
  }
}

/** 
 * Loads first indexed image for slideshow.
 */

window.onload = function() {
  show(0);
  getComments();
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

/**
 * Goes back to previous page.
 */

function back() {
  window.history.back();
}

/**
 * Opens, closes, and activates modal on click.
 */

function clickModal() {
  var modal = document.getElementById("me-modal");
  modal.style.display = "block";
}

function closeModal() {
  var modal = document.getElementById("me-modal");
  modal.style.display = "none";
}

/**
 * Fetches comments from server and adds to servlet page.
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

/**
 * Creates a <li> element.
 */

function createListElement(text) {
  const listElem = document.createElement('li');
  listElem.innerText = text;
  return listElem;
}

/**
 * Fetches comments from server and adds to forum page.
 */

function getComments() {
  fetch('/data').then(response => response.json()).then((comments) => {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';
    for (var i = 0; i < comments.length; i++) {
      commentsContainer.appendChild(
        createCommentElement(comments[i])
      );
    }
  });
}

/**
 * Creates comment element.
 */

function createCommentElement(text) {
  // split csv into arr of substrings
  var commentData = text.split(",");
  var id = commentData[0];
  var name = commentData[1];
  var comment = commentData[2];
  var email = commentData[3];
  var date = commentData[4];
  var username = email.substring(0, email.indexOf("@"));

  const commentElement = document.createElement('div');
  commentElement.className = 'comment';
  commentElement.id = id;

  const box = document.createElement('div');
  box.className = 'box';
  commentElement.appendChild(box);

  const headerElement = document.createElement('h3');
  headerElement.innerText = name + "\xa0";
  box.appendChild(headerElement);

  const usernameElement = document.createElement('a');
  usernameElement.href = "mailto:" + email;
  usernameElement.innerText = "@" + username;
  headerElement.appendChild(usernameElement);

  const dateElement = document.createElement('p');
  dateElement.innerText = date;
  box.appendChild(dateElement);

  const innerBox = document.createElement('div');
  innerBox.className = 'inner-box';
  box.appendChild(innerBox);

  const commentContentElement = document.createElement('p');
  commentContentElement.innerText = comment;
  innerBox.appendChild(commentContentElement);

  commentElement.appendChild(createReplyElement());

  return commentElement;
}

/**
 * Creates reply element. Content is static for now.
 */

function createReplyElement() {
  const replyWrapper = document.createElement('div');
  replyWrapper.className = 'reply-container';

  const viewReplies = document.createElement('a');
  viewReplies.href = "javascript:void(0)";
  viewReplies.className = "collapsible";
  viewReplies.onclick = collapseMenu;
  viewReplies.innerHTML = "<i class='fas fa-chevron-right'></i> \xa0 VIEW REPLIES";
  replyWrapper.appendChild(viewReplies);

  const repliesElement = document.createElement('div');
  repliesElement.className = "replies";
  replyWrapper.appendChild(repliesElement);

  const replyForm = document.createElement('div');
  replyForm.className = 'reply-box';
  replyForm.id = 'reply-form'
  replyForm.innerHTML = '<form action="/reply-form" method="POST"><label for="name">Name</label> &nbsp;<input type="text" name="name"><br/><br/><label for="email">Email</label> &nbsp;<input type="email" name="email"><br/><br/><label for="comment">Comment</label><input type="textarea" name="comment"><br/><br/><input type="submit" value="REPLY TO COMMENT"></form>';
  repliesElement.appendChild(replyForm);

  const replyFormContent = document.createElement('form');

  const repliesBox = document.createElement('div');
  repliesBox.className = 'reply-box';
  repliesElement.appendChild(repliesBox);

  const replyHeading = document.createElement('h3');
  replyHeading.innerText = 'caro \xa0';
  repliesBox.appendChild(replyHeading);

  const replyUsernameLink = document.createElement('a');
  replyUsernameLink.href = "http://google.com";
  replyUsernameLink.innerText = '@username';
  replyHeading.appendChild(replyUsernameLink);

  const replyParagraph = document.createElement('p');
  replyParagraph.innerText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mollis nisl velit, ac porta nisi rutrum quis. Etiam pulvinar hendrerit metus vitae sollicitudin. Nullam vitae ligula lectus. Phasellus semper dui sed pharetra vestibulum. Pellentesque maximus convallis neque, vitae consectetur sapien volutpat a. Praesent eleifend tempor aliquet. Sed nunc enim, porttitor vel magna eu, faucibus mattis sem. Quisque molestie sapien ac tincidunt porttitor. Vestibulum sed feugiat enim. Ut ultricies odio libero, at iaculis tortor tincidunt scelerisque. Quisque sollicitudin neque sed sem malesuada, a aliquet est lacinia. Sed venenatis faucibus risus sed ultrices.";
  repliesBox.appendChild(replyParagraph);

  return replyWrapper;
}