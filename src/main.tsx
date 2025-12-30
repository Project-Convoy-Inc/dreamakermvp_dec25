import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// #region agent log - Network request monitoring
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
  if (url.includes('manifest.json') || url.endsWith('/manifest.json')) {
    fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:8',message:'manifest.json request detected',data:{url,method:args[1]?.method||'GET',hasHeaders:!!args[1]?.headers},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  }
  return originalFetch.apply(this, args).then(response => {
    if (url.includes('manifest.json') || url.endsWith('/manifest.json')) {
      fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:14',message:'manifest.json response received',data:{url,status:response.status,statusText:response.statusText,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    }
    return response;
  }).catch(error => {
    if (url.includes('manifest.json') || url.endsWith('/manifest.json')) {
      fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:19',message:'manifest.json request failed',data:{url,error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    }
    throw error;
  });
};
// #endregion

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);
root.render(<App />);

