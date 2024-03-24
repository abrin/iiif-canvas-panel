import React, { useState, useEffect } from "react";
import { action } from '@storybook/addon-actions';

export default {title: 'Canvas Panel'}

const canvases = [
  "https://iiif.wellcomecollection.org/presentation/b18035723/canvases/b18035723_0001.JP2",
  "https://iiif.wellcomecollection.org/presentation/b18035723/canvases/b18035723_0002.JP2",
  "https://iiif.wellcomecollection.org/presentation/b18035723/canvases/b18035723_0003.JP2",
]
export const ChangingCanvases = () => {

  const [cv, setCv] = useState(canvases[0]);


  return <>
    <button onClick={()=>setCv(c => canvases[(canvases.indexOf(c) + 1) % canvases.length])}>Next</button>
    {/* @ts-ignore */}
    <canvas-panel manifest-id="https://iiif.wellcomecollection.org/presentation/b18035723" canvas-id={cv} />
  </>
}

export const CanvasWithNavigator = () => {
  {/* @ts-ignore */}
  return <canvas-panel manifest-id="https://iiif.wellcomecollection.org/presentation/b18035723" canvas-id={canvases[0]} enable-navigator="true" />;

}



export const CanvasWithSkipSizes = () => {


  const manifestUrl = 'https://media.getty.edu/iiif/manifest/1e0ed47e-5a5b-4ff0-aea0-45abee793a1c'
  const [canvases, setCanvses] = useState(['https://media.getty.edu/iiif/manifest/canvas/bb72d5f1-e230-4797-a7dc-262bf948b256']);
  const [cvindex, setCvindex] = useState(0);
  const [zoomInfo, setZoomInfo] = useState({});
  const [canZoomIn, setCanZoomIn] = useState(false);
  const [canZoomOut, setCanZoomOut] = useState(false);


  let panel;
  useEffect(() => {
    panel = document.querySelector("canvas-panel,sequence-panel");
    let manifest = undefined;
    panel.vault.loadManifest(manifestUrl).then((_manifest) => {
      manifest = _manifest;
      setCanvses((panel as any).vault.get(manifestUrl).items.map(item => item.id));
      console.log('hi')
    })

    
    panel.addEventListener("world-ready", (e) => {
      // set the initial state based on the image that's loaded into the canvas
      const detail = (e as any).detail;
      setZoomInfo(detail);
      setCanZoomIn(detail.canZoomIn);
      setCanZoomOut(detail.canZoomOut);
    })


    panel.addEventListener("zoom", (e) => {
      const detail = (e as any).detail;
      setZoomInfo(detail);
      setCanZoomIn(detail.canZoomIn);
      setCanZoomOut(detail.canZoomOut);
    });
    ['zoom', 'world-ready', 'choice', 'move', 'canvas-change', 'media', 'ready', 'zoom', 'range-change','click'].forEach(type => {
      panel.addEventListener(type, (e) => { action(type)(e) });
    })

  }, [document.querySelector("canvas-panel,sequence-panel") !== undefined]);
  {/* @ts-ignore */ }

  return <>
    <button onClick={()=>setCvindex(c => (cvindex - 1) % canvases.length)}>Prev Canvas</button>
    <button onClick={() => setCvindex(c => (cvindex + 1) % canvases.length)}>Next Canvas</button>
    <button disabled={!canZoomIn} onClick={() => (document?.querySelector("canvas-panel,sequence-panel") as any).zoomIn()}>Zoom In</button> 
    <button disabled={!canZoomOut} onClick={() => (document?.querySelector("canvas-panel,sequence-panel") as any).zoomOut()}>Zoom Out</button>

    { canvases[Math.abs(cvindex)] }
    {/* @ts-ignore */}
    <canvas-panel manifest-id={manifestUrl} skip-sizes='true' canvas-id={canvases[Math.abs(cvindex)]  } />
  </>

}


export const CanvasWithContentState = () => {


  const manifestUrl = 'https://media.getty.edu/iiif/manifest/1e0ed47e-5a5b-4ff0-aea0-45abee793a1c'
  const [canvases, setCanvses] = useState(['https://media.getty.edu/iiif/manifest/canvas/bb72d5f1-e230-4797-a7dc-262bf948b256']);
  const [cvindex, setCvindex] = useState(0);
  const [zoomInfo, setZoomInfo] = useState({});
  const [canZoomIn, setCanZoomIn] = useState(false);
  const [canZoomOut, setCanZoomOut] = useState(false);


  let panel;
  let count = 0;
  useEffect(() => {
    panel = document.querySelector("canvas-panel,sequence-panel");
    let manifest = undefined;
    panel.vault.loadManifest(manifestUrl).then((_manifest) => {
      manifest = _manifest;
      setCanvses((panel as any).vault.get(manifestUrl).items.map(item => item.id));
      console.log('hi')
    })

    
    panel.addEventListener("world-ready", (e) => {
      // set the initial state based on the image that's loaded into the canvas
      const detail = (e as any).detail;
      setZoomInfo(detail);
      setCanZoomIn(detail.canZoomIn);
      setCanZoomOut(detail.canZoomOut);
      if (count == 0) {
        panel.setContentStateFromText("JTdCJTIyaWQlMjIlM0ElMjJodHRwcyUzQSUyRiUyRm1lZGlhLmdldHR5LmVkdSUyRmlpaWYlMkZtYW5pZmVzdCUyRmNhbnZhcyUyRmJiNzJkNWYxLWUyMzAtNDc5Ny1hN2RjLTI2MmJmOTQ4YjI1Ni5qc29uJTIzeHl3aCUzRDEwMzMuNDE0NTUwNzgxMjUlMkM0ODMzLjkxNzQ4MDQ2ODc1JTJDMjY1My4zMzEyOTg4MjgxMjUlMkMxMTY3LjEwMTU2MjUlMjIlMkMlMjJ0eXBlJTIyJTNBJTIyQ2FudmFzJTIyJTJDJTIycGFydE9mJTIyJTNBJTVCJTdCJTIyaWQlMjIlM0ElMjJodHRwcyUzQSUyRiUyRm1lZGlhLmdldHR5LmVkdSUyRmlpaWYlMkZtYW5pZmVzdCUyRjFlMGVkNDdlLTVhNWItNGZmMC1hZWEwLTQ1YWJlZTc5M2ExYyUyMiUyQyUyMnR5cGUlMjIlM0ElMjJNYW5pZmVzdCUyMiU3RCU1RCU3RA")
      }
      count++;
    })


    panel.addEventListener("zoom", (e) => {
      const detail = (e as any).detail;
      setZoomInfo(detail);
      setCanZoomIn(detail.canZoomIn);
      setCanZoomOut(detail.canZoomOut);
    });
    ['zoom', 'world-ready', 'choice', 'move', 'canvas-change', 'media', 'ready', 'zoom', 'range-change','click'].forEach(type => {
      panel.addEventListener(type, (e) => { action(type)(e) });
    })

  }, [document.querySelector("canvas-panel,sequence-panel") !== undefined]);
  {/* @ts-ignore */ }

  return <>
    <button onClick={()=>setCvindex(c => (cvindex - 1) % canvases.length)}>Prev Canvas</button>
    <button onClick={() => setCvindex(c => (cvindex + 1) % canvases.length)}>Next Canvas</button>
    <button disabled={!canZoomIn} onClick={() => (document?.querySelector("canvas-panel,sequence-panel") as any).zoomIn()}>Zoom In</button> 
    <button disabled={!canZoomOut} onClick={() => (document?.querySelector("canvas-panel,sequence-panel") as any).zoomOut()}>Zoom Out</button>

    { canvases[Math.abs(cvindex)] }
    {/* @ts-ignore */}
    <canvas-panel manifest-id={manifestUrl} skip-sizes='true' canvas-id={canvases[Math.abs(cvindex)]  } />
  </>

}

