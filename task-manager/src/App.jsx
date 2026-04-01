import { useState, useEffect, useCallback } from "react";
import { fetcher } from "./api/fetcher";
import Header from "./Header";
import Footer from "./Footer";
import ProjectList from "./ProjectList";
import TaskList from "./TaskList";
import FormModal from "./FormModal";
import ConfirmModal from "./ConfirmModal";
import "./app.css";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState({ pending: [], complete: [] });
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
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
    loadProjects();
  }, []); 

  useEffect(() => {
    if (selectedProject?.id) {
      loadTasks(selectedProject.id);
    } else {
      setTasks({ pending: [], complete: [] });
    }
  }, [selectedProject]);

  const handleToggle = async (taskId) => {
    await fetcher(`/tasks/${taskId}/toggle`, { method: "PATCH" });
    loadTasks(selectedProject.id);
  };

  const handleDeleteTask = (taskId) => {
    setConfirm({
      message: "This task will be permanently deleted.",
      onConfirm: async () => {
        await fetcher(`/tasks/${taskId}`, { method: "DELETE" });
        setConfirm(null);
        loadTasks(selectedProject.id);
      },
    });
  };

  const handleDeleteProject = (projectId) => {
    setConfirm({
      message: "This project and all its tasks will be permanently deleted.",
      onConfirm: async () => {
        await fetcher(`/projects/${projectId}`, { method: "DELETE" });
        if (selectedProject?.id === projectId) setSelectedProject(null);
        setConfirm(null);
        loadProjects();
      },
    });
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
    <div className="app">
      <Header />
      <div className="app-body">
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
        <FormModal type="project" initial={modal.project} onSave={onProjectSaved} onClose={closeModal} />
      )}
      {(modal?.type === "add-task" || modal?.type === "edit-task") && (
        <FormModal type="task" projectId={selectedProject?.id} initial={modal.task} onSave={onTaskSaved} onClose={closeModal} />
      )}
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
}