from app import app
from models import db, Project, Task, TaskStatus

with app.app_context():
    db.drop_all()
    db.create_all()

    project1 = Project(title="Website Redesign", description="Overhaul the company website")
    project2 = Project(title="Mobile App", description="Build a companion mobile app")

    db.session.add_all([project1, project2])
    db.session.commit()

    # Print what actually got saved
    print(f"Project 1: id={project1.id}, title={project1.title!r}, description={project1.description!r}")
    print(f"Project 2: id={project2.id}, title={project2.title!r}, description={project2.description!r}")

    tasks = [
        Task(project_id=project1.id, title="Design mockups", description="Create wireframes and visual mockups", status=TaskStatus.COMPLETE),
        Task(project_id=project1.id, title="Set up Flask backend", description="Initialize the Flask app and configure SQLAlchemy", status=TaskStatus.PENDING),
        Task(project_id=project1.id, title="Write API docs", description="Document all endpoints with request and response examples", status=TaskStatus.PENDING),
        Task(project_id=project2.id, title="Define data models", description="Design the schema for the mobile app database", status=TaskStatus.COMPLETE),
        Task(project_id=project2.id, title="Build auth flow", description="Implement login, logout, and token refresh", status=TaskStatus.PENDING),
    ]

    db.session.add_all(tasks)
    db.session.commit()

    print("\nTasks seeded:")
    for t in tasks:
        print(f"  Task: {t.title!r}, description={t.description!r}, status={t.status}")

    print("\nDatabase seeded successfully.")