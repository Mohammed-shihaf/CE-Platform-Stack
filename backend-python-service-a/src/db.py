import os
from typing import Dict, Any, List, Optional
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/ceplatform")

client: Optional[MongoClient] = None

def get_db():
    global client
    if client is None:
        client = MongoClient(MONGO_URI)
    return client.get_database()

def get_records_collection():
    return get_db()["records"]

def insert_record(title: str, description: str) -> Dict[str, Any]:
    collection = get_records_collection()
    import datetime
    created_at = datetime.datetime.utcnow().isoformat() + "Z"
    doc = {
        "title": title,
        "description": description,
        "createdAt": created_at
    }
    result = collection.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc["_id"] = str(result.inserted_id)
    return doc

def find_record_by_id(record_id: str) -> Optional[Dict[str, Any]]:
    from bson.objectid import ObjectId
    collection = get_records_collection()
    try:
        doc = collection.find_one({"_id": ObjectId(record_id)})
    except Exception:
        doc = collection.find_one({"_id": record_id})
    if doc:
        doc["id"] = str(doc["_id"])
        return doc
    return None

def find_all_records() -> List[Dict[str, Any]]:
    collection = get_records_collection()
    results = []
    for doc in collection.find():
        doc["id"] = str(doc["_id"])
        results.append(doc)
    return results
