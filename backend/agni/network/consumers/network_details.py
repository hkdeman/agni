
from channels.generic.websocket import WebsocketConsumer
import json
import os
import psutil
import time
import threading
from .enumerations import Type


class NetworkDetailsConsumer(WebsocketConsumer):
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
        self.send_all_ports()
        self.send_io_counters()

    def send_all_ports(self):
        json = []
        pids = psutil.pids()
        for pid in pids:
            try:
                process = psutil.Process(pid)
                conns = []
                for conn in process.connections():
                    try:
                        l_ip = conn.laddr.ip
                    except:
                        l_ip = None
                    try:
                        l_port = conn.laddr.port
                    except:
                        l_port = None
                    try:
                        r_ip = conn.raddr.ip
                    except:
                        r_ip = None
                    try:
                        r_port = conn.raddr.port
                    except:
                        r_port = None
                
                    conns.append(dict(pid=pid, name=process.name(), l_ip=l_ip, l_port=l_port, r_ip=r_ip, r_port=r_port, status=conn.status))
            except:
                pass
            json.extend(conns)
        self.send_json(dict(type=Type.PORTS.value, data=json))
    
    def send_io_counters(self):
        net_io_counters = [(key, value) for key, value in psutil.net_io_counters(pernic=True).items()]
        net_io_counters = sorted(net_io_counters, key=lambda item: item[1].bytes_sent, reverse=True)[:3]
        json = []
        for net_io_counter in net_io_counters:
            adapter = net_io_counter[0]
            data = net_io_counter[1]
            json.append(dict(
                            adapter=adapter, 
                            bytes_sent=data.bytes_sent, 
                            bytes_recv=data.bytes_recv,
                            packets_sent=data.packets_sent,
                            packets_recv=data.packets_recv,
                        ))
        self.send_json(dict(type=Type.NET_IO_COUNTERS.value, data=json))
    
    def send_json(self, data):
        self.send(text_data=json.dumps(data))
