import { Popover } from "radix-ui";
import { X } from "lucide-react";

type PopoverProps = {
  entryId: number;
  updateEntry: ({
    entryId,
    newStatus,
  }: {
    entryId: number;
    newStatus: "used" | "discarded" | "deleted";
  }) => void;
};
const EntryPopover = ({ updateEntry, entryId }: PopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="px-5" aria-label="Update dimensions">
          <X />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="px-5 py-2 bg-white" sideOffset={0}>
          <p className="text-md font-bold text-center text-xl mb-5">
            Choose option
          </p>
          <div className="flex gap-2">
            <button
              onClick={() =>
                updateEntry({ entryId: entryId, newStatus: "deleted" })
              }
              className="bg-gray-200 text-black font-bold px-2 py-1 rounded-lg"
            >
              Delete
            </button>
            <button
              onClick={() =>
                updateEntry({ entryId: entryId, newStatus: "discarded" })
              }
              className="bg-gray-300 text-black font-bold px-2 py-1 rounded-lg"
            >
              Discarded
            </button>
            <button
              onClick={() =>
                updateEntry({ entryId: entryId, newStatus: "used" })
              }
              className="bg-gray-400 text-black font-bold px-2 py-1 rounded-lg"
            >
              Used
            </button>
          </div>
          <Popover.Close
            className="PopoverClose"
            aria-label="Close"
          ></Popover.Close>
          <Popover.Arrow className="PopoverArrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default EntryPopover;
