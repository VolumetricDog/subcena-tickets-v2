"use client";

import EventList from "@/components/EventList";

// import { useEffect } from "react";

function page() {
  // useEffect(() => {
  //   // Disable scrolling on mount
  //   document.body.style.overflow = "hidden";
  //   document.documentElement.style.overflow = "hidden";

  //   // Clean up to enable scrolling when the component unmounts
  //   return () => {
  //     document.body.style.overflow = "";
  //     document.documentElement.style.overflow = "";
  //   };
  // }, []);

  return (
    <div
      className="w-screen h-screen"
      style={{
        marginTop: "-83px",
        transform: "scaleY(1.02)",
        transformOrigin: "top",
      }}
    >
      <EventList />
    </div>
  );
}

export default page;
