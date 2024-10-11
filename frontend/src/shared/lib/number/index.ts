export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function toFormattedNumber(value: number) {
    let newValue = '';

    // Convert the value to a string and remove any spaces
    const removeSpaces = value.toString().replace(/\s/g, '');

    // Check if the number has decimal (fraction) parts
    const hasFractions = removeSpaces.includes('.') || removeSpaces.includes(',');

    // Replace any commas with periods, convert to a float, then format the number
    const formattedValue = parseFloat(removeSpaces.replace(',', '.'))
        .toFixed(2) // Ensures two decimal places
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Use commas for thousand separators

    if (hasFractions) {
        newValue = formattedValue; // If it has fractions, format it as a float with commas
    } else {
        newValue = parseInt(removeSpaces, 10) // If it's an integer, format without decimals
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Apply commas for thousands
    }

    return newValue;
}

export function toFormattedIndex(value: number) {
    if (value < 10) {
        return `0${value}`
    }

    return value
}