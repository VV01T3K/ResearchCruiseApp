export const datePickerCommon = {
  closeOnScroll: true,
  locale: "pl",
  placeholderText: "Wybierz",
}
export const datePickerDayCommon = {
  ...datePickerCommon,
  dateFormat: "dd/MM/yyyy",
}

export const datePickerPeriodCommon = {
  ...datePickerCommon,
  dateFormat: "MM/yyyy",
  showYearDropdown: true,
  showMonthYearPicker: true,
}

export const datePickerDayAndHour = {
  ...datePickerCommon,
  showTimeSelect: true,
  timeFormat: "HH:mm",
  timeIntervals: 15,
  dateFormat: "dd/MM/yyyy HH:mm",
  timeCaption: "Godzina",
}
