<?php

namespace App\Support;

final class MunicipalRoles
{
    public const UNASSIGNED = 'non_attribue';

    /**
     * @return array<string, array{label: string, division: string, permissions: list<string>}>
     */
    public static function all(): array
    {
        $allModules = [
            'overview', 'civil', 'finances', 'technical', 'hr', 'assets', 'courrier',
            'comptabilite-matieres', 'recettes', 'domaines', 'voirie', 'planification',
            'education-culture', 'archives',
        ];
        $view = static fn (array $modules): array => array_map(
            static fn (string $module): string => "module.{$module}.view",
            $modules,
        );
        $manage = static fn (array $modules): array => array_map(
            static fn (string $module): string => "module.{$module}.manage",
            $modules,
        );

        return [
            'maire' => [
                'label' => 'Maire',
                'division' => 'Exécutif local',
                'permissions' => [...$view($allModules), ...$manage($allModules), 'access.view', 'access.manage'],
            ],
            'cabinet_maire' => [
                'label' => 'Cabinet du Maire',
                'division' => 'Exécutif local',
                'permissions' => [...$view(['overview', 'finances', 'planification', 'education-culture']), 'module.courrier.view'],
            ],
            'secretaire_municipal' => [
                'label' => 'Secrétaire Municipal',
                'division' => 'Administration générale',
                'permissions' => [...$view($allModules), 'access.view'],
            ],
            'bureau_informatique' => [
                'label' => 'Bureau Informatique',
                'division' => 'Administration générale',
                'permissions' => [...$view(['overview']), 'access.view', 'system.manage'],
            ],
            'bureau_courrier' => [
                'label' => 'Bureau Courrier',
                'division' => 'Administration générale',
                'permissions' => [...$view(['overview', 'courrier']), ...$manage(['courrier'])],
            ],
            'division_administration_finances' => [
                'label' => 'Division Administration générale et des Finances',
                'division' => 'Administration générale et des Finances',
                'permissions' => [...$view(['overview', 'finances', 'comptabilite-matieres', 'recettes']), ...$manage(['finances', 'comptabilite-matieres', 'recettes'])],
            ],
            'bureau_comptabilite_matieres' => [
                'label' => 'Bureau de la Comptabilité des matières',
                'division' => 'Administration générale et des Finances',
                'permissions' => [...$view(['overview', 'comptabilite-matieres']), ...$manage(['comptabilite-matieres'])],
            ],
            'bureau_recettes' => [
                'label' => 'Bureau des Recettes',
                'division' => 'Administration générale et des Finances',
                'permissions' => [...$view(['overview', 'finances', 'recettes']), ...$manage(['recettes'])],
            ],
            'division_services_techniques' => [
                'label' => 'Division Services Techniques',
                'division' => 'Services Techniques',
                'permissions' => [...$view(['overview', 'technical', 'assets', 'domaines', 'voirie']), ...$manage(['technical', 'assets', 'domaines', 'voirie'])],
            ],
            'bureau_domaines_patrimoine' => [
                'label' => 'Bureau des Domaines, du Patrimoine et des Équipements marchands',
                'division' => 'Services Techniques',
                'permissions' => [...$view(['overview', 'assets', 'domaines']), ...$manage(['assets', 'domaines'])],
            ],
            'bureau_voirie_travaux' => [
                'label' => 'Bureau de la Voirie, des Travaux, des Réseaux, de l’Entretien et de la Maintenance',
                'division' => 'Services Techniques',
                'permissions' => [...$view(['overview', 'technical', 'voirie']), ...$manage(['technical', 'voirie'])],
            ],
            'division_planification_competences' => [
                'label' => 'Division Planification et des Compétences transférées',
                'division' => 'Planification et Compétences transférées',
                'permissions' => [...$view(['overview', 'planification', 'education-culture']), ...$manage(['planification', 'education-culture'])],
            ],
            'bureau_planification_developpement' => [
                'label' => 'Bureau Planification, Ressources naturelles et Développement durable',
                'division' => 'Planification et Compétences transférées',
                'permissions' => [...$view(['overview', 'planification']), ...$manage(['planification'])],
            ],
            'bureau_education_culture_jeunesse_sport' => [
                'label' => 'Bureau de l’Éducation, de la Culture, de la Jeunesse et du Sport',
                'division' => 'Planification et Compétences transférées',
                'permissions' => [...$view(['overview', 'education-culture']), ...$manage(['education-culture'])],
            ],
            'division_etat_civil_archives' => [
                'label' => 'Division État Civil et Archives',
                'division' => 'État Civil et Archives',
                'permissions' => [...$view(['overview', 'civil', 'archives']), ...$manage(['civil', 'archives'])],
            ],
            'bureau_etat_civil' => [
                'label' => 'Bureau de l’État Civil',
                'division' => 'État Civil et Archives',
                'permissions' => [...$view(['overview', 'civil']), ...$manage(['civil'])],
            ],
            'bureau_archives' => [
                'label' => 'Bureau des Archives',
                'division' => 'État Civil et Archives',
                'permissions' => [...$view(['overview', 'archives']), ...$manage(['archives'])],
            ],
        ];
    }

    /** @return list<string> */
    public static function permissionsFor(?string $role): array
    {
        return self::all()[$role]['permissions'] ?? [];
    }

    /**
     * @return array<string, array{label: string, division: string, permissions: list<string>}>
     */
    public static function assignable(): array
    {
        return array_map(
            static fn (array $role): array => [
                'label' => $role['label'],
                'division' => $role['division'],
                'permissions' => $role['permissions'],
            ],
            self::all(),
        );
    }
}
