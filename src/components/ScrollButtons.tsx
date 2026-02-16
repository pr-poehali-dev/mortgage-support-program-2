import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const ScrollButtons = () => {
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      setShowUp(scrollTop > 300);
      setShowDown(scrollTop + clientHeight < scrollHeight - 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  if (!showUp && !showDown) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-1.5">
      {showUp && (
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-foreground/70 text-background shadow-md backdrop-blur-sm flex items-center justify-center hover:bg-foreground/90 transition-all duration-300 animate-fade-in"
          aria-label="Наверх"
        >
          <Icon name="ChevronUp" size={20} />
        </button>
      )}
      {showDown && (
        <button
          onClick={scrollToBottom}
          className="w-10 h-10 rounded-full bg-foreground/70 text-background shadow-md backdrop-blur-sm flex items-center justify-center hover:bg-foreground/90 transition-all duration-300 animate-fade-in"
          aria-label="Вниз"
        >
          <Icon name="ChevronDown" size={20} />
        </button>
      )}
    </div>
  );
};

export default ScrollButtons;
