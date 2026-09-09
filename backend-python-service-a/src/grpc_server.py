import os
import time
import queue
from concurrent import futures
import grpc
from src.db import find_record_by_id
from src.events import record_events

GRPC_PORT = os.getenv("GRPC_PORT", "50051")

class RecordServiceServicer:
    def GetRecord(self, request, context):
        record = find_record_by_id(request.id)
        if not record:
            context.abort(grpc.StatusCode.NOT_FOUND, "record not found")
        return {
            "id": record["id"],
            "title": record.get("title", ""),
            "description": record.get("description", ""),
            "createdAt": record.get("createdAt", "")
        }

    def WatchRecords(self, request, context):
        print("[py-service-a][grpc] Client subscribed to WatchRecords")
        q = queue.Queue()

        def on_record_created(record):
            q.put(record)

        record_events.on(on_record_created)

        try:
            while context.is_active():
                try:
                    record = q.get(timeout=1.0)
                    yield {
                        "id": record["id"],
                        "title": record.get("title", ""),
                        "description": record.get("description", ""),
                        "createdAt": record.get("createdAt", "")
                    }
                except queue.Empty:
                    continue
        finally:
            record_events.off(on_record_created)

def start_grpc_server(port: str = GRPC_PORT):
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    server.add_insecure_port(f"0.0.0.0:{port}")
    server.start()
    print(f"[py-service-a][grpc] RecordService listening on :{port}")
    return server

if __name__ == "__main__":
    server = start_grpc_server()
    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        server.stop(0)
