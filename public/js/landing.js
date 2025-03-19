function displayUserInfo()
{
  const userName = localStorage.getItem("username");
  const userRole = localStorage.getItem("userrole");

  const userInfoElement = document.getElementById("user-info");//solved

  if(userName)//made a role checker because there was nothig saved in the localStorage
  {
    userInfoElement.textContent = `${username} (${userrole ?  userrole : "role nonexistent"})`;
  }
  else
  {
    userInfoElement.textContent = "Guest";
  }
}

function loadPage(url, updateHistory = true) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error loading ${url}: ${response.statusText}`);
      }
      return response.text();
    })
    .then(html => {
      document.getElementById('main-content').innerHTML = html;
      if (updateHistory) {
        history.pushState({ page: url }, ''); // for back/forward navigation
      }
      console.log('Page loaded:', url);
      attachDynamicClickHandlers(url);
    })
    .catch(error => {
      console.error(error);
      document.getElementById('main-content').innerHTML = `<p>Error loading page.</p>`;
    });
}

function attachDynamicClickHandlers(url) {
  if (url.includes('project.html')) {
    addIndividualProjectListeners();
  }
  if (url.includes('dashboard.html')) {
    addIndividualTaskListeners();
  }
}

function addIndividualTaskListeners() {
  document.querySelectorAll(".card_task").forEach(card => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      loadPage(`task.html`);
    });
  });
}

function addIndividualProjectListeners() {
  document.querySelectorAll(".project").forEach(proj => {
    proj.addEventListener("click", (e) => {
      e.preventDefault();
      loadPage(`dashboard.html`);
    });
  });
}


document.addEventListener('DOMContentLoaded', () => {

  displayUserInfo();

  const sidebarAllProjectBtn = document.querySelector('.sidebar_all_project_button');
  if (sidebarAllProjectBtn) {
    sidebarAllProjectBtn.addEventListener('click', e => {
      e.preventDefault();
      loadPage('project.html');
    });
  }
  document.querySelectorAll('.sidebar_project_button').forEach(btn =>
    btn.addEventListener('click', e => {
      e.preventDefault();
      loadPage('dashboard.html');
    })
  );

  const chatButton = document.querySelector('.sidebar_chat_button');
  if (chatButton) {
    chatButton.addEventListener('click', e => {
      e.preventDefault();
      loadPage('chat.html');
    });
  }
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
      console.log('Back/forward navigation detected');
      console.log('Loading page:', e.state.page);
      loadPage(e.state.page, false);
    }
  });
});
