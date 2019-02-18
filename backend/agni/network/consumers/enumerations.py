from enum import Enum

class Type(Enum):
    PORTS = "ports"
    NET_IO_COUNTERS = "netIOCounters"


class Status(Enum):
    ERROR = "error"
    SUCCESS = "success"


class Commands(Enum):
    AUTH = 'authentication'