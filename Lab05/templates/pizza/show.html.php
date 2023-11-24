<?php

/** @var \App\Model\Pizza $pizza */
/** @var \App\Service\Router $router */

$title = "{$pizza->getPizzaName()} ({$pizza->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $pizza->getPizzaName() ?></h1>
    <article>
        <?= $pizza->getDescription();?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('pizza-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('pizza-edit', ['id'=> $pizza->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';

