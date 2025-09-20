const sosBtn = document.getElementById("sosBtn");

sosBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value || "Anonymous";
  const message = document.getElementById("message").value;

  // Get geolocation
  navigator.geolocation.getCurrentPosition(async (position) => {
    const location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    try {
      const res = await fetch("http://localhost:3000/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, location })
      });
      const data = await res.json();
      if (data.success) {
        // TTS confirmation
        const utter = new SpeechSynthesisUtterance("SOS alert sent successfully!");
        speechSynthesis.speak(utter);
        alert("SOS sent!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send SOS");
    }
  }, (err) => {
    console.error(err);
    alert("Unable to get location");
  });
});
