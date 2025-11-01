'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface DownloadData {
  valid: boolean;
  productName: string;
  downloadUrl: string;
  expiresAt: string;
  message?: string;
}

const DownloadPage: React.FC = () => {
  const params = useParams();
  const token = params.token as string;
  const [downloadData, setDownloadData] = useState<DownloadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/downloads/verify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setDownloadData(data);
        } else {
          setError(data.error || 'Invalid download token');
        }
      } catch (err) {
        setError('Failed to verify download token');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  const handleDownload = () => {
    if (downloadData?.downloadUrl) {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadData.downloadUrl;
      link.download = 'el-archivo-complete-collection.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying download...</p>
        </div>
      </div>
    );
  }

  if (error || !downloadData?.valid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Download Not Available</h1>
          <p className="text-gray-600 mb-6">
            {error || 'This download link is invalid or has expired.'}
          </p>
          <a 
            href="/archivo" 
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full transition-colors duration-300"
          >
            Return to Store
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Download Ready</h1>
        <p className="text-gray-600 mb-6">
          Your {downloadData.productName} is ready for download.
        </p>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">
            <strong>File:</strong> el-archivo-complete-collection.zip<br />
            <strong>Size:</strong> ~150 MB<br />
            <strong>Expires:</strong> {new Date(downloadData.expiresAt).toLocaleString()}
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full transition-colors duration-300 mb-4"
        >
          Download Now
        </button>

        <p className="text-xs text-gray-500">
          This download link will expire in 24 hours for security reasons.
        </p>
      </div>
    </div>
  );
};

export default DownloadPage;
