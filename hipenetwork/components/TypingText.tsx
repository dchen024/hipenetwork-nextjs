import React, { useState, useEffect } from "react";

interface TypingTextProps {
  text?: string;
  className?: string;
}

function TypingText({
  text = "",
  className = "text-neutral-900 dark:text-white",
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 10);

    return () => clearInterval(typingInterval);
  }, [text]);

  return <p className={`text-base ${className}`}>{displayedText}</p>;
}

export default TypingText;
