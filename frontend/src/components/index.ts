// Global component barrel for app-wide imports.
// Usage: import { Button, Navbar, LandingPage } from "@/components";

// UI
export { Button } from "@/components/ui/button";
export { Input } from "@/components/ui/input";
export { Slider } from "@/components/ui/slider";

// Site
export { Navbar } from "@/components/site/Navbar";
export { Footer } from "@/components/site/Footer";
export { AuroraBackground } from "@/components/site/Background";
export { AnimatedCounter } from "@/components/site/AnimatedCounter";
export { LeadModal } from "@/components/site/LeadModal";

// Layout / providers
export { RootDocumentShell } from "@/components/layout/RootDocumentShell";
export { RouteErrorState, RouteNotFound } from "@/components/layout/RouteFallbacks";
export { AppProviders } from "@/components/providers/AppProviders";

// Feature pages
export { LandingPage } from "@/components/features/home/LandingPage";
export { AuditPage } from "@/components/features/audit/AuditPage";
export { ResultsPage } from "@/components/features/results/ResultsPage";
