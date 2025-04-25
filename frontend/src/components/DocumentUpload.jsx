// filepath: c:\Users\papas\New folder\frontend\src\components\DocumentUpload.jsx
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUpload, FaFileUpload, FaFileImage, FaFilePdf } from "react-icons/fa";
import React from "react";

const DocumentUpload = ({ patientId, appointmentId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (
        !["image/jpeg", "image/png", "image/gif", "application/pdf"].includes(
          selectedFile.type
        )
      ) {
        toast.error("Please upload an image (JPEG, PNG, GIF) or PDF file");
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setFile(selectedFile);

      // Set a default name based on the file name if not provided
      if (!name) {
        setName(selectedFile.name.split(".")[0]);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.warning("Please select a file to upload");
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("document", file);
      formData.append("name", name || file.name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("patientId", patientId);

      if (appointmentId) {
        formData.append("appointmentId", appointmentId);
      }

      const response = await axios.post(
        "http://localhost:3000/api/documents/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Document uploaded successfully!");
        setFile(null);
        setName("");
        setDescription("");
        setCategory("other");

        // Call the callback function if provided
        if (onUploadSuccess) {
          onUploadSuccess(response.data.data);
        }
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to upload document. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FaFileUpload className="mr-2 text-blue-500" />
        Upload Document
      </h3>

      <form onSubmit={handleUpload}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Document Type
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="xray">X-Ray</option>
            <option value="report">Medical Report</option>
            <option value="prescription">Prescription</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Document Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., X-Ray Results, Treatment Plan"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            placeholder="Brief description of the document"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Select File (Image or PDF)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {file ? (
                <>
                  {file.type.includes("image") ? (
                    <FaFileImage className="mx-auto h-12 w-12 text-blue-500" />
                  ) : (
                    <FaFilePdf className="mx-auto h-12 w-12 text-red-500" />
                  )}
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/jpeg,image/png,image/gif,application/pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF or PDF up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          {file && (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="px-4 py-2 mr-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            disabled={!file || uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/50 border-t-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <FaUpload className="mr-2" /> Upload Document
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload;
