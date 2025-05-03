import { initializeTheme2 } from "./theme.js";


function displayUserInfo() {
  /*
  const userInfoEl = document.getElementById("user-info");
  const mobileRoleEl = document.getElementById("mobile-user-role");

  const username = localStorage.getItem("username");
  const role     = localStorage.getItem("role");
  const userId   = localStorage.getItem("userId");

  const usernameEl = document.getElementById("user-username");
  const roleEl     = document.getElementById("user-role");
  const userIdEl   = document.getElementById("user-id");

  if (usernameEl) usernameEl.textContent = username ?? "Guest";
  if (roleEl)     roleEl.textContent     = role ?? "Unknown";
  if (userIdEl)   userIdEl.textContent   = userId ?? "-";

  console.log("User info loaded:", { username, role, userId });
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
      if (url.includes("chat.html")) {
        loadChatCSS();
        setTimeout(() => {
          const script = document.createElement("script");
          script.src = "../js/chat.js";
          document.body.appendChild(script);
        }, 100);
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
    //initializeProjectPage(); //the function I added belowe on top of addIndividualProjectListeners()
    addIndividualProjectListeners();
  }
  if (url.includes("dashboard.html")) {
    addIndividualTaskListeners();
  }
  if (url.includes("teamspace.html")) {
    addIndividualTeamspaceListeners();
  }

  // Re-attach mobile event handlers after page load
  setupMobileHeader();

  // Re-initialize theme toggle on page load
  setupThemeToggle();
}
// this function helps deal with changing the color theme of the website
function setupThemeToggle() {
  const themeToggle = document.getElementById("changeTheme");
  const rootElement = document.documentElement;
  const savedTheme = localStorage.getItem("theme") || "light";

  rootElement.setAttribute("data-theme", savedTheme);

  if (themeToggle) {
    //remove existing listeners
    const newThemeToggle = themeToggle.cloneNode(true);
    themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);

    newThemeToggle.addEventListener("click", () => {
      const currentTheme = rootElement.getAttribute("data-theme") || "light";
      const newTheme = currentTheme === "light" ? "dark" : "light";
      rootElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      console.log("Theme changed to:", newTheme);
    });
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
  document.querySelectorAll(".project_card").forEach((proj) => {
    proj.addEventListener("click", (e) => {
      e.preventDefault();
      loadPage(`teamspace.html`);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  displayUserInfo();
  setupMobileHeader();
  setupThemeToggle();

  if (document.getElementById("main-content").children.length === 0) {
    loadPage("./project.html");
  }

  document.addEventListener("click", (e) => {
    const button = e.target.closest(".dynamic_nav");
    if (!button) return;

    const page = button.getAttribute("data-page");
    if (page) loadPage(`./${page}.html`);
  });

  //handle logout button(same as back to index)
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      window.location.href = "./index.html";
    });
  }

  //handle back/forward browser navigation
  window.addEventListener("popstate", (e) => {
    if (e.state && e.state.page) {
      console.log("Back/forward navigation detected");
      loadPage(e.state.page, false);
    }
  });
});
// this function implements all features needed for the mobile version to support a changed layout & dropdown
function setupMobileHeader() {
  const mobileTopbar = document.getElementById("mobile-topbar");
  const mobileDropdown = document.getElementById("mobile-dropdown");
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const headerBackButton = document.getElementById("header-back-button");

  const isMobileView = () => window.innerWidth <= 600;

  function updateMobileUI() {
    const themeButton = document.getElementById("changeTheme");
    const logoutButton = document.getElementById("logout");

    if (isMobileView()) {
      if (mobileTopbar) mobileTopbar.classList.remove("hidden");
      if (headerBackButton) headerBackButton.classList.add("hidden");

      if (themeButton && mobileDropdown) {
        const existingThemeButton =
          mobileDropdown.querySelector("#changeTheme");
        if (!existingThemeButton) {
          const clonedThemeButton = themeButton.cloneNode(true);
          mobileDropdown.appendChild(clonedThemeButton);

          clonedThemeButton.addEventListener("click", () => {
            const rootElement = document.documentElement;
            const currentTheme =
              rootElement.getAttribute("data-theme") || "light";
            const newTheme = currentTheme === "light" ? "dark" : "light";
            rootElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);

            mobileDropdown.classList.add("hidden");
          });
        }
      }

      if (logoutButton && mobileDropdown) {
        const existingLogoutButton = mobileDropdown.querySelector("#logout");
        if (!existingLogoutButton) {
          const clonedLogoutButton = logoutButton.cloneNode(true);
          mobileDropdown.appendChild(clonedLogoutButton);

          clonedLogoutButton.addEventListener("click", () => {
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            window.location.href = "./index.html";
          });
        }
      }
    } else {
      if (mobileTopbar) mobileTopbar.classList.add("hidden");
      if (headerBackButton) headerBackButton.classList.remove("hidden");

      if (mobileDropdown) {
        const dropdownThemeButton =
          mobileDropdown.querySelector("#changeTheme");
        const dropdownLogoutButton = mobileDropdown.querySelector("#logout");

        if (dropdownThemeButton)
          mobileDropdown.removeChild(dropdownThemeButton);
        if (dropdownLogoutButton)
          mobileDropdown.removeChild(dropdownLogoutButton);
      }
    }
  }

  //run on page load
  updateMobileUI();

  //run on window resize
  window.addEventListener("resize", updateMobileUI);

  if (mobileMenuToggle && mobileDropdown) {
    const newMobileMenuToggle = mobileMenuToggle.cloneNode(true);
    mobileMenuToggle.parentNode.replaceChild(
      newMobileMenuToggle,
      mobileMenuToggle
    );

    newMobileMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation(); //deals with over clicking
      mobileDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (
        mobileDropdown &&
        !mobileDropdown.contains(e.target) &&
        e.target.id !== "mobile-menu-toggle" &&
        !mobileDropdown.classList.contains("hidden")
      ) {
        mobileDropdown.classList.add("hidden");
      }
    });
  }
}

function addIndividualTeamspaceListeners() {
  document.querySelectorAll(".teamspace_card").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();

      const teamspaceId = card.getAttribute("data-id"); // must be added in teamspace.html; hardcoded by Andrei on 21/04
      if (!teamspaceId) {
        console.warn("No teamspace ID found");
        return;
      }

      localStorage.setItem("selectedTeamspaceId", teamspaceId);
    });
  });
}

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
      e.preventDefault(); 

      const teamName = document.getElementById("teamName").value;
      const teamDescription = document.getElementById("teamDescription").value;

      console.log("Creating team space:", teamName, teamDescription);
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

//load chatcss
function loadChatCSS() {
  const chatCSS = document.getElementById("chat-css");
  if (chatCSS) {
    chatCSS.disabled = false;
  }
}
