const to = (promise)=>{
    return promise
    .then(data =>([undefined,data]))
    .catch(error=> Promise.resolve([error, undefined]))
}

export default to 