import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import QRCode from "react-qr-code";
import './App.css'

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file to Supabase Storage
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
    }
    setLoading(false);
  };

  // Generate public download link
  const generateDownloadUrl = async (path) => {
    const { data } = supabase.storage.from("file-share").getPublicUrl(path);
    setDownloadUrl(data.publicUrl);
  };

  // Delete File Manually
  const handleDelete = async () => {
    if (!filePath) return;

    const { error } = await supabase.storage.from("file-share").remove([filePath]);
    if (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file.");
    } else {
      console.log("File deleted successfully");
      setDownloadUrl("");
      setFilePath("");
      alert("File deleted successfully!");
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">GhostDrop</h1>

        {/* File Upload */}
        <input type="file" onChange={handleFileChange} className="file-input" />
        <button
          onClick={uploadFile}
          className="upload-button"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>

        {/* Download Link */}
        {downloadUrl && (
          <div className="download-section">
            <p className="share-text">Share this link:</p>
            <input
              type="text"
              value={downloadUrl}
              readOnly
              className="download-input"
            />
            
            {/* Download Button */}
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="download-button"
            >
              Download
            </a>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="delete-button"
            >
              Delete File
            </button>

            {/* QR Code */}
            <div className="qr-code">
              <QRCode value={downloadUrl} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
