"use client";

import LoginTab from "@/app/[locale]/login/LoginTab";
import RegisterTab from "@/app/[locale]/login/RegisterTab";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { authStorage } from "@/lib/utils/authUtils";
import accountAPI from "@/services/API/accountAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const emailValidation = z
  .string()
  .min(5, { message: "Email must be at least 5 characters" })
  .max(50, { message: "Email must be less than 50 characters" })
  .email({ message: "Please enter a valid email address" })
  .refine((val) => (val.match(/@/g) || []).length === 1, {
    message: "Email must contain only one '@' character",
  });

const forgotPasswordSchema = z.object({
  email: emailValidation,
});

const LoginForm = () => {
  const t = useTranslations();
  const router = useRouter();
  const [isOpenForgotPassword, setIsOpenForgotPassword] = useState(false);

  useEffect(() => {
    if (authStorage.getAccessToken()) {
      router.push("/");
    }
  }, [router]);

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-md p-8 mx-auto mb-10 search-form mt-10"
      )}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 pr-4 pb-8 md:pb-0">
          <h1 className="text-2xl font-bold text-green-800 mb-1">
            PHƯƠNG TRANG
          </h1>
          <p className="text-orange-500 font-medium mb-8">{t("slogan")}</p>

          <div className="mt-8">
            <Image
              src={"/assets/images/TVC.svg"}
              width={600}
              alt=""
              height={400}
            />
          </div>
        </div>

        <div className="md:w-1/2 pl-0 md:pl-4">
          <h2 className="text-lg font-medium text-gray-800 mb-6">
            Sign in account
          </h2>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="w-full bg-transparent border-none space-x-12 justify-start p-0">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:text-orange-500 pb-4 text-base font-medium rounded-none"
              >
                {t("signIn")}
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:text-orange-500 pb-4 text-base font-medium rounded-none"
              >
                {t("signUp")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 mt-4">
              <LoginTab />
              {/* forgot password */}
              <div className="text-start mt-4">
                <Button
                  variant={"link"}
                  className="text-orange-500 text-sm font-medium"
                  onClick={() => setIsOpenForgotPassword(true)}
                >
                  {t("forgotPassword")}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <RegisterTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ForgotPasswordModal
        open={isOpenForgotPassword}
        onOpenChange={setIsOpenForgotPassword}
      />
    </div>
  );
};

const ForgotPasswordModal = ({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: (data: z.infer<typeof forgotPasswordSchema>) => {
      return accountAPI.forgotPassword(data.email);
    },
    onSuccess: () => {
      toast.success(t("success"));
      form.reset();
      onOpenChange?.(false);
    },
  });

  const submitForm = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const handleForgotPassword = (data: z.infer<typeof forgotPasswordSchema>) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("forgotPasswordTitle")}</DialogTitle>
          <DialogDescription>{t("pleaseEnterEmail")}</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleForgotPassword)}
              ref={formRef}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button onClick={submitForm}>{t("common.action.completed")}</Button>
          <Button onClick={() => onOpenChange?.(false)} variant={"outline"}>
            {t("common.action.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginForm;
