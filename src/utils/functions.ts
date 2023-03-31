export function isAddress(address: string) {
    if (!address || address.slice(0, 2) != "0x" || address.length != 42) return false;
    else return true;
  }
  
  export function isNumeric(inputtxt: string) {
    var numbers = /^[0-9]+$/;
    if (inputtxt.match(numbers)) {
      return true;
    } else {
      return false;
    }
  }