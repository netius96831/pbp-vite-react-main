import { useEffect, useState } from "react";

function LoadingDots ({showDots}: {showDots: boolean}) {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    if (showDots) {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots + 1) % 5);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [showDots]);

  return <>
    {'.'.repeat(dots)}
  </>
}

export default LoadingDots;