"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authStorage } from "@/lib/utils/authUtils";
import { useUserInfo } from "@/store/AuthStore";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const LogoutModal = ({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const { setUserInfo } = useUserInfo();

  const handleLogout = () => {
    authStorage.clearTokens();
    onOpenChange?.(false);
    setUserInfo(null);
    router.push("/login");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("profile.logoutDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("profile.logoutDialog.message")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleLogout}>{t("common.action.yes")}</Button>
          <Button onClick={() => onOpenChange?.(false)} variant={"outline"}>
            {t("common.action.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;
