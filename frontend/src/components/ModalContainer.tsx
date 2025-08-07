type ModalContainerProps = {
  close: () => void; // Used to hide modal
  children?: React.ReactNode;
};

const ModalContainer = ({ close, children }: ModalContainerProps) => {
  // This Component renders a background shared by multiple modals
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
