FROM continuumio/miniconda3

RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

RUN conda install -c conda-forge pyfmi -y && \
    conda clean --all

RUN pip install flask-socketio eventlet pydantic --no-cache-dir
WORKDIR /app

EXPOSE 8000
# COPY . .
# CMD ["python", "src/main.py"]
CMD ["python", "-u", "src/server.py"]
