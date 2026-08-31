import { MarkdownDocument } from "model/format/markdown";
import { TasksPluginFormat } from "model/format/reminder-tasks-plugin";
import {
  ReminderFormatConfig,
  ReminderFormatParameterKey,
} from "./reminder-base";

const SPECIMEN: Array<[string, string]> = [
  ["s1 code-span", "- [ ] `⏳` this cannot be parsed ➕ 2026-08-17"],
  ["s2 [w]+real", "- [w] this is [w] task1➕ 2026-08-17⏳ 2026-08-17"],
  ["s3 [-]cancel", "- [-] cancelled task1 ➕ 2026-08-17 ⏳ 2026-08-17"],
  ["s4 no-date", "- [ ] scenario4  ⏳ without date is parsed? ➕ 2026-08-17"],
  [
    "s5 real-at-end",
    "- [ ] scenario5 ⏳ without date and scheduled date in the end ➕ 2026-08-17 ⏳ 2026-08-17",
  ],
  ["vault conv", "- [v] regra ⏳ 2026-08-23 ➕ 2026-08-09 🆔 b29-regra"],
  ["due only", "- [ ] alvo-D due 📅 2026-08-25"],
  ["start only", "- [ ] alvo-E start 🛫 2026-08-25"],
  ["clock only", "- [ ] alvo-G ⏰ 2026-08-25 14:30"],
  ["clock+due", "- [ ] par ⏰ 2026-08-25 14:30 📅 2026-08-25"],
  ["clock+junk", "- [ ] ruido ⏰ 2026-08-25 14:30 🆔 foo"],
  ["due+junk", "- [ ] x 📅 2026-08-25 🆔 foo"],
  ["due no-date", "- [ ] x 📅 sem data aqui ➕ 2026-08-17"],
  ["start no-date", "- [ ] x 🛫 sem data aqui ➕ 2026-08-17"],
  ["clock no-date", "- [ ] x ⏰ sem data aqui ➕ 2026-08-17"],
];

function run(ce: boolean, fb: boolean, st: boolean, md: string) {
  const sut = new TasksPluginFormat();
  const config = new ReminderFormatConfig();
  config.setParameterValue(
    ReminderFormatParameterKey.useCustomEmojiForTasksPlugin,
    ce,
  );
  config.setParameterValue(
    ReminderFormatParameterKey.useReminderTimeFallbackForTasksPlugin,
    fb,
  );
  config.setParameterValue(ReminderFormatParameterKey.strictDateFormat, st);
  sut.setConfig(config);
  const spans = sut.parse(new MarkdownDocument("file", md));
  if (spans.length === 0) return "—";
  return spans.map((s) => s.reminder.time.toString()).join(",");
}

test("matrix", (): void => {
  const combos: Array<[string, boolean, boolean, boolean]> = [];
  for (const ce of [true, false])
    for (const fb of [true, false])
      for (const st of [false, true])
        combos.push([
          `ce=${ce ? "1" : "0"} fb=${fb ? "1" : "0"} st=${st ? "1" : "0"}`,
          ce,
          fb,
          st,
        ]);

  const header = [
    "specimen".padEnd(15),
    ...combos.map((c) => c[0].padEnd(17)),
  ].join("| ");
  const rows = [header, "-".repeat(header.length)];
  for (const [name, md] of SPECIMEN) {
    rows.push(
      [
        name.padEnd(15),
        ...combos.map(([, ce, fb, st]) => run(ce, fb, st, md).padEnd(17)),
      ].join("| "),
    );
  }
  console.debug("\n" + rows.join("\n") + "\n");
  expect(true).toBe(true);
});
