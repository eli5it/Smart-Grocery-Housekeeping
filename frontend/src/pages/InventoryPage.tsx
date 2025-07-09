import ItemScanner from "../components/ItemScanner";
import { useState } from "react";
import { cn } from "@udecode/cn";
import BarcodeScanner from "react-qr-barcode-scanner";
import ModalContainer from "../components/ModalContainer";

type PantryItem = string;

const CameraView = () => {
  return <></>;
};

type BarcodeViewProps = {
  setPantryItems: React.Dispatch<React.SetStateAction<string[]>>;
  pantryItems: PantryItem[];
};

const BarcodeView = ({ pantryItems, setPantryItems }: BarcodeViewProps) => {
  const [barcode, setBarcode] = useState<null | string>(null);
  const [displayCamera, setDisplayCamera] = useState(false);
  const clickHandler = () => {
    setDisplayCamera(true);
  };

  const updateHandler = (err: any, result: any) => {
    if (result) {
      setBarcode(result.text);
      if (!pantryItems.includes(result.text)) {
        setPantryItems(pantryItems.concat(result.text));
      }
      // need to fetch ingredient info and add to list
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
            <ul className="text-blue-700 text-lg">
              {pantryItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
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
      <ul>
        {pantryItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
};

export default InventoryPage;
