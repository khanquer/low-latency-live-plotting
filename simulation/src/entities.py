from dataclasses import dataclass
import enum
from pydantic import BaseModel, field_validator
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

    @field_validator('fmu_id')
    @classmethod
    def strip_fmu_extension(cls, v: str) -> str:
        if v.lower().endswith('.fmu'):
            return v[:-4]
        return v

x = {
    "fmu_id": "id",
    "config": {
        "start": 0,
        "stop": 5,
    },
    "variables": []
}
