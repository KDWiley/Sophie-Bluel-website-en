// Get the image-container DOM element
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
        //console.log("Response object:", response);
        // Handle the response and convert it to JSON
        return response.json();
      })

      // .then(architectWorks) is referring to the JSON data from architectWorks received from the previous promise
      .then((architectWorks) => {
        looptoDisplayImages(architectWorks);
        modalLooptoDisplayImages(architectWorks);
        //modalLooptoDisplayCategories(architectWorks);
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
    if (imagesContainerElement.contains(imageContainer)) {
      console.log("Image container appended successfully:", imageContainer);
    } else {
      console.log("Image container was NOT appended.");
    }
  }
}

function galleryFilter(filterSelected) {
  let imageContainerCollection =
    document.getElementsByClassName("image-container"); //getting all elements with class = image-container.  allows me to udpate the image-container .css class
  console.log("Filter selected:", filterSelected); // Log selected filter
  // Loop through the imageContainers
  for (let i = 0; i < imageContainerCollection.length; i++) {
    let imageCategory = imageContainerCollection[i].dataset.category; //I don't like this.  I wish there was a more readable way to reference Category name
    // if for comparison
    if (filterSelected === "all" || imageCategory === filterSelected) {
      imageContainerCollection[i].classList.remove("hide"); // Add "hide" class to hide the image
    } else {
      imageContainerCollection[i].classList.add("hide");
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  //added 8/25
  fetchImages(apiURL); // Fetch images when the DOM is fully loaded

  // Show the edit button if the user is logged in -- updated order to here 8/25
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

//SCRATCH PAPER for Authentication

//https://jasonwatmore.com/post/2021/09/05/fetch-http-post-request-examples

//pseudo-code
//When you login with correct credentials, take user to index.html with the Edit Button.
//User is given a token
//Where do you go if you forgot your password?
//Event Listener for Login Page
//var form = document.querySelector("form");

//ORIGINAL CODE with hard-coded user authentication

// form.addEventListener("submit", function (event) {
//   event.preventDefault();
//   console.log("Form submitted");

//   let email = document.getElementById("email").value;
//   let password = document.getElementById("password").value;

//   if (email === "sophie.bluel@test.tld" && password === "S0phie") {
//     console.log("Redirecting to index.html");

//     //TOKEN AUTHENTICATION
//     const authToken =
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4";
//     localStorage.setItem("authToken", authToken);
//     console.log(authToken);

//     localStorage.setItem("loggedIn", "true");

//     location.href = "index.html";
//   } else {
//     console.log("Invalid credentials");
//     document.getElementById("feedback").textContent =
//       "Invalid email or password.";
//   }

//POST request using fetch with error handling

const emailElement = document.querySelector("#loginEmail");
const passwordElement = document.querySelector("#loginPassword");

document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the input values
  const email = emailElement.value;
  const password = passwordElement.value;

  //Creating the object used to configure the http request for authentication
  const authenticateOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  };
  console.log("Authenticate options:", authenticateOptions);

  //Fetch Request
  fetch("http://localhost:5678/api/users/login", authenticateOptions)
    .then(async (response) => {
      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      console.log("Received response:", response);
      const data = isJson && (await response.json());
      console.log("Parsed response data:", data); // Log the parsed data

      // check for error response
      if (response.status !== 200) {
        //if 200 response, do the function
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        document.getElementById("feedback").textContent =
          "Invalid email or password.";
        return Promise.reject(error);
      }
      return data; // Return the data if the response is okay
    })

    .then((data) => {
      const userId = data.userId;
      const token = data.token;

      if (token) {
        console.log("Authentication successful!");
        console.log("User ID:", userId);
        console.log("Token:", token);

        // You can store the token in local storage or use it for future requests
        localStorage.setItem("authToken", token); // Store the token for future use
        localStorage.setItem("loggedIn", "true");

        // Redirect to the index.html page
        window.location.href = "index.html";
      } else {
        console.error("No token returned from API");
      }
    })
    .catch((error) => {
      console.error("There was an error!", error); // Handle the error
    });
});

//SCRATCH PAPER for Modal
//Pseudo Code:

//  MODAL 1
//  1. Click Edit button --> Modal 1 displays "modal-image-container"
//  3. Delete button event listener removes modalImageContainer. modalImageContainer.removeChild("modal-image-container");
//  4. Click "add a photo" to advance to Modal 2.

//  MODAL 2
//  1. Click "Add photo" --> input type="file" id="fileInput" accept="image/*" multiple
//  2. Selecting image advances user to Modal 3.
//  3. Back button event listener to Modal 1

//  MODAL 3
//  1.  Present Title --> input type="text".  Category -->  architectWorks[i].category.name;
//  2.  Back button event listener to Modal 2
//  3.  Confirm button event listener adds image, category, and title
//         imageContainer.setAttribute("data-category", category);
//             var img = document.createElement("img");
//                  img.src = imageURL;
//                  img.alt = title;
//                  imageContainer.appendChild(img);
//         imagesContainerElement.appendChild(imageContainer);

//Common across all modals
//Click X to to close or click outside of modal
//Modal size

//Modal functionality for Modal 1 image thumbnail gallery --> Add a Delete button event listener to delete child from modal-image-container
const modalImagesContainerElement = document.getElementById(
  "modal-image-container"
);

function modalLooptoDisplayImages(architectWorks) {
  for (let i = 0; i < architectWorks.length; i++) {
    let imageURL = architectWorks[i].imageUrl;
    let title = architectWorks[i].title;
    let category = architectWorks[i].category.name;
    let categoryId = architectWorks[i].categoryId;

    var modalImageContainer = document.createElement("div"); //creating a div
    modalImageContainer.className = "modal-image-container"; //assign a CSS class to the modal image container.  Assigning the string "modal-image-container" to the className property of imageContainer
    modalImageContainer.setAttribute("data-category", category); //setting the category attribute to the modal image container div
    modalImageContainer.setAttribute("data-category-id", categoryId); //setting the categoryId attribute to the modal image container div

    var img = document.createElement("img");
    img.src = imageURL;
    img.alt = title;

    var deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.innerHTML = "🗑️";

    modalImageContainer.appendChild(img);
    modalImageContainer.appendChild(deleteButton);
    modalImagesContainerElement.appendChild(modalImageContainer);
    if (modalImagesContainerElement.contains(modalImageContainer)) {
      console.log(
        "Modal Image container appended successfully:",
        modalImageContainer
      );
    } else {
      console.log("Modal Image container was NOT appended.");
    }
  }
}

//Modal Categories for Modal 2
//Need to create a function to take take an array of 'architectWorks' as an argument
//function categoryDropdown.forEach(displayCategories)

//fetch from "http://localhost:5678/api/categories";

//api post and delete of works will require token in local storage
//Notes091224 word doc on desktop






//remove this from uptop modalLooptoDisplayCategories(architectWorks)




// Function to show a specific modal
const modal = document.querySelector(".modal");

function showModal(modalId) {
// Hide all modals by adding the 'hidden' class
    document.getElementById("modal1-content").classList.add("hidden");
    document.getElementById("modal2-content").classList.add("hidden");
    document.getElementById("modal3-content").classList.add("hidden");

const modalContent = document.getElementById(modalId); //when showModal function is called, showModal will pass modal1-content as the modalID to show Modal 1
      modalContent.classList.remove("hidden"); // Remove the class that hides the modal
      modal.style.display = "block"; // Show the modal container
  }

//Show-Hide Modals based on Event Listeners:  Edit Button = Show modal 1,
document.addEventListener("DOMContentLoaded", function () {
  const editButton = document.getElementById("editButton");
  const addaphotoModalBtn = document.querySelector(".addaphotoModalBtn");
  const inactiveconfirmModalBtn = document.querySelector("inactiveconfirmModalBtn");
  const closeBtn = document.querySelector(".closeModalBtn");
  const modal2Backbutton = document.querySelector(".modal2Backbutton");
  const modal3Backbutton = document.querySelector(".modal3Backbutton");

  // Open modal 1
  editButton.addEventListener("click", function () {
    showModal("modal1-content");
    console.log("Modal 1 is open");
  });

  //Open modal 2
  addaphotoModalBtn.addEventListener("click", function () {
    showModal("modal2-content");
    console.log("Modal 2 is open");
  });

  //Back Button from modal 2 to modal 1
  modal2Backbutton.addEventListener("click", function () {
    showModal("modal1-content");
    console.log("Modal 1 is open");
  });

  // //Open modal 3 when a photo, title, and category have been selected, display pic in photo placeholder and change inactiveconfirmModalBtn to activeconfirmModalBtn


  //Back Button from modal 3 to modal 2
  modal3Backbutton.addEventListener("click", function () {
    showModal("modal2-content");
    console.log("Modal 2 is open");
  });

  // Close modal when close button is clicked
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Close modal when clicking outside the modal content
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

