async function verifyUser() {
  const token = localStorage.getItem("token");
  console.log("Stored Token:", token);
  if (!token) {
    console.log("No token found. Redirecting to login...");
    window.location.replace("/index.html");
    return;
  }
  try {
    const res = await fetch("/api/users/verify-token", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Verify API Status:", res.status);
    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }
    const data = await res.json();
    console.log("Verify Response:", data);
    if (!data.status) {
      console.log("Invalid token. Logging out...");
      localStorage.removeItem("token");
      window.location.replace("/index.html");
      return;
    }
    console.log("User verified successfully.");
  } catch (err) {
    console.error("Verification Error:", err);
    alert(
      "Token verification failed. Check browser console and network requests."
    );
  }
}
verifyUser();
async function logoutUser() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("/api/users/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Logout Status:", res.status);
  } catch (err) {
    console.error("Logout API Error:", err);
  }
  localStorage.removeItem("token");
  window.location.replace("/logout.html");
}