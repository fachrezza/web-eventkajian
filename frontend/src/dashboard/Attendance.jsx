import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "../api/axios";

export default function Attendance() {

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(success);

    async function success(decodedText) {

      try {

        const response = await api.post(
          "/attendance/scan",
          {
            token: decodedText
          }
        );

        alert(response.data.message);

      } catch (error) {

        alert(
          error.response.data.message
        );
      }

      scanner.clear();
    }

  }, []);

  return (
    <div>

      <h1>QR Attendance Scanner</h1>

      <div id="reader"></div>

    </div>
  );
}