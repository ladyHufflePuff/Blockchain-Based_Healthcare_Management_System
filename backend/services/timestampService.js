export const timestamp = () =>{
// Define the date
const now = new Date();

// Format the date manually in GMT+4 (Asia/Dubai time zone)
const options = {
  timeZone: 'Asia/Dubai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
};

const formatter = new Intl.DateTimeFormat('en-US', options);


const parts = formatter.formatToParts(now);
let date = '';
let time = '';

parts.forEach(part => {
  if (part.type === 'year' || part.type === 'month' || part.type === 'day') {
    date += part.value + '-';
  } else if (part.type === 'hour' || part.type === 'minute' || part.type === 'second') {
    time += part.value + ':';
  }
});


date = date.slice(0, -1);  
time = time.slice(0, -1);  


const formattedTimestamp = `${date} ${time}`;

return formattedTimestamp;  

}