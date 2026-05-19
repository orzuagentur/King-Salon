import { getSalonContact } from "@/lib/data/settings";
import { containerClassName } from "@/lib/layout/classes";
import { getFormattedLocalAddress, localBusiness } from "@/lib/seo/local";

export async function LocalBusinessInfo() {
  const contact = await getSalonContact();

  return (
    <section
      aria-label="Standort King Salon Celle"
      className="border-t border-border bg-surface/40 px-[max(1.25rem,env(safe-area-inset-left))] py-10 pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-8 lg:px-12"
    >
      <div className={containerClassName}>
        <div className="grid gap-6 md:grid-cols-2">
          <address className="not-italic">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
              Standort in Celle
            </p>
            <p className="mt-4 text-lg font-semibold text-foreground">{localBusiness.name}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{getFormattedLocalAddress()}</p>
            <p className="mt-4">
              <a
                className="text-sm font-semibold text-gold transition hover:text-gold-soft"
                href={`tel:${contact.phone}`}
              >
                {contact.phoneDisplay}
              </a>
            </p>
          </address>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
              Einzugsgebiet
            </p>
            <p className="mt-4 text-sm leading-7 text-muted">
              King Salon bedient Kunden aus Celle und der umliegenden Region in Niedersachsen –
              ideal erreichbar in der Hehlentorstraße im Zentrum von Celle.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {localBusiness.areaServed.map((area) => (
                <li
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground"
                  key={area}
                >
                  {area}
                </li>
              ))}
            </ul>
            <a
              className="mt-5 inline-flex text-sm font-semibold text-gold transition hover:text-gold-soft"
              href={contact.googleMapsUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Auf Google Maps anzeigen
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
