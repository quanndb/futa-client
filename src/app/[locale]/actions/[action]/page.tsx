// app/action/[action]/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { authStorage } from "@/lib/utils/authUtils";
import accountAPI from "@/services/API/accountAPI";
import authAPI from "@/services/API/authAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon, Home, LockIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

export enum Action {
  MAC_VERIFICATION = "mac-verification",
  SET_PASSWORD = "set-password",
}

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function ActionPage({
  params,
}: {
  params: Promise<{ action: string }>;
}) {
  const { action } = use(params);
  const searchParams = useSearchParams();
  const t = useTranslations("common");
  const token = searchParams.get("token");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log(action === Action.MAC_VERIFICATION && token);
    if (action === Action.MAC_VERIFICATION && token) {
      authStorage.saveTokens(token, "");
      authAPI
        .macVerify()
        .then(() => {
          toast.success(t("actionSuccess"));
          setSuccess(true);
        })
        .catch(() => {
          toast.error(t("actionFailed"));
          router.replace("/");
        })
        .finally(() => {
          authStorage.clearTokens();
        });
    } else if (action === Action.SET_PASSWORD && token) {
      authStorage.saveTokens(token, "");
    } else {
      notFound();
    }
  }, [action, token, t, router]);

  return (
    <Card className="layout w-full my-20">
      {success && <SuccessAction t={t} />}
      {!success && action === Action.SET_PASSWORD && (
        <ResetPassword successFn={() => setSuccess(true)} />
      )}
    </Card>
  );
}

const SuccessAction = ({ t }: { t: (key: string) => string }) => {
  return (
    <div>
      <div className="flex justify-center">
        <Image
          src="/assets/images/success.png"
          alt="success"
          width={400}
          height={400}
        />
      </div>
      <div className="flex justify-center mt-5">
        <h1 className="text-4xl text-primary text-center font-bold mb-5">
          {t("actionSuccess")}
        </h1>
      </div>
      <div className="flex justify-center">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2" />
            {t("backHome")}
          </Link>
        </Button>
      </div>
    </div>
  );
};

const ResetPassword = ({ successFn }: { successFn: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const t = useTranslations();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: (password: string) => accountAPI.setPassword(password),
    onSuccess: () => {
      toast.success(t("success"));
      authStorage.clearTokens();
      form.reset();
      successFn();
    },
    onError: () => {
      toast.error(t("failed"));
      router.replace("/");
    },
  });

  const handleSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    mutate(values.password);
  };

  return (
    <div className="w-full md:max-w-[500px] mx-auto">
      <h1 className="text-4xl text-primary text-center font-bold mb-5">
        {t("setPassword")}
      </h1>
      <p className="my-5">{t("setPasswordDes")}</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
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
          <SubmitButton>{t("submit")}</SubmitButton>
        </form>
      </Form>
    </div>
  );
};
