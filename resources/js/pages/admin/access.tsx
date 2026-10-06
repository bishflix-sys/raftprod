import { Head, router, usePage } from '@inertiajs/react';
import { KeyRound, ShieldCheck, UserRoundCog, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type AccessRole = { label: string; division: string; permissions: string[] };
type AccessUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    roleLabel: string;
};

const moduleLabels: Record<string, string> = {
    overview: 'Vue générale',
    civil: 'État civil',
    finances: 'Finances',
    technical: 'Services techniques',
    hr: 'Ressources humaines',
    assets: 'Patrimoine',
    courrier: 'Courrier',
    'comptabilite-matieres': 'Comptabilité des matières',
    recettes: 'Recettes',
    domaines: 'Domaines',
    voirie: 'Voirie et travaux',
    planification: 'Planification',
    'education-culture': 'Éducation, culture, jeunesse et sport',
    archives: 'Archives',
};

export default function Access({
    users,
    roles,
    canManage,
}: {
    users: AccessUser[];
    roles: Record<string, AccessRole>;
    canManage: boolean;
}) {
    const { auth } = usePage().props;
    const [selectedRoles, setSelectedRoles] = useState<Record<number, string>>(
        Object.fromEntries(users.map((user) => [user.id, user.role])),
    );
    const [savingUser, setSavingUser] = useState<number | null>(null);
    const roleEntries = Object.entries(roles);
    const assignedCount = users.filter(
        (user) => user.role !== 'non_attribue',
    ).length;
    const groupedRoles = roleEntries.reduce<
        Record<string, [string, AccessRole][]>
    >((groups, entry) => {
        const [key, role] = entry;
        groups[role.division] ??= [];
        groups[role.division].push([key, role]);

        return groups;
    }, {});

    function saveRole(user: AccessUser) {
        const role = selectedRoles[user.id];

        if (role === user.role) return;

        setSavingUser(user.id);
        router.patch(
            `/admin/users/${user.id}/role`,
            { role },
            {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(`Rôle mis à jour pour ${user.name}`),
                onError: (errors) =>
                    toast.error(
                        Object.values(errors)[0] ??
                            'Impossible de modifier ce rôle.',
                    ),
                onFinish: () => setSavingUser(null),
            },
        );
    }

    return (
        <>
            <Head title="Gestion des accès" />
            <main className="min-h-full bg-[#f4f6f3] px-4 py-6 text-[#1d3029] sm:px-6 lg:px-9 lg:py-8">
                <div className="mx-auto max-w-[1440px] space-y-6">
                    <header className="flex flex-col justify-between gap-4 border-b border-[#dce3de] pb-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-[#527266]">
                                ADMINISTRATION · SÉCURITÉ
                            </p>
                            <h1 className="text-2xl font-semibold tracking-tight text-[#18372e] sm:text-[30px]">
                                Gestion des rôles et accès
                            </h1>
                            <p className="mt-1 max-w-2xl text-sm text-[#64766e]">
                                Affectez chaque compte au poste correspondant
                                dans l’organigramme communal.
                            </p>
                        </div>
                        <span className="inline-flex items-center gap-2 self-start border border-[#d7e0da] bg-white px-3 py-2 text-xs text-[#50675c] sm:self-auto">
                            <ShieldCheck className="size-4 text-[#397451]" />{' '}
                            Attribution sécurisée
                        </span>
                    </header>

                    <section className="grid grid-cols-1 gap-px border border-[#dce3de] bg-[#dce3de] sm:grid-cols-3">
                        <div className="bg-white p-4 sm:p-5">
                            <p className="text-xs text-[#718078]">
                                Comptes utilisateurs
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-[#19382e]">
                                {users.length}
                            </p>
                        </div>
                        <div className="bg-white p-4 sm:p-5">
                            <p className="text-xs text-[#718078]">
                                Rôles de l’organigramme
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-[#19382e]">
                                {roleEntries.length}
                            </p>
                        </div>
                        <div className="bg-white p-4 sm:p-5">
                            <p className="text-xs text-[#718078]">
                                Comptes avec rôle attribué
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-[#19382e]">
                                {assignedCount}
                                <span className="ml-2 text-xs font-normal text-[#829087]">
                                    / {users.length}
                                </span>
                            </p>
                        </div>
                    </section>

                    <section className="border border-[#dce3de] bg-white">
                        <div className="flex items-start justify-between gap-4 border-b border-[#e8ede9] p-4 sm:px-5 sm:py-4">
                            <div>
                                <h2 className="text-sm font-semibold text-[#1d392f]">
                                    Comptes de la plateforme
                                </h2>
                                <p className="mt-1 text-xs text-[#78877f]">
                                    Un compte sans rôle reste bloqué hors de son
                                    espace personnel.
                                </p>
                            </div>
                            <Users className="mt-1 size-4 shrink-0 text-[#568267]" />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left">
                                <thead className="bg-[#f8faf8] text-[10px] font-semibold tracking-[0.06em] text-[#829087] uppercase">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">
                                            Agent
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Rôle actuel
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Nouvelle affectation
                                        </th>
                                        <th className="px-5 py-3 text-right font-medium">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#edf0ed]">
                                    {users.map((user) => {
                                        const isSelf =
                                            auth.user?.id === user.id;

                                        return (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-[#fafcfb]"
                                            >
                                                <td className="px-5 py-3.5">
                                                    <p className="text-xs font-medium text-[#2c4238]">
                                                        {user.name}
                                                    </p>
                                                    <p className="mt-1 text-[10px] text-[#829087]">
                                                        {user.email}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-[10px] font-medium ${user.role === 'non_attribue' ? 'bg-[#f1f2ef] text-[#777e78]' : 'bg-[#e7f0e9] text-[#286044]'}`}
                                                    >
                                                        {user.roleLabel}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <select
                                                        aria-label={`Rôle de ${user.name}`}
                                                        disabled={
                                                            !canManage || isSelf
                                                        }
                                                        value={
                                                            selectedRoles[
                                                                user.id
                                                            ] ?? user.role
                                                        }
                                                        onChange={(event) =>
                                                            setSelectedRoles(
                                                                (current) => ({
                                                                    ...current,
                                                                    [user.id]:
                                                                        event
                                                                            .target
                                                                            .value,
                                                                }),
                                                            )
                                                        }
                                                        className="h-9 w-full max-w-[420px] border border-[#dce3de] bg-white px-2 text-xs text-[#40584b] outline-none focus:border-[#6b9880] disabled:bg-[#f5f7f5] disabled:text-[#87948c]"
                                                    >
                                                        <option value="non_attribue">
                                                            Rôle non attribué
                                                        </option>
                                                        {Object.entries(
                                                            groupedRoles,
                                                        ).map(
                                                            ([
                                                                division,
                                                                divisionRoles,
                                                            ]) => (
                                                                <optgroup
                                                                    key={
                                                                        division
                                                                    }
                                                                    label={
                                                                        division
                                                                    }
                                                                >
                                                                    {divisionRoles.map(
                                                                        ([
                                                                            key,
                                                                            role,
                                                                        ]) => (
                                                                            <option
                                                                                key={
                                                                                    key
                                                                                }
                                                                                value={
                                                                                    key
                                                                                }
                                                                            >
                                                                                {
                                                                                    role.label
                                                                                }
                                                                            </option>
                                                                        ),
                                                                    )}
                                                                </optgroup>
                                                            ),
                                                        )}
                                                    </select>
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    {canManage && !isSelf && (
                                                        <Button
                                                            size="sm"
                                                            disabled={
                                                                savingUser ===
                                                                    user.id ||
                                                                selectedRoles[
                                                                    user.id
                                                                ] === user.role
                                                            }
                                                            onClick={() =>
                                                                saveRole(user)
                                                            }
                                                            className="h-8 bg-[#246248] text-xs text-white hover:bg-[#1b5039]"
                                                        >
                                                            <KeyRound />{' '}
                                                            {savingUser ===
                                                            user.id
                                                                ? 'Enregistrement…'
                                                                : 'Enregistrer'}
                                                        </Button>
                                                    )}
                                                    {isSelf && (
                                                        <span className="text-[10px] text-[#829087]">
                                                            Votre compte
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {users.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-5 py-12 text-center text-sm text-[#75847d]"
                                            >
                                                Aucun compte utilisateur.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="border border-[#dce3de] bg-white">
                        <div className="flex items-center gap-2 border-b border-[#e8ede9] px-4 py-3.5 sm:px-5">
                            <UserRoundCog className="size-4 text-[#568267]" />
                            <h2 className="text-sm font-semibold text-[#1d392f]">
                                Rôles de l’organigramme
                            </h2>
                        </div>
                        <div className="grid gap-px bg-[#e8ede9] sm:grid-cols-2 xl:grid-cols-3">
                            {Object.entries(groupedRoles).map(
                                ([division, divisionRoles]) => (
                                    <article
                                        key={division}
                                        className="bg-white p-4"
                                    >
                                        <h3 className="text-xs font-semibold text-[#365446]">
                                            {division}
                                        </h3>
                                        <ul className="mt-2 space-y-1.5">
                                            {divisionRoles.map(
                                                ([key, role]) => {
                                                    const readable =
                                                        role.permissions
                                                            .filter(
                                                                (permission) =>
                                                                    permission.endsWith(
                                                                        '.view',
                                                                    ),
                                                            )
                                                            .map(
                                                                (permission) =>
                                                                    moduleLabels[
                                                                        permission.split(
                                                                            '.',
                                                                        )[1]
                                                                    ] ??
                                                                    permission,
                                                            )
                                                            .filter(
                                                                (label) =>
                                                                    label !==
                                                                    'Vue générale',
                                                            );
                                                    const manageable =
                                                        role.permissions
                                                            .filter(
                                                                (permission) =>
                                                                    permission.endsWith(
                                                                        '.manage',
                                                                    ),
                                                            )
                                                            .map(
                                                                (permission) =>
                                                                    moduleLabels[
                                                                        permission.split(
                                                                            '.',
                                                                        )[1]
                                                                    ] ??
                                                                    permission,
                                                            );

                                                    return (
                                                        <li
                                                            key={key}
                                                            className="border-t border-[#f0f3f0] pt-2 first:border-0 first:pt-0"
                                                        >
                                                            <p className="flex items-start gap-2 text-[11px] leading-4 text-[#40584b]">
                                                                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#83a68c]" />
                                                                {role.label}
                                                            </p>
                                                            <p className="mt-1 pl-3 text-[10px] leading-4 text-[#829087]">
                                                                Lecture :{' '}
                                                                {readable.length
                                                                    ? readable.join(
                                                                          ', ',
                                                                      )
                                                                    : 'Vue générale seulement'}
                                                            </p>
                                                            {manageable.length >
                                                                0 && (
                                                                <p className="mt-0.5 pl-3 text-[10px] leading-4 text-[#527266]">
                                                                    Gestion :{' '}
                                                                    {manageable.join(
                                                                        ', ',
                                                                    )}
                                                                </p>
                                                            )}
                                                            {role.permissions.includes(
                                                                'access.manage',
                                                            ) && (
                                                                <p className="mt-0.5 pl-3 text-[10px] leading-4 text-[#527266]">
                                                                    Gestion des
                                                                    accès
                                                                    utilisateurs
                                                                </p>
                                                            )}
                                                        </li>
                                                    );
                                                },
                                            )}
                                        </ul>
                                    </article>
                                ),
                            )}
                        </div>
                    </section>

                    <p className="border-l-2 border-[#d9ae43] bg-[#fff9e9] px-4 py-3 text-xs leading-5 text-[#756b4f]">
                        Le rôle Maire est unique. Un utilisateur ne peut pas
                        modifier son propre rôle, et le dernier compte Maire ne
                        peut pas être rétrogradé.
                    </p>
                </div>
            </main>
        </>
    );
}
