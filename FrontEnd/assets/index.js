// Get the DOM elements
const imgElement = document.getElementById("image-element");

// API URL
const apiURL = "http://localhost:5678/api/works";

// Function to fetch images
function fetch(apiURL) {

  fetch(apiURL) // Make the fetch call When you call fetch(apiURL), it returns a promise that resolves to a Response object.
    .then((response) => response.json()) // Handle the response and convert it to JSON
    .then((data) => {
      console.log(data);
      // Use the JSON data to get the image URL and display the image
      const imageURL = data[2].imageUrl;
      display_image(imageURL);
    })
    // Catch any errors and log them
    .catch((error) => console.error("Error fetching image:", error));

  // Function to display images
  function display_image(imageUrl) {
    // Get the img element by its id
    //const imgElement = document.getElementById("image-element");
    // Set the src attribute to the imageUrl
    imgElement.src = imageUrl;
  }
}

console.log(data);

// Function to apply filter

// Event listeners for filter links

// Event listener for login link

// Event listener for login form submission

// Fetch images when the DOM is fully loaded
