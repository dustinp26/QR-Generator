from flask import Flask, render_template, request, send_file
import qrcode
from io import BytesIO
from PIL import Image, ImageDraw

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.form['data']
    version = int(request.form['ver'])
    box_size = int(request.form['box-size'])
    border = int(request.form['border'])
    style = request.form['style']
    embedded_image_path = request.form['embedded_image_path']

    qr = qrcode.QRCode(
        version=version,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=box_size,
        border=border
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

    if embedded_image_path:
        embedded_img = Image.open(embedded_image_path).convert("RGBA")
        img = img.convert("RGBA")
        
        img_width, img_height = img.size
        embedded_img = embedded_img.resize((img_width // 3, img_height // 3))
        
        pos = ((img_width - embedded_img.width) // 2, (img_height - embedded_img.height) // 2)
        img = Image.alpha_composite(img, embedded_img, pos)

    img_io = BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)