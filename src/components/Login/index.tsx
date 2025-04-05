"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import authAPI from "@/services/API/authAPI";
import { EyeIcon, EyeOffIcon, MailIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
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

const signupSchema = z.object({
  email: emailValidation,
});

async function loginAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validatedFields = loginSchema.safeParse({ email, password });

    if (!validatedFields.success) {
      return {
        status: "error",
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Invalid form data",
      };
    }

    const response = await authAPI.login(validatedFields.data);
    const data = response.data;

    if (data?.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }

    return { status: "success", message: data.message || "Login successful!" };
  } catch (error: any) {
    return {
      status: "error",
      message:
        error.response?.data?.message || error.message || "Login failed.",
    };
  }
}

export function clearAuthToken() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

async function signupAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;

    const validatedFields = signupSchema.safeParse({ email });

    if (!validatedFields.success) {
      return {
        status: "error",
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Invalid form data",
      };
    }


    // const response = await authAPI.register(validatedFields.data);
    console.log("Signup submission:", validatedFields.data);

    return { status: "success", message: "Signup successful!" };
  } catch (error) {
    return { status: "error", message: "Signup failed. Please try again." };
  }
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white rounded-md mt-6"
    >
      {pending ? "Loading..." : children}
    </Button>
  );
}

const LoginForm = ({ className }: { className?: string }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, loginDispatch] = useFormState(loginAction, {
    status: null,
    errors: {},
  });
  const [signupState, signupDispatch] = useFormState(signupAction, {
    status: null,
    errors: {},
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-md p-8 mx-auto", className)}>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 pr-4 pb-8 md:pb-0">
          <h1 className="text-2xl font-bold text-green-800 mb-1">
            PHƯƠNG TRANG
          </h1>
          <p className="text-orange-500 font-medium mb-8">
            Cùng bạn trên mọi nẻo đường
          </p>

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
                SIGN IN
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:text-orange-500 pb-4 text-base font-medium rounded-none"
              >
                SIGN UP
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 mt-4">
              <form action={loginDispatch} className="space-y-4">
                <div className="relative">
                  <MailIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    className="pl-10 py-6 bg-gray-50 border border-gray-200 rounded-md"
                  />
                  {loginState?.errors?.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {loginState.errors.email[0]}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    className="pl-10 py-6 bg-gray-50 border border-gray-200 rounded-md"
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
                  {loginState?.errors?.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {loginState.errors.password[0]}
                    </p>
                  )}
                </div>

                {loginState?.status === "error" && loginState?.message && (
                  <p className="text-sm text-red-500 mt-1">
                    {loginState.message}
                  </p>
                )}

                {loginState?.status === "success" && (
                  <p className="text-sm text-green-500 mt-1">
                    {loginState.message}
                  </p>
                )}

                {loginState?.status === "error" && loginState?.message && (
                  <p className="text-sm text-red-500 mt-1">
                    {loginState.message}
                  </p>
                )}
                <SubmitButton>Login</SubmitButton>

                <div className="text-start mt-4">
                  <a href="#" className="text-orange-500 text-sm font-medium">
                    Forgot password
                  </a>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form action={signupDispatch} className="space-y-4">
                <div className="relative">
                  <MailIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    className="pl-10 py-6 bg-gray-50 border border-gray-200 rounded-md"
                  />
                  {signupState?.errors?.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {signupState.errors.email[0]}
                    </p>
                  )}
                </div>

                {signupState?.status === "error" && signupState?.message && (
                  <p className="text-sm text-red-500 mt-1">
                    {signupState.message}
                  </p>
                )}

                {signupState?.status === "success" && (
                  <p className="text-sm text-green-500 mt-1">
                    {signupState.message}
                  </p>
                )}

                <SubmitButton>Sign Up</SubmitButton>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
