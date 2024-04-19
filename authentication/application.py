from flask import Flask, render_template, request, jsonify, session, logging, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from flask_limiter import Limiter
import pyotp  # For OTP generation
import qrcode  # For generating QR codes
from io import BytesIO  # For working with byte streams
import base64  # For encoding the QR code image
from flask_talisman import Talisman
from jwt.exceptions import DecodeError, ExpiredSignatureError

application = Flask(__name__, template_folder='C:\\Users\\ACER\\OneDrive\\Documents\\CNS Project\\templates', static_folder='C:\\Users\\ACER\\OneDrive\\Documents\\CNS Project\\static')
application.config['SECRET_KEY'] = 'your_secret_key'

# Dummy database to store user data
users = {
    'user1': {
        'username': 'user1',
        'password_hash': generate_password_hash('password123'),
        '2fa_enabled': False,
        'secret_key': None
    },
    'user2': {
        'username': 'user2',
        'password_hash': generate_password_hash('securepass456'),
        '2fa_enabled': False,
        'secret_key': None
    }
}

# Function to generate JWT token
def generate_token(username):
    expiration_date = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    token = jwt.encode({'username': username, 'exp': expiration_date}, application.config['SECRET_KEY'], algorithm='HS256')
    return token

# Function to generate a random secret key for 2FA
def generate_secret_key():
    return pyotp.random_base32()

# Decorator to require authentication for certain routes
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        # Extract the token from 'Bearer <token>'
        token = token.split(" ")[1]

        try:
            data = jwt.decode(token, application.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = data['username']
        except DecodeError:
            return jsonify({'message': 'Token is invalid'}), 401
        except ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

# Route to render login form
@application.route('/login', methods=['GET'])
def login_page():
    return render_template('login.html')

# Route to render registration form
@application.route('/register', methods=['GET'])
def register_page():
    return render_template('register.html')

# Route to render 2FA setup form
@application.route('/2fa-setup', methods=['GET'])
def two_factor_setup_page():
    if 'username' not in session:
        return redirect(url_for('login_page'))
    return render_template('2fa_setup.html')

# Route to render password reset form
@application.route('/reset-password', methods=['GET'])
def password_reset_page():
    return render_template('password_reset.html')

# Route for user registration
@application.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username in users:
        return jsonify({'message': 'Username already exists'}), 400

    password_hash = generate_password_hash(password)
    users[username] = {'username': username, 'password_hash': password_hash, '2fa_enabled': False, 'secret_key': None}
    return jsonify({'message': 'User registered successfully'}), 201

# Route for user login
@application.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Username or password missing'}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username or password cannot be empty'}), 400

    user = users.get(username)

    if not user:
        return jsonify({'message': 'User does not exist'}), 401

    if check_password_hash(user['password_hash'], password):
        token = generate_token(username)
        session['username'] = username  # Set session
        logging.info('Successful login for user: {}'.format(username))
        return jsonify({'token': token}), 200

    return jsonify({'message': 'Invalid password'}), 401

# Implement logout to clear session
@application.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({'message': 'Logged out successfully'}), 200

# Protected route now can use session
@application.route('/protected', methods=['GET'])
def protected():
    if 'username' not in session:
        return jsonify({'message': 'Unauthorized'}), 401

    current_user = session['username']
    return jsonify({'message': f'Hello, {current_user}! This is a protected route.'}), 200

# Route for password reset
@application.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    username = data.get('username')
    new_password = data.get('new_password')  # Correct key for new password

    if not username or not new_password:  # Check if username or new_password is None
        return jsonify({'message': 'Username or new password missing'}), 400

    user = users.get(username)

    if not user:
        return jsonify({'message': 'User does not exist'}), 404

    users[username]['password_hash'] = generate_password_hash(new_password)
    return jsonify({'message': 'Password reset successful'}), 200

# Route for enabling 2FA
@application.route('/enable-2fa', methods=['POST'])
def enable_two_factor():
    username = session.get('username')
    if not username:
        return jsonify({'message': 'Unauthorized'}), 401

    user = users.get(username)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Generate and save secret key
    secret_key = generate_secret_key()
    users[username]['secret_key'] = secret_key
    users[username]['2fa_enabled'] = True

    # Generate QR code
    qr = pyotp.totp.TOTP(secret_key).provisioning_uri(name=username, issuer_name='Flask 2FA Example')
    qr_code_img = qrcode.make(qr)

    # Convert QR code image to base64
    buffered = BytesIO()
    qr_code_img.save(buffered, format="JPEG")
    qr_code_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

    return jsonify({'qr_code': qr_code_base64}), 200

# Route for verifying 2FA setup
@application.route('/verify-2fa-setup', methods=['POST'])
def verify_two_factor_setup():
    username = session.get('username')
    if not username:
        return jsonify({'message': 'Unauthorized'}), 401

    user = users.get(username)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    otp = request.json.get('otp')
    secret_key = user['secret_key']

    # Verify OTP
    totp = pyotp.TOTP(secret_key)
    if totp.verify(otp):
        return jsonify({'message': '2FA setup successful'}), 200
    else:
        return jsonify({'message': 'Invalid OTP'}), 400

# Route for token refresh
@application.route('/refresh', methods=['POST'])
def refresh_token():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401

    try:
        data = jwt.decode(token, application.config['SECRET_KEY'], algorithms=['HS256'])
        current_user = data['username']
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

    new_token = generate_token(current_user)
    return jsonify({'token': new_token}), 200

# Security headers and HTTPS enforcement
talisman = Talisman(
    application,
    content_security_policy={
        'default-src': '\'self\'',
        'img-src': '*'
    },
    force_https=True
)

if __name__ == '__main__':
    application.run(debug=True)
