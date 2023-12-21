function generateQRCode() {
  var data = document.getElementById("data").value;
  var boxSize = parseInt(document.getElementById("box-size").value);
  var border = parseInt(document.getElementById("border").value);
  var style = document.getElementById("style").value;
  var foregroundColor, backgroundColor;

  if (style === "default") {
      foregroundColor = document.getElementById('foreground-color').value || "black";
      backgroundColor = document.getElementById('background-color').value || "white";
  } else if (style === "black-on-white") {
      foregroundColor = "black";
      backgroundColor = "white";
  } else if (style === "red-on-white") {
      foregroundColor = "#C62328";
      backgroundColor = "white";
  }


  // Generate the QR code with custom colors
  var qr = new QRious({
      value: data,
      size: boxSize,
      level: "M",
      background: backgroundColor,
      foreground: foregroundColor,
      padding: 0
  });

  // Create a canvas element
  var canvas = document.createElement('canvas');
  var canvasSize = boxSize + 2 * border;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  var context = canvas.getContext('2d');

  // Fill background
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvasSize, canvasSize);

  // Draw the QR code on the canvas
  var qrImage = new Image();
  qrImage.onload = function() {
      var qrPosition = border;
      context.drawImage(qrImage, qrPosition, qrPosition, boxSize, boxSize);

      // Process the embedded image if one is selected
      var embeddedImageInput = document.getElementById('embedded_image_path');
      if (embeddedImageInput.files && embeddedImageInput.files[0]) {
          processEmbeddedImage(embeddedImageInput, boxSize, qrPosition, context);
      } else {
          // No image selected, just display the QR code
          displayQRCode(canvas);
      }
  };
  qrImage.src = qr.toDataURL();
}

function processEmbeddedImage(embeddedImageInput, boxSize, qrPosition, context) {
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      // Calculate the best fit size while maintaining aspect ratio
      var maxImgSize = boxSize / 3; // Adjust this value as needed
      var imgWidth, imgHeight;
      if (img.width > img.height) {
          imgWidth = maxImgSize;
          imgHeight = img.height * (maxImgSize / img.width);
      } else {
          imgHeight = maxImgSize;
          imgWidth = img.width * (maxImgSize / img.height);
      }
      var imgPositionX = qrPosition + (boxSize - imgWidth) / 2;
      var imgPositionY = qrPosition + (boxSize - imgHeight) / 2;

      // Draw a white border around the image
      var borderSize = 6; // Adjust the size of the border as needed
      context.fillStyle = "white";
      context.fillRect(imgPositionX - borderSize, imgPositionY - borderSize, imgWidth + 2 * borderSize, imgHeight + 2 * borderSize);

      // Draw the image over the QR code
      context.drawImage(img, imgPositionX, imgPositionY, imgWidth, imgHeight);
       // After processing the image, display the QR code
       displayQRCode(context.canvas);

      // Display the combined QR code image on the web page
      var qrCodeDiv = document.getElementById("qr-code");
      qrCodeDiv.innerHTML = "<img src='" + context.canvas.toDataURL() + "'>";

      // Show the download button
      var downloadBtn = document.getElementById("download-btn");
      downloadBtn.style.display = "block";
    };

  img.src = e.target.result;
};
reader.readAsDataURL(embeddedImageInput.files[0]);
}


function displayQRCode(canvas) {
  var qrCodeDiv = document.getElementById("qr-code");
  qrCodeDiv.innerHTML = "<img src='" + canvas.toDataURL() + "'>";
  var downloadBtn = document.getElementById("download-btn");
  downloadBtn.style.display = "block";
}

function updateQRCode() {
  generateQRCode(); // Call the main QR code generation function
}

function downloadQRCode() {
  // Get the QR code image element
  var qrCodeImage = document.getElementById("qr-code").getElementsByTagName("img")[0];

  // Check if the QR code image exists
  if (!qrCodeImage) {
    alert("No QR code generated!");
    return;
  }

  // Get the image data URL
  var imageDataURL = qrCodeImage.src;

  // Create a temporary link element to download the image
  var downloadLink = document.createElement("a");
  downloadLink.href = imageDataURL;
  downloadLink.download = "qr_code.png"; // You can set the filename here

  // Append the link element to the document body and click it
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function resetColors() {
  document.getElementById('foreground-color').value = "#000000";
  document.getElementById('background-color').value = "#ffffff";
  generateQRCode(); // Regenerate QR code with default colors
}

// Update event listeners
document.getElementById('style').addEventListener('change', generateQRCode);
document.getElementById('foreground-color').addEventListener('change', generateQRCode);
document.getElementById('background-color').addEventListener('change', generateQRCode);



