// Get the DOM elements
const gallery = document.querySelector(".gallery");
const filterLinks = document.querySelectorAll(".filter_links a");
const loginLink = document.getElementById("login-link");
const loginSection = document.getElementById("login");
const mainContent = document.getElementById("main-content");

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

// Function to apply filter
function applyFilter(category) {
  const allImages = document.querySelectorAll(".gallery figure");

  allImages.forEach((figure) => {
    const categoryName = figure
      .querySelector("img")
      .dataset.categoryName.toLowerCase();
    if (category === "all" || categoryName === category.toLowerCase()) {
      figure.style.display = "block";
    } else {
      figure.style.display = "none";
    }
  });
}

// Event listeners for filter links
filterLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const category = e.target.dataset.filter;
    applyFilter(category);
  });
});

// Event listener for login link
loginLink.addEventListener("click", (e) => {
  e.preventDefault();
  mainContent.classList.add("hidden");
  loginSection.style.display = "block";
});

// Event listener for login form submission
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Placeholder for actual login logic
  if (username === "admin@example.com" && password === "password") {
    alert("Login successful!");
    mainContent.classList.remove("hidden");
    loginSection.style.display = "none";
  } else {
    alert("Invalid username or password.");
  }
});

// Fetch images when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", fetchImages);

