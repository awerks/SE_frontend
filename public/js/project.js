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
            body: JSON.stringify(newProjectData)
        });//as on swaggerhubs

        if(!response.ok) throw new Error('Failed to create project!');

        const project = await response.json();

        console.log('Project created:', project);

        //this should refresh the list of projects after creation 
        loadProjects(); // I have to write this below
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

    projects.forEach(project => {
        const div = document.createElement('div'); 
        div.className = 'project';
        div.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <button onclick="viewProject('${project.id}')"> View </button> 
        <button onclick = "updateProjectPrompt('${project.id}')"> Edit </button>
        <button onclick="deleteProject('${project.id}')">Delete</button>
        `;

        projectList.appendChild(div);
    });//should this be projectID like on swagger?
}

//the function to get it by ID as I said before

async function viewProject(projectId)
{
    try
    {
        const response = await fetch(`${API_URL}/{projectId}`);
        
        if(!response.ok) throw new Error('Failed to fetch project details');

        const project = await response.json();
        const detailsSection = document.getElementById('project-details');
        const detailsContent = document.getElementById('details-content');

        detailsContent.innerHTML = `<strong> Title: </strong> ${project.title}<br>
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
           body: JSON.stringify(updateData)
        });

        if(!response.ok) throw new Error('Failed to update the project');

        const updatedProject = await response.json(); //as Illia explained, like on swaggerhubs

        console.log('Project updated:', updateProject);
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
    const newTitle = prompt('Enter new project title:');
    const newDescription = prompt('Enter new project description:');

    if(newTitle && newDescription)//checker
    {
        updateProject(projectId, { title: newTitle, description: newDescription});
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

//made the event listener .getElementById and put it here

document.getElementById('create-project-form').addEventListener('submit', event => {
    event.preventDefault();//for preventing the link from opening the URL accidentally

    const title = document.getElementById('project-title').value;
    const description = document.getElementById('project-description').value;

    if(title && description)
    {
        createProject({title, description});
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

window.addEventListener('load', loadProjects);








