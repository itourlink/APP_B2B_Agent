import React, { type JSX } from "react";
import { MainLayout } from "./main-layout";
import AuthLayout from "./auth-layout";
import { InfoLayout } from "./info-layout";
import OverlayLayout from "./overlay-layout";

interface Props {
  type: string;
  children: React.ReactNode;
}

export const LAYOUT = {
  AUTH: "AUTH-LAYOUT",
  MAIN: "MAIN-LAYOUT",
  INFO: "INFO-LAYOUT",
  OVERLAY: "OVERLAY-LAYOUT",
};

const InitLayout = ({ type, children }: Props) => {

  const layoutMap: Record<string, JSX.Element> = {
    [LAYOUT.AUTH]: <AuthLayout>{children}</AuthLayout>,
    [LAYOUT.MAIN]: <MainLayout>{children}</MainLayout>,
    [LAYOUT.INFO]: <InfoLayout>{children}</InfoLayout>,
    [LAYOUT.OVERLAY]: <OverlayLayout>{children}</OverlayLayout>,
  };
  return <div className=" h-full">{layoutMap[type]}</div>;
};

export default InitLayout;
