window.onload = function () {
  showLogin(); // Ensure login form is shown by default
};

function register() {
  const username = document.getElementById("registerUsername").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const profilePic = document.getElementById("profilePicPreview").src;

  if (!username || !email || !password) {
    alert("All fields must be filled out.");
    highlightEmptyFields([username, email, password]);
    return;
  }

  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  localStorage.setItem(
    username,
    JSON.stringify({ username, email, password, profilePic })
  );
  alert("Account created successfully! You can now log in.");
  showLogin();
}

function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!username || !password) {
    alert("Both username and password are required.");
    return;
  }

  const userData = JSON.parse(localStorage.getItem(username));
  if (userData && userData.password === password) {
    alert("Login successful!");
    // Redirect to Streamlit app with a token
    window.location.href = `http://localhost:8501/?token=loggedin`; // Pointing to your local Streamlit URL
  } else {
    alert("Login failed: Invalid username or password.");
  }
}

function displayUserProfile(username, profilePic) {
  const profileDisplay = document.getElementById("profileDisplay");
  if (profileDisplay) {
    profileDisplay.innerHTML = `
            <p><strong>Username:</strong> <span id="profileUsername">${username}</span></p>
            <img id="profileImage" src="${
              profilePic || "https://via.placeholder.com/150"
            }" 
                alt="Profile Picture" 
                style="width: 150px; height: 150px; border-radius: 75px;"/> 
        `;
  }
  showProfile();
}

function showRegister() {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerForm").classList.remove("hidden");
  document.getElementById("profileForm").classList.add("hidden");
  resetFormInputs([
    "loginUsername",
    "loginPassword",
    "registerUsername",
    "registerEmail",
    "registerPassword",
  ]);
}

function showLogin() {
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("profileForm").classList.add("hidden");
}

function showProfile() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const profileForm = document.getElementById("profileForm");

  if (!loginForm || !registerForm || !profileForm) {
    console.error("One or more elements are not found in the DOM.");
    return;
  }

  loginForm.classList.add("hidden");
  registerForm.classList.add("hidden");
  profileForm.classList.remove("hidden");
}

function handleFileUpload(event) {
  const reader = new FileReader();
  reader.onload = function () {
    document.getElementById("profilePicPreview").src = reader.result;
    document.getElementById("profilePicPreview").style.display = "block";
  };
  reader.readAsDataURL(event.target.files[0]);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function highlightEmptyFields(fields) {
  fields.forEach((field, index) => {
    if (!field) {
      const input = document.querySelectorAll("input")[index];
      input.style.border = "2px solid red";
      setTimeout(() => {
        input.style.border = "none";
      }, 2000);
    }
  });
}

function resetFormInputs(inputIds) {
  inputIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.value = "";
  });
}

// New function to update the profile
function updateProfile() {
  const username = document.getElementById("updateUsername").value.trim();
  const newPassword = document.getElementById("updatePassword").value; // Get new password
  const profilePicInput = document.getElementById("updateProfilePic");
  const profilePic = profilePicInput ? profilePicInput.files[0] : null;
  const profileImage = document.getElementById("profileImage");

  // Load user data from localStorage
  const currentUsername = document.getElementById("profileUsername").innerText;
  const userData = JSON.parse(localStorage.getItem(currentUsername));

  // Check if username or profile picture is provided
  if (!username && !profilePic && !newPassword) {
    alert(
      "Please enter a username, a new password, or upload a new profile picture."
    );
    return;
  }

  // Update username if provided
  if (username) {
    userData.username = username;
    localStorage.setItem(username, JSON.stringify(userData));
    document.getElementById("profileUsername").innerText = username;
  }

  // Update password if provided
  if (newPassword) {
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    userData.password = newPassword; // Update password in user data
    localStorage.setItem(userData.username, JSON.stringify(userData)); // Save updated user data
  }

  // Update profile picture if a file is selected
  if (profilePic) {
    const reader = new FileReader();
    reader.onload = function (event) {
      if (profileImage) {
        profileImage.src = event.target.result;
        userData.profilePic = event.target.result; // Update profilePic in userData
        localStorage.setItem(userData.username, JSON.stringify(userData)); // Save updated user data with new picture
      }
    };

    reader.readAsDataURL(profilePic);
  }

  alert("Profile updated successfully!");
}

function logout() {
  // Implement logout functionality (e.g., clear local storage, reset UI)
  alert("Logged out successfully.");
  resetFormInputs([
    "loginUsername",
    "loginPassword",
    "registerUsername",
    "registerEmail",
    "registerPassword",
    "updateUsername",
    "updatePassword",
  ]);
  showLogin();
}
