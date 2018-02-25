from flask import Flask, render_template, session, jsonify, request, url_for, redirect
import data_manager
import werkzeug
from psycopg2 import IntegrityError

app = Flask(__name__)


@app.route('/')
def index():
    logged_in = session.get('username')
    return render_template('index.html', login=logged_in)


@app.route('/login')
def login():
    username = request.args['username']
    password_in_db = data_manager.get_user_password(username)['password']
    if werkzeug.security.check_password_hash(password_in_db, request.args['password']):
        session['username'] = username
    return redirect(url_for('index'))


@app.route('/register', methods=['POST'])
def register():
    username = request.args['username']
    password = werkzeug.security.generate_password_hash(request.args['password'], method='pbkdf2:sha256', salt_length=8)
    try:
        data_manager.register_user(username, password)
        session['username'] = username
        return ''
    except IntegrityError:
        # Definitely needs some error handling.
        pass



@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    app.run(debug=True)
