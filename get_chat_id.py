import urllib.request
import json

TOKEN = '8674028430:AAEsNrExdWJc60UdRwsGmmne48-pDL71sqY'
URL = f"https://api.telegram.org/bot{TOKEN}/getUpdates"

try:
    response = urllib.request.urlopen(URL)
    data = json.loads(response.read().decode('utf-8'))
    
    if data['ok'] and len(data['result']) > 0:
        chat_id = data['result'][0]['message']['chat']['id']
        print(f"FOUND CHAT ID: {chat_id}")
    else:
        print("NO MESSAGES FOUND YET")
except Exception as e:
    print(f"ERROR: {e}")
