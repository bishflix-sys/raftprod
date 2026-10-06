import { Head, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    Bell,
    BriefcaseBusiness,
    CalendarDays,
    Check,
    ChevronDown,
    CircleDollarSign,
    Clock3,
    Download,
    Archive,
    ChartNoAxesCombined,
    FileText,
    Filter,
    FolderCog,
    Landmark,
    Mail,
    MapPin,
    School,
    Search,
    Users,
    Wallet,
    Wrench,
    type LucideIcon,
} from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { Auth } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { dashboard } from '@/routes';

type ModuleKey =
    | 'overview'
    | 'civil'
    | 'finances'
    | 'technical'
    | 'hr'
    | 'assets'
    | 'courrier'
    | 'comptabilite-matieres'
    | 'recettes'
    | 'domaines'
    | 'voirie'
    | 'planification'
    | 'education-culture'
    | 'archives';
type RecordStatus = 'À traiter' | 'En cours' | 'Validé' | 'En attente';
type WorkRecord = {
    id: string;
    module: Exclude<ModuleKey, 'overview'>;
    title: string;
    person: string;
    category: string;
    date: string;
    status: RecordStatus;
};
type Metric = {
    label: string;
    value: string;
    note: string;
    icon: LucideIcon;
    tone: string;
    direction: 'up' | 'down' | 'steady';
};

const moduleDetails: Record<
    ModuleKey,
    { title: string; description: string; metrics: Metric[] }
> = {
    overview: {
        title: 'Vue générale',
        description:
            'Les opérations essentielles de la commune, réunies au même endroit.',
        metrics: [
            {
                label: 'Dossiers actifs',
                value: '248',
                note: '+12 cette semaine',
                icon: FileText,
                tone: 'green',
                direction: 'up',
            },
            {
                label: 'Recettes du mois',
                value: '18,4 M',
                note: 'FCFA · objectif 72 %',
                icon: CircleDollarSign,
                tone: 'gold',
                direction: 'up',
            },
            {
                label: 'Demandes à traiter',
                value: '36',
                note: '8 depuis hier',
                icon: Clock3,
                tone: 'coral',
                direction: 'down',
            },
            {
                label: 'Agents mobilisés',
                value: '84',
                note: 'sur 96 agents',
                icon: Users,
                tone: 'blue',
                direction: 'steady',
            },
        ],
    },
    civil: {
        title: 'État civil',
        description:
            'Registres, actes et demandes citoyennes en cours de traitement.',
        metrics: [
            {
                label: 'Actes délivrés',
                value: '1 284',
                note: '+8 % ce trimestre',
                icon: FileText,
                tone: 'green',
                direction: 'up',
            },
            {
                label: 'Naissances',
                value: '86',
                note: 'ce mois-ci',
                icon: Users,
                tone: 'blue',
                direction: 'up',
            },
            {
                label: 'En attente',
                value: '18',
                note: 'dont 4 urgents',
                icon: Clock3,
                tone: 'coral',
                direction: 'down',
            },
            {
                label: 'Délai moyen',
                value: '2,4 j',
                note: 'objectif : 3 jours',
                icon: Activity,
                tone: 'gold',
                direction: 'down',
            },
        ],
    },
    finances: {
        title: 'Finances & recettes',
        description:
            'Suivi budgétaire, recouvrement et dépenses de fonctionnement.',
        metrics: [
            {
                label: 'Recettes encaissées',
                value: '18,4 M',
                note: 'FCFA ce mois',
                icon: Wallet,
                tone: 'green',
                direction: 'up',
            },
            {
                label: 'Budget engagé',
                value: '64 %',
                note: 'exercice 2026',
                icon: CircleDollarSign,
                tone: 'gold',
                direction: 'steady',
            },
            {
                label: 'Titres à recouvrer',
                value: '42',
                note: '12,8 M FCFA',
                icon: FileText,
                tone: 'coral',
                direction: 'down',
            },
            {
                label: 'Dépenses validées',
                value: '9,2 M',
                note: 'FCFA ce mois',
                icon: Check,
                tone: 'blue',
                direction: 'up',
            },
        ],
    },
    technical: {
        title: 'Services techniques',
        description:
            'Interventions, voirie, éclairage public et demandes de proximité.',
        metrics: [
            {
                label: 'Interventions ouvertes',
                value: '27',
                note: '6 prioritaires',
                icon: Wrench,
                tone: 'coral',
                direction: 'down',
            },
            {
                label: 'Résolues ce mois',
                value: '63',
                note: '+14 %',
                icon: Check,
                tone: 'green',
                direction: 'up',
            },
            {
                label: 'Équipes terrain',
                value: '8',
                note: 'sur 10 disponibles',
                icon: Users,
                tone: 'blue',
                direction: 'steady',
            },
            {
                label: 'Délai moyen',
                value: '3,1 j',
                note: 'objectif : 4 jours',
                icon: Clock3,
                tone: 'gold',
                direction: 'down',
            },
        ],
    },
    hr: {
        title: 'Ressources humaines',
        description:
            'Effectifs, présences et demandes administratives des agents.',
        metrics: [
            {
                label: 'Effectif communal',
                value: '96',
                note: 'agents titulaires et contractuels',
                icon: Users,
                tone: 'green',
                direction: 'steady',
            },
            {
                label: 'Présents aujourd’hui',
                value: '84',
                note: '87,5 % de l’effectif',
                icon: Check,
                tone: 'blue',
                direction: 'up',
            },
            {
                label: 'Congés à valider',
                value: '7',
                note: '2 à examiner aujourd’hui',
                icon: CalendarDays,
                tone: 'coral',
                direction: 'down',
            },
            {
                label: 'Postes à pourvoir',
                value: '3',
                note: 'services prioritaires',
                icon: BriefcaseBusiness,
                tone: 'gold',
                direction: 'steady',
            },
        ],
    },
    assets: {
        title: 'Patrimoine communal',
        description: 'Bâtiments, équipements et véhicules de la collectivité.',
        metrics: [
            {
                label: 'Biens inventoriés',
                value: '312',
                note: 'sur 328 recensés',
                icon: Landmark,
                tone: 'green',
                direction: 'up',
            },
            {
                label: 'En maintenance',
                value: '11',
                note: '3 interventions ouvertes',
                icon: Wrench,
                tone: 'coral',
                direction: 'down',
            },
            {
                label: 'Véhicules disponibles',
                value: '14 / 18',
                note: 'parc roulant',
                icon: BriefcaseBusiness,
                tone: 'blue',
                direction: 'steady',
            },
            {
                label: 'Sites communaux',
                value: '23',
                note: 'bâtiments et espaces',
                icon: MapPin,
                tone: 'gold',
                direction: 'steady',
            },
        ],
    },
    courrier: {
        title: 'Bureau Courrier',
        description:
            'Enregistrement, affectation et suivi des courriers entrants et sortants.',
        metrics: [
            {
                label: 'Courriers entrants',
                value: '42',
                note: 'ce mois-ci',
                icon: FileText,
                tone: 'blue',
                direction: 'up',
            },
            {
                label: 'À affecter',
                value: '8',
                note: 'dont 2 urgents',
                icon: Clock3,
                tone: 'coral',
                direction: 'down',
            },
            {
                label: 'Réponses attendues',
                value: '13',
                note: 'services municipaux',
                icon: Mail,
                tone: 'gold',
                direction: 'steady',
            },
            {
                label: 'Traités',
                value: '31',
                note: 'depuis le 1er octobre',
                icon: Check,
                tone: 'green',
                direction: 'up',
            },
        ],
    },
    'comptabilite-matieres': {
        title: 'Comptabilité des matières',
        description:
            'Suivi des entrées, sorties et inventaires des biens et fournitures.',
        metrics: [
            {
                label: 'Articles en inventaire',
                value: '312',
                note: 'dernière mise à jour : 30 sept.',
                icon: FolderCog,
                tone: 'green',
                direction: 'steady',
            },
            {
                label: 'Mouvements à valider',
                value: '9',
                note: 'depuis cette semaine',
                icon: Clock3,
                tone: 'coral',
                direction: 'down',
            },
            {
                label: 'Bons de sortie',
                value: '26',
                note: 'ce mois-ci',
                icon: FileText,
                tone: 'blue',
                direction: 'up',
            },
            {
                label: 'Alertes de stock',
                value: '4',
                note: 'seuil minimum atteint',
                icon: Activity,
                tone: 'gold',
                direction: 'down',
            },
        ],
    },
    recettes: {
        title: 'Bureau des Recettes',
        description:
            'Émission des titres, encaissements et suivi du recouvrement communal.',
        metrics: [
            {
                label: 'Recettes encaissées',
                value: '18,4 M',
                note: 'FCFA ce mois',
                icon: Wallet,
                tone: 'green',
                direction: 'up',
            },
            {
                label: 'Titres à recouvrer',
                value: '42',
                note: '12,8 M FCFA',
                icon: FileText,
                tone: 'coral',
                direction: 'down',
            },
            {
                label: 'Quittances émises',
                value: '186',
                note: 'depuis le 1er octobre',
                icon: Check,
                tone: 'blue',
                direction: 'up',
            },
            {
                label: 'Objectif mensuel',
                value: '72 %',
                note: '25,5 M FCFA prévus',
                icon: CircleDollarSign,
                tone: 'gold',
                direction: 'steady',
            },
        ],
    },
    domaines: {
        title: 'Domaines et équipements marchands',
        description:
            'Occupation du domaine public, patrimoine foncier et équipements marchands.',
        metrics: [
            {
                label: 'Emplacements recensés',
                value: '128',
                note: 'marchés et domaine public',
                icon: MapPin,
                tone: 'green',
                direction: 'steady',
            },
            {
                label: 'Autorisations actives',
                value: '84',
                note: 'toutes zones',
                icon: Check,
                tone: 'blue',
                direction: 'up',
            },
            {
                label: 'Demandes à instruire',
                value: '12',
                note: '3 déposées cette semaine',
                icon: Clock3,
                tone: 'coral',
                direction: 'down',
            },
            {
                label: 'Redevances dues',
                value: '5,6 M',
                note: 'FCFA en recouvrement',
                icon: Wallet,
                tone: 'gold',
                direction: 'steady',
            },
        ],
    },
    voirie: {
        title: 'Voirie, travaux et maintenance',
        description:
            'Programmation des travaux, réseaux et interventions sur les équipements communaux.',
        metrics: [
            {
                label: 'Interventions ouvertes',
                value: '27',
                note: '6 prioritaires',
                icon: Wrench,
                tone: 'coral',
                direction: 'down',
            },
            {
                label: 'Chantiers en cours',
                value: '5',
                note: '3 quartiers concernés',
                icon: BriefcaseBusiness,
                tone: 'blue',
                direction: 'steady',
            },
            {
                label: 'Demandes clôturées',
                value: '63',
                note: 'ce mois-ci',
                icon: Check,
                tone: 'green',
                direction: 'up',
            },
            {
                label: 'Délai moyen',
                value: '3,1 j',
                note: 'objectif : 4 jours',
                icon: Clock3,
                tone: 'gold',
                direction: 'down',
            },
        ],
    },
    planification: {
        title: 'Planification et développement durable',
        description:
            'Programmes communaux, ressources naturelles et suivi du développement durable.',
        metrics: [
            {
                label: 'Programmes actifs',
                value: '12',
                note: 'exercice 2026',
                icon: ChartNoAxesCombined,
                tone: 'green',
                direction: 'steady',
            },
            {
                label: 'Actions à suivre',
                value: '19',
                note: '4 échéances ce mois',
                icon: Clock3,
                tone: 'gold',
                direction: 'down',
            },
            {
                label: 'Projets réalisés',
                value: '68 %',
                note: 'avancement annuel',
                icon: Check,
                tone: 'blue',
                direction: 'up',
            },
            {
                label: 'Demandes citoyennes',
                value: '23',
                note: 'à intégrer au plan',
                icon: Users,
                tone: 'coral',
                direction: 'steady',
            },
        ],
    },
    'education-culture': {
        title: 'Éducation, culture, jeunesse et sport',
        description:
            'Suivi des équipements, activités et compétences transférées à la commune.',
        metrics: [
            {
                label: 'Établissements suivis',
                value: '18',
                note: 'écoles et structures',
                icon: School,
                tone: 'blue',
                direction: 'steady',
            },
            {
                label: 'Activités programmées',
                value: '9',
                note: 'ce trimestre',
                icon: CalendarDays,
                tone: 'green',
                direction: 'up',
            },
            {
                label: 'Demandes de soutien',
                value: '7',
                note: 'à examiner',
                icon: Clock3,
                tone: 'coral',
                direction: 'down',
            },
            {
                label: 'Équipements sportifs',
                value: '6',
                note: 'sites communaux',
                icon: Activity,
                tone: 'gold',
                direction: 'steady',
            },
        ],
    },
    archives: {
        title: 'Archives communales',
        description:
            'Classement, conservation et communication des archives administratives.',
        metrics: [
            {
                label: 'Dossiers inventoriés',
                value: '2 416',
                note: 'fonds communal',
                icon: Archive,
                tone: 'green',
                direction: 'up',
            },
            {
                label: 'Versements à classer',
                value: '14',
                note: 'en attente de traitement',
                icon: Clock3,
                tone: 'coral',
                direction: 'down',
            },
            {
                label: 'Demandes de consultation',
                value: '8',
                note: 'ce mois-ci',
                icon: FileText,
                tone: 'blue',
                direction: 'steady',
            },
            {
                label: 'Fonds numérisés',
                value: '38 %',
                note: 'objectif annuel : 50 %',
                icon: Check,
                tone: 'gold',
                direction: 'up',
            },
        ],
    },
};

const seedRecords: WorkRecord[] = [
    {
        id: 'EC-2026-0842',
        module: 'civil',
        title: 'Copie intégrale d’acte de naissance',
        person: 'Mariam Ndiaye',
        category: 'État civil',
        date: 'Aujourd’hui',
        status: 'À traiter',
    },
    {
        id: 'ST-2026-0318',
        module: 'technical',
        title: 'Réparation éclairage public',
        person: 'Quartier de Darou',
        category: 'Éclairage',
        date: 'Aujourd’hui',
        status: 'En cours',
    },
    {
        id: 'FI-2026-0096',
        module: 'finances',
        title: 'Validation bon de commande',
        person: 'Service achats',
        category: 'Dépense',
        date: '06 oct. 2026',
        status: 'En attente',
    },
    {
        id: 'RH-2026-0143',
        module: 'hr',
        title: 'Demande de congé annuel',
        person: 'Moussa Diop',
        category: 'Ressources humaines',
        date: '06 oct. 2026',
        status: 'À traiter',
    },
    {
        id: 'EC-2026-0839',
        module: 'civil',
        title: 'Extrait de naissance',
        person: 'Abdoulaye Fall',
        category: 'État civil',
        date: '05 oct. 2026',
        status: 'Validé',
    },
    {
        id: 'PA-2026-0027',
        module: 'assets',
        title: 'Contrôle du groupe électrogène',
        person: 'Centre administratif',
        category: 'Patrimoine',
        date: '05 oct. 2026',
        status: 'En cours',
    },
    {
        id: 'ST-2026-0311',
        module: 'technical',
        title: 'Signalement dépôt sauvage',
        person: 'Quartier de Sébi Fass',
        category: 'Hygiène',
        date: '04 oct. 2026',
        status: 'À traiter',
    },
    {
        id: 'FI-2026-0091',
        module: 'finances',
        title: 'Redevance d’occupation du domaine',
        person: 'Commerçant · marché',
        category: 'Recettes',
        date: '03 oct. 2026',
        status: 'Validé',
    },
    {
        id: 'CO-2026-0042',
        module: 'courrier',
        title: 'Affectation courrier entrant',
        person: 'Préfecture de Rufisque',
        category: 'Courrier entrant',
        date: 'Aujourd’hui',
        status: 'À traiter',
    },
    {
        id: 'CM-2026-0018',
        module: 'comptabilite-matieres',
        title: 'Bon de sortie fournitures',
        person: 'Service administratif',
        category: 'Mouvement de stock',
        date: 'Aujourd’hui',
        status: 'En attente',
    },
    {
        id: 'RE-2026-0186',
        module: 'recettes',
        title: 'Quittance redevance marchande',
        person: 'Marché central',
        category: 'Encaissement',
        date: '06 oct. 2026',
        status: 'Validé',
    },
    {
        id: 'DO-2026-0012',
        module: 'domaines',
        title: 'Autorisation d’occupation temporaire',
        person: 'Awa Sarr',
        category: 'Domaine public',
        date: '05 oct. 2026',
        status: 'En cours',
    },
    {
        id: 'VT-2026-0027',
        module: 'voirie',
        title: 'Réfection chaussée quartier Darou',
        person: 'Service technique',
        category: 'Travaux de voirie',
        date: '05 oct. 2026',
        status: 'En cours',
    },
    {
        id: 'PL-2026-0019',
        module: 'planification',
        title: 'Suivi du plan communal annuel',
        person: 'Division planification',
        category: 'Programme communal',
        date: '04 oct. 2026',
        status: 'À traiter',
    },
    {
        id: 'ECJ-2026-0009',
        module: 'education-culture',
        title: 'Appui activité sportive scolaire',
        person: 'École élémentaire',
        category: 'Jeunesse et sport',
        date: '04 oct. 2026',
        status: 'En attente',
    },
    {
        id: 'AR-2026-0014',
        module: 'archives',
        title: 'Classement versement administratif',
        person: 'Secrétariat municipal',
        category: 'Archives',
        date: '03 oct. 2026',
        status: 'À traiter',
    },
];

const statusFilters = [
    'Tous',
    'À traiter',
    'En cours',
    'En attente',
    'Validé',
] as const;

function statusStyle(status: RecordStatus) {
    if (status === 'Validé') return 'bg-[#e6f1e9] text-[#286044]';
    if (status === 'En cours') return 'bg-[#e7eff3] text-[#315c70]';
    if (status === 'En attente') return 'bg-[#fff2d9] text-[#8a6315]';
    return 'bg-[#fae9e3] text-[#9e4937]';
}

export default function Dashboard() {
    const { url, props } = usePage<{ auth: Auth }>();
    const { auth } = props;
    const moduleFromUrl = new URL(url, 'http://localhost').searchParams.get(
        'module',
    );
    const activeModule: ModuleKey =
        moduleFromUrl && moduleFromUrl in moduleDetails
            ? (moduleFromUrl as ModuleKey)
            : 'overview';
    const details = moduleDetails[activeModule];
    const [records, setRecords] = useState(seedRecords);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] =
        useState<(typeof statusFilters)[number]>('Tous');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newPerson, setNewPerson] = useState('');

    const visibleRecords = useMemo(
        () =>
            records.filter((record) => {
                const belongsToModule =
                    activeModule === 'overview' ||
                    record.module === activeModule;
                const matchesStatus =
                    activeFilter === 'Tous' || record.status === activeFilter;
                const searchValue =
                    `${record.id} ${record.title} ${record.person} ${record.category}`.toLocaleLowerCase(
                        'fr',
                    );

                return (
                    belongsToModule &&
                    matchesStatus &&
                    searchValue.includes(search.toLocaleLowerCase('fr'))
                );
            }),
        [activeFilter, activeModule, records, search],
    );

    function exportRecords() {
        const rows = [
            [
                'Référence',
                'Dossier',
                'Demandeur / service',
                'Catégorie',
                'Date',
                'Statut',
            ],
            ...visibleRecords.map((record) => [
                record.id,
                record.title,
                record.person,
                record.category,
                record.date,
                record.status,
            ]),
        ];
        const csv = rows
            .map((row) =>
                row
                    .map((value) => `"${value.replaceAll('"', '""')}"`)
                    .join(';'),
            )
            .join('\n');
        const file = new Blob(['\ufeff', csv], {
            type: 'text/csv;charset=utf-8',
        });
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sebikotane-${activeModule}-dossiers.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Export CSV téléchargé');
    }

    function createRecord(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const module = activeModule === 'overview' ? 'civil' : activeModule;
        const prefix: Record<Exclude<ModuleKey, 'overview'>, string> = {
            civil: 'EC',
            finances: 'FI',
            technical: 'ST',
            hr: 'RH',
            assets: 'PA',
            courrier: 'CO',
            'comptabilite-matieres': 'CM',
            recettes: 'RE',
            domaines: 'DO',
            voirie: 'VT',
            planification: 'PL',
            'education-culture': 'ECJ',
            archives: 'AR',
        };
        const nextNumber = String(records.length + 1).padStart(4, '0');

        setRecords((current) => [
            {
                id: `${prefix[module]}-2026-${nextNumber}`,
                module,
                title: newTitle,
                person: newPerson,
                category: details.title,
                date: 'Aujourd’hui',
                status: 'À traiter',
            },
            ...current,
        ]);
        setNewTitle('');
        setNewPerson('');
        setDialogOpen(false);
        toast.success('Dossier ajouté à la liste de démonstration');
    }

    return (
        <>
            <Head title="Pilotage communal" />
            <div className="min-h-full bg-[#f4f6f3] px-4 py-6 text-[#1d3029] sm:px-6 lg:px-9 lg:py-8">
                <div className="mx-auto max-w-[1500px] space-y-6">
                    <header className="flex flex-col justify-between gap-5 border-b border-[#dce3de] pb-5 md:flex-row md:items-end">
                        <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-[0.08em] text-[#527266]">
                                <span>COMMUNE DE SÉBIKOTANE</span>
                                <span className="text-[#c3cec7]">/</span>
                                <span>ADMINISTRATION</span>
                                <span className="rounded-sm bg-[#e4eee7] px-2 py-1 text-[#286044]">
                                    DÉMO
                                </span>
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight text-[#18372e] sm:text-[30px]">
                                {details.title}
                            </h1>
                            <p className="mt-1 max-w-2xl text-sm text-[#64766e]">
                                {details.description}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="mr-1 hidden items-center gap-2 text-sm text-[#5a7066] sm:flex">
                                <CalendarDays className="size-4" />
                                <span>Mar. 6 oct. 2026</span>
                            </div>
                            <div className="relative">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-[#d7e0da] bg-white text-[#38574b]"
                                    aria-label="Notifications"
                                    title="Notifications"
                                    onClick={() =>
                                        setNotificationsOpen((open) => !open)
                                    }
                                >
                                    <Bell />
                                </Button>
                                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#d9674e] ring-2 ring-white" />
                                {notificationsOpen && (
                                    <div className="absolute top-11 right-0 z-20 w-72 border border-[#dce3de] bg-white p-4 shadow-lg">
                                        <p className="text-sm font-semibold">
                                            À ne pas manquer
                                        </p>
                                        <p className="mt-2 text-xs leading-5 text-[#64766e]">
                                            8 nouveaux dossiers attendent une
                                            première affectation.
                                        </p>
                                        <p className="mt-2 border-t border-[#edf0ed] pt-2 text-xs text-[#64766e]">
                                            Réunion de coordination · 10 h 30
                                        </p>
                                    </div>
                                )}
                            </div>
                            {auth.user?.permissions.includes(
                                `module.${activeModule === 'overview' ? 'civil' : activeModule}.manage`,
                            ) && (
                                <Button
                                    onClick={() => setDialogOpen(true)}
                                    className="bg-[#246248] text-white hover:bg-[#1b5039]"
                                >
                                    <FileText />
                                    Nouveau dossier
                                </Button>
                            )}
                        </div>
                    </header>

                    <div className="flex flex-col justify-between gap-3 border-l-[3px] border-[#d9ae43] bg-[#fff9e9] px-4 py-3 sm:flex-row sm:items-center">
                        <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 size-4 shrink-0 text-[#9b7621]" />
                            <div>
                                <p className="text-sm font-medium text-[#4c4329]">
                                    Point de coordination · Centre administratif
                                </p>
                                <p className="mt-0.5 text-xs text-[#756b4f]">
                                    Aujourd’hui à 10 h 30 · Salle du conseil
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="inline-flex items-center gap-1 self-start text-xs font-semibold text-[#755d20] hover:text-[#3f3210] sm:self-center"
                        >
                            Voir l’agenda <ArrowRight className="size-3.5" />
                        </button>
                    </div>

                    <section
                        aria-label="Indicateurs communaux"
                        className="grid grid-cols-1 gap-px border border-[#dce3de] bg-[#dce3de] sm:grid-cols-2 xl:grid-cols-4"
                    >
                        {details.metrics.map((metric) => {
                            const Icon = metric.icon;
                            const Trend =
                                metric.direction === 'down'
                                    ? ArrowDownRight
                                    : ArrowUpRight;
                            const toneClass = {
                                green: 'bg-[#e7f0e9] text-[#2e684b]',
                                gold: 'bg-[#fbf1dc] text-[#91701f]',
                                coral: 'bg-[#f8e9e4] text-[#a74e3a]',
                                blue: 'bg-[#e8eff2] text-[#356478]',
                            }[metric.tone];

                            return (
                                <article
                                    key={metric.label}
                                    className="flex min-h-[132px] items-start justify-between bg-white p-4 sm:p-5"
                                >
                                    <div>
                                        <p className="text-xs font-medium text-[#6e7e76]">
                                            {metric.label}
                                        </p>
                                        <p className="mt-3 text-[27px] leading-none font-semibold tracking-tight text-[#19382e]">
                                            {metric.value}
                                        </p>
                                        <p className="mt-2 flex items-center gap-1 text-xs text-[#77867f]">
                                            {metric.direction !== 'steady' && (
                                                <Trend className="size-3.5 text-[#568267]" />
                                            )}
                                            {metric.note}
                                        </p>
                                    </div>
                                    <span
                                        className={`flex size-9 items-center justify-center ${toneClass}`}
                                    >
                                        <Icon className="size-[17px]" />
                                    </span>
                                </article>
                            );
                        })}
                    </section>

                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(270px,0.85fr)]">
                        <section className="min-w-0 border border-[#dce3de] bg-white">
                            <div className="flex flex-col justify-between gap-4 border-b border-[#e8ede9] p-4 sm:flex-row sm:items-center sm:px-5">
                                <div>
                                    <p className="text-base font-semibold text-[#1d392f]">
                                        {activeModule === 'overview'
                                            ? 'Suivi des dossiers'
                                            : `Registre · ${details.title}`}
                                    </p>
                                    <p className="mt-1 text-xs text-[#718078]">
                                        Demandes récentes et actions en attente
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <label className="flex h-9 min-w-40 items-center gap-2 border border-[#dce3de] px-3 text-[#75847d] focus-within:border-[#6b9880]">
                                        <Search className="size-4 shrink-0" />
                                        <input
                                            value={search}
                                            onChange={(event) =>
                                                setSearch(event.target.value)
                                            }
                                            placeholder="Rechercher"
                                            className="w-full bg-transparent text-xs text-[#273d33] outline-none placeholder:text-[#99a49e]"
                                            aria-label="Rechercher un dossier"
                                        />
                                    </label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={exportRecords}
                                        className="h-9 border-[#dce3de] text-[#4e675b]"
                                    >
                                        <Download />
                                        <span className="hidden sm:inline">
                                            Exporter
                                        </span>
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 overflow-x-auto border-b border-[#e8ede9] px-4 sm:px-5">
                                <Filter className="mr-2 size-3.5 shrink-0 text-[#88968f]" />
                                {statusFilters.map((filter) => (
                                    <button
                                        key={filter}
                                        type="button"
                                        onClick={() => setActiveFilter(filter)}
                                        className={`relative shrink-0 px-2 py-3 text-xs transition-colors ${activeFilter === filter ? 'font-semibold text-[#246248]' : 'text-[#78877f] hover:text-[#294b3a]'}`}
                                    >
                                        {filter}
                                        {activeFilter === filter && (
                                            <span className="absolute right-2 bottom-0 left-2 h-[2px] bg-[#246248]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[720px] text-left">
                                    <thead className="bg-[#f8faf8] text-[10px] font-semibold tracking-[0.06em] text-[#829087] uppercase">
                                        <tr>
                                            <th className="px-5 py-3 font-medium">
                                                Référence / dossier
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Demandeur / service
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Date
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Statut
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                <span className="sr-only">
                                                    Ouvrir
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#edf0ed]">
                                        {visibleRecords.map((record) => (
                                            <tr
                                                key={record.id}
                                                className="group hover:bg-[#fafcfb]"
                                            >
                                                <td className="px-5 py-3.5">
                                                    <p className="text-[10px] font-semibold tracking-wide text-[#839188]">
                                                        {record.id}
                                                    </p>
                                                    <p className="mt-1 text-xs font-medium text-[#2c4238]">
                                                        {record.title}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <p className="text-xs text-[#40584b]">
                                                        {record.person}
                                                    </p>
                                                    <p className="mt-1 text-[10px] text-[#8b9891]">
                                                        {record.category}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3.5 text-xs text-[#718078]">
                                                    {record.date}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-[10px] font-medium whitespace-nowrap ${statusStyle(record.status)}`}
                                                    >
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <button
                                                        type="button"
                                                        title={`Ouvrir ${record.id}`}
                                                        aria-label={`Ouvrir ${record.id}`}
                                                        onClick={() =>
                                                            toast.info(
                                                                `${record.id} · ${record.title}`,
                                                            )
                                                        }
                                                        className="flex size-7 items-center justify-center text-[#8a9990] hover:bg-[#edf3ef] hover:text-[#246248]"
                                                    >
                                                        <ArrowRight className="size-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {visibleRecords.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-5 py-12 text-center text-sm text-[#75847d]"
                                                >
                                                    Aucun dossier ne correspond
                                                    à cette recherche.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex items-center justify-between border-t border-[#e8ede9] px-5 py-3 text-[11px] text-[#829087]">
                                <span>
                                    {visibleRecords.length} dossier
                                    {visibleRecords.length > 1 ? 's' : ''}{' '}
                                    affiché
                                    {visibleRecords.length > 1 ? 's' : ''}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setActiveFilter('Tous')}
                                    className="font-medium text-[#376c52] hover:text-[#1d4834]"
                                >
                                    Réinitialiser les filtres
                                </button>
                            </div>
                        </section>

                        <aside className="space-y-6">
                            <section className="border border-[#dce3de] bg-white">
                                <div className="flex items-start justify-between p-4 pb-2 sm:p-5 sm:pb-2">
                                    <div>
                                        <p className="text-sm font-semibold text-[#1d392f]">
                                            Activité des services
                                        </p>
                                        <p className="mt-1 text-xs text-[#78877f]">
                                            Dossiers traités · 7 derniers jours
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        title="Choisir la période"
                                        aria-label="Choisir la période"
                                        className="flex size-8 items-center justify-center text-[#77867f] hover:bg-[#f1f5f2]"
                                    >
                                        <ChevronDown className="size-4" />
                                    </button>
                                </div>
                                <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                                    <div className="mb-4 flex items-baseline gap-2">
                                        <span className="text-2xl font-semibold text-[#19382e]">
                                            186
                                        </span>
                                        <span className="flex items-center text-[11px] font-medium text-[#4d805f]">
                                            <ArrowUpRight className="size-3.5" />{' '}
                                            12 %
                                        </span>
                                    </div>
                                    <div className="flex h-28 items-end gap-2 border-b border-[#e8ede9]">
                                        {[42, 63, 52, 78, 58, 90, 71].map(
                                            (height, index) => (
                                                <div
                                                    key={index}
                                                    className="flex h-full flex-1 flex-col justify-end gap-2"
                                                >
                                                    <div
                                                        className={`min-h-1 transition-all ${index === 5 ? 'bg-[#d4ab40]' : 'bg-[#79a58a]'}`}
                                                        style={{
                                                            height: `${height}%`,
                                                        }}
                                                    />
                                                </div>
                                            ),
                                        )}
                                    </div>
                                    <div className="mt-2 flex justify-between text-[9px] text-[#8a9890]">
                                        <span>Mer.</span>
                                        <span>Jeu.</span>
                                        <span>Ven.</span>
                                        <span>Sam.</span>
                                        <span>Dim.</span>
                                        <span>Lun.</span>
                                        <span>Mar.</span>
                                    </div>
                                </div>
                            </section>

                            <section className="border border-[#dce3de] bg-white">
                                <div className="flex items-center justify-between border-b border-[#e8ede9] px-4 py-3.5 sm:px-5">
                                    <div>
                                        <p className="text-sm font-semibold text-[#1d392f]">
                                            Vie de la commune
                                        </p>
                                        <p className="mt-1 text-xs text-[#78877f]">
                                            Repères du territoire
                                        </p>
                                    </div>
                                    <MapPin className="size-4 text-[#568267]" />
                                </div>
                                <div className="space-y-3 p-4 sm:p-5">
                                    {[
                                        [
                                            'Sébikotane centre',
                                            '12 480 hab.',
                                            82,
                                        ],
                                        ['Sébi Fass', '8 260 hab.', 61],
                                        ['Darou', '6 940 hab.', 48],
                                    ].map(([district, population, bar]) => (
                                        <div key={district}>
                                            <div className="mb-1.5 flex items-center justify-between text-[11px]">
                                                <span className="font-medium text-[#40584b]">
                                                    {district}
                                                </span>
                                                <span className="text-[#839188]">
                                                    {population}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-[#edf1ee]">
                                                <div
                                                    className="h-full bg-[#6e9b7d]"
                                                    style={{ width: `${bar}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <p className="border-t border-[#edf0ed] pt-3 text-[10px] leading-4 text-[#8a9890]">
                                        Indicateurs territoriaux à confirmer
                                        avec les données communales.
                                    </p>
                                </div>
                            </section>
                        </aside>
                    </div>

                    <footer className="flex flex-col gap-2 border-t border-[#dce3de] pt-4 text-[10px] text-[#829087] sm:flex-row sm:items-center sm:justify-between">
                        <span>
                            Plateforme de gestion administrative · Commune de
                            Sébikotane
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-[#5d9870]" />{' '}
                            Tous les services sont opérationnels
                        </span>
                    </footer>
                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="border-[#dce3de] bg-[#fbfcfb] sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-[#1d392f]">
                            Créer un dossier
                        </DialogTitle>
                        <DialogDescription>
                            Ajoutez une demande à la file de démonstration de{' '}
                            {details.title.toLocaleLowerCase('fr')}.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={createRecord} className="space-y-4">
                        <label className="block space-y-1.5 text-xs font-medium text-[#40584b]">
                            Objet de la demande
                            <input
                                required
                                value={newTitle}
                                onChange={(event) =>
                                    setNewTitle(event.target.value)
                                }
                                placeholder="Ex. Demande de document"
                                className="h-10 w-full border border-[#dce3de] bg-white px-3 text-sm font-normal outline-none focus:border-[#6b9880]"
                            />
                        </label>
                        <label className="block space-y-1.5 text-xs font-medium text-[#40584b]">
                            Demandeur ou service
                            <input
                                required
                                value={newPerson}
                                onChange={(event) =>
                                    setNewPerson(event.target.value)
                                }
                                placeholder="Nom du demandeur"
                                className="h-10 w-full border border-[#dce3de] bg-white px-3 text-sm font-normal outline-none focus:border-[#6b9880]"
                            />
                        </label>
                        <DialogFooter>
                            <Button
                                type="submit"
                                className="bg-[#246248] text-white hover:bg-[#1b5039]"
                            >
                                Créer le dossier
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
