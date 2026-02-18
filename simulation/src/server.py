from flask import Flask
from flask_socketio import SocketIO, emit

from simulate import SimulationManager, TrajectoryHandler
from entities import Trajectory
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

# 1. Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

sim_manager = SimulationManager(socketio=socketio)
traj_fetcher = TrajectoryHandler(simulation_manager=sim_manager)

# 2. Define the "Connect" Event
# This triggers automatically when a client (browser) opens the connection.
@socketio.on('connect')
def handle_connect():
    print('Client connected to the WebSocket!')
    emit('server_message', {'data': 'Hello from Flask!'})

# 3. Define the "Disconnect" Event
@socketio.on('disconnect')
def handle_disconnect():
    print('❌ Client disconnected.')

# 4. A Custom Event (Receiver)
@socketio.on('trajectory')
def handle_ping(data):
    print(f"Received ping: {data}")
    traj_info = Trajectory.model_validate(data)
    socketio.start_background_task(traj_fetcher.fetch_trajectory, traj_info)
    emit('pong', {'status': 'received'})

if __name__ == '__main__':
    # Note: We use socketio.run, NOT app.run
    print("🚀 Server starting on http://localhost:8000")
    socketio.run(app, host='0.0.0.0', port=8000, debug=True)