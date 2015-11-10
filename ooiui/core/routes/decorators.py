from functools import wraps
from flask import request
def login_required():
       def decorator(f):
           @wraps(f)
           def decorated_function(*args, **kwargs):
               if get_login() == None:
                   return "401 Error: User not logged in."
               return f(*args, **kwargs)
           return decorated_function
       return decorator

def get_login():
    token = request.cookies.get('ooiusertoken')
    if not token:
        return None
        token = urllib.unquote(token).decode('utf8')
    return token


