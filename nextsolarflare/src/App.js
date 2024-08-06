import { useState, useEffect } from 'react';
import './App.css';
import { Typography, Stack } from '@mui/material';
import axios from 'axios';

function App() {
  //emojis from https://emojidb.org/

  const emojiConvert = {
    "1":"1️⃣",
    "2":"2️⃣",
    "3":"3️⃣",
    "4":"4️⃣",
    "5":"5️⃣",
    "6":"6️⃣",
    "7":"7️⃣",
    "8":"8️⃣",
    "9":"9️⃣",
    "0":"0️⃣"
  } 



  const possNums = ["0","1","2","3","4","5","6","7","8","9"]
  // const headers = {
  //   "Content-Type": "application/json"
  // };

  const [maxKP, setMaxKP] = useState(0)
  const [maxDate, setMaxDate] = useState(new Date())
  const [dateSpan, setDateSpan] = useState(["0"])


  useEffect(() => {
    axios.get("https://services.swpc.noaa.gov/text/27-day-outlook.txt")
    .then((res) => {
      let tableData = res['data'].split(/\r?\n/).slice(11, -2);

      let store = [];
      //UTC_DATE  RADIOFLUX_CM  PLANETARY_A_INDEX LARGEST_Kp_Index
      for(let i = 0; i < tableData.length; i++){
        //0 1 3 5/-1
        let line = tableData[i].split("     ");
        store.push([line[0].replace(/^\s+|\s+$/gm, ''), line[1].replace(/^\s+|\s+$/gm, ''), line[3].replace(/^\s+|\s+$/gm, ''), parseInt(line[5].replace(/^\s+|\s+$/gm, ''))]);
      }
      
      let tempMaxKp = 0;
      let tempMaxDate = new Date();

      for(let i = 0; i < store.length; i++){
        let dateInQuestion = new Date(store[i][0]);
        let currDate = new Date();

        if((dateInQuestion > currDate) && (store[i][3] >= tempMaxKp)){
          tempMaxKp = store[i][3];
          tempMaxDate = dateInQuestion;  
        }
      }

      setMaxKP(tempMaxKp)
      setMaxDate(tempMaxDate)
    })
    .catch((err) => {console.log(err)})
  }, [maxKP])
  

  useEffect(() => {
    let d = new Date();
    let daysTill = Math.round((maxDate-d)/(1000 * 3600 * 24)).toString().split("");
    setDateSpan(daysTill)
  }, [maxDate])


  return (
    <div className="App">
      <header className="App-header">
      <Stack direction="column" alignItems="center" spacing={1}>
          <Typography variant="h6" sx={{fontSize: "100px"}} gutterBottom>
            <Stack direction="row" align="center" alignItems="center" spacing={1} sx={{ display:"flex", mt: 2 }}>
              {dateSpan.map((digit, index) => {
                  return (<div key={index}>{(possNums.indexOf(digit) !== -1) ? emojiConvert[digit] : "❔"}</div>)
                })}
            </Stack>
          </Typography>
          
          
          <Typography variant="h6" sx={{fontSize: "25px"}} gutterBottom>🇩 🇦 🇾 🇸</Typography>
          <Typography variant="h6" sx={{fontSize: "25px"}} gutterBottom>🇺 🇳 🇹 🇮 🇱</Typography>
          <Typography variant="h6" sx={{fontSize: "25px"}} gutterBottom>🇳 🇪 🇽 🇹 </Typography>
          <Typography variant="h6" sx={{fontSize: "25px"}} gutterBottom>🇲 🇦 🇯 🇴 🇷 </Typography>
          <Typography variant="h6" sx={{fontSize: "25px"}} gutterBottom>🇸 🇴 🇱 🇦 🇷</Typography>
          <Typography variant="h6" sx={{fontSize: "25px"}} gutterBottom>🇫 🇱 🇦 🇷 🇪 ╱ 🇸 🇹 🇴 🇷 🇲</Typography>
          <Typography variant="h6" sx={{fontSize: "100px"}} gutterBottom>☀️🔥</Typography>
        </Stack>
      </header>
    </div>
  );
}

export default App;
