package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"todo-app/internal/repository"

	"github.com/go-chi/chi/v5"
)

type TodoHandler struct {
	Repo *repository.PostgresRepo
}

func NewTodoHandler(repo *repository.PostgresRepo) *TodoHandler {
	return &TodoHandler{Repo: repo}
}

func (h *TodoHandler) CreateTodo(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title string `json:"title"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Некорректный JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	if input.Title == "" {
		http.Error(w, "Заголовок (title) обязателен", http.StatusBadRequest)
		return
	}

	id, err := h.Repo.Create(r.Context(), input.Title)
	if err != nil {
		http.Error(w, "Не удалось сохранить задачу: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]int{"id": id})
}

func (h *TodoHandler) UpdateTodo(w http.ResponseWriter, r *http.Request) {
	// 1. Достаем ID из URL (он приходит как строка)
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Некорректный ID", http.StatusBadRequest)
		return
	}

	// 2. Читаем тело запроса
	var input struct {
		Title  string `json:"title"`
		Status string `json:"status"` // ожидаем "pending" или "done"
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Некорректный JSON", http.StatusBadRequest)
		return
	}

	// 3. Вызываем репозиторий
	err = h.Repo.Update(r.Context(), id, input.Title, input.Status)
	if err != nil {
		http.Error(w, "Ошибка обновления: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 4. Отвечаем, что всё ок
	w.WriteHeader(http.StatusNoContent) // 204 код — "Успешно, контента в ответе нет"
}

func (h *TodoHandler) GetTodos(w http.ResponseWriter, r *http.Request) {
	todos, err := h.Repo.GetAll(r.Context())
	if err != nil {
		http.Error(w, "Ошибка при получении списка задач: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(todos); err != nil {
		http.Error(w, "Ошибка при кодировании JSON", http.StatusInternalServerError)
		return
	}
}

func (h *TodoHandler) DeleteTodo(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, _ := strconv.Atoi(idStr)

	if err := h.Repo.Delete(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
