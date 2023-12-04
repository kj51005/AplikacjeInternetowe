-- Usunięcie tabeli, jeśli istnieje
DROP TABLE IF EXISTS cars;

-- Tworzenie nowej tabeli
CREATE TABLE IF NOT EXISTS cars
(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    color TEXT NOT NULL
);