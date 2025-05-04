import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      onClick={onClick}
      className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white rounded-md mt-5"
    >
      {pending ? "Loading..." : children}
    </Button>
  );
}
