import subprocess
from channels.generic.websocket import WebsocketConsumer
import json
from .enumerations import Type, Commands, Status
import os
import paramiko
import threading
import time

def index_containing_substring(the_list, substring):
    for i, s in enumerate(the_list):
        if substring in s:
              return i
    return -1

class SSHNetworkDetailsConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.ssh = None
        self.is_connected = True
        self.recursive_thread = threading.Thread(target=self.recursive_sender)
        # Add operating system related info initially
        
    def recursive_sender(self):
        # while(self.is_connected):
        self.send_all_inf()
        time.sleep(0.5)
    
    def disconnect(self, close_code):
        self.is_connected = False
        if(self.ssh != None):
            self.ssh.close()
    
    def receive(self, text_data):
        data = json.loads(text_data)
        command = data['command']

        if command != Commands.AUTH.value and self.ssh == None:
            return self.send_json(dict(status="invalid credentials"))
        
        if command == Commands.AUTH.value:
            self.setup_ssh_connection()

    def setup_ssh_connection(self):
        ssh = paramiko.SSHClient()
        self.ssh = ssh
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.ssh.connect(os.environ['SSH_HOST'], username=os.environ['SSH_USERNAME'], password=os.environ['SSH_PASSWORD'])
        # self.setup_term_env_variable()
        self.recursive_sender()

    def send_all_inf(self):
        self.send_all_ports()
        self.send_io_counters()

    def send_all_ports(self):
        established = []
        listening = []
        line = 0
        first_line = ""
        for status, output in self.run_command("lsof -i"):
            if (status == Status.SUCCESS.value):
                if(line==0):
                    first_line = list(filter(lambda x: x!="", output.split(" ")))
                    line+=1
                    continue
                if ("ESTABLISHED" in output):
                    established.append(list(filter(lambda x: x!="", output.split(" "))))
                elif ("LISTEN" in output):
                    listening.append(list(filter(lambda x: x!="", output.split(" "))))
        if (len(established)>0 or len(listening)> 0):
            try:
                conns = []
                pid_index = first_line.index("PID")
                name_index = first_line.index("NAME")
                command_index = first_line.index("COMMAND")
                for est in established:
                    pid = est[pid_index]
                    name = est[name_index].split("->")
                    command = est[command_index]
                    l_ip, l_port = name[0].split(":")
                    r_ip, r_port = name[1].split(":")
                    conns.append(dict(pid=pid, name=command, l_ip=l_ip, l_port=l_port, r_ip=r_ip, r_port=r_port, status="ESTABLISHED"))
                for lis in listening:
                    pid = lis[pid_index]
                    name = lis[name_index]
                    command = lis[command_index]
                    l_ip, l_port = name.split(":")
                    conns.append(dict(pid=pid, name=command, l_ip=l_ip, l_port=l_port, r_ip="", r_port="", status="LISTEN"))
                self.send_json(dict(type=Type.PORTS.value, data=conns))
            except:
                pass
    
    def send_io_counters(self):
        lines = []
        for status, output in self.run_command("ifconfig"):
            if (status == Status.SUCCESS.value):
                lines.append(list(filter(lambda x: x!="", output.split(" "))))
        if (len(lines) > 0):
            buffers = []
            last_index = 0
            for index, line in enumerate(lines):
                if(len(line) == 0):
                    buffers.append(lines[last_index:index])
                    last_index = index+1
            data = []
            try:
                for b in buffers:
                    adapter = b[0][0]
                    index_of_rx = index_containing_substring(b, "RX")
                    index_of_tx = index_containing_substring(b, "TX")
                    RX = b[index_of_rx]
                    TX = b[index_of_tx]
                    packets_recv = RX[RX.index("packets")+1]
                    bytes_recv = RX[RX.index("bytes")+1]
                    packets_sent = RX[RX.index("packets")+1]
                    bytes_sent = RX[RX.index("bytes")+1]
                    data.append(dict(
                            adapter=adapter, 
                            bytes_sent=bytes_sent, 
                            bytes_recv=bytes_recv,
                            packets_sent=packets_sent,
                            packets_recv=packets_recv,
                        ))
            except:
                pass
            if (len(data) != 0):
                trimmed_data = sorted(data, key=lambda x: x['bytes_recv'], reverse=True)[:5]
                self.send_json(dict(type=Type.NET_IO_COUNTERS.value, data=data))

    def run_command(self, command):
        ssh_stdin, ssh_stdout, ssh_stderr = self.ssh.exec_command(command)
        for line in ssh_stdout.readlines():
            yield Status.SUCCESS.value, line[:-1]
        for line in ssh_stderr.readlines():
            yield Status.ERROR.value, line[:-1]


    def send_json(self, data):
        self.send(text_data=json.dumps(data))