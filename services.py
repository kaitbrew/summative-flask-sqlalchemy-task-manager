from models import db, Project, Task, TaskStatus
from sqlalchemy.exc import SQLAlchemyError

def get_all_projects():
    return Project.query.all()

def get_project_by_id(project_id):
    return db.get_or_404(Project, project_id)

def create_project(title, description=None):
    try:
        project = Project(title=title, description=description)
        db.session.add(project)
        db.session.commit()
        return project
    except SQLAlchemyError as e:
        db.session.rollback()
        raise ValueError(f"Database error: {str(e)}")

def update_project(project_id, title=None, description=None):
    project = db.get_or_404(Project, project_id)
    if title is not None:
        project.title = title
    if description is not None:
        project.description = description
    db.session.commit()
    return project

def delete_project(project_id):
    try:
        project = db.get_or_404(Project, project_id)
        db.session.delete(project)
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        raise ValueError(f"Database error: {str(e)}")

def get_tasks_by_status(project_id):
    project = db.get_or_404(Project, project_id)
    pending = [t for t in project.tasks if t.status == TaskStatus.PENDING]
    complete = [t for t in project.tasks if t.status == TaskStatus.COMPLETE]
    return pending, complete

def create_task(project_id, title, description=None):
    try:
        db.get_or_404(Project, project_id)
        task = Task(project_id=project_id, title=title, description=description)
        db.session.add(task)
        db.session.commit()
        return task
    except SQLAlchemyError as e:
        db.session.rollback()
        raise ValueError(f"Database error: {str(e)}")

def update_task(task_id, title=None, description=None):
    task = db.get_or_404(Task, task_id)
    if title is not None:
        task.title = title
    if description is not None:
        task.description = description
    db.session.commit()
    return task

def toggle_task_status(task_id):
    task = db.get_or_404(Task, task_id)
    task.status = TaskStatus.COMPLETE if task.status == TaskStatus.PENDING else TaskStatus.PENDING
    db.session.commit()
    return task

def delete_task(task_id):
    try:
        task = db.get_or_404(Task, task_id)
        db.session.delete(task)
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        raise ValueError(f"Database error: {str(e)}")