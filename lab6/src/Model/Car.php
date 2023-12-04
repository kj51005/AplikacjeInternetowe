<?php

namespace App\Model;

use App\Service\Config;

class Car
{
    private ?int $id = null;
    private ?string $brand = null;
    private ?string $model = null;
    private ?int $year = null;
    private ?string $color = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Car
    {
        $this->id = $id;

        return $this;
    }

    public function getBrand(): ?string
    {
        return $this->brand;
    }

    public function setBrand(?string $brand): Car
    {
        $this->brand = $brand;

        return $this;
    }

    public function getModel(): ?string
    {
        return $this->model;
    }

    public function setModel(?string $model): Car
    {
        $this->model = $model;

        return $this;
    }

    public function getYear(): ?int
    {
        return $this->year;
    }

    public function setYear(?int $year): Car
    {
        $this->year = $year;

        return $this;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(?string $color): Car
    {
        $this->color = $color;

        return $this;
    }

    public static function fromArray($array): Car
    {
        $car = new self();
        $car->fill($array);

        return $car;
    }

    public function fill($array): Car
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['brand'])) {
            $this->setBrand($array['brand']);
        }
        if (isset($array['model'])) {
            $this->setModel($array['model']);
        }
        if (isset($array['year'])) {
            $this->setYear($array['year']);
        }
        if (isset($array['color'])) {
            $this->setColor($array['color']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM cars';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $cars = [];
        $carsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($carsArray as $carArray) {
            $cars[] = self::fromArray($carArray);
        }

        return $cars;
    }

    public static function find($id): ?Car
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM cars WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $carArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$carArray) {
            return null;
        }
        $car = Car::fromArray($carArray);

        return $car;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO cars (brand, model, year, color) VALUES (:brand, :model, :year, :color)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'brand' => $this->getBrand(),
                'model' => $this->getModel(),
                'year' => $this->getYear(),
                'color' => $this->getColor(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE cars SET brand = :brand, model = :model, year = :year, color = :color WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':brand' => $this->getBrand(),
                ':model' => $this->getModel(),
                ':year' => $this->getYear(),
                ':color' => $this->getColor(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM cars WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setBrand(null);
        $this->setModel(null);
        $this->setYear(null);
        $this->setColor(null);
    }
}
