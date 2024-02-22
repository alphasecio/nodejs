const http = require('http');
const cheerio = require('cheerio');
const PORT = 3000;
const fetchMinhNgoc = async (cdate, m=2) => {
  try {
      const cyear = cdate.getFullYear()
      const cmonth = ("0"+(cdate.getMonth() + 1 )).slice(-2)
      const cday = ("0"+(cdate.getDate())).slice(-2)
      // 1 - name, 2 - bac , 3 - trung
      let response = await fetch(`https://www.minhngoc.net.vn/tra-cuu-ket-qua-xo-so.html?mien=${m}&ngay=${cday}&thang=${cmonth}&nam=${cyear}`)
      response = await response.text()
      let $ = cheerio.load(response);
      // const date = (new Date(parseInt(cyear), parseInt(cmonth) - 1, parseInt(cday)).getTime())
      let d = []
      if (m === 2) {
          let day = cdate.getDay()
          const names = {0: "Thái Bình", 1: "Hà Nội",2: "Quảng Ninh",3: "Bắc Ninh", 4: "Hà Nội", 5: "Hải Phòng", 6: "Nam Định"}

          let temp = { src: "minhngoc", data: [], ticket: null, name: names[day] }
          temp.ticket = $(".loaive_content").text()
          let da = []
          let [n, rtime] = $(".title").first().text().split("-")
          // rtime = rtime?.trim().replaceAll("/", "-")
          // temp.name = n.split("XỔ SỐ ")[1].trim()
          $(".bkqtinhmienbac").find("tr").find("td").find("div")
              .each( (i, num) => {
                  const number = (parseInt($(num).text()) >= 0) ? $(num).text() : ""
                  da = [number,...da]
              })
          temp.data = da.slice(0, 27)
          d = [temp]
      } else {
          $(".rightcl").each( (i, e) => {
              const list = $(e).children("tbody").children("tr")
              let temp = {
                  src: "minhngoc",
                  data: [], ticket: null, name: null
              }
              list.each( (k, tr) => {
                  if (k === 0) temp.name = $(tr).text().trim()
                  else if (k === 1) temp.ticket = $(tr).text().trim()
                  else {
                      const td = $(tr).children("td").children("div")
                      td.each( (itd, num) => {
                          const number = (parseInt($(num).text()) >= 0) ? $(num).text() : ""
                          temp.data = [...temp.data, number]
                      } )
                  }
              })
              if (temp.name) d = [...d, temp]
          })
      }

      if (!d.length) return false
      if (d.some((e) => e.data.filter( s => s.length).length < (parseInt(m)===2?27:18))) return false
      return d
  } catch (e) {
      console.log(e)
      return false
  }
}

const server = http.createServer();
server.on('request', async (req, res) => {
  let start = new Date(2023,10,28,0,0,0)
  let data = await fetchMinhNgoc(start, 1)
  res.end(JSON.stringify(data));
});


server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
