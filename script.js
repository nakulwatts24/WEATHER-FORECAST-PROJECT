// script.js

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
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    alert("Login successful!");
    sessionStorage.setItem("loggedIn", true);
    showSection("home");
  } else {
    alert("Invalid credentials. Please try again.");
  }
}

function toggleForm() {
  const authTitle = document.getElementById("auth-title");
  const registerFields = document.getElementById("register-fields");
  const isLogin = authTitle.textContent === "Login";

  if (isLogin) {
    authTitle.textContent = "Register";
    registerFields.style.display = "block";
  } else {
    authTitle.textContent = "Login";
    registerFields.style.display = "none";
  }
}

async function fetchWeather() {
  const apiKey = "f6dZMupNSKeYH7CQRipS24ylQ1oV2XW3"; // Replace with your actual API key
  const location = "42.3478,-71.0466"; // Replace with user-input or dynamic location
  const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // CORS Proxy
  const url = `${proxyUrl}https://api.tomorrow.io/v4/weather/forecast?location=${location}&apikey=${apiKey}`;

  try {
    console.log("Fetching data from:", url);
    const response = await fetch(url);

    if (!response.ok) {
      console.error("HTTP Error:", response.status, response.statusText);
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Weather Data Fetched Successfully:", data);
    displayWeather(data);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    alert("Failed to fetch weather data. Please check the console for details.");
  }
}

function displayWeather(data) {
  const weatherSection = document.getElementById("weather-info");

  if (!data || !data.timelines || !data.timelines.daily) {
    weatherSection.innerHTML = "<p>No weather data available.</p>";
    return;
  }

  const forecast = data.timelines.daily;
  const weatherHTML = forecast
    .map(
      (day) => `
      <div>
        <h3>Date: ${new Date(day.startTime).toLocaleDateString()}</h3>
        <p>Temperature: ${day.values.temperatureAvg}°C</p>
        <p>Condition: ${day.values.weatherCode}</p>
      </div>
    `
    )
    .join("");

  weatherSection.innerHTML = weatherHTML;
}

// Default to auth section
showSection("auth");