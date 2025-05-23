import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import walletAPI from "@/services/API/walletAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const depositSchema = z.object({
  amount: z.coerce
    .number()
    .min(10000, { message: "Amount must be at least 10.000 VND" }),
});

export default function DepositModal({
  isOpen,
  onClose,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}) {
  const form = useForm<z.infer<typeof depositSchema>>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 10000,
    },
  });
  const ref = useRef<HTMLFormElement>(null);
  const t = useTranslations();

  const { mutate: createDeposit } = useMutation({
    mutationFn: (data: z.infer<typeof depositSchema>) => {
      return walletAPI.deposit({
        amount: data.amount,
      });
    },
    onSuccess: (res) => {
      if (res?.data?.paymentLink) {
        window.open(res.data.paymentLink, "_blank");
      }
      form.reset();
      onClose();
      toast.success(t("success"));
      refetch();
    },
  });

  const handleSubmit = (values: z.infer<typeof depositSchema>) => {
    createDeposit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("depositModal.title")}</DialogTitle>
          <DialogDescription>{t("depositModal.des")}</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} ref={ref}>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("depositModal.amount")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder={t("depositModal.enterAmount")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={onClose}
            className="cursor-pointer"
          >
            {t("common.action.cancel")}
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(handleSubmit)}
            className="cursor-pointer"
          >
            {t("common.action.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
