from enum import Enum

class Type(Enum):
    DISK_USAGE = "diskUsage"
    CPU_USAGE = "cpuUsage"
    RAM_USAGE = "ramUsage"
    ACTIVE_RAM_USAGE = "activeRamUsage"


class Status(Enum):
    ERROR = "error"
    SUCCESS = "success"


class Commands(Enum):
    AUTH = 'authentication'