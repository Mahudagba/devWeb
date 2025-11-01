<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Dedoc\Scramble\Scramble;
use Illuminate\Routing\Route;
use Dedoc\Scramble\Support\Generator\OpenApi;
use Dedoc\Scramble\Support\Generator\SecurityScheme;

use Illuminate\Support\Facades\Gate;
use App\Models\User;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Scramble::configure()
        ->routes(function (Route $route) {
            return Str::startsWith($route->uri, 'api/');
        });
        //
        Scramble::configure()
        ->withDocumentTransformers(function (OpenApi $openApi) {
            $openApi->secure(
                SecurityScheme::http('bearer')
            );
        });

        // $this->registerPolicies();

        Gate::define('manage-users', function (User $user) {
            return $user->role === 'admin';
        });

        Gate::define('manage-products', function (User $user) {
            return $user->role === 'admin';
        });

        Gate::define('manage-categories', function (User $user) {
            return $user->role === 'admin';
        });

        Gate::define('manage-stats', function (User $user) {
            return $user->role === 'admin';
        });

        Gate::define('manage-orders', function (User $user) {
            return in_array($user->role, ['admin', 'manager']);
        });
    }
}
