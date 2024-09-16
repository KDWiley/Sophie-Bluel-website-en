
//SCRATCH PAPER for Authentication

//https://jasonwatmore.com/post/2021/09/05/fetch-http-post-request-examples

//When you login with correct credentials, take user to index.html with the Edit Button.
//User is given a token
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
