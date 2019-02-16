from enum import Enum

class Commands(Enum):
    LS = 'ls'
    BACK = 'back'
    OPEN_DIRECTORY = 'open-directory'
    OPEN_FILE = 'open-file'
    AUTH = 'authentication'
    CMD = 'run-cmd'

class Status(Enum):
    ERROR = "error"
    SUCCESS = "success"