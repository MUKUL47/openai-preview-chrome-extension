import { useState, useEffect, useRef } from "react";
import axios, { CancelTokenSource } from "axios";

type UseCancelableRequest = [CancelTokenSource | undefined];
function useAxiosCancelableRequest(): UseCancelableRequest {
  const cancelTokenSource = useRef<CancelTokenSource>(
    axios.CancelToken.source()
  );
  useEffect(() => {
    return () => {
      cancelTokenSource?.current?.cancel?.();
    };
  }, []);

  return [cancelTokenSource?.current];
}

export default useAxiosCancelableRequest;
