import { twMerge } from "tailwind-merge";
import type { DefaultCustomProps } from "../../lib/constants";
import Card from "./Card";

export interface ModalProps extends DefaultCustomProps {
  close?: () => void;
}

export default function Modal({ children, className, close }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity  p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm duration-300 fade-in"
        onClick={close}
      />
      <Card
        className={twMerge("fade-in-upwards delay-200 shadow-lg", className)}
      >
        {children}
      </Card>
    </div>
  );
}
