import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/iris/ContactForm";

export const Route = createFileRoute("/reserve")({
  head: () => ({
    meta: [
      { title: "Reserve Access — Iris by Tesla" },
      { name: "description", content: "Reserve early access to Iris, Tesla's AI receptionist." },
    ],
  }),
  component: ReservePage,
});

function ReservePage() {
  return (
    <ContactForm
      eyebrow="Reserve Access"
      title="Get Iris first."
      subtitle="Join the early access list. We'll reach out with onboarding details for your team."
      submitLabel="Reserve Access"
    />
  );
}
