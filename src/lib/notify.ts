import { toast } from "sonner";

export const notify = {
  success: (message: string, description?: string) =>
    toast.success(message, { description, duration: 3000 }),

  info: (message: string, description?: string) =>
    toast(message, { description, duration: 3000 }),

  error: (message: string, description?: string) =>
    toast.error(message, {
      description,
      duration: 4000,
      className:
        "!border !border-[hsl(0_80%_85%)] !bg-[hsl(0_85%_96%)] !text-[hsl(0_75%_42%)]",
      descriptionClassName: "!text-[hsl(0_60%_45%)]",
    }),
};
