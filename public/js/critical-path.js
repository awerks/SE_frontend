document.addEventListener("DOMContentLoaded", () => {
  const projectId = localStorage.getItem("selectedProjectId");
  if (!projectId) {
    document.getElementById("criticalSummary").innerHTML = "<p>No project selected.</p>";
    return;
  }

  fetch(`/api/projects/${projectId}/critical_path`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch critical path");
      return res.json();
    })
    .then((data) => {
      const { totalDuration, totalCost, tasks, criticalPath } = data;

      // Show summary
      document.getElementById("criticalSummary").innerHTML = `
        <p><strong>Total Duration:</strong> ${totalDuration} days</p>
        <p><strong>Total Cost:</strong> $${totalCost}</p>
        <p><strong>Critical Path Task IDs:</strong> ${criticalPath.join(" → ")}</p>
      `;

      // Show task cards
      const container = document.getElementById("criticalTasks");
      tasks.forEach((task) => {
        const card = document.createElement("div");
        card.classList.add("critical_task_card");
        card.innerHTML = `
          <strong>Task ID: ${task.taskId}</strong>
          <span>Duration: ${task.duration} days</span>
          <span>Cost: $${task.cost}</span>
          <span>Start: ${new Date(task.earliestStart).toLocaleDateString()}</span>
          <span>Finish: ${new Date(task.latestFinish).toLocaleDateString()}</span>
          <span>Slack: ${task.slack}</span>
        `;
        container.appendChild(card);
      });
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("criticalSummary").innerHTML =
        "<p style='color: red;'>Error loading critical path.</p>";
    });
});