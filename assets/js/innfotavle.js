// Erstat med IP-adressen på din Windows Server VM
const serverIpAddress = '10.0.1.243'; 
const apiUrl = `http://${serverIpAddress}:3000/api/data`;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    console.log(data); // Data fra din MS SQL database!
    // ... din kode til at vise data ...
  })
  .catch(error => {
    console.error('Fejl ved fetch:', error);
  });