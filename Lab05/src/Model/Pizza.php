<?php
namespace App\Model;

use App\Service\Config;

class Pizza
{
    private ?int $id = null;
    private ?string $pizzaName = null;
    private ?string $description = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Pizza
    {
        $this->id = $id;

        return $this;
    }

    public function getPizzaName(): ?string
    {
        return $this->pizzaName;
    }

    public function setPizzaName(?string $pizzaName): Pizza
    {
        $this->pizzaName = $pizzaName;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): Pizza
    {
        $this->description = $description;

        return $this;
    }

    public static function fromArray($array): Pizza
    {
        $pizza = new self();
        $pizza->fill($array);

        return $pizza;
    }

    public function fill($array): Pizza
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['pizzaName'])) {
            $this->setPizzaName($array['pizzaName']);
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM pizza';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $pizzas = [];
        $pizzasArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($pizzasArray as $pizzaArray) {
            $pizzas[] = self::fromArray($pizzaArray);
        }

        return $pizzas;
    }

    public static function find($id): ?Pizza
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM pizza WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $pizzaArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $pizzaArray) {
            return null;
        }
        $pizza = Pizza::fromArray($pizzaArray);

        return $pizza;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO pizza (pizzaName, description) VALUES (:pizzaName, :description)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'pizzaName' => $this->getPizzaName(),
                'description' => $this->getDescription(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE pizza SET pizzaName = :pizzaName, description = :description WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':pizzaName' => $this->getPizzaName(),
                ':description' => $this->getDescription(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM pizza WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setPizzaName(null);
        $this->setDescription(null);
    }
}
