import { useState } from "react";

const defaultImage =
  "https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=400";

const LazyImage = ({ src, alt, className = "" }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      loading="lazy"
      decoding="async"
      src={src || defaultImage}
      alt={alt}
      onLoad={() => setLoaded(true)}
      onError={(e) => (e.target.src = defaultImage)}
      className={`w-full h-full object-cover transition-opacity duration-700 ${className} ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
};

export default LazyImage;