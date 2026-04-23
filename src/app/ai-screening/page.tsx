import AIScreeningPage from "@/screens/AIScreeningPage";
import { Suspense } from "react";

export default function Page() {
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <AIScreeningPage />
    </Suspense>
  );
}
