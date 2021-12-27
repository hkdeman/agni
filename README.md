# Agni 

A dashboard service that let's you see the overview of your laptop like ram usage, cpu usage (real time). It also allows you to see network packets exchange, process running (potentially kill them), give remote access, and editor accesss.

If you want it for another server then it has remote access that let's you connect to a remote server (like university) and perform the same above things.

Backend uses redis-server (python websockets)
To install redis and run it in the background
```
brew install redis
redis-server &
```

To install the backend
```
cd backend
pip3 install virtualenv
virtual env
source env/bin/activate
pip3 install -r requirements.txt
cd agni
python3 manage.py runserver
```

To run the frontend
```
cd frontend/durga/
npm i
npm run start
```
