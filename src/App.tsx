import { Routes, Route } from "react-router-dom";

// --- PAGES ---
import Home from "@/pages/Home";
import Engine from "./pages/Engine";

// --- COMPONENTS ---
import { PageLayout } from "@/components/Dna/Layouts/PageLayout";
import { DiagnosisLayout } from "@/components/Dna/Layouts/DiagnosisLayout";
import Proforma from "./pages/Proforma";


export default function App() {
  return (
    <Routes>
      {/* --- IDENTITY PAGES (Render w the lenis scroll w 3d bg canvas wrappeed) --- */}

      {/* --- CONVERSION PAGES (Render w the lenis scroll no bg) --- */}
      <Route path="/Proforma" element={<DiagnosisLayout><Proforma /></DiagnosisLayout>} />
      <Route path="/" element={<DiagnosisLayout><Home /></DiagnosisLayout >} />
      <Route path="/live" element={<DiagnosisLayout><Engine /></DiagnosisLayout>} />


      {/* --- UNUSED PAGES --- */}

    </Routes>
  );
}