import { careersColors, careersFonts } from "./careersTheme";

const FOUNDER_SRC = "/about/javier-cifuentes-founder.jpg";
const COFOUNDER_SRC = "/about/alma-jaramillo-portrait.jpg";

const FOUNDERS = [
  {
    name: "Javier Cifuentes",
    role: "Co-Founder",
    src: FOUNDER_SRC,
    alt: "Javier Cifuentes, Co-Founder of Infinite Home Lending",
    objectPosition: "center 22%",
  },
  {
    name: "Alma Jaramillo",
    role: "Co-Founder",
    src: COFOUNDER_SRC,
    alt: "Alma Jaramillo, Co-Founder of Infinite Home Lending",
    objectPosition: "center",
  },
] as const;

export function FounderPresencePanel() {
  return (
    <div className="mx-auto grid max-w-[300px] grid-cols-1 gap-10 sm:max-w-none sm:grid-cols-2 sm:gap-6 lg:gap-8">
      {FOUNDERS.map((founder) => (
        <figure key={founder.name} className="flex flex-col">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={founder.src}
              alt={founder.alt}
              className="h-full w-full object-cover"
              style={{ objectPosition: founder.objectPosition }}
              loading="lazy"
              decoding="async"
              width={400}
              height={500}
            />
          </div>
          <figcaption className="mt-5 flex items-start gap-3">
            <div
              className="mt-[9px] h-px w-7 shrink-0"
              style={{ background: careersColors.gold }}
              aria-hidden
            />
            <div>
              <p
                className="text-[15px]"
                style={{ fontFamily: careersFonts.heading, color: careersColors.navy }}
              >
                {founder.name}
              </p>
              <p
                className="mt-1 text-[10px] uppercase tracking-[0.1em]"
                style={{ color: "rgba(46,46,46,0.45)" }}
              >
                {founder.role}
              </p>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
