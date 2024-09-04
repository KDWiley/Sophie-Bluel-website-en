

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
        //console.log("Response object:", response);
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
    console.log("Created image container:", imageContainer); 

    //console.log("Category:", category);
    //console.log(imageContainer, img);
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
      imageContainerCollection[i].classList.add("hide"); // Add "hide" class to hide the image
    } else {
      imageContainerCollection[i].classList.remove("hide");
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {  //added 8/25
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

//When you login with correct credentials, take user to index.html with the Edit Button.  
//User is given a token
//Where do you go if you forgot your password?
//Event Listener for Login Page
//var form = document.querySelector("form");


//POST request using fetch with error handling
const emailElement = document.querySelector('#loginEmail');
const passwordElement = document.querySelector('#loginPassword');

document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the input values
  const email = emailElement.value;
  const password = passwordElement.value;

//Creating the object used to configure the http request for authentication
const authenticateOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      password: password
    })
  };
  console.log("Authenticate options:", authenticateOptions);

//Fetch Request
fetch("http://localhost:5678/api/users/login", authenticateOptions)
    .then(async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
  console.log("Received response:", response);
        const data = isJson && await response.json();
  console.log('Parsed response data:', data); // Log the parsed data

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

   .then(data => {
     
      const userId = data.userId;
      const token = data.token;

       if (token) {
        console.log('Authentication successful!');
        console.log('User ID:', userId);
        console.log('Token:', token)

                // You can store the token in local storage or use it for future requests
        localStorage.setItem('authToken', token);  // Store the token for future use
        localStorage.setItem("loggedIn", "true");

                // Redirect to the index.html page
        window.location.href = "index.html";

      } else {
        console.error('No token returned from API');
      }
    })
 .catch(error => {
      console.error('There was an error!', error); // Handle the error
 });

});

//SCRATCH PAPER
//https://jasonwatmore.com/post/2021/09/05/fetch-http-post-request-examples

//pseudo-code!

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

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.querySelector(".modal"); // Correctly selects the modal
  const editButton = document.getElementById("editButton"); // Correctly selects the edit button
  const closeBtn = document.querySelector(".closeModalBtn"); // Corrected selector for close button

  // Open modal
  editButton.addEventListener("click", function () {
    modal.style.display = "block";
    console.log("Modal is now open!"); // Log message for debugging
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

  //Modal functionality for image thumbnail gallery --MY MAIN GALLERY HIDES WHEN I HAVE THIS ACTIVE - Need to debug
//    const modalImagesContainer = document.getElementById("modalImagesContainer");
//    function looptoDisplayImages(architectWorks) {
//      for (let i = 0; i < architectWorks.length; i++) {
//       let imageURL = architectWorks[i].imageUrl;
//       let title = architectWorks[i].title;
//       let category = architectWorks[i].category.name;
//       let categoryId = architectWorks[i].categoryId;

//       var imageContainer = document.createElement("div"); //creating a div
//       imageContainer.className = "modalImageContainer"; //assign a CSS class to the image container.  Assigning the string "image-container" to the className property of imageContainer
//       imageContainer.setAttribute("data-category", category); //setting the category attribute to the image container div
//       imageContainer.setAttribute("data-category-id", categoryId); //setting the categoryId attribute to the image container div

//       var img = document.createElement("img");
//       img.src = imageURL;
//       img.alt = title;
//       imageContainer.appendChild(img);
//       modalImagesContainer.appendChild(imageContainer);
  
      
//     }
// }

// function fetchPics(){
//     let catsImgDiv = document.querySelector(".catsImgDiv")
//     catsImgDiv.innerHTML='';
//     fetch("https://api.thecatapi.com/v1/images/search") .then(
//     (response)=>
//      response.json()

  //async function catchImages() {
  //const response = await fetch(apiURL);
  //const json = await response.json();

