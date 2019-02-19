import subprocess
from channels.generic.websocket import WebsocketConsumer
import json
from .enumerations import Commands, Status
import os

class RemoteAccessConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.setup_initial_context()

    def setup_initial_context(self):
        self.pwd = os.path.expanduser('~')
        self.home = os.path.expanduser('~')

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        data = json.loads(text_data)
        command = data['command']
        if command == Commands.CMD.value and data['cmd'] != '':
            self.verify_command(data['cmd'])

    def verify_command(self, command):
        command = command.split("&&")
        for arg in command:
            cmd = arg.strip().split(" ")
            if("cd" in cmd):
                if(len(cmd)==1):
                    get_path_changing_to = self.home
                else:
                    get_path_changing_to = cmd[1]
                try:
                    if(os.path.isabs(get_path_changing_to)):
                        os.chdir(get_path_changing_to)
                    else:
                        get_path_changing_to = self.pwd+"/"+get_path_changing_to
                        get_path_changing_to.replace("//","/")
                        os.chdir(get_path_changing_to)
                    self.pwd = get_path_changing_to
                except Exception as e:
                    self.send_json(dict(status=403, error=str("-bash: cd: "+get_path_changing_to+": No such file or directory")))
                    break
            else:
                self.run_commands_as_buffer(cmd)

    def run_commands_as_buffer(self, cmd):
        try:
            for status, response in self.run_command(cmd):
                self.send_json(dict(output=response, type=status, status=200))
        except Exception as e:
            self.send_json(dict(status=403, error=str("-bash: cd: "+"".join(cmd)+": No such file or directory")))

    def run_command(self, command):
        # check for stderr, send error otherwise
        os.chdir(self.pwd)
        p = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, stdin=subprocess.DEVNULL, start_new_session=True)
        for line in p.stdout:
            yield Status.SUCCESS.value, line.decode('utf-8')[:-1]

        for error in p.stderr:
            yield Status.ERROR.value, error.decode('utf-8')[:-1]

    def send_json(self, data):
        self.send(text_data=json.dumps(data))
