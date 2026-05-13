import { useEffect, useState } from "react";
import { getLatestStoredShareId, REPORTS_UPDATED_EVENT } from "@/lib/audit-local-storage";
import { SAMPLE_SHARE_ID } from "@/lib/sample-audit";

/** Same resolution as `/results` route: latest saved audit on this device, else built-in sample. */
export function useDefaultResultsShareId() {
  const [shareId, setShareId] = useState(() =>
    typeof window !== "undefined" ? getLatestStoredShareId() ?? SAMPLE_SHARE_ID : SAMPLE_SHARE_ID
  );

  useEffect(() => {
    const sync = () => {
      setShareId(getLatestStoredShareId() ?? SAMPLE_SHARE_ID);
    };
    sync();
    window.addEventListener(REPORTS_UPDATED_EVENT, sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener(REPORTS_UPDATED_EVENT, sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const isSample = shareId === SAMPLE_SHARE_ID;
  return { shareId, isSample };
}
