import asyncio
import csv
import serial
import websockets
import json

# Configura a porta serial (ajuste o caminho da porta)
ser = serial.Serial('COM10', 115200)

# Variáveis de controle
is_recording = False
file_stream = None
csv_writer = None
data_name = 'dados'
data_type = ''
latest_data = None  # Para armazenar os dados mais recentes

# Lista de clientes WebSocket conectados
connected_clients = set()

# Função para processar dados da porta serial
def process_serial_data(data):
    global is_recording, csv_writer, data_type, latest_data

    try:
        # Divide a string recebida e mapeia para números
        values = data.split(',')
        if len(values) == 4:  # Verifica se o número de valores é correto
            tempo, ax, ay, az = map(float, values)

            # Cria um objeto com os dados do sensor
            sensor_data = {
                "tempo": tempo,
                "ax": ax,
                "ay": ay,
                "az": az,
                "acao": data_type
            }

            # Atualiza os dados mais recentes
            latest_data = sensor_data

            # Grava os dados no arquivo CSV, se a gravação estiver ativa
            if is_recording and csv_writer:
                csv_writer.writerow([tempo, ax, ay, az, data_type])
                print(f'Dados gravados: {tempo}, {ax}, {ay}, {az}, {data_type}')

            # Envia os dados para todos os clientes conectados
            asyncio.create_task(send_data_to_clients(sensor_data))  # Use create_task para enviar a tarefa

            return sensor_data
        else:
            print(f'Formato de dados inválido: {data}')
            return None

    except ValueError as error:
        print(f'Erro ao processar os dados: {error}')
        return None

# Função assíncrona para enviar dados aos clientes conectados
async def send_data_to_clients(sensor_data):
    if connected_clients:
        message = json.dumps(sensor_data)
        # Corrigido: usar asyncio.create_task() para cada corrotina
        await asyncio.wait([asyncio.create_task(client.send(message)) for client in connected_clients])

# Função para iniciar o WebSocket e lidar com a comunicação
async def handle_websocket(websocket, path):
    global is_recording, file_stream, csv_writer, data_name, data_type, latest_data
    print('Cliente WebSocket conectado.')
    connected_clients.add(websocket)

    # Envia os dados mais recentes assim que o cliente se conectar
    if latest_data:
        await websocket.send(json.dumps(latest_data))

    try:
        async for message in websocket:
            if message.strip():  # Verifica se a mensagem não está vazia
                message_data = json.loads(message)

                if message_data.get('action') == 'start-recording':
                    is_recording = True
                    data_type = message_data.get('dataType', 'acao')
                    print(f'Gravação iniciada ação: {data_type}')

                    # Abre o arquivo CSV para escrita (append mode - 'a') e cria um csv.writer
                    file_stream = open('dados_sensores.csv', 'a', newline='')
                    csv_writer = csv.writer(file_stream)

                    # Escreve o cabeçalho apenas se o arquivo está vazio
                    if file_stream.tell() == 0:
                        csv_writer.writerow(['tempo', 'ax', 'ay', 'az', 'acao'])

                elif message_data.get('action') == 'stop-recording':
                    is_recording = False
                    if file_stream:
                        file_stream.close()
                        file_stream = None
                        csv_writer = None
                    print('Gravação parada.')

    except websockets.ConnectionClosed:
        print('Cliente WebSocket desconectado.')
    finally:
        connected_clients.remove(websocket)

# Função para verificar os dados da porta serial continuamente
async def read_serial_data():
    while True:
        if ser.in_waiting > 0:
            serial_data = ser.readline().decode('utf-8').strip()
            process_serial_data(serial_data)
        await asyncio.sleep(0.1)  # Evita uso excessivo de CPU

# Função para rodar o servidor WebSocket
async def websocket_server():
    async with websockets.serve(handle_websocket, 'localhost', 8080):
        print('Servidor WebSocket rodando em ws://localhost:8080')
        await asyncio.Future()  # Mantém o servidor rodando

# Função principal para rodar tanto o WebSocket quanto a leitura serial
async def main():
    tasks = [
        asyncio.create_task(websocket_server()),
        asyncio.create_task(read_serial_data())
    ]
    await asyncio.gather(*tasks)  # Aguarda a conclusão de todas as tarefas

# Executa o servidor WebSocket e leitura serial
if __name__ == '__main__':
    asyncio.run(main())  # Inicializa o loop de eventos
