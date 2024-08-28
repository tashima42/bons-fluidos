# bons-fluidos

Documentação da API: https://documenter.getpostman.com/view/13233153/2sA3rwMuDD

## Ferramentas e versões

* [Golang 1.23](https://go.dev/)
* [Next.js 14.2](https://nextjs.org/) 
* [SQLite 3](https://www.sqlite.org/)
* [npm 10.8](https://www.npmjs.com/)
* [GNU Make 3.81](https://www.gnu.org/software/make/)
* [Docker 27 (opcional)](https://www.docker.com/)

## Compilação e Execução

## Desenvolvimento

Database: SQLite

```
export DATABASE_PATH=./bons_fluidos.db
export JWT_SECRET=secret
export PORT=3000
go run .
```

Frontend

```
cd front-web
npm rum dev
```
