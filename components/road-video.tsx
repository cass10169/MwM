"use client";
import { useEffect, useRef, useState } from "react";

export function RoadVideo({ src, poster, title, width, height, transcript, captions, mutedPreview = false }: { src:string;poster:string;title:string;width:number;height:number;transcript:string;captions?:string;mutedPreview?:boolean }) {
  const holder = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  useEffect(()=>{
    if(!holder.current) return;
    const observer = new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){setNear(true);observer.disconnect();}},{rootMargin:"300px"});
    observer.observe(holder.current);
    return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    if(!near || !mutedPreview || !video.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element=video.current;
    const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting) void element.play().catch(()=>{});else element.pause();},{threshold:.5});
    observer.observe(element);
    return ()=>observer.disconnect();
  },[near,mutedPreview]);
  return <figure ref={holder} className="road-video">
    <video ref={video} src={near ? src : undefined} poster={poster} width={width} height={height} controls muted playsInline preload="none" aria-label={title}>
      {captions && <track kind="captions" src={captions} srcLang="en" label="English" default/>}
      Your browser does not support inline video.
    </video>
    <figcaption>{title}</figcaption>
    <details><summary>Video description and transcript</summary><p>{transcript}</p></details>
  </figure>;
}
