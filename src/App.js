import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

function App() {
  const [imageData, setImageData] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => console.error("Error accessing the camera:", error));
  }, []);

  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 320, 240);
    const dataUrl = canvasRef.current.toDataURL("image/jpeg");
    setImageData(dataUrl);

    fetch("https://your-api-url/upload-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: dataUrl }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Response:", data))
      .catch((error) => console.error("Error sending image:", error));
  };

  return (
    <div>
      <h1>Take a Photo</h1>
      <video ref={videoRef} width="320" height="240" autoPlay></video>
      <button onClick={capturePhoto}>Capture Photo</button>
      <canvas
        ref={canvasRef}
        width="320"
        height="240"
        style={{ display: "none" }}
      ></canvas>
      {imageData && <img src={imageData} alt="Captured" />}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

export default App;
