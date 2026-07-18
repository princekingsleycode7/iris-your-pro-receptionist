import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/iris/ContactForm";

export const Route = createFileRoute("/sales")({
  head: () => ({
    meta: [
      { title: "Contact Sales — Iris by Tesla" },
      { name: "description", content: "Talk to the Iris enterprise sales team." },
    ],
  }),
  component: SalesPage,
});

function SalesPage() {
  return (
    <ContactForm
      eyebrow="Enterprise Sales"
      title="Let's talk scale."
      subtitle="Tell us about your organization and we'll design a pilot tailored to your call volume."
      submitLabel="Contact Sales"
    />
  );
}
