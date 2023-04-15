from flask import Flask, render_template, request
import qrcode
from io import BytesIO

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.form['data']
    version = int(request.form['version'])
    box_size = int(request.form['box-size'])
    border = int(request.form['border'])
    style = request.form['style']

    qr = qrcode.QRCode(
        version=version,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=box_size,
        border=border,
    )

    qr.add_data(data)
    qr.make(fit=True)

    if style == 'black-on-white':
        img = qr.make_image(fill_color='black', back_color='white')
    elif style == 'white-on-black':
        img = qr.make_image(fill_color='white', back_color='black')
    elif style == 'red-on-white':
        img = qr.make_image(fill_color='#C62328', back_color='white')
    else:
        img = qr.make_image(fill_color='#C62328', back_color='white')

    img_io = BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)