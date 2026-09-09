from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.db import insert_record, find_all_records, find_record_by_id
from src.events import record_events

app = FastAPI(title="CE-Platform-Stack - Python Service A")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CreateRecordDTO(BaseModel):
    title: str
    description: str

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "backend-python-service-a"}

@app.get("/api/records")
def list_records():
    return find_all_records()

@app.get("/api/records/{record_id}")
def get_record(record_id: str):
    record = find_record_by_id(record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record

@app.post("/api/records", status_code=201)
def create_record(dto: CreateRecordDTO):
    record = insert_record(dto.title, dto.description)
    record_events.emit(record)
    return record
