import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submitBtn";
import accountAPI from "@/services/API/accountAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function ChangePassword() {
  const t = useTranslations();
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });
  const [isVisibleOldPass, setIsVisibleOldPass] = useState(false);
  const [isVisibleNewPass, setIsVisibleNewPass] = useState(false);

  const { mutate } = useMutation({
    mutationFn: (values: z.infer<typeof changePasswordSchema>) =>
      accountAPI.changePassword(values),
    onSuccess: () => {
      toast.success(t("success"));
      form.reset();
    },
  });

  const handleSubmit = (values: z.infer<typeof changePasswordSchema>) => {
    mutate(values);
  };
  return (
    <div>
      <p className="text-4xl font-semibold">{t("profile.changePass.title")}</p>
      <p className="text mt-2">{t("profile.changePass.des")}</p>
      <hr className="my-5" />
      <div className="my-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.changePass.oldPass")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder={t("profile.changePass.enterOldPass")}
                        {...field}
                        type={isVisibleOldPass ? "text" : "password"}
                      />
                      {isVisibleOldPass ? (
                        <EyeOffIcon
                          className="absolute right-3 top-2 h-5 w-5 text-gray-400 cursor-pointer"
                          onClick={() => setIsVisibleOldPass(false)}
                        />
                      ) : (
                        <EyeIcon
                          className="absolute right-3 top-2 h-5 w-5 text-gray-400 cursor-pointer"
                          onClick={() => setIsVisibleOldPass(true)}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.changePass.newPass")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder={t("profile.changePass.enterNewPass")}
                        {...field}
                        type={isVisibleNewPass ? "text" : "password"}
                      />
                      {isVisibleNewPass ? (
                        <EyeOffIcon
                          className="absolute right-3 top-2 h-5 w-5 text-gray-400 cursor-pointer"
                          onClick={() => setIsVisibleNewPass(false)}
                        />
                      ) : (
                        <EyeIcon
                          className="absolute right-3 top-2 h-5 w-5 text-gray-400 cursor-pointer"
                          onClick={() => setIsVisibleNewPass(true)}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton>{t("submit")}</SubmitButton>
          </form>
        </Form>
      </div>
    </div>
  );
}
