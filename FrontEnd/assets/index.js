//   SHOW EDIT BUTTON IF USER IS LOGGED IN
//   DISPLAY AN IMAGE IN MODAL 2
//   ADD A NEW WORK VIA MODAL
//   DELETE A WORK VIA MODAL
//   DISPLAY MAIN GALLERY
//   FILTER MAIN GALLERY
//   MODAL 1 THUMBNAIL GALLERY
//   MODAL 2 CATEGORIES DROPDOWN
//   SHOW SPECIFIC MODALS AND NAVIGATION

///////////////////        SHOW EDIT BUTTON IF USER IS LOGGED IN          /////////////////////////////////////////////
if (localStorage.getItem("loggedIn") === "true") {
  const editButton = document.getElementById("editButton");
  if (editButton) {
    editButton.classList.remove("editHidden");
  }
}

////////////////////////         DISPLAY AN IMAGE IN MODAL 2 - START       ////////////////////////////////////////////
const uploadButton = document.querySelector(".upload-button");
const fileInput = document.getElementById("file-input");
const titleInput = document.querySelector(".form-control");
const categoryDropdown = document.getElementById("categorySelected");
const confirmButton = document.querySelector(".inactiveconfirmModalBtn");
const selectedImage = document.getElementById("selected-image");

document.addEventListener("DOMContentLoaded", function () {
  uploadButton.addEventListener("click", function () {
    fileInput.click(); //
  });

  // Add event listener to the file input to display the selected image
  fileInput.addEventListener("change", function () {
    displaySelectedImage(fileInput); // Call displaySelectedImage when a file is selected.
  });
});

// Add event listeners to the title input and category dropdown to check their values
titleInput.addEventListener("input", checkConfirmButtonState);
categoryDropdown.addEventListener("change", checkConfirmButtonState);

// Green, Active Confirm Button event listener aka activeconfirmModalBtn
confirmButton.addEventListener("click", addWorks);

// Function to display the selected image in Modal 2 over the +Add Photo Button
function displaySelectedImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader(); // Create a new FileReader instance
    reader.onload = function (e) {
      // Define what happens when the file is read
      var img = document.getElementById("selected-image"); // Reference to the image element
      img.src = e.target.result; // Set the image source to the selected file
      img.style.display = "block"; // Show the image

      // Disable the upload button after an image is selected because the button kept allowing me to select it behind the image
      uploadButton.disabled = true; // Disable the button
      uploadButton.style.cursor = "not-allowed";

      checkConfirmButtonState(); // Check confirm button state after displaying the image
    };
    reader.readAsDataURL(input.files[0]); // Read the file as a data URL
  }
}

// Function to check if all conditions are met to activate the confirm button
function checkConfirmButtonState() {
  const isImageDisplayed = selectedImage.style.display === "block"; // Check if image is displayed
  const isTitleFilled = titleInput.value.trim() !== ""; // Check if title input is not empty
  const isCategorySelected = categoryDropdown.value !== ""; // Check if a category is selected

  if (isImageDisplayed && isTitleFilled && isCategorySelected) {
    // If all conditions met, activate the confirm button
    confirmButton.classList.remove("inactiveconfirmModalBtn");
    confirmButton.classList.add("activeconfirmModalBtn");
    confirmButton.disabled = false; // Enable button
    confirmButton.style.cursor = "pointer"; // Change cursor to pointer
  } else {
    // Else, keep the button inactive
    confirmButton.classList.remove("activeconfirmModalBtn");
    confirmButton.classList.add("inactiveconfirmModalBtn");
    confirmButton.disabled = true; // Disable button
    confirmButton.style.cursor = "not-allowed"; // Change cursor to indicate it is disabled
  }
}
////////////////////////        DISPLAY AN IMAGE IN MODAL 2 -  END      //////////////////////////////////////////////

////////////////////////        ADD A NEW WORK VIA MODAL - START      ////////////////////////////
//addWorks prompted by - confirmButton.addEventListener("click", addWorks)

async function addWorks(event) {
  event.preventDefault(); // Prevent default link behavior
  let url = "http://localhost:5678/api/works"; // POST/Works Send a new Work API - URL
  let token = localStorage.getItem("authToken"); // Get auth token from local storage

  if (!token) {
    document.getElementById("feedback").textContent =
      "You must be logged in to make a selection.";
    return;
  }

  // Confirmation prompt
  const userConfirmed = confirm("Are you sure you want to add this work?");
  if (!userConfirmed) {
    return;
  }

  const formData = new FormData();
  formData.append("image", fileInput.files[0]);
  formData.append("title", titleInput.value);
  formData.append("category", categoryDropdown.value);

  let options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  };

  try {
    const response = await fetch(url, options); //Send POST request

    if (response.ok) {
      console.log(`${titleInput.value} added successfully.`);
      const newWork = await response.json(); // Parse the response data as JSON
      console.log("API response:", newWork); // Log the API response

      console.log("Calling addImagetoDOM");
      addImagetoDOM(newWork); // Add the new work to the DOM

      // Clear the modal selections
      clearModalSelections();

    } else {
      console.error(`Failed to add work. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to clear modal selections after adding a new work
function clearModalSelections() {
  // Clear the image preview
  selectedImage.src = "";
  selectedImage.style.display = "none";

  // Re-enable the upload button
  uploadButton.disabled = false;
  uploadButton.style.cursor = "pointer";

  // Clear the title input
  titleInput.value = "";

  // Reset the category dropdown
  categoryDropdown.value = "";

  // Disable the confirm button
  confirmButton.classList.remove("activeconfirmModalBtn");
  confirmButton.classList.add("inactiveconfirmModalBtn");
  confirmButton.disabled = true;
  confirmButton.style.cursor = "not-allowed";
}

// Function to add the new image to the DOM
function addImagetoDOM(work) {
  console.log("Work object received:", work); // Log the entire work object for debugging
  const imageContainer = document.createElement("div");
  imageContainer.className = "image-container";

  // Set the data-id attribute to the newly added work's ID
  imageContainer.setAttribute("data-id", work.id);

  const img = document.createElement("img");
  img.src = work.imageUrl; // Set the image source to the new work's URL
  img.alt = work.title; // Set the image alt text to the new work's title
  img.id = work.id;

  imageContainer.appendChild(img); // Append the image to the image container
  imagesContainerElement.appendChild(imageContainer); // Append the image container to the gallery

  // Update modal gallery
  const modalImageContainer = document.createElement("div");
  modalImageContainer.className = "modal-image-container";
  modalImageContainer.setAttribute("data-id", work.id);

  const modalImg = document.createElement("img");
  modalImg.src = work.imageUrl;
  modalImg.alt = work.title;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.innerHTML = "🗑️";
  deleteButton.addEventListener("click", function () {
    deleteWorks(work.id);
  });

  modalImageContainer.appendChild(modalImg);
  modalImageContainer.appendChild(deleteButton);
  modalImagesContainerElement.appendChild(modalImageContainer);
}
////////////////////////        ADD A NEW WORK VIA MODAL - END      ////////////////////////////

////////////////////////        DELETE A WORK VIA MODAL - START      ///////////////////////////
//deleteWorks prompted by Delete Button event listener in modal gallery section
async function deleteWorks(id) {
  let url = `http://localhost:5678/api/works/${id}`; // DELETE/works/{id} Delete a work depending on id API - URL
  let token = localStorage.getItem("authToken"); // Get auth token from local storage

  if (!token) {
    document.getElementById("feedback").textContent =
      "You must be logged in to make a selection.";
    return;
  }

  // Remove the work from the DOM first
  removeImageFromDOM(id);

  // Confirmation prompt
  const userConfirmed = confirm("Are you sure you want to delete this work?");
  if (!userConfirmed) {
    return;
  }

  let options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // Include the auth token in the headers
    },
  };

  try {
    const response = await fetch(url, options); // Send DELETE request

    if (response.ok) {
      console.log(`Work ID ${id} deleted successfully.`);
      removeImageFromDOM(id); // Remove the work from the DOM
    } else {
      console.error(
        `Failed to delete work with ID ${id}. Status: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to remove the work from the DOM
function removeImageFromDOM(id) {
  console.log(`Looking for .image-container with data-id='${id}'`);
  const imageContainer = document.querySelector(
    `.image-container[data-id='${id}']`
  );
  console.log(imageContainer); // for debugging
  if (imageContainer) {
    imageContainer.remove(); // Remove the image container from the DOM
    console.log(`Image container with ID ${id} removed from the DOM.`);
  } else {
    console.log(`No image container found for ID ${id}`);
  }

  console.log(`Looking for .modal-image-container with data-id='${id}'`);
  const modalImageContainer = document.querySelector(
    `.modal-image-container[data-id='${id}']`
  );
  console.log(imageContainer); // for debugging
  if (modalImageContainer) {
    modalImageContainer.remove(); // Remove the modal image container from the DOM
    console.log(`Modal image container with ID ${id} removed from the DOM.`);
  } else {
    console.log(`No modal image container found for ID ${id}`);
  }
}
////////////////////////        DELETE A WORK VIA MODAL - END    ////////////////////////////////////////////////////////

////////////////////////        DISPLAY MAIN GALLERY - START  ///////////////////////////////////////////////////////////
// Get the image-container DOM element
const imagesContainerElement = document.getElementById("image-container"); //container that holds all images

// API URL
const apiURL = "http://localhost:5678/api/works";

// Function to fetch images for main gallery
function fetchImages(apiURL) {
  // Make the fetch call When you call fetch(apiURL), it returns a promise that resolves to a Response object.
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
    let id = architectWorks[i].id;

    var imageContainer = document.createElement("div"); //creating a div
    imageContainer.className = "image-container"; //assign a CSS class to the image container.  Assigning the string "image-container" to the className property of imageContainer
    imageContainer.setAttribute("data-category", category); //setting the category attribute to the image container div
    imageContainer.setAttribute("data-category-id", categoryId); //setting the categoryId attribute to the image container div
    imageContainer.setAttribute("data-id", id); //setting the id attribute to the image container div

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
////////////////////////       DISPLAY MAIN GALLERY -  END /////////////////////////////////////////////////////////////

////////////////////////       FILTER MAIN GALLERY -  START ////////////////////////////////////////////////////////////
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
  fetchImages(apiURL); // Fetch images when the DOM is fully loaded
});

// Event listeners for filter links
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
////////////////////////       FILTER MAIN GALLERY - END /////////////////////////////////////////////////////////////

////////////////////////       MODAL 1 THUMBNAIL GALLERY -  START ////////////////////////////////////////////////////
const modalImagesContainerElement = document.getElementById(
  "modal-image-container"
);

function modalLooptoDisplayImages(architectWorks) {
  for (let i = 0; i < architectWorks.length; i++) {
    let imageURL = architectWorks[i].imageUrl;
    let title = architectWorks[i].title;
    let category = architectWorks[i].category.name;
    let categoryId = architectWorks[i].categoryId;
    let id = architectWorks[i].id;

    var modalImageContainer = document.createElement("div"); //creating a div
    modalImageContainer.className = "modal-image-container"; //assign a CSS class to the modal image container.  Assigning the string "modal-image-container" to the className property of imageContainer
    modalImageContainer.setAttribute("data-category", category); //setting the category attribute to the modal image container div
    modalImageContainer.setAttribute("data-category-id", categoryId); //setting the categoryId attribute to the modal image container div
    modalImageContainer.setAttribute("data-id", id); //setting the Id attribute to the modal image container div

    var img = document.createElement("img");
    img.src = imageURL;
    img.alt = title;

    var deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.innerHTML = "🗑️";

    //Event listener to the delete button
    deleteButton.addEventListener("click", function () {
      deleteWorks(architectWorks[i].id);
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
////////////////////////       MODAL 1 THUMBNAIL GALLERY -  END //////////////////////////////////////////////////////

////////////////////////       MODAL 2 CATEGORIES DROPDOWN -  START //////////////////////////////////////////////////
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
      console.error("Error fetching categories:", error.message);
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
});
////////////////////////       MODAL 2 CATEGORIES DROPDOWN -  END ////////////////////////////////////////////////////////

////////////////////////       MODAL 2 CATEGORIES DROPDOWN -  END ////////////////////////
0;
////////////////////////  SHOW SPECIFIC MODALS AND NAVIGATION -  START //////////////////
const modal = document.querySelector(".modal");

function showModal(modalId) {
  // Hide all modals by adding the 'hidden' class
  document.getElementById("modal1-content").classList.add("hidden");
  document.getElementById("modal2-content").classList.add("hidden");

  const modalContent = document.getElementById(modalId); //when showModal function is called, showModal will pass modal1-content as the modalID to show Modal 1
  modalContent.classList.remove("hidden"); // Remove the class that hides the modal
  modal.style.display = "block"; // Show the modal container
}

//Show-Hide Modals based on Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  const editButton = document.getElementById("editButton");
  const addaphotoModalBtn = document.querySelector(".addaphotoModalBtn");
  const inactiveconfirmModalBtn = document.querySelector(
    "inactiveconfirmModalBtn"
  );
  const closeBtn = document.querySelector(".closeModalBtn");
  const modalBackbutton = document.querySelector(".modalBackbutton");

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
  modalBackbutton.addEventListener("click", function () {
    showModal("modal1-content");
    console.log("Modal 1 is open");
  });

  // Close modal when X is clicked
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
////////////////////////  SHOW SPECIFIC MODALS AND NAVIGATION - END //////////////////////////////////////////////////////
