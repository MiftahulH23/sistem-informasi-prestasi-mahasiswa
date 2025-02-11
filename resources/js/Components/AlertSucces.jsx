import { CircleCheck } from "lucide-react";

export default function AlertSucces() {
  return (
    (<div className="flex justify-center">
      <div className="border-emerald-500 rounded-lg border px-4 py-3 w-fit justify-center">
      <p className="text-sm text-emerald-500">
        <CircleCheck
          className="-mt-0.5 me-3 inline-flex text-emerald-500"
          size={16}
          strokeWidth={2}
          aria-hidden="true" />
        Data Berhasil diinput!
      </p>
    </div>
    </div>
    )
  );
}
