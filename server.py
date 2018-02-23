from flask import Flask, render_template, session


app = Flask(__name__)


@app.route('/')
def index():
    login = True if ('username' in session) else False
    return render_template('index.html', login=login)


if __name__ == '__main__':
    app.run(debug=True)
