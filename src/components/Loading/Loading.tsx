import "./Loading.css";
import { useRef, useEffect } from "react";

function Loading() {
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      let currentWidth = 0;
      if (loadingRef.current) {
        currentWidth = parseInt(
          loadingRef.current.style.getPropertyValue("--progress-width") || "0",
          10
        );
      }

      currentWidth += 3;
      if (currentWidth > 100 && currentWidth) currentWidth = 0;

      // Update the CSS variable and data attribute
      loadingRef.current!.style.setProperty(
        "--progress-width",
        `${currentWidth}%`
      );
      loadingRef.current!.setAttribute("data-progress", `${currentWidth}%`);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="loading">
      <div className="logo">
        <div>
          <span className="style-logo" style={{ fontWeight: "bold" }}>
            Loading
          </span>
          <span style={{ color: "white" }}>...</span>
        </div>
      </div>
      <div
        ref={loadingRef}
        className="progress-bar"
        data-progress="0%"
        data-label="Loading..."
      ></div>
    </div>
  );
}

export default Loading;
