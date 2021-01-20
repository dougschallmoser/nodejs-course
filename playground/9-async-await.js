const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a + b)
    }, 2000)
  })
}

const doWork = async () => {

}

doWork().then((result) => {
  console.log('Result: ', result)
}).catch((error) => {
  console.log('Error: ', error)
})