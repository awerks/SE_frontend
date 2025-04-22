//wait until html is loaded
//let user click the chat channel
//fetch old messages
//send new messages
//keep chat updating every few seconds

document.addEventListener("DOMContentLoaded", () => {
  const teamspaceEls = document.querySelectorAll(".chat_people_name");
  const chatMessages = document.getElementById("chatMesages");
  const sendBtn = document.getElementById("chatSendBtn");
  const inputEl = document.getElementById("chatInput");

  let selectedTeamspaceId = null;
  const senderId = parseInt(localStorage.getItem("userId"));

  let pollingInterval = null;

  teamspaceEls.forEach((el) => {
    el.addEventListener("click", () => {
      selectedTeamspaceId = el.getAttribute("data-teamspace-id");
      localStorage.setItem("selectedTeamSpaceId", selectedTeamspaceId);
      //highlight active chat
      teamspaceEls.forEach((el) => el.classList.remove("active"));
      el.classList.add("active");

      fetchMessages();
      clearInterval(pollingInterval);
      pollingInterval = setInterval(fetchMessages, 3000);
    });
  });
});

//accept Enter to send message
inputEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

sendBtn.addEventListener("click", () => {
  const message = inputEl.value.trim();
  if (!message || !selectedTeamspaceId) return;
  sendBtn.disabled = true;
  fetch(`/api/teamspace/${selectedTeamspaceId}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      senderId,
      message,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to send message");
      inputEl.value = "";
      fetchMessages();
    })
    .catch((err) => console.error(err))
    .finally(() => (sendBtn.disabled = false));
});

function fetchMessages() {
  if (!selectedTeamspaceId) return;

  fetch(`/api/teamspaces/${selectedTeamspaceId}/chat`)
    .then((res) => res.json())
    .then((messages) => {
      chatMessages.innerHTML = ""; //clear old

      if (messages.length === 0) {
        chatMessages.innerHTML =
          "<p style='color: #777;'>No messages yet. Say hi 👋</p>";
        return;
      }

      messages.forEach((msg) => {
        const bubble = document.createElement("div");
        bubble.classList.add("chat_bubble");
        bubble.classList.add(msg.senderId === senderId ? "sent" : "received");
        bubble.textContent = msg.message;
        

        const time = document.createElement("div");
        time.style.fontSize = "0.75em";
        time.style.color = "#999";
        time.style.marginTop = "4px";
        time.textContent = new Date(msg.timestamp).toLocaleTimeString();
        bubble.appendChild(time);

        chatMessages.appendChild(bubble);
      });
      //scroll to latest
      chatMessages.scrollTop = chatMessages.scrollHeight;
    })
    .catch((err) => console.error("Error loading messages", err));
}
