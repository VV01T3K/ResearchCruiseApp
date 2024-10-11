export const datePickerCommon = {
    closeOnScroll: true,
    locale: 'pl',
    placeholderText: 'Wybierz',
};
export const datePickerDayCommon = {
    ...datePickerCommon,
    dateFormat: 'dd/MM/yyyy',

};

export const datePickerPeriodCommon = {
    ...datePickerCommon,
    dateFormat: 'MM/yyyy',
    showYearDropdown: true,
    showMonthYearPicker: true,
};
