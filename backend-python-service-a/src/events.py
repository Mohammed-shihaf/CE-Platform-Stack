from typing import Callable, List, Dict, Any

class EventEmitter:
    def __init__(self):
        self._listeners: List[Callable[[Dict[str, Any]], None]] = []

    def on(self, listener: Callable[[Dict[str, Any]], None]):
        self._listeners.append(listener)

    def off(self, listener: Callable[[Dict[str, Any]], None]):
        if listener in self._listeners:
            self._listeners.remove(listener)

    def emit(self, record: Dict[str, Any]):
        for listener in list(self._listeners):
            try:
                listener(record)
            except Exception as e:
                print(f"[events] Listener error: {e}")

record_events = EventEmitter()
