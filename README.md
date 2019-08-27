# Agni

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
