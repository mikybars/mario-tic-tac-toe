export function randomElement(array) {
  if (array.length === 0) {
    return -1;
  }

  return array[Math.floor(Math.random() * array.length)];
}
