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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {showUp && (
        <button
          onClick={scrollToTop}
          className="w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-all duration-300 animate-fade-in"
          aria-label="Наверх"
        >
          <Icon name="ChevronUp" size={22} />
        </button>
      )}
      {showDown && (
        <button
          onClick={scrollToBottom}
          className="w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-all duration-300 animate-fade-in"
          aria-label="Вниз"
        >
          <Icon name="ChevronDown" size={22} />
        </button>
      )}
    </div>
  );
};

export default ScrollButtons;
