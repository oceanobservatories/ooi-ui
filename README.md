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


##### To view in your browser
[Click here](http://localhost:5000/)
 
