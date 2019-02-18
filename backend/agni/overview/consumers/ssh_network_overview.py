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
class SSHNetworkOverviewConsumer(WebsocketConsumer):
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
        # self.recursive_thread.start()
        self.recursive_sender()


    def send_all_inf(self):
        self.send_disk_usage()
        self.send_cpu_usage()
        self.send_ram_usage()
        self.send_active_ram_usage()
    
    def send_disk_usage(self):
        index = -1
        skipped = False
        lines = []
        for status, output in self.run_command("df"):
            if(status == Status.SUCCESS.value):
                line = list(filter(lambda x: x!= "", output.split(" ")))
                lines.append(line)
        
        index_of_percent_used = index_containing_substring(lines[1], "%")
        if(index_of_percent_used != -1):
            lines = list(sorted(lines[1:], key=lambda x: x[index_of_percent_used], reverse=True))[:10]
            data = []
            for line in lines:
                mount = line[-1]
                used = line[2]
                free = line[3]
                data.append(dict(partition=mount, used=used, free=free))
            self.send_json(dict(type=Type.DISK_USAGE.value, data=data))
    
    def send_cpu_usage(self):
        cpu_usage = None
        for status, output in self.run_command("grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}'"):
            if (status == Status.SUCCESS.value):
                cpu_usage = output

        if (cpu_usage != None):
            self.send_json(dict(type=Type.CPU_USAGE.value, data=cpu_usage))
    
    def send_ram_usage(self):
        lines = []
        for status, output in self.run_command("free -m"):
            if (status == Status.SUCCESS.value):
                lines.append(list(filter(lambda x: x!="", output.split(" "))))
        
        if (len(lines)!=0):
            used = lines[1][1]
            free = lines[1][2]
            data = dict(used=used, available=free)
            self.send_json(dict(type=Type.RAM_USAGE.value, data=data))
    
    def send_active_ram_usage(self):
        active_ram_usage = None
        for status, output in self.run_command("free | grep Mem | awk '{print $3/$2 * 100.0}'"):
            if (status == Status.SUCCESS.value):
                active_ram_usage = output
        if (active_ram_usage != None):
            self.send_json(dict(type=Type.ACTIVE_RAM_USAGE.value, data=active_ram_usage))

    def run_command(self, command):
        ssh_stdin, ssh_stdout, ssh_stderr = self.ssh.exec_command(command)
        for line in ssh_stdout.readlines():
            yield Status.SUCCESS.value, line[:-1]
        for line in ssh_stderr.readlines():
            yield Status.ERROR.value, line[:-1]

    def send_json(self, data):
        self.send(text_data=json.dumps(data))