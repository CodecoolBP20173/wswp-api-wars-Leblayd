import database_common


@database_common.connection_handler
def get_user_password(cursor, username):
    cursor.execute("""
                    SELECT password FROM users
                    WHERE username = %(username)s; 
                    """,
                   {"username": username}
                   )
    user = cursor.fetchone()
    return user


@database_common.connection_handler
def register_user(cursor, username, password):
    cursor.execute("""
                    INSERT INTO users(username, password)
                    VALUES (%(username)s, %(password)s);
                    """,
                   {"username": username, "password": password}
                   )
