"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
}

export default function ImageUpload({ onUpload, currentUrl }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentUrl || "");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileName = `carte-${Date.now()}.png`;
    const { data, error } = await supabase.storage
      .from("photos")
      .upload(`public/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Erreur upload :", error.message);
      alert("Erreur lors de l'upload");
    } else if (data) {
      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(`public/${fileName}`);
      setPreview(urlData.publicUrl);
      onUpload(urlData.publicUrl);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <Input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
      {preview && (
        <img
          src={preview}
          alt="Aperçu"
          className="w-24 h-24 object-cover rounded border mt-2"
        />
      )}
      {uploading && <p className="text-sm text-gray-500">Upload en cours…</p>}
    </div>
  );
}