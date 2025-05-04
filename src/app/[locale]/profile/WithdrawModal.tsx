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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { banks } from "@/lib/consts/banks";
import walletAPI from "@/services/API/walletAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const withdrawSchema = z.object({
  bankCode: z.string().min(1, { message: "Bank code is required" }),
  accountNumber: z.string().min(1, { message: "Account number is required" }),
  receiverName: z.string().min(1, { message: "Receiver name is required" }),
  amount: z.coerce
    .number()
    .min(10000, { message: "Amount must be at least 10.000 VND" }),
});

export default function WithdrawModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const form = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      bankCode: "",
      accountNumber: "",
      receiverName: "",
      amount: 10000,
    },
  });
  const ref = useRef<HTMLFormElement>(null);
  const t = useTranslations();

  const { mutate: createWithdraw } = useMutation({
    mutationFn: (data: z.infer<typeof withdrawSchema>) => {
      return walletAPI.withdraw({
        bankCode: data.bankCode,
        accountNumber: data.accountNumber,
        receiverName: data.receiverName,
        amount: data.amount,
      });
    },
    onSuccess: () => {
      form.reset();
      onClose();
      toast.success(t("success"));
    },
  });

  const handleSubmit = (values: z.infer<typeof withdrawSchema>) => {
    createWithdraw(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("withdrawModal.title")}</DialogTitle>
          <DialogDescription>{t("withdrawModal.des")}</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              ref={ref}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="bankCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("withdrawModal.bank")}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("withdrawModal.enterBank")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("withdrawModal.accountNumber")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("withdrawModal.enterAccountNumber")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receiverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("withdrawModal.receiver")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("withdrawModal.enterReceiver")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("withdrawModal.amount")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder={t("withdrawModal.enterAmount")}
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
