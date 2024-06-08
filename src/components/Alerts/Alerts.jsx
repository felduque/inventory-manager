import React, { useRef } from "react";

const useToast = () => {
  const toastRef = useRef(null);

  const showToast = (severity, summary, detail) => {
    if(!toastRef.current) return;
    toastRef.current.show({ severity, summary, detail });
  };

  return { showToast, toastRef };
};

export default useToast;