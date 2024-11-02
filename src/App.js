import React, { useState, useRef, useEffect } from "react";

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

    fetch(
      "https://ai-innovation-challenge-8fc8a252d8c5.herokuapp.com/store-face",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: "12345678",
          face_encoding: dataUrl,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => console.log("Response:", data)) //can modify image data here
      .catch((error) => console.error("Error sending image:", error));
  };

  return (
    <div>
      <h1>BMCC Student Access Point</h1>
      <video ref={videoRef} width="320" height="240" autoPlay></video>
      <button onClick={capturePhoto}>Capture Photo</button>
      <h6>noob cyborg</h6>
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

export default App;
