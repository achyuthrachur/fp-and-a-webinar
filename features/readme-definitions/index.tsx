"use client";

import { dataLineage } from "@/content/readme/dataLineage";
import { definitions } from "@/content/readme/definitions";
import { glossary } from "@/content/readme/glossary";
import { scenarioGuidance } from "@/content/readme/scenarioGuidance";

export default function ReadmeDefinitionsFeature() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <article className="rounded-xl bg-white p-4 shadow-[var(--shadow-1)]">
        <h3 className="mb-2 text-sm font-semibold text-[rgb(var(--indigo-dark))]">Business Glossary</h3>
        <ul className="space-y-2 text-sm">
          {glossary.map((g) => (
            <li key={g.term}><span className="font-semibold">{g.term}:</span> {g.definition}</li>
          ))}
        </ul>
      </article>

      <article className="rounded-xl bg-white p-4 shadow-[var(--shadow-1)]">
        <h3 className="mb-2 text-sm font-semibold text-[rgb(var(--indigo-dark))]">Metric Formulas</h3>
        <ul className="space-y-2 text-sm">{definitions.map((d) => <li key={d}>{d}</li>)}</ul>
      </article>

      <article className="rounded-xl bg-white p-4 shadow-[var(--shadow-1)]">
        <h3 className="mb-2 text-sm font-semibold text-[rgb(var(--indigo-dark))]">Data Lineage</h3>
        <ul className="space-y-2 text-sm">{dataLineage.map((d) => <li key={d}>{d}</li>)}</ul>
      </article>

      <article className="rounded-xl bg-white p-4 shadow-[var(--shadow-1)]">
        <h3 className="mb-2 text-sm font-semibold text-[rgb(var(--indigo-dark))]">Scenario Guidance and Caveats</h3>
        <ul className="space-y-2 text-sm">{scenarioGuidance.map((d) => <li key={d}>{d}</li>)}</ul>
      </article>
    </section>
  );
}
