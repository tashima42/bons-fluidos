.DEFAULT_GOAL := all

.PHONY: front
front:
	cd front-web && \
		npm install && \
		npm run build && \
		cp -r out .. && \
		cd ..

.PHONY: back
back:
	go build -o bons-fluidos .
	
.PHONY: all
all: front back

