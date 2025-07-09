import ItemScanner from "../components/ItemScanner";
import { useState } from "react";
import { cn } from "@udecode/cn";

const CameraView = () => {
  return <></>;
};

const BarcodeView = () => {
  const clickHandler = () => {};

  return (
    <>
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

const InventoryPage = () => {
  const [mode, setMode] = useState<"camera" | "barcode" | "manual">("barcode");

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
      {mode === "barcode" && <BarcodeView />}
      {mode === "camera" && <CameraView />}
    </>
  );
};

export default InventoryPage;
