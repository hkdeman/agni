import subprocess
from channels.generic.websocket import WebsocketConsumer
import json
from .enumerations import Commands, Status
import os
import paramiko

class SSHRemoteAccessConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.ssh = None
        self.pwd = None

    def disconnect(self, close_code):
        if (self.ssh != None):
            self.ssh.close()

    def receive(self, text_data):
        data = json.loads(text_data)
        command = data['command']

        if command != Commands.AUTH.value and self.ssh == None:
            return self.send_json(dict(status="invalid credentials"))
        
        if command == Commands.AUTH.value:
            self.setup_ssh_connection()
        elif command == Commands.CMD.value and data['cmd'] != '':
            self.verify_command(data['cmd'])

    def setup_ssh_connection(self):
        ssh = paramiko.SSHClient()
        self.ssh = ssh
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.ssh.connect(os.environ['SSH_HOST'], username=os.environ['SSH_USERNAME'], password=os.environ['SSH_PASSWORD'])
        self.setup_pwd()

    def setup_pwd(self):
        data = self.run_command("pwd")
        for status, output in data:
            if status == Status.SUCCESS.value:
                self.pwd = output
                self.home = output

    def verify_command(self, command):
        command = command.split("&&")
        for arg in command:
            if("cd" in arg):
                cmd = arg.strip().split(" ")
                if(len(cmd)==1):
                    get_path_changing_to = self.home
                else:
                    get_path_changing_to = cmd[1]
                self.update_pwd(get_path_changing_to)
            else:
                self.run_commands_as_buffer(arg)

    def update_pwd(self, new_path):
        self.pwd = os.path.join(self.pwd, new_path)
        self.get_current_work_directory()

    def get_current_work_directory(self):
        data = self.run_command_in_pwd("pwd")
        for status, output in data:
            if status == Status.SUCCESS.value:
                self.pwd = output
            elif status == Status.ERROR.value:
                self.send_json(dict(output=output, status=status))

    def run_commands_as_buffer(self, cmd):
        for status, response in self.run_command_in_pwd(cmd):
            self.send_json(dict(output=response, status=status))

    def run_command_in_pwd(self, command):
        for response in self.run_command("cd "+self.pwd+" && "+command):
            yield response

    def run_command(self, command):
        ssh_stdin, ssh_stdout, ssh_stderr = self.ssh.exec_command(command)
        for line in ssh_stdout.readlines():
            yield Status.SUCCESS.value, line[:-1]
        for line in ssh_stderr.readlines():
            yield Status.ERROR.value, line[:-1]

    def send_json(self, data):
        self.send(text_data=json.dumps(data))