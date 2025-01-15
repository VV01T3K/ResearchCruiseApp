export default class CustomConverter {
  static stringToBoolean(value: string): boolean {
    return value != "" && value.toLowerCase() != "false"
  }
}
