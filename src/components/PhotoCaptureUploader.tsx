import React, { useState, useRef } from 'react';
import { Camera, UploadCloud, X, RefreshCw, Check, Image as ImageIcon, AlertCircle, Sparkles } from 'lucide-react';

interface PresetItem {
  name: string;
  img: string;
}

interface PhotoCaptureUploaderProps {
  label: string;
  currentImage: string;
  onImageChange: (imageUrl: string) => void;
  presets?: PresetItem[];
  helpText?: string;
}

export const PhotoCaptureUploader: React.FC<PhotoCaptureUploaderProps> = ({
  label,
  currentImage,
  onImageChange,
  presets = [],
  helpText = 'Capture live destination photos using device camera, upload from gallery, or choose presets.',
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera tracks cleanly
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    setIsCameraActive(false);
  };

  // Start live camera stream (triggers browser camera permission prompt)
  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    setIsCameraActive(true);
    setIsStreaming(false);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera access via getUserMedia.');
      }

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Explicitly ask for camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err: any) {
      console.error('Camera permission or access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(
          'Camera permission was blocked / denied (কেমেৰাৰ অনুমতি অস্বীকাৰ কৰা হৈছে). Please allow camera permission in your browser address bar settings to snap live photos.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device detected on this device.');
      } else {
        setCameraError(`Camera error: ${err.message || 'Unable to access camera.'}`);
      }
      setIsStreaming(false);
    }
  };

  // Capture frame from active video stream
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.88);

    onImageChange(photoDataUrl);
    stopCamera();
  };

  // Toggle front/back camera
  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Handle file upload from gallery or mobile camera
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onImageChange(result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Failed to read selected image.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-stone-800">{label}</label>
          <p className="text-[11px] text-stone-500">{helpText}</p>
        </div>
        {currentImage && (
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600" />
            Photo Selected
          </span>
        )}
      </div>

      {/* Main Preview & Action Area */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Preview Box */}
        <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden border-2 border-dashed border-stone-300 bg-stone-100 shrink-0 group shadow-inner">
          {currentImage ? (
            <>
              <img
                src={currentImage}
                alt="Selected destination preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onImageChange('')}
                  className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-sm transition-transform active:scale-95"
                  title="Remove Photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-2 text-center">
              <ImageIcon className="w-8 h-8 mb-1 stroke-1" />
              <span className="text-[11px] font-medium">No photo selected</span>
              <span className="text-[9px] text-stone-400">Click camera or upload</span>
            </div>
          )}
        </div>

        {/* Buttons / Controls */}
        <div className="flex-1 space-y-2.5 w-full">
          <div className="flex flex-wrap items-center gap-2">
            {/* Live Camera Button */}
            <button
              type="button"
              onClick={() => startCamera()}
              className="px-3 py-2 text-xs font-semibold text-white bg-[#0b4619] hover:bg-[#062b0f] rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Camera className="w-4 h-4 text-[#f39c12]" />
              <span>Live Camera (কেমেৰাৰে তোলক)</span>
            </button>

            {/* Mobile Native Camera (Direct capture attribute) */}
            <button
              type="button"
              onClick={() => nativeCameraInputRef.current?.click()}
              className="px-3 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Open smartphone camera app directly"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f39c12]" />
              <span>Phone Camera (Direct Snap)</span>
            </button>

            {/* Standard File Upload */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 text-stone-600" />
              <span>{isUploading ? 'Reading...' : 'Browse Gallery / File'}</span>
            </button>
          </div>

          <p className="text-[11px] text-stone-500 leading-tight">
            * <strong>Camera Permission:</strong> Clicking &apos;Live Camera&apos; will ask for browser camera access (পাৰ্মিছন বিচাৰিব). You can grant access to snap real destination photos instantly!
          </p>

          {/* Hidden inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={nativeCameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Preset Photo Selector (if provided) */}
      {presets.length > 0 && (
        <div className="pt-2 border-t border-stone-200">
          <span className="block text-[11px] font-semibold text-stone-600 mb-1.5">
            Or pick from verified scenic destination presets:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {presets.map((preset, i) => (
              <div
                key={i}
                onClick={() => onImageChange(preset.img)}
                className={`relative h-18 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  currentImage === preset.img
                    ? 'border-[#0b4619] shadow-sm ring-2 ring-[#0b4619]/20'
                    : 'border-stone-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={preset.img} alt={preset.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1 right-1 text-[9px] font-medium bg-black/60 text-white px-1 py-0.5 rounded truncate text-center">
                  {preset.name}
                </span>
                {currentImage === preset.img && (
                  <span className="absolute top-1 right-1 p-0.5 rounded-full bg-[#0b4619] text-white">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIVE CAMERA VIEWFINDER MODAL */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-4 bg-stone-950 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#f39c12] animate-pulse" />
                <div>
                  <h4 className="text-sm font-bold text-white">Live Camera Capture</h4>
                  <p className="text-[11px] text-stone-400">
                    Camera permission requested (কেমেৰা অনুমতি লৈ ফটো তোলক)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewfinder View */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {cameraError ? (
                <div className="p-6 text-center text-rose-300 space-y-2">
                  <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                  <p className="text-xs font-semibold">{cameraError}</p>
                  <p className="text-[11px] text-stone-400">
                    Tip: If blocked, click the &ldquo;padlock/tune&rdquo; icon on your browser address bar &gt; Camera &gt; Allow, then try again.
                  </p>
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="mt-2 px-3 py-1.5 rounded bg-rose-900/60 hover:bg-rose-900 text-rose-100 text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Camera Permission</span>
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Target guide reticle */}
                  <div className="absolute inset-8 border border-white/25 rounded-xl pointer-events-none flex items-center justify-center">
                    <div className="w-6 h-6 border-t-2 border-l-2 border-[#f39c12] absolute top-2 left-2" />
                    <div className="w-6 h-6 border-t-2 border-r-2 border-[#f39c12] absolute top-2 right-2" />
                    <div className="w-6 h-6 border-b-2 border-l-2 border-[#f39c12] absolute bottom-2 left-2" />
                    <div className="w-6 h-6 border-b-2 border-r-2 border-[#f39c12] absolute bottom-2 right-2" />
                    <span className="text-[10px] text-white/50 tracking-wider uppercase font-mono">
                      Align Destination Scene
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Controls Toolbar */}
            <div className="p-4 bg-stone-950 flex items-center justify-between border-t border-stone-800">
              <button
                type="button"
                onClick={toggleCameraFacing}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 flex items-center gap-1.5"
                title="Switch front/back camera"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Switch ({facingMode === 'environment' ? 'Back' : 'Front'})</span>
              </button>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={capturePhoto}
                disabled={!isStreaming || !!cameraError}
                className="px-6 py-2.5 rounded-full font-bold text-xs text-stone-900 bg-[#f39c12] hover:bg-amber-400 active:scale-95 transition-all shadow-lg flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <div className="w-3 h-3 rounded-full bg-stone-900 animate-ping" />
                <span>SNAP PHOTO (ফটো তোলক)</span>
              </button>

              <button
                type="button"
                onClick={stopCamera}
                className="px-3 py-1.5 rounded-lg text-xs text-stone-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
