import { cn } from "@udecode/cn";

type ModalContainerProps = {
  close: () => void;
  children?: React.ReactNode;
  blur?: boolean;
};

const ModalContainer = ({
  close,
  children,
  blur = true,
}: ModalContainerProps) => {
  return (
    <div
      onClick={close}
      className={cn("fixed inset-0 bg-black/50  z-10", {
        blur: "backdrop-blur-sm",
      })}
    >
      {children}
    </div>
  );
};
export default ModalContainer;
