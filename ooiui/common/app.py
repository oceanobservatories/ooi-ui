from flask import Flask, render_template

app = Flask(__name__)

@app.route('/index')
def root(name=None):
    if name:
        return render_template(name, title = "")
    else:
        return render_template("index.html", title = 'Main')

if __name__ == '__main__':
    app.run(host='localhost',debug=True)