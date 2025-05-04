"use client";

import { Button } from "@/components/ui/button";
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
import { authStorage, JwtDecoder } from "@/lib/utils/authUtils";
import authAPI from "@/services/API/authAPI";
import { useUserInfo } from "@/store/AuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

const loginSchema = z.object({
  email: emailValidation,
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const LoginTab = () => {
  const router = useRouter();
  const t = useTranslations();
  const [showPassword, setShowPassword] = useState(false);
  const { setUserInfo } = useUserInfo();
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmitLogin = (data: z.infer<typeof loginSchema>) => {
    mutateLogin(data);
  };

  const { mutate: mutateLogin } = useMutation({
    mutationFn: (data: z.infer<typeof loginSchema>) => {
      return authAPI.login(data);
    },
    onSuccess: (res) => {
      authStorage.saveTokens(res.data.accessToken, res.data.refreshToken);
      toast.success(t("loginSuccess"));
      setUserInfo(JwtDecoder.getUserInfo());
      router.push("/");
    },
  });

  const { mutate: loginWithGoogle } = useMutation({
    mutationKey: ["Login with google auth-code"],
    mutationFn: (code: string) => authAPI.loginWithGoogle(code),
    onSuccess: (res) => {
      authStorage.saveTokens(res.data.accessToken, res.data.refreshToken);
      toast.success(t("loginSuccess"));
      setUserInfo(JwtDecoder.getUserInfo());
      router.push("/");
    },
  });

  const handleLoginWithGoogle = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (response) => {
      loginWithGoogle(response.code);
    },
  });

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitLogin)}
          className="space-y-4"
        >
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
                <FormLabel>Password</FormLabel>
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
                        onClick={togglePasswordVisibility}
                      />
                    ) : (
                      <EyeIcon
                        className="absolute right-3 top-3 h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton>{t("login")}</SubmitButton>
        </form>
      </Form>
      <Button
        className="w-full py-6 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md mt-3"
        onClick={handleLoginWithGoogle}
      >
        {t("loginWithGoogle")}
        <Image
          src="/assets/images/google.png"
          width={30}
          height={30}
          alt="google"
        />
      </Button>
    </div>
  );
};

export default LoginTab;
