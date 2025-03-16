
// Function to load HTML content dynamically into #main-content
function loadPage(page) {
  fetch(page)
      .then(response => response.text())
      .then(html => {
          document.getElementById("main-content").innerHTML = html;
          addTaskListeners(); // Reattach event listeners
          addProjectListeners();
          addProjectButtonListeners();
          addChatButtonListeners();
          addAllProjectButtonListeners();
      })
      .catch(error => console.error("Error loading page:", error));
}


// Load default page (project)
document.addEventListener("DOMContentLoaded", () => {
  loadPage("project.html");
});

function addProjectListeners() {
  document.querySelectorAll(".project").forEach(proj => {
      proj.addEventListener("click", () => {
          //let page = proj.getAttribute("data-page");
          loadPage(`dashboard.html`);
      });
  });
}

// Attach event listeners to task cards
function addTaskListeners() {
  document.querySelectorAll(".card_task").forEach(card => {
      card.addEventListener("click", () => {
          //et page = card.getAttribute("data-page");
          loadPage(`task.html`);
      });
  });
}

// Attach event listeners to project button
//might merge thsi to addProjectListers since both should lead to dashbaord page
function addProjectButtonListeners() {
  document.querySelectorAll(".sidebar_project_button").forEach(button => {
      button.addEventListener("click", () => {
          //et page = card.getAttribute("data-page");
          loadPage(`dashboard.html`);
      });
  });
}
function addAllProjectButtonListeners() {
  document.querySelectorAll(".sidebar_all_project_button").forEach(button => {
      button.addEventListener("click", () => {
          //et page = card.getAttribute("data-page");
          loadPage(`project.html`);
      });
  });
}

function addChatButtonListeners() {
  document.querySelectorAll(".sidebar_chat_button").forEach(button => {
      button.addEventListener("click", () => {
          //et page = card.getAttribute("data-page");
          loadPage(`chat.html`);
      });
  });
}
