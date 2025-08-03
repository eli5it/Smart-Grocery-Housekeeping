import { useState, useRef, useCallback } from "react";
import { cn } from "@udecode/cn";
import BarcodeScanner from "react-qr-barcode-scanner";
import { useMutation } from "@tanstack/react-query";
import type { ToastDetails } from "../lib/types";
import type { PantryItem } from "../lib/types";
import axios from "axios";
import Toaster from "../components/Toaster";
import PantryItemList from "../components/PantryItemList";
import PantryItemListElement from "../components/PantryItemListElement";
import { useNavigate } from "@tanstack/react-router";
import Webcam from "react-webcam";

type CameraViewProps = {
  setPantryItems: React.Dispatch<React.SetStateAction<PantryItem[]>>;
  pantryItems: PantryItem[];
};

const videoConstraints = {
  width: 600,
  height: 400,
  facingMode: "user",
};

// send base64 image to the frontend
const CameraView = ({ setPantryItems, pantryItems }: CameraViewProps) => {
  const uploadImage = (base64String: string) => {
    return axios.post("/api/vision/analyze", {
      image: base64String,
      mode: "image",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (response, barcode) => {
      alert("added item to your pantry");
      console.log(response);
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
    },
  });

  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    //@ts-ignore
    const imageSrc = webcamRef?.current?.getScreenshot();

    if (imageSrc) {
      const base64Data = imageSrc.replace(/^data:image\/\w+;base64,/, "");
      uploadMutation.mutate(base64Data);
    }
  }, [webcamRef]);

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="border border-black w-[360px] h-[200px] rounded-xl">
          <Webcam
            className="max-w-[500px] w-[500px]"
            audio={false}
            height={400}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={600}
            videoConstraints={videoConstraints}
          />
        </div>
        <h2 className="font-semibold">Capture Item</h2>
        <p className="text-center my-2">
          Take a screenshot of the food product you'd like to add to your
          pantry.
        </p>
        <button
          onClick={capture}
          className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold"
        >
          Take Screenshot
        </button>
      </div>
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

  // use ref instead of state to prevent excessive re-renders when scanning barcodes
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
    setDisplayCamera(!displayCamera);
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
      <div className="flex flex-col items-center">
        <div className="border border-black w-[360px] h-[200px] rounded-xl">
          {displayCamera && <BarcodeScanner onUpdate={updateHandler} />}
        </div>
        <h2 className="font-semibold">Capture Item</h2>
        <p className="text-center my-2">
          Place the barcode of your item in view of your camera, and it's
          details will be filled in.
        </p>
        <button
          onClick={clickHandler}
          className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold"
        >
          {displayCamera ? "Close" : "Open"} camera
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
    expiration_date: new Date().toISOString().split("T")[0],
  };

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
        expiration_date: item.expiration_date,
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
        to: "/app/inventory",
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
      {mode === "camera" && (
        <CameraView setPantryItems={setPantryItems} pantryItems={pantryItems} />
      )}
      {pantryItems.length !== 0 && (
        <h3 className="font-bold text-2xl text-center mt-8">
          New Pantry items
        </h3>
      )}
      <div className="flex justify-center">
        <PantryItemList
          setPantryItems={setPantryItems}
          pantryItems={pantryItems}
        ></PantryItemList>
      </div>

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
