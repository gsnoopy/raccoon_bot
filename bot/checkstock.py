import requests
import json

url = "https://www.mafiasmurfs.com/api/v1/stock/skins/check"
teste = input("Digite aqui o nome do champ: ")
# Carregar os dados de skins do arquivo JSON
with open(f'database/Champions/{teste}.json', 'r', encoding='utf-8') as file:
    skins_data = json.load(file)

payload = {
    "skinGroup": skins_data,
    "region": "br"
}

headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json",
    "priority": "u=1, i",
    "referrer": "https://www.mafiasmurfs.com/skins/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
}

response = requests.post(url, json=payload, headers=headers)

print(response.text)
