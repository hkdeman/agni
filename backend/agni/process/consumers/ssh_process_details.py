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

class SSHProcessDetailsConsumer(WebsocketConsumer):
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
        self.send_all_processes()

    def send_all_processes(self):
        lines = []
        i=0
        first_line = ""
        for status, output in self.run_command("ps -aux"):
            if (status == Status.SUCCESS.value):
                if (i==0):
                    first_line = list(filter(lambda x: x!="", output.split(" ")))
                    i+=1
                    continue
                lines.append(list(filter(lambda x: x!="", output.split(" "))))
        if (len(lines)>0):
            try:
                procs = []
                print(first_line)
                pid_index = index_containing_substring(first_line, "PID")
                user_index = index_containing_substring(first_line, "USER")
                command_index = index_containing_substring(first_line, "COMMAND")
                mem_index = index_containing_substring(first_line, "MEM")
                cpu_index = index_containing_substring(first_line, "CPU")

                for line in lines:
                    pid = line[pid_index]
                    user = line[user_index]
                    command = line[command_index]
                    mem = line[mem_index]
                    cpu = line[cpu_index]
                    procs.append(dict(pid=pid, name=command, user=user, mem=mem, cpu=cpu))
                self.send_json(dict(type=Type.PROCESSES.value, data=procs))
            except:
                pass

    def run_command(self, command):
        ssh_stdin, ssh_stdout, ssh_stderr = self.ssh.exec_command(command)
        for line in ssh_stdout.readlines():
            yield Status.SUCCESS.value, line[:-1]
        for line in ssh_stderr.readlines():
            yield Status.ERROR.value, line[:-1]

    def send_json(self, data):
        self.send(text_data=json.dumps(data))