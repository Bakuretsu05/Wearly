import { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, Camera } from 'lucide-react';
import { LoadingState } from '../types';

interface UploadSectionProps {
  onAnalyze: (file: File, evaluateStyle: boolean) => void;
  loadingState: LoadingState;
  uploadedImage: string | null;
  onReset: () => void;
}

export function UploadSection({
  onAnalyze,
  loadingState,
  uploadedImage,
  onReset,
}: UploadSectionProps) {
  const [evaluateStyle, setEvaluateStyle] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
    },
    maxFiles: 1,
    disabled: loadingState === 'processing' || loadingState === 'uploading',
  });

  const handleAnalyze = () => {
    if (selectedFile) {
      onAnalyze(selectedFile, evaluateStyle);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setCameraError(null);
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to access camera';
      setCameraError(error);
      console.error('Camera error:', err);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setSelectedFile(file);
          stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    stopCamera();
    onReset();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const isLoading = loadingState === 'processing' || loadingState === 'uploading';
  const canAnalyze = selectedFile && !isLoading;
  
  // Check if camera is available
  const isCameraAvailable = typeof navigator !== 'undefined' && 
    navigator.mediaDevices && 
    navigator.mediaDevices.getUserMedia;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="card">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Upload Image</h2>
        
        {!uploadedImage && !showCamera ? (
          <>
            {/* Camera Error Display */}
            {cameraError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{cameraError}</p>
              </div>
            )}

            <div className="space-y-3">
              {/* Camera Button */}
              {isCameraAvailable && (
                <button
                  onClick={startCamera}
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
                >
                  <Camera className="h-5 w-5" />
                  <span>Take Photo</span>
                </button>
              )}

              {/* File Upload Options */}
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-xs text-gray-500 px-2">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Drag & Drop Area */}
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer
                  transition-colors duration-200
                  ${
                    isDragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 hover:border-primary/50 active:border-primary'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
                {isDragActive ? (
                  <p className="text-primary font-medium text-sm sm:text-base">Drop the image here...</p>
                ) : (
                  <>
                    <p className="text-gray-700 mb-2 text-sm sm:text-base">
                      Drag & drop or click to select
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports: JPG, PNG, WebP
                    </p>
                  </>
                )}
              </div>

              {/* File Input Button for Gallery */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-full btn-secondary py-2 text-sm"
              >
                Choose from Gallery
              </button>
            </div>
          </>
        ) : showCamera ? (
          <div className="space-y-3">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-h-[400px] object-contain"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={stopCamera}
                className="flex-1 btn-secondary py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                className="flex-1 btn-primary py-2 text-sm"
              >
                Capture Photo
              </button>
            </div>
          </div>
        ) : uploadedImage ? (
          <div className="relative">
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 active:bg-red-700 transition-colors"
              disabled={isLoading}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        {selectedFile && !uploadedImage && !showCamera && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              Selected: <span className="font-medium">{selectedFile.name}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="card">
        <div className="space-y-4">
          {/* Style Evaluation Toggle */}
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={evaluateStyle}
              onChange={(e) => setEvaluateStyle(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-gray-700 text-sm sm:text-base">
              Include Style Evaluation (ChatGPT)
            </span>
          </label>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="btn-primary w-full flex items-center justify-center space-x-2 py-3 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>
                  {loadingState === 'uploading' ? 'Uploading...' : 'Processing...'}
                </span>
              </>
            ) : (
              <span>Analyze Outfit</span>
            )}
          </button>

          {/* Loading Status */}
          {isLoading && (
            <div className="space-y-2 text-xs sm:text-sm text-gray-600">
              {loadingState === 'processing' && (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse flex-shrink-0" />
                    <span>Parsing clothing regions...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse flex-shrink-0" />
                    <span>Extracting colors...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse flex-shrink-0" />
                    <span>Analyzing attributes...</span>
                  </div>
                  {evaluateStyle && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse flex-shrink-0" />
                      <span>Evaluating style...</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
