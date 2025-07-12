import { Toast } from "radix-ui";
import type { ToastDetails } from "../lib/types";

type ToasterProps = {
  showToast: boolean;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  toastDetails: ToastDetails;
};
const Toaster = ({ showToast, setShowToast, toastDetails }: ToasterProps) => {
  return (
    <Toast.Root
      open={showToast}
      className="bg-white px-10 pb-3 pt-20 rounded-md relative"
      duration={3000}
      onOpenChange={setShowToast}
    >
      <Toast.Close className="font-bold text-2xl rounded-2xl px-2 py-2 absolute right-2 top-2">
        X
      </Toast.Close>
      <Toast.Title className="text-black text-bold font-bold mb-4 text-xl">
        {toastDetails.title}
      </Toast.Title>
      <Toast.Description> {toastDetails.description}</Toast.Description>
    </Toast.Root>
  );
};

export default Toaster;
