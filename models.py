from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy import Enum as SAEnum
import enum

db = SQLAlchemy()


class TaskStatus(enum.Enum):
    PENDING = "pending"
    COMPLETE = "complete"


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    tasks = db.relationship("Task", back_populates="project", cascade="all, delete-orphan")

    @validates("title")
    def validate_title(self, key, value):
        if not value or not value.strip():
            raise ValueError("Project title cannot be empty.")
        return value.strip()

    def __repr__(self):
        return f"<Project(id={self.id}, title={self.title!r})>"


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True, index=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(SAEnum(TaskStatus), default=TaskStatus.PENDING, nullable=False, index=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    project = db.relationship("Project", back_populates="tasks")

    @validates("title")
    def validate_title(self, key, value):
        if not value or not value.strip():
            raise ValueError("Task title cannot be empty.")
        return value.strip()

    def __repr__(self):
        return f"<Task(id={self.id}, title={self.title!r}, status={self.status})>"