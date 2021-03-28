export function deleteObjectFromArray(array, property, propertyValue) {
  const removeIndex = array.map((item) => item[property]).indexOf(propertyValue)
  array[removeIndex] && array.splice(removeIndex, 1)
}
