# Task Manager

A small full-stack task management application built as a portfolio project.

## Features
- Create tasks with title, description, priority and deadline
- Move tasks between TODO, IN_PROGRESS and DONE
- Filter tasks by status
- Delete tasks
- Persistent local database
- Responsive web interface
- Automated tests with GitHub Actions

## Tech stack
- Java 21
- Spring Boot
- Spring Web / REST API
- Spring Data JPA
- H2 database
- HTML, CSS and JavaScript
- Maven
- GitHub Actions

## Architecture
`Frontend -> TaskController -> TaskService -> TaskRepository -> Database`

## REST API
- `GET /api/tasks` - list tasks
- `POST /api/tasks` - create a task
- `PUT /api/tasks/{id}` - update a task
- `PATCH /api/tasks/{id}/status?status=DONE` - change status
- `DELETE /api/tasks/{id}` - delete a task

## Run locally
Requires Java 21 and Maven.

```bash
mvn spring-boot:run
```

Open `http://localhost:8082`.

## Project goal
The project demonstrates a simple layered Spring Boot application and the flow between a browser frontend, REST controller, service layer, repository and database.

**Status: V1**
