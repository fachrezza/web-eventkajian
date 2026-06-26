import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "../api/axios";

export default function Attendance() {
  const [mode, setMode] = useState("camera"); 
  // camera | scanner

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const lastScanRef = useRef("");
  const inputRef = useRef(null);
  const scannerRef = useRef(null);

  // ================= CAMERA MODE =================
  useEffect(() => {
    if (mode !== "camera") return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(onScanSuccess, onScanError);

    async function onScanSuccess(decodedText) {
      handleScan(decodedText);
    }

    function onScanError() {}

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [mode]);

  // ================= SCANNER MODE (USB) =================
  useEffect(() => {
    if (mode !== "scanner") return;

    inputRef.current?.focus();
  }, [mode]);

  // ================= CORE SCAN HANDLER =================
  const handleScan = async (decodedText) => {
    if (!decodedText) return;

    // anti double scan
    if (lastScanRef.current === decodedText) return;
    lastScanRef.current = decodedText;

    setStatus("loading");
    setMessage("Memproses tiket...");

    try {
      const res = await api.post("/attendance/scan", {
        token: decodedText,
      });

      setStatus("success");
      setMessage(res.data.message || "Check-in berhasil 🎉");

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
        lastScanRef.current = "";
      }, 2000);

    } catch (err) {
      setStatus("error");
      setMessage(err?.response?.data?.message || "Gagal scan");

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
        lastScanRef.current = "";
      }, 2000);
    }
  };

  // ================= USB SCANNER INPUT =================
  const handleInput = (e) => {
    const value = e.target.value;

    // scanner biasanya kirim ENTER
    if (value.includes("\n") || value.length > 5) {
      handleScan(value.trim());
      e.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">

      <h1 className="text-2xl font-bold mb-4">
        Attendance System PRO
      </h1>

      {/* MODE SWITCH */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMode("camera")}
          className={`px-4 py-2 rounded-xl ${
            mode === "camera"
              ? "bg-blue-500 text-white"
              : "bg-white border"
          }`}
        >
          📷 Camera
        </button>

        <button
          onClick={() => setMode("scanner")}
          className={`px-4 py-2 rounded-xl ${
            mode === "scanner"
              ? "bg-green-500 text-white"
              : "bg-white border"
          }`}
        >
          ⌨️ Scanner
        </button>
      </div>

      {/* STATUS */}
      <div
        className={`mb-4 px-4 py-2 rounded-xl text-white font-semibold transition ${
          status === "idle"
            ? "bg-gray-400"
            : status === "loading"
            ? "bg-blue-500"
            : status === "success"
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      >
        {message || "Siap scan QR"}
      </div>

      {/* ================= CAMERA VIEW ================= */}
      {mode === "camera" && (
        <div
          id="reader"
          className="rounded-xl overflow-hidden shadow-lg border"
          style={{ width: 320 }}
        />
      )}

      {/* ================= SCANNER INPUT MODE ================= */}
      {mode === "scanner" && (
        <div className="text-center">
          <input
            ref={inputRef}
            autoFocus
            onChange={handleInput}
            className="opacity-0 absolute"
          />

          <div className="bg-white p-10 rounded-xl shadow border">
            <h2 className="text-lg font-semibold">
              Mode Scanner Aktif
            </h2>
            <p className="text-gray-500 mt-2">
              Colokkan USB scanner dan arahkan ke QR tiket
            </p>
          </div>
        </div>
      )}

    </div>
  );
}