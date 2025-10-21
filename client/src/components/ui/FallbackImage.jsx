import React from 'react';

// Reusable image with fallback logic
export default function FallbackImage({ srcList = [], alt = '', className = '', style = {}, placeholder = 'https://placehold.co/800x400/1f2937/ffffff?text=Image+Unavailable', loading = 'lazy', ...rest }) {
  const srcs = (Array.isArray(srcList) ? srcList.filter(Boolean) : []).slice();
  const src = srcs.length ? srcs[0] : placeholder;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder; }}
      {...rest}
    />
  );
}
