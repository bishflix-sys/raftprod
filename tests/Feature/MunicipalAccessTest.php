<?php

use App\Models\User;
use App\Support\MunicipalRoles;

test('new accounts have no municipal access until a role is assigned', function () {
    $user = User::factory()->create();

    expect($user->municipal_role)->toBe(MunicipalRoles::UNASSIGNED);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertForbidden();
});

test('a role can access only the modules granted to it', function () {
    $clerk = User::factory()->create(['municipal_role' => 'bureau_etat_civil']);

    $this->actingAs($clerk)
        ->get(route('dashboard', ['module' => 'civil']))
        ->assertOk();

    $this->actingAs($clerk)
        ->get(route('dashboard', ['module' => 'finances']))
        ->assertForbidden();
});

test('only permitted users can view and manage role assignments', function () {
    $secretary = User::factory()->create(['municipal_role' => 'secretaire_municipal']);
    $target = User::factory()->create();

    $this->actingAs($secretary)
        ->get(route('admin.access.index'))
        ->assertOk();

    $this->actingAs($secretary)
        ->patch(route('admin.users.role.update', $target), ['role' => 'bureau_recettes'])
        ->assertForbidden();

    expect($target->fresh()->municipal_role)->toBe(MunicipalRoles::UNASSIGNED);
});

test('the mayor can assign a role but cannot change their own role', function () {
    $mayor = User::factory()->create(['municipal_role' => 'maire']);
    $target = User::factory()->create();

    $this->actingAs($mayor)
        ->patch(route('admin.users.role.update', $target), ['role' => 'bureau_recettes'])
        ->assertRedirect(route('admin.access.index'));

    expect($target->fresh()->municipal_role)->toBe('bureau_recettes');

    $this->actingAs($mayor)
        ->patch(route('admin.users.role.update', $mayor), ['role' => 'bureau_recettes'])
        ->assertUnprocessable();
});

test('the last mayor cannot be demoted and invalid roles are rejected', function () {
    $mayor = User::factory()->create(['municipal_role' => 'maire']);
    $this->actingAs($mayor);

    $target = User::factory()->create();

    $this->patch(route('admin.users.role.update', $target), ['role' => 'nonexistent'])
        ->assertSessionHasErrors('role');

    $this->patch(route('admin.users.role.update', $mayor), ['role' => 'cabinet_maire'])
        ->assertUnprocessable();

    expect($mayor->fresh()->municipal_role)->toBe('maire');
});

test('every office in the municipal organization has a defined role', function () {
    expect(MunicipalRoles::all())->toHaveKeys([
        'maire',
        'cabinet_maire',
        'secretaire_municipal',
        'bureau_informatique',
        'bureau_courrier',
        'division_administration_finances',
        'bureau_comptabilite_matieres',
        'bureau_recettes',
        'division_services_techniques',
        'bureau_domaines_patrimoine',
        'bureau_voirie_travaux',
        'division_planification_competences',
        'bureau_planification_developpement',
        'bureau_education_culture_jeunesse_sport',
        'division_etat_civil_archives',
        'bureau_etat_civil',
        'bureau_archives',
    ]);
});
