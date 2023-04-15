function generateQRCode() {
    // Get the user input from the form
    var data = document.getElementById("data").value;
    var version = document.getElementById("version").value;
    var boxSize = document.getElementById("box-size").value;
    var border = document.getElementById("border").value;
    var style = document.getElementById("style").value;
  
    // Generate the QR code image
    var qr = new QRious({
      value: data,
      size: boxSize,
      level: "L",
      background: style == "red-on-white" ? "white" : "white",
      foreground: style == "red-on-white" ? "#C62328" : "black",
      padding: border,
    });
  
  // Display the QR code image on the web page
  var qrCodeDiv = document.getElementById("qr-code");
  qrCodeDiv.innerHTML = "<img src='" + qr.toDataURL() + "'>";

  // Show the download button
  var downloadBtn = document.getElementById("download-btn");
  downloadBtn.style.display = "block";
  }
  function downloadQRCode() {
    // Get the QR code image data URL
    var qrCodeImage = document.getElementById("qr-code").getElementsByTagName("img")[0];
    var qrCodeDataURL = qrCodeImage.src;
  
    // Create a temporary link element to download the image
    var downloadLink = document.createElement("a");
    downloadLink.href = qrCodeDataURL;
    downloadLink.download = "qr_code.png";
  
    // Append the link element to the document body and click it
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  
  
  
  
  
  