package repository

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Todo struct {
	ID          int        `json:"id"`
	Title       string     `json:"title"`
	Status      string     `json:"status"`
	CreatedAt   time.Time  `json:"created_at"`
	CompletedAt *time.Time `json:"completed_at,omitempty"`
}

type PostgresRepo struct {
	Pool *pgxpool.Pool
}

func NewPostgresRepo(dsn string) (*PostgresRepo, error) {
	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return nil, fmt.Errorf("ошибка парсинга DSN: %v", err)
	}

	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return nil, fmt.Errorf("не удалось создать пул: %v", err)
	}

	err = pool.Ping(context.Background())
	if err != nil {
		return nil, fmt.Errorf("база не отвечает: %v", err)
	}

	log.Println("Успешно подключено к Postgres через pgxpool!")
	return &PostgresRepo{Pool: pool}, nil
}

func (r *PostgresRepo) CreateTodoTable() error {
	query := `
	CREATE TABLE IF NOT EXISTS todos (
		id SERIAL PRIMARY KEY,
		title TEXT NOT NULL,
		status TEXT DEFAULT 'pending',
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
		completed_at TIMESTAMP WITH TIME ZONE
	);`
	_, err := r.Pool.Exec(context.Background(), query)
	return err
}

func (r *PostgresRepo) Create(ctx context.Context, title string) (int, error) {
	var id int
	query := `INSERT INTO todos (title) VALUES ($1) RETURNING id`
	err := r.Pool.QueryRow(ctx, query, title).Scan(&id)
	return id, err
}

func (r *PostgresRepo) GetAll(ctx context.Context) ([]Todo, error) {
	query := `SELECT id, title, status, created_at, completed_at FROM todos ORDER BY created_at DESC`

	rows, err := r.Pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var todos []Todo
	for rows.Next() {
		var t Todo
		err := rows.Scan(&t.ID, &t.Title, &t.Status, &t.CreatedAt, &t.CompletedAt)
		if err != nil {
			return nil, err
		}
		todos = append(todos, t)
	}
	return todos, nil
}

func (r *PostgresRepo) Update(ctx context.Context, id int, title string, status string) error {
	var completedAt *time.Time
	if status == "done" {
		now := time.Now()
		completedAt = &now
	}

	query := `UPDATE todos SET title=$1, status=$2, completed_at=$3 WHERE id=$4`
	_, err := r.Pool.Exec(ctx, query, title, status, completedAt, id)
	return err
}

func (r *PostgresRepo) Delete(ctx context.Context, id int) error {
	query := `DELETE FROM todos WHERE id=$1`
	commandTag, err := r.Pool.Exec(ctx, query, id)

	if err != nil {
		return err
	}

	if commandTag.RowsAffected() == 0 {
		return fmt.Errorf("задача с id %d не найдена", id)
	}

	return nil
}
