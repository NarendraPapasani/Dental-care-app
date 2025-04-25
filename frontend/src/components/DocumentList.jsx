// filepath: c:\Users\papas\New folder\frontend\src\components\DocumentList.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import React from "react";
import {
  FaDownload,
  FaTrash,
  FaFileImage,
  FaFilePdf,
  FaFileAlt,
  FaEye,
} from "react-icons/fa";

const DocumentList = ({ appointmentId, isPatient = false }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePreview, setActivePreview] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      const token = localStorage.getItem("token");

      try {
        let url = "http://localhost:3000/api/documents/";

        if (appointmentId) {
          url += `appointment/${appointmentId}`;
        } else if (isPatient) {
          url += "patient";
        } else {
          url += "dentist";
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setDocuments(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast.error("Failed to load documents. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [appointmentId, isPatient]);

  const handleDelete = async (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.delete(
          `http://localhost:3000/api/documents/${documentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          toast.success("Document deleted successfully");
          setDocuments(documents.filter((doc) => doc._id !== documentId));
        }
      } catch (error) {
        console.error("Error deleting document:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to delete document. Please try again."
        );
      }
    }
  };

  const downloadDocument = async (documentId, originalName) => {
    const token = localStorage.getItem("token");

    try {
      // Use axios to fetch the file as a blob
      const response = await axios.get(
        `http://localhost:3000/api/documents/download/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Important for file downloads
        }
      );

      // Create a blob URL and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Document download started");
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document. Please try again.");
    }
  };

  const openPreview = (doc) => {
    setActivePreview(doc);
  };

  const closePreview = () => {
    setActivePreview(null);
  };

  const getDocumentIcon = (fileType) => {
    if (fileType && fileType.startsWith("image/")) {
      return <FaFileImage className="text-blue-500" />;
    } else if (fileType === "application/pdf") {
      return <FaFilePdf className="text-red-500" />;
    } else {
      return <FaFileAlt className="text-gray-500" />;
    }
  };

  const getDocumentCategoryLabel = (category) => {
    const labels = {
      xray: "X-Ray",
      report: "Medical Report",
      prescription: "Prescription",
      other: "Other Document",
    };

    return labels[category] || "Document";
  };

  const getCategoryColor = (category) => {
    const colors = {
      xray: "bg-purple-100 text-purple-800",
      report: "bg-blue-100 text-blue-800",
      prescription: "bg-green-100 text-green-800",
      other: "bg-gray-100 text-gray-800",
    };

    return colors[category] || "bg-gray-100 text-gray-800";
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Documents {documents.length > 0 && `(${documents.length})`}
      </h3>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <FaFileAlt className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <h4 className="text-gray-500 font-medium">No documents found</h4>
          {!isPatient && !appointmentId && (
            <p className="text-gray-400 text-sm mt-1">
              Upload a document for your patients
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <li
                key={doc._id}
                className="p-4 hover:bg-gray-50 transition duration-150"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        {getDocumentIcon(doc.fileType)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        {doc.name}
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1 items-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            doc.category
                          )}`}
                        >
                          {getDocumentCategoryLabel(doc.category)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(doc.uploadDate)}
                        </span>
                        {doc.description && (
                          <span className="text-sm text-gray-500">
                            — {doc.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3 sm:mt-0">
                    {doc.fileType && doc.fileType.startsWith("image/") && (
                      <button
                        onClick={() => openPreview(doc)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Preview"
                      >
                        <FaEye />
                      </button>
                    )}
                    <button
                      onClick={() =>
                        downloadDocument(doc._id, doc.originalName)
                      }
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                      title="Download"
                    >
                      <FaDownload />
                    </button>
                    {!isPatient && (
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Image Preview Modal */}
      {activePreview && activePreview.fileType.startsWith("image/") && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="max-w-4xl bg-white rounded-lg overflow-hidden shadow-xl">
            <div className="p-4 bg-gray-100 flex justify-between items-center">
              <h3 className="font-medium">{activePreview.name}</h3>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-200 rounded"
              >
                &times;
              </button>
            </div>
            <div className="p-4 flex justify-center">
              <img
                src={`http://localhost:3000${activePreview.fileUrl}`}
                alt={activePreview.name}
                className="max-h-[80vh] max-w-full object-contain"
              />
            </div>
            <div className="p-4 bg-gray-100 flex justify-between">
              <div className="text-sm text-gray-600">
                {formatDate(activePreview.uploadDate)}
                {activePreview.description && ` — ${activePreview.description}`}
              </div>
              <button
                onClick={() =>
                  downloadDocument(
                    activePreview._id,
                    activePreview.originalName
                  )
                }
                className="text-green-600 hover:text-green-700 flex items-center"
              >
                <FaDownload className="mr-1" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
