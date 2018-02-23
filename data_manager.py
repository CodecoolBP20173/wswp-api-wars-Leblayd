import database_common


@database_common.connection_handler
def get_login_data(cursor, username):
    cursor.execute("""
                    SELECT * FROM users
                    WHERE username = %(username)s; 
                    """,
                   {"username": username}
                   )
    user = cursor.fetchall()
    return user


@database_common.connection_handler
def register_user(cursor, username, password):
    cursor.execute("""
                    INSERT INTO users(username, password)
                    VALUES (%(username)s, %(password)s);
                    """,
                   {"username": username, "password": password}
                   )
