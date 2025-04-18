from flask import Flask, request
from priority_system import get_urgency

app = Flask(__name__)

@app.route("/", methods=["POST"])
def index():
    """
    Endpoint to determine the urgency of a task.
    
    Expects a JSON payload with task details.
    Returns the urgency level of the task.
    """
    # Parse the JSON request body to get the task details
    task = request.json
    
    # Determine the urgency of the task using the NLP model
    return {"urgency": get_urgency(task)}

if __name__ == "__main__":
    app.run()