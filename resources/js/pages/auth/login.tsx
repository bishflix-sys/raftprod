import { Form, Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Building2, LockKeyhole, ShieldCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Connexion" />
            <main className="grid min-h-svh bg-[#f5f6f2] text-[#1d3029] lg:grid-cols-[1.08fr_0.92fr]">
                <section className="relative isolate flex min-h-[270px] flex-col justify-between overflow-hidden bg-[#173f32] px-5 py-4 text-white sm:px-10 sm:py-8 lg:min-h-svh lg:px-14 lg:py-10 xl:px-20">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.13]"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(235,244,237,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(235,244,237,.6) 1px, transparent 1px)',
                            backgroundSize: '42px 42px',
                        }}
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute top-[20%] right-[-5rem] -z-10 size-[24rem] rotate-45 border border-white/10"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute top-[26%] right-[-2rem] -z-10 size-[16rem] rotate-45 border border-white/10"
                    />

                    <Link
                        href={home()}
                        className="inline-flex w-fit items-center gap-3"
                    >
                        <span className="flex size-11 items-center justify-center bg-[#d9b24d] text-[#183d31]">
                            <Building2 className="size-5" />
                        </span>
                        <span>
                            <span className="block text-sm leading-tight font-semibold">
                                Mairie de Sébikotane
                            </span>
                            <span className="mt-1 block text-[9px] font-medium tracking-[0.12em] text-[#c5d8c9] uppercase">
                                Administration communale
                            </span>
                        </span>
                    </Link>

                    <div className="relative mt-6 max-w-2xl pb-1 sm:mt-10 sm:pb-2 lg:mt-0 lg:pb-10">
                        <p className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-[#e1c978] uppercase sm:mb-5">
                            <span className="h-px w-7 bg-[#d9b24d]" /> Espace
                            professionnel
                        </p>
                        <h1 className="max-w-xl text-[32px] leading-[1.08] font-semibold sm:text-[48px] lg:text-[54px]">
                            Administrer.
                            <br />
                            Coordonner.
                            <br />
                            <span className="text-[#dfc260]">Servir.</span>
                        </h1>
                        <p className="mt-3 max-w-md text-sm leading-5 text-[#d0dfd4] sm:mt-6 sm:text-[15px] sm:leading-6">
                            Le portail interne des services municipaux de
                            Sébikotane.
                        </p>
                        <div className="mt-5 hidden items-center gap-3 border-t border-white/15 pt-5 text-xs text-[#c5d8c9] sm:mt-9 sm:flex">
                            <ShieldCheck className="size-4 text-[#dfc260]" />
                            <span>Accès réservé aux agents habilités</span>
                        </div>
                    </div>

                    <div className="relative hidden items-center justify-between border-t border-white/15 pt-5 text-[9px] font-medium tracking-[0.12em] text-[#b4cabb] uppercase sm:flex">
                        <span>République du Sénégal</span>
                        <span
                            className="flex h-1.5 w-12 overflow-hidden"
                            aria-label="Couleurs du drapeau sénégalais"
                        >
                            <span className="flex-1 bg-[#159447]" />
                            <span className="flex-1 bg-[#e3c54f]" />
                            <span className="flex-1 bg-[#d95045]" />
                        </span>
                    </div>
                </section>

                <section className="flex min-h-[520px] flex-col justify-between px-6 py-5 sm:px-10 sm:py-10 lg:min-h-svh lg:px-12 lg:py-12 xl:px-20">
                    <div className="flex justify-end">
                        <Link
                            href={home()}
                            className="text-xs font-medium text-[#64766e] underline-offset-4 hover:text-[#246248] hover:underline"
                        >
                            Retour au portail municipal
                        </Link>
                    </div>

                    <div className="mx-auto w-full max-w-[420px] py-6 sm:py-10 lg:py-16">
                        <div className="mb-9">
                            <p className="mb-3 text-[10px] font-semibold tracking-[0.14em] text-[#6c8c75] uppercase">
                                Connexion sécurisée
                            </p>
                            <h2 className="text-[28px] leading-tight font-semibold tracking-tight text-[#19382e] sm:text-[32px]">
                                Bienvenue dans votre espace
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-[#718078]">
                                Connectez-vous avec vos identifiants
                                professionnels.
                            </p>
                        </div>

                        {status && (
                            <div
                                role="status"
                                className="mb-5 border-l-2 border-[#4f8b65] bg-[#eaf2eb] px-3 py-2.5 text-sm text-[#315e40]"
                            >
                                {status}
                            </div>
                        )}

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-xs font-semibold text-[#40584b]"
                                        >
                                            Adresse e-mail professionnelle
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="nom@mairie.sn"
                                            className="h-12 rounded-none border-[#d9e1da] bg-white px-3 text-sm placeholder:text-[#a2ada5] focus-visible:border-[#699278] focus-visible:ring-[#699278]/20"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between gap-3">
                                            <Label
                                                htmlFor="password"
                                                className="text-xs font-semibold text-[#40584b]"
                                            >
                                                Mot de passe
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-xs text-[#47765a] hover:text-[#214b36]"
                                                    tabIndex={5}
                                                >
                                                    Mot de passe oublié ?
                                                </TextLink>
                                            )}
                                        </div>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="Saisissez votre mot de passe"
                                            className="h-12 rounded-none border-[#d9e1da] bg-white px-3 text-sm placeholder:text-[#a2ada5] focus-visible:border-[#699278] focus-visible:ring-[#699278]/20"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center justify-between gap-3 pt-1">
                                        <div className="flex items-center gap-2.5">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="rounded-none border-[#bccbc0] data-[state=checked]:bg-[#246248]"
                                            />
                                            <Label
                                                htmlFor="remember"
                                                className="text-xs font-normal text-[#64766e]"
                                            >
                                                Garder ma session ouverte
                                            </Label>
                                        </div>
                                        <span className="inline-flex items-center gap-1.5 text-[10px] text-[#819087]">
                                            <LockKeyhole className="size-3" />{' '}
                                            Connexion protégée
                                        </span>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-3 h-12 w-full justify-between rounded-none bg-[#246248] px-4 text-sm font-semibold text-white hover:bg-[#1b5039]"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            {processing ? <Spinner /> : null} Se
                                            connecter
                                        </span>
                                        {!processing && (
                                            <ArrowRight className="size-4" />
                                        )}
                                    </Button>
                                </>
                            )}
                        </Form>

                        <p className="mt-7 border-t border-[#e1e8e2] pt-5 text-[11px] leading-5 text-[#849188]">
                            Besoin d’un accès ? Adressez-vous au Bureau
                            Informatique ou au Secrétariat municipal.
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-[#e1e8e2] pt-4 text-[10px] text-[#8b9890]">
                        <span>© Mairie de Sébikotane</span>
                        <span>Plateforme administrative</span>
                    </div>
                </section>
            </main>
        </>
    );
}
