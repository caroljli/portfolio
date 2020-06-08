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
 * Fetches comments from server and adds to forum page.
 */

function getComments() {
  Promise.all([
    fetch('/data').then(response => response.json()),
    fetch('/reply-data').then(response => response.json())
  ]).then(([comments, replies]) => {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';

    comments.forEach((comment) => {
      var commentReplies = [];
      replies.forEach((reply) => {
        if (reply.parentId == comment.id) {
          console.log("parent id: " + reply.parentId + "comment: " + comment.id + (reply.parentId == comment.id));
          commentReplies.push(reply);
        }
      })

      commentsContainer.appendChild(
        createCommentElement(comment, commentReplies)
      );
    })
  }).catch((err) => {
      console.log(err);
  });

}

/**
 * Creates comment element.
 */

function createCommentElement(comment, replies) {
  console.log(comment.id + " created!");
  const id = comment.id;
  const name = comment.name;
  const commentContent = comment.comment;
  const email = comment.email;
  const date = comment.date;
  const username = email.substring(0, email.indexOf("@"));

  const commentElement = document.createElement('div');
  commentElement.className = 'comment';
  commentElement.id = 'comment-container';

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
  commentContentElement.innerText = commentContent;
  innerBox.appendChild(commentContentElement);

  const viewReplies = document.createElement('a');
  viewReplies.href = "javascript:void(0)";
  viewReplies.className = "collapsible";
  viewReplies.onclick = collapseMenu;
  viewReplies.innerHTML = "<i class='fas fa-chevron-right'></i> \xa0 VIEW REPLIES";
  commentElement.appendChild(viewReplies);

  commentElement.appendChild(renderReplyElements(comment, replies));

  // change id to comment id so comments render in individual threads
  commentElement.id = comment.id;

  return commentElement;
}

/**
 * Calls to create each reply element.
 */
function renderReplyElements(comment, replies) {
  const repliesElement = document.createElement('div');
  repliesElement.className = "replies";

  const replyForm = document.createElement('div');
  replyForm.className = 'reply-box';
  replyForm.id = 'reply-form'
  repliesElement.appendChild(replyForm);

  const replyFormContent = document.createElement('form');
  replyFormContent.action = "/reply-data";
  replyFormContent.method = "POST";
  replyFormContent.innerHTML = '<label for="name">Name</label> &nbsp;<input class="reply-input" type="text" name="name"><br/><br/><label for="email">Email</label> &nbsp;<input class="reply-input" type="email" name="email"><br/><br/><label for="comment">Comment</label><input class="reply-input" type="textarea" name="comment"><br/><br/>';
  replyForm.appendChild(replyFormContent);

  const idInput = document.createElement('input');
  idInput.type = "hidden";
  idInput.value = comment.id;
  idInput.name = "parent-id";
  replyFormContent.appendChild(idInput);

  const submitInput = document.createElement('input');
  submitInput.type = 'submit';
  submitInput.value = 'REPLY TO COMMENT';
  submitInput.id = 'reply-submit';
  submitInput.disabled = "disabled";
  replyFormContent.appendChild(submitInput);

  replies.forEach((reply) => {
    repliesElement.appendChild(
      createReplyElement(comment, reply)
    );
  })

  return repliesElement;
}

/**
 * Creates reply element.
 */

function createReplyElement(comment, reply) {
  console.log("reply " + reply.id + " created!");
  const id = reply.id;
  const name = reply.name;
  const commentContent = reply.comment;
  const email = reply.email;
  const date = reply.date;
  const username = email.substring(0, email.indexOf("@"));

  const replyWrapper = document.createElement('div');
  replyWrapper.id = 'reply-container' + comment.id;
  replyWrapper.innerHTML = '';
  console.log("replyWrapper: " + replyWrapper.id);

  const repliesBox = document.createElement('div');
  repliesBox.className = 'reply-box';
  replyWrapper.appendChild(repliesBox);

  const replyHeading = document.createElement('h3');
  replyHeading.innerText = name + '\xa0';
  repliesBox.appendChild(replyHeading);

  const replyUsernameLink = document.createElement('a');
  replyUsernameLink.href = "mailto:" + email;
  replyUsernameLink.innerText = '@' + username;
  replyHeading.appendChild(replyUsernameLink);

  const replyParagraph = document.createElement('p');
  replyParagraph.innerText = commentContent;
  repliesBox.appendChild(replyParagraph);

  return replyWrapper;
}