import os
from entities import Trajectory, ExecutionConfig
from pyfmi import load_fmu
import csv

class SimulationManager:
    def __init__(self, socketio):
        self.socketio = socketio
        self.active_simulations = []
    
    def simulate(self, execution: Trajectory):
        file_path = os.path.dirname(os.path.abspath(__file__))
        fmu_path = os.path.join(file_path, "resources", "FMU", f"{execution.fmu_id}.fmu")
        print(f"FMU Path: {fmu_path}")

        model = load_fmu(fmu_path)

        start_time = execution.config.start_time
        final_time = execution.config.final_time
        step_size = execution.config.step_size
        current_time = start_time

        # Initialize the Model (Moves FMU to 'Step Mode')
        model.setup_experiment(start_time=start_time)
        model.initialize()
        print("successfully initialized model")


        # history = []
        batch_size = 50
        num_rows = 1
        batch = []
        while current_time <= final_time:
            try:
                things = model.get(execution.variables)
                # Flatten the results: [time, var1, var2...]
                current_row = [current_time] + [float(t[0]) for t in things]
                batch.append(current_row)
                
                if len(batch) >= batch_size:
                    # Emit to UI
                    self.socketio.emit('trajectory', batch)
                    self.socketio.sleep(0.01)
                    print(f"Sent {num_rows} rows to client")
                    batch = []

                # Store for saving later
                # history.append(current_row)

                num_rows += 1
                
            except Exception as e:
                print(f"Error at {current_time}: {e}")
                break

            model.do_step(current_time, step_size, True)
            current_time += step_size
        if batch:
            self.socketio.emit('trajectory', batch)

        self.socketio.emit('simulation_finished', "Simulation Complete")
        print(f"Simulation complete: Sent {num_rows} rows to client")
        
        # 2. Save to file after the loop finishes
        # output_filename = os.path.join("src", "resources", "results", f"{execution.fmu_id}_result_{execution.result_id}.csv")
        # with open(output_filename, mode='w', newline='') as f:
        #     writer = csv.writer(f)
        #     writer.writerow(['time'] + execution.variables)
        #     writer.writerows(history)
        
        # print(f"Simulation saved to {output_filename}")

class ResultHandler:
    def fetch_result():
        pass

class TrajectoryHandler:
    def __init__(self, simulation_manager):
        self.simulation_manager = simulation_manager

    def fetch_trajectory(self, traj_info):
        self.simulation_manager.simulate(traj_info)
        return
