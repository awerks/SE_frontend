export function getProjects()
{
    return JSON.parse(localStorage.getItem("projects") || "[]");
}

export function saveProjects(projects)
{
    localStorage.setItem("projects", JSON.stringify(projects));
}

export function createProject(name, description)
{
    const projects = getProjects();
    const newProject = {
        projectId: Date.now().toString(),
        name, 
        description
    };
    projects.push(newProject);
    saveProjects(projects);
    return newProject;
}

export function searchProjectById(id)
{
    const projects = getProjects();
    return projects.find(p => p.id === projectId) || null;
}