// EXAMPLE:
// const add = (num1, num2, callback) => {
//   const sum = num1 + num2;

//   setTimeout(() => {
//     callback(sum)
//   }, 2000)
// }

// add(1, 4, (sum) => {
//   console.log(sum) // Should print: 5
// })

// EXAMPLE
const doWorkCallback = (callback) => {
  setTimeout(() => {
    // callback('This is my error')
    callback(undefined, [1,4,7])
  }, 2000)
}

doWorkCallback((error, result) => {
  if (error) {
    return console.log(error)
  }

  console.log(result);
});