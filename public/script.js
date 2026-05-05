history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};

async function verifyUser() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const res = await fetch('/api/users/verify-token', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const data = await res.json();

    console.log("Verify Response:", data);
    if (!data.status) {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    }

  } catch (err) {
    console.error("Verification error:", err);
    localStorage.removeItem("token");
    window.location.href = "index.html";
  }
}
verifyUser();

 async function logoutUser() {
  const token = localStorage.getItem("token");

  try {
    await fetch('/api/users/logout', {   // <-- added /
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  } catch (err) {
    console.error("Logout API error:", err);
  }

  localStorage.removeItem("token");
  window.location.href = "logout.html"; // redirect after logout
}