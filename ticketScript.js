document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("https://api.example.com/ticket/team/123");
    if (!response.ok) throw new Error("Failed to fetch ticket data");
    const data = await response.json();

    /* ---------------- EVENT ---------------- */
    document.getElementById("eventDay").textContent = data.eventDay;
    document.getElementById("eventDescription").textContent = data.eventDescription;
    document.getElementById("eventName").textContent = data.eventName;

    /* ---------------- TEAM ---------------- */
    document.querySelectorAll("#teamName").forEach(el => el.textContent = data.teamName);

    const rawTeamId = data.teamId;
    document.querySelectorAll("#teamId").forEach(el => {
      el.textContent = rawTeamId.slice(0, 5) + "-" + rawTeamId.slice(5);
    });

    /* ---------------- INDIVIDUAL MEMBERS ---------------- */
    const formatPhone = phone => phone.slice(0, 5) + " " + phone.slice(5);
    const formatIndiId = id => id.slice(0, 6) + "-" + id.slice(6);

    data.members.forEach((member, index) => {
      const i = index + 1;

      document.getElementById(`attendeeName${i}`).textContent = member.name;
      document.getElementById(`phoneNumber${i}`).textContent = formatPhone(member.phone);
      document.getElementById(`indiId${i}`).textContent = formatIndiId(member.indiId);
      document.getElementById(`qrCode${i}`).src = member.qrCodeUrl;
    });

  } catch (error) {
    console.error("Error loading ticket data:", error);
  }
});
