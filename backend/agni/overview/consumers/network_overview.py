
from channels.generic.websocket import WebsocketConsumer
import json
import os
import psutil
import time
import threading
from .enumerations import Type


class NetworkOverviewConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.is_connected = True
        self.recursive_thread = threading.Thread(target=self.recursive_sender)
        # self.recursive_thread.start()

    def recursive_sender(self):
        while(self.is_connected):
            self.send_all_inf()
            time.sleep(0.5)
    
    def disconnect(self, close_code):
        self.is_connected = False

    def send_all_inf(self):
        self.send_disk_usage()
        self.send_cpu_usage()
        self.send_ram_usage()
        self.send_active_ram_usage()
    
    def send_disk_usage(self):
        disk_partitions = psutil.disk_partitions()
        disk_usages = []
        for disk_partition in disk_partitions:
            partition = disk_partition.mountpoint
            disk_usage = psutil.disk_usage(partition)
            disk_usages.append(dict(partition=partition, free=disk_usage.free, used=disk_usage.used))
        self.send_json(dict(type=Type.DISK_USAGE.value, data=disk_usages))
    
    def send_cpu_usage(self):
        self.send_json(dict(type=Type.CPU_USAGE.value, data=psutil.cpu_percent()))
    
    def send_ram_usage(self):
        memory = psutil.virtual_memory()
        data = dict(used=memory.used, available=memory.available)
        self.send_json(dict(type=Type.RAM_USAGE.value, data=data))
    
    def send_active_ram_usage(self):
        self.send_json(dict(type=Type.ACTIVE_RAM_USAGE.value, data=psutil.virtual_memory().percent))        

    def send_json(self, data):
        self.send(text_data=json.dumps(data))
