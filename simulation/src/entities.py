from dataclasses import dataclass
import enum
from pydantic import BaseModel
from typing import Optional



class ExecutionConfig(BaseModel):
    start_time: float
    final_time: float
    step_size: float

class Trajectory(BaseModel):
    fmu_id:str
    result_id: Optional[int] = None
    config: ExecutionConfig
    variables: list[str]


x = {
    "fmu_id": "id",
    "config": {
        "start": 0,
        "stop": 5,
    },
    "variables": []
}
