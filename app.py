from flask import Flask, jsonify, request
from models import db
from flask_cors import CORS  
import services

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///projects.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
CORS(app)

with app.app_context():
    db.create_all()

@app.route("/projects", methods=["GET"])
def get_projects():
    projects = services.get_all_projects()
    return jsonify([{"id": p.id, "title": p.title, "description": p.description} for p in projects])

@app.route("/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    p = services.get_project_by_id(project_id)
    return jsonify({"id": p.id, "title": p.title, "description": p.description})

@app.route("/projects", methods=["POST"])
def create_project():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400
    if not data.get("title"):
        return jsonify({"error": "title is required"}), 400

    try:
        p = services.create_project(data["title"], data.get("description"))
        return jsonify({"id": p.id, "title": p.title}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@app.route("/projects/<int:project_id>", methods=["PATCH"])
def update_project(project_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        p = services.update_project(project_id, data.get("title"), data.get("description"))
        return jsonify({"id": p.id, "title": p.title})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@app.route("/projects/<int:project_id>", methods=["DELETE"])
def delete_project(project_id):
    services.delete_project(project_id)
    return "", 204

@app.route("/projects/<int:project_id>/tasks", methods=["GET"])
def get_tasks(project_id):
    pending, complete = services.get_tasks_by_status(project_id)
    return jsonify({
        "pending": [{"id": t.id, "title": t.title, "description": t.description} for t in pending],
        "complete": [{"id": t.id, "title": t.title, "description": t.description} for t in complete]
    })

@app.route("/projects/<int:project_id>/tasks", methods=["POST"])
def create_task(project_id):
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400
    if not data.get("title"):
        return jsonify({"error": "title is required"}), 400

    try:
        t = services.create_task(project_id, data["title"], data.get("description"))
        return jsonify({"id": t.id, "title": t.title, "status": t.status.value}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    


@app.route("/tasks/<int:task_id>", methods=["PATCH"])
def update_task(task_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        t = services.update_task(task_id, data.get("title"), data.get("description"))
        return jsonify({"id": t.id, "title": t.title})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@app.route("/tasks/<int:task_id>/toggle", methods=["PATCH"])
def toggle_task(task_id):
    t = services.toggle_task_status(task_id)
    return jsonify({"id": t.id, "status": t.status.value})

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    services.delete_task(task_id)
    return "", 204

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(400)
def bad_request(e):
    return jsonify({"error": "Bad request"}), 400

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "An unexpected error occurred"}), 500

@app.errorhandler(415)
def unsupported_media_type(e):
    return jsonify({"error": "Content-Type must be application/json"}), 415

if __name__ == "__main__":
    app.run(debug=True)