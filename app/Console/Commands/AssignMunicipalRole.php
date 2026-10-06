<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Support\MunicipalRoles;
use Illuminate\Console\Command;

class AssignMunicipalRole extends Command
{
    protected $signature = 'municipality:assign-role {email} {role}';

    protected $description = 'Assign a municipal role to an existing user account';

    public function handle(): int
    {
        $email = (string) $this->argument('email');
        $role = (string) $this->argument('role');

        if (! array_key_exists($role, MunicipalRoles::all())) {
            $this->error('Unknown role. Available roles: '.implode(', ', array_keys(MunicipalRoles::all())));

            return self::FAILURE;
        }

        $user = User::query()->where('email', $email)->first();

        if (! $user) {
            $this->error("No user found for {$email}.");

            return self::FAILURE;
        }

        if ($role === 'maire' && User::query()->where('municipal_role', 'maire')->whereKeyNot($user->getKey())->exists()) {
            $this->error('A Maire account is already assigned.');

            return self::FAILURE;
        }

        $user->forceFill(['municipal_role' => $role])->save();
        $this->info("Assigned {$role} to {$user->email}.");

        return self::SUCCESS;
    }
}
