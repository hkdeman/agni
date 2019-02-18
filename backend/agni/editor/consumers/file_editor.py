
from channels.generic.websocket import WebsocketConsumer
import json
import os
import paramiko 
from .enumerations import Commands
from rest_framework import status

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
            self.send_json(dict(status=status.HTTP_403_FORBIDDEN))
            return
        
        if(self.change_pwd_to_parent_directory()):
            data = self.ls_directory()
            self.send_json(data)
    
    def change_pwd_to_parent_directory(self):
        num_slashes = self.pwd.count('/')
        if (num_slashes > 0):
            self.pwd = "/".join(self.pwd.split("/")[:-1])
            if(len(self.pwd) == 0): self.pwd = "/"
            return True
        else:
            return False
    
    def open_directory(self, directory):
        if(self.pwd[-1] != "/"):
            self.pwd += "/"
        self.pwd += directory
        data = self.ls_directory()
        return self.send_json(data)

    def open_file(self, file):
        try:
            f = open(self.pwd+"/"+file, 'r')
            content = f.read()
            f.close()
            return self.send_json(dict(status=status.HTTP_200_OK, data=content, type="open-file", name=file))
        except:
            return self.send_json(dict(status=status.HTTP_403_FORBIDDEN))

    def ls_directory(self):
        try:
            files = self.get_files_and_directory()
            return dict(files=files, pwd=self.pwd, status=status.HTTP_200_OK, type="open-directory")
        except:
            return self.send_json(dict(status=status.HTTP_403_FORBIDDEN))       
    
    def get_files_and_directory(self):
        original_directory = os.path.dirname(os.path.realpath(__file__))
        try:
            os.chdir(self.pwd)
            files = []
            for f in os.listdir():
                if (os.path.isfile(os.path.join(self.pwd, f))):
                    files.append(dict(name=f, type="f"))
                elif (os.path.isdir(os.path.join(self.pwd, f))):
                    files.append(dict(name=f, type="d"))
            return files            
        except Exception as e:
            print(e)
            self.change_pwd_to_parent_directory()
            os.chdir(original_directory)
            raise e
    
    def send_json(self, data):
        self.send(text_data=json.dumps(data))