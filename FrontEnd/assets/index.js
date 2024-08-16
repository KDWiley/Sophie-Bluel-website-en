// Get the DOM elements, Get the img element by its id - Line 68 in HTML
const imgElement = document.getElementById("image-element");
//console.log("Image element:", imgElement);

// API URL
const apiURL = "http://localhost:5678/api/works";

// Function to fetch images
function fetchImages(apiURL) {
  // Make the fetch call When you call fetch(apiURL), it returns a promise that resolves to a Response object.

  //async function catchImages() {}
  //const response = await fetch(apiURL);
  //const json = await response.json();
  //document.getElementById("image-element");

  return (
    fetch(apiURL) //By adding return in front of fetch(apiURL), you are ensuring that the Promise returned by fetch is also returned from the fetchImages function.
      .then((response) => {
        console.log("Response object:", response);
        // Handle the response and convert it to JSON
        return response.json();
      })

      .then((data) => {
        loopThroughImageURLs(data);
        // Use the JSON data to get the image URL and display the image.  .then(data) is referring to the JSON data received from the previous promise
        const imageURL = data[2].imageUrl;
        displayImage(imageURL);
      })

      // Catch and log errors
      .catch((error) => console.error("Error fetching images:", error))
  );
}
//Loop
function loopThroughImageURLs(data) {
  for (let i = 0; i < data.length; i++) {
    let imageURL = data[i].imageUrl; // Assume data[i] contains image URL directly
    displayImage(imageURL);
  }
}

// Function to display images
function displayImage(imageURL) {
  imgElement.src = imageURL;
}

fetchImages(apiURL); // Fetch images when the DOM is fully loaded

// Function to apply filter

// Event listeners for filter links

// Event listener for login link

// Event listener for login form submission
