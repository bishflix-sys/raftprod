<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\MunicipalRoles;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AccessController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/access', [
            'users' => User::query()
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'municipal_role'])
                ->map(fn (User $user): array => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->municipal_role,
                    'roleLabel' => $user->municipalRoleLabel(),
                ]),
            'roles' => MunicipalRoles::assignable(),
            'canManage' => auth()->user()?->can('manage-access') ?? false,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', Rule::in(array_keys(MunicipalRoles::all()))],
        ]);

        abort_if($request->user()->is($user), 422, 'Vous ne pouvez pas modifier votre propre rôle.');

        DB::transaction(function () use ($user, $validated): void {
            User::query()->lockForUpdate()->get(['id']);
            $newRole = $validated['role'];
            $currentMayors = User::query()->where('municipal_role', 'maire')->count();

            abort_if(
                $user->municipal_role === 'maire' && $newRole !== 'maire' && $currentMayors <= 1,
                422,
                'Le dernier compte Maire ne peut pas être rétrogradé.',
            );

            abort_if(
                $newRole === 'maire' && User::query()->where('municipal_role', 'maire')->whereKeyNot($user->getKey())->exists(),
                422,
                'Un seul compte peut porter le rôle Maire.',
            );

            $user->forceFill(['municipal_role' => $newRole])->save();
        });

        return to_route('admin.access.index')->with('success', 'Le rôle a été mis à jour.');
    }
}
