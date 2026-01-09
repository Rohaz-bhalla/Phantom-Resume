import { z } from "zod"

export const emptyStringToUndefined = <T extends z.ZodTypeAny>(
  schema: T
) =>
  z.preprocess(
    (val) => (val === "" ? undefined : val),
    schema
  )
