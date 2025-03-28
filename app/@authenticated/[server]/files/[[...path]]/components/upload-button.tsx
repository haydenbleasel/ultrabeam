'use client';

import { uploadFile } from '@/actions/files/upload';
import { Button } from '@/components/ui/button';
import { handleError } from '@/lib/utils';
import { Loader2Icon, UploadCloudIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { type ChangeEventHandler, useRef, useState } from 'react';
import { toast } from 'sonner';

type UploadButtonProps = {
  path: string;
};

export const UploadButton = ({ path }: UploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const params = useParams();
  const serverId = params.server as string;

  const handleUpload: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0 || isUploading) {
      return;
    }

    setIsUploading(true);

    try {
      const file = files[0];
      const result = await uploadFile(serverId, path, file);

      if ('error' in result) {
        handleError(result.error);
        return;
      }

      toast.success('File uploaded successfully');
    } catch (error) {
      handleError(error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
      />
      <Button
        className="ml-auto"
        variant="outline"
        onClick={triggerFileInput}
        disabled={isUploading}
      >
        <UploadCloudIcon
          className="-ms-1 opacity-60"
          size={16}
          aria-hidden="true"
        />
        {isUploading ? <Loader2Icon className="animate-spin" /> : 'Upload'}
      </Button>
    </>
  );
};
