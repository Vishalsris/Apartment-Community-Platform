import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Upload, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ImageUpload = ({ onUploadSuccess, currentImage, label = "Upload Image" }) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (2MB) inside component as well for immediate UX feedback
    if (file.size > 2000000) {
      toast.error("File size must be under 2MB");
      return;
    }

    // Validate type strictly
    if (!file.type.match('image/jpeg|image/png')) {
      toast.error("Only JPG and PNG files are allowed");
      return;
    }

    // Set local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Upload to server
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user?.token}`
        }
      });
      onUploadSuccess(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image");
      setPreview(currentImage || null); // Revert
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadSuccess('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-900 mb-2">{label}</label>
      
      {preview ? (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-200 shadow-sm group bg-gray-50 flex items-center justify-center">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <button 
              type="button" 
              onClick={handleRemove}
              className="bg-white text-red-500 rounded-full p-2 shadow-lg hover:scale-110 hover:bg-red-50 transition-all font-bold"
            >
              <X size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-500 transition-all cursor-pointer relative overflow-hidden group"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={28} className="animate-spin text-indigo-500" />
              <span className="text-sm font-medium text-indigo-500">Uploading...</span>
            </div>
          ) : (
            <>
              <div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                <Upload size={20} className="text-indigo-400" />
              </div>
              <span className="text-sm font-medium">Click to browse (JPG/PNG, max 2MB)</span>
            </>
          )}
        </div>
      )}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/jpeg, image/png" 
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
};

export default ImageUpload;
