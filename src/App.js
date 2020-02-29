import React, { useEffect, useState } from "react";
import "./styles.css";
import db from "./db";

export default function App() {
  const blobs = useBlobs();
  return (
    <div className="App">
      <h1>blobbox</h1>
      {blobs.map(blob => (
        <BlobItem key={blob.id} blob={blob} />
      ))}
      {blobs.length === 0 && <EmptyState />}
    </div>
  );
}

function EmptyState() {
  return (
    <article>
      <p>
        <strong>blobbox</strong> is a web-based, hackable PWA that stores blobs
        of various kinds. To get started, put in some data by:
      </p>
      <ul>
        <li>Dragging it into the window</li>
        <li>Pasting it (Ctrl-V)</li>
        <li>Sharing it to the PWA (on Android; must install first)</li>
      </ul>
    </article>
  );
}

function BlobItem({ blob }) {
  return (
    <article>
      <h2>
        {blob.id} @ {blob.createdAt}
      </h2>
      {!!blob.title && (
        <textarea className="blob-title" value={blob.title} readOnly />
      )}
      {!!blob.text && (
        <textarea className="blob-text" value={blob.text} readOnly />
      )}
      {(blob.files || []).map((file, index) => (
        <BlobFile key={index} file={file} />
      ))}
      {Object.entries(blob.otherTypes || {}).map(([key, value]) => (
        <>
          <h3>{key}</h3>
          <ShowCurtain>
            <textarea className="blob-text" value={value} readOnly />
          </ShowCurtain>
        </>
      ))}
    </article>
  );
}

function BlobFile({ file }) {
  return (
    <div>
      <h3>{file.type}</h3>
      <p>{file.size} bytes</p>
      {/^image\//.test(file.type) && (
        <div>
          <ShowCurtain>
            <BlobImage file={file} />
          </ShowCurtain>
        </div>
      )}
      {/^text\//.test(file.type) && (
        <div>
          <ShowCurtain>
            <BlobText file={file} />
          </ShowCurtain>
        </div>
      )}
    </div>
  );
}

function BlobImage({ file }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(URL.createObjectURL(file));
  }, []);
  return url ? <img src={url} alt="" /> : "Getting image...";
}

function BlobText({ file }) {
  const [text, setText] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        setText(await file.text());
      } catch (e) {
        alert(e);
      }
    })();
  }, []);
  return text !== null ? (
    <textarea className="blob-text" value={text} readOnly />
  ) : (
    "..."
  );
}

function ShowCurtain({ children }) {
  const [show, setShow] = useState(false);
  return show ? children : <button onClick={() => setShow(true)}>Show</button>;
}

function useBlobs() {
  const [blobs, setBlobs] = useState([]);
  useEffect(() => {
    (async () => {
      const rows = await db.blobs.toArray();
      setBlobs(rows);
      window.blobs = rows;
    })();
  }, []);
  return blobs;
}
