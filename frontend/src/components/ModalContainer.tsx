type ModalContainerProps = {
  close: () => void;
  children?: React.ReactNode;
};
const ModalContainer = ({ close, children }: ModalContainerProps) => {
  return (
    <div
      onClick={close}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
    >
      {children}
    </div>
  );
};
export default ModalContainer;
