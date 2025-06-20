<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\HandleUserRole;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias(
            [
                'role' => \App\Http\Middleware\HandleUserRole::class,
            ]
        );
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Throwable $e, Request $request) {
            // Check if it's an Inertia request
            if ($request->header('X-Inertia')) {
                $status = 500; // Default status for generic errors

                // Determine the correct HTTP status code if it's an HTTP exception
                if ($e instanceof HttpException) {
                    $status = $e->getStatusCode();
                }

                // Render your Inertia 404/Error component
                // (e.g., resources/js/Pages/Errors/404.jsx)
                if ($status === 404) {
                    return Inertia::render('NotFound')
                        ->toResponse($request)
                        ->setStatusCode($status);
                }
            }

            // Return null to let Laravel's default exception handler take over.
            return null;
        });
    })->create();
