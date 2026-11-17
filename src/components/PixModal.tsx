import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { Copy, Loader2, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  qrCode: string | null;
  externalId: string | null;
  amountLabel: string;
  loading: boolean;
  onCheck: (externalId: string) => Promise<{ status: string; redirect_url?: string }>;
  onPaid?: () => void;
};

export function PixModal({ open, onClose, qrCode, externalId, amountLabel, loading, onCheck, onPaid }: Props) {
  const [img, setImg] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!qrCode) {
      setImg(null);
      return;
    }
    QRCode.toDataURL(qrCode, { width: 512, margin: 1 })
      .then(setImg)
      .catch(() => setImg(null));
  }, [qrCode]);

  useEffect(() => {
    if (!open || !externalId) return;
    setPaid(false);

    const tick = async () => {
      try {
        const res = await onCheck(externalId);
        if (res.status === "paid") {
          setPaid(true);
          if (timer.current) clearInterval(timer.current);
          if (res.redirect_url) {
            const target = new URL(res.redirect_url);
            new URLSearchParams(window.location.search).forEach((v, k) => target.searchParams.set(k, v));
            window.location.href = target.toString();
          } else if (onPaid) {
            onPaid();
          }
        }
      } catch {
        /* keep polling */
      }
    };

    timer.current = setInterval(tick, 3000);
    void tick();

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [open, externalId, onCheck, onPaid]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/60">
      <div className="mx-auto w-full max-w-[480px] rounded-t-3xl bg-background p-5 pb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[17px] font-bold">Pagar com Pix</h2>
          <button aria-label="Fechar" onClick={onClose} className="p-1">
            <X className="size-5" />
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground">
            <Loader2 className="size-7 animate-spin" />
            <p className="text-[14px]">Gerando seu Pix...</p>
          </div>
        )}

        {!loading && qrCode && (
          <>
            <p className="text-center text-[14px] text-muted-foreground">
              Valor: <span className="font-bold text-cta">{amountLabel}</span>
            </p>
            <div className="mx-auto my-4 w-[220px] rounded-2xl bg-surface p-3">
              {img ? (
                <img src={img} alt="QR Code Pix para pagamento" className="w-full" />
              ) : (
                <div className="flex h-[194px] items-center justify-center text-[13px] text-muted-foreground">
                  QR indisponível
                </div>
              )}
            </div>

            <p className="break-all rounded-xl bg-surface px-3 py-2 text-[11px] text-muted-foreground">{qrCode}</p>

            <button
              onClick={() => {
                void navigator.clipboard.writeText(qrCode);
                toast.success("Código Pix copiado");
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-cta py-3 text-[15px] font-bold text-background"
            >
              <Copy className="size-4" /> Copiar código Pix
            </button>

            <p className="mt-3 flex items-center justify-center gap-2 text-center text-[13px] text-muted-foreground">
              {paid ? (
                "Pagamento confirmado! Redirecionando..."
              ) : (
                <>
                  <Loader2 className="size-4 animate-spin" /> Aguardando pagamento...
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
