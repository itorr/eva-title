
function makeBmp(w, h) {
    const BMP_HEADER_LEN = 14
    const DIB_HEADER_LEN = 108
    const arr = new Uint8Array(BMP_HEADER_LEN + DIB_HEADER_LEN + w * h * 4)

    // https://en.wikipedia.org/wiki/BMP_file_format#Example_2
    arr[0] = 0x42      // 'B'
    arr[1] = 0x4d      // 'M'
    arr[0x0A] = BMP_HEADER_LEN + DIB_HEADER_LEN
    arr[0x0E] = DIB_HEADER_LEN
    arr[0x1A] = 1      // Number of color planes being used
    arr[0x1C] = 32     // Number of bits per pixel
    arr[0x1E] = 3      // BI_BITFIELDS, no pixel array compression used

    arr[0x36] = 0xff   // R channel bit mask
    arr[0x3B] = 0xff   // G channel bit mask
    arr[0x40] = 0xff   // B channel bit mask
    arr[0x45] = 0xff   // A channel bit mask

    const view = new DataView(arr.buffer)
    // view.setUint16(2, DIB_HEADER_LEN + w * h * 4, true) // optional
    view.setInt32(0x12, w, true)
    view.setInt32(0x16, -h, true)  // top-down

    return arr.subarray(BMP_HEADER_LEN + DIB_HEADER_LEN)
}

const makeBMPFormCanvas = canvas=>{
    // document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')
   
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    const imgBuf = makeBmp(canvas.width, canvas.height)
    imgBuf.set(imgData.data)

    const blob = new Blob([imgBuf.buffer], {
        type: 'image/bmp',
    })
    const url = URL.createObjectURL(blob)
    return url
}