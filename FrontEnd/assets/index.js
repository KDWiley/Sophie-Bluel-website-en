// Get the DOM element from Line 64 in HTML
const imagesContainerElement = document.getElementById("image-container"); //container that holds all images

// API URL
const apiURL = "http://localhost:5678/api/works";

// Function to fetch images
function fetchImages(apiURL) {
  // Make the fetch call When you call fetch(apiURL), it returns a promise that resolves to a Response object.

  //possible upgrade to async
  //async function catchImages() {}
  //const response = await fetch(apiURL);
  //const json = await response.json();
  //document.getElementById("image-element");

  return (
    fetch(apiURL) //By adding return in front of fetch(apiURL), ensures Promise is returned by fetch.
      .then((response) => {
        console.log("Response object:", response);
        // Handle the response and convert it to JSON
        return response.json();
      })

      // .then(architectWorks) is referring to the JSON data from architectWorks received from the previous promise
      .then((architectWorks) => {
        looptoDisplayImages(architectWorks);
        // const imageURL = architectWorks[i].imageUrl;
        // displayImage(imageURL);
      })

      // Catch and log errors
      .catch((error) => console.error("Error fetching images:", error))
  );
}

//Loop
function looptoDisplayImages(architectWorks) {
  for (let i = 0; i < architectWorks.length; i++) {
    let imageURL = architectWorks[i].imageUrl;
    let title = architectWorks[i].title;
    let category = architectWorks[i].category.name;
    let categoryId = architectWorks[i].categoryId;

    var imageContainer = document.createElement("div"); //creating a div
    imageContainer.className = "image-container"; //assign a CSS class to the image container.  Assigning the string "image-container" to the className property of imageContainer
    imageContainer.setAttribute("data-category", category); //setting the category attribute to the image container div
    imageContainer.setAttribute("data-category-id", categoryId); //setting the categoryId attribute to the image container div

    var img = document.createElement("img");
    img.src = imageURL;
    img.alt = title;
    imageContainer.appendChild(img);
    imagesContainerElement.appendChild(imageContainer);

    console.log("Category:", category);
    console.log(imageContainer, img);
  }
}

function galleryFilter(filterSelected) {
  let imageContainerCollection =
    document.getElementsByClassName("image-container"); //getting all elements with class = image-container.  allows me to udpate the image-container .css class
  // Loop through the imageContainers
  for (let i = 0; i < imageContainerCollection.length; i++) {
    let imageCategory = imageContainerCollection[i].dataset.category; //I don't like this.  I wish there was a more readable way to reference Category name
    // if for comparison
    if (filterSelected === "all" || imageCategory === filterSelected) {
      imageContainerCollection[i].classList.add("hide"); // Add "hide" class to hide the image
    } else {
      imageContainerCollection[i].classList.remove("hide");
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {  //added 8/25
  fetchImages(apiURL); // Fetch images when the DOM is fully loaded

  // Show the edit button if the user is logged in .... updated order to here 8/25
  if (localStorage.getItem("loggedIn") === "true") {
    const editButton = document.getElementById("editButton");
    if (editButton) {
      editButton.classList.remove("editHidden");
    }
  }
});

// // Event listeners for filter links
function filterListeners() {
  let filterLinks = document.querySelectorAll(".filter_links a");
  filterLinks.forEach((link) => {
    //link in parethenses refers the filterLinks anchor tag

    link.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default link behavior
      // Get the filter value from the data-filter attribute
      let filter = this.getAttribute("data-filter");
      console.log("Filter selected:", filter);
      console.log("Clicked element:", this);
      //       // Call the galleryFilter function with the selected filter
      galleryFilter(filter);
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  filterListeners(); // Set up the event listeners for filters
});

//When you login with correct credentials, take user to index.html with the Edit Button.  How do you conditionally added the Edit Button?
//User is given a token
//  If you enter wrong email and/or password,  give a 401 error.
//Where do you go if you forgot your password?
//Event Listener for Login Page
var form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  console.log("Form submitted");

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  console.log("Email:", email);
  console.log("Password:", password);

  // // Clear previous error messages
  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";
  //document.getElementById("incorrectEmailPassword").textContent = "";

  if (email === "sophie.bluel@test.tld" && password === "S0phie") {
    console.log("Redirecting to index.html");

    //TOKEN AUTHENTICATION
    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4";
    localStorage.setItem("authToken", authToken);
    console.log(authToken);

    localStorage.setItem("loggedIn", "true");

    location.href = "index.html";
  } else {
    console.log("Invalid credentials");
    document.getElementById("feedback").textContent =
      "Invalid email or password.";
  }
  //Show Edit Button after logging in
  document.getElementById("editButton").classList.remove("editHidden");
  console.log(editHidden);
});

//MODAL FUNCTION

// const modal = document.querySelector(".modal");
// const overlay = document.querySelector(".overlay");
// const openModalBtn = document.querySelector(".btn-open");
// const closeModalBtn = document.querySelector(".btn-close");
// const imageForm = document.getElementByID("imageForm")

// // open modal function
// const openModal = function () {
//   modal.classList.remove("hidden");
//   overlay.classList.remove("hidden");
// };

// // close modal function
// const closeModal = function () {
//   modal.classList.add("hidden");
//   overlay.classList.add("hidden");
// };

// // close the modal when the close button and overlay is clicked
// openModalBtn.addEventListener("click", openModal)
// closeModalBtn.addEventListener("click", closeModal);
// overlay.addEventListener("click", closeModal);

// // close modal when the Esc key is pressed
// document.addEventListener("keydown", function (e) {
//   if (e.key === "Escape" && !modal.classList.contains("hidden")) {
//     closeModal();
//   }
// });

// // open modal event
// openModalBtn.addEventListener("click", openModal);
