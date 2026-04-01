import { useState, useEffect, useCallback,startTransition } from "react";
import { fetcher } from "./api/fetcher";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProjectList from "./components/ProjectList";
import TaskList from "./components/TaskList";
import FormModal from "./components/FormModal";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState({ pending: [], complete: [] });
  const [modal, setModal] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);

    const loadProjects = useCallback(async () => {
    const data = await fetcher("/projects");
    setProjects(data);
  }, []);

  const loadTasks = useCallback(async (projectId) => {
    setLoadingTasks(true);
    const data = await fetcher(`/projects/${projectId}/tasks`);
    setTasks(data);
    setLoadingTasks(false);
  }, []);

  useEffect(() => {
    startTransition(() => {
      loadProjects();
    });
  }, [loadProjects]);

  useEffect(() => {
    if (selectedProject) {
      startTransition(() => {
        loadTasks(selectedProject.id);
      });
    } else {
      startTransition(() => {
        setTasks({ pending: [], complete: [] });
      });
    }
  }, [selectedProject, loadTasks]);

  const handleToggle = async (taskId) => {
    await fetcher(`/tasks/${taskId}/toggle`, { method: "PATCH" });
    loadTasks(selectedProject.id);
  };

  const handleDeleteTask = async (taskId) => {
    await fetcher(`/tasks/${taskId}`, { method: "DELETE" });
    loadTasks(selectedProject.id);
  };

  const handleDeleteProject = async (projectId) => {
    await fetcher(`/projects/${projectId}`, { method: "DELETE" });
    if (selectedProject?.id === projectId) setSelectedProject(null);
    loadProjects();
  };

  const closeModal = () => setModal(null);

  const onProjectSaved = (saved) => {
    closeModal();
    loadProjects();
    if (saved && selectedProject?.id === saved.id) {
      setSelectedProject((prev) => ({ ...prev, ...saved }));
    }
  };

  const onTaskSaved = () => {
    closeModal();
    loadTasks(selectedProject.id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Header />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <ProjectList
          projects={projects}
          selectedProject={selectedProject}
          onSelect={setSelectedProject}
          onAdd={() => setModal({ type: "add-project" })}
          onEdit={(p) => setModal({ type: "edit-project", project: p })}
          onDelete={handleDeleteProject}
        />

        <TaskList
          project={selectedProject}
          tasks={tasks}
          loadingTasks={loadingTasks}
          onAddTask={() => setModal({ type: "add-task" })}
          onToggle={handleToggle}
          onEdit={(t) => setModal({ type: "edit-task", task: t })}
          onDelete={handleDeleteTask}
        />
      </div>

      <Footer />

      {(modal?.type === "add-project" || modal?.type === "edit-project") && (
        <FormModal
          type="project"
          initial={modal.project}
          onSave={onProjectSaved}
          onClose={closeModal}
        />
      )}
      {(modal?.type === "add-task" || modal?.type === "edit-task") && (
        <FormModal
          type="task"
          projectId={selectedProject?.id}
          initial={modal.task}
          onSave={onTaskSaved}
          onClose={closeModal}
        />
      )}
    </div>
  );
}