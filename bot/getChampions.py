import json
import os
import requests

# Baixar o JSON de uma URL
url = "https://www.mafiasmurfs.com/skins.json"
response = requests.get(url)
skins_data_list = response.json()

# Criar um diretório para salvar os arquivos JSON se não existir
if not os.path.exists('database/Champions'):
    os.makedirs('database/Champions')

# Iterar sobre cada vetor no JSON fornecido
for skins_data in skins_data_list:
    # Iterar sobre cada vetor no JSON fornecido
    for champion_name, skins in skins_data.items():
        # Salvar os dados de skins em um arquivo JSON separado com o nome do campeão
        champion_filename = f'database/Champions/{champion_name}.json'
        with open(champion_filename, 'w', encoding='utf-8') as f:
            json.dump(skins, f, ensure_ascii=False, indent=1)

print("Arquivos JSON separados por campeão foram criados com sucesso!")
