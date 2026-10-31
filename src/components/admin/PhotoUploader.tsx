import { useMemo, useRef, useState } from 'react';
import styles from './PhotoUploader.module.css';

type UploadState = 'queued' | 'uploading' | 'complete' | 'error';

interface UploadItem {
  file: File;
  title: string;
  tags: string;
  width: number;
  height: number;
  progress: number;
  state: UploadState;
  error?: string;
}

const tokenStorageKey = 'photo-upload-token';

export default function PhotoUploader() {
  const [token, setToken] = useState(() =>
    typeof window === 'undefined' ? '' : (window.localStorage.getItem(tokenStorageKey) ?? ''),
  );
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const apiUrl = import.meta.env.PUBLIC_PHOTOS_API_URL;

  const apiConfigured = useMemo(() => Boolean(apiUrl), [apiUrl]);

  const addFiles = async (files: FileList | File[]) => {
    const newItems = await Promise.all(
      Array.from(files)
        .filter((file) => file.type.startsWith('image/'))
        .map(async (file) => {
          const dimensions = await readImageDimensions(file);
          return {
            file,
            title: file.name.replace(/\.[^/.]+$/, ''),
            tags: '',
            width: dimensions?.width ?? 3,
            height: dimensions?.height ?? 2,
            progress: 0,
            state: 'queued' as const,
          };
        }),
    );
    setItems((current) => [...current, ...newItems]);
  };

  const updateItem = (index: number, update: Partial<UploadItem>) => {
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...update } : item)),
    );
  };

  const upload = (index: number) => {
    const item = items[index];
    if (!item || !apiUrl || !token) {
      return;
    }

    const formData = new FormData();
    formData.set('file', item.file);
    formData.set('title', item.title);
    formData.set('alt', item.title);
    formData.set('tags', item.tags);
    formData.set('width', String(item.width));
    formData.set('height', String(item.height));

    const request = new XMLHttpRequest();
    request.open('POST', apiUrl);
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        updateItem(index, {
          progress: Math.round((event.loaded / event.total) * 100),
          state: 'uploading',
        });
      }
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        updateItem(index, { progress: 100, state: 'complete' });
      } else {
        updateItem(index, { state: 'error', error: `Upload failed (${request.status})` });
      }
    };
    request.onerror = () => updateItem(index, { state: 'error', error: 'Network error' });
    updateItem(index, { state: 'uploading', error: undefined });
    request.send(formData);
  };

  const uploadAll = () => {
    items.forEach((item, index) => {
      if (item.state === 'queued' || item.state === 'error') {
        upload(index);
      }
    });
  };

  const saveToken = () => {
    window.localStorage.setItem(tokenStorageKey, token);
  };

  return (
    <section className={styles.uploader}>
      <h1>Photo uploads</h1>
      <p>Upload photos to the photography gallery.</p>
      {!apiConfigured && (
        <p className={styles.configurationAlert} role="alert">
          Set PUBLIC_PHOTOS_API_URL before uploading.
        </p>
      )}
      <label>
        Upload token
        <input
          type="password"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          onBlur={saveToken}
          autoComplete="off"
        />
      </label>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        <span className={styles.uploadIcon} aria-hidden="true">
          ↑
        </span>
        <p className={styles.dropzoneTitle}>Drag and drop images here</p>
        <p className={styles.dropzoneOr}>or</p>
        <button
          className={styles.browseButton}
          type="button"
          onClick={() => fileInput.current?.click()}
        >
          Browse files
        </button>
        <p className={styles.fileHint}>Accepted file types: images only</p>
        <input
          ref={fileInput}
          className={styles.hiddenInput}
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => event.target.files && addFiles(event.target.files)}
        />
      </div>
      {items.some((item) => item.state === 'queued' || item.state === 'error') && (
        <button
          className={styles.uploadAllButton}
          type="button"
          disabled={!token || !apiConfigured || items.some((item) => item.state === 'uploading')}
          onClick={uploadAll}
        >
          Upload selected photos
        </button>
      )}
      <ul className={styles.fileList}>
        {items.map((item, index) => (
          <li key={`${item.file.name}-${index}`}>
            <strong>{item.file.name}</strong>
            <label>
              Title
              <input
                value={item.title}
                onChange={(event) => updateItem(index, { title: event.target.value })}
              />
            </label>
            <label>
              Tags
              <input
                value={item.tags}
                placeholder="landscape, evening"
                onChange={(event) => updateItem(index, { tags: event.target.value })}
              />
            </label>
            {item.state === 'uploading' && <progress value={item.progress} max="100" />}
            {item.state === 'complete' && (
              <p className={styles.success} role="status">
                Upload complete: {item.title} is now saved to the gallery.
              </p>
            )}
            {item.state === 'error' && <span className={styles.error}>{item.error}</span>}
            {item.state !== 'complete' && (
              <button
                type="button"
                disabled={!token || !apiConfigured || item.state === 'uploading'}
                onClick={() => upload(index)}
              >
                Upload
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function readImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const image = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };
    image.src = objectUrl;
  });
}
