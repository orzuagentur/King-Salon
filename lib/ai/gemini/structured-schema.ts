import { SchemaType, type ResponseSchema } from "@google/generative-ai";

export const aiResponseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    text: {
      type: SchemaType.STRING,
      description: "Hauptantwort in natürlicher Sprache, kurz und premium.",
    },
    blocks: {
      type: SchemaType.ARRAY,
      description: "Optionale strukturierte Blöcke für Tabellen, Infos oder CTAs.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          type: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          columns: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          rows: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
          },
          items: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                label: { type: SchemaType.STRING },
                value: { type: SchemaType.STRING },
              },
            },
          },
          label: { type: SchemaType.STRING },
          action: { type: SchemaType.STRING },
        },
      },
    },
  },
  required: ["text"],
};

export const structuredResponseInstruction = `
ANTWORTFORMAT:
Antworte IMMER als gültiges JSON-Objekt (kein Markdown außerhalb des JSON):
{
  "text": "Kurze, hilfreiche Antwort",
  "blocks": [ optional ]
}

Erlaubte block.type Werte:
- "table" mit columns[] und rows[][]
- "key_value" mit items[{label,value}] (Preise, Kontakt, Öffnungszeiten)
- "list" mit items[] (Leistungen, FAQ)
- "cta" mit label und action ("book" | "contact")

Nutze blocks für Preise, Öffnungszeiten, Services, Kontakt und Buchungs-Hinweise.
Bei aktiver Terminbuchung: genau eine klare Frage pro Antwort, nur verfügbare Zeiten/Meister aus dem Kontext.
`.trim();
