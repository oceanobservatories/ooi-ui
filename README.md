ooi-ui
======

OOI UI Source Code

## Setup 
Preliminary requirements in order to run the UI.
### python
1. Create new virtual environment, this assumes you have virtualenvwrapper (I recommend virtualenvburrito): 
         
         mkvirtualenv newname

Activate or switch virtual environment: 

         workon newname(othername) 

2. Pip install requirements in requirements.txt:

         /ooi-ui$ pip install -r requirements.txt

### JavaScript
1. Install NPM [Node Package Manager](http://nodejs.org/)
2. To install the dependent node packages, in the root of the project run
```
npm install -g grunt-cli
npm install -g bower

npm install
```

3. Install bower components:
```
bower install
```

### To build the production assets

```
grunt
```

### To run the project
```
python app.py -s
```

### To run the project using uWSGI
Remember to modify WSGI.py and app.ini to your specific installation environment
```
sudo mkdir /tmp/ooi-ui
sudo chown case:nginx /tmp/ooi-ui
sudo chmod 755 /tmp/ooi-ui
```

Modify the nginx config file using the example nginx.conf
```
sudo service nginx restart
```

Launch as a background process
```
uwsgi --ini app.ini &
```


##### To view in your browser
[Click here](http://localhost:5000/)
 
