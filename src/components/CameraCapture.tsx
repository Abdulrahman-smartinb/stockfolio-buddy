import { toast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type CameraCaptureProps = {
  onCapture: (file: File) => void;
  onClose?: () => void;
};

export const CameraCapture = ({ onCapture, onClose }: CameraCaptureProps) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraReady, setIsCameraReady] = useState(false);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraReady(true);
      }
    } catch (err) {
      toast({
        title: t("permission_denied"),
        variant: "destructive",
        description: t("permission_denied_desc"),
        duration: 5000,
      });
      console.error("Camera access denied", err);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File([blob], "live-photo.jpg", {
          type: "image/jpeg",
        });

        onCapture(file);
        stopCamera();
        onClose?.();
      },
      "image/jpeg",
      0.9,
    );
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-black rounded-lg overflow-hidden">
      {/* Video preview */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="w-full h-auto object-cover"
      />

      {/* Face alignment overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative w-56 h-72">
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50 rounded-lg" />

          {/* Transparent oval */}
          <div
            className="absolute inset-0 m-auto rounded-full"
            style={{
              width: "180px",
              height: "240px",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
            }}
          />

          {/* Oval border */}
          <div
            className="absolute inset-0 m-auto border-2 border-white rounded-full"
            style={{
              width: "180px",
              height: "240px",
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={takePhoto}
          disabled={!isCameraReady}
          className="bg-white text-black px-6 py-2 rounded-full font-medium"
        >
          {t("capture")}
        </button>

        {onClose && (
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-full"
          >
            {t("cancel")}
          </button>
        )}
      </div>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
