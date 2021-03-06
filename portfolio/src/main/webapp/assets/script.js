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
  createMap();
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
 * Fetches comments from server and adds to forum page with querySize that is specified
 * by button. Default is 5 comments showing.
 */

function getComments() {
  const defaultNumComments = 5;
  var querySize = document.getElementById("comments-num").value;
  if (querySize == undefined) {
    querySize = defaultNumComments;
  }
  var url = '/data?comments-num='.concat(querySize.toString());
  
  Promise.all([
    fetch(url, {method: 'GET'}).then(response => response.json()),
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

  document.getElementById('comment-submit').onclick = () => {
    createCommentMarker();
  };

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
  const rawLocation = comment.location;
  const location = "'" + rawLocation + "'";

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
  dateElement.innerText = date + "\xa0" + "\xa0";

  const locationElement = document.createElement('button');
  locationElement.className = "location-button";
  locationElement.innerHTML = '<i class="fas fa-map-marker-alt"></i> &nbsp;';
  locationElement.append(rawLocation);
  locationElement.setAttribute('onclick', 'redirectCenter('+location+')');
  dateElement.append(locationElement);
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
  viewReplies.innerHTML = "<br /><i class='fas fa-chevron-right'></i> \xa0 VIEW REPLIES";
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

function deleteAllComments() {
  const delRequest = new Request('/delete-data', {method: 'POST'});

  fetch(delRequest).then(response => {
    getComments();
  });
}

let map;
let markerTemp;

/**
 * Creates a Google Map that allows user to add markers and adds it to the page.
 */
function createMap() {
  map = new google.maps.Map(
    document.getElementById('map'),
    {
      center: {lat: 49.2827, lng: -123.1207}, 
      zoom: 8,
    }
  );
  console.log("created map");

  map.addListener('click', (event) => {
    createEditableMarker(event.latLng.lat(), event.latLng.lng());
  });

  fetchMarkers();
}

/**
 * Creates a marker that shows read-only information and 
 * creates a text output shown at bottom of map.
 */
function createMarker(lat, lng, content) {
  const marker = new google.maps.Marker({position: {lat: lat, lng: lng}, map: map});

  const contentWindow = new google.maps.InfoWindow({content: content});
  marker.addListener('click', () => {
    contentWindow.open(map, marker);
  });

  // Calls renderLocation for input coordinates and comment.
  const markerContainer = document.getElementById('marker-container');
  markerContainer.appendChild(renderLocation(lat, lng, content));
}

/**
 * Creates marker that shows a textbook for input.
 */
function createEditableMarker(lat, lng) {
  // If an editable marker is already showing, remove it.
  if (markerTemp) {
    markerTemp.setMap(null);
  }

  markerTemp = new google.maps.Marker({position: {lat: lat, lng: lng}, map: map});

  const contentWindow = new google.maps.InfoWindow({
    content: buildInput(lat, lng)
  });

  // When the user closes the editable info window, remove the marker.
  google.maps.event.addListener(contentWindow, 'closeclick', () => {
    markerTemp.setMap(null);
  });

  contentWindow.open(map, markerTemp);
}

/**
 * Evokes geocoder for building the input of the marker.
 */
function reverseGeocode(lat, lng, content) {
  var result;
  var country;
  var geocoder = new google.maps.Geocoder();
  var latLng = new google.maps.LatLng(lat, lng);

  // Reverse geocodes latLng to address.
  geocoder.geocode({
    'latLng': latLng
  }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        result = results[0].formatted_address;
        console.log("geocoded address" + result.toString());
        var address = result.split(",");
        country = address[address.length - 1];
        console.log(country);

        // Make new Marker and add it to map.
        postMarker(lat, lng, content, country);
        createMarker(lat, lng, content, country);
      } else {
        alert('no results found');
      }
    } else {
      alert('geocoder failed due to: ' + status);
    }
  });
}

/**
 * Builds editable textbox elements with submit button.
 */
function buildInput(lat, lng) {
  const textBox = document.createElement('textarea');
  const button = document.createElement('button');
  button.id = "map-button";
  button.appendChild(document.createTextNode('Submit'));
  
  button.onclick = () => {
    reverseGeocode(lat, lng, textBox.value);
    markerTemp.setMap(null);
  };

  const containerDiv = document.createElement('div');
  containerDiv.appendChild(textBox);
  containerDiv.appendChild(document.createElement('br'));
  containerDiv.appendChild(button);

  return containerDiv;
}

/**
 * Sends a marker to the backend for saving.
 */
function postMarker(lat, lng, content, country) {
  const params = new URLSearchParams();
  params.append('lat', lat);
  params.append('lng', lng);
  params.append('content', content);
  params.append('country', country);

  console.log("created comment marker at " + lat + ", " + lng);

  fetch('/get-markers', {method: 'POST', body: params});
}

/**
 * Fetches all markers and adds to map.
 */
function fetchMarkers() {
  fetch('/get-markers').then(response => response.json()).then((markers) => {
    markers.forEach(
      (marker) => {
        createMarker(marker.lat, marker.lng, marker.content)
      }
    );
  });
}

/**
 * Converts lat long location to address using Geocoder 
 * (reverse geocoding) and outputs to page.
 */
function renderLocation(lat, lng, content) {
  var geocoder = new google.maps.Geocoder();
  var latLng = new google.maps.LatLng(lat, lng);

  const output = document.createElement('div');
  
  // Reverse geocodes latLng to address.
  geocoder.geocode({
    'latLng': latLng
  }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        result = results[0].formatted_address;
        console.log("geocoded address" + result.toString());

        // Get country.
        var address = result.split(",");
        country = address[address.length - 1];
        console.log(country);

        // Create output on bottom.
        const resultOutput = document.createElement('p');
        const resultText = document.createElement('a');
        resultText.className = 'content-indicator';
        resultText.innerText = content;
        resultOutput.append(resultText);
        resultOutput.append(result.toString());
        output.appendChild(resultOutput);
      } else {
        alert('no results found');
      }
    } else {
      alert('geocoder failed due to: ' + status);
    }
  });

  return output;
}

/**
 * Creates marker for location on check-in page.
 */
function createCommentMarker() {
  var geocoder = new google.maps.Geocoder();
  var location = document.getElementById("comment-location").value;
  var email = document.getElementById("comment-email").value;
  const username = "@" + email.substring(0, email.indexOf("@"));
  console.log(username);

  var resultLat;
  var resultLng;
  var country;

  console.log("entered comment marker");
  
  // Geocodes location to latLng
  geocoder.geocode({
    'address': location
  }, function (results, status) {
    if (status == 'OK') {
      if (results[0]) {
        // Sets lat and lng variables
        resultLat = results[0].geometry.location.lat();
        resultLng = results[0].geometry.location.lng();

        // Get country.
        var address = location.split(",");
        country = address[address.length - 1].trim();
        console.log(country);

        console.log(resultLat + ", " + resultLng + " in " + country);

        // Creates new marker with resultLat, resultLng, username, and country of poster.
        postMarker(resultLat, resultLng, username, country);
      } else {
        console.log("geocode location does not exist");
      }
    } else {
      alert('geocoder failed due to: ' + status);
      console.log('geocoder failed due to: ' + status);
    }
  });

  console.log("end of comment marker");
}

/**
 * Sets location to center of map on click using geocoding.
 */
function redirectCenter(center) {
  var geocoder = new google.maps.Geocoder();
  console.log(center);

  geocoder.geocode({
    'address': center
  }, function (results, status) {
    if (status == 'OK') {
      if (results[0]) {
        console.log("new center: " + results[0].geometry.location.lat() + ", " + results[0].geometry.location.lng());
        map.setCenter({lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()});
      } else {
        console.log("geocode location does not exist");
      }
    } else {
      alert('geocoder failed due to: ' + status);
      console.log('geocoder failed due to: ' + status);
    }
  });

  location.href = '#map';
}

/**
 * Fetches country data and uses it to create a chart. 
 */

google.charts.load('current', {'packages':['geochart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  fetch('/marker-data').then(response => response.json()).then((countryCount) => {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Country');
    data.addColumn('number', 'Popularity');
    Object.keys(countryCount).forEach((country) => {
      data.addRow([country, countryCount[country]]);
    });

    const options = {
      height: 500
    };

    const chart = new google.visualization.GeoChart(
      document.getElementById('geochart-container')
    );

    chart.draw(data, options);

    console.log("drawn map");

  });
}