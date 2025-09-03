import React, { useEffect, useState } from 'react';
import axios from 'axios';
interface FileObject {
  ObjectName: string;
  IsDirectory: boolean;
  Size: number;
}
const Stream: React.FC = () => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [loading, setLoading] = useState(true);
  const apiKey = process.env.NEXT_PUBLIC_BUNNYCDN_API_KEY; // Storage API Key
  const storageZone = process.env.NEXT_PUBLIC_BUNNYCDN_STORAGE_ZONE; // Storage Zone
  const pullZoneHostname = 'shiendark.b-cdn.net'; // Your Pull Zone hostname
  const storageFolder = 'SDM%20ALL%20MUSIC%20MP3'; // Folder containing your audio files

  useEffect(() => {
    const fetchFiles = async () => {
      if (!apiKey || !storageZone) {
        console.error("API Key or Storage Zone not defined.");
        setLoading(false);
        return;
      }
      try {
        // Fetch the list of files from the Storage API
        const response = await axios.get(`https://shiendark.b-cdn.net/${storageZone}/${storageFolder}/`, {
          headers: {
            'AccessKey': apiKey
          }
        });
        setFiles(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching files: ", error);
        setLoading(false);
      }
    };
    fetchFiles();
  }, [apiKey, storageZone]);
  if (loading) {
    return <p>Loading audio files...</p>;
  }
  return <div>
            <h1>Audio Files</h1>
            <ul>
                {files.map((file, index) => <li key={index}>
                        {file.IsDirectory ? '📁' : '🎵'} {file.ObjectName} ({file.Size} bytes)
                        {!file.IsDirectory && <audio controls>
                                <source src={`https://${pullZoneHostname}/${storageFolder}/${file.ObjectName}`} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>}
                    </li>)}
            </ul>
        </div>;
};
export default Stream;