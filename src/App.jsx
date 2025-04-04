import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import QRCode from "react-qr-code";
import './App.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const uploadFile = async () => {
    if (!file) return alert("Please select a file!");
    setLoading(true);
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

    const { data, error } = await supabase.storage
      .from("file-share")
      .upload(`uploads/${sanitizedFileName}`, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });

    if (error) {
      console.error("Upload error:", error);
      alert("Upload failed! Check console for details.");
    } else {
      setFilePath(data.path);
      generateDownloadUrl(data.path);
      setUploaded(true);
    }
    setLoading(false);
  };

  const generateDownloadUrl = async (path) => {
    const { data } = supabase.storage.from("file-share").getPublicUrl(path);
    setDownloadUrl(data.publicUrl);
  };

  const handleDelete = async () => {
    if (!filePath) return;

    const { error } = await supabase.storage.from("file-share").remove([filePath]);
    if (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file.");
    } else {
      setDownloadUrl("");
      setFilePath("");
      setUploaded(false);
      alert("File deleted successfully!");
    }
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container">
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(prev => !prev)}
      >
        Switch to {darkMode ? "Light ☀️" : "Dark 🌒"} Mode
      </button>

      <div className="title-container">
        <h1 className="title">GhostDrop</h1>
        <h3>Drop Your Files - (it's safe 🤫)</h3>
      </div>

      {!uploaded && (
        <div className="file-upload-container">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="file-input-label">
            {file ? file.name : "Drag & drop your files here or click to upload"}
          </label>
          <button
            onClick={uploadFile}
            className="upload-button"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      )}

      {uploaded && downloadUrl && (
        <div className="download-section">
          <p className="share-text">Share this link:</p>
          <input
            type="text"
            value={downloadUrl}
            readOnly
            className="download-input"
          />
          <div className="button-group">
            <button
              onClick={() => handleDownload(downloadUrl)}
              className="download-button"
            >
              Download
            </button>
            <button
              onClick={handleDelete}
              className="delete-button"
            >
              Delete File
            </button>
          </div>
          <div className="qr-code">
            <QRCode value={downloadUrl} />
          </div>
        </div>
      )}
    </div>
  );
}
