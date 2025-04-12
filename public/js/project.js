console.log(document.getElementById('create-project-form')); 
console.log(document.getElementById('project-list'));    
console.log(document.getElementById('search-form')); 
//none of them should be null to be in the clear

const API_URL = '/api/projects';

//helper function for errors as on swagger
function displayError(message)
{
    console.error(message);
    alert(message);
}
//error is the message

async function createProject(newProjectData)
{
    try
    {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: newProjectData.name,
                description: newProjectData.description,
                created_by: localStorage.getItem("userId")
                //Ben says I will have to add a deadLine and a team_space_id in the future, although optional
            })
        });
        
        if(!response.ok) throw new Error('Failed to create project!');

        const project = await response.json();

        console.log('Project created:', project.creation_date);

        loadProjects(); // refreshing the list
    } catch(error)
    {
        displayError(error.message);
    }
}

async function loadProjects()
{
    try //I will get all projects available with GET api/projects; I will have to implement the individual one as well
    {
        const response = await fetch(API_URL);

        if(!response.ok) throw new Error('Failed to fetch the projects');

        const projects = await response.json();
        displayProjects(projects); //gotta define one for this as well
    }
    catch(error)
    {
        displayError(error.message);
    }
}

function displayProjects(projects)
{
    const projectList = document.getElementById('project-list'); //correct naming??? idk
    projectList.innerHTML = ''; //for clearing

    //error checker to check if there are any existing projects
    if(!Array.isArray(projects) || projects.length === 0)
    {
        projectList.innerHTML = '<p>No Projects found.</p>';
        return;
    }

    projects.forEach(project => {
        const div = document.createElement('div'); 
        div.className = 'project';

        div.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <p><strong> Created:</strong> ${new Date(project.creation_date).toLocaleString()}</p>
        <p><strong> Created By ID:</strong> ${project.created_by}</p> 

        ${project.teamspaces && project.teamspaces.length > 0 ? `
            <p><strong>Teamspaces: </strong></p>
            <ul>  
                <!-- unordered list, I guess -->
                ${project.teamspaces.map(ts => `<li>${ts.name} (ID: ${ts.teamspaces_id})</li>`).join('')}
            </ul> ` : '<p>No teamspaces associated.</p>'}

        <button onclick="viewProject('${project.project_id}')"> View </button> 
        <button onclick = "updateProjectPrompt('${project.project_id}')"> Edit </button>
        <button onclick="deleteProject('${project.project_id}')">Delete</button>
        `;

        projectList.appendChild(div);
    });//still has variable name problems due to the backend typos
}

//the function to get it by ID as I said before

async function viewProject(projectId)
{
    try
    {
        const response = await fetch(`${API_URL}/${projectId}`);
        
        if(!response.ok) throw new Error('Failed to fetch project details');

        const project = await response.json();
        const detailsSection = document.getElementById('project-details');
        const detailsContent = document.getElementById('details-content');

        detailsContent.innerHTML = `<strong> Name: </strong> ${project.name}<br>
                                    <strong> Description:</strong> ${project.description}`;
        detailsSection.classList.remove('hidden');
    }
    catch(error)
    {
        displayError(error.message);
    }
}
//requires overview by Illia or Ben

async function updateProject(projectId, updatedData) 
{
    try
    {
        const response = await fetch(`${API_URL}/${projectId}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' }, 
           body: JSON.stringify(updatedData)
        });

        if(!response.ok) throw new Error('Failed to update the project');

        const updatedProject = await response.json(); //as Illia explained, like on swaggerhubs

        console.log('Project updated:', updatedProject);
        //for refreshing

        loadProjects();    
    }
    catch(error)
    {
        displayError(error.message);
    }
}

function updateProjectPrompt(projectId)
{
    const newName = prompt('Enter new project name:');
    const newDescription = prompt('Enter new project description:');

    if(newName && newDescription)//checker
    {
        updateProject(projectId, { name: newName, description: newDescription});
    }
}

//the deletion project function
async function deleteProject(projectId)
{
    if(!confirm('Are you sure you want to delete this project?')) return;

    try
    {
        const response = await fetch(`${API_URL}/${projectId}`, {
            method: 'DELETE'
        });

        if(!response.ok) throw new Error('Failed to delete project');
        console.log(`Project ${projectId} deleted`);

        loadProjects();
    }
    catch(error)
    {
        displayError(error.message);
    }
}

//function for siplaying the search results
function displaySearchResults(data)
{
    const searchResultsDiv = document.getElementById('search-results');
    searchResultsDiv.innerHTML= '';

    if(data.error)
    {
        searchResultsDiv.innerHTML = `<p class="error-message">${data.error}</p>`;
    }
    else if (data)
    {
        searchResultsDiv.innerHTML = `
        <div class="project"> <h3>${data.name}</h3>
            <p>${data.description}</p>
            <p><strong>Project ID: </strong> ${data.project_id}</p>
            <p><strong>Created: </strong> ${new Date(data.creation_date).toLocaleString()}</p>
            <p><strong>Created By ID: </strong> ${data.created_by}</p>
            ${data.teamspaces && data.teamspaces.length > 0 ? `
                <p><strong>Teamspaces:</strong></p>
                <ul>
                ${data.teamspaces.map(ts => `<li>${ts.name} (ID: ${ts.teamspaces_id})</li>`).join('')}
                </ul>
            ` : ''}
        </div>
        `;
    }else
    {
        //imma fallback the unexpected cases
        searchResultsDiv.innerHTML=`<p>Could not display the project data.</p>`
    }
}

async function fetchAndDisplayProject(projectId)
{
    try
    {
        const response = await fetch(`${API_URL}/${projectId}`);

        if(!response.ok)
        {
            if(response.status == 404) //as Illia said a few weeks ago
            {
                displaySearchResults({error: `Project with ID ${projectId} not found.`});// extra touch
            }
            else
            {
                throw new Error(`Failed to fetch the project. Status ${response.status}`);
            }
        }
        else //if there are no errors, just display the project
        {
            const project = await response.json();
            displaySearchResults(project);
        }
    }
    catch(error)
    {
        console.error('Search Error:', error);
        displaySearchResults({error: error.message || 'An error occurred during the search.'});
        //I could use this or the global displayError function which would be sth like
        //displayError('Search failed: ' + error.message);    same shit
    }
}

//made the event listener .getElementById and put it here

document.getElementById('create-project-form').addEventListener('submit', event => {
    event.preventDefault();//for preventing the link from opening the URL accidentally

    const name = document.getElementById('project-name').value;
    const description = document.getElementById('project-description').value;

    if(name && description)
    {
        createProject({name, description});
        event.target.reset();
    }
    else
    {
        alert('Please fill in both fields');
    }
});

document.getElementById('close-details').addEventListener('click', ()=> {
    document.getElementById('project-details').classList.add('hidden');
});
//the event listener to close the project details view

//here I made an event listener for the search form as well
document.getElementById('search-form').addEventListener('submit', event =>{
    event.preventDefault(); //preventing the reloading of the page

    const projectIdInput = document.getElementById('project-id-input');
    const projectId = projectIdInput.value.trim(); //for getting and trimming the input value
    //I saw in testing that if I don't trim, It will just copy the whitespaces as well

    if(projectId)
    {
        fetchAndDisplayProject(projectId);
    }
    else
    {
        displaySearchResults({error: 'Please enter a Project ID.'});
    }

    projectIdInput.value = '';
    //for clearing the input, although idk if this would work
    //I would leave it commented for now
})

window.addEventListener('load', loadProjects);


//I still don't know which if the naming is 100% correct as there were different namings from
//the backend team
