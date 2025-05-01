const users = [
  { username: "user1", password: "pass1" },
  { username: "user2", password: "pass2" },
  { username: "user3", password: "pass3" },
];

function showSection(sectionId) {
  if (!sessionStorage.getItem("loggedIn") && sectionId !== "auth") {
    alert("Please log in to access this page.");
    return;
  }

  document.querySelectorAll("section").forEach((section) => {
    section.style.display = "none";
  });

  document.getElementById(sectionId).style.display = "block";
}

function handleLogin(event) {
  event.preventDefault();

  const authTitle = document.getElementById("auth-title").textContent;
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const mobile = document.getElementById("mobile").value.trim();

  if (authTitle === "Register") {
    if (!username || !password || !mobile) {
      alert("All fields are required for registration.");
      return;
    }

    users.push({ username, password });
    alert("Registration successful! You can now log in.");
    toggleForm();
  } else {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      alert("Login successful!");
      sessionStorage.setItem("loggedIn", true);
      showSection("home");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  }
}

function toggleForm() {
  const authTitle = document.getElementById("auth-title");
  const registerFields = document.getElementById("register-fields");
  const mobileInput = document.getElementById("mobile");
  const isLogin = authTitle.textContent === "Login";

  if (isLogin) {
    authTitle.textContent = "Register";
    registerFields.style.display = "block";
    mobileInput.setAttribute("required", "true");
  } else {
    authTitle.textContent = "Login";
    registerFields.style.display = "none";
    mobileInput.removeAttribute("required");
  }
}

// Fetch Weather Data
async function fetchWeather() {
  const apiKey = "2b6a20eb700119111337edd48e764f54"; // Replace with your new API key
  const locationInput = document.querySelector(".weatherInput").value.trim();

  if (!locationInput) {
    alert("Please enter a valid location.");
    return;
  }

  
  const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    locationInput
  )}&limit=1&appid=${apiKey}`;

  try {
    const geoResponse = await fetch(geocodingUrl);

    if (!geoResponse.ok) {
      console.error("Error fetching coordinates:", geoResponse.status);
      throw new Error("Failed to fetch coordinates.");
    }

    const geoData = await geoResponse.json();

    if (geoData.length === 0) {
      alert("Location not found. Please try again.");
      return;
    }

    const { lat, lon } = geoData[0];

    // Fetch Weather Forecast using obtained coordinates
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastResponse = await fetch(forecastUrl);

    if (!forecastResponse.ok) {
      console.error("Error fetching weather:", forecastResponse.status);
      throw new Error("Failed to fetch weather data.");
    }

    const weatherData = await forecastResponse.json();
    console.log("Weather Data:", weatherData);
    displayWeather(weatherData);
  } catch (error) {
    console.error("Error:", error.message);
    alert("Unable to fetch weather data. Check the console for details.");
  }
}

// Display Weather Data
function displayWeather(data) {
  const weatherSection = document.getElementById("weather-info");

  if (!data || !data.list || data.list.length === 0) {
    weatherSection.innerHTML = "<p>No weather data available.</p>";
    return;
  }

  const weatherHTML = data.list
    .slice(0, 5) // Display the first 5 forecast intervals (e.g., next 5 time slots)
    .map((entry) => {
      const time = new Date(entry.dt * 1000).toLocaleString();
      const temp = entry.main.temp;
      const condition = entry.weather[0].description;

      return `
        <div class="weather-card">
          <h3>Time: ${time}</h3>
          <p>Temperature: ${temp}°C</p>
          <p>Condition: ${condition}</p>
        </div>
      `;
    })
    .join("");

  weatherSection.innerHTML = weatherHTML;
}

// Default to auth section
showSection("auth");
