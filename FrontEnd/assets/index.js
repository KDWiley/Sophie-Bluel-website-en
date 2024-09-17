// Define the button and file input elements globally
const uploadButton = document.querySelector(".upload-button");
const fileInput = document.getElementById("file-input");
const titleInput = document.querySelector(".form-control"); // Title input field
const categoryDropdown = document.getElementById("categorySelected"); // Category dropdown
const confirmButton = document.querySelector(".inactiveconfirmModalBtn"); // Initially inactive confirm button
const selectedImage = document.getElementById("selected-image"); // Image element

document.addEventListener("DOMContentLoaded", function () {
  uploadButton.addEventListener("click", function () {
    fileInput.click(); //
  });

  // Add event listener to the file input to display the selected image
  fileInput.addEventListener("change", function () {
    displaySelectedImage(this); // Call displaySelectedImage when a file is selected
  });
});

// Function to display the selected image in the modal
function displaySelectedImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader(); // Create a new FileReader instance
    reader.onload = function (e) {
      // Define what happens when the file is read
      var img = document.getElementById("selected-image"); // Reference to the image element
      img.src = e.target.result; // Set the image source to the selected file
      img.style.display = "block"; // Show the image

      // Disable the upload button after an image is selected
      uploadButton.disabled = true; // Disable the button
      uploadButton.style.cursor = "not-allowed"; // Change cursor to indicate it is disabled

      checkConfirmButtonState(); // Check confirm button state after displaying the image
    };
    reader.readAsDataURL(input.files[0]); // Read the file as a data URL
  }
}

// Add event listeners to the title input and category dropdown to check their values
  titleInput.addEventListener("input", checkConfirmButtonState); // Check state on title input change
  categoryDropdown.addEventListener("change", checkConfirmButtonState); // Check state on category change

// Function to check if all conditions are met to activate the confirm button
function checkConfirmButtonState() {
  const isImageDisplayed = selectedImage.style.display === "block"; // Check if image is displayed
  const isTitleFilled = titleInput.value.trim() !== ""; // Check if title input is not empty
  const isCategorySelected = categoryDropdown.value !== ""; // Check if a category is selected

  if (isImageDisplayed && isTitleFilled && isCategorySelected) {
    // All conditions met: activate the confirm button
    confirmButton.classList.remove("inactiveconfirmModalBtn");
    confirmButton.classList.add("activeconfirmModalBtn");
    confirmButton.disabled = false; // Enable the button
    confirmButton.style.cursor = "pointer"; // Change cursor to pointer
  } else {
    // Not all conditions met: keep the button inactive
    confirmButton.classList.remove("activeconfirmModalBtn");
    confirmButton.classList.add("inactiveconfirmModalBtn");
    confirmButton.disabled = true; // Disable the button
    confirmButton.style.cursor = "not-allowed"; // Change cursor to indicate it is disabled
  }
}

// Get the image-container DOM element
const imagesContainerElement = document.getElementById("image-container"); //container that holds all images

// API URL
const apiURL = "http://localhost:5678/api/works";

// Function to fetch images for main gallery
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

//Loop to display images
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
    /*     if (imagesContainerElement.contains(imageContainer)) {
      console.log("Image container appended successfully:", imageContainer);
    } else {
      console.log("Image container was NOT appended.");
    } */
  }
}

//Function to filter main gallery
function galleryFilter(filterSelected) {
  let imageContainerCollection =
    document.getElementsByClassName("image-container"); //getting all elements with class = image-container.  allows me to udpate the image-container .css class
  console.log("Filter selected:", filterSelected); // Log selected filter
  // Loop through the imageContainers
  for (let i = 0; i < imageContainerCollection.length; i++) {
    let imageCategory = imageContainerCollection[i].dataset.category; //I don't like this.  I wish there was a more readable way to reference Category name
    // if for comparison
    if (filterSelected === "All" || imageCategory === filterSelected) {
      imageContainerCollection[i].classList.remove("hide");
    } else {
      imageContainerCollection[i].classList.add("hide"); // Add "hide" class to hide the image
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

    //Event listener to the delete button
    deleteButton.addEventListener("click", function () {
      deleteWorks(architectWorks[i].id); // Pass the work ID to delete
    });

    modalImageContainer.appendChild(img);
    modalImageContainer.appendChild(deleteButton);
    modalImagesContainerElement.appendChild(modalImageContainer);
    /*     if (modalImagesContainerElement.contains(modalImageContainer)) {
      console.log(
        "Modal Image container appended successfully:",
        modalImageContainer
      );
    } else {
      console.log("Modal Image container was NOT appended."); 
    }*/
  }
}

function deleteWorks(id) {
  let url = `http://localhost:5678/api/works/${id}`;
  let token = localStorage.getItem("authToken");

  if (!token) {
    document.getElementById("feedback").textContent =
      "You must be logged in to make a selection.";
    return; // Exit if the token is not available
  }

  let options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // Include the auth token in the headers
      "Content-Type": "application/json",
    },
  };

  fetch(url, options)
    .then((response) => {
      if (response.ok) {
        console.log(`Work ID ${id} deleted successfully.`);
        removeImageFromDOM(id);
        fetchWorks(); // Refresh the list after deletion
      } else {
        console.error(
          `Failed to delete work with ID ${id}. Status: ${response.status}`
        );
      }
    })
    .catch((error) => console.error("Error:", error));

  function removeImageFromDOM(id) {
    // Select the image container with the specific data-id
    const imageContainer = document.querySelector(
      `modal.image-container[data-id='${id}']`
    );
    if (imageContainer) {
      imageContainer.remove(); // Remove the element from the DOM
    }
  }

  function fetchWorks() {
    // Fetch the works (images) from the API and call looptoDisplayImages
    fetch("http://localhost:5678/api/works", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include the auth token if needed
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => looptoDisplayImages(data))
      .catch((error) => console.error("Error fetching works:", error));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetchCategories();
});

function fetchCategories() {
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
      populateCategoryDropdown(data); //Pass fetched data to populated dropdown
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
    });
}

function populateCategoryDropdown(categories) {
  const categoryDropdown = document.querySelector("#categorySelected"); //this is the dropdown element

  // Clear existing options and add the default placeholder of nothing per Figma design
  categoryDropdown.innerHTML = '<option value=""></option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categoryDropdown.appendChild(option);
  });
}

const categoryIDElement = document.querySelector("#categoryIDSelected");
const categoryElement = document.querySelector("#categorySelected");

document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the input values
  const categoryID = document.querySelector("#categorySelected").value;

  // Retrieve the token from local storage
  const token = localStorage.getItem("authToken");

  if (!token) {
    document.getElementById("feedback").textContent =
      "You must be logged in to make a selection.";
    return; // Exit if the token is not available
  }

  //Creating the object used to configure the http request
  const categorySubmission = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: categoryID,
      name: document.querySelector("#categorySelected option:checked").text, // Get the selected category name
    }),
  };
  console.log("CategorySelected:", categorySubmission);

  //Fetch Request
  fetch("http://localhost:5678/api/categories", categorySubmission).then(
    async (response) => {
      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      console.log("Received response:", response);
      const data = isJson && (await response.json());
      console.log("Parsed response data:", data); // Log the parsed data

      // check for error response
      if (!response.ok) {
        //if 200 response, do the function
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        document.getElementById("feedback").textContent = "Unexpected Error";
        return Promise.reject(error);
      }
      return data; // Return the data if the response is okay
    }
  );
});

// Function to show a specific modal
const modal = document.querySelector(".modal");

function showModal(modalId) {
  // Hide all modals by adding the 'hidden' class
  document.getElementById("modal1-content").classList.add("hidden");
  document.getElementById("modal2-content").classList.add("hidden");

  const modalContent = document.getElementById(modalId); //when showModal function is called, showModal will pass modal1-content as the modalID to show Modal 1
  modalContent.classList.remove("hidden"); // Remove the class that hides the modal
  modal.style.display = "block"; // Show the modal container
}

//Show-Hide Modals based on Event Listeners:  Edit Button = Show modal 1,
document.addEventListener("DOMContentLoaded", function () {
  const editButton = document.getElementById("editButton");
  const addaphotoModalBtn = document.querySelector(".addaphotoModalBtn");
  const inactiveconfirmModalBtn = document.querySelector(
    "inactiveconfirmModalBtn"
  );
  const closeBtn = document.querySelector(".closeModalBtn");
  const modal2Backbutton = document.querySelector(".modal2Backbutton");

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

  /*BEGINNING WORK ON POST API

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
//  3.  Confirm button event listener adds image, category, and title
//         imageContainer.setAttribute("data-category", category);
//             var img = document.createElement("img");
//                  img.src = imageURL;
//                  img.alt = title;
//                  imageContainer.appendChild(img);
//         imagesContainerElement.appendChild(imageContainer);

const newWorks = document.querySelector("new-works");

newWorks.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

const formData(newWorks);

  // Get the input values
  const email = emailElement.value;
  const password = passwordElement.value;

  //Creating the object used to configure the http request for authentication
  const authenticateOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      img: email,
      title: title,
      category: category
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
});*/

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
