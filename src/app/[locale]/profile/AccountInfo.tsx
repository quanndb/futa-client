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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubmitButton from "@/components/ui/submitBtn";
import { createInfoSchema } from "@/lib/schemas/user";
import { UserInfo } from "@/lib/types/UserInfo";
import { avatarEncoder } from "@/lib/utils/LinkConverter";
import accountAPI, { Profile, UpdateProfile } from "@/services/API/accountAPI";
import { useUserInfo } from "@/store/AuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const AccountInfo = () => {
  const t = useTranslations();
  const [file, setFile] = useState<File | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { userInfo, setUserInfo } = useUserInfo();

  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: () => accountAPI.getProfile(),
  });

  const { mutate } = useMutation({
    mutationFn: (file: File) => accountAPI.updateAvatar(file),
    onSuccess: (res) => {
      toast.success(t("success"));
      setUserInfo({
        ...userInfo!,
        avatar: res?.data?.avatarUrl || "",
      });
    },
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setSelectedUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = () => {
    console.log(formRef);
    if (formRef.current) {
      formRef.current.requestSubmit();
      if (file) {
        mutate(file);
      }
    }
  };

  return (
    <div>
      <p className="text-4xl font-semibold">{t("profile.accountInfo.title")}</p>
      <p className="text mt-2">{t("profile.accountInfo.des")}</p>
      <hr className="my-5" />
      {data && (
        <div>
          {/* avatar */}
          <div className="flex gap-5 flex-col items-center">
            <div>
              <Image
                alt="profile"
                src={avatarEncoder(selectedUrl || data.data.avatarUrl || "")}
                width={1000}
                height={1000}
                className="rounded-full w-[200px] h-[200px] object-cover border search-form"
              />
            </div>
            <Button className="max-w-[100px] relative">
              <p>{t("profile.accountInfo.selectImage")}</p>
              <Input
                type="file"
                onChange={handleFile}
                className="opacity-0 absolute"
              />
            </Button>
          </div>
          {/* info */}
          <div>
            <InfoForm defaultValues={data.data} formRef={formRef} />
          </div>
          <SubmitButton onClick={handleSubmit}>
            {t("common.action.save")}
          </SubmitButton>
        </div>
      )}
    </div>
  );
};

const InfoForm = ({
  defaultValues,
  formRef,
}: {
  defaultValues: Profile;
  formRef?: React.RefObject<HTMLFormElement | null>;
}) => {
  const t = useTranslations();
  const infoSchema = createInfoSchema(t);
  const form = useForm<z.infer<typeof infoSchema>>({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      email: defaultValues.email,
      fullName: defaultValues.fullName || "",
      phoneNumber: defaultValues.phoneNumber || "",
      gender: defaultValues.gender,
    },
  });

  const { userInfo, setUserInfo } = useUserInfo();

  useEffect(() => {
    form.reset({
      email: defaultValues.email,
      fullName: defaultValues.fullName || "",
      phoneNumber: defaultValues.phoneNumber || "",
      gender: defaultValues.gender,
    });
  }, [defaultValues, form]);

  const { mutate } = useMutation({
    mutationFn: (values: z.infer<typeof infoSchema>) =>
      accountAPI.updateProfile(values as UpdateProfile),
    onSuccess: (res) => {
      console.log(res);
      setUserInfo({
        ...userInfo,
        full_name: res.data?.fullName || "",
        avatar: res.data?.avatarUrl || "",
      } as UserInfo);
      toast.success(t("success"));
    },
  });

  const onSubmit = (values: z.infer<typeof infoSchema>) => {
    mutate(values);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
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
            disabled
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fullName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("enterFullname")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-5 flex-col md:flex-row">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("gender")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString() || undefined}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("enterGender")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">{t("male")}</SelectItem>
                        <SelectItem value="FEMALE">{t("female")}</SelectItem>
                        <SelectItem value="OTHER">{t("other")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("phoneNumber")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enterPhonenumber")}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AccountInfo;
