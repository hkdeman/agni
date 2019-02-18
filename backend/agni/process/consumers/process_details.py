
from channels.generic.websocket import WebsocketConsumer
import json
import os
import psutil
import time
import threading
from .enumerations import Type


class ProcessDetailsConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.is_connected = True
        self.recursive_thread = threading.Thread(target=self.recursive_sender)
        # self.recursive_thread.start()
        self.recursive_sender()

    def recursive_sender(self):
        # while(self.is_connected):
        self.send_all_inf()
        time.sleep(0.5)
    
    def disconnect(self, close_code):
        self.is_connected = False

    def send_all_inf(self):
        self.send_all_processes()

    def send_all_processes(self):
        json = []
        pids = psutil.pids()
        for pid in pids:
            process = psutil.Process(pid)
            json.append(dict(pid=pid, name=process.name(), status=process.status()))
        self.send_json(dict(type=Type.PROCESSES.value, data=json))

    def send_json(self, data):
        self.send(text_data=json.dumps(data))
