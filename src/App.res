open NodeJs

let server = Http.createServer((request, response) => {
  let url = request->Http.IncomingMessage.url
  let headers = request->Http.IncomingMessage.headers
  Js.log(url)
  Js.log(headers)
  request
  ->Stream.onData(data => {
    let str = data->Buffer.toString
    try {
      let json = JSON.parseExn(str)
      switch json {
      | Object(obj) => Js.log(obj)
      | _ => Js.log("not an object")
      }
    } catch {
    | Exn.Error(_) => Js.log("error")
    }
  })
  ->ignore
  request->Stream.pipe(response)->ignore
})
