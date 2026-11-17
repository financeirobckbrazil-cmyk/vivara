import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { toast } from "sonner";

export const Route = createFileRoute("/contato")({
  head: () => ({ meta: [{ title: "Contato — Life Pandora" }] }),
  component: ContatoPage,
});

function ContatoPage() {
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada! Retornaremos em breve.");
    setForm({ nome: "", email: "", mensagem: "" });
  };

  return (
    <SiteLayout>
      <section className="max-w-xl mx-auto px-4 py-10">
        <h1 className="font-serif text-4xl text-brand text-center mb-3">Contato</h1>
        <p className="text-center text-muted-foreground mb-8 text-sm">
          Fale com nossa equipe — atendimento de seg a sex, 9h às 18h.
        </p>

        <form onSubmit={submit} className="space-y-4 bg-card border border-border rounded-sm p-6">
          <div>
            <label className="block text-sm text-brand mb-1.5">Nome</label>
            <input
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full border border-input bg-background rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm text-brand mb-1.5">E-mail</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-input bg-background rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm text-brand mb-1.5">Mensagem</label>
            <textarea
              required
              rows={5}
              value={form.mensagem}
              onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
              className="w-full border border-input bg-background rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3.5 text-sm tracking-[0.2em] uppercase font-medium rounded-sm hover:opacity-90"
          >
            Enviar mensagem
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground space-y-1">
          <p>Atendimento Life Pandora</p>
          <p>0800 000 0000</p>
        </div>
      </section>
    </SiteLayout>
  );
}
