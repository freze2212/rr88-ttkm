import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const useFingerprint = () => {
  const [fingerprint, setFingerprint] = useState(null);

  useEffect(() => {
    const loadFingerprint = async () => {
      try {
        // Load FingerprintJS trong nền (không chặn UI)
        const fpPromise = FingerprintJS.load();

        // Chờ lấy fingerprint nhưng không ảnh hưởng render
        fpPromise.then(async (fp) => {
          const result = await fp.get();
          setFingerprint(result.visitorId);
          sessionStorage.setItem("fp", result.visitorId);
        });
      } catch (error) {
        console.error("Lỗi khi lấy Fingerprint:", error);
      }
    };

    loadFingerprint();
  }, []);

  return fingerprint;
};

export default useFingerprint;
