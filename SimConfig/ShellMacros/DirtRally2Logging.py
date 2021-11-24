import socket
import threading
import os
from datetime import datetime
from struct import unpack

class DirtRally2LoggingServer():
    header = [
        'total_time',
        'lap_time',
        'lap_distance',
        'total_distance',
        'position_x',
        'position_y',
        'position_z',
        'speed',
        'velocity_x',
        'velocity_y',
        'velocity_z',
        'left_dir_x',
        'left_dir_y',
        'left_dir_z',
        'forward_dir_x',
        'forward_dir_y',
        'forward_dir_z',
        'suspension_position_bl',
        'suspension_position_br',
        'suspension_position_fl',
        'suspension_position_fr',
        'suspension_velocity_bl',
        'suspension_velocity_br',
        'suspension_velocity_fl',
        'suspension_velocity_fr',
        'wheel_patch_speed_bl',
        'wheel_patch_speed_br',
        'wheel_patch_speed_fl',
        'wheel_patch_speed_fr',
        'throttle_input',
        'steering_input',
        'brake_input',
        'clutch_input',
        'gear',
        'gforce_lateral',
        'gforce_longitudinal',
        'lap',
        'engine_rate',
        'native_sli_support',
        'race_position',
        'fuel_in_tank',
        'race_sector',
        'sector_time_1',
        'sector_time_2',
        'brake_temp_bl',
        'brake_temp_br',
        'brake_temp_fl',
        'brake_temp_fr',
        'laps_completed',
        'total_laps',
        'track_length',
        'last_lap_time',
        'max_rpm',
        'idle_rpm',
        'max_gears'
    ]
    def __init__(self):
        self.ip = '127.0.0.1'
        self.shutdown_port = 20779
        self.logging_port = 20778

        self.running = False

        self.shutdown_thread = threading.Thread(target=self.shutdown_loop)
        self.shutdown_thread.daemon = True

    def logging_connect(self):
        self.logging_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.logging_socket.settimeout(2.0)
        self.logging_socket.bind((self.ip, self.logging_port))

    def logging_start(self):
        path = os.path.expanduser('~\Documents')
        log_folder = '\DirtRally2Logs'
        if not os.path.exists(path + log_folder):
            os.makedirs(path + log_folder)

        self.running = True

        self.shutdown_thread.start()

        with open(path + log_folder + '\DirtRally2Logs ' + datetime.now().strftime("%H;%M;%S %m-%d-%y") + '.csv', 'w') as f:
            for c in self.header:
                f.write(c + ',')

            f.write('\n')

            while self.running:
                try:
                    d, a = self.logging_socket.recvfrom(1024)
                    data = unpack('66f', d)
                    for x in data:
                        f.write('{},'.format(x))

                    f.write('\n')
                except socket.timeout:
                    continue

        self.logging_socket.close()

    def logging_stop(self):
        self.running = False

    def shutdown_connect(self):
        self.shutdown_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.shutdown_socket.bind((self.ip, self.shutdown_port))
        self.shutdown_socket.settimeout(10)

    def shutdown_loop(self):
        while True:
            try:
                d, a = self.shutdown_socket.recvfrom(1024)
                if b'shutdown' in d:
                    self.logging_stop()
                    break
            except:
                continue

    def shutdown_send(self):
        shutdown = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        shutdown.sendto(b'shutdown', (self.ip, self.shutdown_port))