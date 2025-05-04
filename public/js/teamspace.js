import config from './config.js';

const API_URL = `${config.backendUrl}`;

function getProjectId()     // this is just for extracting the project id from the url or the localStorage
{
    const params = new URLSearchParams(window.location.search);
    const teamspaceId = params.get('projectId') || localStorage.getItem('currentProjectId');
    return teamspaceId;
} 
  //might need adjustments

async function fetchJSON (url, options ={}) { //options = {} == default empty object so it doesn't crash anymore
    const response = await fetch(url, {
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        ...options //for merging user-defined options into the default config (look below at APIs)
    });

    if(!response.ok)
    {
        let message = response.statusText;
        try{
            const data = await response.json();
            message = data.message || message;
        }
        catch{
            //idk, nothing I guess, no?
        }
        throw new Error(message);
    }
    return response.status === 204 ? null : response.json();
}


//API helper -------------
const api = {
    listTeamspaces(projectId)
    {
        return fetchJSON(`${API_URL}/projects/${projectId}/teamspace`);
    },
    createTeamspace(projectId, payload) {
        return fetchJSON(`${API_BASE}/projects/${projectId}/teamspaces`, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
    },
    deleteTeamspace(teamspaceId) {
        return fetchJSON(`${API_BASE}/teamspaces/${teamspaceId}`, { method: 'DELETE' });
    }
};

//DOM helper -------------

function html(string, ...values) //...values for interpolation
{
    return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '');
}//tagged template helper for joining values in a string

function teamspaceCard(ts)
{
    const article = document.createElement('article');
    article.className = "teamspace_card dynamic_nav";
    article.dataset.page = 'dashboard';
    article.dataset.teamspaceId = ts.teamspaceId;

    article.innerHTML = html `
    <div class='card_top'>
        <h3 class='team_name'>${ts.name}</h3>
        <p class='created'> Created: ${new Date(ts.createdAt).toLocaleDateString()}</p>
    </div>
    <p class='team_desc'>${ts.description}</p>
    <button class='delete_teamspace_btn' data-id='${ts.teamspaceId}'>Delete teamspace</button>
    `;
    return article;
}

function renderTeamspaces(list) 
{
    const container = document.querySelector('.teamspace_list');    // remove previous cards but keep modal overlay element
    container.querySelectorAll('.teamspace_card').forEach(el => el.remove());
    list.forEach(ts => container.appendChild(teamspaceCard(ts)));
}


// Modal handling -----------------

function setupModal() 
{
    const overlay = document.getElementById('createTeamModalOverlay');
    const openBtn = document.getElementById('openTeamModalBtn');
    const closeBtn = document.getElementById('closeTeamModalBtn');
  
    openBtn.addEventListener('click', () => overlay.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.add('hidden');
    });
}

// Create form ------------

function setupCreateForm(projectId) 
{
    const form = document.getElementById('createTeamForm');

    form.addEventListener('submit', async e => {

      e.preventDefault();
      const payload = {
        name: form.teamName.value.trim(),
        description: form.teamDescription.value.trim()
      };

      if (!payload.name || !payload.description) return;
  
      try {
        await api.createTeamspace(projectId, payload);
        const list = await api.listTeamspaces(projectId);
        renderTeamspaces(list);
        form.reset();
        document.getElementById('createTeamModalOverlay').classList.add('hidden');
      } catch (err) {
        alert(err.message);
      }
    });
}

// Delete handler ----------------

function setupDeleteHandler(projectId) 
{
    document
      .querySelector('.teamspace_list')
      .addEventListener('click', async e => { //I am attaching the event listener only once to the parent (event delegation)
        if (e.target.matches('.delete_teamspace_btn')) {
          const teamspaceId = e.target.dataset.teamspaceId;
          if (!confirm('Are you sure you want to delete this teamspace?')) return;
          try {
            await api.deleteTeamspace(id);
            const list = await api.listTeamspaces(projectId);
            renderTeamspaces(list);
          } catch (err) {
            alert(err.message);
          }
        }
      });
}

// ---- App bootstrap 

document.addEventListener('DOMContentLoaded', async () => {
    const projectId = getProjectId();
    if (!projectId) {
      alert('No project selected. Provide projectId in URL, e.g. ?projectId=1');
      return;
    }
  
    setupModal();
    setupCreateForm(projectId);
    setupDeleteHandler(projectId);
  
    try {
      const list = await api.listTeamspaces(projectId);
      renderTeamspaces(list);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch teamspaces: ' + err.message);
    }
  });
  
  




