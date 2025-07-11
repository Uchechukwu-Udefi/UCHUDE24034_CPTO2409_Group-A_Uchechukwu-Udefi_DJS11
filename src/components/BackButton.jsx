import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollPositions = useRef({});

  // Save scroll position before navigating away
  useEffect(() => {
    const saveScrollPosition = () => {
      scrollPositions.current[location.key] = window.scrollY;
    };

    window.addEventListener("beforeunload", saveScrollPosition);

    // Copy the ref value to a local variable
    const scrollPositionsSnapshot = { ...scrollPositions.current };

    return () => {
      saveScrollPosition(); // Save on cleanup as well
      window.removeEventListener("beforeunload", saveScrollPosition);

      const savedScroll = scrollPositionsSnapshot[location.key];
      if (savedScroll !== undefined) {
        window.scrollTo(0, savedScroll);
      }
    };
  }, [location]);

  const handleBackClick = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={handleBackClick} className="back-button">
      <IoIosArrowBack />
    </button>
  );
}
