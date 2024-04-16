<?php
/** @var $pizza ?\App\Model\Pizza */
?>

<div class="form-group">
    <label for="pizzaName">Pizza Name</label>
    <input type="text" id="pizzaName" name="pizza[pizzaName]" value="<?= $pizza ? $pizza->getPizzaName() : '' ?>">
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="pizza[description]"><?= $pizza? $pizza->getDescription() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
