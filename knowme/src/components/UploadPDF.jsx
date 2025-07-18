import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, Check, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Link } from "react-router-dom";

export default function UploadPDF() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [uploadedPdfName, setUploadedPdfName] = useState(null);


  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file) => {
    if (file.type !== "application/pdf") {
      return "Please upload only PDF files";
    }
    if (file.size > 50 * 1024 * 1024) {
      // 50MB limit
      return "File size must be less than 50MB";
    }
    return null;
  };

  const simulateUpload = (fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: "success", progress: 100 } : f
          )
        );
      } else {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f
          )
        );
      }
    }, 200);
  };

  const handleFiles = async (files) => {
  if (!files || files.length === 0) return;

  const file = files[0]; // ⬅️ only take the first file
  const error = validateFile(file);
  const fileId =
    Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Always reset the uploaded file list
  if (error) {
    setUploadedFiles([
      {
        file,
        id: fileId,
        status: "error",
        progress: 0,
        error,
      },
    ]);
    return;
  }

  setUploadedFiles([
    {
      file,
      id: fileId,
      status: "uploading",
      progress: 0,
    },
  ]);
  simulateUpload(fileId);

  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    setUploadedPdfName(data.uploadedFilename.split('.pdf')[0]);
    console.log("Server Response:", data);
  } catch (err) {
    console.error("Upload failed:", err);
  }
};


  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleFileInput = (e) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const successfulUploads = uploadedFiles.filter((f) => f.status === "success");

  return (
    <div className="min-h-screen">
      {/* Header */}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-600 hover:border-gray-500 hover:bg-gray-800/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">
                {dragActive
                  ? "Drop your PDF files here"
                  : "Upload PDF Documents"}
              </h3>
              <p className="text-gray-400 mb-4">
                Drag and drop your PDF files here, or click to browse
              </p>
            </div>

            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#6366f1] hover:bg-[#5855eb] text-white px-6 py-2"
            >
              Choose Files
            </Button>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">
              Uploaded Files ({uploadedFiles.length})
            </h2>
            <div className="space-y-3">
              {uploadedFiles.map((uploadedFile) => (
                <div
                  key={uploadedFile.id}
                  className="bg-[#404040] rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <FileText className="w-8 h-8 text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {uploadedFile.file.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatFileSize(uploadedFile.file.size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {uploadedFile.status === "uploading" && (
                        <div className="flex items-center space-x-2">
                          <div className="w-32">
                            <Progress
                              value={uploadedFile.progress}
                              className="h-2"
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-12">
                            {Math.round(uploadedFile.progress)}%
                          </span>
                        </div>
                      )}

                      {uploadedFile.status === "success" && (
                        <div className="flex items-center space-x-2 text-green-400">
                          <Check className="w-4 h-4" />
                          <span className="text-xs">Uploaded</span>
                        </div>
                      )}

                      {uploadedFile.status === "error" && (
                        <div className="flex items-center space-x-2 text-red-400">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs">{uploadedFile.error}</span>
                        </div>
                      )}

                      <Button
                        onClick={() => removeFile(uploadedFile.id)}
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {successfulUploads.length > 0 && (
          <div className="mt-8 flex justify-center space-x-4">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent px-8"
              onClick={() => setUploadedFiles([])}
            >
              Clear
            </Button>
            <Link to={`/chat?pdf=${uploadedPdfName}`}>
              <Button disabled={!uploadedPdfName} className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white px-8 cursor-pointer">
               {uploadedPdfName ? "Start Chatting" : "AI Processing..."}
              </Button>
            </Link>
          </div>
        )}

        {/* Features Section */}
      </main>
    </div>
  );
}
