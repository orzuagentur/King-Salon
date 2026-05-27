"use client";

import { useState } from "react";

import { AiChatLauncher } from "@/components/ai/AiChatLauncher";
import { FloatingContactActions } from "@/components/layout/FloatingContactActions";

type MobileActionDockProps = {
  phone: string;
  whatsappUrl: string;
};

export function MobileActionDock({ phone, whatsappUrl }: MobileActionDockProps) {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <AiChatLauncher contactDockOpen={contactOpen} />
      <FloatingContactActions
        onOpenChange={setContactOpen}
        open={contactOpen}
        phone={phone}
        whatsappUrl={whatsappUrl}
      />
    </>
  );
}
