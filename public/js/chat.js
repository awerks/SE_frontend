//wait until html is loaded
//let user click the chat channel
//fetch old messages
//send new messages
//keep chat updating every few seconds

document.addEventListener("DOMContentLoaded", ()=>{
  const teamspaceEls = document.getquerySelectorAll(".chat_people_name");
  const chatMessages = document.getElementById("chatMesages");
  const sendBtn = document.getElementById("chatSendBtn")
  const inputEl = document.getElementById("chatInput");

  let selectedTeamspaceId = null;
  const senderId = parseInt(localStorage.getItem("userId"))

  let pollingInterval = null;

  teamspaceEls.forEaach((el)=>{
    el.addEventListener("click", ()=>{
      selectedTeamspaceId = el.getAttribute("data-teamspace-id")
      localStorage.setItem("selectedTeamSpaceId", selectedTeamspaceId)
      fetchMessages();
      clearInterval(pollingInterval);
      pollingInterval = setInterval(fetchMessages, 3000)
    })
  })
})

sendBtn.addEventListener("click", ()=>{
  const message = inputEl.value.trim();
  if(!message || !selectedTeamspaceId) return;

  fetch(`/api/teamspace/${selectedTeamspaceId}/chat`, {
    method: "POST",
    header:{
      "Content-Type": "application/json",
    },
    body:JSON.stringify({
      senderId,
      message,
    })
  })
    .then((res)=>{
      if(!res.ok) throw new Error("Failed to send message")
        inputEl.value=""
      fetchMessages();
    })
    .cathc((err)=>console.error(err))
})

function fetchMessages(){
  if(!selectedTeamspaceId) return;

  fetch(`/api/teamspaces/${selectedTeamspaceId}/chat`)
    .then((res)=> res.json())
    .then((message)=>{
      chatMessages.innerHTML ="" //clear old

      message.forEach((msg)=>{
        const bubble = document.createElement("div");
        bubble.classList.add("chat_bubble");
        bubble.classList.add(msg.senderId ===senderId ? "sent": "received");
        bubble.textContent = msg.message;
        chatMessages.appendChild(bubble)
      })

      //scroll to latest
      chatMessage.scrollTop = chatMessages.scrollingHeight
    })
    .cathc((err)=> console.error("Error loading messages", err))
}