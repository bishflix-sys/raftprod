<?php

namespace App\Providers;

use App\Models\User;
use App\Support\MunicipalRoles;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

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
        $this->configureDefaults();

        Gate::define('view-access', fn (User $user): bool => $user->hasMunicipalPermission('access.view'));
        Gate::define('manage-access', fn (User $user): bool => $user->hasMunicipalPermission('access.manage'));
        Gate::define('manage-system', fn (User $user): bool => $user->hasMunicipalPermission('system.manage'));

        $permissions = array_unique(array_merge(...array_values(array_map(
            static fn (array $role): array => $role['permissions'],
            MunicipalRoles::all(),
        ))));

        foreach ($permissions as $permission) {
            Gate::define($permission, fn (User $user): bool => $user->hasMunicipalPermission($permission));
        }
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
