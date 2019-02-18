from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import paramiko

@api_view(['POST'])
def check_ssh_connection(request):
    if request.method == 'POST':
        username = request.data['username']
        password = request.data['password']
        host = request.data['host']
        try:
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh.connect(host, username=username, password=password)
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    return Response(status=status.HTTP_400_BAD_REQUEST)