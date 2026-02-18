.PHONY: build run

build:
	docker build -t pyfmi-simulation .

run:
	docker run -it --rm -p 8000:8000 -v $(shell pwd):/app pyfmi-simulation
