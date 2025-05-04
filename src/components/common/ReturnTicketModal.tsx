"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import bookingAPI from "@/services/API/bookingAPI";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

const ReturnTicketModal = ({
  open,
  onOpenChange,
  refetch,
}: {
  open: string;
  onOpenChange?: (open: string) => void;
  refetch?: () => void;
}) => {
  const t = useTranslations();

  const { mutate: returnTicket } = useMutation({
    mutationFn: (code: string) => bookingAPI.returnTicket(code),
    onSuccess: () => {
      toast.success(t("success"));
      refetch?.();
      onOpenChange?.("");
    },
  });

  const handleReturnTicket = () => {
    returnTicket(open);
  };

  return (
    <Dialog open={!!open} onOpenChange={() => onOpenChange?.("")}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("returnModal.title")}</DialogTitle>
          <DialogDescription>{t("returnModal.des")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleReturnTicket}>{t("common.action.yes")}</Button>
          <Button onClick={() => onOpenChange?.("")} variant={"outline"}>
            {t("common.action.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnTicketModal;
