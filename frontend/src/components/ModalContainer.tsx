import { cn } from "@udecode/cn";

type ModalContainerProps = {
  close: () => void;
  children?: React.ReactNode;
};

const ModalContainer = ({ close, children }: ModalContainerProps) => {
  return (
    <div
      onClick={close}
      className={"fixed inset-0 bg-black/50  z-10 backdrop-blur-sm"}
    >
      {children}
    </div>
  );
};
export default ModalContainer;
