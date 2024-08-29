# bons-fluidos

Documentação da API: https://documenter.getpostman.com/view/13233153/2sA3rwMuDD

## Versão hospedada:
https://bons-fluidos.tashima.space

## Ferramentas e versões

* [Golang 1.23](https://go.dev/)
* [Next.js 14.2](https://nextjs.org/) 
* [SQLite 3](https://www.sqlite.org/)
* [Node 22](https://nodejs.org/en)
* [npm 10.8](https://www.npmjs.com/)
* [GNU Make 3.81](https://www.gnu.org/software/make/)

## Como compilar e executar
Compilar o projeto:
```
make
```
Executar o projeto:
```
export JWT_SECRET=secret
export DATABASE_PATH=./bons-fluidos.db
./bons-fluidos
```
Adicionar usuário de testes:    
Pare o projeto, execute o comando a seguir e o execute o projeto novamente usando as instruções do passo anterior
```
sqlite3 bons-fluidos.db < seed.sql
```

## Como compilar e executar utilizando Docker

Ferramentas e versões adicionais:
* [Docker 27](https://www.docker.com/)

Criar a imagem Docker:
```
docker build -t bons-fluidos:dev .
```

Executar o container Docker:
```
mkdir -p container-data
docker run --name bons-fluidos-dev -e JWT_SECRET=secret --mount "type=bind,source=./container-data,target=/app/" -p 3000:3000 bons-fluidos:dev
```

Adicionar usuário de testes:

Pare o container docker e execute os comandos a seguir

```
sqlite3 container-data/bons-fluidos.db < seed.sql
docker start -a bons-fluidos-dev
```

Endereço padrão: http://localhost:3000

Usuário de testes:
* email: admin@utfpr.edu.br
* senha: 1234567
