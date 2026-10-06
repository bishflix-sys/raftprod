import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    CircleCheck,
    Clock3,
    FileText,
    Landmark,
    MapPin,
    ShieldCheck,
    Users,
    Wallet,
    Wrench,
} from 'lucide-react';
import { dashboard, login } from '@/routes';

const departments = [
    {
        title: 'État civil',
        detail: 'Actes et registres',
        icon: FileText,
        color: 'text-[#a94d39]',
        bg: 'bg-[#fae9e4]',
    },
    {
        title: 'Finances',
        detail: 'Budget et recettes',
        icon: Wallet,
        color: 'text-[#8a691f]',
        bg: 'bg-[#fbf1dc]',
    },
    {
        title: 'Services techniques',
        detail: 'Voirie et interventions',
        icon: Wrench,
        color: 'text-[#356478]',
        bg: 'bg-[#e8eff2]',
    },
    {
        title: 'Ressources humaines',
        detail: 'Agents et présences',
        icon: Users,
        color: 'text-[#2e684b]',
        bg: 'bg-[#e7f0e9]',
    },
];

export default function Portal() {
    const { auth } = usePage().props;
    const entryUrl = auth.user ? dashboard() : login();

    return (
        <>
            <Head title="Portail municipal" />
            <main className="min-h-screen bg-[#f3f6f3] text-[#1d3029]">
                <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
                    <Link href={entryUrl} className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center bg-[#246248] text-white">
                            <Landmark className="size-5" />
                        </span>
                        <span>
                            <span className="block text-sm leading-tight font-semibold text-[#19382e]">
                                Mairie de Sébikotane
                            </span>
                            <span className="mt-1 block text-[9px] font-medium tracking-[0.08em] text-[#718078] uppercase">
                                Administration communale
                            </span>
                        </span>
                    </Link>
                    <span className="hidden items-center gap-2 text-xs text-[#6c7d74] sm:flex">
                        <MapPin className="size-3.5" /> Région de Dakar ·
                        Sénégal
                    </span>
                </header>

                <div className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:pb-10">
                    <section className="relative flex min-h-[430px] flex-col justify-between overflow-hidden bg-[#1d4939] px-6 py-9 text-white sm:px-10 sm:py-12 lg:min-h-[670px] lg:px-14 lg:py-14">
                        <div className="absolute top-0 right-0 h-56 w-56 translate-x-1/3 -translate-y-1/3 border border-white/10" />
                        <div className="absolute top-8 right-8 h-40 w-40 translate-x-1/3 -translate-y-1/3 border border-white/10" />
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 border border-white/20 px-3 py-1.5 text-[10px] font-semibold tracking-[0.09em] text-[#d7e9dd] uppercase">
                                <Building2 className="size-3.5" /> Espace
                                municipal
                            </div>
                            <h1 className="mt-8 max-w-lg text-4xl leading-[1.08] font-semibold sm:text-5xl">
                                Mairie de
                                <br />
                                Sébikotane
                            </h1>
                            <p className="mt-5 max-w-md text-sm leading-6 text-[#c3d8ca]">
                                Portail de gestion administrative et de suivi
                                des services communaux.
                            </p>
                        </div>

                        <div className="relative mt-12 grid grid-cols-2 gap-px border border-white/15 bg-white/15 sm:grid-cols-4">
                            {departments.map((department) => {
                                const Icon = department.icon;

                                return (
                                    <div
                                        key={department.title}
                                        className="min-h-[115px] bg-[#1d4939] p-3 sm:p-4"
                                    >
                                        <span
                                            className={`mb-3 flex size-8 items-center justify-center ${department.bg} ${department.color}`}
                                        >
                                            <Icon className="size-4" />
                                        </span>
                                        <p className="text-[11px] leading-4 font-semibold text-white">
                                            {department.title}
                                        </p>
                                        <p className="mt-1 text-[9px] leading-4 text-[#b2cbb9]">
                                            {department.detail}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="relative mt-8 text-[10px] tracking-[0.04em] text-[#a9c4b1]">
                            SERVICE PUBLIC · PROXIMITÉ · TRANSPARENCE
                        </p>
                    </section>

                    <section className="flex flex-col justify-between border border-[#e1e8e2] bg-white px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
                        <div>
                            <div className="mb-10 flex items-center gap-2 text-[10px] font-semibold tracking-[0.08em] text-[#65816f] uppercase">
                                <ShieldCheck className="size-4" /> Accès
                                sécurisé
                            </div>
                            <p className="text-xs font-medium text-[#718078]">
                                Bienvenue dans votre espace
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#19382e]">
                                Administration municipale
                            </h2>
                            <p className="mt-3 max-w-sm text-sm leading-6 text-[#708078]">
                                Connectez-vous pour accéder aux dossiers, aux
                                services et aux indicateurs de la commune.
                            </p>
                            <Link
                                href={entryUrl}
                                className="mt-8 inline-flex h-11 items-center justify-center gap-2 bg-[#246248] px-5 text-sm font-medium text-white transition-colors hover:bg-[#1b5039]"
                            >
                                {auth.user
                                    ? 'Ouvrir mon espace'
                                    : 'Se connecter'}
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>

                        <div className="mt-14 border-t border-[#e8ede9] pt-6">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-xs font-semibold text-[#365446]">
                                    Services numériques
                                </p>
                                <span className="inline-flex items-center gap-1.5 text-[10px] text-[#5c8067]">
                                    <CircleCheck className="size-3.5" />{' '}
                                    Opérationnels
                                </span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-[#f0f3f0] pb-3">
                                    <span className="text-xs text-[#61746a]">
                                        Plateforme administrative
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-[10px] text-[#5c8067]">
                                        <span className="size-1.5 rounded-full bg-[#5d9870]" />{' '}
                                        Disponible
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[#61746a]">
                                        Accueil municipal
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-[10px] text-[#7c8178]">
                                        <Clock3 className="size-3" /> Lun. –
                                        Ven. · 08 h – 17 h
                                    </span>
                                </div>
                            </div>
                            <p className="mt-8 text-[10px] leading-5 text-[#95a098]">
                                Les informations présentées dans l’espace de
                                démonstration sont fictives et ne constituent
                                pas des données officielles de la commune.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
