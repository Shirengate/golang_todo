package main

import (
	"log"
	"net/http"
	"todo-app/internal/handlers"
	"todo-app/internal/repository"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	dsn := "postgres://user:password@db:5432/todo_db?sslmode=disable"

	repo, err := repository.NewPostgresRepo(dsn)
	if err != nil {
		log.Fatalf("Ошибка БД: %v", err)
	}
	repo.CreateTodoTable()
	defer repo.Pool.Close()

	h := handlers.NewTodoHandler(repo)

	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Get("/todos", h.GetTodos)
	r.Post("/todos", h.CreateTodo)
	r.Put("/todos/{id}", h.UpdateTodo)
	r.Delete("/todos/{id}", h.DeleteTodo)
	log.Println("Сервер запущен на http://localhost:8080")
	http.ListenAndServe(":8080", r)
}
