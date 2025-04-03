function displayUserInfo() {
  const userInfoEl = document.getElementById("user-info");
  if (!userInfoEl) {
    console.warn("User info element not found.");
    return;
  }

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role") ?? "User";

  userInfoEl.textContent = username ? `${username} (${role})` : "Guest";
}

function loadPage(url, updateHistory = true) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error loading ${url}: ${response.statusText}`);
      }
      return response.text();
    })
    .then((html) => {
      document.getElementById("main-content").innerHTML = html;
      if (updateHistory) {
        history.pushState({ page: url }, ""); // for back/forward navigation
      }
      console.log("Page loaded:", url);
      attachDynamicClickHandlers(url);

      if (url.includes("teamspace.html")) {
        attachModalHandlers();
      }
    })

    .catch((error) => {
      console.error(error);
      document.getElementById(
        "main-content"
      ).innerHTML = `<p>Error loading page.</p>`;
    });
}

function attachDynamicClickHandlers(url) {
  if (url.includes("project.html")) {
    addIndividualProjectListeners();
  }
  if (url.includes("dashboard.html")) {
    addIndividualTaskListeners();
  }
}

function addIndividualTaskListeners() {
  document.querySelectorAll(".card_task").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      loadPage(`task.html`);
    });
  });
}

function addIndividualProjectListeners() {
  document.querySelectorAll(".project").forEach((proj) => {
    proj.addEventListener("click", (e) => {
      e.preventDefault();
      loadPage(`dashboard.html`);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  displayUserInfo();

  document.addEventListener("click", (e) => {
    const button = e.target.closest(".dynamic_nav");
    console.log(button);
    if (!button) return;

    const page = button.getAttribute("data-page");
    if (page) loadPage(`../pages/${page}.html`);
  });

  window.addEventListener("popstate", (e) => {
    if (e.state && e.state.page) {
      console.log("Back/forward navigation detected");
      console.log("Loading page:", e.state.page);
      loadPage(e.state.page, false);
    }
  });
});

// Teamspace modal logic
function attachModalHandlers() {
  const openButton = document.getElementById("openTeamModalBtn");
  const closeButton = document.getElementById("closeTeamModalBtn");
  const createForm = document.getElementById("createTeamForm");

  if (openButton) {
    openButton.addEventListener("click", showModal);
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  if (createForm) {
    createForm.addEventListener("submit", (e) => {
      e.preventDefault(); // prevent form from refreshing the page

      const teamName = document.getElementById("teamName").value;
      const teamDescription = document.getElementById("teamDescription").value;

      console.log(" Creating team space:", teamName, teamDescription);
      closeModal();
    });
  }
}
function showModal() {
  document.getElementById("createTeamModalOverlay")?.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("createTeamModalOverlay")?.classList.add("hidden");
}
