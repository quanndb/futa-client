"use client";
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
import { createUserSchema } from "@/lib/schemas/user";
import accountAPI from "@/services/API/accountAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  Phone,
  UserIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

export default function RegisterTab() {
  const [showPassword, setShowPassword] = useState(false);

  const t = useTranslations();

  const userSchema = createUserSchema(t);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
    },
  });

  const { mutate: register } = useMutation({
    mutationFn: (values: z.infer<typeof userSchema>) => {
      return accountAPI.register(values);
    },
    onSuccess: () => {
      form.reset();
      toast.success(t("registerSuccess"));
    },
  });

  const handleSubmit = (values: z.infer<typeof userSchema>) => {
    register(values);
  };

  return (
    <div className="mt-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder={t("enterEmail")}
                      className="pl-10 py-6 bg-gray-50 border border-gray-200 rounded-md"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mt-4">{t("password")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("enterPassword")}
                      className="pl-10 py-6 bg-gray-50 border border-gray-200 rounded-md"
                      {...field}
                    />
                    {showPassword ? (
                      <EyeOffIcon
                        className="absolute right-3 top-3 h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <EyeIcon
                        className="absolute right-3 top-3 h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={() => setShowPassword(true)}
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
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mt-5">{t("fullName")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="fullName"
                      placeholder={t("enterFullname")}
                      className="pl-10 py-6 bg-gray-50 border border-gray-200 rounded-md"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mt-5">{t("phoneNumber")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="fullName"
                      placeholder={t("enterPhonenumber")}
                      className="pl-10 py-6 bg-gray-50 border border-gray-200 rounded-md"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton>{t("signUp")}</SubmitButton>
        </form>
      </Form>
    </div>
  );
}
