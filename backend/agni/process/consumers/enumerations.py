from enum import Enum

class Type(Enum):
    PROCESSES = "processes"


class Status(Enum):
    ERROR = "error"
    SUCCESS = "success"


class Commands(Enum):
    AUTH = 'authentication'