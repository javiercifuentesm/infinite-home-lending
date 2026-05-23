import { Fragment } from "react";
import { FileBadge, Home, MapPin } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

type TrustBarProps = {
  className?: string;
};

const TRUST_ITEMS = [
  { key: "trustBar.nmls", Icon: FileBadge },
  { key: "trustBar.region", Icon: MapPin },
  { key: "trustBar.equalHousing", Icon: Home },
] as const;

export function TrustBar({ className = "" }: TrustBarProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`w-full bg-[#1B2A4A] border-t border-[#C9A84C]/35 mt-0 pt-0 mb-0 ${className}`.trim()}
      role="region"
      aria-label="Licensing and service area"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center px-4 py-3 sm:px-6">
        <ul className="flex flex-wrap items-center justify-center gap-y-2">
          {TRUST_ITEMS.map(({ key, Icon }, index) => (
            <Fragment key={key}>
              {index > 0 ? (
                <li
                  className="mx-3 hidden h-4 w-px shrink-0 bg-[#C9A84C]/45 sm:block"
                  aria-hidden="true"
                />
              ) : null}
              <li className="flex items-center gap-2 px-1 sm:px-0">
                <Icon
                  className="h-4 w-4 shrink-0 text-[#C9A84C]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="text-[13px] font-medium tracking-wide text-white/95 sm:text-sm">
                  {t(key)}
                </span>
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
}
