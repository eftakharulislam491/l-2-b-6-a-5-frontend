"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendContactMessage } from "@/services/contact/sendContactMessage";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) {
      return;
    }

    if (state.success) {
      toast.success(state.message);
      formRef.current?.reset();
      return;
    }

    toast.error(state.message);
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="mt-8 grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="form-field">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            minLength={2}
            disabled={isPending}
          />
        </div>
        <div className="form-field">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="Your phone number"
            required
            minLength={6}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="form-field">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          disabled={isPending}
        />
      </div>

      <div className="form-field">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          name="message"
          rows={6}
          placeholder="Tell us about the materials, quantity, or support you need"
          required
          minLength={10}
          disabled={isPending}
          className="min-h-36 rounded-lg border border-input bg-background px-3 py-3 text-sm text-foreground shadow-xs transition outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full sm:w-fit"
        disabled={isPending}
      >
        <Send className="h-4 w-4" />
        {isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
