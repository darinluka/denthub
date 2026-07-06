import urllib.request
import urllib.parse
import json

TOKEN = '8674028430:AAEsNrExdWJc60UdRwsGmmne48-pDL71sqY'
CHAT_ID = '1179683039'
TEXT = "Përshëndetje! 👋\nUnë jam Asistenti yt i ri Dentar nga Sistemi. Lidhja u krye me sukses! 🚀\nKëtu do të marrësh njoftime automatike kur krijohen faturat dhe vizitat e reja."

URL = f"https://api.telegram.org/bot{TOKEN}/sendMessage"

data = urllib.parse.urlencode({
    'chat_id': CHAT_ID,
    'text': TEXT
}).encode('utf-8')

try:
    req = urllib.request.Request(URL, data=data)
    response = urllib.request.urlopen(req)
    result = json.loads(response.read().decode('utf-8'))
    print("Test message sent successfully:", result['ok'])
except Exception as e:
    print("Error sending message:", str(e))
