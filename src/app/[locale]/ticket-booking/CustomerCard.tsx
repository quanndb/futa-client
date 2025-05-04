import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBooking } from "@/store/BookingStore";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

const emailValidation = z
  .string()
  .min(5, { message: "Email must be at least 5 characters" })
  .max(50, { message: "Email must be less than 50 characters" })
  .email({ message: "Please enter a valid email address" })
  .refine((val) => (val.match(/@/g) || []).length === 1, {
    message: "Email must contain only one '@' character",
  });
export const customerSchema = z.object({
  fullName: z.string().min(1),
  email: emailValidation,
  phone: z.string().min(10),
});
const CustomerCard = ({
  form,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof customerSchema>>>;
}) => {
  const t = useTranslations();
  const { setUserInfo } = useBooking();
  const onSubmit = (values: z.infer<typeof customerSchema>) => {
    setUserInfo(values);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          {t("book.userInfo")}
        </CardTitle>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-10 px-0 mt-5">
          <div className="">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("book.fullName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("book.enterFullname")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder={t("book.enterEmail")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("book.phone")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("book.enterPhone")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-center text-primary text-2xl mb-5">
              {t("book.termAndPolicy")}
            </p>
            <p className="text-justify mb-3">
              <span className="font-bold text-red-500">(*)</span>{" "}
              {t("book.term1")}
            </p>
            <p className="text-justify">
              <span className="font-bold text-red-500">(*)</span>{" "}
              {t("book.term2")}
            </p>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default CustomerCard;
