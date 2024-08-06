// Get the DOM elements
const gallery = document.querySelector(".gallery");

// API URL
const apiURL = "http://localhost:5678/api/works"; 

// Function to fetch images
async function fetchImages() {
  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const images = await response.json(); // Assuming the API returns JSON data with image URLs
    displayImages(images);
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}

// Function to display images
function displayImages(images) {
  gallery.innerHTML = ""; // Clear previous images
  images.forEach((image) => {
    const figureElement = document.createElement("figure");

    const imgElement = document.createElement("img");
    imgElement.src = image.imageUrl; 
    imgElement.alt = image.title || "Image";
    imgElement.dataset.id = image.id;
    imgElement.dataset.categoryId = image.categoryId;
    imgElement.dataset.userId = image.userId;
    imgElement.dataset.categoryName = image.category ? image.category.name : "";

    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.textContent = image.title || "Untitled";

    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    gallery.appendChild(figureElement);
  });
}

// Fetch images when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", fetchImages);
