<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Erasmios Bazzar — Songs</title>
<style>
  body { font-family: sans-serif; background: linear-gradient(to bottom right, white, #f8fafc); margin: 0; padding: 20px; }
  .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  button { cursor: pointer; border: none; padding: 8px 12px; border-radius: 8px; }
  input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 6px; }
  ul { list-style: none; padding: 0; }
  li { border: 1px solid #ddd; border-radius: 8px; padding: 10px; margin-bottom: 6px; }
</style>
</head>
<body>
<div class="container">
  <h1>Erasmios Bazzar — Songs</h1>
  <p>Σάρωσε το QR για να μπεις σε αυτήν την σελίδα από κινητό. Επίλεξε αν θέλεις να <strong>στείλεις</strong> ή να <strong>δεις</strong> τραγούδια.</p>
  <div>
    <button id="sendMode">Να μπω για να στείλω τραγούδια</button>
    <button id="viewMode">Να μπω για να βλέπω τα τραγούδια</button>
  </div>
  <div id="main"></div>
  <div style="text-align:center;margin-top:20px;">
    <p>QR (σάρωσέ το με κινητό)</p>
    <canvas id="qrCanvas"></canvas>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
<script>
const VIEW_USERNAME = 'erasmios.bazzar.songs';
const VIEW_PASSWORD = 'onlyerasmeiossongs';
const LOCALSTORAGE_KEY = 'erasmios_songs_list_v1';
let mode = null;
let viewerLogged = false;
let songs = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || '[]');

const main = document.getElementById('main');
const qrCanvas = document.getElementById('qrCanvas');
QRCode.toCanvas(qrCanvas, window.location.href, {width: 200});

document.getElementById('sendMode').onclick = () => showSend();
document.getElementById('viewMode').onclick = () => showView();

function saveSongs(){
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(songs));
}

function showSend(){
  mode = 'send';
  main.innerHTML = `
    <h2>Στείλε τραγούδι</h2>
    <label>Το όνομά σου</label>
    <input id="nameInput" placeholder="Το όνομά σου"><br><br>
    <label>Τίτλος τραγουδιού</label>
    <input id="titleInput" placeholder="Τίτλος"><br><br>
    <button id="sendBtn">Αποστολή</button>
    <p id="msg"></p>
  `;
  document.getElementById('sendBtn').onclick = () => {
    const name = document.getElementById('nameInput').value.trim();
    const title = document.getElementById('titleInput').value.trim();
    const msg = document.getElementById('msg');
    if(!name || !title){ msg.textContent = 'Συμπλήρωσε όνομα και τίτλο τραγουδιού.'; return; }
    const entry = { id: Date.now().toString(), name, title, time: new Date().toISOString() };
    songs.unshift(entry);
    saveSongs();
    msg.textContent = 'Το τραγούδι στάλθηκε!';
    setTimeout(()=>{msg.textContent='';},2000);
  };
}

function showView(){
  mode = 'view';
  if(!viewerLogged){
    main.innerHTML = `
      <h2>Προβολή τραγουδιών (προστατευμένη)</h2>
      <input id="user" placeholder="username"><br><br>
      <input id="pass" type="password" placeholder="password"><br><br>
      <button id="loginBtn">Σύνδεση</button>
      <p id="msg"></p>
    `;
    document.getElementById('loginBtn').onclick = ()=>{
      const u = document.getElementById('user').value;
      const p = document.getElementById('pass').value;
      const msg = document.getElementById('msg');
      if(u===VIEW_USERNAME && p===VIEW_PASSWORD){
        viewerLogged=true;
        msg.textContent='Επιτυχής σύνδεση!';
        setTimeout(showSongs,800);
      }else msg.textContent='Λάθος στοιχεία.';
    };
  } else {
    showSongs();
  }
}

function showSongs(){
  let html = `<h2>Λίστα τραγουδιών</h2>`;
  html += `<button id="clearBtn">Διαγραφή όλων</button><ul>`;
  if(songs.length===0){ html += '<p>Δεν υπάρχουν τραγούδια.</p>'; }
  else{
    for(const s of songs){
      html += `<li><strong>${s.title}</strong><br><small>από ${s.name} • ${new Date(s.time).toLocaleString()}</small></li>`;
    }
  }
  html += '</ul>';
  main.innerHTML = html;
  document.getElementById('clearBtn').onclick = ()=>{
    if(confirm('Διαγραφή όλων;')){ songs=[]; saveSongs(); showSongs(); }
  };
}
</script>
</body>
</html>
