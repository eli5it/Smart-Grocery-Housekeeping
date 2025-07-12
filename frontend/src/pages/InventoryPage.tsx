import ItemScanner from "../components/ItemScanner";
import { useState, useRef } from "react";
import { cn } from "@udecode/cn";
import BarcodeScanner from "react-qr-barcode-scanner";
import ModalContainer from "../components/ModalContainer";
import { useMutation } from "@tanstack/react-query";
import type { ToastDetails } from "../lib/types";
import type { PantryItem } from "../lib/types";
import axios from "axios";
import Toaster from "../components/Toaster";
import PantryItemList from "../components/PantryItemList";

const CameraView = () => {
  return <></>;
};

type BarcodeViewProps = {
  setPantryItems: React.Dispatch<React.SetStateAction<PantryItem[]>>;
  pantryItems: PantryItem[];
};

const BarcodeView = ({ pantryItems, setPantryItems }: BarcodeViewProps) => {
  const [displayCamera, setDisplayCamera] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastDetails, setShowToastDetails] = useState<ToastDetails>({
    title: "",
    description: "",
  });

  // use ref instead of state prevent excessive re-renders when scanning barcodes
  const attemptedBarcodesRef = useRef(
    new Set<string>(pantryItems.map((item) => item.barcode))
  );
  const lookupMutation = useMutation({
    mutationFn: (barcode: string) => {
      return axios.get<Omit<PantryItem, "quantity">>(
        `/api/barcode-lookup/?barcode=${barcode}`
      );
    },
    onSuccess: (response, barcode) => {
      setPantryItems([
        ...pantryItems,
        { ...response.data, quantity: 1, barcode },
      ]);
      setShowToast(true);
      setShowToastDetails({
        title: `Added ${response.data.product_name} to pantry!`,
        description: "",
      });
    },
    onError: (err, barcode) => {
      // need to have user input missing information manually
      const newPantryItem: PantryItem = {
        barcode,
        product_name: "",
        ingredient_name: "",
        image_url: "",
        quantity: 1,
      };
      setPantryItems([...pantryItems, newPantryItem]);
      setShowToast(true);
      setShowToastDetails({
        title: `Added pantry item with barcode ${barcode} to pantry!`,
        description: "You will need to fill out the rest of it's details",
      });
    },
  });

  const clickHandler = () => {
    setDisplayCamera(true);
  };

  const updateHandler = (err: any, result: any) => {
    if (result) {
      const barcode: string = result.text;
      const barcodeExists = attemptedBarcodesRef.current.has(barcode);
      if (!barcodeExists) {
        attemptedBarcodesRef.current.add(barcode);
        lookupMutation.mutate(barcode);
      } else if (
        pantryItems.some((pantryItem) => pantryItem.barcode === barcode)
      ) {
        // duplicate
        //TODO replace these alerts with toast components
        setShowToast(true);
        setShowToastDetails({
          title: "Already added item to pantry",
          description: "Add a new item?",
        });
      }
    }
  };

  return (
    <>
      {displayCamera && (
        <ModalContainer close={() => setDisplayCamera(false)}>
          <div className="flex items-center py-30 flex-col">
            <h1 className="font-bold text-3xl mb-3">
              Make sure the barcode is visible for your scan
            </h1>
            <BarcodeScanner width={500} height={500} onUpdate={updateHandler} />
            <button className="text-white bg-blue-700 font-bold px-2 py-3 rounded-3xl mt-3">
              Close Camera
            </button>
          </div>
        </ModalContainer>
      )}
      <div className="flex flex-col items-center">
        <div className="border border-black w-[360px] h-[200px] rounded-xl"></div>
        <h2 className="font-semibold">Capture Item</h2>
        <p>
          Place the barcode of your item in view of your camera, and it's
          details will be filled
        </p>
        <button
          onClick={clickHandler}
          className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold"
        >
          Open camera
        </button>
      </div>
      <Toaster
        toastDetails={toastDetails}
        showToast={showToast}
        setShowToast={setShowToast}
      />
    </>
  );
};

const ManualView = () => {
  return <></>;
};

const ItemsList = () => {};

const InventoryPage = () => {
  const [mode, setMode] = useState<"camera" | "barcode" | "manual">("barcode");
  // will store all scanned / manually added items
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);

  return (
    <>
      <h1 className="font-bold text-3xl">Add a new item</h1>
      <div className="flex px-4 gap-2 font-semibold my-3">
        <button
          className={cn("", {
            "text-blue-600": mode === "barcode",
          })}
          onClick={() => setMode("barcode")}
        >
          Barcode
        </button>
        <button
          className={cn("", {
            "text-blue-600": mode === "manual",
          })}
          onClick={() => {
            setMode("manual");
          }}
        >
          Manual
        </button>
        <button
          className={cn("", {
            "text-blue-600": mode === "camera",
          })}
          onClick={() => {
            setMode("camera");
          }}
        >
          Camera
        </button>
      </div>
      {mode === "manual" && <ManualView />}
      {mode === "barcode" && (
        <BarcodeView
          setPantryItems={setPantryItems}
          pantryItems={pantryItems}
        />
      )}
      {mode === "camera" && <CameraView />}

      <PantryItemList pantryItems={pantryItems}></PantryItemList>
    </>
  );
};

export default InventoryPage;
