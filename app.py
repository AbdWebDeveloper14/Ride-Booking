from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = "secret123"

# Dummy driver credentials
USER_CREDENTIALS = {"driver": "123"}

@app.route('/driver/login', methods=['GET', 'POST'])
def driver_login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in USER_CREDENTIALS and USER_CREDENTIALS[username] == password:
            return redirect(url_for('driver_dashboard'))
        else:
            flash("Invalid username or password", "error")
            return redirect(url_for('driver_login'))
    return render_template('login.html')

@app.route('/driver/dashboard')
def driver_dashboard():
    return render_template('dashboard.html')

if __name__ == "__main__":
    app.run(debug=True)
