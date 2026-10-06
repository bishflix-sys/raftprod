import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-[#246248] text-white">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-semibold">
                    Mairie de Sébikotane
                </span>
                <span className="mt-0.5 truncate text-[9px] leading-tight tracking-[0.06em] text-muted-foreground uppercase">
                    Administration communale
                </span>
            </div>
        </>
    );
}
