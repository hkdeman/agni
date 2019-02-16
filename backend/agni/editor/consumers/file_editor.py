
from channels.generic.websocket import WebsocketConsumer
import json
import os
import paramiko 
from .enumerations import Commands


class FileEditorConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.send_initial_context()

    def send_initial_context(self):
        self.pwd = os.path.expanduser('~')
        data = self.ls_directory()
        self.send_json(data)

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        data = json.loads(text_data)
        command = data['command']
        if command == Commands.BACK.value:
            self.go_back_if_possible()
        elif command == Commands.OPEN_DIRECTORY.value and data['directory'] != '':
            self.open_directory(data['directory'])
        elif command == Commands.OPEN_FILE.value and data['file'] != '':
            self.open_file(data['file'])

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
        f = open(self.pwd+"/"+file, 'r')
        content = f.read()
        f.close()
        return self.send_json(dict(data=content))

    def ls_directory(self):
        files, directories = self.get_files_and_directory()
        return dict(files=files, directories=directories, pwd=self.pwd)
    
    def get_files_and_directory(self):
        original_directory = dir_path = os.path.dirname(os.path.realpath(__file__))
        
        os.chdir(self.pwd)
        files = list(filter(os.path.isfile, os.listdir()))
        directories = list(filter(os.path.isdir, os.listdir()))
        os.chdir(original_directory)

        return files, directories

    def send_json(self, data):
        self.send(text_data=json.dumps(data))