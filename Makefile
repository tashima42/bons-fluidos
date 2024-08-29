.DEFAULT_GOAL := all


.PHONY: front
front:
	cd front-web && \
		npm install && \
		npm run build && \
		cp -r out .. && \
		cd ..

.PHONY: front-dev
front-dev: export NEXT_PUBLIC_API_BASE_URL = http://localhost:3000
front-dev: front

.PHONY: front-prod
front-prod: export NEXT_PUBLIC_API_BASE_URL = https://bons-fluidos.tashima.space
front-prod: front

.PHONY: back
back:
	go build -o bons-fluidos .
	
.PHONY: all
all: front-dev back

.PHONY: prod
prod: front-prod back 

