from flask import Flask, render_template, session, jsonify, request, url_for, redirect
import data_manager
import werkzeug


app = Flask(__name__)


@app.route('/')
def index():
    print(session)
    login = session.get('username')
    return render_template('index.html', login=login)


@app.route('/register')
def register():
    username = request.args['username']
    password = werkzeug.security.generate_password_hash(request.args['password'], method='pbkdf2:sha256', salt_length=8)
    data_manager.register_user(username, password)
    session['username'] = username
    return redirect(url_for('index'))


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    app.run(debug=True)
