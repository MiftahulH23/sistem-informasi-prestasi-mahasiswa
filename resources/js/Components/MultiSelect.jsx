import { Label } from "@/components/ui/label"
import MultipleSelector from "@/components/ui/multiselect";

export default function MultiSelect({value, onChange, data, placeholder, notFoundText}) {
  return (
    <div className="*:not-first:mt-2">
      <MultipleSelector
        value={value}
        onChange={onChange}
        commandProps={{
          label: "Select frameworks",
        }}
        defaultOptions={data}
        placeholder={placeholder}
        emptyIndicator={<p className="text-center text-xs">{notFoundText}</p>} />
    </div>
  );
}
