// Get the DOM elements, Get the img element by its id - Line 68 in HTML
//const imgElement = document.getElementById("image-element");
const imgContainer = document.getElementById("image-container");
const filterLinks = document.querySelector('#filter_links');

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
        looptoDisplayImages(data);
        // Use the JSON data to get the image URL and display the image.  .then(data) is referring to the JSON data received from the previous promise
        const imageURL = data[i].imageUrl;
        displayImage(imageURL);
      })

      // Catch and log errors
      .catch((error) => console.error("Error fetching images:", error))
  );
}

//Loop
function looptoDisplayImages(data) {
  for (let i = 0; i < data.length; i++) {
    let imageURL = data[i].imageUrl;
   var img = document.createElement('img');
  img.src = imageURL;
  document.getElementById('image-container').appendChild(img);
  }
}

fetchImages(apiURL); // Fetch images when the DOM is fully loaded


/*To filter we will need Boolean flag with the loop documet.addEventListener("click", acknowledgeClick);
catergories.forEach(element => {
    const domElement = document.createElement('span');
    domElement.innerText = element.name;
    docElement.classList.add()

    filterContainer.appendChiled(domElement)
})
})



function images {
let x, i;
x = document.getElementsByClassName("image-container");
if (images === "all") images = "";
for (i = 0; i <x.length; i++) {
  removeClass(x[i], "show");
  if(x[i].className.indexOf(images) > -1) addClass(x[i], "show")
}
}

function addClass(element, name){
    let i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++){
      if(arr1.indexOf(arr2[i]) == -1){
          element.className += " " + arr2[i];
      }
   }
}

function removeClass(element, name){
    let i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++){
        while (arr1.indexOf(arr2[i]) > -1) {
          arr1.splice(arr1.indexOf(arr2[i]), 1)
      }
}
    element.className = arr1.join(" ")
}


    
    // Assume data[i] contains image URL directly
    // <!-- <img id="image-element" alt="Image from API" src="#" /> -->
    //create an image tag
    //add link from imageURL
    //Add Alt tag from Title
    //append image element to container
  }
}



// Function to apply filter

// Event listeners for filter links

// Event listener for login link

// Event listener for login form submission*/
