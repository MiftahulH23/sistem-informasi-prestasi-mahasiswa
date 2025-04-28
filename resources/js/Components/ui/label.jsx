import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none text-[#606172] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)


const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className, "data-[required=true]:after:content-['*'] data-[required=true]:after:ms-1 data-[required=true]:after:text-destructive data-[required=true]:after:text-sm")} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
