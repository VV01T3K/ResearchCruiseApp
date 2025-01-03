const floatRe = /^\d+(\.\d+)?$/

export const textIsFloatNumber = (text: string) => floatRe.test(text)

export const ConvertFloatToString = (value: number) => {
  return value.toFixed(2)
}

export const ParseFloatInput = (value: string) => {
  const val = value.replaceAll(",", ".")
  if (textIsFloatNumber(val)) {
    return parseFloat(value)
  } else {
    return 0
  }
}

export const intRe = /^[0-9\b]+$/
export const textIsIntNumber = (text: string) => intRe.test(text)

export const ParseIntInput = (value: string) => {
  if (textIsIntNumber(value)) {
    return parseInt(value)
  } else {
    return 0
  }
}
