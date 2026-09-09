import uvicorn
from src.grpc_server import start_grpc_server
from src.app import app

def main():
    start_grpc_server(port="50051")
    uvicorn.run(app, host="0.0.0.0", port=3000)

if __name__ == "__main__":
    main()
