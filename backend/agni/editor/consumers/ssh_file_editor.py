
from channels.generic.websocket import WebsocketConsumer
import json
import os
import paramiko 
from .enumerations import Commands

class SSHFileEditorConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.ssh = None
    
    def disconnect(self, close_code):
        if(self.ssh != None):
            self.ssh.close()

    def receive(self, text_data):
        data = json.loads(text_data)
        command = data['command']

        if command != Commands.AUTH.value and self.ssh == None:
            return self.send_json(dict(status="invalid credentials"))
        
        if command == Commands.AUTH.value:
            self.setup_ssh_connection()
        elif command == Commands.BACK.value:
            self.go_back_if_possible()
        elif command == Commands.OPEN_DIRECTORY.value and data['directory'] != '':
            self.open_directory(data['directory'])
        elif command == Commands.OPEN_FILE.value and data['file'] != '':
            self.open_file(data['file'])

    def setup_ssh_connection(self):
        ssh = paramiko.SSHClient()
        self.ssh = ssh
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.ssh.connect(os.environ['SSH_HOST'], username=os.environ['SSH_USERNAME'], password=os.environ['SSH_PASSWORD'])
        self.setup_pwd()
        data = self.ls_directory()
        self.send_json(data)

    def setup_pwd(self):
        output = self.run_command("pwd")
        self.pwd = output[0][:-1]
        print(self.pwd)
    
    def go_back_if_possible(self):
        if(self.pwd == "/"):
            self.send_json(dict(response="invalid move"))
            return
        
        num_slashes = self.pwd.count('/')
        if (num_slashes > 0):
            self.pwd = "/".join(self.pwd.split("/")[:-1])
            if(len(self.pwd) == 0): self.pwd = "/"
            data = self.ls_directory()
            self.send_json(data)
    
    def open_directory(self, directory):
        self.pwd += "/"+directory
        data = self.ls_directory()
        return self.send_json(data)

    def open_file(self, file):
        output = self.run_command_in_pwd("cat "+file)
        content = "".join(output)
        return self.send_json(dict(data=content))

    def ls_directory(self):
        files = self.get_files_from_ssh()
        directories = self.get_directories_from_ssh()
        return dict(files=files, directories=directories, pwd=self.pwd)
    
    def get_files_from_ssh(self):
        output = self.run_command_in_pwd("find . -maxdepth 1 -type f")
        files = [f[2:-1] for f in output]
        return files

    def get_directories_from_ssh(self):
        output = self.run_command_in_pwd("echo */")
        directories = output[0][:-1].replace("/", "").split(" ")
        return directories

    def send_json(self, data):
        self.send(text_data=json.dumps(data))
    
    def run_command_in_pwd(self, command):
        return self.run_command("cd "+self.pwd+" && "+command)

    def run_command(self, command):
        ssh_stdin, ssh_stdout, ssh_stderr = self.ssh.exec_command(command)
        output = ssh_stdout.readlines()
        return output