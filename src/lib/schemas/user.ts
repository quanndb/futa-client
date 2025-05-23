// schemas/userSchema.ts
import { Gender } from "@/services/API/accountAPI";
import { z } from "zod";

export const createEmailSchema = (t: (key: string) => string) => {
  return z
    .string()
    .min(5, { message: t("validations.emailAtLeast") })
    .max(50, { message: t("validations.emailAtMost") })
    .email({ message: t("validations.emailNotValid") })
    .refine((val) => (val.match(/@/g) || []).length === 1, {
      message: t("validations.notContainA"),
    });
};

export const createPasswordSchema = (t: (key: string) => string) => {
  return z.string().min(8, { message: t("validations.passwordAtLeast") });
};

export const createLoginSchema = (t: (key: string) => string) => {
  return z.object({
    email: createEmailSchema(t),
    password: createPasswordSchema(t),
  });
};

export const createUserSchema = (t: (key: string) => string) => {
  return z.object({
    email: createEmailSchema(t),
    fullName: z.string().min(1, { message: t("validations.fieldRequired") }),
    phoneNumber: z.string().min(1, { message: t("validations.fieldRequired") }),
    password: createPasswordSchema(t),
  });
};

export const createInfoSchema = (t: (key: string) => string) => {
  return z.object({
    email: createEmailSchema(t),
    fullName: z.string().min(1, { message: t("validations.fieldRequired") }),
    phoneNumber: z.string().min(1, { message: t("validations.fieldRequired") }),
    gender: z.nativeEnum(Gender).optional().nullable(),
  });
};

export const baseCustomerSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
});

export type CustomerFormValues = z.infer<typeof baseCustomerSchema>;

export const createCustomerSchema = (t: (key: string) => string) => {
  return baseCustomerSchema.extend({
    fullName: z.string().min(1, { message: t("validations.fieldRequired") }),
    email: createEmailSchema(t),
    phone: z.string().min(10, { message: t("validations.phoneNumberAtLeast") }),
  });
};

export const createChangePasswordSchema = (t: (key: string) => string) => {
  return z.object({
    oldPassword: createPasswordSchema(t),
    newPassword: createPasswordSchema(t),
  });
};

export const createAmountSchema = (t: (key: string) => string) => {
  return z.coerce
    .number()
    .min(10000, { message: t("validations.amountAtLeast") });
};

export const createWithdrawSchema = (t: (key: string) => string) => {
  return z.object({
    bankCode: z.string().min(1, { message: t("validations.bankcodeRequired") }),
    accountNumber: z
      .string()
      .min(1, { message: t("validations.accountNumberRequired") }),
    receiverName: z
      .string()
      .min(1, { message: t("validations.receiverRequired") }),
    amount: createAmountSchema(t),
  });
};
