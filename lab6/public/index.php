<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

$config = new \App\Service\Config();

$templating = new \App\Service\Templating();
$router = new \App\Service\Router();

$action = $_REQUEST['action'] ?? null;

switch ($action) {
    // Obsługa modelu "Post"
    case 'post-index':
    case null:
        $postController = new \App\Controller\PostController();
        $view = $postController->indexAction($templating, $router);
        break;
    case 'post-create':
        $postController = new \App\Controller\PostController();
        $view = $postController->createAction($_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-edit':
        if (!$_REQUEST['id']) {
            break;
        }
        $postController = new \App\Controller\PostController();
        $view = $postController->editAction($_REQUEST['id'], $_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-show':
        if (!$_REQUEST['id']) {
            break;
        }
        $postController = new \App\Controller\PostController();
        $view = $postController->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'post-delete':
        if (!$_REQUEST['id']) {
            break;
        }
        $postController = new \App\Controller\PostController();
        $view = $postController->deleteAction($_REQUEST['id'], $router);
        break;

    // Obsługa modelu "Samochód"
    case 'car-index':
        $carController = new \App\Controller\CarController();
        $view = $carController->indexAction($templating, $router);
        break;
    case 'car-create':
        $carController = new \App\Controller\CarController();
        $view = $carController->createAction($_REQUEST['car'] ?? null, $templating, $router);
        break;
    case 'car-edit':
        if (!$_REQUEST['id']) {
            break;
        }
        $carController = new \App\Controller\CarController();
        $view = $carController->editAction($_REQUEST['id'], $_REQUEST['car'] ?? null, $templating, $router);
        break;
    case 'car-show':
        if (!$_REQUEST['id']) {
            break;
        }
        $carController = new \App\Controller\CarController();
        $view = $carController->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'car-delete':
        if (!$_REQUEST['id']) {
            break;
        }
        $carController = new \App\Controller\CarController();
        $view = $carController->deleteAction($_REQUEST['id'], $router);
        break;

    case 'info':
        $infoController = new \App\Controller\InfoController();
        $view = $infoController->infoAction();
        break;
    default:
        $view = 'Not found';
        break;
}

if ($view) {
    echo $view;
}
