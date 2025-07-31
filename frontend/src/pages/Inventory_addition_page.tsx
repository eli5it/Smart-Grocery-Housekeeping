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
import PantryItemListElement from "../components/PantryItemListElement";
import { useNavigate } from "@tanstack/react-router";

const CameraView = () => {
  return (
    <>
      <div className="w-40 h-40 rounded-lg bg-gray-500 m-auto"></div>
      <p className="text-center">Upload Image above</p>
    </>
  );
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
    new Set<string>(
      //@ts-ignore
      pantryItems.filter((item) => item.barcode).map((item) => item?.barcode)
    )
  );
  const lookupMutation = useMutation({
    mutationFn: (barcode: string) => {
      return axios.get<PantryItem>(`/api/barcode-lookup/?barcode=${barcode}`);
    },
    onSuccess: (response, barcode) => {
      setPantryItems([...pantryItems, { ...response.data, barcode }]);
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

type ManualViewProps = {
  setPantryItems: React.Dispatch<React.SetStateAction<PantryItem[]>>;
};

const ManualView = ({ setPantryItems }: ManualViewProps) => {
  const newPantryItem: PantryItem = {
    barcode: "",
    product_name: "",
    ingredient_name: "",
  };

  const navigate = useNavigate({
    from: "/login",
  });

  return (
    <>
      <div className="flex justify-center">
        <PantryItemListElement
          setPantryItems={setPantryItems}
          pantryItem={newPantryItem}
          mode="new"
        />
      </div>
    </>
  );
};

type InventoryPageProps = {
  switchView: () => void;
};
const InventoryPage = ({ switchView }: InventoryPageProps) => {
  const [mode, setMode] = useState<"camera" | "barcode" | "manual">("barcode");
  // will store all scanned / manually added items
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);

  const pantryMutation = useMutation({
    mutationFn: () => {
      const token = localStorage.getItem("access_token");
      const newPantryItems = pantryItems.map((item) => ({
        name: item.ingredient_name,
        product_name: item.product_name,
      }));
      return axios.post(
        "/api/pantry",
        { pantry_entries: newPantryItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      alert("succesfully added ingredient to DB");
      navigate({
        to: "/app/dashboard",
      });
    },
  });

  const navigate = useNavigate({ from: "/app/inventory" });

  const addPantryItem = () => {
    pantryMutation.mutate();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-center font-bold text-3xl md:text-left">
          Add a new item
        </h1>
        <button
          className="bg-light-green text-white flex justify-center items-center h-10 rounded-2xl px-3 py-2"
          onClick={switchView}
        >
          View Pantry
        </button>
      </div>

      <div className="flex px-4 gap-2 font-semibold my-3 justify-center">
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
      {mode === "manual" && <ManualView setPantryItems={setPantryItems} />}
      {mode === "barcode" && (
        <BarcodeView
          setPantryItems={setPantryItems}
          pantryItems={pantryItems}
        />
      )}
      {mode === "camera" && <CameraView />}
      {pantryItems.length !== 0 && (
        <h3 className="font-bold text-2xl text-center py-2">
          New Pantry items
        </h3>
      )}
      <PantryItemList
        setPantryItems={setPantryItems}
        pantryItems={pantryItems}
      ></PantryItemList>
      {pantryItems.length !== 0 && (
        <div className="flex justify-center">
          <button
            onClick={addPantryItem}
            className="bg-blue-600 text-white px-5 py-3 rounded-lg"
          >
            Submit Changes
          </button>
        </div>
      )}
    </>
  );
};

export default InventoryPage;
